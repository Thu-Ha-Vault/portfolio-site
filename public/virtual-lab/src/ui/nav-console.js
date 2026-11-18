import { axesFromKeys, KEYMAP, heading } from '../core/walk.js';
import { ROOM, BENCH, INSTRUMENT_BENCHES, DISSECT, CHEM_CABINETS, COLD_UNITS, GREENHOUSE, FIELD, CATBA, ZONES, BUILDING } from '../scene/layout.js';
import { wallSpans } from '../core/facility.js';

// Bảng Di chuyển: đi lại tự do trong cảnh 3D ngoài cách kéo chuột xoay quanh điểm nhìn.
// - Cần điều khiển: kéo núm để đi tới, lùi, bước ngang (lực kéo càng xa tâm càng nhanh); bốn mũi tên quanh núm giữ để đi.
// - Nút giữ: quay trái, phải; ngước lên, cúi xuống; bay lên, hạ xuống; lại gần, ra xa. "Tầm mắt" hạ camera xuống tầm
//   mắt người đứng. "Nhanh" nhân tốc độ. Bấm nhanh một lần là một bước ngắn.
// - Phím: W A S D hoặc mũi tên, Q E quay, R F lên xuống, T G ngước cúi, + − gần xa, giữ Shift để đi nhanh. Chỉ nhận phím
//   khi con trỏ không ở ô nhập liệu và không ở bảng protocol.
// - Bản đồ nhỏ nhìn từ trên xuống: hình quạt là camera và hướng nhìn; bấm một chấm để tới khu đó, bấm chỗ khác để dời tới.
// Toán di chuyển ở src/core/walk.js; cảnh 3D áp dụng mỗi khung hình qua lab.nav.

const ICON = {
  up: '<path d="M4 10l4-4 4 4"/>',
  down: '<path d="M4 6l4 4 4-4"/>',
  left: '<path d="M10 4L6 8l4 4"/>',
  right: '<path d="M6 4l4 4-4 4"/>',
  turnL: '<path d="M2.5 1.8v3.4h3.4"/><path d="M2.7 5.1A5.6 5.6 0 1 1 2.4 9.6"/>',
  turnR: '<path d="M13.5 1.8v3.4h-3.4"/><path d="M13.3 5.1A5.6 5.6 0 1 0 13.6 9.6"/>',
  lookUp: '<path d="M2.5 13.5h11"/><path d="M8 10.5V2.8M5.2 5.6L8 2.8l2.8 2.8"/>',
  lookDown: '<path d="M2.5 2.5h11"/><path d="M8 5.5v7.7M5.2 10.4L8 13.2l2.8-2.8"/>',
  flyUp: '<path d="M4 8.5l4-4 4 4M4 12.5l4-4 4 4"/>',
  flyDown: '<path d="M4 3.5l4 4 4-4M4 7.5l4 4 4-4"/>',
  zoomIn: '<circle cx="7" cy="7" r="4.6"/><path d="M10.4 10.4L14 14M4.9 7h4.2M7 4.9v4.2"/>',
  zoomOut: '<circle cx="7" cy="7" r="4.6"/><path d="M10.4 10.4L14 14M4.9 7h4.2"/>',
  eye: '<path d="M1.5 8S3.9 3.6 8 3.6 14.5 8 14.5 8 12.1 12.4 8 12.4 1.5 8 1.5 8z"/><circle cx="8" cy="8" r="2"/>',
  map: '<path d="M1.8 3.6l4-1.6 4.4 1.6 4-1.6v10.4l-4 1.6-4.4-1.6-4 1.6z"/><path d="M5.8 2v10.4M10.2 3.6V14"/>',
  fast: '<path d="M2 4l5 4-5 4zM8.5 4l5 4-5 4z"/>',
  lens: '<circle cx="6.5" cy="6.5" r="4.8"/><path d="M10 10l4.5 4.5"/><path d="M4.4 5.2a2.4 2.4 0 0 1 2.1-1.4"/>',
  help: '<circle cx="8" cy="8" r="6.2"/><path d="M6.2 6.3a1.9 1.9 0 1 1 2.6 1.8c-.6.3-.8.7-.8 1.3"/><path d="M8 11.4v.1"/>',
};
const icon = (k) => `<svg viewBox="0 0 16 16" aria-hidden="true">${ICON[k]}</svg>`;

// Nút giữ: [trục, giá trị, biểu tượng, nhãn, phím]
const STICK = [
  ['forward', 1, 'up', 'Đi tới', 'W', 'n'],
  ['right', -1, 'left', 'Bước sang trái', 'A', 'w'],
  ['right', 1, 'right', 'Bước sang phải', 'D', 'e'],
  ['forward', -1, 'down', 'Lùi lại', 'S', 's'],
];
const PAD = [
  ['yaw', -1, 'turnL', 'Quay trái', 'Q'],
  ['pitch', 1, 'lookUp', 'Ngước lên', 'T'],
  ['yaw', 1, 'turnR', 'Quay phải', 'E'],
  ['up', 1, 'flyUp', 'Bay lên', 'R'],
  null, // ô giữa: Tầm mắt
  ['zoom', 1, 'zoomIn', 'Lại gần điểm nhìn', '+'],
  ['up', -1, 'flyDown', 'Hạ xuống', 'F'],
  ['pitch', -1, 'lookDown', 'Cúi xuống', 'G'],
  ['zoom', -1, 'zoomOut', 'Ra xa điểm nhìn', '−'],
];
const AXES = ['forward', 'right', 'up', 'yaw', 'pitch', 'zoom'];
const CODES = new Set(Object.values(KEYMAP).flat(2));
const TAP = 0.18; // s: bấm nhanh vẫn đi đủ một bước ngắn

// Hai khung bản đồ: trong phòng và khu trồng trọt; toàn khu (thêm thực địa và sa bàn Cát Bà ở phía tây)
const EXTENT = { room: [-23.5, 45.5, -15.5, 17.4], all: [-111, 46, -26, 17.4] };

export function createNavConsole({ host, toggle, lab, onZone, store = 'vlab.nav' }) {
  const narrow = () => innerWidth <= 760;
  let prefs = { open: !narrow(), map: !narrow() };
  try { prefs = { ...prefs, ...JSON.parse(localStorage.getItem(store) ?? '{}') }; } catch { /* trình duyệt chặn bộ nhớ */ }
  const save = () => { try { localStorage.setItem(store, JSON.stringify(prefs)); } catch { /* bỏ qua */ } };

  const el = document.createElement('section');
  el.className = 'nav-console';
  el.id = 'nav-console';
  el.setAttribute('aria-label', 'Di chuyển trong phòng thí nghiệm');
  const holdBtn = ([axis, value, ic, label, key, pos]) => `<button type="button" class="nav-btn${pos ? ` nav-${pos}` : ''}" data-axis="${axis}" data-value="${value}" aria-label="${label} (phím ${key})" title="${label} · ${key}">${icon(ic)}</button>`;
  el.innerHTML = `
    <div class="nav-main">
      <div class="nav-stick" role="group" aria-label="Đi lại: kéo núm hoặc giữ mũi tên">
        ${STICK.map(holdBtn).join('')}
        <span class="nav-knob" aria-hidden="true"></span>
      </div>
      <div class="nav-pad" role="group" aria-label="Quay, ngước, lên xuống, gần xa">
        ${PAD.map((b) => (b ? holdBtn(b) : `<button type="button" class="nav-btn nav-eye" data-act="eye" aria-label="Về tầm mắt người đứng" title="Về tầm mắt người đứng">${icon('eye')}</button>`)).join('')}
      </div>
    </div>
    <div class="nav-row">
      <button type="button" class="nav-chip" data-act="fast" aria-pressed="false" title="Đi nhanh gấp 3 (giữ Shift)">${icon('fast')}Nhanh</button>
      <button type="button" class="nav-chip" data-act="lens" aria-pressed="false" title="Kính lúp: phóng to 3 lần chỗ đang nhìn (đồ vật vẽ đúng cỡ thật)">${icon('lens')}Kính lúp</button>
      <button type="button" class="nav-chip" data-act="map" aria-pressed="${prefs.map}" aria-controls="nav-map">${icon('map')}Bản đồ</button>
      <button type="button" class="nav-chip" data-act="help" aria-expanded="false" aria-controls="nav-help">${icon('help')}Phím</button>
    </div>
    <svg class="nav-map" id="nav-map" role="img" aria-label="Bản đồ nhỏ: bấm để dời tới, bấm chấm để tới khu"></svg>
    <dl class="nav-help" id="nav-help" hidden>
      <dt>W A S D, mũi tên</dt><dd>đi tới, lùi, bước ngang</dd>
      <dt>Q E</dt><dd>quay trái, phải</dd>
      <dt>T G</dt><dd>ngước lên, cúi xuống</dd>
      <dt>R F</dt><dd>bay lên, hạ xuống</dd>
      <dt>+ −</dt><dd>lại gần, ra xa điểm nhìn</dd>
      <dt>Shift</dt><dd>giữ để đi nhanh</dd>
      <dt>Chuột</dt><dd>kéo để xoay quanh điểm nhìn, cuộn để phóng to</dd>
    </dl>`;
  host.appendChild(el);
  const $ = (s) => el.querySelector(s);
  const mapEl = $('.nav-map');

  // ---- Gộp đầu vào: phím đang giữ, nút đang giữ, cần điều khiển ----
  const keys = new Set();
  const held = new Map(); // nút → { axis, value, t0 }
  const stick = { forward: 0, right: 0 };
  let fastOn = false;
  function push() {
    const a = axesFromKeys(keys);
    for (const { axis, value } of held.values()) a[axis] += value;
    a.forward += stick.forward;
    a.right += stick.right;
    for (const k of AXES) a[k] = Math.max(-1, Math.min(1, a[k]));
    a.fast = a.fast || fastOn;
    lab.nav.setInput(a);
  }

  // Nút giữ: chuột, chạm (giữ để đi liên tục) và bàn phím (Enter, Space giữ để đi)
  const press = (b) => {
    if (held.has(b)) return;
    held.set(b, { axis: b.dataset.axis, value: Number(b.dataset.value), t0: performance.now() });
    b.classList.add('is-held');
    push();
  };
  const release = (b) => {
    const h = held.get(b);
    if (!h) return;
    const left = TAP * 1000 - (performance.now() - h.t0);
    const end = () => { if (held.get(b) === h) { held.delete(b); b.classList.remove('is-held'); push(); } };
    if (left > 0) setTimeout(end, left); else end();
  };
  for (const b of el.querySelectorAll('[data-axis]')) {
    b.addEventListener('pointerdown', (e) => { e.preventDefault(); e.stopPropagation(); b.setPointerCapture?.(e.pointerId); press(b); });
    for (const t of ['pointerup', 'pointercancel', 'lostpointercapture']) b.addEventListener(t, () => release(b));
    b.addEventListener('keydown', (e) => { if ((e.key === 'Enter' || e.key === ' ') && !e.repeat) { e.preventDefault(); press(b); } });
    b.addEventListener('keyup', (e) => { if (e.key === 'Enter' || e.key === ' ') release(b); });
    b.addEventListener('blur', () => release(b));
    b.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  // Cần điều khiển: kéo núm trong vòng tròn; vùng chết 15 % quanh tâm
  const ring = $('.nav-stick');
  const knob = $('.nav-knob');
  let drag = null;
  const moveKnob = (e) => {
    const r = ring.getBoundingClientRect();
    const R = r.width / 2;
    let dx = (e.clientX - r.left - R) / (R * 0.62);
    let dy = (e.clientY - r.top - R) / (R * 0.62);
    const m = Math.hypot(dx, dy);
    if (m > 1) { dx /= m; dy /= m; }
    knob.style.transform = `translate(${dx * R * 0.62}px, ${dy * R * 0.62}px)`;
    const dead = (v) => (Math.abs(v) < 0.15 ? 0 : (v - Math.sign(v) * 0.15) / 0.85);
    stick.forward = -dead(dy);
    stick.right = dead(dx);
    push();
  };
  ring.addEventListener('pointerdown', (e) => {
    if (e.target.closest('button')) return;
    e.preventDefault();
    drag = e.pointerId;
    ring.setPointerCapture?.(e.pointerId);
    ring.classList.add('is-dragging');
    moveKnob(e);
  });
  ring.addEventListener('pointermove', (e) => { if (drag === e.pointerId) moveKnob(e); });
  const endDrag = (e) => {
    if (drag !== e.pointerId) return;
    drag = null;
    ring.classList.remove('is-dragging');
    knob.style.transform = '';
    stick.forward = stick.right = 0;
    push();
  };
  for (const t of ['pointerup', 'pointercancel', 'lostpointercapture']) ring.addEventListener(t, endDrag);

  // Phím tắt trên cả trang, trừ ô nhập liệu và bảng protocol
  const scope = (t) => !(t instanceof Element) || (!t.closest('input, textarea, select, [contenteditable="true"], .pane-protocol, .detail, .devices'));
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey || !scope(e.target)) return;
    if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') { keys.add(e.code); push(); return; }
    if (!CODES.has(e.code)) return;
    e.preventDefault();
    keys.add(e.code);
    push();
  });
  document.addEventListener('keyup', (e) => { if (keys.delete(e.code)) push(); });
  window.addEventListener('blur', () => { keys.clear(); held.clear(); stick.forward = stick.right = 0; push(); });

  // ---- Nút bật tắt ----
  el.addEventListener('click', (e) => {
    const b = e.target.closest('[data-act]');
    if (!b) return;
    const act = b.dataset.act;
    if (act === 'eye') lab.nav.eyeLevel();
    if (act === 'fast') { fastOn = !fastOn; b.setAttribute('aria-pressed', String(fastOn)); push(); }
    if (act === 'lens') { const on = b.getAttribute('aria-pressed') !== 'true'; b.setAttribute('aria-pressed', String(on)); lab.setMagnifier?.(on); }
    if (act === 'map') { prefs.map = !prefs.map; save(); b.setAttribute('aria-pressed', String(prefs.map)); showMap(); }
    if (act === 'help') { const h = $('#nav-help'); h.hidden = !h.hidden; b.setAttribute('aria-expanded', String(!h.hidden)); }
  });
  function setOpen(v) {
    prefs.open = v;
    el.hidden = !v;
    toggle.setAttribute('aria-pressed', String(v));
    if (!v) { keys.clear(); held.clear(); stick.forward = stick.right = 0; push(); }
    showMap();
  }
  toggle.addEventListener('click', () => { setOpen(!prefs.open); save(); });

  // ---- Bản đồ nhỏ ----
  let extent = null;
  let marker = null;
  const rect = (x0, x1, z0, z1, cls) => `<rect class="${cls}" x="${x0}" y="${z0}" width="${x1 - x0}" height="${z1 - z0}"/>`;
  function drawMap(name) {
    extent = name;
    const [x0, x1, z0, z1] = EXTENT[name];
    mapEl.setAttribute('viewBox', `${x0} ${z0} ${x1 - x0} ${z1 - z0}`);
    const side = 40 * FIELD.scale;
    const parts = [
      rect(x0, x1, z0, z1, 'm-ground'),
      rect(GREENHOUSE.minX, GREENHOUSE.maxX, GREENHOUSE.minZ, GREENHOUSE.maxZ, 'm-green'),
      rect(FIELD.sea.x0, FIELD.sea.x0 + side, FIELD.sea.z0, FIELD.sea.z0 + side, 'm-field'),
      rect(FIELD.land.x0, FIELD.land.x0 + side, FIELD.land.z0, FIELD.land.z0 + side, 'm-field'),
      rect(CATBA.x - 12.6, CATBA.x + 12.6, CATBA.z - 10.7, CATBA.z + 10.7, 'm-map'),
      rect(BUILDING.bounds.minX, BUILDING.bounds.maxX, BUILDING.bounds.minZ, BUILDING.bounds.maxZ, 'm-room'),
      rect(BENCH.x - BENCH.w / 2, BENCH.x + BENCH.w / 2, BENCH.z - BENCH.d / 2, BENCH.z + BENCH.d / 2, 'm-bench'),
      rect(DISSECT.x0, DISSECT.x1, DISSECT.z - DISSECT.d / 2, DISSECT.z + DISSECT.d / 2, 'm-bench'),
      ...INSTRUMENT_BENCHES.map((b) => rect(b.x - b.w / 2, b.x + b.w / 2, b.z - b.d / 2, b.z + b.d / 2, 'm-bench')),
      ...CHEM_CABINETS.map((c) => rect(c.x - c.w / 2, c.x + c.w / 2, ROOM.minZ, ROOM.minZ + c.d, 'm-bench')),
      ...COLD_UNITS.map((c) => rect(ROOM.minX, ROOM.minX + c.d, c.z - c.w / 2, c.z + c.w / 2, 'm-bench')),
    ];
    // Tường và vách ngăn, chừa khoảng trống ở cửa
    for (const [ax, az, bx, bz, ext] of wallSpans(BUILDING)) parts.push(`<line class="m-wall${ext ? ' ext' : ''}" x1="${ax}" y1="${az}" x2="${bx}" y2="${bz}"/>`);
    const r = (x1 - x0) / 90;
    const dots = ZONES.filter((z) => z.id !== 'overview').map((z) => `<circle class="m-zone" data-zone="${z.id}" cx="${z.target[0]}" cy="${z.target[2]}" r="${r}"><title>${z.name}</title></circle>`);
    const s = (x1 - x0) / 28;
    mapEl.innerHTML = `${parts.join('')}${dots.join('')}<g class="m-cam"><path d="M0 0L${s} ${-s * 0.62}A${s * 1.18} ${s * 1.18} 0 0 1 ${s} ${s * 0.62}Z"/><circle r="${r * 0.9}"/></g>`;
    marker = mapEl.querySelector('.m-cam');
  }
  let raf = 0;
  function frame() {
    raf = 0;
    if (el.hidden || !prefs.map || document.hidden) return;
    const v = lab.nav.view();
    const want = Math.min(v.pos[0], v.target[0]) < EXTENT.room[0] ? 'all' : 'room';
    if (want !== extent) drawMap(want);
    const [hx, hz] = heading(v);
    // Camera ở ngoài khung bản đồ (nhìn toàn cảnh từ xa): đặt dấu ở mép khung
    const [x0, x1, z0, z1] = EXTENT[extent];
    const mx = Math.min(x1, Math.max(x0, v.pos[0]));
    const mz = Math.min(z1, Math.max(z0, v.pos[2]));
    marker.setAttribute('transform', `translate(${mx.toFixed(2)} ${mz.toFixed(2)}) rotate(${((Math.atan2(hz, hx) * 180) / Math.PI).toFixed(1)})`);
    raf = requestAnimationFrame(frame);
  }
  function showMap() {
    mapEl.toggleAttribute('hidden', !prefs.map); // phần tử SVG không có thuộc tính hidden như HTML
    if (!raf) raf = requestAnimationFrame(frame);
  }
  mapEl.addEventListener('click', (e) => {
    const zone = e.target.closest('[data-zone]');
    if (zone) return onZone?.(zone.dataset.zone);
    const m = mapEl.getScreenCTM();
    if (!m) return;
    const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
    lab.nav.teleport(p.x, p.y);
  });
  document.addEventListener('visibilitychange', () => { if (!document.hidden) showMap(); });

  setOpen(prefs.open);
  return { setOpen, element: el };
}
