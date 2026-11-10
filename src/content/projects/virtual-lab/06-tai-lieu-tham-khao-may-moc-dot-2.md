---
title: Tài liệu tham khảo máy móc đợt 2
type: note
tags:
  - project
  - virtual-lab
  - simulation
folder: Projects / Virtual_Lab
vaultPath: Projects/Virtual_Lab/06 - Tài liệu tham khảo máy móc đợt 2.md
date: '2026-10-16'
status: active
order: 6
project: virtual-lab
isIndex: false
---
<div class="callout callout-info">
<p class="callout-title">Máy đợt 2 (phân tích) và đợt 3 trong Khu máy móc. Mỗi máy: model thật được chọn, thông số có nguồn, bộ phận để vẽ, số liệu dùng cho mô hình, chỗ chưa xác minh, tiến độ. Hình vẽ theo đúng hình dáng model, không vẽ logo hay tên hãng. Đợt 1 (PCR, điện di, chụp gel) ở note trước.</p>

</div>

## Model được chọn

| Máy | Model | Hình | Mức |
|---|---|---|---|
| Máy quang phổ UV-Vis | Shimadzu UV-1900i | `figures/spectro/` (Fig 4) | Figure |
| Máy ly tâm | Eppendorf Centrifuge 5425, rotor FA-24×2 | `figures/centrifuge/` (Fig 5) | Figure |
| Kính hiển vi quang học | Olympus CX23 (CX23LEDRFS1) | `figures/microscope/` (Fig 6) | Figure |
| HPLC | Agilent 1260 Infinity II LC | `figures/hplc/` (Fig 7) | Hero |
| Máy real-time PCR (qPCR) | Bio-Rad CFX96 Touch | `figures/qpcr/` (Fig 8) | Figure |
| Máy đọc vi đĩa | Agilent BioTek Epoch 2 | `figures/platereader/` (Fig 9) | Figure |
| Máy đo nồng độ DNA | Thermo Scientific NanoDrop One | `figures/nanodrop/` (Fig 10) | Figure |
| Máy vortex và ly tâm mini | Scientific Industries Vortex-Genie 2, Labnet Spectrafuge Mini | `figures/vortex/` (Fig 11) | Figure |
| Nồi hấp tiệt trùng | Tomy SX-500 | `figures/autoclave/` (Fig 12) | Figure |
| LC-MS/MS | Shimadzu LCMS-8060 | `figures/lcms/` (Fig 13) | Hero |
| Tủ an toàn sinh học cấp II | Esco Airstream AC2-4S8-NS | `figures/bsc/` (Fig 14) | Figure |

## Máy quang phổ UV-Vis — Shimadzu UV-1900i

### Thông số
- Hãng, model: Shimadzu UV-1900i, máy UV-Vis hai chùm tia (double beam)
	- Nguồn: tờ thông số "UV-1900i Typical Specifications", Shimadzu C101-E161 (11/2019), https://www.wolflabs.co.uk/documents/Shimadzu_Spectrophotometer_UV-1900i.pdf ; tóm tắt: https://cenfac.um.edu.my/uv-1900i
	- Hãng ghi đây là giá trị điển hình, không phải giá trị bảo đảm
- Dải bước sóng 190–1 100 nm; khe phổ 1 nm; bước đặt 0,1 nm
- Độ đúng bước sóng ±0,3 nm (±0,05 nm ở vạch D2 656,1 nm); độ lặp ±0,025 nm
- Tốc độ dời bước sóng khoảng 29 000 nm/phút; tốc độ quét 3 000 đến 2 nm/phút
- Đèn: halogen 20 W và deuterium, tự đổi đèn theo bước sóng (đặt được 295–364 nm), tự chỉnh vị trí đèn
- Monochromator: cách tử toàn ký (holographic) blazed LO-RAY-LIGH, lắp kiểu Czerny-Turner
- Đầu thu: photodiode silicon
- Ánh sáng lạc: < 0,004 % ở 220 nm (NaI) và 340 nm (NaNO2); < 0,15 % ở 198 nm (KCl)
- Dải đo −4 đến 4 Abs, 0–400 %T
- Độ đúng quang học ±0,0015 Abs (0,5 Abs), ±0,002 (1,0), ±0,004 (2,0); độ lặp < ±0,00002 / 0,00003 / 0,00007 Abs; nhiễu < 0,00001 Abs (700 nm)
- Buồng mẫu trong 110 × 250 × 115 mm, hai chùm cách nhau 100 mm; cuvet chuẩn 10 mm chứa 2,5–4,0 mL
- Màn hình cảm ứng màu, có bút cảm ứng (máy thật không có bàn phím cứng); máy 450 × 501 × 244 mm, 16,6 kg, 140 VA

### Bộ phận để vẽ
- Vỏ: đế, sàn, vách trái, vách sau, khối trước có mặt nghiêng mang màn hình, khối điện tử sau buồng mẫu có khe gió, hông phải (chỉ còn dải dưới có khe gió và dải sau), nắp trên phía sau, công tắc bập bênh
- Màn hình cảm ứng (viền, thanh tiêu đề, λ, Abs, %T, khung phổ, 4 phím mềm), cổng USB, khe bút và bút
- Buồng mẫu: đế, vách phải (cắt thấp), 2 giá cuvet có tấm kẹp, cuvet thạch anh mẫu (vàng) và mẫu trắng, hộp đầu thu với 2 photodiode silicon, nắp bản lề phía sau (nửa trước đã cắt)
- Đế quang học đúc; hộp đèn: đế, vách tản nhiệt, bóng halogen có sợi đốt, đèn deuterium có cửa sổ, gương lật trên cột nam châm điện
- Bộ đơn sắc Czerny-Turner: khe vào, gương cầu lõm chuẩn trực, bàn xoay có vạch chia độ, cách tử, mô-tơ bước, gương cầu lõm hội tụ, khe ra, bánh lọc bậc 4 ô có mô-tơ
- Gương bán mạ chia chùm, gương gập (mỗi cái trên đế kẹp 45°)
- Bo điều khiển đèn ở vách sau; bộ nguồn có quạt và bo mạch chính ở góc trước phải; 2 dây, 1 khoen luồn dây
- Trên bàn: giá cuvet dãy chuẩn p-nitrophenol, thước, nhãn

### Số liệu dùng cho mô hình (`figures/spectro/model.mjs`)
- Beer–Lambert A = ε·l·c; T = 10^(−A); cuvet l = 1 cm
- p-nitrophenol (pH 9,8): ε405 = 18 500 L·mol⁻¹·cm⁻¹ (quy trình DEA của Sigma-Aldrich, https://www.sigmaaldrich.com/US/en/technical-documents/protocol/protein-biology/enzyme-activity-assays/enzymatic-assay-of-alkaline-phosphatase-diethanolamine-assay ; tài liệu khác ghi 18 300–18 400) (→ [Hoạt độ lipase bằng p-NPP](/blog/sinh-hoc/biology-project-and-lab-report/enzymology/01-hoat-do-lipase-bang-p-npp/))
- NADH: ε340 = 6 220 L·mol⁻¹·cm⁻¹; dải thứ hai ε259 ≈ 14 400
- Ánh sáng lạc: A_đo = −log10((T + s)/(1 + s)); s(λ) nội suy theo log giữa 0,15 % (198 nm) và 0,004 % (220 nm), giữ 0,004 % từ 220 nm trở lên
	- Ở 405 nm số đọc lệch 1 % khi A ≈ 3,3; ở 198 nm lệch 1 % khi A ≈ 1,3
- Mỗi lần đo: sai lệch hệ thống bằng 0,3 × độ đúng của hãng, cộng nhiễu Gauss theo độ lặp và nhiễu của hãng, kẹp trong −4…4 Abs
- Cách tử: m·λ = 2·d·cos φ·sin θ; 1 200 vạch/mm; φ = 32° → θ = 12,0° ở 300 nm, 16,3° ở 405 nm, 29,0° ở 700 nm
- Đổi đèn ở 340 nm: dưới 340 nm dùng D2, từ 340 nm dùng halogen
- Trong app (`src/core/spectro-lab.js`): dãy chuẩn 0–100 µM (A405 tới khoảng 1,85), mỗi chuẩn lệch ±1 % do pipet, mẫu chưa biết 30–300 µM (giả định), nền cuvet và đệm 0,03–0,08 Abs khi chưa đo mẫu trắng (giả định)

### Chỗ chưa xác minh
- Bố trí bên trong (vị trí đèn, gương lật, gương, cách tử, bánh lọc, bộ chia chùm, đầu thu, bo mạch, bộ nguồn): không có sơ đồ của hãng, vẽ theo cấu tạo điển hình của máy hai chùm Czerny-Turner
- Chọn đèn bằng gương lật nâng/hạ; bộ chia chùm bằng gương bán mạ cùng hai photodiode (có thể hãng dùng gương quay)
- Vị trí nắp buồng mẫu (suy từ ảnh trong tờ thông số); mật độ vạch cách tử 1 200 vạch/mm
- Độ rộng dải hấp thụ dạng Gauss (p-nitrophenolate σ ≈ 34 nm, NADH σ ≈ 24 nm); ε259 của NADH
- Ánh sáng lạc trên 340 nm (hãng không ghi); độ đúng quang học dưới 0,5 Abs (coi tỉ lệ với A)

### Tiến độ
- [x] Hình chi tiết máy quang phổ UV-Vis ✅ 2026-10-16
	- Thư mục `figures/spectro/` (Fig 4, mức Figure), dùng chung `model.mjs`; trong app bấm "Cận cảnh máy quang phổ" ở khu "Quang phổ, kính hiển vi", hoặc mở `#spectro`
	- Hình: tháo nắp trên và hông phải, thấy đường đi của ánh sáng: đèn → gương lật → khe vào → gương chuẩn trực → cách tử trên bàn xoay → gương hội tụ → khe ra → bánh lọc → bộ chia chùm → cuvet so sánh và cuvet mẫu → hai photodiode
		- Chùm trắng trước cách tử, đơn sắc sau cách tử, màu theo bước sóng; chùm sau cuvet mẫu yếu đi theo T
	- Thao tác: Space đo, S quét 300–700 nm, ← → bước sóng, ↑ ↓ nồng độ, M đổi mẫu, Enter mở/đóng nắp, 4 phím mềm trên màn hình
	- Nhận dữ liệu từ app (các mẫu vừa đo và A ở một bước sóng)
	- Kiểm tra: `audit passed`; `line ends: 0` ở cả hai giao diện, nắp đóng và mở; cận cảnh 4×; 390 px không cuộn ngang
	- Protocol trong app: "Máy quang phổ: đường chuẩn p-nitrophenol (405 nm)"

## Máy ly tâm — Eppendorf Centrifuge 5425 (rotor FA-24×2)

### Thông số
- Model: Eppendorf Centrifuge 5425 (không làm lạnh), rotor góc cố định FA-24×2, nắp rotor kín khí dung. Chọn 5425 thay vì 5424 vì manual 5425 có lỗi IMBAL khi nạp lệch.
	- Nguồn chính: [Operating manual Centrifuge 5425](https://www.eppendorf.com/product-media/doc/en/338022/Centrifugation_Operating-manual_Centrifuge-5425.pdf) (5405 900 027-03/122021)
	- Bán kính rotor: [Marshall Scientific](https://marshallscientific.com/Eppendorf-FA-24x2-Fixed-Angle-Rotor-p/ep-fa24x2.htm), [Sigma-Aldrich](https://b2b.sigmaaldrich.com/US/en/product/sigma/ep5495500006)
- Kích thước 24 × 39 × 24 cm (rộng × sâu × cao), 15,6 kg không rotor; rotor FA-24×2 nặng 797,5 g (manual mục 11.3)
- Tối đa 21 300 × g / 15 060 rpm (mục 3.3, 12.1). Đặt tốc độ 100–15 060 rpm (bước 10 rpm dưới 5 000, bước 100 rpm từ 5 000); lực 50–21 300 × g
- Rotor FA-24×2: 24 ống 1,5/2 mL, nghiêng 45°, bán kính lớn nhất 8,4 cm, tải tối đa 3,75 g mỗi lỗ
- Tăng tốc 15 s, phanh 15 s (mức ramp 9, mặc định); mức 0–9: tăng tốc 360…15 s, phanh 370…15 s (mục 11.5–11.6)
- Thời gian 5 s – 9:59 h hoặc ∞; "At set rpm": đếm giờ từ khi đạt 95 % tốc độ đặt
- An toàn: nắp chưa đóng thì không chạy (9.1); LID ERROR khi mở nắp lúc đang quay; IMBAL khi rotor nạp lệch (9.2); phím open nhả khoá nắp
- Công thức RCF (DIN 58 970, in trong [manual 5424](https://condor.depaul.edu/jmaresh/instruments/Instruments/Centrifuges/Operating%20manual%205424.pdf), mục 2.4.1): RCF = 1,118 × 10⁻⁵ × r(cm) × rpm²

### Bộ phận để vẽ
- Vỏ: đế có 4 chân cao su, sàn dập gân, vách trái và sau, mặt trên có lỗ buồng; khối trước có mặt nghiêng chứa màn hình LCD và phím (time ▲▼, speed ▲▼, rpm/rcf, open, short, start/stop)
- Nắp máy bản lề sau, cửa sổ quan sát tròn, móc khoá dưới mép trước
- Buồng ly tâm bằng thép; rotor nhôm 24 lỗ nghiêng 45°, vạch số lỗ, trục giữa; nắp rotor kín khí dung có núm vặn đỏ; ống 2 mL
- Động cơ có gân, mặt bích, ổ trục, côn dẫn động; đế động cơ trên 3 đệm cao su
- Công tắc lệch tâm (thân, giá, đòn bẩy, con lăn); cuộn hút khoá nắp có chốt
- Bo mạch: tụ, vi điều khiển, rơ-le, tản nhiệt với 3 MOSFET, 4 đầu cắm; 4 dây

### Số liệu dùng cho mô hình (`figures/centrifuge/model.mjs`)
- r_max = 8,4 cm; 15 060 rpm ↔ 21 300 × g; 12 000 × g → 11 304 rpm
- Tăng tốc đều: thời gian tới tốc độ đặt = 15 s × rpm/15 060; phanh đều 15 060 rpm / 15 s
- r_min = 5,85 cm (ước tính) → k ≈ 404 ở tốc độ tối đa (t = k/S)
- Ống nạp từng cặp đối diện (lỗ i và i + 12), cùng loại, cùng lượng mẫu; lệch tâm = độ lớn tổng véc-tơ khối lượng; máy cắt khi rpm vượt 15 060 × √(0,5 / lệch tâm) — một ống lẻ 2,5 g cắt ở khoảng 6 740 rpm
- Trong app (`src/core/centrifuge-lab.js`): cặn chắc khi (× g · phút) ≥ 25 000, lỏng khi ≥ 8 000 (giả định minh hoạ, theo quy trình thu tế bào E. coli khoảng 5 000 × g, 5–10 phút)

### Chỗ chưa xác minh
- r_min và hệ số k của FA-24×2 (hãng không công bố; ước tính từ cột mẫu 36 mm nghiêng 45°)
- Ngưỡng phát hiện lệch tâm và khối lượng ống rỗng 1,0 g (giả định)
- Vật liệu nắp rotor (vẽ trong mờ để thấy ống); kích thước chi tiết rotor
- Cấu tạo bên trong (động cơ, đệm, công tắc lệch tâm, cuộn hút, bo mạch) vẽ theo cấu tạo điển hình

### Tiến độ
- [x] Hình chi tiết máy ly tâm ✅ 2026-10-16
	- `figures/centrifuge/` (Fig 5, mức Figure, khoảng 72 bộ phận + 4 dây); trong app bấm "Cận cảnh máy ly tâm" ở khu "HPLC, ly tâm, đo DNA", hoặc mở `#centrifuge`
	- Hình: vỏ cắt nửa phải phía sau; rotor 24 lỗ với 6 ống cân bằng dưới nắp rotor trong mờ, buồng thép, động cơ trên đệm cao su, công tắc lệch tâm, cuộn hút khoá nắp, bo mạch; LCD hiện × g hoặc rpm, thời gian, khoá
	- Thao tác: Space chạy/dừng (đóng nắp → khoá → tăng tốc → quay → phanh → nhả khoá); Enter mở/đóng nắp, bị từ chối khi đang quay; B thêm ống lẻ → rung, cắt ở khoảng 6 740 rpm, báo IMBAL; R đổi rpm/× g
	- Kiểm tra: `audit passed`; `line ends: 0` ở cả hai giao diện khi nắp mở, nắp đóng, nạp lệch, sau khi dừng vì lệch tâm; cận cảnh 4×; 390 px không cuộn ngang
	- Protocol trong app: "Máy ly tâm: thu cặn vi khuẩn, cân bằng rotor"

## Kính hiển vi quang học — Olympus (Evident) CX23

### Thông số
- Model: Olympus/Evident CX23, bản hai mắt CX23LEDRFS1 (có vật kính 100× dầu). Nguồn: catalogue CX23 N8600083-032015 (https://micro-pro.com/Produktdownloads/48080_CX23_en.pdf), trang sản phẩm Evident (https://evidentscientific.com/en/products/upright/cx23)
- Kích thước 198 × 398 × 386 mm (rộng × sâu × cao), nặng 5,9 kg; đế 149 × 240 mm; mặt bàn cao 190 mm (theo bản vẽ kích thước)
- Hệ quang vô cực. Đèn LED 0,5 W gắn trong đế, tuổi thọ 20 000 giờ
- Tụ quang Abbe NA 1,25, dùng cho 4×–100×
- Lấy nét bằng nâng hạ bàn: hành trình thô 15 mm, có chốt chặn giới hạn trên; núm tinh chia vạch 2,5 µm; núm thô và tinh đồng trục, hai bên
- Mâm vật kính 4 lỗ cố định, quay vào trong; bàn cơ kiểu dây kéo, hành trình 76 × 30 mm
- Ống hai mắt nghiêng 30°, khoảng cách đồng tử 48–75 mm; thị kính 10×, FN 20
- Vật kính plan achromat: 4× NA 0,10 WD 27,8 mm; 10× NA 0,25 WD 8,0 mm; 40× NA 0,65 WD 0,6 mm; 100× dầu NA 1,25 WD 0,13 mm
- Vòng màu vật kính (Nikon, https://www.microscope.healthcare.nikon.com/resources/glossary/objective-lens-color-codes): 4× đỏ, 10× vàng, 40× xanh nhạt, 100× trắng; vòng đen là vật kính dầu

### Bộ phận để vẽ
- Đế: chân cao su, khay đáy, nắp đế, ổ cắm nguồn, khe thông gió; cổng đèn với thấu kính trường; góc trước phải cắt mở: tản nhiệt, bo LED, LED, thấu kính hội tụ, bo nguồn
- Thân: cột sau có hõm tay cầm, vai, phần nhô gắn mâm nghiêng 15°; ray dẫn hướng và thanh răng
- Núm: vòng chỉnh lực, núm thô có khía, núm tinh 40 vạch, cần chặn giới hạn
- Mâm vật kính và 4 vật kính có vòng màu (100× thêm vòng đen dầu)
- Đầu quan sát: đuôi én, khối hai mắt có thang đồng tử, hai thị kính có vòng diop và chụp mắt
- Bàn trượt, thước X/Y, hộp truyền động, núm X/Y đồng trục; kẹp mẫu có du xích
- Mẫu: lam kính 76 × 26 × 1 mm, lá kính 22 × 22 × 0,17 mm, vùng mẫu nhuộm, giọt dầu soi
- Tụ quang có màng chắn sáng (iris) và cần gạt; trên bàn: lọ dầu soi, khay lam, hộp lá kính, thước

### Số liệu dùng cho mô hình (`figures/microscope/model.mjs`)
- Độ phóng đại tổng = vật kính × thị kính 10×: 40×, 100×, 400×, 1000×
- Độ phân giải Rayleigh d = 0,61 λ / NA, λ = 550 nm → 3,36 / 1,34 / 0,52 / 0,27 µm
- Thị trường = FN 20 / độ phóng đại vật kính → 5 / 2 / 0,5 / 0,2 mm
- Độ sâu trường d = λn/NA² + n·e/(M·NA) (MicroscopyU, https://www.microscopyu.com/microscopy-basics/depth-of-field-and-depth-of-focus), e = 7,3 µm → 73 / 11,7 / 1,6 / 0,62 µm
- Khoảng cách đồng tiêu 45 mm (vật kính UIS/UIS2): đổi vật kính vẫn giữ nét
- 100× không có dầu: NA hiệu dụng ≤ 0,95, độ sáng 0,45, quang sai thêm 1,5 µm; dầu dính vật kính khô 40×: quang sai thêm 2,5 µm (định tính)
- Lấy nét trong app (`src/core/microscope-lab.js`): người dùng xoay tới khi ảnh trông nét, nên độ lệch còn lại là số lớn hơn giữa 0,4 × độ sâu trường (mức mắt còn nhận ra mờ) và góc xoay nhỏ nhất của tay 0,25° (núm thô ≈ 26 µm, núm tinh ≈ 0,07 µm). Kết quả: núm thô đủ nét ở 4×, từ 10× phải chỉnh lại bằng núm tinh; dùng núm thô ở 40×/100× thì có cảnh báo chạm lam. Góc 0,25° là giả định
- Mẫu: biểu bì hành nhuộm iodine (tế bào khoảng 230 × 80 µm, nhân 15 µm); phết máu Wright-Giemsa (hồng cầu 7,5 µm, bạch cầu 11 µm, tiểu cầu 2,5 µm)

### Chỗ chưa xác minh
- Núm thô 36,8 mm/vòng (số của CX33/CX43), núm tinh 100 µm/vòng, đồng tiêu 45 mm riêng cho vật kính CX23
- Các kích thước con ước lượng từ bản vẽ catalogue; góc nghiêng mâm 15°
- Hệ số tối và nhòe khi thiếu dầu (định tính); kích thước tế bào hành lấy từ bài thực hành đo bằng thước trắc vi
- Bên trong (bo LED, tản nhiệt, thấu kính hội tụ, thanh răng, cơ cấu dây kéo, màng chắn sáng) vẽ theo cấu tạo điển hình

### Tiến độ
- [x] Hình chi tiết kính hiển vi quang học ✅ 2026-10-16
	- `figures/microscope/` (Fig 6, khoảng 97 bộ phận); trong app bấm "Cận cảnh kính hiển vi" ở khu "Quang phổ, kính hiển vi", hoặc mở `#microscope`
	- Hình: CX23 nhìn từ trước-phải, góc đế cắt mở; ô tròn thị trường bên trái vẽ mẫu (biểu bì hành hoặc phết máu), ảnh đảo 180°, tỉ lệ theo thị trường, mờ theo mô hình lấy nét, tối khi thiếu dầu
	- Thao tác: ↑/↓ chỉnh thô, Shift+↑/↓ chỉnh tinh, Space hoặc 1–4 đổi vật kính, ←/→ dịch mẫu, O nhỏ/lau dầu, S đổi mẫu
	- Kiểm tra: `audit passed` (cả hành trình 15 mm của bàn và 4 tư thế mâm); `line ends: 0` ở cả hai giao diện mọi tư thế; cận cảnh 4×; 390 px không cuộn ngang
	- Trong app: protocol "Kính hiển vi: lấy nét từ 4× tới 100×" (5 bước, khu "Quang phổ, kính hiển vi"); bảng điều khiển chọn mẫu, vật kính, dầu soi và núm; hình cận cảnh mở với đúng vật kính, mẫu, dầu và vị trí bàn của người dùng
## Máy sắc ký lỏng hiệu năng cao (HPLC) — Agilent 1260 Infinity II LC

### Thông số
- Bơm bốn kênh G7111B: 180 × 396 × 436 mm; hai piston nối tiếp; dòng 0,001–10 mL/phút; áp tối đa 600 bar tới 5 mL/phút, 200 bar tới 10 mL/phút; dao động áp < 2 %; khử khí 4 kênh; trộn gradient áp thấp bằng van tỉ lệ
	- Nguồn: [Agilent InfinityLab LC Specification Compendium](https://chemistry.unt.edu/system/files/agilent_1260_infinity_ii_lc-mwd_specifications.pdf)
- Bộ tiêm Vialsampler G7129A: 320 × 396 × 468 mm; tiêm 0,1–100 µL tới 600 bar; 132 lọ 2 mL; độ lặp diện tích < 0,25 % RSD
- Buồng cột G7116A: 160 × 435 × 436 mm; từ 10 °C dưới nhiệt độ phòng tới 85 °C; 4 cột dài tới 300 mm ([datasheet 5991-7089EN](https://hpst.cz/sites/default/files/download/2021/11/customer_5991-7089en_1260_ii_mct_datasheet.pdf))
- Đầu dò VWD G7114A: đèn deuterium, 190–600 nm, hai chùm tia; tế bào đo G1314-60186: 10 mm, 14 µL, chịu 40 bar ([datasheet 5991-7082EN](https://hpst.cz/sites/default/files/download/2021/11/customer_5991-7082en_1260_ii_vwd_datasheet.pdf))
- Tủ dung môi 5067-6871: bốn chai 1–4 L; cột C18 4,6 × 150 mm, hạt 5 µm (cỡ phân tích phổ biến)

### Bộ phận để vẽ
- Chồng module từ dưới lên: bơm, bộ tiêm, buồng cột, đầu dò, tủ dung môi; nắp trước tháo ra, vách có khe gió, đèn trạng thái
- Bơm: bộ khử khí, van tỉ lệ 4 cuộn solenoid, van đầu vào, hai đầu bơm, piston sapphire, vít me, van bi đầu ra, bộ giảm chấn có cảm biến áp, van xả, bo điều khiển, khay và cảm biến rò rỉ
- Bộ tiêm: khay lọ, giá kim (ray, xe trượt, kim), bệ kim, bộ định lượng, van tiêm 6 cổng hai vị trí (stator, rãnh rotor, đai ốc), vòng mẫu
- Buồng cột: bộ trao đổi nhiệt, cột C18, kẹp cột, đầu đọc thẻ cột, cảm biến nhiệt
- Đầu dò: đèn deuterium, thấu kính, khe, cách tử, gương, bộ chia chùm, photodiode tham chiếu và mẫu, tế bào đo
- Tủ dung môi: 4 chai (A nước + 0,1 % formic acid, B acetonitrile, C methanol, D nước rửa) có lõi lọc; ống mao quản tới chai thải; laptop hiện sắc ký đồ

### Số liệu dùng cho mô hình (`figures/hplc/model.mjs`)
- Lưu giữ theo mô hình cường độ dung môi tuyến tính (Snyder): log k = log kw − S·φ (S ≈ 0,25·√M); theobromine, paracetamol, theophylline, caffeine với log kw, S minh hoạ, chọn đúng thứ tự rửa giải trên C18
- t0 = Vm/F, Vm = εT·π(d/2)²L, εT = 0,65 → t0 = 1,62 phút ở 1 mL/phút; tR = t0(1 + k)
- Số đĩa theo Knox h = ν^(1/3) + 2/ν + 0,05ν → N ≈ 10 500 ở 1 mL/phút; σ = tR/√N; Rs = Δt / (2(σ1 + σ2))
- Diện tích pic theo Beer–Lambert, ε ở 273 nm (caffeine 9 740, theophylline 10 200, theobromine 10 000, paracetamol 3 000, xấp xỉ)
- Áp suất theo Kozeny–Carman cộng 8 bar mỗi mL/phút; giới hạn bơm 600/200 bar, cột 400 bar; quá áp thì bơm dừng
- Ngẫu nhiên có seed: lưu lượng 0,07 % RSD, diện tích 0,25 % RSD, nhiễu nền 0,02 mAU

### Chỗ chưa xác minh
- Kích thước VWD G7114A (lấy bằng MWD G7165A), kích thước tủ dung môi
- log kw, S, ε từng chất, ΔH, bảng độ nhớt, hằng số Kozeny–Carman (minh hoạ, xấp xỉ); giới hạn áp 400 bar của cột; hành trình piston 100 µL
- Van vẽ kiểu vòng mẫu cố định cho dễ hiểu; máy thật G7129A dùng kim chảy qua với bộ định lượng trong đường áp cao
- Bên trong bơm, bộ tiêm, đầu dò vẽ theo cấu tạo điển hình

### Tiến độ
- [x] Hình chi tiết HPLC (Fig 7, mức Hero) ✅ 2026-10-16
	- `figures/hplc/` (189 món vẽ, 20 đường ống); trong app bấm "Cận cảnh HPLC" ở khu "HPLC, ly tâm, đo DNA", hoặc mở `#hplc`
	- Thao tác: Space tiêm (kim hút mẫu, van xoay sang tiêm, vùng mẫu chạy vào cột và tách ra, sắc ký đồ vẽ dần trên laptop); ← → % acetonitrile, ↑ ↓ lưu lượng; piston chạy theo nhịp thật, áp suất hiện trên màn hình
	- Kiểm tra: `audit passed` (không ống nào xuyên vật); `line ends: 0` ở cả hai giao diện mọi tư thế; cận cảnh 4× các mối nối; 390 px không cuộn ngang
	- Cột vẽ to hơn thật và cắt vỏ để thấy các dải tách chất (→ [LC-MS/MS](/blog/sinh-hoc/biology-project-and-lab-report/proteomics-and-structural-biology/06-sac-ky-long-khoi-pho-lc-ms-ms/))
	- Trong app (`src/core/hplc-lab.js`, sắc ký đồ `src/ui/trace-chart.js`): protocol "HPLC: định lượng caffeine trong nước giải khát" (đặt pha động, dãy chuẩn 10–100 µg/mL, tiêm mẫu pha loãng 1:1, dựng đường chuẩn); nồng độ thật của mẫu ngẫu nhiên 30–120 µg/mL kèm theobromine; % acetonitrile quá cao thì caffeine ra sát thời gian chết hoặc chồng pic bên cạnh (Rs < 1,5), đều có cảnh báo; hình cận cảnh mở với đúng phương pháp và mẫu vừa tiêm

## Máy real-time PCR (qPCR) — Bio-Rad CFX96 Touch

### Thông số
- Gồm khung C1000 Touch và mô-đun quang học CFX96 đặt trong khoang trên khung. Kích thước 33 × 46 × 36 cm, nặng 21 kg ([Bulletin 6093](https://www.bio-rad.com/webroot/web/pdf/lsr/literature/Bulletin_6093.pdf); [Bulletin 6238](https://commerce.bio-rad.com/sites/default/files/webroot/web/pdf/lsr/literature/Bulletin_6238.pdf))
- Block 96 giếng, 6 module nhiệt điện (Peltier) điều khiển độc lập, block giảm khối
	- Đổi nhiệt tối đa 5 °C/s, trung bình 3,3 °C/s
	- Dải nhiệt 0–100 °C; sai số ±0,2 °C ở 90 °C; đồng đều ±0,4 °C sau 10 s
	- Nắp gia nhiệt tới 105 °C; gradient 30–100 °C, rộng 1–24 °C
- Quang học: 6 LED có kính lọc kích thích, 6 photodiode có kính lọc thu, 450–730 nm. Đầu quang học (optics shuttle) chạy ngay trên đĩa, chiếu và đo từng giếng
	- Kênh 1 FAM / SYBR Green: kích thích 450–490 nm, thu 510–530 nm
	- Kênh 2 HEX: 515–535 / 560–580 nm
	- Kênh 3 Texas Red: 560–590 / 610–650 nm
	- Kênh 4 Cy5: 620–650 / 675–690 nm
	- Kênh 5 Quasar 705: 672–684 / 705–730 nm
	- Kênh 6 dành cho FRET
	- Quét đủ kênh 12 s, quét nhanh một kênh 3 s; khoảng động 10 bậc độ lớn; phát hiện 1 bản sao trong DNA bộ gen người
- Màn hình cảm ứng trên khung, chạy được không cần máy tính; cổng USB B ở sau khung ([Installation Quick Guide 10021418](https://www.uottawa.ca/faculty-medicine/sites/g/files/bhrskd401/files/2022-09/CFX96%20Touch%20and%20CFX96%20Touch%20Deep%20Well%20Systems%20Installation%20Guide.pdf))
- Chương trình SYBR cho máy CFX ([SsoAdvanced SYBR Green, manual 10031339, bảng 2](https://www.bio-rad.com/webroot/web/pdf/lsr/literature/10031339.pdf))
	- 95 °C 30 s (cDNA), rồi 35–40 chu kỳ: 95 °C 5–15 s, sau đó 60 °C 10–30 s kèm đọc đĩa
	- Đường nóng chảy 65–95 °C, bước 0,5 °C, 2–5 s mỗi bước; phản ứng 20 µL
	- Sản phẩm đặc hiệu cho một đỉnh nóng chảy quanh 85–87 °C; dimer mồi cho đỉnh quanh giữa 70 °C
	- Hiệu suất nên 90–110 % (độ dốc −3,6 đến −3,1); E = 10^(−1/độ dốc) − 1

### Bộ phận để vẽ
- Khung C1000 Touch: vỏ, bốn chân cao su, khoang mô-đun; mặt nghiêng mang màn hình cảm ứng, cổng USB, nút nguồn; hai lưới hút gió trước, khe gió hông
- Bên trong khung (hông phải cắt bỏ): bộ nguồn, bo mạch trên cột đỡ (MOSFET có tản nhiệt, tụ, chip), gân sàn, quạt, 4 dây
- Mô-đun CFX96: đế có lỗ đĩa, khe khoá, hai tai bản lề; đệm xốp quanh block; block nhôm có rãnh giảm khối, cảm biến nhiệt; 6 Peltier (gốm lạnh, viên bán dẫn, gốm nóng); tản nhiệt 12 cánh; đĩa 96 giếng góc vát A1
- Nắp bản lề (phần trên bên phải cắt bỏ): tay nắm, đèn trạng thái, tấm gia nhiệt 96 lỗ, thanh trượt và xe trượt, đầu quang học (thấu kính, hàng 6 LED màu theo kênh, hàng 6 photodiode)

### Số liệu dùng cho mô hình (`figures/qpcr/model.mjs`)
- Chương trình: 95 °C 30 s; 40 chu kỳ 95 °C 10 s, 60 °C 30 s và đọc 3 s; nóng chảy 65→95 °C, bước 0,5 °C, 5 s, 61 lần đọc. Tổng khoảng 52 phút; đổi nhiệt 3,3 °C/s; phần chu kỳ dựng bằng `timeline()` của `figures/thermocycler/model.mjs`
- Số bản N(c) = N0·(1+E)^c. Tín hiệu F = nền + trôi·c + Fmax·N/(N+K) + nhiễu. Trừ nền bằng đường thẳng khớp từ chu kỳ 3
- Ngưỡng ở N_th = 10¹¹ bản (400 RFU), suy từ Cq 19,81 ± 0,10 ở 10⁵ bản (Bulletin 6093). Ct lấy ở chu kỳ đầu tiên vượt ngưỡng, nội suy tuyến tính; độ dốc −3,32 khi E = 100 %
- Ngẫu nhiên có seed: số khuôn theo Poisson khi dưới 10⁴ bản; sai số hút mẫu 7 % (độ lệch Ct quanh 0,1); Tm mỗi giếng lệch ±0,15 °C
- Dãy mẫu 10⁶→10² bản, E = 0,95, cùng một NTC: Ct khoảng 17,2 / 20,8 / 24,1 / 27,6 / 31,2; độ dốc −3,48, E ≈ 94 %, R² 0,9997; NTC lên ở Ct khoảng 37–39 do dimer mồi (đỉnh 75,5 °C), sản phẩm 85,5 °C

### Chỗ chưa xác minh
- Chiều cao khung (khoảng 20 cm) và mô-đun (khoảng 16 cm) ước từ ảnh; góc mở nắp 62° và vị trí bản lề
- Cơ cấu đầu quang học, bố trí tản nhiệt, quạt và bo mạch: vẽ theo cấu tạo điển hình, không có sơ đồ của hãng. Block dời 20 mm sang phải cho thấy qua ô cắt
- Giả định minh hoạ: K = 10¹², Fmax = 4 400 RFU, nền 220 RFU, trôi 1,2 RFU/chu kỳ, nhiễu 4 RFU; dimer mồi khoảng 60 phân tử ban đầu, hiệu suất 80 %, tín hiệu 0,4 lần sản phẩm; độ rộng chuyển pha nóng chảy 0,55 °C (sản phẩm), 0,9 °C (dimer); SYBR Green giảm 1,2 % mỗi °C
- Phần mềm CFX đặt ngưỡng tự động (thường 10 × độ lệch chuẩn nền); mô hình dùng ngưỡng cố định

### Tiến độ
- [x] Hình chi tiết máy real-time PCR (Fig 8, Bio-Rad CFX96 Touch) ✅ 2026-10-16
	- `figures/qpcr/` (khoảng 120 bộ phận); trong app bấm "Cận cảnh máy qPCR" ở khu "Máy PCR, điện di", hoặc mở `#qpcr`
	- Thao tác: Space chạy, Enter mở/đóng nắp, ← → đổi tốc độ, Escape đặt lại. Khi đọc đĩa, đầu quang học quét và giếng sáng xanh; màn hình vẽ đường khuếch đại, ngưỡng, Ct, rồi đường nóng chảy −dF/dT, Tm, E và R²
	- Kiểm tra: `audit passed`; `line ends: 0` ở hai giao diện, nắp đóng và mở; cận cảnh 4×; 390 px không cuộn ngang

## Máy đo nồng độ DNA — Thermo Scientific NanoDrop One

### Thông số
- Model: Thermo Scientific NanoDrop One (ND-ONE-W). Bản OneC (ND-ONEC-W) có thêm khe cuvet; hình vẽ bản One.
- Nguồn chính: tờ thông số PS52754_E 0220 — https://assets.thermofisher.com/TFS-Assets/CAD/Specification-Sheets/NanoDrop-One-Specifications.pdf
	- Thể tích mẫu tối thiểu 1 µL, đo trên bệ (pedestal), không cần cuvet.
	- Giới hạn phát hiện dsDNA 2,0 ng/µL (bệ); nồng độ tối đa 27 500 ng/µL dsDNA.
	- Dải quang học (quy về 10 mm) 0–550 A trên bệ; độ đúng 3 % ở 0,97 A, 302 nm.
	- Độ lặp điển hình 0,002 A (quang lộ 1,0 mm) hoặc 1 % CV, lấy giá trị lớn hơn.
	- Bước sóng 190–850 nm, độ đúng ±1 nm, độ phân giải ≤ 1,8 nm (FWHM, vạch Hg 254 nm).
	- Quang lộ 0,030–1,0 mm, tự chọn (auto-ranging).
	- Nguồn sáng: đèn chớp xenon. Đầu thu: cảm biến ảnh tuyến tính CMOS 2048 điểm.
	- Thời gian đo và xử lý 8 s.
	- Màn hình cảm ứng 7 inch 1280 × 800, Android; ba cổng USB-A, Ethernet, Wi-Fi/Bluetooth.
	- Kích thước 20 × 25,4 × 32,3 cm (rộng × sâu × cao), 3,6 kg, 12 V DC, 12–18 W khi đo.
- Acclaro (FAQ FL52778 — https://documents.thermofisher.com/TFS-Assets/MSD/Product-Bulletins/FL52778-NanoDrop-One-FAQs.pdf):
	- Nhận diện protein, phenol, guanidine HCl, guanidine isothiocyanate trong mẫu DNA.
	- Có cảm biến và phân tích ảnh theo dõi cột mẫu để phát hiện bọt khí.
- Độ sạch (Thermo T042 "260/280 and 260/230 Ratios", Rev 3/09 — https://agtc.umd.edu/files/Note-on-the-260_280-and-260_230-Ratios.pdf):
	- 260/280 ≈ 1,8 là DNA sạch, ≈ 2,0 là RNA sạch. Thấp hơn gợi ý protein hoặc phenol.
	- Dung dịch acid làm 260/280 thấp đi 0,2–0,3, dung dịch kiềm làm cao lên 0,2–0,3.
	- 260/230 thường 2,0–2,2. EDTA, carbohydrate, phenol, guanidine HCl hấp thụ quanh 230 nm.
	- TRIzol hấp thụ ở 230 và khoảng 270 nm. Nền hiệu chỉnh ở 340 nm.
- Hệ số đổi (Thermo, NanoDrop 2000c FAQs — https://www.thermofisher.com/order/catalog/product/ND-2000C/faqs): c = A260 (10 mm) × 50 (dsDNA), 33 (ssDNA), 40 (RNA) ng·cm/µL.

### Bộ phận để vẽ
- Đế và vỏ: đế tối bo góc; thân vỏ trắng có bốn góc bo; mặt trên ghép bốn tấm quanh lỗ dưới tháp; cổng USB-A mặt trước.
	- Hông phải tháo tấm che để thấy bên trong.
- Tháp sau màu tối, hông phải cắt hở để thấy sợi quang nguồn đi lên.
	- Hai tai bản lề trên mặt trước tháp.
	- Giá nghiêng hình nêm và máy tính bảng 7" nghiêng 32°.
- Cần mẫu (cánh tay bản lề): khớp quay, thân thuôn, đầu cần có miếng tì ngón tay.
	- Bệ trên bằng thép với mũi ferrule chứa đầu sợi quang nguồn.
- Mặt máy: vòng đèn acrylic sáng xanh; đế thép bệ đo có ba vít.
	- Bệ dưới bằng thép với mũi ferrule chứa sợi quang thu.
	- Giọt mẫu, hoặc cột chất lỏng 1 mm khi hạ cần.
- Bên trong:
	- Đèn chớp xenon: bo đèn, tấm phản quang, hai đui, bóng đèn, ống thấu kính, đầu nối SMA.
	- Bo kích đèn: tụ cao áp, biến áp kích, hai đầu cắm.
	- Máy quang phổ kiểu Czerny-Turner, bỏ nắp và cắt thấp các vách: khối cổng vào với SMA và khe, gương chuẩn trực, cách tử, gương hội tụ, bo và cảm biến CMOS, đầu cắm. Đường tia sáng hiện khi đèn chớp.
	- Bo mạch chính trên bốn trụ: chip xử lý, hai chip nhớ, cuộn cảm, hai tụ, cổng USB-A, ba đầu cắm.
	- Giá giữ ferrule dưới bệ đo; ống xuyên vách trong tháp.
	- Sợi quang nguồn (đèn → tháp → cần) và sợi quang thu (bệ dưới → máy quang phổ); dây đèn, dây kích, dây máy quang phổ, cáp màn hình.
- Trên bàn: giá treo pipet; pipet P2 (tip 10 µL, cửa sổ số 1,50); giá ống 12 lỗ với ống 1,5 mL mở nắp; khăn giấy lau bệ.

### Số liệu dùng cho mô hình (`figures/nanodrop/model.mjs`)
- c = A260 (10 mm) × 50 / 33 / 40.
- Quy đổi quang lộ: A(10 mm) = A thô × 10 / quang lộ (mm).
- Tự chọn quang lộ từ dãy 1,0 · 0,2 · 0,1 · 0,05 · 0,03 mm: lấy quang lộ dài nhất có A thô ở 260 nm ≤ 1,5.
	- Kiểm tra chéo: 550 A × 0,03/10 = 1,65 A thô, và 550 × 50 = 27 500 ng/µL đúng như hãng ghi.
- Nhiễu: thang chung 1 % CV; mỗi bước sóng ±0,002/√2 A thô, nên hiệu (điểm − nền 340 nm) có độ lệch chuẩn đúng 0,002 A.
	- Ở 10 ng/µL dsDNA, độ lệch chuẩn khoảng 1,4 ng/µL; giới hạn phát hiện 2 ng/µL tương ứng 0,04 A.
- Tỉ số mẫu sạch (TE pH 8): dsDNA 1,85 / 2,2; RNA 2,05 / 2,2; ssDNA 1,8 / 2,1. pH < 7,5 làm 260/280 thấp đi tới 0,25 (nước pH 6 → −0,25).
- BSA: A280 1 mg/mL = 0,667; dáng phổ protein có 260/280 ≈ 0,58.
- Phenol: ε270 ≈ 1,45 mM⁻¹cm⁻¹, đỉnh 270 nm, cộng phần dải 210 nm.
- Guanidine HCl, carbohydrate, EDTA: dáng e^(−(λ−230)/9), tính bằng "A230 góp vào" (10 mm).
- Dung dịch đệm: nước A230 = 0, pH 6; TE A230 = 0,0045, pH 8 (1/100 phổ EDTA 0,1 M ở T042 Hình 2); EB A230 = 0,002, pH 8,5.
- Lỗi máy báo: chưa đo mẫu trắng; không có mẫu; dưới 1 µL thì cột đứt; bọt khí. Dưới giới hạn phát hiện hiện "< 2,0"; vượt dải hiện "> 27 500".

### Chỗ chưa xác minh
- Bố trí bên trong vẽ theo cấu tạo điển hình, không có sơ đồ của hãng: đường sợi quang, bố cục Czerny-Turner, bo mạch, mô-đun đèn.
- Sợi nguồn ở cần (bệ trên), sợi thu ở bệ dưới: theo manual NanoDrop 2000 (qua nguồn thứ cấp). Hướng dẫn NanoDrop Lite ghi ngược lại; với One *chưa xác minh*.
- Kích thước bệ và mũi ferrule (đường kính khoảng 2,5 mm) là ước lượng.
- Dãy quang lộ cụ thể và ngưỡng đổi quang lộ (A thô 1,5) là minh hoạ; hãng chỉ ghi dải 0,030–1,0 mm.
- Dáng phổ từng chất là minh hoạ. Guanidine tính bằng "A230 góp vào" vì chưa có hệ số hấp thụ có nguồn; ε270 của phenol chưa đối chiếu nguồn gốc.
- Chiều cao các tầng (mặt máy 120 mm, bản lề 146 mm, màn nghiêng 32°) ước lượng từ ảnh hãng; tổng cao khoảng 324 mm, khớp 32,3 cm.
- Ảnh cột mẫu trên màn hình là biểu diễn ý tưởng camera Acclaro, không theo giao diện thật của máy.

### Tiến độ
- [x] Hình chi tiết máy đo nồng độ DNA (Fig 10, NanoDrop One) ✅ 2026-10-16
	- `figures/nanodrop/` (khoảng 96 bộ phận, 6 cáp và sợi quang); trong app bấm "Cận cảnh máy đo DNA" ở khu "HPLC, ly tâm, đo DNA", hoặc mở `#nanodrop`
	- Thao tác: P nhỏ mẫu (pipet hút từ ống 1,5 mL rồi nhỏ 1,5 µL lên bệ), Enter hạ hoặc dựng cần, Space đo, W lau bệ, Escape xoá kết quả. Khi đo: đèn xenon chớp, phổ 220–350 nm vẽ dần, rồi hiện nồng độ, A260, 260/280, 260/230 và cảnh báo độ sạch. Thời gian đo rút ngắn (thật 8 s)
	- Kiểm tra: `audit passed`, `line ends: 0` ở hai giao diện × cần dựng và cần hạ; cận cảnh 4×; 390 px không cuộn ngang

## Máy đọc vi đĩa (microplate reader) — Agilent BioTek Epoch 2

### Thông số
- Model vẽ: **Agilent BioTek Epoch 2**, cấu hình EPOCH2TS (màn hình cảm ứng, không cổng cuvet). Hình dáng theo ảnh bản EPOCH2TSC ([New Life Scientific](https://newlifescientific.com/products/biotek-epoch-2-absorbance-spectrophotometer-microplate-reader-epoch2tsc-cuvette)); không vẽ logo, tên hãng.
- Nguồn: tờ thông số Agilent 5994-7629EN, 06/2025 ([bản trong hồ sơ thầu](https://storage.mtender.gov.md/get/15edd0aa-ae9e-4036-8ac4-6788a64f5c3c-1763554218271); bản gốc Agilent 5994-5374EN chặn tải tự động) và bản tiếng Nhật 5994-2742JAJP ([chem-agilent](https://www.chem-agilent.com/pdf/biotek-ds-epoch-2-microplate-spectrophotometer-5994-2742ja-jp-hr-agilent.pdf)).
	- Quang học: xenon flash, photodiode, monochromator 200–999 nm (bước 1 nm), độ rộng dải 2,9 nm, độ đúng bước sóng ±2 nm, độ lặp ±0,2 nm.
	- Dải đo 0–4,0 OD; phân giải 0,001 OD (phần mềm trên máy) / 0,0001 OD (Gen5).
	- Độ đúng OD < 1 % ở 2,0 OD, < 3 % ở 2,5 OD; tuyến tính < 1 % (0–2,5 OD); độ lặp < 0,5 % ở 2,0 OD (bản JP; bản 2025 ghi < 1 % trong 0–2,5 OD); ánh sáng lạc 0,03 % ở 230 nm.
	- Đọc quét 96 giếng 8 s, 384 giếng 14 s. Vi đĩa 6–384 giếng, đĩa Take3, cuvet (tuỳ chọn).
	- Ủ 4 vùng tới 65 °C có chống đọng hơi; lắc thẳng, quỹ đạo, quỹ đạo kép.
	- Nguồn ngoài 24 V DC, tối đa 60 W; 32 × 32,3 × 39,54 cm (cao × rộng × sâu, bản cảm ứng), 11,34 kg; USB 2.0.
- Vi đĩa chuẩn ANSI/SLAS: 127,76 × 85,48 × 14,35 mm, A1 cách mép 14,38 / 11,24 mm, bước 9 mm. Giếng Corning đáy phẳng (ví dụ 3590): miệng 6,86 mm, đáy 6,35 mm, sâu 10,67 mm, tối đa 360 µL ([Corning](https://csmedia.corning.com/catalog/cls/documents/drawings/MicroplateDimensions96-384-1536.pdf)).
- Bradford: Bio-Rad Quick Start (manual 4110065A, [bản PDF](https://text.www2.warwick.ac.uk/fac/sci/chemistry/research/bugg/bugggroup/protocols/protein/biorad_proteinassay.pdf)): vi đĩa 5 µL mẫu + 250 µL thuốc thử, 595 nm, BSA 125–2 000 µg/mL, tuyến tính 125–1 000 µg/mL; Coomassie G-250 tự do dạng cation đỏ nâu (470 nm), gắn protein thành dạng xanh (595 nm).
- p-nitrophenol: ε405 = 18 500 L·mol⁻¹·cm⁻¹ ở pH ≥ 9,8 ([Sigma-Aldrich](https://www.sigmaaldrich.com/US/en/technical-documents/protocol/protein-biology/enzyme-activity-assays/enzymatic-assay-of-alkaline-phosphatase-diethanolamine-assay)), cùng hằng số với hình UV-Vis.

### Bộ phận để vẽ
- Vỏ: đế viền tối, vách, mặt trước quanh ô cửa, mũ nghiêng có màn hình cảm ứng, nắp trên có khe thông gió; cắt hông phải, nắp trên phía sau bên phải và góc phải của mũ.
- Mặt trước: cửa lật khe khay, công tắc bập bênh, nút nguồn đèn xanh, màn hình cảm ứng và bo màn hình.
- Bàn trượt: hai ray Y, khối trượt, dầm X, ray X, con trượt, khung khay có lò xo kẹp, vi đĩa 96 giếng tô màu dung dịch.
- Truyền động: động cơ bước Y và X, đai, puli, kẹp đai.
- Quang học: đèn xenon, bánh lọc bậc, thấu kính, monochromator, photodiode tham chiếu, sợi quang tới đầu quang, chùm sáng xuyên giếng, đầu thu photodiode dưới khay.
- Điện tử: bo mạch chính (vi điều khiển, ADC, driver động cơ, mạch nạp đèn chớp), ổ cắm DC, bộ nguồn 24 V, laptop và dây USB.

### Số liệu dùng cho mô hình (`figures/platereader/model.mjs`)
- Quang trình l = chiều cao cột chất lỏng trong giếng nón cụt: 100 µL → 0,309 cm; 200 µL → 0,604 cm; 255 µL → 0,761 cm (bỏ qua mặt khum; đo thật thường 0,55–0,6 cm cho 200 µL).
- Nhiễu máy σ = 0,25 % · A + 0,0005 OD (coi độ lặp 0,5 % ở 2 OD là khoảng 2σ); lệch hệ thống cả đĩa ±0,5 %; ánh sáng lạc 0,03 % làm bão hoà OD cao; trên 4,0 OD báo "OVRFLW"; làm tròn 0,001 OD.
- Nền giếng polystyrene có chất lỏng không màu 0,045 OD (*ước lượng, chưa xác minh*).
- Bradford ở 255 µL: mẫu trắng 0,45; A thực = 2,25·c/(3 000 + c), c tính bằng µg/mL (*dáng đường chuẩn ước lượng, chưa xác minh*). Hồi quy tuyến tính toàn dãy R² ≈ 0,977, trong khoảng 125–1 000 µg/mL R² ≈ 0,993, nên nội suy toàn dãy bị lệch (bài học về khoảng tuyến tính).
- pNP 200 µL: 200 µmol/L → 2,28 OD; R² ≈ 0,9997. Động học phosphatase kiềm theo Michaelis–Menten, Km 0,5 mM (*điển hình, chưa xác minh*).
- Sai số pipet CV 2 % (5 µL) và 1 % (200–250 µL) (*ước lượng*).
- Đọc quét 8 s cho 96 giếng, theo cột kiểu rắn bò (A→H rồi H→A).

### Chỗ chưa xác minh
- Bố trí bên trong (đèn, bánh lọc bậc, monochromator, sợi quang, đầu quang phía trên và photodiode phía dưới, photodiode tham chiếu, bàn trượt X/Y, bo mạch): hãng không công bố sơ đồ, vẽ theo cấu tạo điển hình. Chưa rõ máy thật chiếu sáng từ trên hay dưới; một kênh quang suy ra từ "photodiode" số ít.
- Cửa khe khay lật vào trong theo bản lề trên: suy đoán. Hướng đặt đĩa (A1 ở góc sau bên trái): chưa xác minh.
- Màn hình trên mũ vẽ lệch trái khoảng 40 mm để chừa chỗ cho phần cắt góc mũ.
- Chữ "OVRFLW" của Gen5, dáng đường chuẩn Bradford, nền đĩa 0,045, Km: chưa kiểm chứng nguồn gốc.

### Tiến độ
- [x] Hình chi tiết máy đọc vi đĩa (Fig 9, Agilent BioTek Epoch 2) ✅ 2026-10-16
	- `figures/platereader/` (133 mục vẽ, khoảng 70 bộ phận chức năng, 4 dây); trong app bấm "Cận cảnh máy đọc vi đĩa" ở khu "HPLC, ly tâm, đo DNA", hoặc mở `#platereader`
	- Thao tác: Space đưa khay vào rồi đọc quét 96 giếng trong 8 s (khay chạy X/Y, đèn chớp, chùm sáng xuyên giếng); bản đồ OD hiện dần trên màn hình và laptop, sau đó là đường chuẩn có R². Enter đưa khay ra hoặc vào qua cửa lật
	- Kiểm tra: `audit passed` (cả hai đầu hành trình X ±49,5 mm); `line ends: 0` ở hai giao diện, khay ra, khay vào, giảm chuyển động; cận cảnh 4×; 390 px không cuộn ngang

## Máy vortex và máy ly tâm mini — Scientific Industries Vortex-Genie 2, Labnet Spectrafuge Mini

### Thông số
- **Máy vortex: Scientific Industries Vortex-Genie 2** (SI-0236 bản 120 V, SI-0256 bản 230 V EU)
	- Tốc độ 600–3200 rpm (2700 rpm với bản 50 Hz); kèm cup bật ra (pop-off cup) và đĩa 3 inch. Nguồn: [Genie Product Catalog](https://www.labrepco.com/wp-content/uploads/2018/11/Scientific-Industries-Genie-Product-Catalog.pdf)
	- Kích thước 165 × 122 × 165 mm (sâu × rộng × cao), nặng 4 kg; điều khiển "Hands-Free or Touch-On" (cùng nguồn)
	- Quỹ đạo đường kính 4 mm: catalog ghi ở máy Vortex-Genie 2 Platform "Orbit 4mm dia. (Same as Vortex-Genie 2)"; [Fisher Scientific](https://www.fishersci.ca/shop/products/vortex-genie-2-10/01804423) và [Marshall Scientific](https://new.marshallscientific.com/-p/SI-0236.htm) cũng ghi 4 mm
	- Công tắc 3 vị trí: bật liên tục / tắt / chạm (theo listing nhà phân phối)
- **Máy ly tâm mini: Labnet Spectrafuge Mini C1301**
	- Tốc độ cố định 6000 rpm, 2000 × g (1177 × g với rotor ống dải PCR); rotor 6 × 1,5/2,0 mL hoặc 2 dải 8 × 0,2 mL. Nguồn: [Remma](https://remma.fr/en/model/spectrafuge-c1301-centrifuge)
	- 15 × 15 × 11,7 cm (rộng × sâu × cao), 0,45 kg; bản lề thép không gỉ
	- Bật/tắt bằng công tắc bên hông hoặc chỉ cần đóng/mở nắp. Nguồn: [SelectScience](https://www.selectscience.net/product/spectrafuge-mini-centrifuge)
	- Đã xem và bỏ: Thermo mySPIN 6 chạy bằng công tắc nguồn, nắp chỉ khoá an toàn ([manual 50145670 Rev F](https://knowledge1.thermofisher.com/@api/deki/files/3558/50145670-f_mySPIN_6_Mini_Centrifuge_Instruction_Manual.pdf)); Corning LSE 6770 chạy khi đóng nắp nhưng rotor 8 chỗ ([Corning](https://ecatalog.corning.com/life-sciences/b2b/US/en/p/6770))

### Bộ phận để vẽ
- **Máy vortex**
	- Đế gang chống rung, 4 chân cao su kiểu giác hút; vỏ có mặt nghiêng điều khiển, hông phải cắt bỏ
	- Điều khiển: núm tốc độ có khía, kim và thang 0–10; công tắc bập bênh 3 vị trí; tấm nhãn
	- Cơ cấu: 3 đệm cao su, giá mô tơ, mô tơ, đối trọng nửa đĩa, cam lệch tâm 2 mm, trụ đỡ cup; công tắc chạm và cần gạt dưới giá mô tơ
	- Vành cao su che lỗ, cup cao su có lõm ở đỉnh; bo mạch có tụ, tản nhiệt, triac; 3 dây
	- Mẫu: ống 1,5 mL có 500 µL mẫu, ngón tay đeo găng giữ ống
- **Máy ly tâm mini**
	- Vỏ có công tắc bập bênh bên phải, góc trước-phải cắt bỏ một phần tư
	- Buồng rotor, mô tơ 12 V, công tắc lưỡi gà dưới mặt trước, bo mạch
	- Rotor: mặt bích, trụ giữa, 6 tay đỡ, 6 cốc đỡ đáy ống, 6 ống (nắp, mẫu 250 µL, giọt bám thành)
	- Nắp: vòm trong có màu, lưỡi cài, khớp bản lề
- Trên bàn: giá 10 lỗ với 3 ống, thước, tấm nhãn "TRỘN · LY TÂM"

### Số liệu dùng cho mô hình (`figures/vortex/model.mjs`)
- Quỹ đạo: bán kính lệch tâm e = 2 mm; gia tốc tâm cup = ω²e. Ở 2500 rpm: 41,7 Hz, 0,52 m/s, 14,0 g
- RCF = 1,118 × 10⁻⁵ × r (cm) × n². Bán kính suy ra từ hai số của hãng: r_max = 2000 / (1,118 × 10⁻⁵ × 6000²) = 4,97 cm; rotor ống dải r = 2,92 cm. Rotor góc cố định 45°, đáy ống ở r_max
- Ống 1,5 mL: đường kính ngoài 10,8 mm, trong 8,8 mm, dài 38,5 mm, phần côn 17 mm
- Giả định (chưa xác minh): tăng tốc hằng số thời gian 1,0 s (95 % sau 3,0 s); dừng hằng số 1,2 s (dưới 20 rpm sau 6,8 s)
- Minh hoạ, không có nguồn đo:
	- Phễu xoáy Δ = (η·ω·R)²/(2g) với η = 0,25; chỉ hình thành khi Fr = ω²e/g > 1, đầy đủ khi Fr ≥ 3. Ở 2500 rpm: 4,2 mm
	- Thời gian trộn t = 2 s × (3200/rpm)² × (V/100 µL)^(1/3): khoảng 5,6 s cho 500 µL ở 2500 rpm; dưới Fr = 1 (khoảng 670 rpm) không trộn được
	- Gom giọt: giọt bắt đầu trượt khi RCF > 50 × g; gom xong khi ∫(RCF − 50) dt = 6000 g·s, tức khoảng 4,6 s kể từ lúc đóng nắp
- Núm vặn: giả định thang 0–10 tuyến tính với 600–3200 rpm

### Chỗ chưa xác minh
- Quỹ đạo 4 mm chưa đối chiếu manual của hãng; tờ quảng cáo cũ ghi "large 6 mm orbit"
- Thang núm vặn và quan hệ vạch–rpm; vị trí núm và công tắc vẽ theo ảnh sản phẩm
- Bên trong máy vortex (mô tơ trên đệm cao su, cam lệch tâm, đối trọng, công tắc chạm, bo triac): vẽ theo cấu tạo điển hình
- Spectrafuge Mini: thời gian tăng tốc, có phanh điện tử hay quay trơn, hình dạng rotor (vẽ kiểu tay đỡ hở), công tắc lưỡi gà, mô tơ 12 V; góc rotor 45°: vẽ theo cấu tạo điển hình

### Tiến độ
- [x] Hình chi tiết máy vortex và ly tâm mini (Fig 11) ✅ 2026-10-16
	- `figures/vortex/` (khoảng 70 bộ phận khác nhau, 110 mục vẽ, 5 dây); trong app bấm "Cận cảnh máy vortex" ở khu "Quang phổ, kính hiển vi", hoặc mở `#vortex`
	- Thao tác: V hoặc Space ấn/nhả ống trên cup (chất lỏng xoáy thành phễu); ← → tốc độ 600–3200 rpm; M đổi công tắc bật / tắt / chạm; C đóng/mở nắp máy ly tâm (đóng là chạy tới 6000 rpm, mở là dừng)
	- Kiểm tra: `audit passed`; `line ends: 0` ở sáng và tối, nắp mở, nắp đóng, giảm chuyển động; cận cảnh 4×; 390 px không cuộn ngang

## Nồi hấp tiệt trùng — Tomy SX-500

### Thông số
- Hãng, model: Tomy Seiko / Tomy Digital Biology **SX-500** (dòng SX-300/500/700), nồi hấp đứng, nạp từ trên, có bánh xe.
	- Nguồn chính: Operator's Manual ID 21006.12 (01/2014), https://groups.oist.jp/sites/default/files/imce/u430/TOMY_Autoclave.pdf
	- Bảng thông số bản CE: https://sterilizers.com/SX-Vertical-Autoclaves.asp
- Kích thước ngoài 410 × 477 × 970 mm (nhô ra 574 mm), 60 kg. *(manual tr. 53)*
- Buồng SUS304 φ325 × 733 mm; dùng được φ315 × 638 mm; 58 L (dùng được 50 L). *(manual tr. 53)*
- Tiệt trùng 105–135 °C (0,019–0,212 MPa); đun 45–104 °C; ủ ấm 45–95 °C; hẹn giờ 0:01–9:59. *(manual tr. 28, 53)*
- Áp suất làm việc tối đa 0,25 MPa; đồng hồ áp kim 0–0,4 MPa, có vạch đỏ. *(manual tr. 8, 29, 53)*
- Điện trở 2,0 kW ở đáy buồng; nước khoảng 3,0 L, ngập tấm đỡ có khe. *(manual tr. 11, 25, 53)*
- Bộ phận an toàn: chống đun khô, khoá liên động nắp, chống quá nhiệt, chống quá áp, phát hiện đứt cảm biến nhiệt, van an toàn, aptomat chống rò. *(manual tr. 53)*
- Khoá nắp nhả khi buồng xuống dưới nhiệt độ cài (mặc định 97 °C, chỉnh 60–100 °C) và áp suất về 0; hoàn tất khi 60 °C. *(manual tr. 7, 30, 37)*
- Pha chạy: gia nhiệt (van xả mở, hơi đuổi khí) → giữ nhiệt "một thời gian" để đuổi hết khí → đóng van, tăng nhiệt tăng áp → tiệt trùng → mở van xả áp (chỉnh tốc độ xả, quạt) → hạ nhiệt → hoàn tất. *(manual tr. 7, 15)*
- Sơ đồ đường ống: buồng → van xả khí có motor → bình xả có nước làm nguội hơi; đồng hồ áp và cảm biến áp lấy trên đường này; van an toàn trên đỉnh; van bi xả nước ở đáy. *(manual tr. 13)*
- Dịch lỏng cần kéo dài thời gian: 2 L +4 phút, 5 L +8 phút, 10 L +15 phút (ở 121 °C, 20 phút). Đồ hấp tối đa 50 % thể tích buồng; không hấp chai đậy kín. *(manual tr. 26–28)*
- Phụ kiện: 2 giỏ inox φ300 × 182 mm, tấm đỡ đáy có khe, 4 chặn bánh xe. *(manual tr. 53)*

### Bộ phận để vẽ
- Vỏ: thân hộp sơn, mặt trước có rãnh dập đứng, tấm mặt trên inox, 4 bánh xe, bàn đạp nhả khoá nắp ở chân trước.
- Nắp: vỏ nắp mang bảng điều khiển trên mặt nghiêng (đèn LID/BOTTLE/WATER, ba ô số, đèn pha, phím START/STOP), tay cầm phía trước, nắp trong hình đĩa có gioăng, bản lề phía sau.
- Khoá: hai móc khoá nắp ở hai góc trước miệng buồng, chốt khoá liên động.
- Buồng: thành inox, đáy, điện trở, tấm đỡ có khe, cảm biến nhiệt độ, nước đáy.
- Đường ống: cổng xả khí → van xả khí có motor → bình xả (ống nhúng, nước làm nguội, lỗ thoát hơi); cổng đồng hồ áp → đồng hồ 0–0,4 MPa; cổng xả nước → van bi mặt trước.
- An toàn và làm mát: van an toàn ở hông phải phía sau, quạt làm nguội buồng.
- Mẻ hấp: 2 giỏ chồng nhau; bình tam giác 500 mL nút giấy bạc, chai môi trường 500 mL và 250 mL nắp nới lỏng, cốc có mỏ đậy giấy bạc, hộp đầu tip; băng chỉ thị có vạch chéo.

### Số liệu dùng cho mô hình (`figures/autoclave/model.mjs`)
- Áp suất hơi bão hoà theo Antoine (mmHg, °C): 1–100 °C A 8,07131 B 1730,63 C 233,426; 99–374 °C A 8,14019 B 1810,94 C 244,485 (https://en.wikipedia.org/wiki/Antoine_equation).
	- Kiểm tra: 121 °C → 204,3 kPa tuyệt đối = 0,103 MPa dư; 105 °C → 0,020 MPa; 135 °C → 0,210 MPa (manual ghi 0,019–0,212 MPa); 134 °C → 0,201 MPa.
- Bào tử *Geobacillus stearothermophilus*: D121 = 2,0 phút (ISO 11138-3 yêu cầu ≥ 1,5 phút), z = 10 °C, quần thể 10⁶. D(T) = D121·10^((121−T)/z); số log giảm = ∫dt/D(T), tính theo nhiệt độ dịch trong bình.
- F0 = ∫10^((T−121,1)/10) dt (phút; Ph. Eur. 5.1.5).
- Khí còn sót (minh hoạ, định luật Dalton): T = Tsat(P − áp riêng phần của khí). Ở 0,103 MPa: đuổi hết khí 121,0 °C; đuổi 2/3 khí 115,5 °C; đuổi 1/2 khí 112,4 °C; không đuổi khí 101,2 °C (bảng Perkins 1969: 121 / 115 / 112 / 100 °C).
- Nhiệt dung: nước 3 L, thép buồng ~20 kg × 0,5 kJ/kg·K, dịch hấp và thuỷ tinh; điện trở 2 kW, hiệu suất 85 % → gia nhiệt 25→100 °C khoảng 22 phút.
- Hằng số thời gian của dịch trong bình khớp bảng kéo dài thời gian của hãng (τ = số phút kéo dài / 3).
- Chu trình mặc định 121 °C, 20 phút, 1,5 L dịch: gia nhiệt 21,8 phút → đuổi khí 5 phút → tăng áp 6 phút → tiệt trùng 20 phút → xả áp khoảng 10,6 phút → nhả khoá ở 80 °C tại phút 72,9 → hoàn tất 60 °C tại phút 86,4. Giảm khoảng 10,7 log, F0 ≈ 21 phút.
- Chai đậy kín: khí nóng lên ở thể tích không đổi cộng hơi bão hoà → ở 121 °C trong chai 334 kPa, chênh khoảng 1,3 bar so với buồng.
- Băng chỉ thị (minh hoạ, chỉ thị loại 1 theo ISO 11140-1): mức sẫm = 1 − e^(−E/3), với E = ∫10^((T−121)/10) dt khi có hơi nước.

### Chỗ chưa xác minh
- Bố trí bên trong (dạng điện trở vòng, vị trí cổng xả khí, van có motor, đường đồng hồ áp, cảm biến nhiệt, quạt) vẽ theo cấu tạo điển hình và sơ đồ đường ống của manual, không theo bản vẽ của hãng.
- Thời gian giữ 100 °C để đuổi khí ("specified time" trong manual): dùng 5 phút.
- Hằng số xả áp (2 phút, tốc độ xả nhanh) và hằng số nguội có quạt (30 phút).
- Khối thép buồng (~20 kg, thành 3 mm) và hiệu suất gia nhiệt 85 %: ước tính.
- Nhiệt độ nhả khoá dùng 80 °C (trong khoảng chỉnh 60–100 °C của máy; mặc định của hãng là 97 °C).
- Áp suất tối đa 0,25 hay 0,263 MPa: manual ghi 0,263 MPa cho SX-300, 0,25 MPa cho SX-500/700.
- Mức sẫm của băng chỉ thị là minh hoạ, không theo đường cong của nhà sản xuất băng.

### Tiến độ
- [x] Hình chi tiết nồi hấp tiệt trùng (Fig 12, Tomy SX-500) ✅ 2026-10-16
	- `figures/autoclave/` (khoảng 90 bộ phận, 199 khối đặc trong đó 72 đoạn dây giỏ, 12 ống); trong app bấm "Cận cảnh nồi hấp" ở góc sau phòng, hoặc mở `#autoclave`
	- Thao tác: Enter đóng/mở nắp (khoá liên động giữ nắp tới khi áp suất về 0 và buồng < 80 °C); Space chạy hoặc tạm dừng; ← → đổi tốc độ. Băng chỉ thị sẫm lại sau chu trình đúng, vẫn nhạt khi không đuổi khí
	- Kiểm tra: `audit passed`; `line ends: 0` ở cả hai giao diện, nắp mở và nắp đóng; cận cảnh 4×; 390 px không cuộn ngang

## Máy LC-MS/MS — Shimadzu LCMS-8060

### Thông số
- Máy khối phổ ba tứ cực Shimadzu LCMS-8060 ([tờ thông số C146-E288D](https://www.zefsci.com/canada/wp-content/uploads/sites/5/2021/08/Specifications-1.pdf)).
	- Dải khối m/z 2–2 000; độ phân giải R < 0,7 u FWHM; độ ổn định khối 0,1 u/24 giờ; độ đúng khối ±0,15 u (m/z 1 000); cross-talk < 0,003 %.
	- Quét tối đa 30 000 u/s; MRM tối đa 555 kênh/s; dwell tối thiểu 0,8 ms; pause tối thiểu 1 ms; đổi cực 5 ms.
	- Nguồn ion ESI (chuẩn), APCI và DUIS (tuỳ chọn); lưu lượng LC cho ESI 1 µL/phút – 2 mL/phút.
	- DL tối đa 300 °C; heat block tối đa 500 °C (ESI); nhiệt độ giao diện đặt tối đa 400 °C (thật ở đầu probe > 700 °C).
	- Q1, Q3: thanh hyperbol molybden có pre-rod, Q1 có post-rod; ô va chạm UFsweeper III (đa cực thuôn), khí CID argon; quang học ion Q-array (UF-Qarray) và đa cực truyền ion.
	- Đầu dò: ống nhân điện tử thứ cấp với dynode chuyển đổi lệch trục, đếm xung, dải động 2 × 10⁷ cps.
	- Chân không: một bơm quay dầu 65 m³/giờ, một bơm phân tử tuabin ba cửa hút 40/260/210 L/s.
	- Khí: nitrogen tối đa 24,4 L/phút (> 97 %), argon > 99,99 %, không khí khô tối đa 20 L/phút.
	- Kích thước 1 180 × 540 × 610 mm, 140 kg; điện 230 V 15 A (máy), 200–240 V 12 A (bơm quay).
- DL thay được không cần phá chân không ([trang tính năng LCMS-8060](https://www.shimadzu.eu/products/liquid-chromatograph-mass-spectrometry/triple-quadrupole-lc-msms/lcms-8060/features.html)).
- Máy cùng dòng đời trước LCMS-8040 có cùng cấu hình bơm ([C146-E194K](https://cos.unt.edu/chemistry/system/files/shimadzu_8040_lc-ms_specifications_1.pdf)).

### Bộ phận để vẽ
- Vỏ máy (tháo tấm trên, tấm trước, nửa trên vách trái và phải), dải trước có công tắc nguồn, ba đèn LED; bo điều khiển và hai bộ nguồn RF (Q1, Q3) có cánh tản nhiệt.
- Buồng nguồn ion có cửa kính, cổng xả; probe ESI có gia nhiệt (mao quản phun, cổng khí phun sương, ống khí gia nhiệt, nón Taylor).
- Đầu vào DL; khối gia nhiệt vẽ cắt đôi; cổng khí làm khô.
- Buồng chân không mở nắp: Q-array sáu tấm, đa cực truyền tám thanh, Q1 (pre-rod, bốn thanh, post-rod), ô va chạm (bốn thanh thuôn, cổng argon), Q3, thấu kính ra, dynode, ống nhân điện tử, tiền khuếch đại; đồng hồ Pirani và đồng hồ ion hoá.
- Bơm tuabin ba cửa hút, ống chân không, kẹp KF; bơm quay dầu (kính dầu, van gas ballast, lọc sương dầu, động cơ) với ống gân.
- Bộ điều khiển khí nitrogen (phun sương, gia nhiệt, làm khô), đường argon tới ô va chạm.
- UHPLC giản lược: chai dung môi (nước + 0,1 % formic acid, acetonitrile), bơm, bộ tiêm mẫu, buồng cột C18, ống PEEK lên probe; màn hình máy tính vẽ sắc ký đồ MRM.

### Số liệu dùng cho mô hình (`figures/lcms/model.mjs`)
- m/z tính từ khối lượng đơn đồng vị (C 12, H 1,007825, N 14,003074, O 15,994915; proton 1,007276; electron 0,000549):
	- caffeine [M+H]⁺ 195,0877 → 138,0662 (mất CH₃NCO, CE 20 V) và 110,0713 (CE 28 V)
	- theobromine 181,0720 → 138,0662 (mất HNCO, CE 18 V) và 163,0614 (mất H₂O)
	- theophylline 181,0720 → 124,0505 (CE 20 V) và 96,0556
	- paracetamol 152,0706 → 110,0600 (mất ketene, CE 15 V) và 65,0386
- Theobromine và theophylline cùng m/z 181,1: Q1 không tách được, Q3 tách nhờ mảnh khác nhau.
- Đồng vị: M+1 ≈ nC·1,07 % + nN·0,364 % + nH·0,0115 % + nO·0,038 %; caffeine M+1 = 10,3 %.
- Độ truyền qua tứ cực T = 1/(1 + (2Δm/0,7)⁸). Điện áp ở đỉnh vùng bền Mathieu (q = 0,706, a = 0,237): m/z 195 cần V ≈ 225 V RF, U ≈ 38 V DC (r0 = 4 mm, 1 MHz là số điển hình).
- Phân mảnh: y(CE) = ymax·exp(−((CE − CEopt)/w)²).
- Tín hiệu = 4 × 10⁴ ion/pg × hiệu suất ion hoá × (1 − ức chế nền) × pg trên cột × tỉ lệ đơn đồng vị × y; diện tích tỉ lệ nồng độ.
- Nhiễu = √(nền/dwell) + 5 % nền; S/N = chiều cao/nhiễu RMS; LOD ở S/N 3, LOQ ở S/N 10.
- Chu kỳ MRM = số kênh × (dwell + pause): 8 kênh × 21 ms = 168 ms, khoảng 40 điểm trên một pic.
- LC dùng lại `figures/hplc/model.mjs` với cột C18 2,1 × 100 mm 1,9 µm, 10 % acetonitrile, 0,4 mL/phút, 40 °C, tiêm 2 µL, cộng σ ngoài cột 1,5 s: tR theobromine 0,87; paracetamol 1,02; theophylline 1,14; caffeine 1,72 phút; áp suất khoảng 491 bar.
- Mặc định caffeine 50 ng/mL: diện tích 1,6 × 10⁶, S/N ≈ 3 400, LOD 0,045 ng/mL, LOQ 0,15 ng/mL.

### Chỗ chưa xác minh
- Thông số nguồn ion (phun sương 3 L/phút, gia nhiệt 10, làm khô 10; giao diện 300 °C, DL 250 °C, heat block 400 °C; +4 kV; khí CID 270 kPa) là giá trị hay gặp trong bài ứng dụng LCMS-8050/8060, chưa đối chiếu một tài liệu cụ thể.
- Áp suất từng tầng chân không, r0 và tần số RF của tứ cực là số điển hình của máy ba tứ cực.
- Hiệu suất ion hoá, hệ số đáp ứng, nền hoá học, CE tối ưu, hiệu suất phân mảnh và mức ức chế nền là số minh hoạ (chỉ m/z là chính xác).
- Cấu tạo bên trong (Q-array, đa cực tám thanh, ô va chạm, dynode và ống nhân, đường ống chân không, bộ điều khiển khí) vẽ theo cấu tạo điển hình, không có sơ đồ của hãng.
- Hệ UHPLC và bơm quay dầu vẽ giản lược, không theo model cụ thể; giới hạn áp 1 300 bar kiểu Nexera.
- Kích thước 1 180 × 540 × 610 mm theo tờ thông số; tài liệu chuẩn bị lắp đặt ghi số khác, chưa đối chiếu.

### Tiến độ
- [x] Hình chi tiết LC-MS/MS (Fig 13, mức Hero, Shimadzu LCMS-8060) ✅ 2026-10-16
	- `figures/lcms/` (287 mục vẽ, 209 khối, 18 ống và cáp); trong app bấm "Cận cảnh LC-MS/MS" ở khu "HPLC, ly tâm, đo DNA", hoặc mở `#lcms` (→ [Sắc ký lỏng – khối phổ LC-MS/MS](/blog/sinh-hoc/biology-project-and-lab-report/proteomics-and-structural-biology/06-sac-ky-long-khoi-pho-lc-ms-ms/))
	- Thao tác: Space tiêm mẫu; ← → đổi kênh MRM (8 kênh); ↑ ↓ nồng độ ×2/÷2. Hoạt cảnh: dải chất trong cột, phun ESI với giọt co lại, ion qua DL, Q-array, Q1 (ion sai m/z xoáy ra), ô va chạm (vỡ thành mảnh), Q3, dynode và ống nhân; sắc ký đồ MRM vẽ theo từng chu kỳ
	- Kiểm tra: `audit passed`; `line ends: 0` ở hai giao diện, lúc nghỉ và lúc xong; cận cảnh 4×; 390 px không cuộn ngang

## Tủ an toàn sinh học cấp II — Esco Airstream AC2-4S8-NS

### Thông số
- Model: Esco Airstream AC2-4S8-NS, Class II Type A2, rộng 4 ft, 220–240 V; chứng nhận NSF/ANSI 49, EN 12469 (thử kiểu bởi HPA), UL 61010. Nguồn: [Brochure Airstream AC2 NS](https://www.escolifesciences.com/pdf/9010258_Airstream%20AC2_NS_Brochure_A4_vG_LR.pdf)
	- Kích thước ngoài 1340 × 753 × 1400 mm (không chân đế); kích thước trong 1220 × 580 × 660 mm; mặt làm việc 0,56 m²; nặng 230 kg; công suất 181 W; ồn 57,5 dBA.
	- Độ mở thử nghiệm 203 mm (8"); mở tối đa 445 mm (17,5"); kính trượt cường lực, mặt trước nghiêng 5°.
	- Vận tốc vào trung bình 0,53 m/s (105 fpm); vận tốc xuống trung bình 0,30 m/s (60 fpm).
	- Lưu lượng: vào 473 m³/h, xuống 738 m³/h, thải 473 m³/h. Khoảng 1/3 khí trong buồng áp chung ra lọc thải, 2/3 qua lọc cấp thành dòng tầng; gần mặt bàn, dòng xuống chia khoảng một nửa về lưới trước, một nửa về lưới sau.
	- Lọc ULPA/H14: > 99,999 % ở 0,1–0,3 µm (IEST-RP-CC001.3); > 99,999 % ở MPPS (EN 1822, theo brochure); > 99,99 % ở 0,3 µm khi thử rò PAO theo NSF 49.
	- Quạt DC ECM, tự bù khi điện áp dao động và khi lọc bị tải bụi; đèn huỳnh quang T5 1025 lux; buồng áp được bao quanh bởi vùng áp âm (Dynamic Chamber).
	- Bộ điều khiển Sentinel Gold hiện "Airflow: OK  Sash: OK  I: 0.53 m/s  D: 0.30 m/s"; có cảm biến luồng khí, cổng RS232, rơ-le.
	- Bộ phận theo bản vẽ hãng: khay thép không gỉ một tấm, lỗ thoát, tấm tựa tay nâng cao (giúp tránh che lưới), tấm chắn giấy, 2 vòi dịch vụ mỗi bên, ổ cắm GFCI, lọc ULPA thải trên nóc, quạt ECM, lọc ULPA cấp xuống. Đèn UV là phụ kiện (UV-30A-L cho bản 4 ft).
- Báo động và khoá liên động (manual tủ Esco cùng bộ Sentinel, bản LS2): [User manual](https://manualzilla.com/doc/5713008/user-manual)
	- Báo động kính khi kính rời độ cao làm việc mà chưa đóng hẳn; báo động khí khi vận tốc dưới ngưỡng hỏng do kỹ thuật viên hiệu chuẩn.
	- "UV lamp can only be activated when the sash window is fully closed"; hẹn giờ UV tới 18 giờ, hãng khuyên không bật quá 60 phút; tuổi thọ đèn UV 2000 giờ.
- Tiêu chuẩn: NSF/ANSI 49, kiểu A2 vận tốc vào tối thiểu 0,51 m/s (100 fpm) ([tóm tắt của ANSI](https://blog.ansi.org/ansi/class-ii-biosafety-cabinets-nsf-ansi-49/)); EN 12469 vận tốc vào tối thiểu 0,40 m/s, hệ số bảo vệ người ≥ 1 × 10⁵ (*chưa xác minh* với văn bản gốc).

### Bộ phận để vẽ
- Đế và vỏ: giá đỡ có chân, đế tủ, máng đáy, vách sau, vách trái; hông phải và góc trên phía trước bên phải cắt bỏ để thấy buồng áp.
- Buồng làm việc: khay một tấm có lỗ thoát, lưới trước đục lỗ, tấm tựa tay nâng cao, vách sau có hàng khe lưới hồi, tấm chắn giấy dưới khay, vòi dịch vụ và ổ cắm ở vách trái, đèn UV trên vách sau.
- Buồng trên: lọc ULPA cấp xuống (nếp gấp lộ trên mặt cắt), lưới khuếch tán, hộp đèn và ống T5, cảm biến luồng khí.
- Quạt: vỏ xoắn ốc có cửa xả ra sau, cánh cong, động cơ ECM rotor ngoài, quai treo lên nóc.
- Nóc: lọc ULPA thải, lưới bảo vệ, ổ điện vào, cổng RS232/rơ-le.
- Mặt trước nghiêng 5°: hai ray kính (ray phải có công tắc từ báo vị trí kính); kính 6 mm có tay nắm; bảng Sentinel có LCD, 2 đèn báo và 5 phím.
- Trên khay: chai cồn 70 % dạng xịt, giá ống với 3 ống 15 mL, đĩa petri có khuẩn lạc và nắp lật ngửa, micropipette, tấm thấm che lưới (chỉ hiện khi người dùng che lưới).

### Số liệu dùng cho mô hình (`figures/bsc/model.mjs`)
- Vận tốc vào = lưu lượng thải 473 m³/h / (độ mở × 1,22 m): 0,53 m/s ở 203 mm; 0,42 m/s ở 254 mm; 0,24 m/s ở 445 mm. Khi kính gần đóng, vận tốc bão hoà quanh 1,5 m/s (*giả định*).
- Vận tốc xuống 0,30 m/s nhân với tỉ lệ lưu lượng.
- Báo động kính khi độ mở ngoài 203 ± 13 mm (dung sai *giả định*); báo động khí khi vận tốc vào < 0,40 m/s (ngưỡng theo EN 12469, Esco không công bố số).
- Hạt lọt qua lọc: P = 1 − 0,99999 = 10⁻⁵.
- Hệ số bảo vệ người (*minh hoạ*): 10⁵–10⁵·⁵ khi vận tốc vào ≥ 0,40 m/s; giảm theo log tới 10¹ ở 0,20 m/s; che lưới trước giảm 10³ lần; tắt quạt còn 1.
- Tải bụi của lọc (*minh hoạ*): ΔP = 125 Pa × (1 + 0,35 × số năm); quạt ECM bù tới 2 × ΔP₀, quá mức đó lưu lượng giảm theo √(ΔPmax/ΔP).
- Đèn UV chỉ bật khi kính đóng hẳn; đèn huỳnh quang sáng khi kính mở và UV tắt.

### Chỗ chưa xác minh
- Ngưỡng báo động khí của Esco (dùng 0,40 m/s) và dung sai cảm biến kính.
- Văn bản gốc EN 12469 (0,40 m/s, hệ số bảo vệ ≥ 10⁵); số liệu NSF/ANSI 49 lấy từ bản tóm tắt.
- Cấu tạo bên trong (vỏ quạt, cửa xả, quai treo, vị trí cảm biến, hộp đèn, chiều cao tấm kính 600 mm, tấm tựa tay 178 mm, lớp lọc dày 85 mm): vẽ theo cấu tạo điển hình, không có sơ đồ của hãng.
- Vị trí đèn UV (vách sau) là giả định; đèn UV là phụ kiện.
- Hệ số bảo vệ, tải bụi lọc và vận tốc bão hoà khi kính gần đóng là số minh hoạ, không phải số đo.

### Tiến độ
- [x] Hình chi tiết tủ an toàn sinh học cấp II (Fig 14, Esco Airstream AC2-4S8-NS) ✅ 2026-10-16
	- `figures/bsc/` (103 khối, 96 mục vẽ); trong app bấm "Cận cảnh tủ an toàn sinh học" ở khu "Tủ an toàn sinh học", hoặc mở `#bsc`
	- Thao tác: ↑/↓ nâng hạ kính qua các nấc 0, 203, 254, 445 mm; Space bật/tắt quạt; G che/bỏ che lưới trước; U bật/tắt UV (bị khoá khi kính chưa đóng); hạt khí chạy theo đường dòng, thoát ra ngoài khi mất màn khí
	- Kiểm tra: `audit passed` (21 vị trí trên hành trình kính); `line ends: 0` ở hai giao diện, kính 203 mm, đóng, 445 mm và khi che lưới; cận cảnh 4×; 390 px không cuộn ngang
