"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createTask } from "@/lib/actions/projectsActions";

type TaskForm = { title: string; description: string; dueAt: string };

export function TaskEditorFeature({ projectId }: { projectId: string }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<TaskForm>();
  const [error, setError] = useState<string | null>(null);
  const submit = handleSubmit(async (values) => {
    setError(null);
    try {
      await createTask({
        projectId,
        title: values.title,
        description: values.description || null,
        dueAt: values.dueAt || null,
      });
      reset();
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Unable to create the task.",
      );
    }
  });
  return (
    <form
      onSubmit={(event) => void submit(event)}
      className="max-w-2xl space-y-4 border-3 border-foreground bg-card p-6"
    >
      <div className="space-y-2">
        <Label htmlFor="task-title">Title</Label>
        <Input id="task-title" {...register("title", { required: true })} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="task-description">Description</Label>
        <Textarea id="task-description" {...register("description")} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="task-due">Due date</Label>
        <Input id="task-due" type="date" {...register("dueAt")} />
      </div>
      {error ? (
        <p role="alert" className="text-sm font-bold text-destructive">
          {error}
        </p>
      ) : null}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving…" : "Create task"}
      </Button>
    </form>
  );
}
