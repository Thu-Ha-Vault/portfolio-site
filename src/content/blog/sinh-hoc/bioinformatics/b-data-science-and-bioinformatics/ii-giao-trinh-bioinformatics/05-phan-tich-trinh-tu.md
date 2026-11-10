---
title: Phần 5 – Phân tích trình tự
type: course-note
tags:
  - bioinformatics
  - data-science-and-bioinformatics
  - giao-trinh-bioinformatics
  - part-05
  - sequence-alignment
  - phylogenetics
section: Sinh học
folder: >-
  Sinh học / Bioinformatics / B - Data Science and Bioinformatics / II - Giáo
  trình Bioinformatics
vaultPath: >-
  Resources/Sinh học/Bioinformatics/B - Data Science and Bioinformatics/II -
  Giáo trình Bioinformatics/05 - Phân tích trình tự.md
url: /blog/phan-tich-trinh-tu/
topic: biology
updated: '2026-10-19'
status: chưa học
order: 5
description: >-
  So sánh trình tự là phép toán gốc của bioinformatics: từ tìm gen tương đồng
  đến căn chỉnh hàng triệu read, mọi thứ đều dựa trên sắp gióng (alignment).
isIndex: false
---
So sánh trình tự là phép toán gốc của bioinformatics: từ tìm gen tương đồng đến căn chỉnh hàng triệu read, mọi thứ đều dựa trên sắp gióng (alignment).

**Mục tiêu:** hiểu và tự cài đặt thuật toán quy hoạch động cho sắp gióng, dùng BLAST đúng cách, sắp gióng đa trình tự và dựng cây phát sinh loài.

## 5.1 Sắp gióng hai trình tự

- **Toàn cục (Needleman–Wunsch):** căn chỉnh toàn bộ hai trình tự có độ dài tương đương.
- **Cục bộ (Smith–Waterman):** tìm đoạn giống nhau nhất bên trong hai trình tự, hợp với tìm miền protein.
- **Hệ thống tính điểm:** điểm khớp/không khớp cho DNA; ma trận thay thế BLOSUM62, PAM250 cho protein; phạt mở gap và kéo dài gap (affine gap).

Công thức truy hồi Needleman–Wunsch, với s là điểm thay thế và d là điểm phạt gap:

$$
F(i,j) = \max \begin{cases} F(i-1,j-1) + s(x_i, y_j) \\ F(i-1,j) - d \\ F(i,j-1) - d \end{cases}
$$

Smith–Waterman thêm lựa chọn 0 vào hàm max, nên điểm không bao giờ âm và đường truy ngược dừng khi gặp 0.

**Thực hành:** tự viết Needleman–Wunsch trong Python với ma trận điểm và truy ngược, sau đó so với `Bio.Align.PairwiseAligner`.

```python
from Bio import Align
aligner = Align.PairwiseAligner(mode="global", match_score=1, mismatch_score=-1, open_gap_score=-2, extend_gap_score=-0.5)
print(aligner.align("GATTACA", "GCATGCU")[0])
```

## 5.2 BLAST và tìm kiếm tương đồng

BLAST dùng heuristic "seed-and-extend": tìm các từ ngắn khớp nhau rồi mở rộng, nhanh hơn Smith–Waterman hàng trăm lần.

| Chương trình | Truy vấn                  | Cơ sở dữ liệu             |
| ------------ | ------------------------- | ------------------------- |
| blastn       | Nucleotide                | Nucleotide                |
| blastp       | Protein                   | Protein                   |
| blastx       | Nucleotide (dịch 6 khung) | Protein                   |
| tblastn      | Protein                   | Nucleotide (dịch 6 khung) |

Đọc kết quả: **E-value** là số kết quả ngẫu nhiên kỳ vọng với điểm bằng hoặc cao hơn; E < 1e-5 thường coi là có ý nghĩa. Xem thêm % identity, query coverage và bit score.

```bash
makeblastdb -in proteins.fa -dbtype prot -out mydb
blastp -query query.fa -db mydb -evalue 1e-5 -outfmt 6 -out hits.tsv
```

Công cụ nhanh hơn cho dữ liệu lớn: DIAMOND (protein), MMseqs2.

## 5.3 Sắp gióng đa trình tự (MSA)

- Công cụ: MAFFT, Clustal Omega, MUSCLE.
- Ứng dụng: tìm vùng bảo tồn, motif, chuẩn bị dựng cây.
- Xem kết quả bằng Jalview; tìm motif bằng MEME; tra miền protein bằng InterProScan hoặc Pfam.

## 5.4 Phát sinh loài (phylogenetics)

- Phương pháp khoảng cách: UPGMA, Neighbor-Joining.
- Dựa trên mô hình: Maximum Likelihood (IQ-TREE, RAxML), Bayesian (MrBayes).
- Đánh giá độ tin cậy nhánh bằng bootstrap; hiển thị cây bằng iTOL hoặc FigTree. (→ [The Bootstrap](/blog/the-bootstrap/))

```bash
mafft --auto seqs.fa > aligned.fa
iqtree2 -s aligned.fa -m MFP -B 1000
```

**Bài tập**

- [ ] Tự cài đặt Needleman–Wunsch và Smith–Waterman, kiểm tra với 3 cặp trình tự.
- [ ] BLAST protein TP53 người, tìm ortholog ở chuột, cá ngựa vằn và ruồi giấm.
- [ ] Sắp gióng TP53 của 8 loài bằng MAFFT, dựng cây ML bằng IQ-TREE và mô tả vùng bảo tồn.

**Tài nguyên:** sách "Bioinformatics Algorithms" (Compeau và Pevzner), [NCBI BLAST](https://blast.ncbi.nlm.nih.gov), [EMBL-EBI Job Dispatcher](https://www.ebi.ac.uk/jdispatcher/) cho MAFFT và Clustal Omega trực tuyến.

## Ghi chép khi học

-
