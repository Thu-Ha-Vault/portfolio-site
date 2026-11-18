import * as THREE from 'three';
import { tint } from './materials.js';
import { ROOM, CHEM_CABINETS } from './layout.js';
import { makeCabinet } from './interact.js';

// Tủ hoá chất theo nhóm dọc tường sau, có cửa đôi mở được. Chai bên trong là các chất "shelf": "cabinet" trong
// substances.json, xếp theo trường "cabinet"; bấm vào chai thì lấy ra bàn hoá học.

const V = (x, y, z) => new THREE.Vector3(x, y, z);
const BOTTLE = new THREE.CylinderGeometry(0.06, 0.06, 0.22, 14);

export function buildChemCabinets(root, labels, substances) {
  const cabinets = new Map();
  for (const c of CHEM_CABINETS) {
    const cab = makeCabinet({ w: c.w, h: c.h, d: c.d, doors: 2, shelves: 4, band: c.color });
    const z = ROOM.minZ + c.d / 2 + 0.02;
    cab.group.position.set(c.x, 0, z);
    cab.group.userData.info = `cabinet-${c.id}`;
    root.add(cab.group);
    const bottles = new Map();
    substances.filter((s) => s.shelf === 'cabinet' && s.cabinet === c.id).forEach((s, i) => {
      const m = new THREE.Mesh(BOTTLE, tint(s.amber ? '#8a5a2b' : s.color ?? '#dfe8ee', { transparent: true, opacity: 0.9 }));
      m.position.set(-c.w / 2 + 0.3 + (i % 5) * 0.34, cab.ys[1 + Math.floor(i / 5)] + 0.11, 0);
      m.userData.itemId = `chem:${s.id}`;
      m.userData.info = `reagent:${s.id}`;
      m.userData.infoLabel = false;
      cab.interior.add(m);
      bottles.set(s.id, m);
    });
    labels.add(c.name, V(c.x, 2.35, z + 0.4), { kind: 'sub', max: 26 });
    cabinets.set(c.id, { ...c, cab, bottles });
  }
  // Chai đã lấy ra bàn thì không còn trên kệ
  function setTaken(ids) {
    for (const c of cabinets.values()) for (const [id, m] of c.bottles) m.visible = !ids.has(id);
  }
  return { cabinets, setTaken };
}
