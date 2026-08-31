'use client';
import Editor from '@monaco-editor/react';
import { useState } from 'react';
import type { SourceNode } from '@/lib/maximal';
function language(path: string) {
  const ext = path.split('.').pop();
  return (
    (
      {
        ts: 'typescript',
        tsx: 'typescript',
        js: 'javascript',
        jsx: 'javascript',
        json: 'json',
        md: 'markdown',
        css: 'css',
        prisma: 'plaintext',
        sql: 'sql',
        yaml: 'yaml',
        yml: 'yaml',
      } as Record<string, string>
    )[ext ?? ''] ?? 'plaintext'
  );
}
function Tree({
  nodes,
  select,
}: {
  nodes: SourceNode[];
  select: (path: string) => void;
}) {
  return (
    <>
      {nodes.map((node) =>
        node.type === 'directory' ? (
          <details key={node.path}>
            <summary>{node.name}/</summary>
            <div className="tree-children">
              <Tree nodes={node.children ?? []} select={select} />
            </div>
          </details>
        ) : (
          <button key={node.path} onClick={() => select(node.path)}>
            {node.name}
          </button>
        ),
      )}
    </>
  );
}
export function MaximalBrowser({
  tree,
  initialPath,
  initialSource,
}: {
  tree: SourceNode[];
  initialPath: string;
  initialSource: string;
}) {
  const [selected, setSelected] = useState(initialPath);
  const [source, setSource] = useState(initialSource);
  const [message, setMessage] = useState('');
  async function select(sourcePath: string) {
    setMessage('Loading…');
    const response = await fetch(
      `/maximal-template/source?path=${encodeURIComponent(sourcePath)}`,
    );
    const data = (await response.json()) as { source?: string; error?: string };
    if (!response.ok || data.source === undefined) {
      setMessage(data.error ?? 'Source unavailable.');
      return;
    }
    setSelected(sourcePath);
    setSource(data.source);
    setMessage('');
  }
  return (
    <section className="maximal-browser">
      <aside>
        <strong>template/</strong>
        <div className="source-tree">
          <Tree nodes={tree} select={select} />
        </div>
      </aside>
      <article>
        <header>
          <code>template/{selected}</code>
          <button
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(source);
                setMessage('Copied current file.');
              } catch {
                setMessage('Copy failed.');
              }
            }}
          >
            Copy file
          </button>
        </header>
        {message && (
          <p className="source-message" role="status">
            {message}
          </p>
        )}
        <Editor
          height="100%"
          language={language(selected)}
          value={source}
          theme="vs-dark"
          options={{
            readOnly: true,
            minimap: { enabled: false },
            fontFamily: 'Fira Code, monospace',
            fontSize: 13,
            wordWrap: 'off',
            scrollBeyondLastLine: false,
          }}
        />
      </article>
    </section>
  );
}
