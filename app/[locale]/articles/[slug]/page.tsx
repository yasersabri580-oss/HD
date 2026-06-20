import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { fetchArticleBySlug, fetchRelatedArticles } from '@/lib/articles'
import { getDoctor, getDoctorById } from '@/lib/doctors'
import { getLocalizedProfile } from '@/lib/profile-fallback'
import { site as staticSite } from '@/lib/site-data'
import { ArrowLeftIcon } from '@/components/icons'
import { Locale } from '@/lib/l10n'
import { getSiteData } from '@/lib/get-site-data'

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
      : article.cover?.src || '/assets/images/heart-health-foundation.jpg'

  const isEn = locale === 'en'

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
                {article.category ?? ''} • {article.readingMinutes ?? ''}{' '}
                {isEn ? 'min read' : 'دقیقه مطالعه'} • {article.publishedAt ?? ''}
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

              <Link href="/" className="inline-link">
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
    </main>
  )
}