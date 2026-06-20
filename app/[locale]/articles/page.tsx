import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeftIcon } from '@/components/icons';
// your existing data loader
import { Locale } from '@/lib/l10n';
import { getAllArticlesByLocale } from '@/lib/articles';


export default async function ArticlesArchivePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;   // ← params is now a Promise
}) {
  
 
console.log("params", params)
  const { locale } = await params;       // ← await it
console.log("local is", locale)
  const articles = await getAllArticlesByLocale(locale);

  return (
    <main className="article-archive">
      <section className="section">
        <div className="container">
          <div className="archive-head" data-reveal>
            <span className="hero-tag">Medical Publication</span>
         <h1>
  {locale === 'en'
    ? 'Heart Health Articles Archive'
    : locale === 'ps'
    ? 'د زړه روغتیا مقالو آرشیف'         
    : 'آرشیو مقالات سلامت قلب'}
</h1>
<p>
  {locale === 'en'
    ? 'Educational and practical analyses for better heart care decisions – in simple language for every patient.'
    : locale === 'ps'
    ? 'د زړه روغتیا پاملرنې د غوره پریکړو لپاره تعلیمي او عملي تحلیلونه – د هر ناروغ لپاره په ساده ژبه'
    : 'تحلیل‌های آموزشی و کاربردی برای تصمیم‌گیری بهتر در مسیر مراقبت قلبی — به زبان ساده برای هر مریض.'}
</p>
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
                    {locale === 'en' ? 'min read' : 'دقیقه'} • {item.publishedAt}
                  </span>
                  <h3>{item.title}</h3>
                  <p>{item.excerpt}</p>
                  <Link
                    href={`${locale}/articles/${item.slug}`}
                    className="inline-link"
                  >
<Link href={`/${locale}/articles/${item.slug}`} className="inline-link">
  {locale === 'en'
    ? 'Read Article'
    : locale === 'ps'
    ? 'لیکنه ولوله'
    : 'مطالعه مقاله'}
  <ArrowLeftIcon />
</Link>
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