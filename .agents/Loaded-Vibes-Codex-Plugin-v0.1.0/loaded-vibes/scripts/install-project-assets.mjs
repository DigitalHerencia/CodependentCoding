#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url));
const source=path.resolve(here,'../assets/arrangement-project');
const args=process.argv.slice(2); const idx=args.indexOf('--target');
if(idx<0||!args[idx+1]){ console.error('Usage: node install-project-assets.mjs --target <repo> [--dry-run] [--force]'); process.exit(2); }
const target=path.resolve(args[idx+1]); const dry=args.includes('--dry-run'); const force=args.includes('--force');
if(!fs.existsSync(target)){ console.error(`Target does not exist: ${target}`); process.exit(2); }
const items=[];
function walk(dir){ for(const ent of fs.readdirSync(dir,{withFileTypes:true})){ const p=path.join(dir,ent.name); if(ent.isDirectory()) walk(p); else items.push(p); } }
walk(source);
let blocked=0;
for(const src of items){
  const rel=path.relative(source,src); let dest=path.join(target,rel);
  // config is intentionally an example, never auto-promoted over existing config.
  const exists=fs.existsSync(dest);
  const action=exists&&!force?'SKIP':'COPY';
  console.log(`${dry?'PLAN':action} ${rel}${exists&&!force?' (exists; use --force to replace)':''}`);
  if(dry||action==='SKIP'){ if(action==='SKIP') blocked++; continue; }
  fs.mkdirSync(path.dirname(dest),{recursive:true}); fs.copyFileSync(src,dest);
}
if(!dry) console.log(`Loaded Vibes project assets installed. Skipped existing files: ${blocked}.`);
