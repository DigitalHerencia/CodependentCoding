import Link from "next/link";
import type { ReactNode } from "react";
import type { DoctrineDoc } from "@/types/doctrineTypes";
import { DocsShell } from "@/components/shells/docs-shell";

type DoctrineArticleProps = { doc: DoctrineDoc; sidebar: ReactNode };

function docHref(slug: string) {
  return (slug ? `/doctrine/${slug}` : "/doctrine") as `/doctrine/${string}`;
}

export function DoctrineArticle({ doc, sidebar }: DoctrineArticleProps) {
  const toc = doc.headings.filter((heading) => heading.depth <= 3);
  const tableOfContents =
    toc.length > 0 ? (
      <nav aria-label="On this page" className="text-xs">
        <ul className="m-0 list-none space-y-2 p-0">
          {toc.map((heading) => (
            <li
              className={heading.depth === 3 ? "pl-3" : undefined}
              key={heading.id}
            >
              <a
                className="text-muted-foreground no-underline hover:text-signal-text"
                href={`#${heading.id}`}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    ) : null;
  return (
    <DocsShell sidebar={sidebar} toc={tableOfContents}>
      <article className="site-rise min-w-0">
        <p className="m-0 text-xs tracking-[0.3em] text-signal-text uppercase">
          {doc.group}
        </p>
        <h1 className="mt-2 mb-6 text-3xl leading-tight sm:text-4xl">
          {doc.title}
        </h1>
        <div
          className="doctrine-prose"
          dangerouslySetInnerHTML={{ __html: doc.html }}
        />
        <nav
          aria-label="Previous and next"
          className="mt-12 grid gap-4 border-t border-border pt-6 text-xs sm:grid-cols-2"
        >
          {doc.previous ? (
            <Link
              className="block border border-border p-4 no-underline hover:border-signal"
              href={docHref(doc.previous.slug)}
            >
              <span className="block text-muted-foreground">← Previous</span>
              <span className="text-foreground">{doc.previous.title}</span>
            </Link>
          ) : (
            <span />
          )}
          {doc.next ? (
            <Link
              className="block border border-border p-4 text-right no-underline hover:border-signal"
              href={docHref(doc.next.slug)}
            >
              <span className="block text-muted-foreground">Next →</span>
              <span className="text-foreground">{doc.next.title}</span>
            </Link>
          ) : null}
        </nav>
      </article>
    </DocsShell>
  );
}
