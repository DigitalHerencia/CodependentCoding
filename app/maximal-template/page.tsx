import Image from 'next/image';
import { MaximalBrowser } from '@/components/blocks/custom/maximal-browser';
import { maximalTree, readMaximalSource } from '@/lib/maximal';

export default async function MaximalPage() {
  const tree = await maximalTree();
  const initialPath = 'README.md';
  const initialSource = await readMaximalSource(initialPath);
  return (
    <main className="maximal-page">
      <Image
        src="/Maximal Template Logo.jpg"
        alt="Maximal Template"
        width={1200}
        height={350}
      />
      <p className="eyebrow">One authoritative runnable source superset</p>
      <h1>Inspect the real implementation.</h1>
      <p>
        The source browser is bounded to repository-owned files under{' '}
        <code>template/</code>. The Maximal application itself remains
        unchanged.
      </p>
      <MaximalBrowser
        tree={tree}
        initialPath={initialPath}
        initialSource={initialSource}
      />
    </main>
  );
}
