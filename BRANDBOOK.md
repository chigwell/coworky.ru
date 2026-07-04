# Coworky Visual Brandbook

This document describes the current Coworky web visual language: colors, typography, spacing, surfaces, buttons, and interaction rules. It is based on the production styles in `src/styles/home.css` and `src/styles/download.css`.

## Brand Direction

Coworky should feel like a focused desktop productivity tool for document-heavy work. The interface is calm, precise, and modern, with soft glass surfaces, restrained borders, and a clear indigo accent. Avoid decorative noise, heavy illustration, loud gradients, and overly playful UI patterns.

Core attributes:

- Clear and work-focused.
- Light, spacious, and readable.
- Technical but approachable.
- Premium through restraint, not decoration.
- Optimized for scanning, repeated use, and quick decisions.

## Logo And Brand Mark

The brand lockup uses a compact square image mark followed by the Coworky wordmark.

- Brand mark size: `34px x 34px`.
- Brand mark radius: `10px`.
- Wordmark size: `18px`.
- Wordmark weight: `520`.
- Wordmark letter spacing: `-0.45px`.
- Brand gap: `10px`.

Use the logo inside navigation and compact product surfaces. Do not stretch, recolor, or place the mark inside extra decorative containers.

## Color System

### Primary Palette

| Token | Hex | Usage |
| --- | --- | --- |
| `--color-indigo-ink` / `--accent` | `#533AFD` | Primary actions, links, active indicators, accent dots |
| `--color-indigo-hover` / `--accent-hover` | `#7389FF` | Primary hover states, gradient highlights |
| `--color-midnight-ink` / `--text-primary` | `#061B31` | Main text in light theme |
| `--color-slate` / `--text-secondary` | `#64748D` | Supporting copy |
| `--color-steel` / `--text-muted` | `#50617A` | Muted metadata and notes |
| `--color-smoke` | `#839BC8` | Muted text in dark theme |
| `--color-good` | `#0F8A5F` | Positive status only |

### Light Theme Surfaces

| Token | Value | Usage |
| --- | --- | --- |
| `--surface-canvas` | `#FFFFFF` | Page background |
| `--surface-band` | `#F8FAFD` | Section bands and footer |
| `--surface-card` | `rgba(255, 255, 255, 0.82)` | Glass cards and nav |
| `--surface-card-solid` | `#FFFFFF` | Solid inner panels |
| `--surface-soft` | `#EEF3FF` or `#E8E9FF` | Soft accent backgrounds |
| `--surface-inverted` | `#061B31` | Inverted elements |
| `--border` | `#E5EDF5` | Default borders and grid lines |
| `--border-strong` | `#D6D9FC` or `#B9B9F9` | Prominent borders and ghost buttons |

### Dark Theme Surfaces

| Token | Value | Usage |
| --- | --- | --- |
| `--surface-canvas` | `#070A16` | Dark page background |
| `--surface-band` | `#0D1225` | Dark section bands |
| `--surface-card` | `rgba(13, 18, 37, 0.74)` | Dark glass cards |
| `--surface-card-solid` | `#0D1225` | Solid dark inner panels |
| `--surface-soft` | `rgba(83, 58, 253, 0.16-0.20)` | Soft accent background |
| `--text-primary` | `#F8FAFD` | Main text in dark theme |
| `--text-secondary` | `#AAB9D6` | Supporting copy in dark theme |
| `--text-muted` | `#839BC8` | Muted metadata |
| `--border` | `rgba(185, 185, 249, 0.18)` | Default dark borders |
| `--border-strong` | `rgba(185, 185, 249, 0.38)` | Prominent dark borders |
| `--accent` | `#8F7DFF` | Dark theme accent |
| `--accent-hover` | `#B9B9F9` | Dark theme hover accent |

### Color Usage Rules

- Use indigo only for primary actions, active states, links, dots, and small emphasis.
- Use muted slate tones for long copy and secondary information.
- Keep page backgrounds mostly white or near-black depending on theme.
- Use soft accent fills sparingly behind badges, icons, chips, and hover states.
- Do not create large one-color sections dominated by indigo or violet.
- Keep gradients subtle. Approved gradients are text gradients and very soft background lighting.

## Typography

### Font Family

Primary font stack:

```css
Inter Tight, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
"Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif
```

Global rendering:

```css
text-rendering: optimizeLegibility;
-webkit-font-smoothing: antialiased;
font-feature-settings: "ss01" 1, "tnum" 1;
```

Use tabular numbers for prices, counters, model costs, and usage data.

### Base Text

| Element | Size | Line height | Weight | Letter spacing |
| --- | --- | --- | --- | --- |
| Body | `16px` | `1.5` | default | `-0.16px` |
| Navigation links | `14px` | default | default | `-0.14px` |
| Footer text | `13-14px` | `1.55` | default | default |
| Metadata/chips | `11-13px` | compact | `460-520` when needed | `0.08em` for uppercase labels |

### Heading Scale

| Role | CSS | Usage |
| --- | --- | --- |
| Hero H1 | `clamp(46px, 7.2vw, 88px)` | Main homepage headline |
| Download H1 | `clamp(44px, 8vw, 82px)` | Download page headline |
| Section title | `clamp(34px, 4.6vw, 56px)` | Major content sections |
| Download card title | `clamp(30px, 4vw, 44px)` | OS download cards |
| Card title | `25px` | Feature, scenario, payment, FAQ cards |
| Workflow title | `22px` | Step titles |
| Model title | `20px` | Pricing model cards |

Heading rules:

- Use very light heading weights: `330-380`.
- Use tight heading tracking: usually `-0.035em` to `-0.055em`.
- Hero line height should be compact: around `0.96-0.97`.
- Section titles use line height around `1.02-1.08`.
- Do not use bold, heavy display typography for marketing impact.

### Hero Copy And Section Copy

Hero copy:

- Size: `clamp(19px, 2vw, 24px)`.
- Line height: `1.34-1.35`.
- Weight: `330`.
- Letter spacing: `-0.025em`.
- Color: `--text-secondary`.

Section copy:

- Size: `clamp(18px, 2vw, 22px)`.
- Weight: `330`.
- Letter spacing: `-0.025em`.
- Color: `--text-secondary`.

Keep copy short and concrete. Write about work outcomes, documents, files, pricing, and usage. Avoid abstract AI hype.

## Buttons

Buttons are rounded pills with compact typography and subtle movement.

### Base Button

```css
display: inline-flex;
align-items: center;
justify-content: center;
min-height: 48px;
gap: 9px;
border-radius: 999px;
padding: 14px 22px;
border: 1px solid transparent;
font-size: 14px;
font-weight: 460;
letter-spacing: -0.14px;
white-space: nowrap;
transition: border-color 160ms ease, color 160ms ease, background 160ms ease, transform 160ms ease;
```

Hover behavior:

```css
transform: translateY(-1px);
```

### Button Variants

| Variant | Text | Background | Border | Hover |
| --- | --- | --- | --- | --- |
| Primary | `#FFFFFF` | `--accent` / `#533AFD` | transparent | Background changes to `--accent-hover` |
| Ghost | `--accent` | transparent or translucent canvas | `--border-strong` | Border becomes `--accent`, background becomes `--surface-soft` |
| Soft | `--text-primary` | `--surface-card` | `--border` | Text becomes `--accent`, border becomes `--border-strong` |
| Theme toggle | `--text-primary` | transparent | `--border` | Text becomes `--accent`, background becomes `--surface-soft` |

### Navigation Buttons

Navigation buttons are smaller:

- Min height: `40px`.
- Padding: `10px 16px`.
- Font size: `13px`.
- Radius: `999px`.

### Button Rules

- Use primary buttons for the main conversion action only: purchase, download, or start.
- Use ghost buttons for secondary actions.
- Use soft buttons for low-priority actions or mobile-only shortcuts.
- Pair icons with text only when the icon clarifies the action.
- Keep labels short and action-oriented.
- Do not use rectangular buttons for primary UI actions.

## Surfaces, Cards, And Layout

### Page Layout

| Token | Value |
| --- | --- |
| Homepage max width | `1320px` |
| Download page max width | `1120px` |
| Container width | `min(calc(100% - 40px), var(--page-max-width))` |
| Mobile container width | `min(calc(100% - 28px), var(--page-max-width))` |
| Top body padding | `92px` |

The site uses a fixed glass navigation bar and generous vertical spacing. Main sections should breathe, but content should remain practical and scannable.

### Navigation Bar

- Fixed at top with `12px` offset.
- Min height: `64px`.
- Radius: `24px`.
- Padding: `10px 12px`.
- Border: mixed `--border-strong`.
- Background: layered translucent surface gradients.
- Backdrop blur: `28px` with saturation.
- Shadow: soft indigo-tinted elevation.

### Cards

Common card behavior:

- Border: `1px solid var(--border)`.
- Radius: `22px` for most cards.
- Background: `--surface-card`.
- Larger download cards may use `26px`.
- App preview windows may use `28px`.
- Use `--shadow-soft` for elevated product/demo panels.

Do not nest visual cards inside other cards unless the nested element is a real interface mockup or data panel. Keep repeated cards consistent in padding, border, and typography.

### Shadows

Primary soft shadow:

```css
0 24px 80px rgba(83, 58, 253, 0.12)
```

Dark theme shadow:

```css
0 24px 80px rgba(0, 0, 0, 0.28)
```

Use shadows to lift important panels, not every element.

## Badges, Chips, And Labels

### Eyebrow Labels

Eyebrows are uppercase pill labels used above hero and section titles.

- Display: inline flex.
- Gap: `8px`.
- Radius: `999px`.
- Padding: `7px 11px`.
- Font size: `12px`.
- Letter spacing: `0.08em-0.09em`.
- Text transform: uppercase.
- Text color: `--accent`.
- Background: `--surface-card`.
- Border: `--border`.

Accent dot:

- Size: `7px x 7px`.
- Radius: `999px`.
- Background: `--accent`.
- Ring: `0 0 0 5px color-mix(in srgb, var(--accent) 16%, transparent)`.

### Chips

Use chips for model labels, metadata, prices, and small status tags.

- Radius: `999px`.
- Font size: `11-12px`.
- Uppercase labels use `0.08em` letter spacing.
- Background should be `--surface-soft` or a subtle mixed band surface.
- Avoid loud fills.

## Icons

Icons are line-based, compact, and functional.

- Button icons: `18px x 18px`.
- Feature icons: placed inside soft square containers.
- OS icons: `58px x 58px` container on download page, radius `18px`.
- Feature icon containers: radius around `14px`.

Use `currentColor` for SVG icons so they inherit the component color. Keep stroke widths around `1.6-1.7`.

## Motion And Interaction

Motion is minimal and responsive.

- Standard duration: `160ms`.
- Standard easing: `ease`.
- Hover lift: `translateY(-1px)`.
- Hover changes should affect color, background, border, or transform.
- Avoid large animated transitions, bouncing, or decorative motion.

## Backgrounds

Page backgrounds combine a clean canvas with very soft radial lighting and a subtle grid.

Light homepage example:

```css
radial-gradient(circle at 16% 8%, rgba(83, 58, 253, 0.12), transparent 32rem),
radial-gradient(circle at 78% 12%, rgba(115, 137, 255, 0.14), transparent 26rem),
linear-gradient(180deg, var(--surface-canvas), var(--surface-canvas))
```

Grid overlay:

- Grid size: `56px x 56px`.
- Opacity: `0.22`.
- Mask fades from top to transparent.

Use these backgrounds for depth, but keep them quiet enough that text and product UI remain the focus.

## Content Voice

Coworky copy should be direct, grounded, and office-work oriented.

Use:

- Concrete document types: Excel, Word, PDF, presentations, project folders.
- Clear outcomes: compare, summarize, find risks, prepare a reply, calculate cost.
- Practical pricing language: balance, usage, top-up, pay for actual work.

Avoid:

- Generic AI promises.
- Buzzwords without examples.
- Overly emotional or playful phrasing.
- Long explanatory paragraphs inside UI surfaces.

## Implementation Checklist

When adding new UI, check that it follows these rules:

- Uses `Inter Tight` through `--font-sans`.
- Uses existing color tokens instead of new hardcoded colors.
- Supports both light and dark theme tokens.
- Uses pill buttons with the existing `.button` variants.
- Keeps heading weights light and letter spacing tight.
- Uses `--surface-card`, `--surface-soft`, and `--border` for cards and panels.
- Keeps hover transitions at `160ms`.
- Uses indigo as an accent, not as a dominant page color.
- Keeps copy specific to document workflows and usage-based pricing.
