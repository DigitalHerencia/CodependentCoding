import fs from 'node:fs';
import path from 'node:path';
import {
  codeFiles,
  createReporter,
  importsFrom,
  providerPackage,
  rel,
  resolveLocalImport,
  root,
  surfaceInner,
} from './lib.mjs';

const jsonMode = process.argv.includes('--json');
const report = createReporter('architecture', jsonMode);
const candidates = [...codeFiles('app'), ...codeFiles('components'), ...codeFiles('features'), ...codeFiles('packages/schema'), ...codeFiles('packages/core'), ...codeFiles('template/lib'), ...codeFiles('template/app'), ...codeFiles('template/components'), ...codeFiles('template/features')];
const files = [...new Set(candidates)];

const prefix = (target, value) => target === value || target.startsWith(`${value}/`);
const anyPrefix = (target, values) => values.some((value) => prefix(target, value));
const externalForbiddenInWorkflow = (spec) => providerPackage(spec) || /^next\/(?:cache|navigation)(?:$|\/)/.test(spec) || /^react(?:$|\/)/.test(spec);
const isRouteSurface = (inner) => /^app\/(?:.*\/)?(?:page|layout|template|loading|error|not-found)\.[^.]+$/.test(inner);
const isRouteHandler = (inner) => /^app\/api\/(?:.*\/)?route\.[^.]+$/.test(inner);
const isFetcher = (inner) => prefix(inner, 'lib/fetchers');
const isAction = (inner) => prefix(inner, 'lib/actions');
const isWorkflow = (inner) => prefix(inner, 'lib/workflows') || /^lib\/[^/]+\/workflows(?:\/|$)/.test(inner);
const isTransaction = (inner) => prefix(inner, 'lib/db/transactions');
const isIntegration = (inner) => prefix(inner, 'lib/integrations');
const serverOnlyMarker = /(?:^|\n)\s*import\s+['"]server-only['"];?/;
const useServerMarker = /(?:^|\n)\s*['"]use server['"];?/;
const obviousMutation = /\.(?:create|createMany|update|updateMany|upsert|delete|deleteMany)\s*\(/;
const networkCall = /\bfetch\s*\(|\baxios\s*\.|\bky\s*\(/;

function localTarget(relativeFile, specifier) {
  return resolveLocalImport(relativeFile, specifier)?.target ?? null;
}

for (const file of files) {
  const relativeFile = rel(file);
  const { surface, inner } = surfaceInner(relativeFile);
  const source = fs.readFileSync(file, 'utf8');
  const imports = importsFrom(source);

  if (isRouteSurface(inner)) {
    for (const spec of imports) {
      const target = localTarget(relativeFile, spec);
      if (target && anyPrefix(target, ['lib/actions', 'lib/fetchers', 'lib/workflows', 'lib/db', 'lib/integrations'])) {
        report.error('ARCH-001', `Route surface imports application/data implementation directly: ${spec}`, relativeFile);
      }
      if (providerPackage(spec)) report.error('ARCH-001', `Route surface imports provider/database SDK directly: ${spec}`, relativeFile);
    }
  }

  if (prefix(inner, 'components')) {
    for (const spec of imports) {
      const target = localTarget(relativeFile, spec);
      if (target && anyPrefix(target, ['lib/actions', 'lib/fetchers', 'lib/db', 'lib/auth', 'lib/authz', 'lib/integrations', 'lib/workflows', 'features', 'app'])) {
        report.error('ARCH-002', `Presentation imports protected/upward responsibility: ${spec}`, relativeFile);
      }
      if (providerPackage(spec)) report.error('ARCH-002', `Presentation imports provider/database SDK: ${spec}`, relativeFile);
    }
  }

  if (prefix(inner, 'features')) {
    for (const spec of imports) {
      const target = localTarget(relativeFile, spec);
      if (target && anyPrefix(target, ['lib/db', 'lib/integrations', 'lib/workflows', 'app'])) {
        report.error('ARCH-003', `Feature imports DB/provider/route responsibility directly: ${spec}`, relativeFile);
      }
      if (providerPackage(spec)) report.error('ARCH-003', `Feature imports provider/database SDK directly: ${spec}`, relativeFile);
    }
  }

  if (surface === 'template' && isFetcher(inner)) {
    if (!serverOnlyMarker.test(source)) report.error('ARCH-004', 'Fetcher must declare the server-only boundary.', relativeFile);
    if (obviousMutation.test(source)) report.error('ARCH-004', 'Fetcher contains an obvious database mutation call.', relativeFile);
    for (const spec of imports) {
      if (providerPackage(spec) && !/^@prisma\/client/.test(spec)) report.error('ARCH-004', `Fetcher imports provider SDK: ${spec}`, relativeFile);
      if (/^next\/(?:cache|navigation)(?:$|\/)/.test(spec)) report.error('ARCH-004', `Fetcher imports framework effect module: ${spec}`, relativeFile);
    }
  }

  if (surface === 'template' && isAction(inner)) {
    if (!useServerMarker.test(source)) report.error('ARCH-005', 'Server Action must declare "use server".', relativeFile);
    for (const spec of imports) {
      const target = localTarget(relativeFile, spec);
      if (target && anyPrefix(target, ['lib/db', 'lib/integrations'])) report.error('ARCH-005', `Action imports DB/integration implementation directly instead of delegating to a Workflow: ${spec}`, relativeFile);
      if (providerPackage(spec)) report.error('ARCH-005', `Action imports provider/database SDK directly: ${spec}`, relativeFile);
    }
  }

  if (surface === 'template' && isWorkflow(inner)) {
    for (const spec of imports) {
      if (externalForbiddenInWorkflow(spec)) report.error('ARCH-006', `Workflow imports framework/provider SDK directly: ${spec}`, relativeFile);
      const target = localTarget(relativeFile, spec);
      if (target && prefix(target, 'app')) report.error('ARCH-006', `Workflow depends upward on route code: ${spec}`, relativeFile);
    }
  }

  if (surface === 'template' && isTransaction(inner)) {
    if (networkCall.test(source)) report.error('ARCH-007', 'Transaction helper contains an obvious network call.', relativeFile);
    for (const spec of imports) {
      if (providerPackage(spec) && !/^@prisma\/client/.test(spec)) report.error('ARCH-007', `Transaction imports provider SDK: ${spec}`, relativeFile);
      if (/^next\//.test(spec) || /^react(?:$|\/)/.test(spec)) report.error('ARCH-007', `Transaction imports framework/presentation module: ${spec}`, relativeFile);
    }
  }

  if (surface === 'template' && isIntegration(inner)) {
    for (const spec of imports) {
      const target = localTarget(relativeFile, spec);
      if (target && prefix(target, 'lib/authz')) report.error('ARCH-008', `Integration owns product authorization via ${spec}.`, relativeFile);
      if (/^react(?:$|\/)/.test(spec) || /^next\/navigation/.test(spec)) report.error('ARCH-008', `Integration imports presentation/navigation module: ${spec}`, relativeFile);
    }
  }

  if (relativeFile.startsWith('packages/schema/')) {
    for (const spec of imports) {
      if (/cli/i.test(spec) && (spec.startsWith('.') || spec.startsWith('@/') || spec.startsWith('@codependent-coding/'))) {
        report.error('ARCH-009', `Schema authority appears to depend on CLI shell: ${spec}`, relativeFile);
      }
    }
  }

  if (relativeFile.startsWith('packages/core/')) {
    for (const spec of imports) {
      const target = localTarget(relativeFile, spec);
      if (target && anyPrefix(target, ['app', 'features', 'components'])) report.error('ARCH-010', `Generator core depends on web rendering layer: ${spec}`, relativeFile);
      if (/^next\/(?:navigation|cache)/.test(spec)) report.error('ARCH-010', `Generator core imports Next.js rendering effect: ${spec}`, relativeFile);
    }
  }

  if (isRouteHandler(inner) && !relativeFile.includes('template/')) {
    // Root route handlers may legitimately adapt public download/configuration requests; no extra rule here.
  }
}

report.finish({ filesScanned: files.length });
