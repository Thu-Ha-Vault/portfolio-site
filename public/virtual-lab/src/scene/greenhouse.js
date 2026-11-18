import * as THREE from 'three';
import { mats, tint, box, put, random } from './materials.js';
import { GREENHOUSE } from './layout.js';
import { surface } from './textures.js';
import { WEATHER } from '../core/climate.js';

// Khu trồng trọt cạnh phòng thí nghiệm: khung thép, luống đậu Hà Lan, và thời tiết mô phỏng
// (nắng, mây, mưa, độ ẩm, ánh sáng). Nhiệt độ thể hiện qua màu lá.

const LEAF = { good: '#4f9d50', warn: '#9db244', bad: '#c49a3a' };
const PALE = new THREE.Color('#b9d39a');
const rnd = random(7);

export function buildGreenhouse(root, labels, scene) {
  const { minX, maxX, minZ, maxZ, eaveH, ridgeH } = GREENHOUSE;
  const cx = (minX + maxX) / 2;
  const w = maxX - minX;
  const d = maxZ - minZ;
  const g = new THREE.Group();
  root.add(g);

  put(g, box(w, 0.1, d, tint('#cdb898', { tex: 'gravel' })), cx, -0.1, 0);

  // Khung: cột, vì kèo, xà dọc
  for (let x = minX; x <= maxX + 1e-6; x += 4) {
    for (const z of [minZ, maxZ]) put(g, box(0.1, eaveH, 0.1, mats.frame, false), x, 0, z);
    g.add(beam(x, eaveH, minZ, ridgeH, 0), beam(x, eaveH, maxZ, ridgeH, 0));
  }
  for (const [z, y] of [[minZ, eaveH], [maxZ, eaveH], [0, ridgeH]]) put(g, box(w, 0.08, 0.08, mats.frame, false), cx, y - 0.04, z);
  const gableH = eaveH + (ridgeH - eaveH) * 0.5;
  for (const x of [minX, maxX]) for (const z of [-5, 5]) put(g, box(0.08, gableH, 0.08, mats.frame, false), x, 0, z);

  // Luống đất, cọc và dây cho đậu leo
  const beds = [-6.3, -2.1, 2.1, 6.3];
  const bedLen = w - 4;
  for (const bz of beds) {
    put(g, box(bedLen, 0.35, 1.3, tint('#9b7b56', { tex: 'wood' })), cx, 0, bz);
    put(g, box(bedLen - 0.2, 0.03, 1.12, tint('#6b543f', { tex: 'soil', texOpts: { size: 0.5 } }), false), cx, 0.35, bz);
    for (const x of [cx - bedLen / 2 + 0.2, cx + bedLen / 2 - 0.2]) put(g, box(0.05, 1.4, 0.05, mats.frame, false), x, 0.35, bz);
    put(g, box(bedLen - 0.4, 0.015, 0.015, mats.frame, false), cx, 1.7, bz);
  }

  // Cây đậu: thân, tán lá, hoa và quả dùng InstancedMesh. Mỗi luống là một nhóm cây của thí nghiệm Mendel;
  // chưa gieo gì thì luống trồng cây mẫu đã lớn để khu trồng trọt không trống.
  const perRow = 22;
  const perBed = perRow * 2;
  const n = perBed * beds.length;
  const leafMat = surface(new THREE.MeshStandardMaterial({ color: LEAF.good, roughness: 0.85, flatShading: true }), 'leaf', { size: 0.3 });
  const stems = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.012, 0.018, 0.9, 6), tint('#5d8a3e'), n);
  const leaves = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(0.17, 0), leafMat, n * 2);
  const flowers = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(0.085, 0), new THREE.MeshStandardMaterial({ roughness: 0.6 }), n);
  const pods = new THREE.InstancedMesh(new THREE.CapsuleGeometry(0.035, 0.16, 3, 6), new THREE.MeshStandardMaterial({ roughness: 0.7 }), n);
  const m4 = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const e = new THREE.Euler();
  const s = new THREE.Vector3();
  const p = new THREE.Vector3();
  const ZERO = new THREE.Matrix4().makeScale(0, 0, 0);
  const COLOR = { purple: new THREE.Color('#8a4fb0'), white: new THREE.Color('#f3f1ea'), bud: new THREE.Color('#9cc46a'), green: new THREE.Color('#5f9a3c'), yellow: new THREE.Color('#d9c24a'), dry: new THREE.Color('#c8ae78') };
  // Vị trí và độ lệch ngẫu nhiên cố định của từng chỗ trồng
  const slots = [];
  for (const bz of beds) {
    for (const dz of [-0.3, 0.3]) {
      for (let i = 0; i < perRow; i++) {
        const x = cx - bedLen / 2 + 0.6 + i * ((bedLen - 1.2) / (perRow - 1));
        slots.push({ x, z: bz + dz, h: 0.75 + rnd() * 0.4, leaf: [0, 1].map(() => ({ sc: 0.8 + rnd() * 0.6, rx: rnd() * 3, ry: rnd() * 3, dx: (rnd() - 0.5) * 0.15, dz: (rnd() - 0.5) * 0.15 })) });
      }
    }
  }
  // look: { size 0–1, tall, flower: null | 'bud' | 'purple' | 'white' | '#màu', pod: null | 'green' | 'yellow' | 'dry' | '#màu',
  //         form: 'climber' (đậu leo giàn) | 'spike' (hoa mõm chó: thân đứng, chùm hoa dài) | 'bush' (bí: bụi thấp, lá to, quả to) }
  const PLAIN = new THREE.Color('#ffffff');
  const SICK = new THREE.Color('#f2f2ee').lerp(new THREE.Color('#9aa08f'), 0.35);
  const BAG = new THREE.Color('#d8c7a3'); // túi giấy bao hoa
  function placePlant(k, look) {
    const sl = slots[k];
    if (!look || look.size <= 0) {
      stems.setMatrixAt(k, ZERO);
      leaves.setMatrixAt(k * 2, ZERO);
      leaves.setMatrixAt(k * 2 + 1, ZERO);
      flowers.setMatrixAt(k, ZERO);
      pods.setMatrixAt(k, ZERO);
      return;
    }
    const form = look.form ?? 'climber';
    const h = form === 'bush' ? 0.28 * look.size : sl.h * look.size * (form === 'spike' ? 0.75 : look.tall ? 1 : 0.4);
    const leafK = form === 'bush' ? 2.4 : form === 'spike' ? 0.7 : 1;
    stems.setMatrixAt(k, m4.compose(p.set(sl.x, 0.38 + h / 2, sl.z), q.identity(), s.set(1, h / 0.9, 1)));
    sl.leaf.forEach((lf, j) => {
      const sc = lf.sc * leafK * Math.max(0.25, Math.min(1, look.size * 1.3));
      q.setFromEuler(e.set(lf.rx, lf.ry, 0));
      p.set(sl.x + lf.dx * leafK, 0.38 + h * (form === 'spike' ? 0.2 + j * 0.25 : 0.55 + j * 0.4), sl.z + lf.dz * leafK);
      leaves.setMatrixAt(k * 2 + j, m4.compose(p, q, s.set(sc, sc * 0.8, sc)));
      // Lá bệnh phấn trắng: phủ lớp trắng xám (nhân với màu lá chung)
      leaves.setColorAt(k * 2 + j, look.sick ? SICK : PLAIN);
    });
    const top = 0.38 + h + 0.04;
    const fk = look.flower === 'bud' ? 0.6 : 1;
    const fScale = form === 'spike' ? s.set(0.8 * fk, 2.2 * fk, 0.8 * fk) : form === 'bush' ? s.setScalar(1.7 * fk) : s.setScalar(fk);
    flowers.setMatrixAt(k, look.flower ? m4.compose(p.set(sl.x + 0.06, form === 'spike' ? top + 0.1 : top, sl.z), q.identity(), fScale) : ZERO);
    if (look.flower) flowers.setColorAt(k, look.bagged ? BAG : COLOR[look.flower] ?? new THREE.Color(look.flower));
    const big = form === 'bush';
    pods.setMatrixAt(k, look.pod ? m4.compose(p.set(sl.x - 0.07, big ? 0.45 : 0.38 + h * 0.7, sl.z), q.setFromEuler(e.set(0, 0, big ? 1.5 : 0.5)), s.setScalar(big ? 2.6 : 1)) : ZERO);
    if (look.pod) pods.setColorAt(k, COLOR[look.pod] ?? new THREE.Color(look.pod));
  }
  const decor = { size: 1, tall: true, flower: null, pod: null };
  for (let k = 0; k < n; k++) placePlant(k, decor);
  flowers.setColorAt(0, COLOR.bud);
  pods.setColorAt(0, COLOR.green);
  g.add(stems, leaves, flowers, pods);
  const bedLabels = beds.map((bz) => labels.add('', new THREE.Vector3(cx - bedLen / 2 + 0.4, 1.0, bz), { kind: 'sub', max: 40 }));
  bedLabels.forEach((l) => { l.element.hidden = true; });

  // Vẽ lại luống theo trạng thái thí nghiệm Mendel: tối đa 4 nhóm cây đang trồng, mỗi luống tối đa 44 cây
  function setGarden(state) {
    const growing = state.groups.filter((gr) => !gr.harvested).slice(-beds.length);
    const empty = !state.groups.length;
    for (let b = 0; b < beds.length; b++) {
      const gr = growing[b];
      for (let i = 0; i < perBed; i++) {
        const k = b * perBed + i;
        if (empty) placePlant(k, decor);
        else if (!gr || i >= gr.n || gr.stage === 'seed') placePlant(k, null);
        else {
          const lk = gr.look[i];
          const stage = gr.stage;
          const form = state.species?.form ?? 'climber';
          // Bí không có tính trạng màu hoa: hoa vàng; quả có màu theo kiểu gen (fruit)
          const flowerStage = stage === 'bud' ? 'bud' : stage === 'flower' ? lk.flower ?? (form === 'bush' ? '#f2b705' : lk.purple ? 'purple' : 'white') : null;
          const pod = stage === 'pod' ? lk.fruit ?? (lk.greenPod ? 'green' : 'yellow') : stage === 'ripe' ? lk.fruit ?? 'dry' : null;
          placePlant(k, { size: Math.min(1, Math.max(0.12, gr.growth / 50)), tall: lk.tall, flower: flowerStage, pod, form, sick: gr.sick, bagged: gr.bagged && (stage === 'bud' || stage === 'flower') });
        }
      }
      const label = bedLabels[b];
      label.element.hidden = !gr;
      if (gr) label.element.textContent = `${gr.id} · ${gr.n} cây · ${state.stageNames?.[gr.stage] ?? gr.stage}`;
    }
    if (state.species) speciesLabel.element.textContent = `Luống ${state.species.name.charAt(0).toLowerCase()}${state.species.name.slice(1)} · ${state.species.latin}`;
    for (const mesh of [stems, leaves, flowers, pods]) {
      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    }
  }
  const speciesLabel = labels.add('Luống đậu Hà Lan · Pisum sativum', new THREE.Vector3(cx, 2.1, beds[0]), { kind: 'sub', max: 40 });

  // Bộ điều khiển khí hậu ở lối vào
  put(g, box(0.6, 1.5, 0.35, tint('#eef1f4')), minX + 0.9, 0, 2.6);
  put(g, box(0.4, 0.3, 0.012, tint('#5f86a3'), false), minX + 0.9, 1.0, 2.6 + 0.18);
  const readout = labels.add('', new THREE.Vector3(minX + 0.9, 1.9, 2.6), { kind: 'sub', max: 40 });

  // Buồng sinh trưởng Conviron GEN1000 (1040 × 825 × 1960 mm, data sheet 2025) ở lối vào, cửa quay về phía luống
  const chamber = new THREE.Group();
  chamber.userData.info = 'growth-chamber';
  chamber.userData.figureSlot = { id: 'growthchamber', rotY: Math.PI / 2 }; // mặt trước hình +z, buồng quay mặt +x
  put(chamber, box(0.825, 1.52, 1.04, tint('#eef1f4')), 0, 0.08, 0);
  put(chamber, box(0.825, 0.44, 1.04, tint('#cfd6dc')), 0, 1.6, 0);
  put(chamber, box(0.01, 0.95, 0.34, mats.glass), 0.418, 0.35, 0);
  put(chamber, box(0.012, 0.08, 0.14, tint('#3a4652'), false), 0.418, 1.75, 0.3);
  chamber.position.set(minX + 0.8, 0, -3.2);
  g.add(chamber);
  labels.add('Buồng sinh trưởng', new THREE.Vector3(minX + 0.8, 2.25, -3.2), { kind: 'sub', max: 14 });

  // Mặt trời: một đèn spot chỉ chiếu khu trồng trọt
  const spot = new THREE.SpotLight('#fff1d0', 2, 0, 0.36, 0.45, 0);
  spot.position.set(cx + 4, 30, minZ - 6);
  spot.target.position.set(cx, 0, 0);
  scene.add(spot, spot.target);
  const sun = new THREE.Mesh(new THREE.SphereGeometry(1.3, 24, 16), new THREE.MeshBasicMaterial({ color: '#ffd35a' }));
  sun.position.set(cx + 4, 17, minZ - 6);
  g.add(sun);

  const cloudMat = new THREE.MeshStandardMaterial({ color: '#e9eef3', roughness: 1, flatShading: true });
  const clouds = new THREE.Group();
  const puff = new THREE.IcosahedronGeometry(1, 1);
  for (const [x, y, z, r] of [[-5, 0, -3, 2.2], [-2.5, 0.5, -3.5, 2.8], [0.5, 0, -2.6, 2.3], [3, 0.3, 2, 2.6], [5.5, 0, 2.5, 2], [-1, 0.2, 3, 2.4], [1.8, 0.6, 3.6, 1.9]]) {
    const m = new THREE.Mesh(puff, cloudMat);
    m.position.set(x, y, z);
    m.scale.set(r, r * 0.55, r);
    clouds.add(m);
  }
  clouds.position.set(cx, 10.5, 0);
  clouds.visible = false;
  g.add(clouds);

  // Mưa: mỗi hạt là một đoạn thẳng ngắn rơi xuống, chạm đất thì quay lại trên cao
  const N = 1600;
  const pos = new Float32Array(N * 6);
  const speed = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    const x = minX + 0.3 + rnd() * (w - 0.6);
    const z = minZ + 0.3 + rnd() * (d - 0.6);
    const y = 0.3 + rnd() * 9.7;
    pos.set([x, y, z, x, y - 0.28, z], i * 6);
    speed[i] = 7 + rnd() * 3;
  }
  const rainGeo = new THREE.BufferGeometry();
  rainGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const rain = new THREE.LineSegments(rainGeo, new THREE.LineBasicMaterial({ color: '#7fb0d6', transparent: true, opacity: 0.75 }));
  rain.frustumCulled = false;
  rain.visible = false;
  g.add(rain);

  // Hơi ẩm: một khối mờ, càng ẩm càng đặc
  const mist = new THREE.Mesh(
    new THREE.BoxGeometry(w - 0.4, 2.4, d - 0.4),
    new THREE.MeshBasicMaterial({ color: '#f4f8fb', transparent: true, opacity: 0, depthWrite: false }),
  );
  mist.position.set(cx, 1.2, 0);
  mist.visible = false;
  g.add(mist);

  let t = 0;
  function update(dt) {
    t += dt;
    clouds.position.x = cx + Math.sin(t * 0.07) * 1.5;
    if (!rain.visible) return;
    for (let i = 0; i < N; i++) {
      const o = i * 6;
      let y = pos[o + 1] - speed[i] * dt;
      if (y < 0.3) y += 9.7;
      pos[o + 1] = y;
      pos[o + 4] = y - 0.28;
    }
    rainGeo.attributes.position.needsUpdate = true;
  }

  function setClimate(state, ev) {
    const f = (state.light / 100) * WEATHER[state.weather].light;
    spot.intensity = 0.15 + 2.4 * f;
    sun.visible = state.weather === 'sun' && state.light > 0;
    clouds.visible = state.weather !== 'sun';
    cloudMat.color.set(state.weather === 'rain' ? '#8c97a3' : '#e9eef3');
    rain.visible = state.weather === 'rain';
    const mo = THREE.MathUtils.clamp((state.humidity - 55) / 45, 0, 1) * 0.3;
    mist.material.opacity = mo;
    mist.visible = mo > 0.01;
    leafMat.color.set(LEAF[ev.tempLevel]);
    if (ev.lightLevel < 25) leafMat.color.lerp(PALE, 0.5);
    readout.element.textContent = `${state.temp} °C · ${state.humidity} % · ${WEATHER[state.weather].name}`;
  }

  return { update, setClimate, setGarden, chamber };
}

// Thanh vì kèo nối (y0, z0) với (y1, z1) trong mặt phẳng x cố định
function beam(x, y0, z0, y1, z1) {
  const len = Math.hypot(y1 - y0, z1 - z0);
  const m = new THREE.Mesh(new THREE.BoxGeometry(0.08, len, 0.08), mats.frame);
  m.position.set(x, (y0 + y1) / 2, (z0 + z1) / 2);
  m.rotation.x = Math.atan2(z1 - z0, y1 - y0);
  return m;
}
