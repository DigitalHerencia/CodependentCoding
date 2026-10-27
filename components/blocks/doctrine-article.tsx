import Link from "next/link";
import type { ReactNode } from "react";
import type { DoctrineDoc } from "@/types/doctrineTypes";

type DoctrineArticleProps = { doc: DoctrineDoc; sidebar: ReactNode };

function docHref(slug: string) {
  return (slug ? `/doctrine/${slug}` : "/doctrine") as `/doctrine/${string}`;
}

export function DoctrineArticle({ doc, sidebar }: DoctrineArticleProps) {
  const toc = doc.headings.filter((heading) => heading.depth <= 3);
  return (
    <main className="mx-auto grid max-w-7xl gap-8 px-4 py-10 lg:grid-cols-[15rem_minmax(0,1fr)_13rem]">
      <aside className="max-h-72 overflow-y-auto border-b border-signal-border pb-4 lg:sticky lg:top-6 lg:max-h-[calc(100vh-3rem)] lg:self-start lg:overflow-y-auto lg:border-0 lg:pb-0">
        {sidebar}
      </aside>
      <article className="site-rise min-w-0">
        <p className="m-0 text-xs tracking-[0.3em] text-signal uppercase">
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
          className="mt-12 grid gap-4 border-t border-signal-border pt-6 text-xs sm:grid-cols-2"
        >
          {doc.previous ? (
            <Link
              className="block border border-signal-border p-4 no-underline hover:border-signal"
              href={docHref(doc.previous.slug)}
            >
              <span className="block text-foreground-muted">← Previous</span>
              <span className="text-foreground">{doc.previous.title}</span>
            </Link>
          ) : (
            <span />
          )}
          {doc.next ? (
            <Link
              className="block border border-signal-border p-4 text-right no-underline hover:border-signal"
              href={docHref(doc.next.slug)}
            >
              <span className="block text-foreground-muted">Next →</span>
              <span className="text-foreground">{doc.next.title}</span>
            </Link>
          ) : null}
        </nav>
      </article>
      {toc.length > 0 ? (
        <nav
          aria-label="On this page"
          className="hidden text-xs lg:sticky lg:top-6 lg:block lg:self-start"
        >
          <p className="mt-0 tracking-[0.2em] text-signal uppercase">
            On this page
          </p>
          <ul className="m-0 list-none space-y-2 p-0">
            {toc.map((heading) => (
              <li
                className={heading.depth === 3 ? "pl-3" : undefined}
                key={heading.id}
              >
                <a
                  className="text-foreground-muted no-underline hover:text-signal"
                  href={`#${heading.id}`}
                >
                  {heading.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </main>
  );
}
