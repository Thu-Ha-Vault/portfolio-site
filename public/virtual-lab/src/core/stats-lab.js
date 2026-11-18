// Bảng phân tích số liệu (data/stats.json): nạp bộ số liệu bài tập Biostatistics, sổ thí nghiệm của một lõi hoặc CSV dán
// vào; thống kê mô tả, khoảng tin cậy, kiểm định t, F, χ², ANOVA một nhân tố, hồi quy (tuyến tính, đa thức, hyperbol,
// mũ) với đầu ra như Excel; mỗi phép tính kèm đoạn mã R tương đương để kiểm lại. Không phụ thuộc DOM.

import { Notebook } from './notebook.js';
import { describe, ciMean, ciVar, ftest, ttest2, ttestPaired, anova1, chi2Table, correlation, fitModel, chi2Inv, fitMM, fitLL4, ll4, edY } from './stats.js';

export const ST_ACTIONS = { 'st-load': 'Nạp bộ số liệu', 'st-paste': 'Dán số liệu CSV', 'st-describe': 'Thống kê mô tả', 'st-ci': 'Khoảng tin cậy', 'st-ttest': 'Kiểm định t', 'st-anova': 'ANOVA một nhân tố', 'st-chi2': 'Kiểm định χ²', 'st-regress': 'Hồi quy' };
const f = (x, d = 3) => (Number.isFinite(x) ? (Math.abs(x) > 0 && Math.abs(x) < 10 ** -d ? x.toExponential(2).replace('.', ',') : (Math.round(x * 10 ** d) / 10 ** d).toFixed(d).replace('.', ',')) : '—');
const rvec = (xs) => `c(${xs.join(', ')})`;
const rname = (s) => s.replace(/[^A-Za-z0-9]+/g, '_').replace(/^_|_$/g, '') || 'x';
const MODELS = { linear: 'y = a + bx', poly2: 'đa thức bậc 2', poly3: 'đa thức bậc 3', poly4: 'đa thức bậc 4', hyper: 'y = a + b/x', exp: 'y = a·eᵇˣ', mm: 'Michaelis–Menten v = Vm·S/(K + S)', ll4: 'logistic 4 tham số (liều – đáp ứng)' };

// Tách CSV: dấu phẩy, chấm phẩy hoặc tab; số thập phân dùng dấu chấm (hoặc dấu phẩy khi phân cách bằng chấm phẩy/tab)
export function parseCSV(text) {
  const lines = String(text).trim().split(/\r?\n/).filter((l) => l.trim());
  if (!lines.length) return null;
  const sep = lines[0].includes('\t') ? '\t' : lines[0].includes(';') ? ';' : ',';
  const cells = lines.map((l) => l.split(sep).map((c) => c.trim()));
  const num = (c) => (c === '' ? NaN : Number(sep === ',' ? c : c.replace(',', '.')));
  const header = cells[0].some((c) => c !== '' && Number.isNaN(num(c)));
  const names = header ? cells[0] : cells[0].map((_, i) => `cột ${i + 1}`);
  const body = header ? cells.slice(1) : cells;
  const columns = names.map((name, j) => ({ name, values: body.map((r) => num(r[j] ?? '')).filter((v) => Number.isFinite(v)) })).filter((c) => c.values.length);
  return columns.length ? { id: 'csv', name: 'Số liệu dán vào', columns } : null;
}

export class StatsLab {
  constructor(data) {
    this.data = data;
    this.notebook = new Notebook();
    this.reset();
  }

  reset() {
    this.ds = null;
    this.notebook.clear();
  }

  do(action, params = {}) {
    const fn = { 'st-load': () => this.load(params), 'st-paste': () => this.paste(params), 'st-describe': () => this.describeCol(params), 'st-ci': () => this.ci(params), 'st-ttest': () => this.ttest(params), 'st-anova': () => this.anova(params), 'st-chi2': () => this.chi2(params), 'st-regress': () => this.regress(params) }[action];
    if (!fn) throw new Error(`Không có thao tác "${action}"`);
    if (action !== 'st-load' && action !== 'st-paste' && !this.ds) return { action, ok: false, events: [{ type: 'warning', label: 'Chưa có số liệu', text: 'Nạp một bộ số liệu trước.' }] };
    return { action, ...fn() };
  }

  columns() {
    return this.ds ? this.ds.columns.map((c, i) => [i, `${c.name} (n = ${c.values.length})`]) : [];
  }

  #col(i) {
    return this.ds.columns[Math.min(this.ds.columns.length - 1, Math.max(0, Number(i) || 0))];
  }

  // source: 'ex:<id>' (bài tập) hoặc 'nb:<tên>' với rows là các dòng sổ thí nghiệm (main.js truyền vào)
  load({ source = 'ex:height', rows = null, label = '' }) {
    if (source.startsWith('ex:')) {
      const d = this.data.datasets.find((x) => x.id === source.slice(3));
      if (!d) return { ok: false, events: [{ type: 'warning', text: `Không có bộ số liệu ${source}.` }] };
      this.ds = structuredClone(d);
    } else {
      const keys = [...new Set((rows ?? []).flatMap((r) => Object.keys(r)))].filter((k) => k !== 'day');
      const columns = keys.map((k) => ({ name: k, values: rows.map((r) => Number(r[k])).filter((v) => Number.isFinite(v)) })).filter((c) => c.values.length >= 2);
      if (!columns.length) return { ok: false, events: [{ type: 'warning', label: 'Sổ trống', text: `${label || 'Sổ thí nghiệm'} chưa có cột số nào đủ 2 giá trị. Làm thí nghiệm trước rồi nạp lại.` }] };
      this.ds = { id: source, name: label || source, columns };
    }
    return this.#loaded();
  }

  paste({ csv = '' }) {
    const d = parseCSV(csv);
    if (!d) return { ok: false, events: [{ type: 'warning', label: 'Không đọc được', text: 'Không tìm thấy cột số nào. Mỗi dòng một quan sát, các cột cách nhau bằng dấu phẩy, chấm phẩy hoặc tab.' }] };
    this.ds = d;
    return this.#loaded();
  }

  #loaded() {
    const d = this.ds;
    const events = [{ type: 'machine', label: 'Số liệu', text: `${d.name}: ${d.columns.map((c) => `${c.name} (${c.values.length})`).join(', ')}.` }];
    if (d.note) events.push({ type: 'info', label: 'Bài làm gốc', text: d.note });
    const n = Math.max(...d.columns.map((c) => c.values.length));
    const rows = Array.from({ length: Math.min(n, 12) }, (_, i) => [d.rows?.[i] ?? String(i + 1), ...d.columns.map((c) => (c.values[i] == null ? '' : f(c.values[i], 2)))]);
    return { ok: true, columns: this.columns(), table: { head: ['', ...d.columns.map((c) => c.name)], rows }, events };
  }

  describeCol({ col = 0 }) {
    const c = this.#col(col);
    const s = describe(c.values);
    const rows = [['n', String(s.n)], ['Trung bình', f(s.mean)], ['Trung vị', f(s.median)], ['Mode', s.mode == null ? 'không có' : f(s.mode)], ['Phương sai mẫu (VAR)', f(s.var)], ['Độ lệch chuẩn mẫu (STDEV)', f(s.sd)], ['Phương sai tổng thể (VARP)', f(s.varp)], ['Sai số chuẩn', f(s.sem)], ['P5', f(s.p5)], ['Min – max', `${f(s.min)} – ${f(s.max)}`], ['Độ lệch (SKEW)', f(s.skew)], ['Độ nhọn (KURT)', f(s.kurt)]];
    const x = rname(c.name);
    const r = `${x} <- ${rvec(c.values)}\nsummary(${x}); var(${x}); sd(${x})\nlibrary(e1071); skewness(${x}, type = 2); kurtosis(${x}, type = 2)`;
    this.notebook.add({ day: '', experiment: 'Phân tích', action: ST_ACTIONS['st-describe'], subject: c.name, result: `TB ${f(s.mean)}`, mean: s.mean, sd: s.sd, n: s.n });
    return { ok: true, stats: s, table: { head: ['Đại lượng', c.name], rows }, r, events: [{ type: 'effect', label: c.name, text: `n = ${s.n}; trung bình ${f(s.mean)} ± ${f(s.sd)} (độ lệch chuẩn mẫu).` }] };
  }

  // method: 't' (n − 1 bậc tự do) hoặc 'z' với độ lệch chuẩn tổng thể (STDEVP) như hàm CONFIDENCE trong bài tập
  ci({ col = 0, conf = 0.95, method = 't' }) {
    const c = this.#col(col);
    const s = describe(c.values);
    const m = ciMean(c.values, { conf: Number(conf), method, sd: method === 'z' ? s.sdp : null });
    const v = ciVar(c.values, { conf: Number(conf) });
    const pct = Math.round(Number(conf) * 100);
    const x = rname(c.name);
    const r = method === 'z' ? `${x} <- ${rvec(c.values)}\nn <- length(${x}); s <- sqrt(mean((${x} - mean(${x}))^2))\nmean(${x}) + c(-1, 1) * qnorm(${1 - (1 - conf) / 2}) * s / sqrt(n)\n(n - 1) * var(${x}) / qchisq(c(${1 - (1 - conf) / 2}, ${(1 - conf) / 2}), n - 1)` : `${x} <- ${rvec(c.values)}\nt.test(${x}, conf.level = ${conf})$conf.int\nn <- length(${x}); (n - 1) * var(${x}) / qchisq(c(${1 - (1 - conf) / 2}, ${(1 - conf) / 2}), n - 1)`;
    const events = [{ type: 'effect', label: `KTC ${pct} %`, text: `Trung bình ${f(s.mean)}: (${f(m.lo)}; ${f(m.hi)}) theo ${method === 'z' ? `phân phối chuẩn, z = ${f(m.crit)}, độ lệch chuẩn tổng thể ${f(s.sdp)} (như CONFIDENCE của Excel)` : `phân phối t, ${s.n - 1} bậc tự do, t = ${f(m.crit)}`}. Phương sai ${f(s.var)}: (${f(v.lo)}; ${f(v.hi)}).` }];
    if (method === 'z' && s.n < 30) events.push({ type: 'warning', label: 'Mẫu nhỏ', text: `n = ${s.n} < 30: nên dùng phân phối t thay cho z.` });
    return { ok: true, mean: m, variance: v, r, events };
  }

  // kind: 'paired' | 'equal' | 'welch'; luôn kèm F-Test để chọn kiểu t như bài làm
  ttest({ a = 0, b = 1, kind = 'equal', alpha = 0.05 }) {
    const A = this.#col(a);
    const B = this.#col(b);
    if (kind === 'paired' && A.values.length !== B.values.length) return { ok: false, events: [{ type: 'warning', label: 'Không ghép cặp được', text: `${A.name} có ${A.values.length} giá trị, ${B.name} có ${B.values.length}: t ghép cặp cần hai cột dài bằng nhau.` }] };
    const F = ftest(A.values, B.values);
    const t = kind === 'paired' ? ttestPaired(A.values, B.values, { alpha }) : ttest2(A.values, B.values, { equalVar: kind === 'equal', alpha });
    const name = { paired: 't ghép cặp (Paired Two Sample for Means)', equal: 't hai mẫu, phương sai bằng nhau', welch: 't hai mẫu, phương sai khác nhau (Welch)' }[kind];
    const rows = [['Trung bình', f(t.meanA), f(t.meanB)], ['df', f(t.df, kind === 'welch' ? 2 : 0), ''], ['t Stat', f(t.t, 4), ''], ['P(T<=t) một phía', f(t.p1, 6), ''], ['t Critical một phía', f(t.crit1, 4), ''], ['P(T<=t) hai phía', f(t.p2, 6), ''], ['t Critical hai phía', f(t.crit2, 4), '']];
    if (kind === 'paired') rows.splice(1, 0, ['Pearson Correlation', f(t.r, 4), '']);
    if (t.pooled != null) rows.splice(1, 0, ['Pooled Variance', f(t.pooled, 4), '']);
    const reject = Math.abs(t.t) > t.crit2;
    const events = [{ type: 'machine', label: 'F-Test', text: `F = ${f(F.F, 3)}, p hai phía = ${f(F.p, 4)}: ${F.p > 0.05 ? 'phương sai hai tổng thể coi như bằng nhau' : 'phương sai khác nhau, nên dùng t Welch'}.` }];
    events.push({ type: 'effect', label: name, text: `|t| = ${f(Math.abs(t.t), 3)} ${reject ? '>' : '≤'} t tới hạn hai phía ${f(t.crit2, 3)} (α = ${alpha}): ${reject ? 'bác bỏ H₀, hai trung bình khác nhau có ý nghĩa' : 'chưa bác bỏ được H₀'} (p = ${f(t.p2, 6)}).` });
    if (kind === 'equal' && F.p <= 0.05) events.push({ type: 'warning', label: 'Chọn sai kiểu t', text: 'F-Test cho thấy phương sai khác nhau mà vẫn dùng t với phương sai bằng nhau.' });
    if (kind !== 'paired' && this.ds.paired) events.push({ type: 'warning', label: 'Chọn sai kiểu t', text: 'Hai cột là các cặp đo trên cùng ống/cá thể: phải dùng t ghép cặp. t độc lập bỏ qua tương quan giữa cặp nên kém nhạy.' });
    const x = rname(A.name);
    const y = rname(B.name);
    const r = `${x} <- ${rvec(A.values)}\n${y} <- ${rvec(B.values)}\nvar.test(${x}, ${y})\nt.test(${x}, ${y}${kind === 'paired' ? ', paired = TRUE' : kind === 'equal' ? ', var.equal = TRUE' : ''})`;
    this.notebook.add({ day: '', experiment: 'Phân tích', action: ST_ACTIONS['st-ttest'], subject: `${A.name} – ${B.name}`, result: `t = ${f(t.t, 3)}`, t: t.t, p: t.p2, kind });
    return { ok: !(kind === 'equal' && F.p <= 0.05) && !(kind !== 'paired' && this.ds.paired), test: t, f: F, table: { head: ['', A.name, B.name], rows }, r, events };
  }

  anova({ cols = 'all', alpha = 0.05 }) {
    const idx = cols === 'all' ? this.ds.columns.map((_, i) => i) : cols;
    const groups = idx.map((i) => this.#col(i));
    if (groups.length < 2) return { ok: false, events: [{ type: 'warning', text: 'ANOVA cần ít nhất hai nhóm (cột).' }] };
    const a = anova1(groups.map((g) => g.values), { alpha });
    const rows = [['Giữa các nhóm', f(a.ssb), String(a.dfb), f(a.msb), f(a.F, 4), f(a.p, 6), f(a.crit, 4)], ['Trong nhóm', f(a.ssw), String(a.dfw), f(a.msw), '', '', ''], ['Tổng', f(a.sst), String(a.dfb + a.dfw), '', '', '', '']];
    const best = a.groups.reduce((x, g, i) => (g.mean > a.groups[x].mean ? i : x), 0);
    const stable = a.groups.reduce((x, g, i) => (g.var < a.groups[x].var ? i : x), 0);
    const events = [{ type: 'effect', label: 'ANOVA', text: `F = ${f(a.F, 3)} ${a.F > a.crit ? '>' : '≤'} F tới hạn ${f(a.crit, 3)} (p = ${f(a.p, 6)}): ${a.F > a.crit ? 'bác bỏ H₀, các nhóm khác nhau có ý nghĩa' : 'chưa bác bỏ được H₀'}. Nhóm ${groups[best].name} có trung bình cao nhất (${f(a.groups[best].mean, 2)}); nhóm ${groups[stable].name} ổn định nhất (phương sai ${f(a.groups[stable].var, 2)}). Hệ số di truyền theo bài làm h² = 1 − 1/F = ${f(a.h2, 3)}.` }];
    const r = `d <- data.frame(y = c(${groups.map((g) => g.values.join(', ')).join(', ')}),\n  g = factor(rep(c(${groups.map((g) => `"${g.name}"`).join(', ')}), times = c(${groups.map((g) => g.values.length).join(', ')}))))\nsummary(aov(y ~ g, data = d))`;
    this.notebook.add({ day: '', experiment: 'Phân tích', action: ST_ACTIONS['st-anova'], subject: groups.map((g) => g.name).join(', '), result: `F = ${f(a.F, 3)}`, F: a.F, p: a.p });
    return { ok: true, anova: a, table: { head: ['Nguồn', 'SS', 'df', 'MS', 'F', 'P-value', 'F crit'], rows }, r, events };
  }

  // Bảng tần số r × c: các cột của bộ số liệu là cột của bảng, các dòng là hàng
  chi2() {
    const cols = this.ds.columns;
    const n = Math.min(...cols.map((c) => c.values.length));
    const table = Array.from({ length: n }, (_, i) => cols.map((c) => c.values[i]));
    if (n < 2 || cols.length < 2 || table.flat().some((v) => v < 0 || !Number.isInteger(v))) return { ok: false, events: [{ type: 'warning', label: 'Không phải bảng tần số', text: 'χ² cần bảng số đếm nguyên không âm, ít nhất 2 × 2.' }] };
    const x = chi2Table(table);
    const lv = [0.1, 0.05, 0.01].map((al) => [al, chi2Inv(al, x.df)]);
    const small = x.expected.flat().filter((e) => e < 5).length;
    const events = [{ type: 'effect', label: 'χ²', text: `χ² = ${f(x.chi2, 3)}, df = ${x.df}, p = ${f(x.p, 5)}. ${lv.map(([al, c]) => `${Math.round((1 - al) * 100)} %: χ² tới hạn ${f(c, 3)} → ${x.chi2 > c ? 'bác bỏ H₀' : 'chấp nhận H₀'}`).join('; ')}.` }];
    if (small) events.push({ type: 'warning', label: 'Tần số lý thuyết nhỏ', text: `${small} ô có tần số lý thuyết < 5: χ² kém chính xác, nên gộp nhóm hoặc dùng kiểm định chính xác Fisher.` });
    const rows = table.map((r, i) => [this.ds.rows?.[i] ?? String(i + 1), ...r.map((o, j) => `${o} (${f(x.expected[i][j], 1)})`)]);
    const r = `m <- matrix(c(${table.map((row) => row.join(', ')).join(', ')}), nrow = ${n}, byrow = TRUE)\nchisq.test(m, correct = FALSE)`;
    this.notebook.add({ day: '', experiment: 'Phân tích', action: ST_ACTIONS['st-chi2'], subject: this.ds.name, result: `χ² = ${f(x.chi2, 3)}`, chi2: x.chi2, p: x.p });
    return { ok: true, chi: x, table: { head: ['Quan sát (lý thuyết)', ...cols.map((c) => c.name)], rows }, r, events };
  }

  regress({ x = 0, y = 1, model = 'linear' }) {
    const X = this.#col(x);
    const Y = this.#col(y);
    const n = Math.min(X.values.length, Y.values.length);
    const xs = X.values.slice(0, n);
    const ys = Y.values.slice(0, n);
    if (model === 'mm' || model === 'll4') return this.#nonlinear(X, Y, xs, ys, model);
    const deg = model.startsWith('poly') ? Number(model.slice(4)) : 1;
    if (n < deg + 3) return { ok: false, events: [{ type: 'warning', label: 'Quá ít điểm', text: `${n} điểm không đủ cho ${MODELS[model]}.` }] };
    if (model === 'exp' && ys.some((v) => v <= 0)) return { ok: false, events: [{ type: 'warning', text: 'Mô hình mũ cần y > 0 (lấy ln y).' }] };
    const m = fitModel(xs, ys, model);
    const R = m.reg;
    const cor = correlation(xs, ys);
    const rows = R.coef.map((c) => [c.name, f(c.b, 6), f(c.se, 6), f(c.t, 4), f(c.p, 6), f(c.lo, 4), f(c.hi, 4)]);
    const eqText = model === 'exp' ? `${Y.name} = ${f(m.eq.a, 4)}·e^(${f(m.eq.b, 6)}·${X.name})` : `${Y.name} = ${R.coef.map((c, i) => `${i && c.b >= 0 ? '+ ' : i ? '− ' : ''}${f(i ? Math.abs(c.b) : c.b, 4)}${i ? `·${c.name.replace('x', X.name)}` : ''}`).join(' ')}`;
    const weak = R.coef.slice(1).filter((c) => c.p > 0.05).length;
    const events = [{ type: 'effect', label: MODELS[model], text: `${eqText}. R² = ${f(R.r2, 4)} (hiệu chỉnh ${f(R.adjR2, 4)}), F = ${f(R.F, 3)}, Significance F = ${f(R.sigF, 6)}. Tổng bình phương sai lệch so với số đo: ${f(m.sse, 4)}.` }];
    events.push({ type: 'info', label: 'Tương quan', text: `r = ${f(cor.r, 4)}; t_r = ${f(cor.t, 3)} ${Math.abs(cor.t) > cor.crit ? '>' : '≤'} t tới hạn ${f(cor.crit, 3)}: ${Math.abs(cor.t) > cor.crit ? 'tồn tại tương quan tuyến tính' : 'chưa chứng minh được tương quan tuyến tính'}.` });
    if (weak && R.sigF < 0.05) events.push({ type: 'warning', label: 'Hệ số không có ý nghĩa', text: `R² cao và Significance F nhỏ nhưng ${weak} hệ số có p > 0,05: phương trình chưa có ý nghĩa thống kê, thường gặp khi dùng đa thức bậc cao với ít điểm (bài học của Chương 5).` });
    const xr = rname(X.name);
    const yr = rname(Y.name);
    const form = { linear: `${yr} ~ ${xr}`, poly2: `${yr} ~ ${xr} + I(${xr}^2)`, poly3: `${yr} ~ ${xr} + I(${xr}^2) + I(${xr}^3)`, poly4: `${yr} ~ ${xr} + I(${xr}^2) + I(${xr}^3) + I(${xr}^4)`, poly5: `${yr} ~ poly(${xr}, 5, raw = TRUE)`, hyper: `${yr} ~ I(1/${xr})`, exp: `log(${yr}) ~ ${xr}` }[model];
    const r = `${xr} <- ${rvec(xs)}\n${yr} <- ${rvec(ys)}\nfit <- lm(${form})\nsummary(fit); anova(fit)\ncor.test(${xr}, ${yr})`;
    this.notebook.add({ day: '', experiment: 'Phân tích', action: ST_ACTIONS['st-regress'], subject: `${Y.name} theo ${X.name}`, result: MODELS[model], r2: R.r2, sse: m.sse });
    const lo = Math.min(...xs);
    const hi = Math.max(...xs);
    const pred = (v) => (model === 'exp' ? m.eq.a * Math.exp(m.eq.b * v) : model === 'hyper' ? R.coef[0].b + R.coef[1].b / v : R.coef.reduce((s, c, i) => s + c.b * v ** i, 0));
    const curve = Array.from({ length: 61 }, (_, i) => lo + ((hi - lo) * i) / 60).map((v) => [v, pred(v)]);
    return { ok: !(weak && R.sigF < 0.05), fit: m, points: xs.map((v, i) => [v, ys[i]]), curve, table: { head: ['', 'Coefficients', 'Standard Error', 't Stat', 'P-value', 'Lower 95%', 'Upper 95%'], rows }, r, events };
  }

  // Hồi quy phi tuyến: Michaelis–Menten hoặc logistic 4 tham số (gói drc), bình phương tối thiểu Levenberg–Marquardt
  #nonlinear(X, Y, xs, ys, model) {
    const n = xs.length;
    if (n < (model === 'mm' ? 4 : 6)) return { ok: false, events: [{ type: 'warning', label: 'Quá ít điểm', text: `${n} điểm không đủ cho ${MODELS[model]}.` }] };
    if (xs.some((v) => v < 0)) return { ok: false, events: [{ type: 'warning', text: 'Nồng độ (liều) phải không âm.' }] };
    const fit = model === 'mm' ? fitMM(xs, ys) : fitLL4(xs, ys);
    const c = Object.fromEntries(fit.coef.map((k) => [k.name, k.b]));
    const rows = fit.coef.map((k) => [k.name, f(k.b, 4), f(k.se, 4), f(k.t, 3), f(k.p, 6), f(k.lo, 4), f(k.hi, 4)]);
    const xr = rname(X.name);
    const yr = rname(Y.name);
    const events = [];
    let pred;
    let r;
    if (model === 'mm') {
      pred = (v) => (c.Vm * v) / (c.K + v);
      events.push({ type: 'effect', label: MODELS.mm, text: `Vm = ${f(c.Vm, 2)} ± ${f(fit.coef[0].se, 3)}, K = ${f(c.K, 4)} ± ${f(fit.coef[1].se, 4)}; sai số chuẩn dư ${f(fit.rse, 3)} với ${fit.df} bậc tự do. K là nồng độ cơ chất cho tốc độ bằng nửa Vm.` });
      r = `${xr} <- ${rvec(xs)}\n${yr} <- ${rvec(ys)}\nfit <- nls(${yr} ~ Vm * ${xr} / (K + ${xr}), start = list(Vm = ${f(Math.max(...ys), 0).replace(',', '.')}, K = 0.1))\nsummary(fit)`;
    } else {
      const b = c.b;
      const e = c['e (ED50)'];
      pred = (v) => ll4(v, [b, c.c, c.d, e]);
      const ed = [10, 50, 90].map((y) => [y, edY(b, e, y)]);
      events.push({ type: 'effect', label: MODELS.ll4, text: `f(x) = c + (d − c)/(1 + exp(b(ln x − ln e))): b = ${f(b, 3)}, c = ${f(c.c, 3)}, d = ${f(c.d, 3)}, ED50 = e = ${f(e, 4)}; ${ed.map(([y, v]) => `ED${y} = ${f(v, 4)}`).join(', ')}. Sai số chuẩn dư ${f(fit.rse, 3)} với ${fit.df} bậc tự do.` });
      r = `library(drc)\n${xr} <- ${rvec(xs)}\n${yr} <- ${rvec(ys)}\nfit <- drm(${yr} ~ ${xr}, fct = LL.4())\nsummary(fit)\nED(fit, c(10, 50, 90))`;
    }
    this.notebook.add({ day: '', experiment: 'Phân tích', action: ST_ACTIONS['st-regress'], subject: `${Y.name} theo ${X.name}`, result: MODELS[model], sse: fit.sse });
    const lo = Math.min(...xs);
    const hi = Math.max(...xs);
    const curve = Array.from({ length: 61 }, (_, i) => lo + ((hi - lo) * i) / 60).map((v) => [v, pred(v)]);
    return { ok: true, fit, points: xs.map((v, i) => [v, ys[i]]), curve, table: { head: ['', 'Estimate', 'Standard Error', 't value', 'P-value', 'Lower 95%', 'Upper 95%'], rows }, r, events };
  }
}
