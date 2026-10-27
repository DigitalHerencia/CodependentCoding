import Image from "next/image";
import Link from "next/link";

const primaryLinks = [
  { label: "Doctrine", href: "/doctrine" },
  { label: "Maximal", href: "/maximal" },
  { label: "Hipster Stack", href: "/hipster-stack" },
  { label: "Loaded Vibes", href: "/loaded-vibes" },
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
            src="/codependent-coding-logo.jpg"
            alt="The Codependent Coding Web App Architecture"
            width={1623}
            height={293}
            priority
          />
        </Link>
        <nav aria-label="Primary navigation">
          {primaryLinks.map((link) => (
            <Link className="nav-link" href={link.href} key={link.label}>
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
