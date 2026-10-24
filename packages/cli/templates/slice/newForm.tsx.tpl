"use client";
// Why: Client form: validates with the shared schema, calls the action, and shows its ActionResult.
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import type { {{Entity}}DTO } from "@/types/{{module}}Types";
import { create{{Entity}}, update{{Entity}} } from "@/lib/actions/{{module}}Actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FormValues {
{{formValueTypes}}
}
export function {{Entity}}NewForm({ {{entity}} }: { {{entity}}?: {{Entity}}DTO }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
{{formDefaults}}
    },
  });
  return (
    <form
      className="mx-auto max-w-3xl space-y-5 surface-card p-5"
      onSubmit={handleSubmit(async (values) => {
        setError("");
        const input = {
{{formToInput}}
        };
        const result = {{entity}}
          ? await update{{Entity}}({
              ...input,
              {{param}}: {{entity}}.id,
              expectedVersion: {{entity}}.version,
            })
          : await create{{Entity}}(input);
        if (!result.ok) {
          setError(
            result.error.code === "CONFLICT"
              ? "This {{labelLower}} changed since you opened it. Reload, then edit again."
              : result.error.message,
          );
          return;
        }
        router.push(`/{{route}}/${result.data.id}`);
      })}
    >
      <h1 className="type-title">
        {{{entity}} ? "Edit {{labelLower}}" : "New {{labelLower}}"}
      </h1>
{{formInputs}}
      {error && <p role="alert">{error}</p>}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving…" : {{entity}} ? "Save {{labelLower}}" : "Create {{labelLower}}"}
      </Button>
    </form>
  );
}
