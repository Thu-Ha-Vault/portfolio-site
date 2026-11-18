import * as THREE from 'three';
import { tint, box, put, cyl, tagGroup } from './materials.js';
import { DISSECT } from './layout.js';
import { anatomyOf } from '../core/anatomy/index.js';
import { primsGroup, centerOf } from './anatomy-mesh.js';
import { tube as tubePrim, blob as blobPrim, bounds, primPoints } from '../core/anatomy/kit.js';

// Khu giải phẫu động vật: phần bàn nối dài mặt inox, khay mổ đáy sáp, lọ mẫu của từng loài trong data/dissection.json,
// dụng cụ mổ, kính lúp, bình tia nước, túi rác sinh học. Mẫu trên khay và mẫu thu nhỏ trong lọ dựng từ hình học giải phẫu
// dùng chung với hình SVG (src/core/anatomy/, src/scene/anatomy-mesh.js), theo trạng thái của lõi (src/core/dissect.js):
// đặt mặt nào lên, ghim, đường cắt, mở khoang, gỡ ống tiêu hoá, nước, dịch tràn. Nội quan có chú thích (rê chuột xem tên
// và chức năng), bấm vào để quan sát.

const V = (x, y, z) => new THREE.Vector3(x, y, z);

export function buildDissectBench(root, labels, { data, onTake, onTool, onOrgan }) {
  const D = DISSECT;
  const top = D.top;
  const cx = (D.x0 + D.x1) / 2;
  const w = D.x1 - D.x0;
  // Bàn nối dài: chân tủ và mặt inox, sát mép phải bàn trung tâm
  const legs = put(root, box(w - 0.2, top - 0.05, D.d - 0.3, tint('#cfd6dc')), cx + 0.05, 0, D.z);
  const slab = put(root, box(w, 0.05, D.d, tint('#b9c2c9', { metalness: 0.4, roughness: 0.35 })), cx, top - 0.05, D.z);
  tagGroup(root, [legs, slab], 'dissect-bench');
  labels.add('Giải phẫu động vật', V(cx, top + 0.01, D.z + D.d / 2 - 0.08), { kind: 'sub', max: 7 });

  // Khay mổ: chậu nhôm thành mỏng, lớp sáp đen dày 25,4 mm ở đáy (Eisco BI0186QWX, cỡ thật)
  const T = D.tray;
  const tray = new THREE.Group();
  const alu = tint('#c5ccd2', { metalness: 0.5, roughness: 0.4 });
  const t = 0.0015;
  put(tray, box(T.w, t, T.d, alu), 0, 0, 0);
  for (const s of [-1, 1]) {
    put(tray, box(t, T.h, T.d, alu), s * (T.w / 2 - t / 2), 0, 0);
    put(tray, box(T.w, T.h, t, alu), 0, 0, s * (T.d / 2 - t / 2));
  }
  put(tray, box(T.w - 2 * t, T.wax, T.d - 2 * t, tint('#25292e', { tex: 'wax', roughness: 0.6 }), false), 0, t, 0);
  tray.position.set(T.x, top, T.z);
  tray.userData.info = 'dissect-tray';
  root.add(tray);
  const floorY = top + t + T.wax + 0.001;

  // Lọ mẫu: lọ thuỷ tinh có nắp, hình mẫu bên trong
  const jars = new Map();
  const J = D.jars;
  // Lọ mẫu xếp hai hàng sau khay, mỗi hàng 5 lọ
  Object.keys(data.specimens).forEach((id, i) => {
    const S = data.specimens[id];
    const g = new THREE.Group();
    put(g, cyl(J.r, J.r, J.h, tint('#d6e6ee', { transparent: true, opacity: 0.45, roughness: 0.1 })), 0, 0, 0);
    put(g, cyl(J.r * 1.04, J.r * 1.04, 0.025, tint('#3a4651')), 0, J.h, 0);
    // Mẫu thu nhỏ trong lọ: dựng từ hình học giải phẫu của loài, thu cho vừa lòng lọ
    const closed = anatomyOf(id, {}).closed('up');
    const bb = bounds(closed.filter((p) => p.only !== 'svg' && p.t !== 'text').flatMap(primPoints));
    const mini = primsGroup(closed, { L: (J.r * 1.7) / Math.max(bb.w, bb.h), cx: bb.cx, cy: bb.cy, base: 0, tex: anatomyOf(id, {}).skin ?? 'skin' });
    mini.position.y = J.h * 0.18;
    mini.rotation.y = 0.5;
    g.add(mini);
    g.position.set(J.x0 + (i % 5) * J.dx, top, J.z - Math.floor(i / 5) * 0.16);
    g.userData.info = () => ({ name: `Lọ mẫu: ${S.name}`, use: `${S.sci}. ${S.lesson}. Bấm để lấy mẫu ra khay mổ.`, how: [S.how], safety: data.ethics });
    root.add(g);
    jars.set(id, g);
    labels.add(S.name.split(' (')[0], V(g.position.x, top + J.h + 0.06, g.position.z), { kind: 'item', max: 4 });
  });

  // Dụng cụ mổ trên khăn bên phải khay
  const tl = D.tools;
  put(root, box(0.36, 0.003, 0.42, tint('#2f6f8f'), false), tl.x + 0.1, top, tl.z);
  const steel = tint('#d4dade', { metalness: 0.6, roughness: 0.3 });
  const tools = {};
  const tool = (key, info, parts, x, z, rot = 0) => {
    const g = new THREE.Group();
    for (const p of parts) g.add(p);
    g.position.set(x, top + 0.004, z);
    g.rotation.y = rot;
    g.userData.info = info;
    root.add(g);
    tools[key] = g;
    return g;
  };
  const bar = (len, wid, h, mat, x = 0, z = 0) => { const m = new THREE.Mesh(new THREE.BoxGeometry(len, h, wid), mat); m.position.set(x, h / 2, z); return m; };
  // Kéo: hai lưỡi bắt chéo, hai vòng tay cầm
  const ringGeo = new THREE.TorusGeometry(0.012, 0.0025, 6, 16);
  const ring = (x, z) => { const r = new THREE.Mesh(ringGeo, steel); r.rotation.x = Math.PI / 2; r.position.set(x, 0.003, z); return r; };
  const b1 = bar(0.1, 0.006, 0.003, steel); b1.rotation.y = 0.12;
  const b2 = bar(0.1, 0.006, 0.003, steel); b2.rotation.y = -0.12;
  tool('cut', 'dissect-scissors', [b1, b2, ring(0.06, 0.012), ring(0.06, -0.012)], tl.x - 0.03, tl.z - 0.13, Math.PI / 2);
  // Dao mổ: cán dẹt và lưỡi
  tool('remove', 'scalpel', [bar(0.09, 0.012, 0.004, steel, 0.02), bar(0.035, 0.008, 0.002, tint('#eef2f4', { metalness: 0.7, roughness: 0.2 }), -0.045)], tl.x + 0.05, tl.z - 0.13, Math.PI / 2);
  // Kẹp: hai thanh chụm đầu
  const f1 = bar(0.11, 0.005, 0.003, steel, 0, 0.004); f1.rotation.y = 0.05;
  const f2 = bar(0.11, 0.005, 0.003, steel, 0, -0.004); f2.rotation.y = -0.05;
  tool('open', 'forceps', [f1, f2], tl.x + 0.13, tl.z - 0.12, Math.PI / 2);
  // Kim mũi mác
  tool('needle', 'dissect-needle', [bar(0.07, 0.008, 0.008, tint('#8a5a3a')), bar(0.05, 0.002, 0.002, steel, -0.06)], tl.x + 0.21, tl.z - 0.12, Math.PI / 2);
  // Hộp đinh ghim
  const pins = [put(new THREE.Group(), box(0.07, 0.025, 0.05, tint('#e6e9ec')), 0, 0, 0)];
  for (let i = 0; i < 6; i++) { const p = new THREE.Mesh(new THREE.SphereGeometry(0.004, 6, 4), tint(['#e2574c', '#f2b134', '#4f8fd6'][i % 3])); p.position.set(-0.025 + (i % 3) * 0.025, 0.028, -0.012 + Math.floor(i / 3) * 0.024); pins.push(p); }
  tool('pin', 'dissect-pins', pins, tl.x - 0.01, tl.z + 0.09);
  // Kính lúp cầm tay: vành, mặt kính, cán
  const lensRing = new THREE.Mesh(new THREE.TorusGeometry(0.035, 0.004, 8, 24), tint('#2b3036'));
  lensRing.rotation.x = Math.PI / 2;
  lensRing.position.y = 0.006;
  const glass = new THREE.Mesh(new THREE.CylinderGeometry(0.034, 0.034, 0.003, 24), tint('#cfe6f3', { transparent: true, opacity: 0.45, roughness: 0.05 }));
  glass.position.y = 0.006;
  const lens = tool('lens', 'magnifier', [lensRing, glass, bar(0.07, 0.01, 0.008, tint('#2b3036'), 0.07)], tl.x + 0.12, tl.z + 0.1);
  const lensHome = lens.position.clone();
  // Bình tia nước
  tool('water', 'dissect-water', [put(new THREE.Group(), cyl(0.028, 0.03, 0.12, tint('#e9f2f7', { transparent: true, opacity: 0.7 })), 0, 0, 0), put(new THREE.Group(), cyl(0.004, 0.006, 0.05, tint('#e2574c'), { edges: false }), 0.0, 0.12, 0)], tl.x + 0.2, tl.z + 0.16);
  // Túi rác sinh học (đỏ cam) cạnh bàn
  tool('clean', 'biohazard-bag', [put(new THREE.Group(), box(0.16, 0.2, 0.14, tint('#d9532c')), 0, 0, 0)], D.x1 - 0.18, D.z - 0.5);
  for (const k of ['cut', 'remove', 'open', 'pin', 'water', 'clean']) labels.add({ cut: 'Kéo', remove: 'Dao', open: 'Kẹp', pin: 'Ghim', water: 'Nước', clean: 'Rác sinh học' }[k], tools[k].position.clone().add(V(0, 0.06, 0)), { kind: 'item', max: 1.4 });

  // ---- Mẫu trên khay ----
  const spec = new THREE.Group();
  spec.position.set(T.x, floorY, T.z);
  root.add(spec);
  let current = null;
  const organMeshes = new Map();
  const seenLabels = [];

  function clear() {
    spec.clear();
    organMeshes.clear();
    for (const l of seenLabels) labels.remove(l);
    seenLabels.length = 0;
  }

  // Mẫu dựng từ hình học giải phẫu dùng chung (src/core/anatomy/), cùng hình với hình SVG trong thẻ kết quả
  function setAnatomy(f, S) {
    const art = anatomyOf(f.specimen, f);
    const L = S.body.length;
    const [cx, cy] = art.center ?? centerOf(art.closed('up'));
    const opt = { L, cx, cy };
    const tilt = f.specimen === 'carp' && f.place && f.place !== 'side';
    const holder = new THREE.Group();
    if (tilt) { holder.rotation.x = f.place === 'dorsal' ? -Math.PI / 2 : Math.PI / 2; holder.position.y = S.body.width * 0.25; }
    spec.add(holder);
    const place = f.place === S.place || !f.place ? 'up' : 'down';
    const surface = (art.surface ?? 0.12) * L;
    const floor = (art.floor ?? 0.06) * L;
    if (!f.open) {
      const body = primsGroup(art.closed(place), { ...opt, base: 0, tex: art.skin ?? 'skin' });
      body.userData.info = () => ({ name: S.name, use: `${S.sci}. ${f.place ? `Đang ${data.places[f.place]}.` : 'Chưa đặt tư thế.'}`, how: [S.how] });
      holder.add(body);
      if (f.cut && art.cut) holder.add(primsGroup([tubePrim(art.cut(f.cut.line), (f.cut.depth === 'deep' ? 0.0013 : 0.0008) / L, { c: f.cut.depth === 'deep' ? '#4a0c0f' : '#7a2a2a' })], { ...opt, base: surface }));
    } else {
      holder.add(primsGroup(art.opened.body, { ...opt, base: 0, hScale: art.openScale ?? 0.5, tex: art.skin ?? 'skin' }));
      holder.add(primsGroup(art.opened.flaps, { ...opt, base: floor * 0.6 }));
      holder.add(primsGroup(art.opened.cavity, { ...opt, base: floor }));
      if (f.removed && art.opened.deep) holder.add(primsGroup(art.opened.deep, { ...opt, base: floor + 0.0006 }));
    }
    for (const o of S.organs) {
      const A = art.organs[o.id];
      if (!A || (A.when && !A.when(f))) continue;
      if (o.layer > 0) {
        if (!f.open) continue;
        if (o.layer === 2 && !f.removed) continue;
        if (o.layer === 1 && o.gut && f.removed) continue;
        if (f.open === 'partial' && o.pos[1] < 0) continue;
      }
      const m = primsGroup(A.parts, { ...opt, base: o.layer > 0 ? floor + 0.0008 : 0, dark: f.damaged.includes(o.id) });
      if (!m.children.length) continue;
      const name = o.sexed ? (f.male ? 'Tinh hoàn' : 'Buồng trứng') : o.name;
      m.userData.info = () => ({ name, use: o.fn, how: [`Hệ: ${o.system}.${o.small ? ' Phần nhỏ: cần kính lúp.' : ''}`] });
      m.userData.organ = o.id;
      holder.add(m);
      organMeshes.set(o.id, m);
      if (f.seen.slice(-3).includes(o.id)) {
        const box = new THREE.Box3().setFromObject(m);
        const p = box.getCenter(new THREE.Vector3());
        p.y = box.max.y;
        seenLabels.push(labels.add(`✓ ${name}`, p.add(V(0, 0.02, 0)), { kind: 'item', max: 1.6 }));
      }
    }
    if (f.obscured && f.open && art.spill) {
      const sp = art.spill;
      const pts = Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * Math.PI * 2; const r = 0.8 + 0.35 * Math.sin(i * 2.3); return [sp.at[0] + Math.cos(a) * sp.r[0] * r, sp.at[1] + Math.sin(a) * sp.r[1] * r]; });
      holder.add(primsGroup([blobPrim(pts, { c: sp.c, op: 0.75, h: 0.004, gloss: 1 })], { ...opt, base: floor + 0.03 * L }));
    }
    return art;
  }

  // f: figureData() của lõi
  function set(f) {
    clear();
    for (const [id, j] of jars) j.visible = f.specimen !== id;
    current = f.specimen;
    if (!f.specimen) return;
    const S = data.specimens[f.specimen];
    const art = setAnatomy(f, S);
    pinsAndWater(f, S, art);
  }

  // Đinh ghim cắm quanh mẫu theo vị trí trong hình học giải phẫu, và nước ngập mẫu
  function pinsAndWater(f, S, art) {
    const L = S.body.length;
    const W = S.body.width;
    const [cx, cy] = art.center ?? centerOf(art.closed('up'));
    const raw = (f.pins >= 4 ? art.pins[4] : f.pins >= 2 ? art.pins[2] : null) ?? [];
    const pinPts = raw.map(([x, y]) => [((x - cx) * L) / (L * 1.02), ((y - cy) * L) / (W * 0.9)]);
    // Đinh ghim nhỏ lại theo cỡ mẫu (chuột, gián nhỏ hơn ếch)
    const k = Math.min(1, Math.max(0.5, L / 0.2));
    for (const [px, pz] of pinPts) {
      const p = new THREE.Group();
      const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.0012 * k, 0.0012 * k, 0.04 * k, 4), tint('#d4dade'));
      shaft.position.y = 0.02 * k;
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.0045 * k, 8, 6), tint('#e2574c'));
      head.position.y = 0.04 * k;
      p.add(shaft, head);
      // Ghim nghiêng khoảng 45° ra ngoài như khi thực hành (ảnh ĐVKXS của chủ dự án)
      p.rotation.z = -Math.sign(px) * 0.6;
      p.rotation.x = pz * 0.5;
      p.position.set(px * L * 1.02, 0, pz * W * 0.9);
      spec.add(p);
    }
    // Nước ngập mẫu
    if (f.water) {
      const water = new THREE.Mesh(new THREE.BoxGeometry(T.w - 0.035, 0.03, T.d - 0.035), new THREE.MeshStandardMaterial({ color: '#7fb6d6', transparent: true, opacity: 0.22, roughness: 0.05, depthWrite: false }));
      water.position.y = 0.015;
      spec.add(water);
    }
  }

  // Kính lúp: đưa lên trên khay (đang dùng) hoặc đặt lại khăn
  function setLens(on) {
    if (on) { lens.position.set(T.x + T.w / 2 - 0.06, top + 0.1, T.z + T.d / 2 - 0.04); lens.rotation.set(-0.35, 0.6, 0); }
    else { lens.position.copy(lensHome); lens.rotation.set(0, 0, 0); }
  }

  return {
    jars,
    tools,
    tray,
    set,
    setLens,
    organAt: (object) => { for (let x = object; x; x = x.parent) if (x.userData.organ) return x.userData.organ; return null; },
    organs: () => [...organMeshes.values()],
    hasSpecimen: () => Boolean(current),
    length: () => (current ? data.specimens[current].body.length : null),
    // Bấm: lọ mẫu → lấy mẫu; dụng cụ → thao tác; nội quan → quan sát
    wire(clicker) {
      for (const [id, j] of jars) clicker.add(j, () => onTake?.(id));
      for (const [k, g] of Object.entries(tools)) if (k !== 'needle') clicker.add(g, () => onTool?.(k));
      clicker.add(spec, (hit) => { const id = this.organAt(hit.object); if (id) onOrgan?.(id); });
    },
  };
}
