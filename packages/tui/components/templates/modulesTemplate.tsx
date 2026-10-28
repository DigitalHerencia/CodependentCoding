// Why: the modules screen: a module picker beside the chosen module's facts.
import { Box, Text } from "ink";
import type { ReactNode } from "react";

import { DetailPane } from "@/components/blocks/detail-pane";
import { KeyValue } from "@/components/ui/key-value";
import type { TemplateModule } from "@/types/modulesTypes";

const list = (items: string[]) =>
  items.length > 0 ? items.join(", ") : "none";

export function ModulesTemplate({
  picker,
  module,
}: {
  picker: ReactNode;
  module: TemplateModule | undefined;
}) {
  return (
    <Box gap={2}>
      <Box flexDirection="column" width={24} paddingX={1}>
        {picker}
      </Box>
      {module ? (
        <DetailPane title={module.label} note={module.description}>
          <KeyValue
            keyWidth={12}
            items={[
              { key: "Id", value: module.id },
              { key: "Kind", value: module.kind },
              { key: "Needs", value: list(module.dependsOn) },
              { key: "Presets", value: list(module.presets) },
              { key: "Packages", value: list(module.packages) },
              { key: "Env", value: list(module.env) },
            ]}
          />
        </DetailPane>
      ) : (
        <Text>No modules in the manifest.</Text>
      )}
    </Box>
  );
}
