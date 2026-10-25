import Image from "next/image";
import Link from "next/link";

const footerLinks = [
  { label: "FAQ", href: "#faq" },
  { label: "Terms", href: "#terms" },
  { label: "Privacy", href: "#privacy" },
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
          <Image
            src="/Digital Herencia.jpg"
            alt="Digital Herencia, a data cartel"
            width={1059}
            height={465}
          />
        </Link>
        <nav aria-label="Footer navigation">
          {footerLinks.map((link) => (
            <a className="nav-link" href={link.href} key={link.label}>
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
