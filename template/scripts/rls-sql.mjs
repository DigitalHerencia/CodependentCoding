/**
 * RLS SQL shipped by each owner: `prisma/rls/identity.sql` first, then each
 * manifest module's file that exists, in manifest order. db:init and test:rls
 * both apply exactly this text.
 */
import { existsSync, readFileSync } from "node:fs";
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
