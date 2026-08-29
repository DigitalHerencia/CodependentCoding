import Image from 'next/image';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';

export function ProductLanding() {
  return (
    <main className="product-landing">
      <section
        className="landing-brand"
        aria-label="The Codependent Coding Web App Architecture"
      >
        <Image
          className="landing-crown"
          src="/Codependent Coding Crown.jpg"
          alt="The Codependent Coding Web App Architecture"
          width={1792}
          height={1024}
          priority
          sizes="100vw"
        />
      </section>

      <section className="landing-statement" aria-labelledby="landing-title">
        <h1 id="landing-title">
          When epistemologies fail
          <br />
          the stack still governs
        </h1>
        <p>Finally, a technology stack with provenance that won&apos;t rust.</p>
        <div className="landing-actions">
          <Link
            className={buttonVariants({ variant: 'default' })}
            href="/ontologies"
          >
            Get started
          </Link>
          <Link className={buttonVariants({ variant: 'default' })} href="/docs">
            More info
          </Link>
        </div>
        <strong>Nothing to borrow. We checked.</strong>
      </section>

      <Image
        className="product-landscape"
        src="/Digital Herencia Banner.jpg"
        alt="Digital Herencia, a data cartel"
        width={1792}
        height={1024}
        sizes="100vw"
      />
    </main>
  );
}
