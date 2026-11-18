// Mô hình real-time PCR (qPCR) nhuộm SYBR Green, dùng chung cho bản dựng (Node), trang hình và app (src/core).
// Module thuần: không DOM, không Three.js. Mọi số ngẫu nhiên đi qua bộ sinh có seed nên chạy lại cho đúng kết quả cũ.
//
// Số liệu và nguồn:
// - Máy làm mẫu Bio-Rad CFX96 Touch (Bulletin 6093, bảng Specifications,
//   https://www.bio-rad.com/webroot/web/pdf/lsr/literature/Bulletin_6093.pdf):
//   khung C1000 Touch, tốc độ đổi nhiệt tối đa 5 °C/s, trung bình 3,3 °C/s, block Peltier 0–100 °C, nắp tới 105 °C,
//   6 LED có kính lọc kích thích, 6 photodiode có kính lọc thu, 450–730 nm, độ nhạy 1 bản sao,
//   khoảng động 10 bậc độ lớn, quét mọi kênh 12 s, quét nhanh một kênh 3 s.
//   Bảng kênh (cùng bulletin, trang 4): kích thích 450–490 / 515–535 / 560–590 / 620–650 / 672–684 nm,
//   thu 510–530 / 560–580 / 610–650 / 675–690 / 705–730 nm; kênh 6 dành cho FRET.
// - Chương trình nhiệt cho máy CFX ở chế độ chỉ SYBR (SsoAdvanced Universal SYBR Green Supermix, manual 10031339, bảng 2,
//   https://www.bio-rad.com/webroot/web/pdf/lsr/literature/10031339.pdf): 95 °C 30 s (cDNA), 35–40 chu kỳ
//   95 °C 5–15 s · 60 °C 10–30 s + đọc đĩa; đường nóng chảy 65–95 °C, bước 0,5 °C, 2–5 s mỗi bước.
//   Cùng manual: sản phẩm đặc hiệu cho một đỉnh nóng chảy quanh 85–87 °C; dimer mồi cho đỉnh quanh giữa 70 °C;
//   hiệu suất 90–110 % (độ dốc −3,6 đến −3,1), E = 10^(−1/độ dốc) − 1; amplicon nên dài 70–150 bp; phản ứng 20 µL.
// - Ngưỡng phát hiện: Bulletin 6093 cho 96 giếng 10⁵ bản plasmid IL-1β có Cq trung bình 19,81 ± 0,10.
//   Với E = 100 %, ngưỡng tương ứng khoảng 10⁵ × 2^19,8 ≈ 9×10¹⁰ bản, nên mô hình lấy ngưỡng ở 10¹¹ bản.
//   Độ lệch 0,10 chu kỳ giữa các giếng tương ứng sai số hút mẫu khoảng 7 % (0,10 × ln 2).
// - Phần không có nguồn trực tiếp (ghi rõ là giả định để minh hoạ): K = 10¹² bản ở nửa mức bão hoà tín hiệu,
//   Fmax = 4 400 RFU, nền 220 RFU trôi 1,2 RFU mỗi chu kỳ, nhiễu 4 RFU; dimer mồi khởi đầu khoảng 60 phân tử
//   hiệu dụng, nhân lên 80 % mỗi chu kỳ và chỉ cho tín hiệu bằng 0,4 lần sản phẩm (ngắn hơn nên gắn ít SYBR Green hơn);
//   độ rộng chuyển pha nóng chảy 0,55 °C cho sản phẩm, 0,9 °C cho dimer.
import { timeline as cycleTimeline, fmtTime, fmtCopies } from "../thermocycler/model.mjs";

export { fmtTime, fmtCopies };

/** Thông số máy và chương trình chạy mẫu (SYBR Green, 40 chu kỳ hai bước, đường nóng chảy). */
export const QPCR = {
  ramp: 3.3, // °C/s trung bình (Bulletin 6093)
  rampMax: 5,
  lid: 105,
  room: 25,
  cycles: 40,
  initial: { name: "Hoạt hoá polymerase", T: 95, s: 30 },
  steps: [
    { name: "Biến tính", T: 95, s: 10 },
    { name: "Gắn mồi + kéo dài", T: 60, s: 30 },
  ],
  readStep: 1, // đọc đĩa ở cuối bước 60 °C
  read: 3, // s, quét nhanh một kênh (SYBR/FAM)
  readAll: 12, // s, quét đủ 6 kênh
  melt: { from: 65, to: 95, step: 0.5, s: 5 },
  volume: 20, // µL
};

/** Năm kênh màu và kênh FRET của CFX96 Touch (nm). Kênh 1 đọc SYBR Green. */
export const CHANNELS = [
  { ch: 1, dye: "FAM / SYBR Green", ex: [450, 490], em: [510, 530] },
  { ch: 2, dye: "HEX / VIC", ex: [515, 535], em: [560, 580] },
  { ch: 3, dye: "Texas Red / ROX", ex: [560, 590], em: [610, 650] },
  { ch: 4, dye: "Cy5", ex: [620, 650], em: [675, 690] },
  { ch: 5, dye: "Quasar 705", ex: [672, 684], em: [705, 730] },
  { ch: 6, dye: "FRET", ex: [450, 490], em: [560, 580] },
];

/** Mô hình tín hiệu huỳnh quang. N_th là số bản ở ngưỡng, K là số bản ở nửa mức bão hoà. */
export const FLUOR = {
  Fmax: 4400, // RFU
  K: 1e12,
  Nth: 1e11,
  base: 220,
  drift: 1.2,
  noise: 4,
  pipetCV: 0.07,
  product: { Tm: 85.5, width: 0.55, weight: 1 },
  dimer: { Tm: 75.5, width: 0.9, n0: 60, eff: 0.8, weight: 0.4 },
  meltSlope: 0.012, // SYBR Green sáng kém đi khi nóng: giảm 1,2 % mỗi °C (giả định)
  meltBg: 60, // RFU nền không phụ thuộc DNA
};

/** Ngưỡng (RFU, sau khi trừ nền) ứng với N_th bản. */
export const THRESHOLD = signalOf(FLUOR.Nth);

/** Dãy pha loãng mẫu: 10⁶ → 10² bản, mỗi bậc 10 lần, và một giếng đối chứng không khuôn (NTC). */
export const DEFAULT_WELLS = [
  { name: "10⁶ bản", n0: 1e6, eff: 0.95 },
  { name: "10⁵ bản", n0: 1e5, eff: 0.95 },
  { name: "10⁴ bản", n0: 1e4, eff: 0.95 },
  { name: "10³ bản", n0: 1e3, eff: 0.95 },
  { name: "10² bản", n0: 1e2, eff: 0.95 },
  { name: "NTC", n0: 0 },
];

// ——— Số ngẫu nhiên có seed ———

/** Bộ sinh số ngẫu nhiên mulberry32: trả về hàm cho số trong [0, 1). */
export function rng(seed = 1) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Seed lấy từ một chuỗi (tên giếng), để mỗi giếng có nhiễu riêng nhưng lặp lại được. */
export function seedOf(text, base = 0) {
  let h = 2166136261 ^ base;
  for (const ch of String(text)) h = Math.imul(h ^ ch.codePointAt(0), 16777619);
  return h >>> 0;
}

/** Phân phối chuẩn (Box–Muller). */
export function gauss(rand) {
  const u = Math.max(1e-12, rand());
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * rand());
}

/** Số phân tử khuôn thật sự rơi vào giếng: Poisson với trung bình λ (ít bản thì có giếng không có bản nào). */
export function poisson(lambda, rand) {
  if (lambda <= 0) return 0;
  if (lambda > 200) return Math.max(0, Math.round(lambda + Math.sqrt(lambda) * gauss(rand)));
  const L = Math.exp(-lambda);
  let k = 0;
  let p = 1;
  do { k++; p *= rand(); } while (p > L);
  return k - 1;
}

// ——— Khuếch đại và tín hiệu ———

/** Số bản sau c chu kỳ, nhân lên (1 + E) mỗi chu kỳ (chưa tính bão hoà; bão hoà nằm ở signalOf). */
export const copiesAt = (n0, eff, c) => n0 * (1 + eff) ** c;

/** Tín hiệu huỳnh quang (RFU, đã trừ nền) của S bản: Fmax · S / (S + K), tăng tuyến tính rồi bão hoà. */
export function signalOf(S, f = FLUOR) {
  return (f.Fmax * S) / (S + f.K);
}

/** Ct lý thuyết: chu kỳ mà N0·(1+E)^Ct = N_th. Bằng −log10(N0)/log10(1+E) + b, với b = log10(N_th)/log10(1+E). */
export function ctTheory(n0, eff, f = FLUOR) {
  if (!(n0 > 0)) return null;
  return Math.log10(f.Nth / n0) / Math.log10(1 + eff);
}

/** Độ dốc lý thuyết của đường chuẩn: −1/log10(1 + E); bằng −3,32 khi E = 100 %. */
export const slopeOf = (eff) => -1 / Math.log10(1 + eff);
/** Hiệu suất từ độ dốc: E = 10^(−1/độ dốc) − 1. */
export const effOf = (slope) => 10 ** (-1 / slope) - 1;

/** Ct từ chuỗi RFU đã trừ nền: chu kỳ đầu tiên vượt ngưỡng, nội suy tuyến tính giữa hai chu kỳ. null nếu không vượt. */
export function ctOf(sub, threshold = THRESHOLD) {
  for (let i = 1; i < sub.length; i++) {
    if (sub[i] >= threshold && sub[i - 1] < threshold) return i - 1 + (threshold - sub[i - 1]) / (sub[i] - sub[i - 1]);
  }
  return null;
}

/** Trừ nền như phần mềm của máy: đường thẳng khớp theo các chu kỳ nền (từ chu kỳ 3 tới trước lúc tín hiệu bắt đầu lên). */
export function subtractBaseline(raw, f = FLUOR) {
  const n = raw.length - 1; // raw[0] bỏ trống, raw[c] là chu kỳ c
  let end = Math.min(15, n);
  for (let c = 4; c <= Math.min(15, n); c++) {
    if (raw[c] - raw[c - 1] > 8 * f.noise + f.drift) { end = c - 3; break; }
  }
  end = Math.max(end, 5);
  const xs = [];
  const ys = [];
  for (let c = 3; c <= end; c++) { xs.push(c); ys.push(raw[c]); }
  const { slope, intercept } = fitLine(xs, ys);
  return raw.map((v, c) => (c === 0 ? 0 : v - (intercept + slope * c)));
}

/** Hồi quy tuyến tính bình phương nhỏ nhất: { slope, intercept, r2 }. */
export function fitLine(xs, ys) {
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxx = 0;
  let sxy = 0;
  let syy = 0;
  for (let i = 0; i < n; i++) {
    sxx += (xs[i] - mx) ** 2;
    sxy += (xs[i] - mx) * (ys[i] - my);
    syy += (ys[i] - my) ** 2;
  }
  const slope = sxx > 0 ? sxy / sxx : 0;
  const intercept = my - slope * mx;
  const r2 = sxx > 0 && syy > 0 ? (sxy * sxy) / (sxx * syy) : 1;
  return { slope, intercept, r2 };
}

/** Đường chuẩn từ các giếng biết số bản: Ct theo log10(N0). Trả về độ dốc, hệ số chặn, hiệu suất và R². */
export function standardCurve(points) {
  const use = points.filter((p) => p.n0 > 0 && p.ct != null);
  if (use.length < 2) return null;
  const fit = fitLine(use.map((p) => Math.log10(p.n0)), use.map((p) => p.ct));
  return { slope: fit.slope, intercept: fit.intercept, eff: effOf(fit.slope), r2: fit.r2, n: use.length };
}

/** Phần sợi đôi còn lại ở nhiệt độ T của một sản phẩm có điểm nóng chảy Tm (đường logistic). */
export const dsFraction = (T, Tm, width) => 1 / (1 + Math.exp((T - Tm) / width));

/**
 * Chạy một giếng: số bản thật (Poisson + sai số hút), chuỗi RFU thô theo chu kỳ, RFU đã trừ nền, Ct,
 * rồi đường nóng chảy (RFU và −dF/dT theo nhiệt độ) với các đỉnh.
 * spec: { name, n0 (số bản trung bình), eff (0–1.2, mặc định 0.95), tm (°C, mặc định 85,5), dimer (mặc định true) }
 */
export function runWell(spec, { seed = 1, q = QPCR, f = FLUOR } = {}) {
  const rand = rng(seedOf(spec.name ?? "giếng", seed));
  const n0 = Math.max(0, Number(spec.n0) || 0);
  const eff = Math.min(1.2, Math.max(0, spec.eff == null ? 0.95 : Number(spec.eff)));
  // Số bản thật: Poisson khi ít bản, rồi sai số hút mẫu (log-chuẩn)
  const drawn = n0 < 1e4 ? poisson(n0, rand) : n0;
  const actual = drawn * Math.exp(f.pipetCV * gauss(rand));
  // Dimer mồi: chỉ thắng được khi giếng không có khuôn nào
  const dimerOn = spec.dimer !== false && drawn === 0;
  const pd = f.dimer;
  const pd0 = dimerOn ? poisson(pd.n0, rand) : 0;
  const tm = (spec.tm ?? f.product.Tm) + 0.15 * gauss(rand);
  const tmDimer = pd.Tm + 0.2 * gauss(rand);
  const base = f.base * (1 + 0.05 * gauss(rand));
  const raw = [0];
  const parts = [];
  for (let c = 1; c <= q.cycles; c++) {
    const Nt = copiesAt(actual, eff, c);
    const Nd = copiesAt(pd0, pd.eff, c);
    const S = Nt * f.product.weight + Nd * pd.weight;
    const amp = signalOf(S, f);
    raw.push(base + f.drift * c + amp + f.noise * gauss(rand));
    parts.push({ t: S > 0 ? (Nt * f.product.weight) / S : 0, amp });
  }
  const sub = subtractBaseline(raw, f);
  const ct = ctOf(sub);
  // Đường nóng chảy: lượng mỗi sản phẩm lấy từ tín hiệu ở chu kỳ cuối
  const last = parts[parts.length - 1];
  const products = [
    { Tm: tm, width: f.product.width, A: last.amp * last.t },
    { Tm: tmDimer, width: pd.width, A: last.amp * (1 - last.t) },
  ].filter((p) => p.A > 1);
  const melt = meltCurve(products, { q, f, rand });
  return { name: spec.name ?? "", n0, eff, actual, dimer: pd0 > 0, raw, sub, ct, tm, products, melt, peaks: meltPeaks(melt) };
}

/** Đường nóng chảy đọc mỗi bước nhiệt: [{ T, F, dF }], dF = −dF/dT tính bằng sai phân như phần mềm của máy. */
export function meltCurve(products, { q = QPCR, f = FLUOR, rand = rng(7) } = {}) {
  const pts = [];
  const { from, to, step } = q.melt;
  const n = Math.round((to - from) / step);
  for (let i = 0; i <= n; i++) {
    const T = from + i * step;
    const dye = 1 - f.meltSlope * (T - from);
    let F = f.meltBg * dye;
    for (const p of products) F += p.A * dsFraction(T, p.Tm, p.width) * dye;
    pts.push({ T, F: F + f.noise * 0.5 * gauss(rand), dF: 0 });
  }
  for (let i = 0; i < pts.length; i++) {
    const a = pts[Math.max(0, i - 1)];
    const b = pts[Math.min(pts.length - 1, i + 1)];
    pts[i].dF = -(b.F - a.F) / (b.T - a.T);
  }
  return pts;
}

/** Các đỉnh của −dF/dT cao hơn 15 % đỉnh lớn nhất (và trên 20 RFU/°C): [{ T, h }] theo chiều cao giảm dần. */
export function meltPeaks(melt) {
  const top = Math.max(...melt.map((p) => p.dF));
  const out = [];
  for (let i = 2; i < melt.length - 2; i++) {
    const p = melt[i];
    if (p.dF > melt[i - 1].dF && p.dF >= melt[i + 1].dF && p.dF > Math.max(20, top * 0.15)) out.push({ T: p.T, h: p.dF });
  }
  return out.sort((a, b) => b.h - a.h);
}

/** Chạy cả đĩa: các giếng, ngưỡng và đường chuẩn từ các giếng có số bản đã biết. */
export function runPlate(wells = DEFAULT_WELLS, { seed = 1 } = {}) {
  const list = wells.map((w) => runWell(w, { seed }));
  return { wells: list, threshold: THRESHOLD, curve: standardCurve(list) };
}

// ——— Dòng thời gian của chương trình ———

/**
 * Các đoạn của chương trình: mỗi đoạn có đổi nhiệt (ramp), giữ nhiệt (s) rồi đọc đĩa (read, nếu có).
 * Phần chu kỳ dựng lại từ timeline() của máy PCR thường (figures/thermocycler/model.mjs), thêm thời gian đọc đĩa;
 * sau đó là các bước nóng chảy 65 → 95 °C, mỗi bước giữ 5 s rồi đọc.
 */
export function runTimeline(q = QPCR) {
  const base = cycleTimeline({ ...q, final: { name: "Về 65 °C", T: q.melt.from, s: 10 }, hold: { name: "Giữ", T: q.melt.from } });
  const segs = [];
  let t = 0;
  for (const s of base.slice(0, -1)) {
    const read = s.step === q.readStep ? q.read : 0;
    segs.push({ kind: "cycle", name: s.name, T: s.T, from: s.from, cycle: s.cycle, step: s.step, ramp: s.ramp, s: s.s, read, t0: t, hold0: t + s.ramp, read0: t + s.ramp + s.s, t1: t + s.ramp + s.s + read });
    t = segs[segs.length - 1].t1;
  }
  const { from, to, step } = q.melt;
  const n = Math.round((to - from) / step);
  let T = from;
  for (let i = 0; i <= n; i++) {
    const Ti = from + i * step;
    const ramp = Math.abs(Ti - T) / q.ramp;
    segs.push({ kind: "melt", name: "Nóng chảy", T: Ti, from: T, cycle: q.cycles, step: 5, melt: i, ramp, s: q.melt.s, read: q.read, t0: t, hold0: t + ramp, read0: t + ramp + q.melt.s, t1: t + ramp + q.melt.s + q.read });
    t = segs[segs.length - 1].t1;
    T = Ti;
  }
  return segs;
}

const SEGMENTS = runTimeline();
/** Tổng thời gian chương trình mẫu (giây): khoảng 55 phút. */
export const RUN_SECONDS = SEGMENTS[SEGMENTS.length - 1].t1;

/**
 * Trạng thái máy ở giây t kể từ khi bấm chạy: nhiệt độ block, đoạn hiện tại, đang đọc hay không và tiến độ đọc (0–1),
 * số lần đọc chu kỳ đã xong (reads) và số bước nóng chảy đã đọc (meltReads).
 */
export function stateAt(t, segs = SEGMENTS, q = QPCR) {
  const total = segs[segs.length - 1].t1;
  if (t <= 0) return { T: q.room, rate: 0, seg: null, index: -1, cycle: 0, ramping: false, reading: false, readFrac: 0, reads: 0, meltReads: 0, left: total, done: false, melting: false };
  if (t >= total) {
    const seg = segs[segs.length - 1];
    return { T: seg.T, rate: 0, seg, index: segs.length - 1, cycle: q.cycles, ramping: false, reading: false, readFrac: 0, reads: q.cycles, meltReads: seg.melt + 1, left: 0, done: true, melting: false };
  }
  let i = segs.findIndex((s) => t < s.t1);
  const seg = segs[i];
  const ramping = t < seg.hold0;
  const k = seg.ramp > 0 ? Math.min(1, (t - seg.t0) / seg.ramp) : 1;
  const T = ramping ? seg.from + (seg.T - seg.from) * k : seg.T;
  const reading = seg.read > 0 && t >= seg.read0;
  let reads = 0;
  let meltReads = 0;
  for (let j = 0; j < i; j++) {
    const s = segs[j];
    if (s.kind === "cycle" && s.read > 0) reads++;
    if (s.kind === "melt") meltReads++;
  }
  return {
    T,
    rate: ramping ? Math.sign(seg.T - seg.from) * q.ramp : 0,
    seg,
    index: i,
    cycle: seg.cycle,
    ramping,
    reading,
    readFrac: reading ? (t - seg.read0) / seg.read : 0,
    reads,
    meltReads,
    left: Math.max(0, total - t),
    done: false,
    melting: seg.kind === "melt",
  };
}

/** Vị trí đầu quang học khi quét đĩa 96 giếng theo đường rắn bò (cột 1 → 12, mỗi cột đi hết 8 hàng). frac 0–1 → { col, row } (số thực). */
export function scanAt(frac) {
  const f = Math.min(1, Math.max(0, frac)) * 12;
  const col = Math.min(11, Math.floor(f));
  const along = f - col;
  // trong mỗi cột: đi dọc 8 hàng (85 % thời gian) rồi bước sang cột kế (15 %)
  const go = Math.min(1, along / 0.85);
  const r = 7 * (0.5 - 0.5 * Math.cos(Math.PI * go));
  const row = col % 2 === 0 ? r : 7 - r;
  const step = along > 0.85 && col < 11 ? (along - 0.85) / 0.15 : 0;
  return { col: col + (0.5 - 0.5 * Math.cos(Math.PI * step)), row };
}

/** Định dạng Ct kiểu Việt Nam: "21,4" hoặc "—" khi không vượt ngưỡng. */
export const fmtCt = (ct) => (ct == null ? "—" : ct.toFixed(1).replace(".", ","));
