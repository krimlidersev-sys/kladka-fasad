import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'КЛАДКА / ФАСАД — бригады для строительства МКД',
  description: 'Расчёт бригады каменщиков и фасадчиков, стоимости работ и выхода на объект для генподрядчиков.',
  openGraph: {
    title: 'КЛАДКА / ФАСАД — люди под ваш график строительства',
    description: 'Каменщики и фасадчики для многоквартирных домов. Расчёт состава бригады и стоимости.',
    images: [{ url: '/og.png', width: 1536, height: 1024, alt: 'КЛАДКА / ФАСАД — люди под ваш график строительства' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'КЛАДКА / ФАСАД — люди под ваш график строительства',
    description: 'Каменщики и фасадчики для многоквартирных домов. Расчёт состава бригады и стоимости.',
    images: ['/og.png'],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
