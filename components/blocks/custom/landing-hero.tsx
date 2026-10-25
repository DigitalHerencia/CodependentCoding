import Image from "next/image";

const repositoryUrl = "https://github.com/DigitalHerencia/CodependentCoding";

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
        sizes="(min-width: 60rem) 60rem, 100vw"
      />
      <section className="landing-copy">
        <h1>
          When epistemologies fail
          <br />
          the stack still governs
        </h1>
        <p>Finally, a technology stack with provenance that won&apos;t rust!</p>
        <div className="landing-actions">
          <a className="brand-button" href={repositoryUrl}>
            Get started
          </a>
          <a
            className="brand-button"
            href={`${repositoryUrl}/blob/main/context/docs/PRD.md`}
          >
            More info
          </a>
        </div>
        <strong>Nothing to borrow. We checked.</strong>
      </section>
      <Image
        className="landing-heritage"
        src="/Digital Herencia Logo.jpg"
        alt="Digital Herencia, a data cartel"
        width={1792}
        height={1024}
        sizes="(min-width: 48rem) 38rem, 80vw"
      />
    </main>
  );
}
