# Design — The Maximal Template™

## 1. Design objective

The Maximal Template™ is **dark-mode only** and uses a mature technical neo-brutalist visual language.

The target is not playful neo-brutalism.

The system should feel:

- industrial;
- technical;
- dense;
- deliberate;
- sharp;
- bold;
- modern;
- confident;
- slightly aggressive;
- highly legible.

## 2. Theme policy

There is one product theme: dark.

The root token system is dark by default.

Do not maintain a light-first palette with an optional `.dark` override.

If a `.dark` class remains for Tailwind/shadcn mechanics, it must resolve to the same canonical dark system rather than representing an optional user theme.

## 3. Core visual characteristics

Use:

- near-black and charcoal backgrounds;
- off-white foreground text;
- strong visible borders;
- restrained one- or two-accent color system;
- hard or offset shadows used sparingly;
- squared or minimally rounded geometry;
- dense but readable type hierarchy;
- explicit focus states;
- compact technical badges;
- controlled contrast;
- mechanical, deliberate motion.

Avoid:

- cream/light default surfaces;
- candy palettes;
- simultaneous bright yellow/pink/cyan/green accents;
- toy-like cards;
- excessive radius;
- bubbly shadows;
- playful bounce;
- cartoon icon treatment;
- ornamental gradients without purpose.

## 4. Token strategy

Use CSS custom properties as the canonical token layer.

Required semantic categories include:

- background;
- foreground;
- surface;
- elevated surface;
- muted surface;
- border;
- strong border;
- primary accent;
- secondary accent;
- success;
- warning;
- danger;
- information;
- muted foreground;
- focus ring;
- hard shadow;
- radius;
- spacing;
- typography;
- motion duration/easing.

Reusable components should consume semantic tokens rather than hard-coded arbitrary colors.

## 5. Primitive responsibility

`components/ui/*` is the raw primitive layer.

Primitive review is the first design-system normalization step because every block and feature inherits from it.

Each primitive should be checked for:

- dark token usage;
- border weight;
- radius;
- shadow behavior;
- focus-visible state;
- disabled state;
- keyboard behavior;
- density;
- typography;
- hover/active motion;
- contrast.

## 6. Block responsibility

Blocks are pure presentation compositions made from primitives.

Blocks should form a catalog of reusable variations rather than one-off page widgets.

Examples:

```text
hero-sections.tsx
  HeroCentered
  HeroSplit
  HeroWithStats
  HeroMinimal

cta-sections.tsx
  CtaInline
  CtaPanel
  CtaSplit

data-tables.tsx
  DataTableCompact
  DataTableToolbar
  DataTableSelectable
```

Block filenames are lowercase kebab-case.

Named exports are descriptive PascalCase variations.

## 7. Form exception

React Hook Form features compose primitives directly.

Forms do not require a presentation block in between.

This is an intentional design and architecture exception.

## 8. Layout character

Public pages should communicate the maximal-template identity rather than imitate a generic SaaS conversion funnel.

Application routes should favor:

- strong shell/navigation hierarchy;
- compact metadata;
- clear record density;
- intentional empty/loading states;
- visible system-status labels where useful.

## 9. Motion

Motion should feel mechanical.

Preferred:

- short linear or controlled easing;
- deliberate hover displacement;
- subtle hard-shadow shift;
- direct opacity/transform transitions.

Avoid:

- springy bounce as default;
- decorative perpetual animation;
- exaggerated scale;
- motion that obscures information density.

Respect reduced-motion preferences.

## 10. Accessibility

The design system must preserve:

- semantic HTML;
- keyboard navigation;
- visible focus;
- sufficient contrast;
- usable touch targets;
- accessible labels;
- dialog/menu focus behavior;
- reduced motion;
- non-color-only status communication.

Dark-only does not lower accessibility requirements.

## 11. Responsive behavior

The application must remain usable on small screens.

Responsive design should prioritize:

- information hierarchy;
- readable tables/records;
- collapsible navigation;
- touch interaction;
- practical content density.

Do not merely shrink desktop layouts.

## 12. Copy and positioning

Avoid generic signup-funnel copy as the dominant product framing.

Preferred calls to action demonstrate exploration:

- explore dashboard;
- inspect CRM;
- browse admin demo;
- view components;
- inspect integrations;
- see architecture in action.

Sign-in/sign-up remain available as demonstrated capabilities but are not the primary gateway to the public demo.

## 13. Typography

`app/globals.css` owns the sitewide Tailwind v4 typography system. Keep the
three existing font families: Archivo Black for display headings, JetBrains Mono
for reading and controls, and Fira Code for code, keyboard notation, and samples.
Archivo Black uses its native 400 weight; small h5/h6 headings use body-font weight
for hierarchy without oversized display lettering.

- `text-heading-1` through `text-heading-6` define the heading scale, leading, and
  tracking. Semantic h1–h6 elements inherit these defaults; h1–h3 scale fluidly.
- `type-title` is the compact display title for cards and auth form headings.
- `type-body`, `type-lead`, and `type-caption` distinguish reading, introductions,
  and supporting metadata. `reading-copy` adds a prose measure and paragraph rhythm.
- `eyebrow` is the restrained uppercase context label, not a competing headline.
- `type-label` uses sentence case, normal tracking, and sufficient line height.
  `form-field` groups a left-aligned label and control with a compact gap.
- `type-action` standardizes button text; `type-link` uses a persistent underline
  and a heavier hover underline so links do not depend on color alone.

Type roles do not assign surface colors. Pair foreground with its owning surface;
use contrast, size, weight, and spacing together to establish hierarchy. Input text
remains at 1rem. Auth content aligns left, password visibility sits beside its
label, and secondary navigation follows a divider below the primary action.
Preserve authored copy when changing presentation.

## 14. Palette and navigation refinement

The four palette sources in `app/globals.css` are `background`, `foreground`,
`primary`, and `muted-primary`. Semantic component aliases remain compatible but
must derive from these four sources. Use opacity in 10-percent steps for surface
depth, borders, selection, and emphasis; do not introduce independent gray or
status palettes. Low-opacity accents are decorative. Text and control indicators
must retain sufficient contrast against the actual composited surface.

`TenantShell` owns the one collapsible application sidebar. Domains have controlled
expansion and route children, with a mobile navigation disclosure. `DashboardLayout`
owns page content and optional contextual content, not a second navigation rail.
Branding uses the supplied favicon mark and a two-line text lockup.

Shared composition utilities also live in `app/globals.css`: `surface-card`,
`surface-popover`, `surface-inset`, `surface-header`, `surface-body`,
`surface-footer`, `control-field`, `control-action`, `navigation-item`, and
`navigation-active`. Shared card, input, button, dashboard, and navigation
components consume these roles. Use native Tailwind utilities for local layout
exceptions rather than repeating an entire surface definition.

### Owner-directed surface corrections (2026-09-08)

All button controls use a 3px foreground border, including ghost and link variants. Dashboard supplemental content follows the main content vertically; no right-hand rail may reserve main-content width.
