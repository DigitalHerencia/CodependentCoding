import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { expect, test } from "vitest";

import { permissions } from "@/lib/authz/permissions";
import { installedModules } from "@/lib/modules/registry";
import { listFiles } from "@/scripts/ownership.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
const manifest = JSON.parse(
  readFileSync(`${root}/hipster.modules.json`, "utf8"),
) as { modules: { id: string; kind: string; env?: { name: string }[] }[] };

test("the registry lists every manifest module once, in manifest order", () => {
  expect(installedModules.map(({ id }) => id)).toEqual(
    manifest.modules.map(({ id }) => id),
  );
});

test("module resources and grants use the module id as prefix", () => {
  const actions = ["read", "create", "update", "delete", "manage"];
  for (const { id, permissions: own } of installedModules) {
    for (const resource of own?.resources ?? []) {
      expect(resource).toMatch(new RegExp(`^${id}\\.[a-z-]+$`));
    }
    for (const granted of Object.values(own?.grants ?? {})) {
      for (const grant of granted) {
        if (actions.includes(grant)) continue;
        expect(own?.resources).toContain(grant.split(":")[0]);
        expect(actions).toContain(grant.split(":")[1]);
      }
    }
  }
});

test("every permission is <module>.<resource>:<action>", () => {
  expect(permissions.length).toBeGreaterThan(0);
  for (const permission of permissions) {
    expect(permission).toMatch(
      /^[a-z]+\.[a-z-]+:(read|create|update|delete|manage)$/,
    );
  }
});

test("every permission checked in code is in the catalog", () => {
  const checked = new Set<string>();
  const call =
    /(?:assertPermission|hasPermission|authorizeOwnedOrAssignedWrite)\(\s*[\w.]+,\s*"([^"]+)"/g;
  for (const path of listFiles(root)) {
    if (!/^(app|features|lib)\/.*\.tsx?$/.test(path)) continue;
    const source = readFileSync(`${root}/${path}`, "utf8");
    for (const match of source.matchAll(call)) checked.add(match[1] ?? "");
  }
  expect(checked.size).toBeGreaterThan(0);
  expect([...checked].filter((p) => !permissions.includes(p as never))).toEqual(
    [],
  );
});

test("each provider add-on reports its own manifest env in Settings > Integrations", () => {
  const addons = manifest.modules.filter(({ kind }) => kind === "addon");
  for (const { id, env } of addons) {
    const integration = installedModules.find(
      (entry) => entry.id === id,
    )?.integration;
    expect(integration, id).toBeDefined();
    const declared = (env ?? []).map(({ name }) => name);
    for (const name of integration?.env ?? []) {
      expect(declared, `${id}: ${name}`).toContain(name);
    }
  }
});
