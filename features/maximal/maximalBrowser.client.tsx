"use client";

import Editor, { type BeforeMount } from "@monaco-editor/react";
import { ChevronRight, FileCode2, Folder } from "lucide-react";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { CopyButton } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Node = { name: string; path: string; children: Node[] };

const repo = "DigitalHerencia/CodependentCoding";
const rawBase = `https://raw.githubusercontent.com/${repo}/main/template/`;
const blobBase = `https://github.com/${repo}/blob/main/template/`;
const defaultFile = "app/layout.tsx";

const layers: [RegExp, string][] = [
  [
    /^app\/api\//,
    "Webhook route: raw-body verify → idempotent persistence → ack",
  ],
  [/^app\//, "Route: owns the URL. Thin. Hands off to a feature."],
  [/^features\//, "Feature: orchestrates a capability and renders blocks."],
  [/^components\/ui\//, "Primitive: shadcn-derived UI control."],
  [/^components\//, "Presentation: renders. Knows nothing. Blissfully."],
  [/^lib\/fetchers\//, "Fetcher: auth → authz → scoped select → DTO."],
  [/^lib\/actions\//, "Action: auth → authz → Zod → write → invalidate."],
  [
    /^lib\/workflows\//,
    "Workflow: named application logic, no Prisma, no SDKs.",
  ],
  [/^lib\/db\//, "Database: transactions, selects, DTOs, RLS context."],
  [
    /^lib\/(auth|authz)\//,
    "Identity and access. Authentication never decides.",
  ],
  [
    /^lib\/integrations\//,
    "Integration: the only place a provider SDK may live.",
  ],
  [/^lib\//, "Library: cache, env, constants, utils, modules."],
  [/^schemas\//, "Schema: Zod, client- and server-safe."],
  [/^prisma\//, "Prisma: schema, RLS policies, seed."],
  [/^eslint\//, "Doctrine, compiled to lint rules."],
];

function buildTree(paths: string[]) {
  const root: Node = { name: "", path: "", children: [] };
  for (const file of paths) {
    let node = root;
    file.split("/").forEach((part, index, parts) => {
      let child = node.children.find((entry) => entry.name === part);
      if (!child) {
        child = {
          name: part,
          path: parts.slice(0, index + 1).join("/"),
          children: [],
        };
        node.children.push(child);
      }
      node = child;
    });
  }
  const sort = (node: Node) => {
    node.children.sort(
      (a, b) =>
        Number(b.children.length > 0) - Number(a.children.length > 0) ||
        a.name.localeCompare(b.name),
    );
    node.children.forEach(sort);
  };
  sort(root);
  return root.children;
}

function language(file: string) {
  if (/\.tsx?$/.test(file)) return "typescript";
  if (/\.m?jsx?$/.test(file)) return "javascript";
  if (file.endsWith(".json")) return "json";
  if (file.endsWith(".css")) return "css";
  if (file.endsWith(".md")) return "markdown";
  if (/\.ya?ml$/.test(file)) return "yaml";
  if (file.endsWith(".sql")) return "sql";
  return "plaintext";
}

const beforeMount: BeforeMount = (monaco) => {
  monaco.editor.defineTheme("codependent", {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "keyword", foreground: "5fb3c6" },
      { token: "string", foreground: "a8d8e2" },
      { token: "comment", foreground: "5b6b73", fontStyle: "italic" },
    ],
    colors: {
      "editor.background": "#000000",
      "editor.lineHighlightBackground": "#0d0a16",
      "editorLineNumber.foreground": "#2f7a8d",
      "editor.selectionBackground": "#2f7a8d55",
    },
  });
};

function TreeNode({
  node,
  active,
  open,
  onSelect,
}: {
  node: Node;
  active: string;
  open: boolean;
  onSelect: (file: string) => void;
}) {
  if (node.children.length === 0) {
    return (
      <li>
        <button
          type="button"
          onClick={() => onSelect(node.path)}
          className={cn(
            "flex w-full cursor-pointer items-center gap-1.5 border-0 bg-transparent py-0.5 text-left text-xs",
            node.path === active
              ? "text-signal"
              : "text-foreground-muted hover:text-foreground",
          )}
        >
          <FileCode2 aria-hidden="true" className="size-3.5 shrink-0" />
          {node.name}
        </button>
      </li>
    );
  }
  return (
    <li>
      <details
        open={open || active.startsWith(`${node.path}/`)}
        className="group"
      >
        <summary className="flex cursor-pointer list-none items-center gap-1.5 py-0.5 text-xs text-foreground">
          <ChevronRight
            aria-hidden="true"
            className="size-3 shrink-0 transition-transform group-open:rotate-90"
          />
          <Folder
            aria-hidden="true"
            className="size-3.5 shrink-0 text-signal"
          />
          {node.name}
        </summary>
        <ul className="m-0 list-none pl-4">
          {node.children.map((child) => (
            <TreeNode
              key={child.path}
              node={child}
              active={active}
              open={open}
              onSelect={onSelect}
            />
          ))}
        </ul>
      </details>
    </li>
  );
}

export function MaximalBrowser({ files }: { files: string[] }) {
  const [chosen, setActive] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [loaded, setLoaded] = useState({ file: "", text: "" });
  const requested = useSyncExternalStore(
    () => () => {},
    () => new URLSearchParams(window.location.search).get("file"),
    () => null,
  );
  const active =
    chosen ??
    (requested && files.includes(requested) ? requested : defaultFile);
  const source = loaded.file === active ? loaded.text : "Loading…";

  useEffect(() => {
    let cancelled = false;
    fetch(rawBase + active)
      .then((response) => (response.ok ? response.text() : Promise.reject()))
      .catch(() => "// Could not load this file. Provenance is latency.")
      .then((text) => {
        if (!cancelled) setLoaded({ file: active, text });
      });
    const url = new URL(window.location.href);
    url.searchParams.set("file", active);
    window.history.replaceState(null, "", url);
    return () => {
      cancelled = true;
    };
  }, [active]);

  const needle = query.trim().toLowerCase();
  const tree = useMemo(
    () =>
      buildTree(
        needle
          ? files.filter((file) => file.toLowerCase().includes(needle))
          : files,
      ),
    [files, needle],
  );
  const layer =
    layers.find(([pattern]) => pattern.test(active))?.[1] ??
    "Configuration. Load-bearing, unfortunately.";

  return (
    <div className="mx-auto grid max-w-7xl border border-signal-border md:grid-cols-[17rem_minmax(0,1fr)]">
      <aside className="max-h-80 overflow-y-auto border-b border-signal-border p-3 md:max-h-[75vh] md:border-r md:border-b-0">
        <label className="sr-only" htmlFor="maximal-filter">
          Filter files
        </label>
        <input
          id="maximal-filter"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={`Filter ${files.length} files…`}
          className="mb-3 w-full border border-signal-border bg-background-strong px-3 py-2 text-xs text-foreground focus-visible:ring-2 focus-visible:ring-signal focus-visible:outline-none"
        />
        <ul className="m-0 list-none p-0">
          {tree.map((node) => (
            <TreeNode
              key={node.path}
              node={node}
              active={active}
              open={needle.length > 0}
              onSelect={setActive}
            />
          ))}
        </ul>
      </aside>
      <section className="min-w-0">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-signal-border px-4 py-2">
          <code className="truncate text-xs text-foreground">
            template/{active}
          </code>
          <span className="flex gap-2">
            <CopyButton value={source} />
            <a
              className="border border-signal-border px-3 py-1.5 text-xs text-foreground uppercase no-underline hover:border-signal"
              href={blobBase + active}
            >
              GitHub
            </a>
          </span>
        </header>
        <p className="m-0 border-b border-signal-border px-4 py-2 text-xs text-signal">
          {layer}
        </p>
        <Editor
          height="65vh"
          theme="codependent"
          beforeMount={beforeMount}
          path={active}
          language={language(active)}
          value={source}
          options={{
            readOnly: true,
            minimap: { enabled: false },
            fontSize: 13,
            fontFamily: "Fira Code, JetBrains Mono, monospace",
            scrollBeyondLastLine: false,
          }}
        />
      </section>
    </div>
  );
}
