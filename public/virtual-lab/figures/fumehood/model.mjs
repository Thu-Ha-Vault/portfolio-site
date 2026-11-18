// Mô hình tủ hút khí độc (fume hood) để bàn, dùng chung cho bản dựng (Node), trang hình (trình duyệt)
// và lõi mô phỏng của app. Module thuần: không DOM, không Three.js.
//
// Máy làm mẫu: Labconco Protector XStream 5 ft (mã 110510021, có 2 vòi dịch vụ và ổ cắm đôi), đặt trên
// tủ đế chứa hoá chất. Nguồn:
// - Trang sản phẩm Labconco Protector XStream (https://labconco.com/product/protector-xstream-laboratory-hoods/24):
//   · kính trượt đứng bằng kính an toàn cường lực, "cable and pulley"; chặn kính ở độ mở 18" (457 mm);
//   · tầm nhìn 37,5" (953 mm) từ mặt bàn tới tấm đầu (header panel);
//   · ống thải inox sơn tĩnh điện, đường kính trong 12,8" (325 mm);
//   · vách ngăn sau Opti-Zone có khe vát, hệ vách hút xuống kép phía sau, tháo rời để lau;
//   · gờ khí động Eco-Foil có khe Clean-Sweep, khe giữ dây điện hai bên; cấp khí pha loãng phía trên (bypass),
//     tương thích lưu lượng thay đổi (VAV); tay nắm kính có khe Clean-Sweep;
//   · lót vách composite gia cường sợi thuỷ tinh chịu hoá chất, chỉ số lan lửa < 25 (ASTM E84);
//   · đèn LED kín hơi, công tắc đèn và quạt đạt ADA; 2 vòi dịch vụ van đồng thau rèn (gas, nước lạnh), ổ GFCI;
//   · thử nghiệm: ASHRAE 110, ANSI Z9.5, SEFA 1, NFPA 45, UL 61010-1.
// - Bảng lưu lượng thải của Labconco (bản chép ở BSI Lab,
//   https://bsilab.com/product/labconco-protector-xstream-laboratory-fume-hoods), bản 5 ft:
//   · kính mở 28" (100 %): 100 fpm → 930 CFM (s.p. 0,26), 80 fpm → 745 CFM, 60 fpm → 560 CFM;
//   · kính mở 18" (62,5 %): 100 fpm → 580 CFM (s.p. 0,12), 80 fpm → 465 CFM, 60 fpm → 350 CFM;
//   · khối lượng bản 5 ft: 238 kg (525 lb).
// - Kích thước bản 5 ft (Terra Universal, SKU 110510021): ngoài 60" × 37,7" × 59" (1524 × 958 × 1499 mm),
//   mặt làm việc 50,1" × 27,2" (1273 × 691 mm), độ mở lớn nhất 28" (711 mm).
// - Bộ báo luồng khí Labconco Guardian Digital (https://labconco.com/p/guardian-digital-airflow-monitors):
//   màn LCD hiện vận tốc mặt cửa; ngưỡng chỉnh được 50–250 fpm bằng máy đo vận tốc; dưới ngưỡng thì còi kêu
//   và đèn đỏ sáng, tắt còi bằng một nút.
// - ANSI/ASSP Z9.5 và ASHRAE 110 (tóm tắt: Lab Manager, https://www.labmanager.com/conducting-proper-face-velocity-testing-for-lab-fume-hoods-35211;
//   LBNL qua https://casrai.org/guides/ashrae-110-fume-hood-testing): bản Z9.5 cũ ghi 80–120 fpm, bản 2022 gợi ý 80–100 fpm
//   làm điểm bắt đầu; thử khí đánh dấu SF₆ 4 L/min, nồng độ ở vùng thở của ma-nơ-canh ≤ 0,05 ppm ("AM 0,05")
//   khi thử tại xưởng, ≤ 0,1 ppm khi thử tại chỗ lắp.
// - NO₂: NIOSH Pocket Guide (https://www.cdc.gov/niosh/npg/npgd0454.html): REL giới hạn ngắn hạn 1 ppm,
//   IDLH 13 ppm; OSHA PEL trần 5 ppm. Phản ứng Cu + 4 HNO₃ (đặc) → Cu(NO₃)₂ + 2 NO₂ + 2 H₂O.
//
// Giả định (chưa xác minh):
// - Tủ chạy lưu lượng không đổi (CAV) 580 CFM, đủ 100 fpm (0,508 m/s) ở chặn kính 18". Chiều rộng hiệu dụng của
//   cửa 1179 mm suy ra từ bảng (580 CFM chia 100 fpm chia 18"); mặt làm việc rộng 1273 mm. Kính đóng hẳn vẫn còn
//   khe Clean-Sweep dưới gờ khí động, tính như cửa cao 25 mm.
// - Diện tích bypass mở dần khi kính hạ dưới 300 mm, lớn nhất 0,30 m² (Labconco không công bố số).
// - Ngưỡng báo động của Guardian đặt 80 fpm (0,41 m/s), lấy theo cận dưới của Z9.5 bản cũ.
// - Chế độ VAV: giữ 0,508 m/s, lưu lượng từ 150 CFM (tối thiểu, giả định) tới 930 CFM.
// - Hệ số rò ở vùng thở theo vận tốc, độ mở, vật cản trước vách ngăn và người đi ngang: con số MINH HOẠ,
//   dựng cho đúng chiều hướng của các nghiên cứu ASHRAE 110, không phải số đo của model này.
// - Nguồn NO₂ minh hoạ: 5 g phoi đồng trong HNO₃ đặc dư, phản ứng trong khoảng 2 phút.

const CFM = 0.0004719474; // m³/s cho 1 ft³/min
const FPM = 0.00508; // m/s cho 1 ft/min

/** Thông số tủ (Labconco Protector XStream 5 ft). Chiều dài mm, vận tốc m/s, lưu lượng m³/s trừ khi ghi khác. */
export const HOOD = {
  model: "Labconco Protector XStream 5 ft (110510021)",
  outside: { width: 1524, depth: 958, height: 1499 },
  workArea: { width: 1273, depth: 691 },
  sightline: 953,
  collarId: 325,
  mass: 238, // kg
  sashMax: 711, // 28"
  sashStop: 457, // 18"
  openingWidth: 1179, // mm, hiệu dụng (suy ra, xem đầu file)
  slot: 25, // mm, khe Clean-Sweep dưới gờ khí động (giả định)
  bypass: { below: 300, area: 0.3 }, // mm, m² (giả định)
  exhaustTable: {
    // CFM theo vận tốc mặt cửa (fpm), bản 5 ft
    open28: { 100: 930, 80: 745, 60: 560 },
    open18: { 100: 580, 80: 465, 60: 350 },
  },
  target: 100 * FPM, // 0,508 m/s
  flowCav: 580 * CFM, // 0,2737 m³/s = 985 m³/h
  vavMin: 150 * CFM, // giả định
  vavMax: 930 * CFM,
  alarmLow: 80 * FPM, // 0,406 m/s, ngưỡng Guardian (giả định)
  cap: 2.5, // m/s, vận tốc qua khe hẹp bão hoà quanh mức này (giả định)
  tracer: { rate: 4, pass: 0.05, passInstalled: 0.1 }, // L/min, ppm (ASHRAE 110 / ANSI Z9.5)
  no2: { stel: 1, ceiling: 5, idlh: 13, twa: 0.2 }, // ppm (NIOSH, OSHA; TWA 0,2 ppm theo ACGIH, chưa đối chiếu)
};
export const UNITS = { CFM, FPM };

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

/**
 * Trạng thái kính theo độ mở.
 * @param {number} sash độ mở (mm, từ mặt trên gờ khí động tới mép dưới kính)
 * @returns {"closed"|"low"|"work"|"high"} đóng, thấp (dưới 150 mm), làm việc (tới chặn 18"), cao quá chặn
 */
export function sashState(sash, h = HOOD) {
  if (sash <= 2) return "closed";
  if (sash < 150) return "low";
  return sash <= h.sashStop + 2 ? "work" : "high";
}

/**
 * Diện tích cửa trước (m²): chiều rộng hiệu dụng × độ mở; kính đóng vẫn còn khe Clean-Sweep.
 * @param {number} sash mm
 */
export function openingArea(sash, h = HOOD) {
  return (h.openingWidth / 1000) * (Math.max(sash, h.slot) / 1000);
}

/**
 * Diện tích bypass phía trên (m²): mở dần khi kính hạ dưới h.bypass.below, giữ cho vận tốc không vọt lên khi đóng kính.
 * @param {number} sash mm
 * @param {"cav"|"vav"} [mode] tủ VAV không dùng bypass (van điều chỉnh lưu lượng thay vào)
 */
export function bypassArea(sash, mode = "cav", h = HOOD) {
  if (mode === "vav") return 0;
  return h.bypass.area * clamp((h.bypass.below - sash) / h.bypass.below, 0, 1);
}

/**
 * Lưu lượng thải (m³/s).
 * CAV: không đổi (580 CFM). VAV: theo diện tích cửa để giữ vận tốc đích, kẹp trong [vavMin, vavMax].
 * @param {number} sash mm
 * @param {{ mode?: "cav"|"vav", fan?: boolean }} [opts]
 * @returns {number}
 */
export function exhaustFlow(sash, { mode = "cav", fan = true } = {}, h = HOOD) {
  if (!fan) return 0;
  if (mode === "vav") return clamp(h.target * openingArea(sash, h), h.vavMin, h.vavMax);
  return h.flowCav;
}

/**
 * Vận tốc mặt cửa (m/s) = lưu lượng qua cửa / diện tích cửa. Với tủ bypass, lưu lượng chia cho cửa và bypass
 * theo diện tích; qua khe rất hẹp vận tốc bão hoà quanh h.cap.
 * @param {number} sashMm độ mở kính (mm)
 * @param {{ mode?: "cav"|"vav", fan?: boolean }} [opts]
 * @returns {number} m/s
 */
export function faceVelocity(sashMm, { mode = "cav", fan = true } = {}, h = HOOD) {
  const q = exhaustFlow(sashMm, { mode, fan }, h);
  if (q <= 0) return 0;
  const raw = q / (openingArea(sashMm, h) + bypassArea(sashMm, mode, h));
  return raw / (1 + (raw / h.cap) ** 4) ** 0.25;
}

/**
 * Hệ số rò ở vùng thở (MINH HOẠ): nồng độ khí đánh dấu (ppm) ở vùng thở khi nhả 4 L/min trong tủ, như phép thử
 * ASHRAE 110. Đạt khi ≤ 0,05 ppm.
 * - 0,40–0,65 m/s: khoảng 0,01 ppm. Dưới 0,40 m/s tăng 10 lần mỗi 0,1 m/s. Trên 0,65 m/s và kính mở > 250 mm,
 *   xoáy sau người làm tăng rò.
 * - Kính cao hơn chặn 18": ×(1 + 2·phần vượt/254 mm). Kính dưới 150 mm: tấm kính che chắn, ×0,2.
 * - Vật cản che khe dưới của vách ngăn: dòng quẩn ở mặt bàn, ×100. Người đi ngang (gió ngang ~1 m/s): ×20.
 * - Quạt tắt: khí tự lan ra theo đối lưu, 5 ppm khi kính gần đóng tới 65 ppm khi mở hết.
 * @param {{ velocity: number, sash: number, fan?: boolean, clutter?: boolean, walk?: boolean }} s
 * @returns {{ ppm: number, log10: number, pass: boolean }}
 */
export function containment({ velocity, sash, fan = true, clutter = false, walk = false }, h = HOOD) {
  let ppm;
  if (!fan) ppm = sash <= 2 ? 0.5 : 5 + 60 * clamp(sash / h.sashMax, 0, 1);
  else {
    ppm = 0.01;
    if (velocity < 0.4) ppm *= 10 ** ((0.4 - velocity) / 0.1);
    if (velocity > 0.65 && sash > 250) ppm *= 10 ** ((velocity - 0.65) / 0.35);
    if (sash > h.sashStop) ppm *= 1 + (2 * (sash - h.sashStop)) / 254;
    if (sash < 150) ppm *= 0.2;
    if (clutter) ppm *= 100;
  }
  if (walk) ppm *= 20;
  ppm = Math.min(ppm, 200);
  return { ppm, log10: Math.log10(ppm), pass: ppm <= h.tracer.pass + 1e-12 };
}

/**
 * Lưu lượng khí sinh ra (L/min) từ một phản ứng trong tủ. NO₂: Cu + 4 HNO₃ → Cu(NO₃)₂ + 2 NO₂ + 2 H₂O,
 * 2 mol NO₂ cho 1 mol Cu, thể tích mol 24,45 L ở 25 °C.
 * @param {"NO2"|"none"} gas
 * @param {{ grams?: number, minutes?: number }} [opts] khối lượng Cu (g), thời gian phản ứng (phút)
 * @returns {number} L/min
 */
export function gasSource(gas = "NO2", { grams = 5, minutes = 2 } = {}) {
  if (gas !== "NO2") return 0;
  return ((2 * grams) / 63.55) * 24.45 / minutes;
}

/**
 * Nồng độ ở vùng thở (ppm) từ hệ số rò: tỉ lệ thuận với lưu lượng nguồn so với 4 L/min của phép thử.
 * @param {number} leakPpm hệ số rò (ppm ở 4 L/min) từ containment()
 * @param {number} sourceLpm lưu lượng khí sinh ra (L/min)
 */
export function breathingZone(leakPpm, sourceLpm, h = HOOD) {
  return (leakPpm * sourceLpm) / h.tracer.rate;
}

/**
 * Mức nguy hiểm của NO₂ ở vùng thở.
 * @param {number} ppm
 * @returns {"safe"|"stel"|"ceiling"|"idlh"} dưới 1 ppm, vượt giới hạn ngắn hạn, vượt trần OSHA, vượt IDLH
 */
export function no2Level(ppm, h = HOOD) {
  if (ppm >= h.no2.idlh) return "idlh";
  if (ppm >= h.no2.ceiling) return "ceiling";
  if (ppm >= h.no2.stel) return "stel";
  return "safe";
}

/**
 * Toàn bộ trạng thái tủ cho một lựa chọn của người dùng.
 * @param {{ sash?: number, fan?: boolean, clutter?: boolean, walk?: boolean, mode?: "cav"|"vav", gas?: "NO2"|"none" }} [input]
 * @returns {{ sash: number, sashState: string, fan: boolean, mode: string, clutter: boolean, walk: boolean,
 *   flow: number, flowM3h: number, velocity: number, bypass: number, alarms: string[], leak: object,
 *   gas: { name: string, source: number, ppm: number, level: string }, safe: boolean, message: string }}
 *   bypass: phần mở của bypass (0–1); alarms: "airflow" (vận tốc dưới ngưỡng hoặc quạt tắt), "sash" (kính cao quá chặn);
 *   safe: tủ giữ được khí (đạt AM 0,05 hoặc kính đóng) và NO₂ ở vùng thở dưới 1 ppm.
 */
export function hoodState({ sash = HOOD.sashStop, fan = true, clutter = false, walk = false, mode = "cav", gas = "NO2" } = {}, h = HOOD) {
  sash = clamp(Number(sash) || 0, 0, h.sashMax);
  mode = mode === "vav" ? "vav" : "cav";
  const flow = exhaustFlow(sash, { mode, fan }, h);
  const velocity = faceVelocity(sash, { mode, fan }, h);
  const state = sashState(sash, h);
  const bypass = fan ? bypassArea(sash, mode, h) / h.bypass.area : 0;
  const leak = containment({ velocity, sash, fan, clutter, walk }, h);
  const source = gasSource(gas);
  const ppm = breathingZone(leak.ppm, source, h);
  const level = no2Level(ppm, h);
  const alarms = [];
  if (!fan || velocity < h.alarmLow) alarms.push("airflow");
  if (state === "high") alarms.push("sash");
  const safe = (leak.pass || state === "closed") && level === "safe" && fan;
  let message;
  if (!fan) message = source > 0 ? "Quạt tắt: NO₂ tràn ra phòng" : "Quạt tắt: tủ không hút";
  else if (clutter) message = "Vật cản che khe dưới vách ngăn: khí quẩn ra cửa";
  else if (alarms.includes("airflow")) message = "Vận tốc dưới 0,41 m/s: báo động";
  else if (walk) message = "Người đi ngang: gió ngang kéo khí ra";
  else if (state === "high") message = "Kính cao quá chặn 457 mm";
  else if (state === "closed") message = "Kính đóng: khí qua khe gờ khí động";
  else message = "An toàn";
  return {
    sash, sashState: state, fan: Boolean(fan), mode, clutter: Boolean(clutter), walk: Boolean(walk),
    flow, flowM3h: flow * 3600, velocity, bypass, alarms, leak,
    gas: { name: gas, source, ppm, level }, safe, message,
  };
}

/**
 * Định dạng số kiểu Việt Nam (dấu phẩy thập phân).
 * @param {number} v
 * @param {number} [digits]
 */
export const vn = (v, digits = 2) => v.toFixed(digits).replace(".", ",");
