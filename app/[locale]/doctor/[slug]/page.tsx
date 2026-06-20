import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { Navbar } from "../../../../components/navbar";
import { Footer } from "../../../../components/footer";
import { SectionHeading } from "../../../../components/section-heading";
import { StatCard } from "../../../../components/stat-card";
import {
  ArrowLeftIcon,
  PhoneIcon,
  WhatsappIcon,
  CheckIcon,
  HeartIcon,
  LabIcon,
  CalendarIcon,
  PulseIcon,
  ShieldIcon,
} from "../../../../components/icons";

import { getDoctor } from "../../../../lib/doctors";
import { getSiteData } from "../../../../lib/get-site-data";
import { getAboutHighlights } from "../../../../lib/about-highlights";
import { getLocalizedProfile } from "../../../../lib/profile-fallback";
import { site as staticSite } from "../../../../lib/site-data";
import { isLocale, t, type Locale } from "../../../../lib/l10n";

// ── Helpers ──────────────────────────────────────────────────────────────────

type PageParams = Promise<{ locale: string; slug: string }>;

const SPECIALTY = {
  fa: "متخصص داخله قلب (آنژیوگرافی و آنژیوپلاستی)",
  en: "Cardiologist & Interventional Cardiology Specialist",
  ps: "د زړه داخلي ناروغیو متخصص (انجیوګرافي او انجیوپلاستي)",
} as const;

const copy = {
  backHome: {
    fa: "بازگشت به صفحه اصلی",
    en: "Back to Home",
    ps: "کور پاڼې ته ستنیدل",
  },
  about: {
    fa: "درباره داکتر",
    en: "About the Doctor",
    ps: "د ډاکټر په اړه",
  },
  qualifications: {
    fa: "تحصیلات و صلاحیت‌ها",
    en: "Education & Qualifications",
    ps: "تعلیم او صلاحیتونه",
  },
  qualificationsSubtitle: {
    fa: "مسیر علمی و حرفه‌ای با معیار بین‌المللی.",
    en: "An academic and professional path with international standards.",
    ps: "علمي او مسلکي لاره له نړیوالو معیارونو سره.",
  },
  achievements: {
    fa: "افتخارات و دستاوردها",
    en: "Achievements & Awards",
    ps: "لاسته راوړنې او جایزې",
  },
  achievementsSubtitle: {
    fa: "شناخت‌ها و تقدیرنامه‌های کسب شده در مسیر حرفه‌ای.",
    en: "Recognitions and commendations earned throughout the professional journey.",
    ps: "د مسلکي لارې پرمهال ترلاسه شوي پیژندنې او جایزې.",
  },
  services: {
    fa: "خدمات تخصصی",
    en: "Specialized Services",
    ps: "ځانګړي خدمات",
  },
  servicesSubtitle: {
    fa: "طیف کامل خدمات تشخیصی و مداخلوی قلب.",
    en: "Full range of diagnostic and interventional cardiac services.",
    ps: "د زړه تشخیصي او مداخله‌يي خدمتونو بشپړ لړ.",
  },
  stats: {
    fa: "شاخص‌های عملکرد",
    en: "Performance Indicators",
    ps: "د فعالیت شاخصونه",
  },
  statsSubtitle: {
    fa: "اعداد نمایانگر تجربه و ثبات خدمات هستند.",
    en: "Numbers reflecting experience and service consistency.",
    ps: "شمیرې چې تجربه او د خدمتونو ثبات ښیي.",
  },
  bookAppointment: {
    fa: "گرفتن وقت ملاقات",
    en: "Book an Appointment",
    ps: "وقت اخیستل",
  },
  bookViaWhatsApp: {
    fa: "گرفتن وقت از واتساپ",
    en: "Book via WhatsApp",
    ps: "د واټساپ له لارې نوبت",
  },
  directCall: {
    fa: "تماس مستقیم",
    en: "Direct Call",
    ps: "مستقیم تماس",
  },
  ctaTitle: {
    fa: "آماده‌اید قدم اول را بردارید؟",
    en: "Ready to Take the First Step?",
    ps: "آیا تاسو د لومړي ګام اخیستو چمتو یاست؟",
  },
  ctaSubtitle: {
    fa: "برای وقت ملاقات، مشاوره یا پیگیری، همین حالا تماس بگیرید.",
    en: "Contact us now for an appointment, consultation, or follow-up.",
    ps: "د وقت، مشورې یا تعقیب لپاره همدا اوس اړیکه ونیسئ.",
  },
  years: {
    fa: "سال",
    en: "years",
    ps: "کاله",
  },
  experience: {
    fa: "تجربه",
    en: "experience",
    ps: "تجربه",
  },
} as const;

function getServiceIcon(iconName: string) {
  switch (iconName) {
    case "HeartIcon": return <HeartIcon />;
    case "LabIcon": return <LabIcon />;
    case "CalendarIcon": return <CalendarIcon />;
    case "PulseIcon": return <PulseIcon />;
    case "ShieldIcon": return <ShieldIcon />;
    case "PhoneIcon": return <PhoneIcon />;
    default: return <HeartIcon />;
  }
}

// ── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: { params: PageParams }): Promise<Metadata> {
  const { slug, locale: rawLocale } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : "fa";

  try {
    const doctor = await getDoctor(slug);
    if (!doctor) return { title: "Doctor not found" };

    const localized = getLocalizedProfile(doctor.doctor_profile, locale, staticSite);

    return {
      title: localized.seoTitle || localized.fullName || "Doctor",
      description: localized.seoDescription || localized.heroCopy || "",
      openGraph: {
        title: localized.ogTitle || localized.fullName || "Doctor",
        description: localized.seoDescription || "",
        type: "profile",
      },
    };
  } catch {
    return { title: "Doctor Profile" };
  }
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default async function DoctorProfilePage({ params }: { params: PageParams }) {
  const { slug, locale: rawLocale } = await params;

  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;

  // Fetch doctor + full site data in parallel
  const [doctorResult, siteDataResult, aboutHighlightsResult] = await Promise.allSettled([
    getDoctor(slug),
    getSiteData(locale),
    getAboutHighlights({ locale }),
  ]);

  const doctor = doctorResult.status === "fulfilled" ? doctorResult.value : null;
  if (!doctor) notFound();

  const siteData = siteDataResult.status === "fulfilled" ? siteDataResult.value : null;
  const aboutHighlights =
    aboutHighlightsResult.status === "fulfilled" ? aboutHighlightsResult.value : [];

  const localized = getLocalizedProfile(doctor.doctor_profile, locale, staticSite);

  const site = siteData?.site ?? staticSite;
  const heroGallery = siteData?.heroGallery;
  const services = siteData?.services ?? [];
  const stats = siteData?.stats ?? [];
  const qualifications = siteData?.qualifications ?? [];
  const achievements = siteData?.achievements ?? [];
  const contact = siteData?.contact ?? { phoneDisplay: "", phoneLink: "", whatsAppUrl: "", address: "" };
  const socialLinks = siteData?.socialLinks ?? [];

  const doctorImage = heroGallery?.doctor || "";
  const isRtl = locale !== "en";
  const homeHref = locale === "fa" ? "/" : `/${locale}`;

  return (
    <main className="site-shell">
      <React.Suspense fallback={<div />}>
        <Navbar site={site} />
      </React.Suspense>

      {/* ── Profile Hero ─────────────────────────────── */}
      <section className="doctor-hero section" id="top">
        <div className="container doctor-hero-layout">
          {/* Copy */}
          <div className="doctor-hero-copy" data-reveal>
            <Link href={homeHref} className="back-nav">
              <ArrowLeftIcon />
              {t(copy.backHome, locale)}
            </Link>

            <p className="hero-tag">❤ {t(SPECIALTY, locale)}</p>

            <h1>{localized.fullName || site.brand}</h1>

            <p className="doctor-tagline">
              {localized.heroCopy || site.heroCopy}
            </p>

            {/* Stat strip */}
            <div className="doctor-hero-stats">
              {localized.experienceYears && (
                <div className="doctor-hero-stat">
                  <strong>{localized.experienceYears}+</strong>
                  <span>
                    {t(copy.years, locale)} {t(copy.experience, locale)}
                  </span>
                </div>
              )}
              {stats.slice(0, 2).map((s: any) => (
                <div className="doctor-hero-stat" key={s.label}>
                  <strong>
                    {s.value}
                    {s.suffix ?? ""}
                  </strong>
                  <span>{s.label}</span>
                </div>
              ))}
            </div>

            <div className="doctor-hero-actions">
              <a
                className="button button-primary"
                href={contact.whatsAppUrl}
                target="_blank"
                rel="noreferrer"
              >
                {t(copy.bookViaWhatsApp, locale)}
                <WhatsappIcon />
              </a>
              <a
                className="button button-secondary"
                href={`tel:${contact.phoneLink}`}
              >
                {t(copy.directCall, locale)}
                <PhoneIcon />
              </a>
            </div>
          </div>

          {/* Photo */}
          {doctorImage && (
            <div className="doctor-hero-image" data-reveal>
              <Image
                src={doctorImage}
                alt={localized.fullName || "Doctor"}
                fill
                sizes="(max-width: 1024px) 80vw, 420px"
                className="media-image"
                priority
              />
            </div>
          )}
        </div>
      </section>

      {/* ── About ────────────────────────────────────── */}
      <section className="section section-soft" id="about">
        <div className="container">
          <SectionHeading
            eyebrow={t(copy.about, locale)}
            title={localized.fullName || site.brand}
            subtitle={localized.tagline || site.tagline}
          />

          <div className="doctor-about-layout" data-reveal>
            <div>
              <p style={{ lineHeight: 1.85, color: "var(--muted)", marginTop: 0 }}>
                {localized.aboutParagraph || site.heroCopy}
              </p>

              {localized.mission && (
                <div className="doctor-about-mission">
                  <p>"{localized.mission}"</p>
                </div>
              )}
            </div>

            {/* Highlights */}
            <div className="doctor-highlights-grid" style={{ marginTop: 0 }}>
              {aboutHighlights.map((h: any) => (
                <article key={h.title} className="doctor-highlight-card glass-card">
                  <div className="doctor-highlight-icon">
                    <CheckIcon />
                  </div>
                  <h3>{h.title}</h3>
                  <p>{h.text}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Services ─────────────────────────────────── */}
      {services.length > 0 && (
        <section className="section" id="services">
          <div className="container">
            <SectionHeading
              eyebrow={t(copy.services, locale)}
              title={t(copy.services, locale)}
              subtitle={t(copy.servicesSubtitle, locale)}
            />
            <div className="doctor-services-grid" data-reveal>
              {services.map((s: any) => (
                <article key={s.title} className="doctor-service-card glass-card">
                  {getServiceIcon(s.iconName || s.icon)}
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Stats ────────────────────────────────────── */}
      {stats.length > 0 && (
        <section className="section section-soft" id="stats">
          <div className="container">
            <SectionHeading
              eyebrow={t(copy.stats, locale)}
              title={t(copy.stats, locale)}
              subtitle={t(copy.statsSubtitle, locale)}
            />
            <div className="stats-grid" data-reveal>
              {stats.map((s: any) => (
                <StatCard key={s.label} {...s} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Qualifications ───────────────────────────── */}
      {qualifications.length > 0 && (
        <section className="section" id="qualifications">
          <div className="container">
            <SectionHeading
              eyebrow={t(copy.qualifications, locale)}
              title={t(copy.qualifications, locale)}
              subtitle={t(copy.qualificationsSubtitle, locale)}
            />
            <div className="timeline" data-reveal style={{ maxWidth: 720 }}>
              {qualifications.map((q: any) => (
                <article key={q.title} className="timeline-item">
                  <span className="timeline-year">{q.year}</span>
                  <div>
                    <h3>{q.title}</h3>
                    <p>{q.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Achievements ─────────────────────────────── */}
      {achievements.length > 0 && (
        <section className="section section-soft" id="achievements">
          <div className="container">
            <SectionHeading
              eyebrow={t(copy.achievements, locale)}
              title={t(copy.achievements, locale)}
              subtitle={t(copy.achievementsSubtitle, locale)}
            />
            <div className="doctor-achievements-grid" data-reveal>
              {achievements.map((item: any, i: number) => (
                <div key={i} className="doctor-achievement-item">
                  <span className="check-dot">
                    <CheckIcon />
                  </span>
                  <p>{typeof item === "string" ? item : item?.text || ""}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ──────────────────────────────────────── */}
      <section className="section" id="appointment">
        <div className="container">
          <div className="doctor-cta" data-reveal>
            <h2>{t(copy.ctaTitle, locale)}</h2>
            <p>{t(copy.ctaSubtitle, locale)}</p>
            <div className="doctor-cta-actions">
              <a
                className="button button-white"
                href={contact.whatsAppUrl}
                target="_blank"
                rel="noreferrer"
              >
                {t(copy.bookViaWhatsApp, locale)}
                <WhatsappIcon />
              </a>
              <a
                className="button button-outline-white"
                href={`tel:${contact.phoneLink}`}
              >
                {t(copy.directCall, locale)}
                <PhoneIcon />
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer
        site={site}
        footerCopy={(site as any).footerCopy}
        quickLinks={(site as any).quickLinks}
        socialLinks={socialLinks}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Physician",
            name: localized.fullName || site.brand,
            description: localized.seoDescription || "",
            medicalSpecialty: ["Cardiology", "Interventional Cardiology"],
            url: `https://drmohibullah.com/${locale}/doctor/${slug}`,
            telephone: contact.phoneDisplay,
            address: contact.address,
            image: doctorImage,
          }),
        }}
      />
    </main>
  );
}
