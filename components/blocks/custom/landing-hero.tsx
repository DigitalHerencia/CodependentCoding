import Image from 'next/image';

const factoryComponents = [
  {
    name: 'Codependent Coding',
    role: 'Doctrine',
    summary:
      'Architecture rules, naming, and layer contracts, enforced by ESLint and Prettier.',
  },
  {
    name: 'Maximal Template',
    role: 'Template',
    summary:
      'One runnable Next.js app with the base and every module, where modules are built.',
  },
  {
    name: 'Hipster Stack',
    role: 'CLI',
    summary:
      'A local CLI that composes, slices, and checks apps: new, add, slice, doctor, compose.',
  },
  {
    name: 'Loaded Vibes',
    role: 'Plugin',
    summary:
      'A Claude Code plugin that keeps agents planning, slicing, and shipping inside the rails.',
  },
] as const;

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
          <a className="brand-button" href="#doctrine">
            Read the doctrine
          </a>
          <a
            className="brand-button brand-button-outline"
            href="https://github.com/DigitalHerencia/CodependentCoding"
          >
            GitHub
          </a>
        </div>
        <strong>Nothing to borrow. We checked.</strong>
      </section>
      <section
        className="landing-factory"
        id="doctrine"
        aria-labelledby="factory-heading"
      >
        <h2 id="factory-heading">The factory</h2>
        <ul>
          {factoryComponents.map((component) => (
            <li key={component.role}>
              <span>{component.role}</span>
              <h3>{component.name}</h3>
              <p>{component.summary}</p>
            </li>
          ))}
        </ul>
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
