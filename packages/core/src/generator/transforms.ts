import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { NormalizedRecipe } from '@hipster-stack/schema';
import {
  excludedOwnedPaths,
  selectedGeneratedModuleIds,
} from '../ownership.js';
import type { GenerationPlan } from './plan.js';

export interface TemplateProvenance {
  templateId: string;
  templateVersion: string;
}

export async function writeRecipeArtifacts(
  directory: string,
  recipe: NormalizedRecipe,
  template: TemplateProvenance,
): Promise<void> {
  await writeFile(
    path.join(directory, 'hipsterstack.json'),
    `${JSON.stringify(recipe, null, 2)}\n`,
  );
  await mkdir(path.join(directory, '.loadedvibes'), { recursive: true });
  await writeFile(
    path.join(directory, '.loadedvibes', 'manifest.json'),
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
        recipe,
      },
      null,
      2,
    )}\n`,
  );
  await writeProductContract(directory, recipe);
  await writeRoutesContract(directory, recipe);
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
      uploads: true,
      ai: true,
      maps: true,
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
): Promise<void> {
  const publicRoutes = [
    '/',
    '/contact',
    '/privacy',
    '/terms',
    ...(recipe.modules.marketing ? ['/pricing', '/faq'] : []),
  ];
  const protectedRoutes = [
    '/dashboard',
    ...(recipe.modules.sampleDomain !== false
      ? ['/projects', '/projects/new', '/projects/[projectId]']
      : []),
    '/settings',
    ...(recipe.modules.invitations ? ['/team'] : []),
    '/uploads',
    '/maps',
    '/ai',
    ...(recipe.modules.onboarding ? ['/onboarding'] : []),
    ...(recipe.modules.admin ? ['/admin'] : []),
    ...(recipe.modules.billing ? ['/checkout', '/success', '/canceled'] : []),
  ];
  const apiRoutes = [
    '/api/clerk/webhooks',
    '/api/cloudinary/webhooks',
    ...(recipe.modules.billing ? ['/api/stripe/webhooks'] : []),
    ...(recipe.modules.stripeConnect ? ['/api/stripe/connect/webhooks'] : []),
  ];
  const routesContract = `id: white-label-application.routes
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
  await writeFile(packagePath, `${JSON.stringify(packageJson, null, 2)}\n`);

  const templateMetadata = JSON.parse(
    await readFile(
      path.join(plan.stagingDirectory, '.loaded-vibes-template.json'),
      'utf8',
    ),
  ) as Record<string, unknown>;
  const provenance = {
    schemaVersion: 1,
    generator: 'hipster-stack',
    generatorVersion: '0.1.0',
    preset: plan.config.recipe.product,
    projectName: plan.config.recipe.name,
    templateId: templateMetadata.templateId,
    templateVersion: templateMetadata.templateVersion,
    composition: 'copy-one-template-retain-remove-transform',
    excludedOwnedPaths: plan.excludedOwnedPaths,
  };
  await writeFile(
    path.join(plan.stagingDirectory, '.hipster-stack.json'),
    `${JSON.stringify(provenance, null, 2)}\n`,
  );
  await writeRecipeArtifacts(plan.stagingDirectory, plan.config.recipe, {
    templateId: String(templateMetadata.templateId),
    templateVersion: String(templateMetadata.templateVersion),
  });
}
