import { getTranslations } from 'next-intl/server'
import Nav from '../../../components/Nav'
import PricingLocaleClient from './pricing-locale-client'

export const runtime = 'edge'

export default async function LocalePricingPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'pricing' })
  const tFooter = await getTranslations({ locale, namespace: 'footer' })

  const messages = {
    tabSubscription: t('tabSubscription'),
    tabCredits: t('tabCredits'),
    popularBadge: t('popularBadge'),
    bestValueBadge: t('bestValueBadge'),
    subscriptionNote: t('subscriptionNote'),
    creditsNote: t('creditsNote'),
    creditsBanner: t('creditsBanner'),
    creditsUnit: t('creditsUnit'),
    faqTitle: t('faqTitle'),
    buyButton: t('buyButton'),
    redirecting: t('redirecting'),
    plans: t.raw('plans') as Array<{
      id: string; name: string; price: string; period: string; desc: string; cta: string; highlight: boolean; features: string[]
    }>,
    packs: t.raw('packs') as Array<{
      id: string; name: string; credits: number; price: string; unitPrice: string; highlight: boolean
    }>,
    faqs: t.raw('faqs') as Array<{ q: string; a: string }>,
  }

  return (
    <div className="min-h-screen text-white" style={{ background: '#0d0f14' }}>
      <Nav locale={locale} activeLink="pricing" />

      {/* Hero */}
      <section className="text-center pt-20 pb-10 px-6">
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
        <p className="text-white/40 text-lg max-w-xl mx-auto mb-10">{t('subtitle')}</p>
      </section>

      <PricingLocaleClient messages={messages} locale={locale} />

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
