import { NextRequest, NextResponse } from 'next/server'
import { d1Query, PLAN_LIMITS } from '@/lib/d1'

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
  const data = await res.json() as { access_token: string }
  return data.access_token
}

// GET /api/payment/capture?order=xxx&token=PAYPAL_ORDER_ID
// PayPal redirects here after user approves payment
export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const orderId = url.searchParams.get('order')
  const paypalOrderId = url.searchParams.get('token') // PayPal appends ?token=

  const baseUrl = process.env.NEXTAUTH_URL || 'https://imagebackgrounderaser.shop'

  if (!orderId || !paypalOrderId) {
    return NextResponse.redirect(`${baseUrl}/pricing?error=missing_params`)
  }

  // Load internal order
  const orderRes = await d1Query(
    'SELECT * FROM orders WHERE id = ? AND gateway_order_id = ?',
    [orderId, paypalOrderId]
  )
  const order = orderRes.result?.[0]?.results?.[0]

  if (!order) {
    return NextResponse.redirect(`${baseUrl}/pricing?error=invalid_order`)
  }

  if (order.status === 'paid') {
    // Already processed (duplicate callback)
    return NextResponse.redirect(`${baseUrl}/dashboard?payment=success`)
  }

  if (order.status !== 'pending') {
    return NextResponse.redirect(`${baseUrl}/pricing?error=order_not_pending`)
  }

  // Capture PayPal payment
  let token: string
  try {
    token = await getPayPalToken()
  } catch {
    return NextResponse.redirect(`${baseUrl}/pricing?error=payment_service_unavailable`)
  }

  const captureRes = await fetch(`${PAYPAL_BASE()}/v2/checkout/orders/${paypalOrderId}/capture`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'PayPal-Request-Id': `capture_${orderId}`,
    },
  })
  const capture = await captureRes.json() as {
    status: string
    details?: Array<{ issue: string; description: string }>
  }

  if (capture.status !== 'COMPLETED') {
    await d1Query('UPDATE orders SET status = ? WHERE id = ?', ['failed', orderId])
    return NextResponse.redirect(`${baseUrl}/pricing?error=payment_failed`)
  }

  // Mark order paid
  await d1Query(
    'UPDATE orders SET status = ?, paid_at = ? WHERE id = ?',
    ['paid', new Date().toISOString(), orderId]
  )

  const userId = order.user_id as string

  // Grant credits or subscription
  if (order.type === 'credits') {
    const credits = order.credits as number
    await d1Query(
      'UPDATE users SET credits_balance = credits_balance + ? WHERE google_id = ?',
      [credits, userId]
    )
  } else if (order.type === 'subscription') {
    const plan = order.plan as string
    const limits = PLAN_LIMITS[plan]
    if (limits) {
      // Extend by 1 month from now
      const expiresAt = new Date()
      expiresAt.setMonth(expiresAt.getMonth() + 1)
      await d1Query(
        `UPDATE users SET plan = ?, credits_limit = ?, plan_expires_at = ?, credits_used = 0, credits_reset_at = ?
         WHERE google_id = ?`,
        [plan, limits.monthly, expiresAt.toISOString(), new Date().toISOString().slice(0, 7), userId]
      )
    }
  }

  return NextResponse.redirect(`${baseUrl}/dashboard?payment=success`)
}
