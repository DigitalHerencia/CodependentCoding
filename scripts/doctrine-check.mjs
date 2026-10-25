/**
 * Keeps the doctrine's rule IDs in one agreement: every CC-* ID used by the
 * ESLint doctrine (template/eslint), the Loaded Vibes plugin, the docs and the
 * generated-app governance exists in .claude/contracts/validation.yaml, and
 * every rule the contract says ESLint enforces is a real rule that reports
 * that ID. Also fails when the plugin's references/doctrine.md is stale.
 *
 *   pnpm doctrine:check   exit 1 on any mismatch
 */
import { spawnSync } from "node:child_process";
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import { parse } from "yaml";

const root = fileURLToPath(new URL("..", import.meta.url));
const VALIDATION = ".claude/contracts/validation.yaml";
const ESLINT_SOURCES = [
  "template/eslint/doctrine-map.mjs",
  "template/eslint/codependent-plugin.mjs",
];
/** Files and folders whose CC IDs must exist in the contract. */
const USERS = [
  "plugin/loaded-vibes",
  "context/docs",
  "packages/cli/assets/app-governance",
  "CLAUDE.md",
  "README.md",
];
const ID = /\bCC-[A-Z]+-\d{3}\b/g;
const TEXT = /\.(md|mjs|ts|yaml|json)$/;

const read = (file) => readFileSync(path.join(root, file), "utf8");
const idsIn = (text) => new Set(text.match(ID) ?? []);

function files(entry) {
  const full = path.join(root, entry);
  if (!statSync(full).isDirectory()) return [entry];
  return readdirSync(full, { recursive: true })
    .map((name) => path.join(entry, String(name)).split(path.sep).join("/"))
    .filter((file) => TEXT.test(file) && !file.includes("/evals/results/"));
}

export async function checkDoctrine() {
  const problems = [];
  const { rules } = parse(read(VALIDATION));
  const contract = new Map(rules.map((rule) => [rule.id, rule]));

  const eslintIds = new Set(
    ESLINT_SOURCES.flatMap((file) => [...idsIn(read(file))]),
  );
  for (const id of eslintIds) {
    if (!contract.has(id))
      problems.push(`${id}: used by template/eslint but not in ${VALIDATION}`);
  }

  const plugin = await import(
    pathToFileURL(path.join(root, ESLINT_SOURCES[1])).href
  );
  const pluginRules = new Set(Object.keys(plugin.rules));
  const contractRules = new Set();
  for (const { id, enforcement } of rules) {
    const name = /^eslint:codependent\/([a-z-]+)$/.exec(enforcement ?? "")?.[1];
    if (!name) continue;
    contractRules.add(name);
    if (!pluginRules.has(name))
      problems.push(
        `${id}: enforcement codependent/${name} is not a rule in template/eslint`,
      );
    if (!eslintIds.has(id))
      problems.push(
        `${id}: enforced by codependent/${name} but no ESLint source reports it`,
      );
  }
  for (const name of pluginRules) {
    if (!contractRules.has(name))
      problems.push(
        `codependent/${name}: no rule in ${VALIDATION} names it as its enforcement`,
      );
  }

  for (const entry of USERS) {
    for (const file of files(entry)) {
      for (const id of idsIn(read(file))) {
        if (!contract.has(id))
          problems.push(`${file}: ${id} is not in ${VALIDATION}`);
      }
    }
  }

  const stale = spawnSync(
    process.execPath,
    ["scripts/plugin-doctrine.mjs", "--check"],
    {
      cwd: root,
      encoding: "utf8",
    },
  );
  if (stale.status !== 0)
    problems.push(
      stale.stderr.trim() ||
        "plugin doctrine.md is stale: run pnpm plugin:doctrine",
    );
  return {
    problems,
    rules: contract.size,
    eslintIds: eslintIds.size,
    eslintRules: pluginRules.size,
  };
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  const { problems, rules, eslintIds, eslintRules } = await checkDoctrine();
  if (problems.length > 0) {
    process.stderr.write(
      `${problems.join("\n")}\n\n${problems.length} doctrine mismatch(es).\n`,
    );
    process.exit(1);
  }
  process.stdout.write(
    `doctrine ok: ${rules} rules in ${VALIDATION}; ${eslintIds} IDs and ${eslintRules} rules in template/eslint agree; plugin, docs and app governance use only known IDs\n`,
  );
}
