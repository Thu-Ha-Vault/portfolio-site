import * as THREE from 'three';
import { mats, tint, box, cyl, put } from './materials.js';

// Mô hình low-poly của từng máy trong Khu máy móc: vài khối đặc trưng (nắp, màn hình, khay, cột, chai) đặt trong
// đúng kích thước model thật (w × d × h trong MACHINES_3D, layout.js). Hình dạng theo các hình cận cảnh trong figures/;
// tỉ lệ từng phần là ước lượng. Máy chưa có công thức thì vẽ khối hộp như trước. Mặt trước hướng +z.

const SCREEN = '#5f86a3';
const DARK = '#3a4652';
const LIGHT = '#eef1f4';
const GREY = '#cfd6dc';

// Mỗi công thức nhận (g, m) với g là Group gốc tại tâm đáy máy, m là định nghĩa trong MACHINES_3D
const RECIPES = {
  // Bio-Rad T100: thân dưới, nắp nghiêng phía sau, màn hình cảm ứng trên mặt dốc phía trước
  pcr(g, { w, d, h }) {
    put(g, box(w, h * 0.55, d, tint(LIGHT)), 0, 0, 0);
    const lid = put(g, box(w * 0.94, h * 0.45, d * 0.62, tint(GREY)), 0, h * 0.55, -d * 0.18);
    lid.rotation.x = -0.05;
    const scr = put(g, box(w * 0.6, 0.008, d * 0.22, tint(SCREEN), false), 0, h * 0.55, d * 0.3);
    scr.rotation.x = 0.5;
  },
  // Bio-Rad CFX96: khối máy, nắp trượt tối màu trên đỉnh, màn hình nghiêng phía trước
  qpcr(g, { w, d, h }) {
    put(g, box(w, h * 0.82, d, tint(LIGHT)), 0, 0, 0);
    put(g, box(w * 0.92, h * 0.18, d * 0.7, tint(DARK)), 0, h * 0.82, -d * 0.12);
    const scr = put(g, box(w * 0.55, h * 0.3, 0.01, tint(SCREEN), false), 0, h * 0.4, d / 2 + 0.006);
    scr.rotation.x = -0.2;
  },
  // Bio-Rad Gel Doc EZ: buồng tối, cửa trước, khe khay UV
  geldoc(g, { w, d, h }) {
    put(g, box(w, h, d, tint(DARK)), 0, 0, 0);
    put(g, box(w * 0.8, h * 0.55, 0.012, tint('#2a333c')), 0, h * 0.12, d / 2 + 0.006);
    put(g, box(w * 0.7, 0.02, 0.01, tint(SCREEN), false), 0, h * 0.78, d / 2 + 0.006);
  },
  // Shimadzu UV-1900i: thân thấp rộng, buồng mẫu nhô ở giữa, màn hình bên phải
  spectro(g, { w, d, h }) {
    put(g, box(w, h * 0.7, d, tint(LIGHT)), 0, 0, 0);
    put(g, box(w * 0.36, h * 0.3, d * 0.6, tint(GREY)), -w * 0.12, h * 0.7, -d * 0.05);
    const scr = put(g, box(w * 0.28, 0.01, d * 0.3, tint(SCREEN), false), w * 0.3, h * 0.7, d * 0.18);
    scr.rotation.x = 0.4;
  },
  // Olympus CX23: đế, thân cong (cột), mâm kính, đầu quan sát hai thị kính
  microscope(g, { w, d, h }) {
    put(g, box(w, h * 0.12, d, tint(LIGHT)), 0, 0, 0);
    put(g, box(w * 0.5, h * 0.75, d * 0.25, tint(LIGHT)), 0, h * 0.12, -d * 0.33);
    put(g, box(w * 0.85, h * 0.03, d * 0.5, tint(DARK)), 0, h * 0.42, d * 0.05);
    put(g, cyl(w * 0.07, w * 0.07, h * 0.18, tint(DARK), { seg: 10 }), 0, h * 0.2, d * 0.05);
    const head = put(g, box(w * 0.55, h * 0.12, d * 0.35, tint(LIGHT)), 0, h * 0.78, -d * 0.12);
    for (const s of [-1, 1]) {
      const eye = put(head.parent, cyl(w * 0.06, w * 0.06, h * 0.14, tint(DARK), { seg: 10 }), s * w * 0.12, h * 0.85, d * 0.12);
      eye.rotation.x = -0.6;
    }
  },
  // Vortex-Genie 2 (đế trụ, đầu cốc) và Spectrafuge Mini (khối phụ, nắp tròn)
  vortex(g, { w, d, h, extra }) {
    put(g, box(w, h * 0.75, d, tint(LIGHT)), 0, 0, 0);
    put(g, cyl(w * 0.3, w * 0.35, h * 0.25, tint(DARK), { seg: 16 }), 0, h * 0.75, 0);
    put(g, box(extra.w, extra.h * 0.6, extra.d, tint(extra.color)), extra.dx, 0, 0);
    put(g, cyl(extra.w * 0.45, extra.w * 0.45, extra.h * 0.4, tint(SCREEN, { transparent: true, opacity: 0.7 }), { seg: 20 }), extra.dx, extra.h * 0.6, 0);
  },
  // Agilent 1260 Infinity II: chồng module (khay chai, bơm, bộ tiêm mẫu, buồng cột, detector)
  hplc(g, { w, d, h }) {
    const parts = [0.2, 0.2, 0.22, 0.16, 0.12];
    let y = 0;
    parts.forEach((k, i) => {
      put(g, box(w, h * k - 0.006, d, tint(i % 2 ? GREY : LIGHT)), 0, y, 0);
      put(g, box(w * 0.3, 0.012, 0.006, tint(SCREEN), false), -w * 0.25, y + h * k * 0.6, d / 2 + 0.004);
      y += h * k;
    });
    put(g, box(w * 0.95, h * 0.03, d * 0.9, tint(GREY)), 0, y, 0);
    for (let i = 0; i < 4; i++) put(g, cyl(0.035, 0.035, h * 0.06, tint('#9fc6e0', { transparent: true, opacity: 0.6 }), { seg: 12 }), -w * 0.33 + i * w * 0.22, y + h * 0.03, 0);
  },
  // Eppendorf 5425: thân thấp, nắp vòm trên đỉnh, bảng điều khiển phía trước
  centrifuge(g, { w, d, h }) {
    put(g, box(w, h * 0.7, d, tint(LIGHT)), 0, 0, 0);
    const dome = put(g, cyl(w * 0.45, w * 0.47, h * 0.3, tint(GREY), { seg: 24 }), 0, h * 0.7, -d * 0.05);
    dome.scale.z = (d * 0.85) / (w * 0.94);
    put(g, box(w * 0.6, h * 0.12, 0.01, tint(SCREEN), false), 0, h * 0.3, d / 2 + 0.005);
  },
  // Agilent BioTek Epoch 2: khối máy, khe ngăn kéo vi đĩa phía trước
  platereader(g, { w, d, h }) {
    put(g, box(w, h, d, tint(LIGHT)), 0, 0, 0);
    put(g, box(w * 0.6, h * 0.08, 0.012, tint(DARK)), -w * 0.1, h * 0.3, d / 2 + 0.006);
    put(g, box(w * 0.2, h * 0.12, 0.01, tint(SCREEN), false), w * 0.3, h * 0.55, d / 2 + 0.005);
  },
  // NanoDrop One: đế, cần bệ đo, màn hình nghiêng phía trước
  nanodrop(g, { w, d, h }) {
    put(g, box(w, h * 0.35, d, tint(LIGHT)), 0, 0, 0);
    put(g, box(w * 0.3, h * 0.6, d * 0.3, tint(LIGHT)), 0, h * 0.35, -d * 0.3);
    put(g, box(w * 0.32, h * 0.06, d * 0.55, tint(GREY)), 0, h * 0.9, -d * 0.12);
    const scr = put(g, box(w * 0.75, 0.01, d * 0.32, tint(SCREEN), false), 0, h * 0.35, d * 0.25);
    scr.rotation.x = 0.5;
  },
  // Cytiva ÄKTA pure 25: thân, mặt trước các module, khay chai trên nóc, cột lọc gel dựng đứng; bộ thu F9-C nắp trong
  fplc(g, { w, d, h, extra }) {
    put(g, box(w, h * 0.92, d, tint(LIGHT)), 0, 0, 0);
    put(g, box(w * 0.9, h * 0.75, 0.012, tint(GREY)), 0, h * 0.08, d / 2 + 0.006);
    put(g, box(w * 0.9, h * 0.08, d * 0.8, tint(GREY)), 0, h * 0.92, 0);
    for (const s of [-1, 1]) put(g, cyl(0.04, 0.04, 0.17, tint('#9fc6e0', { transparent: true, opacity: 0.6 }), { seg: 12 }), s * w * 0.18, h, 0);
    put(g, cyl(0.008, 0.008, h * 0.5, tint('#e9eef2', { transparent: true, opacity: 0.8 }), { seg: 8 }), w * 0.1, h * 0.3, d / 2 + 0.03);
    put(g, box(extra.w, extra.h * 0.45, extra.d, tint(extra.color)), extra.dx, 0, 0);
    put(g, box(extra.w * 0.96, extra.h * 0.55, extra.d * 0.96, mats.glass), extra.dx, extra.h * 0.45, 0);
  },
  // Shimadzu LCMS-8060 với khối LC bên trái: thân MS lớn, buồng nguồn ion phía trước bên phải
  lcms(g, { w, d, h }) {
    put(g, box(w * 0.68, h * 0.75, d, tint(LIGHT)), w * 0.16, 0, 0);
    put(g, box(w * 0.68, h * 0.06, d * 0.9, tint(GREY)), w * 0.16, h * 0.75, 0);
    put(g, box(w * 0.18, h * 0.22, 0.12, tint(GREY)), w * 0.3, h * 0.35, d / 2 + 0.06);
    put(g, box(w * 0.28, h, d * 0.85, tint(GREY)), -w * 0.35, 0, 0);
    put(g, box(w * 0.18, h * 0.06, 0.01, tint(SCREEN), false), -w * 0.35, h * 0.7, d * 0.425 + 0.005);
  },
  // Tomy SX-500: thân đứng, nắp tròn trên đỉnh, bảng điều khiển
  autoclave(g, { w, d, h }) {
    put(g, box(w, h * 0.92, d, tint(LIGHT)), 0, 0, 0);
    put(g, cyl(w * 0.4, w * 0.42, h * 0.08, tint(GREY), { seg: 24 }), 0, h * 0.92, 0);
    put(g, box(w * 0.5, h * 0.1, 0.01, tint(SCREEN), false), 0, h * 0.7, d / 2 + 0.005);
  },
  // New Brunswick Innova 42: thân, nắp kính trên đỉnh, bảng điều khiển
  shaker(g, { w, d, h }) {
    put(g, box(w, h * 0.85, d, tint(LIGHT)), 0, 0, 0);
    put(g, box(w * 0.85, h * 0.15, d * 0.85, mats.glass), 0, h * 0.85, 0);
    put(g, box(w * 0.4, h * 0.08, 0.01, tint(SCREEN), false), 0, h * 0.7, d / 2 + 0.005);
  },
  // Esco Airstream: khung tủ, kính trượt phía trước, hộp quạt trên đỉnh (chân giá do builder đặt)
  bsc(g, { w, d, h }, base) {
    put(g, box(w, h * 0.78, d, tint(LIGHT)), 0, base, 0);
    put(g, box(w * 0.9, h * 0.45, 0.012, mats.glass), 0, base + h * 0.12, d / 2 + 0.008);
    put(g, box(w, h * 0.22, d * 0.9, tint(GREY)), 0, base + h * 0.78, -d * 0.03);
  },
};

export function buildMachineModel(m) {
  const g = new THREE.Group();
  const base = m.base ?? 0;
  if (base) put(g, box(m.w * 0.96, base, m.d * 0.9, mats.furnitureDark), 0, 0, 0).userData.isBase = true;
  const recipe = RECIPES[m.id];
  if (recipe && m.id === 'bsc') recipe(g, m, base);
  else if (recipe) recipe(g, m);
  else {
    const mat = m.glass ? tint(m.color, { transparent: true, opacity: 0.8 }) : tint(m.color);
    put(g, box(m.w, m.h, m.d, mat), 0, base, 0);
    if (m.top) put(g, box(m.w * 0.98, 0.012, m.d * 0.98, tint(m.top), false), 0, base + m.h, 0);
    if (m.h > 0.15) put(g, box(m.w * 0.5, Math.min(0.12, m.h * 0.3), 0.01, tint(SCREEN), false), 0, base + m.h * 0.55, m.d / 2 + 0.005);
    if (m.extra) put(g, box(m.extra.w, m.extra.h, m.extra.d, tint(m.extra.color)), m.extra.dx, base, 0);
  }
  return g;
}
