import { notFound } from 'next/navigation';
import { LibraryDetail } from '@/features/libraries/library-detail';
import { getLibrary, libraries } from '@/lib/libraries';

export function generateStaticParams() {
  return libraries.map((library) => ({ slug: library.slug }));
}

export default async function LibraryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const library = getLibrary(slug);
  if (!library) notFound();

  return <LibraryDetail library={library} />;
}
