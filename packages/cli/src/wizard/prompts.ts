import * as p from "@clack/prompts";

import {
  checkClerk,
  type ClerkKeys,
  type EnvVar,
  mask,
} from "#cli/wizard/keys";

export function cancelled<T>(value: T): Exclude<T, symbol> {
  if (p.isCancel(value)) {
    p.cancel("Cancelled.");
    process.exit(1);
  }
  return value as Exclude<T, symbol>;
}

const CLERK_FIELDS: {
  field: keyof ClerkKeys;
  message: string;
  placeholder: string;
  secret: boolean;
}[] = [
  {
    field: "appId",
    message: "Clerk application ID",
    placeholder: "app_...",
    secret: false,
  },
  {
    field: "publishableKey",
    message: "Clerk publishable key",
    placeholder: "pk_test_...",
    secret: false,
  },
  {
    field: "secretKey",
    message: "Clerk secret key",
    placeholder: "sk_test_...",
    secret: true,
  },
  {
    field: "devWebhookSecret",
    message: "Clerk development webhook signing secret",
    placeholder: "whsec_...",
    secret: true,
  },
  {
    field: "prodWebhookSecret",
    message: "Clerk production webhook signing secret",
    placeholder: "whsec_...",
    secret: true,
  },
  {
    field: "ngrokDomain",
    message: "ngrok domain for local webhooks",
    placeholder: "my-app.ngrok-free.app",
    secret: false,
  },
];

/** Clerk keys; each can be left blank and filled in .env.local later. */
export async function promptClerk(): Promise<Partial<ClerkKeys>> {
  p.log.step(
    "Clerk (dashboard > Configure > API keys and Webhooks). Leave blank to fill in later.",
  );
  const keys: Partial<ClerkKeys> = {};
  for (const { field, message, placeholder, secret } of CLERK_FIELDS) {
    const validate = (value: string | undefined) => checkClerk(field, value);
    const answer = cancelled(
      secret
        ? await p.password({ message, validate })
        : await p.text({ message, placeholder, validate }),
    ).trim();
    if (answer) keys[field] = answer;
  }
  return keys;
}

/** Keys for the integrations the chosen domain brings in. */
export async function promptIntegrations(
  vars: readonly EnvVar[],
): Promise<Record<string, string>> {
  if (vars.length === 0) return {};
  p.log.step(
    `Integrations for this domain: ${[...new Set(vars.map((v) => v.module))].join(", ")}. Leave blank to fill in later.`,
  );
  const values: Record<string, string> = {};
  for (const variable of vars) {
    const message = `${variable.name}${variable.required ? "" : " (optional)"}${
      variable.description ? `: ${variable.description}` : ""
    }`;
    const answer = cancelled(
      variable.secret
        ? await p.password({ message })
        : await p.text({ message }),
    ).trim();
    if (answer) values[variable.name] = answer;
  }
  return values;
}

export interface Summary {
  dir: string;
  name: string;
  domain: string;
  modules: readonly string[];
  tenancy: string;
  accessControl: string;
  color: string | null;
  databaseUrl: string | undefined;
  clerk: Partial<ClerkKeys>;
  integrations: Readonly<Record<string, string>>;
  missing: readonly string[];
}

/** The confirm screen's lines; secrets are masked. */
export function summaryLines(summary: Summary): string[] {
  const set = (value: string | undefined, secret = true) =>
    value ? (secret ? mask(value) : value) : "(fill in later)";
  const database = summary.databaseUrl
    ? summary.databaseUrl.replace(/\/\/([^:/@]+):[^@]*@/, "//$1:•••@")
    : "(fill in later)";
  return [
    `Folder        ${summary.dir}`,
    `Package       ${summary.name}`,
    `Domain        ${summary.domain}${
      summary.modules.length > 0 ? ` (${summary.modules.join(", ")})` : ""
    }`,
    `Organizations ${summary.tenancy === "single" ? "single organization" : "multi-tenant"}`,
    `Authorization ${summary.accessControl === "rbac" ? "RBAC only" : "RBAC + ABAC"}`,
    `Brand color   ${summary.color ?? "template default"}`,
    `Database      ${database}`,
    `Clerk app     ${set(summary.clerk.appId, false)}`,
    `  keys        ${set(summary.clerk.publishableKey, false)} / ${set(summary.clerk.secretKey)}`,
    `  webhooks    dev ${set(summary.clerk.devWebhookSecret)}, prod ${set(summary.clerk.prodWebhookSecret)}`,
    `  ngrok       ${set(summary.clerk.ngrokDomain, false)}`,
    ...Object.entries(summary.integrations).map(
      ([key, value]) => `${key.padEnd(13)} ${mask(value)}`,
    ),
    ...(summary.missing.length > 0
      ? [`Still needed  ${summary.missing.join(", ")}`]
      : []),
  ];
}

export async function confirmSummary(summary: Summary): Promise<void> {
  p.box(summaryLines(summary).join("\n"), " Ready to generate ", {
    contentAlign: "left",
    titleAlign: "center",
  });
  const go = cancelled(
    await p.confirm({ message: "Generate this app?", initialValue: true }),
  );
  if (!go) {
    p.cancel("Nothing was written.");
    process.exit(1);
  }
}
