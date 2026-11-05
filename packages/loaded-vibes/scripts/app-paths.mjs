import path from "node:path";
import { fileURLToPath } from "node:url";
export const pluginRoot = fileURLToPath(new URL("..", import.meta.url));
export const repositoryRoot = path.resolve(pluginRoot, "../..");
export const appRoot = path.resolve(
  process.env.LOADED_VIBES_APP_ROOT ??
    path.join(repositoryRoot, "packages/maximal-template"),
);
