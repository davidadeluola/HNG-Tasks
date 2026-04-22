# Stage 2 Invoice - Design System

This document defines the visual design system for the Stage 2 Invoice project.
It is based on the approved UI references for colors, typography, buttons, and form elements.

## Brand Direction

- Style: clean, modern, product-focused interface
- Tone: professional and confident
- Primary accent: violet
- Dual theme support: light and dark

## Color Tokens

### Primary

- `--color-primary-500`: `#7C5DFA` (RGB `124, 93, 250`; HSL `252, 94%, 67%`)
- `--color-primary-400`: `#9277FF` (RGB `146, 119, 255`; HSL `252, 100%, 73%`)

### Neutral (Light + UI Surfaces)

- `--color-navy-900`: `#1E2139` (RGB `30, 33, 57`; HSL `233, 31%, 17%`)
- `--color-navy-800`: `#252945` (RGB `37, 41, 69`; HSL `233, 30%, 21%`)
- `--color-bluegray-300`: `#7E88C3` (RGB `126, 136, 195`; HSL `231, 37%, 63%`)
- `--color-bluegray-200`: `#888EB0` (RGB `136, 142, 176`; HSL `231, 20%, 61%`)
- `--color-bluegray-100`: `#DFE3FA` (RGB `223, 227, 250`; HSL `231, 73%, 93%`)
- `--color-bg-light`: `#F8F8FB` (RGB `248, 248, 251`; HSL `240, 27%, 98%`)

### Neutral (Dark Theme)

- `--color-bg-dark`: `#141625` (RGB `20, 22, 37`; HSL `233, 30%, 11%`)
- `--color-bg-dark-deep`: `#0C0E16` (RGB `12, 14, 22`; HSL `228, 29%, 7%`)

### Semantic (Danger)

- `--color-danger-500`: `#EC5757` (RGB `236, 87, 87`; HSL `0, 80%, 63%`)
- `--color-danger-300`: `#FF9797` (RGB `255, 151, 151`; HSL `0, 100%, 80%`)

## Typography

- Font family: `League Spartan`

### Type Scale

- Heading L: `36px / 33px`, weight `700`, letter spacing `-1px`
- Heading M: `24px / 22px`, weight `700`, letter spacing `-0.75px`
- Heading S: `15px / 24px`, weight `700`, letter spacing `-0.25px`
- Heading S Variant: `15px / 15px`, weight `700`, letter spacing `-0.25px`
- Body: `13px / 18px`, weight `500`, letter spacing `-0.1px`
- Body Variant: `13px / 15px`, weight `500`, letter spacing `-0.25px`

## Buttons

The system uses rounded pill buttons with clear state handling.

- Primary CTA: New Invoice (icon + label), default and hover
- Primary Action: Mark as Paid, default and hover
- Secondary Action: Edit
  - Light theme: light background + muted text
  - Dark theme: dark background + light text
- Tertiary Action: Save as Draft
  - Light theme: dark text on medium-dark surface
  - Dark theme: light text on deep-dark surface
- Destructive Action: Delete, default and hover
- Utility Action: + Add New Item, default and hover

## Form Elements

Available in both light and dark themes:

- Text Field states: default, filled, active
- Dropdown states: default, hover, active, expanded list
- Date Picker states: default, disabled, active, calendar open

Behavior notes:

- Active fields use the primary violet border
- Hover states use subtle contrast increase
- Menus and date popovers use elevated surfaces with soft shadow

## Suggested CSS Tokens

```css
:root {
  --color-primary-500: #7c5dfa;
  --color-primary-400: #9277ff;

  --color-navy-900: #1e2139;
  --color-navy-800: #252945;
  --color-bluegray-300: #7e88c3;
  --color-bluegray-200: #888eb0;
  --color-bluegray-100: #dfe3fa;
  --color-bg-light: #f8f8fb;

  --color-bg-dark: #141625;
  --color-bg-dark-deep: #0c0e16;

  --color-danger-500: #ec5757;
  --color-danger-300: #ff9797;

  --font-family-base: "League Spartan", sans-serif;
}
```

## Implementation Notes

- Keep spacing and radii consistent across both themes.
- Ensure WCAG-friendly contrast on dark surfaces.
- Reuse token variables instead of hardcoding color values in components.
- Keep hover/active transitions subtle and fast (`120ms` to `180ms`).
