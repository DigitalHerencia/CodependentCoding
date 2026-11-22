import {
  SettingsPageBlock,
  SettingsMembersBlock,
  SettingsIntegrationsBlock,
  SettingsBillingConfigurationBlock,
} from "@/components/blocks/settings-blocks";
import { BillingSettingsContentBlock } from "@/components/blocks/billing-page-blocks";
import type {
  SettingsMembersProps,
  SettingsIntegrationsProps,
  SettingsBillingProps,
} from "@/types/settingsTypes";

/** Arrange the directory with invitation-owned interaction slots. */
export function SettingsMembersTemplate(props: SettingsMembersProps) {
  return (
    <SettingsPageBlock page="members">
      <SettingsMembersBlock {...props} />
    </SettingsPageBlock>
  );
}

/** Arrange the authorized installed-provider projection. */
export function SettingsIntegrationsTemplate(props: SettingsIntegrationsProps) {
  return (
    <SettingsPageBlock page="integrations">
      <SettingsIntegrationsBlock {...props} />
    </SettingsPageBlock>
  );
}

/** Arrange billing-owned presentation with separate configuration metadata. */
export function SettingsBillingTemplate(props: SettingsBillingProps) {
  return (
    <SettingsPageBlock page="billing">
      {props.providerConfiguration !== "restricted" && (
        <SettingsBillingConfigurationBlock
          providerConfiguration={props.providerConfiguration}
        />
      )}
      <BillingSettingsContentBlock subscription={props.subscription} />
    </SettingsPageBlock>
  );
}
