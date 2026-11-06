"use client";

import { MarketingAudiencesTemplate } from "@/components/templates/marketing-templates";
import { selectAudiencesWorkflow } from "@/lib/workflows/marketingClientWorkflows";
import type { AudienceDTO } from "@/types/marketingTypes";
import { useState } from "react";

export function AudiencesFeatureClient({
  audiences,
}: {
  audiences: AudienceDTO[];
}) {
  const [query, setQuery] = useState("");
  return (
    <MarketingAudiencesTemplate
      audiences={selectAudiencesWorkflow(audiences, query)}
      toolbarProps={{ query: query, onQueryChange: setQuery }}
    />
  );
}
