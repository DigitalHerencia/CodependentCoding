"use client";

import { useState, useId } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm, type FieldPath } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { formResultCopy } from "@/content/application";
import { projectsControlCopy } from "@/content/projects";
import { assignProjectTask } from "@/lib/actions/projectsActions";
import { assignTaskSchema } from "@/schema/projectsSchemas";
import type { TaskDTO } from "@/types/projectsTypes";
export function TaskFeatureClient({
  task,
  members,
}: {
  task: TaskDTO;
  members: { id: string; name: string; status: string }[];
}) {
  const router = useRouter();
  const id = useId();
  const [message, setMessage] = useState("");
  const form = useForm<
    z.input<typeof assignTaskSchema>,
    unknown,
    z.output<typeof assignTaskSchema>
  >({
    resolver: zodResolver(assignTaskSchema),
    defaultValues: {
      taskId: task.id,
      expectedVersion: task.version,
      assigneeMembershipId: task.assignee?.membershipId ?? "",
    },
  });
  return (
    <form
      className="space-y-4"
      onSubmit={form.handleSubmit(async (values) => {
        setMessage("");
        try {
          const result = await assignProjectTask(values);
          if (!result.ok) {
            for (const [name, messages] of Object.entries(
              result.error.fieldErrors ?? {},
            ))
              form.setError(
                name as FieldPath<z.input<typeof assignTaskSchema>>,
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
        name="assigneeMembershipId"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={id + "-assigneeMembershipId"}>
              {projectsControlCopy.assignTo}
            </FieldLabel>
            <select
              {...field}
              value={String(field.value ?? "")}
              id={id + "-assigneeMembershipId"}
              className="control-field"
              aria-invalid={fieldState.invalid}
            >
              <option value="">{projectsControlCopy.unassigned}</option>
              {members
                .filter((member) => member.status === "ACTIVE")
                .map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name}
                  </option>
                ))}
            </select>
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
        {projectsControlCopy.saveAssignment}
      </Button>
      <p role="status">{message}</p>
    </form>
  );
}
