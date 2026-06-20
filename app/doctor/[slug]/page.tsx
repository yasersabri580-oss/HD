import Image from "next/image";
import { notFound } from "next/navigation";
import { headers } from "next/headers";

import { supabase } from "../../../lib/supabase";
import { getLocalizedProfile, mapHeroImages, resolveLocale } from "../../../lib/profile-fallback";
import { heroGallery as staticHeroGallery, site as staticSite } from "../../../lib/site-data";
import { getDoctor } from "../../../lib/doctors";

// (getDoctor moved to lib/doctors.ts)

// ------------------------
// SEO Metadata (Next.js 15 FIXED)
// ------------------------
export async function generateMetadata({ params, searchParams }: any) {
  const slug = params.slug;
  const doctor = await getDoctor(slug);

  if (!doctor) return { title: 'Doctor not found' };

  const profile = doctor.doctor_profile;
  const locale = searchParams?.lang ? resolveLocale(searchParams.lang) : 'fa';
  const localized = getLocalizedProfile(profile, locale, staticSite);

  return {
    title: localized.seoTitle || localized.fullName || 'Doctor',
    description: localized.seoDescription || localized.heroCopy || '',
    openGraph: {
      title: localized.ogTitle || localized.fullName || 'Doctor',
      description: localized.seoDescription || localized.heroCopy || '',
      type: 'profile',
    },
  };
}

// ------------------------
// PAGE
// ------------------------
export default async function DoctorPage({ params, searchParams }: any) {
  const { slug } = params

  const doctor = await getDoctor(slug)
  if (!doctor) notFound()

  const profile = doctor.doctor_profile

  // Determine locale: query param > referer prefix > accept-language > default
  let locale = searchParams?.lang
  if (!locale) {
    const h = await headers()
    const referer = h.get('referer') || ''
    if (referer.includes('/ps')) locale = 'ps'
    else {
      const al = (h.get('accept-language') || '').toLowerCase()
      if (al.includes('ps')) locale = 'ps'
      else if (al.includes('en')) locale = 'en'
      else locale = 'fa'
    }
  }

  const localized = getLocalizedProfile(profile, locale, staticSite)

  // Fetch hero images for this doctor and map with static fallbacks
  const { data: heroImages } = await supabase
    .from('hero_images')
    .select('*')
    .order('sort_order', { ascending: true })

  const gallery = mapHeroImages(heroImages || [], staticHeroGallery)

  return (
    <main className="page-wrap">
      {/* HERO */}
      <section>
        <h1>{localized.fullName}</h1>
        <p>{localized.tagline}</p>

        <h3>{localized.heroTitle}</h3>
        <p>{localized.heroCopy}</p>

        <button>{localized.primaryCta}</button>

        <div className="avatar-220">
          <Image src={gallery.doctor} alt={localized.fullName} width={220} height={220} className="media-image" />
        </div>
      </section>

      {/* ABOUT */}
      <section className="mt-40">
        <h2>About</h2>
        <p>{localized.aboutParagraph}</p>
      </section>

      {/* EXPERIENCE */}
      <section className="mt-20">
        <h3>Experience</h3>
        <p>{localized.experienceYears} {locale === 'en' ? 'years' : 'سال'}</p>
      </section>

      {/* MISSION */}
      <section className="mt-20">
        <h3>Mission</h3>
        <p>{localized.mission}</p>
      </section>

      {/* SEO DEBUG (optional admin view) */}
      <section className="mt-40 small-muted">
        <p>SEO Title: {localized.seoTitle}</p>
        <p>SEO Description: {localized.seoDescription}</p>
        <p>Slug: {doctor.slug}</p>
        <p>Doctor ID: {doctor.id}</p>
      </section>

      {/* JSON-LD (Google Schema) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Physician',
            name: localized.fullName,
            description: localized.seoDescription,
            url: `https://your-domain.com/doctor/${doctor.slug}`,
          }),
        }}
      />
    </main>
  )
}