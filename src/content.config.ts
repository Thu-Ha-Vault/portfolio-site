import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { EN_CONTENT_DIR, hasEnglishArticles } from './lib/english';

const base = {
  title: z.string(),
  type: z.string().default('note'),
  tags: z.array(z.string()).default([]),
  folder: z.string().optional(),
  vaultPath: z.string(),
  url: z.string(),
  topic: z.string().optional(),
  updated: z.string().optional(),
  source: z.string().optional(),
  date: z.string().optional(),
  status: z.string().optional(),
  deadline: z.string().optional(),
  order: z.number().optional(),
  description: z.string().optional(),
  isIndex: z.boolean().default(false),
  /** real photo chosen by the sync (/vault-assets/….webp); missing → procedural cover. Vault `cover: none` turns it off. */
  cover: z.string().optional(),
  cover_alt: z.string().optional(),
};

const id = ({ entry }: { entry: string }) => entry.replace(/\.md$/, '').replace(/\/index$/, '');

const post = z.object({
  ...base,
  section: z.string().optional(),
  /** `en` on the English version of an article (collection `blog-en`); the sync leaves it out on Vietnamese pages. */
  lang: z.enum(['vi', 'en']).default('vi'),
  /** an article published in both languages: URL and title of its other version */
  translationUrl: z.string().optional(),
  translationTitle: z.string().optional(),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog', generateId: id }),
  schema: post,
});

// English versions of articles, at the inner paths of their Vietnamese pages in `blog` (ids match across the two).
// While no article has one the folder is empty; glob() would then warn and keep the entries cached by an earlier
// build, so the collection is emptied here instead.
const englishGlob = glob({ pattern: '**/*.md', base: `./${EN_CONTENT_DIR}`, generateId: id });
const blogEn = defineCollection({
  loader: {
    ...englishGlob,
    load: async (context) => (hasEnglishArticles() ? englishGlob.load(context) : context.store.clear()),
  },
  schema: post,
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects', generateId: id }),
  schema: z.object({
    ...base,
    project: z.string(),
    featured: z.boolean().default(false),
    summary_vi: z.string().optional(),
    summary_en: z.string().optional(),
    links: z.record(z.string(), z.string()).default({}),
    /** name on the `app` link button (site.config.json projects[].appName) */
    appName: z.string().optional(),
    phases: z.array(z.object({ name: z.string(), done: z.number(), total: z.number() })).default([]),
    /** project index: site.config.json projects[].cover; project notes: the sync's photo pick. Missing → procedural banner. */
    cover: z.object({ src: z.string(), alt: z.string(), alt_en: z.string().optional() }).optional(),
  }),
});

export const collections = { blog, 'blog-en': blogEn, projects };
