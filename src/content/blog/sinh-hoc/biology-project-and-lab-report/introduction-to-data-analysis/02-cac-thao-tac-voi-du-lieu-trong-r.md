---
title: Các thao tác với dữ liệu trong R
type: course-note
tags:
  - data-analysis
  - r
  - data-wrangling
  - missing-data
  - course-note
section: Sinh học
folder: Sinh học / Biology Project and Lab Report / Introduction to Data Analysis
vaultPath: >-
  Resources/Sinh học/Biology Project and Lab Report/Introduction to Data
  Analysis/02 - Các thao tác với dữ liệu trong R.md
url: /blog/cac-thao-tac-voi-du-lieu-trong-r/
topic: biology
updated: '2026-10-14'
order: 2
description: >-
  R Markdown thực hành (Nguyễn Thị Thu Hà, 3/6/2022): nhập – xuất dữ liệu, mã
  hoá lại biến (factor, match, replace, cut), chuyển kiểu, trích dữ liệu con,
  sinh dữ liệu, xử lý dữ liệu thiếu và lập trình cơ bản (if, for, func
isIndex: false
---
> R Markdown thực hành (Nguyễn Thị Thu Hà, 3/6/2022): nhập – xuất dữ liệu, mã hoá lại biến (factor, match, replace, cut), chuyển kiểu, trích dữ liệu con, sinh dữ liệu, **xử lý dữ liệu thiếu** và lập trình cơ bản (if, for, function).

## Nhập – xuất dữ liệu
- Tạo data frame từ vector: `data.frame(age, insulin)`.
- Lưu object: `save(data, file = "Tuan4.rda")` (sau khi `setwd()`).
- Đọc file: `read.csv("dulieu2.csv")`, `read.table("chol1.csv", header = TRUE)`; xem bằng `View()`. (→ [Importing and exporting data](/blog/importing-and-exporting-data/))
- Lấy dataset từ package: `library(MASS); data(Boston); dim(Boston)` – chính là dữ liệu của [04 - Phân tích dữ liệu nhà ở Boston](/blog/tieu-luan-van-dung-r-phan-tich-du-lieu-nha-o-boston/).

## Mã hoá lại biến (recode)
- Ví dụ trên `mtcars`: biến `am` (0/1) → `"Automatic"`/`"Manual"`; biến `hp` → nhóm công suất L/M/H.

```r
df <- mtcars
# 1. factor với levels + labels
df$trans <- factor(df$am, levels = c(0, 1), labels = c("Automatic", "Manual"))
# 2. match: tra bảng giá trị cũ -> mới
df$trans2 <- factor(c("Automatic", "Manual"))[match(df$am, c("0", "1"))]
# 3. replace theo điều kiện
df$trans3 <- replace(df$am, df$am == 1, "Manual")
# 4. gán theo điều kiện logic
df$power[df$hp < 96.5] <- "L"
df$power[96.5 <= df$hp & df$hp <= 180] <- "M"
df$power[df$hp > 180] <- "H"
# 5. cut: chia khoảng
df$power2 <- cut(df$hp, breaks = c(-Inf, 96.5, 180, Inf), labels = c("L", "M", "H"))
```

## Chuyển đổi kiểu dữ liệu
- Số → factor: `factor(x)`; chỉ định thứ tự mức: `factor(x, levels = c("1", "0"))`. (→ [Basic data types](/blog/basic-data-types/))
- Số → character: `as.character()`; character → số: `as.numeric()`.
- **Factor → số phải qua character**: `as.numeric(as.character(f))` (nếu `as.numeric(f)` trực tiếp sẽ nhận mã thứ tự mức, không phải giá trị).
- Kiểm tra cấu trúc: `str(df)`. Sắp xếp vector: `sort(v, decreasing = TRUE)`.

## Trích dữ liệu con
- `subset(df, df$am == 1 & df$wt > 2)`. (→ [Phân tích CSDL trên Excel](/blog/phan-tich-co-so-du-lieu/))
- Chỉ số hàng/cột: `df[3, ]` (hàng 3), `df[, 3]` (cột 3), `df[c(1, 2, 3), c(4, 5, 6)]`, `df[df$am == 1, ]`. (→ [Data frames](/blog/data-frames/))

## Sinh dữ liệu
- `1:200`; `sample(c(2, 3, 4), size = 200, replace = TRUE)`; `sample(seq(1, 10, 0.5), 200, replace = TRUE)`; dữ liệu định tính `sample(c("Nam", "Nu"), 200, replace = TRUE)`.
- Theo phân phối: `rnorm(200)` rồi `hist()`.

## Xử lý dữ liệu thiếu (missing data)
- Dữ liệu bán hàng siêu thị `Train_UWu5bXk.csv` / `Test_u94Q5KV.csv`, đọc bằng `fread()` (gói *data.table*). (→ [Bảng tra cứu lập trình](/blog/programming-bang-tra-cuu-lenh-r-sql-cong-cu-tin-sinh-va-hoa-chat/))
- **Xoá hàng thiếu**: `na.omit(train)` (so sánh `dim()` trước – sau). (→ [Process data from Dirty to Clean](/blog/process-data-from-dirty-to-clean/))
- **Đếm giá trị thiếu theo cột**: `colSums(is.na(combi))` sau khi gộp train + test bằng `rbind` (thêm cột `Item_Outlet_Sales := NA` cho test).
- **Thay giá trị thiếu bằng trung bình theo nhóm** (cùng `Item_Identifier`):

```r
missing_index <- which(is.na(combi$Item_Weight))
for (i in missing_index) {
  item <- combi$Item_Identifier[i]
  combi$Item_Weight[i] <- mean(combi$Item_Weight[combi$Item_Identifier == item],
                               na.rm = TRUE)
}
colSums(is.na(combi))
```

## Lập trình cơ bản
- `if (a >= b) {...} else {...}`: so sánh trung bình hai vector. (→ Rẽ nhánh & Vòng lặp)
- Vòng `for` tính $\sum (x_i^2 + y_i)$ và đối chiếu với cách **vector hoá** `sum(x^2 + y)` (cùng kết quả, gọn hơn).
- Viết hàm: tính $\sum x_i^{\,i}$.

```r
tinhtong <- function(x) {
  tong <- 0
  for (i in 1:length(x)) tong <- tong + (x[i])^i
  return(tong)
}
tinhtong(c(2, 3, 4, 5))
```

- Lưu ý lỗi trong file gốc: `na.omit(choli)` (đúng là `chol1`); file `chol1.csv` không có trong thư mục dữ liệu.

## Tài liệu gốc
- Cac_thao_tac_voi_du_lieu.Rmd
