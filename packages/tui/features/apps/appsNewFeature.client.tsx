// Why: keyboard companion: questions, then confirm the summary, then compose through the action.
import { useState } from "react";

import { AppsNewTemplate } from "@/components/templates/appsNewTemplate";
import { Confirm } from "@/components/ui/confirm";
import { AppsNewForm } from "@/features/apps/appsNewForm";
import { createAppAction } from "@/lib/actions/appsActions";
import type { NewAppRequest } from "@/types/appsTypes";
import type { CheckRun } from "@/types/checksTypes";

type Phase = "form" | "confirm" | "running" | "done";

export function AppsNewFeatureClient({
  presets,
}: {
  presets: Record<string, string[]>;
}) {
  const [phase, setPhase] = useState<Phase>("form");
  const [request, setRequest] = useState<NewAppRequest | null>(null);
  const [steps, setSteps] = useState<CheckRun[] | undefined>(undefined);
  const [message, setMessage] = useState<string | null>(
    "Enter answers each question; esc leaves without writing anything.",
  );

  const create = async (input: NewAppRequest) => {
    setPhase("running");
    setMessage("Making the app…");
    const result = await createAppAction(input, setSteps);
    setPhase("done");
    if (!result.ok) return setMessage(`Stopped: ${result.error.message}`);
    setSteps(result.data.steps);
    const failed = result.data.steps.some((step) => step.status === "failed");
    setMessage(
      failed
        ? "Finished with problems; see the failed step."
        : `App ready in ${result.data.appDir}. Next: add Clerk keys and DATABASE_URL to .env.local, then pnpm db:init and pnpm dev.`,
    );
  };

  return (
    <AppsNewTemplate
      form={
        phase === "form" ? (
          <AppsNewForm
            presets={presets}
            onReady={(next) => {
              setRequest(next);
              setPhase("confirm");
              setMessage(null);
            }}
          />
        ) : null
      }
      summary={phase === "form" ? null : request}
      {...(request ? { modules: presets[request.preset] ?? [] } : {})}
      confirm={
        phase === "confirm" && request ? (
          <Confirm
            message="Make this app?"
            onConfirm={() => void create(request)}
            onCancel={() => {
              setPhase("form");
              setRequest(null);
              setMessage("Cancelled; nothing was written.");
            }}
            autoFocus
          />
        ) : null
      }
      {...(steps ? { steps } : {})}
      message={message}
    />
  );
}
