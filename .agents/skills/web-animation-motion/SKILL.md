---
name: web-animation-motion
description: Guidelines for high-performance 60fps CSS transitions, keyframes, scroll reveals, reduced motion handling, and interactive UI motion.
---

# Web Animation & Motion Principles

## 1. High Performance Motion (60fps / 120fps)
- Animate only composite-friendly properties: `transform` and `opacity`. Avoid animating `height`, `width`, `top`, `margin`, or `padding` which trigger layout recalculations.
- Utilize `will-change` sparingly on active animations to promote elements to hardware-accelerated compositor layers.

## 2. Timing & Easing Curves
- Standard UI interactions: `150ms - 250ms` with `cubic-bezier(0.16, 1, 0.3, 1)` (smooth deceleration) or `ease-out`.
- Modal/Drawer entries: `280ms - 350ms`.
- Staggered lists / terminal reveals: 50ms - 150ms sequential delays for polished flow.

## 3. Accessibility & Motion Preference
- Always honor `prefers-reduced-motion: reduce`:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```
