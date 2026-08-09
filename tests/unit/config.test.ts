import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { normalizeConfig } from '../../src/config/normalize.js';

describe('normalizeConfig', () => {
  it('normalizes every input surface into the fixed standard preset', () => {
    const config = normalizeConfig(
      { projectName: 'acme-saas', targetDirectory: 'Acme SaaS' },
      'C:\\work',
    );
    expect(config).toEqual({
      schemaVersion: 1,
      projectName: 'acme-saas',
      targetDirectory: path.resolve('C:\\work', 'Acme SaaS'),
      preset: 'standard',
      git: { initialize: true },
      install: { enabled: true },
    });
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
