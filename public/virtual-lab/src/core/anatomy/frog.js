import { blob, tube, dots, line, ellipse, pair, mirror, mirrorPrim, vessels, coil, rng } from './kit.js';

// Ếch đồng Hoplobatrachus rugulosus nằm ngửa, đầu bên trái; x tính theo chiều dài mõm – huyệt. Mặt bụng lên trên nên
// bên phải con ếch ở phía dưới hình (y > 0), bên trái ở phía trên. Vị trí nội quan đo trên hình của Ecker (1889, Fig. 185)
// và Holmes (1916, The Biology of the Frog, Fig. 10–11, 63), giải phẫu chung của họ Ranidae (nguồn holmes, ecker trong
// data/dissection.json): đầu dài khoảng 0,38; tim 0,28–0,48 trong bao tim, nón động mạch xuất phát bên phải tâm thất;
// gan 0,34–0,65 gồm thuỳ phải, thuỳ trái chia hai và thuỳ giữa nhỏ khuất sau tim; túi mật ở mặt lưng giữa hai thuỳ;
// dạ dày cong chữ J bên trái 0,42–0,70; tuỵ trong quai tá tràng; ruột non chủ yếu bên phải; tì tròn đỏ thẫm gần đầu
// ruột già; thận 0,58–0,80; bóng đái hai thuỳ 0,78–0,97; thể mỡ hình ngón tay trước tuyến sinh dục; chi sau 0,94–1.

const SKIN_V = '#ebe4cc'; // da bụng trắng ngà, hạt nhỏ
const SKIN_D = '#7b7a45'; // da lưng nâu ô liu
const LIMB_V = '#e2d9b8';

// Viền thân đối xứng: nửa trên đi từ mõm ra sau
const HALF = [[0.015, -0.06], [0.05, -0.12], [0.1, -0.165], [0.17, -0.2], [0.24, -0.215], [0.3, -0.214], [0.35, -0.2], [0.42, -0.205], [0.52, -0.225], [0.64, -0.235], [0.76, -0.22], [0.86, -0.18], [0.93, -0.12], [0.975, -0.06]];
const TRUNK = [[0, 0], ...HALF, [1.0, 0], ...mirror(HALF).reverse()];

function limbs(c) {
  const arm = [
    tube([[0.42, -0.18], [0.39, -0.27], [0.36, -0.33]], [0.036, 0.033, 0.03], { c, h: 0.05 }),
    tube([[0.36, -0.33], [0.31, -0.37], [0.26, -0.39]], [0.03, 0.026, 0.022], { c }),
    blob([[0.28, -0.37], [0.26, -0.42], [0.22, -0.42], [0.21, -0.38], [0.24, -0.36]], { c, h: 0.02 }),
    ...[[0.165, -0.365], [0.17, -0.425], [0.2, -0.462], [0.242, -0.468]].map((t) => tube([[0.24, -0.395], [(0.24 + t[0]) / 2, (-0.395 + t[1]) / 2], t], [0.01, 0.008, 0.0055], { c })),
  ];
  const toes = [[1.6, -0.16], [1.65, -0.21], [1.67, -0.28], [1.64, -0.35], [1.58, -0.39]];
  const leg = [
    tube([[0.93, -0.08], [1.01, -0.23], [1.08, -0.35]], [0.065, 0.055, 0.045], { c, h: 0.07 }),
    tube([[1.08, -0.35], [1.19, -0.28], [1.3, -0.2]], [0.044, 0.036, 0.027], { c }),
    tube([[1.3, -0.2], [1.38, -0.23], [1.46, -0.26]], [0.026, 0.022, 0.02], { c }),
    // Màng da giữa các ngón chân (ếch đồng có màng bơi rộng)
    blob([[1.46, -0.26], ...toes, [1.51, -0.3]], { c: '#d8cfae', op: 0.75, h: 0.004 }),
    ...toes.map((t) => tube([[1.46, -0.26], [(1.46 + t[0]) / 2, (-0.26 + t[1]) / 2], t], [0.01, 0.008, 0.0055], { c })),
  ];
  return pair([...arm, ...leg]);
}

// Hình phóng to khoang miệng khi banh miệng (chỉ trên hình SVG): hàm trên ở nửa trên, hàm dưới ở nửa dưới, mõm quay ra
// ngoài, góc hàm ở giữa. Toạ độ cục bộ (−1…1) quanh tâm bong bóng.
const BC = [0.62, -0.555];
const BR = 0.135;
const B = (u, v) => [BC[0] + u * BR, BC[1] + v * BR];
const Bpts = (pts) => pts.map(([u, v]) => B(u, v));

export default function frog(f = {}) {
  const male = Boolean(f.male);
  const R = rng(17);
  const ventral = [
    // Nhìn từ bụng vẫn thấy mép da lưng sẫm ở hai bên và đôi mắt lồi ra hai bên đầu
    ...pair([blob(ellipse(0.17, -0.19, 0.045, 0.034, -0.3, 9), { c: '#6f6c3c', h: 0.05, gloss: 0.6, only: 'svg' })]),
    blob(TRUNK.map(([x, y]) => [x - 0.004, y * 1.045]), { c: '#6f6c3c', h: 0.17, only: 'svg' }),
    blob(TRUNK, { c: SKIN_V, tex: 'gran', texOp: 0.5, h: 0.18, gloss: 0.3 }),
    // Viền hàm dưới và nếp da họng
    line([[0.28, -0.195], [0.17, -0.17], [0.08, -0.12], [0.03, -0.06], [0.02, 0], [0.03, 0.06], [0.08, 0.12], [0.17, 0.17], [0.28, 0.195]], 0.0035, { c: '#cbbf9a', only: 'svg' }),
    line([[0.33, -0.17], [0.345, 0], [0.33, 0.17]], 0.0025, { c: '#d6cba8', only: 'svg' }),
    // Ếch đực có đôi túi kêu màu xám hai bên họng
    ...(male ? pair([blob([[0.15, -0.12], [0.21, -0.18], [0.29, -0.17], [0.29, -0.11], [0.21, -0.1]], { c: '#9a958a', op: 0.55, h: 0.002, only: 'svg' })]) : []),
  ];
  // Mặt lưng (đặt sai mặt): da nâu ô liu có đốm sẫm và các gờ da dọc lưng
  const spots = Array.from({ length: 22 }, () => { const x = 0.3 + R() * 0.63; const w = 0.2 * Math.sin(Math.PI * Math.min(1, x)); return [x, (R() - 0.5) * 2 * w * 0.9, 0.012 + R() * 0.018]; });
  const dorsal = [
    blob(TRUNK, { c: SKIN_D, tex: 'gran', texOp: 0.6, h: 0.18, gloss: 0.4 }),
    dots(spots, { c: '#3d3a22', flatFill: true, op: 0.8, sw: 0, only: 'svg' }),
    ...pair([line([[0.33, -0.1], [0.55, -0.11], [0.85, -0.08]], 0.006, { c: '#5f5d33', only: 'svg' })]),
    ...pair([blob(ellipse(0.25, -0.155, 0.026, 0.026), { c: '#5d5534', h: 0.004, only: 'svg' })]),
    ...pair([blob(ellipse(0.165, -0.12, 0.038, 0.032), { c: '#d7b45a', h: 0.03, gloss: 1, z: 0.17 }), dots([[0.165, -0.12, 0.015]], { c: '#141210', only: 'svg' })]),
  ];

  const cavity = blob([[0.28, 0], [0.3, -0.11], [0.38, -0.165], [0.55, -0.19], [0.75, -0.185], [0.9, -0.14], [0.965, -0.06], [0.98, 0], [0.965, 0.06], [0.9, 0.14], [0.75, 0.185], [0.55, 0.19], [0.38, 0.165], [0.3, 0.11]], { c: '#4a2b2a', h: 0.002, gloss: 0.2 });
  // Vạt da lật ra hai bên (mặt trong trắng hồng) và vạt cơ bụng cắt lệch đường giữa
  const skinFlap = blob([[0.28, 0.16], [0.32, 0.27], [0.45, 0.32], [0.62, 0.335], [0.78, 0.32], [0.9, 0.27], [0.96, 0.15], [0.88, 0.17], [0.66, 0.22], [0.42, 0.2]], { c: '#ecd3c9', h: 0.006, gloss: 0.3 });
  const muscleFlap = blob([[0.3, 0.13], [0.33, 0.2], [0.45, 0.245], [0.63, 0.255], [0.8, 0.24], [0.91, 0.2], [0.96, 0.11], [0.86, 0.15], [0.64, 0.19], [0.42, 0.17]], { c: '#c8877d', tex: 'str', texOp: 0.8, h: 0.01, gloss: 0.4 });
  const girdle = blob([[0.28, 0.1], [0.315, 0.115], [0.345, 0.18], [0.32, 0.2], [0.29, 0.15]], { c: '#efe8da', h: 0.012, gloss: 0.6 });
  const flaps = [...pair([skinFlap, muscleFlap, girdle]),
    // Tĩnh mạch bụng chạy dọc mép vạt cơ bên phải (cắt lệch sang trái đường giữa nên tĩnh mạch còn nguyên)
    tube([[0.34, 0.2], [0.48, 0.24], [0.64, 0.247], [0.8, 0.228], [0.91, 0.18], [0.95, 0.12]], 0.006, { c: '#5b1622', gloss: 0.8 })];
  const deep = [
    tube([[0.4, -0.004], [0.56, -0.005], [0.74, -0.004], [0.9, -0.002]], 0.009, { c: '#b8434b', gloss: 0.6 }),
    tube([[0.42, 0.016], [0.58, 0.018], [0.76, 0.016], [0.88, 0.012]], 0.011, { c: '#4b2a4a', gloss: 0.6 }),
  ];

  // Mạng mao mạch ở mặt trong vạt da: nhánh từ mép gấp toả ra mép ngoài
  const net = [];
  for (const [i, x] of [0.38, 0.5, 0.62, 0.74, 0.85].entries()) {
    for (const v of vessels([x, 0.255 + 0.01 * Math.sin(i)], Math.PI / 2 + (i - 2) * 0.12, { len: 0.03, depth: 4, spread: 0.7, seed: 30 + i, shrink: 0.7 })) net.push(v);
  }
  const capNet = net.flatMap((v) => [line(v.pts, 0.0016 * v.w, { c: '#b2333d', op: 0.85 })]);

  // Ruột non: tá tràng chạy ngược lên song song dạ dày rồi cuộn nhiều quai giữa bụng
  const duo = [[0.68, -0.04], [0.65, -0.012], [0.6, 0.0], [0.57, 0.035], [0.59, 0.075]];
  const intestine = [[0.59, 0.075], [0.64, 0.065], [0.68, 0.03], [0.72, 0.005], [0.77, 0.025], [0.765, 0.075], [0.71, 0.1], [0.655, 0.115], [0.68, 0.15], [0.745, 0.145], [0.8, 0.115], [0.83, 0.065], [0.81, 0.02], [0.79, -0.02], [0.82, -0.05], [0.85, -0.03], [0.85, 0.008]].map((p, i) => [...p, 0.012 + i * 0.002]);

  const organs = {
    than: { parts: pair([blob([[0.6, 0.03], [0.68, 0.025], [0.77, 0.03], [0.82, 0.045], [0.8, 0.075], [0.71, 0.08], [0.62, 0.07]], { c: '#6e1f2c', h: 0.025, gloss: 0.7 }), line([[0.64, 0.05], [0.77, 0.055]], 0.006, { c: '#d9a640', op: 0.8 }), line([[0.81, 0.06], [0.92, 0.04], [0.98, 0.012]], 0.004, { c: '#e6dccb' })]), anchor: [0.71, 0.055] },
    'tuyen-sinh-duc': male
      ? { parts: pair([blob(ellipse(0.635, 0.05, 0.033, 0.018, 0.1, 8), { c: '#efe1a6', h: 0.02, gloss: 0.8 })]), anchor: [0.635, 0.05] }
      : { parts: pair([
        ...OVARY.map(([x, y, rx, ry], i) => blob(ellipse(x, y, rx, ry, 0.3 * i, 10), { c: '#3a3430', h: 0.03, gloss: 0.3 })),
        ...eggs(R),
        tube(trochoid([0.34, 0.162], 0.6, 0.0055, 0.011), 0.0075, { c: '#f1ece2', gloss: 0.8, z: 0.03, chunk: 3 }),
        tube([[0.95, 0.16], [0.975, 0.09], [0.985, 0.02]], 0.0075, { c: '#f1ece2', gloss: 0.8, z: 0.03 }),
      ]), anchor: [0.62, 0.11] },
    phoi: { parts: pair([blob([[0.33, 0.09], [0.355, 0.15], [0.42, 0.175], [0.49, 0.165], [0.53, 0.13], [0.49, 0.1], [0.41, 0.085]], { c: '#e3928a', tex: 'alv', texOp: 0.9, h: 0.03, gloss: 0.5 })]), anchor: [0.43, 0.15] },
    'the-mo': { parts: pair([0, 1, 2, 3].map((i) => tube([[0.57 + i * 0.012, 0.09], [0.62 + i * 0.03, 0.13 + i * 0.008], [0.67 + i * 0.035, 0.155 + (i % 2) * 0.01]], [0.012, 0.011, 0.008], { c: '#ecce6b', gloss: 0.7, z: 0.01 }))), anchor: [0.69, 0.15] },
    'ruot-thang': { parts: [tube([[0.85, 0.008], [0.88, 0.0], [0.92, 0.0], [0.96, 0.0], [0.99, 0.0]], [0.026, 0.032, 0.031, 0.024, 0.014], { c: '#8a7461', gloss: 0.5, z: 0.01 })], anchor: [0.9, 0.0] },
    'bong-dai': { parts: pair([blob(ellipse(0.9, 0.045, 0.045, 0.034, 0.25, 9), { c: '#e6dce8', op: 0.6, h: 0.02, gloss: 0.9, z: 0.03 })]), anchor: [0.91, 0.05] },
    'ruot-non': { parts: [blob([[0.47, 0.0], [0.55, -0.04], [0.68, -0.045], [0.78, -0.08], [0.82, -0.02], [0.79, 0.09], [0.7, 0.16], [0.58, 0.17], [0.48, 0.11]], { c: '#efe2d2', op: 0.4, h: 0.003, only: 'svg' }),
      tube(duo, 0.017, { c: '#e3d9b2', gloss: 0.5, z: 0.012 }), tube(intestine, 0.016, { c: '#ddd4ab', gloss: 0.5, z: 0.014 }),
      ...vessels([0.72, 0.06], 0, { len: 0.035, depth: 3, spread: 1.6, seed: 4 }).map((v) => line(v.pts, 0.0015 * v.w, { c: '#b23a3c', op: 0.7, only: 'svg' }))], anchor: [0.67, 0.08] },
    lach: { parts: [blob(ellipse(0.735, -0.035, 0.019, 0.016, 0, 8), { c: '#5a1a24', h: 0.016, gloss: 0.9, z: 0.04 })], anchor: [0.735, -0.035] },
    tuy: { parts: [blob([[0.56, -0.065], [0.6, -0.08], [0.65, -0.07], [0.66, -0.04], [0.62, -0.02], [0.58, -0.01], [0.555, -0.035]], { c: '#efdcbc', tex: 'gran', texOp: 0.7, h: 0.008, z: 0.01 })], anchor: [0.61, -0.045] },
    'da-day': { parts: [tube([[0.42, -0.07], [0.5, -0.105], [0.57, -0.118], [0.63, -0.108], [0.675, -0.08], [0.68, -0.042]], [0.03, 0.036, 0.037, 0.033, 0.024, 0.017], { c: '#e9ddc8', gloss: 0.6, z: 0.012 })], anchor: [0.6, -0.115] },
    gan: { parts: [
      blob(ellipse(0.425, 0.0, 0.03, 0.02, 0, 8), { c: '#5e1d28', h: 0.03, gloss: 0.9, z: 0.025 }),
      blob([[0.37, 0.03], [0.39, 0.09], [0.44, 0.155], [0.5, 0.17], [0.55, 0.135], [0.54, 0.08], [0.49, 0.035], [0.42, 0.015]], { c: '#5e1d28', h: 0.04, gloss: 0.9, z: 0.03 }),
      blob([[0.37, -0.025], [0.385, -0.09], [0.43, -0.145], [0.49, -0.14], [0.5, -0.085], [0.465, -0.035], [0.42, -0.015]], { c: '#5e1d28', h: 0.04, gloss: 0.9, z: 0.03 }),
      blob([[0.47, -0.065], [0.49, -0.125], [0.54, -0.165], [0.6, -0.15], [0.62, -0.1], [0.58, -0.06], [0.51, -0.045]], { c: '#621f2b', h: 0.035, gloss: 0.9, z: 0.03 }),
    ], anchor: [0.48, 0.1] },
    'tui-mat': { parts: [dots([[0.475, 0.004, 0.012]], { c: '#2c5a45', z: 0.05 })], anchor: [0.475, 0.004] },
    tim: { parts: [
      blob(ellipse(0.365, 0, 0.07, 0.064, 0, 12), { c: '#efe4e2', op: 0.35, h: 0.04, only: 'svg' }),
      blob([[0.3, -0.035], [0.325, -0.05], [0.338, -0.025], [0.325, -0.006], [0.305, -0.012]], { c: '#5d1630', h: 0.03, gloss: 0.8, z: 0.03 }),
      blob([[0.3, 0.03], [0.32, 0.0], [0.338, 0.012], [0.338, 0.045], [0.315, 0.055]], { c: '#57142c', h: 0.03, gloss: 0.8, z: 0.03 }),
      blob([[0.332, -0.04], [0.37, -0.048], [0.41, -0.025], [0.432, 0.004], [0.41, 0.03], [0.37, 0.036], [0.335, 0.022]], { c: '#9b2b3e', h: 0.045, gloss: 1, z: 0.035 }),
      tube([[0.338, 0.022], [0.32, 0.012], [0.302, 0.0]], [0.011, 0.01, 0.009], { c: '#c46a74', gloss: 0.8, z: 0.06 }),
      ...pair([tube([[0.302, 0.0], [0.295, -0.022], [0.29, -0.045]], 0.006, { c: '#c46a74', z: 0.06 })]),
    ], anchor: [0.38, -0.01] },
    'mao-mach-da': { parts: [...capNet, ...capNet.map(mirrorPrim)], anchor: [0.58, 0.33] },
    huyet: { parts: [blob(ellipse(0.995, 0, 0.012, 0.02, 0, 8), { c: '#5e4a3a', h: 0.01 })], anchor: [0.995, 0] },
    // Khoang miệng phóng to: lưỡi, lỗ mũi trong, lỗ vòi Eustache
    luoi: { parts: [blob(Bpts([[-0.18, 0.92], [0.18, 0.92], [0.24, 0.55], [0.2, 0.3], [0.08, 0.22], [0.02, 0.32], [-0.02, 0.32], [-0.08, 0.22], [-0.2, 0.3], [-0.24, 0.55]]), { c: '#d98f8a', gloss: 0.7, only: 'svg' })], anchor: B(0, 0.55) },
    'lo-mui-trong': { parts: pair2([blob(Bpts(ellipse(-0.24, -0.72, 0.075, 0.05, 0.3, 8)), { c: '#2a1c1b', only: 'svg' })]), anchor: B(-0.24, -0.72) },
    'voi-eustache': { parts: pair2([blob(Bpts(ellipse(-0.62, -0.1, 0.07, 0.11, -0.4, 8)), { c: '#3a2522', only: 'svg' })]), anchor: B(-0.62, -0.1) },
  };

  // Bong bóng khoang miệng: nền hồng, vành hàm có răng hàm trên, răng lá mía, u nhãn cầu, thực quản, khe thanh quản
  const decor = [
    blob(Bpts(ellipse(0, 0, 1.0, 1.0, 0, 16)), { c: '#3a3133', edge: '#cfd5da', sw: 1.4, flatFill: true, only: 'svg' }),
    blob(Bpts([[-0.85, -0.05], [-0.78, -0.55], [-0.45, -0.9], [0, -0.98], [0.45, -0.9], [0.78, -0.55], [0.85, -0.05]]), { c: '#e9d8cf', only: 'svg' }),
    blob(Bpts([[-0.74, -0.06], [-0.68, -0.48], [-0.4, -0.8], [0, -0.87], [0.4, -0.8], [0.68, -0.48], [0.74, -0.06]]), { c: '#d6a19c', only: 'svg' }),
    dots(Array.from({ length: 19 }, (_, i) => { const a = Math.PI * (0.06 + (0.88 * i) / 18); return [...B(-Math.cos(a) * 0.79, -Math.sin(a) * 0.82 - 0.02), 0.004]; }), { c: '#fbf7ee', only: 'svg' }),
    ...[-1, 1].map((sg) => line(Bpts([[sg * 0.08, -0.62], [sg * 0.2, -0.55]]), 0.006, { c: '#fbf7ee', only: 'svg' })),
    ...[-1, 1].map((sg) => blob(Bpts(ellipse(sg * 0.3, -0.38, 0.2, 0.15, 0, 10)), { c: '#e7c3bd', gloss: 0.6, only: 'svg' })),
    blob(Bpts(ellipse(0, -0.12, 0.16, 0.06, 0, 8)), { c: '#4a2e2c', only: 'svg' }),
    blob(Bpts([[-0.85, 0.05], [-0.78, 0.55], [-0.45, 0.9], [0, 0.98], [0.45, 0.9], [0.78, 0.55], [0.85, 0.05]]), { c: '#e9d8cf', only: 'svg' }),
    blob(Bpts([[-0.74, 0.06], [-0.68, 0.48], [-0.4, 0.8], [0, 0.87], [0.4, 0.8], [0.68, 0.48], [0.74, 0.06]]), { c: '#d2a5a0', only: 'svg' }),
    blob(Bpts(ellipse(0, 0.14, 0.05, 0.08, 0, 8)), { c: '#7a4a48', only: 'svg' }),
    { t: 'text', at: B(0, 1.32), s: 'Khoang miệng (banh miệng)', size: 7.5, c: '#e8ecef', only: 'svg' },
  ];

  const body = [...limbs(LIMB_V), ...ventral];
  return {
    frame: [-0.04, 1.72, -0.72, 0.52],
    floor: 0.085,
    surface: 0.17,
    partialY: 0,
    note: 'ếch nằm ngửa nên bên phải con ếch ở phía dưới hình; hình tròn phía trên là khoang miệng khi banh miệng (hàm trên ở trên, hàm dưới có lưỡi ở dưới)',
    closed: (side) => (side === 'up' ? body : [...limbs('#8a8650'), ...dorsal]),
    opened: { body, flaps, cavity: [cavity], deep },
    decor,
    organs,
    pins: { 4: [[0.22, -0.43], [0.22, 0.43], [1.51, -0.3], [1.51, 0.3]], 2: [[0.22, -0.43], [1.51, 0.3]] },
    cut: (ln) => { const y = ln === 'side' ? 0.035 : 0; return [[0.96, y], [0.7, y], [0.45, y], [0.25, y], [0.12, y * 0.6]]; },
    spill: { c: '#8e1f24', at: [0.62, 0.02], r: [0.2, 0.12] },
  };
}

// Buồng trứng: các thuỳ chứa trứng nhỏ cực động vật đen, cực thực vật trắng
const OVARY = [[0.52, 0.075, 0.06, 0.05], [0.62, 0.11, 0.055, 0.045], [0.72, 0.085, 0.06, 0.05], [0.79, 0.05, 0.045, 0.035]];
function eggs(R) {
  const pts = [];
  for (const [x, y, rx, ry] of OVARY) for (let i = 0; i < 26; i++) { const a = R() * Math.PI * 2, r = Math.sqrt(R()) * 0.85; pts.push([x + Math.cos(a) * rx * r, y + Math.sin(a) * ry * r, 0.0085]); }
  return [dots(pts, { c: '#1d1b1a', sw: 0.3, z: 0.028 }), dots(pts.map(([x, y]) => [x + 0.002, y + 0.0035, 0.0045]), { c: '#e8dfc8', sw: 0, only: 'svg' })];
}

// Ống dẫn trứng cuộn vòng dọc hai bên: đường trochoid (b > a thì có vòng)
function trochoid([x0, y0], len, a, b) {
  const n = Math.round(len / a / 0.7);
  return Array.from({ length: n }, (_, i) => { const t = i * 0.7; return [x0 + a * t + b * Math.sin(t), y0 + b * Math.cos(t)]; });
}

// Cặp đối xứng trong bong bóng khoang miệng (đối xứng qua trục dọc của bong bóng, không phải trục thân)
function pair2(prims) {
  return [...prims, ...prims.map((p) => ({ ...p, pts: p.pts.map(([x, y]) => [2 * BC[0] - x, y]) }))];
}
