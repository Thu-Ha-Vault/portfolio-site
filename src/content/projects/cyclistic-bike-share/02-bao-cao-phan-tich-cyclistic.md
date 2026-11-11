---
title: >-
  Phân tích chi tiết: casual riders và annual members dùng xe Cyclistic khác
  nhau thế nào
type: article
tags:
  - project
  - data-analytics
  - case-study
  - google-data-analytics
folder: Archive / Case Study - Cyclistic
vaultPath: Archive/Case Study - Cyclistic/02 - Báo cáo phân tích Cyclistic.md
url: >-
  /projects/cyclistic-bike-share/phan-tich-chi-tiet-casual-riders-va-annual-members-dung-xe-cyclistic-khac-nhau-t/
updated: '2026-11-11'
date: '2026-11-11'
status: done
order: 2
project: cyclistic-bike-share
isIndex: false
description: >-
  Capstone Track A của chứng chỉ Google Data Analytics. Phân tích 6,13 triệu
  chuyến xe đạp công cộng ở Chicago (11/2025–10/2026) bằng DuckDB (SQL) và
  Python để trả lời một câu hỏi marketing: khách vãng lai (casual riders)
---
> Capstone Track A của chứng chỉ Google Data Analytics. Phân tích **6,13 triệu chuyến** xe đạp công cộng ở Chicago (11/2025–10/2026) bằng DuckDB (SQL) và Python để trả lời một câu hỏi marketing: khách vãng lai (casual riders) và hội viên năm (annual members) dùng xe khác nhau thế nào. Code và notebook: [GitHub](https://github.com/lucynguyen777/cyclistic-case-study) · dashboard: [Tableau Public](https://public.tableau.com/app/profile/ha.nguyen.thi.thu8875/viz/shared/D86ZF2XQ6).

## Tóm tắt
- **Câu hỏi:** casual riders và annual members dùng xe khác nhau thế nào, để đội marketing thiết kế chiến dịch chuyển casual riders thành hội viên.
- **Dữ liệu:** 12 tháng dữ liệu chuyến đi công khai của Divvy (tên thật của "Cyclistic"), 6.294.451 dòng; sau làm sạch còn 6.130.112 chuyến.
- **Kết quả chính:**
	- Casual riders chiếm 35,3% số chuyến và rất theo mùa: từ 17,9% (tháng 1) lên 40,8% (tháng 7).
	- Chuyến của casual riders dài hơn 28% (trung vị 11,1 so với 8,7 phút) và dồn vào cuối tuần.
	- Member có đỉnh đi làm buổi sáng 7–9h mà casual không có.
	- Ven hồ và các bảo tàng là nơi casual riders chiếm 76–82% số chuyến.
	- Một phần tư số chuyến casual (khoảng 540 nghìn chuyến) đã có dáng đi làm.
- **Khuyến nghị:** gói hội viên mùa hè / cuối tuần, chiến dịch ven hồ mùa cao điểm, ưu đãi riêng cho casual riders có thói quen đi làm.

## 1. Bối cảnh và câu hỏi (Ask)
- **Kịch bản:** Cyclistic là công ty xe đạp công cộng ở Chicago (kịch bản giả định của Google), có 5.824 xe gắn định vị và 692 trạm. Khách mua vé lượt hoặc vé ngày là **casual riders**; khách mua gói năm là **members**. Bộ phận tài chính kết luận member có lợi nhuận cao hơn nhiều, nên giám đốc marketing Lily Moreno muốn chuyển casual riders thành member.
- **Business task:** xác định casual riders và annual members dùng xe Cyclistic khác nhau thế nào, làm cơ sở cho chiến dịch chuyển đổi.
- **Stakeholders:** Lily Moreno (giám đốc marketing), đội marketing analytics, ban điều hành.
- **Chỉ số so sánh:**

| Chỉ số | Cách tính |
| --- | --- |
| Tỉ lệ chuyến | số chuyến của mỗi nhóm / tổng số chuyến |
| Độ dài chuyến | `ended_at − started_at`, dùng trung vị và phân vị 90% vì phân phối lệch phải |
| Ngày trong tuần, giờ trong ngày | tỉ lệ chuyến của mỗi nhóm theo thứ và theo giờ bắt đầu |
| Tính mùa vụ | số chuyến theo tháng; tỉ số tháng cao nhất / thấp nhất |
| Địa điểm | trạm xuất phát có nhiều chuyến casual nhất; tỉ lệ chuyến khứ hồi |

## 2. Dữ liệu (Prepare)
- **Nguồn:** Divvy trip data do Motivate International Inc. (Lyft) công bố tại divvy-tripdata.s3.amazonaws.com, giấy phép Divvy Data License Agreement.
- **Giai đoạn:** 12 tháng gần nhất có đủ dữ liệu, 11/2025–10/2026, gồm 12 file CSV (~1,4 GB, 13 cột). Mỗi dòng là một chuyến: mã chuyến, loại xe, giờ bắt đầu và kết thúc, trạm và toạ độ đi, đến, loại khách.
- **ROCCC:**

| Tiêu chí | Đánh giá |
| --- | --- |
| Reliable | hệ thống ghi tự động, không do người dùng tự khai; cấu trúc giống nhau ở cả 12 file |
| Original | dữ liệu gốc của nhà vận hành, dùng thay cho công ty giả định Cyclistic |
| Comprehensive | đủ thời gian, loại xe, trạm, toạ độ, loại khách; **không có** mã khách hàng, giá vé, doanh thu, nhân khẩu học |
| Current | 12 tháng mới nhất tại thời điểm phân tích |
| Cited | nguồn công khai, có giấy phép |

- **Kiểm tra chất lượng:**
	- 35 `ride_id` bị trùng.
	- 19,8% chuyến không có tên trạm xuất phát (chủ yếu xe điện khoá ngoài trạm); 5.303 chuyến (0,08%) thiếu toạ độ điểm đến.
	- 108 chuyến bắt đầu ngày 31/10/2025 nhưng nằm trong file tháng 11.
	- File nén tháng 1/2026 bị đặt nhầm tên thành 202501; tôi đổi lại khi giải nén.

## 3. Làm sạch và biến đổi (Process)
- **Công cụ:** máy chỉ có 8 GB RAM, nên tôi dùng **DuckDB** chạy SQL thẳng trên 12 file CSV thay vì nạp tất cả vào pandas; pandas chỉ dùng cho các bảng tổng hợp nhỏ và biểu đồ. File gốc không bị sửa; bảng sạch được ghi ra `trips_clean.parquet`.
- **Các bước và số dòng:**

| # | Bước | Số dòng còn lại | Bỏ đi | Lý do |
| ---: | --- | ---: | ---: | --- |
| 1 | Gộp 12 file vào một bảng, đọc đúng kiểu thời gian | 6.294.451 | – | một bảng cho cả năm |
| 2 | Giữ một dòng cho mỗi `ride_id` | 6.294.416 | 35 | bản ghi trùng |
| 3 | `member_casual` chỉ nhận member / casual | 6.294.416 | 0 | không có giá trị lạ |
| 4 | Giữ chuyến dài từ 1 phút đến 24 giờ | 6.130.233 | 164.183 | dưới 1 phút (159.035) là lấy nhầm xe hoặc trả lại ngay; trên 24 giờ (5.148) là xe mất hoặc lỗi |
| 5 | Bỏ trạm có tên chứa TEST / REPAIR | 6.130.220 | 13 | trạm thử nghiệm, sửa chữa nội bộ |
| 6 | Chỉ giữ chuyến bắt đầu trong 01/11/2025–31/10/2026 | **6.130.112** | 108 | chuyến của ngày 31/10/2025 lẫn vào file tháng 11 |
| 7 | Thêm cột `ride_length_min`, `day_of_week`, `hour`, `month`, `round_trip` | 6.130.112 | – | phục vụ phân tích |

- Tổng cộng bỏ 164.339 dòng (2,6%). Các chuyến không có tên trạm vẫn được **giữ lại**: chúng đủ thời gian, loại xe, loại khách nên vẫn tính trong mọi phân tích, trừ xếp hạng trạm.
- Câu SQL làm sạch chính:

```sql
CREATE OR REPLACE TABLE trips AS
WITH dedup AS (
  SELECT *, row_number() OVER (PARTITION BY ride_id ORDER BY started_at) AS rn FROM trips_raw)
SELECT ride_id, rideable_type, member_casual, started_at, ended_at,
       start_station_name, end_station_name, start_lat, start_lng, end_lat, end_lng,
       date_diff('second', started_at, ended_at) / 60.0 AS ride_length_min,
       dayname(started_at) AS day_of_week, hour(started_at) AS hour,
       strftime(started_at, '%Y-%m') AS month,
       (start_station_name = end_station_name) AS round_trip
FROM dedup
WHERE rn = 1 AND member_casual IN ('member', 'casual')
  AND date_diff('second', started_at, ended_at) BETWEEN 60 AND 86400
  AND coalesce(upper(start_station_name), '') NOT LIKE '%TEST%'
  AND coalesce(upper(end_station_name), '') NOT LIKE '%TEST%'
  AND coalesce(upper(start_station_name), '') NOT LIKE '%REPAIR%'
  AND started_at >= TIMESTAMP '2025-11-01' AND started_at < TIMESTAMP '2026-11-01'
```

## 4. Phân tích (Analyze)
Các tỉ lệ dưới đây tính **trong từng nhóm khách** (ví dụ: bao nhiêu phần trăm chuyến casual rơi vào cuối tuần), trừ khi ghi khác. Độ dài chuyến dùng trung vị vì phân phối lệch phải mạnh.

### 4.1 Tổng quan: casual riders chiếm một phần ba số chuyến
| Chỉ số | Casual | Member |
| --- | ---: | ---: |
| Số chuyến | 2.162.170 | 3.967.942 |
| Tỉ lệ chuyến | 35,3% | 64,7% |
| Trung vị độ dài chuyến | 11,1 phút | 8,7 phút |
| Phân vị 90% độ dài chuyến | 35,4 phút | 23,4 phút |
| Chuyến dài hơn 30 phút | 13,2% | 5,4% |
| Chuyến vào thứ 7, chủ nhật | 37,6% | 23,7% |
| Chuyến ngày thường giờ đi làm (7–10h, 16–19h) | 25,1% | 38,5% |
| Chuyến khứ hồi (trong các chuyến có tên trạm) | 7,4% | 2,2% |
| Chuyến bằng xe điện | 75,4% | 69,2% |
| Chuyến trong tháng 5–9 | 69,3% | 58,5% |

![cyclistic-01_overview](/vault-assets/cyclistic-01-overview-0783624a.webp)

### 4.2 Chuyến của casual riders dài hơn ở mọi mức
- Trung vị dài hơn 28% (11,1 so với 8,7 phút), phân vị 90% dài hơn 12 phút (35,4 so với 23,4).
- Cứ 8 chuyến casual thì có 1 chuyến dài hơn 30 phút (13,2%); ở member là 1/18 (5,4%).
- Ý nghĩa: casual riders dùng xe để đi chơi, ngắm cảnh; member dùng xe để di chuyển nhanh từ A đến B. Chuyến dài là chỗ casual riders trả tiền nhiều nhất, nên "hội viên tiết kiệm được bao nhiêu" là thông điệp đáng thử.

![cyclistic-05_ride_length](/vault-assets/cyclistic-05-ride-length-a606ed21.webp)

### 4.3 Casual riders đi cuối tuần, member đi đều các ngày thường
| Ngày | Casual | Member |
| --- | ---: | ---: |
| Thứ 2 | 11,6% | 14,0% |
| Thứ 3 | 11,7% | 16,3% |
| Thứ 4 | 11,5% | 15,9% |
| Thứ 5 | 12,2% | 15,5% |
| Thứ 6 | 15,5% | 14,6% |
| Thứ 7 | **21,5%** | 13,1% |
| Chủ nhật | 16,2% | 10,6% |

- Riêng thứ 7 chiếm 21,5% số chuyến casual; member đạt cao nhất vào thứ 3 (16,3%).
- Chuyến cuối tuần của casual cũng dài nhất: trung vị 12,9 phút (thứ 7) và 12,7 phút (chủ nhật).

![cyclistic-02_rides_by_day](/vault-assets/cyclistic-02-rides-by-day-e4b83938.webp)

### 4.4 Member có đỉnh đi làm buổi sáng, casual thì không
- Ngày thường, cả hai nhóm đều đạt đỉnh lúc **17h** (member 11,8%, casual 10,8% số chuyến ngày thường của nhóm).
- Khác biệt nằm ở **buổi sáng**: khung 7–9h chiếm 15,2% chuyến ngày thường của member, chỉ 7,7% của casual (8h: 8,5% so với 4,4%).
- Cuối tuần, hai đường gần như trùng nhau: cả hai đi nhiều nhất vào buổi trưa và chiều.
- 38,5% chuyến của member rơi vào giờ đi làm ngày thường (7–10h, 16–19h), casual là 25,1%.

![cyclistic-03_rides_by_hour](/vault-assets/cyclistic-03-rides-by-hour-d7fe5fd3.webp)

### 4.5 Nhu cầu của casual riders dồn vào mùa hè
| Tháng | 11/25 | 12/25 | 1/26 | 2/26 | 3/26 | 4/26 | 5/26 | 6/26 | 7/26 | 8/26 | 9/26 | 10/26 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Tỉ lệ casual | 27,3% | 19,9% | 17,9% | 20,3% | 27,5% | 29,2% | 37,1% | 40,1% | **40,8%** | 39,6% | 37,8% | 35,4% |

- Tháng cao nhất của casual gấp **14,5 lần** tháng thấp nhất (345.591 so với 23.880 chuyến); ở member chỉ 4,7 lần (511.048 so với 109.381).
- 69,3% chuyến casual diễn ra từ tháng 5 đến tháng 9 (member 58,5%).
- Ý nghĩa: chiến dịch nhắm casual riders nên chạy từ tháng 5 đến tháng 9; mùa đông gần như không có casual riders để chuyển đổi.

![cyclistic-04_rides_by_month](/vault-assets/cyclistic-04-rides-by-month-283fc5f7.webp)

### 4.6 Ven hồ và bảo tàng là "lãnh thổ" của casual riders
| Trạm xuất phát | Chuyến casual | Tỉ lệ casual tại trạm |
| --- | ---: | ---: |
| Navy Pier | 49.979 | 75,8% |
| DuSable Lake Shore Dr & Monroe St | 28.238 | 78,4% |
| Michigan Ave & Oak St | 20.705 | 60,4% |
| Millennium Park | 17.012 | 66,7% |
| DuSable Lake Shore Dr & North Blvd | 16.751 | 54,3% |
| Shedd Aquarium | 16.196 | 81,8% |
| Theater on the Lake | 14.982 | 57,1% |
| Dusable Harbor | 13.770 | 71,7% |
| Field Museum | 10.370 | 81,0% |
| Montrose Harbor | 10.156 | 55,9% |

- Mười trạm có nhiều chuyến casual nhất đều nằm dọc bờ hồ Michigan hoặc cạnh điểm du lịch, nơi casual riders chiếm 54–82% số chuyến (cả năm, casual chỉ chiếm 35,3%).
- Chuyến khứ hồi (trả xe đúng trạm lấy) chiếm 7,4% chuyến casual so với 2,2% của member: một dấu hiệu nữa của đi chơi, ngắm cảnh.

![cyclistic-06_top_casual_stations](/vault-assets/cyclistic-06-top-casual-stations-d1690ee0.webp)

### 4.7 Một phần tư số chuyến casual đã có dáng đi làm
- 25,1% chuyến casual (khoảng 540 nghìn chuyến) diễn ra vào ngày thường, trong khung giờ đi làm.
- Đây là nhóm dễ chuyển đổi nhất: họ đã đi như member nhưng vẫn trả tiền theo lượt hoặc theo ngày.
- Giới hạn: dữ liệu không có mã khách hàng nên không biết bao nhiêu **người** đứng sau 540 nghìn chuyến này.

## 5. Khuyến nghị (Act)
| # | Khuyến nghị | Dựa trên | Cách đo |
| ---: | --- | --- | --- |
| 1 | **Gói hội viên mùa hè / cuối tuần**: gói theo mùa hoặc "hội viên cuối tuần", quảng bá tháng 5–9, cho phép nâng cấp lên gói năm | phát hiện 4.1, 4.3, 4.5 | số gói bán ra, tỉ lệ nâng cấp lên gói năm sau mùa hè |
| 2 | **Chiến dịch ven hồ mùa cao điểm**: quảng cáo theo vị trí, tin nhắn trong app, mã QR tại trạm Navy Pier, Shedd Aquarium, Field Museum, Millennium Park, DuSable Lake Shore Dr; cuối tuần 12–18h; nêu số tiền member tiết kiệm được với chuyến dài | phát hiện 4.2, 4.6 | lượt quét QR, đăng ký hội viên theo trạm |
| 3 | **Ưu đãi cho casual riders có thói quen đi làm**: thông điệp "bạn đã đi như một hội viên" kèm công cụ tính tiền tiết kiệm, gửi cho người đi ngày thường giờ đi làm | phát hiện 4.4, 4.7 | tỉ lệ chuyển đổi của nhóm nhận ưu đãi so với nhóm đối chứng |

## 6. Hạn chế và bước tiếp theo
- **Chuyến, không phải người:** không có mã khách hàng nên không đếm được số người và không đo được tỉ lệ chuyển đổi. Bước tiếp theo: dữ liệu tài khoản đã ẩn danh.
- **Không có giá vé, doanh thu:** thông điệp tiết kiệm cần bảng giá hiện hành từ bộ phận tài chính.
- **Trạm:** 19,8% chuyến không có tên trạm; xếp hạng trạm chỉ dùng chuyến có tên trạm.
- **Một thành phố, một năm:** chưa tách được ảnh hưởng của thời tiết, lễ hội, du lịch. Bước tiếp theo: nối dữ liệu thời tiết, sự kiện; A/B test ba ưu đãi trong mùa hè 2027.

## 7. Sản phẩm
- Notebook đầy đủ 6 bước, change log, mô tả nguồn dữ liệu, script tải dữ liệu: [GitHub](https://github.com/lucynguyen777/cyclistic-case-study).
- Dashboard tương tác (giờ trong ngày, bản đồ trạm casual, số chuyến theo tháng): [Tableau Public](https://public.tableau.com/app/profile/ha.nguyen.thi.thu8875/viz/shared/D86ZF2XQ6).
- Bộ slide 12 trang kèm ghi chú thuyết trình: `slides/cyclistic_case_study.pptx` trong repo.
- Chứng chỉ: [Google Data Analytics Professional Certificate](https://www.coursera.org/account/accomplishments/specialization/RB6KN8RLORM4) (→ [Data Science](/topics/data-science/)).
