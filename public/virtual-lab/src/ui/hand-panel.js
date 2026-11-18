import { HAND } from '../core/handling.js';

// Bảng "Thao tác tay" trong khung 3D (giai đoạn 7): giữ nút để rót, nhỏ từng giọt, khuấy bằng đũa thuỷ tinh,
// micropipet (chọn loại, chỉnh thể tích, gắn và thải tip, chọn nấc khi hút và khi nhả), xếp ống vào 24 lỗ rotor máy ly tâm.
// Bảng chỉ gửi thao tác; lượng thật và kết quả do lõi tính (src/core/handling.js) qua các hàm on… của main.js.

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

export function createHandPanel({ host, toggle, onPourHold, onDrop, onStir, onDone, onPipette, onRotorRun, onOps }) {
  const el = document.createElement('section');
  el.className = 'hand-panel';
  el.id = 'hand-panel';
  el.hidden = true;
  el.setAttribute('aria-label', 'Thao tác tay');
  el.innerHTML = `
    <header><strong>Thao tác tay</strong><button type="button" class="hand-x" aria-label="Đóng bảng thao tác tay">×</button></header>
    <div class="hand-pour" hidden>
      <p class="hand-what"></p>
      <div class="hand-row">
        <button type="button" class="hand-hold" data-hold="pour">Giữ để rót</button>
        <button type="button" class="hand-btn" data-drop>Nhỏ 1 giọt</button>
        <button type="button" class="hand-btn" data-hold="stir">Giữ để khuấy</button>
      </div>
      <p class="hand-read" aria-live="polite"></p>
      <button type="button" class="hand-btn hand-done">Xong, cất chai</button>
    </div>
    <details class="hand-pip">
      <summary>Micropipet</summary>
      <label class="hand-check"><input type="checkbox" data-pip="on"> Dùng micropipet khi cho thuốc thử sinh học vào ống</label>
      <div class="hand-row">
        <select data-pip="model" aria-label="Loại micropipet">${Object.entries(HAND.pipettes).map(([k, p]) => `<option value="${k}">${esc(p.name)}</option>`).join('')}</select>
        <label class="hand-num"><input type="number" data-pip="volume" min="2" max="20" step="0.5" value="2.5" aria-label="Thể tích µL"> µL</label>
      </div>
      <div class="hand-row">
        <button type="button" class="hand-btn" data-pip="tip">Gắn tip mới</button>
        <button type="button" class="hand-btn" data-pip="eject">Thải tip</button>
      </div>
      <div class="hand-row hand-stops">
        <label>Khi hút ấn tới <select data-pip="stopA"><option value="1">nấc 1 (đúng)</option><option value="2">nấc 2</option></select></label>
        <label>Khi nhả ấn tới <select data-pip="stopD"><option value="2">nấc 2 (đúng)</option><option value="1">chỉ nấc 1</option></select></label>
      </div>
      <p class="hand-pipstate" aria-live="polite"></p>
    </details>
    <details class="hand-ops">
      <summary>Quy trình: dụng cụ, hoá chất, cuối buổi</summary>
      <div class="hand-row">
        <select data-ops="container" aria-label="Dụng cụ"></select>
        <button type="button" class="hand-btn" data-op="ops-empty">Đổ bỏ</button>
        <button type="button" class="hand-btn" data-op="ops-clean">Rửa</button>
      </div>
      <div class="hand-row">
        <input type="text" data-ops="label" maxlength="40" placeholder="Nhãn: tên mẫu, ngày, người làm" aria-label="Nội dung nhãn">
        <button type="button" class="hand-btn" data-op="ops-label">Ghi nhãn</button>
        <button type="button" class="hand-btn" data-op="ops-store" title="Cất mẫu đã ghi nhãn vào hộp mẫu của bạn trong tủ −20 °C">Cất vào hộp mẫu</button>
      </div>
      <p class="hand-box"></p>
      <div class="hand-row">
        <select data-ops="bottle" aria-label="Chai hoá chất"></select>
        <button type="button" class="hand-btn" data-op="ops-refill">Pha thêm</button>
        <button type="button" class="hand-btn" data-op="ops-cap">Đậy nắp</button>
      </div>
      <p class="hand-stock"></p>
      <div class="hand-row">
        <select data-ops="machine" aria-label="Máy dùng chung"></select>
        <select data-ops="start" aria-label="Giờ bắt đầu"></select>
        <select data-ops="minutes" aria-label="Thời lượng"><option value="30">30 phút</option><option value="60" selected>1 giờ</option><option value="90">1 giờ 30</option><option value="120">2 giờ</option></select>
        <button type="button" class="hand-btn" data-op="ops-book">Đặt lịch</button>
      </div>
      <p class="hand-book"></p>
      <div class="hand-row">
        <button type="button" class="hand-btn" data-op="ops-wash">Rửa tay</button>
        <button type="button" class="hand-btn" data-op="ops-wipe">Lau bàn</button>
        <button type="button" class="hand-btn hand-go" data-op="ops-end">Kết thúc buổi</button>
        <button type="button" class="hand-btn" data-op="ops-log">Nhật ký thiết bị</button>
      </div>
    </details>
    <details class="hand-rotor">
      <summary>Xếp ống vào rotor máy ly tâm</summary>
      <svg class="hand-ring" viewBox="-60 -60 120 120" role="group" aria-label="24 lỗ rotor, bấm để đặt hoặc bỏ ống">
        <circle r="54" class="ring-body"/>
        ${Array.from({ length: 24 }, (_, i) => { const a = (i / 24) * Math.PI * 2 - Math.PI / 2; return `<circle class="ring-slot" data-slot="${i}" cx="${(Math.cos(a) * 44).toFixed(1)}" cy="${(Math.sin(a) * 44).toFixed(1)}" r="5.2" tabindex="0" role="button" aria-pressed="false" aria-label="Lỗ ${i + 1}"><title>Lỗ ${i + 1}</title></circle>`; }).join('')}
        <text y="4" text-anchor="middle" class="ring-text">0 ống</text>
      </svg>
      <div class="hand-row"><button type="button" class="hand-btn" data-rotor="clear">Bỏ hết ống</button><button type="button" class="hand-btn hand-go" data-rotor="run">Chạy ly tâm</button></div>
    </details>`;
  host.appendChild(el);
  const $ = (s) => el.querySelector(s);

  let open = false;
  function setOpen(v) {
    open = v;
    el.hidden = !v;
    toggle?.setAttribute('aria-pressed', String(v));
  }
  toggle?.addEventListener('click', () => setOpen(!open));
  $('.hand-x').addEventListener('click', () => setOpen(false));

  // ---- Rót, nhỏ giọt, khuấy ----
  let pourCtx = null;
  function holdButton(btn, onDown, onUp) {
    let down = false;
    const start = (e) => { if (down || btn.disabled) return; down = true; btn.classList.add('is-down'); e.preventDefault?.(); onDown(); };
    const end = () => { if (!down) return; down = false; btn.classList.remove('is-down'); onUp(); };
    btn.addEventListener('pointerdown', (e) => { btn.setPointerCapture?.(e.pointerId); start(e); });
    btn.addEventListener('pointerup', end);
    btn.addEventListener('pointercancel', end);
    btn.addEventListener('lostpointercapture', end);
    btn.addEventListener('keydown', (e) => { if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) start(e); });
    btn.addEventListener('keyup', (e) => { if (e.key === ' ' || e.key === 'Enter') end(); });
  }
  holdButton($('[data-hold="pour"]'), () => onPourHold?.(pourCtx, true), () => onPourHold?.(pourCtx, false));
  holdButton($('[data-hold="stir"]'), () => onStir?.(pourCtx, true), () => onStir?.(pourCtx, false));
  $('[data-drop]').addEventListener('click', () => onDrop?.(pourCtx));
  $('.hand-done').addEventListener('click', () => { onDone?.(pourCtx); hidePour(); });

  // ctx: { substance, container, label, mode: 'pour' | 'drops' }
  function showPour(ctx) {
    pourCtx = ctx;
    setOpen(true);
    $('.hand-pour').hidden = false;
    $('.hand-what').textContent = ctx.label;
    $('[data-hold="pour"]').hidden = ctx.mode !== 'pour';
    $('[data-drop]').hidden = ctx.mode !== 'drops';
    $('.hand-read').textContent = ctx.mode === 'pour' ? 'Giữ nút: chai nghiêng và chảy; thả nút thì dừng. Đọc vạch trên cốc để biết đã rót bao nhiêu.' : 'Mỗi lần bấm là một giọt (khoảng 0,05 mL).';
    $(ctx.mode === 'pour' ? '[data-hold="pour"]' : '[data-drop]').focus({ preventScroll: true });
  }
  function hidePour() {
    pourCtx = null;
    $('.hand-pour').hidden = true;
  }
  const reading = (text) => { $('.hand-read').textContent = text; };

  // ---- Micropipet ----
  const pip = (k) => $(`[data-pip="${k}"]`);
  const fitVolume = () => {
    const p = HAND.pipettes[pip('model').value];
    const v = pip('volume');
    v.min = p.min;
    v.max = p.max;
    v.step = p.max <= 20 ? 0.5 : p.max <= 200 ? 1 : 10;
  };
  fitVolume();
  pip('on').addEventListener('change', () => onPipette?.('mode', { on: pip('on').checked }));
  pip('model').addEventListener('change', () => { fitVolume(); onPipette?.('model', { model: pip('model').value }); });
  pip('volume').addEventListener('change', () => onPipette?.('volume', { uL: Number(pip('volume').value) }));
  pip('tip').addEventListener('click', () => onPipette?.('tip'));
  pip('eject').addEventListener('click', () => onPipette?.('eject'));
  pip('stopA').addEventListener('change', () => onPipette?.('stops', { stopA: Number(pip('stopA').value), stopD: Number(pip('stopD').value) }));
  pip('stopD').addEventListener('change', () => onPipette?.('stops', { stopA: Number(pip('stopA').value), stopD: Number(pip('stopD').value) }));
  function pipState(st) {
    pip('on').checked = st.on;
    pip('model').value = st.model;
    fitVolume();
    pip('volume').value = String(st.volume);
    pip('stopA').value = String(st.stopA);
    pip('stopD').value = String(st.stopD);
    $('.hand-pipstate').textContent = `${st.on ? 'Đang dùng micropipet' : 'Đang tắt'} · ${st.tip ? (st.tipUsed ? `tip đã dùng cho ${st.tipUsed}` : 'tip mới') : 'chưa gắn tip'}`;
  }

  // ---- Rotor ----
  const slots = new Set();
  const ringText = $('.ring-text');
  function drawRing() {
    for (const c of el.querySelectorAll('.ring-slot')) {
      const on = slots.has(Number(c.dataset.slot));
      c.classList.toggle('is-on', on);
      c.setAttribute('aria-pressed', String(on));
    }
    ringText.textContent = `${slots.size} ống`;
  }
  el.querySelector('.hand-ring').addEventListener('click', (e) => {
    const c = e.target.closest('.ring-slot');
    if (!c) return;
    const i = Number(c.dataset.slot);
    if (slots.has(i)) slots.delete(i); else slots.add(i);
    drawRing();
  });
  el.querySelector('.hand-ring').addEventListener('keydown', (e) => { if ((e.key === 'Enter' || e.key === ' ') && e.target.closest('.ring-slot')) { e.preventDefault(); e.target.dispatchEvent(new MouseEvent('click', { bubbles: true })); } });
  $('[data-rotor="clear"]').addEventListener('click', () => { slots.clear(); drawRing(); });
  $('[data-rotor="run"]').addEventListener('click', () => onRotorRun?.([...slots].sort((a, b) => a - b)));

  // ---- Quy trình ----
  const ops = (k) => $(`[data-ops="${k}"]`);
  el.querySelector('.hand-ops').addEventListener('click', (e) => {
    const b = e.target.closest('[data-op]');
    if (!b) return;
    const op = b.dataset.op;
    const params = ['ops-refill', 'ops-cap'].includes(op) ? { substance: ops('bottle').value }
      : op === 'ops-book' ? { machine: ops('machine').value, t0: Number(ops('start').value), minutes: Number(ops('minutes').value) }
        : ['ops-empty', 'ops-clean', 'ops-label', 'ops-store'].includes(op) ? { container: ops('container').value, ...(op === 'ops-label' ? { text: ops('label').value } : {}) } : {};
    onOps?.(op, params);
  });
  // st: { containers: [[id, tên]], bottles: [[id, tên, mL còn, mở nắp, { age, life } | null]],
  //       booking: { machines: [[id, tên]], now (giây từ 8:00), list: [{ machine, t0, t1, who, mine }] }, box: [{ label, contents }] }
  const hhmm = (t) => { const m = Math.round(8 * 60 + t / 60); return `${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}`; };
  function opsState(st) {
    const keep = (sel, list) => { const v = sel.value; sel.innerHTML = list.map(([id, name]) => `<option value="${esc(id)}">${esc(name)}</option>`).join(''); if (list.some(([id]) => id === v)) sel.value = v; };
    keep(ops('container'), st.containers);
    keep(ops('bottle'), st.bottles);
    const b = st.bottles.find(([id]) => id === ops('bottle').value);
    const age = b?.[4] ? ` · pha cách đây ${b[4].age} ngày, hạn ${b[4].life} ngày${b[4].age > b[4].life ? ' (quá hạn)' : ''}` : '';
    $('.hand-stock').textContent = b ? `Chai ${b[1]} còn khoảng ${Math.round(b[2])} mL / 100 mL · ${b[3] ? 'đang mở nắp' : 'đã đậy nắp'}${age}` : '';
    if (st.booking) {
      keep(ops('machine'), st.booking.machines);
      // Giờ bắt đầu: mỗi 30 phút từ hiện tại tới 17:00
      const first = Math.ceil(st.booking.now / 1800) * 1800;
      const slots = [];
      for (let t = first; t <= 9 * 3600; t += 1800) slots.push([String(t), hhmm(t)]);
      keep(ops('start'), slots);
      const mid = ops('machine').value;
      const list = st.booking.list.filter((x) => x.machine === mid).sort((x, y) => x.t0 - y.t0);
      $('.hand-book').textContent = list.length ? `Sổ đặt lịch: ${list.map((x) => `${hhmm(x.t0)}–${hhmm(x.t1)} ${x.mine ? 'bạn' : x.who}`).join('; ')}` : 'Sổ đặt lịch: chưa ai đặt máy này hôm nay.';
    }
    $('.hand-box').textContent = st.box?.length ? `Hộp mẫu của bạn (tủ −20 °C): ${st.box.map((x) => x.label).join('; ')}` : '';
  }
  ops('bottle').addEventListener('change', () => onOps?.('refresh'));
  ops('machine').addEventListener('change', () => onOps?.('refresh'));

  return { opsState, setOpen, showPour, hidePour, reading, pipState, openRotor: () => { setOpen(true); $('.hand-rotor').open = true; }, isOpen: () => open };
}
