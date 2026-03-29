'use client'

import { useEffect, useState } from 'react'

export const runtime = 'edge'

interface HistoryItem {
  id: string
  originalName: string
  resultUrl: string
  processedAt: number
}

export default function HistoryPage() {
  const [items, setItems] = useState<HistoryItem[]>([])

  useEffect(() => {
    // Load from localStorage (images are processed locally, never uploaded)
    const raw = localStorage.getItem('bgremover_history')
    if (raw) {
      try {
        setItems(JSON.parse(raw))
      } catch {
        setItems([])
      }
    }
  }, [])

  const removeItem = (id: string) => {
    const updated = items.filter((i) => i.id !== id)
    setItems(updated)
    localStorage.setItem('bgremover_history', JSON.stringify(updated))
  }

  const clearAll = () => {
    setItems([])
    localStorage.removeItem('bgremover_history')
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white/90">History</h1>
          <p className="text-white/30 text-sm mt-1">
            Images are stored locally in your browser — they never leave your device.
          </p>
        </div>
        {items.length > 0 && (
          <button
            onClick={clearAll}
            className="text-xs text-white/20 hover:text-red-400/60 transition px-3 py-1.5 rounded-lg border border-white/5 hover:border-red-400/20"
          >
            Clear All
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div
          className="rounded-2xl border border-dashed border-white/8 p-16 text-center"
          style={{ background: 'rgba(255,255,255,0.01)' }}
        >
          <p className="text-5xl opacity-10 mb-4">◷</p>
          <p className="text-white/30 text-sm">No images processed yet.</p>
          <a
            href="/"
            className="inline-block mt-4 text-xs text-violet-400 hover:text-violet-300 transition"
          >
            Go process your first image →
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-white/8 overflow-hidden group"
              style={{ background: 'rgba(255,255,255,0.02)' }}
            >
              {/* Checkerboard preview */}
              <div
                className="h-40 flex items-center justify-center relative"
                style={{
                  background: 'repeating-conic-gradient(rgba(255,255,255,0.06) 0% 25%, rgba(255,255,255,0.02) 0% 50%) 0 0 / 16px 16px',
                }}
              >
                <img
                  src={item.resultUrl}
                  alt={item.originalName}
                  className="max-h-36 max-w-full object-contain"
                />
                {/* Overlay actions */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3">
                  <a
                    href={item.resultUrl}
                    download={`removed-bg-${item.originalName}`}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-white"
                    style={{ background: 'rgba(124,58,237,0.8)' }}
                  >
                    ↓ Download
                  </a>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-white/60 border border-white/20 hover:text-red-400 hover:border-red-400/30 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className="px-3 py-2.5">
                <p className="text-xs text-white/60 truncate">{item.originalName}</p>
                <p className="text-xs text-white/25 mt-0.5">
                  {new Date(item.processedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
