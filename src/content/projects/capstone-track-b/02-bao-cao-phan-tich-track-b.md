---
title: >-
  Báo cáo phân tích Track B: sốt xuất huyết ở Việt Nam theo mùa, theo vùng và
  thời tiết
type: article
tags:
  - project
  - data-analytics
  - case-study
  - google-data-analytics
folder: Projects / Case Study - Track B
vaultPath: Projects/Case Study - Track B/02 - Báo cáo phân tích Track B.md
url: >-
  /projects/capstone-track-b/bao-cao-phan-tich-track-b-sot-xuat-huyet-o-viet-nam-theo-mua-theo-vung-va-thoi-t/
updated: '2026-11-11'
date: '2026-11-11'
status: active
order: 2
project: capstone-track-b
isIndex: false
description: >-
  Phân tích 12.273 tháng-tỉnh số ca sốt xuất huyết được báo cáo (64 tỉnh,
  02/1994–12/2010), chuỗi quốc gia 1960–2024 và thời tiết NASA POWER tại 11 tỉnh
  lỵ, bằng Python (pandas, DuckDB). Code, dữ liệu sạch, slide 15 trang
---
> Phân tích **12.273 tháng-tỉnh** số ca sốt xuất huyết được báo cáo (64 tỉnh, 02/1994–12/2010), chuỗi quốc gia 1960–2024 và thời tiết NASA POWER tại 11 tỉnh lỵ, bằng Python (pandas, DuckDB). Code, dữ liệu sạch, slide 15 trang và README nằm ở `~/Desktop/Sky/track-b-case-study` (notebook `notebooks/analysis.ipynb`, slide `slides/dengue_case_study.pptx`).

## Business task
- **Khách hàng giả định**: công ty dịch vụ kiểm soát côn trùng (hoặc CDC tỉnh) lên kế hoạch nhân lực, hoá chất và chiến dịch cộng đồng cho mùa sốt xuất huyết.
- **Câu hỏi**: số ca tăng **khi nào trong năm, ở đâu**, và **đi theo mưa, nhiệt độ các tháng trước đến mức nào**, để khách hàng chuẩn bị trước đỉnh dịch của từng vùng 1–2 tháng.
- **Stakeholders**: giám đốc vận hành, quản lý 4 vùng (Bắc, duyên hải miền Trung, Tây Nguyên, Nam), tài chính, đối tác y tế công cộng.

## Dữ liệu và làm sạch
- **Nguồn**:
	- OpenDengue V1.3.1 (CC BY 4.0, Clarke et al. 2024, *Scientific Data* 11, 296): số ca theo tháng của 64 tỉnh từ Project Tycho, tổng 1,38 triệu ca; chuỗi quốc gia theo năm, tháng, tuần đến 2025.
	- NASA POWER: mưa, nhiệt độ, độ ẩm theo tháng 1994–2024 tại 11 tỉnh lỵ (Hà Nội, Hải Phòng, Quảng Trị, Đà Nẵng, Khánh Hoà, Bình Thuận, Đắk Lắk, TP.HCM, Tiền Giang, An Giang, Cà Mau).
- **Kiểm tra chất lượng**: không có giá trị âm, thiếu hay trùng tháng-tỉnh; tổng các tỉnh khớp chính xác với chuỗi quốc gia theo tháng ở mọi năm có cả hai nguồn.
- **Xử lý**:
	- Gán 64 tỉnh vào 4 vùng.
	- Đổi thời tiết sang dạng dài, mưa từ mm/ngày sang mm/tháng, tạo cột trễ 1–3 tháng.
	- Nối số ca với thời tiết (2.191 dòng, 11 tỉnh).
	- Ghép chuỗi quốc gia mỗi năm một nguồn (57 năm), không điền 0 vào năm thiếu.
- **Hạn chế**:
	- Dữ liệu tỉnh chỉ đến 2010; năm 2024 chỉ dùng để kiểm tra mùa dịch gần đây.
	- Số ca báo cáo thấp hơn số ca thật.
	- Mỗi tỉnh chỉ có một điểm thời tiết.
	- Chưa có dân số nên xếp hạng theo số ca, chưa theo tỉ lệ mắc.
	- Tương quan không chứng minh nhân quả (→ [Tương quan và hồi quy](/blog/tuong-quan-va-hoi-quy/)).

## Phát hiện chính
1. **Năm bình thường đã tăng gấp đôi, năm dịch lớn gấp 4–5 lần năm bình thường.**
	- Trung vị: 51.004 ca/năm (1980–1999), 62.936 (2000–2009), 109.041 (2010–2024).
	- Vượt ngưỡng trung bình + 2 độ lệch chuẩn (258.657 ca): 1987 (354.517), 2019 (320.702), 2022 (367.729). Năm 1998 (234.920) sát ngưỡng.
	![track-b-01_national_trend](/vault-assets/track-b-01-national-trend-82d36bb7.webp)
2. **Mùa dịch rất đều đặn**: trung bình 72,9% số ca cả năm rơi vào tháng 6–11, tháng 2–4 chỉ 9,5%. Đỉnh dịch cả nước rơi vào tháng 7–10 trong 15/16 năm; riêng năm 1999 đỉnh vào tháng 5.
	![track-b-02_heatmap_year_month](/vault-assets/track-b-02-heatmap-year-month-b045b40f.webp)
3. **Miền Nam gánh phần lớn**: Nam 68,3% số ca, duyên hải miền Trung 23,7%, Tây Nguyên 4,3%, Bắc 3,7%. Mười tỉnh (9 tỉnh ở miền Nam) chiếm 53,6% tổng số ca; riêng TP.HCM trung bình 7.105 ca/năm.
	![track-b-04_top_provinces](/vault-assets/track-b-04-top-provinces-2efecdce.webp)
4. **Mỗi vùng vào mùa một lệch nhau**:
	- Tây Nguyên và miền Nam tăng nhanh nhất (tháng 7 đã chiếm 15,8% và 12,7% số ca cả năm), đỉnh tháng 8.
	- Duyên hải miền Trung có một đợt tăng tháng 7, đỉnh tháng 10.
	- Miền Bắc tăng từ tháng 8, dồn 50,7% số ca vào tháng 9–11, đỉnh tháng 10.
	![track-b-03_region_profiles](/vault-assets/track-b-03-region-profiles-7f915754.webp)
5. **Miền Bắc ít ca nhưng dễ bùng phát**: Hà Nội từ khoảng 100 ca/năm quanh năm 2000 lên 16.175 ca năm 2009, khi miền Bắc chiếm 16,7% số ca cả nước.
6. **Thời tiết đi trước mùa dịch**:
	- Mưa đi trước số ca khoảng 1 tháng ở đồng bằng sông Cửu Long (An Giang ρ 0,58, Tiền Giang 0,52).
	- Nhiệt độ đi trước 2–3 tháng ở miền Bắc và miền Trung (Hà Nội 0,52, Đà Nẵng 0,62).
	- Tương quan này chủ yếu phản ánh chu kỳ mùa chung của muỗi *Aedes* và thời tiết (→ [Cá thể và quần thể sinh vật](/blog/ca-the-va-quan-the-sinh-vat/)).
	![track-b-05_weather_lead](/vault-assets/track-b-05-weather-lead-42c3fdde.webp)
7. **Nhưng mưa nhiều bất thường không báo trước mùa dịch nặng**:
	- Sau khi trừ mức bình thường của từng tháng, mưa bất thường gần như không liên quan đến số ca bất thường (trung vị ρ 0,00–0,05).
	- Nóng hơn bình thường cho tín hiệu yếu (trung vị ρ 0,10–0,18), rõ nhất ở Đà Nẵng (0,33) và Khánh Hoà (0,27).
	![track-b-06_weather_anomaly](/vault-assets/track-b-06-weather-anomaly-feb2af7b.webp)
8. **Mùa dịch gần đây đến muộn hơn**: năm 2024, tháng 6 chỉ chiếm 4,8% số ca (trước đây 9,2%), tháng 12 chiếm 11,7% (trước đây 7,5%), đỉnh tháng 10.
	![track-b-07_recent_season_2024](/vault-assets/track-b-07-recent-season-2024-ef0d70a8.webp)

## Top insights
1. Sốt xuất huyết là **mùa dịch tháng 6–11 dự đoán được** (73% số ca): chỉ cần lịch là biết khi nào chuẩn bị.
2. **Ở đâu quan trọng hơn khi nào**: miền Nam 68% số ca, mười tỉnh 54%.
3. **Các vùng lệch nhau**: một lịch chung cả nước sẽ sớm với miền Bắc và muộn với miền Nam.
4. **Thời tiết xác nhận thời điểm nhưng không dự báo mức độ**: năm dịch lớn (gấp 4–5 lần) cần năng lực dự phòng, không dựa vào dự báo mưa.
5. **Mức nền tăng và mùa dịch gần đây kéo dài hơn**: năm bình thường gấp đôi so với thập niên 1990; năm 2024 số ca còn cao đến tháng 12.

## Khuyến nghị
1. **Lịch chuẩn bị theo vùng** (phát hiện 2, 4, 8): sẵn sàng nhân lực, hoá chất trước **tháng 5** ở miền Nam, Tây Nguyên và duyên hải miền Trung; trước **tháng 7** ở miền Bắc; duy trì đội đến **tháng 12**.
2. **Phân bổ theo gánh nặng** (phát hiện 3, 4):
	- Khoảng hai phần ba năng lực cho miền Nam: TP.HCM, Tiền Giang, Bến Tre, Đồng Tháp, Kiên Giang, An Giang.
	- Một phần tư cho duyên hải miền Trung: Bình Thuận, Khánh Hoà.
	- Một khoản dự phòng linh hoạt cho miền Bắc.
3. **Dùng thời tiết làm mốc thời gian, không làm dự báo mức độ** (phát hiện 1, 6, 7):
	- Bắt đầu chiến dịch diệt lăng quăng ở miền Nam khi mùa mưa đến (tháng 5–6).
	- Ký trước hợp đồng tăng cường cho năm dịch lớn.

## Deliverable bổ sung
- Tỉ lệ mắc trên 100.000 dân, với dân số tỉnh từ Tổng cục Thống kê.
- Dữ liệu tỉnh sau 2010 (Bộ Y tế, các Viện Pasteur), quy đổi sang 34 tỉnh mới từ năm 2025.
- Mô hình cảnh báo sớm: số ca các tháng trước + nhiệt độ bất thường + chỉ số El Niño, kiểm tra trên các năm để riêng.
- Chỉ số côn trùng (Breteau, House index) và số ca cấp huyện nếu khách hàng cung cấp.
- Dashboard Tableau cập nhật hằng tháng.
