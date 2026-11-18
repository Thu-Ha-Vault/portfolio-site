import { esc } from './format.js';

// Vùng giữa thị trường vật kính dầu 100× của tiêu bản nhuộm Gram (src/core/microcount.js): que tím (Gram dương), que hồng
// (Gram âm). Đơn vị µm; màu cố định ở cả giao diện sáng và tối vì đây là ảnh qua kính.

export function gramSvg(g, colors, uid = 0, width = 320) {
  const W = g.field;
  const px = width / W;
  const r1 = (v) => Math.round(v * 100) / 100;
  const cells = g.cells.map((c) => {
    const L = c.broken ? c.len * 0.6 : c.len;
    const dx = (Math.cos(c.a) * (L - c.w)) / 2;
    const dy = (Math.sin(c.a) * (L - c.w)) / 2;
    const col = colors[c.color];
    return `<line x1="${r1(c.x - dx)}" y1="${r1(c.y - dy)}" x2="${r1(c.x + dx)}" y2="${r1(c.y + dy)}" stroke="${col}" stroke-width="${r1(c.w * (c.broken ? 1.4 : 1))}" stroke-linecap="round"${c.broken ? ' stroke-dasharray="0.5 0.35"' : ''}/>`;
  }).join('');
  const nV = g.cells.filter((c) => c.color === 'violet').length;
  const label = `Ảnh nhuộm Gram qua vật kính dầu 100×: ${nV} tế bào màu tím, ${g.cells.length - nV} tế bào màu hồng hoặc nhạt.`;
  const bar = 10 * px;
  return `<figure class="slide-view">
    <svg viewBox="0 0 ${width} ${width}" width="${width}" role="img" aria-label="${esc(label)}">
      <defs><clipPath id="gr-${uid}"><circle cx="${width / 2}" cy="${width / 2}" r="${width / 2 - 4}"/></clipPath></defs>
      <rect width="${width}" height="${width}" rx="8" fill="#0b0d0f"/>
      <g clip-path="url(#gr-${uid})">
        <rect width="${width}" height="${width}" fill="${colors.bg}"/>
        <g transform="translate(${width / 2} ${width / 2}) scale(${r1(px)})">${cells}</g>
      </g>
      <g transform="translate(${r1(width / 2 - bar / 2)} ${width - 22})"><rect width="${r1(bar)}" height="4" fill="#111" stroke="#fff" stroke-width="1"/><text x="${r1(bar / 2)}" y="-4" text-anchor="middle" font-size="11" fill="#fff" stroke="#111" stroke-width="2.5" paint-order="stroke" font-family="IBM Plex Mono, ui-monospace, monospace">10 µm</text></g>
    </svg>
    <figcaption>Vùng giữa thị trường vật kính dầu 100× (khoảng ${W} µm), phóng to. Hình vẽ theo kích thước điển hình, không phải ảnh chụp.</figcaption>
  </figure>`;
}
