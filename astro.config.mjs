// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeImages from './src/lib/rehype-images.mjs';
import rehypeTableScroll from './src/lib/rehype-table-scroll.mjs';

export default defineConfig({
  site: 'https://thuha.ceovanta.com',
  trailingSlash: 'always',
  // i18n: an article's two language versions (/blog/<slug>/ and /en/blog/<slug>/) are listed as each other's alternates
  integrations: [sitemap({ i18n: { defaultLocale: 'vi', locales: { vi: 'vi', en: 'en' } } })],
  // three.module (~750 kB) is the only large chunk; Galaxy.astro loads it with a lazy dynamic import()
  // once the hero scrolls into view, so it never blocks first paint. Raise the limit to that size only.
  vite: { build: { chunkSizeWarningLimit: 800 } },
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [[rehypeKatex, { strict: false }], rehypeImages, rehypeTableScroll],
    syntaxHighlight: { type: 'shiki', excludeLangs: ['mermaid'] },
    // Dark Shiki colours are inline by default; light reading swaps to var(--shiki-light) / var(--shiki-light-bg) (global.css).
    shikiConfig: { themes: { light: 'github-light', dark: 'github-dark-dimmed' }, defaultColor: 'dark' },
  },
});
