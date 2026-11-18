import * as THREE from 'three';

// Vân bề mặt sinh bằng mã (không cần file ảnh): mỗi loại vân là một ảnh xám lặp liền mép, 1 là chỗ nổi, 0 là chỗ lõm.
// Vân được chiếu ba mặt theo toạ độ thế giới (triplanar) nên mật độ vân đều trên mọi khối, không phụ thuộc UV; ảnh xám
// vừa làm sắc độ đổi quanh màu gốc (nhân quanh 1, giữ đúng màu ở cả giao diện sáng và tối), vừa làm mặt gồ ghề (lấy
// đạo hàm theo điểm ảnh như bump map của Three.js), vừa đổi độ nhám (chỗ lõm nhám hơn hoặc bóng hơn).
//
// KINDS: size là cạnh một ô lặp (m), albedo là độ đậm của vân lên màu (âm thì chỗ nổi tối hơn), bump là độ gồ ghề,
// rough là mức đổi độ nhám. Vân sinh học (alv, gran, lob, str, strx, fur, scale, chl, myo, eggs, frogegg, fat, chit)
// trùng tên vân của hình SVG (src/ui/dissect-svg.js) để mẫu 3D và hình chú thích giống nhau.

const N = 256;

export const KINDS = {
  // Phòng, đồ đạc, máy
  grain: { size: 0.3, albedo: 0.08, bump: 0.6, rough: 0.06 }, // sơn tĩnh điện, nhựa vỏ máy
  laminate: { size: 0.8, albedo: 0.08, bump: 0.4, rough: 0.05 }, // tấm phủ melamine của tủ
  brushed: { size: 0.35, albedo: 0.09, bump: 0.25, rough: 0.12 }, // thép không gỉ, nhôm xước mờ
  tile: { size: 2.0, albedo: 0.3, bump: 1.2, rough: 0.12 }, // sàn vinyl ô 0,5 m có ron
  speckle: { size: 0.6, albedo: 0.9, bump: 0.3, rough: 0.12 }, // mặt bàn epoxy có hạt
  plaster: { size: 1.6, albedo: 0.08, bump: 1.0, rough: 0.05 }, // tường sơn
  wood: { size: 0.9, albedo: 0.18, bump: 0.35, rough: 0.08 },
  wax: { size: 0.25, albedo: 0.6, bump: 1.2, rough: 0.2 }, // đáy sáp khay mổ, có vết kim
  soil: { size: 0.6, albedo: 0.3, bump: 1.8, rough: 0.05 },
  gravel: { size: 0.8, albedo: 0.3, bump: 1.6, rough: 0.05 },
  rock: { size: 3, albedo: 0.28, bump: 2.2, rough: 0.05 },
  bark: { size: 0.5, albedo: 0.3, bump: 1.6, rough: 0.05 },
  leaf: { size: 1.2, albedo: 0.28, bump: 1.2, rough: 0.08 },
  // Mô, da, vỏ của mẫu giải phẫu (mẫu vẽ to khoảng 1,5 lần thật)
  tissue: { size: 0.045, albedo: 0.22, bump: 1.1, rough: 0.18 }, // mặt nội quan ướt, loang nhẹ
  alv: { size: 0.03, albedo: -0.28, bump: 1.1, rough: 0.12 }, // phế nang
  gran: { size: 0.022, albedo: 0.25, bump: 1.4, rough: 0.12 }, // mô tuyến dạng hạt
  lob: { size: 0.045, albedo: 0.2, bump: 0.8, rough: 0.1 }, // tiểu thuỳ gan
  str: { size: 0.03, albedo: 0.18, bump: 0.9, rough: 0.1 }, // thớ cơ dọc thân
  strx: { size: 0.03, albedo: 0.18, bump: 0.9, rough: 0.1 }, // vân ngang
  fur: { size: 0.03, albedo: 0.2, bump: 1.2, rough: 0.05 },
  scale: { size: 0.05, albedo: 0.22, bump: 1.0, rough: 0.12 }, // vảy cá xếp lợp
  chl: { size: 0.016, albedo: 0.3, bump: 0.9, rough: 0.1 }, // tế bào vàng (chloragogen)
  myo: { size: 0.05, albedo: 0.22, bump: 1.0, rough: 0.08 }, // đốt cơ hình chữ V
  eggs: { size: 0.014, albedo: 0.25, bump: 1.2, rough: 0.12 },
  frogegg: { size: 0.022, albedo: -0.55, bump: 1.0, rough: 0.1 }, // trứng ếch: cực động vật sẫm
  fat: { size: 0.03, albedo: 0.18, bump: 1.0, rough: 0.12 },
  chit: { size: 0.02, albedo: 0.2, bump: 1.0, rough: 0.16 }, // vỏ kitin
  skin: { size: 0.035, albedo: 0.25, bump: 1.4, rough: 0.12 }, // da có lỗ, mụn nhỏ
  shell: { size: 0.03, albedo: 0.3, bump: 0.9, rough: 0.1 }, // vỏ ốc có vân tăng trưởng
};

// ---- Sinh ảnh xám lặp liền mép ----

function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Nhiễu giá trị tuần hoàn: lưới cx × cy nút ngẫu nhiên, nội suy mượt, quấn ở mép
function valueNoise(cx, cy, seed) {
  const R = rng(seed);
  const g = Float32Array.from({ length: cx * cy }, R);
  const out = new Float32Array(N * N);
  const s = (t) => t * t * (3 - 2 * t);
  for (let y = 0; y < N; y++) {
    const fy = (y / N) * cy;
    const y0 = Math.floor(fy), ty = s(fy - y0), y1 = (y0 + 1) % cy;
    for (let x = 0; x < N; x++) {
      const fx = (x / N) * cx;
      const x0 = Math.floor(fx), tx = s(fx - x0), x1 = (x0 + 1) % cx;
      const a = g[y0 * cx + x0] + (g[y0 * cx + x1] - g[y0 * cx + x0]) * tx;
      const b = g[y1 * cx + x0] + (g[y1 * cx + x1] - g[y1 * cx + x0]) * tx;
      out[y * N + x] = a + (b - a) * ty;
    }
  }
  return out;
}

// Nhiễu nhiều tầng; cx, cy là số ô của tầng thấp nhất (cho phép kéo dài theo một chiều: vân xước, thớ gỗ)
function fbm(cx, cy, oct, seed, gain = 0.5) {
  const out = new Float32Array(N * N);
  let amp = 1, sum = 0;
  for (let o = 0; o < oct; o++) {
    const n = valueNoise(cx << o, cy << o, seed + o * 101);
    for (let i = 0; i < out.length; i++) out[i] += n[i] * amp;
    sum += amp;
    amp *= gain;
  }
  for (let i = 0; i < out.length; i++) out[i] /= sum;
  return normalize(out);
}

function normalize(a) {
  let lo = Infinity, hi = -Infinity;
  for (const v of a) { if (v < lo) lo = v; if (v > hi) hi = v; }
  const k = hi > lo ? 1 / (hi - lo) : 0;
  for (let i = 0; i < a.length; i++) a[i] = (a[i] - lo) * k;
  return a;
}

const mixA = (a, b, t) => a.map((v, i) => v * (1 - t) + b[i] * t);

// Vẽ hình bằng canvas 2D, lặp ở 9 vị trí để liền mép; trả về kênh xám 0..1
function draw(paint, bg = 0) {
  const c = document.createElement('canvas');
  c.width = c.height = N;
  const ctx = c.getContext('2d', { willReadFrequently: true });
  ctx.fillStyle = gray(bg);
  ctx.fillRect(0, 0, N, N);
  for (const dx of [-N, 0, N]) for (const dy of [-N, 0, N]) {
    ctx.save();
    ctx.translate(dx, dy);
    paint(ctx);
    ctx.restore();
  }
  const d = ctx.getImageData(0, 0, N, N).data;
  const out = new Float32Array(N * N);
  for (let i = 0; i < out.length; i++) out[i] = d[i * 4] / 255;
  return out;
}
const gray = (v) => { const k = Math.round(Math.max(0, Math.min(1, v)) * 255); return `rgb(${k},${k},${k})`; };

// Hạt tròn nổi có viền mềm: (x, y, r) theo điểm ảnh, đỉnh sáng ở giữa
function bumpDot(ctx, x, y, r, top = 1, base = 0) {
  const g = ctx.createRadialGradient(x - r * 0.25, y - r * 0.25, r * 0.1, x, y, r);
  g.addColorStop(0, gray(top));
  g.addColorStop(1, gray(base));
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

// Ô lưới có lệch ngẫu nhiên (tâm hạt, trứng)
function jitter(n, R, amt = 0.35) {
  const s = N / n;
  const pts = [];
  for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) pts.push([(i + 0.5 + (R() - 0.5) * amt * 2) * s, (j + 0.5 + (R() - 0.5) * amt * 2) * s]);
  return pts;
}

// Vân tế bào (Voronoi): mỗi ô của lưới n × n có một tâm lệch ngẫu nhiên (amt), hàng lẻ lệch nửa ô nếu hex (lưới lục
// giác). Trả về (d2 − d1) đã chuẩn hoá, 0 ở ranh giới hai tế bào. Chỉ xét tâm của 5 × 5 ô quanh điểm ảnh, quấn ở mép.
function cells(n, R, amt, hex = false) {
  const s = N / n;
  const P = [];
  for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) P.push([(i + 0.5 + (hex && j % 2 ? 0.5 : 0) + (R() - 0.5) * amt * 2) * s, (j + 0.5 + (R() - 0.5) * amt * 2) * s]);
  const out = new Float32Array(N * N);
  for (let y = 0; y < N; y++) {
    const cj = Math.floor(y / s);
    for (let x = 0; x < N; x++) {
      const ci = Math.floor(x / s);
      let d1 = Infinity, d2 = Infinity;
      for (let dj = -2; dj <= 2; dj++) for (let di = -2; di <= 2; di++) {
        const I = ci + di, J = cj + dj;
        const ii = ((I % n) + n) % n, jj = ((J % n) + n) % n;
        const p = P[jj * n + ii];
        const dd = (p[0] + (I - ii) * s - x) ** 2 + (p[1] + (J - jj) * s - y) ** 2;
        if (dd < d1) { d2 = d1; d1 = dd; } else if (dd < d2) d2 = dd;
      }
      out[y * N + x] = Math.sqrt(d2) - Math.sqrt(d1);
    }
  }
  return normalize(out);
}

const GEN = {
  grain: () => mixA(fbm(16, 16, 3, 11), fbm(64, 64, 2, 12), 0.6),
  laminate: () => mixA(fbm(3, 40, 3, 21), fbm(48, 48, 2, 22), 0.5),
  brushed: () => mixA(fbm(1, 96, 3, 31), fbm(2, 160, 2, 32), 0.5),
  tile: () => {
    const R = rng(41);
    const n = fbm(24, 24, 3, 42);
    const shade = Array.from({ length: 16 }, () => 0.5 + (R() - 0.5) * 0.1);
    const s = N / 4, grout = 2.5;
    return n.map((v, i) => {
      const x = i % N, y = (i / N) | 0;
      const gx = Math.min(x % s, s - (x % s)), gy = Math.min(y % s, s - (y % s));
      if (Math.min(gx, gy) < grout) return 0.02;
      return shade[((y / s) | 0) * 4 + ((x / s) | 0)] + (v - 0.5) * 0.1;
    });
  },
  speckle: () => {
    // Nền gần trung tính, hạt sáng và hạt tối rải đều (nhựa epoxy, phenolic)
    const R = rng(51);
    const out = fbm(32, 32, 2, 52).map((v) => 0.46 + v * 0.08);
    for (let i = 0; i < 1100; i++) {
      const v = R() < 0.6 ? 0.75 + R() * 0.25 : R() * 0.2;
      const r = 1 + Math.round(R() * 1.2);
      const x0 = Math.floor(R() * N), y0 = Math.floor(R() * N);
      for (let dy = 0; dy < r; dy++) for (let dx = 0; dx < r; dx++) out[((y0 + dy) % N) * N + ((x0 + dx) % N)] = v;
    }
    return out;
  },
  plaster: () => mixA(fbm(6, 6, 4, 61), fbm(64, 64, 2, 62), 0.45),
  wood: () => {
    const warp = fbm(4, 2, 3, 71);
    const fine = fbm(2, 96, 2, 72);
    return warp.map((w, i) => { const y = ((i / N) | 0) / N; return 0.5 + 0.35 * Math.sin((y * 14 + w * 2.2) * Math.PI * 2) + (fine[i] - 0.5) * 0.3; });
  },
  wax: () => {
    const R = rng(81);
    const n = fbm(20, 20, 3, 82);
    const holes = draw((ctx) => {
      for (let i = 0; i < 26; i++) bumpDot(ctx, R() * N, R() * N, 1.5 + R() * 2.5, 0, 1);
      ctx.strokeStyle = gray(0.55);
      ctx.lineWidth = 1;
      for (let i = 0; i < 9; i++) { const x = R() * N, y = R() * N, a = R() * Math.PI, l = 20 + R() * 60; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); ctx.stroke(); }
    }, 1);
    return n.map((v, i) => (0.4 + v * 0.3) * holes[i]);
  },
  soil: () => {
    const R = rng(91);
    const clods = draw((ctx) => { for (let i = 0; i < 260; i++) bumpDot(ctx, R() * N, R() * N, 2 + R() * 6, 0.9, 0.35); }, 0.35);
    return mixA(fbm(12, 12, 4, 92), clods, 0.55);
  },
  gravel: () => {
    const R = rng(101);
    return draw((ctx) => { for (let i = 0; i < 420; i++) bumpDot(ctx, R() * N, R() * N, 3 + R() * 7, 0.65 + R() * 0.35, 0.15); }, 0.1);
  },
  rock: () => fbm(4, 4, 6, 111, 0.55).map((v) => 1 - Math.abs(v * 2 - 1) * 0.9),
  bark: () => mixA(fbm(24, 2, 4, 121), fbm(64, 6, 2, 122), 0.35).map((v) => v ** 1.4),
  leaf: () => {
    const R = rng(131);
    const blobs = draw((ctx) => { for (let i = 0; i < 160; i++) bumpDot(ctx, R() * N, R() * N, 6 + R() * 14, 0.9, 0.2); }, 0.2);
    return mixA(fbm(8, 8, 3, 132), blobs, 0.6);
  },
  tissue: () => mixA(fbm(5, 5, 4, 141), fbm(40, 40, 2, 142), 0.35),
  alv: () => cells(9, rng(151), 0.38).map((v) => Math.min(1, v * 2.4)),
  gran: () => {
    const R = rng(161);
    const d = draw((ctx) => { for (let i = 0; i < 520; i++) bumpDot(ctx, R() * N, R() * N, 2 + R() * 3.5, 0.6 + R() * 0.4, 0.3); }, 0.3);
    return mixA(d, fbm(20, 20, 2, 162), 0.25);
  },
  lob: () => cells(6, rng(171), 0.075, true).map((v) => Math.min(1, v * 3)),
  str: () => {
    const n = fbm(2, 40, 2, 181);
    const w = fbm(4, 4, 2, 182);
    return n.map((v, i) => { const y = ((i / N) | 0) / N; return 0.5 + 0.35 * Math.sin((y * 34 + w[i] * 1.5) * Math.PI * 2) + (v - 0.5) * 0.3; });
  },
  strx: () => {
    const n = fbm(40, 2, 2, 191);
    const w = fbm(4, 4, 2, 192);
    return n.map((v, i) => { const x = (i % N) / N; return 0.5 + 0.35 * Math.sin((x * 34 + w[i] * 1.5) * Math.PI * 2) + (v - 0.5) * 0.3; });
  },
  fur: () => {
    const R = rng(201);
    return draw((ctx) => {
      ctx.lineCap = 'round';
      for (let i = 0; i < 2600; i++) {
        const x = R() * N, y = R() * N, a = -0.9 + (R() - 0.5) * 0.5, l = 6 + R() * 8;
        ctx.strokeStyle = gray(0.45 + R() * 0.55);
        ctx.lineWidth = 0.8 + R() * 0.8;
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); ctx.stroke();
      }
    }, 0.3);
  },
  scale: () => {
    // Vảy xếp lợp: hàng so le, vảy phía trước (gần đầu, x nhỏ) đè lên vảy sau; mỗi vảy dày dần về mép sau
    const n = 8, s = N / n;
    return draw((ctx) => {
      for (let i = n; i >= -1; i--) for (let j = -1; j <= n; j++) {
        const x = i * s, y = j * s + (i % 2) * s * 0.5;
        const g = ctx.createRadialGradient(x - s * 0.35, y, s * 0.1, x - s * 0.2, y, s * 0.75);
        g.addColorStop(0, gray(0.95));
        g.addColorStop(0.75, gray(0.6));
        g.addColorStop(1, gray(0.2));
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x - s * 0.2, y, s * 0.72, -Math.PI / 2, Math.PI / 2);
        ctx.closePath();
        ctx.fill();
      }
    }, 0.4);
  },
  chl: () => {
    const R = rng(211);
    return draw((ctx) => { for (const [x, y] of jitter(14, R, 0.4)) bumpDot(ctx, x, y, 5 + R() * 3, 1, 0.25); }, 0.15);
  },
  myo: () => {
    // Ranh giới đốt cơ hình chữ V (mũi hướng về đầu), 4 đốt mỗi ô lặp
    const w = fbm(3, 3, 2, 221);
    return w.map((v, i) => {
      const x = (i % N) / N, y = ((i / N) | 0) / N;
      const t = x * 4 + Math.abs(y - 0.5) * 1.6 + (v - 0.5) * 0.15;
      const f = t - Math.floor(t);
      return f < 0.07 ? 1 : 0.45 + f * 0.25;
    });
  },
  eggs: () => {
    const R = rng(231);
    return draw((ctx) => { for (const [x, y] of jitter(12, R, 0.3)) bumpDot(ctx, x, y, 8 + R() * 2, 1, 0.35); }, 0.1);
  },
  frogegg: () => {
    const R = rng(241);
    return draw((ctx) => { for (const [x, y] of jitter(8, R, 0.3)) bumpDot(ctx, x, y, 12 + R() * 2, 1, 0.5); }, 0);
  },
  fat: () => {
    const R = rng(251);
    return draw((ctx) => { for (const [x, y] of jitter(9, R, 0.35)) bumpDot(ctx, x, y, 11 + R() * 4, 0.95, 0.4); }, 0.25);
  },
  chit: () => {
    const R = rng(261);
    const pits = draw((ctx) => { for (let i = 0; i < 300; i++) bumpDot(ctx, R() * N, R() * N, 1.2 + R() * 2, 0.2, 0.75); }, 0.75);
    return mixA(pits, fbm(10, 10, 3, 262), 0.3);
  },
  shell: () => {
    const w = fbm(3, 3, 2, 281);
    const n = fbm(6, 48, 2, 282);
    return n.map((v, i) => { const x = (i % N) / N; return 0.5 + 0.28 * Math.sin((x * 22 + w[i] * 2) * Math.PI * 2) + (v - 0.5) * 0.35; });
  },
  skin: () => {
    const R = rng(271);
    const warts = draw((ctx) => { for (let i = 0; i < 240; i++) bumpDot(ctx, R() * N, R() * N, 1.5 + R() * 4, 0.95, 0.45); }, 0.45);
    return mixA(warts, fbm(8, 8, 3, 272), 0.35);
  },
};

// Ảnh vân sinh dần khi trình duyệt rảnh (mỗi lần một loại), để không chặn lúc dựng cảnh; trong lúc chờ, ảnh là
// màu xám 0,5 (vân trung tính: không đổi màu, không gồ ghề)
const textures = new Map();
const all = new Set();
const queue = [];
let pumping = false;
const waiters = [];
const later = (fn) => (typeof requestIdleCallback === 'function' ? requestIdleCallback(fn, { timeout: 120 }) : setTimeout(fn, 16));
function pump() {
  const kind = queue.shift();
  if (!kind) { pumping = false; waiters.splice(0).forEach((f) => f()); return; }
  const h = GEN[kind]();
  const t = textures.get(kind);
  for (let i = 0; i < t.image.data.length; i++) t.image.data[i] = Math.round(Math.max(0, Math.min(1, h[i])) * 255);
  t.needsUpdate = true;
  later(pump);
}
// Chờ mọi ảnh vân đã yêu cầu sinh xong (trang thử vân, kiểm thử)
export const texturesReady = () => (pumping ? new Promise((r) => waiters.push(r)) : Promise.resolve());
export function texture(kind) {
  if (!textures.has(kind)) {
    const data = new Uint8Array(N * N).fill(128);
    queue.push(kind);
    if (!pumping) { pumping = true; later(pump); }
    const t = new THREE.DataTexture(data, N, N, THREE.RedFormat, THREE.UnsignedByteType);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.magFilter = THREE.LinearFilter;
    t.minFilter = THREE.LinearMipmapLinearFilter;
    t.generateMipmaps = true;
    t.anisotropy = 4;
    t.needsUpdate = true;
    textures.set(kind, t);
  }
  return textures.get(kind);
}

// ---- Gắn vân vào vật liệu MeshStandardMaterial ----

const VERT_PARS = 'varying vec3 vTpPos;\nvarying vec3 vTpNrm;\n';
const VERT = `
  vec4 tpW = vec4( transformed, 1.0 );
  vec3 tpN = objectNormal;
  #ifdef USE_INSTANCING
    tpW = instanceMatrix * tpW;
    tpN = mat3( instanceMatrix ) * tpN;
  #endif
  vTpPos = ( modelMatrix * tpW ).xyz;
  vTpNrm = normalize( mat3( modelMatrix ) * tpN );`;
const FRAG_PARS = `uniform sampler2D tpMap;
uniform float tpScale;
uniform float tpAlbedo;
uniform float tpBump;
uniform float tpRough;
varying vec3 vTpPos;
varying vec3 vTpNrm;
// Chiếu ba mặt: trộn ba lần lấy mẫu theo hướng pháp tuyến
float tpHeight() {
  vec3 w = pow( abs( normalize( vTpNrm ) ), vec3( 4.0 ) );
  w /= ( w.x + w.y + w.z );
  vec3 p = vTpPos * tpScale;
  return texture2D( tpMap, p.zy ).r * w.x + texture2D( tpMap, p.xz ).r * w.y + texture2D( tpMap, p.xy ).r * w.z;
}
// Như perturbNormalArb của Three.js (bump map theo đạo hàm màn hình), viết lại vì bản gốc chỉ có khi dùng bumpMap
vec3 tpPerturb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDir ) {
  vec3 vSigmaX = normalize( dFdx( surf_pos ) );
  vec3 vSigmaY = normalize( dFdy( surf_pos ) );
  vec3 R1 = cross( vSigmaY, surf_norm );
  vec3 R2 = cross( surf_norm, vSigmaX );
  float fDet = dot( vSigmaX, R1 ) * faceDir;
  vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
  return normalize( abs( fDet ) * surf_norm - vGrad );
}
`;

// Gắn vân `kind` vào vật liệu (một lần); opts ghi đè size, albedo, bump, rough của KINDS
export function surface(mat, kind, opts = {}) {
  if (!mat || !kind || !GEN[kind] || mat.userData.tp) return mat;
  const k = { ...KINDS[kind], ...opts };
  const u = {
    tpMap: { value: texture(kind) },
    tpScale: { value: 1 / k.size },
    tpAlbedo: { value: enabled ? k.albedo : 0 },
    tpBump: { value: enabled ? k.bump : 0 },
    tpRough: { value: enabled ? k.rough : 0 },
  };
  mat.userData.tp = { kind, uniforms: u, opts };
  all.add(mat);
  mat.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, u);
    shader.vertexShader = VERT_PARS + shader.vertexShader.replace('#include <worldpos_vertex>', `#include <worldpos_vertex>${VERT}`);
    shader.fragmentShader = FRAG_PARS + shader.fragmentShader
      .replace('#include <color_fragment>', '#include <color_fragment>\n  float tpH = tpHeight();\n  diffuseColor.rgb *= max( 0.0, 1.0 + ( tpH - 0.5 ) * 2.0 * tpAlbedo );')
      .replace('#include <roughnessmap_fragment>', '#include <roughnessmap_fragment>\n  roughnessFactor = clamp( roughnessFactor + ( 0.5 - tpH ) * 2.0 * tpRough, 0.04, 1.0 );')
      .replace('#include <normal_fragment_maps>', '#include <normal_fragment_maps>\n  normal = tpPerturb( - vViewPosition, normal, vec2( dFdx( tpH ), dFdy( tpH ) ) * tpBump, faceDirection );');
  };
  mat.customProgramCacheKey = () => 'tp1';
  mat.needsUpdate = true;
  return mat;
}

// Bật, tắt toàn bộ vân (nút "Vân bề mặt"): đặt độ đậm, độ gồ ghề về 0 thay vì dựng lại shader
let enabled = true;
export function setTextures(on) {
  enabled = on;
  for (const m of all) {
    const u = m.userData.tp.uniforms;
    const k = { ...KINDS[m.userData.tp.kind], ...m.userData.tp.opts };
    u.tpAlbedo.value = on ? k.albedo : 0;
    u.tpBump.value = on ? k.bump : 0;
    u.tpRough.value = on ? k.rough : 0;
  }
}
