#!/usr/bin/env node
/**
 * Checks a generated app's execution state after /handoff: the three files in
 * .claude/execution parse and keep their shape, decisions are append-only
 * DEC-NNN, every issue named in handoff/progress has a file, and every
 * acceptance or evidence line starts with an evidence state.
 *
 *   node scripts/execution-check.mjs [appDir]   exit 1 on any problem
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

export const STATUSES = ["todo", "in-progress", "in-review", "done", "blocked"];
export const EVIDENCE = /^(EXECUTED|INSPECTED|NOT_RUN|BLOCKED)\b/;
const FILES = ["progress", "decisions", "handoff"];

function readJson(appDir, name, problems) {
  const file = `.claude/execution/${name}.json`;
  const full = path.join(appDir, file);
  if (!existsSync(full)) {
    problems.push(`${file}: missing`);
    return null;
  }
  try {
    const data = JSON.parse(readFileSync(full, "utf8"));
    if (data.$schema !== `codependent-coding/execution/${name}/v1`) {
      problems.push(
        `${file}: $schema must be codependent-coding/execution/${name}/v1`,
      );
    }
    if (typeof data.updated !== "string" || data.updated === "") {
      problems.push(`${file}: updated is required`);
    }
    return data;
  } catch (error) {
    problems.push(`${file}: invalid JSON: ${error.message}`);
    return null;
  }
}

/** Problems as "<file>: <what>"; empty when the execution state is consistent. */
export function checkExecution(appDir) {
  if (!existsSync(path.join(appDir, "hipster.json"))) {
    return [`${appDir}: not a generated app (no hipster.json)`];
  }
  const problems = [];
  const [progress, decisions, handoff] = FILES.map((name) =>
    readJson(appDir, name, problems),
  );
  const issuesDir = path.join(appDir, "context/specs/issues");
  const issueIds = new Set(
    existsSync(issuesDir)
      ? readdirSync(issuesDir)
          .map((file) => /^([A-Z][A-Z0-9]*-\d{3})-/.exec(file)?.[1])
          .filter(Boolean)
      : [],
  );
  const known = (where, id) => {
    if (!issueIds.has(id))
      problems.push(`${where}: ${id} has no file in context/specs/issues`);
  };

  if (decisions) {
    const list = Array.isArray(decisions.decisions) ? decisions.decisions : [];
    if (!Array.isArray(decisions.decisions))
      problems.push("decisions.json: decisions must be a list");
    let last = 0;
    for (const [index, entry] of list.entries()) {
      const where = `decisions.json: decisions[${index}]`;
      const number = /^DEC-(\d{3})$/.exec(entry?.id ?? "")?.[1];
      if (!number) {
        problems.push(`${where}: id must be DEC-NNN`);
        continue;
      }
      if (Number(number) <= last)
        problems.push(
          `${where}: ${entry.id} is not after DEC-${String(last).padStart(3, "0")} (append only)`,
        );
      last = Math.max(last, Number(number));
      for (const field of ["date", "status", "title", "decision"]) {
        if (!entry[field])
          problems.push(`${where}: ${entry.id} has no ${field}`);
      }
    }
  }

  if (handoff) {
    for (const field of ["current_issue", "next_issue"]) {
      if (handoff[field] != null)
        known(`handoff.json: ${field}`, handoff[field]);
    }
    if (!Array.isArray(handoff.queue))
      problems.push("handoff.json: queue must be a list");
    else for (const id of handoff.queue) known("handoff.json: queue", id);
    for (const field of ["notes", "risks"]) {
      if (!Array.isArray(handoff[field]))
        problems.push(`handoff.json: ${field} must be a list`);
    }
  }

  if (progress) {
    const issues = progress.issues ?? {};
    for (const [id, entry] of Object.entries(issues)) {
      const where = `progress.json: issues.${id}`;
      known("progress.json: issues", id);
      if (!STATUSES.includes(entry?.status)) {
        problems.push(
          `${where}: status "${entry?.status}" is not one of ${STATUSES.join(", ")}`,
        );
      }
      const lines = Object.values(entry?.acceptance ?? {});
      for (const line of lines) {
        if (typeof line !== "string" || !EVIDENCE.test(line)) {
          problems.push(
            `${where}: acceptance "${String(line).slice(0, 60)}" must start with EXECUTED, INSPECTED, NOT_RUN or BLOCKED`,
          );
        }
      }
      if (
        ["in-review", "done"].includes(entry?.status) &&
        !lines.some((line) => /^EXECUTED\b/.test(line))
      ) {
        problems.push(
          `${where}: ${entry.status} needs at least one EXECUTED acceptance line`,
        );
      }
    }
    for (const [index, item] of (progress.evidence ?? []).entries()) {
      if (
        !item?.command ||
        !item?.result ||
        !EVIDENCE.test(item?.state ?? "")
      ) {
        problems.push(
          `progress.json: evidence[${index}] needs command, result and state (EXECUTED, INSPECTED, NOT_RUN or BLOCKED)`,
        );
      }
    }
  }
  return problems;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  const problems = checkExecution(path.resolve(process.argv[2] ?? "."));
  if (problems.length > 0) {
    process.stderr.write(
      `${problems.join("\n")}\n\n${problems.length} problem(s) in .claude/execution.\n`,
    );
    process.exit(1);
  }
  process.stdout.write(
    "execution state ok: progress, decisions and handoff agree with the issues\n",
  );
}
