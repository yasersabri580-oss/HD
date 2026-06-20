'use client'

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { getDir, persistLocale, type Locale } from '../lib/l10n'

type LanguageContextValue = {
  locale: Locale
  setLocale: (locale: Locale) => void
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

function applyDocumentLocale(locale: Locale) {
  if (typeof document === 'undefined') return

  const html = document.documentElement
  html.lang = locale
  html.dir = getDir(locale)
}

export function LanguageProvider({
  initialLocale,
  children,
}: {
  initialLocale: Locale
  children: React.ReactNode
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale)

  useEffect(() => {
    persistLocale(locale)
    applyDocumentLocale(locale)
  }, [locale])

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
  }, [])

  const value = useMemo(
    () => ({
      locale,
      setLocale,
    }),
    [locale, setLocale],
  )

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLocale() {
  const ctx = useContext(LanguageContext)
  if (!ctx) {
    throw new Error('useLocale must be used inside LanguageProvider')
  }
  return ctx
}