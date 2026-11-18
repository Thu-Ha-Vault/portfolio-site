import { esc } from './format.js';
import { anatomyOf } from '../core/anatomy/index.js';
import { smooth, radii, normals, tubeOutline, bounds, primPoints, shade, lighten, rng } from '../core/anatomy/kit.js';

// Hình giải phẫu của mẫu đang mổ trên khay đáy sáp đen, nhìn từ trên xuống, đầu ở bên trái. Hình dạng, vị trí, màu cơ
// quan lấy từ src/core/anatomy/<loài>.js (cùng hình học với mẫu 3D trên khay). Trạng thái theo DissectLab.figureData():
// chưa mổ thì thấy mặt ngoài; đã cắt thì thấy đường cắt; đã phanh thì thấy vạt thành cơ thể ghim hai bên và nội quan;
// gỡ ống tiêu hoá thì thấy lớp sát thành lưng. Cơ quan bài yêu cầu có số; số xanh là đã quan sát, đỏ là bị hỏng.

let uidSeq = 0;
const LIGHT = [-0.45, -0.89]; // hướng ánh sáng trên hình (từ trên trái)
const fmt = (v) => (Math.round(v * 10) / 10).toString();
const GAP = 15; // khoảng cách tối thiểu giữa hai số chú thích
const ROW = 15; // khoảng cách giữa hai hàng số

export function dissectSvg(spec, f, highlight = null, width = 400) {
  const art = anatomyOf(f.specimen, f);
  if (!art) return '';
  const uid = `ds${++uidSeq}`;
  const S = spec;
  const byId = new Map(S.organs.map((o) => [o.id, o]));
  const organs = art.organs;
  const shown = (o) => {
    if (!o) return false;
    if (o.layer === 0) return true;
    if (!f.open) return false;
    if (o.layer === 2) return f.removed;
    if (o.gut && f.removed) return false;
    return !(f.open === 'partial' && o.pos[1] < 0);
  };
  const [fx0, fx1, fy0, fy1] = art.frame;
  const k = art.stretch ?? 1; // giãn ngang thân cho mẫu dài mảnh (giun)
  const rim = 7;
  const s = (width - 2 * rim - 12) / (fx1 - fx0);
  const X = (x) => rim + 6 + (x - fx0) * s;

  // Cơ quan đang thấy và điểm đặt chú thích (toạ độ mẫu)
  const visible = [];
  for (const [id, A] of Object.entries(organs)) {
    const o = byId.get(id);
    if (!shown(o) || (A.when && !A.when(f))) continue;
    const parts = A.parts.filter((p) => p.only !== '3d');
    const pts = parts.flatMap(primPoints);
    const b = pts.length ? bounds(pts) : null;
    const a = A.anchor ?? (b ? [b.cx, b.cy] : null);
    visible.push({ id, o, A, parts, a });
  }

  // Bố trí số chú thích: chia hai dải trên/dưới theo phía của trục thân, cân số lượng, dải đông thì xếp hai hàng
  const num = new Map(S.required.map((id, i) => [id, i + 1]));
  const axis = art.axis ?? 0;
  const lab = visible.filter((v) => num.has(v.id) && v.a && (f.open !== 'partial' || v.o.layer === 0 || v.a[1] >= (art.partialY ?? 0)));
  const side = { top: [], bottom: [] };
  for (const v of lab) side[v.a[1] < axis ? 'top' : 'bottom'].push(v);
  const near = (list) => list.reduce((m, v, i) => (Math.abs(v.a[1] - axis) < Math.abs(list[m].a[1] - axis) ? i : m), 0);
  const avail = width - 2 * rim - 20;
  const cap = Math.floor(avail / GAP);
  // Chỉ chuyển số sang dải bên kia khi dải này đã đầy một hàng mà dải kia còn chỗ
  while (Math.max(side.top.length, side.bottom.length) > cap && Math.abs(side.top.length - side.bottom.length) > 1) {
    const [from, to] = side.top.length > side.bottom.length ? ['top', 'bottom'] : ['bottom', 'top'];
    side[to].push(...side[from].splice(near(side[from]), 1));
  }
  const rowsOf = (list) => (list.length * GAP > avail ? 2 : 1);
  const bandTop = 12 + rowsOf(side.top) * ROW;
  const bandBottom = 12 + rowsOf(side.bottom) * ROW;
  const H = (fy1 - fy0) * s * k;
  const height = H + bandTop + bandBottom + 2 * rim + 12;
  const Y = (y) => rim + bandTop + 6 + (y - fy0) * s * k;
  const P = (p) => [X(p[0]), Y(p[1])];

  const defs = [];
  const grads = new Map();
  const grad = (c) => {
    if (!grads.has(c)) {
      const id = `${uid}g${grads.size}`;
      grads.set(c, id);
      defs.push(`<radialGradient id="${id}" cx="0.36" cy="0.3" r="0.8"><stop offset="0" stop-color="${lighten(c, 0.32)}"/><stop offset="0.55" stop-color="${c}"/><stop offset="1" stop-color="${shade(c, 0.66)}"/></radialGradient>`);
    }
    return `url(#${grads.get(c)})`;
  };
  let clipN = 0;
  defs.push(patterns(uid));
  defs.push(`<filter id="${uid}sh" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0.4" dy="1.1" stdDeviation="1.1" flood-color="#000" flood-opacity="0.55"/></filter>`);
  defs.push(`<filter id="${uid}bl" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
  defs.push(`<filter id="${uid}gl" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="1.6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`);
  defs.push(`<radialGradient id="${uid}wax" cx="0.5" cy="0.45" r="0.75"><stop offset="0" stop-color="#30353b"/><stop offset="1" stop-color="#191c20"/></radialGradient>`);
  defs.push(`<linearGradient id="${uid}al" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#dfe4e8"/><stop offset="1" stop-color="#9aa3ab"/></linearGradient>`);

  const pathOf = (pts, closed) => pts.map((p, i) => `${i ? 'L' : 'M'}${fmt(X(p[0]))} ${fmt(Y(p[1]))}`).join('') + (closed ? 'Z' : '');

  // Một phần tử hình học thành SVG
  function prim(p, dark = false) {
    if (p.only === '3d') return '';
    const c0 = p.c ?? '#999999';
    const c = dark ? shade(c0, 0.5) : c0;
    const op = p.op != null ? ` opacity="${p.op}"` : '';
    if (p.t === 'blob') {
      const Sm = smooth(p.pts, { closed: true, n: 6 });
      const d = pathOf(Sm, true);
      const out = [`<path d="${d}" fill="${p.flatFill ? c : grad(c)}" stroke="${p.edge ?? shade(c, 0.5)}" stroke-width="${p.sw ?? 0.7}" stroke-opacity="0.85"/>`];
      if (p.tex) out.push(`<path d="${d}" fill="url(#${uid}${p.tex})" opacity="${p.texOp ?? 0.55}"/>`);
      if (p.gloss) {
        const b = bounds(Sm);
        const id = `${uid}c${clipN++}`;
        defs.push(`<clipPath id="${id}"><path d="${d}"/></clipPath>`);
        out.push(`<ellipse clip-path="url(#${id})" cx="${fmt(X(b.x0 + b.w * 0.36))}" cy="${fmt(Y(b.y0 + b.h * 0.3))}" rx="${fmt(b.w * s * 0.22)}" ry="${fmt(b.h * s * k * 0.13)}" fill="#fff" opacity="${(0.12 + 0.3 * p.gloss).toFixed(2)}" filter="url(#${uid}bl)"/>`);
      }
      return `<g${op}>${out.join('')}</g>`;
    }
    if (p.t === 'tube') return `<g${op}>${tubeSvg(p, c)}</g>`;
    if (p.t === 'strands') {
      const w = Math.max(0.45, 2 * p.r * s);
      return `<g${op} fill="none" stroke-linecap="round">${p.lines.map((L) => { const d = pathOf(smooth(L, { n: 5 }), false); return `<path d="${d}" stroke="${shade(c, 0.6)}" stroke-width="${fmt(w + 0.6)}"/><path d="${d}" stroke="${c}" stroke-width="${fmt(w)}"/>`; }).join('')}</g>`;
    }
    if (p.t === 'dots') return `<g${op}>${p.pts.map(([x, y, r]) => `<circle cx="${fmt(X(x))}" cy="${fmt(Y(y))}" r="${fmt(Math.max(0.5, r * s))}" fill="${p.flatFill ? c : grad(c)}" stroke="${p.edge ?? shade(c, 0.5)}" stroke-width="${p.sw ?? 0.4}"/>`).join('')}</g>`;
    if (p.t === 'text') return `<text x="${fmt(X(p.at[0]))}" y="${fmt(Y(p.at[1]))}" font-size="${p.size ?? 8}" text-anchor="middle" fill="${c}">${esc(p.s)}</text>`;
    if (p.t === 'line') return `<path${op} d="${pathOf(p.smooth === false ? p.pts : smooth(p.pts, { n: 5 }), false)}" fill="none" stroke="${c}" stroke-width="${fmt(Math.max(0.35, p.w * s))}" stroke-linecap="round" stroke-linejoin="round"${p.dash ? ` stroke-dasharray="${p.dash}"` : ''}/>`;
    return '';
  }

  // Ống: vẽ từng đoạn ngắn (viền, thân, ánh sáng) theo thứ tự để quai sau đè lên quai trước có mép rõ
  function tubeSvg(p, c) {
    const Sm = smooth(p.pts, { n: 6 });
    const R = radii(p.r, p.pts.length, Sm.length).map((r) => r * s);
    const N = normals(Sm);
    const off = (i, fr) => { const n = N[i]; const sg = n[0] * LIGHT[0] + n[1] * LIGHT[1] * k > 0 ? 1 : -1; return [X(Sm[i][0]) + n[0] * sg * R[i] * fr, Y(Sm[i][1]) + n[1] * sg * R[i] * fr * Math.min(1, k)]; };
    const edge = shade(c, 0.5);
    const hi = lighten(c, 0.42);
    const step = p.chunk ?? 4;
    const out = [];
    const ring = p.rings ? (() => { const w = Math.max(0.6, p.rings * s); return `${fmt(w * 0.45)} ${fmt(w * 0.55)}`; })() : null;
    for (let a = 0; a < Sm.length - 1; a += step) {
      const b = Math.min(Sm.length - 1, a + step + 1);
      const idx = Array.from({ length: b - a + 1 }, (_, i) => a + i);
      const r = idx.reduce((t, i) => t + R[i], 0) / idx.length;
      const d = idx.map((i, j) => `${j ? 'L' : 'M'}${fmt(X(Sm[i][0]))} ${fmt(Y(Sm[i][1]))}`).join('');
      const cap = a === 0 || b === Sm.length - 1 ? 'round' : 'butt';
      out.push(`<path d="${d}" stroke="${p.edge ?? edge}" stroke-width="${fmt(2 * r + 1.1)}" stroke-linecap="${cap}"/>`);
      // Thân và ánh sáng lùi thêm một điểm để che mép khử răng cưa của viền ở chỗ nối hai đoạn
      if (a > 0) idx.unshift(a - 1);
      const df = idx.map((i, j) => `${j ? 'L' : 'M'}${fmt(X(Sm[i][0]))} ${fmt(Y(Sm[i][1]))}`).join('');
      out.push(`<path d="${df}" stroke="${c}" stroke-width="${fmt(2 * r)}" stroke-linecap="${cap}"/>`);
      if (ring) out.push(`<path d="${df}" stroke="${shade(c, 0.72)}" stroke-width="${fmt(2 * r * 0.92)}" stroke-dasharray="${ring}" stroke-linecap="butt" opacity="0.55"/>`);
      if (p.tex) out.push(`<path d="${df}" stroke="url(#${uid}${p.tex})" stroke-width="${fmt(2 * r)}" stroke-linecap="${cap}" opacity="${p.texOp ?? 0.6}"/>`);
      if (r > 0.9) {
        const h = idx.map((i, j) => { const q = off(i, 0.42); return `${j ? 'L' : 'M'}${fmt(q[0])} ${fmt(q[1])}`; }).join('');
        out.push(`<path d="${h}" stroke="${hi}" stroke-width="${fmt(r * 0.55)}" stroke-linecap="round" opacity="${p.gloss != null ? 0.35 + 0.4 * p.gloss : 0.55}"/>`);
      }
    }
    return `<g fill="none" stroke-linejoin="round">${out.join('')}</g>`;
  }

  // Viền nổi của cơ quan đang chọn
  function outlineOf(parts) {
    return parts.filter((p) => p.only !== '3d' && p.t !== 'text').map((p) => {
      const pts = p.t === 'blob' ? smooth(p.pts, { closed: true, n: 5 }) : p.t === 'tube' ? tubeOutline(p.pts, p.r, 5) : null;
      if (pts) return `<path d="${pathOf(pts, true)}"/>`;
      if (p.t === 'dots') return p.pts.length > 6 ? '' : p.pts.map(([x, y, r]) => `<circle cx="${fmt(X(x))}" cy="${fmt(Y(y))}" r="${fmt(r * s + 1.5)}"/>`).join('');
      if (p.t === 'strands') return p.lines.length > 6 ? '' : p.lines.map((L) => `<path d="${pathOf(L, false)}"/>`).join('');
      return `<path d="${pathOf(p.pts, false)}"/>`;
    }).join('');
  }

  const out = [];
  // Khay: vành nhôm, đáy sáp đen, lỗ ghim cũ trên sáp
  out.push(`<rect x="0.5" y="0.5" width="${width - 1}" height="${fmt(height - 1)}" rx="9" fill="url(#${uid}al)" stroke="#7d868e"/>`);
  out.push(`<rect x="${rim}" y="${rim}" width="${width - 2 * rim}" height="${fmt(height - 2 * rim)}" rx="5" fill="url(#${uid}wax)"/>`);
  const R0 = rng(11);
  for (let i = 0; i < 26; i++) out.push(`<circle cx="${fmt(rim + 4 + R0() * (width - 2 * rim - 8))}" cy="${fmt(rim + 4 + R0() * (height - 2 * rim - 8))}" r="${fmt(0.5 + R0() * 0.6)}" fill="#0d0f11" opacity="0.7"/>`);

  const place = f.place === S.place || !f.place ? 'up' : 'down';
  if (!f.open) {
    out.push(`<g filter="url(#${uid}sh)">${art.closed(place).map((p) => prim(p)).join('')}</g>`);
  } else {
    const o = art.opened;
    out.push(`<g filter="url(#${uid}sh)">${o.body.map((p) => prim(p)).join('')}</g>`);
    out.push(`<g filter="url(#${uid}sh)">${o.flaps.map((p) => prim(p)).join('')}</g>`);
    out.push(o.cavity.map((p) => prim(p)).join(''));
    if (f.removed && o.deep) out.push(o.deep.map((p) => prim(p)).join(''));
  }
  if (art.decor) out.push(art.decor.map((p) => prim(p)).join(''));

  // Cơ quan theo thứ tự trong hình (sâu trước, nông sau); mở một phần thì cắt bỏ nửa sát lưng
  const halfClip = f.open === 'partial' ? (() => { const id = `${uid}half`; defs.push(`<clipPath id="${id}"><rect x="0" y="${fmt(Y(art.partialY ?? 0))}" width="${width}" height="${fmt(height)}"/></clipPath>`); return ` clip-path="url(#${id})"`; })() : '';
  for (const v of visible) {
    const dmg = f.damaged.includes(v.id);
    const nm = v.o.sexed ? (f.male ? 'Tinh hoàn' : 'Buồng trứng') : v.o.name;
    out.push(`<g filter="url(#${uid}sh)"${v.o.layer > 0 ? halfClip : ''}><title>${esc(nm)}</title>${v.parts.map((p) => prim(p, dmg)).join('')}${dmg && v.a ? tear(v.a) : ''}</g>`);
  }
  // Mở một phần: nửa sát lưng của khoang vẫn bị thành cơ thể che
  if (f.open === 'partial' && art.partialCover && art.opened.cavity[0]) {
    const id = `${uid}top`;
    defs.push(`<clipPath id="${id}"><rect x="0" y="0" width="${width}" height="${fmt(Y(art.partialY ?? 0))}"/></clipPath>`);
    out.push(`<g clip-path="url(#${id})" filter="url(#${uid}sh)">${prim({ ...art.opened.cavity[0], c: art.partialCover.c, tex: art.partialCover.tex, texOp: 1, gloss: 0.5 })}</g>`);
  }
  function tear(a) {
    const [ax, ay] = P(a);
    return `<path d="M${fmt(ax - 6)} ${fmt(ay - 1)}l3 2.5l2 -3.5l3 3.5l2.5 -2.5" fill="none" stroke="#1b0d0d" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>`;
  }
  // Đường cắt trước khi phanh
  if (f.cut && !f.open && art.cut) {
    const d = pathOf(smooth(art.cut(f.cut.line), { n: 6 }), false);
    out.push(`<path d="${d}" fill="none" stroke="#3d0b0e" stroke-width="${f.cut.depth === 'deep' ? 2.6 : 1.5}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#b9443f" stroke-width="0.6" stroke-linecap="round"/>`);
  }
  // Đinh ghim cắm nghiêng ra ngoài
  const pinPts = (f.pins >= 4 ? art.pins[4] : f.pins >= 2 ? art.pins[2] : null) ?? [];
  const fc = [(fx0 + fx1) / 2, axis];
  pinPts.forEach((p, i) => {
    const [px, py] = P(p);
    const dx = Math.sign(p[0] - fc[0]) || 1, dy = Math.sign(p[1] - fc[1]) || 1;
    const col = ['#e2574c', '#f2b134', '#4f8fd6', '#e2574c'][i % 4];
    out.push(`<g><line x1="${fmt(px)}" y1="${fmt(py)}" x2="${fmt(px + dx * 7)}" y2="${fmt(py + dy * 5)}" stroke="#000" stroke-opacity="0.45" stroke-width="2"/><line x1="${fmt(px)}" y1="${fmt(py)}" x2="${fmt(px + dx * 6)}" y2="${fmt(py + dy * 4)}" stroke="#d4dade" stroke-width="1"/><circle cx="${fmt(px + dx * 6)}" cy="${fmt(py + dy * 4)}" r="3.3" fill="${col}" stroke="${shade(col, 0.55)}" stroke-width="0.6"/><circle cx="${fmt(px + dx * 5.2)}" cy="${fmt(py + dy * 3.1)}" r="1" fill="#fff" opacity="0.7"/></g>`);
  });
  // Nước ngập mẫu
  if (f.water) {
    out.push(`<rect x="${rim}" y="${rim}" width="${width - 2 * rim}" height="${fmt(height - 2 * rim)}" rx="5" fill="#8cc3e0" opacity="0.13"/>`);
    for (let i = 0; i < 3; i++) out.push(`<path d="M${fmt(rim + 20 + i * 110)} ${fmt(rim + 4 + bandTop + i * 9)}q22 -5 44 0" fill="none" stroke="#fff" stroke-opacity="0.22" stroke-width="1.2" stroke-linecap="round"/>`);
  }
  // Dịch tràn ra che nội quan
  if (f.obscured && f.open && art.spill) {
    const sp = art.spill;
    const R = rng(5);
    const pts = Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * Math.PI * 2; const r = 0.75 + R() * 0.45; return [sp.at[0] + Math.cos(a) * sp.r[0] * r, sp.at[1] + Math.sin(a) * sp.r[1] * r]; });
    out.push(`<g opacity="0.8">${prim({ t: 'blob', pts, c: sp.c, tex: 'gran', gloss: 0.6 })}</g>`);
  }
  // Viền cơ quan đang chọn
  const hv = visible.find((v) => v.id === highlight);
  if (hv) out.push(`<g fill="none" stroke="#ffd84d" stroke-width="1.8" filter="url(#${uid}gl)">${outlineOf(hv.parts)}</g>`);

  // Số chú thích và đường dẫn
  for (const [key, list] of Object.entries(side)) {
    list.sort((a, b) => a.a[0] - b.a[0]);
    const nrow = rowsOf(list);
    const lo = rim + 10, hi = width - rim - 10;
    const g = nrow === 2 ? GAP / 2 : GAP;
    const xs = list.map((v) => Math.min(hi, Math.max(lo, X(v.a[0]))));
    for (let i = 1; i < xs.length; i++) xs[i] = Math.max(xs[i], xs[i - 1] + g);
    for (let i = xs.length - 1; i >= 0; i--) xs[i] = Math.min(xs[i], i === xs.length - 1 ? hi : xs[i + 1] - g);
    for (let i = 0; i < xs.length; i++) xs[i] = Math.max(xs[i], i ? xs[i - 1] + g : lo);
    list.forEach((v, i) => {
      const r = nrow === 2 ? i % 2 : 0;
      const ly = key === 'top' ? rim + 11 + r * ROW : height - rim - 11 - r * ROW;
      const lx = xs[i];
      const [ax, ay] = P(v.a);
      const ty = key === 'top' ? ly + 6.5 : ly - 6.5;
      const st = f.damaged.includes(v.id) ? 'dmg' : f.seen.includes(v.id) ? 'seen' : '';
      const fill = st === 'dmg' ? '#c0392b' : st === 'seen' ? '#2f9e62' : '#f4f1ea';
      out.push(`<line x1="${fmt(ax)}" y1="${fmt(ay)}" x2="${fmt(lx)}" y2="${fmt(ty)}" stroke="#000" stroke-opacity="0.5" stroke-width="2.2"/><line x1="${fmt(ax)}" y1="${fmt(ay)}" x2="${fmt(lx)}" y2="${fmt(ty)}" stroke="#f4f1ea" stroke-opacity="0.85" stroke-width="0.8"/><circle cx="${fmt(ax)}" cy="${fmt(ay)}" r="1.5" fill="#f4f1ea" stroke="#000" stroke-width="0.5"/>`);
      out.push(`<circle cx="${fmt(lx)}" cy="${fmt(ly)}" r="6.6" fill="${fill}" stroke="#000" stroke-opacity="0.5" stroke-width="0.8"/><text x="${fmt(lx)}" y="${fmt(ly + 3)}" font-size="8.5" font-weight="700" text-anchor="middle" fill="${st ? '#fff' : '#1d2329'}">${num.get(v.id)}</text>`);
    });
  }

  const name = (o) => (o.sexed ? (f.male ? 'Tinh hoàn' : 'Buồng trứng') : o.name);
  const legend = S.required.map((id, i) => {
    const o = byId.get(id);
    const st = f.damaged.includes(id) ? ' (hỏng)' : f.seen.includes(id) ? ' ✓' : '';
    return `<li>${i + 1}. ${esc(name(o))}${st}</li>`;
  }).join('');
  const title = `${S.name}${f.open ? ', đã mở khoang cơ thể' : ''}`;
  const caption = `Hình vẽ theo cấu tạo điển hình của loài, đầu ở bên trái${art.note ? `; ${art.note}` : ''}. Số xanh: đã quan sát; số đỏ: bị hỏng.`;
  return `<figure class="dissect-fig"><svg viewBox="0 0 ${width} ${fmt(height)}" width="100%" role="img" aria-label="${esc(title)}"><defs>${defs.join('')}</defs>${out.join('')}</svg><figcaption>${esc(caption)}</figcaption><ul class="dissect-legend">${legend}</ul></figure>`;
}

// Kết cấu bề mặt dùng chung (màu trung tính để hợp với mọi màu nền của cơ quan)
function patterns(u) {
  return [
    `<pattern id="${u}alv" width="4.2" height="3.6" patternUnits="userSpaceOnUse"><circle cx="2.1" cy="1.8" r="1.35" fill="none" stroke="#5a1f22" stroke-opacity="0.35" stroke-width="0.5"/><circle cx="0" cy="0" r="1.35" fill="none" stroke="#5a1f22" stroke-opacity="0.35" stroke-width="0.5"/></pattern>`,
    `<pattern id="${u}gran" width="3" height="3" patternUnits="userSpaceOnUse"><circle cx="0.8" cy="0.9" r="0.55" fill="#000" fill-opacity="0.22"/><circle cx="2.3" cy="2.2" r="0.45" fill="#fff" fill-opacity="0.25"/></pattern>`,
    `<pattern id="${u}lob" width="5" height="4.4" patternUnits="userSpaceOnUse"><path d="M0 2.2L1.25 0H3.75L5 2.2L3.75 4.4H1.25Z" fill="none" stroke="#000" stroke-opacity="0.2" stroke-width="0.45"/></pattern>`,
    `<pattern id="${u}str" width="2.2" height="2.2" patternUnits="userSpaceOnUse" patternTransform="rotate(80)"><line x1="0" y1="0" x2="0" y2="2.2" stroke="#000" stroke-opacity="0.16" stroke-width="0.6"/></pattern>`,
    `<pattern id="${u}strx" width="2.2" height="2.2" patternUnits="userSpaceOnUse"><line x1="0" y1="0" x2="0" y2="2.2" stroke="#000" stroke-opacity="0.16" stroke-width="0.6"/></pattern>`,
    `<pattern id="${u}fur" width="5" height="4" patternUnits="userSpaceOnUse"><path d="M0.5 3.5l1.6 -2.4M2.8 3.8l1.6 -2.6" stroke="#8d857c" stroke-opacity="0.35" stroke-width="0.45" stroke-linecap="round"/></pattern>`,
    `<pattern id="${u}scale" width="6" height="5" patternUnits="userSpaceOnUse"><path d="M0 5a3 3 0 0 1 6 0M-3 2.5a3 3 0 0 1 6 0M3 2.5a3 3 0 0 1 6 0" fill="none" stroke="#3b2f12" stroke-opacity="0.32" stroke-width="0.55"/></pattern>`,
    `<pattern id="${u}chl" width="2.6" height="2.6" patternUnits="userSpaceOnUse"><circle cx="1.3" cy="1.3" r="0.7" fill="#e3b23c" fill-opacity="0.75"/></pattern>`,
    `<pattern id="${u}myo" width="7" height="6" patternUnits="userSpaceOnUse"><path d="M1 0l3 3l-3 3" fill="none" stroke="#fff" stroke-opacity="0.35" stroke-width="0.6"/></pattern>`,
    `<pattern id="${u}eggs" width="3.4" height="3.2" patternUnits="userSpaceOnUse"><circle cx="1.2" cy="1.2" r="1" fill="#f6f0e1" stroke="#7e6d50" stroke-opacity="0.5" stroke-width="0.3"/><circle cx="2.9" cy="2.7" r="0.9" fill="#efe6d1" stroke="#7e6d50" stroke-opacity="0.5" stroke-width="0.3"/></pattern>`,
    `<pattern id="${u}frogegg" width="5" height="4.6" patternUnits="userSpaceOnUse"><circle cx="1.7" cy="1.7" r="1.6" fill="#1b1a19"/><path d="M0.1 1.9a1.6 1.6 0 0 0 3.2 0Z" fill="#e9e1cc"/><circle cx="4.2" cy="3.9" r="1.5" fill="#1b1a19"/><path d="M2.7 4.1a1.5 1.5 0 0 0 3 0Z" fill="#e9e1cc"/></pattern>`,
    `<pattern id="${u}fat" width="4" height="4" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.6" fill="#fff" fill-opacity="0.25" stroke="#8a6d1d" stroke-opacity="0.25" stroke-width="0.35"/></pattern>`,
    `<pattern id="${u}chit" width="5" height="5" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r="0.4" fill="#000" fill-opacity="0.18"/><circle cx="4" cy="3.6" r="0.35" fill="#fff" fill-opacity="0.18"/></pattern>`,
  ].join('');
}
