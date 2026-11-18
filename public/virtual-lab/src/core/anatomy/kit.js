// Bộ hình học giải phẫu dùng chung cho hình SVG (src/ui/dissect-svg.js) và mẫu 3D trên khay (src/scene/anatomy-mesh.js).
// Không phụ thuộc DOM hay Three.js.
//
// Hệ toạ độ của một mẫu: x dọc thân, 0 ở mút đầu, 1 ở mút đuôi (đúng bằng body.length trong data/dissection.json);
// y ngang thân, cùng đơn vị với x (đẳng hướng), y < 0 ở mép trên của hình (phía xa người mổ, −z trong cảnh 3D),
// y > 0 ở mép dưới (phía người mổ, +z). Chiều cao trên mặt khay h, z cũng tính theo body.length.
//
// Hình gồm các phần tử:
//   blob    vùng kín, điểm điều khiển nối bằng đường cong Catmull-Rom; h: bề dày (3D đùn có vát mép)
//   tube    ống theo đường giữa đi qua các điểm; r: bán kính (một số hoặc mỗi điểm một số); điểm có thể có z (độ cao)
//   strands nhiều sợi mảnh (ống Malpighi, buồng trứng giun đũa, sợi mang)
//   dots    các hạt tròn [x, y, r] (trứng, hạch thần kinh)
//   line    nét mảnh không có bề dày (mạch máu nhỏ, đường khớp); 3D bỏ qua nếu flat2d
// Thuộc tính chung: c màu, tex kết cấu SVG, gloss độ bóng, op độ trong, edge màu viền, z độ cao đáy (3D), only: 'svg' | '3d'.

export const blob = (pts, o = {}) => ({ t: 'blob', pts, ...o });
export const tube = (pts, r, o = {}) => ({ t: 'tube', pts, r, ...o });
export const strands = (lines, r, o = {}) => ({ t: 'strands', lines, r, ...o });
export const dots = (pts, o = {}) => ({ t: 'dots', pts, ...o });
export const line = (pts, w, o = {}) => ({ t: 'line', pts, w, ...o });

// Bộ sinh số ngẫu nhiên có seed (mulberry32) để chi tiết như mạng mao mạch, hạt trứng luôn vẽ giống nhau
export function rng(seed = 1) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Lấy mẫu đường cong Catmull-Rom đều qua các điểm (giữ thêm toạ độ thứ ba nếu có)
export function smooth(pts, { closed = false, n = 8 } = {}) {
  const P = pts.map((p) => [p[0], p[1], p[2] ?? 0]);
  const m = P.length;
  if (m < 3) return P.map((p) => [...p]);
  const at = (i) => (closed ? P[(i + m) % m] : P[Math.max(0, Math.min(m - 1, i))]);
  const out = [];
  const segs = closed ? m : m - 1;
  for (let i = 0; i < segs; i++) {
    const p0 = at(i - 1), p1 = at(i), p2 = at(i + 1), p3 = at(i + 2);
    for (let k = 0; k < n; k++) {
      const t = k / n, t2 = t * t, t3 = t2 * t;
      const f = (a, b, c, d) => 0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
      out.push([f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1]), f(p0[2], p1[2], p2[2], p3[2])]);
    }
  }
  if (!closed) out.push([...P[m - 1]]);
  return out;
}

// Bán kính dọc ống tại từng điểm đã lấy mẫu (nội suy tuyến tính theo chỉ số điểm điều khiển)
export function radii(r, nCtrl, nSamples) {
  if (!Array.isArray(r)) return new Array(nSamples).fill(r);
  return Array.from({ length: nSamples }, (_, i) => {
    const u = (i / Math.max(1, nSamples - 1)) * (nCtrl - 1);
    const k = Math.min(nCtrl - 2, Math.floor(u));
    return r[k] + (r[k + 1] - r[k]) * (u - k);
  });
}

// Pháp tuyến trái của đường gấp khúc (đơn vị)
export function normals(S) {
  return S.map((p, i) => {
    const a = S[Math.max(0, i - 1)];
    const b = S[Math.min(S.length - 1, i + 1)];
    const dx = b[0] - a[0], dy = b[1] - a[1];
    const l = Math.hypot(dx, dy) || 1;
    return [-dy / l, dx / l];
  });
}

// Đường viền kín của một ống (để tô, chọn, đùn): hai mép và hai đầu tròn
export function tubeOutline(pts, r, n = 6) {
  const S = smooth(pts, { n });
  const R = radii(r, pts.length, S.length);
  const N = normals(S);
  const left = S.map((p, i) => [p[0] + N[i][0] * R[i], p[1] + N[i][1] * R[i]]);
  const right = S.map((p, i) => [p[0] - N[i][0] * R[i], p[1] - N[i][1] * R[i]]).reverse();
  // Đầu tròn: quay từ mép trái sang mép phải qua phía trước (đầu cuối) hoặc phía sau (đầu đầu)
  const cap = (c, rr, a0) => Array.from({ length: 5 }, (_, k) => { const a = a0 - (Math.PI * (k + 1)) / 6; return [c[0] + Math.cos(a) * rr, c[1] + Math.sin(a) * rr]; });
  const ang = (i, j) => Math.atan2(S[j][1] - S[i][1], S[j][0] - S[i][0]);
  const e = S.length - 1;
  return [...left, ...cap(S[e], R[e], ang(e - 1, e) + Math.PI / 2), ...right, ...cap(S[0], R[0], ang(0, 1) - Math.PI / 2)];
}

// Hình elip làm điểm điều khiển cho blob
export function ellipse(cx, cy, rx, ry, rot = 0, n = 10) {
  const c = Math.cos(rot), s = Math.sin(rot);
  return Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    const x = Math.cos(a) * rx, y = Math.sin(a) * ry;
    return [cx + x * c - y * s, cy + x * s + y * c];
  });
}

// Đối xứng qua trục thân (y → −y), dùng cho cơ quan có đôi
export const mirror = (pts) => pts.map((p) => [p[0], -p[1], ...p.slice(2)]);
export const mirrorPrim = (p) => ({ ...p, pts: p.pts && (p.t === 'dots' ? p.pts.map(([x, y, r]) => [x, -y, r]) : mirror(p.pts)), lines: p.lines && p.lines.map(mirror) });
export const pair = (prims) => [...prims, ...prims.map(mirrorPrim)];

// Dịch, co giãn một dãy điểm
export const move = (pts, dx, dy) => pts.map((p) => [p[0] + dx, p[1] + dy, ...p.slice(2)]);
export const scale = (pts, cx, cy, k, ky = k) => pts.map((p) => [cx + (p[0] - cx) * k, cy + (p[1] - cy) * ky, ...p.slice(2)]);

// Đường xoắn cuộn cho ruột: đi từ a tới b, uốn thành các quai trong vùng rx × ry quanh tâm (cx, cy).
// Mỗi quai cao dần (z tăng) để quai sau nằm đè lên quai trước như khi vẽ.
export function coil(a, b, { cx, cy, rx, ry, loops = 6, seed = 3, z0 = 0, dz = 0 } = {}) {
  const R = rng(seed);
  const pts = [a];
  for (let i = 0; i < loops; i++) {
    const t = (i + 0.5) / loops;
    const ang = t * Math.PI * 2 * 1.6 + R() * 0.8;
    const rr = 0.35 + 0.65 * R();
    pts.push([cx + Math.cos(ang) * rx * rr, cy + Math.sin(ang) * ry * rr, z0 + dz * t]);
    pts.push([cx + Math.cos(ang + 2.4) * rx * (0.5 + 0.5 * R()), cy + Math.sin(ang + 2.4) * ry * (0.5 + 0.5 * R()), z0 + dz * (t + 0.5 / loops)]);
  }
  pts.push(b);
  return pts;
}

// Quai ruột uốn khúc kiểu chữ S trong một hình chữ nhật (hàng ngang), dùng cho ruột non dài xếp lớp
export function meander(x0, x1, y0, y1, rows, { z0 = 0, dz = 0, wobble = 0, seed = 5 } = {}) {
  const R = rng(seed);
  const pts = [];
  for (let k = 0; k < rows; k++) {
    const y = y0 + ((y1 - y0) * k) / Math.max(1, rows - 1);
    const xs = k % 2 ? [x1, (x0 + x1) / 2, x0] : [x0, (x0 + x1) / 2, x1];
    for (const x of xs) pts.push([x + (R() - 0.5) * wobble, y + (R() - 0.5) * wobble, z0 + (dz * k) / Math.max(1, rows - 1)]);
  }
  return pts;
}

// Mạng mạch máu phân nhánh ngẫu nhiên từ một gốc, trả về danh sách nét (mỗi nét là dãy điểm)
export function vessels(root, dir, { len = 0.1, depth = 4, spread = 0.7, seed = 7, shrink = 0.68 } = {}) {
  const R = rng(seed);
  const out = [];
  const grow = (p, a, l, d) => {
    if (d === 0 || l < 0.002) return;
    const segs = 3;
    const pts = [p];
    let q = p;
    let ang = a;
    for (let i = 0; i < segs; i++) {
      ang += (R() - 0.5) * 0.5;
      q = [q[0] + Math.cos(ang) * (l / segs), q[1] + Math.sin(ang) * (l / segs)];
      pts.push(q);
    }
    out.push({ pts, w: d });
    grow(q, ang + spread * (0.5 + R() * 0.5), l * shrink, d - 1);
    grow(q, ang - spread * (0.5 + R() * 0.5), l * shrink, d - 1);
  };
  grow(root, dir, len, depth);
  return out;
}

// Màu: nhân độ sáng, pha với trắng, pha hai màu
const hex2 = (h) => { const s = h.replace('#', ''); const f = s.length === 3 ? s.split('').map((c) => c + c).join('') : s; return [0, 2, 4].map((i) => parseInt(f.slice(i, i + 2), 16)); };
const rgb2 = (c) => `#${c.map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('')}`;
export const shade = (h, k) => rgb2(hex2(h).map((v) => v * k));
export const mix = (a, b, t) => { const A = hex2(a), B = hex2(b); return rgb2(A.map((v, i) => v + (B[i] - v) * t)); };
export const lighten = (h, t) => mix(h, '#ffffff', t);

// Khung bao của các điểm
export function bounds(pts) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const p of pts) { x0 = Math.min(x0, p[0]); y0 = Math.min(y0, p[1]); x1 = Math.max(x1, p[0]); y1 = Math.max(y1, p[1]); }
  return { x0, y0, x1, y1, w: x1 - x0, h: y1 - y0, cx: (x0 + x1) / 2, cy: (y0 + y1) / 2 };
}

// Điểm của một phần tử (để tính khung, tâm nhãn)
export function primPoints(p) {
  if (p.t === 'blob') return smooth(p.pts, { closed: true, n: 4 });
  if (p.t === 'tube') return tubeOutline(p.pts, p.r, 3);
  if (p.t === 'strands') return p.lines.flat();
  if (p.t === 'dots') return p.pts.flatMap(([x, y, r]) => [[x - r, y - r], [x + r, y + r]]);
  return p.pts ?? [];
}
