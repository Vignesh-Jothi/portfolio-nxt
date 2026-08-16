---
name: frontend-design
description: Modern frontend design system guidelines, UI tokens, visual hierarchy, glassmorphism, color harmony, and modern component architecture.
---

# Frontend Design Guidelines & Best Practices

## 1. Core Visual Principles
- **Visual Hierarchy**: Establish clear dominant, secondary, and tertiary focal points through scale, weight, and contrast rather than arbitrary sizing.
- **Curated Color Palettes**: Use semantic HSL/CSS custom property tokens. Maintain WCAG AA compliance (4.5:1 for normal text, 3:1 for large text).
- **Depth & Dimension**: Employ multi-layered subtle box-shadows, delicate border highlights (`rgba(255,255,255,0.08)` on dark mode, `rgba(0,0,0,0.08)` on light mode), and subtle backdrop blur (`backdrop-filter: blur(12px)`).
- **Micro-Textures**: Use subtle ambient radial gradients and mesh glows to elevate dark and light themes beyond flat solid colors.

## 2. Typography Rules
- Pair expressive display headers (`Bricolage Grotesque`, `Outfit`, `Inter`) with clean, highly legible body sans-serif fonts (`Plus Jakarta Sans`, `Inter`).
- Use fluid typography with `clamp()` for responsive headings without jumpy breakpoints.
- Maintain readable line lengths (60–75 characters per line max for body copy).

## 3. Modern CSS Architecture
- Use CSS Variables for all design tokens (colors, spacing, radii, elevations, timings).
- Favor modern CSS Grid and Flexbox with gap properties over negative margins and float hacks.
- Leverage CSS `color-mix()` for consistent tonal variations.
