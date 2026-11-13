---
title: 'Phân tích chi tiết: sốt xuất huyết ở Việt Nam theo mùa, theo vùng và thời tiết'
type: article
tags:
  - project
  - data-analytics
  - case-study
  - google-data-analytics
folder: Archive / Case Study - Track B
vaultPath: Archive/Case Study - Track B/02 - Báo cáo phân tích Track B.md
url: >-
  /projects/capstone-track-b/phan-tich-chi-tiet-sot-xuat-huyet-o-viet-nam-theo-mua-theo-vung-va-thoi-tiet/
updated: '2026-11-12'
date: '2026-11-11'
status: done
order: 2
project: capstone-track-b
isIndex: false
description: >-
  Case study tự chọn đề tài (Track B, capstone Google Data Analytics). Phân tích
  12.273 tháng-tỉnh số ca sốt xuất huyết được báo cáo (64 tỉnh,
  02/1994–12/2010), chuỗi quốc gia 1960–2024, dân số từng tỉnh (Tổng cục Thống
  kê
---
> Case study tự chọn đề tài (Track B, capstone Google Data Analytics). Phân tích **12.273 tháng-tỉnh** số ca sốt xuất huyết được báo cáo (64 tỉnh, 02/1994–12/2010), chuỗi quốc gia 1960–2024, dân số từng tỉnh (Tổng cục Thống kê) và thời tiết NASA POWER tại 11 tỉnh lỵ, bằng Python (pandas, DuckDB). Code, notebook, slide 15 trang: [GitHub](https://github.com/lucynguyen777/dengue-vietnam-case-study).

## Tóm tắt
- **Câu hỏi:** mùa sốt xuất huyết đến khi nào, ở đâu, và mưa, nhiệt độ các tháng trước có báo trước được không, để một công ty kiểm soát côn trùng chuẩn bị nguồn lực sớm 1–2 tháng.
- **Kết quả chính:**
	- Mùa dịch rất đều: tháng 6–11 chiếm 73% số ca cả năm.
	- Miền Nam chiếm 68% số ca; mười tỉnh chiếm 54%.
	- Tính trên đầu người, đồng bằng sông Cửu Long có tỉ lệ mắc gấp 2,6 lần cả nước; TP.HCM nhiều ca nhất nhưng chỉ đứng thứ 17 theo tỉ lệ.
	- Các vùng lệch nhau: Tây Nguyên và miền Nam đỉnh tháng 8, miền Trung và miền Bắc đỉnh tháng 10.
	- Mưa đi trước số ca khoảng 1 tháng ở đồng bằng sông Cửu Long, nhưng mưa nhiều bất thường **không** báo trước năm dịch nặng.
	- Năm bình thường đã tăng gấp đôi kể từ thập niên 1990; mùa 2024 đến muộn hơn và kéo dài đến tháng 12.
- **Khuyến nghị:** lập lịch chuẩn bị theo vùng, phân bổ nguồn lực theo gánh nặng, dùng mùa mưa làm mốc thời gian chứ không làm dự báo mức độ.

## 1. Bối cảnh và câu hỏi (Ask)
- **Khách hàng giả định:** công ty dịch vụ kiểm soát côn trùng (kế hoạch này cũng dùng được cho CDC tỉnh), cần xếp lịch nhân viên, dự trữ hoá chất và tổ chức chiến dịch diệt lăng quăng cho mùa sốt xuất huyết.
- **Business task:** xác định số ca sốt xuất huyết tăng **khi nào trong năm và ở đâu**, và **đi theo mưa, nhiệt độ các tháng trước đến mức nào**, để khách hàng chuẩn bị trước đỉnh dịch của từng vùng 1–2 tháng.
- **Stakeholders:** giám đốc vận hành, quản lý 4 vùng (Bắc, duyên hải miền Trung, Tây Nguyên, Nam), tài chính, đối tác y tế công cộng.
- **Vì sao chọn đề tài này:** gắn với nền tảng sinh học (muỗi *Aedes*, dịch tễ, khí hậu), dữ liệu công khai có giấy phép rõ, đủ lớn để làm sạch có ý nghĩa, và ít case study tiếng Việt. Hai đề tài khác đã cân nhắc: chất lượng không khí Hà Nội (độ phủ trạm không đều) và dữ liệu sàng lọc bệnh tim, tiểu đường (nhỏ, đã có rất nhiều notebook mẫu).
- **Chỉ số:**

| Chỉ số | Cách tính |
| --- | --- |
| Số ca theo tháng | tổng `dengue_total` theo tháng-tỉnh |
| Tháng đỉnh, độ dài mùa | tháng có tỉ lệ ca cao nhất; số tháng vượt mức chia đều (8,3%/tháng) |
| Năm dịch lớn | số ca năm > trung bình + 2 độ lệch chuẩn (giai đoạn 1980–2024) |
| Độ trễ thời tiết | tương quan Spearman giữa mưa, nhiệt độ tháng t − k và số ca tháng t, k = 0–3 |

## 2. Dữ liệu (Prepare)
| Dữ liệu | Nguồn | Phạm vi | Giấy phép |
| --- | --- | --- | --- |
| Số ca theo tháng, cấp tỉnh | OpenDengue V1.3.1, gốc từ Project Tycho | 64 tỉnh, 02/1994–12/2010, 12.273 dòng, 1,38 triệu ca | CC BY 4.0 (Clarke et al. 2024, *Scientific Data* 11, 296) |
| Số ca cấp quốc gia | OpenDengue (Project Tycho, tài liệu khoa học, WHO, Bộ Y tế) | theo năm 1960–2022 (có năm thiếu), theo tháng một số năm đến 03/2025, theo tuần 2016 và 2023 | CC BY 4.0 |
| Thời tiết theo tháng | NASA POWER (MERRA-2, ô lưới 0,5° × 0,625°) | mưa, nhiệt độ, độ ẩm 1994–2024 tại 11 tỉnh lỵ của 4 vùng | miễn phí, ghi công NASA LaRC POWER |
| Dân số trung bình theo tỉnh | Tổng cục Thống kê, bảng V02.03-07 (qua PxWeb API) | 1995–2010, nghìn người | dữ liệu thống kê công khai |
| Ranh giới tỉnh | geoBoundaries VNM ADM1 (ranh giới 2008) | 63 tỉnh, dùng vẽ bản đồ và lấy toạ độ tâm tỉnh | public domain |

- **Kiểm tra chất lượng:**
	- Không có giá trị âm, thiếu hay trùng tháng-tỉnh.
	- Tổng các tỉnh khớp chính xác với chuỗi quốc gia theo tháng ở mọi năm có cả hai nguồn. So với số liệu năm, tổng các tỉnh thấp hơn 0,1–2,0% (1997, 2001, 2002, 2010) và 4,7% năm 1994 do thiếu tháng 1/1994.
	- Thời tiết không có giá trị thiếu (-999).
- **ROCCC:** dữ liệu tin cậy (bài báo dữ liệu có bình duyệt, sản phẩm chuẩn của NASA), truy được nguồn gốc từng dòng, đủ rộng cho phân tích mùa vụ và theo vùng. Điểm yếu là **độ mới**: dữ liệu tỉnh dừng ở 2010, nên tôi dùng số liệu quốc gia năm 2024 để kiểm tra mùa dịch gần đây.

## 3. Làm sạch và biến đổi (Process)
- **Công cụ:** file dữ liệu toàn cầu của OpenDengue nặng 503 MB, nên tôi dùng **DuckDB** lọc riêng Việt Nam (còn 0,1 MB), sau đó xử lý bằng pandas.
- **Các bước:**

| Bước | Số dòng | Ghi chú |
| --- | ---: | --- |
| Lọc Việt Nam, cấp tỉnh, theo tháng | 12.273 | một nguồn duy nhất (Project Tycho) |
| Tách ngày → tháng, gán 64 tỉnh vào 4 vùng | 12.273 | không bỏ dòng nào |
| Tháng-tỉnh thuộc các năm đủ 12 tháng | 11.640 | dùng cho trung bình năm; 1994 thiếu tháng 1, các tỉnh tách năm 1997, 2004 bắt đầu giữa giai đoạn |
| Thời tiết chuyển sang dạng dài, mưa mm/ngày → mm/tháng | 4.092 | 11 điểm × 31 năm; tạo cột trễ 1–3 tháng trên chuỗi thời tiết đầy đủ |
| Nối số ca với thời tiết theo tỉnh + năm + tháng | 2.191 | 11 tỉnh |
| Chuỗi quốc gia, mỗi năm một nguồn | 57 năm | ưu tiên số liệu năm, rồi tổng 12 tháng, rồi tổng 52 tuần; năm thiếu để trống, không điền 0 |
| Dân số tỉnh 1995–2010, bỏ dòng tổng cả nước và tổng vùng | 1.024 | nghìn người |
| Nối số ca với dân số, 2004–2010, gộp Hà Tây vào Hà Nội | 441 | 63 tỉnh × 7 năm cùng một ranh giới; tên tỉnh được so khớp sau khi bỏ dấu |

- **Quyết định:**
	- Mùa vụ và vùng tính trên 1995–2010, các năm đủ tháng.
	- Trước 1980 dữ liệu quốc gia quá thưa, nên ngưỡng năm dịch tính trên 1980–2024.
	- Tỉ lệ mắc chỉ tính cho 2004–2010: đó là giai đoạn duy nhất số ca và dân số dùng cùng ranh giới tỉnh (đợt tách tỉnh năm 1997 đã được Tổng cục Thống kê tính lùi theo tỉnh mới, còn số ca năm 1995–1996 vẫn theo tỉnh cũ).
	- Tương quan Spearman tính bằng tương quan Pearson của thứ hạng, ít bị ảnh hưởng bởi các đợt bùng phát cực lớn (→ Tương quan và hồi quy).

## 4. Phân tích (Analyze)

### 4.1 Năm bình thường đã tăng gấp đôi, năm dịch lớn gấp 4–5 lần
- Trung vị số ca mỗi năm: 51.004 (1980–1999), 62.936 (2000–2009), 109.041 (2010–2024).
- Ngưỡng năm dịch (trung bình + 2 độ lệch chuẩn của 1980–2024) là 258.657 ca. Ba năm vượt ngưỡng: **1987** (354.517), **2019** (320.702), **2022** (367.729), gấp 4,3–5,0 lần năm trung vị. Năm 1998 (234.920) sát ngưỡng.
- Ý nghĩa: năm dịch lớn đến vài năm một lần và không báo trước; khách hàng cần năng lực dự phòng, đồng thời mức nền tăng dần.

![track-b-01_national_trend](/vault-assets/track-b-01-national-trend-7c8ced7d.webp)

### 4.2 Mùa dịch rất đều: tháng 6–11
- Trung bình 72,9% số ca cả năm rơi vào tháng 6–11 (năm thấp nhất 53,7%, cao nhất 80,9%); tháng 2–4 chỉ 9,5%.
- Đỉnh cả nước rơi vào tháng 7–10 trong 15/16 năm; riêng 1999 đỉnh vào tháng 5.
- Ý nghĩa: tháng 2–4 là khoảng lặng để chuẩn bị.

![track-b-02_heatmap_year_month](/vault-assets/track-b-02-heatmap-year-month-688873b8.webp)

### 4.3 Miền Nam gánh phần lớn số ca
| Vùng | Tỉ lệ số ca 1995–2010 |
| --- | ---: |
| Nam | 68,3% |
| Duyên hải miền Trung | 23,7% |
| Tây Nguyên | 4,3% |
| Bắc | 3,7% |

- Mười tỉnh có số ca trung bình mỗi năm cao nhất chiếm **53,6%** tổng số ca; 9 tỉnh trong đó ở miền Nam: TP.HCM (7.105 ca/năm), Tiền Giang (5.175), Bến Tre (5.033), Đồng Tháp (4.453), Kiên Giang (4.105), An Giang (4.075), Đồng Nai (3.902), Cà Mau (3.756), Sóc Trăng (3.213), và Bình Thuận (3.170) ở miền Trung.
- Đây là **số ca**, nên tỉnh đông dân luôn đứng đầu. Mục 4.4 chia cho dân số để so sánh nguy cơ trên mỗi người.

![track-b-04_top_provinces](/vault-assets/track-b-04-top-provinces-a14f7df4.webp)

### 4.4 Tính trên đầu người: đồng bằng sông Cửu Long có nguy cơ cao nhất
- Tỉ lệ mắc = số ca / dân số × 100.000, trung bình 2004–2010. Cả nước: **108,5 ca/100.000 dân/năm**.
- Theo vùng: Nam 227,4; Tây Nguyên 80,2; duyên hải miền Trung 74,5; Bắc 15,2. Riêng 13 tỉnh **đồng bằng sông Cửu Long: 276,8**, gấp 2,6 lần cả nước.

| Hạng theo tỉ lệ | Tỉnh | Ca/100.000 dân/năm | Hạng theo số ca |
| ---: | --- | ---: | ---: |
| 1 | Cà Mau | 395,2 | 5 |
| 2 | Tiền Giang | 386,4 | 2 |
| 3 | Sóc Trăng | 382,3 | 4 |
| 4 | Đồng Tháp | 374,5 | 3 |
| 5 | Bến Tre | 317,6 | 9 |
| 6 | Khánh Hoà | 295,5 | 12 |
| 7 | Kiên Giang | 284,3 | 6 |
| 8 | Bạc Liêu | 272,1 | 13 |
| 9 | Long An | 244,7 | 11 |
| 10 | An Giang | 211,6 | 7 |

- Chín tỉnh có tỉ lệ gấp đôi cả nước trở lên: tám tỉnh đồng bằng sông Cửu Long và Khánh Hoà.
- **TP.HCM** nhiều ca nhất nhưng chỉ đứng **thứ 17** theo tỉ lệ (157,8); Hà Nội đứng thứ 10 theo số ca, thứ 30 theo tỉ lệ (61,9).
- Ý nghĩa: số ca cho biết cần **bao nhiêu đội**; tỉ lệ mắc cho biết mỗi hộ dân cần được can thiệp **dày đến mức nào**. Ở Cà Mau hay Sóc Trăng, khả năng một người mắc bệnh cao gấp khoảng 2,5 lần TP.HCM.
- Bản đồ vẽ theo ranh giới tỉnh năm 2008; quần đảo Hoàng Sa (Đà Nẵng) và Trường Sa (Khánh Hoà) được đánh dấu riêng vì file ranh giới không có các đảo xa bờ.

![track-b-08_incidence_map](/vault-assets/track-b-08-incidence-map-d9539a4b.webp)

### 4.5 Mỗi vùng vào mùa một lệch nhau
| Vùng | Tháng đỉnh | Tháng vượt mức chia đều | 3 tháng cao nhất chiếm |
| --- | --- | --- | ---: |
| Bắc | 10 | 6, 8–11 | 50,7% |
| Duyên hải miền Trung | 10 | 6–11 | 41,7% |
| Tây Nguyên | 8 | 6–11 | 47,4% |
| Nam | 8 | 6–11 | 39,8% |

- Tây Nguyên và miền Nam tăng nhanh nhất: riêng tháng 7 đã chiếm 15,8% và 12,7% số ca cả năm. Miền Nam giữ mức cao kéo dài đến tháng 11.
- Duyên hải miền Trung có một đợt tăng tháng 7 (12,8%), giảm tháng 8, rồi đạt đỉnh tháng 10 (16,2%).
- Miền Bắc tăng muộn (từ tháng 8) và dồn mạnh: tháng 9–11 chiếm 50,7%, riêng tháng 10 là 20,0%.
- Miền Bắc ít ca nhưng dễ bùng phát: Hà Nội từ khoảng 100 ca/năm quanh năm 2000 lên **16.175 ca năm 2009**, khi miền Bắc chiếm 16,7% số ca cả nước.

![track-b-03_region_profiles](/vault-assets/track-b-03-region-profiles-9ea81791.webp)

### 4.6 Thời tiết đi trước mùa dịch
Tương quan Spearman giữa số ca tháng t và thời tiết tháng t − k (trung vị các tỉnh trong vùng):

| Vùng | Mưa cùng tháng | Mưa trễ 1 tháng | Mưa trễ 2 tháng | Nhiệt độ trễ 2 tháng | Nhiệt độ trễ 3 tháng |
| --- | ---: | ---: | ---: | ---: | ---: |
| Bắc | 0,21 | 0,30 | 0,31 | 0,36 | 0,30 |
| Duyên hải miền Trung | 0,36 | 0,32 | 0,17 | 0,44 | 0,37 |
| Tây Nguyên | 0,57 | 0,49 | 0,31 | 0,50 | 0,53 |
| Nam | 0,38 | **0,46** | 0,41 | 0,14 | 0,36 |

- Ở đồng bằng sông Cửu Long, mưa đi trước số ca khoảng **1 tháng** (An Giang ρ 0,58, Tiền Giang 0,52).
- Ở miền Bắc và miền Trung, **nhiệt độ** đi trước 2–3 tháng (Hà Nội 0,52 ở độ trễ 2 tháng, Đà Nẵng 0,62 ở độ trễ 3 tháng).
- TP.HCM có liên hệ yếu nhất với mưa (cao nhất 0,30), có thể vì đô thị trữ nước quanh năm.
- Cách hiểu đúng: các tương quan này phần lớn phản ánh **chu kỳ mùa chung** của thời tiết và quần thể muỗi (→ Cá thể và quần thể sinh vật), tức là thời tiết xác nhận lịch mùa dịch.

![track-b-05_weather_lead](/vault-assets/track-b-05-weather-lead-638acdbf.webp)

### 4.7 Nhưng mưa nhiều bất thường không báo trước mùa dịch nặng
- Để hỏi "thời tiết bất thường có báo trước mùa dịch bất thường không", tôi trừ mức bình thường của từng tỉnh, từng tháng khỏi cả số ca (thang log) và thời tiết, rồi tính lại tương quan.
- Mưa bất thường gần như **không** liên quan đến số ca bất thường: trung vị ρ 0,00–0,05 ở mọi độ trễ (từ −0,10 đến 0,14 ở độ trễ 1 tháng).
- Nóng hơn bình thường cho tín hiệu **yếu**: trung vị ρ 0,10–0,18, rõ nhất ở Đà Nẵng (0,33) và Khánh Hoà (0,27) với độ trễ 2 tháng.
- Ý nghĩa: không nên tăng giảm nguồn lực theo dự báo mưa; nên lập kế hoạch theo lịch và theo vùng, kèm năng lực dự phòng cho năm dịch lớn.

![track-b-06_weather_anomaly](/vault-assets/track-b-06-weather-anomaly-a665712d.webp)

### 4.8 Mùa dịch gần đây đến muộn hơn
| Tháng | 6 | 7 | 8 | 9 | 10 | 11 | 12 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Trung bình 1995–2010 | 9,2% | 12,6% | 13,1% | 13,3% | 13,8% | 10,9% | 7,5% |
| Năm 2024 (108.433 ca) | 4,8% | 8,0% | 14,8% | 12,3% | **16,6%** | 14,0% | 11,7% |

- Năm 2024 tháng 6 chỉ chiếm 4,8% số ca (trước đây 9,2%), tháng 12 chiếm 11,7% (trước đây 7,5%); tháng 7–12 chiếm 77,4% (trước đây 71,1%); đỉnh tháng 10.
- Năm 2016 (số liệu theo tuần) cũng đỉnh tháng 10.
- Mức chắc chắn: chỉ một năm gần đây có đủ 12 tháng, nên đây là dấu hiệu cần theo dõi, chưa phải kết luận.

![track-b-07_recent_season_2024](/vault-assets/track-b-07-recent-season-2024-a44daf59.webp)

## 5. Insights và khuyến nghị (Act)
**Top insights**
1. Sốt xuất huyết là **mùa dịch tháng 6–11 dự đoán được** (73% số ca): chỉ cần lịch là biết khi nào chuẩn bị.
2. **Ở đâu quan trọng hơn khi nào**: miền Nam 68% số ca; tính trên đầu người, đồng bằng sông Cửu Long gấp 2,6 lần cả nước, còn TP.HCM đứng đầu về số ca chỉ vì đông dân.
3. **Các vùng lệch nhau**: một lịch chung cả nước sẽ sớm với miền Bắc và muộn với miền Nam.
4. **Thời tiết xác nhận thời điểm nhưng không dự báo mức độ**: năm dịch lớn (gấp 4–5 lần) cần năng lực dự phòng.
5. **Mức nền tăng và mùa dịch gần đây kéo dài hơn**: năm bình thường gấp đôi so với thập niên 1990; năm 2024 số ca còn cao đến tháng 12.

**Khuyến nghị**

| # | Khuyến nghị | Dựa trên | Cách đo |
| ---: | --- | --- | --- |
| 1 | **Lịch chuẩn bị theo vùng**: sẵn sàng nhân lực, hoá chất trước tháng 5 ở miền Nam, Tây Nguyên và duyên hải miền Trung; trước tháng 7 ở miền Bắc; duy trì đội đến tháng 12 | 4.2, 4.5, 4.8 | số ngày từ lúc sẵn sàng đến khi số ca vượt mức chia đều |
| 2 | **Phân bổ theo gánh nặng, theo hai cách**: số đội theo số ca (khoảng hai phần ba cho miền Nam, một phần tư cho duyên hải miền Trung); mức độ diệt lăng quăng tại hộ dân theo tỉ lệ mắc, cao nhất ở Cà Mau, Tiền Giang, Sóc Trăng, Đồng Tháp, Bến Tre, Khánh Hoà; một khoản dự phòng linh hoạt cho miền Bắc | 4.3, 4.4, 4.5 | tỉ lệ năng lực / tỉ lệ số ca theo vùng; số hộ được can thiệp trên 1.000 dân |
| 3 | **Thời tiết làm mốc thời gian, không làm dự báo**: bắt đầu diệt lăng quăng ở miền Nam khi mùa mưa đến (tháng 5–6); ký trước hợp đồng tăng cường cho năm dịch lớn | 4.1, 4.6, 4.7 | thời gian huy động thêm đội trong năm vượt ngưỡng |

## 6. Hạn chế và deliverable bổ sung
- **Hạn chế:**
	- Dữ liệu tỉnh chỉ đến 2010; năm 2024 là kiểm tra cấp quốc gia.
	- Số ca báo cáo thấp hơn số ca thật, và cách báo cáo thay đổi theo thời gian.
	- Mỗi tỉnh chỉ có một điểm thời tiết, và chỉ 11 tỉnh có thời tiết.
	- Tương quan không phải nhân quả: đô thị hoá, thói quen trữ nước, miễn dịch cộng đồng, chủng virus và các chiến dịch phòng dịch cũng ảnh hưởng.
	- Tỉ lệ mắc chỉ tính được cho 2004–2010, giai đoạn số ca và dân số cùng ranh giới tỉnh.
- **Deliverable bổ sung để khám phá tiếp:**
	- Dữ liệu tỉnh sau 2010 (Bộ Y tế, các Viện Pasteur), quy đổi sang 34 tỉnh mới từ năm 2025, để cập nhật tỉ lệ mắc.
	- Số ca cấp quận, huyện trong TP.HCM và đồng bằng sông Cửu Long để tìm điểm nóng bên trong các tỉnh lớn.
	- Mô hình cảnh báo sớm: số ca các tháng trước + nhiệt độ bất thường + chỉ số El Niño, kiểm tra trên các năm để riêng.
	- Chỉ số côn trùng (Breteau, House index) và số ca cấp huyện nếu khách hàng cung cấp.
	- Dashboard Tableau cập nhật hằng tháng.

## 7. Sản phẩm
- Notebook đầy đủ 6 bước, change log, mô tả nguồn dữ liệu, script tải dữ liệu và bộ slide 15 trang (khoảng 30 phút, có ghi chú lời nói): [GitHub](https://github.com/lucynguyen777/dengue-vietnam-case-study).
- Dashboard tương tác (bản đồ tỉ lệ mắc, top tỉnh, heatmap năm × tháng, mùa dịch theo vùng): [Tableau Public](https://public.tableau.com/app/profile/ha.nguyen.thi.thu8875/viz/DengueinVietnamseasonprovincesandincidence_/Dashboard1).
- Dữ liệu sạch cho Tableau: `data/clean/tableau_*.csv` trong repo (chạy lại notebook để tạo), gồm `tableau_incidence.csv` có toạ độ tâm tỉnh để vẽ bản đồ.
