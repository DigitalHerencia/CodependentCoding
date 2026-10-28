// Why: the checks screen: what will run, live progress, and the outcome.
import { Box, Text } from "ink";

import { CheckList } from "@/components/blocks/check-list";
import { useTheme } from "@/hooks/use-theme";
import type { CheckRun } from "@/types/checksTypes";

export function ChecksTemplate({
  runs,
  status,
}: {
  runs: CheckRun[];
  status: string;
}) {
  const theme = useTheme();
  return (
    <Box flexDirection="column" gap={1}>
      <Box paddingX={1}>
        <Text bold color={theme.colors.primary}>
          Template checks
        </Text>
      </Box>
      <CheckList runs={runs} />
      <Box paddingX={1}>
        <Text color={theme.colors.mutedForeground}>{status}</Text>
      </Box>
    </Box>
  );
}
