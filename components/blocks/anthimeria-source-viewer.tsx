"use client";

import { useEffect, useRef, useState } from "react";
import { AnthimeriaSourceActions } from "@/components/blocks/anthimeria-source-actions";
import type { SourcePage } from "@/types/architectureTypes";

export function AnthimeriaSourceViewer({
  sourceId,
  file,
  initialLine,
}: {
  sourceId: string;
  file: string;
  initialLine: number;
}) {
  const [request, setRequest] = useState({ line: initialLine, serial: 0 });
  const requestedLine = request.line;
  const [lineInput, setLineInput] = useState(String(initialLine));
  const [source, setSource] = useState<SourcePage | null>(null);
  const [error, setError] = useState("");
  const body = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams({
      kind: "source",
      source: sourceId,
      file,
      line: String(requestedLine),
    });
    fetch(`/api/anthimeria?${params}`, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok)
          throw new Error(
            response.status === 404
              ? "This file is not in the selected source snapshot."
              : "Source could not be loaded.",
          );
        return response.json();
      })
      .then((value) => {
        if (!controller.signal.aborted) setSource(value);
      })
      .catch((cause: unknown) => {
        if (!controller.signal.aborted)
          setError(
            cause instanceof Error ? cause.message : "Source unavailable",
          );
      });
    return () => controller.abort();
  }, [sourceId, file, requestedLine, request]);
  useEffect(() => {
    const element = body.current?.querySelector<HTMLElement>(
      `[data-line="${requestedLine}"]`,
    );
    if (element && body.current) {
      element.dataset.selected = "true";
      body.current.scrollTo({
        top: Math.max(0, element.offsetTop - body.current.offsetTop - 70),
        behavior: "instant",
      });
    }
  }, [source, requestedLine]);
  const goTo = (line: number) => {
    if (!Number.isSafeInteger(line) || line < 1) return;
    setRequest((current) => ({ line, serial: current.serial + 1 }));
    setLineInput(String(line));
    setSource(null);
    setError("");
  };
  return (
    <section className="atlas-source" aria-label={`Read-only source: ${file}`}>
      <header>
        <strong title={file}>{file}</strong>
        <span>Read-only · server highlighted</span>
      </header>
      {source && (
        <>
          <AnthimeriaSourceActions
            sourceId={sourceId}
            file={file}
            sourceUrl={source.sourceUrl + `#L${requestedLine}`}
          />
          <form
            className="atlas-line-form"
            onSubmit={(event) => {
              event.preventDefault();
              goTo(Math.min(Number(lineInput), source.total));
            }}
          >
            <label>
              Line{" "}
              <input
                aria-label="Source line"
                type="number"
                min={1}
                max={source.total}
                value={lineInput}
                onChange={(event) => setLineInput(event.target.value)}
              />
            </label>
            <button type="submit">Go to line</button>
            <small>{source.total} lines</small>
          </form>
        </>
      )}
      {error ? (
        <p role="alert" className="atlas-message">
          {error}
          <button type="button" onClick={() => goTo(requestedLine)}>
            Retry source
          </button>
        </p>
      ) : source ? (
        <>
          <div
            ref={body}
            tabIndex={0}
            className="atlas-source-body"
            aria-label="Syntax-highlighted source code"
            dangerouslySetInnerHTML={{ __html: source.html }}
          />
          <div className="atlas-pager">
            <button
              type="button"
              disabled={source.start === 1}
              onClick={() => goTo(Math.max(1, source.start - 200))}
            >
              Previous lines
            </button>
            <small>
              {source.start}–{Math.min(source.start + 199, source.total)}
            </small>
            <button
              type="button"
              disabled={source.start + 199 >= source.total}
              onClick={() => goTo(source.start + 200)}
            >
              Next lines
            </button>
          </div>
        </>
      ) : (
        <p className="atlas-message" role="status">
          Loading source chunk…
        </p>
      )}
    </section>
  );
}
