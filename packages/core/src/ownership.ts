import type { CapabilityId, NormalizedRecipe } from '@loaded-vibes/schema';

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
  invitations: surface('invitations', [
    'app/(tenant)/team',
    'app/(tenant)/settings/members',
  ]),
  billing: surface('billing', [
    'app/(billing)',
    'app/(tenant)/settings/billing',
    'app/api/stripe/webhooks',
    'tests/unit/billing/stripe-webhook-route.test.ts',
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
