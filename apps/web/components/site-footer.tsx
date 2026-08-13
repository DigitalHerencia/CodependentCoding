import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-bar">
        <Link
          className="heritage-wordmark"
          href="/"
          aria-label="Digital Herencia"
        >
          <strong>Digital Herencia</strong>
          <small>A Data Cartel</small>
        </Link>
        <nav aria-label="Footer navigation">
          <Link href="/">About</Link>
          <a href="mailto:hello@digitalherencia.com">Contact</a>
          <span>Privacy</span>
          <span>Terms</span>
        </nav>
        <small>© 2026 Digital Herencia</small>
      </div>
    </footer>
  );
}
