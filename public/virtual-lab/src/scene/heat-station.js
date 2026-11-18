import * as THREE from 'three';
import { mats, tint, box, cyl, put } from './materials.js';
import { BENCH, HEAT_STATION as H } from './layout.js';

// Bộ đun bằng đèn cồn trên bàn hoá học (giai đoạn 5 mục 2): giá ống nghiệm, đèn cồn có nắp, kiềng có lưới tản nhiệt,
// kẹp sắt, dây đốt thử màu ngọn lửa, que đóm. Ngọn lửa vẽ bằng fx (src/scene/fx.js). Mỗi vật có chú thích (data/apparatus.json).

const top = BENCH.top;

function lamp() {
  const g = new THREE.Group();
  const L = H.lamp;
  // Bầu thuỷ tinh có cồn bên trong, cổ, ống giữ bấc, bấc
  const body = put(g, cyl(L.r, L.r * 0.9, L.h * 0.8, mats.glass, { seg: 24 }), 0, 0, 0);
  body.renderOrder = 2;
  const fuel = put(g, cyl(L.r * 0.85, L.r * 0.8, L.h * 0.45, tint('#cfe6f5', { transparent: true, opacity: 0.6 }), { edges: false, seg: 20 }), 0, 0.004, 0);
  fuel.renderOrder = 1;
  put(g, cyl(L.r * 0.45, L.r * 0.6, L.h * 0.2, mats.glass, { edges: false, seg: 20 }), 0, L.h * 0.8, 0);
  put(g, cyl(0.009, 0.009, L.wick, tint('#b8c0c8'), { edges: false, seg: 12 }), 0, L.h, 0);
  put(g, cyl(0.005, 0.005, 0.008, tint('#f2ecd8'), { edges: false, seg: 8 }), 0, L.h + L.wick, 0);
  // Nắp thuỷ tinh: đậy trên bấc khi tắt, đặt cạnh đèn khi đang cháy
  const cap = new THREE.Group();
  put(cap, cyl(0.016, 0.02, 0.035, mats.glass, { seg: 16 }), 0, 0, 0).renderOrder = 2;
  g.add(cap);
  const capOn = new THREE.Vector3(0, L.h + 0.004, 0);
  const capOff = new THREE.Vector3(L.r + 0.03, 0, 0.02);
  cap.position.copy(capOn);
  g.position.set(L.x, top, L.z);
  g.userData.info = 'alcohol-lamp';
  return { group: g, cap, capOn, capOff, wickTop: L.h + L.wick + 0.008 };
}

function tripod() {
  const g = new THREE.Group();
  const T = H.tripod;
  const iron = tint('#3d4750');
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2 + Math.PI / 6;
    const leg = cyl(0.004, 0.004, T.h, iron, { edges: false, seg: 6 });
    leg.position.set(Math.cos(a) * T.r * 0.92, T.h / 2, Math.sin(a) * T.r * 0.92);
    g.add(leg);
  }
  const ring = new THREE.Mesh(new THREE.TorusGeometry(T.r, 0.004, 6, 32), iron);
  ring.rotation.x = Math.PI / 2;
  ring.position.y = T.h;
  g.add(ring);
  // Lưới tản nhiệt: tấm lưới thép, lõi gốm tròn ở giữa
  const gauze = new THREE.Group();
  put(gauze, box(T.r * 2.2, 0.002, T.r * 2.2, tint('#8a939b'), false), 0, 0, 0);
  put(gauze, cyl(T.r * 0.62, T.r * 0.62, 0.003, tint('#e9e4d8'), { edges: false, seg: 24 }), 0, 0.001, 0);
  gauze.position.y = T.h + 0.004;
  gauze.userData.info = 'gauze';
  g.add(gauze);
  g.position.set(T.x, top, T.z);
  g.userData.info = 'tripod';
  return { group: g, gauze, topY: top + T.h + 0.008 };
}

function rack() {
  const R = H.rack;
  const g = new THREE.Group();
  const wood = tint('#b98a5a');
  put(g, box(R.w, 0.012, R.d, wood), 0, 0, 0);
  put(g, box(R.w, 0.012, R.d, wood), 0, R.h, 0);
  for (const dx of [-R.w / 2 + 0.006, R.w / 2 - 0.006]) put(g, box(0.012, R.h, R.d, wood), dx, 0, 0);
  g.position.set(R.x, top, R.z);
  g.userData.info = 'test-tube-rack';
  return g;
}

function tongs() {
  const g = new THREE.Group();
  const steel = tint('#7f8a93');
  for (const s of [-1, 1]) {
    const arm = box(0.16, 0.004, 0.006, steel, false);
    arm.position.set(0, 0.004, s * 0.006);
    arm.rotation.y = s * 0.05;
    g.add(arm);
  }
  // Đoạn băng magnesium kẹp ở đầu kẹp
  const ribbon = box(0.05, 0.001, 0.004, tint('#c9cdd1'), false);
  ribbon.position.set(-0.1, 0.004, 0);
  g.add(ribbon);
  g.position.set(H.tongs.x, top, H.tongs.z);
  g.userData.info = 'tongs';
  return { group: g, ribbon };
}

// Dây đốt nichrome có vòng ở đầu, cán thuỷ tinh; que đóm gỗ
function wire() {
  const g = new THREE.Group();
  const rod = cyl(0.003, 0.003, 0.12, tint('#d8dde2'), { edges: false, seg: 6 });
  rod.rotation.z = Math.PI / 2;
  rod.position.set(0.06, 0.004, 0);
  g.add(rod);
  const loop = new THREE.Mesh(new THREE.TorusGeometry(0.006, 0.0012, 6, 16), tint('#9aa3ab'));
  loop.position.set(-0.006, 0.004, 0);
  g.add(loop);
  g.position.set(H.tongs.x + 0.05, top, H.tongs.z + 0.05);
  g.userData.info = 'flame-wire';
  return g;
}

function splint() {
  const g = new THREE.Group();
  const stick = box(0.13, 0.004, 0.004, tint('#c9a26b'), false);
  stick.position.set(0, 0.002, 0);
  g.add(stick);
  g.position.set(H.tongs.x - 0.02, top, H.tongs.z + 0.09);
  g.userData.info = 'splint';
  return g;
}

export function buildHeatStation(root) {
  const L = lamp();
  const T = tripod();
  const t = tongs();
  const w = wire();
  const s = splint();
  const r = rack();
  for (const o of [L.group, T.group, t.group, w, s, r]) root.add(o);
  return {
    lamp: L,
    tripod: T,
    rack: r,
    tongs: t,
    wire: w,
    splint: s,
    home: { lamp: L.group.position.clone(), tongs: t.group.position.clone(), wire: w.position.clone(), splint: s.position.clone() },
    // Đỉnh ngọn lửa (toạ độ thế giới) khi đèn ở vị trí hiện tại; ngọn lửa cao khoảng 0,045 m
    flameBase: () => L.group.position.clone().add(new THREE.Vector3(0, L.wickTop, 0)),
  };
}
