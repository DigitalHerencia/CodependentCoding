// Why: the add-a-folder form: one input, enter remembers it through the settings action.
import { Box, Text } from "ink";
import { useState } from "react";

import { TextInput } from "@/components/ui/text-input";
import { useInputLock } from "@/hooks/use-input-lock";
import { rememberAppAction } from "@/lib/actions/settingsActions";

export function SettingsAppFolderForm({
  onSaved,
}: {
  onSaved: (apps: string[]) => void;
}) {
  const [dir, setDir] = useState("");
  const [error, setError] = useState<string | null>(null);
  useInputLock();
  const submit = async () => {
    const result = await rememberAppAction({ dir });
    if (result.ok) onSaved(result.data);
    else setError(result.error.message);
  };
  return (
    <Box flexDirection="column" paddingX={1}>
      <TextInput
        id="settings-app-folder"
        label="App folder"
        placeholder="../my-app"
        value={dir}
        onChange={setDir}
        onSubmit={() => void submit()}
        autoFocus
      />
      {error ? <Text color="red">{error}</Text> : null}
    </Box>
  );
}
