// Why: keyboard companion: arrow keys pick a layer; never reads the checkout itself.
import { useState } from "react";

import { DoctrineTemplate } from "@/components/templates/doctrineTemplate";
import { Select } from "@/components/ui/select";
import type { DoctrineLayer, DoctrineRule } from "@/types/doctrineTypes";

export function DoctrineFeatureClient({
  layers,
  rules,
}: {
  layers: DoctrineLayer[];
  rules: DoctrineRule[];
}) {
  const [layerId, setLayerId] = useState(layers[0]?.id ?? "");
  const layer = layers.find((candidate) => candidate.id === layerId);
  return (
    <DoctrineTemplate
      picker={
        <Select
          label="Layers"
          options={layers.map((item) => ({ value: item.id, label: item.id }))}
          value={layerId}
          onChange={setLayerId}
          autoFocus
        />
      }
      layer={layer}
      rules={rules.filter((rule) => rule.layer === layerId)}
    />
  );
}
