// Mô hình quang học và lấy nét của kính hiển vi quang học, dùng chung cho bản dựng (Node), trang hình và app.
// Module thuần: không DOM, không Three.js. Đơn vị: độ dài µm nếu không ghi khác, kích thước máy mm.
//
// Số liệu (máy làm mẫu: Olympus/Evident CX23, bản hai mắt CX23LEDRFS1):
// - Catalogue CX23 (Olympus, N8600083-032015, bảng "CX23 SPECIFICATIONS"):
//   https://micro-pro.com/Produktdownloads/48080_CX23_en.pdf
//   · vật kính plan achromat: 4× NA 0,10 WD 27,8 mm; 10× NA 0,25 WD 8,0 mm; 40× NA 0,65 WD 0,6 mm;
//     100× dầu NA 1,25 WD 0,13 mm (chỉ bản S1).
//   · thị kính 10×, số trường FN 20. Ống hai mắt nghiêng 30°, khoảng cách đồng tử 48–75 mm.
//   · lấy nét bằng nâng hạ bàn, hành trình thô 15 mm, có chốt chặn giới hạn trên;
//     núm tinh vạch chia nhỏ nhất 2,5 µm. Mâm vật kính 4 lỗ cố định.
//   · bàn cơ "wire movement", hành trình 76 mm (X) × 30 mm (Y). Đèn LED 0,5 W. Nặng 5,9 kg.
//   · kích thước 198 × 398 × 386 mm (rộng × sâu × cao), đế 149 × 240 mm, mặt bàn cao 190 mm (bản vẽ).
// - Trang sản phẩm Evident: https://evidentscientific.com/en/products/upright/cx23
//   · tụ quang Abbe NA 1,25 dùng cho 4×–100×; LED tuổi thọ 20 000 giờ.
// - Hành trình mỗi vòng núm thô 36,8 mm: số của CX33/CX43 cùng dòng (spec sheet Evident CX43,
//   https://evidentscientific.com/en/products/upright/cx43), chưa xác minh cho CX23.
//   Một vòng núm tinh = 40 vạch × 2,5 µm = 100 µm: giả định, chưa xác minh.
// - Khoảng cách đồng tiêu (parfocal) 45 mm: chuẩn của vật kính Olympus UIS/UIS2 (bảng thuật ngữ Evident,
//   https://industrial.evidentscientific.com.cn/pt/microscope/terms/parfocal_distance); chưa xác minh riêng cho CX23.
// - Màu vòng vật kính (Nikon, "objective lens color codes",
//   https://www.microscope.healthcare.nikon.com/resources/glossary/objective-lens-color-codes):
//   4× đỏ, 10× vàng, 40× xanh nhạt, 100× trắng; vòng dầu (oil) màu đen, nằm gần đầu vật kính.
// - Độ phân giải Rayleigh d = 0,61 λ / NA; thị trường = FN / độ phóng đại vật kính (vật kính vô cực, không ống phụ);
//   độ sâu trường d = λ n / NA² + n e / (M · NA) (công thức của Nikon MicroscopyU,
//   https://www.microscopyu.com/microscopy-basics/depth-of-field-and-depth-of-focus), với e là chi tiết nhỏ nhất
//   mắt phân biệt được ở mặt phẳng ảnh trung gian: mắt phân giải 1′ góc ở 250 mm (≈ 73 µm), qua thị kính 10× còn 7,3 µm.
// - Ước lượng mờ do lệch nét (hình học): bán kính vết mờ ≈ |Δz| · tan(arcsin(NA / n)).
// - Vật kính dầu dùng không có dầu: ánh sáng đi qua khe không khí bị phản xạ toàn phần ở góc lớn và quang sai cầu tăng,
//   ảnh tối và nhòe. Hệ số độ sáng 0,45 và quang sai 1,5 µm dưới đây là ước lượng định tính, chưa xác minh.
// - Mẫu: tế bào biểu bì vảy hành dài khoảng 200–260 µm, rộng khoảng 80 µm (bài thực hành đo bằng thước trắc vi,
//   ví dụ https://www.slideshare.net/slideshow/as-biology-lesson-2-measuring-cells/14109308), nhân khoảng 10–20 µm;
//   hồng cầu người đường kính khoảng 7,5 µm, bạch cầu trung tính 10–12 µm, tiểu cầu 2–3 µm (số sách giáo khoa).

export const MICROSCOPE = {
  model: "Olympus CX23 (CX23LEDRFS1)",
  size: { w: 198, d: 398, h: 386 }, // mm
  base: { w: 149, d: 240 }, // mm
  stageTop: 190, // mm, cao mặt bàn ở đỉnh hành trình (theo bản vẽ kích thước)
  weight: 5.9, // kg
  led: 0.5, // W
  condenserNA: 1.25,
  head: { tilt: 30, ipd: [48, 75] }, // độ, mm
  stageTravel: { x: 76, y: 30 }, // mm
};

/** Vật kính của CX23 (plan achromat). wd: khoảng cách làm việc (mm), n: chiết suất môi trường giữa vật kính và lá kính. */
export const OBJECTIVES = [
  { mag: 4, NA: 0.1, wd: 27.8, immersion: "air", n: 1.0, color: "red" },
  { mag: 10, NA: 0.25, wd: 8.0, immersion: "air", n: 1.0, color: "yellow" },
  { mag: 40, NA: 0.65, wd: 0.6, immersion: "air", n: 1.0, color: "lightblue" },
  { mag: 100, NA: 1.25, wd: 0.13, immersion: "oil", n: 1.515, color: "white" },
];

export const EYEPIECE = { mag: 10, fn: 20 }; // thị kính 10×, số trường 20 mm

export const FOCUS = {
  parfocal: 45, // mm, từ vai vật kính tới mặt phẳng mẫu
  coverslip: 0.17, // mm, lá kính số 1½
  slide: 1.0, // mm, lam kính 76 × 26 × 1
  coarseStroke: 15, // mm
  coarsePerTurn: 36.8, // mm mỗi vòng (CX33/CX43, chưa xác minh cho CX23)
  fineStep: 2.5, // µm mỗi vạch
  finePerTurn: 100, // µm mỗi vòng (giả định)
  stopAbove: 100, // µm: chốt chặn đặt cao hơn vị trí nét 0,1 mm (thấp hơn WD của 100×)
};

export const LAMBDA = 550; // nm, ánh sáng xanh lục giữa phổ nhìn thấy
export const OIL_N = 1.515; // dầu soi kính

const EYE_E = (250e3 * Math.tan(Math.PI / 180 / 60)) / EYEPIECE.mag; // µm ở ảnh trung gian, ≈ 7,3

/** Vật kính theo độ phóng đại (4, 10, 40, 100). Không có thì trả về 40×. */
export const objectiveOf = (mag) => OBJECTIVES.find((o) => o.mag === Number(mag)) ?? OBJECTIVES[2];

/** Độ phóng đại tổng = vật kính × thị kính. */
export const totalMagnification = (objective, eyepiece = EYEPIECE) => objectiveOf(objective.mag ?? objective).mag * eyepiece.mag;

/** Độ phân giải Rayleigh d = 0,61 λ / NA, kết quả µm. */
export const resolution = (NA, lambda = LAMBDA) => (0.61 * lambda) / 1000 / NA;

/** Đường kính thị trường trên mẫu (mm) = FN / độ phóng đại vật kính. */
export const fieldOfView = (mag, fn = EYEPIECE.fn) => fn / mag;

/**
 * Độ sâu trường (µm): λ n / NA² + n e / (M · NA).
 * @param {{NA:number, mag:number, n?:number}} o vật kính
 * @param {{lambda?:number, e?:number}} [opt] λ (nm) và e (µm ở ảnh trung gian, mặc định theo mắt qua thị kính 10×)
 */
export function depthOfField(o, { lambda = LAMBDA, e = EYE_E } = {}) {
  const n = o.n ?? 1;
  return ((lambda / 1000) * n) / (o.NA * o.NA) + (n * e) / (o.mag * o.NA);
}

/** Chiều dài thân vật kính từ vai tới đầu (mm): đồng tiêu 45 mm trừ WD và lá kính. */
export const objectiveLength = (o) => FOCUS.parfocal - o.wd - FOCUS.coverslip;

/** Giới hạn vị trí bàn (µm, 0 = đúng nét, dương = bàn lên gần vật kính). */
export const STAGE_RANGE = [FOCUS.stopAbove - FOCUS.coarseStroke * 1000, FOCUS.stopAbove];
export const clampStage = (z) => Math.min(STAGE_RANGE[1], Math.max(STAGE_RANGE[0], z));

/** Góc quay của núm (độ) khi bàn đi được dz µm: núm thô theo hành trình mỗi vòng, núm tinh theo 100 µm/vòng. */
export const knobTurn = (dz, which = "coarse") => (dz / (which === "fine" ? FOCUS.finePerTurn : FOCUS.coarsePerTurn * 1000)) * 360;

/**
 * Trạng thái ảnh với vật kính, vị trí bàn và dầu soi.
 * @param {{objective?:number, stage?:number, oil?:boolean}} s objective: 4|10|40|100; stage: µm so với vị trí nét; oil: có giọt dầu giữa vật kính và lá kính
 * @returns {{objective:object, total:number, fov:number, resolution:number, dof:number, defocus:number, blur:number, sharpness:number, brightness:number, oilMissing:boolean, oilWasted:boolean, label:string}}
 *   fov mm; resolution, dof, defocus, blur µm (bán kính vết mờ trên mẫu); sharpness, brightness 0–1.
 */
export function viewState({ objective = 40, stage = 0, oil = false } = {}) {
  const o = objectiveOf(objective);
  const oilMissing = o.immersion === "oil" && !oil;
  const oilWasted = o.immersion !== "oil" && oil && o.mag >= 40; // dầu dính vào vật kính khô 40×: ảnh mờ, phải lau
  const n = oilMissing ? 1.0 : o.n;
  const NA = oilMissing ? Math.min(o.NA, 0.95) : o.NA;
  const dz = clampStage(stage);
  const dof = depthOfField({ ...o, n, NA });
  const res = resolution(NA);
  const cone = Math.tan(Math.asin(Math.min(0.999, NA / n)));
  const aberr = oilMissing ? 1.5 : oilWasted ? 2.5 : 0;
  const geo = Math.max(0, Math.abs(dz) - dof / 2) * cone;
  const blur = Math.hypot(res / 2, geo, aberr);
  const sharpness = 1 / (1 + (Math.abs(dz) / dof) ** 2) / (oilMissing || oilWasted ? 2 : 1);
  const brightness = oilMissing ? 0.45 : 1;
  const focus = Math.abs(dz) <= dof / 2 ? "nét" : Math.abs(dz) <= dof * 3 ? "hơi mờ" : "mờ";
  const label = oilMissing ? `${focus === "nét" ? "nhòe" : focus} · thiếu dầu` : oilWasted ? "nhòe · dầu dính vật kính khô" : focus;
  return { objective: o, total: totalMagnification(o), fov: fieldOfView(o.mag), resolution: res, dof, defocus: dz, blur, sharpness, brightness, oilMissing, oilWasted, label };
}

/** Mẫu có sẵn. size: kích thước đặc trưng (µm). */
export const SPECIMENS = {
  onion: { name: "Biểu bì vảy hành", stain: "iodine (Lugol)", cell: { length: 230, width: 80 }, nucleus: 15 },
  blood: { name: "Phết máu", stain: "Wright-Giemsa", rbc: 7.5, wbc: 11, platelet: 2.5 },
};
export const specimenOf = (id) => (SPECIMENS[id] ? id : "onion");
