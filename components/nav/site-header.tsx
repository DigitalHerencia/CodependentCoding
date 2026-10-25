import Image from "next/image";
import Link from "next/link";

const primaryLinks = [
  { label: "Ontologies", href: "#ontologies" },
  { label: "Simples", href: "#simples" },
  { label: "Anthimeria", href: "#anthimeria" },
  { label: "Maximal", href: "#maximal" },
] as const;

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-bar">
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
          {primaryLinks.map((link) => (
            <a className="nav-link" href={link.href} key={link.label}>
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
