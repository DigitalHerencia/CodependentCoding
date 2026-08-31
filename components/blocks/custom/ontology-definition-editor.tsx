'use client';

import Editor from '@monaco-editor/react';

export function OntologyDefinitionEditor({ source }: { source: string }) {
  return (
    <section className="ontology-definition-editor">
      <header>
        <h2>Ontology definition</h2>
        <code>local normalized definition</code>
      </header>
      <Editor
        height="32rem"
        language="json"
        value={source}
        theme="vs-dark"
        options={{
          readOnly: true,
          minimap: { enabled: false },
          fontFamily: 'Fira Code, monospace',
          fontSize: 13,
          wordWrap: 'on',
          scrollBeyondLastLine: false,
        }}
      />
    </section>
  );
}
