# Pong Lee portfolio

## Design read
Developer portfolio for hiring managers: restrained technical editorial,
project-led, with a personal connection to Minnesota and fishing.
Redesign with the existing routes, wordmark, navigation and professional facts.
DESIGN_VARIANCE 6, MOTION_INTENSITY 3, VISUAL_DENSITY 3.

## Audit
The original uses charcoal #101416, mint #b5e9cf, Manrope and DM Sans,
8px cards and 6px buttons. Its homepage repeats three equal navigation cards
instead of introducing projects. Numbered labels and long hero copy weaken
the hierarchy. Preserve the FishingLog simulation, resume PDF, contact details,
project descriptions, keyboard access, and small LeetCode difficulty card.
All five .html routes and primary navigation labels stay stable. No analytics
or structured data existed. Preserve page titles and provide page-specific descriptions.

## References
Taste: layout audit, restrained use of containers, typography and accessibility.
ImageToCode: generated hero, project section and Skills page comps, inspected
before implementation. The comps guide geometry, not factual claims.
Awesome DESIGN.md: Resend reference informs hairline borders, clear surface
hierarchy, 1200px content width and generous spacing. This is inspiration,
not the official Resend design system; no brand typography or copy is copied.

## Visual extraction
Hero: left-aligned two-line sans heading; 60/40 composition, rectangular
shoreline image, 72px navigation, 56px gutters, two clear actions.
Projects: 40px section title, wide photo, open narrative column, compact
second project row. Use actual project facts rather than generated copy.
Skills: label/value columns, 32px headings, sparse separators, compact
three-column LeetCode card beneath computer science coursework.

## Tokens
Dark canvas #111715; surface #1a221e; text #edf0e7; muted #b0bbb2;
accent #b8d6a8; line #36453c. Light canvas #f4f6ef; surface #e8eee3;
text #18251c; muted #526252; accent #315e38; line #cad5c6.
Manrope is self-hosted under assets/fonts with its OFL license.
Use system monospace for code and metadata. Display 48-72px, body 16px,
intro 18px, section titles 32-40px. Corners: media 4px, controls 6px,
bounded functional panels 8px. No decorative shadows or gradients.
Spacing: 8/16/24/32/48/64/80. Content width 1200px.

## Behavior
System theme by default; persistent manual theme toggle. Mobile menu below
900px with aria-expanded, keyboard Escape and a no-JavaScript nav fallback.
Motion is limited to hover/pressed feedback and respects reduced motion.
Images have reserved dimensions and descriptive alt text; the hero loads
eagerly, supporting photographs lazily. Generated photographs illustrate
the landscape and project context; they do not represent user photographs
or product screenshots. Daily LeetCode snapshot and last solved remain.

## Generated assets
Built-in image generation; prompts and source comps saved in design/prompts.md.
Published photos: assets/shoreline.webp and assets/fishing.webp.
