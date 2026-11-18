// Real-time PCR (qPCR) với SYBR Green: pha đĩa (dãy chuẩn 10⁶ → 10² bản, mẫu chưa biết, NTC), chạy 40 chu kỳ,
// đường nóng chảy, dựng đường chuẩn và tính số bản của mẫu.
// Khuếch đại, Ct, trừ nền, ngưỡng, đường nóng chảy, dimer mồi lấy từ figures/qpcr/model.mjs (Bio-Rad CFX96 Touch,
// ngưỡng suy từ Cq 19,81 ở 10⁵ bản trong Bulletin 6093; hiệu suất nên 90–110 % theo manual SsoAdvanced 10031339).
// Giả định minh hoạ: mẫu chưa biết có 10^3,3–10^5,3 bản; mẫu lẫn chất ức chế (ví dụ heparin, phenol còn sót) có hiệu suất
// 0,75 thay vì 0,95; NTC bị nhiễm có khoảng 50 bản khuôn. Không phụ thuộc DOM.

import { runWell, standardCurve, THRESHOLD, QPCR, FLUOR, fmtCopies, runTimeline } from '../../figures/qpcr/model.mjs';
import { rng } from './random.js';
import { Notebook } from './notebook.js';

export const QPCR_ACTIONS = { 'qpcr-plate': 'Pha đĩa qPCR', 'qpcr-run': 'Chạy qPCR', 'qpcr-melt': 'Xem đường nóng chảy', 'qpcr-quant': 'Định lượng' };
export const STD_COPIES = [1e6, 1e5, 1e4, 1e3, 1e2];
const EFF = 0.95;
const EFF_INHIBITED = 0.75;
// Thời gian chạy cả chương trình (giây), tính một lần từ figures/qpcr/model.mjs
const RUN_SECONDS = runTimeline(QPCR).at(-1).t1;
const fmt = (v, d = 1) => (Number.isFinite(v) ? v.toFixed(d).replace('.', ',') : '—');
const sup = (n) => String(n).replace(/[0-9-]/g, (c) => '⁰¹²³⁴⁵⁶⁷⁸⁹'['0123456789'.indexOf(c)] ?? '⁻');

export class QpcrLab {
  constructor({ seed = Date.now() } = {}) {
    this.notebook = new Notebook();
    this.reset(seed);
  }

  reset(seed = Date.now()) {
    this.random = rng(seed);
    this.seed = Math.floor(this.random() * 1e6);
    this.truth = 10 ** (3.3 + 2 * this.random());
    this.wells = null;
    this.result = null;
    this.melted = false;
    this.notebook.clear();
  }

  do(action, params = {}) {
    const fn = { 'qpcr-plate': () => this.plate(params), 'qpcr-run': () => this.run(), 'qpcr-melt': () => this.melt(), 'qpcr-quant': () => this.quant() }[action];
    if (!fn) throw new Error(`Không có thao tác "${action}"`);
    return { action, ...fn() };
  }

  plate({ ntc = 'clean', sample = 'clean' }) {
    const wells = STD_COPIES.map((n) => ({ name: `Chuẩn 10${sup(Math.log10(n))}`, n0: n, eff: EFF, std: true }));
    wells.push({ name: 'Mẫu', n0: this.truth, eff: sample === 'inhibited' ? EFF_INHIBITED : EFF, unknown: true });
    if (ntc !== 'none') wells.push({ name: 'NTC', n0: ntc === 'contam' ? 50 : 0, ntc: true });
    this.wells = wells;
    this.result = null;
    this.melted = false;
    const events = [{ type: 'machine', label: 'Đĩa', text: `${wells.length} giếng × ${QPCR.volume} µL SYBR Green master mix: dãy chuẩn pha loãng 10 lần từ 10⁶ tới 10² bản, mẫu chưa biết${ntc === 'none' ? '' : ', NTC (nước thay khuôn)'}. Dán màng đĩa, ly tâm nhanh cho dung dịch xuống đáy giếng.` }];
    if (ntc === 'none') events.push({ type: 'warning', text: 'Không có giếng NTC: nếu thuốc thử bị nhiễm DNA hay mồi tạo dimer thì không có cách nào nhận ra.' });
    if (sample === 'inhibited') events.push({ type: 'info', text: 'Mẫu tách bằng bộ kit cũ, rửa cột chưa kỹ (có thể còn chất ức chế polymerase).' });
    this.notebook.add({ day: '', experiment: 'qPCR', action: QPCR_ACTIONS['qpcr-plate'], subject: `${wells.length} giếng`, result: `NTC ${ntc}, mẫu ${sample}` });
    return { ok: true, events };
  }

  run() {
    if (!this.wells) return { ok: false, events: [{ type: 'warning', text: 'Chưa pha đĩa: chưa có giếng nào để chạy.' }] };
    const runs = this.wells.map((w) => ({ ...w, run: runWell(w, { seed: this.seed }) }));
    this.result = runs;
    const events = [{ type: 'machine', label: 'Chương trình', text: `${QPCR.initial.T} °C ${QPCR.initial.s} s; ${QPCR.cycles} chu kỳ: ${QPCR.steps[0].T} °C ${QPCR.steps[0].s} s, ${QPCR.steps[1].T} °C ${QPCR.steps[1].s} s và đọc kênh FAM/SYBR. Ngưỡng ${Math.round(THRESHOLD)} RFU.` }];
    const table = { head: ['Giếng', 'Ct'], rows: runs.map((r) => [r.name, r.run.ct == null ? 'không lên' : fmt(r.run.ct, 2)]) };
    const ntc = runs.find((r) => r.ntc);
    if (ntc && ntc.run.ct != null) events.push({ type: 'warning', label: 'NTC', text: `Giếng NTC lên ở Ct ${fmt(ntc.run.ct, 1)}. Xem đường nóng chảy để biết đó là dimer mồi hay DNA nhiễm.` });
    else if (ntc) events.push({ type: 'effect', label: 'NTC', text: 'Giếng NTC không vượt ngưỡng sau 40 chu kỳ: thuốc thử sạch.' });
    events.push({ type: 'effect', text: 'Mỗi chu kỳ số bản nhân (1 + E) lần, nên giếng nhiều khuôn hơn 10 lần vượt ngưỡng sớm hơn khoảng 3,3 chu kỳ (E = 100 %). Ct tỉ lệ nghịch với log số bản ban đầu.' });
    for (const r of runs) this.notebook.add({ day: '', experiment: 'qPCR', action: QPCR_ACTIONS['qpcr-run'], subject: r.name, result: r.run.ct == null ? 'không lên' : r.run.ct.toFixed(2) });
    const series = runs.map((r) => ({ name: r.name, kind: r.ntc ? 'bad' : r.unknown ? 'alt' : 'main', legend: r.ntc ? 'NTC' : r.unknown ? 'Mẫu' : 'Dãy chuẩn', points: r.run.sub.map((v, c) => [c, v]).slice(1) }));
    // seconds: cả chương trình của máy (40 chu kỳ rồi nóng chảy 65 → 95 °C) theo tốc độ đổi nhiệt của hãng
    return { ok: true, events, table, series, threshold: THRESHOLD, seconds: RUN_SECONDS };
  }

  melt() {
    if (!this.result) return { ok: false, events: [{ type: 'warning', text: 'Chưa chạy qPCR nên chưa có đường nóng chảy.' }] };
    this.melted = true;
    const events = [{ type: 'machine', label: 'Nóng chảy', text: `${QPCR.melt.from} → ${QPCR.melt.to} °C, bước ${fmt(QPCR.melt.step)} °C, giữ ${QPCR.melt.s} s rồi đọc. Khi sợi đôi tách ra, SYBR Green rời DNA và tắt sáng: đỉnh của −dF/dT là Tm của sản phẩm.` }];
    const table = { head: ['Giếng', 'Đỉnh (°C)'], rows: this.result.map((r) => [r.name, r.run.peaks.length ? r.run.peaks.map((p) => fmt(p.T)).join(', ') : 'không có']) };
    const prodTm = FLUOR.product.Tm;
    for (const r of this.result.filter((x) => x.ntc)) {
      const pk = r.run.peaks[0];
      if (!pk) continue;
      if (Math.abs(pk.T - prodTm) < 2) events.push({ type: 'warning', label: 'NTC', text: `Đỉnh NTC ở ${fmt(pk.T)} °C trùng Tm sản phẩm: thuốc thử hoặc nước bị nhiễm DNA khuôn. Kết quả cả đĩa không tin được, phải pha lại với thuốc thử mới.` });
      else events.push({ type: 'info', label: 'NTC', text: `Đỉnh NTC ở ${fmt(pk.T)} °C, thấp hơn sản phẩm (${fmt(prodTm)} °C): dimer mồi, sản phẩm ngắn chỉ thắng được khi giếng không có khuôn. Không ảnh hưởng các giếng có Ct sớm.` });
    }
    const odd = this.result.filter((r) => !r.ntc && r.run.peaks.length > 1);
    events.push(odd.length ? { type: 'warning', text: `${odd.map((r) => r.name).join(', ')} có hơn một đỉnh: có sản phẩm phụ.` } : { type: 'effect', text: 'Các giếng có khuôn cho một đỉnh duy nhất: mồi đặc hiệu, tín hiệu SYBR Green đến từ đúng một sản phẩm.' });
    const series = this.result.map((r) => ({ name: r.name, kind: r.ntc ? 'bad' : r.unknown ? 'alt' : 'main', legend: r.ntc ? 'NTC' : r.unknown ? 'Mẫu' : 'Dãy chuẩn', points: r.run.melt.map((p) => [p.T, p.dF]) }));
    return { ok: true, events, table, series };
  }

  quant() {
    if (!this.result) return { ok: false, events: [{ type: 'warning', text: 'Chưa có Ct: pha đĩa và chạy qPCR trước.' }] };
    const std = this.result.filter((r) => r.std).map((r) => ({ n0: r.n0, ct: r.run.ct }));
    const curve = standardCurve(std);
    const unk = this.result.find((r) => r.unknown);
    const events = [];
    if (!curve) return { ok: false, events: [{ type: 'warning', text: 'Dãy chuẩn không đủ điểm có Ct để dựng đường chuẩn.' }] };
    const ok = curve.eff >= 0.9 && curve.eff <= 1.1 && curve.r2 >= 0.98;
    events.push({ type: ok ? 'effect' : 'warning', label: 'Đường chuẩn', text: `Ct = ${fmt(curve.slope, 2)} · log N₀ + ${fmt(curve.intercept, 2)}; E = 10^(−1/độ dốc) − 1 = ${fmt(curve.eff * 100, 1)} %, R² = ${curve.r2.toFixed(4).replace('.', ',')}. ${ok ? 'Đạt (E 90–110 %, R² ≥ 0,98).' : 'Không đạt: kiểm tra pha loãng dãy chuẩn.'}` });
    let result = null;
    if (unk?.run.ct == null) events.push({ type: 'warning', text: 'Mẫu không vượt ngưỡng: không định lượng được.' });
    else {
      result = 10 ** ((unk.run.ct - curve.intercept) / curve.slope);
      const err = (result / this.truth - 1) * 100;
      events.push({ type: Math.abs(err) <= 30 ? 'effect' : 'warning', label: 'Mẫu', text: `Ct ${fmt(unk.run.ct, 2)} → N₀ = 10^((Ct − b)/a) = ${fmtCopies(result)} bản. Thật ${fmtCopies(this.truth)} bản, sai số ${err >= 0 ? '+' : ''}${fmt(err, 0)} %.` });
      if (unk.eff < EFF) events.push({ type: 'warning', text: 'Mẫu có chất ức chế: hiệu suất trong giếng mẫu thấp hơn dãy chuẩn nên Ct muộn, số bản bị tính thiếu. Đường nóng chảy vẫn bình thường; muốn phát hiện phải pha loãng mẫu thử (Ct phải giảm đúng 3,3 khi pha loãng 10 lần) hoặc dùng chứng nội.' });
      else if (Math.abs(err) > 30) events.push({ type: 'info', text: 'Sai số đến từ biến động ngẫu nhiên của số bản khi hút mẫu và độ dốc đường chuẩn; làm lặp ba giếng mỗi mẫu sẽ giảm sai số.' });
    }
    const ntc = this.result.find((r) => r.ntc);
    if (!ntc) events.push({ type: 'warning', text: 'Không có NTC nên chưa loại trừ được nhiễm DNA.' });
    else if (ntc.n0 > 0) events.push({ type: 'warning', text: 'NTC bị nhiễm DNA khuôn: kết quả định lượng không được chấp nhận.' });
    this.notebook.add({ day: '', experiment: 'qPCR', action: QPCR_ACTIONS['qpcr-quant'], subject: 'Mẫu', result: result == null ? '—' : Math.round(result), efficiency: (curve.eff * 100).toFixed(1), r2: curve.r2.toFixed(4) });
    const points = this.result.filter((r) => r.std && r.run.ct != null).map((r) => [Math.log10(r.n0), r.run.ct]);
    return { ok: true, events, points, curve, result, unknown: unk?.run.ct != null && result ? [Math.log10(result), unk.run.ct] : null };
  }

  figureData() {
    const wells = (this.wells ?? []).map((w) => ({ name: w.name, n0: Math.round(w.n0), ...(w.n0 ? { eff: w.eff } : {}) }));
    return wells.length ? { wells, seed: this.seed } : null;
  }
}
