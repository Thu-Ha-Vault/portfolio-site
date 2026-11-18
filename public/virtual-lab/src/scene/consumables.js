import * as THREE from 'three';
import { mats, tint, box, cyl, put, tagGroup } from './materials.js';
import { BENCH, CONSUMABLES as C } from './layout.js';

// Đồ tiêu hao trên bàn sinh học phân tử (giai đoạn 7), cỡ thật theo CONSUMABLES trong layout.js: hộp đầu tip, giá ống
// 1,5 mL có vài ống, giá treo ba micropipet, chồng đĩa petri, hộp găng, cuộn giấy lau, bình tia nước cất.

export function buildConsumables(root) {
  const top = BENCH.top;
  const groups = {};

  // Hộp đầu tip 96 đầu: khay đỡ, tấm đục lỗ, đầu tip vàng nhô lên, nắp lật mở phía sau
  {
    const T = C.tipBox;
    const g = new THREE.Group();
    put(g, box(T.w, T.h * 0.62, T.d, tint('#e7ebee', { transparent: true, opacity: 0.85 })), 0, 0, 0);
    put(g, box(T.w, 0.003, T.d, tint('#2f6fb5'), false), 0, T.h * 0.62, 0);
    const tipGeo = new THREE.CylinderGeometry(0.0035, 0.0008, 0.053, 8);
    const tips = new THREE.InstancedMesh(tipGeo, tint('#f2c84b', { transparent: true, opacity: 0.85, roughness: 0.4 }), 96);
    const M = new THREE.Matrix4();
    for (let r = 0; r < 8; r++) for (let c = 0; c < 12; c++) {
      M.makeTranslation(-0.0495 + c * 0.009, T.h * 0.62 + 0.0265 - 0.035, -0.0315 + r * 0.009);
      tips.setMatrixAt(r * 12 + c, M);
    }
    g.add(tips);
    const lid = put(g, box(T.w, 0.003, T.d, tint('#e7ebee', { transparent: true, opacity: 0.6 }), false), 0, 0, 0);
    lid.position.set(0, T.h * 0.62 + T.d / 2, -T.d / 2 - 0.002);
    lid.rotation.x = Math.PI / 2;
    g.position.set(T.x, top, T.z);
    g.userData.info = 'tip-box';
    root.add(g);
    groups.tipBox = g;
  }

  // Giá ống 1,5 mL 5 × 16 lỗ, vài ống cắm sẵn
  {
    const R = C.tubeRack;
    const g = new THREE.Group();
    put(g, box(R.w, R.h, R.d, tint('#2f6fb5', { roughness: 0.6 })), 0, 0, 0);
    const pitch = R.w / R.cols;
    const tube = (x, z, cap) => {
      put(g, cyl(0.0054, 0.0054, 0.021, tint('#eef3f6', { transparent: true, opacity: 0.7 }), { edges: false, seg: 12 }), x, R.h, z);
      put(g, cyl(0.0058, 0.0058, 0.003, tint(cap), { edges: false, seg: 12 }), x, R.h + 0.021, z);
    };
    [[0, '#e8b33c'], [1, '#e8b33c'], [2, '#7fb3dc'], [5, '#e46b6b'], [6, '#f4f6f8'], [7, '#f4f6f8']].forEach(([c, cap], i) => tube(-R.w / 2 + pitch * (c + 0.5), (i % 2 ? 1 : -1) * 0.012, cap));
    g.position.set(R.x, top, R.z);
    g.userData.info = 'tube-rack';
    root.add(g);
    groups.tubeRack = g;
  }

  // Giá treo micropipet: ba micropipet (P20, P200, P1000) treo dọc
  {
    const P = C.pipettes;
    const g = new THREE.Group();
    put(g, box(0.12, 0.012, 0.1, tint('#3a4652')), 0, 0, 0);
    put(g, box(0.015, 0.3, 0.015, tint('#3a4652')), 0, 0.012, -0.04);
    put(g, box(0.12, 0.012, 0.03, tint('#3a4652')), 0, 0.27, -0.03);
    const plunger = ['#e46b6b', '#e8b33c', '#2f6fb5'];
    for (let i = 0; i < P.n; i++) {
      const x = -0.04 + i * 0.04;
      const pg = new THREE.Group();
      put(pg, cyl(0.013, 0.011, 0.11, tint('#eef1f4'), { seg: 12 }), 0, 0.11, 0);
      put(pg, cyl(0.007, 0.0035, 0.09, tint('#eef1f4'), { seg: 10 }), 0, 0.02, 0);
      put(pg, cyl(0.009, 0.009, 0.03, tint('#cfd6dc'), { seg: 10 }), 0, 0.22, 0);
      put(pg, cyl(0.0085, 0.0085, 0.008, tint(plunger[i]), { edges: false, seg: 10 }), 0, 0.25, 0);
      put(pg, box(0.012, 0.025, 0.006, tint('#26313b'), false), 0, 0.17, 0.012);
      pg.position.set(x, 0.015, 0.005);
      g.add(pg);
    }
    g.position.set(P.x, top, P.z);
    g.userData.info = 'micropipette';
    root.add(g);
    groups.pipettes = g;
  }

  // Chồng đĩa petri nhựa trong
  {
    const D = C.petri;
    const g = new THREE.Group();
    for (let i = 0; i < D.n; i++) {
      put(g, cyl(D.r, D.r, D.h, tint('#e9f1f6', { transparent: true, opacity: 0.55, roughness: 0.15 }), { seg: 32 }), 0, i * D.h, 0);
    }
    put(g, cyl(D.r * 0.96, D.r * 0.96, 0.006, tint('#e8d9a0', { transparent: true, opacity: 0.8 }), { edges: false, seg: 32 }), 0, 0.001, 0);
    g.position.set(D.x, top, D.z);
    g.userData.info = 'petri';
    root.add(g);
    groups.petri = g;
  }

  // Hộp găng nitrile trên bàn, cuộn giấy lau trên trục, bình tia nước cất
  groups.gloves = tagGroup(root, [put(root, box(C.gloves.w, C.gloves.h, C.gloves.d, tint('#f4f6f8')), C.gloves.x, top, C.gloves.z), put(root, box(0.1, 0.002, 0.04, tint('#5a3f9e'), false), C.gloves.x, top + C.gloves.h, C.gloves.z)], 'glove-dispenser');
  groups.towel = tagGroup(root, [put(root, cyl(0.07, 0.07, 0.008, tint('#3a4652'), { seg: 20 }), C.towel.x, top, C.towel.z), put(root, cyl(C.towel.r, C.towel.r, C.towel.h, tint('#f6f4ee', { roughness: 0.95 }), { seg: 24 }), C.towel.x, top + 0.008, C.towel.z), put(root, cyl(0.006, 0.006, 0.26, mats.frame, { edges: false, seg: 8 }), C.towel.x, top, C.towel.z)], 'paper-towel');
  {
    const W = C.washBottle;
    const g = new THREE.Group();
    put(g, cyl(W.r, W.r, W.h * 0.78, tint('#eef3f6', { transparent: true, opacity: 0.75, roughness: 0.4 }), { seg: 20 }), 0, 0, 0);
    put(g, cyl(0.016, W.r, W.h * 0.12, tint('#eef3f6', { transparent: true, opacity: 0.75 }), { seg: 20 }), 0, W.h * 0.78, 0);
    put(g, cyl(0.018, 0.018, 0.02, tint('#2f6fb5'), { seg: 16 }), 0, W.h * 0.9, 0);
    const nozzle = put(g, cyl(0.003, 0.003, 0.08, tint('#e8ecef'), { edges: false, seg: 8 }), 0, W.h * 0.95, 0.02);
    nozzle.rotation.x = 0.9;
    put(g, cyl(W.r * 0.96, W.r * 0.96, W.h * 0.5, tint('#cfe5f3', { transparent: true, opacity: 0.5 }), { edges: false, seg: 20 }), 0, 0.002, 0);
    g.position.set(W.x, top, W.z);
    g.userData.info = 'wash-bottle';
    root.add(g);
    groups.washBottle = g;
  }
  return groups;
}
