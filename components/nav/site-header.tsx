import Image from 'next/image';
import Link from 'next/link';

const navigation = [
  { href: '/ontologies', label: 'Ontologies' },
  { href: '/simples', label: 'Simples' },
  { href: '/anthimeria', label: 'Anthimeria' },
  { href: '/maximal', label: 'Maximal' },
] as const;

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
        {navigation.map((item) => (
          <Link href={item.href} key={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
