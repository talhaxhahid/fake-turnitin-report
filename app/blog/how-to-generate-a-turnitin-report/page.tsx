import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import SiteHeader from '../../components/SiteHeader';
import SiteFooter from '../../components/SiteFooter';
import JsonLd from '../../components/JsonLd';
import { SITE } from '../../lib/seo';
import { posts } from '../posts';

const post = posts.find((p) => p.slug === 'how-to-generate-a-turnitin-report')!;

export const metadata: Metadata = {
  title: post.title,
  description: post.description,
  keywords: post.keywords,
  alternates: { canonical: `/blog/${post.slug}` },
  openGraph: {
    title: post.title,
    description: post.description,
    type: 'article',
    publishedTime: post.date,
    url: `${SITE.url}/blog/${post.slug}`,
    images: [
      {
        url: '/images/blog/generate-report-hero.jpg',
        width: 1200,
        height: 675,
        alt: 'How to Generate a Turnitin Report Online (Free Method)',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: post.title,
    description: post.description,
    images: ['/images/blog/generate-report-hero.jpg'],
  },
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: post.title,
  description: post.description,
  author: { '@type': 'Organization', name: SITE.name },
  publisher: { '@id': `${SITE.url}#organization` },
  mainEntityOfPage: `${SITE.url}/blog/${post.slug}`,
  datePublished: post.date,
  dateModified: post.date,
  keywords: post.keywords.join(', '),
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE.url },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE.url}/blog` },
    { '@type': 'ListItem', position: 3, name: post.title, item: `${SITE.url}/blog/${post.slug}` },
  ],
};

export default function Post() {
  return (
    <>
      <JsonLd data={[articleSchema, breadcrumbSchema]} />
      <SiteHeader />

      <section className="page-header">
        <div className="container">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link> <span>/</span>{' '}
            <Link href="/blog">Blog</Link> <span>/</span>{' '}
            <span>Generate a Turnitin Report</span>
          </nav>
          <h1 className="section-title">{post.title}</h1>
          <p className="section-subtitle" style={{ margin: '0.75rem auto 0' }}>
            {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} · {post.readTime}
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <article className="prose">
            <div className="prose-img-wrapper">
              <Image
                src="/images/blog/generate-report-hero.jpg"
                alt="Turnitin online PDF generation flow"
                width={1200}
                height={675}
                priority
                className="prose-img"
              />
            </div>
            <p>
              If you&apos;ve ever needed a Turnitin similarity or AI detection
              report fast — for an essay you want to preview, a freelance
              deliverable, or a classroom demonstration — generating one online
              is now easier than ever. In this guide we&apos;ll walk through the
              exact 3-step process you can use with our{' '}
              <Link href="/">free Turnitin report generator</Link> to get a
              clean, authentic PDF in under 10 seconds.
            </p>

            <h2>Step 1: Open the generator and upload your PDF</h2>
            <p>
              Head to the home page and you&apos;ll see the upload zone right at
              the top. Drag and drop your PDF file (up to 10MB), or click to
              browse. There is no signup, no email collection, no payment —
              just upload and go.
            </p>
            <blockquote>
              Tip: convert Word documents to PDF first for the cleanest results.
              Most word processors offer &ldquo;Export as PDF&rdquo; under the
              File menu.
            </blockquote>

            <h2>Step 2: Pick your custom AI and similarity percentages</h2>
            <p>
              Once your PDF finishes uploading, a configuration modal opens. You
              get two options:
            </p>
            <ul>
              <li>
                <strong>AI Report Percentage</strong> — choose 0%, a random
                value, or any preset between 30% and 100%. The generator
                intelligently flags AI-likely sentences in your document to
                produce the target score.
              </li>
              <li>
                <strong>Similarity Report Percentage</strong> — enter any number
                between 0 and 100. The generator color-codes matching passages
                throughout your PDF to match the overall similarity percentage
                you picked.
              </li>
            </ul>
            <p>
              Read our deep-dive on{' '}
              <Link href="/blog/custom-turnitin-report-explained">
                what custom percentages actually mean
              </Link>{' '}
              for tips on picking the right number for your situation.
            </p>

            <h2>Step 3: Download your two Turnitin-style PDFs</h2>
            <p>
              Click <strong>Generate Report</strong> and watch the progress bar
              fly. In under 10 seconds you&apos;ll receive two PDFs:
            </p>
            <ul>
              <li>
                <strong>AI Detection Report</strong> — Turnitin-style cover
                page, AI percentage score, and your document with AI-flagged
                sentences highlighted in the authentic Turnitin format.
              </li>
              <li>
                <strong>Similarity Report</strong> — color-coded similarity
                highlights, overall percentage, originality score, sources
                summary, and document metadata.
              </li>
            </ul>

            <h2>Why this method works so well</h2>
            <p>
              Most online Turnitin generators are slow, ad-heavy, or paywall
              their best features. Our generator is{' '}
              <Link href="/free-turnitin-report">100% free</Link>, fully
              customizable, instant, and processes everything in your browser —
              so your document never leaves your device.
            </p>

            <h2>Common questions</h2>
            <h3>Is it really free?</h3>
            <p>Yes. Unlimited reports, no signup, no payment. Ever.</p>

            <h3>Does the PDF look like a real Turnitin report?</h3>
            <p>
              Yes. Cover pages, scoring summary, color-coded highlights,
              document metadata, page count, file size, and footer details all
              match the genuine Turnitin layout.
            </p>

            <h3>Will my document leak online?</h3>
            <p>
              No. Your PDF is processed client-side; we never see, store, or
              transmit it. Read{' '}
              <Link href="/privacy-policy">our privacy policy</Link> for details.
            </p>

            <h2>Ready to generate yours?</h2>
            <p>
              Open the <Link href="/">free Turnitin report generator</Link> and
              get your first PDF in seconds. Or learn more about our{' '}
              <Link href="/features">features</Link>.
            </p>
          </article>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
