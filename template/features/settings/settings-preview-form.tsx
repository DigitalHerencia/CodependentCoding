"use client";
import { settingsRemainingCopy } from "@/content/settings";

import { settingsLibraryCopy } from "@/content/settings";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils/cn";
import {
  User,
  Bell,
  Shield,
  CreditCard,
  Palette,
  Key,
  Upload,
  Save,
  Trash2,
  AlertTriangle,
  Check,
  Moon,
  Sun,
  Monitor,
} from "lucide-react";

// ============================================================================
// SETTINGS VARIANT 1: Profile Settings
// ============================================================================
export type ProfileSettingsProps = {
  user?: {
    name: string;
    email: string;
    avatar?: string;
    bio?: string;
    company?: string;
    location?: string;
    website?: string;
  };
  onSave?: (data: ProfileSettingsProps["user"]) => void;
  onAvatarChange?: (file: File) => void;
  className?: string;
};

export function ProfileSettings({
  user = {
    name: "",
    email: "",
  },
  onSave,
  onAvatarChange,
  className,
}: ProfileSettingsProps) {
  const [formData, setFormData] = React.useState(user);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave?.(formData);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onAvatarChange?.(file);
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-black uppercase">
          <User className="h-5 w-5" />
          {settingsLibraryCopy.profileSettings}
        </CardTitle>
        <CardDescription>
          {settingsLibraryCopy.manageYourPublicProfileInformation}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar className="h-24 w-24 border-3 border-foreground shadow-[4px_4px_0px_hsl(var(--shadow-color))]">
                <AvatarImage src={formData.avatar} />
                <AvatarFallback className="text-2xl font-bold">
                  {formData.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("") || settingsLibraryCopy.u}
                </AvatarFallback>
              </Avatar>
              <button
                type="button"
                aria-label={settingsLibraryCopy.uploadAvatar}
                onClick={handleAvatarClick}
                className="absolute -right-1 -bottom-1 flex h-8 w-8 items-center justify-center border-2 border-foreground bg-primary text-primary-foreground shadow-[2px_2px_0px_hsl(var(--shadow-color))] transition hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
              >
                <Upload className="h-4 w-4" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
            <div>
              <h3 className="font-bold">{settingsLibraryCopy.profilePhoto}</h3>
              <p className="text-sm text-muted-foreground">
                {settingsLibraryCopy.jPGPNGOrGIFMax2MB}
              </p>
            </div>
          </div>

          <Separator />

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-xs font-bold uppercase">
                {settingsLibraryCopy.fullName}
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder={settingsLibraryCopy.johnDoe}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-bold uppercase">
                {settingsLibraryCopy.email}
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder={settingsLibraryCopy.youExampleCom}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio" className="text-xs font-bold uppercase">
              {settingsLibraryCopy.bio}
            </Label>
            <Textarea
              id="bio"
              value={formData.bio ?? ""}
              onChange={(e) =>
                setFormData({ ...formData, bio: e.target.value })
              }
              placeholder={settingsLibraryCopy.tellUsAboutYourself}
              rows={3}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="company" className="text-xs font-bold uppercase">
                {settingsLibraryCopy.company}
              </Label>
              <Input
                id="company"
                value={formData.company ?? ""}
                onChange={(e) =>
                  setFormData({ ...formData, company: e.target.value })
                }
                placeholder={settingsLibraryCopy.acmeInc}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location" className="text-xs font-bold uppercase">
                {settingsLibraryCopy.location}
              </Label>
              <Input
                id="location"
                value={formData.location ?? ""}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                placeholder={settingsLibraryCopy.sanFranciscoCA}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="website" className="text-xs font-bold uppercase">
              {settingsLibraryCopy.website}
            </Label>
            <Input
              id="website"
              value={formData.website ?? ""}
              onChange={(e) =>
                setFormData({ ...formData, website: e.target.value })
              }
              placeholder={settingsLibraryCopy.httpsYourwebsiteCom}
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit">
              <Save className="mr-2 h-4 w-4" />
              {settingsLibraryCopy.saveChanges}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// SETTINGS VARIANT 2: Notification Settings
// ============================================================================
export type NotificationSetting = {
  id: string;
  title: string;
  description: string;
  email: boolean;
  push: boolean;
};

export type NotificationSettingsProps = {
  notifications?: NotificationSetting[];
  onSave?: (settings: NotificationSetting[]) => void;
  className?: string;
};

const defaultNotifications: NotificationSetting[] = [
  {
    id: "comments",
    title: settingsLibraryCopy.comments,
    description: settingsLibraryCopy.getNotifiedWhenSomeoneCommentsOnYourPost,
    email: true,
    push: true,
  },
  {
    id: "mentions",
    title: settingsLibraryCopy.mentions,
    description: settingsLibraryCopy.getNotifiedWhenSomeoneMentionsYou,
    email: true,
    push: false,
  },
  {
    id: "updates",
    title: settingsLibraryCopy.productUpdates,
    description: settingsLibraryCopy.newsAboutNewFeaturesAndImprovements,
    email: true,
    push: false,
  },
  {
    id: "marketing",
    title: settingsLibraryCopy.marketing,
    description: settingsLibraryCopy.promotionalEmailsAndOffers,
    email: false,
    push: false,
  },
];

export function NotificationSettings({
  notifications = defaultNotifications,
  onSave,
  className,
}: NotificationSettingsProps) {
  const [settings, setSettings] = React.useState(notifications);

  const handleToggle = (id: string, type: "email" | "push") => {
    setSettings(
      settings.map((setting) =>
        setting.id === id ? { ...setting, [type]: !setting[type] } : setting,
      ),
    );
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-black uppercase">
          <Bell className="h-5 w-5" />
          {settingsLibraryCopy.notifications}
        </CardTitle>
        <CardDescription>
          {settingsLibraryCopy.chooseHowYouWantToBeNotified}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-end gap-8 text-xs font-bold tracking-wide text-muted-foreground uppercase">
          <span>{settingsLibraryCopy.email}</span>
          <span>{settingsLibraryCopy.push}</span>
        </div>

        <div className="space-y-4">
          {settings.map((setting) => (
            <div
              key={setting.id}
              className="flex items-center justify-between border-3 border-foreground bg-card p-4"
            >
              <div>
                <p className="font-bold">{setting.title}</p>
                <p className="text-sm text-muted-foreground">
                  {setting.description}
                </p>
              </div>
              <div className="flex items-center gap-6">
                <Switch
                  checked={setting.email}
                  onCheckedChange={() => handleToggle(setting.id, "email")}
                />
                <Switch
                  checked={setting.push}
                  onCheckedChange={() => handleToggle(setting.id, "push")}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <Button onClick={() => onSave?.(settings)}>
            <Save className="mr-2 h-4 w-4" />
            {settingsLibraryCopy.savePreferences}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// SETTINGS VARIANT 3: Security Settings
// ============================================================================
export type SecuritySettingsProps = {
  twoFactorEnabled?: boolean;
  sessions?: Array<{
    id: string;
    device: string;
    location: string;
    lastActive: string;
    current?: boolean;
  }>;
  onChangePassword?: () => void;
  onToggleTwoFactor?: (enabled: boolean) => void;
  onRevokeSession?: (sessionId: string) => void;
  className?: string;
};

export function SecuritySettings({
  twoFactorEnabled = false,
  sessions = [],
  onChangePassword,
  onToggleTwoFactor,
  onRevokeSession,
  className,
}: SecuritySettingsProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-black uppercase">
          <Shield className="h-5 w-5" />
          {settingsLibraryCopy.security}
        </CardTitle>
        <CardDescription>
          {settingsLibraryCopy.manageYourAccountSecuritySettings}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Password */}
        <div className="flex items-center justify-between border-3 border-foreground bg-muted/30 p-4">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center border-2 border-foreground bg-card">
              <Key className="h-5 w-5" />
            </div>
            <div>
              <p className="font-bold">{settingsLibraryCopy.password}</p>
              <p className="text-sm text-muted-foreground">
                {settingsLibraryCopy.lastChanged30DaysAgo}
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={onChangePassword}>
            {settingsLibraryCopy.changePassword}
          </Button>
        </div>

        {/* Two-Factor Authentication */}
        <div className="flex items-center justify-between border-3 border-foreground bg-muted/30 p-4">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center border-2 border-foreground bg-card">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <p className="font-bold">
                {settingsLibraryCopy.twoFactorAuthentication}
              </p>
              <p className="text-sm text-muted-foreground">
                {twoFactorEnabled
                  ? settingsLibraryCopy.enabledYourAccountIsMoreSecure
                  : settingsLibraryCopy.addAnExtraLayerOfSecurity}
              </p>
            </div>
          </div>
          <Switch
            checked={twoFactorEnabled}
            onCheckedChange={(v) => onToggleTwoFactor?.(v)}
          />
        </div>

        {/* Active Sessions */}
        {sessions.length > 0 && (
          <>
            <Separator />
            <div>
              <h4 className="mb-4 text-sm font-bold uppercase">
                {settingsLibraryCopy.activeSessions}
              </h4>
              <div className="space-y-3">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between border-2 border-foreground p-3"
                  >
                    <div>
                      <p className="flex items-center gap-2 font-medium">
                        {session.device}
                        {session.current && (
                          <span className="bg-success/20 px-2 py-0.5 text-xs font-bold text-success uppercase">
                            {settingsLibraryCopy.current}
                          </span>
                        )}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {session.location}
                        {settingsLibraryCopy.separator}
                        {session.lastActive}
                      </p>
                    </div>
                    {!session.current && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRevokeSession?.(session.id)}
                      >
                        {settingsLibraryCopy.revoke}
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

// ============================================================================
// SETTINGS VARIANT 4: Appearance Settings
// ============================================================================
export type AppearanceTheme = "light" | "dark" | "system";

export type AppearanceSettingsProps = {
  theme?: AppearanceTheme;
  accentColor?: string;
  onThemeChange?: (theme: AppearanceTheme) => void;
  onAccentColorChange?: (color: string) => void;
  className?: string;
};

const accentColors = [
  { name: "Blue", value: "#3b82f6" },
  { name: "Green", value: "#22c55e" },
  { name: "Purple", value: "#a855f7" },
  { name: "Orange", value: "#f97316" },
  { name: "Pink", value: "#ec4899" },
  { name: "Red", value: "#ef4444" },
];

export function AppearanceSettings({
  theme = "system",
  accentColor = "#3b82f6",
  onThemeChange,
  onAccentColorChange,
  className,
}: AppearanceSettingsProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-black uppercase">
          <Palette className="h-5 w-5" />
          {settingsLibraryCopy.appearance}
        </CardTitle>
        <CardDescription>
          {settingsLibraryCopy.customizeTheLookAndFeel}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Theme Selection */}
        <div className="space-y-3">
          <Label className="text-xs font-bold uppercase">
            {settingsLibraryCopy.theme}
          </Label>
          <div className="grid grid-cols-3 gap-3">
            {[
              {
                value: settingsRemainingCopy.light,
                label: settingsLibraryCopy.light,
                icon: Sun,
              },
              {
                value: settingsRemainingCopy.dark,
                label: settingsLibraryCopy.dark,
                icon: Moon,
              },
              {
                value: settingsRemainingCopy.system,
                label: settingsLibraryCopy.system,
                icon: Monitor,
              },
            ].map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                type="button"
                aria-pressed={theme === value}
                onClick={() => onThemeChange?.(value as AppearanceTheme)}
                className={cn(
                  "flex flex-col items-center gap-2 border-3 border-foreground p-4 transition",
                  theme === value
                    ? "bg-primary text-primary-foreground shadow-[4px_4px_0px_hsl(var(--shadow-color))]"
                    : "bg-card hover:bg-muted",
                )}
              >
                <Icon className="h-6 w-6" />
                <span className="text-sm font-bold uppercase">{label}</span>
              </button>
            ))}
          </div>
        </div>

        <Separator />

        {/* Accent Color */}
        <div className="space-y-3">
          <Label className="text-xs font-bold uppercase">
            {settingsLibraryCopy.accentColor}
          </Label>
          <div className="flex flex-wrap gap-3">
            {accentColors.map((color) => (
              <button
                key={color.value}
                type="button"
                // The swatch has no text and lucide hides the check, so without
                // these the button is unnamed and its selected state invisible.
                aria-label={color.name}
                aria-pressed={accentColor === color.value}
                onClick={() => onAccentColorChange?.(color.value)}
                className={cn(
                  "h-10 w-10 border-3 border-foreground transition",
                  accentColor === color.value &&
                    "ring-2 ring-foreground ring-offset-2",
                )}
                style={{ backgroundColor: color.value }}
                title={color.name}
              >
                {accentColor === color.value && (
                  <Check className="mx-auto h-5 w-5 text-white" />
                )}
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// SETTINGS VARIANT 5: Danger Zone
// ============================================================================
export type DangerZoneProps = {
  onExportData?: () => void;
  onDeactivate?: () => void;
  onDelete?: () => void;
  className?: string;
};

export function DangerZone({
  onExportData,
  onDeactivate,
  onDelete,
  className,
}: DangerZoneProps) {
  return (
    <Card className={cn("border-destructive", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-black text-destructive uppercase">
          <AlertTriangle className="h-5 w-5" />
          {settingsLibraryCopy.dangerZone}
        </CardTitle>
        <CardDescription>
          {settingsLibraryCopy.irreversibleAndDestructiveActions}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between border-2 border-foreground p-4">
          <div>
            <p className="font-bold">{settingsLibraryCopy.exportData}</p>
            <p className="text-sm text-muted-foreground">
              {settingsLibraryCopy.downloadAllYourDataInJSONFormat}
            </p>
          </div>
          <Button variant="outline" onClick={onExportData}>
            {settingsLibraryCopy.export}
          </Button>
        </div>

        <div className="flex items-center justify-between border-2 border-foreground p-4">
          <div>
            <p className="font-bold">{settingsLibraryCopy.deactivateAccount}</p>
            <p className="text-sm text-muted-foreground">
              {settingsLibraryCopy.temporarilyDisableYourAccount}
            </p>
          </div>
          <Button variant="outline" onClick={onDeactivate}>
            {settingsLibraryCopy.deactivate}
          </Button>
        </div>

        <div className="flex items-center justify-between border-2 border-destructive/50 bg-destructive/5 p-4">
          <div>
            <p className="font-bold text-destructive">
              {settingsLibraryCopy.deleteAccount}
            </p>
            <p className="text-sm text-muted-foreground">
              {settingsLibraryCopy.permanentlyDeleteYourAccountAndAllData}
            </p>
          </div>
          <Button variant="destructive" onClick={onDelete}>
            <Trash2 className="mr-2 h-4 w-4" />
            {settingsLibraryCopy.delete}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// SETTINGS VARIANT 6: Full Settings Page
// ============================================================================
export type SettingsPageProps = {
  defaultTab?: string;
  className?: string;
};

const APPEARANCE_STORAGE_KEY = "boldkit-settings-appearance";

/** Read/write appearance prefs. Never throws — private mode blocks localStorage. */
function readAppearance(): { theme: AppearanceTheme; accentColor: string } {
  const fallback = {
    theme: "system" as AppearanceTheme,
    accentColor: "#3b82f6",
  };
  try {
    const raw = localStorage.getItem(APPEARANCE_STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as Partial<typeof fallback>;
    return {
      theme: (["light", "dark", "system"] as const).includes(
        parsed.theme as AppearanceTheme,
      )
        ? (parsed.theme as AppearanceTheme)
        : fallback.theme,
      accentColor:
        accentColors.find((c) => c.value === parsed.accentColor)?.value ??
        fallback.accentColor,
    };
  } catch {
    return fallback;
  }
}

export function SettingsPage({
  defaultTab = "profile",
  className,
}: SettingsPageProps) {
  // AppearanceSettings is controlled by design, so on its own the full-page
  // composition rendered dead buttons — clicks changed nothing and nothing
  // survived a reload. This owns the state and persists it.
  const [appearance, setAppearance] = React.useState(readAppearance);

  React.useEffect(() => {
    try {
      localStorage.setItem(APPEARANCE_STORAGE_KEY, JSON.stringify(appearance));
    } catch {
      // storage unavailable — the UI still works for this session
    }
  }, [appearance]);

  return (
    <div className={cn("mx-auto max-w-4xl px-4 py-8", className)}>
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight uppercase">
          {settingsLibraryCopy.settings}
        </h1>
        <p className="mt-1 text-muted-foreground">
          {settingsLibraryCopy.manageYourAccountSettingsAndPreferences}
        </p>
      </div>

      <Tabs defaultValue={defaultTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">
            <User className="mr-2 h-4 w-4" />
            {settingsLibraryCopy.profile}
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="mr-2 h-4 w-4" />
            {settingsLibraryCopy.notifications}
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="mr-2 h-4 w-4" />
            {settingsLibraryCopy.security}
          </TabsTrigger>
          <TabsTrigger value="appearance">
            <Palette className="mr-2 h-4 w-4" />
            {settingsLibraryCopy.appearance}
          </TabsTrigger>
          <TabsTrigger value="billing">
            <CreditCard className="mr-2 h-4 w-4" />
            {settingsLibraryCopy.billing}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <ProfileSettings />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationSettings />
        </TabsContent>

        <TabsContent value="security">
          <SecuritySettings
            sessions={[
              {
                id: "1",
                device: "Chrome on MacOS",
                location: "San Francisco, CA",
                lastActive: "Now",
                current: true,
              },
              {
                id: "2",
                device: "Safari on iPhone",
                location: "New York, NY",
                lastActive: "2 hours ago",
              },
            ]}
          />
        </TabsContent>

        <TabsContent value="appearance">
          <AppearanceSettings
            theme={appearance.theme}
            accentColor={appearance.accentColor}
            onThemeChange={(theme) => setAppearance((a) => ({ ...a, theme }))}
            onAccentColorChange={(accentColor) =>
              setAppearance((a) => ({ ...a, accentColor }))
            }
          />
        </TabsContent>

        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-black uppercase">
                <CreditCard className="h-5 w-5" />
                {settingsLibraryCopy.billing}
              </CardTitle>
              <CardDescription>
                {settingsLibraryCopy.manageYourSubscriptionAndPaymentMethods}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {settingsLibraryCopy.billingSettingsComingSoon}
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-8">
        <DangerZone />
      </div>
    </div>
  );
}

// ============================================================================
// Export all variants
// ============================================================================
export const SettingsBlocks = {
  Profile: ProfileSettings,
  Notifications: NotificationSettings,
  Security: SecuritySettings,
  Appearance: AppearanceSettings,
  DangerZone: DangerZone,
  Page: SettingsPage,
};
