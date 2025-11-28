import { ReactNode } from 'react';
import Link from 'next/link';

const navigation = [
  {
    title: 'Getting Started',
    items: [
      { href: '/docs', label: 'Introduction' },
      { href: '/docs/getting-started/installation', label: 'Installation' },
      { href: '/docs/getting-started/quickstart', label: 'Quick Start' },
      { href: '/docs/getting-started/project-structure', label: 'Project Structure' },
    ],
  },
  {
    title: 'Core Concepts',
    items: [
      { href: '/docs/concepts/architecture', label: 'Architecture' },
      { href: '/docs/concepts/devcycles', label: 'DevCycles' },
      { href: '/docs/concepts/spec-driven-workflow', label: 'Spec-Driven Workflow' },
      { href: '/docs/concepts/artifacts', label: 'Artifacts' },
    ],
  },
  {
    title: 'Reference',
    items: [
      { href: '/docs/reference/cli', label: 'CLI Commands' },
      { href: '/docs/reference/configuration', label: 'Configuration' },
    ],
  },
  {
    title: 'Guides',
    items: [
      { href: '/docs/guides/running-devcycles', label: 'Running DevCycles' },
      { href: '/docs/guides/customization', label: 'Customization' },
      { href: '/docs/guides/upgrade-strategy', label: 'Upgrade Strategy' },
      { href: '/docs/guides/troubleshooting', label: 'Troubleshooting' },
    ],
  },
];

function DocsHeader() {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between gap-4 border-b border-white/10 bg-background/80 px-6 py-4 backdrop-blur-lg">
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-3 transition hover:opacity-80">
          <span className="relative flex size-9 items-center justify-center rounded-xl bg-black/60 ring-1 ring-pink-500/60">
            <span className="absolute inset-0 rounded-xl bg-linear-to-tr from-pink-500/70 via-purple-500/40 to-cyan-400/70 opacity-60 blur-md" />
            <span className="relative text-xs font-black tracking-[0.18em] text-white">LV</span>
          </span>
          <div className="leading-tight">
            <p className="font-display text-sm font-semibold tracking-[0.18em] text-white">
              LOADED VIBES
            </p>
            <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              documentation
            </p>
          </div>
        </Link>
      </div>

      <nav className="hidden items-center gap-6 text-xs font-medium text-muted-foreground sm:flex">
        <Link href="/docs" className="hover:text-white">
          Docs
        </Link>
        <Link href="/docs/reference/cli" className="hover:text-white">
          CLI
        </Link>
        <a
          href="https://github.com/your-org/loaded-vibes"
          className="hover:text-white"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
      </nav>
    </header>
  );
}

function Sidebar() {
  return (
    <aside className="sticky top-[73px] hidden h-[calc(100vh-73px)] w-64 shrink-0 overflow-y-auto border-r border-white/10 bg-black/20 py-6 lg:block">
      <nav className="space-y-6 px-4">
        {navigation.map((section) => (
          <div key={section.title}>
            <h4 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              {section.title}
            </h4>
            <ul className="space-y-1">
              {section.items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition hover:bg-white/5 hover:text-white"
                  >
                    <span className="size-1 rounded-full bg-pink-500/50 opacity-0 transition group-hover:opacity-100" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* Decorative element */}
      <div className="mt-8 border-t border-white/10 px-4 pt-6">
        <div className="rounded-xl border border-white/10 bg-linear-to-br from-pink-500/10 via-transparent to-cyan-500/10 p-4">
          <p className="text-[10px] uppercase tracking-[0.2em] text-pink-300">Pro tip</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Use <code className="rounded bg-white/10 px-1.5 py-0.5 text-cyan-300">lv hint</code> in
            your terminal for contextual help.
          </p>
        </div>
      </div>
    </aside>
  );
}

function MobileNav() {
  return (
    <div className="sticky top-[73px] z-40 border-b border-white/10 bg-background/90 px-4 py-3 backdrop-blur lg:hidden">
      <details className="group">
        <summary className="flex cursor-pointer list-none items-center gap-2 text-sm text-muted-foreground">
          <svg
            className="size-4 transition group-open:rotate-90"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          Navigation
        </summary>
        <nav className="mt-4 space-y-4 pb-4">
          {navigation.map((section) => (
            <div key={section.title}>
              <h4 className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                {section.title}
              </h4>
              <ul className="space-y-1 pl-2">
                {section.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="block rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition hover:bg-white/5 hover:text-white"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </details>
    </div>
  );
}

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen bg-grid">
      {/* Glow blobs */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -left-32 top-0 size-80 rounded-full bg-pink-500/20 blur-3xl" />
        <div className="absolute -right-24 bottom-0 size-96 rounded-full bg-cyan-500/15 blur-3xl" />
      </div>

      {/* Noise overlay */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[url('/noise.png')] opacity-[0.05] mix-blend-soft-light" />

      <DocsHeader />
      <MobileNav />

      <div className="mx-auto flex max-w-7xl">
        <Sidebar />
        <main className="min-w-0 flex-1 px-6 py-10 lg:px-12">
          <article className="prose prose-invert prose-sm max-w-none md:prose-base prose-headings:font-display prose-headings:tracking-tight prose-a:text-pink-300 prose-a:no-underline hover:prose-a:underline prose-code:rounded prose-code:bg-white/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-cyan-300 prose-code:before:content-none prose-code:after:content-none prose-pre:border prose-pre:border-white/10 prose-pre:bg-black/50">
            {children}
          </article>
        </main>
      </div>
    </div>
  );
}
