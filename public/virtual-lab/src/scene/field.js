import * as THREE from 'three';
import { tint, put, box } from './materials.js';
import { FIELD } from './layout.js';

// Khu thực địa ngoài trời: bãi bùn rừng ngập mặn với cây đặt đúng toạ độ quần xã của lõi (src/core/fieldeco.js),
// khung ô tiêu chuẩn vừa đếm, và dãy núi đá vôi có rừng phía sau. Cây vẽ bằng InstancedMesh theo loài.

const COLORS = ['#2f6b3a', '#4d8a3c', '#6a9c3a', '#3c7d5a', '#7aa04a', '#5b8f2e'];
const V = (x, y, z) => new THREE.Vector3(x, y, z);

export function buildField(root, labels) {
  const group = new THREE.Group();
  root.add(group);
  const S = FIELD.scale;
  const side = 40 * S;
  for (const key of ['sea', 'land']) {
    const { x0, z0 } = FIELD[key];
    put(group, box(side + 1, 0.06, side + 1, tint(key === 'sea' ? '#6f5a43' : '#7a6448', { tex: 'soil', texOpts: { size: 1.2 } }), false), x0 + side / 2, -0.1, z0 + side / 2);
    labels.add(key === 'sea' ? 'Rừng ngập mặn, dải sát biển' : 'Rừng ngập mặn, dải phía trong', V(x0 + side / 2, 3.2, z0 - 0.5), { kind: 'zone', min: 4, max: 60 });
  }
  // Kênh nước giữa bãi và biển
  put(group, box(4, 0.04, side + 1, tint('#5c88a8'), false), FIELD.sea.x0 + side + 2.6, -0.11, FIELD.sea.z0 + side / 2);
  // Núi đá vôi: các khối nón xám có mũ cây xanh
  const rockMat = tint('#9aa0a2', { tex: 'rock' });
  const treeMat = tint('#3f6e3a', { tex: 'leaf' });
  for (let i = 0; i < 7; i++) {
    const r = 3 + (i % 3);
    const h = 7 + ((i * 5) % 6);
    const cone = new THREE.Mesh(new THREE.ConeGeometry(r, h, 7), rockMat);
    cone.position.set(-74 + i * 7, h / 2 - 0.1, FIELD.karstZ - (i % 2) * 4);
    group.add(cone);
    const cap = new THREE.Mesh(new THREE.SphereGeometry(r * 0.55, 8, 6), treeMat);
    cap.position.set(cone.position.x, h * 0.62, cone.position.z);
    cap.scale.y = 0.6;
    group.add(cap);
  }
  labels.add('Núi đá vôi có rừng (tuyến Ao Ếch)', V(-52, 12, FIELD.karstZ), { kind: 'zone', min: 4, max: 70 });
  // Cửa hang Động Trung Trang (dơi nếp mũi) ở chân núi đá vôi và bãi triều Xuân Đám (cá, cua) cạnh kênh nước
  // (cửa hang đặt ở chân khối núi thứ năm, x = −46, bán kính đáy 4; bãi triều nằm phía biển trước dải rừng sát biển)
  const cave = new THREE.Mesh(new THREE.SphereGeometry(2.2, 12, 6, 0, Math.PI * 2, 0, Math.PI / 2), tint('#1f2326'));
  cave.scale.set(1, 1.4, 0.3);
  cave.position.set(-46, 0, FIELD.karstZ + 4.1);
  group.add(cave);
  labels.add('Động Trung Trang (dơi nếp mũi)', V(-46, 4.2, FIELD.karstZ + 4.1), { kind: 'zone', min: 4, max: 60 });
  const flatZ = FIELD.sea.z0 + side + 3.5;
  put(group, box(side + 1, 0.05, 5, tint('#8a7458', { tex: 'soil', texOpts: { size: 1.2 } }), false), FIELD.sea.x0 + side / 2, -0.1, flatZ);
  labels.add('Bãi triều Xuân Đám (cá, cua)', V(FIELD.sea.x0 + side / 2, 2, flatZ), { kind: 'zone', min: 4, max: 60 });

  const meshes = [];
  const quad = new THREE.Group();
  group.add(quad);
  const trunkGeo = new THREE.CylinderGeometry(0.05, 0.08, 1, 6);
  const crownGeo = new THREE.SphereGeometry(0.5, 7, 5);
  const m4 = new THREE.Matrix4();

  return {
    // plants: { sea: [{ sp, x, y }], land: [...] }; species: { sea: [[sci, vn, dens, r]], land: … }
    setPlants(plants, species) {
      for (const m of meshes) { group.remove(m); m.dispose?.(); }
      meshes.length = 0;
      for (const key of ['sea', 'land']) {
        const { x0, z0 } = FIELD[key];
        (species[key] ?? []).forEach(([sci], k) => {
          const list = plants[key].filter((p) => p.sp === sci);
          if (!list.length) return;
          const herb = /Acanthus|Aegiceras/.test(sci);
          const h = herb ? 0.6 : 1.6 + (k % 3) * 0.4;
          const trunk = new THREE.InstancedMesh(trunkGeo, tint('#6b4f36', { tex: 'bark' }), list.length);
          const crown = new THREE.InstancedMesh(crownGeo, tint(COLORS[k % COLORS.length], { tex: 'leaf' }), list.length);
          list.forEach((p, i) => {
            const x = x0 + p.x * S;
            const z = z0 + p.y * S;
            m4.makeScale(1, h, 1).setPosition(x, h / 2 - 0.08, z);
            trunk.setMatrixAt(i, m4);
            const c = herb ? 0.5 : 0.8;
            m4.makeScale(c, c * 0.7, c).setPosition(x, h, z);
            crown.setMatrixAt(i, m4);
          });
          group.add(trunk, crown);
          meshes.push(trunk, crown);
        });
      }
    },
    // Khung ô tiêu chuẩn vừa đặt: [{ site, x, y, size }] (m, toạ độ khu thật)
    setQuadrats(list) {
      quad.clear();
      for (const q of list) {
        const { x0, z0 } = FIELD[q.site];
        const s = q.size * S;
        const frame = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(s, 0.02, s)), new THREE.LineBasicMaterial({ color: '#f2d43a' }));
        frame.position.set(x0 + (q.x + q.size / 2) * S, 0.02, z0 + (q.y + q.size / 2) * S);
        quad.add(frame);
      }
    },
  };
}
