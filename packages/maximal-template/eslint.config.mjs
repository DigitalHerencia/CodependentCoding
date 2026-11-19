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
  {
    name: "codependent/admin-route-boundaries",
    files: ["app/(admin)/**/*.{ts,tsx}", "components/nav/admin-*.{ts,tsx}"],
    ignores: [
      "app/(admin)/**/loading.tsx",
      "app/(admin)/**/error.tsx",
      "app/(admin)/layout.tsx",
    ],
    rules: authImportRules([
      authApplicationImports,
      ...authBlockOnlyImports,
      authBlockImports,
      authTemplateImports,
      authWorkflowImports,
    ]),
  },
  {
    // The owner requires access orchestration in the layout and shell feature composition.
    name: "codependent/admin-layout-access",
    files: ["app/(admin)/layout.tsx"],
    rules: authImportRules([
      authApplicationImports,
      ...authBlockOnlyImports,
      authBlockImports,
      authTemplateImports,
    ]),
  },
  {
    name: "codependent/admin-shell-feature",
    files: ["components/shells/admin-shell.tsx"],
    rules: authImportRules([
      authApplicationImports,
      ...authBlockOnlyImports,
      authBlockImports,
      authWorkflowImports,
    ]),
  },
  {
    name: "codependent/admin-loading-error-boundaries",
    files: [
      "app/(admin)/**/loading.tsx",
      "app/(admin)/**/error.tsx",
      "features/admin/*Skeleton.tsx",
    ],
    rules: authImportRules([
      authApplicationImports,
      ...authBlockOnlyImports,
      authTemplateImports,
      authWorkflowImports,
    ]),
  },
  {
    name: "codependent/admin-block-boundaries",
    files: ["components/blocks/admin-blocks.tsx"],
    rules: authImportRules([
      authApplicationImports,
      authBlockImports,
      authTemplateImports,
      authWorkflowImports,
    ]),
  },
  {
    name: "codependent/admin-template-boundaries",
    files: ["components/templates/admin-templates.tsx"],
    rules: authImportRules([
      authApplicationImports,
      ...authBlockOnlyImports,
      authTemplateImports,
      authWorkflowImports,
    ]),
  },
  {
    name: "codependent/admin-feature-boundaries",
    files: ["features/admin/**/*.{ts,tsx}"],
    ignores: ["features/admin/*Skeleton.tsx"],
    rules: authImportRules([
      authApplicationImports,
      ...authBlockOnlyImports,
      authBlockImports,
    ]),
  },
  {
    name: "codependent/tenant-shell-boundaries",
    files: [
      "app/(tenant)/layout.tsx",
      "components/shells/tenant-shell.tsx",
      "components/nav/tenant-*.tsx",
    ],
    rules: authImportRules([
      authApplicationImports,
      ...authBlockOnlyImports,
      authBlockImports,
      authTemplateImports,
      authWorkflowImports,
    ]),
  },
  {
    name: "codependent/tenant-fallback-boundaries",
    files: [
      "app/(tenant)/loading.tsx",
      "app/(tenant)/error.tsx",
      "features/tenant/*Skeleton.tsx",
    ],
    rules: authImportRules([
      authApplicationImports,
      ...authBlockOnlyImports,
      authTemplateImports,
      authWorkflowImports,
    ]),
  },
  {
    name: "codependent/tenant-block-boundaries",
    files: [
      "components/blocks/tenant-blocks.tsx",
      "components/blocks/authz-blocks.tsx",
    ],
    rules: authImportRules([
      authApplicationImports,
      authBlockImports,
      authTemplateImports,
      authWorkflowImports,
    ]),
  },
  {
    name: "codependent/tenant-template-boundaries",
    files: [
      "components/templates/tenant-templates.tsx",
      "components/templates/authz-templates.tsx",
    ],
    rules: authImportRules([
      authApplicationImports,
      ...authBlockOnlyImports,
      authTemplateImports,
      authWorkflowImports,
    ]),
  },
  {
    name: "codependent/tenant-feature-boundaries",
    files: ["features/tenant/**/*.tsx", "features/authz/**/*.tsx"],
    ignores: ["features/tenant/*Skeleton.tsx"],
    rules: authImportRules([
      authApplicationImports,
      ...authBlockOnlyImports,
      authBlockImports,
    ]),
  },
  {
    name: "codependent/ai-route-boundaries",
    files: ["app/(tenant)/ai/**/*.{ts,tsx}"],
    ignores: ["app/(tenant)/ai/**/loading.tsx", "app/(tenant)/ai/**/error.tsx"],
    rules: authImportRules([
      authApplicationImports,
      ...authBlockOnlyImports,
      authBlockImports,
      authTemplateImports,
      authWorkflowImports,
    ]),
  },
  {
    name: "codependent/ai-loading-error-skeleton-boundaries",
    files: [
      "app/(tenant)/ai/**/loading.tsx",
      "app/(tenant)/ai/**/error.tsx",
      "features/ai/*Skeleton.tsx",
    ],
    rules: authImportRules([
      authApplicationImports,
      ...authBlockOnlyImports,
      authTemplateImports,
      authWorkflowImports,
    ]),
  },
  {
    name: "codependent/ai-block-boundaries",
    files: ["components/blocks/ai-blocks.tsx"],
    rules: authImportRules([
      authApplicationImports,
      authBlockImports,
      authTemplateImports,
      authWorkflowImports,
    ]),
  },
  {
    name: "codependent/ai-template-boundaries",
    files: ["components/templates/ai-templates.tsx"],
    rules: authImportRules([
      authApplicationImports,
      ...authBlockOnlyImports,
      authTemplateImports,
      authWorkflowImports,
    ]),
  },
  {
    name: "codependent/ai-feature-form-boundaries",
    files: ["features/ai/**/*.{ts,tsx}"],
    ignores: ["features/ai/*Skeleton.tsx"],
    rules: authImportRules([
      authApplicationImports,
      ...authBlockOnlyImports,
      authBlockImports,
    ]),
  },
  {
    name: "codependent/invoicing-route-boundaries",
    files: [
      "app/(tenant)/invoices/**/*.{ts,tsx}",
      "app/(tenant)/expenses/**/*.{ts,tsx}",
    ],
    ignores: ["**/loading.tsx", "**/error.tsx"],
    rules: authImportRules([
      authApplicationImports,
      ...authBlockOnlyImports,
      authBlockImports,
      authTemplateImports,
      authWorkflowImports,
    ]),
  },
  {
    name: "codependent/invoicing-skeleton-boundaries",
    files: [
      "features/invoicing/*Skeleton.tsx",
      "app/(tenant)/invoices/**/loading.tsx",
      "app/(tenant)/invoices/**/error.tsx",
      "app/(tenant)/expenses/**/loading.tsx",
      "app/(tenant)/expenses/**/error.tsx",
    ],
    rules: authImportRules([
      authApplicationImports,
      ...authBlockOnlyImports,
      authTemplateImports,
      authWorkflowImports,
    ]),
  },
  {
    name: "codependent/invoicing-feature-form-boundaries",
    files: ["features/invoicing/**/*.{ts,tsx}"],
    ignores: ["features/invoicing/*Skeleton.tsx"],
    rules: authImportRules([
      {
        regex: "^@/lib/(?!workflows/|utils/invoicingMoney$)",
        message:
          "Use invoicing workflows; only the pure shared decimal calculator may be imported directly.",
      },
      ...authBlockOnlyImports,
      authBlockImports,
    ]),
  },
  {
    name: "codependent/invoicing-template-boundaries",
    files: ["components/templates/invoicing-templates.tsx"],
    rules: authImportRules([
      authApplicationImports,
      ...authBlockOnlyImports,
      authTemplateImports,
      authWorkflowImports,
    ]),
  },
  {
    name: "codependent/invoicing-block-boundaries",
    files: ["components/blocks/invoicing-blocks.tsx"],
    rules: authImportRules([
      authApplicationImports,
      authBlockImports,
      authTemplateImports,
      authWorkflowImports,
    ]),
  },
  prettier,
]);
