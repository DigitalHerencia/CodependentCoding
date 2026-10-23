/**
 * eslint-plugin-codependent (local)
 *
 * Mechanically enforces the Codependent Coding doctrine. Every report carries
 * the doctrine rule ID (CC-*) defined in .claude/contracts/validation.yaml.
 * The tables live in ./doctrine-map.mjs; this file only contains mechanics.
 */
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

// Node subpath import (package.json "imports"); ESLint loads this file natively.
import { BASE, ownerOf } from "#scripts/ownership.mjs";

import {
  boundaries,
  categories,
  defaultExportAllowed,
  filenameConventions,
  genericNames,
  layers,
  prismaWriteMethods,
  serverOnlyPaths,
  useClientAllowed,
} from "./doctrine-map.mjs";

// ---------------------------------------------------------------- helpers ---

function toPosix(value) {
  return value.split(path.sep).join("/");
}

/** Repo-relative POSIX path of the file being linted. */
export function relativeFile(context) {
  const filename = context.filename ?? context.getFilename();
  const cwd = context.cwd ?? context.getCwd();
  return toPosix(path.relative(cwd, filename));
}

export function layerOf(rel) {
  return layers.find((layer) => layer.match.test(rel))?.id ?? null;
}

/** Resolve an import specifier to { kind: "internal" | "package", value }. */
export function resolveSpecifier(spec, rel) {
  if (spec.startsWith("@/")) {
    return { kind: "internal", value: spec.slice(2) };
  }
  if (spec.startsWith("./") || spec.startsWith("../")) {
    const joined = path.posix.normalize(
      path.posix.join(path.posix.dirname(rel), spec),
    );
    return { kind: "internal", value: joined };
  }
  return { kind: "package", value: spec };
}

export function categoriesOf(resolved) {
  const hits = [];
  for (const [name, def] of Object.entries(categories)) {
    const patterns = resolved.kind === "internal" ? def.internal : def.packages;
    if (patterns?.some((pattern) => pattern.test(resolved.value)))
      hits.push(name);
  }
  return hits;
}

function isTypeOnly(node) {
  if (node.importKind === "type" || node.exportKind === "type") return true;
  if (node.type === "ImportDeclaration" && node.specifiers.length > 0) {
    return node.specifiers.every((s) => s.importKind === "type");
  }
  return false;
}

/** Visit every static/dynamic module source in a file. */
function onEachSource(callback) {
  const handle = (node) => {
    if (node.source && typeof node.source.value === "string") {
      callback(node.source.value, node.source, node);
    }
  };
  return {
    ImportDeclaration: handle,
    ExportNamedDeclaration: handle,
    ExportAllDeclaration: handle,
    ImportExpression(node) {
      if (
        node.source.type === "Literal" &&
        typeof node.source.value === "string"
      ) {
        callback(node.source.value, node.source, node);
      }
    },
  };
}

function directives(program) {
  const found = [];
  for (const statement of program.body) {
    if (
      statement.type === "ExpressionStatement" &&
      typeof statement.directive === "string"
    ) {
      found.push(statement.directive);
    } else {
      break;
    }
  }
  return found;
}

const docs = (description, id) => ({
  description: `${id}: ${description}`,
  url: `.claude/contracts/validation.yaml#${id}`,
});

// ------------------------------------------------------------------ rules ---

const layerBoundaries = {
  meta: {
    type: "problem",
    docs: docs(
      "Layers may only import the responsibilities the doctrine allows.",
      "CC-LAYER",
    ),
    schema: [],
    messages: {
      denied:
        "[{{rule}}] {{layer}} must not import {{category}} ('{{spec}}'). {{why}}",
    },
  },
  create(context) {
    const rel = relativeFile(context);
    const layer = layerOf(rel);
    const boundary = layer ? boundaries[layer] : undefined;
    if (!boundary) return {};
    const deny = new Set(boundary.deny);
    const except = new Set(boundary.except ?? []);
    return onEachSource((spec, sourceNode, node) => {
      const hits = categoriesOf(resolveSpecifier(spec, rel));
      if (hits.some((hit) => except.has(hit))) return;
      const denied = hits.find((hit) => deny.has(hit));
      if (!denied) return;
      // Type-only imports are erased at build time and cannot leak runtime.
      if (isTypeOnly(node)) return;
      context.report({
        node: sourceNode,
        messageId: "denied",
        data: {
          rule: boundary.rule,
          layer,
          category: denied,
          spec,
          why: boundary.why,
        },
      });
    });
  },
};

const requireServerOnly = {
  meta: {
    type: "problem",
    fixable: "code",
    docs: docs(
      'Server modules must begin with import "server-only".',
      "CC-SRV-001",
    ),
    schema: [],
    messages: {
      missing:
        '[CC-SRV-001] {{layer}} modules must import "server-only" so they can never ship to the browser.',
    },
  },
  create(context) {
    const rel = relativeFile(context);
    const layer = layerOf(rel);
    if (
      !serverOnlyPaths.some((pattern) => pattern.test(rel)) ||
      rel.endsWith(".d.ts")
    )
      return {};
    return {
      Program(program) {
        const has = program.body.some(
          (s) =>
            s.type === "ImportDeclaration" && s.source.value === "server-only",
        );
        if (!has) {
          context.report({
            node: program,
            messageId: "missing",
            data: { layer },
            fix: (fixer) => {
              const first = program.body[0];
              return first
                ? fixer.insertTextBefore(first, 'import "server-only";\n\n')
                : fixer.insertTextAfterRange([0, 0], 'import "server-only";\n');
            },
          });
        }
      },
    };
  },
};

const useServerActions = {
  meta: {
    type: "problem",
    docs: docs(
      'Action modules must start with the "use server" directive.',
      "CC-WRITE-002",
    ),
    schema: [],
    messages: {
      missing:
        '[CC-WRITE-002] lib/actions modules must start with "use server".',
    },
  },
  create(context) {
    if (layerOf(relativeFile(context)) !== "action") return {};
    return {
      Program(program) {
        if (!directives(program).includes("use server")) {
          context.report({ node: program, messageId: "missing" });
        }
      },
    };
  },
};

const useClientPlacement = {
  meta: {
    type: "problem",
    docs: docs(
      '"use client" lives only in .client.tsx companions, components, hooks and error boundaries.',
      "CC-CLIENT-001",
    ),
    schema: [],
    messages: {
      misplaced:
        '[CC-CLIENT-001] "use client" is not allowed here. Move browser behavior into a *.client.tsx companion.',
      missing:
        '[CC-CLIENT-001] *.client.tsx files must start with "use client".',
    },
  },
  create(context) {
    const rel = relativeFile(context);
    return {
      Program(program) {
        const isClient = directives(program).includes("use client");
        if (isClient && !useClientAllowed.test(rel)) {
          context.report({ node: program, messageId: "misplaced" });
        }
        if (!isClient && rel.endsWith(".client.tsx")) {
          context.report({ node: program, messageId: "missing" });
        }
      },
    };
  },
};

function memberName(callee) {
  if (callee?.type !== "MemberExpression") return null;
  if (callee.property.type === "Identifier") return callee.property.name;
  if (callee.property.type === "Literal") return String(callee.property.value);
  return null;
}

const noFetcherWrites = {
  meta: {
    type: "problem",
    docs: docs("Fetchers are read-only.", "CC-READ-002"),
    schema: [],
    messages: {
      write:
        "[CC-READ-002] Fetchers are read-only; '.{{method}}()' belongs in an action or transaction helper.",
    },
  },
  create(context) {
    if (layerOf(relativeFile(context)) !== "fetcher") return {};
    const writes = new Set(prismaWriteMethods);
    return {
      CallExpression(node) {
        const method = memberName(node.callee);
        if (method && writes.has(method))
          context.report({ node, messageId: "write", data: { method } });
      },
      TaggedTemplateExpression(node) {
        const method = memberName(node.tag);
        if (method && writes.has(method))
          context.report({ node, messageId: "write", data: { method } });
      },
    };
  },
};

const noTransactionNetwork = {
  meta: {
    type: "problem",
    docs: docs("No network I/O inside transaction helpers.", "CC-TX-002"),
    schema: [],
    messages: {
      network:
        "[CC-TX-002] Network calls are forbidden inside lib/db/transactions; call providers before or after the transaction.",
    },
  },
  create(context) {
    if (layerOf(relativeFile(context)) !== "transaction") return {};
    return {
      CallExpression(node) {
        if (node.callee.type === "Identifier" && node.callee.name === "fetch") {
          context.report({ node, messageId: "network" });
        }
      },
    };
  },
};

const noRawSql = {
  meta: {
    type: "problem",
    docs: docs(
      "No unsafe raw SQL; safe raw SQL only inside lib/db.",
      "CC-DB-002",
    ),
    schema: [],
    messages: {
      unsafe:
        "[CC-DB-002] '{{method}}' is never allowed. Use the tagged-template form inside lib/db.",
      outside:
        "[CC-DB-002] Raw SQL ('{{method}}') is only allowed inside lib/db.",
    },
  },
  create(context) {
    const rel = relativeFile(context);
    const inDb = rel.startsWith("lib/db/") || rel.startsWith("prisma/");
    const check = (node, method) => {
      if (!method) return;
      if (method === "$queryRawUnsafe" || method === "$executeRawUnsafe") {
        context.report({ node, messageId: "unsafe", data: { method } });
      } else if (
        !inDb &&
        (method === "$queryRaw" || method === "$executeRaw")
      ) {
        context.report({ node, messageId: "outside", data: { method } });
      }
    };
    return {
      CallExpression: (node) => check(node, memberName(node.callee)),
      TaggedTemplateExpression: (node) => check(node, memberName(node.tag)),
    };
  },
};

const filenameConvention = {
  meta: {
    type: "suggestion",
    docs: docs(
      "Files follow the doctrine naming convention for their directory.",
      "CC-NAME-001",
    ),
    schema: [],
    messages: {
      name: "[CC-NAME-001] '{{file}}' does not match the naming convention for {{dir}} (e.g. {{example}}).",
    },
  },
  create(context) {
    const rel = relativeFile(context);
    const dir = rel.slice(0, rel.lastIndexOf("/") + 1);
    const file = rel.slice(rel.lastIndexOf("/") + 1);
    const convention = filenameConventions.find((c) => c.dir.test(dir));
    if (!convention || convention.file.test(file)) return {};
    return {
      Program(program) {
        context.report({
          node: program,
          messageId: "name",
          data: { file, dir, example: convention.example },
        });
      },
    };
  },
};

const noGenericNames = {
  meta: {
    type: "suggestion",
    docs: docs(
      "No invented layers (services, managers, helpers, misc...).",
      "CC-NAME-002",
    ),
    schema: [],
    messages: {
      generic:
        "[CC-NAME-002] '{{rel}}' introduces a generic layer. Name the real responsibility (fetcher, action, workflow, integration, util).",
    },
  },
  create(context) {
    const rel = relativeFile(context);
    if (!genericNames.test(rel) || rel.startsWith("components/ui/")) return {};
    return {
      Program(program) {
        context.report({ node: program, messageId: "generic", data: { rel } });
      },
    };
  },
};

const noDefaultExport = {
  meta: {
    type: "suggestion",
    docs: docs(
      "Named exports only, except framework special files.",
      "CC-STYLE-001",
    ),
    schema: [],
    messages: {
      default:
        "[CC-STYLE-001] Use a named export. Default exports are reserved for Next.js special files and config.",
    },
  },
  create(context) {
    const rel = relativeFile(context);
    if (defaultExportAllowed.test(rel)) return {};
    return {
      ExportDefaultDeclaration(node) {
        context.report({ node, messageId: "default" });
      },
    };
  },
};

const noParentImports = {
  meta: {
    type: "suggestion",
    fixable: "code",
    docs: docs(
      "Use the @/ alias instead of parent-relative imports.",
      "CC-STYLE-002",
    ),
    schema: [],
    messages: {
      parent:
        "[CC-STYLE-002] Import '{{spec}}' through the @/ alias so the owning layer is visible.",
    },
  },
  create(context) {
    const rel = relativeFile(context);
    return onEachSource((spec, sourceNode) => {
      if (!spec.startsWith("../")) return;
      const target = resolveSpecifier(spec, rel).value;
      context.report({
        node: sourceNode,
        messageId: "parent",
        data: { spec },
        fix: target.startsWith("../")
          ? null
          : (fixer) =>
              fixer.replaceText(sourceNode, JSON.stringify(`@/${target}`)),
      });
    });
  },
};

/**
 * hipster.modules.json for the lint root, read once per process. Null when the
 * root has none (the factory repo lints with this plugin but has no modules).
 */
const manifests = new Map();
function manifestAt(cwd) {
  if (!manifests.has(cwd)) {
    const file = path.join(cwd, "hipster.modules.json");
    manifests.set(
      cwd,
      existsSync(file) ? JSON.parse(readFileSync(file, "utf8")) : null,
    );
  }
  return manifests.get(cwd);
}

const REGISTRY = "lib/modules/registry.ts";

const moduleBoundaries = {
  meta: {
    type: "problem",
    docs: docs(
      "Modules import other modules only via dependsOn; base reaches modules only through the registry.",
      "CC-MOD-001",
    ),
    schema: [],
    messages: {
      undeclared:
        "[CC-MOD-001] Module '{{from}}' imports '{{spec}}' owned by '{{to}}', which is not in its dependsOn (hipster.modules.json).",
      base: "[CC-MOD-002] Base file imports '{{spec}}' owned by module '{{to}}'. Base reaches modules only through lib/modules/registry.ts.",
    },
  },
  create(context) {
    const rel = relativeFile(context);
    const manifest = manifestAt(context.cwd ?? context.getCwd());
    if (manifest === null) return {};
    const from = ownerOf(rel, manifest).owner;
    if (from === null) return {}; // ambiguous owner: CC-MOD-003 reports it
    const deps = new Set(
      manifest.modules.find((entry) => entry.id === from)?.dependsOn ?? [],
    );
    return onEachSource((spec, sourceNode) => {
      const resolved = resolveSpecifier(spec, rel);
      if (resolved.kind !== "internal") return;
      const to = ownerOf(resolved.value, manifest).owner;
      if (to === null || to === BASE || to === from) return;
      if (from === BASE) {
        if (rel === REGISTRY) return;
        context.report({
          node: sourceNode,
          messageId: "base",
          data: { spec, to },
        });
      } else if (!deps.has(to)) {
        context.report({
          node: sourceNode,
          messageId: "undeclared",
          data: { from, spec, to },
        });
      }
    });
  },
};

export const rules = {
  "layer-boundaries": layerBoundaries,
  "require-server-only": requireServerOnly,
  "use-server-actions": useServerActions,
  "use-client-placement": useClientPlacement,
  "no-fetcher-writes": noFetcherWrites,
  "no-transaction-network": noTransactionNetwork,
  "no-raw-sql": noRawSql,
  "filename-convention": filenameConvention,
  "no-generic-names": noGenericNames,
  "no-default-export": noDefaultExport,
  "no-parent-imports": noParentImports,
  "module-boundaries": moduleBoundaries,
};

const plugin = {
  meta: { name: "eslint-plugin-codependent", version: "1.0.0" },
  rules,
};

/** Recommended doctrine config: every rule is an error. */
export const doctrine = {
  name: "codependent/doctrine",
  files: ["**/*.{ts,tsx,mts,cts,js,jsx,mjs}"],
  plugins: { codependent: plugin },
  rules: Object.fromEntries(
    Object.keys(rules).map((name) => [`codependent/${name}`, "error"]),
  ),
};

export default plugin;
