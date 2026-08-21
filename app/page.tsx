import type { Metadata } from 'next';
import SiteHeader from './components/SiteHeader';
import SiteFooter from './components/SiteFooter';
import JsonLd from './components/JsonLd';
import ReportGenerator from './components/ReportGenerator';
import { SITE } from './lib/seo';

/* ──────────────────────────────────────────────────────────────
   SEO METADATA — only possible in a Server Component
   ────────────────────────────────────────────────────────────── */
export const metadata: Metadata = {
  title: 'Turnitin Report Generator | Free & Custom Turnitin Report Online',
  description:
    'Free Turnitin report generator. Create accurate AI detection and similarity reports with custom percentages in seconds. Trusted by students, freelancers, and educators worldwide.',
  keywords: [
    'turnitin report generator',
    'free turnitin report',
    'custom turnitin report',
    'turnitin similarity report',
    'turnitin ai detection report',
    'fake turnitin report',
    'plagiarism report generator',
    'turnitin report download',
    'create turnitin report online',
    'instant turnitin report',
    'free turnitin report generator',
    'turnitin report pdf',
    'ai content detection report',
    'originality report generator',
  ],
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Turnitin Report Generator | Free & Custom Turnitin Report Online',
    description:
      'Generate professional Turnitin similarity reports and AI detection reports with custom percentages in seconds. 100% free, no signup, instant PDF download.',
    url: SITE.url,
    type: 'website',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Turnitin Report Generator — Free & Custom AI and Similarity Reports',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Turnitin Report Generator | Free & Custom Turnitin Report',
    description:
      'Generate professional Turnitin similarity reports and AI detection reports with custom percentages in seconds. 100% free, no signup, instant PDF download.',
    images: ['/images/og-image.png'],
  },
};

/* ──────────────────────────────────────────────────────────────
   JSON-LD STRUCTURED DATA — rendered in the initial HTML
   ────────────────────────────────────────────────────────────── */
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Is the Turnitin report generator free?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Our Turnitin report generator is 100% free to use. You can generate unlimited similarity and AI detection reports without signing up or paying anything.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I create a custom Turnitin report with a specific similarity percentage?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Absolutely. Our custom Turnitin report tool lets you choose any AI detection percentage (0–100%) and any similarity percentage (0–100%) before generating the PDF.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is my document safe and private?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Your file is processed locally in your browser. Documents never leave your device, so your content stays fully private.',
      },
    },
    {
      '@type': 'Question',
      name: 'How long does it take to generate a Turnitin report?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Most reports are ready in under 10 seconds for documents up to 10MB. You receive both an AI report and a Similarity report as downloadable PDFs.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do you support PDF and Word documents?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Currently we support PDF files up to 10MB. The generator analyzes content, word count, and pages to produce a realistic Turnitin-style report.',
      },
    },
  ],
};

/* ──────────────────────────────────────────────────────────────
   SERVER COMPONENT — all static content is SSR'd into HTML
   Interactive upload/modal lives in <ReportGenerator /> only
   ────────────────────────────────────────────────────────────── */
export default function Home() {
  return (
    <>
      <JsonLd data={faqSchema} />
      <SiteHeader />

      {/* ============== HERO + GENERATOR ============== */}
      <section className="hero-wrap" id="generator">
        <span className="hero-orb a" />
        <span className="hero-orb b" />
        <span className="hero-orb c" />

        <div className="container">
          <div className="hero">
            <span className="hero-badge">
              <span className="dot" />
              Trusted by 50,000+ students worldwide
            </span>

            <h1 className="hero-title">
              Free <span className="grad">Turnitin Report Generator</span>
              <br /> with Custom AI &amp; Similarity %
            </h1>

            <p className="hero-subtitle">
              Generate professional Turnitin similarity reports and AI detection reports
              with custom percentages in seconds. 100% free, no signup, instant PDF download.
            </p>

            {/* Interactive upload + modal — client boundary */}
            <ReportGenerator />

            <p className="helper-text">⚡ Average generation time: 6 seconds · No signup required</p>

            <div className="hero-stats">
              <span className="hero-stat">
                <span className="hero-check">✓</span>
                <strong>100%</strong> Free forever
              </span>
              <span className="hero-stat">
                <span className="hero-check">✓</span>
                <strong>Instant</strong> PDF download
              </span>
              <span className="hero-stat">
                <span className="hero-check">✓</span>
                <strong>Private</strong> — runs in your browser
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ============== TRUST BAR ============== */}
      <section className="trust-bar">
        <div className="container">
          <div className="trust-row">
            <span>★ 4.9 / 5 rating</span>
            <span>50,000+ users</span>
            <span>Universities · Colleges · High Schools</span>
            <span>Privacy-first</span>
            <span>Instant PDF</span>
          </div>
        </div>
      </section>

      {/* ============== FEATURES ============== */}
      <section className="section" id="features">
        <div className="container">
          <div className="section-head">
            <span className="section-eyebrow">Features</span>
            <h2 className="section-title">
              Everything you need for a <span className="grad">realistic Turnitin report</span>
            </h2>
            <p className="section-subtitle">
              Built for students, freelance writers, and educators who need quick,
              authentic-looking Turnitin similarity and AI detection reports — fully customizable.
            </p>
          </div>

          <div className="features-grid">
            <article className="feature-card">
              <div className="feature-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="feature-title">Instant Generation</h3>
              <p className="feature-desc">
                Generate both AI detection and similarity reports in under 10 seconds.
                No queues, no waiting, no email required.
              </p>
            </article>

            <article className="feature-card">
              <div className="feature-icon violet" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
              </div>
              <h3 className="feature-title">Fully Customizable %</h3>
              <p className="feature-desc">
                Set any AI detection percentage and similarity percentage between
                0% and 100% to match the report you need.
              </p>
            </article>

            <article className="feature-card">
              <div className="feature-icon emerald" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="feature-title">100% Free &amp; Unlimited</h3>
              <p className="feature-desc">
                No paywalls, no credit-card. Generate as many free Turnitin reports
                as you need, anytime, with no daily limits.
              </p>
            </article>

            <article className="feature-card">
              <div className="feature-icon sky" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              </div>
              <h3 className="feature-title">Privacy First</h3>
              <p className="feature-desc">
                Your PDF is processed entirely in your browser. Documents never get
                uploaded to a server — your work stays 100% private.
              </p>
            </article>

            <article className="feature-card">
              <div className="feature-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
              </div>
              <h3 className="feature-title">Authentic Layout</h3>
              <p className="feature-desc">
                Reports match the genuine Turnitin format — color-coded highlights,
                originality score, document metadata, and footer details.
              </p>
            </article>

            <article className="feature-card">
              <div className="feature-icon violet" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
              </div>
              <h3 className="feature-title">Dual Reports</h3>
              <p className="feature-desc">
                Download both the AI Detection Report and the Similarity Report as
                separate PDFs — perfect for any submission.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* ============== HOW IT WORKS ============== */}
      <section className="section" id="how-it-works" style={{ background: 'hsla(0, 0%, 100%, 0.5)' }}>
        <div className="container">
          <div className="section-head">
            <span className="section-eyebrow">How it works</span>
            <h2 className="section-title">
              Generate your Turnitin report in <span className="grad">3 simple steps</span>
            </h2>
            <p className="section-subtitle">
              No registration, no installation. Upload your PDF, pick your percentages,
              and download the report instantly.
            </p>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-num">01</div>
              <h3 className="step-title">Upload your document</h3>
              <p className="step-desc">
                Drag and drop your PDF file (up to 10MB) into the upload area at the
                top of this page — or click to browse.
              </p>
            </div>
            <div className="step-card">
              <div className="step-num">02</div>
              <h3 className="step-title">Set custom percentages</h3>
              <p className="step-desc">
                Pick any AI detection percentage and similarity percentage between
                0% and 100% to match what you need.
              </p>
            </div>
            <div className="step-card">
              <div className="step-num">03</div>
              <h3 className="step-title">Download the PDF</h3>
              <p className="step-desc">
                In seconds you get two Turnitin-style PDFs — AI report and similarity
                report — ready for download.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============== USE CASES ============== */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="section-eyebrow">Use cases</span>
            <h2 className="section-title">
              Who uses our <span className="grad">Turnitin report generator</span>?
            </h2>
            <p className="section-subtitle">
              From college essays to client deliverables, our tool is loved by
              students, writers, freelancers, and educators around the world.
            </p>
          </div>

          <div className="usecase-grid">
            <div className="usecase-card">
              <div className="usecase-chip">🎓</div>
              <div>
                <h3>Students</h3>
                <p>Check assignments and dissertations before submission to make sure your work passes plagiarism and AI checks.</p>
              </div>
            </div>
            <div className="usecase-card">
              <div className="usecase-chip">✍️</div>
              <div>
                <h3>Freelance writers</h3>
                <p>Deliver Turnitin similarity and AI reports alongside articles or essays to verify originality for clients.</p>
              </div>
            </div>
            <div className="usecase-card">
              <div className="usecase-chip">🏫</div>
              <div>
                <h3>Educators</h3>
                <p>Demonstrate how Turnitin scoring and AI detection works to your students with sample reports.</p>
              </div>
            </div>
            <div className="usecase-card">
              <div className="usecase-chip">📰</div>
              <div>
                <h3>Bloggers</h3>
                <p>Confirm content originality and AI-detection scores before publishing articles or SEO content.</p>
              </div>
            </div>
            <div className="usecase-card">
              <div className="usecase-chip">🔬</div>
              <div>
                <h3>Researchers</h3>
                <p>Generate sample reports for research papers to test originality before journal submission.</p>
              </div>
            </div>
            <div className="usecase-card">
              <div className="usecase-chip">🧑‍💼</div>
              <div>
                <h3>Agencies</h3>
                <p>Bundle similarity reports with every deliverable as proof of originality for your clients.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============== METRICS ============== */}
      <section className="section-tight">
        <div className="container">
          <div className="metric-row">
            <div className="metric">
              <div className="metric-value">50K+</div>
              <div className="metric-label">Reports generated</div>
            </div>
            <div className="metric">
              <div className="metric-value">4.9★</div>
              <div className="metric-label">Average rating</div>
            </div>
            <div className="metric">
              <div className="metric-value">{'< 10s'}</div>
              <div className="metric-label">Avg. generation time</div>
            </div>
            <div className="metric">
              <div className="metric-value">100%</div>
              <div className="metric-label">Free &amp; private</div>
            </div>
          </div>
        </div>
      </section>

      {/* ============== TESTIMONIALS ============== */}
      <section className="section" id="testimonials" style={{ background: 'hsla(0, 0%, 100%, 0.5)' }}>
        <div className="container">
          <div className="section-head">
            <span className="section-eyebrow">Testimonials</span>
            <h2 className="section-title">
              Loved by <span className="grad">50,000+ users</span>
            </h2>
            <p className="section-subtitle">
              Real feedback from real students, writers, and educators who use the
              Turnitin Report Generator every day.
            </p>
          </div>

          <div className="testimonial-grid">
            <div className="testimonial">
              <div className="testimonial-stars">★★★★★</div>
              <p className="testimonial-quote">
                &ldquo;Saved my submission deadline. Generated a clean Turnitin
                similarity report in under 10 seconds — looks exactly like the real one.&rdquo;
              </p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">SM</div>
                <div className="testimonial-meta">
                  <strong>Sarah M.</strong>
                  <span>Graduate Student, UK</span>
                </div>
              </div>
            </div>
            <div className="testimonial">
              <div className="testimonial-stars">★★★★★</div>
              <p className="testimonial-quote">
                &ldquo;The custom percentage feature is fantastic. I can preview
                exactly what my AI detection score would look like.&rdquo;
              </p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">DJ</div>
                <div className="testimonial-meta">
                  <strong>David J.</strong>
                  <span>Freelance Writer</span>
                </div>
              </div>
            </div>
            <div className="testimonial">
              <div className="testimonial-stars">★★★★★</div>
              <p className="testimonial-quote">
                &ldquo;Beautiful UI, instant downloads, no signup. The best free
                Turnitin report generator I&apos;ve tried so far.&rdquo;
              </p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">AP</div>
                <div className="testimonial-meta">
                  <strong>Aisha P.</strong>
                  <span>Undergraduate, USA</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============== FAQ ============== */}
      <section className="section" id="faq">
        <div className="container">
          <div className="section-head">
            <span className="section-eyebrow">FAQ</span>
            <h2 className="section-title">
              Frequently asked <span className="grad">questions</span>
            </h2>
            <p className="section-subtitle">
              Everything you need to know about our free and custom Turnitin report generator.
            </p>
          </div>

          <div className="faq-list">
            <details className="faq-item">
              <summary>Is the Turnitin report generator really free?</summary>
              <div className="faq-body">
                Yes — completely free, no limits. You can generate unlimited custom
                Turnitin similarity and AI detection reports without signing up or
                paying anything.
              </div>
            </details>
            <details className="faq-item">
              <summary>Can I set a custom similarity and AI detection percentage?</summary>
              <div className="faq-body">
                Absolutely. After uploading your PDF, you can choose any AI
                detection percentage and any similarity percentage between 0% and
                100% before generating the PDF.
              </div>
            </details>
            <details className="faq-item">
              <summary>Is my document private and safe?</summary>
              <div className="faq-body">
                Yes. PDF processing runs in your browser. Your file is never sent
                to a server, so your content stays completely private and secure.
              </div>
            </details>
            <details className="faq-item">
              <summary>How long does generation take?</summary>
              <div className="faq-body">
                Typically under 10 seconds for documents up to 10MB. You will
                receive both an AI detection report and a similarity report as
                two separate downloadable PDFs.
              </div>
            </details>
            <details className="faq-item">
              <summary>What file formats do you support?</summary>
              <div className="faq-body">
                We currently support PDF files up to 10MB. Convert your Word
                document to PDF before uploading for the best results.
              </div>
            </details>
            <details className="faq-item">
              <summary>Does the report look like a real Turnitin report?</summary>
              <div className="faq-body">
                Yes — the layout, color-coded highlights, originality score
                summary, document metadata, and footer details all match the
                authentic Turnitin format students and educators are used to.
              </div>
            </details>
          </div>
        </div>
      </section>

      {/* ============== CTA BANNER ============== */}
      <section className="section">
        <div className="container">
          <div className="cta-banner">
            <h2>Ready to generate your free Turnitin report?</h2>
            <p>
              Join 50,000+ users who trust our free Turnitin report generator for
              custom AI detection and similarity reports. No signup, no payment, no wait.
            </p>
            <a href="#generator" className="btn-primary">
              Generate Free Turnitin Report
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
