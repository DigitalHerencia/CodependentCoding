export type PluginPart = { name: string; description: string };

export type PluginManifest = {
  name: string;
  version: string;
  description: string;
  skills: PluginPart[];
  agents: PluginPart[];
};
