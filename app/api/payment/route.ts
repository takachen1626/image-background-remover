import { auth } from '@/auth'
import { NextRequest, NextResponse } from 'next/server'
import { d1Query, PLAN_LIMITS, CREDIT_PACKS } from '@/lib/d1'

export const runtime = 'edge'

const PAYPAL_BASE = () =>
  process.env.PAYPAL_MODE === 'live'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com'

async function getPayPalToken(): Promise<string> {
  const clientId = process.env.PAYPAL_CLIENT_ID!
  const secret = process.env.PAYPAL_CLIENT_SECRET!
  const res = await fetch(`${PAYPAL_BASE()}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${btoa(`${clientId}:${secret}`)}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  })
  const data = await res.json() as { access_token: string; error?: string }
  if (!data.access_token) throw new Error(`PayPal token error: ${JSON.stringify(data)}`)
  return data.access_token
}

// POST /api/payment — create PayPal order, return approveUrl
export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json() as {
    type: 'subscription' | 'credits'
    plan?: string    // 'pro' | 'business'
    packId?: string  // credit pack id
  }

  let amountUsd: number
  let description: string
  let creditsToGrant = 0
  let planToSet: string | null = null

  if (body.type === 'credits') {
    const pack = CREDIT_PACKS.find(p => p.id === body.packId)
    if (!pack) return NextResponse.json({ error: 'Invalid pack' }, { status: 400 })
    amountUsd = pack.priceUsd
    description = `BgRemover ${pack.name} (${pack.credits} credits, never expire)`
    creditsToGrant = pack.credits
  } else if (body.type === 'subscription') {
    if (!body.plan || !PLAN_LIMITS[body.plan] || body.plan === 'free') {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }
    const prices: Record<string, number> = { pro: 4.9, business: 19.9 }
    amountUsd = prices[body.plan]
    description = `BgRemover ${body.plan} subscription (1 month)`
    planToSet = body.plan
  } else {
    return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
  }

  // Create internal order
  const orderId = `ord_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
  await d1Query(
    `INSERT INTO orders (id, user_id, gateway, type, plan, credits, amount_usd, status, created_at)
     VALUES (?, ?, 'paypal', ?, ?, ?, ?, 'pending', ?)`,
    [orderId, session.user.id, body.type, planToSet, creditsToGrant, amountUsd, new Date().toISOString()]
  )

  // Create PayPal order
  let token: string
  try {
    token = await getPayPalToken()
  } catch (e) {
    console.error('PayPal token error:', e)
    return NextResponse.json({ error: 'Payment service unavailable' }, { status: 503 })
  }

  const baseUrl = process.env.NEXTAUTH_URL || 'https://imagebackgrounderaser.shop'
  const ppRes = await fetch(`${PAYPAL_BASE()}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'PayPal-Request-Id': orderId,
    },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [{
        reference_id: orderId,
        description,
        amount: {
          currency_code: 'USD',
          value: amountUsd.toFixed(2),
        },
      }],
      application_context: {
        brand_name: 'BgRemover',
        landing_page: 'NO_PREFERENCE',
        user_action: 'PAY_NOW',
        return_url: `${baseUrl}/api/payment/capture?order=${orderId}`,
        cancel_url: `${baseUrl}/pricing?cancelled=1`,
      },
    }),
  })

  const ppOrder = await ppRes.json() as {
    id: string
    status: string
    links: Array<{ rel: string; href: string; method: string }>
    details?: Array<{ issue: string; description: string }>
  }

  if (!ppOrder.id) {
    console.error('PayPal order creation failed:', JSON.stringify(ppOrder))
    return NextResponse.json({ error: 'Failed to create payment order', detail: ppOrder.details }, { status: 500 })
  }

  // Save PayPal order id
  await d1Query(
    'UPDATE orders SET gateway_order_id = ? WHERE id = ?',
    [ppOrder.id, orderId]
  )

  const approveUrl = ppOrder.links.find(l => l.rel === 'approve')?.href
  return NextResponse.json({ orderId, approveUrl, paypalOrderId: ppOrder.id })
}
