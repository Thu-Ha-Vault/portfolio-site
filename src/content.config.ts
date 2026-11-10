import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const base = {
  title: z.string(),
  type: z.string().default('note'),
  tags: z.array(z.string()).default([]),
  folder: z.string().optional(),
  vaultPath: z.string(),
  source: z.string().optional(),
  date: z.string().optional(),
  status: z.string().optional(),
  deadline: z.string().optional(),
  order: z.number().optional(),
  description: z.string().optional(),
  isIndex: z.boolean().default(false),
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
    links: z.record(z.string(), z.string()).default({}),
  }),
});

export const collections = { blog, projects };
