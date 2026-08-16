---
name: ui-ux-engineering
description: UI/UX engineering principles, micro-interactions, state feedback, progressive disclosure, cognitive load reduction, and accessibility.
---

# UI/UX Engineering & Interaction Design

## 1. Cognitive Load & Clarity
- **Progressive Disclosure**: Reveal complexity on-demand rather than overwhelming users with dense information upfront.
- **Immediate State Feedback**: Provide instant visual confirmation for all interactive elements (hover states, active clicks, focus outlines, copy-to-clipboard tooltips).
- **Affordance & Intent**: Buttons must look clickable, links must indicate destinations, and interactive controls must have accessible roles (`aria-label`, `aria-pressed`, `aria-selected`).

## 2. Accessibility (a11y) Best Practices
- Ensure complete keyboard navigability (logical `tabindex`, visible `:focus-visible` styling with `outline-offset`).
- Semantic HTML tags (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<button>`, `<svg aria-hidden="true">`).
- Minimum touch target size of 44x44px for mobile/tablet interactive controls.

## 3. Micro-Interaction Design
- Subtle button depressions on click (`transform: scale(0.97)`).
- Smooth hover elevation (`transform: translateY(-2px)` to `-4px`).
- Contextual badges and live status indicators with pulsing subtle glow effects.
