---
name: responsive-design-systems
description: Guidelines for multi-device responsive design, fluid layouts, container queries, mobile touch ergonomics, and cross-browser resilience.
---

# Responsive Design Systems & Multi-Screen Ergonomics

## 1. Fluid Layouts & Sizing
- Use CSS `clamp()` for fluid font-sizes and spacing: e.g. `font-size: clamp(2rem, 4vw + 1rem, 3.5rem)`.
- Use CSS Grid `auto-fit` / `auto-fill` with `minmax()` for self-adjusting responsive card grids without rigid media query breakpoints.

## 2. Breakpoint Conventions
- Mobile: `< 640px` (Single column, stacked controls, full-width touch targets).
- Tablet / Small Laptop: `641px - 1024px` (Adapted grids, adjusted gaps).
- Desktop: `1025px - 1440px` (Full multi-column layout, max-width wrapper).
- Wide: `> 1440px` (Centered container, preserved visual proportion).

## 3. Touch Ergonomics
- Ensure interactive elements are spaced to prevent mis-clicks.
- Place primary mobile actions within thumb reach zone.
