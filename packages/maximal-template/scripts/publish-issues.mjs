import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  entries,
  singleSpec,
  gh,
  json,
  writeJson,
  parseOptions,
  repo as currentRepo,
  log,
} from "./common.mjs";
import { render } from "./render-issue.mjs";

// Dry run is the default; --apply creates missing issues and sub-issues only, and records their numbers in the spec JSON.
const issueNumber = (url) => Number(url.trim().split("/").at(-1));

try {
  const { apply, all, id } = parseOptions(process.argv.slice(2), [
    "apply",
    "all",
    "id",
  ]);
  if ((all ? 1 : 0) + (id ? 1 : 0) !== 1)
    throw new Error("Specify exactly one of --id SPEC-ID or --all");
  const specs = all ? entries() : [singleSpec(id)];
  if (!apply) {
    for (const { spec } of specs) {
      log(
        `DRY RUN: ${spec.github.title} | milestone: ${spec.github.milestone} | labels: ${spec.github.labels.join(", ")}`,
      );
      for (const sub of spec.sub_issues)
        log(`DRY RUN:   sub-issue [${sub.id}] ${sub.title}`);
    }
    log(
      `No writes. ${specs.length} candidate issues. Run governance:taxonomy and governance:project with --apply first.`,
    );
  } else {
    // Refuse to publish unfilled specs. Preflight the whole batch before any write.
    const incomplete = specs.filter(
      ({ spec }) =>
        !spec.specification.objective.trim() ||
        spec.specification.acceptance_criteria.length === 0 ||
        (spec.specification.validation.commands.length === 0 &&
          spec.specification.validation.manual_checks.length === 0),
    );
    if (incomplete.length)
      throw new Error(
        `Refusing to publish ${incomplete.length} incomplete spec(s); fill objective, acceptance criteria and validation first. First: ${incomplete[0].id}`,
      );
    const { nameWithOwner: repo, owner } = currentRepo();
    const project = json(".github/project.json").project_number;
    // Deduplicate on the exact `[ID] ` title prefix.
    const existing = JSON.parse(
      gh([
        "issue",
        "list",
        "--repo",
        repo,
        "--state",
        "all",
        "--limit",
        "2000",
        "--json",
        "title,number,url",
      ]),
    );
    const find = (code) =>
      existing.find((issue) => issue.title.startsWith(`[${code}] `));
    const tmp = mkdtempSync(join(tmpdir(), "governance-"));
    const create = (title, body, spec) => {
      const bodyPath = join(tmp, "body.md");
      writeFileSync(bodyPath, body, "utf8");
      const args = [
        "issue",
        "create",
        "--repo",
        repo,
        "--title",
        title,
        "--body-file",
        bodyPath,
        "--milestone",
        spec.github.milestone,
      ];
      for (const label of spec.github.labels) args.push("--label", label);
      const url = gh(args);
      existing.push({ title, url, number: issueNumber(url) });
      if (Number.isInteger(project))
        gh([
          "project",
          "item-add",
          String(project),
          "--owner",
          owner,
          "--url",
          url,
        ]);
      return { url, number: issueNumber(url) };
    };
    const nodeId = (number) =>
      JSON.parse(
        gh(["issue", "view", String(number), "--repo", repo, "--json", "id"]),
      ).id;
    try {
      for (const { spec, path } of specs) {
        let changed = false;
        let parent = find(spec.work_code);
        if (parent) log(`SKIP (exists): ${spec.work_code} #${parent.number}`);
        else {
          parent = create(spec.github.title, render(spec), spec);
          log(`CREATED: ${spec.work_code} ${parent.url}`);
        }
        if (spec.github.issue_number !== parent.number) {
          spec.github.issue_number = parent.number;
          spec.github.issue_url = parent.url;
          changed = true;
        }
        for (const sub of spec.sub_issues) {
          let child = find(sub.id);
          if (!child) {
            const body = `Sub-issue of #${parent.number} (\`${spec.work_code}\`).\n\n${sub.body ?? ""}\n`;
            child = create(
              `[${sub.id}] ${spec.traceability.dev_cycle_title} – ${sub.title}`,
              body,
              spec,
            );
            gh([
              "api",
              "graphql",
              "-f",
              "query=mutation($p:ID!,$c:ID!){addSubIssue(input:{issueId:$p,subIssueId:$c}){issue{id}}}",
              "-f",
              `p=${nodeId(parent.number)}`,
              "-f",
              `c=${nodeId(child.number)}`,
            ]);
            log(`CREATED sub-issue: ${sub.id} ${child.url}`);
          }
          if (sub.issue_number !== child.number) {
            sub.issue_number = child.number;
            sub.issue_url = child.url;
            changed = true;
          }
        }
        if (changed) writeJson(path, spec);
      }
    } finally {
      rmSync(tmp, { recursive: true, force: true });
    }
  }
} catch (e) {
  console.error(`ERROR: ${e.message}`);
  process.exitCode = 1;
}
