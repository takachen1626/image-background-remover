'use client'

import { useState, useCallback } from 'react'
import { removeBackground } from '@imgly/background-removal'
import { useSession, signIn } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'

interface UsageInfo {
  type: 'guest' | 'user'
  canProcess: boolean
  maxFileSizeMB: number
  maxResolution: number
  watermark: boolean
  plan?: string
}

interface LimitModal {
  type: 'guest_limit' | 'user_limit' | 'file_size'
  message: string
}

export default function HomeClient() {
  const { data: session } = useSession()
  const [image, setImage] = useState<string | null>(null)
  const [result, setResult] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [dragOver, setDragOver] = useState(false)
  const [fileName, setFileName] = useState<string>('')
  const [limitModal, setLimitModal] = useState<LimitModal | null>(null)

  const processFile = async (file: File) => {
    // 1. Check usage limits
    let usage: UsageInfo
    try {
      const res = await fetch('/api/usage')
      usage = await res.json()
    } catch {
      usage = { type: 'guest', canProcess: true, maxFileSizeMB: 2, maxResolution: 720, watermark: true }
    }

    // 2. File size check
    const fileSizeMB = file.size / (1024 * 1024)
    if (fileSizeMB > usage.maxFileSizeMB) {
      setLimitModal({
        type: 'file_size',
        message: `文件大小 ${fileSizeMB.toFixed(1)}MB 超出限制（最大 ${usage.maxFileSizeMB}MB）`,
      })
      return
    }

    // 3. Quota check
    if (!usage.canProcess) {
      if (usage.type === 'guest') {
        setLimitModal({ type: 'guest_limit', message: '今日免费次数已用完，登录后可获得更多配额' })
      } else {
        setLimitModal({ type: 'user_limit', message: '本月配额已用完，请升级 Pro 计划以继续使用' })
      }
      return
    }

    const reader = new FileReader()
    reader.onload = async (event) => {
      const imgUrl = event.target?.result as string
      setImage(imgUrl)
      setResult(null)
      setLoading(true)
      setProgress(0)

      const interval = setInterval(() => {
        setProgress((p) => (p < 82 ? p + Math.random() * 10 : p))
      }, 500)

      try {
        const blob = await removeBackground(imgUrl)
        const url = URL.createObjectURL(blob)
        setResult(url)
        setProgress(100)

        // Consume one credit
        try {
          await fetch('/api/usage', { method: 'POST' })
        } catch {}

        // Save to local history
        const historyItem = {
          id: Date.now().toString(),
          originalName: file.name,
          resultUrl: url,
          processedAt: Date.now(),
        }
        const existing = JSON.parse(localStorage.getItem('bgremover_history') || '[]')
        const updated = [historyItem, ...existing].slice(0, 50)
        localStorage.setItem('bgremover_history', JSON.stringify(updated))
      } catch (error) {
        console.error('Error:', error)
      } finally {
        clearInterval(interval)
        setLoading(false)
      }
    }
    setFileName(file.name)
    reader.readAsDataURL(file)
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processFile(file)
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) processFile(file)
  }, [])

  const handleReset = () => {
    setImage(null)
    setResult(null)
    setProgress(0)
    setFileName('')
  }

  return (
    <div className="min-h-screen text-white" style={{ background: '#0d0f14' }}>
      {/* Limit Modal */}
      {limitModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
        >
          <div
            className="rounded-3xl border border-white/10 p-8 max-w-sm w-full text-center"
            style={{
              background: 'linear-gradient(145deg, rgba(20,22,32,0.98), rgba(15,17,25,0.98))',
              boxShadow: '0 0 60px rgba(124,58,237,0.15)',
            }}
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-5"
              style={{ background: 'rgba(124,58,237,0.15)' }}
            >
              {limitModal.type === 'file_size' ? '📁' : '⚡'}
            </div>
            <h3 className="text-lg font-semibold text-white/90 mb-2">
              {limitModal.type === 'file_size' ? '文件过大' : '配额已用完'}
            </h3>
            <p className="text-white/40 text-sm mb-6 leading-relaxed">{limitModal.message}</p>
            <div className="flex gap-3">
              <button
                onClick={() => setLimitModal(null)}
                className="flex-1 py-2.5 rounded-xl text-sm text-white/40 border border-white/10 hover:border-white/20 transition"
              >
                关闭
              </button>
              {limitModal.type === 'guest_limit' && (
                <button
                  onClick={() => { setLimitModal(null); signIn('google') }}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white transition"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}
                >
                  Sign In
                </button>
              )}
              {limitModal.type === 'user_limit' && (
                <Link
                  href="/dashboard/billing"
                  onClick={() => setLimitModal(null)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white text-center transition"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}
                >
                  Upgrade
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="border-b border-white/5 px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}
          >
            B
          </div>
          <span className="font-semibold text-white/80 text-sm tracking-wide">BgRemover</span>
        </div>
        <div className="flex items-center gap-8 text-sm">
          <Link href="/features" className="text-white/40 hover:text-white/70 transition">Features</Link>
          <Link href="/pricing" className="text-white/40 hover:text-white/70 transition">Pricing</Link>
          <Link href="/docs" className="text-white/40 hover:text-white/70 transition">Docs</Link>
          {session ? (
            <Link href="/dashboard" className="flex items-center gap-2 group">
              {session.user?.image ? (
                <Image
                  src={session.user.image}
                  alt="avatar"
                  width={28}
                  height={28}
                  className="rounded-full"
                />
              ) : (
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}>
                  {session.user?.name?.[0]?.toUpperCase() ?? 'U'}
                </div>
              )}
              <span className="text-xs text-white/50 group-hover:text-white/80 transition">Dashboard</span>
            </Link>
          ) : (
            <button
              onClick={() => signIn('google')}
              className="px-4 py-1.5 rounded-full text-xs font-medium border border-white/10 text-white/60 hover:border-white/20 hover:text-white/80 transition"
            >
              Sign In
            </button>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="text-center pt-20 pb-12 px-6">
        <div
          className="inline-block text-xs font-medium px-3 py-1 rounded-full border border-violet-500/30 text-violet-400 mb-6"
          style={{ background: 'rgba(124,58,237,0.08)' }}
        >
          ✦ AI-Powered · Runs 100% in your browser
        </div>
        <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-4">
          <span
            style={{
              background: 'linear-gradient(to right, #c4b5fd, #818cf8, #6366f1)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Remove Backgrounds
          </span>
          <br />
          <span className="text-white/90">Instantly &amp; Privately</span>
        </h1>
        <p className="text-white/40 text-lg max-w-xl mx-auto">
          No uploads. No servers. Your images never leave your device.
          Powered by ONNX Runtime — blazing fast.
        </p>
      </section>

      {/* Main Card Area */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div
          className="rounded-3xl border border-white/8 p-1"
          style={{
            background: 'linear-gradient(145deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))',
            boxShadow: '0 0 80px rgba(99,102,241,0.08), inset 0 1px 0 rgba(255,255,255,0.06)',
          }}
        >
          <div className="rounded-[22px] overflow-hidden" style={{ background: 'rgba(15,17,25,0.95)' }}>
            {/* Tab bar */}
            <div className="flex border-b border-white/5 px-6 pt-4 gap-6 text-sm">
              <span className="pb-3 text-white/80 font-medium border-b-2 border-violet-500">Editor</span>
              <span className="pb-3 text-white/30 hover:text-white/50 cursor-pointer transition">History</span>
            </div>

            {/* Content */}
            <div className="grid md:grid-cols-2 gap-0">
              {/* Left — Upload */}
              <div className="p-6 border-r border-white/5">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-medium text-white/60 uppercase tracking-widest text-xs">Original</p>
                  {image && (
                    <button onClick={handleReset} className="text-xs text-white/20 hover:text-white/40 transition">
                      Clear
                    </button>
                  )}
                </div>

                {!image ? (
                  <label
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    className="flex flex-col items-center justify-center h-64 rounded-2xl border-2 border-dashed cursor-pointer transition-all"
                    style={{
                      borderColor: dragOver ? 'rgba(124,58,237,0.7)' : 'rgba(255,255,255,0.08)',
                      background: dragOver ? 'rgba(124,58,237,0.07)' : 'rgba(255,255,255,0.02)',
                    }}
                  >
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 text-2xl"
                      style={{ background: 'rgba(124,58,237,0.12)' }}
                    >
                      ↑
                    </div>
                    <p className="text-white/50 text-sm font-medium">Drop your image here</p>
                    <p className="text-white/25 text-xs mt-1">or <span className="text-violet-400">browse files</span></p>
                    <p className="text-white/15 text-xs mt-3">PNG · JPG · WEBP · up to 10MB</p>
                    <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
                  </label>
                ) : (
                  <div className="relative h-64 rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <img src={image} alt="Original" className="w-full h-full object-contain" />
                    {fileName && (
                      <div className="absolute bottom-2 left-2 text-xs px-2 py-1 rounded-lg text-white/50 truncate max-w-[80%]"
                        style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}>
                        {fileName}
                      </div>
                    )}
                  </div>
                )}

                {/* Progress */}
                {loading && (
                  <div className="mt-4">
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-white/30">Removing background…</span>
                      <span className="text-violet-400 font-medium">{Math.round(progress)}%</span>
                    </div>
                    <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${progress}%`,
                          background: 'linear-gradient(90deg, #7c3aed, #4f46e5)',
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Right — Result */}
              <div className="p-6">
                <p className="text-sm font-medium text-white/60 uppercase tracking-widest text-xs mb-4">Result</p>

                {!result ? (
                  <div
                    className="flex flex-col items-center justify-center h-64 rounded-2xl border-2 border-dashed"
                    style={{ borderColor: 'rgba(255,255,255,0.05)' }}
                  >
                    {loading ? (
                      <div className="flex flex-col items-center gap-4">
                        <div
                          className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin"
                          style={{ borderColor: 'rgba(124,58,237,0.6)', borderTopColor: 'transparent' }}
                        />
                        <p className="text-white/30 text-sm">AI is working…</p>
                      </div>
                    ) : (
                      <>
                        <div className="text-5xl opacity-10 mb-3">✦</div>
                        <p className="text-white/20 text-sm">Result will appear here</p>
                      </>
                    )}
                  </div>
                ) : (
                  <div>
                    {/* Checkerboard to show transparency */}
                    <div
                      className="rounded-2xl overflow-hidden h-64 flex items-center justify-center"
                      style={{
                        background: 'repeating-conic-gradient(rgba(255,255,255,0.06) 0% 25%, rgba(255,255,255,0.02) 0% 50%) 0 0 / 20px 20px',
                      }}
                    >
                      <img src={result} alt="Result" className="max-h-64 max-w-full object-contain" />
                    </div>
                    <a
                      href={result}
                      download="removed-bg.png"
                      className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-medium text-white transition"
                      style={{
                        background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                        boxShadow: '0 4px 24px rgba(124,58,237,0.3)',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 32px rgba(124,58,237,0.5)')}
                      onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 4px 24px rgba(124,58,237,0.3)')}
                    >
                      ↓ Download PNG
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-4 mt-8">
          {[
            { icon: '🔒', title: 'Fully Private', desc: 'Images never leave your device. Zero server uploads.' },
            { icon: '⚡', title: 'Blazing Fast', desc: 'ONNX Runtime powers local AI inference. No wait time.' },
            { icon: '✦', title: 'Pro Quality', desc: 'State-of-the-art model. Hair, fur, complex edges — handled.' },
          ].map((f, i) => (
            <div
              key={i}
              className="rounded-2xl border border-white/5 p-5"
              style={{ background: 'rgba(255,255,255,0.02)' }}
            >
              <div className="text-2xl mb-3">{f.icon}</div>
              <p className="font-semibold text-white/80 text-sm mb-1">{f.title}</p>
              <p className="text-white/30 text-xs leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Info tip */}
        <div
          className="mt-4 rounded-xl border border-violet-500/15 px-4 py-3 text-xs"
          style={{ background: 'rgba(124,58,237,0.06)' }}
        >
          <span className="text-violet-400 font-medium">Note:</span>
          <span className="text-white/35 ml-1">First run downloads the AI model (~50 MB). Subsequent runs are instant and fully offline.</span>
        </div>
      </section>
    </div>
  )
}
