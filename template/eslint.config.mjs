import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier/flat";

const databasePackages = [
  "@prisma/client",
  "@prisma/adapter-neon",
  "@neondatabase/serverless",
];

const databaseImportPatterns = [
  "@/generated/prisma/**",
  "**/generated/prisma/**",
  "@/lib/db/**",
  "**/lib/db/**",
];

const rawSqlSyntax = [
  "TaggedTemplateExpression[tag.name='sql']",
  "TaggedTemplateExpression[tag.type='MemberExpression'][tag.property.name='$queryRaw']",
  "TaggedTemplateExpression[tag.type='MemberExpression'][tag.property.name='$executeRaw']",
  "CallExpression[callee.type='MemberExpression'][callee.property.name='$queryRawUnsafe']",
  "CallExpression[callee.type='MemberExpression'][callee.property.name='$executeRawUnsafe']",
  "TaggedTemplateExpression[tag.type='MemberExpression'][tag.object.name='Prisma'][tag.property.name='sql']",
];

export default defineConfig([
  ...nextVitals,
  ...nextTypeScript,
  {
    files: ["**/*.{js,jsx,ts,tsx,mjs,mts,cjs,cts}"],
    rules: {
      "no-debugger": "error",
      eqeqeq: ["error", "always", { null: "ignore" }],
      "prefer-const": "error",
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
  {
    files: ["app/**/*.{js,jsx,ts,tsx}", "proxy.{js,ts}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: databasePackages.map((name) => ({
            name,
            allowTypeImports: true,
            message: "Database runtime access belongs in lib/db.",
          })),
          patterns: [
            {
              group: databaseImportPatterns,
              message:
                "Routes and proxy must use fetchers, actions, auth, or workflows instead of database implementation.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["lib/actions/**/*.{js,jsx,ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: databasePackages.map((name) => ({
            name,
            allowTypeImports: true,
            message: "Server Actions delegate database work to workflows.",
          })),
          patterns: [
            {
              group: [
                ...databaseImportPatterns,
                "@/lib/integrations/**",
                "**/lib/integrations/**",
              ],
              message:
                "Server Actions validate transport input and delegate to workflows; they do not own database or provider implementation.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["features/**/*.{js,jsx,ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: databasePackages.map((name) => ({
            name,
            allowTypeImports: true,
            message: "Features use fetchers and actions, never database SDKs.",
          })),
          patterns: [
            {
              group: [
                ...databaseImportPatterns,
                "@/app/**",
                "**/app/**",
                "@/lib/integrations/**",
                "**/lib/integrations/**",
                "@/lib/workflows/**",
                "**/lib/workflows/**",
              ],
              message:
                "Features orchestrate blocks, fetchers, and actions without importing routes, workflows, providers, or database implementation.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["components/**/*.{js,jsx,ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: databasePackages.map((name) => ({
            name,
            allowTypeImports: true,
            message: "Presentation cannot import database SDKs.",
          })),
          patterns: [
            {
              group: [
                ...databaseImportPatterns,
                "@/lib/actions/**",
                "**/lib/actions/**",
                "@/lib/fetchers/**",
                "**/lib/fetchers/**",
                "@/lib/integrations/**",
                "**/lib/integrations/**",
                "@/lib/workflows/**",
                "**/lib/workflows/**",
                "@/app/**",
                "**/app/**",
              ],
              message:
                "Presentation components cannot own server, provider, workflow, database, or route behavior.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["**/*.{js,jsx,ts,tsx,mjs,mts,cjs,cts}"],
    ignores: ["lib/db/**", "prisma/**", "tests/**"],
    rules: {
      "no-restricted-syntax": [
        "error",
        ...rawSqlSyntax.map((selector) => ({
          selector,
          message: "Raw SQL is restricted to lib/db/** or prisma/**.",
        })),
      ],
    },
  },
  prettier,
  globalIgnores([
    ".next/**",
    "coverage/**",
    "generated/prisma/**",
    "node_modules/**",
    "public/**",
  ]),
]);
