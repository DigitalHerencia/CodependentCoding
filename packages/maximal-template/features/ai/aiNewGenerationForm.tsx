"use client";

import { AiPlaygroundTemplate } from "@/components/templates/ai-templates";
import { generateAiResponseWorkflow } from "@/lib/workflows/aiWorkflows";
import { aiGenerationRequestSchema } from "@/schemas/aiSchemas";
import type {
  AiConfigurationProps,
  AiGenerationRequest,
} from "@/types/aiTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useController, useForm } from "react-hook-form";

/** Owns RHF state and validation; only the workflow may invoke the authenticated generation boundary. */
export function AiNewGenerationForm({ configuration }: AiConfigurationProps) {
  const router = useRouter();
  const [output, setOutput] = useState("");
  const form = useForm<AiGenerationRequest>({
    resolver: zodResolver(aiGenerationRequestSchema),
    defaultValues: { prompt: "" },
  });
  const prompt = useController({ name: "prompt", control: form.control });
  const submit = form.handleSubmit(async (values) => {
    form.clearErrors("root");
    setOutput("");
    try {
      const result = await generateAiResponseWorkflow(values);
      if (!result.ok) {
        const message = result.error.fieldErrors?.prompt?.[0];
        if (message)
          form.setError("prompt", { message }, { shouldFocus: true });
        form.setError("root", { type: "generation" });
        return;
      }
      setOutput(result.data.text);
      router.refresh();
    } catch {
      form.setError("root", { type: "generation" });
    }
  });
  return (
    <AiPlaygroundTemplate
      configuration={configuration}
      promptField={prompt.field}
      promptError={prompt.fieldState.error?.message}
      pending={form.formState.isSubmitting}
      error={form.formState.errors.root ? "generation" : undefined}
      output={output}
      onSubmit={submit}
    />
  );
}
