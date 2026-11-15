"use client";

import { CrmAccountFieldBlock } from "@/components/blocks/crm-blocks";
import { CrmAccountFormTemplate } from "@/components/templates/crm-templates";
import { createCrmAccountWorkflow } from "@/lib/workflows/crmWorkflows";
import { crmAccountFormSchema } from "@/schemas/crmSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import type { z } from "zod";

/** Client RHF controller; template and field blocks own the markup. */
export function CrmNewAccountForm() {
  const router = useRouter();
  const form = useForm<
    z.input<typeof crmAccountFormSchema>,
    unknown,
    z.output<typeof crmAccountFormSchema>
  >({
    resolver: zodResolver(crmAccountFormSchema),
    defaultValues: {
      name: "",
      website: "",
      industry: "",
      notes: "",
    },
  });
  const fields = (["name", "website", "industry", "notes"] as const).map((name) => (
    <Controller
      key={name}
      name={name}
      control={form.control}
      render={({ field, fieldState }) => (
        <CrmAccountFieldBlock
          name={name}
          field={field}
          invalid={fieldState.invalid}
          error={fieldState.error?.message}
        />
      )}
    />
  ));

  return (
    <CrmAccountFormTemplate
      edit={false}
      fields={fields}
      pending={form.formState.isSubmitting}
      error={form.formState.errors.root?.message}
      onSubmit={form.handleSubmit(async (values) => {
        const result = await createCrmAccountWorkflow(values);
        if (!result.ok) {
          for (const name of ["name", "website", "industry", "notes"] as const) {
            const message = result.error.fieldErrors?.[name]?.[0];
            if (message) form.setError(name, { message });
          }
          form.setError("root", { message: result.error.message });
          return;
        }
        router.push(`/crm/accounts/${result.data.id}`);
        router.refresh();
      })}
    />
  );
}
