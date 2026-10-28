// Why: the new-app questions one at a time, like the CLI wizard: folder, preset, organizations, access, color.
import { Box, Text } from "ink";
import { useState } from "react";

import { Select } from "@/components/ui/select";
import { TextInput } from "@/components/ui/text-input";
import { useInputLock } from "@/hooks/use-input-lock";
import { newAppRequestSchema } from "@/schemas/appsSchemas";
import type { NewAppRequest } from "@/types/appsTypes";

const TENANCY = [
  {
    value: "multi",
    label: "Many organizations",
    hint: "each with its own data",
  },
  { value: "single", label: "One organization" },
] as const;
const ACCESS = [
  { value: "abac", label: "Roles plus rules", hint: "RBAC + ABAC" },
  { value: "rbac", label: "Roles only", hint: "RBAC" },
] as const;

export function AppsNewForm({
  presets,
  onReady,
}: {
  presets: Record<string, string[]>;
  onReady: (request: NewAppRequest) => void;
}) {
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<NewAppRequest>({
    appDir: "",
    preset: "",
    tenancy: "multi",
    accessControl: "abac",
    color: "",
  });
  const [error, setError] = useState<string | null>(null);
  useInputLock();
  const next = (change: Partial<NewAppRequest>) => {
    const merged = { ...values, ...change };
    setValues(merged);
    setError(null);
    if (step < 4) return setStep(step + 1);
    const parsed = newAppRequestSchema.safeParse(merged);
    if (parsed.success) onReady(parsed.data);
    else setError(parsed.error.issues.map((issue) => issue.message).join(" "));
  };
  const answered = [
    ["Folder", values.appDir],
    ["Preset", values.preset],
    ["Organizations", values.tenancy],
    ["Access", values.accessControl],
  ].slice(0, step);

  return (
    <Box flexDirection="column" paddingX={1}>
      {answered.map(([label, value]) => (
        <Text key={label} dimColor>
          {label}: {value}
        </Text>
      ))}
      {step === 0 ? (
        <TextInput
          id="app-dir"
          label="Folder for the new app"
          placeholder="../my-app"
          value={values.appDir}
          onChange={(appDir) =>
            setValues((current) => ({ ...current, appDir }))
          }
          onSubmit={(appDir) =>
            appDir.trim() ? next({ appDir }) : setError("Enter a folder.")
          }
          autoFocus
        />
      ) : null}
      {step === 1 ? (
        <Select
          label="Preset"
          options={Object.entries(presets).map(([id, modules]) => ({
            value: id,
            label: id,
            hint: modules.join(", ") || "base only",
          }))}
          onSubmit={(preset) => next({ preset })}
          autoFocus
        />
      ) : null}
      {step === 2 ? (
        <Select
          label="Organizations"
          options={[...TENANCY]}
          onSubmit={(tenancy) => next({ tenancy })}
          autoFocus
        />
      ) : null}
      {step === 3 ? (
        <Select
          label="Access control"
          options={[...ACCESS]}
          onSubmit={(accessControl) => next({ accessControl })}
          autoFocus
        />
      ) : null}
      {step === 4 ? (
        <TextInput
          id="app-color"
          label="Brand color (enter to keep the default)"
          placeholder="#2f7a8d"
          value={values.color}
          onChange={(color) => setValues((current) => ({ ...current, color }))}
          onSubmit={(color) => next({ color })}
          autoFocus
        />
      ) : null}
      {error ? <Text color="red">{error}</Text> : null}
    </Box>
  );
}
