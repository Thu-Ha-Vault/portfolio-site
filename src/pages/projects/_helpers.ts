/**
 * Shared helpers for the "neon brutal" project pieces (ProjectCase.astro, projects/[...slug].astro).
 * The leading underscore keeps Astro from treating this file as a route.
 */
import { join } from 'node:path';
import { TOPICS, type Topic } from '../../data/topics';

type BlogLike = { data: { topic?: string; tags: string[] } };

let tagMap: Promise<Map<string, string>> | undefined;

/**
 * Tag → topic id. A tag maps to a topic when it is the topic id or token itself, or when at least 3 blog
 * notes carry it and 60% or more of them sit in one topic. Built once per build from the blog collection.
 */
export function tagTopics(load: () => Promise<BlogLike[]>): Promise<Map<string, string>> {
  tagMap ??= load().then((posts) => {
    const counts = new Map<string, Map<string, number>>();
    for (const p of posts) {
      if (!p.data.topic) continue;
      for (const t of p.data.tags) {
        const c = counts.get(t) ?? new Map<string, number>();
        c.set(p.data.topic, (c.get(p.data.topic) ?? 0) + 1);
        counts.set(t, c);
      }
    }
    const out = new Map<string, string>();
    for (const [tag, c] of counts) {
      const total = [...c.values()].reduce((a, b) => a + b, 0);
      const [best, n] = [...c.entries()].sort((a, b) => b[1] - a[1])[0];
      if (total >= 3 && n / total >= 0.6) out.set(tag, best);
    }
    for (const t of TOPICS) {
      out.set(t.id, t.id);
      out.set(t.token, t.id);
    }
    return out;
  });
  return tagMap;
}

export const topicById = (id?: string): Topic | undefined => TOPICS.find((t) => t.id === id);

/** 'google-data-analytics' → 'Google data analytics' (sentence case, §5). */
export function prettyTag(t: string): string {
  const s = t.replace(/[-_]+/g, ' ').trim();
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const sizes = new Map<string, Promise<{ w: number; h: number } | undefined>>();

/** Intrinsic size of a file under public/ (project covers are not in src/data/images.json). */
export function coverSize(src: string): Promise<{ w: number; h: number } | undefined> {
  if (!sizes.has(src)) {
    sizes.set(
      src,
      import('sharp')
        .then(({ default: sharp }) => sharp(join(process.cwd(), 'public', src.replace(/^\//, ''))).metadata())
        .then((m) => (m.width && m.height ? { w: m.width, h: m.height } : undefined))
        .catch(() => undefined),
    );
  }
  return sizes.get(src)!;
}

export type ProjectCoverData = { src: string; alt: string; alt_en?: string };

/** The project's real cover, or undefined when it should use the procedural motif. */
export function realCover(cover: unknown): ProjectCoverData | undefined {
  if (cover && typeof cover === 'object' && typeof (cover as ProjectCoverData).src === 'string' && (cover as ProjectCoverData).src) {
    return cover as ProjectCoverData;
  }
  return undefined;
}
