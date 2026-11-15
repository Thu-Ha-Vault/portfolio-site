/**
 * English versions of articles live in src/content/blog-en (written by scripts/sync-vault.mjs, same inner paths as
 * src/content/blog). The folder stays empty until an article in the vault has an English version, and Astro warns
 * about empty collections, so the content config and the pages ask here first.
 */
import { existsSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';

export const EN_CONTENT_DIR = 'src/content/blog-en';

export function hasEnglishArticles(): boolean {
  const dir = resolve(process.cwd(), EN_CONTENT_DIR);
  return existsSync(dir) && readdirSync(dir, { recursive: true }).some((f) => String(f).endsWith('.md'));
}
