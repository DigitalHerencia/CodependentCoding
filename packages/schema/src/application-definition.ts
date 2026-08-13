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

export const authorizationModelIds = ['rbac', 'abac', 'none'] as const;
export const authorizationModelIdSchema = z.enum(authorizationModelIds);

export const outputPolicyIds = ['INHERIT', 'INCLUDE', 'EXCLUDE'] as const;
export const outputPolicySchema = z.enum(outputPolicyIds);

export const artifactSetIds = [
  'organizations',
  'invitations',
  'rbac',
  'billing',
  'stripe-connect',
  'onboarding',
  'admin',
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
    name: z.string().min(1),
    displayName: z.string().min(1),
    scope: z.enum(['application', 'organization']),
    permissions: z.array(z.string()),
  })
  .strict();

export const routeSurfaceDefinitionSchema = z
  .object({
    id: z.string().min(1),
    urlSegment: z.string(),
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

export const applicationDefinitionSchema = z
  .object({
    schemaVersion: z
      .literal(applicationDefinitionSchemaVersion)
      .default(applicationDefinitionSchemaVersion),
    preset: productPresetSchema.default('bare-golden-app'),
    identity: applicationIdentitySchema,
    capabilities: capabilityOverridesSchema.default({
      include: [],
      exclude: [],
    }),
    presentation: designSchema.default(defaultDesign),
    outputOverrides: z
      .object({
        artifactSets: z
          .partialRecord(artifactSetIdSchema, outputPolicySchema)
          .default({}),
      })
      .strict()
      .default({ artifactSets: {} }),
  })
  .strict();

export type PropertyMechanism = z.infer<typeof propertyMechanismSchema>;
export type PropertyState = z.infer<typeof propertyStateSchema>;
export type ProviderId = z.infer<typeof providerIdSchema>;
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
export type ApplicationDefinitionInput = z.input<
  typeof applicationDefinitionSchema
>;
export type ApplicationDefinition = z.output<
  typeof applicationDefinitionSchema
>;

export { capabilityIds, productPresetIds };
