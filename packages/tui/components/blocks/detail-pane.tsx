// Why: the right-hand pane of a list/detail screen: a title, a note and labelled rows.
import { Box, Text } from "ink";
import type { ReactNode } from "react";

import { Divider } from "@/components/ui/divider";
import { useTheme } from "@/hooks/use-theme";

export function DetailPane({
  title,
  note,
  children,
}: {
  title: string;
  note?: string | null;
  children?: ReactNode;
}) {
  const theme = useTheme();
  return (
    <Box flexDirection="column" flexGrow={1} paddingX={1}>
      <Text bold color={theme.colors.primary}>
        {title}
      </Text>
      {note ? <Text wrap="wrap">{note}</Text> : null}
      <Divider />
      {children}
    </Box>
  );
}
