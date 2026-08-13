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
      uploads: recipe.modules.organizations,
      ai: recipe.modules.organizations,
      maps: recipe.modules.organizations,
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
      ? [
          routeUrl('organization-settings', '/settings'),
          '/uploads',
          '/maps',
          '/ai',
        ]
      : []),
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
    ...(recipe.modules.organizations ? ['/api/cloudinary/webhooks'] : []),
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
  await rename(
    path.join(plan.stagingDirectory, 'gitignore.template'),
    path.join(plan.stagingDirectory, '.gitignore'),
  );
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
    plan.applicationPlan.selectedCapabilities.includes('organizations'),
  );
  await pruneLockfileImporter(plan.stagingDirectory, providers);
  await applyRouteComposition(plan);
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
  const replacements = routes
    .map((route) => ({
      before: defaultRouteUrls[route.id as keyof typeof defaultRouteUrls],
      after: route.urlSegment,
      beforeLabel:
        defaultRouteLabels[route.id as keyof typeof defaultRouteLabels],
      afterLabel: route.navigationLabel,
    }))
    .filter(
      (
        entry,
      ): entry is {
        before: string;
        after: string;
        beforeLabel: string;
        afterLabel: string;
      } =>
        entry.before !== undefined &&
        entry.beforeLabel !== undefined &&
        (entry.before !== entry.after ||
          entry.beforeLabel !== entry.afterLabel),
    )
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
  hasOrganizations: boolean,
): Promise<void> {
  const envPath = path.join(directory, '.env.example');
  const source = await readFile(envPath, 'utf8');
  const excludedPrefixes = [
    ...(!providers.includes('clerk') ? ['CLERK_', 'NEXT_PUBLIC_CLERK_'] : []),
    ...(!providers.includes('neon')
      ? ['DATABASE_URL=', 'DIRECT_DATABASE_URL=']
      : []),
    ...(!providers.includes('stripe') ? ['STRIPE_'] : []),
    ...(!hasOrganizations
      ? ['CLOUDINARY_', 'HUGGINGFACE_', 'MAPBOX_', 'NEXT_PUBLIC_MAPBOX_']
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
    const match = lines[index]?.match(/^      ('?)([^']+?)\1:\s*$/);
    if (!match || !removed.has(match[2] ?? '')) {
      output.push(lines[index] ?? '');
      continue;
    }
    while (
      index + 1 < lines.length &&
      /^        /.test(lines[index + 1] ?? '')
    ) {
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
