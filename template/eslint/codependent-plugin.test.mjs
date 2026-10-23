/**
 * Doctrine rule tests. Run: node --test eslint/
 * Each case names the doctrine rule it proves.
 */
import path from "node:path";
import { describe, it } from "node:test";

import { RuleTester } from "eslint";

import { rules } from "./codependent-plugin.mjs";

RuleTester.describe = describe;
RuleTester.it = it;

const tester = new RuleTester({
  languageOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    parserOptions: { ecmaFeatures: { jsx: true } },
  },
});

const at = (rel) => path.join(process.cwd(), rel);

tester.run("layer-boundaries", rules["layer-boundaries"], {
  valid: [
    {
      name: "CC-ROUTE-001 page composes a feature",
      filename: at("app/(tenant)/crm/page.tsx"),
      code: 'import { CrmFeature } from "@/features/crm/crmFeature";',
    },
    {
      name: "CC-FEAT-002 form may use primitives + RHF",
      filename: at("features/crm/crmNewContactForm.tsx"),
      code: 'import { useForm } from "react-hook-form";\nimport { Input } from "@/components/ui/input";',
    },
    {
      name: "CC-FEAT-003 skeleton may use ui/skeleton",
      filename: at("features/crm/crmContactsSkeleton.tsx"),
      code: 'import { Skeleton } from "@/components/ui/skeleton";',
    },
    {
      name: "CC-FEAT-004 client companion may use controls + actions",
      filename: at("features/crm/crmContactsFeature.client.tsx"),
      code: 'import { Button } from "@/components/ui/button";\nimport { updateContact } from "@/lib/actions/crmActions";',
    },
    {
      name: "CC-INT-001 provider SDK inside its integration",
      filename: at("lib/integrations/stripe/client.ts"),
      code: 'import Stripe from "stripe";',
    },
    {
      name: "CC-FLOW-001 workflow uses integration helper",
      filename: at("lib/workflows/aiWorkflows.ts"),
      code: 'import { infer } from "@/lib/integrations/hugging-face/inference";',
    },
    {
      name: "CC-SCHEMA-001 schema may use Prisma enums",
      filename: at("schemas/crmSchemas.ts"),
      code: 'import { DealStage } from "@/generated/prisma/enums";',
    },
    {
      name: "CC-BLOCK-002 nav may render Clerk widgets",
      filename: at("components/nav/user-menu.tsx"),
      code: 'import { UserButton } from "@clerk/nextjs";',
    },
  ],
  invalid: [
    {
      name: "CC-ROUTE-001 page reads the database",
      filename: at("app/(tenant)/crm/page.tsx"),
      code: 'import { prisma } from "@/lib/db/client";',
      errors: [{ messageId: "denied" }],
    },
    {
      name: "CC-FEAT-001 feature imports primitive",
      filename: at("features/crm/crmContactsFeature.tsx"),
      code: 'import { Button } from "@/components/ui/button";',
      errors: [{ messageId: "denied" }],
    },
    {
      name: "CC-FEAT-003 skeleton imports a non-skeleton primitive",
      filename: at("features/crm/crmContactsSkeleton.tsx"),
      code: 'import { Card } from "@/components/ui/card";',
      errors: [{ messageId: "denied" }],
    },
    {
      name: "CC-FEAT-004 client companion reads a fetcher",
      filename: at("features/crm/crmContactsFeature.client.tsx"),
      code: 'import { listContacts } from "@/lib/fetchers/crmFetchers";',
      errors: [{ messageId: "denied" }],
    },
    {
      name: "CC-BLOCK-001 block calls an action",
      filename: at("components/blocks/hero-sections.tsx"),
      code: 'import { createLead } from "@/lib/actions/crmActions";',
      errors: [{ messageId: "denied" }],
    },
    {
      name: "CC-FLOW-001 workflow imports provider SDK",
      filename: at("lib/workflows/billingWorkflows.ts"),
      code: 'import Stripe from "stripe";',
      errors: [{ messageId: "denied" }],
    },
    {
      name: "CC-TX-001 transaction calls integration",
      filename: at("lib/db/transactions/invoicing-create-invoice.tx.ts"),
      code: 'import { charge } from "@/lib/integrations/stripe/checkout";',
      errors: [{ messageId: "denied" }],
    },
    {
      name: "CC-INT-001 integration persists",
      filename: at("lib/integrations/stripe/webhooks.ts"),
      code: 'import { recordEvent } from "@/lib/db/transactions/webhook-event.tx";',
      errors: [{ messageId: "denied" }],
    },
    {
      name: "CC-LAYER relative import resolved",
      filename: at("features/crm/crmContactsFeature.tsx"),
      code: 'import { prisma } from "../../lib/db/client";',
      errors: [{ messageId: "denied" }],
    },
  ],
});

tester.run("require-server-only", rules["require-server-only"], {
  valid: [
    {
      filename: at("lib/fetchers/crmFetchers.ts"),
      code: 'import "server-only";\nexport const a = 1;',
    },
  ],
  invalid: [
    {
      filename: at("lib/fetchers/crmFetchers.ts"),
      code: "export const a = 1;",
      output: 'import "server-only";\n\nexport const a = 1;',
      errors: [{ messageId: "missing" }],
    },
  ],
});

tester.run("use-server-actions", rules["use-server-actions"], {
  valid: [
    {
      filename: at("lib/actions/crmActions.ts"),
      code: '"use server";\nexport async function createLead() {}',
    },
  ],
  invalid: [
    {
      filename: at("lib/actions/crmActions.ts"),
      code: "export async function createLead() {}",
      errors: [{ messageId: "missing" }],
    },
  ],
});

tester.run("use-client-placement", rules["use-client-placement"], {
  valid: [
    {
      filename: at("features/crm/crmPipelineFeature.client.tsx"),
      code: '"use client";\nexport const x = 1;',
    },
    {
      filename: at("features/crm/crmNewLeadForm.tsx"),
      code: '"use client";\nexport const x = 1;',
    },
    {
      filename: at("app/(tenant)/error.tsx"),
      code: '"use client";\nexport default function E() {}',
    },
  ],
  invalid: [
    {
      filename: at("features/crm/crmPipelineFeature.tsx"),
      code: '"use client";\nexport const x = 1;',
      errors: [{ messageId: "misplaced" }],
    },
    {
      filename: at("features/crm/crmPipelineFeature.client.tsx"),
      code: "export const x = 1;",
      errors: [{ messageId: "missing" }],
    },
  ],
});

tester.run("no-fetcher-writes", rules["no-fetcher-writes"], {
  valid: [
    {
      filename: at("lib/fetchers/crmFetchers.ts"),
      code: "db.contact.findMany({});",
    },
  ],
  invalid: [
    {
      filename: at("lib/fetchers/crmFetchers.ts"),
      code: "db.contact.update({});",
      errors: [{ messageId: "write" }],
    },
  ],
});

tester.run("no-transaction-network", rules["no-transaction-network"], {
  valid: [
    {
      filename: at("lib/db/transactions/invoicing-create-invoice.tx.ts"),
      code: "tx.invoice.create({});",
    },
  ],
  invalid: [
    {
      filename: at("lib/db/transactions/invoicing-create-invoice.tx.ts"),
      code: 'fetch("https://api.example.com");',
      errors: [{ messageId: "network" }],
    },
  ],
});

tester.run("no-raw-sql", rules["no-raw-sql"], {
  valid: [
    {
      filename: at("lib/db/tenant.ts"),
      code: "tx.$executeRaw`select set_config('app.org', ${id}, true)`;",
    },
  ],
  invalid: [
    {
      filename: at("lib/fetchers/crmFetchers.ts"),
      code: "db.$queryRaw`select 1`;",
      errors: [{ messageId: "outside" }],
    },
    {
      filename: at("lib/db/tenant.ts"),
      code: "db.$queryRawUnsafe(sql);",
      errors: [{ messageId: "unsafe" }],
    },
  ],
});

tester.run("filename-convention", rules["filename-convention"], {
  valid: [
    { filename: at("lib/fetchers/crmFetchers.ts"), code: "" },
    {
      filename: at("lib/db/transactions/crm-update-deal-stage.tx.ts"),
      code: "",
    },
    { filename: at("components/blocks/hero-sections.tsx"), code: "" },
  ],
  invalid: [
    {
      filename: at("lib/fetchers/crm.ts"),
      code: "",
      errors: [{ messageId: "name" }],
    },
    {
      filename: at("features/crm/ContactList.tsx"),
      code: "",
      errors: [{ messageId: "name" }],
    },
  ],
});

tester.run("no-generic-names", rules["no-generic-names"], {
  valid: [{ filename: at("lib/workflows/crmWorkflows.ts"), code: "" }],
  invalid: [
    {
      filename: at("lib/services/crmService.ts"),
      code: "",
      errors: [{ messageId: "generic" }],
    },
  ],
});

tester.run("no-default-export", rules["no-default-export"], {
  valid: [
    {
      filename: at("app/(public)/page.tsx"),
      code: "export default function Page() {}",
    },
  ],
  invalid: [
    {
      filename: at("features/crm/crmFeature.tsx"),
      code: "export default function CrmFeature() {}",
      errors: [{ messageId: "default" }],
    },
  ],
});

tester.run("no-parent-imports", rules["no-parent-imports"], {
  valid: [
    {
      filename: at("lib/fetchers/crmFetchers.ts"),
      code: 'import { x } from "@/schemas/crmSchemas";',
    },
  ],
  invalid: [
    {
      filename: at("lib/fetchers/crmFetchers.ts"),
      code: 'import { x } from "../../schemas/crmSchemas";',
      output: 'import { x } from "@/schemas/crmSchemas";',
      errors: [{ messageId: "parent" }],
    },
  ],
});
