"use client";

import { CrmDealStageFieldBlock } from "@/components/blocks/crm-blocks";
import { CrmDealStageFormTemplate } from "@/components/templates/crm-templates";
import { updateCrmDealStageWorkflow } from "@/lib/workflows/crmWorkflows";
import { updateCrmDealStageSchema, CrmDealStage } from "@/schemas/crmSchemas";
import type { CrmDealSummaryDTO } from "@/types/crmTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import { Controller, useForm, type FieldPath } from "react-hook-form";
import type { z } from "zod";

/** RHF stage editor: state and server workflow invocation only. */
export function CrmEditDealStageForm({ deal }: { deal: CrmDealSummaryDTO }) {
  const router = useRouter();
  const id = useId();
  const [message, setMessage] = useState<"saved" | "failed" | undefined>(undefined);
  const form = useForm<
    z.input<typeof updateCrmDealStageSchema>,
    unknown,
    z.output<typeof updateCrmDealStageSchema>
  >({
    resolver: zodResolver(updateCrmDealStageSchema),
    defaultValues: {
      dealId: deal.id,
      expectedVersion: deal.version,
      stage: deal.stage,
    },
  });
  const fields = (
    <Controller
      name="stage"
      control={form.control}
      render={({ field, fieldState }) => (
        <CrmDealStageFieldBlock
          id={id + "-stage"}
          field={field}
          invalid={fieldState.invalid}
          error={fieldState.error?.message}
          stageOptions={Object.values(CrmDealStage)}
        />
      )}
    />
  );
  return (
    <CrmDealStageFormTemplate
      fields={fields}
      pending={form.formState.isSubmitting}
      error={form.formState.errors.root?.message}
      status={message}
      onSubmit={form.handleSubmit(async (values) => {
        setMessage(undefined);
        try {
          const result = await updateCrmDealStageWorkflow(values);
          if (!result.ok) {
            for (const [name, messages] of Object.entries(result.error.fieldErrors ?? {})) {
              form.setError(name as FieldPath<z.input<typeof updateCrmDealStageSchema>>, {
                message: messages[0] ?? result.error.message,
              });
            }
            form.setError("root", { message: result.error.message });
            return;
          }
          setMessage("saved");
          router.refresh();
        } catch {
          form.setError("root", { message: "Unable to update deal stage." });
        }
      })}
    />
  );
}
