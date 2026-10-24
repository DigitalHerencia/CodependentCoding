"use client";
// Why: Client island: filters the already-authorized {{entity}} list in the browser; never fetches.
import Link from "next/link";
import { useState } from "react";
import { {{Module}}{{Entities}}Template } from "@/components/templates/{{module}}{{Entities}}Template";
import { Input } from "@/components/ui/input";
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
      toolbar={
        <div className="flex flex-wrap gap-3">
          <Input
            aria-label="Search {{labelPluralLower}}"
            placeholder="Search {{labelPluralLower}}"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <Link className="type-link" href="/{{route}}/new">
            New {{labelLower}}
          </Link>
        </div>
      }
    />
  );
}
