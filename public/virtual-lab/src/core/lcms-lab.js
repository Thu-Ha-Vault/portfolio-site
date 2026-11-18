// LC-MS/MS ba tứ cực (Shimadzu LCMS-8060): chọn kênh MRM, chạy dãy chuẩn caffeine pha trong dung môi, định lượng
// caffeine trong huyết tương.
// m/z, độ truyền qua tứ cực, phân mảnh, tín hiệu, nhiễu, S/N, LOD/LOQ, sắc ký đồ MRM, thời gian lưu lấy từ
// figures/lcms/model.mjs (dùng lại figures/hplc/model.mjs cho phần LC).
// Giả định minh hoạ (ghi trong note 06): huyết tương có caffeine 1 000–6 000 ng/mL cùng hai chất chuyển hoá
// theobromine (10 %) và theophylline (5 %); kết tủa protein rồi tiêm thẳng làm ức chế ion 40 %, pha loãng 20 lần còn 10 %.
// Sai số pipet khi pha loãng và khi thêm chuẩn nội CV 1 % (ước lượng, như figures/platereader/model.mjs).
// Chuẩn nội đồng vị (caffeine-¹³C₃) cùng thời gian lưu nên chịu cùng mức ức chế: tỉ số diện tích không đổi theo nền mẫu.
// Không phụ thuộc DOM.

import { mrmRun, normalizeRun, calibration, chromatogram, ionPath, transitionsOf, analyteOf, idealAt, ANALYTES, LCMS, fmt, sci } from '../../figures/lcms/model.mjs';
import { rng } from './random.js';
import { Notebook } from './notebook.js';

export const MS_ACTIONS = { 'ms-select': 'Chọn kênh MRM', 'ms-standards': 'Dãy chuẩn', 'ms-sample': 'Tiêm mẫu huyết tương' };
export const MS_PREP = {
  direct: { name: 'kết tủa protein, tiêm thẳng', dil: 1, matrix: 0.4, is: false },
  dilute: { name: 'kết tủa protein, pha loãng 20 lần', dil: 20, matrix: 0.1, is: false },
  'dilute-is': { name: 'pha loãng 20 lần, có chuẩn nội caffeine-¹³C₃', dil: 20, matrix: 0.1, is: true },
};
const STD = [1, 5, 10, 50, 100, 500]; // ng/mL caffeine trong dung môi
const v1 = (v) => fmt(v, 1);

export class LcmsLab {
  constructor({ seed = Date.now() } = {}) {
    this.notebook = new Notebook();
    this.reset(seed);
  }

  reset(seed = Date.now()) {
    this.random = rng(seed);
    this.truth = Math.round(1000 + 5000 * this.random());
    this.channel = { analyte: 'caffeine', transition: 0 };
    this.cal = null;
    this.last = null;
    this.notebook.clear();
  }

  do(action, params = {}) {
    const fn = { 'ms-select': () => this.select(params), 'ms-standards': () => this.standards(), 'ms-sample': () => this.sample(params) }[action];
    if (!fn) throw new Error(`Không có thao tác "${action}"`);
    return { action, ...fn() };
  }

  plasma() {
    return [{ name: 'caffeine', conc: this.truth }, { name: 'theobromine', conc: this.truth * 0.1 }, { name: 'theophylline', conc: this.truth * 0.05 }];
  }

  select({ analyte = 'caffeine', transition = 0 }) {
    const a = analyteOf(analyte) ?? ANALYTES.caffeine;
    const t = Math.max(0, Math.min(a.transitions.length - 1, Number(transition)));
    const changed = a.name !== this.channel.analyte || t !== this.channel.transition;
    this.channel = { analyte: a.name, transition: t };
    if (changed) this.cal = null;
    const p = ionPath(a.name, t, { names: Object.keys(ANALYTES) });
    const pass1 = p.species.filter((s) => s.kind === 'precursor' && s.t1 > 0.5);
    const finals = pass1.filter((s) => s.fragments.some((f) => f.t3 > 0.5 && f.y > 0.01));
    const ch = transitionsOf([a.name])[t];
    const events = [{ type: 'machine', label: 'MRM', text: `${ch.label} (${ch.role}), CE ${p.ce} V. Q1 lọc m/z ${fmt(p.q1, 1)} (RF ${Math.round(p.rf1.V)} V, DC ${Math.round(p.rf1.U)} V), ô va chạm bắn ion vào argon, Q3 lọc mảnh m/z ${fmt(p.q3, 1)}.` }];
    events.push({ type: 'info', label: 'Qua Q1', text: `${pass1.map((s) => s.name).join(', ')}: cùng m/z ${fmt(p.q1, 1)} trong cửa sổ ${fmt(LCMS.fwhm, 1)} u. Các ion khác dao động không bền, va vào thanh tứ cực.` });
    if (pass1.length > 1) events.push({ type: 'effect', text: `Q1 không tách được ${pass1.map((s) => s.name).join(' và ')} (đồng phân, cùng công thức). Sau ô va chạm chúng vỡ thành mảnh khác nhau nên Q3 chỉ cho ${finals.map((s) => s.name).join(', ')} đi qua: MRM chọn lọc nhờ cặp tiền chất – mảnh.` });
    this.notebook.add({ day: '', experiment: 'LC-MS/MS', action: MS_ACTIONS['ms-select'], subject: ch.label, result: finals.map((s) => s.name).join(', ') });
    return { ok: true, events };
  }

  standards() {
    const base = { analyte: this.channel.analyte, transition: this.channel.transition, matrix: 0, sample: [] };
    const cal = calibration(base, STD);
    this.cal = { ...this.channel, slope: cal.slope, points: cal.points };
    const top = mrmRun(normalizeRun({ ...base, conc: STD[0] }));
    const events = [{ type: 'machine', label: 'Dãy chuẩn', text: `${this.channel.analyte} ${STD.join(', ')} ng/mL pha trong dung môi, tiêm 2 µL mỗi mức. Diện tích = ${sci(cal.slope, 2)} × C (đi qua gốc).` }];
    events.push({ type: 'info', label: 'Độ nhạy', text: `Ở ${STD[0]} ng/mL: S/N ${Math.round(top.sn)}; LOD ${fmt(top.lod, 3)} ng/mL (S/N 3), LOQ ${fmt(top.loq, 3)} ng/mL (S/N 10). Mỗi pic có khoảng ${Math.round(top.points)} điểm dữ liệu (chu kỳ MRM ${Math.round(top.cycle * 1000)} ms).` });
    this.notebook.add({ day: '', experiment: 'LC-MS/MS', action: MS_ACTIONS['ms-standards'], subject: this.channel.analyte, result: cal.slope.toFixed(0) });
    // seconds: mỗi mức chuẩn một lần tiêm, chạy hết thời gian sắc ký tEnd (phút)
    return { ok: true, events, points: cal.points.map((p) => [p.conc, p.area]), fit: { a: 0, b: cal.slope }, seconds: STD.length * top.tEnd * 60 };
  }

  sample({ prep = 'dilute-is' }) {
    const P = MS_PREP[prep] ?? MS_PREP['dilute-is'];
    const sample = this.plasma().map((s) => ({ ...s, conc: s.conc / P.dil }));
    const own = sample.find((s) => s.name === this.channel.analyte);
    const res = mrmRun(normalizeRun({ analyte: this.channel.analyte, transition: this.channel.transition, conc: own?.conc ?? 0, matrix: P.matrix, sample, seed: Math.floor(this.random() * 1e6) }));
    this.last = { analyte: this.channel.analyte, transition: this.channel.transition, conc: +(own?.conc ?? 0).toFixed(2), matrix: P.matrix, prep, sample };
    const events = [{ type: 'machine', label: 'Mẫu', text: `Huyết tương sau khi uống cà phê, ${P.name}. Kênh ${this.channel.analyte}: pic ở ${fmt(res.tR, 2)} phút, diện tích ${sci(res.area, 2)}, S/N ${Math.round(res.sn)}.` }];
    if (!this.cal || this.cal.analyte !== this.channel.analyte || this.cal.transition !== this.channel.transition) {
      events.push({ type: 'warning', text: 'Chưa có dãy chuẩn cho kênh này: chỉ nhận diện được chất (thời gian lưu, cặp m/z), chưa định lượng được.' });
      return { ok: true, events, trace: chromatogram(res), res, seconds: res.tEnd * 60 };
    }
    // Sai số tiêm lặp theo thống kê đếm ion (1/S/N)
    const g = this.random() + this.random() + this.random() - 1.5;
    // Khi đầu dò bão hoà, diện tích tích phân từ tín hiệu bị cắt ở 2 × 10⁷ cps
    const seen = res.saturated ? this.clippedArea(res) : res.area;
    const area = seen * (1 + (2 * g) / Math.max(1, res.sn));
    const normal = () => Array.from({ length: 12 }, () => this.random()).reduce((a, b) => a + b, 0) - 6;
    const pip = (P.dil > 1 ? 1 + 0.01 * normal() : 1) * (P.is ? 1 + 0.01 * normal() : 1);
    const ratio = (P.is ? area / (1 - P.matrix) : area) * pip; // chuẩn nội chịu cùng mức ức chế nên tỉ số bù lại
    const inj = ratio / this.cal.slope;
    const result = inj * P.dil;
    const truth = this.analyteTruth();
    const err = (result / truth - 1) * 100;
    const top = STD.at(-1);
    if (res.saturated) events.push({ type: 'warning', text: 'Đầu dò bão hoà (trên 2 × 10⁷ cps): đỉnh pic bị cắt, diện tích thấp hơn thật.' });
    if (inj > top) events.push({ type: 'warning', text: `Nồng độ tiêm khoảng ${v1(inj)} ng/mL, vượt chuẩn cao nhất ${top} ng/mL: ngoại suy, phải pha loãng mẫu.` });
    events.push({ type: Math.abs(err) <= 15 ? 'effect' : 'warning', label: 'Kết quả', text: `${this.channel.analyte} trong huyết tương = ${v1(inj)} ng/mL × ${P.dil} = ${v1(result)} ng/mL. Thật ${v1(truth)} ng/mL, sai số ${Math.abs(err) < 0.05 ? '' : err > 0 ? '+' : '−'}${v1(Math.abs(err))} %.` });
    if (!P.is && P.matrix > 0) events.push({ type: 'warning', label: 'Hiệu ứng nền', text: `Các chất trong huyết tương ra cùng lúc tranh điện tích trong giọt ESI, làm tín hiệu giảm khoảng ${Math.round(P.matrix * 100)} %. Dãy chuẩn pha trong dung môi không bị ức chế nên kết quả bị tính thiếu. Pha loãng giảm ức chế; chuẩn nội đồng vị bù được phần còn lại.` });
    if (P.is) events.push({ type: 'effect', text: 'Chuẩn nội caffeine-¹³C₃ ra cùng thời gian lưu, bị ức chế đúng bằng caffeine; tính theo tỉ số diện tích chất / chuẩn nội nên hiệu ứng nền triệt tiêu.' });
    this.notebook.add({ day: '', experiment: 'LC-MS/MS', action: MS_ACTIONS['ms-sample'], subject: P.name, result: result.toFixed(1), truth: truth.toFixed(1), error_pct: err.toFixed(1) });
    return { ok: true, events, trace: chromatogram(res), res, result, err, seconds: res.tEnd * 60 };
  }

  clippedArea(res) {
    const dt = 0.1 / 60;
    let sum = 0;
    for (let t = res.tR - 6 * res.sigma; t <= res.tR + 6 * res.sigma; t += dt) sum += Math.max(0, idealAt(t, res) - res.bg) * dt * 60;
    return sum;
  }

  analyteTruth() {
    return this.plasma().find((s) => s.name === this.channel.analyte)?.conc ?? 0;
  }

  figureData() {
    const L = this.last;
    if (!L) return { analyte: this.channel.analyte, transition: this.channel.transition };
    return { analyte: L.analyte, transition: L.transition, conc: L.conc, matrix: L.matrix, sample: L.sample.map((s) => ({ name: s.name, conc: +s.conc.toFixed(2) })) };
  }
}
