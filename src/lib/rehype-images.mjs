// rehype plugin for vault images in Markdown (spec §7.0 and §7.4).
// For every <img>:
//   - width and height from src/data/images.json (written by scripts/sync-vault.mjs), when known;
//   - loading="lazy" and decoding="async";
//   - class "plate" for diagrams and screenshots (.svg, anh-chup-man-hinh-*, image-*, pasted-image-*),
//     otherwise class "photo". Plates sit on a light card and are never inverted or recoloured.
// An image that stands alone (its own paragraph, or alone in a list item) and has a real alt text becomes
//   <figure class="prose-fig"><img …><figcaption>alt</figcaption></figure>
// Camera and screenshot names that the sync uses as fallback alt (IMG_4985, image-016, Ảnh chụp màn hình …)
// are not captions.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const candidates = () => {
  const out = [path.resolve(process.cwd(), 'src/data/images.json')];
  try {
    out.push(fileURLToPath(new URL('../data/images.json', import.meta.url)));
  } catch {}
  return out;
};

let cache = { file: null, mtime: 0, data: {} };
function manifest() {
  for (const file of candidates()) {
    try {
      const { mtimeMs } = fs.statSync(file);
      if (cache.file !== file || cache.mtime !== mtimeMs) {
        cache = { file, mtime: mtimeMs, data: JSON.parse(fs.readFileSync(file, 'utf8')) };
      }
      return cache.data;
    } catch {}
  }
  return {};
}

const PLATE = /^(anh-chup-man-hinh-|image-|pasted-image-)/i;
const NOT_A_CAPTION =
  /^\s*(?:img|dsc|dscn|pxl|photo|image|pasted image|screenshot|screen shot|ảnh chụp màn hình|anh chup man hinh|dvcxs\s*-\s*img|sổ\s*-\s*trang)?[\s_-]*[\d\s_.:x-]*\s*$|^\s*(?:img|dsc|pxl|image|pasted image|screenshot|ảnh chụp màn hình|dvcxs)[\s_-]/i;

const fileOf = (src) => {
  let s = String(src).split(/[?#]/)[0];
  try {
    s = decodeURI(s);
  } catch {}
  return { key: s, name: s.slice(s.lastIndexOf('/') + 1) };
};

const isImg = (n) => n && n.type === 'element' && n.tagName === 'img';
const isBlank = (n) => (n.type === 'text' && !n.value.trim()) || (n.type === 'element' && n.tagName === 'br');
const captionOf = (img) => {
  const alt = String(img.properties?.alt ?? '').trim();
  return alt && !NOT_A_CAPTION.test(alt) ? alt : '';
};
const figure = (img, caption) => ({
  type: 'element',
  tagName: 'figure',
  properties: { className: ['prose-fig'] },
  children: [img, { type: 'element', tagName: 'figcaption', properties: {}, children: [{ type: 'text', value: caption }] }],
});

function decorate(img, sizes) {
  const p = (img.properties ||= {});
  const src = p.src;
  if (!src) return;
  const { key, name } = fileOf(src);
  const kind = /\.svg$/i.test(name) || PLATE.test(name) ? 'plate' : 'photo';
  const cls = Array.isArray(p.className) ? p.className : p.className ? String(p.className).split(/\s+/) : [];
  if (!cls.includes(kind)) cls.push(kind);
  p.className = cls;
  const d = sizes[key];
  if (d && p.width == null && p.height == null) {
    p.width = d.w;
    p.height = d.h;
  }
  if (p.loading == null) p.loading = 'lazy';
  if (p.decoding == null) p.decoding = 'async';
}

export default function rehypeImages() {
  return (tree) => {
    const sizes = manifest();
    const walk = (node) => {
      if (!node.children) return;
      for (const child of node.children) {
        if (isImg(child)) decorate(child, sizes);
        else walk(child);
      }
      // figures for standalone captioned images
      const kids = node.children;
      if (node.type === 'element' && node.tagName === 'li' && kids.some(isImg) && kids.every((k) => isImg(k) || isBlank(k))) {
        node.children = kids.map((k) => (isImg(k) && captionOf(k) ? figure(k, captionOf(k)) : k));
        return;
      }
      const next = [];
      for (const k of kids) {
        const only =
          k.type === 'element' &&
          k.tagName === 'p' &&
          k.children.some(isImg) &&
          k.children.every((c) => isImg(c) || isBlank(c));
        if (only && k.children.some((c) => isImg(c) && captionOf(c))) {
          // a paragraph of images only: captioned ones become figures, the rest stay in their own paragraph
          let plain = [];
          const flush = () => {
            if (plain.some(isImg)) next.push({ ...k, children: plain });
            plain = [];
          };
          for (const c of k.children) {
            if (isImg(c) && captionOf(c)) {
              flush();
              next.push(figure(c, captionOf(c)));
            } else plain.push(c);
          }
          flush();
        } else next.push(k);
      }
      node.children = next;
    };
    walk(tree);
  };
}
