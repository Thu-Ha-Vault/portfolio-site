/**
 * Single source of truth for topic colours, polyhedra and names (spec §2).
 * Galaxy.astro, the cover endpoints, PostRows.astro and Base.astro import this file.
 * Never hand-copy these hexes anywhere else: use the CSS vars `--t-<token>` (injected by Base.astro
 * via topicCss()) or import from here.
 */

export type TopicId = 'biology' | 'business' | 'ai-development' | 'french' | 'university-courses' | 'english';
export type Poly = 'icosahedron' | 'cube' | 'octahedron' | 'tetrahedron' | 'dodecahedron' | 'bipyramid';

export interface Topic {
  id: TopicId;
  /** short CSS token: the var is `--t-${token}` */
  token: string;
  /** original galaxy neon, used on the dark --void background */
  hex: string;
  /** stained variant used in light reading mode (>= 5.2:1 on #fcfcfd) */
  stain: string;
  /** polyhedron shown for this topic (galaxy star, glyph, covers) */
  poly: Poly;
  /**
   * Line-drawing of the polyhedron for a 24×24 viewBox. Draw it as a stroke:
   * `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><path d=…/></svg>`
   */
  glyphPath: string;
  names: { vi: string; en: string };
}

export const TOPICS: readonly Topic[] = [
  {
    id: 'biology',
    token: 'biology',
    hex: '#2ef2ff',
    stain: '#0b7285',
    poly: 'icosahedron',
    glyphPath:
      'M12 2L20.66 7L20.66 17L12 22L3.34 17L3.34 7Z' +
      'M12 7.2L16.5 15L7.5 15Z' +
      'M12 7.2L12 2M12 7.2L20.66 7M12 7.2L3.34 7' +
      'M16.5 15L20.66 7M16.5 15L20.66 17M16.5 15L12 22' +
      'M7.5 15L3.34 7M7.5 15L3.34 17M7.5 15L12 22',
    names: { vi: 'Sinh học', en: 'Biology' },
  },
  {
    id: 'business',
    token: 'business',
    hex: '#ff3db4',
    stain: '#c2255c',
    poly: 'cube',
    glyphPath: 'M12 2L20.66 7L20.66 17L12 22L3.34 17L3.34 7Z' + 'M12 12L12 22M12 12L3.34 7M12 12L20.66 7',
    names: { vi: 'Kinh doanh', en: 'Business' },
  },
  {
    id: 'ai-development',
    token: 'ai',
    hex: '#a78bfa',
    stain: '#5f3dc4',
    poly: 'octahedron',
    glyphPath:
      'M3 12L9.5 15L21 12L14.5 9Z' +
      'M12 2L3 12M12 2L9.5 15M12 2L21 12M12 2L14.5 9' +
      'M12 22L3 12M12 22L9.5 15M12 22L21 12M12 22L14.5 9',
    names: { vi: 'AI và lập trình', en: 'AI and development' },
  },
  {
    id: 'french',
    token: 'french',
    hex: '#ffb627',
    stain: '#9c4f00',
    poly: 'tetrahedron',
    glyphPath: 'M12 2.5L3 19.5L21 19.5Z' + 'M12 2.5L13.5 14.5M3 19.5L13.5 14.5M21 19.5L13.5 14.5',
    names: { vi: 'Tiếng Pháp', en: 'French' },
  },
  {
    id: 'university-courses',
    token: 'courses',
    hex: '#9dff5c',
    stain: '#1f7a34',
    poly: 'dodecahedron',
    glyphPath:
      'M12 2L17.88 3.91L21.51 8.91L21.51 15.09L17.88 20.09L12 22L6.12 20.09L2.49 15.09L2.49 8.91L6.12 3.91Z' +
      'M12 7.4L16.76 10.85L14.94 16.45L9.06 16.45L7.24 10.85Z' +
      'M12 7.4L12 2M16.76 10.85L21.51 8.91M14.94 16.45L17.88 20.09M9.06 16.45L6.12 20.09M7.24 10.85L2.49 8.91',
    names: { vi: 'Học phần đại cương', en: 'University courses' },
  },
  {
    id: 'english',
    token: 'english',
    hex: '#ff6b5e',
    stain: '#c92a2a',
    poly: 'bipyramid',
    glyphPath:
      'M3.5 12.5L12 15.5L20.5 12.5Z' +
      'M12 2L3.5 12.5M12 2L12 15.5M12 2L20.5 12.5' +
      'M12 22L3.5 12.5M12 22L12 15.5M12 22L20.5 12.5',
    names: { vi: 'Tiếng Anh', en: 'English' },
  },
];

/** Iris gradient stops (reference-tuned, distinct from the topic hexes). Never used on text. */
export const IRIS_STOPS: readonly { at: number; hex: string }[] = [
  { at: 0, hex: '#f45fd0' },
  { at: 0.26, hex: '#b18cff' },
  { at: 0.52, hex: '#4cd8ff' },
  { at: 0.64, hex: '#5be3f0' },
  { at: 0.84, hex: '#ffc94a' },
  { at: 1, hex: '#ff9e9e' },
];

export const IRIS_ANGLE = 115;

const byId = new Map<string, Topic>(TOPICS.map((t) => [t.id, t]));

/** Look up a topic by id (slug). Returns undefined for unknown ids. */
export function topicById(id: string | undefined | null): Topic | undefined {
  return id ? byId.get(id) : undefined;
}

/** `var(--t-…)` for a topic id, or a neutral fallback for unknown ids. */
export function topicVar(id: string | undefined | null, fallback = 'var(--ink-soft)'): string {
  const t = topicById(id);
  return t ? `var(--t-${t.token})` : fallback;
}

/** CSS gradient string from IRIS_STOPS, e.g. for `--iris`. */
export function irisGradient(angle: number | string = IRIS_ANGLE): string {
  const a = typeof angle === 'number' ? `${angle}deg` : angle;
  return `linear-gradient(${a}, ${IRIS_STOPS.map((s) => `${s.hex} ${Math.round(s.at * 100)}%`).join(', ')})`;
}

/** Inline SVG markup for a topic glyph (aria-hidden; colour via `color`/currentColor). */
export function glyphSvg(id: string | undefined | null, size = 12, strokeWidth = 1.6): string {
  const t = topicById(id);
  if (!t) return '';
  return `<svg class="glyph" viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="${strokeWidth}" stroke-linejoin="round" stroke-linecap="round" aria-hidden="true" focusable="false"><path d="${t.glyphPath}"/></svg>`;
}

/**
 * Global CSS injected by Base.astro: topic channels and the iris gradient on :root,
 * and the stained topic variants in light reading mode.
 */
export function topicCss(): string {
  const dark = TOPICS.map((t) => `--t-${t.token}:${t.hex};`).join('');
  const light = TOPICS.map((t) => `--t-${t.token}:${t.stain};`).join('');
  return (
    `:root{${dark}--iris:${irisGradient()};--iris-pink:${IRIS_STOPS[0].hex};}` +
    `html[data-reading="light"] body.is-reading{${light}}`
  );
}
