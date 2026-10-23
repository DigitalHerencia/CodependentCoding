import Image from "next/image";
import Link from "next/link";

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
        <a
          className="nav-link"
          href="https://github.com/DigitalHerencia/CodependentCoding"
        >
          GITHUB
        </a>
      </nav>
    </header>
  );
}
