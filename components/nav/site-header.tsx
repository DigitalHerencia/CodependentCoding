import { CodependentWordmark } from "@/components/brand/codependent-wordmark";
import Link from "next/link";
import { Search } from "lucide-react";
import { siteNavigation, siteOperator } from "@/content/public";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-bar">
        <Link
          className="wordmark codependent-wordmark"
          href="/"
          aria-label="The Codependent Coding Web App Architecture home"
        >
          <CodependentWordmark />
        </Link>
        <nav aria-label="Primary navigation">
          {siteNavigation.map((link) => (
            <Link className="nav-link" href={link.href} key={link.label}>
              {link.label}
            </Link>
          ))}
          <Link
            className="nav-link"
            href="/doctrine#chapter-search"
            aria-label="Search doctrine chapter titles"
          >
            <Search size={16} aria-hidden="true" />
            <span className="sr-only">Search chapters</span>
            <kbd title="Ctrl or Command K on doctrine pages">⌘K</kbd>
          </Link>
          <a
            className="nav-link"
            href={siteOperator.repositoryUrl}
            aria-label="Codependent Coding on GitHub"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.4-4-1.4-.5-1.4-1.3-1.7-1.3-1.7-1.1-.8.1-.8.1-.8 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.4 11.4 0 0 1 6 0C17.3 5 18.3 5.3 18.3 5.3c.6 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.5.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3Z" />
            </svg>
          </a>
        </nav>
      </div>
    </header>
  );
}
