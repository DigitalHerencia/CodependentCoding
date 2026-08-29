---
title: The Anthimeria™ Workbench — Generic Reference Implementation
type: implementation-reference
scope: architecture
project: Codependent Coding
domain: anthimeria
artifact: reference-pattern
namespace: codependentcoding.anthimeria.reference-implementation
status: active
authority: normative-example
parent: codependentcoding.anthimeria.authoritative
created: 2026-08-22
updated: 2026-08-22
---

# The Anthimeria™ Workbench — Generic Reference Implementation

This document gives Codex and other implementation agents a **generic, non-domain-specific** example of the architecture governed by the Anthimeria master specification.

It demonstrates:

- a thin App Router page;
- a route-group `layout.tsx`;
- a Shell that applies navigation and shared main spacing;
- generic Page Templates that subdivide the page into Feature Slots;
- a Feature that combines a PureUI Block with normalized behavior;
- a PureUI Component Block constituted from UI Primitives;
- a BusinessLogic™ Block / Workflow;
- a separate `content.ts` source;
- mapping of content and runtime data into the presentation contract.

The names in this document are examples. They are not additions to the canonical Ontology inventory.

---

# 1. Generic Directory Shape

```text
app/
└── (tenant)/
    ├── layout.tsx
    ├── page-a/
    │   └── page.tsx
    └── page-b/
        └── page.tsx

components/
├── navigation/
│   ├── tenant-header.tsx
│   └── tenant-footer.tsx
├── shells/
│   └── tenant-shell.tsx
├── templates/
│   ├── feature-slot.tsx
│   ├── TemplateA.tsx
│   └── TemplateB.tsx
├── blocks/
│   └── example-block.tsx
└── ui/
    ├── button.tsx
    ├── card.tsx
    └── badge.tsx

content/
└── example.ts

features/
└── example/
    ├── exampleFeature.tsx
    └── exampleSecondaryFeature.tsx

lib/
├── actions/
│   └── exampleActions.ts
├── authz/
│   └── examplePolicies.ts
├── fetchers/
│   └── exampleFetchers.ts
└── workflows/
    └── example/
        └── exampleWorkflow.ts

schemas/
└── exampleSchemas.ts

types/
└── exampleTypes.ts
```

---

# 2. Route-Group Layout Owns the Shared Page Frame

`app/(tenant)/layout.tsx`

```tsx
import type { ReactNode } from "react"

import { TenantShell } from "@/components/shells/tenant-shell"

export default function TenantLayout({
  children,
}: {
  children: ReactNode
}) {
  return <TenantShell>{children}</TenantShell>
}
```

The route-group layout applies one Shell to the route family.

It does not know which Page Template a route will use.

---

# 3. Shell Owns Navigation and Common Main Spacing

`components/shells/tenant-shell.tsx`

```tsx
import type { ReactNode } from "react"

import { TenantFooter } from "@/components/navigation/tenant-footer"
import { TenantHeader } from "@/components/navigation/tenant-header"

export function TenantShell({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <TenantHeader />

      <main className="mx-auto w-full max-w-7xl px-6 py-8 sm:px-10 lg:px-12">
        {children}
      </main>

      <TenantFooter />
    </div>
  )
}
```

This is where the route family's common main width, margins/gutters, and outer page padding live.

A Page Template must not add another competing page frame.

---

# 4. A Feature Slot Is a Neutral Placement Boundary

A generated runtime template does not need to draw cyan rectangles.

The Workbench may use cyan overlays in preview mode to visualize these boundaries.

`components/templates/feature-slot.tsx`

```tsx
import type { ReactNode } from "react"

export function FeatureSlot({
  children,
}: {
  children: ReactNode
}) {
  return <div className="min-h-0 min-w-0">{children}</div>
}
```

The slot owns no business semantics.

---

# 5. Generic Page Template A — Mixed Grid

`components/templates/TemplateA.tsx`

```tsx
import type { ReactNode } from "react"

import { FeatureSlot } from "./feature-slot"

type TemplateAProps = {
  topLeft: ReactNode
  topRight: ReactNode
  middle: ReactNode
  bottom: ReactNode
}

export function TemplateA({
  topLeft,
  topRight,
  middle,
  bottom,
}: TemplateAProps) {
  return (
    <section className="grid gap-6">
      <div className="grid gap-6 md:grid-cols-2">
        <FeatureSlot>{topLeft}</FeatureSlot>
        <FeatureSlot>{topRight}</FeatureSlot>
      </div>

      <FeatureSlot>{middle}</FeatureSlot>
      <FeatureSlot>{bottom}</FeatureSlot>
    </section>
  )
}
```

Topology:

```text
┌────────────────┬────────────────┐
│   topLeft      │    topRight    │
├────────────────┴────────────────┤
│             middle              │
├─────────────────────────────────┤
│             bottom              │
└─────────────────────────────────┘
```

---

# 6. Generic Page Template B — Three Rows

`components/templates/TemplateB.tsx`

```tsx
import type { ReactNode } from "react"

import { FeatureSlot } from "./feature-slot"

type TemplateBProps = {
  top: ReactNode
  middle: ReactNode
  bottom: ReactNode
}

export function TemplateB({
  top,
  middle,
  bottom,
}: TemplateBProps) {
  return (
    <section className="grid gap-6">
      <FeatureSlot>{top}</FeatureSlot>
      <FeatureSlot>{middle}</FeatureSlot>
      <FeatureSlot>{bottom}</FeatureSlot>
    </section>
  )
}
```

Topology:

```text
┌─────────────────────────────────┐
│               top               │
├─────────────────────────────────┤
│             middle              │
├─────────────────────────────────┤
│              bottom             │
└─────────────────────────────────┘
```

---

# 7. Generic One-Slot Template

A single-slot page is just another topology.

```tsx
import type { ReactNode } from "react"

import { FeatureSlot } from "./feature-slot"

export function SingleSlotTemplate({
  primary,
}: {
  primary: ReactNode
}) {
  return (
    <section className="grid gap-6">
      <FeatureSlot>{primary}</FeatureSlot>
    </section>
  )
}
```

The outer padding still comes from the Shell.

---

# 8. Thin Page Route

`app/(tenant)/page-a/page.tsx`

```tsx
import { TemplateA } from "@/components/templates/TemplateA"
import { ExampleFeature } from "@/features/example/exampleFeature"
import { ExampleSecondaryFeature } from "@/features/example/exampleSecondaryFeature"

export default function Page() {
  return (
    <TemplateA
      topLeft={<ExampleFeature variant="summary" />}
      topRight={<ExampleSecondaryFeature />}
      middle={<ExampleFeature variant="detail" />}
      bottom={<ExampleFeature variant="compact" />}
    />
  )
}
```

The route declares presentation composition.

It does not implement the Block.

It does not implement the Workflow.

It does not implement server operations.

It does not hard-code Block copy.

In a generated Arrangement, this route may be produced from normalized Virgule presentation configuration.

---

# 9. Content Is Independent

`content/example.ts`

```ts
export const exampleContent = {
  summary: {
    eyebrow: "Overview",
    title: "Example summary",
    description: "Configurable presentation copy.",
    actionLabel: "Open",
  },

  detail: {
    eyebrow: "Details",
    title: "Example details",
    description: "Another configurable presentation variation.",
    actionLabel: "View details",
  },

  compact: {
    eyebrow: "Status",
    title: "Example status",
    description: "Compact configurable copy.",
    actionLabel: "Inspect",
  },
} as const
```

All user-facing strings intended for Anthimeria customization are supplied independently from the Block implementation.

---

# 10. PureUI Component Block

`components/blocks/example-block.tsx`

```tsx
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export type ExampleBlockProps = {
  content: {
    eyebrow: string
    title: string
    description: string
    actionLabel: string
  }

  data: {
    value: string
    status: "idle" | "active" | "complete"
  }

  onAction: () => void

  variant?: "summary" | "detail" | "compact"
}

export function ExampleBlock({
  content,
  data,
  onAction,
  variant = "summary",
}: ExampleBlockProps) {
  return (
    <Card data-variant={variant}>
      <div className="space-y-4 p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              {content.eyebrow}
            </p>

            <h2 className="text-2xl font-semibold">
              {content.title}
            </h2>

            <p className="text-muted-foreground">
              {content.description}
            </p>
          </div>

          <Badge>{data.status}</Badge>
        </div>

        <p className="text-4xl font-bold">
          {data.value}
        </p>

        <Button onClick={onAction}>
          {content.actionLabel}
        </Button>
      </div>
    </Card>
  )
}
```

The Block:

- receives content;
- receives runtime data;
- receives behavior through its interaction contract;
- renders UI Primitives;
- owns no business rule;
- imports no Workflow;
- contains no configurable copy literals.

---

# 11. BusinessLogic™ Block / Workflow

`lib/workflows/example/exampleWorkflow.ts`

```ts
import { canReadExample } from "@/lib/authz/examplePolicies"
import { getExampleRecord } from "@/lib/fetchers/exampleFetchers"
import type { ExampleResult } from "@/types/exampleTypes"

export async function exampleWorkflow(
  recordId: string,
): Promise<ExampleResult> {
  await canReadExample(recordId)

  const record = await getExampleRecord(recordId)

  return {
    value: record.value,
    status: record.status,
  }
}
```

This example is intentionally schematic.

It demonstrates the dependency direction:

```text
Feature
    ↓
Workflow
    ↓
architecture-owned server capabilities
```

It does **not** claim that these are canonical constituents of any real Workflow.

For a real BusinessLogic™ Block, the exact constituent subset must come from its explicit Workflow constitution.

---

# 12. Feature Orchestration

`features/example/exampleFeature.tsx`

```tsx
import { ExampleBlock } from "@/components/blocks/example-block"
import { exampleContent } from "@/content/example"
import { exampleWorkflow } from "@/lib/workflows/example/exampleWorkflow"

type ExampleFeatureProps = {
  variant: keyof typeof exampleContent
}

export async function ExampleFeature({
  variant,
}: ExampleFeatureProps) {
  const result = await exampleWorkflow("normalized-record-id")
  const content = exampleContent[variant]

  async function performAction() {
    "use server"

    // Call the normalized Action or Workflow required
    // by the canonical Feature contract.
  }

  return (
    <ExampleBlock
      variant={variant}
      content={content}
      data={{
        value: result.value,
        status: result.status,
      }}
      onAction={performAction}
    />
  )
}
```

The Feature is the meeting point:

```text
normalized Workflow result ─┐
                            │
content.ts ─────────────────┼──→ Feature mapping → PureUI Block
                            │
presentation variant ───────┘
```

---

# 13. Why the Block Does Not Calculate Its Own Business Values

Wrong boundary:

```tsx
export function ExampleBlock({ records }) {
  const total = calculateBusinessTotal(records)
  const allowed = evaluatePolicy(records)

  return ...
}
```

Correct boundary:

```text
Workflow / server capability
        ↓
validated result
        ↓
Feature mapping
        ↓
Block props
        ↓
render
```

A Block may perform ordinary presentation transforms, but reusable business calculations and policy decisions belong outside PureUI.

---

# 14. Generic Client Feature Boundary

Some interaction requires a deliberate browser-only orchestration companion.

A client Feature may exist when needed:

```tsx
"use client"

import { ExampleBlock } from "@/components/blocks/example-block"

type ExampleClientFeatureProps = {
  content: {
    eyebrow: string
    title: string
    description: string
    actionLabel: string
  }

  data: {
    value: string
    status: "idle" | "active" | "complete"
  }
}

export function ExampleClientFeature({
  content,
  data,
}: ExampleClientFeatureProps) {
  function handleLocalInteraction() {
    // Browser-only orchestration.
    // Business rules still do not move into the Block.
  }

  return (
    <ExampleBlock
      content={content}
      data={data}
      onAction={handleLocalInteraction}
    />
  )
}
```

A client boundary does not make business logic configurable.

---

# 15. Block Variant Configuration

A Block may expose normalized variants:

```ts
export type ExampleBlockVariant =
  | "summary"
  | "detail"
  | "compact"
```

Anthimeria can render this as a graphical choice:

```text
Example Block

Variant:
● Summary
○ Detail
○ Compact
```

Changing the Block variant changes presentation.

It does not replace or modify the normalized Workflow.

---

# 16. UI Primitive Configuration

Suppose the Block's action control is configurable under a compatibility contract.

Presentation metadata might define:

```ts
type ActionControl =
  | { kind: "button"; variant: "default" | "outline" | "ghost" }
  | { kind: "dropdown"; variant: "default" }
```

The Feature contract still exposes one semantic action:

```text
onAction()
```

The presentation may render that action through a compatible Button or Dropdown control.

The business meaning of `onAction()` remains fixed.

This is the rule that allows Primitive-level presentation customization without turning UI configuration into business-logic configuration.

---

# 17. Semantic Token Example

`app/globals.css` remains the runtime source of semantic tokens.

A minimal schematic subset:

```css
:root {
  --background: ...;
  --foreground: ...;
  --primary: ...;
  --primary-foreground: ...;
  --border: ...;
  --radius-sm: ...;
  --radius-md: ...;
  --radius-lg: ...;
}
```

Anthimeria may expose normalized controls such as:

```text
Primary color       [ palette control ]
Border color        [ palette control ]
Radius              [ sm | md | lg | xl ]
Hover treatment     [ underline | scale | ... ]
Heading typeface    [ configured font ]
```

The Workbench must derive actual available values from the canonical token implementation rather than invent unsupported values.

---

# 18. Workbench Feature Slot Preview

The Workbench can draw the cyan regions without polluting the generated Page Template.

Conceptually:

```tsx
function WorkbenchSlot({
  label,
  children,
}: {
  label: string
  children?: React.ReactNode
}) {
  return (
    <div className="relative min-h-48 border border-cyan-400/70 bg-cyan-400/20">
      <span className="absolute left-2 top-2 text-xs">
        {label}
      </span>

      {children}
    </div>
  )
}
```

This is **Workbench UI only**.

The generated Arrangement uses neutral Feature Slots.

---

# 19. Generic Config-to-Render Example

A schematic presentation recipe:

```ts
const pagePresentation = {
  template: "template-a",

  slots: {
    topLeft: {
      feature: "example",
      block: "example-block",
      variant: "summary",
    },

    topRight: {
      feature: "example-secondary",
      block: "example-secondary-block",
      variant: "default",
    },

    middle: {
      feature: "example",
      block: "example-block",
      variant: "detail",
    },

    bottom: {
      feature: "example",
      block: "example-block",
      variant: "compact",
    },
  },
} as const
```

The important boundary is that the presentation recipe does not contain:

```text
fetcher file switches
action file switches
authz policy switches
transaction switches
workflow constituent switches
```

Those come from the normalized Ontology.

---

# 20. Generic Generated Page Relationship

```text
Ontology
   ↓
normalized route + Feature + Workflow graph
   ↓
Virgule presentation selection
   ↓
Generated page.tsx
   ↓
Selected Page Template
   ↓
Feature Slots
   ↓
Normalized Features
   ↓
Configured PureUI Blocks
```

The behavioral half remains:

```text
Normalized Feature
   ↓
BusinessLogic™ Block
   ↓
Workflow
   ↓
dependency-closed server capabilities
```

---

# 21. Generic `page.tsx` Anti-Patterns

Do not generate:

```tsx
export default function Page() {
  const data = ...
  const total = ...
  const canEdit = ...
  const content = {
    title: "Hard-coded title",
  }

  return (
    <main className="p-12">
      ...
    </main>
  )
}
```

Problems:

- route owns business logic;
- route owns content;
- route owns outer frame spacing already owned by route-group layout;
- route owns Block composition details;
- page cannot be cleanly reconstituted by Anthimeria.

Prefer:

```tsx
export default function Page() {
  return (
    <TemplateA
      topLeft={<FeatureA />}
      topRight={<FeatureB />}
      middle={<FeatureC />}
      bottom={<FeatureD />}
    />
  )
}
```

---

# 22. Generic Component Block Anti-Patterns

A PureUI Block MUST NOT:

```text
import a Workflow
import a Fetcher for application state
authorize the user
open a Prisma transaction
calculate domain totals
call Stripe directly
own route-level padding
hard-code configurable copy
```

A PureUI Block SHOULD:

```text
accept props
render Primitives
apply variants
use Semantic Design Tokens
emit compatible interaction callbacks
remain reusable
```

---

# 23. Generic Workflow Anti-Patterns

A Workflow MUST NOT:

```text
import components/blocks/*
import components/ui/*
import components/templates/*
style UI
contain JSX
own presentation strings
absorb copies of Fetcher/Action/Transaction implementation
```

A Workflow SHOULD:

```text
arrange existing architecture-owned capabilities
enforce behavioral sequencing
preserve invariants
coordinate effects
return application results to Feature Orchestration
```

---

# 24. Reference Composition Diagram

```text
APP ROUTER

app/(tenant)/layout.tsx
        ↓
TenantShell
├── TenantHeader
├── shared main frame
└── TenantFooter
        ↓
app/(tenant)/page-a/page.tsx
        ↓
TemplateA
├── Feature Slot A ─────→ Feature A
├── Feature Slot B ─────→ Feature B
├── Feature Slot C ─────→ Feature C
└── Feature Slot D ─────→ Feature D


FEATURE

Feature A
├── content/example.ts
├── BusinessLogic™ Block / Workflow
│   └── server operations + helpers
└── PureUI Component Block
    └── UI Primitives
        └── variants
            └── Semantic Design Tokens
```

---

# 25. Codex Acceptance Checklist

When Codex implements a concrete version of this reference, verify:

- [ ] `layout.tsx` applies the route-family Shell.
- [ ] Shell owns shared outer page width/gutters/padding.
- [ ] Page Template owns only internal grid topology.
- [ ] Page Template exposes named Feature Slots.
- [ ] `page.tsx` is a thin composition boundary.
- [ ] Each normalized Feature remains an application-capability orchestration boundary.
- [ ] Each Component Block is presentation-only.
- [ ] All configurable copy is imported/mapped from content/configuration.
- [ ] Runtime data is mapped separately from configurable content.
- [ ] Component Blocks import UI Primitives, not Workflows.
- [ ] Workflows import only allowed server-side architecture capabilities.
- [ ] Presentation selection does not change Workflow membership.
- [ ] Primitive substitutions preserve the semantic interaction contract.
- [ ] Semantic token controls map to actual supported token values.
- [ ] Workbench cyan slot styling does not leak into generated runtime unless explicitly selected as presentation.
- [ ] Exact real Workflow constituent mappings are taken from canonical constitutions, never inferred.
- [ ] The generated Arrangement remains valid without Anthimeria at runtime.

---

# 26. Governing Example Sentence

> **The route-group layout establishes the common page frame; the Page Template subdivides that frame into Feature Slots; each slot renders a normalized Feature; each Feature maps fixed BusinessLogic™ behavior, runtime data, configurable content, and selected presentation into a PureUI Component Block; each Block is constituted from configurable UI Primitives and variants styled by Semantic Design Tokens; and the user may change that presentation constitution without changing the normalized behavioral constitution.**
