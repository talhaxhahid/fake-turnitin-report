'use client';

export default function FloatingBMC() {
  return (
    <a
      href="https://www.buymeacoffee.com"
      target="_blank"
      rel="noopener noreferrer"
      className="float-bmc"
      aria-label="Buy Me a Coffee — support the Turnitin Report Generator"
    >
      <span className="float-bmc-ping" aria-hidden="true" />
      <span className="float-bmc-icon" aria-hidden="true">
        {/* Coffee cup */}
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h12v6a4 4 0 01-4 4H8a4 4 0 01-4-4V8z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 10h2a2 2 0 010 4h-2" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 4c0 1 1 1.5 1 3M11 4c0 1 1 1.5 1 3" />
        </svg>
      </span>
      <span className="float-bmc-label">
        <strong>Buy me a coffee</strong>
        <small>Keep this tool free ☕</small>
      </span>
    </a>
  );
}
