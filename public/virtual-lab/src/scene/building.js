import * as THREE from 'three';
import { mats, tint, withEdges } from './materials.js';
import { BUILDING } from './layout.js';
import { textSign, safetySign } from './signs.js';

// Vỏ toà nhà (giai đoạn 7): tường đủ cao có chân tường, vách ngăn các phòng, cửa có cánh mở được, cửa sổ kính, trần
// tấm 0,6 m có đèn tấm, biển tên phòng và biển lối thoát. Nhìn từ trên cao (camera cao hơn trần) thì trần ẩn và mọi
// tường cắt thấp còn 1 m như mô hình nhà búp bê; nhìn chếch trong phòng thì chỉ cắt tường che giữa camera và chỗ đang
// nhìn; đứng ở tầm mắt thì tường đủ cao như thật. segments() cho bảng Di chuyển tính va chạm (src/core/walk.js).

const B = BUILDING;
const V = (x, y, z) => new THREE.Vector3(x, y, z);
const SKIRT = '#58636e';
const FRAME = '#e3e7eb';
const DOOR = '#cfd6dc';

// Khối dài len dọc tường, gốc ở chân (y = 0 của khối là đáy) để co chiều cao khi cắt
function slab(len, h, t, mat) {
  const geo = new THREE.BoxGeometry(len, h, t);
  geo.translate(0, h / 2, 0);
  return withEdges(new THREE.Mesh(geo, mat), 25);
}

export function buildBuilding(root, labels) {
  const g = new THREE.Group();
  g.name = 'building';
  root.add(g);
  const { minX, maxX, minZ, maxZ } = B.bounds;
  const skirtMat = tint(SKIRT, { tex: 'grain' });
  const frameMat = tint(FRAME, { metalness: 0.35, roughness: 0.4 });
  const doorMat = tint(DOOR, { tex: 'laminate' });
  const handleMat = tint('#aab5bf', { metalness: 0.7, roughness: 0.3 });

  const walls = [];
  const doors = [];
  for (const def of B.walls) {
    const t = def.ext ? B.extT : B.intT;
    const [ax, az] = def.a;
    const [bx, bz] = def.b;
    const len = Math.hypot(bx - ax, bz - az);
    const ux = (bx - ax) / len;
    const uz = (bz - az) / len;
    const alongX = Math.abs(ux) > 0.5;
    const wg = new THREE.Group();
    wg.position.set(ax, 0, az);
    wg.rotation.y = -Math.atan2(uz, ux);
    g.add(wg);
    const w = { def, group: wg, pieces: [], leaves: [], cut: false, a: [ax, az], b: [bx, bz], t, solid: [], opaque: [] };
    // Lỗ mở đổi sang khoảng [s0, s1] theo chiều dài tường tính từ a
    const opens = (def.open ?? []).map((o) => {
      const c = alongX ? (o.at - ax) / ux : (o.at - az) / uz;
      return { ...o, s0: c - o.w / 2, s1: c + o.w / 2 };
    }).sort((p, q) => p.s0 - q.s0);
    const piece = (s0, s1, base, h, mat = mats.wall, thick = t) => {
      if (s1 - s0 < 0.005 || h < 0.005) return null;
      const m = slab(s1 - s0, h, thick, mat);
      m.position.set((s0 + s1) / 2, base, 0);
      m.userData.base = base;
      m.userData.h = h;
      wg.add(m);
      w.pieces.push(m);
      return m;
    };
    const full = (s0, s1) => {
      piece(s0, s1, 0, B.ceil);
      const sk = piece(s0, s1, 0, 0.1, skirtMat, t + 0.02);
      if (sk) sk.userData.skirt = true;
      w.solid.push([s0, s1]);
      w.opaque.push([s0, s1]);
    };
    let s = 0;
    for (const o of opens) {
      full(s, o.s0);
      if (o.kind === 'window') {
        piece(o.s0, o.s1, 0, B.sill);
        piece(o.s0, o.s1, B.sill + B.winH, B.ceil - B.sill - B.winH);
        const pane = piece(o.s0 + 0.04, o.s1 - 0.04, B.sill + 0.04, B.winH - 0.08, mats.glass, 0.012);
        if (pane) { pane.userData.noShadow = true; pane.userData.glass = true; }
        // Khung nhôm
        piece(o.s0, o.s0 + 0.05, B.sill, B.winH, frameMat, t + 0.02);
        piece(o.s1 - 0.05, o.s1, B.sill, B.winH, frameMat, t + 0.02);
        piece(o.s0, o.s1, B.sill, 0.05, frameMat, t + 0.04);
        piece(o.s0, o.s1, B.sill + B.winH - 0.05, 0.05, frameMat, t + 0.02);
        piece((o.s0 + o.s1) / 2 - 0.025, (o.s0 + o.s1) / 2 + 0.025, B.sill, B.winH, frameMat, t * 0.5);
        w.solid.push([o.s0, o.s1]);
      } else {
        piece(o.s0, o.s1, B.doorH, B.ceil - B.doorH);
        // Khung cửa
        piece(o.s0 - 0.06, o.s0, 0, B.doorH, frameMat, t + 0.04);
        piece(o.s1, o.s1 + 0.06, 0, B.doorH, frameMat, t + 0.04);
        piece(o.s0 - 0.06, o.s1 + 0.06, B.doorH, 0.06, frameMat, t + 0.04);
        if (o.kind === 'door') {
          // Cánh cửa quay quanh bản lề; cửa đôi có hai cánh
          const halves = o.double ? [[o.s0, 1], [o.s1, -1]] : [[o.s0, 1]];
          const lw = (o.s1 - o.s0) / halves.length - 0.01;
          const ds = { def: o, wall: w, leaves: [], open: 0, want: 0, held: false, center: [ax + ux * (o.s0 + o.s1) / 2, az + uz * (o.s0 + o.s1) / 2] };
          for (const [hs, dir] of halves) {
            const pivot = new THREE.Group();
            pivot.position.set(hs, 0, 0);
            const leaf = slab(lw, B.doorH - 0.02, 0.04, doorMat);
            leaf.position.set(dir * (lw / 2 + 0.005), 0.01, 0);
            const handle = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.025, 0.07), handleMat);
            handle.position.set(dir * (lw - 0.1), 1.0, 0);
            const panel = new THREE.Mesh(new THREE.BoxGeometry(lw * 0.3, 0.6, 0.045), mats.glass);
            panel.position.set(dir * (lw / 2), 1.45, 0);
            panel.userData.noShadow = true;
            pivot.add(leaf, handle, panel);
            pivot.userData.dir = dir;
            pivot.userData.info = 'lab-door';
            wg.add(pivot);
            leaf.userData.door = ds;
            ds.leaves.push(pivot);
            w.leaves.push(pivot);
          }
          doors.push(ds);
        }
        // Biển trên cửa, hai mặt tường
        if (o.name) {
          for (const side of [1, -1]) {
            const sg = o.exit ? textSign(o.name, { w: Math.max(1.0, o.w + 0.3), bg: '#1f8a4c', fg: '#ffffff', exit: true }) : o.bio ? safetySign(o.name, { style: 'bio', w: 1.3 }) : textSign(o.name, { w: Math.max(1.2, Math.min(2.6, o.name.length * 0.065)) });
            const sh = sg.geometry.parameters.height;
            sg.position.set((o.s0 + o.s1) / 2, Math.min(B.ceil - sh / 2 - 0.05, B.doorH + 0.08 + sh / 2), side * (t / 2 + 0.006));
            if (side < 0) sg.rotation.y = Math.PI;
            sg.userData.base = B.doorH + 0.07;
            wg.add(sg);
            w.pieces.push(sg);
          }
        }
      }
      s = o.s1;
    }
    full(s, len);
    walls.push(w);
  }

  // Sàn hành lang phía trước (sàn phòng chính dựng trong room.js)
  {
    const geo = new THREE.BoxGeometry(maxX - minX, 0.12, maxZ - 14);
    geo.translate(0, -0.06, 0);
    const floor = new THREE.Mesh(geo, mats.floor);
    floor.position.set((minX + maxX) / 2, 0, (14 + maxZ) / 2);
    g.add(floor);
  }

  // Trần tấm 0,6 m và đèn tấm âm trần (không đổ bóng, không chặn đèn chính)
  const ceilGeo = new THREE.BoxGeometry(maxX - minX, 0.04, maxZ - minZ);
  const ceiling = new THREE.Mesh(ceilGeo, mats.ceiling);
  ceiling.position.set((minX + maxX) / 2, B.ceil + 0.02, (minZ + maxZ) / 2);
  ceiling.userData.noShadow = true;
  g.add(ceiling);
  const nearWall = (x, z) => walls.some((w) => distSeg([x, z], w.a, w.b) < 0.7);
  const lamps = [];
  for (let x = minX + 1.5; x < maxX - 1; x += 3) for (let z = minZ + 1.4; z < maxZ - 0.8; z += 3.6) if (!nearWall(x, z)) lamps.push([x, z]);
  const lampGeo = new THREE.PlaneGeometry(0.6, 1.2);
  lampGeo.rotateX(Math.PI / 2);
  const lamp = new THREE.InstancedMesh(lampGeo, new THREE.MeshBasicMaterial({ color: '#fbfbf4' }), lamps.length);
  const M = new THREE.Matrix4();
  lamps.forEach(([x, z], i) => { M.makeTranslation(x, B.ceil - 0.002, z); lamp.setMatrixAt(i, M); });
  lamp.userData.noShadow = true;
  g.add(lamp);

  // ---- Cắt tường khi nhìn từ trên hoặc khi tường che ----
  function setCut(w, cut) {
    w.cut = cut;
    for (const p of w.pieces) {
      if (p.userData.skirt) continue;
      if ((p.userData.base ?? 0) > 0.001) p.visible = !cut;
      else p.scale.y = cut ? Math.min(1, B.cutH / p.userData.h) : 1;
    }
    for (const l of w.leaves) l.visible = !cut;
  }
  const P = new THREE.Vector3();
  const rays = [[0, 0], [1.6, 0], [-1.6, 0], [0, 1.6], [0, -1.6]];
  let showAll = null;
  function update(camera, target, dt, reduced) {
    const above = camera.position.y > B.ceil + 0.15;
    low = camera.position.y < B.ceil - 0.2;
    ceiling.visible = !above;
    lamp.visible = !above;
    const c = [camera.position.x, camera.position.z];
    const elevated = camera.position.y > 2.2;
    // Hướng nhìn trên mặt sàn, để rải các tia kiểm tra quanh điểm nhìn
    const fx = target.x - c[0];
    const fz = target.z - c[1];
    const fl = Math.hypot(fx, fz) || 1;
    for (const w of walls) {
      let cut = above;
      if (!cut && elevated) {
        cut = rays.some(([u, v]) => {
          P.set(target.x + (fx / fl) * v - (fz / fl) * u, 0, target.z + (fz / fl) * v + (fx / fl) * u);
          return segHit(c, [P.x, P.z], w.a, w.b, w.t / 2 + 0.15);
        });
      }
      if (showAll === null || cut !== w.cut) setCut(w, cut);
    }
    showAll = false;
    // Cửa tự mở khi người đứng gần (ở tầm mắt), đóng lại khi đi xa, trừ cửa đã bấm giữ mở
    for (const d of doors) {
      const near = camera.position.y < 2.4 && Math.hypot(c[0] - d.center[0], c[1] - d.center[1]) < 1.9;
      d.want = d.held || near ? 1 : 0;
      d.open = reduced ? d.want : d.open + Math.sign(d.want - d.open) * Math.min(Math.abs(d.want - d.open), dt * 2.5);
      for (const p of d.leaves) p.rotation.y = -p.userData.dir * d.open * Math.PI * 0.5;
    }
  }

  // Đoạn tường đặc (trừ cửa, lối mở) cho va chạm: [ax, az, bx, bz, nửa bề dày]; đoạn che khuất thì bỏ thêm cửa sổ
  const segs = [];
  const opaque = [];
  for (const w of walls) {
    const [ax, az] = w.a;
    const len = Math.hypot(w.b[0] - ax, w.b[1] - az);
    const ux = (w.b[0] - ax) / len;
    const uz = (w.b[1] - az) / len;
    for (const [s0, s1] of w.solid) if (s1 - s0 > 0.01) segs.push([ax + ux * s0, az + uz * s0, ax + ux * s1, az + uz * s1, w.t / 2]);
    for (const [s0, s1] of w.opaque) if (s1 - s0 > 0.01) opaque.push([[ax + ux * s0, az + uz * s0], [ax + ux * s1, az + uz * s1]]);
  }
  // Nhãn ở sau tường kín (camera thấp hơn trần, tường đang không bị cắt) thì ẩn: đứng trong một phòng không thấy chữ
  // của phòng bên cạnh xuyên qua tường
  let low = false;
  const blocked = (cam, p) => {
    if (!low) return false;
    const c = [cam.x, cam.z];
    const q = [p.x, p.z];
    return opaque.some(([a, b]) => segHit(c, q, a, b, 0.02));
  };

  return {
    group: g,
    update,
    segments: () => segs,
    blocked,
    // Đồ treo trên tường (biển, sơ đồ, hộp găng): ẩn cùng lúc với phần trên của bức tường gần nhất khi tường bị cắt thấp
    attach(obj) {
      obj.updateWorldMatrix(true, false);
      const p = new THREE.Vector3().setFromMatrixPosition(obj.matrixWorld);
      let best = null;
      for (const w of walls) {
        const d = distSeg([p.x, p.z], w.a, w.b) - w.t / 2;
        if (d < 0.45 && (!best || d < best.d)) best = { w, d };
      }
      if (!best) return false;
      obj.userData.base = 1;
      best.w.pieces.push(obj);
      return true;
    },
    rooms: B.rooms,
    // Bấm cánh cửa: giữ mở hoặc thả cho tự đóng
    wire(clicker) { for (const d of doors) for (const p of d.leaves) clicker.add(p, () => { d.held = !d.held; }); },
  };
}

function distSeg([px, pz], [ax, az], [bx, bz]) {
  const dx = bx - ax, dz = bz - az;
  const l2 = dx * dx + dz * dz || 1;
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (pz - az) * dz) / l2));
  return Math.hypot(px - ax - t * dx, pz - az - t * dz);
}

// Tia c → p có cắt đoạn tường a–b (nới rộng pad hai bên) không
function segHit(c, p, a, b, pad) {
  const cross = (ux, uz, vx, vz) => ux * vz - uz * vx;
  const rx = p[0] - c[0], rz = p[1] - c[1];
  const sx = b[0] - a[0], sz = b[1] - a[1];
  const den = cross(rx, rz, sx, sz);
  if (Math.abs(den) < 1e-9) return false;
  const qx = a[0] - c[0], qz = a[1] - c[1];
  const t = cross(qx, qz, sx, sz) / den;
  const u = cross(qx, qz, rx, rz) / den;
  const sl = Math.hypot(sx, sz);
  const rl = Math.hypot(rx, rz);
  return t > pad / rl && t < 1 - pad / rl && u > -pad / sl && u < 1 + pad / sl;
}
