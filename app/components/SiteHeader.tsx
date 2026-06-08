'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

type LinkItem = { href: string; label: string; icon: React.ReactNode };

const HomeIcon = (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-9 9 9M5 10v10a1 1 0 001 1h3v-6h6v6h3a1 1 0 001-1V10" />
  </svg>
);
const HowIcon = (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
  </svg>
);
const StarIcon = (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.366 2.446a1 1 0 00-.364 1.118l1.286 3.957c.299.92-.755 1.688-1.54 1.118l-3.366-2.446a1 1 0 00-1.176 0l-3.366 2.446c-.784.57-1.838-.197-1.539-1.118l1.286-3.957a1 1 0 00-.364-1.118L2.07 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
  </svg>
);
const GiftIcon = (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zM5 12h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
  </svg>
);
const SlidersIcon = (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16M8 6v0m8 6v0m-4 6v0" />
    <circle cx="8" cy="6" r="1.5" fill="currentColor" />
    <circle cx="16" cy="12" r="1.5" fill="currentColor" />
    <circle cx="12" cy="18" r="1.5" fill="currentColor" />
  </svg>
);
const PenIcon = (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);
const HelpIcon = (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093M12 17h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const MailIcon = (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l9 6 9-6m-18 0v8a2 2 0 002 2h14a2 2 0 002-2V8m-18 0a2 2 0 012-2h14a2 2 0 012 2" />
  </svg>
);

const links: LinkItem[] = [
  { href: '/',                        label: 'Home',            icon: HomeIcon },
  { href: '/how-it-works',            label: 'How it works',    icon: HowIcon },
  { href: '/features',                label: 'Features',        icon: StarIcon },
  { href: '/free-turnitin-report',    label: 'Free Report',     icon: GiftIcon },
  { href: '/custom-turnitin-report',  label: 'Custom Report',   icon: SlidersIcon },
  { href: '/blog',                    label: 'Blog',            icon: PenIcon },
  { href: '/faq',                     label: 'FAQ',             icon: HelpIcon },
  { href: '/contact',                 label: 'Contact',         icon: MailIcon },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  // Lock body scroll while drawer is open + close on Escape
  useEffect(() => {
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <header className="site-header">
      <div className="container site-header-inner">
        <Link href="/" className="brand" aria-label="Turnitin Report Generator — Home" onClick={close}>
          <span className="brand-mark" aria-hidden="true">TR</span>
          <span className="brand-name">
            Turnitin<span>Report</span>
          </span>
        </Link>

        {/* Desktop nav (centered) — same component, hidden on small screens via CSS */}
        <nav className="primary-nav" aria-label="Primary">
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
            className={`nav-toggle ${open ? 'is-open' : ''}`}
            aria-label={open ? 'Close navigation' : 'Open navigation'}
            aria-expanded={open}
            aria-controls="mobile-drawer"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="nav-toggle-bars" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          </button>
        </div>
      </div>

      {/* ============ Mobile Drawer ============ */}
      <div
        className={`mobile-drawer-backdrop ${open ? 'is-open' : ''}`}
        onClick={close}
        aria-hidden={!open}
      />
      <aside
        id="mobile-drawer"
        className={`mobile-drawer ${open ? 'is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        aria-hidden={!open}
      >
        <div className="mobile-drawer-header">
          <Link href="/" className="brand" onClick={close} aria-label="Home">
            <span className="brand-mark" aria-hidden="true">TR</span>
            <span className="brand-name">
              Turnitin<span>Report</span>
            </span>
          </Link>
          <button
            type="button"
            className="mobile-drawer-close"
            aria-label="Close menu"
            onClick={close}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <Link href="/#generator" className="mobile-drawer-cta" onClick={close}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 3L4 14h7l-1 7 9-11h-7l1-7z" />
          </svg>
          Generate Report
          <span className="mobile-drawer-cta-arrow" aria-hidden="true">→</span>
        </Link>

        <nav className="mobile-drawer-nav" aria-label="Mobile primary">
          <p className="mobile-drawer-section-label">Menu</p>
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={close}
              className="mobile-drawer-link"
            >
              <span className="mobile-drawer-link-icon" aria-hidden="true">{l.icon}</span>
              <span className="mobile-drawer-link-label">{l.label}</span>
              <span className="mobile-drawer-link-chev" aria-hidden="true">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </Link>
          ))}
        </nav>

        <div className="mobile-drawer-footer">
          <p className="mobile-drawer-footer-line">
            <span className="mobile-drawer-dot" /> 100% Free · No signup · Private
          </p>
          <p className="mobile-drawer-copyright">
            © {new Date().getFullYear()} Turnitin Report Generator
          </p>
        </div>
      </aside>
    </header>
  );
}
