import { readdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const artifact = readdirSync('.artifacts').find((name) =>
  name.endsWith('.tgz'),
);
if (!artifact) throw new Error('pnpm pack did not create an artifact.');
const result = spawnSync('tar', ['-tf', `.artifacts/${artifact}`], {
  encoding: 'utf8',
});
if (result.status !== 0) throw new Error(result.stderr);
const entries = result.stdout.split(/\r?\n/);
for (const required of [
  'package/dist/cli.mjs',
  'package/template/package.json',
  'package/template/.env.example',
  'package/template/prisma/schema.prisma',
]) {
  if (!entries.includes(required))
    throw new Error(`Packed artifact is missing ${required}`);
}
for (const forbidden of [
  '.env.local',
  '.env.development',
  '.env.production',
  '.clerk/',
  'node_modules/',
  '.git/',
  '.tsbuildinfo',
]) {
  if (entries.some((entry) => entry.includes(forbidden)))
    throw new Error(
      `Packed artifact contains forbidden path fragment: ${forbidden}`,
    );
}
console.log(`Pack contains ${entries.filter(Boolean).length} safe entries.`);
