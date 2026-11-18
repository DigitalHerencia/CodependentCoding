/** Eslint.config contracts and composition for the owning application slice. */
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier/flat";

/** Presentation boundaries for the auth and onboarding slices.
 * @see https://eslint.org/docs/latest/rules/no-restricted-imports
 */
const authApplicationImports = {
  regex: "^(?:@/|(?:\\.\\./)+)lib/(?!workflows/)",
  message:
    "Compose application logic in domain workflows; presentation imports workflow functions only.",
};

/** Copy and primitives are composed exclusively by domain blocks. */
const authBlockOnlyImports = [
  {
    group: ["@/content/**", "**/content/**"],
    message: "Copy imports belong in domain blocks.",
  },
  {
    group: ["@/components/ui/**", "**/components/ui/**"],
    message: "UI primitives belong in domain blocks.",
  },
];

/** Block composition belongs in templates and the explicit loading/error/skeleton boundaries. */
const authBlockImports = {
  group: ["@/components/blocks/**", "**/components/blocks/**"],
  message:
    "Blocks may be imported only by templates, route loading/error boundaries, and authFormSkeleton.",
};

/** Feature components orchestrate presentation templates. */
const authTemplateImports = {
  group: ["@/components/templates/**", "**/components/templates/**"],
  message: "Templates are orchestrated by feature components and forms.",
};

/** Application workflows are called only by feature components and forms. */
const authWorkflowImports = {
  group: ["@/lib/workflows/**", "**/lib/workflows/**"],
  message: "Workflow imports belong in feature components and forms.",
};

/** Build a complete restricted-import rule without replacing unrelated lint rules. */
function authImportRules(patterns) {
  return { "no-restricted-imports": ["error", { patterns }] };
}

/**
 * Codependent Coding lint contract.
 * - Next.js + TypeScript baseline
 * - Loaded Vibes supplies doctrine checks externally
 * - Prettier owns formatting (eslint-config-prettier last)
 */
export default defineConfig([
  globalIgnores([
    ".next/**",
    "node_modules/**",
    "generated/**",
    "coverage/**",
    "playwright-report/**",
    "test-results/**",
    "next-env.d.ts",
  ]),
  ...nextVitals,
  ...nextTypeScript,
  {
    name: "codependent/baseline",
    linterOptions: { reportUnusedDisableDirectives: "error" },
    rules: {
      eqeqeq: ["error", "always", { null: "ignore" }],
      "no-console": ["error", { allow: ["warn", "error"] }],
      "no-debugger": "error",
      "prefer-const": "error",
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-non-null-assertion": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
  {
    name: "codependent/tests",
    files: ["tests/**", "**/*.test.{ts,tsx}", "**/*.spec.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-non-null-assertion": "off",
    },
  },
  {
    name: "codependent/vendored-ui",
    files: ["components/ui/**", "components/chart/**"],
    rules: { "@typescript-eslint/no-non-null-assertion": "off" },
  },

  {
    name: "codependent/auth-route-boundaries",
    files: [
      "app/(auth)/**/*.{ts,tsx}",
      "components/shells/auth-shell.tsx",
      "components/nav/auth-header.tsx",
      "components/nav/auth-footer.{ts,tsx}",
    ],
    ignores: ["app/(auth)/**/loading.tsx", "app/(auth)/**/error.tsx"],
    rules: authImportRules([
      authApplicationImports,
      ...authBlockOnlyImports,
      authBlockImports,
      authTemplateImports,
      authWorkflowImports,
    ]),
  },
  {
    name: "codependent/auth-loading-error-boundaries",
    files: [
      "app/(auth)/**/loading.tsx",
      "app/(auth)/**/error.tsx",
      "features/auth/authFormSkeleton.tsx",
    ],
    rules: authImportRules([
      authApplicationImports,
      ...authBlockOnlyImports,
      authTemplateImports,
      authWorkflowImports,
    ]),
  },
  {
    name: "codependent/auth-block-boundaries",
    files: [
      "components/blocks/{auth,auth-shell}-blocks.{ts,tsx}",
      "components/blocks/onboarding-blocks.{ts,tsx}",
    ],
    rules: authImportRules([
      authApplicationImports,
      authBlockImports,
      authTemplateImports,
      authWorkflowImports,
    ]),
  },
  {
    name: "codependent/auth-template-boundaries",
    files: [
      "components/templates/{auth,auth-shell}-template*.{ts,tsx}",
      "components/templates/onboarding-templates.{ts,tsx}",
    ],
    rules: authImportRules([
      authApplicationImports,
      ...authBlockOnlyImports,
      authTemplateImports,
      authWorkflowImports,
    ]),
  },
  {
    name: "codependent/auth-feature-boundaries",
    files: ["features/auth/**/*.{ts,tsx}", "features/onboarding/**/*.{ts,tsx}"],
    ignores: ["features/auth/authFormSkeleton.tsx"],
    rules: authImportRules([
      authApplicationImports,
      ...authBlockOnlyImports,
      authBlockImports,
    ]),
  },
  prettier,
]);
