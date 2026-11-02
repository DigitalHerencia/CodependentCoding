import { CodependentMark } from "@/components/brand/codependent-mark";
import { CodependentWordmark } from "@/components/brand/codependent-wordmark";
import { HerenciaLockup } from "@/components/brand/herencia-lockup";
import Link from "next/link";
import { landingCopy as copy } from "@/content/public";

type LandingStats = Record<"rules" | "modules" | "commands" | "skills", number>;

export function LandingHero({ stats }: { stats: LandingStats }) {
  return (
    <main id="main-content" tabIndex={-1} className="landing-page">
      <section className="landing-intro" aria-labelledby="landing-title">
        <div className="landing-copy">
          <p className="landing-eyebrow">{copy.eyebrow}</p>
          <h1 id="landing-title">
            {copy.title[0]}
            <br />
            <span>{copy.title[1]}</span>
          </h1>
          <p className="landing-description">{copy.description}</p>
          <div className="landing-actions">
            <Link className="brand-button" href="/doctrine">
              {copy.primaryAction}
            </Link>
            <Link className="brand-button landing-secondary" href="/maximal">
              {copy.secondaryAction}
            </Link>
          </div>
          <a
            className="landing-repo"
            href="https://github.com/DigitalHerencia/CodependentCoding"
          >
            GitHub <span aria-hidden="true">↗</span>
          </a>
          <strong>{copy.signoff}</strong>
        </div>
        <div className="landing-crown">
          <CodependentMark className="brand-crown" />
          <CodependentWordmark />
        </div>
      </section>
      <section
        className="landing-section landing-doctrine"
        aria-labelledby="landing-architecture-title"
      >
        <p className="landing-eyebrow">{copy.architectureLabel}</p>
        <h2 id="landing-architecture-title">{copy.architectureTitle}</h2>
        <p className="landing-sentence">
          {copy.clauses.map((clause) => (
            <Link
              key={clause}
              href="/doctrine/architecture/template-layer-model"
            >
              {clause}{" "}
            </Link>
          ))}
        </p>
      </section>
      <section
        className="landing-section"
        aria-labelledby="landing-parts-title"
      >
        <p className="landing-eyebrow">{copy.partsLabel}</p>
        <h2 id="landing-parts-title">{copy.partsTitle}</h2>
        <div className="landing-parts">
          {copy.parts.map((part, index) => (
            <Link className="landing-part" key={part.href} href={part.href}>
              <span className="landing-part-index" aria-hidden="true">
                0{index + 1}
              </span>
              <h3>{part.title}</h3>
              <p>{part.description}</p>
              <span className="landing-metric">
                <b>{stats[part.metric]}</b> {part.unit}
              </span>
              <span className="landing-part-action">
                {part.action} <span aria-hidden="true">↗</span>
              </span>
            </Link>
          ))}
        </div>
      </section>
      <section
        className="landing-section"
        aria-labelledby="landing-proof-title"
      >
        <p className="landing-eyebrow">{copy.proofLabel}</p>
        <h2 id="landing-proof-title">{copy.proofTitle}</h2>
        <div className="landing-proofs">
          {copy.proofs.map((proof) => (
            <a key={proof.href} href={proof.href}>
              <h3>
                {proof.title} <span aria-hidden="true">↗</span>
              </h3>
              <p>{proof.description}</p>
            </a>
          ))}
        </div>
      </section>
      <section
        className="landing-heritage-section"
        aria-label={copy.heritageLabel}
      >
        <HerenciaLockup className="landing-heritage" />
        <p>{copy.heritageDescription}</p>
      </section>
    </main>
  );
}
