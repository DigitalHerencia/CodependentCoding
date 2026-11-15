"use client";

import { CrmContactFieldBlock } from "@/components/blocks/crm-blocks";
import { CrmContactFormTemplate } from "@/components/templates/crm-templates";
import { createCrmContactWorkflow, createCrmLeadWorkflow } from "@/lib/workflows/crmWorkflows";
import { contactFormSchema, contactStatusSchema } from "@/schemas/crmSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import type { z } from "zod";

/** Client RHF state for contacts and leads; rendering belongs to CRM templates. */
export function CrmNewContactForm({ lead = false }: { lead?: boolean }) {
  const router = useRouter();
  const form = useForm<
    z.input<typeof contactFormSchema>,
    unknown,
    z.output<typeof contactFormSchema>
  >({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      title: "",
      status: lead ? "LEAD" : "ACTIVE",
    },
  });
  const fieldNames = ["firstName", "lastName", "email", "phone", "title", "status"] as const;
  const fields = fieldNames.map((name) => (
    <Controller
      key={name}
      name={name}
      control={form.control}
      render={({ field, fieldState }) => (
        <CrmContactFieldBlock
          name={name}
          field={field}
          invalid={fieldState.invalid}
          error={fieldState.error?.message}
          statusOptions={lead ? ["LEAD"] : contactStatusSchema.options}
        />
      )}
    />
  ));

  return (
    <CrmContactFormTemplate
      edit={false}
      lead={lead}
      fields={fields}
      pending={form.formState.isSubmitting}
      error={form.formState.errors.root?.message}
      onSubmit={form.handleSubmit(async (values) => {
        const result = lead
          ? await createCrmLeadWorkflow(values)
          : await createCrmContactWorkflow(values);
        if (!result.ok) {
          for (const name of fieldNames) {
            const message = result.error.fieldErrors?.[name]?.[0];
            if (message) form.setError(name, { message });
          }
          form.setError("root", { message: result.error.message });
          return;
        }
        router.push(`/crm/${lead ? "leads" : "contacts"}/${result.data.id}`);
        router.refresh();
      })}
    />
  );
}
