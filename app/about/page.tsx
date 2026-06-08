import type { Metadata } from 'next';
import Link from 'next/link';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import JsonLd from '../components/JsonLd';
import { SITE } from '../lib/seo';

export const metadata: Metadata = {
  title: 'About Us — The Story Behind the Turnitin Report Generator',
  description:
    'Learn about the team behind the Turnitin Report Generator — our mission to make Turnitin similarity and AI detection reports free, fast, and accessible to everyone.',
  alternates: { canonical: '/about' },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE.url },
    { '@type': 'ListItem', position: 2, name: 'About', item: `${SITE.url}/about` },
  ],
};

export default function AboutPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <SiteHeader />

      <section className="page-header">
        <div className="container">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link> <span>/</span> <span>About</span>
          </nav>
          <h1 className="section-title">
            About <span className="grad">Turnitin Report Generator</span>
          </h1>
          <p className="section-subtitle" style={{ margin: '0.75rem auto 0' }}>
            Built to make Turnitin similarity and AI detection reports fast, free, and accessible to everyone.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <article className="prose">
            <h2>Our mission</h2>
            <p>
              Turnitin is the gold standard in academic plagiarism and AI
              detection — but institutional access is expensive, restricted, and
              often locked behind credentials students don&apos;t have. We built
              the Turnitin Report Generator to give writers, students, and
              educators a way to instantly preview what their work would look
              like in a Turnitin-style report.
            </p>

            <h2>Why we&apos;re different</h2>
            <ul>
              <li><strong>100% free</strong> — every feature, every report, every download.</li>
              <li><strong>No signup</strong> — open the page and start working.</li>
              <li><strong>Custom percentages</strong> — choose exactly the report you need.</li>
              <li><strong>Client-side processing</strong> — your documents never leave your browser.</li>
              <li><strong>Authentic layout</strong> — matches the real Turnitin format.</li>
            </ul>

            <h2>Who we serve</h2>
            <p>
              Every month, tens of thousands of students, freelance writers,
              educators, bloggers, researchers, and content agencies generate
              Turnitin reports with our tool. From quick essay previews to
              client-ready originality proofs, we handle it all.
            </p>

            <h2>Privacy at the core</h2>
            <p>
              We never store, transmit, or analyze your documents. PDF parsing,
              text extraction, percentage highlighting, and PDF assembly all
              happen in your browser. You can read the full details in our{' '}
              <Link href="/privacy-policy">privacy policy</Link>.
            </p>

            <h2>What&apos;s next</h2>
            <p>
              We&apos;re working on more report types, Word document support,
              additional language packs, and a Chrome extension. Follow our{' '}
              <Link href="/blog">blog</Link> to stay updated.
            </p>
          </article>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
