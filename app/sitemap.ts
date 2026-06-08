import type { MetadataRoute } from 'next';
import { SITE } from './lib/seo';
import { posts } from './blog/posts';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE.url}/`,                       lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${SITE.url}/how-it-works`,           lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE.url}/features`,               lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE.url}/free-turnitin-report`,   lastModified: now, changeFrequency: 'weekly',  priority: 0.95 },
    { url: `${SITE.url}/custom-turnitin-report`, lastModified: now, changeFrequency: 'weekly',  priority: 0.95 },
    { url: `${SITE.url}/faq`,                    lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE.url}/about`,                  lastModified: now, changeFrequency: 'yearly',  priority: 0.5 },
    { url: `${SITE.url}/contact`,                lastModified: now, changeFrequency: 'yearly',  priority: 0.5 },
    { url: `${SITE.url}/blog`,                   lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${SITE.url}/privacy-policy`,         lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${SITE.url}/terms`,                  lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
  ];

  const blogRoutes: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${SITE.url}/blog/${p.slug}`,
    lastModified: new Date(p.date),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...staticRoutes, ...blogRoutes];
}
