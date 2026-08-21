import type { MetadataRoute } from 'next';
import { SITE } from './lib/seo';
import { posts } from './blog/posts';

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUpdated = new Date(); // auto-updates on each build/deploy

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE.url}/`,                       lastModified: siteUpdated, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${SITE.url}/how-it-works`,           lastModified: siteUpdated, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE.url}/features`,               lastModified: siteUpdated, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE.url}/free-turnitin-report`,   lastModified: siteUpdated, changeFrequency: 'weekly',  priority: 0.95 },
    { url: `${SITE.url}/custom-turnitin-report`, lastModified: siteUpdated, changeFrequency: 'weekly',  priority: 0.95 },
    { url: `${SITE.url}/faq`,                    lastModified: siteUpdated, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE.url}/about`,                  lastModified: siteUpdated, changeFrequency: 'yearly',  priority: 0.5 },
    { url: `${SITE.url}/contact`,                lastModified: siteUpdated, changeFrequency: 'yearly',  priority: 0.5 },
    { url: `${SITE.url}/blog`,                   lastModified: siteUpdated, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${SITE.url}/privacy-policy`,         lastModified: siteUpdated, changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${SITE.url}/terms`,                  lastModified: siteUpdated, changeFrequency: 'yearly',  priority: 0.3 },
  ];

  const blogRoutes: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${SITE.url}/blog/${p.slug}`,
    lastModified: new Date(p.date),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...staticRoutes, ...blogRoutes];
}
