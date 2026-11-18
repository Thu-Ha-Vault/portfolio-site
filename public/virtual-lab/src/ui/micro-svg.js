import { esc } from './format.js';

// Ảnh qua kính của tiêu bản nhuộm bào tử và đĩa kháng sinh đồ (src/core/microcount.js). Màu cố định ở cả giao diện sáng
// và tối vì là màu thật của thuốc nhuộm và đĩa thạch; hình vẽ theo kích thước điển hình, không phải ảnh chụp.

const r1 = (v) => Math.round(v * 100) / 100;

// Vùng giữa thị trường vật kính dầu: que xanh (tế bào chất), bào tử ovan đỏ hoặc không màu, bào tử tự do
export function sporeSvg(f, colors, uid = 0, width = 320) {
  const px = width / f.field;
  const shapes = f.cells.map((c) => {
    const rot = (c.a * 180) / Math.PI;
    const g = (inner) => `<g transform="translate(${r1(c.x)} ${r1(c.y)}) rotate(${r1(rot)})">${inner}</g>`;
    const oval = (cx, len, w, col) => `<ellipse cx="${r1(cx)}" cy="0" rx="${r1(len / 2)}" ry="${r1(w / 2)}" fill="${colors[col]}" stroke="${col === 'clear' ? '#9aa3ad' : 'none'}" stroke-width="0.08"/>`;
    if (c.free) return g(oval(0, c.len, c.w, c.color));
    const body = `<rect x="${r1(-c.len / 2)}" y="${r1(-c.w / 2 - 0.08)}" width="${r1(c.len)}" height="${r1(c.w + 0.16)}" rx="${r1(c.w / 2)}" fill="${colors[c.color]}"/>`;
    // Bào tử phình rộng hơn tế bào một chút ở B. subtilis không đáng kể; vẽ theo chiều ngang tế bào
    const sp = c.spore ? oval(c.spore.at * c.len, Math.min(c.spore.len, c.len * 0.45), Math.min(c.spore.w, c.w + 0.1), c.spore.color) : '';
    return g(body + sp);
  }).join('');
  const nSp = f.cells.filter((c) => c.free || c.spore).length;
  const bar = 10 * px;
  return `<figure class="slide-view">
    <svg viewBox="0 0 ${width} ${width}" width="${width}" role="img" aria-label="${esc(`Ảnh nhuộm bào tử qua vật kính dầu: ${nSp} trên ${f.cells.length} tế bào có bào tử hoặc là bào tử tự do`)}">
      <defs><clipPath id="sp-${uid}"><circle cx="${width / 2}" cy="${width / 2}" r="${width / 2 - 4}"/></clipPath></defs>
      <rect width="${width}" height="${width}" rx="8" fill="#0b0d0f"/>
      <g clip-path="url(#sp-${uid})">
        <rect width="${width}" height="${width}" fill="${colors.bg}"/>
        <g transform="translate(${width / 2} ${width / 2}) scale(${r1(px)})">${shapes}</g>
      </g>
      <g transform="translate(${r1(width / 2 - bar / 2)} ${width - 22})"><rect width="${r1(bar)}" height="4" fill="#111" stroke="#fff" stroke-width="1"/><text x="${r1(bar / 2)}" y="-4" text-anchor="middle" font-size="11" fill="#fff" stroke="#111" stroke-width="2.5" paint-order="stroke" font-family="IBM Plex Mono, ui-monospace, monospace">10 µm</text></g>
    </svg>
    <figcaption>Vùng giữa thị trường vật kính dầu 100× (khoảng ${f.field} µm), phóng to. Hình vẽ theo kích thước điển hình, không phải ảnh chụp.</figcaption>
  </figure>`;
}

// Đĩa petri nhìn từ trên: lớp vi khuẩn, 4 khoanh giấy và vòng vô khuẩn đúng đường kính (mm)
export function diskSvg(p, width = 300) {
  const k = width / (p.plate + 6);
  const c = width / 2;
  const n = p.zones.length;
  const items = p.zones.map((z, i) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
    const x = c + Math.cos(a) * p.ring * k;
    const y = c + Math.sin(a) * p.ring * k;
    const zone = p.readable && z.zone > p.disk ? `<circle cx="${r1(x)}" cy="${r1(y)}" r="${r1((z.zone / 2) * k)}" fill="#efe6c8"/>` : '';
    return { zone, disk: `<circle cx="${r1(x)}" cy="${r1(y)}" r="${r1((p.disk / 2) * k)}" fill="#fbfbf7" stroke="#b9b39d" stroke-width="0.8"/><text x="${r1(x)}" y="${r1(y + 3)}" text-anchor="middle" font-size="7.5" fill="#333" font-family="IBM Plex Mono, ui-monospace, monospace">${esc(z.id)}</text>`, label: p.readable ? `${z.id} ${z.zone} mm` : `${z.id} chưa đọc được` };
  });
  const lawn = p.readable ? (p.heavy ? '#c9b98a' : '#d8cb9c') : '#e6dcbb';
  return `<figure class="slide-view">
    <svg viewBox="0 0 ${width} ${width}" width="${width}" role="img" aria-label="${esc(`Đĩa kháng sinh đồ: ${items.map((it) => it.label).join(', ')}`)}">
      <circle cx="${c}" cy="${c}" r="${r1(((p.plate + 6) / 2) * k)}" fill="#dfe4e8" stroke="#9aa3ad"/>
      <circle cx="${c}" cy="${c}" r="${r1((p.plate / 2) * k)}" fill="${lawn}"/>
      ${items.map((it) => it.zone).join('')}${items.map((it) => it.disk).join('')}
    </svg>
    <figcaption>Đĩa thạch ${p.plate} mm nhìn từ trên, khoanh giấy ${p.disk} mm; vùng sáng quanh khoanh là vòng vô khuẩn. ${esc(items.map((it) => it.label).join('; '))}.</figcaption>
  </figure>`;
}
