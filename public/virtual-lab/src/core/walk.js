// Di chuyển camera tự do trong phòng thí nghiệm: đi tới, lùi, bước ngang theo hướng nhìn trên mặt sàn; quay người tại
// chỗ; ngước lên, cúi xuống; bay lên, hạ xuống; lại gần hoặc ra xa điểm đang nhìn. Hàm thuần trên mảng [x, y, z] (không
// dùng Three.js, không đụng DOM), dùng chung cho cảnh 3D (src/scene/lab-scene.js) và kiểm thử.
//
// Toạ độ như src/scene/layout.js: x sang phải, y hướng lên, z hướng về phía người xem; đơn vị mét. Một khung nhìn là
// { pos, target }: vị trí camera và điểm nhìn (tâm xoay của chuột). Đầu vào là các trục trong khoảng −1..1:
// forward (tiến +), right (sang phải +), up (lên +), yaw (quay phải +), pitch (ngước lên +), zoom (lại gần +).

export const WALK = {
  speed: 1.4, // m/s khi cách điểm nhìn 3 m; đi nhanh hơn khi đứng xa (nhìn toàn cảnh) và chậm lại khi soi gần
  fast: 3, // nhân tốc độ khi giữ Shift hoặc bật "Nhanh"
  turn: 1.3, // rad/s
  look: 0.9, // rad/s
  zoomRate: 1.3, // 1/s: khoảng cách tới điểm nhìn đổi theo e^(−zoomRate·t)
  eye: 1.6, // m, tầm mắt người đứng
  minY: 0.15, // camera không xuống dưới mặt sàn
  minPitch: -1.45, // rad, gần nhìn thẳng xuống
  maxPitch: 0, // nhìn ngang (giới hạn góc của bộ xoay bằng chuột, maxPolarAngle = π/2)
  minDist: 0.3,
  maxDist: 120,
  // Vùng đi được: từ sa bàn Cát Bà (x ≈ −109) tới hết khu trồng trọt (x = 44), thêm lề
  bounds: { minX: -125, maxX: 60, minZ: -45, maxZ: 45, maxY: 90 },
  // Va chạm tường: walls là các đoạn [ax, az, bx, bz, nửa bề dày] (src/scene/building.js), chỉ tính khi camera thấp hơn
  // trần ceil (đi trong nhà); bay cao hơn trần thì đi xuyên như nhìn sa bàn. radius: bán kính thân người tính từ mắt.
  walls: null,
  ceil: 3,
  radius: 0.22,
};

const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const mul = (a, k) => [a[0] * k, a[1] * k, a[2] * k];
const len = (a) => Math.hypot(a[0], a[1], a[2]);
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

// Hướng nhìn trên mặt sàn (vector đơn vị [x, z]); nhìn thẳng xuống thì giữ hướng −z (nhìn vào tường sau)
export function heading(view) {
  const d = sub(view.target, view.pos);
  const h = Math.hypot(d[0], d[2]);
  return h < 1e-6 ? [0, -1] : [d[0] / h, d[2] / h];
}

// Góc ngước (rad, âm là cúi xuống) và khoảng cách tới điểm nhìn
export function pitchOf(view) {
  const d = sub(view.target, view.pos);
  return Math.atan2(d[1], Math.hypot(d[0], d[2]));
}
export const distOf = (view) => len(sub(view.target, view.pos));

// Tốc độ đi (m/s) theo khoảng cách tới điểm nhìn
export function speedAt(dist, fast = false, o = WALK) {
  return o.speed * (fast ? o.fast : 1) * clamp(dist / 3, 0.35, 10);
}

// Một bước dt giây. Trả về khung nhìn mới (không sửa khung nhìn cũ).
export function step(view, input, dt, o = WALK) {
  let pos = [...view.pos];
  let target = [...view.target];
  const k = { forward: 0, right: 0, up: 0, yaw: 0, pitch: 0, zoom: 0, fast: false, ...input };
  const dist = Math.max(1e-6, distOf(view));
  const v = speedAt(dist, k.fast, o) * dt;

  // Đi trên mặt sàn theo hướng nhìn, bay lên hoặc hạ xuống: camera và điểm nhìn cùng dời
  const [hx, hz] = heading(view);
  const move = [(hx * k.forward - hz * k.right) * v, k.up * v, (hz * k.forward + hx * k.right) * v];
  pos = add(pos, move);
  target = add(target, move);

  // Quay người, ngước, cúi: điểm nhìn quay quanh camera, giữ khoảng cách
  if (k.yaw || k.pitch) {
    const d = sub(target, pos);
    const r = len(d);
    let yaw = Math.atan2(d[0], -d[2]) + k.yaw * o.turn * dt * (k.fast ? 1.6 : 1);
    const pitch = clamp(Math.atan2(d[1], Math.hypot(d[0], d[2])) + k.pitch * o.look * dt, o.minPitch, o.maxPitch);
    target = add(pos, [Math.sin(yaw) * Math.cos(pitch) * r, Math.sin(pitch) * r, -Math.cos(yaw) * Math.cos(pitch) * r]);
  }

  // Lại gần, ra xa điểm nhìn; tới khoảng cách tối thiểu thì đẩy cả điểm nhìn đi tới (đi xuyên qua được)
  if (k.zoom) {
    const d = sub(target, pos);
    const r = len(d);
    const u = mul(d, 1 / r);
    const want = Math.min(o.maxDist, r * Math.exp(-k.zoom * o.zoomRate * (k.fast ? 2 : 1) * dt));
    pos = add(pos, mul(u, r - want));
    if (want < o.minDist) target = add(pos, mul(u, o.minDist));
  }

  if (o.walls?.length && pos[1] < o.ceil) {
    const to = collide(view.pos, pos, o.walls, o.radius);
    const fix = [to[0] - pos[0], 0, to[1] - pos[2]];
    pos = add(pos, fix);
    target = add(target, fix);
  }
  return keep({ pos, target }, o);
}

// Đi từ from tới to trên mặt sàn, không xuyên tường: chia đường đi thành bước ngắn hơn bề dày tường, sau mỗi bước đẩy
// thân người (hình tròn bán kính r) ra khỏi mọi đoạn tường theo pháp tuyến, nên đi chéo vào tường thì trượt dọc tường.
// Trả về [x, z].
export function collide(from, to, walls, r = WALK.radius) {
  let x = from[0];
  let z = from[2];
  const dx = to[0] - x;
  const dz = to[2] - z;
  const n = Math.max(1, Math.ceil(Math.hypot(dx, dz) / 0.1));
  for (let i = 0; i < n; i++) {
    x += dx / n;
    z += dz / n;
    for (let pass = 0; pass < 2; pass++) {
      for (const [ax, az, bx, bz, ht] of walls) {
        const sx = bx - ax, sz = bz - az;
        const l2 = sx * sx + sz * sz || 1;
        const t = clamp(((x - ax) * sx + (z - az) * sz) / l2, 0, 1);
        const qx = x - (ax + t * sx), qz = z - (az + t * sz);
        const d = Math.hypot(qx, qz);
        const need = r + ht;
        if (d >= need) continue;
        if (d > 1e-9) { x += (qx / d) * (need - d); z += (qz / d) * (need - d); }
        else { const nl = Math.sqrt(l2); x += (-sz / nl) * need; z += (sx / nl) * need; }
      }
    }
  }
  return [x, z];
}

// Giữ camera trong vùng đi được và trên mặt sàn: dời cả camera và điểm nhìn cùng một đoạn để không đổi hướng nhìn
export function keep(view, o = WALK) {
  const b = o.bounds;
  const p = view.pos;
  const fix = [clamp(p[0], b.minX, b.maxX) - p[0], clamp(p[1], o.minY, b.maxY) - p[1], clamp(p[2], b.minZ, b.maxZ) - p[2]];
  const pos = add(p, fix);
  let target = add(view.target, fix);
  // Điểm nhìn xuống dưới sàn: kéo nó về chỗ tia nhìn chạm sàn, giữ nguyên hướng nhìn
  if (target[1] < 0) target = add(pos, mul(sub(target, pos), pos[1] / (pos[1] - target[1])));
  return { pos, target };
}

// Hạ camera xuống tầm mắt người đứng, nhìn ngang hơi chếch xuống, điểm nhìn cách 2 m trước mặt
export function eyeLevel(view, o = WALK) {
  const [hx, hz] = heading(view);
  const pos = [view.pos[0], o.eye, view.pos[2]];
  return keep({ pos, target: [pos[0] + hx * 2, o.eye - 0.45, pos[2] + hz * 2] }, o);
}

// Dời tới một điểm trên mặt sàn (bấm bản đồ nhỏ): điểm nhìn tới (x, z), camera giữ nguyên độ lệch so với điểm nhìn
export function teleport(view, x, z, o = WALK) {
  const off = sub(view.pos, view.target);
  const target = [x, view.target[1], z];
  return keep({ pos: add(target, off), target }, o);
}

// Gộp các phím đang giữ thành trục đầu vào. keys: tập mã phím (KeyboardEvent.code)
export const KEYMAP = {
  forward: [['KeyW', 'ArrowUp'], ['KeyS', 'ArrowDown']],
  right: [['KeyD', 'ArrowRight'], ['KeyA', 'ArrowLeft']],
  yaw: [['KeyE'], ['KeyQ']],
  up: [['KeyR', 'PageUp'], ['KeyF', 'PageDown']],
  pitch: [['KeyT'], ['KeyG']],
  zoom: [['Equal', 'NumpadAdd'], ['Minus', 'NumpadSubtract']],
};
export function axesFromKeys(keys) {
  const out = { fast: keys.has('ShiftLeft') || keys.has('ShiftRight') };
  for (const [axis, [plus, minus]] of Object.entries(KEYMAP)) out[axis] = (plus.some((c) => keys.has(c)) ? 1 : 0) - (minus.some((c) => keys.has(c)) ? 1 : 0);
  return out;
}
