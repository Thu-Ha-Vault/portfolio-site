import { getCollection, type CollectionEntry } from 'astro:content';

export type Blog = CollectionEntry<'blog'>;
export type Project = CollectionEntry<'projects'>;

const collator = new Intl.Collator('vi', { numeric: true, sensitivity: 'base' });
export const byOrder = <T extends { id: string }>(a: T, b: T) => collator.compare(a.id, b.id);
export const byUpdated = <T extends { id: string; data: { updated?: string } }>(a: T, b: T) =>
  (b.data.updated ?? '').localeCompare(a.data.updated ?? '') || byOrder(a, b);

export const parentId = (id: string) => (id.includes('/') ? id.slice(0, id.lastIndexOf('/')) : '');
/** route param from a public url like /blog/foo/ */
export const param = (url: string) => url.split('/').filter(Boolean).slice(1).join('/');

export function childrenOf<T extends Blog | Project>(all: T[], id: string) {
  return all.filter((e) => e.id !== id && parentId(e.id) === id).sort(byOrder);
}

export function siblings<T extends Blog | Project>(all: T[], entry: T) {
  if (entry.data.isIndex) return { prev: undefined, next: undefined };
  const sibs = all.filter((e) => !e.data.isIndex && parentId(e.id) === parentId(entry.id)).sort(byOrder);
  const i = sibs.findIndex((e) => e.id === entry.id);
  return { prev: sibs[i - 1], next: sibs[i + 1] };
}

export function breadcrumbs<T extends Blog | Project>(all: T[], id: string) {
  const parts = id.split('/');
  const crumbs: { url: string; title: string }[] = [];
  for (let i = 1; i < parts.length; i++) {
    const e = all.find((x) => x.id === parts.slice(0, i).join('/'));
    if (e) crumbs.push({ url: e.data.url, title: e.data.title });
  }
  return crumbs;
}

export const hasMermaid = (body?: string) => !!body && /```mermaid/.test(body);
export const blogEntries = async () => (await getCollection('blog')).sort(byOrder);
export const projectEntries = async () => (await getCollection('projects')).sort(byOrder);

export const statusKey = (s?: string) =>
  s === 'done' || s === 'completed' ? 'done' : s === 'paused' || s === 'archived' ? 'paused' : s ? 'active' : undefined;

export const fmtDate = (d?: string) => {
  if (!d) return '';
  const [y, m, day] = d.split('-');
  return `${day}/${m}/${y}`;
};
