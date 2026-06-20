// lib/static-l10n.ts
import type { Locale, LocalizedValue } from './l10n'

export const staticL10n: {
  navbar: {
    mainNavigation: Record<Locale, string>
    toggleMenu: Record<Locale, string>
    languageSwitcher: Record<Locale, string>
  }
  languageNames: Record<Locale, string>
  pages: {
    about: {
      title: LocalizedValue
      description: LocalizedValue
    }
  }
} = {
  navbar: {
    mainNavigation: {
      fa: 'ناوبری اصلی',
      en: 'Main navigation',
      ps: 'اصلي ناوبري',
    },
    toggleMenu: {
      fa: 'باز و بسته کردن منو',
      en: 'Toggle menu',
      ps: 'مېنو پرانستل او بندول',
    },
    languageSwitcher: {
      fa: 'تغییر زبان',
      en: 'Change language',
      ps: 'ژبه بدلول',
    },
  },
  languageNames: {
    fa: 'دری',
    en: 'EN',
    ps: 'پښتو',
  },
  pages: {
    about: {
      title: {
        fa: 'درباره ما',
        en: 'About Us',
        ps: 'زموږ په اړه',
      },
      description: {
        fa: 'این بخش برای متن‌های ثابت است که از سرور نمی‌آیند و فقط با زبان فعلی نمایش داده می‌شوند.',
        en: 'This section is for static text that does not come from the server and is rendered by the current language.',
        ps: 'دا برخه د ثابت متن لپاره ده چې له سروره نه راځي او یوازې د روانې ژبې له مخې ښودل کېږي.',
      },
    },
  },
}