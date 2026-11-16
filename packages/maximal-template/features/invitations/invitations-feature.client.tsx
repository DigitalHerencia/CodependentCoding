"use client";

import { InvitationsTemplate } from "@/components/templates/invitation-templates";
import { invitationContent } from "@/content/invitations";
import { revokeInvitationWorkflow } from "@/lib/workflows/invitationClientWorkflows";
import type { InvitationDTO } from "@/types/invitationTypes";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export function InvitationsFeatureClient({
  invitations,
}: {
  invitations: InvitationDTO[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  return (
    <InvitationsTemplate
      invitations={invitations}
      pending={pending}
      error={error}
      onRevoke={(invitationId) =>
        startTransition(async () => {
          setError("");
          try {
            const result = await revokeInvitationWorkflow({ invitationId });
            if (!result.ok) setError(invitationContent.revokeFailed);
            router.refresh();
          } catch {
            setError(invitationContent.revokeFailed);
          }
        })
      }
    />
  );
}
