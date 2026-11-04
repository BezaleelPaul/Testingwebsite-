# Portfolio Redesign Implementation Brief

Target branch: `New-main`
Repository: `BezaleelPaul/bezaleelpaul.github.io`

## Objective

Unify the existing portfolio into one coherent, cinematic space-exploration experience while keeping it fast, accessible, recruiter-friendly, and maintainable. This is an enhancement of the existing application, not a rewrite.

## Required experience

1. **Launch / identity:** A concise introduction with name, role, current focus, and immediate links to resume, projects, GitHub, and contact. The cinematic transition must be skippable.
2. **Planetary portfolio:** Use the existing 3D infrastructure to make portfolio areas discoverable: software engineering, Flutter/mobile, AI/ML, selected projects, experience, and achievements. Every destination must also exist as ordinary accessible page content and be reachable without 3D.
3. **Work and evidence:** Each project must show the real problem, the user's contribution, stack, meaningful implementation details, links, and verifiable outcomes. Do not invent metrics, awards, roles, or impact.
4. **Wreckage / lessons:** A chapter about setbacks, debugging, failed approaches, and what changed as a result. Only use facts already present in the repository or explicitly supplied by the owner; otherwise leave content as an editable placeholder.
5. **Beyond the frontier:** A restrained Voyager-inspired closing message around continued learning and exploration, with clear contact and resume actions.

## Implementation constraints

- First map the existing routes, components, data sources, and design tokens. Reuse the current Next.js, React, Three.js, React Three Fiber, and Drei stack; do not add a competing 3D framework.
- Preserve Projects, Resume, Atlas, Observatory, Admin, GitHub data, analytics, and existing automation. Do not break existing URLs or remove working functionality.
- Keep the existing visual identity/design system coherent. Avoid a generic neon dashboard or a disconnected demo section.
- Provide a responsive, fully usable mobile and reduced-motion experience with no required WebGL interaction.
- Use progressive loading, lazy-load 3D, cap device pixel ratio and particle counts, pause animation when offscreen, and provide a static fallback. Target smooth operation on modest integrated graphics and mobile devices.
- Maintain keyboard navigation, semantic HTML, visible focus, contrast, and screen-reader labels.
- Keep all secrets server-side; never expose tokens in client bundles.
- Do not add fabricated GitHub statistics or placeholder project claims.

## Acceptance checklist

- Existing routes and core features still work.
- First screen communicates who the owner is and what they build within seconds.
- A recruiter can reach projects, resume, skills, experience, and contact without entering the 3D scene.
- 3D is progressive enhancement, not a dependency for navigation or content.
- Mobile, keyboard-only, and prefers-reduced-motion paths are complete.
- Production build, lint, type-check, and relevant tests pass.
- Changes are committed only to `New-main`; do not modify `main`.

## Delivery

Implement in small, reviewable commits on `New-main`. Before editing, inspect the actual source and document the component/file mapping. After editing, report changed files, behavior changes, test commands/results, performance considerations, and any remaining manual asset work.
