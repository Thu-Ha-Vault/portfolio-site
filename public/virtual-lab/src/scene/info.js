import * as THREE from 'three';
import { CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

// Chú thích dụng cụ (giai đoạn 5 mục 0). Vật nào trong cảnh có userData.info là vật có chú thích:
//   - chuỗi: id trong data/apparatus.json;
//   - hàm (): trả về một mục cùng dạng { name, use, how?, safety?, model?, detail? } (chai hoá chất lấy từ substances.json).
// Rê chuột lên vật: thẻ nhỏ tên và tác dụng đi theo con trỏ. Giữ lâu (chuột hoặc ngón tay) hoặc Shift + bấm: thẻ đầy đủ
// có cách dùng, lưu ý an toàn, model thật và nút "Cận cảnh". Nút "Tên dụng cụ" bật nhãn tên cho mọi vật có chú thích.

const HOLD_MS = 550;
const MOVE_PX = 8;
const SUB = '₀₁₂₃₄₅₆₇₈₉';
const formula = (f) => String(f).replace(/([A-Za-z)\]])(\d+)/g, (_, a, d) => a + [...d].map((x) => SUB[x]).join(''));
const GHS = { GHS01: 'chất nổ', GHS02: 'dễ cháy', GHS03: 'chất oxy hoá', GHS04: 'khí nén', GHS05: 'ăn mòn', GHS06: 'độc cấp tính', GHS07: 'kích ứng, có hại', GHS08: 'nguy hại sức khoẻ lâu dài', GHS09: 'độc cho môi trường nước' };
const SIGNAL = { Danger: 'Nguy hiểm', Warning: 'Cảnh báo' };
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

export function createInfo({ dom, host, camera, root, apparatus, substances = [], safety = null, onDetail }) {
  const subs = new Map(substances.map((x) => [x.id, x]));
  const ray = new THREE.Raycaster();
  ray.params.Line.threshold = 0; // đường viền (LineSegments) không tính; ngưỡng mặc định 1 m làm tia trúng mọi đường viền gần đó
  ray.params.Points.threshold = 0;
  const ndc = new THREE.Vector2();
  let targets = null; // danh sách vật có chú thích, tính lại khi cảnh đổi (refresh)

  const tip = document.createElement('div');
  tip.className = 'info-tip';
  tip.hidden = true;
  tip.setAttribute('role', 'tooltip');
  host.appendChild(tip);

  const card = document.createElement('aside');
  card.className = 'info-card';
  card.hidden = true;
  card.setAttribute('role', 'dialog');
  card.setAttribute('aria-labelledby', 'info-card-title');
  host.appendChild(card);

  const shown = (o) => {
    for (let x = o; x; x = x.parent) if (!x.visible) return false;
    return true;
  };
  function collect() {
    targets = [];
    root.traverse((o) => { if (o.userData.info) targets.push(o); });
  }
  // Chai, ống thuốc thử: tên và ghi chú lấy từ substances.json, nhãn GHS từ safety.json (SDS của dung dịch đúng nồng độ)
  function reagentEntry(id) {
    const sub = subs.get(id);
    if (!sub) return null;
    const bio = sub.kind === 'bio';
    const base = apparatus[bio ? 'reagent-tube' : 'reagent-bottle'] ?? {};
    const title = sub.unknown || sub.solvent || !sub.formula ? sub.label ?? sub.name : `${formula(sub.formula)}${sub.conc ? ` ${sub.conc}` : ''}`;
    const sf = safety?.substances?.[id];
    const ghs = sf?.ghs?.length ? `${SIGNAL[sf.signal] ?? sf.signal ?? ''}: ${sf.ghs.map((g) => GHS[g] ?? g).join(', ')}.` : '';
    return {
      name: title,
      use: [sub.name && !bio ? `${sub.name}.` : '', sub.effect ?? sub.note ?? base.use].filter(Boolean).join(' '),
      how: base.how,
      safety: [ghs, base.safety].filter(Boolean).join(' ') || undefined,
    };
  }
  const entryOf = (tag) => (typeof tag === 'function' ? tag() : String(tag).startsWith('reagent:') ? reagentEntry(tag.slice('reagent:'.length)) : apparatus[tag]) ?? null;
  const owner = (o) => {
    for (let x = o; x; x = x.parent) if (x.userData.info) return x;
    return null;
  };

  function pick(x, y) {
    if (!targets) collect();
    const r = dom.getBoundingClientRect();
    ndc.set(((x - r.left) / r.width) * 2 - 1, -((y - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const hit = ray.intersectObjects(targets, true).find((h) => !h.object.isLine && !h.object.isPoints && shown(h.object));
    if (!hit) return null;
    const o = owner(hit.object);
    const entry = o && entryOf(o.userData.info);
    return entry ? { object: o, entry } : null;
  }

  // Thẻ nhỏ theo con trỏ
  let hoverAt = null;
  let raf = 0;
  function showTip() {
    raf = 0;
    if (!hoverAt || !card.hidden) return (tip.hidden = true);
    const p = pick(hoverAt.x, hoverAt.y);
    if (!p) return (tip.hidden = true);
    tip.innerHTML = `<strong>${esc(p.entry.name)}</strong><span>${esc(p.entry.use)}</span><small>Giữ chuột hoặc Shift + bấm để xem cách dùng</small>`;
    tip.hidden = false;
    const r = host.getBoundingClientRect();
    const w = tip.offsetWidth;
    const h = tip.offsetHeight;
    let left = hoverAt.x - r.left + 16;
    let top = hoverAt.y - r.top + 18;
    if (left + w > r.width - 8) left = Math.max(8, hoverAt.x - r.left - w - 12);
    if (top + h > r.height - 8) top = Math.max(8, hoverAt.y - r.top - h - 12);
    tip.style.left = `${left}px`;
    tip.style.top = `${top}px`;
  }
  dom.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse' || e.buttons) {
      tip.hidden = true;
      return;
    }
    hoverAt = { x: e.clientX, y: e.clientY };
    if (!raf) raf = requestAnimationFrame(showTip);
  });
  dom.addEventListener('pointerleave', () => { hoverAt = null; tip.hidden = true; });

  // Thẻ đầy đủ
  let opener = null;
  let swallowNext = false; // lần nhả chuột ngay sau khi mở thẻ bằng giữ lâu hoặc Shift + bấm không tính là bấm
  function open(entry) {
    tip.hidden = true;
    const how = (entry.how ?? []).map((s) => `<li>${esc(s)}</li>`).join('');
    card.innerHTML = `
      <header class="info-head"><strong id="info-card-title">${esc(entry.name)}</strong><button type="button" class="icon-btn" data-close aria-label="Đóng chú thích">×</button></header>
      ${entry.model ? `<p class="info-model">Model thật: ${esc(entry.model)}</p>` : ''}
      <p><b>Tác dụng.</b> ${esc(entry.use)}</p>
      ${how ? `<p><b>Cách dùng.</b></p><ul>${how}</ul>` : ''}
      ${entry.safety ? `<p class="info-safety"><b>An toàn.</b> ${esc(entry.safety)}</p>` : ''}
      ${entry.detail && onDetail ? `<button type="button" class="info-detail" data-detail="${esc(entry.detail)}">Cận cảnh ${esc(entry.name.charAt(0).toLowerCase() + entry.name.slice(1))}</button>` : ''}`;
    opener = document.activeElement;
    card.hidden = false;
    swallowNext = true;
    card.querySelector('[data-close]').focus({ preventScroll: true });
  }
  function close() {
    if (card.hidden) return;
    card.hidden = true;
    opener?.focus?.({ preventScroll: true });
    opener = null;
  }
  card.addEventListener('click', (e) => {
    if (e.target.closest('[data-close]')) close();
    const d = e.target.closest('[data-detail]');
    if (d) { close(); onDetail?.(d.dataset.detail); }
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !card.hidden) { e.stopPropagation(); close(); } }, true);

  // Giữ lâu tại chỗ (chuột hoặc ngón tay); Shift + bấm mở ngay
  let press = null;
  // Nghe ở pha capture của khung chứa (tạo trước bộ kéo thả), vì drag.js chặn pointerdown khi bấm trúng đồ trên bàn
  host.addEventListener('pointerdown', (e) => {
    if (e.target !== dom) return;
    swallowNext = false;
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    if (e.shiftKey) {
      const p = pick(e.clientX, e.clientY);
      if (p) { open(p.entry); press = null; }
      return;
    }
    const x = e.clientX;
    const y = e.clientY;
    press = { x, y, id: e.pointerId, timer: setTimeout(() => {
      const p = pick(x, y);
      if (p) open(p.entry);
      press = null;
    }, HOLD_MS) };
  }, { capture: true });
  const cancel = (e) => {
    if (!press || e.pointerId !== press.id) return;
    if (e.type === 'pointermove' && Math.hypot(e.clientX - press.x, e.clientY - press.y) < MOVE_PX) return;
    clearTimeout(press.timer);
    press = null;
  };
  dom.addEventListener('pointermove', cancel);
  dom.addEventListener('pointerup', cancel);
  dom.addEventListener('pointercancel', cancel);
  // Trên điện thoại, giữ lâu còn mở menu ngữ cảnh của trình duyệt
  dom.addEventListener('contextmenu', (e) => e.preventDefault());

  // Nhãn tên cho mọi vật có chú thích (bật bằng nút "Tên dụng cụ")
  const nameLabels = [];
  const box = new THREE.Box3();
  const size = new THREE.Vector3();
  const top = new THREE.Vector3();
  let namesOn = false;
  function buildNames() {
    collect();
    for (const o of targets) {
      if (o.userData.infoLabel === false || o.userData.nameLabel) continue;
      const entry = entryOf(o.userData.info);
      if (!entry) continue;
      o.updateWorldMatrix(true, true);
      box.setFromObject(o, true);
      if (box.isEmpty()) continue;
      box.getSize(size);
      box.getCenter(top);
      top.y = box.max.y + 0.04 + Math.min(0.15, size.y * 0.08);
      const el = document.createElement('div');
      el.className = 'label label-name';
      el.textContent = entry.name;
      const l = new CSS2DObject(el);
      l.position.copy(o.worldToLocal(top.clone()));
      l.userData.max = 3 + Math.max(size.x, size.y, size.z) * 7;
      o.add(l);
      o.userData.nameLabel = l;
      nameLabels.push(l);
    }
  }
  const tmp = new THREE.Vector3();
  function update() {
    if (!namesOn) return;
    for (const l of nameLabels) {
      l.getWorldPosition(tmp);
      l.visible = tmp.distanceTo(camera.position) <= l.userData.max;
    }
  }
  function setNames(on) {
    namesOn = on;
    if (on) buildNames();
    for (const l of nameLabels) l.visible = on;
  }

  return {
    refresh() { targets = null; if (namesOn) buildNames(); },
    setNames,
    update,
    open,
    close,
    // Clicker hỏi trước khi xử lý một lần bấm: vừa mở thẻ bằng giữ lâu thì bỏ qua lần nhả chuột đó
    swallow() {
      const v = swallowNext;
      swallowNext = false;
      return v;
    },
    entry: (tag) => entryOf(tag),
  };
}
