import type {
  OntologyId,
  ProductPresetId,
  ResolvedModules,
} from '@hipster-stack/schema';
import { ontologyCatalog } from './ontologies.js';

export interface ProductPreset {
  id: ProductPresetId;
  label: string;
  description: string;
  modules: ResolvedModules;
}

const goldenFoundation = {
  organizations: true,
  invitations: false,
  rbac: true,
  billing: false,
  stripeConnect: false,
  onboarding: false,
  admin: false,
  uploads: false,
  ai: false,
  maps: false,
  marketing: false,
  sampleDomain: false,
  governance: true,
} as const satisfies ResolvedModules;

const ontologyPresets = Object.fromEntries(
  Object.values(ontologyCatalog).map((ontology) => [
    ontology.id,
    {
      id: ontology.id,
      label: ontology.label,
      description: ontology.description,
      modules: ontology.modules,
    },
  ]),
) as Record<OntologyId, ProductPreset>;

export const productPresets: Record<ProductPresetId, ProductPreset> = {
  ...ontologyPresets,
  'bare-golden-app': {
    id: 'bare-golden-app',
    label: 'Bare golden app',
    description: 'The proven auth, tenancy, RBAC, and governance foundation.',
    modules: goldenFoundation,
  },
  'b2b-saas': {
    id: 'b2b-saas',
    label: 'B2B SaaS',
    description: 'Team accounts, subscriptions, onboarding, and admin tools.',
    modules: {
      ...goldenFoundation,
      invitations: true,
      billing: true,
      onboarding: true,
      admin: true,
      marketing: true,
      sampleDomain: 'projects',
    },
  },
  'client-portal': {
    id: 'client-portal',
    label: 'Client portal',
    description:
      'A secure client workspace with onboarding and administration.',
    modules: {
      ...goldenFoundation,
      invitations: true,
      onboarding: true,
      admin: true,
      marketing: true,
      sampleDomain: 'projects',
    },
  },
  'platform-marketplace': {
    id: 'platform-marketplace',
    label: 'Platform or marketplace',
    description: 'A subscription platform with connected-account payments.',
    modules: {
      ...goldenFoundation,
      invitations: true,
      billing: true,
      stripeConnect: true,
      onboarding: true,
      admin: true,
      marketing: true,
      sampleDomain: 'projects',
    },
  },
};

export function getProductPreset(id: ProductPresetId): ProductPreset {
  return productPresets[id];
}
