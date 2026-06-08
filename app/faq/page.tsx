import type { Metadata } from 'next';
import Link from 'next/link';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import JsonLd from '../components/JsonLd';
import { SITE } from '../lib/seo';

export const metadata: Metadata = {
  title: 'Turnitin Report Generator FAQ — All Your Questions Answered',
  description:
    'Frequently asked questions about our free and custom Turnitin report generator — privacy, pricing, supported formats, AI detection, similarity, downloads, and more.',
  keywords: [
    'turnitin report generator faq',
    'turnitin report faq',
    'how does turnitin report generator work',
    'is turnitin report generator safe',
  ],
  alternates: { canonical: '/faq' },
};

const faqItems = [
  ['Is the Turnitin report generator really free?', 'Yes — 100% free. No signup, no email, no credit card. Unlimited Turnitin similarity and AI detection reports for everyone.'],
  ['Can I set a custom AI detection or similarity percentage?', 'Yes. After uploading your PDF, choose any AI percentage (0–100%) and any similarity percentage (0–100%) before generating the report.'],
  ['Is my document private and safe?', 'Yes. PDF processing runs in your browser using pdf-lib and pdfjs-dist. Files are never sent to a server, so your content stays completely private.'],
  ['How long does generation take?', 'Most reports finish in under 10 seconds for documents up to 10MB. You receive two separate PDFs — an AI Detection Report and a Similarity Report.'],
  ['What file formats do you support?', 'PDF files up to 10MB. Convert Word documents to PDF first for the best results.'],
  ['Does the report look like a real Turnitin report?', 'Yes. The layout, color-coded highlights, originality score, document metadata, page totals, and footer match the genuine Turnitin format.'],
  ['Can I use the reports for academic submission?', 'The reports are intended for previewing, educational demonstration, freelance deliverables, and content-team workflows. Always follow your institution’s policies for actual submission.'],
  ['Will my downloads contain watermarks?', 'No. Downloads are clean PDFs with no watermarks at any percentage.'],
  ['Do you store my PDF after I close the tab?', 'No. Because everything runs client-side, your document is gone the moment you leave the page.'],
  ['Can I generate multiple reports?', 'Yes — unlimited reports, no daily caps, no throttling. Generate as many free or custom Turnitin reports as you need.'],
  ['Do you support Word (.docx) files?', 'PDF is the primary supported format. Export your Word document to PDF first for the most accurate results.'],
  ['Will the AI report look authentic?', 'Yes. AI-flagged sentences are intelligently chosen to look natural and contiguous, not randomized — matching how the real AI detector flags text.'],
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqItems.map(([q, a]) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE.url },
    { '@type': 'ListItem', position: 2, name: 'FAQ', item: `${SITE.url}/faq` },
  ],
};

export default function FaqPage() {
  return (
    <>
      <JsonLd data={[faqSchema, breadcrumbSchema]} />
      <SiteHeader />

      <section className="page-header">
        <div className="container">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link> <span>/</span> <span>FAQ</span>
          </nav>
          <h1 className="section-title">
            Turnitin Report Generator <span className="grad">FAQ</span>
          </h1>
          <p className="section-subtitle" style={{ margin: '0.75rem auto 0' }}>
            Everything you might want to know about our free and custom Turnitin report generator.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="faq-list">
            {faqItems.map(([q, a], i) => (
              <details key={i} className="faq-item" {...(i === 0 ? { open: true } : {})}>
                <summary>{q}</summary>
                <div className="faq-body">{a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="cta-banner">
            <h2>Still have a question?</h2>
            <p>Reach out via our contact page and we&apos;ll get back to you.</p>
            <Link href="/contact" className="btn-primary">Contact Us</Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
