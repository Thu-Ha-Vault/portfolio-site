import { blob, tube, dots, line, strands, ellipse, pair, mirror, rng } from './kit.js';

// Tôm sông Macrobrachium nằm sấp, đã bỏ mai và các tấm lưng bụng, đầu (chuỷ) bên trái; bên phải con tôm ở phía trên hình
// (y < 0). x từ mút chuỷ (0) tới mút đốt đuôi (1). Theo giáo trình thực hành SCNU (实验9, tôm càng Macrobrachium),
// FAO (New 2002), Bauer (Univ. Louisiana) và SGK Sinh học 7 bài 23: chuỷ có răng, hốc mắt khoảng 0,2 (loài tôm càng sông
// chuỷ ngắn hơn tôm càng xanh); giáp đầu ngực tới khoảng 0,45; bụng 6 đốt, tấm bên đốt 2 chờm lên đốt 1 và 3; đuôi
// gồm đốt đuôi và đôi chân đuôi. Bên trong: dạ dày tim lớn ở trước (có tấm kitin, không có răng nghiền), dạ dày môn vị nhỏ
// được tuyến gan hai thuỳ màu nâu vàng bao quanh; tim hình tam giác đỉnh hướng ra trước, màu trắng vàng, 3 đôi lỗ tim,
// nằm trong xoang bao tim ở phía lưng sau giáp đầu ngực; buồng trứng chín màu cam nằm trên tuyến gan; 8 lá mang mỗi bên
// dạng tấm xếp hai hàng trên trục (phyllobranchia), lớn dần về phía sau; ruột thẳng dọc lưng phần bụng tới hậu môn ở gốc
// đốt đuôi; cơ gấp bụng rất lớn; hạch não, vòng thần kinh hầu, khối hạch ngực, chuỗi thần kinh bụng 6 hạch ở mặt bụng.

const SHELL = '#9fb3a8';
const SHELL_D = '#7f948a';

// Nửa trên của giáp đầu ngực và bụng (bề rộng theo từng mốc x)
const CT = [[0.2, -0.05], [0.25, -0.075], [0.32, -0.088], [0.4, -0.09], [0.45, -0.085]];
const SEG = [0.45, 0.52, 0.6, 0.67, 0.74, 0.8, 0.88];
const SEGW = [0.08, 0.087, 0.075, 0.066, 0.056, 0.046];

export default function shrimp(f = {}) {
  const male = Boolean(f.male);
  const R = rng(41);
  const carapace = blob([[0.19, 0], ...CT, [0.46, -0.06], [0.46, 0.06], ...mirror(CT).reverse()], { c: SHELL, h: 0.09, gloss: 0.7 });
  // Chuỷ có răng trên mép lưng
  const rostrum = blob([[0.0, 0.0], [0.05, -0.008], [0.12, -0.014], [0.2, -0.02], [0.22, 0.0], [0.2, 0.02], [0.12, 0.012], [0.05, 0.006]], { c: SHELL_D, h: 0.02, gloss: 0.6, z: 0.07 });
  const teeth = dots(Array.from({ length: 10 }, (_, i) => [0.04 + i * 0.016, -0.012 - i * 0.0007, 0.0035]), { c: '#6d8178', only: 'svg' });
  const segs = SEG.slice(0, 6).map((x0, i) => blob([[x0 - 0.008, 0], [x0, -SEGW[i] * 0.95], [(x0 + SEG[i + 1]) / 2, -SEGW[i]], [SEG[i + 1] + (i === 1 ? 0.012 : 0.004), -SEGW[i] * 0.92], [SEG[i + 1] + 0.006, 0], [SEG[i + 1] + (i === 1 ? 0.012 : 0.004), SEGW[i] * 0.92], [(x0 + SEG[i + 1]) / 2, SEGW[i]], [x0, SEGW[i] * 0.95]], { c: i % 2 ? SHELL : '#a6b9ae', h: 0.08 - i * 0.008, gloss: 0.7 }));
  const tail = [
    ...pair([blob([[0.86, -0.02], [0.92, -0.06], [1.0, -0.075], [1.0, -0.045], [0.93, -0.02]], { c: '#93a89d', op: 0.92, h: 0.008, gloss: 0.5 })]),
    blob([[0.86, 0], [0.9, -0.025], [1.0, -0.012], [1.0, 0.012], [0.9, 0.025]], { c: SHELL_D, h: 0.012, gloss: 0.6 }),
  ];
  const eyes = pair([tube([[0.195, -0.02], [0.2, -0.045]], 0.008, { c: SHELL_D, z: 0.05 }), dots([[0.2, -0.052, 0.012]], { c: '#2a2420', z: 0.05 })]);
  const scales = pair([blob([[0.11, -0.03], [0.15, -0.045], [0.2, -0.04], [0.19, -0.028]], { c: '#b7c6be', op: 0.85, h: 0.006, z: 0.05 })]);
  const antenna = pair([
    tube([[0.18, -0.025], [0.1, -0.05], [0.0, -0.09], [-0.055, -0.15], [-0.03, -0.215], [0.1, -0.245], [0.3, -0.25]], 0.0018, { c: '#7d8f86' }),
    ...[0, 1, 2].map((k) => tube([[0.17, -0.012], [0.08, -0.018 - k * 0.006], [-0.02 - k * 0.015, -0.03 - k * 0.014]], 0.0014, { c: '#8a9c93' })),
  ]);
  // Chân ngực: đôi 2 là càng lớn chĩa ra trước (tôm càng), các đôi sau xoè ngang ra sau
  const leg = (root, pts, r) => tube([root, ...pts], r, { c: '#8fa49a', gloss: 0.4 });
  const claw = (p) => [blob([[p[0] + 0.01, p[1]], [p[0] - 0.025, p[1] - 0.012], [p[0] - 0.055, p[1] - 0.004], [p[0] - 0.03, p[1] + 0.005], [p[0] - 0.005, p[1] + 0.01]], { c: '#7d9289', h: 0.012, gloss: 0.6 })];
  const legs = pair([
    leg([0.3, -0.07], [[0.22, -0.12], [0.16, -0.14]], [0.006, 0.005, 0.004]),
    leg([0.33, -0.08], [[0.28, -0.15], [0.18, -0.2], [0.06, -0.21]], [0.011, 0.01, 0.009, 0.008]), ...claw([0.06, -0.21]),
    leg([0.36, -0.085], [[0.37, -0.15], [0.33, -0.21]], [0.006, 0.005, 0.004]),
    leg([0.39, -0.088], [[0.42, -0.16], [0.41, -0.22]], [0.006, 0.005, 0.004]),
    leg([0.42, -0.086], [[0.47, -0.15], [0.5, -0.2]], [0.006, 0.005, 0.004]),
    leg([0.445, -0.08], [[0.52, -0.13], [0.58, -0.17]], [0.006, 0.005, 0.004]),
    ...[0.49, 0.56, 0.63, 0.7, 0.77].map((x) => tube([[x, -0.05], [x + 0.03, -0.085]], 0.005, { c: '#b3c3ba', op: 0.85 })),
  ]);
  const stripes = SEG.slice(0, 6).map((x0, i) => line([[x0 + 0.01, -SEGW[i] * 0.6], [(x0 + SEG[i + 1]) / 2, -SEGW[i] * 0.75], [SEG[i + 1], -SEGW[i] * 0.55]], 0.003, { c: '#5f736a', op: 0.6, only: 'svg' }));
  const outside = [...antenna, ...legs, ...tail, ...segs, carapace, rostrum, teeth, ...eyes, ...scales, ...stripes, line([[0.27, -0.06], [0.3, 0], [0.27, 0.06]], 0.003, { c: '#6f8379', only: 'svg' })];
  const under = [...antenna, ...legs, ...tail, ...segs.map((p) => ({ ...p, c: '#c5d1c9' })), { ...carapace, c: '#b9c8bf' }, rostrum, ...eyes];

  // Mở: còn chuỷ, mắt, râu, chân, đuôi và mép giáp, mép tấm bên các đốt bụng
  const rims = [
    blob([[0.2, -0.05], [0.25, -0.075], [0.32, -0.088], [0.4, -0.09], [0.45, -0.085], [0.45, -0.07], [0.4, -0.074], [0.32, -0.072], [0.25, -0.06], [0.21, -0.04]], { c: SHELL, h: 0.04, gloss: 0.6 }),
    ...SEG.slice(0, 6).map((x0, i) => blob([[x0, -SEGW[i] * 0.95], [(x0 + SEG[i + 1]) / 2, -SEGW[i]], [SEG[i + 1], -SEGW[i] * 0.92], [SEG[i + 1], -SEGW[i] * 0.72], [x0, -SEGW[i] * 0.75]], { c: i % 2 ? SHELL : '#a6b9ae', h: 0.04, gloss: 0.6 })),
  ];
  const opened = {
    body: [...antenna, ...legs, ...tail, rostrum, teeth, ...eyes, ...scales],
    flaps: pair(rims),
    cavity: [blob([[0.2, 0], [0.22, -0.045], [0.3, -0.072], [0.45, -0.074], [0.52, -0.07], [0.67, -0.05], [0.8, -0.035], [0.87, -0.02], [0.88, 0], [0.87, 0.02], [0.8, 0.035], [0.67, 0.05], [0.52, 0.07], [0.45, 0.074], [0.3, 0.072], [0.22, 0.045]], { c: '#4a4a40', h: 0.003 })],
    deep: [],
  };

  // Lá mang: 8 tấm hình lưỡi liềm mỗi bên, lớn dần về sau, mỗi tấm có vân phiến mang
  const gills = [];
  for (let i = 0; i < 8; i++) {
    const x = 0.26 + i * 0.023;
    const w = 0.012 + i * 0.002;
    const y0 = -0.058 - i * 0.002, y1 = -0.088 - i * 0.0015;
    gills.push(blob([[x - w, y0], [x, y0 - 0.004], [x + w, y0], [x + w * 0.8, y1], [x, y1 - 0.006], [x - w * 0.8, y1]], { c: '#e4e0d6', h: 0.012, gloss: 0.4, z: 0.004 + i * 0.001 }));
    gills.push(...[0.25, 0.5, 0.75].map((t) => line([[x - w + 2 * w * t, y0 - 0.002], [x - w * 0.8 + 1.6 * w * t, y1 - 0.002]], 0.0012, { c: '#b9b1a3', only: 'svg' })));
  }
  const abdomenMuscle = (dy) => blob([[0.45, -0.065 + dy], [0.52, -0.068 + dy], [0.6, -0.06 + dy], [0.67, -0.052 + dy], [0.74, -0.044 + dy], [0.8, -0.036 + dy], [0.86, -0.024 + dy], [0.87, dy], [0.86, 0.024 + dy], [0.8, 0.036 + dy], [0.74, 0.044 + dy], [0.67, 0.052 + dy], [0.6, 0.06 + dy], [0.52, 0.068 + dy], [0.45, 0.065 + dy]], { c: '#efe3d6', tex: 'strx', texOp: 1, h: 0.05, gloss: 0.5 });
  const muscleRings = SEG.slice(1, 6).map((x) => line([[x, -0.05], [x + 0.008, 0], [x, 0.05]], 0.003, { c: '#d9c7b5', only: 'svg' }));
  const ganglia = [0.485, 0.56, 0.635, 0.705, 0.77, 0.835];

  const organs = {
    'hach-nao': { parts: [blob([[0.198, 0], [0.203, -0.01], [0.214, -0.008], [0.214, 0.008], [0.203, 0.01]], { c: '#f4efe0', h: 0.008, gloss: 0.6 })], anchor: [0.207, 0] },
    'vong-hau': { parts: pair([tube([[0.212, -0.006], [0.225, -0.014], [0.24, -0.012], [0.25, -0.004]], 0.0022, { c: '#f4efe0' })]), anchor: [0.23, -0.013] },
    'chuoi-nguc': { parts: [blob([[0.25, 0], [0.26, -0.012], [0.3, -0.016], [0.36, -0.016], [0.41, -0.01], [0.42, 0], [0.41, 0.01], [0.36, 0.016], [0.3, 0.016], [0.26, 0.012]], { c: '#f4efe0', tex: 'gran', texOp: 0.6, h: 0.01, gloss: 0.6 })], anchor: [0.33, 0.0] },
    'chuoi-bung': { parts: [tube([[0.42, 0], [0.6, 0], [0.75, 0], [0.86, 0]], 0.0025, { c: '#f4efe0' }), dots(ganglia.map((x) => [x, 0, 0.006]), { c: '#f6f1e3' })], anchor: [0.63, 0] },
    'co-bung': f.removed
      ? { parts: [abdomenMuscle(-0.012), abdomenMuscle(0.012)].map((p, k) => ({ ...p, pts: p.pts.map(([x, y]) => [x, k ? Math.max(0.008, y) : Math.min(-0.008, y)]) })), anchor: [0.6, -0.04] }
      : { parts: [abdomenMuscle(0), ...muscleRings], anchor: [0.6, -0.04] },
    mang: { parts: pair(gills), anchor: [0.36, -0.075] },
    'tuyen-gan': { parts: pair([blob([[0.285, -0.004], [0.3, -0.045], [0.34, -0.066], [0.39, -0.06], [0.415, -0.03], [0.405, -0.004]], { c: '#a0702e', tex: 'gran', texOp: 0.9, h: 0.035, gloss: 0.5 })]), anchor: [0.36, 0.04] },
    'tuyen-sinh-duc': male
      ? { parts: pair([tube([[0.3, -0.02], [0.34, -0.016], [0.37, -0.006], [0.38, 0]], 0.005, { c: '#f2efe6', gloss: 0.6, z: 0.035 })]), anchor: [0.34, -0.016] }
      : { parts: [blob([[0.27, 0], [0.29, -0.03], [0.33, -0.042], [0.38, -0.035], [0.4, 0], [0.38, 0.035], [0.33, 0.042], [0.29, 0.03]], { c: '#e8812a', tex: 'gran', texOp: 1, h: 0.03, gloss: 0.6, z: 0.035 })], anchor: [0.33, 0.03] },
    'da-day': { parts: [blob([[0.205, 0], [0.215, -0.03], [0.245, -0.042], [0.28, -0.038], [0.3, -0.018], [0.305, 0], [0.3, 0.018], [0.28, 0.038], [0.245, 0.042], [0.215, 0.03]], { c: '#9a8f80', op: 0.9, h: 0.04, gloss: 0.9 }), line([[0.23, -0.02], [0.27, -0.025], [0.29, -0.01]], 0.003, { c: '#5b5144', only: 'svg' }), line([[0.23, 0.02], [0.27, 0.025], [0.29, 0.01]], 0.003, { c: '#5b5144', only: 'svg' })], anchor: [0.25, -0.03] },
    ruot: { parts: [tube([[0.3, 0], [0.36, 0], [0.45, 0.0], [0.6, 0.0], [0.75, 0.0], [0.86, 0.0], [0.895, 0.0]], [0.006, 0.005, 0.0055, 0.0055, 0.005, 0.006, 0.007], { c: '#5a4a3a', gloss: 0.5, z: 0.05 }), line([[0.44, -0.012], [0.6, -0.01], [0.75, -0.009], [0.86, -0.008]], 0.002, { c: '#e9c9bd', only: 'svg' })], anchor: [0.7, 0.0] },
    tim: { parts: [
      blob([[0.36, 0], [0.38, -0.034], [0.445, -0.03], [0.45, 0], [0.445, 0.03], [0.38, 0.034]], { c: '#e7e0d2', op: 0.45, h: 0.02, only: 'svg' }),
      blob([[0.375, 0], [0.43, -0.024], [0.44, 0], [0.43, 0.024]], { c: '#efe2bf', h: 0.025, gloss: 0.9, z: 0.05 }),
      dots(pair([dots([[0.415, -0.012, 0.0035], [0.425, -0.006, 0.003], [0.402, -0.006, 0.003]])]).flatMap((d) => d.pts), { c: '#8a7a58', z: 0.07 }),
      tube([[0.375, 0], [0.33, 0], [0.26, 0.0]], 0.002, { c: '#e9c9bd', z: 0.06 }),
    ], anchor: [0.415, 0.01] },
  };
  return {
    skin: 'chit', // vân da ngoài của mẫu 3D (src/scene/textures.js)
    frame: [-0.08, 1.03, -0.26, 0.26],
    stretch: 1.35,
    floor: 0.04,
    surface: 0.09,
    openScale: 0.5,
    note: 'tôm nằm sấp nên bên phải con tôm ở phía trên hình; lá mang dạng tấm xếp, nhìn tổng thể giống lông chim',
    closed: (side) => (side === 'up' ? outside : under),
    opened,
    organs,
    pins: { 4: [[0.24, -0.1], [0.24, 0.1], [0.8, -0.07], [0.8, 0.07]], 2: [[0.24, 0.0], [0.86, 0.0]] },
    cut: (ln) => { const y = ln === 'side' ? 0.06 : 0; return [[0.88, y * 0.4], [0.7, y * 0.7], [0.5, y], [0.3, y], [0.21, y * 0.5]]; },
    spill: { c: '#6e5a48', at: [0.42, 0.0], r: [0.1, 0.06] },
  };
}
