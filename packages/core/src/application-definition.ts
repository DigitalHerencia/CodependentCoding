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
import { getProductPreset } from './presets.js';
import { templateArtifactPaths } from './template-artifact-catalog.js';

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
    id: 'architectureVersion',
    label: 'Architecture version',
    description: 'The supported Hipster Stack architecture contract.',
    type: 'derived',
    category: 'Foundation',
    derivedFrom: ['schemaVersion'],
  }),
  property({
    id: 'tenantModel',
    label: 'Tenant model',
    description: 'Derived from the Organizations capability.',
    type: 'derived',
    category: 'Data',
    allowedValues: ['none', 'organizations'],
    derivedFrom: ['capabilities.organizations'],
    affects: ['rls', 'routes', 'resources'],
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
    id: 'rls',
    label: 'PostgreSQL row-level security',
    description:
      'Required when organization-scoped PostgreSQL persistence is selected.',
    type: 'derived',
    category: 'Data',
    visibleWhen: ['capabilities.organizations'],
    derivedFrom: [
      'capabilities.organizations',
      'providers.persistence.technology',
    ],
    affects: ['persistence-postgresql'],
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
    id: 'resources',
    label: 'Required resources',
    description: 'Resources derived through capability relations.',
    type: 'rollup',
    category: 'Integrations',
    derivedFrom: ['capabilities'],
    affects: ['generation-plan'],
  }),
  property({
    id: 'environment',
    label: 'Environment requirements',
    description: 'Environment variables derived from selected providers.',
    type: 'rollup',
    category: 'Integrations',
    derivedFrom: ['requiredProviders'],
    affects: ['setup'],
  }),
  property({
    id: 'presentation',
    label: 'Presentation',
    description: 'Supported visual and navigation direction.',
    type: 'structured',
    category: 'Presentation',
    affects: ['design-contract', 'generated-styles'],
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

const foundationPackages = [
  '@hookform/resolvers',
  '@radix-ui/react-accordion',
  '@radix-ui/react-avatar',
  '@radix-ui/react-checkbox',
  '@radix-ui/react-dialog',
  '@radix-ui/react-dropdown-menu',
  '@radix-ui/react-label',
  '@radix-ui/react-progress',
  '@radix-ui/react-separator',
  '@radix-ui/react-slot',
  '@radix-ui/react-switch',
  '@radix-ui/react-tabs',
  'babel-plugin-react-compiler',
  'class-variance-authority',
  'clsx',
  'dotenv',
  'lucide-react',
  'next',
  'react',
  'react-dom',
  'react-hook-form',
  'server-only',
  'tailwind-merge',
  'tw-animate-css',
  'yaml',
  'zod',
] as const;

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
  uploads: route('uploads', '/uploads', 'authorized', 'uploads'),
  ai: route('ai', '/ai', 'authorized', 'ai'),
  maps: route('maps', '/maps', 'authorized', 'maps'),
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
        : id === 'ai'
          ? 'AI'
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
  canInclude: boolean;
  canExclude: boolean;
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
  const roles = selectedCapabilities.includes('rbac')
    ? resolveRoles(parsed.data.authorization.roles, permissions)
    : [];
  if (selectedCapabilities.includes('invitations') && roles.length < 2) {
    throw new LoadedVibesError(
      'UNSUPPORTED_CONFIGURATION',
      'Invitations require at least two organization roles so the primary role cannot be assigned by invitation.',
    );
  }
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
    providers
      .flatMap((provider) => provider.environment)
      .concat(
        selectedCapabilities.flatMap(
          (capability) => capabilityRegistry[capability].environment,
        ),
      ),
  );
  const setup = unique(
    providers
      .flatMap((provider) => provider.setup)
      .concat(
        selectedCapabilities.flatMap(
          (capability) => capabilityRegistry[capability].setup,
        ),
      ),
  );
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
      roles,
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
      requiredPackages: unique([
        ...foundationPackages,
        ...packagesFor(providers.map((provider) => provider.id)),
      ]),
      filesRetained: artifactSets
        .flatMap((artifactSet) => artifactSet.artifacts)
        .filter((artifact) => artifact.generationPolicy !== 'EXCLUDE')
        .map((artifact) => artifact.path),
      filesOmitted: artifactSets
        .flatMap((artifactSet) => artifactSet.artifacts)
        .filter((artifact) => artifact.generationPolicy === 'EXCLUDE')
        .map((artifact) => artifact.path),
      transforms: [
        ...providers.map(
          (provider) => `Compose ${provider.label} in ${provider.slot} slot`,
        ),
        ...parsed.data.routes.map(
          (route) => `Map ${route.id} to ${route.urlSegment}`,
        ),
        ...(roles.length
          ? [`Configure ${roles.length} ordered RBAC roles and permissions`]
          : []),
        'Rewrite package, environment, route, authorization, and product contracts',
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
    architectureVersion: 'LOCKED',
    tenantModel: 'DERIVED',
    rls: 'DERIVED',
    resources: 'DERIVED',
    environment: 'DERIVED',
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
      const requiredBy =
        required.find((candidate) => candidate.id === provider.id)
          ?.requiredBy ?? [];
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
  const ownership = templateArtifactPaths.map((path) =>
    resolveArtifactOwnership(path, selectedCapabilities, providers),
  );
  const grouped = new Map<ArtifactSetId, typeof ownership>();
  for (const artifact of ownership) {
    const current = grouped.get(artifact.artifactSet) ?? [];
    grouped.set(artifact.artifactSet, [...current, artifact]);
  }

  const sets = [...grouped.entries()].map(
    ([id, ownedArtifacts]): ResolvedArtifactSet => {
      const owner = artifactSetOwner(id);
      const requiredBy =
        owner.kind === 'capability' && selectedCapabilities.includes(owner.id)
          ? [owner.id]
          : owner.kind === 'provider'
            ? (providers.find((provider) => provider.id === owner.id)
                ?.requiredBy ?? [])
            : [];
      const baseIncluded =
        owner.kind === 'foundation' ||
        owner.kind === 'engineering' ||
        (owner.kind === 'capability' &&
          selectedCapabilities.includes(owner.id)) ||
        (owner.kind === 'provider' &&
          providers.some((provider) => provider.id === owner.id));
      const policy = overrides[id] ?? 'INHERIT';
      const canExclude =
        owner.kind === 'engineering' &&
        (id === 'github-actions' || id === 'vercel');
      if (policy === 'EXCLUDE' && baseIncluded && !canExclude) {
        throw new LoadedVibesError(
          'UNSUPPORTED_CONFIGURATION',
          `Artifact set "${id}" is required by ${requiredBy.length ? requiredBy.join(', ') : owner.label} and cannot be excluded.`,
        );
      }
      if (
        policy === 'INCLUDE' &&
        !baseIncluded &&
        owner.kind !== 'engineering'
      ) {
        throw new LoadedVibesError(
          'UNSUPPORTED_CONFIGURATION',
          `Artifact set "${id}" cannot be included without ${owner.label}.`,
        );
      }
      const included =
        policy === 'INCLUDE' ||
        (policy === 'INHERIT' && baseIncluded) ||
        (policy === 'EXCLUDE' && !canExclude && baseIncluded);
      const artifacts = ownedArtifacts.map((artifact): Artifact => {
        const override = artifactOverrides[artifact.path] ?? 'INHERIT';
        if (override === 'INCLUDE' && !included) {
          throw new LoadedVibesError(
            'UNSUPPORTED_CONFIGURATION',
            `Artifact "${artifact.path}" cannot be included without its artifact set.`,
          );
        }
        if (override === 'EXCLUDE' && !artifact.removable) {
          throw new LoadedVibesError(
            'UNSUPPORTED_CONFIGURATION',
            `Artifact "${artifact.path}" is locked and cannot be excluded.`,
          );
        }
        return {
          ...artifact,
          requiredBy: [...requiredBy],
          generationPolicy: !included
            ? 'EXCLUDE'
            : override === 'EXCLUDE'
              ? 'EXCLUDE'
              : artifact.removable
                ? override
                : 'LOCKED',
          generationReason: included
            ? artifact.generationReason
            : `${owner.label} is not selected for output.`,
        };
      });
      return {
        id,
        label: owner.label,
        policy,
        included,
        canInclude: baseIncluded || owner.kind === 'engineering',
        canExclude,
        requiredBy,
        artifacts,
      };
    },
  );

  for (const [id, policy] of Object.entries(overrides) as [
    ArtifactSetId,
    OutputPolicy,
  ][]) {
    if (!sets.some((set) => set.id === id) && policy !== 'INHERIT') {
      throw new LoadedVibesError(
        'UNSUPPORTED_CONFIGURATION',
        `Artifact set "${id}" has no owned artifacts in this template.`,
      );
    }
  }
  for (const path of Object.keys(artifactOverrides)) {
    if (!ownership.some((artifact) => artifact.path === path)) {
      throw new LoadedVibesError(
        'UNSUPPORTED_CONFIGURATION',
        `Artifact "${path}" is not part of the canonical template.`,
      );
    }
  }
  return sets.sort((left, right) => left.id.localeCompare(right.id));
}

type ArtifactOwner =
  | {
      kind: 'foundation' | 'engineering';
      id: ArtifactSetId;
      label: string;
    }
  | {
      kind: 'capability';
      id: CapabilityId;
      artifactSet: ArtifactSetId;
      label: string;
    }
  | {
      kind: 'provider';
      id: ProviderId;
      artifactSet: ArtifactSetId;
      label: string;
    };

function artifactSetOwner(id: ArtifactSetId): ArtifactOwner {
  const capability = capabilityIds.find((candidate) =>
    capabilityRegistry[candidate].artifactSets.includes(id),
  );
  if (capability) {
    return {
      kind: 'capability',
      id: capability,
      artifactSet: id,
      label: capabilityRegistry[capability].label,
    };
  }
  const provider = (Object.keys(providerRegistry) as ProviderId[]).find(
    (candidate) => providerArtifactSet(candidate) === id,
  );
  if (provider) {
    return {
      kind: 'provider',
      id: provider,
      artifactSet: id,
      label: `${providerRegistry[provider].label} provider`,
    };
  }
  if (
    id === 'playwright' ||
    id === 'vitest' ||
    id === 'github-actions' ||
    id === 'vercel'
  ) {
    return {
      kind: 'engineering',
      id,
      label:
        id === 'github-actions'
          ? 'GitHub Actions'
          : id.charAt(0).toUpperCase() + id.slice(1),
    };
  }
  return { kind: 'foundation', id, label: 'Application foundation' };
}

function resolveArtifactOwnership(
  path: string,
  selectedCapabilities: readonly CapabilityId[],
  providers: readonly (ProviderDefinition & {
    requiredBy: readonly CapabilityId[];
  })[],
): Omit<Artifact, 'requiredBy' | 'generationPolicy'> {
  const outputPath = path;
  const candidates: {
    prefix: string;
    priority: number;
    owner: ArtifactOwner;
  }[] = [];
  for (const [provider, prefixes] of Object.entries(
    providerSurfaceOwnership,
  ) as [ProviderId, readonly string[]][]) {
    for (const prefix of prefixes) {
      if (ownsPath(prefix, path)) {
        candidates.push({
          prefix,
          priority: 3,
          owner: {
            kind: 'provider',
            id: provider,
            artifactSet: providerArtifactSet(provider),
            label: `${providerRegistry[provider].label} provider`,
          },
        });
      }
    }
  }
  for (const ownership of Object.values(optionalSurfaceOwnership)) {
    for (const prefix of ownership.remove) {
      if (ownsPath(prefix, path)) {
        candidates.push({
          prefix,
          priority: 2,
          owner: {
            kind: 'capability',
            id: ownership.capability,
            artifactSet:
              capabilityRegistry[ownership.capability].artifactSets[0] ??
              'application-shell',
            label: capabilityRegistry[ownership.capability].label,
          },
        });
      }
    }
  }
  const engineering = engineeringOwner(path);
  if (engineering) {
    candidates.push({
      prefix: engineering.prefix,
      priority: 1,
      owner: engineering.owner,
    });
  }
  const selected = candidates.sort(
    (left, right) =>
      right.prefix.length - left.prefix.length ||
      right.priority - left.priority,
  )[0]?.owner ?? {
    kind: 'foundation' as const,
    id: 'application-shell' as const,
    label: 'Application foundation',
  };
  const artifactSet =
    selected.kind === 'capability' || selected.kind === 'provider'
      ? selected.artifactSet
      : selected.id;
  const active =
    selected.kind === 'foundation' ||
    selected.kind === 'engineering' ||
    (selected.kind === 'capability' &&
      selectedCapabilities.includes(selected.id)) ||
    (selected.kind === 'provider' &&
      providers.some((provider) => provider.id === selected.id));
  return {
    path: outputPath,
    owner: selected.label,
    artifactSet,
    removable: isSafelyRemovable(path),
    replacementPolicy:
      path === 'package.json' ||
      path === '.env.example' ||
      path === 'app/layout.tsx'
        ? 'transform'
        : 'remove',
    dependencies:
      selected.kind === 'capability' || selected.kind === 'provider'
        ? [selected.id]
        : [],
    generationReason: active
      ? `Owned by ${selected.label} in the resolved application.`
      : `${selected.label} is not selected.`,
  };
}

function engineeringOwner(
  path: string,
): { prefix: string; owner: ArtifactOwner } | undefined {
  if (ownsPath('tests/e2e', path) || path === 'playwright.config.ts') {
    return {
      prefix: path === 'playwright.config.ts' ? path : 'tests/e2e',
      owner: { kind: 'engineering', id: 'playwright', label: 'Playwright' },
    };
  }
  if (
    ownsPath('tests', path) ||
    path.startsWith('vitest.') ||
    path === 'vitest.config.ts'
  ) {
    return {
      prefix: ownsPath('tests', path) ? 'tests' : path,
      owner: { kind: 'engineering', id: 'vitest', label: 'Vitest' },
    };
  }
  if (ownsPath('.github', path)) {
    return {
      prefix: '.github',
      owner: {
        kind: 'engineering',
        id: 'github-actions',
        label: 'GitHub Actions',
      },
    };
  }
  if (path === 'vercel.json') {
    return {
      prefix: path,
      owner: { kind: 'engineering', id: 'vercel', label: 'Vercel' },
    };
  }
  return undefined;
}

function ownsPath(prefix: string, path: string): boolean {
  return path === prefix || path.startsWith(`${prefix}/`);
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
  return path.startsWith('tests/') || path.startsWith('docs/');
}

function unique<T>(values: readonly T[]): T[] {
  return [...new Set(values)];
}
