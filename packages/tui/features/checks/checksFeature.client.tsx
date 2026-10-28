// Why: keyboard companion: r runs the template checks through the checks action.
import { useInput } from "ink";
import { useState } from "react";

import { ChecksTemplate } from "@/components/templates/checksTemplate";
import { runTemplateChecksAction } from "@/lib/actions/checksActions";
import { waitingChecks } from "@/lib/utils/check-runs";
import type { CheckRun } from "@/types/checksTypes";

export function ChecksFeatureClient() {
  const [runs, setRuns] = useState<CheckRun[]>(waitingChecks);
  const [status, setStatus] = useState("Press r to run the checks.");
  const [running, setRunning] = useState(false);
  useInput((input) => {
    if (input !== "r" || running) return;
    setRunning(true);
    setStatus("Running…");
    void runTemplateChecksAction(setRuns).then((result) => {
      setRunning(false);
      if (!result.ok)
        return setStatus(`Could not run: ${result.error.message}`);
      const failed = result.data.filter((run) => run.status === "failed");
      setStatus(
        failed.length === 0
          ? "All checks passed. Press r to run again."
          : `${failed.length} failed. Press r to run again.`,
      );
    });
  });
  return <ChecksTemplate runs={runs} status={status} />;
}
