"use client";

import {
  ProjectsFormButtonBlock as Button,
  ProjectsFormFieldBlock as Field,
  ProjectsFormFieldErrorBlock as FieldError,
  ProjectsFormFieldLabelBlock as FieldLabel,
  ProjectsFormNativeSelectBlock,
  ProjectsFormNativeSelectOptionBlock,
} from "@/components/blocks/projects-form-blocks";
import { formResultCopy } from "@/content/application";
import { projectsControlCopy } from "@/content/projects";
import { updateTaskStatus } from "@/lib/actions/projectsActions";
import { TaskStatus, updateTaskStatusSchema } from "@/schemas/projectsSchemas";
import type { TaskDTO } from "@/types/projectsTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import { Controller, useForm, type FieldPath } from "react-hook-form";
import type { z } from "zod";

export function EditTaskStatusForm({ task }: { task: TaskDTO }) {
  const router = useRouter();
  const id = useId();
  const [message, setMessage] = useState("");
  const form = useForm<
    z.input<typeof updateTaskStatusSchema>,
    unknown,
    z.output<typeof updateTaskStatusSchema>
  >({
    resolver: zodResolver(updateTaskStatusSchema),
    defaultValues: {
      taskId: task.id,
      expectedVersion: task.version,
      status: task.status,
    },
  });
  return (
    <form
      className="space-y-4"
      onSubmit={form.handleSubmit(async (values) => {
        setMessage("");
        try {
          const result = await updateTaskStatus(values);
          if (!result.ok) {
            for (const [name, messages] of Object.entries(
              result.error.fieldErrors ?? {},
            ))
              form.setError(
                name as FieldPath<z.input<typeof updateTaskStatusSchema>>,
                { message: messages[0] ?? result.error.message },
              );
            form.setError("root", { message: result.error.message });
            return;
          }
          setMessage(formResultCopy.saved);
          router.refresh();
        } catch {
          form.setError("root", { message: formResultCopy.failed });
        }
      })}
      noValidate
    >
      <Controller
        name="status"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={id + "-status"}>
              {projectsControlCopy.taskStatus}
            </FieldLabel>
            <ProjectsFormNativeSelectBlock
              {...field}
              value={String(field.value ?? "")}
              id={id + "-status"}
              className="control-field"
              aria-invalid={fieldState.invalid}
            >
              {Object.values(TaskStatus).map((status) => (
                <ProjectsFormNativeSelectOptionBlock key={status}>
                  {status}
                </ProjectsFormNativeSelectOptionBlock>
              ))}
            </ProjectsFormNativeSelectBlock>
            {fieldState.error && (
              <FieldError>{fieldState.error.message}</FieldError>
            )}
          </Field>
        )}
      />

      {form.formState.errors.root && (
        <FieldError>{form.formState.errors.root.message}</FieldError>
      )}
      <Button type="submit" disabled={form.formState.isSubmitting}>
        {projectsControlCopy.updateStatus}
      </Button>
      <p role="status">{message}</p>
    </form>
  );
}
