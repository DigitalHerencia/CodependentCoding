"use client";

import { CopyButton } from "@/components/ui/button";

const githubBase =
  "https://github.com/DigitalHerencia/CodependentCoding/blob/main/packages/maximal-template/";

/** Source viewer actions live in a presentation block, outside feature orchestration. */
export function AnthimeriaSourceActions({
  active,
  source,
  loading,
}: {
  active: string;
  source: string;
  loading: boolean;
}) {
  return (
    <>
      <CopyButton
        value={loading ? "" : source}
        className="anthimeria-utility-button"
      />
      <a
        className="anthimeria-utility-button inline-flex items-center border border-border px-2 py-1.5 text-xs text-foreground uppercase no-underline hover:border-signal"
        href={githubBase + active.split("/").map(encodeURIComponent).join("/")}
        target="_blank"
        rel="noreferrer"
      >
        GitHub
      </a>
    </>
  );
}
