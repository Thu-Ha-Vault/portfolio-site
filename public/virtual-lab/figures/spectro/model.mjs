// Mô hình máy quang phổ UV-Vis hai chùm tia, dùng chung cho bản dựng (build.mjs), trang (live.js)
// và sau này cho lõi mô phỏng của app (src/core). Module thuần: không DOM, không Three.js.
//
// Máy vẽ theo hình dáng Shimadzu UV-1900i. Số liệu của máy lấy từ tờ thông số "UV-1900i Typical
// Specifications" (Shimadzu C101-E161, First Edition 11/2019; bản PDF do Wolf Labs phân phối:
// https://www.wolflabs.co.uk/documents/Shimadzu_Spectrophotometer_UV-1900i.pdf). Hãng ghi rõ đây là giá
// trị điển hình, không phải giá trị bảo đảm.
//   - Dải bước sóng 190–1 100 nm, độ rộng khe phổ 1 nm, bước đặt 0,1 nm.
//   - Độ đúng bước sóng ±0,3 nm toàn dải (±0,05 nm ở vạch D2 656,1 nm), độ lặp ±0,025 nm.
//   - Tốc độ dời bước sóng khoảng 29 000 nm/phút; tốc độ quét 3 000 đến 2 nm/phút.
//   - Đổi đèn tự động theo bước sóng, đặt được trong khoảng 295–364 nm.
//   - Ánh sáng lạc: < 0,004 % ở 220 nm (NaI), < 0,004 % ở 340 nm (NaNO2), < 0,15 % ở 198 nm (KCl).
//   - Hệ đo hai chùm tia. Dải đo: −4 đến 4 Abs, 0–400 %T.
//   - Độ đúng quang học: ±0,0015 Abs ở 0,5 Abs; ±0,002 Abs ở 1,0 Abs; ±0,004 Abs ở 2,0 Abs.
//   - Độ lặp quang học: < ±0,00002 Abs ở 0,5 Abs; < ±0,00003 ở 1 Abs; < ±0,00007 ở 2 Abs.
//   - Nhiễu < 0,00001 Abs (700 nm). Đèn halogen 20 W và đèn deuterium. Cách tử toàn ký (holographic)
//     blazed, lắp kiểu Czerny-Turner. Đầu thu photodiode silicon. Buồng mẫu 110 × 250 × 115 mm,
//     hai chùm tia cách nhau 100 mm. Máy 450 × 501 × 244 mm, 16,6 kg, 140 VA.
//
// Số liệu hoá chất:
//   - p-nitrophenol trong kiềm (ion p-nitrophenolate, pH 9,8): ε = 18,5 mM⁻¹·cm⁻¹ ở 405 nm, hằng số dùng
//     trong quy trình chuẩn của Sigma-Aldrich "Enzymatic Assay of Alkaline Phosphatase (DEA assay)"
//     (https://www.sigmaaldrich.com/US/en/technical-documents/protocol/protein-biology/enzyme-activity-assays/enzymatic-assay-of-alkaline-phosphatase-diethanolamine-assay).
//     Các tài liệu khác ghi 18,3–18,4 mM⁻¹·cm⁻¹, cực đại hấp thụ khoảng 400–405 nm.
//   - NADH: ε = 6,22 mM⁻¹·cm⁻¹ ở 340 nm (giá trị chuẩn trong các quy trình enzyme), dải thứ hai ở 259 nm
//     ε ≈ 14,4 mM⁻¹·cm⁻¹ (chưa xác minh với nguồn gốc).
//   - Độ rộng các dải hấp thụ (σ của hàm Gauss) là ước lượng để phổ có dáng gần giống phổ thật,
//     chưa xác minh: p-nitrophenolate σ ≈ 34 nm, NADH σ ≈ 24 nm.
//
// Phần quang học bên trong (vị trí đèn, gương, cách tử, bộ chia chùm) không có sơ đồ của hãng: vẽ theo
// cấu tạo điển hình của máy hai chùm Czerny-Turner. Mật độ vạch cách tử 1 200 vạch/mm là giá trị điển
// hình, chưa xác minh cho model này.

/** Thông số máy (đơn vị ghi ở từng trường). */
export const SPEC = {
  model: "UV-1900i",
  range: [190, 1100], // nm
  bandwidth: 1, // nm, độ rộng khe phổ
  step: 0.1, // nm, bước đặt bước sóng
  accuracy: 0.3, // nm, độ đúng bước sóng toàn dải
  repeatability: 0.025, // nm
  slew: 29000, // nm/phút, tốc độ dời bước sóng
  scanSpeeds: [3000, 2], // nm/phút, nhanh nhất và chậm nhất
  lampSwitch: 340, // nm, bước sóng đổi đèn mặc định (đặt được 295–364 nm)
  lampSwitchRange: [295, 364],
  absRange: [-4, 4], // Abs
  tRange: [0, 400], // %T
  noise: 0.00001, // Abs ở 700 nm
  beamGap: 100, // mm, khoảng cách hai chùm tia trong buồng mẫu
  compartment: [110, 250, 115], // mm, rộng × sâu × cao bên trong buồng mẫu
  size: [450, 501, 244], // mm, rộng × sâu × cao của máy
  mass: 16.6, // kg
  power: 140, // VA
};

/** Ánh sáng lạc theo hãng: [bước sóng nm, phần ánh sáng lạc (0–1)]. */
export const STRAY_POINTS = [
  [198, 0.0015], // 0,15 % (KCl)
  [220, 0.00004], // 0,004 % (NaI)
  [340, 0.00004], // 0,004 % (NaNO2)
];

/** Độ đúng quang học của hãng: [A, sai số tối đa Abs]. */
export const ACCURACY_POINTS = [
  [0.5, 0.0015],
  [1.0, 0.002],
  [2.0, 0.004],
];

/** Độ lặp quang học của hãng: [A, độ lệch Abs]. */
export const REPEAT_POINTS = [
  [0.5, 0.00002],
  [1.0, 0.00003],
  [2.0, 0.00007],
];

/** Cách tử: mật độ vạch (vạch/mm, chưa xác minh) và bậc nhiễu xạ dùng. */
export const GRATING = { lines: 1200, order: 1 };

/** Cuvet thạch anh chuẩn: quang trình 10 mm, thể tích 2,5–4,0 mL theo tờ thông số. */
export const CUVETTE = { path: 1, volume: [2.5, 4.0] }; // cm, mL

/**
 * Các chất mẫu, mỗi chất là tổng các dải hấp thụ dạng Gauss.
 * ε tính bằng L·mol⁻¹·cm⁻¹, center và sigma tính bằng nm. `at` là bước sóng hay đo của chất.
 */
export const SAMPLES = {
  pnp: {
    name: "p-nitrophenol (pH 9,8)",
    short: "p-nitrophenol",
    at: 405,
    bands: [{ center: 405, sigma: 34, eps: 18500 }],
    color: "vàng",
  },
  nadh: {
    name: "NADH",
    short: "NADH",
    at: 340,
    bands: [
      { center: 340, sigma: 24, eps: 6220 },
      { center: 259, sigma: 14, eps: 14400 },
    ],
    color: "không màu",
  },
};

/** Dãy nồng độ mẫu chuẩn (mol/L) cho đường chuẩn, dùng chung cho hình và app. */
export const STANDARDS = [0, 10e-6, 25e-6, 50e-6, 100e-6, 150e-6, 200e-6];

const lerp = (a, b, t) => a + (b - a) * t;

/**
 * Nội suy tuyến tính trong bảng [x, y] đã sắp tăng dần; ngoài bảng thì giữ giá trị đầu/cuối.
 * @param {Array<[number, number]>} table
 * @param {number} x
 */
export function interp(table, x) {
  if (x <= table[0][0]) return table[0][1];
  for (let i = 1; i < table.length; i++) {
    if (x <= table[i][0]) {
      const [x0, y0] = table[i - 1];
      const [x1, y1] = table[i];
      return lerp(y0, y1, (x - x0) / (x1 - x0));
    }
  }
  return table[table.length - 1][1];
}

/**
 * Hệ số hấp thụ mol ε(λ) của một chất, L·mol⁻¹·cm⁻¹.
 * @param {object|string} sample  một mục trong SAMPLES hoặc khoá của nó ("pnp", "nadh")
 * @param {number} lambda  bước sóng, nm
 */
export function epsilonAt(sample, lambda) {
  const s = typeof sample === "string" ? SAMPLES[sample] : sample;
  return s.bands.reduce((sum, b) => sum + b.eps * Math.exp(-0.5 * ((lambda - b.center) / b.sigma) ** 2), 0);
}

/**
 * Định luật Beer–Lambert: A = ε·l·c.
 * @param {number} eps  L·mol⁻¹·cm⁻¹
 * @param {number} l    quang trình, cm
 * @param {number} c    nồng độ, mol/L
 * @returns {number} độ hấp thụ thật (Abs)
 */
export const beerLambert = (eps, l, c) => eps * l * c;

/** Độ truyền qua T (0–1) từ độ hấp thụ A: T = 10^(−A). */
export const transmittance = (A) => 10 ** -A;

/** Độ hấp thụ từ độ truyền qua T (0–1): A = −log10 T. */
export const absorbanceOf = (T) => -Math.log10(Math.max(T, 1e-12));

/**
 * Phần ánh sáng lạc s(λ) (0–1) theo thông số hãng: nội suy theo log giữa 198 và 220 nm,
 * giữ 0,004 % từ 220 nm trở lên (trên 340 nm hãng không ghi, giả định như ở 340 nm: chưa xác minh).
 * @param {number} lambda nm
 */
export function strayAt(lambda) {
  if (lambda <= STRAY_POINTS[0][0]) return STRAY_POINTS[0][1];
  if (lambda >= STRAY_POINTS[1][0]) return STRAY_POINTS[1][1];
  const [x0, y0] = STRAY_POINTS[0];
  const [x1, y1] = STRAY_POINTS[1];
  return 10 ** lerp(Math.log10(y0), Math.log10(y1), (lambda - x0) / (x1 - x0));
}

/**
 * Độ hấp thụ máy đọc được khi có ánh sáng lạc s: A_đo = −log10((T + s) / (1 + s)).
 * Ánh sáng lạc đi tới đầu thu mà không qua mẫu, nên ở A cao số đọc cong xuống và không vượt
 * được −log10(s / (1 + s)).
 * @param {number} A  độ hấp thụ thật
 * @param {number} s  phần ánh sáng lạc (0–1)
 */
export const strayAbsorbance = (A, s) => -Math.log10((transmittance(A) + s) / (1 + s));

/**
 * Độ hấp thụ thật mà tại đó số đọc lệch khỏi đường thẳng một tỉ lệ `tol` (mặc định 1 %).
 * @param {number} s  phần ánh sáng lạc
 * @param {number} tol
 */
export function linearLimit(s, tol = 0.01) {
  let lo = 0;
  let hi = 8;
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    if ((mid - strayAbsorbance(mid, s)) / mid > tol) hi = mid;
    else lo = mid;
  }
  return (lo + hi) / 2;
}

/**
 * Đèn đang dùng ở bước sóng λ: "D2" (deuterium, tử ngoại) dưới điểm đổi đèn, "WI" (halogen) từ đó trở lên.
 * @param {number} lambda nm
 * @param {number} [at] bước sóng đổi đèn, nm (295–364)
 */
export const lampFor = (lambda, at = SPEC.lampSwitch) => (lambda < at ? "D2" : "WI");

/**
 * Góc quay của cách tử (rad, tính từ đường phân giác của hai gương) để ra bước sóng λ, lắp Czerny-Turner:
 * m·λ = 2·d·cos(φ)·sin(θ), với d là khoảng cách vạch, φ là nửa góc giữa chùm tới và chùm nhiễu xạ.
 * @param {number} lambda nm
 * @param {number} phi    nửa góc lệch, rad (lấy từ hình học của bản vẽ)
 * @param {object} [g]    GRATING
 */
export function gratingAngle(lambda, phi, g = GRATING) {
  const d = 1e6 / g.lines; // nm
  return Math.asin(Math.min(1, (g.order * lambda) / (2 * d * Math.cos(phi))));
}

/**
 * Sai số dương lớn nhất của độ đúng quang học theo hãng ở độ hấp thụ A (nội suy, giữ đầu mút).
 * @param {number} A
 */
export const accuracyAt = (A) => interp([[0, 0], ...ACCURACY_POINTS], Math.abs(A)); // dưới 0,5 Abs coi như tỉ lệ với A (chưa xác minh)

/**
 * Độ lệch chuẩn của số đọc lặp lại ở độ hấp thụ A (Abs), từ độ lặp quang học và nhiễu của hãng.
 * @param {number} A
 */
export const repeatSigma = (A) => Math.hypot(interp(REPEAT_POINTS, Math.abs(A)), SPEC.noise);

/**
 * Bộ sinh số ngẫu nhiên có seed (mulberry32), để chạy lại được cùng một kết quả.
 * @param {number} seed
 * @returns {() => number} hàm trả số trong [0, 1)
 */
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

/** Số ngẫu nhiên phân bố chuẩn (Box–Muller) từ một hàm rand() trong [0, 1). */
export function gauss(rand) {
  const u = Math.max(rand(), 1e-12);
  const v = rand();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

/**
 * Một lần đo: từ độ hấp thụ thật ra số máy hiển thị.
 * Gồm ánh sáng lạc ở bước sóng đó, sai lệch hệ thống trong giới hạn độ đúng của hãng (`bias`, −1…1,
 * cố định cho một máy) và nhiễu ngẫu nhiên theo độ lặp. Kết quả bị kẹp trong dải đo −4…4 Abs.
 * @param {number} A       độ hấp thụ thật
 * @param {number} lambda  nm
 * @param {{ rand?: () => number, bias?: number }} [opts]
 * @returns {{ A: number, T: number, stray: number, over: boolean }} A đo được, T (0–1), s dùng, có vượt dải không
 */
export function measure(A, lambda, { rand = Math.random, bias = 0.3 } = {}) {
  const s = strayAt(lambda);
  let a = strayAbsorbance(A, s);
  a += bias * accuracyAt(a) + gauss(rand) * repeatSigma(a);
  const over = a > SPEC.absRange[1];
  a = Math.min(SPEC.absRange[1], Math.max(SPEC.absRange[0], a));
  return { A: a, T: transmittance(a), stray: s, over };
}

/**
 * Phổ hấp thụ thật của một dung dịch: mảng [λ, A] từ `from` tới `to` nm, bước `step` nm.
 * @param {object|string} sample
 * @param {number} c       mol/L
 * @param {{ from?: number, to?: number, step?: number, l?: number }} [opts]
 */
export function spectrum(sample, c, { from = 300, to = 700, step = 1, l = CUVETTE.path } = {}) {
  const out = [];
  for (let x = from; x <= to + 1e-9; x += step) out.push([x, beerLambert(epsilonAt(sample, x), l, c)]);
  return out;
}

/** Bước sóng có A lớn nhất trong một phổ [λ, A]. */
export const peakOf = (spec) => spec.reduce((best, p) => (p[1] > best[1] ? p : best), spec[0]);

/** Thời gian thật (giây) để quét từ `from` tới `to` nm ở tốc độ `speed` nm/phút. */
export const scanSeconds = (from, to, speed) => (Math.abs(to - from) / speed) * 60;

/** Thời gian thật (giây) để dời cách tử giữa hai bước sóng ở tốc độ dời của hãng. */
export const slewSeconds = (from, to) => (Math.abs(to - from) / SPEC.slew) * 60;

/** Định dạng số kiểu Việt Nam (dấu phẩy thập phân). */
export const fmt = (v, digits = 3) => v.toFixed(digits).replace(".", ",").replace("-", "−");

/** Nồng độ mol/L ra chuỗi µM. */
export const fmtMicro = (c) => `${fmt(c * 1e6, 0)} µM`;
