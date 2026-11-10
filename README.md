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
| embedded images (`![[x.png]]`) | `public/vault-assets/` | large images are shrunk with `sips` on macOS |

Conversions: `[[wikilink|alias]]` → site link (or plain text when the target isn't published), callouts → boxes,
`==highlight==`, LaTeX (KaTeX), mermaid, Dataview/Tasks query blocks removed, `%%comments%%` removed,
email addresses replaced with `[email hidden]` (allow-list them in `allowEmails`).

To keep a note off the site, add `publish: false` to its frontmatter. Notes that are still empty skeletons
(headings only, under 200 characters of text) are skipped automatically until they have content.

Also generated: `/rss.xml`, `/sitemap-index.xml`, Open Graph tags, JSON-LD (Person, BlogPosting),
share buttons (Facebook, LinkedIn, X, Threads, copy link) and a CEOVANTA call-to-action with UTM tags
(`utm_source=portfolio&utm_medium=referral&utm_campaign=<home|post_<topic>|project_<slug>|footer>`) so visits
from this site show up separately in ceovanta.com analytics.

## Design

Palette from H&E histology staining (hematoxylin blue-violet for structure, eosin pink for emphasis), Bricolage
Grotesque for UI and headings, Source Serif 4 for reading. The home hero is an interactive 3D galaxy (Three.js, loaded only when it scrolls into view): each topic is a neon spiral arm,
each note a star, courses form constellations (lines to their course star) and wikilinks between notes are faint light trails.
Drag to rotate, scroll or +/- to zoom, click a star to open the note. Data: `public/data/galaxy.json`, written by the sync.
Project pages use brutalist accents (thick borders, hard shadows); reading, search, tables and errors stay minimal.
Projects show an Ask → Act progress track read from the task list in the project's MOC.

## Everyday use

```bash
npm install          # first time only
npm run sync         # pull latest notes from the vault
npm run dev          # http://localhost:4321
npm run publish      # sync + commit + push → Vercel deploys automatically
```

## Settings

`site.config.json`: your name, bio (vi/en), social links (GitHub, Kaggle, LinkedIn, Tableau, email),
which project folders to show, and per-project links (GitHub repo, Kaggle notebook, Tableau dashboard).

## First deploy (one time)

1. Create an empty GitHub repo (e.g. `portfolio-site`) and push this folder:
   `git remote add origin https://github.com/<you>/portfolio-site.git && git push -u origin main`
2. On vercel.com → **Add New → Project** → import the repo. Framework is detected as Astro; no settings needed.
3. Vercel project → **Settings → Domains** → add `portfolio.ceovanta.com`.
4. At the DNS provider of `ceovanta.com`, add the record Vercel shows, normally:
   `CNAME  portfolio  →  cname.vercel-dns.com`
   This does not affect the existing WordPress site on `ceovanta.com`.
