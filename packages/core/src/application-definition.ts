import validatePackageName from 'validate-npm-package-name';
import {
  applicationDefinitionSchema,
  capabilityIds,
  productPresetIds,
  type ApplicationDefinition,
  type ApplicationDefinitionInput,
  type Artifact,
  type ArtifactSetId,
  type CapabilityId,
  type ModuleSelection,
  type OutputPolicy,
  type PropertyDefinition,
  type PropertyState,
  type ProviderDefinition,
  type ProviderId,
  type ResolvedModules,
  type RoleDefinition,
  type RouteSurfaceDefinition,
} from '@hipster-stack/schema';
import {
  capabilityRegistry,
  resolveCapabilitySelection,
} from './capabilities.js';
import { LoadedVibesError } from './errors.js';
import { optionalSurfaceOwnership } from './ownership.js';
import type { OptionalSurfaceOwnership } from './ownership.js';
import { getProductPreset } from './presets.js';

export const providerRegistry = {
  clerk: {
    id: 'clerk',
    label: 'Clerk',
    slot: 'authentication',
    environment: [
      'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
      'CLERK_SECRET_KEY',
      'CLERK_WEBHOOK_SIGNING_SECRET',
    ],
    setup: ['Configure the Clerk application and webhook endpoint.'],
  },
  neon: {
    id: 'neon',
    label: 'Neon PostgreSQL',
    slot: 'persistence',
    environment: ['DATABASE_URL', 'DIRECT_DATABASE_URL'],
    setup: ['Provision PostgreSQL runtime and migration connections.'],
  },
  stripe: {
    id: 'stripe',
    label: 'Stripe',
    slot: 'commerce',
    environment: [
      'STRIPE_SECRET_KEY',
      'STRIPE_WEBHOOK_SECRET',
      'STRIPE_RECURRING_PRICE_ID',
    ],
    setup: ['Configure Stripe products, prices, and webhook endpoints.'],
  },
} as const satisfies Record<ProviderId, ProviderDefinition>;

export const applicationProperties = [
  property({
    id: 'preset',
    label: 'Preset',
    description:
      'Seeds one Application Definition without selecting a template.',
    type: 'select',
    category: 'Foundation',
    allowedValues: [...productPresetIds],
    affects: ['capabilities'],
  }),
  property({
    id: 'identity',
    label: 'Product identity',
    description: 'Package name, display name, and product description.',
    type: 'structured',
    category: 'Foundation',
    required: true,
    validation: ['valid-npm-package-name', 'description-max-160'],
    affects: ['generated-package', 'product-contract'],
  }),
  property({
    id: 'capabilities',
    label: 'Enabled capabilities',
    description:
      'User-visible application abilities resolved with dependencies.',
    type: 'multi-select',
    category: 'Capabilities',
    allowedValues: [...capabilityIds],
    affects: [
      'providers',
      'resources',
      'permissions',
      'routes',
      'modules',
      'artifact-sets',
    ],
  }),
  property({
    id: 'requiredProviders',
    label: 'Required providers',
    description: 'Provider requirements derived from enabled capabilities.',
    type: 'rollup',
    category: 'Integrations',
    derivedFrom: ['capabilities'],
    affects: ['environment', 'setup'],
  }),
  property({
    id: 'authorizationModel',
    label: 'Authorization model',
    description: 'Authorization is resolved independently from authentication.',
    type: 'derived',
    category: 'Identity & Access',
    allowedValues: ['rbac'],
    derivedFrom: ['capabilities.rbac'],
    affects: ['roles', 'permissions', 'artifact-sets.rbac'],
  }),
  property({
    id: 'roles',
    label: 'Roles',
    description: 'Structured RBAC roles and their effective permissions.',
    type: 'structured',
    category: 'Identity & Access',
    visibleWhen: ['authorizationModel=rbac'],
    derivedFrom: ['authorizationModel', 'capabilities'],
    affects: ['effectivePermissions'],
  }),
  property({
    id: 'routes',
    label: 'Route surfaces',
    description: 'User-facing routes derived from enabled capabilities.',
    type: 'relation',
    category: 'Routes & Navigation',
    derivedFrom: ['capabilities'],
    affects: ['generation-plan'],
  }),
  property({
    id: 'outputOverrides.artifactSets',
    label: 'Artifact-set output policy',
    description: 'Advanced INHERIT, INCLUDE, or safe EXCLUDE policy.',
    type: 'structured',
    category: 'Output',
    allowedValues: ['INHERIT', 'INCLUDE', 'EXCLUDE'],
    requires: ['valid-capability-dependencies'],
    affects: ['generation-plan'],
  }),
] as const satisfies readonly PropertyDefinition[];

function property(
  value: Omit<
    PropertyDefinition,
    | 'required'
    | 'visibleWhen'
    | 'enabledWhen'
    | 'requires'
    | 'conflictsWith'
    | 'derivedFrom'
    | 'affects'
    | 'validation'
  > &
    Partial<
      Pick<
        PropertyDefinition,
        | 'required'
        | 'visibleWhen'
        | 'enabledWhen'
        | 'requires'
        | 'conflictsWith'
        | 'derivedFrom'
        | 'affects'
        | 'validation'
      >
    >,
): PropertyDefinition {
  return {
    required: false,
    visibleWhen: [],
    enabledWhen: [],
    requires: [],
    conflictsWith: [],
    derivedFrom: [],
    affects: [],
    validation: [],
    ...value,
  };
}

const roleRegistry = [
  role('owner', 'Owner', [
    'organization.read',
    'organization.manage',
    'membership.read',
    'membership.manage',
    'invitation.manage',
    'project.read',
    'project.create',
    'project.update',
    'project.archive',
    'audit.read',
    'billing.manage',
    'connect.manage',
    'media.read',
    'media.manage',
    'ai.use',
    'map.read',
    'map.manage',
  ]),
  role('admin', 'Administrator', [
    'organization.read',
    'membership.read',
    'membership.manage',
    'invitation.manage',
    'project.read',
    'project.create',
    'project.update',
    'project.archive',
    'audit.read',
    'media.read',
    'media.manage',
    'ai.use',
    'map.read',
    'map.manage',
  ]),
  role('member', 'Member', [
    'organization.read',
    'membership.read',
    'project.read',
    'project.create',
    'project.update',
    'media.read',
    'media.manage',
    'ai.use',
    'map.read',
  ]),
  role('viewer', 'Viewer', [
    'organization.read',
    'membership.read',
    'project.read',
    'media.read',
    'map.read',
  ]),
] as const satisfies readonly RoleDefinition[];

function role(
  name: string,
  displayName: string,
  permissions: string[],
): RoleDefinition {
  return { name, displayName, scope: 'organization', permissions };
}

const routeRegistry: Record<string, RouteSurfaceDefinition> = {
  application: route('application', '/dashboard', 'authenticated'),
  'organization-settings': route(
    'organization-settings',
    '/settings',
    'authorized',
  ),
  team: route('team', '/team', 'authorized', 'invitations'),
  'member-settings': route(
    'member-settings',
    '/settings/members',
    'authorized',
    'invitations',
  ),
  billing: route('billing', '/settings/billing', 'authorized', 'billing'),
  checkout: route('checkout', '/checkout', 'authorized', 'billing'),
  connect: route(
    'connect',
    '/api/stripe/connect',
    'authorized',
    'stripeConnect',
  ),
  onboarding: route('onboarding', '/onboarding', 'authenticated', 'onboarding'),
  admin: route('admin', '/admin', 'authorized', 'admin'),
  marketing: route('marketing', '/pricing', 'public', 'marketing'),
  projects: route('projects', '/projects', 'authorized', 'sampleDomain'),
};

function route(
  id: string,
  urlSegment: string,
  access: RouteSurfaceDefinition['access'],
  capability?: CapabilityId,
): RouteSurfaceDefinition {
  return capability
    ? { id, urlSegment, access, capability }
    : { id, urlSegment, access };
}

export interface ResolutionReason {
  selection: CapabilityId;
  requiredBy: readonly (CapabilityId | 'architecture')[];
  reason: string;
}

export interface ResolvedArtifactSet {
  id: ArtifactSetId;
  label: string;
  policy: OutputPolicy;
  requiredBy: readonly CapabilityId[];
  artifacts: readonly Artifact[];
}

export interface ResolvedApplicationDefinition {
  definition: ApplicationDefinition & {
    identity: ApplicationDefinition['identity'] & { displayName: string };
  };
  capabilities: readonly CapabilityId[];
  autoIncluded: readonly CapabilityId[];
  providers: readonly (ProviderDefinition & {
    requiredBy: readonly CapabilityId[];
  })[];
  resources: readonly string[];
  authorization: {
    model: 'rbac' | 'none';
    roles: readonly RoleDefinition[];
    permissions: readonly string[];
  };
  routes: readonly RouteSurfaceDefinition[];
  modules: readonly string[];
  artifactSets: readonly ResolvedArtifactSet[];
  environment: readonly string[];
  setup: readonly string[];
  propertyStates: Readonly<Record<string, PropertyState>>;
  reasons: readonly ResolutionReason[];
  status: 'valid' | 'valid-with-setup-required';
}

export interface ApplicationGenerationPlan {
  definition: ResolvedApplicationDefinition['definition'];
  selectedCapabilities: readonly CapabilityId[];
  selectedProviders: readonly ProviderId[];
  requiredResources: readonly string[];
  effectivePermissions: readonly string[];
  routes: readonly RouteSurfaceDefinition[];
  modules: readonly string[];
  artifactSets: readonly ResolvedArtifactSet[];
  artifacts: readonly Artifact[];
  environmentRequirements: readonly string[];
  setupInstructions: readonly string[];
}

export interface ApplicationResolution {
  resolved: ResolvedApplicationDefinition;
  plan: ApplicationGenerationPlan;
}

export function resolveApplicationDefinition(
  input: ApplicationDefinitionInput,
): ApplicationResolution {
  const parsed = applicationDefinitionSchema.safeParse(input);
  if (!parsed.success) {
    throw new LoadedVibesError('INVALID_CONFIG', parsed.error.message);
  }
  assertPackageName(parsed.data.identity.packageName);

  const preset = getProductPreset(parsed.data.preset);
  const overrides = capabilityOverrides(parsed.data.capabilities);
  const capabilityResolution = resolveCapabilitySelection(
    preset.modules,
    overrides,
  );
  const selectedCapabilities = capabilityIds.filter((id) =>
    enabled(capabilityResolution.modules, id),
  );
  const propertyStates = resolvePropertyStates(
    parsed.data,
    preset.modules,
    capabilityResolution.autoIncluded,
  );
  const reasons = selectedCapabilities.map((selection) => ({
    selection,
    requiredBy: capabilityResolution.requiredBy[selection] ?? [],
    reason: capabilityResolution.requiredBy[selection]?.length
      ? `${capabilityRegistry[selection].label} is required by ${(
          capabilityResolution.requiredBy[selection] ?? []
        )
          .map((id) =>
            id === 'architecture'
              ? 'the architecture'
              : capabilityRegistry[id].label,
          )
          .join(', ')}.`
      : `${capabilityRegistry[selection].label} was selected by the preset or user.`,
  }));
  const providers = providersFor(selectedCapabilities);
  const resources = unique(
    selectedCapabilities.flatMap((id) => capabilityRegistry[id].resources),
  );
  const permissions = unique(
    selectedCapabilities.flatMap((id) => capabilityRegistry[id].permissions),
  );
  const routes = unique(
    selectedCapabilities.flatMap((id) => capabilityRegistry[id].routes),
  ).map((id) => routeRegistry[id] ?? route(id, `/${id}`, 'authorized'));
  const modules = unique(
    selectedCapabilities.flatMap((id) => capabilityRegistry[id].modules),
  );
  const artifactSets = resolveArtifactSets(
    selectedCapabilities,
    parsed.data.outputOverrides.artifactSets,
  );
  const environment = unique(
    providers.flatMap((provider) => provider.environment),
  );
  const setup = unique(providers.flatMap((provider) => provider.setup));
  const definition = {
    ...parsed.data,
    identity: {
      ...parsed.data.identity,
      displayName:
        parsed.data.identity.displayName ?? parsed.data.identity.packageName,
    },
  };
  const resolved: ResolvedApplicationDefinition = {
    definition,
    capabilities: selectedCapabilities,
    autoIncluded: capabilityResolution.autoIncluded,
    providers,
    resources,
    authorization: {
      model: selectedCapabilities.includes('rbac') ? 'rbac' : 'none',
      roles: selectedCapabilities.includes('rbac') ? roleRegistry : [],
      permissions,
    },
    routes,
    modules,
    artifactSets,
    environment,
    setup,
    propertyStates,
    reasons,
    status: setup.length ? 'valid-with-setup-required' : 'valid',
  };
  return {
    resolved,
    plan: {
      definition,
      selectedCapabilities,
      selectedProviders: providers.map((provider) => provider.id),
      requiredResources: resources,
      effectivePermissions: permissions,
      routes,
      modules,
      artifactSets,
      artifacts: artifactSets.flatMap((artifactSet) => artifactSet.artifacts),
      environmentRequirements: environment,
      setupInstructions: setup,
    },
  };
}

function assertPackageName(packageName: string): void {
  const validation = validatePackageName(packageName);
  if (validation.validForNewPackages) return;
  throw new LoadedVibesError(
    'INVALID_PROJECT_NAME',
    `Invalid project name "${packageName}": ${[
      ...(validation.errors ?? []),
      ...(validation.warnings ?? []),
    ].join('; ')}`,
  );
}

function capabilityOverrides(
  selection: ApplicationDefinition['capabilities'],
): ModuleSelection {
  const overrides: ModuleSelection = {};
  for (const id of selection.include) {
    if (id === 'sampleDomain') overrides.sampleDomain = 'projects';
    else overrides[id] = true;
  }
  for (const id of selection.exclude) overrides[id] = false;
  return overrides;
}

function enabled(modules: ResolvedModules, id: CapabilityId): boolean {
  return id === 'sampleDomain' ? modules.sampleDomain !== false : modules[id];
}

function resolvePropertyStates(
  definition: ApplicationDefinition,
  presetModules: ResolvedModules,
  autoIncluded: readonly CapabilityId[],
): Record<string, PropertyState> {
  const states: Record<string, PropertyState> = {
    preset: 'USER',
    identity: 'USER',
    presentation: 'USER',
    requiredProviders: 'DERIVED',
    authorizationModel: 'DERIVED',
    roles: 'DERIVED',
    routes: 'DERIVED',
  };
  for (const id of capabilityIds) {
    const explicit =
      definition.capabilities.include.includes(id) ||
      definition.capabilities.exclude.includes(id);
    states[`capabilities.${id}`] = capabilityRegistry[id].fixed
      ? 'LOCKED'
      : autoIncluded.includes(id)
        ? 'REQUIRED'
        : explicit
          ? 'USER'
          : enabled(presetModules, id)
            ? 'PRESET'
            : 'DEFAULT';
  }
  return states;
}

function providersFor(
  capabilities: readonly CapabilityId[],
): (ProviderDefinition & { requiredBy: CapabilityId[] })[] {
  return Object.values(providerRegistry)
    .map((provider) => ({
      ...provider,
      requiredBy: capabilities.filter((id) =>
        capabilityRegistry[id].providers.includes(provider.id),
      ),
    }))
    .filter((provider) => provider.requiredBy.length > 0);
}

function resolveArtifactSets(
  selectedCapabilities: readonly CapabilityId[],
  overrides: Partial<Record<ArtifactSetId, OutputPolicy>>,
): ResolvedArtifactSet[] {
  for (const [artifactSet, policy] of Object.entries(overrides) as [
    ArtifactSetId,
    OutputPolicy,
  ][]) {
    const requiredBy = selectedCapabilities.filter((id) =>
      capabilityRegistry[id].artifactSets.includes(artifactSet),
    );
    if (policy === 'EXCLUDE' && requiredBy.length) {
      throw new LoadedVibesError(
        'UNSUPPORTED_CONFIGURATION',
        `Artifact set "${artifactSet}" cannot be excluded because it is required by ${requiredBy.join(', ')}.`,
      );
    }
    if (policy === 'INCLUDE' && !requiredBy.length) {
      throw new LoadedVibesError(
        'UNSUPPORTED_CONFIGURATION',
        `Artifact set "${artifactSet}" cannot be included without its owning capability.`,
      );
    }
  }

  const sets = selectedCapabilities.flatMap((capability) =>
    capabilityRegistry[capability].artifactSets.map((id) => ({
      id,
      capability,
    })),
  );
  return uniqueBy(sets, (entry) => entry.id).map(({ id, capability }) => {
    const ownership = (
      optionalSurfaceOwnership as Partial<
        Record<CapabilityId, OptionalSurfaceOwnership>
      >
    )[capability];
    const artifacts = (ownership?.remove ?? []).map(
      (path): Artifact => ({
        path,
        owner: `${capabilityRegistry[capability].label} module`,
        artifactSet: id,
        requiredBy: [capability],
        removable: false,
        generationReason: `${capabilityRegistry[capability].label} is enabled.`,
      }),
    );
    return {
      id,
      label: capabilityRegistry[capability].label,
      policy: overrides[id] ?? 'INHERIT',
      requiredBy: selectedCapabilities.filter((candidate) =>
        capabilityRegistry[candidate].artifactSets.includes(id),
      ),
      artifacts,
    };
  });
}

function unique<T>(values: readonly T[]): T[] {
  return [...new Set(values)];
}

function uniqueBy<T>(values: readonly T[], key: (value: T) => string): T[] {
  return values.filter(
    (value, index) =>
      values.findIndex((candidate) => key(candidate) === key(value)) === index,
  );
}
