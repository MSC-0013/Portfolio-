import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://soumyashree-rout.dev';

  return [
    {
      url: baseUrl,
      lastModified: new Date('2026-10-14'),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/projects/blackbox-x`,
      lastModified: new Date('2026-10-14'),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/projects/quorum-lab`,
      lastModified: new Date('2026-10-14'),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/projects/system-x`,
      lastModified: new Date('2026-10-14'),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
  ];
}
