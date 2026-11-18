// Mô hình tủ âm sâu −80 °C (theo Thermo Scientific TSX40086V, dòng TSX, 400 hộp 2 inch), dùng chung cho
// bản dựng (Node), trang hình (trình duyệt) và sau này cho lõi mô phỏng của app (src/core).
// Module thuần: không DOM, không Three.js.
//
// Nguồn số liệu:
// - [TDS] Thermo Scientific Technical Data Sheet TSX40086V (TDS_TSX+Advanced_ULT_V6, 10/2017),
//   https://knowledge1.thermofisher.com/@api/deki/files/35109/TSX40086V.pdf?revision=1 :
//   549 L (19,4 ft³), 400 hộp 2 inch; dải nhiệt −50 đến −86 °C; ngoài 1981 × 960 × 719 mm (C × S × R);
//   trong 1300 × 686 × 587 mm; 3 kệ inox chỉnh theo bước 25 mm, mỗi kệ tối đa 73,4 kg; cách nhiệt tấm chân không
//   (VIP) với bọt polyurethane; gioăng silicone có dây sưởi quanh cửa; hệ lạnh hai cấp ghép tầng (cascade),
//   2 máy nén kín, môi chất R290 (cấp 1) / R170 + R290 (cấp 2), dàn ngưng micro-channel quạt gió, dàn bay hơi
//   kiểu thành lạnh (cold wall), xả đá thủ công; cảm biến RTD Pt1000; tuỳ chọn dự phòng LN2 hoặc CO2.
//   Hiệu năng ở môi trường 20 °C: hồi phục sau 1 phút mở cửa về −75 °C: 17 phút; đồng đều trung bình 2,9 °C;
//   ổn định trung bình 2,3 °C; dao động đỉnh +6,0/+1,1 °C (chế độ chuẩn); hạ nhiệt từ phòng xuống −80 °C: 6,5 giờ;
//   ấm lên từ −80 °C tới −50 °C khi mất điện: 267 phút; 7,9 kWh/ngày; 47,5 dBA.
// - [MAN] TSX Series Installation and Operation, 333480H01 Rev. B, 01/2024,
//   https://res.cloudinary.com/iwh/image/upload/q_auto,g_center/assets/1/26/Thermo-TSX_Universal_ULT-UserManual.pdf :
//   cảnh báo nhiệt độ cao chỉnh từ 0 °C tới cách điểm đặt 5 °C; cảnh báo thấp từ −99 °C; cảnh báo cửa mở sau
//   1–5 phút (người dùng chọn); rơ-le báo động khi mất điện, nhiệt cao, nhiệt thấp, cửa mở; cổng cân bằng áp
//   (xả chân không) trên cửa sau bảng điều khiển; giữ cửa trong đóng càng nhiều càng tốt; dự phòng CO2 tiêu thụ
//   3,6–4,5 kg/giờ (8–10 lb), LN2 4,5–5,6 L/giờ, chạy pin tối thiểu 24 giờ.
// - [BRO] Thermo Scientific TSX Universal Series ULT freezers, brochure,
//   https://documents.thermofisher.com/TFS-Assets/LPD/brochures/tsx-ult-freezers-general-purpose-brochure.pdf :
//   2 cửa trong (tuỳ chọn 5 cửa), 4 ngăn (3 kệ chỉnh được), 16 giá × 25 hộp = 400 hộp; dự phòng LN2 giữ được tới
//   −76 °C, CO2 tới −65 °C; phép thử mở cửa 1 phút làm trên tủ rỗng, mở cửa ngoài và tất cả cửa trong cùng lúc.
//
// Các số ước tính, chưa xác minh với hãng (minh hoạ, ghi rõ trong ghi chú 07):
// - Hằng số trao đổi khí khi mở cửa: 100 s khi mở cả cửa trong, 800 s khi cửa trong vẫn đóng (cửa trong giảm
//   trao đổi khí khoảng 8 lần). Hai số này cho không khí khoảng −37 °C sau 1 phút mở hết cửa và khoảng −73 °C khi
//   cửa trong vẫn đóng.
// - Hồi phục: một hằng số thời gian, tính ngược từ con số 17 phút của TDS (từ đỉnh sau 1 phút mở cửa về −75 °C).
// - Ấm lên khi mất điện: định luật Newton về 20 °C, hằng số tính ngược từ 267 phút (−80 → −50 °C) của TDS;
//   các mốc −20 °C và 0 °C là ngoại suy. Tủ đầy mẫu ấm chậm hơn tủ rỗng.
// - Mẫu trong hộp giấy trên giá trễ so với không khí: hằng số 45 phút (ống cryo 2 mL trong hộp, ước tính).
// - Dao động do máy nén chạy ngắt: ± một nửa độ ổn định 2,3 °C của TDS, chu kỳ 15 phút (ước tính).

export const TSX = {
  model: "Thermo Scientific TSX40086V",
  volumeL: 549,
  boxes: 400,
  racks: 16,
  boxesPerRack: 25,
  vialsPerBox: 100,
  shelves: 3,
  innerDoors: 2,
  range: [-86, -50],
  set: -80,
  ambient: 20,
  exterior: { h: 1981, d: 960, w: 719 },
  interior: { h: 1300, d: 686, w: 587 },
  recoveryMin: 17, // về −75 °C sau 1 phút mở cửa (TDS)
  recoveryTo: -75,
  warmMin: 267, // −80 → −50 °C khi mất điện (TDS)
  warmTo: -50,
  pullDownH: 6.5,
  uniformity: 2.9,
  stability: 2.3,
  peak: [6.0, 1.1],
  energyKWhDay: 7.9,
  refrigerants: ["R290", "R170 + R290"],
  // Ước tính (xem đầu file)
  tauOpenS: 100,
  tauInnerClosedS: 800,
  tauSampleMin: 45,
  cycleMin: 15,
};

/** Ngưỡng báo động mặc định dùng trong mô phỏng: cao −70 °C (điểm đặt + 10), thấp −90 °C, cửa mở quá 2 phút (MAN cho chọn 1–5). */
export const ALARM = { high: -70, low: -90, doorS: 120 };

/** Dự phòng khi mất điện: LN2 giữ tới −76 °C, CO2 tới −65 °C (BRO). Điểm đặt dự phòng mặc định −70 °C. */
export const BACKUP = { LN2: { floor: -76, set: -70, usePerH: [4.5, 5.6], unit: "L" }, CO2: { floor: -65, set: -65, usePerH: [3.6, 4.5], unit: "kg" } };

/** Hằng số trao đổi khí (giây) khi cửa ngoài mở; `innerOpen` là phần cửa trong đang mở (0–1). */
export function tauExchange(innerOpen = 1, m = TSX) {
  const rate = 1 / m.tauInnerClosedS + Math.min(1, Math.max(0, innerOpen)) * (1 / m.tauOpenS - 1 / m.tauInnerClosedS);
  return 1 / rate;
}

// Hằng số hồi phục (giây) tính ngược từ TDS: sau 1 phút mở hết cửa, không khí về −75 °C trong 17 phút.
function fitRecovery(m) {
  const peakFor = (tauR) => openAir(60, m.set, tauR, m.tauOpenS, m);
  let lo = 60;
  let hi = 3600;
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    const peak = peakFor(mid);
    const t = mid * Math.log((peak - m.set) / (m.recoveryTo - m.set));
    if (t > m.recoveryMin * 60) hi = mid;
    else lo = mid;
  }
  return (lo + hi) / 2;
}
// Không khí khi cửa mở `s` giây: trao đổi với phòng (τx) trong khi hệ lạnh vẫn kéo về điểm đặt (τr).
function openAir(s, from, tauR, tauX, m) {
  const k = 1 / tauX + 1 / tauR;
  const eq = (m.ambient / tauX + m.set / tauR) / k;
  return eq + (from - eq) * Math.exp(-s * k);
}
/** Hằng số hồi phục của không khí trong tủ (giây), khớp 17 phút về −75 °C của TDS. */
export const TAU_RECOVERY_S = fitRecovery(TSX);
/** Hằng số ấm lên khi mất điện (giây), khớp 267 phút từ −80 tới −50 °C của TDS (Newton về 20 °C). */
export const TAU_WARM_S = (TSX.warmMin * 60) / Math.log((TSX.ambient - TSX.set) / (TSX.ambient - TSX.warmTo));

/**
 * Mở cửa ngoài `seconds` giây rồi đóng lại.
 * opts.innerDoors: true = các cửa trong vẫn đóng (chỉ mở cửa ngoài), false = mở cả cửa trong (như phép thử của hãng).
 * opts.from: nhiệt độ không khí lúc mở (mặc định điểm đặt).
 * Trả về { air: nhiệt độ không khí lúc đóng cửa, rise: độ tăng, recoveryMin: phút để về −75 °C, settleMin: phút để về
 *          trong 1 °C quanh điểm đặt, alarm: có vượt ngưỡng cao không, doorAlarm: mở quá thời gian cảnh báo cửa }.
 */
export function doorOpen(seconds, { innerDoors = true, from = TSX.set } = {}) {
  const s = Math.max(0, Number(seconds) || 0);
  const air = openAir(s, from, TAU_RECOVERY_S, tauExchange(innerDoors ? 0 : 1), TSX);
  const minTo = (target) => (air <= target ? 0 : (TAU_RECOVERY_S * Math.log((air - TSX.set) / (target - TSX.set))) / 60);
  return { air, rise: air - from, recoveryMin: minTo(TSX.recoveryTo), settleMin: minTo(TSX.set + 1), alarm: air > ALARM.high, doorAlarm: s > ALARM.doorS };
}

/** Nhiệt độ không khí (°C) `minutes` phút sau khi đóng cửa, bắt đầu từ `from` (hồi phục bậc nhất về điểm đặt). */
export function recovery(minutes, from = doorOpen(60, { innerDoors: false }).air) {
  return TSX.set + (from - TSX.set) * Math.exp((-Math.max(0, minutes) * 60) / TAU_RECOVERY_S);
}

/**
 * Mất điện `hours` giờ, cửa đóng, tủ rỗng (Newton về nhiệt độ phòng).
 * opts.backup: "none" | "LN2" | "CO2"; opts.from: nhiệt độ lúc mất điện.
 * Trả về { air, sample, hoursTo: { "-70", "-50", "-20", "0" } (giờ, Infinity nếu dự phòng giữ được), alarm }.
 */
export function powerFailure(hours, { backup = "none", from = TSX.set } = {}) {
  const h = Math.max(0, Number(hours) || 0);
  const hold = BACKUP[backup]?.set ?? Infinity;
  const at = (t) => Math.min(TSX.ambient + (from - TSX.ambient) * Math.exp((-t * 3600) / TAU_WARM_S), Math.max(hold, from));
  const hoursTo = {};
  for (const T of [-70, -50, -20, 0]) {
    hoursTo[T] = T > hold || T <= from ? (T <= from ? 0 : Infinity) : (TAU_WARM_S * Math.log((TSX.ambient - from) / (TSX.ambient - T))) / 3600;
  }
  // Mẫu trễ so với không khí (giải bước 1 phút)
  let sample = from;
  for (let t = 0; t < h * 60; t++) sample += (at(t / 60) - sample) * (1 - Math.exp(-1 / TSX.tauSampleMin));
  const air = at(h);
  return { air, sample, hoursTo, alarm: alarmState(air, { power: false }) };
}

/**
 * Trạng thái báo động ở nhiệt độ không khí T.
 * opts: { doorS: số giây cửa ngoài đang mở, power: có điện không }.
 * Trả về { high, low, door, powerFail, any (có cảnh báo nào), text (danh sách tiếng Việt) }.
 */
export function alarmState(T, { doorS = 0, power = true } = {}) {
  const high = T > ALARM.high;
  const low = T < ALARM.low;
  const door = doorS > ALARM.doorS;
  const powerFail = !power;
  const list = [powerFail && "mất điện", high && "nhiệt độ cao", low && "nhiệt độ thấp", door && "cửa mở"].filter(Boolean);
  return { high, low, door, powerFail, any: list.length > 0, text: list.join(", ") };
}

/**
 * Một bước mô phỏng (dt giây) cho trang và cho lõi app.
 * state: { air, sample, t } (°C, °C, giây); inputs: { outer (cửa ngoài mở?), inner (phần cửa trong mở, 0–1),
 * power (có điện?), backup ("none" | "LN2" | "CO2") }. Trả về state mới.
 */
export function step(state, dt, { outer = false, inner = 0, power = true, backup = "none" } = {}) {
  let { air, sample, t = 0 } = state;
  const n = Math.max(1, Math.ceil(dt / 5));
  const h = dt / n;
  for (let i = 0; i < n; i++) {
    let rate = 0;
    if (outer) rate += (TSX.ambient - air) / tauExchange(inner);
    if (power) rate += (TSX.set - air) / TAU_RECOVERY_S;
    else {
      rate += (TSX.ambient - air) / TAU_WARM_S;
      const b = BACKUP[backup];
      if (b && air > b.set) rate += (b.set - 0.5 - air) / 120; // van phun mở: kéo về điểm đặt dự phòng trong vài phút
    }
    air += rate * h;
    sample += (air - sample) * (1 - Math.exp(-h / (TSX.tauSampleMin * 60)));
    t += h;
  }
  return { air, sample, t };
}

/** Dao động hiển thị do máy nén chạy ngắt (± nửa độ ổn định của TDS), t tính bằng giây. */
export const cycling = (t) => (TSX.stability / 2) * Math.sin((2 * Math.PI * t) / (TSX.cycleMin * 60));

/** Chuỗi nhiệt độ cho một thí nghiệm mở cửa: mở `seconds` giây rồi theo dõi `afterMin` phút. Mỗi mẫu { t (s), air, sample, open }. */
export function doorSeries(seconds, { innerDoors = true, afterMin = 40, stepS = 10 } = {}) {
  let s = { air: TSX.set, sample: TSX.set, t: 0 };
  const out = [{ t: 0, air: s.air, sample: s.sample, open: true }];
  const total = seconds + afterMin * 60;
  while (s.t < total - 1e-6) {
    const open = s.t < seconds;
    s = step(s, Math.min(stepS, open ? seconds - s.t : total - s.t) || stepS, { outer: open, inner: innerDoors ? 0 : 1 });
    out.push({ t: s.t, air: s.air, sample: s.sample, open });
  }
  return out;
}

/** Định dạng nhiệt độ kiểu Việt Nam: dấu trừ thật, dấu phẩy thập phân. */
export const fmtT = (T, d = 1) => `${T < 0 ? "−" : ""}${Math.abs(T).toFixed(d).replace(".", ",")}`;
