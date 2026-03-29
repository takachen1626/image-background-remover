'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, usePathname } from 'next/navigation'
import { useSession, signIn } from 'next-auth/react'
import { useTranslations } from 'next-intl'

const LOCALES = ['en', 'zh', 'ja', 'ko', 'fr', 'de', 'es'] as const
type Locale = (typeof LOCALES)[number]

interface NavProps {
  locale: string
  activeLink?: 'features' | 'pricing' | 'docs'
}

export default function Nav({ locale, activeLink }: NavProps) {
  const t = useTranslations('nav')
  const { data: session } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const [langOpen, setLangOpen] = useState(false)
  const dropRef = useRef<HTMLDivElement>(null)

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setLangOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const switchLocale = (newLocale: string) => {
    // Replace /[locale]/ prefix in pathname
    const segments = pathname.split('/')
    // segments[0] = '', segments[1] = locale, rest = path
    segments[1] = newLocale
    router.push(segments.join('/') || '/')
    setLangOpen(false)
  }

  const linkClass = (active: boolean) =>
    active ? 'text-violet-400 font-medium' : 'text-white/40 hover:text-white/70 transition'

  return (
    <nav className="border-b border-white/5 px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
      {/* Logo */}
      <Link href={`/${locale}`} className="flex items-center gap-2">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}
        >
          B
        </div>
        <span className="font-semibold text-white/80 text-sm tracking-wide">{t('brand')}</span>
      </Link>

      <div className="flex items-center gap-6 text-sm">
        {/* Nav Links */}
        <Link href={`/${locale}/features`} className={linkClass(activeLink === 'features')}>
          {t('features')}
        </Link>
        <Link href={`/${locale}/pricing`} className={linkClass(activeLink === 'pricing')}>
          {t('pricing')}
        </Link>
        <Link href={`/${locale}/docs`} className={linkClass(activeLink === 'docs')}>
          {t('docs')}
        </Link>

        {/* Language Switcher */}
        <div className="relative" ref={dropRef}>
          <button
            onClick={() => setLangOpen((v) => !v)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-white/10 text-white/40 hover:border-white/20 hover:text-white/70 transition text-xs"
          >
            <span>🌐</span>
            <span className="uppercase">{locale}</span>
            <span className="text-white/20">▾</span>
          </button>

          {langOpen && (
            <div
              className="absolute right-0 mt-2 w-36 rounded-xl border border-white/10 overflow-hidden z-50"
              style={{ background: 'rgba(15,17,25,0.98)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}
            >
              {LOCALES.map((l) => (
                <button
                  key={l}
                  onClick={() => switchLocale(l)}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-left hover:bg-white/5 transition"
                  style={{ color: l === locale ? '#a78bfa' : 'rgba(255,255,255,0.5)' }}
                >
                  {l === locale && <span className="text-violet-400">✓</span>}
                  <span className={l !== locale ? 'ml-4' : ''}>{t(`languages.${l}` as Parameters<typeof t>[0])}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Auth */}
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
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}
              >
                {session.user?.name?.[0]?.toUpperCase() ?? 'U'}
              </div>
            )}
            <span className="text-xs text-white/50 group-hover:text-white/80 transition">
              {t('dashboard')}
            </span>
          </Link>
        ) : (
          <button
            onClick={() => signIn('google')}
            className="px-4 py-1.5 rounded-full text-xs font-medium border border-white/10 text-white/60 hover:border-white/20 hover:text-white/80 transition"
          >
            {t('signIn')}
          </button>
        )}
      </div>
    </nav>
  )
}
