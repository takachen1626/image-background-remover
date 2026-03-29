import Link from 'next/link'

export const runtime = 'edge'

const quickStart = [
  { step: '1', title: '打开工具', desc: '访问首页，无需注册或安装任何软件。' },
  { step: '2', title: '上传图片', desc: '点击上传区域或直接拖拽图片，支持 PNG、JPG、WEBP 格式。' },
  { step: '3', title: '等待处理', desc: '首次使用会下载约 50MB AI 模型（仅一次），之后处理完全离线，通常几秒内完成。' },
  { step: '4', title: '下载结果', desc: '处理完成后点击"Download PNG"，下载带透明背景的图片。' },
]

const apiEndpoints = [
  {
    method: 'GET',
    path: '/api/usage',
    desc: '查询当前用量和限制',
    response: `{
  "type": "user",
  "plan": "business",
  "monthly": { "used": 12, "limit": 2000, "remaining": 1988 },
  "credits": { "balance": 50 },
  "canProcess": true,
  "maxFileSizeMB": 50,
  "maxResolution": 99999
}`,
  },
  {
    method: 'POST',
    path: '/api/usage',
    desc: '消费一次处理配额（处理成功后调用）',
    response: `{
  "ok": true,
  "source": "monthly",
  "remaining_monthly": 1987
}`,
  },
]

const limits = [
  { plan: 'Guest',    monthly: '3次/天',    fileSize: '≤ 2MB',  resolution: '720p',  batch: '—',      api: '—' },
  { plan: 'Free',     monthly: '10次/月',   fileSize: '≤ 5MB',  resolution: '1080p', batch: '—',      api: '—' },
  { plan: 'Pro',      monthly: '200次/月',  fileSize: '≤ 25MB', resolution: '原图',  batch: '10张/批', api: '—' },
  { plan: 'Business', monthly: '2000次/月', fileSize: '≤ 50MB', resolution: '原图',  batch: '50张/批', api: '✓' },
]

export default function DocsPage() {
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
          <Link href="/features" className="text-white/40 hover:text-white/70 transition">Features</Link>
          <Link href="/pricing" className="text-white/40 hover:text-white/70 transition">Pricing</Link>
          <Link href="/docs" className="text-violet-400 font-medium">Docs</Link>
          <Link
            href="/dashboard"
            className="px-4 py-1.5 rounded-full text-xs font-medium border border-white/10 text-white/60 hover:border-white/20 hover:text-white/80 transition"
          >
            Dashboard
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Hero */}
        <div className="mb-14">
          <div
            className="inline-block text-xs font-medium px-3 py-1 rounded-full border border-violet-500/30 text-violet-400 mb-4"
            style={{ background: 'rgba(124,58,237,0.08)' }}
          >
            ✦ 文档
          </div>
          <h1 className="text-4xl font-bold text-white/90 mb-3">使用说明</h1>
          <p className="text-white/40 text-base">快速上手指南、套餐限制说明及 API 文档。</p>
        </div>

        {/* Quick Start */}
        <section className="mb-14">
          <h2 className="text-xl font-bold text-white/85 mb-6 flex items-center gap-2">
            <span className="text-violet-400">01</span> 快速开始
          </h2>
          <div className="space-y-4">
            {quickStart.map((s) => (
              <div
                key={s.step}
                className="flex gap-4 rounded-2xl border border-white/5 p-5"
                style={{ background: 'rgba(255,255,255,0.02)' }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}
                >
                  {s.step}
                </div>
                <div>
                  <p className="font-semibold text-white/80 text-sm mb-1">{s.title}</p>
                  <p className="text-white/40 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Plan Limits */}
        <section className="mb-14">
          <h2 className="text-xl font-bold text-white/85 mb-6 flex items-center gap-2">
            <span className="text-violet-400">02</span> 套餐限制
          </h2>
          <div
            className="rounded-2xl border border-white/8 overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.02)' }}
          >
            <div className="grid grid-cols-6 text-xs text-white/30 px-5 py-3 border-b border-white/5 uppercase tracking-wider">
              <span>套餐</span>
              <span>月度额度</span>
              <span>文件大小</span>
              <span>分辨率</span>
              <span>批量</span>
              <span>API</span>
            </div>
            {limits.map((row, i) => (
              <div
                key={i}
                className="grid grid-cols-6 text-sm px-5 py-3.5 border-b border-white/5 last:border-0"
                style={{
                  background: row.plan === 'Pro' ? 'rgba(124,58,237,0.05)' : 'transparent',
                }}
              >
                <span className="font-semibold text-white/80">{row.plan}</span>
                <span className="text-white/50">{row.monthly}</span>
                <span className="text-white/50">{row.fileSize}</span>
                <span className="text-white/50">{row.resolution}</span>
                <span className="text-white/50">{row.batch}</span>
                <span className="text-white/50">{row.api}</span>
              </div>
            ))}
          </div>
          <p className="text-white/20 text-xs mt-3">
            积分包（永不过期）与订阅叠加生效，文件大小/分辨率与 Pro 相同。
            <Link href="/pricing" className="text-violet-400 ml-1 hover:text-violet-300 transition">查看定价 →</Link>
          </p>
        </section>

        {/* API Reference */}
        <section className="mb-14">
          <h2 className="text-xl font-bold text-white/85 mb-2 flex items-center gap-2">
            <span className="text-violet-400">03</span> API 参考
          </h2>
          <div
            className="rounded-xl border border-violet-500/20 px-4 py-3 text-xs text-violet-300 mb-6"
            style={{ background: 'rgba(124,58,237,0.07)' }}
          >
            API 访问仅限 <strong>Business</strong> 订阅用户。请求需携带 Session Cookie（OAuth 登录后自动获取）。
          </div>

          <div className="space-y-5">
            {apiEndpoints.map((ep, i) => (
              <div
                key={i}
                className="rounded-2xl border border-white/6 overflow-hidden"
                style={{ background: 'rgba(255,255,255,0.02)' }}
              >
                <div className="flex items-center gap-3 px-5 py-3 border-b border-white/5">
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded-md"
                    style={{
                      background: ep.method === 'GET' ? 'rgba(52,211,153,0.15)' : 'rgba(124,58,237,0.2)',
                      color: ep.method === 'GET' ? '#34d399' : '#a78bfa',
                    }}
                  >
                    {ep.method}
                  </span>
                  <code className="text-sm text-white/70 font-mono">{ep.path}</code>
                  <span className="text-white/30 text-xs ml-auto">{ep.desc}</span>
                </div>
                <div className="px-5 py-4">
                  <p className="text-xs text-white/30 mb-2 uppercase tracking-wider">Response</p>
                  <pre
                    className="text-xs text-white/60 font-mono leading-relaxed overflow-x-auto"
                    style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '8px' }}
                  >
                    {ep.response}
                  </pre>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Support */}
        <section>
          <h2 className="text-xl font-bold text-white/85 mb-6 flex items-center gap-2">
            <span className="text-violet-400">04</span> 获取支持
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div
              className="rounded-2xl border border-white/5 p-5"
              style={{ background: 'rgba(255,255,255,0.02)' }}
            >
              <p className="font-semibold text-white/80 text-sm mb-1">📧 邮件支持</p>
              <p className="text-white/40 text-sm mb-3">遇到问题或有功能建议？发邮件给我们。</p>
              <a
                href="mailto:support@imagebackgrounderaser.shop"
                className="text-violet-400 text-sm hover:text-violet-300 transition"
              >
                support@imagebackgrounderaser.shop
              </a>
            </div>
            <div
              className="rounded-2xl border border-white/5 p-5"
              style={{ background: 'rgba(255,255,255,0.02)' }}
            >
              <p className="font-semibold text-white/80 text-sm mb-1">💳 账单问题</p>
              <p className="text-white/40 text-sm mb-3">退款、升级、降级等账单相关问题。</p>
              <Link href="/dashboard/billing" className="text-violet-400 text-sm hover:text-violet-300 transition">
                前往账单页面 →
              </Link>
            </div>
          </div>
        </section>
      </div>

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
