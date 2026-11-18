// Tinh sạch enzyme (data/purify.json): protease PQM từ nọc nhện Cupiennius salei theo Langenegger et al. 2018,
// bài 2 Enzymology của chủ dự án. Nọc thô → lọc gel (SEC) → trao đổi cation (CEX) → RP-HPLC; mỗi cột cho sắc ký đồ
// theo phân đoạn, người học đo hoạt độ FRET rồi chọn phân đoạn gộp; bảng tinh sạch tính hoạt độ riêng, độ sạch,
// hiệu suất. Mỗi nhóm protein là một đỉnh Gauss trên từng cột (vị trí và thu hồi hiệu chỉnh theo bảng của bài báo).
// Không phụ thuộc DOM.

import { rng } from './random.js';
import { Notebook } from './notebook.js';

export const PU_ACTIONS = { 'pu-venom': 'Chuẩn bị nọc thô', 'pu-column': 'Chạy cột sắc ký', 'pu-pool': 'Gộp phân đoạn', 'pu-assay': 'Đo hoạt độ FRET', 'pu-sds': 'SDS-PAGE các bước', 'pu-table': 'Bảng tinh sạch' };
const fmt = (x, d = 1) => (Math.round(x * 10 ** d) / 10 ** d).toFixed(d).replace('.', ',');
const sci = (x, e) => fmt(x / 10 ** e, 2);
const ORDER = ['crude', 'sec', 'cex', 'rp'];
const STEP_NAME = { crude: 'Nọc thô', sec: 'SEC', cex: 'CEX', rp: 'RP-HPLC' };

// Phần diện tích của đỉnh Gauss (tâm c, độ lệch w, theo đơn vị phân đoạn) rơi vào phân đoạn k (1-based)
function erf(x) {
  const t = 1 / (1 + 0.3275911 * Math.abs(x));
  const y = 1 - ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x);
  return x >= 0 ? y : -y;
}
const cdf = (x, c, w) => 0.5 * (1 + erf((x - c) / (w * Math.SQRT2)));
const share = (k, c, w) => cdf(k + 0.5, c, w) - cdf(k - 0.5, c, w);

export class PurifyLab {
  constructor(data, { seed = Date.now() } = {}) {
    this.data = data;
    this.notebook = new Notebook();
    this.reset(seed);
  }

  reset(seed = Date.now()) {
    this.random = rng(seed);
    this.sample = null;
    this.run = null;
    this.history = [];
    this.notebook.clear();
  }

  do(action, params = {}) {
    const fn = { 'pu-venom': () => this.venom(params), 'pu-column': () => this.column(params), 'pu-pool': () => this.pool(params), 'pu-assay': () => this.assay(params), 'pu-sds': () => this.sds(params), 'pu-table': () => this.table() }[action];
    if (!fn) throw new Error(`Không có thao tác "${action}"`);
    return { action, ...fn() };
  }

  #noise(cv) {
    return Math.max(0.05, 1 + cv * this.random.normal());
  }

  // Hoạt độ (mol l⁻¹ s⁻¹ (µL nọc)⁻¹) và protein (µg (µL nọc)⁻¹) đo được của một mẫu
  #measure(s) {
    const E = this.data.enzyme;
    const protein = Object.values(s.mass).reduce((a, b) => a + b, 0) * this.#noise(0.03);
    const act = E.specific * s.mass.P * s.active * this.#noise(0.05);
    return { protein, act, spec: act / protein };
  }

  #keep(step, s) {
    const m = this.#measure(s);
    this.history = this.history.filter((h) => ORDER.indexOf(h.step) < ORDER.indexOf(step));
    this.history.push({ step, mass: { ...s.mass }, ...m });
    return m;
  }

  venom({ ul = this.data.paper.venomUl }) {
    const mass = {};
    for (const sp of this.data.species) mass[sp.id] = sp.crude * this.#noise(sp.id === 'P' ? 0.15 : 0.06);
    this.sample = { step: 'crude', mass, active: 1, ul: Number(ul) };
    this.run = null;
    const m = this.#keep('crude', this.sample);
    const events = [
      { type: 'machine', label: 'Nọc thô', text: `${fmt(ul / 1000, 1)} mL nọc thô (khoảng ${Math.round(ul / 10)} lần vắt nọc), ly tâm loại cặn, giữ trên đá.` },
      { type: 'info', label: 'Đo', text: `Protein ${fmt(m.protein, 1)} µg/µL nọc; hoạt độ ${sci(m.act, -10)} ×10⁻¹⁰ mol l⁻¹ s⁻¹ (µL nọc)⁻¹; hoạt độ riêng ${fmt(m.spec / 1e-12, 1)} ×10⁻¹² (bài báo: 101,75 µg; 5,93; 5,8).` },
    ];
    this.notebook.add({ day: 0, experiment: 'Tinh sạch protease', action: PU_ACTIONS['pu-venom'], subject: 'nọc thô', result: `${fmt(m.protein, 1)} µg/µL`, protein: m.protein, activity: m.act });
    return { ok: true, events };
  }

  // Chạy một cột với mẫu hiện tại: phân bố từng nhóm protein theo phân đoạn
  column({ column = 'sec', pH = 5.0, loadSalt = 0 }) {
    if (!this.sample) return { ok: false, events: [{ type: 'warning', label: 'Chưa có mẫu', text: 'Chuẩn bị nọc thô trước.' }] };
    const C = this.data.columns[column];
    const n = C.fractions;
    const s = this.sample;
    const per = {};
    const events = [{ type: 'machine', label: STEP_NAME[column], text: '' }];
    const loadMg = (Object.values(s.mass).reduce((a, b) => a + b, 0) * s.ul) / 1000;
    let bindScale = 1;
    let rpWiden = 1;
    if (column === 'cex') {
      const bound = this.data.species.reduce((a, sp) => a + s.mass[sp.id] * this.#binds(sp, pH, loadSalt), 0);
      const boundMg = (bound * s.ul) / 1000;
      if (boundMg > C.capacityMg) bindScale = C.capacityMg / boundMg;
    }
    if (column === 'rp' && loadMg > C.capacityMg) rpWiden = Math.sqrt(loadMg / C.capacityMg);
    for (const sp of this.data.species) {
      const m = s.mass[sp.id] * sp[column].rec * this.#noise(0.04);
      const arr = new Array(n).fill(0);
      if (column === 'sec') {
        for (let k = 1; k <= n; k++) arr[k - 1] = m * share(k, sp.sec.c, sp.sec.w);
      } else if (column === 'cex') {
        const f = this.#binds(sp, pH, loadSalt) * bindScale;
        const c = C.washFractions + 1 + (sp.cex.salt ?? 0) / C.saltMax * (n - C.washFractions - 1);
        for (let k = 1; k <= n; k++) arr[k - 1] = m * ((1 - f) * share(k, 2, 0.8) + f * share(k, c, sp.cex.w));
      } else {
        const c = 1 + (sp.rp.acn / C.acnMax) * (n - 1);
        for (let k = 1; k <= n; k++) arr[k - 1] = m * share(k, c, sp.rp.w * rpWiden);
      }
      per[sp.id] = arr;
    }
    const active = column === 'cex' ? this.data.enzyme.cexActive : 1;
    const act = per.P.map((p) => p * active);
    const total = per.P.map((_, i) => this.data.species.reduce((a, sp) => a + per[sp.id][i], 0));
    const salt = column === 'cex' ? total.map((_, i) => (i < C.washFractions ? 0 : ((i - C.washFractions) / (n - C.washFractions - 1)) * C.saltMax)) : null;
    this.run = { column, name: C.name, n, per, act, total, salt, active, pool: null, input: s.step, ok: true };
    const peak = act.indexOf(Math.max(...act)) + 1;
    const ft = act.slice(0, 3).reduce((a, b) => a + b, 0) / Math.max(1e-12, act.reduce((a, b) => a + b, 0));
    events[0].text = `${C.name}: ${n} phân đoạn${column === 'sec' ? ` × ${fmt(C.fractionMl, 1)} mL` : ''}; nạp mẫu ${STEP_NAME[s.step]} (${fmt(loadMg, 1)} mg protein)${column === 'cex' ? `, đệm pH ${fmt(pH, 1)}${Number(loadSalt) ? `, mẫu có ${fmt(loadSalt, 2)} M NaCl` : ''}` : ''}. Đỉnh hoạt độ ở phân đoạn ${peak}.`;
    let ok = true;
    if (column === 'cex' && ft > 0.5) {
      ok = false;
      events.push({ type: 'warning', label: 'Không bám cột', text: `${fmt(ft * 100, 0)} % hoạt độ ra ngay ở phân đoạn rửa (1–3): ${Number(pH) >= this.data.enzyme.pI ? `ở pH ${fmt(pH, 1)} protease không còn tích điện dương nên không bám cột trao đổi cation` : Number(loadSalt) > 0 ? 'muối trong mẫu cạnh tranh chỗ bám, protease trôi qua cột' : 'cột quá tải'}.` });
    }
    if (bindScale < 1) { ok = false; events.push({ type: 'warning', label: 'Quá tải', text: `Protein bám cột vượt dung lượng khoảng ${C.capacityMg} mg (minh hoạ): chỉ ${fmt(bindScale * 100, 0)} % được giữ lại, phần còn lại trôi ra. Lọc gel trước để bỏ phần lớn độc tố.` }); }
    if (rpWiden > 1.3) { ok = false; events.push({ type: 'warning', label: 'Quá tải', text: `Nạp ${fmt(loadMg, 1)} mg lên cột C4 phân tích: đỉnh doãng rộng ${fmt(rpWiden, 1)} lần, chồng lên peptide tạp.` }); }
    if (s.step === 'crude' && column !== 'sec') events.push({ type: 'warning', label: 'Sai thứ tự', text: 'Bài báo lọc gel trước: bỏ phần lớn độc tố nhỏ (< 10 kDa) rồi mới trao đổi ion và RP-HPLC.' });
    this.run.ok = ok;
    events.push({ type: 'info', label: 'Tiếp theo', text: 'Đo hoạt độ FRET từng phân đoạn (đường hoạt độ trên sắc ký đồ) rồi gộp các phân đoạn có hoạt độ.' });
    return { ok, run: this.figureData(), events };
  }

  #binds(sp, pH, loadSalt) {
    if (sp.cex.salt == null) return 0;
    const charge = 1 / (1 + Math.exp(-(sp.cex.pI - Number(pH) - 0.5) / 0.3));
    const salt = 1 / (1 + (Number(loadSalt) / (0.6 * sp.cex.salt)) ** 4);
    return charge * salt;
  }

  // Gộp phân đoạn: 'auto' = các phân đoạn có hoạt độ ≥ 20 % đỉnh, 'wide' ≥ 2 %, 'narrow' = đỉnh ± 1, hoặc from–to
  poolRange({ mode = 'auto', from, to } = {}) {
    const a = this.run.act;
    const max = Math.max(...a);
    const peak = a.indexOf(max);
    if (mode === 'range') return [Math.max(1, Number(from)), Math.min(this.run.n, Number(to))];
    if (mode === 'narrow') return [Math.max(1, peak), Math.min(this.run.n, peak + 2)];
    const thr = (mode === 'wide' ? 0.02 : this.data.poolThreshold) * max;
    let lo = peak;
    let hi = peak;
    while (lo > 0 && a[lo - 1] >= thr) lo--;
    while (hi < a.length - 1 && a[hi + 1] >= thr) hi++;
    return [lo + 1, hi + 1];
  }

  pool(params = {}) {
    if (!this.run) return { ok: false, events: [{ type: 'warning', label: 'Chưa chạy cột', text: 'Chạy một cột sắc ký trước khi gộp phân đoạn.' }] };
    const [from, to] = this.poolRange(params);
    this.run.pool = [from, to];
    const mass = {};
    for (const sp of this.data.species) mass[sp.id] = this.run.per[sp.id].slice(from - 1, to).reduce((a, b) => a + b, 0);
    const step = this.run.column;
    this.sample = { step, mass, active: this.run.active, ul: this.sample.ul };
    const m = this.#keep(step, this.sample);
    const crude = this.history.find((h) => h.step === 'crude');
    const paper = this.data.paper.rows.find((r) => r.step === step);
    const events = [
      { type: 'machine', label: 'Gộp', text: `Gộp phân đoạn ${from}–${to} của ${STEP_NAME[step]}${step === 'rp' ? ', làm khô chân không để bỏ acetonitrile và TFA, hoà lại trong đệm' : ''}.` },
      { type: 'effect', label: STEP_NAME[step], text: `Protein ${fmt(m.protein, 3)} µg/µL nọc; hoạt độ ${sci(m.act, -10)} ×10⁻¹⁰; hoạt độ riêng ${fmt(m.spec / 1e-12, 1)} ×10⁻¹²; độ sạch ${crude ? fmt(m.spec / crude.spec, 0) : '—'} lần; hiệu suất ${crude ? fmt((m.act / crude.act) * 100, 1) : '—'} % (bài báo: ${fmt(paper.protein[0], 3)} µg; ${fmt(paper.act[0], 2)}; ${fmt(paper.spec[0], 1)}; ${paper.fold} lần).` },
    ];
    const pMax = Math.max(...this.run.act);
    const lost = this.run.act.reduce((a, v, i) => a + (i + 1 < from || i + 1 > to ? v : 0), 0) / Math.max(1e-12, this.run.act.reduce((a, b) => a + b, 0));
    if (lost > 0.3) events.push({ type: 'warning', label: 'Mất hoạt độ', text: `Bỏ ngoài ${fmt(lost * 100, 0)} % hoạt độ của cột: vùng gộp quá hẹp, hiệu suất giảm.` });
    if (params.mode === 'wide') events.push({ type: 'warning', label: 'Gộp rộng', text: 'Gộp cả phân đoạn có hoạt độ thấp: lẫn thêm nhiều protein tạp, độ sạch thấp hơn.' });
    if (pMax <= 0) events.push({ type: 'warning', label: 'Không có hoạt độ', text: 'Không phân đoạn nào có hoạt độ: kiểm tra lại điều kiện chạy cột.' });
    this.notebook.add({ day: 0, experiment: 'Tinh sạch protease', action: PU_ACTIONS['pu-pool'], subject: `${STEP_NAME[step]} ${from}–${to}`, result: `độ sạch ${crude ? fmt(m.spec / crude.spec, 0) : '—'}`, protein: m.protein, activity: m.act, specific: m.spec });
    return { ok: lost <= 0.3 && pMax > 0 && this.run.ok && params.mode !== 'wide', row: m, events };
  }

  // Đo FRET trên mẫu hiện tại: % cơ chất bị cắt so với đối chứng âm (đệm) và dương (trypsin)
  assay({ dilution = 1, minutes = 60, pH = 6.0, additive = 'none', controls = true, substrate = 'PQM' }) {
    if (!this.sample) return { ok: false, events: [{ type: 'warning', label: 'Chưa có mẫu', text: 'Chuẩn bị nọc thô trước.' }] };
    const E = this.data.enzyme;
    const A = this.data.assay;
    const add = E.additives[additive] ?? E.additives.none;
    const fpH = Math.exp(-(((Number(pH) - E.pHopt) / E.pHwidth) ** 2));
    const actTrue = E.specific * this.sample.mass.P * this.sample.active;
    const eqUl = A.sampleUl / Number(dilution);
    const rate = actTrue * eqUl * fpH * add.f;
    const S0 = (A.substrateUg * 1e-6) / A.substrateDa / (A.wellUl * 1e-6);
    const t = Number(minutes) * 60;
    const cleaved = Math.min(1, Math.max(0, (1 - Math.exp(-(rate * t) / S0)) + A.noise * 0.3 * this.random.normal()));
    const F = A.fneg + (A.fpos - A.fneg) * cleaved;
    const events = [{ type: 'machine', label: 'FRET', text: `${A.sampleUl} µL mẫu ${STEP_NAME[this.sample.step]}${Number(dilution) > 1 ? ` pha loãng ${dilution} lần` : ''} + 1,2 µg cơ chất ${substrate} trong 130 µL đệm pH ${fmt(pH, 1)}${additive !== 'none' ? `, ${add.name}` : ''}, ${minutes} phút, đo huỳnh quang 340/485 nm: ${Math.round(F)} RFU.` }];
    if (!controls) {
      events.push({ type: 'warning', label: 'Thiếu đối chứng', text: 'Không có giếng đối chứng âm (đệm) và dương (trypsin): không đổi được RFU sang % cơ chất bị cắt.' });
      return { ok: false, rfu: F, events };
    }
    const est = (cleaved * S0) / t / eqUl;
    events.push({ type: 'effect', label: 'Kết quả', text: `${fmt(cleaved * 100, 0)} % cơ chất bị cắt → hoạt độ ước tính ${sci(est, -10)} ×10⁻¹⁰ mol l⁻¹ s⁻¹ (µL nọc)⁻¹.` });
    if (cleaved > A.linearMax) events.push({ type: 'warning', label: 'Ngoài khoảng tuyến tính', text: `Cơ chất bị cắt quá ${fmt(A.linearMax * 100, 0)} %: tốc độ bị đánh giá thấp. Pha loãng mẫu hoặc rút ngắn thời gian.` });
    if (additive === 'AEBSF') events.push({ type: 'info', label: 'Chất ức chế', text: 'AEBSF gắn Ser ở trung tâm hoạt động: mất hoàn toàn hoạt độ, chứng tỏ đây là serine protease.' });
    if (additive === 'Zn') events.push({ type: 'info', label: 'Ion', text: 'Zn²⁺ 5 mM giảm hoạt độ khoảng 5 lần (bài báo); Ca²⁺, Mg²⁺ gần như không ảnh hưởng.' });
    if (fpH < 0.2) events.push({ type: 'warning', label: 'pH', text: `pH ${fmt(pH, 1)} xa tối ưu 6,0: protease gần như không hoạt động (bài báo: không hoạt động ở pH ≤ 4 hoặc ≥ 8).` });
    this.notebook.add({ day: 0, experiment: 'Tinh sạch protease', action: PU_ACTIONS['pu-assay'], subject: `${STEP_NAME[this.sample.step]} 1:${dilution}`, result: `${fmt(cleaved * 100, 0)} %`, pH, additive, minutes, rfu: Math.round(F) });
    return { ok: cleaved <= A.linearMax && (cleaved > 0.02 || add.f < 1), cleaved, estimate: est, events };
  }

  // SDS-PAGE 8–25 %, 10 µL mỗi bước (tương đương 10 µL nọc), nhuộm bạc hoặc Coomassie
  sds({ stain = 'silver' } = {}) {
    if (!this.history.length) return { ok: false, events: [{ type: 'warning', label: 'Chưa có mẫu', text: 'Chưa có bước nào để chạy gel.' }] };
    const limitNg = stain === 'silver' ? 1 : 10;
    const lanes = this.history.map((h) => ({
      label: STEP_NAME[h.step],
      bands: this.data.species
        .map((sp) => ({ name: sp.name, kDa: sp.kDa, ng: h.mass[sp.id] * 10 * 1000 }))
        .filter((b) => b.ng >= limitNg)
        .map((b) => ({ ...b, w: Math.min(1, Math.log10(1 + b.ng / limitNg) / 3) })),
    }));
    this.gel = { lanes, stain, caption: `Gel gradient 8–25 %, nhuộm ${stain === 'silver' ? 'bạc' : 'Coomassie'}; mỗi giếng tương đương 10 µL nọc ở từng bước` };
    const last = lanes.at(-1);
    const events = [{ type: 'machine', label: 'SDS-PAGE', text: `Gel gradient 8–25 %, mỗi giếng 10 µL, nhuộm ${stain === 'silver' ? 'bạc (khoảng 1 ng/băng)' : 'Coomassie (khoảng 10 ng/băng)'}.` }];
    events.push({ type: 'effect', label: last.label, text: last.bands.length === 1 && last.bands[0].kDa === 28 ? 'Một băng duy nhất hơi dưới 30 kDa: protease đã sạch (bài báo: MALDI-TOF 28 kDa).' : `${last.bands.length} băng: ${last.bands.map((b) => `${b.kDa} kDa`).join(', ') || 'không thấy băng'}.` });
    if (stain !== 'silver' && this.history.some((h) => h.step === 'rp')) events.push({ type: 'warning', label: 'Nhuộm', text: 'Coomassie không đủ nhạy cho lượng protease sau RP-HPLC (vài chục ng): bài báo dùng nhuộm bạc.' });
    return { ok: true, gel: this.gel, events };
  }

  table() {
    const crude = this.history.find((h) => h.step === 'crude');
    if (!crude) return { ok: false, events: [{ type: 'warning', label: 'Chưa có số liệu', text: 'Chuẩn bị nọc thô và đo trước.' }] };
    const rows = this.history.map((h) => {
      const p = this.data.paper.rows.find((r) => r.step === h.step);
      return [STEP_NAME[h.step], fmt(h.protein, 3), fmt(h.spec / 1e-12, 0), `${fmt(h.spec / crude.spec, 0)} (${p.fold})`, `${fmt((h.act / crude.act) * 100, 1)} (${fmt((p.act[0] / this.data.paper.rows[0].act[0]) * 100, 1)})`];
    });
    const last = this.history.at(-1);
    const events = [{ type: 'effect', label: 'Bảng tinh sạch', text: `Sau ${STEP_NAME[last.step]}: độ sạch ${fmt(last.spec / crude.spec, 0)} lần, hiệu suất ${fmt((last.act / crude.act) * 100, 1)} % (bài: 1097 lần, 23,6 %).` }];
    return { ok: last.step === 'rp', fold: last.spec / crude.spec, yield: (last.act / crude.act) * 100, table: { head: ['Bước', 'Protein µg/µL', 'Hoạt độ riêng ×10⁻¹²', 'Độ sạch (bài báo)', 'Hiệu suất % (bài báo)'], rows }, events };
  }

  // Dữ liệu cho hình FPLC (#run=): đường A280, hoạt độ, muối, vùng gộp
  figureData() {
    if (!this.run) return null;
    const r = this.run;
    const nTot = Math.max(...r.total) || 1;
    const nAct = Math.max(...r.act) || 1;
    const C = this.data.columns[r.column];
    return {
      step: r.column,
      column: r.name,
      fractions: r.n,
      a280: r.total.map((v) => +(v / nTot).toFixed(3)),
      activity: r.act.map((v) => +(v / nAct).toFixed(3)),
      salt: r.salt ? r.salt.map((v) => +(v / C.saltMax).toFixed(3)) : null,
      pool: r.pool,
    };
  }
}
