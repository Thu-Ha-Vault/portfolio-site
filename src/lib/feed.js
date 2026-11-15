// RSS feeds: /rss.xml (every article, in Vietnamese) and /en/rss.xml (the articles that have an English version).
import rss from '@astrojs/rss';
import config from '../../site.config.json';

/** The 50 most recently updated posts as an RSS response. `language` is the feed's <language> code. */
export function feed(context, posts, language) {
  const items = posts
    .filter((p) => !p.data.isIndex)
    .sort((a, b) => (b.data.updated ?? '').localeCompare(a.data.updated ?? ''))
    .slice(0, 50);
  return rss({
    title: `${config.author.name} | Blog`,
    description: config.author.bio_en,
    site: context.site,
    customData: `<language>${language}</language>`,
    items: items.map((p) => ({
      title: p.data.title,
      link: p.data.url,
      description: p.data.description,
      pubDate: p.data.updated ? new Date(p.data.updated) : undefined,
      categories: p.data.tags,
    })),
  });
}
