---
title: 'Bài 2: Điện di hai chiều (2D-PAGE)'
type: lab-report
tags:
  - biology
  - proteomics
  - lab-report
section: Sinh học
folder: Sinh học / Biology Project and Lab Report / Proteomics and Structural Biology
vaultPath: >-
  Resources/Sinh học/Biology Project and Lab Report/Proteomics and Structural
  Biology/02 - Điện di hai chiều (2D-PAGE).md
url: /blog/dien-di-hai-chieu-2d-page/
topic: biology
updated: '2026-10-16'
order: 2
description: >-
  Báo cáo thực tập Proteomic và Sinh học cấu trúc – Nguyễn Thị Thu Hà, K66 Sinh
  học, Nhóm 1.
isIndex: false
---
> Báo cáo thực tập Proteomic và Sinh học cấu trúc – Nguyễn Thị Thu Hà, K66 Sinh học, Nhóm 1.

## Mục đích
- Hiểu nguyên lý và ứng dụng của **điện di hai chiều (2D-PAGE)** trong phân tách các chuỗi polypeptide và protein.
- Thực hiện được các thao tác cơ bản: trương gel IPG, điện di đẳng điện, cân bằng gel, SDS-PAGE, nhuộm gel.

## Nguyên lý
- **2D-PAGE**: phân tách protein theo 2 đặc tính độc lập → cho phép tách đồng thời hàng ngàn protein. (→ [Thực hành Sinh học phân tử](/blog/bao-cao-tong-ket-thuc-hanh-sinh-hoc-phan-tu-phan-tich-ket-qua/))
	- **Chiều 1 – Tập trung đẳng điện (IEF, isoelectric focusing)**: tách theo **điểm đẳng điện (pI)**.
	- **Chiều 2 – SDS-PAGE**: điện di biến tính, tách theo **khối lượng phân tử**.
- **Điểm đẳng điện (pI)**: pH tại đó tổng điện tích của protein bằng 0. (→ [Tính chất của protein](/blog/xac-dinh-mot-so-tinh-chat-cua-protein/))
	- pH < pI → protein tích điện dương, chạy về cực âm; pH > pI → tích điện âm, chạy về cực dương.
	- Càng gần pI protein càng chậm lại; tại pI protein dừng lại → protein "tập trung" theo pI.
- Gradient pH tạo bởi **ampholyte** (acid polyamino-polycarboxylic) xếp theo pI tăng dần từ cực dương đến cực âm; trong bài dùng thanh gel có **gradient pH cố định (IPG, immobilized pH gradient)**.
	- Gel polyacrylamide ~4% vì lỗ lớn, protein di chuyển dễ.
- **SDS + chất khử** bao protein bằng điện tích âm tỷ lệ với chiều dài chuỗi → protein luôn chạy từ cực âm sang cực dương, tách theo kích thước. (→ [L-methioninase](/blog/phan-tach-va-xac-dinh-dac-tinh-l-methioninase-tu-trichoderma-harzianum/), [Protease PQM nọc nhện](/blog/identification-of-a-precursor-processing-protease-from-the-spider-cupiennius-sal/))
- Ứng dụng: so sánh biểu hiện protein giữa các cặp mẫu (mô thường – mô bệnh, giai đoạn phát triển, giai đoạn bệnh, stress...).

## Vật liệu & phương pháp
- **Mẫu**: huyết tương đã xử lý từ bài 1, kết tủa bằng aceton (mẫu : aceton = 1:3), định lượng protein bằng **Bradford**.
- **Hoá chất chính**: (→ [Bảng tra cứu công cụ tin sinh](/blog/programming-bang-tra-cuu-lenh-r-sql-cong-cu-tin-sinh-va-hoa-chat/))
	- Đệm mẫu/trương gel: urea 7 M, thiourea 2 M, CHAPS 4%, DTT 65 mM, Bio-Lyte 3/10 0,2%, Bromophenol Blue.
	- Đệm cân bằng I: urea 6 M, SDS 2%, Tris-HCl 0,375 M pH 8,8, glycerol 20%, **DTT** 2% (khử cầu disulfide).
	- Đệm cân bằng II: như đệm I nhưng thay DTT bằng **iodoacetamide** (alkyl hoá cystein).
	- Thanh IPG 7 cm; gel SDS-PAGE đúc sẵn 10%; đệm TGS; agarose 0,5% để gắn thanh IPG lên gel.
- **Quy trình**:
	1. **Trương gel (rehydration)**: 125 µl mẫu (~170 µg protein) nhỏ vào rãnh khay, đặt thanh IPG úp lên, phủ 2–3 ml dầu khoáng, để qua đêm 11–16 giờ.
	2. **IEF**: đặt giấy điện cực làm ướt 8 µl nước, chuyển thanh IPG sang khay IEF, phủ dầu khoáng; chạy chương trình 3 bước, 20 °C, ≤ 50 µA/thanh (thiết bị Protean IEF cell, Bio-Rad). Thanh gel có thể bảo quản −70 °C.
	3. **Cân bằng thanh IPG**: 10 phút trong đệm cân bằng I (DTT) → 10 phút trong đệm cân bằng II (+0,5 g iodoacetamide).
	4. **SDS-PAGE**: đặt thanh IPG lên giếng gel SDS-PAGE, cố định bằng agarose, chạy như bài 1.
	5. **Nhuộm CBB R-250**: cố định bằng TCA 20% (30–60 phút) → nhuộm Coomassie 1–4 giờ/qua đêm → tẩy bằng dung dịch tẩy I (methanol 40%, acid acetic 7%) rồi tẩy II (methanol 5%, acid acetic 7%) → chụp ảnh. (→ [Tinh sạch protease nọc nhện](/blog/tinh-sach-enzyme/))
- Lưu ý thao tác: tránh bọt khí dưới thanh gel; không để đệm có urea trên đá (urea kết tinh, không làm ấm quá 30 °C); loại sạch dầu khoáng để giảm kéo vệt.

## Kết quả chính
- Phân tích ảnh gel 2D-PAGE **huyết tương người nhuộm bạc** (hình mẫu trong bản gốc) và nhận diện 29 điểm protein:

| STT | Ký hiệu | Protein |
|---|---|---|
| 1 | A1AT | Alpha-1-antitrypsin precursor |
| 2 | A1BG | Alpha-1b-glycoprotein |
| 3 | A2MG | Alpha-2-macroglobulin precursor |
| 4 | AACT | Alpha-1-antichymotrypsin precursor |
| 5 | AFAM | Afamin precursor (alpha-albumin) |
| 6 | ALBU | Serum albumin precursor |
| 7 | ALC1 | Ig alpha-1 chain C region |
| 8 | APA1 | Apolipoprotein A-I precursor |
| 9 | APA4 | Apolipoprotein A-IV precursor |
| 10 | APOH | Beta-2-glycoprotein I precursor |
| 11 | CERU | Ceruloplasmin precursor |
| 12 | CFAB | Complement factor B |
| 13 | CFAH | Complement factor H precursor |
| 14 | CFAI | Complement factor I precursor |
| 15 | CLUS | Clusterin (apolipoprotein J) |
| 16 | CO3 | Complement C3 precursor |
| 17 | CO4 | Complement C4 precursor |
| 18 | CO6 | Complement component C6 precursor |
| 19 | CO7 | Complement component C7 precursor |
| 20 | FIBB | Fibrinogen beta chain precursor |
| 21 | GC1 | Ig gamma-1 chain C region |
| 22 | HBB | Hemoglobin beta chain |
| 23 | HEMO | Hemopexin precursor |
| 24 | HPT1 | Haptoglobin-1 precursor |
| 25 | HPT2 | Haptoglobin-2 precursor |
| 26 | KAC | Immunoglobulin kappa light chain |
| 27 | PLMN | Plasminogen precursor |
| 28 | RETB | Plasma retinol-binding protein precursor |
| 29 | TRFE | Serotransferrin precursor |

## Kết luận & thảo luận
- 2D-PAGE tách được bản đồ protein huyết tương với nhiều nhóm chức năng: protein vận chuyển (albumin, transferrin, apolipoprotein), ức chế protease (A1AT, A2MG, AACT), **hệ bổ thể** (C3, C4, C6, C7, factor B/H/I), đông máu (fibrinogen, plasminogen), immunoglobulin. (→ [Exosome ung thư gan (tiểu luận)](/blog/seminar-nghien-cuu-xac-dinh-he-protein-exosome-trong-benh-nhan-ung-thu-gan-su-du/))
- Ảnh gel 2D là đầu vào cho phân tích bằng phần mềm ([bài 4](/blog/phan-tich-hinh-anh-ban-gel-dien-di-hai-chieu-su-dung-phan-mem-phoretix/)) và cắt spot để thủy phân, khối phổ ([bài 5](/blog/thuy-phan-protein-trong-gel-dien-di/)).
- Xem thêm: [Mô phỏng trong Virtual Lab](/projects/virtual-lab/thi-nghiem-giai-doan-3/) – protocol `pt-2dpage`: 2D-PAGE huyết tương từ trình tự UniProt.

## Tài liệu gốc
*Nguyễn Thị Thu Hà - Thứ 2 tiết 6,7 - Bài 2.pdf*
