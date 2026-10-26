import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

/**
 * Setup choices written into the app's lib/constants/access.ts (AUTH.md
 * §4.3, §5): one organization or many, and role checks alone (RBAC) or role
 * checks plus record rules (ABAC).
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
  tenancy: "multi",
  accessControl: "abac",
};

export const ACCESS_FILE = path.join("lib", "constants", "access.ts");

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

export function applyAccessChoices(
  source: string,
  choices: AccessChoices,
): string {
  let out = source;
  for (const [name, value] of [
    ["tenancy", choices.tenancy],
    ["accessControl", choices.accessControl],
  ] as const) {
    const pattern = new RegExp(`(export const ${name}: \\w+ = )"[a-z]+";`);
    if (!pattern.test(out)) {
      throw new Error(`${ACCESS_FILE} has no \`${name}\` constant to set.`);
    }
    out = out.replace(pattern, `$1"${value}";`);
  }
  return out;
}

export function writeAccessChoices(
  appDir: string,
  choices: AccessChoices,
): void {
  const file = path.join(appDir, ACCESS_FILE);
  writeFileSync(file, applyAccessChoices(readFileSync(file, "utf8"), choices));
}
