import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'КЛАДКА / ФАСАД — строительные бригады',
    short_name: 'КЛАДКА / ФАСАД',
    description: 'Подбор бригад каменщиков и фасадчиков для строительства МКД.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f2f0e9',
    theme_color: '#171915',
    lang: 'ru',
  };
}
