import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import type { ReactNode } from 'react';

export type TypeScriptureBookId = 'knowledge' | 'implementation';
const roots: Record<TypeScriptureBookId, string> = {
  knowledge: 'TypeScripture_The-Book-of-Knowledge',
  implementation: 'TypeScripture_The-Book-of-Implementation',
};
export const typescriptureBooks = {
  knowledge: {
    label: 'Book of Knowledge',
    shortLabel: 'Knowledge',
    description:
      'Canonical meaning, invariants, relationships, and decision rules.',
  },
  implementation: {
    label: 'Book of Implementation',
    shortLabel: 'Implementation',
    description:
      'Canonical placement, interfaces, workflows, and executable realization.',
  },
} as const;
const contentRoot = path.join(process.cwd(), 'content');
const filenames = readdirSync(path.join(contentRoot, roots.knowledge))
  .filter((name) => /^Chapter-\d{2}.*\.md$/.test(name))
  .sort();
export const typescriptureChapters = filenames.map((filename) => {
  const match = /^Chapter-(\d{2})\.([^.]*)/.exec(filename);
  const chapter = match?.[1] ?? '00';
  const title = (match?.[2] ?? filename).replaceAll('-', ' ');
  return {
    chapter,
    title,
    filename,
    implementation_axis: 'Meaning → realization',
    implementation_term: title,
  };
});
export const typescriptureStats = {
  books: 2,
  pairedChapters: typescriptureChapters.length,
  sourceFiles: typescriptureChapters.length * 2,
};
export function getTypeScriptureStaticParams() {
  return [
    { slug: [] },
    ...(['knowledge', 'implementation'] as const).flatMap((book) =>
      typescriptureChapters.map(({ chapter }) => ({ slug: [book, chapter] })),
    ),
  ];
}
export function getTypeScripturePage(slug: string[]) {
  const [bookValue, chapterValue] = slug;
  if (
    (bookValue !== 'knowledge' && bookValue !== 'implementation') ||
    !chapterValue
  )
    return undefined;
  const book = bookValue as TypeScriptureBookId;
  const chapter = typescriptureChapters.find(
    (item) => item.chapter === chapterValue,
  );
  if (!chapter) return undefined;
  const sourcePath = path.join(contentRoot, roots[book]!, chapter.filename);
  return {
    book,
    chapter,
    sourcePath,
    source: readFileSync(sourcePath, 'utf8'),
  };
}
function inline(value: string) {
  return value
    .split(/(`[^`]+`|\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*)/g)
    .map((part, index) => {
      if (part.startsWith('`'))
        return <code key={index}>{part.slice(1, -1)}</code>;
      const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
      if (link)
        return (
          <a key={index} href={link[2]}>
            {link[1]}
          </a>
        );
      if (part.startsWith('**'))
        return <strong key={index}>{part.slice(2, -2)}</strong>;
      return part;
    });
}
export function renderDocumentation(markdown: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let code: string[] | null = null;
  markdown.split(/\r?\n/).forEach((line, index) => {
    if (line.startsWith('```')) {
      if (code) {
        nodes.push(
          <pre key={`c${index}`}>
            <code>{code.join('\n')}</code>
          </pre>,
        );
        code = null;
      } else code = [];
      return;
    }
    if (code) {
      code.push(line);
      return;
    }
    const heading = /^(#{1,4})\s+(.+)$/.exec(line);
    if (heading) {
      const level = heading[1]!.length;
      const Tag =
        `h${Math.min(level + 1, 6)}` as keyof React.JSX.IntrinsicElements;
      nodes.push(<Tag key={index}>{inline(heading[2]!)}</Tag>);
      return;
    }
    if (/^[-*]\s+/.test(line)) {
      nodes.push(<li key={index}>{inline(line.slice(2))}</li>);
      return;
    }
    if (line.startsWith('> ')) {
      nodes.push(<blockquote key={index}>{inline(line.slice(2))}</blockquote>);
      return;
    }
    if (line.trim() && line !== '---')
      nodes.push(<p key={index}>{inline(line)}</p>);
  });
  return nodes;
}
