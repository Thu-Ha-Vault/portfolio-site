import { esc, chem } from './format.js';

// Bảng hoá học trong nửa protocol: chọn dụng cụ để lấy hoá chất (lượng lấy theo dụng cụ), mở tủ hoá chất và tủ dụng cụ
// để lấy đồ ra bàn, và buret để chuẩn độ (hiện khi đã lấy buret).

const fmt = (v) => String(v).replace('.', ',');

export function createChemPanel(root, { substances, tools, ppe = {}, ghs = () => '', onAction, onTool }) {
  const cabinet = substances.filter((s) => s.shelf === 'cabinet');
  root.innerHTML = `
    <div class="garden-head">
      <h2 class="section-title" id="chem-title">Bàn hoá học · tủ và dụng cụ</h2>
    </div>
    <div class="garden-grid">
      <div class="g-row" role="group" aria-label="Dụng cụ lấy hoá chất">
        <label class="g-label" for="c-tool">Dụng cụ</label>
        <select id="c-tool"></select>
        <select id="c-vol" aria-label="Thể tích định lấy"></select>
      </div>
      <p class="g-hint" id="c-tool-note"></p>
      <div class="g-row" role="group" aria-label="Đồ bảo hộ">
        <span class="g-label">Bảo hộ</span>
        <span class="chipset" id="c-ppe"></span>
      </div>
      <div class="g-row" role="group" aria-label="Tủ hoá chất">
        <span class="g-label">Tủ hoá chất</span>
        <span class="chipset" id="c-cabinet"></span>
      </div>
      <div class="g-row" role="group" aria-label="Tủ dụng cụ">
        <span class="g-label">Tủ dụng cụ</span>
        <span class="chipset" id="c-tools"></span>
      </div>
    </div>
    <div class="buret" id="c-buret" hidden>
      <div class="garden-head"><span class="eyebrow">Buret 25 mL · NaOH 0,1 M</span><span class="day" id="c-reading">chưa nạp</span></div>
      <div class="g-row">
        <button type="button" class="btn btn-ghost" id="c-fill">Nạp buret</button>
        <button type="button" class="btn btn-ghost" data-titr="1">+1 mL</button>
        <button type="button" class="btn btn-ghost" data-titr="0.5">+0,5 mL</button>
        <button type="button" class="btn btn-ghost" data-titr="0.1">+0,1 mL</button>
        <button type="button" class="btn btn-ghost" data-titr="0">+1 giọt</button>
        <button type="button" class="btn" id="c-end">Đọc buret · kết thúc</button>
      </div>
      <p class="g-hint" id="c-flask"></p>
    </div>`;

  const $ = (id) => root.querySelector(`#${id}`);
  const toolMap = new Map(tools.tools.map((t) => [t.id, t]));

  $('c-tool').addEventListener('change', () => { fillVolumes(); emit(); });
  $('c-vol').addEventListener('change', emit);
  $('c-ppe').addEventListener('click', (e) => { const b = e.target.closest('[data-ppe]'); if (b) onAction('ppe-wear', { item: b.dataset.ppe, on: b.getAttribute('aria-pressed') === 'true' ? 'no' : 'yes' }); });
  $('c-cabinet').addEventListener('click', (e) => { const b = e.target.closest('[data-take]'); if (b) onAction('chem-take', { item: b.dataset.take }); });
  $('c-tools').addEventListener('click', (e) => { const b = e.target.closest('[data-take]'); if (b) onAction('chem-take', { item: b.dataset.take }); });
  $('c-fill').addEventListener('click', () => onAction('titr-fill'));
  root.querySelectorAll('[data-titr]').forEach((b) => b.addEventListener('click', () => onAction('titr-add', { volume: Number(b.dataset.titr) })));
  $('c-end').addEventListener('click', () => onAction('titr-end'));

  function emit() {
    onTool($('c-tool').value, Number($('c-vol').value));
  }
  function fillVolumes() {
    const t = toolMap.get($('c-tool').value);
    $('c-vol').innerHTML = (t?.volumes ?? [2]).map((v) => `<option value="${v}">${v === 0.05 ? '1 giọt (0,05 mL)' : `${fmt(v)} mL`}</option>`).join('');
    $('c-vol').hidden = !(t?.volumes ?? [2]).length; // rót bằng tay, đếm giọt: lượng do thời gian giữ hoặc số giọt quyết định
    $('c-tool-note').textContent = t?.effect ?? '';
  }

  // st: { taken: Set(id dụng cụ và hoá chất đã lấy), tool, volume, titration: { filled, delivered, left }, flask: { pH, meter } }
  function render(st) {
    const usable = tools.tools.filter((t) => t.volumes && !t.titration && st.taken.has(t.id));
    const prev = st.tool;
    $('c-tool').innerHTML = usable.map((t) => `<option value="${t.id}">${esc(t.name)}</option>`).join('');
    $('c-tool').value = usable.some((t) => t.id === prev) ? prev : usable[0].id;
    fillVolumes();
    if ([...$('c-vol').options].some((o) => Number(o.value) === st.volume)) $('c-vol').value = String(st.volume);
    $('c-cabinet').innerHTML = cabinet
      .map((s) => (st.taken.has(s.id)
        ? `<span class="chip chip-effect">${s.unknown ? esc(s.label) : chem(s.formula)} trên bàn</span>`
        : `<button type="button" class="chip-btn" data-take="${esc(s.id)}"${ghs(s.id) ? ` title="${esc(ghs(s.id))}"` : ''}>Lấy ${s.unknown ? esc(s.label) : chem(s.formula)} <span class="conc">${esc(s.conc)}</span>${ghs(s.id).startsWith('Nguy hiểm') ? ' <span class="ghs" aria-label="nhãn GHS: nguy hiểm">⚠</span>' : ''}</button>`))
      .join('');
    $('c-ppe').innerHTML = Object.entries(ppe).map(([k, name]) => `<button type="button" class="chip-btn" data-ppe="${k}" aria-pressed="${st.worn?.has(k) ? 'true' : 'false'}">${st.worn?.has(k) ? '✓ ' : ''}${esc(name)}</button>`).join('');
    $('c-tools').innerHTML = tools.tools
      .filter((t) => !t.start)
      .map((t) => (st.taken.has(t.id) ? `<span class="chip chip-effect">${esc(t.name)}</span>` : `<button type="button" class="chip-btn" data-take="${esc(t.id)}">Lấy ${esc(t.name)}</button>`))
      .join('');
    $('c-buret').hidden = !st.taken.has('burette');
    const tt = st.titration;
    $('c-reading').textContent = tt.filled ? `đã nhỏ ${tt.delivered.toFixed(2).replace('.', ',')} mL · còn ${tt.left.toFixed(2).replace('.', ',')} mL` : 'chưa nạp';
    $('c-flask').textContent = `Bình tam giác: ${st.flask.text}${st.flask.pH !== null && st.taken.has('phmeter') ? ` · pH ${st.flask.pH.toFixed(2).replace('.', ',')}` : ''}`;
  }

  return { render, current: () => ({ tool: $('c-tool').value, volume: Number($('c-vol').value) }) };
}
