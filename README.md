# portfolio.ceovanta.com

Personal site: **projects** + a **knowledge blog** generated from my Obsidian vault (`Sky_Vault`).
Built with [Astro](https://astro.build), hosted on Vercel, bilingual UI (Tiếng Việt / English).

## How content gets here

`scripts/sync-vault.mjs` reads the vault (default `../Sky_Vault`, override with `VAULT_DIR`) and writes:

| Vault | Site | Notes |
| --- | --- | --- |
| notes under `Resources/**` (minus `blog.exclude`) | `/blog/<post>/` | flat, short URLs from the note title (`Course 6:`, `01 -`… prefixes removed) |
| each folder's `_MOC - X.md` under `Resources/` | `/topics/<topic>/` | top-level folders use English slugs from `blog.topicSlugs` |
| folders listed in `projects` | `/projects/<slug>/`, `/projects/<slug>/<note>/` | project slug, showcase title and vi/en summary set in `site.config.json` |
| embedded images (`![[x.png]]`) | `public/vault-assets/` | JPG/PNG are auto-rotated and converted to WebP (q78, long edge ≤ 1600px) with `sharp`; SVG/GIF/WebP are copied as they are. Sizes go to `src/data/images.json`, which `src/lib/rehype-images.mjs` uses for `width`/`height` |

Conversions: `[[wikilink|alias]]` → site link (or plain text when the target isn't published), callouts → boxes,
`==highlight==`, LaTeX (KaTeX), mermaid, Dataview/Tasks query blocks removed, `%%comments%%` removed,
email addresses replaced with `[email hidden]` (allow-list them in `allowEmails`).

Covers: each note gets its first suitable JPG (aspect 0.6–1.8, not a screenshot, handwritten page or
anything in `images.exclude` / `images.coverSkip` / `images.coverSkipFolders`) as its cover. Set `cover: none`
in the note's frontmatter to turn that off, or `cover: <file>` (or `[[file]]` or a URL) to choose it; `cover_alt`
sets its alt text. Notes without a photo get a procedural "vesicle + molecule" cover, generated at build time by
`src/lib/cover.ts` (`/covers/…svg`, `/covers/thumb/…svg`, `/og/…png`), so nothing per-post is committed.

To keep a note off the site, add `publish: false` to its frontmatter. Notes that are still empty skeletons
(headings only, under 200 characters of text) are skipped automatically until they have content.

Also generated: `/rss.xml`, `/sitemap-index.xml`, Open Graph tags, JSON-LD (Person, BlogPosting),
share buttons (Facebook, LinkedIn, X, Threads, copy link) and a CEOVANTA call-to-action with UTM tags
(`utm_source=portfolio&utm_medium=referral&utm_campaign=<home|post_<topic>|project_<slug>|footer>`) so visits
from this site show up separately in ceovanta.com analytics.

## Design

"Thin film" (full spec: `docs/redesign-spec.md`). The whole site sits in the galaxy's violet space: iridescent
lipid vesicles and white ball-and-stick polyhedra (one shape per topic). Noto Serif Display for display type
(the condensed width axis gives the project pages their poster voice) and Be Vietnam Pro for UI and reading;
both cover Vietnamese. Topic colours, polyhedra and the iris gradient live in one place, `src/data/topics.ts`.
Dark is the default; reading pages (posts, topics, project notes) offer an opt-in "Đọc nền sáng / Light reading"
mode, stored in `localStorage.reading`.

The home hero is an interactive 3D galaxy (Three.js, loaded only when it scrolls into view): each topic is a neon
spiral arm, each note a star, courses form constellations (lines to their course star) and wikilinks between notes
are faint light trails. Drag sideways to rotate, +/- to zoom, click a star to open the note; the pause button stops
all motion and `prefers-reduced-motion` is respected live. Data: `public/data/galaxy.json`, written by the sync.
Project pages use "neon brutal" accents (thick borders, iris shadow slabs); reading, search, tables and errors stay
minimal and still. Projects show an Ask → Act progress track read from the task list in the project's MOC.

Search links: `/blog/?q=<query>&topic=<id>` prefills the search box and the topic filter (the 404 page uses it).

## Everyday use

```bash
npm install          # first time only
npm run sync         # pull latest notes from the vault
npm run dev          # http://localhost:4321
npm run publish      # sync + commit + push → Vercel deploys automatically
```

## Settings

`site.config.json`: your name, bio (vi/en), social links (GitHub, Kaggle, LinkedIn, Tableau, email; the footer
shows an icon only for links that are filled in), which project folders to show, and per-project links
(GitHub repo, Kaggle notebook, Tableau dashboard). Also:

- `images`: `maxEdge` and `quality` for the WebP conversion; `exclude` (globs never used as a cover or in the
  gallery, for privacy), `coverSkip` and `coverSkipFolders` (never auto-picked as a cover).
- `gallery`: the owner-approved photos for the home strip "Từ phòng lab và thực địa" (`file`, `note`, `alt`,
  optional `alt_en`, `sci` and `crop`). The sync writes 480/960px true-colour and fluorescence-LUT WebPs to
  `public/vault-thumbs/` and the list to `src/data/gallery.json`; the strip shows only with 3 or more photos.
- `projects[].cover`: `{ src, alt, alt_en? }` for a real project cover under `public/`. Leave `src` empty to keep
  the procedural banner (captioned "Minh hoạ / Illustration").
  `public/project-covers/virtual-lab.webp` is a one-off headless-Chrome capture of
  `Virtual_Lab/figures/thermocycler/thermocycler.html` with `--anatomy-page` and `--anatomy-card` set to
  `#1a0b45` and the plate chrome hidden, cropped 16:9 to 1600×900.

## First deploy (one time)

1. Create an empty GitHub repo (e.g. `portfolio-site`) and push this folder:
   `git remote add origin https://github.com/<you>/portfolio-site.git && git push -u origin main`
2. On vercel.com → **Add New → Project** → import the repo. Framework is detected as Astro; no settings needed.
3. Vercel project → **Settings → Domains** → add `portfolio.ceovanta.com`.
4. At the DNS provider of `ceovanta.com`, add the record Vercel shows, normally:
   `CNAME  portfolio  →  cname.vercel-dns.com`
   This does not affect the existing WordPress site on `ceovanta.com`.
