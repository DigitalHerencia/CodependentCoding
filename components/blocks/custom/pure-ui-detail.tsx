'use client';

import Link from 'next/link';
import { LoginForm } from '@/components/blocks/auth-forms';
import { CTASimple } from '@/components/blocks/cta-section';
import { FAQAccordion } from '@/components/blocks/faq-section';
import { HeroCentered } from '@/components/blocks/hero-section';

const demos: Record<string, React.ReactNode> = {
  'auth-forms': (
    <LoginForm
      onSubmit={() => undefined}
      onForgotPassword={() => undefined}
      onSignUp={() => undefined}
    />
  ),
  'cta-section': (
    <CTASimple
      title="Build from an explicit constitution."
      description="A reusable call-to-action composition."
      primaryAction={{ label: 'Primary action', href: '#' }}
      secondaryAction={{ label: 'Secondary action', href: '#' }}
    />
  ),
  'faq-section': (
    <FAQAccordion
      title="Architecture questions"
      subtitle="Accordion FAQ"
      description="A labeled, locally interactive arrangement."
      items={[
        {
          question: 'What does a Block own?',
          answer:
            'Reusable presentation composition and presentation-safe local interaction.',
        },
        {
          question: 'What does it never own?',
          answer:
            'Persistence, authorization, provider behavior, or domain Workflows.',
        },
      ]}
    />
  ),
  'hero-section': (
    <HeroCentered
      badge="Hero variant"
      title="Presentation can be"
      titleHighlight="constituted."
      description="The outer page is Codependent Coding. This inner preview remains reusable sample application UI."
      primaryAction={{ label: 'Inspect', href: '#' }}
      secondaryAction={{ label: 'Related', href: '#' }}
    />
  ),
};

export function PureUiDetail({ slug, label }: { slug: string; label: string }) {
  const demo = demos[slug] ?? (
    <div className="generic-demo">
      <span>{label}</span>
      <strong>Real reusable Block composition</strong>
      <p>
        This presentation remains local and performs no application mutation.
      </p>
    </div>
  );
  return (
    <main className="pure-ui-detail">
      <header>
        <p className="eyebrow">PureUI Block™</p>
        <h1>{label}</h1>
        <p>
          A reusable presentation constitution built from the canonical UI
          Primitive layer.
        </p>
      </header>
      <section
        className="demo-stage"
        aria-label={`${label} rendered demonstration`}
      >
        <div className="demo-label">
          Primary example · local presentation demo
        </div>
        {demo}
      </section>
      <div className="detail-info">
        <section>
          <h2>Description</h2>
          <p>
            This Block accepts presentation-safe data and may own only the
            browser interaction necessary to demonstrate its interface.
          </p>
        </section>
        <section>
          <h2>Purpose</h2>
          <p>
            Provide a coherent composition that a Page Template or compatible
            Feature Slot can arrange without inheriting business authority.
          </p>
        </section>
        <section>
          <h2>Variants</h2>
          <p>
            Variants are explicitly labeled and remain within the Block
            contract.
          </p>
        </section>
        <section>
          <h2>Related</h2>
          <Link href="/simples">Browse all PureUI Blocks</Link>
        </section>
      </div>
    </main>
  );
}
