import * as THREE from 'three';

// Hiệu ứng hiện tượng trên bàn thí nghiệm (giai đoạn 5 mục 1): dòng rót, giọt, mây màu lan trong dung dịch, kết tủa
// vẩn đục rồi lắng, bọt khí, khí có màu, hơi nước, khói, ngọn lửa và màu ngọn lửa.
// Hiệu ứng chỉ là cách vẽ: màu, có kết tủa hay khí, nhiệt độ đều do lõi mô phỏng quyết định. Tốc độ lắng, số hạt,
// thời gian hiệu ứng là số minh hoạ để mắt thấy được, không phải số đo.
// Người dùng chọn giảm chuyển động thì các hàm ở đây không tạo hạt; nơi gọi hiện ngay trạng thái cuối.

const VERT = /* glsl */ `
attribute float size;
attribute float alpha;
attribute vec3 tint;
uniform float scale;
varying float vAlpha;
varying vec3 vTint;
void main() {
  vAlpha = alpha;
  vTint = tint;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = size * scale / max(0.001, -mv.z);
  gl_Position = projectionMatrix * mv;
}`;
const FRAG = /* glsl */ `
uniform sampler2D map;
varying float vAlpha;
varying vec3 vTint;
void main() {
  vec4 t = texture2D(map, gl_PointCoord);
  gl_FragColor = vec4(vTint * t.rgb, t.a * vAlpha);
  if (gl_FragColor.a < 0.004) discard;
  #include <colorspace_fragment>
}`;

// Ảnh hạt vẽ bằng canvas: chấm mềm (khói, hơi, mây màu) và bọt (viền sáng, giữa trong)
function texture(kind) {
  const n = 64;
  const c = document.createElement('canvas');
  c.width = c.height = n;
  const g = c.getContext('2d');
  const grad = g.createRadialGradient(n / 2, n / 2, 0, n / 2, n / 2, n / 2);
  if (kind === 'bubble') {
    grad.addColorStop(0, 'rgba(255,255,255,0.15)');
    grad.addColorStop(0.62, 'rgba(255,255,255,0.25)');
    grad.addColorStop(0.8, 'rgba(255,255,255,0.95)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
  } else if (kind === 'floc') {
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.55, 'rgba(255,255,255,0.85)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
  } else {
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.35, 'rgba(255,255,255,0.6)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
  }
  g.fillStyle = grad;
  g.fillRect(0, 0, n, n);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

// Bể hạt dùng lại: mỗi hạt có vị trí, vận tốc, tuổi thọ, kích thước và độ mờ thay đổi theo tuổi
class Pool {
  constructor(max, { map, blending = THREE.NormalBlending, order = 3 }) {
    this.max = max;
    this.pos = new Float32Array(max * 3);
    this.size = new Float32Array(max);
    this.alpha = new Float32Array(max);
    this.tint = new Float32Array(max * 3);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(this.pos, 3).setUsage(THREE.DynamicDrawUsage));
    geo.setAttribute('size', new THREE.BufferAttribute(this.size, 1).setUsage(THREE.DynamicDrawUsage));
    geo.setAttribute('alpha', new THREE.BufferAttribute(this.alpha, 1).setUsage(THREE.DynamicDrawUsage));
    geo.setAttribute('tint', new THREE.BufferAttribute(this.tint, 3).setUsage(THREE.DynamicDrawUsage));
    this.uniforms = { map: { value: map }, scale: { value: 600 } };
    const mat = new THREE.ShaderMaterial({ vertexShader: VERT, fragmentShader: FRAG, uniforms: this.uniforms, transparent: true, depthWrite: false, blending });
    this.points = new THREE.Points(geo, mat);
    this.points.frustumCulled = false;
    this.points.renderOrder = order;
    this.items = new Array(max).fill(null);
    this.free = [...Array(max).keys()].reverse();
    this.geo = geo;
  }

  // o: { p: Vector3, v?: Vector3, life, size: [đầu, cuối], alpha: [đầu, giữa, cuối], color: Color, drag?, gravity?, step?(it, dt) }
  spawn(o) {
    const i = this.free.pop();
    if (i === undefined) return null;
    const it = { i, age: 0, v: new THREE.Vector3(), drag: 0, gravity: 0, ...o, p: o.p.clone() };
    this.items[i] = it;
    return it;
  }

  update(dt) {
    let any = false;
    for (let k = 0; k < this.max; k++) {
      const it = this.items[k];
      if (!it) continue;
      it.age += dt;
      if (it.age >= it.life || it.dead) {
        this.items[k] = null;
        this.free.push(k);
        this.alpha[k] = 0;
        this.size[k] = 0;
        continue;
      }
      any = true;
      const t = it.age / it.life;
      it.v.y -= it.gravity * dt;
      if (it.drag) it.v.multiplyScalar(Math.max(0, 1 - it.drag * dt));
      it.step?.(it, dt, t);
      it.p.addScaledVector(it.v, dt);
      this.pos.set([it.p.x, it.p.y, it.p.z], k * 3);
      this.size[k] = it.size[0] + (it.size[1] - it.size[0]) * t;
      const [a0, a1, a2] = it.alpha;
      this.alpha[k] = (t < 0.5 ? a0 + (a1 - a0) * (t / 0.5) : a1 + (a2 - a1) * ((t - 0.5) / 0.5)) * (it.fade ?? 1);
      const c = it.color;
      this.tint.set([c.r, c.g, c.b], k * 3);
    }
    for (const name of ['position', 'size', 'alpha', 'tint']) this.geo.attributes[name].needsUpdate = true;
    return any;
  }

  clear() {
    for (let k = 0; k < this.max; k++) if (this.items[k]) this.items[k].dead = true;
  }
}

const rnd = (a, b) => a + Math.random() * (b - a);
const C = (hex) => new THREE.Color(hex);
const WHITE = C('#ffffff');

/**
 * @param {THREE.Scene} scene
 * @param {{ reduced: () => boolean }} o
 * Vật chứa (vessel) truyền vào các hàm là { x, z, bottom, top, r }: toạ độ thế giới của tâm, đáy, mặt chất lỏng, bán kính trong.
 */
export function createFx(scene, { reduced }) {
  const soft = new Pool(700, { map: texture('soft') });
  // Hạt trong dung dịch vẽ sau thành thuỷ tinh (renderOrder 2) để không bị lớp kính làm nhạt
  const flocs = new Pool(600, { map: texture('floc'), order: 2.5 });
  const bubbles = new Pool(400, { map: texture('bubble'), order: 2.6 });
  const glow = new Pool(500, { map: texture('soft'), blending: THREE.AdditiveBlending, order: 4 });
  for (const p of [soft, flocs, bubbles, glow]) scene.add(p.points);
  const meshes = new Set(); // dòng rót và vật tạm, mỗi cái có update(dt) trả false khi xong
  const emitters = new Set(); // nguồn phát liên tục (ngọn lửa, hơi nước, bọt khi sôi)

  // Dòng chất lỏng từ miệng chai xuống mặt dung dịch: ống mảnh theo đường cong, dài ra rồi đứt
  function stream(from, to, color, seconds = 0.6) {
    if (reduced()) return;
    const mid = from.clone().lerp(to, 0.5);
    mid.y = Math.max(from.y, to.y) + 0.01;
    const curve = new THREE.QuadraticBezierCurve3(from.clone(), new THREE.Vector3(from.x + (to.x - from.x) * 0.15, from.y - 0.01, from.z + (to.z - from.z) * 0.15), to.clone());
    const geo = new THREE.TubeGeometry(curve, 24, 0.004, 6, false);
    const mat = new THREE.MeshStandardMaterial({ color: color ?? '#dce9f3', transparent: true, opacity: color ? 0.85 : 0.55, roughness: 0.15 });
    const m = new THREE.Mesh(geo, mat);
    m.renderOrder = 2.5;
    scene.add(m);
    let t = 0;
    const total = seconds + 0.25;
    geo.setDrawRange(0, 0);
    const n = geo.index.count;
    meshes.add({ update(dt) {
      t += dt;
      // Đầu dòng chảy xuống trong 0,15 s đầu, đuôi dòng rút khỏi miệng chai ở 0,25 s cuối
      const head = Math.min(1, t / 0.15);
      const tail = Math.max(0, (t - seconds) / 0.25);
      const a = Math.floor(tail * n / 3) * 3;
      const b = Math.floor(head * n / 3) * 3;
      geo.setDrawRange(a, Math.max(0, b - a));
      if (head >= 1 && t < seconds && Math.random() < 0.6) splash(to, color);
      if (t < total) return true;
      scene.remove(m);
      geo.dispose();
      mat.dispose();
      return false;
    } });
  }

  // Giọt bắn nhỏ ở chỗ dòng chảy chạm mặt dung dịch
  function splash(at, color) {
    soft.spawn({ p: at.clone().add(new THREE.Vector3(rnd(-0.01, 0.01), 0.002, rnd(-0.01, 0.01))), v: new THREE.Vector3(rnd(-0.03, 0.03), rnd(0.04, 0.09), rnd(-0.03, 0.03)), gravity: 0.6, life: 0.3, size: [0.006, 0.003], alpha: [0.7, 0.6, 0], color: C(color ?? '#e8f2fa') });
  }

  // Giọt rơi từ ống nhỏ giọt hoặc đầu tip
  function drop(from, to, color) {
    if (reduced()) return;
    const fall = from.y - to.y;
    const life = Math.sqrt((2 * Math.max(0.01, fall)) / 9.8);
    soft.spawn({ p: from, v: new THREE.Vector3(), gravity: 9.8, life, size: [0.008, 0.008], alpha: [0.9, 0.9, 0.9], color: C(color ?? '#dfeefa') });
    setTimeout(() => splash(to, color), life * 1000);
  }

  // Bột hoặc tinh thể rơi từ thìa xúc xuống vật chứa
  function powder(from, to, color, n = 40) {
    if (reduced()) return;
    const c = C(color ?? '#f4f4f0');
    const fall = Math.max(0.01, from.y - to.y);
    for (let i = 0; i < n; i++) {
      const delay = Math.random() * 0.5;
      soft.spawn({ p: from.clone().add(new THREE.Vector3(rnd(-0.006, 0.006), 0, rnd(-0.006, 0.006))), v: new THREE.Vector3(0, 0, 0), life: delay + Math.sqrt((2 * fall) / 9.8) + 0.1, size: [0.004, 0.004], alpha: [0.95, 0.95, 0.9], color: c,
        step: (it) => { if (it.age < delay) { it.v.set(0, 0, 0); return; } it.v.y -= 9.8 / 30; if (it.p.y <= to.y) { it.p.y = to.y; it.v.set(0, 0, 0); } } });
    }
  }

  // Mây màu mới lan từ chỗ rót xuống và toả ra trong dung dịch
  function cloud(v, color, n = 40) {
    if (reduced() || !color) return;
    const c = C(color);
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = Math.sqrt(Math.random()) * v.r * 0.35;
      flocs.spawn({ p: new THREE.Vector3(v.x + Math.cos(a) * r, v.top - 0.004, v.z + Math.sin(a) * r), v: new THREE.Vector3(Math.cos(a) * rnd(0.005, 0.03), -rnd(0.01, 0.05), Math.sin(a) * rnd(0.005, 0.03)), drag: 1.2, life: rnd(1.2, 2.2), size: [0.012, v.r * 0.9], alpha: [0.0, 0.55, 0], color: c, step: (it) => keepInside(it, v) });
    }
  }

  // Kết tủa: hạt li ti hiện dần khắp dung dịch (vẩn đục) rồi lắng xuống đáy. Trả về thời gian lắng (giây).
  function precipitate(v, color, amount = 1) {
    if (reduced() || !color) return 0;
    // Bông kết tủa đục và sáng hơn màu chất (ánh sáng tán xạ trên hạt rắn)
    const c = C(color).lerp(WHITE, 0.15);
    const n = Math.round(120 + 160 * Math.min(1, amount));
    const settle = 5;
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = Math.sqrt(Math.random()) * v.r * 0.92;
      const y = v.bottom + Math.random() * (v.top - v.bottom);
      const delay = Math.random() * 0.8;
      flocs.spawn({
        p: new THREE.Vector3(v.x + Math.cos(a) * r, y, v.z + Math.sin(a) * r),
        v: new THREE.Vector3(rnd(-0.004, 0.004), 0, rnd(-0.004, 0.004)),
        life: settle + rnd(0.5, 1.5),
        size: [rnd(0.009, 0.016), rnd(0.006, 0.01)],
        alpha: [0, 0.95, 0.85],
        color: c,
        step: (it, dt) => {
          // Đứng lơ lửng chốc lát rồi rơi, tốc độ tăng dần (bông kết tủa kết lại); chạm đáy thì nằm yên rồi mờ vào lớp cặn
          if (it.age < delay + 0.6) return;
          it.v.y = Math.max(it.v.y - dt * 0.02, -0.03);
          if (it.p.y <= v.bottom + 0.003) { it.p.y = v.bottom + 0.003; it.v.set(0, 0, 0); it.fade = Math.max(0, 1 - (it.age - settle * 0.6) / (settle * 0.6)); }
          keepInside(it, v);
        },
      });
    }
    return settle;
  }

  function keepInside(it, v) {
    const dx = it.p.x - v.x;
    const dz = it.p.z - v.z;
    const d = Math.hypot(dx, dz);
    const lim = v.r * 0.95;
    if (d > lim) { it.p.x = v.x + (dx / d) * lim; it.p.z = v.z + (dz / d) * lim; }
    if (it.p.y < v.bottom + 0.002) it.p.y = v.bottom + 0.002;
    if (it.p.y > v.top - 0.002) it.p.y = v.top - 0.002;
  }

  // Bọt khí nổi lên từ đáy, vỡ ở mặt dung dịch
  function bubble(v, { rate = 40, seconds = 4, size = 0.006, vigour = 1, foam = false } = {}) {
    if (reduced()) return null;
    // Sủi mạnh: lớp bọt trắng li ti nổi trên mặt dung dịch
    if (foam) emit(seconds, rate * 0.6, () => {
      const a = Math.random() * Math.PI * 2;
      const r = Math.sqrt(Math.random()) * v.r * 0.9;
      const top = v.topNow ? v.topNow() : v.top;
      bubbles.spawn({ p: new THREE.Vector3(v.x + Math.cos(a) * r, top + 0.002, v.z + Math.sin(a) * r), v: new THREE.Vector3(0, 0.004, 0), life: rnd(0.6, 1.4), size: [size * 1.2, size * 0.8], alpha: [0.95, 0.8, 0], color: WHITE });
    });
    return emit(seconds, rate, () => {
      const a = Math.random() * Math.PI * 2;
      const r = Math.sqrt(Math.random()) * v.r * 0.8;
      const life = (v.top - v.bottom) / (0.05 * vigour) + 0.2;
      bubbles.spawn({ p: new THREE.Vector3(v.x + Math.cos(a) * r, v.bottom + 0.004, v.z + Math.sin(a) * r), v: new THREE.Vector3(0, rnd(0.04, 0.08) * vigour, 0), life, size: [size * 0.6, size * 1.4], alpha: [0.9, 0.9, 0.7], color: WHITE, step: (it) => { it.p.x += Math.sin(it.age * 20 + it.i) * 0.0003; if (it.p.y >= (v.topNow ? v.topNow() : v.top)) it.dead = true; } });
    });
  }

  // Khí, hơi nước, khói bốc lên từ miệng vật chứa: hạt mềm to dần và mờ dần
  function vapor(at, color, { rate = 20, seconds = 3, rise = 0.08, spread = 0.02, size = [0.03, 0.12], alpha = 0.5 } = {}) {
    if (reduced()) return null;
    const c = C(color);
    return emit(seconds, rate, () => {
      soft.spawn({ p: at.clone().add(new THREE.Vector3(rnd(-spread, spread), 0, rnd(-spread, spread))), v: new THREE.Vector3(rnd(-0.01, 0.01), rise * rnd(0.7, 1.3), rnd(-0.01, 0.01)), drag: 0.4, life: rnd(1.6, 2.6), size, alpha: [0, alpha, 0], color: c });
    });
  }

  // Nguồn phát hạt đều theo thời gian; seconds = Infinity thì phát tới khi gọi stop()
  function emit(seconds, rate, make) {
    const e = { t: 0, acc: 0, seconds, rate, make, stopped: false, stop() { this.stopped = true; } };
    emitters.add(e);
    return e;
  }

  // Ngọn lửa đèn cồn: lõi xanh nhạt, vỏ vàng cam, hạt cộng sáng bay lên; color đổi màu ngọn lửa (thử màu ngọn lửa)
  function flame(at0, { height = 0.05 } = {}) {
    const at = at0.clone(); // vị trí bấc, đổi được bằng setPosition khi đèn di chuyển
    const base = { inner: C('#5b8cff'), outer: C('#ffb347'), tip: C('#ffd27a') };
    let test = null; // màu ngọn lửa khi đưa muối kim loại vào
    const light = new THREE.PointLight('#ffb35c', 0.18, 0.5, 2);
    light.position.copy(at).add(new THREE.Vector3(0, height * 0.6, 0));
    scene.add(light);
    const e = emit(Infinity, 90, () => {
      const inner = Math.random() < 0.35;
      const col = test && !inner && Math.random() < 0.8 ? test : inner ? base.inner : Math.random() < 0.5 ? base.outer : base.tip;
      glow.spawn({ p: at.clone().add(new THREE.Vector3(rnd(-0.003, 0.003), 0.002, rnd(-0.003, 0.003))), v: new THREE.Vector3(rnd(-0.004, 0.004), (inner ? 0.5 : 1) * height / 0.35, rnd(-0.004, 0.004)), life: inner ? 0.18 : 0.35, size: inner ? [0.012, 0.004] : [0.018, 0.004], alpha: [0.5, 0.45, 0], color: col });
    });
    if (reduced()) {
      // Giảm chuyển động: ngọn lửa tĩnh, vẽ bằng một hình nón mờ
      e.stop();
      const cone = new THREE.Mesh(new THREE.ConeGeometry(0.008, height, 12, 1, true), new THREE.MeshBasicMaterial({ color: '#ffb347', transparent: true, opacity: 0.75, blending: THREE.AdditiveBlending, depthWrite: false }));
      cone.position.copy(at).add(new THREE.Vector3(0, height / 2, 0));
      scene.add(cone);
      e.cone = cone;
    }
    let flicker = 0;
    meshes.add({ update(dt) {
      flicker += dt;
      light.intensity = e.dead ? 0 : 0.16 + Math.sin(flicker * 23) * 0.02 + Math.sin(flicker * 7.3) * 0.02;
      return !e.dead;
    } });
    return {
      setPosition(p) {
        at.copy(p);
        light.position.copy(at).add(new THREE.Vector3(0, height * 0.6, 0));
        if (e.cone) e.cone.position.copy(at).add(new THREE.Vector3(0, height / 2, 0));
      },
      setColor(hex) {
        test = hex ? C(hex) : null;
        light.color.set(hex ?? '#ffb35c');
        if (e.cone) e.cone.material.color.set(hex ?? '#ffb347');
      },
      remove() {
        e.stop();
        e.dead = true;
        scene.remove(light);
        if (e.cone) scene.remove(e.cone);
      },
    };
  }

  // Ánh sáng chói (magnesium cháy): chớp sáng trắng và hạt sáng bắn ra
  function burst(at, color = '#ffffff', seconds = 3) {
    if (reduced()) return;
    const light = new THREE.PointLight(color, 3, 3, 2);
    light.position.copy(at);
    scene.add(light);
    let t = 0;
    meshes.add({ update(dt) {
      t += dt;
      light.intensity = t < seconds ? 2.5 + Math.random() * 1.5 : 0;
      if (t < seconds) for (let k = 0; k < 4; k++) glow.spawn({ p: at, v: new THREE.Vector3(rnd(-0.2, 0.2), rnd(0, 0.3), rnd(-0.2, 0.2)), gravity: 0.8, life: rnd(0.2, 0.5), size: [0.03, 0.005], alpha: [1, 0.8, 0], color: C(color) });
      if (t < seconds + 0.2) return true;
      scene.remove(light);
      return false;
    } });
  }

  function update(dt, camera, viewportH) {
    const scale = viewportH / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2));
    for (const p of [soft, flocs, bubbles, glow]) p.uniforms.scale.value = scale;
    for (const e of emitters) {
      if (e.stopped || e.t >= e.seconds) { emitters.delete(e); e.dead = true; continue; }
      e.t += dt;
      e.acc += dt * e.rate;
      while (e.acc >= 1) { e.acc -= 1; e.make(); }
    }
    for (const m of meshes) if (!m.update(dt)) meshes.delete(m);
    soft.update(dt);
    flocs.update(dt);
    bubbles.update(dt);
    glow.update(dt);
  }

  function clear() {
    for (const p of [soft, flocs, bubbles, glow]) p.clear();
    for (const e of emitters) e.stop();
  }

  return { stream, drop, powder, cloud, precipitate, bubble, vapor, flame, burst, update, clear };
}
