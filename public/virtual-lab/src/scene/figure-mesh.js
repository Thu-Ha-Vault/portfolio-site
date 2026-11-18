import * as THREE from 'three';
import { tint } from './materials.js';

// Máy 3D dựng từ hình học của hình chi tiết (data/machines3d/<máy>.json, xuất bằng tools/parts3d/export.mjs): cùng các
// khối mà figures/<hình>/build.mjs vẽ, đổi sang mét và trục của cảnh. Các phần cùng màu và chất liệu gộp thành một lưới
// để nhẹ máy. Gốc của nhóm là tâm đáy máy, mặt trước hướng +z như mô hình low-poly cũ (machine-models.js).

const AX = { x: 0, y: 1, z: 2 };

// Ma trận đổi toạ độ hình → cảnh: hàng i của three lấy trục axes[i] của hình (dấu '-' là ngược), nhân unit, dời origin
function figureMatrix({ unit, axes, origin }) {
  const m = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  axes.forEach((a, i) => { m[i][AX[a.replace('-', '')]] = (a.startsWith('-') ? -1 : 1) * unit; });
  const M = new THREE.Matrix4().set(...m[0], 0, ...m[1], 0, ...m[2], 0, 0, 0, 0, 1);
  const o = new THREE.Vector3(...origin).applyMatrix4(M);
  M.setPosition(-o.x, -o.y, -o.z);
  return M;
}

const v3 = (a) => new THREE.Vector3(a[0], a[1], a[2]);

// Khung F = { o, a, u, v } của kit: a là trục đùn hoặc trục tiện, u và v là mặt cắt
function frameMatrix(cols, o) {
  const M = new THREE.Matrix4().makeBasis(v3(cols[0]), v3(cols[1]), v3(cols[2]));
  M.setPosition(v3(o));
  return M;
}

function shapeGeometry(s) {
  if (s.kind === 'prism') {
    const shape = new THREE.Shape(s.poly.map(([x, y]) => new THREE.Vector2(x, y)));
    const g = new THREE.ExtrudeGeometry(shape, { depth: s.s1 - s.s0, bevelEnabled: false, curveSegments: 6 });
    const F = s.F;
    g.applyMatrix4(frameMatrix([F.u, F.v, F.a], [F.o[0] + F.a[0] * s.s0, F.o[1] + F.a[1] * s.s0, F.o[2] + F.a[2] * s.s0]));
    return { g, det: new THREE.Matrix3().set(...F.u, ...F.v, ...F.a).transpose().determinant() };
  }
  if (s.kind === 'body') {
    // Khối tiện: profile [s, r] quay quanh trục a; LatheGeometry quay quanh trục y cục bộ (x = r sin φ, z = r cos φ)
    const pts = s.poly.map(([t, r]) => new THREE.Vector2(Math.max(0, r), t));
    const g = new THREE.LatheGeometry(pts, 24);
    const F = s.F;
    g.applyMatrix4(frameMatrix([F.u, F.a, F.v], F.o));
    return { g, det: new THREE.Matrix3().set(...F.u, ...F.a, ...F.v).transpose().determinant() };
  }
  if (s.kind === 'box') {
    const g = new THREE.BoxGeometry(s.half[0] * 2, s.half[1] * 2, s.half[2] * 2);
    g.applyMatrix4(frameMatrix(s.axes, s.o));
    return { g, det: new THREE.Matrix3().set(...s.axes[0], ...s.axes[1], ...s.axes[2]).transpose().determinant() };
  }
  if (s.kind === 'ball') {
    const g = new THREE.SphereGeometry(s.r, 12, 8);
    g.translate(...s.o);
    return { g, det: 1 };
  }
  if (s.kind === 'tube' && s.points?.length > 1) {
    const r = Array.isArray(s.radii) ? s.radii.reduce((a, b) => a + b, 0) / s.radii.length : s.radii ?? 1;
    const curve = new THREE.CatmullRomCurve3(s.points.map(v3), false, 'centripetal');
    const g = new THREE.TubeGeometry(curve, Math.min(64, s.points.length * 4), Math.max(0.05, r), 8, false);
    return { g, det: 1 };
  }
  return null;
}

// Gộp nhiều lưới (chỉ vị trí và pháp tuyến) thành một; lưới bị lật (định thức âm) thì đảo thứ tự đỉnh để mặt hướng ra ngoài
function merge(parts) {
  const pos = [];
  const nor = [];
  for (const { g, flip } of parts) {
    const n = g.index ? g.toNonIndexed() : g;
    if (!n.attributes.normal) n.computeVertexNormals();
    const p = n.attributes.position.array;
    const q = n.attributes.normal.array;
    for (let i = 0; i < p.length; i += 9) {
      const order = flip ? [0, 2, 1] : [0, 1, 2];
      for (const k of order) {
        pos.push(p[i + k * 3], p[i + k * 3 + 1], p[i + k * 3 + 2]);
        nor.push(q[i + k * 3], q[i + k * 3 + 1], q[i + k * 3 + 2]);
      }
    }
    if (n !== g) n.dispose();
    g.dispose();
  }
  const out = new THREE.BufferGeometry();
  out.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  out.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
  return out;
}

const MAT = {
  plastic: (c) => tint(c, { roughness: 0.55, tex: 'grain' }),
  metal: (c) => tint(c, { metalness: 0.75, roughness: 0.3 }),
  rubber: (c) => tint(c, { roughness: 0.85, tex: null }),
  screen: (c) => tint(c, { roughness: 0.15, metalness: 0.1, tex: null }),
  glass: (c) => tint(c, { transparent: true, opacity: 0.35, roughness: 0.08, depthWrite: false }),
};

// Dựng nhóm máy từ dữ liệu đã tải. Trả về Group (gốc tâm đáy, đơn vị mét)
export function buildFigureMachine(data) {
  const M = figureMatrix(data);
  const flipAll = M.determinant() < 0;
  const buckets = new Map();
  for (const it of data.items) {
    const key = `${it.color}|${it.mat ?? 'plastic'}`;
    if (!buckets.has(key)) buckets.set(key, []);
    for (const s of it.shapes) {
      const r = shapeGeometry(s);
      if (!r) continue;
      r.g.applyMatrix4(M);
      if (!r.g.attributes.normal) r.g.computeVertexNormals();
      buckets.get(key).push({ g: r.g, flip: (r.det < 0) !== flipAll });
    }
  }
  const group = new THREE.Group();
  group.userData.screens = screensOf(data, M);
  for (const [key, parts] of buckets) {
    if (!parts.length) continue;
    const [color, mat] = key.split('|');
    const mesh = new THREE.Mesh(merge(parts), MAT[mat]?.(color) ?? MAT.plastic(color));
    if (mat === 'glass') { mesh.userData.noShadow = true; mesh.userData.glass = true; mesh.renderOrder = 2; }
    group.add(mesh);
  }
  return group;
}

// Màn hình của máy (phần có chất liệu screen, là lăng trụ mỏng): tâm mặt ngoài, pháp tuyến, rộng, cao theo mét. Mặt
// ngoài là mặt đáy lăng trụ xa tâm máy hơn. Cảnh dùng để đặt màn hình vẽ bằng canvas đúng chỗ.
function screensOf(data, M) {
  const out = [];
  const lin = new THREE.Matrix3().setFromMatrix4(M);
  for (const it of data.items) {
    if (it.mat !== 'screen') continue;
    for (const s of it.shapes) {
      if (s.kind !== 'prism') continue;
      const F = s.F;
      const xs = s.poly.map((p) => p[0]);
      const ys = s.poly.map((p) => p[1]);
      const cu = (Math.min(...xs) + Math.max(...xs)) / 2;
      const cv = (Math.min(...ys) + Math.max(...ys)) / 2;
      const at = (t) => v3(F.o).addScaledVector(v3(F.u), cu).addScaledVector(v3(F.v), cv).addScaledVector(v3(F.a), t).applyMatrix4(M);
      const p0 = at(s.s0);
      const p1 = at(s.s1);
      const outer = p1.length() >= p0.length() ? p1 : p0;
      const n = (p1.length() >= p0.length() ? v3(F.a) : v3(F.a).negate()).applyMatrix3(lin).normalize();
      const u = v3(F.u).applyMatrix3(lin);
      const v = v3(F.v).applyMatrix3(lin);
      const w = (Math.max(...xs) - Math.min(...xs)) * u.length();
      const h = (Math.max(...ys) - Math.min(...ys)) * v.length();
      // Hướng lên của màn hình: trục nào của mặt cắt gần trục y của cảnh hơn
      const up = Math.abs(u.clone().normalize().y) > Math.abs(v.clone().normalize().y) ? u.clone().normalize() : v.clone().normalize();
      if (up.y < 0) up.negate();
      const wide = up.equals(u.clone().normalize()) || up.equals(u.clone().normalize().negate()) ? h : w;
      const tall = wide === h ? w : h;
      out.push({ name: it.name, center: outer.toArray(), normal: n.toArray(), up: up.toArray(), w: wide, h: tall });
    }
  }
  return out;
}

// Tải và dựng (một lần cho mỗi máy)
const cache = new Map();
export function loadFigureMachine(id, base = 'data/machines3d/') {
  if (!cache.has(id)) cache.set(id, fetch(`${base}${id}.json`).then((r) => (r.ok ? r.json() : null)).then((d) => (d ? buildFigureMachine(d) : null)).catch(() => null));
  return cache.get(id).then((g) => { if (!g) return null; const c = g.clone(); c.userData.screens = g.userData.screens; return c; });
}
