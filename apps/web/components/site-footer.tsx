import Image from 'next/image';
import Link from 'next/link';
import digitalHerenciaBanner from '../../../public/Digital Herencia Banner.png';
import digitalHerenciaLogo from '../../../public/Digital Herencia White Logo.png';

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="heritage-landscape">
        <Image
          src={digitalHerenciaBanner}
          alt="Digital Herencia — A Data Cartel"
          sizes="100vw"
        />
      </div>
      <div className="footer-bar">
        <Image src={digitalHerenciaLogo} alt="Digital Herencia" sizes="92px" />
        <nav aria-label="Footer navigation">
          <Link href="/">About</Link>
          <a href="mailto:hello@digitalherencia.com">Contact</a>
          <span>Privacy</span>
          <span>Terms</span>
        </nav>
        <small>© 2026 Digital Herencia</small>
      </div>
    </footer>
  );
}
