"use client";

import { memo, useRef, useState } from "react";
import type { ArchitectureGraph, GraphNode } from "@/types/architectureTypes";

export const AnthimeriaArchitectureMap = memo(
  function AnthimeriaArchitectureMap({
    graph,
    navigate,
    openSource,
  }: {
    graph: ArchitectureGraph;
    navigate: (scope: string) => void;
    openSource: (path: string, line?: number) => void;
  }) {
    const [zoom, setZoom] = useState(1);
    const viewport = useRef<HTMLDivElement>(null);
    const root = graph.nodes[0]!;
    const children = graph.nodes.slice(1);
    const columns = Math.min(3, Math.max(1, children.length));
    const width = columns * 264 + 48;
    const height = Math.max(
      340,
      Math.ceil(children.length / columns) * 132 + 190,
    );
    const position = (id: string) => {
      if (id === root.id) return { x: width / 2 - 120, y: 26 };
      const index = children.findIndex((node) => node.id === id);
      return {
        x: 36 + (index % columns) * 264,
        y: 196 + Math.floor(index / columns) * 132,
      };
    };
    const card = (node: GraphNode, parent: boolean) => {
      const p = position(node.id);
      return (
        <article
          key={node.id}
          className={`atlas-node ${parent ? "atlas-parent" : ""}`}
          style={{ left: p.x, top: p.y }}
          data-node={node.id}
        >
          <span className="atlas-node-kind">
            {parent
              ? "CURRENT BOUNDARY"
              : node.kind === "directory"
                ? "DIRECTORY"
                : "SOURCE FILE"}
          </span>
          <button
            type="button"
            title={node.id || graph.source.label}
            className="atlas-node-title"
            onClick={() =>
              node.kind === "directory"
                ? navigate(node.id)
                : openSource(node.id)
            }
          >
            {node.label}
            {node.kind === "directory" ? "/" : ""}
          </button>
          <div className="atlas-node-meta">
            {node.kind === "directory"
              ? `${node.count} source files`
              : node.id.split("/").slice(0, -1).join("/") || "Repository root"}
          </div>
          {!parent && (
            <button
              className="atlas-node-action"
              type="button"
              onClick={() => navigate(node.id)}
            >
              {node.kind === "directory"
                ? "Explore boundary →"
                : "Inspect relationships →"}
            </button>
          )}
          {parent && node.kind === "file" && (
            <button
              className="atlas-node-action"
              type="button"
              onClick={() => openSource(node.id)}
            >
              Read source →
            </button>
          )}
        </article>
      );
    };
    return (
      <>
        <div className="atlas-map-toolbar">
          <span>
            {graph.ontology === "containment"
              ? "↓ Contains"
              : graph.ontology === "imports"
                ? "→ Imports"
                : "→ Renders"}{" "}
            · {children.length} of {graph.total} entries
          </span>
          <div className="atlas-zoom" aria-label="Graph zoom">
            <button
              type="button"
              aria-label="Zoom out"
              disabled={zoom <= 0.75}
              onClick={() => setZoom((value) => Math.max(0.75, value - 0.25))}
            >
              −
            </button>
            <button
              type="button"
              aria-label="Reset graph view"
              onClick={() => {
                setZoom(1);
                viewport.current?.scrollTo({ left: 0, top: 0 });
              }}
            >
              {Math.round(zoom * 100)}%
            </button>
            <button
              type="button"
              aria-label="Zoom in"
              disabled={zoom >= 1.5}
              onClick={() => setZoom((value) => Math.min(1.5, value + 0.25))}
            >
              +
            </button>
          </div>
        </div>
        <div
          className="atlas-map-viewport"
          ref={viewport}
          tabIndex={0}
          aria-label="Architecture graph. Scroll to pan; use zoom controls to resize."
        >
          <div
            style={{
              width: width * zoom,
              height: height * zoom,
              minWidth: "100%",
            }}
          >
            <div
              className="atlas-map-scene"
              style={{ width, height, transform: `scale(${zoom})` }}
            >
              <svg
                className="atlas-connectors"
                width={width}
                height={height}
                aria-label={`${graph.edges.length} ${graph.ontology} relationships`}
              >
                <defs>
                  <marker
                    id="atlas-arrow"
                    viewBox="0 0 10 10"
                    refX="9"
                    refY="5"
                    markerWidth="5"
                    markerHeight="5"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
                  </marker>
                </defs>
                {graph.edges.map((edge) => {
                  const from = position(edge.from);
                  const to = position(edge.to);
                  const sx = from.x + 120,
                    sy = from.y + 104,
                    tx = to.x + 120,
                    ty = to.y;
                  return (
                    <path
                      key={`${edge.from}:${edge.to}`}
                      d={`M ${sx} ${sy} C ${sx} ${sy + 48}, ${tx} ${ty - 48}, ${tx} ${ty}`}
                      markerEnd="url(#atlas-arrow)"
                    >
                      <title>
                        {`${edge.from || graph.source.label} ${edge.kind} ${edge.to} (${edge.count})`}
                      </title>
                    </path>
                  );
                })}
              </svg>
              {card(root, true)}
              {children.map((node) => card(node, false))}
              {children.length === 0 && (
                <p className="atlas-empty">
                  {graph.ontology === "containment"
                    ? "This file has no contained files. Open its source or choose a relationship ontology."
                    : "No resolved relationships in this scope."}
                </p>
              )}
            </div>
          </div>
        </div>
        {graph.ontology !== "containment" && (
          <details className="atlas-evidence">
            <summary>
              Relationship evidence · {graph.edges.length} connections
            </summary>
            {graph.edges.map((edge) => (
              <button
                type="button"
                key={`${edge.from}:${edge.to}`}
                onClick={() =>
                  openSource(edge.evidence.path, edge.evidence.line)
                }
              >
                <span>
                  {edge.from} <strong>{edge.kind} →</strong> {edge.to}
                </span>
                <small>
                  {edge.count} occurrence{edge.count === 1 ? "" : "s"} ·{" "}
                  {edge.evidence.path}:{edge.evidence.line}
                </small>
              </button>
            ))}
            {graph.edges.length === 0 && (
              <p>
                No connections between the visible entries. Open a file to
                include its external neighbors.
              </p>
            )}
          </details>
        )}
      </>
    );
  },
);
