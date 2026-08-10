import Link from 'next/link';

export default function Home() {
  return (
    <main className="shell landing">
      <section className="landing-hero">
        <p className="eyebrow">Deterministic project generator</p>
        <h1>
          Generate the golden prototype.
          <em> Start building the product.</em>
        </h1>
        <p className="lede">
          Loaded Vibes turns one bounded configuration into a complete
          white-label Hipster Stack application. One owned template. No stack
          shopping. No hidden hosted build.
        </p>
        <div className="hero-actions">
          <Link className="button primary" href="/configure">
            Configure a project
          </Link>
          <code>pnpm dlx create-loaded-vibes@latest</code>
        </div>
      </section>

      <section className="factory-flow" aria-label="Loaded Vibes workflow">
        <article>
          <span>01 / Configure</span>
          <h2>Choose only real product surfaces.</h2>
          <p>Identity, routes, integrations, and bounded visual direction.</p>
        </article>
        <article>
          <span>02 / Export</span>
          <h2>Keep the contract portable.</h2>
          <p>
            The web tool produces the same loadedvibes.json used by the CLI.
          </p>
        </article>
        <article>
          <span>03 / Generate</span>
          <h2>Receive the application.</h2>
          <p>
            Deterministic retain, remove, transform, install, and git setup.
          </p>
        </article>
      </section>

      <section className="foundation-callout">
        <div>
          <p className="eyebrow">Fixed foundation</p>
          <h2>
            Architecture is a product decision, not another questionnaire.
          </h2>
        </div>
        <p>
          DevNotes supplies Hipster Stack doctrine. Loaded Vibes owns the
          executable template and deterministic production path: Next.js,
          TypeScript, Prisma, Neon/Postgres, Clerk, tenant authorization, and
          Vercel-oriented delivery.
        </p>
      </section>
    </main>
  );
}
