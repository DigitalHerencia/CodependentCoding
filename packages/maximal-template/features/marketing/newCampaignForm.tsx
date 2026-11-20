"use client";

import { useEffect, useId, useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm, type FieldPath } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  MarketingCampaignNewTemplate,
  MarketingCampaignEditTemplate,
  MarketingFieldTemplate,
  MarketingAudienceSearchTemplate,
} from "@/components/templates/marketing-templates";
import {
  saveCampaignWorkflow,
  searchAudienceOptionsWorkflow,
} from "@/lib/workflows/marketingWorkflows";
import { campaignEditorSchema } from "@/schemas/marketingSchemas";
import type {
  CampaignEditorValues,
  MarketingCampaignFormProps,
  MarketingSubmissionState,
  MarketingAudienceOption,
} from "@/types/marketingTypes";

/** Own campaign RHF state, explicit UTC bindings, validation and server submission. */
export function NewCampaignForm({
  campaign,
  audiences,
  canSave,
  canSearchAudiences,
}: MarketingCampaignFormProps) {
  const router = useRouter();
  const id = useId();
  const [state, setState] = useState<MarketingSubmissionState>({
    error: null,
    saved: false,
  });
  const [options, setOptions] = useState<MarketingAudienceOption[]>(audiences);
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | undefined>();
  const [searchTotal, setSearchTotal] = useState<number | null>(null);
  const form = useForm<CampaignEditorValues>({
    resolver: zodResolver(campaignEditorSchema),
    defaultValues: {
      name: campaign?.name ?? "",
      description: campaign?.description ?? "",
      audienceId: campaign?.audience?.id ?? "",
      scheduledAt: campaign?.scheduledAt?.slice(0, 16) ?? "",
    },
  });
  useEffect(() => {
    if (state.error)
      document
        .querySelector<HTMLElement>("[data-marketing-form-error]")
        ?.focus();
  }, [state.error]);
  const Template = campaign
    ? MarketingCampaignEditTemplate
    : MarketingCampaignNewTemplate;
  return (
    <Template
      kind="campaign"
      pending={form.formState.isSubmitting}
      unavailable={!canSave}
      conflict={state.error?.code === "CONFLICT"}
      error={state.error?.message}
      onReload={() => location.reload()}
      cancelHref={
        campaign
          ? `/marketing/campaigns/${campaign.id}`
          : "/marketing/campaigns"
      }
      onSubmit={form.handleSubmit(async (values) => {
        setState({ error: null, saved: false });
        try {
          const result = await saveCampaignWorkflow({
            values,
            record: campaign
              ? { id: campaign.id, version: campaign.version }
              : null,
          });
          if (!result.ok) {
            for (const [name, messages] of Object.entries(
              result.error.fieldErrors ?? {},
            )) {
              const path = name.replace(/^values\./, "");
              if (
                ["name", "description", "audienceId", "scheduledAt"].includes(
                  path,
                )
              )
                form.setError(
                  path as FieldPath<CampaignEditorValues>,
                  { message: messages[0] ?? result.error.message },
                  { shouldFocus: true },
                );
            }
            setState({ error: result.error, saved: false });
            return;
          }
          router.push(`/marketing/campaigns/${result.data.id}`);
          router.refresh();
        } catch {
          setState({ error: { code: "INTERNAL", message: "" }, saved: false });
        }
      })}
    >
      {canSearchAudiences && (
        <MarketingAudienceSearchTemplate
          id={`${id}-audience-search`}
          query={query}
          onQueryChange={setQuery}
          pending={searching}
          error={searchError}
          results={
            searchTotal === null
              ? null
              : { shown: options.length, total: searchTotal }
          }
          onSearch={async () => {
            setSearching(true);
            setSearchError(undefined);
            try {
              const result = await searchAudienceOptionsWorkflow(query);
              if (!result.ok) {
                setSearchError(result.error.message);
                return;
              }
              setOptions(result.data.items);
              setSearchTotal(result.data.total);
            } catch {
              setSearchError("");
            } finally {
              setSearching(false);
            }
          }}
        />
      )}
      {(["name", "description", "audienceId", "scheduledAt"] as const).map(
        (name) => (
          <Controller
            key={name}
            name={name}
            control={form.control}
            render={({ field, fieldState }) => (
              <MarketingFieldTemplate
                id={`${id}-${name}`}
                kind={name}
                field={field}
                error={fieldState.error?.message}
                audiences={options}
              />
            )}
          />
        ),
      )}
    </Template>
  );
}
