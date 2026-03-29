'use client'

import { useState } from 'react'
import Link from 'next/link'

const subscriptionPlans = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    period: 'forever',
    desc: '适合偶尔使用',
    features: [
      '10 次 / 月',
      '文件 ≤ 5MB',
      '输出最高 1080p',
      '浏览器本地处理（完全私密）',
      'PNG 下载',
    ],
    cta: '免费开始',
    ctaHref: '/',
    highlight: false,
    current: true,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$4.9',
    period: '/ 月',
    desc: '适合创作者和自由职业者',
    features: [
      '200 次 / 月',
      '文件 ≤ 25MB',
      '原图分辨率输出',
      '浏览器本地处理（完全私密）',
      'PNG 下载',
      '批量处理（10张/批）',
      '历史记录',
      '优先支持',
    ],
    cta: '升级 Pro',
    ctaHref: '/dashboard/billing',
    highlight: true,
    current: false,
  },
  {
    id: 'business',
    name: 'Business',
    price: '$19.9',
    period: '/ 月',
    desc: '适合团队和高频用户',
    features: [
      '2,000 次 / 月',
      '文件 ≤ 50MB',
      '原图分辨率输出',
      '浏览器本地处理（完全私密）',
      'PNG 下载',
      '批量处理（50张/批）',
      '历史记录',
      'API 访问',
      '优先支持',
    ],
    cta: '联系销售',
    ctaHref: 'mailto:support@imagebackgrounderaser.shop',
    highlight: false,
    current: false,
  },
]

const creditPacks = [
  {
    id: 'starter',
    name: '入门包',
    credits: 20,
    price: '$1.9',
    unitPrice: '$0.095/次',
    highlight: false,
  },
  {
    id: 'standard',
    name: '标准包',
    credits: 60,
    price: '$4.9',
    unitPrice: '$0.082/次',
    highlight: false,
  },
  {
    id: 'value',
    name: '超值包',
    credits: 150,
    price: '$9.9',
    unitPrice: '$0.066/次',
    highlight: true,
  },
  {
    id: 'professional',
    name: '专业包',
    credits: 400,
    price: '$19.9',
    unitPrice: '$0.050/次',
    highlight: false,
  },
]

const faqs = [
  {
    q: '积分包和订阅有什么区别？',
    a: '订阅按月计费，额度每月重置；积分包一次性购买，永不过期。两者可叠加使用——订阅额度用完后自动消耗积分包，不会被硬卡住。',
  },
  {
    q: '我的图片会上传到服务器吗？',
    a: '不会。所有 AI 处理完全在你的浏览器本地运行（WebAssembly + ONNX Runtime），图片从不离开你的设备。',
  },
  {
    q: '积分包真的永不过期吗？',
    a: '是的，积分包余额永久有效，不受月度重置影响。这是积分包相比订阅的核心优势。',
  },
  {
    q: '可以随时取消订阅吗？',
    a: '可以，随时取消，无违约金。取消后当前计费周期内仍可正常使用，到期后自动降回 Free。',
  },
  {
    q: 'API 访问是什么？',
    a: 'Business 订阅用户可通过 REST API 批量调用背景移除功能，适合集成到自己的产品或工作流中。',
  },
  {
    q: '支持退款吗？',
    a: '支持 7 天无理由退款。如有问题请联系 support@imagebackgrounderaser.shop，我们会在 24 小时内处理。',
  },
]

export const runtime = 'edge'

export default function PricingPage() {
  const [tab, setTab] = useState<'subscription' | 'credits'>('subscription')

  return (
    <div className="min-h-screen text-white" style={{ background: '#0d0f14' }}>
      {/* Navigation */}
      <nav className="border-b border-white/5 px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}
          >
            B
          </div>
          <span className="font-semibold text-white/80 text-sm tracking-wide">BgRemover</span>
        </Link>
        <div className="flex items-center gap-8 text-sm">
          <span className="text-white/40 hover:text-white/70 cursor-pointer transition">Features</span>
          <Link href="/pricing" className="text-violet-400 font-medium">Pricing</Link>
          <span className="text-white/40 hover:text-white/70 cursor-pointer transition">Docs</span>
          <Link
            href="/dashboard"
            className="px-4 py-1.5 rounded-full text-xs font-medium border border-white/10 text-white/60 hover:border-white/20 hover:text-white/80 transition"
          >
            Dashboard
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="text-center pt-20 pb-10 px-6">
        <div
          className="inline-block text-xs font-medium px-3 py-1 rounded-full border border-violet-500/30 text-violet-400 mb-6"
          style={{ background: 'rgba(124,58,237,0.08)' }}
        >
          ✦ 透明定价，无隐藏费用
        </div>
        <h1 className="text-5xl font-bold leading-tight mb-4">
          <span
            style={{
              background: 'linear-gradient(to right, #c4b5fd, #818cf8, #6366f1)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            选择你的方案
          </span>
        </h1>
        <p className="text-white/40 text-lg max-w-xl mx-auto mb-10">
          订阅适合高频用户，积分包适合低频或临时需求。两者可叠加。
        </p>

        {/* Tab switcher */}
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
            订阅制
          </button>
          <button
            onClick={() => setTab('credits')}
            className="px-6 py-2 rounded-lg text-sm font-medium transition"
            style={{
              background: tab === 'credits' ? 'linear-gradient(135deg, #7c3aed, #4f46e5)' : 'transparent',
              color: tab === 'credits' ? 'white' : 'rgba(255,255,255,0.4)',
            }}
          >
            积分包
          </button>
        </div>
      </section>

      {/* Subscription Plans */}
      {tab === 'subscription' && (
        <section className="max-w-5xl mx-auto px-6 pb-16">
          <div className="grid md:grid-cols-3 gap-6">
            {subscriptionPlans.map((plan) => (
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
                    ✦ 最受欢迎
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
                <a
                  href={plan.ctaHref}
                  className="block w-full py-3 rounded-xl text-sm font-medium text-center transition"
                  style={{
                    background: plan.highlight ? 'linear-gradient(135deg, #7c3aed, #4f46e5)' : 'rgba(255,255,255,0.06)',
                    color: 'white',
                    boxShadow: plan.highlight ? '0 4px 20px rgba(124,58,237)' : 'none',
                  }}
                >
                  {plan.cta}
                </a>
              </div>
            ))}
          </div>
          <p className="text-center text-white/20 text-xs mt-6">
            所有订阅均可随时取消 · 到期自动降回 Free · 支持积分包叠加
          </p>
        </section>
      )}

      {/* Credit Packs */}
      {tab === 'credits' && (
        <section className="max-w-4xl mx-auto px-6 pb-16">
          <div
            className="rounded-2xl border border-violet-500/20 px-5 py-3 text-sm text-violet-300 text-center mb-8"
            style={{ background: 'rgba(124,58,237,0.07)' }}
          >
            ✦ 积分永不过期 · 与订阅叠加使用 · 文件大小/分辨率与 Pro 相同
          </div>
          <div className="grid md:grid-cols-4 gap-5">
            {creditPacks.map((pack) => (
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
                    ✦ 最超值
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
                  <span className="text-xs text-white/40 ml-1.5">次</span>
                </div>
                <button
                  className="w-full py-2.5 rounded-xl text-sm font-medium transition"
                  style={{
                    background: pack.highlight ? 'linear-gradient(135deg, #7c3aed, #4f46e5)' : 'rgba(255,255,255,0.06)',
                    color: 'white',
                    boxShadow: pack.highlight ? '0 4px 20px rgba(124,58,237,0.3)' : 'none',
                  }}
                  onClick={() => {
                    // PayPal checkout — will be wired when PAYPAL_CLIENT_ID is set
                    window.location.href = `/api/payment?action=create&type=credits&packId=${pack.id}`
                  }}
                >
                  购买
                </button>
              </div>
            ))}
          </div>
          <p className="text-center text-white/20 text-xs mt-6">
            积分永不过期 · 可与订阅叠加 · 订阅额度优先消耗
          </p>
        </section>
      )}

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-6 pb-24">
        <h2 className="text-2xl font-bold text-white/90 text-center mb-10">常见问题</h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
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

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 text-center">
        <p className="text-white/20 text-xs">
          © 2026 BgRemover ·{' '}
          <a href="mailto:support@imagebackgrounderaser.shop" className="hover:text-white/40 transition">
            support@imagebackgrounderaser.shop
          </a>
        </p>
      </footer>
    </div>
  )
}
