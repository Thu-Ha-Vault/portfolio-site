---
title: 'Bài 7: Phân tích khối phổ MALDI-TOF MS và nhận dạng protein (PMF)'
type: lab-report
tags:
  - biology
  - proteomics
  - mass-spectrometry
  - lab-report
section: Sinh học
folder: Sinh học / Biology Project and Lab Report / Proteomics and Structural Biology
vaultPath: >-
  Resources/Sinh học/Biology Project and Lab Report/Proteomics and Structural
  Biology/07 - Khối phổ MALDI-TOF MS và nhận dạng protein.md
order: 7
description: >-
  Báo cáo thực tập Proteomic và Sinh học cấu trúc – Nguyễn Thị Thu Hà, K66 Sinh
  học. (Trang bìa bản gốc ghi "Bài 6", nhưng file là bài 7.)
isIndex: false
---
> Báo cáo thực tập Proteomic và Sinh học cấu trúc – Nguyễn Thị Thu Hà, K66 Sinh học. (Trang bìa bản gốc ghi "Bài 6", nhưng file là bài 7.)

## Mục đích
- Hiểu nguyên lý **MALDI-TOF MS** và nhận dạng protein bằng **dấu vân tay khối lượng peptide (PMF, peptide mass fingerprinting)**.
- Nắm quy trình phân tích khối phổ và tra cứu CSDL **Mascot**.

## Nguyên lý
- **MALDI-TOF MS** (matrix-assisted laser desorption/ionization – time of flight):
	- Mẫu trộn với **chất nền (matrix)**, làm khô → xung **laser** làm mẫu ion hoá và phản hấp phụ thành ion pha khí → bay trong ống **TOF** và tách theo **m/z** (ion nhẹ bay nhanh hơn). (→ [Tinh sạch protease nọc nhện](/blog/sinh-hoc/biology-project-and-lab-report/enzymology/03-tinh-sach-protease-tu-noc-nhen/), [Protease PQM nọc nhện](/blog/sinh-hoc/biology-project-and-lab-report/enzymology/04-protease-pqm-tu-noc-nhen-cupiennius-salei/))
	- Ưu điểm: độ nhạy cao, dễ dùng, chịu được tạp chất trong mẫu, thu dữ liệu nhanh, phù hợp mức peptide.
- **So sánh MALDI và ESI**:
	- **ESI**: chủ yếu tạo **ion đa điện tích** (2+, 3+) → thuận lợi cho phân mảnh bằng khí trơ (MS/MS).
	- **MALDI**: chủ yếu tạo **ion đơn điện tích** $[M+H]^+$ → khi phân mảnh cho phổ phức tạp, khó xác định ion con.
- **PMF**: so sánh phổ khối peptide thực nghiệm với phổ peptide lý thuyết (protein trong CSDL cắt bằng trypsin in silico) → tính **score** (Mascot). (→ [Proteomics khối phổ](/blog/sinh-hoc/bioinformatics/b-data-science-and-bioinformatics/ii-giao-trinh-bioinformatics/08-proteomics-va-cau-truc-protein/))
	- Score phản ánh mức phù hợp giữa thực nghiệm và lý thuyết → độ tin cậy thống kê của nhận dạng.

## Vật liệu & phương pháp
- Chất nền: **CHCA** (α-cyano-4-hydroxycinnamic acid), **2,5-DHB**, **sinapinic acid (SA)**; nước, AcCN loại HPLC; FA, TFA; đĩa thép MS; máy khối phổ Kratos (Shimadzu).
- Các bước:
	1. Chuẩn bị mẫu MALDI và hỗn hợp peptide chuẩn ngoại; tối ưu năng lượng laser.
	2. Thu phổ mẫu, **cân bằng nội chuẩn** bằng peptide trypsin lợn $842{,}509$ và $2211{,}104\ [M+H]^+$.
	3. Lập danh sách khối lượng đỉnh (peak list).
	4. Tra cứu **Mascot**: Carbamidomethyl (C) cố định, Oxidation (M) biến đổi; sai số < 50 ppm (nội chuẩn) hoặc < 100 ppm (ngoại chuẩn). (→ [Bioinformatics](/blog/sinh-hoc/bioinformatics/))
	5. Tra thêm CSDL **decoy** để đánh giá kết quả nhận dạng.

## Kết quả chính
- **Thông số tra cứu Mascot**:

| Tham số | Giá trị | Ý nghĩa |
|---|---|---|
| Database | SwissProt | CSDL protein được tra |
| Taxonomy | All | Không giới hạn loài |
| Enzyme | Trypsin | Enzyme cắt protein |
| Missed cleavages | 1 | Số vị trí cắt bị bỏ sót cho phép (> 2–3 thì tốn tính toán) |
| Fixed modification | Carbamidomethyl (C) | Cải biến luôn có (do alkyl hoá IAA) |
| Variable modification | Oxidation (M) | Cải biến có thể có |
| Peptide tolerance | ± 1,2 Da | Sai số khối lượng peptide |
| Mass values | MH⁺ | MALDI tạo ion đơn điện tích |
| Number of queries | 10 | Số khối lượng peptide nhập |

- **10 khối lượng peptide** (m/z): 1064,9; 1074,8; 1111,9; 1325,1; 1341,1; 1412,1; 1427,1; 1852,4; 1900,4; 2385,4.
- **Protein score cao nhất: Keratin, type I cytoskeletal** – score **78** (> 70 là có ý nghĩa với $p < 0{,}05$).
	- MW **50995**, pI **5,43**, độ che phủ trình tự (sequence coverage) **20%**.
	- Keratin là họ protein thường gặp trong biểu mô động vật có vú.

## Kết luận & thảo luận
- Ngưỡng ý nghĩa: kết quả được xem là có ý nghĩa nếu xác suất trùng khớp ngẫu nhiên < 5%. (→ [Hypothesis testing](/blog/sinh-hoc/bioinformatics/a-statistics-and-biostatistics/ii-statistical-inference/05-hypothesis-testing-and-p-values/))
- Score cao (> 70) nhưng coverage thấp (< 50%) có thể do:
	- **Số peptide quan sát**: nhiều peptide khớp → score cao nhưng chỉ phủ một phần chuỗi.
	- **Độ chính xác khối lượng** cao → score cao dù ít peptide.
	- **Biến đổi sau dịch mã (PTM)** làm lệch khối lượng peptide → không khớp.
	- **Chất lượng phổ**: nhiễu, peptide không đặc hiệu.
	- **CSDL** chưa hoàn chỉnh/chính xác.
- Thực tế hầu như không thể khớp mọi khối lượng và phủ 100% trình tự.
- Keratin thường là **protein nhiễm (contaminant)** phổ biến trong proteomics (từ da, tóc) – các nghiên cứu thường loại keratin khỏi kết quả (xem [tiểu luận](/blog/sinh-hoc/biology-project-and-lab-report/proteomics-and-structural-biology/08-he-protein-exosome-ung-thu-gan-tieu-luan/)).
- Xem thêm: [Mô phỏng trong Virtual Lab](/projects/virtual-lab/08-thi-nghiem-giai-doan-3/) – MALDI-TOF và PMF trong protocol `pt-2dpage`, có tra lại với ± 1,2 Da như bài.

## Tài liệu gốc
*Nguyễn Thị Thu Hà - Thứ 2 tiết 6,7 - Bài 7.pdf*
