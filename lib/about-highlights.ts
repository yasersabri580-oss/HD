import { supabase } from './supabase'
import { aboutHighlights as staticAboutHighlights } from './site-data'
import { pickLocalized, resolveLocale } from './profile-fallback'

type AboutItem = { title: string; text: string }

const CACHE = new Map<string, { expires: number; data: AboutItem[] }>()

export async function getAboutHighlights(options?: { doctorId?: string | number; locale?: string; ttl?: number }) {
  const doctorId = options?.doctorId ?? process.env.NEXT_PUBLIC_DOCTOR_ID ?? ''
  const locale = resolveLocale(options?.locale)
  const ttl = options?.ttl ?? 60 * 5 // default 5 minutes

  const key = `${doctorId || 'global'}|${locale}`
  const now = Date.now()
  const cached = CACHE.get(key)
  if (cached && cached.expires > now) return cached.data

  try {
    const { data } = await supabase
      .from('about_highlights')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })

    if (!data || data.length === 0) {
      const out = staticAboutHighlights.map((h: any) => ({ title: h.title, text: h.text }))
      CACHE.set(key, { expires: now + ttl * 1000, data: out })
      return out
    }

    const mapped: AboutItem[] = data.map((row: any) => ({
      title: pickLocalized(row, 'title', locale) || '',
      text: pickLocalized(row, 'body', locale) || '',
    }))

    const useful = mapped.filter((m) => (m.title || m.text).trim())
    const result = useful.length > 0 ? mapped : staticAboutHighlights.map((h: any) => ({ title: h.title, text: h.text }))

    CACHE.set(key, { expires: now + ttl * 1000, data: result })
    return result
  } catch (err) {
    const out = staticAboutHighlights.map((h: any) => ({ title: h.title, text: h.text }))
    CACHE.set(key, { expires: now + ttl * 1000, data: out })
    return out
  }
}
