import { z } from 'zod';
import {
  capabilityIds,
  defaultDesign,
  designSchema,
  productPresetIds,
  productPresetSchema,
} from './recipe.js';

export const applicationDefinitionSchemaVersion = 1 as const;

export const propertyMechanismIds = [
  'text',
  'toggle',
  'select',
  'multi-select',
  'relation',
  'rollup',
  'derived',
  'structured',
  'reorderable',
] as const;
export const propertyMechanismSchema = z.enum(propertyMechanismIds);

export const propertyStateIds = [
  'DEFAULT',
  'PRESET',
  'USER',
  'DERIVED',
  'REQUIRED',
  'LOCKED',
] as const;
export const propertyStateSchema = z.enum(propertyStateIds);

export const providerIds = ['clerk', 'neon', 'stripe'] as const;
export const providerIdSchema = z.enum(providerIds);

export const authenticationProviderIds = ['none', 'clerk'] as const;
export const authenticationProviderSchema = z.enum(authenticationProviderIds);
export const databaseTechnologyIds = ['none', 'postgresql'] as const;
export const databaseTechnologySchema = z.enum(databaseTechnologyIds);
export const postgresqlProviderIds = ['none', 'neon'] as const;
export const postgresqlProviderSchema = z.enum(postgresqlProviderIds);
export const commerceProviderIds = ['none', 'stripe'] as const;
export const commerceProviderSchema = z.enum(commerceProviderIds);

export const authorizationModelIds = ['rbac', 'abac', 'none'] as const;
export const authorizationModelIdSchema = z.enum(authorizationModelIds);

export const outputPolicyIds = ['INHERIT', 'INCLUDE', 'EXCLUDE'] as const;
export const outputPolicySchema = z.enum(outputPolicyIds);

export const artifactSetIds = [
  'application-shell',
  'authentication-clerk',
  'persistence-postgresql',
  'commerce-stripe',
  'playwright',
  'vitest',
  'github-actions',
  'vercel',
  'organizations',
  'invitations',
  'rbac',
  'billing',
  'stripe-connect',
  'onboarding',
  'admin',
  'uploads',
  'ai',
  'maps',
  'marketing',
  'sample-domain',
  'governance',
] as const;
export const artifactSetIdSchema = z.enum(artifactSetIds);

export const dependencySchema = z
  .object({
    id: z.string().min(1),
    requiredBy: z.string().min(1),
    reason: z.string().min(1),
  })
  .strict();

export const constraintSchema = z
  .object({
    id: z.string().min(1),
    description: z.string().min(1),
    conflicts: z.array(z.string()).default([]),
  })
  .strict();

export const providerDefinitionSchema = z
  .object({
    id: providerIdSchema,
    label: z.string().min(1),
    slot: z.enum(['authentication', 'persistence', 'commerce']),
    environment: z.array(z.string()),
    setup: z.array(z.string()),
  })
  .strict();

export const capabilityDefinitionSchema = z
  .object({
    id: z.enum(capabilityIds),
    label: z.string().min(1),
    description: z.string().min(1),
    requires: z.array(z.enum(capabilityIds)),
    conflicts: z.array(z.enum(capabilityIds)),
    providers: z.array(providerIdSchema),
    resources: z.array(z.string()),
    permissions: z.array(z.string()),
    routes: z.array(z.string()),
    modules: z.array(z.string()),
    artifactSets: z.array(artifactSetIdSchema),
    environment: z.array(z.string()),
    setup: z.array(z.string()),
    fixed: z.boolean(),
  })
  .strict();

export const resourceDefinitionSchema = z
  .object({
    id: z.string().min(1),
    label: z.string().min(1),
    provider: providerIdSchema.optional(),
  })
  .strict();

export const roleDefinitionSchema = z
  .object({
    name: z
      .string()
      .regex(
        /^[a-z][a-z0-9_]*$/,
        'Role names must start with a lowercase letter and contain only lowercase letters, numbers, and underscores.',
      ),
    displayName: z.string().min(1),
    scope: z.enum(['application', 'organization']),
    permissions: z.array(z.string()),
  })
  .strict();

export const routeSurfaceDefinitionSchema = z
  .object({
    id: z.string().min(1),
    urlSegment: z.string(),
    routeGroup: z.string().min(1),
    navigationLabel: z.string().min(1),
    access: z.enum(['public', 'authenticated', 'authorized']),
    capability: z.enum(capabilityIds).optional(),
  })
  .strict();

export const artifactDefinitionSchema = z
  .object({
    path: z.string().min(1),
    owner: z.string().min(1),
    artifactSet: artifactSetIdSchema,
    requiredBy: z.array(z.enum(capabilityIds)),
    removable: z.boolean(),
    generationPolicy: z.enum(['INHERIT', 'INCLUDE', 'EXCLUDE', 'LOCKED']),
    replacementPolicy: z.enum(['retain', 'remove', 'transform']),
    dependencies: z.array(z.string()),
    generationReason: z.string().min(1),
  })
  .strict();

export const artifactSetDefinitionSchema = z
  .object({
    id: artifactSetIdSchema,
    label: z.string().min(1),
    owner: z.string().min(1),
    capabilities: z.array(z.enum(capabilityIds)),
    artifacts: z.array(artifactDefinitionSchema),
  })
  .strict();

export const propertyDefinitionSchema = z
  .object({
    id: z.string().min(1),
    label: z.string().min(1),
    description: z.string().min(1),
    type: propertyMechanismSchema,
    category: z.string().min(1),
    allowedValues: z.array(z.string()).optional(),
    required: z.boolean().default(false),
    visibleWhen: z.array(z.string()).default([]),
    enabledWhen: z.array(z.string()).default([]),
    requires: z.array(z.string()).default([]),
    conflictsWith: z.array(z.string()).default([]),
    derivedFrom: z.array(z.string()).default([]),
    affects: z.array(z.string()).default([]),
    validation: z.array(z.string()).default([]),
  })
  .strict();

export const capabilityOverridesSchema = z
  .object({
    include: z.array(z.enum(capabilityIds)).default([]),
    exclude: z.array(z.enum(capabilityIds)).default([]),
  })
  .strict()
  .superRefine((value, context) => {
    for (const id of value.include) {
      if (value.exclude.includes(id)) {
        context.addIssue({
          code: 'custom',
          message: `Capability "${id}" cannot be both included and excluded.`,
        });
      }
    }
  });

export const applicationIdentitySchema = z
  .object({
    packageName: z.string().trim().min(1),
    displayName: z.string().trim().min(1).optional(),
    description: z.string().trim().max(160).default(''),
  })
  .strict();

export const providerSelectionSchema = z
  .object({
    authentication: authenticationProviderSchema.optional(),
    persistence: z
      .object({
        technology: databaseTechnologySchema,
        provider: postgresqlProviderSchema,
      })
      .strict()
      .optional(),
    commerce: commerceProviderSchema.optional(),
  })
  .strict()
  .superRefine((value, context) => {
    if (!value.persistence) return;
    const validPersistence =
      (value.persistence.technology === 'none' &&
        value.persistence.provider === 'none') ||
      (value.persistence.technology === 'postgresql' &&
        value.persistence.provider === 'neon');
    if (!validPersistence) {
      context.addIssue({
        code: 'custom',
        path: ['persistence'],
        message:
          'Persistence must be either none/none or PostgreSQL backed by Neon.',
      });
    }
  });

export const authorizationSelectionSchema = z
  .object({
    model: z.enum(['rbac', 'none']).default('rbac'),
    roles: z.array(roleDefinitionSchema).min(2).optional(),
  })
  .strict()
  .superRefine((value, context) => {
    if (!value.roles) return;
    const names = new Set<string>();
    for (const [index, role] of value.roles.entries()) {
      if (names.has(role.name)) {
        context.addIssue({
          code: 'custom',
          path: ['roles', index, 'name'],
          message: `Role name "${role.name}" must be unique.`,
        });
      }
      names.add(role.name);
      if (role.scope !== 'organization') {
        context.addIssue({
          code: 'custom',
          path: ['roles', index, 'scope'],
          message:
            'Application-scoped roles are not supported by this architecture version.',
        });
      }
    }
  });

export const routeOverrideSchema = z
  .object({
    id: z.string().min(1),
    urlSegment: z.string().startsWith('/'),
    navigationLabel: z.string().min(1).optional(),
  })
  .strict();

export const applicationDefinitionSchema = z
  .object({
    schemaVersion: z
      .literal(applicationDefinitionSchemaVersion)
      .default(applicationDefinitionSchemaVersion),
    preset: productPresetSchema.default('bare-golden-app'),
    identity: applicationIdentitySchema,
    providers: providerSelectionSchema.default({}),
    capabilities: capabilityOverridesSchema.default({
      include: [],
      exclude: [],
    }),
    presentation: designSchema.default(defaultDesign),
    authorization: authorizationSelectionSchema.default({ model: 'rbac' }),
    routes: z.array(routeOverrideSchema).default([]),
    outputOverrides: z
      .object({
        artifactSets: z
          .partialRecord(artifactSetIdSchema, outputPolicySchema)
          .default({}),
        artifacts: z.record(z.string(), outputPolicySchema).default({}),
      })
      .strict()
      .default({ artifactSets: {}, artifacts: {} }),
  })
  .strict();

export type PropertyMechanism = z.infer<typeof propertyMechanismSchema>;
export type PropertyState = z.infer<typeof propertyStateSchema>;
export type ProviderId = z.infer<typeof providerIdSchema>;
export type AuthenticationProvider = z.infer<
  typeof authenticationProviderSchema
>;
export type DatabaseTechnology = z.infer<typeof databaseTechnologySchema>;
export type PostgresqlProvider = z.infer<typeof postgresqlProviderSchema>;
export type CommerceProvider = z.infer<typeof commerceProviderSchema>;
export type AuthorizationModelId = z.infer<typeof authorizationModelIdSchema>;
export type OutputPolicy = z.infer<typeof outputPolicySchema>;
export type ArtifactSetId = z.infer<typeof artifactSetIdSchema>;
export type Dependency = z.infer<typeof dependencySchema>;
export type Constraint = z.infer<typeof constraintSchema>;
export type ProviderDefinition = z.infer<typeof providerDefinitionSchema>;
export type CapabilityDefinition = z.infer<typeof capabilityDefinitionSchema>;
export type ResourceDefinition = z.infer<typeof resourceDefinitionSchema>;
export type RoleDefinition = z.infer<typeof roleDefinitionSchema>;
export type RouteSurfaceDefinition = z.infer<
  typeof routeSurfaceDefinitionSchema
>;
export type Artifact = z.infer<typeof artifactDefinitionSchema>;
export type ArtifactSet = z.infer<typeof artifactSetDefinitionSchema>;
export type PropertyDefinition = z.infer<typeof propertyDefinitionSchema>;
export type ProviderSelection = z.infer<typeof providerSelectionSchema>;
export type AuthorizationSelection = z.infer<
  typeof authorizationSelectionSchema
>;
export type RouteOverride = z.infer<typeof routeOverrideSchema>;
export type ApplicationDefinitionInput = z.input<
  typeof applicationDefinitionSchema
>;
export type ApplicationDefinition = z.output<
  typeof applicationDefinitionSchema
>;

export { capabilityIds, productPresetIds };
