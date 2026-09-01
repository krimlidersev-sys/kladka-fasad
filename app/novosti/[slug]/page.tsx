import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, CalendarDays } from 'lucide-react';
import { getNewsArticle, newsArticles } from '@/lib/news';
import { siteName, siteUrl } from '@/lib/site';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return newsArticles.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getNewsArticle(slug);
  if (!article) return {};
  const path = `/novosti/${article.slug}`;
  return {
    title: article.title,
    description: article.description,
    alternates: { canonical: path },
    openGraph: { type: 'article', url: `${siteUrl}${path}`, title: article.title, description: article.description, publishedTime: `${article.publishedAt}T09:00:00+03:00`, modifiedTime: article.updatedAt ? `${article.updatedAt}T09:00:00+03:00` : undefined, authors: [siteName], images: [] },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getNewsArticle(slug);
  if (!article) notFound();
  const pageUrl = `${siteUrl}/novosti/${article.slug}`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Article', headline: article.title, description: article.description, datePublished: article.publishedAt, dateModified: article.updatedAt ?? article.publishedAt, mainEntityOfPage: pageUrl, author: { '@type': 'Organization', name: siteName, url: siteUrl }, publisher: { '@type': 'Organization', name: siteName, url: siteUrl, logo: { '@type': 'ImageObject', url: `${siteUrl}/logo-101.png` } }, inLanguage: 'ru-RU' },
      { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Главная', item: siteUrl }, { '@type': 'ListItem', position: 2, name: 'Новости', item: `${siteUrl}/novosti` }, { '@type': 'ListItem', position: 3, name: article.title, item: pageUrl }] },
      { '@type': 'FAQPage', mainEntity: article.faq.map((item) => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })) },
    ],
  };

  return (
    <main className="min-h-screen bg-white text-foreground">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <header className="border-b border-[#dedee0] bg-[#efefef]"><div className="mx-auto flex h-16 max-w-[900px] items-center justify-between px-5 sm:px-8"><Link href="/" className="flex items-center gap-3"><img src="/logo-101.png" alt="101" width="36" height="36" className="size-9 rounded-xl" /><span className="text-sm font-bold">КЛАДКА / ФАСАД</span></Link><Link href="/novosti" className="text-sm font-semibold">Все статьи</Link></div></header>
      <article>
        <header className="bg-[#2a2a2c] py-12 text-white sm:py-16"><div className="mx-auto max-w-[900px] px-5 sm:px-8"><Link href="/novosti" className="inline-flex items-center gap-2 text-sm text-white/55 hover:text-white"><ArrowLeft className="size-4" />Новости</Link><div className="mt-9 flex flex-wrap items-center gap-3 text-sm text-white/55"><span className="rounded-full bg-primary px-3 py-1.5 font-semibold text-[#2a2a2c]">{article.category}</span><span className="inline-flex items-center gap-2"><CalendarDays className="size-4" />{new Intl.DateTimeFormat('ru-RU', { dateStyle: 'long' }).format(new Date(`${article.publishedAt}T12:00:00Z`))}</span><span>{article.readingTime}</span></div><h1 className="mt-6 text-[clamp(2.5rem,6vw,4.8rem)] font-semibold leading-[1] tracking-[-0.05em]">{article.title}</h1><p className="mt-7 max-w-3xl text-xl leading-8 text-white/65">{article.intro}</p></div></header>
        <div className="mx-auto max-w-[780px] px-5 py-14 sm:px-8 sm:py-20">
          {article.sections.map((section) => <section key={section.heading} className="mb-12"><h2 className="text-3xl font-semibold tracking-[-0.03em]">{section.heading}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph} className="mt-5 text-lg leading-8 text-[#555559]">{paragraph}</p>)}{section.list && <ul className="mt-5 list-disc space-y-3 pl-6 text-lg leading-8 text-[#555559]">{section.list.map((item) => <li key={item}>{item}</li>)}</ul>}</section>)}
          <section className="mt-16 border-t border-[#dedee0] pt-12"><h2 className="text-3xl font-semibold">Частые вопросы</h2><div className="mt-7 divide-y divide-[#dedee0] border-y border-[#dedee0]">{article.faq.map((item) => <details key={item.question} className="py-5"><summary className="cursor-pointer text-lg font-semibold">{item.question}</summary><p className="mt-4 leading-7 text-muted-foreground">{item.answer}</p></details>)}</div></section>
          <Link href={article.relatedService.href} className="mt-12 flex items-center justify-between rounded-2xl bg-primary p-6 text-lg font-semibold text-[#2a2a2c]">{article.relatedService.label}<ArrowRight className="size-5" /></Link>
        </div>
      </article>
    </main>
  );
}
