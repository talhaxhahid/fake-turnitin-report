import Link from 'next/link';
import ReportsCounter from './ReportsCounter';

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link href="/" className="brand" aria-label="Home">
              <span className="brand-mark" aria-hidden="true">TR</span>
              <span className="brand-name footer-brand-name">
                <span style={{ color: '#ffffff' }} className="footer-brand-white">Turnitin</span>
                <span className="footer-brand-accent">Report</span>
              </span>
            </Link>
            <p className="footer-tag">
              The fastest free Turnitin report generator online. Create custom AI detection
              and similarity reports as downloadable PDFs in seconds.
            </p>
          </div>

          <div className="footer-col">
            <h4>Product</h4>
            <ul>
              <li><Link href="/">Report Generator</Link></li>
              <li><Link href="/free-turnitin-report">Free Turnitin Report</Link></li>
              <li><Link href="/custom-turnitin-report">Custom Turnitin Report</Link></li>
              <li><Link href="/features">Features</Link></li>
              <li><Link href="/how-it-works">How It Works</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Resources</h4>
            <ul>
              <li><Link href="/blog">Blog</Link></li>
              <li><Link href="/blog/how-to-generate-a-turnitin-report">Generate a Turnitin Report</Link></li>
              <li><Link href="/blog/custom-turnitin-report-explained">Custom Reports Explained</Link></li>
              <li><Link href="/blog/free-turnitin-report-guide">Free Report Guide</Link></li>
              <li><Link href="/faq">FAQ</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Company</h4>
            <ul>
              <li><Link href="/about">About</Link></li>
              <li><Link href="/contact">Contact</Link></li>
              <li><Link href="/privacy-policy">Privacy Policy</Link></li>
              <li><Link href="/terms">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Turnitin Report Generator. For educational and demonstration purposes only.</p>
          <div className="report-counter">
            <span className="counter-label">Reports Generated:</span>
            <ReportsCounter />
          </div>
        </div>
      </div>
    </footer>
  );
}
