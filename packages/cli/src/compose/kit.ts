import path from "node:path";
import { pathToFileURL } from "node:url";

import type * as ComposeScript from "@/template/scripts/compose.mjs";
import type * as EnvScript from "@/template/scripts/env-example.mjs";
import type * as SchemaScript from "@/template/scripts/modules-schema.mjs";

/**
 * The template owns its manifest schema, ownership rules, compose file steps
 * and .env.example renderer; the CLI loads them from the resolved template so
 * there is one source of truth. They need the template's own install (zod).
 */
export interface TemplateKit {
  compose: typeof ComposeScript;
  schema: typeof SchemaScript;
  env: typeof EnvScript;
  /** Formats text the pipeline wrote with the template's Prettier and config. */
  format: (relativePath: string, text: string) => Promise<string>;
}

interface Prettier {
  resolveConfig: (file: string) => Promise<Record<string, unknown> | null>;
  format: (text: string, options: Record<string, unknown>) => Promise<string>;
}

export async function loadTemplateKit(
  templateDir: string,
): Promise<TemplateKit> {
  const load = (file: string) =>
    import(pathToFileURL(path.join(templateDir, "scripts", file)).href);
  try {
    const [compose, schema, env, prettier] = await Promise.all([
      load("compose.mjs"),
      load("modules-schema.mjs"),
      load("env-example.mjs"),
      import(
        pathToFileURL(
          path.join(templateDir, "node_modules", "prettier", "index.mjs"),
        ).href
      ) as Promise<Prettier>,
    ]);
    const format = async (relativePath: string, text: string) => {
      const file = path.join(templateDir, relativePath);
      const config = (await prettier.resolveConfig(file)) ?? {};
      // Generated JSON/TS carry no Tailwind classes; skip the plugin, which
      // would otherwise resolve from the not-yet-installed app.
      return prettier.format(text, { ...config, plugins: [], filepath: file });
    };
    return { compose, schema, env, format } as TemplateKit;
  } catch (error) {
    throw new Error(
      `Could not load the template's scripts from ${templateDir}. Run \`pnpm install\` there first.\n${(error as Error).message}`,
      { cause: error },
    );
  }
}
