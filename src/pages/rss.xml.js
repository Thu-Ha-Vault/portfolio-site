import { getCollection } from 'astro:content';
import { feed } from '../lib/feed.js';

export async function GET(context) {
  return feed(context, await getCollection('blog'), 'vi');
}
