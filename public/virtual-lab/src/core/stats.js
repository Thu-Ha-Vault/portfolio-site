// Thống kê dùng chung cho mọi lõi và bảng phân tích: hàm phân phối (t, F, χ², chuẩn), thống kê mô tả, khoảng tin cậy,
// kiểm định t, F, χ², ANOVA một nhân tố, tương quan, hồi quy tuyến tính bội (đầu ra như mục Regression của Excel),
// chỉ số đa dạng. Kết quả khớp các hàm Excel mà bài tập Biostatistics của chủ dự án dùng (VAR, STDEV, PERCENTILE,
// SKEW, KURT, CONFIDENCE, CHIINV, F.TEST, T.TEST, Data Analysis ToolPak). Không phụ thuộc DOM.
// Hàm gamma, beta không đầy đủ theo Numerical Recipes (mục 6.1–6.4); nghịch đảo phân phối chuẩn theo Acklam.

export function lgamma(x) {
  const g = [76.18009172947146, -86.50532032941677, 24.01409824083091, -1.231739572450155, 0.1208650973866179e-2, -0.5395239384953e-5];
  let y = x;
  const t = x + 5.5 - (x + 0.5) * Math.log(x + 5.5);
  let s = 1.000000000190015;
  for (const c of g) s += c / ++y;
  return -t + Math.log((2.5066282746310005 * s) / x);
}

function betacf(a, b, x) {
  let c = 1;
  let d = 1 - ((a + b) * x) / (a + 1);
  d = 1 / (Math.abs(d) < 1e-30 ? 1e-30 : d);
  let h = d;
  for (let m = 1; m <= 300; m++) {
    const m2 = 2 * m;
    let aa = (m * (b - m) * x) / ((a + m2 - 1) * (a + m2));
    d = 1 + aa * d; d = 1 / (Math.abs(d) < 1e-30 ? 1e-30 : d);
    c = 1 + aa / c; c = Math.abs(c) < 1e-30 ? 1e-30 : c;
    h *= d * c;
    aa = (-(a + m) * (a + b + m) * x) / ((a + m2) * (a + m2 + 1));
    d = 1 + aa * d; d = 1 / (Math.abs(d) < 1e-30 ? 1e-30 : d);
    c = 1 + aa / c; c = Math.abs(c) < 1e-30 ? 1e-30 : c;
    const del = d * c;
    h *= del;
    if (Math.abs(del - 1) < 3e-12) break;
  }
  return h;
}

// Hàm beta không đầy đủ chuẩn hoá I_x(a, b)
export function ibeta(x, a, b) {
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  const bt = Math.exp(lgamma(a + b) - lgamma(a) - lgamma(b) + a * Math.log(x) + b * Math.log(1 - x));
  return x < (a + 1) / (a + b + 2) ? (bt * betacf(a, b, x)) / a : 1 - (bt * betacf(b, a, 1 - x)) / b;
}

// Hàm gamma không đầy đủ Q(a, x) = 1 − P(a, x)
export function gammaQ(a, x) {
  if (x <= 0) return 1;
  if (x < a + 1) {
    let sum = 1 / a;
    let del = sum;
    let ap = a;
    for (let n = 0; n < 500; n++) {
      ap += 1;
      del *= x / ap;
      sum += del;
      if (Math.abs(del) < Math.abs(sum) * 1e-14) break;
    }
    return 1 - sum * Math.exp(-x + a * Math.log(x) - lgamma(a));
  }
  let b = x + 1 - a;
  let c = 1 / 1e-300;
  let d = 1 / b;
  let h = d;
  for (let i = 1; i < 500; i++) {
    const an = -i * (i - a);
    b += 2;
    d = an * d + b;
    if (Math.abs(d) < 1e-300) d = 1e-300;
    c = b + an / c;
    if (Math.abs(c) < 1e-300) c = 1e-300;
    d = 1 / d;
    const del = d * c;
    h *= del;
    if (Math.abs(del - 1) < 1e-14) break;
  }
  return Math.exp(-x + a * Math.log(x) - lgamma(a)) * h;
}

// ——— Phân phối ———
export const normCdf = (z) => (z >= 0 ? 1 - 0.5 * gammaQ(0.5, (z * z) / 2) : 0.5 * gammaQ(0.5, (z * z) / 2));
export function normInv(p) {
  const a = [-3.969683028665376e1, 2.209460984245205e2, -2.759285104469687e2, 1.38357751867269e2, -3.066479806614716e1, 2.506628277459239];
  const b = [-5.447609879822406e1, 1.615858368580409e2, -1.556989798598866e2, 6.680131188771972e1, -1.328068155288572e1];
  const c = [-7.784894002430293e-3, -3.223964580411365e-1, -2.400758277161838, -2.549732539343734, 4.374664141464968, 2.938163982698783];
  const d = [7.784695709041462e-3, 3.224671290700398e-1, 2.445134137142996, 3.754408661907416];
  const lo = 0.02425;
  if (p < lo) { const q = Math.sqrt(-2 * Math.log(p)); return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1); }
  if (p > 1 - lo) { const q = Math.sqrt(-2 * Math.log(1 - p)); return -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1); }
  const q = p - 0.5;
  const r = q * q;
  return ((((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q) / (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
}
// p hai phía của t; p phía phải của F và χ²
export const tTwoSided = (t, df) => ibeta(df / (df + t * t), df / 2, 0.5);
export const fUpper = (F, d1, d2) => (F <= 0 ? 1 : ibeta(d2 / (d2 + d1 * F), d2 / 2, d1 / 2));
export const chi2Upper = (x, df) => gammaQ(df / 2, x / 2);

// Tìm nghiệm của hàm giảm dần f(x) = p trên (lo, hi) bằng chia đôi
function solveDecreasing(f, p, lo, hi) {
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    if (f(mid) > p) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}
// Giá trị tới hạn: t hai phía (TINV), χ² phía phải (CHIINV), F phía phải (FINV)
export const tCrit = (df, alpha = 0.05) => solveDecreasing((t) => tTwoSided(t, df), alpha, 0, 1e3);
export const chi2Inv = (alpha, df) => solveDecreasing((x) => chi2Upper(x, df), alpha, 0, 1e4);
export const fInv = (alpha, d1, d2) => solveDecreasing((F) => fUpper(F, d1, d2), alpha, 0, 1e5);

// ——— Thống kê mô tả ———
const sum = (xs) => xs.reduce((a, b) => a + b, 0);
export const mean = (xs) => sum(xs) / xs.length;

// Phân vị kiểu PERCENTILE.INC của Excel (p từ 0 đến 1)
export function percentile(xs, p) {
  const s = [...xs].sort((a, b) => a - b);
  const h = (s.length - 1) * p;
  const lo = Math.floor(h);
  return s[lo] + (h - lo) * ((s[lo + 1] ?? s[lo]) - s[lo]);
}

export function describe(xs) {
  const n = xs.length;
  const m = mean(xs);
  const ss = xs.reduce((s, x) => s + (x - m) ** 2, 0);
  const v = ss / (n - 1);
  const sd = Math.sqrt(v);
  const sem = sd / Math.sqrt(n);
  const counts = new Map();
  for (const x of xs) counts.set(x, (counts.get(x) ?? 0) + 1);
  const top = Math.max(...counts.values());
  const mode = top > 1 ? [...counts.entries()].find(([, c]) => c === top)[0] : null;
  // SKEW và KURT của Excel (ước lượng không chệch theo cỡ mẫu)
  const z3 = xs.reduce((s, x) => s + ((x - m) / sd) ** 3, 0);
  const z4 = xs.reduce((s, x) => s + ((x - m) / sd) ** 4, 0);
  const skew = n > 2 ? (n / ((n - 1) * (n - 2))) * z3 : NaN;
  const kurt = n > 3 ? ((n * (n + 1)) / ((n - 1) * (n - 2) * (n - 3))) * z4 - (3 * (n - 1) ** 2) / ((n - 2) * (n - 3)) : NaN;
  return { n, mean: m, sd, var: v, varp: ss / n, sdp: Math.sqrt(ss / n), sem, ci: 1.96 * sem, median: percentile(xs, 0.5), mode, min: Math.min(...xs), max: Math.max(...xs), range: Math.max(...xs) - Math.min(...xs), skew, kurt, p5: percentile(xs, 0.05) };
}

// Khoảng tin cậy của trung bình: method 'z' như CONFIDENCE của Excel (dùng độ lệch chuẩn đã cho), 't' với n − 1 bậc tự do
export function ciMean(xs, { conf = 0.95, method = 't', sd = null } = {}) {
  const d = describe(xs);
  const s = sd ?? d.sd;
  const crit = method === 'z' ? normInv(1 - (1 - conf) / 2) : tCrit(d.n - 1, 1 - conf);
  const half = (crit * s) / Math.sqrt(d.n);
  return { mean: d.mean, half, lo: d.mean - half, hi: d.mean + half, crit, method };
}

// Khoảng tin cậy của phương sai: (n − 1)s²/χ²
export function ciVar(xs, { conf = 0.95 } = {}) {
  const d = describe(xs);
  const a = 1 - conf;
  return { var: d.var, lo: ((d.n - 1) * d.var) / chi2Inv(a / 2, d.n - 1), hi: ((d.n - 1) * d.var) / chi2Inv(1 - a / 2, d.n - 1) };
}

// ——— Kiểm định ———
// F-Test hai phía như F.TEST của Excel
export function ftest(a, b) {
  const A = describe(a);
  const B = describe(b);
  const [big, small] = A.var >= B.var ? [A, B] : [B, A];
  const F = big.var / small.var;
  return { F, df1: big.n - 1, df2: small.n - 1, p: Math.min(1, 2 * fUpper(F, big.n - 1, small.n - 1)) };
}

// t-Test hai mẫu độc lập (equalVar: phương sai bằng nhau, như ToolPak "Assuming Equal Variances"; không thì Welch)
export function ttest2(a, b, { equalVar = true, alpha = 0.05 } = {}) {
  const A = describe(a);
  const B = describe(b);
  let t;
  let df;
  let pooled = null;
  if (equalVar) {
    df = A.n + B.n - 2;
    pooled = ((A.n - 1) * A.var + (B.n - 1) * B.var) / df;
    t = (A.mean - B.mean) / Math.sqrt(pooled * (1 / A.n + 1 / B.n));
  } else {
    const va = A.var / A.n;
    const vb = B.var / B.n;
    t = (A.mean - B.mean) / Math.sqrt(va + vb);
    df = (va + vb) ** 2 / (va ** 2 / (A.n - 1) + vb ** 2 / (B.n - 1));
  }
  const p2 = tTwoSided(Math.abs(t), df);
  return { t, df, pooled, p1: p2 / 2, p2, crit2: tCrit(df, alpha), crit1: tCrit(df, 2 * alpha), meanA: A.mean, meanB: B.mean, varA: A.var, varB: B.var };
}

export function ttestPaired(a, b, { alpha = 0.05 } = {}) {
  const d = a.map((x, i) => x - b[i]);
  const D = describe(d);
  const t = D.mean / D.sem;
  const df = D.n - 1;
  const p2 = tTwoSided(Math.abs(t), df);
  const ma = mean(a);
  const mb = mean(b);
  const r = sum(a.map((x, i) => (x - ma) * (b[i] - mb))) / Math.sqrt(sum(a.map((x) => (x - ma) ** 2)) * sum(b.map((y) => (y - mb) ** 2)));
  return { t, df, p1: p2 / 2, p2, crit2: tCrit(df, alpha), crit1: tCrit(df, 2 * alpha), meanA: ma, meanB: mb, r };
}

// ANOVA một nhân tố (ToolPak "Anova: Single Factor"); h² = 1 − 1/F như cách tính hệ số di truyền trong bài tập
export function anova1(groups, { alpha = 0.05 } = {}) {
  const all = groups.flat();
  const g = mean(all);
  const ssb = sum(groups.map((x) => x.length * (mean(x) - g) ** 2));
  const ssw = sum(groups.map((x) => { const m = mean(x); return sum(x.map((v) => (v - m) ** 2)); }));
  const dfb = groups.length - 1;
  const dfw = all.length - groups.length;
  const F = ssb / dfb / (ssw / dfw);
  return { ssb, ssw, sst: ssb + ssw, dfb, dfw, msb: ssb / dfb, msw: ssw / dfw, F, p: fUpper(F, dfb, dfw), crit: fInv(alpha, dfb, dfw), h2: 1 - 1 / F, groups: groups.map((x) => ({ n: x.length, mean: mean(x), var: describe(x).var })) };
}

// χ² phù hợp với tỉ lệ lý thuyết
export function chi2Gof(observed, ratio) {
  const total = sum(observed);
  const s = sum(ratio);
  const expected = ratio.map((r) => (total * r) / s);
  const chi2 = observed.reduce((acc, o, i) => acc + (expected[i] ? (o - expected[i]) ** 2 / expected[i] : 0), 0);
  const df = observed.length - 1;
  return { chi2, df, p: df > 0 ? chi2Upper(chi2, df) : 1, expected, total, critical: df > 0 ? chi2Inv(0.05, df) : null };
}

// χ² độc lập trên bảng r × c
export function chi2Table(table) {
  const rows = table.map(sum);
  const cols = table[0].map((_, j) => sum(table.map((r) => r[j])));
  const N = sum(rows);
  const expected = table.map((r, i) => r.map((_, j) => (rows[i] * cols[j]) / N));
  const chi2 = sum(table.flatMap((r, i) => r.map((o, j) => (o - expected[i][j]) ** 2 / expected[i][j])));
  const df = (table.length - 1) * (cols.length - 1);
  return { chi2, df, p: chi2Upper(chi2, df), expected, crit: (alpha) => chi2Inv(alpha, df) };
}

// ——— Tương quan và hồi quy ———
export function correlation(x, y, { alpha = 0.05 } = {}) {
  const mx = mean(x);
  const my = mean(y);
  const r = sum(x.map((v, i) => (v - mx) * (y[i] - my))) / Math.sqrt(sum(x.map((v) => (v - mx) ** 2)) * sum(y.map((v) => (v - my) ** 2)));
  const n = x.length;
  const t = (r * Math.sqrt(n - 2)) / Math.sqrt(1 - r * r);
  return { r, t, df: n - 2, crit: tCrit(n - 2, alpha), p: tTwoSided(Math.abs(t), n - 2) };
}

// Giải hệ tuyến tính A·x = b (khử Gauss, chọn phần tử trội); trả về x và ma trận nghịch đảo của A
function solve(A, b) {
  const n = A.length;
  const M = A.map((r, i) => [...r, b[i], ...Array.from({ length: n }, (_, j) => (i === j ? 1 : 0))]);
  for (let c = 0; c < n; c++) {
    let p = c;
    for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;
    [M[c], M[p]] = [M[p], M[c]];
    const d = M[c][c];
    for (let k = 0; k < M[c].length; k++) M[c][k] /= d;
    for (let r = 0; r < n; r++) {
      if (r === c) continue;
      const f = M[r][c];
      for (let k = 0; k < M[r].length; k++) M[r][k] -= f * M[c][k];
    }
  }
  return { x: M.map((r) => r[n]), inv: M.map((r) => r.slice(n + 1)) };
}

// Hồi quy tuyến tính bội y = b0 + Σ bj·xj; cols: mảng các biến độc lập (mỗi biến một mảng), names: tên biến.
// Đầu ra như "SUMMARY OUTPUT" của Excel: Multiple R, R², R² hiệu chỉnh, sai số chuẩn, ANOVA, hệ số với SE, t, p, khoảng 95 %.
export function regress(cols, y, { names = cols.map((_, i) => `X${i + 1}`), alpha = 0.05 } = {}) {
  const n = y.length;
  const k = cols.length;
  const X = y.map((_, i) => [1, ...cols.map((c) => c[i])]);
  const p = k + 1;
  // Chuẩn hoá cột để giảm sai số làm tròn với đa thức bậc cao
  const scale = Array.from({ length: p }, (_, j) => (j === 0 ? 1 : Math.max(...X.map((r) => Math.abs(r[j]))) || 1));
  const Xs = X.map((r) => r.map((v, j) => v / scale[j]));
  const XtX = Array.from({ length: p }, (_, a) => Array.from({ length: p }, (_, b) => sum(Xs.map((r) => r[a] * r[b]))));
  const Xty = Array.from({ length: p }, (_, a) => sum(Xs.map((r, i) => r[a] * y[i])));
  const { x: bs, inv } = solve(XtX, Xty);
  const beta = bs.map((b, j) => b / scale[j]);
  const fit = X.map((r) => sum(r.map((v, j) => v * beta[j])));
  const my = mean(y);
  const ssr = sum(fit.map((f) => (f - my) ** 2));
  const sse = sum(y.map((v, i) => (v - fit[i]) ** 2));
  const sst = ssr + sse;
  const dfr = k;
  const dfe = n - p;
  const mse = sse / dfe;
  const F = ssr / dfr / mse;
  const tc = tCrit(dfe, alpha);
  const coef = beta.map((b, j) => {
    const se = Math.sqrt(mse * inv[j][j]) / scale[j];
    const t = b / se;
    return { name: j === 0 ? 'Intercept' : names[j - 1], b, se, t, p: tTwoSided(Math.abs(t), dfe), lo: b - tc * se, hi: b + tc * se };
  });
  const r2 = ssr / sst;
  return { n, k, coef, r: Math.sqrt(r2), r2, adjR2: 1 - (1 - r2) * ((n - 1) / dfe), se: Math.sqrt(mse), ssr, sse, sst, dfr, dfe, msr: ssr / dfr, mse, F, sigF: fUpper(F, dfr, dfe), fit, tCrit: tc };
}

// Mô hình theo tên: 'linear' (y = a + bx), 'poly2'…'poly5', 'hyper' (y = a + b/x), 'exp' (ln y = ln a + bx, y = a·eᵇˣ)
export function fitModel(x, y, model = 'linear') {
  if (model === 'exp') {
    const r = regress([x], y.map(Math.log), { names: ['x'] });
    const a = Math.exp(r.coef[0].b);
    const b = r.coef[1].b;
    const yhat = x.map((v) => a * Math.exp(b * v));
    return { model, reg: r, eq: { a, b }, yhat, sse: sum(y.map((v, i) => (v - yhat[i]) ** 2)) };
  }
  const deg = model === 'linear' ? 1 : model.startsWith('poly') ? Number(model.slice(4)) : 1;
  const cols = model === 'hyper' ? [x.map((v) => 1 / v)] : Array.from({ length: deg }, (_, d) => x.map((v) => v ** (d + 1)));
  const names = model === 'hyper' ? ['1/x'] : Array.from({ length: deg }, (_, d) => (d ? `x^${d + 1}` : 'x'));
  const r = regress(cols, y, { names });
  return { model, reg: r, eq: Object.fromEntries(r.coef.map((c) => [c.name, c.b])), yhat: r.fit, sse: r.sse };
}

// ——— Hồi quy phi tuyến (bình phương tối thiểu, Levenberg–Marquardt, Jacobian sai phân) ———
// f(x, p) → giá trị dự đoán; p0: tham số khởi đầu. Trả về tham số, sai số chuẩn từ (JᵀJ)⁻¹·s², SSE, bậc tự do
export function nls(f, p0, x, y, { names = p0.map((_, i) => `p${i + 1}`), iters = 200 } = {}) {
  let p = p0.slice();
  const resid = (q) => y.map((v, i) => v - f(x[i], q));
  const sse = (r) => sum(r.map((v) => v * v));
  const jac = (q) => {
    const J = x.map(() => new Array(q.length).fill(0));
    q.forEach((v, j) => {
      const h = Math.abs(v) * 1e-6 + 1e-9;
      const qp = q.slice();
      qp[j] = v + h;
      x.forEach((xi, i) => { J[i][j] = (f(xi, qp) - f(xi, q)) / h; });
    });
    return J;
  };
  let r = resid(p);
  let S = sse(r);
  let lambda = 1e-3;
  for (let it = 0; it < iters; it++) {
    const J = jac(p);
    const k = p.length;
    const JtJ = Array.from({ length: k }, (_, a) => Array.from({ length: k }, (_, b) => sum(J.map((row) => row[a] * row[b]))));
    const Jtr = Array.from({ length: k }, (_, a) => sum(J.map((row, i) => row[a] * r[i])));
    let improved = false;
    for (let tries = 0; tries < 20; tries++) {
      const A = JtJ.map((row, a) => row.map((v, b) => (a === b ? v * (1 + lambda) : v)));
      const { x: step } = solve(A, Jtr);
      const q = p.map((v, j) => v + step[j]);
      const rq = resid(q);
      const Sq = sse(rq);
      if (Number.isFinite(Sq) && Sq < S) {
        const done = Math.abs(S - Sq) <= 1e-12 * (S + 1e-12);
        p = q; r = rq; S = Sq; lambda = Math.max(1e-12, lambda / 10); improved = true;
        if (done) it = iters;
        break;
      }
      lambda *= 10;
    }
    if (!improved) break;
  }
  const n = y.length;
  const k = p.length;
  const df = n - k;
  const s2 = S / df;
  const J = jac(p);
  const JtJ = Array.from({ length: k }, (_, a) => Array.from({ length: k }, (_, b) => sum(J.map((row) => row[a] * row[b]))));
  const { inv } = solve(JtJ, new Array(k).fill(0));
  const tc = tCrit(df);
  const coef = p.map((b, j) => {
    const se = Math.sqrt(s2 * inv[j][j]);
    const t = b / se;
    return { name: names[j], b, se, t, p: tTwoSided(Math.abs(t), df), lo: b - tc * se, hi: b + tc * se };
  });
  return { coef, sse: S, df, rse: Math.sqrt(s2), fit: x.map((xi) => f(xi, p)) };
}

// Michaelis–Menten v = Vm·S/(K + S)
export function fitMM(x, y) {
  const Vm0 = Math.max(...y);
  const half = x[y.findIndex((v) => v >= Vm0 / 2)] ?? x[0];
  return nls((s, [Vm, K]) => (Vm * s) / (K + s), [Vm0, half || 0.1], x, y, { names: ['Vm', 'K'] });
}

// Logistic 4 tham số của gói drc (Ritz & Streibig): f(x) = c + (d − c)/(1 + exp(b(ln x − ln e))); e = ED50. Liều 0 cho f = d
export const ll4 = (x, [b, c, d, e]) => (x <= 0 ? d : c + (d - c) / (1 + Math.exp(b * (Math.log(x) - Math.log(e)))));
export function fitLL4(x, y) {
  // d là đáp ứng ở liều thấp, c ở liều cao: đáp ứng tăng theo liều (ví dụ % chết) thì d nhỏ, c lớn
  const lo = Math.min(...y);
  const hi = Math.max(...y);
  const up = y[x.indexOf(Math.max(...x))] > y[x.indexOf(Math.min(...x))];
  const c0 = up ? hi : lo;
  const d0 = up ? lo : hi;
  const span = hi - lo || 1;
  // Giá trị khởi đầu như drc: hồi quy tuyến tính ln((d − y)/(y − c)) theo ln x
  const pts = x.map((v, i) => [v, y[i]]).filter(([v, w]) => v > 0 && w > lo + 0.02 * span && w < hi - 0.02 * span);
  let b0 = 1;
  let e0 = Math.exp(mean(x.filter((v) => v > 0).map(Math.log)));
  if (pts.length >= 2) {
    const lx = pts.map(([v]) => Math.log(v));
    const ly = pts.map(([, w]) => Math.log((d0 - w) / (w - c0)));
    const mx = mean(lx);
    const my = mean(ly);
    b0 = sum(lx.map((v, i) => (v - mx) * (ly[i] - my))) / (sum(lx.map((v) => (v - mx) ** 2)) || 1);
    e0 = Math.exp(mx - my / (b0 || 1));
  }
  return nls(ll4, [b0 || 1, c0, d0, e0], x, y, { names: ['b', 'c', 'd', 'e (ED50)'] });
}
// Liều gây y % đáp ứng (theo tham số b, e của LL.4): EDy = e·(y/(100 − y))^(1/b)
export const edY = (b, e, y) => e * (y / (100 - y)) ** (1 / b);

// ——— Chỉ số đa dạng ———
export const margalef = (S, N, log = Math.log) => (N > 1 ? (S - 1) / log(N) : 0);
export const shannon = (counts) => {
  const N = sum(counts);
  return counts.filter((n) => n > 0).reduce((h, n) => h - (n / N) * Math.log(n / N), 0);
};
export const simpson = (counts) => {
  const N = sum(counts);
  return N > 1 ? 1 - sum(counts.map((n) => n * (n - 1))) / (N * (N - 1)) : 0;
};
