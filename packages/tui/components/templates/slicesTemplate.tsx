// Why: the slice screen: the form, then the planned files, then live steps and what changed.
import { Box, Text } from "ink";
import type { ReactNode } from "react";

import { CheckList } from "@/components/blocks/check-list";
import { DetailPane } from "@/components/blocks/detail-pane";
import { useTheme } from "@/hooks/use-theme";
import type { CheckRun } from "@/types/checksTypes";
import type { SlicePreview } from "@/types/slicesTypes";

export function SlicesTemplate({
  form,
  preview,
  confirm,
  steps,
  changes,
  message,
}: {
  form?: ReactNode;
  preview?: SlicePreview | null;
  confirm?: ReactNode;
  steps?: CheckRun[];
  changes?: string | null;
  message?: string | null;
}) {
  const theme = useTheme();
  return (
    <Box flexDirection="column" gap={1}>
      {form}
      {preview ? (
        <DetailPane
          title={`${preview.entity} in ${preview.newModule ? "new module " : ""}${preview.moduleId}`}
          note={preview.appDir}
        >
          {preview.created.map((file) => (
            <Text key={file} color={theme.colors.success}>
              + {file}
            </Text>
          ))}
          {preview.updated.map((file) => (
            <Text key={file} color={theme.colors.warning}>
              ~ {file}
            </Text>
          ))}
        </DetailPane>
      ) : null}
      {confirm}
      {steps ? <CheckList runs={steps} /> : null}
      {changes ? (
        <DetailPane title="Changed files">
          <Text>{changes}</Text>
        </DetailPane>
      ) : null}
      {message ? (
        <Box paddingX={1}>
          <Text color={theme.colors.mutedForeground}>{message}</Text>
        </Box>
      ) : null}
    </Box>
  );
}
