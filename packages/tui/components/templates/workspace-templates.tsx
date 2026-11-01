// Why: Templates: pure presentation for the workspace screens.
import { Box } from "ink";
import { StatusPanel } from "@/components/blocks/status-panel";
import { WelcomePanel } from "@/components/blocks/welcome-panel";

// the command-center screen: workspace, doctrine and what can be done from here.
export function WorkspaceTemplate({
  repository,
  layerCount,
  ruleCount,
  moduleCount,
  presetCount,
}: {
  repository: string;
  layerCount: number;
  ruleCount: number;
  moduleCount: number;
  presetCount: number;
}) {
  return (
    <Box flexDirection="column">
      <WelcomePanel workspace="main" />
      <StatusPanel
        title="Workspace"
        rows={[
          { label: "Repository", value: repository },
          {
            label: "Doctrine",
            value: `${layerCount} layers · ${ruleCount} rules`,
          },
          {
            label: "Modules",
            value: `${moduleCount} modules · ${presetCount} presets`,
          },
          {
            label: "Workflows",
            value: "Inspect · Validate · Scaffold · Verify (coming)",
          },
        ]}
      />
    </Box>
  );
}
