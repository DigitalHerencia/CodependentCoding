import Link from 'next/link';
import { LibraryIcon } from '@/components/library-icon';
import { libraries, libraryCategories } from '@/lib/libraries';

export function LibrariesCatalog() {
  return (
    <main className="libraries-page">
      <header className="libraries-heading">
        <h1>Libraries</h1>
        <p>Composable product building blocks for the Loaded Vibes system.</p>
      </header>
      <section className="library-columns" aria-label="Loaded Vibes libraries">
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
