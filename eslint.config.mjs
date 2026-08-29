import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [
      'dist/**',
      'template/**',
      'templates/**',
      'src/**',
      'components/**',
      'packages/loaded-vibes/**',
      '.agents/Loaded-Vibes-Codex-Plugin-v0.1.0/**',
      '.artifacts/**',
      'coverage/**',
      '**/.next/**',
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: { globals: { console: 'readonly', process: 'readonly' } },
  },
);
