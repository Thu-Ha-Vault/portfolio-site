import * as THREE from 'three';
import { smooth, radii, bounds, primPoints, shade } from '../core/anatomy/kit.js';
import { surface, KINDS } from './textures.js';

// Dựng mẫu 3D từ hình học giải phẫu dùng chung (src/core/anatomy/): blob đùn lên có vát mép, ống quét theo đường giữa với
// bán kính đổi dần, hạt là khối cầu, nét mảnh là ống rất nhỏ. Toạ độ mẫu (x dọc thân, y ngang thân, theo body.length L)
// đổi sang cảnh: X = (x − cx)·L, Z = (y − cy)·L, độ cao Y = base + z·L.

// Vật liệu theo màu, độ trong, độ bóng và vân (tex của phần tử, như vân của hình SVG; không có thì là mặt mô ướt loang
// nhẹ). Vân chiếu theo toạ độ thế giới (src/scene/textures.js); texOp của phần tử làm vân đậm hay nhạt.
const mats = new Map();
function material(c, op = 1, gloss = 0, tex = null, texOp = null) {
  const key = `${c}|${op}|${gloss}|${tex}|${texOp}`;
  if (!mats.has(key)) {
    const m = new THREE.MeshStandardMaterial({ color: c, roughness: 0.62 - 0.32 * Math.min(1, gloss), metalness: 0, transparent: op < 1, opacity: op, depthWrite: op >= 0.95, side: THREE.DoubleSide });
    const kind = tex ?? 'tissue';
    const k = KINDS[kind];
    const f = tex && texOp != null ? Math.min(1.4, 0.4 + texOp) : 1;
    mats.set(key, op < 0.3 ? m : surface(m, kind, { albedo: k.albedo * f, bump: k.bump * f }));
  }
  return mats.get(key);
}

// Tâm mẫu trên khay: tâm khung của các phần tử dựng 3D
export function centerOf(prims) {
  const pts = prims.filter((p) => p.only !== 'svg' && p.t !== 'text').flatMap(primPoints);
  const b = bounds(pts);
  return [b.cx, b.cy];
}

// o: { L, cx, cy, base (m), hScale (nhân bề dày blob), dark (làm sẫm, cơ quan hỏng), tex (vân mặc định của nhóm:
// da ngoài theo loài, art.skin) }. Phần tử có tex3d thì dùng vân đó cho mẫu 3D (vân không có trong hình SVG).
export function primsGroup(prims, o) {
  const g = new THREE.Group();
  for (const p of prims) {
    if (p.only === 'svg' || p.t === 'text') continue;
    const m = primMesh(p, o);
    if (m) g.add(m);
  }
  return g;
}

function primMesh(p, o) {
  const { L, cx, cy, base = 0, hScale = 1, dark = false } = o;
  const c = dark ? shade(p.c ?? '#999999', 0.5) : p.c ?? '#999999';
  const mat = material(c, p.op ?? 1, p.gloss ?? 0, p.tex3d ?? p.tex ?? o.tex ?? null, p.tex ? p.texOp ?? null : null);
  const X = (x) => (x - cx) * L;
  const Z = (y) => (y - cy) * L;
  const y0 = base + (p.z ?? 0) * L;
  if (p.t === 'blob') {
    const S = smooth(p.pts, { closed: true, n: 4 });
    const shape = new THREE.Shape(S.map(([x, y]) => new THREE.Vector2(X(x), -Z(y))));
    const b = bounds(S);
    const h = Math.max(0.0008, (p.h ?? 0.01) * L * hScale);
    const minExt = Math.min(b.w, b.h) * L;
    // Vát mép kiểu vòm: phần lớn bề dày là vát, giữ đúng chu vi của hình
    const bt = h * 0.42;
    const bs = Math.min(h * 0.9, minExt * 0.3);
    const ok = bs > 0.0002;
    const geo = new THREE.ExtrudeGeometry(shape, { depth: ok ? Math.max(0.0001, h - 2 * bt) : h, bevelEnabled: ok, bevelThickness: bt, bevelSize: bs, bevelOffset: -bs, bevelSegments: 5, curveSegments: 4 });
    geo.rotateX(-Math.PI / 2);
    const m = new THREE.Mesh(geo, mat);
    m.position.y = y0 + (ok ? bt : 0);
    m.castShadow = false;
    return m;
  }
  if (p.t === 'tube') return tubeMesh(p.pts, p.r, mat, { X, Z, y0, L, flat: p.flat ?? 0.8 });
  if (p.t === 'strands') {
    const g = new THREE.Group();
    const step = Math.max(1, Math.ceil(p.lines.length / 14));
    p.lines.forEach((ln, i) => { if (i % step === 0) g.add(tubeMesh(ln, Math.max(p.r, 0.0006 / L), mat, { X, Z, y0, L, flat: 1, radial: 4 })); });
    return g;
  }
  if (p.t === 'dots') {
    const geo = new THREE.SphereGeometry(1, 10, 7);
    const inst = new THREE.InstancedMesh(geo, mat, p.pts.length);
    const M = new THREE.Matrix4();
    p.pts.forEach(([x, y, r], i) => { const rr = r * L; M.makeScale(rr, rr * 0.8, rr); M.setPosition(X(x), y0 + rr * 0.8, Z(y)); inst.setMatrixAt(i, M); });
    return inst;
  }
  if (p.t === 'line') {
    if (p.w * L < 0.0005 || p.flat2d) return null;
    return tubeMesh(p.pts, p.w / 2, mat, { X, Z, y0: y0 + 0.0004, L, flat: 0.6, radial: 4 });
  }
  return null;
}

// Ống quét: tiết diện elip (dẹt theo chiều đứng), bán kính nội suy dọc ống, đầu bịt bằng quạt tam giác
function tubeMesh(pts, r, mat, { X, Z, y0, L, flat, radial = 10 }) {
  const S = smooth(pts, { n: 5 });
  const R = radii(r, pts.length, S.length).map((v) => v * L);
  const n = S.length;
  const pos = [];
  const idx = [];
  for (let i = 0; i < n; i++) {
    const a = S[Math.max(0, i - 1)], b = S[Math.min(n - 1, i + 1)];
    let tx = X(b[0]) - X(a[0]), tz = Z(b[1]) - Z(a[1]);
    const l = Math.hypot(tx, tz) || 1;
    tx /= l; tz /= l;
    const nx = -tz, nz = tx;
    const cy = y0 + (S[i][2] ?? 0) * L + R[i] * flat;
    for (let k = 0; k < radial; k++) {
      const t = (k / radial) * Math.PI * 2;
      const cs = Math.cos(t), sn = Math.sin(t);
      pos.push(X(S[i][0]) + nx * R[i] * cs, cy + R[i] * flat * sn, Z(S[i][1]) + nz * R[i] * cs);
    }
  }
  for (let i = 0; i < n - 1; i++) for (let k = 0; k < radial; k++) {
    const a = i * radial + k, b = i * radial + ((k + 1) % radial), c = a + radial, d = b + radial;
    idx.push(a, c, b, b, c, d);
  }
  // Hai đầu
  for (const [i, sgn] of [[0, -1], [n - 1, 1]]) {
    const ci = pos.length / 3;
    pos.push(X(S[i][0]), y0 + (S[i][2] ?? 0) * L + R[i] * flat, Z(S[i][1]));
    for (let k = 0; k < radial; k++) {
      const a = i * radial + k, b = i * radial + ((k + 1) % radial);
      if (sgn < 0) idx.push(ci, b, a); else idx.push(ci, a, b);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  return new THREE.Mesh(geo, mat);
}
