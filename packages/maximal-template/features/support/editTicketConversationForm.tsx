"use client";

import {
  SupportFormButtonBlock as Button,
  SupportFormFieldBlock as Field,
  SupportFormFieldErrorBlock as FieldError,
  SupportFormFieldLabelBlock as FieldLabel,
  SupportFormNativeSelectBlock,
  SupportFormNativeSelectOptionBlock,
  SupportFormTextareaBlock,
} from "@/components/blocks/support-form-blocks";
import { formResultCopy } from "@/content/application";
import { supportControlCopy } from "@/content/support";
import {
  replyToSupportTicket,
  updateSupportTicketStatus,
} from "@/lib/actions/supportActions";
import {
  supportReplySchema,
  TicketStatus,
  updateSupportTicketStatusSchema,
} from "@/schemas/supportSchemas";
import type { SupportTicketDTO } from "@/types/supportTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import { Controller, useForm, type FieldPath } from "react-hook-form";
import type { z } from "zod";

export function EditTicketConversationForm({
  ticket,
}: {
  ticket: SupportTicketDTO;
}) {
  const router = useRouter();
  const id = useId();
  const [message, setMessage] = useState("");
  const form = useForm<
    z.input<typeof supportReplySchema>,
    unknown,
    z.output<typeof supportReplySchema>
  >({
    resolver: zodResolver(supportReplySchema),
    defaultValues: { ticketId: ticket.id, body: "" },
  });
  return (
    <form
      className="space-y-4"
      onSubmit={form.handleSubmit(async (values) => {
        setMessage("");
        try {
          const result = await replyToSupportTicket(values);
          if (!result.ok) {
            for (const [name, messages] of Object.entries(
              result.error.fieldErrors ?? {},
            ))
              form.setError(
                name as FieldPath<z.input<typeof supportReplySchema>>,
                { message: messages[0] ?? result.error.message },
              );
            form.setError("root", { message: result.error.message });
            return;
          }
          setMessage(formResultCopy.saved);
          router.refresh();
        } catch {
          form.setError("root", { message: formResultCopy.failed });
        }
      })}
      noValidate
    >
      <Controller
        name="body"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={id + "-body"}>
              {supportControlCopy.replyToConversation}
            </FieldLabel>
            <SupportFormTextareaBlock
              {...field}
              value={String(field.value ?? "")}
              id={id + "-body"}
              className="control-field min-h-32"
              aria-invalid={fieldState.invalid}
            />
            {fieldState.error && (
              <FieldError>{fieldState.error.message}</FieldError>
            )}
          </Field>
        )}
      />

      {form.formState.errors.root && (
        <FieldError>{form.formState.errors.root.message}</FieldError>
      )}
      <Button type="submit" disabled={form.formState.isSubmitting}>
        {supportControlCopy.saveReply}
      </Button>
      <p role="status">{message}</p>
    </form>
  );
}
export function TicketStatusForm({ ticket }: { ticket: SupportTicketDTO }) {
  const router = useRouter();
  const id = useId();
  const [message, setMessage] = useState("");
  const form = useForm<
    z.input<typeof updateSupportTicketStatusSchema>,
    unknown,
    z.output<typeof updateSupportTicketStatusSchema>
  >({
    resolver: zodResolver(updateSupportTicketStatusSchema),
    defaultValues: {
      ticketId: ticket.id,
      expectedVersion: ticket.version,
      status: ticket.status,
    },
  });
  return (
    <form
      className="space-y-4"
      onSubmit={form.handleSubmit(async (values) => {
        setMessage("");
        try {
          const result = await updateSupportTicketStatus(values);
          if (!result.ok) {
            for (const [name, messages] of Object.entries(
              result.error.fieldErrors ?? {},
            ))
              form.setError(
                name as FieldPath<
                  z.input<typeof updateSupportTicketStatusSchema>
                >,
                { message: messages[0] ?? result.error.message },
              );
            form.setError("root", { message: result.error.message });
            return;
          }
          setMessage(formResultCopy.saved);
          router.refresh();
        } catch {
          form.setError("root", { message: formResultCopy.failed });
        }
      })}
      noValidate
    >
      <Controller
        name="status"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={id + "-status"}>
              {supportControlCopy.ticketStatus}
            </FieldLabel>
            <SupportFormNativeSelectBlock
              {...field}
              value={String(field.value ?? "")}
              id={id + "-status"}
              className="control-field"
              aria-invalid={fieldState.invalid}
            >
              {Object.values(TicketStatus).map((status) => (
                <SupportFormNativeSelectOptionBlock key={status}>
                  {status}
                </SupportFormNativeSelectOptionBlock>
              ))}
            </SupportFormNativeSelectBlock>
            {fieldState.error && (
              <FieldError>{fieldState.error.message}</FieldError>
            )}
          </Field>
        )}
      />

      {form.formState.errors.root && (
        <FieldError>{form.formState.errors.root.message}</FieldError>
      )}
      <Button type="submit" disabled={form.formState.isSubmitting}>
        {supportControlCopy.updateStatus}
      </Button>
      <p role="status">{message}</p>
    </form>
  );
}
export function TicketFeatureClient({ ticket }: { ticket: SupportTicketDTO }) {
  return (
    <div className="space-y-5">
      <EditTicketConversationForm ticket={ticket} />
      <TicketStatusForm key={ticket.version} ticket={ticket} />
    </div>
  );
}
