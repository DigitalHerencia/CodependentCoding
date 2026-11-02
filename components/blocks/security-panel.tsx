import { securityCopy } from "@/content/security";

export function SecurityPanel() {
  return (
    <aside className="site-rise mx-auto mb-10 max-w-5xl border border-border bg-background-strong px-6 py-8">
      <p className="m-0 text-xs tracking-[0.3em] text-signal-text uppercase">
        {securityCopy.kicker}
      </p>
      <p className="m-0 mt-2 font-heading text-4xl leading-none uppercase sm:text-5xl">
        {securityCopy.title}
      </p>
      {securityCopy.lines.map((line) => (
        <p className="mb-0 text-sm text-muted-foreground" key={line}>
          {line}
        </p>
      ))}
    </aside>
  );
}
