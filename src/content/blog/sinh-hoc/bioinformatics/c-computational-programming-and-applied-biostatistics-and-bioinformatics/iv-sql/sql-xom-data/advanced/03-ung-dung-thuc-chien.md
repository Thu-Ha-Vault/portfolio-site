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
  Biostatistics and Bioinformatics/IV - SQL/SQL - Xóm Data/Advanced/03 - Ứng
  dụng thực chiến.md
source: 'https://xomdata.com/courses/sql-advanced/lessons/1'
order: 3
isIndex: false
---
## a. RFM Analysis là gì? 
RFM phân loại khách hàng theo 3 chỉ số:
- **Recency (R):** Đơn hàng gần nhất bao lâu rồi?
- **Frequency (F):** Mua bao nhiêu lần?
- **Monetary (M):** Tổng chi tiêu bao nhiêu?
## b. Tính R, F, M bằng SQL
```sql
WITH rfm AS (
    SELECT k.full_name,
           MAX(d.order_date) AS lan_mua_cuoi,
           COUNT(d.id) AS so_don,
           SUM(d.total_amount) AS tong_chi
    FROM customers k
    INNER JOIN orders d ON k.id = d.customer_id
    WHERE d.status = 'Completed'
    GROUP BY k.full_name
)
SELECT full_name, lan_mua_cuoi, so_don, tong_chi
FROM rfm
ORDER BY tong_chi DESC;
```
## c. Gap Analysis
- So sánh **mục tiêu vs thực tế**:
```sql
SELECT month, target_amount, actual_amount,
       actual_amount - target_amount AS gap,
       ROUND(actual_amount * 100.0 / target_amount, 1) AS attainment_pct
FROM sales_targets
WHERE department = 'Sales';
```
## d. Cohort Analysis
- Cohort (đoàn hệ) là nhóm khách hàng chia theo một mốc thời gian chung — phổ biến nhất là **tháng có đơn hàng đầu tiên**. Cohort Analysis theo dõi từng nhóm qua các tháng tiếp theo để trả lời: _khách mới của tháng 1 còn bao nhiêu người quay lại mua ở tháng 2, tháng 3?_ — tức là đo **retention**, điều mà RFM (vốn chỉ "chụp ảnh" một thời điểm) không nhìn thấy được.
- Bước 1 — gắn nhãn cohort cho từng đơn hàng bằng window function:
```sql
SELECT customer_id,
       order_date,
       strftime('%Y-%m', MIN(order_date) OVER (PARTITION BY customer_id)) AS cohort_month
FROM orders
WHERE status = 'Completed';
```
`MIN(order_date) OVER (PARTITION BY customer_id)` trả về ngày mua ĐẦU TIÊN của khách trên mọi dòng đơn hàng của họ — không cần GROUP BY rồi JOIN ngược.
- Bước 2 — kết hợp CTE, đếm số khách còn hoạt động của từng cohort theo tháng:
```sql
WITH orders_with_cohort AS (
    SELECT customer_id,
           strftime('%Y-%m', order_date) AS order_month,
           strftime('%Y-%m', MIN(order_date) OVER (PARTITION BY customer_id)) AS cohort_month
    FROM orders
    WHERE status = 'Completed'
)
SELECT cohort_month,
       order_month,
       COUNT(DISTINCT customer_id) AS active_customers
FROM orders_with_cohort
GROUP BY cohort_month, order_month
ORDER BY cohort_month, order_month;
```
Kết quả đọc như một **ma trận retention**: mỗi cohort là một hàng, đi ngang theo `order_month` sẽ thấy số khách còn quay lại. Chia `active_customers` cho số khách ở tháng đầu của chính cohort đó là ra **retention rate** — một trong những chỉ số sức khỏe quan trọng nhất của sản phẩm.
## Lưu ý quan trọng
- RFM là nền tảng của Customer Segmentation (→ [Data Mining](/blog/ai-va-dev/khoa-hoc-ai-cua-tsing-hua-university/learning-module/01-data-mining/))
- Gap Analysis giúp đánh giá hiệu quả kinh doanh
- Cohort Analysis đo retention theo thời gian: RFM cho biết khách _đang_ thế nào, cohort cho biết khách _ở lại_ bao lâu
- Kết hợp CTE + Window Functions cho phân tích mạnh mẽ
