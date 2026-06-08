import type { Metadata } from 'next';
import Link from 'next/link';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import JsonLd from '../components/JsonLd';
import { SITE } from '../lib/seo';

export const metadata: Metadata = {
  title: 'Free Turnitin Report — Generate Unlimited Reports Online',
  description:
    'Free Turnitin report generator with no signup, no payment, no limits. Generate authentic AI detection and similarity report PDFs online in seconds — 100% free forever.',
  keywords: [
    'free turnitin report',
    'free turnitin report generator',
    'free turnitin similarity report',
    'free ai detection report',
    'free turnitin report online',
    'turnitin report free download',
    'unlimited free turnitin report',
  ],
  alternates: { canonical: '/free-turnitin-report' },
  openGraph: {
    title: 'Free Turnitin Report Generator — No Signup, Unlimited',
    description:
      'Generate authentic Turnitin similarity and AI detection reports online for free.',
    url: `${SITE.url}/free-turnitin-report`,
    type: 'article',
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE.url },
    { '@type': 'ListItem', position: 2, name: 'Free Turnitin Report', item: `${SITE.url}/free-turnitin-report` },
  ],
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Is the Turnitin report really free?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes — 100% free, with no limits, no signup, and no credit card required. You can generate unlimited Turnitin similarity and AI detection reports.',
      },
    },
    {
      '@type': 'Question',
      name: 'Are there any hidden fees?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. The tool is fully free with no hidden fees, no premium tiers, and no paywalls. Every feature is unlocked for everyone.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do I need an account?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. Just upload a PDF and generate. No email, no account, no signup at any step.',
      },
    },
  ],
};

export default function FreeTurnitinReportPage() {
  return (
    <>
      <JsonLd data={[breadcrumbSchema, faqSchema]} />
      <SiteHeader />

      <section className="page-header">
        <div className="container">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link> <span>/</span> <span>Free Turnitin Report</span>
          </nav>
          <h1 className="section-title">
            Free <span className="grad">Turnitin Report</span> Generator
          </h1>
          <p className="section-subtitle" style={{ margin: '0.75rem auto 0' }}>
            Generate unlimited Turnitin similarity and AI detection reports online — 100% free, no signup, instant PDF download.
          </p>
          <div style={{ marginTop: '1.5rem' }}>
            <Link href="/#generator" className="btn-primary">Generate Free Report Now</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <article className="prose">
            <h2>What is a free Turnitin report?</h2>
            <p>
              A <strong>free Turnitin report</strong> is a downloadable PDF that
              mimics the layout, scoring, and metadata of a genuine Turnitin
              similarity or AI detection report — produced at no cost, with no
              account required. Our generator is the fastest free Turnitin report
              tool online: every feature is unlocked, every report is unlimited.
            </p>

            <h2>Why use our free Turnitin report generator?</h2>
            <ul>
              <li><strong>100% free forever</strong> — no paywalls, no credit card, no email.</li>
              <li><strong>Unlimited reports</strong> — no daily caps or watermarks.</li>
              <li><strong>Custom percentages</strong> — choose any AI and similarity score.</li>
              <li><strong>Instant PDF download</strong> — both reports ready in under 10 seconds.</li>
              <li><strong>Privacy first</strong> — your PDF never leaves your browser.</li>
              <li><strong>Authentic layout</strong> — matches the real Turnitin format.</li>
            </ul>

            <h2>Who is the free Turnitin report for?</h2>
            <p>
              Our free Turnitin report generator is used by students checking
              essays before submission, freelance writers proving originality to
              clients, educators demonstrating how Turnitin scoring works, and
              bloggers verifying AI-detection results before publishing.
            </p>

            <h2>How do I get my free report?</h2>
            <p>
              Go to the <Link href="/">home page</Link>, drop in a PDF up to
              10MB, choose your custom AI and similarity percentages, and click
              <strong> Generate Report</strong>. You will receive two free PDFs
              — an AI Detection Report and a Similarity Report — instantly.
            </p>

            <h2>Free vs. paid Turnitin reports</h2>
            <p>
              Paid Turnitin access requires institutional credentials, costs
              hundreds of dollars per year, and limits you to documents you
              actually submit. Our free Turnitin report generator removes all
              these barriers — anyone can generate a Turnitin-style report,
              instantly, for free.
            </p>

            <h2>Common search terms we cover</h2>
            <p>
              free turnitin report, free turnitin report generator, turnitin
              report free download, free turnitin similarity report, free ai
              detection report, turnitin report online free, no signup turnitin
              report, free turnitin pdf, free originality report generator.
            </p>

            <h2>Try the free Turnitin report generator</h2>
            <p>
              Click below to generate your first free Turnitin report right now.
              You can also see all <Link href="/features">features</Link>, learn
              how it <Link href="/how-it-works">works</Link>, or read our{' '}
              <Link href="/blog/free-turnitin-report-guide">complete free
              report guide</Link>.
            </p>
          </article>

          <div className="cta-banner" style={{ marginTop: '3rem' }}>
            <h2>Your free Turnitin report is one click away</h2>
            <p>Drag, drop, and download. No signup. No payment. No limits.</p>
            <Link href="/#generator" className="btn-primary">Generate Free Report Now</Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
