import { esc } from './format.js';

// Bảng điều khiển thí nghiệm ruồi giấm, nằm trong nửa protocol: tủ ấm, thu ruồi, lai trong lọ, tua thời gian, bỏ bố mẹ, đếm.

export function createFlyPanel(root, { fly, onAction, onNotebook }) {
  const genes = fly.chromosomes.flatMap((c) => c.genes);
  root.innerHTML = `
    <div class="garden-head">
      <h2 class="section-title" id="fly-title">Khu nuôi sinh vật · ruồi giấm</h2>
      <span class="day" id="f-day">Ngày 0 · 25 °C</span>
    </div>
    <div class="garden-grid">
      <div class="g-row" role="group" aria-label="Tủ ấm">
        <label class="g-label" for="f-temp">Tủ ấm</label>
        <select id="f-temp">${fly.temps.map((t) => `<option value="${t}" ${t === 25 ? 'selected' : ''}>${t} °C</option>`).join('')}</select>
        <button type="button" class="btn btn-ghost" id="f-temp-go">Đặt</button>
      </div>
      <div class="g-row" role="group" aria-label="Thu ruồi">
        <label class="g-label" for="f-source">Thu ruồi</label>
        <select id="f-source"></select>
        <select id="f-sex" aria-label="Giới tính"><option value="F">♀ cái</option><option value="M">♂ đực</option></select>
        <select id="f-hours" aria-label="Thu trong bao lâu sau khi nở">${[4, 6, 8, 12, 24].map((h) => `<option value="${h}" ${h === 6 ? 'selected' : ''}>trong ${h} giờ</option>`).join('')}</select>
        <select id="f-n" aria-label="Số ruồi thu"><option value="5" selected>5 ruồi</option><option value="20">20 ruồi</option></select>
        <button type="button" class="btn btn-ghost" id="f-collect">Thu</button>
      </div>
      <div class="g-row" role="group" aria-label="Lai trong lọ">
        <label class="g-label" for="f-females">Lai</label>
        <select id="f-females" aria-label="Ruồi cái"></select>
        <span class="g-x" aria-hidden="true">×</span>
        <select id="f-males" aria-label="Ruồi đực"></select>
        <button type="button" class="btn btn-ghost" id="f-cross">Lai</button>
      </div>
      <div class="g-row" role="group" aria-label="Tua thời gian">
        <span class="g-label">Thời gian</span>
        <button type="button" class="btn btn-ghost" data-fgrow="1">+1 ngày</button>
        <button type="button" class="btn btn-ghost" data-funtil="clear">tới ngày bỏ bố mẹ</button>
        <button type="button" class="btn btn-ghost" data-funtil="adult">tới khi ruồi con nở</button>
      </div>
      <div class="g-row" role="group" aria-label="Lọ nuôi">
        <label class="g-label" for="f-vial">Lọ</label>
        <select id="f-vial"></select>
        <button type="button" class="btn btn-ghost" id="f-clear">Bỏ bố mẹ</button>
        <button type="button" class="btn btn-ghost" id="f-count">Gây mê và đếm</button>
        <span class="g-traits" id="f-genes">${genes.map((g) => `<label><input type="checkbox" value="${esc(g.id)}"> ${esc(g.name)}</label>`).join('')}</span>
      </div>
    </div>
    <div class="garden-lists">
      <div><span class="eyebrow">Ruồi đã thu</span><ul class="g-list" id="f-batches"></ul></div>
      <div><span class="eyebrow">Lọ trong tủ ấm</span><ul class="g-list" id="f-vials"></ul></div>
    </div>
    <div class="g-row">
      <button type="button" class="btn btn-ghost" id="f-csv">Sổ thí nghiệm (CSV)</button>
    </div>`;

  const $ = (id) => root.querySelector(`#${id}`);
  $('f-temp-go').addEventListener('click', () => onAction('fly-temp', { temp: Number($('f-temp').value) }));
  $('f-collect').addEventListener('click', () => onAction('fly-collect', { source: $('f-source').value, sex: $('f-sex').value, hours: Number($('f-hours').value), n: Number($('f-n').value) }));
  $('f-cross').addEventListener('click', () => onAction('fly-cross', { females: $('f-females').value, males: $('f-males').value }));
  root.querySelectorAll('[data-fgrow]').forEach((b) => b.addEventListener('click', () => onAction('fly-grow', { days: Number(b.dataset.fgrow) })));
  root.querySelectorAll('[data-funtil]').forEach((b) => b.addEventListener('click', () => onAction('fly-grow', { until: b.dataset.funtil })));
  $('f-clear').addEventListener('click', () => onAction('fly-clear', { vial: $('f-vial').value }));
  $('f-count').addEventListener('click', () => {
    const chosen = [...root.querySelectorAll('#f-genes input:checked')].map((i) => i.value);
    onAction('fly-count', { vial: $('f-vial').value, ...(chosen.length ? { genes: chosen } : {}) });
  });
  $('f-genes').addEventListener('change', (e) => {
    if ([...root.querySelectorAll('#f-genes input:checked')].length > 3) e.target.checked = false;
  });
  $('f-csv').addEventListener('click', () => onNotebook());

  const options = (sel, items) => {
    const prev = sel.value;
    sel.innerHTML = items.length ? items.map(([v, label]) => `<option value="${esc(v)}">${esc(label)}</option>`).join('') : '<option value="">(chưa có)</option>';
    if (items.some(([v]) => v === prev)) sel.value = prev;
  };

  function setGenes(ids) {
    root.querySelectorAll('#f-genes input').forEach((i) => { i.checked = ids.includes(i.value); });
  }

  function render(st) {
    $('f-day').textContent = `Ngày ${st.day} · ${st.temp} °C`;
    $('f-temp').value = String(st.temp);
    const emerged = st.vials.filter((v) => v.emerged);
    options($('f-source'), [...st.stocks.map((s) => [s, `dòng ${s}`]), ...emerged.map((v) => [v.id, `lọ ${v.id}`])]);
    options($('f-females'), st.batches.filter((b) => b.sex === 'F').map((b) => [b.id, `${b.id} (${b.n})`]));
    options($('f-males'), [...st.batches.filter((b) => b.sex === 'M').map((b) => [b.id, `${b.id} (${b.n})`]), ...st.stocks.map((s) => [s, `♂ dòng ${s}`]), ...emerged.map((v) => [v.id, `♂ lọ ${v.id}`])]);
    options($('f-vial'), st.vials.map((v) => [v.id, `lọ ${v.id}`]));
    $('f-batches').innerHTML = st.batches.map((b) => `<li><strong>${esc(b.id)}</strong> <span>${b.n} con${b.sex === 'F' ? (b.virgin ? ' · chưa giao phối' : ' · đã giao phối') : ''}</span></li>`).join('') || '<li class="g-empty">Chưa thu ruồi nào.</li>';
    $('f-vials').innerHTML = st.vials
      .map((v) => `<li><strong>${esc(v.id)}</strong> <span>${esc(v.label)} · ngày ${v.age} · ${v.emerged ? `đã nở ${v.n} con` : `phát triển ${Math.round(v.progress * 100)} %`}${v.cleared ? ' · đã bỏ bố mẹ' : ''}</span></li>`)
      .join('') || '<li class="g-empty">Chưa có lọ lai.</li>';
  }

  return { render, setGenes };
}
