"use client";

import { AiPlaygroundTemplate } from "@/components/templates/ai-templates";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { aiPresentationCopy, aiRemainingCopy } from "@/content/ai";
import { formResultCopy } from "@/content/application";
import { generateAiResponse } from "@/lib/actions/aiActions";
import { aiGenerationRequestSchema } from "@/schemas/aiSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import type { z } from "zod";

export function NewAiGenerationForm({
  configuration,
}: {
  configuration: { configured: boolean; model: string };
}) {
  const router = useRouter();
  const [output, setOutput] = useState("");
  const form = useForm<z.input<typeof aiGenerationRequestSchema>>({
    resolver: zodResolver(aiGenerationRequestSchema),
    defaultValues: { prompt: "" },
  });
  const pending = form.formState.isSubmitting;
  return (
    <AiPlaygroundTemplate
      model={configuration.model}
      output={
        <div aria-live="polite" className="whitespace-pre-wrap">
          {pending
            ? aiRemainingCopy.generating
            : output || aiRemainingCopy.submitAPromptToGenerateAResponse}
        </div>
      }
    >
      <form
        className="space-y-4"
        onSubmit={form.handleSubmit(async (values) => {
          try {
            const result = await generateAiResponse(values);
            if (!result.ok) {
              if (result.error.fieldErrors?.prompt?.[0])
                form.setError("prompt", {
                  message: result.error.fieldErrors.prompt[0],
                });
              form.setError("root", { message: result.error.message });
              return;
            }
            setOutput(result.data.text);
            router.refresh();
          } catch {
            form.setError("root", { message: formResultCopy.failed });
          }
        })}
        noValidate
      >
        <Controller
          name="prompt"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="ai-prompt">
                {aiRemainingCopy.yourPrompt}
              </FieldLabel>
              <Textarea
                {...field}
                id="ai-prompt"
                className="control-field min-h-64 w-full"
                disabled={pending}
                aria-invalid={fieldState.invalid}
              />
              {fieldState.error && (
                <FieldError>{fieldState.error.message}</FieldError>
              )}
            </Field>
          )}
        />
        {!configuration.configured && (
          <p role="status">
            {aiPresentationCopy.theAIProviderIsNotConfiguredForThisWorkspace}
          </p>
        )}
        {form.formState.errors.root && (
          <FieldError>{form.formState.errors.root.message}</FieldError>
        )}
        <Button type="submit" disabled={pending || !configuration.configured}>
          {pending
            ? aiPresentationCopy.generating
            : aiPresentationCopy.generateResponse}
        </Button>
      </form>
    </AiPlaygroundTemplate>
  );
}
