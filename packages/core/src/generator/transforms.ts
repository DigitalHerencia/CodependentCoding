import { readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { GenerationPlan } from './plan.js';

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
  await writeFile(packagePath, `${JSON.stringify(packageJson, null, 2)}\n`);

  const templateMetadata = JSON.parse(
    await readFile(
      path.join(plan.stagingDirectory, '.loaded-vibes-template.json'),
      'utf8',
    ),
  ) as Record<string, unknown>;
  const provenance = {
    schemaVersion: 1,
    generator: 'create-loaded-vibes',
    generatorVersion: '0.1.0',
    preset: plan.config.recipe.product,
    projectName: plan.config.recipe.name,
    templateRevision: templateMetadata.templateRevision,
    sourceRevision: templateMetadata.sourceRevision,
  };
  await writeFile(
    path.join(plan.stagingDirectory, '.loaded-vibes.json'),
    `${JSON.stringify(provenance, null, 2)}\n`,
  );
  await writeFile(
    path.join(plan.stagingDirectory, 'loadedvibes.json'),
    `${JSON.stringify(plan.config.recipe, null, 2)}\n`,
  );
  const capabilitiesSource = `export const loadedVibesProduct = ${JSON.stringify(
    {
      name: plan.config.recipe.identity.displayName,
      description:
        plan.config.recipe.identity.description ||
        'A focused SaaS product built with Loaded Vibes.',
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
    plan.config.recipe.design,
    null,
    2,
  )}

export const loadedVibesCapabilities = ${JSON.stringify(
    {
      marketing: plan.config.recipe.modules.marketing,
      sampleDomain: plan.config.recipe.modules.sampleDomain !== false,
      stripeConnect: plan.config.recipe.modules.stripeConnect,
    },
    null,
    2,
  )} as const\n`;
  await writeFile(
    path.join(plan.stagingDirectory, 'content', 'loadedvibes.ts'),
    capabilitiesSource,
  );
  const publicRoutes = [
    '/',
    ...(plan.config.recipe.modules.marketing ? ['/pricing', '/faq'] : []),
  ];
  const protectedRoutes = [
    '/dashboard',
    ...(plan.config.recipe.modules.sampleDomain !== false
      ? ['/projects', '/projects/new', '/projects/[projectId]']
      : []),
    '/settings',
  ];
  const apiRoutes = [
    '/api/clerk/webhooks',
    '/api/stripe/webhooks',
    ...(plan.config.recipe.modules.stripeConnect
      ? ['/api/stripe/connect/webhooks']
      : []),
  ];
  const routesContract = `id: vibes.routes
version: 1
authority: current-source-contract
public: ${JSON.stringify(publicRoutes)}
auth: ["/sign-in", "/sign-up"]
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
    path.join(plan.stagingDirectory, '.agents', 'contracts', 'routes.yaml'),
    routesContract,
  );
}
