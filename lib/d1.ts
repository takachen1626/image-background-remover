// Shared D1 query helper for edge runtime
export async function d1Query(sql: string, params: unknown[] = []) {
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
      body: JSON.stringify({ sql, params }),
    }
  )
  const data = await res.json() as {
    success: boolean
    result: Array<{ results: Array<Record<string, unknown>> }>
    errors: Array<{ message: string }>
  }
  return data
}

// Subscription plan limits
export const PLAN_LIMITS: Record<string, {
  monthly: number
  maxFileSizeMB: number
  maxResolution: number
  batchSize: number
  apiAccess: boolean
}> = {
  free:     { monthly: 10,   maxFileSizeMB: 5,  maxResolution: 1080,  batchSize: 0,  apiAccess: false },
  pro:      { monthly: 200,  maxFileSizeMB: 25, maxResolution: 99999, batchSize: 10, apiAccess: false },
  business: { monthly: 2000, maxFileSizeMB: 50, maxResolution: 99999, batchSize: 50, apiAccess: true  },
}

// Credit pack definitions (for reference / pricing page)
export const CREDIT_PACKS = [
  { id: 'starter',      name: '入门包', credits: 20,  priceUsd: 1.9,  highlight: false },
  { id: 'standard',     name: '标准包', credits: 60,  priceUsd: 4.9,  highlight: false },
  { id: 'value',        name: '超值包', credits: 150, priceUsd: 9.9,  highlight: true  },
  { id: 'professional', name: '专业包', credits: 400, priceUsd: 19.9, highlight: false },
]

// Credit pack limits (same as Pro for file size/resolution)
export const CREDIT_PACK_LIMITS = {
  maxFileSizeMB: 25,
  maxResolution: 99999,
}

export const GUEST_DAILY_LIMIT = 3
