import { createRequire } from "node:module";
import path from "node:path";

import type * as TS from "typescript";

export type TypeScript = typeof TS;

/** The app's own TypeScript (the CLI ships no compiler). */
export function loadTypeScript(appDir: string): TypeScript {
  const require = createRequire(path.join(appDir, "package.json"));
  return require("typescript") as TypeScript;
}

const HEADER = /^(?:"use (?:server|client)";|\/\/.*|--.*|\s*)$/;

/** Drops the file header (directive, Why comment) a fragment carries for new files. */
export function stripHeader(text: string): string {
  const lines = text.split("\n");
  let start = 0;
  while (start < lines.length && HEADER.test(lines[start] ?? "")) start += 1;
  return lines.slice(start).join("\n");
}

/** Appends SQL or Prisma text to an existing file. */
export function appendText(existing: string, fragment: string): string {
  return `${existing.trimEnd()}\n\n${stripHeader(fragment).trim()}\n`;
}

interface ImportShape {
  specifier: string;
  typeOnly: boolean;
  sideEffect: boolean;
  /** Text of each named element, e.g. `type Foo` or `bar as baz`. */
  named: string[];
  other: boolean;
}

function parse(ts: TypeScript, text: string) {
  return ts.createSourceFile(
    "file.tsx",
    text,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
}

function importShape(ts: TypeScript, node: TS.ImportDeclaration): ImportShape {
  const specifier = (node.moduleSpecifier as TS.StringLiteral).text;
  const clause = node.importClause;
  const bindings = clause?.namedBindings;
  return {
    specifier,
    typeOnly: clause?.isTypeOnly ?? false,
    sideEffect: !clause,
    named:
      bindings && ts.isNamedImports(bindings)
        ? bindings.elements.map((element) => element.getText())
        : [],
    other:
      Boolean(clause?.name) ||
      Boolean(bindings && ts.isNamespaceImport(bindings)),
  };
}

const localName = (element: string) =>
  element
    .replace(/^type\s+/, "")
    .split(/\s+as\s+/)
    .pop()
    ?.trim() ?? element;

/** Top-level names a file declares or imports. */
function declaredNames(ts: TypeScript, source: TS.SourceFile): Set<string> {
  const names = new Set<string>();
  for (const statement of source.statements) {
    if (ts.isImportDeclaration(statement)) {
      const shape = importShape(ts, statement);
      shape.named.forEach((element) => names.add(localName(element)));
      const clause = statement.importClause;
      if (clause?.name) names.add(clause.name.text);
      if (clause?.namedBindings && ts.isNamespaceImport(clause.namedBindings)) {
        names.add(clause.namedBindings.name.text);
      }
    } else if (ts.isVariableStatement(statement)) {
      for (const declaration of statement.declarationList.declarations) {
        if (ts.isIdentifier(declaration.name)) names.add(declaration.name.text);
      }
    } else if (
      (ts.isFunctionDeclaration(statement) ||
        ts.isClassDeclaration(statement) ||
        ts.isInterfaceDeclaration(statement) ||
        ts.isTypeAliasDeclaration(statement) ||
        ts.isEnumDeclaration(statement)) &&
      statement.name
    ) {
      names.add(statement.name.text);
    }
  }
  return names;
}

const renderImport = (shape: ImportShape) =>
  `import ${shape.typeOnly ? "type " : ""}{ ${shape.named.join(", ")} } from "${shape.specifier}";`;

/**
 * Merges a rendered TypeScript fragment into an existing module file: missing
 * named imports join the file's import from the same module (or a new import
 * line), and the fragment's declarations are appended. A declaration whose
 * name the file already has is refused, so nothing is overwritten.
 */
export function mergeTs(
  ts: TypeScript,
  existing: string,
  fragment: string,
  file: string,
): string {
  const target = parse(ts, existing);
  const piece = parse(ts, stripHeader(fragment));
  const pieceImports = piece.statements.filter(ts.isImportDeclaration);
  const bodyStart = pieceImports.at(-1)?.getEnd() ?? 0;
  const body = piece.text.slice(bodyStart).trim();

  const existingNames = declaredNames(ts, target);
  const pieceDeclared = declaredNames(ts, parse(ts, body));
  const clashes = [...pieceDeclared].filter((name) => existingNames.has(name));
  if (clashes.length > 0) {
    throw new Error(
      `${file} already declares ${clashes.join(", ")}; pick another entity name.`,
    );
  }

  const targetImports = target.statements.filter(ts.isImportDeclaration);
  const edits: { start: number; end: number; text: string }[] = [];
  const added: string[] = [];
  for (const node of pieceImports) {
    const shape = importShape(ts, node);
    if (shape.sideEffect) {
      if (
        !targetImports.some(
          (other) => importShape(ts, other).specifier === shape.specifier,
        )
      ) {
        added.push(node.getText());
      }
      continue;
    }
    const missing = shape.named.filter(
      (element) => !existingNames.has(localName(element)),
    );
    if (missing.length === 0) continue;
    const host = targetImports.find((other) => {
      const otherShape = importShape(ts, other);
      return (
        otherShape.specifier === shape.specifier &&
        otherShape.typeOnly === shape.typeOnly &&
        !otherShape.sideEffect &&
        !otherShape.other
      );
    });
    if (host && !edits.some((edit) => edit.start === host.getStart())) {
      const hostShape = importShape(ts, host);
      edits.push({
        start: host.getStart(),
        end: host.getEnd(),
        text: renderImport({
          ...hostShape,
          named: [...hostShape.named, ...missing],
        }),
      });
    } else {
      added.push(renderImport({ ...shape, named: missing }));
    }
    missing.forEach((element) => existingNames.add(localName(element)));
  }

  let text = existing;
  for (const edit of edits.sort((a, b) => b.start - a.start)) {
    text = text.slice(0, edit.start) + edit.text + text.slice(edit.end);
  }
  if (added.length > 0) {
    // Edits replace import text in place, so the last import ends where its
    // replacement ends; re-parse to find it.
    const lastImport = parse(ts, text)
      .statements.filter(ts.isImportDeclaration)
      .at(-1);
    const at = lastImport
      ? lastImport.getEnd()
      : directiveEnd(ts, parse(ts, text));
    text = `${text.slice(0, at)}\n${added.join("\n")}${text.slice(at)}`;
  }
  return `${text.trimEnd()}\n\n${body}\n`;
}

/** After a leading "use server"/"use client" directive, else the file start. */
function directiveEnd(ts: TypeScript, source: TS.SourceFile): number {
  const first = source.statements[0];
  if (
    first &&
    ts.isExpressionStatement(first) &&
    ts.isStringLiteral(first.expression)
  ) {
    return first.getEnd();
  }
  return 0;
}

function findProperty(
  ts: TypeScript,
  object: TS.ObjectLiteralExpression,
  name: string,
) {
  return object.properties.find(
    (property): property is TS.PropertyAssignment =>
      ts.isPropertyAssignment(property) &&
      property.name.getText().replace(/["']/g, "") === name,
  );
}

/** The object literal a module file exports (`export const xModule = { … } satisfies …`). */
function moduleObject(
  ts: TypeScript,
  source: TS.SourceFile,
): TS.ObjectLiteralExpression | null {
  for (const statement of source.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    for (const declaration of statement.declarationList.declarations) {
      let value = declaration.initializer;
      while (
        value &&
        (ts.isSatisfiesExpression(value) || ts.isAsExpression(value))
      )
        value = value.expression;
      if (value && ts.isObjectLiteralExpression(value)) return value;
    }
  }
  return null;
}

function appendToArray(
  text: string,
  array: TS.ArrayLiteralExpression,
  item: string,
): string {
  const at = array.getEnd() - 1;
  const comma =
    array.elements.length > 0 && !array.elements.hasTrailingComma ? ", " : "";
  return `${text.slice(0, at)}${comma}${item}${text.slice(at)}`;
}

/**
 * Adds the slice's nav link and resource to an existing module definition.
 * Returns what it could not place so the caller can say so.
 */
export function extendModule(
  ts: TypeScript,
  text: string,
  link: { label: string; href: string },
  resource: string,
): { text: string; skipped: string[] } {
  const skipped: string[] = [];
  let next = text;
  const resources = (() => {
    const object = moduleObject(ts, parse(ts, next));
    const permissions = object && findProperty(ts, object, "permissions");
    if (!permissions || !ts.isObjectLiteralExpression(permissions.initializer))
      return null;
    const list = findProperty(ts, permissions.initializer, "resources");
    return list && ts.isArrayLiteralExpression(list.initializer)
      ? list.initializer
      : null;
  })();
  if (resources) {
    if (
      !resources.elements.some(
        (element) => element.getText().replace(/["']/g, "") === resource,
      )
    ) {
      next = appendToArray(next, resources, `"${resource}"`);
    }
  } else {
    skipped.push(`permissions.resources ("${resource}")`);
  }
  const links = (() => {
    const object = moduleObject(ts, parse(ts, next));
    const nav = object && findProperty(ts, object, "nav");
    if (!nav || !ts.isObjectLiteralExpression(nav.initializer)) return null;
    const list = findProperty(ts, nav.initializer, "links");
    return list && ts.isArrayLiteralExpression(list.initializer)
      ? list.initializer
      : null;
  })();
  if (links) {
    if (!links.getText().includes(`"${link.href}"`)) {
      next = appendToArray(
        next,
        links,
        `{ label: "${link.label}", href: "${link.href}" }`,
      );
    }
  } else {
    skipped.push(`nav.links (${link.href})`);
  }
  return { text: next, skipped };
}
