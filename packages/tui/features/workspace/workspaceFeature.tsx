// Why: loads the workspace and doctrine counts for the command center.
import { use } from "react";

import { WorkspaceTemplate } from "@/components/templates/workspaceTemplate";
import { getDoctrineSummary } from "@/lib/fetchers/doctrineFetchers";
import { getModuleCatalog } from "@/lib/fetchers/modulesFetchers";
import { getWorkspaceInfo } from "@/lib/fetchers/workspaceFetchers";

export function WorkspaceFeature() {
  const workspace = use(getWorkspaceInfo());
  const doctrine = use(getDoctrineSummary());
  const catalog = use(getModuleCatalog());
  return (
    <WorkspaceTemplate
      repository={workspace.name}
      layerCount={doctrine.layers.length}
      ruleCount={doctrine.rules.length}
      moduleCount={catalog.modules.length}
      presetCount={Object.keys(catalog.presets).length}
    />
  );
}
