import Link from 'next/link'

export default function NotFound() {
  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24 }}>
      <section style={{ maxWidth: 480, textAlign: 'center' }}>
        <h2>صفحه مورد نظر یافت نشد</h2>
        <p>این آدرس وجود ندارد یا به‌روزرسانی شده است.</p>
        <Link href="/">بازگشت به صفحه اصلی</Link>
      </section>
    </main>
  )
}
