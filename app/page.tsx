import type { Metadata } from 'next'
import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { detectRequestLocale, LANGUAGE_COOKIE_KEY } from '../lib/l10n'
import { SITE_URL } from '../lib/config'

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: `${SITE_URL}/fa`,
    languages: {
      fa: `${SITE_URL}/fa`,
      en: `${SITE_URL}/en`,
      ps: `${SITE_URL}/ps`,
      'x-default': `${SITE_URL}/fa`,
    },
  },
}

export default async function HomePage() {
  const cookieStore = await cookies()
  const headerStore = await headers()
  const locale = detectRequestLocale(
    cookieStore.get(LANGUAGE_COOKIE_KEY)?.value,
    headerStore.get('accept-language'),
  )
  redirect(`/${locale}`)
}
