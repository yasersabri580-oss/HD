import { cookies } from "next/headers";
import { getCookieLocale, LANGUAGE_COOKIE_KEY } from "../lib/l10n";
import { HomeContent } from "../components/home-content";

export default async function HomePage() {
  const cookieStore = await cookies();
  const locale = getCookieLocale(cookieStore.get(LANGUAGE_COOKIE_KEY)?.value);
  return <HomeContent locale={locale} />;
}
