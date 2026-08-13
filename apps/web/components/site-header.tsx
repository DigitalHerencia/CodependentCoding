import Link from 'next/link';

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link className="wordmark hipster-wordmark" href="/" aria-label="Hipster Stack home">
        <strong>The Hipster Stack™</strong>
        <small>Constituted not Composable</small>
      </Link>
      <nav aria-label="Primary navigation">
        <Link href="/">Product</Link>
        <Link href="/libraries">Simples</Link>
        <Link href="/docs">Docs</Link>
        <Link className="nav-cta" href="/configure">
          Constituter <span>→</span>
        </Link>
      </nav>
    </header>
  );
}
