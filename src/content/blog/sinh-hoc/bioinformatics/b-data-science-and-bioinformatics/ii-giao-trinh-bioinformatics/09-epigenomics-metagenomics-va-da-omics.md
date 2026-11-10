---
title: 'Phần 9 – Epigenomics, metagenomics và đa omics'
type: course-note
tags:
  - bioinformatics
  - data-science-and-bioinformatics
  - giao-trinh-bioinformatics
  - part-09
  - epigenomics
  - metagenomics
  - multi-omics
section: Sinh học
folder: >-
  Sinh học / Bioinformatics / B - Data Science and Bioinformatics / II - Giáo
  trình Bioinformatics
vaultPath: >-
  Resources/Sinh học/Bioinformatics/B - Data Science and Bioinformatics/II -
  Giáo trình Bioinformatics/09 - Epigenomics, metagenomics và đa omics.md
status: chưa học
order: 9
description: >-
  Ba lĩnh vực này dùng lại kỹ năng của Phần 6–7 nhưng thêm câu hỏi riêng: gen
  được điều hòa ra sao, quần xã vi sinh gồm ai, và các tầng dữ liệu kết hợp thế
  nào.
isIndex: false
---
Ba lĩnh vực này dùng lại kỹ năng của Phần 6–7 nhưng thêm câu hỏi riêng: gen được điều hòa ra sao, quần xã vi sinh gồm ai, và các tầng dữ liệu kết hợp thế nào.

**Mục tiêu:** nắm quy trình chuẩn của ChIP-seq/ATAC-seq, methyl hóa DNA, 16S và shotgun metagenomics, và các phương pháp tích hợp đa omics.

## 9.1 Epigenomics

| Kỹ thuật                       | Đo cái gì                                    | Quy trình phân tích                                                |
| ------------------------------ | -------------------------------------------- | ------------------------------------------------------------------ |
| ChIP-seq / CUT&RUN             | Vị trí gắn yếu tố phiên mã, biến đổi histone | Bowtie2 → MACS3 (gọi đỉnh) → HOMER (motif) → ChIPseeker (chú giải) |
| ATAC-seq                       | Vùng chromatin mở                            | Bowtie2 → lọc read ty thể → MACS3 → DiffBind                       |
| Bisulfite-seq (WGBS, RRBS)     | Methyl hóa CpG ở độ phân giải base           | Bismark → methylKit hoặc DSS                                       |
| Methylation array (450K, EPIC) | Methyl hóa tại các CpG định sẵn              | minfi, SeSAMe (R)                                                  |

Trực quan hóa: deepTools tạo file bigWig và heatmap tín hiệu quanh vị trí bắt đầu phiên mã (TSS).

## 9.2 Metagenomics

- **Amplicon 16S rRNA:** xác định thành phần vi khuẩn. Dùng QIIME 2 hoặc DADA2 để tạo ASV, gán phân loại theo SILVA.
- **Shotgun:** giải trình tự toàn bộ DNA, cho cả phân loại và chức năng. Phân loại bằng Kraken2/Bracken hoặc MetaPhlAn; chức năng bằng HUMAnN; ghép genome từ quần xã (MAG) bằng MEGAHIT + MetaBAT2.
- **Phân tích đa dạng:** alpha (Shannon, số loài trong một mẫu), beta (Bray–Curtis, UniFrac giữa các mẫu), PERMANOVA để kiểm định khác biệt.
- Lưu ý: dữ liệu là tỷ lệ tương đối (compositional), nên dùng phương pháp phù hợp như ANCOM-BC hoặc ALDEx2.

## 9.3 Tích hợp đa omics

- **Chiến lược:** tích hợp sớm (ghép ma trận), trung gian (tìm yếu tố chung), muộn (kết hợp kết quả từng tầng).
- **Công cụ:** MOFA+ (yếu tố ẩn chung), mixOmics (DIABLO), WGCNA (mạng đồng biểu hiện).
- **Ví dụ thực tế:** dùng TCGA để liên kết đột biến (DNA), biểu hiện (RNA) và protein (RPPA) với thời gian sống của bệnh nhân.
- **Phân tích sống còn:** đường cong Kaplan–Meier và mô hình Cox (gói survival, survminer trong R).

**Bài tập**

- [ ] Chạy bài ChIP-seq hoặc ATAC-seq của Galaxy Training, mở đỉnh trong IGV.
- [ ] Chạy hướng dẫn "Moving Pictures" của QIIME 2, so sánh đa dạng beta giữa các vị trí cơ thể.
- [ ] Tải dữ liệu một loại ung thư từ cBioPortal, vẽ Kaplan–Meier theo trạng thái đột biến TP53.

**Tài nguyên:** [QIIME 2 docs](https://docs.qiime2.org), [MOFA+](https://biofam.github.io/MOFA2/), [cBioPortal](https://www.cbioportal.org), [GDC Data Portal](https://portal.gdc.cancer.gov).

## Ghi chép khi học

-
