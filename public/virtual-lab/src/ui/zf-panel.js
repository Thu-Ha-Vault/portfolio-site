import { esc } from './format.js';

// Bảng điều khiển thử độc tính trên phôi cá ngựa vằn (OECD 236), nằm trong nửa protocol.

export function createZfPanel(root, { zf, onAction, onSetup, onNotebook }) {
  root.innerHTML = `
    <div class="garden-head">
      <h2 class="section-title" id="zf-title">Khu nuôi sinh vật · phôi cá ngựa vằn</h2>
      <span class="day" id="z-hpf">0 hpf</span>
    </div>
    <div class="garden-grid">
      <div class="g-row" role="group" aria-label="Thiết kế thí nghiệm">
        <label class="g-label" for="z-chem">Chất thử</label>
        <select id="z-chem">${zf.chemicals.map((c) => `<option value="${c.id}">${esc(c.name)}</option>`).join('')}</select>
        <select id="z-n" aria-label="Số phôi mỗi nồng độ"><option value="15">15 phôi/nồng độ</option><option value="20">20 phôi/nồng độ</option></select>
        <select id="z-temp" aria-label="Nhiệt độ ủ"><option value="26">26 °C</option><option value="28.5">28,5 °C</option></select>
        <label class="g-check"><input type="checkbox" id="z-pos"> đối chứng dương 3,4-DCA 4 mg/L</label>
      </div>
      <p class="g-hint" id="z-series"></p>
      <div class="g-row" role="group" aria-label="Thao tác">
        <span class="g-label">Thao tác</span>
        <label class="g-check"><input type="checkbox" id="z-select" checked> chọn phôi thụ tinh</label>
        <select id="z-pull" aria-label="Giờ rút vách ngăn"><option value="8">rút vách 08:00</option><option value="11">rút vách 11:00</option><option value="22">rút vách 22:00</option></select>
        <button type="button" class="btn btn-ghost" id="z-spawn">Cho cá đẻ</button>
        <button type="button" class="btn btn-ghost" id="z-collect">Thu trứng</button>
        <button type="button" class="btn btn-ghost" id="z-expose">Chia vào đĩa giếng</button>
        <button type="button" class="btn btn-ghost" id="z-grow">Ủ 24 giờ</button>
        <button type="button" class="btn btn-ghost" id="z-observe">Quan sát</button>
        <button type="button" class="btn btn-ghost" id="z-analyze">Tính LC50</button>
      </div>
    </div>
    <div class="g-row"><button type="button" class="btn btn-ghost" id="z-csv">Sổ thí nghiệm (CSV)</button></div>`;
  const $ = (id) => root.querySelector(`#${id}`);
  const setup = () => ({ chemical: $('z-chem').value, perWell: Number($('z-n').value), temp: Number($('z-temp').value), positive: $('z-pos').checked });
  for (const id of ['z-chem', 'z-n', 'z-temp', 'z-pos']) $(id).addEventListener('change', () => onSetup(setup()));
  $('z-spawn').addEventListener('click', () => onAction('zf-spawn', { pullHour: Number($('z-pull').value) }));
  $('z-collect').addEventListener('click', () => onAction('zf-collect', { select: $('z-select').checked }));
  $('z-expose').addEventListener('click', () => onAction('zf-expose'));
  $('z-grow').addEventListener('click', () => onAction('zf-grow', { hours: 24 }));
  $('z-observe').addEventListener('click', () => onAction('zf-observe'));
  $('z-analyze').addEventListener('click', () => onAction('zf-analyze'));
  $('z-csv').addEventListener('click', () => onNotebook());

  function render(st, s) {
    $('z-hpf').textContent = `${st.hours} hpf · ${String(st.temp).replace('.', ',')} °C`;
    $('z-chem').value = s.chemical;
    $('z-n').value = String(s.perWell);
    $('z-temp').value = String(s.temp);
    $('z-pos').checked = Boolean(s.positive);
    const c = zf.chemicals.find((x) => x.id === s.chemical);
    $('z-series').textContent = `Dãy nồng độ: ${s.series.map((v) => String(v).replace('.', ',')).join(' · ')} ${c.unit}. ${c.note}`;
    for (const id of ['z-chem', 'z-n', 'z-temp', 'z-pos']) $(id).disabled = st.plated;
  }
  return { render };
}
