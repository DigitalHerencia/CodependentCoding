"use client";
import { settingsBlockCopy } from "@/content/settings";
import { InvitationsBlock } from "@/components/blocks/settings-blocks";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { InvitationDTO } from "@/types/commonTypes";
import { revokeInvitation } from "@/lib/actions/commonActions";

export function InvitationsFeatureClient({
  invitations,
}: {
  invitations: InvitationDTO[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  return (
    <InvitationsBlock
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
