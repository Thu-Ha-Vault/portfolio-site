// Mô hình tủ an toàn sinh học cấp II kiểu A2, dùng chung cho bản dựng (Node), trang hình (trình duyệt)
// và lõi mô phỏng của app. Module thuần: không DOM, không Three.js.
//
// Máy làm mẫu: Esco Airstream AC2-4S8-NS (Class II Type A2, rộng 4 ft, 220–240 V).
// Nguồn:
// - Brochure Airstream Class II Type A2 (Esco, 9010258 vG):
//   https://www.escolifesciences.com/pdf/9010258_Airstream%20AC2_NS_Brochure_A4_vG_LR.pdf
//   · kích thước ngoài 1340 × 753 × 1400 mm (không chân đế); trong 1220 × 580 × 660 mm; mặt làm việc 0,56 m²;
//   · độ mở thử nghiệm 203 mm (8"), độ mở lớn nhất 445 mm (17,5"); kính trượt cường lực nghiêng 5°;
//   · vận tốc vào trung bình 0,53 m/s (105 fpm), vận tốc xuống trung bình 0,30 m/s (60 fpm);
//   · lưu lượng (bản 4 ft): vào 473 m³/h, xuống 738 m³/h, thải 473 m³/h;
//   · khoảng 1/3 khí trong buồng chung đi ra lọc thải, 2/3 qua lọc cấp xuống thành dòng tầng;
//     gần mặt bàn, dòng xuống chia khoảng một nửa về lưới trước, một nửa về lưới sau;
//   · lọc ULPA/H14: > 99,999 % ở 0,1–0,3 µm (IEST-RP-CC001.3), > 99,999 % ở MPPS (EN 1822),
//     > 99,99 % ở hạt 0,3 µm theo thử rò PAO của NSF 49;
//   · quạt DC ECM tự bù khi điện áp dao động và lọc bị tải bụi; đèn huỳnh quang T5 1025 lux; ồn 57,5 dBA;
//     công suất 181 W; nặng 230 kg; bộ điều khiển Sentinel Gold hiện "Airflow: OK  Sash: OK  I: 0.53 m/s  D: 0.30 m/s";
//   · đèn UV là phụ kiện (UV-30A-L cho bản 4 ft).
// - User manual tủ Esco cùng bộ điều khiển Sentinel (bản LS2, https://manualzilla.com/doc/5713008/user-manual):
//   · báo động kính khi kính rời khỏi độ cao làm việc mà chưa đóng hẳn; báo động khí khi vận tốc dưới ngưỡng hỏng
//     (fail point) do kỹ thuật viên hiệu chuẩn; "UV lamp can only be activated when the sash window is fully closed";
//     hẹn giờ UV tới 18 giờ, hãng khuyên không bật quá 60 phút; tuổi thọ đèn UV 2000 giờ.
// - NSF/ANSI 49 (tóm tắt của ANSI, https://blog.ansi.org/ansi/class-ii-biosafety-cabinets-nsf-ansi-49/):
//   kiểu A2 giữ vận tốc vào trung bình tối thiểu 0,51 m/s (100 fpm).
// - EN 12469 (chưa đối chiếu văn bản gốc): vận tốc vào tối thiểu 0,40 m/s; hệ số bảo vệ người
//   (thử KI-discus) phải ≥ 1 × 10⁵.
// Giả định (chưa xác minh):
// - Ngưỡng báo động khí 0,40 m/s (Esco không công bố số; lấy theo mức tối thiểu của EN 12469).
// - Dung sai cảm biến kính ± 13 mm quanh 203 mm.
// - Quạt ECM giữ lưu lượng thải không đổi khi nâng kính, nên vận tốc vào = lưu lượng thải / (độ mở × chiều rộng);
//   khi kính gần đóng, vận tốc bão hoà quanh 1,5 m/s (quạt không giữ được lưu lượng qua khe hẹp).
// - Hệ số bảo vệ theo vận tốc vào, khi che lưới trước, và tải bụi của lọc: con số MINH HOẠ, không phải số đo.

/** Thông số tủ (Esco Airstream AC2-4S8-NS). Chiều dài mm, lưu lượng m³/h, vận tốc m/s. */
export const CABINET = {
  model: "Esco Airstream AC2-4S8-NS",
  type: "Class II Type A2",
  outside: { width: 1340, depth: 753, height: 1400 },
  inside: { width: 1220, depth: 580, height: 660 },
  workArea: 0.56, // m²
  sashRated: 203, // mm, độ mở thử nghiệm (8")
  sashMax: 445, // mm, độ mở lớn nhất (17,5")
  sashTolerance: 13, // mm, giả định
  sashTilt: 5, // độ, kính nghiêng về phía sau
  inflowNominal: 0.53,
  downflowNominal: 0.30,
  inflowFlow: 473,
  downflowFlow: 738,
  exhaustFlow: 473,
  inflowAlarm: 0.40, // m/s, giả định theo EN 12469
  inflowCap: 1.5, // m/s, giả định: vận tốc lớn nhất qua khe khi kính gần đóng
  inflowMinNsf: 0.51, // m/s, tối thiểu NSF/ANSI 49 cho kiểu A2
  downflowRange: [0.25, 0.50], // m/s, khoảng thường gặp (chưa xác minh)
  filter: { name: "ULPA / H14", efficiency: 0.99999, leakTest: 0.9999 },
  apfRequired: 1e5, // hệ số bảo vệ người tối thiểu (EN 12469)
  lux: 1025,
  noise: 57.5, // dBA
  power: 181, // W
  mass: 230, // kg
  uvMaxMinutes: 60,
};

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

/**
 * Tải bụi của lọc theo thời gian dùng (MINH HOẠ). Chênh áp tăng tuyến tính theo năm; quạt ECM bù được tới
 * gấp đôi chênh áp ban đầu, quá mức đó lưu lượng giảm theo căn bậc hai (quạt và lọc như một trở kháng bậc hai).
 * @param {number} years số năm lọc đã chạy (≥ 0)
 * @returns {{ dp: number, dp0: number, dpMax: number, flowFactor: number, replace: boolean }}
 *   dp: chênh áp qua lọc (Pa), flowFactor: tỉ lệ lưu lượng so với danh định (0–1), replace: nên thay lọc
 */
export function filterLoad(years = 0) {
  const dp0 = 125; // Pa, giả định cho lọc ULPA mới
  const dpMax = 2 * dp0;
  const dp = dp0 * (1 + 0.35 * Math.max(0, years));
  const flowFactor = dp <= dpMax ? 1 : Math.sqrt(dpMax / dp);
  return { dp, dp0, dpMax, flowFactor, replace: dp >= dpMax };
}

/**
 * Trạng thái của kính theo độ mở.
 * @param {number} sash độ mở kính (mm, tính từ mặt tựa tay tới mép dưới kính)
 * @returns {"closed"|"low"|"rated"|"high"} đóng hẳn, thấp hơn mức làm việc, đúng mức làm việc, cao quá
 */
export function sashState(sash, c = CABINET) {
  if (sash <= 2) return "closed";
  if (Math.abs(sash - c.sashRated) <= c.sashTolerance) return "rated";
  return sash < c.sashRated ? "low" : "high";
}

/**
 * Vận tốc khí vào qua cửa trước: lưu lượng thải chia cho diện tích cửa mở (độ mở × chiều rộng trong).
 * Kính đóng hẳn thì không có dòng vào qua cửa (trả về 0).
 * @param {number} sash độ mở kính (mm)
 * @param {{ fan?: boolean, flowFactor?: number }} [opts] quạt bật, tỉ lệ lưu lượng (từ filterLoad)
 * @returns {number} m/s
 */
export function inflowVelocity(sash, { fan = true, flowFactor = 1 } = {}, c = CABINET) {
  if (!fan || sash <= 2) return 0;
  const q = (c.exhaustFlow * flowFactor) / 3600; // m³/s
  const raw = q / ((sash / 1000) * (c.inside.width / 1000));
  // Khe rất hẹp: quạt không đẩy nổi lưu lượng danh định, vận tốc bão hoà quanh c.inflowCap (giả định).
  return raw / (1 + (raw / c.inflowCap) ** 4) ** 0.25;
}

/**
 * Vận tốc dòng tầng đi xuống trên mặt bàn (danh định 0,30 m/s, tỉ lệ với lưu lượng quạt).
 * @param {{ fan?: boolean, flowFactor?: number }} [opts]
 * @returns {number} m/s
 */
export function downflowVelocity({ fan = true, flowFactor = 1 } = {}, c = CABINET) {
  return fan ? c.downflowNominal * flowFactor : 0;
}

/**
 * Tỉ lệ hạt lọt qua lọc: P = 1 − hiệu suất.
 * @param {number} [efficiency] hiệu suất lọc (0–1), mặc định ULPA 0,99999
 * @returns {number}
 */
export function penetration(efficiency = CABINET.filter.efficiency) {
  return 1 - efficiency;
}

/**
 * Số hạt còn lại sau khi đi qua lọc (kỳ vọng).
 * @param {number} count số hạt trước lọc
 * @param {number} [efficiency]
 * @returns {number}
 */
export function afterFilter(count, efficiency = CABINET.filter.efficiency) {
  return count * penetration(efficiency);
}

/**
 * Hệ số bảo vệ người dùng (MINH HOẠ, không phải số đo): tỉ số giữa hạt sinh ra trong tủ và hạt lọt ra phía người.
 * Màn khí vào đủ mạnh (≥ ngưỡng báo động) cho khoảng 10⁵–10⁵·⁵; yếu dần thì giảm theo log tới khoảng 10¹ ở 0,20 m/s;
 * che lưới trước làm màn khí vỡ (giảm 10³ lần); quạt tắt thì không còn bảo vệ.
 * @param {{ inflow: number, grille?: "clear"|"blocked", fan?: boolean, sash: number }} s
 * @returns {{ log10: number, factor: number, pass: boolean }} pass: đạt yêu cầu ≥ 10⁵
 */
export function protectionFactor({ inflow, grille = "clear", fan = true, sash }, c = CABINET) {
  if (sash <= 2) return { log10: Infinity, factor: Infinity, pass: true };
  if (!fan) return { log10: 0, factor: 1, pass: false };
  let log10 = inflow >= c.inflowAlarm ? 5 + 0.5 * clamp((inflow - c.inflowAlarm) / (c.inflowNominal - c.inflowAlarm), 0, 1) : 1 + 4 * clamp((inflow - 0.2) / (c.inflowAlarm - 0.2), 0, 1);
  if (grille === "blocked") log10 -= 3;
  log10 = Math.max(0, log10);
  return { log10, factor: 10 ** log10, pass: log10 >= Math.log10(c.apfRequired) - 1e-9 };
}

/**
 * Đèn UV chỉ được bật khi kính đóng hẳn (khoá liên động).
 * @param {number} sash độ mở kính (mm)
 * @returns {boolean}
 */
export function uvAllowed(sash) {
  return sash <= 2;
}

/**
 * Toàn bộ trạng thái của tủ cho một lựa chọn của người dùng.
 * @param {{ sash?: number, fan?: boolean, grille?: "clear"|"blocked", uv?: boolean, filterYears?: number }} [input]
 * @returns {{ sash: number, sashState: string, fan: boolean, grille: string, inflow: number, downflow: number,
 *   exhaustFlow: number, filter: object, apf: object, alarms: string[], containment: boolean, product: boolean,
 *   uvOn: boolean, uvBlocked: boolean, light: boolean, message: string }}
 *   alarms: "sash" (kính sai độ cao), "airflow" (khí vào dưới ngưỡng); containment: người dùng được bảo vệ;
 *   product: mẫu được bảo vệ (dòng xuống đủ, qua lọc ULPA); uvBlocked: muốn bật UV nhưng kính chưa đóng.
 */
export function cabinetState({ sash = CABINET.sashRated, fan = true, grille = "clear", uv = false, filterYears = 0 } = {}, c = CABINET) {
  sash = clamp(Number(sash) || 0, 0, c.sashMax);
  const filter = filterLoad(filterYears);
  const flowFactor = filter.flowFactor;
  const inflow = inflowVelocity(sash, { fan, flowFactor }, c);
  const downflow = downflowVelocity({ fan, flowFactor }, c);
  const state = sashState(sash, c);
  const apf = protectionFactor({ inflow, grille, fan, sash }, c);
  const alarms = [];
  if (state === "low" || state === "high") alarms.push("sash");
  if (state !== "closed" && (!fan || inflow < c.inflowAlarm)) alarms.push("airflow");
  const containment = state === "closed" || apf.pass;
  const product = fan && downflow >= c.downflowRange[0];
  const uvOn = Boolean(uv) && uvAllowed(sash);
  const uvBlocked = Boolean(uv) && !uvAllowed(sash);
  const light = state !== "closed" && !uvOn;
  let message;
  if (state === "closed") message = uvOn ? "Kính đóng, đèn UV đang khử trùng" : "Kính đóng hẳn";
  else if (!fan) message = "Quạt tắt: không còn màn khí bảo vệ";
  else if (grille === "blocked") message = "Lưới trước bị che: màn khí vỡ, khí dung lọt ra";
  else if (alarms.includes("airflow")) message = "Khí vào dưới 0,40 m/s: mất bảo vệ người";
  else if (alarms.includes("sash")) message = state === "high" ? "Kính cao quá mức làm việc" : "Kính thấp hơn mức làm việc";
  else message = "An toàn";
  return { sash, sashState: state, fan: Boolean(fan), grille, inflow, downflow, exhaustFlow: fan ? c.exhaustFlow * flowFactor : 0, filter, apf, alarms, containment, product, uvOn, uvBlocked, light, message };
}

/**
 * Định dạng số kiểu Việt Nam (dấu phẩy thập phân).
 * @param {number} v
 * @param {number} [digits]
 */
export const vn = (v, digits = 2) => v.toFixed(digits).replace(".", ",");
