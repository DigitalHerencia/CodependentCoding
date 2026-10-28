// Why: the apps screen: an app picker beside the chosen app's choices from its hipster.json.
import { Box, Text } from "ink";
import type { ReactNode } from "react";

import { DetailPane } from "@/components/blocks/detail-pane";
import { KeyValue } from "@/components/ui/key-value";
import { useTheme } from "@/hooks/use-theme";
import type { GeneratedApp } from "@/types/appsTypes";

export function AppsTemplate({
  picker,
  app,
}: {
  picker: ReactNode;
  app: GeneratedApp | undefined;
}) {
  const theme = useTheme();
  if (!app) {
    return (
      <Box paddingX={1}>
        <Text color={theme.colors.mutedForeground}>
          No apps yet. Make one on New app (6), or add a folder in Settings (8).
        </Text>
      </Box>
    );
  }
  return (
    <Box gap={2}>
      <Box flexDirection="column" width={28} paddingX={1}>
        {picker}
      </Box>
      <DetailPane title={app.name} note={app.dir}>
        {app.found ? (
          <KeyValue
            keyWidth={14}
            items={[
              {
                key: "Modules",
                value: ["base", ...app.modules].join(", "),
              },
              { key: "Organizations", value: app.tenancy ?? "unknown" },
              { key: "Access", value: app.accessControl ?? "unknown" },
              { key: "Color", value: app.color ?? "template default" },
              { key: "Made", value: app.createdAt?.slice(0, 10) ?? "unknown" },
              { key: "CLI", value: app.cliVersion ?? "unknown" },
              {
                key: "Template",
                value: app.templateCommit?.slice(0, 7) ?? "unknown",
              },
            ]}
          />
        ) : (
          <Text color={theme.colors.warning}>
            The folder or its hipster.json is gone. Forget it in Settings (8).
          </Text>
        )}
      </DetailPane>
    </Box>
  );
}
