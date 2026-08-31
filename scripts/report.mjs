import fs from 'node:fs';
import path from 'node:path';
import { compareTrees, listChapterFiles, readData, root, walk } from './lib.mjs';

const app = readData('.agents/contracts/application.yaml');
const design = readData('.agents/contracts/design.yaml');
const comparison = compareTrees(app.implementationEvidence.loadedVibesCanonicalSource, app.implementationEvidence.loadedVibesMirror);
const countFiles = (p) => walk(p).length;
const report = {
  generatedAt: new Date().toISOString(),
  product: app.identity?.product,
  repository: {
    files: walk(root, { ignore: ['.git', '.next', 'node_modules'] }).length,
    rootWeb: {
      app: countFiles('app'),
      features: countFiles('features'),
      blocks: countFiles('components/blocks'),
      primitives: countFiles('components/ui'),
    },
    maximalTemplate: {
      app: countFiles('template/app'),
      features: countFiles('template/features'),
      workflowsObserved: countFiles('template/lib/workflows'),
      blocks: countFiles('template/components/blocks'),
      primitives: countFiles('template/components/ui'),
    },
    typescripture: {
      knowledgeChapters: listChapterFiles(app.repository.typescripture.knowledgeBook).length,
      implementationChapters: listChapterFiles(app.repository.typescripture.implementationBook).length,
    },
    mockups: design.mockups?.length ?? 0,
    loadedVibesMirror: comparison,
    transitional: [
      ...(fs.existsSync(path.join(root, 'template/lib/workflows')) ? ['template/lib/workflows/<domain> remains transitional'] : []),
    ],
  },
};
console.log(JSON.stringify(report, null, 2));
