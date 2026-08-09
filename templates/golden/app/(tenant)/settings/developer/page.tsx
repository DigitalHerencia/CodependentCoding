import { SettingsSectionFeature } from "@/features/settings/settings-section-feature"

export default function DeveloperSettingsPage() {
  return (
    <SettingsSectionFeature
      title="Developer"
      description="Expose product-specific developer controls without leaking server credentials."
    />
  )
}
