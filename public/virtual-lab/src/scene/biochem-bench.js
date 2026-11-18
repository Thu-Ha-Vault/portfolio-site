import * as THREE from 'three';
import { tint, box, cyl, put, mats } from './materials.js';
import { BENCH, TUBE_RACK, WATER_BATH } from './layout.js';

// Giá ống nghiệm và bể ổn nhiệt trên bàn sinh học phân tử (bài hoá sinh định tính, src/core/biochem.js).
// Màu dung dịch, kết tủa ở đáy và vòng ở mặt phân cách của từng ống lấy từ BiochemLab.figureData().

const V = (x, y, z) => new THREE.Vector3(x, y, z);
const HOUSING = '#eef1f4';
const STEEL = '#c9d0d6';

export function buildBiochemBench(root, labels) {
  const R = TUBE_RACK;
  const rack = new THREE.Group();
  const w = R.n * R.pitch + 0.03;
  // Giá nhựa hai tầng: tầng đỡ đáy và tầng có lỗ giữ thân ống
  put(rack, box(w, 0.008, R.d, tint('#dfe4e8')), 0, 0, 0);
  put(rack, box(w, 0.01, R.d, tint('#dfe4e8')), 0, R.h, 0);
  for (const dx of [-w / 2 + 0.006, w / 2 - 0.006]) put(rack, box(0.008, R.h, R.d, tint('#dfe4e8')), dx, 0, 0);
  const tubes = [];
  for (let i = 0; i < R.n; i++) {
    const x = -w / 2 + 0.015 + R.pitch * (i + 0.5);
    const glass = put(rack, cyl(R.tubeR, R.tubeR, R.tubeH, mats.glass, { seg: 14 }), x, 0.008, 0);
    const liqMat = new THREE.MeshStandardMaterial({ color: '#dfe9ee', transparent: true, opacity: 0.85, roughness: 0.3 });
    const liquid = new THREE.Mesh(new THREE.CylinderGeometry(R.tubeR * 0.86, R.tubeR * 0.86, 1, 12), liqMat);
    liquid.visible = false;
    rack.add(liquid);
    const pptMat = new THREE.MeshStandardMaterial({ color: '#a8432a', roughness: 0.9 });
    const ppt = new THREE.Mesh(new THREE.CylinderGeometry(R.tubeR * 0.85, R.tubeR * 0.6, 0.012, 12), pptMat);
    ppt.visible = false;
    rack.add(ppt);
    const ringMat = new THREE.MeshStandardMaterial({ color: '#6f4aa6', roughness: 0.5 });
    const ring = new THREE.Mesh(new THREE.CylinderGeometry(R.tubeR * 0.9, R.tubeR * 0.9, 0.006, 12), ringMat);
    ring.visible = false;
    rack.add(ring);
    tubes.push({ x, glass, liquid, ppt, ring });
  }
  rack.position.set(R.x, BENCH.top, R.z);
  rack.userData.info = 'test-tube-rack';
  root.add(rack);

  // Bể ổn nhiệt: thân, bảng điều khiển phía trước, nắp
  const B = WATER_BATH;
  const bath = new THREE.Group();
  put(bath, box(B.w, B.h, B.d, tint(HOUSING)), 0, 0, 0);
  put(bath, box(B.w * 0.9, B.h * 0.32, 0.01, tint('#3a4652'), false), 0, B.h * 0.2, B.d / 2 + 0.004);
  const lid = put(bath, box(B.w * 0.96, 0.012, B.d * 0.82, tint(STEEL)), 0, B.h, -0.01);
  lid.userData.keep = true; // nắp mở, đóng theo bài: giữ khi thay bằng bản 3D
  put(bath, box(0.05, 0.012, 0.012, tint('#3a4652'), false), 0, B.h + 0.012, B.d * 0.32);
  bath.position.set(B.x, BENCH.top, B.z);
  bath.userData.info = 'water-bath';
  bath.userData.figureSlot = { id: 'waterbath' };
  root.add(bath);
  const status = labels.add('', V(B.x, BENCH.top + B.h + 0.08, B.z), { kind: 'sub', max: 6 });
  const rackStatus = labels.add('', V(R.x, BENCH.top + R.tubeH + 0.06, R.z), { kind: 'sub', max: 6 });

  return {
    rack,
    bath,
    // fd: BiochemLab.figureData()
    setState(fd) {
      const byN = new Map(fd.tubes.map((t) => [t.n, t]));
      tubes.forEach((tb, i) => {
        const t = byN.get(i + 1);
        tb.liquid.visible = Boolean(t);
        tb.ppt.visible = Boolean(t?.precipitate);
        tb.ring.visible = Boolean(t?.ring);
        if (!t) return;
        const h = Math.max(0.01, t.level * (R.tubeH - 0.02));
        tb.liquid.scale.y = h;
        tb.liquid.position.set(tb.x, 0.012 + h / 2, 0);
        tb.liquid.material.color.set(t.color);
        if (t.precipitate) {
          tb.ppt.material.color.set(t.precipitate);
          tb.ppt.position.set(tb.x, 0.018, 0);
        }
        if (t.ring) {
          tb.ring.material.color.set(t.ring);
          tb.ring.position.set(tb.x, 0.012 + h, 0);
        }
      });
      lid.visible = fd.lid !== 'open';
      status.element.textContent = fd.setC > 30 ? `${Math.round(fd.waterC)} °C` : '';
      rackStatus.element.textContent = fd.tubes.length ? `${fd.tubes.length} ống` : '';
    },
  };
}
