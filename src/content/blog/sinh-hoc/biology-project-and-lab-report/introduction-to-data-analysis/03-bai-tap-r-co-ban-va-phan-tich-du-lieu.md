---
title: 'Bài tập R: cơ bản, buổi 5, buổi 6 và buổi 7'
type: course-note
tags:
  - data-analysis
  - r
  - exercises
  - course-note
section: Sinh học
folder: Sinh học / Biology Project and Lab Report / Introduction to Data Analysis
vaultPath: >-
  Resources/Sinh học/Biology Project and Lab Report/Introduction to Data
  Analysis/03 - Bài tập R cơ bản và phân tích dữ liệu.md
order: 3
description: >-
  Gộp 4 file R Markdown bài tập ngắn: Homework (2/22/2022 – phép tính cơ bản),
  Buổi 5 (dữ liệu WHO1; header ghi tác giả Vũ Ngọc Bình – giảng viên), Buổi 6
  (3/20/2022 – datasets có sẵn của R), Buổi 7 (chữa bài – lập trình h
isIndex: false
---
> Gộp 4 file R Markdown bài tập ngắn: **Homework** (2/22/2022 – phép tính cơ bản), **Buổi 5** (dữ liệu WHO1; header ghi tác giả Vũ Ngọc Bình – giảng viên), **Buổi 6** (3/20/2022 – datasets có sẵn của R), **Buổi 7** (chữa bài – lập trình hàm và Stat2Data). Các file chỉ có code, không lưu output nên không có số liệu kết quả.

## Homework: Bài tập cơ bản về R
- **Bài 1** – R như máy tính: `24^4`, `sqrt(321)`, `pi^2/32`, `exp(3)`, `log10(543)`, `log(123)` (log tự nhiên).
- **Bài 2** – hàm trên vector `x <- c(31, 52, 37, 21, 24, 19, 23, 43, 21)`: `sum(x)`, `sum(x^2)`, `mean(x)`, `length(x)`, `sort(x, decreasing = TRUE/FALSE)`, `max()`, `min()`. (→ [Làm quen với R](/blog/sinh-hoc/bioinformatics/c-computational-programming-and-applied-biostatistics-and-bioinformatics/ii-r/r-xom-data/r-beginner/01-lam-quen-voi-r/))

## Buổi 5: Dữ liệu WHO1
- Dữ liệu 194 quốc gia (đề ghi 195): dân số, tỷ lệ < 15 và > 60 tuổi, tỷ lệ sinh sản, tuổi thọ, tử vong trẻ em, tỷ lệ biết đọc viết, **GNI**. Phân nhóm: GNI > 20 nghìn → phát triển; 10–20 nghìn → đang phát triển; < 10 nghìn → chưa phát triển.
- **a.** Thay giá trị trống bằng **median** của cột:

```r
who1 <- read.csv("WHO1.csv", header = TRUE)
who1[is.na(who1$GNI..Thunhapquocdan.), ]$GNI..Thunhapquocdan. =
  median(who1$GNI..Thunhapquocdan., na.rm = TRUE)
# làm tương tự cho FertilityRate và LiteracyRate
print(colSums(is.na(who1)))
```

- **b–c.** Trích theo tên nước: `who1[who1$Country == "Bahrain", ]$LifeExpectancy..Tuoitho.` (so sánh tuổi thọ Bahrain – Mexico; tỷ lệ sinh của Canada).
- **d.** Thêm cột nhóm bằng `cut(GNI, breaks = c(0, 10000, 20000, 90000), labels = c("Chưa phát triển", "Đang phát triển", "Phát triển"))` → tra nhóm của China.
- **e–f.** Viết hàm tìm nước có dân số lớn nhất (`max()` rồi lọc) và hàm trả về nhóm của một nước (`nhom("Viet Nam")`). (→ [Hàm & Xử lý chuỗi](/blog/sinh-hoc/bioinformatics/c-computational-programming-and-applied-biostatistics-and-bioinformatics/ii-r/r-xom-data/r-beginner/04-ham-and-xu-ly-chuoi/), [Functions](/blog/sinh-hoc/bioinformatics/c-computational-programming-and-applied-biostatistics-and-bioinformatics/ii-r/r-tutorial/06-functions/))
- **g.** Hàm tính tuổi thọ trung bình của từng nhóm nước.
- Lưu ý: `read.csv` tự đổi tên cột có dấu cách/ngoặc thành dạng `GNI..Thunhapquocdan.`.

## Buổi 6: Các thao tác cơ bản với datasets có sẵn
- **AirPassengers** (chuỗi thời gian số hành khách theo tháng): đổi thành ma trận năm × tháng `matrix(AirPassengers, ncol = 12, byrow = TRUE)` → TB tháng 1 (`mean(data1[, 1])`), TB theo năm (`rowSums`), TB theo tháng (`colSums / 12`).
- **ChickWeight**: số gà mỗi chế độ ăn (lọc `Time == 0`), mean/var cân nặng ngày 0, cân nặng gà số 42 theo thời gian, mean/sd ngày 21 theo 4 chế độ ăn.
- **chickwts**: mean/var của 71 con gà, rồi theo từng loại thức ăn (horsebean, linseed, soybean, sunflower, meatmeal, casein) bằng vòng `for`.
- **iris**: chiều dài cánh hoa (`Petal.Length`) trung bình chung và theo từng loài (setosa, versicolor, virginica).
- **sleep**: thời gian ngủ tăng thêm trung bình của 2 nhóm thuốc.

```r
chick_weight_21 <- function(diet_number) {
  chick <- ChickWeight[ChickWeight$Diet == diet_number & ChickWeight$Time == 21, ]
  print(mean(chick$weight))
  print(sd(chick$weight))
}
for (d in 1:4) chick_weight_21(d)
```

- Gợi ý: các phép "tính theo nhóm" này có thể viết gọn bằng `tapply(chickwts$weight, chickwts$feed, mean)` hoặc `aggregate()`. (→ [Tổng hợp dữ liệu](/blog/sinh-hoc/bioinformatics/c-computational-programming-and-applied-biostatistics-and-bioinformatics/ii-r/r-xom-data/r-beginner/05-tong-hop-du-lieu/))

## Buổi 7: Lập trình hàm và phân tích dữ liệu Stat2Data
### Bài tập lập trình (vòng `while`, ` 10   # lấy chữ số cuối
    n <- n %/% 10            # bỏ chữ số cuối
  }
  return(tong)
}
bai_4(1234)  # 10
```

### Bài tập phân tích dữ liệu (gói Stat2Data)
- **AHCAvote2017** (phiếu bầu đạo luật y tế AHCA 2017 của Hạ viện Mỹ): số thành viên theo bang và theo đảng (`table()`); bảng tần số chéo phiếu AHCA × kết quả bầu Trump/Clinton (đổi mã 0/1 thành nhãn bằng `factor`); khu vực có tỷ lệ không bảo hiểm y tế cao/thấp nhất năm 2013, 2015. (→ [[02 - Kiểm định giả thiết thống kê|Kiểm định giả thiết thống kê]])
- **BirdNest**: bảng tần số số loài chim theo kiểu tổ (`Nesttype`) và vị trí làm tổ (`Location`); loài có chiều dài lớn nhất/nhỏ nhất; thời gian chăm chim non trung bình `mean(Totcare, na.rm = TRUE)`.
- Xem thêm: [[07 - Introduction to Data Analysis Using Python|Introduction to Data Analysis Using Python]] – khoá Google Data Analytics Course 7 (Python), có phần giới thiệu R và so sánh Python với R

## Tài liệu gốc
- [[Homework.Rmd]]
- [[Bai_tap_buoi_5.Rmd]] – dữ liệu [[WHO1.csv]]
- [[Bai_tap_buoi_6.Rmd]]
- [[Bai_tap_buoi_7.Rmd]]
