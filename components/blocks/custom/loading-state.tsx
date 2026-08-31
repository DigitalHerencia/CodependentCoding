export function LoadingState() {
  return (
    <main className="loading-state" aria-live="polite">
      <span className="loading-mark" aria-hidden="true" />
      <p>Resolving public architecture…</p>
    </main>
  );
}
