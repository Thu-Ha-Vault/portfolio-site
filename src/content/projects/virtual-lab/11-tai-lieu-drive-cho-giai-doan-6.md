---
title: Tài liệu Drive cho giai đoạn 6
type: note
tags:
  - project
  - virtual-lab
  - simulation
folder: Projects / Virtual_Lab
vaultPath: Projects/Virtual_Lab/11 - Tài liệu Drive cho giai đoạn 6.md
url: /projects/virtual-lab/tai-lieu-drive-cho-giai-doan-6/
updated: '2026-10-19'
date: '2026-10-16'
status: active
order: 11
project: virtual-lab
isIndex: false
description: >-
  Yêu cầu của chủ dự án (2026-10-16): "Truy cập vào drive, dùng folder này để
  làm tài liệu tiếp tục build lab", kèm hai thư mục: Sinh học:
  https://drive.google.com/drive/folders/1GSzxKnIubWejR32YjwGZOuiqHxlGa Hoá học:
  http
---
Yêu cầu của chủ dự án (2026-10-16): "Truy cập vào drive, dùng folder này để làm tài liệu tiếp tục build lab", kèm hai thư mục:
- Sinh học: https://drive.google.com/drive/folders/1GSz_xKnIubWe_jR32YjwGZOuiqH_xlGa
- Hoá học: https://drive.google.com/drive/folders/16Pdsc3qgxKBlIT0Hq_mgP9gj0QRLpchC

Kế hoạch và tiêu chí "xong" của giai đoạn 6 nằm ở mục 8 của CLAUDE.md.

## 1. Cách dùng tài liệu
- Drive chỉ đọc: không tạo, sửa, chia sẻ hay xoá file. File chủ sở hữu tắt quyền tải (Bài tập Hoá học phân tích 1982) thì bỏ qua.
- Ảnh thực hành của chủ dự án không chép vào repo mã nguồn; app chỉ dùng nội dung chép lại (màu, vị trí, số liệu). Họ tên và mã sinh viên trong báo cáo không đưa vào app.
- Ảnh HEIC đổi sang JPG trong thư mục tạm của phiên để đọc; khoảng 250 ảnh đã chép lại thành mô tả.
- Chỗ tài liệu gốc khác nguồn chuẩn: app theo nguồn chuẩn, ghi lại ở mục 4.

## 2. Kiểm kê
- **Sinh học** (33 mục ở gốc): thư mục ĐVCXS, ĐVKXS, Thực vật, Sinh Tế Bào, Cơ sở sinh thái học, Vi sinh, Hoá Sinh, Book and Article, Scientific English in Biology; các file lẻ:
	- Báo cáo DTH bài 5+6 (tách DNA thực vật bằng CTAB, báo cáo của chủ dự án).
	- PCR_basic (chương sách về PCR), ThinghiemVisinh (thí nghiệm vi sinh vật học), ghi chú ngành Giun dẹp, Giun vòi.
	- Bài báo *Bidens pilosa*, phân tích liều – đáp ứng bằng gói R `drc`, kỹ thuật chỉ thị DNA, ấp trứng rắn *Natrix maura*.
	- Nhiều lối tắt tới thư viện tài liệu chung của khoa (không đọc hết).
- **Hoá học** (khoảng 420 mục):
	- Giáo trình "Thực tập hoá đại cương" (Khoa Hoá, ĐHKHTN – ĐHQGHN, 10 bài, bản scan 138 trang).
	- Đề cương CHE 1080, đề thi, bài giảng (→ [Hoá học đại cương](/blog/hoa-hoc-hoa-dai-cuong-hoa-phan-tich-hoa-huu-co/)).
	- Thư viện "HÓA HỌC" chia sẻ: muối Mohr, HPLC paracetamol + caffeine, nano bạc, thực tập công nghệ hoá học.

## 3. Đã đưa vào app
### 3.1. Tách DNA thực vật bằng CTAB
- Nguồn: báo cáo "Bài 5–6. Tách ADN từ thực vật" (→ [Tách chiết DNA thực vật bằng CTAB](/blog/tach-chiet-dna-thuc-vat-bang-ctab-va-dien-di-gel-agarose/)).
- App: `src/core/dna-extract.js`, protocol `dx-ctab` ở bàn sinh học phân tử.
	- 13 bước như báo cáo: 50 mg mẫu + 1 mL đệm CTAB (2 % CTAB, 100 mM Tris-HCl pH 8, 20 mM EDTA, 1,4 M NaCl), 65 °C 15 phút, 500 µL chloroform : isoamyl alcohol 24 : 1, ly tâm 13 000 rpm 10 phút 4 °C, isopropanol 0,6 thể tích, ethanol 70 %.
	- Đo A260/A280 (DNA sạch khoảng 1,8, RNA khoảng 2,0 theo NanoDrop Technical Note T042); điện di với thang 1 kb.
	- Ảnh gel vẽ được vệt kéo dài: băng DNA genome sát giếng, vệt DNA đứt gãy, protein dính ở giếng, vệt RNA ở cuối đường chạy, giống ảnh gel thật của bài.
	- Làm đúng bằng tay vẫn có mẫu đẹp, mẫu không (bài thật: khoảng 5/13 mẫu của lớp tách khá tốt). Làm sai: nghiền quá mạnh, tip thường cho dịch đặc, ủ 37 °C hoặc 95 °C, cho CI khi dịch còn nóng, vortex quá lâu, hút chạm mặt phân cách, ethanol 100 %, đổ mạnh, không ghi tên ống.
	- Lượng DNA và mức đứt gãy là số *minh hoạ*.

### 3.2. Khu giải phẫu mở rộng
- Động vật không xương sống, theo ảnh thực hành ĐVKXS:
	- Giun đũa cái (→ [Giun đũa](/blog/nganh-giun-tron-nematoda-giun-dua/)), ốc có nắp (→ [Ốc](/blog/nganh-than-mem-mollusca-oc/)), gián (→ [Gián](/blog/nganh-chan-khop-arthropoda-gian-va-phan-phu-mieng-con-trung/)): protocol `dis-ascaris`, `dis-snail`, `dis-cockroach`.
	- Giun đất sửa theo ảnh mổ thật (thêm túi tinh).
- Ếch đồng theo báo cáo mổ ếch ĐVCXS (→ [Giải phẫu ếch đồng](/blog/giai-phau-ech-dong/)):
	- Quan sát khoang miệng trước khi mổ: lưỡi chẻ hai thuỳ, lỗ mũi trong, lỗ vòi Eustache.
	- Thêm mạng mao mạch dưới da (hô hấp qua da), tuyến tuỵ dọc tá tràng, tì, ruột già và trực tràng; màu nội quan theo ảnh mẫu mổ thật; gan ba thuỳ.
- Chuột nhắt trắng (→ [Giải phẫu chuột bạch](/blog/giai-phau-chuot-bach/)), protocol `dis-mouse`:
	- 17 cơ quan: tuyến nước bọt dưới hàm, khí quản, tim 4 ngăn, phổi (trái 1 thuỳ, phải 4 thuỳ), cơ hoành, gan, túi mật, dạ dày, lách, tuỵ, ruột non, manh tràng, ruột già, bóng đái, thận, mạch chủ, tuyến sinh dục.
	- Cơ thành bụng cắt đúng đường trắng giữa bụng (ít mạch máu), khác ếch; nằm sấp thì không mở được; cắt sâu thủng manh tràng.
	- Nguồn thêm: Cook M.J. 1965, *The Anatomy of the Laboratory Mouse*.
- Cá chép (→ [Giải phẫu cá chép và cá rô phi](/blog/giai-phau-ca-chep-va-ca-ro-phi/)): thêm lách; mô tả mang (4 đôi, sợi mang, lược mang, răng hầu), tim, gan tuỵ, túi mật xanh đen, bóng hơi hai ngăn theo ghi chép.
- Cảnh 3D: hình chuột (đầu nhọn, tai, ria, bốn chân, đuôi dài); camera lại gần mẫu nhỏ; nhãn ✓ chỉ cho 3 cơ quan vừa quan sát.

### 3.3. Tiêu bản hiển vi ảo
- Nguồn: ảnh thực hành Thực vật (→ [Giải phẫu lá, thân, rễ](/blog/giai-phau-la-than-re-cay-mot-la-mam-va-hai-la-mam/); [Ảnh tiêu bản giải phẫu thực vật](/blog/anh-tieu-ban-giai-phau-thuc-vat/); [tảo](/blog/thuc-vat-bac-thap-tao-va-vong-doi-xen-ke-the-he/)) và Sinh Tế Bào (tiêu bản ép giảm phân, nguyên phân).
- App: `src/core/slides.js`, `src/ui/slide-svg.js`, `data/slides.json`, 3 protocol `sl-plant`, `sl-meiosis`, `sl-mitosis` ở bàn quang học; `tests/slides.html` xem nhanh mọi tiêu bản.
	- 12 tiêu bản: rễ ngô, thân dâm bụt non, thân thứ cấp (tiêu bản cố định), thân lúa, thân ngô, thân bí ngô, lá trúc đào, lá lúa có mô khí, giảm phân tinh hoàn châu chấu (kiểu đỏ cam và hồng tím), nguyên phân đỉnh rễ hành, tảo silic.
	- Nhuộm kép theo ghi chú trên bảng của buổi thực hành: vách cellulose hồng, vách hoá gỗ xanh.
	- Thị trường theo kính Olympus CX23 (20 mm / độ phóng đại vật kính): 4×, 10×, 40×, 100× có dầu soi.
	- Nhận dạng lát cắt (8 loại); tìm tế bào theo kỳ; đếm các kỳ, tính chỉ số nguyên phân. Kỳ giữa I có 11 thể lưỡng trị và một nhiễm sắc thể X (châu chấu đực 2n = 23).
	- Làm sai theo đúng các lỗi thấy trong ảnh: lát cắt dày (đen), thả lá kính rơi (bọt khí viền đen), không nhuộm, tiêu bản ép không dàn (khối đỏ đặc), 100× thiếu dầu.
	- Hình là sơ đồ theo cấu tạo điển hình (Evert 2006, *Esau's Plant Anatomy*), không phải ảnh chụp; kích thước tế bào và tần số các kỳ là số *minh hoạ*.

### 3.4. Thực tập hoá đại cương Bài 1, 2
- Nguồn: giáo trình Thực tập hoá đại cương (Khoa Hoá, ĐHKHTN – ĐHQGHN) trong thư mục Hoá học.
- App: `src/core/genchem.js`, `data/genchem.json`, protocol `gc-bai1`, `gc-bai2` ở bàn hoá học.
	- Bài 1: cân 10 mL nước lấy bằng pipet (khoảng 9,98 g vì nước ở 20 °C nặng 0,9982 g/mL); kết tủa CaCO₃, CaSO₄, Ca₃(PO₄)₂ từ CaCl₂ 0,2 M; lọc giấy gấp rãnh; rửa tới khi nước rửa không còn đục với AgNO₃ (rửa 3 lần còn đục, 6 lần thì sạch).
	- Bài 2: pha oxalic acid chuẩn 0,02500 M (0,788 g trong 250,0 mL); pha NaOH, HCl, KMnO₄ gần đúng; chuẩn NaOH bằng oxalic acid với phenolphthalein; chuẩn HCl với hai chỉ thị; chuẩn KMnO₄ bằng oxalic acid trong H₂SO₄ 20 %, đun 60–70 °C.
	- pH trong bình tính từ cân bằng điện tích với pKa của oxalic acid (1,25 và 4,27, theo Harris); đường cong chuẩn độ trong thẻ kết quả.
	- Làm sai: methyl orange cho oxalic acid (dừng ở nấc thứ hai, C(NaOH) sai khoảng 30 %), không tráng buret bằng dung dịch chuẩn, dừng khi màu hồng chưa bền 30 giây, chuẩn KMnO₄ không có acid (MnO₂ nâu) hoặc không đun, pha quá vạch, cân chất gốc bằng cân kỹ thuật, mép giấy lọc cao hơn phễu.

### 3.5. Phương pháp lấy mẫu
- Nguồn: báo cáo Cơ sở sinh thái học Bài 2 (→ [Phương pháp lấy mẫu](/blog/phuong-phap-lay-mau/)).
- App: `src/core/sampling.js`, `data/sampling.json`, protocol `eco-sampling` ở khu nuôi sinh vật.
	- 26 cốc mọt, tổng 275 con như bài; 10 cốc đầu là mẫu 10 cốc của bài, 16 cốc còn lại là số *minh hoạ* sao cho tổng đúng 275.
	- Bốc thăm ngẫu nhiên n cốc: x̄, s², SE, khoảng μ = x̄ ± 1,96 SE, P = x̄ · 26, số mẫu cần lấy N = 25 s²/x̄²; đếm toàn bộ để tính sai số phương pháp.
	- Nhập số liệu của bài: x̄ = 12,2, P = 317,2 (10 cốc); x̄ = 10,75, P = 279,5 (8 cốc).
	- Làm sai: chọn cốc trông nhiều mọt (lệch cao khoảng 2–3 con mỗi cốc), lấy quá ít cốc.

### 3.6. Vi sinh vật học
- Nguồn: giáo trình Thí nghiệm vi sinh vật học (phần II) trong thư mục Sinh học (→ [Thí nghiệm vi sinh vật học](/blog/thi-nghiem-vi-sinh-vat-hoc-microbiology-laboratory-methods/)); công thức đếm theo ISO 7218, MPN theo Cochran 1950.
- App: `src/core/microcount.js`, `src/ui/gram-svg.js`, `data/microbe.json`, 4 protocol ở khu tủ an toàn sinh học.
	- `vs-gram` (Bài 4): tím kết tinh 1 phút, Lugol 1 phút, tẩy cồn 30 giây, safranin; *B. subtilis* tím, *E. coli* hồng, vết trộn có cả hai. Hình vi trường vẽ theo kích thước tế bào của giáo trình (*B. subtilis* 3–5 × 0,6 µm).
	- `vs-tpc` (Bài 10): 10 g mẫu + 90 mL SPW, pha loãng 1 + 9, đổ đĩa 1 mL với PCA 45 °C, ủ 30 °C 72 giờ, chọn đĩa 25–250 khuẩn lạc, N = ΣC/[V(n₁ + 0,1n₂)d]. Ví dụ của giáo trình (10⁻³: 235, 246; 10⁻⁴: 26, 21) ra đúng 2,4 · 10⁵ CFU/g.
	- `vs-mpn` (Bài 10): 3 × 3 ống LSB, khẳng định BGBL; MPN tính bằng hợp lý cực đại, trùng bảng 3 ống của giáo trình (3-0-0 → 23, 3-1-0 → 43, 3-2-0 → 93, 3-3-0 → 240).
	- `vs-yeast` (Bài 5): buồng đếm Goriaev, N/mL = 0,25 · a · 10⁶ nhân độ pha loãng; 5–10 tế bào mỗi ô nhỏ, đếm ít nhất 5 ô lớn.
	- Làm sai: quên Lugol, tẩy cồn quá lâu hoặc quá ngắn, canh trường già (Gram biến đổi), cố định quá nóng; không đổi tip, không lắc khi pha loãng; đổ thạch quá nóng; ủ chưa đủ 72 giờ; không khẳng định trên BGBL; buồng đếm quá đông hoặc quá thưa.
	- Mật độ thật của mẫu, tỉ lệ chết khi thạch nóng, tỉ lệ ống LSB dương tính giả là số *minh hoạ*.

### 3.7. Thực tập hoá đại cương Bài 9
- Nguồn: giáo trình Thực tập hoá đại cương, Bài 9 Cân bằng hoá học – Le Chatelier; pKa theo Harris (acetic acid 4,76, NH₄⁺ 9,24).
- App: thao tác `gc-eq` trong `src/core/genchem.js`, protocol `gc-bai9` ở bàn hoá học; thẻ kết quả vẽ hàng ống nghiệm bằng `src/ui/tube-swatch.js`.
	- CoCl₂: thêm HCl đặc hoặc NH₄Cl tinh thể thì chuyển xanh (CoCl₄²⁻); nước nóng xanh hơn, nước lạnh hồng lại. Chỉ dùng chiều chuyển dịch, không dùng số K, ΔH.
	- CH₃COOH 0,1 M + methyl orange: thêm CH₃COONa thì pH tăng, chỉ thị đổi màu; thêm NaOH cũng vậy nhưng vì trung hoà. NH₃ 0,1 M + phenolphthalein: thêm NH₄Cl thì nhạt màu; ZnCl₂ lấy OH⁻ tạo Zn(OH)₂ kết tủa trắng (chỉ định tính). pH trước và sau tính theo cân bằng điện tích.
	- NaCl bão hoà + HCl đặc: tinh thể NaCl tách ra (ion chung).
	- Làm sai: chọn chỉ thị có khoảng đổi màu không nằm giữa pH trước và sau (ví dụ phenolphthalein cho ống acetic acid) thì không thấy đổi màu, thẻ kết quả giải thích vì sao.

### 3.8. Hồi quy phi tuyến
- Nguồn: Ritz & Streibig 2005, *Bioassay analysis using R* (PDF trong thư mục Sinh học).
- App: `nls()` (Levenberg–Marquardt, sai số chuẩn từ (JᵀJ)⁻¹s²) trong `src/core/stats.js`; mô hình Michaelis–Menten và logistic 4 tham số của gói drc trong bảng Phân tích số liệu (→ [Tương quan và hồi quy](/blog/tuong-quan-va-hoi-quy/)); mã R xuất ra là `nls()` hoặc `drm()`.
	- Bộ Puromycin (Treloar 1974) trong `data/stats.json`, protocol `st-puromycin`: khớp ra Vm = 212,7, K = 0,0641 (tế bào xử lý) và Vm = 160,3, K = 0,0477 (không xử lý), đúng như trong bài báo.
	- Bộ `ryegrass` của bài báo không có số liệu gốc trong PDF nên không đưa vào; số nhớ lại không ra đúng tham số của bài báo.

### 3.9. Hình giải phẫu chuẩn theo loài (2026-10-17)
- Yêu cầu: "Vẽ chuẩn cấu trúc giải phẫu của các mẫu thí nghiệm động vật, render kĩ từng loài".
- Cách làm:
	- Mỗi loài một file hình học trong `src/core/anatomy/` (bộ hình cơ bản `kit.js`). Toạ độ tính theo chiều dài thân, vị trí và kích thước tương đối của nội quan lấy theo tài liệu giải phẫu (nguồn trong `data/dissection.json`).
	- Cùng một hình học dựng cả hình SVG trong thẻ kết quả (`src/ui/dissect-svg.js`: khay sáp đen, bóng, vân mô, số chú thích xếp hai dải) và mẫu 3D trên khay (`src/scene/anatomy-mesh.js`).
	- Hình đổi theo từng bước: nằm sấp hay ngửa, đường cắt, vạt da và vạt cơ đã phanh, mở một phần, nội quan đã gỡ, đực hay cái. Xem nhanh mọi loài ở `tests/anatomy.html?sp=…&steps=…`.
- Từng loài:
	- Ếch đồng (→ [Giải phẫu ếch đồng](/blog/giai-phau-ech-dong/)): nhìn mặt bụng.
		- Vị trí theo chiều mõm – huyệt lấy từ Ecker & Haslam 1889 (Fig. 185): tim 0,28–0,48, gan 0,34–0,65, dạ dày 0,42–0,70, thận 0,58–0,80, bóng đái 0,78–0,97.
		- Theo Holmes 1916: gan thuỳ phải, thuỳ trái chia hai, thuỳ giữa nhỏ; túi mật giữa thuỳ phải và trái; tì gần đầu ruột già; bóng đái hai thuỳ.
		- Khoang miệng (lưỡi, lỗ mũi trong, lỗ vòi Eustache) vẽ trong hình tròn tách rời; ếch đực có đôi túi kêu.
	- Chuột nhắt trắng (→ [Giải phẫu chuột bạch](/blog/giai-phau-chuot-bach/)):
		- Vị trí theo chiều mũi – hậu môn đo trên atlas Digimouse (Dogdas et al. 2007): tim 0,37–0,49, vòm cơ hoành 0,47–0,50, gan 0,47–0,69, thận phải cao hơn thận trái.
		- Theo Cook 1965: phổi trái 1 thuỳ, phổi phải 4 thuỳ; dạ dày có phần trước không tuyến.
		- Thêm tuyến ức.
	- Cá chép (→ [Giải phẫu cá chép và cá rô phi](/blog/giai-phau-ca-chep-va-ca-ro-phi/)): cá nằm nghiêng, thấy mặt trái.
		- Tỉ lệ ngoài (mắt, nắp mang, các vây) theo FishBase và các bài đo hình thái.
		- Nội quan theo giáo trình thực hành của Đại học Sư phạm Hoa Nam (SCNU), bài 13: tim giữa hai vây ngực, gan tuỵ phân tán, bóng hơi hai ngăn, thận rộng nhất ở chỗ thắt của bóng hơi.
	- Tôm càng: nhìn mặt lưng; mang lá (phyllobranchia), 8 lá mỗi bên (Bauer; Martinez et al. 2005).
		- Theo SCNU bài 9: tim hình tam giác có 3 đôi lỗ tim, tuyến gan bao quanh dạ dày.
		- Theo FAO 2002 (New): buồng trứng chín màu cam nằm phía lưng giáp đầu ngực. Thêm tuyến sinh dục.
	- Giun đất (→ [Giun đất](/blog/nganh-giun-dot-annelida-giun-dat/)): *Pheretima* khoảng 110 đốt, vị trí theo đốt của Bahl 1919, 1921.
		- Ống tiêu hoá: hầu 3–4, thực quản 5–7, mề 8–9, dạ dày 9–14, ruột từ đốt 15, đôi ruột tịt ở đốt 26.
		- Tim bên ở đốt 7, 9, 12, 13; túi nhận tinh ở đốt 6–9, túi tinh ở đốt 11–12, đai ở đốt 14–16.
		- Hình SVG chỉ phóng to khoảng 30 đốt đầu; mẫu 3D đủ cả con.
	- Giun đũa cái (→ [Giun đũa](/blog/nganh-giun-tron-nematoda-giun-dua/)): theo Fox 2006 và Saunders 1972.
		- Lỗ sinh dục cái ở khoảng 1/3 thân; tử cung chữ Y chứa trứng.
		- Ống dẫn trứng cuộn từ 0,33 tới 0,9 thân; búi buồng trứng ở giữa thân.
		- Hình giãn ngang 2 lần để thấy rõ.
	- Ốc có nắp (→ [Ốc](/blog/nganh-than-mem-mollusca-oc/)): xoang áo theo Rodriguez et al. 2018 (*Pomacea*).
		- Phổi chiếm trần bên trái và giữa xoang áo; mang hình chữ L ôm mép phải và mép sau của phổi.
		- Trực tràng dọc mép phải; xoang bao tim ở góc trước trái của thận; tuyến tiêu hoá và tuyến sinh dục ở tháp nội tạng.
	- Gián (→ [Gián](/blog/nganh-chan-khop-arthropoda-gian-va-phan-phu-mieng-con-trung/)): ống tiêu hoá và chuỗi hạch theo Miall & Denny 1886, khoảng 150 ống Malpighi theo Wall et al. 1975.
		- Ống tiêu hoá: diều, mề 6 răng, 8 manh tràng vị, trực tràng 6 nếp.
		- Chuỗi hạch: não, hạch dưới hầu, 3 hạch ngực, 6 hạch bụng.
		- Phần phụ miệng vẽ tách rời: môi trên, hàm trên (theo Weihmann et al. 2015), hàm dưới, môi dưới.
- Chỗ hình cũ chưa đúng, đã sửa theo tài liệu:
	- Manh tràng chuột ở bụng sau **bên trái** (Uysal et al. 2017, 100 chuột BALB/c), không phải bên phải.
	- *Pheretima* không có diều tách riêng như *Lumbricus*. Đoạn SGK gọi là diều chỉ là thực quản phình nhẹ trước mề (đốt 6–7). Mề nằm đúng đốt 8–9.
	- Mang tôm càng (Caridea) là mang lá, không phải mang phân nhánh như lông chim của họ tôm he.
	- Túi mật cá chép nằm bên phải ruột trước. Nhìn từ bên trái chỉ thấy một phần.
	- Buồng trứng giun đũa là búi ở giữa thân, không phải ở nửa sau.
	- Ở ốc, phổi và mang cùng nằm trong xoang áo: phổi ở bên trái, mang ở bên phải.
- Đã bỏ các chi tiết trích dẫn chưa kiểm chứng được (lần xuất bản, số trang); nguồn chỉ ghi phần đã đối chiếu.
- 574 kiểm thử lõi:
	- Mỗi cơ quan có hình ở cả mẫu đực và cái.
	- Điểm chú thích nằm trong khung hình.
	- Vị trí đúng theo nguồn của từng loài.
	- Số chú thích trên hình bằng số cơ quan đang thấy.

### 3.10. Thực tập hoá đại cương Bài 7: tốc độ phản ứng (2026-10-19)
- Nguồn: giáo trình Thực tập hoá đại cương, Bài 7 (→ [Hoá học đại cương](/blog/hoa-hoc-hoa-dai-cuong-hoa-phan-tich-hoa-huu-co/)).
- App: thao tác `gc-rate-conc`, `gc-rate-temp`, `gc-rate-cat`, `gc-rate-plot` trong `src/core/genchem.js`, protocol `gc-bai7` ở bàn hoá học.
	- Nồng độ: bảng 5 ống của giáo trình (3,00/1,50/1,00/0,75/0,50 mL Na₂S₂O₃ 0,20 M + nước tới 3 mL, rót nhanh 3,00 mL H₂SO₄ 0,20 M), bấm giờ tới khi bắt đầu vẩn đục; vẽ v = 1/Δt theo [Na₂S₂O₃] sau khi trộn, tính bậc riêng từ độ dốc lg v theo lg C. Ea và mốc thời gian dùng chung với protocol `rate-thio` (`data/thermo.json`); mô hình bậc 1 là đơn giản hoá.
	- Nhiệt độ: 2,0 mL KMnO₄ 0,01 M + 2,0 mL oxalic acid 0,10 M (H₂SO₄ 10 %) ở t phòng, +10, +20, +30 °C, ngâm hai ống 5 phút; vẽ lg(1/Δt) theo 1/T, tính γ (2,6–2,7) và Ea.
	- Xúc tác: 3 giọt CuSO₄ so với 3 giọt nước; thêm ống MnSO₄ (chất tự xúc tác đã biết) để so sánh.
	- Làm sai: ống còn ướt (loãng hơn bảng), đợi đục hẳn mới bấm giờ, ngâm ống 1 phút (nhiệt độ thật thấp hơn, γ và Ea sai).
	- *Chưa xác minh*: Ea của KMnO₄ – oxalic acid lấy 80 kJ/mol (báo cáo thực hành của sinh viên đo 76–81 kJ/mol; tài liệu về bước phân huỷ phức Mn(III)–oxalat cho 78–101 kJ/mol); mốc 300 s ở 25 °C là minh hoạ. Không tìm được nguồn đo tác dụng của Cu²⁺, nên app coi Cu²⁺ không đổi tốc độ và nói rõ điều đó trong thẻ kết quả.

### 3.11. Thực tập hoá đại cương Bài 4: định tính anion (2026-10-19)
- Nguồn: giáo trình Thực tập hoá đại cương, Bài 4, sơ đồ tách trang 73, thí nghiệm A–G trang 74–76.
- App: `gc-an-test`, `gc-an-answer`, protocol `gc-bai4`.
	- Mẫu 1 có đủ 6 anion CO₃²⁻, PO₄³⁻, Cl⁻, I⁻, S²⁻, NO₃⁻; mẫu 2 có 2–5 anion chọn theo seed của phiên (mỗi phiên một mẫu, hợp với chế độ kiểm tra). Mỗi phép thử làm song song hai mẫu, thẻ kết quả vẽ hai ống; vòng nâu vẽ thành một vòng giữa hai lớp.
	- Phép thử theo giáo trình: kết tủa vàng amoni photphomolipdat (B), CO₂ làm đục Ca(OH)₂ trên đầu đũa (C), CuS đen (D), I₃⁻ với hồ tinh bột (E), AgCl tan trong NH₃ rồi kết tủa lại (F), vòng nâu FeNO²⁺ sau khi kết tủa ion cản bằng Ag₂SO₄ (G).
	- Kết luận mẫu 2 lấy theo các phép thử đã làm; làm sai thì kết luận sai.
	- Làm sai: không đun và đợi 15 phút (PO₄³⁻ âm tính giả), không đợi I₃⁻ tạo thành, đũa chạm thành ống, bỏ bước NH₃ (AgI bị nhầm là AgCl), bỏ Ag₂SO₄ (I⁻, S²⁻ bị H₂SO₄ đặc oxy hoá, tạo vòng giả), lắc ống (mất vòng).
	- Trên bản scan có chữ viết tay ghi kết quả của chủ dự án; app không dùng vì không đọc chắc được.

### 3.12. Thực tập hoá đại cương Bài 5A: nhiệt lượng kế (2026-10-19)
- Nguồn: giáo trình Thực tập hoá đại cương, Bài 5A trang 77–83 (hình 5.2 hiệu chỉnh Δt bằng đồ thị).
- App: `gc-cal-run`, `gc-cal-result`, protocol `gc-bai5a`.
	- Mô phỏng nhiệt độ trong bình 250 mL nước theo từng giây: trao đổi nhiệt với phòng, nhiệt do khuấy, muối tan dần sau khi chọc ămpun; ghi 12 điểm mỗi 30 giây, giai đoạn chính mỗi 10 giây tới khi ổn định, 10 điểm cuối mỗi 30 giây; Δt lấy bằng hai đường ngoại suy và đường thẳng đứng chia hai phần diện tích bằng nhau.
	- C_k từ KNO₃ (ΔH = 8,52 kcal/mol theo giáo trình), rồi ΔH hoà tan KCl khoảng 17,4 kJ/mol, so với 17,22 kJ/mol của tài liệu.
	- Làm sai: muối dính thành ămpun (|Δt| nhỏ, ΔH sai), lấy Δt đọc thẳng (Δt lệch khoảng 3 %; hai lần đo lệch cùng chiều nên ΔH(KCl) chỉ lệch ít, thẻ kết quả giải thích).
	- Phần B (pin Ganvani) và phần CuSO₄ chưa làm; giáo trình ghi phần CuSO₄ là "không làm thí nghiệm này".

### 3.13. Vi sinh: nhuộm bào tử, kháng sinh đồ, lên men rượu (2026-10-19)
- Nguồn: giáo trình Thí nghiệm vi sinh vật học (→ [Thí nghiệm vi sinh vật học](/blog/thi-nghiem-vi-sinh-vat-hoc-microbiology-laboratory-methods/)) Bài 4 mục 4.2, Bài 6 phần I, Bài 8 mục 1.2d; vòng kiểm chuẩn theo EUCAST QC Tables v13.1 (2023).
- App: `vs-spore`, `vs-disk`, `vs-ferment` trong `src/core/microcount.js`; hình ở `src/ui/micro-svg.js`; 3 protocol cùng tên.
	- Nhuộm bào tử Ôgietska (Ozheshko): *B. subtilis* 2 tuần tuổi, bào tử đỏ hình ovan ở giữa hoặc lệch tâm, tế bào chất xanh. Làm sai: canh trường 24 giờ (hầu như chưa có bào tử), không hơ nóng (bào tử không màu), quên xanh methylene.
	- Kháng sinh đồ: khoanh 6 mm, 37 °C 18 giờ; *E. coli* ATCC 25922 trên Mueller-Hinton cho vòng quanh đích EUCAST (ampicillin 10 µg 15–22 mm, gentamicin 10 µg 19–26, chloramphenicol 30 µg 21–27, ciprofloxacin 5 µg 29–37); cùng chủng mang pUC19 (gen *bla*) mọc sát khoanh ampicillin, nối với bài biến nạp. Làm sai: cấy quá dày (vòng nhỏ đi 3 mm, minh hoạ), khoanh sát nhau (vòng chồng lên nhau), ủ 6 giờ.
	- Lên men rượu: dịch quả + men giống, 30 °C 24 giờ; CO₂ đẩy nước trong ống chia vạch, Ba(OH)₂ đục, iodoform vàng, K₂Cr₂O₇ da cam thành xanh lục, ống đối chứng giữ da cam. Làm sai: quên cấy men, để 4 °C. Thời gian ống đầy khí là minh hoạ nên app không hiện số mL.

### 3.14. PCR mở rộng (2026-10-19)
- Nguồn: chương "Polymerase Chain Reaction: Các vấn đề cơ bản" (→ [PCR – Các vấn đề cơ bản](/blog/cac-van-de-co-ban-polymerase-chain-reaction/)), bài tổng quan kỹ thuật chỉ thị DNA (Nguyễn Đức Thành 2014), sách Sinh học phân tử chương 1 (Hoàng Trọng Phán 2012); Tm theo Schildkraut & Lifson 1965 và Marmur & Doty 1962.
- App: `src/core/pcrmix.js`, `data/pcrmix.json`, bảng "PCR mở rộng" ở bàn PCR, protocol `pm-touchdown`, `pm-rapd`, `pm-melt`.
	- Master mix 100 phản ứng 25 µL tính bằng C·V = C′·V′, trùng Bảng 1 của tài liệu (nước 1505 µL). Làm sai: pha từng ống (phải lấy 0,05–0,25 µL), buffer có sẵn MgCl₂ mà vẫn thêm (Mg²⁺ 3 mM, băng phụ tăng).
	- Touch-down sơ đồ 1 và 2 so với 35 chu kỳ bắt cặp 55 °C (có băng phụ) và 65 °C (đặc hiệu nhưng mờ); ảnh gel vẽ từ số bản sao của từng sản phẩm. Tm của mồi, của vị trí bắt cặp lệch và số vị trí là minh hoạ.
	- RAPD 6 giống A–F (mẫu minh hoạ) với hai mồi 10 nucleotide (Tm theo quy tắc Wallace 32–34 °C), bắt mồi 36 °C; ma trận 0/1, hệ số Dice, cây UPGMA khôi phục đúng cây giả định. Bắt mồi 55 °C thì không có băng.
	- Đường cong nóng chảy A260: Dictyostelium, *S. cerevisiae*, *S. pneumoniae*, *E. coli* theo %GC trong sách; Tm = 81,5 + 16,6·log[Na⁺] + 0,41·%GC. Làm sai: đệm loãng 10 lần (Tm thấp hơn 16,6 °C), đun nhanh (Tm đọc cao hơn).

### 3.15. Liều – đáp ứng phôi cá và tiêu bản tế bào (2026-10-19)
- Đường liều – đáp ứng phôi cá ngựa vằn (`zf-analyze`) khớp thêm mô hình log-logistic của gói drc (Ritz & Streibig 2005): LL.4 nếu giới hạn ước lượng nằm trong khoảng hợp lý, nếu không thì cố định 0 và 100 % (LL.2); đường khớp vẽ nét đứt trên đồ thị, so LC50 với hồi quy nhị thức.
- Tiêu bản tế bào theo Bài thực tập số 2 Sinh học tế bào (protocol `sl-cells`, kiểu `cells` trong `src/core/slides.js`):
	- Biểu bì vảy hành, giọt ép, xanh methylene, đợi 15–20 phút: tế bào chữ nhật dài xếp so le, nhân sát vách có hạch nhân, không bào lớn.
	- Niêm mạc miệng, dấu quét, để khô se, cố định methanol, Giemsa: tế bào dẹt đa giác, nhân hồng tím ở giữa.
	- Làm sai: thả lamen rơi (bọt khí), không đợi thuốc nhuộm ngấm (tế bào gần như trong suốt), cố định khi vết quét còn ướt (tế bào trôi, còn khoảng 15 %). Kích thước tế bào là minh hoạ.

### 3.16. Muối Mohr và HPLC paracetamol + caffeine (2026-10-19)
- Nguồn: thư viện "HÓA HỌC" do người khác chia sẻ trong Drive (không phải bài của chủ dự án): giáo trình Thực tập hoá học ứng dụng phần vô cơ (ĐHKHTN TP.HCM) và hai báo cáo muối Mohr; tường trình HPLC-UV paracetamol và caffeine trong Panadol Extra (nhóm sinh viên, 04/2023). Bỏ họ tên sinh viên.
- Muối Mohr (`gc-mohr-*` trong `src/core/genchem.js`, protocol `gc-mohr`):
	- Định tính: NaOH 30 % (Fe(OH)₂ trắng xanh, giấy pH ẩm ở miệng ống chuyển xanh vì NH₃; với FeSO₄ không đổi), BaCl₂, để ngoài không khí, H₂O₂, KMnO₄, K₂Cr₂O₇.
	- Chuẩn độ 10,00 mL dung dịch 3,92 g/100 mL bằng KMnO₄ 0,103 N (số của báo cáo) ra khoảng 9,7 mL (báo cáo 9,85–9,90 mL); BaSO₄ khoảng 2,33 g (báo cáo 2,368 g); công thức thực nghiệm gần (NH₄)₂Fe(SO₄)₂·6H₂O.
	- Làm sai: rửa tinh thể quá nhiều cồn thì muối mất nước kết tinh, ra ·5,67H₂O như báo cáo; không acid hoá khi chuẩn độ (MnO₂ nâu); lọc BaSO₄ ngay không già hoá (hạt mịn lọt giấy); không rửa kết tủa (BaCl₂ bám). Tỉ lệ mất, bám là minh hoạ.
- HPLC viên thuốc (`hplc-pc-*` trong `src/core/hplc-lab.js`, protocol `hplc-paracetamol`, bảng HPLC hàng "Viên thuốc"):
	- Pha động CH₃COOH 0,1 % : methanol 50 : 50 (chập, Rs khoảng 0,7), 60 : 40 (chưa tách hẳn, Rs khoảng 1,25), 70 : 30 (tách hoàn toàn); thời gian lưu và độ rộng pic là minh hoạ theo mô tả.
	- Dãy chuẩn đúng nồng độ của tường trình; độ dốc đường chuẩn theo số của nhóm (paracetamol 95 843, caffeine 58 106 trên 1 µg/mL); hàm lượng thật lấy theo nhãn 500 và 65 mg/viên ± 2 % (minh hoạ).
	- Mẫu thêm chuẩn pha loãng 20 lần thì nằm ngoài đường chuẩn, thu hồi không hợp lệ (đúng lỗi của nhóm, báo cáo ra 51 % và 49 %); pha loãng 40 lần thì thu hồi gần 100 %. Mô hình coi đầu dò tuyến tính, nên số thu hồi ngoại suy vẫn gần 100 %; app đánh dấu là không hợp lệ vì nằm ngoài khoảng đã dựng đường chuẩn, không mô phỏng được vì sao nhóm ra 51 %.

## 4. Chỗ tài liệu gốc khác nguồn chuẩn
App theo nguồn chuẩn; tài liệu gốc giữ nguyên.
- Báo cáo mổ ếch: vòng tuần hoàn nhỏ ghi máu từ tĩnh mạch phổi về tâm nhĩ phải, vòng lớn ghi máu về tâm nhĩ trái. Đúng là tĩnh mạch phổi về **tâm nhĩ trái**, tĩnh mạch chủ về xoang tĩnh mạch rồi **tâm nhĩ phải**.
- Báo cáo cá: tâm thất cá chứa "máu đỏ tươi". Tim cá chỉ chứa máu nghèo O₂ (đỏ thẫm); máu sau mang mới giàu O₂. Câu "cá chép ruột ngắn hơn rô phi" *cần kiểm tra* (cá chép ăn tạp thường được mô tả có ruột dài); app không dùng câu này.
- Báo cáo CTAB: isoamyl alcohol ghi là "làm kết tủa DNA"; trong hỗn hợp chloroform : isoamyl alcohol, isoamyl alcohol chủ yếu chống tạo bọt.
- Báo cáo Cơ sở sinh thái học Bài 2: Σx² của 10 cốc ghi 1891, cộng lại được **1554**; s² đúng khoảng 7,29 (không phải 44,73), khoảng tin cậy hẹp hơn. Trong app, chọn "số liệu trong báo cáo" sẽ hiện ghi chú này.
- Báo cáo Cơ sở sinh thái học Bài 1: ΔG của Vĩnh Quỳnh trừ G của bụi lơ lửng trong khi yếu tố chính đã chọn là H₂S.
- Giáo trình Thực tập hoá đại cương: Bài 3 ghi pha động acetone : HCl 9 : 1 ở danh mục hoá chất nhưng 1 : 1 ở bước làm; phenolphthalein 1 % hoặc 0,1 %; Bài 7 ghi H₂SO₄ 10 % (phần nhiệt độ) và 20 % (phần xúc tác).
- Giáo trình Thực tập hoá đại cương Bài 5A dùng ΔH hoà tan KNO₃ = 8,52 kcal/mol (35,6 kJ/mol); tài liệu khác cho 34,89 kJ/mol, nên C_k và ΔH(KCl) tính theo giáo trình cao hơn khoảng 2 %. App để người học tính theo số của giáo trình và giải thích độ lệch.
- Giáo trình Thí nghiệm vi sinh vật học Bài 6 viết C₆H₁₂O₆ → 2C₂H₅OH + CO₂; đúng là **2CO₂**.
- Sách Sinh học phân tử (chương 1) ghi Tm của DNA *E. coli* khoảng 69–70 °C. Theo Marmur & Doty (1962), trong SSC Tm = 69,3 + 0,41·%GC, nên *E. coli* (51 % GC) khoảng 90 °C; 69,3 là hằng số của công thức. Số của sách cho *S. pneumoniae* (khoảng 85 °C, 42 % GC) gần với công thức (86,8 °C).
- Bài thực tập số 2 Sinh học tế bào nhắc quan sát lục lạp ở tế bào vỏ hành; biểu bì vảy hành (vảy củ, không quang hợp) hầu như không có lục lạp, app ghi điều đó trong thẻ kết quả.

## 5. Chưa xác minh
- Tên thuốc nhuộm trong ảnh tiêu bản (ảnh không ghi; kiểu đỏ cam có thể là aceto-carmine, kiểu hồng tím có thể là aceto-orcein).
- Loài châu chấu của tiêu bản giảm phân (app dùng kiểu nhân châu chấu di cư *Locusta migratoria*, ♂ 2n = 23).
- Lá trúc đào, lá lúa, dâm bụt non: tên mẫu suy từ khay mẫu và hình dạng lát cắt.
- "DTH" trong tên file báo cáo CTAB có thể là Di truyền học.
- Ea của phản ứng KMnO₄ – oxalic acid (80 kJ/mol) và tác dụng của Cu²⁺ trong Bài 7 (mục 3.10).
- Trình tự hai mồi RAPD OPA-02 (TGCCGAGCTG) và OPA-04 (AATCGGGCTG) theo bộ mồi Operon kit A.
- Bình định mức 100 mL: đường kính bầu và cổ (note 12).

## 6. Việc tiếp theo
- [x] Hoá đại cương Bài 9 Le Chatelier: CoCl₂, acetic acid, NH₃, ion chung NaCl ✅ 2026-10-16
- [x] Hoá đại cương Bài 7 (tốc độ theo nồng độ thiosulfate, nhiệt độ, xúc tác), Bài 4 (định tính anion, mẫu ngẫu nhiên, vòng nâu), Bài 5A (nhiệt lượng kế) ✅ 2026-10-19
- [x] Muối Mohr: định tính Fe²⁺, chuẩn độ KMnO₄, khối lượng BaSO₄; HPLC paracetamol + caffeine theo đường chuẩn của tường trình ✅ 2026-10-19
- [x] Vi sinh: nhuộm Gram, buồng đếm, đếm khuẩn lạc (ISO 7218), MPN coliform ✅ 2026-10-16
- [x] Vi sinh còn lại: khoanh giấy kháng sinh, lên men, nhuộm bào tử ✅ 2026-10-19
- [ ] Hoá sinh định lượng: Lowry, Kjeldahl, Rodzevich; Wohlgemuth, Anson
- [x] PCR: pha master mix theo bảng, touch-down, RAPD; đường cong nóng chảy DNA ✅ 2026-10-19
- [x] Hồi quy phi tuyến trong `stats.js`: Michaelis–Menten, logistic 4 tham số; kiểm bằng bộ Puromycin ✅ 2026-10-16
- [x] Nối logistic 4 tham số với đường liều – đáp ứng phôi cá ngựa vằn ✅ 2026-10-19
- [x] Tiêu bản biểu bì vảy hành và niêm mạc miệng ✅ 2026-10-19
- [ ] Ô nhiễm môi trường lao động (Cơ sở sinh thái học Bài 1); bộ xương ếch, chim, bò sát, thú
- [ ] Hoá đại cương Bài 5B (pin Ganvani), Bài 3 (sắc ký giấy), Bài 6 (H₂O₂ trên Pt), Bài 8 (thuỷ phân ethyl acetate), Bài 10 (aspirin); nano bạc
