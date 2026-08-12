import Image from 'next/image';
import Link from 'next/link';
import loadedVibesLogo from '../../../public/Loaded Vibes Logo White.png';

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link className="wordmark" href="/" aria-label="Loaded Vibes home">
        <Image
          src={loadedVibesLogo}
          alt="Loaded Vibes"
          priority
          sizes="120px"
        />
      </Link>
      <nav aria-label="Primary navigation">
        <Link href="/">Product</Link>
        <Link href="/libraries">Libraries</Link>
        <Link href="/docs">Docs</Link>
        <Link className="nav-cta" href="/configure">
          Builder <span>→</span>
        </Link>
      </nav>
    </header>
  );
}
