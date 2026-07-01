import type { Metadata } from 'next'
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "../../lib/l10n";
import { HomeContent } from "../../components/home-content";
import { SITE_URL } from "../../lib/config";
import { getSiteData } from "../../lib/get-site-data";

const META_TITLE: Record<Locale, string> = {
  fa: 'داکتر محب الله احمدزی | متخصص داخله قلب، آنژیوگرافی و آنژیوپلاستی',
  en: 'Dr. Mohibullah Ahmadzai | Cardiologist & Interventional Cardiology Specialist',
  ps: 'ډاکټر محب الله احمدزی | د زړه داخلي ناروغیو متخصص',
}

const META_DESC: Record<Locale, string> = {
  fa: 'وب‌سایت رسمی داکتر محب الله احمدزی، متخصص داخله قلب با بیش از ۸ سال تجربه در آنژیوگرافی، آنژیوپلاستی، اکوکاردیوگرافی و مشاوره تخصصی قلب در کابل افغانستان.',
  en: 'Official website of Dr. Mohibullah Ahmadzai, Cardiologist and Interventional Cardiology Specialist with over 8 years of experience in Angiography, Angioplasty, Echocardiography and cardiac consultations in Kabul, Afghanistan.',
  ps: 'د ډاکټر محب الله احمدزی رسمي وب‌سایټ، د زړه داخلي ناروغیو متخصص له ۸ کلونو زیاتې تجربې سره د انجیوګرافۍ، انجیوپلاستۍ، اکوکاردیوګرافۍ او د زړه مشورو کې، کابل، افغانستان.',
}

const LOCALES: Locale[] = ['fa', 'en', 'ps']

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const loc = locale as Locale;
  try {
    const { site } = await getSiteData(loc);
    const title = site.brand || META_TITLE[loc];
    const description = site.mission || site.heroCopy || META_DESC[loc];
    return {
      title,
      description,
      alternates: {
        canonical: `${SITE_URL}/${loc}`,
        languages: {
          fa: `${SITE_URL}/fa`,
          en: `${SITE_URL}/en`,
          ps: `${SITE_URL}/ps`,
          'x-default': `${SITE_URL}/fa`,
        },
      },
      openGraph: {
        title,
        description,
        url: `${SITE_URL}/${loc}`,
        type: 'website',
      },
    };
  } catch {
    // fallback below
  }

  return {
    title: META_TITLE[loc],
    description: META_DESC[loc],
    alternates: {
      canonical: `${SITE_URL}/${loc}`,
      languages: {
        fa: `${SITE_URL}/fa`,
        en: `${SITE_URL}/en`,
        ps: `${SITE_URL}/ps`,
        'x-default': `${SITE_URL}/fa`,
      },
    },
    openGraph: {
      title: META_TITLE[loc],
      description: META_DESC[loc],
      url: `${SITE_URL}/${loc}`,
      type: 'website',
    },
  };
}

export default async function LocaleHomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return <HomeContent locale={locale as Locale} />;
}
