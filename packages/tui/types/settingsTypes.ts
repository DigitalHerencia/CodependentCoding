// Why: shared shapes for the terminal app's own settings.
export interface TuiSettings {
  /** Absolute folders of apps made by hipster-stack, newest first. */
  apps: string[];
}

export interface SettingsView extends TuiSettings {
  root: string;
  file: string;
}
