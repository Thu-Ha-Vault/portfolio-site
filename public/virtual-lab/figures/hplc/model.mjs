// Mô hình sắc ký lỏng hiệu năng cao (HPLC) pha đảo, đẳng dòng, dùng chung cho bản dựng (Node), trang hình
// và sau này cho lõi mô phỏng của app (src/core). Module thuần: không DOM, không Three.js.
//
// Máy làm mẫu: Agilent 1260 Infinity II LC (chồng module), theo Agilent InfinityLab LC Series
// Specification Compendium (bản 06/2023, bản chép: https://chemistry.unt.edu/system/files/agilent_1260_infinity_ii_lc-mwd_specifications.pdf):
// - Bơm bốn kênh G7111B: hai piston nối tiếp, dòng đặt 0,001–10 mL/phút, áp tối đa 600 bar tới 5 mL/phút
//   (200 bar tới 10 mL/phút), dao động áp < 2 % (thường < 1 %), bộ khử khí 4 kênh 1,5 mL/kênh,
//   trộn gradient áp thấp bằng van tỉ lệ, 180 × 396 × 436 mm.
// - Bộ tiêm mẫu Vialsampler G7129A: tiêm 0,1–100 µL, 0–600 bar, 132 lọ 2 mL, độ lặp diện tích < 0,25 % RSD,
//   320 × 396 × 468 mm.
// - Buồng cột G7116A (Multicolumn Thermostat): từ 10 °C dưới nhiệt độ phòng tới 85 °C, 160 × 435 × 436 mm
//   (datasheet 5991-7089EN).
// - Đầu dò UV bước sóng thay đổi G7114A (VWD): đèn deuterium, 190–600 nm, hai chùm tia; tế bào đo tiêu chuẩn
//   10 mm, 14 µL, chịu 40 bar (mã G1314-60186).
// Cột: C18 4,6 × 150 mm, hạt 5 µm (cỡ cột phân tích phổ biến, ví dụ ZORBAX Eclipse Plus C18); giới hạn áp
// của cột đặt 400 bar (chưa xác minh với datasheet cột).
//
// Mô hình:
// - Lưu giữ: mô hình cường độ dung môi tuyến tính (LSS, Snyder): log k = log kw − S·φ, φ là phần thể tích
//   acetonitrile. S ≈ 0,25·√M cho phân tử nhỏ (Snyder & Dolan, High-Performance Gradient Elution, Wiley 2007).
//   log kw chọn để thứ tự rửa giải đúng như thực tế trên C18 (theobromine < paracetamol < theophylline
//   < caffeine) và thời gian lưu cùng cỡ với các phương pháp đã công bố: SỐ MINH HOẠ, chưa đo.
// - Nhiệt độ: van 't Hoff, ln k giảm theo 1/T với ΔH ≈ −12 kJ/mol (giá trị điển hình cho phân tử nhỏ, minh hoạ).
// - Thời gian chết t0 = Vm / F, Vm = εT·π·(d/2)²·L, εT = 0,65 (điển hình cho hạt xốp toàn phần).
// - Thời gian lưu tR = t0·(1 + k).
// - Số đĩa N = L / H, H theo phương trình Knox h = A·ν^(1/3) + B/ν + C·ν (A = 1, B = 2, C = 0,05,
//   giá trị điển hình cho cột nhồi tốt), ν = u·dp / Dm.
// - Pic Gauss: σ = tR / √N, cộng thêm độ rộng của vùng mẫu tiêm (σ² = (Vinj/F)²/12).
// - Độ phân giải giữa hai pic kề nhau: Rs = (t2 − t1) / (2·(σ1 + σ2)).
// - Diện tích pic theo định luật Beer–Lambert: ∫A dt = ε·b·n / F (b = 1 cm, n số mol tiêm), nên diện tích
//   tỉ lệ thuận với nồng độ (đường chuẩn đi qua gốc toạ độ).
// - Áp suất: Kozeny–Carman, ΔP = 180·η·L·us·(1 − εe)² / (εe³·dp²), εe = 0,38, cộng áp của ống nối,
//   bộ trao đổi nhiệt và tế bào đo (ước lượng 8 bar cho mỗi mL/phút).
// - Độ nhớt hỗn hợp nước–acetonitrile ở 25 °C: bảng xấp xỉ theo các số liệu thường dẫn
//   (cực đại khoảng 0,99 mPa·s quanh 20 % acetonitrile), đổi theo nhiệt độ bằng hệ thức Andrade. Chưa xác minh từng số.
// - Sai số và ngẫu nhiên: độ lặp lưu lượng 0,07 % RSD (spec bơm), diện tích 0,25 % RSD (spec bộ tiêm),
//   nhiễu nền và trôi nền của đầu dò. Có hạt giống (seed) để chạy lại cho cùng kết quả.

/** Thông số máy, cột và phương pháp mặc định. */
export const HPLC = {
  pump: { flowMin: 0.001, flowMax: 10, pMax: 600, pMaxHigh: 200, highFlow: 5, ripple: 0.008, strokeUL: 100, flowRSD: 0.0007 },
  sampler: { volMin: 0.1, volMax: 100, areaRSD: 0.0025 },
  oven: { below: 10, max: 85, room: 25 },
  detector: { lambda: 273, range: [190, 600], path: 1.0, cellUL: 14, noise: 0.02, drift: 0.05 },
  column: { name: "C18 4,6 × 150 mm, 5 µm", L: 150, d: 4.6, dp: 5, epsT: 0.65, epsE: 0.38, pMax: 400 },
  knox: { A: 1, B: 2, C: 0.05 },
  system: { barPerFlow: 8 },
  solvents: { A: "nước + 0,1 % formic acid", B: "acetonitrile" },
};

/** Phương pháp mặc định: 10 % acetonitrile, 1,0 mL/phút, 30 °C, tiêm 10 µL, đo ở 273 nm. */
export const METHOD = { organic: 10, flow: 1.0, temp: 30, volume: 10, lambda: 273, seed: 7 };

/**
 * Các chất mẫu. logkw, S ở 25 °C trên C18 với nước/acetonitrile (minh hoạ), eps: hệ số hấp thụ mol ở 273 nm
 * (L·mol⁻¹·cm⁻¹, xấp xỉ), mw: khối lượng mol (g/mol), dm: hệ số khuếch tán trong pha động ở 25 °C (m²/s, xấp xỉ).
 */
export const COMPOUNDS = {
  theobromine: { name: "theobromine", mw: 180.16, logkw: 0.185, S: 3.4, eps: 10000, dm: 0.72e-9, hue: 32 },
  paracetamol: { name: "paracetamol", mw: 151.16, logkw: 0.3, S: 2.9, eps: 3000, dm: 0.78e-9, hue: 150 },
  theophylline: { name: "theophylline", mw: 180.16, logkw: 0.454, S: 3.4, eps: 10200, dm: 0.72e-9, hue: 200 },
  caffeine: { name: "caffeine", mw: 194.19, logkw: 0.765, S: 3.5, eps: 9740, dm: 0.68e-9, hue: 280 },
};
const ALIASES = { cafein: "caffeine", "cà phê": "caffeine", caffein: "caffeine", theobromin: "theobromine", theophyllin: "theophylline", acetaminophen: "paracetamol" };

/** Mẫu mặc định: hỗn hợp chuẩn methylxanthine (µg/mL). */
export const SAMPLE = [
  { name: "theobromine", conc: 20 },
  { name: "theophylline", conc: 20 },
  { name: "caffeine", conc: 50 },
];

const T25 = 298.15;
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const num = (v, d) => (Number.isFinite(+v) ? +v : d);

// Độ nhớt nước–acetonitrile ở 25 °C (mPa·s) theo phần thể tích acetonitrile 0; 0,1; …; 1 (xấp xỉ).
const ETA25 = [0.89, 0.97, 0.99, 0.94, 0.85, 0.76, 0.66, 0.57, 0.48, 0.41, 0.34];

/** Độ nhớt pha động (mPa·s) ở φ acetonitrile (0–1) và nhiệt độ °C. */
export function viscosity(phi, temp = 25) {
  const f = clamp(phi, 0, 1) * 10;
  const i = Math.min(9, Math.floor(f));
  const eta = ETA25[i] + (ETA25[i + 1] - ETA25[i]) * (f - i);
  const B = 1900 * (1 - phi) + 850 * phi; // hằng số Andrade (K), ước lượng
  return eta * Math.exp(B * (1 / (temp + 273.15) - 1 / T25));
}

/** Thể tích chết của cột (mL). */
export function voidVolume(col = HPLC.column) {
  return (col.epsT * Math.PI * (col.d / 2) ** 2 * col.L) / 1000;
}

/** Thời gian chết t0 (phút) ở lưu lượng flow (mL/phút). */
export function deadTime(flow, col = HPLC.column) {
  return voidVolume(col) / flow;
}

/** Hệ số lưu giữ k của một chất ở % acetonitrile và nhiệt độ cột. */
export function retentionFactor(c, organic, temp = 25) {
  const phi = organic / 100;
  const k25 = 10 ** (c.logkw - c.S * phi);
  return k25 * Math.exp(1443 * (1 / (temp + 273.15) - 1 / T25));
}

/** Số đĩa lý thuyết N theo phương trình Knox. */
export function plateNumber(c, m, col = HPLC.column, knox = HPLC.knox) {
  const phi = m.organic / 100;
  const t0s = deadTime(m.flow, col) * 60;
  const u = col.L / 1000 / t0s; // m/s
  const dm = c.dm * ((m.temp + 273.15) / T25) * (viscosity(phi, 25) / viscosity(phi, m.temp));
  const nu = (u * col.dp * 1e-6) / dm;
  const h = knox.A * Math.cbrt(nu) + knox.B / nu + knox.C * nu;
  return (col.L * 1000) / (h * col.dp);
}

/** Áp suất của hệ (bar) ở phương pháp m: áp qua cột (Kozeny–Carman) cộng áp của ống nối và tế bào đo. */
export function pressure(m, col = HPLC.column) {
  const eta = viscosity(m.organic / 100, m.temp) * 1e-3;
  const area = Math.PI * (col.d / 2000) ** 2;
  const us = m.flow / 60e6 / area;
  const e = col.epsE;
  const dp = col.dp * 1e-6;
  const pa = (180 * eta * (col.L / 1000) * us * (1 - e) ** 2) / (e ** 3 * dp * dp);
  return pa / 1e5 + HPLC.system.barPerFlow * m.flow * (viscosity(m.organic / 100, m.temp) / 0.89);
}

/** Giới hạn áp đang áp dụng (bar): nhỏ hơn giữa giới hạn của bơm ở lưu lượng này và giới hạn của cột. */
export function pressureLimit(m, col = HPLC.column) {
  const pump = m.flow <= HPLC.pump.highFlow ? HPLC.pump.pMax : HPLC.pump.pMaxHigh;
  return Math.min(pump, col.pMax);
}

/** Chu kỳ một hành trình piston (giây): thể tích hành trình / lưu lượng. */
export function strokePeriod(m) {
  return (HPLC.pump.strokeUL / 1000 / m.flow) * 60;
}

/** Áp suất tức thời (bar) có dao động theo nhịp piston, t tính bằng giây. */
export function pressureAt(m, t) {
  const p = pressure(m);
  const ph = (t / strokePeriod(m)) % 1;
  return p * (1 + HPLC.pump.ripple * Math.sin(2 * Math.PI * ph) * (ph < 0.5 ? 1 : 0.4));
}

// Số giả ngẫu nhiên có hạt giống (mulberry32) và phân phối chuẩn (Box–Muller).
export function rng(seed = 1) {
  let a = seed >>> 0;
  const next = () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  next.gauss = () => Math.sqrt(-2 * Math.log(next() + 1e-12)) * Math.cos(2 * Math.PI * next());
  return next;
}

/** Tìm chất theo tên (không phân biệt hoa thường, nhận vài tên tiếng Việt). */
export function compoundOf(name) {
  const key = String(name ?? "").trim().toLowerCase();
  return COMPOUNDS[ALIASES[key] ?? key] ?? null;
}

/**
 * Các pic của một lần tiêm. Trả về mảng đã sắp theo thời gian lưu:
 * { name, conc, k, t0, tR (phút), sigma (phút), N, area (mAU·s), height (mAU), Rs (với pic trước, hoặc null) }.
 */
export function peaksOf(m = METHOD, sample = SAMPLE, col = HPLC.column) {
  const rand = rng(m.seed ?? 1);
  const t0 = deadTime(m.flow, col);
  const flowLs = m.flow / 60 / 1000;
  const sigInj = ((m.volume / 1000 / m.flow) * 60) / Math.sqrt(12); // giây
  const shift = 1 + HPLC.pump.flowRSD * rand.gauss(); // lưu lượng thật lệch chút ít so với đặt
  const list = [];
  for (const s of sample) {
    const c = compoundOf(s.name);
    if (!c || !(s.conc > 0)) continue;
    const k = retentionFactor(c, m.organic, m.temp);
    const tR = (t0 * (1 + k)) / shift;
    const N = plateNumber(c, m, col);
    const sigma = Math.sqrt(((tR * 60) / Math.sqrt(N)) ** 2 + sigInj ** 2) / 60;
    const mol = (s.conc * (m.volume / 1000) * 1e-6) / c.mw;
    const area = ((c.eps * HPLC.detector.path * mol) / flowLs) * 1000 * (1 + HPLC.sampler.areaRSD * rand.gauss());
    const height = area / (sigma * 60 * Math.sqrt(2 * Math.PI));
    list.push({ name: c.name, conc: s.conc, hue: c.hue, k, t0, tR, sigma, N, area, height, Rs: null });
  }
  list.sort((a, b) => a.tR - b.tR);
  list.forEach((p, i) => { if (i) p.Rs = resolution(list[i - 1], p); });
  return list;
}

/** Độ phân giải giữa hai pic. */
export function resolution(a, b) {
  return Math.abs(b.tR - a.tR) / (2 * (a.sigma + b.sigma));
}

/** Thời gian chạy hợp lý (phút): đủ cho pic cuối ra hết, làm tròn lên 0,5 phút. */
export function runTime(peaks, m = METHOD) {
  const t0 = deadTime(m.flow);
  const end = peaks.length ? Math.max(...peaks.map((p) => p.tR + 5 * p.sigma)) : t0 * 2;
  return Math.ceil(Math.max(end * 1.12, t0 * 2) * 2) / 2;
}

/** Tín hiệu đầu dò (mAU) ở phút t: tổng các pic Gauss cộng nhiễu nền và trôi nền (có hạt giống). */
export function signalAt(t, peaks, m = METHOD) {
  let y = 0;
  for (const p of peaks) {
    const z = (t - p.tR) / p.sigma;
    if (Math.abs(z) < 8) y += p.height * Math.exp(-0.5 * z * z);
  }
  // Nhiễu: hai thành phần, lấy theo ô thời gian 0,6 s để đường vẽ ổn định khi vẽ lại.
  const seed = (m.seed ?? 1) * 7919;
  const cell = Math.floor(t * 100);
  const f = cell - t * 100;
  const n0 = hash(seed + cell);
  const n1 = hash(seed + cell + 1);
  const noise = (n0 + (n1 - n0) * -f) * HPLC.detector.noise;
  // Trôi nền của dải hấp thụ dung môi và vết "đỉnh dung môi" nhỏ ở t0 do khác biệt chiết suất.
  const t0 = deadTime(m.flow);
  const dip = -0.6 * Math.exp(-0.5 * ((t - t0) / (t0 * 0.03)) ** 2) + 0.35 * Math.exp(-0.5 * ((t - t0 * 1.06) / (t0 * 0.03)) ** 2);
  return y + noise + HPLC.detector.drift * t + dip;
}
function hash(n) {
  let x = Math.imul(n ^ 0x9e3779b9, 0x85ebca6b);
  x ^= x >>> 13;
  x = Math.imul(x, 0xc2b2ae35);
  x ^= x >>> 16;
  return ((x >>> 0) / 4294967296) * 2 - 1;
}

/** Sắc ký đồ: mảng [phút, mAU] từ 0 tới tEnd, n điểm. */
export function chromatogram(peaks, m = METHOD, { tEnd = runTime(peaks, m), n = 600 } = {}) {
  const pts = [];
  for (let i = 0; i <= n; i++) {
    const t = (tEnd * i) / n;
    pts.push([t, signalAt(t, peaks, m)]);
  }
  return pts;
}

/** Diện tích pic dự đoán theo nồng độ (đường chuẩn): trả về hệ số mAU·s cho 1 µg/mL ở phương pháp m. */
export function responseFactor(name, m = METHOD) {
  const c = compoundOf(name);
  if (!c) return 0;
  const mol = ((m.volume / 1000) * 1e-6) / c.mw;
  return ((c.eps * HPLC.detector.path * mol) / (m.flow / 60 / 1000)) * 1000;
}

/**
 * Chuẩn hoá dữ liệu người dùng (ví dụ từ địa chỉ #run=…):
 * { organic: 30, flow: 1.0, temp: 30, volume: 10, seed: 7, sample: [{ name: "caffeine", conc: 50 }] }.
 * Trả về { method, sample, warnings } với giá trị đã kẹp vào giới hạn của máy.
 */
export function normalizeRun(run = {}) {
  const warnings = [];
  const r = run && typeof run === "object" ? run : {};
  const room = HPLC.oven.room;
  const method = {
    organic: clamp(num(r.organic, METHOD.organic), 0, 100),
    flow: clamp(num(r.flow, METHOD.flow), HPLC.pump.flowMin, HPLC.pump.flowMax),
    temp: clamp(num(r.temp, METHOD.temp), room - HPLC.oven.below, HPLC.oven.max),
    volume: clamp(num(r.volume, METHOD.volume), HPLC.sampler.volMin, HPLC.sampler.volMax),
    lambda: HPLC.detector.lambda,
    seed: Math.floor(num(r.seed, METHOD.seed)) || 1,
  };
  for (const key of ["organic", "flow", "temp", "volume"]) if (r[key] != null && +r[key] !== method[key]) warnings.push(`${key} ngoài giới hạn, dùng ${method[key]}`);
  let sample = SAMPLE;
  if (Array.isArray(r.sample)) {
    sample = [];
    for (const s of r.sample) {
      const c = compoundOf(s?.name);
      if (!c) { warnings.push(`không có dữ liệu cho chất "${String(s?.name ?? "")}"`); continue; }
      sample.push({ name: c.name, conc: clamp(num(s.conc, 0), 0, 5000) });
    }
  }
  return { method, sample, warnings };
}

/**
 * Kết quả trọn vẹn của một lần chạy: áp suất, giới hạn, có quá áp không, các pic, thời gian chạy.
 * Quá áp thì bơm dừng và không có sắc ký đồ (như máy thật).
 */
export function runOf(m = METHOD, sample = SAMPLE) {
  const p = pressure(m);
  const limit = pressureLimit(m);
  const over = p > limit;
  const peaks = over ? [] : peaksOf(m, sample);
  return { pressure: p, limit, over, t0: deadTime(m.flow), peaks, tEnd: over ? 1 : runTime(peaks, m), viscosity: viscosity(m.organic / 100, m.temp) };
}

/** Số kiểu Việt Nam: dấu phẩy thập phân. */
export const fmt = (v, d = 2) => v.toFixed(d).replace(".", ",");
