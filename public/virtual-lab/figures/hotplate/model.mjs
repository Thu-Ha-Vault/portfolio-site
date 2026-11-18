// Mô hình máy khuấy từ gia nhiệt (theo IKA C-MAG HS 7 control), dùng chung cho bản dựng (Node),
// trang hình (trình duyệt) và sau này cho lõi mô phỏng của app (src/core). Module thuần: không DOM, không Three.js.
//
// Nguồn số liệu của máy:
// - IKA, "C-MAG HS 7 control /// Data Sheet" (bảng Technical Data),
//   https://cdn.abicart.com/shop/ws72/72372/art16/156948916-acd6b9-Data_Sheet_C-MAG_HS_7_control.pdf
//   · công suất gia nhiệt 1000 W (công suất vào 1020 W); mặt đế ceramic 180 × 180 mm;
//   · nhiệt độ mặt đế: nhiệt độ phòng – 500 °C, đặt theo bước 5 K; theo môi trường (đầu dò) bước 1 K;
//   · mạch an toàn chỉnh được 100–650 °C; tốc độ 50–1500 vòng/phút, bước 10; mô tơ 9 W; đảo chiều tự động;
//   · thể tích khuấy tối đa 20 L nước; con khuấy dài 30–80 mm; mặt đế tự nóng thêm 2 K khi khuấy tối đa 1 giờ;
//   · cắm đầu dò PT1000, ETS-D5 hoặc ETS-D6; PT1000 đo −10 đến 400 °C;
//   · độ chính xác: mặt đế ±5 K (ở 100 °C); với PT1000 hoặc ETS-D5 ±0,5 K, với ETS-D6 ±0,2 K
//     (500 mL nước trong cốc 600 mL, con khuấy 40 mm, 600 vòng/phút, 50 °C);
//   · tốc độ gia nhiệt 5 K/phút (1 L nước trong cốc H1500); 220 × 88 × 354 mm (rộng × cao × sâu), 4 kg, IP 21.
// - Bản C-MAG HS 7 thường (không "control"): 1000 W, 50–500 °C, 100–1500 vòng/phút, mạch an toàn cố định 550 °C,
//   đèn "Hot Top" cảnh báo mặt đế nóng: https://www.govsci.com/product-detail/IKA--Works--Inc/0003581201/EA/
// - Ngưỡng báo mặt đế còn nóng sau khi tắt: trên 50 °C, theo listing của Cole-Parmer cho C-MAG HS 7 control
//   (https://www.coleparmer.com.cn/i/ika-c-mag-hs-7-control-digital-square-top-stirring-hot-plate-ceramic-115-v/0467103).
//   Chưa xác minh bằng manual của IKA.
//
// Số liệu vật lý:
// - Nhiệt dung riêng của nước 4,18 J/(g·K) ở 25 °C; ẩn nhiệt hoá hơi 2257 J/g ở 100 °C
//   (Engineering ToolBox, "Water – Heat of Vaporization" và "Water – Specific Heat"; khớp bảng hơi nước IAPWS).
// - Áp suất hơi bão hoà theo phương trình Antoine (hằng số của nước, 1–100 °C: A 8,07131, B 1730,63, C 233,426;
//   mmHg, °C; Dortmund Data Bank, chép trong https://en.wikipedia.org/wiki/Antoine_equation).
// - Cốc 250 mL dạng thấp theo ISO 3819: đường kính ngoài 70 mm, cao 95 mm (cốc 1 L: 105 × 145 mm).
//   Thành và đáy dày khoảng 1,5 mm (chưa xác minh theo hãng cốc).
//
// Phần minh hoạ (không có nguồn đo; chọn để thời gian gia nhiệt hợp lý):
// - Mô hình hai nút. Mặt đế (ceramic + điện trở + lớp cách nhiệt) có nhiệt dung C_p = 400 J/K, mất nhiệt ra không khí
//   h_p = 1,0 W/K. Nước trong cốc: m·c·dT/dt = G·(T_p − T) − hA·(T − T_phòng) − Q_bay hơi.
//   Phần nhiệt điện trở đưa được vào nước, η = G·(T_p − T)/P, không cố định mà tuỳ nhiệt độ mặt đế; lúc mặt đế
//   chạy hết công suất η vào khoảng 0,3–0,35.
// - Dẫn nhiệt mặt đế → nước G = g·A_đáy·(0,55 + 0,45·s), g = 140 W/(m²·K), s là mức khuấy 0–1. Chọn g để 1 L nước
//   trong cốc 1 L, mặt đế 500 °C, lên được khoảng 5,6 K/phút (datasheet: 5 K/phút); khi đó 200 mL trong cốc 250 mL,
//   khuấy 600 vòng/phút, đầu dò đặt 80 °C, đi từ 25 lên 79 °C trong khoảng 8,5 phút, vượt quá dưới 1 K.
//   Không có đầu dò, mặt đế đặt 80 °C thì 200 mL nước chỉ ổn định ở khoảng 59 °C.
// - Mất nhiệt của nước: hA = 10 W/(m²·K) × diện tích thành ướt và mặt thoáng; bay hơi dưới điểm sôi
//   Q = 60 W/(m²·kPa) × A_mặt thoáng × (p_bão hoà(T) − 0,5·p_bão hoà(T_phòng)).
// - Điều khiển: không có đầu dò thì giữ mặt đế ở nhiệt độ đặt (nước ổn định thấp hơn nhiệt độ đặt);
//   có đầu dò thì điều khiển PI có bù trước theo nhiệt độ nước (k_p = 10, k_i = 0,05/s), mặt đế được nóng tới
//   500 °C và không quá mạch an toàn.
// - Chênh nhiệt đáy – mặt nước: ΔT = Q_vào / (10 + 60·s) W/K. Con khuấy văng (mất đồng bộ) trên tốc độ
//   n_c = 1250 × (30/L)^0,5 × μ^−0,25 × (V/200 mL)^0,15 vòng/phút (L: chiều dài con khuấy mm, μ: độ nhớt mPa·s).
// - Độ sâu phễu xoáy Δ = (0,12·ω·R)²/g, không quá 0,55 chiều cao cột nước.

export const G0 = 9.80665; // m/s²
export const CP_WATER = 4.18; // J/(g·K)
export const LATENT = 2257; // J/g ở 100 °C
export const BOIL_C = 100; // °C ở 1 atm

/** Thông số máy (IKA C-MAG HS 7 control). Kích thước mm. */
export const HS7 = {
  model: "IKA C-MAG HS 7 control",
  size: { width: 220, height: 88, depth: 354 },
  mass: 4, // kg
  heaterW: 1000,
  plate: { w: 180, d: 180, material: "ceramic" },
  plateMax: 500,
  plateStep: 5, // K, đặt nhiệt độ mặt đế
  mediumStep: 1, // K, đặt nhiệt độ môi trường (có đầu dò)
  safety: [100, 650], // °C, mạch an toàn chỉnh được
  safetyDefault: 550, // °C (giá trị cố định của bản C-MAG HS 7 thường; dùng làm mặc định)
  rpm: [50, 1500],
  rpmStep: 10,
  motorW: 9,
  maxVolumeL: 20,
  barLength: [30, 80], // mm
  ptRange: [-10, 400],
  accuracy: { plate: 5, pt1000: 0.5, etsD5: 0.5, etsD6: 0.2 }, // ±K
  heatRate1L: 5, // K/phút, 1 L nước trong cốc H1500
  hotTopC: 50, // °C, đèn báo mặt đế còn nóng (chưa xác minh với manual)
};

/** Cốc dạng thấp ISO 3819 (đường kính ngoài, chiều cao, mm). */
export const BEAKERS = [
  { ml: 250, od: 70, h: 95 },
  { ml: 600, od: 90, h: 125 },
  { ml: 1000, od: 105, h: 145 },
  { ml: 50, od: 42, h: 60 }, // cốc nhỏ trên bàn hoá học của app (ISO 3819 dạng thấp, theo catalogue DWK)
];
export const BEAKER = { ...BEAKERS[0], wall: 1.5, bottom: 1.5 };
export const BAR = { length: 30, d: 6, ring: 7 }; // con khuấy PTFE hình trụ có vòng xoay giữa (mm)

/** Tham số minh hoạ của mô hình nhiệt (xem đầu file). */
export const THERMAL = {
  room: 25,
  plateC: 400, // J/K
  plateLoss: 1.0, // W/K
  g: 140, // W/(m²·K)
  hAir: 10, // W/(m²·K)
  evap: 60, // W/(m²·kPa)
  rh: 0.5,
  kp: 10, // K mặt đế / K sai lệch
  ki: 0.05, // K mặt đế / (K·s), chỉ tích phân khi sai lệch dưới 3 K
  band: 4, // K, dải tỉ lệ của bộ điều khiển công suất mặt đế
};

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

/** Áp suất hơi bão hoà của nước (kPa), phương trình Antoine 1–100 °C. */
export function psat(T) {
  return 10 ** (8.07131 - 1730.63 / (233.426 + Math.min(T, 100))) * 0.133322;
}

/** Cốc ISO 3819 nhỏ nhất chứa được thể tích (mL); bán kính trong và chiều cao cột nước (mm). */
export function beakerFor(volumeMl, beakerMl = 0) {
  const sizes = [...BEAKERS].sort((x, y) => x.ml - y.ml);
  const b = sizes.find((x) => x.ml >= Math.max(volumeMl, beakerMl)) ?? sizes[sizes.length - 1];
  const rIn = b.od / 2 - BEAKER.wall;
  const area = Math.PI * rIn * rIn; // mm²
  return { ...b, rIn, area, level: (volumeMl * 1000) / area };
}

/**
 * Tốc độ con khuấy bắt đầu văng ra khỏi tâm (mất đồng bộ với nam châm), minh hoạ.
 * @param {{ barMm?: number, viscosity?: number, volumeMl?: number }} o barMm: chiều dài con khuấy; viscosity: mPa·s
 * @returns {number} vòng/phút
 */
export function spinOutRpm({ barMm = BAR.length, viscosity = 1, volumeMl = 200 } = {}) {
  return 1250 * Math.sqrt(30 / barMm) * viscosity ** -0.25 * (Math.max(20, volumeMl) / 200) ** 0.15;
}

/** Độ nhớt của nước (mPa·s) theo nhiệt độ (Vogel, gần đúng 0–100 °C: 1,00 ở 20 °C, 0,35 ở 80 °C). */
export function waterViscosity(T) {
  return 0.02939 * Math.exp(507.88 / (T + 273.15 - 149.3));
}

/**
 * Con khuấy và chất lỏng ở một tốc độ đặt.
 * @param {{ rpm: number, volumeMl?: number, viscosity?: number, barMm?: number }} o
 * @returns {{ coupled: boolean, limit: number, barRpm: number, stir: number, vortexMm: number }}
 *   coupled: con khuấy còn bám theo nam châm; limit: tốc độ văng; barRpm: tốc độ thật của con khuấy;
 *   stir: mức khuấy 0–1 (dùng cho truyền nhiệt và độ đồng đều); vortexMm: độ sâu phễu xoáy.
 */
export function stirOf({ rpm, volumeMl = 200, viscosity = 1, barMm = BAR.length }) {
  const limit = spinOutRpm({ barMm, viscosity, volumeMl });
  const coupled = rpm <= limit;
  const barRpm = coupled ? rpm : Math.min(rpm, limit) * 0.35;
  const stir = clamp(barRpm / 400, 0, 1);
  const b = beakerFor(volumeMl);
  const w = (2 * Math.PI * barRpm) / 60;
  const depth = ((0.12 * w * (b.rIn / 1000)) ** 2 / G0) * 1000;
  return { coupled, limit, barRpm, stir, vortexMm: Math.min(0.55 * b.level, depth) };
}

/** Trạng thái đầu của một lượt gia nhiệt. */
export function initialState({ volumeMl = 200, roomC = THERMAL.room, beakerMl = 0 } = {}) {
  return { t: 0, T: roomC, Tp: roomC, m: volumeMl, I: 0, duty: 0, boiling: false, evaporated: 0, beakerMl: Math.max(beakerMl, volumeMl) };
}

/**
 * Một bước mô phỏng nhiệt (dt giây). Thay đổi `s` tại chỗ và trả về chính nó.
 * @param {object} s trạng thái từ initialState
 * @param {{ setC: number, probe: boolean, heat: boolean, rpm: number, safetyC?: number, roomC?: number }} u
 */
export function stepHeat(s, u, dt, th = THERMAL) {
  const room = u.roomC ?? th.room;
  const b = beakerFor(Math.max(1, s.m), s.beakerMl);
  const st = stirOf({ rpm: u.rpm, volumeMl: Math.max(1, s.m), viscosity: waterViscosity(s.T) });
  const level = (Math.max(0, s.m) * 1000) / b.area / 1000; // m
  const aBase = b.area / 1e6; // m²
  const aWet = aBase + 2 * Math.PI * (b.rIn / 1000) * level;
  const G = s.m > 0.5 ? th.g * aBase * (0.55 + 0.45 * st.stir) : 0.02;
  const plateMax = Math.min(HS7.plateMax, u.safetyC ?? HS7.safetyDefault);
  // Bộ điều khiển
  let target;
  if (!u.heat) { target = room; s.I = 0; }
  else if (u.probe && s.m > 0.5) {
    // PI có bù trước: mặt đế cần để giữ nước ở nhiệt độ đặt = đặt + tổn thất ở nhiệt độ đặt / G
    const err = u.setC - s.T;
    const set = Math.min(u.setC, BOIL_C);
    const lossAtSet = th.hAir * (aWet + aBase) * (set - room) + Math.max(0, th.evap * aBase * (psat(set) - th.rh * psat(room)));
    if (Math.abs(err) < 3) s.I = clamp(s.I + th.ki * err * dt, -30, 30);
    target = clamp(u.setC + lossAtSet / G + th.kp * err + s.I, room, plateMax);
  } else target = clamp(u.setC, room, plateMax);
  s.duty = u.heat ? clamp((target - s.Tp) / th.band, 0, 1) : 0;
  const qHeater = s.duty * HS7.heaterW;
  const qLiquid = G * (s.Tp - s.T);
  const qPlateLoss = th.plateLoss * (s.Tp - room);
  s.Tp += ((qHeater - qLiquid - qPlateLoss) / th.plateC) * dt;
  // Nước
  if (s.m > 0.5) {
    const qAir = th.hAir * aWet * (s.T - room) + th.hAir * aBase * (s.T - room);
    const qEvap = Math.max(0, th.evap * aBase * (psat(s.T) - th.rh * psat(room)));
    const mc = s.m * CP_WATER;
    let next = s.T + ((qLiquid - qAir - qEvap) * dt) / mc;
    s.evaporated += (qEvap * dt) / LATENT;
    s.m -= (qEvap * dt) / LATENT;
    s.boiling = false;
    if (next >= BOIL_C) {
      // Phần nhiệt vượt quá đưa nước lên 100 °C dùng để hoá hơi (2257 J/g)
      const extra = (next - BOIL_C) * mc;
      const gone = extra / LATENT;
      s.m = Math.max(0, s.m - gone);
      s.evaporated += gone;
      next = BOIL_C;
      s.boiling = qLiquid - qAir - qEvap > 0;
    }
    s.T = next;
  } else {
    s.m = 0;
    s.T += ((s.Tp - s.T) * dt) / 60; // cốc cạn: thuỷ tinh nóng theo mặt đế
  }
  s.t += dt;
  s.gradient = s.m > 0.5 ? Math.max(0, qLiquid) / (10 + 60 * st.stir) : 0;
  s.stir = st;
  s.qLiquid = qLiquid;
  s.eta = qHeater > 0 ? qLiquid / qHeater : 0;
  return s;
}

/**
 * Đường gia nhiệt của nước trong cốc.
 * @param {{ volumeMl?: number, setC?: number, probe?: boolean, minutes?: number, rpm?: number, roomC?: number,
 *           safetyC?: number, beakerMl?: number, dt?: number, every?: number }} o
 *   volumeMl: thể tích nước; setC: nhiệt độ đặt (của nước nếu có đầu dò, của mặt đế nếu không);
 *   minutes: thời gian chạy; every: khoảng lấy mẫu (giây) của chuỗi kết quả.
 * @returns {{ series: { min: number, liquid: number, plate: number, volume: number, boiling: boolean }[],
 *   final: object, reachMin: number|null, maxLiquid: number, evaporatedMl: number, steadyLiquid: number }}
 *   reachMin: phút đầu tiên nước cách nhiệt độ đặt dưới 1 K (null nếu không đạt).
 */
export function heat({ volumeMl = 200, setC = 80, probe = true, minutes = 15, rpm = 600, roomC = THERMAL.room, safetyC, beakerMl = 0, dt = 0.5, every = 30 } = {}) {
  const s = initialState({ volumeMl, roomC, beakerMl });
  const series = [];
  let reachMin = null;
  let maxLiquid = s.T;
  const steps = Math.round((minutes * 60) / dt);
  const sample = Math.max(1, Math.round(every / dt));
  const push = () => series.push({ min: s.t / 60, liquid: s.T, plate: s.Tp, volume: s.m, boiling: s.boiling });
  push();
  for (let i = 1; i <= steps; i++) {
    stepHeat(s, { setC, probe, heat: true, rpm, roomC, safetyC }, dt);
    maxLiquid = Math.max(maxLiquid, s.T);
    if (reachMin === null && Math.abs(s.T - (probe ? setC : Math.min(setC, BOIL_C))) < 1) reachMin = s.t / 60;
    if (i % sample === 0) push();
  }
  return { series, final: { ...s }, reachMin, maxLiquid, evaporatedMl: s.evaporated, steadyLiquid: probe ? setC : steadyNoProbe({ volumeMl, plateC: setC, rpm, roomC }) };
}

/**
 * Nhiệt độ nước ổn định khi không có đầu dò và mặt đế giữ ở plateC (giải lặp cân bằng nhiệt).
 * Không vượt 100 °C (khi đó nước sôi).
 */
export function steadyNoProbe({ volumeMl = 200, plateC = 80, rpm = 600, roomC = THERMAL.room, th = THERMAL } = {}) {
  const b = beakerFor(volumeMl);
  const st = stirOf({ rpm, volumeMl });
  const aBase = b.area / 1e6;
  const aWet = aBase + 2 * Math.PI * (b.rIn / 1000) * (b.level / 1000);
  const G = th.g * aBase * (0.55 + 0.45 * st.stir);
  let lo = roomC;
  let hi = Math.max(roomC, plateC);
  for (let i = 0; i < 50; i++) {
    const T = (lo + hi) / 2;
    const net = G * (plateC - T) - th.hAir * (aWet + aBase) * (T - roomC) - Math.max(0, th.evap * aBase * (psat(T) - th.rh * psat(roomC)));
    if (net > 0) lo = T;
    else hi = T;
  }
  return Math.min(BOIL_C, (lo + hi) / 2);
}

/**
 * Lượng nước bay hơi (g ≈ mL) khi nước đang sôi nhận công suất thực netW trong `minutes` phút: netW·t/2257.
 */
export function boilOff({ netW, minutes }) {
  return (netW * minutes * 60) / LATENT;
}

/**
 * Lượt chạy đầy đủ, dùng cho app và cho hình: { volumeMl, setC, rpm, probe, minutes } → tóm tắt và chuỗi số liệu.
 * Nhiệt độ đặt được làm tròn theo bước của máy (1 K có đầu dò, 5 K mặt đế), tốc độ theo bước 10 vòng/phút.
 */
export function runOf({ volumeMl = 200, setC = 80, rpm = 600, probe = true, minutes = 15 } = {}) {
  const v = clamp(Number(volumeMl) || 200, 20, 250);
  const step = probe ? HS7.mediumStep : HS7.plateStep;
  const set = clamp(Math.round((Number(setC) || 80) / step) * step, 30, probe ? HS7.ptRange[1] : HS7.plateMax);
  const n = clamp(Math.round((Number(rpm) || 0) / HS7.rpmStep) * HS7.rpmStep, 0, HS7.rpm[1]);
  const run = heat({ volumeMl: v, setC: set, probe: !!probe, minutes: clamp(Number(minutes) || 15, 1, 120), rpm: n });
  return { volumeMl: v, setC: set, rpm: n, probe: !!probe, minutes: clamp(Number(minutes) || 15, 1, 120), stir: stirOf({ rpm: n, volumeMl: v }), ...run };
}

export const fmtDec = (v, d = 1) => v.toFixed(d).replace(".", ",");
export const fmtInt = (v) => String(Math.round(v)).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
