'use client';

import Link from 'next/link';
import { useState } from 'react';

const links = [
  { href: '/', label: 'Home' },
  { href: '/how-it-works', label: 'How it works' },
  { href: '/features', label: 'Features' },
  { href: '/free-turnitin-report', label: 'Free Report' },
  { href: '/custom-turnitin-report', label: 'Custom Report' },
  { href: '/blog', label: 'Blog' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Contact' },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="site-header">
      <div className="container site-header-inner">
        <Link href="/" className="brand" aria-label="Turnitin Report Generator — Home" onClick={close}>
          <span className="brand-mark" aria-hidden="true">TR</span>
          <span className="brand-name">
            Turnitin<span>Report</span>
          </span>
        </Link>

        <nav className={`primary-nav ${open ? 'open' : ''}`} aria-label="Primary">
          {/* CTA inside the menu — only visible in the mobile drawer (CSS) */}
          <Link href="/#generator" className="nav-cta nav-cta-mobile" onClick={close}>
            Generate Report
          </Link>
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={close}>
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="site-header-end">
          <Link href="/#generator" className="nav-cta nav-cta-desktop" onClick={close}>
            <svg className="nav-cta-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 3L4 14h7l-1 7 9-11h-7l1-7z" />
            </svg>
            Generate Report
          </Link>

          <button
            type="button"
            className="nav-toggle"
            aria-label={open ? 'Close navigation' : 'Open navigation'}
            aria-expanded={open}
            aria-controls="primary-nav"
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
