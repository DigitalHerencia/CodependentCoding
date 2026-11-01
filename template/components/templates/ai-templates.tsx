// Why: Templates: pure presentation for the ai pages, laid out from DTOs; data and slots come from features.
import Link from "next/link";
import type {
  AiGenerationHistoryDTO,
  AiUsageSummaryDTO,
} from "@/types/aiTypes";
import {
  DashboardLayout,
  DashboardPanel,
} from "@/components/blocks/dashboard-layout";
import type { ReactNode } from "react";

export function AiGenerationTemplate({
  generations,
}: {
  generations: AiGenerationHistoryDTO[];
}) {
  return (
    <DashboardLayout
      title="Generation history"
      nav={[]}
      toolbar={
        <Link className="type-link" href="/ai/playground">
          New generation
        </Link>
      }
    >
      <div className="space-y-4">
        {generations.map((generation) => (
          <details key={generation.id} className="surface-card p-5">
            <summary className="cursor-pointer">
              <span className="type-label">
                {generation.prompt?.slice(0, 100) ?? generation.model}
              </span>
              <span className="mt-2 block text-sm text-muted-primary">
                {generation.status} · {generation.model} ·{" "}
                {generation.createdAt.slice(0, 16).replace("T", " ")}
              </span>
            </summary>
            <div className="mt-5 grid gap-5 lg:grid-cols-2">
              <section>
                <h2 className="type-label">Prompt</h2>
                <p className="mt-3 whitespace-pre-wrap">
                  {generation.prompt ?? "No text prompt was recorded."}
                </p>
              </section>
              <section>
                <h2 className="type-label">Saved response</h2>
                <p className="mt-3 whitespace-pre-wrap">
                  {generation.response ?? "No response was recorded."}
                </p>
              </section>
            </div>
          </details>
        ))}
      </div>
      {!generations.length && <p>No generations yet.</p>}
    </DashboardLayout>
  );
}

export function AiPlaygroundTemplate({
  model,
  children,
  output,
}: {
  model: string;
  children: ReactNode;
  output: ReactNode;
}) {
  return (
    <section className="space-y-5 p-5">
      <header>
        <h1 className="type-title">AI playground</h1>
        <p className="mt-2 text-muted-primary">Model: {model}</p>
      </header>
      <div className="grid gap-5 lg:grid-cols-2">
        <section className="surface-card p-5">
          <h2 className="mb-4 type-label">Prompt</h2>
          {children}
        </section>
        <section className="surface-card p-5">
          <h2 className="mb-4 type-label">Generated response</h2>
          {output}
        </section>
      </div>
    </section>
  );
}

export function AiUsageTemplate({ usage }: { usage: AiUsageSummaryDTO }) {
  return (
    <DashboardLayout title="My AI usage" nav={[]}>
      <DashboardPanel title="Recorded usage ledger">
        <dl className="grid gap-4 sm:grid-cols-2">
          <dt>Generation entries</dt>
          <dd>{usage.generationCount}</dd>
          <dt>Input tokens recorded</dt>
          <dd>{usage.inputTokens}</dd>
          <dt>Output tokens recorded</dt>
          <dd>{usage.outputTokens}</dd>
          <dt>Cost recorded (USD)</dt>
          <dd>{usage.cost}</dd>
        </dl>
      </DashboardPanel>
      <p className="text-muted-primary">
        The current generation adapter records zero token and cost values when
        usage is not supplied. These totals are not a provider billing
        statement.
      </p>
    </DashboardLayout>
  );
}
