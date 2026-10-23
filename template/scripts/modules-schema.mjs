/**
 * Module manifest contract (Architecture.md §5.1).
 *
 * `hipster.modules.json` holds build-time facts only. This file owns its Zod
 * schema and the semantic checks the schema cannot express. It moves to
 * `packages/cli` with the CLI; until then `check-modules.mjs` runs it and
 * generates `hipster.modules.schema.json` from it.
 */
import { z } from "zod";

/** Base vocabulary a module id must never take (application.yaml → modules.reserved_ids). */
export const RESERVED_IDS = Object.freeze([
  "organization",
  "membership",
  "onboarding",
  "settings",
  "dashboard",
  "identity",
  "auth",
  "webhook",
  "audit",
]);

const moduleId = z
  .string()
  .regex(/^[a-z][a-z0-9]*$/, "module id must be lowercase letters and digits");

const envVar = z.strictObject({
  name: z.string().regex(/^[A-Z][A-Z0-9_]*$/, "env name must be UPPER_SNAKE"),
  required: z.boolean(),
  scope: z.enum(["server", "public"]),
  description: z.string().optional(),
});

const moduleEntry = z.strictObject({
  id: moduleId,
  kind: z.enum(["domain", "addon"]),
  label: z.string().min(1),
  description: z.string().optional(),
  dependsOn: z.array(moduleId).default([]),
  owns: z.array(z.string().min(1)).default([]),
  packages: z.array(z.string().min(1)).default([]),
  env: z.array(envVar).default([]),
});

export const manifestSchema = z.strictObject({
  $schema: z.string().optional(),
  base: z.strictObject({ owns: z.array(z.string().min(1)) }),
  modules: z.array(moduleEntry),
  presets: z.record(z.string().regex(/^[a-z][a-z0-9-]*$/), z.array(moduleId)),
});

/** JSON Schema for editors, generated from `manifestSchema`. */
export function toJsonSchema() {
  return z.toJSONSchema(manifestSchema, { io: "input" });
}

/**
 * Parses and checks a manifest. Returns every problem found, not just the first.
 *
 * @param {unknown} input
 * @returns {{ ok: true, manifest: z.output<typeof manifestSchema> } | { ok: false, errors: string[] }}
 */
export function validateManifest(input) {
  const parsed = manifestSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      errors: parsed.error.issues.map(
        (issue) => `${issue.path.join(".") || "(root)"}: ${issue.message}`,
      ),
    };
  }

  const manifest = parsed.data;
  const errors = [];
  const ids = new Set();

  for (const entry of manifest.modules) {
    if (ids.has(entry.id)) errors.push(`duplicate module id "${entry.id}"`);
    ids.add(entry.id);
    if (RESERVED_IDS.includes(entry.id)) {
      errors.push(`module id "${entry.id}" is reserved for base`);
    }
  }

  for (const entry of manifest.modules) {
    for (const dep of entry.dependsOn) {
      if (dep === entry.id) errors.push(`"${entry.id}" depends on itself`);
      else if (!ids.has(dep)) {
        errors.push(`"${entry.id}" depends on unknown module "${dep}"`);
      }
    }
  }

  for (const cycle of findCycles(manifest.modules)) {
    errors.push(`dependency cycle: ${cycle.join(" -> ")}`);
  }

  for (const [name, members] of Object.entries(manifest.presets)) {
    for (const id of members) {
      if (!ids.has(id)) {
        errors.push(`preset "${name}" names unknown module "${id}"`);
      }
    }
  }

  return errors.length > 0 ? { ok: false, errors } : { ok: true, manifest };
}

/** Depth-first search over `dependsOn`; each cycle is reported once. */
function findCycles(modules) {
  const deps = new Map(modules.map((entry) => [entry.id, entry.dependsOn]));
  const state = new Map(); // id -> "visiting" | "done"
  const cycles = [];

  function visit(id, trail) {
    state.set(id, "visiting");
    for (const dep of deps.get(id) ?? []) {
      if (dep === id || !deps.has(dep)) continue; // reported separately
      if (state.get(dep) === "visiting") {
        cycles.push([...trail.slice(trail.indexOf(dep)), dep]);
      } else if (!state.has(dep)) {
        visit(dep, [...trail, dep]);
      }
    }
    state.set(id, "done");
  }

  for (const id of deps.keys()) {
    if (!state.has(id)) visit(id, [id]);
  }
  return cycles;
}
