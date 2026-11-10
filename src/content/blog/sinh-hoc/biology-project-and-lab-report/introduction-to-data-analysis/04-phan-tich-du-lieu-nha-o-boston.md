---
title: 'Tiểu luận: Vận dụng R phân tích dữ liệu nhà ở Boston'
type: lab-report
tags:
  - data-analysis
  - r
  - regression
  - random-forest
  - lab-report
section: Sinh học
folder: Sinh học / Biology Project and Lab Report / Introduction to Data Analysis
vaultPath: >-
  Resources/Sinh học/Biology Project and Lab Report/Introduction to Data
  Analysis/04 - Phân tích dữ liệu nhà ở Boston.md
url: /blog/tieu-luan-van-dung-r-phan-tich-du-lieu-nha-o-boston/
topic: biology
updated: '2026-10-16'
order: 4
description: >-
  Tiểu luận Nhóm 4, học phần Nhập môn phân tích dữ liệu (MAT1060 2), Trường ĐH
  Khoa học Tự nhiên – ĐHQGHN; giảng viên Vũ Ngọc Bình. Phần lớn code và output
  nằm ở dạng ảnh chụp trong file docx.
isIndex: false
---
> Tiểu luận Nhóm 4, học phần **Nhập môn phân tích dữ liệu** (MAT1060 2), Trường ĐH Khoa học Tự nhiên – ĐHQGHN; giảng viên Vũ Ngọc Bình. Phần lớn code và output nằm ở dạng ảnh chụp trong file docx.

## Mục đích
- Tìm các yếu tố ảnh hưởng đến **giá trị bất động sản** ở Boston (thu nhập, môi trường, giáo dục, quy mô tài sản…) và xác định các biến quan trọng nhất.
- Xây dựng nhiều mô hình **hồi quy tuyến tính** (đầy đủ biến, chọn tập con, đa thức, có tương tác) và so sánh bằng $R^2$, $R^2$ hiệu chỉnh, AIC, BIC, MSE; mở rộng với **Random Forest**.

## Nguyên lý
- **Hồi quy tuyến tính**: tìm hàm dự đoán biến phụ thuộc $Y$ từ các biến độc lập $X$, sao cho đường hồi quy gần nhất với các điểm (tối thiểu sai số): (→ Linear and Logistic Regression)
	- $\hat{Y} = \beta_0 + \beta_1 X_1 + \dots + \beta_p X_p + \varepsilon$.
- **Bốn giả định** cần kiểm tra: quan hệ **tuyến tính** giữa $X$ và $Y$; sai số **độc lập**; **phương sai sai số không đổi** (theo thời gian, giá trị dự đoán, giá trị biến độc lập); phần dư **phân phối chuẩn**.
- **Đánh giá mô hình**:
	- $H_0$: hệ số của biến bằng 0; $H_1$: hệ số khác 0. `Pr(>|t|)` < 0,05 (có "***") → hệ số có ý nghĩa.
	- **Multiple $R^2$**: tỷ lệ biến thiên của $Y$ được giải thích bởi tất cả biến độc lập; **$R^2$ hiệu chỉnh** "phạt" khi thêm biến không giúp dự đoán.
	- **F-statistic** có ý nghĩa → mô hình tốt (càng cao càng tốt).
- **Chọn tập con tốt nhất (best subset selection)**: với $k = 1, \dots, p$, khớp tất cả $\binom{p}{k}$ mô hình chứa đúng $k$ biến, chọn mô hình tốt nhất $M_k$ (RSS nhỏ nhất / $R^2$ lớn nhất), rồi chọn trong $M_0, \dots, M_p$ bằng lỗi cross-validation, $C_p$, BIC hoặc $R^2$ hiệu chỉnh.
- **Hồi quy đa thức**: dùng khi quan hệ có dạng đường cong (thêm số hạng bậc 2 như $lstat^2$). (→ [Tương quan và hồi quy](/blog/tuong-quan-va-hoi-quy/))

## Vật liệu & phương pháp
- **Dữ liệu** `Boston` (gói MASS): 506 quan sát, 14 biến. Biến mục tiêu **medv** – giá trị trung vị nhà do chủ sở hữu ở (nghìn USD). (→ [Thao tác dữ liệu trong R](/blog/cac-thao-tac-voi-du-lieu-trong-r/))

| Biến | Ý nghĩa |
|---|---|
| crim | Tỷ lệ tội phạm bình quân đầu người theo thị trấn |
| zn | Tỷ lệ đất ở quy hoạch cho lô > 25.000 ft² |
| indus | Tỷ lệ diện tích kinh doanh phi bán lẻ |
| chas | Biến giả = 1 nếu giáp sông Charles |
| nox | Nồng độ nitơ oxit |
| rm | Số phòng trung bình mỗi căn |
| age | Tỷ lệ căn xây trước 1940 |
| dis | Khoảng cách có trọng số tới 5 trung tâm việc làm |
| rad | Chỉ số tiếp cận đường cao tốc |
| tax | Thuế suất trên 10.000 USD |
| ptratio | Tỷ lệ học sinh – giáo viên |
| black | $1000(B_k - 0{,}63)^2$, $B_k$ là tỷ lệ người da đen |
| lstat | % dân số thu nhập thấp |

- **Gói R**: corrr, gridExtra, ggplot2, lattice, plotly, caTools, tidyverse, dplyr, DT, MASS, leaps, glmnet, PerformanceAnalytics (+ corrplot, randomForest).
- **Quy trình**:
	1. Khám phá dữ liệu: `summary()`, ma trận tương quan (`corrplot`), biểu đồ tán xạ từng biến với medv.
	2. Chia ngẫu nhiên **80:20** thành tập train/test.
	3. Hồi quy tuyến tính đầy đủ biến → bỏ biến không có ý nghĩa → chọn tập con bằng `regsubsets` (gói leaps, `nmax` = 13 biến).
	4. Hồi quy đa thức, thêm tương tác; chẩn đoán mô hình bằng `plot()` của đối tượng `lm`.
	5. Random Forest và so sánh RMSE.

```r
# (đã sửa lỗi gõ của bản gốc: facet_wray, dấu ngoặc kép cong, thiếu ngoặc)
Boston %>%
  gather(key, val, -medv) %>%
  ggplot(aes(x = val, y = medv)) +
  geom_point() +
  stat_smooth(method = "lm", se = TRUE, col = "blue") +
  facet_wrap(~key, scales = "free") +
  ggtitle("Scatter plot of dependent variables vs Median Value (medv)")

model2  <- lm(medv ~ . - indus - age, data = Boston.train)
lm.fit2 <- lm(medv ~ . - age - indus + I(lstat^2), data = train)
lm.fit3 <- lm(medv ~ . - indus - age - zn + rm*lstat - black + rm*rad + lstat*rad,
              data = train)
plot(lm.fit3)   # 4 biểu đồ chẩn đoán
```

## Kết quả chính
- **Khám phá dữ liệu**:
	- crim và black có miền giá trị lớn; crim, zn, rm, black chênh lệch lớn giữa mean và median.
	- age và black lệch trái; crim và dis lệch phải mạnh.
	- **lstat** và **rm** tương quan chặt với medv; lstat, dis, rm khá tuyến tính, crim quan hệ phức tạp; quan hệ lstat – medv có thể **phi tuyến** → đưa $lstat^2$ vào mô hình.
	- ~93% bất động sản không giáp sông Charles; nhà giáp sông có giá trung bình cao hơn.
- **So sánh các mô hình hồi quy**:

| Mô hình | $R^2$ | $R^2$ hiệu chỉnh | F-statistic |
|---|---|---|---|
| Đơn biến medv ~ lstat | 0,5441 | – | – |
| Tất cả biến | ≈ 0,76 | – | 90,8 |
| Bỏ age, indus (mục 2.4) | 0,759 | 0,7514 | – |
| Đa thức bậc 2 cho lstat, crim (mục 2.5) | 0,816 | 0,8115 | – |
| Bỏ age, indus + $lstat^2$ | ≈ 0,81 | – | 128,5 |
| **lm.fit3** (bỏ indus, age, zn, black + tương tác rm×lstat, rm×rad, lstat×rad) | **0,8642** | **0,8596** | **185,1** (12 và 349 df) |

- Chọn tập con: sau khoảng 8 biến các chỉ số gần bão hoà; biến thứ 12–13 (**indus, age**) không cải thiện mà còn kém đi → giữ 11 biến zn, chas, nox, rm, dis, rad, tax, ptratio, black, lstat, crim.
- **lm.fit3**: tất cả hệ số đều có ý nghĩa ($p < 0{,}001$); ví dụ rm = 11,62, nox = −15,51, chas = 2,85, rm:lstat = −0,318; residual standard error 3,423.
- **Chẩn đoán phần dư** (so sánh mô hình tuyến tính với mô hình đa thức):
	- *Residuals vs Fitted*: mô hình tuyến tính có dạng parabol (bỏ sót phi tuyến); mô hình đa thức phân bố quanh 0.
	- *Normal Q-Q*: mô hình đa thức gần chuẩn hơn.
	- *Scale-Location*: mô hình đa thức có đường đỏ gần nằm ngang (phương sai đồng nhất hơn).
	- *Residuals vs Leverage*: không có điểm ảnh hưởng vượt khoảng cách Cook; các điểm 365, 370, 373 nổi bật.
	- Histogram phần dư của lm.fit3 hơi lệch phải, gần như chuẩn.
- **Random Forest** (`randomForest(MEDV ~ ., data = training)`, `set.seed(12345)`): **RMSE = 2,93**, pseudo-$R^2$ = 0,854; biểu đồ giá dự đoán – giá thực bám sát đường chéo. (→ Error Rates and the Bayes Classifier, [Data Mining](/blog/data-mining/))

## Kết luận & thảo luận
- Mô hình **Random Forest** với tất cả đặc trưng cho kết quả tốt nhất (RMSE thấp nhất) trong các mô hình thử nghiệm.
- Trong các mô hình tuyến tính, thêm số hạng phi tuyến ($lstat^2$) và tương tác giúp $R^2$ tăng từ ~0,76 lên ~0,86 và cải thiện rõ các biểu đồ chẩn đoán.
- Nhận xét: báo cáo dùng nhiều notebook nguồn (tên biến `Boston.train`, `train`, `training`, `MEDV`/`medv` khác nhau) nên các mô hình không hoàn toàn cùng tập train/test; một số công thức ($R^2$, phương trình hồi quy) là ảnh, bị mất khi trích văn bản; phần 4.3 chỉ có hình.
- Tài liệu tham khảo chính: Kaggle "Regression with R – Boston Housing Price" (Andrew, 2017), "EDA and Linear Regression on Boston Housing in R" (Seth, 2020), RPubs "Analysis on Boston Housing Data" (Rohit), Su, Yan & Tsai (2012) "Linear regression", *WIREs Computational Statistics* 4(3): 275–294.
- Xem thêm: [Case Study](/blog/case-study/) – case study phân tích dữ liệu cuối khoá Google Data Analytics
- Xem thêm: [Mô phỏng trong Virtual Lab](/projects/virtual-lab/thi-nghiem-giai-doan-4/) – giải thích vì sao không đưa bộ Boston vào app; bảng phân tích có xuất mã R.

## Tài liệu gốc
- Boston Housing.docx
