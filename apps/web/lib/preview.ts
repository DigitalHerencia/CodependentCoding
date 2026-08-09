import type { NormalizedRecipe } from '@loaded-vibes/core/browser';

export const previewSurfaceIds = [
  'dashboard',
  'onboarding',
  'settings',
  'billing',
  'workflow',
  'marketing',
] as const;

export type PreviewSurfaceId = (typeof previewSurfaceIds)[number];

export interface PreviewSurface {
  id: PreviewSurfaceId;
  label: string;
  available: boolean;
  requirement?: string;
}

export function getPreviewSurfaces(recipe: NormalizedRecipe): PreviewSurface[] {
  return [
    { id: 'dashboard', label: 'Dashboard', available: true },
    {
      id: 'onboarding',
      label: 'Onboarding',
      available: recipe.modules.onboarding,
      requirement: 'Product onboarding',
    },
    { id: 'settings', label: 'Settings', available: true },
    {
      id: 'billing',
      label: 'Billing',
      available: recipe.modules.billing,
      requirement: 'Subscription billing',
    },
    {
      id: 'workflow',
      label: 'Detail',
      available: recipe.modules.sampleDomain !== false,
      requirement: 'Sample projects domain',
    },
    {
      id: 'marketing',
      label: 'Marketing',
      available: recipe.modules.marketing,
      requirement: 'Marketing site',
    },
  ];
}
