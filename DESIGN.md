# Design System

> Single source of truth for the cupsabot UI. Tokens live in
> `src/assets/css/tokens/*`, the global component layer lives in
> `src/assets/main.css`.

## Overview

The system is called **Clinical Calm**: a professional, high-contrast
healthcare palette built on a cool neutral canvas with an indigo primary
and a rose accent. It is designed for long administrative sessions and
dense data tables, so clarity, contrast, and predictable interaction
states win over decoration.

The visual language is flat and quiet. Depth comes from layered shadows,
thin borders, and surface alternation rather than heavy gradients. The
brand blue-rose gradient is reserved for identity moments (brand marks,
auth hero panels, the admin sidebar) — never for body text or as the sole
carrier of meaning.

**Key characteristics**

- Cool neutral canvas (`#f6f7f9`) with white surfaces for content.
- Solid indigo primary actions for reliable contrast and focus states.
- Rose accent used sparingly for brand warmth and the sidebar active marker.
- Flat cards with soft, layered shadows and 12px radii.
- Sticky table headers, tabular numerals, and pale-blue row hover.
- Status is always communicated with a label + colour + dot, never colour alone.
- Accessible by default: visible focus rings, 40px control targets, labelled
  inputs, and `prefers-reduced-motion` support.

## Colors

### Brand & accent

- **Primary / Blue** (`#3b5bdb`): primary actions, links, active states.
- **Primary Hover** (`#2f4bc0`): hover/pressed for primary actions.
- **Light Blue** (`#e2e8fb`) / **Pale Blue** (`#eef2fc`): soft blue surfaces.
- **Pink** (`#d6336c`): brand accent, sidebar active marker.
- **Pink Hover** (`#c2255c`), **Light Pink** (`#fce4ec`).

### Surface & background

- **Canvas** (`#f6f7f9`): page background.
- **Surface** (`#ffffff`): cards, tables, inputs, header.
- **Soft Stone** (`#eef0f3`): table headers, disabled states.
- **Card Border** (`#e5e8ee`), **Hairline** (`#dde1e7`), **Border Light** (`#eaedf1`).

### Text & rules

- **Ink** (`#1b2330`): primary text (≈15:1 on canvas).
- **Muted Slate** (`#5b6675`): secondary text (≈5.4:1 on white).
- **Slate** (`#6b7686`): tertiary text and icons.

### Semantic

- **Focus** (`#3b5bdb`): focus ring colour.
- **Error** (`#c92a2a`): validation and destructive actions.

### Status

Each status defines a foreground, a soft background, and a boundary tint.

| Status | Foreground | Background | Thai label |
|---|---|---:|---|
| Draft | `#5b6675` | `#eef0f3` | ฉบับร่าง |
| Submitted | `#b45309` | `#fef3e2` | รออนุมัติ |
| Approved | `#3b5bdb` | `#eef2fc` | อนุมัติแล้ว |
| Fulfilled | `#2f8f4e` | `#e6f4ea` | จ่ายยาแล้ว |
| Rejected | `#c92a2a` | `#fdecec` | ถูกปฏิเสธ |

### Gradients (identity only)

- **Primary** (`#3b5bdb → #5c7cfa`): brand marks.
- **Hero** (`#e2e8fb → #fce4ec → #ffffff`): auth hero panels.
- **Sidebar** (`#1e2a4a → #232f52 → #2b2650`): admin sidebar.

## Typography

- **Display / Body**: `Inter`, falling back to `Noto Sans Thai`,
  `ui-sans-serif`, `system-ui`.
- **Mono**: system monospace for badges, labels, and numeric data.

| Role | Size | Weight | Line height |
|---|---:|---:|---:|
| Section heading (`h1`) | 30px | 600 | 1.25 |
| Card heading (`h2`) | 24px | 600 | 1.25 |
| Feature heading (`h3`) | 18px | 600 | 1.25 |
| Body large | 16px | 400 | 1.6 |
| Body | 15px | 400 | 1.5 |
| Caption | 14px | 400 | 1.5 |
| Micro / label | 12px | 600 (uppercase, +0.4px) | 1.5 |

Inputs render at **16px** to prevent iOS Safari from zooming on focus.
Large numbers use `font-variant-numeric: tabular-nums` for alignment.

## Layout

### Spacing

An 8px base scale exposed as `--space-*` tokens (`2, 6, 8, 10, 12, 16,
20, 22, 24, 28, 32, 36, 40, 56, 60, 64, 80`).

### Container & grid

- `.container` is `max-width: 1180px`, centred, with responsive padding.
- Lists of cards use `repeat(auto-fill, minmax(...))` grids.
- Dashboards use `.stat-grid`, reports use full-width tables inside
  `.table-wrapper`.

### Page structure

Every authenticated page follows the same rhythm:

1. `.page-header` — one `h1` title, optional icon/subtitle, and a single
   primary action rendered via `<PageHeader>`.
2. Optional filters/search in a `.card.toolbar`.
3. Content — tables, cards, or form.
4. Explicit loading, empty, error, and success states.

## Elevation

| Level | Treatment | Use |
|---|---|---|
| Flat | No shadow, canvas field | Page background, empty states |
| Card | `--shadow-card` + 1px border | Cards, panels |
| Raised | `--shadow-raised` | Hover on interactive cards |
| Overlay | `--shadow-overlay` | Modals, dropdowns, toasts |

## Shapes

| Token | Value | Role |
|---|---:|---|
| `xs` | 6px | Inputs, small controls |
| `sm` | 8px | Buttons, chips, icon buttons |
| `md` | 12px | Cards, tables, stat tiles |
| `lg` | 16px | Modals, large media |
| `pill` | 9999px | Status badges, toggles |

## Components

All components are defined globally in `src/assets/main.css`; shared
behavioral components are Vue SFCs under `src/components/`.

### Buttons (`.btn` + modifier)

`btn-primary`, `btn-secondary`, `btn-ghost`, `btn-danger`, `btn-warning`,
`btn-success`, `btn-info`, `btn-pill-outline`, and `btn-sm`. All buttons
have a 40px minimum height (32px for `btn-sm`), a 2px offset focus ring,
a subtle press state, and a disabled state.

### `.card`

White, 1px border, `radius-md`, `--shadow-xs`, 24px padding. `.card--flush`
removes padding for table cards.

### `.table-wrapper`

Rounded, bordered, horizontally scrollable container. Headers are sticky
with an uppercase micro label on Soft Stone; rows hover to Pale Blue;
`tfoot` is emphasised for totals.

### `.status-badge`

Pill with a leading dot, uppercase micro text, and one of the status
variants. Rendered through `<StatusBadge :status="..." />`, which maps the
raw database enum to a Thai label.

### Forms

`.form-group` wraps a `label`, control, and optional `.form-hint` /
`.form-error`. Inputs are 40px tall, hover/focus/disabled states are
token-driven, and invalid inputs use `[aria-invalid="true"]`.

### States

- `.loading` — inline spinner with a message.
- `.alert--error|success|info|warning` — contextual inline messages.
- `.empty-state` — dashed container with icon, title, and guidance.
- `.skeleton` — shimmer placeholder for loading data.
- Toasts (`<ToastHost>`) — transient feedback for async actions.
- Confirm dialog (`<ConfirmDialog>`) — promise-based, focus-trapped,
  keyboard-dismissible replacement for native `confirm()`.

### Navigation

- **Admin**: fixed dark-gradient `.sidebar` with grouped nav and an active
  accent bar; sticky `.top-header` with user zone and logout.
- **PCU**: sticky white `.navbar` with brand, dashboard link, and user zone;
  collapses to a dropdown under 820px.
- A `.skip-link` targets `#main-content` on every layout.

## Accessibility

- Target: WCAG 2.2 AA.
- Every interactive element is reachable and operable by keyboard with a
  visible focus indicator.
- Form controls have associated labels; icon-only buttons have `aria-label`.
- Modals use `role="dialog"`, `aria-modal`, focus trapping, Esc to close,
  and restore focus to the trigger.
- Status is never conveyed by colour alone.
- `prefers-reduced-motion` disables animation and smooth scrolling.
- Body text meets ≥ 4.5:1 contrast; UI boundaries and large text meet ≥ 3:1.

## Motion

`--duration-fast` (120ms), `--duration-base` (180ms), `--duration-slow`
(280ms) with `cubic-bezier(0.2, 0, 0, 1)`. Animation is functional only.

## Do's and Don'ts

### Do

- Keep one primary action per screen, placed in the page header.
- Use the design tokens for every colour, space, radius, and shadow value.
- Provide loading, empty, error, and success states for async work.
- Use `<StatusBadge>` and `<PageHeader>` for consistency.
- Replace `alert()`/`confirm()` with the toast and confirm-dialog systems.

### Don't

- Don't hardcode colours or spacing; use tokens.
- Don't use the brand gradient for body text or as the only signal of state.
- Don't rely on colour alone to communicate status or errors.
- Don't remove focus outlines or add modals without focus management.
