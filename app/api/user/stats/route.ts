import { auth } from '@/auth'
import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const accountId = process.env.CF_ACCOUNT_ID!
    const databaseId = process.env.CF_D1_DATABASE_ID!
    const apiToken = process.env.CF_API_TOKEN!

    const res = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/query`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sql: 'SELECT credits_used, credits_limit, plan, created_at FROM users WHERE google_id = ?',
          params: [session.user.id],
        }),
      }
    )

    const data = await res.json() as {
      success: boolean
      result: Array<{ results: Array<Record<string, unknown>> }>
    }

    if (!data.success || !data.result?.[0]?.results?.length) {
      return NextResponse.json({ credits_used: 0, credits_limit: 10, plan: 'free' })
    }

    return NextResponse.json(data.result[0].results[0])
  } catch (e) {
    console.error('D1 query failed:', e)
    return NextResponse.json({ credits_used: 0, credits_limit: 10, plan: 'free' })
  }
}
