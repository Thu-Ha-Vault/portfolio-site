import { blob, tube, dots, line, ellipse, pair, rng, tubeOutline } from './kit.js';

// Giun đũa cái Ascaris nằm sấp (mặt lưng lên), đầu bên trái, đã cắt dọc giữa lưng và ghim hai mép; x từ mút đầu (0) tới
// mút đuôi (1). Theo sách thực hành Ascaris suum (Fox 2006, Lander University), Saunders 1972 và SGK Sinh học 7 bài 13
// (nguồn fox2006, sgk13 trong data/dissection.json): miệng 3 môi; hầu cơ khoẻ tới khoảng 0,025; ruột dẹt chạy thẳng tới
// trực tràng ngắn, hậu môn ở mặt bụng ngay trước mút đuôi; lỗ sinh dục cái ở mặt bụng khoảng 1/3 thân; âm đạo ngắn chia
// hai tử cung to chứa đầy trứng chạy về gần đuôi; ống dẫn trứng cuộn từ khoảng 0,33 tới 0,9; buồng trứng là sợi rất mảnh
// cuộn thành búi ở khoảng giữa thân 0,4–0,65; hai dây bên chạy dọc thành cơ thể; chỉ có lớp cơ dọc. Hình SVG giãn ngang
// 2 lần để thấy rõ nội quan.

const SKIN = '#ece2cc';
const R = [[0, 0.006], [0.015, 0.018], [0.08, 0.027], [0.5, 0.03], [0.9, 0.028], [0.97, 0.02], [1.0, 0.009]];
const rAt = (x) => { for (let i = 1; i < R.length; i++) if (x <= R[i][0]) { const t = (x - R[i - 1][0]) / (R[i][0] - R[i - 1][0]); return R[i - 1][1] + (R[i][1] - R[i - 1][1]) * t; } return 0.009; };
const AXIS = Array.from({ length: 41 }, (_, i) => [i / 40, 0]);

// Búi sợi cuộn rối: đi dần từ x0 tới x1, mỗi bước lệch ngẫu nhiên trong dải y0–y1
function tangle(x0, x1, y0, y1, n, R) {
  return Array.from({ length: n }, (_, i) => { const t = i / (n - 1); return [x0 + (x1 - x0) * t + (R() - 0.5) * 0.035, y0 + (y1 - y0) * R()]; });
}

export default function ascaris(f = {}) {
  const rnd = rng(61);
  const body = (c, x0 = 0, x1 = 1) => {
    const ax = AXIS.filter(([x]) => x >= x0 - 1e-9 && x <= x1 + 1e-9);
    return [tube(ax, ax.map(([x]) => rAt(x)), { c, gloss: 0.9, flat: 0.85, only: '3d' }), blob(tubeOutline(ax, ax.map(([x]) => rAt(x)), 4), { c, gloss: 1, only: 'svg' })];
  };
  const lateral = pair([line([[0.02, -0.02], [0.5, -0.022], [0.97, -0.016]], 0.0022, { c: '#f8f3e8', op: 0.8, only: 'svg' })]);
  const lips = dots([[0.002, -0.003, 0.003], [0.002, 0.003, 0.003], [-0.001, 0, 0.0028]], { c: '#e6d8bb', z: 0.03 });
  const girdle = line([[0.33, -0.029], [0.332, 0], [0.33, 0.029]], 0.003, { c: '#cdbf9f', only: 'svg' });
  const dorsal = [...body(SKIN), ...lateral, girdle, lips];
  const ventral = [...body('#e7dcc3'), ...lateral, lips, dots([[0.33, 0, 0.003]], { c: '#8a7a5a', z: 0.05 }), line([[0.988, -0.004], [0.988, 0.004]], 0.002, { c: '#8a7a5a', only: 'svg' })];

  // Vạt thành cơ thể phanh hai bên, nhiều đinh ghim nghiêng so le
  const edge = Array.from({ length: 26 }, (_, i) => { const x = 0.01 + (i / 25) * 0.98; return [x, -(rAt(x) + 0.035 + (i % 2 ? 0.004 : 0))]; });
  const flap = blob([[0.01, -0.006], ...edge, [0.99, -0.008], [0.6, -0.012], [0.2, -0.012]], { c: '#e3d6bd', tex: 'str', texOp: 0.7, h: 0.008, gloss: 0.5 });
  const pinsX = Array.from({ length: 12 }, (_, i) => 0.04 + i * 0.083 + (i % 2) * 0.03);
  const pinsAlong = pair([...pinsX.map((x) => line([[x, -(rAt(x) + 0.03)], [x - 0.006, -(rAt(x) + 0.04)]], 0.0016, { c: '#d4dade', only: 'svg' })), dots(pinsX.map((x) => [x - 0.006, -(rAt(x) + 0.04), 0.0045]), { c: '#e2574c', z: 0.03 })]);
  const cavity = blob(tubeOutline([[0.01, 0], [0.1, 0], [0.5, 0], [0.98, 0]], [0.012, 0.022, 0.024, 0.016], 4), { c: '#c9b994', h: 0.004, gloss: 0.3 });

  // Ống sinh dục cái hình chữ Y: âm đạo → hai tử cung → ống dẫn trứng cuộn → buồng trứng sợi mảnh
  const uterus = [[0.345, 0.004], [0.38, 0.011], [0.46, 0.014], [0.55, 0.01], [0.64, 0.015], [0.73, 0.011], [0.82, 0.015], [0.9, 0.01], [0.93, 0.004]];
  const eggs = (pts) => dots(pts.slice(1).flatMap(([x, y], i) => Array.from({ length: 6 }, (_, k) => { const t = (k + 0.5) / 6; const [px, py] = pts[i]; return [px + (x - px) * t, py + (y - py) * t + (rnd() - 0.5) * 0.003, 0.0026]; })), { c: '#f9f5ec', sw: 0.25, only: 'svg' });
  const organs = {
    'co-doc': { parts: [blob(tubeOutline([[0.03, 0], [0.5, 0], [0.97, 0]], [0.018, 0.022, 0.014], 4), { c: '#e9dcc1', tex: 'str', texOp: 1, h: 0.004, gloss: 0.4 })], anchor: [0.5, 0.012] },
    'day-ben': { parts: pair([tube([[0.02, -0.042], [0.3, -0.05], [0.6, -0.051], [0.9, -0.046], [0.98, -0.032]], 0.0028, { c: '#f6efe0', gloss: 0.6, z: 0.008 })]), anchor: [0.45, 0.05] },
    'lo-sinh-duc': { parts: f.open ? [blob(ellipse(0.33, 0, 0.006, 0.003, 0, 8), { c: '#9e8c66', h: 0.004 })] : [girdle, dots([[0.33, -0.024, 0.0018]], { c: '#9e8c66', only: 'svg' })], anchor: f.open ? [0.33, 0] : [0.33, -0.026] },
    ruot: { parts: [tube([[0.025, 0], [0.2, 0.001], [0.4, -0.001], [0.6, 0.001], [0.8, -0.001], [0.96, 0.0], [0.985, 0.0]], [0.006, 0.007, 0.0075, 0.0075, 0.007, 0.006, 0.004], { c: '#b29d6c', op: 0.95, flat: 0.35, gloss: 0.6, z: 0.004 })], anchor: [0.2, 0.001] },
    hau: { parts: [blob(tubeOutline([[0.004, 0], [0.012, 0], [0.026, 0]], [0.005, 0.0075, 0.0068], 4), { c: '#e3d4b4', tex: 'strx', texOp: 0.8, h: 0.012, gloss: 0.7 }), line([[0.006, 0], [0.025, 0]], 0.0012, { c: '#a8977a', only: 'svg' })], anchor: [0.015, 0] },
    'buong-trung': { parts: [tube(tangle(0.66, 0.4, 0.002, 0.011, 46, rnd), 0.0012, { c: '#fbf8f1', gloss: 0.6, z: 0.012, chunk: 6 }), tube(tangle(0.66, 0.4, -0.002, -0.011, 46, rnd), 0.0012, { c: '#fbf8f1', gloss: 0.6, z: 0.012, chunk: 6 })], anchor: [0.52, 0.012] },
    'ong-dan-trung': { parts: [tube([[0.9, 0.012], ...tangle(0.88, 0.66, 0.018, 0.026, 26, rnd)], 0.002, { c: '#f2ece0', gloss: 0.6, z: 0.014, chunk: 5 }), tube([[0.9, -0.012], ...tangle(0.88, 0.66, -0.018, -0.026, 26, rnd)], 0.002, { c: '#f2ece0', gloss: 0.6, z: 0.014, chunk: 5 })], anchor: [0.78, 0.02] },
    'tu-cung': { parts: [tube([[0.33, 0], [0.345, 0.0]], 0.0035, { c: '#f6f2ea', z: 0.016 }), ...pair([tube(uterus, [0.004, 0.006, 0.0068, 0.0068, 0.0068, 0.0066, 0.006, 0.005, 0.0035], { c: '#f6f2ea', rings: 0.012, gloss: 0.7, z: 0.016 }), eggs(uterus)])], anchor: [0.6, 0.012] },
  };
  return {
    skin: 'strx', // cuticle có vân ngang mịn (vân da ngoài của mẫu 3D)
    frame: [-0.015, 1.015, -0.072, 0.072],
    stretch: 2,
    floor: 0.025,
    surface: 0.055,
    openScale: 0.45,
    note: 'giun nằm sấp nên bên phải con giun ở phía trên hình; hình giãn ngang 2 lần để thấy rõ nội quan',
    closed: (side) => (side === 'up' ? dorsal : ventral),
    opened: { body: [lips], flaps: [...pair([flap]), ...pinsAlong], cavity: [cavity], deep: [] },
    organs,
    pins: { 4: [[0.005, -0.04], [0.005, 0.04], [0.995, -0.035], [0.995, 0.035]], 2: [[0.002, 0], [0.998, 0]] },
    cut: (ln) => { const y = ln === 'side' ? 0.02 : 0; return [[0.98, y], [0.5, y], [0.05, y], [0.01, y * 0.5]]; },
    spill: { c: '#f3eee2', at: [0.62, 0.0], r: [0.2, 0.03] },
  };
}
