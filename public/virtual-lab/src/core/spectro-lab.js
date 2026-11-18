// Đo quang bằng máy quang phổ UV-Vis: đường chuẩn p-nitrophenol ở 405 nm và mẫu chưa biết nồng độ.
// Số liệu máy (ánh sáng lạc, độ đúng, độ lặp) và ε lấy từ figures/spectro/model.mjs (Shimadzu UV-1900i, Sigma-Aldrich).
// Sai số pha dãy chuẩn: mỗi nồng độ lệch ngẫu nhiên ±1 % (giả định cho pipet); mẫu chưa biết 30–300 µM (giả định)
// nên có khi vượt đường chuẩn và phải pha loãng. Không phụ thuộc DOM.

import { SAMPLES, epsilonAt, beerLambert, measure, linearLimit, strayAt, CUVETTE } from '../../figures/spectro/model.mjs';
import { rng } from './random.js';
import { Notebook } from './notebook.js';

// Dãy chuẩn của bài thực hành: A405 tới khoảng 1,85, nằm gọn trong dải tuyến tính (khác dãy minh hoạ 0–200 µM của hình)
export const STANDARDS = [0, 10e-6, 20e-6, 40e-6, 60e-6, 80e-6, 100e-6];

export const UV_ACTIONS = {
  'uv-blank': 'Đo mẫu trắng (về 0)',
  'uv-standards': 'Đo dãy chuẩn',
  'uv-unknown': 'Đo mẫu chưa biết',
  'uv-curve': 'Dựng đường chuẩn, tính nồng độ',
};

const fmt = (v, d = 3) => (Number.isFinite(v) ? v.toFixed(d).replace('.', ',') : '—');

// Hồi quy tuyến tính y = a + b·x, kèm R²
export function linearFit(xs, ys) {
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxy = 0;
  let sxx = 0;
  let syy = 0;
  for (let i = 0; i < n; i++) {
    sxy += (xs[i] - mx) * (ys[i] - my);
    sxx += (xs[i] - mx) ** 2;
    syy += (ys[i] - my) ** 2;
  }
  const b = sxy / sxx;
  return { a: my - b * mx, b, r2: syy ? (sxy * sxy) / (sxx * syy) : 1 };
}

export class SpectroLab {
  constructor({ seed = Date.now(), sample = 'pnp' } = {}) {
    this.notebook = new Notebook();
    this.reset(seed, sample);
  }

  reset(seed = Date.now(), sample = this.sampleId ?? 'pnp') {
    this.random = rng(seed);
    this.sampleId = sample;
    this.lambda = SAMPLES[sample].at;
    this.blanked = false;
    this.drift = 0.03 + this.random() * 0.05; // nền của cuvet và dung dịch đệm khi chưa đo mẫu trắng (giả định)
    this.unknownC = (30 + this.random() * 270) * 1e-6;
    this.standards = null;
    this.unknown = null;
    this.notebook.clear();
  }

  get sample() {
    return SAMPLES[this.sampleId];
  }

  setLambda(l) {
    this.lambda = l;
    this.blanked = false; // đổi bước sóng thì phải đo lại mẫu trắng
  }

  #read(c) {
    const A = beerLambert(epsilonAt(this.sampleId, this.lambda), CUVETTE.path, c) + (this.blanked ? 0 : this.drift);
    return measure(A, this.lambda, { rand: this.random });
  }

  #log(action, subject, result, extra = {}) {
    this.notebook.add({ day: '', experiment: 'UV-Vis', action: UV_ACTIONS[action], subject, result, lambda: this.lambda, ...extra });
  }

  do(action, params = {}) {
    if (params.lambda && params.lambda !== this.lambda) this.setLambda(params.lambda);
    const fn = {
      'uv-blank': () => this.blank(),
      'uv-standards': () => this.measureStandards(),
      'uv-unknown': () => this.measureUnknown(params.dilution ?? 1),
      'uv-curve': () => this.curve(),
    }[action];
    if (!fn) throw new Error(`Không có thao tác "${action}"`);
    return { action, ...fn() };
  }

  blank() {
    this.blanked = true;
    this.#log('uv-blank', 'đệm', '0');
    return {
      ok: true,
      events: [
        { type: 'machine', label: 'Mẫu trắng', text: `Cuvet chứa dung dịch đệm (không có ${this.sample.short}), đo ở ${this.lambda} nm: máy đặt A = 0.` },
        { type: 'effect', text: 'Mẫu trắng trừ đi phần hấp thụ của cuvet, dung môi và đệm, để A đo được chỉ còn của chất cần đo.' },
      ],
    };
  }

  measureStandards() {
    const rows = STANDARDS.map((c) => {
      const real = c * (1 + this.random.normal() * 0.01);
      const r = this.#read(real);
      return { c, A: r.A, over: r.over };
    });
    this.standards = { lambda: this.lambda, rows, blanked: this.blanked };
    const events = [
      { type: 'machine', label: 'Dãy chuẩn', text: rows.map((r) => `${fmt(r.c * 1e6, 0)} µM: ${fmt(r.A)}`).join(' · ') },
    ];
    if (!this.blanked) events.push({ type: 'warning', text: 'Chưa đo mẫu trắng ở bước sóng này: mọi số đọc đều cộng thêm phần hấp thụ của cuvet và đệm.' });
    const dist = Math.abs(this.lambda - this.sample.at);
    if (dist > 20) events.push({ type: 'warning', text: `Đo ở ${this.lambda} nm, xa cực đại hấp thụ ${this.sample.at} nm: ε nhỏ hơn nên độ nhạy kém và sai số tương đối lớn.` });
    this.#log('uv-standards', `${rows.length} chuẩn`, rows.map((r) => fmt(r.A)).join(' '));
    return { ok: true, events, table: this.#table(rows) };
  }

  measureUnknown(dilution) {
    const r = this.#read(this.unknownC / dilution);
    this.unknown = { A: r.A, dilution, lambda: this.lambda, over: r.over };
    const events = [{ type: 'machine', label: 'Mẫu chưa biết', text: `${dilution > 1 ? `pha loãng ${dilution} lần, ` : ''}A${this.lambda} = ${fmt(r.A)}.` }];
    if (r.over) events.push({ type: 'warning', text: 'Vượt dải đo của máy (4 Abs): pha loãng mẫu rồi đo lại.' });
    this.#log('uv-unknown', `pha loãng ${dilution}×`, fmt(r.A));
    return { ok: true, events };
  }

  curve() {
    if (!this.standards) return { events: [{ type: 'warning', text: 'Chưa đo dãy chuẩn.' }] };
    const pts = this.standards.rows;
    const fit = linearFit(pts.map((p) => p.c * 1e6), pts.map((p) => p.A));
    const events = [{ type: 'machine', label: 'Đường chuẩn', text: `A = ${fmt(fit.b, 5)} × C(µM) ${fit.a >= 0 ? '+' : '−'} ${fmt(Math.abs(fit.a), 4)}; R² = ${fmt(fit.r2, 5)}. Hệ số góc ứng với ε = ${fmt(fit.b * 1e6, 0)} L·mol⁻¹·cm⁻¹ (lý thuyết ${fmt(epsilonAt(this.sampleId, this.lambda), 0)}).` }];
    const lim = linearLimit(strayAt(this.lambda));
    if (pts.some((p) => p.A > lim)) events.push({ type: 'warning', text: `Có điểm chuẩn A > ${fmt(lim, 1)}: ánh sáng lạc làm số đọc thấp hơn thật, đường chuẩn mất tuyến tính.` });
    let result = null;
    if (!this.unknown) events.push({ type: 'info', text: 'Chưa đo mẫu chưa biết.' });
    else if (this.unknown.lambda !== this.standards.lambda) events.push({ type: 'warning', text: 'Mẫu chưa biết đo ở bước sóng khác với dãy chuẩn: không dùng chung đường chuẩn được.' });
    else {
      const cMeasured = ((this.unknown.A - fit.a) / fit.b) * this.unknown.dilution;
      const err = (cMeasured / (this.unknownC * 1e6) - 1) * 100;
      const top = Math.max(...pts.map((p) => p.A));
      result = cMeasured;
      events.push({ type: Math.abs(err) <= 3 ? 'effect' : 'warning', label: 'Nồng độ', text: `C = (A − a) / b × ${this.unknown.dilution} = ${fmt(cMeasured, 1)} µM. Nồng độ thật ${fmt(this.unknownC * 1e6, 1)} µM, sai số ${err >= 0 ? '+' : ''}${fmt(err, 1)} %.` });
      if (this.unknown.over || this.unknown.A > top * 1.02) events.push({ type: 'warning', text: `A của mẫu (${fmt(this.unknown.A)}) nằm ngoài dãy chuẩn (cao nhất ${fmt(top)}): kết quả là ngoại suy, không tin được. Pha loãng mẫu cho A rơi vào giữa dãy chuẩn rồi đo lại.` });
    }
    if (this.standards.blanked) events.push({ type: 'effect', text: 'Đường chuẩn gần đi qua gốc toạ độ vì đã trừ mẫu trắng.' });
    else events.push({ type: 'warning', text: `Không trừ mẫu trắng: đường chuẩn có hệ số tự do khoảng ${fmt(fit.a, 3)} (phần hấp thụ của cuvet và đệm).` });
    this.#log('uv-curve', 'đường chuẩn', `R2 ${fit.r2.toFixed(5)}`, { slope: fit.b.toFixed(6), intercept: fit.a.toFixed(5), unknown_uM: result?.toFixed(2) });
    return { ok: true, events, fit, points: pts, unknown: this.unknown, result };
  }

  #table(rows) {
    return { classes: rows.map((r) => ({ label: `${fmt(r.c * 1e6, 0)} µM`, n: fmt(r.A) })), unit: `A${this.lambda}`, total: rows.length, subject: 'chuẩn' };
  }

  // Dữ liệu cho hình máy quang phổ (#run)
  figureData() {
    const samples = [...(this.standards?.rows ?? []).map((r) => ({ name: `${fmt(r.c * 1e6, 0)} µM`, A: +r.A.toFixed(4) })), ...(this.unknown ? [{ name: 'Mẫu ?', A: +this.unknown.A.toFixed(4) }] : [])].slice(-6);
    return samples.length ? { lambda: this.lambda, samples } : null;
  }
}
