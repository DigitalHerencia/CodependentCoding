// Why: the slice form: four inputs (tab moves between them, enter plans) submitted through the preview action.
import { Box, Text } from "ink";
import { useState } from "react";

import { TextInput } from "@/components/ui/text-input";
import { useInputLock } from "@/hooks/use-input-lock";
import { previewSliceAction } from "@/lib/actions/slicesActions";
import type { SlicePreview, SliceRequest } from "@/types/slicesTypes";

const FIELDS = [
  ["appDir", "App folder", "path to an app made by hipster-stack new"],
  ["entity", "Entity", "invoice"],
  ["moduleId", "Module", "billing"],
  [
    "fields",
    "Fields",
    "number:string, amount:decimal?, status:enum(draft|sent)",
  ],
] as const;

export function SlicesNewForm({
  onPlanned,
}: {
  onPlanned: (request: SliceRequest, preview: SlicePreview) => void;
}) {
  const [values, setValues] = useState<SliceRequest>({
    appDir: "",
    entity: "",
    moduleId: "",
    fields: "",
  });
  const [error, setError] = useState<string | null>(null);
  useInputLock();
  const submit = async () => {
    setError(null);
    const result = await previewSliceAction(values);
    if (result.ok) onPlanned(values, result.data);
    else setError(result.error.message);
  };
  return (
    <Box flexDirection="column" paddingX={1}>
      {FIELDS.map(([name, label, placeholder], index) => (
        <TextInput
          key={name}
          id={`slice-${name}`}
          label={label}
          placeholder={placeholder}
          value={values[name]}
          onChange={(value) =>
            setValues((current) => ({ ...current, [name]: value }))
          }
          onSubmit={() => void submit()}
          autoFocus={index === 0}
        />
      ))}
      {error ? <Text color="red">{error}</Text> : null}
    </Box>
  );
}
