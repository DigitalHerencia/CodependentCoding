"use client";

import {
  supportPresentationCopy,
  supportRemainingCopy,
} from "@/content/support";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import { createSupportTicket } from "@/lib/actions/supportActions";
import {
  createSupportTicketSchema,
  TicketPriority,
} from "@/schemas/supportSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FieldPath } from "react-hook-form";
import { Controller, useForm } from "react-hook-form";
import type { z } from "zod";

export function NewSupportTicketForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const {
    setError: setFieldError,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<
    z.input<typeof createSupportTicketSchema>,
    unknown,
    z.output<typeof createSupportTicketSchema>
  >({
    resolver: zodResolver(createSupportTicketSchema),
    defaultValues: { subject: "", description: "", priority: "NORMAL" },
  });
  return (
    <form
      className="mx-auto max-w-3xl space-y-5 surface-card p-5"
      onSubmit={handleSubmit(async (values) => {
        setError("");
        try {
          const ticket = await createSupportTicket(values);
          if (!ticket.ok) {
            for (const [name, messages] of Object.entries(
              ticket.error.fieldErrors ?? {},
            ))
              setFieldError(
                name as FieldPath<z.input<typeof createSupportTicketSchema>>,
                { message: messages[0] ?? ticket.error.message },
              );
            setError(ticket.error.message);
            return;
          }
          router.push(`/support/tickets/${ticket.data.id}`);
          router.refresh();
        } catch {
          setError(
            supportPresentationCopy.ticketCouldNotBeSavedCheckYourInputAnd,
          );
        }
      })}
      noValidate
    >
      <h1 className="type-title">{supportPresentationCopy.requestSupport}</h1>
      <Controller
        name={"subject"}
        control={control}
        render={({ field: controllerField, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="ticket-subject">
              {supportRemainingCopy.subject}
            </FieldLabel>
            <Input
              id="ticket-subject"
              required
              maxLength={300}
              {...controllerField}
              value={String(controllerField.value ?? "")}
              aria-invalid={fieldState.invalid}
            />
            {fieldState.error && (
              <FieldError>{fieldState.error.message}</FieldError>
            )}
          </Field>
        )}
      />
      <Controller
        name={"description"}
        control={control}
        render={({ field: controllerField, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="ticket-description">
              {supportRemainingCopy.whatHappenedAndWhatDidYouExpect}
            </FieldLabel>
            <Textarea
              id="ticket-description"
              className="control-field min-h-48"
              maxLength={30000}
              {...controllerField}
              value={String(controllerField.value ?? "")}
              aria-invalid={fieldState.invalid}
            />
            {fieldState.error && (
              <FieldError>{fieldState.error.message}</FieldError>
            )}
          </Field>
        )}
      />
      <Controller
        name={"priority"}
        control={control}
        render={({ field: controllerField, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="ticket-priority">
              {supportRemainingCopy.priority}
            </FieldLabel>
            <NativeSelect
              id="ticket-priority"
              className="control-field"
              {...controllerField}
              value={String(controllerField.value ?? "")}
              aria-invalid={fieldState.invalid}
            >
              {Object.values(TicketPriority).map((priority) => (
                <NativeSelectOption key={priority}>
                  {priority}
                </NativeSelectOption>
              ))}
            </NativeSelect>
            {fieldState.error && (
              <FieldError>{fieldState.error.message}</FieldError>
            )}
          </Field>
        )}
      />
      {error && <p role="alert">{error}</p>}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting
          ? supportPresentationCopy.saving
          : supportPresentationCopy.createTicket}
      </Button>
    </form>
  );
}
