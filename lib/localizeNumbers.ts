// utils/localizeNumbers.ts

import { Locale } from "../lib/l10n";

const PERSIAN_DIGITS = "۰۱۲۳۴۵۶۷۸۹";
const PASHTO_DIGITS = "۰۱۲۳۴۵۶۷۸۹";
const ENGLISH_DIGITS = "0123456789";

/**
 * Keys that should NEVER be localized.
 * They contain machine-readable values.
 */
const PROTECTED_KEYS = new Set([
  "id",
  "doctor_id",
  "sort_order",

  "url",
  "href",
  "src",
  "storage_url",
  "image",
  "imageUrl",
  "thumbnail",
  "avatar",
  "icon",
  "icon_name",

  "slug",
  "path",
  "route",

  "filename",
  "fileName",

  "email",
  "phone",
  "phone_link",
  "phoneLink",
  "whatsapp",
  "whatsapp_url",
  "whatsAppUrl",

  "website",

  "created_at",
  "updated_at",
]);

function isProtectedString(value: string): boolean {
  const v = value.trim();

  return (
    /^https?:\/\//i.test(v) ||
    /^ftp:\/\//i.test(v) ||
    /^file:\/\//i.test(v) ||

    /^mailto:/i.test(v) ||
    /^tel:/i.test(v) ||
    /^sms:/i.test(v) ||
    /^whatsapp:/i.test(v) ||

    v.startsWith("/") ||

    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ||

    /\.(jpg|jpeg|png|gif|webp|svg|ico|pdf|mp4|mov|avi|zip)$/i.test(v)
  );
}

export function localizeDigits(
  value: string,
  locale: Locale,
): string {

  if (!value) return value;

  if (isProtectedString(value))
    return value;

  switch (locale) {

    case "fa":
      return value.replace(/\d/g, d => PERSIAN_DIGITS[Number(d)]);

    case "ps":
      return value.replace(/\d/g, d => PASHTO_DIGITS[Number(d)]);

    case "en":
    default:
      return value.replace(/[۰-۹]/g, ch =>
        ENGLISH_DIGITS[PERSIAN_DIGITS.indexOf(ch)]
      );
  }
}

export function localizeObjectNumbers<T>(
  data: T,
  locale: Locale,
): T {

  return walk(data, locale) as T;
}

function walk(value: any, locale: Locale, key?: string): any {

  if (value == null)
    return value;

  if (key && PROTECTED_KEYS.has(key))
    return value;

  if (typeof value === "string")
    return localizeDigits(value, locale);

  if (typeof value === "number")
    return localizeDigits(value.toString(), locale);

  if (Array.isArray(value))
    return value.map(item => walk(item, locale));

  if (typeof value === "object") {

    const obj: Record<string, any> = {};

    for (const [k, v] of Object.entries(value)) {
      obj[k] = walk(v, locale, k);
    }

    return obj;
  }

  return value;
}