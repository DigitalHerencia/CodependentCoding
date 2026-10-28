// Why: keyboard companion: form, then confirm the planned files, then run the slice through its action.
import { useState } from "react";

import { SlicesTemplate } from "@/components/templates/slicesTemplate";
import { Confirm } from "@/components/ui/confirm";
import { SlicesNewForm } from "@/features/slices/slicesNewForm";
import { createSliceAction } from "@/lib/actions/slicesActions";
import type { CheckRun } from "@/types/checksTypes";
import type { SlicePreview, SliceRequest } from "@/types/slicesTypes";

type Phase = "form" | "confirm" | "running" | "done";

export function SlicesFeatureClient() {
  const [phase, setPhase] = useState<Phase>("form");
  const [request, setRequest] = useState<SliceRequest | null>(null);
  const [preview, setPreview] = useState<SlicePreview | null>(null);
  const [steps, setSteps] = useState<CheckRun[] | undefined>(undefined);
  const [changes, setChanges] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(
    "Tab moves between fields; enter plans the slice; esc leaves.",
  );

  const create = async (input: SliceRequest) => {
    setPhase("running");
    setMessage("Creating the slice…");
    const result = await createSliceAction(input, setSteps);
    setPhase("done");
    if (!result.ok) return setMessage(`Stopped: ${result.error.message}`);
    setSteps(result.data.steps);
    setChanges(result.data.changes);
    const failed = result.data.steps.some((step) => step.status === "failed");
    setMessage(
      failed
        ? "Finished with problems; see the failed step."
        : "Slice created. Next: pnpm db:init, then pnpm dev in the app.",
    );
  };

  return (
    <SlicesTemplate
      form={
        phase === "form" ? (
          <SlicesNewForm
            onPlanned={(next, planned) => {
              setRequest(next);
              setPreview(planned);
              setPhase("confirm");
              setMessage(null);
            }}
          />
        ) : null
      }
      preview={preview}
      confirm={
        phase === "confirm" && request ? (
          <Confirm
            message="Write these files and verify the app?"
            onConfirm={() => void create(request)}
            onCancel={() => {
              setPhase("form");
              setPreview(null);
              setMessage("Cancelled; nothing was written.");
            }}
            autoFocus
          />
        ) : null
      }
      {...(steps ? { steps } : {})}
      changes={changes}
      message={message}
    />
  );
}
