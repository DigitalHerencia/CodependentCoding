import {
  capabilityIds,
  type CapabilityId,
  type ModuleSelection,
  type ResolvedModules,
} from '@loaded-vibes/schema';
import { LoadedVibesError } from './errors.js';

export interface CapabilityDefinition {
  id: CapabilityId;
  label: string;
  requires: readonly CapabilityId[];
  conflicts: readonly CapabilityId[];
  fixed: boolean;
}

export const capabilityRegistry = {
  organizations: definition('organizations', 'Organizations', [], [], true),
  invitations: definition('invitations', 'Membership invitations', [
    'organizations',
  ]),
  rbac: definition(
    'rbac',
    'Local roles and authorization',
    ['organizations'],
    [],
    true,
  ),
  billing: definition('billing', 'Subscription billing', ['organizations']),
  stripeConnect: definition(
    'stripeConnect',
    'Stripe Connect platform payments',
    ['organizations', 'rbac', 'billing'],
  ),
  onboarding: definition('onboarding', 'Product onboarding', ['organizations']),
  admin: definition('admin', 'Administrative surface', ['rbac']),
  marketing: definition('marketing', 'Marketing site'),
  sampleDomain: definition('sampleDomain', 'Sample projects domain', [
    'organizations',
    'rbac',
  ]),
  governance: definition(
    'governance',
    'Generated project guidance',
    [],
    [],
    true,
  ),
} satisfies Record<CapabilityId, CapabilityDefinition>;

function definition(
  id: CapabilityId,
  label: string,
  requires: readonly CapabilityId[] = [],
  conflicts: readonly CapabilityId[] = [],
  fixed = false,
): CapabilityDefinition {
  return { id, label, requires, conflicts, fixed };
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
    marketing: overrides.marketing ?? presetModules.marketing,
    sampleDomain: overrides.sampleDomain ?? presetModules.sampleDomain,
    governance: overrides.governance ?? presetModules.governance,
  };
  const autoIncluded = new Set<CapabilityId>();
  for (const id of capabilityIds) {
    if (!registry[id].fixed || isEnabled(modules, id)) continue;
    enable(modules, id);
    autoIncluded.add(id);
  }
  let changed = true;
  while (changed) {
    changed = false;
    for (const id of capabilityIds) {
      if (!isEnabled(modules, id)) continue;
      for (const requirement of registry[id].requires) {
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

  return { modules, autoIncluded: [...autoIncluded] };
}
