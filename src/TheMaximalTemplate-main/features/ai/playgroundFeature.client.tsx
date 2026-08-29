"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export function PlaygroundFeatureClient({
  configured,
  model,
}: {
  configured: boolean;
  model: string;
}) {
  const [output, setOutput] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<{ prompt: string }>();
  const submit = handleSubmit(async ({ prompt }) => {
    setError(null);
    setOutput(null);
    try {
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const body = (await response.json()) as { text?: string; error?: string };
      if (!response.ok || !body.text)
        throw new Error(body.error ?? "Generation failed.");
      setOutput(body.text);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Generation failed.");
    }
  });
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Prompt · {model}</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={(event) => void submit(event)}>
            <Textarea
              rows={12}
              aria-label="Prompt"
              placeholder="Describe the output you need…"
              {...register("prompt", { required: true })}
            />
            {!configured ? (
              <p role="status" className="text-sm text-warning">
                The AI provider is not configured for this environment.
              </p>
            ) : null}
            {error ? (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            ) : null}
            <Button type="submit" disabled={!configured || isSubmitting}>
              {isSubmitting ? "Generating…" : "Generate"}
            </Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Output</CardTitle>
        </CardHeader>
        <CardContent>
          <div aria-live="polite" className="min-h-48 whitespace-pre-wrap">
            {output ?? "The generated response will appear here."}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
