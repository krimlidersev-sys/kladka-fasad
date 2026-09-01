import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl, changeFrequency: 'weekly', priority: 1 },
    { url: `${siteUrl}/brigada-kamenshchikov`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${siteUrl}/brigada-fasadchikov`, changeFrequency: 'monthly', priority: 0.9 },
  ];
}
