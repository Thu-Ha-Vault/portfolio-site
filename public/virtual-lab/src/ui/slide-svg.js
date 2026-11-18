import { esc } from './format.js';

// Ảnh qua thị kính của tiêu bản hiển vi ảo (src/core/slides.js): vùng tròn sáng trong nền tối, mẫu cắt theo thị trường.
// Màu theo cách nhuộm (cố định ở cả giao diện sáng và tối vì đây là ảnh qua kính). Đơn vị vẽ là µm.

const PAL = {
  double: { bg: '#f4ecd6', cell: '#f8f1e2', cel: '#d27a95', coll: '#bd3f6c', lig: '#2f8a6c', sub: '#8a4a2c', cut: '#c76d88', ph: '#b25f7a', phloem: '#e3a9b9', xylem: '#cfe4d5', fiber: '#dcefe2', lumen: '#fbf8ee', cambium: '#e7b19f', cavity: '#fcf8ec', air: '#fdfbf4', sheath: '#bfe0cf', endo: '#c98a5a', cork: '#b5583a', meso: '#b98a78', chloro: '#d9a3a8', debris: '#8b7b62' },
  none: { bg: '#efe2bd', cell: '#f3e8c8', cel: '#b69a62', coll: '#a8884e', lig: '#9a8450', sub: '#8a6a3c', cut: '#a8884e', ph: '#a88a5a', phloem: '#dcc79a', xylem: '#e4d3a6', fiber: '#e6d6aa', lumen: '#f6eed6', cambium: '#dcc79a', cavity: '#f6eed6', air: '#f8f2de', sheath: '#e0cd9e', endo: '#a8884e', cork: '#9a6a3a', meso: '#b49a6a', chloro: '#c8b07a', debris: '#7a6a4a' },
  red: { bg: '#f0e1ae', cyto: '#f3cf9e', nuc: '#e9a06a', chrom: '#b3301c', wall: '#d9a36e' },
  purple: { bg: '#eee7ec', cyto: '#e9d5e3', nuc: '#cf9cc6', chrom: '#5e2466', wall: '#cfb7c9' },
  wet: { bg: '#edf3ec', cell: '#dcc27e', lig: '#7d6226', debris: '#8b7b62', none: '#8b7b62', air: '#f7faf6', cel: '#a68d4f' },
  mb: { bg: '#eef3f6', cell: '#e4eef5', wall: '#5d82ab', nuc: '#2f4f9a', nucleolus: '#1b2c66' },
  giemsa: { bg: '#f4eef1', cell: '#efd2df', wall: '#d6a2bb', nuc: '#7a3a8c', nucleolus: '#5a2468' },
  plain: { bg: '#f2f2ee', cell: '#f5f5f0', wall: '#cfcfc4', nuc: '#e6e6dc', nucleolus: '#dcdccf' },
};
const r1 = (v) => Math.round(v * 10) / 10;

export function slideSvg(f, uid = 0, width = 320) {
  const v = f.view;
  const half = v.fov / 2;
  const P = PAL[f.stain] ?? PAL.double;
  const sw = v.fov * 0.0011; // độ dày vách (µm vẽ) theo thị trường để vách luôn thấy được
  const col = (k) => P[k] ?? P.cell ?? '#ccc';
  const stroke = (w) => (w === 'none' ? 'none' : col(w));
  const swOf = (w) => (w === 'lig' || w === 'coll' || w === 'sub' ? sw * 2.2 : sw);
  const out = [];
  for (const s of f.shapes) {
    if (s.t === 'c') out.push(`<circle cx="${r1(s.x)}" cy="${r1(s.y)}" r="${r1(s.r)}" fill="${col(s.f)}" stroke="${stroke(s.w)}" stroke-width="${r1(swOf(s.w))}"/>`);
    else if (s.t === 'e') out.push(`<ellipse cx="${r1(s.x)}" cy="${r1(s.y)}" rx="${r1(s.rx)}" ry="${r1(s.ry)}" transform="rotate(${r1((s.rot * 180) / Math.PI)} ${r1(s.x)} ${r1(s.y)})" fill="${col(s.f)}" stroke="${stroke(s.w)}" stroke-width="${r1(swOf(s.w))}"/>`);
    else if (s.t === 'ring') out.push(`<path d="${annulus(s.r0, s.r1)}" fill-rule="evenodd" fill="${col(s.f)}" stroke="${s.dash ? 'none' : stroke(s.w)}" stroke-width="${r1(sw)}"/>`);
    else if (s.t === 'ray') out.push(`<line x1="${r1(s.r0 * Math.cos(s.a))}" y1="${r1(s.r0 * Math.sin(s.a))}" x2="${r1(s.r1 * Math.cos(s.a))}" y2="${r1(s.r1 * Math.sin(s.a))}" stroke="${col(s.w)}" stroke-width="${r1(sw * 4)}"/>`);
    else if (s.t === 'wedge') out.push(`<path d="${wedge(s)}" fill="${col(s.f)}" stroke="${col(s.w)}" stroke-width="${r1(sw)}"/>`);
    else if (s.t === 'blade') out.push(`<path d="${blade(s)}" fill="${col(s.f)}" fill-opacity="${s.dark ? 0.9 : 0.55}" stroke="${col(s.w)}" stroke-width="${r1(sw * 2)}"/>`);
    else if (s.t === 'diatom') out.push(diatom(s, P, sw));
    else if (s.t === 'rr') out.push(`<rect x="${r1(-s.w / 2)}" y="${r1(-s.h / 2)}" width="${r1(s.w)}" height="${r1(s.h)}" rx="${r1(s.h * 0.12)}" transform="translate(${r1(s.x)} ${r1(s.y)}) rotate(${r1((s.rot * 180) / Math.PI)})" fill="${col(s.f)}" stroke="${col(s.w2)}" stroke-width="${r1(sw * 1.6)}"/>`);
    else if (s.t === 'poly') out.push(`<polygon points="${s.pts.map(([x, y]) => `${r1(x)},${r1(y)}`).join(' ')}" fill="${col(s.f)}" fill-opacity="0.9" stroke="${col(s.w2)}" stroke-width="${r1(sw)}"/>`);
  }
  for (const c of f.cells) out.push(f.kind === 'meiosis' ? meiosisCell(c, P, sw) : mitosisCell(c, P, sw));
  const bubbles = f.bubbles.map((b) => `<circle cx="${r1(b.x)}" cy="${r1(b.y)}" r="${r1(b.r)}" fill="#fbfbf6" fill-opacity="0.9" stroke="#2a2622" stroke-width="${r1(Math.max(b.r * 0.06, sw * 4))}"/><circle cx="${r1(b.x - b.r * 0.3)}" cy="${r1(b.y + b.r * 0.3)}" r="${r1(b.r * 0.18)}" fill="#ffffff"/>`).join('');
  const found = f.found && v.mag >= 40 ? `<circle cx="${r1(f.found.x)}" cy="${r1(f.found.y)}" r="${r1(f.kind === 'mitosis' ? 20 : 34)}" fill="none" stroke="#1f6fd1" stroke-width="${r1(sw * 3)}" stroke-dasharray="${r1(sw * 8)} ${r1(sw * 5)}"/>` : '';
  // Thước tỉ lệ: 1 mm ở 4×, 200 µm ở 10×, 50 µm ở 40×
  const bar = { 4: [1000, '1 mm'], 10: [200, '200 µm'], 40: [50, '50 µm'], 100: [20, '20 µm'] }[v.mag] ?? [100, '100 µm'];
  const px = width / v.fov;
  const barPx = bar[0] * px;
  const id = `sl-${uid}`;
  const label = `Ảnh qua kính hiển vi, vật kính ${v.mag}×${v.mag === 100 ? (v.oil ? ' có dầu soi' : ' thiếu dầu soi') : ''}, thị trường ${String(Math.round(v.fov) / 1000).replace('.', ',')} mm${f.thick ? ', lát cắt quá dày nên tối' : ''}${f.bubbles.length ? ', có bọt khí' : ''}${f.squash === false ? ', tế bào chồng lên nhau' : ''}.`;
  return `<figure class="slide-view">
    <svg viewBox="0 0 ${width} ${width}" width="${width}" role="img" aria-label="${esc(label)}">
      <defs>
        <clipPath id="${id}-eye"><circle cx="${width / 2}" cy="${width / 2}" r="${width / 2 - 4}"/></clipPath>
        <filter id="${id}-blur"><feGaussianBlur stdDeviation="${f.thick || f.squash === false || (v.mag === 100 && !v.oil) ? 1.6 : 0}"/></filter>
      </defs>
      <rect width="${width}" height="${width}" rx="8" fill="#0b0d0f"/>
      <g clip-path="url(#${id}-eye)">
        <rect width="${width}" height="${width}" fill="${P.bg}"/>
        <g filter="url(#${id}-blur)" transform="translate(${width / 2} ${width / 2}) scale(${r1(px * 1000) / 1000} ${-r1(px * 1000) / 1000}) translate(${r1(-v.x)} ${r1(-v.y)})">
          ${out.join('')}${bubbles}${found}
        </g>
        ${f.thick ? `<rect width="${width}" height="${width}" fill="#2a1d12" opacity="0.62"/>` : ''}
        ${f.squash === false ? `<rect width="${width}" height="${width}" fill="#7a1f12" opacity="0.35"/>` : ''}
      </g>
      <g transform="translate(${width / 2 - barPx / 2} ${width - 22})"><rect width="${r1(barPx)}" height="4" fill="#111" stroke="#fff" stroke-width="1"/><text x="${r1(barPx / 2)}" y="-4" text-anchor="middle" font-size="11" fill="#fff" stroke="#111" stroke-width="2.5" paint-order="stroke" font-family="IBM Plex Mono, ui-monospace, monospace">${bar[1]}</text></g>
    </svg>
    <figcaption>Vật kính ${v.mag}× (độ phóng đại ${v.mag * 10}×), thị trường ${String(Math.round(v.fov) / 1000).replace('.', ',')} mm. Hình vẽ theo cấu tạo điển hình và ảnh thực hành, không phải ảnh chụp.</figcaption>
  </figure>`;
}

function annulus(a, b) {
  const c = (r) => `M ${r1(r)} 0 A ${r1(r)} ${r1(r)} 0 1 0 ${r1(-r)} 0 A ${r1(r)} ${r1(r)} 0 1 0 ${r1(r)} 0 Z`;
  return `${c(b)} ${a > 0 ? c(a) : ''}`;
}

// Tia libe loe rộng: hình nêm hẹp ở trong, rộng ở ngoài
function wedge(s) {
  const p = (r, a) => `${r1(r * Math.cos(a))} ${r1(r * Math.sin(a))}`;
  return `M ${p(s.r0, s.a - s.spread * 0.15)} L ${p(s.r1, s.a - s.spread)} L ${p(s.r1, s.a + s.spread)} L ${p(s.r0, s.a + s.spread * 0.15)} Z`;
}

// Phiến lá có gân giữa lồi
function blade(s) {
  const bump = (x, h) => (Math.abs(x) < s.bulgeW ? h * Math.cos((x / s.bulgeW) * (Math.PI / 2)) ** 2 : 0);
  const top = [];
  const bot = [];
  for (let x = s.x0; x <= s.x1; x += 20) {
    top.push(`${r1(x)} ${r1(s.top + bump(x, s.bulgeTop))}`);
    bot.push(`${r1(x)} ${r1(s.bottom - bump(x, s.bulgeBottom))}`);
  }
  return `M ${top.join(' L ')} L ${bot.reverse().join(' L ')} Z`;
}

function diatom(s, P, sw) {
  const L = s.len / 2;
  const W = s.len * 0.13;
  const pts = [];
  for (let k = 0; k <= 24; k++) {
    const t = -1 + (2 * k) / 24;
    pts.push([t * L, W * Math.sqrt(1 - t * t) ** 0.8]);
  }
  const outline = `M ${pts.map(([x, y]) => `${r1(x)} ${r1(y)}`).join(' L ')} L ${pts.slice().reverse().map(([x, y]) => `${r1(x)} ${r1(-y)}`).join(' L ')} Z`;
  const striae = [];
  for (let x = -L * 0.85; x <= L * 0.85; x += Math.max(4, s.len / 26)) {
    const h = W * Math.sqrt(1 - (x / L) ** 2) ** 0.8 * 0.8;
    striae.push(`M ${r1(x)} ${r1(h)} L ${r1(x)} ${r1(W * 0.12)} M ${r1(x)} ${r1(-W * 0.12)} L ${r1(x)} ${r1(-h)}`);
  }
  return `<g transform="translate(${r1(s.x)} ${r1(s.y)}) rotate(${r1((s.rot * 180) / Math.PI)})"><path d="${outline}" fill="${P.cell}" stroke="${P.lig}" stroke-width="${r1(sw * 1.5)}"/><path d="${striae.join(' ')}" stroke="${P.lig}" stroke-width="${r1(sw * 0.6)}" opacity="0.7"/><line x1="${r1(-L * 0.9)}" y1="0" x2="${r1(L * 0.9)}" y2="0" stroke="${P.lig}" stroke-width="${r1(sw)}"/></g>`;
}

// Một tế bào sinh tinh theo kỳ giảm phân (11 thể lưỡng trị và một NST X ở kỳ giữa I)
function meiosisCell(c, P, sw) {
  const { x, y, r, rot } = c;
  const g = [];
  const chrom = (cx, cy, l, w, a) => `<ellipse cx="${r1(cx)}" cy="${r1(cy)}" rx="${r1(l)}" ry="${r1(w)}" transform="rotate(${r1((a * 180) / Math.PI)} ${r1(cx)} ${r1(cy)})" fill="${P.chrom}"/>`;
  const ux = Math.cos(rot);
  const uy = Math.sin(rot);
  const band = (ox, oy, n, len) => Array.from({ length: n }, (_, i) => { const t = (i - (n - 1) / 2) / Math.max(1, n - 1); return chrom(ox + -uy * t * len, oy + ux * t * len, r * 0.14, r * 0.07, rot); }).join('');
  const blob = (ox, oy, n, rr) => Array.from({ length: n }, (_, i) => { const a = (i * 2.4) % (Math.PI * 2); const d = rr * Math.sqrt((i + 0.5) / n); return chrom(ox + d * Math.cos(a), oy + d * Math.sin(a), r * 0.09, r * 0.05, a); }).join('');
  if (c.phase === 'sp') {
    g.push(`<path d="M ${r1(x)} ${r1(y)} q ${r1(ux * r * 2)} ${r1(uy * r * 2 + r)} ${r1(ux * r * 4)} ${r1(uy * r * 4)}" fill="none" stroke="${P.chrom}" stroke-width="${r1(r * 0.35)}" stroke-linecap="round"/><path d="M ${r1(x + ux * r * 4)} ${r1(y + uy * r * 4)} l ${r1(ux * r * 14)} ${r1(uy * r * 14)}" stroke="${P.wall}" stroke-width="${r1(sw * 0.8)}"/>`);
    return g.join('');
  }
  g.push(`<circle cx="${r1(x)}" cy="${r1(y)}" r="${r1(r)}" fill="${P.cyto}" fill-opacity="0.85" stroke="${P.wall}" stroke-width="${r1(sw)}"/>`);
  const off = (k) => [x + ux * r * k, y + uy * r * k];
  switch (c.phase) {
    case 'p1': g.push(`<circle cx="${r1(x)}" cy="${r1(y)}" r="${r1(r * 0.68)}" fill="${P.nuc}"/>`, blob(x, y, 14, r * 0.55)); break;
    case 'm1': g.push(band(x, y, 11, r * 1.2), chrom(x + ux * r * 0.45, y + uy * r * 0.45, r * 0.1, r * 0.06, rot)); break;
    case 'a1': g.push(blob(...off(-0.55), 11, r * 0.32), blob(...off(0.55), 12, r * 0.32)); break;
    case 't1': g.push(`<circle cx="${r1(off(-0.45)[0])}" cy="${r1(off(-0.45)[1])}" r="${r1(r * 0.38)}" fill="${P.nuc}"/><circle cx="${r1(off(0.45)[0])}" cy="${r1(off(0.45)[1])}" r="${r1(r * 0.38)}" fill="${P.nuc}"/>`, blob(...off(-0.45), 6, r * 0.25), blob(...off(0.45), 6, r * 0.25)); break;
    case 'm2': g.push(band(...off(-0.45), 6, r * 0.6), band(...off(0.45), 6, r * 0.6)); break;
    case 'a2': for (const k of [-0.75, -0.25, 0.25, 0.75]) g.push(blob(...off(k), 6, r * 0.16)); break;
    case 't2': for (const k of [-0.6, -0.2, 0.2, 0.6]) g.push(`<circle cx="${r1(off(k)[0])}" cy="${r1(off(k)[1])}" r="${r1(r * 0.17)}" fill="${P.chrom}" fill-opacity="0.8"/>`); break;
    case 'sd': g.push(`<circle cx="${r1(x)}" cy="${r1(y)}" r="${r1(r * 0.55)}" fill="${P.chrom}" fill-opacity="0.85"/>`); break;
  }
  return g.join('');
}

// Tế bào đỉnh rễ gần vuông theo kỳ nguyên phân (2n = 16 ở hành)
function mitosisCell(c, P, sw) {
  const { x, y, r, rot } = c;
  const s = r * 2;
  const g = [`<rect x="${r1(x - r)}" y="${r1(y - r)}" width="${r1(s)}" height="${r1(s)}" fill="${P.cyto}" fill-opacity="0.85" stroke="${P.wall}" stroke-width="${r1(sw)}" transform="rotate(${r1((rot * 180) / Math.PI)} ${r1(x)} ${r1(y)})"/>`];
  const chrom = (cx, cy, l, w, a) => `<ellipse cx="${r1(cx)}" cy="${r1(cy)}" rx="${r1(l)}" ry="${r1(w)}" transform="rotate(${r1(a)} ${r1(cx)} ${r1(cy)})" fill="${P.chrom}"/>`;
  switch (c.phase) {
    case 'i': g.push(`<circle cx="${r1(x)}" cy="${r1(y)}" r="${r1(r * 0.68)}" fill="${P.nuc}"/><circle cx="${r1(x + r * 0.12)}" cy="${r1(y)}" r="${r1(r * 0.14)}" fill="${P.chrom}"/>`); break;
    case 'p': g.push(`<circle cx="${r1(x)}" cy="${r1(y)}" r="${r1(r * 0.58)}" fill="${P.nuc}"/>`, ...Array.from({ length: 8 }, (_, i) => chrom(x + Math.cos(i * 2.3) * r * 0.3, y + Math.sin(i * 2.3) * r * 0.3, r * 0.22, r * 0.05, i * 47))); break;
    case 'm': g.push(...Array.from({ length: 8 }, (_, i) => chrom(x, y + (i - 3.5) * r * 0.16, r * 0.1, r * 0.06, 0))); break;
    case 'a': for (const k of [-1, 1]) g.push(...Array.from({ length: 8 }, (_, i) => chrom(x + k * r * 0.6, y + (i - 3.5) * r * 0.13, r * 0.14, r * 0.04, k * 20))); break;
    case 't': g.push(`<circle cx="${r1(x - r * 0.5)}" cy="${r1(y)}" r="${r1(r * 0.32)}" fill="${P.chrom}" fill-opacity="0.8"/><circle cx="${r1(x + r * 0.5)}" cy="${r1(y)}" r="${r1(r * 0.32)}" fill="${P.chrom}" fill-opacity="0.8"/><line x1="${r1(x)}" y1="${r1(y - r)}" x2="${r1(x)}" y2="${r1(y + r)}" stroke="${P.wall}" stroke-width="${r1(sw * 1.5)}"/>`); break;
  }
  return g.join('');
}
