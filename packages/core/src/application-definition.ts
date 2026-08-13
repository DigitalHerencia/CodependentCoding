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
  type ProviderSelection,
  type ResolvedModules,
  type RoleDefinition,
  type RouteSurfaceDefinition,
} from '@hipster-stack/schema';
import {
  capabilityRegistry,
  resolveCapabilitySelection,
} from './capabilities.js';
import { LoadedVibesError } from './errors.js';
import {
  optionalSurfaceOwnership,
  providerSurfaceOwnership,
} from './ownership.js';
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
    id: 'providers.authentication',
    label: 'Authentication provider',
    description: 'Select Clerk or generate without authentication.',
    type: 'select',
    category: 'Identity',
    allowedValues: ['none', 'clerk'],
    affects: ['packages', 'environment', 'routes', 'artifact-sets'],
  }),
  property({
    id: 'providers.persistence.technology',
    label: 'Database technology',
    description: 'Select PostgreSQL or generate without persistence.',
    type: 'select',
    category: 'Data',
    allowedValues: ['none', 'postgresql'],
    affects: ['provider', 'resources', 'packages', 'artifact-sets'],
  }),
  property({
    id: 'providers.persistence.provider',
    label: 'PostgreSQL provider',
    description: 'Neon is the supported PostgreSQL provider.',
    type: 'select',
    category: 'Data',
    allowedValues: ['none', 'neon'],
    visibleWhen: ['providers.persistence.technology=postgresql'],
    affects: ['environment', 'setup', 'artifact-sets'],
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
    type: 'select',
    category: 'Identity & Access',
    allowedValues: ['rbac', 'none'],
    affects: ['roles', 'permissions', 'artifact-sets.rbac'],
  }),
  property({
    id: 'roles',
    label: 'Roles',
    description: 'Structured RBAC roles and their effective permissions.',
    type: 'reorderable',
    category: 'Identity & Access',
    visibleWhen: ['authorizationModel=rbac'],
    derivedFrom: ['authorizationModel', 'capabilities'],
    affects: ['effectivePermissions'],
  }),
  property({
    id: 'permissions',
    label: 'Role permissions',
    description: 'Capability-derived permission vocabulary assigned to roles.',
    type: 'multi-select',
    category: 'Identity & Access',
    visibleWhen: ['authorizationModel=rbac'],
    derivedFrom: ['capabilities'],
    affects: ['roles', 'authorization'],
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
  property({
    id: 'outputOverrides.artifacts',
    label: 'Advanced artifact policy',
    description: 'Safe leaf-level overrides for independently removable files.',
    type: 'structured',
    category: 'Output',
    allowedValues: ['INHERIT', 'INCLUDE', 'EXCLUDE'],
    requires: ['artifact.removable=true'],
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
  const base = {
    id,
    urlSegment,
    routeGroup:
      id === 'connect'
        ? 'root'
        : id === 'checkout'
          ? '(billing)'
          : id === 'onboarding'
            ? '(onboarding)'
            : id === 'admin'
              ? '(admin)'
              : access === 'public'
                ? '(public)'
                : '(tenant)',
    navigationLabel:
      id === 'application'
        ? 'Dashboard'
        : id === 'organization-settings'
          ? 'Settings'
          : id === 'marketing'
            ? 'Pricing'
            : id
                .split('-')
                .map((word) => `${word[0]?.toUpperCase()}${word.slice(1)}`)
                .join(' '),
    access,
  };
  return capability ? { ...base, capability } : base;
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
  included: boolean;
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
    reason: string;
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
  requiredPackages: readonly string[];
  filesRetained: readonly string[];
  filesOmitted: readonly string[];
  transforms: readonly string[];
  validationRequirements: readonly string[];
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
  if (
    parsed.data.authorization.model === 'rbac' &&
    parsed.data.capabilities.exclude.includes('rbac')
  ) {
    throw new LoadedVibesError(
      'UNSUPPORTED_CONFIGURATION',
      'RBAC cannot be excluded while the authorization model is "rbac".',
    );
  }

  const preset = getProductPreset(parsed.data.preset);
  const overrides = capabilityOverrides(
    parsed.data.capabilities,
    parsed.data.authorization.model,
  );
  const capabilityResolution = resolveCapabilitySelection(
    preset.modules,
    overrides,
  );
  const selectedCapabilities = capabilityIds.filter((id) =>
    enabled(capabilityResolution.modules, id),
  );
  if (
    parsed.data.authorization.model === 'none' &&
    selectedCapabilities.includes('rbac')
  ) {
    const dependents = selectedCapabilities.filter((id) =>
      capabilityRegistry[id].requires.includes('rbac'),
    );
    throw new LoadedVibesError(
      'UNSUPPORTED_CONFIGURATION',
      `Authorization model "none" cannot satisfy ${
        dependents.length
          ? dependents.map((id) => capabilityRegistry[id].label).join(', ')
          : 'the selected RBAC capability'
      }.`,
    );
  }
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
  const providers = providersFor(selectedCapabilities, parsed.data.providers);
  const resources = unique(
    selectedCapabilities.flatMap((id) => capabilityRegistry[id].resources),
  );
  const permissions = unique(
    selectedCapabilities.flatMap((id) => capabilityRegistry[id].permissions),
  );
  const routes = applyRouteOverrides(
    unique(
      selectedCapabilities.flatMap((id) => capabilityRegistry[id].routes),
    ).map((id) => routeRegistry[id] ?? route(id, `/${id}`, 'authorized')),
    parsed.data.routes,
  );
  if (
    parsed.data.providers.authentication === 'none' &&
    routes.some((route) => route.access !== 'public')
  ) {
    throw new LoadedVibesError(
      'UNSUPPORTED_CONFIGURATION',
      'Authentication provider "none" cannot be combined with authenticated or authorized routes.',
    );
  }
  const modules = unique(
    selectedCapabilities.flatMap((id) => capabilityRegistry[id].modules),
  );
  const artifactSets = resolveArtifactSets(
    selectedCapabilities,
    providers,
    parsed.data.outputOverrides.artifactSets,
    parsed.data.outputOverrides.artifacts,
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
      roles: selectedCapabilities.includes('rbac')
        ? resolveRoles(parsed.data.authorization.roles, permissions)
        : [],
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
      requiredPackages: packagesFor(providers.map((provider) => provider.id)),
      filesRetained: artifactSets
        .flatMap((artifactSet) => artifactSet.artifacts)
        .filter((artifact) => artifact.generationPolicy !== 'EXCLUDE')
        .map((artifact) => artifact.path),
      filesOmitted: artifactSets
        .flatMap((artifactSet) => artifactSet.artifacts)
        .filter((artifact) => artifact.generationPolicy === 'EXCLUDE')
        .map((artifact) => artifact.path)
        .concat(
          Object.values(optionalSurfaceOwnership)
            .filter(
              (ownership) =>
                !selectedCapabilities.includes(ownership.capability),
            )
            .flatMap((ownership) => [...ownership.remove]),
          Object.entries(providerSurfaceOwnership)
            .filter(
              ([provider]) =>
                !providers.some((candidate) => candidate.id === provider),
            )
            .flatMap(([, paths]) => [...paths]),
        ),
      transforms: [
        ...providers.map(
          (provider) => `Compose ${provider.label} in ${provider.slot} slot`,
        ),
        ...parsed.data.routes.map(
          (route) => `Map ${route.id} to ${route.urlSegment}`,
        ),
        'Rewrite package, environment, route, and product contracts',
      ],
      validationRequirements: ['typecheck', 'targeted capability contracts'],
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
  authorizationModel: ApplicationDefinition['authorization']['model'],
): ModuleSelection {
  const overrides: ModuleSelection = {};
  for (const id of selection.include) {
    if (id === 'sampleDomain') overrides.sampleDomain = 'projects';
    else overrides[id] = true;
  }
  for (const id of selection.exclude) overrides[id] = false;
  overrides.rbac = authorizationModel === 'rbac';
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
    authorizationModel: 'USER',
    roles: definition.authorization.roles ? 'USER' : 'DERIVED',
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
  states['providers.authentication'] = definition.providers.authentication
    ? 'USER'
    : 'DERIVED';
  states['providers.persistence'] = definition.providers.persistence
    ? 'USER'
    : 'DERIVED';
  states['providers.commerce'] = definition.providers.commerce
    ? 'USER'
    : 'DERIVED';
  return states;
}

function providersFor(
  capabilities: readonly CapabilityId[],
  selection: ProviderSelection,
): (ProviderDefinition & {
  requiredBy: CapabilityId[];
  reason: string;
})[] {
  const required = Object.values(providerRegistry)
    .map((provider) => ({
      ...provider,
      requiredBy: capabilities.filter((id) =>
        capabilityRegistry[id].providers.includes(provider.id),
      ),
    }))
    .filter((provider) => provider.requiredBy.length > 0);
  assertProviderSelection('clerk', selection.authentication, required);
  assertProviderSelection('neon', selection.persistence?.provider, required);
  assertProviderSelection('stripe', selection.commerce, required);

  if (
    selection.commerce === 'stripe' &&
    !required.some((provider) => provider.id === 'stripe')
  ) {
    throw new LoadedVibesError(
      'UNSUPPORTED_CONFIGURATION',
      'Stripe must be selected through Billing or Stripe Connect.',
    );
  }

  const explicitlySelected: ProviderId[] = [
    ...(selection.authentication === 'clerk' ? (['clerk'] as const) : []),
    ...(selection.persistence?.provider === 'neon' ? (['neon'] as const) : []),
    ...(selection.commerce === 'stripe' ? (['stripe'] as const) : []),
  ];
  return Object.values(providerRegistry)
    .filter(
      (provider) =>
        required.some((candidate) => candidate.id === provider.id) ||
        explicitlySelected.includes(provider.id),
    )
    .map((provider) => {
      const requiredBy = required.find(
        (candidate) => candidate.id === provider.id,
      )?.requiredBy ?? [];
      return {
        ...provider,
        requiredBy,
        reason: requiredBy.length
          ? `Required by ${requiredBy.map((id) => capabilityRegistry[id].label).join(', ')}.`
          : 'Selected explicitly by the user.',
      };
    });
}

function assertProviderSelection(
  provider: ProviderId,
  selection: string | undefined,
  required: readonly { id: ProviderId; requiredBy: CapabilityId[] }[],
): void {
  const requirement = required.find((candidate) => candidate.id === provider);
  if (!requirement || selection === undefined || selection === provider) return;
  throw new LoadedVibesError(
    'UNSUPPORTED_CONFIGURATION',
    `${providerRegistry[provider].label} is required by ${requirement.requiredBy.map((id) => capabilityRegistry[id].label).join(', ')}; the ${providerRegistry[provider].slot} slot cannot be "none".`,
  );
}

function resolveArtifactSets(
  selectedCapabilities: readonly CapabilityId[],
  providers: readonly (ProviderDefinition & {
    requiredBy: readonly CapabilityId[];
  })[],
  overrides: Partial<Record<ArtifactSetId, OutputPolicy>>,
  artifactOverrides: Record<string, OutputPolicy>,
): ResolvedArtifactSet[] {
  for (const [artifactSet, policy] of Object.entries(overrides) as [
    ArtifactSetId,
    OutputPolicy,
  ][]) {
    if (artifactSet === 'application-shell' && policy === 'EXCLUDE') {
      throw new LoadedVibesError(
        'UNSUPPORTED_CONFIGURATION',
        'The application shell is architecture-critical and cannot be excluded.',
      );
    }
    const provider = providers.find(
      (candidate) => providerArtifactSet(candidate.id) === artifactSet,
    );
    const requiredBy = provider
      ? [...provider.requiredBy]
      : selectedCapabilities.filter((id) =>
          capabilityRegistry[id].artifactSets.includes(artifactSet),
        );
    if (policy === 'EXCLUDE' && (requiredBy.length || provider)) {
      throw new LoadedVibesError(
        'UNSUPPORTED_CONFIGURATION',
        `Artifact set "${artifactSet}" cannot be excluded because it is required by ${requiredBy.length ? requiredBy.join(', ') : provider?.label}.`,
      );
    }
    if (
      policy === 'INCLUDE' &&
      !requiredBy.length &&
      !provider &&
      artifactSet !== 'application-shell'
    ) {
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
  const capabilitySets = uniqueBy(sets, (entry) => entry.id).map(
    ({ id, capability }) => {
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
        removable: isSafelyRemovable(path),
        generationPolicy: isSafelyRemovable(path)
          ? (artifactOverrides[path] ?? 'INHERIT')
          : 'LOCKED',
        replacementPolicy: 'remove',
        dependencies: [capability],
        generationReason: `${capabilityRegistry[capability].label} is enabled.`,
      }),
    );
    for (const artifact of artifacts) {
      if (
        artifactOverrides[artifact.path] === 'EXCLUDE' &&
        !artifact.removable
      ) {
        throw new LoadedVibesError(
          'UNSUPPORTED_CONFIGURATION',
          `Artifact "${artifact.path}" is locked and cannot be excluded.`,
        );
      }
    }
      return {
      id,
      label: capabilityRegistry[capability].label,
      policy: overrides[id] ?? 'INHERIT',
      included: true,
      requiredBy: selectedCapabilities.filter((candidate) =>
        capabilityRegistry[candidate].artifactSets.includes(id),
      ),
      artifacts,
      };
    },
  );
  const shellArtifacts = [
    'app/layout.tsx',
    'app/page.tsx',
    'app/globals.css',
    'components/ui',
    'components/brand',
    'content',
    'public',
    'package.json',
  ].map(
    (path): Artifact => ({
      path,
      owner: 'Application shell',
      artifactSet: 'application-shell',
      requiredBy: [],
      removable: false,
      generationPolicy: 'LOCKED',
      replacementPolicy: 'transform',
      dependencies: [],
      generationReason: 'Required by the standalone application architecture.',
    }),
  );
  const providerSets = providers.map((provider): ResolvedArtifactSet => {
    const artifactSet =
      provider.id === 'clerk'
        ? 'authentication-clerk'
        : provider.id === 'neon'
          ? 'persistence-postgresql'
          : 'commerce-stripe';
    const artifacts = providerSurfaceOwnership[provider.id].map(
      (path): Artifact => ({
        path,
        owner: `${provider.label} provider module`,
        artifactSet,
        requiredBy: [...provider.requiredBy],
        removable: isSafelyRemovable(path),
        generationPolicy: isSafelyRemovable(path)
          ? (artifactOverrides[path] ?? 'INHERIT')
          : 'LOCKED',
        replacementPolicy: 'remove',
        dependencies: [provider.id],
        generationReason: provider.requiredBy.length
          ? `${provider.label} is required by ${provider.requiredBy.join(', ')}.`
          : `${provider.label} was selected explicitly.`,
      }),
    );
    return {
      id: artifactSet,
      label: `${provider.label} provider`,
      policy: overrides[artifactSet] ?? 'INHERIT',
      included: true,
      requiredBy: [...provider.requiredBy],
      artifacts,
    };
  });
  const resolvedSets: ResolvedArtifactSet[] = [
    {
      id: 'application-shell',
      label: 'Application shell',
      policy: 'INHERIT',
      included: true,
      requiredBy: [],
      artifacts: shellArtifacts,
    },
    ...providerSets,
    ...capabilitySets,
  ];
  for (const [path, policy] of Object.entries(artifactOverrides)) {
    const artifact = resolvedSets
      .flatMap((set) => set.artifacts)
      .find((candidate) => candidate.path === path);
    if (!artifact) {
      throw new LoadedVibesError(
        'UNSUPPORTED_CONFIGURATION',
        `Artifact "${path}" is not generated by the selected application.`,
      );
    }
    if (policy === 'EXCLUDE' && !artifact.removable) {
      throw new LoadedVibesError(
        'UNSUPPORTED_CONFIGURATION',
        `Artifact "${path}" is locked and cannot be excluded.`,
      );
    }
  }
  return resolvedSets;
}

function providerArtifactSet(provider: ProviderId): ArtifactSetId {
  return provider === 'clerk'
    ? 'authentication-clerk'
    : provider === 'neon'
      ? 'persistence-postgresql'
      : 'commerce-stripe';
}

function applyRouteOverrides(
  routes: RouteSurfaceDefinition[],
  overrides: ApplicationDefinition['routes'],
): RouteSurfaceDefinition[] {
  for (const override of overrides) {
    if (!routes.some((route) => route.id === override.id)) {
      throw new LoadedVibesError(
        'UNSUPPORTED_CONFIGURATION',
        `Route "${override.id}" cannot be configured because its capability is not enabled.`,
      );
    }
  }
  const directlyResolved = routes.map((route) => {
    const override = overrides.find((candidate) => candidate.id === route.id);
    return override
      ? {
          ...route,
          urlSegment: override.urlSegment,
          navigationLabel: override.navigationLabel ?? route.navigationLabel,
        }
      : route;
  });
  const settings = directlyResolved.find(
    (route) => route.id === 'organization-settings',
  );
  const resolved = directlyResolved.map((route) => {
    if (
      settings &&
      !overrides.some((override) => override.id === route.id) &&
      (route.id === 'member-settings' || route.id === 'billing')
    ) {
      return {
        ...route,
        urlSegment: `${settings.urlSegment}/${
          route.id === 'member-settings' ? 'members' : 'billing'
        }`,
      };
    }
    return route;
  });
  const duplicates = resolved.filter(
    (route, index) =>
      resolved.findIndex(
        (candidate) => candidate.urlSegment === route.urlSegment,
      ) !== index,
  );
  if (duplicates.length) {
    throw new LoadedVibesError(
      'UNSUPPORTED_CONFIGURATION',
      `Route URL segments must be unique: ${duplicates.map((route) => route.urlSegment).join(', ')}.`,
    );
  }
  return resolved;
}

function resolveRoles(
  configured: ApplicationDefinition['authorization']['roles'],
  availablePermissions: readonly string[],
): readonly RoleDefinition[] {
  if (!configured) {
    return roleRegistry.map((role) => ({
      ...role,
      permissions: role.permissions.filter((permission) =>
        availablePermissions.includes(permission),
      ),
    }));
  }
  for (const role of configured) {
    const dangling = role.permissions.filter(
      (permission) => !availablePermissions.includes(permission),
    );
    if (dangling.length) {
      throw new LoadedVibesError(
        'UNSUPPORTED_CONFIGURATION',
        `Role "${role.displayName}" contains unavailable permissions: ${dangling.join(', ')}.`,
      );
    }
  }
  return configured;
}

function packagesFor(providers: readonly ProviderId[]): string[] {
  return unique(
    providers.flatMap((provider) =>
      provider === 'clerk'
        ? ['@clerk/nextjs']
        : provider === 'neon'
          ? [
              '@neondatabase/serverless',
              '@prisma/adapter-neon',
              '@prisma/client',
              'prisma',
            ]
          : ['stripe'],
    ),
  );
}

function isSafelyRemovable(path: string): boolean {
  return (
    path.startsWith('tests/') ||
    path.startsWith('docs/') ||
    path.endsWith('/AGENTS.md')
  );
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
