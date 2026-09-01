import type { MetadataRoute } from 'next';
import { newsArticles } from '@/lib/news';
import { siteUrl } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: MetadataRoute.Sitemap = [
    { url: siteUrl, changeFrequency: 'weekly', priority: 1 },
    { url: `${siteUrl}/brigada-kamenshchikov`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${siteUrl}/brigada-fasadchikov`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${siteUrl}/kladka-gazobloka-sevastopol`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${siteUrl}/fasadnye-raboty-sevastopol`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${siteUrl}/kladka-gazobloka-krym`, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${siteUrl}/fasadnye-raboty-krym`, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${siteUrl}/novosti`, changeFrequency: 'daily', priority: 0.8 },
  ];

  return [
    ...pages,
    ...newsArticles.map((article) => ({
      url: `${siteUrl}/novosti/${article.slug}`,
      lastModified: article.updatedAt ?? article.publishedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.75,
    })),
  ];
}
