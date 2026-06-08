import type { Metadata } from 'next';
import Link from 'next/link';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import JsonLd from '../components/JsonLd';
import { SITE } from '../lib/seo';
import ContactForm from './ContactForm';

export const metadata: Metadata = {
  title: 'Contact Us — Turnitin Report Generator',
  description:
    'Get in touch with the Turnitin Report Generator team. Questions, feedback, partnerships, or media inquiries — we reply within 24 hours.',
  alternates: { canonical: '/contact' },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE.url },
    { '@type': 'ListItem', position: 2, name: 'Contact', item: `${SITE.url}/contact` },
  ],
};

const contactSchema = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'Contact Turnitin Report Generator',
  url: `${SITE.url}/contact`,
};

export default function ContactPage() {
  return (
    <>
      <JsonLd data={[breadcrumbSchema, contactSchema]} />
      <SiteHeader />

      <section className="page-header">
        <div className="container">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link> <span>/</span> <span>Contact</span>
          </nav>
          <h1 className="section-title">
            Get in <span className="grad">touch</span>
          </h1>
          <p className="section-subtitle" style={{ margin: '0.75rem auto 0' }}>
            Questions about the Turnitin Report Generator? Feedback? Partnerships?
            Drop us a message and we&apos;ll reply within 24 hours.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <ContactForm />

          <div style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--color-text-secondary)' }}>
            Prefer email? Write to{' '}
            <a href={`mailto:${SITE.email}`} style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
              {SITE.email}
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
