import * as THREE from 'three';
import { tint, box, cyl, put, mats } from './materials.js';
import { BENCH, CHEM_BENCH_TOOLS } from './layout.js';

// Máy trên bàn hoá học: cân phân tích có buồng kính và máy khuấy từ gia nhiệt có giá kẹp đầu dò.
// Kích thước theo model thật (layout.js). Mặt đế máy khuấy đỏ dần theo nhiệt độ; nhãn trạng thái phía trên mỗi máy.

const V = (x, y, z) => new THREE.Vector3(x, y, z);
const HOUSING = '#eef1f4';
const DARK = '#3a4652';

function buildBalance(t) {
  const g = new THREE.Group();
  const baseH = 0.09;
  put(g, box(t.w, baseH, t.d, tint(HOUSING)), 0, 0, 0);
  // Khối màn hình dốc ở mặt trước
  const screen = box(t.w * 0.9, 0.012, 0.09, tint(DARK), false);
  screen.position.set(0, baseH + 0.01, t.d / 2 - 0.05);
  screen.rotation.x = -0.35;
  g.add(screen);
  // Buồng kính chắn gió và đĩa cân
  const shieldD = t.d * 0.66;
  const zc = -t.d / 2 + shieldD / 2;
  put(g, box(t.w * 0.96, t.h - baseH, shieldD, mats.glass), 0, baseH, zc);
  put(g, box(t.w * 0.96, 0.02, shieldD, tint('#cfd6dc'), false), 0, t.h - 0.02, zc);
  put(g, cyl(0.045, 0.045, 0.006, tint('#b8c0c8')), 0, baseH + 0.02, zc);
  return g;
}

function buildHotplate(t) {
  const g = new THREE.Group();
  put(g, box(t.w, t.h - 0.006, t.d, tint(HOUSING)), 0, 0, 0);
  // Mặt đế ceramic 180 × 180 mm ở phía sau, bảng điều khiển phía trước
  const topMat = tint('#f3f4f2').clone();
  const plate = box(0.18, 0.006, 0.18, topMat, false);
  put(g, plate, 0, t.h - 0.006, -t.d / 2 + 0.11);
  plate.userData.keep = true; // mặt đế đổi màu theo nhiệt độ: giữ khi thay bằng bản 3D
  put(g, box(t.w * 0.8, 0.03, 0.01, tint(DARK), false), 0, t.h * 0.35, t.d / 2 + 0.003);
  for (const dx of [-0.06, 0.06]) put(g, cyl(0.014, 0.014, 0.02, tint(DARK)), dx, t.h * 0.2, t.d / 2 + 0.01).rotation.x = Math.PI / 2;
  // Giá kẹp đầu dò: cột Ø16 sau bên phải, thanh ngang, đầu dò PT1000 thả xuống tâm mặt đế
  const zc = -t.d / 2 + 0.11;
  put(g, cyl(0.008, 0.008, 0.5, tint('#b8c0c8'), { edges: false, seg: 10 }), t.w / 2 + 0.04, 0, zc);
  put(g, box(t.w / 2 + 0.05, 0.012, 0.012, tint('#b8c0c8'), false), (t.w / 2 + 0.05) / 2, 0.4, zc);
  put(g, cyl(0.0015, 0.0015, 0.2, tint('#9aa3ab'), { edges: false, seg: 6 }), 0, 0.2, zc);
  return { g, topMat };
}

const COLD = new THREE.Color('#f3f4f2');
const HOT = new THREE.Color('#c8463d');

export function buildChemBench(root, labels) {
  const groups = new Map();
  const status = new Map();
  let topMat = null;
  for (const t of CHEM_BENCH_TOOLS) {
    let g;
    if (t.id === 'hotplate') ({ g, topMat } = buildHotplate(t));
    else g = buildBalance(t);
    g.position.set(t.x, BENCH.top, t.z);
    g.userData.info = t.id;
    // Bản 3D dựng từ hình chi tiết (FIGURE_SLOTS); máy khuấy: tâm mặt đế của hình ở y = −77 mm, mặt đế dựng tay ở −67 mm
    g.userData.figureSlot = { id: t.id, offset: t.id === 'hotplate' ? [0, 0, 0.01] : [0, 0, 0] };
    root.add(g);
    groups.set(t.id, g);
    const h = t.id === 'hotplate' ? 0.5 : t.h;
    status.set(t.id, labels.add('', V(t.x, BENCH.top + h + 0.05, t.z), { kind: 'sub', max: 6 }));
  }
  return {
    groups,
    // Mặt đế đỏ dần từ 50 °C (đèn Hot Top) tới 300 °C
    setHot(plateC) {
      const k = Math.min(1, Math.max(0, (plateC - 50) / 250));
      topMat.color.copy(COLD).lerp(HOT, k);
    },
    setStatus(id, text) {
      const l = status.get(id);
      if (l) l.element.textContent = text;
    },
  };
}
