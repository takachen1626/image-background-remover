import Link from 'next/link'

export const runtime = 'edge'

const features = [
  {
    icon: '🔒',
    title: '完全私密，零上传',
    desc: '所有 AI 处理在你的浏览器本地完成，基于 WebAssembly + ONNX Runtime。图片从不离开你的设备，没有服务器，没有数据收集，没有隐私风险。',
    highlight: false,
  },
  {
    icon: '⚡',
    title: '极速处理',
    desc: '首次运行下载约 50MB 模型后，后续处理完全离线。无需等待上传、排队或服务器响应，处理速度取决于你的设备性能。',
    highlight: false,
  },
  {
    icon: '✦',
    title: '专业级抠图质量',
    desc: '采用最新 AI 模型，精准识别发丝、毛发、复杂边缘。人像、产品图、动物、植物均可完美处理，输出带透明通道的 PNG。',
    highlight: true,
  },
  {
    icon: '📁',
    title: '支持主流格式',
    desc: '支持 PNG、JPG、WEBP 等常见图片格式输入，统一输出为带透明背景的 PNG，可直接用于设计、电商、社交媒体。',
    highlight: false,
  },
  {
    icon: '🖼️',
    title: '原图分辨率保留',
    desc: 'Pro 及以上套餐支持原图分辨率输出，不压缩、不降质。Free 用户输出最高 1080p，满足日常使用。',
    highlight: false,
  },
  {
    icon: '📦',
    title: '批量处理',
    desc: 'Pro 支持每批 10 张，Business 支持每批 50 张，大幅提升工作效率，适合电商批量商品图处理场景。',
    highlight: false,
  },
  {
    icon: '🔗',
    title: 'API 接入',
    desc: 'Business 订阅用户可通过 REST API 将背景移除能力集成到自己的产品或工作流中，支持自动化批量处理。',
    highlight: false,
  },
  {
    icon: '📱',
    title: '全平台支持',
    desc: '基于浏览器运行，无需安装任何软件。Windows、macOS、Linux、iOS、Android 均可使用，Chrome / Safari / Firefox 全支持。',
    highlight: false,
  },
]

const useCases = [
  { title: '电商产品图', desc: '一键去除杂乱背景，快速生成白底/透明底商品图，提升转化率。', emoji: '🛍️' },
  { title: '人像证件照', desc: '精准识别发丝，轻松制作证件照、头像、社交媒体配图。', emoji: '👤' },
  { title: '设计素材', desc: '快速提取设计元素，无需 Photoshop，直接输出透明 PNG 供设计使用。', emoji: '🎨' },
  { title: '内容创作', desc: '博主、短视频创作者快速处理封面图、贴纸素材，提升内容质感。', emoji: '📸' },
]

export default function FeaturesPage() {
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
          <Link href="/features" className="text-violet-400 font-medium">Features</Link>
          <Link href="/pricing" className="text-white/40 hover:text-white/70 transition">Pricing</Link>
          <Link href="/docs" className="text-white/40 hover:text-white/70 transition">Docs</Link>
          <Link
            href="/dashboard"
            className="px-4 py-1.5 rounded-full text-xs font-medium border border-white/10 text-white/60 hover:border-white/20 hover:text-white/80 transition"
          >
            Dashboard
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="text-center pt-20 pb-16 px-6">
        <div
          className="inline-block text-xs font-medium px-3 py-1 rounded-full border border-violet-500/30 text-violet-400 mb-6"
          style={{ background: 'rgba(124,58,237,0.08)' }}
        >
          ✦ 本地 AI · 完全私密 · 无需注册
        </div>
        <h1 className="text-5xl font-bold leading-tight mb-4">
          <span
            style={{
              background: 'linear-gradient(to right, #c4b5fd, #818cf8, #6366f1)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            为什么选择 BgRemover
          </span>
        </h1>
        <p className="text-white/40 text-lg max-w-2xl mx-auto mb-10">
          不只是背景移除工具——完全本地运行的 AI，保护你的隐私，同时提供专业级质量。
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium text-white transition"
          style={{
            background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
            boxShadow: '0 4px 24px rgba(124,58,237,0.3)',
          }}
        >
          免费开始使用 →
        </Link>
      </section>

      {/* Features Grid */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <div
              key={i}
              className="rounded-2xl border p-6"
              style={{
                background: f.highlight
                  ? 'linear-gradient(145deg, rgba(124,58,237,0.1), rgba(79,70,229,0.06))'
                  : 'rgba(255,255,255,0.02)',
                borderColor: f.highlight ? 'rgba(124,58,237,0.3)' : 'rgba(255,255,255,0.06)',
                boxShadow: f.highlight ? '0 0 30px rgba(124,58,237,0.1)' : 'none',
              }}
            >
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="font-semibold text-white/85 text-sm mb-2">{f.title}</h3>
              <p className="text-white/35 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Use Cases */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <h2 className="text-2xl font-bold text-white/90 text-center mb-3">适用场景</h2>
        <p className="text-white/30 text-center text-sm mb-10">从个人创作到企业批量处理，一个工具搞定</p>
        <div className="grid md:grid-cols-4 gap-5">
          {useCases.map((u, i) => (
            <div
              key={i}
              className="rounded-2xl border border-white/5 p-5 text-center"
              style={{ background: 'rgba(255,255,255,0.02)' }}
            >
              <div className="text-3xl mb-3">{u.emoji}</div>
              <p className="font-semibold text-white/80 text-sm mb-2">{u.title}</p>
              <p className="text-white/30 text-xs leading-relaxed">{u.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-2xl mx-auto px-6 pb-24 text-center">
        <div
          className="rounded-3xl border border-violet-500/20 p-10"
          style={{ background: 'linear-gradient(145deg, rgba(124,58,237,0.08), rgba(79,70,229,0.04))' }}
        >
          <h2 className="text-2xl font-bold text-white/90 mb-3">立即免费体验</h2>
          <p className="text-white/40 text-sm mb-6">无需注册，每日 3 次免费。注册后每月 10 次。</p>
          <div className="flex gap-3 justify-center">
            <Link
              href="/"
              className="px-6 py-2.5 rounded-xl text-sm font-medium text-white transition"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', boxShadow: '0 4px 20px rgba(124,58,237,0.3)' }}
            >
              开始使用
            </Link>
            <Link
              href="/pricing"
              className="px-6 py-2.5 rounded-xl text-sm font-medium border border-white/10 text-white/60 hover:border-white/20 hover:text-white/80 transition"
            >
              查看定价
            </Link>
          </div>
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
