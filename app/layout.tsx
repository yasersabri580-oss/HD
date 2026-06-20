import './globals.css'
import './footer.css'
import './review.css'
import './article.css'
import './hero-responsive.css'
import './technology.css'
import './qualification.css'
import './services.css'
import './doctor-profile.css'

import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { Vazirmatn } from 'next/font/google'
import type { ReactNode } from 'react'

import { RevealObserver } from '../components/reveal'
import { LanguageProvider } from '../components/language-provider'
import { LanguagePreferenceSync } from '../components/language-preference-sync'
import { getCookieLocale, getDir, LANGUAGE_COOKIE_KEY } from '../lib/l10n'

const vazir = Vazirmatn({
  subsets: ['arabic', 'latin'],
  display: 'swap',
  variable: '--font-vazir',
})

export const metadata: Metadata = {
  title: {
    default: 'داکتر محب الله احمدزی | متخصص داخله قلب، آنژیوگرافی و آنژیوپلاستی',
    template: '%s | داکتر محب الله احمدزی',
  },
  description:
    'وب‌سایت رسمی داکتر محب الله احمدزی، متخصص داخله قلب با بیش از ۸ سال تجربه در آنژیوگرافی، آنژیوپلاستی، اکوکاردیوگرافی، تست ورزش، هولتر قلب و مشاوره تخصصی قلب در کابل افغانستان.',
  keywords: [
    'داکتر محب الله احمدزی',
    'متخصص قلب',
    'داخله قلب',
    'متخصص قلب کابل',
    'داکتر قلب کابل',
    'آنژیوگرافی',
    'آنژیوپلاستی',
    'اکوکاردیوگرافی',
    'اکو قلب',
    'اکوی استرس',
    'تست ورزش',
    'هولتر قلب',
    'هولتر فشار خون',
    'مشاوره قلب',
    'کلینیک قلب کابل',
    'شفاخانه فرانسوی کابل',
    'FMIC',
    'Dr Mohibullah Ahmadzai',
    'Mohibullah Ahmadzai',
    'Cardiologist Afghanistan',
    'Cardiologist Kabul',
    'Heart Specialist Kabul',
    'Heart Doctor Kabul',
    'Interventional Cardiologist',
    'Interventional Cardiology',
    'Cardiology Specialist',
    'Angiography',
    'Angioplasty',
    'Echocardiography',
    'Stress Echocardiography',
    'Exercise Stress Test',
    'ECG',
    'Heart Rhythm Holter',
    'Blood Pressure Holter',
    'Heart Consultation',
    'FMIC Kabul',
    'French Medical Institute Kabul',
  ],
  authors: [
    {
      name: 'داکتر محب الله احمدزی',
    },
  ],
  creator: 'Dr. Mohibullah Ahmadzai',
  publisher: 'Dr. Mohibullah Ahmadzai',
  applicationName: 'Dr. Mohibullah Ahmadzai',
  category: 'Healthcare',
  openGraph: {
    title:
      'Dr. Mohibullah Ahmadzai | Cardiologist & Interventional Cardiology Specialist',
    description:
      'Official website of Dr. Mohibullah Ahmadzai, Cardiologist and Interventional Cardiology Specialist in Kabul, Afghanistan.',
    type: 'website',
    locale: 'fa_AF',
    siteName: 'Dr. Mohibullah Ahmadzai',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dr. Mohibullah Ahmadzai',
    description:
      'Cardiologist & Interventional Cardiology Specialist in Kabul, Afghanistan.',
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