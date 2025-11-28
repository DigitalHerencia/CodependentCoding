import Link from 'next/link';

interface DocPageProps {
  title: string;
  description?: string;
  breadcrumbs?: { label: string; href: string }[];
  prevPage?: { label: string; href: string };
  nextPage?: { label: string; href: string };
  children: React.ReactNode;
}

export function DocPage({
  title,
  description,
  breadcrumbs,
  prevPage,
  nextPage,
  children,
}: DocPageProps) {
  return (
    <div className="space-y-8">
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-2 text-[11px] text-muted-foreground">
          <Link href="/docs" className="hover:text-white">
            Docs
          </Link>
          {breadcrumbs.map((crumb, i) => (
            <span key={crumb.href} className="flex items-center gap-2">
              <span className="text-white/30">/</span>
              {i === breadcrumbs.length - 1 ? (
                <span className="text-white">{crumb.label}</span>
              ) : (
                <Link href={crumb.href} className="hover:text-white">
                  {crumb.label}
                </Link>
              )}
            </span>
          ))}
        </nav>
      )}

      {/* Header */}
      <header className="border-b border-white/10 pb-6">
        <h1 className="font-display text-3xl tracking-tight text-white sm:text-4xl">{title}</h1>
        {description && <p className="mt-3 text-muted-foreground">{description}</p>}
      </header>

      {/* Content */}
      <div className="prose prose-invert prose-sm max-w-none md:prose-base prose-headings:font-display prose-headings:tracking-tight prose-a:text-pink-300 prose-a:no-underline hover:prose-a:underline prose-code:rounded prose-code:bg-white/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-cyan-300 prose-code:before:content-none prose-code:after:content-none prose-pre:border prose-pre:border-white/10 prose-pre:bg-black/50">
        {children}
      </div>

      {/* Navigation */}
      <nav className="flex items-center justify-between border-t border-white/10 pt-6">
        {prevPage ? (
          <Link
            href={prevPage.href}
            className="group flex items-center gap-2 text-sm text-muted-foreground transition hover:text-white"
          >
            <svg
              className="size-4 transition group-hover:-translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span>{prevPage.label}</span>
          </Link>
        ) : (
          <div />
        )}
        {nextPage ? (
          <Link
            href={nextPage.href}
            className="group flex items-center gap-2 text-sm text-muted-foreground transition hover:text-white"
          >
            <span>{nextPage.label}</span>
            <svg
              className="size-4 transition group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        ) : (
          <div />
        )}
      </nav>
    </div>
  );
}

interface CodeBlockProps {
  title?: string;
  language?: string;
  children: React.ReactNode;
}

export function CodeBlock({ title, language = 'bash', children }: CodeBlockProps) {
  return (
    <div className="not-prose my-6 overflow-hidden rounded-xl border border-white/10">
      {title && (
        <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-4 py-2 text-xs">
          <span className="text-muted-foreground">{title}</span>
          <span className="text-[10px] uppercase tracking-wider text-pink-300">{language}</span>
        </div>
      )}
      <pre className="overflow-x-auto bg-black/50 p-4 text-xs">
        <code className="text-cyan-300">{children}</code>
      </pre>
    </div>
  );
}

interface CalloutProps {
  type?: 'info' | 'warning' | 'tip' | 'danger';
  title?: string;
  children: React.ReactNode;
}

const calloutStyles = {
  info: {
    border: 'border-cyan-500/40',
    bg: 'bg-cyan-500/10',
    icon: '💡',
    titleColor: 'text-cyan-300',
  },
  warning: {
    border: 'border-amber-500/40',
    bg: 'bg-amber-500/10',
    icon: '⚠️',
    titleColor: 'text-amber-300',
  },
  tip: {
    border: 'border-emerald-500/40',
    bg: 'bg-emerald-500/10',
    icon: '✨',
    titleColor: 'text-emerald-300',
  },
  danger: {
    border: 'border-red-500/40',
    bg: 'bg-red-500/10',
    icon: '🚨',
    titleColor: 'text-red-300',
  },
};

export function Callout({ type = 'info', title, children }: CalloutProps) {
  const styles = calloutStyles[type];
  return (
    <div className={`not-prose my-6 rounded-xl border ${styles.border} ${styles.bg} p-4`}>
      <div className="flex items-start gap-3">
        <span className="text-lg">{styles.icon}</span>
        <div>
          {title && <p className={`mb-1 text-sm font-semibold ${styles.titleColor}`}>{title}</p>}
          <div className="text-sm text-muted-foreground">{children}</div>
        </div>
      </div>
    </div>
  );
}

interface FeatureCardProps {
  title: string;
  description: string;
  icon?: string;
}

export function FeatureCard({ title, description, icon = '▸' }: FeatureCardProps) {
  return (
    <div className="not-prose rounded-xl border border-white/10 bg-black/30 p-4 transition hover:border-pink-500/40">
      <div className="flex items-center gap-2">
        <span className="text-pink-400">{icon}</span>
        <h3 className="font-display text-base text-white">{title}</h3>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">{description}</p>
    </div>
  );
}

export function CommandTable({ commands }: { commands: { cmd: string; desc: string }[] }) {
  return (
    <div className="not-prose my-6 overflow-hidden rounded-xl border border-white/10">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/10 bg-white/5">
            <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Command
            </th>
            <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Description
            </th>
          </tr>
        </thead>
        <tbody>
          {commands.map((row) => (
            <tr key={row.cmd} className="border-b border-white/5 last:border-0">
              <td className="px-4 py-2 font-mono text-xs text-cyan-300">{row.cmd}</td>
              <td className="px-4 py-2 text-muted-foreground">{row.desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
