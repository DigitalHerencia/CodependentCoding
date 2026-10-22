#!/usr/bin/env node
/**
 * Sync context/specs/issues/*.md → GitHub labels, milestones, issues, Project v2.
 *
 *   node scripts/github/sync-issues.mjs                    dry run (default)
 *   node scripts/github/sync-issues.mjs --apply            create labels/milestones/missing issues
 *   node scripts/github/sync-issues.mjs --apply --project 3 [--owner DigitalHerencia]
 *   node scripts/github/sync-issues.mjs --repo owner/name  override repo detection
 *
 * Idempotent: issues are matched by their "CC-NNN" title prefix. Requires `gh` (authenticated).
 * No npm dependencies so it runs before the toolchain is fixed.
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "..",
);
const ISSUES_DIR = path.join(ROOT, "context", "specs", "issues");
const LABELS_FILE = path.join(ROOT, ".github", "labels.yml");
const MAP_FILE = path.join(ISSUES_DIR, ".github-map.json");

const MILESTONES = {
  "M0 · Governance bootstrap":
    "One governance system, working toolchain, CI, GitHub Project",
  "M1 · Site reduction": "Landing page only; legacy generator removed",
  "M2 · Template conformance":
    "Template obeys the doctrine: 0 CC findings, typecheck green, RLS test",
  "M3 · Module system":
    "Computed ownership, registry, multi-file Prisma, RLS per owner",
  "M4 · Hipster Stack CLI":
    "new, slice, add, doctor, compose; every preset builds",
  "M5 · Loaded Vibes plugin": "Claude Code plugin: skills, hooks, agents",
  "M6 · Dogfood and v1.0.0": "Timed idea-to-MVP run; v1.0.0",
};

// ------------------------------------------------------------------ args
const args = process.argv.slice(2);
const flag = (name) => args.includes(`--${name}`);
const option = (name) => {
  const index = args.indexOf(`--${name}`);
  return index >= 0 ? args[index + 1] : undefined;
};
const APPLY = flag("apply");
const PROJECT = option("project");

// ---------------------------------------------------------------- parsing
export function parseFrontmatter(text) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(text);
  if (!match) throw new Error("missing frontmatter");
  const data = {};
  for (const line of match[1].split(/\r?\n/)) {
    const kv = /^([A-Za-z_][\w-]*):\s*(.*)$/.exec(line);
    if (!kv) continue;
    let value = kv[2].trim();
    if (value.startsWith("[") && value.endsWith("]")) {
      value = value
        .slice(1, -1)
        .split(",")
        .map((v) => v.trim().replace(/^["']|["']$/g, ""))
        .filter(Boolean);
    } else {
      value = value.replace(/^["']|["']$/g, "");
    }
    data[kv[1]] = value;
  }
  return { data, body: match[2] };
}

export function parseLabels(text) {
  // Whitespace-agnostic: works for one-line or Prettier-expanded flow mappings.
  const flat = text.replace(/#.*$/gm, "").replace(/\s+/g, " ");
  const pattern =
    /name:\s*"([^"]+)",\s*color:\s*"([0-9a-fA-F]{6})",\s*description:\s*"([^"]*)"/g;
  return [...flat.matchAll(pattern)].map((m) => ({
    name: m[1],
    color: m[2],
    description: m[3],
  }));
}

function loadIssues() {
  return fs
    .readdirSync(ISSUES_DIR)
    .filter((f) => /^CC-\d{3}-.*\.md$/.test(f))
    .sort()
    .map((file) => {
      const { data, body } = parseFrontmatter(
        fs.readFileSync(path.join(ISSUES_DIR, file), "utf8"),
      );
      return { file, ...data, body };
    });
}

// --------------------------------------------------------------------- gh
function gh(argv, { input } = {}) {
  return execFileSync("gh", argv, {
    encoding: "utf8",
    input,
    stdio: ["pipe", "pipe", "pipe"],
  }).trim();
}

function detectRepo() {
  const override = option("repo");
  if (override) return override;
  const url = execFileSync("git", ["remote", "get-url", "origin"], {
    cwd: ROOT,
    encoding: "utf8",
  }).trim();
  const m = /github\.com[:/]([^/]+\/[^/.]+)(\.git)?$/.exec(url);
  if (!m) throw new Error(`cannot detect GitHub repo from origin: ${url}`);
  return m[1];
}

function tryJson(fn, fallback) {
  try {
    return JSON.parse(fn());
  } catch {
    return fallback;
  }
}

// ------------------------------------------------------------------- main
function main() {
  const repo = detectRepo();
  const owner = option("owner") ?? repo.split("/")[0];
  const issues = loadIssues();
  const labels = parseLabels(fs.readFileSync(LABELS_FILE, "utf8"));
  const map = fs.existsSync(MAP_FILE)
    ? JSON.parse(fs.readFileSync(MAP_FILE, "utf8"))
    : {};

  console.log(
    `${APPLY ? "APPLY" : "DRY RUN"} · ${repo} · ${issues.length} issues · ${labels.length} labels`,
  );

  // Labels (create or update in place)
  for (const label of labels) {
    if (APPLY) {
      gh([
        "label",
        "create",
        label.name,
        "--repo",
        repo,
        "--color",
        label.color,
        "--description",
        label.description,
        "--force",
      ]);
    }
  }
  console.log(
    `labels: ${labels.length} ${APPLY ? "upserted" : "would upsert"}`,
  );

  // Milestones
  const existingMilestones = tryJson(
    () => gh(["api", `repos/${repo}/milestones?state=all&per_page=100`]),
    [],
  );
  const haveMilestone = new Set(existingMilestones.map((m) => m.title));
  for (const [title, description] of Object.entries(MILESTONES)) {
    if (haveMilestone.has(title)) continue;
    console.log(`milestone: ${APPLY ? "create" : "would create"} "${title}"`);
    if (APPLY)
      gh([
        "api",
        "-X",
        "POST",
        `repos/${repo}/milestones`,
        "-f",
        `title=${title}`,
        "-f",
        `description=${description}`,
      ]);
  }

  // Issues
  const existing = tryJson(
    () =>
      gh([
        "issue",
        "list",
        "--repo",
        repo,
        "--state",
        "all",
        "--limit",
        "1000",
        "--json",
        "number,title,url",
      ]),
    [],
  );
  const byId = new Map();
  for (const it of existing) {
    const m = /^(CC-\d{3})\b/.exec(it.title);
    if (m) byId.set(m[1], it);
  }

  const created = [];
  for (const issue of issues) {
    const title = `${issue.id} · ${issue.title}`;
    const found = byId.get(issue.id);
    if (found) {
      map[issue.id] = {
        number: found.number,
        url: found.url,
        file: issue.file,
      };
      continue;
    }
    console.log(
      `issue: ${APPLY ? "create" : "would create"} ${title}  [${issue.milestone}] {${issue.labels.join(", ")}}`,
    );
    if (!APPLY) continue;
    const bodyFile = path.join(os.tmpdir(), `${issue.id}.md`);
    fs.writeFileSync(bodyFile, renderBody(issue, map));
    const url = gh([
      "issue",
      "create",
      "--repo",
      repo,
      "--title",
      title,
      "--body-file",
      bodyFile,
      "--label",
      issue.labels.join(","),
      "--milestone",
      issue.milestone,
    ]);
    const number = Number(url.split("/").pop());
    map[issue.id] = { number, url, file: issue.file };
    created.push(issue);
  }

  // Second pass: rewrite "Depends on" with real issue numbers now that all exist
  if (APPLY) {
    for (const issue of created) {
      if (!issue.depends_on?.length) continue;
      const bodyFile = path.join(os.tmpdir(), `${issue.id}.md`);
      fs.writeFileSync(bodyFile, renderBody(issue, map));
      gh([
        "issue",
        "edit",
        String(map[issue.id].number),
        "--repo",
        repo,
        "--body-file",
        bodyFile,
      ]);
    }
    fs.writeFileSync(MAP_FILE, `${JSON.stringify(map, null, 2)}\n`);
  }

  // Project v2
  if (PROJECT) {
    for (const issue of issues) {
      const entry = map[issue.id];
      if (!entry) continue;
      if (APPLY) {
        try {
          gh([
            "project",
            "item-add",
            PROJECT,
            "--owner",
            owner,
            "--url",
            entry.url,
          ]);
        } catch (error) {
          console.warn(
            `project: could not add ${issue.id}: ${String(error.stderr ?? error).trim()}`,
          );
        }
      }
    }
    console.log(
      `project #${PROJECT}: ${APPLY ? "added" : "would add"} ${issues.length} items`,
    );
  }

  console.log(
    APPLY
      ? `done · created ${created.length}`
      : "dry run complete · re-run with --apply",
  );
}

function renderBody(issue, map) {
  const ref = (id) => (map[id] ? `#${map[id].number} (${id})` : id);
  let body = issue.body.replace(/^# .*\r?\n+/, "");
  if (issue.depends_on?.length) {
    body = body.replace(
      /## Depends on\r?\n\r?\n.*\r?\n/,
      `## Depends on\n\n${issue.depends_on.map(ref).join(", ")}\n`,
    );
  }
  return `${body.trim()}\n\n---\n_Source: \`context/specs/issues/${issue.file}\` · priority ${issue.priority} · size ${issue.size}_\n`;
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  try {
    main();
  } catch (error) {
    console.error(String(error.stderr ?? error.message ?? error));
    process.exit(1);
  }
}
