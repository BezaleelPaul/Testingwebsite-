# System Architecture

**Project:** Bezaleel Paul portfolio and Work Atlas  
**Framework:** Next.js 14 App Router, React 18, TypeScript  
**Output:** Static export to `out/` for GitHub Pages  
**Primary accent:** Signal lime on ink and paper

---

## 1. System Overview

```text
src/data/profileData.ts
        |
        +--> Homepage sections
        +--> Projects archive
        +--> Resume data
        |
        +--> Work Atlas project metadata
                    |
GitHub REST API ----+--> scripts/generate-work-atlas.mjs
                              |
                              v
                 src/data/workAtlas.generated.json
                              |
                              v
                    src/data/workAtlas.ts
                              |
                              v
                    /atlas + AtlasCanvas
```

The site is statically rendered. There is no runtime server, database, or authentication boundary. Repository data is fetched ahead of time by a script and committed as JSON so the deployed site makes no third-party API calls.

---

## 2. Routes

| Route | Rendering | Purpose |
| :--- | :--- | :--- |
| `/` | Static server component | Editorial homepage, selected work, experience, skills, GitHub activity, contact |
| `/projects` | Static client page | Searchable and filterable project archive with case notes |
| `/atlas` | Static page plus client experience | Real commit-history constellation map |
| `/resume` | Static client page | Structured resume, JSON view, PDF download |
| `/observatory` | Static client page | Legacy solar-system demo linked from the Orbital Observatory project |
| `/admin` | Static client page | Local-only command centre; not part of the public resume journey |

`next.config.mjs` sets `output: 'export'` and `trailingSlash: true`.

---

## 3. Data Layer

### `src/data/profileData.ts`

Single source of truth for:

- Profile, education, socials, approach
- Seven archive projects
- Experience, skills, achievements
- GitHub analytics snapshot
- Admin defaults

Visible credibility values are kept conservative: 34 public repositories, 135 LeetCode problems, Codeforces rating 959, current streak 3.

### Work Atlas Data

`scripts/generate-work-atlas.mjs`:

1. Queries GitHub repository metadata, recent commits, and the final pagination page for five repositories.
2. Uses the final page number and final-page length to calculate exact default-branch commit totals.
3. Removes automated sync, merge, and formatting-only commits.
4. Samples up to 14 meaningful commits per project.
5. Writes `src/data/workAtlas.generated.json`.

`src/data/workAtlas.ts` joins generated history to `INITIAL_PROJECTS`, assigning:

- Short display name
- 3D anchor
- Constellation shape
- Commit sample
- Total commits
- Global timeline bounds

Regenerate after repository activity changes:

```powershell
node scripts/generate-work-atlas.mjs
npm run build
```

If the GitHub API rate limit is exhausted, wait for the reset window before regenerating. The committed JSON remains usable in the meantime.

---

## 4. Homepage Composition

`src/app/page.tsx` is a server component. It imports:

- `Navbar`
- `HeroSection`
- `AboutSection`
- `ProjectsSection`
- `ExperienceSection`
- `SkillsSection`
- `AchievementsSection`
- `GitHubAnalyticsSection`
- `ContactSection`

The hero is a server-rendered editorial layout with a small dynamically loaded 3D signal core. `HeroSignalVisual` keeps a CSS orbital fallback for reduced motion and while the client chunk loads. `HeroSignalCore` renders a wireframe icosahedron, three orbit rings, satellites, and deterministic dust with pointer parallax. The primary action opens `/atlas`.

The navbar links to Work, Atlas, About, Experience, Skills, and Contact, plus the resume. It also maintains a requestAnimationFrame-throttled scroll-progress line.

### Global motion layer

`src/components/motion/SiteMotion.tsx` runs on pathname changes and uses anime.js 4 with IntersectionObserver for:

- `[data-reveal]` section entrances
- `[data-reveal-group]` / `[data-reveal-item]` staggered groups
- `[data-count]` numeric count-ups
- `[data-draw]` SVG line drawing

A pre-hydration boot script adds `motion-ready` only when reduced motion is not requested. A timeout removes it if the client motion layer fails to initialize, and a `<noscript>` override keeps content visible without JavaScript. `src/app/template.tsx` supplies the route-enter fade.

The resume uses the same design system and `src/data/resume.json`; its web actions and JSON modal are separated from the printable A4 sheet with Tailwind print variants and `@page` rules.

---

## 5. Work Atlas Architecture

### Page shell

`src/components/atlas/AtlasExperience.tsx`

Responsibilities:

- Selected project state
- Timeline state and optional 4.8-second trace
- Deep-link sync through `?project=`
- Escape handling
- Mobile body-scroll lock
- Desktop case-notes panel
- Mobile bottom-sheet case notes
- Static-map fallback under reduced motion

### 3D scene

`src/components/atlas/AtlasCanvas.tsx`

- React Three Fiber canvas, dynamically imported with `ssr: false`
- Camera rig with damped position and orbit-target lerp
- Orbit controls without pan
- Five constellations built from `src/lib/workAtlasGeometry.ts`
- Camera framing adapts to viewport width/aspect
- Invisible hit spheres make project selection practical
- Selected constellation uses signal lime and additive star glow
- Other constellations dim
- No post-processing, physics, or external textures

### Geometry

`src/lib/workAtlasGeometry.ts`

- Deterministic seeded placement
- Five backbone shapes, one per project
- Commits distributed along backbone segments with bounded jitter
- Shared by the 3D canvas and static SVG fallback

### Static fallback

`src/components/atlas/AtlasFallbackMap.tsx`

Reuses the same geometry and timeline data to render an SVG constellation map when motion is reduced or before the 3D chunk loads.

### Data honesty

- The header reports 518 public commits across five repositories.
- Only up to 14 meaningful commits per repository are plotted.
- Origin stars use the real repository creation date.
- Automated sync commits are excluded from the visual sample.
- The UI states that history is sampled and lacks invented activity.

---

## 6. Rendering and Performance

- Homepage first load is approximately 102 kB; the hero R3F scene loads as a separate client chunk.
- Atlas first load is approximately 115 kB; its R3F scene loads as a separate client chunk.
- Hero canvas DPR is capped at 1.5; Atlas canvas DPR is capped at 1.8.
- Each route has at most one 3D canvas; the homepage uses only the lightweight signal core.
- Reduced motion avoids initializing WebGL entirely.
- Repository JSON is small enough to ship statically.
- Images use `unoptimized: true` because the site is exported.
- The legacy `/observatory` route still carries its own 3D bundle and is intentionally isolated.

---

## 7. Styling

- Tailwind 3.4 with custom `ink`, `paper`, `signal`, and neutral line tokens.
- Global editorial helpers live in `src/app/globals.css`.
- Fonts are loaded from Google Fonts in `src/app/layout.tsx`.
- Atlas timeline thumb styling is scoped to `.atlas-range`.
- Reduced motion disables transitions globally and removes the canvas at the component level.

See `DESIGN_SYSTEM.md` for the current token and component contract.

---

## 8. Testing

Playwright covers ten flows:

1. Homepage content and runtime errors
2. Native project disclosures
3. Mobile navigation
4. Archive filtering, search, empty state, and reset
5. Accessible activity chart
6. Reduced-motion homepage without canvas
7. Resume JSON modal and PDF link
8. Atlas project selection and deep-link update
9. Atlas deep-link restoration
10. Reduced-motion Atlas static map

Commands:

```powershell
npx tsc --noEmit
npm run build
$env:CHROME_PATH='C:\Program Files\Google\Chrome\Application\chrome.exe'
npm run test:e2e
```

For stable production verification, serve `out/` on port 3000 before Playwright. The config reuses an existing server when one is present.

---

## 9. Deployment

1. Regenerate repository data when needed.
2. Run type checking.
3. Run the production build.
4. Serve `out/` and run Playwright.
5. Publish `out/` through GitHub Pages.

No server-side environment variables are required. Do not commit API tokens; the data generator uses unauthenticated public GitHub endpoints.


---

## 10. Interactive Universe and Robotics Lab

The homepage now includes a continuously animated ambient starfield, a moving ticker, an engineering-destinations section, and a final transmission sequence. The ambience has its own CSS animation loop, so it continues drifting when scrolling stops. GSAP/ScrollTrigger adds a separate, restrained depth shift while the user scrolls. Lenis remains the smooth-scroll controller; it does not take over native navigation or input.

### New routes

| Route | Rendering | Purpose |
| :--- | :--- | :--- |
| `/universe` | Static page + client scene | Spacekit.js solar-system experiment with NASA Tycho skybox, star data, and planetary presets |
| `/lab` | Static page + React Three Fiber | Interactive three-joint robot arm with manual shoulder, elbow, and wrist controls |

### Spacekit integration

`src/components/space/SpacekitUniverse.tsx` loads the official Spacekit browser build only on the dedicated `/universe` route. It creates the skybox, star field, and Sun-to-Neptune preset objects. The route remains independent from the portfolio's React Three Fiber renderer to avoid coupling Spacekit's Three.js r186 runtime to the app's Three.js r187 dependency.

Spacekit requires WebGL 2 and loads some of its assets/data from its hosted asset directory. If the browser build fails to load, initialization throws, or the script load exceeds the bounded timeout, the page switches to a CSS orbital preview. Asynchronous asset failures after initialization are not currently monitored. The rest of the portfolio does not depend on Spacekit.

### Robotics lab

`src/components/robotics/RobotArmLab.tsx` renders a lightweight articulated arm using the existing React Three Fiber stack. Three range controls update the shoulder, elbow, and wrist joint angles. The base has a slow idle rotation when reduced motion is not requested. This is an educational forward-kinematics chain, not a physics-accurate industrial simulator or a hardware controller.

### Motion and accessibility

- The ambient starfield, nebula, and distant spacecraft animate independently of scroll.
- ScrollTrigger adds background depth movement without pinning the page.
- The new robot scene is isolated to `/lab`; it does not add another WebGL canvas to the homepage.
- The robot idle rotation and decorative CSS loops respect `prefers-reduced-motion`.
- The Spacekit route has a local visual fallback when its remote engine is unavailable.
- The new routes are linked from the global navigation and the homepage engineering destinations.

### Additional verification

The Playwright coverage in `tests/space-experience.spec.ts` checks the homepage destinations and final transmission, accessible robot joint controls, and the Spacekit fallback path.
