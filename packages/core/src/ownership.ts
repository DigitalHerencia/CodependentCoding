import type {
  CapabilityId,
  NormalizedRecipe,
  ProviderId,
} from '@hipster-stack/schema';

export const generatedModuleIds = [
  'marketing',
  'sample-domain',
  'stripe-connect',
] as const;

export type GeneratedModuleId = (typeof generatedModuleIds)[number];

export interface OptionalSurfaceOwnership {
  capability: CapabilityId;
  remove: readonly string[];
  add?: {
    id: GeneratedModuleId;
    paths: readonly string[];
    replacements: readonly string[];
    setup: readonly string[];
  };
}

export const optionalSurfaceOwnership = {
  organizations: surface('organizations', [
    'app/(tenant)',
    'app/api/cloudinary',
    'features/ai',
    'features/dashboard',
    'features/maps',
    'features/members',
    'features/projects',
    'features/settings',
    'features/uploads',
    'components/projects',
    'components/shells/tenant-shell.tsx',
    'components/navigation/mobile-bottom-nav.tsx',
    'components/navigation/user-menu.tsx',
    'lib/actions',
    'lib/capabilities',
    'lib/fetchers',
    'lib/organizations',
    'lib/projects',
    'lib/integrations/cloudinary',
    'lib/integrations/huggingface',
    'lib/integrations/mapbox',
    'lib/webhooks/cloudinaryWebhookWorkflow.ts',
    'schemas/capabilitySchemas.ts',
    'schemas/organizationSchemas.ts',
    'schemas/projectSchemas.ts',
    'types/adminTypes.ts',
    'types/auditTypes.ts',
    'types/capabilityTypes.ts',
    'types/organizationTypes.ts',
    'types/projectTypes.ts',
    'tests/unit/integrations/cloudinary-signatures.test.ts',
  ]),
  invitations: surface('invitations', [
    'app/(tenant)/team',
    'app/(tenant)/settings/members',
  ]),
  billing: surface('billing', [
    'app/(billing)',
    'app/(tenant)/settings/billing',
    'app/api/stripe/webhooks',
    'tests/unit/billing/stripe-webhook-route.test.ts',
    'features/billing',
    'lib/actions/billingActions.ts',
    'lib/billing',
    'lib/fetchers/billingFetchers.ts',
    'lib/integrations/stripe/billing.ts',
    'lib/integrations/stripe/client.ts',
    'lib/integrations/stripe/subscriptionStatus.ts',
    'lib/integrations/stripe/webhooks.ts',
    'lib/webhooks/stripeWebhookWorkflow.ts',
    'schemas/stripeWebhookSchemas.ts',
    'types/billingTypes.ts',
  ]),
  stripeConnect: surface(
    'stripeConnect',
    [
      'app/api/stripe/connect',
      'tests/unit/connect/connect-webhook-route.test.ts',
    ],
    {
      id: 'stripe-connect',
      paths: [
        'app/api/stripe/connect',
        'lib/connect',
        'lib/actions/connectActions.ts',
        'lib/fetchers/connectFetchers.ts',
        'lib/db/transactions/connectTransactions.ts',
        'lib/integrations/stripe/connect.ts',
        'lib/integrations/stripe/connectWebhooks.ts',
        'lib/webhooks/connectWebhookWorkflow.ts',
        'schemas/connectSchemas.ts',
        'types/connectTypes.ts',
      ],
      replacements: [],
      setup: [
        'Configure STRIPE_CONNECT_WEBHOOK_SECRET.',
        'Register /api/stripe/connect/webhooks in Stripe before enabling live traffic.',
      ],
    },
  ),
  onboarding: surface('onboarding', ['app/(onboarding)']),
  admin: surface('admin', ['app/(admin)']),
  rbac: surface('rbac', [
    'lib/authz',
    'types/authzTypes.ts',
    'tests/unit/authz',
    'docs/adr/adr-0003-local-rbac.md',
  ]),
  marketing: surface(
    'marketing',
    ['app/(public)/pricing', 'app/(public)/faq'],
    {
      id: 'marketing',
      paths: [
        'app/(public)/pricing',
        'app/(public)/faq',
        'tests/e2e/public-routes.spec.ts',
      ],
      replacements: [],
      setup: [],
    },
  ),
  sampleDomain: surface('sampleDomain', ['app/(tenant)/projects'], {
    id: 'sample-domain',
    paths: [
      'app/(tenant)/projects',
      'features/dashboard/dashboard-feature.tsx',
      'features/projects',
      'components/projects',
      'lib/projects',
      'lib/actions/projectActions.ts',
      'lib/fetchers/dashboardFetchers.ts',
      'lib/fetchers/projectFetchers.ts',
      'lib/db/transactions/projectTransactions.ts',
      'lib/db/selects/project.selects.ts',
      'lib/db/dto/project.mappers.ts',
      'schemas/projectSchemas.ts',
      'types/projectTypes.ts',
    ],
    replacements: ['features/dashboard/dashboard-feature.tsx'],
    setup: [],
  }),
} as const satisfies Partial<Record<CapabilityId, OptionalSurfaceOwnership>>;

export const providerSurfaceOwnership = {
  clerk: [
    'app/(auth)',
    'app/api/clerk',
    'components/app/app-providers.tsx',
    'components/navigation/auth-footer.tsx',
    'components/navigation/auth-header.tsx',
    'components/navigation/auth-shell.tsx',
    'components/shells/auth-shell.tsx',
    'lib/auth',
    'lib/integrations/clerk',
    'lib/webhooks/clerkWebhookWorkflow.ts',
    'schemas/clerkWebhookSchemas.ts',
    'types/authTypes.ts',
    'tests/contract/clerk-webhook-surface.test.ts',
    'tests/e2e/fixtures/authenticated.ts',
    'tests/unit/webhooks/clerk-webhook-mapping.test.ts',
    'tests/unit/webhooks/clerk-webhook-route.test.ts',
    'docs/adr/adr-0005-clerk-identity-boundary.md',
    'context/docs/auth.md',
    'context/patterns/auth-authz-boundary.md',
    'proxy.ts',
  ],
  neon: [
    'prisma',
    'prisma.config.ts',
    'lib/db',
    'tests/contract/database-security-surface.test.ts',
    'tests/integration/postgres-rls.test.ts',
    'scripts/Test-PostgresRls.ps1',
    'docs/adr/adr-0004-postgresql-rls-roles-and-context.md',
    'context/patterns/transaction-helper.md',
  ],
  stripe: [
    'app/api/stripe',
    'lib/connect',
    'lib/integrations/stripe',
    'lib/webhooks/connectWebhookWorkflow.ts',
    'lib/webhooks/stripeWebhookWorkflow.ts',
    'schemas/connectSchemas.ts',
    'schemas/stripeWebhookSchemas.ts',
    'types/billingTypes.ts',
    'types/connectTypes.ts',
    'tests/integration/stripe-billing.test.ts',
    'tests/integration/stripe-connect.test.ts',
    'tests/unit/billing',
    'tests/unit/connect',
    'docs/adr/adr-0007-stripe-subscription-billing.md',
    'docs/adr/adr-0008-optional-stripe-connect.md',
    'docs/stripe-connect-reference.md',
  ],
} as const satisfies Record<ProviderId, readonly string[]>;

function surface(
  capability: CapabilityId,
  remove: readonly string[],
  add?: OptionalSurfaceOwnership['add'],
): OptionalSurfaceOwnership {
  return add ? { capability, remove, add } : { capability, remove };
}

export function isCapabilityEnabled(
  recipe: NormalizedRecipe,
  id: CapabilityId,
): boolean {
  return id === 'sampleDomain'
    ? recipe.modules.sampleDomain !== false
    : recipe.modules[id];
}

export function excludedOwnedPaths(recipe: NormalizedRecipe): string[] {
  return Object.values(optionalSurfaceOwnership)
    .filter((ownership) => !isCapabilityEnabled(recipe, ownership.capability))
    .flatMap((ownership) => [...ownership.remove]);
}

export function excludedOwnedPathsForApplication(
  selectedCapabilities: readonly CapabilityId[],
  selectedProviders: readonly ProviderId[],
  safelyExcludedArtifacts: readonly string[] = [],
): string[] {
  const capabilityPaths = Object.values(optionalSurfaceOwnership)
    .filter(
      (ownership) => !selectedCapabilities.includes(ownership.capability),
    )
    .flatMap((ownership) => [...ownership.remove]);
  const providerPaths = Object.entries(providerSurfaceOwnership)
    .filter(([provider]) => !selectedProviders.includes(provider as ProviderId))
    .flatMap(([, paths]) => [...paths]);
  return [...new Set([...capabilityPaths, ...providerPaths, ...safelyExcludedArtifacts])];
}

export function selectedGeneratedModuleIds(
  recipe: NormalizedRecipe,
): GeneratedModuleId[] {
  return Object.values(optionalSurfaceOwnership)
    .filter(
      (ownership) =>
        ownership.add && isCapabilityEnabled(recipe, ownership.capability),
    )
    .map((ownership) => ownership.add!.id);
}

export function getAddableOwnership(
  id: GeneratedModuleId,
): OptionalSurfaceOwnership & {
  add: NonNullable<OptionalSurfaceOwnership['add']>;
} {
  const ownership = Object.values(optionalSurfaceOwnership).find(
    (candidate) => candidate.add?.id === id,
  );
  if (!ownership?.add) throw new Error(`Missing ownership for ${id}.`);
  return ownership as OptionalSurfaceOwnership & {
    add: NonNullable<OptionalSurfaceOwnership['add']>;
  };
}
