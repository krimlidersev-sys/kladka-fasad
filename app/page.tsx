'use client';

import { useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  Building2,
  CalendarDays,
  Check,
  CheckCircle2,
  FileArchive,
  HardHat,
  MapPin,
  Phone,
  ShieldCheck,
  Upload,
  Users,
  X,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { siteName, siteUrl } from '@/lib/site';

type WorkType = 'masonry' | 'facade';

const workData = {
  masonry: { label: 'Каменная кладка', productivity: 7, rate: 2900 },
  facade: { label: 'Фасадные работы', productivity: 10, rate: 2600 },
} satisfies Record<WorkType, { label: string; productivity: number; rate: number }>;

const homeFaq = [
  {
    question: 'Как рассчитать количество каменщиков или фасадчиков?',
    answer: 'Укажите вид работ, площадь и срок. Калькулятор покажет предварительный состав бригады. Точный расчёт делаем по проекту, ведомости объёмов и календарному графику.',
  },
  {
    question: 'Какие файлы можно отправить для расчёта?',
    answer: 'Принимаем PDF, DWG, DXF, Excel и архивы до 25 МБ. Подойдут рабочая документация, планы, узлы, спецификации и ведомость объёмов.',
  },
  {
    question: 'От чего зависит стоимость работ?',
    answer: 'Стоимость зависит от технологии, материала, сложности узлов, этажности, организации фронта работ и требуемого срока. Предварительный ориентир уточняется после изучения проекта.',
  },
  {
    question: 'Для каких объектов комплектуются бригады?',
    answer: 'Основная специализация — строительство многоквартирных домов: каменная кладка, перегородки, вентилируемые и мокрые фасады, утепление и облицовка.',
  },
];

const homeJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${siteUrl}/#organization`,
      name: siteName,
      url: siteUrl,
      logo: `${siteUrl}/favicon.svg`,
      image: `${siteUrl}/og.png`,
      description: 'Бригады каменщиков и фасадчиков для строительства многоквартирных домов.',
    },
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      name: siteName,
      url: siteUrl,
      inLanguage: 'ru-RU',
      publisher: { '@id': `${siteUrl}/#organization` },
    },
    {
      '@type': 'ProfessionalService',
      '@id': `${siteUrl}/#service`,
      name: 'Бригады каменщиков и фасадчиков для МКД',
      url: siteUrl,
      provider: { '@id': `${siteUrl}/#organization` },
      audience: { '@type': 'BusinessAudience', audienceType: 'Генеральные подрядчики и застройщики' },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Строительные бригады',
        itemListElement: [
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Бригада каменщиков', url: `${siteUrl}/brigada-kamenshchikov` } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Бригада фасадчиков', url: `${siteUrl}/brigada-fasadchikov` } },
        ],
      },
    },
    {
      '@type': 'FAQPage',
      mainEntity: homeFaq.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer },
      })),
    },
  ],
};

function formatMoney(value: number) {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(value);
}

export default function Home() {
  const [workType, setWorkType] = useState<WorkType>('masonry');
  const [volume, setVolume] = useState(3200);
  const [days, setDays] = useState(75);
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const estimate = useMemo(() => {
    const data = workData[workType];
    const safeVolume = Math.max(0, Number(volume) || 0);
    const safeDays = Math.max(1, Number(days) || 1);
    const people = Math.max(4, Math.ceil(safeVolume / (safeDays * data.productivity)));
    const total = safeVolume * data.rate;
    return { people, total };
  }, [workType, volume, days]);

  async function submitRequest(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSending(true);
    setSubmitError('');

    const form = new FormData();
    form.set('workType', workType);
    form.set('volume', String(volume));
    form.set('days', String(days));
    form.set('address', address);
    form.set('phone', phone);
    if (file) form.set('project', file);

    try {
      const response = await fetch('/api/leads', { method: 'POST', body: form });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error || 'Не удалось отправить заявку.');
      setSent(true);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Не удалось отправить заявку.');
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd) }} />
      <header className="border-b border-white/10 bg-[#171915] text-white">
        <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-5 sm:px-8">
          <a href="#top" className="flex items-center gap-3" aria-label="Главная">
            <span className="grid size-9 place-items-center bg-accent text-[#171915]">
              <Building2 className="size-5" />
            </span>
            <span className="text-[15px] font-black tracking-[0.13em]">КЛАДКА / ФАСАД</span>
          </a>
          <div className="hidden items-center gap-8 text-sm text-white/65 md:flex">
            <a href="/brigada-kamenshchikov" className="transition hover:text-white">Каменщики</a>
            <a href="/brigada-fasadchikov" className="transition hover:text-white">Фасадчики</a>
            <a href="#process" className="transition hover:text-white">Как работаем</a>
          </div>
          <a href="#calculation" className="flex items-center gap-2 text-sm font-semibold text-accent">
            Рассчитать объект <ArrowRight className="size-4" />
          </a>
        </div>
      </header>

      <section id="top" className="construction-grid border-b border-border bg-[#f2f0e9]">
        <div className="mx-auto grid max-w-[1280px] gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-start lg:py-20">
          <div className="pt-2 lg:sticky lg:top-6">
            <div className="mb-7 inline-flex items-center gap-2 border border-[#b9b6a9] bg-white/60 px-3 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[#5b5c55]">
              <HardHat className="size-4 text-primary" />
              Бригады для МКД
            </div>
            <h1 className="max-w-[650px] text-[clamp(2.7rem,6vw,5.8rem)] font-black leading-[0.92] tracking-[-0.055em] text-[#171915]">
              Бригада каменщиков и фасадчиков под ваш график
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-[#5f615b]">
              Каменщики и фасадчики для многоквартирных домов. Посчитаем состав бригады, ориентировочную стоимость и выйдем на объект по согласованному графику.
            </p>
            <div className="mt-9 grid max-w-xl grid-cols-3 border-y border-[#c9c6bb] py-5">
              <div>
                <div className="text-2xl font-black text-[#171915]">24 ч</div>
                <div className="mt-1 text-xs text-[#6c6e67]">на расчёт проекта</div>
              </div>
              <div className="border-l border-[#c9c6bb] pl-5">
                <div className="text-2xl font-black text-[#171915]">от 12</div>
                <div className="mt-1 text-xs text-[#6c6e67]">человек в бригаде</div>
              </div>
              <div className="border-l border-[#c9c6bb] pl-5">
                <div className="text-2xl font-black text-[#171915]">1 ИТР</div>
                <div className="mt-1 text-xs text-[#6c6e67]">на каждом объекте</div>
              </div>
            </div>
          </div>

          <div id="calculation" className="overflow-hidden border border-[#d0cdc1] bg-white shadow-[0_24px_80px_rgba(32,32,26,0.10)]">
            <div className="flex items-start justify-between border-b border-border px-6 py-6 sm:px-8">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">Предварительный расчёт</p>
                <h2 className="mt-2 text-2xl font-black tracking-tight">Параметры объекта</h2>
              </div>
              <span className="hidden items-center gap-2 bg-[#eff4ed] px-3 py-2 text-xs font-semibold text-[#3c6037] sm:flex">
                <ShieldCheck className="size-4" /> Данные защищены
              </span>
            </div>

            <form onSubmit={submitRequest} className="p-6 sm:p-8">
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="field-label sm:col-span-2">
                  Вид работ
                  <Select value={workType} onValueChange={(value) => setWorkType(value as WorkType)}>
                    <SelectTrigger className="mt-2 h-12 w-full rounded-none border-[#d5d2c8] bg-[#faf9f5] px-4 text-base font-semibold">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent align="start">
                      <SelectItem value="masonry">Каменная кладка</SelectItem>
                      <SelectItem value="facade">Фасадные работы</SelectItem>
                    </SelectContent>
                  </Select>
                </label>

                <label className="field-label">
                  Объём, м²
                  <Input
                    type="number"
                    min={100}
                    step={100}
                    value={volume}
                    onChange={(event) => setVolume(Number(event.target.value))}
                    className="mt-2 h-12 rounded-none border-[#d5d2c8] bg-[#faf9f5] px-4 text-base font-bold"
                  />
                </label>
                <label className="field-label">
                  Срок выполнения, дней
                  <Input
                    type="number"
                    min={7}
                    value={days}
                    onChange={(event) => setDays(Number(event.target.value))}
                    className="mt-2 h-12 rounded-none border-[#d5d2c8] bg-[#faf9f5] px-4 text-base font-bold"
                  />
                </label>

                <div className="sm:col-span-2 grid gap-3 bg-[#1d211b] p-5 text-white sm:grid-cols-[1fr_auto_1fr] sm:items-center sm:p-6">
                  <div>
                    <p className="text-xs uppercase tracking-[0.12em] text-white/50">Нужная бригада</p>
                    <p className="mt-1 flex items-baseline gap-2 text-4xl font-black">
                      {estimate.people} <span className="text-sm font-medium text-white/60">человек</span>
                    </p>
                  </div>
                  <div className="hidden h-12 w-px bg-white/15 sm:block" />
                  <div className="sm:text-right">
                    <p className="text-xs uppercase tracking-[0.12em] text-white/50">Ориентир по работам</p>
                    <p className="mt-1 text-2xl font-black text-accent">{formatMoney(estimate.total)}</p>
                  </div>
                </div>

                <label className="field-label sm:col-span-2">
                  Адрес объекта
                  <span className="relative mt-2 block">
                    <MapPin className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      required
                      value={address}
                      onChange={(event) => setAddress(event.target.value)}
                      placeholder="Город, улица, номер участка или корпус"
                      className="h-12 rounded-none border-[#d5d2c8] bg-[#faf9f5] pl-11 text-base"
                    />
                  </span>
                </label>

                <label className="field-label sm:col-span-2">
                  Телефон для связи
                  <span className="relative mt-2 block">
                    <Phone className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      required
                      type="tel"
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                      placeholder="+7 999 000-00-00"
                      className="h-12 rounded-none border-[#d5d2c8] bg-[#faf9f5] pl-11 text-base"
                    />
                  </span>
                </label>

                <div className="sm:col-span-2">
                  <p className="field-label">Проект или ведомость объёмов</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.dwg,.dxf,.zip,.rar,.xlsx,.xls"
                    className="sr-only"
                    onChange={(event) => setFile(event.target.files?.[0] ?? null)}
                  />
                  {file ? (
                    <div className="mt-2 flex min-h-16 items-center gap-3 border border-primary/30 bg-primary/5 px-4">
                      <FileArchive className="size-5 text-primary" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold">{file.name}</p>
                        <p className="text-xs text-muted-foreground">Файл готов к отправке</p>
                      </div>
                      <button type="button" onClick={() => setFile(null)} className="p-2 text-muted-foreground hover:text-foreground" aria-label="Удалить файл">
                        <X className="size-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="mt-2 flex min-h-20 w-full items-center justify-center gap-3 border border-dashed border-[#aaa79d] bg-[#faf9f5] px-4 text-sm font-semibold transition hover:border-primary hover:bg-primary/5"
                    >
                      <Upload className="size-5 text-primary" />
                      Прикрепить PDF, DWG, Excel или архив
                    </button>
                  )}
                </div>
              </div>

              {sent ? (
                <div className="mt-6 flex items-start gap-3 border border-[#8cac84] bg-[#eff6ec] p-4 text-[#31512b]" role="status">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0" />
                  <div>
                    <p className="font-bold">Заявка сформирована</p>
                    <p className="mt-1 text-sm">Расчёт по объекту «{address}» передан специалисту. Свяжемся по номеру {phone}.</p>
                  </div>
                </div>
              ) : (
                <Button disabled={sending} type="submit" size="lg" className="mt-6 h-14 w-full rounded-none bg-primary px-6 text-base font-black text-primary-foreground shadow-none hover:bg-[#a84628]">
                  {sending ? 'Отправляем заявку…' : 'Получить точный расчёт'} {!sending && <ArrowRight className="ml-2 size-5" />}
                </Button>
              )}
              {submitError && <p role="alert" className="mt-3 text-center text-sm font-semibold text-destructive">{submitError}</p>}
              <p className="mt-3 text-center text-xs leading-relaxed text-muted-foreground">
                Ориентир рассчитан по средним нормативам. Точная цена и состав бригады — после изучения проекта.
              </p>
            </form>
          </div>
        </div>
      </section>

      <section id="services" className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr]">
            <div>
              <p className="section-kicker">Наши компетенции</p>
              <h2 className="mt-3 text-4xl font-black leading-tight tracking-[-0.035em] sm:text-5xl">Закрываем критический объём работ</h2>
            </div>
            <div className="grid gap-px bg-border sm:grid-cols-2">
              {[
                ['01', 'Каменная кладка', 'Наружные и внутренние стены, перегородки, заполнение монолитного каркаса.', '/brigada-kamenshchikov'],
                ['02', 'Фасадные системы', 'Мокрые и навесные фасады, утепление, облицовка и подсистема.', '/brigada-fasadchikov'],
                ['03', 'Управление бригадой', 'ИТР на объекте, ежедневная выработка, табели и контроль качества.', '#process'],
                ['04', 'Мобилизация', 'Комплектуем бригаду под этап и график производства работ.', '#calculation'],
              ].map(([number, title, description, href]) => (
                <article key={number} className="min-h-52 bg-[#f6f5f0] p-6 sm:p-8">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-black text-primary">{number}</span>
                    <Check className="size-5 text-[#77796f]" />
                  </div>
                  <h3 className="mt-9 text-xl font-black">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{description}</p>
                  <a href={href} className="mt-5 inline-flex items-center gap-2 text-sm font-black text-primary">Подробнее <ArrowRight className="size-4" /></a>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="bg-[#f2f0e9] py-16 sm:py-20">
        <div className="mx-auto max-w-[900px] px-5 sm:px-8">
          <p className="section-kicker">Вопросы о бригадах</p>
          <h2 className="mt-3 text-4xl font-black tracking-[-0.035em]">Расчёт каменщиков и фасадчиков на объект</h2>
          <p className="mt-5 max-w-3xl text-base leading-7 text-muted-foreground">
            Предварительный калькулятор помогает оценить потребность в рабочих и бюджет. Для коммерческого предложения приложите проект — специалист проверит объёмы, технологию и график.
          </p>
          <div className="mt-9 divide-y divide-[#c9c6bb] border-y border-[#c9c6bb]">
            {homeFaq.map((item) => (
              <details key={item.question} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-lg font-black">
                  {item.question}<span className="text-primary group-open:rotate-45">+</span>
                </summary>
                <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section id="process" className="border-y border-white/10 bg-[#1d211b] py-16 text-white sm:py-20">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
          <p className="section-kicker text-accent">Порядок запуска</p>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {[
              [FileArchive, 'Получаем проект', 'Изучаем рабочую документацию, ведомость объёмов и график.'],
              [Users, 'Считаем ресурсы', 'Фиксируем состав бригады, выработку, стоимость и дату выхода.'],
              [CalendarDays, 'Выходим на объект', 'Мобилизуем людей и ИТР, начинаем работу по согласованному плану.'],
            ].map(([Icon, title, text], index) => {
              const ItemIcon = Icon as typeof FileArchive;
              return (
                <article key={title as string} className="border-t border-white/20 pt-6">
                  <div className="flex items-center justify-between">
                    <ItemIcon className="size-7 text-accent" />
                    <span className="font-mono text-xs text-white/35">0{index + 1}</span>
                  </div>
                  <h3 className="mt-8 text-2xl font-black">{title as string}</h3>
                  <p className="mt-3 max-w-sm text-sm leading-6 text-white/55">{text as string}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <footer className="bg-[#171915] text-white">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-4 px-5 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div className="flex items-center gap-3 text-sm font-black tracking-[0.12em]">
            <span className="grid size-8 place-items-center bg-accent text-[#171915]"><Building2 className="size-4" /></span>
            КЛАДКА / ФАСАД
          </div>
          <p className="text-xs text-white/40">Комплектование строительных бригад для многоквартирных домов</p>
          <nav className="flex gap-4 text-xs text-white/50" aria-label="Услуги">
            <a href="/brigada-kamenshchikov" className="hover:text-white">Каменщики</a>
            <a href="/brigada-fasadchikov" className="hover:text-white">Фасадчики</a>
          </nav>
        </div>
      </footer>
    </main>
  );
}
