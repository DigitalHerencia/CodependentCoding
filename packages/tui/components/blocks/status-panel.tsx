// Why: a titled block of label/value rows, used for the command-center summary.
import { Box, Text } from "ink";

import { KeyValue } from "@/components/ui/key-value";
import { useTheme } from "@/hooks/use-theme";

export interface StatusRow {
  label: string;
  value: string;
}

export function StatusPanel({
  title,
  rows,
}: {
  title: string;
  rows: StatusRow[];
}) {
  const theme = useTheme();
  return (
    <Box flexDirection="column" paddingX={1} marginTop={1}>
      <Text bold color={theme.colors.primary}>
        {title}
      </Text>
      <KeyValue
        items={rows.map((row) => ({ key: row.label, value: row.value }))}
        keyWidth={14}
      />
    </Box>
  );
}
