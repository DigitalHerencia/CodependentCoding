#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.argv[2] || process.cwd());
const exts = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs']);
const ignored = new Set(['node_modules', '.git', '.next', 'dist', 'build', 'coverage', 'generated']);
const findings = [];

function files(dir) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ignored.has(ent.name)) continue;
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) out.push(...files(p));
    else if (exts.has(path.extname(ent.name))) out.push(p);
  }
  return out;
}
function rel(p){ return path.relative(root,p).replaceAll('\\','/'); }
function add(file, rule, message, line=1, severity='error') { findings.push({severity,file:rel(file),line,rule,message}); }
function lineOf(src, idx){ return src.slice(0, idx).split('\n').length; }
function imports(src){
  const out=[];
  const rx=/(?:import\s+(?:[^'\"]+?\s+from\s+)?|require\s*\(|import\s*\()\s*['\"]([^'\"]+)['\"]/g;
  let m; while((m=rx.exec(src))) out.push({spec:m[1], line:lineOf(src,m.index)}); return out;
}
function hasMutation(src){ return /\.(create|createMany|update|updateMany|upsert|delete|deleteMany)\s*\(/.test(src); }
function isPage(r){ return /(^|\/)app\/.*\/page\.(t|j)sx?$/.test(r) || /^app\/page\.(t|j)sx?$/.test(r); }

for (const file of files(root)) {
  const r=rel(file); const src=fs.readFileSync(file,'utf8'); const imps=imports(src);
  const isBlock=r.startsWith('components/blocks/');
  const isFeature=r.startsWith('features/');
  const isFetcher=r.startsWith('lib/fetchers/');
  const isTx=r.startsWith('lib/db/transactions/');
  const isAction=r.startsWith('lib/actions/');
  const isWorkflow=r.startsWith('lib/workflows/');

  if (isBlock && /react-hook-form/.test(src)) add(file,'block-purity','PureUI Blocks must not own React Hook Form state.');
  if (isFetcher && hasMutation(src)) add(file,'fetcher-read-only','Fetcher appears to execute a Prisma-style mutation method.');
  if (isTx && /\bfetch\s*\(/.test(src)) add(file,'transaction-no-network','Database transaction helper contains fetch(); keep network/provider calls outside atomic DB work.');

  for (const {spec,line} of imps) {
    if (isBlock && (/^@\/lib\//.test(spec) || /^@\/features\//.test(spec) || /@prisma|stripe|cloudinary|@clerk/.test(spec)))
      add(file,'block-purity',`PureUI Block imports non-presentation responsibility: ${spec}`,line);
    if (isFeature && /^@\/components\/ui\//.test(spec) && !/react-hook-form/.test(src))
      add(file,'feature-block-boundary',`Normal Feature imports UI primitive directly without React Hook Form exception: ${spec}`,line);
    if (isTx && (/^@\/lib\/integrations\//.test(spec) || /stripe|cloudinary|sendgrid|hugging.?face|@vercel\/blob/.test(spec)))
      add(file,'transaction-no-provider',`Database transaction imports provider/network responsibility: ${spec}`,line);
    if (isAction && /stripe|cloudinary|sendgrid|hugging.?face|@vercel\/blob/.test(spec))
      add(file,'provider-boundary',`Action imports provider SDK directly; use lib/integrations/{provider}: ${spec}`,line);
    if (isWorkflow && /stripe|cloudinary|sendgrid|hugging.?face|@vercel\/blob/.test(spec))
      add(file,'provider-boundary',`Workflow imports provider SDK directly; depend on integration helpers instead: ${spec}`,line);
    if (isPage(r) && (/^@\/lib\/(db|fetchers|actions|workflows|integrations)\//.test(spec) || /@prisma/.test(spec)))
      add(file,'thin-route',`Page route imports server/application implementation directly; hand application behavior to a Feature: ${spec}`,line);
  }
}

findings.sort((a,b)=>a.file.localeCompare(b.file)||a.line-b.line);
if (process.argv.includes('--json')) console.log(JSON.stringify({root,findings},null,2));
else {
  if (!findings.length) console.log('Loaded Vibes architecture validator: PASS (no mechanical violations found).');
  for (const f of findings) console.log(`${f.severity.toUpperCase()} ${f.file}:${f.line} [${f.rule}] ${f.message}`);
}
process.exitCode = findings.some(f=>f.severity==='error') ? 1 : 0;
