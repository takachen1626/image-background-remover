'use client'

import dynamic from 'next/dynamic'

export const runtime = 'edge'

// @imgly/background-removal uses onnxruntime-web which is browser-only — must disable SSR
const HomeClient = dynamic(() => import('./home-client'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0d0f14' }}>
      <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
        style={{ borderColor: 'rgba(124,58,237,0.6)', borderTopColor: 'transparent' }} />
    </div>
  ),
})

export default function Home() {
  return <HomeClient />
}
