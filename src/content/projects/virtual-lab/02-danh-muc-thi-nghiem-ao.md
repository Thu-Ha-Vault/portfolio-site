---
title: Danh mục thí nghiệm ảo
type: note
tags:
  - project
  - virtual-lab
  - simulation
  - biology
  - chemistry
folder: Projects / Virtual_Lab
vaultPath: Projects/Virtual_Lab/02 - Danh mục thí nghiệm ảo.md
order: 2
project: virtual-lab
isIndex: false
---
<div class="callout callout-info">
<p class="callout-title">Mỗi thí nghiệm ghi 4 ý: người dùng làm gì, phần mềm mô phỏng gì, kết quả trả về, và kiến thức nền đã có trong vault.</p>

</div>

## A. Sinh vật sống

### A1. Lai đậu Hà Lan (Mendel)
<div class="callout callout-success">
<p class="callout-title">Đã có trong app (2026-10-16): lai một cặp, hai cặp, màu hoa, kèm χ² và sổ thí nghiệm CSV (→ [Protocol mẫu](/projects/virtual-lab/04-bo-khung-phong-thi-nghiem-3d/)). Chưa có: lai phân tích, lai thuận nghịch, tương tác gen.</p>

</div>
- **Người dùng làm**: chọn dòng thuần chủng (P), khử nhị cây mẹ, thụ phấn chéo, gieo hạt F1, cho F1 tự thụ phấn, đếm kiểu hình F2.
	- 7 tính trạng Mendel dùng: hình dạng hạt, màu hạt, màu hoa, hình dạng quả, màu quả, vị trí hoa, chiều cao thân.
- **Mô phỏng**:
	- Mỗi cây mang kiểu gen; giảm phân tạo giao tử ngẫu nhiên, thụ tinh tổ hợp ngẫu nhiên, kiểu hình theo quan hệ trội – lặn.
	- Lai một cặp và hai cặp tính trạng (phân li độc lập), lai phân tích, lai thuận nghịch.
	- Sinh trưởng: hạt → cây con → ra hoa → quả → hạt; mỗi quả có số hạt ngẫu nhiên.
- **Kết quả**: bảng đếm F2, ví dụ số liệu thật của Mendel là 5474 hạt trơn : 1850 hạt nhăn. Tỉ lệ gần 3 : 1 hoặc 9 : 3 : 3 : 1 nhưng luôn lệch ngẫu nhiên. (→ [Quy luật Mendel](/blog/sinh-hoc/kien-thuc-chung/c-quy-luat-di-truyen/09-quy-luat-mendel/))
	- Người dùng tự kiểm định $\chi^2$ để kết luận số liệu có phù hợp tỉ lệ lý thuyết không. (→ [Kiểm định χ²](/blog/sinh-hoc/biology-project-and-lab-report/biostatistics-and-bioinformatics/02-kiem-dinh-gia-thiet-thong-ke/))
- **Mở rộng**: tương tác gen (9 : 7, 12 : 3 : 1, 9 : 3 : 4…), trội không hoàn toàn (hoa mõm chó, 1 : 2 : 1).

### A2. Ruồi giấm (Morgan)
<div class="callout callout-success">
<p class="callout-title">Đã có trong app (2026-10-16): gen white trên X (lai thuận, lai nghịch), liên kết và hoán vị gen b–vg, tủ ấm theo nhiệt độ, thu ruồi cái chưa giao phối (→ [Protocol mẫu](/projects/virtual-lab/04-bo-khung-phong-thi-nghiem-3d/)). Chưa có: vòng đời từng giai đoạn trong cảnh 3D, bàn soi ruồi thao tác được.</p>

</div>
- **Người dùng làm**: nuôi ruồi trong lọ môi trường, gây mê ruồi, phân biệt đực – cái dưới kính lúp, tách **ruồi cái chưa giao phối** (thu trong vòng ~8 giờ sau khi nở), lai, đếm F1 và F2.
- **Mô phỏng**:
	- NST giới tính XX (cái) / XY (đực); gen trên X không có alen tương ứng trên Y.
	- Liên kết gen và hoán vị gen theo khoảng cách trên NST; ở ruồi giấm chỉ con cái có hoán vị.
	- Vòng đời: trứng → ấu trùng → nhộng → ruồi trưởng thành, ~10 ngày ở 25 °C, chậm hơn khi lạnh.
- **Kết quả**:
	- Gen màu mắt (white): lai thuận và lai nghịch cho kết quả khác nhau; ở F2 của phép lai ♀ mắt đỏ × ♂ mắt trắng, mắt trắng chỉ xuất hiện ở con đực. (→ [Di truyền liên kết với giới tính](/blog/sinh-hoc/kien-thuc-chung/c-quy-luat-di-truyen/11-di-truyen-lien-ket-voi-gioi-tinh/))
	- Thân xám/đen và cánh dài/cụt: lai phân tích ♀ F1 cho 4 kiểu hình, 2 kiểu tái tổ hợp chiếm ~17% → tính tần số hoán vị, dựng bản đồ gen. (→ [Liên kết gen và hoán vị gen](/blog/sinh-hoc/kien-thuc-chung/c-quy-luat-di-truyen/12-lien-ket-gen-va-hoan-vi-gen/))

### A3. Nuôi phôi cá ngựa vằn
<div class="callout callout-success">
<p class="callout-title">Đã có trong app (2026-10-16): thử độc tính OECD 236 và bài thực hành PG, ảnh phôi vẽ theo giờ, LC50, EC50, TI, tiêu chí hợp lệ (→ [Protocol mẫu](/projects/virtual-lab/04-bo-khung-phong-thi-nghiem-3d/)). Chưa có: hình 3D đĩa giếng, kính soi nổi thao tác được.</p>

</div>
- **Người dùng làm**: thu trứng sau khi cá đẻ, chọn phôi khoẻ dưới kính hiển vi, chia vào đĩa giếng, xử lý các nồng độ chất thử, quan sát định kỳ đến 96 giờ sau thụ tinh (hpf).
- **Mô phỏng**:
	- Các giai đoạn phát triển theo giờ ở 28,5 °C: hợp tử (0–0,75 hpf), phân cắt (0,75–2,25), phôi nang (2,25–5,25), phôi vị (5,25–10), phân đốt (10–24), pharyngula (24–48), nở (48–72).
	- Đường cong liều – đáp ứng: nồng độ càng cao thì tỉ lệ chết và dị dạng càng tăng; mỗi phôi có độ nhạy ngẫu nhiên.
- **Kết quả**: ảnh phôi theo giờ, bảng sống/chết theo nồng độ, LC50. Đánh giá theo OECD 236: phôi đông tụ, không hình thành đốt, đuôi không tách khỏi khối noãn hoàng, không có nhịp tim. (→ [Độc tính PG trên phôi cá ngựa vằn](/blog/sinh-hoc/biology-project-and-lab-report/developmental-biology/02-doc-tinh-propylene-glycol-tren-phoi-ca-ngua-van/))

### Ý tưởng thêm
- Lai ngô hoặc lai hoa để minh hoạ tương tác gen.
- Biến nạp plasmid vào vi khuẩn, chọn khuẩn lạc trên đĩa thạch.
- Quan sát phôi gà theo giờ ấp.

## B. Hoá học (dụng cụ + hoá chất)

### B1. Bàn thí nghiệm
<div class="callout callout-success">
<p class="callout-title">Đã có trong app (2026-10-16): lượng chất theo mol và thể tích, sai số riêng của từng dụng cụ, tủ hoá chất và tủ dụng cụ, chuẩn độ HCl bằng NaOH (→ [Protocol mẫu](/projects/virtual-lab/04-bo-khung-phong-thi-nghiem-3d/)). Chưa có: cân, đun, lọc, ly tâm, đèn cồn.</p>

</div>
- **Dụng cụ**: ống nghiệm, cốc có mỏ, bình tam giác, ống đong, buret, pipet, micropipet, đèn cồn, bếp khuấy từ, cân phân tích, máy đo pH, giấy quỳ.
- **Thao tác**: lấy hoá chất, cân, đong, rót, trộn, đun, khuấy, lọc, ly tâm, chuẩn độ.
- **Mô phỏng**: mỗi vật chứa biết mình đang chứa chất gì, bao nhiêu (mol, thể tích, nồng độ, nhiệt độ). Dụng cụ có sai số riêng, ví dụ ống đong kém chính xác hơn pipet.

### B2. Phản ứng giữa các chất
- **Mô phỏng**:
	- Bảng phản ứng: chất tham gia + điều kiện (nhiệt độ, xúc tác, môi trường) → sản phẩm + **hiện tượng quan sát được** (đổi màu, kết tủa, sinh khí, toả hoặc thu nhiệt).
	- Tỉ lượng: chất nào hết, chất nào dư, lượng sản phẩm.
	- Chất chỉ thị đổi màu theo pH.
	- Cảnh báo an toàn khi thao tác nguy hiểm, ví dụ rót nước vào acid đặc, đun ống nghiệm hướng miệng về phía người.
- **Ví dụ vô cơ**:
	- AgNO₃ + NaCl → AgCl↓ trắng + NaNO₃.
	- CuSO₄ + 2NaOH → Cu(OH)₂↓ xanh lam + Na₂SO₄.
	- Na₂CO₃ + 2HCl → 2NaCl + H₂O + CO₂↑ (sủi bọt).
	- Chuẩn độ HCl bằng NaOH, chỉ thị phenolphthalein: dung dịch chuyển từ không màu sang hồng nhạt ở điểm tương đương.
- **Ví dụ hoá sinh**:
	- Phản ứng biuret: protein + CuSO₄ trong môi trường NaOH → màu tím.
	- Kết tủa protein bằng (NH₄)₂SO₄, nhiệt, acid hữu cơ, ion kim loại nặng. (→ [Tính chất của protein](/blog/sinh-hoc/biology-project-and-lab-report/biochemistry-and-molecular-biology/04-mot-so-tinh-chat-cua-protein/))
	- Thuỷ phân tinh bột bằng amylase, thử bằng iodine: màu xanh tím nhạt dần rồi mất.

## C. Thiết bị

### C1. PCR và điện di
- **Người dùng làm**: pha master mix (DNA khuôn, cặp mồi, dNTP, Taq polymerase, buffer, Mg²⁺), cài chu trình nhiệt, chạy máy, rồi điện di sản phẩm trên gel agarose cùng ladder.
	- Chu trình điển hình: biến tính 94–95 °C → gắn mồi 50–65 °C → kéo dài 72 °C, lặp 25–35 chu kỳ. (→ [Model máy PCR, bể điện di, máy chụp gel](/projects/virtual-lab/05-tai-lieu-tham-khao-may-moc/))
- **Mô phỏng**:
	- Số bản sao tăng gần gấp đôi mỗi chu kỳ, hiệu suất dưới 100% và chững lại ở các chu kỳ cuối khi cạn mồi, dNTP.
	- Nhiệt độ gắn mồi quá thấp → thêm băng không đặc hiệu; quá cao → không có sản phẩm.
	- Nhiễm mẫu → giếng đối chứng âm có băng.
	- Điện di: DNA chạy về cực dương, quãng đường tỉ lệ nghịch với log(kích thước); plasmid siêu xoắn chạy nhanh hơn dạng thẳng.
- **Kết quả**: ảnh gel ảo với giếng ladder, mẫu và đối chứng. (→ [Thực hành Sinh học phân tử](/blog/sinh-hoc/biology-project-and-lab-report/biochemistry-and-molecular-biology/11-phan-tich-ket-qua-thuc-hanh-sinh-hoc-phan-tu/))

### C2. HPLC
- **Người dùng làm**: chọn cột (C18 pha đảo, trao đổi ion), pha động (nước, acetonitrile, formic acid), chương trình gradient, tốc độ dòng, bước sóng detector; tiêm mẫu chuẩn và mẫu thật.
- **Mô phỏng**:
	- Mỗi chất có thời gian lưu riêng, phụ thuộc độ phân cực và tỉ lệ dung môi hữu cơ: trên cột pha đảo, chất càng kém phân cực ra càng muộn.
	- Peak dạng Gauss, càng ra muộn càng rộng; hai peak gần nhau có thể chồng lên nhau.
	- Diện tích peak tỉ lệ với nồng độ → dựng đường chuẩn để định lượng.
- **Kết quả**: sắc ký đồ, bảng thời gian lưu và diện tích peak. (→ [LC-MS/MS](/blog/sinh-hoc/biology-project-and-lab-report/proteomics-and-structural-biology/06-sac-ky-long-khoi-pho-lc-ms-ms/))

### C3. Máy quang phổ UV-Vis
- **Người dùng làm**: pha dãy chuẩn, chọn bước sóng, đo mẫu trắng rồi đo mẫu.
- **Mô phỏng**:
	- Định luật Beer–Lambert $A = \varepsilon l c$; độ hấp thụ quá cao thì mất tuyến tính, phải pha loãng.
	- Động học enzyme: tốc độ phản ứng theo nồng độ cơ chất (Michaelis–Menten), ảnh hưởng của nhiệt độ và pH.
- **Kết quả**: đường chuẩn, hoạt độ enzyme. (→ [Hoạt độ lipase bằng p-NPP](/blog/sinh-hoc/biology-project-and-lab-report/enzymology/01-hoat-do-lipase-bang-p-npp/))

### Thiết bị thêm sau
- Máy ly tâm, kính hiển vi, tủ ấm, máy đọc vi đĩa, real-time PCR (qPCR), máy khối phổ (MALDI-TOF, LC-MS/MS).
