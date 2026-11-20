"use client";

import { useEffect, useState } from "react";

export function AnthimeriaFiles({
  sourceId,
  scope,
  openSource,
}: {
  sourceId: string;
  scope: string;
  openSource: (file: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const [result, setResult] = useState<{
    files: string[];
    total: number;
    pages: number;
    page: number;
  } | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(
      () => {
        const params = new URLSearchParams({
          kind: "files",
          source: sourceId,
          scope,
          q: query,
          page: String(page),
        });
        fetch(`/api/anthimeria?${params}`, { signal: controller.signal })
          .then(async (response) => {
            if (!response.ok) throw new Error("File index unavailable");
            return response.json();
          })
          .then((value) => {
            if (!controller.signal.aborted) setResult(value);
          })
          .catch(() => {
            if (!controller.signal.aborted)
              setError("File index could not be loaded.");
          });
      },
      query ? 200 : 0,
    );
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [sourceId, scope, query, page]);
  const updateQuery = (value: string) => {
    setQuery(value);
    setPage(0);
    setResult(null);
    setError("");
  };
  const turnPage = (value: number) => {
    setPage(value);
    setResult(null);
    setError("");
  };
  return (
    <div className="atlas-files">
      <label>
        Find source files
        <input
          type="search"
          aria-label="Find source files"
          maxLength={200}
          value={query}
          placeholder="Search paths in this boundary…"
          onChange={(event) => updateQuery(event.target.value)}
        />
      </label>
      {error ? (
        <p role="alert">{error}</p>
      ) : result ? (
        <>
          <p>
            {result.total} files · {scope || "Repository"}
          </p>
          <ul>
            {result.files.map((file) => (
              <li key={file}>
                <button
                  type="button"
                  title={file}
                  onClick={() => openSource(file)}
                >
                  {file}
                </button>
              </li>
            ))}
          </ul>
          {result.total === 0 && <p>No matching source files.</p>}
          <div className="atlas-pager">
            <button
              type="button"
              disabled={result.page === 0}
              onClick={() => turnPage(result.page - 1)}
            >
              Previous files
            </button>
            <span>
              {result.page + 1} / {result.pages}
            </span>
            <button
              type="button"
              disabled={result.page + 1 >= result.pages}
              onClick={() => turnPage(result.page + 1)}
            >
              Next files
            </button>
          </div>
        </>
      ) : (
        <p role="status">Loading file index…</p>
      )}
    </div>
  );
}
