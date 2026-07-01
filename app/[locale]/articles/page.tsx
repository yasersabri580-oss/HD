import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeftIcon } from '@/components/icons';
// your existing data loader
import { Locale } from '@/lib/l10n';
import { getAllArticlesByLocale } from '@/lib/articles';
import { SITE_URL } from '@/lib/config';

const ARCHIVE_TITLE: Record<Locale, string> = {
  en: 'Heart Health Articles Archive',
  ps: 'د زړه روغتیا مقالو آرشیف',
  fa: 'آرشیو مقالات سلامت قلب',
}

const ARCHIVE_DESC: Record<Locale, string> = {
  en: 'Educational and practical analyses for better heart care decisions – in simple language for every patient.',
  ps: 'د زړه روغتیا پاملرنې د غوره پریکړو لپاره تعلیمي او عملي تحلیلونه – د هر ناروغ لپاره په ساده ژبه',
  fa: 'تحلیل‌های آموزشی و کاربردی برای تصمیم‌گیری بهتر در مسیر مراقبت قلبی — به زبان ساده برای هر مریض.',
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: ARCHIVE_TITLE[locale] ?? ARCHIVE_TITLE.fa,
    description: ARCHIVE_DESC[locale] ?? ARCHIVE_DESC.fa,
    alternates: {
      canonical: `${SITE_URL}/${locale}/articles`,
      languages: {
        fa: `${SITE_URL}/fa/articles`,
        en: `${SITE_URL}/en/articles`,
        ps: `${SITE_URL}/ps/articles`,
        'x-default': `${SITE_URL}/fa/articles`,
      },
    },
  };
}

export default async function ArticlesArchivePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;   // ← params is now a Promise
}) {
  const { locale } = await params;       // ← await it
  const articles = await getAllArticlesByLocale(locale);

  return (
    <main className="article-archive">
      <section className="section">
        <div className="container">
          <div className="archive-head" data-reveal>
            <span className="hero-tag">Medical Publication</span>
         <h1>{ARCHIVE_TITLE[locale]}</h1>
<p>{ARCHIVE_DESC[locale]}</p>
          </div>

          <div className="articles-grid" data-reveal>
            {articles.map((item: any) => (
              <article key={item.slug} className="article-card glass-card">
                <div className="article-card-media">
                  <Image
                    src={item.cover || item.coverUrl}
                    alt={item.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 30vw"
                    className="media-image"
                  />
                </div>
                <div className="article-card-copy">
                  <span className="article-meta">
                    {item.category} • {item.readingMinutes}{' '}
                    {locale === 'en' ? 'min read' : locale === 'ps' ? 'دقیقې' : 'دقیقه'} • {item.publishedAt}
                  </span>
                  <h3>{item.title}</h3>
                  <p>{item.excerpt}</p>
                  <Link
                    href={`/${locale}/articles/${item.slug}`}
                    className="inline-link"
                  >
                    {locale === 'en'
                      ? 'Read Article'
                      : locale === 'ps'
                      ? 'لیکنه ولوله'
                      : 'مطالعه مقاله'}
                    <ArrowLeftIcon />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}