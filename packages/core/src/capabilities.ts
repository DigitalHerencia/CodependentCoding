import {
  capabilityIds,
  type ArtifactSetId,
  type CapabilityDefinition as CanonicalCapabilityDefinition,
  type CapabilityId,
  type ModuleSelection,
  type ProviderId,
  type ResolvedModules,
} from '@hipster-stack/schema';
import { LoadedVibesError } from './errors.js';

export interface CapabilityDefinition extends Omit<
  CanonicalCapabilityDefinition,
  | 'requires'
  | 'conflicts'
  | 'providers'
  | 'resources'
  | 'permissions'
  | 'routes'
  | 'modules'
  | 'artifactSets'
  | 'environment'
  | 'setup'
> {
  requires: readonly CapabilityId[];
  conflicts: readonly CapabilityId[];
  providers: readonly ProviderId[];
  resources: readonly string[];
  permissions: readonly string[];
  routes: readonly string[];
  modules: readonly string[];
  artifactSets: readonly ArtifactSetId[];
  environment: readonly string[];
  setup: readonly string[];
}

type CapabilityConsequences = {
  description: string;
  providers?: readonly ProviderId[];
  resources?: readonly string[];
  permissions?: readonly string[];
  routes?: readonly string[];
  modules?: readonly string[];
  artifactSets?: readonly ArtifactSetId[];
  environment?: readonly string[];
  setup?: readonly string[];
};

export const capabilityRegistry = {
  organizations: definition('organizations', 'Organizations', [], [], false, {
    description: 'Tenant organizations, memberships, and active context.',
    providers: ['clerk', 'neon'],
    resources: ['user', 'organization', 'membership'],
    permissions: [
      'organization.read',
      'organization.manage',
      'membership.read',
      'membership.manage',
    ],
    routes: ['application', 'organization-settings'],
    modules: ['organizations'],
    artifactSets: ['organizations'],
  }),
  invitations: definition(
    'invitations',
    'Membership invitations',
    ['organizations'],
    [],
    false,
    {
      description: 'Invite and reconcile organization memberships.',
      providers: ['clerk', 'neon'],
      resources: ['invitation', 'membership'],
      permissions: ['invitation.manage'],
      routes: ['team', 'member-settings'],
      modules: ['invitations'],
      artifactSets: ['invitations'],
    },
  ),
  rbac: definition('rbac', 'Local roles and authorization', [], [], false, {
    description: 'Local role and permission evaluation independent of auth.',
    providers: ['neon'],
    resources: ['role', 'permission'],
    permissions: ['audit.read'],
    modules: ['authorization-rbac'],
    artifactSets: ['rbac'],
  }),
  billing: definition(
    'billing',
    'Subscription billing',
    ['organizations'],
    [],
    false,
    {
      description: 'Subscription lifecycle, checkout, and customer portal.',
      providers: ['stripe', 'neon'],
      resources: ['stripe-customer', 'subscription', 'price'],
      permissions: ['billing.manage'],
      routes: ['billing', 'checkout'],
      modules: ['billing', 'stripe-webhooks'],
      artifactSets: ['billing'],
    },
  ),
  stripeConnect: definition(
    'stripeConnect',
    'Stripe Connect platform payments',
    ['organizations', 'rbac', 'billing'],
    [],
    false,
    {
      description: 'Connected-account onboarding and payment reconciliation.',
      providers: ['stripe', 'neon'],
      resources: ['connected-account', 'transfer'],
      permissions: ['connect.manage'],
      routes: ['connect'],
      modules: ['stripe-connect'],
      artifactSets: ['stripe-connect'],
    },
  ),
  onboarding: definition(
    'onboarding',
    'Product onboarding',
    ['organizations'],
    [],
    false,
    {
      description: 'Guided authenticated product setup.',
      providers: ['clerk', 'neon'],
      resources: ['onboarding-progress'],
      routes: ['onboarding'],
      modules: ['onboarding'],
      artifactSets: ['onboarding'],
    },
  ),
  admin: definition('admin', 'Administrative surface', ['rbac'], [], false, {
    description: 'Authorized application administration.',
    providers: ['neon'],
    permissions: ['admin.access'],
    routes: ['admin'],
    modules: ['admin'],
    artifactSets: ['admin'],
  }),
  uploads: definition(
    'uploads',
    'Media uploads',
    ['organizations', 'rbac'],
    [],
    false,
    {
      description: 'Tenant-scoped signed uploads and media delivery.',
      resources: ['cloudinary-cloud', 'media-asset'],
      permissions: ['media.read', 'media.manage'],
      routes: ['uploads'],
      modules: ['uploads', 'cloudinary-adapter'],
      artifactSets: ['uploads'],
      environment: [
        'CLOUDINARY_CLOUD_NAME',
        'CLOUDINARY_API_KEY',
        'CLOUDINARY_API_SECRET',
        'CLOUDINARY_SIGNATURE_ALGORITHM',
      ],
      setup: ['Configure a Cloudinary cloud and signed upload credentials.'],
    },
  ),
  ai: definition('ai', 'AI inference', ['organizations', 'rbac'], [], false, {
    description: 'Tenant-scoped inference through the supported adapter.',
    resources: ['huggingface-model'],
    permissions: ['ai.use'],
    routes: ['ai'],
    modules: ['ai-inference', 'huggingface-adapter'],
    artifactSets: ['ai'],
    environment: ['HUGGINGFACE_TOKEN', 'HUGGINGFACE_MODEL'],
    setup: ['Configure the Hugging Face inference token and model.'],
  }),
  maps: definition(
    'maps',
    'Maps and geocoding',
    ['organizations', 'rbac'],
    [],
    false,
    {
      description: 'Tenant-scoped location search and map rendering.',
      resources: ['mapbox-map', 'mapbox-geocoder'],
      permissions: ['map.read', 'map.manage'],
      routes: ['maps'],
      modules: ['maps', 'mapbox-adapter'],
      artifactSets: ['maps'],
      environment: [
        'MAPBOX_ACCESS_TOKEN',
        'NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN',
        'NEXT_PUBLIC_MAPBOX_STYLE_URL',
      ],
      setup: ['Configure Mapbox server and public access tokens.'],
    },
  ),
  marketing: definition('marketing', 'Marketing site', [], [], false, {
    description: 'Public pricing and frequently asked questions surfaces.',
    routes: ['marketing'],
    modules: ['marketing'],
    artifactSets: ['marketing'],
  }),
  sampleDomain: definition(
    'sampleDomain',
    'Sample projects domain',
    ['organizations', 'rbac'],
    [],
    false,
    {
      description: 'A complete tenant-scoped projects example domain.',
      providers: ['neon'],
      resources: ['project'],
      permissions: [
        'project.read',
        'project.create',
        'project.update',
        'project.archive',
      ],
      routes: ['projects'],
      modules: ['sample-projects'],
      artifactSets: ['sample-domain'],
    },
  ),
  governance: definition(
    'governance',
    'Generated project guidance',
    [],
    [],
    true,
    {
      description:
        'Application-local agent context and architecture contracts.',
      modules: ['agent-governance'],
      artifactSets: ['governance'],
    },
  ),
} satisfies Record<CapabilityId, CapabilityDefinition>;

function definition(
  id: CapabilityId,
  label: string,
  requires: readonly CapabilityId[] = [],
  conflicts: readonly CapabilityId[] = [],
  fixed = false,
  consequences: CapabilityConsequences = {
    description: 'A supported Hipster Stack application capability.',
  },
): CapabilityDefinition {
  return {
    id,
    label,
    description: consequences.description,
    requires: [...requires],
    conflicts: [...conflicts],
    providers: [...(consequences.providers ?? [])],
    resources: [...(consequences.resources ?? [])],
    permissions: [...(consequences.permissions ?? [])],
    routes: [...(consequences.routes ?? [])],
    modules: [...(consequences.modules ?? [])],
    artifactSets: [...(consequences.artifactSets ?? [])],
    environment: [...(consequences.environment ?? [])],
    setup: [...(consequences.setup ?? [])],
    fixed,
  };
}

function isEnabled(selection: ResolvedModules, id: CapabilityId): boolean {
  return id === 'sampleDomain'
    ? selection.sampleDomain !== false
    : selection[id];
}

function enable(selection: ResolvedModules, id: CapabilityId): void {
  if (id === 'sampleDomain') selection.sampleDomain = 'projects';
  else selection[id] = true;
}

export interface CapabilityResolution {
  modules: ResolvedModules;
  autoIncluded: CapabilityId[];
  requiredBy: Partial<Record<CapabilityId, (CapabilityId | 'architecture')[]>>;
}

export function resolveCapabilitySelection(
  presetModules: ResolvedModules,
  overrides: ModuleSelection,
  registry: Record<CapabilityId, CapabilityDefinition> = capabilityRegistry,
): CapabilityResolution {
  const modules: ResolvedModules = {
    organizations: overrides.organizations ?? presetModules.organizations,
    invitations: overrides.invitations ?? presetModules.invitations,
    rbac: overrides.rbac ?? presetModules.rbac,
    billing: overrides.billing ?? presetModules.billing,
    stripeConnect: overrides.stripeConnect ?? presetModules.stripeConnect,
    onboarding: overrides.onboarding ?? presetModules.onboarding,
    admin: overrides.admin ?? presetModules.admin,
    uploads: overrides.uploads ?? presetModules.uploads,
    ai: overrides.ai ?? presetModules.ai,
    maps: overrides.maps ?? presetModules.maps,
    marketing: overrides.marketing ?? presetModules.marketing,
    sampleDomain: overrides.sampleDomain ?? presetModules.sampleDomain,
    governance: overrides.governance ?? presetModules.governance,
  };
  const autoIncluded = new Set<CapabilityId>();
  const requiredBy: Partial<
    Record<CapabilityId, (CapabilityId | 'architecture')[]>
  > = {};
  for (const id of capabilityIds) {
    if (!registry[id].fixed) continue;
    requiredBy[id] = ['architecture'];
    if (isEnabled(modules, id)) continue;
    enable(modules, id);
    autoIncluded.add(id);
  }
  let changed = true;
  while (changed) {
    changed = false;
    for (const id of capabilityIds) {
      if (!isEnabled(modules, id)) continue;
      for (const requirement of registry[id].requires) {
        const current = requiredBy[requirement] ?? [];
        if (!current.includes(id)) requiredBy[requirement] = [...current, id];
        if (isEnabled(modules, requirement)) continue;
        enable(modules, requirement);
        autoIncluded.add(requirement);
        changed = true;
      }
    }
  }

  for (const id of capabilityIds) {
    if (!isEnabled(modules, id)) continue;
    const conflict = registry[id].conflicts.find((candidate) =>
      isEnabled(modules, candidate),
    );
    if (conflict) {
      throw new LoadedVibesError(
        'UNSUPPORTED_CONFIGURATION',
        `Capabilities "${id}" and "${conflict}" cannot be combined.`,
      );
    }
  }

  return { modules, autoIncluded: [...autoIncluded], requiredBy };
}
