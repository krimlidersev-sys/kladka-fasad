import type { Metadata } from 'next';
import { siteName, siteUrl } from '@/lib/site';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Кладка и фасадные работы в Севастополе и Крыму | КЛАДКА / ФАСАД',
    template: `%s | ${siteName}`,
  },
  description:
    'Кладка газоблока и кирпича, мокрые и вентилируемые фасады в Севастополе и Крыму. Бригады для МКД, расчёт по проекту за 24 часа.',
  keywords: [
    'бригада каменщиков',
    'каменщики на объект',
    'услуги каменщиков',
    'бригада фасадчиков',
    'фасадные работы',
    'строительство многоквартирных домов',
    'каменная кладка цена за м2',
    'монтаж фасада',
    'кладка газоблока Севастополь',
    'кладка газобетона Крым',
    'фасадные работы Севастополь',
    'мокрый фасад Крым',
  ],
  alternates: { canonical: '/' },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: siteUrl,
    siteName,
    title: 'Кладка и фасадные работы в Севастополе и Крыму',
    description: 'Бригады каменщиков и фасадчиков. Газоблок, кирпич, мокрые и вентилируемые фасады для МКД.',
    images: [
      {
        url: `${siteUrl}/og.png`,
        width: 1536,
        height: 1024,
        alt: 'КЛАДКА / ФАСАД — люди под ваш график строительства',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Бригада каменщиков и фасадчиков для строительства МКД',
    description: 'Расчёт состава бригады, стоимости и сроков выхода на объект по проекту.',
    images: [`${siteUrl}/og.png`],
  },
  icons: {
    icon: [{ url: '/favicon.png', type: 'image/png', sizes: '256x256' }],
    apple: [{ url: '/logo-101.png', type: 'image/png', sizes: '512x512' }],
  },
  category: 'construction',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
