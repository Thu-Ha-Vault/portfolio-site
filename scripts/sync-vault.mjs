#!/usr/bin/env node
// Sync notes from the Obsidian vault into Astro content collections.
//   Blog     ← every .md under config.blog.root (minus config.blog.exclude)
//   Projects ← every .md inside each folder listed in config.projects
// Wikilinks, embeds, callouts and Obsidian-only syntax are converted to plain Markdown.
// Images: JPG/PNG → auto-rotated WebP (long edge ≤ images.maxEdge) in public/vault-assets/, sizes in
// src/data/images.json, an automatic `cover` per note, and the home gallery thumbs in public/vault-thumbs/.
// Usage: VAULT_DIR=../Sky_Vault node scripts/sync-vault.mjs
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import matter from 'gray-matter';
import sharp from 'sharp';
import { execFileSync } from 'node:child_process';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const config = JSON.parse(fs.readFileSync(path.join(ROOT, 'site.config.json'), 'utf8'));
const VAULT = path.resolve(ROOT, process.env.VAULT_DIR || '../Sky_Vault');
const OUT_BLOG = path.join(ROOT, 'src/content/blog');
const OUT_PROJECTS = path.join(ROOT, 'src/content/projects');
const OUT_ASSETS = path.join(ROOT, 'public/vault-assets');
const OUT_THUMBS = path.join(ROOT, 'public/vault-thumbs');
const IMAGES_JSON = path.join(ROOT, 'src/data/images.json');
const GALLERY_JSON = path.join(ROOT, 'src/data/gallery.json');
// converted WebPs are cached here between runs, so a re-sync only re-encodes new or changed images
const CACHE_DIR = path.join(ROOT, 'node_modules/.cache/vault-assets');

if (!fs.existsSync(VAULT)) {
  console.error(`Vault not found at ${VAULT}. Set VAULT_DIR.`);
  process.exit(1);
}

const IMAGE_EXT = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.avif']);
const SKIP_DIRS = new Set(['.obsidian', '.git', '.venv', 'node_modules', '.smart-env', '.claudian', '.qodo', '.trash']);
const SKIP_FILES = new Set(['CLAUDE.md', 'AGENTS.md']);
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
// JPG and PNG are auto-rotated, capped at the long edge and re-encoded as WebP only (spec §7.0)
const RASTER_EXT = new Set(['.png', '.jpg', '.jpeg']);
const imgCfg = config.images || {};
const MAX_EDGE = imgCfg.maxEdge || 1600;
const WEBP_QUALITY = imgCfg.quality || 78;
const ENCODE_KEY = `webp-v1-${MAX_EDGE}-${WEBP_QUALITY}`;

// ---------- helpers ----------
const rel = (abs) => path.relative(VAULT, abs).split(path.sep).join('/');

export function slugify(s) {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'note';
}

const slugPath = (relPath) => !relPath ? '' : relPath.replace(/\.md$/i, '').split('/').map(slugify).join('/');

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith('.') || SKIP_DIRS.has(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

function rmrf(p) {
  fs.rmSync(p, { recursive: true, force: true });
  fs.mkdirSync(p, { recursive: true });
}


/** Words of actual writing, ignoring headings, links, embeds, task boxes and "Xem thêm" lines. */
function realWords(t) {
  return (
    t
      .replace(/```[\s\S]*?```/g, ' code ')
      .replace(/^#+ .*$/gm, '')
      .replace(/^\s*[-*]\s*Xem thêm[^\n]*$/gim, '')
      .replace(/^\s*[-*]\s*\[[ xX]\][^\n]*$/gm, '')
      .replace(/^\*\*Links:\*\*.*$/gm, '')
      .replace(/!\[\[[^\]]*\]\]|!\[[^\]]*\]\([^)]*\)/g, '')
      .replace(/\[\[([^\]|]*\|)?([^\]]*)\]\]/g, '$2')
      .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
      .replace(/https?:\/\/\S+|<[^>]+>/g, '')
      .match(/[\p{L}\p{N}]+/gu) || []
  ).length;
}
function hasRealContent(body) {
  const words = realWords(body);
  if (words < 100) return false;
  const parts = body.replace(/```[\s\S]*?```/g, ' code ').split(/^#+ .*$/m).slice(1);
  if (!parts.length) return true;
  const empty = parts.filter((p) => realWords(p) < 3).length / parts.length;
  return !(words < 300 && empty >= 0.75);
}

// ---------- collect files ----------
const allFiles = walk(VAULT);
const byBasename = new Map(); // basename (no ext for md, with ext otherwise) → [abs]
for (const f of allFiles) {
  const base = path.basename(f);
  const key = f.endsWith('.md') ? base.slice(0, -3) : base;
  const k = key.toLowerCase();
  if (!byBasename.has(k)) byBasename.set(k, []);
  byBasename.get(k).push(f);
}

const blogExclude = (config.blog.exclude || []).map((e) => e.replace(/\/$/, ''));
const isExcluded = (r) => blogExclude.some((e) => r === e || r.startsWith(e + '/'));

/** published notes: abs → { collection, slug, url } */
const published = new Map();

for (const f of allFiles) {
  if (!f.endsWith('.md') || SKIP_FILES.has(path.basename(f))) continue;
  const r = rel(f);
  if (r.startsWith(config.blog.root + '/') && !isExcluded(r)) {
    const inner = r.slice(config.blog.root.length + 1);
    const isIndex = /^_MOC - /.test(path.basename(f));
    // a folder's MOC becomes that folder's index page
    const slug = isIndex ? slugPath(path.dirname(inner) === '.' ? '' : path.dirname(inner)) : slugPath(inner);
    if (!slug) continue; // Resources root MOC → the /blog/ page itself
    published.set(f, { collection: 'blog', slug, url: `/blog/${slug}/`, isIndex });
  }
}
for (const p of config.projects) {
  const dir = path.join(VAULT, p.folder);
  if (!fs.existsSync(dir)) {
    console.warn(`Project folder missing: ${p.folder}`);
    continue;
  }
  const projectSlug = p.slug || slugify(path.basename(p.folder));
  for (const f of walk(dir)) {
    if (!f.endsWith('.md') || SKIP_FILES.has(path.basename(f))) continue;
    const inner = path.relative(dir, f).split(path.sep).join('/');
    const isIndex = /^_MOC - /.test(path.basename(f)) && !inner.includes('/');
    const slug = isIndex ? projectSlug : `${projectSlug}/${slugPath(inner)}`;
    published.set(f, { collection: 'projects', slug, url: `/projects/${slug}/`, project: projectSlug, isIndex, cfg: p });
  }
}

// Respect `publish: false` in frontmatter.
const stats0 = { skeletons: 0, hidden: [] };
const parsed = new Map();
for (const f of [...published.keys()]) {
  const src = fs.readFileSync(f, 'utf8');
  let fm;
  try {
    fm = matter(src);
  } catch {
    fm = { data: {}, content: src.replace(/^---[\s\S]*?\n---\n/, '') };
  }
  if (fm.data.publish === false) {
    published.delete(f);
    continue;
  }
  // skip notes without real content yet: outlines of empty headings, to-do scaffolds, link lists
  if (!published.get(f).isIndex && !hasRealContent(fm.content)) {
    published.delete(f);
    stats0.skeletons++;
    stats0.hidden.push(rel(f));
    continue;
  }
  parsed.set(f, fm);
}

// ---------- finished articles take over their source notes ----------
// A note under config.articles.root with `type: article` and `replaces: "<path under blog.root>"` is published at
// the source note's URL instead of the note itself (the note stays untouched in the vault). Links to either file
// lead to that page. `publish: false` on the article keeps the original note online.
const sourceOfArticle = new Map(); // article abs → source abs
const urlTitle = new Map(); // source abs → the source note's own title (its URL stays the same)
const stats1 = { articles: 0 };
if (config.articles?.root) {
  const byRelNFC = new Map(allFiles.map((f) => [rel(f).normalize('NFC'), f]));
  const aDir = path.join(VAULT, config.articles.root);
  for (const f of fs.existsSync(aDir) ? walk(aDir) : []) {
    if (!f.endsWith('.md') || SKIP_FILES.has(path.basename(f)) || /^_MOC - /.test(path.basename(f))) continue;
    let fm;
    try {
      fm = matter(fs.readFileSync(f, 'utf8'));
    } catch {
      console.warn(`article: unreadable frontmatter in ${rel(f)}`);
      continue;
    }
    if (fm.data.type !== 'article' || !fm.data.replaces || fm.data.publish === false) continue;
    const target = String(fm.data.replaces).normalize('NFC').replace(/^\/+/, '').replace(new RegExp(`^${config.blog.root}/`), '');
    const srcAbs = byRelNFC.get(`${config.blog.root}/${target}`.normalize('NFC'));
    if (!srcAbs || isExcluded(rel(srcAbs))) {
      console.warn(`article ${rel(f)}: replaces "${target}" is not a blog note; skipped`);
      continue;
    }
    if (!published.has(srcAbs)) {
      // the note itself is hidden (publish: false, or still a skeleton): the article gets the URL it would have had
      const s = slugPath(rel(srcAbs).slice(config.blog.root.length + 1));
      published.set(srcAbs, { collection: 'blog', slug: s, url: `/blog/${s}/`, isIndex: false });
    }
    published.get(srcAbs).article = f;
    urlTitle.set(srcAbs, String(parsed.get(srcAbs)?.data?.title || path.basename(srcAbs, '.md')).normalize('NFC'));
    parsed.set(srcAbs, fm);
    sourceOfArticle.set(f, srcAbs);
    stats1.articles++;
  }
}

// ---------- public URLs ----------
// Files keep their folder structure internally (for the topic tree); public URLs are short and flat:
//   /blog/<post>/   /topics/<topic>/   /projects/<project>/   /projects/<project>/<note>/
const topicSlugs = config.blog.topicSlugs || {};
const stripPrefix = (s) =>
  s
    .normalize('NFC')
    .replace(/^_MOC - /, '')
    .replace(/^(?:[A-Z]{1,4}|\d{1,3}[a-z]?)\s*[-.–)]\s+/, '')
    .replace(/^(?:course|module|week|lesson|part|bài|chương|phần)\s*\d+\s*[:.\-–]?\s+/i, '');
const titleOf = (abs) => {
  const d = parsed.get(abs)?.data || {};
  return String(d.title || path.basename(abs, '.md')).normalize('NFC');
};
// URLs come from the note's own title, so a finished article keeps the URL its source note already had
const slugTitleOf = (abs) => urlTitle.get(abs) ?? titleOf(abs);
const titleCount = new Map();
for (const abs of published.keys()) titleCount.set(slugTitleOf(abs), (titleCount.get(slugTitleOf(abs)) || 0) + 1);
// notes that share a title (e.g. every lesson titled after the course) are named by their file instead
const nameOf = (abs) => (titleCount.get(slugTitleOf(abs)) > 1 ? path.basename(abs, '.md').normalize('NFC') : slugTitleOf(abs));
const used = new Set();
const claim = (base, extra) => {
  let s = base || 'note';
  if (used.has(s) && extra) s = `${base}-${extra}`;
  let n = 2;
  const root = s;
  while (used.has(s)) s = `${root}-${n++}`;
  used.add(s);
  return s;
};
// topics first so they keep the clean names
const entries = [...published.entries()].sort(
  ([a, da], [b, db]) => Number(!!db.isIndex) - Number(!!da.isIndex) || a.split('/').length - b.split('/').length
);
for (const [abs, dest] of entries) {
  if (dest.collection === 'blog') {
    const inner = rel(abs).slice(config.blog.root.length + 1);
    const top = inner.split('/')[0].normalize('NFC');
    dest.topic = topicSlugs[top] || slugify(top);
    if (dest.isIndex) {
      const folder = path.basename(path.dirname(abs)).normalize('NFC');
      const isTop = !path.dirname(inner).includes('/');
      dest.publicSlug = claim(isTop ? dest.topic : slugify(stripPrefix(folder)), dest.topic);
      dest.url = `/topics/${dest.publicSlug}/`;
    } else {
      dest.publicSlug = claim(slugify(stripPrefix(nameOf(abs))).slice(0, 80).replace(/-+$/, ''), dest.topic);
      dest.url = `/blog/${dest.publicSlug}/`;
    }
  } else {
    if (dest.isIndex) dest.url = `/projects/${dest.project}/`;
    else {
      const s = claim(`${dest.project}/${slugify(stripPrefix(nameOf(abs))).slice(0, 80).replace(/-+$/, '')}`);
      dest.url = `/projects/${s}/`;
    }
  }
}

// ---------- last-updated dates from the vault's git history ----------
const updated = new Map();
try {
  const log = execFileSync('git', ['-C', VAULT, '-c', 'core.quotePath=false', 'log', '--format=@%cs', '--name-only'], {
    maxBuffer: 256 * 1024 * 1024,
    encoding: 'utf8',
  });
  let day = null;
  for (const line of log.split('\n')) {
    if (line.startsWith('@')) day = line.slice(1);
    else if (line && !updated.has(line.normalize('NFC'))) updated.set(line.normalize('NFC'), day);
  }
} catch {}
const updatedOf = (abs) =>
  updated.get(rel(abs).normalize('NFC')) || fs.statSync(abs).mtime.toISOString().slice(0, 10);

// ---------- topic graph (for the home page map) ----------
const graph = { nodes: {}, edges: {} };
const noteLinks = new Set(); // "absA\u0000absB" pairs between published blog notes (for the galaxy)
const linkFrom = (fromAbs, toAbs) => {
  const a = published.get(fromAbs), b = published.get(toAbs);
  if (!a || !b || a.collection !== 'blog' || b.collection !== 'blog') return;
  if (fromAbs !== toAbs) noteLinks.add([fromAbs, toAbs].sort().join('\u0000'));
  if (a.topic === b.topic) return;
  const k = [a.topic, b.topic].sort().join('|');
  graph.edges[k] = (graph.edges[k] || 0) + 1;
};

// ---------- link resolution ----------
function resolveNote(target, fromAbs) {
  const t = target.replace(/\.md$/i, '').trim();
  if (!t) return null;
  if (t.includes('/')) {
    const abs = path.join(VAULT, t + '.md');
    if (published.has(abs)) return abs;
    if (sourceOfArticle.has(abs)) return sourceOfArticle.get(abs);
  }
  const base = path.basename(t).toLowerCase();
  const cands = (byBasename.get(base) || []).filter((c) => c.endsWith('.md'));
  if (!cands.length) return null;
  // prefer the candidate closest to the current note
  const fromDir = path.dirname(fromAbs);
  cands.sort((a, b) => commonPrefix(b, fromDir) - commonPrefix(a, fromDir));
  // a finished article stands in for its source note
  return sourceOfArticle.get(cands[0]) || cands[0];
}
const commonPrefix = (a, b) => {
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i++;
  return i;
};

// ---------- images ----------
// publishAsset() only decides the public name (so links can be rewritten while the notes are converted);
// the files are written later by processAssets(), which also measures them for src/data/images.json.
const assetJobs = new Map(); // abs → { abs, ext, stem, file, url, raster, digest }
const jobsByContent = new Map(); // sha1 of the file bytes → job: byte-identical images at two vault paths publish once
let noteImages = null; // images embedded by the note being converted, in order (for the cover pick)
let noteAlts = null; // job → the alt text it was embedded with in that note (for cover_alt)
// Sentinel returned by publishAsset() for a photo on the privacy list (site.config.json images.exclude):
// it is never written to public/ and its embed is dropped from the note, not only kept out of covers and the gallery.
const PRIVATE = Symbol('private');

/** Public file stem of a vault image: slug of its name + a hash of its vault path. */
const assetStem = (abs) => {
  const ext = path.extname(abs);
  const hash = crypto.createHash('sha1').update(rel(abs)).digest('hex').slice(0, 8);
  return `${slugify(path.basename(abs, ext))}-${hash}`;
};

function resolveAsset(name, fromAbs) {
  let decoded = name;
  try {
    decoded = decodeURI(name);
  } catch {}
  // relative to the note, then relative to the vault root (Obsidian writes full vault paths)
  for (const p of [path.resolve(path.dirname(fromAbs), decoded), path.join(VAULT, decoded)]) {
    if (fs.existsSync(p) && fs.statSync(p).isFile()) return p;
  }
  const cands = byBasename.get(path.basename(decoded).toLowerCase()) || [];
  if (!cands.length) return null;
  const fromDir = path.dirname(fromAbs);
  return [...cands].sort((a, b) => commonPrefix(b, fromDir) - commonPrefix(a, fromDir))[0];
}

/** True when a vault image matches the privacy list (images.exclude), by its public stem or file name. */
function isPrivateImage(abs) {
  const ext = path.extname(abs).toLowerCase();
  const stem = assetStem(abs);
  return excludedRes.some((re) => re.test(stem) || re.test(stem + ext) || re.test(stem + '.webp'));
}

function assetJob(abs) {
  const ext = path.extname(abs).toLowerCase();
  if (!IMAGE_EXT.has(ext)) return null;
  if (fs.statSync(abs).size > MAX_IMAGE_BYTES) return null;
  if (isPrivateImage(abs)) return null;
  let job = assetJobs.get(abs);
  if (!job) {
    const digest = crypto.createHash('sha1').update(fs.readFileSync(abs)).digest('hex');
    job = jobsByContent.get(digest);
    if (!job) {
      const stem = assetStem(abs);
      const raster = RASTER_EXT.has(ext);
      const file = stem + (raster ? '.webp' : ext);
      job = { abs, ext, stem, file, url: `/vault-assets/${file}`, raster, digest };
      jobsByContent.set(digest, job);
    }
    assetJobs.set(abs, job);
  }
  return job;
}

function publishAsset(name, fromAbs, alt = '') {
  const abs = resolveAsset(name, fromAbs);
  if (abs && IMAGE_EXT.has(path.extname(abs).toLowerCase()) && isPrivateImage(abs)) {
    privateDropped.add(rel(abs));
    return PRIVATE;
  }
  const job = abs && assetJob(abs);
  if (!job) return null;
  if (noteImages) noteImages.push(job);
  if (noteAlts && alt && !noteAlts.has(job)) noteAlts.set(job, alt);
  return job.url;
}

/** Width and height of an SVG from its attributes or viewBox (when sharp cannot read it). */
function svgSize(file) {
  const head = fs.readFileSync(file, 'utf8').slice(0, 4000);
  const tag = (head.match(/<svg[^>]*>/i) || [''])[0];
  const num = (attr) => {
    const m = tag.match(new RegExp(`\\s${attr}=["']\\s*([\\d.]+)(px)?\\s*["']`, 'i'));
    return m ? Math.round(Number(m[1])) : 0;
  };
  let w = num('width'), h = num('height');
  const vb = tag.match(/viewBox=["']\s*[-\d.]+[\s,]+[-\d.]+[\s,]+([\d.]+)[\s,]+([\d.]+)/i);
  if ((!w || !h) && vb) [w, h] = [Math.round(Number(vb[1])), Math.round(Number(vb[2]))];
  return w && h ? { w, h } : null;
}

async function convertRaster(job) {
  const st = fs.statSync(job.abs);
  const key = crypto.createHash('sha1').update(`${job.abs}|${st.size}|${st.mtimeMs}|${ENCODE_KEY}`).digest('hex');
  const cached = path.join(CACHE_DIR, key + '.webp');
  const meta = path.join(CACHE_DIR, key + '.json');
  if (fs.existsSync(cached) && fs.existsSync(meta)) {
    fs.copyFileSync(cached, path.join(OUT_ASSETS, job.file));
    return JSON.parse(fs.readFileSync(meta, 'utf8'));
  }
  const { data, info } = await sharp(job.abs, { failOn: 'none' })
    .rotate()
    .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: WEBP_QUALITY })
    .toBuffer({ resolveWithObject: true });
  const dims = { w: info.width, h: info.height };
  fs.writeFileSync(path.join(OUT_ASSETS, job.file), data);
  try {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
    fs.writeFileSync(cached, data);
    fs.writeFileSync(meta, JSON.stringify(dims));
  } catch {}
  return dims;
}

async function copyOther(job) {
  const out = path.join(OUT_ASSETS, job.file);
  fs.copyFileSync(job.abs, out);
  try {
    const m = await sharp(job.abs, { failOn: 'none' }).metadata();
    const h = m.pageHeight || m.height;
    if (m.width && h) return { w: m.width, h };
  } catch {}
  return job.ext === '.svg' ? svgSize(job.abs) : null;
}

/** Writes every queued image and returns { url: {w, h} }. Failed conversions fall back to the original file. */
async function processAssets() {
  const dims = {};
  const jobs = [...new Set(assetJobs.values())];
  let next = 0;
  const worker = async () => {
    while (next < jobs.length) {
      const job = jobs[next++];
      try {
        const d = job.raster ? await convertRaster(job) : await copyOther(job);
        if (d) dims[job.url] = d;
      } catch (err) {
        // keep the original bytes under their own extension; the note links are remapped afterwards
        const file = job.stem + job.ext;
        fs.copyFileSync(job.abs, path.join(OUT_ASSETS, file));
        const url = `/vault-assets/${file}`;
        console.warn(`WebP conversion failed for ${rel(job.abs)} (${err.message}); published the original as ${url}`);
        job.failedUrl = job.url;
        job.url = url;
        job.file = file;
        job.raster = false;
      }
    }
  };
  await Promise.all(Array.from({ length: 4 }, worker));
  return dims;
}

const headingAnchor = (h) =>
  h
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s/g, '-');

const mdText = (s) => s.replace(/([\[\]])/g, '\\$1');

// ---------- markdown transforms (outside code) ----------
function transformInline(text, fromAbs, stats) {
  // embeds: ![[file|alias]]
  text = text.replace(/!\[\[([^\]]+?)\]\]/g, (_, inner) => {
    const [target, alias] = inner.split('|');
    const [file] = target.split('#');
    const ext = path.extname(file).toLowerCase();
    if (IMAGE_EXT.has(ext)) {
      const alt = alias && !/^\d+(x\d+)?$/.test(alias) ? alias : path.basename(file, ext);
      const url = publishAsset(file, fromAbs, alt);
      if (url === PRIVATE) return '';
      if (url) return `![${mdText(alt)}](${url})`;
      stats.missingAssets++;
      return '';
    }
    if (!ext || ext === '.md') return linkFor(target, alias, fromAbs, stats);
    return `*${mdText(alias || path.basename(file))}*`; // pdf, canvas, docx… not published
  });
  // wikilinks: [[target#heading|alias]]
  text = text.replace(/\[\[([^\]]+?)\]\]/g, (_, inner) => {
    const [target, ...rest] = inner.split('|');
    return linkFor(target, rest.join('|'), fromAbs, stats);
  });
  // relative markdown images ![alt](assets/x.png)
  text = text.replace(/!\[([^\]]*)\]\((?!https?:|\/)([^)\s]+)\)/g, (m, alt, href) => {
    const url = publishAsset(href, fromAbs, alt);
    if (url === PRIVATE) return '';
    return url ? `![${alt}](${url})` : alt ? `*${alt}*` : '';
  });
  // signed, expiring remote images (Coursera imageAssetProxy, any URL with an Expires= signature) break after
  // a while and render as broken boxes: keep only their alt text, set in italics like a missing local image
  text = text.replace(/!\[([^\]]*)\]\((https?:\/\/[^)\s]+)\)/g, (m, alt, href) =>
    /imageAssetProxy|[?&]Expires=/i.test(href) ? (alt ? `*${alt}*` : '') : m
  );
  // ==highlight==
  text = text.replace(/==([^=\n]+)==/g, '<mark>$1</mark>');
  return text;
}

function linkFor(target, alias, fromAbs, stats) {
  const [file, heading] = target.split('#');
  const label = (alias || (file ? path.basename(file) : heading) || '').trim();
  if (!file) return `[${mdText(label)}](#${headingAnchor(heading)})`;
  const abs = resolveNote(file, fromAbs);
  const dest = abs && published.get(abs);
  if (!dest) {
    stats.unresolved++;
    return mdText(label);
  }
  linkFrom(fromAbs, abs);
  return `[${mdText(label)}](${dest.url}${heading ? '#' + headingAnchor(heading) : ''})`;
}

function convertCallouts(lines) {
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/^>\s*\[!(\w+)\]([+-]?)\s*(.*)$/);
    if (!m) {
      out.push(lines[i]);
      continue;
    }
    const [, type, fold, title] = m;
    const body = [];
    while (i + 1 < lines.length && /^>/.test(lines[i + 1])) body.push(lines[++i].replace(/^>\s?/, ''));
    const kind = type.toLowerCase();
    const heading = (title || type.charAt(0).toUpperCase() + type.slice(1)).replace(/`([^`]+)`/g, '<code>$1</code>');
    if (fold) {
      out.push(`<details class="callout callout-${kind}"${fold === '+' ? ' open' : ''}>`, `<summary>${heading}</summary>`, '');
      out.push(...body, '', '</details>');
    } else {
      out.push(`<div class="callout callout-${kind}">`, `<p class="callout-title">${heading}</p>`, '');
      out.push(...body, '', '</div>');
    }
  }
  return out;
}

function convertBody(content, fromAbs, stats) {
  content = content.replace(/%%[\s\S]*?%%/g, '');
  const lines = content.split('\n');
  const out = [];
  let fence = null; // { marker, lang, buf }
  let prose = [];
  const flushProse = () => {
    if (!prose.length) return;
    const converted = convertCallouts(prose).map((l) => {
      // keep inline code untouched
      return l
        .split(/(`[^`]*`)/)
        .map((part, idx) => (idx % 2 ? part : transformInline(part, fromAbs, stats)))
        .join('');
    });
    out.push(...converted);
    prose = [];
  };
  for (const line of lines) {
    if (!fence) {
      const m = line.match(/^(\s*)(```+|~~~+)\s*([\w-]*)/);
      if (m) {
        flushProse();
        fence = { marker: m[2], lang: m[3].toLowerCase(), buf: [m[3] ? line.replace(m[3], m[3].toLowerCase()) : line] };
        continue;
      }
      prose.push(line);
    } else {
      fence.buf.push(line);
      if (line.trim().startsWith(fence.marker) && line.trim().replace(/[`~]/g, '') === '') {
        if (!['dataview', 'dataviewjs', 'tasks', 'query'].includes(fence.lang)) out.push(...fence.buf);
        fence = null;
      }
    }
  }
  if (fence) out.push(...fence.buf);
  flushProse();
  return out.join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n';
}

// ---------- write ----------
rmrf(OUT_BLOG);
rmrf(OUT_PROJECTS);
rmrf(OUT_ASSETS);
rmrf(OUT_THUMBS);

const stats = { notes: 0, unresolved: 0, missingAssets: 0, covers: 0, noDims: 0 };
const pending = [];
const globRe = (g) =>
  new RegExp('^' + g.split('*').map((x) => x.replace(/[.+?^${}()|[\]\\]/g, '\\$&')).join('.*') + '$', 'i');
// privacy list: never published anywhere (prose, covers, gallery)
const excludedRes = (imgCfg.exclude || []).map(globRe);
const privateDropped = new Set();
const toArray = (v) => (Array.isArray(v) ? v : v == null || v === '' ? [] : [v]);
const toDate = (v) => {
  if (!v) return undefined;
  const d = v instanceof Date ? v : new Date(String(v));
  return isNaN(d) ? undefined : d.toISOString().slice(0, 10);
};

for (const [abs, dest] of published) {
  const { data, content } = parsed.get(abs);
  const r = rel(abs);
  const baseTitle = path.basename(abs, '.md');
  const isMoc = data.type === 'MOC' || /^_MOC - /.test(baseTitle);
  let title = (data.title ? String(data.title) : baseTitle.replace(/^_MOC - /, '')).normalize('NFC');
  title = title.replace(/^_MOC_?\s*/, '');
  const folderParts = path.dirname(r).split('/');
  const fm = {
    title,
    type: isMoc ? 'MOC' : String(data.type || 'note'),
    tags: toArray(data.tags).map(String).filter((t) => t !== 'second-brain'),
    section: dest.collection === 'blog' ? (folderParts[1] || 'Resources').normalize('NFC') : undefined,
    folder: folderParts.slice(dest.collection === 'blog' ? 1 : 0).join(' / ').normalize('NFC'),
    vaultPath: dest.article ? rel(dest.article) : r,
    url: dest.url,
    topic: dest.topic,
    updated: updatedOf(dest.article || abs),
    source: data.source && /^https?:/.test(String(data.source)) ? String(data.source) : undefined,
    date: toDate(data.date),
    status: data.status ? String(data.status) : undefined,
    deadline: toDate(data.deadline),
    order: (baseTitle.match(/^(\d+)/) || [])[1] ? Number(baseTitle.match(/^(\d+)/)[1]) : undefined,
  };
  if (dest.collection === 'projects') {
    fm.project = dest.project;
    fm.isIndex = dest.isIndex;
    if (dest.isIndex) {
      fm.featured = !!dest.cfg.featured;
      if (dest.cfg.title) fm.title = dest.cfg.title;
      if (dest.cfg.summary_vi) fm.summary_vi = dest.cfg.summary_vi;
      if (dest.cfg.summary_en) fm.summary_en = dest.cfg.summary_en;
      fm.links = Object.fromEntries(Object.entries(dest.cfg.links || {}).filter(([, v]) => v));
    }
  }
  noteImages = [];
  noteAlts = new Map();
  let body = convertBody(content, abs, stats);
  const images = noteImages;
  const alts = noteAlts;
  noteImages = null;
  noteAlts = null;
  // vault-side `cover:` picks the photo (`cover: none` turns the automatic pick off)
  let explicitCover = null;
  if (data.cover != null && data.cover !== '') {
    const v = String(data.cover).trim();
    if (data.cover === false || /^(none|false|off|no)$/i.test(v)) explicitCover = 'none';
    else if (/^https?:/.test(v)) explicitCover = { url: v };
    else {
      const name = v.replace(/^!?\[\[|\]\]$/g, '').split('|')[0].replace(/^<|>$/g, '');
      const abs2 = resolveAsset(name, abs);
      const job = abs2 && assetJob(abs2);
      if (job) explicitCover = job;
      else if (abs2 && isPrivateImage(abs2)) explicitCover = 'none';
      else console.warn(`cover not found for ${r}: ${v}`);
    }
  }
  if (dest.collection === 'projects' && dest.isIndex) {
    const todo = content.split(/^## /m).find((sec) => /^(Việc cần làm|Tasks|To do)/i.test(sec));
    if (todo) {
      const phases = todo
        .split(/^### /m)
        .slice(1)
        .map((sec) => {
          const name = sec.split('\n')[0].trim();
          const done = (sec.match(/^\s*- \[[xX]\]/gm) || []).length;
          const total = done + (sec.match(/^\s*- \[ \]/gm) || []).length;
          return { name, done, total };
        })
        .filter((ph) => ph.total > 0);
      if (phases.length) fm.phases = phases;
    }
    // The task list stays in the vault (it feeds the phase track above) but is not shown on the site, and the
    // "Map of Content" list is replaced by the page's own list of sub-pages.
    body = body
      .split(/^(?=## )/m)
      .filter((sec) => !/^## (Việc cần làm|Tasks|To do|Map of Content)\b/i.test(sec))
      .join('')
      .replace(/\s+$/, '\n');
  }
  // drop the "**Links:** …" navigation line copied from the vault; the site renders its own nav
  body = body.replace(/^\*\*Links:\*\*.*\n/m, '');
  // the page renders the title itself
  {
    const norm = (x) => x.normalize('NFC').replace(/[*_`]/g, '').trim().toLowerCase();
    const lines = body.split('\n');
    const i = lines.findIndex((l) => /^# /.test(l));
    if (i !== -1 && (i < 3 || norm(lines[i].slice(2)) === norm(title))) lines.splice(i, 1);
    body = lines.join('\n').replace(/^\s+/, '');
  }
  // hide personal email addresses unless allow-listed in site.config.json
  const allowEmails = new Set((config.allowEmails || []).map((e) => e.toLowerCase()));
  body = body.replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[a-z]{2,}/g, (e) =>
    allowEmails.has(e.toLowerCase()) || /^(ban|you|name|user)@email\.com$/i.test(e) ? e : '[email hidden]'
  );
  // first paragraph as description
  const firstPara = body
    .split('\n\n')
    .map((b) => b.trim())
    .find((b) => b && !b.startsWith('#') && !b.startsWith('<') && !b.startsWith('|') && !b.startsWith('!['));
  if (firstPara) {
    fm.description = firstPara
      .replace(/^>\s?/gm, '')
      .replace(/^[-*]\s+/gm, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/[*_`#]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 220);
  }
  for (const k of Object.keys(fm)) if (fm[k] === undefined) delete fm[k];
  const outDir = dest.collection === 'blog' ? OUT_BLOG : OUT_PROJECTS;
  const outFile = path.join(outDir, dest.slug + (dest.isIndex ? '/index' : '') + '.md');
  fm.isIndex = !!dest.isIndex;
  pending.push({ abs, dest, data, fm, body, outFile, images, alts, explicitCover });
}

// ---------- images: convert, measure, pick covers ----------
const imageDims = await processAssets();
const remap = [...assetJobs.values()].filter((j) => j.failedUrl);
const coverSkip = (imgCfg.coverSkip || []).map(globRe);
const excluded = (imgCfg.exclude || []).map(globRe);
const coverSkipFolders = (imgCfg.coverSkipFolders || []).map((f) => f.replace(/\/$/, '') + '/');
// notes whose photos are all dissections (or otherwise unfit as a banner): no automatic cover, procedural instead
const coverSkipNotes = new Set((imgCfg.coverSkipNotes || []).map((n) => n.normalize('NFC')));
const stemMatches = (res, job) => res.some((re) => re.test(job.stem) || re.test(job.file));
const isExcludedImage = (job) => stemMatches(excluded, job);
/** Automatic cover: the note's first JPG with an aspect ratio of 0.6–1.8 that is not a screenshot, a handwritten page or excluded. */
function autoCover(images) {
  for (const job of images) {
    if (!['.jpg', '.jpeg'].includes(job.ext)) continue;
    if (stemMatches(coverSkip, job) || isExcludedImage(job)) continue;
    if (coverSkipFolders.some((f) => rel(job.abs).normalize('NFC').startsWith(f.normalize('NFC')))) continue;
    const d = imageDims[job.url];
    if (!d) continue;
    const ratio = d.w / d.h;
    if (ratio >= 0.6 && ratio <= 1.8) return job;
  }
  return null;
}
// Post covers are shown at most 420 CSS px wide (desktop column) or as a full-width 16:7 strip below 900px, so a
// real-photo cover gets 480px and 960px WebP renditions next to its asset (Cover.astro emits srcset/sizes).
// A photo that is also in the home gallery reuses the gallery's hand-tuned crop (it hides hands and the like).
const galleryByDigest = new Map();
{
  const byStem0 = new Map();
  for (const f of allFiles) if (RASTER_EXT.has(path.extname(f).toLowerCase())) byStem0.set(assetStem(f), f);
  for (const g of config.gallery || []) {
    const f = byStem0.get(String(g.file || '').replace(/\.[a-z0-9]+$/i, ''));
    if (f) galleryByDigest.set(crypto.createHash('sha1').update(fs.readFileSync(f)).digest('hex'), g);
  }
}
const COVER_WIDTHS = [480, 960];
const coverRenditions = new Map(); // job → url of the widest rendition
async function coverRendition(job) {
  if (!job.raster || job.failedUrl) return job.url;
  if (coverRenditions.has(job)) return coverRenditions.get(job);
  const g = galleryByDigest.get(job.digest);
  const base = await sharp(job.abs, { failOn: 'none' }).rotate().toBuffer({ resolveWithObject: true });
  const W = base.info.width, H = base.info.height;
  let region = null;
  if (g && Array.isArray(g.crop) && g.crop.length === 4) {
    const [x, y, w, h] = g.crop.map(Number);
    const left = Math.round(x * W), top = Math.round(y * H);
    region = { left, top, width: Math.min(Math.round(w * W), W - left), height: Math.min(Math.round(h * H), H - top) };
  }
  let url = job.url;
  for (const w of COVER_WIDTHS) {
    let p = sharp(base.data);
    if (region) p = p.extract(region);
    const file = `${job.stem}-cover-${w}.webp`;
    const info = await p.resize({ width: w, withoutEnlargement: true }).webp({ quality: WEBP_QUALITY }).toFile(path.join(OUT_ASSETS, file));
    url = `/vault-assets/${file}`;
    imageDims[url] = { w: info.width, h: info.height };
  }
  coverRenditions.set(job, url);
  return url;
}
/** Alt text worth keeping for a cover: not a camera file name such as IMG_1234 or the bare file name. */
const meaningfulAlt = (alt, job) => {
  const a = String(alt || '').trim();
  if (a.length < 4) return '';
  if (/^(img|dsc|dscn|dcim|pxl|image|photo|pasted image|screenshot|ảnh chụp màn hình)[\s_-]*\d/i.test(a)) return '';
  if (slugify(a) === slugify(path.basename(job.abs, path.extname(job.abs)))) return '';
  return a;
};
const publicFileExists = (src) => src.startsWith('/') && fs.existsSync(path.join(ROOT, 'public', decodeURI(src.split(/[?#]/)[0])));

for (const p of pending) {
  const { abs, dest, data, fm, outFile, images, alts, explicitCover } = p;
  let body = p.body;
  for (const j of remap) body = body.split(j.failedUrl).join(j.url);
  for (const job of images) if (!imageDims[job.url]) {
    stats.noDims++;
    console.warn(`no dimensions for ${job.url} (${rel(abs)}): rendered without width/height`);
  }
  let src = null;
  let coverJob = null;
  if (explicitCover && explicitCover !== 'none') {
    src = explicitCover.url;
    coverJob = explicitCover.abs ? explicitCover : null;
  }
  else if (!explicitCover && !dest.isIndex && !coverSkipNotes.has(rel(abs).normalize('NFC'))) coverJob = autoCover(images);
  if (coverJob && coverJob.abs) src = await coverRendition(coverJob);
  // cover_alt: the vault value, else the alt the photo was embedded with, else its gallery alt; otherwise decorative
  const alt = data.cover_alt
    ? String(data.cover_alt)
    : coverJob && coverJob.abs
      ? meaningfulAlt(alts.get(coverJob), coverJob) || galleryByDigest.get(coverJob.digest)?.alt || ''
      : '';
  if (dest.collection === 'projects') {
    // site.config.json projects[].cover ({src, alt, alt_en}) wins on the project page; an empty src keeps the procedural banner
    const c = dest.isIndex && dest.cfg.cover;
    if (c && c.src) {
      if (/^https?:/.test(c.src) || publicFileExists(c.src)) fm.cover = { src: c.src, alt: c.alt || '', ...(c.alt_en ? { alt_en: c.alt_en } : {}) };
      else console.warn(`project cover ${c.src} for ${dest.project} does not exist yet; using the procedural banner`);
    } else if (src) fm.cover = { src, alt };
  } else if (src) {
    fm.cover = src;
    if (alt) fm.cover_alt = alt;
  }
  if (fm.cover) stats.covers++;
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, matter.stringify(body, fm));
  stats.notes++;
}
fs.mkdirSync(path.dirname(IMAGES_JSON), { recursive: true });
fs.writeFileSync(
  IMAGES_JSON,
  '{\n' +
    Object.entries(imageDims)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([url, d]) => `  ${JSON.stringify(url)}: { "w": ${d.w}, "h": ${d.h} }`)
      .join(',\n') +
    '\n}\n'
);

// ---------- home strip "Từ phòng lab và thực địa": owner-approved photos only (site.config.json "gallery", spec §7.2) ----------
// Each photo gets 480px and 960px WebP in true colour and in a fluorescence LUT (black → --void #10052e,
// white → the note's topic hex), written to public/vault-thumbs/ and listed in src/data/gallery.json.
{
  const topicHex = {};
  try {
    const ts = fs.readFileSync(path.join(ROOT, 'src/data/topics.ts'), 'utf8');
    for (const m of ts.matchAll(/id:\s*'([^']+)'[\s\S]*?hex:\s*'(#[0-9a-fA-F]{6})'/g)) topicHex[m[1]] = m[2];
  } catch {}
  const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  const VOID = rgb('#10052e');
  // notes are named by vault path (or bare file name), compared in NFC because macOS may store names decomposed
  const noteByPath = new Map();
  for (const abs of published.keys()) {
    const k = rel(abs).normalize('NFC').replace(/\.md$/i, '');
    noteByPath.set(k, abs);
    if (!noteByPath.has(path.basename(k))) noteByPath.set(path.basename(k), abs);
  }
  const byStem = new Map();
  for (const f of allFiles) if (RASTER_EXT.has(path.extname(f).toLowerCase())) byStem.set(assetStem(f), f);
  const entries = [];
  for (const g of config.gallery || []) {
    const stem = String(g.file || '').replace(/\.[a-z0-9]+$/i, '');
    const srcAbs = byStem.get(stem);
    const note = g.note && noteByPath.get(String(g.note).normalize('NFC').replace(/\.md$/i, ''));
    const dest = note && published.get(note);
    if (!srcAbs) { console.warn(`gallery: ${g.file} not found in the vault`); continue; }
    // screenshots, handwritten pages, dissections and excluded photos never reach the gallery, even when listed
    if (isExcludedImage({ stem, file: g.file }) || stemMatches(coverSkip, { stem, file: g.file })) {
      console.warn(`gallery: ${g.file} matches images.exclude or images.coverSkip; skipped`);
      continue;
    }
    if (!dest) { console.warn(`gallery: note ${g.note} is not published; ${g.file} skipped`); continue; }
    const base = await sharp(srcAbs, { failOn: 'none' }).rotate().toBuffer({ resolveWithObject: true });
    const W = base.info.width, H = base.info.height;
    let region = null;
    if (Array.isArray(g.crop) && g.crop.length === 4) {
      const [x, y, w, h] = g.crop.map(Number);
      const left = Math.round(x * W), top = Math.round(y * H);
      region = { left, top, width: Math.min(Math.round(w * W), W - left), height: Math.min(Math.round(h * H), H - top) };
    }
    const hex = topicHex[dest.topic] || topicHex.biology || '#2ef2ff';
    const ink = rgb(hex);
    const pipe = (w) => {
      let p = sharp(base.data);
      if (region) p = p.extract(region);
      return p.resize({ width: w, withoutEnlargement: true });
    };
    const tc = [], lut = [];
    let size = null;
    for (const w of [480, 960]) {
      const tName = `${stem}-${w}.webp`, lName = `${stem}-${w}-lut.webp`;
      const t = await pipe(w).webp({ quality: WEBP_QUALITY }).toFile(path.join(OUT_THUMBS, tName));
      // LUT: grey level g maps linearly from VOID (g = 0) to the topic hex (g = 255)
      const { data: grey, info } = await pipe(w).toColourspace('b-w').raw().toBuffer({ resolveWithObject: true });
      const n = info.width * info.height, ch = info.channels;
      const out = Buffer.alloc(n * 3);
      for (let i = 0; i < n; i++) {
        const v = grey[i * ch] / 255;
        for (let c = 0; c < 3; c++) out[i * 3 + c] = Math.round(VOID[c] + (ink[c] - VOID[c]) * v);
      }
      await sharp(out, { raw: { width: info.width, height: info.height, channels: 3 } })
        .webp({ quality: WEBP_QUALITY })
        .toFile(path.join(OUT_THUMBS, lName));
      tc.push(`/vault-thumbs/${tName} ${t.width}w`);
      lut.push(`/vault-thumbs/${lName} ${t.width}w`);
      size = { width: t.width, height: t.height };
    }
    entries.push({
      file: g.file,
      url: dest.url,
      // gallery[].caption overrides the note title, so two photos from one note still say what each shows
      title: g.caption || titleOf(note).replace(/^_MOC - /, ''),
      ...(g.caption_en ? { title_en: g.caption_en } : {}),
      topic: dest.topic,
      alt: g.alt || '',
      ...(g.alt_en ? { alt_en: g.alt_en } : {}),
      ...(g.sci ? { sci: g.sci } : {}),
      ...size,
      src: tc[tc.length - 1].split(' ')[0],
      srcset: tc.join(', '),
      lut: lut[lut.length - 1].split(' ')[0],
      lutSrcset: lut.join(', '),
    });
  }
  fs.writeFileSync(GALLERY_JSON, JSON.stringify(entries, null, 2) + '\n');
  stats.gallery = entries.length;
}

for (const [abs, dest] of published) {
  if (dest.collection !== 'blog') continue;
  const n = (graph.nodes[dest.topic] ||= { topic: dest.topic, notes: 0, url: `/topics/${dest.topic}/`, title: '' });
  if (dest.isIndex && dest.publicSlug === dest.topic) n.title = titleOf(abs).replace(/^_MOC - /, '');
  else if (!dest.isIndex) n.notes++;
}
fs.mkdirSync(path.join(ROOT, 'src/data'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'hidden-notes.md'), '# Notes hidden from the site (no real content yet)\n\nRe-run `npm run sync` after writing them; they appear automatically.\n\n' + stats0.hidden.sort().map((h) => `- ${h}`).join('\n') + '\n');
fs.writeFileSync(
  path.join(ROOT, 'src/data/graph.json'),
  JSON.stringify(
    {
      nodes: Object.values(graph.nodes).sort((a, b) => b.notes - a.notes),
      edges: Object.entries(graph.edges).map(([k, w]) => ({ a: k.split('|')[0], b: k.split('|')[1], weight: w })),
    },
    null,
    2
  )
);

// ---------- galaxy data (3D star map on the home page), loaded by the browser from /data/galaxy.json ----------
{
  const blog = [...published.entries()].filter(([, d]) => d.collection === 'blog');
  const bySlug = new Map(blog.map(([abs, d]) => [d.slug, abs]));
  const ids = new Map();
  const nodes = blog
    .sort(([, a], [, b]) => a.slug.localeCompare(b.slug, 'vi', { numeric: true }))
    .map(([abs, d], i) => {
      ids.set(abs, i);
      return { t: titleOf(abs).replace(/^_MOC - /, ''), u: d.url, g: d.topic, k: d.isIndex ? (d.slug.includes('/') ? 1 : 2) : 0, slug: d.slug };
    });
  // parent = nearest published folder index above this entry
  for (const n of nodes) {
    let s = n.slug;
    n.p = -1;
    while (s.includes('/')) {
      s = s.slice(0, s.lastIndexOf('/'));
      const abs = bySlug.get(s);
      if (abs && published.get(abs).isIndex && abs !== bySlug.get(n.slug)) { n.p = ids.get(abs); break; }
    }
  }
  const links = [...noteLinks]
    .map((k) => k.split('\u0000').map((a) => ids.get(a)))
    .filter(([a, b]) => a !== undefined && b !== undefined);
  fs.mkdirSync(path.join(ROOT, 'public/data'), { recursive: true });
  fs.writeFileSync(
    path.join(ROOT, 'public/data/galaxy.json'),
    JSON.stringify({ nodes: nodes.map(({ slug, ...n }) => n), links })
  );
}

console.log(
  `Synced ${stats.notes} notes (${[...published.values()].filter((d) => d.collection === 'blog').length} blog, ` +
    `${[...published.values()].filter((d) => d.collection === 'projects').length} project), ` +
    `${new Set(assetJobs.values()).size} images (${stats.covers} covers, ${stats.gallery} gallery photos, ${stats.noDims} without dimensions). ` +
    `Unpublished link targets: ${stats.unresolved}. Missing/oversized images: ${stats.missingAssets}. Hidden (no real content yet): ${stats0.skeletons}. ` +
    `Finished articles in place of notes: ${stats1.articles}.` +
    (privateDropped.size ? ` Private photos dropped from notes (images.exclude): ${privateDropped.size}.` : '')
);
