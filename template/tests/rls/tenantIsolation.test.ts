import assert from "node:assert/strict";

import type pg from "pg";
import { afterAll, beforeAll, describe, test } from "vitest";

import {
  appRole,
  type Catalog,
  connect,
  connectAsApp,
  migrate,
  newOrg,
  type OrgSeed,
  ownerUrl,
  prepareAppRole,
  probeTable,
  readCatalog,
  removeOrg,
  seedOrg,
  setTenantContext,
  SYSTEM_TABLES,
  type TableInfo,
} from "./rlsHarness";

let owner: pg.Client;
let app: pg.Client;
let catalog: Catalog;
const orgA = newOrg();
const orgB = newOrg();

async function inTransaction<T>(
  db: pg.Client,
  work: () => Promise<T>,
): Promise<T> {
  await db.query("BEGIN");
  try {
    return await work();
  } finally {
    await db.query("ROLLBACK");
  }
}

async function probeAll(
  db: pg.Client,
  actor: OrgSeed,
  victim: OrgSeed,
  tables: TableInfo[],
): Promise<string[]> {
  await setTenantContext(db, actor);
  const leaks: string[] = [];
  for (const table of tables) {
    leaks.push(...(await probeTable(db, table, catalog, actor, victim)));
  }
  return leaks;
}

beforeAll(async () => {
  owner = await connect(ownerUrl);
  await migrate(owner);
  await prepareAppRole(owner);
  catalog = await readCatalog(owner);
  await seedOrg(owner, catalog, orgA);
  await seedOrg(owner, catalog, orgB);
  app = await connectAsApp();
});

afterAll(async () => {
  await app?.end();
  if (owner) {
    for (const org of [orgA, orgB]) {
      await removeOrg(owner, org).catch(() => undefined);
    }
    await owner.end();
  }
});

describe("RLS coverage (catalog)", () => {
  test("runtime role cannot bypass RLS and owns no tables", async () => {
    const role = await app.query<{
      current_user: string;
      rolbypassrls: boolean;
      rolsuper: boolean;
      owned: number;
    }>(`
      SELECT current_user, r.rolbypassrls, r.rolsuper,
             (SELECT count(*)::int FROM pg_class c
              WHERE c.relnamespace = 'public'::regnamespace
                AND c.relowner = r.oid) AS owned
      FROM pg_roles r WHERE r.rolname = current_user
    `);
    const row = role.rows[0];
    assert.ok(row);
    assert.equal(row.current_user, appRole);
    assert.equal(row.rolbypassrls, false);
    assert.equal(row.rolsuper, false);
    assert.equal(row.owned, 0);
  });

  test("every tenant table has RLS enabled, forced, and a policy", () => {
    assert.ok(catalog.tenantTables.length > 0);
    const missing = [
      ...catalog.tenantTables.map((t) => t.name),
      "User",
      "Organization",
    ].filter((name) => {
      const state = catalog.rls.get(name);
      return !state?.enabled || !state.forced || state.policies === 0;
    });
    assert.deepEqual(
      missing,
      [],
      `Tables without forced RLS policies: ${missing.join(", ")}`,
    );
  });

  test("only reviewed system tables have an optional organizationId", () => {
    assert.deepEqual(catalog.nullableOrgTables, [...SYSTEM_TABLES]);
  });

  test("every tenant table was seeded for both organizations", () => {
    for (const table of catalog.tenantTables) {
      assert.ok((orgA.rows.get(table.name)?.length ?? 0) > 0, table.name);
      assert.ok((orgB.rows.get(table.name)?.length ?? 0) > 0, table.name);
    }
  });
});

describe("cross-tenant isolation through the runtime role", () => {
  test("org A cannot read, change or create org B rows", async () => {
    const leaks = await inTransaction(app, () =>
      probeAll(app, orgA, orgB, catalog.tenantTables),
    );
    assert.deepEqual(leaks, []);
  });

  test("org B cannot read, change or create org A rows", async () => {
    const leaks = await inTransaction(app, () =>
      probeAll(app, orgB, orgA, catalog.tenantTables),
    );
    assert.deepEqual(leaks, []);
  });

  test("each organization still sees its own rows", async () => {
    await inTransaction(app, async () => {
      await setTenantContext(app, orgA);
      for (const table of catalog.tenantTables) {
        const result = await app.query<{ count: string }>(
          `SELECT count(*) FROM "${table.name}" WHERE id = ANY($1::uuid[])`,
          [orgA.rows.get(table.name)],
        );
        assert.equal(
          Number(result.rows[0]?.count),
          orgA.rows.get(table.name)?.length,
          table.name,
        );
      }
    });
  });

  test("identity rows of another organization are invisible", async () => {
    await inTransaction(app, async () => {
      await setTenantContext(app, orgA);
      const users = await app.query(`SELECT 1 FROM "User" WHERE id = $1`, [
        orgB.userId,
      ]);
      const orgs = await app.query(
        `SELECT 1 FROM "Organization" WHERE id = $1`,
        [orgB.organizationId],
      );
      assert.equal(users.rowCount, 0);
      assert.equal(orgs.rowCount, 0);
    });
  });

  test("missing tenant context returns zero rows", async () => {
    await inTransaction(app, async () => {
      for (const name of [
        ...catalog.tenantTables.map((t) => t.name),
        "User",
        "Organization",
      ]) {
        const result = await app.query<{ count: string }>(
          `SELECT count(*) FROM "${name}"`,
        );
        assert.equal(Number(result.rows[0]?.count), 0, name);
      }
    });
  });
});

describe("negative check", () => {
  test("the probes report a leak when a table loses its policy", async () => {
    const table = catalog.tenantTables.find((t) => t.name === "CrmContact");
    assert.ok(table, "CrmContact is a tenant table");
    const leaks = await inTransaction(owner, async () => {
      await owner.query(`ALTER TABLE "CrmContact" DISABLE ROW LEVEL SECURITY`);
      await owner.query(`SET LOCAL ROLE "${appRole}"`);
      return probeAll(owner, orgA, orgB, [table]);
    });
    assert.ok(
      leaks.some((leak) => leak.startsWith("CrmContact: select")),
      `expected a CrmContact leak, got ${JSON.stringify(leaks)}`,
    );
  });
});
