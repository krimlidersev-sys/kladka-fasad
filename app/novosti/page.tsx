import type { Metadata } from 'next';
import Link from '@/components/site-link';
import { ArrowLeft, ArrowRight, CalendarDays, Phone } from 'lucide-react';
import { newsArticles } from '@/lib/news';
import { siteName, sitePhone, sitePhoneDisplay, siteUrl } from '@/lib/site';

const path = '/novosti';

export const metadata: Metadata = {
  title: 'Новости и статьи о кладке и фасадах',
  description: 'Практические статьи о кладке газоблока, работе каменщиков, утеплении, мокрых и вентилируемых фасадах в Севастополе и Крыму.',
  alternates: { canonical: path },
  openGraph: { type: 'website', url: `${siteUrl}${path}`, title: `Новости и статьи | ${siteName}`, description: 'Практика кладочных и фасадных работ для заказчиков и генподрядчиков.', images: [] },
};

export default function NewsPage() {
  return (
    <main className="min-h-screen bg-white text-foreground">
      <header className="sticky top-0 z-40 border-b border-[#dedee0] bg-[#efefef]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1180px] items-center justify-between px-5 sm:px-8">
          <Link href="/" className="flex items-center gap-3"><img src="/logo-101.png" alt="101" width="36" height="36" className="size-9 rounded-xl" /><span className="text-[15px] font-bold">КЛАДКА / ФАСАД</span></Link>
          <div className="flex items-center gap-2"><a href={`tel:${sitePhone}`} className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold hover:bg-white"><Phone className="size-4" /><span className="hidden sm:inline">{sitePhoneDisplay}</span></a><Link href="/#calculation" className="rounded-lg bg-[#2a2a2c] px-4 py-2.5 text-sm font-medium text-white">Рассчитать объект</Link></div>
        </div>
      </header>

      <section className="bg-[#2a2a2c] py-14 text-white sm:py-20">
        <div className="mx-auto max-w-[1180px] px-5 sm:px-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-white/55 hover:text-white"><ArrowLeft className="size-4" />Главная</Link>
          <p className="section-kicker mt-10 text-primary">Практика строительства</p>
          <h1 className="mt-4 max-w-4xl text-[clamp(2.8rem,6vw,5.2rem)] font-semibold leading-[0.98] tracking-[-0.05em]">Новости и статьи</h1>
          <p className="mt-6 max-w-2xl text-lg leading-7 text-white/60">Разбираем технологии кладки и фасадов, организацию бригад и контроль качества на объектах Севастополя и Крыма.</p>
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-[1180px] px-5 sm:px-8">
          <div className="grid gap-4 md:grid-cols-2">
            {newsArticles.map((article) => (
              <article key={article.slug} className="rounded-2xl border border-[#dedee0] bg-[#f9f9f9] p-7 sm:p-8">
                <div className="flex flex-wrap items-center gap-3 text-xs text-[#77777b]"><span className="rounded-full bg-primary px-3 py-1.5 font-semibold text-[#2a2a2c]">{article.category}</span><span className="inline-flex items-center gap-1.5"><CalendarDays className="size-4" />{new Intl.DateTimeFormat('ru-RU', { dateStyle: 'long' }).format(new Date(`${article.publishedAt}T12:00:00Z`))}</span><span>{article.readingTime}</span></div>
                <h2 className="mt-6 text-2xl font-semibold tracking-[-0.025em]">{article.title}</h2>
                <p className="mt-4 leading-7 text-muted-foreground">{article.description}</p>
                <Link href={`/novosti/${article.slug}`} className="mt-7 inline-flex items-center gap-2 font-semibold hover:gap-3">Читать статью <ArrowRight className="size-4" /></Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
