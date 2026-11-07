#!/usr/bin/env node
import { existsSync } from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { spawnSync } from "node:child_process";
import { fileURLToPath, pathToFileURL } from "node:url";

const pluginRoot = fileURLToPath(new URL("..", import.meta.url));
const args = process.argv.slice(2);
const command = args.shift();
const appIndex = args.indexOf("--app");
let appRoot = path.resolve(process.cwd());
if (appIndex >= 0) {
  const value = args[appIndex + 1];
  if (!value || value.startsWith("--"))
    throw new Error("--app requires a directory");
  appRoot = path.resolve(value);
  args.splice(appIndex, 2);
}
if (!existsSync(path.join(appRoot, "package.json")))
  throw new Error(`No application package.json in ${appRoot}`);
const scripts = {
  "check:modules": "check-modules.mjs",
  "check:ownership": "check-ownership.mjs",
  "check:env": "check-env.mjs",
  "db:init": "db-init.mjs",
  "db:rls": "db-rls.mjs",
  "db:rls:check": "db-rls.mjs",
  "issues:sync": "sync-issues.mjs",
};
const requireApp = createRequire(path.join(appRoot, "package.json"));
let nodeArgs;
if (command === "lint") {
  nodeArgs = [
    path.join(
      path.dirname(requireApp.resolve("eslint/package.json")),
      "bin/eslint.js",
    ),
    "--config",
    path.join(pluginRoot, "eslint/app.config.mjs"),
    "--max-warnings=0",
    ...(args.some((arg) => !arg.startsWith("--")) ? args : [".", ...args]),
  ];
} else {
  const script = scripts[command];
  if (!script)
    throw new Error(
      `Unknown Loaded Vibes command: ${command}. Use lint, ${Object.keys(scripts).join(", ")}.`,
    );
  const loader = command === "check:env" || command === "db:rls:check";
  nodeArgs = [
    ...(loader
      ? [
          "--import",
          pathToFileURL(requireApp.resolve("tsx/esm")).href,
          "--conditions=react-server",
        ]
      : []),
    path.join(pluginRoot, "scripts", script),
    ...(command === "db:rls:check" ? ["--check"] : []),
    ...args,
  ];
}
const result = spawnSync(process.execPath, nodeArgs, {
  cwd: appRoot,
  stdio: "inherit",
  env: {
    ...process.env,
    LOADED_VIBES_APP_ROOT: appRoot,
    TSX_TSCONFIG_PATH: path.join(appRoot, "tsconfig.json"),
  },
});
if (result.error) throw result.error;
process.exitCode = result.status ?? 1;
