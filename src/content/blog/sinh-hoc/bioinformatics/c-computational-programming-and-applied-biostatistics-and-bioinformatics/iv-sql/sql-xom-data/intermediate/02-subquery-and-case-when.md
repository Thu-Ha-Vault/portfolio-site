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
  Biostatistics and Bioinformatics / IV - SQL / SQL - Xóm Data / Intermediate
vaultPath: >-
  Resources/Sinh học/Bioinformatics/C - Computational Programming and Applied
  Biostatistics and Bioinformatics/IV - SQL/SQL - Xóm Data/Intermediate/02 -
  Subquery & CASE WHEN.md
url: /blog/subquery-and-case-when/
topic: biology
updated: '2026-10-14'
source: 'https://xomdata.com/courses/sql-intermediate'
order: 2
description: '-- Get the month strftime(''%m'', orderdate) -- ''06'''
isIndex: false
---
## a. Subquery là gì?
- Subquery là **query nằm trong query khác**. Query bên trong chạy trước, kết quả được dùng cho query bên ngoài. (→ [Analyze Data to Answer Questions](/blog/analyze-data-to-answer-questions/))
## b. Subquery trong WHERE
- Tìm nhân viên có lương **cao hơn trung bình**:
```sql
SELECT full_name, salary
FROM employees
WHERE salary > (SELECT AVG(salary) FROM employees);
```
- Subquery `(SELECT AVG(salary) FROM employees)` trả về 1 giá trị → dùng với `>`, `<`, `=`.
## c. Subquery với IN
- Tìm khách hàng đã **mua sản phẩm danh mục Laptop**:
```sql
SELECT DISTINCT k.full_name
FROM customers k
INNER JOIN orders d ON k.id = d.customer_id
INNER JOIN order_details ct ON d.id = ct.order_id
WHERE ct.product_id IN (
    SELECT id FROM products WHERE category_id = 2
);
```
- Subquery trả về **nhiều giá trị** → dùng với `IN`.
## Lưu ý quan trọng
- Subquery trả về 1 giá trị → dùng `=`, `>`, `<`
- Subquery trả về nhiều giá trị → dùng `IN`
- Subquery **luôn** nằm trong ngoặc `()`
# 2. CASE WHEN - Phân nhánh điểm
## a. CASE WHEN cơ bản
- Giống `IF-ELSE` trong lập trình:
```sql
CASE
    WHEN condition_1 THEN result_1
    WHEN condition_2 THEN result_2
    ELSE default_result
END
```
## b. CASE WHEN trong SELECT
- Phân loại lương:
```sql
SELECT full_name, salary,
    CASE
        WHEN salary >= 30000000 THEN 'High'
        WHEN salary >= 20000000 THEN 'Medium'
        ELSE 'Low'
    END AS salary_level
FROM employees;
```
## c. CASE WHEN + GROUP BY
- Đếm nhân viên theo mức lương:
```sql
SELECT
    CASE
        WHEN salary >= 30000000 THEN 'High'
        WHEN salary >= 20000000 THEN 'Medium'
        ELSE 'Low'
    END AS salary_level,
    COUNT(*) AS num_emp
FROM employees
WHERE salary IS NOT NULL
GROUP BY salary_level;
```
## Lưu ý quan trọng
- Luôn có `END` để kết thúc CASE
- `ELSE` là tùy chọn — nếu không có, mặc định trả về NULL
- CASE WHEN kiểm tra **theo thứ tự** — dừng ở điều kiện đầu tiên đúng
# 3. Hàm chuỗi và ngày tháng
## a. Hàm chuỗi

|Hàm|Mô tả|Ví dụ|
|---|---|---|
|`UPPER(s)`|Chữ hoa|`UPPER('abc')` → `'ABC'`|
|`LOWER(s)`|Chữ thường|`LOWER('ABC')` → `'abc'`|
|`LENGTH(s)`|Độ dài|`LENGTH('Hello')` → `5`|
|`SUBSTR(s, start, len)`|Cắt chuỗi|`SUBSTR('Hello', 1, 3)` → `'Hel'`|
|`REPLACE(s, old, new)`|Thay thế|`REPLACE('a-b', '-', '_')` → `'a_b'`|
## b. Hàm ngày tháng
- SQLite lưu ngày dạng TEXT `'YYYY-MM-DD'`. Dùng `strftime` để trích xuất:
```sql
-- Get the year
strftime('%Y', order_date)         -- '2024'

-- Get the month
strftime('%m', order_date)         -- '06'

-- Get year-month
strftime('%Y-%m', order_date)      -- '2024-06'
```
## c. COALESCE - Thay thế NULL
```sql
SELECT full_name,
       COALESCE(email, 'No email') AS email
FROM employees;
```
- `COALESCE(a, b)` trả về `a` nếu `a` khác NULL, ngược lại trả về `b`. (→ [Process data from Dirty to Clean](/blog/process-data-from-dirty-to-clean/))
## Lưu ý quan trọng
- Nối chuỗi SQLite dùng `||`, **không phải** `CONCAT()`
- `strftime` trả về **TEXT** — có thể dùng GROUP BY
- `COALESCE` có thể nhận nhiều tham số: `COALESCE(a, b, c)` — trả về giá trị đầu tiên khác NULL
# 4. EXISTS & NOT EXISTS
## a. EXISTS là gì?
- `EXISTS` kiểm tra: subquery có trả về **ít nhất 1 dòng** không?
```sql
SELECT k.full_name
FROM customers k
WHERE EXISTS (
    SELECT 1 FROM orders d
    WHERE d.customer_id = k.id
);
```
- Trả về khách hàng **đã từng đặt hàng**.
## b. NOT EXISTS - Tìm "không có"
```sql
SELECT sp.product_name
FROM products sp
WHERE NOT EXISTS (
    SELECT 1 FROM reviews dg
    WHERE dg.product_id = sp.id
);
```
- Tìm sản phẩm **chưa có đánh giá nào**.
## c. EXISTS vs IN - Khi nào dùng?
|           | EXISTS                        | IN                     |
| --------- | ----------------------------- | ---------------------- |
| Dùng khi  | Subquery lớn                  | Subquery nhỏ           |
| Hiệu suất | Nhanh hơn với bảng lớn        | OK với bảng nhỏ        |
| Đặc điểm  | Dừng date khi tìm thấy 1 dòng | Phải chạy hết subquery |
## Lưu ý quan trọng
- `SELECT 1` trong EXISTS là convention — giá trị không quan trọng
- NOT EXISTS thường **thay thế** được LEFT JOIN ... WHERE IS NULL
- EXISTS tham chiếu cột bảng ngoài → gọi là **correlated subquery**
