import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import SiteHeader from '../../components/SiteHeader';
import SiteFooter from '../../components/SiteFooter';
import JsonLd from '../../components/JsonLd';
import { SITE } from '../../lib/seo';
import { posts } from '../posts';

const post = posts.find((p) => p.slug === 'what-is-a-good-similarity-score-on-turnitin')!;

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
        url: '/images/blog/good-similarity-score-hero.jpg',
        width: 1200,
        height: 675,
        alt: 'What Is a Good Similarity Score on Turnitin?',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: post.title,
    description: post.description,
    images: ['/images/blog/good-similarity-score-hero.jpg'],
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
            <span>Good Turnitin Similarity Score</span>
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
                src="/images/blog/good-similarity-score-hero.jpg"
                alt="Safe and warning similarity percentage bands on a Turnitin dashboard"
                width={1200}
                height={675}
                priority
                className="prose-img"
              />
            </div>

            {/* Featured Snippet Target Block */}
            <blockquote>
              <strong>Direct Answer:</strong> Generally, a <strong>good turnitin similarity score is under 15%</strong>. Most universities in the US, UK, and Canada consider a similarity index between <strong>1% and 15%</strong> as safe, indicating normal citation practices and original research. Any score above <strong>25%</strong> is a red flag that usually triggers a manual plagiarism investigation by instructors.
            </blockquote>

            <p>
              When your instructor uploads your paper to Turnitin, the system compiles a similarity report. It matches your text against an enormous database of web pages, journals, books, and past student submissions. The output is a percentage score (the similarity index) coupled with color-coded highlight flags. 
            </p>
            <p>
              However, interpreting a Turnitin percentage is not as simple as &ldquo;high percentage equals cheating.&rdquo; Let&apos;s break down what Turnitin percentage colors mean, how institutions grade them, and how you can ensure your paper stays in the safe zone.
            </p>

            <h2>Understanding Turnitin Percentage Colors</h2>
            <p>
              Turnitin does not classify papers as &ldquo;plagiarized&rdquo; or &ldquo;not plagiarized.&rdquo; Instead, it groups papers into five color bands based on the overall volume of matching text:
            </p>
            <ul>
              <li><strong>Blue (0%)</strong> — No matching text. While this seems ideal, a flat 0% similarity is highly unusual for research papers. It can suggest that you haven&apos;t cited any external sources or references, or that the document has been heavily masked.</li>
              <li><strong>Green (1% to 24%)</strong> — The standard safe zone. This range represents normal academic writing, featuring standard terminology, correctly formatted quotes, and list of references.</li>
              <li><strong>Yellow (25% to 49%)</strong> — Moderate similarity. This level indicates either poor paraphrasing, excessive direct quotes, or a failure to properly format block quotes.</li>
              <li><strong>Orange (50% to 74%)</strong> — High similarity. A large portion of the paper has been copied directly from sources. This will almost certainly result in academic disciplinary action unless the paper is a literature review with extensive references.</li>
              <li><strong>Red (75% to 100%)</strong> — Critical similarity. The document is almost entirely copy-pasted or matches a previously submitted paper in the Turnitin database.</li>
            </ul>

            <h2>What Is an Acceptable Similarity Index in US, UK, and CA?</h2>
            <p>
              Different universities and course levels have different standards for what is considered an &ldquo;acceptable&rdquo; percentage:
            </p>
            
            <table>
              <thead>
                <tr>
                  <th>Similarity Range</th>
                  <th>Status</th>
                  <th>Typical Action Required</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>0%</strong></td>
                  <td>Suspiciously Low</td>
                  <td>Ensure you have cited sources. Instructors may check if you used text-replacement tricks to bypass detection.</td>
                </tr>
				        <tr>
                  <td><strong>1% – 15%</strong></td>
                  <td>Excellent / Safe</td>
                  <td>No action needed. Fits normal academic research bounds.</td>
                </tr>
                <tr>
                  <td><strong>16% – 24%</strong></td>
                  <td>Borderline Safe</td>
                  <td>Double-check that all common matches are properly cited in APA, MLA, or Harvard formats.</td>
                </tr>
                <tr>
                  <td><strong>25% – 49%</strong></td>
                  <td>Risky Zone</td>
                  <td>Revise. Rewrite matching passages in your own voice. Replace some direct quotes with paraphrasing.</td>
                </tr>
                <tr>
                  <td><strong>50%+</strong></td>
                  <td>High Risk / Red Flag</td>
                  <td>Rewrite immediately. High probability of failing the assignment or academic inquiry.</td>
                </tr>
              </tbody>
            </table>

            <h2>Common Triggers That Artificially Inflate Your Score</h2>
            <p>
              Many students panic when their similarity percentage is higher than expected. Often, this is due to non-plagiarism matches that Turnitin flags by default:
            </p>
            <ol>
              <li>
                <strong>Common Phrases and Terminology</strong> — Standard definitions, legal terms, scientific formulas, and common industry phrases cannot be phrased differently and will be flagged.
              </li>
              <li>
                <strong>Bibliography and References List</strong> — Because citation lists match exactly, Turnitin flags the entire reference section at the end of your document.
              </li>
              <li>
                <strong>Direct Quotes</strong> — Even if properly cited and wrapped in quote marks, Turnitin will flag them as matching source text unless the instructor has manually enabled the &ldquo;Exclude Quotes&rdquo; filter.
              </li>
              <li>
                <strong>Template Text / Coversheets</strong> — Submission templates, coversheets, and declaration statements required by colleges will be matched across all students in your class.
              </li>
            </ol>

            <h2>How to Keep Your Turnitin Score Safe</h2>
            <p>
              To ensure your paper passes similarity checks successfully, follow these best practices before uploading:
            </p>
            <ul>
              <li>
                <strong>Paraphrase Thoroughly</strong> — Don&apos;t just swap a few words for synonyms. Read the source, close the tab, and write the concept from memory in your own unique voice.
              </li>
              <li>
                <strong>Exclude Bibliographies</strong> — If you are using a self-check tool, enable options to filter out reference pages to see your true text similarity.
              </li>
              <li>
                <strong>Use Direct Quotes Sparingly</strong> — Direct quotes should represent less than 10% of your total word count. Rely on analysis and synthesis instead of copying text block-by-block.
              </li>
              <li>
                <strong>Generate a Pre-Submission Report</strong> — Check your work using a private <Link href="/">plagiarism report generator</Link> before official submission to identify accidental matches and fix them in advance.
              </li>
            </ul>

            <h2>Frequently Asked Questions</h2>
            <h3>Can Turnitin detect plagiarism if I cite the source?</h3>
            <p>
              Turnitin will highlight the matching text, but your instructor will manually review it. If it is properly cited and wrapped in quotes, it is considered academic integrity, not plagiarism, regardless of the highlight.
            </p>

            <h3>What happens if I get a 0% Turnitin similarity score?</h3>
            <p>
              While not an automatic failure, a 0% score is rare for essays. It indicates that you have no shared phrases or standard references with the internet, which can look highly unnatural to professors checking for reference depth.
            </p>

            <h3>How do I lower my Turnitin percentage fast?</h3>
            <p>
              The fastest way is to find highlighted blocks in your report, rewrite them completely using a different sentence structure, reduce direct quotes, and make sure standard declarations or tables are not copy-pasted.
            </p>

            <h2>Verify Your Score Prior to Uploading</h2>
            <p>
              Don&apos;t leave your grade to chance. Learn <Link href="/blog/how-to-generate-a-turnitin-report">how to generate a Turnitin report online</Link> in under 10 seconds, check your scores privately, and edit any flagged sections before your professor sees them.
            </p>
          </article>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
