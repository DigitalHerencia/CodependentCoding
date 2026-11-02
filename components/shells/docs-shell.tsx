import type { ReactNode } from "react";

export function DocsShell({
  children,
  sidebar,
  toc,
}: {
  children: ReactNode;
  sidebar: ReactNode;
  toc: ReactNode;
}) {
  return (
    <main id="main-content" tabIndex={-1} className="docs-shell">
      <aside id="chapter-search" className="docs-sidebar">
        {sidebar}
      </aside>
      {toc ? (
        <details className="docs-toc-mobile">
          <summary>On this page</summary>
          {toc}
        </details>
      ) : null}
      {children}
      {toc ? <aside className="docs-toc-desktop">{toc}</aside> : null}
    </main>
  );
}
