#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url)); const validator=path.resolve(here,'../validators/architecture.mjs');
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'loaded-vibes-'));
for(const d of ['app/x','features/x','components/blocks','components/ui','lib/fetchers','lib/actions','lib/db/transactions','lib/workflows/x']) fs.mkdirSync(path.join(temp,d),{recursive:true});
fs.writeFileSync(path.join(temp,'package.json'),'{}');
fs.writeFileSync(path.join(temp,'components/blocks/good.tsx'),"import { Button } from '@/components/ui/button'; export const Good=()=>Button;\n");
let r=spawnSync(process.execPath,[validator,temp],{encoding:'utf8'}); if(r.status!==0) throw new Error(`clean fixture failed: ${r.stdout}${r.stderr}`);
fs.writeFileSync(path.join(temp,'lib/fetchers/bad.ts'),"export async function x(db){ return db.user.update({where:{id:1},data:{}}); }\n");
r=spawnSync(process.execPath,[validator,temp],{encoding:'utf8'}); if(r.status===0||!r.stdout.includes('fetcher-read-only')) throw new Error(`bad fixture did not fail as expected: ${r.stdout}${r.stderr}`);
fs.rmSync(temp,{recursive:true,force:true}); console.log('Loaded Vibes validator fixture tests: PASS.');
