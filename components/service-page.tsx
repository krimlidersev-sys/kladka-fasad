import { ArrowLeft, ArrowRight, Building2, Check, FileText, HardHat, Ruler, Users } from 'lucide-react';
import { siteName, siteUrl } from '@/lib/site';

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
      <header className="border-b border-white/10 bg-[#171915] text-white">
        <div className="mx-auto flex h-16 max-w-[1180px] items-center justify-between px-5 sm:px-8">
          <a href="/" className="flex items-center gap-3" aria-label="На главную">
            <span className="grid size-9 place-items-center bg-accent text-[#171915]"><Building2 className="size-5" /></span>
            <span className="text-[15px] font-black tracking-[0.13em]">КЛАДКА / ФАСАД</span>
          </a>
          <a href="/#calculation" className="flex items-center gap-2 text-sm font-semibold text-accent">
            Рассчитать объект <ArrowRight className="size-4" />
          </a>
        </div>
      </header>

      <section className="construction-grid border-b border-border bg-[#f2f0e9]">
        <div className="mx-auto max-w-[1180px] px-5 py-14 sm:px-8 sm:py-20">
          <a href="/" className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-4" /> Главная
          </a>
          <div className="mt-10 grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div>
              <p className="section-kicker">{data.eyebrow}</p>
              <h1 className="mt-4 max-w-4xl text-[clamp(2.6rem,6vw,5.7rem)] font-black leading-[0.95] tracking-[-0.05em] text-[#171915]">{data.title}</h1>
              <p className="mt-7 max-w-3xl text-xl leading-8 text-[#5f615b]">{data.lead}</p>
            </div>
            <div className="border-l-4 border-primary bg-white p-6 shadow-[0_18px_50px_rgba(32,32,26,0.08)]">
              <p className="text-xs font-black uppercase tracking-[0.12em] text-primary">Расчёт по проекту</p>
              <p className="mt-3 text-2xl font-black">Состав бригады и стоимость — за 24 часа</p>
              <a href="/#calculation" className="mt-6 inline-flex h-12 items-center gap-2 bg-primary px-5 text-sm font-black text-white">
                Отправить проект <ArrowRight className="size-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto grid max-w-[1180px] gap-10 px-5 sm:px-8 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <p className="section-kicker">Состав работ</p>
            <h2 className="mt-3 text-4xl font-black tracking-[-0.035em]">Что выполняет бригада</h2>
            <p className="mt-6 text-base leading-7 text-muted-foreground">{data.description}</p>
          </div>
          <div className="grid gap-px bg-border sm:grid-cols-2">
            {data.scopes.map((scope, index) => (
              <article key={scope.title} className="min-h-48 bg-[#f6f5f0] p-6">
                <div className="flex items-center justify-between"><span className="font-mono text-xs text-primary">0{index + 1}</span><Check className="size-5 text-primary" /></div>
                <h3 className="mt-8 text-xl font-black">{scope.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{scope.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#1d211b] py-16 text-white sm:py-20">
        <div className="mx-auto max-w-[1180px] px-5 sm:px-8">
          <p className="section-kicker text-accent">Работа с генподрядчиком</p>
          <h2 className="mt-3 max-w-3xl text-4xl font-black tracking-[-0.035em]">От проекта до выхода людей на объект</h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {[FileText, Ruler, Users].map((Icon, index) => (
              <article key={data.process[index].title} className="border-t border-white/20 pt-6">
                <Icon className="size-7 text-accent" />
                <h3 className="mt-7 text-xl font-black">{data.process[index].title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/60">{data.process[index].text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f2f0e9] py-16 sm:py-20">
        <div className="mx-auto max-w-[900px] px-5 sm:px-8">
          <p className="section-kicker">Частые вопросы</p>
          <h2 className="mt-3 text-4xl font-black tracking-[-0.035em]">Что важно знать до расчёта</h2>
          <div className="mt-9 divide-y divide-[#c9c6bb] border-y border-[#c9c6bb]">
            {data.faq.map((item) => (
              <details key={item.question} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-lg font-black">
                  {item.question}<span className="text-primary group-open:rotate-45">+</span>
                </summary>
                <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground">{item.answer}</p>
              </details>
            ))}
          </div>
          <div className="mt-10 flex flex-col items-start justify-between gap-5 bg-white p-7 sm:flex-row sm:items-center">
            <div><p className="text-xl font-black">Есть проект или ведомость объёмов?</p><p className="mt-1 text-sm text-muted-foreground">Загрузите файл и получите предметный расчёт.</p></div>
            <a href="/#calculation" className="inline-flex h-12 shrink-0 items-center gap-2 bg-primary px-5 text-sm font-black text-white">Рассчитать объект <ArrowRight className="size-4" /></a>
          </div>
        </div>
      </section>

      <footer className="bg-[#171915] text-white">
        <div className="mx-auto flex max-w-[1180px] flex-col gap-4 px-5 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div className="flex items-center gap-3 text-sm font-black tracking-[0.12em]"><HardHat className="size-5 text-accent" />КЛАДКА / ФАСАД</div>
          <a href="/" className="text-xs text-white/50 hover:text-white">Все услуги и калькулятор</a>
        </div>
      </footer>
    </main>
  );
}
