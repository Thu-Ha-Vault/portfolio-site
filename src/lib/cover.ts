/**
 * Procedural "vesicle + molecule" covers (spec §7.1, §7.3).
 *
 * coverSvg(seed, topic, variant) is a pure, deterministic function: the same seed always gives the same SVG.
 * The endpoints in src/pages/covers/** and src/pages/og/** prerender one file per post, topic and project,
 * so nothing is committed to public/.
 *
 * URLs (use these helpers, never hand-build the paths):
 *   coverUrls('/blog/foo/')                 → { cover: '/covers/blog/foo.svg', thumb: '/covers/thumb/blog/foo.svg', og: '/og/blog/foo.png' }
 *   coverUrls('/projects/virtual-lab/x/')   → { cover: '/covers/projects/virtual-lab/x.svg', … }
 *   ogUrl('/') → '/og/home.png', ogUrl('/blog/') → '/og/blog.png' (also 'topics' and 'projects').
 * Extension routes are exempt from trailingSlash: 'always', so these URLs never take a trailing slash.
 */
import { TOPICS, IRIS_STOPS, topicById, type Poly } from '../data/topics';

export type CoverVariant = 'banner' | 'thumb' | 'og';
export type Motif = 'poly' | 'wheel' | 'icosphere';

/** Rendered sizes. The banner viewBox is 640×360 (16:9); OG crops it to 640×336 and renders at 1200×630. */
export const COVER_SIZE = {
  banner: { width: 640, height: 360 },
  thumb: { width: 96, height: 96 },
  og: { width: 1200, height: 630 },
} as const;

/** Fixed OG images for pages that are not content entries. Keys are the `og/<key>.png` file names. */
export const PAGE_OG = {
  home: { seed: 'home', topic: undefined },
  blog: { seed: 'blog', topic: undefined },
  topics: { seed: 'topics', topic: undefined },
  projects: { seed: 'projects', topic: undefined },
} as const;

/**
 * Colour channel for projects (projects have no `topic` field). Only drives the palette, never shown as a label.
 * Cyclistic and Track B also get their own abstract motif (§7.3): no axes, bars or values.
 */
const PROJECT_STYLE: Record<string, { topic: string; motif: Motif }> = {
  'virtual-lab': { topic: 'biology', motif: 'poly' },
  'cyclistic-bike-share': { topic: 'business', motif: 'wheel' },
  'capstone-track-b': { topic: 'biology', motif: 'icosphere' },
};

// ---------------------------------------------------------------------------------------------
// URLs
// ---------------------------------------------------------------------------------------------

/** 'blog/foo' for '/blog/foo/'; 'home' for '/'. Also accepts a key and returns it unchanged. */
export function coverKey(url: string): string {
  const key = url.split(/[?#]/)[0].split('/').filter(Boolean).join('/');
  return key || 'home';
}
export const coverUrl = (url: string) => `/covers/${coverKey(url)}.svg`;
export const thumbUrl = (url: string) => `/covers/thumb/${coverKey(url)}.svg`;
export const ogUrl = (url: string) => `/og/${coverKey(url)}.png`;

/** All three generated image URLs for a content entry URL (data.url). */
export function coverUrls(url: string) {
  return { cover: coverUrl(url), thumb: thumbUrl(url), og: ogUrl(url) };
}

type EntryLike = { data: { url: string; topic?: string; project?: string; cover?: unknown; cover_alt?: string } };

/**
 * The banner image for an entry: a real photo when the entry has one (blog `cover`/`cover_alt` strings,
 * or a project `cover: { src, alt }`), otherwise the procedural cover (decorative, alt '').
 * `og` is always the generated PNG (the real photo is not 1200×630).
 */
export function coverFor(entry: EntryLike): { src: string; alt: string; procedural: boolean; og: string; thumb: string } {
  const d = entry.data;
  const urls = coverUrls(d.url);
  const c = d.cover as unknown;
  if (typeof c === 'string' && c && c !== 'none') return { src: c, alt: d.cover_alt ?? '', procedural: false, og: urls.og, thumb: urls.thumb };
  if (c && typeof c === 'object' && typeof (c as { src?: unknown }).src === 'string') {
    const o = c as { src: string; alt?: string };
    return { src: o.src, alt: o.alt ?? '', procedural: false, og: urls.og, thumb: urls.thumb };
  }
  return { src: urls.cover, alt: '', procedural: true, og: urls.og, thumb: urls.thumb };
}

/** Topic and motif used for an entry's cover. */
export function coverStyle(entry: EntryLike): { topic: string | undefined; motif: Motif } {
  const d = entry.data;
  const project = d.project ?? (d.url.startsWith('/projects/') ? coverKey(d.url).split('/')[1] : undefined);
  const ps = project ? PROJECT_STYLE[project] : undefined;
  if (ps) {
    // The motif belongs to the project page itself; its notes use the plain polyhedron.
    const isProjectRoot = coverKey(d.url) === `projects/${project}`;
    return { topic: d.topic ?? ps.topic, motif: isProjectRoot ? ps.motif : 'poly' };
  }
  return { topic: d.topic, motif: 'poly' };
}

export interface CoverSource {
  key: string;
  seed: string;
  topic: string | undefined;
  motif: Motif;
}

/**
 * Every cover to prerender: all blog entries (posts and topic pages) and all project entries.
 * Used by the getStaticPaths of the cover and OG endpoints. Imports astro:content lazily so the
 * pure functions in this file stay usable outside Astro.
 */
export async function coverSources(): Promise<CoverSource[]> {
  const { getCollection } = await import('astro:content');
  const entries = [...(await getCollection('blog')), ...(await getCollection('projects'))] as unknown as EntryLike[];
  const seen = new Set<string>();
  const out: CoverSource[] = [];
  for (const e of entries) {
    const key = coverKey(e.data.url);
    if (seen.has(key) || key in PAGE_OG) continue;
    seen.add(key);
    out.push({ key, seed: key, ...coverStyle(e) });
  }
  return out;
}

// ---------------------------------------------------------------------------------------------
// Seeded randomness
// ---------------------------------------------------------------------------------------------

/** 32-bit FNV-1a over UTF-16 code units. */
export function fnv1a(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** mulberry32 PRNG: returns floats in [0, 1). */
export function mulberry32(a: number): () => number {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type Rng = () => number;
export const rngFor = (seed: string): Rng => mulberry32(fnv1a(seed));
const range = (r: Rng, a: number, b: number) => a + (b - a) * r();
const n1 = (x: number) => Math.round(x * 10) / 10;
const n2 = (x: number) => Math.round(x * 100) / 100;

// ---------------------------------------------------------------------------------------------
// Colour
// ---------------------------------------------------------------------------------------------

const VOID = '#10052e';
const GLOW = '#4b12a0';
const GLOW_MID = '#2a0a6e';

const rgb = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const toHex = (c: number[]) => '#' + c.map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')).join('');
export const mix = (a: string, b: string, t: number) => {
  const x = rgb(a);
  const y = rgb(b);
  return toHex(x.map((v, i) => v + (y[i] - v) * t));
};

/**
 * Palette for a topic: its hex plus the two neighbours (in iris order) of the iris stop nearest to it.
 * Without a topic, the iris stops themselves (pink, violet, cyan, amber).
 */
export function topicPalette(topic?: string): string[] {
  const t = topicById(topic);
  const stops = IRIS_STOPS.map((s) => s.hex);
  if (!t) return [stops[0], stops[1], stops[2], stops[4]];
  const c = rgb(t.hex);
  let best = 0;
  let bestD = Infinity;
  stops.forEach((s, i) => {
    const d = rgb(s).reduce((acc, v, k) => acc + (v - c[k]) ** 2, 0);
    if (d < bestD) {
      bestD = d;
      best = i;
    }
  });
  const n = stops.length;
  return [t.hex, stops[(best + 1) % n], stops[(best - 1 + n) % n]];
}

// ---------------------------------------------------------------------------------------------
// Geometry: polyhedra, icosphere and wheel as line models
// ---------------------------------------------------------------------------------------------

type V3 = [number, number, number];
interface Model {
  v: V3[];
  e: [number, number][];
  /** faces as vertex index loops (optional; drawn as white .06 fills when front-facing) */
  f: number[][];
}

const PHI = (1 + Math.sqrt(5)) / 2;
const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const len = (a: V3) => Math.sqrt(dot(a, a));
const scale = (a: V3, s: number): V3 => [a[0] * s, a[1] * s, a[2] * s];
const norm = (a: V3): V3 => scale(a, 1 / (len(a) || 1));

function signs(base: V3): V3[] {
  const out: V3[] = [];
  for (const sx of base[0] ? [1, -1] : [1])
    for (const sy of base[1] ? [1, -1] : [1]) for (const sz of base[2] ? [1, -1] : [1]) out.push([base[0] * sx, base[1] * sy, base[2] * sz]);
  return out;
}
const cyc = (p: V3): V3[] => [p, [p[2], p[0], p[1]], [p[1], p[2], p[0]]];

function polyVertices(poly: Poly): V3[] {
  switch (poly) {
    case 'cube':
      return signs([1, 1, 1]);
    case 'octahedron':
      return cyc([1, 0, 0]).flatMap((p) => signs(p));
    case 'tetrahedron':
      return [[1, 1, 1], [1, -1, -1], [-1, 1, -1], [-1, -1, 1]];
    case 'dodecahedron':
      return [...signs([1, 1, 1]), ...cyc([0, 1 / PHI, PHI]).flatMap((p) => signs(p))];
    case 'bipyramid':
      return [
        [0, 1.25, 0],
        [0, -1.25, 0],
        ...[0, 1, 2].map((k): V3 => [Math.cos((k * 2 * Math.PI) / 3), 0, Math.sin((k * 2 * Math.PI) / 3)]),
      ];
    case 'icosahedron':
    default:
      return cyc([0, 1, PHI]).flatMap((p) => signs(p));
  }
}

/** Convex hull faces by brute force (n ≤ 20): every plane through 3 points with all points on one side. */
function hullModel(pts: V3[]): Model {
  const maxR = Math.max(...pts.map(len));
  const v = pts.map((p) => scale(p, 1 / maxR));
  const faces = new Map<string, number[]>();
  const eps = 1e-6;
  for (let i = 0; i < v.length; i++)
    for (let j = i + 1; j < v.length; j++)
      for (let k = j + 1; k < v.length; k++) {
        let nrm = cross(sub(v[j], v[i]), sub(v[k], v[i]));
        if (len(nrm) < eps) continue;
        nrm = norm(nrm);
        let d = dot(nrm, v[i]);
        if (d < 0) {
          nrm = scale(nrm, -1);
          d = -d;
        }
        if (v.some((p) => dot(nrm, p) - d > eps)) continue;
        const on = v.map((p, idx) => (Math.abs(dot(nrm, p) - d) < eps ? idx : -1)).filter((x) => x >= 0);
        const key = on.join(',');
        if (faces.has(key)) continue;
        // order the loop by angle around the face centre
        const c = scale(on.reduce<V3>((acc, idx) => [acc[0] + v[idx][0], acc[1] + v[idx][1], acc[2] + v[idx][2]], [0, 0, 0]), 1 / on.length);
        const u = norm(sub(v[on[0]], c));
        const w = cross(nrm, u);
        on.sort((a, b) => {
          const pa = sub(v[a], c);
          const pb = sub(v[b], c);
          return Math.atan2(dot(pa, w), dot(pa, u)) - Math.atan2(dot(pb, w), dot(pb, u));
        });
        faces.set(key, on);
      }
  const f = [...faces.values()];
  return { v, f, e: edgesOf(f) };
}

function edgesOf(f: number[][]): [number, number][] {
  const seen = new Set<string>();
  const e: [number, number][] = [];
  for (const loop of f)
    loop.forEach((a, i) => {
      const b = loop[(i + 1) % loop.length];
      const k = a < b ? `${a}-${b}` : `${b}-${a}`;
      if (!seen.has(k)) {
        seen.add(k);
        e.push([a, b]);
      }
    });
  return e;
}

const modelCache = new Map<string, Model>();

function polyModel(poly: Poly): Model {
  const k = `poly:${poly}`;
  if (!modelCache.has(k)) modelCache.set(k, hullModel(polyVertices(poly)));
  return modelCache.get(k)!;
}

/** Frequency-2 geodesic icosphere (42 vertices, 80 faces) for Track B. */
function icosphereModel(): Model {
  if (modelCache.has('icosphere')) return modelCache.get('icosphere')!;
  const base = polyModel('icosahedron');
  const v: V3[] = base.v.map((p) => norm(p));
  const mid = new Map<string, number>();
  const midpoint = (a: number, b: number) => {
    const k = a < b ? `${a}-${b}` : `${b}-${a}`;
    if (!mid.has(k)) {
      v.push(norm(scale([v[a][0] + v[b][0], v[a][1] + v[b][1], v[a][2] + v[b][2]], 0.5)));
      mid.set(k, v.length - 1);
    }
    return mid.get(k)!;
  };
  const f: number[][] = [];
  for (const [a, b, c] of base.f) {
    const ab = midpoint(a, b);
    const bc = midpoint(b, c);
    const ca = midpoint(c, a);
    f.push([a, ab, ca], [ab, b, bc], [ca, bc, c], [ab, bc, ca]);
  }
  const m = { v, f, e: edgesOf(f) };
  modelCache.set('icosphere', m);
  return m;
}

/** A bicycle-wheel lattice for Cyclistic: rim, two hub flanges, spokes laced alternately to each flange. */
function wheelModel(spokes: number): Model {
  const v: V3[] = [];
  for (let i = 0; i < spokes; i++) {
    const a = (i / spokes) * Math.PI * 2;
    v.push([Math.cos(a), Math.sin(a), 0]);
  }
  const hubA = v.push([0, 0, 0.16]) - 1;
  const hubB = v.push([0, 0, -0.16]) - 1;
  const e: [number, number][] = [];
  for (let i = 0; i < spokes; i++) {
    e.push([i, (i + 1) % spokes]);
    e.push([i, i % 2 ? hubA : hubB]);
  }
  e.push([hubA, hubB]);
  return { v, e, f: [] };
}

// Rotation and projection -------------------------------------------------------------------------

function rotate(p: V3, rx: number, ry: number, rz: number): V3 {
  let [x, y, z] = p;
  let c = Math.cos(rx);
  let s = Math.sin(rx);
  [y, z] = [y * c - z * s, y * s + z * c];
  c = Math.cos(ry);
  s = Math.sin(ry);
  [x, z] = [x * c + z * s, -x * s + z * c];
  c = Math.cos(rz);
  s = Math.sin(rz);
  [x, y] = [x * c - y * s, x * s + y * c];
  return [x, y, z];
}

interface ModelOpts {
  cx: number;
  cy: number;
  r: number;
  rot: [number, number, number];
  /** stroke width of the sticks */
  sw?: number;
  /** vertex dot radius */
  dot?: number;
}

/** Ball-and-stick drawing: faces white .06 (front only), sticks white with depth cue (front .7), white vertex dots. */
function modelSvg(m: Model, o: ModelOpts): string {
  const D = 4.2; // camera distance (unit radius model) for a gentle perspective
  const rv = m.v.map((p) => rotate(p, ...o.rot));
  const pr = rv.map(([x, y, z]) => {
    const f = D / (D - z);
    return [o.cx + x * o.r * f, o.cy - y * o.r * f, z] as const;
  });
  const sw = o.sw ?? 1;
  const dotR = o.dot ?? 2.2;
  const pt = (i: number) => `${n1(pr[i][0])} ${n1(pr[i][1])}`;
  let faces = '';
  for (const loop of m.f) {
    // normal from rotated vertices; outward because the model is centred on the origin
    const a = rv[loop[0]];
    let nrm = cross(sub(rv[loop[1]], a), sub(rv[loop[2]], a));
    if (dot(nrm, a) < 0) nrm = scale(nrm, -1);
    if (nrm[2] > 0) faces += `M${loop.map(pt).join('L')}Z`;
  }
  const back: string[] = [];
  const front: string[] = [];
  for (const [a, b] of m.e) {
    const zm = (rv[a][2] + rv[b][2]) / 2;
    (zm < -0.05 ? back : front).push(`M${pt(a)}L${pt(b)}`);
  }
  const dotsFront: string[] = [];
  const dotsBack: string[] = [];
  pr.forEach(([x, y, z]) => {
    (z < -0.05 ? dotsBack : dotsFront).push(`<circle cx="${n1(x)}" cy="${n1(y)}" r="${z < -0.05 ? n1(dotR * 0.72) : dotR}"/>`);
  });
  return (
    `<g stroke-linecap="round" stroke-linejoin="round">` +
    (faces ? `<path d="${faces}" fill="#fff" fill-opacity=".06"/>` : '') +
    (back.length ? `<path d="${back.join('')}" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width="${sw}"/>` : '') +
    `<path d="${front.join('')}" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="${sw}"/>` +
    (dotsBack.length ? `<g fill="#fff" fill-opacity=".5">${dotsBack.join('')}</g>` : '') +
    `<g fill="#fff">${dotsFront.join('')}</g>` +
    `</g>`
  );
}

// ---------------------------------------------------------------------------------------------
// Blob shapes (also used by Vesicles.astro)
// ---------------------------------------------------------------------------------------------

/** A smooth closed organic outline (Catmull-Rom through seeded points around a circle). */
export function blobPath(rng: Rng, cx: number, cy: number, r: number, points = 7, wobble = 0.1): string {
  const pts: [number, number][] = [];
  const off = rng() * Math.PI * 2;
  for (let i = 0; i < points; i++) {
    const a = off + (i / points) * Math.PI * 2 + range(rng, -0.18, 0.18);
    const rr = r * (1 + range(rng, -wobble, wobble));
    pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]);
  }
  const P = (i: number) => pts[(i + points) % points];
  let d = `M${n1(P(0)[0])} ${n1(P(0)[1])}`;
  for (let i = 0; i < points; i++) {
    const [p0, p1, p2, p3] = [P(i - 1), P(i), P(i + 1), P(i + 2)];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${n1(c1[0])} ${n1(c1[1])} ${n1(c2[0])} ${n1(c2[1])} ${n1(p2[0])} ${n1(p2[1])}`;
  }
  return d + 'Z';
}

/** Upper-left white rim arc on a circle (the thin-film specular edge). */
export function rimArc(cx: number, cy: number, r: number, from = 200, to = 285): string {
  const p = (deg: number) => {
    const a = (deg * Math.PI) / 180;
    return `${n1(cx + Math.cos(a) * r)} ${n1(cy + Math.sin(a) * r)}`;
  };
  return `M${p(from)}A${n1(r)} ${n1(r)} 0 0 1 ${p(to)}`;
}

/** radialGradient stops for a vesicle lit from the upper left. */
function vesicleGradient(id: string, c: string[]): string {
  return (
    `<radialGradient id="${id}" cx=".5" cy=".5" r=".55" fx=".34" fy=".3">` +
    `<stop offset="0" stop-color="${mix(c[0], '#ffffff', 0.55)}"/>` +
    `<stop offset=".38" stop-color="${c[0]}"/>` +
    `<stop offset=".78" stop-color="${c[1]}"/>` +
    `<stop offset="1" stop-color="${c[2]}"/>` +
    `</radialGradient>`
  );
}

// ---------------------------------------------------------------------------------------------
// Covers
// ---------------------------------------------------------------------------------------------

/**
 * The cover SVG for a seed (usually the entry key, e.g. 'blog/foo'), a topic id and a variant.
 * - banner: 640×360, void + glow, 3–5 gooey vesicles, white rim arc, the topic polyhedron (ball-and-stick).
 * - og: the banner scene cropped to 640×336 and sized 1200×630 for rasterising (no text).
 * - thumb: 96×96, no filter, 2 circles plus the topic glyph, under 1 KB.
 */
export function coverSvg(seed: string, topic?: string, variant: CoverVariant = 'banner', motif: Motif = 'poly'): string {
  return variant === 'thumb' ? thumbSvg(seed, topic) : bannerSvg(seed, topic, variant === 'og', motif);
}

function bannerSvg(seed: string, topic: string | undefined, og: boolean, motif: Motif): string {
  const rng = rngFor(seed);
  const W = 640;
  const H = 360;
  const pal = topicPalette(topic);
  const t = topicById(topic);
  const poly: Poly = t?.poly ?? 'icosahedron';

  // Composition: the molecule on one side, the vesicle cluster on the other; both cross the middle band
  // (y 134–226) so the 160px topic strip and the 16:7 mobile strip still show both.
  const molLeft = rng() < 0.5;
  const big = motif !== 'poly';
  const molR = big ? range(rng, 92, 112) : range(rng, 68, 88);
  const mol = { x: molLeft ? range(rng, 150, 220) : range(rng, 420, 490), y: range(rng, 160, 200) };

  const glow = { x: n1(range(rng, 0.25, 0.75) * 100), y: n1(range(rng, 0.3, 0.7) * 100) };

  const count = 3 + Math.floor(rng() * 3); // 3–5
  const blobs: { x: number; y: number; r: number; c: string[] }[] = [];
  const mainR = range(rng, 66, 96);
  blobs.push({
    x: molLeft ? range(rng, 400, 500) : range(rng, 140, 240),
    y: range(rng, 150, 210),
    r: mainR,
    c: [pal[0], pal[1], pal[2 % pal.length]],
  });
  for (let i = 1; i < count; i++) {
    const anchor = blobs[Math.floor(rng() * blobs.length)];
    const r = i === count - 1 && count > 3 ? range(rng, 12, 18) : range(rng, 22, 54);
    // half the time touching (the gooey bridge), otherwise a small gap
    const gap = rng() < 0.5 ? range(rng, 0.72, 0.95) : range(rng, 1.05, 1.3);
    let a = range(rng, 0, Math.PI * 2);
    let x = 0;
    let y = 0;
    for (let tries = 0; tries < 8; tries++) {
      x = anchor.x + Math.cos(a) * (anchor.r + r) * gap;
      y = anchor.y + Math.sin(a) * (anchor.r + r) * gap;
      if (x > -r * 0.5 && x < W + r * 0.5 && y > 40 && y < H - 30 && Math.hypot(x - mol.x, y - mol.y) > molR * 0.9 + r) break;
      a += 0.9;
    }
    const k = i % pal.length;
    blobs.push({ x, y, r, c: [pal[k], pal[(k + 1) % pal.length], pal[(k + 2) % pal.length]] });
  }

  const defs: string[] = [];
  defs.push(
    `<radialGradient id="glow" cx="${glow.x}%" cy="${glow.y}%" r="70%">` +
      `<stop offset="0" stop-color="${GLOW}"/><stop offset=".38" stop-color="${GLOW_MID}"/><stop offset="1" stop-color="${VOID}" stop-opacity="0"/>` +
      `</radialGradient>`,
  );
  blobs.forEach((b, i) => defs.push(vesicleGradient(`b${i}`, b.c)));
  // Gooey merge: blur, then a hard alpha threshold, then put the crisp colours back on top.
  // The filter region hugs the blobs (plus the blur reach) instead of the whole canvas: rasterising is ~3× faster.
  const pad = 44;
  const gx0 = Math.max(0, Math.min(...blobs.map((b) => b.x - b.r)) - pad);
  const gy0 = Math.max(0, Math.min(...blobs.map((b) => b.y - b.r)) - pad);
  const gx1 = Math.min(W, Math.max(...blobs.map((b) => b.x + b.r)) + pad);
  const gy1 = Math.min(H, Math.max(...blobs.map((b) => b.y + b.r)) + pad);
  defs.push(
    `<filter id="goo" filterUnits="userSpaceOnUse" x="${n1(gx0)}" y="${n1(gy0)}" width="${n1(gx1 - gx0)}" height="${n1(gy1 - gy0)}" color-interpolation-filters="sRGB">` +
      `<feGaussianBlur in="SourceGraphic" stdDeviation="14" result="blur"/>` +
      `<feColorMatrix in="blur" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -9" result="goo"/>` +
      `<feComposite in="SourceGraphic" in2="goo" operator="atop"/>` +
      `</filter>`,
  );
  // One out-of-focus vesicle far behind (depth of field).
  const dof = {
    x: molLeft ? range(rng, 40, 140) : range(rng, 500, 600),
    y: rng() < 0.5 ? range(rng, 40, 90) : range(rng, 280, 330),
    r: range(rng, 34, 60),
  };
  const dr = dof.r + 34;
  defs.push(
    `<filter id="dof" filterUnits="userSpaceOnUse" x="${n1(dof.x - dr)}" y="${n1(dof.y - dr)}" width="${n1(dr * 2)}" height="${n1(dr * 2)}"><feGaussianBlur stdDeviation="10"/></filter>`,
  );
  defs.push(vesicleGradient('bd', [pal[pal.length - 1], pal[0], pal[1]]));

  // Faint specks (plankton) for depth.
  let specks = '';
  for (let i = 0; i < 16; i++) {
    specks += `<circle cx="${n1(range(rng, 0, W))}" cy="${n1(range(rng, 0, H))}" r="${n1(range(rng, 0.6, 1.5))}" fill-opacity="${n2(range(rng, 0.15, 0.55))}"/>`;
  }

  // The rim arc goes on the largest blob whose upper-left edge is not covered by a neighbour.
  const rimFree = (b: (typeof blobs)[number]) =>
    b.r >= 22 &&
    [200, 242, 285].every((deg) => {
      const a = (deg * Math.PI) / 180;
      const px = b.x + Math.cos(a) * b.r;
      const py = b.y + Math.sin(a) * b.r;
      return blobs.every((o) => o === b || Math.hypot(px - o.x, py - o.y) > o.r + 10);
    });
  const main = [...blobs].sort((a, b) => b.r - a.r).find(rimFree) ?? blobs[0];
  const rot: [number, number, number] = [range(rng, -0.9, 0.9), range(rng, 0, Math.PI * 2), range(rng, -0.5, 0.5)];
  let molecule: string;
  if (motif === 'wheel') {
    const spokes = 14 + 2 * Math.floor(rng() * 3);
    molecule = modelSvg(wheelModel(spokes), { cx: mol.x, cy: mol.y, r: molR, rot: [range(rng, 0.55, 0.95), range(rng, -0.6, 0.6), rot[2]], dot: 2 });
  } else if (motif === 'icosphere') {
    molecule = modelSvg(icosphereModel(), { cx: mol.x, cy: mol.y, r: molR, rot, dot: 1.8 });
  } else {
    molecule = modelSvg(polyModel(poly), { cx: mol.x, cy: mol.y, r: molR, rot });
  }

  const size = og ? `width="${COVER_SIZE.og.width}" height="${COVER_SIZE.og.height}" viewBox="0 12 ${W} 336"` : `width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"`;
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" ${size} preserveAspectRatio="xMidYMid slice">` +
    `<defs>${defs.join('')}</defs>` +
    `<rect width="${W}" height="${H}" fill="${VOID}"/>` +
    `<rect width="${W}" height="${H}" fill="url(#glow)"/>` +
    `<g fill="#fff">${specks}</g>` +
    `<circle cx="${n1(dof.x)}" cy="${n1(dof.y)}" r="${n1(dof.r)}" fill="url(#bd)" opacity=".5" filter="url(#dof)"/>` +
    `<g filter="url(#goo)">${blobs.map((b, i) => `<circle cx="${n1(b.x)}" cy="${n1(b.y)}" r="${n1(b.r)}" fill="url(#b${i})"/>`).join('')}</g>` +
    `<path d="${rimArc(main.x, main.y, main.r * 0.84)}" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="${n1(Math.max(2, main.r * 0.05))}" stroke-linecap="round"/>` +
    molecule +
    `</svg>`
  );
}

function thumbSvg(seed: string, topic: string | undefined): string {
  const rng = rngFor(`thumb:${seed}`);
  const pal = topicPalette(topic);
  const t = topicById(topic) ?? TOPICS[0];
  const big = { x: range(rng, 52, 64), y: range(rng, 52, 64), r: range(rng, 24, 30) };
  const a = range(rng, Math.PI * 0.9, Math.PI * 1.6);
  const small = { x: big.x + Math.cos(a) * (big.r + 9), y: big.y + Math.sin(a) * (big.r + 9), r: range(rng, 8, 12) };
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96">` +
    `<defs><radialGradient id="a" fx=".34" fy=".3"><stop offset="0" stop-color="${mix(pal[0], '#ffffff', 0.5)}"/><stop offset=".5" stop-color="${pal[0]}"/><stop offset="1" stop-color="${pal[1]}"/></radialGradient></defs>` +
    `<rect width="96" height="96" fill="${VOID}"/>` +
    `<circle cx="${n1(big.x)}" cy="${n1(big.y)}" r="${n1(big.r)}" fill="url(#a)"/>` +
    `<circle cx="${n1(small.x)}" cy="${n1(small.y)}" r="${n1(small.r)}" fill="${pal[2 % pal.length]}"/>` +
    `<path d="${t.glyphPath}" transform="translate(10 10) scale(1.5)" fill="none" stroke="#fff" stroke-opacity=".85" stroke-width="1" stroke-linejoin="round"/>` +
    `</svg>`
  );
}

/**
 * Rasterise an OG SVG to PNG (1200×630). sharp is imported lazily so this file stays usable without it.
 * The output is deterministic, so PNGs are cached by SVG hash in node_modules/.cache/og-png (never committed);
 * a warm rebuild skips librsvg entirely. Any sharp error propagates and fails the build (spec §7 Fallbacks).
 */
export async function ogPng(svg: string): Promise<Uint8Array> {
  const { readFile, writeFile, mkdir } = await import('node:fs/promises');
  const path = await import('node:path');
  const dir = path.resolve(process.cwd(), 'node_modules/.cache/og-png');
  const file = path.join(dir, `${OG_CACHE_VERSION}-${fnv1a(svg).toString(36)}-${svg.length.toString(36)}.png`);
  try {
    return new Uint8Array(await readFile(file));
  } catch {
    /* not cached yet */
  }
  const { default: sharp } = await import('sharp');
  const buf = await sharp(Buffer.from(svg))
    .resize(COVER_SIZE.og.width, COVER_SIZE.og.height)
    .png({ palette: true, quality: 90, dither: 1, compressionLevel: 9 }) // dithered 256-colour: ~75 KB instead of ~260 KB
    .toBuffer();
  try {
    await mkdir(dir, { recursive: true });
    await writeFile(file, buf);
  } catch {
    /* cache is optional */
  }
  return new Uint8Array(buf);
}
/** Bump to invalidate cached OG PNGs when the raster settings (not the SVG) change. */
const OG_CACHE_VERSION = 'v2';
