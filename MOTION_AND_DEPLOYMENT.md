# Motion stack

The portfolio keeps its static-export architecture and uses client-only motion enhancements.

- **Lenis** (`src/components/motion/SiteScrollMotion.tsx`): smooth wheel scrolling on fine-pointer devices. Touch/coarse-pointer devices retain native scrolling.
- **GSAP + ScrollTrigger**: scroll reveals for elements marked with `data-gsap-reveal`; each trigger is scoped to its element and cleaned up on unmount.
- **React Three Fiber + Drei**: existing 3D experiences remain dynamically loaded by their route/section. Keep DPR conservative and retain static fallbacks.
- **Anime.js**: existing intersection-observer count-ups and line-draw effects remain in `SiteMotion.tsx`.

Reduced-motion users receive native scrolling and no GSAP/Lenis animation. No server-only runtime APIs, route handlers, database, or authentication are introduced.

## Static export and hosting

- `next.config.mjs` uses `output: 'export'`, `images.unoptimized: true`, and `trailingSlash: true`.
- GitHub Pages publishes the generated `out/` directory on the production branch workflow.
- Vercel can build the same static export as a branch preview; no Vercel-specific server runtime is required.
- Do not merge this branch until the preview and production checks are approved.
