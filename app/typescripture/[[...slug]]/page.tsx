import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getTypeScripturePage,
  getTypeScriptureStaticParams,
  renderDocumentation,
  typescriptureBooks,
  typescriptureChapters,
  typescriptureStats,
  type TypeScriptureBookId,
} from '@/lib/docs';

export const dynamicParams = false;

export function generateStaticParams() {
  return getTypeScriptureStaticParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const { slug = [] } = await params;
  if (!slug.length) {
    return {
      title: 'TypeScripture™ Canonical Doctrine',
      description:
        'The paired Book of Knowledge and Book of Implementation for The Codependent Coding Web App Architecture.',
    };
  }
  const page = getTypeScripturePage(slug);
  if (!page) return {};
  return {
    title: `${page.chapter.chapter}. ${page.chapter.title} — ${typescriptureBooks[page.book].label}`,
    description: `${page.chapter.implementation_axis} · ${page.chapter.implementation_term}`,
  };
}

function chapterHref(book: TypeScriptureBookId, chapter: string) {
  return `/typescripture/${book}/${chapter}`;
}

function TypeScriptureNavigation({
  activeBook,
  activeChapter,
}: {
  activeBook?: TypeScriptureBookId;
  activeChapter?: string;
}) {
  const book = activeBook ?? 'knowledge';

  return (
    <aside className="docs-navigation">
      <Link className="docs-mark" href="/typescripture">
        <span>The</span>
        <strong>TypeScripture™</strong>
        <small>Canonical Doctrine</small>
      </Link>
      <div className="docs-book-switch" aria-label="TypeScripture books">
        {(Object.keys(typescriptureBooks) as TypeScriptureBookId[]).map(
          (bookId) => (
            <Link
              data-active={bookId === book}
              href={chapterHref(bookId, activeChapter ?? '01')}
              key={bookId}
            >
              {typescriptureBooks[bookId].shortLabel}
            </Link>
          ),
        )}
      </div>
      <nav aria-label={`${typescriptureBooks[book].label} chapters`}>
        {typescriptureChapters.map((chapter) => (
          <Link
            data-active={chapter.chapter === activeChapter}
            href={chapterHref(book, chapter.chapter)}
            key={chapter.chapter}
          >
            <span>{chapter.chapter}</span>
            {chapter.title}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

function TypeScriptureOverview() {
  return (
    <main className="docs-shell docs-overview">
      <TypeScriptureNavigation />
      <article className="docs-content">
        <header className="docs-hero">
          <p>The canonical documentation authority</p>
          <h1>The TypeScripture™ Canonical Doctrine</h1>
          <span>
            Two paired books preserve one traceable movement from meaning to
            concrete software realization.
          </span>
          <dl>
            <div>
              <dt>{typescriptureStats.books}</dt>
              <dd>paired books</dd>
            </div>
            <div>
              <dt>{typescriptureStats.pairedChapters}</dt>
              <dd>chapter pairs</dd>
            </div>
            <div>
              <dt>{typescriptureStats.sourceFiles}</dt>
              <dd>canonical sources</dd>
            </div>
          </dl>
        </header>

        <section className="docs-book-cards" aria-label="TypeScripture books">
          {(Object.keys(typescriptureBooks) as TypeScriptureBookId[]).map(
            (bookId) => {
              const book = typescriptureBooks[bookId];
              return (
                <Link href={chapterHref(bookId, '01')} key={bookId}>
                  <small>{book.shortLabel}</small>
                  <h2>{book.label}</h2>
                  <p>{book.description}</p>
                  <strong>Read chapter 01 →</strong>
                </Link>
              );
            },
          )}
        </section>

        <section className="docs-pair-map" aria-labelledby="pair-map-title">
          <div>
            <p>One-to-one reification map</p>
            <h2 id="pair-map-title">Twenty-four traceable chapter pairs</h2>
          </div>
          <ol>
            {typescriptureChapters.map((chapter) => (
              <li key={chapter.chapter}>
                <span>{chapter.chapter}</span>
                <div>
                  <strong>{chapter.title}</strong>
                  <small>
                    {chapter.implementation_axis} ·{' '}
                    {chapter.implementation_term}
                  </small>
                </div>
                <Link href={chapterHref('knowledge', chapter.chapter)}>K</Link>
                <Link href={chapterHref('implementation', chapter.chapter)}>
                  I
                </Link>
              </li>
            ))}
          </ol>
        </section>
      </article>
    </main>
  );
}

export default async function DocumentationPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug = [] } = await params;
  if (!slug.length) return <TypeScriptureOverview />;

  const page = getTypeScripturePage(slug);
  if (!page) notFound();

  const chapterIndex = typescriptureChapters.findIndex(
    ({ chapter }) => chapter === page.chapter.chapter,
  );
  const previous = typescriptureChapters[chapterIndex - 1];
  const next = typescriptureChapters[chapterIndex + 1];
  const pairedBook: TypeScriptureBookId =
    page.book === 'knowledge' ? 'implementation' : 'knowledge';

  return (
    <main className="docs-shell">
      <TypeScriptureNavigation
        activeBook={page.book}
        activeChapter={page.chapter.chapter}
      />
      <article className="docs-content">
        <header className="docs-chapter-header">
          <p>
            {typescriptureBooks[page.book].label} · Chapter{' '}
            {page.chapter.chapter}
          </p>
          <div>
            <span>
              {page.chapter.implementation_axis} ·{' '}
              {page.chapter.implementation_term}
            </span>
            <Link href={chapterHref(pairedBook, page.chapter.chapter)}>
              Open paired {typescriptureBooks[pairedBook].shortLabel} chapter →
            </Link>
          </div>
          <small title={page.sourcePath}>
            Rendered from canonical authority
          </small>
        </header>

        <div className="docs-prose">{renderDocumentation(page.source)}</div>

        <nav
          className="docs-chapter-pagination"
          aria-label="Chapter pagination"
        >
          {previous ? (
            <Link href={chapterHref(page.book, previous.chapter)}>
              <small>Previous</small>
              <span>
                {previous.chapter}. {previous.title}
              </span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link href={chapterHref(page.book, next.chapter)}>
              <small>Next</small>
              <span>
                {next.chapter}. {next.title}
              </span>
            </Link>
          ) : (
            <Link href="/typescripture">
              <small>Complete</small>
              <span>Return to the paired map</span>
            </Link>
          )}
        </nav>
      </article>
    </main>
  );
}
