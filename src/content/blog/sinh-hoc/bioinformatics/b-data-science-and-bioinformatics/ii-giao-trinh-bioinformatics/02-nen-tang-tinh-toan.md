---
title: Phần 2 – Nền tảng tính toán
type: course-note
tags:
  - bioinformatics
  - data-science-and-bioinformatics
  - giao-trinh-bioinformatics
  - part-02
  - linux
  - python
  - r
  - git
section: Sinh học
folder: >-
  Sinh học / Bioinformatics / B - Data Science and Bioinformatics / II - Giáo
  trình Bioinformatics
vaultPath: >-
  Resources/Sinh học/Bioinformatics/B - Data Science and Bioinformatics/II -
  Giáo trình Bioinformatics/02 - Nền tảng tính toán.md
url: /blog/nen-tang-tinh-toan/
topic: biology
updated: '2026-10-19'
status: chưa học
order: 2
description: >-
  Hầu hết công cụ bioinformatics chạy trên dòng lệnh Linux, và phân tích hạ
  nguồn viết bằng Python hoặc R. Đây là phần tốn thời gian nhất nhưng quyết định
  tốc độ của mọi phần sau.
isIndex: false
---
Hầu hết công cụ bioinformatics chạy trên dòng lệnh Linux, và phân tích hạ nguồn viết bằng Python hoặc R. Đây là phần tốn thời gian nhất nhưng quyết định tốc độ của mọi phần sau.

**Mục tiêu:** điều hướng và xử lý file trên Linux, viết script Python/R đọc và tóm tắt dữ liệu, quản lý môi trường bằng conda và mã nguồn bằng Git.

## 2.1 Linux và Bash (Tuần 2–3)

Các lệnh cần thuộc lòng:

| Nhóm       | Lệnh                 | Ví dụ                                     |
| ---------- | -------------------- | ----------------------------------------- |
| Điều hướng | pwd, ls, cd, mkdir   | `mkdir -p project/{data,results,scripts}` |
| Xem file   | head, tail, less, wc | `wc -l reads.fastq`                       |
| Tìm kiếm   | grep, find           | `grep -c ">" genome.fa` (đếm số trình tự) |
| Xử lý cột  | cut, sort, uniq, awk | `cut -f1 genes.tsv \| sort \| uniq -c`    |
| Nén        | gzip, zcat, tar      | `zcat reads.fastq.gz \| head -8`          |
| Từ xa      | ssh, scp, wget       | `wget <URL>` để tải dữ liệu               |

Thực hành nhanh: đếm số read trong một file FASTQ (mỗi read chiếm 4 dòng).

```bash
echo $(( $(zcat sample.fastq.gz | wc -l) / 4 ))
```

Viết script Bash đầu tiên: tạo file `count_reads.sh`, dùng vòng lặp `for f in *.fastq.gz; do ... done` để đếm read cho mọi file trong thư mục.

## 2.2 Python (Tuần 4–5)

- Cú pháp cơ bản: biến, list, dict, vòng lặp, hàm, đọc/ghi file.
- Thư viện chính: **pandas** (bảng dữ liệu), **NumPy** (tính toán số), **matplotlib/seaborn** (vẽ đồ thị), **Biopython** (đọc FASTA, GenBank, truy vấn NCBI).

```python
from Bio import SeqIO

for record in SeqIO.parse("genes.fasta", "fasta"):
    seq = record.seq
    gc = 100 * (seq.count("G") + seq.count("C")) / len(seq)
    print(record.id, len(seq), f"{gc:.1f}%")
```

## 2.3 R và Bioconductor (Tuần 6)

R mạnh về thống kê và có hệ sinh thái **Bioconductor** với hơn 2.000 gói cho dữ liệu omics.

- Nền tảng: vector, data.frame, factor, hàm `apply`.
- **tidyverse:** dplyr (lọc, nhóm, tóm tắt), ggplot2 (vẽ đồ thị). (→ [Introduction to tidyverse](/blog/introduction-to-tidyverse/), [Visualizations (R)](/blog/visualizations/))
- Bioconductor: DESeq2, edgeR, limma, clusterProfiler, GenomicRanges.

```r
library(ggplot2)
df <- read.delim("expression.tsv")
ggplot(df, aes(x = condition, y = TP53, fill = condition)) +
  geom_boxplot() + theme_minimal()
```

## 2.4 Conda và Git (Tuần 7)

Conda tạo môi trường riêng cho từng dự án, tránh xung đột phiên bản. Kênh **bioconda** chứa hầu hết công cụ bioinformatics.

```bash
conda create -n ngs -c bioconda -c conda-forge fastqc multiqc bwa samtools
conda activate ngs
```

Git lưu lịch sử thay đổi code. Quy trình tối thiểu: `git init` → `git add` → `git commit -m "..."` → `git push` lên GitHub.

**Bài tập**

- [ ] Hoàn thành chương "Bioinformatics Stronghold" 10 bài đầu trên Rosalind bằng Python.
- [ ] Viết script Bash đếm read và độ dài trung bình cho mọi file FASTQ trong thư mục.
- [ ] Vẽ boxplot biểu hiện một gen theo nhóm bằng ggplot2.
- [ ] Tạo repo GitHub cho giáo trình này và commit bài tập hằng tuần.

**Tài nguyên:** [Rosalind](https://rosalind.info), [The Carpentries – Shell & Genomics](https://datacarpentry.org/lessons/), sách miễn phí "R for Data Science" ([r4ds.hadley.nz](https://r4ds.hadley.nz)), [Biopython Tutorial](https://biopython.org/docs/latest/Tutorial/).

## Ghi chép khi học

-
