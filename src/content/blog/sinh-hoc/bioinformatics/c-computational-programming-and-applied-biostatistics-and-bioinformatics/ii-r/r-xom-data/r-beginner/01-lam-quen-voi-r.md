---
title: Tutorial
type: note
tags:
  - bioinformatics
  - computational-programming-and-applied-biostatistics-and-bioinformatics
  - r
section: Sinh học
folder: >-
  Sinh học / Bioinformatics / C - Computational Programming and Applied
  Biostatistics and Bioinformatics / II - R / R - Xóm Data / R Beginner
vaultPath: >-
  Resources/Sinh học/Bioinformatics/C - Computational Programming and Applied
  Biostatistics and Bioinformatics/II - R/R - Xóm Data/R Beginner/01 - Làm quen
  với R.md
url: /blog/lam-quen-voi-r/
topic: biology
updated: '2026-10-14'
source: 'https://xomdata.com/courses/r-beginner/lessons/1'
order: 1
description: >-
  R là ngôn ngữ lập trình chuyên dụng cho thống kê và phân tích dữ liệu, được
  tạo bởi Ross Ihaka và Robert Gentleman vào năm 1993. a. Tại sao cần R? R là
  ngôn ngữ 1 trong thống kê học thuật và rất phổ biến trong Data Analy
isIndex: false
---
R là ngôn ngữ lập trình chuyên dụng cho thống kê và phân tích dữ liệu, được tạo bởi Ross Ihaka và Robert Gentleman vào năm 1993.
## a. Tại sao cần R?
- R là ngôn ngữ #1 trong thống kê học thuật và rất phổ biến trong Data Analysis:
	- **Thống kê mạnh**: R có hàng nghìn package thống kê sẵn có
	- **Trực quan hóa**: ggplot2 là thư viện vẽ biểu đồ hàng đầu
	- **Miễn phí**: Open-source, cộng đồng lớn
	- **Dữ liệu**: Xử lý data frame rất tự nhiên
## b. Chương trình đầu tiên
- R có hai hàm in ra màn hình, và chúng **không giống nhau**. `print()` in kèm chỉ số `[1]` ở đầu dòng (đánh dấu vị trí phần tử — sẽ hiểu rõ khi học vector). `cat()` in "trần" đúng những gì bạn đưa vào — vì vậy các bài học ở đây dùng `cat()` là chính:
```r
print("Hello World")
cat("Hello, R!\n")
```
- **Bẫy hay gặp**: `cat()` KHÔNG tự xuống dòng. Thiếu `\n` ở cuối thì hai lần `cat()` liên tiếp sẽ in dính liền trên cùng một dòng:
```r
cat("A")
cat("B")
cat("\n")
cat("A\n")
cat("B\n")
```
- Kết quả:
![Ảnh chụp Màn hình 2026-07-22 lúc 22.52.50](/vault-assets/anh-chup-man-hinh-2026-07-22-luc-22-52-50-af2d18c9.png)
## c. Biến và phép gán '<-'
- R dùng mũi tên `<-` để gán giá trị vào biến — đọc là "nhận giá trị". Đây là điểm lạ mắt nhất với người đến từ Python/SQL:
```r
name <- "Alex"
age <- 25
height <- 1.75

cat("Name:", name, "\n")
cat("Age:", age, "\n")
cat("Height:", height, "m\n")
```
- Kết quả: 
![Ảnh chụp Màn hình 2026-07-22 lúc 22.53.45](/vault-assets/anh-chup-man-hinh-2026-07-22-luc-22-53-45-78027773.png)
- Chú ý `cat()` nhận **nhiều tham số, cách nhau dấu phẩy** và tự chèn 1 dấu cách giữa chúng.
- Dấu `=` cũng gán được, nhưng cộng đồng R quy ước: `<-` cho phép gán biến, `=` chỉ dùng khi truyền tham số vào hàm (vd `seq(0, 1, by = 0.2)`):
```r
x <- 10   # chuẩn R
y = 20    # chạy được, nhưng không phải phong cách R
cat(x + y, "\n")
```
	- Kết quả: 30
## d. Kiểu dữ liệu cơ bản
- R có 4 kiểu dữ liệu cơ bản. Hàm `class()` cho biết một biến thuộc kiểu nào:

|Kiểu|Ví dụ|Ý nghĩa|Hàm kiểm tra|
|---|---|---|---|
|numeric|`3.14`, `42`|Số (mặc định là số thực)|`is.numeric()`|
|character|`"Alex"`|Chuỗi ký tự|`is.character()`|
|logical|`TRUE` / `FALSE`|Đúng/sai — phải viết HOA|`is.logical()`|
|integer|`5L`|Số nguyên (hậu tố `L`)|`is.integer()`|
```r
number <- 42
name <- "Brian"
result <- TRUE

cat(class(number), "\n")
cat(class(name), "\n")
cat(class(result), "\n")
```
- Kết quả: 
![Ảnh chụp Màn hình 2026-07-22 lúc 22.55.16](/vault-assets/anh-chup-man-hinh-2026-07-22-luc-22-55-16-914e1de0.png)
- Lưu ý: `42` mặc định là `numeric` (số thực), không phải integer — R không phân biệt gắt như Python. Muốn integer thật sự phải viết `42L`.
## e. Chuyển đổi kiểu
- Họ hàm `as.*()` chuyển giá trị sang kiểu khác — cần thiết khi dữ liệu đọc vào ở dạng chuỗi nhưng muốn tính toán: (→ [Basic data types](/blog/basic-data-types/))
```r
x <- "123"
y <- as.numeric(x)
cat(y + 1, "\n")

z <- as.character(456)
cat(class(z), "\n")
```
- Kết quả: 
![Ảnh chụp Màn hình 2026-07-22 lúc 22.56.19](/vault-assets/anh-chup-man-hinh-2026-07-22-luc-22-56-19-bbdbf4e4.png)
- Chuyển thất bại (chuỗi không phải số) sẽ trả về `NA` — giá trị "thiếu" của R, sẽ học kỹ ở bài sau:
```r
bad <- as.numeric("hello")
cat(bad, "\n")
```
	- Kết quả: NA
## Lưu ý quan trọng
- Dùng `<-` để gán biến — `=` để truyền tham số hàm
- `cat()` in trần và cần `\n`; `print()` tự xuống dòng nhưng kèm `[1]`
- `TRUE`/`FALSE` phải viết HOA toàn bộ (`True` là lỗi)
- R phân biệt HOA/thường: `Name` khác `name`
- Comment dùng `#`
# 2. Vector - Nền tảng của R
Vector là cấu trúc dữ liệu cơ bản nhất trong R — mọi thứ trong R đều là vector. Một con số đơn lẻ thực chất là vector độ dài 1 (vì thế `print(42)` in `[1] 42` — số `[1]` chính là chỉ số phần tử đầu).
## a. Tạo vector
- `c()` (viết tắt của _combine_) ghép các giá trị thành vector. Ba hàm sinh dãy hay dùng: `1:10` (dãy nguyên liền kề), `seq()` (dãy có bước nhảy tuỳ chọn), `rep()` (lặp giá trị):
```r
score <- c(8, 7, 9, 6, 10)
students <- c("Chloe", "Daniel", "Emma")

x <- 1:10                 # 1 2 3 ... 10
y <- seq(0, 1, by = 0.2)  # 0.0 0.2 0.4 ... 1.0
z <- rep(0, 5)            # 0 0 0 0 0

cat("Scores:", score, "\n")
cat("x:", x, "\n")
cat("y:", y, "\n")
cat("z:", z, "\n")
```
- Kết quả: 
![Ảnh chụp Màn hình 2026-07-22 lúc 23.00.15](/vault-assets/anh-chup-man-hinh-2026-07-22-luc-23-00-15-8b8dbe8b.png)
- **Quan trọng**: vector chỉ chứa **một kiểu dữ liệu**. Nếu trộn số với chuỗi, R lặng lẽ chuyển tất cả thành chuỗi (coercion) — không báo lỗi:
```r
mixed <- c(1, "two", 3)
cat(class(mixed), "\n")
cat(mixed, "\n")
```
- Kết quả: ![Ảnh chụp Màn hình 2026-07-22 lúc 23.00.50](/vault-assets/anh-chup-man-hinh-2026-07-22-luc-23-00-50-1440ff0f.png)
## b. Truy cập phần tử - index từ 1
- R đánh chỉ số từ **1**, không phải 0 như Python. Dấu ngoặc vuông `[ ]` nhận một chỉ số, một dãy, hoặc một vector chỉ số:
```r
score <- c(8, 7, 9, 6, 10)

cat(score[1], "\n")            # phần tử đầu
cat(score[length(score)], "\n") # phần tử cuối
cat(score[2:4], "\n")          # từ vị trí 2 đến 4
cat(score[c(1, 3, 5)], "\n")   # chọn nhiều vị trí
cat(score[-1], "\n")           # dấu TRỪ = loại bỏ vị trí 1
```
- Kết quả: 
![Ảnh chụp Màn hình 2026-07-22 lúc 23.01.35](/vault-assets/anh-chup-man-hinh-2026-07-22-luc-23-01-35-4dc7c20f.png)
- Chú ý dòng cuối: `score[-1]` trong R nghĩa là "bỏ phần tử 1 đi" — hoàn toàn khác Python (nơi `[-1]` là phần tử cuối).
## c. Lọc theo điều kiện
- Đặt một biểu thức so sánh vào trong `[ ]` — R giữ lại các phần tử thỏa điều kiện. Đây là cách lọc dữ liệu phổ biến nhất trong R:
```r
score <- c(8, 7, 9, 6, 10)

cat(score >= 8, "\n")          # bước trung gian: vector TRUE/FALSE
cat(score[score >= 8], "\n")   # lọc: giữ nơi TRUE
cat(sum(score >= 8), "\n")     # đếm số phần tử thỏa (TRUE = 1)
```
- Kết quả: 
![Ảnh chụp Màn hình 2026-07-22 lúc 23.02.33](/vault-assets/anh-chup-man-hinh-2026-07-22-luc-23-02-33-3aba6654.png)
- Mẹo dòng cuối: `sum()` trên vector logic đếm số `TRUE` — vì R coi `TRUE` là 1, `FALSE` là 0.
## d. Vectorization - sức mạnh của R
- Phép toán trên vector tự áp dụng cho **từng phần tử** — không cần vòng lặp. Đây là điểm khác biệt lớn nhất giữa R và các ngôn ngữ thông thường:
```r
x <- c(1, 2, 3, 4, 5)

cat(x * 2, "\n")
cat(x + 10, "\n")
cat(x^2, "\n")
cat(sqrt(x), "\n")
```
- Kết quả: ![Ảnh chụp Màn hình 2026-07-22 lúc 23.04.15](/vault-assets/anh-chup-man-hinh-2026-07-22-luc-23-04-15-731b5239.png)
- Hai vector cùng độ dài thì tính theo cặp vị trí:
```r
price <- c(100, 200, 300)
quantity <- c(2, 1, 3)
cat(price * quantity, "\n")
```
- Kết quả: ```200 200 200```
## e. Recycling - quy tắc tái sử dụng
- Khi hai vector **khác độ dài**, R tự lặp lại vector ngắn cho đủ — gọi là _recycling_. Tiện khi cố ý, nguy hiểm khi vô tình:
```r
x <- c(1, 2, 3, 4, 5, 6)
y <- c(10, 20)
cat(x + y, "\n")   # y được lặp thành 10 20 10 20 10 20
```
- Kết quả: ```11 22 13 24 15 26```
- Nếu độ dài không chia hết cho nhau, R vẫn tính nhưng kèm cảnh báo — thấy warning "longer object length is not a multiple" thì gần như chắc chắn bạn đang cộng nhầm hai vector không khớp.
## d. Hàm thống kê
- Bộ hàm thống kê có sẵn — đầu vào là cả vector, đầu ra là 1 con số:

|Hàm|Ý nghĩa|Hàm|Ý nghĩa|
|---|---|---|---|
|`sum(x)`|Tổng|`min(x)`|Nhỏ nhất|
|`mean(x)`|Trung bình|`max(x)`|Lớn nhất|
|`median(x)`|Trung vị|`length(x)`|Số phần tử|
|`sd(x)`|Độ lệch chuẩn|`sort(x)`|Sắp xếp tăng dần|
```r
score <- c(8, 7, 9, 6, 10)

cat("Sum:", sum(score), "\n")
cat("Mean:", mean(score), "\n")
cat("Median:", median(score), "\n")
cat("Std dev:", round(sd(score), 2), "\n")
cat("Sorted:", sort(score), "\n")
cat("Top-down:", sort(score, decreasing = TRUE), "\n")
```
- Kết quả:
```r
Sum: 40 
Mean: 8 
Median: 8 
Std dev: 1.58 
Sorted: 6 7 8 9 10 
Top-down: 10 9 8 7 6
```
## Lưu ý quan trọng
- R index bắt đầu từ **1**; `x[-1]` là "bỏ phần tử 1", KHÔNG phải phần tử cuối
- Vector chỉ chứa **1 kiểu** — trộn kiểu là R âm thầm đổi hết thành chuỗi
- `sum(x > 5)` đếm số phần tử thỏa điều kiện — mẹo dùng rất thường xuyên
- Recycling tự lặp vector ngắn — tiện nhưng dễ giấu bug, để ý warning
- Hầu hết hàm R đều vectorized — nghĩ bằng vector trước khi nghĩ bằng vòng lặp
- Xem thêm: [Bài tập R cơ bản](/blog/bai-tap-r-co-ban-buoi-5-buoi-6-va-buoi-7/) – bài tập phép tính, biến, vector cơ bản (Homework)
