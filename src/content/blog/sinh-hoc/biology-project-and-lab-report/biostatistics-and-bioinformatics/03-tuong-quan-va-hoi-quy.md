---
title: 'Chương 5: Tương quan và hồi quy'
type: course-note
tags:
  - biology
  - biostatistics
  - correlation
  - regression
  - excel
  - course-note
section: Sinh học
folder: Sinh học / Biology Project and Lab Report / Biostatistics and Bioinformatics
vaultPath: >-
  Resources/Sinh học/Biology Project and Lab Report/Biostatistics and
  Bioinformatics/03 - Tương quan và hồi quy.md
order: 3
description: >-
  File Excel gồm sheet Lý thuyết (các bước làm bài, cách đọc output Regression
  của Excel, phân biệt hệ số tương quan và tỷ số tương quan, phương pháp bình
  phương tối thiểu) và các sheet bài tập (Bài 1–16) về hồi quy tuyến 
isIndex: false
---
> File Excel gồm sheet **Lý thuyết** (các bước làm bài, cách đọc output *Regression* của Excel, phân biệt hệ số tương quan và tỷ số tương quan, phương pháp bình phương tối thiểu) và các sheet bài tập (Bài 1–16) về hồi quy tuyến tính, hypebol, đa thức, hàm mũ, hàm lũy thừa trên số liệu sinh học.

## Khái niệm chính
- **Biến độc lập** $X$ và **biến phụ thuộc** $Y$.
- **Hệ số tương quan** $r$ – chỉ tiêu về mức độ liên hệ **tuyến tính**: (→ [Multivariate Models](/blog/sinh-hoc/bioinformatics/a-statistics-and-biostatistics/iii-statistical-models-and-method/02-multivariate-models/), [Data Exploration Using Descriptive Statistics](/blog/sinh-hoc/biology-project-and-lab-report/introduction-to-data-analysis/05-data-exploration-using-descriptive-statistics/), [Giải thích correlation coefficient khi thuyết trình](/blog/sinh-hoc/bioinformatics/b-data-science-and-bioinformatics/i-data-science/06-share-data-through-the-art-of-visualization/))
	- $r = \dfrac{\sum (x_i - \bar{x})(y_i - \bar{y})}{\sqrt{\sum (x_i - \bar{x})^2 \sum (y_i - \bar{y})^2}}$, $r \in [-1; 1]$.
	- Excel: *Data → Data Analysis → Correlation*.

| | Hệ số tương quan (Correlation Coefficient) | Tỷ số tương quan (Correlation Ratio) |
|---|---|---|
| Ký hiệu | $r$ | $\eta$ |
| Khoảng giá trị | $[-1; 1]$ | $[0; 1]$ |
| Ý nghĩa | Độ mạnh yếu và chiều hướng của quan hệ **tuyến tính** | Mức độ chặt chẽ của liên hệ tương quan **phi tuyến** |

- **Mô hình hồi quy tuyến tính đơn**: $y_i = \alpha + \beta x_i + \varepsilon_i$ (→ [Linear and Logistic Regression](/blog/sinh-hoc/bioinformatics/a-statistics-and-biostatistics/iii-statistical-models-and-method/01-linear-and-logistic-regression/), [Statistic and Regression](/blog/ai-va-dev/khoa-hoc-ai-cua-tsing-hua-university/learning-module/05-statistic-and-regression/))
	- $\alpha$: hệ số chặn (*intercept*, giá trị khi $x_i = 0$); $\beta$: độ dốc (*slope*), hệ số hồi quy.
	- $\varepsilon_i$: sai số, phân phối chuẩn với trung bình 0 và phương sai $\sigma^2$.
- **Phương pháp bình phương tối thiểu (Least Squares)**: tìm $\alpha, \beta$ sao cho $\sum (y_i - \alpha - \beta x_i)^2$ nhỏ nhất:
	- $\hat{\beta} = \dfrac{\sum (x_i - \bar{x})(y_i - \bar{y})}{\sum (x_i - \bar{x})^2}$, $\hat{\alpha} = \bar{y} - \hat{\beta}\bar{x}$ (chỉ là **ước số**, không biết chính xác $\alpha, \beta$).
	- $\hat{y}_i$ là trị trung bình cho $x_i$; $y_i - \hat{y}_i$ là **phần dư (residual)**. (→ [Phân tích dữ liệu nhà ở Boston](/blog/sinh-hoc/biology-project-and-lab-report/introduction-to-data-analysis/04-phan-tich-du-lieu-nha-o-boston/))
	- Phương sai phần dư: $s^2 = \dfrac{\sum (y_i - \hat{y}_i)^2}{n - 2}$ là ước số của $\sigma^2$.
- **Hệ số xác định**: $R^2 = 1 - \dfrac{SS_{res}}{SS_{total}}$, $SS_{total} = \sum (y_i - \bar{y})^2$; càng gần 1 mô hình càng phù hợp.

## Công thức / phương pháp

### Các bước làm bài
1. Đọc kỹ bảng số liệu; xác định biến $X$ (độc lập), $Y$ (phụ thuộc).
2. Vẽ biểu đồ tán xạ/đường → suy ra dạng quan hệ (có thể dùng *trendline* để dự đoán phương trình).
3. Kiểm tra sự tồn tại của hệ số tương quan (*Correlation*).
4. Sắp xếp lại bảng theo cột $X$; **biến đổi bảng** (thêm cột $X^2, X^3, 1/X, \ln Y$…) để đưa về dạng tuyến tính.
5. Chạy *Data Analysis → Regression*.
6. Xác định phương trình thích hợp: tổng bình phương sai lệch $\sum (Y_{lt} - Y_{tt})^2$ nhỏ nhất (lý thuyết vs thực tế).
7. Kiểm định sự tồn tại của phương trình (bằng **Significance F**) và của từng hệ số hồi quy (bằng **t Stat**).

### Kiểm định
- **Hệ số tương quan** ($H_0$: $r = 0$): $t_r = \dfrac{r\sqrt{n-2}}{\sqrt{1 - r^2}}$, so với $t_{(0{,}05;\ n-2)}$ = `TINV(0,05; n-2)` (hàm `TINV` cho giá trị two-tail nên không cần lấy $\alpha/2$). $\lvert t_r \rvert > t_{0,05}$ → tồn tại hệ số tương quan.
- **Phương trình hồi quy** ($H_{01}$: không tồn tại phương trình): Significance F < 0,05 → bác bỏ $H_{01}$.
- **Từng hệ số** ($H_{02}$: $a = 0$, $H_{03}$: $b = 0$…): $\lvert t\ Stat \rvert > t_{(0{,}05;\ n-2)}$ hoặc p-value < 0,05 → hệ số tồn tại thật.
- Cần kiểm định hệ số tương quan cho dạng $Y = a + bX$ và các dạng phi tuyến đã đưa về dạng này.

### Đọc output Regression của Excel
- **Regression Statistics**: *Multiple R* (hệ số tương quan), *R Square*, *Adjusted R Square*, *Standard Error*, *Observations* ($n$).
- **ANOVA**: *df*; *SS Regression* (biến sai giữa trị lý thuyết của phương trình và trung bình chung của $Y$); *SS Residual* (biến sai giữa trị quan sát và trị lý thuyết); *MS* = SS/df; *F* = MS Regression / MS Residual; *Significance F*.
- **Coefficients**: *Intercept* (hệ số tự do $a$), hệ số của $X, 1/X, X^2$… ($b, c$…); *Standard Error* ($s_a, s_b$); *t Stat*; *P-value*; *Lower/Upper 95%* (khoảng ước lượng của tham số).

### Tuyến tính hoá các dạng hàm

| Dạng hàm | Biến đổi |
|---|---|
| Hypebol $Y = a + b/X$ | Đặt $X' = 1/X$ → $Y = a + bX'$ |
| Đa thức $Y = a + bX + cX^2 + \dots$ | Thêm cột $X^2, X^3, \dots$ (hồi quy nhiều biến) |
| Mũ $Y = a e^{bX}$ | $\ln Y = \ln a + bX$ |
| Mũ $Y = a b^X$ | $\ln Y = \ln a + X \ln b$ |
| Lũy thừa $W = a L^b$ | $\ln W = \ln a + b \ln L$ |
| $H = k/(T - d)$ | $1/H = T/k - d/k$ |
| Von Bertalanffy $L_t = L_\infty (1 - e^{-k(t - t_0)})$ | Từ $L_{t+1} - L_t = a + bL_t$ suy ra $L_\infty$ khi tốc độ sinh trưởng → 0 |

## Bài tập / ví dụ

| Bài | Dữ liệu | Mô hình | Kết quả |
|---|---|---|---|
| 1 | Bảng $X$–$Y$ (5 điểm) | $Y = a + b/X$ | $r = 0{,}871$, $t_r = 3{,}07 < t_{0,05} = 3{,}18$ → hệ số tương quan **không** tồn tại |
| 2 | Bề dày lớp mỡ dưới da – tuổi học sinh nữ Hà Đông | Đa thức bậc 5 | $R^2 = 0{,}9965$, Sig. F = $2{,}8 \times 10^{-7}$; mọi hệ số có $p < 0{,}05$ |
| 3, 4 | Khối nạc / khối mỡ cơ thể (phương pháp FBM) theo tuổi | Đa thức bậc 5 | $R^2$ cao (Bài 4: 0,997), Sig. F < 0,05 nhưng **các hệ số đều không có ý nghĩa** → phương trình không có ý nghĩa thống kê |
| 5 | Tần số phân bố – chiều dài cơ thể | Parabol bậc 2 | $Y = -110{,}43 + 27{,}95X - 1{,}23X^2$; $R^2 = 0{,}856$, Sig. F = $2{,}4 \times 10^{-5}$; cả 3 hệ số có ý nghĩa |
| 6 | Tốc độ phát triển thực vật – cường độ chiếu sáng | Hypebol | $Y = 2{,}48 + 19292{,}5/X$; $R^2 = 0{,}747$; hệ số $b$ có ý nghĩa ($p = 0{,}001$), hệ số chặn thì không |
| 7 | Số loài ra hoa / kết quả theo tháng (Sapa – Phansipan) | Đa thức bậc 5 | $R^2$ = 0,917 và 0,772 nhưng các hệ số không có ý nghĩa |
| 8 | Chiều dài theo tuổi | $L_{t+1} - L_t = a + bL_t$ | $L_{t+1} - L_t = 26{,}1688 - 0{,}1412L_t$ ($R^2 = 0{,}878$); phần tính $K$, $t_0$ chưa làm |
| 9 | Nhiệt độ $T$ – thời gian nở $H$ của trứng *Drosophila* | So sánh 4 mô hình | Tổng bình phương sai lệch: tuyến tính 315,38; $H = k/(T-d)$ 3484,69; **đa thức bậc 4: 0,48**; mũ 181,72 → chọn **đa thức bậc 4** ($R^2 = 0{,}9997$) |
| 11 | Cá vược *Lates calcarifer*: chiều dài, khối lượng theo tuổi | Bậc 2, bậc 3, lũy thừa | $L = 9{,}29 + 47{,}69X - 2{,}01X^2$; $W$ bậc 3 có $R^2 = 0{,}998$; $W = 0{,}00073 \cdot L^{2{,}32}$ ($R^2 = 0{,}957$) |
| 12 | Độ dài khuẩn ti – nhiệt độ nuôi cấy | Đa thức bậc 4 | $R^2 = 0{,}993$, Sig. F = 0,015 nhưng các hệ số $p > 0{,}05$ |
| 13 | Hàm lượng vitamin C trong trái cây | $Y = ab^X$ | $Y = 264{,}13 \cdot 0{,}608^X$; $R^2 = 0{,}978$, Sig. F = $1{,}2 \times 10^{-9}$ |

- Bài 9: phương trình tuyến tính $H = 80{,}656 - 2{,}2125T$ ($R^2 = 0{,}788$) vẫn có ý nghĩa thống kê, nhưng sai lệch lớn hơn nhiều so với đa thức bậc 4 → "có ý nghĩa" chưa chắc là "phù hợp nhất".
- Bài 10 (lượng mưa – sản lượng tôm), Bài 14 (tần suất – chiều dài lá), Bài 15 (ghi "sách in sai") và Bài 16 ($Y = Y_0 e^{rt}$) chỉ mới lập bảng, chưa có kết quả.
- Bài học rút ra: $R^2$ cao và Sig. F nhỏ chưa đủ – phải kiểm tra **t Stat của từng hệ số**; đa thức bậc cao với ít điểm dễ có $R^2$ gần 1 nhưng hệ số không có ý nghĩa (Bài 3, 4, 7, 12). (→ [Nonparametric Curve Estimation](/blog/sinh-hoc/bioinformatics/a-statistics-and-biostatistics/iii-statistical-models-and-method/08-nonparametric-curve-estimation/))
- Xem thêm: [Mô phỏng trong Virtual Lab](/projects/virtual-lab/09-thi-nghiem-giai-doan-4/) – bài 9 (trứng ruồi giấm) hồi quy tuyến tính, mũ, đa thức trong bảng Phân tích số liệu.
- Xem thêm: [Hồi quy phi tuyến trong Virtual Lab](/projects/virtual-lab/11-tai-lieu-drive-cho-giai-doan-6/) – Michaelis–Menten và logistic 4 tham số khớp trực tiếp bằng bình phương tối thiểu phi tuyến (không cần tuyến tính hoá như mục trên), kiểm bằng bộ Puromycin.

## Tài liệu gốc
- Chương 5_ Tương quan và hồi quy.xlsx
- Tham khảo trong file: https://online.stat.psu.edu/stat462/node/158/
