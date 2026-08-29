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
