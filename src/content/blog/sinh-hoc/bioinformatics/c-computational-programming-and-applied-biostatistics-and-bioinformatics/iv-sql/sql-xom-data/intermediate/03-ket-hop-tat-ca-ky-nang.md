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
  Biostatistics and Bioinformatics/IV - SQL/SQL - Xóm Data/Intermediate/03 - Kết
  hợp tất cả kỹ năng.md
url: /blog/ket-hop-tat-ca-ky-nang/
topic: biology
updated: '2026-10-14'
source: 'https://xomdata.com/courses/sql-intermediate'
order: 3
description: >-
  Phân loại khách hàng theo tổng chi tiêu: sql SELECT c.fullname,
  SUM(o.totalamount) AS totalspent, CASE WHEN SUM(o.totalamount) >= 50000000
  THEN 'VIP' WHEN SUM(o.totalamount) >= 20000000 THEN 'Loyal' ELSE 'Regular' END
  AS
isIndex: false
---
- Phân loại khách hàng theo tổng chi tiêu:
```sql
SELECT c.full_name,
       SUM(o.total_amount) AS total_spent,
       CASE
           WHEN SUM(o.total_amount) >= 50000000 THEN 'VIP'
           WHEN SUM(o.total_amount) >= 20000000 THEN 'Loyal'
           ELSE 'Regular'
       END AS customer_tier
FROM customers c
INNER JOIN orders o ON c.id = o.customer_id
WHERE o.status = 'Completed'
GROUP BY c.full_name
ORDER BY total_spent DESC;
```
# 2. Subquery + JOIN
- Top 3 sản phẩm bán chạy nhất:
```sql
SELECT p.product_name, sub.total_sold
FROM (
    SELECT product_id, SUM(quantity) AS total_sold
    FROM order_details
    GROUP BY product_id
    ORDER BY total_sold DESC
    LIMIT 3
) sub
INNER JOIN products p ON sub.product_id = p.id;
```
- Subquery trong `FROM` → gọi là **Derived Table**.
# 3. Pattern phân tích dữ liệu
- Khi xây dựng báo cáo, luôn theo flow:
	1. Xác định **nguồn dữ liệu** (bảng nào?)
	2. **JOIN** các bảng liên quan
	3. **WHERE** lọc dữ liệu cần thiết
	4. **GROUP BY** nhóm theo chiều phân tích
	5. **HAVING** lọc nhóm (nếu cần)
	6. **ORDER BY** sắp xếp kết quả
# Lưu ý quan trọng
- Derived Table phải có **alias** (VD: `sub`). Subquery trong FROM được gọi là Derived Table (bảng dẫn xuất). Khác với subquery trong WHERE (scalar / IN) hay SELECT, derived table được dùng như một bảng tạm với danh sách cột riêng.
- Khi query phức tạp, hãy xây dựng **từng bước** — chạy thử từng phần
