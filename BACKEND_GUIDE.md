# Backend Architecture Guide — Heart Doctor Website
> Supabase (PostgreSQL) · Flutter Admin · Next.js Frontend

---

## Overview

| Layer | Technology |
|---|---|
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth — single admin user |
| Storage | Supabase Storage (images) |
| Frontend | Next.js 14 (reads via Supabase JS client or REST) |
| Admin Panel | Flutter app (reads & writes, authenticated) |
| Visitors | Anonymous, read-only |

---

## Access Control Model

```
Admin (Flutter app)
  └─ Authenticated via Supabase Auth (email + password)
  └─ Can INSERT / UPDATE / DELETE on all tables

Visitors (Next.js website)
  └─ Anonymous (anon key)
  └─ Can SELECT only — enforced by Row Level Security (RLS)
```

---

## Row Level Security Policy Template

Apply this pattern to **every** table after creating it:

```sql
-- Enable RLS
ALTER TABLE <table_name> ENABLE ROW LEVEL SECURITY;

-- Anyone can read
CREATE POLICY "Public read" ON <table_name>
  FOR SELECT USING (true);

-- Only authenticated admin can write
CREATE POLICY "Admin write" ON <table_name>
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');
```

---

## Database Tables

---

### 1. `doctor_profile`
Single-row table (always `id = 1`). Holds the doctor's core identity and page-level copy.

```sql
CREATE TABLE doctor_profile (
  id                SMALLINT PRIMARY KEY DEFAULT 1,
  -- Identity
  full_name         TEXT NOT NULL,                        -- e.g. "داکتر محمد یاسر صبری"
  full_name_ps      TEXT NOT NULL,                        -- Pashto: "ډاکټر ارمان رستګار"
  brand_subline     TEXT NOT NULL,                        -- e.g. "Cardiology & Interventional Excellence"
  brand_subline_fa  TEXT NOT NULL,                        -- e.g. "متخصص قلب و آنژیوگرافی"
  brand_subline_ps  TEXT NOT NULL,                        -- Pashto: "د زړه متخصص"
  tagline           TEXT NOT NULL,                        -- e.g. "تخصص قلب · اعتماد · دقت"
  -- Hero section
  hero_title        TEXT NOT NULL,
  hero_title_ps     TEXT NOT NULL,
  hero_copy         TEXT NOT NULL,
  hero_copy_ps      TEXT NOT NULL,
  primary_cta       TEXT NOT NULL,                        -- e.g. "گرفتن وقت معاینه"
  primary_cta_ps    TEXT NOT NULL,
  secondary_cta     TEXT NOT NULL,                        -- e.g. "تماس از واتساپ"
  secondary_cta_ps  TEXT NOT NULL,
  -- About / Mission
  mission           TEXT NOT NULL,
  about_paragraph   TEXT NOT NULL,                        -- inline paragraph in about section
  -- Stats summary
  experience_years  SMALLINT NOT NULL DEFAULT 19,
  -- Schedule banner
  schedule          TEXT NOT NULL,                        -- e.g. "شنبه تا چهارشنبه، ۴ تا ۸ شب"
  -- Footer
  footer_copy       TEXT NOT NULL,
  -- SEO Metadata
  seo_title         TEXT NOT NULL,
  seo_title_template TEXT NOT NULL,                       -- e.g. "%s | داکتر محمد یاسر صبری"
  seo_description   TEXT NOT NULL,
  seo_keywords      TEXT[] NOT NULL DEFAULT '{}',
  og_title          TEXT,
  og_description    TEXT,
  og_locale         TEXT DEFAULT 'fa_IR',
  -- Timestamps
  updated_at        TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT single_row CHECK (id = 1)
);
```

---

### 2. `nav_links`
Ordered navigation links for both language versions of the navbar.

```sql
CREATE TABLE nav_links (
  id          SERIAL PRIMARY KEY,
  label       TEXT NOT NULL,          -- Dari label, e.g. "درباره داکتر"
  label_ps    TEXT,                   -- Pashto label (optional, for future ps navbar)
  href        TEXT NOT NULL,          -- e.g. "#about"
  sort_order  SMALLINT NOT NULL DEFAULT 0,
  is_active   BOOLEAN NOT NULL DEFAULT TRUE
);
```

---

### 3. `about_highlights`
Three informational blocks in the "About the Doctor" section.

```sql
CREATE TABLE about_highlights (
  id          SERIAL PRIMARY KEY,
  title       TEXT NOT NULL,          -- e.g. "تحصیلات"
  title_ps    TEXT,
  body        TEXT NOT NULL,          -- descriptive paragraph
  body_ps     TEXT,
  sort_order  SMALLINT NOT NULL DEFAULT 0,
  is_active   BOOLEAN NOT NULL DEFAULT TRUE
);
```

---

### 4. `services`
Medical services offered (shown as cards with icons).

```sql
CREATE TABLE services (
  id          SERIAL PRIMARY KEY,
  icon_name   TEXT NOT NULL,          -- icon key, e.g. "LabIcon" | "HeartIcon" | "CalendarIcon" | "PulseIcon" | "ShieldIcon" | "PhoneIcon"
  title       TEXT NOT NULL,
  title_ps    TEXT,
  body        TEXT NOT NULL,
  body_ps     TEXT,
  sort_order  SMALLINT NOT NULL DEFAULT 0,
  is_active   BOOLEAN NOT NULL DEFAULT TRUE
);
```

> **Icon name convention:** Use string keys that map to the `icons.tsx` component map in the frontend. Example map:
> `{ LabIcon, HeartIcon, CalendarIcon, PulseIcon, ShieldIcon, PhoneIcon }`

---

### 5. `technology_highlights`
Three blocks in the Technology section.

```sql
CREATE TABLE technology_highlights (
  id          SERIAL PRIMARY KEY,
  title       TEXT NOT NULL,          -- e.g. "Angiography Precision Lab"
  title_ps    TEXT,
  body        TEXT NOT NULL,
  body_ps     TEXT,
  sort_order  SMALLINT NOT NULL DEFAULT 0,
  is_active   BOOLEAN NOT NULL DEFAULT TRUE
);
```

---

### 6. `stats`
Animated counter cards (experience, consultations, procedures, satisfaction).

```sql
CREATE TABLE stats (
  id          SERIAL PRIMARY KEY,
  value       INTEGER NOT NULL,       -- numeric value, e.g. 3600
  suffix      TEXT DEFAULT '',        -- e.g. "+" or "%"
  label       TEXT NOT NULL,          -- e.g. "مشاوره تخصصی"
  label_ps    TEXT,
  note        TEXT,                   -- e.g. "با پلان تداوی روشن"
  note_ps     TEXT,
  sort_order  SMALLINT NOT NULL DEFAULT 0,
  is_active   BOOLEAN NOT NULL DEFAULT TRUE
);
```

---

### 7. `qualifications`
Education timeline / credentials with year markers.

```sql
CREATE TABLE qualifications (
  id          SERIAL PRIMARY KEY,
  year_label  TEXT NOT NULL,          -- e.g. "1389" or "اکنون"
  title       TEXT NOT NULL,
  title_ps    TEXT,
  body        TEXT NOT NULL,
  body_ps     TEXT,
  sort_order  SMALLINT NOT NULL DEFAULT 0,
  is_active   BOOLEAN NOT NULL DEFAULT TRUE
);
```

---

### 8. `achievements`
Short bullet-point achievement strings shown in the qualifications section.

```sql
CREATE TABLE achievements (
  id          SERIAL PRIMARY KEY,
  text        TEXT NOT NULL,          -- e.g. "عضو انجمن قلب ایران"
  text_ps     TEXT,
  sort_order  SMALLINT NOT NULL DEFAULT 0,
  is_active   BOOLEAN NOT NULL DEFAULT TRUE
);
```

---

### 9. `faqs`
Frequently Asked Questions. Supports both Dari and Pashto.

```sql
CREATE TABLE faqs (
  id          SERIAL PRIMARY KEY,
  question    TEXT NOT NULL,          -- Dari question
  question_ps TEXT,                   -- Pashto question
  answer      TEXT NOT NULL,          -- Dari answer
  answer_ps   TEXT,                   -- Pashto answer
  sort_order  SMALLINT NOT NULL DEFAULT 0,
  is_active   BOOLEAN NOT NULL DEFAULT TRUE
);
```

---

### 10. `appointment_options`
Three appointment type cards (in-person, angiography evaluation, online follow-up).

```sql
CREATE TABLE appointment_options (
  id          SERIAL PRIMARY KEY,
  icon_name   TEXT NOT NULL,          -- same icon key convention as services
  title       TEXT NOT NULL,
  title_ps    TEXT,
  body        TEXT NOT NULL,
  body_ps     TEXT,
  sort_order  SMALLINT NOT NULL DEFAULT 0,
  is_active   BOOLEAN NOT NULL DEFAULT TRUE
);
```

---

### 11. `contact_info`
Single-row table (always `id = 1`). Stores all contact details.

```sql
CREATE TABLE contact_info (
  id              SMALLINT PRIMARY KEY DEFAULT 1,
  phone_display   TEXT NOT NULL,      -- formatted for display: "+93 70 123 4567"
  phone_link      TEXT NOT NULL,      -- for tel: links: "+93701234567"
  whatsapp_url    TEXT NOT NULL,      -- full URL with pre-filled message
  address         TEXT NOT NULL,      -- Dari address
  address_ps      TEXT,               -- Pashto address
  updated_at      TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT single_row CHECK (id = 1)
);
```

---

### 12. `social_links`
Social / external links shown in the footer and contact section.

```sql
CREATE TABLE social_links (
  id          SERIAL PRIMARY KEY,
  label       TEXT NOT NULL,          -- e.g. "Instagram"
  href        TEXT NOT NULL,          -- full URL
  icon_name   TEXT,                   -- optional: for rendering a specific icon
  sort_order  SMALLINT NOT NULL DEFAULT 0,
  is_active   BOOLEAN NOT NULL DEFAULT TRUE
);
```

---

### 13. `articles`
Medical education articles. Content stored as an array of paragraph strings.

```sql
CREATE TABLE articles (
  id               SERIAL PRIMARY KEY,
  slug             TEXT NOT NULL UNIQUE,           -- URL-safe, e.g. "early-signs-of-chest-pain"
  title            TEXT NOT NULL,
  title_ps         TEXT,
  excerpt          TEXT NOT NULL,                  -- short summary shown in card
  excerpt_ps       TEXT,
  category         TEXT NOT NULL,                  -- e.g. "آگاهی مریض" | "آنژیوگرافی" | "پیشگیری" | "تشخیص"
  category_ps      TEXT,
  reading_minutes  SMALLINT NOT NULL DEFAULT 5,
  published_at     DATE NOT NULL,
  cover_url        TEXT,                           -- Supabase Storage public URL
  content          TEXT[] NOT NULL DEFAULT '{}',   -- ordered paragraphs (Dari)
  content_ps       TEXT[],                         -- ordered paragraphs (Pashto), optional
  is_published     BOOLEAN NOT NULL DEFAULT TRUE,
  is_featured      BOOLEAN NOT NULL DEFAULT FALSE, -- marks the featured article on homepage
  created_at       TIMESTAMPTZ DEFAULT now(),
  updated_at       TIMESTAMPTZ DEFAULT now()
);

-- Index for fast slug lookup
CREATE UNIQUE INDEX articles_slug_idx ON articles(slug);

-- Index for listing published articles
CREATE INDEX articles_published_idx ON articles(is_published, published_at DESC);
```

> **Cover images** are uploaded to Supabase Storage bucket `article-covers` and the public URL is stored in `cover_url`.

---

### 14. `reviews` *(testimonials)*
Patient reviews. Currently 3 static items, but this table allows the admin to manage them.

```sql
CREATE TABLE reviews (
  id          SERIAL PRIMARY KEY,
  patient_name TEXT NOT NULL,                      -- e.g. "مریم حسینی"
  role        TEXT NOT NULL DEFAULT 'مریض',        -- e.g. "مریض" | "مریض پیگیری قلب" | "همراه مریض"
  quote       TEXT NOT NULL,                       -- review text
  rating      SMALLINT NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order  SMALLINT NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT now()
);
```

> **Note:** Website displays reviews as static (no public submission form). Only the admin (Flutter app) can add / edit / remove reviews.

---

### 15. `hero_images`
Images shown in the hero gallery carousel / mosaic.

```sql
CREATE TABLE hero_images (
  id          SERIAL PRIMARY KEY,
  key_name    TEXT NOT NULL UNIQUE,    -- semantic key, e.g. "hero" | "doctor" | "lab" | "ecg"
  storage_url TEXT NOT NULL,           -- Supabase Storage public URL
  alt_text    TEXT,                    -- accessibility alt text
  sort_order  SMALLINT NOT NULL DEFAULT 0,
  is_active   BOOLEAN NOT NULL DEFAULT TRUE
);
```

---

## Supabase Storage Buckets

| Bucket Name | Purpose | Access |
|---|---|---|
| `article-covers` | Article cover images | Public |
| `hero-images` | Hero gallery images | Public |
| `doctor-assets` | Doctor photo, clinic photos | Public |

**Policy:** All buckets are public-read. Only authenticated users (admin) can upload/delete.

```sql
-- Example policy for article-covers bucket (apply same pattern to all buckets)
-- In Supabase dashboard: Storage > Policies > New Policy
-- Or via SQL:
CREATE POLICY "Public image read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'article-covers');

CREATE POLICY "Admin image upload"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'article-covers' AND auth.role() = 'authenticated');

CREATE POLICY "Admin image delete"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'article-covers' AND auth.role() = 'authenticated');
```

---

## Complete Setup Script (Run in Order)

```sql
-- ============================================================
-- 1. DOCTOR PROFILE
-- ============================================================
CREATE TABLE doctor_profile (
  id                SMALLINT PRIMARY KEY DEFAULT 1,
  full_name         TEXT NOT NULL,
  full_name_ps      TEXT NOT NULL,
  brand_subline     TEXT NOT NULL,
  brand_subline_fa  TEXT NOT NULL,
  brand_subline_ps  TEXT NOT NULL,
  tagline           TEXT NOT NULL,
  hero_title        TEXT NOT NULL,
  hero_title_ps     TEXT NOT NULL,
  hero_copy         TEXT NOT NULL,
  hero_copy_ps      TEXT NOT NULL,
  primary_cta       TEXT NOT NULL,
  primary_cta_ps    TEXT NOT NULL,
  secondary_cta     TEXT NOT NULL,
  secondary_cta_ps  TEXT NOT NULL,
  mission           TEXT NOT NULL,
  about_paragraph   TEXT NOT NULL,
  experience_years  SMALLINT NOT NULL DEFAULT 19,
  schedule          TEXT NOT NULL,
  footer_copy       TEXT NOT NULL,
  seo_title         TEXT NOT NULL,
  seo_title_template TEXT NOT NULL,
  seo_description   TEXT NOT NULL,
  seo_keywords      TEXT[] NOT NULL DEFAULT '{}',
  og_title          TEXT,
  og_description    TEXT,
  og_locale         TEXT DEFAULT 'fa_IR',
  updated_at        TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT single_row CHECK (id = 1)
);

ALTER TABLE doctor_profile ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON doctor_profile FOR SELECT USING (true);
CREATE POLICY "Admin write" ON doctor_profile FOR ALL
  USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- ============================================================
-- 2. NAV LINKS
-- ============================================================
CREATE TABLE nav_links (
  id         SERIAL PRIMARY KEY,
  label      TEXT NOT NULL,
  label_ps   TEXT,
  href       TEXT NOT NULL,
  sort_order SMALLINT NOT NULL DEFAULT 0,
  is_active  BOOLEAN NOT NULL DEFAULT TRUE
);

ALTER TABLE nav_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON nav_links FOR SELECT USING (true);
CREATE POLICY "Admin write" ON nav_links FOR ALL
  USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- ============================================================
-- 3. ABOUT HIGHLIGHTS
-- ============================================================
CREATE TABLE about_highlights (
  id         SERIAL PRIMARY KEY,
  title      TEXT NOT NULL,
  title_ps   TEXT,
  body       TEXT NOT NULL,
  body_ps    TEXT,
  sort_order SMALLINT NOT NULL DEFAULT 0,
  is_active  BOOLEAN NOT NULL DEFAULT TRUE
);

ALTER TABLE about_highlights ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON about_highlights FOR SELECT USING (true);
CREATE POLICY "Admin write" ON about_highlights FOR ALL
  USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- ============================================================
-- 4. SERVICES
-- ============================================================
CREATE TABLE services (
  id         SERIAL PRIMARY KEY,
  icon_name  TEXT NOT NULL,
  title      TEXT NOT NULL,
  title_ps   TEXT,
  body       TEXT NOT NULL,
  body_ps    TEXT,
  sort_order SMALLINT NOT NULL DEFAULT 0,
  is_active  BOOLEAN NOT NULL DEFAULT TRUE
);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON services FOR SELECT USING (true);
CREATE POLICY "Admin write" ON services FOR ALL
  USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- ============================================================
-- 5. TECHNOLOGY HIGHLIGHTS
-- ============================================================
CREATE TABLE technology_highlights (
  id         SERIAL PRIMARY KEY,
  title      TEXT NOT NULL,
  title_ps   TEXT,
  body       TEXT NOT NULL,
  body_ps    TEXT,
  sort_order SMALLINT NOT NULL DEFAULT 0,
  is_active  BOOLEAN NOT NULL DEFAULT TRUE
);

ALTER TABLE technology_highlights ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON technology_highlights FOR SELECT USING (true);
CREATE POLICY "Admin write" ON technology_highlights FOR ALL
  USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- ============================================================
-- 6. STATS
-- ============================================================
CREATE TABLE stats (
  id         SERIAL PRIMARY KEY,
  value      INTEGER NOT NULL,
  suffix     TEXT DEFAULT '',
  label      TEXT NOT NULL,
  label_ps   TEXT,
  note       TEXT,
  note_ps    TEXT,
  sort_order SMALLINT NOT NULL DEFAULT 0,
  is_active  BOOLEAN NOT NULL DEFAULT TRUE
);

ALTER TABLE stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON stats FOR SELECT USING (true);
CREATE POLICY "Admin write" ON stats FOR ALL
  USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- ============================================================
-- 7. QUALIFICATIONS
-- ============================================================
CREATE TABLE qualifications (
  id         SERIAL PRIMARY KEY,
  year_label TEXT NOT NULL,
  title      TEXT NOT NULL,
  title_ps   TEXT,
  body       TEXT NOT NULL,
  body_ps    TEXT,
  sort_order SMALLINT NOT NULL DEFAULT 0,
  is_active  BOOLEAN NOT NULL DEFAULT TRUE
);

ALTER TABLE qualifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON qualifications FOR SELECT USING (true);
CREATE POLICY "Admin write" ON qualifications FOR ALL
  USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- ============================================================
-- 8. ACHIEVEMENTS
-- ============================================================
CREATE TABLE achievements (
  id         SERIAL PRIMARY KEY,
  text       TEXT NOT NULL,
  text_ps    TEXT,
  sort_order SMALLINT NOT NULL DEFAULT 0,
  is_active  BOOLEAN NOT NULL DEFAULT TRUE
);

ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON achievements FOR SELECT USING (true);
CREATE POLICY "Admin write" ON achievements FOR ALL
  USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- ============================================================
-- 9. FAQS
-- ============================================================
CREATE TABLE faqs (
  id          SERIAL PRIMARY KEY,
  question    TEXT NOT NULL,
  question_ps TEXT,
  answer      TEXT NOT NULL,
  answer_ps   TEXT,
  sort_order  SMALLINT NOT NULL DEFAULT 0,
  is_active   BOOLEAN NOT NULL DEFAULT TRUE
);

ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON faqs FOR SELECT USING (true);
CREATE POLICY "Admin write" ON faqs FOR ALL
  USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- ============================================================
-- 10. APPOINTMENT OPTIONS
-- ============================================================
CREATE TABLE appointment_options (
  id         SERIAL PRIMARY KEY,
  icon_name  TEXT NOT NULL,
  title      TEXT NOT NULL,
  title_ps   TEXT,
  body       TEXT NOT NULL,
  body_ps    TEXT,
  sort_order SMALLINT NOT NULL DEFAULT 0,
  is_active  BOOLEAN NOT NULL DEFAULT TRUE
);

ALTER TABLE appointment_options ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON appointment_options FOR SELECT USING (true);
CREATE POLICY "Admin write" ON appointment_options FOR ALL
  USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- ============================================================
-- 11. CONTACT INFO
-- ============================================================
CREATE TABLE contact_info (
  id            SMALLINT PRIMARY KEY DEFAULT 1,
  phone_display TEXT NOT NULL,
  phone_link    TEXT NOT NULL,
  whatsapp_url  TEXT NOT NULL,
  address       TEXT NOT NULL,
  address_ps    TEXT,
  updated_at    TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT single_row CHECK (id = 1)
);

ALTER TABLE contact_info ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON contact_info FOR SELECT USING (true);
CREATE POLICY "Admin write" ON contact_info FOR ALL
  USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- ============================================================
-- 12. SOCIAL LINKS
-- ============================================================
CREATE TABLE social_links (
  id         SERIAL PRIMARY KEY,
  label      TEXT NOT NULL,
  href       TEXT NOT NULL,
  icon_name  TEXT,
  sort_order SMALLINT NOT NULL DEFAULT 0,
  is_active  BOOLEAN NOT NULL DEFAULT TRUE
);

ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON social_links FOR SELECT USING (true);
CREATE POLICY "Admin write" ON social_links FOR ALL
  USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- ============================================================
-- 13. ARTICLES
-- ============================================================
CREATE TABLE articles (
  id              SERIAL PRIMARY KEY,
  slug            TEXT NOT NULL UNIQUE,
  title           TEXT NOT NULL,
  title_ps        TEXT,
  excerpt         TEXT NOT NULL,
  excerpt_ps      TEXT,
  category        TEXT NOT NULL,
  category_ps     TEXT,
  reading_minutes SMALLINT NOT NULL DEFAULT 5,
  published_at    DATE NOT NULL,
  cover_url       TEXT,
  content         TEXT[] NOT NULL DEFAULT '{}',
  content_ps      TEXT[],
  is_published    BOOLEAN NOT NULL DEFAULT TRUE,
  is_featured     BOOLEAN NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

CREATE UNIQUE INDEX articles_slug_idx ON articles(slug);
CREATE INDEX articles_published_idx ON articles(is_published, published_at DESC);

ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read published" ON articles FOR SELECT USING (is_published = TRUE);
CREATE POLICY "Admin full access" ON articles FOR ALL
  USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- ============================================================
-- 14. REVIEWS
-- ============================================================
CREATE TABLE reviews (
  id           SERIAL PRIMARY KEY,
  patient_name TEXT NOT NULL,
  role         TEXT NOT NULL DEFAULT 'مریض',
  quote        TEXT NOT NULL,
  rating       SMALLINT NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  is_active    BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order   SMALLINT NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read active" ON reviews FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Admin full access" ON reviews FOR ALL
  USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- ============================================================
-- 15. HERO IMAGES
-- ============================================================
CREATE TABLE hero_images (
  id          SERIAL PRIMARY KEY,
  key_name    TEXT NOT NULL UNIQUE,
  storage_url TEXT NOT NULL,
  alt_text    TEXT,
  sort_order  SMALLINT NOT NULL DEFAULT 0,
  is_active   BOOLEAN NOT NULL DEFAULT TRUE
);

ALTER TABLE hero_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON hero_images FOR SELECT USING (true);
CREATE POLICY "Admin write" ON hero_images FOR ALL
  USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
```

---

## Seed Data (Initial Population)

Run these inserts once after creating the tables to populate with current content.

```sql
-- Doctor Profile
INSERT INTO doctor_profile (
  full_name, full_name_ps,
  brand_subline, brand_subline_fa, brand_subline_ps,
  tagline,
  hero_title, hero_title_ps,
  hero_copy, hero_copy_ps,
  primary_cta, primary_cta_ps,
  secondary_cta, secondary_cta_ps,
  mission, about_paragraph,
  experience_years, schedule, footer_copy,
  seo_title, seo_title_template, seo_description, seo_keywords,
  og_title, og_description
) VALUES (
  'داکتر محمد یاسر صبری', 'ډاکټر ارمان رستګار',
  'Cardiology & Interventional Excellence', 'متخصص قلب و آنژیوگرافی', 'د زړه متخصص',
  'تخصص قلب · اعتماد · دقت',
  'معیار برتر در مراقبت قلب و آنژیوگرافی', 'د زړه د درملنې باوري او عصري مرکز',
  'پلتفورم شخصی یک متخصص قلب و عروق با زبان بصری ممتاز، تصمیم‌گیری دقیق و تجربه‌ای آرام که اعتماد مریض را در هر مرحله از مسیر تداوی تقویت می‌کند.',
  'ښه راغلاست. دا پښتو نسخه ده. موږ د زړه ناروغانو لپاره دقيقه ارزونه، روښانه لارښوونه او ارامه درملنه برابروو.',
  'گرفتن وقت معاینه', 'وخت واخله',
  'تماس از واتساپ', 'د واتس‌اپ اړیکه',
  'هدف من ساختن مسیر تداوی شفاف و مطمئن است؛ مسیری که در آن مریض هم از نظر علمی در جایگاه امن قرار گیرد و هم از نظر انسانی احساس آرامش و احترام کند.',
  'رویکرد این برند داکتری بر پایه دقت علمی، تصمیم‌گیری مرحله‌ای و همراهی محترمانه با مریض طراحی شده است تا تجربه تداوی از ابتدا تا پیگیری، قابل اعتماد و بدون ابهام باشد.',
  19, 'شنبه تا چهارشنبه، ۴ تا ۸ شب | پنج‌شنبه با هماهنگی قبلی',
  'کلینیک شخصی قلب با رویکرد دقیق، آرام و آینده‌نگر؛ جایی برای تصمیم‌های درست در وقت درست.',
  'دکتر محمد یاسر صبری | متخصص قلب و آنژیوگرافی',
  '%s | دکتر محمد یاسر صبری',
  'برند شخصی پریمیوم دکتر محمد یاسر صبری، متخصص قلب و آنژیوگرافی؛ تجربه‌ای مدرن، دقیق و اعتمادساز برای بیماران قلبی.',
  ARRAY['متخصص قلب','آنژیوگرافی','قلب','دکتر قلب','کلینیک قلب'],
  'دکتر محمد یاسر صبری | متخصص قلب و آنژیوگرافی',
  'وب‌سایت شخصی متخصص قلب با هویت بصری لوکس و محتوای آموزشی تخصصی.'
);

-- Nav Links
INSERT INTO nav_links (label, href, sort_order) VALUES
  ('درباره داکتر', '#about',         1),
  ('خدمات',        '#services',      2),
  ('تکنولوژی',     '#technology',    3),
  ('سوالات',       '#faq',           4),
  ('مقالات',       '#articles',      5),
  ('وقت',          '#appointment',   6),
  ('اعتبار',       '#qualifications',7),
  ('تماس',         '#contact',       8);

-- About Highlights
INSERT INTO about_highlights (title, body, sort_order) VALUES
  ('تحصیلات', 'تخصص قلب و عروق و دوره‌های تکمیلی مداخله‌ای با تمرکز بر آنژیوگرافی و ارزیابی مریضان پُرخطر.', 1),
  ('تجربه',   'بیش از یک و نیم دهه فعالیت در مدیریت درد قفسه سینه، پروسیجرهای تشخیصی و تداوی مرحله‌به‌مرحله.', 2),
  ('فلسفه تداوی', 'شفافیت در توضیح، دقت در تصمیم و همراهی انسانی در تمام مراحل مسیر تداوی.', 3);

-- Services
INSERT INTO services (icon_name, title, body, sort_order) VALUES
  ('LabIcon',      'آنژیوگرافی',             'بررسی دقیق عروق کرونر برای تشخیص سریع و طراحی مسیر تداوی هوشمند.', 1),
  ('HeartIcon',    'ECG و مانیتورینگ',        'تحلیل نوار قلب و ریتم برای کشف زودهنگام اختلالات عملکردی.', 2),
  ('CalendarIcon', 'مشاوره قلب',             'معاینات تخصصی شخصی‌سازی‌شده برای تصمیم‌گیری درمانی دقیق و شفاف.', 3),
  ('PulseIcon',    'ارزیابی درد قفسه سینه', 'بررسی مرحله‌ای علائم خطر با رویکرد بالینی مبتنی بر شواهد.', 4),
  ('ShieldIcon',   'مدیریت فشار خون',        'طراحی پلان کنترل فشار خون با پیگیری دقیق و اصلاح شیوه زندگی.', 5),
  ('PhoneIcon',    'پیگیری پس از تداوی',     'بازبینی منظم نتایج و تنظیم دوا برای حفظ ثبات وضعیت مریض.', 6);

-- Technology Highlights
INSERT INTO technology_highlights (title, body, sort_order) VALUES
  ('Angiography Precision Lab', 'ثبت داده‌های تصویری با جزئیات بالا برای تصمیم‌گیری سریع و ایمن.', 1),
  ('Risk-Adjusted Protocols',   'پروتوکل‌های اختصاصی برای مریضان با خطرات مختلف و شرایط پیچیده.', 2),
  ('Calm Clinical Journey',     'کاهش اضطراب مریض با توضیح مرحله‌به‌مرحله و تجربه بالینی آرام.', 3);

-- Stats
INSERT INTO stats (value, suffix, label, note, sort_order) VALUES
  (19,   '',  'سال تجربه',       'در قلب و آنژیوگرافی',      1),
  (3600, '+', 'مشاوره تخصصی',   'با پلان تداوی روشن',       2),
  (1200, '+', 'پروسیجر قلب',    'در مسیرهای تداوی منتخب',   3),
  (98,   '%', 'رضایت مریضان',   'از کیفیت ارتباط و تداوی',  4);

-- Qualifications
INSERT INTO qualifications (year_label, title, body, sort_order) VALUES
  ('1389', 'تکمیل دوره تخصص قلب و عروق', 'آغاز فعالیت حرفه‌ای با تمرکز بر تصمیم‌گیری بالینی دقیق و مریض‌محور.', 1),
  ('1394', 'فلوشیپ آنژیوگرافی و مداخله', 'تکمیل مهارت‌های پیشرفته در تصویربرداری عروقی و برنامه‌ریزی مداخلات.', 2),
  ('1399', 'تأییدیه کارگاه‌های بین‌المللی', 'آموزش مستمر در تکنیک‌های نوین قلب و معیارهای ایمنی پروسیجر.', 3),
  ('اکنون', 'برند شخصی داکتری ممتاز', 'ترکیب تجربه، تکنولوژی و ارتباط انسانی برای مراقبتی قابل اتکا.', 4);

-- Achievements
INSERT INTO achievements (text, sort_order) VALUES
  ('عضو انجمن قلب ایران', 1),
  ('استاد کارگاه‌های تفسیر ECG', 2),
  ('سخنران کنفرانس‌های قلب و عروق', 3),
  ('همکاری علمی با مراکز تخصصی تداوی قلب', 4);

-- FAQs
INSERT INTO faqs (question, answer, sort_order) VALUES
  ('آیا هر درد قفسه سینه نشانه بیماری قلبی است؟',
   'خیر. اما درد فشارنده یا همراه با تنگی نفس، تعریق و انتشار به دست یا فک باید سریع ارزیابی شود تا احتمال بیماری قلبی رد یا تایید گردد.', 1),
  ('آنژیوگرافی چه زمانی لازم می‌شود؟',
   'زمانی که علائم، نتایج ECG یا تست‌های تکمیلی نشان‌دهنده احتمال درگیری عروق باشند، آنژیوگرافی برای تشخیص دقیق و انتخاب درمان مناسب توصیه می‌شود.', 2),
  ('بعد از پروسیجر چه نوع پیگیری لازم است؟',
   'پیگیری منظم برای ارزیابی علائم، تنظیم دارو، بررسی فشار خون و برنامه سبک زندگی ضروری است تا درمان پایدار بماند.', 3),
  ('برای نوبت اولیه چه مدارکی همراه داشته باشم؟',
   'نتایج آزمایش‌ها، ECG قبلی، لیست داروهای مصرفی و شرح مختصر علائم فعلی کمک می‌کند تصمیم بالینی سریع‌تر و دقیق‌تر انجام شود.', 4);

-- Appointment Options
INSERT INTO appointment_options (icon_name, title, body, sort_order) VALUES
  ('CalendarIcon', 'معاینه حضوری',      'بررسی کامل علائم، نتایج و طراحی پلان تداوی اختصاصی.', 1),
  ('LabIcon',      'ارزیابی آنژیوگرافی', 'تعیین ضرورت انجام، آمادگی پیش از اقدام و تصمیم‌گیری درمانی ایمن.', 2),
  ('PhoneIcon',    'پیگیری آنلاین',      'پاسخ به سوالات، تنظیم دوا و هماهنگی سریع از مسیرهای ارتباطی رسمی.', 3);

-- Contact Info
INSERT INTO contact_info (phone_display, phone_link, whatsapp_url, address) VALUES (
  '+93 70 123 4567',
  '+93701234567',
  'https://wa.me/93701234567?text=%D8%B3%D9%84%D8%A7%D9%85%20%D8%AF%D8%A7%DA%A9%D8%AA%D8%B1%20%D8%B1%D8%B3%D8%AA%DA%AF%D8%A7%D8%B1%D8%8C%20%D9%85%DB%8C%D8%AE%D9%88%D8%A7%D9%87%D9%85%20%D9%88%D9%82%D8%AA%20%D9%85%D8%B9%D8%A7%DB%8C%D9%86%D9%87%20%D8%A8%DA%AF%DB%8C%D8%B1%D9%85.',
  'کابل، شهر نو، کلینیک تخصصی قلب آریا، طبقه ۳'
);

-- Social Links
INSERT INTO social_links (label, href, sort_order) VALUES
  ('Instagram', 'https://instagram.com', 1),
  ('LinkedIn',  'https://linkedin.com',  2),
  ('Telegram',  'https://telegram.org',  3);

-- Reviews
INSERT INTO reviews (patient_name, role, quote, rating, sort_order) VALUES
  ('مریم حسینی',  'مریض',                'رفتار داکتر بسیار حرفه‌ای و آرام بود. توضیحات روشن باعث شد با اطمینان تصمیم بگیرم.', 5, 1),
  ('رضا نادری',   'مریض پیگیری قلب',    'پیگیری بعد از تداوی دقیق و منظم بود. احساس کردم یک پلان واقعی برای صحتم دارم.', 5, 2),
  ('سارا کریمی',  'همراه مریض',         'از فضای کلینیک تا توضیح روند تداوی، همه‌چیز حس اعتماد و کیفیت بالا داشت.', 5, 3);

-- Articles
INSERT INTO articles (slug, title, excerpt, category, reading_minutes, published_at, content, is_featured) VALUES
(
  'early-signs-of-chest-pain',
  'درد قفسه سینه؛ کِی باید فوراً نزد داکتر بروید؟',
  'مروری کاربردی بر علائم خطر، تفاوت درد قلبی با دردهای غیرقلبی و زمان مناسب مراجعه.',
  'آگاهی مریض', 7, '2026-05-11',
  ARRAY[
    'درد قفسه سینه همیشه به معنای مرض قلبی نیست، اما برخی الگوها باید جدی گرفته شوند.',
    'یکی از خطاهای رایج، تأخیر در مراجعه است.',
    'ارزیابی اولیه شامل شرح حال دقیق، نوار قلب و سنجش مارکرهای خونی است.',
    'درد قلبی معمولاً وصف آن سنگینی یا فشار روی سینه است — نه یک درد تیز.',
    'دردهای غیرقلبی مثل اسید معده یا اضطراب می‌توانند شبیه درد قلبی باشند.',
    'اگر درد بیش از ۵ دقیقه طول می‌کشد، بدون تأخیر با داکتر تماس بگیرید.',
    'پیشگیری هم بخشی از مراقبت است. کنترل فشار خون و پیگیری منظم مهم است.'
  ],
  TRUE
),
(
  'angiography-when-and-why',
  'آنژیوگرافی چیست و در چه شرایطی توصیه می‌شود؟',
  'توضیح شفاف درباره هدف آنژیوگرافی، روند انجام و نقش آن در تصمیم‌گیری درمانی.',
  'آنژیوگرافی', 8, '2026-04-17',
  ARRAY[
    'آنژیوگرافی یک روش تصویربرداری دقیق برای بررسی وضعیت عروق کرونر است.',
    'در مریضان با علائم پایدار یا نتایج غیرطبیعی، آنژیوگرافی اطلاعات تعیین‌کننده ارائه می‌کند.',
    'این روش در چارچوب یک برنامه مراقبتی کامل ارزشمند است.',
    'روند: از طریق رگ در مچ یا کشاله ران، لوله نازکی به عروق قلب هدایت می‌شود.',
    'پروسیجر معمولاً ۳۰ تا ۶۰ دقیقه طول می‌کشد.',
    'بعد از آنژیوگرافی داکتر مسیر تداوی را تعیین می‌کند.',
    'برای آمادگی، مریض باید چند ساعت قبل ناشتا باشد.',
    'در دستان یک داکتر با تجربه این روش بسیار ایمن است.'
  ],
  FALSE
),
(
  'blood-pressure-management-plan',
  'مدیریت فشار خون: برنامه‌ای ساده برای کاهش خطر قلبی',
  'راهنمای عملی برای پایش فشار خون، اصلاح شیوه زندگی و پیگیری منظم دوا.',
  'پیشگیری', 6, '2026-03-02',
  ARRAY[
    'فشار خون کنترل‌نشده یکی از مهم‌ترین عوامل خطر در امراض قلبی است.',
    'ثبت منظم فشار خون، کاهش نمک، خواب کافی و ورزش تأثیر چشمگیر دارد.',
    'پیگیری با داکتر برای تنظیم دوز دوا جدایی‌ناپذیر است.',
    'فشار بالاتر از ۱۴۰/۹۰ نیاز به توجه دارد.',
    'تغییرات سبک زندگی مؤثر هستند.',
    'اگر دوا تجویز شد، منظم مصرف کنید.',
    'پیگیری ۳ تا ۶ ماهه با داکتر ضروری است.'
  ],
  FALSE
),
(
  'ecg-report-reading-basics',
  'نوار قلب (ECG) چه اطلاعاتی به داکتر می‌دهد؟',
  'از ریتم قلب تا نشانه‌های ایسکمی؛ نوار قلب چگونه به تشخیص دقیق کمک می‌کند.',
  'تشخیص', 5, '2025-12-24',
  ARRAY[
    'نوار قلب یکی از سریع‌ترین ابزارهای تشخیصی است.',
    'تفسیر دقیق ECG وابسته به زمینه بالینی مریض است.',
    'ECG بخشی از یک تصویر کامل است.',
    'ECG ریتم، سرعت، علائم آسیب و اختلالات هدایتی را نشان می‌دهد.',
    'یک ECG طبیعی به معنی قلب کاملاً سالم نیست.',
    'ECG استرس عملکرد قلب را در زیر فشار بررسی می‌کند.',
    'ECG با تجربه داکتر به تصمیم‌گیری دقیق‌تر منجر می‌شود.'
  ],
  FALSE
);
```

---

## Supabase Environment Variables (Next.js)

Add to `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Add to Flutter admin app:
```dart
const supabaseUrl = 'https://your-project.supabase.co';
const supabaseAnonKey = 'your-anon-key';
// Admin logs in with: supabase.auth.signInWithPassword(email, password)
```

---

## Flutter Admin App — Screens & Responsibilities

| Screen | Tables Managed |
|---|---|
| Dashboard | Overview, quick stats |
| Profile Editor | `doctor_profile` |
| Contact Editor | `contact_info`, `social_links` |
| Navigation Manager | `nav_links` |
| Services Manager | `services` |
| Technology Manager | `technology_highlights` |
| Stats Manager | `stats` |
| Qualifications Manager | `qualifications`, `achievements` |
| About Highlights | `about_highlights` |
| FAQ Manager | `faqs` |
| Appointment Options | `appointment_options` |
| Article Editor | `articles` (with image upload to Storage) |
| Reviews Manager | `reviews` |
| Hero Gallery | `hero_images` (with image upload to Storage) |

> **Auth flow:** Admin opens Flutter app → `signInWithPassword()` → all write operations use the authenticated session automatically.

---

## Next.js Integration Pattern

Replace static imports from `lib/site-data.ts` with Supabase fetches. Example:

```ts
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

```ts
// Example fetch in a Next.js Server Component
const { data: profile } = await supabase
  .from('doctor_profile')
  .select('*')
  .single();

const { data: faqs } = await supabase
  .from('faqs')
  .select('*')
  .eq('is_active', true)
  .order('sort_order');

const { data: articles } = await supabase
  .from('articles')
  .select('slug, title, excerpt, category, reading_minutes, published_at, cover_url, is_featured')
  .eq('is_published', true)
  .order('published_at', { ascending: false });
```

---

## Data Entity Relationship Summary

```
doctor_profile (1 row)
    │
    ├── nav_links (many rows, ordered)
    ├── about_highlights (3 rows, ordered)
    ├── services (6 rows, ordered)
    ├── technology_highlights (3 rows, ordered)
    ├── stats (4 rows, ordered)
    ├── qualifications (4 rows, ordered)
    ├── achievements (4 rows, ordered)
    ├── faqs (N rows, ordered)
    ├── appointment_options (3 rows, ordered)
    ├── reviews (N rows, ordered)
    └── hero_images (N rows, ordered)

contact_info (1 row)
    └── social_links (N rows, ordered)

articles (N rows)
    └── cover stored in Supabase Storage: article-covers/
```

---

## Checklist — Before Going Live

- [ ] Create Supabase project and note URL + anon key
- [ ] Run the full setup SQL script in Supabase SQL editor
- [ ] Run seed data inserts
- [ ] Create storage buckets: `article-covers`, `hero-images`, `doctor-assets`
- [ ] Set storage bucket policies (public read, authenticated write)
- [ ] Create admin user in Supabase Auth (`Authentication > Users > Invite user`)
- [ ] Add `.env.local` to Next.js with Supabase credentials
- [ ] Configure Flutter admin app with Supabase URL + anon key
- [ ] Test Flutter admin login
- [ ] Upload actual images to Storage buckets and update `cover_url` / `storage_url` in tables
- [ ] Replace `lib/site-data.ts` and `lib/articles.ts` static data with Supabase fetches in Next.js
- [ ] Verify RLS: unauthenticated browser can read, cannot write
