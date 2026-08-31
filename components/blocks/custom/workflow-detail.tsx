'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

export function WorkflowDetail({
  domain,
  label,
}: {
  domain: string;
  label: string;
}) {
  const [input, setInput] = useState(60);
  const result = useMemo(
    () =>
      input >= 80
        ? 'Escalate / act now'
        : input >= 50
          ? 'Review required'
          : 'Within policy',
    [input],
  );
  return (
    <main className="workflow-detail">
      <header>
        <p className="eyebrow">BusinessLogic Block™ · Domain Workflow</p>
        <h1>{label}</h1>
        <p>
          {domain} normalized behavior, explained through a bounded local
          simulation.
        </p>
      </header>
      <section className="workflow-pair">
        <article>
          <h2>Explanation</h2>
          <dl>
            <div>
              <dt>Purpose</dt>
              <dd>
                Coordinate the named domain decision without exposing provider
                or persistence mechanics.
              </dd>
            </div>
            <div>
              <dt>Input</dt>
              <dd>
                Current authoritative facts, actor scope, and transition intent.
              </dd>
            </div>
            <div>
              <dt>Precondition</dt>
              <dd>
                Input is valid and the conceptual transition is permitted.
              </dd>
            </div>
            <div>
              <dt>Outcome</dt>
              <dd>A framework-neutral result describing the next state.</dd>
            </div>
            <div>
              <dt>Invariant</dt>
              <dd>
                No production operation occurs in this public demonstration.
              </dd>
            </div>
          </dl>
        </article>
        <article className="workflow-demo">
          <h2>Interactive demonstration</h2>
          <p>
            Representative input: <strong>{input}</strong>
          </p>
          <input
            aria-label="Representative workflow input"
            type="range"
            min="0"
            max="100"
            value={input}
            onChange={(event) => setInput(Number(event.target.value))}
          />
          <div className="workflow-result">
            <span>Conceptual outcome</span>
            <strong>{result}</strong>
          </div>
          <small>
            Local explanatory browser state — not the production Workflow.
          </small>
        </article>
      </section>
      <footer>
        <strong>Ontology membership</strong>
        <span>{domain}</span>
        <Link href="/simples">Related Workflows</Link>
      </footer>
    </main>
  );
}
