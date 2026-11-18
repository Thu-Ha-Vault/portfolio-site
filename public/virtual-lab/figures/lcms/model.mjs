// Mô hình sắc ký lỏng – khối phổ hai lần (LC-MS/MS) với máy khối phổ ba tứ cực, dùng chung cho bản dựng
// (build.mjs), trang hình (live.js) và sau này cho lõi mô phỏng của app (src/core). Module thuần: không DOM,
// không Three.js. Phần sắc ký (thời gian lưu, độ rộng pic, áp suất) dùng lại mô hình HPLC của hình trước
// (figures/hplc/model.mjs), chỉ đổi cột và phương pháp cho hợp với LC-MS/MS.
//
// Máy làm mẫu: Shimadzu LCMS-8060 (ba tứ cực), theo tờ thông số của hãng C146-E288D
// (bản đăng lại: https://www.zefsci.com/canada/wp-content/uploads/sites/5/2021/08/Specifications-1.pdf):
// - Dải khối m/z 2–2 000; độ phân giải R < 0,7 u FWHM (độ phân giải đơn vị); độ ổn định khối 0,1 u/24 giờ;
//   độ đúng khối ±0,15 u (m/z 1 000); nhiễu chéo (cross-talk) < 0,003 %.
// - Tốc độ quét tối đa 30 000 u/s; tốc độ MRM tối đa 555 kênh/s; thời gian dừng (dwell) tối thiểu 0,8 ms,
//   thời gian nghỉ (pause) tối thiểu 1 ms; đổi cực dương/âm 5 ms.
// - Nguồn ion ESI (chuẩn), APCI và DUIS (tuỳ chọn); lưu lượng LC cho ESI 1 µL/phút – 2 mL/phút.
//   Ống khử dung môi (DL) tối đa 300 °C; khối gia nhiệt (heat block) tối đa 500 °C (ESI);
//   nhiệt độ giao diện đặt tối đa 400 °C (ESI; nhiệt thật ở đầu probe > 700 °C theo chú thích của hãng).
// - Q1 và Q3 là bộ lọc khối hyperbol bằng molybden có thanh trước (pre-rod), Q1 có thêm thanh sau (post-rod);
//   ô va chạm UFsweeper III kiểu đa cực thuôn (tapered multipole); quang học ion Q-array (UF-Qarray trên 8060)
//   và đa cực truyền ion; đầu dò là ống nhân điện tử thứ cấp với dynode chuyển đổi lệch trục; đếm xung,
//   dải động 2 × 10⁷ cps.
// - Chân không: một bơm quay dầu (rotary) 65 m³/giờ; một bơm phân tử tuabin ba cửa hút 40, 260, 210 L/s.
// - Khí: nitrogen tối đa 24,4 L/phút, độ tinh khiết > 97 %; argon > 99,99 % làm khí CID; không khí khô tối
//   đa 20 L/phút. Kích thước 1 180 (R) × 540 (S) × 610 (C) mm, 140 kg.
// Nguồn khác: trang tính năng LCMS-8060 (https://www.shimadzu.eu/products/liquid-chromatograph-mass-spectrometry/triple-quadrupole-lc-msms/lcms-8060/features.html):
//   DL thay được không cần phá chân không; tờ thông số LCMS-8040 C146-E194K (máy cùng dòng, đời trước,
//   https://cos.unt.edu/chemistry/system/files/shimadzu_8040_lc-ms_specifications_1.pdf) cho cùng cấu hình bơm.
//
// Chưa xác minh, dùng số điển hình (ghi rõ ở từng hằng số):
// - Lưu lượng khí phun sương 3 L/phút, khí gia nhiệt 10 L/phút, khí làm khô 10 L/phút, giao diện 300 °C,
//   DL 250 °C, heat block 400 °C, điện áp giao diện +4 kV, áp khí CID 270 kPa: giá trị hay gặp trong các
//   bài ứng dụng LCMS-8050/8060, chưa đối chiếu một tài liệu cụ thể.
// - Áp suất từng tầng chân không, bán kính trường r0 và tần số RF của tứ cực: số điển hình của máy ba tứ cực.
// - Hiệu suất ion hoá, hệ số đáp ứng, nền hoá học, hiệu suất phân mảnh và năng lượng va chạm (CE) tối ưu
//   của từng chuyển tiếp: SỐ MINH HOẠ. m/z của ion thì tính đúng từ khối lượng đơn đồng vị.
//
// Mô hình:
// - m/z ion [M+H]⁺ = khối lượng đơn đồng vị của phân tử + khối lượng proton (1,007276 u); ion mảnh tính từ
//   công thức của cation (trừ khối lượng electron). Khối lượng nguyên tử theo IUPAC/AME.
// - Đồng vị: M+1 ≈ nC·1,07 % (¹³C, xấp xỉ 1,1 % mỗi carbon) + nN·0,37 % + nH·0,0115 % + nO·0,038 %;
//   M+2 ≈ (M+1 của carbon)²/2 + nO·0,205 %.
// - Tứ cực: truyền qua T(Δm) = 1 / (1 + (2Δm/FWHM)⁸), đỉnh phẳng, bằng 0,5 ở ±FWHM/2.
//   Điện áp RF và DC ở đỉnh vùng bền Mathieu: q = 0,706, a = 0,237: V = q·m·r0²·Ω²/(4e), U = a·m·r0²·Ω²/(8e).
// - Phân mảnh trong ô va chạm: đường cong phá vỡ dạng Gauss theo CE: y(CE) = ymax·exp(−((CE − CEopt)/w)²).
// - Tín hiệu (cps) của một kênh MRM = Σ tốc độ ion của chất × T(Q1) × Σ y(CE) × T(Q3) + nền hoá học.
//   Tốc độ ion của chất = K · ε_ion · (1 − ức chế nền) · lượng chất trên cột (pg) · tỉ lệ đơn đồng vị · pic Gauss.
//   Diện tích pic (counts) tỉ lệ thuận với nồng độ: đường chuẩn đi qua gốc.
// - Nhiễu: đếm xung có nhiễu Poisson √(nền·τ)/τ (τ = dwell) cộng 5 % nền (nhiễu hoá học). S/N = chiều cao pic /
//   nhiễu RMS; LOD ở S/N = 3, LOQ ở S/N = 10.
// - Ảnh hưởng nền (matrix effect): ME % = (diện tích trong nền / diện tích trong dung môi − 1) × 100; ức chế ion
//   làm giảm tín hiệu và nền mẫu làm tăng nền hoá học.
// - Mỗi chu kỳ MRM đo lần lượt mọi kênh: chu kỳ = Σ (dwell + pause). Số điểm trên pic = 4σ / chu kỳ.
import * as HP from "../hplc/model.mjs";

/** Thông số máy LCMS-8060 (theo tờ thông số; số "điển hình" chưa xác minh ghi rõ). */
export const LCMS = {
  model: "LCMS-8060",
  massRange: [2, 2000],
  fwhm: 0.7, // u, độ phân giải đơn vị
  scanSpeed: 30000, // u/s
  mrmMax: 555, // kênh/s
  dwellMin: 0.8, // ms
  pauseMin: 1, // ms
  polaritySwitch: 5, // ms
  crossTalk: 0.00003,
  saturation: 2e7, // cps, dải động đếm xung
  source: {
    interface: "ESI có gia nhiệt (heated ESI)",
    voltage: 4.0, // kV, điển hình
    nebulizer: 3, // L/phút, điển hình
    heating: 10, // L/phút, điển hình
    drying: 10, // L/phút, điển hình
    tInterface: 300, // °C, điển hình (đặt tối đa 400)
    tDL: 250, // °C, điển hình (tối đa 300)
    tBlock: 400, // °C, điển hình (tối đa 500)
    flowRange: [0.001, 2], // mL/phút
  },
  cid: { gas: "argon", pressure: 270 }, // kPa, điển hình
  vacuum: {
    rotary: 65, // m³/giờ
    turbo: [40, 260, 210], // L/s, ba cửa hút
    stages: [
      { name: "nguồn ion", p: 101325 },
      { name: "Q-array", p: 100 }, // Pa, điển hình
      { name: "đa cực truyền", p: 0.5 }, // Pa, điển hình
      { name: "bộ phân tích", p: 2e-3 }, // Pa, điển hình (ô va chạm có argon ≈ 0,3 Pa bên trong)
    ],
  },
  quad: { r0: 4.0, freq: 1.0, qApex: 0.706, aApex: 0.237 }, // mm, MHz: điển hình
  gas: { n2Max: 24.4, purityN2: 97, purityAr: 99.99 },
  size: { w: 1180, d: 540, h: 610, kg: 140 },
};

// Khối lượng nguyên tử (u) và hằng số
const MASS = { C: 12, H: 1.00782503207, N: 14.0030740048, O: 15.99491461956, S: 31.97207100, Cl: 34.96885268 };
export const PROTON = 1.007276466812;
export const ELECTRON = 0.00054857990946;
const C13 = 1.0033548378; // chênh khối ¹³C − ¹²C

/**
 * Các chất phân tích. formula: công thức phân tử trung hoà; ie: hiệu suất ion hoá tương đối trong ESI(+);
 * bg: nền hoá học của kênh chính (cps); transitions: các chuyển tiếp MRM với công thức ion mảnh, CE tối ưu (V),
 * ymax (phần ion tiền chất thành ion mảnh này ở CE tối ưu), w (độ rộng đường cong CE, V).
 * Chuyển tiếp đầu là kênh định lượng, kênh sau là kênh xác nhận. Số ie, bg, CE, ymax là minh hoạ.
 */
export const ANALYTES = {
  caffeine: {
    name: "caffeine",
    formula: { C: 8, H: 10, N: 4, O: 2 },
    ie: 1.0,
    hue: 280,
    transitions: [
      { product: { C: 6, H: 8, N: 3, O: 1 }, loss: "CH₃NCO", ce: 20, ymax: 0.45, w: 9, bg: 220 },
      { product: { C: 5, H: 8, N: 3 }, loss: "CH₃NCO + CO", ce: 28, ymax: 0.16, w: 9, bg: 160 },
    ],
  },
  theobromine: {
    name: "theobromine",
    formula: { C: 7, H: 8, N: 4, O: 2 },
    ie: 0.55,
    hue: 32,
    transitions: [
      { product: { C: 6, H: 8, N: 3, O: 1 }, loss: "HNCO", ce: 18, ymax: 0.35, w: 8, bg: 260 },
      { product: { C: 7, H: 7, N: 4, O: 1 }, loss: "H₂O", ce: 15, ymax: 0.1, w: 7, bg: 300 },
    ],
  },
  theophylline: {
    name: "theophylline",
    formula: { C: 7, H: 8, N: 4, O: 2 },
    ie: 0.6,
    hue: 200,
    transitions: [
      { product: { C: 5, H: 6, N: 3, O: 1 }, loss: "CH₃NCO", ce: 20, ymax: 0.4, w: 8, bg: 240 },
      { product: { C: 4, H: 6, N: 3 }, loss: "CH₃NCO + CO", ce: 26, ymax: 0.12, w: 8, bg: 180 },
    ],
  },
  paracetamol: {
    name: "paracetamol",
    formula: { C: 8, H: 9, N: 1, O: 2 },
    ie: 0.8,
    hue: 150,
    transitions: [
      { product: { C: 6, H: 8, N: 1, O: 1 }, loss: "CH₂CO", ce: 15, ymax: 0.55, w: 7, bg: 200 },
      { product: { C: 5, H: 5 }, loss: "CH₂CO + HNCO", ce: 35, ymax: 0.08, w: 10, bg: 140 },
    ],
  },
};
const ALIASES = { cafein: "caffeine", caffein: "caffeine", theobromin: "theobromine", theophyllin: "theophylline", acetaminophen: "paracetamol" };

/** Hệ số đáp ứng của detector: số ion đếm được trên 1 pg chất trên cột ở ε_ion = 1, hiệu suất phân mảnh 1 (minh hoạ). */
export const RESPONSE = 4.0e4;

/** Cột và phương pháp LC mặc định cho LC-MS/MS: cột C18 ngắn hạt nhỏ, lưu lượng thấp hợp với ESI. */
export const LC_COLUMN = { name: "C18 2,1 × 100 mm, 1,9 µm", L: 100, d: 2.1, dp: 1.9, epsT: 0.65, epsE: 0.38, pMax: 1000 };
export const LC_METHOD = { organic: 10, flow: 0.4, temp: 40, volume: 2, lambda: 0, seed: 7 };
/** Giới hạn áp của bơm UHPLC (bar), kiểu Nexera (minh hoạ; chưa xác minh với model bơm cụ thể). */
export const LC_PMAX = 1300;

/** Mẫu mặc định: hỗn hợp chuẩn (ng/mL) trong dung môi. */
export const SAMPLE = [
  { name: "theobromine", conc: 20 },
  { name: "paracetamol", conc: 20 },
  { name: "theophylline", conc: 20 },
  { name: "caffeine", conc: 50 },
];

/** Lần chạy mặc định: chọn kênh định lượng của caffeine, 50 ng/mL, không có nền mẫu. */
export const RUN = { analyte: "caffeine", transition: 0, conc: 50, matrix: 0, volume: 2, dwell: 20, seed: 7 };

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const num = (v, d) => (v !== null && v !== "" && Number.isFinite(+v) ? +v : d);

/** Khối lượng đơn đồng vị (u) của một công thức { C, H, N, O, … }. */
export function monoMass(formula) {
  return Object.entries(formula).reduce((s, [el, n]) => s + (MASS[el] ?? 0) * n, 0);
}

/** m/z của ion [M+H]⁺ của phân tử có công thức này. */
export function protonated(formula) {
  return monoMass(formula) + PROTON;
}

/** m/z của một cation có công thức này (ion mảnh mang điện +1): khối lượng nguyên tử trừ một electron. */
export function cationMz(formula) {
  return monoMass(formula) - ELECTRON;
}

/** Viết công thức dạng chữ: C8H10N4O2. */
export function formulaText(formula) {
  return ["C", "H", "N", "O", "S", "Cl"].filter((el) => formula[el]).map((el) => `${el}${formula[el] > 1 ? formula[el] : ""}`).join("");
}

/** Tìm chất theo tên (không phân biệt hoa thường, nhận vài tên tiếng Việt). */
export function analyteOf(name) {
  const key = String(name ?? "").trim().toLowerCase();
  return ANALYTES[ALIASES[key] ?? key] ?? null;
}

/**
 * Mẫu đồng vị của ion [M+H]⁺: [{ mz, rel }] cho M, M+1, M+2 (rel so với đỉnh M = 1).
 * ¹³C 1,07 % (≈ 1,1 % mỗi carbon), ²H 0,0115 %, ¹⁵N 0,364 %, ¹⁷O 0,038 %, ¹⁸O 0,205 %.
 */
export function isotopePattern(formula) {
  const f = { C: 0, H: 0, N: 0, O: 0, ...formula };
  const h = f.H + 1; // thêm proton
  const c1 = (f.C * 1.07) / 98.93;
  const m1 = c1 + (h * 0.0115) / 99.9885 + (f.N * 0.364) / 99.636 + (f.O * 0.038) / 99.757;
  const m2 = (c1 * c1) / 2 + (f.O * 0.205) / 99.757;
  const m0 = protonated(formula);
  return [
    { mz: m0, rel: 1 },
    { mz: m0 + C13, rel: m1 },
    { mz: m0 + 2 * C13, rel: m2 },
  ];
}

/** Phần ion ở đỉnh đơn đồng vị (M) trong cả cụm đồng vị. */
export function monoFraction(formula) {
  const p = isotopePattern(formula);
  return 1 / p.reduce((s, x) => s + x.rel, 0);
}

/** Độ truyền qua của tứ cực đặt ở setMz cho ion m/z (0–1), độ phân giải fwhm (u). */
export function transmission(mz, setMz, fwhm = LCMS.fwhm) {
  const x = (2 * Math.abs(mz - setMz)) / fwhm;
  return 1 / (1 + x ** 8);
}

/**
 * Điện áp của tứ cực khi lọc m/z ở đỉnh vùng bền: { V (RF, 0-đỉnh, vôn), U (DC, vôn), ratio U/V }.
 * r0 (mm) và tần số (MHz) là số điển hình.
 */
export function rfVoltage(mz, quad = LCMS.quad) {
  const m = mz * 1.66053906660e-27;
  const r0 = quad.r0 / 1000;
  const w = 2 * Math.PI * quad.freq * 1e6;
  const e = 1.602176634e-19;
  const V = (quad.qApex * m * r0 * r0 * w * w) / (4 * e);
  const U = (quad.aApex * m * r0 * r0 * w * w) / (8 * e);
  return { V, U, ratio: U / V };
}

/** Danh sách mọi chuyển tiếp của các chất: [{ analyte, index, precursor, product, ce, label, … }]. */
export function transitionsOf(names = Object.keys(ANALYTES)) {
  const out = [];
  for (const name of names) {
    const a = analyteOf(name);
    if (!a) continue;
    a.transitions.forEach((t, index) => {
      const precursor = protonated(a.formula);
      const product = cationMz(t.product);
      out.push({ analyte: a.name, index, precursor, product, ce: t.ce, ymax: t.ymax, w: t.w, bg: t.bg, loss: t.loss, role: index === 0 ? "định lượng" : "xác nhận", label: `${a.name} ${fmt(precursor, 1)} > ${fmt(product, 1)}` });
    });
  }
  return out;
}

/** Hiệu suất phân mảnh: phần ion tiền chất của chất a thành ion mảnh thứ i ở năng lượng va chạm ce (V). */
export function fragmentYield(a, i, ce) {
  const t = a.transitions[i];
  if (!t) return 0;
  return t.ymax * Math.exp(-(((ce - t.ce) / t.w) ** 2));
}

/** Phần ion tiền chất còn nguyên sau ô va chạm ở năng lượng ce (minh hoạ: giảm dần theo CE). */
export function survival(ce) {
  return Math.exp(-ce / 14);
}

/**
 * Đường đi của ion cho một chuyển tiếp: Q1 lọc tiền chất nào, ô va chạm tạo mảnh nào, Q3 cho mảnh nào qua.
 * Trả về { q1, q3, ce, species: [{ name, kind, mz, t1, fragments: [{ mz, y, t3, label }] }] }:
 * kind = "precursor" (tiền chất của mọi chất trong mẫu), "isotope" (đỉnh M+1 của chất chọn) hoặc "matrix" (ion nền).
 * t1, t3 là độ truyền qua Q1, Q3.
 */
export function ionPath(analyte = RUN.analyte, transition = RUN.transition, { ce, names = SAMPLE.map((s) => s.name) } = {}) {
  const a = analyteOf(analyte) ?? ANALYTES.caffeine;
  const t = a.transitions[clamp(Math.round(transition), 0, a.transitions.length - 1)];
  const q1 = protonated(a.formula);
  const q3 = cationMz(t.product);
  const e = ce ?? t.ce;
  const species = [];
  const seen = new Set([a.name, ...names]);
  for (const name of seen) {
    const b = analyteOf(name);
    if (!b) continue;
    const mz = protonated(b.formula);
    const fragments = b.transitions.map((bt, i) => { const fm = cationMz(bt.product); return { mz: fm, y: fragmentYield(b, i, e), t3: transmission(fm, q3), label: `${fmt(fm, 1)}` }; });
    fragments.push({ mz, y: survival(e), t3: transmission(mz, q3), label: "còn nguyên" });
    species.push({ name: b.name, kind: "precursor", mz, t1: transmission(mz, q1), fragments });
  }
  const iso = isotopePattern(a.formula)[1];
  species.push({ name: `${a.name} M+1`, kind: "isotope", mz: iso.mz, rel: iso.rel, t1: transmission(iso.mz, q1), fragments: [] });
  // Ion nền (cụm dung môi, chất nền): m/z cố định cho dễ lặp lại, minh hoạ
  for (const mz of [100.0757, 123.0913, 149.0233, 158.9614, 214.0896, 279.1591]) species.push({ name: `nền ${fmt(mz, 1)}`, kind: "matrix", mz, t1: transmission(mz, q1), fragments: [] });
  return { analyte: a.name, transition: a.transitions.indexOf(t), q1, q3, ce: e, rf1: rfVoltage(q1), rf3: rfVoltage(q3), species };
}

/**
 * Chuẩn hoá dữ liệu người dùng (từ địa chỉ #run=… hoặc từ app):
 * { analyte: "caffeine", transition: 0, conc: 50 (ng/mL), matrix: 0.2 (phần tín hiệu bị ức chế, 0–0,95),
 *   volume: 2 (µL), dwell: 20 (ms), ce (V, bỏ trống = tối ưu), seed, sample: [{ name, conc }] (các chất khác trong mẫu) }.
 * Trả về { run, sample, warnings } với giá trị đã kẹp vào giới hạn của máy.
 */
export function normalizeRun(input = {}) {
  const r = input && typeof input === "object" ? input : {};
  const warnings = [];
  let a = analyteOf(r.analyte ?? RUN.analyte);
  if (!a) { warnings.push(`không có dữ liệu cho chất "${String(r.analyte)}", dùng caffeine`); a = ANALYTES.caffeine; }
  const run = {
    analyte: a.name,
    transition: clamp(Math.round(num(r.transition, RUN.transition)), 0, a.transitions.length - 1),
    conc: clamp(num(r.conc, RUN.conc), 0, 100000),
    matrix: clamp(num(r.matrix, RUN.matrix), 0, 0.95),
    volume: clamp(num(r.volume, RUN.volume), 0.1, 50),
    dwell: clamp(num(r.dwell, RUN.dwell), LCMS.dwellMin, 500),
    ce: r.ce == null ? null : clamp(num(r.ce, 0), 0, 80),
    seed: Math.floor(num(r.seed, RUN.seed)) || 1,
  };
  for (const key of ["transition", "conc", "matrix", "volume", "dwell"]) if (r[key] != null && +r[key] !== run[key]) warnings.push(`${key} ngoài giới hạn, dùng ${run[key]}`);
  let sample = SAMPLE.map((s) => ({ ...s }));
  if (Array.isArray(r.sample)) {
    sample = [];
    for (const s of r.sample) {
      const b = analyteOf(s?.name);
      if (!b) { warnings.push(`không có dữ liệu cho chất "${String(s?.name ?? "")}"`); continue; }
      sample.push({ name: b.name, conc: clamp(num(s.conc, 0), 0, 100000) });
    }
  }
  const own = sample.find((s) => s.name === a.name);
  if (own) own.conc = run.conc;
  else sample.push({ name: a.name, conc: run.conc });
  return { run, sample, warnings };
}

/** Độ rộng do ngoài cột (ống nối, buồng phun ESI), σ tính bằng giây: số điển hình cho hệ UHPLC–MS, minh hoạ. */
export const EXTRA_COLUMN_S = 1.5;

/** Thời gian lưu và độ rộng pic (phút) của các chất trên cột LC-MS, từ mô hình HPLC cộng độ rộng ngoài cột. */
export function lcPeaks(sample = SAMPLE, method = LC_METHOD) {
  const list = HP.peaksOf(method, sample.map((s) => ({ name: s.name, conc: Math.max(s.conc, 1e-6) })), LC_COLUMN);
  const out = {};
  for (const p of list) out[p.name] = { tR: p.tR, sigma: Math.sqrt(p.sigma ** 2 + (EXTRA_COLUMN_S / 60) ** 2), N: p.N, k: p.k };
  return out;
}

/** Áp suất cột (bar) và giới hạn của bơm UHPLC. */
export function lcPressure(method = LC_METHOD) {
  return { pressure: HP.pressure(method, LC_COLUMN), limit: Math.min(LC_PMAX, LC_COLUMN.pMax), t0: HP.deadTime(method.flow, LC_COLUMN) };
}

/** Chu kỳ MRM (giây) khi đo n kênh với dwell và pause (ms). */
export function cycleTime(n, dwell = RUN.dwell, pause = LCMS.pauseMin) {
  return (n * (dwell + pause)) / 1000;
}

/** Nhiễu RMS (cps) của một kênh có nền bg (cps) đo với dwell (ms): Poisson cộng 5 % nhiễu hoá học. */
export function noiseOf(bg, dwell = RUN.dwell) {
  const tau = dwell / 1000;
  return Math.sqrt(bg / tau) + 0.05 * bg;
}

/**
 * Kết quả trọn vẹn một lần tiêm cho kênh MRM đã chọn.
 * Trả về { run, sample, analyte, channel, channels, cycle, peaks, tR, sigma, area, height, bg, noise, sn, lod, loq,
 *   me, points, saturated, tEnd, pressure, path }: diện tích (counts), chiều cao và nền (cps), LOD/LOQ (ng/mL),
 *   me (% ảnh hưởng nền), points (số điểm dữ liệu trên pic), path (đường đi của ion, xem ionPath).
 */
export function mrmRun(input = {}) {
  const { run, sample, warnings } = input.run && input.sample ? input : normalizeRun(input);
  const a = analyteOf(run.analyte);
  const names = sample.map((s) => s.name);
  const channels = transitionsOf(names);
  const channel = channels.find((c) => c.analyte === a.name && c.index === run.transition);
  const cycle = cycleTime(channels.length, run.dwell);
  const peaks = lcPeaks(sample);
  const lc = lcPressure();
  // Lượng chất trên cột (pg) = ng/mL × µL
  const suppression = run.matrix;
  const ce = run.ce ?? channel.ce;
  const rateOf = (b, conc) => RESPONSE * b.ie * (1 - suppression) * conc * run.volume * monoFraction(b.formula);
  // Đóng góp của mọi chất trong mẫu vào kênh đã chọn (thường chỉ chất chọn; chất đồng phân bị Q3 loại)
  const contrib = [];
  for (const s of sample) {
    const b = analyteOf(s.name);
    const t1 = transmission(protonated(b.formula), channel.precursor);
    if (t1 < 1e-6 || !(s.conc > 0)) continue;
    let y = 0;
    b.transitions.forEach((bt, i) => { y += fragmentYield(b, i, ce) * transmission(cationMz(bt.product), channel.product); });
    y += survival(ce) * transmission(protonated(b.formula), channel.product);
    const area = rateOf(b, s.conc) * t1 * y;
    if (area > 1e-3) contrib.push({ name: b.name, area, ...peaks[b.name] });
  }
  const bg = channel.bg * (1 + 2 * run.matrix);
  const noise = noiseOf(bg, run.dwell);
  const main = contrib.find((c) => c.name === a.name) ?? { area: 0, ...peaks[a.name] };
  const sigmaS = main.sigma * 60;
  const height = main.area / (sigmaS * Math.sqrt(2 * Math.PI));
  const perConc = run.conc > 0 ? height / run.conc : (RESPONSE * a.ie * (1 - suppression) * run.volume * monoFraction(a.formula) * fragmentYield(a, run.transition, ce)) / (sigmaS * Math.sqrt(2 * Math.PI));
  const lod = perConc > 0 ? (3 * noise) / perConc : Infinity;
  const loq = perConc > 0 ? (10 * noise) / perConc : Infinity;
  const tEnd = Math.ceil(Math.max(...Object.values(peaks).map((p) => p.tR + 6 * p.sigma), lc.t0 * 2) * 1.15 * 4) / 4;
  return {
    run,
    sample,
    warnings,
    analyte: a.name,
    hue: a.hue,
    channel: { ...channel, ce },
    channels,
    cycle,
    peaks,
    contrib,
    tR: main.tR,
    sigma: main.sigma,
    area: main.area,
    height,
    bg,
    noise,
    sn: height / noise,
    lod,
    loq,
    me: -suppression * 100,
    points: (4 * sigmaS) / cycle,
    saturated: height + bg > LCMS.saturation,
    tEnd,
    pressure: lc.pressure,
    t0: lc.t0,
    path: ionPath(a.name, run.transition, { ce, names }),
  };
}

function hash(n) {
  let x = Math.imul(n ^ 0x9e3779b9, 0x85ebca6b);
  x ^= x >>> 13;
  x = Math.imul(x, 0xc2b2ae35);
  x ^= x >>> 16;
  return ((x >>> 0) / 4294967296) * 2 - 1;
}

/** Tín hiệu thật (không nhiễu, cps) của kênh đã chọn ở phút t. */
export function idealAt(t, res) {
  let y = res.bg;
  for (const c of res.contrib) {
    const z = (t - c.tR) / c.sigma;
    if (Math.abs(z) < 8) y += (c.area / (c.sigma * 60 * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * z * z);
  }
  return Math.min(y, LCMS.saturation);
}

/**
 * Tín hiệu đo (cps) ở phút t: lấy mẫu theo chu kỳ MRM (mỗi chu kỳ một điểm dữ liệu), cộng nhiễu Poisson và
 * nhiễu hoá học có hạt giống, bão hoà ở 2 × 10⁷ cps.
 */
export function signalAt(t, res) {
  const i = Math.floor((t * 60) / res.cycle);
  const ti = (i * res.cycle) / 60;
  const ideal = idealAt(ti, res);
  const tau = res.run.dwell / 1000;
  const sd = Math.sqrt(ideal / tau) + 0.05 * res.bg;
  const g = (hash(res.run.seed * 7919 + i) + hash(res.run.seed * 104729 + i * 3 + 1) + hash(i * 13 + 5)) * 1.0;
  return Math.max(0, Math.min(LCMS.saturation, ideal + sd * g));
}

/** Sắc ký đồ MRM: mảng [phút, cps], một điểm cho mỗi chu kỳ MRM từ 0 tới tEnd. */
export function chromatogram(res, tEnd = res.tEnd) {
  const pts = [];
  const n = Math.floor((tEnd * 60) / res.cycle);
  for (let i = 0; i <= n; i++) {
    const t = (i * res.cycle) / 60;
    pts.push([t, signalAt(t, res)]);
  }
  return pts;
}

/** Đường chuẩn: diện tích (counts) ở các nồng độ (ng/mL), cùng kênh và nền mẫu; trả về { points, slope }. */
export function calibration(input = {}, concs = [1, 5, 10, 50, 100, 500]) {
  const base = normalizeRun(input);
  const points = concs.map((conc) => {
    const res = mrmRun(normalizeRun({ ...base.run, conc, sample: base.sample }));
    return { conc, area: res.area };
  });
  const slope = points.reduce((s, p) => s + p.conc * p.area, 0) / points.reduce((s, p) => s + p.conc * p.conc, 0);
  return { points, slope };
}

/** Số kiểu Việt Nam: dấu phẩy thập phân. */
export const fmt = (v, d = 2) => v.toFixed(d).replace(".", ",");

/** Số lớn gọn: 1,2 × 10⁶. */
export function sci(v, d = 1) {
  if (!Number.isFinite(v)) return "∞";
  if (v === 0) return "0";
  const e = Math.floor(Math.log10(Math.abs(v)));
  if (e >= -3 && e < 4) return fmt(v, Math.max(0, d - e));
  const sup = String(e).split("").map((c) => "⁰¹²³⁴⁵⁶⁷⁸⁹"["0123456789".indexOf(c)] ?? "⁻").join("");
  return `${fmt(v / 10 ** e, d)} × 10${sup}`;
}
