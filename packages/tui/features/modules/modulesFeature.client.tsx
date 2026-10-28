// Why: keyboard companion: arrow keys and enter pick a module; never reads the checkout itself.
import { useState } from "react";

import { ModulesTemplate } from "@/components/templates/modulesTemplate";
import { Select } from "@/components/ui/select";
import type { TemplateModule } from "@/types/modulesTypes";

export function ModulesFeatureClient({
  modules,
}: {
  modules: TemplateModule[];
}) {
  const [moduleId, setModuleId] = useState(modules[0]?.id ?? "");
  return (
    <ModulesTemplate
      picker={
        <Select
          label="Modules"
          options={modules.map((item) => ({
            value: item.id,
            label: item.id,
            hint: item.kind,
          }))}
          value={moduleId}
          onChange={setModuleId}
          autoFocus
        />
      }
      module={modules.find((item) => item.id === moduleId)}
    />
  );
}
