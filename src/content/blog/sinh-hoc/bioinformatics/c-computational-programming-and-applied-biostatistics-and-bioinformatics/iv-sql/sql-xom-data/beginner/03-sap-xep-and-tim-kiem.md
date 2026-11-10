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
  Biostatistics and Bioinformatics/IV - SQL/SQL - Xóm Data/Beginner/03 - Sắp xếp
  & Tìm kiếm.md
source: 'https://xomdata.com/courses/sql-beginner/lessons/1'
order: 3
description: >-
  -- Page 2: rows 6-10 SELECT FROM products LIMIT 5 OFFSET 5; Lưu ý quan trọng
  LIMIT luôn đặt sau ORDER BY LIMIT mà không có ORDER BY → kết quả không xác
  định thứ tự OFFSET bắt đầu từ 0 (dòng đầu tiên) 3. DISTINCT - Loại b
isIndex: false
---
## a. ORDER BY cơ bản
- Mặc định, SQL **không đảm bảo** thứ tự kết quả. Dùng `ORDER BY` để sắp xếp: (→ [Analyze Data to Answer Questions](/blog/sinh-hoc/bioinformatics/b-data-science-and-bioinformatics/i-data-science/05-analyze-data-to-answer-questions/))
```sql
SELECT full_name, salary
FROM employees
ORDER BY salary;
```
- Mặc định sắp xếp **tăng dần** (ASC).
## b. ASC và DESC
|Từ khóa|Ý nghĩa|Ví dụ|
|---|---|---|
|`ASC`|Tăng dần (mặc định)|A→Z, 1→9, cũ→mới|
|`DESC`|Giảm dần|Z→A, 9→1, mới→cũ|
```sql 
SELECT full_name, salary
FROM employees
ORDER BY salary DESC;
```
## c. Sắp xếp nhiều cột
```sql
SELECT full_name, department, salary
FROM employees
ORDER BY department ASC, salary DESC;
```
- Sắp xếp theo phòng ban A→Z, trong cùng phòng ban thì lương cao trước. (→ [Phân tích CSDL trên Excel](/blog/sinh-hoc/biology-project-and-lab-report/biostatistics-and-bioinformatics/04-phan-tich-co-so-du-lieu-tren-excel/))
## Lưu ý quan trọng
- `ORDER BY` luôn đặt **cuối** câu query
- NULL được coi là nhỏ nhất: xếp **đầu tiên** khi ASC, **cuối cùng** khi DESC (SQLite/MySQL)
- Có thể dùng **số thứ tự cột**: `ORDER BY 2 DESC` = sắp xếp theo cột thứ 2
# 2. LIMIT - Giới hạn kết quả
## a. LIMIT cơ bản
- Chỉ lấy N dòng đầu tiên:
```sql
SELECT * FROM products
LIMIT 5;
```
- Trả về tối đa 5 dòng.
## b. LIMIT + ORDER BY = Top N
- Đây là combo rất phổ biến — lấy "Top 3 lương cao nhất":
```sql 
SELECT full_name, salary
FROM employees
ORDER BY salary DESC
LIMIT 3;
```
- Hoặc "5 sản phẩm rẻ nhất":
```sql
SELECT product_name, price
FROM products
ORDER BY price ASC
LIMIT 5;
```
## c. OFFSET - Bỏ qua N dòng đầu
- Dùng cho phân trang (pagination):
```sql
-- Page 1: rows 1-5
SELECT * FROM products LIMIT 5 OFFSET 0;

-- Page 2: rows 6-10
SELECT * FROM products LIMIT 5 OFFSET 5;
```
## Lưu ý quan trọng 
- `LIMIT` luôn đặt **sau** `ORDER BY`
- `LIMIT` mà không có `ORDER BY` → kết quả **không xác định** thứ tự
- `OFFSET` bắt đầu từ 0 (dòng đầu tiên)
# 3. DISTINCT - Loại bỏ trùng lặp
## a. Vấn đề trùng lặp
- Khi lấy danh sách phòng ban:
```sql
SELECT department FROM employees;
```
- Kết quả có 30 dòng — mỗi phòng ban lặp lại nhiều lần!
![Ảnh chụp Màn hình 2026-07-15 lúc 21.59.16](/vault-assets/anh-chup-man-hinh-2026-07-15-luc-21-59-16-1ab2da09.png)
## b. DISTINCT cơ bản
- Thêm `DISTINCT` để chỉ lấy giá trị **duy nhất**: (→ [SQL Tutorial](/blog/sinh-hoc/bioinformatics/c-computational-programming-and-applied-biostatistics-and-bioinformatics/iv-sql/sql-tutorial/01-tutorial/))
```sql
SELECT DISTINCT department FROM employees;
```
- Kết quả chỉ còn 4 dòng: Engineering, Marketing, Sales, HR.
![Ảnh chụp Màn hình 2026-07-15 lúc 22.00.04](/vault-assets/anh-chup-man-hinh-2026-07-15-luc-22-00-04-ec4cc4b6.png)
## c. DISTINCT nhiều cột
```sql
SELECT DISTINCT department, position
FROM employees;
```
- Trả về các **cặp** phòng ban + chức vụ duy nhất. VD: (Engineering, Trưởng phòng) và (Engineering, Nhân viên) là 2 cặp khác nhau.
![Ảnh chụp Màn hình 2026-07-15 lúc 22.00.36](/vault-assets/anh-chup-man-hinh-2026-07-15-luc-22-00-36-97dada31.png)
## Lưu ý cơ bản
- `DISTINCT` đặt **ngay sau** `SELECT`
- `DISTINCT` áp dụng cho **toàn bộ** dòng, không phải từng cột
- NULL được coi là 1 giá trị duy nhất khi dùng DISTINCT
