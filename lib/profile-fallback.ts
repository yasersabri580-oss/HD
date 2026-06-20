import { heroGallery as staticHeroGallery, site as staticSite } from './site-data'

export type Locale = 'fa' | 'en' | 'ps'

const LOCALE_ORDER: Record<Locale, string[]> = {
  fa: ['fa', 'en', 'ps'],
  en: ['en', 'fa', 'ps'],
  ps: ['ps', 'fa', 'en'],
}

export function resolveLocale(preferred?: string): Locale {
  if (!preferred) return 'fa'
  const p = String(preferred).toLowerCase()
  if (p.startsWith('ps')) return 'ps'
  if (p.startsWith('en')) return 'en'
  if (p.startsWith('fa') || p.startsWith('prs')) return 'fa'
  return 'fa'
}

// Generic picker that handles both separate-language columns (e.g. title_ps)
// and JSON-like fields (e.g. { fa: '', en: '', ps: '' }). Returns empty string
// when no value is found.
export function pickLocalized(obj: any, fieldBase: string, preferredLocale?: string): string {
  if (!obj) return ''
  const locale = resolveLocale(preferredLocale)

  // 1) direct string field
  const direct = obj[fieldBase]
  if (typeof direct === 'string' && direct.trim()) return direct

  // 2) JSON-like object e.g. { fa: '..', en: '..' }
  if (direct && typeof direct === 'object') {
    for (const code of LOCALE_ORDER[locale]) {
      const v = direct[code]
      if (typeof v === 'string' && v.trim()) return v
    }
  }

  // 3) language-suffixed fields like `fieldBase_ps`, `fieldBase_fa`, etc.
  for (const code of LOCALE_ORDER[locale]) {
    const key = `${fieldBase}_${code}`
    if (typeof obj[key] === 'string' && obj[key].trim()) return obj[key]
  }

  // 4) try any of the known suffixes in fallback order
  for (const code of ['fa', 'en', 'ps']) {
    const key = `${fieldBase}_${code}`
    if (typeof obj[key] === 'string' && obj[key].trim()) return obj[key]
  }

  // 5) fall back to any property that starts with the base
  const candidates = Object.keys(obj).filter((k) => k.startsWith(fieldBase) && typeof obj[k] === 'string' && obj[k].trim())
  if (candidates.length > 0) return obj[candidates[0]]

  return ''
}

export function mapHeroImages(images: any[] = [], staticGallery = staticHeroGallery) {
  if (!images || images.length === 0) return staticGallery
  const find = (key: string) => images.find((i: any) => i.key_name === key && (i.is_active ?? true))
  return {
    hero: find('hero')?.storage_url || staticGallery.hero,
    doctor: find('doctor')?.storage_url || staticGallery.doctor,
    patientTrust: find('patient_trust')?.storage_url || staticGallery.patientTrust,
    reception: find('reception')?.storage_url || staticGallery.reception,
    consultation: find('consultation')?.storage_url || staticGallery.consultation,
  }
}

// Return a rendered, locale-resolved profile object suitable for pages.
export function getLocalizedProfile(profile: any, preferredLocale?: string, fallbackStatic = staticSite) {
  const locale = resolveLocale(preferredLocale)
  return {
    fullName: pickLocalized(profile, 'full_name', locale) || pickLocalized(profile, 'full_name_fa', locale) || fallbackStatic.brand || '',
    tagline: pickLocalized(profile, 'tagline', locale) || fallbackStatic.tagline || '',
    heroTitle: pickLocalized(profile, 'hero_title', locale) || fallbackStatic.heroTitle || '',
    heroCopy: pickLocalized(profile, 'hero_copy', locale) || fallbackStatic.heroCopy || '',
    primaryCta: pickLocalized(profile, 'primary_cta', locale) || fallbackStatic.primaryCta || '',
    secondaryCta: pickLocalized(profile, 'secondary_cta', locale) || fallbackStatic.secondaryCta || '',
    aboutParagraph: pickLocalized(profile, 'about_paragraph', locale) || '',
    mission: pickLocalized(profile, 'mission', locale) || '',
    experienceYears: profile?.experience_years ?? fallbackStatic.experienceYears ?? null,
    seoTitle: pickLocalized(profile, 'seo_title', locale) || profile?.seo_title || fallbackStatic.brand || '',
    seoDescription: pickLocalized(profile, 'seo_description', locale) || profile?.seo_description || fallbackStatic.heroCopy || '',
    ogTitle: pickLocalized(profile, 'og_title', locale) || profile?.og_title || fallbackStatic.brand || '',
  }
}
