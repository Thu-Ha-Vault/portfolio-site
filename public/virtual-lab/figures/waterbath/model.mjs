// Mô hình bể ổn nhiệt (theo Memmert Waterbath WNB 10), dùng chung cho bản dựng (Node), trang hình (trình duyệt)
// và sau này cho lõi mô phỏng của app (src/core). Module thuần: không DOM, không Three.js, không import file khác.
//
// Nguồn số liệu:
// - Datasheet Memmert "Waterbaths WNB, WNE, WPE" (01/2022,
//   https://analytics-shop.com/media/Hersteller/Kataloge/memmert-us/Memmert_Waterbaths_WNB_WNE.pdf):
//   WNB 10: khoảng 10 L; lòng bể inox 350 × 210 × 140 mm (dài × rộng × sâu); vỏ dài 578 mm, rộng 356 mm,
//   cao 238 mm với nắp phẳng và 337 mm với nắp mái; mực nước tối thiểu 97 mm, tối đa 120 mm; dải làm việc
//   từ nhiệt độ phòng + 5 K tới +95 °C cộng mức sôi; dải đặt +10 tới +95 °C và mức sôi; dao động ±0,1 K;
//   phân bố ±0,25 K; khoảng 1200 W; gia nhiệt diện rộng ở ba mặt ngoài lòng bể; khoảng 13 kg.
//   Bản vẽ kích thước: ngăn điều khiển 164 mm ở đầu trái, chân 15 mm, lề lòng bể 67 mm (trước) và 79 mm (sau).
//   Phụ kiện: giá ống 2 hàng 24 lỗ Ø18 mm rộng 50 mm (E02022); khay đáy đục lỗ 2 độ cao 30 hoặc 60 mm;
//   nắp mái inox B02642.
// - Một datasheet Memmert cùng đời: độ phân giải hiển thị 0,1 °C tới 99,9 °C, 1 °C từ 100 °C (chưa xác minh riêng cho WNB).
// - Nhiệt dung riêng của nước 4,18 J/(g·K) (khoảng 20–60 °C, NIST Chemistry WebBook / CRC Handbook);
//   ẩn nhiệt hoá hơi ở 100 °C 2257 J/g (CRC Handbook); nhiệt dung riêng inox 304 khoảng 0,50 J/(g·K).
// Số ước tính, chưa xác minh với hãng: lòng bể inox khoảng 3 kg; hiệu suất truyền nhiệt 90 %;
// hệ số mất nhiệt 6 W/K khi đậy nắp mái và 9 W/K khi mở nắp (gồm cả bay hơi), chọn để 8 L nước từ 20 °C
// tới sôi mất khoảng 1 giờ (tối thiểu lý thuyết với 1200 W là khoảng 38 phút).

export const WNB10 = {
  outer: { length: 578, width: 356, heightFlat: 238, heightGable: 337, feet: 15 },
  bath: { length: 350, width: 210, depth: 140 },
  control: 164, // ngăn điều khiển ở đầu trái mặt trước
  margin: { front: 67, back: 79 },
  level: { min: 97, max: 120, drawn: 110 }, // mực nước (mm từ đáy lòng bể); hình vẽ dùng 110
  setRange: [10, 95], // trên 95 °C là mức sôi
  boilStage: 100,
  stability: 0.1, // ±K theo thời gian
  uniformity: 0.25, // ±K trong bể
  powerW: 1200,
  massKg: 13,
  efficiency: 0.9,
  steelKg: 3,
  lossWK: { closed: 6, open: 9 },
  room: 22,
};

export const WATER = { cp: 4.18, latent: 2257, rho: 1, boil: 100 };
export const STEEL_CP = 0.5;

// Giá ống và ống nghiệm vẽ trong hình (bước lỗ và chiều dài giá chưa xác minh)
export const RACK = { holes: 12, rows: 2, pitch: 25, hole: 18, width: 50, length: 320 };
export const TUBE = { od: 16, length: 150, wall: 0.7, maxTubes: 10 };

/** Thể tích nước (L) trong lòng bể ở mực `depthMm`. */
export const waterLitres = (depthMm = WNB10.level.drawn) => (WNB10.bath.length * WNB10.bath.width * depthMm) / 1e6;

/** Nhiệt dung (J/K) của nước và lòng bể. */
export function heatCapacity(depthMm = WNB10.level.drawn) {
  return waterLitres(depthMm) * 1000 * WATER.rho * WATER.cp + WNB10.steelKg * 1000 * STEEL_CP;
}

/** Nhiệt độ đích của bộ điều khiển: đặt trên 95 °C là mức sôi (đun hết công suất, nước dừng ở 100 °C). */
export const targetOf = (setC) => (setC > WNB10.setRange[1] ? WATER.boil : Math.max(WNB10.setRange[0], setC));
export const isBoilStage = (setC) => setC > WNB10.setRange[1];

/**
 * Nhiệt độ nước sau `seconds` giây đun từ `fromC`, theo cân bằng nhiệt một nút:
 * C·dT/dt = P·η − UA·(T − T_phòng). Khi tới nhiệt độ đích thì bộ điều khiển PID giữ ở đó (đun sôi thì nước dừng ở 100 °C).
 * Nguội (đích thấp hơn nước) theo hằng số thời gian C/UA.
 */
export function tempAfter(seconds, { fromC = WNB10.room, setC = 100, lid = "closed", depthMm = WNB10.level.drawn, room = WNB10.room } = {}) {
  const C = heatCapacity(depthMm);
  const UA = WNB10.lossWK[lid === "open" ? "open" : "closed"];
  const goal = targetOf(setC);
  const tau = C / UA;
  const decay = Math.exp(-Math.max(0, seconds) / tau);
  if (fromC <= goal) {
    const inf = room + (WNB10.powerW * WNB10.efficiency) / UA;
    return Math.min(goal, inf + (fromC - inf) * decay);
  }
  return Math.max(goal, room + (fromC - room) * decay);
}

/** Số phút để nước từ `fromC` lên `toC` (Infinity nếu công suất không đủ bù mất nhiệt). */
export function heatUpMinutes({ fromC = WNB10.room, toC = 100, lid = "closed", depthMm = WNB10.level.drawn, room = WNB10.room } = {}) {
  const C = heatCapacity(depthMm);
  const UA = WNB10.lossWK[lid === "open" ? "open" : "closed"];
  const inf = room + (WNB10.powerW * WNB10.efficiency) / UA;
  if (toC <= fromC) return 0;
  if (toC >= inf) return Infinity;
  return ((C / UA) * Math.log((inf - fromC) / (inf - toC))) / 60;
}

/** Nước bay hơi khi đang sôi (g/phút): phần công suất không mất ra ngoài đi vào ẩn nhiệt hoá hơi. */
export function boilOffGPerMin({ lid = "closed", room = WNB10.room } = {}) {
  const UA = WNB10.lossWK[lid === "open" ? "open" : "closed"];
  return (Math.max(0, WNB10.powerW * WNB10.efficiency - UA * (WATER.boil - room)) / WATER.latent) * 60;
}

/** Chữ trên màn hình: 0,1 °C tới 99,9 °C, số nguyên từ 100 °C. */
export function displayText(T) {
  if (T >= 99.95) return String(Math.round(T));
  return T.toFixed(1).replace(".", ",");
}

/** Mức hơi nước 0–1 trên mặt nước (bắt đầu từ 90 °C, đầy ở 100 °C) và có sủi bọt không (từ 95 °C). */
export const steamOf = (T) => Math.min(1, Math.max(0, (T - 90) / 10));
export const bubblesAt = (T) => T >= 95;

// Lượt đun mẫu khi không có #run: 5 ống thử Fehling sau 5 phút cách thuỷ sôi
// (2 mL Fehling A+B và 1 mL mẫu 1 % ≈ 3 mL, cao khoảng 24 mm trong ống 16 × 150 mm).
export const DEMO_RUN = {
  setC: 100,
  waterC: 99.6,
  lid: "open",
  minutes: 5,
  tubes: [
    { label: "Glucose", color: "#6f8f4a", level: 0.16, precipitate: "#b2381c", ring: null },
    { label: "Fructose", color: "#7a8a44", level: 0.16, precipitate: "#b2381c", ring: null },
    { label: "Maltose", color: "#4f8a8c", level: 0.16, precipitate: "#a8452a", ring: null },
    { label: "Sucrose", color: "#2563c7", level: 0.16, precipitate: null, ring: null },
    { label: "ĐC nước", color: "#2563c7", level: 0.16, precipitate: null, ring: null },
  ],
};

const COLOR = /^(#[0-9a-f]{3,8}|(rgb|hsl)a?\([0-9.,%\s/deg]+\)|[a-z]{3,20})$/i;
const colorOf = (c, fallback) => (typeof c === "string" && COLOR.test(c.trim()) ? c.trim() : fallback);
const num = (v, fallback) => (typeof v === "number" && Number.isFinite(v) ? v : fallback);
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

/** Chuẩn hoá dữ liệu #run (thiếu thì lấy theo lượt mẫu, kẹp vào dải hợp lệ, tối đa 10 ống). */
export function runOf(run) {
  const r = run && typeof run === "object" ? run : DEMO_RUN;
  const setC = clamp(num(r.setC, DEMO_RUN.setC), WNB10.setRange[0], WATER.boil);
  const waterC = clamp(num(r.waterC, targetOf(setC)), 0, WATER.boil);
  const tubes = (Array.isArray(r.tubes) ? r.tubes : run ? [] : DEMO_RUN.tubes).slice(0, TUBE.maxTubes).map((t, i) => ({
    label: String(t?.label ?? `Ống ${i + 1}`).slice(0, 28),
    color: colorOf(t?.color, "#9cc3d4"),
    level: clamp(num(t?.level, 0.16), 0, 0.6),
    precipitate: t?.precipitate ? colorOf(t.precipitate, null) : null,
    ring: t?.ring ? colorOf(t.ring, null) : null,
  }));
  return { setC, waterC, lid: r.lid === "closed" ? "closed" : "open", minutes: clamp(num(r.minutes, 0), 0, 600), tubes };
}

/** Lỗ dùng cho n ống: xếp giữa hàng trước của giá 12 lỗ. */
export function holesFor(n) {
  const start = Math.floor((RACK.holes - n) / 2);
  return Array.from({ length: n }, (_, i) => start + i);
}
