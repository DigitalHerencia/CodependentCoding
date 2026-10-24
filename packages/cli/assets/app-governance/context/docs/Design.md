---
title: {{appName}} — Design
doc: design
status: active
updated: {{createdAt}}
compiles_to: .claude/contracts/design.yaml
---

# {{appName}} — Design

## 1. Visual principles

- Dense, technical, legible. Information beats decoration.
- Strong borders, square or minimally rounded geometry (`--radius` ≤ 6px).
- Mechanical motion: short, linear/ease-out, ≤ 200ms; respect `prefers-reduced-motion`.
- Avoid: pastel rainbows, candy colors, bubbly rounded cards, toy iconography, startup gradients, cartoon neo-brutalism.

<!-- App-specific: audience, tone, anything the brand needs beyond one color. -->

TODO

## 2. Design system

### 2.1 Token architecture

All color, radius, border, shadow, spacing, motion, and font values are CSS variables in `app/globals.css`, bridged to Tailwind v4 via `@theme inline`. Components use semantic utilities only (`bg-background`, `text-muted-foreground`, `border-border`, `ring-ring`); raw hex or Tailwind palette colors in components are forbidden.

| Group    | Tokens                                                                                                              |
| -------- | ------------------------------------------------------------------------------------------------------------------- |
| Surfaces | `background`, `foreground`, `card`, `card-foreground`, `popover`, `popover-foreground`, `muted`, `muted-foreground` |
| Brand    | `primary`, `primary-foreground`, `secondary`, `secondary-foreground`, `accent`, `accent-foreground`, `signal`       |
| State    | `destructive`, `success`, `warning`, `info` (+ `-foreground`)                                                       |
| Lines    | `border`, `input`, `ring`                                                                                           |
| Data     | `chart-1` … `chart-5`                                                                                               |
| Shape    | `radius` (default 4px), `border-width` (1px), `shadow-hard` (offset 2px)                                            |
| Motion   | `duration-fast` 120ms, `duration-base` 180ms, `ease-mechanical`                                                     |
| Type     | `font-sans`, `font-mono`, `font-display`                                                                            |

### 2.2 Brand color

Brand color: {{color}}. `hipster-stack new --color <hex>` set `--primary` (and `--signal` when present) and picked the more legible `--primary-foreground`; without `--color` the template's reviewed default tokens stay. Everything else stays neutral. To change it later, edit `--primary` in `app/globals.css` and recheck contrast.

### 2.3 Themes

- Generated apps ship **light and dark**, following the system preference, toggled via `hooks/use-theme.ts`.
- Neutral scale: zinc-like grays; dark canvas near-black (`oklch(0.13 0 0)`), not pure black.
- Fonts are offline-safe (packaged or local), so builds never fetch Google Fonts.

### 2.4 Component layers

| Layer            | Folder                 | Notes                                                                                                                                                      |
| ---------------- | ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Primitives       | `components/ui`        | Full shadcn/BoldKit-derived catalog (base)                                                                                                                 |
| Charts           | `components/chart`     | Recharts wrappers using `chart-*` tokens                                                                                                                   |
| Blocks           | `components/blocks`    | Generic: hero, feature grid, pricing, FAQ, CTA, stats, footer, data table, record detail, kanban, calendar, timeline, settings, empty/error/loading states |
| Domain templates | `components/templates` | Module-owned (`crmContactsTemplate.tsx`)                                                                                                                   |
| Nav              | `components/nav`       | public header/footer, user menu, mobile bottom nav                                                                                                         |
| Shells           | `components/shells`    | `public-shell`, `auth-shell`, `tenant-shell`, `portal-shell`                                                                                               |

### 2.5 Page compositions

| Route group | Shell        | Composition                                                             |
| ----------- | ------------ | ----------------------------------------------------------------------- |
| `(public)`  | public-shell | hero → feature grid → stats → CTA → footer; FAQ/terms/privacy as blocks |
| `(auth)`    | auth-shell   | centered Clerk card                                                     |
| `(setup)`   | auth-shell   | onboarding stepper (create organization)                                |
| `(tenant)`  | tenant-shell | sidebar (from registry) + top bar (org switcher, user menu) + content   |
| `(dev)`     | none         | `/design-system` proof page, development only                           |

Every dynamic tenant page: `Suspense` with a feature-specific skeleton that mirrors the final layout.

### 2.6 Design-system proof page

`app/(dev)/design-system/page.tsx` renders every token, type role, spacing step, primitive, block, chart, and state. It calls `notFound()` outside development. It is the visual regression reference for the app.

## 3. Accessibility

- WCAG 2.2 AA: text contrast ≥ 4.5:1 (3:1 for large text and UI boundaries) — checked for the brand color at `new`.
- Visible focus ring on every interactive element (`ring` token, 2px).
- Keyboard: all actions reachable; dialogs trap focus; Escape closes.
- Forms: labels bound to inputs, errors announced via `aria-describedby`, required fields marked.
- Motion reduced under `prefers-reduced-motion`.
- Touch targets ≥ 40×40px on mobile.

## 4. Responsive

- Breakpoints: Tailwind defaults (`sm` 640, `md` 768, `lg` 1024, `xl` 1280).
- Tenant shell: sidebar ≥ `lg`; mobile bottom nav below `md`.
- Tables collapse to card lists below `md`.
- No horizontal page scroll at 360px.

## 5. Interaction states

Every interactive component defines: default, hover, focus-visible, active, disabled, loading (spinner or skeleton), error, empty. Toasts (Sonner) for async action results; inline errors for validation.

## 6. Content voice

Plain, direct, sentence case. Buttons are verbs ("Create project"). Empty states say what the thing is and offer the first action. Errors say what happened and what to do.
