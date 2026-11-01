/**
 * RLS SQL shipped by each owner: `prisma/rls/identity.sql` first (it also
 * creates the app_runtime and app_system roles), then each manifest module's
 * file that exists, in manifest order.
 *
 * The files are the readable source; the database only ever receives them as a
 * migration (CC-MIG-001): `pnpm db:rls` writes the joined text into a new
 * `prisma/migrations/<ts>_rls/migration.sql`, and `pnpm db:rls:check` compares
 * the live `pg_policies` with what the source produces.
 */
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";

/** @param {string} root template root */
export function rlsFiles(root) {
  const manifest = JSON.parse(
    readFileSync(join(root, "hipster.modules.json"), "utf8"),
  );
  return ["identity", ...manifest.modules.map(({ id }) => id)]
    .map((owner) => join(root, "prisma", "rls", `${owner}.sql`))
    .filter((file) => existsSync(file));
}

/** @param {string} root template root */
export function rlsSql(root) {
  return rlsFiles(root)
    .map((file) => readFileSync(file, "utf8"))
    .join("\n");
}

/** @param {string} root template root */
function migrationNames(root) {
  const dir = join(root, "prisma", "migrations");
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

/**
 * Writes the current RLS source into a new `<timestamp>_rls` migration, unless
 * the newest `*_rls` migration already holds exactly that text.
 * @param {string} root template root
 * @param {Date} [now]
 * @returns {string | null} the new migration's directory name, or null when unchanged
 */
export function writeRlsMigration(root, now = new Date()) {
  const sql = rlsSql(root);
  const latest = migrationNames(root)
    .filter((name) => name.endsWith("_rls"))
    .at(-1);
  const file = (name) =>
    join(root, "prisma", "migrations", name, "migration.sql");
  if (latest && readFileSync(file(latest), "utf8") === sql) return null;
  const stamp = now.toISOString().replace(/[-:T]/g, "").replace(/\..*$/, "");
  const name = `${stamp}_rls`;
  mkdirSync(join(root, "prisma", "migrations", name), { recursive: true });
  writeFileSync(file(name), sql);
  return name;
}

const SNAPSHOT = `
  SELECT 'policy' AS kind,
         format('%s.%s %s %s %s', tablename, policyname, permissive, cmd, roles::text) AS key,
         concat_ws(' | ', 'USING ' || qual, 'WITH CHECK ' || with_check) AS value
  FROM pg_policies WHERE schemaname = 'public'
  UNION ALL
  SELECT 'rls', c.relname,
         format('enabled=%s forced=%s', c.relrowsecurity, c.relforcerowsecurity)
  FROM pg_class c
  WHERE c.relnamespace = 'public'::regnamespace AND c.relkind = 'r'
  UNION ALL
  SELECT 'grant', format('%s %s', table_name, grantee),
         string_agg(privilege_type, ',' ORDER BY privilege_type)
  FROM information_schema.role_table_grants
  WHERE table_schema = 'public' AND grantee IN ('app_runtime', 'app_system')
  GROUP BY table_name, grantee
  ORDER BY 1, 2`;

const RESET = `
  DO $$
  DECLARE
    p record;
  BEGIN
    FOR p IN SELECT tablename, policyname FROM pg_policies WHERE schemaname = 'public' LOOP
      EXECUTE format('DROP POLICY %I ON %I', p.policyname, p.tablename);
    END LOOP;
    FOR p IN SELECT relname AS tablename FROM pg_class
             WHERE relnamespace = 'public'::regnamespace AND relkind = 'r' LOOP
      EXECUTE format('ALTER TABLE %I NO FORCE ROW LEVEL SECURITY', p.tablename);
      EXECUTE format('ALTER TABLE %I DISABLE ROW LEVEL SECURITY', p.tablename);
    END LOOP;
    IF EXISTS (SELECT FROM pg_roles WHERE rolname = 'app_runtime') THEN
      REVOKE ALL ON ALL TABLES IN SCHEMA public FROM app_runtime;
    END IF;
    IF EXISTS (SELECT FROM pg_roles WHERE rolname = 'app_system') THEN
      REVOKE ALL ON ALL TABLES IN SCHEMA public FROM app_system;
    END IF;
  END $$;`;

/**
 * Compares the live policies, RLS flags and role grants with what the source
 * produces from scratch. Runs as the owner in one transaction that always
 * rolls back: drop every policy, revoke the roles' grants, apply the source,
 * snapshot. Returns one line per difference (empty when the database matches).
 * @param {{ query: (sql: string) => Promise<{ rows: { kind: string, key: string, value: string }[] }> }} client
 * @param {string} root template root
 * @returns {Promise<string[]>}
 */
export async function rlsDrift(client, root) {
  const toMap = ({ rows }) =>
    new Map(rows.map((row) => [`${row.kind} ${row.key}`, row.value]));
  const live = toMap(await client.query(SNAPSHOT));
  await client.query("BEGIN");
  let source;
  try {
    await client.query(RESET);
    await client.query(rlsSql(root));
    source = toMap(await client.query(SNAPSHOT));
  } finally {
    await client.query("ROLLBACK");
  }
  const drift = [];
  for (const [key, value] of source) {
    if (!live.has(key)) drift.push(`missing   ${key}: ${value}`);
    else if (live.get(key) !== value)
      drift.push(
        `differs   ${key}\n  live:   ${live.get(key)}\n  source: ${value}`,
      );
  }
  for (const [key, value] of live) {
    if (!source.has(key)) drift.push(`unexpected ${key}: ${value}`);
  }
  return drift;
}
