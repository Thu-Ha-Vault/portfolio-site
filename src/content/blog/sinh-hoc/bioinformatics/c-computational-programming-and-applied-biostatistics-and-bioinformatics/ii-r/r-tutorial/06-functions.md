---
title: Functions
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
  Biostatistics and Bioinformatics/II - R/R - Tutorial/06 - Functions.md
url: /blog/functions/
topic: biology
updated: '2026-10-14'
order: 6
description: >-
  Ở phần trước, ta được hỏi là làm thế nào để chuyển cột smoker thành giá trị
  logical.
isIndex: false
---
## Basic functions (Lệnh cơ bản)

- Ở phần trước, ta được hỏi là làm thế nào để chuyển cột smoker thành giá trị logical.

- Chuyển ngày tháng (đang được lưu dưới dạng character) thành một dạng dễ sử dụng hơn không dễ và cần nhiều function hơn.

- R có rất nhiều function. Ta đã dùng một số read.csv(), class(), dim(), mean(), … Để tìm tài liệu về một function, dùng kí tự ? (→ Hàm & Xử lý chuỗi, [Bài tập R cơ bản](/blog/bai-tap-r-co-ban-buoi-5-buoi-6-va-buoi-7/))

- Các function được gợi nhớ bằng tên, với các argument được cung cấp trong dấu ngoặc.

- Ví dụ, lệnh chisq.test(): chạy một kiểm định Khi bình phương, yêu cầu một matrix hoặc hai vector là đối số và cung cấp một số tuỳ chọn được cài bởi người dùng.

- Nếu không có tham số nào được cung cấp, R sẽ dùng giá trị mặc định, trong một số trường hợp thì hoạt động bình thường. Trong các trường hợp khác, cần phải điều chỉnh các option để function hoạt động như mong muốn

## Combining functions (Kết hợp các lệnh)

- Cột birth.date đang được lưu dưới dạng character vector. Nhưng nếu ta muốn biết cân nặng của trẻ sinh vào tháng 11 thì sao, tách ngày, tháng và năm thành cột riêng. Đây là một bắt đầu tốt. Nhưng kết quả của lệnh là một list gồm 42 vector có length 3, trong khi đó các cột của birthweight là các vector có length 42

- List là một tập hợp có thứ tự của đối tượng, có thể dùng cho mọi type. Không giống như vector, list có thể chứa các phần tử có dạng khác nhau. Để subset list, dùng `$` hoặc `[[`.

- Dùng lệnh unlist() để làm “phẳng” list thành vector. Khi lệnh bị “nested”, lệnh ở trong cùng được thực hiện trước. Trong ví dụ này, lệnh unlist được áp dụng cho kết quả của lệnh strsplit(), chuyển list thành vector. Do kết quả mong muốn là tách 1 cột thành 3 cột, sự kết hợp của các lệnh này kém tác dụng.

- Ta cần dùng thêm một số lệnh cho mỗi item trong list.

## The apply() family of functions

- Đây là một trong các nhóm function hữu dụng nhất trong R. Nhóm lệnh này thực hiện một lệnh lên mỗi một phần tử trong cấu trúc dữ (→ Rẽ nhánh & Vòng lặp, [Bảng tra cứu lập trình](/blog/programming-bang-tra-cuu-lenh-r-sql-cong-cu-tin-sinh-va-hoa-chat/))

- Lệnh apply(): lấy một matrix, áp dụng một lệnh lên cột hoặc hàng và trả về 1 vector.

- Lệnh mapply(): lấy một lệnh và áp dụng cho các phần tử của 1 hay nhiều vector.

- Lệnh tapply(): lấy 2 vector, áp dụng function lên subset của vector thứ nhất dựa trên categories của vector thứ hai, trả về một bảng

- lapply(): lấy 1 list, áp dụng function cho mỗi phần tử và trả về một list

- sapply(): lấy 1 list, áp dụng function cho mỗi phần tử và trả về một list đã được đơn giản hoá nhất có thể

## Custom functions

- Nếu như ta muốn làm điều này với cả 3 trường nhưng không muốn code 3 lần.

![image_046](/vault-assets/image-046-114fedb6.webp)

- Lệnh cbind() dùng để ghép đối tượng theo cột. Sau khi có tháng sinh trong cùng một cột, ta có thể tính trung bình cân nặng khi sinh theo tháng.

## Exercise 3: summarizing the data

- Chọn một hoặc nhiều hơn trong các câu hỏi dưới đây để trả lời. Sau khi trả lời, tìm cách khác để có được đáp án.

- Trẻ sinh sớm thường có cân nặng khi sinh thấp?

- Tỷ lệ giữa mẹ hút thuốc và bố hút thuốc khi sinh sản tại mỗi bệnh viện

- Người mẹ cao cũng có bạn đời cao? Họ có trẻ dài hơn?

## Merging data frames

- Xem thêm: Tổng hợp dữ liệu – merge data frame
