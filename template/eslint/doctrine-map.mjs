/**
 * Codependent Coding doctrine map.
 *
 * Single machine-readable table of layers, import categories, and boundaries
 * consumed by the `codependent` ESLint plugin. Rule IDs mirror
 * `.claude/contracts/validation.yaml` (CC-*). Change the doctrine here and in
 * the contract together; `pnpm doctrine:check` compares the two.
 */

/** Layers are matched top to bottom; first match wins. Paths are repo-relative, POSIX. */
export const layers = [
  { id: "test", match: /(^tests\/|\.test\.tsx?$|\.spec\.tsx?$)/ },
  { id: "config", match: /^[^/]+\.(c|m)?(j|t)s$/ },
  { id: "prisma", match: /^prisma\// },
  { id: "route-handler", match: /^app\/api\// },
  { id: "route", match: /^app\// },
  { id: "proxy", match: /^proxy\.ts$/ },
  { id: "feature-form", match: /^features\/.+Form(\.client)?\.tsx$/ },
  { id: "feature-skeleton", match: /^features\/.+Skeleton\.tsx$/ },
  { id: "feature-client", match: /^features\/.+\.client\.tsx$/ },
  { id: "feature", match: /^features\// },
  { id: "tooling", match: /^(eslint|scripts)\// },
  { id: "nav", match: /^components\/(nav|shells)\// },
  { id: "block", match: /^components\/(blocks|brand|templates)\// },
  { id: "ui", match: /^components\/(ui|chart)\// },
  { id: "hook", match: /^hooks\// },
  { id: "fetcher", match: /^lib\/fetchers\// },
  { id: "action", match: /^lib\/actions\// },
  { id: "workflow", match: /^lib\/workflows\// },
  { id: "transaction", match: /^lib\/db\/transactions\// },
  { id: "db", match: /^lib\/db\// },
  { id: "auth", match: /^lib\/auth\// },
  { id: "authz", match: /^lib\/authz\// },
  { id: "integration", match: /^lib\/integrations\// },
  { id: "cache", match: /^lib\/cache\// },
  { id: "registry", match: /^lib\/modules\// },
  { id: "pure", match: /^(lib\/(constants|utils)|types)\// },
  { id: "schema", match: /^schemas\// },
];

/**
 * Import categories. `internal` patterns match the repo-relative resolved path
 * (after `@/` or relative resolution); `packages` match bare specifiers.
 */
export const categories = {
  "prisma-runtime": {
    packages: [
      /^@prisma\/client/,
      /^@prisma\/adapter-/,
      /^@neondatabase\/serverless/,
    ],
    internal: [
      /^generated\/prisma(?!\/enums)/,
      /^lib\/db\/(client|provider)(\.ts)?$/,
    ],
  },
  "db-internals": { internal: [/^lib\/db\/(selects|dto|tenant)/] },
  transaction: { internal: [/^lib\/db\/transactions\//] },
  fetcher: { internal: [/^lib\/fetchers\//] },
  action: { internal: [/^lib\/actions\//] },
  workflow: { internal: [/^lib\/workflows\//] },
  auth: { internal: [/^lib\/auth\//] },
  authz: { internal: [/^lib\/authz\//] },
  integration: { internal: [/^lib\/integrations\//] },
  cache: { internal: [/^lib\/cache\//] },
  feature: { internal: [/^features\//] },
  route: { internal: [/^app\//] },
  block: { internal: [/^components\/(blocks|shells|brand|templates|nav)\//] },
  ui: { internal: [/^components\/(ui|chart)\//] },
  "ui-skeleton": { internal: [/^components\/ui\/skeleton/] },
  "ui-control": {
    internal: [
      /^components\/ui\/(button|input|label|textarea|select|native-select|checkbox|radio-group|switch|slider|toggle|toggle-group|combobox|date-picker|date-range-picker|time-picker|tag-input|input-otp|dropzone|rating|field|input-group|button-group|form)(\.tsx?)?$/,
    ],
  },
  "provider-sdk": {
    packages: [
      /^stripe$/,
      /^@stripe\//,
      /^@vercel\/blob/,
      /^cloudinary/,
      /^next-cloudinary/,
      /^@huggingface\//,
      /^@sendgrid\//,
      /^resend$/,
      /^svix$/,
      /^@upstash\//,
      /^mapbox-gl/,
      /^@mapbox\//,
      /^openai$/,
      /^@anthropic-ai\//,
    ],
  },
  "clerk-server": {
    packages: [/^@clerk\/nextjs\/(server|webhooks)/, /^@clerk\/backend/],
  },
  "clerk-ui": { packages: [/^@clerk\/nextjs$/, /^@clerk\/themes/] },
  "form-state": { packages: [/^react-hook-form/, /^@hookform\//] },
  "server-only": { packages: [/^server-only$/, /^next\/headers$/] },
};

/**
 * Boundaries: for each layer, categories it must not import.
 * `except` lists categories that override a denial (more specific wins).
 * `rule` is the doctrine rule ID reported in the message.
 */
export const boundaries = {
  route: {
    rule: "CC-ROUTE-001",
    deny: [
      "prisma-runtime",
      "db-internals",
      "transaction",
      "fetcher",
      "action",
      "workflow",
      "integration",
      "provider-sdk",
      "clerk-server",
      "ui",
    ],
    why: "Routes own URL boundaries only: compose features (or blocks for static public pages) and shells.",
  },
  "route-handler": {
    rule: "CC-HOOK-001",
    deny: [
      "prisma-runtime",
      "db-internals",
      "provider-sdk",
      "clerk-server",
      "feature",
      "block",
      "ui",
    ],
    why: "Route handlers own the HTTP lifecycle; persistence goes through transactions/workflows, providers through lib/integrations, Clerk through lib/auth.",
  },
  proxy: {
    rule: "CC-ROUTE-002",
    deny: [
      "prisma-runtime",
      "db-internals",
      "transaction",
      "fetcher",
      "action",
      "workflow",
      "integration",
      "provider-sdk",
    ],
    why: "proxy.ts performs routing/auth gating only.",
  },
  feature: {
    rule: "CC-FEAT-001",
    deny: [
      "prisma-runtime",
      "db-internals",
      "transaction",
      "integration",
      "provider-sdk",
      "clerk-server",
      "route",
      "ui",
      "form-state",
    ],
    why: "Features orchestrate fetchers/actions/workflows and render blocks. UI primitives are reserved for Form features, Skeletons and .client companions.",
  },
  "feature-form": {
    rule: "CC-FEAT-002",
    deny: [
      "prisma-runtime",
      "db-internals",
      "transaction",
      "integration",
      "provider-sdk",
      "clerk-server",
      "route",
      "fetcher",
      "workflow",
    ],
    why: "Form features own React Hook Form state and submit through actions; they may compose UI primitives directly.",
  },
  "feature-skeleton": {
    rule: "CC-FEAT-003",
    deny: [
      "ui",
      "prisma-runtime",
      "db-internals",
      "transaction",
      "fetcher",
      "action",
      "workflow",
      "auth",
      "authz",
      "integration",
      "provider-sdk",
      "form-state",
    ],
    except: ["ui-skeleton"],
    why: "Skeletons are pure loading presentation; only components/ui/skeleton and blocks are allowed.",
  },
  "feature-client": {
    rule: "CC-FEAT-004",
    deny: [
      "ui",
      "prisma-runtime",
      "db-internals",
      "transaction",
      "fetcher",
      "workflow",
      "auth",
      "authz",
      "integration",
      "provider-sdk",
      "clerk-server",
      "server-only",
      "cache",
    ],
    except: ["ui-control", "ui-skeleton"],
    why: "Client companions hold browser state only: interactive UI controls and server actions, never server reads.",
  },
  nav: {
    rule: "CC-BLOCK-002",
    deny: [
      "prisma-runtime",
      "db-internals",
      "transaction",
      "fetcher",
      "action",
      "workflow",
      "auth",
      "authz",
      "integration",
      "provider-sdk",
      "clerk-server",
      "server-only",
      "feature",
      "route",
      "form-state",
      "cache",
    ],
    why: "Navigation and shells are reusable structural presentation (Clerk UI widgets such as UserButton are allowed).",
  },
  block: {
    rule: "CC-BLOCK-001",
    deny: [
      "prisma-runtime",
      "db-internals",
      "transaction",
      "fetcher",
      "action",
      "workflow",
      "auth",
      "authz",
      "integration",
      "provider-sdk",
      "clerk-server",
      "clerk-ui",
      "server-only",
      "feature",
      "route",
      "form-state",
      "cache",
    ],
    why: "Blocks are pure presentation composed from primitives.",
  },
  ui: {
    rule: "CC-UI-001",
    deny: [
      "prisma-runtime",
      "db-internals",
      "transaction",
      "fetcher",
      "action",
      "workflow",
      "auth",
      "authz",
      "integration",
      "provider-sdk",
      "clerk-server",
      "clerk-ui",
      "server-only",
      "feature",
      "route",
      "block",
      "cache",
    ],
    why: "UI primitives are the lowest presentation layer.",
  },
  hook: {
    rule: "CC-UI-002",
    deny: [
      "prisma-runtime",
      "db-internals",
      "transaction",
      "fetcher",
      "workflow",
      "auth",
      "authz",
      "integration",
      "provider-sdk",
      "clerk-server",
      "server-only",
      "feature",
      "route",
    ],
    why: "Hooks are browser-side helpers.",
  },
  fetcher: {
    rule: "CC-READ-001",
    deny: [
      "transaction",
      "action",
      "workflow",
      "integration",
      "provider-sdk",
      "feature",
      "route",
      "block",
      "ui",
      "form-state",
    ],
    why: "Fetchers are read-only persisted reads scoped by auth/authz.",
  },
  action: {
    rule: "CC-WRITE-001",
    deny: [
      "integration",
      "provider-sdk",
      "feature",
      "route",
      "block",
      "ui",
      "form-state",
    ],
    why: "Actions are CRUD mutation boundaries; provider mechanics run through workflows.",
  },
  workflow: {
    rule: "CC-FLOW-001",
    deny: [
      "prisma-runtime",
      "provider-sdk",
      "clerk-server",
      "feature",
      "route",
      "block",
      "ui",
      "form-state",
    ],
    why: "Workflows arrange fetchers, actions, transactions and integration helpers; they never touch the Prisma client or provider SDKs directly.",
  },
  transaction: {
    rule: "CC-TX-001",
    deny: [
      "fetcher",
      "action",
      "workflow",
      "integration",
      "provider-sdk",
      "clerk-server",
      "feature",
      "route",
      "block",
      "ui",
      "cache",
    ],
    why: "Transaction helpers perform atomic database work only - no provider or network I/O.",
  },
  db: {
    rule: "CC-DB-001",
    deny: [
      "fetcher",
      "action",
      "workflow",
      "integration",
      "provider-sdk",
      "feature",
      "route",
      "block",
      "ui",
    ],
    why: "lib/db owns database runtime, selects, DTOs and tenant context.",
  },
  auth: {
    rule: "CC-AUTH-001",
    deny: [
      "fetcher",
      "action",
      "workflow",
      "integration",
      "provider-sdk",
      "feature",
      "route",
      "block",
      "ui",
      "authz",
    ],
    why: "Authentication establishes identity only; it never decides access.",
  },
  authz: {
    rule: "CC-AUTHZ-001",
    deny: [
      "fetcher",
      "action",
      "workflow",
      "integration",
      "provider-sdk",
      "clerk-server",
      "feature",
      "route",
      "block",
      "ui",
    ],
    why: "Authorization decides access from application-owned membership state, not Clerk metadata.",
  },
  integration: {
    rule: "CC-INT-001",
    deny: [
      "prisma-runtime",
      "db-internals",
      "transaction",
      "fetcher",
      "action",
      "workflow",
      "feature",
      "route",
      "block",
      "ui",
    ],
    why: "Integrations own provider mechanics and nothing else.",
  },
  cache: {
    rule: "CC-CACHE-001",
    deny: [
      "prisma-runtime",
      "db-internals",
      "transaction",
      "fetcher",
      "action",
      "workflow",
      "integration",
      "provider-sdk",
      "feature",
      "route",
      "block",
      "ui",
    ],
    why: "Cache helpers define tags, lifetimes and invalidation only.",
  },
  pure: {
    rule: "CC-PURE-001",
    deny: [
      "prisma-runtime",
      "db-internals",
      "transaction",
      "fetcher",
      "action",
      "workflow",
      "auth",
      "authz",
      "integration",
      "provider-sdk",
      "clerk-server",
      "server-only",
      "feature",
      "route",
      "block",
      "ui",
      "cache",
    ],
    why: "Constants, utilities and shared types are dependency-free.",
  },
  schema: {
    rule: "CC-SCHEMA-001",
    deny: [
      "prisma-runtime",
      "db-internals",
      "transaction",
      "fetcher",
      "action",
      "workflow",
      "auth",
      "authz",
      "integration",
      "provider-sdk",
      "server-only",
      "feature",
      "route",
      "block",
      "ui",
    ],
    why: "Zod schemas are pure runtime-validation contracts usable on client and server.",
  },
};

/** Modules that must start with `import "server-only"` (repo-relative path patterns). */
export const serverOnlyPaths = [
  /^lib\/fetchers\//,
  /^lib\/workflows\//,
  /^lib\/db\/(client|provider|tenant)\.ts$/,
  /^lib\/db\/transactions\/(?!errors\.ts$)/,
  /^lib\/auth\//,
  /^lib\/authz\//,
  /^lib\/integrations\/(?!status\.ts$)/,
  /^lib\/cache\//,
];

/** Filename conventions: directory pattern -> allowed basename pattern. */
export const filenameConventions = [
  {
    dir: /^features\/[a-z][a-zA-Z]*\/$/,
    file: /^([a-z][a-zA-Z0-9]*(Feature|Form|Skeleton)\.tsx|[a-z][a-zA-Z0-9]*\.client\.tsx)$/,
    example:
      "crmContactsFeature.tsx, crmNewContactForm.tsx, crmContactsSkeleton.tsx, crmPipelineBoard.client.tsx",
  },
  {
    dir: /^components\/templates\/$/,
    file: /^[a-z][a-zA-Z0-9]*Template\.tsx$/,
    example: "crmContactsTemplate.tsx",
  },
  {
    dir: /^lib\/fetchers\/$/,
    file: /^[a-z][a-zA-Z0-9]*Fetchers\.ts$/,
    example: "crmFetchers.ts",
  },
  {
    dir: /^lib\/actions\/$/,
    file: /^[a-z][a-zA-Z0-9]*Actions\.ts$/,
    example: "crmActions.ts",
  },
  {
    dir: /^lib\/workflows\/$/,
    file: /^[a-z][a-zA-Z0-9]*Workflows\.ts$/,
    example: "crmWorkflows.ts",
  },
  {
    dir: /^lib\/workflows\/[a-z][a-zA-Z]*\/$/,
    file: /^[a-z][a-zA-Z0-9]*\.ts$/,
    example: "lib/workflows/crm/advanceDealStage.ts",
  },
  {
    dir: /^lib\/db\/selects\/$/,
    file: /^[a-z][a-zA-Z0-9]*\.selects\.ts$/,
    example: "crm.selects.ts",
  },
  {
    dir: /^lib\/db\/dto\/$/,
    file: /^[a-z][a-zA-Z0-9]*\.dto\.ts$/,
    example: "crm.dto.ts",
  },
  {
    dir: /^lib\/db\/transactions\/$/,
    file: /^([a-z0-9]+(-[a-z0-9]+)*\.tx|errors)\.ts$/,
    example: "crm-update-deal-stage.tx.ts",
  },
  {
    dir: /^schemas\/$/,
    file: /^[a-z][a-zA-Z0-9]*Schemas\.ts$/,
    example: "crmSchemas.ts",
  },
  {
    dir: /^types\/$/,
    file: /^([a-z][a-zA-Z0-9]*Types\.ts|[a-z0-9-]+\.d\.ts)$/,
    example: "crmTypes.ts",
  },
  {
    dir: /^components\/.+\/$/,
    file: /^([a-z0-9]+(-[a-z0-9]+)*|index)\.tsx?$/,
    example: "hero-sections.tsx",
  },
  {
    dir: /^lib\/integrations\/[a-z0-9-]+\/$/,
    file: /^[a-z0-9]+(-[a-z0-9]+)*\.ts$/,
    example: "lib/integrations/stripe/checkout.ts",
  },
  { dir: /^hooks\/$/, file: /^use-[a-z0-9-]+\.tsx?$/, example: "use-theme.ts" },
];

/**
 * Terminal profile (DEC-072). Apps that render in a terminal (Ink) run as one
 * Node process: there is no server/browser split, so the directive rules are
 * off, and keyboard companions may also use the terminal-only controls below.
 * Every other rule applies unchanged. Opt in with the `doctrineTerminal`
 * config from codependent-plugin.mjs.
 */
export const terminalProfile = {
  off: ["require-server-only", "use-server-actions", "use-client-placement"],
  controls:
    /^components\/ui\/(menu|tabs|command-palette|multi-select|tree-select|confirm)(\.tsx?)?$/,
};

/** Path segments / basenames that signal invented layers. */
export const genericNames =
  /(^|\/)(services?|managers?|processors?|helpers?|misc|stuff|common|handlers?)(\/|\.tsx?$)/;

/** Prisma delegate methods that write. */
export const prismaWriteMethods = [
  "create",
  "createMany",
  "createManyAndReturn",
  "update",
  "updateMany",
  "updateManyAndReturn",
  "upsert",
  "delete",
  "deleteMany",
  "$executeRaw",
  "$executeRawUnsafe",
  "$transaction",
];

/** Files that may `export default` (framework conventions). */
export const defaultExportAllowed =
  /(^app\/.*(page|layout|template|loading|error|global-error|not-found|forbidden|unauthorized|default|opengraph-image|twitter-image|icon|apple-icon|sitemap|robots|manifest)\.(t|j)sx?$)|(^[^/]+\.(c|m)?(j|t)s$)|(^prisma\/seed\.ts$)|(^eslint\/)/;

/** Files allowed to declare "use client" without the .client suffix. */
export const useClientAllowed =
  /(\.client\.tsx$)|(^features\/.+Form\.tsx$)|(^components\/)|(^hooks\/)|(^app\/(.*\/)?(error|global-error)\.tsx$)/;
