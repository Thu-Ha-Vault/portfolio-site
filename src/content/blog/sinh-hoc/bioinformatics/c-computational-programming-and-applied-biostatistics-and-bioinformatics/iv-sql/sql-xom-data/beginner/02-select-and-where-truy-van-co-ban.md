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
  Biostatistics and Bioinformatics/IV - SQL/SQL - Xóm Data/Beginner/02 - SELECT
  & WHERE - Truy vấn cơ bản.md
url: /blog/select-and-where-truy-van-co-ban/
topic: biology
updated: '2026-10-14'
source: 'https://xomdata.com/courses/sql-beginner/lessons/1'
order: 2
description: >-
  -- More compact with IN SELECT fullname, department FROM employees WHERE
  department IN ('Engineering', 'Marketing', 'HR'); b. BETWEEN - Trong khoảng
  sql SELECT productname, price FROM products WHERE price BETWEEN 1000000
isIndex: false
---
## a. SELECT * - Lấy tất cả
- Câu lệnh cơ bản nhất trong SQL: (→ [SQL Tutorial](/blog/tutorial-biology-2/))
``` sql
SELECT * FROM employees;
```
- `SELECT` = lấy dữ liệu
- `*` = tất cả các cột
- `FROM employees` = từ bảng `employees`
Kết quả sẽ trả về **toàn bộ 30 dòng** với **7 cột** của bảng nhân viên.
## b. Chọn cột cụ thể
- Thay vì `*`, liệt kê tên cột cần lấy:
``` sql
SELECT full_name, department, salary
FROM employees;
```
Chỉ trả về 3 cột: họ tên, phòng ban, và lương.
**Lý do nên chọn cột cụ thể:**
- Kết quả gọn, dễ đọc
- Chạy nhanh hơn (quan trọng khi bảng có hàng triệu dòng)
- Không lộ thông tin nhạy cảm (VD: email)
## c. Thứ tự cột tuỳ chọn 
- Bạn có thể thay đổi thứ tự cột so với bảng gốc:
```sql
SELECT salary, full_name FROM employees;
```
Cột `salary` sẽ hiển thị trước `full_name`.
## Lưu ý quan trọng
- `SELECT *` tiện nhưng **không nên dùng** trong thực tế (chậm, lộ data)
- Tên cột **không cần** nháy đơn hay ngoặc kép
- Nhiều cột phân cách bằng **dấu phẩy** `,`
# 2. Lọc dữ liệu với WHERE
## a. WHERE - Lọc theo điều kiện
- Thêm `WHERE` để chỉ lấy dòng thỏa điều kiện:
```sql
SELECT full_name, salary
FROM employees
WHERE department = 'Engineering';
```
- Chỉ trả về nhân viên phòng Engineering.
## b. Toán tử so sánh
|Toán tử|Ý nghĩa|Ví dụ|
|---|---|---|
|`=`|Bằng|`salary = 20000000`|
|`!=` hoặc `<>`|Khác|`status != 'Cancelled'`|
|`>`|Lớn hơn|`salary > 20000000`|
|`>=`|Lớn hơn hoặc bằng|`salary >= 20000000`|
|`<`|Nhỏ hơn|`price < 10000000`|
|`<=`|Nhỏ hơn hoặc bằng|`price <= 10000000`|

## c. So sánh chuỗi
- Chuỗi (text) phải nằm trong **nháy đơn**:
```sql 
SELECT * FROM orders
WHERE status = 'Completed';
```
- **Lưu ý:** Chuỗi phân biệt chữ hoa/thường: `'Completed'` ≠ `'completed'`
## Lưu ý quan trọng
- `WHERE` luôn đặt **sau** `FROM`
- Chuỗi dùng **nháy đơn** `'...'`, không dùng nháy kép
- Số **không cần** nháy đơn: `salary > 20000000`
# 3. Kết hợp điều kiện với AND, OR,  NOT
## a. AND - Cả hai điều kiện đều đúng
```sql
SELECT full_name, position, salary
FROM employees
WHERE department = 'Engineering' AND salary > 20000000;
```
- Chỉ trả về nhân viên **vừa** thuộc phòng Engineering **vừa** có lương > 20 triệu.
## b. OR - Ít nhất một điều kiện đúng
```sql
SELECT full_name, department
FROM employees
WHERE department = 'Engineering' OR department = 'Marketing';
```
- Trả về nhân viên thuộc Engineering **hoặc** Marketing.
## c. NOT - phủ định
```sql 
SELECT full_name, department
FROM employees
WHERE NOT department = 'HR';
```
- Trả về nhân viên **không** thuộc phòng HR.
## d. Kết hợp AND và OR
- Khi kết hợp, dùng **ngoặc tròn** để rõ ràng:
```sql
SELECT full_name, department, salary
FROM employees
WHERE (department = 'Engineering' OR department = 'Marketing')
  AND salary > 20000000;
```
- Không có ngoặc, `AND` sẽ ưu tiên hơn `OR` — dễ gây nhầm lẫn!
## Lưu ý quan trọng
- `AND` ưu tiên hơn `OR` — luôn **dùng ngoặc** khi kết hợp (→ [Phân tích CSDL trên Excel](/blog/phan-tich-co-so-du-lieu/))
- Có thể dùng nhiều `AND`/`OR` liên tiếp: `WHERE a = 1 AND b = 2 AND c = 3`
# 4. Toán tử nâng cao
## a. IN - Thuộc danh sách
- Thay vì viết nhiều `OR`:
```sql
-- Verbose
SELECT full_name, department FROM employees
WHERE department = 'Engineering' OR department = 'Marketing' OR department = 'HR';

-- More compact with IN
SELECT full_name, department FROM employees
WHERE department IN ('Engineering', 'Marketing', 'HR');
```
## b. BETWEEN - Trong khoảng
```sql 
SELECT product_name, price
FROM products
WHERE price BETWEEN 10000000 AND 30000000;
```
- `BETWEEN` bao gồm **cả 2 đầu** (10 triệu ≤ giá ≤ 30 triệu).
## c. LIKE - Tìm kiếm mẫu
|Ký tự|Ý nghĩa|Ví dụ|
|---|---|---|
|`%`|Bất kỳ chuỗi nào|`'%Phone%'` → chứa "Phone"|
|`_`|Đúng 1 ký tự|`'_an'` → 3 ký tự, kết thúc bằng "an"|
```sql 
SELECT full_name FROM employees
WHERE full_name LIKE 'A%';
```
## d. IS NULL/IS NOT NULL
- NULL là "không có giá trị" — **không phải** số 0 hay chuỗi rỗng.
```sql 
-- Employees without an email
SELECT full_name FROM employees
WHERE email IS NULL;

-- Employees who already have an email
SELECT full_name FROM employees
WHERE email IS NOT NULL;
```
- **Quan trọng:** Dùng `IS NULL`, **không phải** `= NULL`!
## Lưu ý quan trọng
- `IN` = gọn hơn nhiều `OR`
- `BETWEEN a AND b` = bao gồm cả a và b
- `LIKE` phân biệt hoa/thường trong một số database
- `NULL` chỉ dùng `IS NULL` / `IS NOT NULL`, tuyệt đối không dùng `= NULL`
# 5. Biểu thức và Alias trong SELECT
## a. Biểu thức số học
- Bạn có thể tính toán date trong `SELECT`:
```sql
SELECT product_name, price, stock_quantity,
       price * stock_quantity
FROM products;
```
Cột mới `price * stock_quantity` là giá trị tồn kho. Nhưng tên cột sẽ hiển thị là `price * stock_quantity` — rất xấu!![Ảnh chụp Màn hình 2026-07-15 lúc 21.42.12](/vault-assets/anh-chup-man-hinh-2026-07-15-luc-21-42-12-af4fa0e5.webp)
## b. AS - Đặt tên cột 
- Dùng `AS` để đặt tên đẹp:
```sql
SELECT product_name,
       price * stock_quantity AS inventory_value
FROM products;
```
- Bây giờ cột hiển thị là `inventory_value` — gọn gàng và rõ nghĩa.
- Các phép toán có thể dùng: `+`, `-`, `*`, `/`
## c. ROUND - Làm tròn số 
```sql
SELECT product_name,
       ROUND(price / 1000000.0, 1) AS price_million
FROM products;
```
- `ROUND(giá_trị, số_chữ_số)` làm tròn `giá_trị` tới `số_chữ_số` chữ số thập phân — ví dụ `ROUND(2490000 / 1000000.0, 1)` = `2.5` (2.49 triệu làm tròn còn 1 chữ số thập phân).

<div class="callout callout-note">
<p class="callout-title">Chia hai số nguyên</p>

Trong SQLite, chia hai số nguyên cho ra **số nguyên**, phần thập phân bị cắt bỏ. `price / 1000000` sẽ ra `2` chứ không phải `2.49`, nên `ROUND(...)` không còn gì để làm tròn (kết quả chỉ là `2.0`). Hãy chia cho `1000000.0` (có dấu chấm thập phân) để giữ lại phần lẻ trước khi làm tròn.

</div>

## Lưu ý quan trọng
- `AS` chỉ đổi tên **hiển thị**, không thay đổi dữ liệu gốc
- Nếu alias có dấu cách, dùng ngoặc kép: `AS "Giá trị tồn kho"`
- Chia cho 0 sẽ trả về `NULL` trong SQLite
