'use client';

import { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  CalendarDays,
  Check,
  CheckCircle2,
  FileArchive,
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
      logo: `${siteUrl}/logo-101.png`,
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

  async function submitRequest(event: React.SyntheticEvent<HTMLFormElement>) {
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
      <header className="sticky top-0 z-40 border-b border-[#dedee0] bg-[#efefef]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1180px] items-center justify-between px-5 sm:px-8">
          <a href="#top" className="flex items-center gap-3" aria-label="Главная">
            <img src="/logo-101.png" alt="101" width="36" height="36" className="size-9 rounded-xl shadow-[0_4px_16px_rgba(255,214,0,.28)]" />
            <span><span className="block text-[15px] font-bold leading-none">КЛАДКА / ФАСАД</span><span className="mt-1 block text-[10px] text-[#77777b]">команда 101</span></span>
          </a>
          <div className="hidden items-center gap-2 text-sm md:flex">
            <Link href="/brigada-kamenshchikov" className="soft-transition rounded-lg px-3 py-2 hover:bg-white">Каменщики</Link>
            <Link href="/brigada-fasadchikov" className="soft-transition rounded-lg px-3 py-2 hover:bg-white">Фасадчики</Link>
            <a href="#process" className="soft-transition rounded-lg px-3 py-2 hover:bg-white">Как работаем</a>
          </div>
          <a href="#calculation" className="soft-transition flex items-center gap-2 rounded-lg bg-[#2a2a2c] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#414145]">
            <span className="hidden sm:inline">Рассчитать объект</span><span className="sm:hidden">Расчёт</span> <ArrowRight className="size-4" />
          </a>
        </div>
      </header>

      <section id="top" className="bg-white py-6 sm:py-10">
        <div className="mx-auto grid max-w-[1180px] overflow-hidden rounded-[28px] bg-[#2a2a2c] lg:grid-cols-[0.86fr_1.14fr]">
          <div className="relative overflow-hidden px-6 py-12 text-white sm:px-10 sm:py-16 lg:p-14">
            <div className="absolute -left-20 -top-24 size-72 rounded-full bg-primary/10 blur-3xl" />
            <div className="reveal-up relative inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/7 px-3 py-2 text-xs font-medium text-white/72">
              <span className="pulse-dot size-2 rounded-full bg-primary" />
              Бригады для строительства МКД
            </div>
            <h1 className="reveal-up-delay relative mt-7 max-w-[620px] text-[clamp(2.55rem,5vw,4.8rem)] font-semibold leading-[0.98] tracking-[-0.045em]">
              Бригада каменщиков и фасадчиков под ваш график
            </h1>
            <p className="reveal-up-delay-2 relative mt-7 max-w-xl text-lg leading-7 text-white/62">
              Каменщики и фасадчики для многоквартирных домов. Посчитаем состав бригады, ориентировочную стоимость и выйдем на объект по согласованному графику.
            </p>
            <div className="reveal-up-delay-2 relative mt-10 grid max-w-xl grid-cols-3 gap-3">
              <div>
                <div className="text-2xl font-semibold text-primary">24 ч</div>
                <div className="mt-1 text-xs leading-4 text-white/45">на расчёт проекта</div>
              </div>
              <div className="border-l border-white/12 pl-4">
                <div className="text-2xl font-semibold text-primary">от 12</div>
                <div className="mt-1 text-xs leading-4 text-white/45">человек в бригаде</div>
              </div>
              <div className="border-l border-white/12 pl-4">
                <div className="text-2xl font-semibold text-primary">1 ИТР</div>
                <div className="mt-1 text-xs leading-4 text-white/45">на каждом объекте</div>
              </div>
            </div>
          </div>

          <div id="calculation" className="m-3 overflow-hidden rounded-[20px] bg-white shadow-[0_20px_60px_rgba(0,0,0,.22)] sm:m-5">
            <div className="flex items-start justify-between border-b border-border px-6 py-6 sm:px-8">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.08em] text-[#77777b]">Предварительный расчёт</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight">Параметры объекта</h2>
              </div>
              <span className="hidden items-center gap-2 rounded-lg bg-[#f0f7ef] px-3 py-2 text-xs font-medium text-[#3c6037] sm:flex">
                <ShieldCheck className="size-4" /> Данные защищены
              </span>
            </div>

            <form onSubmit={submitRequest} className="p-6 sm:p-8">
              <div className="grid gap-5 sm:grid-cols-2">
                <label htmlFor="work-type" className="field-label sm:col-span-2">
                  Вид работ
                  <Select value={workType} onValueChange={(value) => setWorkType(value as WorkType)}>
                    <SelectTrigger id="work-type" className="mt-2 h-12 w-full rounded-lg border-[#dedee0] bg-[#f9f9f9] px-4 text-base font-medium">
                      <SelectValue>{workData[workType].label}</SelectValue>
                    </SelectTrigger>
                    <SelectContent align="start">
                      <SelectItem value="masonry">Каменная кладка</SelectItem>
                      <SelectItem value="facade">Фасадные работы</SelectItem>
                    </SelectContent>
                  </Select>
                </label>

                <label htmlFor="work-volume" className="field-label">
                  Объём, м²
                  <Input
                    type="number"
                    id="work-volume"
                    min={100}
                    step={100}
                    value={volume}
                    onChange={(event) => setVolume(Number(event.target.value))}
                    className="mt-2 h-12 rounded-lg border-[#dedee0] bg-[#f9f9f9] px-4 text-base font-medium"
                  />
                </label>
                <label htmlFor="work-days" className="field-label">
                  Срок выполнения, дней
                  <Input
                    type="number"
                    id="work-days"
                    min={7}
                    value={days}
                    onChange={(event) => setDays(Number(event.target.value))}
                    className="mt-2 h-12 rounded-lg border-[#dedee0] bg-[#f9f9f9] px-4 text-base font-medium"
                  />
                </label>

                <div className="sm:col-span-2 grid gap-3 rounded-xl bg-[#2a2a2c] p-5 text-white sm:grid-cols-[1fr_auto_1fr] sm:items-center sm:p-6">
                  <div>
                    <p className="text-xs uppercase tracking-[0.12em] text-white/50">Нужная бригада</p>
                    <p className="mt-1 flex items-baseline gap-2 text-4xl font-semibold">
                      {estimate.people} <span className="text-sm font-medium text-white/60">человек</span>
                    </p>
                  </div>
                  <div className="hidden h-12 w-px bg-white/15 sm:block" />
                  <div className="sm:text-right">
                    <p className="text-xs uppercase tracking-[0.12em] text-white/50">Ориентир по работам</p>
                    <p className="mt-1 text-2xl font-semibold text-primary">{formatMoney(estimate.total)}</p>
                  </div>
                </div>

                <label htmlFor="object-address" className="field-label sm:col-span-2">
                  Адрес объекта
                  <span className="relative mt-2 block">
                    <MapPin className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      required
                      id="object-address"
                      value={address}
                      onChange={(event) => setAddress(event.target.value)}
                      placeholder="Город, улица, номер участка или корпус"
                      className="h-12 rounded-lg border-[#dedee0] bg-[#f9f9f9] pl-11 text-base"
                    />
                  </span>
                </label>

                <label htmlFor="contact-phone" className="field-label sm:col-span-2">
                  Телефон для связи
                  <span className="relative mt-2 block">
                    <Phone className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      required
                      id="contact-phone"
                      type="tel"
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                      placeholder="+7 999 000-00-00"
                      className="h-12 rounded-lg border-[#dedee0] bg-[#f9f9f9] pl-11 text-base"
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
                    <div className="mt-2 flex min-h-16 items-center gap-3 rounded-lg border border-[#ead579] bg-[#fffbed] px-4">
                      <FileArchive className="size-5 text-[#8a7300]" />
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
                      className="soft-transition mt-2 flex min-h-20 w-full items-center justify-center gap-3 rounded-lg border border-dashed border-[#c9c9cc] bg-[#f9f9f9] px-4 text-sm font-medium hover:border-[#2a2a2c] hover:bg-white"
                    >
                      <Upload className="size-5 text-[#555559]" />
                      Прикрепить PDF, DWG, Excel или архив
                    </button>
                  )}
                </div>
              </div>

              {sent ? (
                <output className="mt-6 flex items-start gap-3 rounded-lg border border-[#8cac84] bg-[#eff6ec] p-4 text-[#31512b]">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0" />
                  <div>
                    <p className="font-bold">Заявка сформирована</p>
                    <p className="mt-1 text-sm">Расчёт по объекту «{address}» передан специалисту. Свяжемся по номеру {phone}.</p>
                  </div>
                </output>
              ) : (
                <Button disabled={sending} type="submit" size="lg" className="soft-transition mt-6 h-14 w-full rounded-lg bg-[#2a2a2c] px-6 text-base font-medium text-white shadow-none hover:-translate-y-0.5 hover:bg-[#414145]">
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

      <div className="overflow-hidden border-y border-[#e4e4e6] bg-[#f9f9f9] py-3" aria-hidden="true">
        <div className="ticker-track flex gap-3 pr-3">
          {[...Array(2)].flatMap((_, group) => [
            'Каменная кладка', 'Вентилируемые фасады', 'Мокрые фасады', 'ИТР на объекте', 'Расчёт за 24 часа', 'Бригады под график',
          ].map((item) => (
            <span key={`${group}-${item}`} className="rounded-full border border-[#e2e2e4] bg-white px-5 py-2 text-sm text-[#555559]">{item}</span>
          )))}
        </div>
      </div>

      <section id="services" className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-[1180px] px-5 sm:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr]">
            <div>
              <p className="section-kicker">Наши компетенции</p>
              <h2 className="mt-3 text-4xl font-semibold leading-tight tracking-[-0.035em] sm:text-5xl">Закрываем критический объём работ</h2>
              <p className="mt-5 max-w-sm text-base leading-7 text-muted-foreground">Прозрачный расчёт, понятная зона ответственности и ежедневный контроль выработки.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                ['01', 'Каменная кладка', 'Наружные и внутренние стены, перегородки, заполнение монолитного каркаса.', '/brigada-kamenshchikov'],
                ['02', 'Фасадные системы', 'Мокрые и навесные фасады, утепление, облицовка и подсистема.', '/brigada-fasadchikov'],
                ['03', 'Управление бригадой', 'ИТР на объекте, ежедневная выработка, табели и контроль качества.', '#process'],
                ['04', 'Мобилизация', 'Комплектуем бригаду под этап и график производства работ.', '#calculation'],
              ].map(([number, title, description, href]) => (
                <article key={number} className="soft-transition min-h-52 rounded-xl border border-[#e4e4e6] bg-[#f9f9f9] p-6 hover:-translate-y-1 hover:border-[#cfcfd2] hover:bg-white sm:p-8">
                  <div className="flex items-center justify-between">
                    <span className="grid size-9 place-items-center rounded-lg bg-primary text-sm font-semibold text-[#2a2a2c]">{number}</span>
                    <Check className="size-5 text-[#77796f]" />
                  </div>
                  <h3 className="mt-9 text-xl font-semibold">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{description}</p>
                  <Link href={href} className="soft-transition mt-5 inline-flex items-center gap-2 text-sm font-medium text-[#2a2a2c] hover:gap-3">Подробнее <ArrowRight className="size-4" /></Link>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="bg-[#efefef] py-16 sm:py-24">
        <div className="mx-auto max-w-[900px] px-5 sm:px-8">
          <p className="section-kicker">Вопросы о бригадах</p>
          <h2 className="mt-3 text-4xl font-semibold tracking-[-0.035em]">Расчёт каменщиков и фасадчиков на объект</h2>
          <p className="mt-5 max-w-3xl text-base leading-7 text-muted-foreground">
            Предварительный калькулятор помогает оценить потребность в рабочих и бюджет. Для коммерческого предложения приложите проект — специалист проверит объёмы, технологию и график.
          </p>
          <div className="mt-9 divide-y divide-[#d2d2d4] border-y border-[#d2d2d4]">
            {homeFaq.map((item) => (
              <details key={item.question} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-lg font-medium">
                  {item.question}<span className="soft-transition grid size-8 place-items-center rounded-lg bg-white text-[#2a2a2c] group-open:rotate-45">+</span>
                </summary>
                <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section id="process" className="bg-white py-6 sm:py-10">
        <div className="mx-auto max-w-[1180px] rounded-[28px] bg-[#2a2a2c] px-6 py-14 text-white sm:px-10 sm:py-18">
          <p className="section-kicker text-primary">Порядок запуска</p>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {[
              [FileArchive, 'Получаем проект', 'Изучаем рабочую документацию, ведомость объёмов и график.'],
              [Users, 'Считаем ресурсы', 'Фиксируем состав бригады, выработку, стоимость и дату выхода.'],
              [CalendarDays, 'Выходим на объект', 'Мобилизуем людей и ИТР, начинаем работу по согласованному плану.'],
            ].map(([Icon, title, text], index) => {
              const ItemIcon = Icon as typeof FileArchive;
              return (
                <article key={title as string} className="soft-transition rounded-xl border border-white/10 bg-white/[.035] p-6 hover:-translate-y-1 hover:bg-white/[.065]">
                  <div className="flex items-center justify-between">
                    <ItemIcon className="size-7 text-primary" />
                    <span className="font-mono text-xs text-white/35">0{index + 1}</span>
                  </div>
                  <h3 className="mt-8 text-2xl font-semibold">{title as string}</h3>
                  <p className="mt-3 max-w-sm text-sm leading-6 text-white/55">{text as string}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <footer className="mt-6 bg-[#efefef]">
        <div className="mx-auto flex max-w-[1180px] flex-col gap-4 px-5 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div className="flex items-center gap-3 text-sm font-semibold">
            <img src="/logo-101.png" alt="101" width="32" height="32" className="size-8 rounded-lg" />
            КЛАДКА / ФАСАД <span className="font-normal text-[#8a8a8e]">— команда 101</span>
          </div>
          <p className="text-xs text-[#8a8a8e]">Комплектование строительных бригад для многоквартирных домов</p>
          <nav className="flex gap-4 text-xs text-[#6f6f73]" aria-label="Услуги">
            <Link href="/brigada-kamenshchikov" className="hover:text-[#2a2a2c]">Каменщики</Link>
            <Link href="/brigada-fasadchikov" className="hover:text-[#2a2a2c]">Фасадчики</Link>
          </nav>
        </div>
      </footer>
    </main>
  );
}
