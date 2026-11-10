---
title: 'Bài 2: Tinh sạch enzyme'
type: lab-report
tags:
  - biology
  - enzymology
  - protease
  - enzyme-purification
  - lab-report
section: Sinh học
folder: Sinh học / Biology Project and Lab Report / Enzymology
vaultPath: >-
  Resources/Sinh học/Biology Project and Lab Report/Enzymology/03 - Tinh sạch
  protease từ nọc nhện.md
url: /blog/tinh-sach-enzyme/
topic: biology
updated: '2026-10-16'
order: 3
description: >-
  Bài tập phân tích quy trình tinh sạch enzyme (enzyme purification) từ một bài
  báo: protease từ nọc độc nhện Cupiennius salei (Langenegger et al., 2018 – xem
  04 - Protease PQM từ nọc nhện Cupiennius salei). Trả lời 4 câu 
isIndex: false
---
> Bài tập phân tích quy trình **tinh sạch enzyme (enzyme purification)** từ một bài báo: **protease từ nọc độc nhện** *Cupiennius salei* (Langenegger et al., 2018 – xem [04 - Protease PQM từ nọc nhện Cupiennius salei](/blog/identification-of-a-precursor-processing-protease-from-the-spider-cupiennius-sal/)). Trả lời 4 câu hỏi.

## Mục đích
- Đánh giá **độ đặc hiệu** của phương pháp đo hoạt độ.
- Giải thích lý do chọn từng **bước tinh sạch**.
- Biết cách **chứng minh enzyme đã sạch**; tính **hiệu suất thu nhận** và **độ sạch (fold purification)**.

## Nguyên lý
- **Hiệu suất thu nhận (yield)**: $\text{Yield (\%)} = \dfrac{\text{Tổng hoạt độ ở bước cuối}}{\text{Tổng hoạt độ ban đầu}} \times 100$
- **Độ sạch (lần)**: $\text{Fold} = \dfrac{\text{Hoạt độ riêng ở bước cuối}}{\text{Hoạt độ riêng ban đầu}}$, với hoạt độ riêng = tổng hoạt độ / protein.
- **FRET (fluorescence resonance energy transfer)**: cơ chất peptide gắn cặp **DABCYL** (chất dập) – **EDANS** (chất phát huỳnh quang); khi protease cắt peptide, hai nhóm tách ra → huỳnh quang tăng.

## Vật liệu & phương pháp
- **Câu 1 – Phương pháp phân tích hoạt độ có đủ đặc hiệu không?**
	- Đo hoạt tính phân giải protein bằng **FRET** với 2 cơ chất mô phỏng vị trí cắt thật của tiền chất độc tố:
		- **Cơ chất PQM** (*processing quadruplet motif*): DABCYL-PFFEN**EQAR**KDDKN-Glu(EDANS)-NH₂ – lấy PQM của propeptide **CsTx-1** (P81694) ghép với vùng peptide trưởng thành của **CsTx-9** (P58604) để tránh ảnh hưởng của cysteine tự do ở vị trí 2 của CsTx-1.
		- **Cơ chất iPQM** (*inverted PQM*): DABCYL-FYPSQ**RSET**D-Glu(EDANS)-NH₂ – theo độc tố thần kinh dị dimer **CsTx-13** (P83919).
	- Điều kiện: 1,2 µg cơ chất trong 130 µl đệm (200 mM NH₄OAc pH 6,0, 100 mM KCl, 1 mM CaCl₂) + 20 µl mỗi phân đoạn, ủ 30–120 phút ở nhiệt độ phòng trên đĩa 96 giếng đen; đo huỳnh quang điểm cuối ở 25 °C (Synergy HT, lọc 340/30 và 485/20 nm).
	- Hoạt độ = **% cơ chất bị cắt** so với **đối chứng âm** (chỉ đệm) và **đối chứng dương** (1 µg trypsin); đo lặp 3 lần.
	- Tính đặc hiệu còn được kiểm tra qua chất ức chế: Co²⁺, Mn²⁺, Mg²⁺, Ni²⁺, Ca²⁺ không ảnh hưởng đáng kể; **Zn²⁺ 5 mM** làm giảm hoạt độ; **EDTA 10 mM** giảm nhẹ; **AEBSF 10 mM** (ức chế serine protease) → **mất hoàn toàn** hoạt tính; cation hoá trị một không ảnh hưởng.
- **Câu 2 – Vì sao dùng các bước tinh sạch này?**
	- **Bước 1 – Sắc ký lọc gel** (Sephadex G-75 theo bài làm; bài báo ghi cột Superdex 75 HR): tách phân đoạn có hoạt tính khỏi phần lớn peptide/protein **< ~35 kDa** (SDS-PAGE). (→ [Phân tách exosome](/blog/phan-tach-exosome-va-cac-bong-ngoai-bao-tu-huyet-tuong-nguoi/))
	- **Bước 2 – Sắc ký trao đổi cation** (MiniS PE 4.6/50): **làm giàu** hoạt tính phân giải protein; tổng hoạt tính giảm do protease bị tổn hại (hoạt độ riêng giảm) hoặc mất protease – band a (protease) nhạt đi so với band b (peptide tạp).
	- **Bước 3 – RP-HPLC** (cột C4 Nucleosil): loại bỏ các **peptide tạp còn lại** (band b).

## Kết quả chính
- **Câu 3 – Làm sao biết enzyme đã tinh sạch?**
	- Mọi phân đoạn của mỗi bước sắc ký đều được thử hoạt tính bằng 2 cơ chất PQM và iPQM; phân đoạn có hoạt tính → chạy **SDS-PAGE** → đưa sang bước tiếp theo. (→ [2D-PAGE](/blog/dien-di-hai-chieu-2d-page/))
	- Enzyme sau RP-HPLC cho **1 băng** hơi dưới 30 kDa trên SDS-PAGE, khớp khối lượng **28 kDa** đo bằng **MALDI-TOF-MS**; không phát hiện tạp chất bằng cả SDS-PAGE và MALDI-TOF-MS. (→ [MALDI-TOF MS](/blog/phan-tich-khoi-pho-maldi-tof-ms-va-nhan-dang-protein-pmf/))
	- **LC-MS** cho thấy protease là **heterodimer**: chuỗi nhẹ (~1,6 kDa) nối với chuỗi nặng bằng **1 cầu disulfide**. (→ [LC-MS/MS](/blog/sac-ky-long-khoi-pho-lc-ms-ms-va-nhan-dang-protein/))
- **Câu 4 – Hiệu suất và độ sạch**:
	- **Hiệu suất thu nhận: 23,6%**.
	- **Độ sạch tăng 1097 lần**.

## Kết luận & thảo luận
- Phép thử FRET với cơ chất mô phỏng PQM/iPQM kết hợp chất ức chế đặc hiệu (AEBSF) đủ đặc hiệu để theo dõi protease xử lý tiền chất độc tố qua các bước tinh sạch.
- Chuỗi **lọc gel → trao đổi cation → RP-HPLC** tách theo kích thước → điện tích → độ kỵ nước, cho enzyme đồng nhất dù hiệu suất thấp (mất hoạt tính ở bước CEX).
- Xem thêm: [Mô phỏng trong Virtual Lab](/projects/virtual-lab/thi-nghiem-giai-doan-4/) – protocol `pu-protease`: ba bước sắc ký, đo FRET, gộp phân đoạn, bảng tinh sạch khớp 1097 lần và 23,6 %.

## Tài liệu gốc
*Bài 2 - Tinh sạch enzyme - Nguyễn Thị Thu Hà.pdf*
