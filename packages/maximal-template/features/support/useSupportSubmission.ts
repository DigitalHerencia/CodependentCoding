"use client";

import type { ActionResult } from "@/types/actionTypes";
import { useRef, useState, type FormEvent } from "react";
import type { FieldPath, FieldValues, UseFormReturn } from "react-hook-form";

/** Bind an authenticated command to RHF and prevent overlapping submissions. */
export function useSupportSubmission<
  Input extends FieldValues,
  Output extends FieldValues,
  Result,
>(
  form: UseFormReturn<Input, unknown, Output>,
  command: (values: Output) => Promise<ActionResult<Result>>,
  onSuccess: (result: Result) => void,
) {
  const inFlight = useRef(false);
  const [saved, setSaved] = useState(false);
  const [transportFailed, setTransportFailed] = useState(false);
  const submit = form.handleSubmit(async (values) => {
    try {
      const outcome = await command(values);
      if (!outcome.ok) {
        for (const [name, messages] of Object.entries(
          outcome.error.fieldErrors ?? {},
        )) {
          form.setError(
            name as FieldPath<Input>,
            { message: messages[0] ?? outcome.error.message },
            { shouldFocus: true },
          );
        }
        form.setError("root.server", { message: outcome.error.message });
        return;
      }
      onSuccess(outcome.data);
      setSaved(true);
    } catch {
      setTransportFailed(true);
    }
  });

  return {
    saved,
    transportFailed,
    pending: form.formState.isSubmitting,
    error: form.formState.errors.root?.server?.message,
    onSubmit: async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (inFlight.current) return;
      inFlight.current = true;
      setSaved(false);
      setTransportFailed(false);
      try {
        await submit(event);
      } finally {
        inFlight.current = false;
      }
    },
  };
}
