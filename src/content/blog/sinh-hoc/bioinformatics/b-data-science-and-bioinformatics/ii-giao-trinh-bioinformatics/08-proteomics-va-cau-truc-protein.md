---
title: Phần 8 – Proteomics và cấu trúc protein
type: course-note
tags:
  - bioinformatics
  - data-science-and-bioinformatics
  - giao-trinh-bioinformatics
  - part-08
  - proteomics
  - structural-biology
section: Sinh học
folder: >-
  Sinh học / Bioinformatics / B - Data Science and Bioinformatics / II - Giáo
  trình Bioinformatics
vaultPath: >-
  Resources/Sinh học/Bioinformatics/B - Data Science and Bioinformatics/II -
  Giáo trình Bioinformatics/08 - Proteomics và cấu trúc protein.md
url: /blog/proteomics-va-cau-truc-protein/
topic: biology
updated: '2026-10-19'
status: chưa học
order: 8
description: >-
  Protein mới là phân tử thực hiện chức năng, nên proteomics và sinh học cấu
  trúc bổ sung những gì RNA-seq không thấy: mức protein thật, biến đổi sau dịch
  mã và hình dạng 3D.
isIndex: false
---
Protein mới là phân tử thực hiện chức năng, nên proteomics và sinh học cấu trúc bổ sung những gì RNA-seq không thấy: mức protein thật, biến đổi sau dịch mã và hình dạng 3D.

**Mục tiêu:** hiểu quy trình proteomics khối phổ, phân tích bảng cường độ protein, dự đoán và đánh giá cấu trúc protein, chạy docking cơ bản.

## 8.1 Proteomics khối phổ (MS-based)

Quy trình bottom-up: protein → cắt bằng trypsin thành peptide → sắc ký lỏng (LC) → khối phổ song song (MS/MS) → so phổ với cơ sở dữ liệu → định lượng protein. (→ [LC-MS/MS](/blog/sac-ky-long-khoi-pho-lc-ms-ms-va-nhan-dang-protein/), [MALDI-TOF MS và PMF](/blog/phan-tich-khoi-pho-maldi-tof-ms-va-nhan-dang-protein-pmf/))

- **Chế độ thu nhận:** DDA (chọn peptide mạnh nhất) và DIA (phân mảnh mọi peptide theo cửa sổ, tái lập tốt hơn).
- **Định lượng:** label-free (LFQ), đánh dấu đồng vị (TMT, SILAC).
- **Phần mềm:** MaxQuant, FragPipe (MSFragger), DIA-NN; phân tích thống kê bằng Perseus, MSstats hoặc limma.
- **Kiểm soát sai:** chiến lược target-decoy, FDR 1% ở cấp peptide và protein.
- **Dữ liệu công khai:** PRIDE (ProteomeXchange).

Điểm khác với RNA-seq: dữ liệu proteomics có nhiều giá trị thiếu (missing values) không ngẫu nhiên, do protein ít phổ biến dưới ngưỡng phát hiện. Cần lọc và xử lý (imputation) cẩn thận.

```r
library(limma)
log_int <- log2(intensity_matrix)                     # bảng LFQ đã lọc
design <- model.matrix(~ 0 + group)
fit <- lmFit(log_int, design)
fit2 <- eBayes(contrasts.fit(fit, makeContrasts(groupTumor - groupNormal, levels = design)))
topTable(fit2, adjust.method = "BH", number = 20)
```

## 8.2 Cấu trúc protein

- **Các bậc cấu trúc:** bậc 1 (trình tự), bậc 2 (xoắn α, phiến β), bậc 3 (gấp 3D), bậc 4 (phức hợp nhiều chuỗi).
- **Thực nghiệm:** tinh thể học tia X, cryo-EM, NMR; dữ liệu lưu ở PDB.
- **Dự đoán bằng AI:** AlphaFold (AlphaFold DB có hơn 200 triệu cấu trúc dự đoán), ColabFold (chạy AlphaFold miễn phí trên Colab), ESMFold, RoseTTAFold.
- **Đọc độ tin cậy:** pLDDT trên 90 là rất tin cậy, dưới 50 thường là vùng mất trật tự; PAE cho biết vị trí tương đối giữa các miền đáng tin đến đâu.
- **Trực quan hóa:** PyMOL, UCSF ChimeraX, Mol\* (web).

## 8.3 Docking và mô phỏng

- **Docking phân tử:** AutoDock Vina dự đoán tư thế gắn và ái lực của phân tử nhỏ vào túi protein; chuẩn bị file bằng Open Babel hoặc Meeko.
- **Động lực học phân tử (MD):** GROMACS, OpenMM mô phỏng chuyển động của protein theo thời gian.
- **Thiết kế protein:** RFdiffusion, ProteinMPNN (mức nâng cao).

**Bài tập**

- [ ] Tải một bộ proteomics từ PRIDE đã có bảng proteinGroups, chạy kiểm định limma và vẽ volcano plot.
- [ ] Dự đoán cấu trúc một protein bạn quan tâm bằng ColabFold, tô màu theo pLDDT trong ChimeraX.
- [ ] Docking một thuốc đã biết vào đích của nó (ví dụ imatinib và kinase ABL1), so tư thế dự đoán với cấu trúc PDB thực nghiệm.

**Tài nguyên:** [PRIDE](https://www.ebi.ac.uk/pride/), [AlphaFold DB](https://alphafold.ebi.ac.uk), [ColabFold](https://github.com/sokrypton/ColabFold), bài proteomics trên [Galaxy Training](https://training.galaxyproject.org).

## Ghi chép khi học

-
