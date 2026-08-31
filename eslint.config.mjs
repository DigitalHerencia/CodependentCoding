import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTypeScript from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier/flat';

const databaseRuntimePaths = [
  {
    name: '@prisma/client',
    allowTypeImports: true,
    message:
      'Database runtime access belongs in lib/db, lib/fetchers, lib/actions, or prisma. Use a typed boundary instead.',
  },
  {
    name: '@prisma/adapter-neon',
    allowTypeImports: true,
    message:
      'The Prisma Neon adapter is database infrastructure and belongs in lib/db or prisma.',
  },
  {
    name: '@neondatabase/serverless',
    allowTypeImports: true,
    message:
      'Neon runtime access is database infrastructure and belongs in lib/db or prisma.',
  },
];

const generatedPrismaPatterns = [
  {
    group: ['@/generated/prisma/**', '**/generated/prisma/**'],
    allowTypeImports: true,
    message:
      'Generated Prisma runtime access is forbidden in this layer. Depend on fetchers, actions, workflows, or lib/db instead.',
  },
];

const rawSqlSyntax = [
  {
    selector: "TaggedTemplateExpression[tag.name='sql']",
    message: 'Raw SQL is restricted to lib/db/** or prisma/**.',
  },
  {
    selector:
      "TaggedTemplateExpression[tag.type='MemberExpression'][tag.property.name='$queryRaw']",
    message: 'Prisma $queryRaw is restricted to lib/db/** or prisma/**.',
  },
  {
    selector:
      "TaggedTemplateExpression[tag.type='MemberExpression'][tag.property.name='$executeRaw']",
    message: 'Prisma $executeRaw is restricted to lib/db/** or prisma/**.',
  },
  {
    selector:
      "CallExpression[callee.type='MemberExpression'][callee.property.name='$queryRawUnsafe']",
    message: 'Prisma $queryRawUnsafe is restricted to lib/db/** or prisma/**.',
  },
  {
    selector:
      "CallExpression[callee.type='MemberExpression'][callee.property.name='$executeRawUnsafe']",
    message:
      'Prisma $executeRawUnsafe is restricted to lib/db/** or prisma/**.',
  },
  {
    selector:
      "TaggedTemplateExpression[tag.type='MemberExpression'][tag.object.name='Prisma'][tag.property.name='sql']",
    message: 'Prisma.sql is restricted to lib/db/** or prisma/**.',
  },
];

function restrictedImports(extraPatterns = []) {
  return [
    'error',
    {
      paths: databaseRuntimePaths,
      patterns: [...generatedPrismaPatterns, ...extraPatterns],
    },
  ];
}

export default defineConfig([
  ...nextVitals,
  ...nextTypeScript,

  {
    files: ['**/*.{js,jsx,ts,tsx,mjs,mts,cjs,cts}'],
    rules: {
      'no-debugger': 'error',
      'prefer-const': 'error',
      eqeqeq: ['error', 'always', { null: 'ignore' }],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          fixStyle: 'inline-type-imports',
        },
      ],
    },
  },

  // Raw SQL belongs only in the database infrastructure boundary.
  {
    files: ['**/*.{js,jsx,ts,tsx,mjs,mts,cjs,cts}'],
    ignores: [
      'lib/db/**',
      'prisma/**',
      'tests/**',
      'template/**',
      'packages/loaded-vibes/**',
    ],
    rules: {
      'no-restricted-syntax': ['error', ...rawSqlSyntax],
    },
  },

  // Routes are transport boundaries, not database implementations.
  {
    files: ['app/**/*.{js,jsx,ts,tsx}', 'proxy.{js,ts}'],
    rules: {
      'no-restricted-imports': restrictedImports([
        {
          group: [
            '@/lib/db/client',
            '@/lib/db/provider',
            '@/lib/db/tenant',
            '@/lib/db/transactions/**',
            '**/lib/db/client',
            '**/lib/db/provider',
            '**/lib/db/tenant',
            '**/lib/db/transactions/**',
          ],
          message:
            'Routes may invoke application boundaries, but they may not own database clients or transaction implementation.',
        },
      ]),
    },
  },

  // Page surfaces hand off application behavior to features.
  {
    files: [
      'app/**/page.{js,jsx,ts,tsx}',
      'app/**/layout.{js,jsx,ts,tsx}',
      'app/**/template.{js,jsx,ts,tsx}',
      'app/**/loading.{js,jsx,ts,tsx}',
      'app/**/error.{js,jsx,ts,tsx}',
      'app/**/not-found.{js,jsx,ts,tsx}',
    ],
    rules: {
      'no-restricted-imports': restrictedImports([
        {
          group: ['@/components/ui/**', '**/components/ui/**'],
          message:
            'Route surfaces do not import raw UI primitives. Render features, blocks, navigation, or shells.',
        },
        {
          group: [
            '@/lib/actions/**',
            '@/lib/fetchers/**',
            '@/lib/workflows/**',
            '**/lib/actions/**',
            '**/lib/fetchers/**',
            '**/lib/workflows/**',
          ],
          message:
            'Pages and layouts stay thin. Application orchestration belongs in features.',
        },
      ]),
    },
  },

  // Features orchestrate blocks and server/application capabilities.
  {
    files: ['features/**/*.{js,jsx,ts,tsx}'],
    rules: {
      'no-restricted-imports': restrictedImports([
        {
          group: ['@/components/ui/**', '**/components/ui/**'],
          message:
            'Features cannot import raw UI primitives. Create or use a reusable component block.',
        },
        {
          group: ['@/app/**', '**/app/**'],
          message: 'Features cannot depend on route files.',
        },
      ]),
    },
  },

  // Presentation stays presentation. No server operations behind a button-shaped curtain.
  {
    files: ['components/**/*.{js,jsx,ts,tsx}'],
    rules: {
      'no-restricted-imports': restrictedImports([
        {
          group: [
            '@/lib/actions/**',
            '@/lib/fetchers/**',
            '@/lib/db/**',
            '@/lib/auth/**',
            '@/lib/authz/**',
            '@/lib/integrations/**',
            '@/lib/workflows/**',
            '**/lib/actions/**',
            '**/lib/fetchers/**',
            '**/lib/db/**',
            '**/lib/auth/**',
            '**/lib/authz/**',
            '**/lib/integrations/**',
            '**/lib/workflows/**',
          ],
          message:
            'Presentation components cannot own server, database, authorization, integration, or workflow behavior.',
        },
        {
          group: ['@/app/**', '@/features/**', '**/app/**', '**/features/**'],
          message:
            'Presentation cannot depend upward on routes or feature orchestration.',
        },
      ]),
    },
  },

  // Workflows orchestrate existing capabilities. They do not become a second data layer.
  {
    files: [
      'lib/workflows/**/*.{js,jsx,ts,tsx}',
      'lib/auth/**/*.{js,jsx,ts,tsx}',
      'lib/authz/**/*.{js,jsx,ts,tsx}',
      'lib/cache/**/*.{js,jsx,ts,tsx}',
      'lib/constants/**/*.{js,jsx,ts,tsx}',
      'lib/integrations/**/*.{js,jsx,ts,tsx}',
      'lib/utils/**/*.{js,jsx,ts,tsx}',
      'schemas/**/*.{js,jsx,ts,tsx}',
      'types/**/*.{js,jsx,ts,tsx}',
      'content/**/*.{js,jsx,ts,tsx}',
    ],
    rules: {
      'no-restricted-imports': restrictedImports(),
    },
  },

  // Prettier owns formatting. Keep this after every stylistic lint config.
  prettier,

  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'dist/**',
    'coverage/**',
    '.artifacts/**',
    'generated/**',
    'next-env.d.ts',
    'template/**',
    'packages/loaded-vibes/**',
    '.agents/Loaded-Vibes-Codex-Plugin-v0.1.0/**',
  ]),
]);
