import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier/flat";

import { doctrine } from "./eslint/codependent-plugin.mjs";

/**
 * Codependent Coding lint contract.
 * - Next.js + TypeScript baseline
 * - Doctrine rules (CC-*), see .claude/contracts/validation.yaml
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
  doctrine,
  {
    name: "codependent/tests",
    files: ["tests/**", "**/*.test.{ts,tsx}", "**/*.spec.{ts,tsx}"],
    rules: {
      "codependent/no-default-export": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
    },
  },
  {
    name: "codependent/vendored-ui",
    files: ["components/ui/**", "components/chart/**"],
    rules: { "@typescript-eslint/no-non-null-assertion": "off" },
  },
  prettier,
]);
