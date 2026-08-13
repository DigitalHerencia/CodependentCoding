import { describe, expect, it, vi } from 'vitest';
import {
  collectInteractiveRecipe,
  formatRecipeReview,
  type CreateFlowPrompts,
} from '../../packages/cli/src/create-flow.js';
import { resolveRecipe } from '@hipster-stack/core';

function prompts(
  overrides: Partial<CreateFlowPrompts> = {},
): CreateFlowPrompts {
  return {
    mode: async () => 'express',
    product: async () => 'b2b-saas',
    capabilities: async () => [],
    displayName: async () => 'Acme Cloud',
    description: async () => '',
    theme: async () => 'obsidian',
    radius: async () => 'medium',
    density: async () => 'comfortable',
    navigation: async () => 'sidebar',
    colorMode: async () => 'system',
    review: vi.fn(),
    approve: async () => true,
    ...overrides,
  };
}

describe('CLI product flow', () => {
  it('keeps Express mode to product shape and identity decisions', async () => {
    const capabilities = vi.fn(async () => []);
    const result = await collectInteractiveRecipe(
      { name: 'acme-cloud' },
      prompts({ capabilities }),
    );
    expect(result).toMatchObject({
      name: 'acme-cloud',
      product: 'b2b-saas',
      identity: { displayName: 'Acme Cloud' },
    });
    expect(capabilities).not.toHaveBeenCalled();
  });

  it('maps every Advanced choice into the shared recipe', async () => {
    const result = await collectInteractiveRecipe(
      { name: 'marketplace' },
      prompts({
        mode: async () => 'advanced',
        product: async () => 'platform-marketplace',
        capabilities: async () => ['stripeConnect', 'admin', 'marketing'],
        description: async () => 'A marketplace for independent makers.',
        theme: async () => 'electric',
        radius: async () => 'rounded',
        density: async () => 'compact',
        navigation: async () => 'topbar',
        colorMode: async () => 'dark',
      }),
    );
    expect(result).toMatchObject({
      product: 'platform-marketplace',
      modules: {
        stripeConnect: true,
        admin: true,
        marketing: true,
        billing: false,
      },
      identity: {
        displayName: 'Acme Cloud',
        description: 'A marketplace for independent makers.',
      },
      design: {
        theme: 'electric',
        radius: 'rounded',
        density: 'compact',
        navigation: 'topbar',
        mode: 'dark',
      },
    });
  });

  it('formats a review with resolved providers and capabilities', () => {
    const review = formatRecipeReview(
      resolveRecipe({ name: 'review-app', product: 'client-portal' }),
    );
    expect(review).toContain('Providers: Clerk, Neon PostgreSQL');
    expect(review).toContain('Authorization: RBAC');
    expect(review).toContain('Optional surfaces:');
    expect(review).toContain('Excluded surfaces:');
    expect(review).toContain('Client portal');
  });
});
