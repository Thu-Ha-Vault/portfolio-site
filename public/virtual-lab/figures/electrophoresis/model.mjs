// Mô hình điện di DNA trên gel agarose 1 %, dùng chung cho bản dựng và trang.
// Số liệu:
// - Bio-Rad Mini-Sub Cell GT (manual 10016027 Rev C, bảng 2.3): bromophenol blue chạy khoảng 4,5 cm/h
//   ở 75 V (gel 7 × 10 cm, 1 %, dày 0,5 cm, TAE). Tốc độ coi như tỉ lệ thuận với điện áp. Bể chịu tối đa 150 V.
// - Bảng 2.4 cùng manual: trên gel 0,5–1,5 %, xylene cyanol chạy cùng đoạn khoảng 4–5 kb, bromophenol blue cùng
//   đoạn khoảng 400–500 bp. Quãng đường tỉ lệ nghịch với log(kích thước) (JoVE, Lee và cộng sự 2012).
// - Addgene: dừng khi vạch màu đi được 75–80 % chiều dài gel.
// - Thang GeneRuler 1 kb (Thermo SM0311): 14 vạch, vạch đậm 6000, 3000, 1000 bp.
// - Mẫu theo bài thực hành Sinh học phân tử của chủ dự án: plasmid pGEM (khoảng 3 kb) chưa cắt và đã cắt,
//   PCR 1,25 kb, multiplex PCR 1,25 kb + 500 bp (kèm một băng mờ khoảng 3 kb do mồi bắt cặp không đặc hiệu).
//   Dạng siêu xoắn và vòng hở của plasmid không chạy đúng theo kích thước; ở đây gán kích thước biểu kiến gần đúng.

export const GEL = {
  speed: 4.5, // cm/h của bromophenol blue ở 75 V
  speedAt: 75,
  vMin: 50,
  vMax: 150,
  length: 9, // cm từ giếng tới mép gel phía cực dương
  stop: 0.8,
  L0: 4.577, // hiệu chỉnh để 10 kb đi khoảng 30 % quãng đường của bromophenol blue
  bpb: 450,
  xc: 4500,
};

export const LADDER = [10000, 8000, 6000, 5000, 4000, 3500, 3000, 2500, 2000, 1500, 1000, 750, 500, 250];
const BOLD = new Set([6000, 3000, 1000]);

// [tên, các băng { bp, đậm 0–1 }]
export const LANES = [
  ["L", LADDER.map((bp) => ({ bp, w: BOLD.has(bp) ? 1 : 0.55 }))],
  ["P", [{ bp: 2000, w: 0.9, note: "siêu xoắn" }, { bp: 6000, w: 0.45, note: "vòng hở" }]],
  ["RE", [{ bp: 3015, w: 0.9, note: "dạng thẳng" }]],
  ["S−", []],
  ["S+", [{ bp: 1250, w: 1 }]],
  ["M−", []],
  ["M+", [{ bp: 3000, w: 0.25 }, { bp: 1250, w: 0.9 }, { bp: 500, w: 0.75 }]],
  ["L", LADDER.map((bp) => ({ bp, w: BOLD.has(bp) ? 1 : 0.55 }))],
];

// Quãng đường (cm) bromophenol blue đã chạy sau vh vôn·giờ.
export const bpbAfter = (vh, g = GEL) => (g.speed / g.speedAt) * vh;

// Quãng đường (cm) của một đoạn DNA bp khi bromophenol blue đã chạy dBpb cm.
export function distanceOf(bp, dBpb, g = GEL) {
  const k = (g.L0 - Math.log10(bp)) / (g.L0 - Math.log10(g.bpb));
  return Math.max(0, dBpb * k);
}

export const endVh = (g = GEL) => (g.length * g.stop) / (g.speed / g.speedAt);
export const minutesAt = (vh, V) => (vh / V) * 60;

export const fmtCm = (cm) => `${cm.toFixed(1).replace(".", ",")} cm`;
