import { describe, expect, it } from 'vitest';
import { normalizeConfig, type ConfigInput } from '@loaded-vibes/core';
import {
  createCliCommand,
  defaultConfiguratorRecipe,
  deserializeRecipe,
  resolveConfiguratorRecipe,
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

  it('provides a self-contained package command', () => {
    expect(createCliCommand(defaultConfiguratorRecipe)).toBe(
      'pnpm dlx create-loaded-vibes@latest my-saas --config loadedvibes.json --yes',
    );
  });
});
