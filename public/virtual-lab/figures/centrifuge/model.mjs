// Mô hình máy ly tâm vi lượng, dùng chung cho bản dựng (Node), trang hình (trình duyệt) và lõi mô phỏng của app.
// Module thuần: không DOM, không Three.js.
//
// Máy làm mẫu: Eppendorf Centrifuge 5425 (không làm lạnh) với rotor góc cố định FA-24×2, nắp rotor kín khí dung.
// Nguồn:
// - Operating manual Centrifuge 5425 (Eppendorf, 5405 900 027-03/122021):
//   https://www.eppendorf.com/product-media/doc/en/338022/Centrifugation_Operating-manual_Centrifuge-5425.pdf
//   · mục 3.3: tối đa 21 300 × g hoặc 15 060 rpm, hơn 10 mức tăng tốc/phanh;
//   · mục 11.3: rộng 24 cm, sâu 39 cm, cao 24 cm, nặng 15,6 kg (không rotor); rotor FA-24×2 nặng 797,5 g;
//   · mục 11.5–11.6: tăng tốc 15 s, phanh 15 s (FA-24×2, mức 9 mặc định, theo DIN 58 970);
//     bảng mức 0–9: tăng tốc 360…15 s, phanh 370…15 s;
//   · tốc độ 100–15 060 rpm (bước 10 rpm dưới 5 000, bước 100 rpm trên 5 000);
//     lực 50–21 300 × g (bước 50 × g dưới 3 000, bước 100 × g trên 3 000); thời gian 5 s – 9:59 h hoặc ∞;
//     động năng tối đa 4,136 kJ; tỉ trọng mẫu cho phép 1,2 g/mL;
//   · mục 12.1: FA-24×2, 24 ống 1,5/2 mL, tải tối đa mỗi lỗ 24 × 3,75 g (adapter + ống + mẫu),
//     bán kính lớn nhất 8,4 cm với ống 1,5/2 mL (6,3 cm với adapter ống PCR 0,2 mL, 7,3 cm với ống 0,5 mL);
//   · mục 5 (màn hình): "At set rpm" bắt đầu đếm giờ khi đạt 95 % tốc độ đặt, nếu tắt thì đếm ngay;
//   · mục 9.2: lỗi IMBAL khi rotor nạp lệch; mục 9.1: nắp chưa đóng thì không chạy được;
//     LID ERROR khi mở nắp lúc đang quay; nhả khoá nắp bằng phím open.
// - Công thức RCF theo DIN 58 970 (cũng in trong manual Centrifuge 5424, mục 2.4.1):
//   rcf = 1,118 × 10⁻⁵ × n² × r_max (n: rpm, r_max: cm).
// - Hệ số k của rotor (thời gian lắng): k = 2,53 × 10¹¹ × ln(r_max / r_min) / n², t (giờ) = k / S
//   (S: hệ số lắng tính bằng Svedberg). Hãng không công bố r_min và k của FA-24×2 trong manual;
//   r_min = 5,85 cm là ước tính (chưa xác minh): ống 2 mL đầy, cột mẫu khoảng 36 mm nằm nghiêng 45°.
// - Ngưỡng phát hiện lệch tâm: hãng không công bố. Giả định (chưa xác minh): máy cắt khi lực lệch tâm
//   vượt lực của 0,5 g lệch tâm ở tốc độ tối đa; khối lượng ống 2 mL rỗng giả định 1,0 g.

/** Thông số máy (Eppendorf Centrifuge 5425). */
export const MACHINE = {
  model: "Eppendorf Centrifuge 5425",
  size: { width: 240, depth: 390, height: 240 }, // mm
  mass: 15.6, // kg, không rotor
  maxRpm: 15060,
  maxRcf: 21300,
  minRpm: 100,
  minRcf: 50,
  minSeconds: 5,
  maxSeconds: 9 * 3600 + 59 * 60,
  // Thời gian tăng tốc / phanh (giây) theo mức ramp 0–9, rotor FA-24×2 tải tối đa.
  accel: [360, 300, 240, 180, 120, 90, 60, 45, 30, 15],
  brake: [370, 300, 240, 180, 120, 90, 60, 45, 30, 15],
  defaultRamp: 9,
  noise: 51, // dB(A)
  kineticMax: 4136, // J
  atSetFraction: 0.95,
};

/** Rotor góc cố định FA-24×2. Bán kính tính bằng cm. */
export const ROTOR = {
  name: "FA-24×2",
  slots: 24,
  angle: 45, // độ, ống nghiêng so với trục quay
  rMax: 8.4,
  rMin: 5.85, // ước tính, chưa xác minh
  maxLoadPerBore: 3.75, // g
  mass: 797.5, // g
  aerosolTight: true,
};

/** Ống mẫu mặc định: ống 2 mL (khối lượng rỗng giả định) chứa 1,5 mL dung dịch nước. */
export const TUBE = { empty: 1.0, volume: 1.5, density: 1.0 };

/** Giả định (chưa xác minh): lệch tâm cho phép quy về khối lượng ở r_max, tại tốc độ tối đa. */
export const IMBALANCE = { tolerance: 0.5 };

const K_RCF = 1.118e-5;

/** Lực ly tâm tương đối (× g) ở bán kính rCm (cm) khi quay rpm vòng/phút. */
export function rcfFromRpm(rpm, rCm = ROTOR.rMax) {
  return K_RCF * rCm * rpm * rpm;
}

/** Tốc độ (rpm) cần để đạt rcf (× g) ở bán kính rCm. */
export function rpmFromRcf(rcf, rCm = ROTOR.rMax) {
  return Math.sqrt(Math.max(0, rcf) / (K_RCF * rCm));
}

/** Làm tròn tốc độ theo bước đặt của máy: 10 rpm dưới 5 000 rpm, 100 rpm từ 5 000 rpm. */
export function snapRpm(rpm) {
  const step = rpm < 5000 ? 10 : 100;
  return Math.min(MACHINE.maxRpm, Math.max(MACHINE.minRpm, Math.round(rpm / step) * step));
}

/** Làm tròn lực theo bước đặt của máy: 50 × g dưới 3 000, 100 × g từ 3 000. */
export function snapRcf(rcf) {
  const step = rcf < 3000 ? 50 : 100;
  return Math.min(MACHINE.maxRcf, Math.max(MACHINE.minRcf, Math.round(rcf / step) * step));
}

/** Hệ số k của rotor ở tốc độ rpm (giờ·Svedberg). */
export function kFactor(rpm = MACHINE.maxRpm, rMin = ROTOR.rMin, rMax = ROTOR.rMax) {
  return (2.53e11 * Math.log(rMax / rMin)) / (rpm * rpm);
}

/**
 * Thời gian để hạt có hệ số lắng S (Svedberg) lắng hết xuống đáy ống, tính bằng giây.
 * t = k / S (giờ). Chỉ là ước lượng bậc độ lớn: bỏ qua thời gian tăng/giảm tốc và khuếch tán.
 */
export function pelletSeconds(S, rpm = MACHINE.maxRpm) {
  return (kFactor(rpm) / S) * 3600;
}

/** Thời gian tăng tốc và phanh (giây) từ 0 đến tốc độ tối đa theo mức ramp. */
export function rampTimes(level = MACHINE.defaultRamp) {
  const i = Math.max(0, Math.min(9, Math.round(level)));
  return { accel: MACHINE.accel[i], brake: MACHINE.brake[i] };
}

/**
 * Chuẩn hoá danh sách ống: nhận chỉ số lỗ (0–23) hoặc { slot, mass } (mass: g, gồm ống và mẫu).
 * Lỗ trùng chỉ tính một lần; lỗ ngoài 0–23 bị bỏ.
 */
export function loadOf(tubes = []) {
  const mass0 = TUBE.empty + TUBE.volume * TUBE.density;
  const out = new Map();
  for (const t of tubes) {
    const slot = typeof t === "number" ? t : t?.slot;
    if (!Number.isInteger(slot) || slot < 0 || slot >= ROTOR.slots) continue;
    const mass = typeof t === "object" && Number.isFinite(t.mass) ? t.mass : mass0;
    out.set(slot, Math.min(mass, 10));
  }
  return [...out].sort((a, b) => a[0] - b[0]).map(([slot, mass]) => ({ slot, mass }));
}

/** Góc của lỗ (radian), lỗ 0 ở góc 0, tăng ngược chiều kim đồng hồ nhìn từ trên. */
export const slotAngle = (slot) => (slot / ROTOR.slots) * Math.PI * 2;

/** Lệch tâm của tải: độ lớn tổng véc-tơ khối lượng (g, quy về r_max) và góc của nó. */
export function imbalanceOf(tubes) {
  let x = 0;
  let y = 0;
  for (const { slot, mass } of loadOf(tubes)) {
    x += mass * Math.cos(slotAngle(slot));
    y += mass * Math.sin(slotAngle(slot));
  }
  const grams = Math.hypot(x, y);
  return { grams: grams < 1e-9 ? 0 : grams, angle: Math.atan2(y, x) };
}

/**
 * Luật nạp của hãng: mỗi ống phải có một ống đối diện (lỗ + 12) cùng loại, cùng lượng mẫu.
 * Trả về các lỗ thiếu ống đối diện hoặc lệch khối lượng quá 0,1 g.
 */
export function unpairedSlots(tubes) {
  const load = loadOf(tubes);
  const bySlot = new Map(load.map((t) => [t.slot, t.mass]));
  return load.filter(({ slot, mass }) => {
    const other = bySlot.get((slot + ROTOR.slots / 2) % ROTOR.slots);
    return other === undefined || Math.abs(other - mass) > 0.1;
  }).map((t) => t.slot);
}

/**
 * Tốc độ (rpm) mà tại đó cảm biến lệch tâm cắt máy: lực lệch tâm U·r·ω² vượt ngưỡng
 * (ngưỡng = lực của IMBALANCE.tolerance gam ở tốc độ tối đa). Infinity nếu không bao giờ cắt.
 */
export function tripRpm(tubes) {
  const U = imbalanceOf(tubes).grams;
  if (U <= IMBALANCE.tolerance) return Infinity;
  return MACHINE.maxRpm * Math.sqrt(IMBALANCE.tolerance / U);
}

/**
 * Lập chương trình chạy.
 * @param {object} p  { rcf } hoặc { rpm }; { minutes } hoặc { seconds }; { ramp } 0–9; { atSet } true/false;
 *                    { tubes } danh sách lỗ hoặc { slot, mass }.
 * @returns {object}  rpm, rcf, giây chạy, thời gian tăng tốc/phanh, tốc độ cắt lệch tâm, cảnh báo.
 */
export function programOf(p = {}) {
  const warnings = [];
  let rpm;
  if (Number.isFinite(p.rpm)) rpm = snapRpm(p.rpm);
  else {
    const want = Number.isFinite(p.rcf) ? p.rcf : 12000;
    const rcf = snapRcf(want);
    if (want > MACHINE.maxRcf) warnings.push(`Vượt ${MACHINE.maxRcf} × g, máy giới hạn ở mức tối đa.`);
    rpm = Math.min(MACHINE.maxRpm, rpmFromRcf(rcf));
  }
  const rawSeconds = Number.isFinite(p.seconds) ? p.seconds : Number.isFinite(p.minutes) ? p.minutes * 60 : 600;
  const seconds = Math.min(MACHINE.maxSeconds, Math.max(MACHINE.minSeconds, rawSeconds));
  const ramp = rampTimes(Number.isFinite(p.ramp) ? p.ramp : MACHINE.defaultRamp);
  const tubes = loadOf(p.tubes ?? []);
  const unpaired = unpairedSlots(tubes);
  if (!tubes.length) warnings.push("Rotor trống.");
  if (unpaired.length) warnings.push(`Lỗ ${unpaired.map((s) => s + 1).join(", ")} thiếu ống đối diện cân bằng.`);
  if (tubes.some((t) => t.mass > ROTOR.maxLoadPerBore)) warnings.push(`Có ống nặng hơn ${ROTOR.maxLoadPerBore} g mỗi lỗ.`);
  const trip = tripRpm(tubes);
  return {
    rpm,
    rcf: rcfFromRpm(rpm),
    seconds,
    atSet: Boolean(p.atSet),
    accel: (ramp.accel * rpm) / MACHINE.maxRpm, // tăng tốc đều: thời gian tỉ lệ với tốc độ đích
    brakeRate: MACHINE.maxRpm / ramp.brake, // rpm mỗi giây khi phanh
    accelRate: MACHINE.maxRpm / ramp.accel,
    tubes,
    unpaired,
    tripRpm: trip,
    imbalanced: trip < rpm,
    warnings,
  };
}

/**
 * Trạng thái máy ở giây t (thời gian thật của chương trình) kể từ khi bấm start.
 * Pha: "accel" tăng tốc, "run" quay ổn định, "brake" phanh, "imbal" phanh khẩn vì lệch tâm, "stop" đã dừng.
 * Đồng hồ: mặc định đếm từ lúc start (cả lúc tăng tốc); với atSet thì đếm từ lúc đạt 95 % tốc độ đặt.
 */
export function stateAt(t, prog) {
  const { rpm, accelRate, brakeRate, seconds } = prog;
  const tAccel = rpm / accelRate;
  if (prog.imbalanced) {
    const tTrip = prog.tripRpm / accelRate;
    const tStop = tTrip + prog.tripRpm / brakeRate;
    if (t <= 0) return { phase: "stop", rpm: 0, rcf: 0, timer: 0, left: seconds, error: null };
    if (t < tTrip) return { phase: "accel", rpm: accelRate * t, rcf: rcfFromRpm(accelRate * t), timer: t, left: seconds - t, error: null };
    const v = Math.max(0, prog.tripRpm - brakeRate * (t - tTrip));
    return { phase: t < tStop ? "imbal" : "stop", rpm: v, rcf: rcfFromRpm(v), timer: tTrip, left: seconds - tTrip, error: "IMBAL", done: t >= tStop, tStop };
  }
  const tStart = prog.atSet ? (MACHINE.atSetFraction * rpm) / accelRate : 0;
  const tBrake = tStart + seconds;
  const tStop = tBrake + rpmAtBrake(prog, tBrake, tAccel) / brakeRate;
  if (t <= 0) return { phase: "stop", rpm: 0, rcf: 0, timer: 0, left: seconds, error: null };
  if (t < tBrake) {
    const v = Math.min(rpm, accelRate * t);
    const timer = Math.max(0, t - tStart);
    return { phase: v < rpm ? "accel" : "run", rpm: v, rcf: rcfFromRpm(v), timer, left: seconds - timer, error: null };
  }
  const v0 = rpmAtBrake(prog, tBrake, tAccel);
  const v = Math.max(0, v0 - brakeRate * (t - tBrake));
  return { phase: v > 0 ? "brake" : "stop", rpm: v, rcf: rcfFromRpm(v), timer: seconds, left: 0, error: null, done: v <= 0, tStop };
}

// Tốc độ lúc bắt đầu phanh (chương trình rất ngắn có thể phanh khi chưa đạt tốc độ đặt).
function rpmAtBrake(prog, tBrake, tAccel) {
  return tBrake >= tAccel ? prog.rpm : prog.accelRate * tBrake;
}

/** Tổng thời gian thật của chương trình (giây), từ start tới khi rotor dừng hẳn. */
export function totalSeconds(prog) {
  if (prog.imbalanced) return prog.tripRpm / prog.accelRate + prog.tripRpm / prog.brakeRate;
  const tStart = prog.atSet ? (MACHINE.atSetFraction * prog.rpm) / prog.accelRate : 0;
  const tBrake = tStart + prog.seconds;
  return tBrake + rpmAtBrake(prog, tBrake, prog.rpm / prog.accelRate) / prog.brakeRate;
}

/** Hiển thị thời gian như màn hình máy: m:ss dưới 1 giờ, h:mm từ 1 giờ. */
export function fmtClock(seconds) {
  const s = Math.max(0, Math.round(seconds));
  if (s >= 3600) return `${Math.floor(s / 3600)}:${String(Math.floor((s % 3600) / 60)).padStart(2, "0")}h`;
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

/** Số có dấu cách hàng nghìn kiểu Việt Nam (12 000). */
export const fmtInt = (v) => String(Math.round(v)).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
