import * as THREE from 'three';
import { mats, tint, box, cyl, put, random, tagGroup } from './materials.js';
import { ROOM, BENCH, INSTRUMENT_BENCHES, MACHINES_3D } from './layout.js';
import { buildMachineModel } from './machine-models.js';
import { shelfGeometry } from './bench-items.js';
import { loadFigureMachine } from './figure-mesh.js';
import { makeCabinet } from './interact.js';

// Phòng thí nghiệm và các khu bên trong, mức phác thảo: khối hình đơn giản, đúng vị trí và kích thước gần đúng.

const V = (x, y, z) => new THREE.Vector3(x, y, z);
const WHITE = '#eef1f4';
const GREY = '#cfd6dc';
const DARK = '#3a4652';
const SCREEN = '#5f86a3';
const rnd = random(11);

export function buildRoom(root) {
  const w = ROOM.maxX - ROOM.minX;
  const d = ROOM.maxZ - ROOM.minZ;
  const t = 0.2;

  const ground = new THREE.Mesh(new THREE.PlaneGeometry(260, 260), mats.ground);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.14;
  root.add(ground);

  put(root, box(w, 0.12, d, mats.floor), 0, -0.12, 0);
  root.add(floorGrid(ROOM.minX, ROOM.maxX, ROOM.minZ, ROOM.maxZ, 0.003));

  // Tường, vách ngăn, cửa, trần dựng trong building.js (giai đoạn 7)

  // Hành lang nối sang khu trồng trọt
  put(root, box(1.8, 0.12, ROOM.door.w, mats.floor), ROOM.maxX + t + 0.9, -0.12, 0);
}

function floorGrid(x0, x1, z0, z1, y) {
  const pts = [];
  for (let x = Math.ceil(x0); x <= x1; x += 1) pts.push(x, y, z0, x, y, z1);
  for (let z = Math.ceil(z0); z <= z1; z += 1) pts.push(x0, y, z, x1, y, z);
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
  return new THREE.LineSegments(geo, mats.grid);
}

export function buildBench(root, labels) {
  const { x, z, w, d, top } = BENCH;
  put(root, box(w - 0.3, top - 0.05, d - 0.3, mats.furniture), x, 0, z);
  put(root, box(w, 0.05, d, mats.benchTop), x, top - 0.05, z);

  // Giá nhỏ ở giữa, chia đôi nửa hoá học và nửa sinh học phân tử
  put(root, box(0.9, 0.04, 0.5, mats.furnitureDark), x, top + 0.45, z - 0.75);
  for (const sx of [-0.42, 0.42]) for (const sz of [-0.22, 0.22]) put(root, box(0.03, 0.45, 0.03, mats.frame, false), x + sx, top, z - 0.75 + sz);

  // Bồn rửa và vòi
  put(root, box(0.6, 0.012, 0.42, tint('#8c99a5')), x, top, z + 0.55);
  put(root, cyl(0.014, 0.014, 0.32, tint('#aab5bf'), { edges: false }), x, top, z + 0.32);
  put(root, box(0.024, 0.024, 0.16, tint('#aab5bf'), false), x, top + 0.3, z + 0.4);

  // Ghế
  for (const sx of [-3.4, -1.7, 1.2, 2.9]) {
    put(root, cyl(0.03, 0.03, 0.6, mats.frame, { edges: false, seg: 8 }), sx, 0, z + d / 2 + 0.45);
    put(root, cyl(0.18, 0.18, 0.05, mats.furnitureDark), sx, 0.6, z + d / 2 + 0.45);
  }

  labels.add('Hoá học', V(-2.6, top + 0.01, z + 1.1), { kind: 'sub', max: 7 });
  labels.add('Sinh học phân tử', V(2.0, top + 0.01, z + 1.1), { kind: 'sub', max: 7 });
}

// Tủ/giá mở mặt trước. Trong toạ độ của nhóm, mặt trước hướng +z. Trả về nhóm và độ cao mặt các tầng.
function shelfUnit(w, h, d, levels, { glass = true } = {}) {
  const g = new THREE.Group();
  const t = 0.04;
  put(g, box(w, h, t, mats.furniture), 0, 0, -d / 2 + t / 2);
  put(g, box(t, h, d, mats.furniture), -w / 2 + t / 2, 0, 0);
  put(g, box(t, h, d, mats.furniture), w / 2 - t / 2, 0, 0);
  put(g, box(w, t, d, mats.furniture), 0, h - t, 0);
  const ys = [];
  for (let i = 0; i < levels; i++) {
    const y = 0.06 + i * ((h - 0.2) / levels);
    put(g, box(w - 2 * t, 0.03, d - t, mats.furnitureDark), 0, y, t / 2);
    ys.push(y + 0.03);
  }
  if (glass) put(g, box(w - 0.02, h - 0.1, 0.012, mats.glass), 0, 0.05, d / 2);
  return { group: g, ys };
}

// Đồ thuỷ tinh trên giá tủ dụng cụ dựng đúng cỡ theo src/core/vessel.js (cốc DURAN 100–1000 mL, bình tam giác 100 mL,
// ống nghiệm 16 × 150 mm, ống đong 10 mL, bình định mức 100 mL, pipet 10 mL); các hình còn lại là minh hoạ
const SHAPES = {
  ...Object.fromEntries(['beaker100', 'beaker250', 'beaker600', 'beaker1000', 'flask100', 'tube16', 'cyl10', 'vol100', 'pip10', 'pipg10'].map((k) => [k, shelfGeometry(k)])),
  vial: new THREE.CylinderGeometry(0.022, 0.022, 0.09, 8),
  box: new THREE.BoxGeometry(0.12, 0.08, 0.1),
  tank: new THREE.BoxGeometry(0.3, 0.2, 0.36),
};

// Xếp đồ lên các tầng giá bằng InstancedMesh (mỗi loại hình một lần vẽ).
function fillShelves(parent, ys, w, d, kinds, mat, perShelf) {
  const buckets = new Map(kinds.map((k) => [k, []]));
  ys.forEach((y, i) => {
    for (let j = 0; j < perShelf; j++) {
      const kind = kinds[(i + j) % kinds.length];
      const geo = SHAPES[kind];
      if (!geo.boundingBox) geo.computeBoundingBox();
      const h = geo.boundingBox.max.y - geo.boundingBox.min.y;
      const x = -w / 2 + 0.14 + j * ((w - 0.28) / Math.max(1, perShelf - 1));
      const z = (rnd() - 0.5) * d * 0.3;
      buckets.get(kind).push(new THREE.Matrix4().makeTranslation(x, y + h / 2, z));
    }
  });
  for (const [kind, list] of buckets) {
    if (!list.length) continue;
    const im = new THREE.InstancedMesh(SHAPES[kind], mat, list.length);
    list.forEach((m, i) => im.setMatrixAt(i, m));
    parent.add(im);
  }
}

export function buildGlassware(root, labels) {
  const names = ['Cốc có mỏ, bình tam giác', 'Ống nghiệm, ống đong', 'Buret, pipet', 'Micropipet, đầu tip'];
  const kinds = [['beaker250', 'flask100', 'beaker600', 'beaker100', 'beaker1000'], ['tube16', 'cyl10', 'beaker100'], ['pipg10', 'pip10', 'vol100'], ['box', 'tube16']];
  const glassware = tint('#a9cfe6', { transparent: true, opacity: 0.75 });
  names.forEach((name, i) => {
    const x = -3.3 + i * 2.2;
    const d = 0.55;
    const { group, ys } = shelfUnit(2.0, 2.1, d, 4);
    fillShelves(group, ys, 2.0, d, kinds[i], glassware, 9);
    group.position.set(x, 0, ROOM.minZ + d / 2 + 0.02);
    group.userData.info = 'glassware-cabinet';
    root.add(group);
    labels.add(name, V(x, 2.35, ROOM.minZ + 0.6), { kind: 'sub', max: 16 });
  });
}

export function buildOrganismArea(root, labels) {
  const zf = ROOM.maxZ; // mặt trong tường trước; các tủ quay mặt vào trong phòng (−z)
  let incubator = null;

  // Tủ ấm ruồi giấm có cửa kính: lọ lai trên kệ đúng với các lọ đang nuôi (setFlies)
  const d = 0.75;
  const incCab = makeCabinet({ w: 1.2, h: 1.9, d, doors: 1, shelves: 4, glass: true });
  incCab.group.rotation.y = Math.PI;
  incCab.group.position.set(-18.4, 0, zf - d / 2 - 0.02);
  incCab.group.userData.info = 'fly-incubator';
  root.add(incCab.group);
  const vialRack = new THREE.Group();
  incCab.interior.add(vialRack);
  incubator = labels.add('Tủ ấm ruồi giấm · 25 °C', V(-18.4, 2.15, zf - 0.8), { kind: 'sub', max: 22 });

  {
    const d = 0.5;
    const { group, ys } = shelfUnit(3.0, 1.9, d, 4, { glass: false });
    fillShelves(group, ys, 3.0, d, ['tank'], tint('#79bde0', { transparent: true, opacity: 0.65 }), 8);
    group.rotation.y = Math.PI;
    group.position.set(-14.4, 0, zf - d / 2 - 0.02);
    group.userData.info = 'zebrafish-rack';
    group.userData.figureSlot = { id: 'zebrafish', offset: [0, 0, 0.02] };
    root.add(group);
    labels.add('Giá nuôi cá ngựa vằn · 28,5 °C', V(-14.4, 2.15, zf - 0.6), { kind: 'sub', max: 22 });
  }

  {
    const bx = -10.4;
    const bz = zf - 0.4;
    const station = tagGroup(root, [
      put(root, box(1.8, 0.86, 0.7, mats.furniture), bx, 0, bz),
      put(root, box(1.85, 0.04, 0.75, mats.benchTop), bx, 0.86, bz),
    ], 'fly-station');
    // Kính lúp soi nổi trên tấm gây mê CO₂; bản 3D dựng từ hình chi tiết (FIGURE_SLOTS) có cả tấm CO₂, người soi đứng phía −z
    const stereo = new THREE.Group();
    stereo.position.set(bx - 0.3, 0.9, bz);
    stereo.rotation.y = Math.PI;
    stereo.userData.figureSlot = { id: 'stereo' };
    station.add(stereo);
    put(stereo, box(0.24, 0.04, 0.3, tint(DARK)), 0, 0, 0);
    put(stereo, cyl(0.02, 0.02, 0.35, tint(GREY), { edges: false, seg: 8 }), 0, 0.04, -0.1);
    put(stereo, box(0.14, 0.12, 0.2, tint(WHITE)), 0, 0.28, 0);
    put(stereo, box(0.26, 0.015, 0.18, tint('#7fb3dc')), -0.55, 0, 0);
    labels.add('Bàn soi ruồi · kính lúp soi nổi', V(bx, 1.55, bz - 0.2), { kind: 'sub', max: 22 });
  }

  // Nhãn tủ ấm theo thí nghiệm ruồi giấm: nhiệt độ và số lọ lai đang nuôi
  // Một lọ: ống nhựa, môi trường thức ăn, nút bông, và giai đoạn đang thấy (trứng không thấy được; ấu trùng trắng
  // trong môi trường; nhộng nâu bám thành lọ; ruồi trưởng thành bay trong lọ). Ngưỡng giai đoạn ở data/fly.json.
  const VIAL = new THREE.CylinderGeometry(0.035, 0.035, 0.18, 12, 1, true);
  const FOOD = new THREE.CylinderGeometry(0.033, 0.033, 0.05, 12);
  const PLUG = new THREE.CylinderGeometry(0.036, 0.036, 0.035, 12);
  const DOT = new THREE.SphereGeometry(0.006, 6, 4);
  const vialMat = tint('#dfe9f2', { transparent: true, opacity: 0.35 });
  const foodMat = tint('#a8763e');
  const plugMat = tint('#f4f1ea');
  const stageMat = { larva: tint('#f7f3e6'), pupa: tint('#8a5a2b'), adult: tint('#3a2a1c') };
  let stages = [{ id: 'egg', to: 0.11 }, { id: 'larva', to: 0.56 }, { id: 'pupa', to: 1 }];
  function stageOf(v) {
    if (v.emerged) return 'adult';
    return (stages.find((s) => v.progress < s.to) ?? stages[stages.length - 1]).id;
  }
  function drawVials(list) {
    vialRack.clear();
    list.slice(0, 16).forEach((v, i) => {
      const g = new THREE.Group();
      const shelfY = incCab.ys[1 + Math.floor(i / 8)];
      g.position.set(-0.48 + (i % 8) * 0.137, shelfY, 0.05);
      put(g, new THREE.Mesh(VIAL, vialMat), 0, 0, 0);
      put(g, new THREE.Mesh(FOOD, foodMat), 0, 0, 0);
      put(g, new THREE.Mesh(PLUG, plugMat), 0, 0.17, 0);
      const st = stageOf(v);
      const n = st === 'egg' ? 0 : st === 'adult' ? Math.min(14, Math.max(4, Math.round(v.n / 10))) : 8;
      for (let k = 0; k < n; k++) {
        const a = (k / n) * Math.PI * 2;
        const r = st === 'larva' ? 0.015 : 0.031;
        const y = st === 'larva' ? 0.045 : st === 'pupa' ? 0.07 + (k % 4) * 0.02 : 0.08 + ((k * 37) % 70) / 1000;
        const m = new THREE.Mesh(DOT, stageMat[st]);
        m.position.set(Math.cos(a) * r, y, Math.sin(a) * r);
        g.add(m);
      }
      g.userData.vial = v.id;
      vialRack.add(g);
    });
  }
  return {
    incubator: incCab,
    setStages(list) {
      if (Array.isArray(list) && list.length) stages = list;
    },
    setFlies(st) {
      incubator.element.textContent = `Tủ ấm ruồi giấm · ${st.temp} °C${st.vials.length ? ` · ${st.vials.length} lọ lai, ngày ${st.day}` : ''}`;
      drawVials(st.vials);
    },
  };
}

export function buildInstruments(root, labels) {
  const y = BENCH.top;
  for (const b of INSTRUMENT_BENCHES) {
    put(root, box(b.w - 0.2, y - 0.05, b.d - 0.2, mats.furniture), b.x, 0, b.z);
    put(root, box(b.w, 0.05, b.d, mats.benchTop), b.x, y - 0.05, b.z);
  }
  const [A, B] = INSTRUMENT_BENCHES;
  // Mỗi máy là mô hình low-poly trong đúng kích thước model thật (src/scene/machine-models.js); khối phụ (bộ nguồn, ly tâm mini, bộ thu phân đoạn) đặt cạnh.
  const machines = new Map();
  for (const m of MACHINES_3D) {
    const g = buildMachineModel(m);
    const base = m.base ?? 0;
    const z = m.floor ? m.z : (m.bench === 'A' ? A : B).z;
    g.position.set(m.x, m.floor ? 0 : y, z);
    if (m.rotate) g.rotation.y = -Math.PI / 2;
    g.userData.info = m.id;
    root.add(g);
    const topY = (m.floor ? 0 : y) + base + Math.max(m.h, m.extra?.h ?? 0);
    const lx = m.x + (m.extra ? m.extra.dx / 2 : 0);
    labels.add(m.name, V(lx, topY + 0.22, z), { kind: 'sub', max: 16 });
    machines.set(m.id, { def: m, group: g, topY, x: lx, z });
  }
  return machines;
}

// Màn hình máy vẽ bằng canvas: nền tối, tiêu đề, vài dòng trạng thái; tắt máy thì đen hẳn
function makeScreen(w, h) {
  const c = document.createElement('canvas');
  c.width = 384;
  c.height = Math.max(96, Math.round((384 * h) / w));
  const ctx = c.getContext('2d');
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: tex, toneMapped: false }));
  mesh.userData.noShadow = true;
  mesh.userData.info = 'machine-screen';
  function draw({ on = true, title = '', lines = [] } = {}) {
    ctx.fillStyle = on ? '#0f1c26' : '#050607';
    ctx.fillRect(0, 0, c.width, c.height);
    if (on) {
      const pad = c.width * 0.05;
      ctx.fillStyle = '#8fd3ff';
      ctx.font = `600 ${Math.round(c.height * 0.16)}px "Be Vietnam Pro", system-ui, sans-serif`;
      ctx.textBaseline = 'top';
      ctx.fillText(title, pad, pad, c.width - 2 * pad);
      ctx.fillStyle = '#e8f3f8';
      const fs = Math.round(c.height * 0.13);
      ctx.font = `500 ${fs}px "Be Vietnam Pro", system-ui, sans-serif`;
      lines.slice(0, 4).forEach((l, i) => ctx.fillText(l, pad, pad + c.height * 0.26 + i * fs * 1.25, c.width - 2 * pad));
      ctx.fillStyle = '#4ade80';
      ctx.beginPath();
      ctx.arc(c.width - pad, c.height - pad, c.height * 0.035, 0, Math.PI * 2);
      ctx.fill();
    }
    tex.needsUpdate = true;
  }
  return { mesh, draw };
}

// Thay mô hình low-poly bằng máy dựng từ hình học của hình chi tiết (data/machines3d/, src/scene/figure-mesh.js) cho
// những máy đã xuất (fig3d trong MACHINES_3D). Gọi một lần khi mức hình ảnh từ Vừa trở lên; tải xong máy nào thay máy đó.
// Máy đặt ngoài Khu máy móc có hình chi tiết (FIGURE_SLOTS trong layout.js): nhóm dựng tay mang userData.figureSlot
// { id, offset, rotY }. Ở mức hình ảnh Vừa và Cao, ẩn các phần con trực tiếp của nhóm trừ phần mang userData.keep (kính
// trượt, cửa, nắp, mặt đế đổi màu, kệ đựng mẫu, biển báo) rồi gắn bản 3D vào nhóm.
export function upgradeSlots(root) {
  root.traverse((g) => {
    const slot = g.userData.figureSlot;
    if (!slot || g.userData.slotDone) return;
    g.userData.slotDone = true;
    loadFigureMachine(slot.id).then((fg) => {
      if (!fg) return;
      for (const c of g.children) if (!c.userData.keep) c.visible = false;
      fg.position.set(...(slot.offset ?? [0, 0, 0]));
      fg.rotation.y = slot.rotY ?? 0;
      fg.userData.figure = true;
      g.add(fg);
    });
  });
}

export function upgradeMachines(machines, onUpgrade) {
  for (const m of machines.values()) {
    if (!m.def.fig3d || m.upgraded) continue;
    m.upgraded = true;
    loadFigureMachine(m.def.id).then((fg) => {
      if (!fg) return;
      const base = m.def.base ?? 0;
      for (const c of m.group.children) if (!(c.userData.keep)) c.visible = c.userData.isBase === true;
      fg.position.y = base;
      fg.userData.figure = true;
      m.group.add(fg);
      // Màn hình vẽ bằng canvas đặt lên mặt màn hình của máy (giai đoạn 7): hiện trạng thái lõi, bấm để bật hoặc tắt máy
      for (const sc of fg.userData.screens ?? []) {
        if (sc.w < 0.02 || sc.h < 0.015) continue;
        const scr = makeScreen(sc.w, sc.h);
        const n = new THREE.Vector3(...sc.normal);
        const up = new THREE.Vector3(...sc.up);
        const right = new THREE.Vector3().crossVectors(up, n).normalize();
        scr.mesh.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(right, new THREE.Vector3().crossVectors(n, right), n));
        scr.mesh.position.set(...sc.center).addScaledVector(n, 0.0012);
        scr.mesh.position.y += base;
        fg.add(scr.mesh);
        m.screen = scr;
        scr.draw(m.screenState ?? { on: true, title: m.def.name, lines: ['Sẵn sàng'] });
        break;
      }
      onUpgrade?.(m);
    });
  }
}
