// Mô hình bình nitơ lỏng bảo quản mẫu, dùng chung cho bản dựng (Node), trang hình (trình duyệt) và lõi mô phỏng của app.
// Module thuần: không DOM, không Three.js.
//
// Bình làm mẫu: Thermo Scientific Locator 4 Plus có bộ đo mức siêu âm (mã CY509108), giá đứng và hộp cryo.
// Nguồn:
// - Operation Manual and Parts List LT509X9 (7018141) Rev 5, 2022, "Locator and Locator Plus Cryogenic Storage Vessel
//   with or without Ultrasonic Level Monitor" (Thermo Fisher):
//   https://knowledge1.thermofisher.com/Lab_Equipment/Cold_Storage_Systems/Cold_Storage_Equipment_Operator_Manuals/Cryopreservation_Operator_Manuals/LT509X9__7018141_-_Rev_5_-_Locator_and_Locator_Plus_Cryogenic_Storage_Vessel_with_or_without_Ultrasonic_Level_Monitor_-_Operation_Manual_and_Parts_List
//   · Section 2 (General Specifications), Locator 4 Plus: cao 39,5" (100,3 cm) kể cả nắp, đường kính 22" (55,9 cm),
//     LN2 121 L (lưu mẫu pha lỏng), bay hơi tĩnh 0,99 L/ngày, 4 000 lọ 2 mL ngập trong LN2 (hộp System 100, 10 × 10);
//     bộ đo mức làm cao thêm 1" (2,54 cm), xe đẩy làm cao thêm 4" (10,16 cm);
//   · Section 3: mức LN2 (đã đặt giá) không bao giờ vượt 22" (55,8 cm) với Locator 4, 6, 8 Plus; LN2 sôi ở −196 °C;
//     cổ bình chịu toàn bộ khối lượng bình trong và LN2; không để LN2 cao hơn đỉnh giá;
//   · Preface: khí N2 làm giảm nồng độ O2, dưới 19,5 % O2 gây chóng mặt, bất tỉnh; khuyên dùng máy đo O2;
//     sương trắng là hơi nước ngưng tụ, khí N2 không màu;
//   · Section 6: bộ đo mức dùng sóng siêu âm (không đầu dò chạm chất lỏng), sai số ±2", màn LED 8 vạch như đồng hồ xăng;
//     đèn LOW LEVEL sáng khi LN2 dưới khoảng 2", còi và tiếp điểm báo động từ xa khi dưới khoảng 1",
//     còi kêu liên tục và màn LED nhấp nháy khi bình hết LN2 hoặc bộ đo lỗi;
//     phải bấm RESET (chế độ Reset/Hold, không đo) trước khi nhấc nắp; để Hold quá 5 phút thì còi kêu;
//     sau khi đậy lại cần khoảng 15 phút để sương trong cổ tan và số đo ổn định.
// - Manual LT509X1 (2008), bảng phụ tùng: Locator 4 Plus có 4 giá, 10 hộp mỗi giá (40 hộp), lọ 2,0 mL Ø 13,5 × 48,3 mm:
//   https://knowledge1.thermofisher.com/Manual_Repository/LT509X1-EN_-_Rev_01_-_Locator_and_Locator_Plus_Cryobiological_Storage_Vessel_and_Liquid_Nitrogen_Level_Monitor_Operating_Manual
// - Trang sản phẩm CY509108 (Thermo Fisher): cổ bình Ø trong 8,5" (21,5 cm), thời gian giữ tĩnh 122 ngày,
//   giữ mẫu dưới −180 °C kể cả khi còn dưới 2" (5 cm) LN2, khối lượng vận chuyển 53,5 kg, có tiếp điểm báo động khô:
//   https://www.thermofisher.com/order/catalog/product/CY509108
//   (Trang này ghi "Energy Usage 0.60 L", khác 0,99 L/ngày trong manual Rev 5; dùng 0,99 vì khớp 121 L / 122 ngày.)
// - Tỉ lệ giãn nở LN2 → khí: 1 : 694 (từ điểm sôi tới 20 °C), USDA ARS "Liquid Nitrogen Safety":
//   https://www.ars.usda.gov/northeast-area/docs/safety-health-and-environmental-training/liquid-nitrogen-safety/
//   (kiểm lại: LN2 0,807 kg/L ở 77 K, N2 khí 1,165 kg/m³ ở 20 °C, 1 atm → khoảng 693.)
// - O2 trong không khí khô 20,9 % theo thể tích; ngưỡng thiếu O2 19,5 % (OSHA 29 CFR 1910.146, cũng ghi trong manual).
//
// Giả định (chưa xác minh):
// - Mức LN2 tỉ lệ thuận với thể tích: tiết diện = 121 L / 55,8 cm ≈ 2,17 L/cm (bình trong Ø khoảng 52 cm),
//   bỏ qua thể tích giá và hộp chiếm chỗ, bỏ qua đáy cong.
// - Nhiệt độ pha hơi theo độ cao trên mặt LN2 chỉ minh hoạ: −196 °C ở mặt thoáng, tăng chậm tới −180 °C ở
//   khoảng 50 cm (khớp câu "dưới −180 °C khi còn dưới 5 cm LN2" của hãng với hộp trên cùng cao khoảng 52 cm),
//   rồi tăng nhanh trong cổ bình. Hãng không công bố đường nhiệt độ.
// - Ước tính O2 coi khí N2 trộn đều trong phòng kín, không thông gió: O2 = 20,9 × (1 − V_khí / V_phòng).
// - Mở nắp làm tăng bay hơi nhưng hãng không công bố lượng tăng, nên mô hình bỏ qua.

/** Thông số bình (Thermo Scientific Locator 4 Plus, CY509108). */
export const VESSEL = {
  model: "Thermo Scientific Locator 4 Plus (CY509108)",
  capacityL: 121, // L, lưu mẫu pha lỏng
  evapLPerDay: 0.99, // L/ngày, bay hơi tĩnh
  holdingDays: 122, // ngày, thời gian giữ tĩnh (hãng)
  maxFillCm: 55.8, // cm, mức cao nhất khi đã đặt giá
  heightCm: 100.3, // cm, kể cả nắp
  diameterCm: 55.9, // cm
  neckCm: 21.5, // cm, đường kính trong cổ
  monitorCm: 2.54, // cm, bộ đo mức làm cao thêm
  cartCm: 10.16, // cm, xe đẩy làm cao thêm
  shipKg: 53.5,
  racks: 4,
  boxesPerRack: 10,
  vialsPerBox: 100, // hộp System 100, 10 × 10 lọ
  vials: 4000,
  sampleLimitC: -180, // giữ mẫu dưới mức này kể cả khi còn dưới 5 cm LN2 (hãng)
};

/** Bộ đo mức siêu âm gắn trên nắp. */
export const MONITOR = {
  segments: 8,
  accuracyCm: 5.08, // ±2"
  lowCm: 5.08, // đèn LOW LEVEL
  alarmCm: 2.54, // còi và báo động từ xa
  holdAlarmMin: 5, // Reset/Hold quá 5 phút thì còi kêu
  settleMin: 15, // sương trong cổ tan sau khoảng 15 phút
};

/** Tính chất nitơ lỏng và không khí. */
export const LN2 = {
  boilC: -196, // °C ở 1 atm (manual ghi −196 °C; chính xác −195,8 °C)
  expansion: 694, // L khí ở 20 °C cho 1 L lỏng
  o2Air: 20.9, // % thể tích
  o2Limit: 19.5, // % ngưỡng thiếu oxy
};

/** Tiết diện bình trong (L cho mỗi cm chiều cao), giả định mức tỉ lệ thuận với thể tích. */
export const AREA_L_PER_CM = VESSEL.capacityL / VESSEL.maxFillCm;

/** Chiều cao mặt LN2 trên đáy bình (cm) khi bình chứa `litres` lít. */
export const levelCm = (litres) => Math.max(0, litres) / AREA_L_PER_CM;

/** Thể tích LN2 (L) ứng với mức `cm` trên đáy bình. */
export const litresAt = (cm) => Math.max(0, cm) * AREA_L_PER_CM;

/** Thời gian giữ tĩnh (ngày) từ lúc bình có `startL` lít tới khi cạn. */
export const holdingDays = (startL = VESSEL.capacityL) => Math.max(0, startL) / VESSEL.evapLPerDay;

/**
 * LN2 còn lại sau `days` ngày đậy nắp, bắt đầu từ `startL` lít (mặc định đầy).
 * @returns {{litres:number, cm:number, fraction:number, evaporated:number, empty:boolean}}
 *   litres: lít còn lại; cm: mức trên đáy; fraction: phần của dung tích 121 L;
 *   evaporated: lít đã bay hơi; empty: đã cạn.
 */
export function levelAfter(days, startL = VESSEL.capacityL) {
  const start = Math.min(VESSEL.capacityL, Math.max(0, startL));
  const litres = Math.max(0, start - VESSEL.evapLPerDay * Math.max(0, days));
  return { litres, cm: levelCm(litres), fraction: litres / VESSEL.capacityL, evaporated: start - litres, empty: litres <= 1e-9 };
}

/** Số ngày từ lúc bình có `startL` lít tới khi mức LN2 xuống còn `cm` cm. */
export const daysUntil = (cm, startL = VESSEL.capacityL) => Math.max(0, (startL - litresAt(cm)) / VESSEL.evapLPerDay);

/**
 * Nhiệt độ pha hơi (°C) ở độ cao `heightCm` trên mặt LN2. Đường minh hoạ, không theo số đo của hãng:
 * −196 °C ở mặt thoáng, −180 °C ở 50 cm, rồi tăng nhanh trong cổ bình tới khoảng −70 °C ở 75 cm.
 */
export function vaporTemp(heightCm) {
  const h = Math.max(0, heightCm);
  if (h <= 50) return LN2.boilC + 16 * (h / 50) ** 1.5;
  return -180 + 110 * Math.min(1, (h - 50) / 25) ** 1.2;
}

/** Thể tích khí N2 (m³, 20 °C) sinh ra khi `litres` lít LN2 bay hơi hết. */
export const gasM3 = (litres) => (Math.max(0, litres) * LN2.expansion) / 1000;

/**
 * Nồng độ O2 (% thể tích) ước tính khi `litresLN2` lít LN2 bay hơi trong phòng kín `roomM3` m³,
 * khí trộn đều, không thông gió: O2 = 20,9 × (1 − V_khí / V_phòng), không âm.
 */
export function oxygenPercent(litresLN2, roomM3 = 30) {
  const room = Math.max(1e-6, roomM3);
  return Math.max(0, LN2.o2Air * (1 - gasM3(litresLN2) / room));
}

/** Lượng LN2 (L) bay hơi trong phòng `roomM3` m³ thì O2 chạm ngưỡng 19,5 %. */
export const litresToO2Limit = (roomM3 = 30) => ((1 - LN2.o2Limit / LN2.o2Air) * roomM3 * 1000) / LN2.expansion;

/**
 * Trạng thái bộ đo mức siêu âm ở mức LN2 `level` (cm trên đáy).
 * @param {number} level  cm
 * @param {{hold?:boolean, holdMin?:number}} opt  hold: đang ở chế độ Reset/Hold (nắp đã nhấc); holdMin: số phút đã Hold.
 * @returns {{state:string, segments:number, lowLamp:boolean, audible:boolean, flash:boolean, reset:boolean, text:string}}
 *   state: "ok" | "low" (dưới 2") | "alarm" (dưới 1") | "empty" | "hold" | "hold-alarm".
 */
export function alarmState(level, { hold = false, holdMin = 0 } = {}) {
  if (hold) {
    const over = holdMin > MONITOR.holdAlarmMin;
    return { state: over ? "hold-alarm" : "hold", segments: 0, lowLamp: false, audible: over, flash: false, reset: true, text: over ? "HOLD quá 5 phút · còi" : "RESET/HOLD · không đo" };
  }
  const cm = Math.max(0, level);
  const segments = cm <= 1e-6 ? 0 : Math.max(1, Math.min(MONITOR.segments, Math.ceil((cm / VESSEL.maxFillCm) * MONITOR.segments)));
  if (cm <= 0.05) return { state: "empty", segments: 0, lowLamp: true, audible: true, flash: true, reset: false, text: "CẠN · còi liên tục" };
  if (cm < MONITOR.alarmCm) return { state: "alarm", segments, lowLamp: true, audible: true, flash: false, reset: false, text: "dưới 1\" · còi" };
  if (cm < MONITOR.lowCm) return { state: "low", segments, lowLamp: true, audible: false, flash: false, reset: false, text: "LOW LEVEL · dưới 2\"" };
  return { state: "ok", segments, lowLamp: false, audible: false, flash: false, reset: false, text: "bình thường" };
}

/** Số thập phân kiểu Việt Nam (dấu phẩy). */
export const dec = (value, digits = 1) => value.toFixed(digits).replace(".", ",").replace(/^-0(,0+)?$/, "0$1");

/** Số nguyên có dấu cách hàng nghìn (4 000). */
export const fmtInt = (value) => String(Math.round(value)).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
