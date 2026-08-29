"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createCampaign } from "@/lib/actions/marketingActions";
type CampaignForm = { name: string; description: string; scheduledAt: string };
export function CampaignEditorFeature() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<CampaignForm>();
  const [error, setError] = useState<string | null>(null);
  const submit = handleSubmit(async (values) => {
    setError(null);
    try {
      await createCampaign({
        name: values.name,
        description: values.description || null,
        scheduledAt: values.scheduledAt || null,
      });
      reset();
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Unable to create the campaign.",
      );
    }
  });
  return (
    <form
      onSubmit={(event) => void submit(event)}
      className="max-w-2xl space-y-4 border-3 border-foreground bg-card p-6"
    >
      <div className="space-y-2">
        <Label htmlFor="campaign-name">Name</Label>
        <Input id="campaign-name" {...register("name", { required: true })} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="campaign-description">Description</Label>
        <Textarea id="campaign-description" {...register("description")} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="campaign-schedule">Schedule</Label>
        <Input
          id="campaign-schedule"
          type="datetime-local"
          {...register("scheduledAt")}
        />
      </div>
      {error ? (
        <p role="alert" className="text-sm font-bold text-destructive">
          {error}
        </p>
      ) : null}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving…" : "Create campaign"}
      </Button>
    </form>
  );
}
