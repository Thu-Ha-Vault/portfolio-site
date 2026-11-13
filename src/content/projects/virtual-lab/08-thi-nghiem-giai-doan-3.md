---
title: Thí nghiệm giai đoạn 3
type: note
tags:
  - project
  - virtual-lab
  - simulation
folder: Projects / Virtual_Lab
vaultPath: Projects/Virtual_Lab/08 - Thí nghiệm giai đoạn 3.md
url: /projects/virtual-lab/thi-nghiem-giai-doan-3/
updated: '2026-10-16'
date: '2026-10-16'
status: active
order: 8
project: virtual-lab
isIndex: false
description: >-
  Kế hoạch ở mục 8 của CLAUDE.md. Mỗi việc ghi: thiết bị thật, số liệu và nguồn,
  bài thực hành gốc, kết quả mô phỏng so với số liệu của bài, làm sai thì ra gì.
  Số liệu đánh dấu minh hoạ là số chỉnh cho mô hình chạy hợp lý,
---
Kế hoạch ở mục 8 của CLAUDE.md. Mỗi việc ghi: thiết bị thật, số liệu và nguồn, bài thực hành gốc, kết quả mô phỏng so với số liệu của bài, làm sai thì ra gì. Số liệu đánh dấu *minh hoạ* là số chỉnh cho mô hình chạy hợp lý, không phải số đo.

## 0. Nền dùng chung
- **Lưu và mở lại phiên** (`src/core/session.js`):
	- Không viết `save()`/`load()` cho từng lõi như kế hoạch ban đầu. Thay vào đó app ghi **nhật ký thao tác** (protocol, seed, từng thao tác theo thứ tự).
	- Mở lại thì đặt lại mọi lõi bằng đúng seed cũ rồi chạy lại nhật ký, nên số ngẫu nhiên (hạt đậu, sai số pipet…) ra y như lần trước.
	- Tự lưu vào `localStorage`; nút **Lưu file phiên** và **Mở file phiên** (JSON).
	- Kiểm tra trong trình duyệt: cả 57 protocol (39 có sẵn và 18 protocol của giai đoạn 3), làm mẫu rồi tải lại trang, thẻ kết quả giống hệt, không lỗi.
- **Báo cáo thí nghiệm** (`src/core/report.js`): nút **Xuất báo cáo** tạo Markdown theo mẫu `lab-report` của vault (Mục đích, Nguyên lý, Vật liệu & phương pháp, Kết quả chính, Kết luận), kèm bảng và CSV các sổ thí nghiệm.
- **Kiểm thử tự động**: GitHub Actions (`.github/workflows/test.yml`) chạy `tests/engine.html` bằng Playwright mỗi lần push; lần chạy đầu tiên xanh.
- **Giá ống nghiệm và bể ổn nhiệt**: giá 10 ống trên bàn sinh học phân tử, màu dung dịch, kết tủa, vòng màu lấy từ lõi hoá sinh; bể ổn nhiệt ở mục 1.

## 1. Hoá sinh định tính (bài 01–07)
- **Thiết bị**:
	- **Bể ổn nhiệt Memmert WNB 10**:
		- Lòng bể inox 350 × 210 × 140 mm, khoảng 10 L; vỏ 578 × 356 × 238 mm (nắp phẳng), 337 mm với nắp mái.
		- Đặt +10 tới +95 °C cộng **mức sôi**; dao động ±0,1 K, phân bố ±0,25 K; khoảng 1200 W.
		- Nguồn: datasheet Memmert "Waterbaths WNB, WNE, WPE" (01/2022).
		- Dòng WNB đã ngừng, thay bằng WTB; vẫn vẽ WNB vì còn rất phổ biến.
		- *Chưa xác minh*: cách màn hình hiện mức sôi, vị trí bản lề nắp mái, các bộ phận bên trong (vẽ theo cấu tạo điển hình).
		- Hình chi tiết **Fig 24** (`figures/waterbath/`). Thời gian nước nóng lên tính bằng cân bằng nhiệt trong `model.mjs`; hiệu suất và hệ số mất nhiệt là *minh hoạ*.
	- **Máy đo pH để bàn Mettler Toledo FiveEasy F20**: pH 0,00–14,00, độ phân giải 0,01, sai số ±0,01; 227 × 147 × 70 mm (theo trang phân phối Fisher Scientific).
- **Lõi** `src/core/biochem.js`, dữ liệu `data/biochem.json`, 8 protocol:

| Protocol | Bài gốc | Kết quả mô phỏng khớp bài |
| --- | --- | --- |
| `bc-mono` | Bài 01 | Tromer 3 ống đỏ cam, ống 0,1 % gần như không tủa. Fehling: sucrose xanh; glucose 0,1 % < maltose 1 % < glucose 1 % < glucose 5 %. Benedict: 0,1 % xanh lơ ánh vàng, 1 % cam đỏ, 5 % đỏ gạch. Barfoed 10 phút: glucose tủa, maltose không. Tráng gương có bạc. Xelivanop: fructose đỏ trong 1 phút, glucose đun thêm ~10 phút mới vàng |
| `bc-poly` | Bài 02 | Iod mất màu khi nóng, xanh lại khi nguội, mất hẳn khi đun lâu. Thuỷ phân bằng HCl: 3 phút Lugol tím đen, Fehling xanh; 10 phút nâu đỏ, ít tủa; 20 phút vàng, tủa nhiều |
| `bc-unknown` | Bài 02 TN4 | Năm lọ mất nhãn (thứ tự ngẫu nhiên theo phiên) nhận đúng bằng Fehling → Lugol → Barfoed → Xelivanop |
| `bc-protein` | Bài 03 | Biure tím hồng, lòng trắng trứng tím xanh; ninhydrin prolin vàng; glycine sủi N₂; xanthoprotein vàng rồi cam, gelatin không đổi; Adamkiewicz vòng đỏ tím; Folia PbS đen |
| `bc-protprop` | Bài 04 | Casein: mức đục ít / vừa / nhiều / khá nhiều / khá nhiều đúng bảng TN1; pH đệm acetat lệch ≤ 0,2. Biến tính do nhiệt 2 > 5 > 1 > 3 = 4. Kết tủa tan lại sau 5 giọt Fe³⁺, 8 giọt Cu²⁺ |
| `bc-lipid` | Bài 05 | Tan theo độ phân cực; nhóm 3 thấy ethyl acetate nhanh hơn ether khi lấy dư dung môi; nhũ tương với xà phòng; acrolein chỉ khi hơ lửa; xà phòng hoá, muối calci, acid béo tự do |
| `bc-index` | Bài 06 | 15 giọt dầu cần 0,5–0,9 mL KOH 0,02 N. Xà phòng hoá có hồi lưu 187–196 mg KOH/g; không hồi lưu thì lệch xa và phân tán như các nhóm. Iod với Wijs 80–106; với 5 mL iod loãng của bài thì iod không dư |
| `bc-vitamin` | Bài 07 | Vitamin C: V iod lá non 2,3–4, lá già khoảng 4, thân khoảng 0,9 mL; lá già > lá non > thân. Riboflavin vàng → lục → hồng → mất màu → vàng lại. Dầu cá đỏ nâu với anilin |

- **Nguồn số liệu**:
	- TCVN 7597:2018: chỉ số xà phòng hoá dầu lạc 187–196 mg KOH/g.
	- Tiêu chuẩn dầu lạc Cyprus 1980: chỉ số iod 80–106. Codex CXS 210 *chưa xác minh trực tiếp*.
	- ISO 3961 và AOCS Cd 3-25 (*chưa xác minh bản đầy đủ*).
	- USDA: lá thìa là 85 mg vitamin C/100 g. Chuẩn độ iod cho số cao hơn vì các chất khử khác cũng khử I₂.
	- pKa acetic 4,76 (CRC); pI casein 4,6.
	- Ngưỡng chuyển màu, hằng số thuỷ phân tinh bột, độ rộng đường đục quanh pI là *minh hoạ*, chỉnh theo bảng của các bài.
- **Làm sai ra kết quả sai**:
	- Fehling ở 37 °C hoặc không đun thì giữ xanh.
	- Dư CuSO₄ thì CuO đen.
	- Barfoed đun quá 12 phút thì maltose dương tính giả.
	- Quên trung hoà acid trước Fehling thì âm tính giả.
	- Lắc trộn H₂SO₄ ở Adamkiewicz thì không có vòng.
	- Folia không đun thì không có PbS.
	- Acrolein đun cách thuỷ thì không có acrolein.
	- Xà phòng hoá không hồi lưu thì kết quả lệch.
	- Vitamin C chiết bằng nước thì thấp giả, quên hồ tinh bột thì cao giả.

## 2. Enzyme (bài 08–10, lipase)
- **Lõi** `src/core/enzyme.js`, dữ liệu `data/enzyme.json`:
	- Michaelis–Menten.
	- Nhiệt độ dịch trong ống tiến dần về nhiệt độ bể hoặc tủ: nước nhanh, không khí chậm.
	- Arrhenius; biến tính bậc nhất theo nhiệt độ và pH; đường chuông pH.
	- Cl⁻ hoạt hoá, Cu²⁺ kìm hãm; tính đặc hiệu cơ chất.
- **Protocol `ez-amylase`** (Bài 08):
	- Lugol trên bản sứ: xanh đen → nâu → vàng nghệ → vàng sau 12 phút; ống nước cất giữ xanh đen.
	- Wohlgemuth phần lớn ra **16 đơn vị** (nhóm 3: 16), các lần khác 8 hoặc 32 như sự dao động giữa các nhóm.
	- Urease đun sôi thì mất hoạt tính.
- **Protocol `ez-factors`** (Bài 09):
	- 55 °C trong tủ ấm tới vàng ở phút 21; 4 °C gần như không đổi.
	- pH tối thích 6,8; pH 7,7–8,4 bất hoạt; Cu²⁺ kìm hãm.
	- Từng mốc lệch bảng của bài không quá một mức màu.
	- Ống 100 °C trong mô hình dừng ở nâu đỏ sau vài phút. Bài thấy ống này đổi màu dần tới phút 21 và tự giải thích là mực nước thấp hơn dịch trong ống, nên chỉ so màu cuối.
	- Cl⁻ theo lý thuyết làm nhanh hơn. Bài thấy ngược lại và cho là do nhầm ống.
- **Protocol `ez-stability`** (Bài 10):
	- Enzyme bài 10 vẫn còn hoạt tính sau 30 phút ở 80 °C, nên mô hình coi là α-amylase vi khuẩn bền nhiệt (*chưa xác minh*, bài không ghi nguồn enzyme).
	- Xử lý 80 °C nhanh hơn 4 °C vì dịch lạnh cần thời gian ấm lên.
	- pH 8,4 mất hoạt tính không hồi phục.
	- Urease không thuỷ phân acetamide; amylase và saccharase đặc hiệu cơ chất.
- **Protocol `ez-lipase`** (Enzymology bài 01):
	- Lipase *Pseudomonas brenneri* (Priyanka et al. 2020).
	- Lineweaver–Burk cho Km gần 0,37 mM.
	- Zn²⁺ mất hoạt độ, Ca²⁺ 106 %; bán huỷ ở 60 °C là 190 phút.
	- A405 đo qua mô hình máy quang phổ UV-1900i. Dừng bằng acid thì mất màu; quá nhiều enzyme thì vượt khoảng tuyến tính.
- Các hằng số động học của amylase nước bọt (Vmax, Km, Ea, biến tính, pKa) là *minh hoạ*, chỉnh để khớp bảng màu của bài 08–09.

## 3. Vi sinh và biến nạp plasmid
- **Protocol NEB C2987**:
	- Ủ đá 30 phút, sốc nhiệt đúng 42 °C 30 giây, đá 5 phút, 950 µL SOC, 37 °C lắc 250 rpm 60 phút.
	- NEB 5-alpha: 1–3 × 10⁹ cfu/µg.
	- NEB FAQ: sốc nhiệt 80 giây mất khoảng 60 %.
	- NEB tips: mỗi 10 phút ủ đá bớt đi, hiệu suất giảm 2 lần. Các số về vortex, LB thay SOC, thời gian phục hồi *chưa xác minh* vì không mở trực tiếp được trang NEB.
- **Lõi** `src/core/micro.js`, protocol `mb-transform`:
	- Kết quả: khoảng 150 khuẩn lạc ở độ pha loãng 100, hiệu suất 1,5 × 10⁹ cfu/µg.
	- Bài 11, nhóm 7.1: bể sốc nhiệt nhảy lên 44 °C thì LB+ gần như không có khuẩn lạc, LB− vẫn mọc.
	- Bài 11, nhóm 7.3: cấy LB− không pha loãng thì mọc kín đĩa.
	- Tế bào khả biến lấy hoạt tính từ kho lạnh (rã đông rồi đông lại thì giảm).
	- Thao tác trong tủ an toàn sinh học chỉ vô trùng khi tủ đang bảo vệ mẫu.
	- Ampicillin cho vào thạch 75 °C thì mất tác dụng; ủ quá 24 giờ có khuẩn lạc vệ tinh.
- **Thiết bị**:
	- **Tủ ấm lắc New Brunswick Innova 42** (Eppendorf), bản quỹ đạo 1 inch:
		- Ngoài 62 × 75,4 × 82 cm; buồng 51,8 × 51,6 cm, cao 47,7 cm; mâm 46 × 46 cm.
		- 25–400 rpm (±1); từ phòng + 5 °C tới 80 °C, ±0,1 °C ở 37 °C.
		- Mở cửa thì dừng lắc, tắt sưởi.
		- Nguồn: datasheet NBS B-2011b, manual Eppendorf M1335-0055.
		- Hình chi tiết **Fig 25** (`figures/shaker/`), nhận ống SOC và bình LB + ampicillin của người dùng.
		- *Chưa xác minh*: phía bản lề cửa, chiều quay mâm, vị trí đèn trong, cơ cấu dưới mâm.
	- **Tủ ấm vi sinh Memmert IN55**: 53 L, lòng 400 × 400 × 330 mm, ngoài 585 × 784 × 514 mm, +20 tới +80 °C (datasheet Memmert). Độ dao động ở 37 °C *chưa xác minh*.
	- **Máy đếm khuẩn lạc Stuart SC6PLUS**: bút dạ trên tấm cảm ứng áp lực, đếm 0–999, đèn LED dưới đĩa, 310 × 300 × 140 mm (theo nhà phân phối, *chưa xác minh*).

## 4. Sinh học phân tử và protein
- **Plasmid** (`src/core/molbio.js`, protocol `mo-plasmid`):
	- Trình tự pUC19 thật (GenBank L09137, 2686 bp); 16 enzyme theo NEB (EcoRI cắt ở 396, HindIII ở 447 như bản đồ NEB).
	- Plasmid có đoạn chèn 1 kb cắt EcoRI + HindIII ra 2,6 kb và 1 kb, như băng 3 kb + 1 kb của bài 11.
	- Plasmid chưa cắt: băng siêu xoắn khoảng 3,3 kb đậm và băng DNA genome khoảng 6 kb nhạt, như bài 11.
	- Làm sai: ly giải quá 5 phút ra vòng sợi đơn; vortex thì DNA genome đậm hơn; thiếu RNase có RNA; cắt thiếu enzyme còn plasmid nguyên.
- **Proteomics** (`src/core/proteomics.js`, `data/proteins.json`, protocol `pt-2dpage`):
	- 15 chuỗi protein huyết tương lấy từ UniProt (chuỗi trưởng thành, số N-glycan). Khối lượng và pI tính từ trình tự: albumin 66,5 kDa, pI 5,8.
	- SDS-PAGE; 2D-PAGE theo bài 02 (170 µg, IPG 3–10 7 cm); %V như Phoretix ở bài 04.
	- Thuỷ phân trypsin trong gel theo bài 05.
	- MALDI-TOF và PMF theo bài 07: peptide tự cắt trypsin 842,509 và 2211,104 tính ra đúng như bài; ngưỡng điểm khoảng 71 với cỡ SwissProt (bài: > 70).
	- Sai số ± 1,2 Da cho điểm thấp hơn ± 50 ppm. Không đeo găng thì có peptide keratin (bài nhận ra keratin).
	- Nồng độ protein huyết tương theo Anderson & Anderson 2002 (*chưa xác minh từng số*). Vùng biến đổi Ig 12 kDa và 2,2 kDa mỗi N-glycan là ước lượng.
- **Thiết bị**:
	- **Bio-Rad Mini-PROTEAN Tetra Cell** (manual 10007296 Rev C):
		- Bể 16 × 12 × 18 cm, tối đa 600 V; kính 0,75/1,0/1,5 mm.
		- Lược 10 giếng (44 µL ở gel 1,0 mm); đệm 700 mL cho 2 gel.
		- Chạy 200 V hằng thế khoảng 35 phút.
	- **Nguồn PowerPac HC**: 5–250 V, 0,01–3 A, 300 W, LCD hiện V, mA, thời gian.
	- **Thang Precision Plus Protein**: 10 băng 10–250 kDa.
		- Rf theo % gel đo trên biểu đồ của Bio-Rad (Bulletin 2414), là *minh hoạ*. Lõi proteomics và hình dùng chung bảng này.
	- Hình chi tiết **Fig 26** (`figures/sdspage/`), vẽ gel đổ tay 8,3 × 7,3 cm.
		- *Chưa xác minh*: thể tích buồng trong (manual khoảng 150 mL, Bulletin 6202 ghi 200 mL), vị trí dây platinum, số cặp giắc của nguồn.
	- **Máy IEF Bio-Rad PROTEAN i12** (chỉ tra): 1–12 dải IPG 7–24 cm, 50–10 000 V, tối đa 100 µA và 1 W mỗi làn; 46 × 34,5 × 18,5 cm. Khoảng nhiệt Peltier *chưa xác minh*.
	- **MALDI-TOF Shimadzu MALDI-8020** (chỉ tra):
		- Laser rắn 355 nm 200 Hz, m/z tới 500 000; độ phân giải > 5000 FWHM, < 20 ppm khi chuẩn nội.
		- Chỉ đo chế độ tuyến tính; PMF cần độ chính xác cỡ ppm nên máy có reflectron hợp hơn.
		- Phương án thay là Bruker microflex LT/SH (*chưa xác minh* laser và dải khối lượng).

## 5. Phôi chim
- **Bảng Hamburger & Hamilton 1951**: giờ ấp lấy giữa khoảng; số cặp đốt thân HH7–HH20 = 3 × giai đoạn − 20.
- **Máy ấp Brinsea Ovation 28 EX**: 447 × 332 × 223 mm, 28 trứng gà, tự đảo, tự giữ ẩm, 30 W (theo trang bán hàng).
- **Lõi** `src/core/chick.js`, ảnh `src/ui/chick-svg.js`, protocol `dv-chick`:
	- Quan sát được HH4 (dải nguyên thuỷ và nút Hensen), HH10 (10 cặp đốt thân, túi não), HH20 (màng ối, mầm chi, túi niệu), HH24 (4 ngày) như bài 01 Developmental Biology.
	- Ấp 34 °C phôi chậm; 40,5 °C chết nhiều; không đảo trứng chết nhiều hơn; mở cửa sổ không rút lòng trắng chết khoảng một nửa. Các nguy cơ chết là *minh hoạ*.

## 6. Tiến hoá và di truyền quần thể
- **Số liệu thật** 100 chim sẻ đất trung bình (HHMI BioInteractive), lấy từ file `Chim sẻ.xlsx` của bài 03 Evolutionary Biology vào `data/finch.json`.
- **Lõi** `src/core/evolution.js`, protocol `ev-finch`. Kết quả trùng bảng của bài:
	- Mean, SD, SEM trùng hết.
	- t = −4,08 / −3,27 / −1,82 / −3,27.
	- p = 0,00009 / 0,0015 / 0,072 / 0,0015.
	- p của F-test hai phía = 0,07 / 0,86 / 0,87 / 0,76.
	- t tới hạn 1,984.
- 95 % CI của mô hình dùng 1,96 × SEM. Ba số trong bảng của bài lệch tới 0,006 (ví dụ chiều dài cánh nhóm không sống sót 0,637 so với 0,631).
- **R = h²S** với h² = 0,79 (Boag & Grant 1978, *chưa xác minh con số chính xác*).
- **Lồng ruồi Wright–Fisher**: chọn lọc chống kiểu gen lặn, phiêu bạt di truyền ở quần thể nhỏ, kiểm định χ² Hardy–Weinberg.

## 7. Thực địa Cát Bà
- **Lõi** `src/core/fieldeco.js`, protocol `fe-catba`, khu ngoài trời `#field` trong cảnh 3D.
- **Rừng ngập mặn Phù Long**: hai dải thu nhỏ 1 : 2.
	- Cây đặt theo phân bố cụm: trang, sú, mắm biển, bần chua, vẹt dù, đước vòi, giá, ô rô. Mật độ là *minh hoạ*, vì bài 06 không có bảng đếm.
	- Đo môi trường: độ muối 1,2–1,3 (bài không ghi đơn vị), pH 5,8.
	- Công thức đúng như bài 06: sai số ước lượng, hệ số liên kết V, Margalef (bài dùng lg, mô hình hiện cả ln và lg), Shannon–Wiener, Sørensen; thêm Simpson.
	- Ô 5 × 5 m cho sai số nhỏ hơn ô 1 × 1 m.
- **Côn trùng tuyến Ao Ếch** (bài 04):
	- Vợt 2,5 giờ thu khoảng 12 bướm thuộc 7 họ, nhiều nhất là bướm phấn, như bài.
	- Bẫy hố, đĩa vàng, Malaise, lưới cản bắt các nhóm khác. Tốc độ bắt là *minh hoạ*.
	- Đường tích luỹ loài.

## 8. Công cụ cho giáo viên và phát hành
- **Trình soạn protocol** (mục "Soạn protocol" trong bảng protocol):
	- Bấm **Ghi thao tác**, làm thí nghiệm; mỗi thao tác thành một bước.
	- Sửa chữ, đổi thứ tự, xoá bước.
	- Lưu vào danh sách "Của tôi" (trình duyệt), tải hoặc mở file JSON. App kiểm tra protocol trước khi lưu.
- **Chế độ kiểm tra**: ẩn tác dụng, giải thích và nút làm mẫu; **Nộp bài** cho điểm thang 10 (bước đúng, sai thứ tự, thao tác ngoài protocol, cảnh báo).
- **Phát hành** (2026-10-16, chi tiết ở [note 09](/projects/virtual-lab/thi-nghiem-giai-doan-4/) mục 0):
	- Bản cài: đóng gói macOS (Apple Silicon, Intel), Windows, Linux trên GitHub Actions, không cần máy Mac; mỗi bản được kiểm fuse và mở thử. Chủ dự án chọn chữ ký ad-hoc trước.
	- Bản web: chủ dự án chọn chạy công khai trên subdomain riêng qua Cloudflare Pages; workflow đã sẵn, chờ thêm secret Cloudflare và gắn subdomain.

## Tiến độ
- [x] 0. Nền dùng chung ✅ 2026-10-16
- [x] 1. Hoá sinh định tính ✅ 2026-10-16
- [x] 2. Enzyme ✅ 2026-10-16
- [x] 3. Vi sinh và biến nạp ✅ 2026-10-16
- [x] 4. Sinh học phân tử và protein ✅ 2026-10-16
- [x] 5. Phôi chim ✅ 2026-10-16
- [x] 6. Tiến hoá và di truyền quần thể ✅ 2026-10-16
- [x] 7. Thực địa Cát Bà ✅ 2026-10-16
- [x] 8. Công cụ cho giáo viên và phát hành: trình soạn, chế độ kiểm tra, đóng gói ba hệ điều hành trên GitHub Actions, workflow bản web công khai ✅ 2026-10-16
