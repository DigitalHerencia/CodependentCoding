import { readFileSync, writeFileSync } from "node:fs";
import { resolve, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname } from "node:path";
import { spawnSync } from "node:child_process";

export const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
export const read = (path) => readFileSync(join(root, path), "utf8");
export const json = (path) => JSON.parse(read(path));
export const writeJson = (path, data) =>
  writeFileSync(join(root, path), `${JSON.stringify(data, null, 2)}\n`, "utf8");
export const log = (message) => process.stdout.write(`${message}\n`);
export const catalog = json("context/specs/catalog.json");

export function entries() {
  const list = [];
  for (const milestone of catalog.milestones) {
    for (const phase of milestone.phases) {
      for (const cycle of phase.dev_cycles) {
        for (const id of cycle.spec_ids) {
          const path = `context/specs/${milestone.id}/${phase.id}/${cycle.id.split("-").at(-1)}/${id}.json`;
          list.push({ id, path, spec: json(path), milestone, phase, cycle });
        }
      }
    }
  }
  return list;
}

/** True when the given module URL is the script Node was started with (works on Windows paths). */
export const isMain = (url) =>
  Boolean(process.argv[1]) && url === pathToFileURL(process.argv[1]).href;

export function gh(args, { check = true } = {}) {
  const run = spawnSync("gh", args, { encoding: "utf8", shell: false });
  if (run.error) throw new Error(`Unable to start gh: ${run.error.message}`);
  if (check && run.status !== 0)
    throw new Error(
      `gh ${args.slice(0, 3).join(" ")} failed: ${run.stderr.trim()}`,
    );
  return run.stdout.trim();
}

/** The GitHub repository this checkout belongs to, from the current `gh` context. */
export function repo() {
  const info = JSON.parse(
    gh(["repo", "view", "--json", "nameWithOwner,owner"]),
  );
  return { nameWithOwner: info.nameWithOwner, owner: info.owner.login };
}

export function singleSpec(id) {
  const bare = id.replace(/^ENG-/, "");
  const item = entries().find((it) => it.id === bare);
  if (!item) throw new Error(`Unknown spec ID ${id}`);
  return item;
}
export function parseOptions(args, valid) {
  const options = { apply: false, all: false, id: null };
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === "--apply" && valid.includes("apply")) options.apply = true;
    else if (arg === "--all" && valid.includes("all")) options.all = true;
    else if (arg === "--id" && valid.includes("id")) {
      if (!args[i + 1] || args[i + 1].startsWith("--"))
        throw new Error("Missing value for --id");
      options.id = args[++i];
    } else throw new Error(`Unknown argument: ${arg}`);
  }
  return options;
}
