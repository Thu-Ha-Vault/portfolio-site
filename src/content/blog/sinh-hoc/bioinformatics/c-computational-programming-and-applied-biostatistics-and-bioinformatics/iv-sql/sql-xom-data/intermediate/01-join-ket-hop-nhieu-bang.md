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
  Biostatistics and Bioinformatics/IV - SQL/SQL - Xóm Data/Intermediate/01 -
  JOIN - Kết hợp nhiều bảng.md
url: /blog/join-ket-hop-nhieu-bang/
topic: biology
updated: '2026-10-14'
source: 'https://xomdata.com/courses/sql-intermediate'
order: 1
isIndex: false
---
## a. Tại sao cần JOIN
- Dữ liệu được chia thành nhiều bảng để tránh trùng lặp. Ví dụ:
	- Bảng `orders` có `customer_id` — nhưng không có tên khách hàng
	- Bảng `customers` có `full_name` — nhưng không có thông tin đơn hàng
**JOIN** kết hợp 2 bảng dựa trên cột chung. (→ [Analyze Data to Answer Questions](/blog/analyze-data-to-answer-questions/), [Tổng hợp dữ liệu (R)](/blog/tong-hop-du-lieu/))
## b. INNER JOIN cơ bản
```sql
SELECT orders.id, customers.full_name, orders.total_amount
FROM orders
INNER JOIN customers ON orders.customer_id = customers.id;
```
- `FROM orders` — bảng chính
- `INNER JOIN customers` — bảng cần kết hợp
- `ON orders.customer_id = customers.id` — điều kiện nối
INNER JOIN chỉ trả về **dòng có match ở cả 2 bảng**.
## c. Cách đọc kết quả JOIN
- Dùng `tên_bảng.tên_cột` để tránh nhầm lẫn khi 2 bảng có cột trùng tên (VD: cả 2 đều có `id`).
- **Alias bảng** giúp viết ngắn hơn:
```sql 
SELECT d.id, k.full_name, d.total_amount
FROM orders d
INNER JOIN customers k ON d.customer_id = k.id;
```
## Lưu ý quan trọng
- INNER JOIN = chỉ lấy dòng **match ở cả 2 bảng**
- Luôn chỉ rõ `tên_bảng.tên_cột` khi có cột trùng tên
- Dùng alias bảng để code gọn hơn
# 2. LEFT JOIN
## a. LEFT JOIN là gì?
```sql 
SELECT k.full_name, d.id AS order_id, d.total_amount
FROM customers k
LEFT JOIN orders d ON k.id = d.customer_id;
```
- LEFT JOIN giữ **tất cả dòng** bảng trái (`customer`), kể cả khi không có match ở bảng phải (`orders`). Cột từ bảng phải sẽ = NULL.
## b. So sánh INNER JOIN và LEFT JOIN
|                       | INNER JOIN | LEFT JOIN                    |
| --------------------- | ---------- | ---------------------------- |
| Có match              | ✅ Hiển thị | ✅ Hiển thị                   |
| Bảng trái không match | ❌ Bỏ qua   | ✅ Hiển thị (cột phải = NULL) |
| Bảng phải không match | ❌ Bỏ qua   | ❌ Bỏ qua                     |

## c. Tìm dữ liệu "không có" bằng LEFT JOIN
- Tìm khách hàng **chưa mua gì**:
```sql 
SELECT k.full_name, k.email
FROM customers k
LEFT JOIN orders d ON k.id = d.customer_id
WHERE d.id IS NULL;
```
- Đây là pattern rất phổ biến: LEFT JOIN + WHERE ... IS NULL.
## Lưu ý quan trọng
- LEFT JOIN = giữ toàn bộ bảng **trái**
- Pattern tìm "không có": `LEFT JOIN ... WHERE bảng_phải.cột IS NULL`
- RIGHT JOIN giống LEFT JOIN nhưng giữ bảng **phải** — SQLite không hỗ trợ RIGHT JOIN, dùng LEFT JOIN đổi vị trí bảng
# 3. JOIN nhiều bảng
## a. JOIN +3 bảng
- Lấy chi tiết đơn hàng kèm tên sản phẩm và tên khách hàng:
```sql
SELECT k.full_name, sp.product_name, ct.quantity, ct.unit_price
FROM order_details ct
INNER JOIN orders d ON ct.order_id = d.id
INNER JOIN customers k ON d.customer_id = k.id
INNER JOIN products sp ON ct.product_id = sp.id;
```
- Mỗi `JOIN` thêm 1 bảng — có thể JOIN bao nhiêu bảng cũng được.
## b. JOIN + WHERE + GROUP BY
- Tổng doanh thu theo danh mục sản phẩm:
```sql 
SELECT dm.category_name,
       SUM(ct.quantity * ct.unit_price) AS revenue
FROM order_details ct
INNER JOIN products sp ON ct.product_id = sp.id
INNER JOIN categories dm ON sp.category_id = dm.id
INNER JOIN orders d ON ct.order_id = d.id
WHERE d.status = 'Completed'
GROUP BY dm.category_name
ORDER BY revenue DESC;
```
## Lưu ý quan trọng
- JOIN nhiều bảng: đi theo **chuỗi foreign key**
- Có thể kết hợp INNER JOIN và LEFT JOIN trong cùng 1 query
- Alias bảng là **bắt buộc** khi JOIN nhiều bảng (để code đọc được)
