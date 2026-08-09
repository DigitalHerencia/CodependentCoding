import { describe, expect, it } from 'vitest';
import {
  createCliCommand,
  defaultConfiguratorRecipe,
  deserializeRecipe,
  resolveConfiguratorRecipe,
  selectProductPreset,
  serializeRecipe,
  setCapability,
} from '../../apps/web/lib/configurator.js';

describe('web configurator recipe', () => {
  it('uses the same preset resolver as the CLI', () => {
    const draft = selectProductPreset(
      defaultConfiguratorRecipe,
      'client-portal',
    );
    const resolved = resolveConfiguratorRecipe(draft);
    expect(resolved.recipe.product).toBe('client-portal');
    expect(resolved.recipe.modules.invitations).toBe(true);
    expect(resolved.recipe.modules.billing).toBe(false);
  });

  it('automatically resolves capability dependencies', () => {
    let draft = selectProductPreset(
      defaultConfiguratorRecipe,
      'bare-golden-app',
    );
    draft = setCapability(draft, 'stripeConnect', true);
    const resolved = resolveConfiguratorRecipe(draft);
    expect(resolved.recipe.modules.billing).toBe(true);
    expect(resolved.summary.autoIncluded).toContain('Subscription billing');
  });

  it('round trips a normalized reproducible recipe', () => {
    const serialized = serializeRecipe(defaultConfiguratorRecipe);
    expect(serializeRecipe(deserializeRecipe(serialized))).toBe(serialized);
  });

  it('provides a self-contained package command', () => {
    expect(createCliCommand(defaultConfiguratorRecipe)).toBe(
      'pnpm dlx create-loaded-vibes@latest my-saas --config loadedvibes.json --yes',
    );
  });
});
