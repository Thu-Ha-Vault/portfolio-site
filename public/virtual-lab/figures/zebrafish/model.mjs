// Mô hình giá nuôi cá ngựa vằn tuần hoàn (lưu lượng qua bể, thay nước, chu kỳ sáng tối, cá đẻ, báo động),
// dùng chung cho bản dựng (Node), trang hình (trình duyệt) và lõi mô phỏng của app.
// Module thuần: không DOM, không Three.js. Đơn vị: thể tích L, lưu lượng L/giờ, thời gian phút, nhiệt độ °C.
//
// Máy làm mẫu: Tecniplast ZebTEC Active Blue Stand Alone, cấu hình 4 hàng bể (giá đứng một mình,
// có bồn kỹ thuật riêng ở chân giá).
// Nguồn:
// - Tờ thông số ZebTEC Stand-Alone "Active Blue" Technology (Tecniplast, CAT141/ING rev. 07-2013 và CAT141/USA
//   rev. 02-2014; bản do đại lý Somatco đăng: https://www.somatco.com/zebtec_active_blue.pdf,
//   https://www.somatco.com/zebrafish-housing.pdf):
//   · kích thước giá 4 hàng 1620 × 565 × 1800 mm; 4+1 hàng × 2000; 5 hàng × 2060; 5+1 hàng × 2250; 6 hàng × 2350 mm;
//   · bể 1,1 L, 3,5 L và 8,0 L dùng chung một giá, không phải thay ống chia; 3,5 L và 8,0 L thay thế lẫn nhau
//     (hai bể 3,5 L chiếm chỗ một bể 8,0 L); có vách ngăn cho bể 3,5 L;
//   · lọc cơ học: lọc trống tự làm sạch (drum filter) lưới 40 µm hoặc 26 µm, tự rửa ngược khi lưới bẩn,
//     nước rửa ngược tính vào lượng nước thay; không cần tấm lọc thô và lõi lọc tinh;
//   · khử trùng UV: liều diệt tới 180 000 µW·s/cm² (ở cuối tuổi thọ bóng);
//   · lọc sinh học Biochip (giá thể đĩa nhựa chuyển động liên tục); túi than hoạt tính là tuỳ chọn;
//   · van "push and pull" ở mỗi bể chỉnh tinh lưu lượng, có chỉ thị nhìn thấy dòng chảy; bộ ổn áp giữ lưu lượng
//     từ 5 lần thể tích bể mỗi giờ ("5 WCH") tới nhỏ giọt;
//   · màn hình cảm ứng, cổng USB tải dữ liệu, báo động qua mạng.
// - Tờ giới thiệu TP AQUATICS (Tecniplast, https://www.tecniplast.it/usermedia/uk/TP_AQUATICS.pdf):
//   bể 1,1 / 2,4 / 3,5 / 8,0 L, đáy rãnh chữ V dốc từ trước ra sau; bồn kỹ thuật có bơm tuần hoàn,
//   thanh gia nhiệt và cảm biến mức nước; đo và tự bù nhiệt độ, pH, độ dẫn điện.
// - SOP 808 "Tecniplast ZebTec Centralized Aquatics System" (ĐH South Florida, 2021,
//   https://usf.edu/research-innovation/research-support/comparative-medicine/documents/sops/s808-tecniplast-zebtec-aquatics-system.pdf):
//   đầu đo pH và độ dẫn điện hiệu chuẩn 3 tháng một lần; thay bóng UV mỗi năm hoặc 9000 giờ; lọc sinh học thổi khí;
//   phao mức nước; định lượng bicarbonate và muối; không rút quá 20 % số bể cùng lúc.
// - Aleström và cộng sự (2020) Zebrafish: Housing and husbandry recommendations. Lab. Anim. 54: 213–224
//   (https://pmc.ncbi.nlm.nih.gov/articles/PMC7301644/): nhiệt độ 24–29 °C; pH 6,5–8; độ dẫn điện 150–1700 µS/cm;
//   14 giờ sáng / 10 giờ tối; 54–334 lux ở mặt trước bể; 4–10 cá trưởng thành/L; thay 5–10 % nước hệ thống mỗi ngày.
// - Tecniplast FAQ (https://www.tecniplast.it/en/faqs.html): nên giữ phòng thấp hơn nước nuôi 2–3 °C khi giá không có
//   bộ làm lạnh.
// - Cá đẻ lúc rạng sáng: cho đực và cái vào hai ngăn của bể giao phối vào cuối chu kỳ sáng hôm trước, rút vách ngăn
//   khi đèn bật sáng hôm sau; cá không đẻ khi vách ngăn còn (LabTips "Zebrafish Breeding and Embryo Handling",
//   https://www.labcompare.com/10-Featured-Articles/580908-LABTips-Zebrafish-Breeding-and-Embryo-Handling/;
//   Bateson Centre, ĐH Sheffield, https://www.sheffield.ac.uk/bateson/zebrafish/information).
//   Cá bắt đầu đẻ khoảng 15–30 phút sau khi đèn bật (bằng sáng chế US 7 713 925, chưa đối chiếu sách chuẩn).
// Giả định (chưa xác minh hoặc minh hoạ):
// - Kích thước từng bể (rộng × sâu × cao) ước theo số bể mỗi hàng của giá rộng 1620 mm; hãng không công bố trong
//   các tài liệu trên.
// - Lưu lượng mặc định 3 lần thể tích bể mỗi giờ (nằm giữa "nhỏ giọt" và 5 WCH của hãng): MINH HOẠ.
// - Nước trong bể coi như trộn đều: phần nước cũ còn lại = exp(−Q·t/V).
// - Số trứng một lần đẻ 150 (khoảng thường gặp vài chục tới vài trăm): MINH HOẠ. Đẻ kéo dài khoảng 1 giờ;
//   rút vách quá 2 giờ sau khi đèn bật thì cá đẻ ít dần: MINH HOẠ.
// - Bơm tắt: nước trong bể nguội dần về nhiệt độ phòng 26 °C, hằng số thời gian 3 giờ cho bể 3,5 L: MINH HOẠ.
// - Điểm đặt pH 7,5 và độ dẫn điện 500 µS/cm: chọn trong khoảng khuyến cáo của Aleström 2020, không phải số của hãng.

/** Thông số giá (Tecniplast ZebTEC Active Blue Stand Alone, 4 hàng bể). Chiều dài mm. */
export const RACK = {
  model: "Tecniplast ZebTEC Active Blue Stand Alone (4 hàng)",
  size: { width: 1620, depth: 565, height: 1800 },
  sizes: { "4": 1800, "4+1": 2000, "5": 2060, "5+1": 2250, "6": 2350 }, // chiều cao theo số hàng (mm)
  rows: 4,
  drumMesh: [40, 26], // µm, lưới lọc trống
  uvDose: 180000, // µW·s/cm², cuối tuổi thọ bóng
  uvLampHours: 9000, // giờ, thay bóng (SOP USF)
  maxWch: 5, // lần thể tích bể mỗi giờ, giới hạn trên của bộ ổn áp
  defaultWch: 3, // MINH HOẠ
  roomTemp: 26, // °C, phòng thấp hơn nước 2–3 °C (FAQ Tecniplast)
  coolTau: 180, // phút, bể 3,5 L nguội về nhiệt độ phòng khi mất dòng (MINH HOẠ)
};

/**
 * Các cỡ bể. Thể tích của hãng; kích thước rộng (x) × sâu (y) × cao (z) mm là ước lượng, chưa xác minh.
 * perRow: số bể một hàng trên giá rộng 1620 mm (ước theo 50 bể 3,5 L / 25 bể 8 L trên giá 5 hàng).
 */
export const TANKS = {
  "1.1": { volume: 1.1, w: 95, d: 270, h: 130, perRow: 14 },
  "3.5": { volume: 3.5, w: 135, d: 400, h: 160, perRow: 10 },
  "8": { volume: 8.0, w: 280, d: 400, h: 160, perRow: 5 },
};

/** Điều kiện nuôi khuyến cáo (Aleström và cộng sự 2020) và điểm đặt của bộ điều khiển. */
export const HUSBANDRY = {
  tempSet: 28.5,
  tempRange: [24, 29],
  pHSet: 7.5, // điểm đặt minh hoạ
  pHRange: [6.5, 8],
  ecSet: 500, // µS/cm, điểm đặt minh hoạ
  ecRange: [150, 1700],
  lightsOn: 8, // giờ trong ngày (08:00), MINH HOẠ: chỉ cần đúng tỉ lệ 14/10
  lightHours: 14,
  lux: [54, 334],
  density: [4, 10], // cá trưởng thành / L
  exchangePerDay: [0.05, 0.1],
};

/** Đẻ trứng (minh hoạ, xem đầu file). Thời gian phút. */
export const SPAWN = {
  delay: 15, // phút sau khi đèn bật (hoặc sau khi rút vách nếu đèn đã sáng)
  tau: 25, // phút, nhịp đẻ giảm dần
  clutch: 150, // trứng (MINH HOẠ)
  freshHours: 2, // rút vách trong 2 giờ đầu của chu kỳ sáng thì cá đẻ đủ
  fadeHours: 1.5,
};

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const DAY = 24 * 60;

/**
 * Lưu lượng nước vào một bể.
 * @param {number} volume thể tích bể (L)
 * @param {number} [wch] số lần thể tích bể mỗi giờ (0–5, mặc định 3, minh hoạ)
 * @returns {number} L/giờ
 */
export function tankFlow(volume, wch = RACK.defaultWch) {
  return volume * clamp(wch, 0, RACK.maxWch);
}

/**
 * Thời gian để dòng nước vào bằng đúng một thể tích bể (V/Q).
 * @param {number} volume L
 * @param {number} flow L/giờ
 * @returns {number} phút (Infinity khi không có dòng)
 */
export function turnoverMinutes(volume, flow) {
  return flow > 0 ? (60 * volume) / flow : Infinity;
}

/**
 * Phần nước cũ còn lại trong bể trộn đều sau t phút: exp(−Q·t/V).
 * @param {number} minutes
 * @param {number} volume L
 * @param {number} flow L/giờ
 * @returns {number} 0–1
 */
export function remaining(minutes, volume, flow) {
  return Math.exp(-(flow / 60) * Math.max(0, minutes) / volume);
}

/**
 * Thời gian để thay được một tỉ lệ nước cũ (ví dụ 0,99): t = −ln(1 − f)·V/Q.
 * @param {number} fraction 0–1
 * @param {number} volume L
 * @param {number} flow L/giờ
 * @returns {number} phút
 */
export function exchangeMinutes(fraction, volume, flow) {
  return flow > 0 ? (-Math.log(1 - clamp(fraction, 0, 0.9999)) * 60 * volume) / flow : Infinity;
}

/**
 * Đèn sáng hay tối ở một giờ trong ngày (chu kỳ 14 giờ sáng, 10 giờ tối).
 * @param {number} hour giờ trong ngày (có thể lẻ, 0–24)
 * @returns {boolean}
 */
export function lightOn(hour, h = HUSBANDRY) {
  const t = (((hour - h.lightsOn) % 24) + 24) % 24;
  return t < h.lightHours;
}

/**
 * Số phút kể từ lần đèn bật gần nhất, tính tới thời điểm t (phút tuyệt đối kể từ 00:00 ngày 0).
 * @param {number} t phút tuyệt đối
 * @returns {number} phút (≥ 0)
 */
export function sinceLightsOn(t, h = HUSBANDRY) {
  const on = h.lightsOn * 60;
  return (((t - on) % DAY) + DAY) % DAY;
}

/**
 * Thời điểm (phút tuyệt đối) cá có thể bắt đầu đẻ khi vách ngăn được rút lúc tOut:
 * ngay lúc rút nếu đèn đang sáng, nếu không thì lúc đèn bật lần kế tiếp.
 * @param {number} tOut phút tuyệt đối lúc rút vách
 * @returns {number}
 */
export function spawnStart(tOut, h = HUSBANDRY) {
  if (lightOn((tOut / 60) % 24, h)) return tOut;
  const on = h.lightsOn * 60;
  const since = (((tOut - on) % DAY) + DAY) % DAY;
  return tOut + (DAY - since);
}

/**
 * Số trứng cá đã đẻ trong bể giao phối (kỳ vọng, minh hoạ).
 * Vách ngăn còn: 0. Vách rút: cá bắt đầu đẻ SPAWN.delay phút sau khi có ánh sáng, nhịp đẻ giảm theo hàm mũ;
 * nếu lúc bắt đầu đã quá SPAWN.freshHours giờ sau khi đèn bật thì số trứng giảm dần (minh hoạ).
 * Cá chỉ đẻ một lần sau mỗi lần rút vách.
 * @param {{ t: number, divider: "in"|"out", dividerOutAt?: number }} s t, dividerOutAt: phút tuyệt đối
 * @returns {{ eggs: number, phase: "divided"|"waiting"|"courting"|"spawning"|"done", startAt: number|null, motivation: number }}
 */
export function spawning({ t, divider, dividerOutAt = t }, sp = SPAWN, h = HUSBANDRY) {
  if (divider !== "out") return { eggs: 0, phase: "divided", startAt: null, motivation: 0 };
  const start = spawnStart(dividerOutAt, h);
  const lateH = sinceLightsOn(start, h) / 60;
  const motivation = lateH <= sp.freshHours ? 1 : Math.exp(-(lateH - sp.freshHours) / sp.fadeHours);
  if (t < start) return { eggs: 0, phase: "waiting", startAt: start, motivation };
  const dt = t - start - sp.delay;
  if (dt < 0) return { eggs: 0, phase: "courting", startAt: start, motivation };
  const eggs = sp.clutch * motivation * (1 - Math.exp(-dt / sp.tau));
  const phase = dt < 3 * sp.tau && motivation > 0.05 ? "spawning" : "done";
  return { eggs, phase, startAt: start, motivation };
}

/**
 * Nhiệt độ nước trong bể sau khi mất dòng (bơm tắt) m phút: nguội về nhiệt độ phòng (minh hoạ).
 * Bể nhỏ nguội nhanh hơn: τ tỉ lệ với căn bậc ba của thể tích (tỉ lệ thể tích / diện tích mặt ngoài).
 * @param {number} minutes số phút đã mất dòng
 * @param {number} [volume] L
 * @returns {number} °C
 */
export function tankTemp(minutes, volume = 3.5, r = RACK, h = HUSBANDRY) {
  if (!(minutes > 0)) return h.tempSet;
  const tau = r.coolTau * Math.cbrt(volume / 3.5);
  return r.roomTemp + (h.tempSet - r.roomTemp) * Math.exp(-minutes / tau);
}

/**
 * Danh sách bể của giá vẽ trong hình (từ hàng dưới lên): 14 × 1,1 L; 10 × 3,5 L (có một bể giao phối);
 * 10 × 3,5 L; 5 × 8 L.
 * @returns {{ row: number, type: string, index: number, breeding: boolean }[]}
 */
export function rackLayout() {
  const rows = ["1.1", "3.5", "3.5", "8"];
  const list = [];
  rows.forEach((type, row) => {
    for (let index = 0; index < TANKS[type].perRow; index++) list.push({ row, type, index, breeding: row === 1 && index === 7 });
  });
  return list;
}

/**
 * Thứ tự cho cá vào bể khi người dùng chọn số bể có cá: hàng 3,5 L trên, hàng 3,5 L dưới (trừ bể giao phối),
 * hàng 8 L, rồi hàng 1,1 L.
 * @returns {number[]} chỉ số trong rackLayout()
 */
export function stockingOrder() {
  const list = rackLayout();
  const pick = (row) => list.map((t, i) => [t, i]).filter(([t]) => t.row === row && !t.breeding).map(([, i]) => i);
  return [...pick(2), ...pick(1), ...pick(3), ...pick(0)];
}

/**
 * Toàn bộ trạng thái của giá cho một lựa chọn của người dùng.
 * @param {{ t?: number, pump?: boolean, pumpOffAt?: number|null, divider?: "in"|"out", dividerOutAt?: number,
 *   tanks?: number, wch?: number }} [input]
 *   t: phút tuyệt đối (giờ trong ngày = t/60 mod 24); pumpOffAt: lúc tắt bơm; tanks: số bể có cá (không kể bể giao phối)
 * @returns {{ hour: number, light: boolean, pump: boolean, flow: number, perTank: object[], temp: number,
 *   pH: number, ec: number, alarms: string[], spawn: object, stocked: number, message: string }}
 *   flow: tổng lưu lượng qua các bể (L/giờ); perTank: lưu lượng và thời gian thay một thể tích của từng cỡ bể;
 *   alarms: "flow" (không có dòng), "temp" (ngoài 24–29 °C)
 */
export function rackState({ t = 9 * 60, pump = true, pumpOffAt = null, divider = "in", dividerOutAt = t, tanks = 6, wch = RACK.defaultWch } = {}) {
  const hour = ((t / 60) % 24 + 24) % 24;
  const light = lightOn(hour);
  const layout = rackLayout();
  const w = pump ? clamp(wch, 0, RACK.maxWch) : 0;
  const perTank = ["1.1", "3.5", "8"].map((type) => {
    const k = TANKS[type];
    const flow = tankFlow(k.volume, w);
    return { type, volume: k.volume, flow, turnover: turnoverMinutes(k.volume, flow), exchange99: exchangeMinutes(0.99, k.volume, flow) };
  });
  const flow = layout.reduce((sum, tk) => sum + tankFlow(TANKS[tk.type].volume, w), 0);
  const off = pump ? 0 : Math.max(0, t - (pumpOffAt ?? t));
  const temp = tankTemp(off, 3.5);
  const alarms = [];
  if (flow <= 0) alarms.push("flow");
  if (temp < HUSBANDRY.tempRange[0] || temp > HUSBANDRY.tempRange[1]) alarms.push("temp");
  const spawn = spawning({ t, divider, dividerOutAt });
  const stocked = clamp(Math.round(Number(tanks) || 0), 0, stockingOrder().length);
  let message;
  if (!pump) message = "Bơm tắt: lưu lượng 0, báo động";
  else if (spawn.phase === "spawning") message = "Cá đang đẻ";
  else if (spawn.phase === "courting") message = "Cá đực rượt cá cái";
  else if (spawn.phase === "waiting") message = "Vách đã rút, chờ đèn sáng";
  else if (spawn.phase === "done" && spawn.eggs >= 1) message = `Đã đẻ khoảng ${Math.round(spawn.eggs)} trứng`;
  else message = light ? "Đèn sáng" : "Đèn tắt";
  return { hour, light, pump: Boolean(pump), flow, perTank, temp, pH: HUSBANDRY.pHSet, ec: HUSBANDRY.ecSet, alarms, spawn, stocked, message };
}

/**
 * Giờ dạng hh:mm.
 * @param {number} hour giờ trong ngày (0–24)
 */
export function clockText(hour) {
  const m = Math.floor((((hour % 24) + 24) % 24) * 60 + 1e-6);
  return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
}

/**
 * Định dạng số kiểu Việt Nam (dấu phẩy thập phân).
 * @param {number} v
 * @param {number} [digits]
 */
export const vn = (v, digits = 1) => v.toFixed(digits).replace(".", ",");
