// Mô hình quang học của kính lúp soi nổi, gây mê CO₂ ruồi giấm và hình dáng ruồi theo kiểu gen.
// Dùng chung cho bản dựng (Node), trang hình và app. Module thuần: không DOM, không Three.js.
// Đơn vị: độ dài mm nếu không ghi khác, thời gian phút.
//
// Số liệu (máy làm mẫu: Olympus/Evident SZ61, hệ quang Greenough):
// - Trang sản phẩm SZ61 của Evident (bảng vật kính, trường nhìn với thị kính 10×):
//   https://industrial.evidentscientific.com.cn/cs/microscope/sz61/
//   · zoom 0,67×–4,5× (tỉ lệ zoom 6,7 : 1), hệ quang Greenough, ống hai mắt nghiêng 45° hoặc 60°.
//   · vật kính 1× có sẵn trong thân: NA 0,071, WD 110 mm, độ phóng đại tổng 6,7×–45×, trường Ø 32,8–4,9 mm.
//   · vật kính phụ: 0,5× (WD 200 mm), 0,75× (130 mm), 1,5× (61 mm), 2× (38 mm), cùng NA và trường trong bảng.
//   · kích thước bộ chuẩn 194 × 253 × 368 mm (rộng × sâu × cao), nặng 3,5 kg.
// - Thị kính WHSZ10X-H: 10×, số trường FN 22, ống Ø 30 mm
//   (https://www.micro-pro.com/en/for-stereo-microscopes/evident-olympus-eyepiece-whsz10x-h-esd-10x22-foc-/p,56071).
//   Trường nhìn = FN / (zoom × vật kính phụ): 22 / 0,67 = 32,8 mm, 22 / 4,5 = 4,9 mm, khớp bảng của hãng.
// - Độ sâu trường quan sát bằng mắt theo công thức Berek (Leica Microsystems, "How sharp images are formed",
//   https://leica-microsystems.com/science-lab/how-sharp-images-are-formed):
//   T = n [λ / (2 NA²) + 340 µm / (NA × M_tổng)], λ = 0,55 µm.
//   NA 0,071 là số của hãng cho vật kính 1×; giả định NA tỉ lệ với hệ số zoom và đạt 0,071 ở zoom 4,5×
//   (đúng xu hướng của kính soi nổi zoom, chưa xác minh từng mức zoom cho SZ61).
// - Tấm gây mê CO₂ Flystuff Flypad 59-114 (Genesee Scientific):
//   https://www.geneseesci.com/product/flystuff-drosophila-flypads/?sku=59-114
//   · 8,1 × 11,6 cm; mặt polyethylene xốp UHMW dày 3 mm (1/8 in) dán trên đế acrylic 12 mm (3/4 in);
//     đầu nối ống 1/8 in (3 mm) ID. Bộ đầy đủ 59-122BC: bộ chỉnh lưu lượng Flowbuddy, súng thổi 54-104, tấm 59-114.
//   · nhà bán khuyên lưu lượng 5–15 L/phút (https://www.tritechresearch.com/MINJ-DROS-FP.html).
// - Đèn LED cổ ngỗng (kiểu SCHOTT KL 300 LED): hộp 114 × 107 × 61 mm, cổ ngỗng Ø 3,5 mm dài 500 mm
//   (https://www.microscopeworld.com/complete-system-schott-kl-300-led/).
// - Gây mê CO₂:
//   · thường để ruồi trên tấm 2–3 phút, không quá 5 phút; để ≥ 10 phút thì ruồi tỉnh lâu hơn rõ rệt
//     (Kaun lab, https://www.kaunlab.com/post/how-long-can-i-anesthetize-my-flies).
//   · Shen và cộng sự 2020 (Arch. Insect Biochem. Physiol., https://flybase.org/reports/FBrf0244186.html):
//     phơi CO₂ 10–150 phút, càng lâu càng nhiều ruồi chết, con đực bị nặng hơn, hồi phục chậm hơn, giảm tuổi thọ.
//   · Bartholomew và cộng sự 2015 (https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4609961/): chỉ 5 phút CO₂ 100%
//     đã giảm khả năng leo trèo tới 24 giờ; phơi lâu hơn thì kéo dài nhiều ngày.
//   Các hệ số thời gian tỉnh và tỉ lệ chết dưới đây là ước lượng minh hoạ theo xu hướng của các nguồn trên,
//   không phải số đo của một bài báo cụ thể.
// - Hình dáng ruồi (sách giáo khoa di truyền, Bloomington Drosophila Stock Center "Learning to fly"):
//   ruồi cái dài khoảng 2,5 mm, bụng to, đầu bụng nhọn, có các sọc sẫm tách rời, có máng đẻ trứng;
//   ruồi đực nhỏ hơn (khoảng 2 mm), đầu bụng tròn và các đốt cuối sẫm liền thành một mảng,
//   có lược sinh dục (sex comb, hàng lông đen) ở đốt bàn thứ nhất của chân trước.
//   Đột biến: w mắt trắng, b thân đen, vg cánh cụt (data/fly.json).

export const STEREO = {
  model: "Olympus/Evident SZ61 (thân zoom Greenough, vật kính 1× có sẵn)",
  size: { w: 194, d: 253, h: 368 }, // mm, bộ chuẩn
  weight: 3.5, // kg
  zoom: [0.67, 4.5],
  ratio: 6.7,
  tilt: 45, // độ, ống hai mắt
  greenough: 10, // độ, góc hội tụ hai kênh (Edmund Optics, chưa xác minh trên tài liệu hãng)
};

export const EYEPIECE = { mag: 10, fn: 22 }; // WHSZ10X-H

/** Vật kính phụ của SZ61: hệ số, NA, khoảng cách làm việc (mm). 1× là vật kính có sẵn trong thân. */
export const AUX = [
  { mag: 0.5, NA: 0.036, wd: 200 },
  { mag: 0.75, NA: 0.053, wd: 130 },
  { mag: 1, NA: 0.071, wd: 110 },
  { mag: 1.5, NA: 0.1, wd: 61 },
  { mag: 2, NA: 0.142, wd: 38 },
];
export const auxOf = (mag = 1) => AUX.find((a) => a.mag === Number(mag)) ?? AUX[2];

export const PAD = { w: 81, d: 116, top: 3, base: 12, barb: 3, flow: [5, 15] }; // mm; L/phút
export const LIGHT = { box: [114, 107, 61], neck: 500, neckR: 3.5 }; // mm

export const LAMBDA = 0.55; // µm
/** Các mức zoom có khấc trên núm (vạch khắc trên núm zoom của SZ61). */
export const ZOOM_STOPS = [0.67, 0.8, 1, 1.25, 1.6, 2, 2.5, 3, 3.5, 4, 4.5];

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
/** Giới hạn zoom trong khoảng 0,67–4,5. */
export const clampZoom = (z) => clamp(Number(z) || 1, STEREO.zoom[0], STEREO.zoom[1]);

/** Độ phóng đại tổng = zoom × vật kính phụ × thị kính. */
export const totalMagnification = (zoom, aux = 1, eyepiece = EYEPIECE.mag) => clampZoom(zoom) * auxOf(aux).mag * eyepiece;

/** Đường kính trường nhìn trên mẫu (mm) = FN / (zoom × vật kính phụ). */
export const fieldOfView = (zoom, aux = 1, fn = EYEPIECE.fn) => fn / (clampZoom(zoom) * auxOf(aux).mag);

/** NA phía vật ở mức zoom này (giả định tỉ lệ với zoom, bằng NA của hãng ở zoom 4,5×). */
export const numericalAperture = (zoom, aux = 1) => (auxOf(aux).NA * clampZoom(zoom)) / STEREO.zoom[1];

/** Khoảng cách làm việc (mm) từ đáy vật kính tới mặt mẫu. */
export const workingDistance = (aux = 1) => auxOf(aux).wd;

/**
 * Độ sâu trường quan sát bằng mắt (mm), công thức Berek: λ/(2 NA²) + 340 µm/(NA · M).
 * @param {number} zoom hệ số zoom 0,67–4,5
 * @param {number} [aux] vật kính phụ (0,5; 0,75; 1; 1,5; 2)
 */
export function depthOfField(zoom, aux = 1) {
  const NA = numericalAperture(zoom, aux);
  const M = totalMagnification(zoom, aux);
  return (LAMBDA / (2 * NA * NA) + 340 / (NA * M)) / 1000;
}

/** Độ phân giải Rayleigh trên mẫu (µm) = 0,61 λ / NA. */
export const resolution = (zoom, aux = 1) => (0.61 * LAMBDA) / numericalAperture(zoom, aux);

/**
 * Ảnh qua thị kính với zoom và độ lệch nét.
 * @param {{zoom?:number, aux?:number, defocus?:number}} s defocus: mm, dương = đầu kính cao hơn vị trí nét
 * @returns {{zoom:number, total:number, fov:number, NA:number, dof:number, blur:number, sharpness:number, label:string}}
 *   fov, dof mm; blur: bán kính vết mờ trên mẫu (mm); sharpness 0–1.
 */
export function viewState({ zoom = 1, aux = 1, defocus = 0 } = {}) {
  const z = clampZoom(zoom);
  const NA = numericalAperture(z, aux);
  const dof = depthOfField(z, aux);
  const out = Math.max(0, Math.abs(defocus) - dof / 2);
  const blur = Math.hypot(resolution(z, aux) / 2000, out * Math.tan(Math.asin(NA)));
  const sharpness = 1 / (1 + (Math.abs(defocus) / dof) ** 2);
  const label = Math.abs(defocus) <= dof / 2 ? "nét" : Math.abs(defocus) <= dof * 2 ? "hơi mờ" : "mờ";
  return { zoom: z, total: totalMagnification(z, aux), fov: fieldOfView(z, aux), NA, dof, blur, sharpness, label };
}

// ——— Gây mê CO₂ ———
export const CO2 = {
  advised: [2, 3], // phút nên để trên tấm
  max: 5, // phút, không nên vượt
  wakeBase: 1.0, // phút để ruồi bắt đầu cử động sau khi rời CO₂ (ước lượng minh hoạ)
  wakePerMin: 0.06, // phút thêm cho mỗi phút đã phơi CO₂ (ước lượng minh hoạ)
  deathFrom: 15, // phút: dưới mức này coi như không chết vì CO₂ (minh hoạ)
  deathMax: 0.35, // tỉ lệ chết tiệm cận của con cái khi phơi rất lâu (minh hoạ)
  deathTau: 120, // phút
  maleFactor: 1.5, // con đực nhạy hơn (Shen 2020: đực bị ảnh hưởng nhiều hơn)
};

/** Thời gian (phút) từ lúc tắt CO₂ tới lúc ruồi bắt đầu bò, theo tổng thời gian đã phơi CO₂ (phút). */
export const wakeTime = (exposure) => CO2.wakeBase + CO2.wakePerMin * Math.max(0, exposure);

/**
 * Xác suất ruồi chết vì phơi CO₂ quá lâu (minh hoạ, theo xu hướng của Shen 2020).
 * @param {number} exposure phút
 * @param {"M"|"F"} sex
 */
export function co2Mortality(exposure, sex = "F") {
  const t = Math.max(0, exposure - CO2.deathFrom);
  const p = CO2.deathMax * (1 - Math.exp(-t / CO2.deathTau)) * (sex === "M" ? CO2.maleFactor : 1);
  return Math.min(0.95, p);
}

/** Lời khuyên sau khi gây mê, theo tổng thời gian phơi (phút). */
export function co2Advice(exposure) {
  if (exposure <= CO2.max) return { level: "ok", text: "Thời gian gây mê an toàn; cho ruồi hồi phục trong lọ mới trước khi làm thí nghiệm hành vi." };
  if (exposure <= 30) return { level: "warn", text: "Gây mê quá 5 phút: ruồi tỉnh chậm, khả năng leo trèo giảm tới khoảng 24 giờ." };
  return { level: "bad", text: "Gây mê quá lâu: một phần ruồi chết (con đực nhiều hơn), ruồi còn sống cần ít nhất 48 giờ hồi phục." };
}

// ——— Ruồi giấm ———
/** Số đo minh hoạ của ruồi trưởng thành (mm). */
export const FLY = { lengthF: 2.5, lengthM: 2.0, width: 0.9 };

/** Chuẩn hoá một ruồi: { sex: "M"|"F", white, black, vestigial }. */
export const normalizeFly = (f = {}) => ({
  sex: String(f.sex ?? "F").toUpperCase().startsWith("M") || f.sex === "♂" ? "M" : "F",
  white: Boolean(f.white),
  black: Boolean(f.black),
  vestigial: Boolean(f.vestigial),
});

/**
 * Mô tả hình dáng ruồi theo kiểu hình (để vẽ và để hiện chữ).
 * @param {{sex?:string, white?:boolean, black?:boolean, vestigial?:boolean}} fly
 * @returns {{sex:"M"|"F", length:number, sexLabel:string, eye:string, body:string, wing:string, abdomen:string, sexComb:boolean, label:string}}
 */
export function flyLook(fly) {
  const f = normalizeFly(fly);
  const male = f.sex === "M";
  const eye = f.white ? "mắt trắng" : "mắt đỏ";
  const body = f.black ? "thân đen" : "thân xám";
  const wing = f.vestigial ? "cánh cụt" : "cánh dài";
  return {
    sex: f.sex,
    length: male ? FLY.lengthM : FLY.lengthF,
    sexLabel: male ? "đực" : "cái",
    eye,
    body,
    wing,
    abdomen: male ? "đầu bụng tròn, các đốt cuối sẫm liền" : "đầu bụng nhọn, sọc sẫm tách rời",
    sexComb: male,
    label: `${male ? "♂" : "♀"} ${eye}, ${body}, ${wing}`,
  };
}

const n2 = (v) => Math.round(v * 100) / 100;
/**
 * Hình ruồi nhìn từ trên xuống, đầu hướng lên trên, dạng chuỗi SVG (không cần DOM).
 * Khung 3 × 3 mm: viewBox -50..50, 1 đơn vị = 0,03 mm; ruồi cái dài 2,5 mm, ruồi đực 2 mm.
 * Màu là biến CSS có giá trị mặc định, trang có thể đổi bằng --fly-*.
 * @param {{sex?:string, white?:boolean, black?:boolean, vestigial?:boolean}} fly
 * @param {number} [size] cạnh hình vuông (px)
 * @param {{asleep?:boolean, step?:number, id?:string}} [opt] asleep: chân co lại (đang mê); step: pha bước chân 0–1
 * @returns {string} `<svg …>…</svg>`
 */
export function flySvg(fly, size = 48, { asleep = false, step = 0 } = {}) {
  const f = normalizeFly(fly);
  const male = f.sex === "M";
  const k = (male ? FLY.lengthM : FLY.lengthF) / FLY.lengthF; // tỉ lệ so với ruồi cái
  const c = {
    eye: f.white ? "var(--fly-eye-white, #f4efe4)" : "var(--fly-eye-red, #c3262c)",
    eyeRim: f.white ? "var(--fly-eye-white-rim, #b9b2a3)" : "var(--fly-eye-red-rim, #7d1418)",
    body: f.black ? "var(--fly-body-black, #2a2522)" : "var(--fly-body, #b48a55)",
    thorax: f.black ? "var(--fly-thorax-black, #221d1a)" : "var(--fly-thorax, #9a7343)",
    band: f.black ? "var(--fly-band-black, #0e0c0b)" : "var(--fly-band, #4a3320)",
    leg: f.black ? "var(--fly-leg-black, #1d1917)" : "var(--fly-leg, #6e5232)",
    wing: "var(--fly-wing, rgba(190, 200, 210, 0.42))",
    vein: "var(--fly-vein, rgba(90, 80, 70, 0.55))",
    comb: "var(--fly-comb, #0a0a0a)",
  };
  const s = (v) => n2(v * k);
  const parts = [];
  // Chân: ba đôi, đang mê thì co sát thân, đang bò thì duỗi theo pha bước
  const legs = [
    [-12, -6, -26, -22],
    [-13, 2, -30, 4],
    [-12, 9, -27, 28],
  ];
  legs.forEach(([x0, y0, x1, y1], i) => {
    const swing = asleep ? 0 : Math.sin((step + i / 3) * Math.PI * 2) * 4;
    const fold = asleep ? 0.55 : 1;
    for (const side of [-1, 1]) {
      const ph = side * (i % 2 === 0 ? 1 : -1);
      const xm = x0 + (x1 - x0) * 0.55 * fold;
      const ym = y0 + (y1 - y0) * 0.5 * fold + swing * ph * 0.5;
      const xe = x0 + (x1 - x0) * fold;
      const ye = y0 + (y1 - y0) * fold + swing * ph;
      parts.push(`<path d="M${s(-x0 * side)} ${s(y0)}L${s(-xm * side)} ${s(ym)}L${s(-xe * side)} ${s(ye)}" fill="none" stroke="${c.leg}" stroke-width="${s(1.6)}" stroke-linecap="round" stroke-linejoin="round"/>`);
      // Lược sinh dục: chấm đen ở đốt bàn thứ nhất của chân trước (chỉ con đực)
      if (male && i === 0) parts.push(`<ellipse cx="${s(-xm * side)}" cy="${s(ym)}" rx="${s(2.2)}" ry="${s(1.4)}" fill="${c.comb}"/>`);
    }
  });
  // Bụng: cái dài, đầu nhọn, sọc tách rời; đực ngắn, tròn, các đốt cuối sẫm liền
  const ab = male ? { cy: 18, rx: 12, ry: 15 } : { cy: 22, rx: 14, ry: 20 };
  const abPath = male
    ? `M${s(-ab.rx)} ${s(ab.cy - 6)}C${s(-ab.rx)} ${s(ab.cy - ab.ry - 2)} ${s(ab.rx)} ${s(ab.cy - ab.ry - 2)} ${s(ab.rx)} ${s(ab.cy - 6)}C${s(ab.rx)} ${s(ab.cy + ab.ry * 0.9)} ${s(-ab.rx)} ${s(ab.cy + ab.ry * 0.9)} ${s(-ab.rx)} ${s(ab.cy - 6)}Z`
    : `M${s(-ab.rx)} ${s(ab.cy - 8)}C${s(-ab.rx)} ${s(ab.cy - ab.ry - 2)} ${s(ab.rx)} ${s(ab.cy - ab.ry - 2)} ${s(ab.rx)} ${s(ab.cy - 8)}C${s(ab.rx)} ${s(ab.cy + 8)} ${s(4)} ${s(ab.cy + ab.ry - 2)} 0 ${s(ab.cy + ab.ry + 2)}C${s(-4)} ${s(ab.cy + ab.ry - 2)} ${s(-ab.rx)} ${s(ab.cy + 8)} ${s(-ab.rx)} ${s(ab.cy - 8)}Z`;
  const clipId = `fa${male ? "m" : "f"}${f.black ? "b" : ""}`;
  parts.push(`<clipPath id="${clipId}"><path d="${abPath}"/></clipPath>`);
  parts.push(`<path d="${abPath}" fill="${c.body}"/>`);
  const bands = [];
  if (male) {
    for (const y of [ab.cy - 8, ab.cy - 2]) bands.push(`<rect x="${s(-ab.rx)}" y="${s(y)}" width="${s(ab.rx * 2)}" height="${s(2.6)}" fill="${c.band}"/>`);
    bands.push(`<rect x="${s(-ab.rx)}" y="${s(ab.cy + 3)}" width="${s(ab.rx * 2)}" height="${s(ab.ry)}" fill="${c.band}"/>`);
  } else {
    for (let i = 0; i < 5; i++) bands.push(`<rect x="${s(-ab.rx)}" y="${s(ab.cy - 12 + i * 6.4)}" width="${s(ab.rx * 2)}" height="${s(2.4)}" fill="${c.band}"/>`);
  }
  parts.push(`<g clip-path="url(#${clipId})">${bands.join("")}</g>`);
  // Cánh: hai cánh dài trong suốt có gân, hoặc hai mẩu cánh cụt nhăn
  if (f.vestigial) {
    for (const side of [-1, 1]) parts.push(`<path d="M${s(6 * side)} ${s(-2)}Q${s(15 * side)} ${s(0)} ${s(12 * side)} ${s(8)}Q${s(9 * side)} ${s(5)} ${s(5 * side)} ${s(4)}Z" fill="${c.wing}" stroke="${c.vein}" stroke-width="${s(0.8)}"/>`);
  } else {
    for (const side of [-1, 1]) {
      const a = side > 0 ? 14 : -14;
      parts.push(`<g transform="rotate(${a} ${s(4 * side)} ${s(-2)})"><ellipse cx="${s(4 * side)}" cy="${s(22)}" rx="${s(9)}" ry="${s(25)}" fill="${c.wing}" stroke="${c.vein}" stroke-width="${s(0.7)}"/><path d="M${s(4 * side)} ${s(-1)}L${s(4 * side)} ${s(44)}M${s(4 * side)} ${s(6)}L${s(10 * side)} ${s(40)}M${s(4 * side)} ${s(8)}L${s(-1 * side)} ${s(38)}" fill="none" stroke="${c.vein}" stroke-width="${s(0.6)}"/></g>`);
    }
  }
  // Ngực, đầu, mắt kép, râu
  parts.push(`<ellipse cx="0" cy="${s(-4)}" rx="${s(12)}" ry="${s(13)}" fill="${c.thorax}"/>`);
  parts.push(`<path d="M${s(-6)} ${s(-12)}Q0 ${s(-15)} ${s(6)} ${s(-12)}" fill="none" stroke="${c.band}" stroke-width="${s(0.7)}" opacity="0.6"/>`);
  parts.push(`<ellipse cx="0" cy="${s(-22)}" rx="${s(11)}" ry="${s(7)}" fill="${c.body}"/>`);
  for (const side of [-1, 1]) parts.push(`<ellipse cx="${s(8 * side)}" cy="${s(-22)}" rx="${s(5.2)}" ry="${s(6.6)}" fill="${c.eye}" stroke="${c.eyeRim}" stroke-width="${s(0.8)}"/>`);
  parts.push(`<path d="M${s(-2.5)} ${s(-28)}L${s(-4)} ${s(-32)}M${s(2.5)} ${s(-28)}L${s(4)} ${s(-32)}" stroke="${c.leg}" stroke-width="${s(1.4)}" stroke-linecap="round"/>`);
  const px = n2(size);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-50 -50 100 100" width="${px}" height="${px}" overflow="visible">${parts.join("")}</svg>`;
}

/** Ruồi mặc định trên tấm khi không có dữ liệu người dùng: F1 của phép lai hai cặp tính trạng và vài đột biến. */
export const DEFAULT_FLIES = [
  { sex: "F", white: false, black: false, vestigial: false },
  { sex: "M", white: false, black: false, vestigial: false },
  { sex: "M", white: true, black: false, vestigial: false },
  { sex: "F", white: false, black: true, vestigial: true },
  { sex: "M", white: false, black: true, vestigial: true },
  { sex: "F", white: false, black: false, vestigial: false },
  { sex: "M", white: true, black: false, vestigial: false },
  { sex: "F", white: false, black: true, vestigial: false },
  { sex: "M", white: false, black: false, vestigial: true },
  { sex: "F", white: true, black: false, vestigial: false },
];

/** Bộ sinh số ngẫu nhiên có hạt giống (mulberry32), để bố trí ruồi lặp lại được. */
export function rng(seed = 1) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Rải ruồi lên tấm CO₂ (toạ độ mm, gốc ở tâm tấm, u dọc cạnh 116 mm, v dọc cạnh 81 mm).
 * Ruồi đầu tiên nằm giữa trường nhìn; ruồi chết theo co2Mortality với hạt giống cố định.
 * @param {object[]} flies danh sách { sex, white, black, vestigial }
 * @param {{seed?:number, co2Minutes?:number, spread?:number}} [opt]
 */
export function scatterFlies(flies, { seed = 7, co2Minutes = 0, spread = 16 } = {}) {
  const r = rng(seed);
  return flies.map((fly, i) => {
    const f = normalizeFly(fly);
    const a = r() * Math.PI * 2;
    const d = i === 0 ? 0 : spread * Math.sqrt(r()) + 2;
    return {
      ...f,
      id: i,
      u: d * Math.cos(a),
      v: d * Math.sin(a) * 0.8,
      heading: r() * 360,
      dead: r() < co2Mortality(co2Minutes, f.sex),
      wakeJitter: 0.8 + 0.4 * r(),
      pile: null,
    };
  });
}
