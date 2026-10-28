// Why: maps manifest entries to the module shape the screens use.
import type { ManifestModule } from "@/schemas/modulesSchemas";
import type { TemplateModule } from "@/types/modulesTypes";

export function toTemplateModuleDTO(
  entry: ManifestModule,
  presets: Record<string, string[]>,
): TemplateModule {
  return {
    id: entry.id,
    kind: entry.kind,
    label: entry.label,
    description: entry.description ?? null,
    dependsOn: [...(entry.dependsOn ?? [])],
    packages: [...(entry.packages ?? [])],
    env: (entry.env ?? []).map((variable) => variable.name),
    presets: Object.entries(presets)
      .filter(([, members]) => members.includes(entry.id))
      .map(([name]) => name),
  };
}
