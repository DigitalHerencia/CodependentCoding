import {
  capabilityRegistry,
  applicationProperties,
  artifactSetIds,
  designChoices,
  productPresets,
  type Design,
  type ProductPresetId,
  type ResolvedRecipe,
} from '@hipster-stack/core/browser';
import { Download } from 'lucide-react';
import { useState, type Dispatch, type SetStateAction } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
  setCapability,
  setAuthenticationProvider,
  setPersistenceProvider,
  type ConfigurableCapability,
  type ConfiguratorRecipe,
} from '@/lib/configurator';

const surfaceCapabilities = [
  'organizations',
  'rbac',
  'invitations',
  'onboarding',
  'admin',
  'marketing',
  'sampleDomain',
] as const satisfies readonly ConfigurableCapability[];

const revenueCapabilities = [
  'billing',
  'stripeConnect',
] as const satisfies readonly ConfigurableCapability[];

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

export function ConstituterControls({
  draft,
  resolved,
  setDraft,
  onPresetChange,
  onDownload,
}: {
  draft: ConfiguratorRecipe;
  resolved: ResolvedRecipe;
  setDraft: Dispatch<SetStateAction<ConfiguratorRecipe>>;
  onPresetChange: (product: ProductPresetId) => void;
  onDownload: () => void;
}) {
  const [propertySearch, setPropertySearch] = useState('');
  const matchingProperties = applicationProperties.filter((property) =>
    `${property.label} ${property.description} ${property.category}`
      .toLowerCase()
      .includes(propertySearch.toLowerCase()),
  );
  return (
    <section className="builder-controls" id="builder-controls">
      <nav className="builder-group" aria-label="Constituter property categories">
        <Input
          aria-label="Search properties"
          placeholder="Search properties..."
          value={propertySearch}
          onChange={(event) => setPropertySearch(event.target.value)}
        />
        <div className="builder-options capability-options">
          {(propertySearch ? matchingProperties : applicationProperties).map(
            (property) => (
              <span key={property.id} title={property.description}>
                {property.category} · {property.label}
              </span>
            ),
          )}
        </div>
      </nav>
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
            <Button
              variant="ghost"
              type="button"
              data-active={draft.product === preset.id}
              key={preset.id}
              onClick={() => onPresetChange(preset.id)}
            >
              <i /> {preset.label}
            </Button>
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
          <label htmlFor="constituter-package-name">
            <span>Package name</span>
            <Input
              id="constituter-package-name"
              value={draft.name}
              onChange={(event) =>
                setDraft({
                  ...draft,
                  name: packageSlug(event.target.value),
                })
              }
            />
          </label>
          <label htmlFor="constituter-display-name">
            <span>Display name</span>
            <Input
              id="constituter-display-name"
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
          <label
            className="builder-description-field"
            htmlFor="constituter-description"
          >
            <span>One-line promise</span>
            <Input
              id="constituter-description"
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

      <fieldset className="builder-group provider-group">
        <legend>
          <i>C</i>
          <span>
            <strong>Providers</strong>
            <small>Explicit authentication and persistence slots</small>
          </span>
        </legend>
        <div className="design-selects">
          <label>
            <span>
              {applicationProperties.find(
                (property) => property.id === 'providers.authentication',
              )?.label ?? 'Authentication'}
            </span>
            <Select
              value={
                draft.providers.authentication ??
                (resolved.application.resolved.providers.some(
                  (provider) => provider.id === 'clerk',
                )
                  ? 'clerk'
                  : 'none')
              }
              onValueChange={(value) =>
                setDraft((current) =>
                  setAuthenticationProvider(
                    current,
                    value as 'none' | 'clerk',
                  ),
                )
              }
            >
              <SelectTrigger aria-label="Authentication provider">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="clerk">Clerk</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </label>
          <label>
            <span>
              {applicationProperties.find(
                (property) =>
                  property.id === 'providers.persistence.technology',
              )?.label ?? 'Persistence'}
            </span>
            <Select
              value={
                draft.providers.persistence?.technology ??
                (resolved.application.resolved.providers.some(
                  (provider) => provider.id === 'neon',
                )
                  ? 'postgresql'
                  : 'none')
              }
              onValueChange={(value) =>
                setDraft((current) =>
                  setPersistenceProvider(
                    current,
                    value as 'none' | 'postgresql',
                  ),
                )
              }
            >
              <SelectTrigger aria-label="Persistence">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="postgresql">PostgreSQL · Neon</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </label>
          <label>
            <span>Authorization model</span>
            <Select
              value={draft.authorization.model}
              onValueChange={(value) =>
                setDraft((current) => ({
                  ...current,
                  routes: [],
                  outputOverrides: { artifactSets: {}, artifacts: {} },
                  authorization: { model: value as 'rbac' | 'none' },
                  modules: {
                    ...current.modules,
                    rbac: value === 'rbac',
                    ...(value === 'none'
                      ? {
                          admin: false,
                          sampleDomain: false as const,
                          stripeConnect: false,
                        }
                      : {}),
                  },
                }))
              }
            >
              <SelectTrigger aria-label="Authorization model">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="rbac">RBAC</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </label>
        </div>
      </fieldset>

      <CapabilityGroup
        letter="D"
        title="Product surfaces"
        description="Optional routes and owned features"
        capabilities={surfaceCapabilities}
        setDraft={setDraft}
        resolved={resolved.recipe.modules}
      />
      <CapabilityGroup
        letter="E"
        title="Revenue"
        description="Billing and platform payments"
        capabilities={revenueCapabilities}
        setDraft={setDraft}
        resolved={resolved.recipe.modules}
      />

      <fieldset className="builder-group design-group">
        <legend>
          <i>F</i>
          <span>
            <strong>Design</strong>
            <small>Bounded visual direction</small>
          </span>
        </legend>
        <div className="design-selects">
          {(Object.keys(designChoices) as (keyof Design)[]).map((key) => (
            <label key={key}>
              <span>{title(key)}</span>
              <Select
                value={draft.design[key]}
                onValueChange={(value) =>
                  setDraft({
                    ...draft,
                    design: {
                      ...draft.design,
                      [key]: value as Design[typeof key],
                    },
                  })
                }
              >
                <SelectTrigger aria-label={title(key)}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {designChoices[key].map((value) => (
                      <SelectItem value={value} key={value}>
                        {title(value)}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </label>
          ))}
        </div>
      </fieldset>

      {resolved.application.resolved.authorization.model === 'rbac' && (
        <fieldset className="builder-group capability-group">
          <legend>
            <i>G</i>
            <span>
              <strong>RBAC roles</strong>
              <small>Structured roles with capability-derived permissions</small>
            </span>
          </legend>
          <div className="builder-options capability-options">
            {resolved.application.resolved.authorization.roles.map((role) => (
              <details key={role.name}>
                <summary>
                  {role.displayName} · {role.permissions.length} permissions
                </summary>
                {resolved.application.resolved.authorization.permissions.map(
                  (permission) => (
                    <label className="capability-option" key={permission}>
                      <Switch
                        checked={role.permissions.includes(permission)}
                        aria-label={`${role.displayName}: ${permission}`}
                        onCheckedChange={(checked) =>
                          setDraft((current) => {
                            const roles = resolved.application.resolved.authorization.roles.map(
                              (candidate) =>
                                candidate.name === role.name
                                  ? {
                                      ...candidate,
                                      permissions: checked
                                        ? [...candidate.permissions, permission]
                                        : candidate.permissions.filter(
                                            (value) => value !== permission,
                                          ),
                                    }
                                  : candidate,
                            );
                            return {
                              ...current,
                              authorization: { model: 'rbac', roles },
                            };
                          })
                        }
                      />
                      <span>{permission}</span>
                    </label>
                  ),
                )}
              </details>
            ))}
          </div>
        </fieldset>
      )}

      <fieldset className="builder-group identity-group">
        <legend>
          <i>H</i>
          <span>
            <strong>Routes</strong>
            <small>Public URL segments, separate from route-group internals</small>
          </span>
        </legend>
        <div className="builder-fields">
          {resolved.application.resolved.routes.map((route) => (
            <label key={route.id}>
              <span>
                {title(route.id)} · {route.access}
              </span>
              <Input
                aria-label={`${title(route.id)} URL segment`}
                defaultValue={
                  draft.routes.find((candidate) => candidate.id === route.id)
                    ?.urlSegment ?? route.urlSegment
                }
                onChange={(event) =>
                  event.target.value.startsWith('/') &&
                  setDraft((current) => ({
                    ...current,
                    routes: [
                      ...current.routes.filter(
                        (candidate) => candidate.id !== route.id,
                      ),
                      {
                        id: route.id,
                        urlSegment: event.target.value,
                        ...(current.routes.find(
                          (candidate) => candidate.id === route.id,
                        )?.navigationLabel
                          ? {
                              navigationLabel: current.routes.find(
                                (candidate) => candidate.id === route.id,
                              )!.navigationLabel,
                            }
                          : {}),
                      },
                    ],
                  }))
                }
              />
              <Input
                aria-label={`${title(route.id)} navigation label`}
                defaultValue={
                  draft.routes.find((candidate) => candidate.id === route.id)
                    ?.navigationLabel ?? route.navigationLabel
                }
                onChange={(event) =>
                  event.target.value.trim() &&
                  setDraft((current) => {
                    const existing = current.routes.find(
                      (candidate) => candidate.id === route.id,
                    );
                    return {
                      ...current,
                      routes: [
                        ...current.routes.filter(
                          (candidate) => candidate.id !== route.id,
                        ),
                        {
                          id: route.id,
                          urlSegment: existing?.urlSegment ?? route.urlSegment,
                          navigationLabel: event.target.value,
                        },
                      ],
                    };
                  })
                }
              />
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="builder-group design-group">
        <legend>
          <i>I</i>
          <span>
            <strong>Advanced output</strong>
            <small>Artifact-set and safe file policies</small>
          </span>
        </legend>
        <div className="design-selects">
          {artifactSetIds.map((artifactSet) => {
            const enabled = resolved.application.resolved.artifactSets.some(
              (candidate) => candidate.id === artifactSet,
            );
            return (
              <label key={artifactSet}>
                <span>{title(artifactSet)}</span>
                <Select
                  value={
                    draft.outputOverrides?.artifactSets?.[artifactSet] ??
                    'INHERIT'
                  }
                  onValueChange={(value) =>
                    setDraft((current) => ({
                      ...current,
                      outputOverrides: {
                        artifactSets: {
                          ...current.outputOverrides?.artifactSets,
                          [artifactSet]: value as 'INHERIT' | 'EXCLUDE',
                        },
                        artifacts: current.outputOverrides?.artifacts ?? {},
                      },
                    }))
                  }
                >
                  <SelectTrigger aria-label={`${title(artifactSet)} output policy`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="INHERIT">Inherit</SelectItem>
                      <SelectItem value="EXCLUDE" disabled={enabled}>
                        Exclude
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </label>
            );
          })}
        </div>
        <div className="builder-options capability-options">
          {resolved.application.plan.artifacts
            .filter((artifact) => artifact.removable)
            .map((artifact) => (
              <div className="capability-option" key={artifact.path}>
                <Switch
                  checked={artifact.generationPolicy !== 'EXCLUDE'}
                  aria-label={`Include ${artifact.path}`}
                  onCheckedChange={(checked) =>
                    setDraft((current) => ({
                      ...current,
                      outputOverrides: {
                        artifactSets:
                          current.outputOverrides?.artifactSets ?? {},
                        artifacts: {
                          ...current.outputOverrides?.artifacts,
                          [artifact.path]: checked ? 'INHERIT' : 'EXCLUDE',
                        },
                      },
                    }))
                  }
                />
                <span>{artifact.path}</span>
              </div>
            ))}
        </div>
      </fieldset>

      <Button className="builder-download" type="button" onClick={onDownload}>
        Download Recipe <Download aria-hidden="true" data-icon="inline-end" />
      </Button>
    </section>
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
  capabilities: readonly ConfigurableCapability[];
  setDraft: Dispatch<SetStateAction<ConfiguratorRecipe>>;
  resolved: ResolvedRecipe['recipe']['modules'];
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
            <div className="capability-option" data-active={enabled} key={id}>
              <Switch
                aria-label={capabilityRegistry[id].label}
                checked={enabled}
                onCheckedChange={(checked) =>
                  setDraft((current) => setCapability(current, id, checked))
                }
              />
              <span>{capabilityRegistry[id].label}</span>
            </div>
          );
        })}
      </div>
    </fieldset>
  );
}
