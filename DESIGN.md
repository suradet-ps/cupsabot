# Design System

> Single source of truth for the cupsabot UI. Tokens live in
> `src/assets/css/tokens/*`, the global component layer lives in
> `src/assets/main.css`.

## Overview

The system follows **Clay's** design structure — a warm cream canvas, near-black
ink, big rounded display type, and **saturated single-color feature cards** as the
primary visual element — rendered in the **Monchhichi** palette: fur brown, rosy
pink, powder blue, peach, ochre, and lavender.

Depth is flat. There are no heavy shadows: structure comes from 1px hairlines and
the contrast between the cream canvas and bright feature cards. Color is used
deliberately — the saturated cards carry the brand voltage, while the working UI
stays quiet and high-contrast.

**Key characteristics**

- Cream-tinted canvas (`#fffaf0`) everywhere, including the sidebar and footer.
- Near-black primary CTAs (`#1a120b`), rounded 12px — friendly, not pill.
- 6-color saturated feature-card palette for KPIs and highlights.
- Rounded display type at weight 500 with negative letter-spacing.
- Generous radii: 12px buttons/inputs, 16px cards, 24px feature cards.
- Flat surfaces: 1px hairlines, no card shadows.
- 44px control targets (WCAG), visible focus, `prefers-reduced-motion` support.

## Colors

### Brand & accent

- **Primary / Ink** (`#1a120b`): primary CTAs, headings, body text.
- **Brown** (`#8a5a34`): Monchhichi fur accent, hover states.
- **Pink** (`#ff6fa5`): rosy-cheek accent, brand marks, active signals.
- **Blue** (`#6e9bc9`): powder-blue gingham secondary accent.

### Saturated feature-card palette

| Token | Hex | Text on fill |
|---|---|---|
| `brand-pink` | `#ff6fa5` | white |
| `brand-teal` | `#2f4a44` | white |
| `brand-lavender` | `#c3b2f0` | ink |
| `brand-peach` | `#ffb98f` | ink |
| `brand-ochre` | `#efc25a` | ink |
| `brand-mint` | `#a9d8c6` | ink |

### Surface

- **Canvas** (`#fffaf0`): the default page floor.
- **Surface Soft** (`#faf5e8`): sidebar, table headers, footer bands.
- **Surface Card** (`#f5f0e0`): cream cards, hover fills.
- **Surface Strong** (`#ebe6d6`): stronger cream.
- **Hairline** (`#e8e2d2`): 1px borders on cards, inputs, and rules.
- **White** (`#ffffff`): panels and tables that must read as content.

### Text

- **Ink** (`#1a120b`): headlines and primary text.
- **Muted** (`#6a6558`): sub-headings, captions, metadata.
- **Slate** (`#8a8578`): fine-print and tertiary labels.

### Semantic

- **Focus** (`#1a120b`): focus ring.
- **Error** (`#d0342c`), **Warning** (`#b45309`), **Success** (`#1f8a4c`).

### Status

| Status | Foreground | Background | Thai label |
|---|---|---:|---|
| Draft | `#6a6558` | `#f0ead9` | ฉบับร่าง |
| Submitted | `#b45309` | `#fdf0d9` | รออนุมัติ |
| Approved | `#3f6fb0` | `#eaf2fb` | อนุมัติแล้ว |
| Fulfilled | `#1f8a4c` | `#e8f4ec` | จ่ายยาแล้ว |
| Rejected | `#d0342c` | `#fdeceb` | ถูกปฏิเสธ |

## Typography

- **Display / Body / UI**: `Inter`, falling back to `Noto Sans Thai`,
  `ui-sans-serif`, `system-ui`. Inter at weight 500 with negative tracking is the
  documented substitute for the licensed rounded display face.
- **Numeric / labels**: system monospace is avoided; numbers use
  `font-variant-numeric: tabular-nums`.

| Role | Size | Weight | Letter spacing |
|---|---:|---:|---:|
| Display XL | 72px | 500 | -2.5px |
| Display LG | 56px | 500 | -2px |
| Display MD | 40px | 500 | -1px |
| Display SM | 32px | 500 | -0.5px |
| Title LG | 24px | 600 | -0.3px |
| Title MD | 18px | 600 | 0 |
| Body LG | 16px | 400 | 0 |
| Body | 15px | 400 | 0 |
| Caption | 13px | 400 | 0 |
| Micro / uppercase label | 12px | 600 | +1.5px |
| Button | 14px | 600 | 0 |

Inputs render at **16px** to prevent iOS Safari from zooming on focus.

## Layout

### Spacing

4px base unit, exposed as `--space-*` (`4, 6, 8, 10, 12, 16, 20, 24, 32, 40,
48, 56, 64, 80, 96`). Editorial bands use `--space-24` (96px).

### Container & grid

- `.container` is `max-width: 1280px`, centred, with responsive padding.
- `.feature-grid` lays out saturated KPI cards (`auto-fit, minmax(220px, 1fr)`).
- Data views use full-width tables inside `.panel` / `.table-wrapper`.

### Page structure

1. `.page-header` — one `h1`, optional subtitle/icon, and the primary action
   (rendered via `<PageHeader>`).
2. Optional filters/search in a `.card.toolbar`.
3. Content in `.panel` blocks (header + body).
4. Explicit loading, empty, error, and success states.

## Elevation

| Level | Treatment | Use |
|---|---|---|
| Flat | No shadow, cream field | Page background, nav, hero |
| Hairline | 1px `#e8e2d2` | Cards, panels, inputs, tables |
| Saturated | Brand-color fill, no shadow | Feature / KPI cards |
| Overlay | `--shadow-overlay` | Modals, dropdowns, toasts |

## Shapes

| Token | Value | Use |
|---|---:|---|
| `xs` | 6px | Small badges, dropdown items |
| `sm` | 8px | Small buttons, chips |
| `md` | 12px | Buttons, inputs |
| `lg` | 16px | Cards, panels, tables |
| `xl` | 24px | Feature cards |
| `pill` | 9999px | Status badges, category tabs |

## Components

Defined globally in `src/assets/main.css`; behavioral components are Vue SFCs in
`src/components/`.

- **Buttons** (`.btn`): near-black `btn-primary`, cream `btn-secondary`,
  `btn-on-color` (white, for use over saturated cards), `btn-ghost`,
  `btn-danger/warning/success/info`, `btn-pill-outline`, `btn-sm`. All 44px tall
  (36px for `btn-sm`).
- **Feature cards** (`.feature-card` + `--pink|--teal|--lavender|--peach|--ochre|
  --mint|--cream`): saturated KPI surfaces with `feature-label`, `feature-value`,
  `feature-caption`.
- **Panels** (`.panel`, `.panel-header`, `.panel-title`, `.panel-count`,
  `.panel-body`): hairline-bordered content containers.
- **Tables** (`.table-wrapper`): sticky header on Surface Soft, hairline row
  dividers, right-aligned tabular numerals, `.table--compact` density option.
- **Status badges**: pill with a leading dot; rendered through `<StatusBadge>`.
- **Forms**: 44px controls, 12px radius, canvas fill, labelled fields with
  `.form-hint` / `.form-error`.
- **States**: `.loading`, `.alert--*`, `.empty-state`, `.skeleton`, toasts
  (`<ToastHost>`), and a focus-trapped confirm dialog (`<ConfirmDialog>`).

## Navigation

- **Admin**: flat cream sidebar (Surface Soft, hairline right border) with
  grouped nav and a near-black active pill; collapsible to an icon-only rail
  (persisted in `localStorage`). A flat 64px cream top bar carries the collapse
  toggle, breadcrumb, and user chip.
- **PCU**: flat cream top nav with brand, dashboard link, and user chip.
- A `.skip-link` targets `#main-content` on every layout.

## Accessibility

- Target WCAG 2.2 AA. Interactive targets are ≥ 44px.
- Every control is keyboard-operable with a visible focus indicator.
- Form controls have associated labels; icon-only buttons have `aria-label`.
- Modals use `role="dialog"`, focus trapping, Esc, and focus restore.
- Status is never conveyed by colour alone (label + dot + tint).
- `prefers-reduced-motion` disables animation and smooth scrolling.

## Do's and Don'ts

### Do

- Anchor every page on the cream canvas; never a cool gray.
- Cycle the saturated feature-card colors; don't repeat one twice in a row.
- Keep display type at weight 500 with negative tracking.
- Use the design tokens for every color, space, radius, and shadow.
- Provide loading, empty, error, and success states for async work.

### Don't

- Don't add card shadows — use hairlines and saturated fills for depth.
- Don't bold display type beyond 500.
- Don't use a dark sidebar or footer; keep the palette warm-throughout.
- Don't hardcode colors or spacing; use tokens.
- Don't rely on colour alone to signal state.
