# Homepage design QA — 2026-10-18

final result: passed

## Target and approved deviations
Concept 1 is the layout target, with the editorial hierarchy of concept 3. User explicitly requires the existing owner photograph, unchanged. Current published Thai content, logos, routes, and authentication must remain. Generated concept copy, people, logos, contacts, and packaging are not source data.

## Evidence
- Selected concept: exec-d25a12d2-5b37-4117-8727-0eb7aa05afe7.png.
- Browser rendered local application through terminal.local preview.
- Combined source/implementation comparison: bienvica-qa-comparison.jpg (working capture).
- Desktop opening and complete page inspected; mobile checked in a 390px iframe with an 844px viewport. Mobile navigation expanded correctly.
- Original garden.webp SHA-256 unchanged: 59547205983fc36510daf196d2b1e3acb46b6996109cc8f7fe5e7ab4f0736802.

## Required surfaces
- Typography: locally hosted Noto Sans Thai 400/500/600; deliberate title wrapping, readable body, compact English eyebrows. Original brand wordmarks retained.
- Spacing/layout: photo-led split opening, paired botanical story, three image-led brand columns, compact community section. Single-column mobile layout; no clipped header or hero in the inspected 390px view.
- Colors: warm ivory, forest green, sage; original face photograph receives no color filters or edits. Keyboard focus styling retained.
- Imagery: owner and logos use unchanged source bytes. Three supporting botanical still lifes contain no people or fabricated product packages. Their role is mood imagery, not documentary farm evidence. Images have descriptive alt text.
- Copy: existing CMS sections retained. Empty product section omitted when there are no products. Demo preview intentionally retains its existing demo products; live data is not seeded or changed.

## Checks and limits
Existing 12 tests pass, including brand filtering/cart quantities and private admin drafts/publishing. Browser verified B-time brand link and mobile menu. No application errors observed; one extension metadata error is external to the app. Live Google authentication was not re-run; auth and server adapters are unchanged. Supporting image conversion reduced transfer size; generated image art direction is illustrative.

No P0/P1/P2 issues remain. Minor difference from image target: original person and photograph, actual logos, longer approved copy and retained origin strip require taller opening proportions; these are deliberate user/content constraints.
