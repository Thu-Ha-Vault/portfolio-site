---
title: >-
  Báo cáo phân tích Cyclistic: casual riders và annual members dùng xe khác nhau
  thế nào
type: article
tags:
  - project
  - data-analytics
  - case-study
  - google-data-analytics
folder: Projects / Case Study - Cyclistic
vaultPath: Projects/Case Study - Cyclistic/02 - Báo cáo phân tích Cyclistic.md
url: >-
  /projects/cyclistic-bike-share/bao-cao-phan-tich-cyclistic-casual-riders-va-annual-members-dung-xe-khac-nhau-th/
updated: '2026-11-11'
date: '2026-11-11'
status: active
order: 2
project: cyclistic-bike-share
isIndex: false
description: >-
  Kết quả phân tích 6,13 triệu chuyến (11/2025–10/2026) bằng DuckDB (SQL) và
  Python. Code, dữ liệu sạch, slide và README nằm ở
  ~/Desktop/Sky/cyclistic-case-study (notebook
  notebooks/cyclisticanalysis.ipynb, slide slides/cy
---
> Kết quả phân tích **6,13 triệu chuyến** (11/2025–10/2026) bằng DuckDB (SQL) và Python. Code, dữ liệu sạch, slide và README nằm ở `~/Desktop/Sky/cyclistic-case-study` (notebook `notebooks/cyclistic_analysis.ipynb`, slide `slides/cyclistic_case_study.pptx`). Code và notebook trên GitHub: https://github.com/lucynguyen777/cyclistic-case-study · Dashboard Tableau Public: https://public.tableau.com/app/profile/ha.nguyen.thi.thu8875/viz/Membershaveamorningcommutepeakcasualridingspreadsacrossmiddayandevening/Sheet1

## Business task
- Xác định **casual riders** và **annual members** dùng xe Cyclistic khác nhau thế nào, để thiết kế chiến dịch chuyển casual riders thành members.
- **Stakeholders**: Lily Moreno (director of marketing), marketing analytics team, executive team.

## Dữ liệu và làm sạch
- **Nguồn**: Divvy trip data (Motivate International Inc.), 12 file tháng, giấy phép Divvy Data License Agreement.
- **Làm sạch** (6.294.451 → **6.130.112** chuyến, bỏ 2,6%):
	- 35 `ride_id` trùng
	- 159.035 chuyến dưới 1 phút, 5.148 chuyến trên 24 giờ
	- 13 chuyến ở trạm test/sửa chữa
	- 108 chuyến bắt đầu 31/10/2025 nằm trong file tháng 11
- **Hạn chế**:
	- Không có ID người dùng → chỉ đếm được chuyến, không đếm được người
	- Không có giá vé, doanh thu
	- 19,8% chuyến không có tên trạm (chủ yếu xe điện khoá ngoài trạm)

## Phát hiện chính
1. **Casual chiếm 1/3 số chuyến và rất theo mùa**: 35,3% cả năm, từ 17,9% (tháng 1) lên 40,8% (tháng 7).
2. **Chuyến của casual dài hơn**: trung vị 11,1 so với 8,7 phút (+28%); phân vị 90% là 35,4 so với 23,4 phút; 13,2% chuyến casual dài hơn 30 phút (member 5,4%).
	![cyclistic-01_overview](/vault-assets/cyclistic-01-overview-3d7bed86.webp)
3. **Casual đi cuối tuần**: 37,6% chuyến casual vào thứ 7, CN (riêng thứ 7 là 21,5%), member 23,7%.
	![cyclistic-02_rides_by_day](/vault-assets/cyclistic-02-rides-by-day-8ca41a2b.webp)
4. **Member đi làm**: ngày thường cả hai nhóm đều có đỉnh 17h, nhưng member có thêm đỉnh sáng 7–9h (15,2% chuyến ngày thường so với 7,7% của casual); 38,5% chuyến member rơi vào giờ đi làm ngày thường, casual 25,1%.
	![cyclistic-03_rides_by_hour](/vault-assets/cyclistic-03-rides-by-hour-41bef0fc.webp)
5. **Nhu cầu casual dồn vào mùa hè**: tháng cao nhất gấp 14,5 lần tháng thấp nhất (member 4,7 lần); 69,3% chuyến casual diễn ra từ tháng 5 đến tháng 9 (member 58,5%).
	![cyclistic-04_rides_by_month](/vault-assets/cyclistic-04-rides-by-month-4ec5b5a3.webp)
	![cyclistic-05_ride_length](/vault-assets/cyclistic-05-ride-length-e41cc2ef.webp)
6. **Ven hồ và bảo tàng là "lãnh thổ" của casual**: casual chiếm 76–82% số chuyến tại Navy Pier, Shedd Aquarium, Field Museum, DuSable Lake Shore Dr & Monroe St; chuyến khứ hồi 7,4% so với 2,2% (trong các chuyến có tên trạm).
	![cyclistic-06_top_casual_stations](/vault-assets/cyclistic-06-top-casual-stations-4ec03500.webp)
7. **Có nhóm casual đi như người đi làm**: 25,1% chuyến casual (khoảng 540 nghìn chuyến) diễn ra ngày thường vào giờ đi làm.

## Khuyến nghị
1. **Gói hội viên mùa hè / cuối tuần** (phát hiện 1, 3, 5): quảng bá từ tháng 5 đến tháng 9, cho phép nâng cấp lên hội viên năm.
2. **Chiến dịch ven hồ mùa cao điểm** (phát hiện 6): quảng cáo theo vị trí, tin nhắn trong app và mã QR tại trạm Navy Pier, Shedd Aquarium, Field Museum, Millennium Park, DuSable Lake Shore Dr; cuối tuần 12–18h; nêu số tiền member tiết kiệm được với chuyến dài.
3. **Chuyển đổi casual có thói quen đi làm** (phát hiện 2, 4, 7): thông điệp "bạn đã đi như một hội viên" kèm công cụ tính tiền tiết kiệm.

## Bước tiếp theo
- Dữ liệu tài khoản ẩn danh để đếm người và đo tỉ lệ chuyển đổi.
- Giá vé hiện hành để tính số tiền tiết kiệm trong thông điệp.
- Thêm dữ liệu thời tiết và sự kiện; A/B test ba ưu đãi vào mùa hè 2027.
