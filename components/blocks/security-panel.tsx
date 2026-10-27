import { securityCopy } from "@/lib/constants/siteCopy";

export function SecurityPanel() {
  return (
    <aside className="site-rise mx-auto mb-10 max-w-5xl border border-signal-border bg-background-strong px-6 py-8">
      <p className="m-0 text-xs tracking-[0.3em] text-signal uppercase">
        {securityCopy.kicker}
      </p>
      <p className="m-0 mt-2 font-heritage text-4xl leading-none uppercase sm:text-5xl">
        {securityCopy.title}
      </p>
      {securityCopy.lines.map((line) => (
        <p className="mb-0 text-sm text-foreground-muted" key={line}>
          {line}
        </p>
      ))}
    </aside>
  );
}
