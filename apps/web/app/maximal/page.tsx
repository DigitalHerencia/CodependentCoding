import { maximalSnapshot } from '@/lib/maximal';

export default async function MaximalPage() {
  const snapshot = await maximalSnapshot();
  return <main className="maximal-page"><p className="surface-eyebrow">The</p><h1>Maximal Template™</h1><p className="maximal-subtitle">One authoritative runnable source superset</p><section className="maximal-explorer"><aside><strong>File Explorer</strong><code>{snapshot.root}</code>{snapshot.entries.map((entry) => <span key={entry}>◈ {entry}</span>)}</aside><article><header><strong>{snapshot.source}README.md</strong><span>Source-backed preview</span></header><pre>{snapshot.preview}</pre></article></section></main>;
}
