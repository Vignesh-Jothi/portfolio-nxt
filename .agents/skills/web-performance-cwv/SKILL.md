---
name: web-performance-cwv
description: Core Web Vitals optimization, INP, LCP, CLS, rendering smoothness, asset preloading, and runtime efficiency.
---

# Web Performance & Core Web Vitals (CWV)

## 1. Largest Contentful Paint (LCP)
- Ensure critical fonts use `font-display: swap`.
- Avoid heavy blocking JavaScript during initial paint.
- Preconnect to CDN / font origins.

## 2. Cumulative Layout Shift (CLS)
- Always specify explicit `aspect-ratio` or `width`/`height` attributes on media elements.
- Reserve layout space for dynamically injected components or asynchronous logs.

## 3. Interaction to Next Paint (INP) & Main Thread
- Keep JavaScript event handlers non-blocking.
- Use `requestAnimationFrame` or `setTimeout` chunking for multi-element DOM updates (e.g. terminal step sequences).
