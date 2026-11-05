"use client";
// Why: Client island: filters the already-authorized {{entity}} list in the browser; never fetches.
import { useState } from "react";
import { {{Module}}{{Entities}}Template } from "@/components/templates/{{module}}-templates";
import { {{Module}}{{Entities}}Toolbar } from "@/components/blocks/{{module}}-blocks";
import type { {{Entity}}DTO } from "@/types/{{module}}Types";
export function {{Entities}}FeatureClient({
  {{entities}},
}: {
  {{entities}}: {{Entity}}DTO[];
}) {
  const [query, setQuery] = useState("");
  const needle = query.trim().toLowerCase();
  return (
    <{{Module}}{{Entities}}Template
      {{entities}}={{{entities}}.filter(({{entity}}) =>
        `{{searchText}}`.toLowerCase().includes(needle),
      )}
      toolbar={<{{Module}}{{Entities}}Toolbar query={query} onQueryChange={setQuery} />}
    />
  );
}
