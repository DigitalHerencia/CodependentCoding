"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { InvitationDTO } from "@/types/commonTypes";
import { revokeInvitation } from "@/lib/actions/commonActions";
import { Button } from "@/components/ui/button";

export function InvitationsFeatureClient({
  invitations,
}: {
  invitations: InvitationDTO[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  if (invitations.length === 0) return <p>No pending invitations.</p>;
  return (
    <div className="space-y-2">
      <ul className="divide-y divide-border border border-border">
        {invitations.map((invitation) => (
          <li
            className="flex flex-wrap items-center justify-between gap-2 p-3"
            key={invitation.id}
          >
            <span>
              {invitation.email} · {invitation.role} · expires{" "}
              {new Date(invitation.expiresAt).toLocaleDateString()}
            </span>
            <Button
              disabled={pending}
              onClick={() =>
                startTransition(async () => {
                  const result = await revokeInvitation({
                    invitationId: invitation.id,
                  });
                  if (!result.ok)
                    setError("The invitation could not be revoked.");
                  router.refresh();
                })
              }
              type="button"
              variant="outline"
            >
              Revoke
            </Button>
          </li>
        ))}
      </ul>
      {error && <p role="alert">{error}</p>}
    </div>
  );
}
