export const runtime = 'edge'

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center text-white"
      style={{ background: '#0d0f14' }}
    >
      <p className="text-6xl font-bold text-white/10 mb-4">404</p>
      <p className="text-white/40 text-sm mb-6">Page not found</p>
      <a
        href="/"
        className="text-xs text-violet-400 hover:text-violet-300 transition"
      >
        ← Back to home
      </a>
    </div>
  )
}
