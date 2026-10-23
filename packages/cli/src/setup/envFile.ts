import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const LINE = /^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/;

function unquote(raw: string): string {
  const value = raw.trim();
  const quote = value[0];
  if ((quote === '"' || quote === "'") && value.endsWith(quote)) {
    return value.slice(1, -1);
  }
  return value.replace(/\s+#.*$/, "");
}

/** Reads KEY=value pairs; blank values count as unset, like lib/env. */
export function parseEnv(text: string): Map<string, string> {
  const values = new Map<string, string>();
  for (const line of text.split(/\r?\n/)) {
    const match = LINE.exec(line);
    if (!match) continue;
    const value = unquote(match[2] ?? "");
    if (value) values.set(match[1] as string, value);
  }
  return values;
}

/** Replaces each key's line in place, or appends it; other lines are kept. */
export function upsertEnv(
  text: string,
  values: Readonly<Record<string, string>>,
): string {
  const pending = new Map(Object.entries(values));
  const lines = text.split(/\r?\n/).map((line) => {
    const key = LINE.exec(line)?.[1];
    if (!key || !pending.has(key)) return line;
    const value = pending.get(key) as string;
    pending.delete(key);
    return `${key}="${value}"`;
  });
  while (lines.length > 0 && lines.at(-1) === "") lines.pop();
  for (const [key, value] of pending) lines.push(`${key}="${value}"`);
  return `${lines.join("\n")}\n`;
}

export const ENV_LOCAL = ".env.local";

export function readEnvLocal(appDir: string): Map<string, string> {
  const file = path.join(appDir, ENV_LOCAL);
  return existsSync(file) ? parseEnv(readFileSync(file, "utf8")) : new Map();
}

/** Writes into .env.local (git-ignored), seeding it from .env.example. */
export function writeEnvLocal(
  appDir: string,
  values: Readonly<Record<string, string>>,
): void {
  const file = path.join(appDir, ENV_LOCAL);
  const example = path.join(appDir, ".env.example");
  const base = existsSync(file)
    ? readFileSync(file, "utf8")
    : existsSync(example)
      ? readFileSync(example, "utf8")
      : "";
  writeFileSync(file, upsertEnv(base, values), { mode: 0o600 });
}
