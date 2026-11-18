import * as THREE from 'three';
import { mats, tint, box, cyl, put } from './materials.js';
import { BUILDING, BENCH, INSTRUMENT_BENCHES, SAFETY } from './layout.js';
import { safetySign, evacSign, planeOf } from './signs.js';

// Đồ cố định của toà nhà (giai đoạn 7) dựng theo data/facility.json: bồn rửa tay có vòi rửa mắt, bồn rửa lớn, vòi tắm
// khẩn cấp, vòi khí và ổ điện, tủ sơ cứu, bộ xử lý tràn hoá chất, móc áo, hộp găng, giá kính, thùng rác, giá phơi, tủ
// sấy, biển báo, sơ đồ thoát hiểm. Mỗi món dựng trong khung riêng: mặt trước hướng +z, lưng sát tường, rồi quay theo
// face. Kích thước là minh hoạ (không có model cụ thể), trừ chỗ ghi nguồn trong data/facility.json.

const ROT = { '+z': 0, '-z': Math.PI, '+x': Math.PI / 2, '-x': -Math.PI / 2 };
const STEEL = () => tint('#c4ccd3', { metalness: 0.75, roughness: 0.32 });
const CHROME = () => tint('#d9dee2', { metalness: 0.9, roughness: 0.18 });
const CERAMIC = () => tint('#f3f5f6', { roughness: 0.25, tex: 'speckle' });
const GREEN = '#2e9d5b';
const YELLOW = '#e0b028';

// Phần treo tường của một món: building.attach() ẩn nó khi tường bị cắt thấp
function mount(g, obj) {
  (g.userData.mounted ??= []).push(obj);
  return obj;
}

function frame(root, f, info) {
  const g = new THREE.Group();
  g.position.set(f.x, 0, f.z);
  g.rotation.y = ROT[f.face ?? '+z'];
  if (info) g.userData.info = info;
  root.add(g);
  return g;
}

// Vòi rửa mắt gắn ở bồn: cần xoay màu xanh lá, hai đầu phun có nắp vàng (mặc định nằm dọc mép bồn)
function eyewashArm(g, x, y, z) {
  const arm = new THREE.Group();
  arm.position.set(x, y, z);
  arm.userData.info = 'bench-eyewash';
  g.add(arm);
  put(arm, cyl(0.022, 0.026, 0.16, tint(GREEN), { seg: 12, edges: false }), 0, 0, 0);
  put(arm, box(0.03, 0.03, 0.22, tint(GREEN), false), 0, 0.16, 0.08);
  for (const dx of [-0.035, 0.035]) put(arm, cyl(0.02, 0.016, 0.03, tint(YELLOW), { seg: 12, edges: false }), dx, 0.175, 0.17);
  put(arm, box(0.07, 0.05, 0.012, tint(YELLOW), false), 0, 0.06, 0.06);
  return arm;
}

function gooseneck(g, x, y, z, mat, reach = 0.18, h = 0.3) {
  put(g, cyl(0.014, 0.016, h, mat, { seg: 12, edges: false }), x, y, z);
  const arc = new THREE.Mesh(new THREE.TorusGeometry(reach / 2, 0.012, 8, 16, Math.PI), mat);
  arc.position.set(x, y + h, z + reach / 2);
  arc.rotation.y = Math.PI / 2;
  g.add(arc);
  put(g, cyl(0.012, 0.012, 0.05, mat, { seg: 10, edges: false }), x, y + h - 0.05, z + reach);
}

const BUILD = {
  // Bồn rửa tay không chạm tay (vòi cảm ứng), tủ dưới, xà phòng và giấy lau trên tường, vòi rửa mắt ở mép bồn
  handsink(root, f) {
    const g = frame(root, f, 'hand-sink');
    const d = 0.45;
    put(g, box(0.5, 0.78, 0.4, tint('#e5e9ec', { tex: 'laminate' })), 0, 0, -d / 2 + 0.2);
    put(g, box(0.56, 0.08, d, CERAMIC()), 0, 0.78, 0);
    put(g, box(0.4, 0.012, 0.3, tint('#aab5bf', { metalness: 0.5, roughness: 0.3 }), false), 0, 0.855, 0.02);
    gooseneck(g, 0, 0.86, -d / 2 + 0.05, CHROME(), 0.15, 0.26);
    put(g, box(0.05, 0.02, 0.03, tint('#26313b'), false), 0, 1.0, -d / 2 + 0.04);
    mount(g, put(g, box(0.12, 0.2, 0.09, tint('#f4f6f8')), -0.36, 1.12, -d / 2 + 0.045));
    mount(g, put(g, box(0.3, 0.32, 0.12, tint('#f4f6f8')), 0.38, 1.25, -d / 2 + 0.06));
    if (f.eyewash) eyewashArm(g, 0.22, 0.86, -0.12);
    return g;
  },
  // Bồn rửa trên bàn trung tâm đã dựng trong room.js: thêm vòi rửa mắt cạnh bồn và vòi nước cất
  benchsink(root, f) {
    const g = frame(root, f, null);
    g.position.y = BENCH.top;
    if (f.eyewash) eyewashArm(g, 0.38, 0, 0.02);
    const di = new THREE.Group();
    di.userData.info = 'di-tap';
    g.add(di);
    gooseneck(di, -0.38, 0, -0.12, tint('#eef1f4', { roughness: 0.4 }), 0.14, 0.24);
    put(di, box(0.04, 0.03, 0.005, tint('#2f6fb5'), false), -0.38, 0.12, -0.105);
    return g;
  },
  // Bồn rửa lớn phòng rửa: hai hố, mặt inox có rãnh phơi, vòi nước thường và nước cất, vòi rửa mắt
  labsink(root, f) {
    const g = frame(root, f, 'lab-sink');
    const d = 0.6;
    put(g, box(1.4, 0.82, d - 0.04, tint('#dfe4e8', { tex: 'laminate' })), 0, 0, 0);
    put(g, box(1.44, 0.06, d, STEEL()), 0, 0.82, 0);
    for (const x of [-0.36, 0.18]) put(g, box(0.42, 0.012, 0.42, tint('#9aa5af', { metalness: 0.6, roughness: 0.3 }), false), x, 0.875, 0.02);
    for (let i = 0; i < 6; i++) put(g, box(0.008, 0.004, 0.36, tint('#9aa5af'), false), 0.48 + i * 0.035, 0.88, 0.02);
    gooseneck(g, -0.36, 0.88, -d / 2 + 0.05, CHROME(), 0.24, 0.36);
    const di = new THREE.Group();
    di.userData.info = 'di-tap';
    g.add(di);
    gooseneck(di, 0.18, 0.88, -d / 2 + 0.05, tint('#eef1f4', { roughness: 0.4 }), 0.2, 0.3);
    put(di, box(0.05, 0.03, 0.005, tint('#2f6fb5'), false), 0.18, 1.0, -d / 2 + 0.065);
    if (f.eyewash) eyewashArm(g, 0.62, 0.88, -0.2);
    return g;
  },
  shower(root, f) {
    return showerStation(root, f.x, f.z, f.face ?? '+x');
  },
  spillkit(root, f) {
    const g = frame(root, f, 'spill-kit');
    put(g, cyl(0.21, 0.19, 0.58, tint(YELLOW, { roughness: 0.5 })), 0, 0, 0);
    put(g, cyl(0.22, 0.22, 0.05, tint('#26313b')), 0, 0.58, 0);
    const lab = safetySign('Xử lý tràn hoá chất', { style: 'warn', w: 0.3 });
    lab.position.set(0, 0.36, 0.205);
    g.add(lab);
    return g;
  },
  firstaid(root, f) {
    const g = frame(root, f, 'first-aid');
    mount(g, g);
    put(g, box(0.42, 0.46, 0.14, tint('#f4f6f8')), 0, f.y - 0.23, -0.07 + 0.07);
    const s = safetySign('Sơ cứu', { style: 'firstaid', w: 0.4 });
    s.position.set(0, f.y + 0.02, 0.072);
    g.add(s);
    return g;
  },
  gloves(root, f) {
    const g = frame(root, f, 'glove-dispenser');
    mount(g, g);
    put(g, box(0.27, 0.42, 0.012, tint('#cfd6dc', { metalness: 0.4 })), 0, f.y - 0.21, -0.06);
    ['#7fb3dc', '#2f6fb5', '#5a3f9e'].forEach((c, i) => {
      put(g, box(0.25, 0.12, 0.12, tint('#f4f6f8')), 0, f.y - 0.2 + i * 0.135, 0);
      put(g, box(0.1, 0.04, 0.005, tint(c), false), 0, f.y - 0.16 + i * 0.135, 0.062);
    });
    return g;
  },
  goggles(root, f) {
    const g = frame(root, f, 'goggles-rack');
    mount(g, g);
    put(g, box(0.5, 0.05, 0.12, tint('#cfd6dc', { metalness: 0.4 })), 0, f.y, 0);
    const lens = tint('#cfe8f4', { transparent: true, opacity: 0.55 });
    for (let i = 0; i < 4; i++) {
      const x = -0.18 + i * 0.12;
      put(g, box(0.1, 0.045, 0.05, lens, false), x, f.y - 0.05, 0.04);
      put(g, box(0.1, 0.012, 0.012, tint('#2f6fb5'), false), x, f.y - 0.02, 0.0);
    }
    return g;
  },
  // Thanh móc áo trên tường, bốn áo blouse treo
  coats(root, f) {
    const g = frame(root, f, 'coat-rack');
    mount(g, g);
    put(g, box(1.7, 0.06, 0.03, tint('#8b5e3c', { tex: 'wood' })), 0, 1.72, -0.06);
    const coat = tint('#fbfbf8', { roughness: 0.9, tex: 'grain' });
    for (let i = 0; i < 4; i++) {
      const x = -0.6 + i * 0.4;
      put(g, cyl(0.008, 0.008, 0.08, CHROME(), { seg: 8, edges: false }), x, 1.68, -0.04);
      const c = put(g, box(0.42, 0.95, 0.1, coat), x, 0.74, 0.0);
      c.rotation.z = (i % 2 ? 1 : -1) * 0.03;
      put(g, box(0.16, 0.18, 0.11, coat, false), x, 1.5, 0.0);
    }
    return g;
  },
  bin(root, f) {
    const g = frame(root, f, 'waste-bin');
    put(g, cyl(0.15, 0.13, 0.46, tint('#8c99a5', { metalness: 0.5, roughness: 0.35 })), 0, 0, 0);
    put(g, cyl(0.155, 0.155, 0.03, tint('#3a4652')), 0, 0.46, 0);
    put(g, box(0.1, 0.02, 0.06, tint('#3a4652'), false), 0, 0.02, 0.16);
    return g;
  },
  // Giá phơi dụng cụ: tấm có chốt, dụng cụ úp trên chốt, máng hứng nước
  rack(root, f) {
    const g = frame(root, f, 'drying-rack');
    mount(g, g);
    put(g, box(1.2, 0.8, 0.02, tint('#eef1f4', { tex: 'speckle' })), 0, f.y - 0.4, -0.04);
    const glass = mats.glass;
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 8; c++) {
        const x = -0.49 + c * 0.14;
        const y = f.y - 0.32 + r * 0.19;
        const peg = put(g, cyl(0.005, 0.005, 0.12, tint('#cfd6dc'), { seg: 6, edges: false }), x, y, 0.02);
        peg.rotation.x = Math.PI / 2 - 0.3;
        if ((r * 8 + c) % 3 !== 1) {
          const v = put(g, cyl(0.024, 0.03, 0.11, glass, { seg: 12, edges: false }), x, y - 0.05, 0.05);
          v.rotation.x = Math.PI;
          v.userData.glass = true;
        }
      }
    }
    put(g, box(1.24, 0.03, 0.12, STEEL(), false), 0, f.y - 0.46, 0.02);
    return g;
  },
  oven(root, f) {
    const g = frame(root, f, 'drying-oven');
    put(g, box(0.62, 0.62, 0.56, tint('#e9edf0', { tex: 'brushed', metalness: 0.3 })), 0, 0.12, 0);
    put(g, box(0.6, 0.12, 0.5, tint('#3a4652')), 0, 0, 0);
    put(g, box(0.56, 0.12, 0.02, tint('#3a4652'), false), 0, 0.6, 0.285);
    put(g, box(0.1, 0.04, 0.01, tint('#62e3a0'), false), -0.14, 0.64, 0.297);
    put(g, box(0.36, 0.3, 0.01, tint('#2a3138', { metalness: 0.4, roughness: 0.2 }), false), 0, 0.2, 0.285);
    put(g, box(0.04, 0.2, 0.04, CHROME(), false), 0.25, 0.25, 0.3);
    return g;
  },
  // Vòi khí đốt, chân không, khí nén dưới giá giữa bàn trung tâm; ổ điện trên chân giá; dải ổ điện trên hai đảo máy
  services(root, f) {
    const g = frame(root, f, null);
    const top = BENCH.top;
    const taps = new THREE.Group();
    taps.userData.info = 'gas-taps';
    g.add(taps);
    [['#cfd6dc', -0.2], ['#cfd6dc', 0], ['#cfd6dc', 0.2]].forEach(([c, x]) => {
      put(taps, cyl(0.025, 0.03, 0.12, CHROME(), { seg: 12, edges: false }), x, top, 0);
      const n = put(taps, cyl(0.008, 0.012, 0.07, CHROME(), { seg: 10, edges: false }), x, top + 0.08, 0.04);
      n.rotation.x = Math.PI / 2;
      put(taps, box(0.07, 0.015, 0.02, tint(c), false), x, top + 0.12, 0);
    });
    const sockets = new THREE.Group();
    sockets.userData.info = 'sockets';
    g.add(sockets);
    for (const sx of [-0.42, 0.42]) for (const sz of [-1, 1]) {
      put(sockets, box(0.07, 0.11, 0.035, tint('#f4f6f8')), sx, top + 0.12, sz * 0.25);
      for (const dy of [0.03, 0.07]) put(sockets, box(0.03, 0.02, 0.004, tint('#3a4652'), false), sx, top + 0.12 + dy, sz * 0.27);
    }
    for (const b of INSTRUMENT_BENCHES) {
      const strip = new THREE.Group();
      strip.userData.info = 'sockets';
      root.add(strip);
      const zb = b.z + Math.sign(b.z) * (b.d / 2 - 0.05);
      put(strip, box(b.w - 0.4, 0.05, 0.05, tint('#e9edf0', { metalness: 0.3 })), b.x, top, zb);
      for (let x = b.x - b.w / 2 + 0.5; x < b.x + b.w / 2 - 0.3; x += 0.6) put(strip, box(0.05, 0.03, 0.004, tint('#3a4652'), false), x, top + 0.01, zb - Math.sign(b.z) * 0.027);
    }
    return g;
  },
};

// Vòi tắm và rửa mắt khẩn cấp kết hợp (Guardian Equipment G1902, figures/eyewash): ống đứng, đầu sen ở trên, chậu rửa
// mắt ngang hông, tay gạt, cần kéo. Mặt trước hướng face.
export function showerStation(root, x, z, face = '-x') {
  const g = frame(root, { x, z, face }, 'eyewash');
  g.userData.figureSlot = { id: 'eyewash', offset: [0, 0, -0.05] }; // trục ống đứng của hình ở gốc
  const Y = tint(YELLOW);
  put(g, cyl(0.03, 0.03, 2.3, Y, { edges: false, seg: 10 }), 0, 0, -0.05);
  put(g, cyl(0.16, 0.12, 0.08, Y), 0, 2.2, 0.25);
  put(g, box(0.025, 0.025, 0.3, Y, false), 0, 2.27, 0.1);
  put(g, cyl(0.14, 0.1, 0.06, tint(GREEN)), 0, 1.0, 0.2);
  put(g, box(0.25, 0.04, 0.02, Y, false), 0, 0.95, 0.36);
  put(g, box(0.02, 0.5, 0.02, tint('#3a4652'), false), 0.12, 1.6, 0.25);
  put(g, cyl(0.1, 0.1, 0.02, tint('#3a4652'), { seg: 16 }), 0, 0, 0.25);
  const s = safetySign('Vòi tắm, rửa mắt khẩn cấp', { style: 'firstaid', w: 0.5 });
  s.position.set(0, 2.62, -0.04);
  if (2.62 + 0.11 > BUILDING.ceil) s.position.y = BUILDING.ceil - 0.15;
  s.userData.keep = true;
  g.add(s);
  mount(g, s);
  return g;
}

export function buildServices(root, facility) {
  const groups = new Map();
  for (const f of facility.fixtures) {
    const make = BUILD[f.kind];
    if (!make || f.kind === 'evacmap') continue;
    groups.set(f.id, make(root, f));
  }
  // Sơ đồ thoát hiểm vẽ theo đúng chỗ treo ("Bạn đang ở đây")
  const eyewash = facility.fixtures.filter((f) => f.eyewash);
  const firstaid = facility.fixtures.filter((f) => f.kind === 'firstaid');
  const shower = { x: SAFETY.shower.x, z: SAFETY.shower.z };
  for (const f of facility.fixtures.filter((q) => q.kind === 'evacmap')) {
    const g = frame(root, f, 'evac-map');
    const m = evacSign(BUILDING, { here: f, eyewash: [...eyewash, shower], extinguishers: SAFETY.extinguishers, firstaid, w: 0.62 });
    m.position.set(0, f.y, 0.005);
    g.add(m);
    mount(g, g);
    groups.set(f.id, g);
  }
  for (const s of facility.signs) {
    if (s.style === 'tent') {
      // Biển gập đứng trên mặt bàn
      const g = frame(root, s, 'safety-sign');
      const m = planeOf(tentCanvas(s.text), s.w, s.w * 0.32);
      const back = m.clone();
      m.position.set(0, s.y + s.w * 0.15, 0.03);
      m.rotation.x = -0.32;
      back.position.set(0, s.y + s.w * 0.15, -0.03);
      back.rotation.set(0.32, Math.PI, 0);
      g.add(m, back);
      g.userData.infoText = s.info;
      continue;
    }
    const g = frame(root, s, 'safety-sign');
    const m = safetySign(s.text, { style: s.style, w: s.w, ghs: s.ghs });
    m.position.set(0, s.y, 0);
    g.add(m);
    mount(g, g);
  }
  return { groups };
}

function tentCanvas(text) {
  const c = document.createElement('canvas');
  c.width = 420;
  c.height = 134;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#1f5fae';
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.fillStyle = '#fff';
  ctx.font = '600 52px "Be Vietnam Pro", system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, c.width / 2, c.height / 2, c.width * 0.92);
  return c;
}

