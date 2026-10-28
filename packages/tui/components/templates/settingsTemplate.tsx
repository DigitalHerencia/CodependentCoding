// Why: the settings screen: where the app looks, where it saves, and the remembered app folders.
import { Box, Text } from "ink";
import type { ReactNode } from "react";

import { DetailPane } from "@/components/blocks/detail-pane";
import { KeyValue } from "@/components/ui/key-value";
import { useTheme } from "@/hooks/use-theme";

export function SettingsTemplate({
  root,
  file,
  folders,
  form,
  message,
}: {
  root: string;
  file: string;
  folders: ReactNode;
  form?: ReactNode;
  message?: string | null;
}) {
  const theme = useTheme();
  return (
    <Box flexDirection="column" gap={1}>
      <DetailPane title="Settings">
        <KeyValue
          keyWidth={10}
          items={[
            { key: "Checkout", value: `${root} (CODEPENDENT_ROOT)` },
            { key: "Saved in", value: `${file} (CODEPENDENT_HOME)` },
          ]}
        />
      </DetailPane>
      <Box flexDirection="column" paddingX={1}>
        {folders}
      </Box>
      {form}
      {message ? (
        <Box paddingX={1}>
          <Text color={theme.colors.mutedForeground}>{message}</Text>
        </Box>
      ) : null}
    </Box>
  );
}
