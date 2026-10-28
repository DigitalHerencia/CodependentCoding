// Why: the navigation bar: every screen with its key, the open one highlighted.
import { Box, Text } from "ink";

import { useTheme } from "@/hooks/use-theme";

export interface ScreenTab {
  id: string;
  label: string;
  key: string;
}

export function ScreenTabs({
  items,
  active,
}: {
  items: readonly ScreenTab[];
  active: string;
}) {
  const theme = useTheme();
  return (
    <Box gap={2} paddingX={1}>
      {items.map((item) => (
        <Text
          key={item.id}
          bold={item.id === active}
          color={
            item.id === active
              ? theme.colors.primary
              : theme.colors.mutedForeground
          }
        >
          {item.key} {item.label}
        </Text>
      ))}
    </Box>
  );
}
