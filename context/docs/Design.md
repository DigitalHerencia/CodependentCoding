# Visual and Interaction Design Specification

# 1. Design Intent

The site is dark-mode only, neo-brutalist, technical, theatrical, and deliberately over-specified. It should feel like an architecture manual escaped into a retro-futurist command console, then acquired a legal department just long enough to trademark every noun.

# 2. Visual Tokens

| **Token**          | **Value / Rule**                                                                      |
| ------------------ | ------------------------------------------------------------------------------------- |
| Primary background | black and \#05030b                                                                    |
| Primary foreground | white                                                                                 |
| Brand cyan         | approximately \#2f7a8d                                                                |
| Glow / underline   | \#2f7a8d                                                                              |
| Heading type       | Copperplate Gothic Bold or supplied raster/vector wordmark assets                     |
| Body type          | JetBrains Mono                                                                        |
| Code type          | Fira Code                                                                             |
| Borders            | Thin, high-contrast cyan/gray lines; square or restrained radius.                     |
| Effects            | Controlled cyan glow on major wordmarks/headings, never at the expense of legibility. |

# 3. Brand Asset Rule

The supplied public/ assets are authoritative for logos, wordmarks, banner artwork, crown artwork, and named identity graphics. Where a supplied wordmark exists, prefer the asset over approximating the identity with a substitute font. Text remains semantic where it is content rather than a logo.

# 4. Global Header

- Black background.
- Codependent Coding wordmark at left.
- Primary product navigation across the header.
- Copperplate-style all-caps navigation.
- White default text.
- Active route underlined in brand cyan.
- Hover approximately scale(1.05), restrained enough to avoid layout movement.
- Mobile navigation collapses without losing access to any primary surface.

# 5. Global Footer

- Black footer layered above the decorative landscape artwork.
- Digital Herencia identity at left.
- FAQ, Terms, and Privacy links aligned as in the mockups.
- Footer remains readable independently of the background image.
- Decorative circuit lines/landscape may visually merge into the footer boundary but must not obstruct links.

# 6. Page Background Artwork

| **Surface**                     | **Asset / Behavior**                                                                                           |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| Landing                         | Digital Herencia Banner.png; full viewport width; bottom anchored; automatic height; \#05030b page background. |
| Anthimeria                      | Digital Herencia Desert BG.png; full width; bottom anchored; footer overlays correctly.                        |
| Simples                         | Digital Herencia Desert BG.png; same behavior.                                                                 |
| Related catalog/detail surfaces | May use the same landscape language when consistent with supplied mockups.                                     |

# 7. Landing Composition

- Large centered Codependent Coding identity artwork in the upper hero.
- Mandatory headline: WHEN EPISTEMOLOGIES FAIL, THE STACK STILL GOVERNS.
- Supporting Hipster Stack copy beneath.
- Two primary CTA buttons styled as cyan rectangular controls.
- Secondary line: NOTHING TO BORROW. WE CHECKED.
- Large Digital Herencia mark in the lower content field.
- Bottom landscape/circuit artwork forms the visual horizon above the footer.
- Maintain generous negative space. The page should not be filled merely because CSS permits it.

# 8. Ontology Page

- Centered THE ONTOLOGY™ / NORMALIZED DEFAULTS wordmark.
- Horizontal wrapped Ontology selector beneath.
- Selected Ontology receives cyan underline/state.
- Main bordered workbench panel contains a file/tree view and source/definition viewer.
- Description/capability material sits below the viewer inside the same visual system.
- COPY PAGE and DOWNLOAD actions occupy the upper-right action area.
- Desktop prioritizes a wide code-viewing composition; mobile stacks tree/viewer safely.

# 9. Simples Overview

- Large THE SIMPLES™ / NORMALIZED BLOCKS identity.
- Separate visual statements for BUSINESSLOGIC BLOCKS™ / DOMAIN WORKFLOWS and PURE UI BLOCKS™ / PRESENTATION LAYER.
- Use bounded architecture diagrams/cards rather than generic marketing grids.
- The page must communicate that Simples has exactly two top-level families.

# 10. BusinessLogic Block Detail

- BusinessLogic Blocks wordmark above a large block title such as AUTH CLIENT.
- Top capability/action row includes status controls such as Blocks, Docs, Builder Preset, and Start Config where actually supported.
- Tabs/controls switch among definition, documentation, and related supported views.
- Definition view uses a large dark code panel with line numbers or equivalent code readability.
- Supporting cards summarize Includes, Works With, and Output.
- Primary actions may include Download Definition, Copy CLI Command, and Copy Share URL only when backed by real behavior.

# 11. PureUI Block Catalog and Detail

- PureUI identity and block category title remain visually dominant.
- Catalog pages may present multiple real block previews on the page.
- Block demonstrations use actual application components where possible.
- Examples such as Errors and Onboarding are displayed as coherent families, not disconnected screenshots.
- Preview scale must preserve enough detail to evaluate the component while keeping the catalog scannable.

# 12. Anthimeria

- Centered THE ANTHIMERIA™ WORKBENCH identity.
- Desktop uses a left configuration rail and right workbench content.
- Configuration categories are visually discrete: Foundation, Data, Identity, Capabilities, Integrations, Identity & Access, Routes & Navigation, Presentation, Output, or their current renamed equivalents.
- Numbered configuration stages create clear progression.
- Controls use outlined dark panels with cyan active/selected state.
- Application definition preview remains visible as the durable output of configuration.
- Lower summary cards communicate Includes, Works With, and Output.
- The visual language must make it obvious that the user is configuring a bounded definition, not dragging arbitrary server internals around.

# 13. Documentation

- Left documentation navigation on desktop.
- Readable long-form content column with generous line height.
- Current section visibly selected.
- Code, inline code, links, and headings use the shared cyan/white system.
- Documentation must remain substantially quieter than the marketing surfaces so long-form reading is tolerable.

# 14. Responsive Behavior

- No fixed desktop composition may force horizontal page scrolling.
- Header collapses cleanly.
- Two-column code/workbench layouts stack on narrow screens.
- Large wordmarks scale with clamp() or asset constraints rather than overflowing.
- Decorative landscape artwork remains bottom anchored without consuming the entire mobile viewport.
- CTA groups and segmented controls wrap while preserving state clarity.

# 15. Interaction States

| **State**       | **Treatment**                                                                          |
| --------------- | -------------------------------------------------------------------------------------- |
| Default         | White/cyan text on near-black surface.                                                 |
| Hover           | Small scale/brightness increase; border/glow intensification where appropriate.        |
| Active/Selected | Cyan underline, border, fill, checkmark, or explicit selected state.                   |
| Focus           | Visible keyboard focus ring distinct from hover.                                       |
| Disabled        | Reduced contrast but still legible; no misleading hover behavior.                      |
| Error           | Explicit red/error accent may appear locally; do not recolor the entire design system. |
| Success         | Explicit confirmation/check state and text feedback.                                   |

# 16. Voice and Copy

- Technical, precise, irreverent, and self-aware.
- Architecture terminology must remain semantically correct even when the surrounding copy is playful.
- Mereological nihilism jokes are permitted and encouraged in non-critical copy.
- Easter eggs from the supplied content specification may appear in low-stakes locations.
- Critical instructions, security messages, errors, and configuration consequences remain plain and unambiguous.

# 17. Mockup Plates

The following supplied mockups are the visual reference set. They are included here as design plates rather than treated as pixel-perfect screenshots.

**Landing Mockup**

![Landing Mockup](assets/mockups/landing-mockup.jpg)

**Ontology Mockup**

![Ontology Mockup](assets/mockups/ontology-mockup.jpg)

**Simples 1 Mockup**

![Simples 1 Mockup](assets/mockups/simples-1-mockup.jpg)

**Simples 2 Mockup**

![Simples 2 Mockup](assets/mockups/simples-2-mockup.jpg)

**Anthimeria Mockup**

![Anthimeria Mockup](assets/mockups/anthimeria-mockup.jpg)

**Business Blocks Mockup**

![Business Blocks Mockup](assets/mockups/business-blocks-mockup.jpg)

**Docs Mockup**

![Docs Mockup](assets/mockups/docs-mockup.jpg)

**UI Blocks 1 Mockup**

![UI Blocks 1 Mockup](assets/mockups/ui-blocks-1-mockup.jpg)

**UI Blocks 2 Mockup**

![UI Blocks 2 Mockup](assets/mockups/ui-blocks-2-mockup.jpg)

**Template Mockup**

![Template Mockup](assets/mockups/template-mockup.jpg)

# Current public-site visual authority (2026-08-31)

The public canvas is black / `#05030b`; visible foreground is white with restrained `#2f7a8d` cyan emphasis and glow. Main textual titles use Archivo Black, subheadings use Copperplate Gothic Bold or a safe system fallback, body copy uses JetBrains Mono, and code/Monaco use Fira Code.

The shared bottom framing is the literal `public/Digital Herencia Desert BG.jpg` asset with preserved aspect ratio. Brand and product identities use the current literal `.jpg` assets under `public/`; layout-diagram cyan regions are never rendered as giant cyan panels.
