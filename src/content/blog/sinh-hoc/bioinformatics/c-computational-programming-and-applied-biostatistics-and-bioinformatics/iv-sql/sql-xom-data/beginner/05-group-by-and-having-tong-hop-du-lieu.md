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
  Biostatistics and Bioinformatics/IV - SQL/SQL - Xóm Data/Beginner/05 - GROUP
  BY & HAVING - Tổng hợp dữ liệu.md
url: /blog/group-by-and-having-tong-hop-du-lieu/
topic: biology
updated: '2026-10-14'
source: 'https://xomdata.com/courses/sql-beginner/lessons/1'
order: 5
description: >-
  strftime() là hàm ngày tháng của SQLite — chính là engine chạy trong sandbox
  của khóa này. Cùng việc đó, SQL Server dùng FORMAT(), MySQL dùng DATEFORMAT():
  cùng ý tưởng, khác tên. Hàm ngày tháng được học kỹ hơn ở khóa In
isIndex: false
---
## a. Tại sao cần GROUP BY
- Bạn muốn biết **tổng lương mỗi phòng ban**. Không thể dùng `SUM` đơn giản vì nó tính cho toàn bộ bảng.
- `GROUP BY` chia dữ liệu thành **nhóm** và áp dụng hàm aggregate cho **từng nhóm**. (→ [Analyze Data to Answer Questions](/blog/analyze-data-to-answer-questions/), [Introduction to tidyverse](/blog/introduction-to-tidyverse/), [Tổng hợp dữ liệu (R)](/blog/tong-hop-du-lieu/))
## b. GROUP BY cơ bản
```sql
SELECT department, SUM(salary) AS total_salary
FROM employees
GROUP BY department;
```
- Kết quả: 4 dòng — mỗi dòng là tổng lương của 1 phòng ban.
## c. GROUP BY + nhiều hàm
```sql
SELECT department,
       COUNT(*) AS num_emp,
       AVG(salary) AS avg_salary,
       MAX(salary) AS max_salary
FROM employees
GROUP BY department;
```
## d. Nhóm theo giá trị dẫn xuất
- Không phải lúc nào cột cần nhóm cũng có sẵn. Muốn xem **mỗi tháng có bao nhiêu đơn**, bảng chỉ có ngày đầy đủ (`2024-01-10`) chứ không có cột "tháng" — bạn phải rút phần tháng ra rồi nhóm theo nó.
- `GROUP BY` nhóm được theo **biểu thức**, không chỉ theo cột có sẵn:
```sql
SELECT strftime('%Y-%m', order_date) AS month,
       COUNT(*) AS num_orders
FROM orders
GROUP BY month;
```
- `strftime('%Y-%m', order_date)` biến `2024-01-10` thành `2024-01`. Mọi đơn trong cùng tháng cho ra cùng một giá trị → rơi vào cùng một nhóm.
- Đặt bí danh `AS month` rồi `GROUP BY month` cho gọn — SQLite chấp nhận bí danh trong `GROUP BY`.

<div class="callout callout-note">
<p class="callout-title">Về dialect</p>

`strftime()` là hàm ngày tháng của **SQLite** — chính là engine chạy trong sandbox của khóa này. Cùng việc đó, SQL Server dùng `FORMAT()`, MySQL dùng `DATE_FORMAT()`: cùng ý tưởng, khác tên. Hàm ngày tháng được học kỹ hơn ở khóa Intermediate.

</div>
## Lưu ý quan trọng
- Cột trong `SELECT` phải **nằm trong GROUP BY** hoặc **là hàm aggregate**
- `GROUP BY` đặt **sau** `WHERE` (nếu có)
- Có thể GROUP BY nhiều cột: `GROUP BY department, position`
# 2. HAVING - Lọc sau nhóm
## a. WHERE vs HAVING
|                     | WHERE               | HAVING                |
| ------------------- | ------------------- | --------------------- |
| Lọc                 | Dòng **trước** nhóm | Nhóm **sau** GROUP BY |
| Dùng hàm aggregate? | ❌ Không             | ✅ Có                  |
## b. HAVING CƠ BẢN
- Chỉ lấy phòng ban có **trên 3 nhân viên**:
```sql
SELECT department, COUNT(*) AS num_emp
FROM employees
GROUP BY department
HAVING COUNT(*) > 3;
```
## c. Kết hợp WHERE + GROUP BY + HAVING
```sql
SELECT department, AVG(salary) AS avg_salary
FROM employees
WHERE position = 'Staff'
GROUP BY department
HAVING AVG(salary) > 15000000;
```
1. `WHERE` lọc: chỉ nhân viên (không phải trưởng phòng/nhóm)
2. `GROUP BY` nhóm: theo phòng ban
3. `HAVING` lọc nhóm: chỉ phòng ban có lương TB > 15 triệu
## Lưu ý quan trọng
- Thứ tự luôn là: `WHERE` → `GROUP BY` → `HAVING`
- `HAVING` **bắt buộc** đi sau `GROUP BY`
- Nhớ: WHERE lọc **dòng**, HAVING lọc **nhóm**
# 3. Câu SELECT hoàn chỉnh
## a. Thứ tự viết câu SQL 
```sql 
SELECT column           -- 1. Choose columns
FROM table_name         -- 2. From which table
WHERE condition         -- 3. Filter rows
GROUP BY group_column   -- 4. Group
HAVING group_condition  -- 5. Filter groups
ORDER BY sort_column    -- 6. Sort
LIMIT n;                -- 7. Limit
```
## b. Thứ tự thực thi
```sql
SELECT column           -- 1. Choose columns
FROM table_name         -- 2. From which table
WHERE condition         -- 3. Filter rows
GROUP BY group_column   -- 4. Group
HAVING group_condition  -- 5. Filter groups
ORDER BY sort_column    -- 6. Sort
LIMIT n;                -- 7. Limit
```
- Đó là lý do bạn **không thể** dùng alias trong WHERE:
```sql
-- ❌ WRONG: the alias does not exist yet when WHERE runs
SELECT salary * 12 AS annual_salary
FROM employees
WHERE annual_salary > 300000000;

-- ✅ CORRECT: use the original expression
SELECT salary * 12 AS annual_salary
FROM employees
WHERE salary * 12 > 300000000;
```
## c. Ví dụ tổng hợp
- "Top 3 phòng ban có tổng lương cao nhất, chỉ tính nhân viên có lương":
```sql
SELECT department,
       COUNT(*) AS num_emp,
       SUM(salary) AS total_salary
FROM employees
WHERE salary IS NOT NULL
GROUP BY department
ORDER BY total_salary DESC
LIMIT 3;
```
## Lưu ý quan trọng
- Nhớ thứ tự: **S-F-W-G-H-O-L** (SELECT FROM WHERE GROUP HAVING ORDER LIMIT)
- Thứ tự thực thi khác thứ tự viết — điều này giải thích nhiều "lỗi lạ"
- Không phải câu nào cũng cần đủ 7 phần — chỉ dùng những gì cần thiết
