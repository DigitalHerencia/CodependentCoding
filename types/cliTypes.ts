export type CliArgument = {
  name: string;
  required: boolean;
  description: string;
};

export type CliOption = {
  flag: string;
  short: string | null;
  value: string | null;
  negated: boolean;
  required: boolean;
  description: string;
};

export type CliCommand = {
  name: string;
  description: string;
  arguments: CliArgument[];
  options: CliOption[];
};

export type CliModule = { id: string; dependsOn: string[] };

export type CliManifest = {
  commands: CliCommand[];
  modules: CliModule[];
  presets: Record<string, string[]>;
};
