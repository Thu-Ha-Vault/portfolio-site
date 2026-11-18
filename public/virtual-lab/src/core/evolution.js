// Tiến hoá và di truyền quần thể (data/finch.json): số liệu chim sẻ đất trung bình qua hạn hán 1977 (bài 03 Evolutionary
// Biology), thống kê mô tả, khoảng tin cậy 95 %, F-test, t-test hai mẫu, phương trình người chăn nuôi R = h²S; lồng ruồi
// giấm nhiều thế hệ (Wright–Fisher) với chọn lọc, phiêu bạt di truyền và kiểm định Hardy–Weinberg. Không phụ thuộc DOM.

import { rng } from './random.js';
import { Notebook } from './notebook.js';
import { ibeta, tTwoSided, fUpper, tCrit, describe } from './stats.js';

export const EV_ACTIONS = { 'ev-stats': 'Thống kê mô tả', 'ev-ttest': 'Kiểm định t', 'ev-breeder': 'Phương trình người chăn nuôi', 'ev-cage': 'Lồng ruồi nhiều thế hệ', 'ev-hwe': 'Kiểm định Hardy–Weinberg' };
const fmt = (x, d = 3) => (Math.round(x * 10 ** d) / 10 ** d).toFixed(d).replace('.', ',');

// Hàm phân phối và thống kê mô tả lấy từ stats.js (dùng chung cho mọi lõi)
export { ibeta, tTwoSided, fUpper, tCrit, describe };

export class EvolutionLab {
  constructor(data, { seed = Date.now() } = {}) {
    this.data = data;
    this.notebook = new Notebook();
    this.reset(seed);
  }

  reset(seed = Date.now()) {
    this.random = rng(seed);
    this.cage = null;
    this.last = null;
    this.notebook.clear();
  }

  do(action, params = {}) {
    const fn = { 'ev-stats': () => this.stats(params), 'ev-ttest': () => this.ttest(params), 'ev-breeder': () => this.breeder(params), 'ev-cage': () => this.runCage(params), 'ev-hwe': () => this.hwe(params) }[action];
    if (!fn) throw new Error(`Không có thao tác "${action}"`);
    return { action, ...fn() };
  }

  // Lấy n cá thể mỗi nhóm (n = 50: cả bộ số liệu; nhỏ hơn: chọn ngẫu nhiên theo seed để thấy ảnh hưởng của cỡ mẫu)
  #groups(n) {
    const pick = (rows) => {
      if (n >= rows.length) return rows;
      const r = [...rows];
      for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(this.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; }
      return r.slice(0, n);
    };
    return { non: pick(this.data.nonsurvivors), sur: pick(this.data.survivors) };
  }

  stats({ n = 50 }) {
    const g = this.#groups(Number(n));
    this.sample = g;
    const rows = [];
    const bars = [];
    this.data.traits.forEach(([id, name, unit], i) => {
      for (const [label, set] of [['Không sống sót', g.non], ['Sống sót', g.sur]]) {
        const d = describe(set.map((r) => r[i + 1]));
        rows.push([label, `${name} (${unit})`, fmt(d.mean), fmt(d.sd), fmt(d.sem), fmt(d.ci)]);
        bars.push({ trait: name, group: label, mean: d.mean, ci: d.ci, unit });
      }
    });
    this.bars = bars;
    this.notebook.add({ day: '', experiment: 'Chim sẻ Darwin', action: EV_ACTIONS['ev-stats'], subject: `n = ${n}`, result: rows.map((r) => `${r[0]} ${r[1]}: ${r[2]}`).join('; ') });
    return { ok: true, bars, table: { head: ['Nhóm', 'Đặc điểm', 'Mean', 'SD', 'SEM', '95 % CI (±)'], rows }, events: [{ type: 'machine', label: 'Số liệu', text: `${n} cá thể mỗi nhóm (sinh 1973–1976): nhóm chết trong hạn hán 1977 và nhóm còn sống năm 1978. SEM = SD/√n, 95 % CI = 1,96 × SEM.` }] };
  }

  // F-test (phương sai) rồi t-test hai mẫu, phương sai bằng nhau (như Excel, df = n1 + n2 − 2)
  ttest({ trait = 'beak', n = 50 }) {
    const g = this.sample && this.sample.non.length === Number(n) ? this.sample : this.#groups(Number(n));
    const i = this.data.traits.findIndex((t) => t[0] === trait);
    const [, name] = this.data.traits[i];
    const a = describe(g.non.map((r) => r[i + 1]));
    const b = describe(g.sur.map((r) => r[i + 1]));
    const F = a.var >= b.var ? a.var / b.var : b.var / a.var;
    // p hai phía như hàm F.TEST của Excel
    const pF = Math.min(1, 2 * fUpper(F, (a.var >= b.var ? a.n : b.n) - 1, (a.var >= b.var ? b.n : a.n) - 1));
    const df = a.n + b.n - 2;
    const sp = ((a.n - 1) * a.var + (b.n - 1) * b.var) / df;
    const t = (a.mean - b.mean) / Math.sqrt(sp * (1 / a.n + 1 / b.n));
    const p = tTwoSided(Math.abs(t), df);
    const tc = tCrit(df);
    const sig = Math.abs(t) > tc;
    this.last = { trait, t, p, pF, df, tc };
    this.notebook.add({ day: '', experiment: 'Chim sẻ Darwin', action: EV_ACTIONS['ev-ttest'], subject: name, result: sig ? 'có ý nghĩa' : 'không có ý nghĩa', t: fmt(t, 2), p: p.toExponential(2), pF: fmt(pF, 2) });
    return {
      ok: true, t, p, pF, significant: sig,
      events: [
        { type: 'machine', label: 'F-test', text: `F = ${fmt(F, 2)}, p = ${fmt(pF, 2)}: ${pF > 0.05 ? 'phương sai hai nhóm không khác biệt có ý nghĩa, dùng t-test giả định phương sai bằng nhau' : 'phương sai khác nhau, nên dùng t-test Welch'}.` },
        { type: 'machine', label: 't-test', text: `${name}: t = ${fmt(t, 2)} (không sống sót − sống sót), df = ${df}, p hai phía = ${p < 0.001 ? p.toExponential(1).replace('.', ',') : fmt(p, 4)}, t tới hạn = ${fmt(tc, 3)}.` },
        { type: sig ? 'effect' : 'info', label: 'Kết luận', text: sig ? `|t| > t tới hạn: bác bỏ H₀, ${name.toLowerCase()} của nhóm sống sót khác có ý nghĩa (lớn hơn) nhóm không sống sót.` : `|t| < t tới hạn: chưa bác bỏ được H₀, khác biệt ${name.toLowerCase()} có thể do ngẫu nhiên.` },
      ],
    };
  }

  // R = h²S: S là chênh lệch trung bình giữa nhóm sống sót (bố mẹ thế hệ sau) và cả quần thể trước chọn lọc
  breeder({ trait = 'beak', h2 = null }) {
    const i = this.data.traits.findIndex((t) => t[0] === trait);
    const all = [...this.data.nonsurvivors, ...this.data.survivors].map((r) => r[i + 1]);
    const before = describe(all).mean;
    const after = describe(this.data.survivors.map((r) => r[i + 1])).mean;
    const S = after - before;
    const H = Number(h2 ?? this.data.h2.beak);
    const R = H * S;
    this.last = { S, R, H };
    return { ok: true, S, R, events: [
      { type: 'machine', label: 'Chọn lọc', text: `Trung bình trước hạn hán (100 con) ${fmt(before)} mm, của nhóm sống sót ${fmt(after)} mm: vi sai chọn lọc S = ${fmt(S)} mm.` },
      { type: 'effect', label: 'Dự đoán', text: `R = h²S = ${fmt(H, 2)} × ${fmt(S)} = ${fmt(R)} mm: thế hệ con (1978) có độ sâu mỏ trung bình khoảng ${fmt(before + R)} mm. Grant đo được thế hệ sau có mỏ sâu hơn khoảng 4 %.` },
    ] };
  }

  // Lồng ruồi Wright–Fisher: N con mỗi thế hệ, tần số alen a ban đầu q0; kiểu gen aa có sức sống 1 − s, Aa có 1 − h·s
  runCage({ q0 = 0.5, N = 100, gens = 20, s = 0, h = 0, cages = 3 }) {
    const series = [];
    const finals = [];
    for (let c = 0; c < Number(cages); c++) {
      let q = Number(q0);
      const pts = [[0, q]];
      let last = null;
      for (let g = 1; g <= Number(gens); g++) {
        const p = 1 - q;
        const wAA = 1;
        const wAa = 1 - Number(h) * Number(s);
        const waa = 1 - Number(s);
        const wbar = p * p * wAA + 2 * p * q * wAa + q * q * waa;
        const qSel = (p * q * wAa + q * q * waa) / wbar;
        // N cá thể mới, mỗi con nhận hai alen ngẫu nhiên từ vốn gen sau chọn lọc
        let counts = { AA: 0, Aa: 0, aa: 0 };
        let a = 0;
        for (let k = 0; k < Number(N); k++) {
          const x = (this.random() < qSel) + (this.random() < qSel);
          a += x;
          counts[['AA', 'Aa', 'aa'][x]]++;
        }
        q = a / (2 * Number(N));
        last = counts;
        pts.push([g, q]);
      }
      series.push({ name: `Lồng ${c + 1}`, points: pts });
      finals.push({ q, counts: last });
    }
    this.cage = { finals, N: Number(N), s: Number(s) };
    const lost = finals.filter((f) => f.q === 0 || f.q === 1).length;
    const events = [{ type: 'machine', label: 'Lồng ruồi', text: `${cages} lồng, mỗi thế hệ ${N} ruồi, ${gens} thế hệ, tần số alen a ban đầu ${fmt(q0, 2)}${Number(s) ? `, ruồi aa giảm sức sống ${fmt(Number(s) * 100, 0)} %` : ''}.` }];
    events.push({ type: 'effect', label: 'Kết quả', text: `Tần số alen a cuối: ${finals.map((f) => fmt(f.q, 2)).join('; ')}.${lost ? ` ${lost} lồng đã mất hẳn một alen (cố định).` : ''}${Number(s) ? ' Chọn lọc chống aa làm q giảm dần, chậm khi q nhỏ vì alen lặn ẩn trong dị hợp.' : Number(N) <= 20 ? ' Quần thể nhỏ: phiêu bạt di truyền làm tần số dao động mạnh, các lồng đi các hướng khác nhau.' : ' Không chọn lọc, quần thể lớn: tần số gần như không đổi.'}` });
    this.notebook.add({ day: '', experiment: 'Lồng ruồi', action: EV_ACTIONS['ev-cage'], subject: `N ${N}, s ${s}`, result: finals.map((f) => fmt(f.q, 2)).join(' ') });
    return { ok: true, series, events };
  }

  // Hardy–Weinberg ở thế hệ cuối của lồng 1: χ² 1 bậc tự do
  hwe({ cage = 1 }) {
    if (!this.cage) return { ok: false, events: [{ type: 'warning', text: 'Chưa nuôi lồng ruồi.' }] };
    const f = this.cage.finals[Number(cage) - 1];
    const n = f.counts.AA + f.counts.Aa + f.counts.aa;
    const q = (f.counts.Aa + 2 * f.counts.aa) / (2 * n);
    const p = 1 - q;
    const exp = [p * p * n, 2 * p * q * n, q * q * n];
    const obs = [f.counts.AA, f.counts.Aa, f.counts.aa];
    const chi = exp.reduce((s, e, i) => s + (e > 0 ? (obs[i] - e) ** 2 / e : 0), 0);
    const pv = tTwoSided(Math.sqrt(chi), 1e6); // χ² một bậc tự do = bình phương của biến chuẩn
    const ok = chi < 3.841;
    return { ok: true, chi, table: { head: ['Kiểu gen', 'Quan sát', 'Kỳ vọng HW'], rows: ['AA', 'Aa', 'aa'].map((g, i) => [g, String(obs[i]), fmt(exp[i], 1)]) }, events: [{ type: ok ? 'effect' : 'warning', label: 'χ²', text: `χ² = ${fmt(chi, 2)} (1 bậc tự do, tới hạn 3,841, p ≈ ${fmt(Math.max(0, pv), 3)}): ${ok ? 'phù hợp cân bằng Hardy–Weinberg' : 'lệch khỏi cân bằng Hardy–Weinberg'}.` }] };
  }
}
