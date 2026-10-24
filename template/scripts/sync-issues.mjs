#!/usr/bin/env node
/**
 * Validates context/specs/issues/*.md and syncs them to GitHub issues,
 * labels and milestones. Dry run by default; nothing on GitHub changes
 * without --apply.
 *
 *   pnpm issues:sync                      validate + show what would change
 *   pnpm issues:sync --apply              create labels, milestones, missing issues
 *   pnpm issues:sync --repo owner/name    override detection from `origin`
 *
 * Idempotent: issues match by their "<ID> ·" title prefix; numbers are kept in
 * context/specs/issues/.github-map.json. Needs `gh` only for GitHub. No npm
 * dependencies, so it runs before `pnpm install`.
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ISSUES_DIR = path.join(ROOT, "context", "specs", "issues");
const MAP_FILE = path.join(ISSUES_DIR, ".github-map.json");

export const FILE_PATTERN = /^([A-Z][A-Z0-9]*-\d{3})-[a-z0-9-]+\.md$/;
export const ENUMS = {
  type: ["feature", "fix", "chore", "refactor", "test", "docs", "ci", "spike"],
  priority: ["p0", "p1", "p2", "p3"],
  size: ["xs", "s", "m", "l", "xl"],
  status: ["todo", "in-progress", "in-review", "done"],
};
const REQUIRED = ["id", "title", "type", "area", "priority", "size", "status"];
const SECTIONS = ["Summary", "Scope", "Acceptance criteria"];
const log = (line) => process.stdout.write(`${line}\n`);
const LABEL_COLORS = {
  type: "1d76db",
  area: "5319e7",
  priority: "d93f0b",
  size: "fbca04",
};

export function parseFrontmatter(text) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(text);
  if (!match) throw new Error("missing frontmatter");
  const data = {};
  for (const line of match[1].split(/\r?\n/)) {
    const kv = /^([A-Za-z_][\w-]*):\s*(.*?)(?:\s+#.*)?\s*$/.exec(line);
    if (!kv) continue;
    let value = kv[2];
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

/** Frontmatter labels, else type/area/priority/size labels. */
export function labelsOf(issue) {
  if (Array.isArray(issue.labels) && issue.labels.length > 0) {
    return issue.labels;
  }
  return ["type", "area", "priority", "size"].map(
    (key) => `${key}:${issue[key]}`,
  );
}

/** Every issue file, parsed, plus the problems that block a sync. */
export function loadIssues(dir = ISSUES_DIR) {
  const files = fs.existsSync(dir)
    ? fs.readdirSync(dir).filter((file) => file.endsWith(".md"))
    : [];
  const issues = [];
  const problems = [];
  for (const file of files.sort()) {
    if (file === "README.md") continue;
    const match = FILE_PATTERN.exec(file);
    if (!match) {
      problems.push(`${file}: name must be <PREFIX>-NNN-<slug>.md`);
      continue;
    }
    let parsed;
    try {
      parsed = parseFrontmatter(fs.readFileSync(path.join(dir, file), "utf8"));
    } catch (error) {
      problems.push(`${file}: ${error.message}`);
      continue;
    }
    const issue = { file, ...parsed.data, body: parsed.body };
    for (const key of REQUIRED) {
      if (!issue[key] || Array.isArray(issue[key])) {
        problems.push(`${file}: ${key} is required`);
      }
    }
    for (const [key, values] of Object.entries(ENUMS)) {
      if (issue[key] && !values.includes(issue[key])) {
        problems.push(
          `${file}: ${key} "${issue[key]}" is not one of ${values.join(", ")}`,
        );
      }
    }
    if (issue.id && issue.id !== match[1]) {
      problems.push(`${file}: id ${issue.id} does not match the file name`);
    }
    if (issue.depends_on !== undefined && !Array.isArray(issue.depends_on)) {
      problems.push(`${file}: depends_on must be a list, e.g. [APP-001]`);
    }
    for (const section of SECTIONS) {
      if (!new RegExp(`^## ${section}\\s*$`, "m").test(parsed.body)) {
        problems.push(`${file}: missing "## ${section}"`);
      }
    }
    issues.push(issue);
  }
  const ids = new Set();
  for (const issue of issues) {
    if (ids.has(issue.id))
      problems.push(`${issue.file}: duplicate id ${issue.id}`);
    ids.add(issue.id);
  }
  for (const issue of issues) {
    for (const dependency of issue.depends_on ?? []) {
      if (!ids.has(dependency)) {
        problems.push(
          `${issue.file}: depends_on ${dependency} has no issue file`,
        );
      }
    }
  }
  return { issues, problems };
}

// --------------------------------------------------------------------- gh
const args = process.argv.slice(2);
const option = (name) => {
  const index = args.indexOf(`--${name}`);
  return index >= 0 ? args[index + 1] : undefined;
};
const APPLY = args.includes("--apply");

function gh(argv) {
  return execFileSync("gh", argv, {
    encoding: "utf8",
    stdio: ["pipe", "pipe", "pipe"],
  }).trim();
}

function detectRepo() {
  const override = option("repo");
  if (override) return override;
  try {
    const url = execFileSync("git", ["remote", "get-url", "origin"], {
      cwd: ROOT,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    return /github\.com[:/]([^/]+\/[^/.]+)(\.git)?$/.exec(url)?.[1] ?? null;
  } catch {
    return null;
  }
}

function tryJson(read, fallback) {
  try {
    return JSON.parse(read());
  } catch {
    return fallback;
  }
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

function sync(issues, repo) {
  const map = fs.existsSync(MAP_FILE)
    ? JSON.parse(fs.readFileSync(MAP_FILE, "utf8"))
    : {};
  const verb = (doing, would) => (APPLY ? doing : would);

  const labels = [...new Set(issues.flatMap(labelsOf))].sort();
  for (const label of labels) {
    if (!APPLY) continue;
    gh([
      ...["label", "create", label, "--repo", repo, "--force"],
      ...["--color", LABEL_COLORS[label.split(":")[0]] ?? "ededed"],
    ]);
  }
  log(`labels: ${labels.length} ${verb("upserted", "would upsert")}`);

  const milestones = [
    ...new Set(issues.map(({ milestone }) => milestone).filter(Boolean)),
  ];
  const existing = tryJson(
    () => gh(["api", `repos/${repo}/milestones?state=all&per_page=100`]),
    [],
  ).map(({ title }) => title);
  for (const title of milestones.filter((t) => !existing.includes(t))) {
    log(`milestone: ${verb("create", "would create")} "${title}"`);
    if (APPLY) {
      gh([
        "api",
        "-X",
        "POST",
        `repos/${repo}/milestones`,
        "-f",
        `title=${title}`,
      ]);
    }
  }

  const onGitHub = new Map();
  const listed = tryJson(
    () =>
      gh([
        ...["issue", "list", "--repo", repo, "--state", "all"],
        ...["--limit", "1000", "--json", "number,title,url"],
      ]),
    [],
  );
  for (const item of listed) {
    const id = /^([A-Z][A-Z0-9]*-\d{3})\b/.exec(item.title)?.[1];
    if (id) onGitHub.set(id, item);
  }

  const created = [];
  for (const issue of issues) {
    const found = onGitHub.get(issue.id);
    if (found) {
      map[issue.id] = {
        number: found.number,
        url: found.url,
        file: issue.file,
      };
      continue;
    }
    const title = `${issue.id} · ${issue.title}`;
    log(
      `issue: ${verb("create", "would create")} ${title} {${labelsOf(issue).join(", ")}}`,
    );
    if (!APPLY) continue;
    const bodyFile = path.join(os.tmpdir(), `${issue.id}.md`);
    fs.writeFileSync(bodyFile, renderBody(issue, map));
    const url = gh([
      ...["issue", "create", "--repo", repo, "--title", title],
      ...["--body-file", bodyFile, "--label", labelsOf(issue).join(",")],
      ...(issue.milestone ? ["--milestone", issue.milestone] : []),
    ]);
    map[issue.id] = {
      number: Number(url.split("/").pop()),
      url,
      file: issue.file,
    };
    created.push(issue);
  }

  if (APPLY) {
    // Second pass: "Depends on" with real issue numbers, now that all exist.
    for (const issue of created.filter(
      ({ depends_on }) => depends_on?.length,
    )) {
      const bodyFile = path.join(os.tmpdir(), `${issue.id}.md`);
      fs.writeFileSync(bodyFile, renderBody(issue, map));
      gh([
        ...["issue", "edit", String(map[issue.id].number), "--repo", repo],
        ...["--body-file", bodyFile],
      ]);
    }
    fs.writeFileSync(MAP_FILE, `${JSON.stringify(map, null, 2)}\n`);
  }
  log(
    APPLY
      ? `done · created ${created.length}`
      : "dry run complete · re-run with --apply",
  );
}

function main() {
  const { issues, problems } = loadIssues();
  if (problems.length > 0) {
    console.error(problems.join("\n"));
    console.error(`\n${problems.length} problem(s) in context/specs/issues.`);
    process.exit(1);
  }
  const repo = detectRepo();
  log(
    `${APPLY ? "APPLY" : "DRY RUN"} · ${repo ?? "no GitHub remote"} · ${issues.length} issues valid`,
  );
  if (!repo) {
    if (APPLY) {
      console.error(
        "No GitHub remote: add `origin` or pass --repo owner/name.",
      );
      process.exit(1);
    }
    for (const issue of issues) {
      log(
        `issue: ${issue.id} · ${issue.title} {${labelsOf(issue).join(", ")}}`,
      );
    }
    return;
  }
  sync(issues, repo);
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
