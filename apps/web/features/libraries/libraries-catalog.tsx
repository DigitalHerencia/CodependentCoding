import Link from 'next/link';
import { LibraryIcon } from '@/components/library-icon';
import { libraries, libraryCategories } from '@/lib/libraries';

export function LibrariesCatalog() {
  return (
    <main className="libraries-page">
      <header className="libraries-heading">
        <h1>Simples™</h1>
        <p>
          <span>An ontological survey of idiolectal semantics.</span>
          <span>Esoteric by design.</span>
          <span>No Ordinary Objects™</span>
        </p>
        <small className="simples-joke">
          If you insist this is a collection of composite objects, the
          mereological nihilists would like a word.
        </small>
      </header>
      <section className="library-columns" aria-label="Hipster Stack Simples">
        {libraryCategories.map((category) => (
          <div className="library-category" key={category}>
            <h2>{category}</h2>
            <div>
              {libraries
                .filter((library) => library.category === category)
                .map((library) => (
                  <Link href={`/libraries/${library.slug}`} key={library.slug}>
                    <LibraryIcon name={library.icon} />
                    <span>
                      <strong>{library.title}</strong>
                      <small>{library.description}</small>
                    </span>
                  </Link>
                ))}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
