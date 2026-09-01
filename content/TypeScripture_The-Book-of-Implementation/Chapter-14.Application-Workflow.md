# Chapter 14: Application Workflow

**The Book of Implementation™**

## What a Workflow is

A Workflow is a **domain-oriented business-logic block**. The analogy is deliberate: UI blocks compose lower-level UI primitives into useful presentation; Workflows compose lower-level application operations into useful business behavior.

Workflows live together under `lib/workflows/` and are organized by domain using the normal naming convention.

```text
lib/workflows/
  adminWorkflows.ts
  aiWorkflows.ts
  crmWorkflows.ts
  invoicingWorkflows.ts
  marketingWorkflows.ts
  organizationWorkflows.ts
  portalWorkflows.ts
  projectsWorkflows.ts
  socialWorkflows.ts
  supportWorkflows.ts
```

## Composition rule

A Workflow does not rewrite an Action, Fetcher, integration helper, utility, type, or schema merely because the Workflow needs it. It imports the existing capability and composes it.

```text
Workflow
  -> Fetcher(s) for current facts
  -> Action(s) for mutations
  -> Integration helper(s) for provider capabilities
  -> Utils for generic calculations/helpers
  -> Types/Schemas for established contracts
  -> business decision/result
```

## Typical shapes

A Workflow may combine multiple reads into a business-level result, perform read -> decision -> mutation orchestration, calculate domain state, enforce a business transition, or coordinate a longer provider-backed process.

A one-to-one Workflow alias is allowed when the Workflow is intentionally being used as the domain-facing business-operation facade, but aliases should not exist merely to manufacture another layer. The audit should prefer real orchestration and make intentional aliases obvious.

## Golden pattern

```ts
export async function qualifyLeadWorkflow(contactId: string) {
  const contact = await getContactById(contactId);
  if (!contact) throw new Error("CRM lead was not found.");
  if (contact.status !== "LEAD") throw new Error("Only a lead can be qualified.");

  return updateContact({
    contactId: contact.id,
    firstName: contact.firstName,
    lastName: contact.lastName,
    email: contact.email,
    phone: contact.phone,
    title: contact.title,
    status: "ACTIVE",
    expectedUpdatedAt: new Date(contact.updatedAt),
  });
}
```

The point is composition: load the established facts, make the business decision, and call the established mutation. Do not reimplement those lower-level concerns inside the Workflow.
