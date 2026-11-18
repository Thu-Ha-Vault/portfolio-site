import { esc } from './format.js';

// Ảnh gel protein nhuộm Coomassie (nền sáng, băng xanh): gel 2D (spot theo pI và khối lượng) và gel SDS một chiều.
// Màu cố định ở cả giao diện sáng và tối vì đây là một tấm ảnh.

const MARKS = [250, 150, 100, 75, 50, 37, 25, 20, 15, 10];

function axisKDa(rf, x, y0, h) {
  return MARKS.map((k) => {
    const r = rf(k);
    if (r < 0 || r > 1) return '';
    const y = y0 + r * h;
    return `<text x="${x}" y="${(y + 3).toFixed(1)}" text-anchor="end">${k}</text>`;
  }).join('');
}

// gel: { spots: [{ x 0–1, y (Rf), ug, smearX, smearY, artifact }], ipg }, rf: hàm Rf theo kDa
export function gel2d(gel, rf) {
  const W = 300;
  const H = 230;
  const L = 34;
  const T = 22;
  const gw = W - L - 10;
  const gh = H - T - 20;
  const [lo, hi] = gel.ipg.split('-').map(Number);
  const spots = gel.spots.map((s) => {
    const r = Math.max(2, Math.min(11, 2 + Math.log10(1 + s.ug / 0.1) * 3));
    const rx = r * (1 + 3 * s.smearX);
    const ry = r * 0.7 * (1 + 4 * s.smearY);
    const o = Math.min(0.95, 0.25 + Math.log10(1 + s.ug / 0.1) / 3);
    return `<ellipse cx="${(L + s.x * gw).toFixed(1)}" cy="${(T + s.y * gh).toFixed(1)}" rx="${rx.toFixed(1)}" ry="${ry.toFixed(1)}" fill="#1f3f8f" opacity="${o.toFixed(2)}"/>`;
  }).join('');
  const ticks = Array.from({ length: hi - lo + 1 }, (_, i) => lo + i).map((p) => `<text x="${(L + ((p - lo) / (hi - lo)) * gw).toFixed(1)}" y="${T - 7}" text-anchor="middle">${p}</text>`).join('');
  return `<figure class="gel-photo">
    <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Ảnh gel hai chiều nhuộm Coomassie: ${gel.spots.length} spot, trục ngang pH ${lo}–${hi}, trục dọc khối lượng phân tử">
      <filter id="g2d"><feGaussianBlur stdDeviation="1.1"/></filter>
      <rect width="${W}" height="${H}" rx="6" fill="#eef1f4"/>
      <rect x="${L}" y="${T}" width="${gw}" height="${gh}" fill="#dfe6ee"/>
      <g filter="url(#g2d)">${spots}</g>
      <g fill="#3a4652" font-size="9" font-family="IBM Plex Mono, ui-monospace, monospace">${ticks}${axisKDa(rf, L - 4, T, gh)}<text x="${L + gw}" y="${H - 6}" text-anchor="end">pH (IEF) →, kDa ↓</text></g>
    </svg>
    <figcaption>Chiều 1: tập trung đẳng điện trên thanh IPG ${esc(gel.ipg)} (trái acid, phải base). Chiều 2: SDS-PAGE ${gel.percent} %, protein lớn ở trên.</figcaption>
  </figure>`;
}

// gel: { bands: [{ name, kDa, rf, w }], percent } hoặc nhiều giếng { lanes: [{ label, bands }], stain }
export function sdsGel(gel, rf) {
  if (gel.lanes) return sdsLanes(gel, rf);
  const W = 200;
  const H = 220;
  const L = 40;
  const T = 16;
  const gh = H - T - 16;
  const lane = (x, bands) => bands.map((b) => `<rect x="${x}" y="${(T + b.rf * gh - 2).toFixed(1)}" width="44" height="${(3 + b.w * 3).toFixed(1)}" rx="1.5" fill="#1f3f8f" opacity="${(0.2 + 0.8 * b.w).toFixed(2)}"/>`).join('');
  const ladder = MARKS.map((k) => ({ rf: rf(k), w: [75, 25].includes(k) ? 0.9 : 0.5 })).filter((b) => b.rf >= 0 && b.rf <= 1);
  return `<figure class="gel-photo">
    <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Ảnh gel SDS-PAGE nhuộm Coomassie: thang chuẩn và ${gel.bands.length} băng mẫu">
      <rect width="${W}" height="${H}" rx="6" fill="#eef1f4"/>
      <rect x="${L - 4}" y="${T - 4}" width="${W - L - 4}" height="${gh + 8}" fill="#dfe6ee"/>
      <g filter="url(#g2d)">${lane(L, ladder)}${lane(L + 60, gel.bands)}</g>
      <g fill="#3a4652" font-size="9" font-family="IBM Plex Mono, ui-monospace, monospace">${axisKDa(rf, L - 6, T, gh)}<text x="${L + 22}" y="${T - 5}" text-anchor="middle">Thang</text><text x="${L + 82}" y="${T - 5}" text-anchor="middle">Mẫu</text></g>
    </svg>
    <figcaption>Gel ${gel.percent} %, nhuộm Coomassie; số bên trái là kDa của thang chuẩn.</figcaption>
  </figure>`;
}

// Gel nhiều giếng (các bước tinh sạch): thang chuẩn + một giếng mỗi bước; băng tính Rf theo kDa
function sdsLanes(gel, rf) {
  const n = gel.lanes.length;
  const LW = 30;
  const L = 40;
  const T = 16;
  const W = L + (n + 1) * (LW + 10) + 6;
  const H = 220;
  const gh = H - T - 16;
  const lane = (x, bands) => bands.map((b) => `<rect x="${x}" y="${(T + b.rf * gh - 2).toFixed(1)}" width="${LW}" height="${(3 + b.w * 3).toFixed(1)}" rx="1.5" fill="${gel.stain === 'silver' ? '#4a3a2a' : '#1f3f8f'}" opacity="${(0.2 + 0.8 * b.w).toFixed(2)}"/>`).join('');
  const ladder = MARKS.map((k) => ({ rf: rf(k), w: [75, 25].includes(k) ? 0.9 : 0.5 })).filter((b) => b.rf >= 0 && b.rf <= 1);
  const lanes = gel.lanes.map((l, i) => lane(L + (i + 1) * (LW + 10), l.bands.map((b) => ({ ...b, rf: rf(b.kDa) })).filter((b) => b.rf >= 0 && b.rf <= 1))).join('');
  const labels = ['Thang', ...gel.lanes.map((l) => l.label)].map((t, i) => `<text x="${L + i * (LW + 10) + LW / 2}" y="${T - 5}" text-anchor="middle">${esc(t)}</text>`).join('');
  const bg = gel.stain === 'silver' ? '#efe9dc' : '#dfe6ee';
  return `<figure class="gel-photo">
    <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Ảnh gel SDS-PAGE: thang chuẩn và ${n} giếng ${esc(gel.lanes.map((l) => `${l.label} ${l.bands.length} băng`).join(', '))}">
      <rect width="${W}" height="${H}" rx="6" fill="#eef1f4"/>
      <rect x="${L - 4}" y="${T - 4}" width="${W - L - 4}" height="${gh + 8}" fill="${bg}"/>
      <g>${lane(L, ladder)}${lanes}</g>
      <g fill="#3a4652" font-size="8.5" font-family="IBM Plex Mono, ui-monospace, monospace">${axisKDa(rf, L - 6, T, gh)}${labels}</g>
    </svg>
    <figcaption>${esc(gel.caption ?? `Nhuộm ${gel.stain === 'silver' ? 'bạc' : 'Coomassie'}`)}; số bên trái là kDa của thang chuẩn.</figcaption>
  </figure>`;
}
