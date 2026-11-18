// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeImages from './src/lib/rehype-images.mjs';
import rehypeTableScroll from './src/lib/rehype-table-scroll.mjs';
import rehypeTaskList from './src/lib/rehype-task-list.mjs';
import rehypeLocalLinks from './src/lib/rehype-local-links.mjs';

export default defineConfig({
  site: 'https://thuha.ceovanta.com',
  trailingSlash: 'always',
  // Virtual Lab became one page (site.config.json projects[].page, 2026-11-18): its old note pages lead there.
  redirects: {
    '/projects/virtual-lab/bo-khung-phong-thi-nghiem-3d/': '/projects/virtual-lab/',
    '/projects/virtual-lab/cac-khu-cua-phong-thi-nghiem/': '/projects/virtual-lab/',
    '/projects/virtual-lab/danh-muc-thi-nghiem-ao/': '/projects/virtual-lab/',
    '/projects/virtual-lab/kien-truc-mo-phong/': '/projects/virtual-lab/',
    '/projects/virtual-lab/phong-thi-nghiem-giong-phong-that/': '/projects/virtual-lab/',
    '/projects/virtual-lab/tai-lieu-drive-cho-giai-doan-6/': '/projects/virtual-lab/',
    '/projects/virtual-lab/tai-lieu-tham-khao-may-moc-dot-1-chuoi-pcr/': '/projects/virtual-lab/',
    '/projects/virtual-lab/tai-lieu-tham-khao-may-moc-dot-2/': '/projects/virtual-lab/',
    '/projects/virtual-lab/thi-nghiem-giai-doan-3/': '/projects/virtual-lab/',
    '/projects/virtual-lab/thi-nghiem-giai-doan-4/': '/projects/virtual-lab/',
    '/projects/virtual-lab/thi-nghiem-giai-doan-5/': '/projects/virtual-lab/',
    '/projects/virtual-lab/y-tuong-va-pham-vi/': '/projects/virtual-lab/',
  },
  // i18n: an article's two language versions (/blog/<slug>/ and /en/blog/<slug>/) are listed as each other's alternates
  integrations: [sitemap({ i18n: { defaultLocale: 'vi', locales: { vi: 'vi', en: 'en' } } })],
  // three.module (~750 kB) is the only large chunk; Galaxy.astro loads it with a lazy dynamic import()
  // once the hero scrolls into view, so it never blocks first paint. Raise the limit to that size only.
  vite: { build: { chunkSizeWarningLimit: 800 } },
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [[rehypeKatex, { strict: false }], rehypeImages, rehypeTableScroll, rehypeTaskList, rehypeLocalLinks],
    syntaxHighlight: { type: 'shiki', excludeLangs: ['mermaid'] },
    // Dark Shiki colours are inline by default; light reading swaps to var(--shiki-light) / var(--shiki-light-bg) (global.css).
    shikiConfig: { themes: { light: 'github-light', dark: 'github-dark-dimmed' }, defaultColor: 'dark' },
  },
});
