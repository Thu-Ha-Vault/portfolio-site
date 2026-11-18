// Mô hình điện di protein đứng SDS-PAGE (Laemmli, Tris-glycine-SDS) trên bể Bio-Rad Mini-PROTEAN Tetra Cell,
// nguồn Bio-Rad PowerPac HC. Module thuần, không DOM: bản dựng, trang hình và lõi app cùng dùng.
// Số liệu và nguồn:
// - Manual Mini-PROTEAN Tetra Cell (Bio-Rad 10007296 Rev C, https://www.bio-rad.com/webroot/web/pdf/lsr/literature/10007296.pdf):
//   bể 16 × 12 × 18 cm, tối đa 600 V; kính spacer 0,75/1,0/1,5 mm; lược 10 giếng răng 5,08 mm (44 µL ở 1,0 mm),
//   15 giếng 3,35 mm (26 µL); đệm 700 mL cho 2 gel (buồng ngoài 550 mL), 1000 mL cho 4 gel (680 mL);
//   chạy 200 V hằng thế khoảng 35 phút cho SDS-PAGE, gel Tris-HCl 35–45 phút tuỳ % acrylamide (mục 2.2.5).
// - Kính short plate 10,1 × 7,3 cm (trang kính mPAGE tương thích của Merck); gel đổ tay khoảng 8,3 × 7,3 cm,
//   gel đúc sẵn TGX 8,6 × 6,7 cm (trang bán lại; chưa xác minh bằng tài liệu hãng).
// - PowerPac HC (Bio-Rad 1645052): 5–250 V, 0,01–3 A, 1–300 W, LCD 2 dòng, 25 × 28,5 × 8 cm.
// - Rf của thang Precision Plus Protein: đo bằng điểm ảnh trên "Protein Migration Chart", Bio-Rad Bulletin 2414 trang 5
//   (gel Tris-HCl pH 8,8, chạy tới khi vạch màu chạm đáy). Biểu đồ là hình minh hoạ của hãng nên số đo là minh hoạ.
// - Pha cô mẫu (gel stacking khoảng 14 % quãng đường), độ rộng băng, dòng điện và tốc độ tỉ lệ với điện áp: minh hoạ.

export const CELL = {
  size: [160, 120, 180], // mm, dài × rộng × cao (manual)
  vMax: 600,
  plate: { short: [101, 73], spacer: [101, 82] }, // mm; spacer plate cao 82 mm: chưa xác minh
  gel: { w: 83, h: 73, thick: 1.0 }, // gel đổ tay, mm
  run: 63, // mm từ đáy giếng tới đáy gel (gel 73, giếng sâu 8, mép trên 2): chưa xác minh
  stack: 0.14, // phần quãng đường thuộc gel cô (stacking): minh hoạ
  comb: { 10: { tooth: 5.08, vol: 44 }, 15: { tooth: 3.35, vol: 26 } }, // gel 1,0 mm
  buffer: { gels2: { total: 700, outer: 550 }, gels4: { total: 1000, outer: 680 } }, // mL
};

export const PSU = { vMin: 5, vMax: 250, mAMax: 3000, wMax: 300, size: [250, 285, 80] };

// Thang Precision Plus Protein: 10 băng, ba băng tham chiếu đậm 75, 50, 25 kDa
export const LADDER_KDA = [250, 150, 100, 75, 50, 37, 25, 20, 15, 10];
const REFERENCE = new Set([75, 50, 25]);
export const LADDER = LADDER_KDA.map((kDa) => ({ kDa, amount: REFERENCE.has(kDa) ? 0.95 : 0.55 }));

// Rf (0 = đáy giếng, 1 = đáy gel) của từng băng thang theo % gel (Bulletin 2414)
export const MIGRATION = {
  5: [[250, 0.401], [150, 0.585], [100, 0.785], [75, 0.92]],
  7.5: [[250, 0.265], [150, 0.363], [100, 0.473], [75, 0.584], [50, 0.772], [37, 0.882]],
  10: [[250, 0.191], [150, 0.264], [100, 0.339], [75, 0.423], [50, 0.561], [37, 0.685], [25, 0.906]],
  12.5: [[250, 0.166], [150, 0.216], [100, 0.252], [75, 0.311], [50, 0.423], [37, 0.499], [25, 0.685], [20, 0.746], [15, 0.869], [10, 0.894]],
  15: [[250, 0.14], [150, 0.167], [100, 0.191], [75, 0.253], [50, 0.324], [37, 0.401], [25, 0.54], [20, 0.598], [15, 0.733], [10, 0.859]],
  18: [[250, 0.121], [150, 0.141], [100, 0.166], [75, 0.191], [50, 0.252], [37, 0.289], [25, 0.401], [20, 0.45], [15, 0.537], [10, 0.661]],
};
const PERCENTS = Object.keys(MIGRATION).map(Number).sort((a, b) => a - b);

// Mẫu mặc định khi trang không nhận #run: thang và ba mẫu protein (khối lượng theo UniProt)
export const SAMPLE_RUN = {
  volts: 200,
  minutes: 35,
  running: false,
  percent: 12,
  lanes: [
    { label: "M", ladder: true, bands: LADDER },
    { label: "BSA", bands: [{ kDa: 66.4, amount: 0.9 }, { kDa: 132, amount: 0.12 }] },
    { label: "IgG", bands: [{ kDa: 50, amount: 0.85 }, { kDa: 25, amount: 0.6 }] },
    { label: "Dịch chiết", bands: [{ kDa: 120, amount: 0.25 }, { kDa: 84, amount: 0.35 }, { kDa: 58, amount: 0.5 }, { kDa: 43, amount: 0.7 }, { kDa: 36, amount: 0.4 }, { kDa: 29, amount: 0.3 }, { kDa: 18, amount: 0.45 }, { kDa: 14.3, amount: 0.55 }] },
  ],
};

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

// Rf trong một bảng: nội suy theo log10(kDa); ngoài bảng ngoại suy theo độ dốc ở mép, kẹp vào [0, 1]
function rfInTable(table, kDa) {
  const pts = table.map(([m, rf]) => [Math.log10(m), rf]); // log kDa giảm dần
  const x = Math.log10(kDa);
  let i = pts.findIndex(([lx]) => lx <= x);
  if (i <= 0) i = i === 0 ? 1 : pts.length - 1; // nặng hơn băng đầu: dùng đoạn đầu; nhẹ hơn băng cuối: đoạn cuối
  const [x0, r0] = pts[i - 1];
  const [x1, r1] = pts[i];
  return clamp(r0 + ((x - x0) * (r1 - r0)) / (x1 - x0), 0, 1);
}

// Rf của protein kDa trên gel percent % (nội suy giữa hai nồng độ gần nhất của bảng)
export function rfOf(kDa, percent = 12) {
  const p = clamp(percent, PERCENTS[0], PERCENTS[PERCENTS.length - 1]);
  let j = PERCENTS.findIndex((q) => q >= p);
  if (PERCENTS[j] === p) return rfInTable(MIGRATION[p], kDa);
  const a = PERCENTS[j - 1];
  const b = PERCENTS[j];
  const t = (p - a) / (b - a);
  return rfInTable(MIGRATION[a], kDa) * (1 - t) + rfInTable(MIGRATION[b], kDa) * t;
}

// Khoảng khối lượng tách tốt [nhẹ, nặng] (kDa): Rf trong 0,12–0,9 và chưa dồn sát vạch màu; không vượt băng thang nặng nhất 250 kDa
export function rangeOf(percent = 12) {
  let lo = null;
  let hi = null;
  const [a, b, n] = [Math.log10(2), Math.log10(250), 420];
  for (let i = 0; i <= n; i++) {
    const m = 10 ** (a + ((b - a) * i) / n);
    const r = rfOf(m, percent);
    const slope = (rfOf(m * 0.97, percent) - r) / -Math.log10(0.97);
    if (r >= 0.12 && r <= 0.9 && slope > 0.12) {
      if (lo === null) lo = m;
      hi = m;
    }
  }
  return [lo, hi].map((m) => Math.round(m));
}

// Phút để vạch bromophenol blue chạm đáy gel. Manual: khoảng 35 phút ở 200 V, gel Tris-HCl 35–45 phút tuỳ % acrylamide;
// ở đây 35 phút cho gel ≤ 12 %, tăng tuyến tính tới 45 phút ở 18 % (minh hoạ), tỉ lệ nghịch điện áp
export function endMinutes(volts = 200, percent = 12) {
  const t200 = 35 + 10 * clamp((percent - 12) / 6, 0, 1);
  return (t200 * 200) / clamp(volts, PSU.vMin, CELL.vMax);
}

// Phần quãng đường (0 = đáy giếng, 1 = đáy gel) vạch màu đã đi; sau 1 thì vạch ra khỏi gel vào đệm
export function frontAt(minutes, volts = 200, percent = 12) {
  return Math.max(0, minutes) / endMinutes(volts, percent);
}

// Vị trí (0–1) của protein khi vạch màu ở front: trong gel cô mọi protein đi cùng vạch màu (dồn thành một vạch mỏng),
// qua mặt phân cách thì tách theo Rf.
export function positionOf(kDa, front, percent = 12) {
  const s = CELL.stack;
  if (front <= s) return front;
  const rf = rfOf(kDa, percent);
  const k = clamp((rf - s) / (1 - s), 0, 1);
  return s + k * (front - s);
}

// Dòng điện (mA) qua bể khi chạy gels gel ở volts: khoảng 40 mA mỗi gel ở 200 V lúc đầu, giảm tuyến tính còn một nửa
// lúc vạch màu chạm đáy (minh hoạ cho đệm Tris-glycine-SDS)
export function currentAt(minutes, volts = 200, percent = 12, gels = 2) {
  const f = clamp(frontAt(minutes, volts, percent), 0, 1.2);
  return gels * 0.2 * volts * (1 - 0.5 * Math.min(1, f));
}

// Băng của các làn sau minutes phút ở volts V trên gel percent %. samples: [{ label, ladder?, bands: [{ kDa, amount }] }].
// Trả { front, frontMm, done, end, range, lanes: [{ label, ladder, bands: [{ kDa, amount, rf, pos, mm, width, intensity, off }] }] }
// pos: phần quãng đường từ đáy giếng; mm: cùng giá trị theo mm; width: bề dày băng (mm); intensity: độ đậm 0–1 cho cả
// băng thang nhuộm sẵn trong bể và gel nhuộm Coomassie; off: băng đã chạy ra khỏi gel.
export function bandsFor(samples = SAMPLE_RUN.lanes, { percent = 12, minutes = endMinutes(200, 12), volts = 200 } = {}) {
  const front = frontAt(minutes, volts, percent);
  const spread = Math.sqrt(Math.max(0, minutes) / endMinutes(volts, percent));
  const lanes = (samples ?? []).slice(0, 10).map((lane) => ({
    label: String(lane.label ?? ""),
    ladder: !!lane.ladder,
    bands: (lane.bands ?? [])
      .filter((b) => Number(b.kDa) > 0)
      .map((b) => {
        const kDa = Number(b.kDa);
        const amount = clamp(Number(b.amount ?? 0.5), 0, 1);
        const pos = positionOf(kDa, front, percent);
        const stacked = front <= CELL.stack;
        const width = stacked ? 0.5 + 0.3 * amount : 0.7 + 1.1 * amount + 0.5 * spread;
        return { kDa, amount, rf: rfOf(kDa, percent), pos, mm: pos * CELL.run, width, intensity: clamp(0.25 + 0.75 * amount, 0, 1), off: pos > 1 };
      }),
  }));
  return { front, frontMm: front * CELL.run, done: front >= 1, end: endMinutes(volts, percent), range: rangeOf(percent), lanes };
}

// Chuẩn hoá dữ liệu #run (hợp đồng của app): thiếu trường thì lấy từ SAMPLE_RUN, tối đa 10 làn
export function normalizeRun(run) {
  const r = run && typeof run === "object" ? run : {};
  const num = (v, d, lo, hi) => (Number.isFinite(Number(v)) ? clamp(Number(v), lo, hi) : d);
  return {
    volts: num(r.volts, SAMPLE_RUN.volts, PSU.vMin, PSU.vMax),
    minutes: num(r.minutes, SAMPLE_RUN.minutes, 0, 600),
    running: !!r.running,
    percent: num(r.percent, SAMPLE_RUN.percent, 5, 18),
    lanes: Array.isArray(r.lanes) && r.lanes.length ? r.lanes.slice(0, 10) : SAMPLE_RUN.lanes,
  };
}

export const fmtNum = (v, d = 0) => v.toFixed(d).replace(".", ",");
