import * as THREE from 'three';
import { mats, tint, box, put } from './materials.js';

// Tương tác chung cho các khu: bấm vào vật trong cảnh (cửa tủ, đồ trên kệ) và tủ có cửa bản lề.
// Bấm = nhấn và nhả gần như tại chỗ; kéo để xoay camera không tính là bấm.

const CLICK_PX = 6;

/**
 * Bộ bắt bấm. add(object, handler) đăng ký một vật (và các con của nó); handler(hit) được gọi khi bấm trúng.
 * Vật đang ẩn (hoặc nằm trong nhóm đang ẩn) bị bỏ qua.
 */
export function createClicker({ dom, camera, ignore = () => false }) {
  const ray = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  const targets = [];
  let down = null;
  const shown = (o) => {
    for (let x = o; x; x = x.parent) if (!x.visible) return false;
    return true;
  };
  const owner = (o) => {
    for (let x = o; x; x = x.parent) {
      const t = targets.find((tt) => tt.object === x);
      if (t) return t;
    }
    return null;
  };
  function pick(e) {
    const r = dom.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    // Bỏ qua đường viền (LineSegments); trong cùng một vật, ưu tiên món đồ (userData.itemId) nằm trên tia bấm
    const hits = ray.intersectObjects(targets.map((t) => t.object), true).filter((h) => !h.object.isLine && shown(h.object));
    if (!hits.length) return null;
    const t = owner(hits[0].object);
    if (!t) return null;
    const item = hits.find((h) => h.object.userData.itemId && owner(h.object) === t);
    return { target: t, hit: item ?? hits[0] };
  }
  dom.addEventListener('pointerdown', (e) => {
    down = e.button === 0 || e.pointerType !== 'mouse' ? { x: e.clientX, y: e.clientY, id: e.pointerId } : null;
  });
  dom.addEventListener('pointerup', (e) => {
    if (!down || e.pointerId !== down.id) return;
    const moved = Math.hypot(e.clientX - down.x, e.clientY - down.y);
    down = null;
    if (moved > CLICK_PX || ignore()) return;
    const p = pick(e);
    if (p) p.target.handler(p.hit);
  });
  dom.addEventListener('pointermove', (e) => {
    if (e.buttons || e.pointerType !== 'mouse' || dom.style.cursor === 'grabbing' || dom.style.cursor === 'grab') return;
    dom.style.cursor = pick(e) ? 'pointer' : '';
  });
  return {
    add(object, handler) {
      targets.push({ object, handler });
    },
  };
}

/**
 * Tủ đứng có cửa bản lề. Toạ độ nhóm: mặt trước hướng +z, đáy ở y = 0, tâm ở x = 0.
 * @param {{w:number,h:number,d:number,doors?:number,shelves?:number,body?:THREE.Material,door?:THREE.Material,band?:string|null,glass?:boolean,handle?:string}} o
 * @returns {{group:THREE.Group, interior:THREE.Group, ys:number[], doors:THREE.Group[], open:boolean, setOpen:(v:boolean, k?:number)=>void}}
 *   ys: độ cao mặt các tầng kệ bên trong; setOpen(v, k) đặt góc cửa theo tỉ lệ k (0 đóng – 1 mở hẳn).
 */
// bottom: độ cao đáy khoang chứa (tủ có khoang máy bên dưới như tủ −80 °C): kệ và cửa bắt đầu từ đây
export function makeCabinet({ w, h, d, doors = 1, shelves = 4, body = mats.furniture, door = null, band = null, glass = false, handle = '#cfd6dc', bottom = 0 }) {
  const g = new THREE.Group();
  const t = 0.04;
  put(g, box(w, h, t, body), 0, 0, -d / 2 + t / 2);
  put(g, box(t, h, d, body), -w / 2 + t / 2, 0, 0);
  put(g, box(t, h, d, body), w / 2 - t / 2, 0, 0);
  put(g, box(w, t, d, body), 0, h - t, 0);
  put(g, box(w, 0.08 + bottom, d, body), 0, 0, 0);
  const interior = new THREE.Group();
  g.add(interior);
  const ys = [];
  for (let i = 0; i < shelves; i++) {
    const y = 0.08 + bottom + i * ((h - bottom - 0.2) / shelves);
    put(interior, box(w - 2 * t, 0.025, d - t * 2, mats.furnitureDark), 0, y, 0);
    ys.push(y + 0.025);
  }
  const doorMat = door ?? (glass ? mats.glass : body);
  const leaves = [];
  const dw = w / doors;
  for (let i = 0; i < doors; i++) {
    // Cửa trái mở sang trái (bản lề ở mép trái), cửa phải mở sang phải
    const left = doors === 1 ? true : i === 0;
    const pivot = new THREE.Group();
    pivot.position.set(left ? -w / 2 + i * dw : -w / 2 + (i + 1) * dw, bottom, d / 2);
    const dh = h - bottom;
    const leaf = put(pivot, box(dw - 0.01, dh - 0.02, 0.035, doorMat), left ? dw / 2 : -dw / 2, 0.01, 0.018);
    put(pivot, box(0.025, Math.min(0.5, dh * 0.3), 0.03, tint(handle), false), left ? dw - 0.07 : -dw + 0.07, dh * 0.45, 0.05);
    if (band) put(pivot, box(dw - 0.01, 0.12, 0.04, tint(band), false), left ? dw / 2 : -dw / 2, dh - 0.2, 0.02);
    pivot.userData.sign = left ? -1 : 1;
    leaf.userData.door = true;
    g.add(pivot);
    leaves.push(pivot);
  }
  const api = {
    group: g,
    interior,
    ys,
    doors: leaves,
    open: false,
    angle: 0,
    // k: 0 đóng – 1 mở 105°
    setOpen(v, k = v ? 1 : 0) {
      api.open = v;
      api.angle = k;
      for (const p of leaves) p.rotation.y = p.userData.sign * k * (105 * Math.PI) / 180;
    },
  };
  return api;
}
