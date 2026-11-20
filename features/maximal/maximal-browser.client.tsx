"use client";

import Editor, { type BeforeMount } from "@monaco-editor/react";
import { ChevronRight, FileCode2, Folder } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  useMemo,
  useRef,
  useState,
  useTransition,
  type CSSProperties,
  type PointerEvent,
  type KeyboardEvent,
} from "react";
import {
  AnthimeriaArchitectureMap,
  type MapView,
} from "@/components/blocks/anthimeria-architecture-map";
import { CopyButton } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Node = { name: string; path: string; children: Node[] };
type Pane = "map" | "code";

const blobBase = "https://github.com/DigitalHerencia/CodependentCoding/blob/main/packages/maximal-template/";

const layers: [RegExp, string][] = [
  [/^app\/api\//, "HTTP boundary: webhook request ingress."],
  [/^app\//, "Route boundary: URL ownership and feature composition."],
  [/^features\//, "Feature: connects application workflows and presentation."],
  [/^components\/ui\//, "UI primitive: an individual accessible control."],
  [/^components\/blocks\//, "Presentation block: composes primitives."],
  [/^components\/templates\//, "Page template: composes blocks."],
  [/^components\//, "Presentation: layout, navigation, and shared display."],
  [/^lib\/workflows\//, "Workflow: use-case orchestration."],
  [/^lib\/fetchers\//, "Fetcher: authenticated tenant-scoped read."],
  [/^lib\/actions\//, "Action: validated, authorized server mutation."],
  [/^lib\/db\//, "Persistence: DTOs, selects, transactions, and RLS."],
  [/^lib\/integrations\//, "Integration: external provider adapter."],
  [/^lib\/(auth|authz)\//, "Authentication and authorization."],
  [/^schemas\//, "Schema: runtime validation and input contracts."],
  [/^types\//, "Types: shape contracts for application data."],
  [/^prisma\//, "Prisma schema, policies, and migrations."],
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
  if (file.endsWith(".prisma")) return "plaintext";
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
              ? "text-signal-text"
              : "text-muted-foreground hover:text-foreground",
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
        open={open || active.startsWith(node.path + "/") || undefined}
        className="group"
      >
        <summary className="flex cursor-pointer list-none items-center gap-1.5 py-0.5 text-xs text-foreground">
          <ChevronRight
            aria-hidden="true"
            className="size-3 shrink-0 transition-transform group-open:rotate-90"
          />
          <Folder
            aria-hidden="true"
            className="size-3.5 shrink-0 text-signal-text"
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

/** X-axis splitter with pointer/touch capture and keyboard adjustment. */
function useHorizontalSplitter() {
  const workspaceRef = useRef<HTMLDivElement>(null);
  const [sidebarWidth, setSidebarWidth] = useState(280);

  function resizeFromPointer(event: PointerEvent<HTMLDivElement>) {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
    const bounds = workspaceRef.current?.getBoundingClientRect();
    if (!bounds) return;
    setSidebarWidth(
      Math.max(190, Math.min(event.clientX - bounds.left, bounds.width - 300)),
    );
  }

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    resizeFromPointer(event);
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      const delta = event.key === "ArrowLeft" ? -20 : 20;
      setSidebarWidth((value) => Math.max(190, Math.min(650, value + delta)));
    } else if (event.key === "Home") {
      event.preventDefault();
      setSidebarWidth(190);
    } else if (event.key === "End") {
      event.preventDefault();
      setSidebarWidth(650);
    }
  }

  return {
    workspaceRef,
    sidebarWidth,
    resizeFromPointer,
    onPointerDown,
    onKeyDown,
  };
}

export function MaximalBrowser({
  files,
  active,
  source,
}: {
  files: string[];
  active: string;
  source: string;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isPending, startTransition] = useTransition();
  const [pane, setPane] = useState<Pane>("map");
  const [mapView, setMapView] = useState<MapView>("system");
  const splitter = useHorizontalSplitter();

  function selectFile(file: string) {
    setPane("code");
    startTransition(() => {
      router.replace("/anthimeria?file=" + encodeURIComponent(file), {
        scroll: false,
      });
    });
  }

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
    "Application configuration or infrastructure.";

  const workspaceStyle = {
    "--anthimeria-sidebar-width": splitter.sidebarWidth + "px",
  } as CSSProperties;

  return (
    <div
      ref={splitter.workspaceRef}
      style={workspaceStyle}
      className="anthimeria-workspace mx-auto max-w-7xl border border-border"
    >
      <aside className="anthimeria-explorer min-w-0 overflow-y-auto border-b border-border p-3 md:max-h-[78vh] md:border-b-0">
        <label className="sr-only" htmlFor="anthimeria-filter">
          Filter source files
        </label>
        <input
          id="anthimeria-filter"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={"Filter " + files.length + " files…"}
          className="mb-3 w-full border border-border bg-background-strong px-3 py-2 text-xs text-foreground focus-visible:ring-2 focus-visible:ring-signal focus-visible:outline-none"
        />
        <ul className="m-0 list-none p-0">
          {tree.map((node) => (
            <TreeNode
              key={node.path}
              node={node}
              active={active}
              open={needle.length > 0}
              onSelect={selectFile}
            />
          ))}
        </ul>
      </aside>
      <div
        role="separator"
        tabIndex={0}
        aria-label="Resize source explorer horizontally"
        aria-orientation="vertical"
        aria-valuemin={190}
        aria-valuemax={650}
        aria-valuenow={splitter.sidebarWidth}
        className="anthimeria-resize-handle"
        onPointerDown={splitter.onPointerDown}
        onPointerMove={splitter.resizeFromPointer}
        onPointerUp={(event) => {
          if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
          }
        }}
        onPointerCancel={(event) => {
          if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
          }
        }}
        onKeyDown={splitter.onKeyDown}
      >
        <span aria-hidden="true" />
      </div>
      <section className="anthimeria-inspection min-w-0">
        <header className="anthimeria-inspection-header flex flex-wrap items-center justify-between gap-3 border-b border-border px-3 py-2">
          <code className="min-w-0 flex-1 truncate text-xs text-foreground">
            template/{active}
          </code>
          <div className="flex flex-wrap items-center gap-1.5">
            <div role="tablist" aria-label="Source viewer modes" className="anthimeria-view-tabs">
              <button
                type="button"
                role="tab"
                aria-selected={pane === "map"}
                aria-controls="anthimeria-map-panel"
                id="anthimeria-map-tab"
                onClick={() => setPane("map")}
                className="anthimeria-view-tab"
              >
                Map
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={pane === "code"}
                aria-controls="anthimeria-code-panel"
                id="anthimeria-code-tab"
                onClick={() => setPane("code")}
                className="anthimeria-view-tab"
              >
                Code
              </button>
            </div>
            <CopyButton
              value={isPending ? "" : source}
              className="anthimeria-utility-button"
            />
            <a
              className="anthimeria-utility-button inline-flex items-center border border-border px-2 py-1.5 text-xs text-foreground uppercase no-underline hover:border-signal"
              href={blobBase + active}
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
          </div>
        </header>
        <p className="m-0 border-b border-border px-3 py-2 text-xs text-signal-text">
          {pane === "map"
            ? "CONSTITUTED SYSTEM / FILE OWNERSHIP / READ + WRITE TRACES"
            : layer}
        </p>
        <div
          id="anthimeria-map-panel"
          role="tabpanel"
          aria-labelledby="anthimeria-map-tab"
          hidden={pane !== "map"}
        >
          {pane === "map" && (
            <AnthimeriaArchitectureMap
              files={files}
              active={active}
              selectFile={selectFile}
              view={mapView}
              setView={setMapView}
            />
          )}
        </div>
        <div
          id="anthimeria-code-panel"
          role="tabpanel"
          aria-labelledby="anthimeria-code-tab"
          hidden={pane !== "code"}
        >
          {pane === "code" && (
            <Editor
              height="65vh"
              theme="codependent"
              beforeMount={beforeMount}
              path={active}
              language={language(active)}
              value={isPending ? "// Loading source…" : source}
              options={{
                readOnly: true,
                automaticLayout: true,
                minimap: { enabled: false },
                fontSize: 13,
                fontFamily: "Fira Code, JetBrains Mono, monospace",
                scrollBeyondLastLine: false,
              }}
            />
          )}
        </div>
      </section>
    </div>
  );
}
