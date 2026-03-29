import { auth } from '@/auth'
import { NextRequest, NextResponse } from 'next/server'
import { d1Query, PLAN_LIMITS, CREDIT_PACKS } from '@/lib/d1'

export const runtime = 'edge'

/**
 * PayPal Payment Integration
 *
 * POST /api/payment/create  — create order
 * POST /api/payment/capture — capture after user approves
 *
 * Required env vars (add to Cloudflare Pages):
 *   PAYPAL_CLIENT_ID
 *   PAYPAL_CLIENT_SECRET
 *   PAYPAL_MODE  (sandbox | live)
 */

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
  const data = await res.json() as { access_token: string }
  return data.access_token
}

// POST /api/payment/create
export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json() as {
    type: 'subscription' | 'credits'
    plan?: string       // 'pro' | 'business'
    packId?: string     // credit pack id
  }

  let amountUsd: number
  let description: string
  let creditsToGrant = 0
  let planToSet: string | null = null

  if (body.type === 'credits') {
    const pack = CREDIT_PACKS.find(p => p.id === body.packId)
    if (!pack) return NextResponse.json({ error: 'Invalid pack' }, { status: 400 })
    amountUsd = pack.priceUsd
    description = `BgRemover ${pack.name} (${pack.credits} credits)`
    creditsToGrant = pack.credits
  } else if (body.type === 'subscription') {
    const limits = PLAN_LIMITS[body.plan ?? '']
    if (!limits || body.plan === 'free') {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }
    const prices: Record<string, number> = { pro: 4.9, business: 19.9 }
    amountUsd = prices[body.plan!]
    description = `BgRemover ${body.plan} subscription (1 month)`
    planToSet = body.plan!
  } else {
    return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
  }

  // Create internal order record
  const orderId = `ord_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
  await d1Query(
    `INSERT INTO orders (id, user_id, gateway, type, plan, credits, amount_usd, status, created_at)
     VALUES (?, ?, 'paypal', ?, ?, ?, ?, 'pending', ?)`,
    [orderId, session.user.id, body.type, planToSet, creditsToGrant, amountUsd, new Date().toISOString()]
  )

  // Create PayPal order
  const token = await getPayPalToken()
  const ppRes = await fetch(`${PAYPAL_BASE()}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
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
        return_url: `${process.env.NEXTAUTH_URL}/api/payment/capture?order=${orderId}`,
        cancel_url: `${process.env.NEXTAUTH_URL}/pricing`,
      },
    }),
  })

  const ppOrder = await ppRes.json() as {
    id: string
    links: Array<{ rel: string; href: string }>
  }

  // Save PayPal order id
  await d1Query(
    'UPDATE orders SET gateway_order_id = ? WHERE id = ?',
    [ppOrder.id, orderId]
  )

  const approveUrl = ppOrder.links.find(l => l.rel === 'approve')?.href
  return NextResponse.json({ orderId, approveUrl, paypalOrderId: ppOrder.id })
}

// GET /api/payment/capture?order=xxx  (redirect from PayPal)
export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const orderId = url.searchParams.get('order')
  const paypalOrderId = url.searchParams.get('token') // PayPal appends ?token=

  if (!orderId || !paypalOrderId) {
    return NextResponse.redirect(new URL('/pricing?error=missing_params', req.url))
  }

  // Load order
  const orderRes = await d1Query(
    'SELECT * FROM orders WHERE id = ? AND gateway_order_id = ?',
    [orderId, paypalOrderId]
  )
  const order = orderRes.result?.[0]?.results?.[0]
  if (!order || order.status !== 'pending') {
    return NextResponse.redirect(new URL('/pricing?error=invalid_order', req.url))
  }

  // Capture PayPal payment
  const token = await getPayPalToken()
  const captureRes = await fetch(`${PAYPAL_BASE()}/v2/checkout/orders/${paypalOrderId}/capture`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })
  const capture = await captureRes.json() as { status: string }

  if (capture.status !== 'COMPLETED') {
    await d1Query('UPDATE orders SET status = ? WHERE id = ?', ['failed', orderId])
    return NextResponse.redirect(new URL('/pricing?error=payment_failed', req.url))
  }

  // Mark order paid
  await d1Query(
    'UPDATE orders SET status = ?, paid_at = ? WHERE id = ?',
    ['paid', new Date().toISOString(), orderId]
  )

  // Grant credits or subscription
  const userId = order.user_id as string
  if (order.type === 'credits') {
    await d1Query(
      'UPDATE users SET credits_balance = credits_balance + ? WHERE google_id = ?',
      [order.credits, userId]
    )
  } else if (order.type === 'subscription') {
    const plan = order.plan as string
    const limits = PLAN_LIMITS[plan]
    // Extend subscription by 1 month from now (or from current expiry if still active)
    const expiresAt = new Date()
    expiresAt.setMonth(expiresAt.getMonth() + 1)
    await d1Query(
      `UPDATE users SET plan = ?, credits_limit = ?, plan_expires_at = ? WHERE google_id = ?`,
      [plan, limits.monthly, expiresAt.toISOString(), userId]
    )
  }

  return NextResponse.redirect(new URL('/dashboard?payment=success', req.url))
}
