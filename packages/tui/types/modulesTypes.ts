// Why: shared shapes for the module manifest reads and screens.
export interface TemplateModule {
  id: string;
  kind: "domain" | "addon";
  label: string;
  description: string | null;
  dependsOn: string[];
  packages: string[];
  env: string[];
  presets: string[];
}

export interface ModuleCatalog {
  modules: TemplateModule[];
  presets: Record<string, string[]>;
}
