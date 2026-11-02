import { HerenciaLockup } from "@/components/brand/herencia-lockup";
import Link from "next/link";
import {
  doctrineRelease,
  siteNavigation,
  siteOperator,
} from "@/content/public";

const footerLinks = [
  { label: "FAQ", href: "/faq" },
  { label: "Terms", href: "/terms" },
  { label: "Privacy", href: "/privacy" },
] as const;

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-bar">
        <Link
          className="heritage-wordmark"
          href="/"
          aria-label="Digital Herencia"
        >
          <HerenciaLockup />
        </Link>
        <nav aria-label="Footer navigation">
          {siteNavigation.map((link) => (
            <Link className="nav-link" href={link.href} key={link.label}>
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="site-bar site-footer-details">
        <p>
          Doctrine v{doctrineRelease.version} · verified{" "}
          <time dateTime={doctrineRelease.verifiedOn}>
            {doctrineRelease.verifiedOn}
          </time>
        </p>
        <nav aria-label="Policies and support">
          {footerLinks.map((link) => (
            <Link className="nav-link" href={link.href} key={link.label}>
              {link.label}
            </Link>
          ))}
          <a className="nav-link" href={siteOperator.securityUrl}>
            Security
          </a>
        </nav>
        <p>© 2026 {siteOperator.name}</p>
      </div>
    </footer>
  );
}
