import type { Metadata } from 'next'
import { cookies } from "next/headers";
import { getCookieLocale, LANGUAGE_COOKIE_KEY } from "../lib/l10n";
import { HomeContent } from "../components/home-content";
import { SITE_URL } from "../lib/config";

export const metadata: Metadata = {
  alternates: {
    canonical: SITE_URL,
    languages: {
      fa: `${SITE_URL}/fa`,
      en: `${SITE_URL}/en`,
      ps: `${SITE_URL}/ps`,
      'x-default': `${SITE_URL}/fa`,
    },
  },
}

export default async function HomePage() {
  const cookieStore = await cookies();
  const locale = getCookieLocale(cookieStore.get(LANGUAGE_COOKIE_KEY)?.value);
  return <HomeContent locale={locale} />;
}
