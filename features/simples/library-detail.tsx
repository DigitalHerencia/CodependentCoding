import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { LibraryIcon } from '@/components/library-icon';
import { buttonVariants } from '@/components/ui/button';
import {
  getRelatedLibraries,
  getWorksWithLibraries,
  type LibraryItem,
} from '@/lib/libraries';

const digitalHerenciaDesert = '/Digital Herencia Desert BG.jpg';

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
            <ChevronRight aria-hidden="true" className="related-arrow" />
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
    <>
      <main className="library-detail-page">
        <div className="library-detail-main">
          <header className="library-detail-heading">
            <p>{library.category}</p>
            <h1>{library.title}</h1>
            <span>{library.summary}</span>
            <div className="library-detail-actions">
              <Link
                className={buttonVariants({ variant: 'default' })}
                href={library.primaryAction.href}
              >
                {library.primaryAction.label}
                <ArrowRight aria-hidden="true" data-icon="inline-end" />
              </Link>
              <Link
                className={buttonVariants({ variant: 'outline' })}
                href="/docs"
              >
                Read the Docs
                <ArrowRight aria-hidden="true" data-icon="inline-end" />
              </Link>
            </div>
          </header>

          <section className="configuration-panel">
            <div className="configuration-panel-heading">
              <span>
                {library.example ? 'USE IN' : 'STATUS IN'}{' '}
                <b>hipsterstack.json</b>
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
                    {isFixed
                      ? 'Included / Fixed foundation'
                      : 'Product surface'}
                  </strong>
                  <small>
                    {isFixed
                      ? 'No provider selector or decorative toggle. Hipster Stack owns this supported foundation.'
                      : 'Use the canonical Hipster Stack destination for this product surface.'}
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
          <RelatedList title="Related Simples" libraries={related} />
          <RelatedList title="Works With" libraries={worksWith} />
        </aside>
      </main>
      <Image
        className="simples-landscape"
        src={digitalHerenciaDesert}
        alt=""
        aria-hidden="true"
        sizes="100vw"
      />
    </>
  );
}
