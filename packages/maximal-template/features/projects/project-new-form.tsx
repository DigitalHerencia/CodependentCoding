"use client";
import { projectsRemainingCopy } from "@/content/projects";

import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import type { FieldPath } from "react-hook-form";
import { createProjectSchema } from "@/schemas/projectsSchemas";

import { projectsPresentationCopy } from "@/content/projects";
// Why: Client form: validates with the shared schema, calls the action, and shows its ActionResult.
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import type { ProjectSummaryDTO } from "@/types/projectsTypes";
import { createProject, updateProject } from "@/lib/actions/projectsActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";

export function ProjectNewForm({ project }: { project?: ProjectSummaryDTO }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const {
    setError: setFieldError,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<
    z.input<typeof createProjectSchema>,
    unknown,
    z.output<typeof createProjectSchema>
  >({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: project?.name ?? "",
      description: project?.description ?? "",
      startsAt: project?.startsAt?.slice(0, 10) ?? "",
      dueAt: project?.dueAt?.slice(0, 10) ?? "",
    },
  });
  return (
    <form
      className="mx-auto max-w-3xl space-y-5 surface-card p-5"
      onSubmit={handleSubmit(async (values) => {
        setError("");
        const input = {
          ...values,
          startsAt: values.startsAt || null,
          dueAt: values.dueAt || null,
        };
        const result = project
          ? await updateProject({
              ...input,
              projectId: project.id,
              expectedVersion: project.version,
            })
          : await createProject(input);
        if (!result.ok) {
          for (const [name, messages] of Object.entries(
            result.error.fieldErrors ?? {},
          ))
            setFieldError(
              name as FieldPath<z.input<typeof createProjectSchema>>,
              { message: messages[0] ?? result.error.message },
            );
          setError(
            result.error.code === "CONFLICT"
              ? "This project changed since you opened it. Reload, then edit again."
              : result.error.message,
          );
          return;
        }
        router.push(`/projects/${result.data.id}`);
      })}
      noValidate
    >
      <h1 className="type-title">
        {project
          ? projectsPresentationCopy.editProject
          : projectsPresentationCopy.planAProject}
      </h1>
      <Controller
        name={"name"}
        control={control}
        render={({ field: controllerField, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="project-name">
              {projectsRemainingCopy.projectName}
            </FieldLabel>
            <Input
              id="project-name"
              required
              maxLength={200}
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
            <FieldLabel htmlFor="project-description">
              {projectsRemainingCopy.projectBrief}
            </FieldLabel>
            <textarea
              id="project-description"
              className="control-field min-h-36"
              maxLength={10000}
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
          name={"startsAt"}
          control={control}
          render={({ field: controllerField, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="project-start">
                {projectsRemainingCopy.startsOn}
              </FieldLabel>
              <Input
                id="project-start"
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
        <Controller
          name={"dueAt"}
          control={control}
          render={({ field: controllerField, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="project-due">
                {projectsRemainingCopy.dueOn}
              </FieldLabel>
              <Input
                id="project-due"
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
          : project
            ? projectsPresentationCopy.saveProject
            : projectsPresentationCopy.createProject}
      </Button>
    </form>
  );
}
