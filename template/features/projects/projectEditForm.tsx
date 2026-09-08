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

export function ProjectEditForm({ projectId }: { projectId: string }) {
  const recordId = projectId;
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
      className="mx-auto w-full max-w-4xl space-y-5 surface-card p-5"
      onSubmit={handleSubmit((values) => setReviewed(values))}
    >
      <header className="border-b border-border pb-4">
        <p className="type-caption text-muted-primary uppercase">
          /projects/[projectId]/edit
        </p>
        <h1 className="mt-1 type-title">Edit Project</h1>
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="form-field">
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
        </div>
        <div className="form-field">
          <Label htmlFor={`email-${recordId}`}>Email or owner</Label>
          <Input id={`email-${recordId}`} {...register("email")} />
        </div>
        <div className="form-field md:col-span-2">
          <Label htmlFor={`status-${recordId}`}>Status</Label>
          <Input
            id={`status-${recordId}`}
            {...register("status", { required: "Status is required." })}
          />
        </div>
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
