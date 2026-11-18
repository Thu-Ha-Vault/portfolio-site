// Bố cục phòng thí nghiệm, đơn vị mét.
// Trục x sang phải, trục z hướng về phía người xem, trục y hướng lên. Mặt sàn ở y = 0.

export const ROOM = { minX: -22, maxX: 22, minZ: -14, maxZ: 14, wallH: 4.2, frontWallH: 1.1, door: { w: 3 } };

// Toà nhà (giai đoạn 7): trần, tường đủ cao, vách ngăn chia phòng, cửa, cửa sổ, hành lang phía trước. Đồ đạc giữ toạ độ cũ;
// vách ngăn đặt vào khoảng trống giữa các khu. Mỗi tường là đoạn a → b (x, z); lỗ mở theo toạ độ dọc tường (x với tường
// nằm ngang, z với tường nằm dọc): door (cửa có cánh), gap (lối mở không cánh), window. name: chữ trên biển cửa;
// exit: biển lối thoát. Nguồn (chi tiết ở note 12 mục 3): trần 2,9 m là chiều cao tối ưu trong NIH Design Requirements
// Manual rev. 2.1 §4.4.3.4 (tối thiểu 2,7 m); cửa phòng một cánh 1,1 m theo §4.2.2.2; hành lang thông thuỷ 1,5–1,8 m theo
// §2.2.5 (tường hành lang ở z = 14 và 15,9 → thông thuỷ 1,74 m). Bậu và chiều cao cửa sổ, cao cửa 2,1 m: chưa xác minh.
export const BUILDING = {
  ceil: 2.9, extT: 0.2, intT: 0.12, doorH: 2.1, sill: 0.95, winH: 1.35, cutH: 1.0,
  bounds: { minX: -22, maxX: 22, minZ: -14, maxZ: 15.9 },
  walls: [
    { id: 'back', a: [-22, -14], b: [22, -14], ext: true, open: [{ kind: 'window', at: 12.4, w: 2.2 }, { kind: 'window', at: 15.8, w: 2.2 }] },
    { id: 'left', a: [-22, -14], b: [-22, 15.9], ext: true, open: [{ kind: 'window', at: 2.5, w: 2 }, { kind: 'window', at: 6, w: 2 }, { kind: 'door', at: 10, w: 1.2, name: 'Lối ra khu thực địa', exit: true }] },
    { id: 'right', a: [22, -14], b: [22, 15.9], ext: true, open: [{ kind: 'window', at: -6.5, w: 2 }, { kind: 'door', at: 0, w: 2, name: 'Lối sang khu trồng trọt', double: true }, { kind: 'door', at: 14.95, w: 1.1, name: 'Lối ra', exit: true }] },
    { id: 'outer', a: [-22, 15.9], b: [22, 15.9], ext: true, open: [{ kind: 'window', at: -15, w: 2.4 }, { kind: 'window', at: -8, w: 2.4 }, { kind: 'door', at: 0, w: 1.8, name: 'Lối vào chính', double: true }, { kind: 'window', at: 8, w: 2.4 }, { kind: 'window', at: 15, w: 2.4 }] },
    { id: 'front', a: [-22, 14], b: [22, 14], open: [{ kind: 'door', at: 0, w: 1.1, name: 'Phòng đệm thay đồ' }, { kind: 'door', at: 6, w: 1.1, name: 'Lối thoát hiểm', exit: true }] },
    { id: 'wing-w1', a: [9.2, -14], b: [9.2, -2.5] },
    { id: 'wing-w2', a: [9.2, 2.5], b: [9.2, 14] },
    { id: 'post-pcr', a: [9.2, -2.5], b: [22, -2.5], open: [{ kind: 'door', at: 11, w: 1.1, name: 'Phòng sau PCR' }] },
    { id: 'analysis', a: [9.2, 2.5], b: [22, 2.5], open: [{ kind: 'door', at: 11, w: 1.1, name: 'Phòng máy phân tích' }] },
    { id: 'wash-n', a: [18, -9], b: [22, -9], open: [{ kind: 'door', at: 19.4, w: 1.1, name: 'Phòng rửa, hấp tiệt trùng' }] },
    { id: 'wash-w', a: [18, -14], b: [18, -9] },
    { id: 'bsl-s', a: [17, 7], b: [22, 7], open: [{ kind: 'door', at: 18.4, w: 1.1, name: 'Phòng vi sinh BSL-2', bio: true }] },
    { id: 'bsl-w', a: [17, 7], b: [17, 14] },
    { id: 'ante-n', a: [-2.5, 11], b: [2.5, 11], open: [{ kind: 'door', at: 0, w: 1.1, name: 'Phòng thí nghiệm chung' }] },
    { id: 'ante-w', a: [-2.5, 11], b: [-2.5, 14] },
    { id: 'ante-e', a: [2.5, 11], b: [2.5, 14] },
    // Kho hoá chất bao quanh dãy tủ hoá chất dọc tường sau (giữ toạ độ tủ cũ); tủ hút ở ngoài kho, trong phòng chung
    { id: 'store-n', a: [-18.9, -11.8], b: [-5, -11.8], open: [{ kind: 'door', at: -15.2, w: 1.1, name: 'Kho hoá chất' }, { kind: 'door', at: -8.6, w: 1.1, name: 'Kho hoá chất' }] },
    { id: 'store-w', a: [-18.9, -14], b: [-18.9, -11.8] },
    { id: 'store-e', a: [-5, -14], b: [-5, -11.8] },
    // Phòng nuôi sinh vật dọc tường trước bên trái: tủ ấm ruồi, giá nuôi cá, bàn soi ruồi
    { id: 'husb-s', a: [-22, 11], b: [-8.6, 11], open: [{ kind: 'door', at: -12.2, w: 1.1, name: 'Phòng nuôi sinh vật' }] },
    { id: 'husb-e', a: [-8.6, 11], b: [-8.6, 14] },
  ],
  // Chỗ hai phòng thông nhau không qua cửa (hành lang khu máy mở ra phòng chung ở x = 9,2)
  links: [{ rooms: ['open-lab', 'wing'], at: [9.2, 0] }],
  // Phòng: [minX, maxX, minZ, maxZ]; phòng nhỏ nằm trong phòng lớn thì phòng nhỏ được tính (src/core/facility.js).
  // wet: phòng ướt (dùng hoá chất, mẫu sinh học) phải có bồn rửa tay gần cửa ra
  rooms: [
    { id: 'open-lab', wet: true, name: 'Phòng thí nghiệm chung', box: [-22, 9.2, -14, 14] },
    { id: 'anteroom', wet: true, name: 'Phòng đệm thay đồ', box: [-2.5, 2.5, 11, 14] },
    { id: 'wing', name: 'Hành lang khu máy', box: [9.2, 22, -2.5, 2.5] },
    { id: 'post-pcr', wet: true, name: 'Phòng sau PCR, quang học', box: [9.2, 22, -14, -2.5] },
    { id: 'wash', wet: true, name: 'Phòng rửa, hấp tiệt trùng', box: [18, 22, -14, -9] },
    { id: 'analysis', wet: true, name: 'Phòng máy phân tích', box: [9.2, 22, 2.5, 14] },
    { id: 'bsl2', wet: true, name: 'Phòng vi sinh BSL-2', box: [17, 22, 7, 14] },
    { id: 'corridor', name: 'Hành lang', box: [-22, 22, 14, 15.9] },
    { id: 'store', name: 'Kho hoá chất', box: [-18.9, -5, -14, -11.8] },
    { id: 'husbandry', wet: true, name: 'Phòng nuôi sinh vật', box: [-22, -8.6, 11, 14] },
  ],
};

export const BENCH = {
  x: 0, z: 0, w: 9, d: 2.4, top: 0.92,
  // Vùng được kéo thả đồ trên mặt bàn
  dragMinX: -4.35, dragMaxX: 4.35, dragMinZ: -1.05, dragMaxZ: 1.05,
};

export const INSTRUMENT_BENCHES = [
  { x: 14.5, z: -5.5, w: 9, d: 1.4 },
  { x: 14.5, z: 5.5, w: 9, d: 1.4 },
];

// Tủ hoá chất theo nhóm dọc tường sau (mặt trước hướng +z). id trùng trường "cabinet" của chất trong substances.json.
export const CHEM_CABINETS = [
  { id: 'acid', name: 'Acid, chất ăn mòn', color: '#c8463d' },
  { id: 'base', name: 'Base', color: '#2f6fb5' },
  { id: 'salt', name: 'Muối', color: '#7d8a96' },
  { id: 'flammable', name: 'Dễ cháy', color: '#e0b028' },
  { id: 'toxic', name: 'Chất độc', color: '#7a4fa0' },
  // Chất oxy hoá mạnh (KMnO₄) cất riêng, xa chất khử (KI, KSCN), chất dễ cháy và acid (data/safety.json incompatible)
  { id: 'oxidizer', name: 'Chất oxy hoá', color: '#e07a1f' },
].map((c, i) => ({ ...c, x: -17.6 + i * 2.15, w: 2.0, h: 2.1, d: 0.6 }));

// Tủ hút khí độc Labconco Protector XStream 5 ft trên tủ đế acid và dung môi (figures/fumehood/model.mjs):
// ngoài 1524 × 958 × 1499 mm, tủ đế cao 900 mm (giả định), tầm nhìn 953 mm, kính trượt mở tối đa 711 mm.
export const FUME_HOOD = { x: -19.9, z: ROOM.minZ + 0.5, w: 1.524, d: 0.958, h: 1.499, base: 0.9, sight: 0.953, sashH: 0.65 };

// Khu tủ lạnh, tủ đông sát tường trái, mặt trước hướng +x. place: chỗ cất trong data/storage.json.
export const COLD_UNITS = [
  { id: 'fridge', place: 'fridge', name: 'Tủ lạnh 5 °C', z: -7.2, w: 1.0, h: 2.0, d: 0.8, glass: true, band: null },
  { id: 'freezer', place: 'freezer', name: 'Tủ đông −20 °C', z: -6.05, w: 1.0, h: 1.9, d: 0.8, glass: false, band: '#7fb3dc' },
  // Tủ −80 °C theo Thermo Scientific TSX40086V (figures/ultrafreezer): ngoài 719 × 1981 mm, thân sâu 848 mm (chưa kể cửa),
  // khoang máy cao 480 mm dưới thân tủ nên cửa và kệ bắt đầu từ bottom
  { id: 'ult', place: 'ult', name: 'Tủ âm sâu −80 °C', z: -4.75, w: 0.72, h: 1.98, d: 0.85, bottom: 0.48, glass: false, band: '#2f6fb5' },
];
export const ICE_MACHINE = { z: -3.5, w: 0.75, h: 1.0, d: 0.7 };
// Bình nitơ lỏng Thermo Locator 4 Plus: Ø 55,9 cm, cao 100,3 cm kể cả nắp (manual LT509X9), đặt trên xe đẩy; h là độ cao
// miệng bình trên sàn đo trên bản 3D dựng từ figures/ln2
export const LN2_DEWAR = { z: -2.5, r: 0.28, h: 1.05 };
// Hộp đá trên bàn sinh học phân tử, dưới hàng ống thuốc thử
export const ICE_BUCKET = { x: 2.0, z: -0.72, w: 2.5, d: 0.3, h: 0.06 };

// Máy trong Khu máy móc, kích thước thật (m, rộng × sâu × cao) theo model đã chọn (note 05, 06; figures/*/model.mjs).
// bench: 'A' (đảo sinh học phân tử, z = −5,5) hoặc 'B' (đảo phân tích, z = 5,5); floor: đặt trên sàn sát tường phải.
// detail: id hình cận cảnh trong DETAILS của main.js; actions: nút thao tác ngay trên máy; fig3d: có hình học 3D xuất từ
// hình chi tiết (data/machines3d/<id>.json, tools/parts3d/), dùng thay khối low-poly ở mức hình ảnh Vừa và Cao.
export const MACHINES_3D = [
  { id: 'pcr', bench: 'A', x: 10.8, w: 0.26, d: 0.47, h: 0.23, color: '#eef1f4', top: '#cfd6dc', name: 'Máy PCR', detail: 'pcr', fig3d: true, actions: [['▶ Chạy ống của bạn', ['pcr-run']]], accepts: 'pcr-run' },
  { id: 'qpcr', bench: 'A', x: 11.8, w: 0.33, d: 0.46, h: 0.36, color: '#eef1f4', top: '#3a4652', fig3d: true, name: 'Máy real-time PCR', detail: 'qpcr' },
  { id: 'gel', bench: 'A', x: 12.85, w: 0.255, d: 0.092, h: 0.056, color: '#9fc6e0', glass: true, fig3d: true, name: 'Bộ điện di', detail: 'gel', actions: [['▶ Nạp gel, chạy điện di', ['gel-load', 'gel-run']]], accepts: 'gel-load', extra: { dx: 0.4, w: 0.21, d: 0.25, h: 0.085, color: '#3a4652' } },
  { id: 'geldoc', bench: 'A', x: 14.4, w: 0.28, d: 0.44, h: 0.38, color: '#3a4652', top: '#5f86a3', fig3d: true, name: 'Máy chụp ảnh gel', detail: 'geldoc', actions: [['▶ Chụp ảnh gel', ['gel-image']]] },
  { id: 'spectro', bench: 'A', x: 15.7, w: 0.45, d: 0.501, h: 0.244, color: '#eef1f4', top: '#cfd6dc', fig3d: true, name: 'Máy quang phổ UV-Vis', detail: 'spectro' },
  { id: 'microscope', bench: 'A', x: 17.0, w: 0.198, d: 0.398, h: 0.386, color: '#eef1f4', top: '#3a4652', fig3d: true, name: 'Kính hiển vi', detail: 'microscope' },
  { id: 'vortex', bench: 'A', x: 18.1, w: 0.122, d: 0.165, h: 0.165, color: '#eef1f4', top: '#3a4652', fig3d: true, name: 'Máy vortex, ly tâm mini', detail: 'vortex', extra: { dx: 0.3, w: 0.15, d: 0.15, h: 0.117, color: '#cfd6dc' } },
  // HPLC: chồng module rộng 396 mm, sâu 436 mm; cao khoảng 1 m (cộng chiều cao các module, ước lượng)
  { id: 'hplc', bench: 'B', x: 10.9, w: 0.396, d: 0.436, h: 1.0, color: '#eef1f4', top: '#cfd6dc', fig3d: true, name: 'HPLC', detail: 'hplc' },
  { id: 'centrifuge', bench: 'B', x: 13.0, w: 0.24, d: 0.39, h: 0.24, color: '#eef1f4', top: '#cfd6dc', fig3d: true, name: 'Máy ly tâm', detail: 'centrifuge' },
  { id: 'platereader', bench: 'B', x: 14.3, w: 0.323, d: 0.395, h: 0.32, color: '#eef1f4', top: '#3a4652', fig3d: true, name: 'Máy đọc vi đĩa', detail: 'platereader' },
  { id: 'nanodrop', bench: 'B', x: 15.3, w: 0.2, d: 0.254, h: 0.323, color: '#eef1f4', top: '#3a4652', fig3d: true, name: 'Máy đo nồng độ DNA', detail: 'nanodrop' },
  // Cytiva ÄKTA pure 25 (535 × 630 × 470 mm) và bộ thu phân đoạn F9-C (390 × 320 × 585 mm) bên phải
  { id: 'fplc', bench: 'B', x: 16.0, w: 0.535, d: 0.47, h: 0.63, color: '#eef1f4', top: '#cfd6dc', fig3d: true, name: 'Sắc ký protein FPLC', detail: 'fplc', extra: { dx: 0.48, w: 0.39, d: 0.585, h: 0.32, color: '#cfd6dc' } },
  // Bể Bio-Rad Mini-PROTEAN Tetra (160 × 120 × 180 mm) và nguồn PowerPac HC (250 × 285 × 80 mm) đặt phía sau
  { id: 'sdspage', bench: 'B', x: 11.95, w: 0.37, d: 0.55, h: 0.18, color: '#eef1f4', top: '#cfd6dc', fig3d: true, name: 'Bộ điện di protein đứng', detail: 'sdspage' },
  { id: 'lcms', bench: 'B', x: 17.3, w: 1.18, d: 0.54, h: 0.61, color: '#eef1f4', top: '#cfd6dc', fig3d: true, name: 'Máy khối phổ LC-MS/MS', detail: 'lcms' },
  { id: 'autoclave', floor: true, x: 21.5, z: -10.5, w: 0.41, d: 0.477, h: 0.97, color: '#eef1f4', top: '#cfd6dc', fig3d: true, name: 'Nồi hấp tiệt trùng', detail: 'autoclave' },
  // Tủ an toàn sinh học đặt trên giá đỡ cao khoảng 0,7 m (chưa xác minh); mặt trước hướng −x
  // Tủ ấm lắc New Brunswick Innova 42: 620 × 754 × 820 mm (figures/shaker/model.mjs), đặt sàn cạnh tủ an toàn sinh học
  { id: 'shaker', floor: true, x: 21.45, z: 8.5, w: 0.62, d: 0.754, h: 0.82, rotate: true, color: '#eef1f4', top: '#cfd6dc', fig3d: true, name: 'Tủ ấm lắc', detail: 'shaker' },
  { id: 'bsc', floor: true, x: 21.52, z: 10.4, w: 1.34, d: 0.753, h: 1.4, base: 0.7, rotate: true, color: '#eef1f4', top: '#cfd6dc', fig3d: true, name: 'Tủ an toàn sinh học', detail: 'bsc' },
];

// Máy có hình chi tiết nhưng đặt ngoài Khu máy móc (giai đoạn 7): hình học 3D xuất từ hình (data/machines3d/<id>.json,
// tools/parts3d/) thay mô hình dựng tay ở mức hình ảnh Vừa và Cao (nhóm dựng tay mang userData.figureSlot, phần có
// hoạt cảnh mang userData.keep). w × d × h là kích thước ngoài của model thật (m, rộng × sâu × cao, mặt trước hướng +z),
// dùng để kiểm bản 3D trong tests/machines3d.html.
export const FIGURE_SLOTS = [
  { id: 'balance', w: 0.204, d: 0.347, h: 0.348, name: 'Cân phân tích' }, // Mettler Toledo MS204TS
  { id: 'hotplate', w: 0.22, d: 0.354, h: 0.088, name: 'Máy khuấy từ gia nhiệt' }, // IKA C-MAG HS 7 control
  { id: 'waterbath', w: 0.578, d: 0.356, h: 0.238, name: 'Bể ổn nhiệt' }, // Memmert WNB 10
  { id: 'fumehood', w: 1.524, d: 0.958, h: 2.431, name: 'Tủ hút khí độc' }, // Labconco XStream 5 ft trên tủ đế 900 mm, mặt bàn 32 mm
  { id: 'ult', w: 0.719, d: 0.96, h: 1.981, name: 'Tủ âm sâu −80 °C' }, // Thermo Scientific TSX40086V
  { id: 'ln2', w: 0.559, d: 0.559, h: 1.105, name: 'Bình nitơ lỏng' }, // Locator 4 Plus 1003 mm kể cả nắp, xe đẩy 101,6 mm
  { id: 'growthchamber', w: 1.04, d: 0.825, h: 1.96, name: 'Buồng sinh trưởng' }, // Conviron GEN1000
  { id: 'eyewash', w: 0.3, d: 0.74, h: 2.261, name: 'Vòi tắm và rửa mắt khẩn cấp' }, // Guardian G1902: cao 2261, đầu sen cách trục 610 mm
  { id: 'zebrafish', w: 1.62, d: 0.565, h: 1.8, name: 'Giá nuôi cá ngựa vằn' }, // Tecniplast ZebTEC Active Blue 4 hàng
  { id: 'stereo', w: 0.194, d: 0.253, h: 0.368, name: 'Kính lúp soi nổi' }, // Olympus/Evident SZ61 bộ chuẩn
];

// Đồ an toàn chung của phòng (việc 7 giai đoạn 2). Vòi rửa mắt và vòi tắm khẩn cấp gần cửa ra khu trồng trọt;
// bình chữa cháy cạnh cửa và tủ hoá chất; thùng rác sinh học cạnh tủ an toàn sinh học; bảng nội quy trên tường sau.
export const SAFETY = {
  shower: { x: 21.4, z: 1.7 }, // trong hành lang khu máy, cạnh lối sang khu trồng trọt
  extinguishers: [{ x: 21.6, z: -2.0 }, { x: -12.0, z: -13.6 }],
  biobin: { x: 20.6, z: 12.6 },
  sharps: { x: 4.2, z: -0.95 },
  board: { x: 4.5, z: -13.88, w: 1.6, h: 1.0 },
};

export const GREENHOUSE = { minX: 24, maxX: 44, minZ: -10, maxZ: 10, eaveH: 3.4, ridgeH: 5.4 };
// Khu thực địa ngoài trời bên trái phòng (bài thực tập Cát Bà): hai khu rừng ngập mặn Phù Long thu nhỏ 1 : 2
// (khu 40 × 40 m của data/fieldeco.json vẽ thành 20 × 20 m), phía sau là núi đá vôi có rừng
export const FIELD = { scale: 0.5, sea: { x0: -50, z0: -10 }, land: { x0: -72, z0: -10 }, karstZ: -22 };
// Sa bàn quần đảo Cát Bà dựng từ ảnh vệ tinh (src/scene/catba-map.js): tỉ lệ 1 : 1000 nên khung 25,1 × 21,4 km thành
// 25,1 × 21,4 m, đặt phía tây khu thực địa; y là độ cao mặt bệ (mực nước biển)
export const CATBA = { x: -96, z: 0, y: 0.45 };

// Vị trí chai hoá chất trên bàn: nửa trái là hoá học, nửa phải là sinh học phân tử.
export const SLOTS = {
  chem: { x0: -3.4, dx: 0.17, z: -0.48 }, // hàng chai sát nhau sau hàng cốc, trong khung nhìn cận cảnh
  bio: { x0: 0.95, dx: 0.34, z: -0.72 },
};

// Máy trên bàn hoá học, đặt sau hàng chai (kích thước model thật, m): cân phân tích Mettler Toledo MS204TS
// (204 × 347 × 348 mm, figures/balance/model.mjs), máy khuấy từ gia nhiệt IKA C-MAG HS 7 control (220 × 354 × 88 mm,
// figures/hotplate/model.mjs) có giá kẹp đầu dò.
export const CHEM_BENCH_TOOLS = [
  { id: 'balance', x: -4.0, z: -1.0, w: 0.204, d: 0.347, h: 0.348, name: 'Cân phân tích', detail: 'balance' },
  { id: 'hotplate', x: -1.45, z: -1.0, w: 0.22, d: 0.354, h: 0.088, name: 'Máy khuấy từ gia nhiệt', detail: 'hotplate' },
];

// Bàn sinh học phân tử, phía trước bên trái: giá 10 ống nghiệm (ống 16 × 150 mm) cho các bài hoá sinh định tính;
// bên phải: bể ổn nhiệt Memmert WNB 10 đun cách thuỷ (578 × 356 × 238 mm, figures/waterbath/model.mjs).
export const TUBE_RACK = { x: 0.95, z: 0.3, n: 10, pitch: 0.026, tubeR: 0.008, tubeH: 0.15, h: 0.07, d: 0.06 };
export const WATER_BATH = { x: 3.25, z: 0.1, w: 0.578, d: 0.356, h: 0.238 }; // Memmert WNB 10, nắp phẳng

// Đồ tiêu hao trên nửa sinh học phân tử của bàn trung tâm (giai đoạn 7), kích thước theo catalog (note 12):
// hộp đầu tip Eppendorf epT.I.P.S. Box 2.0 cỡ 1 (141 × 111 × 73 mm, tip 2–200 µL dài 53 mm); giá ống 1,5 mL
// Heathrow Scientific HS29025B (225 × 67 × 28 mm, 5 × 16 lỗ); micropipet 20–200 µL (IKA Pette vario: 30 × 248 × 63 mm)
// trên giá treo; đĩa petri Ø 90 × 15,7 mm (Thermo Sterilin 101RTC); hộp găng, cuộn giấy lau, bình tia: minh hoạ.
export const CONSUMABLES = {
  tipBox: { x: 1.55, z: -0.25, w: 0.141, d: 0.111, h: 0.073 },
  tubeRack: { x: 2.35, z: -0.27, w: 0.225, d: 0.067, h: 0.028, cols: 16, rows: 5 },
  pipettes: { x: 3.95, z: -0.62, n: 3, h: 0.248 },
  petri: { x: 1.25, z: 0.85, r: 0.045, h: 0.0157, n: 5 },
  gloves: { x: 4.05, z: 0.6, w: 0.24, d: 0.125, h: 0.065 },
  towel: { x: 0.75, z: 0.9, r: 0.06, h: 0.22 },
  washBottle: { x: 1.75, z: 0.92, r: 0.035, h: 0.16 },
};

// Dụng cụ chứa cỡ thật (src/core/vessel.js): cốc có mỏ 50 mL, bình tam giác 100 mL, ống nghiệm 16 × 150 mm, ống PCR 0,2 mL.
// capacity: sức chứa (mL) mà lõi dùng để tính mực chất lỏng.
export const CONTAINERS = [
  { id: 'beaker-a', name: 'Cốc A', kind: 'beaker', capacity: 50, x: -3.25, z: 0.02 },
  { id: 'beaker-b', name: 'Cốc B', kind: 'beaker', capacity: 50, x: -2.9, z: 0.02 },
  { id: 'beaker-c', name: 'Cốc C', kind: 'beaker', capacity: 50, x: -2.55, z: 0.02 },
  { id: 'flask', name: 'Bình tam giác', kind: 'beaker', shape: 'flask', capacity: 100, x: -2.15, z: 0.02 },
  // Ống nghiệm cho đun bằng đèn cồn, nhiệt phân, cô cạn (giai đoạn 5): đứng trong giá cạnh bộ đun
  { id: 'tt-1', name: 'Ống nghiệm 1', short: 'Ống 1', kind: 'testtube', x: -1.9, z: 0.08 },
  { id: 'tt-2', name: 'Ống nghiệm 2', short: 'Ống 2', kind: 'testtube', x: -1.84, z: 0.08 },
  { id: 'tt-3', name: 'Ống nghiệm 3', short: 'Ống 3', kind: 'testtube', x: -1.78, z: 0.08 },
  { id: 'pcr-tube', name: 'Ống mẫu', short: 'Mẫu', kind: 'tube', x: 2.0, z: 0.32 },
  { id: 'pcr-neg', name: 'Ống ĐC−', short: 'ĐC−', control: true, kind: 'tube', x: 2.65, z: 0.32 },
];

// Bộ đun bằng đèn cồn trên bàn hoá học (giai đoạn 5), cạnh giá ống nghiệm: đèn cồn Ø 0,09 m, kiềng cao 0,21 m (minh hoạ).
export const HEAT_STATION = {
  lamp: { x: -1.52, z: 0.0, r: 0.045, h: 0.075, wick: 0.02 },
  tripod: { x: -1.22, z: 0.0, h: 0.21, r: 0.095 },
  rack: { x: -1.84, z: 0.08, w: 0.2, d: 0.06, h: 0.06 },
  tube: { r: 0.008, h: 0.15 }, // ống nghiệm 16 × 150 mm (src/core/vessel.js)
  tongs: { x: -1.62, z: 0.17 },
};

// Khu giải phẫu động vật: bàn nối dài bên phải bàn thí nghiệm trung tâm (mặt inox), khay mổ đáy sáp ở giữa, lọ mẫu
// phía sau, dụng cụ mổ bên phải. Khay và mẫu vẽ to hơn thật khoảng 1,5 lần để nhìn rõ nội quan (như cốc trên bàn hoá học).
export const DISSECT = {
  x0: 4.5, x1: 7.7, z: 0, d: 1.6, top: 0.92,
  // Khay mổ nhôm đáy sáp Eisco BI0186QWX: ngoài 14,7 × 11,1 × 3 in (373 × 282 × 76 mm), lớp sáp dày 1 in (25,4 mm)
  tray: { x: 6.0, z: 0.05, w: 0.373, d: 0.282, h: 0.076, wax: 0.0254 },
  jars: { x0: 5.15, dx: 0.17, z: -0.42, r: 0.06, h: 0.16 },
  tools: { x: 6.55, z: -0.02 },
};

// camera/target: góc nhìn khi chọn khu; label: vị trí nhãn khu trong cảnh.
// fit: [minX, maxX, minZ, maxZ, cao] của vùng cần thấy trọn; camera giữ hướng nhìn, tự lùi xa hay lại gần theo tỉ lệ khung hình.
// fitNarrow: vùng nhỏ hơn dùng khi khung nhìn dọc (điện thoại), để đồ trên bàn không quá nhỏ.
export const ZONES = [
  { id: 'overview', name: 'Toàn cảnh', camera: [10, 50, 58], target: [11, 0, 0], fit: [-22.5, 44.5, -14.5, 14.5, 5.5] },
  // Bàn hoá học nhìn cận cảnh (giai đoạn 5): camera gần để thấy rõ chất lỏng, kết tủa, bọt khí, ngọn lửa
  { id: 'bench-chem', name: 'Bàn hoá học', camera: [-2.45, 1.95, 1.25], target: [-2.45, 0.95, -0.28], fit: [-3.55, -1.05, -0.6, 0.2, 0.32], fitNarrow: [-3.42, -2.02, -0.55, 0.12, 0.3], label: [0, 2.2, 0], labelText: 'Bàn thí nghiệm trung tâm' },
  { id: 'dissect', name: 'Khu giải phẫu', camera: [6.05, 1.45, 0.75], target: [6.05, 0.95, -0.0], label: [6.1, 1.9, -0.5], labelText: 'Khu giải phẫu động vật', fit: [5.5, 6.65, -0.3, 0.2, 0.25], fitNarrow: [5.8, 6.2, -0.1, 0.2, 0.15] },
  { id: 'bench-bio', name: 'Bàn sinh học phân tử', camera: [2.0, 2.6, 2.9], target: [2.0, 0.92, -0.15], fit: [0.6, 3.7, -0.85, 0.55, 1.2] },
  { id: 'chem', name: 'Tủ hoá chất', camera: [-13.8, 4.5, -3], target: [-13.8, 1.2, -13.2], label: [-13.8, 3.3, -13], fit: [-21.1, -6.45, -14, -12.9, 2.4] },
  { id: 'glass', name: 'Tủ dụng cụ', camera: [0, 4.3, -4], target: [0, 1.2, -13.2], label: [0, 3.3, -13] },
  { id: 'cold', name: 'Tủ lạnh, tủ đông', camera: [-15.2, 3.2, -4.8], target: [-21.4, 1.1, -4.8], label: [-21.3, 3.1, -4.8], fit: [-22, -20.6, -7.8, -2.2, 2.2] },
  { id: 'safety', name: 'An toàn', camera: [16.6, 2.6, 0.8], target: [21.2, 1.2, 0.8], label: [21.4, 2.9, 2.6], fit: [20.6, 22, -2.6, 4.4, 2.6] },
  { id: 'organism', name: 'Khu nuôi sinh vật', camera: [-14.2, 4.2, 3.5], target: [-14.2, 1.0, 13.3], label: [-14.2, 3.0, 13.2], fit: [-19.1, -9.4, 12.9, 14, 2.1] },
  { id: 'instruments', name: 'Khu máy móc', camera: [14.5, 7.5, 13], target: [14.5, 0.9, -0.5], label: [14.5, 3.0, 0] },
  { id: 'pcr-bench', name: 'Máy PCR, điện di', camera: [12.6, 3.2, -1.2], target: [12.6, 1.2, -5.5], fit: [10.1, 15.1, -6.2, -4.8, 2.1] },
  { id: 'optics-bench', name: 'Quang phổ, kính hiển vi', camera: [16.6, 3.0, -1.6], target: [16.6, 1.2, -5.5], fit: [14.9, 18.7, -6.2, -4.8, 2.0] },
  { id: 'analysis-bench', name: 'HPLC, ly tâm, đo DNA', camera: [14.2, 3.4, 9.8], target: [14.2, 1.2, 5.5], fit: [10.4, 18.1, 4.8, 6.2, 2.2] },
  { id: 'sterile-area', name: 'Nồi hấp', camera: [17.6, 2.6, -7.6], target: [21.5, 0.7, -10.5], fit: [20.9, 22, -11.1, -9.9, 1.5] },
  { id: 'bsc-area', name: 'Tủ an toàn sinh học', camera: [15.6, 3.4, 6.2], target: [21.5, 1.2, 10.4], fit: [20.9, 22, 8, 11.3, 2.2] },
  { id: 'greenhouse', name: 'Khu trồng trọt', camera: [34, 15, 26], target: [34, 1.5, 0], label: [34, 6.6, 0] },
  { id: 'field', name: 'Thực địa Cát Bà', camera: [-50, 22, 30], target: [-50, 0, 0], label: [-50, 6, -6], fit: [-72, -30, -24, 10, 6] },
  { id: 'catba', name: 'Bản đồ Cát Bà', camera: [-96, 15, 16], target: [-96, 0.45, 0.3], label: [-96, 2.6, -11.6], labelText: 'Bản đồ vệ tinh quần đảo Cát Bà', fit: [-108.6, -83.4, -10.8, 11.2, 1.3], fitNarrow: [-104, -91, -6, 5, 1.2] },
];
