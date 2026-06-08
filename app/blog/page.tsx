import type { Metadata } from 'next';
import Link from 'next/link';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import JsonLd from '../components/JsonLd';
import { SITE } from '../lib/seo';
import { posts } from './posts';

export const metadata: Metadata = {
  title: 'Blog — Turnitin Report Generator Guides & Tips',
  description:
    'Guides, tips, and explainers on Turnitin reports, AI detection, similarity scoring, and how to generate the perfect report for your needs.',
  keywords: ['turnitin report blog', 'turnitin guide', 'ai detection blog', 'similarity report blog'],
  alternates: { canonical: '/blog' },
};

const blogSchema = {
  '@context': 'https://schema.org',
  '@type': 'Blog',
  name: 'Turnitin Report Generator Blog',
  url: `${SITE.url}/blog`,
  description: 'Guides and tips on Turnitin reports, AI detection, and similarity scoring.',
  publisher: { '@id': `${SITE.url}#organization` },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE.url },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE.url}/blog` },
  ],
};

export default function BlogIndexPage() {
  return (
    <>
      <JsonLd data={[blogSchema, breadcrumbSchema]} />
      <SiteHeader />

      <section className="page-header">
        <div className="container">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link> <span>/</span> <span>Blog</span>
          </nav>
          <h1 className="section-title">
            The <span className="grad">Turnitin Report</span> Blog
          </h1>
          <p className="section-subtitle" style={{ margin: '0.75rem auto 0' }}>
            Guides, deep-dives, and tips on Turnitin reports, AI detection, similarity scoring, and how to get the most out of our free generator.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="blog-grid">
            {posts.map((p) => (
              <Link key={p.slug} href={`/blog/${p.slug}`} className="blog-card">
                <span className="tag">{p.tag}</span>
                <h3>{p.title}</h3>
                <p>{p.description}</p>
                <div className="meta">
                  <span>{new Date(p.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                  <span>·</span>
                  <span>{p.readTime}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
