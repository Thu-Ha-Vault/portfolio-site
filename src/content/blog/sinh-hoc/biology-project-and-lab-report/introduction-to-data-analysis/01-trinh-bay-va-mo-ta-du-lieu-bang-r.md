---
title: 'Chương 2: Trình bày và mô tả dữ liệu (thực hành R)'
type: course-note
tags:
  - data-analysis
  - r
  - data-visualization
  - descriptive-statistics
  - course-note
section: Sinh học
folder: Sinh học / Biology Project and Lab Report / Introduction to Data Analysis
vaultPath: >-
  Resources/Sinh học/Biology Project and Lab Report/Introduction to Data
  Analysis/01 - Trình bày và mô tả dữ liệu bằng R.md
order: 1
description: >-
  R Markdown thực hành chương 2 – Nguyễn Thị Thu Hà, 2/4/2022. Vẽ các loại biểu
  đồ cơ bản bằng base R graphics, phát hiện và loại bỏ outlier bằng boxplot/IQR,
  tính các giá trị đặc trưng của mẫu.
isIndex: false
---
> R Markdown thực hành chương 2 – Nguyễn Thị Thu Hà, 2/4/2022. Vẽ các loại biểu đồ cơ bản bằng **base R graphics**, phát hiện và loại bỏ **outlier** bằng boxplot/IQR, tính các giá trị đặc trưng của mẫu.

## Dữ liệu dùng trong bài
- Sinh dữ liệu giả lập 45 học sinh (đặt `set.seed(42)` để tái lập kết quả): giới tính, điểm toán (0–10, bước 0,5), cân nặng ~ $N(50, 6^2)$.
- Dataset có sẵn `mtcars` (`wt`: khối lượng xe, `mpg`: số dặm/gallon).

```r
set.seed(42)
gioi_tinh <- sample(c("Nam", "Nu"), 45, replace = TRUE)
diem_toan <- sample(seq(0, 10, 0.5), 45, replace = TRUE)
can_nang  <- rnorm(45, 50, 6)
du_lieu   <- data.frame(gioi_tinh, diem_toan, can_nang)
```

## Các loại biểu đồ
- **Biểu đồ cột** `barplot()`: từ vector số hoặc từ bảng tần số `table()` của biến định tính.
- **Cột chồng / cột kép**: `barplot(matrix)` cho cột chồng; thêm `beside = TRUE` cho cột kép (đặt cạnh nhau).
	- Ví dụ: chia điểm toán thành 4 mức xếp loại bằng `cut()`, rồi vẽ bảng chéo giới tính × xếp loại.
- **Histogram** `hist()`: phân bố của biến liên tục (cân nặng).
- **Biểu đồ tròn** `pie()`: tỷ lệ các nhóm.
- **Biểu đồ tán xạ** `plot(x, y)`; `plot(x, type = "l")` vẽ dạng đường.
- Xem thêm: [Visualizations](/blog/sinh-hoc/bioinformatics/c-computational-programming-and-applied-biostatistics-and-bioinformatics/ii-r/r-tutorial/09-visualizations/), [Share Data through the Art of Visualization](/blog/sinh-hoc/bioinformatics/b-data-science-and-bioinformatics/i-data-science/06-share-data-through-the-art-of-visualization/) – trực quan hoá dữ liệu trong R (R Tutorial) và nguyên tắc chọn, thiết kế biểu đồ (Google Data Analytics)

```r
xep_loai <- cut(du_lieu$diem_toan, breaks = c(0, 5, 6.5, 8, 10),
                labels = c("Yeu", "Trungbinh", "Kha", "Gioi"))
du_lieu$xep_loai <- xep_loai
barplot(table(du_lieu$gioi_tinh, du_lieu$xep_loai), beside = TRUE)
```

### Tuỳ chỉnh biểu đồ
- **Tiêu đề và nhãn**: `main` (tiêu đề chính), `xlab`, `ylab` (chú thích trục hoành/tung), `sub` (tiêu đề phụ).
- **Giới hạn trục**: `xlim`, `ylim`. **Màu**: `col` (xem các màu có thể dùng bằng `colors()`).
- **Chú thích** `legend(vi_tri, legend, fill)`: vị trí là toạ độ x, y hoặc `"topleft"`, `"topright"`, `"bottom"`, `"center"`…; `legend` là vector nội dung, `fill` là vector màu.

```r
barplot(c(2, 3, 4), ylim = c(0, 7), col = c("red", "blue", "green"))
legend("topleft", legend = c("Cột 1", "Cột 2", "Cột 3"),
       fill = c("red", "blue", "green"))
```

## Phát hiện quan sát bất thường (outlier)
- **Biểu đồ hộp** `boxplot()`: hộp từ $Q_1$ đến $Q_3$, vạch giữa là median; điểm nằm ngoài $[Q_1 - 1{,}5\,IQR;\ Q_3 + 1{,}5\,IQR]$ là outlier, với $IQR = Q_3 - Q_1$. (→ [Data Exploration Using Descriptive Statistics](/blog/sinh-hoc/biology-project-and-lab-report/introduction-to-data-analysis/05-data-exploration-using-descriptive-statistics/))
- Hai cách loại outlier rồi vẽ lại:

```r
# Cách 1: tự tính ngưỡng theo IQR
q_1 <- quantile(wt, 0.25)
q_3 <- quantile(wt, 0.75)
iqr <- q_3 - q_1
wt_no_out <- wt[wt >= q_1 - 1.5*iqr & wt <= q_3 + 1.5*iqr]

# Cách 2: lấy outlier do boxplot tính sẵn
outliers  <- boxplot(wt, plot = FALSE)$out
wt_no_out <- wt[!wt %in% outliers]
boxplot(wt_no_out)
```

## Tính các giá trị đặc trưng
- `summary(x)` (min, $Q_1$, median, mean, $Q_3$, max), `mean()`, `median()`, `max()`, `min()`, `var()` (phương sai mẫu, chia $n-1$), `sd()`. (→ [Đặc trưng thống kê mẫu (Excel)](/blog/sinh-hoc/biology-project-and-lab-report/biostatistics-and-bioinformatics/01-dac-trung-thong-ke-mau-va-uoc-luong-tham-so/), [Estimating the CDF](/blog/sinh-hoc/bioinformatics/a-statistics-and-biostatistics/ii-statistical-inference/02-estimating-the-cdf-and-statistical-functionals/))

## Tài liệu gốc
- Chuong2_Trinh_bay_va_mo_ta_du_lieu.Rmd
