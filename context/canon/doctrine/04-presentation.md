---
title: Presentation
slug: presentation
order: 4
summary: Primitives, blocks, templates and features; purity; forms; client islands; content; tokens; accessibility.
rules:
  [
    CC-A11Y-001,
    CC-A11Y-002,
    CC-A11Y-003,
    CC-BLOCK-001,
    CC-BLOCK-002,
    CC-CLIENT-001,
    CC-CONTENT-001,
    CC-FEAT-001,
    CC-FEAT-002,
    CC-FEAT-003,
    CC-FEAT-004,
    CC-FEAT-005,
    CC-TOKEN-001,
    CC-UI-001,
    CC-UI-002,
  ]
---

# Presentation

## Purity

Presentation owns no persisted reads or writes, no authorization, no provider SDKs and no business decisions. It receives DTOs and callbacks; it renders. The server is the source of truth, so the UI never decides what state is legal.

## The four layers

| Layer     | Folder                 | File                                                                                 | Owns                                                       | May import                                     |
| --------- | ---------------------- | ------------------------------------------------------------------------------------ | ---------------------------------------------------------- | ---------------------------------------------- |
| Primitive | `components/ui`        | `button.tsx` (shadcn name, unchanged)                                                | one control, its variants, its a11y behavior               | Radix, `cn`, tokens                            |
| Block     | `components/blocks`    | `<slice>-blocks.tsx` (e.g. `crm-blocks.tsx`, `public-blocks.tsx`, `core-blocks.tsx`) | a reusable composition with narrow props and visual states | primitives, other blocks                       |
| Template  | `components/templates` | `<slice>-templates.tsx`                                                              | the arrangement of one page's blocks                       | blocks                                         |
| Feature   | `features/<slice>`     | `<slice><Thing>Feature.tsx`                                                          | awaiting data and handing DTOs to a template               | workflows, fetchers, templates, islands, forms |

> **CC-BLOCK-001** · `now` · `codependent/layer-boundaries`
> Blocks and templates import nothing from `lib/` except `lib/utils/cn`, and nothing from `features/`.

> **CC-UI-001** · `now` · review
> Primitives are added with the shadcn CLI and keep their shipped names and variants. Restyling goes through tokens, not edits to variant tables. Every registry add is reviewed as a diff, and any new dependency it brings obeys the supply-chain rules.

Special flat folders: `nav/`, `shells/`, `brand/` (mark and lockup), `chart/` (Recharts wrappers bound to `chart-*` tokens), and `components/error-boundary.tsx`. Nav and shells MAY render Clerk UI widgets (`<UserButton/>`, `<OrganizationSwitcher/>` is not used — organizations are application-owned).

> **CC-BLOCK-002** · `now` · `codependent/layer-boundaries`
> Nav and shells are pure presentation. The only non-presentation import allowed is a Clerk UI component (`<UserButton/>`, `<SignedIn/>`); data reaches them as props from the route-group layout.

> **CC-UI-002** · `now` · `codependent/layer-boundaries`
> Primitives and `hooks/` stay browser-side: they import no `lib/` module except `lib/utils/cn`, and no server module.

Exceptions, and only these:

1. `(public)` pages compose blocks directly; no feature.
2. Forms import primitives directly.
3. Skeletons import `components/ui/skeleton` and blocks.
4. Client islands import interactive primitives.

## Features

A feature is a server component by default.

```tsx
// features/crm/crmContactFeature.tsx
import { notFound } from "next/navigation";
import { CrmContactDetailTemplate } from "@/components/templates/crm-templates";
import { getCrmContact } from "@/lib/fetchers/crmFetchers";
import { CrmContactActions } from "./crmContactActions.client";

export async function CrmContactFeature({ contactId }: { contactId: string }) {
  const contact = await getCrmContact({ contactId });
  if (!contact) notFound();
  return (
    <CrmContactDetailTemplate
      contact={contact}
      actions={
        <CrmContactActions contactId={contact.id} version={contact.version} />
      }
    />
  );
}
```

> **CC-FEAT-001** · `now` · `codependent/layer-boundaries`
> Features import no db, transaction, integration, provider SDK or UI primitive.

> **CC-FEAT-005** · `now` · review
> Only DTOs cross into a client component. Never a Prisma record, never a whole user, never a field the DTO mapper did not list.
> Every prop of a client component is serialized into the HTML payload. The DTO mapper is the allowlist of what may leave the server.

## Client islands

```text
features/crm/crmContactActions.client.tsx
```

> **CC-CLIENT-001** · `now` · `codependent/use-client-placement`
> `"use client"` appears only in `*.client.tsx`, `*Form.tsx`, `components/ui/*`, `components/chart/*`, `error.tsx`, `global-error.tsx`, and hooks.

> **CC-FEAT-004** · `now` · `codependent/layer-boundaries`
> Client islands import actions and interactive primitives; never fetchers, workflows or `server-only` modules.

Keep islands small: a button group, a filter bar, a drag handle. The page around them stays a server component.

## Forms

React Hook Form, the shadcn `Field` components (the `Form`/`FormField`/`FormItem` wrappers are the previous generation), the Zod resolver, and the **same schema file** the action parses.

```tsx
// features/crm/crmContactNewForm.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { createCrmContact } from "@/lib/actions/crmActions";
import {
  createCrmContactSchema,
  type CreateCrmContactInput,
} from "@/schemas/crmSchemas";

export function CrmContactNewForm() {
  const [pending, startTransition] = useTransition();
  const form = useForm<CreateCrmContactInput>({
    resolver: zodResolver(createCrmContactSchema),
    defaultValues: { firstName: "", lastName: "", email: "" },
  });

  function onSubmit(values: CreateCrmContactInput) {
    startTransition(async () => {
      const result = await createCrmContact(values);
      if (result.ok) return toast.success("Contact created");
      for (const [name, messages] of Object.entries(
        result.error.fieldErrors ?? {},
      )) {
        form.setError(name as keyof CreateCrmContactInput, {
          message: messages[0],
        });
      }
      if (!result.error.fieldErrors) toast.error(result.error.message);
    });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <Controller
        control={form.control}
        name="email"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Email</FieldLabel>
            <Input
              id={field.name}
              type="email"
              autoComplete="email"
              aria-invalid={fieldState.invalid}
              {...field}
            />
            <FieldError errors={[fieldState.error]} />
          </Field>
        )}
      />
      {/* firstName, lastName … */}
      <Button type="submit" disabled={pending}>
        Create contact
      </Button>
    </form>
  );
}
```

> **CC-FEAT-002** · `now` · `codependent/layer-boundaries`
> Forms import actions, schemas, primitives and blocks only. Authentication and authorization live in the action, never in the form.

The client-side schema check is a convenience for the user; the action's parse of the same schema is the law. A form never builds its own schema.

## Skeletons

> **CC-FEAT-003** · `now` · `codependent/layer-boundaries`
> Skeletons import `ui/skeleton` and blocks only, and reproduce the final layout's grid and heights so nothing shifts when data arrives (CLS ≈ 0).

## Content

> **CC-CONTENT-001** · `now` · `codependent/no-hardcoded-copy` (warn)
> User-facing text in tenant and admin presentation comes from `content/<slice>.ts`. Exceptions: `(public)` pages and form labels.
> Copy is data. Keeping it out of components makes a copy edit a one-file diff and makes the voice reviewable in one place.

## Design tokens

All color, radius, border, shadow, spacing, motion and font values are CSS custom properties in `app/globals.css`, bridged into Tailwind with `@theme inline`.

| Group   | Tokens                                                                                                       |
| ------- | ------------------------------------------------------------------------------------------------------------ |
| Surface | `background` `foreground` `card` `card-foreground` `popover` `popover-foreground` `muted` `muted-foreground` |
| Brand   | `primary` `primary-foreground` `secondary` `secondary-foreground` `accent` `accent-foreground`               |
| State   | `destructive` `success` `warning` `info` (each with `-foreground`)                                           |
| Line    | `border` `input` `ring`                                                                                      |
| Data    | `chart-1` … `chart-5`                                                                                        |
| Shape   | `radius` `border-width` `shadow-hard`                                                                        |
| Motion  | `duration-fast` `duration-base` `ease-mechanical`                                                            |
| Type    | `font-sans` `font-mono` `font-display`                                                                       |

> **CC-TOKEN-001** · `now` · `codependent/no-raw-color`
> Components use semantic utilities (`bg-background`, `text-muted-foreground`, `border-border`). No hex values, no Tailwind palette colors (`bg-zinc-900`), no arbitrary color values.

The default look is structural neo-brutalism: square geometry (`radius` ≤ 6px), 1–2px hard borders, offset hard shadows, a neutral scale plus one brand color. Dark only. The token structure keeps a light set possible without touching a component.

## Accessibility

shadcn and Radix give keyboard handling, focus management and ARIA for free. Three rules cover what they cannot.

> **CC-A11Y-001** · `now` · `scripts/check-contrast.mjs`
> Every text/background token pair meets WCAG 2.2 AA: 4.5:1 for body text, 3:1 for large text and UI boundaries. The script computes it from `globals.css`; the CLI runs it on the chosen brand color.

> **CC-A11Y-002** · `now` · review
> Status never rides on color alone. Every status carries an icon or a word.

> **CC-A11Y-003** · `now` · `jsx-a11y` (from `eslint-config-next`)
> Labels bound to inputs, errors linked with `aria-describedby`/`aria-invalid`, visible focus ring on every interactive element, touch targets ≥ 40×40px, motion reduced under `prefers-reduced-motion`.
