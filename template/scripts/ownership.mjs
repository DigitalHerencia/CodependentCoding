/**
 * Computed file ownership (Architecture.md §5.2).
 *
 * A file belongs to the first rule that matches any module, in order:
 *   1. an explicit `owns` glob in hipster.modules.json
 *   2. a directory segment equal to the module id
 *   3. a basename starting with the id followed by an uppercase letter, `.` or `-`
 *   4. otherwise base
 * Two modules matching at the deciding rule is an ambiguity (CC-MOD-003).
 */
import { execFileSync } from "node:child_process";
import { posix } from "node:path";

export const BASE = "base";

/**
 * @param {string} path repo-relative POSIX path inside the template
 * @param {{ modules: { id: string, owns?: string[] }[] }} manifest
 * @returns {{ owner: string | null, rule: "owns" | "segment" | "basename" | "base", candidates: string[] }}
 *   `owner` is null when two or more modules match; `candidates` names them.
 */
export function ownerOf(path, manifest) {
  const segments = path.split("/");
  const basename = segments.pop() ?? "";

  const rules = [
    [
      "owns",
      (entry) =>
        (entry.owns ?? []).some((glob) => posix.matchesGlob(path, glob)),
    ],
    ["segment", (entry) => segments.includes(entry.id)],
    [
      "basename",
      (entry) =>
        basename.startsWith(entry.id) &&
        /^[A-Z.-]/.test(basename.slice(entry.id.length)),
    ],
  ];

  for (const [rule, matches] of rules) {
    const candidates = manifest.modules
      .filter(matches)
      .map((entry) => entry.id);
    if (candidates.length === 1) {
      return { owner: candidates[0], rule, candidates };
    }
    if (candidates.length > 1) return { owner: null, rule, candidates };
  }
  return { owner: BASE, rule: "base", candidates: [] };
}

/** Tracked and untracked-but-not-ignored files under `cwd`, relative to it. */
export function listFiles(cwd) {
  return execFileSync(
    "git",
    ["ls-files", "--cached", "--others", "--exclude-standard", "-z"],
    { cwd, encoding: "utf8" },
  )
    .split("\0")
    .filter(Boolean)
    .sort();
}

/**
 * @returns {{ counts: Record<string, number>, ambiguous: { path: string, rule: string, candidates: string[] }[] }}
 */
export function ownershipReport(files, manifest) {
  const counts = Object.fromEntries(
    [BASE, ...manifest.modules.map((entry) => entry.id)].map((id) => [id, 0]),
  );
  const ambiguous = [];

  for (const path of files) {
    const { owner, rule, candidates } = ownerOf(path, manifest);
    if (owner === null) ambiguous.push({ path, rule, candidates });
    else counts[owner] += 1;
  }
  return { counts, ambiguous };
}
