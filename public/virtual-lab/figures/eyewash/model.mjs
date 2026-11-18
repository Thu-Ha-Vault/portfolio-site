// Mô hình trạm tắm và rửa mắt khẩn cấp kết hợp (combination emergency shower + eyewash), dùng chung cho
// bản dựng (Node), trang hình (trình duyệt) và lõi mô phỏng của app. Module thuần: không DOM, không Three.js.
//
// Máy làm mẫu: Guardian Equipment G1902 "Safety Station with Eyewash, Stainless Steel Bowl". Nguồn:
// - Spec sheet G1902 rev. 052319 (https://ww.gesafety.com/downloads/G1902.pdf), bản vẽ dung sai ± 6 mm:
//   · đầu sen ABS Ø 254 mm (10"), bộ điều lưu 20 GPM (75,7 L/phút); mép dưới đầu sen cao 2105 mm (82 7/8");
//     tâm đầu sen cách trục ống đứng 610 mm (24"); cao tổng 2261 mm (89");
//   · van tắm: van bi 1" IPS đồng mạ crôm, "stay-open" (mở rồi giữ nguyên), bi đồng mạ crôm, gioăng PTFE;
//     cần tác động inox và thanh kéo inox 29" (737 mm) có tay kéo tam giác; đầu thanh kéo thấp hơn ống ngang 597 mm (23 5/8");
//   · chậu rửa mắt inox Ø 283 mm (11 1/8"), miệng chậu cao 953 mm (37 1/2"); hai đầu phun GS-Plus cách nhau 165 mm (6 1/2"),
//     mỗi đầu có nắp chống bụi lật ("flip top"), bộ điều lưu và lưới lọc bên trong;
//   · van rửa mắt: van bi 1/2" IPS đồng mạ crôm, stay-open; tay đẩy dạng cờ (flag handle) nhôm đúc sơn tĩnh điện, cao 127 mm (5");
//   · ống và phụ kiện thép mạ kẽm Schedule 40, bọc ống polyethylene màu cam; đế nhôm đúc Ø 229 mm (9"),
//     khe bắt bu lông Ø 7/16" trên vòng Ø 7 5/8" (194 mm);
//   · cấp nước 1 1/4" NPT cái ở đỉnh hoặc ở hông (hông 1645 mm = 64 3/4", nút bịt); thoát 1 1/4" NPT cái ở 235 mm (9 1/4"),
//     đổi hai đoạn ống dưới thì lên 498 mm (19 5/8"); kèm biển báo theo ANSI; tuỳ chọn van trộn ổn nhiệt G6040.
// - ANSI/ISEA Z358.1-2014 (số liệu đã có trong data/safety.json mục "emergency"; bản vẽ lắp đặt Haws 8300-8309
//   https://res.cloudinary.com/dzhpkjoqj/Haws/8300-8300CRP.pdf chép lại các yêu cầu vị trí):
//   · rửa mắt ≥ 1,5 L/phút (0,4 gpm) trong 15 phút; vòi sen ≥ 75,7 L/phút (20 gpm) trong 15 phút;
//   · nước ấm (tepid) 16–38 °C; tới được trong 10 s (phụ lục: khoảng 17 m = 55 ft ở tốc độ đi bộ thường);
//   · đầu sen cao 2083–2438 mm (82–96"); tia sen phủ đường kính ≥ 508 mm (20") ở độ cao 1524 mm (60");
//     tâm tia cách vật cản ≥ 406 mm (16");
//   · dòng rửa mắt nằm trong 838–1346 mm (33–53") tính từ sàn, cách tường ≥ 153 mm (6");
//   · cần gạt van tắm cao không quá 1733 mm (69") (Z358.1 mục 4.2; theo bản tóm tắt, chưa đối chiếu bản gốc);
//   · van mở trong ≤ 1 s và tự giữ mở (rảnh hai tay); kích hoạt thử hằng tuần, kiểm tra toàn bộ hằng năm.
//
// Giả định (chưa xác minh hoặc minh hoạ):
// - Lưu lượng thật của cặp đầu GS-Plus không ghi trên spec sheet: dùng mức tối thiểu của Z358.1 (1,5 L/phút). Chưa xác minh.
// - Ống chia: tầng giữa hai tê dưới chậu ngăn nước cấp (phía trên) với nước thải từ chậu (phía dưới), ống cấp rửa mắt
//   đi đồng tâm lên qua ống xả của chậu, ruột van bi: vẽ theo cấu tạo điển hình, hãng không công bố sơ đồ bên trong.
//   Van bi stay-open không có lò xo (bi giữ vị trí nhờ ma sát gioăng PTFE), nên hình không vẽ lò xo.
// - Độ loe tia sen 0,5 mm đường kính mỗi mm rơi (từ Ø 254 ở 2105 mm thành Ø 544 mm ở 1524 mm, đạt ≥ 508): MINH HOẠ.
// - Độ đục khi xả kiểm tra hằng tuần: giảm theo hàm mũ của thể tích đã xả so với thể tích nước tù trong trạm và nhánh
//   ống cấp (giả định 5 m ống 1 1/4"): MINH HOẠ, chỉ cho đúng chiều hướng "xả đến khi nước trong".
// - Đỉnh tia rửa mắt 1060 mm (khoảng 107 mm trên miệng chậu): MINH HOẠ, nằm trong vùng 838–1346 mm của Z358.1.

const IN = 25.4; // mm cho 1 inch
const GPM = 3.785411784; // L/phút cho 1 US gpm

/** Kích thước và thông số trạm (Guardian G1902). Chiều dài mm, lưu lượng L/phút. */
export const STATION = {
  model: "Guardian Equipment G1902",
  height: 89 * IN, // 2261, cao tổng
  head: { d: 10 * IN, bottom: 2105, reach: 24 * IN, flow: 20 * GPM }, // đầu sen Ø 254, mép dưới 2105, tâm cách trục ống 610
  arm: 2228, // tâm ống ngang của vòi sen (suy từ bản vẽ: mép dưới đầu sen + chiều cao cổ đầu sen)
  rod: { length: 29 * IN, belowArm: 597, pull: 268 }, // thanh kéo 737 mm; kéo xuống 268 mm khi cần quay 90°
  bowl: { d: 283, rim: 953, heads: 165, axis: 235 }, // chậu Ø 283, miệng 953, hai đầu phun cách 165, tâm chậu cách trục ống 235
  flag: { h: 5 * IN }, // tay đẩy cao 127 mm
  flange: { d: 9 * IN, boltCircle: 7.625 * IN }, // đế Ø 229, vòng bu lông Ø 194
  sideInlet: 1645, // 64 3/4", nút bịt
  waste: { low: 235, high: 498 }, // cửa thoát 9 1/4" hoặc 19 5/8"
  pipe: { main: 42.2, branch: 33.4, eye: 21.3 }, // đường kính ngoài ống thép Sch 40: 1 1/4", 1", 1/2" (ASME B36.10)
  bore: { main: 35.1, branch: 26.6, eye: 15.8 }, // đường kính trong tương ứng
  eyeFlow: 1.5, // L/phút: mức tối thiểu Z358.1 (lưu lượng thật của GS-Plus chưa xác minh)
};

/** Các ngưỡng của ANSI/ISEA Z358.1-2014. */
export const Z358 = {
  eyeFlow: 1.5, // L/phút tối thiểu
  showerFlow: 75.7, // L/phút tối thiểu
  minutes: 15,
  tepid: [16, 38], // °C
  reachSeconds: 10,
  reachMeters: 17, // phụ lục: khoảng 55 ft
  showerHead: [2083, 2438], // mm
  spray: { d: 508, at: 1524, clear: 406 }, // mm
  eyePattern: [838, 1346], // mm
  actuatorMax: 1733, // mm, cần gạt van tắm (chưa đối chiếu bản gốc)
  wall: 153, // mm
};

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

/**
 * Lưu lượng theo chế độ (L/phút).
 * @param {"off"|"eyewash"|"shower"|"both"} mode
 * @returns {{ eyewash: number, shower: number, total: number }}
 */
export function flowOf(mode, s = STATION) {
  const eyewash = mode === "eyewash" || mode === "both" ? s.eyeFlow : 0;
  const shower = mode === "shower" || mode === "both" ? s.head.flow : 0;
  return { eyewash, shower, total: eyewash + shower };
}

/**
 * Lượng nước đã dùng (L) sau một số phút chạy liên tục.
 * @param {"off"|"eyewash"|"shower"|"both"} mode
 * @param {number} minutes
 */
export function waterUsed(mode, minutes, s = STATION) {
  return flowOf(mode, s).total * Math.max(0, minutes);
}

/**
 * Nhiệt độ nước so với khoảng nước ấm 16–38 °C của Z358.1.
 * @param {number} waterC °C
 * @returns {{ state: "cold"|"ok"|"hot", message: string }}
 */
export function tempStatus(waterC) {
  if (waterC < Z358.tepid[0]) return { state: "cold", message: "Lạnh dưới 16 °C: người bị nạn run, bỏ dở trước 15 phút, nguy cơ hạ thân nhiệt" };
  if (waterC > Z358.tepid[1]) return { state: "hot", message: "Nóng trên 38 °C: bỏng da, giãn mạch làm hoá chất thấm nhanh hơn" };
  return { state: "ok", message: "Nước ấm trong khoảng 16–38 °C" };
}

/**
 * Khoảng cách đi được trong t giây ở tốc độ đi bộ thường (Z358.1 phụ lục: 10 s ≈ 17 m, tức khoảng 1,7 m/s).
 * @param {number} [seconds]
 * @returns {number} m
 */
export function reachDistance(seconds = Z358.reachSeconds) {
  return (Z358.reachMeters / Z358.reachSeconds) * seconds;
}

/**
 * Đường kính tia sen (mm) ở độ cao z (MINH HOẠ: loe 0,5 mm mỗi mm rơi từ mặt đầu sen).
 * @param {number} z mm
 */
export function sprayDiameter(z, s = STATION) {
  return s.head.d + 0.5 * Math.max(0, s.head.bottom - z);
}

/** Thể tích nước tù (L) trong trạm và nhánh ống cấp: ống đứng từ tê rửa mắt tới đỉnh, ống ngang 1", 5 m ống cấp (giả định). */
export function deadVolume(s = STATION) {
  const area = (d) => (Math.PI * (d / 2) ** 2) / 1e6; // m²
  const column = area(s.bore.main) * ((s.arm - 790) / 1000);
  const arm = area(s.bore.branch) * (s.head.reach / 1000);
  const branch = area(s.bore.main) * 5;
  return (column + arm + branch) * 1000;
}

/**
 * Độ đục còn lại (0–1) sau khi xả V lít (MINH HOẠ): exp(−V / V_tù). "Trong" khi dưới 0,05.
 * @param {number} litres
 */
export function turbidity(litres, s = STATION) {
  return Math.exp(-Math.max(0, litres) / deadVolume(s));
}

/**
 * Kiểm tra các độ cao của trạm theo Z358.1.
 * @returns {{ name: string, value: number, range: number[], ok: boolean }[]}
 */
export function heightChecks(s = STATION) {
  const actuator = s.arm - s.rod.belowArm;
  const eyePeak = 1060;
  return [
    { name: "đầu sen", value: s.head.bottom, range: Z358.showerHead, ok: s.head.bottom >= Z358.showerHead[0] && s.head.bottom <= Z358.showerHead[1] },
    { name: "tia sen ở 1524 mm", value: sprayDiameter(Z358.spray.at, s), range: [Z358.spray.d, Infinity], ok: sprayDiameter(Z358.spray.at, s) >= Z358.spray.d },
    { name: "dòng rửa mắt", value: eyePeak, range: Z358.eyePattern, ok: eyePeak >= Z358.eyePattern[0] && eyePeak <= Z358.eyePattern[1] },
    { name: "tay kéo", value: actuator, range: [0, Z358.actuatorMax], ok: actuator <= Z358.actuatorMax },
  ];
}

/**
 * Toàn bộ trạng thái trạm cho một lựa chọn của người dùng.
 * @param {{ mode?: "off"|"eyewash"|"shower"|"both", minutes?: number, waterC?: number, flushedL?: number }} [input]
 *   minutes: số phút đã chạy (0–15 hoặc hơn); waterC: nhiệt độ nước; flushedL: số lít đã xả từ lúc nước đứng yên (để tính độ đục).
 * @returns {{ mode: string, minutes: number, remaining: number, waterC: number, flow: object, used: number,
 *   temp: object, turbidity: number, clear: boolean, done: boolean, ok: boolean, message: string }}
 *   done: đã đủ 15 phút; ok: đang chạy, nước ấm và nước trong.
 */
export function stationState({ mode = "eyewash", minutes = 0, waterC = 25, flushedL = Infinity } = {}, s = STATION) {
  mode = ["off", "eyewash", "shower", "both"].includes(mode) ? mode : "eyewash";
  minutes = clamp(Number(minutes) || 0, 0, 120);
  waterC = clamp(Number(waterC) || 0, 1, 60);
  const flow = flowOf(mode, s);
  const used = flow.total * minutes;
  const temp = tempStatus(waterC);
  const turb = Number.isFinite(flushedL) ? turbidity(flushedL, s) : 0;
  const clear = turb < 0.05;
  const done = mode !== "off" && minutes >= Z358.minutes;
  let message;
  if (mode === "off") message = "Van đóng";
  else if (!clear) message = "Nước đục: xả tiếp đến khi trong";
  else if (temp.state !== "ok") message = temp.message;
  else if (done) message = "Đủ 15 phút rửa";
  else message = "Đang rửa, cần đủ 15 phút";
  return {
    mode, minutes, remaining: Math.max(0, Z358.minutes - minutes), waterC, flow, used, temp,
    turbidity: turb, clear, done, ok: mode !== "off" && clear && temp.state === "ok", message,
  };
}

/**
 * Định dạng số kiểu Việt Nam (dấu phẩy thập phân).
 * @param {number} v
 * @param {number} [digits]
 */
export const vn = (v, digits = 1) => v.toFixed(digits).replace(".", ",");
