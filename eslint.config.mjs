import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier/flat";

import { doctrine } from "./template/eslint/codependent-plugin.mjs";

/**
 * Factory repo lint contract.
 * The landing page (app/, components/) follows the same doctrine as every
 * generated app; the template and plugin lint themselves.
 */
export default defineConfig([
  globalIgnores([
    ".next/**",
    "node_modules/**",
    "dist/**",
    "template/**",
    "plugin/**",
    ".sandbox/**",
    "next-env.d.ts",
  ]),
  ...nextVitals,
  ...nextTypeScript,
  {
    name: "factory/baseline",
    linterOptions: { reportUnusedDisableDirectives: "error" },
    rules: {
      eqeqeq: ["error", "always", { null: "ignore" }],
      "no-debugger": "error",
      "prefer-const": "error",
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
  doctrine,
  {
    name: "factory/cli-and-scripts",
    files: ["packages/**", "scripts/**", ".claude/hooks/**"],
    rules: {
      "codependent/no-default-export": "off",
      "codependent/filename-convention": "off",
      "no-console": "off",
    },
  },
  prettier,
]);
