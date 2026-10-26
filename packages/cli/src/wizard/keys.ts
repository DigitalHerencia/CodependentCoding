import type { TemplateManifest } from "#cli/compose/composeApp";

/**
 * Keys the `new` wizard collects before generating (Architecture.md §6).
 * Development values go to .env.local; the production webhook secret goes to
 * .env.production.local. Both files are git-ignored. The Clerk application
 * ID and the ngrok domain are not secrets and go to hipster.json.
 */
export interface ClerkKeys {
  appId: string;
  publishableKey: string;
  secretKey: string;
  devWebhookSecret: string;
  prodWebhookSecret: string;
  ngrokDomain: string;
}

export interface EnvVar {
  name: string;
  module: string;
  required: boolean;
  secret: boolean;
  description?: string;
}

const checks: Record<keyof ClerkKeys, (value: string) => string | undefined> = {
  appId: (value) =>
    /^app_[A-Za-z0-9]+$/.test(value)
      ? undefined
      : "Clerk application IDs start with app_",
  publishableKey: (value) =>
    /^pk_(test|live)_[A-Za-z0-9+/=_-]+$/.test(value)
      ? undefined
      : "Publishable keys start with pk_test_ or pk_live_",
  secretKey: (value) =>
    /^sk_(test|live)_[A-Za-z0-9]+$/.test(value)
      ? undefined
      : "Secret keys start with sk_test_ or sk_live_",
  devWebhookSecret: (value) =>
    /^whsec_[A-Za-z0-9+/=]+$/.test(value)
      ? undefined
      : "Webhook signing secrets start with whsec_",
  prodWebhookSecret: (value) =>
    /^whsec_[A-Za-z0-9+/=]+$/.test(value)
      ? undefined
      : "Webhook signing secrets start with whsec_",
  ngrokDomain: (value) =>
    /^(?=.{1,253}$)([a-z0-9-]+\.)+[a-z]{2,}$/i.test(value)
      ? undefined
      : "Use the bare domain, e.g. my-app.ngrok-free.app",
};

/** A blank answer skips the key; anything else must look right. */
export function checkClerk(
  field: keyof ClerkKeys,
  value: string | undefined,
): string | undefined {
  const trimmed = value?.trim() ?? "";
  return trimmed ? checks[field](trimmed) : undefined;
}

/** Modules plus their dependsOn closure, in manifest order. */
export function withDependencies(
  manifest: TemplateManifest,
  modules: readonly string[],
): string[] {
  const byId = new Map(manifest.modules.map((entry) => [entry.id, entry]));
  const seen = new Set<string>();
  const visit = (id: string) => {
    if (seen.has(id)) return;
    seen.add(id);
    for (const dep of byId.get(id)?.dependsOn ?? []) visit(dep);
  };
  modules.forEach(visit);
  return manifest.modules.map(({ id }) => id).filter((id) => seen.has(id));
}

const SECRET = /(SECRET|TOKEN|KEY|PASSWORD)/;

/** Integration variables the chosen modules need, in manifest order. */
export function integrationVars(
  manifest: TemplateManifest,
  modules: readonly string[],
): EnvVar[] {
  const ids = new Set(withDependencies(manifest, modules));
  return manifest.modules
    .filter(({ id }) => ids.has(id))
    .flatMap(({ id, env = [] }) =>
      env.map((entry) => ({
        name: entry.name,
        module: id,
        required: entry.required === true,
        secret: SECRET.test(entry.name),
        ...(entry.description ? { description: entry.description } : {}),
      })),
    );
}

export interface EnvPlan {
  local: Record<string, string>;
  production: Record<string, string>;
}

/** Where each answered key goes; blank answers are left out. */
export function envPlan(
  clerk: Partial<ClerkKeys>,
  integrations: Readonly<Record<string, string>>,
): EnvPlan {
  const pick = (entries: [string, string | undefined][]) =>
    Object.fromEntries(
      entries
        .map(([key, value]) => [key, value?.trim() ?? ""] as const)
        .filter(([, value]) => value !== ""),
    );
  return {
    local: pick([
      ["NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", clerk.publishableKey],
      ["CLERK_SECRET_KEY", clerk.secretKey],
      ["CLERK_WEBHOOK_SIGNING_SECRET", clerk.devWebhookSecret],
      ...Object.entries(integrations),
    ]),
    production: pick([
      ["CLERK_WEBHOOK_SIGNING_SECRET", clerk.prodWebhookSecret],
    ]),
  };
}

/** `sk_test_abc…xyz` → `sk_test_…xyz`: enough to recognize, not to use. */
export function mask(value: string): string {
  const trimmed = value.trim();
  if (trimmed.length <= 8) return "•".repeat(trimmed.length);
  const prefix = /^[a-z]+_(test_|live_)?/.exec(trimmed)?.[0] ?? "";
  return `${prefix}…${trimmed.slice(-4)}`;
}
