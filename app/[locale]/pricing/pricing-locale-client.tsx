'use client'

import { useState } from 'react'
import Link from 'next/link'

async function startPayment(type: 'subscription' | 'credits', opts: { plan?: string; packId?: string }) {
  const res = await fetch('/api/payment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type, ...opts }),
  })
  const data = await res.json() as { approveUrl?: string; error?: string }
  if (data.approveUrl) {
    window.location.href = data.approveUrl
  } else {
    alert(data.error || 'Payment service temporarily unavailable, please try again later')
  }
}

interface Plan {
  id: string
  name: string
  price: string
  period: string
  desc: string
  cta: string
  highlight: boolean
  features: string[]
}

interface Pack {
  id: string
  name: string
  credits: number
  price: string
  unitPrice: string
  highlight: boolean
}

interface Faq {
  q: string
  a: string
}

interface PricingMessages {
  tabSubscription: string
  tabCredits: string
  popularBadge: string
  bestValueBadge: string
  subscriptionNote: string
  creditsNote: string
  creditsBanner: string
  creditsUnit: string
  faqTitle: string
  buyButton: string
  redirecting: string
  plans: Plan[]
  packs: Pack[]
  faqs: Faq[]
}

export default function PricingLocaleClient({ messages: m, locale }: { messages: PricingMessages; locale: string }) {
  const [tab, setTab] = useState<'subscription' | 'credits'>('subscription')
  const [loading, setLoading] = useState<string | null>(null)

  const handlePay = async (type: 'subscription' | 'credits', opts: { plan?: string; packId?: string }, id: string) => {
    setLoading(id)
    await startPayment(type, opts)
    setLoading(null)
  }

  return (
    <>
      {/* Tab switcher */}
      <div className="flex justify-center mb-10">
        <div
          className="inline-flex rounded-xl p-1 gap-1"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <button
            onClick={() => setTab('subscription')}
            className="px-6 py-2 rounded-lg text-sm font-medium transition"
            style={{
              background: tab === 'subscription' ? 'linear-gradient(135deg, #7c3aed, #4f46e5)' : 'transparent',
              color: tab === 'subscription' ? 'white' : 'rgba(255,255,255,0.4)',
            }}
          >
            {m.tabSubscription}
          </button>
          <button
            onClick={() => setTab('credits')}
            className="px-6 py-2 rounded-lg text-sm font-medium transition"
            style={{
              background: tab === 'credits' ? 'linear-gradient(135deg, #7c3aed, #4f46e5)' : 'transparent',
              color: tab === 'credits' ? 'white' : 'rgba(255,255,255,0.4)',
            }}
          >
            {m.tabCredits}
          </button>
        </div>
      </div>

      {/* Subscription Plans */}
      {tab === 'subscription' && (
        <section className="max-w-5xl mx-auto px-6 pb-16">
          <div className="grid md:grid-cols-3 gap-6">
            {m.plans.map((plan) => (
              <div
                key={plan.id}
                className="rounded-3xl border p-7 relative flex flex-col"
                style={{
                  background: plan.highlight
                    ? 'linear-gradient(145deg, rgba(124,58,237,0.1), rgba(79,70,229,0.06))'
                    : 'rgba(255,255,255,0.02)',
                  borderColor: plan.highlight ? 'rgba(124,58,237,0.4)' : 'rgba(255,255,255,0.08)',
                  boxShadow: plan.highlight ? '0 0 40px rgba(124,58,237,0.12)' : 'none',
                }}
              >
                {plan.highlight && (
                  <div
                    className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-xs px-3 py-1 rounded-full font-medium text-violet-300 whitespace-nowrap"
                    style={{ background: 'rgba(124,58,237,0.35)', border: '1px solid rgba(124,58,237,0.5)' }}
                  >
                    {m.popularBadge}
                  </div>
                )}
                <div className="mb-5">
                  <p className="text-base font-bold text-white/80 mb-1">{plan.name}</p>
                  <p className="text-xs text-white/30 mb-4">{plan.desc}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-white/90">{plan.price}</span>
                    <span className="text-sm text-white/30">{plan.period}</span>
                  </div>
                </div>
                <ul className="space-y-2.5 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-white/50">
                      <span className="text-violet-400 text-xs flex-shrink-0">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => {
                    if (plan.id === 'free') { window.location.href = `/${locale}`; return }
                    if (plan.id === 'business') { window.location.href = 'mailto:support@imagebackgrounderaser.shop'; return }
                    handlePay('subscription', { plan: plan.id }, `sub_${plan.id}`)
                  }}
                  disabled={loading === `sub_${plan.id}`}
                  className="block w-full py-3 rounded-xl text-sm font-medium text-center transition"
                  style={{
                    background: plan.highlight ? 'linear-gradient(135deg, #7c3aed, #4f46e5)' : 'rgba(255,255,255,0.06)',
                    color: 'white',
                    boxShadow: plan.highlight ? '0 4px 20px rgba(124,58,237,0.3)' : 'none',
                    opacity: loading === `sub_${plan.id}` ? 0.6 : 1,
                    cursor: loading === `sub_${plan.id}` ? 'wait' : 'pointer',
                  }}
                >
                  {loading === `sub_${plan.id}` ? m.redirecting : plan.cta}
                </button>
              </div>
            ))}
          </div>
          <p className="text-center text-white/20 text-xs mt-6">{m.subscriptionNote}</p>
        </section>
      )}

      {/* Credit Packs */}
      {tab === 'credits' && (
        <section className="max-w-4xl mx-auto px-6 pb-16">
          <div
            className="rounded-2xl border border-violet-500/20 px-5 py-3 text-sm text-violet-300 text-center mb-8"
            style={{ background: 'rgba(124,58,237,0.07)' }}
          >
            {m.creditsBanner}
          </div>
          <div className="grid md:grid-cols-4 gap-5">
            {m.packs.map((pack) => (
              <div
                key={pack.id}
                className="rounded-3xl border p-6 relative flex flex-col"
                style={{
                  background: pack.highlight
                    ? 'linear-gradient(145deg, rgba(124,58,237,0.1), rgba(79,70,229,0.06))'
                    : 'rgba(255,255,255,0.02)',
                  borderColor: pack.highlight ? 'rgba(124,58,237,0.4)' : 'rgba(255,255,255,0.08)',
                  boxShadow: pack.highlight ? '0 0 40px rgba(124,58,237,0.12)' : 'none',
                }}
              >
                {pack.highlight && (
                  <div
                    className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-xs px-3 py-1 rounded-full font-medium text-violet-300 whitespace-nowrap"
                    style={{ background: 'rgba(124,58,237,0.35)', border: '1px solid rgba(124,58,237,0.5)' }}
                  >
                    {m.bestValueBadge}
                  </div>
                )}
                <p className="text-sm font-semibold text-white/80 mb-1">{pack.name}</p>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-3xl font-bold text-white/90">{pack.price}</span>
                </div>
                <p className="text-xs text-white/30 mb-4">{pack.unitPrice}</p>
                <div
                  className="rounded-xl py-2 text-center mb-5 flex-1 flex items-center justify-center"
                  style={{ background: 'rgba(124,58,237,0.1)' }}
                >
                  <span className="text-2xl font-bold text-violet-300">{pack.credits}</span>
                  <span className="text-xs text-white/40 ml-1.5">{m.creditsUnit}</span>
                </div>
                <button
                  className="w-full py-2.5 rounded-xl text-sm font-medium transition"
                  style={{
                    background: pack.highlight ? 'linear-gradient(135deg, #7c3aed, #4f46e5)' : 'rgba(255,255,255,0.06)',
                    color: 'white',
                    boxShadow: pack.highlight ? '0 4px 20px rgba(124,58,237,0.3)' : 'none',
                    opacity: loading === `pack_${pack.id}` ? 0.6 : 1,
                    cursor: loading === `pack_${pack.id}` ? 'wait' : 'pointer',
                  }}
                  disabled={loading === `pack_${pack.id}`}
                  onClick={() => handlePay('credits', { packId: pack.id }, `pack_${pack.id}`)}
                >
                  {loading === `pack_${pack.id}` ? m.redirecting : m.buyButton}
                </button>
              </div>
            ))}
          </div>
          <p className="text-center text-white/20 text-xs mt-6">{m.creditsNote}</p>
        </section>
      )}

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-6 pb-24">
        <h2 className="text-2xl font-bold text-white/90 text-center mb-10">{m.faqTitle}</h2>
        <div className="space-y-4">
          {m.faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-2xl border border-white/5 p-6"
              style={{ background: 'rgba(255,255,255,0.02)' }}
            >
              <p className="font-semibold text-white/80 text-sm mb-2">{faq.q}</p>
              <p className="text-white/40 text-sm leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
