import { PageHero } from "@/components/blocks/page-hero";
import { type LegalDocument as LegalDocumentCopy } from "@/lib/constants/siteCopy";

type LegalDocumentProps = {
  copy: LegalDocumentCopy;
  preface?: React.ReactNode;
};

export function LegalDocument({ copy, preface }: LegalDocumentProps) {
  return (
    <main className="pb-16">
      <PageHero
        kicker={copy.kicker}
        title={copy.title}
        subtitle={copy.subtitle}
      />
      {preface}
      <div className="site-rise mx-auto grid max-w-5xl gap-10 px-4 md:grid-cols-[14rem_1fr]">
        <nav
          aria-label="On this page"
          className="hidden self-start border-l border-signal-border pl-4 text-xs md:sticky md:top-6 md:block"
        >
          <p className="mt-0 tracking-[0.2em] text-signal uppercase">
            On this page
          </p>
          <ol className="m-0 list-none space-y-2 p-0">
            {copy.sections.map((section) => (
              <li key={section.id}>
                <a
                  className="text-foreground-muted no-underline hover:text-signal"
                  href={`#${section.id}`}
                >
                  {section.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <article className="text-sm leading-relaxed">
          <p className="mt-0 text-xs text-foreground-muted uppercase">
            Last updated:{" "}
            <time dateTime={copy.updatedAtDateTime}>{copy.updatedAt}</time>
          </p>
          <p>{copy.introduction}</p>
          {copy.sections.map((section) => (
            <section className="scroll-mt-6" id={section.id} key={section.id}>
              <h2 className="mt-8 mb-2 text-base">{section.title}</h2>
              {section.paragraphs.map((paragraph) => (
                <p className="my-2 text-foreground-muted" key={paragraph}>
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </article>
      </div>
    </main>
  );
}
