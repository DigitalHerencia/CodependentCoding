#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(process.argv[2]||process.cwd());
const required=['package.json','app','features','components','lib'];
const recommended=['components/blocks','components/ui','lib/fetchers','lib/actions','lib/db','lib/auth','lib/authz'];
let fail=0;
for(const p of required){ const full=path.join(root,p); if(!fs.existsSync(full)){ console.error(`FAIL missing required Arrangement path: ${p}`); fail++; } }
for(const p of recommended){ const full=path.join(root,p); if(!fs.existsSync(full)) console.warn(`WARN expected canonical path not present (may be pruned/variant): ${p}`); }
const pkg=path.join(root,'package.json');
if(fs.existsSync(pkg)){
  try { const data=JSON.parse(fs.readFileSync(pkg,'utf8')); if(!data.scripts) console.warn('WARN package.json has no scripts map.'); }
  catch(e){ console.error(`FAIL invalid package.json JSON: ${e.message}`); fail++; }
}
for(const p of ['hipsterstack.json','.hipsterstack/manifest.json']) if(fs.existsSync(path.join(root,p))) console.log(`INFO generation provenance present: ${p}`);
for(const p of ['LoadedPlugin','.awesome','.notion']) if(fs.existsSync(path.join(root,p))){ console.error(`FAIL generator/research debris should not be copied into an Arrangement: ${p}`); fail++; }
if(!fail) console.log('Loaded Vibes Arrangement smoke: PASS.');
process.exitCode=fail?1:0;
