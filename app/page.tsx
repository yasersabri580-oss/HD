// app/page.tsx
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";

import { Navbar } from "../components/navbar";
import { SectionHeading } from "../components/section-heading";
import { StatCard } from "../components/stat-card";
import { FeatureCard } from "../components/feature-card";
import { TestimonialCard } from "../components/testimonial-card";

import {
  ArrowLeftIcon,
  CalendarIcon,
  CheckIcon,
  MapPinIcon,
  PhoneIcon,
  WhatsappIcon,
  HeartIcon,
  LabIcon,
  PulseIcon,
  ShieldIcon,
} from "../components/icons";
import { Footer, withLocale } from "../components/footer";
import { getSiteData } from "../lib/get-site-data";
import { getAboutHighlights } from "../lib/about-highlights";
import {
  LANGUAGE_COOKIE_KEY,
  getCookieLocale,
  t,
  type Locale,
} from "../lib/l10n";
import { FaqAccordion } from "../components/faq-accordion";
import { getAllArticlesByLocale } from "@/lib/articles";
import { getFeaturedArticleByLocale } from "@/lib/articles";
import TechImageGallery from "@/components/TechImageGallery";
import { url } from "inspector";

const pageCopy = {
  aboutDoctor: {
    fa: "درباره داکتر",
    en: "About the doctor",
    ps: "د ډاکټر په اړه",
  },
  servicesEyebrow: {
    fa: "خدمات تخصصی",
    en: "Specialized services",
    ps: "ځانګړي خدمات",
  },
  servicesTitle: {
    fa: "خدمات قلب با معیار ممتاز",
    en: "Premium standard heart care",
    ps: "د زړه خدمات د لوړ معیار سره",
  },
  servicesSubtitle: {
    fa: "خدمات به‌صورت یک مسیر تداوی کامل طراحی شده‌اند؛ از ارزیابی اولیه تا پیگیری بلندمدت.",
    en: "Services are designed as a complete care journey, from the initial evaluation to long-term follow-up.",
    ps: "خدمتونه د بشپړې درملنې د مسیر په توګه طرح شوي؛ له لومړنۍ ارزونې تر اوږدمهاله څارنې پورې.",
  },
  techEyebrow: {
    fa: "تخصص و تکنولوژی",
    en: "Expertise and technology",
    ps: "تخصص او ټکنالوژي",
  },
  techTitle: {
    fa: "ترکیب تجربه بالینی با فناوری مداخله‌ای مدرن",
    en: "Clinical experience combined with modern interventional technology",
    ps: "کلینیکي تجربه د عصري مداخله‌يي ټکنالوژۍ سره یوځای",
  },
  techSubtitle: {
    fa: "آنژیوگرافی، مانیتورینگ و تحلیل نتایج با رویکردی دقیق، ایمن و قابل پیگیری.",
    en: "Angiography, monitoring, and result analysis with a precise, safe, and traceable approach.",
    ps: "انجیوګرافي، څارنه او د پایلو تحلیل د دقیق، خوندي او تعقیب وړ طریقې سره.",
  },
  statsEyebrow: {
    fa: "شاخص‌های عملکرد",
    en: "Performance indicators",
    ps: "د فعالیت شاخصونه",
  },
  statsTitle: {
    fa: "نتایج قابل اتکا با معیاری پایدار",
    en: "Reliable results with a stable standard",
    ps: "د باور وړ پایلې د ثابت معیار سره",
  },
  statsSubtitle: {
    fa: "اعداد زیر نمایی از تجربه و ثبات خدمات هستند و با هدف شفافیت ارائه می‌شوند.",
    en: "The numbers below reflect experience and service consistency and are presented for transparency.",
    ps: "لاندې شمېرې د تجربې او د خدمتونو د ثبات څرګندونه کوي او د شفافیت لپاره وړاندې کېږي.",
  },
  qualEyebrow: {
    fa: "صلاحیت‌ها و دستاوردها",
    en: "Qualifications and achievements",
    ps: "صلاحیتونه او لاسته راوړنې",
  },
  qualTitle: {
    fa: "مسیر علمی و حرفه‌ای با معیار بین‌المللی",
    en: "An academic and professional path with international standards",
    ps: "علمي او مسلکي لاره له نړیوالو معیارونو سره",
  },
  qualSubtitle: {
    fa: "رشد علمی مستمر و تجربه عملی گسترده، ستون‌های اصلی این برند داکتری هستند.",
    en: "Continuous academic growth and extensive practical experience are the core pillars of this doctor brand.",
    ps: "دوامداره علمي پرمختګ او پراخه عملي تجربه د دې ډاکټر برانډ اصلي ستنې دي.",
  },
  faqEyebrow: {
    fa: "سوالات متداول",
    en: "Frequently asked questions",
    ps: "ډېر پوښتل شوي پوښتنې",
  },
  faqTitle: {
    fa: "پاسخ‌های روشن پیش از مراجعه",
    en: "Clear answers before your visit",
    ps: "د راتګ مخکې روښانه ځوابونه",
  },
  faqSubtitle: {
    fa: "پرسش‌های پرتکرار مریضان برای ایجاد آرامش ذهنی و تصمیم‌گیری بهتر.",
    en: "Common patient questions to support peace of mind and better decisions.",
    ps: "د ناروغانو عامې پوښتنې د ذهن آرامۍ او غوره پرېکړې لپاره.",
  },
  articlesEyebrow: {
    fa: "مجله قلب",
    en: "Heart magazine",
    ps: "د زړه مجله",
  },
  articlesTitle: {
    fa: "نشریات داکتری با طراحی مدرن و مطالعه آسان",
    en: "Doctor articles with modern design and easy reading",
    ps: "د ډاکټر لیکنې د عصري ډیزاین او اسانه مطالعې سره",
  },
  articlesSubtitle: {
    fa: "محتوای آموزشی دقیق برای مریضان، خانواده‌ها و علاقه‌مندان به صحت قلب.",
    en: "Accurate educational content for patients, families, and anyone interested in heart health.",
    ps: "د ناروغانو، کورنیو او د زړه روغتیا مینه‌والو لپاره دقیق تعلیمي محتوا.",
  },
  testimonialsEyebrow: {
    fa: "نظرات مریضان",
    en: "Patient reviews",
    ps: "د ناروغانو نظرونه",
  },
  testimonialsTitle: {
    fa: "اعتماد واقعی، تجربه تداوی انسانی",
    en: "Real trust, human treatment experience",
    ps: "ریښتینی باور، انساني درملنه تجربه",
  },
  testimonialsSubtitle: {
    fa: "بازخوردهایی از مریضانی که کیفیت ارتباط، دقت تداوی و آرامش تجربه را توصیف می‌کنند.",
    en: "Feedback from patients describing communication quality, treatment precision, and the calmness of the experience.",
    ps: "د ناروغانو نظرونه چې د اړیکو کیفیت، د درملنې دقت او د تجربې آرامي بیانوي.",
  },
  appointmentEyebrow: {
    fa: "وقت و برنامه",
    en: "Appointments and schedule",
    ps: "نوبت او مهالویش",
  },
  appointmentTitle: {
    fa: "هماهنگی سریع برای ارزیابی و تداوی",
    en: "Fast coordination for evaluation and treatment",
    ps: "د ارزونې او درملنې لپاره چټک همغږي",
  },
  appointmentSubtitle: {
    fa: "برای مشاوره، بررسی آنژیوگرافی و پیگیری تداوی از مسیرهای رسمی زیر اقدام کنید.",
    en: "For consultation, angiography review, and follow-up treatment, use the official channels below.",
    ps: "د مشورې، انجیوګرافي ارزونې او تعقیبي درملنې لپاره لاندې رسمي لارې وکاروئ.",
  },
  contactEyebrow: {
    fa: "تماس",
    en: "Contact",
    ps: "اړیکه",
  },
  contactTitle: {
    fa: "ارتباط مستقیم با کلینیک",
    en: "Direct contact with the clinic",
    ps: "له کلینیک سره مستقیمه اړیکه",
  },
  contactSubtitle: {
    fa: "برای هماهنگی وقت، پیگیری و سوالات اولیه از روش‌های زیر استفاده کنید.",
    en: "Use the methods below for scheduling, follow-up, and initial questions.",
    ps: "د نوبت، تعقیب او لومړنیو پوښتنو لپاره لاندې لارې وکاروئ.",
  },
  phoneLabel: {
    fa: "تلفن",
    en: "Phone",
    ps: "ټیلیفون",
  },
  whatsappLabel: {
    fa: "واتسپ",
    en: "WhatsApp",
    ps: "واټساپ",
  },
  whatsappText: {
    fa: "پیام برای هماهنگی سریع",
    en: "Message for quick coordination",
    ps: "د چټک همغږۍ لپاره پیغام",
  },
  clinicAddressLabel: {
    fa: "آدرس کلینیک",
    en: "Clinic address",
    ps: "د کلینیک پته",
  },
  clinicLocationTitle: {
    fa: "موقعیت کلینیک",
    en: "Clinic location",
    ps: "د کلینیک موقعیت",
  },
  scheduleLabel: {
    fa: "ساعات پاسخ‌گویی",
    en: "Response hours",
    ps: "د ځواب ویلو ساعتونه",
  },
  studyMinute: {
    fa: "دقیقه مطالعه",
    en: "min read",
    ps: "دقیقې لوستل",
  },
  studyMinuteShort: {
    fa: "دقیقه",
    en: "min",
    ps: "دقیقې",
  },
  readMore: {
    fa: "ادامه مطلب",
    en: "Read more",
    ps: "نور ولولئ",
  },
  studyArticle: {
    fa: "مطالعه مقاله",
    en: "Read article",
    ps: "مقاله ولولئ",
  },
  appointmentFromWhatsApp: {
    fa: "گرفتن وقت از واتساپ",
    en: "Book via WhatsApp",
    ps: "د واټساپ له لارې نوبت",
  },
  directCall: {
    fa: "تماس مستقیم",
    en: "Direct call",
    ps: "مستقیم تماس",
  },
} as const;

const getServiceIcon = (iconName: string) => {
  switch (iconName) {
    case "HeartIcon":
      return <HeartIcon />;
    case "LabIcon":
      return <LabIcon />;
    case "CalendarIcon":
      return <CalendarIcon />;
    case "PulseIcon":
      return <PulseIcon />;
    case "ShieldIcon":
      return <ShieldIcon />;
    case "PhoneIcon":
      return <PhoneIcon />;
    default:
      return <CheckIcon />;
  }
};

export default async function HomePage() {
  const cookieStore =await cookies();
  const locale: Locale = getCookieLocale(cookieStore.get(LANGUAGE_COOKIE_KEY)?.value);

  const {
    site,
    socialLinks,
    faqs,
    services,
    contact,
    heroGallery,
    heroImagesByKey,
    stats,
    achievements,
    qualifications,
    technologyHighlights,
    appointmentOptions,
    testimonials,
  
  } = await getSiteData(locale);

  const aboutHighlights = await getAboutHighlights({ locale });

  const articles = getAllArticlesByLocale(locale);

  const featuredArticle = getFeaturedArticleByLocale(locale);

  const servicesWithIcons = services.map((s: any) => ({
    icon: getServiceIcon(s.iconName || s.icon),
    ...s,
  }));

  return (
    <main className="site-shell">
      <React.Suspense fallback={<div />}>
        <Navbar site={site} />
      </React.Suspense>
     
      {/* --- Hero --- */}
      <section className="hero section" id="top">
        <div className="container hero-layout">
          <div className="hero-main" data-reveal>
            <p className="hero-tag">{site.tagline}</p>
            <h1>{site.heroTitle}</h1>
            <p>{site.heroCopy}</p>

            <div className="hero-mobile-profile">
              <Image
                src={heroGallery.doctor}
                alt={t(
                  {
                    fa: "پرتره داکتر",
                    en: "Doctor portrait",
                    ps: "د ډاکټر انځور",
                  },
                  locale,
                )}
                fill
                sizes="100vw"
                className="media-image"
              />
            </div>

            <div className="hero-actions">
              <a className="button button-primary" href="#appointment">
                {site.primaryCta}
                <ArrowLeftIcon />
              </a>
              <a
                className="button button-secondary"
                href={contact.whatsAppUrl}
                target="_blank"
                rel="noreferrer"
              >
                {site.secondaryCta}
                <WhatsappIcon />
              </a>
            </div>

            <div className="hero-kpis">
              {stats.slice(0, 3).map((item: any) => (
                <div className="hero-kpi" key={item.label}>
                  <strong>
                    {item.value}
                    {item.suffix ?? ""}
                  </strong>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="hero-media" data-reveal>
            <div className="hero-image-frame">
              <Image
                src={heroGallery.hero}
                alt={t(
                  {
                    fa: "تصویر داکتر",
                    en: "Doctor image",
                    ps: "د ډاکټر انځور",
                  },
                  locale,
                )}
                fill
                sizes="(max-width: 1024px) 100vw, 48vw"
                className="media-image"
              />
            </div>
            {/*    <div className="hero-float-card glass-card">
              <span>Interventional Cardiology</span>
              <strong>دقت بالا در تشخیص و تداوی</strong>
              <p>پروتکل‌های ارزیابی دقیق همراه با تجربه آرام و انسانی برای مریض.</p>
            </div> */}
            {/*   <div className="hero-float-image">
              <Image src={heroGallery.patientTrust} alt="اعتماد بیمار" fill sizes="220px" className="media-image" />
            </div> */}
          </div>
        </div>
      </section>

















      {/* --- About --- */}
      <section className="section section-overlap" id="about">
        <div className="container about-layout">
          <div className="about-media" data-reveal>
            <div className="about-media-main">
              <Image
                src={heroGallery.doctor}
                alt={t(
                  {
                    fa: "پرتره داکتر محمد یاسر صبری",
                    en: "Portrait of Dr. Arman Rastgar",
                    ps: "د ډاکټر ارمان رستګار انځور",
                  },
                  locale,
                )}
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="media-image"
              />
            </div>
            {/*    <div className="about-media-side">
              <Image src={heroGallery.reception} alt="فضای کلینیک" fill sizes="260px" className="media-image" />
            </div> */}
          </div>

          <div className="about-copy" data-reveal>
            <div className="about-mobile-profile">
              <Image
                src={heroGallery.doctor}
                alt={t(
                  {
                    fa: "تصویر داکتر",
                    en: "Doctor image",
                    ps: "د ډاکټر انځور",
                  },
                  locale,
                )}
                fill
                sizes="100vw"
                className="media-image"
              />
            </div>

            <SectionHeading
              eyebrow={t(pageCopy.aboutDoctor, locale)}
              title={site.brand}
              subtitle={site.heroCopy || site.tagline}
            />

            <p>{site.mission}</p>

            <div className="about-cards">
              {aboutHighlights.map((item: any) => (
                <article key={item.title} className="about-card glass-card">
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>

            <div className="mission-pill glass-card">
              <CheckIcon />
              <p>{site.mission}</p>
            </div>
          </div>
        </div>
      </section>





      
{/* Services – dynamic */}
<section className="section" id="services">
  <div className="container">
    <SectionHeading
      eyebrow={t(pageCopy.servicesEyebrow, locale)}
      title={t(pageCopy.servicesTitle, locale)}
      subtitle={t(pageCopy.servicesSubtitle, locale)}
    />

    <div className="services-layout" data-reveal>
      {/* Left column – first 3 services */}
      <div className="services-col">
        {servicesWithIcons.slice(0, 3).map((item: any) => (
          <FeatureCard icon={item.icon} key={item.title} {...item} />
        ))}
      </div>

      {/* Center – Visual with dynamic gallery */}
    <div className="services-visual glass-card">
  {(() => {
    const clinicImages = heroImagesByKey?.clinic || [];   // ← safe fallback
    return clinicImages.length > 0 ? (
      clinicImages.map((img, idx) => (
        <div
          key={idx}
          className="gallery-item animate-float"
          style={{ animationDelay: `${idx * 0.12}s` }}
        >
          <Image
            src={img.url}
            alt={img.alt}
            fill
            sizes="(max-width: 1024px) 100vw, 30vw"
            className="media-image"
          />
          {img.alt && <span className="gallery-caption">{img.alt}</span>}
        </div>
      ))
    ) : (
      /* Optional fallback image when no clinic photos exist */
      <div className="gallery-item animate-float">
        <Image
          src="/images/default-clinic.jpg"   // ← use your own fallback
          alt="Clinic"
          fill
          sizes="(max-width: 1024px) 100vw, 30vw"
          className="media-image"
        />
      </div>
    );
  })()}

  <div className="services-visual-overlay">
    <span>
      {t(
        {
          fa: "برنامه‌ریزی اختصاصی قلب",
          en: "Personalized heart planning",
          ps: "شخصي د زړه پلان",
        },
        locale,
      )}
    </span>
    <strong>
      {t(
        {
          fa: "طراحی تداوی براساس وضعیت واقعی هر مریض",
          en: "Treatment planning based on each patient’s real condition",
          ps: "درملنه د هر ناروغ د حقیقي وضعیت پر بنسټ",
        },
        locale,
      )}
    </strong>
  </div>
</div>

      {/* Right column – remaining services */}
      <div className="services-col">
        {servicesWithIcons.slice(3).map((item: any) => (
          <FeatureCard icon={item.icon} key={item.title} {...item} />
        ))}
      </div>
    </div>
  </div>
</section>













 {/* Technology (dynamic) */}
<section className="section section-soft" id="technology">
  <div className="container tech-layout">
    <div className="tech-copy" data-reveal>
      <SectionHeading
        eyebrow={t(pageCopy.techEyebrow, locale)}
        title={t(pageCopy.techTitle, locale)}
        subtitle={t(pageCopy.techSubtitle, locale)}
      />
      <div className="tech-list">
        {technologyHighlights.map((item: any) => (
          <article key={item.title} className="tech-item glass-card">
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
      </div>
    </div>

    <div className="tech-media" data-reveal>
      <TechImageGallery
        technologyImages={heroImagesByKey?.technology || []}
        labImages={heroImagesByKey?.lab || []}
        fallbackLabImage={{
          url:"",
          alt: t(
            {
              fa: "آزمایشگاه آنژیوگرافی",
              en: "Angiography lab",
              ps: "د انجیوګرافي لابراتوار",
            },
            locale,
          ),
        }}
      />
    </div>
  </div>
</section>


















      {/* Stats (static) */}
      <section className="section" id="stats">
        <div className="container">
          <SectionHeading
            eyebrow={t(pageCopy.statsEyebrow, locale)}
            title={t(pageCopy.statsTitle, locale)}
            subtitle={t(pageCopy.statsSubtitle, locale)}
          />
          <div className="stats-grid" data-reveal>
            {stats.map((item: any) => (
              <StatCard key={item.label} {...item} />
            ))}
          </div>
        </div>
      </section>



















{/* Qualifications & Achievements (static) */}
<section className="section section-soft" id="qualifications">
  <div className="container qualification-layout">
    <div data-reveal>
      <SectionHeading
        eyebrow={t(pageCopy.qualEyebrow, locale)}
        title={t(pageCopy.qualTitle, locale)}
        subtitle={t(pageCopy.qualSubtitle, locale)}
      />
      <div className="achievement-list">
        {achievements.map((item: any) => (
          <div key={item} className="achievement-item">
            <span className="achievement-dot" aria-hidden="true" />
            <p>{item}</p>
          </div>
        ))}
      </div>
    </div>

    <div className="qualification-right">
      <div className="timeline" data-reveal>
        {qualifications.map((item: any) => (
          <article key={item.title} className="timeline-item">
            <span className="timeline-year">{item.year}</span>
            <div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          </article>
        ))}
      </div>

      {/* ── Animated Image Gallery ── */}
      <div className="qualification-gallery" data-reveal>
        <h3 className="gallery-title">
          {t(
            {
              fa: "گواهینامه‌ها و تقدیرنامه‌ها",
              en: "Certificates & Awards",
              ps: "سندونه او جایزې",
            },
            locale,
          )}
        </h3>
        <div className="gallery-grid">
          {heroImagesByKey?.background.map((img, idx) => (
            <div
              key={idx}
              className="gallery-item animate-float"
              style={{ animationDelay: `${idx * 0.12}s` }}
            >
              <Image
                src={img.url}
                alt={img.alt}
                width={400}
                height={300}
                className="media-image"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              {img.alt && <span className="gallery-caption">{img.alt}</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
</section>




































      {/* FAQ – dynamic */}
      <section className="section" id="faq">
        <div className="container faq-layout">
          <div data-reveal>
            <SectionHeading
              eyebrow={t(pageCopy.faqEyebrow, locale)}
              title={t(pageCopy.faqTitle, locale)}
              subtitle={t(pageCopy.faqSubtitle, locale)}
            />
          </div>
          <FaqAccordion items={faqs} />
        </div>
      </section>




      {/* Articles (static) */}
    {/* Articles (static) */}
<section className="section section-soft" id="articles">
  <div className="container">
    <SectionHeading
      eyebrow={t(pageCopy.articlesEyebrow, locale)}
      title={t(pageCopy.articlesTitle, locale)}
      subtitle={t(pageCopy.articlesSubtitle, locale)}
    />
    <div className="featured-article glass-card" data-reveal>
      <div className="featured-media">
        <Image
          src={featuredArticle?.cover || ""}
          alt={featuredArticle?.title || ""}
          fill
          sizes="(max-width: 1024px) 100vw, 42vw"
          className="media-image"
        />
      </div>
      <div className="featured-copy">
        <span className="article-meta">
          {featuredArticle?.category} • {featuredArticle?.readingMinutes}{" "}
          {t(pageCopy.studyMinute, locale)}
        </span>
        <h3>{featuredArticle?.title}</h3>
        <p>{featuredArticle?.excerpt}</p>
        <Link
          href={`/${locale}/articles/${featuredArticle?.slug}`}  // ✅ now includes locale
          className="inline-link"
        >
          {t(pageCopy.studyArticle, locale)}
          <ArrowLeftIcon />
        </Link>
      </div>
    </div>
    <div className="articles-grid" data-reveal>
      {articles.slice(1).map((item: any) => (
        <article key={item.slug} className="article-card glass-card">
          <div className="article-card-media">
            <Image
              src={item.cover}
              alt={item.title}
              fill
              sizes="(max-width: 1024px) 100vw, 30vw"
              className="media-image"
            />
          </div>
          <div className="article-card-copy">
            <span className="article-meta">
              {item.category} • {item.readingMinutes}{" "}
              {t(pageCopy.studyMinuteShort, locale)}
            </span>
            <h3>{item.title}</h3>
            <p>{item.excerpt}</p>
            <Link
              href={`/${locale}/articles/${item.slug}`}  // ✅ leading slash added
              className="inline-link"
            >
              {t(pageCopy.readMore, locale)}
              <ArrowLeftIcon />
            </Link>
          </div>
        </article>
      ))}
    </div>
  </div>
</section>









      {/* Reviews – dynamic */}
      <section className="section" id="testimonials">
        <div className="container">
          <SectionHeading
            eyebrow={t(pageCopy.testimonialsEyebrow, locale)}
            title={t(pageCopy.testimonialsTitle, locale)}
            subtitle={t(pageCopy.testimonialsSubtitle, locale)}
          />
          <div className="testimonials-grid" data-reveal>
            {testimonials.map((item: any) => (
              <TestimonialCard key={item.name} {...item} />
            ))}
          </div>
        </div>
      </section>

      {/* Appointment – now uses dynamic contact */}
      <section className="section section-soft" id="appointment">
        <div className="container appointment-layout">
          <div className="appointment-copy" data-reveal>
            <SectionHeading
              eyebrow={t(pageCopy.appointmentEyebrow, locale)}
              title={t(pageCopy.appointmentTitle, locale)}
              subtitle={t(pageCopy.appointmentSubtitle, locale)}
            />
            <div className="appointment-options">
              {appointmentOptions.map((item: any) => (
                <div className="option-row" key={item.title}>
                  {getServiceIcon(item.iconName)}
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="hero-actions">
              <a
                className="button button-primary"
                href={contact.whatsAppUrl}
                target="_blank"
                rel="noreferrer"
              >
                {t(pageCopy.appointmentFromWhatsApp, locale)}
                <WhatsappIcon />
              </a>
              <a className="button button-secondary" href={`tel:${contact.phoneLink}`}>
                {t(pageCopy.directCall, locale)}
                <PhoneIcon />
              </a>
            </div>
          </div>
          <div className="appointment-media" data-reveal>
            <div className="appointment-main">
              <Image
                src={heroImagesByKey?.appointment[0].url?? heroGallery.appointment}
                alt={t(
                  {
                    fa: "بخش نوبت‌دهی",
                    en: "Appointment section",
                    ps: "د نوبت برخه",
                  },
                  locale,
                )}
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="media-image"
              />
            </div>
            <div className="appointment-chip glass-card">
              <CalendarIcon />
              <div>
                <strong>{t(pageCopy.scheduleLabel, locale)}</strong>
                <p>{site.schedule}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact – fully dynamic */}
      <section className="section" id="contact">
        <div className="container contact-layout">
          <div data-reveal>
            <SectionHeading
              eyebrow={t(pageCopy.contactEyebrow, locale)}
              title={t(pageCopy.contactTitle, locale)}
              subtitle={t(pageCopy.contactSubtitle, locale)}
            />
            <div className="contact-list">
              <a className="contact-item" href={`tel:${contact.phoneLink}`}>
                <PhoneIcon />
                <div>
                  <span>{t(pageCopy.phoneLabel, locale)}</span>
                  <strong>{contact.phoneDisplay}</strong>
                </div>
              </a>
              <a
                className="contact-item"
                href={contact.whatsAppUrl}
                target="_blank"
                rel="noreferrer"
              >
                <WhatsappIcon />
                <div>
                  <span>{t(pageCopy.whatsappLabel, locale)}</span>
                  <strong>{t(pageCopy.whatsappText, locale)}</strong>
                </div>
              </a>
              <div className="contact-item">
                <MapPinIcon />
                <div>
                  <span>{t(pageCopy.clinicAddressLabel, locale)}</span>
                  <strong>{contact.address}</strong>
                </div>
              </div>
            </div>
          </div>
          <div className="map-shell" data-reveal>
            <div className="map-card glass-card">
              <span className="map-pin">
                <MapPinIcon />
              </span>
              <h3>{t(pageCopy.clinicLocationTitle, locale)}</h3>
              <p>{contact.address}</p>
              <div className="map-grid" aria-hidden="true">
                <span />
                <span />
                <span />
                <span />
              </div>
            </div>
          </div>
        </div>
      </section>

    <Footer
  site={site}
  footerCopy={site?.footerCopy}
   
  quickLinks={site.quickLinks}
  socialLinks={socialLinks}
/>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Physician",
            name: site.brand,
            medicalSpecialty: ["Cardiology", "Interventional Cardiology"],
            url: "/",
            telephone: contact.phoneDisplay,
            address: contact.address,
          }),
        }}
      />
    </main>
  );
}