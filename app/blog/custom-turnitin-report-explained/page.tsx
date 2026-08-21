import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import SiteHeader from '../../components/SiteHeader';
import SiteFooter from '../../components/SiteFooter';
import JsonLd from '../../components/JsonLd';
import { SITE } from '../../lib/seo';
import { posts } from '../posts';

const post = posts.find((p) => p.slug === 'custom-turnitin-report-explained')!;

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
        url: '/images/blog/custom-percentage-hero.jpg',
        width: 1200,
        height: 675,
        alt: 'Custom Turnitin Report Percentages Explained',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: post.title,
    description: post.description,
    images: ['/images/blog/custom-percentage-hero.jpg'],
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
            <span>Custom Turnitin Report Explained</span>
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
                src="/images/blog/custom-percentage-hero.jpg"
                alt="Setting custom similarity and AI percentage slider dials on a dashboard"
                width={1200}
                height={675}
                priority
                className="prose-img"
              />
            </div>
            <p>
              A <strong>custom Turnitin report</strong> is a Turnitin-style PDF
              where you, not an institution, decide what the final score looks
              like. In this guide we&apos;ll break down what the two percentages
              actually represent, when each setting makes sense, and how to pick
              the right number for your document.
            </p>

            <h2>The two percentages on every Turnitin report</h2>
            <p>
              Every Turnitin submission produces two distinct scores. Our{' '}
              <Link href="/custom-turnitin-report">custom Turnitin report
              generator</Link> exposes both so you can tune them independently:
            </p>
            <ul>
              <li>
                <strong>Similarity percentage</strong> — the share of your text
                that matches an external source (a website, journal, prior
                submission, or a phrase commonly used in writing).
              </li>
              <li>
                <strong>AI detection percentage</strong> — the share of your
                text that Turnitin&apos;s classifier believes was AI-generated
                (ChatGPT, Claude, Gemini, etc.).
              </li>
            </ul>

            <h2>What a &ldquo;good&rdquo; similarity percentage looks like</h2>
            <p>
              For academic submissions, most instructors are comfortable with
              <strong> 10–20%</strong> similarity. Higher numbers don&apos;t
              automatically mean plagiarism — quoted material, references, and
              common phrases all contribute. Lower numbers may look suspiciously
              clean for non-trivial topics.
            </p>
            <p>Picking a custom similarity score for your report:</p>
            <ul>
              <li><strong>0–9%</strong> — squeaky-clean, great for short personal essays.</li>
              <li><strong>10–18%</strong> — realistic for most academic work.</li>
              <li><strong>19–28%</strong> — common in research-heavy papers with citations.</li>
              <li><strong>29%+</strong> — typical only when many direct quotes are included.</li>
            </ul>

            <h2>What a &ldquo;good&rdquo; AI detection percentage looks like</h2>
            <p>
              Genuine human writing usually scores <strong>0–20%</strong> AI.
              Heavily edited AI output lands around <strong>30–60%</strong>.
              Unedited AI content trips at <strong>70%+</strong>. For a
              realistic custom report, pick a number that matches the kind of
              author you want the report to portray.
            </p>

            <h2>When custom Turnitin reports actually make sense</h2>
            <ul>
              <li>Previewing what your essay might score before official submission.</li>
              <li>Demonstrating Turnitin scoring mechanics to a class.</li>
              <li>Providing freelance clients with proof of originality.</li>
              <li>Comparing how citation styles affect similarity scores.</li>
              <li>Practicing paraphrasing skills with instant feedback.</li>
            </ul>

            <h2>Step-by-step: creating your custom report</h2>
            <ol>
              <li>Open the <Link href="/">Turnitin report generator</Link>.</li>
              <li>Drop in your PDF (up to 10MB).</li>
              <li>In the modal, pick your AI percentage (0%, *, or a preset).</li>
              <li>Enter your similarity percentage (0–100).</li>
              <li>Click <strong>Generate Report</strong> and wait ~10 seconds.</li>
              <li>Download both the AI and Similarity PDFs.</li>
            </ol>

            <h2>How the highlighting works under the hood</h2>
            <p>
              The generator extracts text from your PDF, identifies sentences
              that match the requested percentage band, and applies authentic
              Turnitin-style color-coded highlights — the same yellow, blue,
              pink, and green tones the real report uses. The result is a PDF
              that visually matches what your instructor expects to see.
            </p>

            <h2>Frequently asked</h2>
            <h3>Can I change the score after generating?</h3>
            <p>Yes. Just close the modal, re-upload (or click Generate New Reports), and pick different percentages.</p>

            <h3>Will the highlighted sentences make sense?</h3>
            <p>Yes — the algorithm picks contiguous, sentence-aligned passages to mimic real Turnitin output, not random scatter.</p>

            <h3>Is creating a custom report free?</h3>
            <p>Always. See our <Link href="/free-turnitin-report">free Turnitin report</Link> page for details.</p>

            <h2>Next steps</h2>
            <p>
              Try the <Link href="/">custom Turnitin report generator</Link>{' '}
              now, or learn <Link href="/blog/how-to-generate-a-turnitin-report">
              how to generate a Turnitin report in 3 steps</Link>.
            </p>
          </article>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
