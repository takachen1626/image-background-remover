'use client'

import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export const runtime = 'edge'

interface UserStats {
  credits_used: number
  credits_limit: number
  plan: string
  created_at?: number
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const [stats, setStats] = useState<UserStats>({ credits_used: 0, credits_limit: 10, plan: 'free' })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!session) return

    // Sync user to D1 on first load
    fetch('/api/user/sync', { method: 'POST' }).catch(() => {})

    // Fetch real stats from D1
    fetch('/api/user/stats')
      .then((r) => r.json())
      .then((data) => setStats(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [session])

  const { credits_used, credits_limit, plan, created_at } = stats
  const pct = Math.round((credits_used / credits_limit) * 100)
  const memberSince = created_at
    ? new Date(created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : '—'

  const statCards = [
    { label: 'Images Processed', value: loading ? '…' : credits_used, suffix: loading ? '' : `/ ${credits_limit}` },
    { label: 'Plan', value: loading ? '…' : plan === 'free' ? 'Free' : 'Pro', suffix: '' },
    { label: 'Member Since', value: memberSince, suffix: '' },
  ]

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white/90">
          Welcome back, {session?.user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-white/30 text-sm mt-1">Here's your account overview.</p>
      </div>

      {/* Profile card */}
      <div
        className="rounded-2xl border border-white/8 p-6 mb-6 flex items-center gap-5"
        style={{ background: 'rgba(255,255,255,0.02)' }}
      >
        {session?.user?.image ? (
          <Image
            src={session.user.image}
            alt="avatar"
            width={64}
            height={64}
            className="rounded-2xl"
          />
        ) : (
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}>
            {session?.user?.name?.[0]?.toUpperCase() ?? 'U'}
          </div>
        )}
        <div>
          <p className="text-lg font-semibold text-white/90">{session?.user?.name}</p>
          <p className="text-sm text-white/40">{session?.user?.email}</p>
          <div className="flex items-center gap-2 mt-2">
            <span
              className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{
                background: plan === 'pro' ? 'rgba(124,58,237,0.2)' : 'rgba(255,255,255,0.06)',
                color: plan === 'pro' ? '#c4b5fd' : 'rgba(255,255,255,0.4)',
              }}
            >
              {plan === 'pro' ? '✦ Pro' : 'Free Plan'}
            </span>
            <span className="text-xs text-white/20">via Google</span>
          </div>
        </div>
        {plan === 'free' && (
          <Link
            href="/dashboard/billing"
            className="ml-auto px-4 py-2 rounded-xl text-sm font-medium text-white transition"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}
          >
            Upgrade to Pro
          </Link>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {statCards.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-white/8 p-5"
            style={{ background: 'rgba(255,255,255,0.02)' }}
          >
            <p className="text-xs text-white/30 uppercase tracking-widest mb-2">{s.label}</p>
            <p className="text-2xl font-bold text-white/90">
              {s.value}
              {s.suffix && <span className="text-sm font-normal text-white/30 ml-1">{s.suffix}</span>}
            </p>
          </div>
        ))}
      </div>

      {/* Usage bar */}
      <div
        className="rounded-2xl border border-white/8 p-5 mb-6"
        style={{ background: 'rgba(255,255,255,0.02)' }}
      >
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-medium text-white/70">Monthly Usage</p>
          <p className="text-sm text-white/40">
            <span className="text-white/80 font-medium">{credits_used}</span> / {credits_limit} images
          </p>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${pct}%`,
              background: pct > 80
                ? 'linear-gradient(90deg, #dc2626, #ef4444)'
                : 'linear-gradient(90deg, #7c3aed, #4f46e5)',
            }}
          />
        </div>
        {pct > 80 && (
          <p className="text-xs text-red-400/70 mt-2">Running low — consider upgrading to Pro for 500 images/month.</p>
        )}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-4">
        <Link
          href="/"
          className="rounded-2xl border border-white/8 p-5 hover:border-violet-500/30 transition group"
          style={{ background: 'rgba(255,255,255,0.02)' }}
        >
          <p className="text-2xl mb-3">✦</p>
          <p className="font-semibold text-white/80 text-sm group-hover:text-white transition">Remove Background</p>
          <p className="text-xs text-white/30 mt-1">Go to the editor and process an image</p>
        </Link>
        <Link
          href="/dashboard/history"
          className="rounded-2xl border border-white/8 p-5 hover:border-violet-500/30 transition group"
          style={{ background: 'rgba(255,255,255,0.02)' }}
        >
          <p className="text-2xl mb-3">◷</p>
          <p className="font-semibold text-white/80 text-sm group-hover:text-white transition">View History</p>
          <p className="text-xs text-white/30 mt-1">Browse your recently processed images</p>
        </Link>
      </div>
    </div>
  )
}
