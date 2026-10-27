import "server-only";

import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { parse } from "yaml";
import type { PluginManifest, PluginPart } from "@/types/pluginTypes";

// Build-time reads of the Loaded Vibes plugin so the page never drifts from it.
const pluginDir = "plugin/loaded-vibes";

async function read(file: string) {
  return readFile(
    path.join(/* turbopackIgnore: true */ process.cwd(), pluginDir, file),
    "utf8",
  );
}

function frontmatter(text: string): PluginPart {
  const block = /^---\n([\s\S]*?)\n---/.exec(text)?.[1] ?? "";
  const data = parse(block) as { name?: string; description?: string };
  return { name: data.name ?? "", description: data.description ?? "" };
}

async function list(dir: string) {
  return readdir(
    path.join(/* turbopackIgnore: true */ process.cwd(), pluginDir, dir),
  );
}

export async function getPluginManifest(): Promise<PluginManifest> {
  const manifest = JSON.parse(await read(".claude-plugin/plugin.json")) as {
    name: string;
    version: string;
    description: string;
  };
  const skills = await Promise.all(
    (await list("skills"))
      .sort()
      .map(async (skill) =>
        frontmatter(await read(`skills/${skill}/SKILL.md`)),
      ),
  );
  const agents = await Promise.all(
    (await list("agents"))
      .filter((file) => file.endsWith(".md"))
      .sort()
      .map(async (file) => frontmatter(await read(`agents/${file}`))),
  );
  return { ...manifest, skills, agents };
}
