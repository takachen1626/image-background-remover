import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import Nav from '../../../components/Nav'

export const runtime = 'edge'

export default async function LocaleDocsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'docs' })
  const tFooter = await getTranslations({ locale, namespace: 'footer' })

  const quickStart = t.raw('quickStart') as Array<{ step: string; title: string; desc: string }>
  const limits = t.raw('limits') as Array<{
    plan: string; monthly: string; fileSize: string; resolution: string; batch: string; api: string
  }>
  const apiEndpoints = t.raw('apiEndpoints') as Array<{
    method: string; path: string; desc: string; response: string
  }>
  const limitsTableHeaders = t.raw('limitsTableHeaders') as string[]

  return (
    <div className="min-h-screen text-white" style={{ background: '#0d0f14' }}>
      <Nav locale={locale} activeLink="docs" />

      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Hero */}
        <div className="mb-14">
          <div
            className="inline-block text-xs font-medium px-3 py-1 rounded-full border border-violet-500/30 text-violet-400 mb-4"
            style={{ background: 'rgba(124,58,237,0.08)' }}
          >
            {t('badge')}
          </div>
          <h1 className="text-4xl font-bold text-white/90 mb-3">{t('title')}</h1>
          <p className="text-white/40 text-base">{t('subtitle')}</p>
        </div>

        {/* Quick Start */}
        <section className="mb-14">
          <h2 className="text-xl font-bold text-white/85 mb-6 flex items-center gap-2">
            <span className="text-violet-400">{t('section01')}</span> {t('section01Title')}
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
            <span className="text-violet-400">{t('section02')}</span> {t('section02Title')}
          </h2>
          <div
            className="rounded-2xl border border-white/8 overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.02)' }}
          >
            <div className="grid grid-cols-6 text-xs text-white/30 px-5 py-3 border-b border-white/5 uppercase tracking-wider">
              {limitsTableHeaders.map((h, i) => (
                <span key={i}>{h}</span>
              ))}
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
            {t('limitsNote')}
            <Link href={`/${locale}/pricing`} className="text-violet-400 ml-1 hover:text-violet-300 transition">
              {t('limitsNoteLinkText')}
            </Link>
          </p>
        </section>

        {/* API Reference */}
        <section className="mb-14">
          <h2 className="text-xl font-bold text-white/85 mb-2 flex items-center gap-2">
            <span className="text-violet-400">{t('section03')}</span> {t('section03Title')}
          </h2>
          <div
            className="rounded-xl border border-violet-500/20 px-4 py-3 text-xs text-violet-300 mb-6"
            style={{ background: 'rgba(124,58,237,0.07)' }}
          >
            {t('apiNote')} <strong>{t('apiNotePlan')}</strong> {t('apiNoteText')}
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
                  <p className="text-xs text-white/30 mb-2 uppercase tracking-wider">{t('apiResponseLabel')}</p>
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
            <span className="text-violet-400">{t('section04')}</span> {t('section04Title')}
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div
              className="rounded-2xl border border-white/5 p-5"
              style={{ background: 'rgba(255,255,255,0.02)' }}
            >
              <p className="font-semibold text-white/80 text-sm mb-1">{t('supportEmailTitle')}</p>
              <p className="text-white/40 text-sm mb-3">{t('supportEmailDesc')}</p>
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
              <p className="font-semibold text-white/80 text-sm mb-1">{t('supportBillingTitle')}</p>
              <p className="text-white/40 text-sm mb-3">{t('supportBillingDesc')}</p>
              <Link href="/dashboard/billing" className="text-violet-400 text-sm hover:text-violet-300 transition">
                {t('supportBillingLink')}
              </Link>
            </div>
          </div>
        </section>
      </div>

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
