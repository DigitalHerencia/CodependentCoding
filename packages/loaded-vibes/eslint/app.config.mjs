import path from "node:path";
import { pathToFileURL } from "node:url";
import { doctrine } from "./codependent-plugin.mjs";

const appRoot = process.env.LOADED_VIBES_APP_ROOT;
if (!appRoot)
  throw new Error("Use loaded-vibes lint --app <application-directory>.");
const { default: applicationConfig } = await import(
  pathToFileURL(path.join(appRoot, "eslint.config.mjs")).href
);
const config = [...applicationConfig, doctrine];
export default config;
