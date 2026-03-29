import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import Nav from '../../../components/Nav'

export const runtime = 'edge'

export default async function LocaleFeaturesPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'features' })
  const tFooter = await getTranslations({ locale, namespace: 'footer' })

  const featuresList = t.raw('featuresList') as Array<{
    icon: string
    title: string
    desc: string
    highlight: boolean
  }>

  const useCasesList = t.raw('useCasesList') as Array<{
    title: string
    desc: string
    emoji: string
  }>

  return (
    <div className="min-h-screen text-white" style={{ background: '#0d0f14' }}>
      <Nav locale={locale} activeLink="features" />

      {/* Hero */}
      <section className="text-center pt-20 pb-16 px-6">
        <div
          className="inline-block text-xs font-medium px-3 py-1 rounded-full border border-violet-500/30 text-violet-400 mb-6"
          style={{ background: 'rgba(124,58,237,0.08)' }}
        >
          {t('badge')}
        </div>
        <h1 className="text-5xl font-bold leading-tight mb-4">
          <span
            style={{
              background: 'linear-gradient(to right, #c4b5fd, #818cf8, #6366f1)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {t('title')}
          </span>
        </h1>
        <p className="text-white/40 text-lg max-w-2xl mx-auto mb-10">{t('subtitle')}</p>
        <Link
          href={`/${locale}`}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium text-white transition"
          style={{
            background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
            boxShadow: '0 4px 24px rgba(124,58,237,0.3)',
          }}
        >
          {t('ctaButton')}
        </Link>
      </section>

      {/* Features Grid */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {featuresList.map((f, i) => (
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
        <h2 className="text-2xl font-bold text-white/90 text-center mb-3">{t('useCasesTitle')}</h2>
        <p className="text-white/30 text-center text-sm mb-10">{t('useCasesSubtitle')}</p>
        <div className="grid md:grid-cols-4 gap-5">
          {useCasesList.map((u, i) => (
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
          <h2 className="text-2xl font-bold text-white/90 mb-3">{t('ctaSectionTitle')}</h2>
          <p className="text-white/40 text-sm mb-6">{t('ctaSectionSubtitle')}</p>
          <div className="flex gap-3 justify-center">
            <Link
              href={`/${locale}`}
              className="px-6 py-2.5 rounded-xl text-sm font-medium text-white transition"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', boxShadow: '0 4px 20px rgba(124,58,237,0.3)' }}
            >
              {t('ctaStart')}
            </Link>
            <Link
              href={`/${locale}/pricing`}
              className="px-6 py-2.5 rounded-xl text-sm font-medium border border-white/10 text-white/60 hover:border-white/20 hover:text-white/80 transition"
            >
              {t('ctaViewPricing')}
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 text-center">
        <p className="text-white/20 text-xs">
          {tFooter('copyright')} ·{' '}
          <a href={`mailto:${tFooter('email')}`} className="hover:text-white/40 transition">
            {tFooter('email')}
          </a>
        </p>
      </footer>
    </div>
  )
}
