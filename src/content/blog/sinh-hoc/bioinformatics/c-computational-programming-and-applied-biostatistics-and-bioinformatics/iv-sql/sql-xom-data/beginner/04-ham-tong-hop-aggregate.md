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
  Biostatistics and Bioinformatics/IV - SQL/SQL - Xóm Data/Beginner/04 - Hàm
  tổng hợp (Aggregate).md
url: /blog/ham-tong-hop-aggregate/
topic: biology
updated: '2026-10-14'
source: 'https://xomdata.com/courses/sql-beginner/lessons/1'
order: 4
description: >-
  -- Most recently hired employee SELECT MAX(hiredate) AS latestdate FROM
  employees; Với chuỗi: MIN = sắp xếp A→Z lấy đầu, MAX = lấy cuối. Lưu ý quan
  trọng MIN và MAX dùng được cho cả số, chuỗi, và ngày Cả hai đều bỏ qua N
isIndex: false
---
## a. COUNT( * ) - Đếm tất cả các dòng
```sql
SELECT COUNT(*) AS total_employees
FROM employees;
```
- Kết quả: `30` — đếm tất cả dòng, kể cả dòng có NULL.
## b. COUNT (cột) - Đếm giá trị không NULL
```sql 
SELECT COUNT(email) AS has_email
FROM employees;
```
- Kết quả: `28` — chỉ đếm dòng có email (bỏ qua 2 dòng email = NULL).
## c. COUNT (DISTINCT cột)
```sql
SELECT COUNT(DISTINCT department) AS num_departments
FROM employees;
```
- Kết quả: `4` — đếm số phòng ban **không trùng lặp**.
## Lưu ý quan trọng
- `COUNT(*)` đếm **tất cả** dòng (kể cả NULL)
- `COUNT(cột)` **bỏ qua** dòng NULL ở cột đó
- Luôn dùng `AS` để đặt tên cột kết quả
# 2. SUM & AVG - Tổng và Trung bình
## a. SUM - Tính tổng
```sql
SELECT SUM(salary) AS total_salary
FROM employees;
```
- Tính tổng lương tất cả nhân viên.
## b. AVG - Tính trung bình
```sql
SELECT AVG(price) AS average_price
FROM products;
```
- Tính giá trung bình của tất cả sản phẩm.
- **Lưu ý:** `AVG` tự động bỏ qua NULL khi tính.
## c. Kết hợp với WHERE
```sql
SELECT SUM(total_amount) AS revenue,
       COUNT(*) AS num_orders
FROM orders
WHERE status = 'Completed';
```
- Tính doanh thu **chỉ** từ đơn hàng đã hoàn thành. (→ [Phân tích CSDL trên Excel](/blog/phan-tich-co-so-du-lieu/))
## Lưu ý quan trọng
- `SUM` và `AVG` chỉ dùng cho cột **số** (INTEGER, REAL)
- Cả hai đều **bỏ qua NULL** tự động
- Có thể dùng nhiều hàm trong cùng 1 SELECT (→ [Analyze Data to Answer Questions](/blog/analyze-data-to-answer-questions/))
# 3. MIN & MAX - Giá trị cực trị
## a. MIN - Giá trị nhỏ nhất
```sql 
SELECT MIN(price) AS lowest_price
FROM products;
```
## b. MAX - Giá trị lớn nhất
```sql
SELECT MAX(salary) AS highest_salary
FROM employees;
```
## c. MIN/MAX với chuỗi và ngày
- `MIN` và `MAX` cũng hoạt động với chuỗi và ngày:
```sql
-- Earliest hired employee
SELECT MIN(hire_date) AS earliest_date
FROM employees;

-- Most recently hired employee
SELECT MAX(hire_date) AS latest_date
FROM employees;
```
- Với chuỗi: `MIN` = sắp xếp A→Z lấy đầu, `MAX` = lấy cuối.
## Lưu ý quan trọng
- `MIN` và `MAX` dùng được cho **cả số, chuỗi, và ngày**
- Cả hai đều **bỏ qua NULL**
- Kết hợp nhiều hàm: `SELECT MIN(price), MAX(price), AVG(price) FROM products`
