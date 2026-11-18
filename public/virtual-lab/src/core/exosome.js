// Tách bóng ngoại bào (EV, exosome) từ huyết tương (data/exosome.json), bài 3 Proteomics của chủ dự án:
// ly tâm loại tế bào và mảnh tế bào, lọc 0,22 µm, sắc ký lọc gel Sepharose CL-4B 3 mL theo trọng lực, 20 phân đoạn
// 150 µL. Hạt lớn (EV) ra ở thể tích rỗng, lipoprotein và protein huyết tương ra sau theo đường kính thuỷ động.
// Kiểm tra bằng SDS-PAGE từng phân đoạn, NTA, Western blot marker (MISEV2018) và tỉ lệ hạt/µg protein (Webber 2013).
// Không phụ thuộc DOM.

import { rng } from './random.js';
import { Notebook } from './notebook.js';

export const EXO_ACTIONS = { 'exo-plasma': 'Chuẩn bị huyết tương', 'exo-column': 'Chạy cột Sepharose CL-4B', 'exo-sds': 'SDS-PAGE các phân đoạn', 'exo-pool': 'Gộp phân đoạn EV', 'exo-nta': 'Đo NTA', 'exo-wb': 'Western blot marker' };
const fmt = (x, d = 1) => (Math.round(x * 10 ** d) / 10 ** d).toFixed(d).replace('.', ',');
const exp10 = (x) => {
  const e = Math.floor(Math.log10(x));
  return `${fmt(x / 10 ** e, 1)}×10${String(e).replace(/[0-9-]/g, (c) => '⁰¹²³⁴⁵⁶⁷⁸⁹⁻'['0123456789-'.indexOf(c)])}`;
};
function erf(x) {
  const t = 1 / (1 + 0.3275911 * Math.abs(x));
  const y = 1 - ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x);
  return x >= 0 ? y : -y;
}
const cdf = (x, m, s) => 0.5 * (1 + erf((x - m) / (s * Math.SQRT2)));

export class ExosomeLab {
  constructor(data, { seed = Date.now() } = {}) {
    this.data = data;
    this.notebook = new Notebook();
    this.reset(seed);
  }

  reset(seed = Date.now()) {
    this.random = rng(seed);
    this.sample = null;
    this.fractions = null;
    this.pool = null;
    this.gel = null;
    this.notebook.clear();
  }

  do(action, params = {}) {
    const fn = { 'exo-plasma': () => this.plasma(params), 'exo-column': () => this.column(params), 'exo-sds': () => this.sds(params), 'exo-pool': () => this.poolFractions(params), 'exo-nta': () => this.nta(params), 'exo-wb': () => this.wb(params) }[action];
    if (!fn) throw new Error(`Không có thao tác "${action}"`);
    return { action, ...fn() };
  }

  // Huyết tương: ly tâm 1500 × g rồi 10000 × g, pha loãng 1:1 PBS, lọc 0,22 µm
  plasma({ ul = this.data.plasma.ul, spin2 = true, filter = true }) {
    const P = this.data.plasma;
    const D = this.data.debris;
    const v = Number(ul) / 1000;
    const n = (x) => x * Math.max(0.1, 1 + 0.08 * this.random.normal());
    // Tỉ lệ EV lớn hơn 220 nm bị lọc giữ lại (phân bố log-chuẩn)
    const over220 = 1 - cdf(Math.log(220), Math.log(P.sizeMedian), P.sizeSigma);
    const ev = n(P.evPerMl * v) * (filter ? 1 - over220 : 1);
    const debris = n(D.perMl * v) * (spin2 ? 0.05 : 1) * (filter ? 0.01 : 1);
    const mass = Object.fromEntries(this.data.species.filter((s) => s.mgMl).map((s) => [s.id, n(s.mgMl * Number(ul))])); // µg
    this.sample = { ul: Number(ul), loadUl: Number(ul) * 2, ev, debris, mass, filter };
    this.fractions = null;
    this.pool = null;
    const events = [{ type: 'machine', label: 'Huyết tương', text: `Máu chống đông EDTA ly tâm 1500 × g 5 phút${spin2 ? ', rồi 10000 × g 10 phút loại mảnh tế bào' : ''}; lấy ${ul} µL huyết tương pha loãng 1:1 với PBS${filter ? ', lọc qua màng 0,22 µm' : ''}.` }];
    if (!spin2) events.push({ type: 'warning', label: 'Bỏ bước', text: 'Không ly tâm 10000 × g: tiểu cầu và mảnh tế bào còn lại, ra cùng EV ở thể tích rỗng của cột.' });
    if (!filter) events.push({ type: 'warning', label: 'Bỏ bước', text: 'Không lọc 0,22 µm: hạt lớn hơn 220 nm (vi hạt, mảnh tế bào) vào cột và ra cùng phân đoạn EV.' });
    if (Number(ul) > 100) events.push({ type: 'warning', label: 'Nạp nhiều', text: `${ul * 2} µL mẫu chiếm ${fmt((ul * 2) / (this.data.column.bedMl * 10), 0)} % thể tích cột 3 mL: đỉnh doãng rộng, EV lẫn protein huyết tương.` });
    this.notebook.add({ day: 0, experiment: 'Tách EV', action: EXO_ACTIONS['exo-plasma'], subject: `${ul} µL`, result: filter ? 'đã lọc' : 'chưa lọc', spin2, filter });
    return { ok: spin2 && filter && Number(ul) <= 100, events };
  }

  // Thể tích rửa giải theo đường kính: Kav = 1 − ln(d/dMin)/ln(dMax/dMin), giới hạn 0–1
  ve(d) {
    const C = this.data.column;
    const kav = Math.min(1, Math.max(0, 1 - Math.log(d / C.dMin) / Math.log(C.dMax / C.dMin)));
    return C.voidMl + kav * (C.bedMl - C.voidMl);
  }

  column({ dry = false }) {
    if (!this.sample) return { ok: false, events: [{ type: 'warning', label: 'Chưa có mẫu', text: 'Chuẩn bị huyết tương trước.' }] };
    const C = this.data.column;
    const fv = C.fractionUl / 1000;
    const load = this.sample.loadUl / 1000;
    const sigma = Math.sqrt((C.sigmaMl * (dry ? 3 : 1)) ** 2 + load ** 2 / 12);
    const share = (ve) => Array.from({ length: C.fractions }, (_, i) => cdf((i + 1) * fv, ve, sigma) - cdf(i * fv, ve, sigma));
    const fr = Array.from({ length: C.fractions }, (_, i) => ({ n: i + 1, ev: 0, debris: 0, mass: {} }));
    const evShare = share(this.ve(this.data.species[0].d));
    const debShare = share(this.ve(this.data.debris.d));
    fr.forEach((f, i) => { f.ev = this.sample.ev * evShare[i]; f.debris = this.sample.debris * debShare[i]; });
    for (const s of this.data.species.filter((x) => x.mgMl)) {
      const sh = share(this.ve(s.d));
      fr.forEach((f, i) => { f.mass[s.id] = this.sample.mass[s.id] * sh[i]; });
    }
    this.fractions = fr;
    this.dry = dry;
    const protein = fr.map((f) => Object.values(f.mass).reduce((a, b) => a + b, 0));
    const peakEv = fr.reduce((a, f) => (f.ev > a.ev ? f : a)).n;
    const events = [{ type: 'machine', label: 'Sepharose CL-4B', text: `Nhồi gel 1 mL mỗi lần tới 3 mL${dry ? ', để mặt gel khô một lúc' : ''}, cân bằng PBS, nạp ${this.sample.loadUl} µL mẫu, thêm PBS và thu ${C.fractions} phân đoạn × ${C.fractionUl} µL theo trọng lực.` }];
    events.push({ type: 'effect', label: 'Phân bố', text: `EV nhiều nhất ở phân đoạn ${peakEv} (thể tích rỗng khoảng ${fmt(C.voidMl, 2)} mL); protein huyết tương tăng từ phân đoạn ${protein.findIndex((p) => p > 10) + 1}, albumin nhiều nhất ở phân đoạn ${this.#peakOf('ALB')}.` });
    if (dry) events.push({ type: 'warning', label: 'Cột khô', text: 'Gel bị khô tạo rãnh và bọt khí: dòng chảy không đều, các đỉnh doãng rộng gấp ba, EV lẫn protein.' });
    return { ok: !dry, events };
  }

  #peakOf(id) {
    return this.fractions.reduce((a, f) => (f.mass[id] > a.mass[id] ? f : a)).n;
  }

  // SDS-PAGE 10 %: 10 µL mỗi phân đoạn + 10 µL Laemmli 2x, nhuộm CBB R-250
  sds({ from = 6, to = 15 }) {
    if (!this.fractions) return { ok: false, events: [{ type: 'warning', label: 'Chưa chạy cột', text: 'Chạy cột trước.' }] };
    const C = this.data.column;
    const lim = this.data.stain.coomassieNg;
    const lanes = [];
    for (let k = Number(from); k <= Number(to); k++) {
      const f = this.fractions[k - 1];
      const bands = [];
      for (const s of this.data.species.filter((x) => x.mgMl)) {
        const ng = (f.mass[s.id] * 1000 * 10) / C.fractionUl;
        for (const [name, kDa] of s.bands) {
          const part = ng / s.bands.length;
          if (part >= lim) bands.push({ name, kDa, ng: part, w: Math.min(1, Math.log10(1 + part / lim) / 2.2) });
        }
      }
      lanes.push({ label: String(k), bands });
    }
    this.gel = { lanes, stain: 'coomassie', caption: `Gel 10 %, nhuộm CBB R-250; giếng ghi số phân đoạn, mỗi giếng 10 µL` };
    const empty = lanes.filter((l) => !l.bands.length).map((l) => l.label);
    const events = [{ type: 'machine', label: 'SDS-PAGE', text: `Gel 10 %, 10 µL phân đoạn ${from}–${to} + 10 µL Laemmli 2x, 180 V, cố định 15 phút, nhuộm CBB R-250 qua đêm, tẩy màu.` }];
    events.push({ type: 'effect', label: 'Ảnh gel', text: `${empty.length ? `Giếng ${empty.join(', ')} không có băng rõ: ít protein huyết tương, còn protein của EV quá ít để CBB nhuộm thấy (EV nhiều nhất ở phân đoạn ${this.fractions.reduce((a, f) => (f.ev > a.ev ? f : a)).n}). ` : ''}Các giếng sau có băng đậm dần: lipoprotein, IgM rồi protein huyết tương tự do ra khỏi cột.` });
    return { ok: true, gel: this.gel, events };
  }

  poolFractions({ from = 8, to = 10 }) {
    if (!this.fractions) return { ok: false, events: [{ type: 'warning', label: 'Chưa chạy cột', text: 'Chạy cột trước.' }] };
    const sel = this.fractions.slice(Number(from) - 1, Number(to));
    const ev = sel.reduce((a, f) => a + f.ev, 0);
    const debris = sel.reduce((a, f) => a + f.debris, 0);
    const plasmaUg = sel.reduce((a, f) => a + Object.values(f.mass).reduce((x, y) => x + y, 0), 0);
    const evUg = ev / this.data.plasma.evPerUgProtein;
    const ratio = (ev + debris) / (plasmaUg + evUg);
    const evShare = ev / Math.max(1, this.sample.ev);
    this.pool = { from: Number(from), to: Number(to), ev, debris, protein: plasmaUg + evUg, ratio, ul: sel.length * this.data.column.fractionUl };
    const cls = ratio > 3e10 ? 'tinh khiết cao' : ratio >= 2e9 ? 'tinh khiết thấp' : 'không tinh khiết (nhiều protein lẫn)';
    const events = [{ type: 'effect', label: 'Gộp', text: `Phân đoạn ${from}–${to} (${this.pool.ul} µL): ${exp10(ev)} EV (${fmt(evShare * 100, 0)} % số EV nạp vào), ${fmt(this.pool.protein, 1)} µg protein, tỉ lệ ${exp10(ratio)} hạt/µg: ${cls} theo Webber và Clayton 2013.` }];
    if (evShare < 0.5) events.push({ type: 'warning', label: 'Mất EV', text: 'Gộp chưa trùng vùng EV (thể tích rỗng): mất hơn một nửa số EV.' });
    if (plasmaUg > 50) events.push({ type: 'warning', label: 'Lẫn protein', text: 'Gộp cả phân đoạn có protein huyết tương: lipoprotein, IgM, albumin lẫn vào mẫu EV.' });
    else events.push({ type: 'info', label: 'Lưu ý', text: 'Sắc ký lọc gel huyết tương vẫn mang theo một ít lipoprotein (LDL, VLDL) cỡ gần EV; MISEV2018 khuyên báo cáo tỉ lệ hạt/protein và marker âm.' });
    this.notebook.add({ day: 0, experiment: 'Tách EV', action: EXO_ACTIONS['exo-pool'], subject: `${from}–${to}`, result: cls, ev, protein: this.pool.protein });
    return { ok: evShare >= 0.5 && plasmaUg <= 50, events };
  }

  // NTA: phân bố kích thước hạt trong mẫu gộp (EV log-chuẩn, mảnh tế bào lớn nếu không loại)
  nta() {
    if (!this.pool) return { ok: false, events: [{ type: 'warning', label: 'Chưa gộp', text: 'Gộp phân đoạn EV trước.' }] };
    const P = this.data.plasma;
    const N = 2000;
    const sizes = [];
    const total = this.pool.ev + this.pool.debris;
    for (let i = 0; i < N; i++) {
      if (this.random() < this.pool.debris / total) sizes.push(Math.exp(Math.log(this.data.debris.d) + 0.5 * this.random.normal()));
      else {
        let d;
        do d = Math.exp(Math.log(P.sizeMedian) + P.sizeSigma * this.random.normal()); while ((this.sample.filter && d > 220 && this.random() < 0.97) || d < 30);
        sizes.push(d);
      }
    }
    sizes.sort((a, b) => a - b);
    const mean = sizes.reduce((a, b) => a + b, 0) / N;
    const q = (p) => sizes[Math.floor(p * (N - 1))];
    // Cột 20 nm tới 400 nm; có hạt lớn thì cột 50 nm tới 1000 nm
    const [bw, nb] = q(0.99) > 400 ? [50, 20] : [20, 20];
    const bins = Array.from({ length: nb }, (_, i) => [i * bw + bw / 2, 0]);
    for (const d of sizes) { const b = Math.min(nb - 1, Math.floor(d / bw)); bins[b][1] += 1 / N; }
    const conc = total / (this.pool.ul / 1000);
    const events = [{ type: 'machine', label: 'NTA', text: `Pha loãng mẫu gộp trong PBS lọc, quay 5 đoạn video 60 giây: ${exp10(conc)} hạt/mL; trung bình ${fmt(mean, 0)} nm, D10 ${fmt(q(0.1), 0)} nm, D50 ${fmt(q(0.5), 0)} nm, D90 ${fmt(q(0.9), 0)} nm.` }];
    if (q(0.9) > 300) events.push({ type: 'warning', label: 'Hạt lớn', text: 'Có nhiều hạt lớn hơn 300 nm: mảnh tế bào, tiểu cầu hoặc vi hạt chưa được loại.' });
    else events.push({ type: 'info', label: 'So sánh', text: 'Dong et al. 2022 (tách bằng PEG, không lọc): trung bình 147,5 nm, khoảng 17,5–300 nm. Lọc 0,22 µm cắt bớt đuôi hạt lớn nên trung bình nhỏ hơn một chút.' });
    this.notebook.add({ day: 0, experiment: 'Tách EV', action: EXO_ACTIONS['exo-nta'], subject: 'mẫu gộp', result: `${fmt(mean, 0)} nm`, mean, d10: q(0.1), d90: q(0.9), conc });
    return { ok: q(0.9) <= 300, series: [{ name: 'phân bố', points: bins.map(([x, y]) => [x, y * 100]) }], mean, events };
  }

  // Western blot: marker dương CD63, CD81, TSG101; marker âm Calnexin (lưới nội chất, từ mảnh tế bào)
  wb() {
    if (!this.pool) return { ok: false, events: [{ type: 'warning', label: 'Chưa gộp', text: 'Gộp phân đoạn EV trước.' }] };
    const S = this.data.stain;
    const pos = this.pool.ev >= S.wbEv;
    const neg = this.pool.debris >= S.calnexinDebris;
    const rows = [['CD63', 'tetraspanin, màng EV', pos ? 'dương' : 'âm'], ['CD81', 'tetraspanin, màng EV', pos ? 'dương' : 'âm'], ['TSG101', 'ESCRT-I, trong lòng EV', pos ? 'dương' : 'âm'], ['Calnexin', 'lưới nội chất (marker âm)', neg ? 'dương' : 'âm']];
    const events = [{ type: 'machine', label: 'Western blot', text: 'Ly giải mẫu gộp trong đệm RIPA, SDS-PAGE, chuyển màng PVDF, ủ kháng thể CD63, CD81, TSG101, Calnexin, phát hiện ECL.' }];
    events.push({ type: pos && !neg ? 'effect' : 'warning', label: 'Kết luận', text: pos && !neg ? 'Có marker EV, không có Calnexin: mẫu là EV, không lẫn mảnh tế bào (MISEV2018).' : neg ? 'Calnexin dương: mẫu lẫn mảnh tế bào có lưới nội chất, chưa phải EV sạch.' : 'Marker EV yếu: mẫu gộp có quá ít EV.' });
    return { ok: pos && !neg, table: { head: ['Marker', 'Vị trí', 'Kết quả'], rows }, events };
  }
}
