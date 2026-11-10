// 96×96 thumbnails (spec §7.1) for the home "Mới cập nhật" rows: /covers/thumb/<kind>/<slug>.svg.
// Use thumbUrl()/coverFor() from src/lib/cover.ts to reference them.
import type { APIRoute, GetStaticPaths } from 'astro';
import { coverSources, coverSvg, type CoverSource } from '../../../lib/cover';

export const getStaticPaths = (async () =>
  (await coverSources()).map((s) => ({ params: { slug: s.key }, props: s }))) satisfies GetStaticPaths;

export const GET: APIRoute = ({ props }) => {
  const s = props as CoverSource;
  return new Response(coverSvg(s.seed, s.topic, 'thumb'), {
    headers: { 'Content-Type': 'image/svg+xml; charset=utf-8' },
  });
};
