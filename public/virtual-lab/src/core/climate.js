// Đánh giá điều kiện khu trồng trọt cho một loài cây theo ngưỡng có nguồn trong data/crops.json (EcoCrop, NDSU,
// Bueckert, PNW Handbook…): khoảng nhiệt độ, nhiệt độ nền và độ ngày sinh trưởng, sương giá, nắng nóng lúc ra hoa,
// độ ẩm và điều kiện phát bệnh. Không phụ thuộc DOM.

import { gddOf, diseaseDay } from './field.js';

export const WEATHER = {
  sun: { name: 'Nắng', light: 1 },
  cloud: { name: 'Nhiều mây', light: 0.5 },
  rain: { name: 'Mưa', light: 0.3 },
};

const RANK = { good: 0, warn: 1, bad: 2 };

export function evaluateClimate(crop, state) {
  const messages = [];
  const [o1, o2] = crop.temp.optimal;
  const [t1, t2] = crop.temp.tolerable;
  let tempLevel;
  if (state.temp >= o1 && state.temp <= o2) {
    tempLevel = 'good';
    messages.push({ level: 'good', text: `Nhiệt độ phù hợp (${o1}–${o2} °C).` });
  } else if (state.temp >= t1 && state.temp <= t2) {
    tempLevel = 'warn';
    messages.push({ level: 'warn', text: state.temp < o1 ? 'Hơi lạnh: cây chậm lớn.' : 'Hơi nóng: cây chậm lớn, ra hoa kém.' });
  } else {
    tempLevel = 'bad';
    messages.push({ level: 'bad', text: state.temp < t1 ? 'Quá lạnh: cây gần như ngừng sinh trưởng.' : 'Quá nóng: cây héo, hoa rụng, ít đậu quả.' });
  }

  if (Number.isFinite(crop.tBase)) {
    const gdd = gddOf(crop, state.temp);
    messages.push({ level: gdd > 0 ? 'good' : 'bad', text: gdd > 0 ? `Mỗi ngày tích luỹ ${gdd.toFixed(1).replace('.', ',')} °C·ngày (nhiệt độ nền ${String(crop.tBase).replace('.', ',')} °C; ra hoa sau khoảng ${crop.gddFlower} °C·ngày).` : `Nhiệt độ không vượt nền ${String(crop.tBase).replace('.', ',')} °C hoặc quá nóng: cây không tích luỹ độ ngày, ngừng lớn.` });
  }
  if (Number.isFinite(crop.tKill) && state.temp <= crop.tKill) messages.push({ level: 'bad', text: `Sương giá: dưới ${crop.tKill} °C cây bị hại.` });
  if (Number.isFinite(crop.heatAbortC) && state.temp >= crop.heatAbortC) messages.push({ level: 'warn', text: `Từ ${crop.heatAbortC} °C trở lên, hoa đang nở rụng nhiều, ít đậu quả.` });
  const [h1, h2] = crop.rhOpt ?? [35, 90];
  if (crop.mildew || crop.botrytis) {
    const d = diseaseDay(crop, state);
    if (d.botrytis) messages.push({ level: 'warn', text: `Độ ẩm ≥ ${crop.botrytis.rhAbove} % ở ${crop.botrytis.tempRange.join('–')} °C: mốc xám (Botrytis) phát triển, thối hoa và quả.` });
    if (d.mildew) messages.push({ level: 'warn', text: `Điều kiện cho ${crop.mildew.pathogen} (độ ẩm ≥ ${crop.mildew.rhAbove} %, ${crop.mildew.tempRange.join('–')} °C): kéo dài vài ngày thì lá nhiễm bệnh.` });
  }
  if (state.humidity > h2 && !messages.some((m) => m.text.includes('Botrytis'))) messages.push({ level: 'warn', text: `Độ ẩm trên ${h2} %: dễ phát sinh nấm bệnh.` });
  else if (state.humidity < h1) messages.push({ level: 'warn', text: `Độ ẩm dưới ${h1} %: cây thoát hơi nước nhanh, cần tưới nhiều hơn.` });

  const lightLevel = state.light * (WEATHER[state.weather]?.light ?? 1);
  if (lightLevel < 25) messages.push({ level: 'warn', text: 'Thiếu sáng: cây vươn dài, lá nhạt màu.' });

  const level = messages.reduce((worst, m) => (RANK[m.level] > RANK[worst] ? m.level : worst), 'good');
  return { level, tempLevel, lightLevel, messages };
}
