import {
  applicationProperties,
  artifactSetIds,
  capabilityRegistry,
  designChoices,
  productPresets,
  type Design,
  type CapabilityId,
  type ProductPresetId,
  type PropertyDefinition,
  type ResolvedRecipe,
  type RoleDefinition,
} from '@hipster-stack/core/browser';
import { ArrowDown, ArrowUp, Download, Plus, Trash2 } from 'lucide-react';
import {
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react';
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
  configurableCapabilities,
  setAuthenticationProvider,
  setCapability,
  setPersistenceProvider,
  type ConfiguratorRecipe,
} from '@/lib/configurator';

function title(value: string) {
  return value
    .replace(/-/g, ' ')
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
  const categories = [
    ...new Set(applicationProperties.map((property) => property.category)),
  ];
  const [activeCategory, setActiveCategory] = useState(
    categories[0] ?? 'Foundation',
  );
  const [propertySearch, setPropertySearch] = useState('');
  const properties = applicationProperties.filter((property) => {
    if (!isPropertyVisible(property, draft, resolved)) return false;
    if (!propertySearch) return property.category === activeCategory;
    return `${property.label} ${property.description} ${property.category}`
      .toLowerCase()
      .includes(propertySearch.toLowerCase());
  });

  return (
    <section className="builder-controls" id="builder-controls">
      <nav
        className="builder-group"
        aria-label="Constituter property categories"
      >
        <Input
          aria-label="Search properties"
          placeholder="Search properties..."
          value={propertySearch}
          onChange={(event) => setPropertySearch(event.target.value)}
        />
        <div className="builder-options capability-options">
          {categories.map((category) => (
            <Button
              key={category}
              type="button"
              variant="ghost"
              data-active={!propertySearch && activeCategory === category}
              onClick={() => {
                setActiveCategory(category);
                setPropertySearch('');
              }}
            >
              {category}
            </Button>
          ))}
        </div>
      </nav>

      <div className="builder-property-editor">
        {properties.map((property, index) => (
          <PropertyFrame
            key={property.id}
            property={property}
            state={
              resolved.application.resolved.propertyStates[property.id] ??
              'DEFAULT'
            }
            index={index}
          >
            <PropertyEditor
              property={property}
              draft={draft}
              resolved={resolved}
              setDraft={setDraft}
              onPresetChange={onPresetChange}
            />
          </PropertyFrame>
        ))}
        {properties.length === 0 && (
          <p className="builder-notice">
            No supported properties match this search.
          </p>
        )}
      </div>

      <Button className="builder-download" type="button" onClick={onDownload}>
        Download Application Definition{' '}
        <Download aria-hidden="true" data-icon="inline-end" />
      </Button>
    </section>
  );
}

function PropertyFrame({
  property,
  state,
  index,
  children,
}: {
  property: PropertyDefinition;
  state: string;
  index: number;
  children: ReactNode;
}) {
  return (
    <fieldset
      className="builder-group"
      data-property={property.id}
      data-mechanism={property.type}
    >
      <legend>
        <i>{String(index + 1).padStart(2, '0')}</i>
        <span>
          <strong>{property.label}</strong>
          <small>{property.description}</small>
        </span>
      </legend>
      <p className="builder-property-state">
        {property.type} · {state}
      </p>
      {(property.affects.length > 0 || property.derivedFrom.length > 0) && (
        <p className="builder-property-state">
          {property.affects.length > 0
            ? `Affects: ${property.affects.join(' · ')}`
            : ''}
          {property.derivedFrom.length > 0
            ? ` · Derived from: ${property.derivedFrom.join(' · ')}`
            : ''}
        </p>
      )}
      {children}
    </fieldset>
  );
}

function PropertyEditor({
  property,
  draft,
  resolved,
  setDraft,
  onPresetChange,
}: {
  property: PropertyDefinition;
  draft: ConfiguratorRecipe;
  resolved: ResolvedRecipe;
  setDraft: Dispatch<SetStateAction<ConfiguratorRecipe>>;
  onPresetChange: (product: ProductPresetId) => void;
}) {
  const application = resolved.application.resolved;
  switch (property.id) {
    case 'preset':
      return (
        <div className="builder-options preset-options">
          {(
            Object.values(
              productPresets,
            ) as (typeof productPresets)[ProductPresetId][]
          ).map((preset) => (
            <Button
              variant="ghost"
              type="button"
              data-active={draft.preset === preset.id}
              key={preset.id}
              onClick={() => onPresetChange(preset.id)}
            >
              <i /> {preset.label}
            </Button>
          ))}
        </div>
      );
    case 'identity':
      return (
        <div className="builder-fields">
          <label htmlFor="constituter-package-name">
            <span>Package name</span>
            <Input
              id="constituter-package-name"
              value={draft.identity.packageName}
              onChange={(event) =>
                setDraft({
                  ...draft,
                  identity: {
                    ...draft.identity,
                    packageName: packageSlug(event.target.value),
                  },
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
          <label htmlFor="constituter-description">
            <span>Description</span>
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
      );
    case 'architectureVersion':
      return (
        <ReadOnlyValue value="Application Definition v1 · one-template architecture" />
      );
    case 'tenantModel':
      return (
        <ReadOnlyValue
          value={
            application.capabilities.includes('organizations')
              ? 'Organization-scoped tenancy'
              : 'No tenant model'
          }
        />
      );
    case 'providers.authentication':
      return (
        <SingleSelect
          label={property.label}
          value={
            draft.providers.authentication ??
            (application.providers.some((provider) => provider.id === 'clerk')
              ? 'clerk'
              : 'none')
          }
          values={property.allowedValues ?? []}
          onValueChange={(value) =>
            setDraft((current) =>
              setAuthenticationProvider(current, value as 'none' | 'clerk'),
            )
          }
        />
      );
    case 'providers.persistence.technology':
      return (
        <SingleSelect
          label={property.label}
          value={
            draft.providers.persistence?.technology ??
            (application.providers.some((provider) => provider.id === 'neon')
              ? 'postgresql'
              : 'none')
          }
          values={property.allowedValues ?? []}
          onValueChange={(value) =>
            setDraft((current) =>
              setPersistenceProvider(current, value as 'none' | 'postgresql'),
            )
          }
        />
      );
    case 'providers.persistence.provider':
      return (
        <SingleSelect
          label={property.label}
          value={draft.providers.persistence?.provider ?? 'neon'}
          values={property.allowedValues ?? []}
          onValueChange={(value) =>
            setDraft((current) =>
              setPersistenceProvider(
                current,
                value === 'none' ? 'none' : 'postgresql',
              ),
            )
          }
        />
      );
    case 'rls':
      return (
        <ReadOnlyValue
          value={
            application.capabilities.includes('organizations') &&
            application.providers.some((provider) => provider.id === 'neon')
              ? 'Required · organization-scoped PostgreSQL persistence'
              : 'Not required'
          }
        />
      );
    case 'capabilities':
      return (
        <div className="builder-options capability-options">
          {configurableCapabilities.map((id) => {
            const enabled =
              id === 'sampleDomain'
                ? resolved.recipe.modules.sampleDomain !== false
                : resolved.recipe.modules[id];
            const state =
              application.propertyStates[`capabilities.${id}`] ?? 'DEFAULT';
            const blockedReason = capabilityBlockedReason(id, draft);
            const locked =
              state === 'REQUIRED' || state === 'LOCKED' || !!blockedReason;
            return (
              <div className="capability-option" data-active={enabled} key={id}>
                <Switch
                  aria-label={capabilityRegistry[id].label}
                  checked={enabled}
                  disabled={locked}
                  onCheckedChange={(checked) =>
                    setDraft((current) => setCapability(current, id, checked))
                  }
                />
                <span>
                  {capabilityRegistry[id].label}
                  <small>
                    {blockedReason ??
                      `${state} · ${capabilityRegistry[id].description}`}
                  </small>
                </span>
              </div>
            );
          })}
        </div>
      );
    case 'requiredProviders':
      return (
        <div className="selected-stack">
          {application.providers.length ? (
            application.providers.map((provider) => (
              <article key={provider.id}>
                <strong>{provider.label}</strong>
                <small>{provider.reason}</small>
              </article>
            ))
          ) : (
            <ReadOnlyValue value="No external provider required" />
          )}
        </div>
      );
    case 'authorizationModel':
      return (
        <SingleSelect
          label={property.label}
          value={draft.authorization.model}
          values={property.allowedValues ?? []}
          onValueChange={(value) =>
            setDraft((current) =>
              setCapability(current, 'rbac', value === 'rbac'),
            )
          }
        />
      );
    case 'roles':
      return (
        <RolesEditor draft={draft} resolved={resolved} setDraft={setDraft} />
      );
    case 'permissions':
      return (
        <div className="builder-options capability-options">
          {application.authorization.permissions.map((permission) => (
            <span key={permission}>{permission}</span>
          ))}
        </div>
      );
    case 'routes':
      return (
        <RoutesEditor draft={draft} resolved={resolved} setDraft={setDraft} />
      );
    case 'resources':
      return (
        <ReadOnlyList
          values={application.resources}
          empty="No external or persistent resources"
        />
      );
    case 'environment':
      return (
        <ReadOnlyList
          values={application.environment}
          empty="No provider environment variables"
        />
      );
    case 'presentation':
      return (
        <div className="design-selects">
          {(Object.keys(designChoices) as (keyof Design)[]).map((key) => (
            <label key={key}>
              <span>{title(key)}</span>
              <SingleSelect
                label={title(key)}
                value={draft.presentation[key]}
                values={designChoices[key]}
                onValueChange={(value) =>
                  setDraft({
                    ...draft,
                    presentation: {
                      ...draft.presentation,
                      [key]: value as Design[typeof key],
                    },
                  })
                }
              />
            </label>
          ))}
        </div>
      );
    case 'outputOverrides.artifactSets':
      return (
        <ArtifactSetsEditor
          draft={draft}
          resolved={resolved}
          setDraft={setDraft}
        />
      );
    case 'outputOverrides.artifacts':
      return <ArtifactsEditor resolved={resolved} setDraft={setDraft} />;
    default:
      return (
        <ReadOnlyValue value="Derived by the shared application resolver" />
      );
  }
}

function SingleSelect({
  label,
  value,
  values,
  onValueChange,
}: {
  label: string;
  value: string;
  values: readonly string[];
  onValueChange: (value: string) => void;
}) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger aria-label={label}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {values.map((option) => (
            <SelectItem value={option} key={option}>
              {title(option)}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

function ReadOnlyValue({ value }: { value: string }) {
  return <p className="builder-auto-included">{value}</p>;
}

function ReadOnlyList({
  values,
  empty,
}: {
  values: readonly string[];
  empty: string;
}) {
  return values.length ? (
    <div className="builder-options capability-options">
      {values.map((value) => (
        <span key={value}>{value}</span>
      ))}
    </div>
  ) : (
    <ReadOnlyValue value={empty} />
  );
}

function RolesEditor({
  draft,
  resolved,
  setDraft,
}: {
  draft: ConfiguratorRecipe;
  resolved: ResolvedRecipe;
  setDraft: Dispatch<SetStateAction<ConfiguratorRecipe>>;
}) {
  const roles = (
    draft.authorization.roles ??
    resolved.application.resolved.authorization.roles
  ).map((role) => ({ ...role, permissions: [...role.permissions] }));
  const available = resolved.application.resolved.authorization.permissions;

  function save(next: RoleDefinition[]) {
    setDraft((current) => ({
      ...current,
      authorization: { model: 'rbac', roles: next },
    }));
  }

  function replaceRole(index: number, role: RoleDefinition) {
    save(
      roles.map((candidate, candidateIndex) =>
        candidateIndex === index ? role : candidate,
      ),
    );
  }

  function moveRole(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= roles.length) return;
    const next = [...roles];
    const [role] = next.splice(index, 1);
    if (!role) return;
    next.splice(target, 0, role);
    save(next);
  }

  return (
    <div className="builder-options capability-options">
      {roles.map((role, index) => (
        <details key={`${role.name}-${index}`}>
          <summary>
            {role.displayName} · {role.permissions.length} permissions
          </summary>
          <div className="builder-fields">
            <label>
              <span>Name</span>
              <Input
                defaultValue={role.name}
                onBlur={(event) => {
                  const name = event.target.value.trim();
                  if (name) replaceRole(index, { ...role, name });
                }}
              />
            </label>
            <label>
              <span>Display name</span>
              <Input
                defaultValue={role.displayName}
                onBlur={(event) => {
                  const displayName = event.target.value.trim();
                  if (displayName) replaceRole(index, { ...role, displayName });
                }}
              />
            </label>
            <label>
              <span>Scope</span>
              <SingleSelect
                label={`${role.displayName} scope`}
                value={role.scope}
                values={['organization']}
                onValueChange={(scope) =>
                  replaceRole(index, {
                    ...role,
                    scope: scope as RoleDefinition['scope'],
                  })
                }
              />
            </label>
          </div>
          <div className="builder-top-actions">
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={index === 0}
              onClick={() => moveRole(index, -1)}
            >
              <ArrowUp aria-hidden="true" /> Move up
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={index === roles.length - 1}
              onClick={() => moveRole(index, 1)}
            >
              <ArrowDown aria-hidden="true" /> Move down
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={roles.length <= 2}
              onClick={() =>
                save(roles.filter((_, candidate) => candidate !== index))
              }
            >
              <Trash2 aria-hidden="true" /> Remove
            </Button>
          </div>
          {available.map((permission) => (
            <label className="capability-option" key={permission}>
              <Switch
                checked={role.permissions.includes(permission)}
                aria-label={`${role.displayName}: ${permission}`}
                onCheckedChange={(checked) =>
                  replaceRole(index, {
                    ...role,
                    permissions: checked
                      ? [...role.permissions, permission]
                      : role.permissions.filter(
                          (value) => value !== permission,
                        ),
                  })
                }
              />
              <span>{permission}</span>
            </label>
          ))}
        </details>
      ))}
      <Button
        type="button"
        variant="outline"
        onClick={() =>
          save([
            ...roles,
            {
              name: `role_${roles.length + 1}`,
              displayName: 'New role',
              scope: 'organization',
              permissions: [],
            },
          ])
        }
      >
        <Plus aria-hidden="true" /> Add role
      </Button>
    </div>
  );
}

function RoutesEditor({
  draft,
  resolved,
  setDraft,
}: {
  draft: ConfiguratorRecipe;
  resolved: ResolvedRecipe;
  setDraft: Dispatch<SetStateAction<ConfiguratorRecipe>>;
}) {
  function updateRoute(
    id: string,
    urlSegment: string,
    navigationLabel: string,
  ) {
    setDraft((current) => ({
      ...current,
      routes: [
        ...current.routes.filter((route) => route.id !== id),
        { id, urlSegment, navigationLabel },
      ],
    }));
  }
  return (
    <div className="builder-fields">
      {resolved.application.resolved.routes.map((route) => {
        const override = draft.routes.find(
          (candidate) => candidate.id === route.id,
        );
        return (
          <label key={route.id}>
            <span>
              {route.navigationLabel} · {route.routeGroup} · {route.access}
            </span>
            <Input
              aria-label={`${route.id} URL segment`}
              defaultValue={override?.urlSegment ?? route.urlSegment}
              onBlur={(event) => {
                const urlSegment = event.target.value.trim();
                if (urlSegment.startsWith('/')) {
                  updateRoute(
                    route.id,
                    urlSegment,
                    override?.navigationLabel ?? route.navigationLabel,
                  );
                }
              }}
            />
            <Input
              aria-label={`${route.id} navigation label`}
              defaultValue={override?.navigationLabel ?? route.navigationLabel}
              onBlur={(event) => {
                const navigationLabel = event.target.value.trim();
                if (navigationLabel) {
                  updateRoute(
                    route.id,
                    override?.urlSegment ?? route.urlSegment,
                    navigationLabel,
                  );
                }
              }}
            />
          </label>
        );
      })}
    </div>
  );
}

function ArtifactSetsEditor({
  draft,
  resolved,
  setDraft,
}: {
  draft: ConfiguratorRecipe;
  resolved: ResolvedRecipe;
  setDraft: Dispatch<SetStateAction<ConfiguratorRecipe>>;
}) {
  return (
    <div className="design-selects">
      {artifactSetIds.map((artifactSet) => {
        const resolvedSet = resolved.application.resolved.artifactSets.find(
          (candidate) => candidate.id === artifactSet,
        );
        if (!resolvedSet) return null;
        return (
          <label key={artifactSet}>
            <span>
              {resolvedSet.label} ·{' '}
              {resolvedSet.included ? 'included' : 'excluded'}
            </span>
            <Select
              value={
                draft.outputOverrides?.artifactSets?.[artifactSet] ?? 'INHERIT'
              }
              onValueChange={(value) =>
                setDraft((current) => ({
                  ...current,
                  outputOverrides: {
                    artifactSets: {
                      ...current.outputOverrides?.artifactSets,
                      [artifactSet]: value as 'INHERIT' | 'INCLUDE' | 'EXCLUDE',
                    },
                    artifacts: current.outputOverrides?.artifacts ?? {},
                  },
                }))
              }
            >
              <SelectTrigger aria-label={`${resolvedSet.label} output policy`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="INHERIT">Inherit</SelectItem>
                  <SelectItem
                    value="INCLUDE"
                    disabled={!resolvedSet.canInclude}
                  >
                    Include
                  </SelectItem>
                  <SelectItem
                    value="EXCLUDE"
                    disabled={!resolvedSet.canExclude}
                  >
                    Exclude
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </label>
        );
      })}
    </div>
  );
}

function ArtifactsEditor({
  resolved,
  setDraft,
}: {
  resolved: ResolvedRecipe;
  setDraft: Dispatch<SetStateAction<ConfiguratorRecipe>>;
}) {
  return (
    <div className="builder-options capability-options">
      {resolved.application.resolved.artifactSets.map((artifactSet) => (
        <details key={artifactSet.id}>
          <summary>
            {artifactSet.label} · {artifactSet.artifacts.length} artifacts ·{' '}
            {artifactSet.included ? 'included' : 'excluded'}
          </summary>
          {artifactSet.artifacts.map((artifact) => (
            <article className="capability-option" key={artifact.path}>
              {artifact.removable ? (
                <Switch
                  checked={artifact.generationPolicy !== 'EXCLUDE'}
                  disabled={!artifactSet.included}
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
              ) : (
                <strong>Locked</strong>
              )}
              <span>
                <strong>{artifact.path}</strong>
                <small>
                  Owner: {artifact.owner} · Required by:{' '}
                  {artifact.requiredBy.join(', ') || 'foundation'} · Policy:{' '}
                  {artifact.generationPolicy} · Dependencies:{' '}
                  {artifact.dependencies.join(', ') || 'none'}
                </small>
                <small>{artifact.generationReason}</small>
              </span>
            </article>
          ))}
        </details>
      ))}
    </div>
  );
}

function isPropertyVisible(
  property: PropertyDefinition,
  draft: ConfiguratorRecipe,
  resolved: ResolvedRecipe,
): boolean {
  if (
    property.id === 'providers.persistence.provider' &&
    draft.providers.persistence?.technology === 'none'
  )
    return false;
  if (
    (property.id === 'roles' || property.id === 'permissions') &&
    draft.authorization.model !== 'rbac'
  )
    return false;
  if (
    property.id === 'rls' &&
    !resolved.application.resolved.capabilities.includes('organizations')
  )
    return false;
  return true;
}

function capabilityBlockedReason(
  capability: CapabilityId,
  draft: ConfiguratorRecipe,
): string | undefined {
  const dependencies = capabilityDependencies(capability);
  const providers = new Set(
    dependencies.flatMap((id) => capabilityRegistry[id].providers),
  );
  if (draft.providers.authentication === 'none' && providers.has('clerk'))
    return 'Requires Clerk authentication. Change the provider first.';
  if (
    draft.providers.persistence?.technology === 'none' &&
    providers.has('neon')
  )
    return 'Requires PostgreSQL persistence. Change the provider first.';
  if (draft.providers.commerce === 'none' && providers.has('stripe'))
    return 'Requires Stripe through a commerce capability.';
  if (draft.authorization.model === 'none' && dependencies.includes('rbac'))
    return 'Requires RBAC. Change the authorization model first.';
  return undefined;
}

function capabilityDependencies(
  capability: CapabilityId,
  seen = new Set<CapabilityId>(),
): CapabilityId[] {
  if (seen.has(capability)) return [];
  seen.add(capability);
  return [
    capability,
    ...capabilityRegistry[capability].requires.flatMap((requirement) =>
      capabilityDependencies(requirement, seen),
    ),
  ];
}
