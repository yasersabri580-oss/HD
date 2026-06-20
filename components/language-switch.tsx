'use client'

import { useRouter } from 'next/navigation'
import { useLocale } from '../components/language-provider'
import { persistLocale, type Locale } from '../lib/l10n'

export function LanguageSwitch() {
  const router = useRouter()
  const { locale, setLocale } = useLocale()

  const switchLanguage = (nextLocale: Locale) => {
    if (nextLocale === locale) return

    persistLocale(nextLocale)
    setLocale(nextLocale)

    router.refresh()
  }

  return (
    <div className="lang-switch" aria-label="تغییر زبان">
      <button
        type="button"
        className={locale === 'fa' ? 'is-active' : ''}
        onClick={() => switchLanguage('fa')}
      >
        دری
      </button>

      <button
        type="button"
        className={locale === 'ps' ? 'is-active' : ''}
        onClick={() => switchLanguage('ps')}
      >
        پښتو
      </button>

      <button
        type="button"
        className={locale === 'en' ? 'is-active' : ''}
        onClick={() => switchLanguage('en')}
      >
        EN
      </button>
    </div>
  )
}