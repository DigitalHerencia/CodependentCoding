import "server-only";

import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { Marked } from "marked";
import { parse } from "yaml";
import type {
  DoctrineDoc,
  DoctrineHeading,
  DoctrineNavGroup,
} from "@/types/doctrineTypes";

// Build-time reads of the repo's own doctrine files; every page is static.
const books = [
  {
    key: "knowledge",
    title: "The Book of Knowledge™",
    dir: "context/doctrine/TypeScripture_The-Book-of-Knowledge",
  },
  {
    key: "implementation",
    title: "The Book of Implementation™",
    dir: "context/doctrine/TypeScripture_The-Book-of-Implementation",
  },
] as const;

type Source = { slug: string; group: string; title: string; markdown: string };

function toId(text: string) {
  return text
    .toLowerCase()
    .replace(/<[^>]+>/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function render(markdown: string) {
  const headings: DoctrineHeading[] = [];
  const marked = new Marked({
    renderer: {
      heading({ tokens, depth }) {
        const text = this.parser.parseInline(tokens);
        const id = toId(text);
        if (depth <= 3)
          headings.push({ id, text: text.replace(/<[^>]+>/g, ""), depth });
        return `<h${depth} id="${id}">${text}</h${depth}>`;
      },
    },
  });
  const html = marked.parse(markdown, { async: false });
  return { html, headings };
}

async function read(file: string) {
  return readFile(
    path.join(/* turbopackIgnore: true */ process.cwd(), file),
    "utf8",
  );
}

async function startSource(): Promise<Source> {
  const readme = await read("context/doctrine/README.md");
  return {
    slug: "",
    group: "Start here",
    title: "TypeScripture™",
    markdown: readme.replace(/^# .*\n/, ""),
  };
}

async function architectureSources(): Promise<Source[]> {
  const text = await read("context/docs/Architecture.md");
  return text
    .split(/^## /m)
    .slice(1)
    .map((chunk) => {
      const [heading = "", ...body] = chunk.split("\n");
      const title = heading.replace(/^[\d.]+\s*/, "").trim();
      return {
        slug: `architecture/${toId(title)}`,
        group: "Architecture",
        title,
        markdown: body.join("\n"),
      };
    });
}

async function rulesSource(): Promise<Source> {
  const contract = parse(await read(".claude/contracts/validation.yaml")) as {
    rules: { id: string; layer?: string; text: string; enforcement: string }[];
  };
  const rows = contract.rules.map(
    (rule) =>
      `| \`${rule.id}\` | ${rule.layer ?? ""} | ${rule.text.replace(/\|/g, "\\|")} | \`${rule.enforcement}\` |`,
  );
  return {
    slug: "rules",
    group: "Architecture",
    title: "The CC-* rules",
    markdown: [
      "Every lint finding prints one of these IDs. Fix the cause; the rule is not negotiable, only amendable (one PR, labeled `doctrine`).",
      "",
      "| ID | Layer | Rule | Enforcement |",
      "| --- | --- | --- | --- |",
      ...rows,
    ].join("\n"),
  };
}

async function bookSources(): Promise<Source[]> {
  const sources = await Promise.all(
    books.map(async (book) => {
      const files = (
        await readdir(
          path.join(/* turbopackIgnore: true */ process.cwd(), book.dir),
        )
      )
        .filter((file) => file.endsWith(".md"))
        .sort();
      return Promise.all(
        files.map(async (file) => {
          const text = await read(`${book.dir}/${file}`);
          const heading = /^# (.*)$/m.exec(text)?.[1] ?? file;
          return {
            slug: `${book.key}/${toId(file.replace(/\.md$/, ""))}`,
            group: book.title,
            title: heading.replace(/^Chapter\s+(\d+):\s*/, "$1 · "),
            markdown: text
              .replace(/^# .*\n/m, "")
              .replace(/^\*\*The Book of [^*]+\*\*\n/m, ""),
          };
        }),
      );
    }),
  );
  return sources.flat();
}

function navItem(source: Source | undefined) {
  return source ? { slug: source.slug, title: source.title } : null;
}

async function allSources() {
  const [start, architecture, rules, chapters] = await Promise.all([
    startSource(),
    architectureSources(),
    rulesSource(),
    bookSources(),
  ]);
  return [start, ...architecture, rules, ...chapters];
}

export async function getDoctrineNav(): Promise<DoctrineNavGroup[]> {
  const groups: DoctrineNavGroup[] = [];
  for (const source of await allSources()) {
    let group = groups.find((entry) => entry.title === source.group);
    if (!group) {
      group = { title: source.group, items: [] };
      groups.push(group);
    }
    group.items.push({ slug: source.slug, title: source.title });
  }
  return groups;
}

export async function getDoctrineSlugs() {
  return (await allSources())
    .map((source) => source.slug)
    .filter((slug) => slug !== "");
}

export async function getDoctrineDoc(
  slug: string,
): Promise<DoctrineDoc | null> {
  const sources = await allSources();
  const index = sources.findIndex((source) => source.slug === slug);
  const source = sources[index];
  if (!source) return null;
  return {
    slug: source.slug,
    group: source.group,
    title: source.title,
    ...render(source.markdown),
    previous: navItem(sources[index - 1]),
    next: navItem(sources[index + 1]),
  };
}
