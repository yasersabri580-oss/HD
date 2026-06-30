import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import fallbackArticle from "../../../assets/images/heart-health-foundation.jpg";
import { fetchArticleBySlug, fetchRelatedArticles } from '@/lib/articles'
import { getDoctor, getDoctorById } from '@/lib/doctors'
import { getLocalizedProfile } from '@/lib/profile-fallback'
import { site as staticSite } from '@/lib/site-data'
import { ArrowLeftIcon } from '@/components/icons'
import { Locale, t } from '@/lib/l10n'
import { getSiteData } from '@/lib/get-site-data'
import { localizeNumber } from '@/lib/localizeNumbers'
import { SITE_URL } from '@/lib/config'

type PageParams = Promise<{ slug: string; locale: Locale }>

/* ---------------- Metadata ---------------- */

export async function generateMetadata({
  params,
}: {
  params: PageParams
}): Promise<Metadata> {
  const { slug, locale } = await params

  try {
    const article = await fetchArticleBySlug(slug, locale)

    if (!article) {
      return {
        title: 'Article not found',
      }
    }

    return {
      title: article.title ?? 'Article',
      description: article.excerpt ?? '',
      alternates: {
        canonical: `${SITE_URL}/${locale}/articles/${slug}`,
        languages: {
          fa: `${SITE_URL}/fa/articles/${slug}`,
          en: `${SITE_URL}/en/articles/${slug}`,
          ps: `${SITE_URL}/ps/articles/${slug}`,
          'x-default': `${SITE_URL}/fa/articles/${slug}`,
        },
      },
      openGraph: {
        title: article.title ?? 'Article',
        description: article.excerpt ?? '',
        type: 'article',
        url: `${SITE_URL}/${locale}/articles/${slug}`,
        images: typeof article.cover === 'string' ? [{ url: article.cover }] : [],
      },
    }
  } catch {
    return {
      title: 'Error',
    }
  }
}

/* ---------------- Page ---------------- */

export default async function ArticlePage({
  params,
}: {
  params: PageParams
}) {
  const { slug, locale } = await params

  let article: any = null
  try {
    article = await fetchArticleBySlug(slug, locale)
  } catch (err) {
    console.error('Article fetch failed:', err)
  }

  if (!article) {
    notFound()
  }

  let related: any[] = []
  try {
    related = await fetchRelatedArticles(slug, locale, 2)
  } catch (err) {
    console.error('Related fetch failed:', err)
  }

  let profileGallery: any = { heroGallery: {} }
  try {
    profileGallery = await getSiteData(locale)
  } catch (err) {
    console.error('Site data failed:', err)
  }

  let doctor: any = null
  try {
    if (article.authorSlug) {
      doctor = await getDoctor(article.authorSlug)
    } else if (article.authorId) {
      doctor = await getDoctorById(article.authorId)
    } else if (process.env.NEXT_PUBLIC_DOCTOR_ID) {
      doctor = await getDoctorById(process.env.NEXT_PUBLIC_DOCTOR_ID)
    }
  } catch (err) {
    console.error('Doctor fetch failed:', err)
  }

  const coverSrc =
    typeof article.cover === 'string'
      ? article.cover
      : article.cover?.src || "https://qtryyswmdsfmukgrxuaq.supabase.co/storage/v1/object/public/article-covers/b58a98b2-5eec-42ea-84a8-3706df8666cf/heart-health-foundation.jpg"

  const doctorProfile = doctor ? (doctor?.doctor_profile ?? doctor) : null
  const authorLocalized = doctorProfile
    ? getLocalizedProfile(doctorProfile, locale, staticSite)
    : null

  const isEn = locale === 'en'

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title ?? '',
    description: article.excerpt ?? '',
    image: coverSrc,
    datePublished: article.publishedAt ?? '',
    author: authorLocalized
      ? {
          '@type': 'Person',
          name: authorLocalized.fullName,
          url: `${SITE_URL}/${locale}/doctor/${article.authorSlug || 'mohibullah-ahmadzai'}`,
        }
      : undefined,
    publisher: authorLocalized
      ? { '@type': 'Person', name: authorLocalized.fullName }
      : undefined,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/${locale}/articles/${slug}`,
    },
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: isEn ? 'Home' : 'صفحه اصلی',
        item: `${SITE_URL}/${locale}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: isEn ? 'Articles' : 'مقالات',
        item: `${SITE_URL}/${locale}/articles`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: article.title ?? '',
        item: `${SITE_URL}/${locale}/articles/${slug}`,
      },
    ],
  }

  return (
    <main className="article-page">
      <section className="section">
        <div className="container article-layout">
          <article className="article-main glass-card">
            <div className="article-cover">
              <Image
                src={coverSrc}
                alt={article.title ?? 'Article'}
                fill
                sizes="(max-width: 1024px) 100vw, 70vw"
                className="media-image"
              />
            </div>

            <div className="article-body">
              <span className="article-meta">
                {article.category ?? ''} •{' '}
                {article.readingMinutes != null
                  ? localizeNumber(article.readingMinutes, locale)
                  : ''}{' '}
                {t({ fa: 'دقیقه مطالعه', en: 'min read', ps: 'دقیقې لوستل' }, locale)} •{' '}
                {article.publishedAt ?? ''}
              </span>

              <h1>{article.title}</h1>

              {Array.isArray(article.content) &&
                article.content.map((paragraph: string, idx: number) => (
                  <p key={idx} className={idx === 0 ? 'article-intro' : ''}>
                    {paragraph}
                  </p>
                ))}

              {doctor && (
                <div className="article-author glass-card">
                  {(() => {
                    const profile = doctor?.doctor_profile ?? doctor
                    const localized = getLocalizedProfile(profile, locale, staticSite)

                    return (
                      <>
                        <div className="author-avatar">
                          <Image
                            src={profileGallery?.heroGallery?.doctor || '/doctor.jpg'}
                            alt={localized?.fullName ?? 'Doctor'}
                            width={80}
                            height={80}
                            className="media-image rounded-full"
                          />
                        </div>

                        <div>
                          <Link href="/" className="inline-link">
                            <strong>{localized?.fullName}</strong>
                          </Link>

                          <p className="mt-4">
                            {localized?.tagline || localized?.aboutParagraph || ''}
                          </p>

                          <p className="mt-6 small-muted">
                            {localized?.seoDescription || ''}
                          </p>
                        </div>
                      </>
                    )
                  })()}
                </div>
              )}

              <Link href={`/${locale}`} className="inline-link">
                {isEn ? 'Back to Home' : 'برگشت به صفحه اصلی'}
                <ArrowLeftIcon />
              </Link>
            </div>
          </article>

          <aside className="article-related">
            <h2>{isEn ? 'Related Articles' : 'مقالات مرتبط'}</h2>

            <div className="related-list">
              {related.map((item: any) => (
                <article key={item.slug} className="related-item glass-card">
                  <h3>{item.title}</h3>
                  <p>{item.excerpt}</p>

                  <Link href={`/${locale}/articles/${item.slug}`} className="inline-link">
                    {isEn ? 'Read' : 'مطالعه'}
                    <ArrowLeftIcon />
                  </Link>
                </article>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
    </main>
  )
}