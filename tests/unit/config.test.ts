import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { normalizeConfig, normalizeRecipe } from '@hipster-stack/core';

describe('normalizeConfig', () => {
  it('normalizes legacy create input into the shared versioned recipe', () => {
    const config = normalizeConfig(
      { projectName: 'acme-saas', targetDirectory: 'Acme SaaS' },
      'C:\\work',
    );
    expect(config).toEqual({
      applicationDefinition: {
        schemaVersion: 1,
        preset: 'bare-golden-app',
        identity: {
          packageName: 'acme-saas',
          displayName: 'acme-saas',
          description: '',
        },
        capabilities: { include: [], exclude: [] },
        presentation: {
          theme: 'obsidian',
          radius: 'medium',
          density: 'comfortable',
          navigation: 'sidebar',
          mode: 'system',
        },
        providers: {},
        authorization: { model: 'rbac' },
        routes: [],
        outputOverrides: { artifactSets: {}, artifacts: {} },
      },
      recipe: {
        schemaVersion: 1,
        name: 'acme-saas',
        product: 'bare-golden-app',
        modules: {
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
        },
        identity: { displayName: 'acme-saas', description: '' },
        design: {
          theme: 'obsidian',
          radius: 'medium',
          density: 'comfortable',
          navigation: 'sidebar',
          mode: 'system',
        },
      },
      targetDirectory: path.resolve('C:\\work', 'Acme SaaS'),
      git: { initialize: true },
      install: { enabled: true },
    });
  });

  it('lets non-CLI consumers normalize a strict recipe', () => {
    expect(normalizeRecipe({ name: 'shared-recipe' })).toEqual({
      schemaVersion: 1,
      name: 'shared-recipe',
      product: 'bare-golden-app',
      modules: expect.objectContaining({ organizations: true, rbac: true }),
      identity: { displayName: 'shared-recipe', description: '' },
      design: expect.objectContaining({ theme: 'obsidian' }),
    });
  });

  it('accepts a canonical Application Definition without legacy recipe fields', () => {
    const config = normalizeConfig(
      {
        applicationDefinition: {
          identity: { packageName: 'definition-app' },
          capabilities: { include: ['billing'], exclude: [] },
        },
        targetDirectory: 'definition-app',
      },
      'D:/work',
    );

    expect(config.applicationDefinition.identity.packageName).toBe(
      'definition-app',
    );
    expect(config.recipe.modules.billing).toBe(true);
  });

  it('rejects ambiguous canonical and legacy configuration fields', () => {
    expect(() =>
      normalizeConfig({
        applicationDefinition: {
          identity: { packageName: 'definition-app' },
        },
        name: 'legacy-app',
      }),
    ).toThrowError(expect.objectContaining({ code: 'INVALID_CONFIG' }));
  });

  it('rejects unknown recipe fields', () => {
    expect(() =>
      normalizeRecipe({ name: 'safe-name', framework: 'next' } as never),
    ).toThrowError(expect.objectContaining({ code: 'INVALID_CONFIG' }));
  });

  it('rejects unsafe package names', () => {
    expect(() =>
      normalizeConfig({ projectName: '../escape', targetDirectory: 'safe' }),
    ).toThrowError(expect.objectContaining({ code: 'INVALID_PROJECT_NAME' }));
  });

  it('rejects unknown configuration fields before writing', () => {
    expect(() =>
      normalizeConfig({
        projectName: 'safe-name',
        targetDirectory: 'safe',
        surprise: true,
      } as never),
    ).toThrowError(expect.objectContaining({ code: 'INVALID_CONFIG' }));
  });
});
