import path from "node:path";
import * as prettier from "prettier";
import * as compose from "@codependent/generator/compose.mjs";
import * as schema from "@codependent/generator/modules-schema.mjs";
import * as env from "@codependent/generator/env-example.mjs";

export interface TemplateKit {
  compose: typeof compose;
  schema: typeof schema;
  env: typeof env;
  format: (relativePath: string, text: string) => Promise<string>;
}

/** Generator-owned engines; the application supplies formatting configuration only. */
export async function loadTemplateKit(
  templateDir: string,
): Promise<TemplateKit> {
  const format = async (relativePath: string, text: string) => {
    const file = path.join(templateDir, relativePath);
    const config = (await prettier.resolveConfig(file)) ?? {};
    return prettier.format(text, { ...config, plugins: [], filepath: file });
  };
  return { compose, schema, env, format };
}
