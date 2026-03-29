import { getTranslations } from 'next-intl/server'
import HomeLocaleClient from './home-locale-client'

export const runtime = 'edge'

export default async function LocaleHomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'home' })
  const tModal = await getTranslations({ locale, namespace: 'modal' })

  const messages = {
    badge: t('badge'),
    title1: t('title1'),
    title2: t('title2'),
    subtitle: t('subtitle'),
    tabEditor: t('tabEditor'),
    tabHistory: t('tabHistory'),
    labelOriginal: t('labelOriginal'),
    labelResult: t('labelResult'),
    clear: t('clear'),
    dropTitle: t('dropTitle'),
    dropBrowse: t('dropBrowse'),
    dropBrowseLink: t('dropBrowseLink'),
    dropFormats: t('dropFormats'),
    progressLabel: t('progressLabel'),
    resultPlaceholder: t('resultPlaceholder'),
    aiWorking: t('aiWorking'),
    download: t('download'),
    featurePrivateTitle: t('featurePrivateTitle'),
    featurePrivateDesc: t('featurePrivateDesc'),
    featureFastTitle: t('featureFastTitle'),
    featureFastDesc: t('featureFastDesc'),
    featureProTitle: t('featureProTitle'),
    featureProDesc: t('featureProDesc'),
    noteLabel: t('noteLabel'),
    noteText: t('noteText'),
    modal: {
      fileSizeTitle: tModal('fileSizeTitle'),
      quotaTitle: tModal('quotaTitle'),
      close: tModal('close'),
      signIn: tModal('signIn'),
      upgrade: tModal('upgrade'),
    },
  }

  return <HomeLocaleClient locale={locale} messages={messages} />
}
