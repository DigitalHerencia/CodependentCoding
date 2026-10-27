import { CopyButton } from "@/components/ui/copy-button";

type CodeSnippetProps = { title: string; code: string };

export function CodeSnippet({ title, code }: CodeSnippetProps) {
  return (
    <figure className="m-0 border border-signal-border bg-background-strong">
      <figcaption className="flex items-center justify-between gap-3 border-b border-signal-border px-4 py-2">
        <span className="text-xs tracking-[0.2em] text-signal uppercase">
          {title}
        </span>
        <CopyButton value={code} />
      </figcaption>
      <pre className="m-0 overflow-x-auto p-4 text-sm">
        <code>{code}</code>
      </pre>
    </figure>
  );
}
