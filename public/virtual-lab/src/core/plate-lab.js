// Máy đọc vi đĩa (Agilent BioTek Epoch 2): định lượng protein bằng Bradford hoặc p-nitrophenol trên đĩa 96 giếng.
// Dãy chuẩn lặp ba ở cột 1–3, 24 mẫu lặp ba ở cột 4–12; đọc, trừ mẫu trắng, dựng đường chuẩn, nội suy.
// Số đo, nhiễu, ánh sáng lạc, OVRFLW, dáng đường chuẩn Bradford và khoảng tuyến tính 125–1 000 µg/mL (Bio-Rad Quick
// Start, manual 4110065A) lấy từ figures/platereader/model.mjs. Không phụ thuộc DOM.

import { bradfordPlate, pnpPlate, analyse, formatOD, BRADFORD, PNP, SPEC } from '../../figures/platereader/model.mjs';
import { rng } from './random.js';
import { Notebook } from './notebook.js';

export const PR_ACTIONS = { 'pr-plate': 'Pha đĩa', 'pr-read': 'Đọc đĩa', 'pr-analyse': 'Dựng đường chuẩn' };
export const PR_ASSAYS = {
  bradford: { name: 'Bradford (protein, 595 nm)', lambda: BRADFORD.lambda, unit: 'µg/mL', linear: BRADFORD.linear, std: 'BSA' },
  pnp: { name: 'p-nitrophenol (405 nm)', lambda: PNP.lambda, unit: 'µmol/L', linear: null, std: 'p-nitrophenol' },
};
const fmt = (v, d = 0) => (Number.isFinite(v) ? v.toFixed(d).replace('.', ',') : '—');

export class PlateLab {
  constructor({ seed = Date.now() } = {}) {
    this.notebook = new Notebook();
    this.reset(seed);
  }

  reset(seed = Date.now()) {
    this.random = rng(seed);
    this.plate = null;
    this.read = false;
    this.notebook.clear();
  }

  do(action, params = {}) {
    const fn = { 'pr-plate': () => this.pipette(params), 'pr-read': () => this.readPlate(params), 'pr-analyse': () => this.analyse(params) }[action];
    if (!fn) throw new Error(`Không có thao tác "${action}"`);
    return { action, ...fn() };
  }

  pipette({ assay = 'bradford' }) {
    const id = PR_ASSAYS[assay] ? assay : 'bradford';
    const seed = Math.floor(this.random() * 1e6);
    // Dịch chiết protein thường 100–1 400 µg/mL (minh hoạ): phần lớn trong khoảng tuyến tính, vài mẫu phải pha loãng
    const unknowns = id === 'bradford' ? Array.from({ length: 24 }, () => Math.round(100 + 1300 * this.random())) : undefined;
    this.plate = { id, ...(id === 'pnp' ? pnpPlate({ seed }) : bradfordPlate({ seed, unknowns })) };
    this.read = false;
    this.range = null;
    const a = PR_ASSAYS[id];
    const text = id === 'bradford'
      ? `Cột 1–3: dãy chuẩn ${a.std} ${BRADFORD.standards.join(', ')} µg/mL, lặp ba. Cột 4–12: 24 mẫu dịch chiết, lặp ba. Mỗi giếng ${BRADFORD.sample} µL mẫu + ${BRADFORD.dye} µL thuốc thử Coomassie G-250, ủ 5 phút ở nhiệt độ phòng.`
      : `Cột 1–3: dãy chuẩn p-nitrophenol ${PNP.standards.join(', ')} µmol/L, lặp ba. Cột 4–12: 24 mẫu, lặp ba. Mỗi giếng ${PNP.volume} µL trong đệm kiềm (pH ≥ 9,8).`;
    const events = [{ type: 'machine', label: 'Đĩa 96 giếng', text }];
    if (id === 'bradford') events.push({ type: 'effect', text: 'Coomassie G-250 tự do ở dạng cation đỏ nâu (hấp thụ 470 nm); khi gắn vào protein (chủ yếu qua arginine, lysine) chuyển sang dạng xanh hấp thụ cực đại 595 nm.' });
    this.notebook.add({ day: '', experiment: 'Máy đọc vi đĩa', action: PR_ACTIONS['pr-plate'], subject: a.name, result: '96 giếng' });
    return { ok: true, events };
  }

  readPlate() {
    if (!this.plate) return { ok: false, events: [{ type: 'warning', text: 'Chưa pha đĩa: khay trống.' }] };
    this.read = true;
    const a = PR_ASSAYS[this.plate.id];
    const vals = Object.values(this.plate.wells);
    const over = vals.filter((v) => v === Infinity).length;
    const events = [{ type: 'machine', label: `${a.lambda} nm`, text: `Đọc quét 96 giếng trong ${SPEC.sweep96} s: đèn xenon chớp, chùm sáng đi xuyên từng giếng tới photodiode, OD = log(I₀/I). Mẫu trắng (giếng chuẩn 0) trung bình ${formatOD(this.blankOf())} OD.` }];
    if (over) events.push({ type: 'warning', text: `${over} giếng vượt 4,0 OD (OVRFLW): pha loãng mẫu rồi đọc lại.` });
    this.notebook.add({ day: '', experiment: 'Máy đọc vi đĩa', action: PR_ACTIONS['pr-read'], subject: a.name, result: `${vals.length} giếng` });
    return { ok: true, events };
  }

  blankOf() {
    const z = Object.entries(this.plate.standards).filter(([, x]) => x === 0).map(([id]) => this.plate.wells[id]);
    return z.reduce((s, v) => s + v, 0) / Math.max(1, z.length);
  }

  analyse({ range = 'linear' }) {
    if (!this.plate || !this.read) return { ok: false, events: [{ type: 'warning', text: 'Chưa đọc đĩa nên chưa có số đo.' }] };
    const a = PR_ASSAYS[this.plate.id];
    const useLinear = range === 'linear' && a.linear;
    this.range = useLinear ? a.linear : null;
    const res = analyse(this.plate, useLinear ? { range: a.linear } : {});
    const top = useLinear ? a.linear[1] : res.range[1];
    const rows = res.samples.map((s) => {
      const truth = this.plate.truth[s.name];
      const out = s.out || !(s.c <= top);
      return { ...s, truth, out, err: out ? null : (s.c / truth - 1) * 100 };
    });
    const inside = rows.filter((r) => r.err !== null);
    const mae = inside.reduce((t, r) => t + Math.abs(r.err), 0) / Math.max(1, inside.length);
    const events = [{ type: res.fit.r2 >= 0.99 ? 'effect' : 'warning', label: 'Đường chuẩn', text: `A − A(trắng) = ${fmt(res.fit.slope * 1000, 3)} × 10⁻³ · C + ${fmt(res.fit.intercept, 3)}, R² = ${res.fit.r2.toFixed(4).replace('.', ',')} (${useLinear ? `chỉ dùng chuẩn ${a.linear[0]}–${a.linear[1]} ${a.unit}` : 'cả dãy chuẩn'}).` }];
    events.push({ type: mae <= 10 ? 'effect' : 'warning', label: 'Sai số', text: `${inside.length} mẫu nằm trong dãy chuẩn: sai số trung bình so với nồng độ thật ${fmt(mae, 1)} %.` });
    const outN = rows.length - inside.length;
    if (outN) events.push({ type: 'warning', text: `${outN} mẫu nằm ngoài khoảng đường chuẩn (trên ${top} ${a.unit} hoặc OVRFLW): pha loãng rồi đo lại, không ngoại suy.` });
    if (this.plate.id === 'bradford' && !useLinear) events.push({ type: 'warning', text: 'Đường Bradford cong ở nồng độ cao (thuốc nhuộm tự do cạn dần), nên fit tuyến tính cả dãy 0–2 000 µg/mL làm sai số lớn ở hai đầu. Bio-Rad khuyên dùng khoảng tuyến tính 125–1 000 µg/mL.' });
    this.notebook.add({ day: '', experiment: 'Máy đọc vi đĩa', action: PR_ACTIONS['pr-analyse'], subject: a.name, result: `R2 ${res.fit.r2.toFixed(4)}`, range: useLinear ? 'linear' : 'all', mean_error_pct: mae.toFixed(1) });
    const table = { head: ['Mẫu', 'OD', `Đo (${a.unit})`, `Thật (${a.unit})`], rows: rows.slice(0, 8).map((r) => [r.name, formatOD(r.A), r.out ? 'ngoài dãy' : fmt(r.c), fmt(r.truth)]) };
    return { ok: true, events, table, fit: res.fit, points: res.points.filter(([x]) => !useLinear || x === 0 || (x >= a.linear[0] && x <= a.linear[1])), mae, unit: a.unit };
  }

  figureData() {
    if (!this.plate || !this.read) return null;
    const a = PR_ASSAYS[this.plate.id];
    const wells = Object.fromEntries(Object.entries(this.plate.wells).map(([k, v]) => [k, v === Infinity ? 'OVRFLW' : +v.toFixed(3)]));
    // Đường chuẩn trên hình dùng đúng các chuẩn người dùng đã chọn để fit
    const r = this.range;
    const standards = Object.fromEntries(Object.entries(this.plate.standards).filter(([, x]) => !r || x === 0 || (x >= r[0] && x <= r[1])));
    return { lambda: a.lambda, assay: this.plate.id, unit: a.unit, name: a.name, wells, standards, samples: this.plate.samples };
  }
}
