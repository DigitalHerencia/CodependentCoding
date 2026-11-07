# Design

> **Status:** Draft · **Owner:** TODO: · **Last updated:** TODO:

How the app looks, reads and behaves. Tokens and components come from the template design system.

Fill every `TODO:`. Write `None` or `N/A — reason` when a section does not apply; never delete a section. Each section lists the specs it feeds, so the build process can be traced back to this document.

## Brand and visual principles

_Brand identity and the principles screens follow._

- **Brand color:** TODO: (set by the generator)
- **Typography:** TODO:
- **Principles:** TODO:

**Feeds:** `ENG-M1-P1.2-CONFIG-T04`

## Design tokens

_Color, spacing, radius and type tokens. Components use tokens only, never raw values._

| Token group | Source              | Notes          |
| ----------- | ------------------- | -------------- |
| Color       | theme CSS variables | light and dark |
| TODO:       |                     |                |

**Feeds:** `ENG-M1-P1.2-CONFIG-T04`

## Components

_Shared components and any app-specific additions._

- **Base:** shadcn/ui primitives in `components/ui`
- **App-specific:** TODO:

**Feeds:** `ENG-M1-P1.2-CONFIG-T04`, `ENG-M2-P2.1-FEATURES-T02`

## Page inventory and layouts

_Every page, its layout and who can see it._

| Route | Purpose | Layout | Visible to |
| ----- | ------- | ------ | ---------- |
| TODO: |         |        |            |

**Feeds:** `ENG-M3-P3.2-REVIEW-T03`

## Key flows and states

_For each key screen: loading, empty, error and success states._

| Screen | Loading | Empty | Error | Success |
| ------ | ------- | ----- | ----- | ------- |
| TODO:  |         |       |       |         |

**Feeds:** `ENG-M2-P2.1-FEATURES-T02`, `ENG-M2-P2.2-VALIDATE-T02`

## Accessibility

_Target WCAG 2.2 AA._

- Keyboard access and visible focus on every control
- Contrast AA in light and dark themes
- Labels for every input; errors announced
- TODO:

**Feeds:** `ENG-M2-P2.2-VALIDATE-T02`

## Responsive behavior

_Breakpoints and how layouts adapt._

- **Breakpoints:** TODO:
- **Mobile-first rules:** TODO:

**Feeds:** `ENG-M2-P2.2-VALIDATE-T02`

## Content and voice

_Tone and terminology. Copy lives in `content/`._

- **Tone:** TODO:
- **Glossary:** TODO:

**Feeds:** `ENG-M2-P2.2-VALIDATE-T02`

## SEO and metadata

_Public page metadata, social cards, sitemap and robots._

- **Default title and description:** TODO:
- **Social image:** TODO:
- **Indexed routes:** TODO:

**Feeds:** `ENG-M3-P3.3-UPDATES-T03`

## Analytics events

_Product events to track. No PII in event properties._

| Event | Trigger | Properties |
| ----- | ------- | ---------- |
| TODO: |         |            |

**Feeds:** `ENG-M3-P3.3-UPDATES-T03`
