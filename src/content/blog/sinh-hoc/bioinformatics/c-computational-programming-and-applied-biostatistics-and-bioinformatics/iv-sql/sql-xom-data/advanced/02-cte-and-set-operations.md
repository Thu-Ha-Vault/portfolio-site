---
title: Tutorial
type: note
tags:
  - computational-programming-and-applied-biostatistics-and-bioinformatics
  - sql
section: Sinh học
folder: >-
  Sinh học / Bioinformatics / C - Computational Programming and Applied
  Biostatistics and Bioinformatics / IV - SQL / SQL - Xóm Data / Advanced
vaultPath: >-
  Resources/Sinh học/Bioinformatics/C - Computational Programming and Applied
  Biostatistics and Bioinformatics/IV - SQL/SQL - Xóm Data/Advanced/02 - CTE &
  Set Operations.md
source: 'https://xomdata.com/courses/sql-advanced/lessons/1'
order: 2
description: UNION ALL
isIndex: false
---
## a. CTE là gì?
- CTE (Common Table Expression) là **bảng tạm** chỉ tồn tại trong query. Giống subquery nhưng **dễ đọc hơn nhiều**. (→ [Analyze Data to Answer Questions](/blog/sinh-hoc/bioinformatics/b-data-science-and-bioinformatics/i-data-science/05-analyze-data-to-answer-questions/))
## b. CTE cơ bản 
```sql
WITH doanh_thu_thang AS (
    SELECT strftime('%Y-%m', order_date) AS thang,
           SUM(total_amount) AS doanh_thu
    FROM orders
    WHERE status = 'Completed'
    GROUP BY thang
)
SELECT thang, doanh_thu
FROM doanh_thu_thang
WHERE doanh_thu > 50000000;
```
- `WITH tên AS (query)` = định nghĩa CTE
- Sau đó dùng `tên` như một bảng thường
## c. Nhiều CTE trong 1 query
```sql
WITH
cte1 AS (SELECT ...),
cte2 AS (SELECT ... FROM cte1)
SELECT * FROM cte2;
```
- CTE sau có thể tham chiếu CTE trước — rất mạnh cho query phức tạp.
## Lưu ý quan trọng
- CTE giúp code SQL **dễ đọc** và **dễ debug** hơn subquery lồng nhau
- CTE chỉ tồn tại trong **1 câu query** — không phải bảng vĩnh viễn
- Có thể tham chiếu CTE nhiều lần trong cùng query (subquery thì không)
# 2. UNION, INTERSECT, EXCEPT
## a. UNION - Gộp kết quả
```sql
SELECT full_name, 'Employee' AS role_type FROM employees
UNION
SELECT full_name, 'Customer' AS role_type FROM customers;
```
- UNION gộp kết quả 2 query và **loại bỏ trùng lặp**.
## b. UNION ALL - Gộp không loại trùng
- Giống UNION nhưng **giữ lại** dòng trùng. Nhanh hơn UNION.
## c. INTERSECT - Giao nhau
- Chỉ trả về dòng **xuất hiện ở cả 2** query.
## d. EXCEPT - Loại trừ
- Trả về dòng **chỉ có ở query 1** mà không có ở query 2.
```sql
-- Customers who have placed an order but have NEVER written a review
SELECT customer_id FROM orders
EXCEPT
SELECT customer_id FROM reviews;
```
## e. Hiệu năng - Vì sao UNION chậm hơn UNION ALL?
- `UNION` thực chất là `UNION ALL` cộng thêm một bước khử trùng lặp. Bước đó không miễn phí: muốn biết dòng nào trùng, database phải đem toàn bộ kết quả sau khi gộp đi sort hoặc dựng hash table rồi so từng dòng. Gộp hai bảng 1 triệu dòng nghĩa là sort/hash 2 triệu dòng — tốn cả CPU lẫn RAM, và dữ liệu càng lớn thì khoảng cách với `UNION ALL` càng rộng.
- `UNION ALL` thì chỉ nối kết quả nhánh dưới vào nhánh trên rồi trả ra luôn, gần như không có chi phí phụ.
- Chạy thử để thấy khác biệt ngay trên dữ liệu của bài:
```sql
SELECT 'UNION' AS op, COUNT(*) AS rows_returned FROM (
  SELECT customer_id FROM orders
  UNION
  SELECT customer_id FROM reviews
)
UNION ALL
SELECT 'UNION ALL', COUNT(*) FROM (
  SELECT customer_id FROM orders
  UNION ALL
  SELECT customer_id FROM reviews
);
```
- Cùng một phép gộp nhưng trên dữ liệu mẫu của bài, `UNION` trả về 30 dòng còn `UNION ALL` trả về 151 — hơn 120 dòng trùng đã bị khử, và database phải trả chi phí so khớp cho từng dòng đó.
- Kinh nghiệm chọn:
	- Hai nhánh **không thể trùng nhau** (VD gộp đơn hàng năm 2024 với năm 2025 — mỗi đơn chỉ nằm một năm) → dùng `UNION ALL`; bật khử trùng lúc này là trả tiền cho việc không cần làm.
	- Thật sự cần kết quả duy nhất → `UNION`, chấp nhận chi phí.
	- `INTERSECT` và `EXCEPT` cũng làm việc trên tập hợp nên mang chi phí khử trùng tương tự — và đa số database (SQLite, SQL Server) không có bản "ALL" cho hai toán tử này.
## Lưu ý quan trọng
- Tất cả set operations yêu cầu **cùng số cột** và **cùng kiểu dữ liệu**
- `UNION` loại trùng (chậm hơn), `UNION ALL` giữ trùng (nhanh hơn)
- Thứ tự quan trọng: `A EXCEPT B` ≠ `B EXCEPT A`
# 3. WITH RECURSIVE - CTE đệ quy
## a. Khi nào cần đệ quy?
- CTE thường chỉ chạy **một lần**. Nhưng có loại dữ liệu **phân cấp** (dạng cây) mà ta không biết trước độ sâu:
	- Cây quản lý: nhân viên → quản lý → quản lý của quản lý...
	- Danh mục lồng nhau: category cha → con → cháu...
	- Chuỗi phụ thuộc: task A cần B, B cần C...
- Để duyệt hết mọi cấp như vậy, dùng **CTE đệ quy** (`WITH RECURSIVE`) — một CTE **tự tham chiếu chính nó** cho đến khi không còn dòng mới.
## b. Cấu trúc WITH RECURSIVE
- Một CTE đệ quy gồm **2 phần** nối bằng `UNION ALL`:
```sql
WITH RECURSIVE cte_name AS (
    -- 1) Anchor: the starting point, runs once
    SELECT ...

    UNION ALL

    -- 2) Recursive step: JOIN back to cte_name itself
    SELECT ...
    FROM some_table t
    JOIN cte_name r ON t.parent_col = r.child_col
)
SELECT * FROM cte_name;
```
- **Anchor** chạy trước, tạo tập kết quả ban đầu.
- **Bước đệ quy** lấy kết quả vòng trước (tham chiếu lại `cte_name`) để tìm dòng tiếp theo.
- Engine lặp bước đệ quy đến khi **không sinh thêm dòng mới** → tự dừng.
## c. Ví dụ: cây quản lý nhân viên
- Bảng `employees` có cột `manager_id` trỏ về `id` của người quản lý. Tìm toàn bộ cấp dưới (trực tiếp + gián tiếp) của manager `id = 1`:
```sql
WITH RECURSIVE subs AS (
    -- Anchor: DIRECT subordinates of manager id = 1
    SELECT id, full_name, 1 AS level
    FROM employees
    WHERE manager_id = 1

    UNION ALL

    -- Recursive step: subordinates of the people just found
    SELECT e.id, e.full_name, s.level + 1
    FROM employees e
    JOIN subs s ON e.manager_id = s.id
)
SELECT id, full_name, level
FROM subs
ORDER BY level, id;
```
- Vòng 1 (anchor): lấy người có `manager_id = 1` → gán `level = 1`.
- Vòng 2: lấy người báo cáo cho nhóm vừa tìm → `level = 2`.
- ... lặp đến khi không còn cấp dưới nào.
Cột `level` tăng dần qua mỗi vòng, cho biết độ sâu của nhân viên trong cây.
## d. Tránh vòng lặp vô hạn
Nếu dữ liệu có **chu trình** (A là cấp dưới B, B lại là cấp dưới A) thì đệ quy chạy mãi không dừng. Phòng tránh:
- Đảm bảo cây dữ liệu **không có vòng** — mỗi node chỉ có một cha.
- Thêm cột đếm độ sâu và điều kiện `WHERE level < N` để chặn cứng.
## Lưu ý quan trọng
- `WITH RECURSIVE` = **anchor** `UNION ALL` **bước đệ quy** (tự tham chiếu CTE).
- Anchor chạy 1 lần làm điểm khởi đầu; bước đệ quy lặp đến khi không còn dòng mới thì dừng.
- Dùng cho dữ liệu **phân cấp/cây**: sơ đồ tổ chức, danh mục lồng nhau, chuỗi phụ thuộc.
- Cẩn thận với dữ liệu có chu trình → chặn bằng giới hạn độ sâu.
