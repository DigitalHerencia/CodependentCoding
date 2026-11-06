import { DashboardPanel } from "@/components/blocks/shared-blocks";
import { aiPresentationCopy } from "@/content/ai";
import type {
  AiGenerationHistoryDTO,
  AiUsageSummaryDTO,
} from "@/types/aiTypes";
import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

// Why: Templates: pure presentation for the ai pages, laid out from DTOs; data and slots come from features.

export function AiGenerationContentBlock({
  generations,
}: {
  generations: AiGenerationHistoryDTO[];
}) {
  return (
    <>
      <div className="space-y-4">
        {generations.map((generation) => (
          <details key={generation.id} className="surface-card p-5">
            <summary className="cursor-pointer">
              <span className="type-label">
                {generation.prompt?.slice(0, 100) ?? generation.model}
              </span>
              <span className="mt-2 block text-sm text-muted-primary">
                {generation.status}
                {aiPresentationCopy.separator}
                {generation.model}
                {aiPresentationCopy.separator2}{" "}
                {generation.createdAt.slice(0, 16).replace("T", " ")}
              </span>
            </summary>
            <div className="mt-5 grid gap-5 lg:grid-cols-2">
              <section>
                <h2 className="type-label">{aiPresentationCopy.prompt}</h2>
                <p className="mt-3 whitespace-pre-wrap">
                  {generation.prompt ??
                    aiPresentationCopy.noTextPromptWasRecorded}
                </p>
              </section>
              <section>
                <h2 className="type-label">
                  {aiPresentationCopy.savedResponse}
                </h2>
                <p className="mt-3 whitespace-pre-wrap">
                  {generation.response ??
                    aiPresentationCopy.noResponseWasRecorded}
                </p>
              </section>
            </div>
          </details>
        ))}
      </div>
      {!generations.length && <p>{aiPresentationCopy.noGenerationsYet}</p>}
    </>
  );
}

export function AiPlaygroundPageBlock({
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
        <h1 className="type-title">{aiPresentationCopy.aIPlayground}</h1>
        <p className="mt-2 text-muted-primary">
          {aiPresentationCopy.model}
          {model}
        </p>
      </header>
      <div className="grid gap-5 lg:grid-cols-2">
        <section className="surface-card p-5">
          <h2 className="mb-4 type-label">{aiPresentationCopy.prompt}</h2>
          {children}
        </section>
        <section className="surface-card p-5">
          <h2 className="mb-4 type-label">
            {aiPresentationCopy.generatedResponse}
          </h2>
          {output}
        </section>
      </div>
    </section>
  );
}

export function AiUsageContentBlock({ usage }: { usage: AiUsageSummaryDTO }) {
  return (
    <>
      <DashboardPanel title={aiPresentationCopy.recordedUsageLedger}>
        <dl className="grid gap-4 sm:grid-cols-2">
          <dt>{aiPresentationCopy.generationEntries}</dt>
          <dd>{usage.generationCount}</dd>
          <dt>{aiPresentationCopy.inputTokensRecorded}</dt>
          <dd>{usage.inputTokens}</dd>
          <dt>{aiPresentationCopy.outputTokensRecorded}</dt>
          <dd>{usage.outputTokens}</dd>
          <dt>{aiPresentationCopy.costRecordedUSD}</dt>
          <dd>{usage.cost}</dd>
        </dl>
      </DashboardPanel>
      <p className="text-muted-primary">
        {aiPresentationCopy.theCurrentGenerationAdapterRecordsZeroTokenAndCost}
      </p>
    </>
  );
}

export function AiGenerationToolbarBlock(
  _props: ComponentProps<typeof AiGenerationContentBlock>,
) {
  return (
    <Link className="type-link" href="/ai/playground">
      {aiPresentationCopy.newGeneration}
    </Link>
  );
}
