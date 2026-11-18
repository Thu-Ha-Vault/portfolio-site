// Mô hình máy đo nồng độ acid nucleic thể tích nhỏ (kiểu NanoDrop), dùng chung cho bản dựng (build.mjs),
// trang (live.js) và sau này cho lõi mô phỏng của app (src/core). Module thuần: không DOM, không Three.js.
//
// Máy vẽ theo hình dáng Thermo Scientific NanoDrop One (ND-ONE-W). Số liệu của máy lấy từ tờ thông số
// "NanoDrop One Microvolume UV-Vis Spectrophotometers – Product Specifications" (PS52754_E 0220,
// https://assets.thermofisher.com/TFS-Assets/CAD/Specification-Sheets/NanoDrop-One-Specifications.pdf):
//   - Thể tích mẫu tối thiểu 1 µL, đo trên bệ (pedestal), không cần cuvet.
//   - Giới hạn phát hiện dsDNA trên bệ 2,0 ng/µL; nồng độ tối đa 27 500 ng/µL (dsDNA).
//   - Dải quang học (quy về quang lộ 10 mm) trên bệ 0–550 A. Độ đúng 3 % ở 0,97 A, 302 nm.
//   - Độ lặp lại điển hình: 0,002 A (quang lộ 1,0 mm) hoặc 1 % CV, lấy giá trị lớn hơn.
//   - Bước sóng 190–850 nm, độ đúng ±1 nm, độ phân giải ≤ 1,8 nm (FWHM ở vạch Hg 254 nm).
//   - Quang lộ 0,030–1,0 mm, tự chọn (auto-ranging). Nguồn sáng đèn chớp xenon.
//   - Đầu thu: cảm biến ảnh tuyến tính CMOS 2048 điểm. Thời gian đo và xử lý 8 giây.
//   - Máy 20 × 25,4 × 32,3 cm (rộng × sâu × cao), 3,6 kg, 12 V một chiều, 12–18 W khi đo.
//   - Màn hình cảm ứng 7 inch 1280 × 800, chạy Android.
// Phát hiện chất nhiễm (Acclaro) theo "NanoDrop One/OneC FAQs" (FL52778): protein, phenol,
// guanidine HCl và guanidine isothiocyanate; có cảm biến và phân tích ảnh theo dõi cột mẫu để phát hiện bọt khí.
//
// Hoá học của phép đo:
//   - c = A260 (quy về 10 mm) × hệ số: dsDNA 50, ssDNA 33, RNA 40 ng·cm/µL (Thermo Fisher, NanoDrop 2000c FAQs,
//     https://www.thermofisher.com/order/catalog/product/ND-2000C/faqs). Máy báo độ hấp thụ quy về quang lộ 10 mm.
//   - Tỉ số 260/280: khoảng 1,8 là DNA "sạch", khoảng 2,0 là RNA "sạch"; thấp hơn rõ rệt gợi ý protein, phenol.
//     Dung dịch acid làm tỉ số thấp đi 0,2–0,3, dung dịch kiềm làm cao lên 0,2–0,3.
//     Tỉ số 260/230 của acid nucleic sạch thường 2,0–2,2; thấp hơn gợi ý chất hấp thụ ở 230 nm: EDTA,
//     carbohydrate, phenol, guanidine HCl. TRIzol (phenol) hấp thụ ở 230 nm và khoảng 270 nm.
//     Phổ mẫu: đường nền hiệu chỉnh ở 340 nm.
//     Nguồn: Thermo Scientific T042 Technical Bulletin "260/280 and 260/230 Ratios" (Rev 3/09,
//     bản lưu tại https://agtc.umd.edu/files/Note-on-the-260_280-and-260_230-Ratios.pdf).
//   - Protein chuẩn BSA: A280 của dung dịch 1 mg/mL (10 mm) là 0,667 (E1% = 6,67, hệ số mặc định của NanoDrop
//     cho BSA). Tỉ số 260/280 của protein khoảng 0,57 (Glasel 1995, BioTechniques 18:62).
//   - Phenol trong nước: cực đại 270 nm, ε ≈ 1,45 mM⁻¹·cm⁻¹ (giá trị thường dùng, chưa xác minh với nguồn gốc).
//
// Phần minh hoạ, chưa xác minh (ghi rõ để người dùng không nhầm là số đo thật):
//   - Dáng phổ: mỗi chất là tổng các hàm Gauss hoặc hàm mũ, chọn sao cho đúng các tỉ số ở trên; độ rộng dải là ước lượng.
//   - Guanidine HCl và EDTA đo bằng "A230 góp vào" (10 mm), không đổi ra mM vì chưa có hệ số hấp thụ có nguồn.
//   - Ngưỡng đổi quang lộ (A thô ≤ 1,5 ở 260 nm) và dãy quang lộ 1,0 · 0,2 · 0,1 · 0,05 · 0,03 mm.
//     Với 0,03 mm: 550 A (10 mm) ứng với 1,65 A thô, khớp với dải 0–550 A và 27 500 = 550 × 50 của hãng.

/** Thông số máy (đơn vị ghi ở từng trường). */
export const SPEC = {
  model: "NanoDrop One",
  minVolume: 1, // µL
  volume: [1, 2], // µL, thể tích khuyên dùng
  paths: [1.0, 0.2, 0.1, 0.05, 0.03], // mm, các quang lộ máy tự chọn (dãy minh hoạ trong khoảng 0,030–1,0 mm)
  maxRaw: 1.5, // A thô tối đa trước khi chuyển sang quang lộ ngắn hơn (minh hoạ)
  range: [190, 850], // nm
  view: [220, 350], // nm, khoảng phổ hiển thị cho acid nucleic
  baseline: 340, // nm, bước sóng hiệu chỉnh đường nền
  wlAccuracy: 1, // nm
  bandwidth: 1.8, // nm FWHM
  maxA10: 550, // A quy về 10 mm, trên bệ
  repeatA: 0.002, // A ở quang lộ 1,0 mm
  repeatCV: 0.01, // 1 % CV
  accuracy: 0.03, // 3 % ở 0,97 A
  lod: { dsDNA: 2.0 }, // ng/µL trên bệ
  maxConc: { dsDNA: 27500 }, // ng/µL
  seconds: 8, // thời gian đo và xử lý
  size: [200, 254, 323], // mm rộng × sâu × cao
  mass: 3.6, // kg
  power: [12, 18], // W khi đo
  detector: 2048, // điểm ảnh CMOS
  screen: { inch: 7, px: [1280, 800] },
};

/** Hệ số đổi A260 (10 mm) ra ng/µL. */
export const FACTOR = { dsDNA: 50, ssDNA: 33, RNA: 40 };

/** Tên hiển thị của loại mẫu. */
export const TYPE_NAME = { dsDNA: "dsDNA", ssDNA: "ssDNA", RNA: "RNA" };

/**
 * Tỉ số của acid nucleic sạch trong dung dịch đệm hơi kiềm (TE pH 8).
 * dsDNA và RNA theo T042 (~1,8 và ~2,0; 260/230 trong 2,0–2,2); ssDNA là ước lượng (thay đổi theo trình tự).
 */
export const PURE = {
  dsDNA: { r280: 1.85, r230: 2.2 },
  RNA: { r280: 2.05, r230: 2.2 },
  ssDNA: { r280: 1.8, r230: 2.1 },
};

/** Độ hấp thụ (10 mm) của 1 mg/mL BSA ở 280 nm. */
export const BSA_A280 = 0.667;
/** Phenol: A270 (10 mm) của dung dịch 1 mM. */
export const PHENOL_A270 = 1.45;

/** Dung dịch đệm: độ hấp thụ riêng (10 mm) và pH, dùng cho mẫu và mẫu trắng (minh hoạ). */
export const BUFFERS = {
  water: { name: "nước", a230: 0, pH: 6.0 },
  TE: { name: "TE", a230: 0.0045, pH: 8.0 }, // EDTA 1 mM: 1/100 của phổ EDTA 0,1 M trong T042 (Hình 2)
  EB: { name: "EB (Tris 10 mM)", a230: 0.002, pH: 8.5 },
};

const gauss = (x, c, s) => Math.exp(-((x - c) ** 2) / (2 * s * s));

/**
 * Tạo hàm dáng phổ acid nucleic: 1 ở 260 nm, đáy ở 230 nm, đúng hai tỉ số cho trước.
 * Dải chính là hàm Gauss quanh 259 nm; phần dâng ở bước sóng ngắn là hàm Gauss quanh 200 nm,
 * độ rộng chọn để đạo hàm bằng 0 ở 230 nm (đáy phổ).
 * @param {number} r280 tỉ số 260/280 mong muốn
 * @param {number} r230 tỉ số 260/230 mong muốn
 * @returns {(nm: number) => number}
 */
export function nucleicShape(r280, r230) {
  const c = 259;
  // Chọn σ dải chính để G(280)/G(260) = 1/r280.
  const g = (s) => gauss(280, c, s) / gauss(260, c, s) - 1 / r280;
  let lo = 5;
  let hi = 60;
  for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; if (g(m) > 0) hi = m; else lo = m; }
  const s1 = (lo + hi) / 2;
  const norm = gauss(260, c, s1);
  const main = (x) => gauss(x, c, s1) / norm;
  const need = 1 / r230 - main(230); // phần dâng cần có ở 230 nm
  const slope = (main(230) * (c - 230)) / (s1 * s1); // dG/dλ của dải chính ở 230 nm
  const s2 = Math.sqrt(Math.max(1, (need * 30) / Math.max(1e-6, slope)));
  const a2 = need / gauss(230, 200, s2);
  return (x) => main(x) + a2 * gauss(x, 200, s2);
}

/**
 * Dáng phổ protein (chuẩn BSA), 1 ở 280 nm: dải tyrosine/tryptophan quanh 279 nm và dải liên kết peptide
 * dâng mạnh ở bước sóng ngắn (A230/A280 ≈ 2, minh hoạ). Tỉ số 260/280 của dáng này ≈ 0,6.
 * @param {number} nm
 */
export function proteinShape(nm) {
  const band = gauss(nm, 279, 16.9) / gauss(280, 279, 16.9);
  return band + 1.98 * Math.exp(-(nm - 230) / 8);
}

/** Dáng phổ phenol, 1 ở 270 nm, thêm phần dải 210 nm dâng lên ở 220–235 nm (minh hoạ). */
export function phenolShape(nm) {
  return gauss(nm, 270, 7) + 2.5 * gauss(nm, 210, 10);
}

/** Dáng phổ guanidine HCl và EDTA: dâng mạnh dưới 240 nm, bằng 1 ở 230 nm (minh hoạ theo T042 Hình 2, 4). */
export function shortUvShape(nm) {
  return Math.exp(-(nm - 230) / 9);
}

const SHAPES = new Map();
function shapeOf(type, pH) {
  const pure = PURE[type] ?? PURE.dsDNA;
  // Dung dịch acid làm 260/280 thấp đi tới 0,25 (T042: 0,2–0,3); kiềm nhẹ (pH ≥ 7,5) là chuẩn.
  const r280 = pure.r280 - 0.25 * Math.min(1, Math.max(0, (7.5 - pH) / 1.5));
  const key = `${type}:${r280.toFixed(3)}`;
  if (!SHAPES.has(key)) SHAPES.set(key, nucleicShape(r280, pure.r230));
  return SHAPES.get(key);
}

/**
 * Mẫu thật trong ống (trước khi đo). Mọi trường đều tuỳ chọn trừ type, conc.
 * @typedef {object} Sample
 * @property {"dsDNA"|"ssDNA"|"RNA"} type loại acid nucleic
 * @property {number} conc nồng độ thật, ng/µL
 * @property {number} [protein] protein (quy về BSA), mg/mL
 * @property {number} [phenol] phenol, mM
 * @property {number} [guanidine] guanidine HCl, tính bằng A230 góp vào (10 mm)
 * @property {number} [carbohydrate] carbohydrate, tính bằng A230 góp vào (10 mm)
 * @property {keyof BUFFERS} [buffer] dung dịch đệm của mẫu (mặc định TE)
 * @property {number} [volume] thể tích nhỏ lên bệ, µL (mặc định 1,5)
 * @property {boolean} [bubble] có bọt khí trong cột mẫu
 */

/**
 * Độ hấp thụ thật (quy về 10 mm) của mẫu ở một bước sóng, gồm cả dung dịch đệm của nó.
 * @param {Sample} sample
 * @param {number} nm
 */
export function trueAbsorbance(sample, nm) {
  const buffer = BUFFERS[sample.buffer ?? "TE"] ?? BUFFERS.TE;
  const factor = FACTOR[sample.type] ?? FACTOR.dsDNA;
  const a260 = (sample.conc ?? 0) / factor;
  const nucleic = a260 * shapeOf(sample.type, buffer.pH)(nm);
  const protein = (sample.protein ?? 0) * BSA_A280 * proteinShape(nm);
  const phenol = (sample.phenol ?? 0) * PHENOL_A270 * phenolShape(nm);
  const uv = ((sample.guanidine ?? 0) + (sample.carbohydrate ?? 0) + buffer.a230) * shortUvShape(nm);
  return nucleic + protein + phenol + uv;
}

/** Độ hấp thụ (10 mm) của mẫu trắng làm bằng một dung dịch đệm. */
export function blankAbsorbance(bufferKey, nm) {
  const buffer = BUFFERS[bufferKey] ?? BUFFERS.water;
  return buffer.a230 * shortUvShape(nm);
}

/**
 * Quang lộ máy tự chọn: quang lộ dài nhất mà A thô ở 260 nm không vượt ngưỡng.
 * @param {number} a260 độ hấp thụ quy về 10 mm
 * @returns {number} mm
 */
export function pathFor(a260) {
  for (const mm of SPEC.paths) if ((a260 * mm) / 10 <= SPEC.maxRaw) return mm;
  return SPEC.paths[SPEC.paths.length - 1];
}

/** Bộ sinh số ngẫu nhiên có hạt giống (mulberry32), để chạy lại cho cùng kết quả. */
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
function normal(rand) {
  const u = Math.max(1e-12, rand());
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * rand());
}

/** Các bước sóng của phổ hiển thị (220–350 nm, bước 1 nm). */
export const WAVELENGTHS = Array.from({ length: SPEC.view[1] - SPEC.view[0] + 1 }, (_, i) => SPEC.view[0] + i);

/**
 * Kết quả một lần đo.
 * @typedef {object} Reading
 * @property {boolean} ok đo được hay không
 * @property {string} [error] mã lỗi: "no-sample" | "no-column" | "bubble" | "no-blank"
 * @property {string} [message] lời nhắn tiếng Việt cho người dùng
 * @property {"dsDNA"|"ssDNA"|"RNA"} type
 * @property {number} path quang lộ đã dùng, mm
 * @property {number[]} wl bước sóng, nm
 * @property {number[]} abs độ hấp thụ quy về 10 mm, đã trừ mẫu trắng và hiệu chỉnh nền 340 nm
 * @property {number} a260 @property {number} a280 @property {number} a230
 * @property {number} conc ng/µL (A260 × hệ số)
 * @property {number} r280 tỉ số 260/280 @property {number} r230 tỉ số 260/230
 * @property {"ok"|"low"|"high"} range dưới giới hạn phát hiện, trong dải, hay vượt dải
 * @property {string[]} flags cảnh báo về độ sạch (tiếng Việt)
 */

/**
 * Đo một mẫu trên bệ như máy thật: chọn quang lộ, trừ mẫu trắng, cộng sai số theo thông số của hãng,
 * hiệu chỉnh nền ở 340 nm, quy về 10 mm, tính nồng độ và hai tỉ số.
 * @param {Sample|null} sample mẫu trên bệ (null hoặc volume 0: không có mẫu)
 * @param {object} [options]
 * @param {keyof BUFFERS|null} [options.blank] dung dịch đã dùng làm mẫu trắng (null: chưa đo mẫu trắng)
 * @param {number} [options.seed] hạt giống ngẫu nhiên
 * @param {number} [options.shift] lệch bước sóng của máy, nm (trong ±1 nm theo hãng)
 * @param {boolean} [options.noise] có cộng sai số không (mặc định có)
 * @returns {Reading}
 */
export function measure(sample, { blank = "TE", seed = 1, shift = 0, noise = true } = {}) {
  const type = sample?.type ?? "dsDNA";
  const fail = (error, message) => ({ ok: false, error, message, type, path: 0, wl: WAVELENGTHS, abs: [], a260: 0, a280: 0, a230: 0, conc: 0, r280: 0, r230: 0, range: "ok", flags: [] });
  if (blank == null) return fail("no-blank", "Chưa đo mẫu trắng: nhỏ dung dịch đệm và đo blank trước.");
  const volume = sample ? sample.volume ?? 1.5 : 0;
  if (!sample || volume <= 0) return fail("no-sample", "Không có mẫu trên bệ đo: không hình thành cột chất lỏng.");
  if (volume < SPEC.minVolume) return fail("no-column", `Cột mẫu bị đứt: ${String(volume).replace(".", ",")} µL ít hơn 1 µL tối thiểu.`);
  if (sample.bubble) return fail("bubble", "Có bọt khí trong cột mẫu: lau bệ và nhỏ lại mẫu.");
  const rand = rng(seed);
  const net = (nm) => trueAbsorbance(sample, nm + shift) - blankAbsorbance(blank, nm + shift);
  const path = pathFor(net(260));
  const toRaw = path / 10;
  const scale = noise ? 1 + SPEC.repeatCV * normal(rand) : 1;
  // Nhiễu mỗi điểm 0,002/√2 để hiệu (điểm − nền 340 nm) có độ lệch chuẩn đúng 0,002 A như hãng ghi.
  const rawAt = (nm) => net(nm) * toRaw * scale + (noise ? (SPEC.repeatA / Math.SQRT2) * normal(rand) : 0);
  const base = rawAt(SPEC.baseline);
  const wl = WAVELENGTHS;
  const abs = wl.map((nm) => (rawAt(nm) - base) / toRaw);
  const at = (nm) => abs[wl.indexOf(nm)];
  const a260 = at(260);
  const a280 = at(280);
  const a230 = at(230);
  const factor = FACTOR[type] ?? FACTOR.dsDNA;
  const conc = a260 * factor;
  const lodA = SPEC.lod.dsDNA / FACTOR.dsDNA; // 0,04 A: giới hạn phát hiện quy về A260 (10 mm)
  const range = a260 > SPEC.maxA10 ? "high" : a260 < lodA ? "low" : "ok";
  const r280 = a280 !== 0 ? a260 / a280 : 0;
  const r230 = a230 !== 0 ? a260 / a230 : 0;
  return { ok: true, type, path, wl, abs, a260, a280, a230, conc, r280, r230, range, flags: purityFlags(type, r280, r230, range) };
}

/**
 * Cảnh báo độ sạch theo T042.
 * @returns {string[]}
 */
export function purityFlags(type, r280, r230, range = "ok") {
  const out = [];
  if (range === "low") { out.push("Dưới giới hạn phát hiện: tỉ số không tin cậy."); return out; }
  if (range === "high") out.push("Vượt dải đo: pha loãng mẫu.");
  const pure = PURE[type] ?? PURE.dsDNA;
  if (r280 < pure.r280 - 0.15) out.push("260/280 thấp: có thể lẫn protein hoặc phenol, hoặc mẫu trong dung dịch acid.");
  if (r280 > pure.r280 + 0.3) out.push("260/280 cao: kiểm tra mẫu trắng và pH.");
  if (r230 < 1.8) out.push("260/230 thấp: có thể lẫn guanidine, phenol, carbohydrate hoặc EDTA.");
  if (r230 > 2.6) out.push("260/230 cao bất thường: mẫu trắng có thể không đúng dung dịch đệm.");
  return out;
}

/**
 * Dựng lại phổ từ một kết quả đo có sẵn (app truyền sang): giữ đúng nồng độ và hai tỉ số.
 * Giải hệ 3 phương trình ở 260, 280, 230 nm cho ba thành phần: acid nucleic sạch, protein, chất hấp thụ 230 nm.
 * Thành phần âm (tỉ số cao hơn mẫu sạch) được giữ nguyên: phần đó ứng với mẫu trắng lệch.
 * @param {{type?: string, conc: number, a260_280?: number, a260_230?: number}} given
 * @returns {Reading}
 */
export function readingFrom(given) {
  const type = FACTOR[given.type] ? given.type : "dsDNA";
  const pure = PURE[type];
  const r280 = given.a260_280 > 0 ? given.a260_280 : pure.r280;
  const r230 = given.a260_230 > 0 ? given.a260_230 : pure.r230;
  const a260 = Math.max(0, given.conc ?? 0) / FACTOR[type];
  const n = shapeOf(type, 8);
  // Ma trận các thành phần ở [260, 280, 230]
  const cols = [[n(260), n(280), n(230)], [proteinShape(260), proteinShape(280), proteinShape(230)], [shortUvShape(260), shortUvShape(280), shortUvShape(230)]];
  const rhs = [a260, a260 / r280, a260 / r230];
  const M = [0, 1, 2].map((r) => [cols[0][r], cols[1][r], cols[2][r], rhs[r]]);
  for (let i = 0; i < 3; i++) {
    let p = i;
    for (let r = i + 1; r < 3; r++) if (Math.abs(M[r][i]) > Math.abs(M[p][i])) p = r;
    [M[i], M[p]] = [M[p], M[i]];
    for (let r = 0; r < 3; r++) if (r !== i) { const f = M[r][i] / M[i][i]; for (let c = i; c < 4; c++) M[r][c] -= f * M[i][c]; }
  }
  const [a, p, g] = M.map((row, i) => row[3] / row[i]);
  const spec = (nm) => a * n(nm) + p * proteinShape(nm) + g * shortUvShape(nm);
  const base = spec(SPEC.baseline);
  const abs = WAVELENGTHS.map((nm) => spec(nm) - base);
  const lodA = SPEC.lod.dsDNA / FACTOR.dsDNA;
  const range = a260 > SPEC.maxA10 ? "high" : a260 < lodA ? "low" : "ok";
  return { ok: true, type, path: pathFor(a260), wl: WAVELENGTHS, abs, a260, a280: a260 / r280, a230: a260 / r230, conc: a260 * FACTOR[type], r280, r230, range, flags: purityFlags(type, r280, r230, range) };
}

/** Các mẫu làm mẫu cho vòng giới thiệu của hình (minh hoạ). */
export const DEMO = [
  { label: "plasmid miniprep", sample: { type: "dsDNA", conc: 152.3, buffer: "TE", volume: 1.5 }, blank: "TE", seed: 7 },
  { label: "DNA lẫn guanidine", sample: { type: "dsDNA", conc: 64.0, guanidine: 0.9, buffer: "EB", volume: 1.5 }, blank: "EB", seed: 3 },
  { label: "RNA tách bằng TRIzol", sample: { type: "RNA", conc: 410.0, phenol: 1.2, buffer: "water", volume: 2 }, blank: "water", seed: 11 },
];

/** Số theo kiểu Việt Nam: dấu phẩy thập phân, khoảng trắng hẹp phân nhóm nghìn. */
export function fmtNum(v, digits = 1) {
  const s = Math.abs(v).toFixed(digits).split(".");
  const int = s[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return `${v < 0 ? "−" : ""}${int}${s[1] ? `,${s[1]}` : ""}`;
}

/** Nồng độ để hiển thị, có xét giới hạn phát hiện và dải đo. */
export function fmtConc(r) {
  if (!r.ok) return "—";
  if (r.range === "high") return `> ${fmtNum(SPEC.maxA10 * FACTOR[r.type], 0)}`;
  if (r.range === "low") return `< ${fmtNum((SPEC.lod.dsDNA / FACTOR.dsDNA) * FACTOR[r.type], 1)}`;
  return fmtNum(r.conc, 1);
}
