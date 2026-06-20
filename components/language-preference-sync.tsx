'use client'

import { useEffect, useRef } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import {
  DEFAULT_LOCALE,
  buildLocalizedHref,
  getLocaleFromPathname,
  readStoredLocale,
  persistLocale,
  type Locale,
} from '../lib/l10n'

function applyDocumentLocale(locale: Locale) {
  if (typeof document === 'undefined') return

  const html = document.documentElement
  html.lang = locale
  html.dir = locale === 'en' ? 'ltr' : 'rtl'
}

export function LanguagePreferenceSync() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()
  const lastSyncedKeyRef = useRef<string | null>(null)

  useEffect(() => {
    if (!pathname) return

    const search = searchParams?.toString()
      ? `?${searchParams.toString()}`
      : ''
    const syncKey = `${pathname}${search}`

    if (lastSyncedKeyRef.current === syncKey) return
    lastSyncedKeyRef.current = syncKey

    const urlLocale = getLocaleFromPathname(pathname)

    if (urlLocale) {
      persistLocale(urlLocale)
      applyDocumentLocale(urlLocale)
      return
    }

    const storedLocale = readStoredLocale() ?? DEFAULT_LOCALE
    applyDocumentLocale(storedLocale)

    if (storedLocale !== DEFAULT_LOCALE) {
      const target = buildLocalizedHref(pathname, storedLocale, search)
      router.replace(target, { scroll: false })
      return
    }

    persistLocale(DEFAULT_LOCALE)
  }, [pathname, router, searchParams])

  return null
}