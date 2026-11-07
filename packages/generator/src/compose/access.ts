import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

import { pluginRoot } from "@codependent/generator/paths.mjs";

/**
 * Setup choices baked into the app (AUTH.md §4.3, §5): one organization or
 * many (`lib/authz/mode.ts`), and role checks alone (RBAC) or role checks
 * plus record rules (ABAC). The template ships RBAC policies; ABAC replaces
 * `lib/authz/policies.ts` and its test with the files in templates/authz/,
 * so no app branches on the choice at runtime.
 */
export const tenancies = ["multi", "single"] as const;
export const accessControls = ["abac", "rbac"] as const;
export type Tenancy = (typeof tenancies)[number];
export type AccessControl = (typeof accessControls)[number];

export interface AccessChoices {
  tenancy: Tenancy;
  accessControl: AccessControl;
}

export const defaultAccess: AccessChoices = {
  tenancy: "single",
  accessControl: "rbac",
};

export const MODE_FILE = path.join("lib", "authz", "mode.ts");
export const POLICIES_FILE = path.join("lib", "authz", "policies.ts");
export const POLICIES_TEST_FILE = path.join("tests", "authzPolicies.test.ts");

export const AUTHZ_TEMPLATES = path.join(pluginRoot, "templates", "authz");

/** App file → ABAC replacement in templates/authz/. */
const abacFiles = [
  [POLICIES_FILE, "policies.abac.ts.tpl"],
  [POLICIES_TEST_FILE, "authzPolicies.abac.test.ts.tpl"],
] as const;

export function parseChoice<T extends string>(
  flag: string,
  value: string,
  allowed: readonly T[],
): T {
  if ((allowed as readonly string[]).includes(value)) return value as T;
  throw new Error(
    `${flag} must be one of ${allowed.join(", ")}, got "${value}".`,
  );
}

export function applyTenancy(source: string, tenancy: Tenancy): string {
  const pattern = /(const configuredTenancy: Tenancy = )"[a-z]+";/;
  if (!pattern.test(source)) {
    throw new Error(`${MODE_FILE} has no \`configuredTenancy\` to set.`);
  }
  return source.replace(pattern, `$1"${tenancy}";`);
}

export function writeAccessChoices(
  appDir: string,
  choices: AccessChoices,
): void {
  const mode = path.join(appDir, MODE_FILE);
  writeFileSync(
    mode,
    applyTenancy(readFileSync(mode, "utf8"), choices.tenancy),
  );
  if (choices.accessControl === "abac") {
    for (const [target, template] of abacFiles) {
      writeFileSync(
        path.join(appDir, target),
        readFileSync(path.join(AUTHZ_TEMPLATES, template), "utf8"),
      );
    }
  }
}
