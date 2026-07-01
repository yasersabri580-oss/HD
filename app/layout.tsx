import './globals.css'
import './footer.css'
import './review.css'
import './article.css'
import './hero-responsive.css'
import './technology.css'
import './qualification.css'
import './services.css'
import './doctor-profile.css'
import './doctor.css'
import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { Vazirmatn } from 'next/font/google'
import type { ReactNode } from 'react'

import { RevealObserver } from '../components/reveal'
import { LanguageProvider } from '../components/language-provider'
import { LanguagePreferenceSync } from '../components/language-preference-sync'
import { getCookieLocale, getDir, LANGUAGE_COOKIE_KEY } from '../lib/l10n'
import { SITE_URL } from '../lib/config'
import { getSiteData } from '../lib/get-site-data'
import { getLocalizedProfile, pickLocalized } from '../lib/profile-fallback'

const vazir = Vazirmatn({
  subsets: ['arabic', 'latin'],
  display: 'swap',
  variable: '--font-vazir',
})

const FALLBACK_TITLE = 'داکتر محب الله احمدزی | متخصص داخله قلب، آنژیوگرافی و آنژیوپلاستی'
const FALLBACK_DESCRIPTION =
  'وب‌سایت رسمی داکتر محب الله احمدزی، متخصص داخله قلب با بیش از ۸ سال تجربه در آنژیوگرافی، آنژیوپلاستی، اکوکاردیوگرافی، تست ورزش، هولتر قلب و مشاوره تخصصی قلب در کابل افغانستان.'
const FALLBACK_KEYWORDS = [
  'داکتر محب الله احمدزی',
  'متخصص قلب',
  'Cardiologist Kabul',
  'Angiography',
  'Angioplasty',
  'Heart Consultation',
]

export async function generateMetadata(): Promise<Metadata> {
  try {
    const { site } = await getSiteData('fa')
    const profile = site?.profile
    const localized = getLocalizedProfile(profile, 'fa', site)
    const title = localized.seoTitle || localized.fullName || FALLBACK_TITLE
    const description =
      localized.seoDescription || site?.mission || site?.heroCopy || FALLBACK_DESCRIPTION
    const keywords =
      (Array.isArray(profile?.seo_keywords) && profile.seo_keywords.length > 0
        ? profile.seo_keywords
        : FALLBACK_KEYWORDS) as string[]
    const ogTitle = pickLocalized(profile, 'og_title', 'fa') || title
    const ogDescription = pickLocalized(profile, 'og_description', 'fa') || description

    return {
      metadataBase: new URL(SITE_URL),
      title: {
        default: title,
        template: `%s | ${localized.fullName || site?.brand || 'Doctor'}`,
      },
      description,
      keywords,
      authors: [{ name: localized.fullName || site?.brand || 'Doctor' }],
      creator: localized.fullName || site?.brand || 'Doctor',
      publisher: localized.fullName || site?.brand || 'Doctor',
      applicationName: localized.fullName || site?.brand || 'Doctor',
      category: 'Healthcare',
      openGraph: {
        title: ogTitle,
        description: ogDescription,
        type: 'website',
        locale: 'fa_AF',
        siteName: localized.fullName || site?.brand || 'Doctor',
      },
      twitter: {
        card: 'summary_large_image',
        title: ogTitle,
        description: ogDescription,
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-image-preview': 'large',
          'max-snippet': -1,
          'max-video-preview': -1,
        },
      },
      alternates: {
        canonical: '/',
      },
    }
  } catch {
    return {
      metadataBase: new URL(SITE_URL),
      title: {
        default: FALLBACK_TITLE,
        template: '%s | داکتر محب الله احمدزی',
      },
      description: FALLBACK_DESCRIPTION,
      keywords: FALLBACK_KEYWORDS,
      alternates: {
        canonical: '/',
      },
    }
  }
}

export default async function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  const cookieStore = await cookies()
  const initialLocale = getCookieLocale(
    cookieStore.get(LANGUAGE_COOKIE_KEY)?.value,
  )

  return (
    <html
      lang={initialLocale}
      dir={getDir(initialLocale)}
      suppressHydrationWarning
    >
      <body className={vazir.variable} suppressHydrationWarning>
        <LanguageProvider initialLocale={initialLocale}>
          <LanguagePreferenceSync />
          <RevealObserver />
          {children}
        </LanguageProvider>
      </body>
    </html>
  )
}