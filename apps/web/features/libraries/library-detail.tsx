import Link from 'next/link';
import { LibraryIcon } from '@/components/library-icon';
import {
  getRelatedLibraries,
  getWorksWithLibraries,
  type LibraryItem,
} from '@/lib/libraries';

function RelatedList({
  title,
  libraries,
}: {
  title: string;
  libraries: LibraryItem[];
}) {
  return (
    <section className="related-panel">
      <h2>{title}</h2>
      <div>
        {libraries.map((library) => (
          <Link href={`/libraries/${library.slug}`} key={library.slug}>
            <LibraryIcon name={library.icon} />
            <span>
              <strong>{library.title}</strong>
              <small>{library.description}</small>
            </span>
            <b>›</b>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function LibraryDetail({ library }: { library: LibraryItem }) {
  const related = getRelatedLibraries(library);
  const worksWith = getWorksWithLibraries(library);
  const isFixed = library.status === 'Fixed foundation';

  return (
    <main className="library-detail-page">
      <div className="library-detail-main">
        <header className="library-detail-heading">
          <p>{library.category}</p>
          <h1>{library.title}</h1>
          <span>{library.summary}</span>
          <div className="library-detail-actions">
            <Link className="button primary" href={library.primaryAction.href}>
              {library.primaryAction.label} <b>→</b>
            </Link>
            <Link className="button" href="/docs">
              Read the Docs <b>→</b>
            </Link>
          </div>
        </header>

        <section className="configuration-panel">
          <div className="configuration-panel-heading">
            <span>
              {library.example ? 'USE IN' : 'STATUS IN'} <b>loadedvibes.json</b>
            </span>
            <strong>{library.status}</strong>
          </div>
          {library.example ? (
            <pre>{library.example}</pre>
          ) : (
            <div className="fixed-status">
              <LibraryIcon name={library.icon} />
              <span>
                <strong>
                  {isFixed ? 'Included / Fixed foundation' : 'Product surface'}
                </strong>
                <small>
                  {isFixed
                    ? 'No provider selector or decorative toggle. Loaded Vibes owns this supported foundation.'
                    : 'Use the canonical Loaded Vibes destination for this product surface.'}
                </small>
              </span>
            </div>
          )}
        </section>

        <section
          className="library-highlights"
          aria-label={`${library.title} highlights`}
        >
          {library.highlights.map((highlight, index) => (
            <article key={highlight.title}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <div>
                <strong>{highlight.title}</strong>
                <small>{highlight.description}</small>
              </div>
            </article>
          ))}
        </section>
      </div>

      <aside className="library-detail-sidebar">
        <RelatedList title="Related Libraries" libraries={related} />
        <RelatedList title="Works With" libraries={worksWith} />
      </aside>
    </main>
  );
}
