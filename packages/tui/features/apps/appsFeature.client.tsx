// Why: keyboard companion: arrow keys and enter pick an app; never reads the disk itself.
import { useState } from "react";

import { AppsTemplate } from "@/components/templates/appsTemplate";
import { Select } from "@/components/ui/select";
import type { GeneratedApp } from "@/types/appsTypes";

export function AppsFeatureClient({ apps }: { apps: GeneratedApp[] }) {
  const [dir, setDir] = useState(apps[0]?.dir ?? "");
  return (
    <AppsTemplate
      picker={
        <Select
          label="Apps"
          options={apps.map((app) => ({
            value: app.dir,
            label: app.name,
            ...(app.found ? {} : { hint: "missing" }),
          }))}
          value={dir}
          onChange={setDir}
          autoFocus
        />
      }
      app={apps.find((app) => app.dir === dir)}
    />
  );
}
