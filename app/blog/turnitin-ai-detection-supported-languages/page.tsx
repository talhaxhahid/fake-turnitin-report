import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import SiteHeader from '../../components/SiteHeader';
import SiteFooter from '../../components/SiteFooter';
import JsonLd from '../../components/JsonLd';
import { SITE } from '../../lib/seo';
import { posts } from '../posts';

const post = posts.find((p) => p.slug === 'turnitin-ai-detection-supported-languages')!;

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
        url: '/images/blog/turnitin-ai-detection-languages-hero.jpg',
        width: 1200,
        height: 675,
        alt: 'Turnitin AI Detection Supported Languages',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: post.title,
    description: post.description,
    images: ['/images/blog/turnitin-ai-detection-languages-hero.jpg'],
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
            <span>Turnitin AI Supported Languages</span>
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
                src="/images/blog/turnitin-ai-detection-languages-hero.jpg"
                alt="Bilingual flags and global network linking language data bubbles on a tech interface"
                width={1200}
                height={675}
                priority
                className="prose-img"
              />
            </div>

            {/* Featured Snippet Target Block */}
            <blockquote>
              <strong>Direct Answer:</strong> Turnitin&apos;s AI writing detection tool currently supports submissions written in <strong>English</strong>. While Turnitin&apos;s standard plagiarism scanner matches over 30 languages (including Spanish, French, and Japanese), the AI detection classifier only reliably scores documents written in the English language. Text submitted in other languages will generate a 0% AI detection score, though it remains fully checked for similarity matches.
            </blockquote>

            <p>
               Bicultural and international students often write in multiple languages or translate source materials. While standard plagiarism databases check text matches globally, Turnitin&apos;s AI writing detector functions on different parameters. 
            </p>
            <p>
              Let&apos;s break down which languages Turnitin scans for plagiarism, how translation affects AI scores, and how to verify your scores.
            </p>

            <h2>Plagiarism vs. AI Detection: Supported Languages Compared</h2>
            <p>
              It is critical to distinguish between Turnitin&apos;s two main reporting systems when analyzing language compatibility:
            </p>
            
            <h3>1. Plagiarism Database Matching (Multi-Language)</h3>
            <p>
              Turnitin&apos;s standard similarity scanner is highly multilingual. It supports over 30 languages, including:
            </p>
            <ul>
              <li><strong>Spanish</strong> (Español)</li>
              <li><strong>German</strong> (Deutsch)</li>
              <li><strong>French</strong> (Français)</li>
              <li><strong>Japanese</strong> (日本語)</li>
              <li><strong>Chinese</strong> (中文)</li>
              <li><strong>Portuguese</strong>, <strong>Italian</strong>, <strong>Dutch</strong>, and others.</li>
            </ul>
            <p>
              The system also features **Translated Matching**. If you translate a paper from German to English and submit it, Turnitin translates your submission back to check against its German database files, flagging matching content.
            </p>

            <h3>2. AI Writing Detection (English-Only)</h3>
            <p>
              Turnitin&apos;s AI detection classifier requires semantic parsing models that analyze perplexity and burstiness. Because these stylistic characteristics are unique to grammatical structures, the AI detector is currently restricted to:
            </p>
            <ul>
              <li><strong>English submissions only.</strong></li>
            </ul>
            <p>
              If you submit an assignment written in Spanish, French, or Japanese, the Turnitin report will show a greyed-out or **0% AI detection score**, even if the text was completely written by ChatGPT.
            </p>

            <h2>How Translation Affects Your Turnitin AI Score</h2>
            <p>
              Because AI detection is limited to English, a common question is what happens when translating AI output:
            </p>
            <ul>
              <li>
                <strong>AI Non-English Text Translated to English:</strong> If you generate text in Spanish using ChatGPT and translate it to English using Google Translate or DeepL, the resulting English draft **will get flagged by Turnitin**. The translation output retains the uniform structure and low burstiness characteristic of AI classifiers.
              </li>
              <li>
                <strong>English AI Text Translated to Non-English:</strong> If you generate text in English and translate it to Spanish for submission, the Turnitin AI detector will not check it, but standard database checks will scan for translated plagiarism.
              </li>
            </ul>

            <h2>Accidental AI Flags on Non-Native English Speakers</h2>
            <p>
              Even though the AI detector is English-only, it has a major drawback for international students writing in English.
            </p>
            <p>
              Because non-native English speakers write with a more simplified vocabulary and uniform sentence structures (low burstiness), Turnitin&apos;s classifier frequently mistakes their authentic writing for AI-generated text. This false positive issue makes it essential for international students to maintain draft revision records.
            </p>

            <h2>Check Your Similarity and AI Scores Privately</h2>
            <p>
              Ensure your translations and reference listings pass plagiarism checks safely. Use our client-side <Link href="/">free Turnitin report generator</Link> to check your draft score privately before uploading it to Canvas, helping you adjust your writing style if it triggers accidental flags.
            </p>

            <h2>Frequently Asked Questions</h2>
            <h3>Does Turnitin AI detection work in Spanish?</h3>
            <p>
              No. Turnitin&apos;s AI writing detection tool currently only processes submissions written in the English language. Non-English submissions will not generate an AI score.
            </p>

            <h3>Can Turnitin detect translated plagiarism?</h3>
            <p>
              Yes. Turnitin&apos;s Translated Matching feature translates English submissions back into their original languages to cross-match them against databases of foreign articles and journals.
            </p>

            <h3>Is my paper safe from database indexing if it&apos;s not in English?</h3>
            <p>
              No. Regardless of the language, all files submitted through standard university Canvas portals are indexed in Turnitin&apos;s database to protect against future copying.
            </p>

            <h2>Verify Your Scores Before Submitting</h2>
            <p>
              Check your document safely. Read our guide on <Link href="/blog/custom-turnitin-report-explained">custom Turnitin report percentages</Link> and test your file using our secure tool today.
            </p>
          </article>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
