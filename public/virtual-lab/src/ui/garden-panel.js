import { esc } from './format.js';

// Bảng điều khiển thí nghiệm lai đậu Hà Lan, nằm trong nửa protocol: đồng hồ ảo, gieo, khử nhị, thụ phấn, thu hoạch, đếm.
// Mọi thao tác đi qua onAction(action, params) để lõi MendelLab xử lý và bảng protocol ghi kết quả.

const STAGES = [
  ['bud', 'có nụ'],
  ['flower', 'hoa nở'],
  ['pod', 'có quả'],
  ['ripe', 'quả chín khô'],
];

export function createGardenPanel(root, { pea, onAction, onNotebook }) {
  root.innerHTML = `
    <div class="garden-head">
      <h2 class="section-title" id="garden-title">Khu trồng trọt · lai đậu Hà Lan</h2>
      <span class="day" id="g-day">Ngày 0</span>
    </div>
    <div class="garden-grid">
      <div class="g-row" role="group" aria-label="Tua thời gian">
        <span class="g-label">Thời gian</span>
        <button type="button" class="btn btn-ghost" data-grow="1">+1 ngày</button>
        <button type="button" class="btn btn-ghost" data-grow="7">+7 ngày</button>
        <select id="g-until" aria-label="Tua tới giai đoạn">${STAGES.map(([id, name]) => `<option value="${id}">tới khi ${name}</option>`).join('')}</select>
        <button type="button" class="btn btn-ghost" id="g-until-go">Tua</button>
      </div>
      <div class="g-row" role="group" aria-label="Gieo hạt">
        <label class="g-label" for="g-lot">Gieo</label>
        <select id="g-lot"></select>
        <input type="number" id="g-count" min="1" max="500" value="10" aria-label="Số hạt">
        <button type="button" class="btn btn-ghost" id="g-sow">Gieo</button>
      </div>
      <div class="g-row" role="group" aria-label="Chăm sóc cây">
        <label class="g-label" for="g-group">Cây</label>
        <select id="g-group"></select>
        <button type="button" class="btn btn-ghost" id="g-emasc">Khử nhị</button>
        <button type="button" class="btn btn-ghost" id="g-bag">Bao hoa</button>
        <button type="button" class="btn btn-ghost" id="g-water">Tưới 15 mm</button>
        <button type="button" class="btn btn-ghost" id="g-harvest">Thu hoạch</button>
      </div>
      <div class="g-row" role="group" aria-label="Thụ phấn chéo">
        <label class="g-label" for="g-mother">Thụ phấn</label>
        <select id="g-mother" aria-label="Cây mẹ"></select>
        <span class="g-x" aria-hidden="true">×</span>
        <select id="g-father" aria-label="Cây bố"></select>
        <button type="button" class="btn btn-ghost" id="g-pollinate">Thụ phấn</button>
      </div>
      <div class="g-row" role="group" aria-label="Đếm kiểu hình">
        <label class="g-label" for="g-target">Đếm</label>
        <select id="g-target"></select>
        <span class="g-traits" id="g-traits"></span>
        <button type="button" class="btn btn-ghost" id="g-count-go">Đếm</button>
      </div>
    </div>
    <div class="garden-lists">
      <div><span class="eyebrow">Lô hạt</span><ul class="g-list" id="g-lots"></ul></div>
      <div><span class="eyebrow">Nhóm cây</span><ul class="g-list" id="g-groups"></ul></div>
    </div>
    <div class="g-row">
      <button type="button" class="btn btn-ghost" id="g-csv">Sổ thí nghiệm (CSV)</button>
    </div>`;

  const $ = (id) => root.querySelector(`#${id}`);
  let traits = [];

  root.querySelectorAll('[data-grow]').forEach((b) => b.addEventListener('click', () => onAction('pea-grow', { days: Number(b.dataset.grow) })));
  $('g-until-go').addEventListener('click', () => onAction('pea-grow', { until: $('g-until').value }));
  $('g-sow').addEventListener('click', () => onAction('pea-sow', { lot: $('g-lot').value, count: Math.max(1, Math.min(500, Number($('g-count').value) || 1)) }));
  $('g-emasc').addEventListener('click', () => onAction('pea-emasculate', { group: $('g-group').value }));
  $('g-bag').addEventListener('click', () => onAction('pea-bag', { group: $('g-group').value }));
  $('g-water').addEventListener('click', () => onAction('pea-water', {}));
  $('g-harvest').addEventListener('click', () => onAction('pea-harvest', { group: $('g-group').value }));
  $('g-pollinate').addEventListener('click', () => onAction('pea-pollinate', { mother: $('g-mother').value, father: $('g-father').value }));
  $('g-count-go').addEventListener('click', () => {
    const chosen = [...root.querySelectorAll('#g-traits input:checked')].map((i) => i.value);
    onAction('pea-count', { target: $('g-target').value, traits: chosen.length ? chosen : [traits[0]] });
  });
  $('g-csv').addEventListener('click', () => onNotebook());
  // Đếm tối đa hai tính trạng một lần (bảng 4 lớp kiểu hình)
  $('g-traits').addEventListener('change', (e) => {
    const boxes = [...root.querySelectorAll('#g-traits input')];
    if (boxes.filter((b) => b.checked).length > 2) e.target.checked = false;
  });

  const options = (sel, items, keep = true) => {
    const prev = sel.value;
    sel.innerHTML = items.length ? items.map(([v, label]) => `<option value="${esc(v)}">${esc(label)}</option>`).join('') : '<option value="">(chưa có)</option>';
    if (keep && items.some(([v]) => v === prev)) sel.value = prev;
  };

  // list: danh sách tính trạng của loài đang lai (đậu Hà Lan hoặc loài trong crosses.json)
  function setTraits(ids, list = pea.traits) {
    traits = ids;
    $('g-traits').innerHTML = ids
      .map((id, i) => {
        const t = list.find((x) => x.id === id);
        return `<label><input type="checkbox" value="${esc(id)}" ${i < 2 ? 'checked' : ''}> ${esc(t.name)}</label>`;
      })
      .join('');
  }

  function render(state, stageName) {
    if (state.species) $('garden-title').textContent = `Khu trồng trọt · lai ${state.species.name.charAt(0).toLowerCase()}${state.species.name.slice(1)}`;
    $('g-day').textContent = `Ngày ${state.day}`;
    options($('g-lot'), state.lots.filter((l) => l.left > 0).map((l) => [l.id, `${l.id} · còn ${l.left} hạt`]));
    const growing = state.groups.filter((g) => !g.harvested);
    options($('g-group'), growing.map((g) => [g.id, `${g.id} · ${stageName(g.stage).toLowerCase()}`]));
    options($('g-mother'), growing.map((g) => [g.id, `♀ ${g.id}`]));
    const fathers = growing.map((g) => [g.id, `♂ ${g.id}`]);
    options($('g-father'), fathers);
    if (fathers.length > 1 && $('g-father').value === $('g-mother').value) $('g-father').value = fathers.find(([v]) => v !== $('g-mother').value)[0];
    options($('g-target'), [...state.lots.map((l) => [l.id, `lô hạt ${l.id}`]), ...state.groups.map((g) => [g.id, `cây ${g.id}`])]);
    $('g-lots').innerHTML = state.lots.map((l) => `<li><strong>${esc(l.id)}</strong> <span>${esc(l.label ?? '')} · còn ${l.left} hạt</span></li>`).join('') || '<li class="g-empty">Chưa có lô hạt.</li>';
    $('g-groups').innerHTML = state.groups
      .map((g) => {
        const flags = [g.emasculated && 'đã khử nhị', g.bagged && 'đã bao hoa', g.sick && 'bị bệnh', g.cross && `× ${g.cross}`, g.selfed && !g.cross && 'tự thụ', g.harvested && 'đã thu hoạch'].filter(Boolean);
        return `<li><strong>${esc(g.id)}</strong> <span>${g.n} cây · ${esc(stageName(g.stage).toLowerCase())} · tuổi ${Math.floor(g.growth)} ngày${flags.length ? ` · ${esc(flags.join(', '))}` : ''}</span></li>`;
      })
      .join('') || '<li class="g-empty">Chưa gieo cây nào.</li>';
  }

  return { render, setTraits };
}
