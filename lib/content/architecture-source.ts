import "server-only";
import { createHighlighterCore } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";
import { readArchitectureSource } from "@/lib/content/architecture";
import type { SourcePage } from "@/types/architectureTypes";

const highlighter = createHighlighterCore({
  themes: [import("shiki/themes/github-dark.mjs")],
  langs: [],
  engine: createJavaScriptRegexEngine(),
});
const grammars = {
  ts: () => import("shiki/langs/typescript.mjs"),
  tsx: () => import("shiki/langs/tsx.mjs"),
  js: () => import("shiki/langs/javascript.mjs"),
  jsx: () => import("shiki/langs/jsx.mjs"),
  json: () => import("shiki/langs/json.mjs"),
  css: () => import("shiki/langs/css.mjs"),
  md: () => import("shiki/langs/markdown.mjs"),
  sql: () => import("shiki/langs/sql.mjs"),
};
const names = {
  ts: "typescript",
  tsx: "tsx",
  js: "javascript",
  jsx: "jsx",
  json: "json",
  css: "css",
  md: "markdown",
  sql: "sql",
};

/** Only 200 lines are tokenized/serialized. No grammar or highlighter is sent to clients. */
export async function getHighlightedSource(
  id: string,
  file: string,
  line: number,
): Promise<SourcePage> {
  const { source, metadata } = await readArchitectureSource(id, file);
  const lines = source.split(/\r?\n/);
  const start =
    Math.floor((Math.max(1, Math.min(line, lines.length)) - 1) / 200) * 200;
  const text = lines.slice(start, start + 200).join("\n");
  const extension = file.split(".").pop() ?? "";
  const key =
    ({ mts: "ts", cts: "ts", mjs: "js", cjs: "js" } as Record<string, string>)[
      extension
    ] ?? extension;
  const known = key in grammars ? (key as keyof typeof grammars) : undefined;
  const engine = await highlighter;
  if (known) await engine.loadLanguage(await grammars[known]());
  const html = engine.codeToHtml(text, {
    lang: known ? names[known] : "text",
    theme: "github-dark",
    transformers: [
      {
        line(node, number) {
          const actual = start + number;
          node.properties.id = `source-L${actual}`;
          node.properties["data-line"] = actual;
          node.children.unshift({
            type: "element",
            tagName: "a",
            properties: {
              href: `#source-L${actual}`,
              class: "atlas-line-number",
              "aria-label": `Line ${actual}`,
            },
            children: [{ type: "text", value: String(actual) }],
          });
        },
      },
    ],
  });
  return {
    path: file,
    html,
    start: start + 1,
    total: lines.length,
    sourceUrl:
      metadata.sourceUrl + file.split("/").map(encodeURIComponent).join("/"),
  };
}
