#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
const root=path.resolve(process.argv[2]||process.cwd());
const exists=p=>fs.existsSync(path.join(root,p));
let pkg={}; try{pkg=JSON.parse(fs.readFileSync(path.join(root,'package.json'),'utf8'));}catch{}
let git={};
try { git.branch=execFileSync('git',['-C',root,'branch','--show-current'],{encoding:'utf8'}).trim(); git.status=execFileSync('git',['-C',root,'status','--short'],{encoding:'utf8'}).trim().split('\n').filter(Boolean); } catch {}
const dependencies={...(pkg.dependencies||{}),...(pkg.devDependencies||{})};
const providers={
  clerk:Object.keys(dependencies).some(x=>x.includes('clerk')),
  stripe:Object.keys(dependencies).some(x=>x==='stripe'||x.includes('stripe')),
  prisma:Object.keys(dependencies).some(x=>x.includes('prisma')),
  neon:Object.keys(dependencies).some(x=>x.includes('neon')),
  cloudinary:Object.keys(dependencies).some(x=>x.includes('cloudinary')),
  vercelBlob:Object.keys(dependencies).some(x=>x.includes('@vercel/blob')),
  huggingFace:Object.keys(dependencies).some(x=>x.includes('huggingface')||x.includes('hugging-face')),
};
const report={root,git,package:{name:pkg.name,packageManager:pkg.packageManager,scripts:Object.keys(pkg.scripts||{})},architecture:{app:exists('app'),features:exists('features'),blocks:exists('components/blocks'),ui:exists('components/ui'),fetchers:exists('lib/fetchers'),actions:exists('lib/actions'),workflows:exists('lib/workflows'),transactions:exists('lib/db/transactions'),auth:exists('lib/auth'),authz:exists('lib/authz'),integrations:exists('lib/integrations')},provenance:{hipsterstack:exists('hipsterstack.json'),manifest:exists('.hipsterstack/manifest.json')},providers};
console.log(JSON.stringify(report,null,2));
