---
title: Phần 10 – Machine learning và AI trong sinh học
type: course-note
tags:
  - bioinformatics
  - data-science-and-bioinformatics
  - giao-trinh-bioinformatics
  - part-10
  - machine-learning
  - deep-learning
section: Sinh học
folder: >-
  Sinh học / Bioinformatics / B - Data Science and Bioinformatics / II - Giáo
  trình Bioinformatics
vaultPath: >-
  Resources/Sinh học/Bioinformatics/B - Data Science and Bioinformatics/II -
  Giáo trình Bioinformatics/10 - Machine learning và AI trong sinh học.md
url: /blog/machine-learning-va-ai-trong-sinh-hoc/
topic: biology
updated: '2026-10-19'
status: chưa học
order: 10
description: >-
  Machine learning giúp dự đoán từ dữ liệu omics (phân loại khối u, dự đoán đáp
  ứng thuốc), còn các mô hình nền tảng (foundation model) đang thay đổi cách dự
  đoán cấu trúc và chức năng phân tử.
isIndex: false
---
Machine learning giúp dự đoán từ dữ liệu omics (phân loại khối u, dự đoán đáp ứng thuốc), còn các mô hình nền tảng (foundation model) đang thay đổi cách dự đoán cấu trúc và chức năng phân tử.

**Mục tiêu:** xây mô hình ML có kiểm chứng đúng cách trên dữ liệu omics, hiểu các kiến trúc deep learning chính trong sinh học, và biết đánh giá mô hình AI sinh học một cách phê phán.

## 10.1 Machine learning cổ điển với scikit-learn

- **Có giám sát:** hồi quy logistic có điều chuẩn (L1/L2), random forest, gradient boosting (XGBoost), SVM. (→ [Classification](/blog/classification/))
- **Không giám sát:** PCA, phân cụm, UMAP (đã học ở Phần 3).
- **Đặc thù omics:** số đặc trưng (p, hàng chục nghìn gen) lớn hơn nhiều số mẫu (n, vài trăm), nên dễ quá khớp (overfitting).

```python
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import cross_val_score, StratifiedKFold

model = make_pipeline(StandardScaler(), LogisticRegression(penalty="l1", solver="liblinear", C=0.1))
cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
print(cross_val_score(model, X, y, cv=cv, scoring="roc_auc").mean())
```

## 10.2 Các lỗi kiểm chứng thường gặp

- **Rò rỉ dữ liệu (data leakage):** chọn đặc trưng hoặc chuẩn hóa trên toàn bộ dữ liệu trước khi chia train/test. Hãy đặt mọi bước tiền xử lý trong `Pipeline`.
- **Mẫu trùng bệnh nhân:** nhiều mẫu của cùng một người nằm ở cả train và test. Dùng `GroupKFold`.
- **Trình tự tương đồng:** với dữ liệu protein/DNA, chia tập theo cụm tương đồng (ví dụ MMseqs2 ở 30% identity), không chia ngẫu nhiên.
- **Hiệu ứng lô:** mô hình học lô thay vì sinh học. Kiểm tra trên một cohort độc lập.
- **Chỉ số:** dùng AUROC, AUPRC (khi lớp mất cân bằng), độ nhạy, độ đặc hiệu; luôn so với một mô hình cơ sở đơn giản.

## 10.3 Deep learning trong sinh học

| Kiến trúc                      | Ý tưởng                                     | Ví dụ ứng dụng                                               |
| ------------------------------ | ------------------------------------------- | ------------------------------------------------------------ |
| CNN                            | Học motif cục bộ trên trình tự              | DeepBind, Basset (dự đoán gắn yếu tố phiên mã, chromatin mở) |
| Transformer / mô hình ngôn ngữ | Học ngữ cảnh dài trên trình tự như văn bản  | ESM-2 (protein), DNABERT, Nucleotide Transformer, Enformer   |
| Graph neural network           | Học trên đồ thị phân tử hoặc mạng tương tác | Dự đoán tính chất thuốc, tương tác protein                   |
| Mô hình khuếch tán (diffusion) | Sinh cấu trúc mới                           | RFdiffusion (thiết kế protein), AlphaFold 3                  |
| Mô hình nền tảng single-cell   | Tiền huấn luyện trên hàng triệu tế bào      | scGPT, Geneformer                                            |

Thực hành: trích embedding protein bằng ESM-2 qua thư viện Hugging Face `transformers`, rồi dùng embedding làm đặc trưng cho một mô hình phân loại đơn giản (ví dụ dự đoán vị trí nội bào).

## 10.4 Đánh giá mô hình AI cho sinh học

Đây là kỹ năng ngày càng được cần: kiểm tra xem mô hình (kể cả mô hình ngôn ngữ lớn) trả lời câu hỏi sinh học có đúng, có căn cứ và an toàn không.

- **Benchmark chuẩn:** CASP (cấu trúc), ProteinGym (hiệu ứng đột biến), CAGI (diễn giải biến thể), các bộ câu hỏi sinh học cho LLM.
- **Tiêu chí đánh giá:** độ chính xác so với cơ sở dữ liệu (UniProt, ClinVar), trích dẫn có thật trên PubMed, nhận biết giới hạn, không bịa tên gen hay số liệu.
- **Cách làm:** viết bộ câu hỏi có đáp án tham chiếu, chấm theo rubric, ghi lại lỗi theo loại (sai sự kiện, sai suy luận, thiếu bối cảnh).

**Bài tập (dự án portfolio 2)**

- [ ] Dùng dữ liệu biểu hiện TCGA của hai loại ung thư, xây mô hình phân loại với L1-logistic và random forest, báo cáo AUROC trên tập test độc lập và 10 gen quan trọng nhất.
- [ ] Trích embedding ESM-2 cho 500 protein, vẽ UMAP tô màu theo họ protein.
- [ ] Soạn 20 câu hỏi bioinformatics có đáp án tham chiếu, đánh giá một chatbot theo rubric 3 tiêu chí.

**Tài nguyên:** sách "Deep Learning for the Life Sciences" (O'Reilly), [scikit-learn User Guide](https://scikit-learn.org/stable/user_guide.html), [ESM trên Hugging Face](https://huggingface.co/facebook/esm2_t33_650M_UR50D), [ProteinGym](https://proteingym.org).

## Ghi chép khi học

-
