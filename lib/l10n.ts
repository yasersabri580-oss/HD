export type Locale = 'fa' | 'en' | 'ps'

export const DEFAULT_LOCALE: Locale = 'fa'
export const LANGUAGE_COOKIE_KEY = 'site_language'
export const LANGUAGE_STORAGE_KEY = 'site_language'

export type LocalizedValue =
  | string
  | {
      fa?: string | null
      en?: string | null
      ps?: string | null
    }
  | null
  | undefined

export function isLocale(value: unknown): value is Locale {
  return value === 'fa' || value === 'en' || value === 'ps'
}

export function normalizeLocale(value?: string | null): Locale {
  return isLocale(value) ? value : DEFAULT_LOCALE
}

export function getDir(locale: Locale): 'rtl' | 'ltr' {
  return locale === 'en' ? 'ltr' : 'rtl'
}

export function t(value: LocalizedValue, locale: Locale = DEFAULT_LOCALE): string {
  if (!value) return ''
  if (typeof value === 'string') return value

  return (
    value[locale] ??
    value.fa ??
    value.en ??
    value.ps ??
    ''
  )
}
export function buildLocalizedHref(
  currentPathname: string,
  locale: Locale,
  search: string, // expected to include '?' if present
): string {
  // Normalise current pathname (no trailing slash)
  const cleanPath = currentPathname.replace(/\/$/, '')
  const segments = cleanPath.split('/')
  // Remove existing locale prefix if present
  if (segments[1] && isLocale(segments[1])) {
    segments.splice(1, 1)
  }

  // Build new pathname
  let newPath: string
  if (locale === DEFAULT_LOCALE) {
    newPath = segments.join('/') || '/'
  } else {
    // Insert locale after the first empty segment
    segments.splice(1, 0, locale)
    newPath = segments.join('/')
  }

  // Ensure leading slash
  if (!newPath.startsWith('/')) newPath = '/' + newPath

  // Append search (if any)
  if (search && search !== '?') {
    newPath += search.startsWith('?') ? search : `?${search}`
  }

  return newPath
}
export function getLocaleFromPathname(pathname: string): Locale | null {
  // Remove a trailing slash if present
  const segments = pathname.replace(/\/$/, '').split('/')
  const firstSegment = segments[1] // segments[0] is empty string (starts with /)

  if (isLocale(firstSegment)) {
    return firstSegment
  }
  return null
}
export function readStoredLocale(): Locale {
  if (typeof window === 'undefined') return DEFAULT_LOCALE

  try {
    const fromStorage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY)
    if (isLocale(fromStorage)) return fromStorage
  } catch {}

  try {
    const cookie = document.cookie
      ?.split('; ')
      .find((item) => item.startsWith(`${LANGUAGE_COOKIE_KEY}=`))

    const value = cookie
      ? decodeURIComponent(cookie.split('=').slice(1).join('='))
      : ''

    if (isLocale(value)) return value
  } catch {}

  return DEFAULT_LOCALE
}

export function persistLocale(locale: Locale): void {
  if (typeof window === 'undefined') return

  try {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, locale)
  } catch {}

  try {
    const maxAge = 60 * 60 * 24 * 365
    document.cookie = `${LANGUAGE_COOKIE_KEY}=${encodeURIComponent(locale)}; Path=/; Max-Age=${maxAge}; SameSite=Lax`
  } catch {}
}

export function getCookieLocale(cookieValue?: string | null): Locale {
  return normalizeLocale(cookieValue)
}