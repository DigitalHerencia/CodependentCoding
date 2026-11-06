"use client";

import {
  ProjectsFormButtonBlock as Button,
  ProjectsFormFieldBlock as Field,
  ProjectsFormFieldErrorBlock as FieldError,
  ProjectsFormFieldLabelBlock as FieldLabel,
  ProjectsFormInputBlock as Input,
  ProjectsFormNativeSelectBlock,
  ProjectsFormNativeSelectOptionBlock,
  ProjectsFormTextareaBlock,
} from "@/components/blocks/projects-form-blocks";
import {
  projectsPresentationCopy,
  projectsRemainingCopy,
} from "@/content/projects";
import { createTask, updateTask } from "@/lib/actions/projectsActions";
import { createTaskSchema, TaskPriority } from "@/schemas/projectsSchemas";
import type { TaskDTO } from "@/types/projectsTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FieldPath } from "react-hook-form";
import { Controller, useForm } from "react-hook-form";
import type { z } from "zod";

// Why: Client form: validates with the shared schema, calls the action, and shows its ActionResult.

export function NewTaskForm({
  projectId,
  task,
}: {
  projectId: string;
  task?: TaskDTO;
}) {
  const router = useRouter();
  const [error, setError] = useState("");
  const {
    setError: setFieldError,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<
    z.input<typeof createTaskSchema>,
    unknown,
    z.output<typeof createTaskSchema>
  >({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      projectId,
      title: task?.title ?? "",
      description: task?.description ?? "",
      priority: task?.priority ?? "MEDIUM",
      dueAt: task?.dueAt?.slice(0, 10) ?? "",
    },
  });
  return (
    <form
      className="mx-auto max-w-3xl space-y-5 surface-card p-5"
      onSubmit={handleSubmit(async (values) => {
        setError("");
        const input = { ...values, projectId, dueAt: values.dueAt || null };
        const result = task
          ? await updateTask({
              ...input,
              taskId: task.id,
              expectedVersion: task.version,
            })
          : await createTask(input);
        if (!result.ok) {
          for (const [name, messages] of Object.entries(
            result.error.fieldErrors ?? {},
          ))
            setFieldError(name as FieldPath<z.input<typeof createTaskSchema>>, {
              message: messages[0] ?? result.error.message,
            });
          setError(
            result.error.code === "CONFLICT"
              ? "This task changed since you opened it. Reload, then edit again."
              : result.error.message,
          );
          return;
        }
        router.push(`/projects/${projectId}/tasks/${result.data.id}`);
      })}
      noValidate
    >
      <h1 className="type-title">
        {task
          ? projectsPresentationCopy.editTask
          : projectsPresentationCopy.planATask}
      </h1>
      <Controller
        name={"title"}
        control={control}
        render={({ field: controllerField, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="task-title">
              {projectsRemainingCopy.taskTitle}
            </FieldLabel>
            <Input
              id="task-title"
              required
              maxLength={300}
              {...controllerField}
              value={String(controllerField.value ?? "")}
              aria-invalid={fieldState.invalid}
            />
            {fieldState.error && (
              <FieldError>{fieldState.error.message}</FieldError>
            )}
          </Field>
        )}
      />
      <Controller
        name={"description"}
        control={control}
        render={({ field: controllerField, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="task-description">
              {projectsRemainingCopy.descriptionAndAcceptanceCriteria}
            </FieldLabel>
            <ProjectsFormTextareaBlock
              id="task-description"
              className="control-field min-h-36"
              maxLength={20000}
              {...controllerField}
              value={String(controllerField.value ?? "")}
              aria-invalid={fieldState.invalid}
            />
            {fieldState.error && (
              <FieldError>{fieldState.error.message}</FieldError>
            )}
          </Field>
        )}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Controller
          name={"priority"}
          control={control}
          render={({ field: controllerField, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="task-priority">
                {projectsRemainingCopy.priority}
              </FieldLabel>
              <ProjectsFormNativeSelectBlock
                id="task-priority"
                className="control-field"
                {...controllerField}
                value={String(controllerField.value ?? "")}
                aria-invalid={fieldState.invalid}
              >
                {Object.values(TaskPriority).map((priority) => (
                  <ProjectsFormNativeSelectOptionBlock key={priority}>
                    {priority}
                  </ProjectsFormNativeSelectOptionBlock>
                ))}
              </ProjectsFormNativeSelectBlock>
              {fieldState.error && (
                <FieldError>{fieldState.error.message}</FieldError>
              )}
            </Field>
          )}
        />
        <Controller
          name={"dueAt"}
          control={control}
          render={({ field: controllerField, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="task-due">
                {projectsRemainingCopy.dueOn}
              </FieldLabel>
              <Input
                id="task-due"
                type="date"
                {...controllerField}
                value={String(controllerField.value ?? "")}
                aria-invalid={fieldState.invalid}
              />
              {fieldState.error && (
                <FieldError>{fieldState.error.message}</FieldError>
              )}
            </Field>
          )}
        />
      </div>
      {error && <p role="alert">{error}</p>}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting
          ? projectsPresentationCopy.saving
          : task
            ? projectsPresentationCopy.saveTask
            : projectsPresentationCopy.createTask}
      </Button>
    </form>
  );
}
