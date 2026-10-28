// Why: the new-app screen: the questions, then the summary, then live steps.
import { Box, Text } from "ink";
import type { ReactNode } from "react";

import { CheckList } from "@/components/blocks/check-list";
import { DetailPane } from "@/components/blocks/detail-pane";
import { useTheme } from "@/hooks/use-theme";
import type { NewAppRequest } from "@/types/appsTypes";
import type { CheckRun } from "@/types/checksTypes";

export function AppsNewTemplate({
  form,
  summary,
  modules,
  confirm,
  steps,
  message,
}: {
  form?: ReactNode;
  summary?: NewAppRequest | null;
  modules?: string[];
  confirm?: ReactNode;
  steps?: CheckRun[];
  message?: string | null;
}) {
  const theme = useTheme();
  return (
    <Box flexDirection="column" gap={1}>
      {form}
      {summary ? (
        <DetailPane title={`New app: ${summary.preset}`} note={summary.appDir}>
          <Text>
            Modules: base{modules?.length ? `, ${modules.join(", ")}` : ""}
          </Text>
          <Text>
            Organizations: {summary.tenancy} · Access: {summary.accessControl}
          </Text>
          <Text>Color: {summary.color || "template default"}</Text>
        </DetailPane>
      ) : null}
      {confirm}
      {steps ? <CheckList runs={steps} /> : null}
      {message ? (
        <Box paddingX={1}>
          <Text color={theme.colors.mutedForeground}>{message}</Text>
        </Box>
      ) : null}
    </Box>
  );
}
