// Why: the doctrine screen: a layer picker beside the chosen layer's boundary and rules.
import { Box, Text } from "ink";
import type { ReactNode } from "react";

import { DetailPane } from "@/components/blocks/detail-pane";
import { useTheme } from "@/hooks/use-theme";
import type { DoctrineLayer, DoctrineRule } from "@/types/doctrineTypes";

export function DoctrineTemplate({
  picker,
  layer,
  rules,
}: {
  picker: ReactNode;
  layer: DoctrineLayer | undefined;
  rules: DoctrineRule[];
}) {
  const theme = useTheme();
  return (
    <Box gap={2}>
      <Box flexDirection="column" width={24} paddingX={1}>
        {picker}
      </Box>
      {layer ? (
        <DetailPane title={layer.id} note={layer.why}>
          <Text color={theme.colors.mutedForeground}>
            {layer.deny.length > 0
              ? `Must not import: ${layer.deny.join(", ")}`
              : "No import limits."}
          </Text>
          {rules.map((rule) => (
            <Text key={rule.id} wrap="wrap">
              <Text bold>{rule.id}</Text> {rule.text}
            </Text>
          ))}
        </DetailPane>
      ) : null}
    </Box>
  );
}
