import 'server-only';
import fs from 'node:fs';
import path from 'node:path';
import type { ReactNode } from 'react';

export type TypeScriptureBookId = 'knowledge' | 'implementation';

type ChapterMapEntry = {
  chapter: string;
  file: string;
  implementation_axis: string;
  implementation_term: string;
  knowledge_classes: [string, string][];
  knowledge_output: string;
  implementation_output: string;
};

export type TypeScriptureChapter = ChapterMapEntry & {
  title: string;
};

export type TypeScripturePage = {
  book: TypeScriptureBookId;
  chapter: TypeScriptureChapter;
  source: string;
  sourcePath: string;
};

export const typescriptureBooks = {
  knowledge: {
    id: 'knowledge',
    label: 'The Book of Knowledge™',
    shortLabel: 'Knowledge',
    description:
      'Meaning, conceptual authority, classification, constraints, and valid evidence.',
  },
  implementation: {
    id: 'implementation',
    label: 'The Book of Implementation™',
    shortLabel: 'Implementation',
    description:
      'Concrete architectures, contracts, schemas, patterns, workflows, and executable boundaries.',
  },
} as const;

const rootCandidates = [
  path.resolve(process.cwd(), 'context/10-authority/typescripture'),
  path.resolve(process.cwd(), '../../context/10-authority/typescripture'),
];

const typescriptureRoot = rootCandidates.find((candidate) =>
  fs.existsSync(path.join(candidate, '00-Chapter-Map.json')),
);

if (!typescriptureRoot) {
  throw new Error(
    'TypeScripture authority is unavailable: context/10-authority/typescripture/00-Chapter-Map.json was not found.',
  );
}
const authorityRoot: string = typescriptureRoot;

const chapterMap = JSON.parse(
  fs.readFileSync(path.join(authorityRoot, '00-Chapter-Map.json'), 'utf8'),
) as ChapterMapEntry[];

function titleFromFile(file: string): string {
  return file
    .replace(/^Chapter-\d+\./, '')
    .replace(/\.md$/, '')
    .replaceAll('-', ' ');
}

export const typescriptureChapters: readonly TypeScriptureChapter[] =
  chapterMap.map((entry) => ({
    ...entry,
    title: titleFromFile(entry.file),
  }));

const chapterNumbers = new Set(
  typescriptureChapters.map(({ chapter }) => chapter),
);
if (typescriptureChapters.length !== 24 || chapterNumbers.size !== 24) {
  throw new Error(
    `TypeScripture chapter map must contain 24 unique chapters; received ${typescriptureChapters.length} entries and ${chapterNumbers.size} unique identifiers.`,
  );
}

for (const chapter of typescriptureChapters) {
  for (const relativePath of [
    chapter.knowledge_output,
    chapter.implementation_output,
  ]) {
    if (!fs.existsSync(path.join(authorityRoot, relativePath))) {
      throw new Error(
        `TypeScripture chapter source is missing: ${relativePath}`,
      );
    }
  }
}

export const typescriptureStats = {
  books: 2,
  pairedChapters: typescriptureChapters.length,
  sourceFiles: typescriptureChapters.length * 2,
} as const;

export function getTypeScriptureStaticParams(): { slug: string[] }[] {
  return [
    { slug: [] },
    ...typescriptureChapters.flatMap(({ chapter }) => [
      { slug: ['knowledge', chapter] },
      { slug: ['implementation', chapter] },
    ]),
  ];
}

export function getTypeScripturePage(
  slug: readonly string[],
): TypeScripturePage | null {
  if (slug.length !== 2) return null;
  const [book, chapterNumber] = slug;
  if (book !== 'knowledge' && book !== 'implementation') return null;
  const chapter = typescriptureChapters.find(
    (candidate) => candidate.chapter === chapterNumber,
  );
  if (!chapter) return null;

  const sourcePath = (
    book === 'knowledge'
      ? chapter.knowledge_output
      : chapter.implementation_output
  ) as string;
  if (!sourcePath) return null;

  return {
    book,
    chapter,
    source: fs.readFileSync(path.join(authorityRoot, sourcePath), 'utf8'),
    sourcePath,
  };
}

function stripFrontmatter(source: string): string {
  const normalized = source.replace(/\r\n/g, '\n');
  if (!normalized.startsWith('---\n')) return normalized;
  const closing = normalized.indexOf('\n---\n', 4);
  return closing === -1 ? normalized : normalized.slice(closing + 5);
}

function reconcileActiveIdentity(source: string): string {
  return source
    .replaceAll(
      'Codependent Coding™ Knowledge System',
      'TypeScripture™ Canonical Doctrine',
    )
    .replaceAll(
      'Codependent Coding Knowledge System',
      'TypeScripture™ Canonical Doctrine',
    );
}

function slugifyHeading(value: string): string {
  return value
    .replace(/[`*_~]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function inline(value: string): ReactNode[] {
  const parts = value.split(
    /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g,
  );

  return parts.map((part, index) => {
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      const [, label, href] = link;
      if (href!.startsWith('#') || /^(https?:|mailto:)/.test(href!)) {
        return (
          <a key={index} href={href}>
            {label}
          </a>
        );
      }
      return (
        <span className="source-reference" key={index} title={href}>
          {label}
        </span>
      );
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={index}>{part.slice(1, -1)}</code>;
    }
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={index}>{part.slice(1, -1)}</em>;
    }
    return part;
  });
}

function tableCells(line: string): string[] {
  return line
    .trim()
    .replace(/^\||\|$/g, '')
    .split('|')
    .map((cell) => cell.trim());
}

export function renderDocumentation(source: string): ReactNode[] {
  const reconciled = reconcileActiveIdentity(stripFrontmatter(source)).trim();
  const lines = reconciled.split('\n');

  if (!lines.some((line) => /^(#{1,4})\s+/.test(line))) {
    return [
      <pre data-language="yaml" key="structured-source">
        <code>{reconciled}</code>
      </pre>,
    ];
  }

  const output: ReactNode[] = [];
  const headingIds = new Map<string, number>();
  let index = 0;

  while (index < lines.length) {
    const line = lines[index]!;
    if (!line.trim()) {
      index += 1;
      continue;
    }

    if (line.startsWith('```')) {
      const language = line.slice(3).trim();
      const code: string[] = [];
      index += 1;
      while (index < lines.length && !lines[index]!.startsWith('```')) {
        code.push(lines[index]!);
        index += 1;
      }
      output.push(
        <pre key={output.length} data-language={language || undefined}>
          <code>{code.join('\n')}</code>
        </pre>,
      );
      index += 1;
      continue;
    }

    const heading = line.match(/^(#{1,4})\s+(.+)$/);
    if (heading) {
      const level = heading[1]!.length;
      const label = heading[2]!;
      const baseId = slugifyHeading(label) || `section-${output.length + 1}`;
      const duplicate = headingIds.get(baseId) ?? 0;
      headingIds.set(baseId, duplicate + 1);
      const id = duplicate ? `${baseId}-${duplicate + 1}` : baseId;
      const content = inline(label);
      const key = output.length;
      output.push(
        level === 1 ? (
          <h1 id={id} key={key}>
            {content}
          </h1>
        ) : level === 2 ? (
          <h2 id={id} key={key}>
            {content}
          </h2>
        ) : level === 3 ? (
          <h3 id={id} key={key}>
            {content}
          </h3>
        ) : (
          <h4 id={id} key={key}>
            {content}
          </h4>
        ),
      );
      index += 1;
      continue;
    }

    if (
      line.trim().startsWith('|') &&
      /^\s*\|?(?:\s*:?-+:?\s*\|)+\s*$/.test(lines[index + 1] ?? '')
    ) {
      const headers = tableCells(line);
      const rows: string[][] = [];
      index += 2;
      while (index < lines.length && lines[index]!.trim().startsWith('|')) {
        rows.push(tableCells(lines[index]!));
        index += 1;
      }
      output.push(
        <div className="docs-table-wrap" key={output.length}>
          <table>
            <thead>
              <tr>
                {headers.map((cell, cellIndex) => (
                  <th key={cellIndex}>{inline(cell)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex}>{inline(cell)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>,
      );
      continue;
    }

    const unordered = line.match(/^[-*]\s+(.+)$/);
    if (unordered) {
      const items: ReactNode[] = [];
      while (index < lines.length) {
        const item = lines[index]!.match(/^[-*]\s+(.+)$/);
        if (!item) break;
        items.push(<li key={items.length}>{inline(item[1]!)}</li>);
        index += 1;
      }
      output.push(<ul key={output.length}>{items}</ul>);
      continue;
    }

    const ordered = line.match(/^\d+\.\s+(.+)$/);
    if (ordered) {
      const items: ReactNode[] = [];
      while (index < lines.length) {
        const item = lines[index]!.match(/^\d+\.\s+(.+)$/);
        if (!item) break;
        items.push(<li key={items.length}>{inline(item[1]!)}</li>);
        index += 1;
      }
      output.push(<ol key={output.length}>{items}</ol>);
      continue;
    }

    if (line.startsWith('> ')) {
      const quote: string[] = [];
      while (index < lines.length && lines[index]!.startsWith('> ')) {
        quote.push(lines[index]!.slice(2));
        index += 1;
      }
      output.push(
        <blockquote key={output.length}>{inline(quote.join(' '))}</blockquote>,
      );
      continue;
    }

    if (/^\s*(---|___|\*\*\*)\s*$/.test(line)) {
      output.push(<hr key={output.length} />);
      index += 1;
      continue;
    }

    const paragraph = [line];
    index += 1;
    while (
      index < lines.length &&
      lines[index]!.trim() &&
      !/^(#{1,4})\s|^[-*]\s|^\d+\.\s|^```|^>\s|^\|/.test(lines[index]!)
    ) {
      paragraph.push(lines[index]!);
      index += 1;
    }
    output.push(<p key={output.length}>{inline(paragraph.join(' '))}</p>);
  }

  return output;
}
