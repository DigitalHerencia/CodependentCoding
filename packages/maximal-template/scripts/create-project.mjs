import {
  json,
  writeJson,
  gh,
  parseOptions,
  repo as currentRepo,
  log,
} from "./common.mjs";

// Creates the GitHub Projects v2 board for this repo and links it. Dry run by default.
try {
  const { apply } = parseOptions(process.argv.slice(2), ["apply"]);
  const config = json(".github/project.json");
  if (Number.isInteger(config.project_number)) {
    log(
      `Project #${config.project_number} is already recorded in .github/project.json. Nothing to do.`,
    );
  } else if (!apply) {
    log(
      "DRY RUN: would create a Project for the current repo, link it, and record its number in .github/project.json.",
    );
    log(
      "Requires `gh auth refresh -s project`. Re-run with --apply to create it.",
    );
  } else {
    const { nameWithOwner, owner } = currentRepo();
    const title = config.title.replace("{repo}", nameWithOwner.split("/")[1]);
    const created = JSON.parse(
      gh([
        "project",
        "create",
        "--owner",
        owner,
        "--title",
        title,
        "--format",
        "json",
      ]),
    );
    gh([
      "project",
      "link",
      String(created.number),
      "--owner",
      owner,
      "--repo",
      nameWithOwner,
    ]);
    writeJson(".github/project.json", {
      ...config,
      project_number: created.number,
    });
    log(`Created and linked Project #${created.number}: ${created.url}`);
    log("Item closed → Done and PR merged → Done are on by default.");
    log(
      `Turn on auto-add manually: ${created.url}/workflows (filter: is:issue label:tracked).`,
    );
  }
} catch (e) {
  console.error(`ERROR: ${e.message}`);
  process.exitCode = 1;
}
