// Mô hình máy đọc vi đĩa đo độ hấp thụ, dùng chung cho bản dựng (build.mjs), trang (live.js)
// và sau này cho lõi mô phỏng của app (src/core). Module thuần: không DOM, không Three.js, không import.
//
// Máy vẽ theo hình dáng Agilent BioTek Epoch 2 (cấu hình EPOCH2TS: có màn hình cảm ứng, không cổng cuvet).
// Số liệu máy lấy từ tờ thông số của hãng:
//   - "Agilent BioTek Epoch 2 Microplate Spectrophotometer", 5994-7629EN (06/2025), mục Technical details
//     (bản đăng trong hồ sơ thầu: https://storage.mtender.gov.md/get/15edd0aa-ae9e-4036-8ac4-6788a64f5c3c-1763554218271;
//     bản gốc của hãng: https://www.agilent.com/cs/library/specifications/public/Epoch-2-technical-details-5994-5374EN-agilent.pdf).
//   - Bản tiếng Nhật 5994-2742JAJP (03/2022): https://www.chem-agilent.com/pdf/biotek-ds-epoch-2-microplate-spectrophotometer-5994-2742ja-jp-hr-agilent.pdf
//   Đèn xenon chớp (xenon flash), đầu thu photodiode, chọn bước sóng bằng monochromator, 200–999 nm bước 1 nm,
//   độ rộng dải 2,9 nm, độ đúng bước sóng ±2 nm, độ lặp ±0,2 nm. Dải đo 0–4,0 OD, độ phân giải 0,001 OD
//   (phần mềm trên máy) hoặc 0,0001 OD (Gen5). Độ đúng OD < 1 % ở 2,0 OD, < 3 % ở 2,5 OD; độ tuyến tính < 1 %
//   trong 0–2,5 OD; độ lặp < 0,5 % ở 2,0 OD (bản JP; bản 2025 ghi < 1 % trong 0–2,5 OD); ánh sáng lạc 0,03 %
//   ở 230 nm. Đọc quét (sweep) 96 giếng 8 s, 384 giếng 14 s (đo động học, dưới Gen5). Vi đĩa 6–384 giếng.
//   Ủ nhiệt 4 vùng tới 65 °C, lắc thẳng/quỹ đạo/quỹ đạo kép. Nguồn ngoài 24 V DC, tối đa 60 W.
//   Kích thước bản màn hình cảm ứng 32 × 32,3 × 39,54 cm (cao × rộng × sâu), 11,34 kg.
//   Máy có một kênh quang (một đầu thu, đọc lần lượt từng giếng): suy ra từ "photodiode" số ít và kiểu
//   "sweep read"; chưa xác minh bằng sơ đồ của hãng.
//
// Vi đĩa: kích thước theo chuẩn ANSI/SLAS 1-2004 và 4-2004 (127,76 × 85,48 mm, cao 14,35 mm, giếng A1 cách
//   mép trái 14,38 mm, mép trên 11,24 mm, bước giếng 9 mm). Giếng đáy phẳng 96 giếng Corning (ví dụ 3590):
//   đường kính miệng 6,86 mm, đáy 6,35 mm, sâu 10,67 mm, diện tích đáy 0,3165 cm², tối đa 360 µL
//   (Corning "Microplate Dimensions 96-384-1536": https://csmedia.corning.com/catalog/cls/documents/drawings/MicroplateDimensions96-384-1536.pdf).
//   Quang trình l = chiều cao cột chất lỏng, tính từ thể tích trong giếng hình nón cụt. 200 µL → khoảng 0,61 cm
//   (bỏ qua mặt khum; mặt khum lõm làm quang trình ở tâm giếng ngắn đi, đo thật thường 0,55–0,6 cm).
//
// Bradford: Bio-Rad Quick Start Bradford (manual 4110065A, https://text.www2.warwick.ac.uk/fac/sci/chemistry/research/bugg/bugggroup/protocols/protein/biorad_proteinassay.pdf):
//   vi đĩa 5 µL mẫu + 250 µL thuốc thử, đọc 595 nm, dãy chuẩn BSA 125–2 000 µg/mL, tuyến tính 125–1 000 µg/mL.
//   Coomassie Brilliant Blue G-250 tự do dạng cation đỏ nâu (470 nm), gắn protein thành dạng anion xanh (595 nm).
//   Dáng đường chuẩn (độ hấp thụ của mẫu trắng, độ cong) là ước lượng theo đường chuẩn điển hình, chưa xác minh:
//   A595 mẫu trắng ≈ 0,45; A thực (đã trừ trắng) = Amax·c/(K + c), Amax = 2,25, K = 3 000 µg/mL ở 255 µL.
//
// p-nitrophenol: ε405 = 18 500 L·mol⁻¹·cm⁻¹ ở pH ≥ 9,8 (Sigma-Aldrich, "Enzymatic Assay of Alkaline
//   Phosphatase (DEA assay)"), cùng hằng số với figures/spectro/model.mjs. Động học phosphatase kiềm với pNPP:
//   Km ≈ 0,5 mM là giá trị điển hình, chưa xác minh cho điều kiện này.
//
// Sai số của máy (mô hình): độ lệch ngẫu nhiên σ = 0,25 % · A + 0,0005 OD (coi độ lặp 0,5 % ở 2,0 OD là
//   khoảng 2σ), độ lệch hệ thống của cả đĩa trong ±0,5 % (nửa độ đúng 1 %), ánh sáng lạc 0,03 % làm bão hoà ở
//   OD cao, trên 4,0 OD máy báo "OVRFLW" (cách Gen5 hiển thị giếng tràn thang; chưa xác minh chữ hiển thị),
//   làm tròn 0,001 OD. Sai số pipet (CV 1 % cho 200–250 µL, 2 % cho 5 µL) là ước lượng, chưa xác minh.

/** Thông số máy. Đơn vị ghi ở từng trường. */
export const SPEC = {
  model: "Epoch 2",
  range: [200, 999], // nm, bước 1 nm
  bandwidth: 2.9, // nm
  wlAccuracy: 2, // ± nm
  wlRepeat: 0.2, // ± nm
  odRange: [0, 4], // OD
  resolution: 0.001, // OD, phần mềm trên máy (0,0001 dưới Gen5)
  accuracy: [[2.0, 0.01], [2.5, 0.03]], // [OD, sai số tương đối tối đa]
  linearity: 0.01, // trong 0–2,5 OD
  repeat: 0.005, // ở 2,0 OD
  stray: 0.0003, // 0,03 % ở 230 nm
  sweep96: 8, // s, đọc quét 96 giếng
  sweep384: 14, // s
  incubation: 65, // °C tối đa
  power: 60, // W tối đa, nguồn ngoài 24 V DC
  size: [323, 395.4, 320], // mm, rộng × sâu × cao (bản màn hình cảm ứng)
  mass: 11.34, // kg
  lamp: "xenon flash",
  detector: "photodiode",
};

/** Vi đĩa 96 giếng chuẩn SLAS, giếng Corning đáy phẳng. Đơn vị mm, µL. */
export const PLATE = {
  size: [127.76, 85.48], // rộng (cột 1→12) × sâu (hàng A→H)
  height: 14.35,
  a1: [14.38, 11.24], // tâm A1 cách mép trái, mép trên
  pitch: 9,
  rows: 8,
  cols: 12,
  well: { top: 6.86, bottom: 6.35, depth: 10.67, max: 360 },
};

export const ROWS = "ABCDEFGH";
/** Tên giếng từ chỉ số hàng r (0–7) và cột c (0–11): (0, 0) → "A1". */
export const wellId = (r, c) => `${ROWS[r]}${c + 1}`;
/** Đổi "B7" → { r: 1, c: 6 }; trả null nếu tên không hợp lệ. */
export function parseWell(id) {
  const m = /^([A-Ha-h])(\d{1,2})$/.exec(String(id).trim());
  if (!m) return null;
  const r = ROWS.indexOf(m[1].toUpperCase());
  const c = Number(m[2]) - 1;
  return c >= 0 && c < PLATE.cols ? { r, c } : null;
}
/** Toạ độ tâm giếng (mm) so với tâm đĩa: x theo cột, y theo hàng (A ở phía sau, y âm). */
export function wellOffset(r, c) {
  const [w, d] = PLATE.size;
  return [PLATE.a1[0] + c * PLATE.pitch - w / 2, PLATE.a1[1] + r * PLATE.pitch - d / 2];
}

/**
 * Quang trình (cm) của cột chất lỏng thể tích V (µL) trong giếng hình nón cụt (bỏ qua mặt khum).
 * @param {number} volume  µL (= mm³)
 * @param {object} well     kích thước giếng { top, bottom, depth } tính bằng mm
 * @returns {number} cm
 */
export function pathLength(volume, well = PLATE.well) {
  const r0 = well.bottom / 2;
  const k = (well.top / 2 - r0) / well.depth;
  const vol = (h) => (Math.PI * h * (r0 * r0 + r0 * (r0 + k * h) + (r0 + k * h) ** 2)) / 3;
  let lo = 0;
  let hi = well.depth;
  if (volume >= vol(hi)) return hi / 10;
  for (let i = 0; i < 50; i++) {
    const mid = (lo + hi) / 2;
    if (vol(mid) < volume) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 20;
}

/**
 * Định luật Beer–Lambert: A = ε·l·c.
 * @param {number} eps  L·mol⁻¹·cm⁻¹
 * @param {number} l    quang trình, cm
 * @param {number} c    nồng độ, mol/L
 */
export const beerLambert = (eps, l, c) => eps * l * c;

/** Bộ sinh số ngẫu nhiên có hạt (mulberry32), để chạy lại cho cùng kết quả. Trả hàm () → [0, 1). */
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
/** Số ngẫu nhiên phân phối chuẩn N(0, 1) (Box–Muller). */
export function gauss(rand) {
  const u = Math.max(1e-12, rand());
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * rand());
}

/** Độ hấp thụ nền của giếng polystyrene có chất lỏng không màu (ước lượng, chưa xác minh). */
export const PLATE_BLANK = 0.045;

/**
 * Máy đọc một giếng có độ hấp thụ thật A: ánh sáng lạc, độ lệch hệ thống của đĩa, nhiễu ngẫu nhiên,
 * làm tròn theo độ phân giải. Trên 4,0 OD trả về Infinity (máy báo "OVRFLW").
 * @param {number} A      độ hấp thụ thật của giếng (gồm cả nền đĩa)
 * @param {function} rand hàm ngẫu nhiên từ rng()
 * @param {object} opt    { gain: hệ số lệch hệ thống của đĩa (mặc định 1), resolution }
 */
export function measure(A, rand, { gain = 1, resolution = SPEC.resolution } = {}) {
  const T = 10 ** -Math.max(0, A);
  const seen = -Math.log10((T + SPEC.stray) / (1 + SPEC.stray));
  const noisy = seen * gain + (0.0025 * seen + 0.0005) * gauss(rand);
  if (noisy > SPEC.odRange[1]) return Infinity;
  return Math.max(0, Math.round(noisy / resolution) * resolution);
}

/** Độ lệch hệ thống của một đĩa (hệ số nhân), trong ±0,5 %. */
export const plateGain = (rand) => 1 + 0.005 * (2 * rand() - 1);

/** Chữ hiển thị của một giá trị OD: "0,452", "OVRFLW", hoặc "—" khi không có. */
export function formatOD(A, digits = 3) {
  if (A === Infinity) return "OVRFLW";
  if (A === null || A === undefined || Number.isNaN(A)) return "—";
  return A.toFixed(digits).replace(".", ",");
}

// ——— Bradford (Coomassie G-250, 595 nm) ———

/** Thông số thí nghiệm Bradford trên vi đĩa (Bio-Rad Quick Start, quy trình vi đĩa chuẩn). */
export const BRADFORD = {
  lambda: 595,
  sample: 5, // µL mẫu hoặc chuẩn
  dye: 250, // µL thuốc thử 1×
  blank: 0.45, // A595 của mẫu trắng ở 255 µL, ước lượng
  amax: 2.25, // A595 thực tối đa khi c → ∞ ở 255 µL, ước lượng
  k: 3000, // µg/mL, nồng độ cho nửa Amax, ước lượng
  standards: [0, 125, 250, 500, 750, 1000, 1500, 2000], // µg/mL BSA
  linear: [125, 1000], // µg/mL, khoảng tuyến tính theo Bio-Rad
};

/**
 * Độ hấp thụ thật ở 595 nm của một giếng Bradford (gồm nền đĩa và thuốc nhuộm tự do).
 * @param {number} c       nồng độ protein trong mẫu, µg/mL
 * @param {object} opt     { sample, dye } µL; quang trình tỉ lệ theo tổng thể tích
 */
export function bradfordA(c, { sample = BRADFORD.sample, dye = BRADFORD.dye } = {}) {
  const ref = pathLength(BRADFORD.sample + BRADFORD.dye);
  const scale = pathLength(sample + dye) / ref;
  const dilution = (sample / (sample + dye)) / (BRADFORD.sample / (BRADFORD.sample + BRADFORD.dye));
  const cc = Math.max(0, c) * dilution;
  return PLATE_BLANK + scale * (BRADFORD.blank + (BRADFORD.amax * cc) / (BRADFORD.k + cc));
}

// ——— p-nitrophenol (405 nm) ———

/** Thông số p-nitrophenol và phosphatase kiềm trên vi đĩa. */
export const PNP = {
  lambda: 405,
  eps: 18500, // L·mol⁻¹·cm⁻¹, pH ≥ 9,8
  volume: 200, // µL mỗi giếng
  standards: [0, 10, 25, 50, 75, 100, 150, 200], // µmol/L
  km: 0.5, // mmol/L, phosphatase kiềm với pNPP, điển hình, chưa xác minh
};

/**
 * Độ hấp thụ thật ở 405 nm của p-nitrophenol nồng độ c (µmol/L) trong V µL.
 */
export const pnpA = (c, volume = PNP.volume) => PLATE_BLANK + beerLambert(PNP.eps, pathLength(volume), Math.max(0, c) * 1e-6);

/**
 * Đọc động học phản ứng phosphatase kiềm + pNPP ở 405 nm: sản phẩm p-nitrophenol tăng theo
 * Michaelis–Menten, cơ chất giảm dần. Trả các lần đọc { t (s), A (OD đo), P (µmol/L) }.
 * @param {object} opt { vmax µmol/L/phút, s0 mmol/L, km mmol/L, volume µL, interval s, duration s, seed }
 */
export function pnpKinetic({ vmax = 12, s0 = 2, km = PNP.km, volume = PNP.volume, interval = 30, duration = 600, seed = 7 } = {}) {
  const rand = rng(seed);
  const gain = plateGain(rand);
  const out = [];
  let P = 0;
  const dt = 1;
  for (let t = 0; t <= duration; t += dt) {
    if (t % interval === 0) out.push({ t, P, A: measure(pnpA(P, volume), rand, { gain }) });
    const S = Math.max(0, s0 - P / 1000);
    P += ((vmax * S) / (km + S)) * (dt / 60);
  }
  return out;
}

// ——— Đường chuẩn ———

/**
 * Hồi quy tuyến tính bình phương nhỏ nhất y = slope·x + intercept, kèm R².
 * @param {Array<[number, number]>} points  các điểm [x, y]
 */
export function linearFit(points) {
  const pts = points.filter(([x, y]) => Number.isFinite(x) && Number.isFinite(y));
  const n = pts.length;
  if (n < 2) return { slope: NaN, intercept: NaN, r2: NaN, n };
  const mx = pts.reduce((s, [x]) => s + x, 0) / n;
  const my = pts.reduce((s, [, y]) => s + y, 0) / n;
  let sxx = 0;
  let sxy = 0;
  let syy = 0;
  for (const [x, y] of pts) {
    sxx += (x - mx) ** 2;
    sxy += (x - mx) * (y - my);
    syy += (y - my) ** 2;
  }
  const slope = sxy / sxx;
  const intercept = my - slope * mx;
  const ssr = pts.reduce((s, [x, y]) => s + (y - (slope * x + intercept)) ** 2, 0);
  return { slope, intercept, r2: syy > 0 ? 1 - ssr / syy : 1, n };
}

/** Nội suy nồng độ từ độ hấp thụ theo đường chuẩn tuyến tính: x = (A − b) / a. */
export const interpolate = (fit, A) => (A - fit.intercept) / fit.slope;

// ——— Đĩa mẫu ———

/**
 * Bố trí đĩa Bradford: cột 1–3 là dãy chuẩn BSA lặp ba (hàng A–H = 0 … 2 000 µg/mL),
 * cột 4–12 là 24 mẫu chưa biết lặp ba (mẫu i ở hàng i % 8, nhóm cột 4–6, 7–9, 10–12).
 * Trả { assay, lambda, wells: { id: OD đo }, standards: { id: µg/mL }, samples: { id: tên mẫu }, truth: { tên: µg/mL } }.
 * @param {object} opt { seed, unknowns: mảng 24 nồng độ thật µg/mL (tuỳ chọn) }
 */
export function bradfordPlate({ seed = 3, unknowns } = {}) {
  const rand = rng(seed);
  const gain = plateGain(rand);
  const truth = {};
  const wells = {};
  const standards = {};
  const samples = {};
  const conc = unknowns ?? Array.from({ length: 24 }, () => Math.round(80 + 2050 * rand()));
  for (let c = 0; c < PLATE.cols; c++) {
    for (let r = 0; r < PLATE.rows; r++) {
      const id = wellId(r, c);
      let x;
      if (c < 3) {
        x = BRADFORD.standards[r];
        standards[id] = x;
      } else {
        const name = `M${r + 1 + 8 * Math.floor((c - 3) / 3)}`;
        x = conc[r + 8 * Math.floor((c - 3) / 3)];
        samples[id] = name;
        truth[name] = x;
      }
      // Sai số pipet: 5 µL mẫu CV 2 %, 250 µL thuốc thử CV 1 %
      const sample = BRADFORD.sample * (1 + 0.02 * gauss(rand));
      const dye = BRADFORD.dye * (1 + 0.01 * gauss(rand));
      wells[id] = measure(bradfordA(x, { sample, dye }), rand, { gain });
    }
  }
  return { assay: "bradford", lambda: BRADFORD.lambda, unit: "µg/mL", wells, standards, samples, truth };
}

/**
 * Đĩa p-nitrophenol điểm cuối ở 405 nm: cột 1–3 là dãy chuẩn pNP (0–200 µmol/L) lặp ba,
 * cột 4–12 là 24 mẫu sản phẩm phản ứng lặp ba. Cùng dạng kết quả với bradfordPlate.
 */
export function pnpPlate({ seed = 5, unknowns } = {}) {
  const rand = rng(seed);
  const gain = plateGain(rand);
  const truth = {};
  const wells = {};
  const standards = {};
  const samples = {};
  const conc = unknowns ?? Array.from({ length: 24 }, () => Math.round(5 + 190 * rand()));
  for (let c = 0; c < PLATE.cols; c++) {
    for (let r = 0; r < PLATE.rows; r++) {
      const id = wellId(r, c);
      let x;
      if (c < 3) {
        x = PNP.standards[r];
        standards[id] = x;
      } else {
        const name = `M${r + 1 + 8 * Math.floor((c - 3) / 3)}`;
        x = conc[r + 8 * Math.floor((c - 3) / 3)];
        samples[id] = name;
        truth[name] = x;
      }
      const volume = PNP.volume * (1 + 0.01 * gauss(rand));
      wells[id] = measure(pnpA(x, volume), rand, { gain });
    }
  }
  return { assay: "pnp", lambda: PNP.lambda, unit: "µmol/L", wells, standards, samples, truth };
}

/**
 * Phân tích một lần đọc: trừ trung bình mẫu trắng (giếng chuẩn nồng độ 0), dựng đường chuẩn tuyến tính
 * từ các giếng chuẩn, nội suy nồng độ của từng mẫu (trung bình các giếng lặp).
 * @param {object} run  { wells: { id: OD }, standards?: { id: nồng độ }, samples?: { id: tên } }
 * @param {object} opt  { range: [min, max] chỉ dùng các chuẩn trong khoảng này để fit (giữ cả mẫu trắng) }
 * @returns {{ blank, fit, points: Array<[x, A]>, samples: Array<{ name, wells, A, c, out }>, range }}
 */
export function analyse(run, { range } = {}) {
  const std = run.standards ?? {};
  const ids = Object.keys(std).filter((id) => Number.isFinite(run.wells?.[id]));
  const blanks = ids.filter((id) => std[id] === 0).map((id) => run.wells[id]);
  const blank = blanks.length ? blanks.reduce((s, a) => s + a, 0) / blanks.length : 0;
  const points = ids.map((id) => [std[id], run.wells[id] - blank]);
  const used = range ? points.filter(([x]) => x === 0 || (x >= range[0] && x <= range[1])) : points;
  const fit = linearFit(used);
  const xs = points.map(([x]) => x);
  const top = xs.length ? Math.max(...xs) : 0;
  const groups = new Map();
  for (const [id, name] of Object.entries(run.samples ?? {})) {
    if (!groups.has(name)) groups.set(name, []);
    groups.get(name).push(id);
  }
  const samples = [...groups].map(([name, wells]) => {
    const values = wells.map((id) => run.wells?.[id]).filter((a) => a !== undefined);
    const over = values.some((a) => a === Infinity);
    const A = over ? Infinity : values.reduce((s, a) => s + a, 0) / Math.max(1, values.length);
    const c = over ? NaN : interpolate(fit, A - blank);
    return { name, wells, A, c, out: over || !(c >= 0 && c <= top) };
  });
  return { blank, fit, points, samples, range: [0, top] };
}

// ——— Màu và thời gian ———

/**
 * Màu nhìn thấy của dung dịch trong giếng (RGB 0–255). Bradford: trộn từ nâu đỏ (thuốc nhuộm tự do) tới
 * xanh lam (gắn protein) theo phần đã gắn. Chất khác: mỗi kênh R, G, B (610, 545, 450 nm) bị hấp thụ theo
 * dải Gauss quanh bước sóng đo, σ = 45 nm (gần đúng để tô màu, không phải phổ thật).
 */
export function wellColour(lambda, A, assay) {
  if (!Number.isFinite(A)) return [20, 30, 60];
  if (assay === "bradford") {
    const f = Math.min(1, Math.max(0, (A - PLATE_BLANK - BRADFORD.blank) / 1.1));
    const brown = [176, 112, 72];
    const blue = [36, 78, 178];
    return brown.map((v, i) => Math.round(v + (blue[i] - v) * Math.sqrt(f)));
  }
  const a = Math.max(0, A - PLATE_BLANK);
  return [610, 545, 450].map((centre) => Math.round(250 * 10 ** (-a * 1.4 * Math.exp(-0.5 * ((centre - lambda) / 45) ** 2))));
}

/**
 * Lịch đọc quét: đọc theo cột (1 → 12), trong mỗi cột quét hàng A → H rồi H → A ở cột kế (kiểu rắn bò).
 * Trả về vị trí đang đọc ở thời điểm t (s) kể từ lúc bắt đầu: { col, row (số thực), done, index }.
 * @param {number} t
 * @param {number} total  thời gian đọc cả đĩa, s (mặc định 8 s theo hãng)
 */
export function sweepAt(t, total = SPEC.sweep96) {
  const per = total / PLATE.cols;
  if (t >= total) return { col: PLATE.cols - 1, row: PLATE.cols % 2 ? PLATE.rows - 1 : 0, done: true, index: PLATE.rows * PLATE.cols };
  const col = Math.max(0, Math.floor(t / per));
  const u = Math.min(1, Math.max(0, (t - col * per) / (per * 0.82))); // 18 % thời gian để dời sang cột kế
  const along = u * (PLATE.rows - 1);
  const row = col % 2 ? PLATE.rows - 1 - along : along;
  return { col, row, done: false, index: col * PLATE.rows + Math.floor(along + 1e-9) + 1 };
}

/** Thứ tự các giếng được đọc (để tô bản đồ lần lượt): mảng id theo lịch sweepAt. */
export function readOrder() {
  const out = [];
  for (let c = 0; c < PLATE.cols; c++) for (let i = 0; i < PLATE.rows; i++) out.push(wellId(c % 2 ? PLATE.rows - 1 - i : i, c));
  return out;
}
