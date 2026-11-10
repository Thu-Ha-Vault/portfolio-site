---
title: Tutorial
type: note
tags:
  - bioinformatics
  - computational-programming-and-applied-biostatistics-and-bioinformatics
  - sql
section: Sinh học
folder: >-
  Sinh học / Bioinformatics / C - Computational Programming and Applied
  Biostatistics and Bioinformatics / IV - SQL / SQL - Xóm Data / Beginner
vaultPath: >-
  Resources/Sinh học/Bioinformatics/C - Computational Programming and Applied
  Biostatistics and Bioinformatics/IV - SQL/SQL - Xóm Data/Beginner/01 - Giới
  thiệu - Dữ liệu & Database.md
source: 'https://xomdata.com/courses/sql-beginner/lessons/1'
order: 1
description: >-
  Xem thêm: Ask questions to make Data-Driven decisions, Phân tích CSDL trên
  Excel – spreadsheet so với database; Database/Criterion Range trong Excel
isIndex: false
---
## a. Tại sao cần Database
- Hãy tưởng tượng bạn quản lý một cửa hàng online. Mỗi ngày có hàng trăm đơn hàng, hàng nghìn sản phẩm, và hàng nghìn khách hàng. Nếu dùng file Excel, bạn sẽ gặp vấn đề:
	- File nặng, mở chậm
	- Nhiều người không thể cùng sửa
	- Khó liên kết dữ liệu giữa các sheet
- **Database** giải quyết tất cả các vấn đề trên. Nó lưu trữ dữ liệu có cấu trúc, cho phép truy vấn nhanh và hỗ trợ nhiều người dùng cùng lúc. (→ [Database (SQL Tutorial)](/blog/sinh-hoc/bioinformatics/c-computational-programming-and-applied-biostatistics-and-bioinformatics/iv-sql/sql-tutorial/02-database/))
## b. Database vs Excel
| Tiêu chí         | Excel                  | Database                   |
| ---------------- | ---------------------- | -------------------------- |
| Dung lượng       | Giới hạn ~1 triệu dòng | Hàng tỷ dòng               |
| Tốc độ tìm kiếm  | Chậm khi file lớn      | Rất nhanh nhờ index        |
| Nhiều người dùng | Khó đồng bộ            | Hỗ trợ sẵn                 |
| Liên kết dữ liệu | Dùng VLOOKUP           | Dùng JOIN (mạnh hơn nhiều) |

- Xem thêm: [Ask questions to make Data-Driven decisions](/blog/sinh-hoc/bioinformatics/b-data-science-and-bioinformatics/i-data-science/02-ask-questions-to-make-data-driven-decisions/), [Phân tích CSDL trên Excel](/blog/sinh-hoc/biology-project-and-lab-report/biostatistics-and-bioinformatics/04-phan-tich-co-so-du-lieu-tren-excel/) – spreadsheet so với database; Database/Criterion Range trong Excel

## c. Bảng, dòng, cột
- Database lưu dữ liệu trong các **bảng** (table). Mỗi bảng gồm: (→ [Prepare Data for Exploration](/blog/sinh-hoc/bioinformatics/b-data-science-and-bioinformatics/i-data-science/03-prepare-data-for-exploration/))
	- **Cột** (column): Loại thông tin. VD: `full_name`, `salary`
	- **Dòng** (row): Một bản ghi cụ thể. VD: thông tin của nhân viên Henry Iverson
- Ví dụ bảng `employees`:

|id|full_name|department|salary|
|---|---|---|---|
|1|Henry Iverson|Engineering|35000000|
|2|Nguyễn Thị Hương|Marketing|15000000

## d. SQL là gì 

- **SQL** (Structured Query Language) là ngôn ngữ dùng để "nói chuyện" với database. Bạn viết câu lệnh SQL để:
	- **Truy vấn** dữ liệu: Lấy danh sách nhân viên
	- **Lọc** dữ liệu: Chỉ lấy nhân viên có lương > 20 triệu
	- **Sắp xếp**: Xếp theo lương giảm dần
	- **Tổng hợp**: Tính tổng lương theo phòng ban
- Một câu SQL đơn giản:
``` sql

SELECT full_name, salary FROM employees;
```
Câu lệnh trên lấy tên và lương của tất cả nhân viên.
## Lưu ý quan trọng
- SQL **không phân biệt** chữ hoa/thường: `SELECT` và `select` đều được
- Mỗi câu SQL nên kết thúc bằng dấu `;`
- Trong khóa học này, chúng ta sẽ **viết HOA** các từ khóa SQL (SELECT, FROM, WHERE...) để dễ phân biệt
# 2. Các bảng dữ liệu trong khoá học
## a. Sơ đồ Database
- Trong khóa học này, chúng ta sẽ làm việc với database của một **cửa hàng công nghệ** gồm 5 bảng:

```
category (5) ──► products (20)
customer (30) ──► orders (101)
employees (30) [independent]
```
## b. Bảng employees
- Lưu thông tin 30 nhân viên công ty:

|Cột|Kiểu|Mô tả|
|---|---|---|
|`id`|Số|Mã nhân viên|
|`full_name`|Chuỗi|Họ tên đầy đủ|
|`email`|Chuỗi|Email (có thể NULL)|
|`department`|Chuỗi|Engineering, Marketing, Sales, HR|
|`position`|Chuỗi|Manager, Team Lead, Staff|
|`salary`|Số|Lương tháng (VNĐ, có thể NULL)|
|`hire_date`|Ngày|Format YYYY-MM-DD

## c. Bảng products và category
- 20 sản phẩm công nghệ thuộc 5 danh mục:

| Danh mục     | Số sản phẩm |
| ------------ | ----------- |
| Phones       | 4           |
| Laptops      | 4           |
| Accessories  | 6           |
| Tablets      | 3           |
| Smartwatches | 3           |
- Bảng `products` có cột `stock_quantity` — một số sản phẩm hết hàng (= 0) hoặc chưa cập nhật (NULL).
## d. Bảng customer và orders.
- 30 khách hàng, 101 đơn hàng từ tháng 1 đến tháng 8/2024.
- Đơn hàng có 4 trạng thái: `Completed`, `Shipping`, `Pending`, `Cancelled`.
- Một số khách hàng có email/điện thoại bị NULL — đây là dữ liệu thực tế mà bạn sẽ gặp khi làm việc.
