import { defineConfig, globalIgnores } from "eslint/config";
import prettier from "eslint-config-prettier/flat";
import reactHooks from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";

import { doctrineTerminal } from "maximal-template/eslint/codependent-plugin.mjs";

/**
 * Terminal app lint contract: the template's doctrine with the terminal
 * profile (DEC-072, Architecture.md §4.1). Run from this folder so layer paths
 * match the template's (features/..., components/ui/...).
 */
export default defineConfig([
  globalIgnores(["dist/**", "node_modules/**", "coverage/**"]),
  ...tseslint.configs.recommended,
  {
    // The two classic hook rules. The React Compiler rules in the plugin's
    // recommended set flag termcn's vendored components, which stay unedited
    // so they can be re-pulled from the registry.
    name: "tui/react-hooks",
    plugins: { "react-hooks": reactHooks },
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "error",
    },
  },
  {
    name: "tui/baseline",
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
  doctrineTerminal,
  prettier,
]);
