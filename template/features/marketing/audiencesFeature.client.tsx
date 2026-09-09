"use client";
import Link from "next/link";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { MarketingAudiencesTemplate } from "@/components/templates/marketingAudiencesTemplate";
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
      toolbar={
        <div className="flex flex-wrap gap-3">
          <Input
            aria-label="Search audiences"
            placeholder="Search audiences"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <Link className="type-link" href="/marketing/audiences/new">
            Define audience
          </Link>
        </div>
      }
    />
  );
}
