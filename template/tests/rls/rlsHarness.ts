import { execFileSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

import { config } from "dotenv";
import pg from "pg";

config({ path: ".env.local", quiet: true });

// Tables that carry an optional organizationId are system records written before
// a tenant is known (webhook receipts, idempotency keys). DEC-032.
export const SYSTEM_TABLES = ["IdempotencyRecord", "WebhookEvent"] as const;

const DEFAULT_APP_ROLE = "app_user";

export interface Column {
  name: string;
  udt: string;
  dataType: string;
  nullable: boolean;
  hasDefault: boolean;
  maxLength: number | null;
}

export interface ForeignKey {
  column: string;
  references: string;
}

export interface TableInfo {
  name: string;
  columns: Column[];
  foreignKeys: ForeignKey[];
}

export interface OrgSeed {
  organizationId: string;
  userId: string;
  clerkUserId: string;
  rows: Map<string, string[]>;
}

export interface Catalog {
  tables: Map<string, TableInfo>;
  tenantTables: TableInfo[];
  nullableOrgTables: string[];
  enums: Map<string, string>;
  rls: Map<string, { enabled: boolean; forced: boolean; policies: number }>;
}

function requiredUrl(): string {
  const url = process.env.DATABASE_URL_TEST?.trim();
  if (!url) {
    throw new Error(
      "DATABASE_URL_TEST is required for test:rls (owner connection to a Neon test branch or local Postgres).",
    );
  }
  return url;
}

export const ownerUrl = requiredUrl();
const appUrl = process.env.DATABASE_URL_TEST_APP?.trim() || undefined;
export const appRole = appUrl
  ? decodeURIComponent(new URL(appUrl).username)
  : DEFAULT_APP_ROLE;

const quote = (identifier: string) => `"${identifier.replaceAll('"', '""')}"`;

export async function connect(url: string): Promise<pg.Client> {
  const client = new pg.Client({ connectionString: url });
  await client.connect();
  return client;
}

/** Migrate as the owner, then apply prisma/rls/*.sql when present. */
export async function migrate(owner: pg.Client): Promise<void> {
  try {
    execFileSync("pnpm", ["exec", "prisma", "migrate", "deploy"], {
      env: {
        ...process.env,
        DATABASE_URL: ownerUrl,
        DIRECT_DATABASE_URL: ownerUrl,
      },
      stdio: "pipe",
      shell: process.platform === "win32",
    });
  } catch (error) {
    const output = (error as { stdout?: Buffer }).stdout?.toString() ?? "";
    throw new Error(
      `prisma migrate deploy failed:\n${output.replaceAll(ownerUrl, "<DATABASE_URL_TEST>")}`,
    );
  }
  const rlsDir = path.join(process.cwd(), "prisma", "rls");
  if (!existsSync(rlsDir)) return;
  for (const file of readdirSync(rlsDir).filter((f) => f.endsWith(".sql"))) {
    await owner.query(readFileSync(path.join(rlsDir, file), "utf8"));
  }
}

/** Ensure the runtime role exists without BYPASSRLS and can use every table. */
export async function prepareAppRole(owner: pg.Client): Promise<void> {
  if (!appUrl) {
    await owner.query(`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = '${DEFAULT_APP_ROLE}') THEN
          CREATE ROLE ${DEFAULT_APP_ROLE} NOLOGIN NOBYPASSRLS;
        END IF;
      END $$;
    `);
  }
  const role = quote(appRole);
  await owner.query(`GRANT ${role} TO CURRENT_USER`);
  await owner.query(`GRANT USAGE ON SCHEMA public TO ${role}`);
  await owner.query(
    `GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO ${role}`,
  );
}

/** A session that runs as the runtime role: its own login, or SET ROLE from the owner. */
export async function connectAsApp(): Promise<pg.Client> {
  if (appUrl) return connect(appUrl);
  const client = await connect(ownerUrl);
  await client.query(`SET ROLE ${quote(appRole)}`);
  return client;
}

export async function readCatalog(db: pg.Client): Promise<Catalog> {
  const columns = await db.query<{
    table_name: string;
    column_name: string;
    udt_name: string;
    data_type: string;
    is_nullable: "YES" | "NO";
    column_default: string | null;
    character_maximum_length: number | null;
  }>(`
    SELECT table_name, column_name, udt_name, data_type, is_nullable,
           column_default, character_maximum_length
    FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name <> '_prisma_migrations'
    ORDER BY table_name, ordinal_position
  `);
  const fks = await db.query<{
    table_name: string;
    column_name: string;
    ref_table: string;
  }>(`
    SELECT c.conrelid::regclass::text AS table_name,
           a.attname AS column_name,
           c.confrelid::regclass::text AS ref_table
    FROM pg_constraint c
    JOIN pg_attribute a ON a.attrelid = c.conrelid AND a.attnum = c.conkey[1]
    WHERE c.contype = 'f' AND c.connamespace = 'public'::regnamespace
  `);
  const enums = await db.query<{ typname: string; label: string }>(`
    SELECT DISTINCT ON (t.typname) t.typname, e.enumlabel AS label
    FROM pg_type t JOIN pg_enum e ON e.enumtypid = t.oid
    ORDER BY t.typname, e.enumsortorder
  `);
  const rls = await db.query<{
    relname: string;
    relrowsecurity: boolean;
    relforcerowsecurity: boolean;
    policies: number;
  }>(`
    SELECT c.relname, c.relrowsecurity, c.relforcerowsecurity,
           (SELECT count(*)::int FROM pg_policy p WHERE p.polrelid = c.oid) AS policies
    FROM pg_class c
    WHERE c.relnamespace = 'public'::regnamespace AND c.relkind = 'r'
  `);

  const tables = new Map<string, TableInfo>();
  for (const row of columns.rows) {
    const table = tables.get(row.table_name) ?? {
      name: row.table_name,
      columns: [],
      foreignKeys: [],
    };
    table.columns.push({
      name: row.column_name,
      udt: row.udt_name,
      dataType: row.data_type,
      nullable: row.is_nullable === "YES",
      hasDefault: row.column_default !== null,
      maxLength: row.character_maximum_length,
    });
    tables.set(row.table_name, table);
  }
  const unquote = (name: string) => name.replace(/^"(.*)"$/, "$1");
  for (const row of fks.rows) {
    tables.get(unquote(row.table_name))?.foreignKeys.push({
      column: row.column_name,
      references: unquote(row.ref_table),
    });
  }

  const tenantTables: TableInfo[] = [];
  const nullableOrgTables: string[] = [];
  for (const table of tables.values()) {
    const org = table.columns.find((c) => c.name === "organizationId");
    if (!org) continue;
    if (org.nullable) nullableOrgTables.push(table.name);
    else tenantTables.push(table);
  }

  return {
    tables,
    tenantTables: sortByDependencies(tenantTables),
    nullableOrgTables: nullableOrgTables.sort(),
    enums: new Map(enums.rows.map((r) => [r.typname, r.label])),
    rls: new Map(
      rls.rows.map((r) => [
        r.relname,
        {
          enabled: r.relrowsecurity,
          forced: r.relforcerowsecurity,
          policies: r.policies,
        },
      ]),
    ),
  };
}

function requiredForeignKeys(table: TableInfo): ForeignKey[] {
  return table.foreignKeys.filter(
    (fk) => !table.columns.find((c) => c.name === fk.column)?.nullable,
  );
}

function sortByDependencies(tables: TableInfo[]): TableInfo[] {
  const names = new Set(tables.map((t) => t.name));
  const sorted: TableInfo[] = [];
  const done = new Set<string>();
  const visit = (table: TableInfo, trail: Set<string>) => {
    if (done.has(table.name)) return;
    if (trail.has(table.name)) {
      throw new Error(`Required foreign keys form a cycle at ${table.name}`);
    }
    trail.add(table.name);
    for (const fk of requiredForeignKeys(table)) {
      const parent = tables.find((t) => t.name === fk.references);
      if (parent && parent.name !== table.name && names.has(parent.name)) {
        visit(parent, trail);
      }
    }
    done.add(table.name);
    sorted.push(table);
  };
  for (const table of tables) visit(table, new Set());
  return sorted;
}

function scalarValue(column: Column, catalog: Catalog, index: number): unknown {
  if (column.dataType === "USER-DEFINED") {
    const label = catalog.enums.get(column.udt);
    if (!label) throw new Error(`No enum labels for ${column.udt}`);
    return label;
  }
  if (column.dataType === "ARRAY") return [];
  switch (column.udt) {
    case "uuid":
      return randomUUID();
    case "int2":
    case "int4":
    case "int8":
    case "numeric":
      return index + 1;
    case "bool":
      return false;
    case "date":
    case "timestamp":
    case "timestamptz":
      return new Date();
    case "json":
    case "jsonb":
      return {};
    default: {
      const text = `rls${index}${randomUUID().replaceAll("-", "")}`;
      return column.maxLength ? text.slice(0, column.maxLength) : text;
    }
  }
}

/** Build one row for a tenant table, pointing required references at `org`'s rows. */
export function buildRow(
  table: TableInfo,
  catalog: Catalog,
  org: OrgSeed,
  index: number,
): Record<string, unknown> {
  const row: Record<string, unknown> = {};
  const seenParents = new Map<string, number>();
  for (const column of table.columns) {
    if (column.name === "id") {
      row.id = randomUUID();
      continue;
    }
    if (column.name === "organizationId") {
      row.organizationId = org.organizationId;
      continue;
    }
    const fk = table.foreignKeys.find((f) => f.column === column.name);
    if (fk) {
      if (column.nullable) continue;
      if (fk.references === "User") {
        row[column.name] = org.userId;
        continue;
      }
      const parents = org.rows.get(fk.references) ?? [];
      if (parents.length === 0) {
        throw new Error(
          `${table.name}.${column.name}: no ${fk.references} rows`,
        );
      }
      const offset = seenParents.get(fk.references) ?? 0;
      seenParents.set(fk.references, offset + 1);
      row[column.name] = parents[(index + offset) % parents.length];
      continue;
    }
    if (column.nullable || column.hasDefault) continue;
    row[column.name] = scalarValue(column, catalog, index);
  }
  return row;
}

export async function insertRow(
  db: pg.Client,
  table: string,
  row: Record<string, unknown>,
): Promise<void> {
  const keys = Object.keys(row);
  const values = keys.map((k) => {
    const value = row[k];
    return value !== null &&
      typeof value === "object" &&
      !(value instanceof Date) &&
      !Array.isArray(value)
      ? JSON.stringify(value)
      : value;
  });
  await db.query(
    `INSERT INTO ${quote(table)} (${keys.map(quote).join(", ")}) VALUES (${keys
      .map((_, i) => `$${i + 1}`)
      .join(", ")})`,
    values,
  );
}

export async function setTenantContext(db: pg.Client, org: OrgSeed) {
  await db.query(
    `SELECT set_config('app.organization_id', $1, true),
            set_config('app.clerk_user_id', $2, true)`,
    [org.organizationId, org.clerkUserId],
  );
}

export function newOrg(): OrgSeed {
  const run = randomUUID().slice(0, 8);
  return {
    organizationId: randomUUID(),
    userId: randomUUID(),
    clerkUserId: `user_rls_${run}`,
    rows: new Map(),
  };
}

/** Seed one org: identity rows, then up to two rows in every tenant table. */
export async function seedOrg(
  owner: pg.Client,
  catalog: Catalog,
  org: OrgSeed,
): Promise<void> {
  await owner.query("BEGIN");
  try {
    await setTenantContext(owner, org);
    for (const [name, base] of [
      ["User", { id: org.userId, clerkUserId: org.clerkUserId }],
      ["Organization", { id: org.organizationId }],
    ] as const) {
      const table = catalog.tables.get(name);
      if (!table) throw new Error(`Missing ${name} table`);
      const row: Record<string, unknown> = { ...base };
      for (const column of table.columns) {
        if (column.name in row || column.nullable || column.hasDefault)
          continue;
        row[column.name] = scalarValue(column, catalog, 0);
      }
      await insertRow(owner, name, row);
    }
    for (const table of catalog.tenantTables) {
      const ids: string[] = [];
      for (const index of [0, 1]) {
        const row = buildRow(table, catalog, org, index);
        await owner.query("SAVEPOINT seed_row");
        try {
          await insertRow(owner, table.name, row);
          ids.push(row.id as string);
          await owner.query("RELEASE SAVEPOINT seed_row");
        } catch (error) {
          await owner.query("ROLLBACK TO SAVEPOINT seed_row");
          // A second row may hit a per-org unique constraint; one row is enough.
          if (index === 0 || (error as { code?: string }).code !== "23505") {
            throw new Error(
              `Seeding ${table.name} failed: ${(error as Error).message}`,
            );
          }
        }
      }
      org.rows.set(table.name, ids);
    }
    await owner.query("COMMIT");
  } catch (error) {
    await owner.query("ROLLBACK");
    throw error;
  }
}

export async function removeOrg(owner: pg.Client, org: OrgSeed): Promise<void> {
  await owner.query("BEGIN");
  try {
    await setTenantContext(owner, org);
    // Tenant rows cascade from Organization; AiGeneration/AiUsageLedger restrict User.
    await owner.query(`DELETE FROM "Organization" WHERE id = $1`, [
      org.organizationId,
    ]);
    await owner.query(`DELETE FROM "User" WHERE id = $1`, [org.userId]);
    await owner.query("COMMIT");
  } catch (error) {
    await owner.query("ROLLBACK");
    throw error;
  }
}

/**
 * Cross-tenant probes for one table, run inside the caller's transaction as the
 * runtime role with `actor`'s context. Returns a description of every leak.
 */
export async function probeTable(
  db: pg.Client,
  table: TableInfo,
  catalog: Catalog,
  actor: OrgSeed,
  victim: OrgSeed,
): Promise<string[]> {
  const t = quote(table.name);
  const victimIds = victim.rows.get(table.name) ?? [];
  const leaks: string[] = [];
  const report = (counts: Record<string, string | number>) => {
    for (const [label, count] of Object.entries(counts)) {
      if (Number(count) > 0) {
        leaks.push(`${table.name}: ${label} reached ${count} row(s)`);
      }
    }
  };
  // One round trip per probe group keeps the suite fast on a remote database.
  // Writes run inside the caller's transaction, which always rolls back.
  const params = [actor.organizationId, victim.organizationId, victimIds];
  const reads = await db.query<Record<string, string>>(
    `SELECT
       (SELECT count(*) FROM ${t} WHERE "organizationId" <> $1) AS "select without app predicate",
       (SELECT count(*) FROM ${t} WHERE id = ANY($3::uuid[])) AS "select by id",
       (SELECT count(*) FROM ${t} WHERE "organizationId" = $2) AS "select with app predicate"`,
    params,
  );
  report(reads.rows[0] ?? {});
  const updates = await db.query<Record<string, string>>(
    `WITH by_id AS (
       UPDATE ${t} SET id = id WHERE id = ANY($2::uuid[]) RETURNING 1
     ), by_org AS (
       UPDATE ${t} SET id = id WHERE "organizationId" = $1 RETURNING 1
     )
     SELECT (SELECT count(*) FROM by_id) AS "update by id",
            (SELECT count(*) FROM by_org) AS "update with app predicate"`,
    [victim.organizationId, victimIds],
  );
  report(updates.rows[0] ?? {});
  const deletes = await db.query<Record<string, string>>(
    `WITH by_id AS (
       DELETE FROM ${t} WHERE id = ANY($2::uuid[]) RETURNING 1
     ), by_org AS (
       DELETE FROM ${t} WHERE "organizationId" = $1 RETURNING 1
     )
     SELECT (SELECT count(*) FROM by_id) AS "delete by id",
            (SELECT count(*) FROM by_org) AS "delete with app predicate"`,
    [victim.organizationId, victimIds],
  );
  report(deletes.rows[0] ?? {});

  await db.query("SAVEPOINT probe");
  try {
    await insertRow(db, table.name, buildRow(table, catalog, victim, 0));
    leaks.push(`${table.name}: insert into another organization succeeded`);
  } catch (error) {
    const code = (error as { code?: string }).code;
    // 42501 = RLS WITH CHECK violation. Anything else hides whether RLS held.
    if (code !== "42501") {
      leaks.push(
        `${table.name}: cross-tenant insert failed with ${code ?? "unknown"} instead of an RLS violation`,
      );
    }
  } finally {
    await db.query("ROLLBACK TO SAVEPOINT probe");
  }
  return leaks;
}
