import Link from 'next/link'
import PricingClient from './pricing-client'

export const runtime = 'edge'

export default function PricingPage() {
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
      </section>

      {/* Interactive tab + plans (client component) */}
      <PricingClient />

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
