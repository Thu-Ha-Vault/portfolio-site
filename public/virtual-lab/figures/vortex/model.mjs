// Mô hình máy vortex và máy ly tâm mini, dùng chung cho bản dựng (Node), trang hình (trình duyệt) và lõi mô phỏng của app.
// Module thuần: không DOM, không Three.js.
//
// Máy vortex làm mẫu: Scientific Industries Vortex-Genie 2 (SI-0236, 120 V; SI-0256 bản 230 V EU).
// Nguồn:
// - Scientific Industries, Genie Product Catalog (trang 1–2), bảng SPECIFICATIONS của Vortex-Genie 2:
//   https://www.labrepco.com/wp-content/uploads/2018/11/Scientific-Industries-Genie-Product-Catalog.pdf
//   · tốc độ 600–3200 rpm (2700 rpm với bản 50 Hz); kèm cup bật ra (pop-off cup) và đĩa 3 inch;
//   · kích thước 165 × 122 × 165 mm (sâu × rộng × cao), nặng 4 kg; điều khiển "Hands-Free or Touch-On";
//   · cùng catalog, máy Vortex-Genie 2 Platform ghi "Orbit 4mm dia. (Same as Vortex-Genie 2)":
//     quỹ đạo đường kính 4 mm, tức bán kính lệch tâm 2 mm.
// - Listing của các nhà phân phối (Fisher Scientific, Marshall Scientific) ghi công tắc 3 vị trí
//   (bật liên tục / tắt / chạm) và quỹ đạo 4,0 mm. Một tờ quảng cáo cũ của hãng ghi "large 6 mm orbit";
//   con số 4,9 mm không tìm thấy nguồn: dùng 4 mm (chưa xác minh bằng manual của hãng).
// - Thang núm vặn và quan hệ vạch–rpm: hãng không công bố; giả định tuyến tính 0–10 ứng với 600–3200 rpm.
//
// Máy ly tâm mini làm mẫu: Labnet Spectrafuge Mini (C1301, nắp trong có màu).
// Nguồn:
// - Labnet/Remma, trang sản phẩm Spectrafuge Mini C1301: https://remma.fr/en/model/spectrafuge-c1301-centrifuge
//   · tốc độ cố định 6000 rpm, 2000 × g (1177 × g với rotor ống PCR dải); rotor 6 × 1,5/2,0 mL hoặc 2 dải 8 × 0,2 mL;
//   · 15 × 15 × 11,7 cm (rộng × sâu × cao), nặng 0,45 kg;
//   · bật/tắt bằng công tắc bên hông hoặc chỉ cần đóng/mở nắp; bản lề thép không gỉ.
// - SelectScience, Spectrafuge Mini: "can be started and stopped by closing and opening the lid when the switch is on".
//   https://www.selectscience.net/product/spectrafuge-mini-centrifuge
// - Công thức RCF (DIN 58 970): RCF = 1,118 × 10⁻⁵ × r (cm) × n² (rpm).
//   Bán kính lớn nhất suy ra từ hai số của hãng: r = 2000 / (1,118 × 10⁻⁵ × 6000²) ≈ 4,97 cm;
//   rotor ống dải: r = 1177 / (1,118 × 10⁻⁵ × 6000²) ≈ 2,92 cm.
// - Thời gian tăng tốc và dừng (phanh hay quay trơn): hãng không công bố. Giả định (chưa xác minh) tăng tốc
//   hằng số thời gian 1,0 s (đạt 95 % sau khoảng 3 s), dừng hằng số 1,2 s (gần dừng sau khoảng 4–5 s).
//
// Phần minh hoạ (không có nguồn đo, chỉ để hình chạy hợp lý):
// - Phễu xoáy: chất lỏng quay với tốc độ góc bằng η = 0,25 lần tần số quỹ đạo; độ sâu phễu của paraboloid
//   Δ = Ω²R²/(2g). Phễu chỉ hình thành khi gia tốc quỹ đạo ω²e vượt khoảng 1 g (Fr > 1), đầy đủ khi Fr ≥ 3.
// - Thời gian trộn: t = 2 s × (3200/rpm)² × (V/100 µL)^(1/3) khi Fr > 1.
// - Gom giọt khi ly tâm: giọt trên thành ống trượt xuống đáy khi lực ly tâm vượt 50 × g; gom xong khi tích
//   (RCF − 50) × thời gian đạt 6000 g·s (khoảng 3 s ở 2000 × g). Thực hành thường ly tâm nhanh 5–10 s.

export const G0 = 9.80665; // m/s²

/** Thông số máy vortex (Vortex-Genie 2). Kích thước tính bằng mm. */
export const VORTEX = {
  model: "Scientific Industries Vortex-Genie 2",
  size: { depth: 165, width: 122, height: 165 },
  mass: 4, // kg
  rpmMin: 600,
  rpmMax: 3200,
  rpmMax50Hz: 2700,
  orbitDia: 4, // mm, đường kính quỹ đạo
  dial: [0, 10], // thang núm (giả định)
  modes: ["on", "off", "touch"], // công tắc 3 vị trí
  swirl: 0.25, // η, minh hoạ
};

/** Ống ly tâm 1,5 mL điển hình (polypropylene). mm. */
export const TUBE = {
  od: 10.8,
  id: 8.8,
  length: 38.5, // thân, không kể nắp
  cone: 17, // chiều dài phần côn ở đáy
  tipId: 2.2,
  volume: 500, // µL mẫu trong ống trên máy vortex
  spinVolume: 250, // µL mẫu trong mỗi ống của máy ly tâm
  // Profile [s, r] tính từ miệng ống dọc trục về đáy (mm), kích thước ống 1,5 mL điển hình (chưa xác minh theo hãng ống).
  outer: [[0, 5.4], [21.5, 5.15], [37.6, 1.5], [38.5, 0]],
  inner: [[0.6, 4.45], [21.5, 4.2], [37.0, 0.9], [37.6, 0]],
};

/** Thông số máy ly tâm mini (Spectrafuge Mini). */
export const SPIN = {
  model: "Labnet Spectrafuge Mini C1301",
  size: { width: 150, depth: 150, height: 117 },
  mass: 0.45, // kg
  rpm: 6000,
  rcf: 2000,
  rcfStrip: 1177,
  places: 6,
  rMax: 2000 / (1.118e-5 * 6000 * 6000), // cm ≈ 4,97
  rStrip: 1177 / (1.118e-5 * 6000 * 6000), // cm ≈ 2,92
  tubeAngle: 45, // độ, rotor góc cố định (điển hình, chưa xác minh)
  tauUp: 1.0, // s, giả định
  tauDown: 1.2, // s, giả định
  slideRcf: 50, // × g, minh hoạ
  collectGs: 6000, // g·s, minh hoạ
};

const vxClamp = (v, a, b) => Math.min(b, Math.max(a, v));
const vxStep = (a, b, x) => {
  const t = vxClamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};

/** Giới hạn rpm của máy vortex trong dải 600–3200 (bản 60 Hz). */
export const clampVortexRpm = (rpm, v = VORTEX) => vxClamp(Math.round(rpm), v.rpmMin, v.rpmMax);

/** Vạch núm (0–10) → rpm, giả định tuyến tính. */
export const dialToRpm = (d, v = VORTEX) => v.rpmMin + (vxClamp(d, v.dial[0], v.dial[1]) / v.dial[1]) * (v.rpmMax - v.rpmMin);

/** rpm → vạch núm (0–10). */
export const rpmToDial = (rpm, v = VORTEX) => ((clampVortexRpm(rpm, v) - v.rpmMin) / (v.rpmMax - v.rpmMin)) * v.dial[1];

/**
 * Chuyển động quỹ đạo của đầu cup ở một tốc độ.
 * @param {number} rpm vòng/phút của mô tơ (bằng số vòng quỹ đạo mỗi phút)
 * @returns {{ hz: number, radius: number, speed: number, accelG: number, froude: number }}
 *   hz: tần số quỹ đạo; radius: bán kính lệch tâm (mm); speed: tốc độ dài của tâm cup (m/s);
 *   accelG: gia tốc hướng tâm (bội số g); froude: Fr = ω²e/g.
 */
export function orbitOf(rpm, v = VORTEX) {
  const hz = rpm / 60;
  const w = 2 * Math.PI * hz;
  const e = v.orbitDia / 2 / 1000; // m
  const accel = w * w * e;
  return { hz, radius: v.orbitDia / 2, speed: w * e, accelG: accel / G0, froude: accel / G0 };
}

/**
 * Độ sâu phễu xoáy (mm) trong ống có bán kính trong R, ở tốc độ rpm (minh hoạ).
 * Δ = (η·ω·R)²/(2g), nhân với mức hình thành phễu theo Fr (1 → 3). Không vượt 0,8 chiều cao cột chất lỏng.
 */
export function funnelDepth(rpm, fillMm = 20, R = TUBE.id / 2, v = VORTEX) {
  const o = orbitOf(rpm, v);
  const w = 2 * Math.PI * o.hz * v.swirl;
  const d = ((w * R) / 1000) ** 2 / (2 * G0) * 1000;
  return Math.min(0.8 * fillMm, d * vxStep(1, 3, o.froude));
}

/** Thời gian trộn ước lượng (s) cho V µL ở tốc độ rpm (minh hoạ). Infinity khi chưa có xoáy. */
export function mixSeconds(rpm, volumeUl = TUBE.volume, v = VORTEX) {
  if (orbitOf(rpm, v).froude <= 1) return Infinity;
  return 2 * (v.rpmMax / rpm) ** 2 * Math.cbrt(volumeUl / 100);
}

/** RCF (× g) ở bán kính r (cm) và tốc độ n (rpm): 1,118 × 10⁻⁵ × r × n². */
export const rcfOf = (rpm, rCm = SPIN.rMax) => 1.118e-5 * rCm * rpm * rpm;

/** Tốc độ (rpm) cần để đạt RCF ở bán kính r (cm). */
export const rpmOfRcf = (rcf, rCm = SPIN.rMax) => Math.sqrt(rcf / (1.118e-5 * rCm));

/**
 * Một bước tốc độ rotor ly tâm mini: nắp đóng thì tăng về 6000 rpm, nắp mở thì giảm về 0 (giả định bậc nhất).
 * @param {number} rpm tốc độ hiện tại
 * @param {boolean} running nắp đóng và công tắc bật
 * @param {number} dt giây
 */
export function spinStep(rpm, running, dt, s = SPIN) {
  const target = running ? s.rpm : 0;
  const tau = running ? s.tauUp : s.tauDown;
  const next = target + (rpm - target) * Math.exp(-dt / tau);
  return !running && next < 20 ? 0 : next;
}

/** Thời gian (s) từ lúc đóng nắp tới khi đạt tỉ lệ f của tốc độ tối đa (giả định bậc nhất). */
export const spinUpSeconds = (f = 0.95, s = SPIN) => -s.tauUp * Math.log(1 - f);

/** Thời gian (s) từ lúc mở nắp tới khi rotor gần dừng (dưới 20 rpm). */
export const spinDownSeconds = (s = SPIN) => s.tauDown * Math.log(s.rpm / 20);

/**
 * Tiến độ gom giọt trên thành ống về đáy (0–1) sau một bước dt ở RCF hiện tại (minh hoạ).
 * @param {number} progress tiến độ hiện tại
 * @param {number} rcf lực ly tâm tại đáy ống (× g)
 */
export function collectStep(progress, rcf, dt, s = SPIN) {
  return Math.min(1, progress + (Math.max(0, rcf - s.slideRcf) * dt) / s.collectGs);
}

/** Thời gian ly tâm (s, tính từ lúc đóng nắp) để gom hết giọt, theo mô phỏng từng bước. */
export function collectSeconds(s = SPIN, dt = 0.01) {
  let rpm = 0;
  let p = 0;
  let t = 0;
  while (p < 1 && t < 120) {
    rpm = spinStep(rpm, true, dt, s);
    p = collectStep(p, rcfOf(rpm, s.rMax), dt, s);
    t += dt;
  }
  return t;
}

/** Tiến độ gom giọt sau khi đóng nắp ly tâm `seconds` giây rồi mở nắp (tính cả lúc rotor đang dừng lại). */
export function collectAfter(seconds, s = SPIN, dt = 0.01) {
  let rpm = 0;
  let p = 0;
  for (let t = 0; t < seconds; t += dt) {
    rpm = spinStep(rpm, true, dt, s);
    p = collectStep(p, rcfOf(rpm, s.rMax), dt, s);
  }
  for (let t = 0; rpm > 0 && t < 30; t += dt) {
    rpm = spinStep(rpm, false, dt, s);
    p = collectStep(p, rcfOf(rpm, s.rMax), dt, s);
  }
  return p;
}

export const fmtInt = (v) => String(Math.round(v)).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
export const fmtDec = (v, d = 1) => v.toFixed(d).replace(".", ",");
