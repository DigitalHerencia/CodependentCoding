import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

function findGeneratorRoot(moduleUrl) {
  let dir = path.dirname(fileURLToPath(moduleUrl));
  for (;;) {
    if (path.basename(dir) === "packages") return path.join(dir, "generator");
    const parent = path.dirname(dir);
    if (parent === dir)
      throw new Error(
        "The generator requires a Codependent Coding packages directory.",
      );
    dir = parent;
  }
}
export const generatorRoot = findGeneratorRoot(import.meta.url);
export const templateRoot = path.resolve(generatorRoot, "../maximal-template");
export const pluginRoot = path.resolve(generatorRoot, "../loaded-vibes");
export const toolingDirectory = ".loaded-vibes";
export const manifestFile = `${toolingDirectory}/hipster.modules.json`;
export const schemaFile = `${toolingDirectory}/hipster.modules.schema.json`;
export const templateManifest = path.join(
  generatorRoot,
  "assets/hipster.modules.json",
);
export function manifestPath(appDir) {
  return path.resolve(appDir) === templateRoot
    ? templateManifest
    : path.join(appDir, manifestFile);
}
export function readAppManifest(appDir) {
  return JSON.parse(readFileSync(manifestPath(appDir), "utf8"));
}
