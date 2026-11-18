import * as THREE from 'three';
import { tint, box, put } from './materials.js';
import { CATBA } from './layout.js';

// Sa bàn quần đảo Cát Bà dựng từ dữ liệu vệ tinh (data/catba/, tools/catba/fetch.py): mặt địa hình theo độ cao
// Copernicus DEM, phủ ảnh màu thật Sentinel-2 hoặc lớp tô màu độ cao; đinh ghim ở các điểm khảo sát của bài thực tập.
// Tỉ lệ ngang 1 : data.scale, độ cao phóng đại data.exaggeration lần. Bắc ở phía −z, đông ở phía +x.
// Bấm lên mặt bản đồ: onPick(u, v) với u từ tây sang đông, v từ bắc xuống nam (0–1). Bấm đinh ghim: onSite(id).

const KIND_COLOR = { cave: '#e2574c', obs: '#f2b134', place: '#4f8fd6', peak: '#9a6b3f', shore: '#2bb3a3', mangrove: '#3f9b4a', town: '#8d6fd1' };
// Thang màu độ cao (m) cho lớp "Độ cao"
const RAMP = [[0, [47, 107, 58]], [40, [96, 150, 72]], [100, [214, 196, 96]], [200, [150, 100, 62]], [280, [240, 240, 236]]];

function rampColor(h) {
  for (let k = 1; k < RAMP.length; k++) {
    if (h <= RAMP[k][0]) {
      const [h0, c0] = RAMP[k - 1];
      const [h1, c1] = RAMP[k];
      const t = (h - h0) / (h1 - h0);
      return c0.map((c, i) => Math.round(c + (c1[i] - c) * t));
    }
  }
  return RAMP[RAMP.length - 1][1];
}

export function buildCatBaMap(root, labels, { data, meta, grid, textureUrl, onSite, onPick, reduced }) {
  const group = new THREE.Group();
  root.add(group);
  const W = (meta.utm.x1 - meta.utm.x0) / data.scale;
  const D = (meta.utm.y1 - meta.utm.y0) / data.scale;
  const ex = data.exaggeration / data.scale;
  const x0 = CATBA.x - W / 2;
  const z0 = CATBA.z - D / 2;
  const top = CATBA.y;

  // Bệ sa bàn: mặt bệ thấp hơn mực nước biển một chút để không giành điểm ảnh với mặt biển của bản đồ
  put(group, box(W + 0.5, top + 0.14 - 0.012, D + 0.5, tint('#3a4651')), CATBA.x, -0.14, CATBA.z);

  // Độ cao (m) tại vị trí u, v trên bản đồ, nội suy song tuyến giữa tâm các ô lưới
  const elevAt = (u, v) => {
    if (!grid) return 0;
    const fx = Math.min(Math.max(u * grid.w - 0.5, 0), grid.w - 1.001);
    const fy = Math.min(Math.max(v * grid.h - 0.5, 0), grid.h - 1.001);
    const i = Math.floor(fx);
    const j = Math.floor(fy);
    const tx = fx - i;
    const ty = fy - j;
    const e = grid.elev;
    const w = grid.w;
    return e[j * w + i] * (1 - tx) * (1 - ty) + e[j * w + i + 1] * tx * (1 - ty) + e[(j + 1) * w + i] * (1 - tx) * ty + e[(j + 1) * w + i + 1] * tx * ty;
  };
  const yAt = (u, v) => top + elevAt(u, v) * ex;
  const worldOf = (u, v, lift = 0) => new THREE.Vector3(x0 + u * W, yAt(u, v) + lift, z0 + v * D);

  // Mặt địa hình: lưới lấy cách 2 ô (100 m) cho nhẹ trên điện thoại; ảnh nền 12,5 m giữ chi tiết.
  // Thêm "váy" bốn cạnh xuống mặt bệ để chỗ đất chạm mép bản đồ không hở.
  const step = 2;
  const nx = grid ? Math.floor((grid.w - 1) / step) + 1 : 2;
  const nz = grid ? Math.floor((grid.h - 1) / step) + 1 : 2;
  const pos = [];
  const uv = [];
  const idx = [];
  const uOf = (i) => (grid ? (i * step + 0.5) / grid.w : i);
  const vOf = (j) => (grid ? (j * step + 0.5) / grid.h : j);
  for (let j = 0; j < nz; j++) {
    for (let i = 0; i < nx; i++) {
      const u = i === 0 ? 0 : i === nx - 1 ? 1 : uOf(i);
      const v = j === 0 ? 0 : j === nz - 1 ? 1 : vOf(j);
      pos.push(x0 + u * W, yAt(u, v), z0 + v * D);
      uv.push(u, 1 - v);
    }
  }
  for (let j = 0; j < nz - 1; j++) {
    for (let i = 0; i < nx - 1; i++) {
      const a = j * nx + i;
      idx.push(a, a + nx, a + 1, a + 1, a + nx, a + nx + 1);
    }
  }
  const edge = (list) => {
    for (let k = 0; k < list.length - 1; k++) {
      const [a, b] = [list[k], list[k + 1]];
      const base = pos.length / 3;
      for (const p of [a, b]) { pos.push(pos[3 * p], top - 0.002, pos[3 * p + 2]); uv.push(uv[2 * p], uv[2 * p + 1]); }
      idx.push(a, base, b, b, base, base + 1);
    }
  };
  const row = (j) => Array.from({ length: nx }, (_, i) => j * nx + i);
  const col = (i) => Array.from({ length: nz }, (_, j) => j * nx + i);
  edge(row(0).reverse());
  edge(row(nz - 1));
  edge(col(0));
  edge(col(nx - 1).reverse());
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  geo.computeBoundingBox();
  geo.computeBoundingSphere();

  const sat = new THREE.TextureLoader().load(textureUrl);
  sat.colorSpace = THREE.SRGBColorSpace;
  sat.anisotropy = 8;
  const mat = new THREE.MeshStandardMaterial({ map: sat, roughness: 0.95, metalness: 0 });
  const terrain = new THREE.Mesh(geo, mat);
  group.add(terrain);

  // Lớp tô màu độ cao, vẽ từ chính lưới DEM
  let heightTex = null;
  function heightTexture() {
    if (heightTex || !grid) return heightTex;
    const cv = document.createElement('canvas');
    cv.width = grid.w;
    cv.height = grid.h;
    const ctx = cv.getContext('2d');
    const img = ctx.createImageData(grid.w, grid.h);
    for (let k = 0; k < grid.w * grid.h; k++) {
      const c = grid.land[k] >= 128 ? rampColor(grid.elev[k]) : [58, 110, 150];
      img.data.set([...c, 255], 4 * k);
    }
    ctx.putImageData(img, 0, 0);
    heightTex = new THREE.CanvasTexture(cv);
    heightTex.colorSpace = THREE.SRGBColorSpace;
    return heightTex;
  }

  // Tia bấm đi dọc theo tia trên lưới độ cao thay cho thử từng tam giác (mặt có hơn 100 nghìn tam giác)
  const bbox = geo.boundingBox;
  const tmp = new THREE.Vector3();
  terrain.raycast = (raycaster, hits) => {
    const ray = raycaster.ray;
    if (!ray.intersectBox(bbox, tmp)) return;
    const t0 = ray.origin.distanceTo(tmp);
    const len = bbox.max.clone().sub(bbox.min).length();
    const dt = (W / (grid?.w ?? 200)) * 0.5;
    const p = new THREE.Vector3();
    const below = (t) => {
      ray.at(t, p);
      const u = (p.x - x0) / W;
      const v = (p.z - z0) / D;
      if (u < 0 || u > 1 || v < 0 || v > 1) return null;
      return p.y <= yAt(u, v);
    };
    let prev = t0;
    for (let t = t0; t <= t0 + len; t += dt) {
      const b = below(t);
      if (b) {
        let lo = prev;
        let hi = t;
        for (let k = 0; k < 12; k++) {
          const mid = (lo + hi) / 2;
          if (below(mid)) hi = mid; else lo = mid;
        }
        ray.at(hi, p);
        if (hi < raycaster.near || hi > raycaster.far) return;
        hits.push({ distance: hi, point: p.clone(), object: terrain });
        return;
      }
      prev = t;
    }
  };

  // Đinh ghim các điểm khảo sát
  const pins = new THREE.Group();
  group.add(pins);
  const pinGeo = new THREE.CylinderGeometry(0.02, 0.02, 1, 6);
  const headGeo = new THREE.SphereGeometry(0.1, 14, 10);
  const siteAt = new Map();
  for (const s of data.sites) {
    const m = s.map;
    if (!m || m.u < 0 || m.u > 1 || m.v < 0 || m.v > 1) continue;
    const base = worldOf(m.u, m.v);
    const h = s.kind === 'obs' ? 0.55 : 0.95;
    const pin = new THREE.Group();
    const stick = new THREE.Mesh(pinGeo, tint('#d9dee3'));
    stick.scale.y = h;
    stick.position.set(base.x, base.y + h / 2, base.z);
    const head = new THREE.Mesh(headGeo, tint(KIND_COLOR[s.kind] ?? '#4f8fd6'));
    head.position.set(base.x, base.y + h, base.z);
    if (s.kind === 'obs') head.scale.setScalar(0.65);
    pin.add(stick, head);
    pin.userData.info = () => ({
      name: s.name,
      use: s.lesson ?? 'Địa danh để đọc bản đồ.',
      how: [s.dms, `Toạ độ: ${data.sources[s.source] ?? s.source}.`, ...(s.note ? [s.note] : [])],
    });
    pins.add(pin);
    siteAt.set(s.id, pin);
    labels.add(s.name, new THREE.Vector3(base.x, base.y + h + 0.24, base.z), { kind: 'site', max: s.kind === 'obs' || s.kind === 'peak' ? 12 : s.kind === 'place' && s.id !== 'aoech' ? 22 : 70, onClick: () => onSite?.(s.id) });
  }
  for (const w of data.waters ?? []) {
    if (!w.map) continue;
    labels.add(w.name, worldOf(w.map.u, w.map.v, 0.05), { kind: 'sub', max: 45 });
  }

  // Thước tỉ lệ 5 km, mũi tên chỉ hướng bắc, ghi công nguồn dữ liệu ở mép nam
  const km = 1000 / data.scale;
  const barZ = z0 + D + 0.25;
  for (let k = 0; k < 5; k++) put(group, box(km, 0.03, 0.08, tint(k % 2 ? '#f4f6f8' : '#1d2329'), false), x0 + 0.4 + km * (k + 0.5), top, barZ);
  labels.add('5 km', new THREE.Vector3(x0 + 0.4 + 2.5 * km, top + 0.2, barZ), { kind: 'sub', max: 45 });
  const arrow = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.6, 3), tint('#e2574c'));
  arrow.rotation.x = -Math.PI / 2;
  arrow.position.set(x0 + W + 0.25, top + 0.05, z0 + 0.6);
  group.add(arrow);
  labels.add('Bắc', new THREE.Vector3(x0 + W + 0.25, top + 0.3, z0 + 0.1), { kind: 'sub', max: 45 });
  labels.add(`Ảnh: Copernicus Sentinel-2 (${meta.satellite.date.split('-').reverse().join('/')}) · Độ cao: Copernicus DEM GLO-30 · cao phóng đại ${data.exaggeration} lần`, new THREE.Vector3(CATBA.x + 5.5, top + 0.2, barZ), { kind: 'sub', max: 80 });

  // Điểm vừa đọc toạ độ và đường chim bay vừa đo
  const marker = new THREE.Group();
  const cone = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.3, 12), tint('#ff3b6b'));
  cone.rotation.x = Math.PI;
  cone.position.y = 0.15;
  marker.add(cone);
  marker.visible = false;
  group.add(marker);
  const markerLabel = labels.add('', new THREE.Vector3(0, 0.45, 0), { kind: 'container', max: 40, parent: marker });
  let route = null;

  function setLayer(layer) {
    const t = layer === 'height' ? heightTexture() : sat;
    if (t && mat.map !== t) { mat.map = t; mat.needsUpdate = true; }
  }

  return {
    group,
    terrain,
    worldOf,
    // u, v của điểm trúng trên mặt bản đồ
    uvOf: (point) => ({ u: (point.x - x0) / W, v: (point.z - z0) / D }),
    pick(hit) { const { u, v } = this.uvOf(hit.point); onPick?.(u, v); },
    setLayer,
    setMarker(m, text) {
      if (!m) { marker.visible = false; return; }
      marker.position.copy(worldOf(m.u, m.v));
      markerLabel.element.textContent = text;
      marker.visible = true;
    },
    // pts: [{ u, v }] dọc đường; vẽ đường vàng nổi trên mặt địa hình
    setRoute(pts) {
      if (route) { group.remove(route); route.geometry.dispose(); route = null; }
      if (!pts?.length) return;
      // Ống mảnh thay cho đường kẻ (WebGL chỉ vẽ đường rộng 1 điểm ảnh)
      const curve = new THREE.CatmullRomCurve3(pts.map((p) => worldOf(p.u, p.v, 0.05)));
      route = new THREE.Mesh(new THREE.TubeGeometry(curve, Math.min(400, pts.length * 2), 0.03, 6, false), tint('#ffd23f'));
      group.add(route);
    },
    sitePin: (id) => siteAt.get(id) ?? null,
    reduced,
  };
}
