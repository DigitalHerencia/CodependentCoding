import Image from 'next/image';
import Link from 'next/link';
import { SimplesNavigation } from './simples-navigation';

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link
        className="wordmark codependent-wordmark"
        href="/"
        aria-label="The Codependent Coding Web App Architecture home"
      >
        <Image
          src="/Codependent Coding Logo.jpg"
          alt="The Codependent Coding Web App Architecture"
          width={1623}
          height={293}
          priority
        />
      </Link>
      <nav aria-label="Primary navigation">
        <Link className="nav-link" href="/ontologies">
          ONTOLOGIES
        </Link>
        <SimplesNavigation />
        <Link className="nav-link" href="/anthimeria">
          ANTHIMERIA
        </Link>
        <Link className="nav-link" href="/maximal-template">
          MAXIMAL
        </Link>
      </nav>
    </header>
  );
}
