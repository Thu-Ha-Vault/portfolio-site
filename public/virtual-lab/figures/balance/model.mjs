// Mô hình cân phân tích 0,1 mg (kiểu Mettler Toledo MS204TS), dùng chung cho bản dựng (build.mjs),
// trang (live.js) và sau này cho lõi mô phỏng của app (src/core). Module thuần: không DOM, không Three.js.
//
// Số liệu của máy (nguồn của hãng):
//   - Tờ thông số "MS-TS Analytical Balances, Advanced Level" (30247877B, 08/2019),
//     https://www.mt.com/dam/P5/labtec/02_Analytical_Balances/MS-TS_Analytical/03_Documentation/Data_Sheet/DS_MS-TS_Analytical_EN.pdf
//     MS204TS: tải tối đa 220 g, tải danh định 200 g, độ đọc 0,1 mg; độ lặp lại (giới hạn) 0,1 mg, điển hình 0,08 mg;
//     độ lệch tuyến tính (giới hạn) 0,2 mg, điển hình 0,06 mg; lệch độ nhạy ở tải danh định 0,8 mg (sau khi hiệu chỉnh
//     bằng quả cân trong); khối lượng tối thiểu theo USP (dung sai 0,10 %) 160 mg, theo dung sai 1 % là 16 mg
//     (xác định ở 5 % tải, k = 2); thời gian ổn định 2 s; đĩa cân ∅ 90 mm; cảm biến lực MonoBloc,
//     hiệu chỉnh trong tự động FACT; LevelControl cảnh báo lệch thăng bằng; màn hình cảm ứng 7 inch, chữ số cao 18 mm.
//   - Hướng dẫn sử dụng "Operating Instructions, Precision and Analytical Balances MS-TS" (bản lưu tại
//     https://nanoionics.pitt.edu/sites/default/files/Mettler.pdf), mục 12.2.1 và 12.3.1:
//     kích thước 204 × 347 × 348 mm (rộng × sâu × cao), chiều cao dùng được trong buồng kính 236 mm, nặng 5,9 kg;
//     trôi độ nhạy theo nhiệt độ 1,5 ppm/°C; khối lượng tối thiểu OIML 0,01 g; làm ấm 60 phút với máy 0,1 mg;
//     môi trường 10–30 °C, ẩm 10–80 %; nguồn 12 V một chiều, 10 W. Hai chân chỉnh được ở phía trước bù được mặt bàn
//     nghiêng tới ±2 %; bọt thuỷ trên đầu màn hình; buồng kính (PBT và kính) có cửa trượt; tấm sàn buồng và đĩa cân
//     bằng thép không gỉ 1.4404. Cửa hông mở 140 mm, khi mở thò ra sau máy 99 mm (bản vẽ kích thước).
//
// Phép cân:
//   - Lực đẩy không khí (OIML D 28 "Conventional value of the result of weighing in air", 2004, và OIML R 111-1):
//     cân được hiệu chỉnh bằng quả cân khối lượng riêng quy ước 8000 kg/m³ trong không khí 1,2 kg/m³, nên số đọc là
//     "khối lượng quy ước". Khối lượng thật: m_thật = m_đọc × (1 − ρ_kk/ρ_quả cân) / (1 − ρ_kk/ρ_mẫu).
//   - Khối lượng riêng chất rắn (CRC Handbook of Chemistry and Physics; PubChem): NaCl 2,17 g/cm³,
//     kali hydro phthalate (KHP) 1,636 g/cm³, glucose 1,54 g/cm³, sucrose 1,587 g/cm³, CuSO₄·5H₂O 2,286 g/cm³,
//     nước 0,998 g/cm³ ở 20 °C.
//   - USP <41> (từ 2013): độ lặp lại đạt khi 2 × s / m ≤ 0,10 %; nếu s < 0,41 d thì lấy s = 0,41 d (d là độ đọc).
//     Với s điển hình 0,08 mg: m_min = 2 × 0,08 mg / 0,001 = 160 mg, khớp tờ thông số.
//   - Cân lệch thăng bằng một góc θ: cảm biến chỉ đo thành phần trọng lực vuông góc với đĩa, số đọc nhân cos θ
//     (so với lúc hiệu chỉnh). Hình học, không cần nguồn riêng.
//
// Phần minh hoạ, chưa xác minh (ghi rõ để người dùng không nhầm là số đo thật):
//   - Nhiễu khi mở cửa kính (độ lệch chuẩn 0,6 mg và trôi chậm ±1 mg): luồng khí làm số đọc dao động; hãng không cho số.
//   - Mẫu ấm hơn buồng cân: dòng đối lưu làm mẫu "nhẹ đi" khoảng 0,1 mg mỗi kelvin với vật nhỏ, giảm dần theo thời gian.
//   - Mẫu tích điện tĩnh: số đọc trôi chậm, không ổn định.
//   - Thời gian đáp ứng: số đọc tiến tới giá trị mới theo hàm mũ có dao động tắt dần, chọn để vào trong 0,05 mg sau 2 s.
//   - Khối lượng thuyền cân polystyrene nhỏ 0,3816 g; một thìa bột 90–210 mg; khối lượng riêng đổ đống của bột
//     (để vẽ đống bột) và góc nghỉ 35°.

/** Thông số máy (đơn vị ghi ở từng trường). */
export const SPEC = {
  model: "MS204TS",
  capacity: 220, // g
  nominal: 200, // g, tải danh định
  d: 0.0001, // g, độ đọc
  repeatLimit: 0.1, // mg
  repeat: 0.08, // mg, điển hình (độ lệch chuẩn)
  linearityLimit: 0.2, // mg
  linearity: 0.06, // mg, điển hình
  sensitivityOffset: 0.8, // mg ở tải danh định, sau hiệu chỉnh trong
  tempDrift: 1.5, // ppm/°C
  minUSP: 0.16, // g, dung sai 0,10 %, k = 2, ở 5 % tải
  min1: 0.016, // g, dung sai 1 %
  minOIML: 0.01, // g
  settle: 2, // s
  pan: 90, // mm, đường kính đĩa cân
  usableHeight: 236, // mm, chiều cao dùng được trong buồng kính
  size: [204, 347, 348], // mm rộng × sâu × cao
  mass: 5.9, // kg
  warmup: 60, // phút với máy 0,1 mg
  levelRange: 2, // %, độ nghiêng mặt bàn bù được bằng chân chỉnh
  doorTravel: 140, // mm, cửa hông mở
  doorBehind: 99, // mm, cửa mở thò ra sau máy
  power: [12, 10], // V một chiều, W
  ambient: [10, 30], // °C
};

/** Lực đẩy không khí theo OIML D 28 / R 111: khối lượng riêng quy ước (kg/m³). */
export const AIR = { rhoAir: 1.2, rhoWeights: 8000 };

/**
 * Chất rắn để cân: khối lượng riêng thật (g/cm³, CRC/PubChem), khối lượng mol (g/mol),
 * khối lượng riêng đổ đống (g/cm³, minh hoạ, chỉ để vẽ đống bột).
 */
export const SUBSTANCES = {
  NaCl: { name: "NaCl", rho: 2.17, molar: 58.44, bulk: 1.2 },
  KHP: { name: "KHP", rho: 1.636, molar: 204.22, bulk: 0.8 },
  glucose: { name: "glucose", rho: 1.54, molar: 180.16, bulk: 0.75 },
  sucrose: { name: "sucrose", rho: 1.587, molar: 342.3, bulk: 0.85 },
  "CuSO4·5H2O": { name: "CuSO₄·5H₂O", rho: 2.286, molar: 249.69, bulk: 1.1 },
};
/** Thuyền cân polystyrene nhỏ (minh hoạ): khối lượng g, khối lượng riêng g/cm³. */
export const BOAT = { mass: 0.3816, rho: 1.05 };
/** Một thìa bột (g, minh hoạ). */
export const SCOOP = [0.09, 0.21];
/** Góc nghỉ của đống bột (độ, minh hoạ). */
export const REPOSE = 35;
/** Nhiễu và trôi khi mở cửa kính (mg, minh hoạ). */
export const DOOR_NOISE = { sd: 0.6, wander: 1.0 };

/** Bộ sinh số ngẫu nhiên có hạt giống (mulberry32), trả về hàm cho số trong [0, 1). */
export function rng(seed = 1) {
  let a = seed >>> 0 || 1;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
/** Số ngẫu nhiên phân phối chuẩn N(0, 1) từ hàm rng (Box–Muller). */
export function gauss(rand) {
  const u = Math.max(1e-12, rand());
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * rand());
}

/** Làm tròn theo độ đọc của cân (mặc định 0,1 mg). @param {number} g @returns {number} */
export const roundToD = (g, d = SPEC.d) => Math.round(g / d) * d;

/**
 * Hệ số đổi khối lượng thật ra số đọc (khối lượng quy ước) do lực đẩy không khí.
 * @param {number} rhoSample khối lượng riêng của vật, g/cm³
 * @returns {number} số đọc / khối lượng thật (nhỏ hơn 1 khi vật nhẹ hơn thép)
 */
export function buoyancyFactor(rhoSample, { rhoAir = AIR.rhoAir, rhoWeights = AIR.rhoWeights } = {}) {
  const ra = rhoAir / 1000; // g/cm³
  return (1 - ra / rhoSample) / (1 - ra / (rhoWeights / 1000));
}
/**
 * Hiệu chỉnh lực đẩy không khí: khối lượng thật từ số đọc.
 * m_thật = m_đọc × (1 − ρ_kk/ρ_quả cân) / (1 − ρ_kk/ρ_mẫu)
 * @param {number} mRead số đọc, g
 * @param {number} rhoSample khối lượng riêng của mẫu, g/cm³
 * @returns {number} khối lượng thật, g
 */
export function buoyancy(mRead, rhoSample, opts) {
  return mRead / buoyancyFactor(rhoSample, opts);
}

/**
 * Hệ số do cân lệch thăng bằng: chỉ thành phần trọng lực vuông góc với đĩa được đo.
 * @param {number} tiltDeg góc nghiêng hiện tại, độ
 * @param {number} [adjustedDeg] góc nghiêng lúc hiệu chỉnh trong (FACT), độ
 * @returns {number} cos θ / cos θ_hiệu chỉnh
 */
export function tiltFactor(tiltDeg = 0, adjustedDeg = 0) {
  const r = Math.PI / 180;
  return Math.cos(tiltDeg * r) / Math.cos(adjustedDeg * r);
}
/** Độ dốc (%) của một góc nghiêng (độ). */
export const slopePercent = (tiltDeg) => Math.tan((tiltDeg * Math.PI) / 180) * 100;

/**
 * Độ lệch chuẩn của số đọc (mg) theo điều kiện cân.
 * @param {{doorsOpen?: boolean, charge?: number}} [o] charge: mức tích điện 0–1 (minh hoạ)
 */
export function noiseSd({ doorsOpen = false, charge = 0 } = {}) {
  const base = SPEC.repeat;
  const door = doorsOpen ? DOOR_NOISE.sd : 0;
  return Math.sqrt(base * base + door * door) + 0.3 * charge;
}

/**
 * Số mg mẫu ấm "nhẹ đi" do đối lưu (minh hoạ): 0,1 mg mỗi kelvin, giảm dần với hằng số thời gian 300 s.
 * @param {number} deltaK mẫu ấm hơn buồng cân bao nhiêu kelvin @param {number} [t] số giây đã đặt lên đĩa
 */
export const warmError = (deltaK = 0, t = 0) => -0.1 * deltaK * Math.exp(-t / 300);

/**
 * Số đọc của cân cho một khối lượng thật trên đĩa.
 * @param {number} trueMassG khối lượng thật của mẫu (không kể vật chứa), g
 * @param {object} [o]
 * @param {number} [o.container] khối lượng thật của vật chứa (thuyền cân), g
 * @param {boolean|number} [o.tare] true: đã trừ bì đúng vật chứa; số: lượng bì (g, theo số đọc) đã trừ; false/0: chưa trừ bì
 * @param {boolean} [o.doorsOpen] cửa kính đang mở
 * @param {number} [o.tilt] góc lệch thăng bằng, độ
 * @param {number} [o.rhoSample] khối lượng riêng của mẫu, g/cm³ (mặc định NaCl); null để bỏ lực đẩy không khí
 * @param {number} [o.warmK] mẫu ấm hơn buồng bao nhiêu kelvin (minh hoạ)
 * @param {number} [o.charge] mức tích điện 0–1 (minh hoạ)
 * @param {number} [o.seed] hạt giống cho nhiễu; null để bỏ nhiễu
 * @returns {{ shown: number, raw: number, sd: number, net: number, stable: boolean, text: string, flags: string[] }}
 *   shown: số hiện trên màn (đã làm tròn 0,1 mg); raw: trước khi làm tròn; net: số đọc không nhiễu của mẫu
 */
export function read(trueMassG, { container = BOAT.mass, tare = true, doorsOpen = false, tilt = 0, rhoSample = SUBSTANCES.NaCl.rho, warmK = 0, charge = 0, seed = 1 } = {}) {
  const tf = tiltFactor(tilt);
  const bf = (rho) => (rho ? buoyancyFactor(rho) : 1);
  const sample = trueMassG * bf(rhoSample) * tf;
  const box = container * bf(BOAT.rho) * tf;
  const tareG = tare === true ? box : typeof tare === "number" ? tare : 0;
  const sd = noiseSd({ doorsOpen, charge });
  const rand = seed == null ? null : rng(seed);
  const noise = rand ? (gauss(rand) * sd) / 1000 : 0;
  const wander = rand && doorsOpen ? ((rand() * 2 - 1) * DOOR_NOISE.wander) / 1000 : 0;
  const drift = (warmError(warmK) + (charge ? 1.5 * charge : 0)) / 1000;
  const net = sample + box - tareG;
  const raw = net + noise + wander + drift;
  const shown = roundToD(raw);
  const flags = [];
  if (doorsOpen) flags.push("Cửa kính đang mở: luồng khí làm số đọc dao động, không ổn định.");
  if (Math.abs(tilt) > 0.05) flags.push(`Cân lệch thăng bằng ${fmt(tilt, 1)}°: số đọc nhỏ đi ${fmt((1 - tf) * 1e6, 0)} ppm.`);
  if (tare === false || tare === 0) flags.push("Chưa trừ bì: số đọc gồm cả khối lượng thuyền cân.");
  if (warmK) flags.push("Mẫu ấm hơn buồng cân: dòng đối lưu làm mẫu nhẹ đi, số đọc trôi.");
  if (charge) flags.push("Mẫu tích điện tĩnh: số đọc trôi, không ổn định.");
  const m = trueMassG * bf(rhoSample);
  if (m > 0 && m < minWeight()) flags.push(`Dưới khối lượng tối thiểu USP ${fmt(minWeight() * 1000, 0)} mg: sai số tương đối ${fmt(relUncertainty(m) * 100, 2)} % > 0,10 %.`);
  if (sample + box > SPEC.capacity) flags.push("Quá tải: vượt 220 g.");
  const stable = !doorsOpen && !charge && !warmK;
  return { shown, raw, sd, net, stable, text: fmtG(shown), flags };
}

/**
 * Khối lượng tối thiểu (g) theo USP <41>: 2 × s / m ≤ dung sai, s không nhỏ hơn 0,41 d.
 * @param {{sd?: number, tol?: number, k?: number}} [o] sd: độ lệch chuẩn mg; tol: dung sai tương đối
 */
export function minWeight({ sd = SPEC.repeat, tol = 0.001, k = 2 } = {}) {
  const s = Math.max(sd, 0.41 * SPEC.d * 1000);
  return (k * s) / 1000 / tol;
}
/** Sai số tương đối 2 × s / m của một lần cân m (g). */
export const relUncertainty = (mG, sd = SPEC.repeat) => (2 * Math.max(sd, 0.41 * SPEC.d * 1000)) / 1000 / mG;

/**
 * Số đọc trong lúc cân ổn định sau khi tải thay đổi Δ (g): tắt dần theo hàm mũ có dao động (minh hoạ),
 * vào trong 0,05 mg sau thời gian ổn định 2 s với Δ tới 200 mg.
 * @param {number} delta bước tải, g @param {number} t số giây từ lúc tải thay đổi
 */
export const transient = (delta, t) => delta * Math.exp(-t / 0.22) * Math.cos((2 * Math.PI * t) / 0.7);
/** Cân báo ổn định khi đã qua thời gian ổn định và nhiễu không vượt một độ đọc. */
export const isStable = (t, { doorsOpen = false, charge = 0 } = {}) => t >= SPEC.settle && noiseSd({ doorsOpen, charge }) <= SPEC.d * 1000;

/**
 * Kích thước đống bột hình nón (mm) cho một khối lượng (g) và chất (để vẽ).
 * @returns {{ r: number, h: number }}
 */
export function pileOf(massG, key = "NaCl") {
  const s = SUBSTANCES[key] ?? SUBSTANCES.NaCl;
  const v = (Math.max(0, massG) / s.bulk) * 1000; // mm³
  const t = Math.tan((REPOSE * Math.PI) / 180);
  const r = Math.cbrt((3 * v) / (Math.PI * t));
  return { r, h: r * t };
}

/** Số dạng Việt Nam (dấu phẩy thập phân). */
export function fmt(v, digits = 1) {
  return Number(v).toFixed(digits).replace("-", "−").replace(".", ",");
}
/** Số đọc của cân, 4 chữ số thập phân (g). */
export const fmtG = (g) => fmt(roundToD(g) === 0 ? 0 : roundToD(g), 4);

/** Ví dụ chuẩn: cân 0,5844 g NaCl (0,01 mol) vào thuyền cân đã trừ bì. */
export const DEMO = { mass: 0.5844, tared: true, doorsOpen: false, substance: "NaCl", seed: 7 };
