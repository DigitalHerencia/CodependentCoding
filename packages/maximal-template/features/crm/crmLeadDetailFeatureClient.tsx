"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { CrmQualifyLeadBlock } from "@/components/blocks/crm-blocks";
import type { ActionResult } from "@/types/actionTypes";
import type { CrmContactDTO } from "@/types/crmTypes";

/** Browser-only qualification interaction; server action supplied by the workflow. */
export function CrmLeadDetailFeatureClient({
  contactId, qualifyLead,
}: {
  contactId: string;
  qualifyLead: (contactId: unknown) => Promise<ActionResult<CrmContactDTO>>;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>();
  return (
    <CrmQualifyLeadBlock
      pending={pending}
      error={error}
      onQualify={() => startTransition(async () => {
        setError(undefined);
        const result = await qualifyLead(contactId);
        if (!result.ok) { setError(result.error.message); return; }
        router.replace("/crm/contacts/" + result.data.id);
        router.refresh();
      })}
    />
  );
}
