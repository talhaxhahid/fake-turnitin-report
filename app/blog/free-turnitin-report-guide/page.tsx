import type { Metadata } from 'next';
import Link from 'next/link';
import SiteHeader from '../../components/SiteHeader';
import SiteFooter from '../../components/SiteFooter';
import JsonLd from '../../components/JsonLd';
import { SITE } from '../../lib/seo';
import { posts } from '../posts';

const post = posts.find((p) => p.slug === 'free-turnitin-report-guide')!;

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
            <span>Free Turnitin Report Guide</span>
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
            <p>
              Searching for a <strong>free Turnitin report</strong>? You&apos;re
              in the right place. This complete guide covers everything you need
              to know about generating a Turnitin similarity and AI detection
              report online for free — without signups, paywalls, or hidden
              limits.
            </p>

            <h2>Why a free Turnitin report?</h2>
            <p>
              Official Turnitin access is gated behind institutional accounts.
              Students who want to preview their score, freelance writers who
              want to verify originality before delivery, or content teams
              checking AI-detection percentages don&apos;t have a quick way in.
              A free generator gives everyone that visibility — instantly.
            </p>

            <h2>What you get with our free Turnitin report</h2>
            <ul>
              <li><strong>Unlimited reports</strong> — no caps, no throttling.</li>
              <li><strong>Authentic layout</strong> — matches real Turnitin design.</li>
              <li><strong>Custom percentages</strong> — pick AI % and similarity %.</li>
              <li><strong>Two PDFs per generation</strong> — AI Detection + Similarity.</li>
              <li><strong>Privacy first</strong> — files never leave your browser.</li>
              <li><strong>No signup</strong> — open the page and start generating.</li>
            </ul>

            <h2>How to get a free Turnitin report in 3 steps</h2>
            <ol>
              <li>
                Open the{' '}
                <Link href="/">free Turnitin report generator</Link>.
              </li>
              <li>
                Drag a PDF (up to 10MB) onto the upload area.
              </li>
              <li>
                Pick your AI and similarity percentages, click{' '}
                <strong>Generate Report</strong>, and download two clean PDFs in
                under 10 seconds.
              </li>
            </ol>

            <p>
              That&apos;s it. No email required, no credit card on file, and
              no risk of your work leaking online.
            </p>

            <h2>Free vs. paid Turnitin access compared</h2>
            <p>
              Institutional Turnitin access costs hundreds of dollars per year
              and restricts you to documents your school actually submits. A
              free Turnitin report generator removes those barriers:
            </p>
            <ul>
              <li>Anyone can generate a Turnitin-style report.</li>
              <li>Any document can be used.</li>
              <li>Any percentage can be chosen.</li>
              <li>Any number of reports can be created.</li>
            </ul>

            <h2>Privacy: what makes &ldquo;free&rdquo; safe</h2>
            <p>
              Not every &ldquo;free&rdquo; tool is privacy-safe. Some upload
              your document to a server, store it indefinitely, or feed it into
              an AI training set. Our generator runs entirely client-side using{' '}
              <code>pdf-lib</code>, <code>pdfjs-dist</code>, and{' '}
              <code>react-pdf</code> — your PDF never touches a server. See the{' '}
              <Link href="/privacy-policy">privacy policy</Link> for full
              details.
            </p>

            <h2>Pro tips for the best free Turnitin report</h2>
            <ul>
              <li>Convert Word to PDF first for the cleanest results.</li>
              <li>Keep PDFs under 10MB for fastest generation.</li>
              <li>For realistic AI scores, pick 30–60% for edited AI text.</li>
              <li>For similarity, 10–18% looks natural for most academic work.</li>
              <li>Re-generate as many times as you need — it&apos;s unlimited.</li>
            </ul>

            <h2>Free Turnitin report FAQ</h2>
            <h3>Is it really 100% free?</h3>
            <p>Yes. Unlimited reports. No signup. No payment. Forever.</p>

            <h3>Will I see ads?</h3>
            <p>The site is funded by a single Buy Me a Coffee link in the footer — no banner ads, popups, or sponsored content.</p>

            <h3>Does the free version have all features?</h3>
            <p>Yes. There&apos;s no &ldquo;pro&rdquo; tier. Every percentage option, both PDF reports, and the full layout are available to everyone.</p>

            <h2>Ready for your first free Turnitin report?</h2>
            <p>
              Open the <Link href="/">free Turnitin report generator</Link> and
              download your first PDFs in under 10 seconds. Or learn more about
              picking the right{' '}
              <Link href="/blog/custom-turnitin-report-explained">custom
              percentages</Link>.
            </p>
          </article>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
