---
title: Phần 3 – Toán và thống kê cho sinh học
type: course-note
tags:
  - bioinformatics
  - data-science-and-bioinformatics
  - giao-trinh-bioinformatics
  - part-03
  - statistics
  - multiple-testing
section: Sinh học
folder: >-
  Sinh học / Bioinformatics / B - Data Science and Bioinformatics / II - Giáo
  trình Bioinformatics
vaultPath: >-
  Resources/Sinh học/Bioinformatics/B - Data Science and Bioinformatics/II -
  Giáo trình Bioinformatics/03 - Toán và thống kê cho sinh học.md
url: /blog/toan-va-thong-ke-cho-sinh-hoc/
topic: biology
updated: '2026-10-19'
status: chưa học
order: 3
description: >-
  Phần lớn lỗi diễn giải trong bioinformatics đến từ thống kê, không phải từ
  code. Vì dữ liệu omics đo hàng chục nghìn biến cùng lúc, bạn cần nắm chắc kiểm
  định nhiều lần và chuẩn hóa.
isIndex: false
---
Phần lớn lỗi diễn giải trong bioinformatics đến từ thống kê, không phải từ code. Vì dữ liệu omics đo hàng chục nghìn biến cùng lúc, bạn cần nắm chắc kiểm định nhiều lần và chuẩn hóa.

**Mục tiêu:** chọn đúng kiểm định, hiểu p-value và FDR, biết vì sao dữ liệu đếm cần mô hình riêng, và giảm chiều dữ liệu bằng PCA.

## 3.1 Xác suất và phân phối

| Phân phối                       | Mô tả                                           | Gặp ở đâu                                    |
| ------------------------------- | ----------------------------------------------- | -------------------------------------------- |
| Chuẩn (Normal)                  | Hình chuông, liên tục                           | Cường độ protein sau log, dữ liệu microarray |
| Nhị thức (Binomial)             | Số lần thành công trong n lần thử               | Tỷ lệ allele tại một vị trí biến thể         |
| Poisson                         | Số sự kiện hiếm, phương sai = trung bình        | Số read lý tưởng trên một gen                |
| Nhị thức âm (Negative binomial) | Như Poisson nhưng phương sai lớn hơn trung bình | Số read RNA-seq thực tế (DESeq2, edgeR)      |
| Siêu bội (Hypergeometric)       | Rút không hoàn lại                              | Phân tích làm giàu GO/pathway                |

## 3.2 Kiểm định giả thuyết

- t-test (2 nhóm, phân phối chuẩn), Wilcoxon/Mann–Whitney (phi tham số), ANOVA (≥ 3 nhóm), Chi-square và Fisher exact (dữ liệu phân loại).
- p-value là xác suất thấy kết quả ít nhất cực đoan như vậy nếu giả thuyết không (H0) đúng. Nó không phải xác suất H0 đúng.
- Luôn báo cáo cả độ lớn hiệu ứng (fold change, hệ số), không chỉ p-value.

## 3.3 Kiểm định nhiều lần (multiple testing)

Kiểm định 20.000 gen với ngưỡng 0,05 sẽ cho khoảng 1.000 kết quả dương tính giả dù không có gen nào thực sự khác biệt. Hai cách hiệu chỉnh (→ Hypothesis Testing and p-values):

- **Bonferroni:** nhân p-value với số kiểm định. Rất nghiêm ngặt.
- **Benjamini–Hochberg (FDR):** kiểm soát tỷ lệ phát hiện sai trong các kết quả dương tính. Là chuẩn trong omics, báo cáo dưới tên "adjusted p-value" hoặc "q-value".

Thủ tục BH: sắp p-value tăng dần, gọi thứ hạng là i trên tổng m kiểm định; giữ lại mọi kiểm định đến thứ hạng lớn nhất thỏa:

$$
p_{(i)} \le \frac{i}{m} \, \alpha
$$

## 3.4 Chuẩn hóa và biến đổi

- Log-fold change: log2 FC = 1 nghĩa là gấp đôi, −1 là giảm một nửa.
- Chuẩn hóa độ sâu giải trình tự: CPM, TPM, size factor của DESeq2. Không so sánh số đếm thô giữa các mẫu.
- Biến đổi log hoặc VST trước khi vẽ heatmap hay chạy PCA.

## 3.5 Giảm chiều và phân cụm

- **PCA:** tìm hướng có phương sai lớn nhất; dùng để kiểm tra mẫu có nhóm theo điều kiện hay theo lô.
- **t-SNE, UMAP:** giảm chiều phi tuyến, phổ biến trong single-cell.
- **Phân cụm:** hierarchical (heatmap), k-means, Leiden/Louvain (đồ thị).

## 3.6 Hồi quy

Hồi quy tuyến tính, logistic và mô hình tuyến tính tổng quát (GLM) (→ Linear and Logistic Regression). DESeq2 thực chất là một GLM nhị thức âm, nên thiết kế `~ batch + condition` chính là thêm biến lô vào mô hình.

**Bài tập**

- [ ] Mô phỏng 10.000 kiểm định không có khác biệt thật trong Python, đếm số p < 0,05 trước và sau hiệu chỉnh BH (`statsmodels.stats.multitest.multipletests`).
- [ ] Chạy PCA trên bộ dữ liệu iris hoặc một ma trận biểu hiện công khai, vẽ PC1 và PC2.

**Tài nguyên:** sách miễn phí "Modern Statistics for Modern Biology" (Holmes và Huber), kênh YouTube StatQuest (Josh Starmer), khóa "Data Analysis for the Life Sciences" của Rafael Irizarry.

## Ghi chép khi học

-
