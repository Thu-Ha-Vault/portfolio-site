// Tiệt trùng bằng nồi hấp (Tomy SX-500): xếp mẻ hấp, chạy chu trình, kiểm tra băng chỉ thị và chỉ thị sinh học.
// Chu trình (gia nhiệt, đuổi khí, tăng áp, tiệt trùng, xả áp, hạ nhiệt), nhiệt độ của dịch trong bình, số log giảm của
// bào tử Geobacillus stearothermophilus (D121 = 2 phút, z = 10 °C, 10⁶ bào tử), F0, áp suất trong chai đậy kín
// lấy từ figures/autoclave/model.mjs (manual Tomy 21006.12, ISO 11138-3, Ph. Eur. 5.1.5).
// Chỉ thị sinh học mọc khi còn ít nhất một bào tử sống: xác suất 1 − e^(−N) với N là số bào tử còn lại (phân phối Poisson).
// Không phụ thuộc DOM.

import { simulate, survivors, sealedBottle, psat, liquidExtraMin, SPORE, SX500 } from '../../figures/autoclave/model.mjs';
import { rng } from './random.js';
import { Notebook } from './notebook.js';

export const AC_ACTIONS = { 'ac-load': 'Xếp mẻ hấp', 'ac-run': 'Chạy nồi hấp', 'ac-bi': 'Ủ chỉ thị sinh học' };
const fmt = (v, d = 1) => (Number.isFinite(v) ? v.toFixed(d).replace('.', ',') : '—');
const sci = (n) => {
  if (n >= 1) return Math.round(n).toLocaleString('fr-FR');
  const e = Math.floor(Math.log10(n));
  return `${fmt(n / 10 ** e)}×10${String(e).replace(/[0-9-]/g, (c) => '⁰¹²³⁴⁵⁶⁷⁸⁹⁻'['0123456789-'.indexOf(c)])}`;
};

export class AutoclaveLab {
  constructor({ seed = Date.now() } = {}) {
    this.notebook = new Notebook();
    this.reset(seed);
  }

  reset(seed = Date.now()) {
    this.random = rng(seed);
    this.load = null;
    this.run = null;
    this.notebook.clear();
  }

  do(action, params = {}) {
    const fn = { 'ac-load': () => this.loadUp(params), 'ac-run': () => this.cycle(params), 'ac-bi': () => this.bi() }[action];
    if (!fn) throw new Error(`Không có thao tác "${action}"`);
    return { action, ...fn() };
  }

  loadUp({ loadL = 1.5, sealed = false }) {
    this.load = { loadL: Number(loadL), sealed: Boolean(sealed) };
    this.run = null;
    const events = [{ type: 'machine', label: 'Mẻ hấp', text: `Đổ ${fmt(SX500.waterL, 0)} L nước cất ngập tấm đỡ. Hai giỏ: ${fmt(this.load.loadL)} L môi trường trong bình tam giác và chai, đầu tip, cốc đậy giấy bạc; dán băng chỉ thị lên từng món, đặt một ống chỉ thị sinh học (10⁶ bào tử ${SPORE.name}) vào giữa chai lớn nhất.` }];
    if (this.load.sealed) {
      const s = sealedBottle(121, psat(121));
      events.push({ type: 'warning', text: `Nắp chai vặn chặt: ở 121 °C khí và hơi trong chai đạt ${fmt(s.inside, 0)} kPa, cao hơn buồng ${fmt(s.diff / 100, 1)} bar. Chai có thể nứt vỡ khi xả áp. Nới lỏng nắp nửa vòng trước khi hấp.` });
    } else events.push({ type: 'effect', text: 'Nắp chai nới lỏng, bình tam giác nút bông và giấy bạc: hơi nước vào được, áp suất trong và ngoài chai cân bằng.' });
    const extra = liquidExtraMin(this.load.loadL);
    if (extra > 0) events.push({ type: 'info', text: `Dịch lỏng nóng chậm hơn hơi nước: với ${fmt(this.load.loadL)} L hãng khuyên kéo dài thời gian tiệt trùng thêm khoảng ${fmt(extra, 0)} phút.` });
    this.notebook.add({ day: '', experiment: 'Nồi hấp', action: AC_ACTIONS['ac-load'], subject: `${this.load.loadL} L`, result: this.load.sealed ? 'chai đậy kín' : 'nắp nới lỏng' });
    return { ok: true, events };
  }

  cycle({ temp = 121, holdMin = 20, purge = true }) {
    if (!this.load) return { ok: false, events: [{ type: 'warning', text: 'Buồng trống: xếp mẻ hấp và đổ nước trước khi chạy (máy báo thiếu nước nếu chưa đổ).' }] };
    const sim = simulate({ temp, holdMin, purge, loadL: this.load.loadL, sealed: this.load.sealed });
    const end = sim.samples.at(-1);
    const maxT = Math.max(...sim.samples.map((s) => s.T));
    const maxLoad = Math.max(...sim.samples.map((s) => s.Tload));
    const maxGauge = Math.max(...sim.samples.map((s) => s.gauge));
    const left = survivors(end.log);
    this.run = { temp, holdMin, purge, log: end.log, f0: end.f0, tape: end.tape, left, total: sim.total, unlockAt: sim.unlockAt };
    const events = [{ type: 'machine', label: 'Chu trình', text: `Đặt ${temp} °C, ${holdMin} phút. Gia nhiệt → ${purge ? 'giữ 100 °C đuổi khí' : 'không đuổi khí'} → tăng áp → tiệt trùng → xả áp → hạ nhiệt. Buồng cao nhất ${fmt(maxT)} °C ở ${fmt(maxGauge, 3)} MPa; dịch trong chai cao nhất ${fmt(maxLoad)} °C. Nhả khoá nắp sau ${fmt(sim.unlockAt / 60, 0)} phút, xong sau ${fmt(sim.total / 60, 0)} phút.` }];
    events.push({ type: 'info', label: 'Tiêu diệt', text: `Số log bào tử giảm ${fmt(end.log)} (D = D121·10^((121 − T)/10), D121 = ${fmt(SPORE.d121)} phút); F0 = ${fmt(end.f0)} phút. Còn khoảng ${sci(left)} bào tử sống trong 10⁶ ban đầu.` });
    if (!purge) events.push({ type: 'warning', text: `Không đuổi khí: ở cùng áp suất, hỗn hợp hơi nước và không khí chỉ đạt ${fmt(maxT)} °C thay vì ${temp} °C (định luật Dalton). Đồng hồ áp vẫn chỉ đúng nên rất dễ bị đánh lừa.` });
    if (holdMin < 20 + liquidExtraMin(this.load.loadL) && temp <= 121) events.push({ type: 'warning', text: 'Thời gian giữ ngắn so với lượng dịch: tâm chai chưa kịp đủ nhiệt và đủ thời gian.' });
    events.push(end.tape > 0.8 ? { type: 'effect', text: 'Băng chỉ thị chuyển vạch sẫm: chỉ cho biết món đó đã qua nồi hấp có hơi nước nóng, không chứng minh vô trùng.' } : { type: 'warning', text: 'Băng chỉ thị vẫn nhạt: món đồ không gặp đủ hơi nước nóng.' });
    this.notebook.add({ day: '', experiment: 'Nồi hấp', action: AC_ACTIONS['ac-run'], subject: `${temp} °C ${holdMin} phút`, result: `log ${end.log.toFixed(2)}`, f0: end.f0.toFixed(1), purge });
    const series = [
      { name: 'Buồng', kind: 'main', legend: 'Buồng', points: sim.samples.filter((_, i) => i % 15 === 0).map((s) => [s.t / 60, s.T]) },
      { name: 'Dịch trong chai', kind: 'alt', legend: 'Dịch trong chai', points: sim.samples.filter((_, i) => i % 15 === 0).map((s) => [s.t / 60, s.Tload]) },
    ];
    // seconds: thời gian cả chu trình (đồng hồ chung, src/core/labclock.js)
    return { ok: true, events, series, threshold: temp, seconds: sim.total };
  }

  bi() {
    if (!this.run) return { ok: false, events: [{ type: 'warning', text: 'Chưa chạy nồi hấp nên chưa có ống chỉ thị sinh học để ủ.' }] };
    const p = 1 - Math.exp(-this.run.left);
    const grew = this.random() < p;
    const events = [{ type: 'machine', label: 'Chỉ thị sinh học', text: `Bóp vỡ ống môi trường, ủ ở 56 °C trong 48 giờ cùng một ống đối chứng không hấp. Đối chứng chuyển từ tím sang vàng: bào tử nảy mầm, lên men đường làm acid hoá môi trường, chỉ thị bromocresol purple đổi màu.` }];
    events.push(grew
      ? { type: 'warning', label: 'Mọc', text: `Ống đã hấp chuyển vàng: còn bào tử sống (kỳ vọng còn khoảng ${sci(this.run.left)} bào tử). Mẻ hấp không đạt, phải hấp lại.` }
      : { type: 'effect', label: 'Không mọc', text: `Ống đã hấp vẫn tím: không còn bào tử sống (kỳ vọng ${sci(this.run.left)} bào tử, xác suất còn sống ${fmt(p * 100, p < 0.01 ? 4 : 1)} %). Mẻ hấp đạt.` });
    this.notebook.add({ day: '', experiment: 'Nồi hấp', action: AC_ACTIONS['ac-bi'], subject: 'BI', result: grew ? 'mọc' : 'không mọc' });
    return { ok: true, events, grew };
  }

  figureData() {
    if (!this.run) return this.load ? { loadL: this.load.loadL, sealed: this.load.sealed } : null;
    return { temp: this.run.temp, holdMin: this.run.holdMin, purge: this.run.purge, loadL: this.load.loadL, sealed: this.load.sealed };
  }
}
