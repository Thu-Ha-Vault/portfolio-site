import { blob, tube, dots, line, ellipse, pair, rng } from './kit.js';

// Ốc bươu (họ Ampullariidae) đã bỏ vỏ, chân áp xuống khay, đầu bên trái, tháp nội tạng xoắn ở phía sau; bên phải con ốc ở
// phía trên hình (y < 0). x từ mõm (0) tới mép sau của thận (1). Vị trí đo trên hình 1 của Rodriguez et al. 2018 (PeerJ
// 6:e5789, Pomacea canaliculata) và Hayes et al. 2015 (nguồn rodriguez2018, hayes2015 trong data/dissection.json):
// mép màng áo 0,19; phổi là túi kín 0,28–0,63 chiếm phần lớn trần xoang áo bên trái và giữa; mang là dải hình chữ L từ góc
// trước phải chạy dọc mép phải phổi rồi vòng theo mép sau phổi sang trái; trực tràng dọc mép phải 0,34–0,86, hậu môn ở
// khoảng 0,25 bên phải; osphradium khoảng 0,25 bên trái cạnh lỗ phổi; xoang bao tim 0,59–0,72 ở góc trước trái của thận;
// thận 0,69–1; tháp nội tạng chứa tuyến tiêu hoá nâu sẫm ánh lục xoắn về bên phải và hơi ra sau, tuyến sinh dục là lớp ở
// các vòng trên cùng. Ống thở là thuỳ gáy trái; thuỳ gáy phải là nếp ngắn.

const W = 0.22; // nửa bề rộng ứng với vị trí ngang ±1 trong bài báo
const L = (lat) => -lat * W; // bên phải con ốc (lat > 0) ở phía trên hình
const FOOT = '#4a4540';

export default function snail(f = {}) {
  const male = Boolean(f.male);
  const R = rng(71);
  // Chân rộng lấm tấm hạt sáng; đầu có mõm, 2 đôi tua (tua môi ngắn, tua đầu dài), mắt trên cuống ngắn ở gốc tua đầu
  const foot = blob([[0.0, 0], [0.04, L(0.9)], [0.15, L(1.3)], [0.35, L(1.45)], [0.6, L(1.45)], [0.85, L(1.3)], [1.02, L(0.8)], [1.06, 0], [1.02, L(-0.8)], [0.85, L(-1.3)], [0.6, L(-1.45)], [0.35, L(-1.45)], [0.15, L(-1.3)], [0.04, L(-0.9)]], { c: FOOT, tex: 'gran', texOp: 0.8, h: 0.08, gloss: 0.4 });
  const footSpots = dots(Array.from({ length: 70 }, () => { const a = R() * Math.PI * 2, r = 0.75 + R() * 0.22; return [0.53 + Math.cos(a) * 0.5 * r, Math.sin(a) * 0.3 * r, 0.004]; }), { c: '#8a8070', flatFill: true, sw: 0, op: 0.7, only: 'svg' });
  const head = blob([[-0.075, 0], [-0.06, L(0.32)], [-0.01, L(0.55)], [0.07, L(0.66)], [0.15, L(0.66)], [0.21, L(0.5)], [0.21, L(-0.5)], [0.15, L(-0.66)], [0.07, L(-0.66)], [-0.01, L(-0.55)], [-0.06, L(-0.32)]], { c: '#57514a', tex: 'gran', texOp: 0.7, h: 0.1, gloss: 0.5 });
  const tentacles = pair([
    tube([[0.1, L(0.35)], [0.0, L(0.7)], [-0.12, L(1.0)], [-0.22, L(1.15)]], [0.014, 0.011, 0.007, 0.003], { c: '#5d574f', gloss: 0.5, z: 0.08 }),
    tube([[-0.04, L(0.2)], [-0.1, L(0.35)], [-0.15, L(0.45)]], [0.012, 0.009, 0.005], { c: '#5d574f', gloss: 0.5, z: 0.08 }),
    tube([[0.12, L(0.4)], [0.13, L(0.5)]], 0.008, { c: '#5d574f', z: 0.08 }),
    dots([[0.135, L(0.52), 0.009]], { c: '#141210', z: 0.09 }),
  ]);
  // Ống thở (thuỳ gáy trái) dài, cuộn lại khi bỏ vỏ; thuỳ gáy phải ngắn
  const siphon = tube([[0.2, L(-0.55)], [0.18, L(-0.85)], [0.12, L(-1.0)], [0.08, L(-0.9)]], [0.03, 0.026, 0.02, 0.012], { c: '#625b52', gloss: 0.4, z: 0.08 });
  const nuchal = blob(ellipse(0.2, L(0.62), 0.03, 0.022, 0.4, 8), { c: '#625b52', h: 0.03, z: 0.08 });
  // Màng áo phủ xoang áo; tháp nội tạng xoắn về bên phải
  // Vòng xoắn cuối (khối nội tạng lớn nhất) bo tròn, liền với tháp xoắn ở phía sau bên phải
  const WHORL = [[0.17, 0], [0.19, L(0.95)], [0.3, L(1.15)], [0.48, L(1.24)], [0.66, L(1.18)], [0.78, L(1.0)], [0.92, L(0.82)], [1.02, L(0.45)], [1.04, L(-0.15)], [0.97, L(-0.65)], [0.82, L(-0.95)], [0.62, L(-1.07)], [0.4, L(-1.07)], [0.22, L(-0.95)]];
  const bodyWhorl = blob(WHORL, { c: '#7d7363', tex: 'gran', texOp: 0.5, h: 0.14, gloss: 0.6 });
  const mantle = blob([[0.17, 0], [0.19, L(0.95)], [0.3, L(1.12)], [0.48, L(1.2)], [0.64, L(1.12)], [0.72, L(0.9)], [0.74, L(0.0)], [0.7, L(-0.9)], [0.58, L(-1.03)], [0.4, L(-1.04)], [0.22, L(-0.93)]], { c: '#958a78', op: 0.92, tex: 'gran', texOp: 0.5, h: 0.15, gloss: 0.7 });
  const mantleEdge = tube([[0.2, L(0.95)], [0.17, L(0.4)], [0.16, 0], [0.17, L(-0.4)], [0.21, L(-0.93)]], 0.012, { c: '#3e3a35', gloss: 0.4, z: 0.12 });
  const sutures = [line([[0.74, L(1.05)], [0.86, L(0.92)], [0.98, L(0.6)], [1.0, L(0.1)]], 0.004, { c: '#3d3628', op: 0.6, only: 'svg' })];
  const whorls = [[0.82, L(0.9), 0.17, 0.135], [0.86, L(1.05), 0.12, 0.1], [0.88, L(1.17), 0.075, 0.065], [0.885, L(1.27), 0.04, 0.035]];
  const spire = whorls.map(([x, y, rx, ry], i) => blob(ellipse(x, y, rx, ry, 0.5, 12), { c: i ? '#5b5232' : '#615737', h: 0.12 + i * 0.01, gloss: 0.6, z: i * 0.015, tex3d: 'shell' }));
  const oper = (op) => [blob(ellipse(0.92, L(-1.0), 0.09, 0.07, 0.3, 14), { c: '#6e6458', h: 0.012, gloss: 0.7, z: 0.08, op }), ...[0.75, 0.5, 0.25].map((k) => blob(ellipse(0.92 - 0.02 * (1 - k), L(-1.0) - 0.01 * (1 - k), 0.09 * k, 0.07 * k, 0.3, 12), { c: '#7a7064', h: 0.002, z: 0.09, only: 'svg', op }))];
  const outside = [foot, footSpots, ...tentacles, head, siphon, nuchal, bodyWhorl, ...sutures, mantle, mantleEdge, ...spire];
  const under = [foot, footSpots, ...tentacles, head, line([[0.0, 0], [0.04, 0]], 0.006, { c: '#2a2622', only: 'svg' })];

  // Mở: rạch màng áo theo mép, banh sang hai bên; thấy trần xoang áo với phổi, mang, trực tràng, osphradium; khối nội tạng
  const mantleFlaps = [blob([[0.2, L(0.98)], [0.3, L(1.15)], [0.48, L(1.24)], [0.64, L(1.16)], [0.6, L(1.36)], [0.42, L(1.42)], [0.26, L(1.32)]], { c: '#958a78', tex: 'gran', texOp: 0.5, h: 0.02, gloss: 0.5 }), blob([[0.22, L(-0.95)], [0.4, L(-1.07)], [0.6, L(-1.06)], [0.72, L(-0.92)], [0.68, L(-1.15)], [0.45, L(-1.3)], [0.26, L(-1.22)]], { c: '#958a78', tex: 'gran', texOp: 0.5, h: 0.02, gloss: 0.5 })];
  const roof = blob([[0.17, 0], [0.19, L(0.92)], [0.3, L(1.08)], [0.48, L(1.14)], [0.63, L(1.06)], [0.71, L(0.86)], [0.73, L(0.0)], [0.69, L(-0.86)], [0.58, L(-0.98)], [0.4, L(-0.99)], [0.22, L(-0.9)]], { c: '#d3c8b8', h: 0.006, gloss: 0.3 });
  const opened = { body: [foot, footSpots, ...tentacles, head, siphon, nuchal, bodyWhorl, ...sutures, ...spire.slice(1)], flaps: mantleFlaps, cavity: [roof, mantleEdge], deep: [] };

  // Mang: một hàng lá hình tam giác dọc trục chữ L
  const gillAxis = [[0.31, L(0.58)], [0.4, L(0.62)], [0.5, L(0.6)], [0.6, L(0.55)], [0.66, L(0.3)], [0.66, L(0.0)], [0.64, L(-0.3)], [0.62, L(-0.55)]];
  const lamellae = [];
  for (let i = 0; i < gillAxis.length - 1; i++) {
    const [a, b] = [gillAxis[i], gillAxis[i + 1]];
    for (let k = 0; k < 5; k++) {
      const t = k / 5, x = a[0] + (b[0] - a[0]) * t, y = a[1] + (b[1] - a[1]) * t;
      const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy);
      const nx = -dy / l, ny = dx / l;
      lamellae.push(blob([[x - dx / l * 0.007, y - dy / l * 0.007], [x + nx * 0.03, y + ny * 0.03], [x + dx / l * 0.007, y + dy / l * 0.007]], { c: '#c9a99a', h: 0.006, z: 0.006, edge: '#8a6a5e' }));
    }
  }
  const coils = [[0.66, L(0.35)], [0.7, L(0.15)], [0.75, L(0.3)], [0.72, L(0.45)], [0.77, L(0.5)], [0.82, L(0.35)], [0.8, L(0.15)], [0.84, L(0.2)]];
  const organs = {
    'khoi-mieng': { parts: [blob(ellipse(0.065, 0, 0.05, 0.035, 0, 10), { c: '#e7b9b0', h: 0.03, gloss: 0.6, z: 0.07 }), blob(ellipse(0.09, L(0.25), 0.02, 0.012, 0.3, 8), { c: '#e8913c', h: 0.01, z: 0.08 }), blob(ellipse(0.09, L(-0.25), 0.02, 0.012, -0.3, 8), { c: '#e8913c', h: 0.01, z: 0.08 })], anchor: [0.06, 0] },
    phoi: { parts: [blob([[0.28, L(0.3)], [0.33, L(0.48)], [0.45, L(0.5)], [0.57, L(0.45)], [0.63, L(0.2)], [0.63, L(-0.3)], [0.58, L(-0.68)], [0.45, L(-0.76)], [0.32, L(-0.7)], [0.28, L(-0.3)]], { c: '#d9cfc7', op: 0.85, h: 0.03, gloss: 0.6 }),
      ...[[0.3, L(-0.2)], [0.4, L(0.2)], [0.5, L(-0.4)]].flatMap((r0, i) => (i, [line([[r0[0], r0[1]], [r0[0] + 0.05, r0[1] + 0.02], [r0[0] + 0.1, r0[1] - 0.01]], 0.003, { c: '#b45a5a', op: 0.7, only: 'svg' }), line([[r0[0] + 0.05, r0[1] + 0.02], [r0[0] + 0.07, r0[1] + 0.05]], 0.002, { c: '#b45a5a', op: 0.7, only: 'svg' })])),
      blob(ellipse(0.3, L(-0.62), 0.02, 0.012, 0.3, 8), { c: '#3a302c', h: 0.004, z: 0.03 })], anchor: [0.45, L(-0.2)] },
    mang: { parts: [tube(gillAxis, 0.005, { c: '#a8887c', z: 0.006 }), ...lamellae], anchor: [0.45, L(0.62)] },
    'ong-tieu-hoa': { parts: [
      tube([[0.86, L(0.8)], [0.7, L(0.85)], [0.55, L(0.83)], [0.42, L(0.8)], [0.3, L(0.72)], [0.25, L(0.6)]], [0.022, 0.024, 0.022, 0.02, 0.017, 0.012], { c: '#d9b45c', gloss: 0.6, z: 0.02 }),
      dots([[0.8, L(0.81), 0.012], [0.68, L(0.85), 0.012], [0.56, L(0.83), 0.011], [0.44, L(0.8), 0.01], [0.33, L(0.73), 0.009]], { c: '#7a5a2e', z: 0.035 }),
      blob(ellipse(0.66, L(0.62), 0.04, 0.03, 0.4, 10), { c: '#efe8dc', h: 0.03, gloss: 0.8, z: 0.03 }),
      tube(coils, 0.011, { c: '#efe8dc', gloss: 0.7, z: 0.035 }),
      blob(ellipse(0.25, L(0.6), 0.01, 0.008, 0, 6), { c: '#6a5030', h: 0.006, z: 0.03, only: 'svg' }),
    ], anchor: [0.5, L(0.82)] },
    tim: { parts: [blob(ellipse(0.655, L(-0.52), 0.065, 0.05, 0, 10), { c: '#e9dcd2', op: 0.55, h: 0.03, z: 0.01 }), blob(ellipse(0.635, L(-0.5), 0.028, 0.022, 0.3, 8), { c: '#c08a80', h: 0.03, gloss: 0.8, z: 0.02 }), blob(ellipse(0.68, L(-0.55), 0.026, 0.02, -0.3, 8), { c: '#b8726a', h: 0.03, gloss: 0.9, z: 0.02 })], anchor: [0.66, L(-0.52)] },
    than: { parts: [blob([[0.69, L(0.45)], [0.8, L(0.5)], [0.92, L(0.45)], [1.0, L(0.2)], [1.0, L(-0.35)], [0.9, L(-0.62)], [0.76, L(-0.69)], [0.72, L(-0.4)], [0.7, 0]], { c: '#7b5a3c', tex: 'lob', texOp: 0.8, h: 0.04, gloss: 0.5 }), tube([[0.62, L(0.4)], [0.68, L(0.0)], [0.7, L(-0.3)]], 0.012, { c: '#a8805a', z: 0.03 })], anchor: [0.86, L(-0.2)] },
    'gan-tuy': { parts: [blob(ellipse(0.82, L(0.9), 0.17, 0.135, 0.5, 12), { c: '#5b5232', tex: 'gran', texOp: 0.7, h: 0.13, gloss: 0.6 }), blob(ellipse(0.86, L(1.05), 0.12, 0.1, 0.5, 12), { c: '#544b2e', tex: 'gran', texOp: 0.7, h: 0.14, gloss: 0.6, z: 0.015 }), line([[0.72, L(0.95)], [0.8, L(1.2)], [0.92, L(1.12)], [0.94, L(0.92)]], 0.003, { c: '#2f2a1a', op: 0.6, only: 'svg' })], anchor: [0.8, L(0.85)] },
    'tuyen-sinh-duc': { parts: [blob(ellipse(0.88, L(1.17), 0.075, 0.065, 0.5, 12), { c: male ? '#ece0b6' : '#e89a3c', tex: 'gran', texOp: 0.6, h: 0.15, gloss: 0.6, z: 0.03 }), blob(ellipse(0.885, L(1.27), 0.04, 0.035, 0.5, 10), { c: male ? '#f1e8c6' : '#efab55', h: 0.16, gloss: 0.6, z: 0.05 })], anchor: [0.88, L(1.2)] },
    // Chân và tua đầu đã vẽ cùng thân; ở đây chỉ là vùng để chọn và viền nổi
    chan: { parts: [{ ...foot, op: 0, only: 'svg' }], anchor: [0.45, L(-1.3)] },
    'nap-mieng': { parts: oper(f.open ? 0.9 : 1), anchor: [0.92, L(-1.0)] },
    'xuc-tu': { parts: [tube([[0.1, L(0.35)], [0.0, L(0.7)], [-0.12, L(1.0)], [-0.22, L(1.15)]], [0.014, 0.011, 0.007, 0.003], { c: '#5d574f', gloss: 0.5, z: 0.08, only: 'svg' })], anchor: [-0.05, L(0.85)] },
  };
  if (male) organs['ong-tieu-hoa'].parts.push(tube([[0.3, L(0.85)], [0.24, L(0.8)], [0.18, L(0.75)]], [0.014, 0.012, 0.008], { c: '#cfa98a', z: 0.03 }));
  return {
    frame: [-0.27, 1.12, -0.37, 0.37],
    floor: 0.08,
    surface: 0.14,
    openScale: 0.6,
    note: 'ốc đã bỏ vỏ, chân áp xuống khay nên bên phải con ốc ở phía trên hình',
    closed: (side) => (side === 'up' ? outside : under),
    opened,
    organs,
    pins: { 4: [[0.1, L(1.3)], [0.1, L(-1.3)], [0.95, L(1.1)], [0.95, L(-1.1)]], 2: [[0.05, L(1.0)], [1.0, L(-0.6)]] },
    cut: (ln) => (ln === 'side' ? [[0.72, L(-0.85)], [0.45, L(-0.98)], [0.2, L(-0.92)], [0.18, L(0.2)]] : [[0.72, 0], [0.45, 0], [0.19, 0]]),
    spill: { c: '#a68b5c', at: [0.78, L(0.8)], r: [0.12, 0.08] },
  };
}
