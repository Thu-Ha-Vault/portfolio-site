import * as THREE from 'three';
import { BENCH, SLOTS } from './layout.js';
import { mats, withEdges } from './materials.js';
import { ghsCanvas } from './signs.js';
import { VESSELS, TUBES, innerRadius, heightFor } from '../core/vessel.js';
import { chem, esc } from '../ui/format.js';

// Đồ trên bàn thí nghiệm trung tâm: chai hoá chất, ống thuốc thử sinh học, cốc có mỏ và ống PCR.

const CAP = { acid: '#c8463d', base: '#2f6fb5', salt: '#7d8a96', indicator: '#d24b8f', solvent: '#e4ecf1' };
const CLEAR = '#dce9f3';

const cache = new Map();
function solid(color, opts = {}) {
  const key = color + JSON.stringify(opts);
  if (!cache.has(key)) cache.set(key, new THREE.MeshStandardMaterial({ color, roughness: 0.5, ...opts }));
  return cache.get(key);
}
const liquidMat = (color) => solid(color ?? CLEAR, { transparent: true, opacity: color ? 0.85 : 0.45, roughness: 0.3 });
const amberGlass = new THREE.MeshStandardMaterial({ color: '#9a5a1c', transparent: true, opacity: 0.55, roughness: 0.2, depthWrite: false });

function part(geo, mat, y, order = 0) {
  const m = new THREE.Mesh(geo, mat);
  m.position.y = y;
  m.renderOrder = order;
  return m;
}

// Chai thuốc thử DURAN GL 45 100 mL: Ø 56 × 105 mm (catalog 218012458); nắp vặn GL 45 cao 22 mm: minh hoạ.
// Nhãn chai vẽ bằng canvas: công thức, nồng độ, hình đồ GHS và từ cảnh báo lấy từ data/safety.json
const BOTTLE = { R: 0.028, H: 0.105, neckR: 0.0225, cap: 0.022 };
export const BOTTLE_MOUTH = BOTTLE.H + BOTTLE.cap;
const SUB = { 0: '₀', 1: '₁', 2: '₂', 3: '₃', 4: '₄', 5: '₅', 6: '₆', 7: '₇', 8: '₈', 9: '₉' };
const plain = (f) => String(f).replace(/([A-Za-z)\]])(\d+)/g, (_, a, d) => a + [...d].map((x) => SUB[x]).join(''));
const SIGNAL = { Danger: 'NGUY HIỂM', Warning: 'CẢNH BÁO' };

function bottleLabel(sub, sf) {
  const c = document.createElement('canvas');
  c.width = 300;
  c.height = 280;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#fbfbf6';
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.fillStyle = CAP[sub.group] ?? CAP.salt;
  ctx.fillRect(0, 0, c.width, 26);
  ctx.fillStyle = '#16202a';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const title = sub.formula && !sub.solvent && !sub.unknown ? plain(sub.formula) : sub.label ?? sub.name;
  let size = 70;
  do { ctx.font = `700 ${size}px "Be Vietnam Pro", system-ui, sans-serif`; size -= 4; } while (ctx.measureText(title).width > c.width * 0.9 && size > 20);
  ctx.fillText(title, c.width / 2, 78);
  ctx.font = '500 34px "Be Vietnam Pro", system-ui, sans-serif';
  if (sub.conc) ctx.fillText(sub.conc, c.width / 2, 132);
  const ghs = sf?.ghs ?? [];
  const s = 78;
  ghs.slice(0, 3).forEach((g, i) => ctx.drawImage(ghsCanvas(g, 128), c.width / 2 - (ghs.slice(0, 3).length * s) / 2 + i * s, 158, s, s));
  if (sf?.signal) { ctx.font = '700 26px "Be Vietnam Pro", system-ui, sans-serif'; ctx.fillStyle = '#b3141d'; ctx.fillText(SIGNAL[sf.signal] ?? sf.signal, c.width / 2, 258); }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  // Nhãn dán cong theo thân chai: một dải trụ quanh mặt trước
  const geo = new THREE.CylinderGeometry(BOTTLE.R + 0.0004, BOTTLE.R + 0.0004, 0.05, 24, 1, true, -0.85, 1.7);
  const m = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ map: tex, roughness: 0.8 }));
  m.position.y = 0.045;
  return m;
}

function lathe(points, mat, order = 2, seg = 32) {
  const m = new THREE.Mesh(new THREE.LatheGeometry(points.map(([r, y]) => new THREE.Vector2(r, y)), seg), mat);
  m.renderOrder = order;
  return m;
}

function makeBottle(sub, sf) {
  const glass = sub.amber ? amberGlass : mats.glass;
  const { R, H, neckR, cap } = BOTTLE;
  const g = new THREE.Group();
  g.add(
    lathe([[0, 0.002], [R - 0.0035, 0.002], [R - 0.002, 0.07], [neckR - 0.0035, 0.088], [0.0001, 0.088]], liquidMat(sub.color), 1, 24),
    withEdges(lathe([[0.0001, 0], [R - 0.003, 0], [R, 0.003], [R, 0.08], [neckR, 0.094], [neckR, H]], glass, 2, 32), 40),
    part(new THREE.CylinderGeometry(0.0255, 0.0255, cap, 24), solid(CAP[sub.group] ?? CAP.salt), H + cap / 2 - 0.002),
  );
  g.children.at(-1).userData.cap = true;
  g.add(bottleLabel(sub, sf));
  return g;
}

// Lọ chất rắn miệng rộng: bột hoặc tinh thể màu của chất trong lọ, nắp vặn (kích thước minh hoạ)
function makeJar(sub) {
  const g = new THREE.Group();
  g.add(
    part(new THREE.CylinderGeometry(0.026, 0.026, 0.03, 24), solid(sub.color ?? '#f4f4f0', { roughness: 0.95 }), 0.017, 1),
    withEdges(part(new THREE.CylinderGeometry(0.029, 0.029, 0.07, 24), sub.amber ? amberGlass : mats.glass, 0.035, 2), 40),
    part(new THREE.CylinderGeometry(0.027, 0.027, 0.018, 24), solid('#3a4652'), 0.079),
  );
  if (sub.ribbon) {
    // Băng magnesium cuộn trong lọ: vài vòng kim loại sáng
    for (let i = 0; i < 3; i++) {
      const r = new THREE.Mesh(new THREE.TorusGeometry(0.018 - i * 0.004, 0.0012, 6, 24), solid('#c9cdd1', { metalness: 0.6, roughness: 0.3 }));
      r.rotation.x = Math.PI / 2;
      r.position.y = 0.018 + i * 0.007;
      g.add(r);
    }
  }
  return g;
}

// Ống Eppendorf 1,5 mL cắm trên giá ống đặt trong hộp đá (thân 38,9 × Ø 10,8 mm); giá cao 65 mm để ống nhô khỏi lớp đá
const MICRO = VESSELS.micro15;
function makeReagentTube(sub) {
  const g = new THREE.Group();
  const base = 0.045;
  const outer = tubeOutline(MICRO);
  g.add(
    part(new THREE.BoxGeometry(0.024, 0.065, 0.024), solid('#eef1f4'), 0.0325),
    lathe(liquidOutline(MICRO, heightFor(MICRO, 1.0)).map(([r, y]) => [r, y + base]), liquidMat(null), 1, 20),
    withEdges(lathe(outer.map(([r, y]) => [r, y + base]), mats.glass, 2, 24), 40),
    part(new THREE.CylinderGeometry(MICRO.R + 0.0008, MICRO.R + 0.0008, 0.004, 20), solid(sub.cap ?? '#9fb3c4'), base + MICRO.H + 0.002),
  );
  return g;
}

// Đường bao ngoài và lòng trong của dụng cụ (r, y) cho LatheGeometry, từ src/core/vessel.js
function tubeOutline(v) {
  const pts = [[0.0001, 0]];
  const n = 8;
  for (let i = 0; i <= n; i++) { const y = (v.cone * i) / n; pts.push([innerRadius(v, y) + (v.R - v.Rin), y]); }
  pts.push([v.R, v.H], [v.R + 0.0007, v.H], [v.R + 0.0007, v.H - 0.0012]);
  return pts;
}
function liquidOutline(v, h) {
  const pts = [[0.0001, 0]];
  const n = 14;
  for (let i = 0; i <= n; i++) { const y = (h * i) / n; pts.push([Math.max(0.0002, innerRadius(v, y) * 0.985), y]); }
  pts.push([0.0001, h]);
  return pts;
}
function glassOutline(v) {
  const { R, H, wall } = v;
  if (v.shape === 'beaker') return [[0.0001, 0], [R - 0.002, 0], [R, 0.002], [R, H - 0.001], [R + 0.0008, H], [R - wall, H], [R - wall, wall], [0.0001, wall]];
  if (v.shape === 'cylinder') {
    // Ống đong: thân thẳng đứng trên đế (đế lục giác dựng riêng trong makeVessel)
    const f = v.foot;
    return [[0.0001, f], [R, f], [R, H - 0.001], [R + 0.0008, H], [R - wall, H], [R - wall, f + wall], [0.0001, f + wall]];
  }
  if (v.shape === 'volflask') {
    // Bình định mức: bầu cầu, đáy phẳng nhỏ, cổ dài hẹp
    const pts = [[0.0001, 0]];
    const yn = R + Math.sqrt(R * R - v.neckR * v.neckR);
    for (let i = 0; i <= 14; i++) { const y = 0.004 + ((yn - 0.004) * i) / 14; pts.push([Math.sqrt(Math.max(0, R * R - (y - R) * (y - R))), y]); }
    const ri = R - wall;
    const ynIn = ri + wall + Math.sqrt(ri * ri - (v.neckR - wall) * (v.neckR - wall));
    pts.push([v.neckR, H - 0.002], [v.neckR + 0.0015, H], [v.neckR - wall, H], [v.neckR - wall, ynIn]);
    for (let i = 14; i >= 0; i--) { const y = wall + 0.003 + ((ynIn - wall - 0.003) * i) / 14; pts.push([Math.sqrt(Math.max(0, ri * ri - (y - R) * (y - R))), y]); }
    pts.push([0.0001, wall]);
    return pts;
  }
  if (v.shape === 'flask') {
    const hc = H - v.neckH;
    return [[0.0001, 0], [R - 0.003, 0], [R, 0.003], [v.neckR, hc], [v.neckR, H - 0.002], [v.neckR + 0.0015, H], [v.neckR - wall, H], [v.neckR - wall, hc], [R - wall - 0.0005, wall + 0.002], [0.0001, wall]];
  }
  // Ống nghiệm đáy tròn
  const pts = [];
  for (let i = 0; i <= 8; i++) { const a = (i / 8) * (Math.PI / 2); pts.push([Math.sin(a) * R + 0.0001, R - Math.cos(a) * R]); }
  pts.push([R, H], [R + 0.0008, H], [R - wall, H]);
  for (let i = 8; i >= 0; i--) { const a = (i / 8) * (Math.PI / 2); const r = R - wall; pts.push([Math.sin(a) * r + 0.0001, R - Math.cos(a) * r]); }
  return pts;
}

// Vật chứa theo kích thước thật: thành thuỷ tinh (lathe), mặt chất lỏng dựng lại theo mực, lớp kết tủa ở đáy, vạch chia
function makeVessel(v, { bubbles: withBubbles = false } = {}) {
  const g = new THREE.Group();
  const wall = withEdges(lathe(glassOutline(v), mats.glass, 2, 36), 40);
  const liquid = new THREE.Mesh(new THREE.BufferGeometry(), new THREE.MeshStandardMaterial({ color: CLEAR, transparent: true, opacity: 0.45, roughness: 0.3 }));
  liquid.renderOrder = 1;
  const baseY = v.wall + (v.foot ?? 0);
  if (v.foot) g.add(part(new THREE.CylinderGeometry(v.footR, v.footR, v.foot, 6), mats.glass, v.foot / 2, 2));
  liquid.position.y = baseY;
  const pr = innerRadius(v, 0.003) * 0.94;
  const pptH = v.shape === 'testtube' ? 0.006 : 0.004;
  const precipitate = part(new THREE.CylinderGeometry(pr, v.shape === 'testtube' ? pr * 0.6 : pr, pptH, 24), new THREE.MeshStandardMaterial({ roughness: 1 }), baseY + pptH / 2);
  liquid.visible = false;
  precipitate.visible = false;
  g.add(wall, liquid, precipitate);
  // Vạch chia in trắng ở mặt trước (theo thể tích thật của cốc, bình)
  for (const mL of v.marks ?? []) {
    const y = baseY + heightFor(v, mL);
    const r = innerRadius(v, y - baseY) + v.wall + 0.0003;
    const tick = new THREE.Mesh(new THREE.BoxGeometry(mL === v.mL ? 0.012 : 0.008, 0.0008, 0.0005), solid('#ffffff', { roughness: 0.6 }));
    tick.position.set(0, y, r);
    g.add(tick);
  }
  let bubbles = null;
  if (withBubbles) {
    bubbles = new THREE.Group();
    const bubbleGeo = new THREE.SphereGeometry(0.0022, 8, 6);
    const bubbleMat = solid('#ffffff', { transparent: true, opacity: 0.8 });
    const rr = innerRadius(v, 0.01);
    for (let i = 0; i < 14; i++) {
      const b = new THREE.Mesh(bubbleGeo, bubbleMat);
      const a = (i / 14) * Math.PI * 2;
      const r = rr * (0.15 + (i % 4) * 0.2);
      b.position.set(Math.cos(a) * r, baseY + 0.004 + (i % 5) * 0.006, Math.sin(a) * r);
      bubbles.add(b);
    }
    bubbles.visible = false;
    g.add(bubbles);
  }
  return { group: g, liquid, precipitate, bubbles, baseY, v, h: 0, rim: v.H };
}

const makeBeaker = () => makeVessel(VESSELS.beaker50, { bubbles: true });
const makeFlask = () => makeVessel(VESSELS.flask100);

// Đường bao pipet (r, y) từ đầu nhọn lên miệng hút: pipet bầu có bầu giữa thân, pipet chia vạch thân thẳng
function pipetteOutline(t) {
  const tip = 0.03;
  const pts = [[0.0008, 0], [t.R, tip]];
  if (t.bulbR) {
    const y0 = t.bulbAt;
    const y1 = t.bulbAt + t.bulbL;
    pts.push([t.R, y0 - 0.012]);
    for (let i = 0; i <= 8; i++) pts.push([t.R + (t.bulbR - t.R) * Math.sin((i / 8) * (Math.PI / 2)), y0 - 0.012 + (0.012 * i) / 8]);
    pts.push([t.bulbR, y1]);
    for (let i = 1; i <= 8; i++) pts.push([t.bulbR - (t.bulbR - t.R) * Math.sin((i / 8) * (Math.PI / 2)), y1 + (0.012 * i) / 8]);
  }
  pts.push([t.R, t.L], [0.0001, t.L]);
  return pts;
}
const latheGeo = (pts, seg = 20) => new THREE.LatheGeometry(pts.map(([r, y]) => new THREE.Vector2(r, y)), seg);

// Hình học đứng thẳng, tâm ở giữa chiều cao, cho đồ xếp trên giá tủ dụng cụ (src/scene/room.js); đúng cỡ theo vessel.js
export function shelfGeometry(kind) {
  const v = VESSELS[kind];
  const t = TUBES[kind];
  const g = v ? latheGeo(glassOutline(v), 24) : latheGeo(pipetteOutline(t), 12);
  g.translate(0, -(v ? v.H : t.L) / 2, 0);
  return g;
}

// Pipet đứng trên giá pipet (giá gỗ hai tầng: minh hoạ)
function makePipette(t) {
  const g = new THREE.Group();
  g.add(withEdges(new THREE.Mesh(latheGeo(pipetteOutline(t)), mats.glass), 40));
  // Vạch chia trắng của pipet chia vạch, vạch mức của pipet bầu
  const marks = t.bulbR ? [t.bulbAt + t.bulbL + 0.07] : Array.from({ length: 11 }, (_, i) => 0.06 + i * 0.024);
  for (const y of marks) {
    const tick = new THREE.Mesh(new THREE.BoxGeometry(0.004, 0.0006, 0.0005), solid('#ffffff'));
    tick.position.set(0, y, t.R + 0.0003);
    g.add(tick);
  }
  return g;
}
function makePipetteStand() {
  const g = new THREE.Group();
  const wood = solid('#b98a4e', { roughness: 0.8 });
  g.add(part(new THREE.BoxGeometry(0.12, 0.012, 0.07), wood, 0.006));
  g.add(part(new THREE.BoxGeometry(0.012, 0.3, 0.012), wood, 0.15));
  g.add(part(new THREE.BoxGeometry(0.12, 0.012, 0.03), wood, 0.25));
  const pip10 = makePipette(TUBES.pip10);
  const pipg10 = makePipette(TUBES.pipg10);
  pip10.position.set(-0.035, 0.012, 0);
  pipg10.position.set(0.035, 0.012, 0);
  g.add(pip10, pipg10);
  return { group: g, pip10, pipg10 };
}

// Giá buret: chân đế, trụ, kẹp và buret 25 mL cỡ thật (dài 800 mm, src/core/vessel.js) có khoá; mực dung dịch hạ dần
// khi nhỏ. Đế 220 × 160 mm và trụ cao 1 m là minh hoạ. Đầu buret cao hơn mặt bàn 0,13 m, vừa miệng bình tam giác 100 mL.
export function makeBuret() {
  const B = TUBES.buret25;
  const g = new THREE.Group();
  const y0 = 0.13; // đầu nhọn
  const yCock = y0 + 0.06;
  const yZero = y0 + 0.1 + B.scale; // vạch 0 ở đầu đoạn chia vạch
  g.add(
    part(new THREE.BoxGeometry(0.22, 0.015, 0.16), solid('#3c4650'), 0.0075),
    part(new THREE.CylinderGeometry(0.0065, 0.0065, 1.0, 12), solid('#9aa5af'), 0.5),
    part(new THREE.BoxGeometry(0.1, 0.02, 0.02), solid('#9aa5af'), yZero),
  );
  const tubeL = B.L - 0.06;
  const tube = withEdges(part(new THREE.CylinderGeometry(B.R, B.R, tubeL, 16, 1, true), mats.glass, y0 + 0.06 + tubeL / 2, 2), 40);
  tube.position.x = 0.07;
  const tip = part(new THREE.CylinderGeometry(B.R * 0.7, 0.0012, 0.06, 12), mats.glass, y0 + 0.03, 2);
  tip.position.x = 0.07;
  const tap = part(new THREE.BoxGeometry(0.04, 0.008, 0.008), solid('#2f6fb5'), yCock);
  tap.position.x = 0.07;
  // Vạch chia mỗi 1 mL trên đoạn chia vạch (vạch 0 ở trên, 25 mL ở dưới)
  for (let k = 0; k <= B.mL; k++) {
    const tick = new THREE.Mesh(new THREE.BoxGeometry(k % 5 ? 0.004 : 0.007, 0.0006, 0.0005), solid('#ffffff'));
    tick.position.set(0.07, yZero - (k / B.mL) * B.scale, B.R + 0.0003);
    g.add(tick);
  }
  const fill = part(new THREE.CylinderGeometry(B.Rin, B.Rin, 1, 12), new THREE.MeshStandardMaterial({ color: CLEAR, transparent: true, opacity: 0.6 }), 0, 1);
  fill.position.x = 0.07;
  g.add(tube, tip, tap, fill);
  // level 0–1: phần dung dịch còn trong buret (25 mL = đầy, mặt khum ở vạch 0)
  const setLevel = (level) => {
    fill.visible = level > 0;
    const topY = yZero - (1 - level) * B.scale;
    const h = Math.max(topY - yCock, 1e-3);
    fill.scale.y = h;
    fill.position.y = yCock + h / 2;
  };
  setLevel(0);
  return { group: g, setLevel };
}

// Ống nghiệm 16 × 150 mm (đun bằng đèn cồn): lớp đọng ở phần trên (nguội) khi chất thăng hoa (NH₄Cl, I₂)
function makeTestTube() {
  const c = makeVessel(VESSELS.tube16);
  const R = VESSELS.tube16.R;
  const ring = part(new THREE.CylinderGeometry(R * 0.86, R * 0.86, 0.02, 20, 1, true), new THREE.MeshStandardMaterial({ color: '#ffffff', transparent: true, opacity: 0.8, roughness: 1, side: THREE.DoubleSide }), VESSELS.tube16.H - 0.035, 1.5);
  ring.visible = false;
  c.group.add(ring);
  return { ...c, ring };
}

// Ống PCR 0,2 mL nắp mở (Greiner Bio-One 671201) cắm trên giá ống PCR thấp
const PCR = VESSELS.pcr02;
function makePcrTube() {
  const g = new THREE.Group();
  const rackH = 0.008;
  const base = 0.002;
  const tube = new THREE.Group();
  tube.position.y = base;
  const cap = part(new THREE.CylinderGeometry(PCR.R + 0.0004, PCR.R + 0.0004, 0.002, 20), solid('#f2f4f6'), 0);
  cap.position.set(PCR.R * 2.2, PCR.H + 0.0015, 0);
  cap.rotation.z = -1.25;
  const liquid = new THREE.Mesh(new THREE.BufferGeometry(), new THREE.MeshStandardMaterial({ color: CLEAR, transparent: true, opacity: 0.45, roughness: 0.3 }));
  liquid.renderOrder = 1;
  liquid.visible = false;
  tube.add(withEdges(lathe(tubeOutline(PCR), mats.glass, 2, 24), 40), cap, liquid);
  g.add(part(new THREE.BoxGeometry(0.05, rackH, 0.03), solid('#8fb3cf'), rackH / 2), tube);
  return { group: g, liquid, precipitate: null, bubbles: null, baseY: base, v: PCR, h: 0, rim: base + PCR.H, liquidParent: tube };
}

const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const clamp01 = (t) => Math.min(1, Math.max(0, t));
function mixHex(a, b, k) {
  return `#${new THREE.Color(a).lerp(new THREE.Color(b), k).getHexString()}`;
}

// fx: hiệu ứng (src/scene/fx.js); reduced(): người dùng chọn giảm chuyển động thì hiện ngay trạng thái cuối
export function buildBenchItems(root, labels, substances, containerDefs, { fx = null, reduced = () => true, safety = null } = {}) {
  const items = new Map();
  const containers = new Map();
  const pickables = [];
  const top = BENCH.top;

  function register(item) {
    item.busy = false;
    items.set(item.id, item);
    item.group.traverse((o) => {
      if (o.isMesh) {
        o.userData.itemId = item.id;
        pickables.push(o);
      }
    });
  }

  const count = { chem: 0, bio: 0 };
  // Chai trên bàn: chai có sẵn (shelf chem, bio) và chai lấy từ tủ hoá chất (addReagent), xếp tiếp hàng chai hoá học
  function addReagent(sub, shelf = sub.shelf) {
    if (items.has(sub.id)) return items.get(sub.id);
    const slot = SLOTS[shelf];
    const group = sub.kind === 'bio' ? makeReagentTube(sub) : sub.solid ? makeJar(sub) : makeBottle(sub, safety?.substances?.[sub.id]);
    const idx = count[shelf]++;
    const home = new THREE.Vector3(slot.x0 + idx * slot.dx, top, slot.z);
    group.position.copy(home);
    root.add(group);
    const text = sub.label && (sub.unknown || sub.solvent) ? esc(sub.label) : sub.formula ? chem(sub.formula) : esc(sub.label);
    // Nhãn so le cao thấp để tên dài (Phenolphthalein) không đè lên nhãn chai bên cạnh
    labels.add(text, new THREE.Vector3(0, sub.kind === 'bio' ? (idx % 2 ? 0.15 : 0.12) : idx % 2 ? 0.21 : 0.165, 0), { kind: 'item', max: 9, parent: group, html: true });
    group.userData.info = `reagent:${sub.id}`;
    group.userData.infoLabel = false; // đã có nhãn công thức
    const item = { id: sub.id, type: 'reagent', substance: sub, group, home, origin: home.clone(), extra: shelf !== sub.shelf };
    register(item);
    return item;
  }
  for (const sub of substances) if (sub.shelf === 'chem' || sub.shelf === 'bio') addReagent(sub);
  const baseCount = { ...count };

  for (const def of containerDefs) {
    const c = def.kind === 'tube' ? makePcrTube() : def.kind === 'testtube' ? makeTestTube() : def.shape === 'flask' ? makeFlask() : makeBeaker();
    if (def.kind === 'tube') c.group.userData.tube = true;
    if (def.kind === 'testtube' || (def.kind === 'beaker' && def.shape !== 'flask')) c.group.userData.heatable = true; // kéo lên đèn cồn để đun
    c.group.userData.info = def.kind === 'tube' ? 'pcr-tube' : def.kind === 'testtube' ? 'test-tube' : def.shape === 'flask' ? 'flask' : 'beaker';
    c.group.userData.infoLabel = false; // đã có nhãn tên vật chứa
    const home = new THREE.Vector3(def.x, top, def.z);
    c.group.position.copy(home);
    root.add(c.group);
    // Nhãn đặt trên mặt bàn ngay trước vật chứa, không che hàng chai phía sau
    if (def.kind === 'testtube') c.labelObj = labels.add(esc(def.short ?? def.name), new THREE.Vector3(0, 0.005, 0.05 + (def.id.endsWith('2') ? 0.03 : 0)), { kind: 'container', max: 5, parent: c.group, html: true });
    else c.labelObj = labels.add(esc(def.name), new THREE.Vector3(0, 0.005, def.kind === 'tube' ? 0.04 : c.v.R + 0.03), { kind: 'container', max: 9, parent: c.group, html: true });
    // Sức chứa (mL) theo lõi: level của lõi là thể tích / sức chứa
    const cap = def.capacity ?? (def.kind === 'tube' ? 0.025 : def.kind === 'testtube' ? 20 : 15);
    containers.set(def.id, { ...c, def, cap, bubbleTime: 0, innerR: innerRadius(c.v, c.v.H / 3), state: null, anim: null, pptK: 0 });
    register({ id: def.id, type: 'container', group: c.group, home, origin: home.clone() });
  }

  const ring = new THREE.Mesh(
    new THREE.RingGeometry(0.045, 0.058, 40),
    new THREE.MeshBasicMaterial({ color: '#1c6db5', transparent: true, opacity: 0.9, side: THREE.DoubleSide, depthWrite: false }),
  );
  ring.rotation.x = -Math.PI / 2;
  ring.visible = false;
  root.add(ring);

  function showTarget(id) {
    ring.visible = Boolean(id);
    if (!id) return;
    const p = containers.get(id).group.position;
    ring.position.set(p.x, top + 0.004, p.z);
  }

  function containerNear(x, z, radius = 0.17) {
    let best = null;
    let bestD = radius;
    for (const [id, c] of containers) {
      const dd = Math.hypot(c.group.position.x - x, c.group.position.z - z);
      if (dd < bestD) {
        bestD = dd;
        best = id;
      }
    }
    return best;
  }

  // Vật chứa theo toạ độ thế giới, cho fx: tâm, đáy, mặt chất lỏng, bán kính trong
  function vessel(id, h = null) {
    const c = containers.get(id);
    const p = c.group.position;
    const level = () => (c.liquid.visible ? c.h : 0);
    return { x: p.x, z: p.z, r: c.innerR, bottom: p.y + c.baseY, top: p.y + c.baseY + (h ?? level()), topNow: () => p.y + c.baseY + level(), rim: p.y + c.rim };
  }

  function showPpt(c, k, color) {
    c.pptK = k;
    if (!c.precipitate) return;
    c.precipitate.visible = k > 0.02;
    if (color) c.precipitate.material.color.set(color);
    const h0 = c.precipitate.geometry.parameters.height;
    c.precipitate.scale.y = Math.max(0.05, k);
    c.precipitate.position.y = c.baseY + (h0 * c.precipitate.scale.y) / 2 + 0.001;
  }

  // Mặt chất lỏng dựng lại theo lòng trong của dụng cụ ở độ cao h (m)
  function setLevel(c, h) {
    h = Math.max(h, 1e-4);
    if (Math.abs(h - c.h) < 2e-5 && c.liquid.geometry.attributes.position) return;
    c.h = h;
    c.liquid.geometry.dispose();
    c.liquid.geometry = new THREE.LatheGeometry(liquidOutline(c.v, h).map(([r, y]) => new THREE.Vector2(r, y)), 28);
    c.liquid.position.y = c.liquidParent ? 0 : c.baseY;
  }
  // Độ cao mực chất lỏng của thể tích mL; lớp mỏng tối thiểu 1 mm để vài giọt vẫn thấy được (chỉ là cách vẽ)
  const levelFor = (c, mL) => (mL > 0 ? Math.max(0.001, heightFor(c.v, mL)) : 0);

  // app: { level, liquidColor, precipitateColor } của lõi; info: { gas, gases: [chất khí], T } hoặc true/false (khí)
  // Màu đổi dần; kết tủa mới: dung dịch vẩn đục, hạt lắng xuống thành lớp cặn ở đáy; khí: bọt nổi lên, khí có màu bốc
  // khỏi miệng; nóng trên 60 °C: hơi nước. Giảm chuyển động hoặc không có fx thì hiện ngay trạng thái cuối.
  function setAppearance(id, app, info = {}) {
    if (typeof info !== 'object' || info === null) info = { gas: Boolean(info) };
    const c = containers.get(id);
    const mat = c.liquid.material;
    if (c.ring) {
      c.ring.visible = Boolean(app.ring);
      if (app.ring) c.ring.material.color.set(app.ring.color);
    }
    if (!app.level) {
      // Không còn chất lỏng: có thể còn chất rắn (lấy bằng thìa, hoặc cặn khô sau khi cô cạn)
      c.liquid.visible = false;
      c.anim = null;
      if (app.solid) showPpt(c, Math.min(1, 0.35 + app.solid.grams / 0.6), app.solid.color);
      else showPpt(c, 0);
      c.state = app.solid ? { h: 0, liquid: null, ppt: app.solid.color } : null;
      return;
    }
    // Dụng cụ vẽ đúng kích thước thật: mực chất lỏng theo đúng thể tích lõi tính (level × sức chứa)
    const h = levelFor(c, app.level * c.cap);
    const ppt = app.precipitateColor ?? app.solid?.color ?? null;
    const liquid = app.liquidColor ?? null;
    const settled = ppt ? { color: mixHex(liquid ?? CLEAR, ppt, 0.2), opacity: liquid ? 0.7 : 0.5 } : liquid ? { color: liquid, opacity: 0.78 } : { color: CLEAR, opacity: 0.4 };
    const prev = c.state;
    c.state = { h, liquid, ppt };
    const wasVisible = c.liquid.visible;
    c.liquid.visible = true;
    if (!fx || reduced() || info.instant) {
      setLevel(c, h);
      mat.color.set(settled.color);
      mat.opacity = settled.opacity;
      showPpt(c, ppt ? 1 : 0, ppt);
      c.anim = null;
      return;
    }
    if (!wasVisible) setLevel(c, 1e-4);
    const v = vessel(id, h);
    const anim = { t: 0, h0: c.h, h1: h, color0: mat.color.clone(), op0: mat.opacity, keys: [], ppt: null };
    const newPpt = ppt && (!prev?.ppt || prev.ppt !== ppt);
    if (newPpt) {
      // Vẩn đục ngay khi trộn, rồi trong dần khi kết tủa lắng (thời gian lắng là minh hoạ)
      const settle = fx.precipitate(v, ppt, 1);
      const turbid = mixHex(mixHex(liquid ?? CLEAR, ppt, 0.85), '#ffffff', 0.2);
      anim.keys.push({ at: 0.7, color: turbid, opacity: 0.93 }, { at: 2.2, color: turbid, opacity: 0.9 }, { at: 1.2 + settle, ...settled });
      anim.ppt = { from: c.pptK, a: 1.5, b: 1.2 + settle, color: ppt };
    } else {
      anim.keys.push({ at: 1.4, ...settled });
      if (!ppt && c.pptK > 0) anim.ppt = { from: c.pptK, to: 0, a: 0, b: 1.4, color: null }; // kết tủa tan
      const before = prev?.liquid ?? null;
      if (liquid && liquid !== before) fx.cloud(v, liquid);
    }
    const mouth = new THREE.Vector3(v.x, v.rim + 0.005, v.z);
    if (info.gas) {
      fx.bubble(v, { rate: 140, seconds: 4.5, size: 0.004, vigour: 1.3, foam: true });
      for (const g of info.gases ?? []) if (g.color) fx.vapor(mouth, g.color, { seconds: 5, rate: 18, alpha: 0.55 });
    }
    if ((info.T ?? 25) > 60) fx.vapor(mouth, '#f4f7fa', { seconds: 6, rate: 10, alpha: Math.min(0.45, (info.T - 60) / 80), rise: 0.06 });
    c.anim = anim;
  }

  // Mực chất lỏng trong lúc đun (bay hơi): frac = thể tích / sức chứa, giữ màu hiện tại
  function setLevelFrac(id, frac) {
    const c = containers.get(id);
    if (frac <= 0.0005) { c.liquid.visible = false; return; }
    c.liquid.visible = true;
    setLevel(c, levelFor(c, frac * c.cap));
  }

  function animate(dt) {
    for (const c of containers.values()) {
      const a = c.anim;
      if (!a) continue;
      a.t += dt;
      setLevel(c, a.h0 + (a.h1 - a.h0) * ease(clamp01(a.t / 0.5)));
      const mat = c.liquid.material;
      let from = { at: 0, color: a.color0, opacity: a.op0 };
      let to = a.keys.find((k) => k.at > a.t);
      if (!to) { to = a.keys[a.keys.length - 1]; from = to; }
      else { const i = a.keys.indexOf(to); if (i > 0) from = a.keys[i - 1]; }
      const k = to === from ? 1 : ease(clamp01((a.t - from.at) / (to.at - from.at)));
      mat.color.set(from.color).lerp(new THREE.Color(to.color), k);
      mat.opacity = from.opacity + (to.opacity - from.opacity) * k;
      if (a.ppt) {
        const kp = clamp01((a.t - a.ppt.a) / Math.max(1e-3, a.ppt.b - a.ppt.a));
        showPpt(c, a.ppt.from + ((a.ppt.to ?? 1) - a.ppt.from) * kp, a.ppt.color);
      }
      const end = Math.max(0.5, a.keys[a.keys.length - 1].at, a.ppt?.b ?? 0);
      if (a.t >= end) c.anim = null;
    }
  }

  // Buret đặt sau bình tam giác, chỉ hiện khi đã lấy từ tủ dụng cụ
  const flaskDef = containerDefs.find((d) => d.shape === 'flask');
  const buret = makeBuret();
  if (flaskDef) buret.group.position.set(flaskDef.x - 0.07, top, flaskDef.z - 0.18);
  buret.group.visible = false;
  buret.group.userData.info = 'buret';
  root.add(buret.group);
  function setBuret(visible, level = 0) {
    buret.group.visible = visible;
    buret.setLevel(level);
  }

  // Ống đong 10 mL và giá pipet (pipet bầu, pipet chia vạch 10 mL) bên trái cốc A, hiện khi đã lấy từ tủ dụng cụ;
  // bình định mức 100 mL luôn đặt cạnh cân phân tích (pha dung dịch chuẩn)
  const left = containerDefs.find((d) => d.id === 'beaker-a');
  const cyl = makeVessel(VESSELS.cyl10);
  cyl.group.position.set((left?.x ?? -3.25) - 0.3, top, (left?.z ?? 0) + 0.12);
  cyl.group.userData.info = 'measuring-cylinder';
  cyl.group.visible = false;
  root.add(cyl.group);
  const stand = makePipetteStand();
  stand.group.position.set((left?.x ?? -3.25) - 0.42, top, (left?.z ?? 0) - 0.06);
  stand.group.userData.info = 'pipette-stand';
  stand.pip10.userData.info = 'volumetric-pipette';
  stand.pipg10.userData.info = 'graduated-pipette';
  stand.group.visible = false;
  root.add(stand.group);
  const vol = makeVessel(VESSELS.vol100);
  vol.group.position.set(-3.76, top, -0.95);
  vol.group.userData.info = 'volumetric-flask';
  root.add(vol.group);
  function setTools(ids) {
    cyl.group.visible = ids.has('cyl10');
    stand.pip10.visible = ids.has('pip10');
    stand.pipg10.visible = ids.has('pipg10');
    stand.group.visible = ids.has('pip10') || ids.has('pipg10');
  }

  // Cất các chai lấy từ tủ về tủ khi làm lại
  function removeExtras() {
    for (const it of [...items.values()]) {
      if (!it.extra) continue;
      root.remove(it.group);
      it.group.traverse((o) => {
        if (o.isCSS2DObject) o.element.remove();
        const k = pickables.indexOf(o);
        if (k >= 0) pickables.splice(k, 1);
      });
      items.delete(it.id);
    }
    Object.assign(count, baseCount);
    setBuret(false);
    setTools(new Set());
  }

  // Nắp chai: mở khi lấy hoá chất, đặt ngửa trên bàn cạnh chai; đậy lại thì về miệng chai. Trả về nắp nằm trên bàn (để bấm)
  const looseCaps = new Map();
  function setCap(id, open) {
    const it = items.get(id);
    const cap = it?.group.children.find((o) => o.userData.cap);
    if (!cap) return null;
    cap.visible = !open;
    let lc = looseCaps.get(id);
    if (open && !lc) {
      lc = cap.clone();
      lc.userData = { info: 'bottle-cap', capOf: id };
      lc.rotation.x = Math.PI;
      root.add(lc);
      looseCaps.set(id, lc);
    }
    if (lc) {
      lc.visible = open;
      lc.position.set(it.home.x + 0.04, top + BOTTLE.cap / 2, it.home.z + 0.045);
    }
    return lc ?? null;
  }

  function reset() {
    for (const id of looseCaps.keys()) setCap(id, false);
    removeExtras();
    for (const it of items.values()) {
      it.home.copy(it.origin);
      it.group.position.copy(it.origin);
      it.group.rotation.set(0, 0, 0);
      it.busy = false;
    }
    for (const id of containers.keys()) setAppearance(id, { level: 0 });
    ring.visible = false;
  }

  function update(dt) {
    animate(dt);
    for (const c of containers.values()) {
      if (!c.bubbles) continue;
      c.bubbles.visible = c.bubbleTime > 0;
      if (c.bubbleTime <= 0) continue;
      c.bubbleTime -= dt;
      const ceiling = c.baseY + (c.liquid.visible ? c.h : 0.02);
      for (const b of c.bubbles.children) {
        b.position.y += dt * (0.03 + (b.id % 3) * 0.015);
        if (b.position.y > ceiling) b.position.y = c.baseY + 0.002;
      }
    }
  }

  // Nhãn mẫu người dùng ghi (quy trình giai đoạn 7): hiện cạnh tên vật chứa
  function setLabel(id, text) {
    const c = containers.get(id);
    if (!c?.labelObj) return;
    const base = esc(c.def.kind === 'testtube' ? c.def.short ?? c.def.name : c.def.name);
    c.labelObj.element.innerHTML = text ? `${base} · <em>${esc(text)}</em>` : base;
  }

  return { setLabel, items, containers, pickables, showTarget, containerNear, setAppearance, setLevelFrac, vessel, reset, update, addReagent, setBuret, setTools, setCap };
}
