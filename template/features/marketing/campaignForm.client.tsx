"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { createCampaign, updateCampaign } from "@/lib/actions/marketingActions";
import type { CampaignDTO, AudienceDTO } from "@/types/marketingTypes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
export function CampaignForm({
  campaign,
  audiences,
}: {
  campaign?: CampaignDTO;
  audiences: AudienceDTO[];
}) {
  const router = useRouter();
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<{
    name: string;
    description: string;
    audienceId: string;
    scheduledAt: string;
  }>({
    defaultValues: {
      name: campaign?.name ?? "",
      description: campaign?.description ?? "",
      audienceId: campaign?.audience?.id ?? "",
      scheduledAt: campaign?.scheduledAt?.slice(0, 16) ?? "",
    },
  });
  return (
    <form
      className="mx-auto max-w-3xl space-y-5 surface-card p-5"
      onSubmit={handleSubmit(async (values) => {
        setError("");
        try {
          const input = {
            ...values,
            audienceId: values.audienceId || null,
            scheduledAt: values.scheduledAt ? `${values.scheduledAt}Z` : null,
          };
          const saved = campaign
            ? await updateCampaign({
                ...input,
                campaignId: campaign.id,
                expectedVersion: campaign.version,
              })
            : await createCampaign(input);
          router.push(`/marketing/campaigns/${saved.id}`);
          router.refresh();
        } catch {
          setError(
            "Campaign could not be saved. Check access, audience, or reload the current campaign. Only draft, scheduled or paused campaigns can be edited.",
          );
        }
      })}
    >
      <h1 className="type-title">
        {campaign ? "Edit campaign" : "Plan a campaign"}
      </h1>
      <div className="form-field">
        <Label htmlFor="campaign-name">Campaign name</Label>
        <Input id="campaign-name" required {...register("name")} />
      </div>
      <div className="form-field">
        <Label htmlFor="campaign-brief">Campaign brief</Label>
        <textarea
          id="campaign-brief"
          className="control-field min-h-40"
          {...register("description")}
        />
      </div>
      <div className="form-field">
        <Label htmlFor="campaign-audience">Target audience</Label>
        <select
          id="campaign-audience"
          className="control-field"
          {...register("audienceId")}
        >
          <option value="">No audience selected</option>
          {audiences.map((audience) => (
            <option key={audience.id} value={audience.id}>
              {audience.name}
            </option>
          ))}
        </select>
      </div>
      <div className="form-field">
        <Label htmlFor="campaign-date">Planned start (UTC)</Label>
        <Input
          id="campaign-date"
          type="datetime-local"
          {...register("scheduledAt")}
        />
      </div>
      {error && <p role="alert">{error}</p>}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving…" : "Save campaign"}
      </Button>
    </form>
  );
}
