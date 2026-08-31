'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { pureUiSimples, workflowSimples } from '@/lib/public-catalog';

export function SimplesCatalog({
  modal = false,
  onClose,
}: {
  modal?: boolean;
  onClose?: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!modal) return;
    closeRef.current?.focus();
    const close = (event: KeyboardEvent) =>
      event.key === 'Escape' && onClose?.();
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [modal, onClose]);

  return (
    <section
      className={`simples-catalog ${modal ? 'simples-catalog-modal' : ''}`}
      aria-label="Simples catalog"
    >
      <header>
        <div>
          <p className="eyebrow">SIMPLES™</p>
          <h1>Constitutions you can inspect.</h1>
        </div>
        {modal && (
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label="Close Simples catalog"
          >
            Close
          </button>
        )}
      </header>
      <div className="simples-columns">
        <section>
          <img src="/PureUI Logo.jpg" alt="PureUI Blocks" />
          <p>Presentation Layer</p>
          <div className="catalog-links">
            {pureUiSimples.map(([slug, label]) => (
              <Link
                key={slug}
                href={`/simples/pure-ui/${slug}`}
                {...(onClose ? { onClick: onClose } : {})}
              >
                {label}
              </Link>
            ))}
          </div>
        </section>
        <section>
          <img src="/BusinnesLogic Logo.jpg" alt="BusinessLogic Workflows" />
          <p>Domain Workflows</p>
          <div className="workflow-groups">
            {[...new Set(workflowSimples.map((item) => item.domain))].map(
              (domain) => (
                <div key={domain}>
                  <h2>{domain}</h2>
                  {workflowSimples
                    .filter((item) => item.domain === domain)
                    .map((item) => (
                      <Link
                        key={item.slug}
                        href={`/simples/workflows/${item.slug}`}
                        {...(onClose ? { onClick: onClose } : {})}
                      >
                        {item.label}
                      </Link>
                    ))}
                </div>
              ),
            )}
          </div>
        </section>
      </div>
    </section>
  );
}
