// Why: keyboard companion: enter picks a folder, x forgets it, a adds one (through the settings actions).
import { Text, useInput } from "ink";
import { useState } from "react";

import { SettingsTemplate } from "@/components/templates/settingsTemplate";
import { Select } from "@/components/ui/select";
import { SettingsAppFolderForm } from "@/features/settings/settingsAppFolderForm";
import { forgetAppAction } from "@/lib/actions/settingsActions";
import type { SettingsView } from "@/types/settingsTypes";

const HELP = "enter picks a folder · x forgets it · a adds one";

export function SettingsFeatureClient({
  settings,
}: {
  settings: SettingsView;
}) {
  const [apps, setApps] = useState(settings.apps);
  const [picked, setPicked] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [message, setMessage] = useState<string | null>(HELP);
  useInput(
    (input) => {
      if (input === "a") {
        setAdding(true);
        setMessage("Enter a folder made by hipster-stack; esc leaves.");
      } else if (input === "x" && picked) {
        void forgetAppAction(picked).then((result) => {
          if (!result.ok) return setMessage(result.error.message);
          setApps(result.data);
          setPicked(null);
          setMessage(`Forgot ${picked} (the folder is untouched). ${HELP}`);
        });
      }
    },
    { isActive: !adding },
  );
  return (
    <SettingsTemplate
      root={settings.root}
      file={settings.file}
      folders={
        apps.length > 0 ? (
          <Select
            key={apps.join("|")}
            label="App folders"
            options={apps.map((dir) => ({ value: dir, label: dir }))}
            {...(picked ? { value: picked } : {})}
            onChange={setPicked}
            isActive={!adding}
            autoFocus
          />
        ) : (
          <Text>No app folders yet.</Text>
        )
      }
      form={
        adding ? (
          <SettingsAppFolderForm
            onSaved={(next) => {
              setApps(next);
              setAdding(false);
              setMessage(`Added. ${HELP}`);
            }}
          />
        ) : null
      }
      message={message}
    />
  );
}
