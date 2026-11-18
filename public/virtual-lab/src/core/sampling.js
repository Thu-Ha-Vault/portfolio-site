import { Notebook } from './notebook.js';
import { rng } from './random.js';
import { describe } from './stats.js';

// Ước lượng số lượng cá thể của quần thể bằng lấy mẫu: 26 cốc mọt, đếm mọt trong n cốc chọn ngẫu nhiên, tính x̄, s²,
// SE, khoảng μ = x̄ ± 1,96 SE, ước lượng P = x̄ · 26 và số mẫu cần lấy N = 25 s²/x̄² (độ chính xác D = 0,4), rồi so với
// số đếm toàn bộ. Theo báo cáo Cơ sở sinh thái học Bài 2 của chủ dự án (data/sampling.json). Không phụ thuộc DOM.

export const ECO_ACTIONS = {
  'eco-sample': 'Lấy mẫu, đếm mọt',
  'eco-count': 'Đếm toàn bộ các cốc',
};

const dec = (v, d = 2) => Number(v).toFixed(d).replace('.', ',');

export class EcoSampleLab {
  constructor(data) {
    this.data = data;
    this.reset();
  }

  reset(seed = 1) {
    this.random = rng(seed);
    this.notebook = new Notebook();
    this.samples = [];
    this.counted = false;
  }

  do(action, params = {}) {
    const fn = { 'eco-sample': () => this.sample(params), 'eco-count': () => this.count() }[action];
    if (!fn) throw new Error(`Không có thao tác "${action}"`);
    return { action, ...fn() };
  }

  get Q() { return this.data.cups.length; }

  // how: 'random' bốc thăm số cốc | 'pick' chọn cốc trông nhiều mọt (sai) | 'report' nhập số liệu của báo cáo
  sample({ n = 10, how = 'random' }) {
    n = Math.max(2, Math.min(this.Q, Number(n)));
    const cups = this.data.cups;
    let idx = [];
    let xs;
    if (how === 'report') {
      const R = this.data.report[String(n)];
      if (!R) return { ok: false, events: [{ type: 'warning', text: 'Báo cáo chỉ có mẫu 10 cốc và 8 cốc.' }] };
      xs = R.x.slice();
    } else if (how === 'pick') {
      idx = cups.map((x, i) => [x + this.random() * 2, i]).sort((a, b) => b[0] - a[0]).slice(0, n).map((p) => p[1]);
      xs = idx.map((i) => cups[i]);
    } else {
      const order = cups.map((_, i) => [this.random(), i]).sort((a, b) => a[0] - b[0]).slice(0, n).map((p) => p[1]);
      idx = order.sort((a, b) => a - b);
      xs = idx.map((i) => cups[i]);
    }
    const d = describe(xs);
    const sum = xs.reduce((a, b) => a + b, 0);
    const sumSq = xs.reduce((a, b) => a + b * b, 0);
    const se = Math.sqrt(d.var / n);
    const lo = d.mean - 1.96 * se;
    const hi = d.mean + 1.96 * se;
    const P = d.mean * this.Q;
    const N = (25 * d.var) / d.mean ** 2;
    this.samples.push({ n, how, mean: d.mean, P });
    const rows = xs.map((x, i) => [how === 'report' ? `${i + 1}` : `cốc ${idx[i] + 1}`, x, x * x]);
    rows.push(['Σ', sum, sumSq]);
    const events = [
      { type: 'machine', label: `${n} cốc`, text: `${how === 'random' ? `Bốc thăm ngẫu nhiên ${n} trong ${this.Q} cốc` : how === 'pick' ? `Chọn ${n} cốc trông nhiều mọt nhất` : `Số liệu ${n} cốc trong báo cáo`}, đếm mọt: x̄ = ${sum}/${n} = ${dec(d.mean)}; s² = [${sumSq} − ${sum}²/${n}]/${n - 1} = ${dec(d.var)}; SE = √(s²/n) = ${dec(se)}.` },
      { type: 'effect', label: 'Ước lượng', text: `Với độ tin cậy 95 %: ${dec(lo)} < μ < ${dec(hi)}. Số mọt ước lượng P = x̄ · ${this.Q} = ${dec(P, 1)} con. Số mẫu cần lấy để x̄ nằm trong ±40 % của μ: N = 25 s²/x̄² = ${dec(N, 1)} cốc.` },
    ];
    if (n < 10) events.push({ type: 'effect', label: 'Ghi chú', text: `Bài dùng z = 1,96; với mẫu nhỏ n = ${n}, phân phối t (${n - 1} bậc tự do) cho khoảng tin cậy rộng hơn.` });
    if (how === 'pick') events.push({ type: 'warning', label: 'Mẫu lệch', text: 'Chọn cốc theo ý thích (cốc nhiều mọt dễ thấy) làm mẫu không đại diện: x̄ cao hơn thật, ước lượng P bị thổi phồng. Mẫu phải chọn ngẫu nhiên.' });
    if (n <= 3) events.push({ type: 'warning', label: 'Quá ít mẫu', text: 'Quá ít cốc: phương sai ước lượng không ổn định, khoảng tin cậy rất rộng.' });
    if (how === 'report' && this.data.report[String(n)].note) events.push({ type: 'warning', label: 'Đối chiếu báo cáo', text: this.data.report[String(n)].note });
    this.#note(`${n} cốc, ${how === 'random' ? 'ngẫu nhiên' : how === 'pick' ? 'chọn theo ý' : 'số liệu bài'}`, `x̄ = ${dec(d.mean)}, P = ${dec(P, 1)}`);
    return { ok: how !== 'pick' && n > 3, mean: d.mean, variance: d.var, se, ci: [lo, hi], P, N, table: { head: ['Cốc', 'xᵢ', 'xᵢ²'], rows }, events };
  }

  count() {
    const total = this.data.cups.reduce((a, b) => a + b, 0);
    const mu = total / this.Q;
    this.counted = true;
    const events = [{ type: 'machine', label: 'Đếm toàn bộ', text: `Đếm cả ${this.Q} cốc được ${total} con mọt: μ = ${total}/${this.Q} = ${dec(mu)} con mỗi cốc (báo cáo ghi 10,57 do cắt bớt chữ số).` }];
    const rows = this.samples.map((s) => [`${s.n} cốc, ${s.how === 'random' ? 'ngẫu nhiên' : s.how === 'pick' ? 'chọn theo ý' : 'số liệu bài'}`, dec(s.mean), dec(s.P, 1), `${dec(((s.P - total) / total) * 100, 1)} %`]);
    if (rows.length) events.push({ type: 'effect', label: 'Sai số phương pháp', text: 'SS = (P − số thật)/số thật. Mẫu ngẫu nhiên đủ lớn cho P gần số thật; mẫu chọn theo ý lệch một phía.' });
    this.#note('toàn bộ', `${total} con`);
    return { ok: true, total, mu, table: rows.length ? { head: ['Mẫu', 'x̄', 'P', 'Sai số'], rows } : null, events };
  }

  #note(subject, result) {
    this.notebook.add({ day: '', experiment: 'Phương pháp lấy mẫu', action: 'Đếm mọt', subject, result });
  }
}
