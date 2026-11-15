"use client";

import { CrmOpportunityFieldBlock } from "@/components/blocks/crm-blocks";
import { CrmOpportunityFormTemplate } from "@/components/templates/crm-templates";
import { createCrmDealWorkflow } from "@/lib/workflows/crmWorkflows";
import { createCrmDealSchema } from "@/schemas/crmSchemas";
import type { CrmAccountDTO } from "@/types/crmTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm, type FieldPath } from "react-hook-form";
import type { z } from "zod";

/** Own only RHF lifecycle; the template composes the visible form. */
export function CrmNewOpportunityForm({ accounts }: { accounts: CrmAccountDTO[] }) {
  const router = useRouter();
  const [message, setMessage] = useState<"saved" | "failed" | undefined>(undefined);
  const form = useForm<
    z.input<typeof createCrmDealSchema>,
    unknown,
    z.output<typeof createCrmDealSchema>
  >({
    resolver: zodResolver(createCrmDealSchema),
    defaultValues: {
      name: "",
      accountId: "",
      value: "0",
      currency: "USD",
      probability: 0,
      expectedCloseDate: "",
    },
  });
  const fields = (["name", "accountId", "value", "currency", "probability", "expectedCloseDate"] as const).map((name) => (
    <Controller
      key={name}
      name={name}
      control={form.control}
      render={({ field, fieldState }) => (
        <CrmOpportunityFieldBlock
          name={name}
          field={field}
          accounts={accounts}
          invalid={fieldState.invalid}
          error={fieldState.error?.message}
        />
      )}
    />
  ));
  return (
    <CrmOpportunityFormTemplate
      fields={fields}
      pending={form.formState.isSubmitting}
      error={form.formState.errors.root?.message}
      disabled={!accounts.length}
      status={message}
      onSubmit={form.handleSubmit(async (values) => {
        setMessage(undefined);
        try {
          const result = await createCrmDealWorkflow(values);
          if (!result.ok) {
            for (const [name, messages] of Object.entries(result.error.fieldErrors ?? {})) {
              form.setError(name as FieldPath<z.input<typeof createCrmDealSchema>>, {
                message: messages[0] ?? result.error.message,
              });
            }
            form.setError("root", { message: result.error.message });
            return;
          }
          setMessage("saved");
          form.reset();
          router.refresh();
        } catch {
          form.setError("root", { message: "Unable to save opportunity." });
        }
      })}
    />
  );
}
