// Why: reads the template's module manifest from the checkout, once per run.
import { readWorkspaceText } from "@/lib/db/client";
import { toTemplateModuleDTO } from "@/lib/db/dto/modules.dto";
import { moduleManifestSchema } from "@/schemas/modulesSchemas";
import type { ModuleCatalog } from "@/types/modulesTypes";

const MANIFEST = "template/hipster.modules.json";

let catalog: Promise<ModuleCatalog> | undefined;

/** Every module in manifest order, each with the presets that include it. */
export function getModuleCatalog(): Promise<ModuleCatalog> {
  catalog ??= readWorkspaceText(MANIFEST).then((text) => {
    const manifest = moduleManifestSchema.parse(JSON.parse(text));
    return {
      modules: manifest.modules.map((entry) =>
        toTemplateModuleDTO(entry, manifest.presets),
      ),
      presets: manifest.presets,
    };
  });
  return catalog;
}
