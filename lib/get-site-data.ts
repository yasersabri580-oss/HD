import { unstable_cache } from 'next/cache'
import { type Locale, t } from '../lib/l10n'
import { supabase } from './supabase'
import {
  aboutHighlights as staticAboutHighlights,
  achievements as staticAchievements,
  appointmentOptions as staticAppointmentOptions,
  contact as staticContact,
  faqs as staticFaqs,
  heroGallery as staticHeroGallery,
  qualifications as staticQualifications,
  services as staticServices,
  site as staticSite,
  stats as staticStats,
  technologyHighlights as staticTechHighlights,
  testimonials as staticTestimonials,
} from './site-data'


type RawSiteData = {
  profile: any
  services: any[]
  stats: any[]
  aboutHighlights: any[]
  techHighlights: any[]
  qualifications: any[]
  achievements: any[]
  faqs: any[]
  appointmentOptions: any[]
  contact: any
  socialLinks: any[]
  heroImages: any[]
  reviews: any[]
  articles: any[]
}
const DOCTOR_ID = process.env.NEXT_PUBLIC_DOCTOR_ID ?? ''
async function fetchRawSiteData(): Promise<RawSiteData> {
  const [
    profile,
    servicesData,
    statsData,
    aboutHighlightsData,
    techHighlightsData,
    qualificationsData,
    achievementsData,
    faqsData,
    appointmentOptionsData,
    contactData,
    socialLinksData,
    heroImagesData,
    reviewsData,
    articlesData,
  ] = await Promise.allSettled([
   supabase
  .from('doctor_profile')
  .select('*')
  .eq('doctor_id', DOCTOR_ID)
  .single(),
    supabase.from('services').select('*').order('sort_order', { ascending: true }),
    supabase.from('stats').select('*').order('sort_order', { ascending: true }),
    supabase.from('about_highlights').select('*').order('sort_order', { ascending: true }),
    supabase.from('technology_highlights').select('*').order('sort_order', { ascending: true }),
    supabase.from('qualifications').select('*').order('sort_order', { ascending: true }),
    supabase.from('achievements').select('*').order('sort_order', { ascending: true }),
    supabase.from('faqs').select('*').order('sort_order', { ascending: true }),
    supabase.from('appointment_options').select('*').order('sort_order', { ascending: true }),
    supabase.from('contact_info').select('*').eq('id', 1).single(),
    supabase.from('social_links').select('*').order('sort_order', { ascending: true }),
    supabase.from('hero_images').select('*').order('sort_order', { ascending: true }),
    supabase.from('reviews').select('*').order('sort_order', { ascending: true }),
    supabase.from('articles').select('*').order('sort_order', { ascending: true }),
  ])
  

 const unwrap = <T,>(r: PromiseSettledResult<any>, fallback: T): T => {
  if (r.status === 'fulfilled' && r.value != null) {
    // Supabase response shape: { data, error }
    if (r.value.data !== undefined) {
      // If data is null/undefined, use fallback
      return (r.value.data ?? fallback) as T;
    }
    // Non‑Supabase value (e.g., static fallback)
    return r.value as T;
  }
  return fallback;
};

  const articles = unwrap(articlesData, [] as any[]).filter((a: any) => a.is_published)
  const heroImages = unwrap(heroImagesData, []) as any[];
  return {
    profile: unwrap(profile, null),
    services: unwrap(servicesData, []) as any[],
    stats: unwrap(statsData, []) as any[],
    aboutHighlights: unwrap(aboutHighlightsData, []) as any[],
    techHighlights: unwrap(techHighlightsData, []) as any[],
    qualifications: unwrap(qualificationsData, []) as any[],
    achievements: unwrap(achievementsData, []) as any[],
    faqs: unwrap(faqsData, []) as any[],
    appointmentOptions: unwrap(appointmentOptionsData, []) as any[],
    contact: unwrap(contactData, null),
    socialLinks: unwrap(socialLinksData, []) as any[],
    heroImages: unwrap(heroImagesData, []) as any[],
    reviews: unwrap(reviewsData, []) as any[],
    articles,
  }
}

const getRawSiteData = unstable_cache(fetchRawSiteData, ['doctor-site-data'], {
  revalidate: 86400, // 1 day
})

function pickSpecific(jsonb: any, lang: Locale): string {
 
  if (!jsonb) return ''
  if (typeof jsonb === 'string') return jsonb
  return jsonb[lang] || jsonb.fa || jsonb.en || jsonb.ps || ''
}

export async function getSiteData(locale: Locale) {
  const raw = await getRawSiteData()
  const profile = raw.profile?.data ?? raw.profile

  const site = {
    profile,
    ...staticSite,
    brand: pickSpecific(profile?.full_name, locale) || staticSite.brand,
    brand_en: pickSpecific(profile?.full_name, 'en') || (staticSite as any).brand_en || staticSite.brand,
    brandSubline: pickSpecific(profile?.brand_subline, locale) || staticSite.brandSubline,
    brandSubline_en: pickSpecific(profile?.brand_subline, 'en') || (staticSite as any).brandSubline_en || staticSite.brandSubline,
    tagline: pickSpecific(profile?.tagline, locale) || staticSite.tagline,
    heroTitle: pickSpecific(profile?.hero_title, locale) || staticSite.heroTitle,
    heroCopy: pickSpecific(profile?.hero_copy, locale) || staticSite.heroCopy,
    primaryCta: pickSpecific(profile?.primary_cta, locale) || staticSite.primaryCta,
    secondaryCta: pickSpecific(profile?.secondary_cta, locale) || staticSite.secondaryCta,
    mission: pickSpecific(profile?.mission, locale) || staticSite.mission,
    schedule: pickSpecific(profile?.schedule, locale) || staticSite.schedule,
    footerCopy: pickSpecific(profile?.footer_copy, locale) || staticSite.footerCopy,
    experienceYears: profile?.experience_years ?? staticSite.experienceYears,
    quickLinks: staticSite.quickLinks,
  }

  const mapText = (value: any) => pickSpecific(value, locale)

  const services = raw.services.map((s: any) => ({
    iconName: s.icon_name,
    title: mapText(s.title),
    text: mapText(s.body),
  }))

  const stats = raw.stats.map((s: any) => ({
    value: s.value,
    suffix: s.suffix,
    label: mapText(s.label),
    note: mapText(s.note),
  }))

  const aboutHighlights = raw.aboutHighlights.map((h: any) => ({
    title: mapText(h.title),
    text: mapText(h.body),
  }))

  const technologyHighlights = raw.techHighlights.map((h: any) => ({
    title: mapText(h.title),
    text: mapText(h.body),
  }))

  const qualifications = raw.qualifications.map((q: any) => ({
    year: q.year || q.year_label || '',
    title: mapText(q.title),
    text: mapText(q.body),
  }))

  const achievements = raw.achievements.map((a: any) =>
    typeof a === 'string' ? a : mapText(a.text),
  )

  const faqs = raw.faqs.map((f: any) => ({
    question: mapText(f.question),
    answer: mapText(f.answer),
  }))

  const appointmentOptions = raw.appointmentOptions.map((o: any) => ({
    iconName: o.icon_name,
    title: mapText(o.title),
    text: mapText(o.body),
  }))

  const contact = raw.contact
    ? {
        phoneDisplay: raw.contact.phone_display,
        phoneLink: raw.contact.phone_link,
        whatsAppUrl: raw.contact.whatsapp_url,
        address: mapText(raw.contact.address),
      }
    : staticContact

  // Group images by key, storing url + localised alt
  const heroImagesByKey = raw.heroImages
    .filter((i: any) => i.is_active ?? true)
    .reduce<Record<string, { url: string; alt: string }[]>>((acc, img) => {
      const key = img.key_name;
      if (!acc[key]) acc[key] = [];
      acc[key].push({
        url: img.storage_url,
        alt: pickSpecific(img.alt_text, locale) || '',
      });
      return acc;
    }, {});

  // Single-image object (keeps backward compatibility)
  const heroGallery = {
    hero: heroImagesByKey.hero?.[0]?.url || staticHeroGallery.hero,
    doctor: heroImagesByKey.doctor?.[0]?.url || staticHeroGallery.doctor,
    patientTrust: heroImagesByKey.patient_trust?.[0]?.url || staticHeroGallery.patientTrust,
    reception: heroImagesByKey.reception?.[0]?.url || staticHeroGallery.reception,
    consultation: heroImagesByKey.consultation?.[0]?.url || staticHeroGallery.consultation,
    lab: heroImagesByKey.lab?.[0]?.url || staticHeroGallery.lab,
    dashboard: heroImagesByKey.dashboard?.[0]?.url || staticHeroGallery.dashboard,
    ecg: heroImagesByKey.ecg?.[0]?.url || staticHeroGallery.ecg,
    anatomy: heroImagesByKey.anatomy?.[0]?.url || staticHeroGallery.anatomy,
    procedure: heroImagesByKey.procedure?.[0]?.url || staticHeroGallery.procedure,
    appointment: heroImagesByKey.appointment?.[0]?.url || staticHeroGallery.appointment,
    seminar: heroImagesByKey.seminar?.[0]?.url || staticHeroGallery.seminar,
  };

  const testimonials = raw.reviews.map((t: any) => ({
    name: t?.patient_name || t?.name || t?.full_name || '',
    role: mapText(t?.role) || t?.role || '',
    quote: mapText(t?.quote) || t?.quote || '',
    rating: t?.rating ?? 5,
  }))





  const socialLinks = raw.socialLinks.map((l: any) => ({
    label: l.label,
    href: l.href,
    iconName: l.icon_name,
  }))

 return {
    site,
    services,
    stats,
    aboutHighlights,
    technologyHighlights,
    qualifications,
    achievements,
    faqs,
    appointmentOptions,
    contact,
    heroGallery,
    heroImagesByKey,
    testimonials,
    socialLinks,
  };
}