import ts from "typescript";
import path from "node:path";
import type {
  SourceAdapter,
  ArchitectureSnapshot,
  SourceFact,
} from "@/types/architectureTypes";

const extensions = [
  "",
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".mts",
  ".cts",
  ".mjs",
  ".cjs",
  ".json",
  ".css",
  "/index.ts",
  "/index.tsx",
  "/index.js",
  "/index.jsx",
];

function resolveLocal(
  file: string,
  specifier: string,
  adapter: SourceAdapter,
  known: Set<string>,
) {
  const bases: string[] = [];
  if (specifier.startsWith("."))
    bases.push(path.posix.join(path.posix.dirname(file), specifier));
  for (const [pattern, targets] of Object.entries(adapter.aliases)) {
    const [prefix = "", suffix = ""] = pattern.split("*");
    if (
      pattern.includes("*")
        ? specifier.startsWith(prefix) && specifier.endsWith(suffix)
        : pattern === specifier
    ) {
      const match = pattern.includes("*")
        ? specifier.slice(prefix.length, suffix ? -suffix.length : undefined)
        : "";
      bases.push(...targets.map((target) => target.replace("*", match)));
    }
  }
  for (const raw of bases) {
    const base = path.posix.normalize(raw);
    if (base.startsWith("../") || base.startsWith("/")) continue;
    // TypeScript permits .js specifiers for .ts source under ESM.
    const variants = /\.[cm]?js$/.test(base)
      ? [
          base
            .replace(/\.js$/, "")
            .replace(/\.mjs$/, ".mts")
            .replace(/\.cjs$/, ".cts"),
          base,
        ]
      : [base];
    for (const variant of variants)
      for (const extension of extensions)
        if (known.has(variant + extension)) return variant + extension;
  }
  return undefined;
}

/** AST facts, not regular-expression guesses or inferred runtime execution. */
export async function analyzeSource(
  adapter: SourceAdapter,
): Promise<ArchitectureSnapshot> {
  const known = new Set(adapter.files);
  const facts: SourceFact[] = [];
  for (const file of adapter.files) {
    if (!/\.[cm]?[jt]sx?$/.test(file)) continue;
    const ast = ts.createSourceFile(
      file,
      await adapter.read(file),
      ts.ScriptTarget.Latest,
      true,
    );
    const fact: SourceFact = { path: file, edges: [], unresolved: 0 };
    const bindings = new Map<ts.Declaration, string>();
    const dependency = (specifier: string, node: ts.Node) => {
      const target = resolveLocal(file, specifier, adapter, known);
      if (target)
        fact.edges.push({
          target,
          kind: "imports",
          line: ast.getLineAndCharacterOfPosition(node.getStart(ast)).line + 1,
        });
      else fact.unresolved++;
      return target;
    };
    for (const statement of ast.statements) {
      if (
        ts.isImportDeclaration(statement) &&
        ts.isStringLiteral(statement.moduleSpecifier)
      ) {
        const target = dependency(statement.moduleSpecifier.text, statement);
        if (target && !statement.importClause?.isTypeOnly) {
          const clause = statement.importClause;
          if (clause?.name) bindings.set(clause, target);
          if (clause?.namedBindings && ts.isNamedImports(clause.namedBindings))
            for (const element of clause.namedBindings.elements)
              if (!element.isTypeOnly) bindings.set(element, target);
          if (
            clause?.namedBindings &&
            ts.isNamespaceImport(clause.namedBindings)
          )
            bindings.set(clause.namedBindings, target);
        }
      } else if (
        ts.isExportDeclaration(statement) &&
        statement.moduleSpecifier &&
        ts.isStringLiteral(statement.moduleSpecifier)
      )
        dependency(statement.moduleSpecifier.text, statement);
    }
    // Bind lexical symbols without resolving providers or loading repository code.
    // A prop/local variable named like an import is not that imported component.
    const options = { noLib: true, noResolve: true, jsx: ts.JsxEmit.Preserve };
    const host = ts.createCompilerHost(options);
    host.getSourceFile = (name) =>
      path.resolve(name) === path.resolve(file) ? ast : undefined;
    host.fileExists = (name) => path.resolve(name) === path.resolve(file);
    host.readFile = () => undefined;
    const checker = ts.createProgram([file], options, host).getTypeChecker();
    const visit = (node: ts.Node) => {
      if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
        let identifier: ts.Node = node.tagName;
        while (ts.isPropertyAccessExpression(identifier))
          identifier = identifier.expression;
        const symbol = checker.getSymbolAtLocation(identifier);
        const target = symbol?.declarations
          ?.map((declaration) => bindings.get(declaration))
          .find(Boolean);
        if (target)
          fact.edges.push({
            target,
            kind: "renders",
            line:
              ast.getLineAndCharacterOfPosition(node.getStart(ast)).line + 1,
          });
      }
      ts.forEachChild(node, visit);
    };
    visit(ast);
    facts.push(fact);
  }
  return { metadata: adapter.metadata, files: adapter.files, facts };
}
