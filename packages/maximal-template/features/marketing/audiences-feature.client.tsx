"use client";
import { AudiencesToolbar } from "@/components/blocks/marketing-blocks";
import { useState } from "react";
import { MarketingAudiencesTemplate } from "@/components/templates/marketing-templates";
import type { AudienceDTO } from "@/types/marketingTypes";
export function AudiencesFeatureClient({
  audiences,
}: {
  audiences: AudienceDTO[];
}) {
  const [query, setQuery] = useState("");
  return (
    <MarketingAudiencesTemplate
      audiences={audiences.filter((audience) =>
        audience.name.toLowerCase().includes(query.toLowerCase()),
      )}
      toolbar={<AudiencesToolbar query={query} onQueryChange={setQuery} />}
    />
  );
}
