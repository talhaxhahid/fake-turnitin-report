import type { Metadata } from 'next';
import Link from 'next/link';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import JsonLd from '../components/JsonLd';
import { SITE } from '../lib/seo';

export const metadata: Metadata = {
  title: 'Terms of Service — Turnitin Report Generator',
  description:
    'The terms and conditions for using the Turnitin Report Generator. Acceptable use, disclaimers, and limitations.',
  alternates: { canonical: '/terms' },
  robots: { index: true, follow: true },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE.url },
    { '@type': 'ListItem', position: 2, name: 'Terms of Service', item: `${SITE.url}/terms` },
  ],
};

export default function TermsPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <SiteHeader />

      <section className="page-header">
        <div className="container">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link> <span>/</span> <span>Terms of Service</span>
          </nav>
          <h1 className="section-title">Terms of <span className="grad">Service</span></h1>
          <p className="section-subtitle" style={{ margin: '0.75rem auto 0' }}>
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <article className="prose">
            <h2>1. Acceptance</h2>
            <p>
              By accessing the Turnitin Report Generator (the &ldquo;Service&rdquo;), you agree to these
              Terms of Service. If you do not agree, please do not use the Service.
            </p>

            <h2>2. Description of the Service</h2>
            <p>
              The Service generates Turnitin-style similarity and AI detection report PDFs for
              documents you upload. All processing happens locally in your browser.
            </p>

            <h2>3. Acceptable use</h2>
            <p>
              The Service is intended for legitimate purposes such as previewing originality scores,
              educational demonstration, freelance deliverables, content review, and research. You agree
              <strong> not</strong> to use the Service:
            </p>
            <ul>
              <li>To submit reports under false pretenses as if they were issued by Turnitin LLC.</li>
              <li>To misrepresent originality to academic institutions in violation of their policies.</li>
              <li>To process content you do not have the right to use.</li>
              <li>To attempt to overload, hack, or reverse-engineer the Service.</li>
            </ul>

            <h2>4. No affiliation with Turnitin LLC</h2>
            <p>
              This Service is independent and is not affiliated with, endorsed by, or sponsored by
              Turnitin LLC. &ldquo;Turnitin&rdquo; is referenced for descriptive purposes only.
            </p>

            <h2>5. Privacy</h2>
            <p>
              See our <Link href="/privacy-policy">Privacy Policy</Link> for details on how
              documents are handled (spoiler: they never leave your browser).
            </p>

            <h2>6. Disclaimer</h2>
            <p>
              The Service is provided &ldquo;as is&rdquo; without warranties of any kind. We are not
              liable for any decisions made on the basis of generated reports.
            </p>

            <h2>7. Changes</h2>
            <p>
              We may update these terms from time to time. Material changes will be reflected with
              an updated date at the top of this page.
            </p>

            <h2>8. Contact</h2>
            <p>
              Questions about these terms? <Link href="/contact">Contact us</Link> any time.
            </p>
          </article>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
