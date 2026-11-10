import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import config from '../../site.config.json';

export async function GET(context) {
  const posts = (await getCollection('blog'))
    .filter((p) => !p.data.isIndex)
    .sort((a, b) => (b.data.updated ?? '').localeCompare(a.data.updated ?? ''))
    .slice(0, 50);
  return rss({
    title: `${config.author.name} | Blog`,
    description: config.author.bio_en,
    site: context.site,
    items: posts.map((p) => ({
      title: p.data.title,
      link: p.data.url,
      description: p.data.description,
      pubDate: p.data.updated ? new Date(p.data.updated) : undefined,
      categories: p.data.tags,
    })),
  });
}
