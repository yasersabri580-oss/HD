// lib/localizeNumbers.ts
//
// Render-layer localization utilities.
//
// ARCHITECTURE
// ─────────────────────────────────────────────────────────────────────────────
// Localization of numbers belongs in the UI layer, NOT in the data layer.
//
// • getSiteData() must return clean data with machine types intact:
//   – numeric fields (stats.value, rating, ids …) stay as JS numbers
//   – URLs, hrefs, slugs, phone links, image paths stay as strings
//
// • These two helpers are called explicitly at render sites only for
//   human-readable display text.  They are NEVER called on machine values.
//
// • The old recursive localizeObjectNumbers/walk approach is intentionally
//   removed: it converted numeric fields to digit strings, breaking
//   AnimatedCounter (NaN), and risked corrupting URLs / slugs.

import type { Locale } from "./l10n";

const LOCALE_TAG: Record<Locale, string> = {
  fa: "fa-IR",
  ps: "fa-AF",
  en: "en-US",
};

const PERSIAN_DIGITS = "۰۱۲۳۴۵۶۷۸۹";
const PASHTO_DIGITS  = "۰۱۲۳۴۵۶۷۸۹";

/**
 * Convert ASCII digit characters inside a human-readable display string to
 * locale-specific digits.
 *
 * Use this ONLY for display strings (qualification years, achievement text,
 * etc.).  Never use it on URLs, slugs, IDs, phone links or any machine value.
 *
 * Examples:
 *   localizeDigits("2015 - 2018", "fa")  → "۲۰۱۵ - ۲۰۱۸"
 *   localizeDigits("2015 - 2018", "en")  → "2015 - 2018"
 */
export function localizeDigits(value: string, locale: Locale): string {
  if (!value) return value;

  switch (locale) {
    case "fa":
      return value.replace(/\d/g, (d) => PERSIAN_DIGITS[Number(d)]);
    case "ps":
      return value.replace(/\d/g, (d) => PASHTO_DIGITS[Number(d)]);
    case "en":
    default:
      return value;
  }
}

/**
 * Format a JS number for human-readable display in the given locale.
 *
 * Uses Intl.NumberFormat – always call with a real JS number, never a string.
 *
 * Examples:
 *   localizeNumber(8,    "fa")  → "۸"
 *   localizeNumber(1000, "fa")  → "۱٬۰۰۰"
 *   localizeNumber(8,    "en")  → "8"
 */
export function localizeNumber(value: number, locale: Locale): string {
  return new Intl.NumberFormat(LOCALE_TAG[locale]).format(value);
}