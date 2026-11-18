// Mô hình buồng sinh trưởng thực vật (theo Conviron GEN1000, cấu hình 1 tầng) trồng đậu Hà Lan, dùng chung cho
// bản dựng (Node), trang hình (trình duyệt) và sau này cho lõi mô phỏng khu trồng trọt (src/core).
// Module thuần: không DOM, không Three.js.
//
// Nguồn số liệu:
// - [DS] Conviron GEN1000 Data Sheet 2025 (MK0090 rev 15, bản vẽ số 288765 Rev 1),
//   https://conviron.b-cdn.net/uploads/GEN1000-Data-Sheet-2025-MK0090-rev-15.pdf :
//   ngoài 1040 × 825 × 1960 mm (R × S × C; 41″ × 32,5″ × 77″), rộng tối đa 1092 mm; trong rộng 955 mm, cao 1330 mm;
//   1 tầng: cao trồng 1180 mm (46,5″), diện tích 0,525 m², 2050 µmol/m²/s; kit cây cao 1 tầng: 1085 mm, 0,58 m²,
//   luồng gió hướng lên; 4–45 °C khi tắt đèn, 7–50 °C khi bật đèn (tuỳ chọn nhiệt độ thấp +1 °C bật đèn, −5 °C tắt đèn);
//   tạo ẩm siêu âm tới 90 % RH khi tắt đèn; LED phổ rộng, đèn đỏ xa điều khiển riêng, đèn đạt IP65; bộ điều khiển
//   CMP7000 màn hình cảm ứng màu 7 inch; cửa sổ quan sát là tuỳ chọn; mặt trước có công tắc nguồn, khoá cửa, cổng USB;
//   hông trái có lỗ thải khí (trên) và lỗ cấp khí tươi (dưới); khay hứng nước dưới đáy; cửa cần 1020 mm (40″) để mở;
//   máy lạnh giải nhiệt gió, đặt liền khối; cần nước RO cho bộ tạo ẩm.
// - [WEB] Trang sản phẩm https://www.conviron.com/products/gen1000/ : ngoài 41″ × 32,5″ × 77″, diện tích chiếm sàn 9,25 ft²,
//   cao trồng tối đa 46,5″, 2050 µmol/m²/s, dải nhiệt chuẩn 4–50 °C.
// - [PGR15] Harvard Arboretum, Growth facilities, https://arboretum.harvard.edu/research/research-facilities/growth-facilities :
//   buồng Conviron PGR15 (cùng hãng) RH tối đa 90 % khi tắt đèn, 85 % khi bật đèn. GEN1000 không ghi RH khi bật đèn,
//   nên hình mượn 85 % của PGR15 (chưa xác minh cho GEN1000).
// - [OSU] Oregon State University, Peas – Western Oregon, https://horticulture.oregonstate.edu/oregon-vegetables/peas-western-oregon-0 :
//   độ-ngày của đậu Hà Lan tính với nền 40 °F (4,4 °C). Nhiệt độ cao nhất chặn ở 80 °F (26,7 °C) theo cách tính của ngành
//   đậu chế biến (bằng sáng chế USPTO 7906708, đọc gián tiếp).
// - [ECO] FAO EcoCrop, Pisum sativum: tối ưu 10–24 °C, giới hạn 4–30 °C.
// - [MEN] Mendel 1866, bản dịch tiếng Anh tại mendelweb.org: thân dài 6–7 ft (1,83–2,13 m) lai với thân ngắn 3/4–1 1/2 ft
//   (0,23–0,46 m); con lai dài 6–7 1/2 ft.
// - [BOT] Ohio State University: giữ RH dưới 85 % để phòng Botrytis (ngưỡng dùng cho cảnh báo).
// - DLI (mol/m²/ngày) = PPFD (µmol/m²/s) × số giờ sáng × 3600 s / 10⁶ = PPFD × giờ × 0,0036 (định nghĩa).
// - Áp suất hơi bão hoà theo công thức Magnus (Alduchov & Eskridge 1996): es = 0,61094·exp(17,625·T/(T + 243,04)) kPa.
//
// Các số minh hoạ, chưa xác minh với hãng (ghi rõ trong ghi chú 07):
// - Không khí phòng 22 °C, 45 % RH. Hằng số trao đổi khí khi cửa mở hết 45 s; hằng số điều khiển về điểm đặt của nhiệt độ
//   90 s và của ẩm 180 s. Ba hằng số này quyết định độ lệch và thời gian hồi phục sau khi mở cửa.
// - Đèn bật lúc 06:00 và sáng liền `photoperiod` giờ.
// - Lịch sinh trưởng theo độ-ngày (nền 4,4 °C): mọc 100, ra hoa 550, có quả 680, chín khô 1200 °C·ngày (ước tính
//   trong tài liệu đã tra, chưa phải hằng số đo trực tiếp). Chiều cao theo đường logistic với điểm giữa 550 °C·ngày và
//   độ dốc 110 °C·ngày (dạng đường cong minh hoạ), chiều cao cuối 195 cm (thân cao Le) hoặc 34 cm (thân thấp le), lấy
//   giữa khoảng Mendel ghi. Hình chưa mô phỏng ảnh hưởng của ánh sáng và quang kỳ tới tốc độ lớn.

export const GEN = {
  model: "Conviron GEN1000, 1 tầng",
  exterior: { w: 1040, d: 825, h: 1960, wMax: 1092 },
  interior: { w: 955, h: 1330 },
  growth: { h: 1180, area: 0.525 },
  tallKit: { h: 1085, area: 0.58 },
  ppfdMax: 2050,
  tempOn: [7, 50],
  tempOff: [4, 45],
  lowTemp: { on: 1, off: -5 },
  rhMaxOff: 90,
  rhMaxOn: 85, // mượn PGR15, chưa xác minh cho GEN1000
  screenIn: 7,
  doorClearance: 1020,
  potH: 160, // chậu 16 cm (minh hoạ), trừ vào chiều cao trồng
};

/** Đậu Hà Lan: nền độ-ngày, chặn nhiệt độ cao nhất, khoảng nhiệt độ, lịch sinh trưởng và chiều cao cuối. */
export const PEA = {
  tBase: 4.4,
  tMaxCap: 26.7,
  optimal: [10, 24],
  tolerable: [4, 30],
  gdd: { emerge: 100, flower: 550, pod: 680, ripe: 1200 },
  curve: { mid: 550, slope: 110 },
  heightCm: { tall: 195, dwarf: 34 },
  rhDisease: 85,
};

/** Không khí phòng và các hằng số thời gian (minh hoạ, xem đầu file). */
export const ROOM = { T: 22, RH: 45 };
export const DYN = { tauExchangeS: 45, tauTempS: 90, tauRhS: 180, lightsOnHour: 6 };

/** Chương trình mặc định cho đậu Hà Lan: ngày 18 °C, đêm 14 °C, 70 % RH, 400 µmol/m²/s, 16 giờ sáng; hình mở ở ngày 48 (vừa ra hoa). */
export const DEFAULT = { dayC: 18, nightC: 14, rh: 70, ppfd: 400, photoperiod: 16, day: 48, variety: "tall" };

/** Các chương trình có sẵn trong hình (phím Space). */
export const PROGRAMS = [
  { name: "Đậu Hà Lan", dayC: 18, nightC: 14, rh: 70, ppfd: 400, photoperiod: 16 },
  { name: "Ngày ngắn", dayC: 18, nightC: 14, rh: 70, ppfd: 400, photoperiod: 8 },
  { name: "Ấm", dayC: 24, nightC: 18, rh: 65, ppfd: 600, photoperiod: 16 },
  { name: "Quá nóng", dayC: 32, nightC: 26, rh: 60, ppfd: 600, photoperiod: 16 },
  { name: "Ẩm cao", dayC: 18, nightC: 14, rh: 90, ppfd: 400, photoperiod: 16 },
];

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const num = (v, d) => (Number.isFinite(Number(v)) && v !== null && v !== "" ? Number(v) : d);

/** Định dạng số kiểu Việt Nam: dấu trừ thật, dấu phẩy thập phân. */
export const fmt = (v, d = 1) => `${v < 0 ? "−" : ""}${Math.abs(v).toFixed(d).replace(".", ",")}`;

/** Áp suất hơi bão hoà (kPa) ở T °C, công thức Magnus. */
export const vp = (T) => 0.61094 * Math.exp((17.625 * T) / (T + 243.04));
/** Độ ẩm tương đối (%) từ áp suất hơi e (kPa) ở T °C, chặn 0–100. */
export const rhOf = (e, T) => clamp((100 * e) / vp(T), 0, 100);
/** Áp suất hơi (kPa) của không khí T °C, RH %. */
export const eOf = (T, rh) => (vp(T) * rh) / 100;

/** Ánh sáng tích luỹ trong ngày (mol/m²/ngày) = PPFD × giờ sáng × 0,0036. */
export const dli = (ppfd, hours) => ppfd * hours * 0.0036;

/**
 * Chuẩn hoá một chương trình (từ #run hoặc phím): chặn vào khả năng của buồng và trả về danh sách lưu ý.
 * Vào: { dayC, nightC, rh, ppfd, photoperiod, day, variety: "tall" | "dwarf", name }.
 * Ra: { dayC, nightC, rh, ppfd, photoperiod, day, variety, name, notes: [chuỗi tiếng Việt] }.
 */
export function program(input = {}) {
  const notes = [];
  const want = {
    dayC: num(input.dayC, DEFAULT.dayC),
    nightC: num(input.nightC, DEFAULT.nightC),
    rh: num(input.rh, DEFAULT.rh),
    ppfd: num(input.ppfd, DEFAULT.ppfd),
    photoperiod: num(input.photoperiod, DEFAULT.photoperiod),
  };
  const photoperiod = clamp(Math.round(want.photoperiod * 2) / 2, 0, 24);
  const dayC = clamp(want.dayC, GEN.tempOn[0], GEN.tempOn[1]);
  const nightC = clamp(want.nightC, GEN.tempOff[0], GEN.tempOff[1]);
  const ppfd = clamp(want.ppfd, 0, GEN.ppfdMax);
  const rh = clamp(want.rh, 0, GEN.rhMaxOff);
  if (dayC !== want.dayC) notes.push(`nhiệt độ ngày chỉ đặt được ${GEN.tempOn[0]}–${GEN.tempOn[1]} °C`);
  if (nightC !== want.nightC) notes.push(`nhiệt độ đêm chỉ đặt được ${GEN.tempOff[0]}–${GEN.tempOff[1]} °C`);
  if (ppfd !== want.ppfd) notes.push(`đèn tối đa ${GEN.ppfdMax} µmol/m²/s`);
  if (rh !== want.rh) notes.push(`tạo ẩm tối đa ${GEN.rhMaxOff} % RH`);
  if (photoperiod > 0 && rh > GEN.rhMaxOn) notes.push(`khi đèn sáng RH chỉ giữ được khoảng ${GEN.rhMaxOn} %`);
  return {
    dayC,
    nightC,
    rh,
    ppfd,
    photoperiod,
    day: clamp(num(input.day, DEFAULT.day), 0, 200),
    variety: input.variety === "dwarf" ? "dwarf" : "tall",
    name: input.name ? String(input.name).slice(0, 24) : "",
    notes,
  };
}

/** Đèn có sáng lúc `hour` (0–24) không: bật từ 06:00, sáng liền `photoperiod` giờ. */
export const lightsOn = (prog, hour) => prog.photoperiod >= 24 || (((hour - DYN.lightsOnHour) % 24) + 24) % 24 < prog.photoperiod;

/** Điểm đặt lúc đèn sáng hoặc tắt: { T, RH } (RH chặn theo khả năng tạo ẩm khi đèn sáng). */
export function targets(prog, on) {
  return { T: on ? prog.dayC : prog.nightC, RH: Math.min(prog.rh, on ? GEN.rhMaxOn : GEN.rhMaxOff) };
}

/** Độ-ngày mỗi ngày (°C·ngày, nền 4,4 °C, nhiệt độ cao nhất chặn ở 26,7 °C): max(0, (Tmax + Tmin)/2 − 4,4). */
export function gddPerDay(prog) {
  const hi = Math.max(prog.dayC, prog.nightC);
  const lo = Math.min(prog.dayC, prog.nightC);
  const tmax = Math.min(hi, PEA.tMaxCap);
  const tmin = Math.min(lo, tmax);
  return Math.max(0, (tmax + tmin) / 2 - PEA.tBase);
}

/** Tóm tắt một ngày theo chương trình: { dli, gdd, meanT (trung bình theo giờ sáng/tối) }. */
export function daily(prog) {
  const h = prog.photoperiod;
  return { dli: dli(prog.ppfd, h), gdd: gddPerDay(prog), meanT: (prog.dayC * h + prog.nightC * (24 - h)) / 24 };
}

/** Khoảng trống cho cây (cm) = chiều cao trồng − chậu. */
export const spaceCm = () => (GEN.growth.h - GEN.potH) / 10;

/** Giai đoạn theo độ-ngày: "seed" | "sprout" | "veg" | "flower" | "pod" | "ripe". */
export function stageOf(gdd) {
  const g = PEA.gdd;
  if (gdd < g.emerge) return "seed";
  if (gdd < g.emerge + 120) return "sprout";
  if (gdd < g.flower) return "veg";
  if (gdd < g.pod) return "flower";
  if (gdd < g.ripe) return "pod";
  return "ripe";
}
export const STAGE_VI = { seed: "hạt nảy mầm", sprout: "cây con", veg: "sinh trưởng", flower: "ra hoa", pod: "có quả", ripe: "quả chín khô" };

/** Chiều cao thân (cm, chưa chặn) theo độ-ngày: logistic, 0 trước khi mọc. */
export function heightCm(gdd, variety = "tall") {
  if (gdd < PEA.gdd.emerge) return 0;
  const hmax = PEA.heightCm[variety === "dwarf" ? "dwarf" : "tall"];
  return hmax / (1 + Math.exp(-(gdd - PEA.curve.mid) / PEA.curve.slope));
}

/**
 * Cây sau một số độ-ngày: { gdd, stage, height (cm, thân dài thật), standing (cm, cao tới ngọn sau khi chạm tấm chắn),
 * touching (ngọn chạm tấm chắn đèn), ripe (0–1, quả khô dần), senescence (0–1, lá vàng dần) }.
 */
export function plantAt(gdd, variety = "tall") {
  const height = heightCm(gdd, variety);
  const space = spaceCm();
  const g = PEA.gdd;
  return {
    gdd,
    stage: stageOf(gdd),
    height,
    standing: Math.min(height, space),
    touching: height > space,
    ripe: clamp((gdd - (g.ripe - 250)) / 250, 0, 1),
    senescence: clamp((gdd - (g.ripe - 200)) / 300, 0, 1),
  };
}

/** Cây theo chương trình giữ nguyên `days` ngày (độ-ngày = số ngày × độ-ngày mỗi ngày). */
export const grow = (prog, days) => plantAt(gddPerDay(prog) * Math.max(0, days), prog.variety);

/** Lưu ý sinh lý cho chương trình (danh sách tiếng Việt, rỗng nếu phù hợp). */
export function warnings(prog) {
  const out = [];
  const hi = Math.max(prog.dayC, prog.nightC);
  const lo = Math.min(prog.dayC, prog.nightC);
  if (hi > PEA.tolerable[1]) out.push(`trên ${PEA.tolerable[1]} °C: quá giới hạn chịu của đậu Hà Lan`);
  else if (hi > PEA.optimal[1]) out.push(`trên ${PEA.optimal[1]} °C: ngoài khoảng tối ưu`);
  if (lo < PEA.tolerable[0]) out.push(`dưới ${PEA.tolerable[0]} °C: quá giới hạn chịu`);
  else if (lo < PEA.optimal[0]) out.push(`dưới ${PEA.optimal[0]} °C: ngoài khoảng tối ưu`);
  if (Math.max(targets(prog, true).RH, targets(prog, false).RH) >= PEA.rhDisease) out.push(`RH ≥ ${PEA.rhDisease} %: dễ mốc xám Botrytis`);
  return out;
}

/**
 * Một bước mô phỏng không khí trong buồng (dt giây).
 * state: { T (°C), e (kPa, áp suất hơi) }; inputs: { prog, on (đèn sáng?), door (phần cửa mở, 0–1) }.
 * Cửa mở: không khí trao đổi với phòng; bộ điều khiển luôn kéo T và e về điểm đặt (bậc nhất).
 * Trả về state mới kèm { RH, heat (0–1, sưởi chạy), cool (0–1, dàn lạnh chạy), humid (0–1, tạo ẩm chạy) }.
 */
export function step(state, dt, { prog, on, door = 0 }) {
  const tg = targets(prog, on);
  const eSet = eOf(tg.T, tg.RH);
  const eRoom = eOf(ROOM.T, ROOM.RH);
  let { T, e } = state;
  const n = Math.max(1, Math.ceil(dt / 5));
  const h = dt / n;
  const x = clamp(door, 0, 1) / DYN.tauExchangeS;
  for (let i = 0; i < n; i++) {
    const a = x + 1 / DYN.tauTempS;
    const Teq = (x * ROOM.T + tg.T / DYN.tauTempS) / a;
    T = Teq + (T - Teq) * Math.exp(-h * a);
    const b = x + 1 / DYN.tauRhS;
    const eq = (x * eRoom + eSet / DYN.tauRhS) / b;
    e = eq + (e - eq) * Math.exp(-h * b);
  }
  const RH = rhOf(e, T);
  return { T, e, RH, heat: clamp((tg.T - T) / 2, 0, 1), cool: clamp((T - tg.T) / 2, 0, 1) || (on ? 0.25 : 0.1), humid: clamp((eSet - e) / (0.08 * vp(tg.T)), 0, 1) };
}

/** Trạng thái ổn định theo điểm đặt (đèn sáng hoặc tắt). */
export function steady(prog, on) {
  const tg = targets(prog, on);
  return { T: tg.T, e: eOf(tg.T, tg.RH), RH: tg.RH };
}

/**
 * Mở cửa `seconds` giây rồi đóng: { T, RH (lúc đóng cửa), dT, dRH (lệch so với điểm đặt), recoverT, recoverRH (phút để về
 * trong 0,5 °C và 3 % RH quanh điểm đặt) }.
 */
export function doorOpen(seconds, prog, on = true) {
  const tg = targets(prog, on);
  let s = steady(prog, on);
  s = step(s, Math.max(0, seconds), { prog, on, door: 1 });
  const open = { ...s };
  let t = 0;
  let recoverT = null;
  let recoverRH = null;
  while (t < 3600 && (recoverT === null || recoverRH === null)) {
    if (recoverT === null && Math.abs(s.T - tg.T) <= 0.5) recoverT = t / 60;
    if (recoverRH === null && Math.abs(s.RH - tg.RH) <= 3) recoverRH = t / 60;
    s = step(s, 5, { prog, on, door: 0 });
    t += 5;
  }
  return { T: open.T, RH: open.RH, dT: open.T - tg.T, dRH: open.RH - tg.RH, recoverT: recoverT ?? 60, recoverRH: recoverRH ?? 60 };
}

/** Giờ trong ngày dạng "hh:mm" từ số giây kể từ 00:00 ngày 0. */
export const clockOf = (t) => {
  const m = Math.floor((((t / 60) % 1440) + 1440) % 1440);
  return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
};
