import { blob, tube, dots, line, strands, ellipse, pair, rng, vessels } from './kit.js';

// Cá chép Cyprinus carpio nằm nghiêng, thấy mặt trái, đầu bên trái, lưng ở phía trên (y < 0), bụng phía dưới. x tính
// theo chiều dài toàn thân từ mõm (0) tới mút vây đuôi (1). Tỉ lệ ngoài theo FishBase và Majeed et al. 2023 (mắt
// 0,087–0,133; nắp mang tới 0,244; vây ngực 0,246; vây bụng 0,415; vây lưng 0,409–0,698; vây hậu môn 0,607–0,679; vây
// đuôi chẻ từ 0,816; cao thân khoảng 0,28–0,3). Nội quan theo giáo trình thực hành SCNU (实验13) và SGK Sinh học 7 bài 32:
// 4 cung mang có sợi mang đỏ và lược mang; tim trong xoang bao tim ở họng giữa hai vây ngực (bầu động mạch trắng, tâm
// thất đỏ nhạt, tâm nhĩ và xoang tĩnh mạch đỏ sẫm ở phía lưng); gan tuỵ đỏ sẫm phân tán giữa các quai ruột; ruột 3 quai
// chữ U, không có dạ dày, đoạn đầu phình; túi mật xanh thẫm ở bên phải ruột trước, lẫn trong gan tuỵ nên nhìn từ bên trái
// chỉ thấy một phần; lách dài đỏ sẫm trên mặt lưng ruột trước; bóng hơi trắng bạc hai ngăn thắt ở khoảng 0,40; thận đỏ tím
// sát cột sống, rộng nhất ở chỗ thắt của bóng hơi, đầu trước phình thành thận đầu; phúc mạc màu xám có chấm sắc tố.

const BRONZE = '#b38f45';
const BACK = '#5a5a3c';
const BELLY = '#ece2bf';
const FIN = '#a8823e';

// Viền thân: lưng đi từ mõm ra đuôi, rồi bụng quay về mõm
const DORSAL = [[0.0, 0.015], [0.03, -0.035], [0.08, -0.075], [0.15, -0.11], [0.25, -0.135], [0.35, -0.148], [0.42, -0.152], [0.55, -0.138], [0.65, -0.11], [0.72, -0.08], [0.78, -0.058], [0.82, -0.05]];
const VENTRAL = [[0.82, 0.05], [0.76, 0.06], [0.68, 0.088], [0.6, 0.128], [0.52, 0.15], [0.42, 0.16], [0.3, 0.15], [0.2, 0.125], [0.11, 0.095], [0.05, 0.065], [0.015, 0.035]];
const BODY = [...DORSAL, ...VENTRAL];

function fins() {
  const rays = (base, tip, n) => Array.from({ length: n }, (_, i) => { const t = i / (n - 1); return line([[base[0][0] + (base[1][0] - base[0][0]) * t, base[0][1] + (base[1][1] - base[0][1]) * t], [tip[0][0] + (tip[1][0] - tip[0][0]) * t, tip[0][1] + (tip[1][1] - tip[0][1]) * t]], 0.0015, { c: '#7d6230', op: 0.6, only: 'svg' }); });
  return [
    // Vây đuôi chẻ hai thuỳ
    blob([[0.8, -0.05], [0.88, -0.1], [0.97, -0.16], [1.0, -0.155], [0.95, -0.08], [0.9, 0.0], [0.95, 0.085], [1.0, 0.165], [0.97, 0.17], [0.88, 0.11], [0.8, 0.05]], { c: FIN, op: 0.92, h: 0.008, gloss: 0.3 }),
    ...rays([[0.82, -0.04], [0.82, 0.04]], [[0.99, -0.155], [0.99, 0.165]], 11),
    // Vây lưng gốc dài, tia đầu là gai cứng
    blob([[0.405, -0.15], [0.425, -0.235], [0.45, -0.24], [0.52, -0.205], [0.62, -0.165], [0.7, -0.105], [0.6, -0.13], [0.5, -0.145]], { c: FIN, op: 0.9, h: 0.006, gloss: 0.3 }),
    ...rays([[0.42, -0.15], [0.69, -0.1]], [[0.43, -0.235], [0.69, -0.11]], 12),
    blob([[0.605, 0.128], [0.625, 0.2], [0.65, 0.215], [0.685, 0.17], [0.68, 0.09]], { c: FIN, op: 0.9, h: 0.006 }),
    blob([[0.415, 0.158], [0.45, 0.225], [0.49, 0.235], [0.5, 0.2], [0.46, 0.157]], { c: FIN, op: 0.9, h: 0.006 }),
  ];
}

export default function carp(f = {}) {
  const male = Boolean(f.male);
  const R = rng(31);
  const head = [
    blob([[0.0, 0.015], [0.03, -0.035], [0.08, -0.075], [0.15, -0.105], [0.22, -0.125], [0.245, -0.03], [0.24, 0.07], [0.2, 0.123], [0.11, 0.095], [0.05, 0.065], [0.015, 0.035]], { c: '#a88a4a', h: 0.12, gloss: 0.5, only: 'svg' }),
    blob(ellipse(0.11, -0.04, 0.025, 0.023, 0, 12), { c: '#c9b071', h: 0.13, gloss: 0.6, z: 0.0 }),
    dots([[0.112, -0.04, 0.014]], { c: '#121212', z: 0.12 }),
    line([[0.2, -0.085], [0.235, -0.04], [0.245, 0.02], [0.235, 0.075], [0.2, 0.12]], 0.004, { c: '#6f5a2c', only: 'svg' }),
    line([[0.0, 0.025], [0.03, 0.03]], 0.004, { c: '#5a4426', only: 'svg' }),
    // Hai đôi râu: râu mõm ngắn, râu hàm dài hơn
    tube([[0.01, 0.03], [0.0, 0.05], [-0.005, 0.06]], [0.003, 0.0025, 0.002], { c: '#c7a56a' }),
    tube([[0.035, 0.045], [0.03, 0.075], [0.02, 0.095]], [0.004, 0.003, 0.0025], { c: '#c7a56a' }),
  ];
  const scales = [
    blob(BODY, { c: BRONZE, tex: 'scale', texOp: 1, h: 0.12, gloss: 0.6 }),
    blob([[0.03, -0.035], [0.08, -0.075], [0.15, -0.11], [0.25, -0.135], [0.35, -0.148], [0.42, -0.152], [0.55, -0.138], [0.65, -0.11], [0.72, -0.08], [0.78, -0.058], [0.82, -0.05], [0.78, -0.03], [0.6, -0.06], [0.4, -0.08], [0.2, -0.07]], { c: BACK, op: 0.7, flatFill: true, edge: 'none', only: 'svg' }),
    blob([[0.2, 0.08], [0.4, 0.1], [0.6, 0.09], [0.68, 0.088], [0.6, 0.128], [0.52, 0.15], [0.42, 0.16], [0.3, 0.15], [0.2, 0.125]], { c: BELLY, op: 0.75, flatFill: true, edge: 'none', only: 'svg' }),
    line([[0.245, -0.012], [0.4, -0.006], [0.6, -0.002], [0.82, 0.0]], 0.0028, { c: '#4a3a1c', dash: '2 1.6', only: 'svg' }),
  ];
  const pectoral = blob([[0.248, 0.085], [0.3, 0.13], [0.345, 0.158], [0.36, 0.145], [0.31, 0.1], [0.27, 0.08]], { c: FIN, op: 0.92, h: 0.006, z: 0.12 });
  const anus = [blob(ellipse(0.595, 0.135, 0.008, 0.006, 0, 6), { c: '#d79a8e', h: 0.004, z: 0.06 }), blob(ellipse(0.606, 0.131, 0.006, 0.005, 0, 6), { c: '#c47c74', h: 0.004, z: 0.06 })];
  const outside = [...fins(), ...scales, ...head, pectoral, ...anus];

  // Mặt phải (đặt sai cũng vẫn nằm nghiêng): như mặt trái nhưng đầu bên trái nên lật dọc
  const flip = (prims) => prims.map((p) => ({ ...p, pts: p.pts && (p.t === 'dots' ? p.pts : p.pts.map(([x, y, z]) => [x, -y + 0.01, z])), lines: p.lines }));

  // Mở: bỏ nắp mang (thấy buồng mang), cắt bỏ thành bụng trái (thấy vết cắt cơ thân hình chữ W), mở xoang bao tim ở họng
  const flesh = blob([[0.24, -0.06], [0.32, -0.08], [0.45, -0.085], [0.57, -0.068], [0.625, -0.03], [0.632, 0.07], [0.6, 0.142], [0.5, 0.162], [0.38, 0.168], [0.27, 0.15], [0.235, 0.1]], { c: '#e9b9a8', tex: 'myo', texOp: 0.9, h: 0.012, gloss: 0.4 });
  const cavity = blob([[0.255, -0.04], [0.32, -0.058], [0.45, -0.063], [0.56, -0.048], [0.605, -0.018], [0.612, 0.065], [0.588, 0.128], [0.5, 0.146], [0.38, 0.152], [0.28, 0.135], [0.255, 0.09]], { c: '#8d887d', tex: 'gran', texOp: 1, h: 0.004 });
  const gillRoom = blob([[0.14, -0.055], [0.19, -0.072], [0.236, -0.035], [0.238, 0.05], [0.215, 0.07], [0.16, 0.072], [0.135, 0.02]], { c: '#6b4440', h: 0.004 });
  const pericard = blob([[0.17, 0.08], [0.235, 0.068], [0.258, 0.1], [0.24, 0.13], [0.18, 0.125]], { c: '#4a2c2c', h: 0.004 });
  const spine = tube([[0.24, -0.072], [0.4, -0.078], [0.6, -0.066]], 0.006, { c: '#e7dfcf', rings: 0.012, only: 'svg' });
  const opened = {
    body: [...fins(), ...scales, ...head.slice(1), pectoral, ...anus],
    flaps: [flesh],
    cavity: [cavity, gillRoom, pericard, spine],
    deep: [],
  };

  // Cung mang: 4 cung cong lõm về trước, sợi mang đỏ phía sau, lược mang trắng phía trước
  const arches = [];
  for (let i = 3; i >= 0; i--) {
    const x0 = 0.15 + i * 0.019;
    const arc = [[x0 + 0.005, -0.06], [x0 + 0.03, -0.035], [x0 + 0.04, 0.005], [x0 + 0.032, 0.045], [x0 + 0.01, 0.065]];
    const fil = [];
    for (let k = 0; k <= 16; k++) {
      const t = k / 16;
      const p = [arc[0][0] + (arc[4][0] - arc[0][0]) * t + Math.sin(Math.PI * t) * 0.033, arc[0][1] + (arc[4][1] - arc[0][1]) * t];
      fil.push([p, [p[0] + 0.016 + R() * 0.004, p[1] + (t - 0.5) * 0.012]]);
    }
    arches.push(strands(fil, 0.0018, { c: i === 0 ? '#c8232c' : '#a51c25' }), tube(arc, 0.0035, { c: '#e8dccb', gloss: 0.6 }));
    arches.push(...[0.15, 0.35, 0.55, 0.75].map((t) => line([[arc[0][0] + (arc[4][0] - arc[0][0]) * t + Math.sin(Math.PI * t) * 0.033 - 0.002, arc[0][1] + (arc[4][1] - arc[0][1]) * t], [arc[0][0] + (arc[4][0] - arc[0][0]) * t + Math.sin(Math.PI * t) * 0.033 - 0.009, arc[0][1] + (arc[4][1] - arc[0][1]) * t]], 0.002, { c: '#efe6d6', only: 'svg' })));
  }

  // Ruột 3 quai chữ U: đoạn đầu phình (bóng ruột), 2/3 trước to, 1/3 sau nhỏ dần tới hậu môn
  const gut = [[0.27, 0.06], [0.31, 0.068], [0.36, 0.064], [0.44, 0.06], [0.51, 0.066], [0.53, 0.09], [0.5, 0.103], [0.42, 0.098], [0.34, 0.1], [0.3, 0.117], [0.32, 0.134], [0.4, 0.136], [0.48, 0.134], [0.55, 0.124], [0.575, 0.1], [0.57, 0.07], [0.58, 0.05], [0.6, 0.075], [0.6, 0.11], [0.595, 0.133]].map((p, i) => [...p, 0.02 + i * 0.002]);
  const fat = Array.from({ length: 9 }, () => { const x = 0.3 + R() * 0.26, y = 0.07 + R() * 0.07; return blob(ellipse(x, y, 0.012 + R() * 0.01, 0.007 + R() * 0.005, R() * 3, 7), { c: '#f0e2b6', tex: 'fat', h: 0.008, z: 0.03, only: 'svg' }); });
  const liverBits = [[0.29, 0.088, 0.03, 0.016], [0.33, 0.082, 0.025, 0.012], [0.46, 0.082, 0.04, 0.013], [0.39, 0.118, 0.04, 0.012], [0.52, 0.112, 0.025, 0.01], [0.45, 0.148, 0.03, 0.008], [0.56, 0.087, 0.012, 0.016]];

  const organs = {
    than: { parts: [blob([[0.235, -0.07], [0.255, -0.035], [0.275, -0.03], [0.3, -0.052], [0.4, -0.05], [0.45, -0.052], [0.55, -0.05], [0.6, -0.045], [0.6, -0.058], [0.45, -0.066], [0.4, -0.068], [0.3, -0.066], [0.26, -0.074]], { c: '#6a2040', h: 0.02, gloss: 0.6 })], anchor: [0.48, -0.058] },
    'bong-hoi': { parts: [
      blob(ellipse(0.325, -0.008, 0.066, 0.04, -0.04, 12), { c: '#e9eae6', h: 0.06, gloss: 1, z: 0.01 }),
      blob([[0.405, -0.02], [0.44, -0.038], [0.5, -0.038], [0.56, -0.026], [0.59, -0.012], [0.56, 0.004], [0.5, 0.016], [0.44, 0.02], [0.405, 0.008]], { c: '#e6e7e2', h: 0.05, gloss: 1, z: 0.01 }),
      tube([[0.42, 0.02], [0.38, 0.04], [0.33, 0.052], [0.3, 0.058]], 0.0035, { c: '#e9e4da', z: 0.02 }),
      ...vessels([0.33, -0.01], 0.3, { len: 0.03, depth: 3, spread: 1.4, seed: 5 }).map((v) => line(v.pts, 0.0012 * v.w, { c: '#b4413f', op: 0.7, only: 'svg' })),
      ...vessels([0.48, -0.01], -0.2, { len: 0.035, depth: 3, spread: 1.4, seed: 6 }).map((v) => line(v.pts, 0.0012 * v.w, { c: '#b4413f', op: 0.7, only: 'svg' })),
    ], anchor: [0.33, -0.02] },
    gan: { parts: liverBits.map(([x, y, rx, ry], i) => blob(ellipse(x, y, rx, ry, (i - 3) * 0.15, 8), { c: '#6e2a22', h: 0.02, gloss: 0.7, z: 0.015 })), anchor: [0.46, 0.082] },
    'tui-mat': { parts: [blob(ellipse(0.3, 0.08, 0.011, 0.009, 0.3, 8), { c: '#2d5a3a', h: 0.02, gloss: 1, z: 0.012 })], anchor: [0.3, 0.08] },
    ruot: { parts: [tube(gut, [0.012, 0.016, 0.015, 0.013, 0.012, 0.012, 0.011, 0.011, 0.011, 0.01, 0.01, 0.0095, 0.009, 0.009, 0.0085, 0.008, 0.008, 0.0075, 0.007, 0.006], { c: '#d6b4a4', gloss: 0.6, chunk: 3 }), ...fat], anchor: [0.4, 0.1] },
    lach: { parts: [blob([[0.33, 0.045], [0.37, 0.04], [0.42, 0.042], [0.43, 0.05], [0.38, 0.053], [0.34, 0.053]], { c: '#5a1520', h: 0.012, gloss: 0.9, z: 0.05 })], anchor: [0.39, 0.047] },
    'tuyen-sinh-duc': male
      ? { parts: [blob([[0.3, 0.025], [0.36, 0.02], [0.46, 0.022], [0.55, 0.028], [0.58, 0.04], [0.5, 0.045], [0.4, 0.043], [0.32, 0.04]], { c: '#f1ece0', h: 0.02, gloss: 0.7, z: 0.04 })], anchor: [0.45, 0.032] }
      : { parts: [blob([[0.29, 0.03], [0.34, 0.018], [0.45, 0.02], [0.55, 0.025], [0.59, 0.045], [0.56, 0.065], [0.45, 0.07], [0.35, 0.066], [0.3, 0.055]], { c: '#e6b33a', tex: 'gran', texOp: 1, h: 0.04, gloss: 0.6, z: 0.04 })], anchor: [0.45, 0.045] },
    tim: { parts: [
      blob(ellipse(0.232, 0.085, 0.016, 0.01, 0, 8), { c: '#6a1a22', h: 0.015, gloss: 0.7 }),
      blob(ellipse(0.218, 0.09, 0.02, 0.013, -0.2, 8), { c: '#7a1d24', h: 0.02, gloss: 0.8 }),
      blob([[0.2, 0.1], [0.215, 0.093], [0.235, 0.1], [0.24, 0.112], [0.22, 0.12], [0.2, 0.115]], { c: '#c8615c', h: 0.025, gloss: 1, z: 0.005 }),
      blob([[0.175, 0.097], [0.2, 0.096], [0.205, 0.108], [0.18, 0.11]], { c: '#efe7dd', h: 0.02, gloss: 0.8, z: 0.005 }),
      tube([[0.175, 0.103], [0.16, 0.098], [0.15, 0.085]], 0.003, { c: '#efe7dd' }),
    ], anchor: [0.215, 0.105] },
    mang: { parts: arches, anchor: [0.18, 0.0] },
  };
  return {
    skin: 'tissue', // vây, đầu không vảy: mặt mô trơn (vảy có vân riêng)
    frame: [-0.03, 1.03, -0.27, 0.25],
    partialY: 0.02,
    partialCover: { c: BRONZE, tex: 'scale' },
    floor: 0.05,
    surface: 0.12,
    openScale: 0.55,
    note: 'cá nằm nghiêng, thấy mặt trái; túi mật nằm bên phải ruột trước nên chỉ thấy một phần',
    closed: (side) => (side === 'up' ? outside : flip(outside)),
    opened,
    organs,
    pins: { 4: [[0.12, -0.12], [0.12, 0.13], [0.86, -0.13], [0.86, 0.14]], 2: [[0.12, 0.0], [0.86, 0.0]] },
    cut: (ln) => (ln === 'side' ? [[0.59, 0.1], [0.42, 0.11], [0.26, 0.1], [0.255, 0.0], [0.26, -0.04]] : [[0.59, 0.135], [0.42, 0.155], [0.27, 0.14], [0.25, 0.06], [0.255, -0.04]]),
    spill: { c: '#4f8a3a', at: [0.4, 0.09], r: [0.13, 0.05] },
  };
}
