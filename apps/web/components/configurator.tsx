'use client';

import {
  capabilityRegistry,
  productPresetIds,
  productPresets,
  type Design,
  type ProductPresetId,
} from '@loaded-vibes/core/browser';
import { useEffect, useMemo, useState } from 'react';
import { LivePreview } from '@/components/live-preview';
import {
  configurableCapabilities,
  createCliCommand,
  defaultConfiguratorRecipe,
  deserializeRecipe,
  resolveConfiguratorRecipe,
  selectProductPreset,
  serializeRecipe,
  setCapability,
  type ConfiguratorRecipe,
} from '@/lib/configurator';

const productNotes: Record<ProductPresetId, string> = {
  'b2b-saas': 'Teams, subscriptions, onboarding, and an operator view.',
  'client-portal': 'A secure shared workspace for clients and your team.',
  'platform-marketplace': 'A multi-sided product with connected payments.',
  'bare-golden-app': 'The smallest proven foundation, ready for your domain.',
};

const designChoices = {
  theme: ['obsidian', 'paper', 'electric'],
  mode: ['system', 'light', 'dark'],
  radius: ['compact', 'medium', 'rounded'],
  density: ['compact', 'comfortable'],
  navigation: ['sidebar', 'topbar'],
} as const satisfies { [Key in keyof Design]: readonly Design[Key][] };

function title(value: string) {
  return value
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (letter) => letter.toUpperCase());
}

function packageSlug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^[-_]+/, '');
}

export function Configurator() {
  const [draft, setDraft] = useState<ConfiguratorRecipe>(
    defaultConfiguratorRecipe,
  );
  const [notice, setNotice] = useState('');

  useEffect(() => {
    const encoded = new URLSearchParams(window.location.search).get('recipe');
    if (!encoded) return;
    try {
      setDraft(deserializeRecipe(encoded));
    } catch {
      setNotice(
        'That shared recipe could not be read, so we kept a safe default.',
      );
    }
  }, []);

  const resolved = useMemo(() => resolveConfiguratorRecipe(draft), [draft]);

  async function copy(value: string, message: string) {
    await navigator.clipboard.writeText(value);
    setNotice(message);
  }

  function downloadRecipe() {
    const blob = new Blob([`${serializeRecipe(draft)}\n`], {
      type: 'application/json',
    });
    const href = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = href;
    anchor.download = 'loadedvibes.json';
    anchor.click();
    URL.revokeObjectURL(href);
    setNotice('loadedvibes.json downloaded.');
  }

  function shareRecipe() {
    const url = new URL(window.location.href);
    url.searchParams.set('recipe', serializeRecipe(draft));
    void copy(url.toString(), 'Share link copied.');
  }

  return (
    <main className="shell">
      <header className="masthead">
        <a className="wordmark" href="#top" aria-label="Loaded Vibes home">
          <span className="mark">LV</span>
          <span>Loaded Vibes</span>
        </a>
        <span className="status">
          <i /> Stateless configurator
        </span>
      </header>

      <section className="hero" id="top">
        <p className="eyebrow">One golden SaaS. Shaped around your product.</p>
        <h1>
          Choose the product.
          <br />
          <em>Keep the architecture.</em>
        </h1>
        <p className="lede">
          Build a reproducible recipe for the Loaded Vibes master template.
          Loaded Vibes resolves the dependencies and leaves the fixed
          engineering decisions alone.
        </p>
      </section>

      <div className="workspace">
        <div className="steps">
          <section className="panel step">
            <div className="step-heading">
              <span>01</span>
              <div>
                <h2>Product shape</h2>
                <p>Start from intent, not infrastructure.</p>
              </div>
            </div>
            <div className="preset-grid">
              {productPresetIds.map((id) => {
                const preset = productPresets[id];
                return (
                  <button
                    className="preset-card"
                    data-active={draft.product === id}
                    key={id}
                    onClick={() =>
                      setDraft((current) => selectProductPreset(current, id))
                    }
                  >
                    <span className="radio" />
                    <strong>{preset.label}</strong>
                    <small>{productNotes[id]}</small>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="panel step">
            <div className="step-heading">
              <span>02</span>
              <div>
                <h2>Capabilities</h2>
                <p>Dependencies are included automatically.</p>
              </div>
            </div>
            <div className="foundation">
              <span>Always included</span>
              <strong>
                Organizations · authorization · generated guidance
              </strong>
            </div>
            <div className="capability-list">
              {configurableCapabilities.map((id) => {
                const enabled =
                  id === 'sampleDomain'
                    ? resolved.recipe.modules.sampleDomain !== false
                    : resolved.recipe.modules[id];
                return (
                  <label className="capability" key={id}>
                    <span>
                      <strong>{capabilityRegistry[id].label}</strong>
                      <small>
                        {capabilityRegistry[id].requires.length
                          ? `Requires ${capabilityRegistry[id].requires.map((item) => capabilityRegistry[item].label.toLowerCase()).join(', ')}`
                          : 'Independent product surface'}
                      </small>
                    </span>
                    <input
                      type="checkbox"
                      checked={enabled}
                      onChange={(event) =>
                        setDraft((current) =>
                          setCapability(current, id, event.target.checked),
                        )
                      }
                    />
                  </label>
                );
              })}
            </div>
          </section>

          <section className="panel step">
            <div className="step-heading">
              <span>03</span>
              <div>
                <h2>Product identity</h2>
                <p>Make the generated experience yours.</p>
              </div>
            </div>
            <div className="field-grid">
              <label>
                <span>Package name</span>
                <input
                  value={draft.name}
                  onChange={(event) =>
                    setDraft({
                      ...draft,
                      name: packageSlug(event.target.value),
                    })
                  }
                  placeholder="my-saas"
                />
              </label>
              <label>
                <span>Display name</span>
                <input
                  value={draft.identity.displayName}
                  onChange={(event) =>
                    setDraft({
                      ...draft,
                      identity: {
                        ...draft.identity,
                        displayName: event.target.value,
                      },
                    })
                  }
                  placeholder="My SaaS"
                />
              </label>
              <label className="wide">
                <span>One-line promise</span>
                <textarea
                  maxLength={160}
                  value={draft.identity.description}
                  onChange={(event) =>
                    setDraft({
                      ...draft,
                      identity: {
                        ...draft.identity,
                        description: event.target.value,
                      },
                    })
                  }
                />
              </label>
            </div>
          </section>

          <section className="panel step">
            <div className="step-heading">
              <span>04</span>
              <div>
                <h2>Visual direction</h2>
                <p>Semantic choices, applied to intentional surfaces.</p>
              </div>
            </div>
            <div className="design-grid">
              {(Object.keys(designChoices) as (keyof Design)[]).map((key) => (
                <fieldset key={key}>
                  <legend>{title(key)}</legend>
                  <div className="segments">
                    {designChoices[key].map((value) => (
                      <button
                        type="button"
                        data-active={draft.design[key] === value}
                        key={value}
                        onClick={() =>
                          setDraft({
                            ...draft,
                            design: { ...draft.design, [key]: value },
                          })
                        }
                      >
                        {title(value)}
                      </button>
                    ))}
                  </div>
                </fieldset>
              ))}
            </div>
          </section>
        </div>

        <aside
          className="review"
          data-theme={draft.design.theme}
          data-radius={draft.design.radius}
          data-density={draft.design.density}
        >
          <div className="review-top">
            <span>Live product preview</span>
            <span className="schema">schema v1</span>
          </div>
          <div className="product-preview">
            <span className="preview-mark">
              {resolved.recipe.identity.displayName.slice(0, 2).toUpperCase()}
            </span>
            <div>
              <h2>{resolved.recipe.identity.displayName}</h2>
              <p>
                {resolved.recipe.identity.description ||
                  'Your next focused SaaS product.'}
              </p>
            </div>
          </div>
          <LivePreview recipe={resolved.recipe} />
          <div className="summary-block">
            <small>Starting point</small>
            <strong>{resolved.summary.preset.label}</strong>
          </div>
          <div className="summary-block">
            <small>
              Included capabilities · {resolved.summary.included.length}
            </small>
            <ul>
              {resolved.summary.included.map((item) => (
                <li key={item}>
                  <i />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          {resolved.summary.autoIncluded.length > 0 && (
            <div className="auto">
              <strong>Resolved for you</strong>
              <span>{resolved.summary.autoIncluded.join(', ')}</span>
            </div>
          )}
          <details>
            <summary>Not included · {resolved.summary.excluded.length}</summary>
            <p>{resolved.summary.excluded.join(' · ') || 'Nothing'}</p>
          </details>
          <div className="actions">
            <button className="primary" onClick={downloadRecipe}>
              Download recipe
            </button>
            <button
              onClick={() =>
                void copy(createCliCommand(draft), 'CLI command copied.')
              }
            >
              Copy CLI command
            </button>
            <button onClick={shareRecipe}>Copy share link</button>
          </div>
          <p className="privacy">
            No account. No server state. Your choices stay in this browser until
            you export or share them.
          </p>
          {notice && (
            <p className="notice" role="status">
              {notice}
            </p>
          )}
        </aside>
      </div>
    </main>
  );
}
