import Image from 'next/image';
import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-bar">
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
          <span aria-disabled="true">TERMS</span>
          <span aria-disabled="true">PRIVACY</span>
        </nav>
      </div>
    </footer>
  );
}
