import type { ReactNode } from "react";

export interface LegalDocumentSectionProps {
  updatedAt: string;
  introduction: ReactNode;
  sections: readonly { id: string; title: string; content: ReactNode }[];
}

export function LegalDocumentSection({
  updatedAt,
  introduction,
  sections,
}: LegalDocumentSectionProps) {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-20 sm:px-10 lg:px-12">
      <p className="mb-10 text-center text-sm text-muted">
        Last updated: <time dateTime="2026-09-04">{updatedAt}</time>
      </p>
      <div className="grid items-start gap-8 lg:grid-cols-[16rem_minmax(0,1fr)]">
        <nav
          aria-label="On this page"
          className="border border-muted/50 bg-background p-5 lg:sticky lg:top-28"
        >
          <p className="mb-4 text-sm font-bold uppercase tracking-wider">
            On this page
          </p>
          <ol className="space-y-2 text-sm">
            {sections.map((section) => (
              <li key={section.id}>
                <a
                  className="block px-2 py-1 text-muted hover:bg-primary hover:text-foreground focus-visible:outline-2 focus-visible:outline-foreground"
                  href={`#${section.id}`}
                >
                  {section.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <article className="min-w-0 border border-muted/50 bg-background p-6 leading-7 sm:p-10 [&_p]:my-4 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:pl-1 [&_h3]:mt-8 [&_h3]:font-bold [&_a]:underline">
          <div className="max-w-prose">{introduction}</div>
          {sections.map((section) => (
            <section
              id={section.id}
              key={section.id}
              className="mt-8 scroll-mt-28 border-t border-primary pt-8"
            >
              <h2 className="mb-5 text-xl font-bold">{section.title}</h2>
              <div className="max-w-prose">{section.content}</div>
            </section>
          ))}
        </article>
      </div>
    </section>
  );
}
