"use client";

import { useState } from "react";

export function AnthimeriaSourceActions({
  sourceId,
  file,
  sourceUrl,
}: {
  sourceId: string;
  file: string;
  sourceUrl: string;
}) {
  const [status, setStatus] = useState("");
  const copy = async () => {
    setStatus("");
    const params = new URLSearchParams({ kind: "raw", source: sourceId, file });
    const content = fetch(`/api/anthimeria?${params}`).then(
      async (response) => {
        if (!response.ok) throw new Error("Source unavailable");
        return new Blob([await response.text()], { type: "text/plain" });
      },
    );
    try {
      // Start the clipboard write in the user gesture; Safari resolves the Blob later.
      if (typeof ClipboardItem !== "undefined")
        await navigator.clipboard.write([
          new ClipboardItem({ "text/plain": content }),
        ]);
      else await navigator.clipboard.writeText(await (await content).text());
      setStatus("Copied file");
    } catch {
      setStatus("Copy failed. Use the source link to copy this file.");
    }
  };
  return (
    <div className="atlas-source-actions">
      <button type="button" onClick={copy}>
        Copy file
      </button>
      <a href={sourceUrl} target="_blank" rel="noreferrer">
        Source ↗
      </a>
      <span role="status">{status}</span>
    </div>
  );
}
