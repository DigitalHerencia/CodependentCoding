"use client";

import { accountFormCopy as copy } from "@/content/crm";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { createCrmAccount, updateCrmAccount } from "@/lib/actions/crmActions";
import { crmAccountFormSchema } from "@/schemas/crmSchemas";
import type { CrmAccountDTO } from "@/types/crmTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import type { z } from "zod";

export function NewCrmAccountForm({ account }: { account?: CrmAccountDTO }) {
  const router = useRouter();
  const fields = ["name", "website", "industry", "notes"] as const;
  const {
    control,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<
    z.input<typeof crmAccountFormSchema>,
    unknown,
    z.output<typeof crmAccountFormSchema>
  >({
    resolver: zodResolver(crmAccountFormSchema),
    defaultValues: {
      name: account?.name ?? "",
      website: account?.website ?? "",
      industry: account?.industry ?? "",
      notes: account?.notes ?? "",
    },
  });
  return (
    <form
      className="mx-auto max-w-3xl space-y-5 surface-card p-5"
      noValidate
      onSubmit={handleSubmit(async (values) => {
        const result = account
          ? await updateCrmAccount({
              ...values,
              accountId: account.id,
              expectedUpdatedAt: account.updatedAt,
            })
          : await createCrmAccount(values);
        if (!result.ok) {
          for (const name of fields) {
            const message = result.error.fieldErrors?.[name]?.[0];
            if (message) setError(name, { message });
          }
          setError("root", { message: result.error.message });
          return;
        }
        router.push(`/crm/accounts/${result.data.id}`);
        router.refresh();
      })}
    >
      <h1 className="type-title">{account ? copy.edit : copy.create}</h1>
      <div className="grid gap-4">
        {fields.map((name) => (
          <Controller
            key={name}
            name={name}
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={name}>{copy.fields[name]}</FieldLabel>
                {name === "notes" ? (
                  <Textarea
                    id={name}
                    className="control-field min-h-36"
                    aria-invalid={fieldState.invalid}
                    {...field}
                  />
                ) : (
                  <Input
                    id={name}
                    type={name === "website" ? "url" : "text"}
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
