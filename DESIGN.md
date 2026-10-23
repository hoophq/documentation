# Hoop.dev Docs Design System

How the documentation looks, so it reads as one product with the website
(hoop.dev) and the webapp. One accent, flat surfaces, high-contrast type.

Source of truth: the live site and webapp tokens, plus the house rules of the
taste skill (`design-taste-frontend`). The theme is applied in `docs.json`
(colors, fonts) and `style.css` (accents, headings, surfaces).

---

## 1. Direction

Indigo accent on white. Near-black navy headings for impact. Inter for all
text, JetBrains Mono for code. Flat surfaces separated by a tone step or a
quiet 1px line, never a shadow. Square corners on boxes, panels and cards;
inputs, buttons and bordered icons are the exception — they are full pills.
Colour appears on one thing: the action, the link, the active item. Everything
else is ink and grey.

The docs are an **app screen**, not a marketing page: quiet borders, small
labels and repeated panels are normal; gradients, glows and icon-topped cards
are not.

---

## 2. Color

The accent is Radix **indigo**, the exact value the website and webapp use.

| Token | Hex | Role |
|-------|-----|------|
| Indigo 9 | `#3E63DD` | Primary. Active item, button, focus, card hover border |
| Indigo 11 | `#3A5BC7` | Link text on light |
| Indigo 3 | `#E6EDFE` | Inline code background, soft fill |
| Indigo 11 (dark) | `#9EB1FF` | Link + active on dark mode |

| Token | Hex | Role |
|-------|-----|------|
| Heading | `#0F1631` | Headings, strong text (navy near-black) |
| Body | `#1A1A1A` | Paragraphs, list items, table cells |
| Muted | `#6E6E6E` | Secondary notes, captions |
| Gray 100–400 | `#F7F7F7` `#EBEBEB` `#DEDEDE` `#C4C4C4` | Fills, borders, dividers, scrollbar |

`docs.json` carries the three Mintlify slots: `primary #3E63DD`,
`dark #3E63DD`, `light #8DA2EF` (the lighter shade for dark mode).

Rules:
- One accent. Indigo marks the action, the link and the active nav item, nothing else.
- Running text is in the full ink (`#1A1A1A`), never grey. Grey is for secondary notes only.
- Surfaces separate by a tone step or a 1px gray-200 line. No shadows at rest, no gradients.
- Status colours (success/warning/error/info) follow Mintlify's `<Note>`, `<Warning>`, `<Tip>` callouts; do not invent custom greens or reds.

---

## 3. Type

- **Inter** for every UI and body text. Set in `docs.json` `fonts` (heading 700, body 400).
- **JetBrains Mono** for code blocks and inline code.
- Headings carry `letter-spacing: -0.02em` and the navy heading colour.
- No monospace outside real code. No tiny uppercase letter-spaced labels except the component badges.

---

## 4. Components (Mintlify)

- **Code blocks**: dark (`docs.json` `styling.codeblocks: "dark"`), matching the webapp's dark query/output surfaces.
- **Inline code**: soft indigo tint (`#E6EDFE` bg, `#3A5BC7` text), like the webapp's `<Code>`.
- **Cards**: flat white, 1px gray-200 border, square corners, indigo border on hover. Never a shadow.
- **Sidebar**: active item in indigo text at weight 500; inactive in grey.
- **Tabs**: indigo active indicator.
- **Callouts** (`<Note>` / `<Warning>` / `<Tip>` / `<Info>`): keep Mintlify defaults; they already map to the semantic roles.

---

## 5. Never do

- A second accent, or indigo on anything that is not an action/link/active state.
- Grey running text, or a page set in soft grey.
- Gradients (backgrounds, buttons, text), glows, or shadows on resting surfaces.
- Icon-topped feature cards, rows of identical cards, or decorative shapes.
- Monospace labels, index numbering (01 / 02), or hairline divider boxes used as ornament.
- Pure `#FFFFFF` text on dark or `#000000` anywhere.
- Rounded corners on boxes, panels or cards — those stay square (circular avatars and status dots stay round; inputs, buttons and bordered icons are full pills).

> On the accent: the taste skill's generic house style bans indigo and
> gradients as "assistant palette" tells. Indigo here is not that — it is
> hoop's **existing brand**, the same `#3E63DD` the site and webapp ship. The
> skill's own rule for an existing brand is to keep the brand's colour and map
> it onto the accent role, which is what this system does.

---

## 6. Adapting the taste skill for support & customer docs

The taste skill (`design-taste-frontend`) is built for websites and app
screens, not Markdown docs. These parts of it transfer to support content and
customer-facing documents; the rest (the draw scripts, the browser inspector,
the imagery/motion floors) does not.

**Adapts directly — apply to every doc page:**

- **One accent, colour on meaning only.** Indigo on links and actions; ink and grey everywhere else. (`references/colour.md`, app-screens §1 "colour goes on data, not chrome".)
- **High-contrast type, two or three sizes.** Navy headings, full-ink body, one small grey for notes. No in-between greys. (`references/type.md`.)
- **Flat surfaces.** Separate panels and cards with a tone step or a 1px line, never a shadow or a gradient. (House rules; app-screens §3.)
- **Honest data in examples.** Real-looking values that add up, zeros shown as zeros, no `Acme` / `John Doe` / lorem. (app-screens §2.1, §2.5.)
- **No ornament tells.** Drop icon-topped cards, index numbers, hairline boxes, tiny tracked caps, emoji. (House rules table.)
- **Voice.** Direct, technical, 12–25 word sentences, no em dashes, no "seamless / robust / cutting-edge / next-generation / holistic". (`references/copy.md`.)
- **Tables are rules and alignment.** Numbers right-aligned with tabular figures, grey headers, no zebra striping, no header band. (app-screens §7.)

**Adapts with judgement — for richer HTML/PDF support artifacts (guides, one-pagers, status pages):**

- **Answer the reader's first question first, in large type.** The page's one job at the top. (SKILL.md run §4–5; app-screens §2.2.)
- **One dominant element per screen,** full-width content, equal margins, a heading on every section. (House rules; app-screens §4.)
- **States are honest** — empty, loading and error each keep their frame and say something real. (app-screens §11.)
- **Charts, when a support doc needs one,** follow app-screens §6: one series, 3–5 gridlines, one hue on the data, no rainbow, no gradient fill.

**Does not transfer — leave in the skill:**

- The direction draw (`draw.mjs`), the real-browser inspector/lint gate, the scroll scenes, the motion floor, and the imagery floor (4+ real photographs). Markdown docs render through Mintlify, so there is no page to inspect or animate and no hero to fill with pictures.
- The generic "no indigo / no gradient" palette ban — overridden by hoop's brand (§5 note).
