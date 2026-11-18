import * as THREE from 'three';
import { mats, tint, box, cyl, put, tagGroup } from './materials.js';
import { ROOM, COLD_UNITS, ICE_MACHINE, LN2_DEWAR } from './layout.js';
import { makeCabinet } from './interact.js';

// Khu tủ lạnh, tủ đông, tủ âm sâu sát tường trái: tủ có cửa mở được, đồ bên trong lấy từ kho đồ (src/core/inventory.js).
// Mỗi món là một hộp nhỏ trên kệ; bấm vào thì lấy ra hộp đá trên bàn.

const V = (x, y, z) => new THREE.Vector3(x, y, z);
const WHITE = '#eef1f4';
const GREY = '#cfd6dc';
const SCREEN = '#5f86a3';
const ITEM = { tube: new THREE.CylinderGeometry(0.045, 0.045, 0.15, 12), box: new THREE.BoxGeometry(0.16, 0.08, 0.14), bottle: new THREE.CylinderGeometry(0.045, 0.045, 0.16, 12), plate: new THREE.CylinderGeometry(0.06, 0.06, 0.03, 14) };

export function buildCold(root, labels) {
  const x = ROOM.minX + 0.42;
  const units = new Map();
  for (const u of COLD_UNITS) {
    const cab = makeCabinet({ w: u.w, h: u.h, d: u.d, doors: 1, shelves: 4, body: tint(WHITE), glass: u.glass, band: u.band, handle: GREY, bottom: u.bottom ?? 0 });
    cab.group.rotation.y = Math.PI / 2; // mặt trước hướng +x
    cab.group.position.set(x, 0, u.z);
    // Màn hình nhiệt độ trên nóc mặt trước
    put(cab.group, box(0.26, 0.1, 0.02, tint(SCREEN), false), 0, u.h + 0.01, u.d / 2 - 0.02);
    cab.group.userData.info = u.place;
    // Tủ −80 °C có bản 3D dựng từ hình chi tiết (FIGURE_SLOTS): giữ cửa mở được và kệ đựng hộp mẫu dựng tay
    if (u.id === 'ult') {
      cab.group.userData.figureSlot = { id: 'ult', offset: [0, 0, u.d / 2 - 0.4] };
      cab.interior.userData.keep = true;
      for (const p of cab.doors) p.userData.keep = true;
    }
    root.add(cab.group);
    const shelf = new THREE.Group();
    cab.interior.add(shelf);
    const label = labels.add(u.name, V(x + 0.3, u.h + 0.22, u.z), { kind: 'sub', max: 14 });
    units.set(u.place, { ...u, cab, shelf, label });
  }
  tagGroup(root, [
    put(root, box(ICE_MACHINE.d, ICE_MACHINE.h, ICE_MACHINE.w, tint(GREY)), ROOM.minX + 0.37, 0, ICE_MACHINE.z),
    put(root, box(0.02, 0.3, 0.4, tint('#3a4652'), false), ROOM.minX + 0.37 + ICE_MACHINE.d / 2, 0.55, ICE_MACHINE.z),
  ], 'ice-machine');
  labels.add('Máy làm đá', V(ROOM.minX + 0.5, 1.25, ICE_MACHINE.z), { kind: 'sub', max: 14 });
  const dewar = new THREE.Group();
  put(dewar, cyl(LN2_DEWAR.r, LN2_DEWAR.r, LN2_DEWAR.h, tint('#c4ccd3')), 0, 0, 0);
  const lid = put(dewar, cyl(0.09, 0.1, 0.08, tint('#3a4652')), 0, LN2_DEWAR.h, 0);
  lid.userData.lid = true;
  dewar.position.set(ROOM.minX + 0.45, 0, LN2_DEWAR.z);
  dewar.userData.info = 'ln2';
  dewar.userData.figureSlot = { id: 'ln2' };
  root.add(dewar);
  const ln2Shelf = new THREE.Group();
  ln2Shelf.userData.keep = true;
  dewar.add(ln2Shelf);
  labels.add('Bình nitơ lỏng', V(ROOM.minX + 0.5, 1.1, LN2_DEWAR.z), { kind: 'sub', max: 14 });

  // Vẽ lại đồ trên kệ theo kho đồ: items [{ id, name, place, shape }]
  function setItems(items) {
    for (const u of units.values()) u.shelf.clear();
    ln2Shelf.clear();
    const byPlace = new Map();
    for (const it of items) {
      if (!byPlace.has(it.place)) byPlace.set(it.place, []);
      byPlace.get(it.place).push(it);
    }
    for (const [place, list] of byPlace) {
      const u = units.get(place);
      if (u) {
        list.forEach((it, i) => {
          const level = Math.min(u.cab.ys.length - 1, Math.floor(i / 5) + 1);
          const col = i % 5;
          const geo = ITEM[it.shape] ?? ITEM.tube;
          const m = new THREE.Mesh(geo, tint(it.color ?? '#e9d27c'));
          m.position.set(-u.w / 2 + 0.16 + col * ((u.w - 0.32) / 4), u.cab.ys[level] + geo.parameters.height / 2, 0.05);
          m.userData.itemId = it.id;
          u.shelf.add(m);
        });
      } else if (place === 'ln2') {
        list.forEach((it, i) => {
          const m = new THREE.Mesh(ITEM.tube, tint(it.color ?? '#e9d27c'));
          m.position.set(-0.08 + i * 0.06, LN2_DEWAR.h + 0.14, 0);
          m.userData.itemId = it.id;
          ln2Shelf.add(m);
        });
      }
    }
  }

  // Nhãn trên tủ: nhiệt độ hiện tại và báo động
  function setStatus(place, text) {
    const u = units.get(place);
    if (u) u.label.element.textContent = text;
  }

  return { units, dewar, ln2Shelf, setItems, setStatus };
}
