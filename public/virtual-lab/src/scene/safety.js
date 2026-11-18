import * as THREE from 'three';
import { tint, box, cyl, put, tagGroup } from './materials.js';
import { BENCH, SAFETY } from './layout.js';
import { showerStation } from './services.js';

// Đồ an toàn chung: vòi tắm và rửa mắt khẩn cấp, bình chữa cháy, thùng rác sinh học, hộp sắc nhọn, bảng nội quy.

const V = (x, y, z) => new THREE.Vector3(x, y, z);
const GREEN = '#2e9d5b';
const RED = '#c8323c';
const YELLOW = '#e0b028';

export function buildSafety(root, labels) {
  const s = SAFETY.shower;
  // Vòi tắm khẩn cấp: ống đứng, đầu sen tròn ở trên, chậu rửa mắt ngang hông, cần kéo (dùng chung với services.js)
  showerStation(root, s.x, s.z, '-x');
  labels.add('Vòi tắm, rửa mắt khẩn cấp', V(s.x - 0.2, 2.55, s.z), { kind: 'sub', max: 16 });
  // Bình chữa cháy CO₂ treo tường
  for (const e of SAFETY.extinguishers) {
    tagGroup(root, [put(root, cyl(0.08, 0.08, 0.5, tint(RED)), e.x, 0.9, e.z), put(root, box(0.06, 0.08, 0.12, tint('#3a4652'), false), e.x, 1.4, e.z)], 'extinguisher');
  }
  labels.add('Bình chữa cháy CO₂', V(SAFETY.extinguishers[0].x, 1.75, SAFETY.extinguishers[0].z), { kind: 'sub', max: 14 });
  // Thùng rác sinh học có nắp đạp chân, túi đỏ
  const b = SAFETY.biobin;
  tagGroup(root, [put(root, cyl(0.24, 0.21, 0.65, tint(RED)), b.x, 0, b.z), put(root, cyl(0.25, 0.25, 0.04, tint('#3a4652')), b.x, 0.65, b.z)], 'biobin');
  labels.add('Rác thải sinh học', V(b.x, 0.95, b.z), { kind: 'sub', max: 14 });
  // Hộp đựng vật sắc nhọn trên bàn sinh học phân tử
  const sh = SAFETY.sharps;
  tagGroup(root, [put(root, box(0.16, 0.2, 0.12, tint(YELLOW)), sh.x, BENCH.top, sh.z), put(root, box(0.16, 0.03, 0.12, tint(RED), false), sh.x, BENCH.top + 0.2, sh.z)], 'sharps');
  labels.add('Hộp sắc nhọn', V(sh.x, BENCH.top + 0.36, sh.z), { kind: 'sub', max: 7 });
  // Bảng nội quy trên tường sau
  const bd = SAFETY.board;
  const board = tagGroup(root, [put(root, box(bd.w, bd.h, 0.02, tint('#f4f1ea')), bd.x, 1.3, bd.z), put(root, box(bd.w, 0.12, 0.022, tint(GREEN), false), bd.x, 1.3 + bd.h - 0.12, bd.z)], 'rules-board');
  board.userData.mounted = [board];
  labels.add('Nội quy phòng thí nghiệm', V(bd.x, 2.5, bd.z + 0.1), { kind: 'sub', max: 16 });
}
