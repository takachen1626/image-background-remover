import { auth } from '@/auth'
import { NextRequest, NextResponse } from 'next/server'
import { d1Query, PLAN_LIMITS, CREDIT_PACK_LIMITS, GUEST_DAILY_LIMIT } from '@/lib/d1'

export const runtime = 'edge'

// GET /api/usage — check current usage & limits
export async function GET(req: NextRequest) {
  const session = await auth()

  // Guest user
  if (!session?.user?.id) {
    const ip = req.headers.get('cf-connecting-ip') ||
      req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown'
    const today = new Date().toISOString().slice(0, 10)

    const res = await d1Query(
      'SELECT count FROM guest_usage WHERE ip = ? AND date = ?', [ip, today]
    )
    const count = (res.result?.[0]?.results?.[0]?.count as number) ?? 0
    return NextResponse.json({
      type: 'guest',
      used: count,
      limit: GUEST_DAILY_LIMIT,
      remaining: Math.max(0, GUEST_DAILY_LIMIT - count),
      canProcess: count < GUEST_DAILY_LIMIT,
      maxFileSizeMB: 2,
      maxResolution: 720,
      watermark: false,
    })
  }

  // Logged-in user
  const res = await d1Query(
    `SELECT plan, credits_used, credits_limit, credits_balance, credits_reset_at, plan_expires_at
     FROM users WHERE google_id = ?`,
    [session.user.id]
  )
  const user = res.result?.[0]?.results?.[0]
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const now = new Date()
  const thisMonth = now.toISOString().slice(0, 7)

  // Check subscription expiry
  const planExpiresAt = user.plan_expires_at as string | null
  const isSubActive = !planExpiresAt || planExpiresAt >= now.toISOString()
  const effectivePlan = isSubActive ? (user.plan as string) || 'free' : 'free'
  const limits = PLAN_LIMITS[effectivePlan] || PLAN_LIMITS.free

  // Monthly reset
  const resetAt = user.credits_reset_at as string | null
  let creditsUsed = (user.credits_used as number) || 0
  if (!resetAt || resetAt < thisMonth) {
    await d1Query(
      'UPDATE users SET credits_used = 0, credits_reset_at = ? WHERE google_id = ?',
      [thisMonth, session.user.id]
    )
    creditsUsed = 0
  }

  const creditsLimit = (user.credits_limit as number) || limits.monthly
  const creditsBalance = (user.credits_balance as number) || 0
  const monthlyRemaining = Math.max(0, creditsLimit - creditsUsed)
  const canProcess = monthlyRemaining > 0 || creditsBalance > 0

  // Effective file/resolution limits: if has credit balance, use pack limits
  const effectiveFileSizeMB = creditsBalance > 0
    ? Math.max(limits.maxFileSizeMB, CREDIT_PACK_LIMITS.maxFileSizeMB)
    : limits.maxFileSizeMB
  const effectiveResolution = creditsBalance > 0
    ? Math.max(limits.maxResolution, CREDIT_PACK_LIMITS.maxResolution)
    : limits.maxResolution

  return NextResponse.json({
    type: 'user',
    plan: effectivePlan,
    monthly: { used: creditsUsed, limit: creditsLimit, remaining: monthlyRemaining },
    credits: { balance: creditsBalance },
    canProcess,
    maxFileSizeMB: effectiveFileSizeMB,
    maxResolution: effectiveResolution,
    watermark: false,
  })
}

// POST /api/usage — consume one credit after processing
export async function POST(req: NextRequest) {
  const session = await auth()

  // Guest
  if (!session?.user?.id) {
    const ip = req.headers.get('cf-connecting-ip') ||
      req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown'
    const today = new Date().toISOString().slice(0, 10)

    const check = await d1Query(
      'SELECT count FROM guest_usage WHERE ip = ? AND date = ?', [ip, today]
    )
    const count = (check.result?.[0]?.results?.[0]?.count as number) ?? 0
    if (count >= GUEST_DAILY_LIMIT) {
      return NextResponse.json({ error: 'limit_reached', type: 'guest' }, { status: 429 })
    }
    await d1Query(
      `INSERT INTO guest_usage (ip, date, count) VALUES (?, ?, 1)
       ON CONFLICT(ip, date) DO UPDATE SET count = count + 1`,
      [ip, today]
    )
    return NextResponse.json({ ok: true, remaining: GUEST_DAILY_LIMIT - count - 1 })
  }

  // Logged-in: dual-track consumption
  const res = await d1Query(
    `SELECT plan, credits_used, credits_limit, credits_balance, credits_reset_at, plan_expires_at
     FROM users WHERE google_id = ?`,
    [session.user.id]
  )
  const user = res.result?.[0]?.results?.[0]
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const now = new Date()
  const thisMonth = now.toISOString().slice(0, 7)
  const planExpiresAt = user.plan_expires_at as string | null
  const isSubActive = !planExpiresAt || planExpiresAt >= now.toISOString()
  const effectivePlan = isSubActive ? (user.plan as string) || 'free' : 'free'
  const limits = PLAN_LIMITS[effectivePlan] || PLAN_LIMITS.free

  const resetAt = user.credits_reset_at as string | null
  const creditsUsed = (!resetAt || resetAt < thisMonth) ? 0 : (user.credits_used as number) || 0
  const creditsLimit = (user.credits_limit as number) || limits.monthly
  const creditsBalance = (user.credits_balance as number) || 0
  const monthlyRemaining = Math.max(0, creditsLimit - creditsUsed)

  // Priority 1: consume monthly subscription credits
  if (monthlyRemaining > 0) {
    await d1Query(
      `UPDATE users SET
         credits_used = CASE WHEN credits_reset_at < ? OR credits_reset_at IS NULL THEN 1 ELSE credits_used + 1 END,
         credits_reset_at = ?
       WHERE google_id = ?`,
      [thisMonth, thisMonth, session.user.id]
    )
    return NextResponse.json({ ok: true, source: 'monthly', remaining_monthly: monthlyRemaining - 1 })
  }

  // Priority 2: consume credit pack balance
  if (creditsBalance > 0) {
    await d1Query(
      'UPDATE users SET credits_balance = credits_balance - 1 WHERE google_id = ?',
      [session.user.id]
    )
    return NextResponse.json({ ok: true, source: 'credits', remaining_balance: creditsBalance - 1 })
  }

  return NextResponse.json({ error: 'limit_reached', plan: effectivePlan, type: 'user' }, { status: 429 })
}
