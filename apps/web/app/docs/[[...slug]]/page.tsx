import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  documentation,
  readDocumentation,
  renderDocumentation,
} from '@/lib/docs';

export function generateStaticParams() {
  return documentation.map((entry) => ({ slug: [...entry.slug] }));
}

export default async function DocumentationPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug = [] } = await params;
  const source = readDocumentation(slug);
  if (!source) notFound();

  return (
    <main className="shell docs-shell">
      <aside className="docs-navigation">
        <span>Documentation</span>
        {documentation.map((entry) => {
          const href = `/docs${entry.slug.length ? `/${entry.slug.join('/')}` : ''}`;
          return (
            <Link
              data-active={entry.slug.join('/') === slug.join('/')}
              href={href}
              key={href}
            >
              {entry.title}
            </Link>
          );
        })}
      </aside>
      <article className="docs-content">{renderDocumentation(source)}</article>
    </main>
  );
}
