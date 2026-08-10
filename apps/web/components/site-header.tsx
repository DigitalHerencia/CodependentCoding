import Link from 'next/link';

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link className="wordmark" href="/" aria-label="Loaded Vibes home">
        <span className="mark">LV</span>
        <span>Loaded Vibes</span>
      </Link>
      <nav aria-label="Primary navigation">
        <Link href="/">Overview</Link>
        <Link href="/docs">Docs</Link>
        <Link className="nav-cta" href="/configure">
          Open configurator
        </Link>
      </nav>
    </header>
  );
}
