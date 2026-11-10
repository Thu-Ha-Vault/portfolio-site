// Procedural banner covers (spec §7.1): /covers/<kind>/<slug>.svg for every post, topic and project.
// Use coverUrl()/coverFor() from src/lib/cover.ts to reference them.
import type { APIRoute, GetStaticPaths } from 'astro';
import { coverSources, coverSvg, type CoverSource } from '../../lib/cover';

export const getStaticPaths = (async () =>
  (await coverSources()).map((s) => ({ params: { slug: s.key }, props: s }))) satisfies GetStaticPaths;

export const GET: APIRoute = ({ props }) => {
  const s = props as CoverSource;
  return new Response(coverSvg(s.seed, s.topic, 'banner', s.motif), {
    headers: { 'Content-Type': 'image/svg+xml; charset=utf-8' },
  });
};
