"use client";

import { useEffect, useState } from "react";
import { AnthimeriaWorkspace } from "@/components/blocks/anthimeria-workspace";
import type {
  ArchitectureGraph,
  SourceMetadata,
  Ontology,
} from "@/types/architectureTypes";

export function AnthimeriaBrowser({
  sources,
  initialGraph,
  initialFile = "",
}: {
  sources: SourceMetadata[];
  initialGraph: ArchitectureGraph;
  initialFile?: string;
}) {
  const [selection, setSelection] = useState({
    source: initialGraph.source.id,
    ontology: initialGraph.ontology,
    scope: initialGraph.scope,
    page: 0,
    serial: 0,
  });
  const [graph, setGraph] = useState<ArchitectureGraph | null>(initialGraph);
  const [error, setError] = useState("");
  const [file, setFile] = useState(initialFile);
  const [line, setLine] = useState(1);
  const [panel, setPanel] = useState<"files" | "source" | null>(
    initialFile ? "source" : null,
  );

  useEffect(() => {
    if (selection.serial === 0) return;
    const controller = new AbortController();
    const params = new URLSearchParams({
      kind: "graph",
      source: selection.source,
      ontology: selection.ontology,
      scope: selection.scope,
      page: String(selection.page),
    });
    fetch(`/api/anthimeria?${params}`, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok)
          throw new Error("Graph could not be loaded. Try again.");
        return response.json() as Promise<ArchitectureGraph>;
      })
      .then((next) => {
        if (!controller.signal.aborted) setGraph(next);
      })
      .catch((cause: unknown) => {
        if (!controller.signal.aborted)
          setError(
            cause instanceof Error ? cause.message : "Graph unavailable",
          );
      });
    return () => controller.abort();
  }, [selection]);

  const navigate = (
    change: Partial<{
      source: string;
      ontology: Ontology;
      scope: string;
      page: number;
    }>,
  ) => {
    // Remove the old graph immediately. Aborted responses can never replace the new selection.
    setGraph(null);
    setError("");
    setFile("");
    setPanel(null);
    setSelection((current) => ({
      ...current,
      page: 0,
      ...change,
      serial: current.serial + 1,
    }));
  };
  const openSource = (path: string, targetLine = 1) => {
    setFile(path);
    setLine(targetLine);
    setPanel("source");
  };

  return (
    <AnthimeriaWorkspace
      sources={sources}
      selection={selection}
      graph={graph}
      error={error}
      navigate={navigate}
      openSource={openSource}
      panel={panel}
      file={file}
      line={line}
      setPanel={setPanel}
    />
  );
}
