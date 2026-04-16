# Design System: Planing Poker
**Project ID:** 16760718228231401515

## 1. Visual Theme & Atmosphere
The design system, titled **"The Digital Curator,"** focuses on a high-end gallery aesthetic. It emphasizes **Intentional Asymmetry** and **Tonal Depth**, rejecting cluttered grids in favor of expansive white space ("breathing room"). The interface feels calm, authoritative, and expensive, using layered neutrals and a surgical application of brand colors.

## 2. Color Palette & Roles
- **Electric Red (#E2001A):** The signature brand color. Used exclusively as a laser-focused tool for direction and action (CTAs), never for decoration.
- **Deep Academic Red (#B40012):** Used for primary buttons and focus states.
- **Gallery White (#F9F9F9):** The primary base layer background (`surface`).
- **Soft Stone Grey (#F3F3F3):** Used for subtle content grouping and insets (`surface-container-low`).
- **Pure Canvas White (#FFFFFF):** Used for primary cards or interactive elements to make them "pop" (`surface-container-lowest`).
- **Utility Grey (#E8E8E8):** Used for utility bars or secondary navigation (`surface-container-high`).
- **Soft Charcoal (#1A1C1C):** Used for text (`on-surface`) to maintain a soft, premium contrast instead of pure black.

## 3. Typography Rules
- **Headline Font (Manrope):** Modern, geometric, and high-end tech aesthetic. Used for Display and Headline scales.
- **Body Font (Inter):** Chosen for mathematical precision and exceptional readability. Used for Title, Body, and Label styles.
- **Hierarchy:** High-contrast scale. Massive headlines (tight tracking) contrasted with generous body leading (150%).

## 4. Component Stylings
- **Buttons:** 
  - **Primary:** Gradient fill (Deep Academic Red to Electric Red at 135°), medium roundedness (0.75rem), white text.
  - **Secondary:** Utility Grey background with Soft Charcoal text.
  - **Tertiary:** Pure text with a 2px underline in Electric Red, offset by 4px.
- **Cards/Containers:** 
  - **Style:** "No-Line" rule. Boundaries are defined by background color shifts, not borders.
  - **Shape:** Generous rounded corners (1rem).
  - **Depth:** Tonal layering instead of shadows. A Pure Canvas White card on a Soft Stone Grey background creates a "soft lift."
- **Inputs/Forms:** 
  - **Style:** "Minimalist Tray." Filled style with Utility Grey background and a bottom-only 2px "Ghost Border" that transitions to Deep Academic Red on focus.

## 5. Layout Principles
- **Mobile-First 8pt System:** All spacing and sizing is based on 8px increments.
- **Breathing Space:** Minimum 24px (3rem) side margins on mobile. If padding feels sufficient, add 16px more.
- **Editorial Offset:** On desktop, content is shifted 10% to the left to leave a "margin of notes" on the right.
- **No Dividers:** Horizontal lines are forbidden. Use 8px of vertical white space and background shifts for separation.
