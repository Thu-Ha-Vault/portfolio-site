---
title: Data Exploration Using Descriptive Statistics
type: article
tags:
  - data-analysis
  - descriptive-statistics
  - eda
  - article
section: Sinh học
folder: Sinh học / Biology Project and Lab Report / Introduction to Data Analysis
vaultPath: >-
  Resources/Sinh học/Biology Project and Lab Report/Introduction to Data
  Analysis/05 - Data Exploration Using Descriptive Statistics.md
url: /blog/data-exploration-using-descriptive-statistics/
topic: biology
updated: '2026-10-17'
order: 5
description: >-
  Tài liệu đọc (phần 1, 28 trang) của khoá End-to-End Data Analytics (eDA-2026)
  – AI Việt Nam (eda.aivietnam.edu.vn). Viết bằng tiếng Việt, giữ thuật ngữ
  tiếng Anh.
isIndex: false
---
> Tài liệu đọc (phần 1, 28 trang) của khoá **End-to-End Data Analytics (eDA-2026)** – AI Việt Nam (eda.aivietnam.edu.vn). Viết bằng tiếng Việt, giữ thuật ngữ tiếng Anh.

## Bối cảnh
- Dữ liệu thô đến từ nhiều nguồn và dạng (bảng, CSDL, văn bản, chuỗi thời gian, dữ liệu không gian, hình ảnh, âm thanh); khi quy mô tăng, đọc từng bản ghi không đủ để nhận ra đặc điểm quan trọng.
- Quy trình khám phá dữ liệu: **hiểu dữ liệu** (cấu trúc, loại) → **quan sát** (xu hướng, khác biệt, quan hệ) → **tóm tắt** bằng thống kê mô tả → đánh giá **độ bất định từ mẫu**.
- Bài chia 2 phần: **Data Foundation** và **Descriptive Statistics**.

## Phương pháp

### I. Data Foundation
- **Data**: giá trị/thông tin thô từ quan sát, đo lường, khảo sát, giao dịch, hệ thống số (không chỉ là số). **Dataset**: tập dữ liệu liên quan được tổ chức để phân tích.
	- **Row** = observation/record/sample; **Column** = variable/feature/attribute; **Cell** = một giá trị; **Target/label** = biến đầu ra cần dự đoán.
	- Luôn xác định **mỗi row đại diện cho điều gì** trước khi phân tích.
- **Loại dữ liệu**: (→ [Prepare Data for Exploration](/blog/prepare-data-for-exploration/))

| Loại | Ý nghĩa | Cách tóm tắt |
|---|---|---|
| **Nominal** (định tính) | Nhóm không có thứ tự (gender, country) | Count, %, bar chart |
| **Ordinal** (định tính) | Nhóm có thứ tự (rating 1–5, Low/Medium/High) | Count, median, ordered bar chart |
| **Discrete** (định lượng) | Đếm được, số nguyên | Mean, median, bar chart/histogram |
| **Continuous** (định lượng) | Đo được trong khoảng liên tục | Mean, SD, histogram, boxplot |

- Biến mã hoá bằng số chưa chắc là định lượng (1 = Red, 2 = Blue…).
- **Cross-sectional data** (nhiều đối tượng tại một thời điểm, vd Palmer Penguins – 344 con) vs **time series data** (một đối tượng qua nhiều mốc thời gian; thứ tự quan trọng, có phụ thuộc theo thời gian; quan tâm trend, seasonality, cycle, noise).
	- Cross-sectional → **random split** train/test; time series → **temporal split** (train trên quá khứ, test trên tương lai) để tránh **data leakage**.

### II. Descriptive Statistics
- Thống kê mô tả **tóm tắt** dữ liệu đang có, không suy rộng ra ngoài (khác thống kê suy luận). Trả lời: dữ liệu tập trung ở đâu (*central tendency*), trải rộng bao nhiêu (*dispersion*), một giá trị nằm ở đâu (*position*), hai biến có liên hệ không (*correlation*), hình dạng phân phối (*shape*). (→ [Analyze Data to Answer Questions](/blog/analyze-data-to-answer-questions/))
- **Central tendency**:
	- $\mu = \frac{1}{N}\sum_{i=1}^{N} x_i$ (population), $\bar{x} = \frac{1}{n}\sum_{i=1}^{n} x_i$ (sample; thay đổi theo mẫu).
	- **Mean** nhạy với outlier; **median** bền hơn (dùng khi dữ liệu lệch); **mode** là chỉ số duy nhất dùng được cho dữ liệu categorical, có thể không tồn tại hoặc có nhiều mode.
- **Moving average & trend filter** (chuỗi thời gian):
	- **SMA**: mọi điểm trong cửa sổ $k$ có trọng số $1/k$ → phản ứng chậm; **EMA**: điểm gần hiện tại trọng số lớn hơn → phản ứng nhanh. Cửa sổ nhỏ bám sát nhưng còn nhiễu, cửa sổ lớn mượt nhưng trễ.
	- **L1 trend filter**: $\min_{\mu} \frac{1}{2}\sum_{t=1}^{n}(y_t - \mu_t)^2 + \lambda \sum_{t=2}^{n}\lvert \mu_t - \mu_{t-1} \rvert$ → xu hướng gồm các đoạn phẳng (piecewise), robust với outlier; $\lambda$ càng lớn trend càng ít thay đổi.
- **Dispersion**:
	- $\sigma^2 = \frac{1}{N}\sum (x_i - \mu)^2$, $s^2 = \frac{1}{n-1}\sum (x_i - \bar{x})^2$; chia $n-1$ vì $\bar{x}$ tính từ chính mẫu làm tổng bình phương độ lệch bị đánh giá thấp → $s^2$ là ước lượng **không chệch** của $\sigma^2$. (→ [Expectation](/blog/expectation/))
	- SD có cùng đơn vị với dữ liệu nên dễ diễn giải hơn variance. Hai cửa hàng cùng mean 500 triệu nhưng SD 20 vs 150 triệu → mean một mình không đủ.
	- **Range** $= x_{max} - x_{min}$ (rất nhạy outlier); **quartile** $Q_1, Q_2, Q_3$; **IQR** $= Q_3 - Q_1$ (50% dữ liệu ở giữa, bền với outlier). Quy ước nội suy quartile khác nhau giữa Excel, NumPy, Pandas → dùng nhất quán. (→ [Đặc trưng thống kê mẫu (Excel)](/blog/3-dac-trung-thong-ke-cua-mot-mau-va-uoc-luong-tham-so-cua-tong-the/))
- **Boxplot và outlier**:
	- **Fence** $= Q_1 - 1{,}5\,IQR$ và $Q_3 + 1{,}5\,IQR$ (ngưỡng lý thuyết); **whisker** dừng ở điểm dữ liệu thực xa nhất còn trong fence.
	- Quy tắc IQR phù hợp dữ liệu lệch; quy tắc **z-score** $\lvert z \rvert > 3$ phù hợp dữ liệu gần chuẩn. Với dữ liệu lệch, IQR thường phát hiện nhiều outlier hơn vì mean và SD đã bị outlier kéo lệch.
	- Outlier không mặc nhiên là lỗi – cần kiểm tra bối cảnh (đơn sỉ, khuyến mãi, lỗi nhập liệu) trước khi loại. (→ [Filter outlier trong Tableau](/blog/share-data-through-the-art-of-visualization/))
- **Position**: percentile thứ $p$ là giá trị có $p\%$ dữ liệu nằm dưới ($Q_1$ = P25, median = P50, $Q_3$ = P75; vd P99 latency); **z-score** $z = \frac{x - \mu}{\sigma}$ cho phép so sánh các thang đo khác nhau. (→ [Estimating the CDF](/blog/estimating-the-cdf-and-statistical-functionals/))
- **Correlation** – Pearson's r: $r = \dfrac{\sum (x_i - \bar{x})(y_i - \bar{y})}{\sqrt{\sum (x_i - \bar{x})^2}\sqrt{\sum (y_i - \bar{y})^2}} \in [-1, 1]$; $r = 0$ chỉ là không có quan hệ **tuyến tính** (có thể vẫn phi tuyến). (→ [Tương quan và hồi quy](/blog/tuong-quan-va-hoi-quy/))

## Kết quả chính
- Ví dụ doanh số 8 chi nhánh (200, 350, 420, 480, 510, 560, 620, 950 triệu): range = 750; $Q_1$ = 385, median = 495, $Q_3$ = 590, IQR = 205 (≈ 27% range); fence = [77,5; 897,5] → **950 là outlier**, whisker trên dừng ở 620.
- Ba điều cần nhớ về tương quan:
	1. **Tương quan không phải nhân quả** (doanh số kem và cá mập tấn công cùng tăng do thời tiết nóng – biến gây nhiễu). (→ [Causal Inference](/blog/causal-inference-biology/))
	2. **Tương quan khác hồi quy**: tương quan chỉ đo mức liên hệ; hồi quy mô hình hoá cách một biến thay đổi theo biến kia.
	3. **Nghịch lý Simpson**: gộp 3 loài chim cánh cụt thì tương quan chiều dài – độ sâu mỏ **âm**, nhưng trong từng loài lại **dương** → luôn kiểm tra tương quan ở cả mức tổng thể và từng nhóm.
- Thêm: **spurious correlation** (tương quan giả) và **multicollinearity** (đa cộng tuyến giữa các biến đầu vào gây bất ổn mô hình hồi quy).

## Ý nghĩa / ứng dụng
- Khung tư duy cho bước **EDA** trước mọi phân tích: xác định ý nghĩa row, loại biến → chọn đúng chỉ số và biểu đồ; báo cáo luôn kèm chỉ số phân tán bên cạnh trung bình; dùng median/IQR cho dữ liệu lệch hoặc có đột biến.
- Ứng dụng trực tiếp cho bài thực hành R của môn: `summary()`, `quantile()`, `IQR()`, `boxplot()` và quy tắc 1,5 IQR để loại outlier; tránh data leakage khi chia train/test như trong tiểu luận Boston Housing. (→ [Mô tả dữ liệu bằng R](/blog/trinh-bay-va-mo-ta-du-lieu-thuc-hanh-r/))
- Tài liệu tham khảo của bài: Wickham (2014) "Tidy data"; OpenStax *Principles of Data Science*, *Introductory Statistics 2e*; Hyndman & Athanasopoulos *Forecasting: Principles and Practice* (3rd ed.).

## Tài liệu gốc
*Reading - Data Exploration Using Descriptive Statistics.pdf*

- Tên file gốc chứa dấu `[ ]` nên không dùng được wikilink `![[...]]`; nhúng bằng cú pháp Markdown với đường dẫn mã hoá URL.
