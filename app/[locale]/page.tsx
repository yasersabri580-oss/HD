import { notFound } from "next/navigation";
import { isLocale, type Locale } from "../../lib/l10n";
import { HomeContent } from "../../components/home-content";

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
