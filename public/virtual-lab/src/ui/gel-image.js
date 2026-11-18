import { esc } from './format.js';

// Ảnh gel như máy chụp gel trả về: nền tối, băng DNA sáng (ảnh xám), giếng ở trên, cực dương ở dưới.
// Màu cố định ở cả giao diện sáng và tối vì đây là một tấm ảnh.

const MARK = new Set([10000, 6000, 3000, 1500, 1000, 500, 250]);

export function gelImage({ lanes, gelCm }, uid) {
  const laneW = 34;
  const left = 46;
  const top = 30;
  const scale = 21; // px mỗi cm
  const w = left + lanes.length * laneW + 10;
  const h = top + gelCm * scale + 10;
  const y = (cm) => top + 6 + cm * scale;
  const cx = (i) => left + i * laneW + laneW / 2;

  const wells = lanes.map((_, i) => `<rect x="${cx(i) - 12}" y="${top}" width="24" height="5" rx="1" fill="#2a3138"/>`).join('');
  const names = lanes.map((l, i) => `<text x="${cx(i)}" y="${top - 9}" text-anchor="middle">${esc(l.name)}</text>`).join('');
  // Băng có trường smear (cm cuối vệt) là vệt kéo dài: DNA đứt gãy, RNA; sáng nhất ở đầu vệt rồi mờ dần
  const band = (b, i) =>
    b.smear > b.cm
      ? `<rect x="${cx(i) - 11}" y="${(y(b.cm) - 1.6).toFixed(1)}" width="22" height="${((b.smear - b.cm) * scale + 3.2).toFixed(1)}" rx="1.2" fill="url(#smear-${uid})" opacity="${(0.25 + 0.75 * b.w).toFixed(2)}"/>`
      : `<rect x="${cx(i) - 11}" y="${(y(b.cm) - 1.6).toFixed(1)}" width="22" height="3.2" rx="1.2" fill="#f4f1ea" opacity="${(0.25 + 0.75 * b.w).toFixed(2)}"/>`;
  const bands = lanes.flatMap((l, i) => l.bands.map((b) => band(b, i))).join('');
  const ladder = lanes[0].bands
    .filter((b) => MARK.has(b.bp) && b.cm > 0)
    .map((b) => `<text x="${left - 6}" y="${(y(b.cm) + 3).toFixed(1)}" text-anchor="end">${b.bp >= 1000 ? `${String(b.bp / 1000).replace(".", ",")} kb` : `${b.bp} bp`}</text>`)
    .join('');
  const summary = lanes.map((l) => `${l.title}: ${l.bands.length ? `${l.bands.length} băng` : 'không có băng'}`).join('; ');

  return `<figure class="gel-photo">
    <svg viewBox="0 0 ${w} ${h}" role="img" aria-label="Ảnh gel. ${esc(summary)}">
      <defs><filter id="glow-${uid}" x="-20%" y="-200%" width="140%" height="500%"><feGaussianBlur stdDeviation="0.9"/></filter><linearGradient id="smear-${uid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f4f1ea"/><stop offset="1" stop-color="#f4f1ea" stop-opacity="0.08"/></linearGradient></defs>
      <rect width="${w}" height="${h}" rx="6" fill="#0b0d0f"/>
      <rect x="${left - 4}" y="${top - 2}" width="${lanes.length * laneW + 8}" height="${h - top - 6}" rx="3" fill="#15191d"/>
      ${wells}
      <g filter="url(#glow-${uid})">${bands}</g>
      <g fill="#aeb8c1" font-size="9.5" font-family="IBM Plex Mono, ui-monospace, monospace">${names}${ladder}</g>
    </svg>
    <figcaption>Giếng ở trên (cực âm), DNA chạy xuống phía cực dương. Làn L là ladder 1 kb.</figcaption>
  </figure>`;
}
