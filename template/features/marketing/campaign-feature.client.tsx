"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { updateCampaignStatus } from "@/lib/actions/marketingActions";
import { CampaignStatus } from "@/schemas/marketingSchemas";
import type { CampaignDTO } from "@/types/marketingTypes";
export function CampaignFeatureClient({ campaign }: { campaign: CampaignDTO }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  return (
    <form
      className="mt-5 space-y-3"
      action={(data) =>
        startTransition(async () => {
          try {
            await updateCampaignStatus({
              campaignId: campaign.id,
              expectedVersion: campaign.version,
              status: data.get("status"),
            });
            setMessage("Campaign lifecycle saved.");
            router.refresh();
          } catch {
            setMessage(
              "Lifecycle update failed. Check access or refresh the campaign.",
            );
          }
        })
      }
    >
      <select
        className="control-field"
        name="status"
        aria-label="Campaign lifecycle"
        defaultValue={campaign.status}
      >
        {Object.values(CampaignStatus).map((status) => (
          <option key={status}>{status}</option>
        ))}
      </select>
      <Button type="submit" disabled={pending}>
        Save lifecycle
      </Button>
      <p className="text-sm text-muted-primary">
        This updates campaign planning state. It does not send messages.
      </p>
      <p role="status">{message}</p>
    </form>
  );
}
