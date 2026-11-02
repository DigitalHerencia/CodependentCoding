import { HerenciaLockup } from "@/components/brand/herencia-lockup";
import Link from "next/link";

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
          {footerLinks.map((link) => (
            <Link className="nav-link" href={link.href} key={link.label}>
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
