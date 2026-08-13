'use client';

import {
  capabilityRegistry,
  productPresets,
  type Design,
  type ProductPresetId,
} from '@loaded-vibes/core/browser';
import { useEffect, useMemo, useState } from 'react';
import {
  createCliCommand,
  defaultConfiguratorRecipe,
  deserializeRecipe,
  resolveConfiguratorRecipe,
  serializeRecipe,
  setCapability,
  type ConfiguratorRecipe,
} from '@/lib/configurator';

const surfaceCapabilities = [
  'invitations',
  'onboarding',
  'admin',
  'marketing',
  'sampleDomain',
] as const;
const revenueCapabilities = ['billing', 'stripeConnect'] as const;
const designChoices = {
  theme: ['obsidian', 'paper', 'electric'],
  mode: ['system', 'light', 'dark'],
  radius: ['compact', 'medium', 'rounded'],
  density: ['compact', 'comfortable'],
  navigation: ['sidebar', 'topbar'],
} as const satisfies { [Key in keyof Design]: readonly Design[Key][] };

const fixedStack = [
  ['Clerk', 'Auth'],
  ['Organizations', 'Tenancy'],
  ['Local RBAC', 'Authorization'],
  ['Neon/Postgres', 'Database'],
  ['Prisma + RLS', 'Data boundary'],
  ['Hipster Stack', 'Architecture'],
] as const;

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
  const normalizedJson = useMemo(
    () => JSON.stringify(resolved.recipe, null, 2),
    [resolved.recipe],
  );

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

  function choosePreset(product: ProductPresetId) {
    setDraft((current) => ({ ...current, product, modules: {} }));
  }

  return (
    <main className="builder-page">
      <header className="builder-heading">
        <h1>Constituter™</h1>
        <p>
          No, Simples™ cannot be composed &quot;Hipster-Wise&quot;. They are
          simply a dynamic system arranged in a configuration that is
          Hipster-ing™.
        </p>
        <small className="builder-nihilism">
          Mereological sums remain outside the supported configuration model.
        </small>
        <div className="builder-top-actions">
          <a className="button primary" href="#builder-controls">
            Start Config <b>↓</b>
          </a>
          <button
            className="button"
            type="button"
            onClick={() => void copy(normalizedJson, 'Recipe copied.')}
          >
            Copy Recipe <b>⧉</b>
          </button>
        </div>
      </header>

      <div className="builder-workspace">
        <section className="builder-controls" id="builder-controls">
          <fieldset className="builder-group preset-group">
            <legend>
              <i>A</i>
              <span>
                <strong>Starting point</strong>
                <small>One template, four real presets</small>
              </span>
            </legend>
            <div className="builder-options preset-options">
              {(
                Object.values(
                  productPresets,
                ) as (typeof productPresets)[ProductPresetId][]
              ).map((preset) => (
                <button
                  type="button"
                  data-active={draft.product === preset.id}
                  key={preset.id}
                  onClick={() => choosePreset(preset.id)}
                >
                  <i /> {preset.label}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="builder-group identity-group">
            <legend>
              <i>B</i>
              <span>
                <strong>Product identity</strong>
                <small>Name the repository and product</small>
              </span>
            </legend>
            <div className="builder-fields">
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
                />
              </label>
              <label className="builder-description-field">
                <span>One-line promise</span>
                <input
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
          </fieldset>

          <CapabilityGroup
            letter="C"
            title="Product surfaces"
            description="Optional routes and owned features"
            capabilities={surfaceCapabilities}
            setDraft={setDraft}
            resolved={resolved.recipe.modules}
          />
          <CapabilityGroup
            letter="D"
            title="Revenue"
            description="Billing and platform payments"
            capabilities={revenueCapabilities}
            setDraft={setDraft}
            resolved={resolved.recipe.modules}
          />

          <fieldset className="builder-group design-group">
            <legend>
              <i>E</i>
              <span>
                <strong>Design</strong>
                <small>Bounded visual direction</small>
              </span>
            </legend>
            <div className="design-selects">
              {(Object.keys(designChoices) as (keyof Design)[]).map((key) => (
                <label key={key}>
                  <span>{title(key)}</span>
                  <select
                    value={draft.design[key]}
                    onChange={(event) =>
                      setDraft({
                        ...draft,
                        design: {
                          ...draft.design,
                          [key]: event.target.value,
                        },
                      })
                    }
                  >
                    {designChoices[key].map((value) => (
                      <option value={value} key={value}>
                        {title(value)}
                      </option>
                    ))}
                  </select>
                </label>
              ))}
            </div>
          </fieldset>

          <button
            className="builder-download"
            type="button"
            onClick={downloadRecipe}
          >
            Download Recipe <span>↓</span>
          </button>
        </section>

        <aside className="recipe-preview">
          <div className="recipe-preview-heading">
            <div>
              <strong>Constitution Preview</strong>
              <small>{resolved.summary.preset.label}</small>
            </div>
            <span>schema v{resolved.recipe.schemaVersion}</span>
          </div>

          <section className="selected-stack" aria-label="Constituted system">
            <p>Constituted System</p>
            <div>
              {fixedStack.map(([name, role]) => (
                <article key={name}>
                  <i>✓</i>
                  <span>
                    <strong>{name}</strong>
                    <small>{role}</small>
                  </span>
                </article>
              ))}
            </div>
          </section>

          <section className="recipe-code">
            <div>
              <span>loadedvibes.json</span>
              <button
                type="button"
                onClick={() => void copy(normalizedJson, 'Recipe copied.')}
              >
                ⧉ Copy
              </button>
            </div>
            <pre>{normalizedJson}</pre>
          </section>

          {resolved.summary.autoIncluded.length > 0 && (
            <p className="builder-auto-included">
              <strong>Resolved automatically:</strong>{' '}
              {resolved.summary.autoIncluded.join(', ')}
            </p>
          )}

          <section className="builder-handoff">
            <article>
              <strong>Includes</strong>
              <small>
                {resolved.summary.included.length} resolved capabilities
              </small>
              <span>{resolved.summary.included.slice(0, 3).join(' · ')}</span>
            </article>
            <article>
              <strong>Works With</strong>
              <small>Docs + CLI</small>
              <span>Portable, stateless recipe</span>
            </article>
            <article>
              <strong>Output</strong>
              <small>User-owned application</small>
              <span>One template · deterministic build</span>
            </article>
          </section>

          <div className="builder-output-actions">
            <button type="button" onClick={downloadRecipe}>
              Download JSON
            </button>
            <button
              type="button"
              onClick={() =>
                void copy(createCliCommand(draft), 'CLI command copied.')
              }
            >
              Copy CLI Command
            </button>
            <button type="button" onClick={shareRecipe}>
              Copy Share URL
            </button>
          </div>
          <p className="builder-privacy">
            No account or server state. Export the recipe and generate locally.
          </p>
          {notice && (
            <p className="builder-notice" role="status">
              {notice}
            </p>
          )}
        </aside>
      </div>
    </main>
  );
}

function CapabilityGroup({
  letter,
  title: groupTitle,
  description,
  capabilities,
  setDraft,
  resolved,
}: {
  letter: string;
  title: string;
  description: string;
  capabilities: readonly (
    | 'invitations'
    | 'billing'
    | 'stripeConnect'
    | 'onboarding'
    | 'admin'
    | 'marketing'
    | 'sampleDomain'
  )[];
  setDraft: React.Dispatch<React.SetStateAction<ConfiguratorRecipe>>;
  resolved: ReturnType<typeof resolveConfiguratorRecipe>['recipe']['modules'];
}) {
  return (
    <fieldset className="builder-group capability-group">
      <legend>
        <i>{letter}</i>
        <span>
          <strong>{groupTitle}</strong>
          <small>{description}</small>
        </span>
      </legend>
      <div className="builder-options capability-options">
        {capabilities.map((id) => {
          const enabled =
            id === 'sampleDomain'
              ? resolved.sampleDomain !== false
              : resolved[id];
          return (
            <label data-active={enabled} key={id}>
              <input
                type="checkbox"
                checked={enabled}
                onChange={(event) =>
                  setDraft((current) =>
                    setCapability(current, id, event.target.checked),
                  )
                }
              />
              <i>{enabled ? '✓' : ''}</i>
              <span>{capabilityRegistry[id].label}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
