#!/usr/bin/env node
// Sync notes from the Obsidian vault into Astro content collections.
//   Blog     ← every .md under config.blog.root (minus config.blog.exclude)
//   Projects ← every .md inside each folder listed in config.projects
// Wikilinks, embeds, callouts and Obsidian-only syntax are converted to plain Markdown.
// Usage: VAULT_DIR=../Sky_Vault node scripts/sync-vault.mjs
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import matter from 'gray-matter';
import { execFileSync } from 'node:child_process';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const config = JSON.parse(fs.readFileSync(path.join(ROOT, 'site.config.json'), 'utf8'));
const VAULT = path.resolve(ROOT, process.env.VAULT_DIR || '../Sky_Vault');
const OUT_BLOG = path.join(ROOT, 'src/content/blog');
const OUT_PROJECTS = path.join(ROOT, 'src/content/projects');
const OUT_ASSETS = path.join(ROOT, 'public/vault-assets');

if (!fs.existsSync(VAULT)) {
  console.error(`Vault not found at ${VAULT}. Set VAULT_DIR.`);
  process.exit(1);
}

const IMAGE_EXT = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.avif']);
const SKIP_DIRS = new Set(['.obsidian', '.git', '.venv', 'node_modules', '.smart-env', '.claudian', '.qodo', '.trash']);
const SKIP_FILES = new Set(['CLAUDE.md', 'AGENTS.md']);
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

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
const titleCount = new Map();
for (const abs of published.keys()) titleCount.set(titleOf(abs), (titleCount.get(titleOf(abs)) || 0) + 1);
// notes that share a title (e.g. every lesson titled after the course) are named by their file instead
const nameOf = (abs) => (titleCount.get(titleOf(abs)) > 1 ? path.basename(abs, '.md').normalize('NFC') : titleOf(abs));
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
  }
  const base = path.basename(t).toLowerCase();
  const cands = (byBasename.get(base) || []).filter((c) => c.endsWith('.md'));
  if (!cands.length) return null;
  // prefer the candidate closest to the current note
  const fromDir = path.dirname(fromAbs);
  cands.sort((a, b) => commonPrefix(b, fromDir) - commonPrefix(a, fromDir));
  return cands[0];
}
const commonPrefix = (a, b) => {
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i++;
  return i;
};

const copiedAssets = new Map();
function publishAsset(name, fromAbs) {
  let abs = null;
  const direct = path.resolve(path.dirname(fromAbs), decodeURI(name));
  if (fs.existsSync(direct) && fs.statSync(direct).isFile()) abs = direct;
  else {
    const cands = byBasename.get(path.basename(name).toLowerCase()) || [];
    if (cands.length) {
      const fromDir = path.dirname(fromAbs);
      abs = [...cands].sort((a, b) => commonPrefix(b, fromDir) - commonPrefix(a, fromDir))[0];
    }
  }
  if (!abs) return null;
  const ext = path.extname(abs).toLowerCase();
  if (!IMAGE_EXT.has(ext)) return null;
  if (fs.statSync(abs).size > MAX_IMAGE_BYTES) return null;
  if (copiedAssets.has(abs)) return copiedAssets.get(abs);
  const hash = crypto.createHash('sha1').update(rel(abs)).digest('hex').slice(0, 8);
  const file = `${slugify(path.basename(abs, ext))}-${hash}${ext}`;
  const outPath = path.join(OUT_ASSETS, file);
  fs.copyFileSync(abs, outPath);
  // shrink large raster images on macOS (sips is built in); elsewhere copy as-is
  if (process.platform === 'darwin' && ext !== '.svg' && ext !== '.gif' && fs.statSync(outPath).size > 300 * 1024) {
    try {
      execFileSync('sips', ['-Z', '1600', outPath], { stdio: 'ignore' });
    } catch {}
  }
  const url = `/vault-assets/${file}`;
  copiedAssets.set(abs, url);
  return url;
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
      const url = publishAsset(file, fromAbs);
      if (url) return `![${mdText(alias && !/^\d+(x\d+)?$/.test(alias) ? alias : path.basename(file, ext))}](${url})`;
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
    const url = publishAsset(href, fromAbs);
    return url ? `![${alt}](${url})` : alt ? `*${alt}*` : '';
  });
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

const stats = { notes: 0, unresolved: 0, missingAssets: 0 };
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
    vaultPath: r,
    url: dest.url,
    topic: dest.topic,
    updated: updatedOf(abs),
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
  let body = convertBody(content, abs, stats);
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
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, matter.stringify(body, fm));
  stats.notes++;
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
    `${copiedAssets.size} images. Unpublished link targets: ${stats.unresolved}. Missing/oversized images: ${stats.missingAssets}. Hidden (no real content yet): ${stats0.skeletons}.`
);
