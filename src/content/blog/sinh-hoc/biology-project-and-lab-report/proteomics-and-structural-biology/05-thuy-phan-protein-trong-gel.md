---
title: 'Bài 5: Thuỷ phân protein trong gel điện di'
type: lab-report
tags:
  - biology
  - proteomics
  - lab-report
section: Sinh học
folder: Sinh học / Biology Project and Lab Report / Proteomics and Structural Biology
vaultPath: >-
  Resources/Sinh học/Biology Project and Lab Report/Proteomics and Structural
  Biology/05 - Thuỷ phân protein trong gel.md
url: /blog/thuy-phan-protein-trong-gel-dien-di/
topic: biology
updated: '2026-10-16'
order: 5
description: >-
  Báo cáo thực tập Proteomic và Sinh học cấu trúc – Nguyễn Thị Thu Hà, K66 Sinh
  học.
isIndex: false
---
> Báo cáo thực tập Proteomic và Sinh học cấu trúc – Nguyễn Thị Thu Hà, K66 Sinh học.

## Mục đích
- Nắm nguyên lý, quy trình và thao tác thu tập hợp **mảnh peptide** của từng protein đã tách trên gel điện di.
- Hiểu nguyên tắc **thủy phân protein trong gel bằng trypsin**.

## Nguyên lý
- Protein trong gel polyacrylamide đang gắn thuốc nhuộm **Coomassie** → phải **tẩy màu** và **phá cấu trúc không gian** để trypsin tiếp cận được.
	- **Khử (reduction)** bằng **DTT**: cắt cầu disulfide.
	- **Alkyl hoá** bằng **iodoacetamide (IAA)**: gắn nhóm carbamidomethyl lên cystein, ngăn cầu disulfide tái tạo. (→ [Exosome ung thư gan (tiểu luận)](/blog/seminar-nghien-cuu-xac-dinh-he-protein-exosome-trong-benh-nhan-ung-thu-gan-su-du/))
- **Trypsin** cắt sau **Lysine (K)** và **Arginine (R)** (phía đầu C), **không cắt** nếu K/R đứng trước **Proline (P)**. (→ [Định tính amino acid và protein](/blog/phan-tich-dinh-tinh-amino-acid-va-protein/))
	- Tạo các oligopeptide 6–20 acid amin – kích thước thích hợp cho khối phổ.
- **Ziptip C18**: cột ái lực pha đảo nhỏ để **loại muối** và cô peptide trước khi nhỏ lên đĩa MS.

## Vật liệu & phương pháp
- Gel điện di protein huyết tương (từ bài 1); Ziptip C18; tủ ấm, máy lắc.
- Dung dịch:

| Dung dịch | Thành phần | Vai trò |
|---|---|---|
| 1 | ABC 50 mM, AcCN 50% | Tẩy màu Coomassie |
| 2 | AcCN 100% | Làm khô, co gel |
| 3 | TFA 0,1% | Cân bằng / loại muối trên Ziptip |
| 4 | AcCN 70% trong TFA 0,1% | Hoạt hoá Ziptip, thôi peptide |
| 5 | ABC 25 mM | Rửa, đưa trypsin về pH hoạt động |
| DTT | DTT 5 mM trong ABC 25 mM | Khử |
| IAA | IAA 55 mM trong ABC 25 mM | Alkyl hoá |
| Trypsin | Trypsin trong ABC 25 mM | Thủy phân |

- Các bước:
	1. **Cắt spot/băng** protein cho vào ống eppendorf (nhiều băng → khay 96 giếng).
	2. **Tẩy màu**: rửa 50 µl nước 5 phút → 50 µl dung dịch 1, lắc 10 phút; lặp đến khi spot mất màu hoàn toàn.
	3. **Làm khô gel**: 50 µl AcCN 100% 5 phút, để khô tự nhiên 15 phút.
	4. **Khử**: 50 µl DTT, 15 phút nhiệt độ phòng → làm khô bằng AcCN 100%.
	5. **Alkyl hoá**: 20 µl IAA, 15 phút **trong tối**.
	6. **Rửa**: 50 µl ABC 25 mM.
	7. **Làm khô**: AcCN 100% 15 phút × 2 → gel trắng hoàn toàn, co lại (có thể dùng speed vac).
	8. **Thủy phân**: 10 µl trypsin, ủ trên đá/4 °C 15 phút (trương gel, enzyme chưa hoạt động) → thêm 30 µl ABC 25 mM, dán parafilm → ủ **37 °C qua đêm** (tối thiểu 60 phút).
	9. **Ziptip**: cân bằng bằng dung dịch 4 (×3) → dung dịch 3 (×3) → hấp phụ peptide (hút–đẩy 15 lần) → loại muối bằng dung dịch 3 (×7) → thôi peptide bằng 2 µl dung dịch 4 nhỏ lên đĩa MS (đã có chất nền matrix), lặp 3 lần.
	10. **Nhỏ protein chuẩn**: 1 µl chuẩn khối lượng lớn + 1 µl chuẩn khối lượng nhỏ (×3), thêm matrix → phân tích khối phổ.

## Kết quả chính
- Bản báo cáo chỉ trình bày nguyên lý và quy trình; không có số liệu kết quả (không rõ trong bản gốc).

## Kết luận & thảo luận
- In-gel digestion là cầu nối giữa điện di (2D-PAGE/SDS-PAGE) và khối phổ: spot → peptide → [MALDI-TOF MS/PMF](/blog/phan-tich-khoi-pho-maldi-tof-ms-va-nhan-dang-protein-pmf/) hoặc [LC-MS/MS](/blog/sac-ky-long-khoi-pho-lc-ms-ms-va-nhan-dang-protein/). (→ [Protease PQM nọc nhện](/blog/identification-of-a-precursor-processing-protease-from-the-spider-cupiennius-sal/))
- Do khử bằng DTT và alkyl hoá bằng IAA, khi tra cứu Mascot phải khai báo **Carbamidomethyl (C)** là cải biến cố định.
- Xem thêm: [Mô phỏng trong Virtual Lab](/projects/virtual-lab/thi-nghiem-giai-doan-3/) – bước thuỷ phân trypsin trong gel của protocol `pt-2dpage`.

## Tài liệu gốc
*Nguyễn Thị Thu Hà - Thứ 2 tiết 6,7 - Bài 5.pdf*
