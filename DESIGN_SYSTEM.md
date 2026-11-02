# Design System: Ink & Signal

**Project:** Bezaleel Paul portfolio  
**Direction:** Editorial software portfolio with a lightweight 3D signal core and a full 3D Work Atlas  
**Routes:** `/`, `/projects`, `/atlas`, `/resume`, `/observatory`

---

## 1. Design Philosophy

The portfolio is built as an editorial document, not a cockpit.

1. **Warm paper, dark ink.** Most content sits on paper; the hero, atlas, and footer use ink.
2. **One accent.** Signal lime is reserved for actions, focus, selected data, and live structure.
3. **Typographic hierarchy before decoration.** The work is the visual, not the chrome.
4. **Grounded technical storytelling.** Every number must be verifiable and every project story should answer: problem, approach, result.
5. **Motion with restraint.** No scroll-jacking. Decorative motion disappears under `prefers-reduced-motion`.

**Anti-patterns:** fake telemetry, invented satellites, health bars, cockpit controls, multiple competing 3D scenes, neon glow on every border, emoji-led headings, autoplay audio.

---

## 2. Color Tokens

| Token | Value | Usage |
| :--- | :--- | :--- |
| `ink` | `#111411` | Primary dark background, primary text on paper |
| `ink-soft` | `#1A1E19` | Raised dark surfaces |
| `ink-muted` | `#30352D` | Muted dark UI |
| `paper` | `#F1EFE7` | Primary page background, text on ink |
| `paper-warm` | `#E7E4D9` | Warm alternate surface |
| `paper-bright` | `#FAF9F4` | High-contrast paper section |
| `signal` | `#D9FF63` | Single accent, CTAs, selection, focus in dark surfaces |
| `signal-soft` | `#E8FFA3` | Hover accent |
| `line` | `#CBCCC0` | Paper divider |
| `line-dark` | `#3A4036` | Ink divider |

Legacy `space-*` and `hud-*` tokens remain only for the older `/observatory` demo. New UI must not use them.

---

## 3. Typography

| Role | Family | Notes |
| :--- | :--- | :--- |
| Display | Instrument Serif | Large headlines, project names, editorial voice |
| Body | Manrope | Interface copy, descriptions, long-form reading |
| Metadata | JetBrains Mono | Eyebrows, counts, dates, labels, controls |

Rules:

- Hero display: `clamp(4.4rem, 12vw, 10.5rem)`, line-height `0.9`.
- Section headings: 4xl to 7xl, tight tracking, balanced lines.
- Eyebrows: mono, 10–11px, uppercase, 0.12–0.16em tracking.
- Body copy on paper uses `ink` at 55–70% opacity; on ink uses `paper` at 50–75%.
- Numerals use `tabular-nums` where values align.

---

## 4. Layout

- Main shell: `max-width: 82rem`, responsive inline padding `1.25rem / 2rem / 3rem`.
- Homepage: alternating paper, bright paper, and dark sections.
- Grid: 12 columns on desktop; asymmetric editorial splits are preferred over equal card grids.
- Section rhythm: `py-24` mobile, `py-32` desktop.
- Project entries: number, title/copy, and expandable case notes in a 1/7/4 split.
- Atlas: full-viewport dark map with 320px control panel, flexible viewport, and 352px case-notes panel.

---

## 5. Components

### Navigation

- Fixed paper header with blur, a 1px ink divider, and a thin scroll-progress line.
- Wordmark plus mono section links with animated underline hover states.
- Mobile: full-width paper menu, large serif links, Escape to close, body scroll locked.
- Skip link targets `#main-content`.

### Buttons and links

- Primary: signal pill, ink text, mono uppercase label.
- Secondary: transparent with paper border on dark surfaces.
- Text links: thin underline with offset; underline darkens on hover.
- Focus: 2px ink outline on paper; 2px signal outline on dark surfaces.

### Project case notes

- Native `<details>` and `<summary>` for keyboard and no-JS access.
- Labels: “The problem”, “The approach”, “What shipped”.
- Archive includes search, category filters, live count, empty state, and reset.

### Charts

- GitHub activity is a readable bar sequence with one button per day.
- The trend line draws once when it enters the viewport; reduced motion shows it immediately.
- Every day button exposes `aria-pressed`, exact date, and commit count.
- Selected day is repeated as text, not color-only.

### Resume

- The web chrome uses the same paper/ink system as the portfolio, not a separate dashboard theme.
- The printable sheet is an A4 editorial document with a paper-warm sidebar and ink typography.
- Download, print, project archive, and JSON source actions remain available above the sheet.
- Decorative navigation, actions, and the JSON modal are hidden from print output.

---

## 6. Work Atlas

**Concept:** a constellation map of real repository history.

- Five repository-backed systems.
- Each constellation is a project.
- Each star is a sampled commit or the repository origin.
- Lines describe the system’s visual shape, not dependencies.
- Timeline reveals stars in chronological order.
- Selecting a project glides the camera, dims other constellations, and opens case notes.
- Deep links use `/atlas/?project=<project-id>`.

Visual rules:

- Ink background with a restrained radial signal glow.
- Stars use paper white; selected constellation and glows use signal.
- No fake planets, orbits, HUD readouts, or invented telemetry.
- Maximum one 3D scene per route.
- The homepage uses a small pointer-reactive wireframe signal core; it does not load the old full solar-system scene.
- Reduced motion replaces the Atlas canvas with a static SVG map and the hero canvas with a CSS orbital diagram.
- Mobile uses a bottom case-notes sheet with locked background scroll.

Accessibility:

- Canvas is `aria-hidden`; all controls exist as HTML.
- Every project is a button with `aria-pressed`.
- Escape closes case notes.
- Timeline range has an accessible label and month value.
- Static map preserves the same project selection through the HTML controls.

---

## 7. Motion

- Hero: slow wireframe rotation, orbiting satellites, deterministic dust, and damped pointer parallax through React Three Fiber.
- Section reveals: anime.js 4, 820–920ms cubic ease-out, 72ms stagger for related items.
- Data: hero and GitHub counters ease to their real values; the activity polyline draws once on entry.
- Navigation: route fades, link underlines, mobile-menu entrance, and a requestAnimationFrame-throttled scroll-progress line.
- Atlas camera glide: critically damped lerp, no bounce; reveal is 4.8 seconds with an optional user-triggered trace.
- Star visibility snaps to the selected timeline date; Atlas has no perpetual idle animation.
- `prefers-reduced-motion`: no WebGL canvas on home or Atlas, static fallbacks, immediately visible content, and instant state transitions.

---

## 8. Accessibility Checklist

- One visible `h1` per page.
- Landmarks and skip links on every route.
- Keyboard-operable navigation, disclosures, filters, timeline, and project selection.
- No color-only state.
- No horizontal overflow at 390px.
- Focus ring remains visible on paper and ink.
- External links use `rel="noopener noreferrer"`.
- Text contrast targets WCAG AA for body and controls.
- Decorative canvas and orbit lines are hidden from assistive technology.
