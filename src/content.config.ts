import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

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

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog', generateId: id }),
  schema: z.object({ ...base, section: z.string().optional() }),
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
    phases: z.array(z.object({ name: z.string(), done: z.number(), total: z.number() })).default([]),
    /** project index: site.config.json projects[].cover; project notes: the sync's photo pick. Missing → procedural banner. */
    cover: z.object({ src: z.string(), alt: z.string(), alt_en: z.string().optional() }).optional(),
  }),
});

export const collections = { blog, projects };
