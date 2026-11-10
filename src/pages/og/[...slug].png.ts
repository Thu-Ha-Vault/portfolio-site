// Open Graph images (spec §7.1): the banner scene rasterised at 1200×630 with sharp, no text.
// /og/<kind>/<slug>.png for every post, topic and project, plus /og/home.png, /og/blog.png,
// /og/topics.png and /og/projects.png from fixed seeds. Use ogUrl() from src/lib/cover.ts.
import type { APIRoute, GetStaticPaths } from 'astro';
import { coverSources, coverSvg, ogPng, PAGE_OG, type CoverSource } from '../../lib/cover';

const svgFor = (s: CoverSource) => coverSvg(s.seed, s.topic, 'og', s.motif);

// Astro renders endpoints one at a time; librsvg is the slow part (~0.25 s per image), so a small pool
// starts rasterising ahead on sharp's thread pool and GET picks up the finished promise.
const jobs = new Map<string, Promise<Uint8Array>>();
let warmed = false;
function warm(list: CoverSource[], workers = 4) {
  if (warmed) return;
  warmed = true;
  let i = 0;
  const run = async () => {
    while (i < list.length) {
      const s = list[i++];
      if (jobs.has(s.key)) continue;
      const p = ogPng(svgFor(s));
      jobs.set(s.key, p);
      await p.catch(() => {}); // the error is re-raised in GET, which fails the build
    }
  };
  for (let w = 0; w < workers; w++) void run();
}

export const getStaticPaths = (async () => {
  const pages: CoverSource[] = Object.entries(PAGE_OG).map(([key, p]) => ({ key, seed: p.seed, topic: p.topic, motif: 'poly' }));
  const all = [...pages, ...(await coverSources())];
  warm(all);
  return all.map((s) => ({ params: { slug: s.key }, props: s }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) => {
  const s = props as CoverSource;
  const job = jobs.get(s.key);
  jobs.delete(s.key);
  // A failure here fails the build on purpose (spec §7 Fallbacks: the output is deterministic).
  const png = await (job ?? ogPng(svgFor(s)));
  return new Response(png, { headers: { 'Content-Type': 'image/png' } });
};
