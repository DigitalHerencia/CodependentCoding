'use client';

import Link from 'next/link';
import { useState } from 'react';
import { SimplesCatalog } from '@/components/blocks/custom/simples-catalog';
import { pureUiSimples, workflowSimples } from '@/lib/public-catalog';

export function SimplesNavigation() {
  const [open, setOpen] = useState(false);
  return (
    <div className="simples-nav" onMouseLeave={() => undefined}>
      <button
        className="nav-link"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
      >
        SIMPLES
      </button>
      <div className="simples-mega">
        <section>
          <strong>PUREUI BLOCKS</strong>
          <span>Presentation Layer</span>
          {pureUiSimples.slice(0, 6).map(([slug, label]) => (
            <Link key={slug} href={`/simples/pure-ui/${slug}`}>
              {label}
            </Link>
          ))}
        </section>
        <section>
          <strong>BUSINESSLOGIC WORKFLOWS</strong>
          <span>Domain Workflows</span>
          {workflowSimples
            .filter(
              (item, index, all) =>
                all.findIndex((other) => other.domain === item.domain) ===
                index,
            )
            .map((item) => (
              <Link key={item.domain} href={`/simples/workflows/${item.slug}`}>
                {item.domain}
              </Link>
            ))}
        </section>
        <Link className="view-all" href="/simples">
          View full catalog
        </Link>
      </div>
      {open && (
        <div
          className="catalog-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Simples catalog"
        >
          <button
            className="overlay-dismiss"
            aria-label="Close catalog"
            onClick={() => setOpen(false)}
          />
          <SimplesCatalog modal onClose={() => setOpen(false)} />
        </div>
      )}
    </div>
  );
}
