import { describe, expect, it } from 'vitest';
import { normalizeConfig, type ConfigInput } from '@hipster-stack/core';
import {
  createCliCommand,
  createShareUrl,
  defaultConfiguratorRecipe,
  deserializeRecipe,
  resolveConfiguratorRecipe,
  selectProductPreset,
  serializeRecipe,
  setCapability,
} from '../../apps/web/lib/configurator.js';

describe('web configurator recipe', () => {
  it('automatically resolves capability dependencies', () => {
    let draft = defaultConfiguratorRecipe;
    draft = setCapability(draft, 'stripeConnect', true);
    const resolved = resolveConfiguratorRecipe(draft);
    expect(resolved.recipe.modules.billing).toBe(true);
    expect(resolved.summary.autoIncluded).toContain('Subscription billing');
  });

  it('round trips a normalized reproducible recipe', () => {
    const serialized = serializeRecipe(defaultConfiguratorRecipe);
    expect(serializeRecipe(deserializeRecipe(serialized))).toBe(serialized);
    expect(
      normalizeConfig(JSON.parse(serialized) as ConfigInput, 'D:/recipes')
        .recipe.name,
    ).toBe('my-saas');
  });

  it('provides the canonical Hipster Stack package command', () => {
    expect(createCliCommand(defaultConfiguratorRecipe)).toBe(
      'pnpm dlx hipster-stack@latest my-saas --config hipsterstack.json --yes',
    );
  });

  it('applies a preset through shared resolution without retaining overrides', () => {
    const customized = setCapability(
      defaultConfiguratorRecipe,
      'stripeConnect',
      true,
    );
    const selected = selectProductPreset(customized, 'client-portal');

    expect(selected.capabilities).toEqual({ include: [], exclude: [] });
    expect(resolveConfiguratorRecipe(selected).summary.preset.id).toBe(
      'client-portal',
    );
    expect(resolveConfiguratorRecipe(selected).recipe.modules.onboarding).toBe(
      true,
    );
  });

  it('creates a portable share URL that hydrates the same recipe', () => {
    const shared = createShareUrl(
      defaultConfiguratorRecipe,
      'https://hipster.example/configure?source=test',
    );
    const url = new URL(shared);
    const encoded = url.searchParams.get('recipe');

    expect(url.searchParams.get('source')).toBe('test');
    expect(encoded).not.toBeNull();
    expect(serializeRecipe(deserializeRecipe(encoded!))).toBe(
      serializeRecipe(defaultConfiguratorRecipe),
    );
  });
});
