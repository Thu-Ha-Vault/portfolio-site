# portfolio.ceovanta.com

Personal site: **projects** + a **knowledge blog** generated from my Obsidian vault (`Sky_Vault`).
Built with [Astro](https://astro.build), hosted on Vercel, bilingual UI (Tiếng Việt / English).

## How content gets here

`scripts/sync-vault.mjs` reads the vault (default `../Sky_Vault`, override with `VAULT_DIR`) and writes:

| Vault | Site | Notes |
| --- | --- | --- |
| `Resources/**` (minus `blog.exclude` in `site.config.json`) | `/blog/...` | each folder's `_MOC - X.md` becomes the folder index page |
| folders listed in `projects` in `site.config.json` | `/projects/...` | the project's `_MOC` is the project page |
| embedded images (`![[x.png]]`) | `public/vault-assets/` | large images are shrunk with `sips` on macOS |

Conversions: `[[wikilink|alias]]` → site link (or plain text when the target isn't published), callouts → boxes,
`==highlight==`, LaTeX (KaTeX), mermaid, Dataview/Tasks query blocks removed, `%%comments%%` removed,
email addresses replaced with `[email hidden]` (allow-list them in `allowEmails`).

To keep a note off the site, add `publish: false` to its frontmatter.

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
