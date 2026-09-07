import { ArrowLeft, ArrowRight, Check, FileText, Ruler, Users } from 'lucide-react';
import Link from '@/components/site-link';
import { siteName, sitePhone, sitePhoneDisplay, siteUrl } from '@/lib/site';

export type ServicePageData = {
  path: string;
  eyebrow: string;
  title: string;
  lead: string;
  description: string;
  keywords: string[];
  scopes: Array<{ title: string; text: string }>;
  process: Array<{ title: string; text: string }>;
  faq: Array<{ question: string; answer: string }>;
  areaServed?: string[];
  related?: Array<{ href: string; label: string }>;
};

export function ServicePage({ data }: { data: ServicePageData }) {
  const pageUrl = `${siteUrl}${data.path}`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        '@id': `${pageUrl}#service`,
        name: data.title,
        serviceType: data.eyebrow,
        provider: { '@type': 'Organization', name: siteName, url: siteUrl },
        description: data.description,
        url: pageUrl,
        telephone: sitePhone,
        areaServed: (data.areaServed ?? ['Севастополь', 'Республика Крым']).map((name) => ({
          '@type': 'AdministrativeArea',
          name,
        })),
        audience: { '@type': 'BusinessAudience', audienceType: 'Генеральные подрядчики и застройщики' },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Главная', item: siteUrl },
          { '@type': 'ListItem', position: 2, name: data.eyebrow, item: pageUrl },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: data.faq.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: { '@type': 'Answer', text: item.answer },
        })),
      },
    ],
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <header className="sticky top-0 z-40 border-b border-[#dedee0] bg-[#efefef]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1180px] items-center justify-between px-5 sm:px-8">
          <Link href="/" className="flex items-center gap-3" aria-label="На главную">
            <img src="/logo-101.png" alt="101" width="36" height="36" className="size-9 rounded-xl shadow-[0_4px_16px_rgba(255,214,0,.28)]" />
            <span><span className="block text-[15px] font-bold leading-none">КЛАДКА / ФАСАД</span><span className="mt-1 block text-[10px] text-[#77777b]">команда 101</span></span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/novosti" className="hidden rounded-lg px-3 py-2 text-sm font-medium text-[#555559] hover:bg-white md:inline-flex">Новости</Link>
            <a href={`tel:${sitePhone}`} className="soft-transition flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-semibold text-[#2a2a2c] hover:bg-white sm:px-3" aria-label={`Позвонить ${sitePhoneDisplay}`}>
              <span aria-hidden="true">☎</span><span className="hidden lg:inline">{sitePhoneDisplay}</span>
            </a>
            <Link href="/#calculation" className="soft-transition flex items-center gap-2 rounded-lg bg-[#2a2a2c] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#414145]">
              <span className="hidden sm:inline">Рассчитать объект</span><span className="sm:hidden">Расчёт</span> <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </header>

      <section className="bg-white py-6 sm:py-10">
        <div className="mx-auto max-w-[1180px] rounded-[28px] bg-[#2a2a2c] px-6 py-12 text-white sm:px-10 sm:py-16">
          <Link href="/" className="soft-transition inline-flex items-center gap-2 text-sm font-medium text-white/55 hover:text-white">
            <ArrowLeft className="size-4" /> Главная
          </Link>
          <div className="mt-10 grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div>
              <p className="section-kicker text-primary">{data.eyebrow}</p>
              <h1 className="reveal-up mt-4 max-w-4xl text-[clamp(2.6rem,6vw,5.4rem)] font-semibold leading-[0.95] tracking-[-0.05em]">{data.title}</h1>
              <p className="reveal-up-delay mt-7 max-w-3xl text-xl leading-8 text-white/60">{data.lead}</p>
            </div>
            <div className="reveal-up-delay-2 rounded-xl border border-white/10 bg-white/[.055] p-6">
              <p className="text-xs font-medium uppercase tracking-[0.08em] text-primary">Расчёт по проекту</p>
              <p className="mt-3 text-2xl font-semibold">Состав бригады и стоимость — за 24 часа</p>
              <Link href="/#calculation" className="soft-transition mt-6 inline-flex h-12 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-[#2a2a2c] hover:-translate-y-0.5 hover:bg-[#ffe342]">
                Отправить проект <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto grid max-w-[1180px] gap-10 px-5 sm:px-8 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <p className="section-kicker">Состав работ</p>
            <h2 className="mt-3 text-4xl font-semibold tracking-[-0.035em]">Что выполняет бригада</h2>
            <p className="mt-6 text-base leading-7 text-muted-foreground">{data.description}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {data.scopes.map((scope, index) => (
              <article key={scope.title} className="soft-transition min-h-48 rounded-xl border border-[#e4e4e6] bg-[#f9f9f9] p-6 hover:-translate-y-1 hover:bg-white">
                <div className="flex items-center justify-between"><span className="grid size-9 place-items-center rounded-lg bg-primary font-mono text-xs text-[#2a2a2c]">0{index + 1}</span><Check className="size-5 text-[#77777b]" /></div>
                <h3 className="mt-8 text-xl font-semibold">{scope.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{scope.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#efefef] py-16 sm:py-20">
        <div className="mx-auto max-w-[1180px] px-5 sm:px-8">
          <p className="section-kicker">Работа с генподрядчиком</p>
          <h2 className="mt-3 max-w-3xl text-4xl font-semibold tracking-[-0.035em]">От проекта до выхода людей на объект</h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {[FileText, Ruler, Users].map((Icon, index) => (
              <article key={data.process[index].title} className="rounded-xl bg-white p-6">
                <Icon className="size-7 text-[#2a2a2c]" />
                <h3 className="mt-7 text-xl font-semibold">{data.process[index].title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{data.process[index].text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-[900px] px-5 sm:px-8">
          <p className="section-kicker">Частые вопросы</p>
          <h2 className="mt-3 text-4xl font-semibold tracking-[-0.035em]">Что важно знать до расчёта</h2>
          <div className="mt-9 divide-y divide-[#d2d2d4] border-y border-[#d2d2d4]">
            {data.faq.map((item) => (
              <details key={item.question} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-lg font-medium">
                  {item.question}<span className="soft-transition grid size-8 place-items-center rounded-lg bg-[#efefef] group-open:rotate-45">+</span>
                </summary>
                <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground">{item.answer}</p>
              </details>
            ))}
          </div>
          <div className="mt-10 flex flex-col items-start justify-between gap-5 rounded-xl bg-[#f9f9f9] p-7 sm:flex-row sm:items-center">
            <div><p className="text-xl font-semibold">Есть проект или ведомость объёмов?</p><p className="mt-1 text-sm text-muted-foreground">Загрузите файл и получите предметный расчёт.</p></div>
            <Link href="/#calculation" className="soft-transition inline-flex h-12 shrink-0 items-center gap-2 rounded-lg bg-[#2a2a2c] px-5 text-sm font-medium text-white hover:bg-[#414145]">Рассчитать объект <ArrowRight className="size-4" /></Link>
          </div>
          {data.related && data.related.length > 0 && (
            <nav className="mt-8 flex flex-wrap gap-2" aria-label="Связанные услуги">
              {data.related.map((item) => (
                <Link key={item.href} href={item.href} className="rounded-full border border-[#d8d8db] px-4 py-2 text-sm text-[#555559] hover:border-[#2a2a2c] hover:text-[#2a2a2c]">
                  {item.label}
                </Link>
              ))}
            </nav>
          )}
        </div>
      </section>

      <footer className="bg-[#efefef]">
        <div className="mx-auto flex max-w-[1180px] flex-col gap-4 px-5 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div className="flex items-center gap-3 text-sm font-semibold"><img src="/logo-101.png" alt="101" width="32" height="32" className="size-8 rounded-lg" />КЛАДКА / ФАСАД <span className="font-normal text-[#8a8a8e]">— команда 101</span></div>
          <div className="flex flex-wrap items-center gap-4">
            <a href={`tel:${sitePhone}`} className="text-sm font-semibold text-[#2a2a2c] hover:underline">{sitePhoneDisplay}</a>
            <Link href="/novosti" className="text-xs text-[#6f6f73] hover:text-[#2a2a2c]">Новости</Link>
            <Link href="/" className="text-xs text-[#6f6f73] hover:text-[#2a2a2c]">Все услуги и калькулятор</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
