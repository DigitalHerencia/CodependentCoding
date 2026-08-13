import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import digitalHerenciaBanner from '../../../../public/Digital Herencia Banner.png';
import hipsterStackCrown from '../../../../public/Hipster Stack Crown.webp';

type IconName =
  | 'builder'
  | 'libraries'
  | 'docs'
  | 'foundation'
  | 'identity'
  | 'data'
  | 'revenue'
  | 'interface';

const productEntries = [
  {
    title: 'Constituter™',
    description:
      'Arrange the supported application system and export a reproducible constitution.',
    href: '/configure',
    icon: 'builder' as const,
  },
  {
    title: 'Simples™',
    description:
      'An ontological survey of the things we refuse to call composable objects.',
    href: '/libraries',
    icon: 'libraries' as const,
  },
  {
    title: 'Docs',
    description: 'Canonical guidance for using the generator and its output.',
    href: '/docs',
    icon: 'docs' as const,
  },
];

const foundations = [
  ['Foundation', 'Next.js, TypeScript, pnpm', 'foundation'],
  ['Identity', 'Auth, users, roles, capabilities', 'identity'],
  ['Data', 'Postgres, Prisma, tenant containment', 'data'],
  ['Revenue', 'Payments, subscriptions, platform economics', 'revenue'],
  ['Interface', 'UI components, blocks, docs', 'interface'],
] as const;

function ProductIcon({ name }: { name: IconName }) {
  const paths: Record<IconName, React.ReactNode> = {
    builder: (
      <>
        <path d="M12 3v3M12 18v3M3 12h3M18 12h3" />
        <circle cx="12" cy="12" r="5" />
        <path d="m8.5 8.5 7 7M15.5 8.5l-7 7" />
      </>
    ),
    libraries: (
      <>
        <path d="m12 3 8 4.5-8 4.5-8-4.5L12 3Z" />
        <path d="m4 12 8 4.5 8-4.5M4 16.5l8 4.5 8-4.5" />
      </>
    ),
    docs: (
      <>
        <path d="M4 5.5A3.5 3.5 0 0 1 7.5 2H12v18H7.5A3.5 3.5 0 0 0 4 23.5v-18Z" />
        <path d="M20 5.5A3.5 3.5 0 0 0 16.5 2H12v18h4.5a3.5 3.5 0 0 1 3.5 3.5v-18Z" />
      </>
    ),
    foundation: (
      <>
        <rect x="4" y="5" width="16" height="15" />
        <path d="M8 5V2M16 5V2M8 9h2M14 9h2M8 13h2M14 13h2M8 17h8" />
      </>
    ),
    identity: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 22a8 8 0 0 1 16 0" />
      </>
    ),
    data: (
      <>
        <ellipse cx="12" cy="5" rx="8" ry="3" />
        <path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" />
      </>
    ),
    revenue: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M15.5 8.5c-.7-1-1.9-1.5-3.5-1.5-2 0-3.5 1-3.5 2.5 0 3.5 7 1.5 7 5 0 1.5-1.5 2.5-3.5 2.5-1.7 0-3-.6-3.7-1.8M12 5v14" />
      </>
    ),
    interface: (
      <>
        <rect x="3" y="4" width="18" height="16" />
        <path d="M3 9h18M8 9v11M6 6.5h.01M9 6.5h.01" />
      </>
    ),
  };

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      {paths[name]}
    </svg>
  );
}

function ConstituterPreview() {
  return (
    <div className="product-builder-preview" aria-label="Constituter preview">
      <div className="preview-window-bar">
        <span>Constituter</span>
        <small>portable configuration</small>
        <Link className="preview-open" href="/configure">
          Open
        </Link>
      </div>
      <div className="preview-columns">
        <div>
          <small>01 / Starting point</small>
          <div className="preview-select">
            B2B SaaS <span>⌄</span>
          </div>
          <small>02 / Capabilities</small>
          {['Organizations', 'Billing', 'Admin'].map((label, index) => (
            <div className="preview-option" key={label}>
              <span>{label}</span>
              <i data-active={index < 2} />
            </div>
          ))}
        </div>
        <div>
          <small>03 / Constituted system</small>
          {['Clerk', 'Neon + Prisma', 'Local RBAC', 'Stripe Billing'].map(
            (label) => (
              <div className="preview-stack" key={label}>
                <i /> {label}
              </div>
            ),
          )}
        </div>
        <div>
          <small>04 / Output</small>
          <pre>{`{
  "preset": "b2b-saas",
  "capabilities": {
    "billing": true
  }
}`}</pre>
        </div>
      </div>
      <div className="preview-window-footer">
        <span>One template · deterministic output</span>
        <span>No ordinary objects detected</span>
      </div>
    </div>
  );
}

export function ProductLanding() {
  return (
    <main className="product-landing">
      <section className="landing-brand" aria-label="Hipster Stack">
        <Image
          className="landing-crown"
          src={hipsterStackCrown}
          alt="The Hipster Stack. Constituted not composed."
          priority
          sizes="100vw"
        />
      </section>

      <div className="product-shell">
        <section className="product-intro">
          <div className="product-copy">
            <p>Constitution before composition.</p>
            <h2>Generate a serious SaaS starting point</h2>
            <span>
              Finally, a technology stack with provenance that won&apos;t rust.
              Nothing to borrow. We&apos;ve already checked.
            </span>
            <div className="product-actions">
              <Link
                className={buttonVariants({ variant: 'default' })}
                href="/configure"
              >
                Open the Constituter
                <ArrowRight aria-hidden="true" data-icon="inline-end" />
              </Link>
              <Link
                className={buttonVariants({ variant: 'outline' })}
                href="/libraries"
              >
                Survey the Simples
                <ArrowRight aria-hidden="true" data-icon="inline-end" />
              </Link>
            </div>
          </div>
          <ConstituterPreview />
        </section>

        <section
          className="product-entry-grid"
          aria-label="Explore Hipster Stack"
        >
          {productEntries.map((entry) => (
            <Link href={entry.href} key={entry.title}>
              <ProductIcon name={entry.icon} />
              <span>
                <strong>{entry.title}</strong>
                <small>{entry.description}</small>
              </span>
              <ArrowRight aria-hidden="true" className="product-entry-arrow" />
            </Link>
          ))}
        </section>

        <section className="product-flow" aria-labelledby="product-flow-title">
          <p id="product-flow-title">From intent to constituted application</p>
          <div>
            <article>
              <b>1</b>
              <span>
                <strong>Choose a starting point</strong>
                <small>Select a real preset and supported capabilities.</small>
              </span>
            </article>
            <i aria-hidden="true">
              <ArrowRight />
            </i>
            <article>
              <b>2</b>
              <span>
                <strong>Constitute the system</strong>
                <small>Resolve the actual relationships and constraints.</small>
              </span>
            </article>
            <i aria-hidden="true">
              <ArrowRight />
            </i>
            <article>
              <b>3</b>
              <span>
                <strong>Generate the application</strong>
                <small>
                  Export the portable configuration and run the CLI.
                </small>
              </span>
            </article>
          </div>
        </section>

        <section
          className="foundation-strip"
          aria-labelledby="foundation-title"
        >
          <p id="foundation-title">The governed foundation</p>
          <div>
            {foundations.map(([title, description, icon]) => (
              <article key={title}>
                <ProductIcon name={icon} />
                <span>
                  <strong>{title}</strong>
                  <small>{description}</small>
                </span>
              </article>
            ))}
          </div>
        </section>

        <aside className="nihilism-note">
          <span>
            Mereological nihilism update: still no composite objects. The Stack
            remains suspiciously effective anyway.
          </span>
          <b>Fuck NeoVim, btw... · Fuck Arch, btw...</b>
        </aside>
      </div>

      <Image
        className="product-landscape"
        src={digitalHerenciaBanner}
        alt=""
        aria-hidden="true"
        sizes="100vw"
      />
    </main>
  );
}
