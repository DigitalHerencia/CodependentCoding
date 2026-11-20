/** Browser installation state and event contract; account identity belongs to auth. */
export type PwaInstallProps = {
  canInstall: boolean;
  showIosInstructions: boolean;
  onInstall: () => void | Promise<void>;
  onDismiss: () => void | Promise<void>;
};
