import { getCollection, type CollectionEntry } from 'astro:content';

export type Blog = CollectionEntry<'blog'>;
export type Project = CollectionEntry<'projects'>;

const collator = new Intl.Collator('vi', { numeric: true, sensitivity: 'base' });
export const byOrder = <T extends { id: string; data: { title: string } }>(a: T, b: T) =>
  collator.compare(a.id, b.id);

export const parentId = (id: string) => (id.includes('/') ? id.slice(0, id.lastIndexOf('/')) : '');

/** Direct children of a folder index: notes in that folder + sub-folder indexes. */
export function childrenOf<T extends Blog | Project>(all: T[], id: string) {
  return all.filter((e) => e.id !== id && parentId(e.id) === id).sort(byOrder);
}

/** Previous / next among sibling (non-index) notes in the same folder. */
export function siblings<T extends Blog | Project>(all: T[], entry: T) {
  if (entry.data.isIndex) return { prev: undefined, next: undefined };
  const sibs = all.filter((e) => !e.data.isIndex && parentId(e.id) === parentId(entry.id)).sort(byOrder);
  const i = sibs.findIndex((e) => e.id === entry.id);
  return { prev: sibs[i - 1], next: sibs[i + 1] };
}

export function breadcrumbs<T extends Blog | Project>(all: T[], id: string) {
  const parts = id.split('/');
  const crumbs: { id: string; title: string }[] = [];
  for (let i = 1; i < parts.length; i++) {
    const pid = parts.slice(0, i).join('/');
    const e = all.find((x) => x.id === pid);
    if (e) crumbs.push({ id: pid, title: e.data.title });
  }
  return crumbs;
}

export const hasMermaid = (body?: string) => !!body && /```mermaid/.test(body);

export async function blogEntries() {
  return (await getCollection('blog')).sort(byOrder);
}
export async function projectEntries() {
  return (await getCollection('projects')).sort(byOrder);
}

export const statusKey = (s?: string) =>
  s === 'done' || s === 'completed' ? 'done' : s === 'paused' || s === 'archived' ? 'paused' : s ? 'active' : undefined;
