import * as THREE from 'three';
import { BENCH } from './layout.js';

// Kéo thả đồ trên mặt bàn thí nghiệm.
// Bắt pointerdown ở pha capture trên phần tử chứa canvas, để khi trúng một món đồ thì OrbitControls không xoay camera.

const LIFT = 0.08;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

// machines(): [{ id, group }] các máy nhận ống; thả ống PCR khi con trỏ nằm trên máy thì gọi onDropMachine(item, id).
// Ống nghiệm và cốc (userData.heatable) thả lên đèn cồn hoặc kiềng cũng gọi onDropMachine (id 'lamp' hoặc 'tripod').
// onEdge(dx, dy): con trỏ đang kéo nằm sát mép khung nhìn (dx, dy trong −1…1); cảnh dời camera theo hướng đó, để kéo
// được ống từ bàn tới máy ở xa mà không phải thả ra xoay camera.
const EDGE_PX = 44;
export function createDragController({ dom, host, camera, bench, onDropReagent, onReturn, onSelect, machines = () => [], onDropMachine, onEdge }) {
  const ray = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -BENCH.top);
  const hit = new THREE.Vector3();
  let drag = null;

  function aim(e) {
    const r = dom.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
  }
  // Raycaster không bỏ qua vật đang ẩn (dung dịch khi cốc rỗng, bọt khí), nên tự lọc
  const shown = (o) => {
    for (let x = o; x; x = x.parent) if (!x.visible) return false;
    return true;
  };
  function pick(e) {
    aim(e);
    const h = ray.intersectObjects(bench.pickables, false).find((hit) => shown(hit.object));
    return h ? bench.items.get(h.object.userData.itemId) : null;
  }
  function machineAt(e) {
    const list = machines();
    if (!list.length) return null;
    aim(e);
    const h = ray.intersectObjects(list.map((m) => m.group), true).find((x) => shown(x.object) && !x.object.isLine);
    if (!h) return null;
    for (let o = h.object; o; o = o.parent) {
      const m = list.find((mm) => mm.group === o);
      if (m) return m;
    }
    return null;
  }
  function onBench(e) {
    aim(e);
    return ray.ray.intersectPlane(plane, hit);
  }

  host.addEventListener('pointerdown', (e) => {
    if (e.target !== dom || (e.pointerType === 'mouse' && e.button !== 0)) return;
    const item = pick(e);
    if (!item || item.busy) return;
    const p = onBench(e);
    if (!p) return;
    e.stopPropagation();
    drag = { item, pointerId: e.pointerId, dx: item.group.position.x - p.x, dz: item.group.position.z - p.z, target: null, sx: e.clientX, sy: e.clientY, moved: false };
    dom.setPointerCapture(e.pointerId);
    dom.style.cursor = 'grabbing';
    item.group.position.y = BENCH.top + LIFT;
  }, { capture: true });

  // Kéo tới mép: mỗi khung hình dời camera một chút rồi tính lại vị trí món đồ dưới con trỏ
  function edgeLoop() {
    if (!drag || !drag.last || !onEdge) return;
    const r = dom.getBoundingClientRect();
    const { clientX: x, clientY: y } = drag.last;
    const dx = x < r.left + EDGE_PX ? -1 : x > r.right - EDGE_PX ? 1 : 0;
    const dy = y < r.top + EDGE_PX ? -1 : y > r.bottom - EDGE_PX ? 1 : 0;
    if (dx || dy) {
      onEdge(dx, dy);
      move(drag.last);
      drag.raf = requestAnimationFrame(edgeLoop);
    } else drag.raf = null;
  }

  function move(e) {
    const p = onBench(e);
    if (!p) return;
    const x = clamp(p.x + drag.dx, BENCH.dragMinX, BENCH.dragMaxX);
    const z = clamp(p.z + drag.dz, BENCH.dragMinZ, BENCH.dragMaxZ);
    drag.item.group.position.set(x, BENCH.top + LIFT, z);
    drag.target = drag.item.type === 'reagent' ? bench.containerNear(x, z) : null;
    bench.showTarget(drag.target);
  }

  dom.addEventListener('pointermove', (e) => {
    if (!drag) {
      if (e.pointerType === 'mouse' && e.buttons === 0) dom.style.cursor = pick(e) ? 'grab' : '';
      return;
    }
    if (e.pointerId !== drag.pointerId) return;
    if (Math.hypot(e.clientX - drag.sx, e.clientY - drag.sy) > 6) drag.moved = true;
    drag.last = { clientX: e.clientX, clientY: e.clientY, pointerId: e.pointerId };
    move(e);
    if (!drag.raf && drag.moved) drag.raf = requestAnimationFrame(edgeLoop);
  });

  function end(e) {
    if (!drag || e.pointerId !== drag.pointerId) return;
    const { item, target } = drag;
    const drag0 = drag;
    if (drag.raf) cancelAnimationFrame(drag.raf);
    drag = null;
    dom.style.cursor = '';
    bench.showTarget(null);
    if (dom.hasPointerCapture(e.pointerId)) dom.releasePointerCapture(e.pointerId);
    if (item.type === 'reagent') {
      if (target && e.type === 'pointerup') onDropReagent(item, target);
      else onReturn(item);
    } else {
      const m = drag0.moved && e.type === 'pointerup' && (item.group.userData.tube || item.group.userData.heatable) ? machineAt(e) : null;
      if (m) {
        // Thả ống lên máy: ống về chỗ cũ trên bàn, máy chạy với đúng ống đó
        item.group.position.copy(item.home);
        onDropMachine?.(item, m.id);
        return;
      }
      item.group.position.y = BENCH.top;
      item.home.copy(item.group.position);
      if (!drag0.moved && e.type === 'pointerup') onSelect?.(item);
    }
  }
  dom.addEventListener('pointerup', end);
  dom.addEventListener('pointercancel', end);
}
