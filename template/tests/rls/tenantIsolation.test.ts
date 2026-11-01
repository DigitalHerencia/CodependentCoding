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
  RUNTIME_ROLE,
  seedOrg,
  setLocalRole,
  setTenantContext,
  SYSTEM_ROLE,
  SYSTEM_TABLES,
  type TableInfo,
} from "./rlsHarness";

/** Plan nodes that scan an index with a condition on organizationId. */
function organizationIndexScans(plan: unknown): string[] {
  const found: string[] = [];
  const visit = (node: Record<string, unknown>) => {
    const cond = node["Index Cond"];
    if (typeof cond === "string" && cond.includes('"organizationId"')) {
      found.push(String(node["Index Name"]));
    }
    for (const child of (node.Plans as Record<string, unknown>[]) ?? []) {
      visit(child);
    }
  };
  visit((plan as { Plan: Record<string, unknown> }[])[0]?.Plan ?? {});
  return found;
}

/** EXPLAIN a list query that relies on RLS alone (no application predicate). */
async function explainTenantList(db: pg.Client, org: OrgSeed) {
  await setTenantContext(db, org);
  // Tiny test tables would always get a sequential scan; forbid it so the
  // plan shows whether the policy predicate can use the index at all.
  await db.query("SET LOCAL enable_seqscan = off");
  const { rows } = await db.query<{ "QUERY PLAN": unknown }>(
    `EXPLAIN (FORMAT JSON) SELECT id FROM "AuditEvent" ORDER BY "createdAt" DESC LIMIT 20`,
  );
  return organizationIndexScans(rows[0]?.["QUERY PLAN"]);
}

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
  await migrate();
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
      runtime: boolean;
      neon_superuser: boolean;
    }>(`
      SELECT current_user, r.rolbypassrls, r.rolsuper,
             (SELECT count(*)::int FROM pg_class c
              WHERE c.relnamespace = 'public'::regnamespace
                AND c.relowner = r.oid) AS owned,
             pg_has_role(r.oid, '${RUNTIME_ROLE}', 'MEMBER') AS runtime,
             EXISTS (SELECT FROM pg_roles s WHERE s.rolname = 'neon_superuser'
                     AND pg_has_role(r.oid, s.oid, 'MEMBER')) AS neon_superuser
      FROM pg_roles r WHERE r.rolname = current_user
    `);
    const row = role.rows[0];
    assert.ok(row);
    assert.equal(row.current_user, appRole);
    assert.equal(row.runtime, true, `${appRole} must be ${RUNTIME_ROLE}`);
    assert.equal(row.rolbypassrls, false);
    assert.equal(row.rolsuper, false);
    assert.equal(row.neon_superuser, false);
    assert.equal(row.owned, 0);
  });

  test("the migrations created both roles without BYPASSRLS", async () => {
    const { rows } = await owner.query<{
      rolname: string;
      rolbypassrls: boolean;
      rolsuper: boolean;
      rolcanlogin: boolean;
    }>(
      `SELECT rolname, rolbypassrls, rolsuper, rolcanlogin FROM pg_roles
       WHERE rolname = ANY($1) ORDER BY rolname`,
      [[RUNTIME_ROLE, SYSTEM_ROLE]],
    );
    assert.deepEqual(rows, [
      {
        rolname: RUNTIME_ROLE,
        rolbypassrls: false,
        rolsuper: false,
        rolcanlogin: true,
      },
      {
        rolname: SYSTEM_ROLE,
        rolbypassrls: false,
        rolsuper: false,
        rolcanlogin: true,
      },
    ]);
  });

  test("every table except Prisma's ledger has RLS enabled and forced", () => {
    const open = [...catalog.rls]
      .filter(([name]) => name !== "_prisma_migrations")
      .filter(([, state]) => !state.enabled || !state.forced)
      .map(([name]) => name);
    assert.deepEqual(open, []);
    for (const name of SYSTEM_TABLES) {
      assert.ok((catalog.rls.get(name)?.policies ?? 0) > 0, name);
    }
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

  test("an invitee sees invitations to their email but cannot write them", async () => {
    const email = `invitee-${orgA.clerkUserId}@example.test`;
    await inTransaction(owner, async () => {
      await setLocalRole(owner);
      await setTenantContext(owner, orgA);
      await owner.query(`UPDATE "User" SET email = $1 WHERE id = $2`, [
        email,
        orgA.userId,
      ]);
      await setTenantContext(owner, orgB);
      const insert = `INSERT INTO "Invitation" (id, "organizationId", email, "tokenHash", "expiresAt", "updatedAt")
        VALUES (gen_random_uuid(), $1, $2, gen_random_uuid()::text, now() + interval '1 day', now())
        RETURNING id`;
      const mine = await owner.query<{ id: string }>(insert, [
        orgB.organizationId,
        email.toUpperCase(),
      ]);
      await owner.query(insert, [
        orgB.organizationId,
        "someone-else@example.test",
      ]);

      await owner.query(
        `SELECT set_config('app.organization_id', '', true),
                set_config('app.clerk_user_id', $1, true)`,
        [orgA.clerkUserId],
      );
      const visible = await owner.query<{ id: string }>(
        `SELECT id FROM "Invitation" WHERE "organizationId" = $1`,
        [orgB.organizationId],
      );
      assert.deepEqual(
        visible.rows.map((row) => row.id),
        [mine.rows[0]?.id],
      );
      await assert.rejects(
        owner.query(
          `UPDATE "Invitation" SET status = 'ACCEPTED' WHERE id = $1`,
          [mine.rows[0]?.id],
        ),
        /row-level security/,
      );
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

describe("policy shape", () => {
  test("a tenant list query under RLS uses the (organizationId, …) index", async () => {
    const scans = await inTransaction(app, () => explainTenantList(app, orgA));
    assert.ok(
      scans.some((name) => name.startsWith("AuditEvent_organizationId_")),
      `expected an organizationId index condition, got ${JSON.stringify(scans)}`,
    );
  });

  test("the audit trail is insert and select only for the runtime", async () => {
    await inTransaction(app, async () => {
      await setTenantContext(app, orgA);
      const { rows } = await app.query<{ id: string }>(
        `INSERT INTO "AuditEvent" (id, "organizationId", action, "resourceType")
         VALUES (gen_random_uuid(), $1, 'rls.test', 'Test') RETURNING id`,
        [orgA.organizationId],
      );
      const id = rows[0]?.id;
      const read = await app.query(`SELECT 1 FROM "AuditEvent" WHERE id = $1`, [
        id,
      ]);
      assert.equal(read.rowCount, 1);
      await app.query("SAVEPOINT audit");
      await assert.rejects(
        app.query(`UPDATE "AuditEvent" SET action = 'x' WHERE id = $1`, [id]),
        /permission denied/,
      );
      await app.query("ROLLBACK TO SAVEPOINT audit");
      await assert.rejects(
        app.query(`DELETE FROM "AuditEvent" WHERE id = $1`, [id]),
        /permission denied/,
      );
    });
  });

  test("system tables: app_system reaches them, not tenant tables", async () => {
    await inTransaction(owner, async () => {
      await setLocalRole(owner, SYSTEM_ROLE);
      const key = `rls-${orgA.clerkUserId}`;
      await owner.query(
        `INSERT INTO "IdempotencyRecord" (id, scope, key, "updatedAt")
         VALUES (gen_random_uuid(), 'rls.test', $1, now())`,
        [key],
      );
      const visible = await owner.query(
        `SELECT 1 FROM "IdempotencyRecord" WHERE key = $1`,
        [key],
      );
      assert.equal(visible.rowCount, 1);
      await owner.query("SAVEPOINT tenant");
      await assert.rejects(
        owner.query(`SELECT 1 FROM "CrmContact" LIMIT 1`),
        /permission denied/,
      );
      await owner.query("ROLLBACK TO SAVEPOINT tenant");

      // The runtime sees no system rows outside a tenant, even in context.
      await owner.query(`SET LOCAL ROLE "${RUNTIME_ROLE}"`);
      await setTenantContext(owner, orgA);
      const hidden = await owner.query(
        `SELECT 1 FROM "IdempotencyRecord" WHERE key = $1`,
        [key],
      );
      assert.equal(hidden.rowCount, 0);
    });
  });
});

describe("negative check", () => {
  test("a policy that casts the column cannot use the index", async () => {
    const scans = await inTransaction(owner, async () => {
      // The pre-CC-069 shape (ledger D-3).
      await owner.query(`DROP POLICY "audit_read" ON "AuditEvent"`);
      await owner.query(`CREATE POLICY "audit_read" ON "AuditEvent"
        FOR SELECT TO ${RUNTIME_ROLE}
        USING ("organizationId"::text = NULLIF(current_setting('app.organization_id', true), ''))`);
      await setLocalRole(owner);
      return explainTenantList(owner, orgA);
    });
    assert.deepEqual(scans, []);
  });

  test("the probes report a leak when a table loses its policy", async () => {
    // Any tenant table will do; every app has one, whatever its modules.
    const table = catalog.tenantTables[0];
    assert.ok(table, "the app has a tenant table");
    const leaks = await inTransaction(owner, async () => {
      await owner.query(
        `ALTER TABLE "${table.name}" DISABLE ROW LEVEL SECURITY`,
      );
      await owner.query(`SET LOCAL ROLE "${appRole}"`);
      return probeAll(owner, orgA, orgB, [table]);
    });
    assert.ok(
      leaks.some((leak) => leak.startsWith(`${table.name}: select`)),
      `expected a ${table.name} leak, got ${JSON.stringify(leaks)}`,
    );
  });
});
