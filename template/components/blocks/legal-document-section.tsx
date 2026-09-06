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
    <section className="mx-auto max-w-prose px-6 pb-20 sm:px-10 lg:px-12">
      <p className="mb-10 text-center text-sm text-primary">
        Last updated: <time dateTime="2026-09-04">{updatedAt}</time>
      </p>
      <div className="max-w-prose">{introduction}</div>
      {sections.map((section) => (
        <section id={section.id} key={section.id} className="mt-8">
          <h2 className="mb-5 text-xl font-bold">{section.title}</h2>
          <div className="max-w-prose">{section.content}</div>
        </section>
      ))}
    </section>
  );
}
