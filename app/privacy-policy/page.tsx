import type { Metadata } from 'next';
import Link from 'next/link';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import JsonLd from '../components/JsonLd';
import { SITE } from '../lib/seo';

export const metadata: Metadata = {
  title: 'Privacy Policy — Turnitin Report Generator',
  description:
    'How the Turnitin Report Generator handles your data. We never store, transmit, or share your documents — everything runs client-side in your browser.',
  alternates: { canonical: '/privacy-policy' },
  robots: { index: true, follow: true },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE.url },
    { '@type': 'ListItem', position: 2, name: 'Privacy Policy', item: `${SITE.url}/privacy-policy` },
  ],
};

export default function PrivacyPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <SiteHeader />

      <section className="page-header">
        <div className="container">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link> <span>/</span> <span>Privacy Policy</span>
          </nav>
          <h1 className="section-title">Privacy <span className="grad">Policy</span></h1>
          <p className="section-subtitle" style={{ margin: '0.75rem auto 0' }}>
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <article className="prose">
            <h2>Summary</h2>
            <p>
              <strong>Turnitin Report Generator does not collect, store, or transmit your documents.</strong>{' '}
              Every PDF you upload is processed entirely in your own web browser, then discarded the
              moment you close or reload the page.
            </p>

            <h2>What we collect</h2>
            <p>We only process the bare minimum required to deliver the service:</p>
            <ul>
              <li><strong>Documents you upload</strong> — never sent to our servers; processed client-side only.</li>
              <li><strong>Anonymous usage statistics</strong> — page views, country, and browser type via privacy-respecting analytics.</li>
              <li><strong>Contact form submissions</strong> — only if you choose to send us a message.</li>
            </ul>

            <h2>What we don&apos;t collect</h2>
            <ul>
              <li>Your name or email address (unless you contact us).</li>
              <li>The contents of your PDF.</li>
              <li>The percentages you choose.</li>
              <li>The reports you generate.</li>
            </ul>

            <h2>Cookies</h2>
            <p>
              We use only essential cookies needed for the site to function. We do not use
              advertising cookies or track you across other websites.
            </p>

            <h2>Third-party services</h2>
            <p>
              We may use privacy-respecting analytics (e.g., Plausible) and a CDN to deliver
              the website quickly. Neither of these services receives the contents of your PDF.
            </p>

            <h2>Your rights</h2>
            <p>
              Because we don&apos;t store personal data, there is nothing to request, export, or
              delete. If you do contact us and want your message deleted, just email{' '}
              <a href={`mailto:${SITE.email}`}>{SITE.email}</a> and we&apos;ll remove it.
            </p>

            <h2>Children</h2>
            <p>
              Our service is general-purpose and not directed at children under 13.
              If you believe a child has provided us personal information, contact us so we can remove it.
            </p>

            <h2>Changes to this policy</h2>
            <p>
              We may update this policy occasionally. The &ldquo;Last updated&rdquo; date at the top
              reflects the most recent change.
            </p>

            <h2>Contact</h2>
            <p>
              Questions? Reach out via the <Link href="/contact">contact page</Link> or email{' '}
              <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
            </p>
          </article>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
