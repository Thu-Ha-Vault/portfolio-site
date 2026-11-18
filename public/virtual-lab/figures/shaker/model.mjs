// Mô hình tủ ấm lắc ổn nhiệt để bàn (theo New Brunswick Innova 42, Eppendorf; bản 230 V, quỹ đạo 1 inch, M1335-0012),
// dùng chung cho bản dựng (Node), trang hình (trình duyệt) và sau này cho lõi mô phỏng của app (src/core).
// Module thuần: không DOM, không Three.js, không import.
//
// Nguồn số liệu:
// - [DS] New Brunswick Scientific, "Innova 42 & 42R Incubator Shakers", datasheet B-2011b (2008),
//   https://cdn.labwrench.com/eMan/manualNo/2453/new_brunswick_scientific_innova_42_/_42r_datasheet.pdf :
//   ngoài 62 × 75,4 × 82 cm (rộng × sâu × cao), mở cửa sâu 130 cm; lòng tủ 51,8 × 51,6 × 47,7 cm (cao tính từ mặt mâm);
//   mâm 46 × 46 cm (18 × 18 inch); cửa sổ 25,1 × 34,6 cm kính ba lớp; quỹ đạo đường kính 1,9 cm hoặc 2,54 cm;
//   25–400 rpm (±1 rpm); 5 °C trên nhiệt độ phòng tới 80 °C, ±0,1 °C ở 37 °C, đồng đều danh định ±0,25 °C;
//   hẹn giờ 0,1–99,9 giờ; báo động khi tốc độ lệch > 5 rpm, nhiệt độ lệch > 1 °C, hết giờ; 2 đèn halogen 12 V 10 W;
//   cơ cấu lệch tâm ba trục có đối trọng, 9 ổ bi, mô tơ DC không chổi than; mạch tăng/giảm tốc êm; 98 kg; 1500 VA;
//   sức chứa mâm vạn năng: 18 bình 250 mL, 14 bình 500 mL, 8 bình 1 L…
// - [MAN] Eppendorf, "New Brunswick Innova 42/42R Shaker — Operating manual" M1335-0055-01/102022 (bản tiếng Pháp),
//   https://www.eppendorf.com/product-media/doc/fr/141465_Operating-Manual/New-Brunswick_Shakers_Operating-manual_New-Brunswick-Innova-42-42R-Shaker.pdf :
//   mục 3.3 phím START/STOP, màn hình LCD, núm xoay-bấm ở phía trên mặt trước; công tắc nguồn và RS-232 ở hông phải;
//   mục 3.8 mở cửa thì sưởi tắt, máy dừng lắc, đèn trong bật; mục 3.9 khay hứng tràn và bể nước tạo ẩm, van xả bên phải;
//   hình 3-2: đèn halogen, ổ điện trong buồng, kệ tháo được, thanh đục lỗ, khay hứng; hình 5-1: vít mâm, mâm, tấm chắn
//   tràn, vỏ ổ bi; mục 4: cần 84 cm bề ngang để mở cửa (cửa quay quanh trục đứng).
//
// Các số ước tính, chưa xác minh với hãng (minh hoạ):
// - Phía bản lề cửa (vẽ bên trái), chiều quay của mâm (vẽ theo chiều kim đồng hồ nhìn từ trên).
// - Nhiệt độ khi mở cửa: không khí trong buồng tiến về nhiệt độ phòng với hằng số 4 phút; đóng cửa thì sưởi kéo về
//   điểm đặt với hằng số 6 phút. Tăng/giảm tốc: 60 rpm/s.
// - Mặt thoáng trong bình: gần đúng tĩnh, nghiêng theo gia tốc hướng tâm của mâm (atan(rω²/g)), trễ pha 25°, tối đa 40°.
// - Độ đục theo OD600: 0 trong (màu vàng rơm nhạt của LB), từ 2 trở lên đục vàng nâu nhạt; ánh xạ là minh hoạ.

export const INNOVA42 = {
  model: "New Brunswick Innova 42 (M1335-0012, 230 V 50 Hz, quỹ đạo 1 inch)",
  outer: { w: 620, d: 754, h: 818 }, // mm
  openDepth: 1300,
  chamber: { w: 518, d: 516, h: 477 }, // cao tính từ mặt mâm
  platform: { w: 460, d: 460 },
  window: { w: 251, h: 346 },
  orbitMm: 25.4, // đường kính quỹ đạo
  rpm: [25, 400],
  tempAboveAmbient: 5,
  tempMax: 80,
  accuracyC: 0.1,
  uniformityC: 0.25,
  alarmRpm: 5,
  alarmC: 1,
  timerH: [0.1, 99.9],
  lampsW: [10, 10],
  massKg: 98,
  powerVA: 1500,
  capacity250: 18,
};

export const AMBIENT_C = 25; // phòng thí nghiệm ở Việt Nam có điều hoà (giả định)
export const G_ACC = 9.81;
export const RAMP_RPM_S = 60; // minh hoạ
export const TAU_OPEN_S = 240; // minh hoạ
export const TAU_CLOSED_S = 360; // minh hoạ
export const TILT_MAX = (40 * Math.PI) / 180;
export const TILT_LAG = (25 * Math.PI) / 180;
export const DIRECTION = -1; // −1: chiều kim đồng hồ nhìn từ trên (chưa xác minh)

// Bình nuôi cấy: bình tam giác 250 mL cổ hẹp (Ø đáy 85 mm, cao 145 mm, cổ Ø 34 mm) chứa 50 mL (quy tắc ≤ 20 %),
// ống nuôi cấy 14 mL (17 × 100 mm, đáy tròn) chứa 5 mL. Kích thước thông dụng, chưa xác minh với một hãng cụ thể.
export const VESSELS = {
  flask: { ml: 250, fillMl: 50, baseD: 85, h: 145, neckD: 34 },
  tube: { ml: 14, fillMl: 5, d: 17, h: 100 },
};
export const MAX_VESSELS = 6;

/** Mẫu khi trang không nhận #run: hai bình LB nuôi qua đêm, lắc 200 rpm ở 37 °C, kèm hai ống 5 mL. */
export const DEFAULT_RUN = {
  setC: 37,
  tempC: 37,
  rpm: 200,
  door: "closed",
  hours: 14,
  flasks: [
    { label: "LB + Amp · khuẩn lạc 1", od: 2.6, kind: "flask" },
    { label: "LB + Amp · khuẩn lạc 2", od: 2.2, kind: "flask" },
    { label: "LB 5 mL · khuẩn lạc 3", od: 3.1, kind: "tube" },
    { label: "LB 5 mL · đối chứng", od: 0.02, kind: "tube" },
  ],
};

const num = (v, fallback) => (Number.isFinite(Number(v)) && v !== null && v !== "" ? Number(v) : fallback);
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

export const clampRpm = (rpm) => (rpm <= 0 ? 0 : clamp(Math.round(rpm), INNOVA42.rpm[0], INNOVA42.rpm[1]));
export const clampSet = (c, ambient = AMBIENT_C) => clamp(Math.round(c * 10) / 10, ambient + INNOVA42.tempAboveAmbient, INNOVA42.tempMax);

/** Chuẩn hoá dữ liệu #run theo hợp đồng { setC, tempC, rpm, door, hours, flasks: [{ label, od, kind }] }. */
export function normalizeRun(run) {
  const r = run && typeof run === "object" ? run : DEFAULT_RUN;
  const setC = clampSet(num(r.setC, 37));
  const flasks = (Array.isArray(r.flasks) ? r.flasks : [])
    .slice(0, MAX_VESSELS)
    .map((f, i) => ({
      label: String(f?.label ?? `Bình ${i + 1}`).slice(0, 40),
      od: clamp(num(f?.od, 0), 0, 4),
      kind: f?.kind === "tube" ? "tube" : "flask",
    }));
  return {
    setC,
    tempC: clamp(num(r.tempC, setC), 4, 90),
    rpm: clampRpm(num(r.rpm, 200)),
    door: r.door === "open" ? "open" : "closed",
    hours: clamp(num(r.hours, 0), 0, 99.9),
    flasks,
  };
}

export const omegaOf = (rpm) => (2 * Math.PI * rpm) / 60; // rad/s
export const periodOf = (rpm) => (rpm > 0 ? 60 / rpm : Infinity); // s
/** Gia tốc hướng tâm của mâm (m/s²) với quỹ đạo của máy. */
export const accelOf = (rpm, orbitMm = INNOVA42.orbitMm) => (orbitMm / 2000) * omegaOf(rpm) ** 2;
/** Góc nghiêng mặt thoáng (rad), gần đúng tĩnh, giới hạn TILT_MAX. */
export const tiltOf = (rpm) => Math.min(TILT_MAX, Math.atan(accelOf(rpm) / G_ACC));

/** Độ lệch tâm của mâm (mm) ở pha ψ (rad): mọi điểm của mâm đi cùng một vòng tròn bán kính = nửa đường kính quỹ đạo. */
export function platformOffset(psi, orbitMm = INNOVA42.orbitMm) {
  const r = orbitMm / 2;
  return [r * Math.cos(psi), r * Math.sin(psi)];
}
/** Pha quỹ đạo sau dt giây ở tốc độ rpm (theo chiều quay của máy). */
export const advancePhase = (psi, rpm, dt) => (psi + DIRECTION * omegaOf(rpm) * dt) % (2 * Math.PI);
/** Hướng (rad) mà chất lỏng dồn về: theo hướng lệch tâm, trễ pha TILT_LAG theo chiều quay. */
export const sloshAngle = (psi) => psi - DIRECTION * TILT_LAG;

/** Tốc độ thực tiến về tốc độ đích theo mạch tăng/giảm tốc. */
export function rampRpm(rpm, target, dt) {
  const d = target - rpm;
  const s = RAMP_RPM_S * dt;
  return Math.abs(d) <= s ? target : rpm + Math.sign(d) * s;
}

/** Nhiệt độ không khí trong buồng sau dt giây: cửa mở thì sưởi tắt, nguội về nhiệt độ phòng. */
export function stepTemp(T, dt, { setC, door, ambient = AMBIENT_C }) {
  if (door === "open") return ambient + (T - ambient) * Math.exp(-dt / TAU_OPEN_S);
  return setC + (T - setC) * Math.exp(-dt / TAU_CLOSED_S);
}

/** Độ đục 0–1 theo OD600 (minh hoạ): tăng nhanh ở OD thấp, bão hoà từ OD 2. */
export const turbidityOf = (od) => Math.min(1, Math.sqrt(Math.max(0, od) / 2));

/** Báo động theo [DS]/[MAN]: cửa mở, nhiệt độ lệch > 1 °C, tốc độ lệch > 5 rpm khi đã chạy ổn định. */
export function alarmsOf({ setC, tempC, rpmSet, rpm, door, running, settled }) {
  const out = [];
  if (door === "open") out.push("cửa mở");
  if (Math.abs(tempC - setC) > INNOVA42.alarmC) out.push(`nhiệt độ lệch ${fmt(tempC - setC, 1, true)} °C`);
  if (running && settled && Math.abs(rpm - rpmSet) > INNOVA42.alarmRpm) out.push("tốc độ lệch");
  return out;
}

export const fmt = (v, digits = 1, sign = false) => {
  const s = Math.abs(v).toFixed(digits).replace(".", ",");
  return (v < 0 ? "−" : sign && v > 0 ? "+" : "") + s;
};
