import type { Metadata } from 'next';
import Link from 'next/link';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import JsonLd from '../components/JsonLd';
import { SITE } from '../lib/seo';

export const metadata: Metadata = {
  title: 'Features — Custom Turnitin Report Generator',
  description:
    'Explore every feature of the best free Turnitin report generator — custom AI and similarity percentages, instant PDF downloads, authentic layout, and 100% privacy.',
  keywords: [
    'turnitin report generator features',
    'custom turnitin report features',
    'ai detection report generator',
    'similarity report generator',
  ],
  alternates: { canonical: '/features' },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE.url },
    { '@type': 'ListItem', position: 2, name: 'Features', item: `${SITE.url}/features` },
  ],
};

const features = [
  { icon: '⚡', title: 'Lightning-fast generation', desc: 'Both AI and similarity reports produced in under 10 seconds — fully client-side, no waiting.' },
  { icon: '🎯', title: 'Custom percentages', desc: 'Set any AI detection percentage and similarity percentage between 0% and 100%.' },
  { icon: '🆓', title: '100% free, unlimited', desc: 'No paywalls, no daily limits, no credit card required. Generate as many reports as you like.' },
  { icon: '🔒', title: 'Privacy first', desc: 'Documents are processed entirely in your browser — never uploaded to any server.' },
  { icon: '📄', title: 'Authentic PDF layout', desc: 'Color-coded highlights, originality scores, metadata, page counts, and footer match the genuine Turnitin format.' },
  { icon: '📥', title: 'Dual report download', desc: 'Get both an AI Detection Report and a Similarity Report as separate, ready-to-share PDFs.' },
  { icon: '🧠', title: 'Realistic AI flagging', desc: 'AI sentences are intelligently chosen to look natural — not random sentences flagged at random.' },
  { icon: '🎨', title: 'Beautiful modern UI', desc: 'A clean, fast interface that works on desktop, tablet, and mobile.' },
  { icon: '🌐', title: 'No signup required', desc: 'Open the page and start generating. No accounts, no email collection, ever.' },
];

export default function FeaturesPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <SiteHeader />

      <section className="page-header">
        <div className="container">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link> <span>/</span> <span>Features</span>
          </nav>
          <h1 className="section-title">
            Every feature of the <span className="grad">Turnitin Report Generator</span>
          </h1>
          <p className="section-subtitle" style={{ margin: '0.75rem auto 0' }}>
            Built for students, freelance writers, educators, and content teams who need fast, authentic, and customizable Turnitin reports.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="features-grid">
            {features.map((f, i) => (
              <article key={i} className="feature-card">
                <div className="feature-icon" style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)', fontSize: '1.6rem', boxShadow: 'none' }}>
                  <span aria-hidden="true">{f.icon}</span>
                </div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="cta-banner">
            <h2>Try every feature for free</h2>
            <p>No signup. No payment. Generate a custom Turnitin report now.</p>
            <Link href="/#generator" className="btn-primary">Generate Free Report</Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
