import * as THREE from 'three';
import { mats } from './materials.js';

// Mức hình ảnh của cảnh 3D. "Phác thảo" giữ kiểu cũ (khối có viền nét, không bóng, không phản chiếu). Các mức còn lại
// dùng ánh sáng có tone mapping, môi trường phản chiếu từ ảnh HDRI phòng bệnh viện (Poly Haven "Hospital Room 2", CC0,
// lưu dạng PNG mã hoá RGBM ở assets/hdri/, đổi bằng tools/hdri/to_rgbm.py), bỏ viền nét:
// - Thấp: không bóng đổ, tỉ lệ điểm ảnh tối đa 1 (điện thoại, máy yếu).
// - Vừa: bóng đổ mềm 1024 điểm ảnh theo vùng đang nhìn.
// - Cao: bóng đổ 2048, thuỷ tinh khúc xạ (MeshPhysicalMaterial có transmission).
// "Tự động" chọn theo máy lúc mở và hạ một mức khi chậm hơn 30 khung/giây (lab-scene.js).

export const QUALITY = [['auto', 'Tự động'], ['sketch', 'Phác thảo'], ['low', 'Thấp'], ['medium', 'Vừa'], ['high', 'Cao']];
const ORDER = ['sketch', 'low', 'medium', 'high'];
const RGBM_RANGE = 8; // phải trùng RANGE trong tools/hdri/to_rgbm.py

export function autoLevel() {
  const mem = navigator.deviceMemory ?? 4;
  const cores = navigator.hardwareConcurrency ?? 4;
  if (innerWidth < 760 || mem <= 2 || cores <= 2) return 'low';
  if (mem >= 8 && cores >= 8) return 'high';
  return 'medium';
}
export const lowerLevel = (lv) => ORDER[Math.max(1, ORDER.indexOf(lv) - 1)];

// Giải mã ảnh RGBM sang texture HalfFloat bằng một lần vẽ (đọc qua canvas 2D sẽ mất chính xác ở chỗ alpha nhỏ)
async function loadEnv(renderer, url) {
  const tex = await new THREE.TextureLoader().loadAsync(url);
  tex.colorSpace = THREE.NoColorSpace;
  tex.generateMipmaps = false;
  tex.minFilter = THREE.LinearFilter;
  const { width, height } = tex.image;
  const rt = new THREE.WebGLRenderTarget(width, height, { type: THREE.HalfFloatType });
  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.ShaderMaterial({
    uniforms: { t: { value: tex }, range: { value: RGBM_RANGE } },
    vertexShader: 'varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }',
    fragmentShader: 'uniform sampler2D t; uniform float range; varying vec2 vUv; void main() { vec4 c = texture2D(t, vUv); gl_FragColor = vec4(c.rgb * c.a * range, 1.0); }',
    depthTest: false,
  }));
  const s = new THREE.Scene();
  s.add(quad);
  const prev = renderer.getRenderTarget();
  renderer.setRenderTarget(rt);
  renderer.render(s, new THREE.Camera());
  renderer.setRenderTarget(prev);
  rt.texture.mapping = THREE.EquirectangularReflectionMapping;
  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromEquirectangular(rt.texture).texture;
  pmrem.dispose();
  rt.dispose();
  tex.dispose();
  quad.geometry.dispose();
  quad.material.dispose();
  return env;
}

// lights: { hemi, key, fill }; dark(): giao diện tối đang bật
export function createQuality({ renderer, scene, camera, controls, root, lights, dark, envUrl = 'assets/hdri/hospital_room_2.png' }) {
  const { hemi, key, fill } = lights;
  let level = null;
  let env = null;
  loadEnv(renderer, envUrl).then((t) => { env = t; if (level && level !== 'sketch') apply(level, true); }).catch(() => { /* không có ảnh môi trường: chỉ dùng đèn */ });

  key.shadow.camera.near = 1;
  key.shadow.camera.far = 80;
  key.shadow.bias = -0.0004;
  key.shadow.normalBias = 0.02;
  scene.add(key.target);

  // Thuỷ tinh khúc xạ ở mức Cao: thay vật liệu thuỷ tinh dùng chung bằng bản MeshPhysicalMaterial, trả lại khi hạ mức
  const glassPairs = new Map();
  const physicalOf = (m) => {
    if (!glassPairs.has(m)) {
      glassPairs.set(m, new THREE.MeshPhysicalMaterial({
        color: m.color.clone().lerp(new THREE.Color('#ffffff'), 0.6), roughness: 0.04, metalness: 0, transmission: 1, thickness: 0.002, ior: 1.5,
        transparent: true, opacity: 1, depthWrite: false, side: m.side, specularIntensity: 1,
      }));
    }
    return glassPairs.get(m);
  };
  const isGlass = (m) => m === mats.glass || m?.userData?.glass;
  function swapGlass(physical) {
    root.traverse((o) => {
      if (!o.isMesh) return;
      if (physical && isGlass(o.material)) { o.userData.plainGlass = o.material; o.material = physicalOf(o.material); }
      else if (!physical && o.userData.plainGlass) { o.material = o.userData.plainGlass; delete o.userData.plainGlass; }
    });
  }

  // Bóng đổ: vật đặc đổ bóng và nhận bóng; vật trong suốt chỉ nhận bóng. Gọi lại khi cảnh có vật mới (mỗi 2 giây).
  function markShadows() {
    root.traverse((o) => {
      if (!o.isMesh) return;
      const m = Array.isArray(o.material) ? o.material[0] : o.material;
      const solid = !(m.transparent && m.opacity < 0.95) && !m.transmission;
      o.castShadow = solid && !o.userData.noShadow;
      o.receiveShadow = !o.userData.noShadow;
    });
  }

  function apply(lv, force = false) {
    if (lv === level && !force) return;
    const prevShadow = renderer.shadowMap.enabled;
    level = lv;
    const sketch = lv === 'sketch';
    mats.edge.visible = sketch;
    mats.grid.visible = sketch;
    renderer.toneMapping = sketch ? THREE.NoToneMapping : THREE.NeutralToneMapping;
    renderer.toneMappingExposure = 1;
    scene.environment = sketch ? null : env;
    scene.environmentIntensity = dark() ? 0.45 : 0.75;
    // Đèn: kiểu phác thảo giữ cường độ cũ; kiểu thật có ảnh môi trường gánh một phần ánh sáng gián tiếp
    hemi.intensity = sketch ? 1.5 : env ? 0.55 : 1.1;
    key.intensity = sketch ? 1.6 : 2.2;
    fill.intensity = sketch ? 0.5 : 0.25;
    const shadows = lv === 'medium' || lv === 'high';
    renderer.shadowMap.enabled = shadows;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    key.castShadow = shadows;
    const size = lv === 'high' ? 2048 : 1024;
    if (key.shadow.mapSize.x !== size) {
      key.shadow.mapSize.set(size, size);
      key.shadow.map?.dispose();
      key.shadow.map = null;
    }
    swapGlass(lv === 'high');
    if (shadows) markShadows();
    if (prevShadow !== shadows || force) scene.traverse((o) => { if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => { m.needsUpdate = true; }); });
  }

  // Đèn chính đi theo vùng đang nhìn: chiếu gần như từ trên xuống như đèn trần, khung bóng vừa vùng nhìn
  const dir = new THREE.Vector3(-0.25, 1, 0.35).normalize();
  let t = 0;
  function update(dt) {
    if (!key.castShadow) return;
    const target = controls.target;
    const dist = camera.position.distanceTo(target);
    const half = THREE.MathUtils.clamp(dist * 0.75, 2.5, 40);
    key.position.copy(target).addScaledVector(dir, 40);
    key.target.position.copy(target);
    const c = key.shadow.camera;
    if (c.right !== half) {
      c.left = -half; c.right = half; c.top = half; c.bottom = -half;
      c.updateProjectionMatrix();
    }
    t += dt;
    if (t > 2) { t = 0; markShadows(); }
  }

  return { set: apply, level: () => level, update, refresh: () => level && apply(level, true) };
}
