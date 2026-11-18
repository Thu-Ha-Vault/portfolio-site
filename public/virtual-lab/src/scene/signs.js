import * as THREE from 'three';

// Biển báo vẽ bằng canvas (giai đoạn 7): biển chữ, biển lối thoát, biển cấm, biển bắt buộc, biển cảnh báo, biển nguy
// hiểm sinh học, biển sơ cứu, hình đồ cảnh báo GHS, sơ đồ thoát hiểm. Màu theo nhóm biển an toàn ISO 7010 (cấm đỏ,
// bắt buộc xanh dương, cảnh báo vàng, an toàn xanh lá); hình đồ GHS vẽ đơn giản theo mẫu của Liên Hợp Quốc (viền đỏ hình
// thoi, hình đen trên nền trắng). Không có chữ tên hãng.

const FONT = '"Be Vietnam Pro", system-ui, sans-serif';
const RED = '#c8202e';
const BLUE = '#1f5fae';
const YELLOW = '#f2c21a';
const GREEN = '#1f8a4c';

function canvas(w, h) {
  const c = document.createElement('canvas');
  c.width = Math.round(w);
  c.height = Math.round(h);
  return [c, c.getContext('2d')];
}

export function planeOf(c, w, h) {
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: tex, toneMapped: false, transparent: true }));
  m.userData.noShadow = true;
  return m;
}

// Viết chữ vừa khung, tự xuống dòng; trả về chiều cao đã dùng
function fitText(ctx, text, x, y, w, h, { color = '#1d2731', weight = 600, align = 'center', max = h } = {}) {
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  let size = Math.min(max, h);
  let lines;
  for (; size > 8; size -= 2) {
    ctx.font = `${weight} ${size}px ${FONT}`;
    lines = [];
    let cur = '';
    for (const word of text.split(' ')) {
      const t = cur ? `${cur} ${word}` : word;
      if (ctx.measureText(t).width > w && cur) { lines.push(cur); cur = word; } else cur = t;
    }
    lines.push(cur);
    if (lines.length * size * 1.18 <= h && lines.every((l) => ctx.measureText(l).width <= w)) break;
  }
  const lh = size * 1.18;
  const top = y + (h - lines.length * lh) / 2 + lh / 2;
  lines.forEach((l, i) => ctx.fillText(l, align === 'center' ? x + w / 2 : x, top + i * lh));
}

// Biển chữ một dòng (biển cửa, biển lối thoát)
export function textSign(text, { w = 1.1, h = 0.22, bg = '#f4f6f8', fg = '#1d2731', exit = false } = {}) {
  const px = 256;
  const [c, ctx] = canvas(w * px, h * px);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, c.width, c.height);
  // Biển lối thoát: mũi tên trắng bên phải
  const right = exit ? c.height * 1.1 : 0;
  if (exit) arrow(ctx, c.width - right + c.height * 0.15, c.height / 2, c.width - c.height * 0.2, c.height / 2, fg);
  fitText(ctx, text, c.width * 0.04, 0, c.width * 0.92 - right, c.height, { color: fg, max: c.height * 0.5 });
  return planeOf(c, w, h);
}

// ---- Ký hiệu trong biển ----
function cup(ctx, cx, cy, s, color) {
  ctx.fillStyle = color;
  ctx.fillRect(cx - s * 0.32, cy - s * 0.3, s * 0.46, s * 0.62);
  ctx.lineWidth = s * 0.09;
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.arc(cx + s * 0.18, cy, s * 0.16, -Math.PI / 2, Math.PI / 2);
  ctx.stroke();
}
function goggles(ctx, cx, cy, s, color) {
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.lineWidth = s * 0.08;
  for (const k of [-1, 1]) { ctx.beginPath(); ctx.ellipse(cx + k * s * 0.25, cy, s * 0.21, s * 0.17, 0, 0, Math.PI * 2); ctx.fill(); }
  ctx.beginPath();
  ctx.moveTo(cx - s * 0.5, cy - s * 0.04);
  ctx.lineTo(cx + s * 0.5, cy - s * 0.04);
  ctx.stroke();
}
function biohazard(ctx, cx, cy, s, color) {
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = s * 0.07;
  for (let i = 0; i < 3; i++) {
    const a = -Math.PI / 2 + (i * Math.PI * 2) / 3;
    ctx.beginPath();
    ctx.arc(cx + Math.cos(a) * s * 0.2, cy + Math.sin(a) * s * 0.2, s * 0.22, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.arc(cx, cy, s * 0.1, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx, cy, s * 0.3, 0, Math.PI * 2);
  ctx.stroke();
}
function flame(ctx, cx, cy, s, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(cx, cy - s * 0.5);
  ctx.bezierCurveTo(cx + s * 0.1, cy - s * 0.25, cx + s * 0.36, cy - s * 0.1, cx + s * 0.3, cy + s * 0.2);
  ctx.bezierCurveTo(cx + s * 0.26, cy + s * 0.42, cx - s * 0.26, cy + s * 0.42, cx - s * 0.3, cy + s * 0.2);
  ctx.bezierCurveTo(cx - s * 0.34, cy, cx - s * 0.16, cy - s * 0.12, cx - s * 0.12, cy - s * 0.28);
  ctx.bezierCurveTo(cx - s * 0.04, cy - s * 0.18, cx - s * 0.02, cy - s * 0.32, cx, cy - s * 0.5);
  ctx.fill();
  ctx.fillRect(cx - s * 0.42, cy + s * 0.4, s * 0.84, s * 0.07);
}
const GHS_DRAW = {
  GHS02: (ctx, cx, cy, s) => flame(ctx, cx, cy - s * 0.04, s * 0.9, '#000'),
  GHS03: (ctx, cx, cy, s) => {
    flame(ctx, cx, cy - s * 0.18, s * 0.62, '#000');
    ctx.strokeStyle = '#000';
    ctx.lineWidth = s * 0.07;
    ctx.beginPath();
    ctx.arc(cx, cy + s * 0.16, s * 0.2, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillRect(cx - s * 0.4, cy + s * 0.42, s * 0.8, s * 0.06);
  },
  GHS05: (ctx, cx, cy, s) => {
    ctx.fillStyle = '#000';
    // Hai ống nghiệm nghiêng nhỏ giọt xuống bàn tay và thanh kim loại
    for (const [x, a] of [[-0.22, -0.5], [0.2, 0.5]]) {
      ctx.save();
      ctx.translate(cx + x * s, cy - s * 0.3);
      ctx.rotate(a);
      ctx.fillRect(-s * 0.06, -s * 0.16, s * 0.12, s * 0.3);
      ctx.restore();
    }
    for (const x of [-0.12, 0.1]) { ctx.beginPath(); ctx.arc(cx + x * s, cy - s * 0.02, s * 0.035, 0, Math.PI * 2); ctx.fill(); }
    ctx.fillRect(cx - s * 0.42, cy + s * 0.14, s * 0.32, s * 0.08);
    ctx.beginPath();
    ctx.ellipse(cx + s * 0.22, cy + s * 0.2, s * 0.2, s * 0.08, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(cx - s * 0.45, cy + s * 0.36, s * 0.9, s * 0.08);
  },
  GHS06: (ctx, cx, cy, s) => {
    ctx.fillStyle = '#000';
    ctx.strokeStyle = '#000';
    ctx.lineWidth = s * 0.09;
    ctx.lineCap = 'round';
    for (const k of [-1, 1]) { ctx.beginPath(); ctx.moveTo(cx - s * 0.36, cy + s * 0.12 * k + s * 0.2); ctx.lineTo(cx + s * 0.36, cy - s * 0.12 * k + s * 0.2); ctx.stroke(); }
    ctx.beginPath();
    ctx.arc(cx, cy - s * 0.16, s * 0.22, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(cx - s * 0.12, cy - s * 0.02, s * 0.24, s * 0.12);
    ctx.fillStyle = '#fff';
    for (const k of [-1, 1]) { ctx.beginPath(); ctx.arc(cx + k * s * 0.08, cy - s * 0.18, s * 0.055, 0, Math.PI * 2); ctx.fill(); }
  },
  GHS07: (ctx, cx, cy, s) => {
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.moveTo(cx - s * 0.08, cy - s * 0.42);
    ctx.lineTo(cx + s * 0.08, cy - s * 0.42);
    ctx.lineTo(cx + s * 0.04, cy + s * 0.14);
    ctx.lineTo(cx - s * 0.04, cy + s * 0.14);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx, cy + s * 0.3, s * 0.07, 0, Math.PI * 2);
    ctx.fill();
  },
  GHS08: (ctx, cx, cy, s) => {
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(cx, cy - s * 0.3, s * 0.12, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(cx - s * 0.24, cy - s * 0.16, s * 0.48, s * 0.56);
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    for (let i = 0; i < 16; i++) {
      const r = (i % 2 ? 0.06 : 0.16) * s;
      const a = (i / 16) * Math.PI * 2;
      ctx.lineTo(cx + Math.cos(a) * r, cy + s * 0.08 + Math.sin(a) * r);
    }
    ctx.fill();
  },
  GHS09: (ctx, cx, cy, s) => {
    ctx.fillStyle = '#000';
    ctx.fillRect(cx - s * 0.26, cy - s * 0.2, s * 0.05, s * 0.4);
    ctx.beginPath();
    ctx.moveTo(cx - s * 0.24, cy - s * 0.4);
    ctx.lineTo(cx - s * 0.4, cy - s * 0.06);
    ctx.lineTo(cx - s * 0.08, cy - s * 0.06);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(cx + s * 0.14, cy + s * 0.28, s * 0.18, s * 0.07, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(cx + s * 0.3, cy + s * 0.28);
    ctx.lineTo(cx + s * 0.42, cy + s * 0.2);
    ctx.lineTo(cx + s * 0.42, cy + s * 0.36);
    ctx.fill();
    ctx.fillRect(cx - s * 0.44, cy + s * 0.4, s * 0.88, s * 0.05);
  },
};

// Hình đồ GHS: viền đỏ hình thoi, nền trắng, hình đen. Trả về canvas vuông (dùng chung cho nhãn chai ở đồ vật)
export function ghsCanvas(code, px = 256) {
  const [c, ctx] = canvas(px, px);
  const m = px / 2;
  ctx.fillStyle = '#fff';
  ctx.strokeStyle = RED;
  ctx.lineWidth = px * 0.07;
  ctx.lineJoin = 'miter';
  ctx.beginPath();
  ctx.moveTo(m, px * 0.05);
  ctx.lineTo(px * 0.95, m);
  ctx.lineTo(m, px * 0.95);
  ctx.lineTo(px * 0.05, m);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  (GHS_DRAW[code] ?? GHS_DRAW.GHS07)(ctx, m, m, px * 0.5);
  return c;
}

// Biển an toàn có ký hiệu bên trái và chữ bên phải. style: prohibit, mandatory, warn, bio, firstaid, ghs, info
export function safetySign(text, { style = 'info', w = 0.9, ghs } = {}) {
  const h = style === 'ghs' ? w * 1.28 : w * 0.42;
  const px = 512 / w;
  const [c, ctx] = canvas(w * px, h * px);
  const W = c.width;
  const H = c.height;
  const bg = style === 'warn' || style === 'bio' ? YELLOW : style === 'firstaid' ? GREEN : '#fbfbf8';
  const fg = style === 'firstaid' ? '#fff' : '#1a1a1a';
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = '#1a1a1a';
  ctx.lineWidth = 3;
  ctx.strokeRect(1.5, 1.5, W - 3, H - 3);
  if (style === 'ghs') {
    const s = Math.min(W, H * 0.78);
    ctx.drawImage(ghsCanvas(ghs, 256), (W - s) / 2, H * 0.02, s, s);
    fitText(ctx, text, W * 0.05, H * 0.8, W * 0.9, H * 0.18, { color: fg });
    return planeOf(c, w, h);
  }
  const s = H * 0.78;
  const cx = H / 2;
  const cy = H / 2;
  if (style === 'prohibit') {
    cup(ctx, cx, cy, s * 0.6, '#1a1a1a');
    ctx.strokeStyle = RED;
    ctx.lineWidth = s * 0.11;
    ctx.beginPath();
    ctx.arc(cx, cy, s * 0.42, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx - s * 0.3, cy - s * 0.3);
    ctx.lineTo(cx + s * 0.3, cy + s * 0.3);
    ctx.stroke();
  } else if (style === 'mandatory') {
    ctx.fillStyle = BLUE;
    ctx.beginPath();
    ctx.arc(cx, cy, s * 0.46, 0, Math.PI * 2);
    ctx.fill();
    goggles(ctx, cx, cy, s * 0.62, '#fff');
  } else if (style === 'warn' || style === 'bio') {
    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath();
    ctx.moveTo(cx, cy - s * 0.46);
    ctx.lineTo(cx + s * 0.5, cy + s * 0.4);
    ctx.lineTo(cx - s * 0.5, cy + s * 0.4);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = YELLOW;
    ctx.beginPath();
    ctx.moveTo(cx, cy - s * 0.3);
    ctx.lineTo(cx + s * 0.37, cy + s * 0.32);
    ctx.lineTo(cx - s * 0.37, cy + s * 0.32);
    ctx.closePath();
    ctx.fill();
    if (style === 'bio') biohazard(ctx, cx, cy + s * 0.08, s * 0.42, '#1a1a1a');
    else GHS_DRAW.GHS07(ctx, cx, cy + s * 0.06, s * 0.5);
  } else if (style === 'firstaid') {
    ctx.fillStyle = '#fff';
    ctx.fillRect(cx - s * 0.12, cy - s * 0.36, s * 0.24, s * 0.72);
    ctx.fillRect(cx - s * 0.36, cy - s * 0.12, s * 0.72, s * 0.24);
  }
  const x0 = style === 'info' ? W * 0.04 : H * 1.02;
  fitText(ctx, text, x0, H * 0.08, W - x0 - W * 0.04, H * 0.84, { color: fg, align: style === 'info' ? 'center' : 'left' });
  return planeOf(c, w, h);
}

// Sơ đồ thoát hiểm vẽ từ dữ liệu toà nhà: phòng, tường, cửa, lối thoát (mũi tên xanh), vòi rửa mắt, bình chữa cháy, tủ
// sơ cứu, chấm đỏ "Bạn đang ở đây"
export function evacSign(building, { here, eyewash = [], extinguishers = [], firstaid = [], w = 0.6 }) {
  const { minX, maxX, minZ, maxZ } = building.bounds;
  const bw = maxX - minX;
  const bd = maxZ - minZ;
  const W = 900;
  const pad = 30;
  const head = 70;
  const k = (W - pad * 2) / bw;
  const H = Math.round(head + bd * k + pad + 110);
  const [c, ctx] = canvas(W, H);
  ctx.fillStyle = '#fbfbf8';
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = GREEN;
  ctx.fillRect(0, 0, W, head - 14);
  fitText(ctx, 'Sơ đồ thoát hiểm', 0, 0, W, head - 14, { color: '#fff', max: 40 });
  const X = (x) => pad + (x - minX) * k;
  const Y = (z) => head + (z - minZ) * k;
  ctx.fillStyle = '#e9edf1';
  for (const r of building.rooms) ctx.fillRect(X(r.box[0]), Y(r.box[2]), (r.box[1] - r.box[0]) * k, (r.box[3] - r.box[2]) * k);
  ctx.fillStyle = '#d5f0df';
  const cor = building.rooms.find((r) => r.id === 'corridor');
  if (cor) ctx.fillRect(X(cor.box[0]), Y(cor.box[2]), (cor.box[1] - cor.box[0]) * k, (cor.box[3] - cor.box[2]) * k);
  ctx.strokeStyle = '#26313b';
  ctx.lineCap = 'butt';
  for (const wl of building.walls) {
    const [ax, az] = wl.a;
    const [bx, bz] = wl.b;
    const len = Math.hypot(bx - ax, bz - az);
    const ux = (bx - ax) / len;
    const uz = (bz - az) / len;
    const alongX = Math.abs(ux) > 0.5;
    const cuts = (wl.open ?? []).filter((o) => o.kind !== 'window').map((o) => { const s = alongX ? (o.at - ax) / ux : (o.at - az) / uz; return [s - o.w / 2, s + o.w / 2, o]; }).sort((p, q) => p[0] - q[0]);
    ctx.lineWidth = wl.ext ? 7 : 4;
    let s = 0;
    for (const [s0, s1, o] of [...cuts, [len, len, null]]) {
      ctx.beginPath();
      ctx.moveTo(X(ax + ux * s), Y(az + uz * s));
      ctx.lineTo(X(ax + ux * s0), Y(az + uz * s0));
      ctx.stroke();
      if (o?.exit) {
        // Mũi tên lối thoát chỉ ra phía ngoài phòng (về phía hành lang hoặc ra ngoài toà nhà)
        const mx = ax + ux * (s0 + s1) / 2;
        const mz = az + uz * (s0 + s1) / 2;
        let nx = -uz, nz = ux;
        const out = (px, pz) => px < minX || px > maxX || pz < minZ || pz > maxZ || (cor && px >= cor.box[0] && px <= cor.box[1] && pz >= cor.box[2] && pz <= cor.box[3]);
        if (!out(mx + nx * 0.5, mz + nz * 0.5)) { nx = -nx; nz = -nz; }
        arrow(ctx, X(mx - nx * 0.9), Y(mz - nz * 0.9), X(mx + nx * 0.9), Y(mz + nz * 0.9), GREEN);
      }
      s = s1;
    }
  }
  const dot = (x, z, color, r = 9) => { ctx.fillStyle = color; ctx.beginPath(); ctx.arc(X(x), Y(z), r, 0, Math.PI * 2); ctx.fill(); };
  for (const e of eyewash) dot(e.x, e.z, '#13a3a3', 8);
  for (const e of extinguishers) dot(e.x, e.z, RED, 8);
  for (const f of firstaid) { ctx.fillStyle = GREEN; ctx.fillRect(X(f.x) - 9, Y(f.z) - 9, 18, 18); ctx.fillStyle = '#fff'; ctx.fillRect(X(f.x) - 2.5, Y(f.z) - 7, 5, 14); ctx.fillRect(X(f.x) - 7, Y(f.z) - 2.5, 14, 5); }
  if (here) {
    dot(here.x, here.z, RED, 15);
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(X(here.x), Y(here.z), 5, 0, Math.PI * 2);
    ctx.fill();
  }
  // Chú giải
  const ly = head + bd * k + 30;
  const items = [['here', 'Bạn đang ở đây'], ['exit', 'Lối thoát'], ['eye', 'Vòi rửa mắt'], ['ext', 'Bình chữa cháy'], ['aid', 'Sơ cứu']];
  items.forEach(([kind, label], i) => {
    const x = pad + (i % 3) * 290;
    const y = ly + Math.floor(i / 3) * 42 + 10;
    if (kind === 'here') { ctx.fillStyle = RED; ctx.beginPath(); ctx.arc(x + 12, y, 12, 0, Math.PI * 2); ctx.fill(); }
    if (kind === 'exit') arrow(ctx, x, y, x + 26, y, GREEN);
    if (kind === 'eye') { ctx.fillStyle = '#13a3a3'; ctx.beginPath(); ctx.arc(x + 12, y, 9, 0, Math.PI * 2); ctx.fill(); }
    if (kind === 'ext') { ctx.fillStyle = RED; ctx.beginPath(); ctx.arc(x + 12, y, 9, 0, Math.PI * 2); ctx.fill(); }
    if (kind === 'aid') { ctx.fillStyle = GREEN; ctx.fillRect(x + 3, y - 9, 18, 18); }
    fitText(ctx, label, x + 34, y - 18, 240, 36, { align: 'left', weight: 500, max: 26 });
  });
  return planeOf(c, w, (w * H) / W);
}

function arrow(ctx, x0, y0, x1, y1, color) {
  const a = Math.atan2(y1 - y0, x1 - x0);
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(x1 - Math.cos(a) * 10, y1 - Math.sin(a) * 10);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x1 - Math.cos(a - 0.5) * 18, y1 - Math.sin(a - 0.5) * 18);
  ctx.lineTo(x1 - Math.cos(a + 0.5) * 18, y1 - Math.sin(a + 0.5) * 18);
  ctx.fill();
}
