#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(process.argv[2]||process.cwd());
let errors=[];
function must(p){ if(!fs.existsSync(path.join(root,p))) errors.push(`missing ${p}`); }
must('plugin.json'); must('README.md'); must('AGENTS.md');
const expected=['loaded-vibes-inspect','loaded-vibes-classify','loaded-vibes-implement','loaded-vibes-review','loaded-vibes-verify','loaded-vibes-deliver'];
for(const n of expected){
  const skill=path.join(root,'skills',n,'SKILL.md'); const ui=path.join(root,'skills',n,'agents','openai.yaml');
  if(!fs.existsSync(skill)) errors.push(`missing skills/${n}/SKILL.md`);
  else { const s=fs.readFileSync(skill,'utf8'); if(!s.startsWith('---\nname:')) errors.push(`invalid frontmatter start in ${n}`); if(!s.includes(`name: ${n}`)) errors.push(`wrong skill name in ${n}`); if(!/\ndescription: .+\n---\n/s.test(s)) errors.push(`missing description frontmatter in ${n}`); }
  if(!fs.existsSync(ui)) errors.push(`missing skills/${n}/agents/openai.yaml`);
  else { const y=fs.readFileSync(ui,'utf8'); if(!y.includes(`$${n}`)) errors.push(`openai.yaml default_prompt must mention $${n}`); }
}
for(const p of ['validators/architecture.mjs','validators/arrangement-smoke.mjs','assets/arrangement-project/AGENTS.md','assets/arrangement-project/.codex/config.toml.example']) must(p);
try { const m=JSON.parse(fs.readFileSync(path.join(root,'plugin.json'),'utf8')); if(m.name!=='loaded-vibes') errors.push('plugin name must be loaded-vibes'); if(!m.extensions) errors.push('plugin extensions missing'); } catch(e){ errors.push(`invalid plugin.json: ${e.message}`); }
if(errors.length){ for(const e of errors) console.error(`FAIL ${e}`); process.exitCode=1; }
else console.log(`Loaded Vibes package validation: PASS (${expected.length} Codex skills).`);
