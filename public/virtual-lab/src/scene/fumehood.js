import * as THREE from 'three';
import { mats, tint, box, cyl, put } from './materials.js';
import { FUME_HOOD as H, ROOM } from './layout.js';

// Tủ hút khí độc theo kích thước model thật: tủ đế, mặt bàn epoxy, vỏ, vách ngăn sau, kính trượt đứng (nâng hạ theo
// độ mở), tấm đầu có bộ báo luồng khí (đèn đỏ khi báo động), ống thải lên trần. Khí nâu NO₂ hiện khi có phản ứng.

const V = (x, y, z) => new THREE.Vector3(x, y, z);

export function buildFumeHood(root, labels) {
  const g = new THREE.Group();
  g.position.set(H.x, 0, H.z);
  g.userData.info = 'fume-hood';
  // Bản 3D dựng từ hình chi tiết (FIGURE_SLOTS): giữ kính trượt, đèn báo, khí NO₂ và ống thải dựng tay
  g.userData.figureSlot = { id: 'fumehood' };
  root.add(g);
  const shell = tint('#e9edf0');
  const t = 0.05;
  // Tủ đế hai ngăn (dung môi, acid)
  put(g, box(H.w, H.base - 0.04, H.d * 0.8, mats.furniture), 0, 0, -H.d * 0.1);
  for (const dx of [-H.w / 4, H.w / 4]) put(g, box(H.w / 2 - 0.03, H.base - 0.12, 0.02, tint(dx < 0 ? '#e0b028' : '#c8463d'), false), dx, 0.06, H.d * 0.3 + 0.01);
  put(g, box(H.w, 0.04, H.d, tint('#2b2f33')), 0, H.base - 0.04, 0);
  const y0 = H.base;
  // Vỏ: hai vách bên, vách sau, nóc, tấm đầu trên cửa
  for (const sx of [-1, 1]) put(g, box(t * 2, H.h, H.d, shell), sx * (H.w / 2 - t), y0, 0);
  put(g, box(H.w, H.h, t, shell), 0, y0, -H.d / 2 + t / 2);
  put(g, box(H.w, t, H.d, shell), 0, y0 + H.h - t, 0);
  const headerH = H.h - H.sight - 0.03;
  put(g, box(H.w, headerH, 0.08, shell), 0, y0 + H.sight + 0.03, H.d / 2 - 0.04);
  // Vách ngăn sau có khe
  put(g, box(H.w - 0.2, H.sight - 0.1, 0.02, tint('#cfd6dc')), 0, y0 + 0.08, -H.d / 2 + 0.12);
  // Bộ báo luồng khí trên tấm đầu
  const alarmMat = tint('#3a4652').clone();
  put(g, box(0.12, 0.07, 0.02, tint('#3a4652'), false), H.w / 2 - 0.2, y0 + H.sight + 0.2, H.d / 2 + 0.005);
  const lamp = put(g, box(0.03, 0.03, 0.02, alarmMat, false), H.w / 2 - 0.12, y0 + H.sight + 0.21, H.d / 2 + 0.01);
  lamp.userData.keep = true;
  // Kính trượt
  const sash = new THREE.Group();
  sash.userData.keep = true;
  g.add(sash);
  put(sash, box(H.w - 0.25, H.sashH, 0.02, mats.glass), 0, 0, 0);
  put(sash, box(H.w - 0.25, 0.04, 0.035, tint('#9aa3ab'), false), 0, 0, 0);
  sash.position.set(0, y0 + 0.03, H.d / 2 - 0.02);
  // Ống thải lên trần
  put(g, cyl(0.16, 0.16, ROOM.wallH - y0 - H.h, mats.furnitureDark, { edges: false }), 0, y0 + H.h, -0.15).userData.keep = true;
  // Khí nâu NO₂ (ẩn khi không có phản ứng)
  const gas = new THREE.Mesh(new THREE.SphereGeometry(0.25, 16, 12), new THREE.MeshBasicMaterial({ color: '#a0522d', transparent: true, opacity: 0.35, depthWrite: false }));
  gas.position.set(0, y0 + 0.3, 0);
  gas.visible = false;
  gas.userData.keep = true;
  g.add(gas);
  const status = labels.add('', V(H.x, y0 + H.h + 0.1, H.z + 0.5), { kind: 'sub', max: 12 });
  return {
    group: g,
    setSash(mm) {
      sash.position.y = y0 + 0.03 + Math.max(0, Math.min(711, mm)) / 1000;
    },
    // alarm: báo động luồng khí; gas: null | { inside: bool, escaped: bool }
    setState({ alarm = false, text = '', gas: gs = null } = {}) {
      alarmMat.color.set(alarm ? '#e5484d' : '#3a4652');
      status.element.textContent = text;
      gas.visible = Boolean(gs);
      if (gs) {
        gas.position.z = gs.escaped ? H.d / 2 + 0.25 : 0;
        gas.scale.setScalar(gs.escaped ? 1.6 : 1);
      }
    },
  };
}
