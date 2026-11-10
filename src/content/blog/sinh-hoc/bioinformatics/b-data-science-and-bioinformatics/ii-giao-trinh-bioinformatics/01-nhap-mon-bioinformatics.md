---
title: Phần 1 – Nhập môn Bioinformatics
type: course-note
tags:
  - bioinformatics
  - data-science-and-bioinformatics
  - giao-trinh-bioinformatics
  - part-01
  - omics
section: Sinh học
folder: >-
  Sinh học / Bioinformatics / B - Data Science and Bioinformatics / II - Giáo
  trình Bioinformatics
vaultPath: >-
  Resources/Sinh học/Bioinformatics/B - Data Science and Bioinformatics/II -
  Giáo trình Bioinformatics/01 - Nhập môn Bioinformatics.md
url: /blog/nhap-mon-bioinformatics/
topic: biology
updated: '2026-10-19'
status: chưa học
order: 1
description: >-
  Bioinformatics là ngành dùng máy tính, thống kê và thuật toán để lưu trữ, phân
  tích và diễn giải dữ liệu sinh học. Câu hỏi luôn là sinh học; máy tính chỉ là
  công cụ trả lời.
isIndex: false
---
Bioinformatics là ngành dùng máy tính, thống kê và thuật toán để lưu trữ, phân tích và diễn giải dữ liệu sinh học. Câu hỏi luôn là sinh học; máy tính chỉ là công cụ trả lời.

**Mục tiêu:** phân biệt các lĩnh vực con, hiểu dòng dữ liệu từ mẫu sinh học đến kết luận, và biết mỗi loại dữ liệu "omics" đo gì.

## 1.1 Bioinformatics và Computational Biology

- **Bioinformatics:** thiên về xây dựng và dùng công cụ, cơ sở dữ liệu, quy trình xử lý dữ liệu.
- **Computational Biology:** thiên về mô hình hóa và trả lời câu hỏi sinh học bằng phương pháp tính toán.
- Trên thực tế hai thuật ngữ thường dùng thay cho nhau.

## 1.2 Học thuyết trung tâm và các tầng omics

Mỗi bước trong dòng thông tin DNA → RNA → protein → chất chuyển hóa tương ứng với một loại dữ liệu "omics" (→ [Nhân đôi DNA, phiên mã, dịch mã](/blog/nhan-doi-dna-phien-ma-va-dich-ma/)):

| Tầng            | Đo cái gì                     | Công nghệ chính                   | Định dạng điển hình |
| --------------- | ----------------------------- | --------------------------------- | ------------------- |
| Genomics        | Trình tự DNA, biến thể        | WGS, WES, long-read               | FASTQ, BAM, VCF     |
| Epigenomics     | Methyl hóa, chromatin         | Bisulfite-seq, ChIP-seq, ATAC-seq | BED, bigWig         |
| Transcriptomics | Mức biểu hiện RNA             | RNA-seq, scRNA-seq                | FASTQ, ma trận đếm  |
| Proteomics      | Protein, biến đổi sau dịch mã | Khối phổ (LC-MS/MS)               | mzML, bảng cường độ |
| Metabolomics    | Chất chuyển hóa               | LC-MS, NMR                        | mzML, bảng đỉnh     |
| Metagenomics    | Quần xã vi sinh vật           | 16S rRNA, shotgun                 | FASTQ, bảng OTU/ASV |

## 1.3 Quy trình chung của một dự án

1. Đặt câu hỏi sinh học rõ ràng (ví dụ: gen nào biểu hiện khác nhau giữa mô ung thư và mô lành?).
2. Thiết kế thí nghiệm: số mẫu lặp, nhóm đối chứng, tránh hiệu ứng lô (batch effect).
3. Thu dữ liệu thô từ máy giải trình tự hoặc cơ sở dữ liệu công khai.
4. Kiểm soát chất lượng (QC) và tiền xử lý.
5. Phân tích chính: căn chỉnh, định lượng, kiểm định thống kê.
6. Diễn giải sinh học: chú giải chức năng, pathway.
7. Kiểm chứng: thực nghiệm (qPCR, Western blot) hoặc dữ liệu độc lập.

## 1.4 Các vị trí nghề nghiệp

Bioinformatician (xây pipeline), Computational biologist (nghiên cứu), Data scientist trong pharma/biotech, Clinical bioinformatician (chẩn đoán di truyền), và gần đây là chuyên gia đánh giá mô hình AI cho sinh học.

**Bài tập**

- [ ] Đọc một bài tổng quan về bioinformatics trên PubMed, tóm tắt 5 ý chính.
- [ ] Với mỗi tầng omics trong bảng, tìm một bài báo dùng loại dữ liệu đó và ghi lại câu hỏi sinh học của bài.

**Tài nguyên:** [NCBI Bookshelf](https://www.ncbi.nlm.nih.gov/books/), khóa "Bioinformatics Specialization" của UC San Diego trên Coursera, [EMBL-EBI Training](https://www.ebi.ac.uk/training/) (miễn phí).

## Ghi chép khi học

-
