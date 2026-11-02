import { CodependentMark } from "@/components/brand/codependent-mark";
import { CodependentWordmark } from "@/components/brand/codependent-wordmark";
import { HerenciaLockup } from "@/components/brand/herencia-lockup";

const repositoryUrl = "https://github.com/DigitalHerencia/CodependentCoding";

export function LandingHero() {
  return (
    <main id="main-content" tabIndex={-1} className="landing-page">
      <div className="landing-crown">
        <CodependentMark className="brand-crown" />
        <CodependentWordmark />
      </div>
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
            More info<span className="sr-only"> on the product plan</span>
          </a>
        </div>
        <strong>Nothing to borrow. We checked.</strong>
      </section>
      <HerenciaLockup className="landing-heritage" />
    </main>
  );
}
