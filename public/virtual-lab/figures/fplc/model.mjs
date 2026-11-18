// Mô hình hệ sắc ký lỏng protein (FPLC) theo Cytiva ÄKTA pure 25 với bộ thu phân đoạn F9-C.
// Module thuần, không DOM: bản dựng, trang hình và lõi app (sau này: src/core/purify.js) cùng dùng.
// Số liệu và nguồn:
// - Data file "ÄKTA pure chromatography systems", Cytiva CY11416-01Jul21-DF
//   (bản PDF: https://www.uu.nl/sites/default/files/Akta%20pure.pdf):
//   máy 535 × 630 × 470 mm (R × C × S), tới 53 kg (48 kg cấu hình cơ bản); bơm hệ thống piston, 0,001–25 mL/phút
//   (tới 50 mL/phút khi nhồi cột), 0–20 MPa, sai số lưu lượng ± 1,2 %; cảm biến áp suất sau bơm 0–20 MPa;
//   buồng trộn có khuấy từ 1,4 mL (lắp sẵn); van tiêm V9-Inj, kèm vòng mẫu 500 µL; UV U9-L 280 nm, cuvet dòng 2 mm 2 µL;
//   độ dẫn C9n 0,01–999,99 mS/cm, cuvet 22 µL; van ra V9-Os 3 cổng (thải, bộ thu phân đoạn, cổng ra);
//   bộ thu phân đoạn F9-C 390 × 320 × 585 mm, 21 kg, 6 cassette, tới 576 phân đoạn,
//   cassette 40 ống 3 mL (240 ống mỗi khay), 24 ống 8 mL, 15 ống 15 mL, 6 ống 50 mL; phân đoạn 0,1–250 mL;
//   có nắp che bụi; khay chứa đệm ở mặt trên máy; các van, đầu dò, cột gắn ở mặt trước ("wet side"), ray gắn giá cột
//   ở mặt trước và hông trái; bảng điều khiển trên máy báo trạng thái, có nút tạm dừng/tiếp tục.
// - Bài báo nguồn của bài thực hành tinh sạch enzyme: Langenegger et al. 2018, J. Biol. Chem. 293(6):2079–2090,
//   doi:10.1074/jbc.M117.810911 (PMC5808768). Ba bước sắc ký: lọc gel Superdex 75 HR 10 × 300 mm
//   (100 mM NH₄OAc pH 5,0; 0,8 mL/phút; hoạt tính ở pic 2) → trao đổi cation MiniS PE 4,6 × 50 mm
//   (50 mM NH₄OAc pH 5,0; NaCl 0–0,65 M trong 21 phút; 0,8 mL/phút; pic 5) → RP-HPLC Nucleosil 300-5 C4 4,6 × 250 mm
//   (0,05 % TFA; acetonitrile 0–60 % trong 42 phút; 0,5 mL/phút; pic 3). Đo hoạt độ bằng cơ chất FRET DABCYL–EDANS
//   (kích thích 340 nm, phát 485 nm). Bài báo không nêu tên máy sắc ký: vẽ ÄKTA pure là lựa chọn của hình.
// - Cột vẽ trong hình: cột lọc gel kiểu Superdex 75 Increase 10/300 GL (lòng cột 10 × 300–310 mm, khoảng 24 mL,
//   tách protein cầu Mr 3 000–70 000; trang sản phẩm Cytiva và hướng dẫn cột). Đường kính ngoài, chiều dài tổng
//   và hình dạng đầu cột vẽ theo ảnh, chưa xác minh bằng bản vẽ của hãng.
// - Hình dạng sắc ký đồ mẫu (vị trí, độ cao pic) là minh hoạ dựng theo mô tả trong bài báo, không số hoá từ hình gốc.

export const AKTA = {
  size: [535, 630, 470], // mm, rộng × cao × sâu
  massKg: 53,
  flow: [0.001, 25], // mL/phút
  pressureMPa: 20,
  mixerMl: 1.4,
  loopUl: 500,
  uv: { nm: 280, pathMm: 2, cellUl: 2 },
  cond: { range: [0.01, 999.99], cellUl: 22 },
};

export const F9C = {
  size: [390, 320, 585], // mm, rộng × cao × sâu
  massKg: 21,
  cassettes: 6,
  maxFractions: 576,
  tube3: { perCassette: 40, perTray: 240, ml: 3 },
};

// Cột của ba bước trong bài báo và cột vẽ trong hình
export const COLUMNS = {
  "Superdex 75 HR 10/30": { kind: "sec", bed: [10, 300], ml: 24, note: "lọc gel, bài báo nguồn" },
  "Superdex 75 Increase 10/300 GL": { kind: "sec", bed: [10, 300], ml: 24, note: "lọc gel, cột vẽ trong hình" },
  "MiniS PE 4.6/50": { kind: "cex", bed: [4.6, 50], ml: 0.8, note: "trao đổi cation, bài báo nguồn" },
  "Nucleosil 300-5 C4": { kind: "rp", bed: [4.6, 250], ml: 4.2, note: "RP-HPLC C4, bài báo nguồn (chạy trên HPLC)" },
};

// Thông số từng bước theo bài báo (lưu lượng mL/phút, đệm, gradient)
export const STEPS = {
  sec: { name: "Lọc gel", short: "SEC", column: "Superdex 75 HR 10/30", flow: 0.8, buffer: "100 mM NH₄OAc pH 5,0", gradient: null },
  cex: { name: "Trao đổi cation", short: "CEX", column: "MiniS PE 4.6/50", flow: 0.8, buffer: "50 mM NH₄OAc pH 5,0", gradient: "NaCl 0–0,65 M" },
  rp: { name: "Pha đảo C4", short: "RP", column: "Nucleosil 300-5 C4", flow: 0.5, buffer: "0,05 % TFA", gradient: "acetonitrile 0–60 %" },
};

export const MAX_FRACTIONS = F9C.tube3.perTray; // hình vẽ một khay 6 cassette × 40 ống 3 mL

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const r3 = (v) => Math.round(v * 1000) / 1000;
const gauss = (x, c, w) => Math.exp(-0.5 * ((x - c) / w) ** 2);

// Dữ liệu mẫu (minh hoạ) cho ba bước, đánh số phân đoạn từ 1
function sampleOf(step, n, peaks, active, pool, salt) {
  const a280 = [];
  const activity = [];
  const gradient = salt ? [] : null;
  for (let i = 1; i <= n; i++) {
    a280.push(r3(clamp(0.02 + peaks.reduce((s, [c, w, h]) => s + h * gauss(i, c, w), 0), 0, 1)));
    activity.push(r3(clamp(active[2] * gauss(i, active[0], active[1]), 0, 1)));
    if (salt) gradient.push(r3(clamp((i - salt[0]) / (salt[1] - salt[0]), 0, 1)));
  }
  return { step, column: STEPS[step].column, fractions: n, a280, activity, salt: gradient, pool };
}

export const SAMPLES = {
  // Lọc gel: pic 1 ở thể tích rỗng, pic 2 chứa protease (hoạt tính), pic 3 neurotoxin nhỏ, pic 4 muối và peptide
  sec: sampleOf("sec", 36, [[9, 1.3, 0.42], [15, 1.6, 0.62], [22, 1.8, 0.95], [29, 1.5, 0.28]], [15, 1.5, 0.92], [13, 17]),
  // Trao đổi cation: dịch không bám ra đầu, sáu pic theo gradient NaCl, hoạt tính ở pic 5
  cex: sampleOf("cex", 30, [[3, 1.1, 0.9], [9, 0.9, 0.3], [12, 0.9, 0.45], [15, 1, 0.38], [18, 1, 0.55], [21, 1, 0.7], [25, 1.1, 0.25]], [21, 1.1, 0.88], [20, 22], [6, 27]),
  // Pha đảo C4: pic 1, 2 là neurotoxin, pic 3 là protease
  rp: sampleOf("rp", 40, [[11, 1.2, 0.85], [17, 1.3, 0.62], [25, 1.2, 0.48], [31, 1.4, 0.2]], [25, 1.2, 0.9], [24, 26], [4, 36]),
};
export const SAMPLE_RUN = SAMPLES.sec;

// Chuẩn hoá dữ liệu #run (hợp đồng của app). Thiếu hoặc sai thì lấy theo SAMPLES[step] hoặc mẫu SEC.
// { step: "sec"|"cex"|"rp", column, fractions: N, a280: [N số 0–1], activity: [N số 0–1], salt: [N số 0–1] | null,
//   pool: [from, to] (số thứ tự phân đoạn, từ 1) }
export function normalizeRun(run) {
  const r = run && typeof run === "object" ? run : {};
  const step = STEPS[r.step] ? r.step : "sec";
  const base = SAMPLES[step];
  const arr = (a) => (Array.isArray(a) ? a : null);
  const given = arr(r.a280);
  const n = clamp(Math.round(Number(r.fractions) || (given ? given.length : base.fractions)), 1, MAX_FRACTIONS);
  const fit = (a, fallback) => {
    const src = arr(a) ?? (n === base.fractions ? fallback : null);
    return Array.from({ length: n }, (_, i) => {
      const v = Number(src?.[i]);
      return Number.isFinite(v) ? clamp(v, 0, 1) : 0;
    });
  };
  const a280 = fit(r.a280, base.a280);
  const activity = fit(r.activity, base.activity);
  const own = !!given || n !== base.fractions; // dữ liệu riêng: không mượn gradient, vùng gộp của mẫu
  const salt = arr(r.salt) ? fit(r.salt) : r.salt === undefined && !own && base.salt ? [...base.salt] : null;
  let pool = Array.isArray(r.pool) && r.pool.length === 2 ? r.pool.map((v) => Math.round(Number(v))) : r.pool === undefined && !own ? base.pool : null;
  if (pool && pool.every(Number.isFinite)) {
    pool = [clamp(Math.min(...pool), 1, n), clamp(Math.max(...pool), 1, n)];
  } else pool = null;
  const column = typeof r.column === "string" && r.column.trim() ? r.column.trim().slice(0, 40) : STEPS[step].column;
  return { step, column, fractions: n, a280, activity, salt, pool };
}

export const inPool = (run, i) => !!run.pool && i + 1 >= run.pool[0] && i + 1 <= run.pool[1]; // i từ 0

// Các pha của một lượt chạy (giây trên hình). Thời gian thật theo lưu lượng nằm ở minutesOf.
export const PHASES = [
  { id: "equil", name: "Cân bằng cột", seconds: 2.6 },
  { id: "load", name: "Nạp mẫu", seconds: 2.2 },
  { id: "elute", name: "Rửa giải", seconds: 1.8 },
  { id: "collect", name: "Thu phân đoạn", seconds: 0 }, // theo số phân đoạn: perFraction × N
  { id: "done", name: "Xong", seconds: 0 },
];
export const perFraction = (n) => clamp(16 / Math.max(1, n), 0.12, 0.55); // giây trên hình cho một phân đoạn

// Trạng thái theo thời gian t (giây trên hình) từ lúc bấm chạy: { phase, index, name, progress, collected, fill }
// collected: số phân đoạn đã thu xong; fill: phần đầy (0–1) của ống đang thu; progress: phần đường A280 đã vẽ (0–1)
export function stateAt(t, n) {
  let start = 0;
  for (let i = 0; i < 3; i++) {
    const p = PHASES[i];
    if (t < start + p.seconds) return { phase: p.id, index: i, name: p.name, local: (t - start) / p.seconds, progress: 0, collected: 0, fill: 0 };
    start += p.seconds;
  }
  const per = perFraction(n);
  const tc = t - start;
  if (tc < per * n) {
    const k = Math.floor(tc / per);
    return { phase: "collect", index: 3, name: PHASES[3].name, local: tc / (per * n), progress: tc / (per * n), collected: k, fill: (tc - k * per) / per };
  }
  return { phase: "done", index: 4, name: PHASES[4].name, local: 1, progress: 1, collected: n, fill: 0 };
}
export const totalSeconds = (n) => PHASES.slice(0, 3).reduce((s, p) => s + p.seconds, 0) + perFraction(n) * n;

// Giá trị A280 nội suy theo vị trí x (0 … N, đơn vị phân đoạn; điểm của phân đoạn i ở x = i + 0,5)
export function a280At(run, x) {
  const a = run.a280;
  const u = clamp(x - 0.5, 0, a.length - 1);
  const i = Math.min(a.length - 2, Math.floor(u));
  if (a.length < 2) return a[0] ?? 0;
  const f = u - i;
  const s = (1 - Math.cos(Math.PI * f)) / 2; // nối cosine, không vượt quá hai điểm đầu mút
  return a[i] * (1 - s) + a[i + 1] * s;
}

// Thời gian thật (phút) của phần thu phân đoạn khi mỗi phân đoạn ml mL ở lưu lượng của bước
export function minutesOf(run, ml = 0.5) {
  return (run.fractions * ml) / STEPS[run.step].flow;
}

export const fmtNum = (v, d = 0) => v.toFixed(d).replace(".", ",");
