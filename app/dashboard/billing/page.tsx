'use client'

import { useSession } from 'next-auth/react'

export const runtime = 'edge'

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    features: [
      '10 images / month',
      'Full-resolution output',
      'Browser-based (100% private)',
      'PNG download',
    ],
    cta: 'Current Plan',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '$5',
    period: 'per month',
    features: [
      '500 images / month',
      'Full-resolution output',
      'Browser-based (100% private)',
      'PNG download',
      'History (persistent)',
      'Priority support',
    ],
    cta: 'Upgrade to Pro',
    highlight: true,
  },
]

export default function BillingPage() {
  const { data: session } = useSession()
  const currentPlan = 'free'

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white/90">Billing & Plans</h1>
        <p className="text-white/30 text-sm mt-1">Manage your subscription.</p>
      </div>

      {/* Current plan summary */}
      <div
        className="rounded-2xl border border-white/8 p-5 mb-8 flex items-center gap-4"
        style={{ background: 'rgba(255,255,255,0.02)' }}
      >
        <div>
          <p className="text-xs text-white/30 uppercase tracking-widest mb-1">Current Plan</p>
          <p className="text-lg font-semibold text-white/90 capitalize">{currentPlan}</p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-xs text-white/30">Renews</p>
          <p className="text-sm text-white/60">Apr 1, 2026</p>
        </div>
      </div>

      {/* Plan cards */}
      <div className="grid grid-cols-2 gap-5">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className="rounded-2xl border p-6 relative"
            style={{
              background: plan.highlight
                ? 'rgba(124,58,237,0.06)'
                : 'rgba(255,255,255,0.02)',
              borderColor: plan.highlight
                ? 'rgba(124,58,237,0.3)'
                : 'rgba(255,255,255,0.08)',
            }}
          >
            {plan.highlight && (
              <div
                className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs px-3 py-1 rounded-full font-medium text-violet-300"
                style={{ background: 'rgba(124,58,237,0.3)', border: '1px solid rgba(124,58,237,0.4)' }}
              >
                ✦ Most Popular
              </div>
            )}
            <p className="text-base font-semibold text-white/80 mb-1">{plan.name}</p>
            <p className="text-3xl font-bold text-white/90 mb-0.5">
              {plan.price}
              <span className="text-sm font-normal text-white/30 ml-1">/{plan.period}</span>
            </p>
            <ul className="mt-4 space-y-2 mb-6">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-white/50">
                  <span className="text-violet-400 text-xs">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <button
              disabled={plan.name.toLowerCase() === currentPlan}
              className="w-full py-2.5 rounded-xl text-sm font-medium transition"
              style={{
                background: plan.highlight
                  ? 'linear-gradient(135deg, #7c3aed, #4f46e5)'
                  : 'rgba(255,255,255,0.05)',
                color: plan.name.toLowerCase() === currentPlan
                  ? 'rgba(255,255,255,0.25)'
                  : 'white',
                cursor: plan.name.toLowerCase() === currentPlan ? 'default' : 'pointer',
              }}
            >
              {plan.name.toLowerCase() === currentPlan ? '✓ ' : ''}{plan.cta}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
