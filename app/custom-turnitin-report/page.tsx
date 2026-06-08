import type { Metadata } from 'next';
import Link from 'next/link';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import JsonLd from '../components/JsonLd';
import { SITE } from '../lib/seo';

export const metadata: Metadata = {
  title: 'Custom Turnitin Report — Pick Your AI & Similarity %',
  description:
    'Create a custom Turnitin report with any AI detection percentage and any similarity percentage. Tailor every report exactly to your needs — free, instant, and private.',
  keywords: [
    'custom turnitin report',
    'custom turnitin report generator',
    'custom similarity percentage turnitin',
    'custom ai detection report',
    'set turnitin percentage',
    'turnitin report with custom percentage',
  ],
  alternates: { canonical: '/custom-turnitin-report' },
  openGraph: {
    title: 'Custom Turnitin Report Generator — Choose Any Percentage',
    description:
      'Customize AI detection and similarity percentages on every Turnitin report. Free, instant, private.',
    url: `${SITE.url}/custom-turnitin-report`,
    type: 'article',
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE.url },
    { '@type': 'ListItem', position: 2, name: 'Custom Turnitin Report', item: `${SITE.url}/custom-turnitin-report` },
  ],
};

export default function CustomTurnitinReportPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <SiteHeader />

      <section className="page-header">
        <div className="container">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link> <span>/</span> <span>Custom Turnitin Report</span>
          </nav>
          <h1 className="section-title">
            Custom <span className="grad">Turnitin Report</span> Generator
          </h1>
          <p className="section-subtitle" style={{ margin: '0.75rem auto 0' }}>
            Pick any AI detection percentage and similarity percentage between 0–100%. Generate the exact Turnitin report you need — instantly.
          </p>
          <div style={{ marginTop: '1.5rem' }}>
            <Link href="/#generator" className="btn-primary">Create Custom Report</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <article className="prose">
            <h2>What is a custom Turnitin report?</h2>
            <p>
              A <strong>custom Turnitin report</strong> is a Turnitin-style PDF
              where you control the AI detection score and similarity score
              displayed on the report. Instead of waiting for a Turnitin
              institutional submission, you can preview what your essay,
              article, or thesis would look like with any score you choose.
            </p>

            <h2>How custom percentages work</h2>
            <p>
              Upload your PDF, open the configuration modal, and you will see
              two settings:
            </p>
            <ul>
              <li>
                <strong>AI Report Percentage</strong> — choose 0%, a random
                value, or any preset between 30% and 100%. The generator
                highlights AI-flagged sentences in your document to match the
                target score.
              </li>
              <li>
                <strong>Similarity Report Percentage</strong> — enter any
                number between 0 and 100. The generator color-codes matching
                passages in your document to produce the chosen overall
                similarity score.
              </li>
            </ul>

            <h2>Why use a custom Turnitin report?</h2>
            <ul>
              <li>Preview your <Link href="/blog/how-to-generate-a-turnitin-report">Turnitin score</Link> before official submission.</li>
              <li>Show clients exactly what their delivered essay scored.</li>
              <li>Demonstrate, in class, how scoring and highlighting work.</li>
              <li>Practice citation and paraphrasing skills with realistic feedback.</li>
              <li>Bundle a similarity report with freelance writing deliverables.</li>
            </ul>

            <h2>Free, instant, and private</h2>
            <p>
              Just like the <Link href="/free-turnitin-report">free Turnitin
              report</Link> generator, the custom version costs nothing, requires
              no signup, and processes your document entirely in your browser.
              Read more in our <Link href="/privacy-policy">privacy policy</Link>.
            </p>

            <h2>Custom Turnitin report use cases</h2>
            <p>
              Students preparing dissertation submissions, freelance writers
              providing originality proof, content agencies delivering reports
              alongside articles, educators teaching about AI detection, and
              researchers verifying journal originality requirements all use
              custom Turnitin reports daily.
            </p>

            <h2>Ready to customize your report?</h2>
            <p>
              Head to the <Link href="/">home page</Link>, drop in your PDF, and
              dial in the exact AI and similarity percentages you want. You can
              also browse <Link href="/features">all features</Link> or learn{' '}
              <Link href="/how-it-works">how it works</Link>.
            </p>
          </article>

          <div className="cta-banner" style={{ marginTop: '3rem' }}>
            <h2>Build the exact Turnitin report you need</h2>
            <p>Any percentage. Any score. Any document. Free and instant.</p>
            <Link href="/#generator" className="btn-primary">Generate Custom Report</Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
