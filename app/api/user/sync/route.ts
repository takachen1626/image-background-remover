import { auth } from '@/auth'
import { NextResponse } from 'next/server'

export const runtime = 'edge'

async function d1Query(accountId: string, databaseId: string, apiToken: string, sql: string, params: unknown[]) {
  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/query`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sql, params }),
    }
  )
  return res.json() as Promise<{ success: boolean; result: Array<{ results: unknown[] }> }>
}

export async function POST() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const accountId = process.env.CF_ACCOUNT_ID!
  const databaseId = process.env.CF_D1_DATABASE_ID!
  const apiToken = process.env.CF_API_TOKEN!
  const now = new Date().toISOString()
  const { id, email, name, image } = session.user

  try {
    // Check if user exists
    const check = await d1Query(accountId, databaseId, apiToken,
      'SELECT id FROM users WHERE google_id = ?', [id])

    if (check.success && check.result?.[0]?.results?.length) {
      // Update last_login
      await d1Query(accountId, databaseId, apiToken,
        'UPDATE users SET last_login = ?, name = ?, picture = ? WHERE google_id = ?',
        [now, name ?? '', image ?? '', id])
    } else {
      // Insert new user
      await d1Query(accountId, databaseId, apiToken,
        `INSERT INTO users (google_id, email, name, picture, plan, credits_used, credits_limit, created_at, last_login)
         VALUES (?, ?, ?, ?, 'free', 0, 10, ?, ?)`,
        [id, email ?? '', name ?? '', image ?? '', now, now])
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('D1 sync failed:', e)
    return NextResponse.json({ error: 'DB error' }, { status: 500 })
  }
}
