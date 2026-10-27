import "server-only";

import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import type { CliCommand, CliManifest, CliOption } from "@/types/cliTypes";

// Build-time read of the Hipster Stack CLI source and the module manifest, so
// the command builder follows every flag the CLI adds, renames or removes.
const commandsDir = "packages/cli/src/commands";
const string = String.raw`"((?:[^"\\]|\\.)*)"|'((?:[^'\\]|\\.)*)'|\x60((?:[^\x60\\]|\\.)*)\x60`;

function file(relative: string) {
  return readFile(
    path.join(/* turbopackIgnore: true */ process.cwd(), relative),
    "utf8",
  );
}

function strings(source: string) {
  return [...source.matchAll(new RegExp(string, "g"))].map(
    (match) => match[1] ?? match[2] ?? match[3] ?? "",
  );
}

function parseOption(
  flags: string,
  description: string,
  required: boolean,
): CliOption {
  const long = /--([a-z0-9-]+)/.exec(flags)?.[1] ?? "";
  return {
    flag: `--${long}`,
    short: /(^|\s)(-[a-z]),/.exec(flags)?.[2] ?? null,
    value: /[<[]([^>\]]+)[>\]]/.exec(flags)?.[1] ?? null,
    negated: long.startsWith("no-"),
    required,
    description,
  };
}

function parseCommand(source: string): CliCommand | null {
  const name = /\.command\(\s*"([^"]+)"/.exec(source)?.[1];
  if (!name) return null;
  const description =
    strings(
      /\.description\(([\s\S]*?)\)\s*\n?\s*\./.exec(source)?.[1] ?? "",
    )[0] ?? "";
  const calls = [
    ...source.matchAll(
      /\.(argument|option|requiredOption)\(\s*((?:"[^"]*"|'[^']*'|[\s,])+)/g,
    ),
  ];
  const command: CliCommand = { name, description, arguments: [], options: [] };
  for (const [, kind, body = ""] of calls) {
    const [flags = "", text = ""] = strings(body);
    if (kind === "argument") {
      command.arguments.push({
        name: flags.replace(/[<>[\].]/g, ""),
        required: flags.startsWith("<"),
        description: text,
      });
    } else {
      command.options.push(parseOption(flags, text, kind === "requiredOption"));
    }
  }
  return command;
}

export async function getCliManifest(): Promise<CliManifest> {
  const names = (
    await readdir(
      path.join(/* turbopackIgnore: true */ process.cwd(), commandsDir),
    )
  ).filter((name) => name.endsWith(".ts") && name !== "index.ts");
  const order = ["new", "compose", "add", "slice", "doctor"];
  const commands = (
    await Promise.all(
      names.map(async (name) =>
        parseCommand(await file(`${commandsDir}/${name}`)),
      ),
    )
  )
    .filter((command): command is CliCommand => command !== null)
    .sort((a, b) => order.indexOf(a.name) - order.indexOf(b.name));
  const manifest = JSON.parse(await file("template/hipster.modules.json")) as {
    modules: { id: string; dependsOn?: string[] }[];
    presets: Record<string, string[]>;
  };
  return {
    commands,
    modules: manifest.modules.map((module) => ({
      id: module.id,
      dependsOn: module.dependsOn ?? [],
    })),
    presets: manifest.presets,
  };
}
