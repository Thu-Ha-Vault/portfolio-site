---
title: Probability
type: note
tags:
  - bioinformatics
  - statistics-and-biostatistics
  - probability
section: Sinh học
folder: Sinh học / Bioinformatics / A - Statistics and Biostatistics / I - Probability
vaultPath: >-
  Resources/Sinh học/Bioinformatics/A - Statistics and Biostatistics/I -
  Probability/01 - Probability.md
order: 1
description: >-
  Xác suất là ngôn ngữ toán (mathematics language) định lượng sự không chắc chắn
  (quantifying uncertainty). (→ Tổng ôn và mẹo làm bài, Xác suất thống kê đại
  cương)
isIndex: false
---
## Introduction

- Xác suất là ngôn ngữ toán (mathematics language) định lượng sự không chắc chắn (quantifying uncertainty). (→ [Tổng ôn và mẹo làm bài](/blog/sinh-hoc/kien-thuc-chung/h-tong-on/26-tong-on-va-meo-lam-bai/), [Xác suất thống kê đại cương](/blog/hoc-phan-dai-cuong/01-toan-hoc/))

## Sample Spaces and Events (Không gian mẫu và Biến cố)

- Không gian mẫu (Ω) là tập hợp tất cả các kết quả có thể xảy ra của một phép thử.

- Các điểm (ω) thuộc Ω được gọi là kết quả (sample outcomes), thực hiện (realizations), phần tử (elements).

- Tập hợp con của Ω được gọi là biến cố (A).

- Các tập A1, A2,... không giao nhau hay loại trừ lẫn nhau nếu Ai∩Aj =∅ với mọi i ≠  j

- Biến cố đầy đủ (partition) của Ω là một chuỗi các tập không giao nhau A1, A2,... .

![image_001](/vault-assets/image-001-d27b9c75.png)

- Cho một biến cố A, định nghĩa hàm chỉ thị của A: .

![image_002](/vault-assets/image-002-eca392b9.png)

- Một chuỗi tập hợp A1, A2, … là tăng đơn điệu nếu A1 ⊂ A2 ⊂ ··· và ta định nghĩa

![image_003](/vault-assets/image-003-86a2f264.png)

- Một chuỗi tập hợp A1, A2, … là giảm đơn điệu nếu A1 ⊃ A2 ⊃ · · · và ta định nghĩa

![image_003](/vault-assets/image-003-86a2f264.png)

![image_004](/vault-assets/image-004-2e098238.png)

![image_005](/vault-assets/image-005-c809f746.png)

## Probability

- Gán một số thực P(A) cho mỗi biến cố A, gọi là xác suất của A. P còn được gọi là phân phối xác suất (probability distribution) hay đo lường xác suất (probability measure). Để đạt điều kiện là một xác suất, P phải thoả mãn 3 tiên đề:

- Tiên đề 1: P(A) ≥ 0 với mọi A

- Tiên đề 2: P(Ω) = 1

- Tiên đề 3: Nếu A1, A2, … không giao nhau thì:

![image_006](/vault-assets/image-006-517052d0.png)

- Có nhiều cách để biểu diễn P(A). Hai cách phổ biến nhất là tần số (frequencies) và mức độ tin tưởng (degree of belief). Đều tuân theo 3 tiên đề. Sự khác biệt giữa hai cách này không quan trọng lắm cho đến khi ta quan tâm đến suy rộng thống kê. Tại đó, sự khác biệt giữa hai cách dẫn đến hai trường phái suy rộng: tần số (frequentist) và Bayesian.

- Với tần số, P(A) là một tỉ lệ dài hạn mà A đúng trong các lần lặp lại.

- Với mức độ tin tưởng, P(A) đo lường mức độ tin tưởng của người quan sát rằng A đúng.

![image_007](/vault-assets/image-007-1697867a.png)

## Probability on Finite Sample Spaces (Xác suất không gian mẫu hữu hạn)

![image_008](/vault-assets/image-008-3d99f2a7.png)

![image_009](/vault-assets/image-009-01412743.png)

- Cho không gian mẫu Ω = {ω1, …, ωn} là hữu hạn và mỗi kết quả có khả năng như nhau: được gọi là phân phối xác suất đồng nhất.

![image_010](/vault-assets/image-010-72981ba4.png)

- Để tính toán xác suất, ta cần đếm số lượng các điểm trong một biến cố A. Phương pháp để đếm các điểm gọi là phương pháp tổ hợp.

- Cho n đối tượng, số cách sắp xếp các đối tượng là , để thuận tiện, ta định nghĩa 0!=1. Ta cũng định nghĩa:  “n choose k”, số cách phân biệt để chọn k đối tượng từ n. (→ [Tương tác gen](/blog/sinh-hoc/kien-thuc-chung/c-quy-luat-di-truyen/10-tuong-tac-gen/), [Nguyên phân, giảm phân](/blog/sinh-hoc/kien-thuc-chung/b-co-che-di-truyen-va-bien-di/08-nguyen-phan-giam-phan-va-bai-tap-giao-tu/))

![image_011](/vault-assets/image-011-f882d24f.png)

![image_012](/vault-assets/image-012-36bb4709.png)

![image_013](/vault-assets/image-013-839d08d9.png)

## Independent Events (Biến cố độc lập)

- Nếu ta tung đồng xu hai lần thì xác suất để hai lần ngửa là 0.5*0.5. Ta nhân xác suất bởi ta cho hai lần tung là độc lập. (→ [Liên kết gen và hoán vị gen](/blog/sinh-hoc/kien-thuc-chung/c-quy-luat-di-truyen/12-lien-ket-gen-va-hoan-vi-gen/), [Quy luật Mendel](/blog/sinh-hoc/kien-thuc-chung/c-quy-luat-di-truyen/09-quy-luat-mendel/), [Di truyền học quần thể](/blog/sinh-hoc/kien-thuc-chung/d-di-truyen-hoc-quan-the-va-nguoi/14-di-truyen-hoc-quan-the/))

- Định nghĩa:

![image_014](/vault-assets/image-014-82abe1d8.png)

- Độc lập có thể phát sinh từ hai cách phân biệt.

- Đôi khi, ta thừa nhận rõ ràng rằng hai biến cố là độc lập. Ví dụ, khi tung đồng xu hai lần, ta thường cho rằng hai lần tung là độc lập phản ánh sự thật là đồng xu không có kí ức về lần tung trước.

- Trong trường hợp khác, ta phát sinh độc lập bằng cách xác nhận rằng P(AB)=P(A)P(B). Ví dụ, khi tung xúc xắc, cho A={2, 4, 6} và B={1, 2, 3, 4}. Và, A∩B={2, 4}, P(AB)=(2/6)=P(A)P(B)=(½)*(⅔) nên A và B độc lập. Trong trường hợp này, ta không cho rằng A và B là độc lập mà chúng hoá ra là độc lập.

- Nếu A và B là hai biến cố không giao nhau, có xác suất dương. Liệu chúng có độc lập với nhau? Không, do P(A)P(B) > 0 nhưng P(AB) = P(∅) = 0.

## Conditional Probability (Xác suất có điều kiện)

- Cho răng P(B) > 0, ta định nghĩa xác suất có điều kiện của A theo B là (→ [Di truyền học người](/blog/sinh-hoc/kien-thuc-chung/d-di-truyen-hoc-quan-the-va-nguoi/15-di-truyen-hoc-nguoi-va-di-truyen-y-hoc/))

![image_015](/vault-assets/image-015-aea1265c.png)

## Bayes’ Theorem

- Xem thêm: [Bayesian Inference](/blog/sinh-hoc/bioinformatics/a-statistics-and-biostatistics/ii-statistical-inference/06-bayesian-inference/) – định lý Bayes là nền tảng của suy luận Bayes
- Xem thêm: [Bayes Classifier](/blog/sinh-hoc/bioinformatics/a-statistics-and-biostatistics/iii-statistical-models-and-method/11-error-rates-and-the-bayes-classifier/) – Bayes classifier / Naive Bayes dựa trên định lý Bayes
