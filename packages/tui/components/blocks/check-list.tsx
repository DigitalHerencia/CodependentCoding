// Why: one row per check: a spinner while it runs, then pass or fail with its time.
import { Box, Text } from "ink";

import { Spinner } from "@/components/ui/spinner";
import { useTheme } from "@/hooks/use-theme";
import type { CheckRun } from "@/types/checksTypes";

const seconds = (ms: number | null) =>
  ms === null ? "" : `${(ms / 1000).toFixed(1)}s`;

export function CheckList({ runs }: { runs: CheckRun[] }) {
  const theme = useTheme();
  return (
    <Box flexDirection="column" paddingX={1}>
      {runs.map((run) => (
        <Box key={run.id} flexDirection="column">
          <Box gap={1}>
            {run.status === "running" ? (
              <Spinner />
            ) : (
              <Text
                color={
                  run.status === "passed"
                    ? theme.colors.success
                    : run.status === "failed"
                      ? theme.colors.error
                      : theme.colors.mutedForeground
                }
              >
                {run.status === "passed"
                  ? "✓"
                  : run.status === "failed"
                    ? "✗"
                    : "·"}
              </Text>
            )}
            <Text>{run.label}</Text>
            <Text color={theme.colors.mutedForeground}>
              {seconds(run.durationMs)}
            </Text>
          </Box>
          {run.detail ? (
            <Box paddingLeft={2}>
              <Text color={theme.colors.mutedForeground} wrap="wrap">
                {run.detail}
              </Text>
            </Box>
          ) : null}
        </Box>
      ))}
    </Box>
  );
}
