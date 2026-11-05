"use client";

import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { createContact, updateContact } from "@/lib/actions/crmActions";
import type { CrmContactDTO } from "@/types/crmTypes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { contactFormSchema, contactStatusSchema } from "@/schemas/crmSchemas";
import { contactFormCopy as copy } from "@/content/crm";
export function CrmNewContactForm({
  contact,
  lead = false,
}: {
  contact?: CrmContactDTO;
  lead?: boolean;
}) {
  const router = useRouter();
  const fields = [
    "firstName",
    "lastName",
    "email",
    "phone",
    "title",
    "status",
  ] as const;
  const {
    control,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<
    z.input<typeof contactFormSchema>,
    unknown,
    z.output<typeof contactFormSchema>
  >({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      firstName: contact?.firstName ?? "",
      lastName: contact?.lastName ?? "",
      email: contact?.email ?? "",
      phone: contact?.phone ?? "",
      title: contact?.title ?? "",
      status:
        contact?.status === "ARCHIVED"
          ? "INACTIVE"
          : (contact?.status ?? (lead ? "LEAD" : "ACTIVE")),
    },
  });
  return (
    <form
      className="mx-auto max-w-3xl space-y-5 surface-card p-5"
      noValidate
      onSubmit={handleSubmit(async (values) => {
        const result = contact
          ? await updateContact({
              ...values,
              contactId: contact.id,
              expectedUpdatedAt: contact.updatedAt,
            })
          : await createContact(values);
        if (!result.ok) {
          for (const name of fields) {
            const message = result.error.fieldErrors?.[name]?.[0];
            if (message) setError(name, { message });
          }
          setError("root", { message: result.error.message });
          return;
        }
        router.push(`/crm/${lead ? "leads" : "contacts"}/${result.data.id}`);
        router.refresh();
      })}
    >
      <h1 className="type-title">
        {contact ? copy.edit : copy.create} {lead ? copy.lead : copy.contact}
      </h1>
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map((name) => (
          <Controller
            key={name}
            name={name}
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={name}>{copy.fields[name]}</FieldLabel>
                {name === "status" ? (
                  <select
                    id={name}
                    className="control-field"
                    aria-invalid={fieldState.invalid}
                    {...field}
                  >
                    {contactStatusSchema.options.map((status) => (
                      <option key={status}>{status}</option>
                    ))}
                  </select>
                ) : (
                  <Input
                    id={name}
                    type={name === "email" ? "email" : "text"}
                    aria-invalid={fieldState.invalid}
                    {...field}
                  />
                )}
                <FieldError>{fieldState.error?.message}</FieldError>
              </Field>
            )}
          />
        ))}
      </div>
      <FieldError>{errors.root?.message}</FieldError>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? copy.saving : copy.save}
      </Button>
    </form>
  );
}
