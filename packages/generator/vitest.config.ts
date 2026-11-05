import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";
const application = fileURLToPath(
  new URL("../maximal-template", import.meta.url),
);
export default defineConfig({
  resolve: {
    alias: [
      { find: /^@\//, replacement: `${application}/` },
      {
        find: /^server-only$/,
        replacement: path.join(
          application,
          "node_modules/server-only/empty.js",
        ),
      },
    ],
  },
  test: {
    include: [
      "packages/generator/tests/template/**/*.test.ts",
      "packages/generator/tests/maximal-template/**/*.test.ts",
    ],
    environment: "node",
  },
});
