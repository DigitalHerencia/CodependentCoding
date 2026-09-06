"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FormValues {
  name: string;
  email: string;
  status: string;
}

export function CrmEditLeadForm({ leadId }: { leadId: string }) {
  const recordId = leadId;
  const [reviewed, setReviewed] = useState<FormValues | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { name: "", email: "", status: "ACTIVE" },
  });

  return (
    <form
      className="mx-auto max-w-4xl space-y-5 border border-border bg-[#05070a] p-5"
      onSubmit={handleSubmit((values) => setReviewed(values))}
    >
      <header className="border-b border-border pb-4">
        <p className="font-mono text-[0.62rem] tracking-wider text-[#8ec6d3] uppercase">
          /crm/leads/[leadId]/edit
        </p>
        <h1 className="mt-1 font-mono text-2xl font-black">Edit Lead</h1>
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <Label htmlFor={`name-${recordId}`}>Name</Label>
          <Input
            id={`name-${recordId}`}
            {...register("name", { required: "Name is required." })}
          />
          {errors.name ? (
            <span className="text-xs text-destructive">
              {errors.name.message}
            </span>
          ) : null}
        </label>
        <label className="space-y-2">
          <Label htmlFor={`email-${recordId}`}>Email or owner</Label>
          <Input id={`email-${recordId}`} {...register("email")} />
        </label>
        <label className="space-y-2 md:col-span-2">
          <Label htmlFor={`status-${recordId}`}>Status</Label>
          <Input
            id={`status-${recordId}`}
            {...register("status", { required: "Status is required." })}
          />
        </label>
      </div>
      <Button type="submit">Review changes</Button>
      {reviewed ? (
        <Alert>
          <AlertDescription>
            Review ready for the protected server workflow: {reviewed.name} (
            {reviewed.status}). No persistent write has been issued.
          </AlertDescription>
        </Alert>
      ) : null}
    </form>
  );
}
