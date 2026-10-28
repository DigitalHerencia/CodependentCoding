import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["app/main.tsx"],
  format: "esm",
  platform: "node",
  target: "node24",
  outDir: "dist",
  clean: true,
});
