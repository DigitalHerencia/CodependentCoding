// Why: Templates: pure presentation for the apps screens.
import { Box, Text } from "ink";
import type { ReactNode } from "react";
import { CheckList } from "@/components/blocks/check-list";
import { DetailPane } from "@/components/blocks/detail-pane";
import { useTheme } from "@/hooks/use-theme";
import type { NewAppRequest, GeneratedApp } from "@/types/appsTypes";
import type { CheckRun } from "@/types/checksTypes";
import { KeyValue } from "@/components/ui/key-value";

// the new-app screen: the questions, then the summary, then live steps.
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

// the apps screen: an app picker beside the chosen app's choices from its hipster.json.
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
