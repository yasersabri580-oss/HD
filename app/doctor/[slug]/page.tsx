import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getCookieLocale, LANGUAGE_COOKIE_KEY } from "../../../lib/l10n";

/**
 * Legacy redirect: /doctor/[slug] → /[locale]/doctor/[slug]
 * Reads locale from cookie to preserve the user's language preference.
 */
export default async function LegacyDoctorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cookieStore = await cookies();
  const locale = getCookieLocale(cookieStore.get(LANGUAGE_COOKIE_KEY)?.value);
  redirect(`/${locale}/doctor/${slug}`);
}
