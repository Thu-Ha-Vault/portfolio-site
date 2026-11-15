import { blogEnEntries } from '../../lib';
import { feed } from '../../lib/feed.js';

export async function GET(context) {
  return feed(context, await blogEnEntries(), 'en');
}
