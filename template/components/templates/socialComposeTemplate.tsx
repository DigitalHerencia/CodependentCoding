import type { ReactNode } from "react";
export function SocialComposeTemplate({
  children,
  preview,
}: {
  children: ReactNode;
  preview: ReactNode;
}) {
  return (
    <section className="space-y-5 p-5">
      <h1 className="type-title">Compose a social post</h1>
      <div className="grid gap-5 lg:grid-cols-[3fr_2fr]">
        <section className="surface-card p-5">{children}</section>
        <aside className="space-y-4 surface-inset p-5">
          <h2 className="type-label">Post preview</h2>
          {preview}
        </aside>
      </div>
    </section>
  );
}
