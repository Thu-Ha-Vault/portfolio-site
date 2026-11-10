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
  Biostatistics and Bioinformatics/IV - SQL/SQL - Xóm Data/Advanced/01 - Window
  Functions.md
url: /blog/window-functions/
topic: biology
updated: '2026-10-14'
source: 'https://xomdata.com/courses/sql-advanced/lessons/1'
order: 1
isIndex: false
---
## a. Window Functions là gì?
- Window Functions tính toán trên **một tập hợp dòng** liên quan đến dòng hiện tại — nhưng **không gộp** các dòng lại.
- GROUP BY gộp 28 dòng thành 4 nhóm → trả về 4 dòng. Window Functions giữ nguyên 28 dòng và **thêm cột** kết quả.
## b. OVER() - Cửa sổ toàn bộ
```sql
SELECT full_name, salary,
       SUM(salary) OVER () AS tong_salary_cty
FROM employees
WHERE salary IS NOT NULL;
```
- Mỗi dòng đều hiển thị `tong_salary_cty` — cùng giá trị cho mọi dòng.
## c. PARTITION BY - Chia nhóm
```sql
SELECT full_name, department, salary,
       AVG(salary) OVER (PARTITION BY department) AS salary_tb_pb
FROM employees
WHERE salary IS NOT NULL;
```
- `PARTITION BY department` chia thành các "cửa sổ" theo phòng ban. Mỗi nhân viên thấy lương TB **của phòng ban mình**.
## d. So sánh với GROUP BY
|              | GROUP BY     | Window Functions        |
| ------------ | ------------ | ----------------------- |
| Số dòng      | Giảm (gộp)   | Giữ nguyên              |
| Cột chi tiết | Mất          | Giữ                     |
| Use case     | Báo cáo tổng | So sánh cá nhân vs nhóm |
## Lưu ý quan trọng
- `OVER()` = cửa sổ toàn bộ bảng
- `OVER(PARTITION BY cột)` = cửa sổ theo nhóm
- Window Functions **không gộp** dòng — đây là khác biệt lớn nhất so với GROUP BY
# 2. ROW_NUMBER, RANK, DENSE_RANK
## a. ROW_NUMBER - Đánh số thứ tự
```sql
SELECT full_name, department, salary,
       ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) AS stt
FROM employees
WHERE salary IS NOT NULL;
```
- Đánh số 1, 2, 3... **trong mỗi phòng ban**, theo lương giảm dần.
## b. RANK - Xếp hạng có bỏ bậc
- Nếu 2 người cùng hạng 2, người tiếp theo sẽ là hạng **4** (bỏ hạng 3).
## c. DENSE_RANK - Xếp hạng liên tục
- Nếu 2 người cùng hạng 2, người tiếp theo vẫn là hạng **3** (không bỏ).
## d. So sánh 3 hàm
- Ví dụ lương: 35M, 25M, 25M, 20M:

|Lương|ROW_NUMBER|RANK|DENSE_RANK|
|---|---|---|---|
|35M|1|1|1|
|25M|2|2|2|
|25M|3|2|2|
|20M|4|4|3|
## Lưu ý quan trọng
- `ROW_NUMBER` luôn cho số **khác nhau** (không trùng)
- `RANK` và `DENSE_RANK` cho số **trùng** khi giá trị bằng nhau
- `ORDER BY` trong `OVER()` là **bắt buộc** với các hàm ranking
# 3. LAG & LEAD - So sánh dòng
## a. LAG - Lấy giá trị dòng trước
```sql 
SELECT strftime('%Y-%m', order_date) AS thang,
       SUM(total_amount) AS doanh_thu,
       LAG(SUM(total_amount)) OVER (ORDER BY strftime('%Y-%m', order_date)) AS dt_thang_truoc
FROM orders
WHERE status = 'Completed'
GROUP BY thang;
```
- `LAG(cột)` trả về giá trị cột **ở dòng trước đó**. Dòng đầu tiên → NULL.
## b. LEAD - Lấy giá trị dòng sau
- `LEAD(cột)` = giá trị dòng **tiếp theo**. Dòng cuối → NULL.
## c. Ứng dụng: So sánh MoM
- Tính **% tăng trưởng** so với tháng trước:
```sql 
SELECT thang, doanh_thu,
       ROUND((doanh_thu - dt_truoc) * 100.0 / dt_truoc, 1) AS tang_truong_pct
FROM (
    SELECT strftime('%Y-%m', order_date) AS thang,
           SUM(total_amount) AS doanh_thu,
           LAG(SUM(total_amount)) OVER (ORDER BY strftime('%Y-%m', order_date)) AS dt_truoc
    FROM orders
    WHERE status = 'Completed'
    GROUP BY thang
);
```
## Lưu ý quan trọng
- `LAG(cột, n)` — lấy giá trị cách n dòng (mặc định n=1)
- `LAG(cột, 1, 0)` — tham số thứ 3 là giá trị mặc định thay NULL
- LAG/LEAD **bắt buộc** có `ORDER BY` trong OVER
# 4. Running Total & SUM OVER
## a. Running Total - Tổng tích luỹ
```sql 
SELECT order_date, total_amount,
       SUM(total_amount) OVER (ORDER BY order_date) AS luy_ke
FROM orders
WHERE status = 'Completed';
```
- `SUM(total_amount) OVER (ORDER BY order_date)` tính tổng **từ đầu đến dòng hiện tại**.
## b. Running Average
```sql 
SELECT order_date, total_amount,
       AVG(total_amount) OVER (ORDER BY order_date) AS trung_binh_luy_ke
FROM orders
WHERE status = 'Completed';
```
## c. Frame clause
- Mặc định khi có ORDER BY: `ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW`.
- Tính trung bình 3 dòng gần nhất (moving average):
```sql 
SELECT order_date, total_amount,
       AVG(total_amount) OVER (
           ORDER BY order_date
           ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
       ) AS ma_3
FROM orders
WHERE status = 'Completed';
```
## Lưu ý quan trọng
- `SUM OVER (ORDER BY ...)` = running total (mặc định)
- `SUM OVER (PARTITION BY ... ORDER BY ...)` = running total **trong mỗi nhóm**
- Frame clause cho phép kiểm soát chính xác phạm vi tính toán
