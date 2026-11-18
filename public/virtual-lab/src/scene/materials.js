import * as THREE from 'three';
import { surface } from './textures.js';

// Bảng màu cảnh 3D theo giao diện sáng / tối, kiểu mô hình phác thảo: khối màu nhạt, viền nét mảnh.
// Màu nhận diện (dải màu tủ hoá chất, máy móc, cây, đất) dùng tint() và giữ nguyên ở cả hai giao diện.
const PALETTES = {
  light: {
    background: '#e8edf1', ground: '#dde4e9', floor: '#f6f8fa', grid: '#dbe2e8', wall: '#fbfcfd', ceiling: '#eef0f2',
    furniture: '#e1e7ec', furnitureDark: '#c4ced7', benchTop: '#323d48', frame: '#56636f',
    glass: '#cfe2f0', edge: '#2d3b48', edgeOpacity: 0.32,
  },
  dark: {
    background: '#0d1217', ground: '#11181e', floor: '#18212a', grid: '#222e39', wall: '#1d2731', ceiling: '#232e39',
    furniture: '#2a3641', furnitureDark: '#35434f', benchTop: '#0c1014', frame: '#8ea2b4',
    glass: '#6f9cbc', edge: '#a9bccd', edgeOpacity: 0.3,
  },
};

const std = (opts = {}) => new THREE.MeshStandardMaterial({ roughness: 0.9, metalness: 0, ...opts });

// Vân bề mặt (src/scene/textures.js): sàn vinyl ô 0,5 m, tường sơn, trần tấm 0,6 m, tủ phủ melamine, mặt bàn epoxy có hạt, khung thép xước
export const mats = {
  ground: surface(std(), 'grain', { size: 4, albedo: 0.08, bump: 0.5 }),
  floor: surface(std({ roughness: 0.7 }), 'tile'),
  wall: surface(std(), 'plaster'),
  ceiling: surface(std({ roughness: 0.95 }), 'tile', { size: 2.4, albedo: 0.12, bump: 0.5 }),
  furniture: surface(std({ roughness: 0.75 }), 'laminate'),
  furnitureDark: surface(std({ roughness: 0.75 }), 'laminate'),
  benchTop: surface(std({ roughness: 0.45 }), 'speckle'),
  frame: surface(std({ roughness: 0.5 }), 'brushed'),
  glass: std({ transparent: true, opacity: 0.3, roughness: 0.1, depthWrite: false, side: THREE.DoubleSide }),
  edge: new THREE.LineBasicMaterial({ transparent: true }),
  grid: new THREE.LineBasicMaterial(),
};

// Vật liệu màu cố định, dùng chung theo màu và tuỳ chọn. Vân mặc định: kim loại (metalness ≥ 0,3) là thép xước, vật
// trong suốt không có vân, còn lại là vân sơn/nhựa mịn; tex ghi rõ loại vân khác (KINDS trong textures.js), tex: null để bỏ vân.
const fixed = new Map();
export function tint(color, opts) {
  const key = color + JSON.stringify(opts ?? {});
  if (!fixed.has(key)) {
    const { tex, texOpts, ...rest } = opts ?? {};
    const m = std({ color, ...rest });
    const kind = tex !== undefined ? tex : rest.transparent ? null : (rest.metalness ?? 0) >= 0.3 ? 'brushed' : 'grain';
    fixed.set(key, kind ? surface(m, kind, texOpts) : m);
  }
  return fixed.get(key);
}

export function applyPalette(scene, name) {
  const p = PALETTES[name];
  for (const k of ['ground', 'floor', 'wall', 'ceiling', 'furniture', 'furnitureDark', 'benchTop', 'frame', 'glass']) mats[k].color.set(p[k]);
  mats.edge.color.set(p.edge);
  mats.edge.opacity = p.edgeOpacity;
  mats.grid.color.set(p.grid);
  scene.background = new THREE.Color(p.background);
}

export function withEdges(mesh, angle = 25) {
  mesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(mesh.geometry, angle), mats.edge));
  return mesh;
}

export function box(w, h, d, mat, edges = true) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  return edges ? withEdges(m) : m;
}

export function cyl(rTop, rBottom, h, mat, { seg = 24, edges = true, open = false } = {}) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(rTop, rBottom, h, seg, 1, open), mat);
  return edges ? withEdges(m, 40) : m;
}

// Đặt vật theo mặt đáy: y là độ cao của mặt đáy.
export function put(parent, mesh, x, y, z) {
  const h = mesh.geometry.parameters.height ?? 0;
  mesh.position.set(x, y + h / 2, z);
  parent.add(mesh);
  return mesh;
}

// Gom các khối rời (đã đặt trong parent ở gốc toạ độ) thành một nhóm có chú thích: info là id trong data/apparatus.json
// (src/scene/info.js). Nhóm ở gốc toạ độ nên vị trí các khối không đổi.
export function tagGroup(parent, objects, info) {
  const g = new THREE.Group();
  g.userData.info = info;
  parent.add(g);
  for (const o of objects) g.add(o);
  return g;
}

// Số ngẫu nhiên có seed, để bố cục giống nhau mỗi lần mở.
export function random(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
