---
title: The Simples™ — Generic Reference Implementation
type: implementation-reference
scope: domain-library
project: Codependent Coding
domain: simples
artifact: reference-pattern
namespace: codependentcoding.simples.reference-implementation
status: active
authority: normative-example
parent: codependentcoding.simples.authoritative
created: 2026-08-22
updated: 2026-08-22
---

# The Simples™ — Generic Reference Implementation

This reference teaches Codex the canonical two-family Simple model without tying the example to CRM, invoicing, support, or another real Ontology.

---

# 1. Generic Shape

```text
Feature
├── PureUI Block™
│   ├── UI Primitive
│   ├── UI Primitive
│   ├── variants
│   └── Semantic Design Tokens
│
└── BusinessLogic Block™
    └── Domain Workflow
        ├── Fetcher
        ├── Action
        ├── Authz helper
        ├── Transaction helper
        ├── Integration helper
        ├── Cache / constants / utils
        ├── Schema
        └── Types / interfaces
```

Only the two Blocks are Simples.

Their constituents are architecture-owned implementation vocabulary.

---

# 2. Generic PureUI Block

```tsx
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export type ExampleBlockProps = {
  title: string
  description: string
  value: string
  status: "idle" | "active" | "complete"
  onAction: () => void
  variant?: "default" | "compact"
}

export function ExampleBlock({
  title,
  description,
  value,
  status,
  onAction,
  variant = "default",
}: ExampleBlockProps) {
  return (
    <Card data-variant={variant}>
      <div className="space-y-4 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold">{title}</h2>
            <p className="text-muted-foreground">{description}</p>
          </div>

          <Badge>{status}</Badge>
        </div>

        <p className="text-4xl font-bold">{value}</p>

        <Button onClick={onAction}>Run action</Button>
      </div>
    </Card>
  )
}
```

Constitution:

```text
ExampleBlock
├── Card
├── Badge
└── Button
```

The Block is the Simple.

`Card`, `Badge`, and `Button` are Primitive constituents.

---

# 3. Generic BusinessLogic Block

```ts
import { canUseExample } from "@/lib/authz/examplePolicies"
import { updateExample } from "@/lib/actions/exampleActions"
import { getExample } from "@/lib/fetchers/exampleFetchers"
import { exampleInputSchema } from "@/schemas/exampleSchemas"

export async function executeExampleWorkflow(input: unknown) {
  const parsed = exampleInputSchema.parse(input)

  await canUseExample(parsed.id)

  const current = await getExample(parsed.id)

  if (current.status === "complete") {
    return current
  }

  return updateExample({
    id: parsed.id,
    status: "complete",
  })
}
```

Constitution:

```text
executeExampleWorkflow
├── Authz policy
├── Schema
├── Fetcher
└── Action
```

The Workflow is the Simple.

The policy, schema, fetcher, and action remain architecture-owned constituents.

A real canonical Workflow constitution must explicitly enumerate its exact constituent set; this generic example does not establish a real domain mapping.

---

# 4. Generic Feature Using Both Simples

```tsx
import { ExampleBlock } from "@/components/blocks/example-block"
import { executeExampleWorkflow } from "@/lib/workflows/example/executeExampleWorkflow"

export async function ExampleFeature() {
  const result = await executeExampleWorkflow({
    id: "example-id",
  })

  return (
    <ExampleBlock
      title="Example"
      description="Presentation content is mapped into the PureUI Block."
      value={result.value}
      status={result.status}
      onAction={() => undefined}
    />
  )
}
```

The important architecture is:

```text
Feature
├── ExampleBlock              ← PureUI Simple
└── executeExampleWorkflow    ← BusinessLogic Simple
```

---

# 5. PureUI Variant Example

```ts
export type ExampleBlockVariant =
  | "default"
  | "compact"
```

Anthimeria may allow the user to select the Block variant because that is presentation configuration.

It does not allow the user to rewrite the Workflow constitution.

---

# 6. Primitive Substitution Example

Suppose a compatible PureUI Block action control may be rendered as either:

```text
Button
or
Dropdown Menu
```

The Feature still provides the same semantic command contract:

```text
onAction()
```

The presentation may change.

The normalized behavior may not.

---

# 7. Semantic Design Token Example

```css
:root {
  --background: ...;
  --foreground: ...;
  --primary: ...;
  --primary-foreground: ...;
  --border: ...;
  --radius-md: ...;
}
```

The Semantic Design Tokens are constituents of the presentation system, not independent Simples.

---

# 8. Incorrect Simples Model

Do not model this:

```text
Simples
├── route
├── feature
├── fetcher
├── action
├── schema
├── primitive
├── workflow
└── block
```

That is the superseded broad interpretation.

---

# 9. Correct Simples Model

```text
Simples™
├── PureUI Block™
│   └── constituted from presentation primitives
└── BusinessLogic Block™
    └── constituted from behavioral capabilities
```

---

# 10. Codex Acceptance Checklist

- [ ] The Simple is either a PureUI Block or BusinessLogic Block.
- [ ] A Component Block lives under `components/blocks/`.
- [ ] A Workflow lives under `lib/workflows/{domain}/`.
- [ ] UI Primitives remain PureUI constituents.
- [ ] Server operations/helpers/contracts remain BusinessLogic constituents.
- [ ] PureUI imports no Workflow.
- [ ] Workflow imports no presentation implementation.
- [ ] Block variants alter presentation only.
- [ ] Semantic token changes alter presentation only.
- [ ] Workflow dependency subsets are explicit, never inferred from names.
- [ ] Features are the orchestration boundary where both Simple families meet.
