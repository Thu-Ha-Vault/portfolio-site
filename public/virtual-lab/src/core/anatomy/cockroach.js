import { blob, tube, dots, line, strands, ellipse, pair, rng, vessels } from './kit.js';

// Gián Mỹ Periplaneta americana nằm sấp, đầu bên trái; bên phải con gián ở phía trên hình (y < 0). x từ trán (0) tới mút
// bụng (1), lông đuôi và cánh vượt ra sau. Theo Miall & Denny 1886, Wall et al. 1975, Weihmann et al. 2015, Anderson
// 1964, Luo et al. 2023 (nguồn miall, wall1975, weihmann2015 trong data/dissection.json): thân dài khoảng 30 mm,
// rộng 11–14 mm; tấm lưng ngực trước 0,05–0,34 phủ gần hết đầu; ngực giữa 0,34–0,43, ngực sau 0,43–0,52; bụng 10 đốt
// 0,52–1. Bên trong: tuyến nước bọt hình lá hai bên thực quản trong ngực, bình chứa trong suốt dài hơn tuyến; diều là túi
// thành mỏng tới đốt bụng 3–6; mề nhỏ có 6 răng kitin; 8 manh tràng vị chĩa về trước quanh mề; ruột giữa; khoảng 150 ống
// Malpighi trắng vàng đổ vào chỗ nối ruột giữa – ruột sau; hồi tràng, kết tràng cuộn, trực tràng có 6 nếp dọc; thể mỡ trắng;
// khí quản trắng bạc; tim hình ống 13 ngăn dưới tấm lưng (bỏ đi cùng tấm lưng); não, hạch dưới hầu, 3 hạch ngực, 6 hạch
// bụng (hạch thứ 6 lớn nhất). Hàm trên trái 4 răng, phải 3 răng; xúc biện hàm dưới 5 đốt, xúc biện môi dưới 3 đốt.

const BROWN = '#7a3f1e';
const LEG = '#8a4b26';
const BC = [0.63, 0.51]; // tâm bong bóng phần phụ miệng
const BR = 0.13;
const B = (u, v) => [BC[0] + u * BR, BC[1] + v * BR];
const Bp = (pts) => pts.map(([u, v]) => B(u, v));

function legs() {
  const spine = (a, b) => [0.25, 0.5, 0.75].map((t) => line([[a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t], [a[0] + (b[0] - a[0]) * t + 0.012, a[1] + (b[1] - a[1]) * t - 0.012]], 0.0018, { c: '#4a2410', only: 'svg' }));
  const one = (coxa, knee, foot, tarsus) => [tube([coxa, knee], [0.022, 0.016], { c: LEG, gloss: 0.8 }), tube([knee, foot], [0.012, 0.008], { c: LEG, gloss: 0.8 }), ...spine(knee, foot), tube([foot, tarsus], [0.006, 0.004], { c: LEG })];
  return pair([
    ...one([0.22, -0.17], [0.15, -0.3], [0.06, -0.36], [0.0, -0.38]),
    ...one([0.4, -0.18], [0.42, -0.34], [0.32, -0.45], [0.26, -0.48]),
    ...one([0.48, -0.17], [0.62, -0.32], [0.82, -0.36], [0.95, -0.38]),
  ]);
}

export default function cockroach(f = {}) {
  const R = rng(83);
  const antennae = pair([tube([[0.03, -0.04], [-0.04, -0.08], [-0.1, -0.16], [-0.12, -0.26], [-0.08, -0.36], [0.02, -0.44]], [0.005, 0.004, 0.0035, 0.003, 0.0025, 0.002], { c: '#5a2e16', rings: 0.012, gloss: 0.5 })]);
  const head = [blob([[-0.01, 0], [0.0, -0.05], [0.04, -0.075], [0.09, -0.07], [0.11, -0.03], [0.11, 0.03], [0.09, 0.07], [0.04, 0.075], [0.0, 0.05]], { c: '#5a2e16', h: 0.08, gloss: 0.8 }), ...pair([blob([[0.03, -0.06], [0.06, -0.075], [0.09, -0.065], [0.085, -0.045], [0.055, -0.05]], { c: '#1f1410', h: 0.085, gloss: 1 })])];
  const pronotum = [blob([[0.03, 0], [0.04, -0.12], [0.1, -0.185], [0.2, -0.2], [0.3, -0.19], [0.345, -0.15], [0.35, 0], [0.345, 0.15], [0.3, 0.19], [0.2, 0.2], [0.1, 0.185], [0.04, 0.12]], { c: '#c9a066', h: 0.1, gloss: 0.9 }), ...pair([blob([[0.09, -0.01], [0.12, -0.1], [0.2, -0.13], [0.29, -0.11], [0.31, -0.01]], { c: '#5a2a14', h: 0.002, z: 0.1, only: 'svg' })])];
  const wing = (dy) => blob([[0.33, dy * 0.01], [0.38, dy * 0.17], [0.6, dy * 0.2], [0.9, dy * 0.175], [1.12, dy * 0.09], [1.14, dy * 0.02], [1.0, -dy * 0.01], [0.6, -dy * 0.02]], { c: '#8b4a22', op: 0.94, h: 0.012, gloss: 0.9, z: 0.08 });
  const veins = (dy) => [line([[0.36, dy * 0.12], [0.7, dy * 0.15], [1.08, dy * 0.08]], 0.003, { c: '#5a2a12', op: 0.7, only: 'svg' }), line([[0.36, dy * 0.06], [0.7, dy * 0.08], [1.1, dy * 0.04]], 0.0025, { c: '#5a2a12', op: 0.6, only: 'svg' })];
  const cerci = pair([tube([[0.96, -0.03], [1.04, -0.06], [1.1, -0.07]], [0.008, 0.006, 0.003], { c: '#6b3418', rings: 0.012 })]);
  const abdomenTerga = Array.from({ length: 9 }, (_, i) => { const x0 = 0.52 + i * 0.05, w = 0.2 - i * 0.012 - (i > 6 ? (i - 6) * 0.02 : 0); return blob([[x0, -w], [x0 + 0.052, -w + 0.01], [x0 + 0.052, w - 0.01], [x0, w]], { c: i % 2 ? '#6e381a' : BROWN, h: 0.07, gloss: 0.8 }); });
  const thorax = blob([[0.33, -0.19], [0.53, -0.2], [0.53, 0.2], [0.33, 0.19]], { c: '#6e381a', h: 0.08, gloss: 0.8 });
  const dorsal = [...antennae, ...legs(), ...cerci, thorax, ...abdomenTerga, ...head, ...pronotum, wing(1), wing(-1), ...veins(1), ...veins(-1)];
  const ventral = [...antennae, ...legs(), ...cerci, ...abdomenTerga.map((p) => ({ ...p, c: '#9a5a30' })), thorax, ...head];

  // Mở: cắt cánh đặt bên cạnh, cắt hai bên mép thân, lật bỏ tấm lưng; còn đầu, chân, râu, lông đuôi, mép thân
  const rimL = [[0.1, -0.15], [0.2, -0.2], [0.35, -0.2], [0.52, -0.205], [0.7, -0.18], [0.85, -0.13], [0.97, -0.05]];
  const rims = pair([blob([...rimL, [0.97, -0.03], [0.85, -0.11], [0.7, -0.16], [0.52, -0.185], [0.35, -0.18], [0.2, -0.18], [0.11, -0.13]], { c: '#6e381a', h: 0.03, gloss: 0.7 })]);
  const floor = blob([[0.1, 0], [0.11, -0.13], [0.2, -0.18], [0.35, -0.18], [0.52, -0.185], [0.7, -0.16], [0.85, -0.11], [0.97, -0.03], [0.99, 0], [0.97, 0.03], [0.85, 0.11], [0.7, 0.16], [0.52, 0.185], [0.35, 0.18], [0.2, 0.18], [0.11, 0.13]], { c: '#b58a62', h: 0.003, gloss: 0.3 });
  const sternLines = Array.from({ length: 9 }, (_, i) => line([[0.57 + i * 0.048, -0.17 + i * 0.012], [0.575 + i * 0.048, 0], [0.57 + i * 0.048, 0.17 - i * 0.012]], 0.002, { c: '#8a6440', op: 0.6, only: 'svg' }));
  const cutWings = [wing(1), wing(-1), ...veins(1), ...veins(-1)].map((p) => ({ ...p, pts: p.pts.map(([x, y]) => [x * 0.9 + 0.12, y * 0.6 - 0.44]), z: 0 }));
  const opened = { body: [...antennae, ...legs(), ...cerci, ...head], flaps: rims, cavity: [floor, ...sternLines], deep: [] };

  // Tuyến nước bọt và bình chứa; diều; mề; manh tràng; ruột giữa; ống Malpighi; ruột sau
  const caeca = Array.from({ length: 8 }, (_, i) => { const a = Math.PI + ((i - 3.5) / 3.5) * 1.15; return tube([[0.7, Math.sin(a) * 0.012], [0.7 + Math.cos(a) * 0.035, Math.sin(a) * 0.04], [0.7 + Math.cos(a) * 0.06 + 0.01, Math.sin(a) * 0.055]], [0.008, 0.007, 0.004], { c: '#f0ead8', gloss: 0.7, z: 0.03 }); });
  const malp = Array.from({ length: 60 }, (_, i) => { const a = (i / 60) * Math.PI * 2 + R() * 0.2; const l = 0.04 + R() * 0.06; const p0 = [0.8, 0]; const mid = [p0[0] + Math.cos(a) * l * 0.5 + (R() - 0.5) * 0.02, Math.sin(a) * l * 0.6]; return [p0, mid, [p0[0] + Math.cos(a + (R() - 0.5)) * l, Math.sin(a + (R() - 0.5)) * l * 1.3]]; });
  const trachea = [];
  for (const sg of [-1, 1]) {
    trachea.push(line([[0.15, sg * 0.15], [0.35, sg * 0.165], [0.55, sg * 0.165], [0.75, sg * 0.14], [0.92, sg * 0.08]], 0.004, { c: '#e6ecef', op: 0.95 }));
    for (const x of [0.25, 0.4, 0.5, 0.6, 0.7, 0.8, 0.88]) for (const v of vessels([x, sg * 0.155], sg > 0 ? -Math.PI / 2 - 0.3 : Math.PI / 2 + 0.3, { len: 0.035, depth: 2, spread: 0.6, seed: Math.round(x * 100) + (sg > 0 ? 7 : 0) })) trachea.push(line(v.pts, 0.0016 * v.w, { c: '#dfe6ea', op: 0.85, only: 'svg' }));
    trachea.push(dots([0.4, 0.5, 0.58, 0.66, 0.74, 0.82, 0.9].map((x) => [x, sg * (0.17 - (x > 0.7 ? (x - 0.7) * 0.4 : 0)), 0.005]), { c: '#3a2010', z: 0.02 }));
  }
  const ganglia = [[0.2, 0.012], [0.385, 0.011], [0.47, 0.011], [0.56, 0.008], [0.62, 0.008], [0.68, 0.008], [0.74, 0.008], [0.8, 0.008], [0.88, 0.011]];

  const organs = {
    'chuoi-than-kinh': { parts: [...pair([tube([[0.06, -0.006], [0.2, -0.004], [0.5, -0.003], [0.88, -0.003]], 0.0018, { c: '#f4efe0' })]), dots(ganglia.map(([x, r]) => [x, 0, r]), { c: '#f6f1e3' }), blob(ellipse(0.05, 0, 0.018, 0.025, 0, 9), { c: '#f4efe0', h: 0.02, gloss: 0.6 })], anchor: [0.62, 0] },
    'the-mo': { parts: [blob([[0.52, -0.16], [0.7, -0.14], [0.85, -0.1], [0.95, -0.03], [0.95, 0.03], [0.85, 0.1], [0.7, 0.14], [0.52, 0.16], [0.48, 0]], { c: '#f7f3ea', op: f.removed ? 0.35 : 1, tex: 'fat', texOp: 1, h: 0.012, gloss: 0.4 })], anchor: [0.6, 0.12] },
    'khi-quan': { parts: trachea, anchor: [0.55, -0.165] },
    'co-bay': { parts: pair([blob([[0.14, -0.04], [0.2, -0.12], [0.3, -0.15], [0.33, -0.08], [0.3, -0.04]], { c: '#f0cdb8', tex: 'strx', texOp: 0.8, h: 0.04, gloss: 0.5 }), blob([[0.34, -0.03], [0.36, -0.15], [0.44, -0.16], [0.5, -0.14], [0.51, -0.04]], { c: '#efc7b0', tex: 'strx', texOp: 0.8, h: 0.04, gloss: 0.5 })]), anchor: [0.42, -0.1] },
    'tuyen-nuoc-bot': { parts: pair([blob([[0.17, -0.025], [0.2, -0.06], [0.26, -0.075], [0.31, -0.06], [0.3, -0.035], [0.24, -0.028]], { c: '#f4f0e8', tex: 'lob', texOp: 0.8, h: 0.02, gloss: 0.6, z: 0.04 }), blob([[0.26, -0.02], [0.3, -0.04], [0.42, -0.045], [0.45, -0.03], [0.42, -0.018], [0.3, -0.016]], { c: '#e6eef0', op: 0.6, h: 0.015, gloss: 1, z: 0.045 })]), anchor: [0.25, -0.06] },
    dieu: { parts: [tube([[0.08, 0], [0.16, 0], [0.24, 0]], [0.008, 0.009, 0.012], { c: '#e9dcc2', z: 0.05 }), blob([[0.24, 0], [0.3, -0.04], [0.4, -0.07], [0.52, -0.075], [0.6, -0.06], [0.65, -0.02], [0.66, 0], [0.65, 0.02], [0.6, 0.06], [0.52, 0.075], [0.4, 0.07], [0.3, 0.04]], { c: '#e9dcc2', op: 0.92, h: 0.05, gloss: 0.9, z: 0.05 }),
      ...[0.35, 0.45, 0.55].map((x) => line([[x, -0.05], [x + 0.02, 0], [x, 0.05]], 0.002, { c: '#c9b894', only: 'svg' })),
      blob([[0.64, 0], [0.655, -0.016], [0.69, -0.012], [0.7, 0], [0.69, 0.012], [0.655, 0.016]], { c: '#a07a4a', h: 0.03, gloss: 0.9, z: 0.06 })], anchor: [0.48, 0.03] },
    'ruot-giua': { parts: [...caeca, tube([[0.7, 0], [0.74, 0.03], [0.77, 0.0], [0.8, 0.0]], [0.014, 0.013, 0.012, 0.011], { c: '#f2ece0', rings: 0.01, gloss: 0.7, z: 0.035 })], anchor: [0.75, 0.025] },
    'ong-malpighi': { parts: [strands(malp, 0.0009, { c: '#f1e2a8', z: 0.04 })], anchor: [0.8, 0.07] },
    'truc-trang': { parts: [tube([[0.8, 0], [0.84, -0.03], [0.88, 0.01], [0.86, 0.04], [0.9, 0.03], [0.93, 0.0], [0.98, 0.0]], [0.009, 0.01, 0.011, 0.011, 0.012, 0.014, 0.01], { c: '#ddd5c8', op: 0.92, gloss: 0.7, z: 0.04 }), ...[-0.006, -0.002, 0.002, 0.006].map((dy) => line([[0.935, dy], [0.975, dy]], 0.0015, { c: '#9f9585', only: 'svg' }))], anchor: [0.92, 0.0] },
    rau: { parts: antennae.map((p) => ({ ...p, only: 'svg' })), anchor: [-0.1, -0.2] },
    canh: { parts: f.open ? cutWings : [wing(1), wing(-1)].map((p) => ({ ...p, only: 'svg', op: 0 })), anchor: f.open ? [0.6, -0.44] : [0.7, -0.15] },
    // Phần phụ miệng tách rời, phóng to (chỉ trên hình SVG)
    'ham-tren': { parts: [-1, 1].map((sg) => blob(Bp([[sg * 0.12, -0.55], [sg * 0.5, -0.62], [sg * 0.55, -0.35], [sg * 0.42, -0.3], [sg * 0.33, -0.36], [sg * 0.25, -0.31], [sg * 0.17, -0.37], [sg * 0.1, -0.33]]), { c: '#6b2a12', gloss: 0.8, only: 'svg' })), anchor: B(-0.35, -0.45) },
    'ham-duoi': { parts: [-1, 1].flatMap((sg) => [blob(Bp([[sg * 0.22, -0.15], [sg * 0.42, -0.2], [sg * 0.45, 0.25], [sg * 0.3, 0.35], [sg * 0.2, 0.1]]), { c: '#8a5a32', gloss: 0.6, only: 'svg' }), tube(Bp([[sg * 0.45, -0.1], [sg * 0.62, -0.05], [sg * 0.72, 0.1], [sg * 0.76, 0.3], [sg * 0.74, 0.5]]), 0.0035, { c: '#9a6a3e', rings: 0.012, only: 'svg' })]), anchor: B(0.35, 0.05) },
    'moi-duoi': { parts: [blob(Bp([[-0.17, 0.42], [0.17, 0.42], [0.2, 0.75], [0.08, 0.85], [0, 0.78], [-0.08, 0.85], [-0.2, 0.75]]), { c: '#9a6a3e', gloss: 0.6, only: 'svg' }), ...[-1, 1].map((sg) => tube(Bp([[sg * 0.2, 0.5], [sg * 0.33, 0.62], [sg * 0.36, 0.8]]), 0.003, { c: '#a8784a', rings: 0.012, only: 'svg' }))], anchor: B(0, 0.62) },
  };
  const decor = [
    blob(Bp(ellipse(0, 0, 1, 1, 0, 16)), { c: '#2f2a26', edge: '#cfd5da', sw: 1.4, flatFill: true, only: 'svg' }),
    blob(Bp([[-0.25, -0.95], [0.25, -0.95], [0.3, -0.7], [-0.3, -0.7]]), { c: '#7a4024', only: 'svg' }),
    { t: 'text', at: B(0, 1.4), s: 'Phần phụ miệng (tách rời)', size: 7.5, c: '#e8ecef', only: 'svg' },
  ];
  return {
    skin: 'chit', // vân da ngoài của mẫu 3D (src/scene/textures.js)
    frame: [-0.16, 1.16, -0.58, 0.72],
    floor: 0.04,
    surface: 0.1,
    openScale: 0.5,
    center: [0.5, 0],
    note: 'gián nằm sấp nên bên phải con gián ở phía trên hình; khi mổ, cánh cắt rời đặt phía trên; hình tròn là phần phụ miệng tách rời (môi trên, hàm trên, hàm dưới, môi dưới)',
    closed: (side) => (side === 'up' ? dorsal : ventral),
    opened,
    decor,
    organs,
    pins: { 4: [[0.15, -0.21], [0.15, 0.21], [0.85, -0.16], [0.85, 0.16]], 2: [[0.15, 0], [0.9, 0]] },
    cut: (ln) => (ln === 'side' ? [...rimL.map(([x, y]) => [x, y * 0.92])] : [[0.97, 0], [0.6, 0], [0.3, 0], [0.08, 0]]),
    spill: { c: '#8a6a3a', at: [0.55, 0.0], r: [0.13, 0.07] },
  };
}

