import { blob, tube, dots, line, strands, ellipse, pair, rng, tubeOutline } from './kit.js';

// Giun đất Pheretima nằm sấp, đầu bên trái, đã cắt dọc giữa lưng và ghim hai mép; bên phải con giun ở phía trên hình.
// x từ mút đầu (0) tới mút đuôi (1); cơ thể khoảng 110 đốt, đốt s nằm trong [(s − 1)/110, s/110]. Vị trí theo đốt
// (Bahl 1919, 1921; NCERT Sinh học 11 bản 2006; nguồn bahl trong data/dissection.json): hạch não đốt 3, hầu 3–4,
// thực quản 5–7, mề 8–9, dạ dày 9–14, ruột từ đốt 15, đôi ruột tịt mọc ở đốt 26 chĩa về trước tới đốt 22; tim bên ở đốt
// 7, 9 (bên trái to hơn), 12, 13; túi nhận tinh 4 đôi ở đốt 6–9; túi tinh 2 đôi ở đốt 11–12; đai sinh dục đốt 14–16;
// vách ngăn đầu tiên ở 4/5, các vách 5/6–10/11 dày, thiếu một vách 8/9 hoặc 9/10. Hình SVG chỉ vẽ phóng to khoảng 30
// đốt đầu; mẫu 3D trên khay đủ cả con.

const N = 110;
const S = (k) => (k - 0.5) / N; // tâm đốt k
const B = (k) => k / N; // ranh giới sau đốt k
const SKIN = '#b9776e';
// Bán kính thân theo x: đầu thon, giữa đều, đuôi thon và hơi dẹt
const R = [[0, 0.012], [0.02, 0.03], [0.06, 0.04], [0.15, 0.043], [0.5, 0.041], [0.85, 0.038], [0.97, 0.025], [1.0, 0.012]];
const rAt = (x) => { for (let i = 1; i < R.length; i++) if (x <= R[i][0]) { const t = (x - R[i - 1][0]) / (R[i][0] - R[i - 1][0]); return R[i - 1][1] + (R[i][1] - R[i - 1][1]) * t; } return 0.012; };
const AXIS = Array.from({ length: 41 }, (_, i) => [i / 40, 0]);

export default function earthworm(f = {}) {
  const rnd = rng(53);
  // Thân: ống tròn cho 3D; trên hình SVG là khối có bóng và rãnh giữa các đốt
  const body = (c, x0 = 0, x1 = 1) => {
    const ax = AXIS.filter(([x]) => x >= x0 - 1e-9 && x <= x1 + 1e-9);
    return [
      tube(ax, ax.map(([x]) => rAt(x)), { c, gloss: 0.8, flat: 0.75, only: '3d' }),
      blob(tubeOutline(ax, ax.map(([x]) => rAt(x)), 4), { c, gloss: 0.9, only: 'svg' }),
      ...Array.from({ length: N }, (_, k) => k + 1).filter((k) => B(k) > x0 && B(k) < Math.min(x1, 0.31)).map((k) => line([[B(k), -rAt(B(k)) * 0.93], [B(k) + 0.0012, 0], [B(k), rAt(B(k)) * 0.93]], 0.0016, { c: '#7f4a44', op: 0.55, only: 'svg' })),
    ];
  };
  const band = (y0, y1) => { const ym = (y0 + y1) / 2; return blob([[B(13), y0], [S(14), y0], [S(15), y0], [B(16), y0], [B(16) + 0.001, ym], [B(16), y1], [S(15), y1], [S(14), y1], [B(13), y1], [B(13) - 0.001, ym]], { c: '#8d5a52', gloss: 0.6, h: 0.09, z: 0.0 }); };
  const clitellum = band(-rAt(B(14)) * 1.04, rAt(B(14)) * 1.04);
  const dorsalStripe = line([[0.01, 0], [0.5, 0], [0.97, 0]], 0.006, { c: '#7c3a38', op: 0.6, only: 'svg' });
  const prostomium = blob(ellipse(0.004, 0, 0.007, 0.008, 0, 8), { c: '#c48b82', h: 0.02, z: 0.012 });
  const dorsal = [...body(SKIN), dorsalStripe, prostomium];
  // Mặt bụng: lỗ sinh dục cái ở đốt 14, đôi lỗ sinh dục đực ở đốt 18, nhú sinh dục ở đốt 17 và 19
  const ventral = [...body('#c99790'), clitellum, prostomium, dots([[S(14), 0, 0.003]], { c: '#4a2a28', z: 0.06 }), ...pair([dots([[S(18), -0.015, 0.004]], { c: '#5a3430', z: 0.06 }), dots([[S(17), -0.008, 0.0025], [S(19), -0.008, 0.0025]], { c: '#e9cdc4', z: 0.06 })])];

  // Phanh: hai vạt thành cơ thể ghim nghiêng ra ngoài so le, mặt trong hồng xám có gốc vách ngăn; đuôi giữ nguyên
  const flapEdge = (k) => Array.from({ length: 30 }, (_, i) => { const x = 0.015 + (i / 29) * 0.875; return [x, -(rAt(x) + 0.03 + (i % 2 ? 0.006 : 0))]; });
  const flapTop = blob([[0.015, -0.012], ...flapEdge(0), [0.89, -0.02], [0.89, -0.01], [0.5, -0.03], [0.1, -0.03]], { c: '#d8b0a8', h: 0.006, gloss: 0.4 });
  const flaps = pair([flapTop, ...Array.from({ length: 28 }, (_, i) => line([[0.02 + (i / 27) * 0.86, -rAt(0.02 + (i / 27) * 0.86) * 0.95], [0.02 + (i / 27) * 0.86, -rAt(0.02 + (i / 27) * 0.86) - 0.02]], 0.002, { c: '#b88a82', only: 'svg' }))]);
  // Đinh ghim dọc hai mép, so le
  const flapPins = [];
  for (let i = 0; i < 8; i++) { const x = 0.03 + i * 0.035 + (i % 2) * 0.017; flapPins.push(x); }
  const pinHeads = pair([...flapPins.map((x) => line([[x, -(rAt(x) + 0.026)], [x - 0.004, -(rAt(x) + 0.034)]], 0.0016, { c: '#d4dade', only: 'svg' })), dots(flapPins.map((x) => [x - 0.004, -(rAt(x) + 0.034), 0.0035]), { c: '#e2574c', z: 0.03 })]);
  const rest = [...body(SKIN, 0.88, 1), prostomium];
  const cavity = blob(tubeOutline([[0.012, 0], [0.1, 0], [0.5, 0], [0.89, 0]], [0.026, 0.034, 0.033, 0.03], 4), { c: '#7d5250', h: 0.004, gloss: 0.3 });
  // Vách ngăn giữa các đốt: vách 5/6 tới 10/11 dày (thiếu vách 8/9)
  const septa = Array.from({ length: 34 }, (_, i) => i + 4).filter((k) => k !== 8).map((k) => line([[B(k), -0.03], [B(k), 0.03]], k >= 5 && k <= 10 ? 0.0028 : 0.0014, { c: '#e8cfc8', op: k >= 5 && k <= 10 ? 0.85 : 0.5, only: 'svg' }));
  const nerveCord = tube([[S(4), 0], [0.3, 0], [0.6, 0], [0.88, 0]], 0.003, { c: '#f4efe0' });

  // Ruột: dạ dày hẹp đốt 9–14, rồi ruột phình thành túi theo từng đốt, phủ mô vàng
  const gutAxis = Array.from({ length: 36 }, (_, i) => [B(14) + (i / 35) * (0.95 - B(14)), 0]);
  const organs = {
    'chuoi-hach': { parts: [nerveCord, dots(Array.from({ length: 30 }, (_, i) => [S(5 + i * 3), 0, 0.006]), { c: '#f6f1e3' }), ...pair([tube([[S(3), 0.004], [S(3) + 0.004, -0.012], [S(4), -0.004]], 0.0018, { c: '#f4efe0' })]), blob(ellipse(S(4), 0, 0.005, 0.007, 0, 8), { c: '#f6f1e3', h: 0.006 })], anchor: [S(20), 0] },
    'tui-nhan-tinh': { parts: pair([6, 7, 8, 9].map((k) => blob(ellipse(S(k), -0.027, 0.0035, 0.006, 0.2, 8), { c: '#efe7d6', h: 0.008, gloss: 0.8 }))), anchor: [S(7), -0.027] },
    'tui-tinh': { parts: pair([11, 12].map((k) => blob([[B(k - 1) + 0.001, -0.012], [S(k), -0.01], [B(k) - 0.001, -0.013], [B(k) - 0.0005, -0.026], [S(k) + 0.002, -0.031], [B(k - 1) + 0.002, -0.027]], { c: '#f4efe3', tex: 'gran', texOp: 0.5, h: 0.016, gloss: 0.8 }))), anchor: [S(11), -0.022] },
    ruot: { parts: [
      tube([[B(9), 0], [S(12), 0], [B(14), 0]], [0.009, 0.01, 0.011], { c: '#d79a8e', gloss: 0.6, z: 0.004 }),
      tube(gutAxis, gutAxis.map(() => 0.02), { c: '#c99a4a', tex: 'chl', texOp: 0.9, rings: 1 / N, gloss: 0.6, z: 0.004 }),
    ], anchor: [S(18), 0.012] },
    'ruot-tit': { parts: pair([tube([[B(25) + 0.004, -0.017], [S(24), -0.021], [S(22), -0.02]], [0.0045, 0.0036, 0.0018], { c: '#c9a25a', tex: 'chl', texOp: 0.6, gloss: 0.7, z: 0.01 })]), anchor: [S(24), -0.021] },
    // Mề hình trống ở đúng đốt 8–9, rộng gần bằng khoang
    'da-day': { parts: [blob([[B(7), 0], [B(7) + 0.0008, -0.015], [S(8), -0.018], [B(9) - 0.0008, -0.015], [B(9), 0], [B(9) - 0.0008, 0.015], [S(8), 0.018], [B(7) + 0.0008, 0.015]], { c: '#e8a49a', h: 0.03, gloss: 1, z: 0.004 })], anchor: [S(8), 0] },
    dieu: { parts: [tube([[B(5), 0], [S(6), 0], [S(7), 0]], [0.006, 0.0085, 0.01], { c: '#e6a688', gloss: 0.6, z: 0.004 })], anchor: [S(6), 0] },
    'thuc-quan': { parts: [tube([[B(4), 0], [S(5), 0]], 0.0055, { c: '#e0896c', gloss: 0.6, z: 0.004 })], anchor: [S(5), 0] },
    hau: { parts: [
      strands(Array.from({ length: 14 }, (_, i) => { const a = (i / 13) * Math.PI - Math.PI / 2; const sg = i % 2 ? 1 : -1; return [[S(3.5), sg * 0.006], [S(3.5) + Math.sin(a) * 0.008, sg * (0.012 + rnd() * 0.012)]]; }), 0.0012, { c: '#f2e6dc' }),
      blob(ellipse(S(3.5), 0, 0.011, 0.012, 0, 10), { c: '#d99a95', tex: 'str', texOp: 0.6, h: 0.02, gloss: 0.7, z: 0.004 }),
    ], anchor: [S(3.5), 0.006] },
    tim: { parts: [
      ...[7, 12, 13].flatMap((k) => pair([tube([[S(k), -0.006], [S(k) - 0.003, -0.014], [S(k) + 0.001, -0.021]], 0.0017, { c: '#9e2424', gloss: 0.8, z: 0.02 })])),
      tube([[S(9), -0.006], [S(9) - 0.003, -0.014], [S(9) + 0.001, -0.02]], 0.0015, { c: '#9e2424', gloss: 0.8, z: 0.02 }),
      tube([[S(9), 0.006], [S(9) - 0.004, 0.015], [S(9) + 0.001, 0.023]], 0.0023, { c: '#9e2424', gloss: 0.8, z: 0.02 }),
    ], anchor: [S(12), -0.016] },
    'mach-lung': { parts: [tube([[S(4), 0], [S(10), 0], [0.3, 0], [0.6, 0], [0.95, 0]], 0.0028, { c: '#c4302b', gloss: 0.8, z: 0.03 })], anchor: [S(28), 0] },
    'hach-nao': { parts: pair([dots([[S(3), -0.004, 0.0045]], { c: '#f1ead2', z: 0.03 })]), anchor: [S(3), -0.004] },
    // Đai: khi đã mổ chỉ còn hai dải sẫm trên hai vạt thành cơ thể
    dai: { parts: f.open ? pair([band(-rAt(B(14)) - 0.028, -rAt(B(14)) * 0.95)]) : [clitellum], anchor: f.open ? [S(15), -rAt(B(14)) - 0.014] : [S(15), 0.02] },
  };
  const brk = [S(31.5), S(32.5)];
  return {
    skin: 'tissue', // da ẩm trơn, rãnh đốt vẽ riêng
    frame: [-0.012, 0.3, -0.105, 0.105],
    floor: 0.03,
    surface: 0.07,
    openScale: 0.45,
    center: [0.5, 0],
    note: 'giun nằm sấp nên bên phải con giun ở phía trên hình; hình chỉ vẽ phóng to khoảng 30 đốt đầu, phần sau còn dài gấp ba',
    closed: (side) => (side === 'up' ? dorsal : ventral),
    opened: { body: rest, flaps: [...flaps, ...pinHeads], cavity: [cavity, ...septa], deep: [] },
    decor: [line([[brk[0], -0.075], [brk[1], -0.04], [brk[0], 0], [brk[1], 0.04], [brk[0], 0.075]], 0.003, { c: '#e8ecef', op: 0.9, smooth: false, only: 'svg' }), { t: 'text', at: [0.245, 0.095], s: 'còn tiếp khoảng 80 đốt →', size: 7, c: '#e8ecef', only: 'svg' }],
    organs,
    pins: { 4: [[0.004, -0.05], [0.004, 0.05], [0.985, -0.04], [0.985, 0.04]], 2: [[0.002, 0.0], [0.99, 0.0]] },
    cut: () => [[0.89, 0], [0.5, 0], [0.1, 0], [0.012, 0]],
    spill: { c: '#6b5440', at: [0.2, 0.0], r: [0.08, 0.035] },
  };
}
