'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Image from 'next/image'

export const runtime = 'edge'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0d0f14' }}>
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: 'rgba(124,58,237,0.6)', borderTopColor: 'transparent' }} />
      </div>
    )
  }

  if (!session) return null

  const navItems = [
    { label: 'Overview', icon: '⊞', href: '/dashboard' },
    { label: 'Editor', icon: '✦', href: '/' },
    { label: 'History', icon: '◷', href: '/dashboard/history' },
    { label: 'Billing', icon: '◈', href: '/dashboard/billing' },
    { label: 'Settings', icon: '⚙', href: '/dashboard/settings' },
  ]

  return (
    <div className="min-h-screen flex text-white" style={{ background: '#0d0f14' }}>
      {/* Sidebar */}
      <aside
        className="w-60 flex flex-col border-r border-white/5 fixed h-full"
        style={{ background: 'rgba(255,255,255,0.015)' }}
      >
        {/* Logo */}
        <div className="px-5 py-5 border-b border-white/5">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}
            >
              B
            </div>
            <span className="font-semibold text-white/80 text-sm tracking-wide">BgRemover</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/50 hover:text-white/80 hover:bg-white/5 transition-all"
            >
              <span className="text-base w-5 text-center">{item.icon}</span>
              {item.label}
            </a>
          ))}
        </nav>

        {/* User card */}
        <div className="px-3 py-4 border-t border-white/5">
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
            {session.user?.image ? (
              <Image
                src={session.user.image}
                alt="avatar"
                width={32}
                height={32}
                className="rounded-full"
              />
            ) : (
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}>
                {session.user?.name?.[0]?.toUpperCase() ?? 'U'}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white/80 truncate">{session.user?.name}</p>
              <p className="text-xs text-white/30 truncate">{session.user?.email}</p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="text-white/20 hover:text-white/50 transition text-xs"
              title="Sign out"
            >
              ⎋
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-60 p-8">
        {children}
      </main>
    </div>
  )
}
