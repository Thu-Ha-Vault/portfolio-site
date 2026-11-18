import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS2DRenderer } from 'three/addons/renderers/CSS2DRenderer.js';
import { applyPalette } from './materials.js';
import { LabelSet } from './labels.js';
import { ZONES, BENCH, ROOM, BUILDING, ICE_BUCKET, CHEM_BENCH_TOOLS, FUME_HOOD, SAFETY, WATER_BATH, DISSECT } from './layout.js';
import { buildRoom, buildBench, buildGlassware, buildOrganismArea, buildInstruments, upgradeMachines, upgradeSlots } from './room.js';
import { buildCold } from './cold.js';
import { buildChemCabinets } from './chem-store.js';
import { buildSafety } from './safety.js';
import { buildChemBench } from './chem-bench.js';
import { buildBiochemBench } from './biochem-bench.js';
import { buildField } from './field.js';
import { buildCatBaMap } from './catba-map.js';
import { buildDissectBench } from './dissect-bench.js';
import { buildFumeHood } from './fumehood.js';
import { createClicker } from './interact.js';
import { tint, box, put } from './materials.js';
import { buildGreenhouse } from './greenhouse.js';
import { buildBenchItems, BOTTLE_MOUTH } from './bench-items.js';
import { createDragController } from './drag.js';
import { createInfo } from './info.js';
import { createFx } from './fx.js';
import { buildHeatStation } from './heat-station.js';
import { setTextures } from './textures.js';
import { createQuality, autoLevel, lowerLevel } from './quality.js';
import { buildBuilding } from './building.js';
import { buildServices } from './services.js';
import { buildConsumables } from './consumables.js';
import { WALK, step as walkStep, eyeLevel, teleport } from '../core/walk.js';
import { roomAt } from '../core/facility.js';

const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const darkScheme = matchMedia('(prefers-color-scheme: dark)');

// Dựng toàn bộ cảnh 3D và trả về các hàm điều khiển cho giao diện.
// onPour(substanceId, containerId) phải trả về { appearance, gas } từ lõi mô phỏng.
export function createLabScene({ container, substances, containers, apparatus = {}, facility = null, onHandPour, onPower, onRoom, onFixture, onCap, safety = null, catba = null, dissection = null, onDissect, onPour, onZone, onDetail, onAction, onPick, onDoor, onHold, onHeat, onLamp, onStation, onMapPick, onMapSite }) {
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  const labelRenderer = new CSS2DRenderer();
  labelRenderer.domElement.className = 'label-layer';
  container.appendChild(labelRenderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.05, 500);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  // Cho phép hạ camera tới tầm nhìn ngang (đi lại ở tầm mắt bằng bảng Di chuyển); camera không xuống dưới sàn (tick)
  controls.maxPolarAngle = Math.PI / 2;
  controls.minDistance = 0.8;
  controls.maxDistance = 120;
  controls.screenSpacePanning = false;

  const hemi = new THREE.HemisphereLight('#ffffff', '#aab6c0', 1.5);
  scene.add(hemi);
  const key = new THREE.DirectionalLight('#ffffff', 1.6);
  key.position.set(-14, 32, 20);
  const fill = new THREE.DirectionalLight('#dfe9f2', 0.5);
  fill.position.set(20, 18, -24);
  scene.add(key, fill);

  const themeName = () => {
    const t = document.documentElement.dataset.theme;
    return t === 'dark' || (t !== 'light' && darkScheme.matches) ? 'dark' : 'light';
  };
  let quality = null;
  const applyTheme = () => {
    applyPalette(scene, themeName());
    if (quality?.level() && quality.level() !== 'sketch') scene.environmentIntensity = themeName() === 'dark' ? 0.45 : 0.75;
  };
  applyTheme();
  darkScheme.addEventListener('change', applyTheme);
  new MutationObserver(applyTheme).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  const root = new THREE.Group();
  scene.add(root);
  // Mức hình ảnh (src/scene/quality.js): chọn theo máy, ghi đè bằng setQuality hoặc ?q= trong địa chỉ
  quality = createQuality({ renderer, scene, camera, controls, root, lights: { hemi, key, fill }, dark: () => themeName() === 'dark' });
  let qualityChoice = 'auto';
  const pixelCap = { sketch: 2, low: 1, medium: 1.5, high: 2 };
  function setQuality(choice) {
    qualityChoice = choice;
    const lv = choice === 'auto' ? autoLevel() : choice;
    quality.set(lv);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, pixelCap[lv]));
    if (lv === 'medium' || lv === 'high') { upgradeMachines(machines, wireScreen); upgradeSlots(root); }
    return lv;
  }
  const labels = new LabelSet(scene);
  buildRoom(root);
  const building = buildBuilding(root, labels);
  labels.occluded = building.blocked;
  const services = facility ? buildServices(root, facility) : null;
  buildConsumables(root);
  buildBench(root, labels);
  const hood = buildFumeHood(root, labels);
  const chemCabs = buildChemCabinets(root, labels, substances);
  buildSafety(root, labels);
  const chemBench = buildChemBench(root, labels);
  const biochemBench = buildBiochemBench(root, labels);
  const field = buildField(root, labels);
  // Sa bàn quần đảo Cát Bà từ ảnh vệ tinh, phía tây khu thực địa
  const catbaMap = catba ? buildCatBaMap(root, labels, { ...catba, onSite: (id) => onMapSite?.(id), onPick: (u, v) => onMapPick?.(u, v), reduced: () => reducedMotion.matches }) : null;
  buildGlassware(root, labels);
  const cold = buildCold(root, labels);
  // Hộp đá trên bàn sinh học phân tử: ống thuốc thử lấy từ tủ đông được giữ ở đây
  const ice = put(root, box(ICE_BUCKET.w, ICE_BUCKET.h, ICE_BUCKET.d, tint('#d8ecf7')), ICE_BUCKET.x, BENCH.top, ICE_BUCKET.z);
  ice.userData.info = 'ice-bucket';
  const organisms = buildOrganismArea(root, labels);
  const machines = buildInstruments(root, labels);
  // Nút trên từng máy: "Cận cảnh" mở hình chi tiết; nút thao tác chạy đúng các ống trên bàn sinh học phân tử
  // Máy liền kề trên cùng đảo bàn: nhãn so le hai độ cao để không chồng lên nhau
  const rows = new Map();
  for (const m of machines.values()) {
    const key = m.def.floor ? m.def.id : m.def.bench;
    if (!rows.has(key)) rows.set(key, []);
    rows.get(key).push(m);
  }
  for (const list of rows.values()) {
    list.sort((a, b) => a.x - b.x).forEach((m, i) => {
      const lift = (i % 2) * 0.32;
      if (m.def.detail) labels.add(`Cận cảnh ${/^[A-ZĐ][a-zà-ỹ]/.test(m.def.name) ? m.def.name.charAt(0).toLowerCase() + m.def.name.slice(1) : m.def.name}`, new THREE.Vector3(m.x, m.topY + 0.48 + lift, m.z), { kind: 'detail', max: 18, onClick: () => onDetail?.(m.def.detail) });
      (m.def.actions ?? []).forEach(([text, acts], k) => labels.add(text, new THREE.Vector3(m.x, m.topY + 0.74 + lift + k * 0.26, m.z), { kind: 'action', max: 18, onClick: () => acts.forEach((a) => onAction?.(a)) }));
    });
  }
  const greenhouse = buildGreenhouse(root, labels, scene);
  const fx = createFx(scene, { reduced: () => reducedMotion.matches });
  const bench = buildBenchItems(root, labels, substances, containers, { fx, reduced: () => reducedMotion.matches, safety });
  const station = buildHeatStation(root);
  // Khu giải phẫu động vật ở phần bàn nối dài bên phải
  const dissect = dissection ? buildDissectBench(root, labels, { data: dissection, onTake: (id) => onDissect?.('take', id), onTool: (k) => onDissect?.('tool', k), onOrgan: (id) => onDissect?.('organ', id) }) : null;

  for (const z of ZONES) {
    if (!z.label) continue;
    labels.add(z.labelText ?? z.name, new THREE.Vector3(...z.label), { kind: 'zone', min: 9, onClick: () => flyTo(z.id) });
  }

  // Hoạt cảnh đơn giản theo thời gian; tag 'item' để huỷ khi làm lại bàn thí nghiệm
  const tweens = new Set();
  function tween(duration, update, done, tag = 'item') {
    tweens.add({ t: 0, duration: Math.max(duration, 1e-3), update, done, tag });
  }

  // Vị trí camera của một khu. Khu có fit: giữ hướng nhìn đã đặt, tìm khoảng cách ngắn nhất
  // mà 8 góc của vùng fit đều nằm trong khung hình (tìm nhị phân).
  const probe = camera.clone();
  function viewOf(z) {
    const target = new THREE.Vector3(...z.target);
    const pos = new THREE.Vector3(...z.camera);
    if (!z.fit) return { pos, target };
    const [x0, x1, z0, z1, h] = z.fitNarrow && camera.aspect < 1 ? z.fitNarrow : z.fit;
    const corners = [];
    for (const x of [x0, x1]) for (const zz of [z0, z1]) for (const y of [0, h]) corners.push(new THREE.Vector3(x, y, zz));
    const dir = pos.clone().sub(target).normalize();
    const p = new THREE.Vector3();
    probe.copy(camera);
    let lo = 2;
    let hi = controls.maxDistance;
    for (let i = 0; i < 24; i++) {
      const mid = (lo + hi) / 2;
      probe.position.copy(dir).multiplyScalar(mid).add(target);
      probe.lookAt(target);
      probe.updateMatrixWorld();
      const inside = corners.every((c) => {
        p.copy(c).project(probe);
        return Math.abs(p.x) <= 0.94 && Math.abs(p.y) <= 0.9 && p.z < 1;
      });
      if (inside) hi = mid;
      else lo = mid;
    }
    return { pos: dir.multiplyScalar(hi).add(target), target };
  }

  // Khi đang ở khu có fit mà người dùng chưa tự xoay, đổi kích thước khung thì canh lại camera
  let fitting = ZONES[0].fit ? ZONES[0] : null;
  controls.addEventListener('start', () => { fitting = null; });

  function flyTo(id) {
    const z = ZONES.find((zz) => zz.id === id);
    if (!z) return;
    // Khu giải phẫu cho phép camera lại gần mẫu nhỏ; các khu khác giữ khoảng cách tối thiểu cũ
    controls.minDistance = id === 'dissect' ? 0.3 : 0.8;
    onZone?.(id);
    fitting = z.fit ? z : null;
    const p0 = camera.position.clone();
    const t0 = controls.target.clone();
    const { pos: p1, target: t1 } = viewOf(z);
    for (const tw of tweens) if (tw.tag === 'camera') tweens.delete(tw);
    if (reducedMotion.matches) {
      camera.position.copy(p1);
      controls.target.copy(t1);
      return;
    }
    tween(1.0, (k) => {
      const e = ease(k);
      camera.position.lerpVectors(p0, p1, e);
      controls.target.lerpVectors(t0, t1, e);
    }, () => {
      // Khung nhìn có thể đã đổi kích thước trong lúc bay (bố cục trang vừa dựng xong): canh lại theo khung hiện tại
      if (fitting !== z) return;
      const v = viewOf(z);
      camera.position.copy(v.pos);
      controls.target.copy(v.target);
    }, 'camera');
  }

  // Nhìn gần vật chứa vừa có phản ứng, như người làm thí nghiệm cúi xuống quan sát: camera tới cách khoảng 0,6 m, nhìn
  // chếch xuống. Tắt bằng nút "Tự nhìn gần". Giảm chuyển động thì đặt camera ngay.
  let autoFocus = true;
  function focusOn(id) {
    if (!autoFocus || !bench.containers.has(id)) return;
    const v = bench.vessel(id);
    const t1 = new THREE.Vector3(v.x, v.bottom + 0.06, v.z);
    const dir = new THREE.Vector3(0, 0.55, 1).normalize();
    const p1 = t1.clone().addScaledVector(dir, 0.62);
    fitting = null;
    for (const tw of tweens) if (tw.tag === 'camera') tweens.delete(tw);
    if (reducedMotion.matches) { camera.position.copy(p1); controls.target.copy(t1); return; }
    const p0 = camera.position.clone();
    const t0 = controls.target.clone();
    if (p0.distanceTo(p1) < 0.05) return;
    tween(0.8, (k) => {
      const e = ease(k);
      camera.position.lerpVectors(p0, p1, e);
      controls.target.lerpVectors(t0, t1, e);
    }, null, 'camera');
  }

  function returnHome(item) {
    item.busy = true;
    const g = item.group;
    const p0 = g.position.clone();
    const r0 = g.rotation.z;
    tween(0.35, (k) => {
      const e = ease(k);
      g.position.lerpVectors(p0, item.home, e);
      g.position.y += Math.sin(k * Math.PI) * 0.05;
      g.rotation.z = r0 * (1 - e);
    }, () => {
      g.position.copy(item.home);
      g.rotation.z = 0;
      item.busy = false;
    });
  }

  // Chai hoá chất nghiêng rót vào cốc: dòng chất lỏng chảy từ miệng chai xuống, màu trong cốc đổi dần.
  // Ống thuốc thử sinh học nhúng xuống như micropipet, nhả một giọt.
  // Người dùng chọn giảm chuyển động thì bỏ hoạt cảnh, cho kết quả ngay.
  function pour(item, containerId) {
    // Chế độ rót bằng tay (giai đoạn 7): bảng Thao tác tay điều khiển, cảnh chỉ đưa chai tới miệng cốc
    if (onHandPour?.(item.substance.id, containerId)) { handReady(item, containerId); return; }
    const c = bench.containers.get(containerId);
    const g = item.group;
    const apply = () => {
      const res = onPour(item.substance.id, containerId);
      bench.setAppearance(containerId, res.appearance, res);
    };
    focusOn(containerId);
    if (reducedMotion.matches) {
      apply();
      g.position.copy(item.home);
      g.rotation.z = 0;
      return;
    }
    const bio = item.substance.kind === 'bio';
    const solidSub = Boolean(item.substance.solid);
    const cp = c.group.position;
    const p0 = g.position.clone();
    // Chai nghiêng 1,9 rad quanh đáy: đặt chai sao cho miệng chai sau khi nghiêng nằm ngay trên miệng cốc (dụng cụ cỡ thật)
    const rim = bench.vessel(containerId).rim;
    const TILT = 1.9;
    const p1 = bio ? new THREE.Vector3(cp.x, rim + 0.05, cp.z) : solidSub ? new THREE.Vector3(cp.x - 0.06, rim + 0.06, cp.z) : new THREE.Vector3(cp.x - BOTTLE_MOUTH * Math.sin(TILT) - 0.004, rim + 0.025 - BOTTLE_MOUTH * Math.cos(TILT), cp.z);
    const color = item.substance.color ?? null;
    item.busy = true;
    tween(0.3, (k) => g.position.lerpVectors(p0, p1, ease(k)), () => {
      tween(0.4, (k) => {
        if (bio) g.position.y = p1.y - Math.sin(k * Math.PI) * 0.02;
        else g.rotation.z = -TILT * ease(k);
      }, () => {
        const v = bench.vessel(containerId);
        if (solidSub) {
          // Chất rắn: xúc một thìa rắc vào miệng ống hoặc cốc
          fx.powder(new THREE.Vector3(v.x, v.rim + 0.03, v.z), new THREE.Vector3(v.x, v.bottom + 0.002, v.z), item.substance.color);
          tween(0.5, () => {}, () => { apply(); tween(0.3, (k) => { g.rotation.z = -TILT * (1 - ease(k)); }, () => returnHome(item)); });
          return;
        }
        if (bio) {
          fx.drop(new THREE.Vector3(cp.x, v.rim + 0.02, cp.z), new THREE.Vector3(v.x, v.top, v.z), color);
          tween(0.15, () => {}, () => { apply(); returnHome(item); });
          return;
        }
        // Miệng chai sau khi nghiêng
        g.updateMatrixWorld(true);
        const mouth = g.localToWorld(new THREE.Vector3(0, BOTTLE_MOUTH - 0.01, 0));
        const surface = new THREE.Vector3(v.x - v.r * 0.3, Math.max(v.top, v.bottom + 0.01), v.z);
        fx.stream(mouth, surface, color, 0.7);
        tween(0.2, () => {}, apply);
        tween(0.75, () => {}, () => tween(0.3, (k) => { g.rotation.z = -TILT * (1 - ease(k)); }, () => returnHome(item)));
      });
    });
  }

  // ---- Rót bằng tay: chai dừng nghiêng sẵn trên miệng cốc; giữ nút "Giữ để rót" thì nghiêng hẳn và chảy ----
  const HAND_TILT = 1.9;
  let hand = null;
  function handReady(item, containerId) {
    if (hand) handEnd();
    const c = bench.containers.get(containerId);
    const g = item.group;
    const rim = bench.vessel(containerId).rim;
    const cp = c.group.position;
    const p1 = new THREE.Vector3(cp.x - BOTTLE_MOUTH * Math.sin(HAND_TILT) - 0.004, rim + 0.025 - BOTTLE_MOUTH * Math.cos(HAND_TILT), cp.z);
    item.busy = true;
    hand = { item, containerId, flow: false, t: 0, base: 0, p1 };
    focusOn(containerId);
    if (reducedMotion.matches) { g.position.copy(p1); g.rotation.z = -1.2; return; }
    const p0 = g.position.clone();
    tween(0.35, (k) => { g.position.lerpVectors(p0, p1, ease(k)); g.rotation.z = -1.2 * ease(k); });
  }
  // on: đang giữ nút; ml0: thể tích đang có trong cốc (mL) để vẽ mực dâng lên trong lúc rót; rate: mL/s ước lượng
  function handFlow(on, { ml0 = 0, rate = 4 } = {}) {
    if (!hand) return;
    const g = hand.item.group;
    hand.flow = on;
    hand.t = 0;
    hand.base = ml0;
    hand.rate = rate;
    if (!reducedMotion.matches) {
      const from = g.rotation.z;
      const to = on ? -HAND_TILT : -1.2;
      tween(0.25, (k) => { g.rotation.z = from + (to - from) * ease(k); });
    } else g.rotation.z = on ? -HAND_TILT : -1.2;
  }
  function handEnd() {
    if (!hand) return;
    const { item } = hand;
    hand = null;
    returnHome(item);
  }
  function handTick(dt) {
    if (!hand?.flow) return;
    hand.t += dt;
    const c = bench.containers.get(hand.containerId);
    // Mực dâng lên theo lưu lượng ước lượng (chỉ là cách vẽ trong lúc giữ; thể tích thật do lõi tính khi thả nút)
    const ml = hand.base + Math.max(0, hand.t - 0.4) * hand.rate;
    bench.setLevelFrac(hand.containerId, Math.min(1, ml / c.cap));
    hand.streamT = (hand.streamT ?? 0) - dt;
    if (hand.streamT <= 0 && hand.t > 0.4 && !reducedMotion.matches) {
      hand.streamT = 0.3;
      const g = hand.item.group;
      g.updateMatrixWorld(true);
      const v = bench.vessel(hand.containerId);
      fx.stream(g.localToWorld(new THREE.Vector3(0, BOTTLE_MOUTH - 0.01, 0)), new THREE.Vector3(v.x - v.r * 0.3, Math.max(v.top, v.bottom + 0.004), v.z), hand.item.substance.color ?? null, 0.35);
    }
  }
  // Nhỏ một giọt từ ống nhỏ giọt vào vật chứa (hoạt cảnh)
  function dropOne(substanceId, containerId) {
    if (reducedMotion.matches) return;
    const v = bench.vessel(containerId);
    const color = substances.find((x) => x.id === substanceId)?.color ?? null;
    fx.drop(new THREE.Vector3(v.x, v.rim + 0.03, v.z), new THREE.Vector3(v.x, v.top, v.z), color);
  }
  // Khuấy bằng đũa thuỷ tinh: đũa xoay tròn trong cốc khi đang giữ nút
  const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.0025, 0.0025, 0.2, 8), tint('#e6f0f6', { transparent: true, opacity: 0.6, roughness: 0.05 }));
  rod.visible = false;
  rod.userData.glass = true;
  scene.add(rod);
  let stirring = null;
  function stir(containerId, on) {
    stirring = on ? { id: containerId, t: 0 } : null;
    rod.visible = Boolean(on);
    if (on) focusOn(containerId);
  }
  function stirTick(dt) {
    if (!stirring) return;
    stirring.t += dt * (reducedMotion.matches ? 0 : 1);
    const v = bench.vessel(stirring.id);
    const a = stirring.t * 9;
    const r = v.r * 0.45;
    rod.position.set(v.x + Math.cos(a) * r, v.bottom + 0.1, v.z + Math.sin(a) * r);
    rod.rotation.set(Math.sin(a) * 0.18, 0, -Math.cos(a) * 0.18);
  }

  // Chú thích dụng cụ: tạo trước bộ kéo thả để nghe được giữ lâu trên đồ trên bàn
  const info = createInfo({ dom: renderer.domElement, host: container, camera, root, apparatus, substances, safety, onDetail: (id) => onDetail?.(id) });

  createDragController({
    dom: renderer.domElement,
    host: container,
    camera,
    bench,
    onDropReagent: pour,
    onReturn: returnHome,
    onSelect: (item) => hold(item),
    machines: () => [...[...machines.values()].filter((m) => m.def.accepts).map((m) => ({ id: m.def.id, group: m.group })), { id: 'lamp', group: station.lamp.group }, { id: 'tripod', group: station.tripod.group }],
    // Dời camera và tâm xoay theo mặt sàn, theo hướng nhìn hiện tại (giảm chuyển động thì bước ngắn hơn)
    onEdge: (dx, dy) => {
      const fwd = new THREE.Vector3().subVectors(controls.target, camera.position).setY(0).normalize();
      const right = new THREE.Vector3(-fwd.z, 0, fwd.x);
      const step = (reducedMotion.matches ? 0.03 : 0.06) * Math.max(1, camera.position.distanceTo(controls.target) / 6);
      const move = right.multiplyScalar(dx * step).add(fwd.multiplyScalar(-dy * step));
      camera.position.add(move);
      controls.target.add(move);
    },
    onDropMachine: (item, id) => {
      // Ống nghiệm hoặc cốc thả lên đèn cồn, kiềng: đun (thời gian theo bảng Đèn cồn)
      if (id === 'lamp' || id === 'tripod') {
        if (item.group.userData.heatable) onHeat?.(item.id);
        return;
      }
      if (!item.group.userData.tube) return;
      if (held) { held.group.position.y = BENCH.top; held = null; onHold?.(null); }
      for (const a of machines.get(id).def.actions[0][1]) onAction?.(a);
    },
  });

  // ---- Bộ đun bằng đèn cồn (giai đoạn 5 mục 2) ----
  let lampFlame = null;
  const lampHome = station.home.lamp.clone();
  const followFlame = () => lampFlame?.setPosition(station.flameBase());
  // Bật, tắt ngọn lửa; nắp đèn đặt cạnh đèn khi cháy, đậy lại khi tắt
  function setLamp(lit) {
    const L = station.lamp;
    if (lit && !lampFlame) lampFlame = fx.flame(station.flameBase(), { height: 0.045 });
    if (!lit && lampFlame) { lampFlame.remove(); lampFlame = null; }
    const to = lit ? L.capOff : L.capOn;
    if (reducedMotion.matches) { L.cap.position.copy(to); return; }
    const from = L.cap.position.clone();
    tween(0.4, (k) => { L.cap.position.lerpVectors(from, to, ease(k)); L.cap.position.y += Math.sin(k * Math.PI) * 0.04; }, null, 'station');
  }
  // Nhìn gần một điểm (bộ đun) như focusOn
  function focusPoint(t1, dist = 0.6) {
    if (!autoFocus) return;
    const p1 = t1.clone().addScaledVector(new THREE.Vector3(0, 0.55, 1).normalize(), dist);
    fitting = null;
    for (const tw of tweens) if (tw.tag === 'camera') tweens.delete(tw);
    if (reducedMotion.matches) { camera.position.copy(p1); controls.target.copy(t1); return; }
    const p0 = camera.position.clone();
    const t0 = controls.target.clone();
    tween(0.8, (k) => { camera.position.lerpVectors(p0, p1, ease(k)); controls.target.lerpVectors(t0, t1, ease(k)); }, null, 'camera');
  }

  // Đun một vật chứa: ống nghiệm kẹp nghiêng trên ngọn lửa (miệng ống hướng ra xa người), hoặc cốc đặt lên kiềng
  // và đèn đẩy vào dưới kiềng. Dòng thời gian của lõi (mỗi giây một mục) chạy nhanh khoảng 10 lần: sôi thì sủi bọt,
  // nóng thì bốc hơi, mực nước hạ khi bay hơi, khí và hơi màu bốc ra. Xong thì hiện trạng thái cuối của lõi.
  function playHeat(id, timeline, finalApp, capacity) {
    const c = bench.containers.get(id);
    const item = bench.items.get(id);
    if (!c || !item) return;
    const tube = c.def.kind === 'testtube';
    if (reducedMotion.matches || !timeline?.length) { bench.setAppearance(id, finalApp, { instant: true }); return; }
    const g = c.group;
    const T = station.tripod.group.position;
    const p0 = item.home.clone();
    const f = station.flameBase();
    const p1 = tube ? new THREE.Vector3(f.x, f.y + 0.028, f.z) : new THREE.Vector3(T.x, station.tripod.topY, T.z);
    const lampTo = tube ? null : new THREE.Vector3(T.x, BENCH.top, T.z);
    item.busy = true;
    focusPoint(new THREE.Vector3(p1.x, BENCH.top + 0.12, p1.z));
    const mouth = () => (tube ? g.localToWorld(new THREE.Vector3(0, c.rim, 0)) : new THREE.Vector3(g.position.x, g.position.y + c.rim, g.position.z));
    tween(0.6, (k) => {
      const e = ease(k);
      g.position.lerpVectors(p0, p1, e);
      g.position.y += Math.sin(k * Math.PI) * 0.08;
      if (tube) g.rotation.z = -0.6 * e; // nghiêng sang bên, miệng ống hướng ra xa người
      if (lampTo) { station.lamp.group.position.lerpVectors(lampHome, lampTo, e); followFlame(); }
    }, () => {
      const n = timeline.length;
      const dur = Math.min(7, Math.max(2.5, n / 10));
      const step = dur / n;
      let last = -1;
      tween(dur, (k) => {
        const i = Math.min(n - 1, Math.floor(k * n));
        const e = timeline[i];
        bench.setLevelFrac(id, e.volume / capacity);
        if (i === last) return;
        last = i;
        const v = bench.vessel(id);
        const m = mouth();
        if (e.boiling) fx.bubble(v, { rate: tube ? 70 : 120, seconds: step * 1.5, size: tube ? 0.0025 : 0.004, vigour: 1.6 });
        if (e.T > 60 && e.volume > 0.02) fx.vapor(m, '#f4f7fa', { seconds: step * 1.5, rate: tube ? 22 : 24, alpha: Math.min(0.75, (e.T - 50) / 60), rise: 0.07, size: tube ? [0.012, 0.05] : [0.02, 0.07] });
        if (e.vapor) fx.vapor(tube ? g.localToWorld(new THREE.Vector3(0, 0.06, 0)) : m, e.vapor, { seconds: step * 1.5, rate: 22, alpha: 0.55, rise: 0.025, spread: 0.006, size: [0.012, 0.04] });
        if (e.gases.includes('H2Og') && e.dry) fx.drop(m.clone().add(new THREE.Vector3(0, -0.01, 0)), m.clone().add(new THREE.Vector3(0, -0.03, 0)), '#dfeefa');
      }, () => {
        bench.setAppearance(id, finalApp, {});
        tween(0.6, (k) => {
          const e = ease(k);
          g.position.lerpVectors(p1, p0, e);
          g.position.y += Math.sin(k * Math.PI) * 0.08;
          if (tube) g.rotation.z = -0.6 * (1 - e);
          if (lampTo) { station.lamp.group.position.lerpVectors(lampTo, lampHome, e); followFlame(); }
        }, () => { g.position.copy(p0); g.rotation.z = 0; item.busy = false; });
      });
    });
  }

  // Thử màu ngọn lửa: dây đốt đưa vào phần ngoài ngọn lửa, ngọn lửa đổi màu khoảng 3 giây
  function flameTest(color) {
    if (!lampFlame) return;
    const w = station.wire;
    const home = station.home.wire;
    const f = station.flameBase();
    const at = new THREE.Vector3(f.x + 0.012, f.y + 0.03, f.z);
    focusPoint(new THREE.Vector3(f.x, f.y, f.z));
    const show = () => { lampFlame?.setColor(color); };
    const back = () => { lampFlame?.setColor(null); };
    if (reducedMotion.matches) { show(); tween(3, () => {}, back, 'station'); return; }
    tween(0.5, (k) => w.position.lerpVectors(home, at, ease(k)), () => {
      show();
      tween(3, () => {}, () => { back(); tween(0.5, (k) => w.position.lerpVectors(at, home, ease(k)), null, 'station'); }, 'station');
    }, 'station');
  }

  // Đốt băng magnesium: kẹp sắt đưa băng vào ngọn lửa, bắt cháy, chớp sáng trắng, khói trắng MgO
  function burnMg() {
    if (!lampFlame) return;
    const t = station.tongs;
    const home = station.home.tongs;
    const f = station.flameBase();
    const at = new THREE.Vector3(f.x + 0.1, f.y + 0.03, f.z);
    focusPoint(new THREE.Vector3(f.x, f.y, f.z));
    if (reducedMotion.matches) return;
    tween(0.5, (k) => t.group.position.lerpVectors(home, at, ease(k)), () => {
      tween(0.8, () => {}, () => {
        const p = new THREE.Vector3(f.x, f.y + 0.035, f.z);
        fx.burst(p, '#ffffff', 2.5);
        fx.vapor(p, '#f2f2f0', { seconds: 3, rate: 12, alpha: 0.45, rise: 0.08 });
        t.ribbon.visible = false;
        tween(2.8, () => {}, () => tween(0.5, (k) => t.group.position.lerpVectors(at, home, ease(k)), () => { t.ribbon.visible = true; }, 'station'), 'station');
      }, 'station');
    }, 'station');
  }

  // Que đóm đưa vào miệng ống: bùng cháy (O₂), tắt (CO₂) hoặc không đổi
  function splintTest(id, result) {
    const c = bench.containers.get(id);
    if (!c) return;
    const sp = station.splint;
    const home = station.home.splint;
    const m = new THREE.Vector3(c.group.position.x + 0.07, c.group.position.y + 0.185, c.group.position.z);
    focusPoint(m.clone().setY(BENCH.top + 0.1));
    if (reducedMotion.matches) return;
    tween(0.6, (k) => sp.position.lerpVectors(home, m, ease(k)), () => {
      const tip = m.clone().add(new THREE.Vector3(-0.065, 0, 0));
      if (result === 'relight') fx.burst(tip, '#ffb347', 1.2);
      else fx.vapor(tip, '#9aa3ab', { seconds: 1, rate: 15, alpha: 0.5, rise: 0.05, size: [0.01, 0.04] });
      tween(1.4, () => {}, () => tween(0.5, (k) => sp.position.lerpVectors(m, home, ease(k)), null, 'station'), 'station');
    }, 'station');
  }

  // Cửa tủ: bấm để mở hoặc đóng; giảm chuyển động thì mở ngay
  // Đồ treo tường của mọi khu (userData.mounted) ẩn cùng tường khi tường bị cắt thấp
  root.traverse((o) => o.userData.mounted?.forEach((m) => building.attach(m)));
  const clicker = createClicker({ dom: renderer.domElement, camera, ignore: () => info.swallow() });
  // Đồ cố định bấm được (giai đoạn 7): móc áo, hộp găng, giá kính, bồn rửa tay, bồn rửa dụng cụ
  if (services) {
    for (const f of facility.fixtures) {
      const g = services.groups.get(f.id);
      if (g && ['coats', 'gloves', 'goggles', 'handsink', 'labsink'].includes(f.kind)) clicker.add(g, () => onFixture?.(f.kind, f.id));
    }
  }
  // Bản đồ Cát Bà: bấm mặt bản đồ để đọc toạ độ và độ cao; bấm đinh ghim để xem điểm khảo sát
  if (catbaMap) {
    for (const s of catba.data.sites) {
      const pin = catbaMap.sitePin(s.id);
      if (pin) clicker.add(pin, () => onMapSite?.(s.id));
    }
    clicker.add(catbaMap.terrain, (hit) => catbaMap.pick(hit));
  }
  dissect?.wire(clicker);
  building.wire(clicker);
  function swing(cab, v) {
    if (cab.open === v) return;
    if (reducedMotion.matches) return cab.setOpen(v);
    const a0 = cab.angle;
    tween(0.5, (k) => cab.setOpen(v, a0 + ((v ? 1 : 0) - a0) * ease(k)), () => cab.setOpen(v), 'door');
  }
  function setDoor(place, v) {
    const u = cold.units.get(place);
    if (!u || u.cab.open === v) return;
    onDoor?.(place, v);
    swing(u.cab, v);
  }
  labels.add('Cận cảnh kính lúp soi nổi', new THREE.Vector3(-10.7, 1.75, ROOM.maxZ - 0.4), { kind: 'detail', max: 22, onClick: () => onDetail?.('stereo') });
  for (const t of CHEM_BENCH_TOOLS) labels.add(`Cận cảnh ${t.name.charAt(0).toLowerCase()}${t.name.slice(1)}`, new THREE.Vector3(t.x, BENCH.top + (t.id === 'hotplate' ? 0.62 : 0.5), t.z), { kind: 'detail', max: 9, onClick: () => onDetail?.(t.detail) });
  labels.add('Cận cảnh bình nitơ lỏng', cold.dewar.position.clone().add(new THREE.Vector3(0.3, 1.45, 0)), { kind: 'detail', max: 16, onClick: () => onDetail?.('ln2') });
  labels.add('Cận cảnh buồng sinh trưởng', greenhouse.chamber.position.clone().add(new THREE.Vector3(0, 2.55, 0)), { kind: 'detail', max: 14, onClick: () => onDetail?.('growthchamber') });
  clicker.add(greenhouse.chamber, () => onDetail?.('growthchamber'));
  labels.add('Cận cảnh trạm rửa mắt', new THREE.Vector3(SAFETY.shower.x - 0.7, 2.85, SAFETY.shower.z), { kind: 'detail', max: 16, onClick: () => onDetail?.('eyewash') });
  labels.add('Cận cảnh giá nuôi cá', new THREE.Vector3(-14.4, 2.45, ROOM.maxZ - 0.6), { kind: 'detail', max: 22, onClick: () => onDetail?.('zebrafish') });
  const ult = cold.units.get('ult');
  labels.add('Cận cảnh tủ âm sâu', ult.cab.group.position.clone().add(new THREE.Vector3(0.3, ult.h + 0.5, 0)), { kind: 'detail', max: 16, onClick: () => onDetail?.('ultrafreezer') });
  labels.add('Cận cảnh tủ hút khí độc', new THREE.Vector3(FUME_HOOD.x, FUME_HOOD.base + FUME_HOOD.h + 0.45, FUME_HOOD.z + 0.5), { kind: 'detail', max: 26, onClick: () => onDetail?.('fumehood') });
  clicker.add(hood.group, () => onDetail?.('fumehood'));
  clicker.add(station.lamp.group, () => onLamp?.());
  clicker.add(station.tongs.group, () => onStation?.('fl-burn'));
  clicker.add(station.splint, () => onStation?.('fl-splint'));
  clicker.add(station.wire, () => onStation?.('fl-test'));
  for (const [id, g] of chemBench.groups) clicker.add(g, () => onDetail?.(id));
  labels.add('Cận cảnh bể ổn nhiệt', new THREE.Vector3(WATER_BATH.x, BENCH.top + 0.5, WATER_BATH.z), { kind: 'detail', max: 9, onClick: () => onDetail?.('waterbath') });
  clicker.add(biochemBench.bath, () => onDetail?.('waterbath'));
  clicker.add(organisms.incubator.group, () => swing(organisms.incubator, !organisms.incubator.open));
  for (const c of chemCabs.cabinets.values()) {
    clicker.add(c.cab.group, (hit) => {
      const id = hit.object.userData.itemId;
      if (id && c.cab.open) onPick?.(id);
      else swing(c.cab, !c.cab.open);
    });
  }
  for (const [place, u] of cold.units) {
    clicker.add(u.cab.group, (hit) => {
      const id = hit.object.userData.itemId;
      if (id && u.cab.open) onPick?.(id);
      else setDoor(place, !u.cab.open);
    });
  }
  cold.ln2Shelf.visible = false;
  clicker.add(cold.dewar, (hit) => {
    const id = hit.object.userData.itemId;
    if (id) return onPick?.(id);
    cold.ln2Shelf.visible = !cold.ln2Shelf.visible;
    onDoor?.('ln2', cold.ln2Shelf.visible);
  });

  // Cầm ống: bấm (không kéo) một ống PCR trên bàn, rồi bấm vào máy PCR hoặc bộ điện di để đưa ống vào máy
  let held = null;
  function hold(item) {
    if (!item.group.userData.tube) return;
    if (held) held.group.position.y = BENCH.top;
    held = held === item ? null : item;
    if (held) held.group.position.y = BENCH.top + 0.06;
    onHold?.(held ? held.id : null);
  }
  for (const m of machines.values()) {
    if (!m.def.accepts) continue;
    clicker.add(m.group, () => {
      if (!held) return onHold?.(null, m.def.id);
      held.group.position.y = BENCH.top;
      held = null;
      onHold?.(null);
      for (const a of m.def.actions[0][1]) onAction?.(a);
    });
  }

  // Ống thuốc thử trên bàn chỉ hiện khi đã lấy ra khỏi tủ (ở bàn hoặc hộp đá)
  function setBenchReagents(visible) {
    for (const [id, item] of bench.items) if (item.type === 'reagent' && id in visible) item.group.visible = visible[id];
  }

  function resetBench() {
    for (const tw of tweens) if (tw.tag === 'item' || tw.tag === 'station') tweens.delete(tw);
    station.lamp.group.position.copy(lampHome);
    followFlame();
    fx.clear();
    bench.reset();
  }

  // Làm mẫu: tự đưa chai từ chỗ của nó tới vật chứa và rót, như khi người dùng kéo thả
  function demoPour(substanceId, containerId) {
    const item = bench.items.get(substanceId);
    if (!item || item.busy || !bench.containers.has(containerId)) return false;
    pour(item, containerId);
    return true;
  }

  // ---- Di chuyển tự do (bảng Di chuyển, phím WASD): src/core/walk.js tính khung nhìn mới mỗi khung hình ----
  let nav = null;
  const navView = () => ({ pos: camera.position.toArray(), target: controls.target.toArray() });
  const navOpts = () => ({ ...WALK, minDist: controls.minDistance, maxDist: controls.maxDistance, walls: building.segments(), ceil: BUILDING.ceil });
  function setNavInput(input) {
    const on = input && ['forward', 'right', 'up', 'yaw', 'pitch', 'zoom'].some((k) => input[k]);
    if (on && !nav) {
      fitting = null;
      for (const tw of tweens) if (tw.tag === 'camera') tweens.delete(tw);
    }
    nav = on ? input : null;
  }
  // Đặt khung nhìn mới: giảm chuyển động thì đặt ngay, không thì lướt tới trong 0,45 s
  function glide(v) {
    fitting = null;
    for (const tw of tweens) if (tw.tag === 'camera') tweens.delete(tw);
    const p1 = new THREE.Vector3(...v.pos);
    const t1 = new THREE.Vector3(...v.target);
    if (reducedMotion.matches) { camera.position.copy(p1); controls.target.copy(t1); return; }
    const p0 = camera.position.clone();
    const t0 = controls.target.clone();
    tween(0.45, (k) => { camera.position.lerpVectors(p0, p1, ease(k)); controls.target.lerpVectors(t0, t1, ease(k)); }, null, 'camera');
  }

  function resize() {
    const w = container.clientWidth;
    const h = container.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h);
    labelRenderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    const flying = [...tweens].some((tw) => tw.tag === 'camera');
    if (fitting && !flying) {
      const v = viewOf(fitting);
      camera.position.copy(v.pos);
      controls.target.copy(v.target);
    }
  }
  new ResizeObserver(resize).observe(container);
  resize();

  const start = viewOf(ZONES[0]);
  camera.position.copy(start.pos);
  controls.target.copy(start.target);

  const clock = new THREE.Clock();
  // Tự hạ độ phân giải khi máy yếu (điện thoại): đo thời gian khung hình sau 3 giây đầu; chậm hơn 30 khung/giây thì
  // giảm tỉ lệ điểm ảnh từng bậc (2 → 1,5 → 1 → 0,75) cho tới khi đủ nhanh hoặc chạm bậc thấp nhất
  // (0,75 chỉ dùng ở màn hẹp; khi chạy tự động bằng trình duyệt điều khiển thì không đổi, để ảnh kiểm thử giữ nguyên)
  const ratios = [2, 1.5, 1, 0.75].filter((r) => r <= Math.min(window.devicePixelRatio, 2) && (r >= 1 || innerWidth < 600));
  const perf = { t: 0, frames: 0, sum: 0, done: Boolean(navigator.webdriver) };
  function adapt(raw) {
    perf.t += raw;
    if (perf.t < 3 || perf.done) return;
    perf.frames += 1;
    perf.sum += raw;
    if (perf.frames < 60) return;
    const avg = perf.sum / perf.frames;
    perf.frames = 0;
    perf.sum = 0;
    if (avg <= 1 / 30) { perf.done = true; return; } // đủ nhanh: thôi đo
    // Chế độ tự động: hạ mức hình ảnh trước (Cao → Vừa → Thấp), rồi mới hạ tỉ lệ điểm ảnh
    const lv = quality.level();
    if (qualityChoice === 'auto' && lv !== 'low' && lv !== 'sketch') {
      quality.set(lowerLevel(lv));
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, pixelCap[quality.level()]));
      perf.t = 2;
      return;
    }
    const next = ratios.find((r) => r < renderer.getPixelRatio() - 1e-6);
    if (next) renderer.setPixelRatio(next);
    else perf.done = true;
  }
  // Một bước thời gian của cảnh: hoạt cảnh, hiệu ứng, nhãn (không vẽ)
  let curRoom = null;
  function tick(dt) {
    for (const tw of tweens) {
      tw.t += dt;
      const k = Math.min(1, tw.t / tw.duration);
      tw.update(k);
      if (k >= 1) {
        tweens.delete(tw);
        tw.done?.();
      }
    }
    if (nav) {
      const v = walkStep(navView(), nav, dt, navOpts());
      camera.position.fromArray(v.pos);
      controls.target.fromArray(v.target);
    }
    controls.update();
    if (camera.position.y < WALK.minY) camera.position.y = WALK.minY;
    quality.update(dt);
    building.update(camera, controls.target, dt, reducedMotion.matches);
    handTick(dt);
    stirTick(dt);
    handsTick(dt);
    guideTick(dt);
    // Phòng đang đứng (đi ở tầm mắt, dưới trần): báo khi đổi phòng để kiểm tra quy trình ra vào
    const inside = camera.position.y < BUILDING.ceil - 0.2 ? roomAt(BUILDING.rooms, camera.position.x, camera.position.z) : null;
    if (inside !== curRoom) { curRoom = inside; if (inside) onRoom?.(inside); }
    greenhouse.update(dt);
    bench.update(dt);
    fx.update(dt, camera, container.clientHeight || 600);
    labels.update(camera);
    info.update();
  }
  function draw() {
    renderer.render(scene, camera);
    labelRenderer.render(scene, camera);
  }
  renderer.setAnimationLoop(() => {
    const raw = clock.getDelta();
    adapt(raw);
    tick(Math.min(raw, 0.05));
    draw();
  });
  // Kiểm thử: tua thời gian của cảnh `seconds` giây theo bước 1/30 s rồi vẽ một lần (máy không GPU chạy rất chậm)
  function advance(seconds) {
    for (let t = 0; t < seconds; t += 1 / 30) tick(1 / 30);
    draw();
  }

  // Toạ độ màn hình (px trong khung cảnh) của một món đồ trên bàn hoặc một máy; dùng cho kiểm thử tự động
  function screenOf(kind, id) {
    const o = kind === 'machine' ? machines.get(id)?.group : bench.items.get(id)?.group;
    if (!o) return null;
    const v = new THREE.Vector3();
    o.getWorldPosition(v);
    if (kind === 'machine') v.y += 0.12;
    v.project(camera);
    const r = renderer.domElement.getBoundingClientRect();
    return { x: r.left + ((v.x + 1) / 2) * r.width, y: r.top + ((1 - v.y) / 2) * r.height, visible: Math.abs(v.x) < 1 && Math.abs(v.y) < 1 && v.z < 1 };
  }
  // Bản đồ Cát Bà: camera lại gần một điểm (bấm đinh ghim hoặc chọn điểm trong bảng), nhìn chếch từ phía nam
  function focusMap(m, zoom = 1) {
    if (!catbaMap || !m || !autoFocus) return;
    const t1 = catbaMap.worldOf(m.u, m.v);
    const p1 = t1.clone().add(new THREE.Vector3(0, 4.2 * zoom, 5.2 * zoom));
    fitting = null;
    for (const tw of tweens) if (tw.tag === 'camera') tweens.delete(tw);
    if (reducedMotion.matches) { camera.position.copy(p1); controls.target.copy(t1); return; }
    const p0 = camera.position.clone();
    const t0 = controls.target.clone();
    tween(0.9, (k) => { camera.position.lerpVectors(p0, p1, ease(k)); controls.target.lerpVectors(t0, t1, ease(k)); }, null, 'camera');
  }
  // Chỉ dùng khi chạy tự động (?test): đặt camera để chụp ảnh kiểm tra
  const setView = (pos, target) => { fitting = null; camera.position.set(...pos); controls.target.set(...target); };
  // Khay mổ: camera cúi xuống gần khay như người mổ (tắt bằng nút "Tự nhìn gần")
  // Mẫu nhỏ (chuột) thì camera lại gần hơn mẫu lớn (cá, giun)
  const focusDissect = () => (controls.minDistance = 0.3, focusPoint(new THREE.Vector3(DISSECT.tray.x, DISSECT.top + 0.03, DISSECT.tray.z), Math.min(0.6, 0.25 + (dissect?.length() ?? 0.3) * 1.4)));
  const navApi = {
    setInput: setNavInput,
    view: navView,
    eyeLevel: () => glide(eyeLevel(navView(), navOpts())),
    teleport: (x, z) => glide(teleport(navView(), x, z, navOpts())),
  };
  // Màn hình máy (máy dựng từ hình chi tiết): bấm màn hình để bật hoặc tắt máy; nội dung do main.js cập nhật theo lõi
  function wireScreen(m) {
    if (!m.screen || m.screenWired) return;
    m.screenWired = true;
    clicker.add(m.screen.mesh, () => {
      const on = !(m.screenState?.on ?? true);
      setScreen(m.def.id, { on });
      onPower?.(m.def.id, on);
    });
  }
  function setScreen(id, state) {
    const m = machines.get(id);
    if (!m) return;
    m.screenState = { on: true, title: m.def.name, lines: ['Sẵn sàng'], ...m.screenState, ...state };
    m.screen?.draw(m.screenState);
  }
  // ---- Tay ảo ở tầm mắt (giai đoạn 7): hai bàn tay ở góc dưới khung nhìn khi đi trong phòng; đeo găng thì màu găng
  // nitrile, không đeo thì màu da; tay phải nghiêng theo khi đang rót bằng tay ----
  scene.add(camera);
  const hands = new THREE.Group();
  hands.visible = false;
  camera.add(hands);
  const skin = new THREE.MeshStandardMaterial({ color: '#7d93d8', roughness: 0.55 });
  function makeHand(side) {
    const h = new THREE.Group();
    // Bàn tay người lớn: rộng khoảng 8 cm, dài lòng bàn tay 10 cm, ngón dài 6–8 cm, cổ tay đi xuống mép dưới màn hình
    const palm = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 12), skin);
    palm.scale.set(0.04, 0.014, 0.05);
    h.add(palm);
    const wrist = new THREE.Mesh(new THREE.CapsuleGeometry(0.026, 0.12, 4, 12), skin);
    wrist.scale.set(1, 0.6, 1);
    wrist.rotation.x = Math.PI / 2;
    wrist.position.set(0, -0.004, 0.1);
    h.add(wrist);
    for (let i = 0; i < 4; i++) {
      const len = 0.05 - Math.abs(i - 1.2) * 0.007;
      const f = new THREE.Mesh(new THREE.CapsuleGeometry(0.0078, len, 4, 10), skin);
      f.rotation.x = Math.PI / 2 - 0.35;
      f.position.set((i - 1.5) * 0.0175 * side, -0.01, -0.05 - len / 2);
      h.add(f);
    }
    const thumb = new THREE.Mesh(new THREE.CapsuleGeometry(0.0085, 0.035, 4, 10), skin);
    thumb.rotation.set(Math.PI / 2, 0, side * 0.8);
    thumb.position.set(-side * 0.043, -0.002, -0.022);
    h.add(thumb);
    h.traverse((o) => { o.userData.noShadow = true; });
    h.position.set(side * 0.15, -0.175, -0.5);
    h.rotation.set(0.35, side * -0.25, side * 0.15);
    hands.add(h);
    return h;
  }
  const handL = makeHand(-1);
  const handR = makeHand(1);
  let handT = 0;
  function handsTick(dt) {
    hands.visible = camera.position.y < 2.1 && !fitting;
    if (!hands.visible) return;
    handT += reducedMotion.matches ? 0 : dt;
    const bob = Math.sin(handT * 1.7) * 0.004;
    handL.position.y = -0.175 + bob;
    handR.position.y = -0.175 - bob;
    handR.rotation.z = hand?.flow ? 0.15 - 0.6 : 0.15;
  }
  // gloves: đang đeo găng (src/core/safety.js)
  const setHands = ({ gloves = true } = {}) => skin.color.set(gloves ? '#7d93d8' : '#e2b49a');

  // ---- Hướng dẫn bước tiếp theo: nhãn và vòng sáng ở vật chứa, máy hoặc khu của bước đang chờ ----
  const guideLabel = labels.add('', new THREE.Vector3(), { kind: 'guide', max: 60 });
  guideLabel.visible = false;
  const guideRing = new THREE.Mesh(new THREE.RingGeometry(0.05, 0.064, 40), new THREE.MeshBasicMaterial({ color: '#f0a020', transparent: true, opacity: 0.9, side: THREE.DoubleSide, depthWrite: false }));
  guideRing.rotation.x = -Math.PI / 2;
  guideRing.visible = false;
  guideRing.userData.noShadow = true;
  scene.add(guideRing);
  let guideOn = null;
  // g: { container | machine | zone, text } hoặc null
  function setGuide(g) {
    guideOn = g;
    guideRing.visible = false;
    if (!g) { guideLabel.element.textContent = ''; guideLabel.element.hidden = true; return; }
    guideLabel.element.hidden = false;
    guideLabel.element.textContent = g.text;
    const c = g.container && bench.containers.get(g.container);
    const m = g.machine && machines.get(g.machine);
    const z = g.zone && ZONES.find((x) => x.id === g.zone);
    if (c) {
      const v = bench.vessel(g.container);
      guideLabel.position.set(v.x, v.rim + 0.14, v.z);
      guideRing.position.set(v.x, BENCH.top + 0.003, v.z);
      guideRing.scale.setScalar(Math.max(0.6, (c.v.R + 0.02) / 0.05));
      guideRing.visible = true;
    } else if (m) guideLabel.position.set(m.x, m.topY + 1.0, m.z);
    else if (z) guideLabel.position.set(...(z.label ?? z.target));
    else { guideLabel.element.hidden = true; }
  }
  function guideTick(dt) {
    if (!guideRing.visible) return;
    const k = reducedMotion.matches ? 0.9 : 0.6 + 0.35 * Math.abs(Math.sin(performance.now() / 400));
    guideRing.material.opacity = k;
  }

  // Kính lúp: phóng to 3 lần quanh điểm đang nhìn (đồ vật vẽ đúng cỡ thật nên cần nhìn gần thì dùng kính lúp, không phóng to vật)
  function setMagnifier(on) {
    camera.zoom = on ? 3 : 1;
    camera.updateProjectionMatrix();
  }
  return { nav: navApi, setHands, setGuide, guideTarget: () => guideOn, setContainerLabel: (id, text) => bench.setLabel(id, text), setScreen, machineIds: () => [...machines.keys()], setMagnifier, handFlow, handEnd, dropOne, stir, setTextures, setQuality, qualityLevel: () => quality.level(), focusDissect, setDissect: (f) => { dissect?.set(f); info.refresh(); }, setLens: (v) => dissect?.setLens(v), setView, focusMap, setMapLayer: (l) => catbaMap?.setLayer(l), setMapMarker: (m, text) => catbaMap?.setMarker(m, text), setMapRoute: (pts) => catbaMap?.setRoute(pts), screenOf, advance, focusOn, setAutoFocus: (v) => { autoFocus = v; }, setLamp, playHeat, flameTest, burnMg, splintTest, benchItems: () => [...bench.items.keys()], pixelRatio: () => renderer.getPixelRatio(), flyTo, resetBench, demoPour, addReagent: (sub) => { const it = bench.addReagent(sub, 'chem'); info.refresh(); return it; }, setNames: info.setNames, closeInfo: info.close, setBuret: bench.setBuret, setAppearance: bench.setAppearance, setClimate: greenhouse.setClimate, setGarden: greenhouse.setGarden, setFlies: organisms.setFlies, setFlyStages: organisms.setStages, setInventory: cold.setItems, setColdStatus: cold.setStatus, setDoor, setBenchReagents, setIce: (v) => { ice.visible = v; }, setChemTaken: (ids) => { chemCabs.setTaken(ids); bench.setTools(ids); }, setCap: (id, open) => { const lc = bench.setCap(id, open); if (lc && !lc.userData.wired) { lc.userData.wired = true; clicker.add(lc, () => onCap?.(id)); } }, setHotplate: chemBench.setHot, setBenchTool: chemBench.setStatus, setSash: hood.setSash, setHood: hood.setState, setTubes: biochemBench.setState, setFieldPlants: field.setPlants, setQuadrats: field.setQuadrats };
}
