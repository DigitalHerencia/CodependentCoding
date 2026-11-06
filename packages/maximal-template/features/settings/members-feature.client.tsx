"use client";

import { InvitationsTemplate } from "@/components/templates/shared-templates";
import { settingsBlockCopy } from "@/content/settings";
import { getInvitationCommandsWorkflow } from "@/lib/workflows/settingsClientWorkflows";
import type { InvitationDTO } from "@/types/commonTypes";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export function MembersFeatureClient({
  invitations,
}: {
  invitations: InvitationDTO[];
}) {
  const { revokeInvitation } = getInvitationCommandsWorkflow();
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
          const result = await revokeInvitation({
            invitationId,
          });
          if (!result.ok) setError(settingsBlockCopy.revokeFailed);
          router.refresh();
        })
      }
    />
  );
}
