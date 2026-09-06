import Image from 'next/image';
import Link from 'next/link';
import type { Route } from 'next';

export function LandingHero() {
  return (
    <main className="landing-page">
      <Image
        className="landing-crown"
        src="/Codependent Coding Crown.jpg"
        alt="The Codependent Coding WebApp Architecture"
        width={1792}
        height={1024}
        priority
        sizes="(min-width: 80rem) 72rem, 100vw"
      />
      <section className="landing-copy">
        <h1>
          When epistemologies fail
          <br />
          the stack still governs
        </h1>
        <p>
          Finally, a technology stack
          <br />
          with provenance that won&apos;t rust.
        </p>
        <div className="landing-actions">
          <Link className="brand-button" href="/ontologies">
            Get started
          </Link>
          <Link
            className="brand-button brand-button-outline"
            href={'/typescripture' as Route}
          >
            More info
          </Link>
        </div>
        <strong>Nothing to borrow. We checked.</strong>
      </section>
      <Image
        className="landing-heritage"
        src="/Digital Herencia Logo.jpg"
        alt="Digital Herencia"
        width={1400}
        height={400}
        sizes="(min-width: 64rem) 46rem, 90vw"
      />
    </main>
  );
}
