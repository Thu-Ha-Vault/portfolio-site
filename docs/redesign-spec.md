# BUILD SPEC: "Màng mỏng / Thin Film" redesign, portfolio-site

**Direction chosen:** Thin Film (A). Judge totals: A 121, B (Dark-field Bloom) 118.5, C (Huỳnh quang) 112. All three judges ranked A first, and A is closest to the reference image the owner sent.

**Grafts taken:**
- From B: plankton flash, original arm hexes, build-time LUT photos, an iris DataTexture, a CSS poster under the canvas, and Latin names set in italic.
- From C: prerendered cover and OG endpoints, a drawing-buffer cap, ignition once per session, an LCP-safe h1 reveal, links outside the topic hues, and a forced-colors fallback.
- From the judges: blob geometry corrected to detail 16–20 with analytic normals, the scroll dolly dropped, and an opt-in light reading mode scoped to reading pages.

**Concept.** The whole site moves into the galaxy's violet space, so there is no longer a dark box on a white page.
- The iridescent liquid blobs are lipid vesicles (thin-film interference).
- The white wireframe polyhedra with vertex dots are ball-and-stick models and capsids, one shape per topic.
- Glass appears only on the header, footer and small buttons.
- Motion and the brightest colour are kept to the hero, the CTA and the project pages. Reading, search, tables and the 404 page stay flat and still.

Repo: `/Users/pc/Desktop/Sky/portfolio-site` (Astro 6, static). Default UI language is Vietnamese.

---

## 1. Fonts

### What "Buljirya" is
"Buljirya Modern Serif" (Hishand Studio, Dody Permana, 2021) is a high-contrast Didone/fashion display serif: thick stems, hairline serifs, swash alternates.

We cannot use it, for two reasons:
- **Licence.** The free download is personal use only. A web licence costs $36, and the $18 standard licence excludes websites.
- **No Vietnamese.** It has about 222 glyphs (Basic Latin and Latin‑1 only). It has no ă ơ ư đ, no U+1EA0–1EF9 range, and no hook-above, dot-below or horn combining marks.

### Chosen families (both OFL, both with verified Vietnamese)

| Role | Family | Why |
|---|---|---|
| Display: hero, page h1, section h2, prose h2, wordmark, CTA title, project heads | **Noto Serif Display** (ital, wdth 62.5–100, wght 300–700) | Closest free match to Buljirya: a high-contrast Didone with hairline serifs. The italic carries the Buljirya-like flourish (wordmark, CTA, Latin names). The wdth axis gives a condensed "poster" voice for the brutalist pages, so no third family is needed. Rendered checks of ặ ẫ ở ữ ự đ, ệ ộ and Ượ were clean. |
| UI and body: nav, buttons, chips, search, tables, meta, all long-form prose, prose h3/h4 | **Be Vietnam Pro** (400, 500, 600, 400 italic) | Built for Vietnamese, with metrics that fit stacked marks. Clean geometric sans, matching the reference's nav and buttons. |

Drop Bricolage Grotesque and Source Serif 4.

**Load URL.** Verified today: HTTP 200 and 6 `/* vietnamese */` blocks (Noto Serif Display normal and italic; Be Vietnam Pro 400, 400i, 500, 600).
```
https://fonts.googleapis.com/css2?family=Noto+Serif+Display:ital,wdth,wght@0,62.5..100,300..700;1,62.5..100,300..700&family=Be+Vietnam+Pro:ital,wght@0,400;0,500;0,600;1,400&display=swap
```
Keep the existing `preconnect` tags. Self-hosting through `@fontsource-variable/noto-serif-display@5.3.0` and `@fontsource/be-vietnam-pro@5.3.0` is an optional later step; both ship Vietnamese woff2 files.

**Tokens and fallbacks:**
```css
@font-face { font-family: 'Display Fallback'; src: local('Times New Roman'); size-adjust: 96%; ascent-override: 98%; }
--display: 'Noto Serif Display', 'Display Fallback', 'Times New Roman', serif;
--sans: 'Be Vietnam Pro', system-ui, -apple-system, 'Segoe UI', Arial, sans-serif;
--mono: ui-monospace, SFMono-Regular, Menlo, monospace; /* code only, never labels */
```
Start the fallback with the size-adjust and ascent-override values above, then tune them by measuring CLS on swap. Times New Roman, Arial and system-ui all cover Vietnamese.

### Type scale

| Element | Font | Size / weight / line-height / tracking |
|---|---|---|
| Hero h1 | display | clamp(48px, 6.2vw, 96px). Weight **400 below 900px, 300 at 900px and up**. wdth 100, lh 1.08, ls −0.01em, `padding-block: .06em .02em`, `text-wrap: balance`, max-width 14ch, colour --ink, solid (no gradient) |
| Hero subtitle (the only tracked caps on the site) | sans 500 uppercase | clamp(12px, 1.3vw, 17px), ls .28em, lh 1.5 |
| Hero intro | sans 400 | 19px / 1.7, --ink-soft, max 42ch |
| Page h1 (blog, topics, article, 404) | display 400 | clamp(38px, 5.2vw, 60px), lh 1.12, ls −0.01em |
| Band h2 (home sections) | display 400 | 40px (32px below 640px), lh 1.15 |
| Wordmark | display italic 400 | 22px |
| CTA title | display italic 400 | 32px (26px below 640px) |
| 404 line | display italic 400 | 44px (34px below 640px) |
| Brutal project h1 | display, wdth 75, wght 650 | clamp(40px, 6vw, 72px), lh 1.08, padding-block .08em, sentence case |
| Brutal case h3 | display, wdth 75, wght 650 | 32px (26px below 640px) |
| Prose body | sans 400 | 18px (17px below 400px) / 1.75, --text, max-width 40rem, paragraph gap 1.1em |
| Prose h2 | display 500 | 30px, lh 1.2, margin 56px 0 16px |
| Prose h3 / h4 | sans 600 | 21px / 18px |
| Blockquote | display italic 400 | 21px / 1.5 |
| Nav | sans 500 | 16px |
| Buttons | sans 500 (600 on solid) | 15px, ls .01em |
| Chips | sans 500 | 14.5px |
| Meta and dates | sans 400 | 14px, `font-variant-numeric: tabular-nums` |
| Tables | sans 400 | 15.5px / 1.5, tabular-nums |

**Hero copy.**
- Keep the current h1 text exactly as it is ("Từ phòng thí nghiệm sinh học đến dữ liệu và kinh doanh." / EN equivalent).
- Subtitle, computed from `graph.json`: `{N} GHI CHÉP TRONG {K} CHỦ ĐỀ` / `{N} NOTES ACROSS {K} TOPICS`. It labels the galaxy beside it, so it adds information instead of repeating the h1.
- Offer the owner the alternative h1 "Bộ não thứ hai / Second Brain" as an option. Do not ship it without approval.

**Hard rules**
- Never set the display face below 22px.
- Weight 300 only at 64px or more.
- Tracking never tighter than −0.01em.
- Display line-height never below 1.06.
- No `background-clip:text` and no per-line overflow masks on headings; both clip tone marks.
- QA string at every display size: `Ẫ Ở Ữ Ự ặ đ Việt Nguyễn liệu hộ Kiến thức`.

---

## 2. Tokens and theme decision

**Decision.** Dark is the default for every visitor; `prefers-color-scheme` is ignored.
- There is **one opt-in "Đọc nền sáng" / "Light reading" mode, on reading pages only** (blog post, topic page, project note pages).
- It is stored under a **new** localStorage key `reading` (`light` or absent). The old `theme` key is deleted in the bootstrap script, so returning visitors who stored `theme=light` do not land on a half-light page.
- The home hero, project index, blog list, topics index and 404 are always dark. This removes the "lệch pha" clash by construction.

### Dark tokens (on `:root`, `color-scheme: dark`)

| Token | Value | Role / contrast |
|---|---|---|
| `--void` | `#10052e` | Page background everywhere. Also `<meta name="theme-color">` and the galaxy `scene.background` |
| `--glow` | `#4b12a0` | Core of the single hero radial glow |
| `--glow-mid` | `#2a0a6e` | Middle stop of the glow |
| `--deep` | `#1a0b45` | Opaque surfaces: search input, code, callouts, tooltip, CTA fill, brutal fill |
| `--raise` | `#251258` | Pressed chip, table header, empty PhaseTrack segment |
| `--line` | `#3a2d6e` | Decorative hairlines only (1.64:1) |
| `--edge` | `#7466b0` | Borders of interactive controls: 3.94:1 on void, 3.63:1 on deep (meets WCAG 1.4.11) |
| `--ink` | `#ede9fc` | Headings, UI text, brutal borders: 16.3:1 on void, 9.33:1 on glow core |
| `--text` | `#e4dff5` | Prose body: 14.9:1 (never pure #fff) |
| `--ink-soft` | `#b9b1d8` | Meta, captions, intro: 9.55 on void, 8.78 on deep, 7.92 on raise, 5.46 on glow core |
| `--link` | `#a9c4ff` | Periwinkle, deliberately outside the topic hues. Always underlined. 11.1 on void, 10.2 on deep |
| `--on-light` | `#2a0e6b` | Text and glyphs on solid white (primary button, footer icon squares): 15.3:1 |
| `--focus` | `#ffffff` | Focus ring colour (19.4:1 on void) |
| `--plate` | `#fbfaf7` | Specimen-plate background behind light SVG diagrams and white screenshots (diagram #333 text is 12.1:1) |
| `--wire` | `#ffffff` | Wireframe lines (85% opacity), vertex dots (100%), faces (8%) |

**Topic channels.** Keep the **original galaxy hexes**; all pass AA as non-text marks on void.

| Topic | Token | Hex | On void | Polyhedron |
|---|---|---|---|---|
| biology | `--t-biology` | `#2ef2ff` | 14.1 | icosahedron |
| business | `--t-business` | `#ff3db4` | 6.07 | cube |
| ai-development | `--t-ai` | `#a78bfa` | 7.12 | octahedron |
| french | `--t-french` | `#ffb627` | 11.05 | tetrahedron |
| university-courses | `--t-courses` | `#9dff5c` | 15.6 | dodecahedron |
| english | `--t-english` | `#ff6b5e` | 6.94 | triangular bipyramid |

**Colour semantics rule.**
- A topic hex always appears **paired with its polyhedron glyph and its text name**, so meaning never depends on colour alone.
- Topic hexes are never used as body-text colour, link colour or focus colour.

**Iris, the only non-topic neon.** It uses the reference-tuned stops, which are distinct from the topic hexes:
```css
--iris: linear-gradient(115deg, #f45fd0 0%, #b18cff 26%, #4cd8ff 52%, #5be3f0 64%, #ffc94a 84%, #ff9e9e 100%);
--iris-pink: #f45fd0;   /* solid stand-in where a gradient can't go (box-shadow) */
```
Iris is used only in these places:
- PhaseTrack fills
- the CTA border
- the brutal shadow slab and the brutal button shadow
- the active-nav underline
- the prose blockquote rule
- the blob shader ramp (a 256×1 DataTexture built from these exact stops)
- cover art

It is never used on text.

**Glass:**
```css
--glass: linear-gradient(180deg, rgba(255,255,255,.20) 0%, rgba(255,255,255,.06) 100%);
--glass-top: inset 0 1px 0 rgba(255,255,255,.32);
--glass-fallback: rgba(26,11,69,.94);
```

**Status pills.** These always carry a text label; colour is secondary.
- "Đang làm" (in progress): `#ffc94a`
- "Hoàn thành" (done): `#a8f06a`
- "Tạm dừng" (paused): `--ink-soft`

All three use `--void` text (12.65, 14.16 and 9.55:1) and a 2px `--ink` border. This replaces the failing #fff on eosin.

**Single source of truth.** Create `src/data/topics.ts`. It exports:
- `TOPICS`: id, hex, stained hex, polyhedron name, glyph SVG path, and vi/en names
- `IRIS_STOPS`

`Galaxy.astro`, the cover endpoints, `PostRows.astro` and `Base.astro` all import it. `Base.astro` injects a `<style is:global>` `:root{--t-*}` block generated from it. Do not hand-copy the hexes anywhere else.

### Light reading mode (`html[data-reading="light"] body.is-reading`)

| Token | Value | Contrast on #fcfcfd |
|---|---|---|
| `--void` | `#fcfcfd` | (background) |
| `--deep` | `#eef0f7` | (surface) |
| `--raise` | `#e6e4f5` | (surface) |
| `--line` | `#dcd9ec` | (hairline) |
| `--edge` | `#8a86a8` | at least 3:1 (verify) |
| `--ink` / `--text` | `#1e1b3a` | 16.1 |
| `--ink-soft` | `#565374` | 7.1 |
| `--link` | `#3f3d9c` | 8.68 |
| `--focus` | `#1e1b3a` | 16.1 |

Stained topic variants:

| Topic | Hex | Contrast |
|---|---|---|
| biology | `#0b7285` | 5.45 |
| business | `#c2255c` | 5.52 |
| ai | `#5f3dc4` | 6.94 |
| french | `#9c4f00` | 5.8 |
| courses | `#1f7a34` | 5.26 |
| english | `#c92a2a` | 5.32 |

Other changes in light reading mode:
- Header and footer glass becomes `rgba(255,255,255,.78)` with a `--line` hairline.
- The vesicle backdrop is hidden.
- Code switches to Shiki light colours.
- Mermaid re-renders with light themeVariables.

**Toggle.** A 32px chip in the header, rendered only on `.is-reading` pages. It uses `aria-pressed`. Labels: "Đọc nền sáng" / "Light reading".

**Also add:**
- `@media print`: white paper, black text, no backgrounds, glass, shadows or decor, and link URLs printed after links.
- `@media (forced-colors: active)`: drop the iris slab, box-shadows, glass and decor; keep the 3px borders; use system colours.

---

## 3. Global surfaces

**Body**
- `background: var(--void)`, `color: var(--ink)`, `font: 400 17px/1.65 var(--sans)`.
- `overflow-x: clip` (not `hidden`). Never set overflow on `html`.
- `::selection { background: rgba(244,95,208,.35); color: #fff }`
- `scrollbar-color: #7466b0 #1a0b45`

**Page glow**
- `body::before`: `position: fixed; inset: 0; z-index: -1; pointer-events: none`.
- Background: `radial-gradient(60vw 50vw at 22% 38%, var(--glow) 0%, var(--glow-mid) 38%, transparent 75%)`. Do not use `background-attachment: fixed`, because iOS handles it badly.
- On `.is-reading` pages, use only a 30%-opacity wash confined to the top-left 40vh, never behind the prose column.

**Masthead (glass header)**
- `position: sticky; top: 0; z-index: 30; height: 64px` (56px below 640px).
- `background: var(--glass), rgba(16,5,46,.35)`; `box-shadow: var(--glass-top), 0 1px 0 rgba(0,0,0,.25)`. No radius, no bottom border.
- Frost lives on `::before` (`inset: 0; backdrop-filter: blur(14px) saturate(150%); -webkit-backdrop-filter: …; opacity: 0; transition: opacity 240ms`). `.is-frosted` sets opacity to 1.
- On home it frosts only after the hero sentinel leaves the viewport (see the motion table). Every other page renders with `.is-frosted` from the start.
- `@supports not (backdrop-filter: blur(1px))`: replace the frost with `background: var(--glass-fallback)`.
- Wordmark: display italic 22px, --ink.
- Nav: --ink at 78% opacity, 16px/500. `[aria-current="page"]` gets full --ink and a 2px iris underline (`border-bottom: 2px solid; border-image: var(--iris) 1`) at a 6px offset.
- Language chip: glass, radius 3px, min-height 32px.
- Delete the theme toggle. Add the reading toggle on `.is-reading` pages only.
- `view-transition-name: masthead`.
- `backdrop-filter` creates a containing block, so any future fixed mobile menu must live outside `.masthead`.

**Footer (glass bar)**
- Full-bleed, min-height 88px, same `--glass` and top highlight, not sticky. Inner `.wrap` uses a flex row that wraps on mobile.
- Left: "Tìm mình ở", then **40×40 solid white rounded squares** (radius 9px, glyph colour `--on-light`). Each square has an `aria-label` and a `title`, and is rendered only when `site.config.json author.links.*` has a value. RSS is always shown.
- Right: the footer line and a "CEOVANTA" text link (--link, underlined).
- No `backdrop-filter` (static content needs no blur).

**Buttons** (the reference's small rectangles)
- Base: `min-height: 44px; padding: 0 20px; border-radius: 3px; font: 500 15px var(--sans); display: inline-flex; align-items: center; gap: 8px`. No "→" suffixes.
- `.button` (secondary, glass): `background: var(--glass)`, `box-shadow: inset 0 1px 0 rgba(255,255,255,.35), inset 0 0 0 1px rgba(255,255,255,.14)`, `color: #fff`. Hover: top stop .28.
- `.button.solid` (primary): `background: #fff; color: var(--on-light); font-weight: 600`. Hover: `#ece8fb`.
- Glass buttons appear only in the hero, CTA, 404 and header. In core flows, buttons are solid --deep with a 1px --edge border.

**Radius hierarchy**

| Element | Radius |
|---|---|
| Brutal pieces | 0 |
| Buttons, chips, inputs | 3px |
| Plates, callouts, CTA, covers | 4–6px |
| Footer icon squares | 9px |
| Vertex dots | 50% |

**Links**
- `color: var(--link); text-decoration: underline 1px; text-underline-offset: 3px`.
- Hover: `color: var(--ink); text-decoration-thickness: 2px`.
- Nav and buttons are not underlined.

**Focus (every focusable element)**
```css
:focus-visible { outline: 2px solid var(--focus); outline-offset: 3px; box-shadow: 0 0 0 6px rgba(169,196,255,.28); }
```
- On solid white buttons the ring sits outside the button on the dark background, so it stays visible.
- Inputs use `outline-offset: 2px`.
- `.skip:focus` is a solid white chip with --on-light text.

**Vesicle backdrop** (`src/components/Vesicles.astro`, static, `aria-hidden`, `pointer-events: none`, `position: fixed`, z-index −1 above the glow)
- An inline SVG of 3 seeded blobs in iris stops: one sharp, one with a baked `feGaussianBlur` (out of focus), and one 80px sphere with a white rim arc.
- Rendered on every page except home (the live hero replaces it) and except light reading mode.
- Placement:
  - 1280px and up: right −6vw, top −10vh, width min(36vw, 500px). It sits only in the right gutter beside the 40rem column.
  - 720–1279px: a single 220px blob at 50% opacity, top-right under the header.
  - Below 720px: one 150px blob half off-screen behind the header, so the frost has something to reveal.
- Never animated, and never behind a text column.

**Global reduced-motion rule** (replaces global.css line 83):
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation: none !important; transition: none !important; scroll-behavior: auto !important; }
}
@media (prefers-reduced-motion: no-preference) { @view-transition { navigation: auto; } }
```

---

## 4. Home hero (the galaxy stays and becomes the environment)

### Structure (`src/pages/index.astro`)
```html
<section class="hero-stage" data-hero>
  <div class="hero-poster" aria-hidden="true"><!-- CSS glow + 2 pre-blurred inline-SVG blobs --></div>
  <div class="wrap hero-copy"> h1 · p.hero-sub · p.intro · .actions </div>
  <Galaxy variant="stage" />     <!-- canvas, labels, tip, controls -->
  <div class="g-legend">…</div>  <!-- strip along the bottom of the stage -->
  <span class="hero-sentinel" aria-hidden="true"></span>
</section>
```

**Gutter guard.** `.hero-stage` is a full-bleed outer wrapper with an inner `.wrap`. Never put a `padding` shorthand on any element that also carries `.wrap` (`.wrap.hero`, `.wrap.page-head`, `.wrap.article`, `.wrap.brutal`); use `padding-top` and `padding-bottom` longhands only.

**Stage**
- `position: relative; overflow-x: clip; margin-top: -64px; padding-top: 64px` (the canvas runs under the header).
- `min-height: clamp(600px, 92vh, 880px)`.
- A static scrim behind the copy: `radial-gradient(closest-side at 28% 50%, rgba(16,5,46,.55), transparent)`.

**Desktop (900px and up)**
- Copy column: left, vertically centred, `width: min(46vw, 620px)`.
- Canvas: `position: absolute; inset: 0 0 0 34%`, bleeding off the right, top and bottom. No radius, no aspect-ratio.
- Feather mask: `mask-image: linear-gradient(90deg, transparent 0, #000 25%), linear-gradient(180deg, #000 82%, transparent)`, with `mask-composite: intersect` and `-webkit-mask-composite: source-in`. Put the mask on the `<canvas>` only, never on the container; the controls, tooltip and labels must stay unmasked.
- `camera.setViewOffset` so the galaxy core sits at about 66% of viewport width.
- `.g-label` opacity is multiplied by `smoothstep(0.46, 0.54, screenX/viewportW)` so labels never cross the h1.

**Mobile (below 900px)**
- Copy first, inside the 16px gutters.
- Then the canvas edge to edge, 100vw × 112vw. Top and bottom fade masks only; no left mask.
- Then the legend as a horizontal scroll row.

**Galaxy integration (`Galaxy.astro`)**
- `scene.background = new THREE.Color(getComputedStyle(root).getPropertyValue('--void'))`. Replace the CanvasTexture gradient.
- Keep the opaque background, as the existing code comment says: a transparent canvas gives additive sprites dark halos. Do **not** switch to `alpha: true`.
- Colours: import from `topics.ts` (remove the local `neon` map).
- Course constellation lines: white at 0.16 opacity. Course stars (k==1) get white 3px vertex dots, which restyles them in the reference's wireframe language.
- Remove `.galaxy` border-radius and aspect-ratio when `variant="stage"`.
- `touch-action: pan-y` (was `none`) and `controls.enableZoom = false`. Zoom stays on the +/− buttons and the keyboard. Horizontal drag rotates; vertical swipe scrolls the page.
- `.g-controls`: radius 3px, background `rgba(26,11,69,.6)`, **no backdrop-filter** (blur over a live canvas is too costly). The pressed state uses a white ring, not a cyan glow.
- Relabel the rotate button "Tạm dừng chuyển động" / "Pause motion" (`aria-pressed`). It stops **all** scene motion (auto-rotate, blob morph, polyhedra spin, parallax), which satisfies WCAG 2.2.2.
- Tooltip: `--deep` at .94, 1px `rgba(255,255,255,.18)` border, radius 4px.
- Legend strip: inside the stage at the bottom, `background: linear-gradient(180deg, rgba(255,255,255,.07), rgba(255,255,255,.02))`, no blur. Each item is a 12px polyhedron glyph in the topic hex, the name and the count (tabular-nums). Each item is a link to the topic and drives the topic-focus highlight on hover or focus.
- Delete the old `.galaxy-figure figcaption` outside the box. If a caption is needed, it goes in the strip at 14px --ink-soft.

**Decorative layer 1: iridescent vesicles (WebGL, same context; never a second context)**

*Count and geometry*
- Fine pointer: 5 blobs, `IcosahedronGeometry(r, 18)` (about 7.2k triangles each).
- Coarse pointer, or `hardwareConcurrency <= 4`: 3 blobs at detail 10 (about 2.4k triangles each).
- Note: in three r187, detail n gives 20·(n+1)² triangles. Detail 5 is only 720 triangles and looks faceted.

*Placement*
- Add the blobs to a `blobGroup` that is a **child of the camera** (`scene.add(camera)`), so they hold a fixed right-hand column like the reference while the galaxy orbits behind and through them. The shared depth buffer interleaves them with the arms.
- View-space positions: x from +0.15 to +0.55 of the frustum half-width at their depth, y spread from −0.6 to +0.7 so one bleeds off the top and one off the bottom, z from −260 to −420.
- Radii: 22–70 world units, plus one small 12-unit sphere.

*Vertex shader*
- 3D simplex-noise displacement, amplitude 0.14r, frequency 1.3, time ×0.04 (about 24s loop), per-blob seed.
- **Analytic normals:** displace two tangent-offset neighbours (ε = 0.01) and take the cross product. Do not use dFdx/dFdy, which gives flat facets.
- Y bob ±6 units, period 18–31s per blob.

*Fragment shader*
- `fres = pow(1.0 - max(dot(N,V),0.), 1.6)`.
- `t = fract(fres*0.9 + N.y*0.25 + uTime*0.02 + seed)`, used to sample the 256×1 iris DataTexture.
- Base colour = mix(iris(t), iris(t + .3), .35).
- Plus a white specular rim `pow(fres, 4.0)*0.55` and a soft key highlight.
- Opaque output (alpha 1, normal blending, depthWrite true), so they read as glossy filled liquid like the reference.

*Depth of field*
- Two billboard sprites behind the column, using a pre-blurred amber/teal radial CanvasTexture at alpha .5, depthWrite false.

**Decorative layer 2: topic polyhedra (wireframes with vertex dots)**
- Each topic star (k==2) becomes a ball-and-stick wireframe about 18 units across, using its topic polyhedron:
  - `LineSegments(EdgesGeometry(poly))` with `LineBasicMaterial` white, opacity .85
  - `Points` at the vertices: 5px white dots (round sprite)
  - faces: `MeshBasicMaterial` white, opacity .08, `depthWrite: false`, DoubleSide
- Rotation: 0.12 rad/s around a seeded tilted axis.
- The two large decorative hulls from the draft are **not built** in this round (optional phase 2).

**Performance limits (hard)**
- `renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5))`, and also cap the drawing buffer at **3.0 MP**: if w·h·dpr² > 3e6, lower the dpr to fit.
- Render only while the stage intersects the viewport **and** `document.visibilityState === 'visible'`.
- 30fps on coarse pointers.
- On-demand rendering (render only on input or tween) when motion is paused or reduced.
- Throttle `pick()` to one call per rAF.
- Keep the IntersectionObserver lazy dynamic `import('three')`.
- LCP: `.hero-poster` (CSS glow plus 2 pre-blurred inline-SVG blobs at the same positions) paints first. The canvas fades in over 400ms on `.is-ready`. The poster is also the no-WebGL fallback (the existing `fail(el)` path keeps the poster and hides the controls).
- Budget for the added scene: 5 blobs × 7.2k triangles, plus 6 polyhedra, plus the existing ~1,700 sprites and lines.

**Reduced motion (live listener)**
- `matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', …)` toggles the state live; do not read it once at init.
- When reduced:
  - `uTime` is frozen at a seeded value and `uIgnite` is 1.
  - No auto-rotate, no polyhedra spin, no parallax, no plankton flash.
  - A single static frame is rendered, plus re-renders on user drag or button use.
- The topic highlight still works, as an instant switch.

---

## 5. Project pages: "neon brutal"

Applies to the home projects band, `/projects/`, `projects/[...slug]` heads, `ProjectCase.astro` and `PhaseTrack.astro`. Fills are opaque, never glass.

**Case frame** (`.brutal .case`)
- `background: var(--deep); border: 3px solid var(--ink); border-radius: 0; padding: 28px; position: relative; isolation: isolate; margin: 0 10px 40px 0`. The right and bottom margins hold the slab; keep them.
- **Iris slab** in place of the old white hard shadow: `::before { content:''; position:absolute; inset:-3px; translate: 8px 8px; background: var(--iris); z-index:-1 }`. At 640px and below the offset is 6px. Never put it inside an `overflow:hidden` ancestor.
- Section head: an 8px `--ink` top bar, h2 in the condensed voice (display wdth 75, wght 650).
- Layout at 900px and up: two columns.
  - Left: title, summary (sans 17px --text), status pill, deadline (meta), tags.
  - Right: cover figure (16:9, 3px `--ink` frame, radius 0), then PhaseTrack, then the button.
- Below 900px: the cover comes first, then everything else stacked.

**Pieces**
- Tags: 2px `--ink` border, radius 0, sans 600 13.5px, sentence case, and a leading 8px square in the topic hex when the tag maps to a topic.
- Status pill: see §2 (dark text on #ffc94a or #a8f06a, or --ink-soft; 2px --ink border; radius 0).
- PhaseTrack:
  - 3px `--ink` frame with 2px `--ink` cell dividers.
  - Bars are 12px tall with 2px ink borders; the empty part is `--raise`.
  - Each done fill shows its slice of one continuous iris (`background: var(--iris); background-size: calc(var(--steps)*100%) 100%; background-position: calc(var(--i)/(var(--steps) - 1)*100%) 0`), so Ask→Act reads as one spectrum.
  - Labels: sans 13.5px --ink-soft.
- Brutal buttons: radius 0, 3px `--ink` border, `--deep` fill, `--ink` text, `box-shadow: 4px 4px 0 var(--iris-pink)`.
- Project page `.article-head.brutal`: the same frame and slab. h1 in clamp(40px, 6vw, 72px) in the condensed voice.
- Move the inline styles in `projects/[...slug].astro` (margin-top, max-width) into classes.
- `forced-colors: active`: the slab and shadows are removed; the 3px borders stay.

---

## 6. Core flows (minimal, still, solid)

Rules for all core flows:
- No glass, blur, blobs, covers or motion inside these columns. The vesicle backdrop lives only in the 1280px-and-up gutter.
- State is shown by colour, border and fill, and transitions are capped at 120ms colour changes.
- Body text must reach at least 4.5:1, which every pair below exceeds.

**Blog list `/blog/` and home "Mới cập nhật" rows (`PostRows.astro`)**
- Page head: display h1 400, intro in --ink-soft.
- Rows:
  - 1px `--line` separators. Grid: `6.5em | 1fr | auto`.
  - Date: 14px tabular-nums --ink-soft (9.55).
  - Title: sans 500 18px --ink (16.3).
  - Topic: 12px polyhedron glyph in the topic hex, plus the name in 14px --ink-soft. The name text is never neon.
- Hover and focus: the title turns `--link` and gains an underline. No background change, no lift.
- At 390px each row stacks: date, then title, then glyph and topic.
- The home rows only get a 56px procedural cover thumb on the left at 640px and up (§7). `/blog/` rows get no images.

**Search**
- Label above the field: sans 600 16px.
- Input: solid `--deep`, 1px `--edge` (3.63), radius 3px, height 48px, sans 17px, placeholder in --ink-soft (8.78), `color-scheme: dark` so the native clear button and caret are light. Focus uses the global ring with a 2px offset.
- Result count directly below: 14px --ink-soft, `aria-live="polite"`.
- Support `?q=` on `/blog/`: prefill the field and focus it. The 404 page uses this.

**Filter chips**
- Rectangular: radius 3px, min-height 40px, 1px `--edge`, sans 500 14.5px --ink-soft, each with a leading 12px polyhedron glyph.
- `aria-pressed="true"`: `--raise` fill (ink on raise 13.5:1), 1.5px border in the topic hex, --ink text.
- "Tất cả" (All) pressed: --ink border.

**Empty state**
- Text: "Không có ghi chép nào khớp “{q}”. Thử từ khoá ngắn hơn hoặc chọn chủ đề khác." It echoes the query.
- Button: "Xoá bộ lọc" (solid --deep with 1px --edge). It resets the search and the chips and moves focus back to the input.

**Topics index**
- The same rows. Group heading: display 400 26px with a 28px topic glyph. Counts in tabular-nums.

**Topic page `topics/[slug]`**
- Procedural banner (§7), then crumbs, the h1, and the rows.
- Move the inline `max-width:46rem` into a class.

**Tables (in prose)**
- A rehype plugin wraps every `<table>` in `<div class="table-scroll" tabindex="0" role="region" aria-label="Bảng (cuộn ngang)">` with `overflow-x: auto` and `scrollbar-color: #7466b0 #1a0b45`.
- A static 24px right-edge fade shows only when `scrollWidth > clientWidth` (a tiny script toggles `.has-overflow`).
- Cells: sans 15.5px/1.5, tabular-nums.
- `th`: 600 on `--raise` with a 2px `--edge` bottom border.
- `td`: 1px `--line` bottom border. No zebra stripes.
- At 390px the page never scrolls sideways.

**Long-form reading** (blog post, topic notes, project notes; `body.is-reading`)
- Order: cover (static), crumbs (14.5px --ink-soft, "/" separators), h1, byline, prose, pager, share, CTA.
- Byline: separate spans with a 20px gap, not an "A · B · C" string.
- Prose: Be Vietnam Pro 18px/1.75 `--text` (14.9:1), measure 40rem, paragraph gap 1.1em.
- h2 in display 500 30px; h3 and h4 in sans 600.
- Inline elements:
  - `strong`: 600 #fff.
  - `li::marker`: `--ink-soft` (keeps neon out of the reading column).
  - `mark`: `rgba(244,95,208,.22)`, inheriting the text colour.
  - `blockquote`: display italic 21px, 3px left rule via `border-image: var(--iris) 1`, colour --ink-soft.
- Callouts: `--deep`, 1px `--line`, radius 6px, a 3px left rule by type (note #4cd8ff, question #b18cff, warning #ffc94a, danger #f45fd0, success #a8f06a, all iris stops), with the title in sans 600.
- Code: `--deep` background with dark Shiki colours by default (see the file list).
- KaTeX inherits the text colour.
- Mermaid: `theme: 'base'` with themeVariables read from tokens (`background: #1a0b45`, `primaryColor: #251258`, `primaryTextColor: #ede9fc`, `lineColor: #b9b1d8`, `fontFamily: 'Be Vietnam Pro'`). Keep the source in `data-src` and re-render when reading mode toggles.
- Images: specimen plates and photo frames (§7).
- Pager and share: plain 1px `--edge` outline pills (radius 3px), not glass.
- No glow, motion or decor behind the column.

**404 (`404.astro`)**
- `div.wrap.page-head` with padding longhands only.
- A static 120px inline-SVG tetrahedron: white 1px lines, one edge dashed, one hollow vertex dot (the "missing link"), `aria-hidden`.
- Display italic 44px: "Không tìm thấy trang này."
- One sentence in --ink-soft: "Đường dẫn có thể đã đổi khi mình sắp xếp lại ghi chép."
- A GET search form to `/blog/?q=` (same input styling as §6 Search).
- Actions: solid white "Về trang chủ" and the text link "Xem tất cả bài viết".
- No motion.

---

## 7. Images

### 7.0 Image weight fix (prerequisite; `public/vault-assets` is 62 MB)
- Add `sharp` as an explicit dependency (today it is only present transitively).
- In `scripts/sync-vault.mjs`, for every JPG and PNG: auto-rotate, cap the long edge at **1600px**, and write **`.webp` only (q78)** into `public/vault-assets/`. Rewrite the note links to the `.webp` name. The originals stay in the vault, so the repo does not grow with duplicates. SVGs are copied as they are.
- Write `src/data/images.json` as `{ "/vault-assets/x.webp": { "w":…, "h":… } }`.
- Add a rehype plugin `src/lib/rehype-images.mjs`, registered in `astro.config.mjs`. For every `<img>` it adds `width`, `height`, `loading="lazy"` and `decoding="async"`, and adds classes by filename:
  - `.svg`, `anh-chup-man-hinh-*`, `image-*`, `pasted-image-*` → `class="plate"`
  - otherwise → `class="photo"`
- Expected payload reduction: 40–60%.

### 7.1 Procedural "vesicle + molecule" covers (all 243 posts, every topic, Cyclistic and Track B)
- `src/lib/cover.ts`: a pure function `coverSvg(seed, topic, variant)`.
  - Seed: FNV-1a hash of the slug, fed to mulberry32.
  - Variant `banner` (viewBox 640×360):
    - `--void` background with a radial glow.
    - 3–5 blobs as circles with radialGradients built from the topic hex and its two neighbours in iris order.
    - Gooey merge: `feGaussianBlur stdDeviation=14` then `feColorMatrix` with alpha row `0 0 0 22 -9`.
    - A white rim arc at .55.
    - The topic's polyhedron, projected at a seeded rotation: 1px white strokes at .7, r=2.2 white vertex dots, faces white at .06.
  - Variant `thumb` (96×96): no filter; 2 circles plus the glyph, under 1 KB.
- **Prerendered endpoints**, so nothing is committed to `public/` (`npm run publish` does `git add -A`):
  - `src/pages/covers/[...slug].svg.ts` (getStaticPaths over blog posts, topics and projects) returns `image/svg+xml`.
  - `src/pages/covers/thumb/[...slug].svg.ts` serves the thumbnails.
  - `src/pages/og/[...slug].png.ts` rasterises the banner at 1200×630 with sharp, **with no text** (no font embedding). Add `og/home.png` from a fixed seed.
  - Verify after build that these resolve under `trailingSlash: 'always'` (extension routes should be exempt).
- Placement:
  - **Post header:** at 900px and up, a right column next to the title, 16:9 at 420px wide. Below 900px, a 16:7 strip above the crumbs. Radius 4px, `alt=""`, `aria-hidden`.
  - **Topic page header:** a full `.wrap` banner, 160px tall (112px on mobile), radius 4px, `mask-image: linear-gradient(#000 60%, transparent)`.
  - **Home "Mới cập nhật" rows:** 56px thumb at 640px and up.
  - **Not** on `/blog/` rows or in search results.
- `Base.astro` adds `og:image`, `twitter:image` and `twitter:card="summary_large_image"`.

### 7.2 Real photos (curated only)
- Schema: add `cover: z.string().optional()` and `cover_alt: z.string().optional()` to the base schema in `src/content.config.ts`. A vault-side `cover: none` disables the automatic pick.
- Auto-pick in sync: the note's first JPG with aspect ratio 0.6–1.8. **Skip** `anh-chup-man-hinh-*`, `image-*`, `pasted-image-*`, `dvcxs-*` (dissections and handwritten pages), SVGs, and the French handwritten essays.
- Privacy exclusion list in `site.config.json` (`images.exclude`): `img-5834-0379b816.jpg`, and `img-4985-0facdc0f.jpg` unless a hand-cropped version is supplied.
- A real photo replaces the procedural banner on its post. On the post page it is always shown in **true colour**.
- **Home strip "Từ phòng lab và thực địa"**, placed between the recent rows and the CTA:
  - An allowlist `site.config.json "gallery": [{file, note, alt, sci?}]`.
  - Seed entries: `bat-1-hipposideros-sp1-143972ff.jpg` (sci "Hipposideros sp.") and `img-4180-576a2c66.jpg` (24-well plate, square crop).
  - The implementer proposes up to 4 more from `biological-field-study/anh-thuc-dia.md` and `vertebrate-zoology/06-tham-quan-bao-tang-dong-vat.md` (Trametes, the museum visit, a cropped Ardisia). The **owner approves** them. Render the strip only if at least 3 are approved.
  - Sync makes 480px and 960px WebP in two versions each into `public/vault-thumbs/` (few files, fine to commit):
    - true colour;
    - a fluorescence LUT version: `sharp().greyscale().toColourspace('srgb').linear([(cR−aR)/255,(cG−aG)/255,(cB−aB)/255],[aR,aG,aB])`, mapping black to `#10052e` and white to the photo's topic hex.
  - Each tile is a `<figure>` link to its note. The LUT version shows at rest; the true-colour version crossfades in on hover or focus-visible. On `(hover: none)` devices the true colour shows by default.
  - Caption: the note title in 14px. A scientific name is set in **display italic** (correct biological convention, and the Buljirya flourish).
  - Layout: 3 columns (3:4) at 900px and up, 2 columns at 560–899px, and a scroll-snap row at 72vw per item below 560px.

### 7.3 Project covers
- Schema: add `cover: z.object({ src: z.string(), alt: z.string() }).optional()` to `projects`, plus `projects[].cover` in `site.config.json`.
- **Virtual Lab:** a one-off headless-Chrome screenshot of `/Users/pc/Desktop/Sky/Virtual_Lab/figures/thermocycler/thermocycler.html` (dark variant). Before the capture, set its page-colour CSS variable to `#1a0b45`. Save at 1600×900 as `public/project-covers/virtual-lab.webp`, about 120 KB.
- **Cyclistic and Track B:** procedural banners seeded by the project slug.
  - Cyclistic: a wheel of white ball-and-stick spokes with vesicles.
  - Track B: a wireframe icosphere with vesicles.
  - Both must stay **abstract: no axes, bars or values.**
  - Caption: "Minh hoạ" / "Illustration".
  - Swap in the real Tableau or matplotlib exports when `figures/` fills (deadlines 2026-11-15 to 2026-12-01) by editing one field each.
- Covers render inside the 3px brutal frame.

### 7.4 In-prose figures
- `.prose img.plate` (the 65 SVG diagrams and white screenshots): `background: var(--plate); padding: 12px; border-radius: 4px; box-shadow: 0 0 0 1px rgba(255,255,255,.2), 0 18px 40px -18px rgba(177,140,255,.45)`. **Never inverted or recoloured**, because colour carries biological meaning.
- Where alt text exists, it becomes a 14px figcaption in --ink-soft.
- `.prose img.photo`: radius 4px, `outline: 1px solid rgba(255,255,255,.12)`, true colour.

### 7.5 Favicon
- Redraw `public/favicon.svg`: a `#10052e` rounded square, a white icosahedron wireframe with 3 vertex dots, and one pink→cyan vesicle.

### Fallbacks
- No cover field: procedural cover.
- Endpoint failure at build: fail the build (it is deterministic).
- No WebGL: hero poster.
- LUT missing: true-colour image.
- Image without manifest dimensions: `loading="lazy"` and no width or height (log a warning in sync).

---

## 8. Motion inventory

| # | Effect | Trigger | Technique, duration, easing | Reduced-motion fallback |
|---|---|---|---|---|
| 1 | **Hero ignition** (the one orchestrated moment) | First hero init per session (`sessionStorage.lit`); later visits render already lit | WebGL `uIgnite` 0→1 over 1600ms, easeOutCubic. Star `on = smoothstep(rr-0.1, rr, uIgnite*1.3 - armDelay)`, with rr = radius/300 and armDelay = 0–0.15 by note-count rank, so the light spreads from the core and bigger topics light first. It scales gl_PointSize and colour. Blobs scale 0.6→1 over 1800ms, staggered 120ms. CSS (inside `no-preference`): h1 opacity .01→1 and blur(6px)→0 over 900ms `cubic-bezier(.2,.7,.2,1)`, delay 120ms. Subtitle letter-spacing .42em→.28em over 1200ms, delay 300ms. Intro and buttons fade opacity over 500ms, delay 450ms | `uIgnite=1` at once, no CSS keyframes, text visible at paint |
| 2 | Vesicle drift and morph | Continuous while the hero is visible and the tab is visible | Noise displacement (~24s loop), y bob 18–31s, iris band travel `uTime*0.02` | `uTime` frozen at seed; static frame |
| 3 | Topic polyhedra spin | Continuous while visible | 0.12 rad/s around a seeded tilted axis | Static |
| 4 | Galaxy auto-rotate | Continuous while visible | OrbitControls autoRotate 0.5 (existing) | Off |
| 5 | **Plankton flash** | `pointermove` over the canvas, or a tap | `uPointer` (NDC) and `uStir`. uStir is set to 1 on move and decays `exp(-dt/300ms)` (gone by ~900ms). Star boost = `exp(-d²/0.012)*uStir`; size ×(1+1.2·boost), colour +0.6·boost white. A tap on touch also emits a ring ripple, radius 0→0.35 NDC over 700ms easeOut | Off (hover tooltip and highlight still work) |
| 6 | Topic focus | Hover or keyboard focus on a legend item, `.g-label` or nav topic link | `uFocus[i]`: chosen arm ×1.6, others to .25, over 280ms easeOut. That arm's constellation is drawn in white (existing hiLines). Its polyhedron scales 1→1.35 and faces .08→.18. Reverse over 180ms on leave | Instant switch, still works |
| 7 | Pointer parallax | Pointer move; only with `(pointer: fine) and (hover: hover)` | The camera-child blob group is offset by pointer×6 units with lerp 0.06 per frame. DoF sprites ×0.5. The camera itself does not move | Off. Off on coarse pointers |
| 8 | Hero canvas fade-in | Scene ready | Canvas opacity 0→1 over 400ms ease over the poster | Instant |
| 9 | Header frost | IntersectionObserver on `.hero-sentinel` (bottom of the hero) | `.is-frosted` toggles `::before` opacity over 240ms ease. backdrop-filter is never animated | Instant |
| 10 | Glass button sheen | `:hover` or `:focus-visible` on `.button` in the hero, header, CTA and 404 only | `::after` linear-gradient(100deg, transparent 30%, rgba(255,255,255,.35) 50%, transparent 70%), translateX(−120%→120%) once over 700ms ease-out | None; the background steps .20→.28 |
| 11 | CTA iris border | `:hover` or `:focus-within` on `.cta` | `@property --angle <angle>`. The border-box becomes `conic-gradient(from var(--angle), iris stops)` and spins 0→360deg over 6s linear, only while active | Static linear iris border |
| 12 | Neon-brutal press | Hover, focus-within or `:active` on `.brutal .case` links and `.brutal .button` | 120ms ease-out. Hover: translate(−2px,−2px), slab 8→11px, button shadow 4→6px. Active (80ms): translate(4px,4px), slab and shadow 0 | No transform; only the slab and shadow offset change |
| 13 | PhaseTrack fill | Track first reaches 40% visibility | JS adds `.will-fill` only if IntersectionObserver exists and motion is allowed, so bars are full with no JS. Span `transform: scaleX(0→1)`, origin left, 900ms `cubic-bezier(.2,.7,.2,1)`, stagger 80ms per phase | Shown full |
| 14 | Photo channel merge | Hover or focus-visible on a lab-strip tile | Crossfade from the LUT WebP to true colour, opacity over 300ms ease | Instant swap |
| 15 | Page crossfade | Same-origin navigation | `@view-transition { navigation: auto }` (only inside `no-preference`), root crossfade 180ms. The masthead keeps `view-transition-name` so the glass bar stays put | Not declared |

**Explicitly still:** blog list, search, filter chips, topics index, tables, prose, callouts, pager and share, 404, the vesicle backdrop and the footer. Only colour changes (at most 120ms) are allowed there.

**Cut:** scroll-linked camera dolly, section fade-ups, row and chip hover lifts, decorative hulls (optional phase 2).

**Guards**
- Pause button (#4) also stops #2, #3, #5 and #7.
- Rendering pauses offscreen or when the tab is hidden.
- On-demand rendering while paused or reduced.

---

## 9. Implementation order and file-by-file changes

**Step 1: Foundation (tokens, fonts, theme)**
- `src/data/topics.ts` (new): `TOPICS[]` (id, hex, stain, poly, glyphPath, names), `IRIS_STOPS`, and a `topicCss()` helper.
- `src/layouts/Base.astro`:
  - Swap in the font URL from §1.
  - Add `<meta name="theme-color" content="#10052e">`.
  - Inject the `<style is:global>` block from `topicCss()`.
  - New bootstrap script: remove `theme`, read `lang` and `reading`; set `data-reading="light"` only if the page is a reading page.
  - Delete the theme toggle; add the reading toggle (when the `reading` prop is true) and `body.is-reading`.
  - Glass masthead markup with a `::before` frost layer.
  - Glass footer with icon squares.
  - og:image and twitter tags.
  - Mermaid uses `base` with token variables and re-renders on toggle.
  - Render `<Vesicles/>` unless `home` or light reading.
- `src/styles/global.css`:
  - Replace the `:root` palette.
  - Delete every `prefers-color-scheme` and `[data-theme]` block and the `.astro-code !important` dark overrides.
  - Add the light-reading token block, the base, glow, selection, links, focus, buttons, radius tokens and type scale.
  - Add the reduced-motion and view-transition rules, the print and forced-colors blocks, and `body{overflow-x:clip}`.
- `astro.config.mjs`:
  - `shikiConfig: { themes: { light: 'github-light', dark: 'github-dark-dimmed' }, defaultColor: 'dark' }`. Light reading uses `var(--shiki-light)` and `var(--shiki-light-bg)`.
  - Register `rehype-images` and `rehype-table-scroll`.

**Step 2: Image weight**
- `package.json`: add `sharp`.
- `scripts/sync-vault.mjs`: WebP conversion, 1600px cap, link rewrite, `src/data/images.json`, cover auto-pick with skip patterns and exclusions, and gallery LUT and true-colour thumbs into `public/vault-thumbs/`.
- `src/lib/rehype-images.mjs` and `src/lib/rehype-table-scroll.mjs` (new).
- `site.config.json`: add `images.exclude`, `gallery[]`, and `projects[].cover`.
- `src/content.config.ts`: add `cover` and `cover_alt` to the base schema, and `cover{src,alt}` to projects.

**Step 3: Core flows (still, minimal)**
- `PostRows.astro`: glyph and topic label, grid, optional `thumbs` prop for home.
- `src/pages/blog/index.astro`: input, chips, count, empty state with the query echo and "Xoá bộ lọc", `?q=` support.
- `src/pages/topics/index.astro` and `topics/[slug].astro`: banner, inline style moved to a class.
- `src/pages/blog/[...slug]` (the post page): cover column or strip, byline spans, `reading` prop.
- `ShareBar.astro`: outline pills.
- Prose CSS: plates, photos, callouts, tables, blockquote, code, mark.
- `404.astro`: tetrahedron, copy, search form, actions.

**Step 4: Covers and OG**
- `src/lib/cover.ts`, `src/components/Cover.astro` (an `<img>` wrapper with width and height).
- `src/pages/covers/[...slug].svg.ts`, `src/pages/covers/thumb/[...slug].svg.ts`, `src/pages/og/[...slug].png.ts`.
- `public/favicon.svg`.
- `src/components/Vesicles.astro`.

**Step 5: Hero and galaxy**
- `src/pages/index.astro`:
  - `.hero-stage` structure with the poster, copy, galaxy, legend and sentinel.
  - Subtitle computed from graph.json.
  - Lab strip section.
  - Frost observer script (or put it in Base, keyed off `[data-hero]`).
- `src/components/Galaxy.astro`:
  - `variant="stage"`; colours from topics.ts; `scene.background = --void`.
  - DPR 1.5 plus the 3 MP cap; `touch-action: pan-y`; `enableZoom=false`.
  - Constellation restyle; topic polyhedra; camera-child blob group with the iris DataTexture shader (analytic normals); DoF sprites.
  - Uniforms `uIgnite`, `uStir`, `uPointer`, `uFocus`; sessionStorage `lit`.
  - Live reduced-motion listener; pause-all button relabel.
  - Visibility and offscreen pause, 30fps on coarse pointers, on-demand rendering, rAF-throttled `pick()`.
  - Label x-fade; `setViewOffset`; legend strip markup.
- `global.css` `.galaxy*` and `.g-*`: remove the boxed window; mask on the canvas; controls with no blur; tooltip restyle.

**Step 6: Portfolio pages**
- `ProjectCase.astro`: two-column layout with the cover figure, status pill, tags.
- `PhaseTrack.astro`: iris slices, `--i` and `--steps` vars, `.will-fill` script.
- `src/pages/projects/index.astro` and `projects/[...slug].astro`: brutal heads, inline styles moved to classes.
- `global.css` `.brutal*` block rewritten (slab, press, forced-colors).
- `public/project-covers/virtual-lab.webp` (headless capture).

**Step 7: CTA and polish**
- `Cta.astro`:
  - Solid `--deep` panel, radius 6px.
  - 1.5px iris border (`border: 1.5px solid transparent; background: linear-gradient(var(--deep),var(--deep)) padding-box, var(--iris) border-box`).
  - One static 240px seeded blob clipped off the right edge (`overflow: clip`).
  - Display-italic title; solid white button (fixes the #fff on eosin hover).
  - Conic spin (#11).
- Button sheen (#10); view transitions (#15).

**Step 8:** Run `npm run build`, then go through the QA checklist below. Commit with the usual flow.

---

## 10. QA checklist

**Build**
- [ ] `npm run sync && npm run build` passes, with no missing images in `images.json` warnings for prose images.
- [ ] `dist/covers/**.svg`, `dist/covers/thumb/**.svg` and `dist/og/**.png` exist for every post, topic and project, plus `og/home.png`. They resolve with `trailingSlash: 'always'`.
- [ ] `public/` gained no per-post cover or OG files. `git status` after sync shows only WebP vault assets, `vault-thumbs` (gallery only) and `project-covers/virtual-lab.webp`.
- [ ] `public/vault-assets` total is reduced by at least 40% compared with 62 MB.
- [ ] No reference to Bricolage or Source Serif remains. The font URL returns the 6 `/* vietnamese */` blocks.

**Mobile at 390px** (Safari iOS and Chrome Android, or device emulation)
- [ ] No horizontal page scroll on home, `/blog/`, a post with a wide table, a project page or the 404.
- [ ] 16px gutters everywhere, including `.wrap.page-head` on the 404 and `.wrap.article`.
- [ ] Hero: copy first, the h1 fits without clipped tone marks, buttons are 44px tall.
- [ ] The canvas is edge to edge below the copy. A vertical swipe over it scrolls the page; a horizontal drag rotates.
- [ ] Legend scrolls horizontally. No galaxy label overlaps the h1.
- [ ] The brutal slab (6px) does not clip or overlap the next card.
- [ ] Lab strip scroll-snap works.
- [ ] Footer icon squares wrap neatly.

**Keyboard**
- [ ] Tab order: skip link, nav, language, (reading toggle), hero buttons, galaxy controls (5), legend links, then content.
- [ ] A visible white ring with halo on every stop, including over the canvas and on the white primary button.
- [ ] Legend focus triggers the topic highlight.
- [ ] The table scroller is focusable and scrolls with the arrow keys.
- [ ] "Xoá bộ lọc" returns focus to the search input.
- [ ] `/blog/?q=foo` prefills and focuses the input.

**Reduced motion** (toggle the OS setting live while the page is open)
- [ ] The galaxy freezes immediately, with no reload. Ignition is skipped. Plankton flash and parallax are off.
- [ ] Drag still works; topic highlight switches instantly.
- [ ] No CSS animation on `::before` or `::after` (header frost, sheen, slab).
- [ ] No view transition. PhaseTrack bars are full. Photo swap is instant.
- [ ] The "Tạm dừng chuyển động" button stops all scene motion with the OS setting off.

**Contrast pairs to verify** (computed values; re-check in DevTools)

| Pair | Ratio |
|---|---|
| ink #ede9fc / void #10052e | 16.31 |
| text #e4dff5 / void | 14.93 |
| ink-soft #b9b1d8 / void | 9.55 |
| ink-soft / deep #1a0b45 | 8.78 |
| ink-soft / raise #251258 | 7.92 |
| ink-soft / glow core #4b12a0 | 5.46 |
| ink / glow core | 9.33 |
| link #a9c4ff / void | 11.1 |
| link / deep | 10.21 |
| edge #7466b0 / void (3:1 non-text) | 3.94 |
| edge / deep | 3.63 |
| on-light #2a0e6b / #fff | 15.29 |
| void / status amber #ffc94a | 12.65 |
| void / status lime #a8f06a | 14.16 |
| void / ink-soft (paused pill) | 9.55 |
| diagram #333 / plate #fbfaf7 | 12.1 |
| ink / glass bar (≈#3d2a66 worst case) | ≈10.3 |

Topic marks on void: cyan 14.1, magenta 6.07, violet 7.12, amber 11.05, lime 15.6, coral 6.94.

Light reading mode on #fcfcfd:

| Pair | Ratio |
|---|---|
| ink #1e1b3a | 16.09 |
| ink-soft #565374 | 7.1 |
| link #3f3d9c | 8.68 |
| biology #0b7285 | 5.45 |
| business #c2255c | 5.52 |
| ai #5f3dc4 | 6.94 |
| french #9c4f00 | 5.8 |
| courses #1f7a34 | 5.26 |
| english #c92a2a | 5.32 |

- [ ] The hero intro over a bright moving frame stays at or above 4.5:1. Sample 5 frames with the scrim in place.

**Vietnamese**
- [ ] `Ẫ Ở Ữ Ự ặ đ Việt Nguyễn liệu hộ Kiến thức` renders at the hero (desktop at 300 weight, mobile at 400), page h1, prose h2, CTA italic and condensed brutal h1 sizes. No clipping, and the stacks are consistent.
- [ ] The subtitle caps "GHI CHÉP TRONG … CHỦ ĐỀ" do not collide.
- [ ] After the font swap, CLS is under 0.05.

**Theme and legacy**
- [ ] With `localStorage.theme='light'` set from the old site, the page loads dark and the key is removed.
- [ ] Light reading mode applies only on reading pages and persists between posts.
- [ ] Shiki and Mermaid swap correctly; the vesicles are hidden.
- [ ] Home, the blog list and the 404 stay dark.
- [ ] OS light preference has no effect.
- [ ] Print preview gives white paper with black text.

**Performance**
- [ ] On a 2560px monitor the drawing buffer is at or below 3 MP (log `renderer.getDrawingBufferSize`).
- [ ] The canvas stops rendering when scrolled away or the tab is hidden (check the Performance panel).
- [ ] Coarse-pointer emulation: 3 blobs, 30fps.
- [ ] LCP element is the h1 or the poster, not delayed by the WebGL import.
- [ ] Only the header (after the hero) and the CTA-free footer use glass. No `backdrop-filter` on rows, chips, cases or `.g-controls`.

**Content and safety**
- [ ] No excluded photo (`img-5834-*`, uncropped `img-4985-*`, `dvcxs-*`, screenshots, handwritten pages) appears as a cover or in the gallery.
- [ ] The gallery shows only owner-approved files.
- [ ] Cyclistic and Track B covers contain no axes or values and are captioned "Minh hoạ".
- [ ] Every page has `og:image`.
- [ ] The hero h1 copy is unchanged. The "Bộ não thứ hai" rename is offered to the owner, not shipped.

**Owner sign-off items to raise**
1. Optional hero rename to "Bộ não thứ hai / Second Brain".
2. Approval of up to 4 additional gallery photos.
3. Whether light reading mode is wanted at all. If not, it is safe to cut, because dark is the default.
4. Whether the subtitle copy ("{N} ghi chép trong {K} chủ đề") is acceptable.
