---
title: Phụ lục giáo trình Bioinformatics
type: course-note
tags:
  - bioinformatics
  - data-science-and-bioinformatics
  - giao-trinh-bioinformatics
  - glossary
section: Sinh học
folder: >-
  Sinh học / Bioinformatics / B - Data Science and Bioinformatics / II - Giáo
  trình Bioinformatics
vaultPath: >-
  Resources/Sinh học/Bioinformatics/B - Data Science and Bioinformatics/II -
  Giáo trình Bioinformatics/13 - Phụ lục.md
url: /blog/phu-luc-giao-trinh-bioinformatics/
topic: biology
updated: '2026-10-19'
order: 13
description: Khóa học miễn phí hoặc có thể học dự thính
isIndex: false
---
## A. Lịch học một tuần mẫu (8–10 giờ)

| Buổi     | Thời lượng | Nội dung                                     |
| -------- | ---------- | -------------------------------------------- |
| Thứ Hai  | 1,5 giờ    | Đọc lý thuyết của phần đang học, ghi chép    |
| Thứ Ba   | 1,5 giờ    | Gõ lại ví dụ code và lệnh trong giáo trình   |
| Thứ Năm  | 2 giờ      | Làm bài tập, ghi lỗi gặp phải và cách sửa    |
| Thứ Bảy  | 2–3 giờ    | Mini-project hoặc dự án portfolio            |
| Chủ Nhật | 1 giờ      | Ôn tập, commit lên GitHub, viết tóm tắt tuần |

## B. Tài nguyên học theo loại

**Khóa học miễn phí hoặc có thể học dự thính**

- [Rosalind](https://rosalind.info): bài tập lập trình bioinformatics theo cấp độ.
- [Galaxy Training Network](https://training.galaxyproject.org): hàng trăm hướng dẫn có dữ liệu mẫu, không cần cài đặt.
- [EMBL-EBI Training](https://www.ebi.ac.uk/training/): khóa trực tuyến về cơ sở dữ liệu và phân tích.
- [Data Carpentry](https://datacarpentry.org): Shell, R, Python, genomics cho người mới.
- Coursera: "Bioinformatics Specialization" (UC San Diego), "Genomic Data Science" (Johns Hopkins).

**Sách**

- "Bioinformatics Data Skills" (Vince Buffalo): kỹ năng dòng lệnh và dữ liệu. (→ [Thư viện tài liệu – có bản PDF](/blog/thu-vien-tai-lieu-sinh-hoc-google-drive/#6-tin-sinh-học-và-thống-kê))
- "Bioinformatics Algorithms" (Compeau và Pevzner): thuật toán.
- "Modern Statistics for Modern Biology" (Holmes và Huber): thống kê, miễn phí trực tuyến.
- "Deep Learning for the Life Sciences" (Ramsundar và cộng sự): AI trong sinh học.

**Cộng đồng hỏi đáp:** Biostars, Bioconductor Support, Stack Overflow, r/bioinformatics.

## C. Thuật ngữ Anh – Việt

| Thuật ngữ               | Tiếng Việt                        | Giải thích ngắn                                                    |
| ----------------------- | --------------------------------- | ------------------------------------------------------------------ |
| Alignment               | Sắp gióng, căn chỉnh              | Xếp hai hay nhiều trình tự để so sánh                              |
| Read                    | Đoạn đọc                          | Một đoạn trình tự do máy giải trình tự tạo ra                      |
| Coverage / Depth        | Độ phủ / độ sâu                   | Số read trung bình phủ một vị trí                                  |
| Reference genome        | Genome tham chiếu                 | Genome chuẩn để căn chỉnh read                                     |
| Variant calling         | Gọi biến thể                      | Xác định vị trí khác với genome tham chiếu                         |
| SNP / Indel             | Đa hình đơn nucleotide / chèn-mất | Hai loại biến thể nhỏ phổ biến                                     |
| Differential expression | Biểu hiện khác biệt               | Gen thay đổi mức biểu hiện giữa các điều kiện                      |
| Fold change             | Mức thay đổi (lần)                | Tỷ lệ biểu hiện giữa hai nhóm                                      |
| False discovery rate    | Tỷ lệ phát hiện sai               | Tỷ lệ dương tính giả kỳ vọng trong các kết quả                     |
| Batch effect            | Hiệu ứng lô                       | Khác biệt kỹ thuật do xử lý mẫu theo đợt                           |
| Enrichment analysis     | Phân tích làm giàu                | Kiểm tra nhóm chức năng nào xuất hiện nhiều bất thường             |
| Peak calling            | Gọi đỉnh                          | Tìm vùng genome có tín hiệu cao (ChIP-seq, ATAC-seq)               |
| Assembly                | Lắp ráp                           | Ghép read thành trình tự dài hơn                                   |
| Ortholog                | Gen trực giao                     | Gen tương đồng ở các loài khác nhau, cùng tổ tiên                  |
| Pipeline / Workflow     | Quy trình xử lý                   | Chuỗi bước phân tích tự động                                       |
| Overfitting             | Quá khớp                          | Mô hình học thuộc dữ liệu huấn luyện, dự đoán kém trên dữ liệu mới |
