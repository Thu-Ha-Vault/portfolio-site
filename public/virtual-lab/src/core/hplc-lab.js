// HPLC: định lượng caffeine trong nước giải khát bằng đường chuẩn diện tích pic.
// Thời gian lưu, độ rộng pic, diện tích, áp suất lấy từ figures/hplc/model.mjs (Agilent 1260 Infinity II, cột C18).
// Mẫu nước giải khát: caffeine 30–120 µg/mL kèm theobromine 5–20 µg/mL (giả định minh hoạ), phải pha loãng 1:1 khi lọc.
// Thêm bài định lượng paracetamol + caffeine trong viên Panadol Extra theo tường trình HPLC-UV (PC ở dưới).
// Không phụ thuộc DOM.

import { runOf, METHOD, signalAt } from '../../figures/hplc/model.mjs';
import { rng } from './random.js';
import { Notebook } from './notebook.js';
import { linearFit } from './spectro-lab.js';

export const HPLC_ACTIONS = {
  'hplc-method': 'Đặt phương pháp',
  'hplc-standards': 'Tiêm dãy chuẩn caffeine',
  'hplc-sample': 'Tiêm mẫu nước giải khát',
  'hplc-calibrate': 'Dựng đường chuẩn, tính nồng độ',
  'hplc-pc-phase': 'Chọn tỉ lệ pha động (paracetamol + caffeine)',
  'hplc-pc-std': 'Tiêm dãy chuẩn paracetamol và caffeine',
  'hplc-pc-sample': 'Tiêm mẫu viên thuốc',
  'hplc-pc-calc': 'Tính hàm lượng và hiệu suất thu hồi',
};

// Tường trình "Phân tích paracetamol và caffeine trong mẫu dược phẩm bằng HPLC-UV" (ĐHKHTN TP.HCM, nhóm sinh viên,
// 04/2023; thư viện HÓA HỌC trong Google Drive của chủ dự án): pha động CH₃COOH 0,1 % (pH khoảng 3) : methanol,
// 0,7 mL/phút, cột C18 150 × 4,6 mm; 50 : 50 hai pic chập, 60 : 40 tách chưa xa, 70 : 30 tách hoàn toàn, paracetamol ra
// trước; dãy chuẩn và độ dốc đường chuẩn đo được của nhóm (paracetamol y = 95 843x, caffeine y = 58 106x, x là µg/mL);
// Panadol Extra 500 mg paracetamol + 65 mg caffeine mỗi viên, viên nặng trung bình 592,98 mg; cân khoảng 25 mg bột
// vào bình 25 mL, pha loãng 20 lần; mẫu thêm chuẩn (17,8 mg paracetamol, 2,3 mg caffeine) phải pha loãng 40 lần.
// Thời gian lưu và độ rộng pic theo mô tả của tường trình là minh hoạ; độ lệch diện tích 1 % (pha chuẩn và tiêm) là minh hoạ;
// hàm lượng thật lấy theo nhãn ± 2 % (minh hoạ).
export const PC = {
  phases: {
    '50:50': { tR: [2.35, 2.6], sigma: 0.09, note: 'hai pic chập vào nhau' },
    '60:40': { tR: [2.55, 3.15], sigma: 0.12, note: 'hai pic tách chưa xa' },
    '70:30': { tR: [2.9, 4.6], sigma: 0.11, note: 'hai pic tách hoàn toàn' },
  },
  std: { paracetamol: [4.96, 19.84, 29.76, 39.68, 49.6], caffeine: [0.938, 3.752, 5.628, 7.504, 9.38] },
  slope: { paracetamol: 95843, caffeine: 58106 },
  rsd: 0.01,
  tablet: { mg: 592.98, paracetamol: 500, caffeine: 65 },
  weighMg: 25, flaskMl: 25,
  spike: { paracetamol: 17.8, caffeine: 2.3 },
};
const PC_NAMES = ['paracetamol', 'caffeine'];

const STD = [10, 25, 50, 100]; // µg/mL
const fmt = (v, d = 2) => (Number.isFinite(v) ? v.toFixed(d).replace('.', ',') : '—');

export class HplcLab {
  constructor({ seed = Date.now() } = {}) {
    this.notebook = new Notebook();
    this.reset(seed);
  }

  reset(seed = Date.now()) {
    this.random = rng(seed);
    this.method = { ...METHOD, organic: 10, flow: 1.0 };
    this.truth = { caffeine: 30 + this.random() * 90, theobromine: 5 + this.random() * 15 };
    this.injections = 0;
    this.standards = null;
    this.sample = null;
    this.last = null;
    this.pc = null;
    this.pcTruth = { paracetamol: PC.tablet.paracetamol * (1 + 0.02 * this.random.normal()), caffeine: PC.tablet.caffeine * (1 + 0.02 * this.random.normal()) };
    this.notebook.clear();
  }

  #inject(sample) {
    this.injections += 1;
    const m = { ...this.method, seed: Math.floor(this.random() * 1e9) };
    return { m, run: runOf(m, sample) };
  }

  do(action, params = {}) {
    const fn = {
      'hplc-method': () => this.setMethod(params),
      'hplc-standards': () => this.injectStandards(),
      'hplc-sample': () => this.injectSample(),
      'hplc-calibrate': () => this.calibrate(),
      'hplc-pc-phase': () => this.pcPhase(params), 'hplc-pc-std': () => this.pcStd(), 'hplc-pc-sample': () => this.pcSample(params), 'hplc-pc-calc': () => this.pcCalc(),
    }[action];
    if (!fn) throw new Error(`Không có thao tác "${action}"`);
    return { action, ...fn() };
  }

  setMethod({ organic = 10, flow = 1.0 }) {
    this.method = { ...this.method, organic: Number(organic), flow: Number(flow) };
    this.standards = null;
    this.sample = null;
    const probe = runOf(this.method, [{ name: 'caffeine', conc: 50 }]);
    const events = [{ type: 'machine', label: 'Phương pháp', text: `Cột C18 4,6 × 150 mm, 5 µm; pha động nước (0,1 % formic acid) : acetonitrile = ${100 - organic} : ${organic}; ${fmt(flow, 1)} mL/phút; 30 °C; đầu dò 273 nm; tiêm 10 µL. Áp suất khoảng ${fmt(probe.pressure, 0)} bar (giới hạn ${fmt(probe.limit, 0)} bar).` }];
    if (probe.over) events.push({ type: 'warning', text: 'Quá áp: bơm dừng. Giảm lưu lượng.' });
    events.push({ type: 'effect', text: 'Trên cột pha đảo C18, chất càng kém phân cực càng bị giữ lâu. Tăng acetonitrile làm pha động mạnh hơn: mọi chất ra sớm hơn nhưng các pic dồn sát nhau.' });
    this.notebook.add({ day: '', experiment: 'HPLC', action: HPLC_ACTIONS['hplc-method'], subject: `${organic} % B, ${flow} mL/phút`, result: `${probe.pressure.toFixed(0)} bar` });
    return { ok: !probe.over, events };
  }

  injectStandards() {
    const rows = STD.map((c) => {
      const { m, run } = this.#inject([{ name: 'caffeine', conc: c }]);
      const p = run.peaks[0];
      return { c, area: p?.area ?? 0, tR: p?.tR ?? NaN, run, m };
    });
    this.standards = { rows, method: { ...this.method } };
    this.last = rows.at(-1);
    const events = [{ type: 'machine', label: 'Chuẩn caffeine', text: rows.map((r) => `${r.c} µg/mL: tR ${fmt(r.tR)} phút, diện tích ${fmt(r.area, 1)} mAU·s`).join(' · ') }];
    if (rows[0].tR < rows[0].run.t0 * 1.5) events.push({ type: 'warning', text: `Caffeine ra quá sát thời gian chết (t0 = ${fmt(rows[0].run.t0)} phút): bị lẫn với các chất không lưu giữ. Giảm acetonitrile.` });
    // seconds: mỗi lần tiêm chạy hết thời gian sắc ký tEnd (phút), các mức chuẩn tiêm nối tiếp (đồng hồ chung)
    return { ok: true, events, html: null, run: rows.at(-1).run, method: rows.at(-1).m, seconds: rows.reduce((t, r) => t + r.run.tEnd * 60, 0) };
  }

  injectSample() {
    const sample = [{ name: 'caffeine', conc: this.truth.caffeine / 2 }, { name: 'theobromine', conc: this.truth.theobromine / 2 }];
    const { m, run } = this.#inject(sample);
    this.sample = { run, method: { ...this.method } };
    this.last = { run, m };
    const events = [{ type: 'machine', label: 'Mẫu (pha loãng 1:1)', text: run.peaks.map((p) => `pic ${fmt(p.tR)} phút, diện tích ${fmt(p.area, 1)} mAU·s`).join(' · ') }];
    const caf = run.peaks.find((p) => p.name === 'caffeine');
    if (caf && caf.Rs !== null && caf.Rs < 1.5) events.push({ type: 'warning', text: `Pic caffeine và pic trước nó chưa tách hẳn (Rs = ${fmt(caf.Rs)} < 1,5): diện tích đo được kém tin cậy. Giảm acetonitrile để tách tốt hơn.` });
    return { ok: true, events, run, method: m, seconds: run.tEnd * 60 };
  }

  calibrate() {
    if (!this.standards) return { events: [{ type: 'warning', text: 'Chưa tiêm dãy chuẩn với phương pháp hiện tại.' }] };
    const rows = this.standards.rows;
    const fit = linearFit(rows.map((r) => r.c), rows.map((r) => r.area));
    const events = [{ type: 'machine', label: 'Đường chuẩn', text: `Diện tích = ${fmt(fit.b, 3)} × C ${fit.a >= 0 ? '+' : '−'} ${fmt(Math.abs(fit.a), 2)}; R² = ${fmt(fit.r2, 5)}.` }];
    let result = null;
    if (!this.sample) events.push({ type: 'info', text: 'Chưa tiêm mẫu.' });
    else {
      // Nhận pic caffeine trong mẫu bằng thời gian lưu của chuẩn (±3 %)
      const tStd = rows[0].tR;
      const hit = this.sample.run.peaks.find((p) => Math.abs(p.tR - tStd) / tStd < 0.03);
      if (!hit) events.push({ type: 'warning', text: 'Không thấy pic nào trùng thời gian lưu của chuẩn caffeine: mẫu và chuẩn phải chạy cùng phương pháp.' });
      else {
        result = ((hit.area - fit.a) / fit.b) * 2;
        const err = (result / this.truth.caffeine - 1) * 100;
        events.push({ type: Math.abs(err) <= 3 ? 'effect' : 'warning', label: 'Caffeine', text: `Pic tR ${fmt(hit.tR)} phút trùng chuẩn. C = (diện tích − a) / b × 2 (hệ số pha loãng) = ${fmt(result, 1)} µg/mL (${fmt(result * 0.33, 0)} mg trong lon 330 mL). Thật ${fmt(this.truth.caffeine, 1)} µg/mL, sai số ${err >= 0 ? '+' : ''}${fmt(err, 1)} %.` });
      }
    }
    events.push({ type: 'effect', text: 'Diện tích pic tỉ lệ với lượng chất đi qua đầu dò (định luật Beer–Lambert tích phân theo thời gian), nên đường chuẩn diện tích theo nồng độ là đường thẳng.' });
    this.notebook.add({ day: '', experiment: 'HPLC', action: HPLC_ACTIONS['hplc-calibrate'], subject: 'caffeine', result: result?.toFixed(2) ?? '—', r2: fit.r2.toFixed(5) });
    return { ok: true, events, fit, points: rows.map((r) => [r.c, r.area]), result };
  }

  // ---- Paracetamol + caffeine trong viên thuốc ----
  #pcArea(name, c) { return PC.slope[name] * c * (1 + PC.rsd * this.random.normal()); }

  // Sắc ký đồ hai pic Gauss (diện tích theo đơn vị của máy), thêm nhiễu nền nhỏ; trả về điểm [phút, tín hiệu] và các pic
  #pcTrace(areas) {
    const P = PC.phases[this.pc.ratio];
    const peaks = PC_NAMES.map((n, i) => ({ name: n, tR: P.tR[i], sigma: P.sigma, area: areas[n], height: areas[n] / (P.sigma * 60 * Math.sqrt(2 * Math.PI)) }));
    const pts = [];
    for (let i = 0; i <= 260; i++) {
      const t = (6.5 * i) / 260;
      pts.push([t, peaks.reduce((y, p) => y + p.height * Math.exp(-0.5 * ((t - p.tR) / p.sigma) ** 2), 0) + 200 * this.random.normal()]);
    }
    const Rs = (P.tR[1] - P.tR[0]) / (2 * (P.sigma + P.sigma));
    return { pts, peaks, Rs };
  }

  pcPhase({ ratio = '70:30' }) {
    if (!PC.phases[ratio]) return { ok: false, events: [{ type: 'warning', text: `Không có tỉ lệ "${ratio}".` }] };
    this.pc = { ratio, std: null, samples: {} };
    const tr = this.#pcTrace({ paracetamol: this.#pcArea('paracetamol', 29.76), caffeine: this.#pcArea('caffeine', 5.628) });
    const ok = tr.Rs >= 1.5;
    const [a, b] = ratio.split(':');
    const events = [{ type: 'machine', label: `${ratio}`, text: `Pha động CH₃COOH 0,1 % (pH khoảng 3) : methanol = ${a} : ${b}, 0,7 mL/phút; tiêm chuẩn hỗn hợp: paracetamol tR ${fmt(tr.peaks[0].tR)} phút, caffeine tR ${fmt(tr.peaks[1].tR)} phút, Rs = ${fmt(tr.Rs)} (${PC.phases[ratio].note}).` },
      { type: ok ? 'effect' : 'warning', label: ok ? 'Tách tốt' : 'Chưa tách', text: ok ? 'Paracetamol phân cực hơn nên ra trước; ít methanol hơn thì pha động yếu hơn, hai chất bị giữ lâu hơn và tách xa nhau.' : 'Rs < 1,5: hai pic chồng lên nhau, không tính được diện tích riêng từng chất. Giảm methanol (tường trình chọn 70 : 30).' }];
    this.notebook.add({ day: '', experiment: 'HPLC', action: HPLC_ACTIONS['hplc-pc-phase'], subject: ratio, result: `Rs ${tr.Rs.toFixed(2)}` });
    return { ok, Rs: tr.Rs, pcTrace: tr.pts, peaks: tr.peaks, events, seconds: 6.5 * 60 };
  }

  pcStd() {
    if (!this.pc) return { ok: false, events: [{ type: 'warning', text: 'Chọn tỉ lệ pha động trước.' }] };
    const rows = PC.std.paracetamol.map((cp, i) => {
      const cc = PC.std.caffeine[i];
      return { cp, cc, ap: this.#pcArea('paracetamol', cp), ac: this.#pcArea('caffeine', cc) };
    });
    const fp = linearFit(rows.map((r) => r.cp), rows.map((r) => r.ap));
    const fc = linearFit(rows.map((r) => r.cc), rows.map((r) => r.ac));
    this.pc.std = { rows, fit: { paracetamol: fp, caffeine: fc } };
    const P = PC.phases[this.pc.ratio];
    const ok = (P.tR[1] - P.tR[0]) / (4 * P.sigma) >= 1.5;
    const line = (f) => `y = ${fmt(f.b, 0)}x ${f.a >= 0 ? '+' : '−'} ${fmt(Math.abs(f.a), 0)}, R² = ${fmt(f.r2, 4)}`;
    const events = [{ type: 'machine', label: 'Dãy chuẩn', text: `5 vial: paracetamol 4,96–49,60 µg/mL, caffeine 0,938–9,38 µg/mL. Paracetamol ${line(fp)}; caffeine ${line(fc)}.` },
      { type: 'effect', label: 'So với tường trình', text: 'Tường trình của nhóm: paracetamol y = 95 843x + 76 438 (R² 0,997), caffeine y = 58 106x + 4 176 (R² 0,9985).' }];
    if (!ok) events.push({ type: 'warning', label: 'Pic chập', text: 'Với tỉ lệ pha động này hai pic chồng lên nhau: diện tích từng chất không tách được, đường chuẩn không dùng được.' });
    this.notebook.add({ day: '', experiment: 'HPLC', action: HPLC_ACTIONS['hplc-pc-std'], subject: this.pc.ratio, result: `b(par) ${fp.b.toFixed(0)}, b(caf) ${fc.b.toFixed(0)}` });
    return { ok, table: { head: ['Vial', 'Paracetamol (µg/mL)', 'Diện tích', 'Caffeine (µg/mL)', 'Diện tích'], rows: rows.map((r, i) => [String(i + 1), fmt(r.cp, 2), fmt(r.ap, 0), fmt(r.cc, 3), fmt(r.ac, 0)]) }, events, seconds: rows.length * 6.5 * 60 };
  }

  // spike: mẫu thêm chuẩn để tính hiệu suất thu hồi; dilution: số lần pha loãng dịch chiết trước khi tiêm
  pcSample({ spike = false, dilution = 20 }) {
    if (!this.pc?.std) return { ok: false, events: [{ type: 'warning', text: 'Tiêm dãy chuẩn trước.' }] };
    dilution = Number(dilution);
    const mg = Math.round((PC.weighMg + 0.3 * this.random.normal()) * 10) / 10; // cân phân tích đọc 0,1 mg
    const inFlask = Object.fromEntries(PC_NAMES.map((n) => [n, (this.pcTruth[n] * mg) / PC.tablet.mg + (spike ? PC.spike[n] : 0)])); // mg trong bình 25 mL
    const vial = Object.fromEntries(PC_NAMES.map((n) => [n, (inFlask[n] * 1000) / PC.flaskMl / dilution])); // µg/mL
    const areas = Object.fromEntries(PC_NAMES.map((n) => [n, this.#pcArea(n, vial[n])]));
    const top = { paracetamol: PC.std.paracetamol.at(-1), caffeine: PC.std.caffeine.at(-1) };
    const outside = PC_NAMES.filter((n) => vial[n] > top[n] * 1.02);
    const tr = this.#pcTrace(areas);
    this.pc.samples[spike ? 'spiked' : 'plain'] = { mg, dilution, areas, outside, inFlask };
    const ok = outside.length === 0 && tr.Rs >= 1.5;
    const events = [{ type: 'machine', label: spike ? 'Mẫu thêm chuẩn' : 'Mẫu viên thuốc', text: `Nghiền 10 viên, cân ${fmt(mg, 1)} mg bột${spike ? ', thêm 17,8 mg paracetamol và 2,3 mg caffeine chuẩn' : ''}, thêm 10 mL MeOH : đệm 95 : 5, siêu âm 15 phút, định mức 25 mL, lọc 0,45 µm, pha loãng ${dilution} lần. Diện tích: paracetamol ${fmt(areas.paracetamol, 0)}, caffeine ${fmt(areas.caffeine, 0)}.` }];
    if (outside.length) events.push({ type: 'warning', label: 'Ngoài đường chuẩn', text: `Diện tích ${outside.join(' và ')} lớn hơn chuẩn cao nhất của đường chuẩn: kết quả ngoại suy không được chấp nhận. Tường trình của nhóm đã pha loãng 20 lần thay vì 40 lần cho mẫu thêm chuẩn nên gặp đúng lỗi này (hiệu suất thu hồi báo cáo 51 % và 49 %).` });
    this.notebook.add({ day: '', experiment: 'HPLC', action: HPLC_ACTIONS['hplc-pc-sample'], subject: `${spike ? 'thêm chuẩn' : 'viên thuốc'}, pha loãng ${dilution}`, result: outside.length ? 'ngoài đường chuẩn' : 'trong đường chuẩn' });
    return { ok, pcTrace: tr.pts, peaks: tr.peaks, events, seconds: 6.5 * 60 };
  }

  pcCalc() {
    const S = this.pc?.samples;
    const F = this.pc?.std?.fit;
    if (!F || !S?.plain) return { ok: false, events: [{ type: 'warning', text: 'Cần đường chuẩn và mẫu viên thuốc.' }] };
    const conc = (n, smp) => (smp.areas[n] - F[n].a) / F[n].b; // µg/mL trong vial
    const perTablet = (n, smp) => (conc(n, smp) * smp.dilution * PC.flaskMl) / 1000 * (PC.tablet.mg / smp.mg); // mg/viên
    const rows = PC_NAMES.map((n) => [n, `${fmt(perTablet(n, S.plain), 1)} mg/viên`, `${PC.tablet[n]} mg (nhãn)`]);
    let ok = !S.plain.outside.length;
    const events = [{ type: 'machine', label: 'Hàm lượng', text: `Paracetamol ${fmt(perTablet('paracetamol', S.plain), 1)} mg/viên, caffeine ${fmt(perTablet('caffeine', S.plain), 1)} mg/viên (nhãn 500 và 65 mg). C(vial) = (diện tích − a)/b; × độ pha loãng × 25 mL × khối lượng viên/khối lượng cân.` }];
    if (S.spiked) {
      const rec = PC_NAMES.map((n) => {
        const found = (conc(n, S.spiked) * S.spiked.dilution * PC.flaskMl) / 1000 - (conc(n, S.plain) * S.plain.dilution * PC.flaskMl) / 1000 * (S.spiked.mg / S.plain.mg);
        return [n, (found / PC.spike[n]) * 100];
      });
      rows.push(...rec.map(([n, r]) => [`${n} thu hồi`, `${fmt(r, 1)} %`, '']));
      const bad = S.spiked.outside.length > 0;
      ok = ok && !bad && rec.every(([, r]) => Math.abs(r - 100) <= 5);
      events.push({ type: bad ? 'warning' : 'effect', label: 'Thu hồi', text: `Hiệu suất thu hồi: ${rec.map(([n, r]) => `${n} ${fmt(r, 1)} %`).join(', ')}.${bad ? ' Mẫu thêm chuẩn nằm ngoài khoảng đường chuẩn nên con số này không có giá trị; pha loãng 40 lần rồi tiêm lại.' : ' Gần 100 %: quy trình chiết và đường chuẩn cho kết quả đúng.'}` });
    } else events.push({ type: 'info', label: 'Thu hồi', text: 'Chưa tiêm mẫu thêm chuẩn.' });
    this.notebook.add({ day: '', experiment: 'HPLC', action: HPLC_ACTIONS['hplc-pc-calc'], subject: 'Panadol Extra', result: rows.map((r) => `${r[0]} ${r[1]}`).join('; ') });
    return { ok, table: { head: ['Chất', 'Kết quả', 'So sánh'], rows }, events };
  }

  // Sắc ký đồ của lần tiêm gần nhất để vẽ: [[phút, mAU]]
  trace(n = 300) {
    if (!this.last) return null;
    const { run, m } = this.last;
    return Array.from({ length: n + 1 }, (_, i) => {
      const t = (run.tEnd * i) / n;
      return [t, signalAt(t, run.peaks, m)];
    });
  }

  figureData() {
    const s = this.sample ? [{ name: 'caffeine', conc: +(this.truth.caffeine / 2).toFixed(1) }, { name: 'theobromine', conc: +(this.truth.theobromine / 2).toFixed(1) }] : [{ name: 'caffeine', conc: 50 }];
    return { organic: this.method.organic, flow: this.method.flow, sample: s };
  }
}
