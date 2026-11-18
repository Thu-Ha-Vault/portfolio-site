import { evaluateClimate, WEATHER } from '../core/climate.js';
import { esc } from './format.js';

// Bảng điều khiển khí hậu của khu trồng trọt, nổi trên nửa phòng thí nghiệm.

const FIELDS = [
  { id: 'temp', label: 'Nhiệt độ', min: 0, max: 40, unit: '°C' },
  { id: 'humidity', label: 'Độ ẩm', min: 20, max: 100, unit: '%' },
  { id: 'light', label: 'Ánh sáng', min: 0, max: 100, unit: '%' },
];

export function createClimatePanel(root, { crop: crop0, initial, onChange, onClose }) {
  let crop = crop0;
  const state = { ...initial };
  root.innerHTML = `
    <div class="climate-head">
      <div><span class="eyebrow">Khu trồng trọt</span><strong>Điều khiển khí hậu</strong></div>
      <button type="button" class="icon-btn" id="climate-close" aria-label="Đóng bảng điều khiển khí hậu">×</button>
    </div>
    ${FIELDS.map((f) => `
      <div class="field">
        <label for="c-${f.id}">${f.label}</label>
        <input type="range" id="c-${f.id}" min="${f.min}" max="${f.max}" step="1">
        <output id="o-${f.id}" for="c-${f.id}"></output>
      </div>`).join('')}
    <fieldset class="seg">
      <legend>Thời tiết</legend>
      ${Object.entries(WEATHER).map(([k, w]) => `<label><input type="radio" name="weather" id="w-${k}" value="${k}"><span>${w.name}</span></label>`).join('')}
    </fieldset>
    <fieldset class="seg">
      <legend>Tưới nước</legend>
      <label><input type="radio" name="irrigation" id="i-auto" value="auto"><span>Nhỏ giọt tự động</span></label>
      <label><input type="radio" name="irrigation" id="i-manual" value="manual"><span>Tự tưới</span></label>
    </fieldset>
    <div class="crop">
      <p class="crop-name" id="crop-name"></p>
      <ul class="crop-msgs" id="crop-msgs"></ul>
    </div>`;

  const $ = (id) => root.querySelector(`#${id}`);

  function sync() {
    for (const f of FIELDS) {
      $(`c-${f.id}`).value = state[f.id];
      $(`o-${f.id}`).textContent = `${state[f.id]} ${f.unit}`;
    }
    $(`w-${state.weather}`).checked = true;
    $(`i-${state.irrigation ?? 'auto'}`).checked = true;
    $('crop-name').innerHTML = `${esc(crop.name)} <em>${esc(crop.latin)}</em>`;
    const ev = evaluateClimate(crop, state);
    $('crop-msgs').innerHTML = ev.messages.map((m) => `<li class="msg is-${m.level}">${esc(m.text)}</li>`).join('');
    onChange({ ...state }, ev);
  }

  for (const f of FIELDS) {
    $(`c-${f.id}`).addEventListener('input', (e) => {
      state[f.id] = Number(e.target.value);
      sync();
    });
  }
  root.querySelectorAll('input[name="weather"]').forEach((input) => {
    input.addEventListener('change', () => {
      state.weather = input.value;
      if (state.weather === 'rain' && state.humidity < 90) state.humidity = 90; // trời mưa thì không khí gần bão hoà hơi nước
      sync();
    });
  });
  root.querySelectorAll('input[name="irrigation"]').forEach((input) => {
    input.addEventListener('change', () => {
      state.irrigation = input.value;
      sync();
    });
  });
  $('climate-close').addEventListener('click', () => onClose());

  sync();
  return {
    // Đổi loài cây đang trồng (theo protocol): ngưỡng và lời nhận xét đổi theo
    setCrop(c) {
      crop = c;
      sync();
    },
    // Đặt lại khí hậu (mở lại phiên đã lưu)
    setState(next) {
      Object.assign(state, next);
      sync();
    },
  };
}
