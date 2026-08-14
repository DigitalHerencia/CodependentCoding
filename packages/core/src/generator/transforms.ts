import {
  mkdir,
  readFile,
  readdir,
  rename,
  rm,
  writeFile,
} from 'node:fs/promises';
import path from 'node:path';
import type {
  ApplicationDefinition,
  NormalizedRecipe,
  ProviderId,
} from '@hipster-stack/schema';
import {
  excludedOwnedPaths,
  selectedGeneratedModuleIds,
} from '../ownership.js';
import { capabilityRegistry } from '../capabilities.js';
import type { GenerationPlan } from './plan.js';
import { canonicalTemplateMetadata } from '../template-metadata.js';

export interface TemplateProvenance {
  templateId: string;
  templateVersion: string;
}

export async function writeRecipeArtifacts(
  directory: string,
  recipe: NormalizedRecipe,
  template: TemplateProvenance,
  applicationDefinition?: ApplicationDefinition,
): Promise<void> {
  await writeFile(
    path.join(directory, 'hipsterstack.json'),
    `${JSON.stringify(
      applicationDefinition ? { applicationDefinition } : recipe,
      null,
      2,
    )}\n`,
  );
  await mkdir(path.join(directory, '.hipsterstack'), { recursive: true });
  await writeFile(
    path.join(directory, '.hipsterstack', 'manifest.json'),
    `${JSON.stringify(
      {
        schemaVersion: 2,
        generator: { name: 'hipster-stack', version: '0.1.0' },
        template: {
          id: template.templateId,
          version: template.templateVersion,
          composition: 'copy-one-template-retain-remove-transform',
        },
        preset: recipe.product,
        modules: selectedGeneratedModuleIds(recipe),
        excludedOwnedPaths: excludedOwnedPaths(recipe),
        ...(applicationDefinition ? { applicationDefinition } : {}),
        recipe,
      },
      null,
      2,
    )}\n`,
  );
  await writeProductContract(directory, recipe);
  await writeRoutesContract(directory, recipe, applicationDefinition);
}

async function writeProductContract(
  directory: string,
  recipe: NormalizedRecipe,
): Promise<void> {
  const capabilitiesSource = `export const loadedVibesProduct = ${JSON.stringify(
    {
      name: recipe.identity.displayName,
      description:
        recipe.identity.description ||
        'A focused product for teams who need clear, useful software.',
    },
    null,
    2,
  )} as const

export type LoadedVibesDesign = {
  theme: "obsidian" | "paper" | "electric"
  radius: "compact" | "medium" | "rounded"
  density: "compact" | "comfortable"
  navigation: "sidebar" | "topbar"
  mode: "light" | "dark" | "system"
}

export const loadedVibesDesign: LoadedVibesDesign = ${JSON.stringify(
    recipe.design,
    null,
    2,
  )}

export const loadedVibesCapabilities = ${JSON.stringify(
    {
      organizations: recipe.modules.organizations,
      invitations: recipe.modules.invitations,
      rbac: recipe.modules.rbac,
      billing: recipe.modules.billing,
      onboarding: recipe.modules.onboarding,
      admin: recipe.modules.admin,
      marketing: recipe.modules.marketing,
      sampleDomain: recipe.modules.sampleDomain !== false,
      stripeConnect: recipe.modules.stripeConnect,
      uploads: recipe.modules.uploads,
      ai: recipe.modules.ai,
      maps: recipe.modules.maps,
    },
    null,
    2,
  )} as const\n`;
  await writeFile(
    path.join(directory, 'content', 'loadedvibes.ts'),
    capabilitiesSource,
  );
}

async function writeRoutesContract(
  directory: string,
  recipe: NormalizedRecipe,
  applicationDefinition?: ApplicationDefinition,
): Promise<void> {
  const routeUrl = (id: string, fallback: string) => {
    const direct = applicationDefinition?.routes.find(
      (route) => route.id === id,
    )?.urlSegment;
    if (direct) return direct;
    const settings = applicationDefinition?.routes.find(
      (route) => route.id === 'organization-settings',
    )?.urlSegment;
    if (settings && (id === 'member-settings' || id === 'billing')) {
      return `${settings}/${id === 'member-settings' ? 'members' : 'billing'}`;
    }
    return fallback;
  };
  const hasClerk = applicationDefinition
    ? applicationDefinition.providers.authentication !== 'none' &&
      (applicationDefinition.providers.authentication === 'clerk' ||
        recipe.modules.organizations ||
        recipe.modules.invitations ||
        recipe.modules.onboarding)
    : true;
  const publicRoutes = [
    '/',
    '/contact',
    '/privacy',
    '/terms',
    ...(recipe.modules.marketing
      ? [routeUrl('marketing', '/pricing'), '/faq']
      : []),
  ];
  const protectedRoutes = [
    ...(recipe.modules.organizations
      ? [routeUrl('application', '/dashboard')]
      : []),
    ...(recipe.modules.sampleDomain !== false
      ? [
          routeUrl('projects', '/projects'),
          `${routeUrl('projects', '/projects')}/new`,
          `${routeUrl('projects', '/projects')}/[projectId]`,
        ]
      : []),
    ...(recipe.modules.organizations
      ? [routeUrl('organization-settings', '/settings')]
      : []),
    ...(recipe.modules.uploads ? [routeUrl('uploads', '/uploads')] : []),
    ...(recipe.modules.maps ? [routeUrl('maps', '/maps')] : []),
    ...(recipe.modules.ai ? [routeUrl('ai', '/ai')] : []),
    ...(recipe.modules.invitations
      ? [
          routeUrl('team', '/team'),
          routeUrl('member-settings', '/settings/members'),
        ]
      : []),
    ...(recipe.modules.onboarding
      ? [routeUrl('onboarding', '/onboarding')]
      : []),
    ...(recipe.modules.admin ? [routeUrl('admin', '/admin')] : []),
    ...(recipe.modules.billing
      ? [
          routeUrl('billing', '/settings/billing'),
          routeUrl('checkout', '/checkout'),
          '/success',
          '/canceled',
        ]
      : []),
  ];
  const apiRoutes = [
    ...(hasClerk ? ['/api/clerk/webhooks'] : []),
    ...(recipe.modules.uploads ? ['/api/cloudinary/webhooks'] : []),
    ...(recipe.modules.billing ? ['/api/stripe/webhooks'] : []),
    ...(recipe.modules.stripeConnect
      ? [`${routeUrl('connect', '/api/stripe/connect')}/webhooks`]
      : []),
  ];
  const routesContract = `id: white-label-application.routes
version: 1
authority: current-source-contract
public: ${JSON.stringify(publicRoutes)}
auth: ${JSON.stringify(hasClerk ? ['/sign-in', '/sign-up'] : [])}
protected: ${JSON.stringify(protectedRoutes)}
api: ${JSON.stringify(apiRoutes)}
reference_catalog:
  status: production-opt-in
  route_groups:
    - app/(presentation)
    - app/(public)/(presentation)
    - app/(auth)/(presentation)
    - app/(tenant)/(presentation)
  index: /catalog
  production_gate: PRESENTATION_CATALOG_ENABLED
  search_metadata: content/presentation/registry.ts
  robots: noindex,nofollow
`;
  await writeFile(
    path.join(directory, '.agents', 'contracts', 'routes.yaml'),
    routesContract,
  );
}

export async function applyTransforms(plan: GenerationPlan): Promise<void> {
  const packagePath = path.join(plan.stagingDirectory, 'package.json');
  const packageJson = JSON.parse(await readFile(packagePath, 'utf8')) as Record<
    string,
    unknown
  >;
  packageJson.name = plan.config.recipe.name;
  packageJson.version = '0.1.0';
  packageJson.private = true;
  applyProviderPackageComposition(
    packageJson,
    plan.applicationPlan.selectedProviders,
  );
  await writeFile(packagePath, `${JSON.stringify(packageJson, null, 2)}\n`);
  await applyProviderSourceComposition(plan);

  const provenance = {
    schemaVersion: 1,
    generator: 'hipster-stack',
    generatorVersion: '0.1.0',
    preset: plan.config.recipe.product,
    projectName: plan.config.recipe.name,
    templateId: canonicalTemplateMetadata.templateId,
    templateVersion: canonicalTemplateMetadata.templateVersion,
    composition: 'copy-one-template-retain-remove-transform',
    excludedOwnedPaths: plan.excludedOwnedPaths,
  };
  await writeFile(
    path.join(plan.stagingDirectory, '.hipster-stack.json'),
    `${JSON.stringify(provenance, null, 2)}\n`,
  );
  await writeRecipeArtifacts(
    plan.stagingDirectory,
    plan.config.recipe,
    {
      templateId: canonicalTemplateMetadata.templateId,
      templateVersion: canonicalTemplateMetadata.templateVersion,
    },
    plan.applicationDefinition,
  );
}

function applyProviderPackageComposition(
  packageJson: Record<string, unknown>,
  selectedProviders: readonly ProviderId[],
): void {
  const dependencies = packageJson.dependencies as Record<string, string>;
  const devDependencies = packageJson.devDependencies as Record<string, string>;
  const scripts = packageJson.scripts as Record<string, string>;
  const removed = new Set<string>();
  if (!selectedProviders.includes('clerk')) {
    removed.add('@clerk/nextjs');
    removed.add('@clerk/testing');
  }
  if (!selectedProviders.includes('neon')) {
    for (const name of [
      '@neondatabase/serverless',
      '@prisma/adapter-neon',
      '@prisma/client',
      '@prisma/adapter-pg',
      '@types/pg',
      'pg',
      'prisma',
    ])
      removed.add(name);
    for (const name of Object.keys(scripts)) {
      if (name.startsWith('db:') || name === 'test:database-security') {
        delete scripts[name];
      }
    }
    for (const name of ['validate', 'validate:ci', 'validate:release']) {
      const script = scripts[name];
      if (script) {
        scripts[name] = script
          .replace('prisma generate && prisma validate && ', '')
          .replace('prisma generate && ', '');
      }
    }
  }
  if (!selectedProviders.includes('stripe')) removed.add('stripe');
  for (const name of removed) {
    delete dependencies[name];
    delete devDependencies[name];
  }
}

async function applyProviderSourceComposition(
  plan: GenerationPlan,
): Promise<void> {
  const providers = plan.applicationPlan.selectedProviders;
  await pruneEnvironmentExample(
    plan.stagingDirectory,
    providers,
    plan.applicationPlan.selectedCapabilities,
  );
  await pruneLockfileImporter(plan.stagingDirectory, providers);
  await applyRouteComposition(plan);
  await applyAuthorizationComposition(plan);
  await applyCapabilityWorkflowComposition(plan);
  if (!providers.includes('clerk')) {
    const layoutPath = path.join(plan.stagingDirectory, 'app', 'layout.tsx');
    let layout = await readFile(layoutPath, 'utf8');
    layout = layout
      .replace(
        'import { AppProviders } from "@/components/app/app-providers"\n',
        '',
      )
      .replace('<AppProviders>{children}</AppProviders>', '{children}');
    await writeFile(layoutPath, layout);
    await replaceInFile(path.join(plan.stagingDirectory, 'app', 'page.tsx'), [
      ['href="/sign-up"', 'href="/contact"'],
      ['Start the app', 'Contact us'],
      [
        'Clerk owns identity and session lifecycle without organizations.',
        'This application is generated without an authentication provider.',
      ],
      [
        'Local Prisma rows decide whether a user can read or write a resource.',
        'Public routes remain independent from authorization infrastructure.',
      ],
    ]);
    await replaceInFile(
      path.join(
        plan.stagingDirectory,
        'components',
        'navigation',
        'public-header.tsx',
      ),
      [
        ['href="/sign-in"', 'href="/contact"'],
        ['Sign in', 'Contact'],
        ['href="/sign-up?return_to=/dashboard"', 'href="/"'],
        ['Get started', 'Explore'],
      ],
    );
    await replaceInFile(
      path.join(
        plan.stagingDirectory,
        'components',
        'navigation',
        'mobile-bottom-nav.tsx',
      ),
      [
        [
          'href: "/sign-in", label: "Sign"',
          'href: "/contact", label: "Contact"',
        ],
        [
          "href: '/sign-in', label: 'Sign'",
          "href: '/contact', label: 'Contact'",
        ],
      ],
    );
  }
}

async function applyCapabilityWorkflowComposition(
  plan: GenerationPlan,
): Promise<void> {
  const selected = new Set(plan.applicationPlan.selectedCapabilities);
  const uploads = selected.has('uploads');
  const ai = selected.has('ai');
  const maps = selected.has('maps');
  const file = path.join(
    plan.stagingDirectory,
    'lib',
    'capabilities',
    'workflows',
    'capabilityWorkflows.ts',
  );
  const actionFile = path.join(
    plan.stagingDirectory,
    'lib',
    'actions',
    'capabilityActions.ts',
  );
  if (!uploads && !ai && !maps) {
    await rm(file, { force: true });
    await rm(actionFile, { force: true });
    return;
  }

  const transactionImports = [
    ...(maps ? ['createLocationTx'] : []),
    ...(uploads ? ['recordMediaAssetTx'] : []),
  ];
  const schemaImports = [
    ...(ai ? ['inferenceSchema'] : []),
    ...(maps ? ['locationSearchSchema', 'saveLocationSchema'] : []),
    ...(uploads ? ['mediaUploadSchema'] : []),
  ];
  const source = [
    `import "server-only"`,
    '',
    `import { requireTenantContext } from "@/lib/auth/session"`,
    `import { assertCapability } from "@/lib/authz/assertions"`,
    ...(transactionImports.length
      ? [
          `import { ${transactionImports.join(', ')} } from "@/lib/db/transactions/capabilityTransactions"`,
        ]
      : []),
    ...(uploads || maps
      ? [`import { withTenantContext } from "@/lib/db/withTenantContext"`]
      : []),
    ...(ai
      ? [
          `import { runHuggingFaceInference } from "@/lib/integrations/huggingface/inference"`,
        ]
      : []),
    ...(maps
      ? [
          `import { geocodeLocation } from "@/lib/integrations/mapbox/geocoding"`,
        ]
      : []),
    ...(uploads
      ? [
          `import { uploadToCloudinary } from "@/lib/integrations/cloudinary/uploads"`,
        ]
      : []),
    `import { ${schemaImports.join(', ')} } from "@/schemas/capabilitySchemas"`,
    '',
    ...(uploads
      ? [
          `export async function uploadMediaWorkflow(input: unknown) {
  const parsed = mediaUploadSchema.parse(input)
  const context = await requireTenantContext()
  assertCapability(context, "media.manage")
  const uploaded = await uploadToCloudinary(parsed.file)
  return withTenantContext(context.organization.id, (tx) =>
    recordMediaAssetTx(tx, {
      ...uploaded,
      organizationId: context.organization.id,
      uploadedById: context.localUser.id,
    })
  )
}`,
          '',
        ]
      : []),
    ...(ai
      ? [
          `export async function runInferenceWorkflow(input: unknown) {
  const parsed = inferenceSchema.parse(input)
  const context = await requireTenantContext()
  assertCapability(context, "ai.use")
  return runHuggingFaceInference(parsed.prompt)
}`,
          '',
        ]
      : []),
    ...(maps
      ? [
          `export async function searchLocationsWorkflow(input: unknown) {
  const parsed = locationSearchSchema.parse(input)
  const context = await requireTenantContext()
  assertCapability(context, "map.read")
  return geocodeLocation(parsed.query)
}`,
          '',
          `export async function saveLocationWorkflow(input: unknown) {
  const parsed = saveLocationSchema.parse(input)
  const context = await requireTenantContext()
  assertCapability(context, "map.manage")
  return withTenantContext(context.organization.id, (tx) =>
    createLocationTx(tx, { ...parsed, organizationId: context.organization.id })
  )
}`,
          '',
        ]
      : []),
  ].join('\n');
  await writeFile(file, source);

  const workflowImports = [
    ...(ai ? ['runInferenceWorkflow'] : []),
    ...(maps ? ['saveLocationWorkflow', 'searchLocationsWorkflow'] : []),
    ...(uploads ? ['uploadMediaWorkflow'] : []),
  ];
  const resultTypeImports = [
    ...(ai ? ['InferenceResult'] : []),
    ...(maps ? ['LocationResult'] : []),
  ];
  const actionSource = [
    `"use server"`,
    '',
    `import { ZodError } from "zod"`,
    '',
    `import { ${workflowImports.join(', ')} } from "@/lib/capabilities/workflows/capabilityWorkflows"`,
    `import { actionFailure, actionSuccess, type ActionResult } from "@/types/actionResultTypes"`,
    ...(resultTypeImports.length
      ? [
          `import type { ${resultTypeImports.join(', ')} } from "@/types/capabilityTypes"`,
        ]
      : []),
    '',
    ...(ai || maps
      ? [
          `function formString(formData: FormData, key: string): string {
  const value = formData.get(key)
  return typeof value === "string" ? value : ""
}`,
          '',
        ]
      : []),
    `function invalid(error: unknown): ActionResult<never> {
  if (error instanceof ZodError)
    return actionFailure(
      "INVALID_INPUT",
      "Check the submitted values.",
      error.flatten().fieldErrors
    )
  throw error
}`,
    '',
    ...(uploads
      ? [
          `export async function uploadMediaAction(
  _state: ActionResult<{ id: string }>,
  formData: FormData
): Promise<ActionResult<{ id: string }>> {
  try {
    const asset = await uploadMediaWorkflow({ file: formData.get("file") })
    return actionSuccess({ id: asset.id })
  } catch (error) {
    return invalid(error)
  }
}`,
          '',
        ]
      : []),
    ...(ai
      ? [
          `export async function runInferenceAction(
  _state: ActionResult<InferenceResult>,
  formData: FormData
): Promise<ActionResult<InferenceResult>> {
  try {
    return actionSuccess(await runInferenceWorkflow({ prompt: formString(formData, "prompt") }))
  } catch (error) {
    return invalid(error)
  }
}`,
          '',
        ]
      : []),
    ...(maps
      ? [
          `export async function searchLocationsAction(
  _state: ActionResult<LocationResult[]>,
  formData: FormData
): Promise<ActionResult<LocationResult[]>> {
  try {
    return actionSuccess(await searchLocationsWorkflow({ query: formString(formData, "query") }))
  } catch (error) {
    return invalid(error)
  }
}`,
          '',
          `export async function saveLocationAction(formData: FormData): Promise<void> {
  await saveLocationWorkflow({
    label: formString(formData, "label"),
    mapboxId: formString(formData, "mapboxId") || undefined,
    longitude: formString(formData, "longitude"),
    latitude: formString(formData, "latitude"),
  })
}`,
          '',
        ]
      : []),
  ].join('\n');
  await writeFile(actionFile, actionSource);
}

async function applyAuthorizationComposition(
  plan: GenerationPlan,
): Promise<void> {
  const authorization = plan.resolvedApplication.authorization;
  if (authorization.model !== 'rbac') return;

  const roles = authorization.roles;
  const roleNames = roles.map((role) => role.name);
  const primaryRole = roleNames[0];
  const defaultRole = roleNames.at(-1);
  if (!primaryRole || !defaultRole) return;
  const invitationRoles = roleNames.slice(1);
  const defaultInvitationRole = roleNames[2] ?? invitationRoles[0];
  if (!defaultInvitationRole) return;

  await replaceLegacyRoleLiterals(path.join(plan.stagingDirectory, 'tests'), {
    owner: primaryRole,
    admin: roleNames[1] ?? defaultRole,
    member: roleNames[2] ?? defaultRole,
    viewer: defaultRole,
  });

  const roleLabels = Object.fromEntries(
    roles.map((role) => [role.name, role.displayName]),
  );
  const permissionVocabulary = [
    ...new Set(
      Object.values(capabilityRegistry).flatMap(
        (capability) => capability.permissions,
      ),
    ),
  ];
  const capabilityType = permissionVocabulary.length
    ? permissionVocabulary
        .map((permission) => JSON.stringify(permission))
        .join(' | ')
    : 'never';
  const authzTypes = `import type { AuthenticatedUserContext } from "@/types/authTypes"

export const organizationRoles = ${JSON.stringify(roleNames)} as const
export type OrganizationRole = (typeof organizationRoles)[number]

export const organizationRoleLabels = ${JSON.stringify(roleLabels, null, 2)} as const satisfies Record<OrganizationRole, string>

// Role order is semantic: the first role is primary and the last is the default.
export const primaryOrganizationRole: OrganizationRole = ${JSON.stringify(primaryRole)}
export const defaultOrganizationRole: OrganizationRole = ${JSON.stringify(defaultRole)}
export const invitationRoles = ${JSON.stringify(invitationRoles)} as const satisfies readonly OrganizationRole[]
export const defaultInvitationRole: OrganizationRole = ${JSON.stringify(defaultInvitationRole)}

export type Capability = ${capabilityType}

export type TenantContext = AuthenticatedUserContext & {
  organization: {
    id: string
    status: "active" | "suspended"
  }
  membership: {
    id: string
    role: OrganizationRole
  }
  capabilities: readonly Capability[]
}
`;
  await writeFile(
    path.join(plan.stagingDirectory, 'types', 'authzTypes.ts'),
    authzTypes,
  );

  const roleCapabilities = Object.fromEntries(
    roles.map((role) => [role.name, role.permissions]),
  );
  const capabilitySource = `import type { Capability, OrganizationRole } from "@/types/authzTypes"

const roleCapabilities = ${JSON.stringify(roleCapabilities, null, 2)} as const satisfies Record<OrganizationRole, readonly Capability[]>

export function capabilitiesForRole(role: OrganizationRole): readonly Capability[] {
  return roleCapabilities[role]
}

export function hasCapability(role: OrganizationRole, capability: Capability): boolean {
  return capabilitiesForRole(role).some((candidate) => candidate === capability)
}
`;
  await writeFile(
    path.join(plan.stagingDirectory, 'lib', 'authz', 'capabilities.ts'),
    capabilitySource,
  );

  const prismaPath = path.join(
    plan.stagingDirectory,
    'prisma',
    'schema.prisma',
  );
  let prisma = await readFile(prismaPath, 'utf8');
  prisma = prisma
    .replace(
      /enum OrganizationRole \{[\s\S]*?\}/,
      `enum OrganizationRole {\n${roleNames.map((role) => `  ${role}`).join('\n')}\n}`,
    )
    .replaceAll('@default(viewer)', `@default(${defaultRole})`);
  await writeFile(prismaPath, prisma);

  const migrationPath = path.join(
    plan.stagingDirectory,
    'prisma',
    'migrations',
    '20260804062000_tenant_rls_baseline',
    'migration.sql',
  );
  let migration = await readFile(migrationPath, 'utf8');
  migration = migration
    .replace(
      /CREATE TYPE "OrganizationRole" AS ENUM \([^;]+\);/,
      `CREATE TYPE "OrganizationRole" AS ENUM (${roleNames.map((role) => `'${role}'`).join(', ')});`,
    )
    .replaceAll("DEFAULT 'viewer'", `DEFAULT '${defaultRole}'`);
  await writeFile(migrationPath, migration);
}

async function replaceLegacyRoleLiterals(
  directory: string,
  replacements: Readonly<
    Record<'owner' | 'admin' | 'member' | 'viewer', string>
  >,
): Promise<void> {
  let entries;
  try {
    entries = await readdir(directory, { withFileTypes: true });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return;
    throw error;
  }
  for (const entry of entries) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      await replaceLegacyRoleLiterals(absolute, replacements);
      continue;
    }
    if (!['.ts', '.tsx'].includes(path.extname(entry.name))) continue;
    let source = await readFile(absolute, 'utf8');
    const original = source;
    for (const [index, role] of [
      'owner',
      'admin',
      'member',
      'viewer',
    ].entries()) {
      source = source
        .replaceAll(`"${role}"`, `"__HIPSTER_ROLE_${index}__"`)
        .replaceAll(`'${role}'`, `'__HIPSTER_ROLE_${index}__'`);
    }
    for (const [index, role] of [
      'owner',
      'admin',
      'member',
      'viewer',
    ].entries()) {
      source = source
        .replaceAll(
          `"__HIPSTER_ROLE_${index}__"`,
          JSON.stringify(replacements[role as keyof typeof replacements]),
        )
        .replaceAll(
          `'__HIPSTER_ROLE_${index}__'`,
          `'${replacements[role as keyof typeof replacements]}'`,
        );
    }
    if (source !== original) await writeFile(absolute, source);
  }
}

const routeSourcePaths = {
  application: ['(tenant)', 'dashboard'],
  'organization-settings': ['(tenant)', 'settings'],
  team: ['(tenant)', 'team'],
  'member-settings': ['(tenant)', 'settings', 'members'],
  billing: ['(tenant)', 'settings', 'billing'],
  checkout: ['(billing)', 'checkout'],
  connect: ['api', 'stripe', 'connect'],
  onboarding: ['(onboarding)', 'onboarding'],
  admin: ['(admin)', 'admin'],
  uploads: ['(tenant)', 'uploads'],
  ai: ['(tenant)', 'ai'],
  maps: ['(tenant)', 'maps'],
  marketing: ['(public)', 'pricing'],
  projects: ['(tenant)', 'projects'],
} as const;

const defaultRouteUrls = {
  application: '/dashboard',
  'organization-settings': '/settings',
  team: '/team',
  'member-settings': '/settings/members',
  billing: '/settings/billing',
  checkout: '/checkout',
  connect: '/api/stripe/connect',
  onboarding: '/onboarding',
  admin: '/admin',
  uploads: '/uploads',
  ai: '/ai',
  maps: '/maps',
  marketing: '/pricing',
  projects: '/projects',
} as const;

const defaultRouteLabels = {
  application: 'Dashboard',
  'organization-settings': 'Settings',
  team: 'Team',
  'member-settings': 'Member Settings',
  billing: 'Billing',
  checkout: 'Checkout',
  connect: 'Connect',
  onboarding: 'Onboarding',
  admin: 'Admin',
  uploads: 'Uploads',
  ai: 'AI',
  maps: 'Maps',
  marketing: 'Pricing',
  projects: 'Projects',
} as const;

async function applyRouteComposition(plan: GenerationPlan): Promise<void> {
  const routes = plan.applicationPlan.routes
    .map((route) => ({
      route,
      source: routeSourcePaths[route.id as keyof typeof routeSourcePaths],
    }))
    .filter(
      (entry): entry is typeof entry & { source: readonly string[] } =>
        entry.source !== undefined,
    )
    .sort((left, right) => right.source.length - left.source.length);
  const staged = path.join(plan.stagingDirectory, '.hipster-route-staging');
  await mkdir(staged, { recursive: true });
  for (const { route, source } of routes) {
    await rename(
      path.join(plan.stagingDirectory, 'app', ...source),
      path.join(staged, route.id),
    );
  }
  for (const { route } of [...routes].sort(
    (left, right) => left.source.length - right.source.length,
  )) {
    const group = route.routeGroup.startsWith('(') ? [route.routeGroup] : [];
    const segments = route.urlSegment.split('/').filter(Boolean);
    const target = path.join(
      plan.stagingDirectory,
      'app',
      ...group,
      ...segments,
    );
    await mkdir(path.dirname(target), { recursive: true });
    await rename(path.join(staged, route.id), target);
  }
  await rm(staged, { recursive: true, force: true });
  await replaceRouteReferences(
    plan.stagingDirectory,
    plan.applicationPlan.routes,
  );
}

async function replaceRouteReferences(
  directory: string,
  routes: GenerationPlan['applicationPlan']['routes'],
): Promise<void> {
  const replacements: Array<{
    before: string;
    after: string;
    beforeLabel: string;
    afterLabel: string;
  }> = routes
    .flatMap((route) => {
      const before =
        defaultRouteUrls[route.id as keyof typeof defaultRouteUrls];
      const beforeLabel =
        defaultRouteLabels[route.id as keyof typeof defaultRouteLabels];
      if (
        before === undefined ||
        beforeLabel === undefined ||
        (before === route.urlSegment && beforeLabel === route.navigationLabel)
      ) {
        return [];
      }
      return [
        {
          before,
          after: route.urlSegment,
          beforeLabel,
          afterLabel: route.navigationLabel,
        },
      ];
    })
    .sort((left, right) => right.before.length - left.before.length);
  if (!replacements.length) return;
  const extensions = new Set(['.ts', '.tsx', '.js', '.mjs', '.md', '.yaml']);
  async function walk(current: string): Promise<void> {
    for (const entry of await readdir(current, { withFileTypes: true })) {
      if (entry.name.startsWith('.') || entry.name === 'node_modules') continue;
      const absolute = path.join(current, entry.name);
      if (entry.isDirectory()) {
        await walk(absolute);
        continue;
      }
      if (!extensions.has(path.extname(entry.name))) continue;
      let source = await readFile(absolute, 'utf8');
      const original = source;
      for (const { before, after } of replacements) {
        source = source.replaceAll(before, after);
      }
      for (const { beforeLabel, afterLabel } of replacements) {
        if (!beforeLabel || beforeLabel === afterLabel) continue;
        source = source
          .replaceAll(`label: "${beforeLabel}"`, `label: "${afterLabel}"`)
          .replaceAll(`>${beforeLabel}<`, `>${afterLabel}<`)
          .replaceAll(
            `${beforeLabel.toLowerCase().replaceAll(' ', '')}Label: "${beforeLabel}"`,
            `${beforeLabel.toLowerCase().replaceAll(' ', '')}Label: "${afterLabel}"`,
          );
      }
      if (source !== original) await writeFile(absolute, source);
    }
  }
  await walk(directory);
}

async function pruneEnvironmentExample(
  directory: string,
  providers: readonly ProviderId[],
  capabilities: GenerationPlan['applicationPlan']['selectedCapabilities'],
): Promise<void> {
  const envPath = path.join(directory, '.env.example');
  const source = await readFile(envPath, 'utf8');
  const excludedPrefixes = [
    ...(!providers.includes('clerk') ? ['CLERK_', 'NEXT_PUBLIC_CLERK_'] : []),
    ...(!providers.includes('neon')
      ? ['DATABASE_URL=', 'DIRECT_DATABASE_URL=']
      : []),
    ...(!providers.includes('stripe') ? ['STRIPE_'] : []),
    ...(!capabilities.includes('uploads') ? ['CLOUDINARY_'] : []),
    ...(!capabilities.includes('ai') ? ['HUGGINGFACE_'] : []),
    ...(!capabilities.includes('maps')
      ? ['MAPBOX_', 'NEXT_PUBLIC_MAPBOX_']
      : []),
  ];
  const lines = source
    .split(/\r?\n/)
    .filter(
      (line) => !excludedPrefixes.some((prefix) => line.startsWith(prefix)),
    );
  await writeFile(
    envPath,
    `${lines
      .join('\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim()}\n`,
  );
}

async function pruneLockfileImporter(
  directory: string,
  providers: readonly ProviderId[],
): Promise<void> {
  const removed = new Set<string>();
  if (!providers.includes('clerk')) {
    removed.add('@clerk/nextjs');
    removed.add('@clerk/testing');
  }
  if (!providers.includes('neon')) {
    for (const name of [
      '@neondatabase/serverless',
      '@prisma/adapter-neon',
      '@prisma/client',
      '@prisma/adapter-pg',
      '@types/pg',
      'pg',
      'prisma',
    ])
      removed.add(name);
  }
  if (!providers.includes('stripe')) removed.add('stripe');
  if (!removed.size) return;
  const lockPath = path.join(directory, 'pnpm-lock.yaml');
  const lines = (await readFile(lockPath, 'utf8')).split(/\r?\n/);
  const output: string[] = [];
  for (let index = 0; index < lines.length; index += 1) {
    const match = lines[index]?.match(/^ {6}('?)([^']+?)\1:\s*$/);
    if (!match || !removed.has(match[2] ?? '')) {
      output.push(lines[index] ?? '');
      continue;
    }
    while (index + 1 < lines.length && /^ {8}/.test(lines[index + 1] ?? '')) {
      index += 1;
    }
  }
  await writeFile(lockPath, output.join('\n'));
}

async function replaceInFile(
  filePath: string,
  replacements: readonly (readonly [string, string])[],
): Promise<void> {
  let source = await readFile(filePath, 'utf8');
  for (const [before, after] of replacements)
    source = source.replace(before, after);
  await writeFile(filePath, source);
}
