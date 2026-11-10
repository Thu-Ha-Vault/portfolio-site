---
title: Importing and exporting data
type: note
tags:
  - bioinformatics
  - computational-programming-and-applied-biostatistics-and-bioinformatics
  - r
section: Sinh học
folder: >-
  Sinh học / Bioinformatics / C - Computational Programming and Applied
  Biostatistics and Bioinformatics / II - R / R - Tutorial
vaultPath: >-
  Resources/Sinh học/Bioinformatics/C - Computational Programming and Applied
  Biostatistics and Bioinformatics/II - R/R - Tutorial/03 - Importing and
  exporting data.md
order: 3
description: >-
  Khóa học này sẽ sử dụng một data set để trả lời một số câu hỏi sinh học đơn
  giản về “Ảnh hưởng của việc sử dụng thuốc lá ở mẹ trong thời kỳ mang thai”.
isIndex: false
---
- Khóa học này sẽ sử dụng một data set để trả lời một số câu hỏi sinh học đơn giản về “Ảnh hưởng của việc sử dụng thuốc lá ở mẹ trong thời kỳ mang thai”.

- Dữ liệu này là một bảng cân nặng của phụ huynh và trẻ sơ  được điều chỉnh từ data set được cung cấp bởi  Mathematics and Statistics Help at the University of Sheffield. Dữ liệu đã được sửa đổi một chút để có thể trình bày thêm một số function nhưng dữ liệu vẫn gần như không đổi

- Bất đầu bằng việc set up một thư mục làm việc (working directory) cho khoá học này.

- Để dễ dàng hơn, ta sẽ cài wd vào thư mục ta đã lưu notebook: Session > Set Working Directory > Choose Directory. Sau đó một dòng lệnh sẽ chạy trong console: ‘setwd("/Users/pc/Desktop/Sky/Intro_R")’. R đang chạy đoạn code này, trong tương lai, có thể dùng để set up thư mục làm việc bằng cách này.

- Download data sử dụng cho bài này: download.file("https://raw.githubusercontent.com/ucdavis-bioinformatics-training/2022_February_Introduction_to_R_for_Bioinformatics/main/birthweight.csv", "birthweight.csv")

## Import data using read.csv() (Nhập dữ liệu)

- Nhập dữ liệu thủ công thường tốn thời gian và dẫn đến nhiều lỗi. R có một số function để đọc dữ liệu với nhiều định dạng. Dữ liệu trong bài này là .csv: (→ [Tổng hợp dữ liệu](/blog/sinh-hoc/bioinformatics/c-computational-programming-and-applied-biostatistics-and-bioinformatics/ii-r/r-xom-data/r-beginner/05-tong-hop-du-lieu/))
birthweight <- read.csv("birthweight.csv")

- CSV: comma separated value, CSV file là một text file mà mỗi dòng trong file đại diện cho một hàng trong dữ liệu bảng, và các cột được ngăn cách bằng dấu phẩy. Dữ liệu trong file CSV bây giờ đã được lưu trữ trong biến “birthweight”

## Export data using write.csv() (Xuất dữ liệu)

- Trong khoá học về phân tích, ta sẽ thêm số liệu thống kê vào data set. Khi hoàn thành, ta sẽ muốn lưu các phân tích này. Để viết content của đối tượng birthweight vào một file CSV mới, ta có thể sử dụng write.csv() function: (→ [Thao tác dữ liệu trong R](/blog/sinh-hoc/biology-project-and-lab-report/introduction-to-data-analysis/02-cac-thao-tac-voi-du-lieu-trong-r/))
write.csv(birthweight, file = "new_birthweight.csv")

Giống như vậy, ta có thể dùng read.delim() và write.delim() để đọc và viết file tab-delimited, cột được ngăn cách bởi dấu tab.
