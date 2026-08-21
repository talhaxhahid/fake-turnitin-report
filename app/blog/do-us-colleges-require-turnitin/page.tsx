import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import SiteHeader from '../../components/SiteHeader';
import SiteFooter from '../../components/SiteFooter';
import JsonLd from '../../components/JsonLd';
import { SITE } from '../../lib/seo';
import { posts } from '../posts';

const post = posts.find((p) => p.slug === 'do-us-colleges-require-turnitin')!;

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
        url: '/images/blog/do-us-colleges-use-turnitin-hero.jpg',
        width: 1200,
        height: 675,
        alt: 'Do US Colleges Require Turnitin?',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: post.title,
    description: post.description,
    images: ['/images/blog/do-us-colleges-use-turnitin-hero.jpg'],
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
            <span>US Colleges Turnitin Requirements</span>
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
                src="/images/blog/do-us-colleges-use-turnitin-hero.jpg"
                alt="Classic Ivy League college library facade with digital security and database connections overlay"
                width={1200}
                height={675}
                priority
                className="prose-img"
              />
            </div>

            {/* Featured Snippet Target Block */}
            <blockquote>
              <strong>Direct Answer:</strong> Yes, a vast majority of US colleges and universities use Turnitin. Over **15,000 academic institutions worldwide**, including major American university systems like the University of California (UC), California State University (CSU), and the University of Texas (UT) systems, integrate Turnitin directly into learning management systems like Canvas and Blackboard to check essays, research papers, and assignments.
            </blockquote>

            <p>
              In the United States, academic integrity is taken extremely seriously. When you enroll in an American college, you agree to an Honor Code that strictly prohibits plagiarism, collusion, and unauthorized AI assistance. 
            </p>
            <p>
              To enforce these honor codes, instructors rely on automated text-matching software. Understanding how US colleges use Turnitin, how Canvas submissions interact with it, and what happens to your files is essential for navigating college writing successfully.
            </p>

            <h2>Which Major US University Systems Require Turnitin?</h2>
            <p>
              Rather than individual colleges buying licenses, Turnitin is typically deployed university-wide or system-wide. Major state university networks and private colleges that use Turnitin include:
            </p>
            <ul>
              <li><strong>University of California (UC) System</strong> — Berkeley, UCLA, UC San Diego, and others utilize Turnitin checks integrated into Canvas.</li>
              <li><strong>California State University (CSU) System</strong> — Across its 23 campuses, Turnitin is the primary tool for plagiarism checking.</li>
              <li><strong>University of Texas (UT) System</strong> — UT Austin and system campuses run assignments through Turnitin database comparisons.</li>
              <li><strong>Ivy League Institutions</strong> — Schools like Harvard, Yale, and Columbia emphasize strict plagiarism rules. While professors have discretion, most departments use Turnitin or custom institutional alternatives.</li>
            </ul>

            <h2>How Canvas Submissions and Turnitin Interact in US Schools</h2>
            <p>
              Most US colleges use **Canvas** or **Blackboard** as their Learning Management System (LMS). If your instructor has enabled Turnitin, the submission process happens seamlessly within the LMS:
            </p>
            <ol>
              <li>
                <strong>Automatic Upload:</strong> You upload your file (DOCX, PDF, or TXT) to the Canvas assignment tab.
              </li>
              <li>
                <strong>Background Match:</strong> Canvas automatically forwards the document to Turnitin&apos;s API.
              </li>
              <li>
                <strong>Report Generation:</strong> Within minutes, Turnitin generates the Similarity Report. Depending on the settings, you may see a colored flag (green, yellow, or red) next to your submission.
              </li>
              <li>
                <strong>Database Archival:</strong> Unless configured otherwise, your paper is added to the Turnitin student database, protecting it from being copied by other students.
              </li>
            </ol>

            <h2>Plagiarism Policies in US Higher Education</h2>
            <p>
              Most US colleges establish standard consequences for academic dishonesty. If your Turnitin score flags significant similarity:
            </p>
            <ul>
              <li><strong>First Offense:</strong> Usually results in a zero grade on the assignment and a formal warning recorded with the Office of Student Conduct.</li>
              <li><strong>Second Offense:</strong> Can result in failing the entire course, suspension, or permanent expulsion. The disciplinary record is attached to your academic transcript, which can prevent you from transferring or enrolling in graduate school.</li>
            </ul>
            <blockquote>
              <strong>Key Fact:</strong> US institutions do not base disciplinary actions solely on the similarity score. Turnitin is used as a screening tool. Instructors manually review flagged documents to check if the highlighted sections are standard citations, bibliography templates, or genuine plagiarism.
            </blockquote>

            <h2>How American Students Can Prepare Papers Safely</h2>
            <p>
              To ensure your papers conform to your college&apos;s plagiarism policies:
            </p>
            <ol>
              <li>
                <strong>Cite Every Source:</strong> Use standard American formats like **APA** (social sciences), **MLA** (humanities), or **Chicago** (history). Ensure all direct quotes are enclosed in quotation marks.
              </li>
              <li>
                <strong>Learn Proper Paraphrasing:</strong> Simply using a thesaurus to swap words is called "mosaic plagiarism" and is easily detected by Turnitin&apos;s semantic matching models. Rewrite the concepts completely in your own style.
              </li>
              <li>
                <strong>Run a Pre-Check:</strong> Use a private, client-side <Link href="/">custom Turnitin report generator</Link> to check your draft beforehand. Doing so ensures your paper is safe without risking indexing or database storage.
              </li>
            </ol>

            <h2>Frequently Asked Questions</h2>
            <h3>Do professors check the Turnitin report or just look at the percentage?</h3>
            <p>
              Professors manually review the report. A 20% score due to a properly formatted bibliography and citations will be accepted, while a 15% score with blocks of unreferenced copy-pasted text will trigger an academic integrity inquiry.
            </p>

            <h3>Can Turnitin detect self-plagiarism in college?</h3>
            <p>
              Yes. If you submit a paper you wrote for a different class, Turnitin will match it to your previous submission in its student database. Most US colleges prohibit reuse of your own work unless you have obtained prior approval from the instructor.
            </p>

            <h3>How do I know if my Canvas assignment uses Turnitin?</h3>
            <p>
              Canvas usually displays a plagiarism warning checkbox or details in the assignment description. Once submitted, a green, yellow, or red icon next to your submission indicates a report has been generated.
            </p>

            <h2>Protect Your Academic Record</h2>
            <p>
              Don&apos;t risk an accidental Honor Code violation. Read our guide on <Link href="/blog/what-is-a-good-similarity-score-on-turnitin">what constitutes a good similarity score</Link> and check your drafts privately before submitting them to your college portal.
            </p>
          </article>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
