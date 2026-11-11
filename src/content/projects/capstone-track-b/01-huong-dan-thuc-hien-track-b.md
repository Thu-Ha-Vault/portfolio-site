---
title: Hướng dẫn thực hiện Case Study Track B
type: guideline
tags:
  - project
  - data-analytics
  - case-study
  - google-data-analytics
  - public-health
folder: Projects / Case Study - Track B
vaultPath: Projects/Case Study - Track B/01 - Hướng dẫn thực hiện Track B.md
url: /projects/capstone-track-b/huong-dan-thuc-hien-case-study-track-b/
updated: '2026-11-11'
date: '2026-11-11'
status: active
deadline: '2026-12-01'
order: 1
project: capstone-track-b
isIndex: false
description: >-
  Làm sau Cyclistic, từ 18/11 đến 01/12/2026. Thư mục làm việc:
  ~/Desktop/Sky/track-b-case-study. Dùng lại cách làm của Cyclistic
  (DuckDB/pandas, change log, biểu đồ có tiêu đề là phát hiện), nhưng lần này
  bạn tự đặt câu h
---
> Làm sau Cyclistic, từ 18/11 đến 01/12/2026. Thư mục làm việc: `~/Desktop/Sky/track-b-case-study`. Dùng lại cách làm của Cyclistic (DuckDB/pandas, change log, biểu đồ có tiêu đề là phát hiện), nhưng lần này **bạn tự đặt câu hỏi, tự tìm dữ liệu** và trình bày khoảng **30 phút**.

## 0. Tổng quan

### Sản phẩm phải nộp (7 deliverable của đề bài)
| # | Deliverable | Nằm ở đâu |
| --- | --- | --- |
| 1 | Business task statement | `docs/topic_selection.md`, slide 2 |
| 2 | Mô tả nguồn dữ liệu | `docs/data_sources.md` |
| 3 | Tài liệu làm sạch / biến đổi | `docs/changelog.md` |
| 4 | Tóm tắt phân tích | notebook §4, README |
| 5 | Biểu đồ và phát hiện chính | `figures/`, Tableau Public, slide |
| 6 | Danh sách deliverable bổ sung để khám phá tiếp | slide cuối, README |
| 7 | Top high-level insights | slide kết luận |

### Lịch
| Ngày | Pha | Việc chính |
| --- | --- | --- |
| 18–19/11 | Ask | Chọn đề tài, khách hàng giả định, business task, metric |
| 20–21/11 | Prepare | Tải dữ liệu, kiểm tra độ phủ, ROCCC, giấy phép |
| 22–24/11 | Process | Làm sạch, nối dữ liệu dịch tễ với thời tiết và dân số, change log |
| 25–26/11 | Analyze | Mùa vụ, xếp hạng, độ trễ theo mưa, xu hướng |
| 27–28/11 | Share | Biểu đồ, dashboard, slide 30 phút |
| 29/11 | Act | Insights, deliverable bổ sung, elevator pitch |
| 30/11–01/12 | Publish | GitHub, Kaggle, website, tập thuyết trình |

## 1. Chọn đề tài (18/11)

### So sánh 3 đề tài ứng viên
| Tiêu chí | **A. Sốt xuất huyết Việt Nam theo mùa** | B. Chất lượng không khí Hà Nội | C. Dữ liệu sàng lọc bệnh (heart disease, diabetes) |
| --- | --- | --- | --- |
| Gắn với nền tảng sinh học | Rất cao: vector, dịch tễ, khí hậu | Trung bình | Cao |
| Dữ liệu công khai, giấy phép rõ | OpenDengue (CC BY 4.0) + NASA POWER (thời tiết, miễn phí) | OpenAQ (cần API key, độ phủ trạm Hà Nội không đều) | UCI (CC BY 4.0) |
| Đủ lớn để làm sạch có ý nghĩa | Có: nhiều năm, nhiều nguồn, phải chuẩn hoá thời gian | Có | Nhỏ (vài trăm đến vài chục nghìn dòng), ít việc làm sạch |
| Câu hỏi kinh doanh rõ | Phân bổ nguồn lực phòng dịch theo thời gian, địa điểm | Thời điểm marketing máy lọc khí | Nhóm nguy cơ cần sàng lọc trước |
| Khác biệt so với bài mẫu trên mạng | Cao (ít case study tiếng Việt) | Trung bình | Thấp (rất nhiều notebook có sẵn) |

**Khuyến nghị: đề tài A**, vì phù hợp nhất với hướng "sinh học / sức khoẻ" đã ghi trong MOC và nổi bật trong portfolio. Phần dưới hướng dẫn chi tiết đề tài A; nếu chọn B hoặc C, giữ nguyên khung các bước và thay nguồn dữ liệu.

### Kịch bản khách hàng (đề tài A)
- **Khách hàng giả định:** một công ty dịch vụ kiểm soát côn trùng (hoặc Trung tâm Kiểm soát bệnh tật cấp tỉnh) muốn lên kế hoạch nhân lực và hoá chất cho mùa dịch.
- **Business task (mẫu):**
	> Xác định **thời điểm trong năm và khu vực** mà số ca sốt xuất huyết ở Việt Nam tăng cao, và **mức độ liên hệ với lượng mưa, nhiệt độ của các tháng trước đó**, để khách hàng chuẩn bị nguồn lực sớm 1–2 tháng.
- **Năm câu hỏi định hướng của đề bài:** ghi câu trả lời vào `docs/topic_selection.md` (khách hàng là ai và muốn gì, yếu tố chính, loại dữ liệu, lấy ở đâu, khán giả và tài liệu trình bày).

### Metric
| Metric | Cách tính |
| --- | --- |
| Số ca theo tháng / tuần | tổng `dengue_total` theo kỳ |
| Tháng đỉnh và độ dài mùa dịch | tháng có số ca cao nhất; số tháng vượt trung vị năm |
| Tỉ lệ mắc (incidence) | số ca / dân số × 100.000 (nếu có dân số tỉnh) |
| Năm bùng phát | năm có số ca > trung bình + 2 độ lệch chuẩn |
| Độ trễ khí hậu | tương quan Spearman giữa mưa/nhiệt độ tháng t−k và số ca tháng t, k = 0–3 |

## 2. Prepare (20–21/11)

### Nguồn dữ liệu
| Dữ liệu | Nguồn | Giấy phép / ghi chú |
| --- | --- | --- |
| Số ca sốt xuất huyết | **OpenDengue** v1.3.1 (phát hành 03/11/2026): https://opendengue.org, file tại https://github.com/OpenDengue/master-repo/tree/main/data/releases/V1.3.1 | CC BY 4.0; trích dẫn Clarke et al. (2024), *Scientific Data* 11, 296, https://doi.org/10.1038/s41597-024-03120-7 |
| Thời tiết theo tháng | **NASA POWER** API: https://power.larc.nasa.gov | Miễn phí, không cần key; biến `T2M` (°C), `PRECTOTCORR` (mm/ngày), `RH2M` (%) |
| Dân số tỉnh (tuỳ chọn) | Tổng cục Thống kê: https://www.gso.gov.vn | Dùng để tính incidence; ghi rõ năm dân số |

### Việc cần làm
- [ ] Tải `National_extract_V1_3_1.zip` (~0,3 MB) và `Spatial_extract_V1_3_1.zip` (~55 MB) vào `data/raw/`, giữ bản gốc
- [ ] **Kiểm tra độ phủ Việt Nam trước tiên** (bước quyết định phạm vi bài):
	```python
	import pandas as pd
	nat = pd.read_csv("data/raw/National_extract_V1_3_1.csv")
	print(nat.columns.tolist())                       # xác nhận tên cột trước khi dùng
	vn = nat[nat["adm_0_name"].str.upper().str.contains("VIET")]
	print(vn["T_res"].value_counts(), vn["Year"].min(), vn["Year"].max())
	```
	Làm tương tự với file Spatial để xem có dữ liệu cấp tỉnh (`adm_1_name`) không, gồm những tỉnh và năm nào.
	- **Nếu có dữ liệu tỉnh, theo tháng hoặc tuần, đủ nhiều năm:** làm bài ở cấp tỉnh (chọn 5–10 tỉnh có dữ liệu đầy đủ nhất).
	- **Nếu chỉ có cấp quốc gia:** làm bài cấp quốc gia, lấy thời tiết tại 3 thành phố đại diện (Hà Nội, Đà Nẵng, TP.HCM) và nêu rõ hạn chế.
	- **Nếu dữ liệu Việt Nam quá thưa:** mở rộng sang khu vực Đông Nam Á (so sánh Việt Nam với Thái Lan, Campuchia, Philippines) và giữ cùng câu hỏi mùa vụ.
- [ ] Lấy thời tiết theo tháng cho từng điểm (vĩ độ, kinh độ trung tâm tỉnh/thành phố):
	```text
	https://power.larc.nasa.gov/api/temporal/monthly/point?parameters=T2M,PRECTOTCORR,RH2M&community=AG&latitude=21.03&longitude=105.85&start=2010&end=2025&format=CSV
	```
	File trả về ở dạng rộng (mỗi dòng là một biến và một năm, cột JAN…DEC, ANN). Lưu mỗi điểm thành một file CSV trong `data/raw/weather/`.
- [ ] Điền `docs/data_sources.md`: nguồn, giấy phép, giai đoạn, độ phân giải không gian và thời gian, ROCCC, hạn chế

### Hạn chế cần ghi rõ
- Số ca **được báo cáo** thấp hơn số ca thật (nhiều ca nhẹ không đi khám); định nghĩa ca bệnh có thể khác giữa các năm, các nguồn (OpenDengue có cột `case_definition_standardised`).
- Thời tiết tại một điểm trung tâm không đại diện cho cả tỉnh.
- Tương quan khí hậu và số ca **không chứng minh nhân quả**; còn yếu tố đô thị hoá, miễn dịch cộng đồng, chủng virus, can thiệp phòng dịch.

## 3. Process (22–24/11)

### Việc cần làm
- [ ] Lọc Việt Nam (và tỉnh đã chọn), chuẩn hoá thời gian về **tháng** (`calendar_start_date` → `month`); nếu dữ liệu theo tuần, cộng dồn về tháng theo ngày bắt đầu tuần và ghi rõ cách làm
- [ ] Xử lý trùng lặp giữa các nguồn trong cùng một kỳ (ưu tiên nguồn có độ phân giải cao hơn; ghi vào change log)
- [ ] Đổi thời tiết từ dạng rộng sang dạng dài: `location, year, month, T2M, PRECTOTCORR, RH2M`; đổi lượng mưa mm/ngày sang **mm/tháng** (× số ngày của tháng)
- [ ] Nối số ca với thời tiết theo `location + year + month`; tạo cột trễ `rain_lag1`, `rain_lag2`, `rain_lag3`, `temp_lag1`…
- [ ] (Tuỳ chọn) nối dân số và tính incidence / 100.000
- [ ] Ghi change log: số dòng trước/sau từng bước, kỳ bị thiếu, quyết định xử lý

### Kiểm tra chất lượng
- Kỳ nào bị thiếu dữ liệu (tháng không có số ca)? Thiếu thì để trống, **không điền 0**.
- Có giá trị âm, giá trị bằng tổng năm bị ghi vào một tháng không?
- So số ca năm tự cộng với cột năm (nếu có) để phát hiện trùng lặp.

## 4. Analyze (25–26/11)

### Các phân tích
| # | Phân tích | Cách làm | Câu hỏi trả lời |
| --- | --- | --- | --- |
| 1 | Xu hướng dài hạn | số ca theo năm, đánh dấu năm bùng phát | Dịch có tăng theo thời gian không |
| 2 | Mùa vụ | trung bình số ca theo tháng qua các năm; heatmap năm × tháng | Tháng nào bắt đầu, đỉnh, kết thúc |
| 3 | So sánh địa phương | xếp hạng tỉnh theo incidence; so tháng đỉnh Bắc – Trung – Nam | Nơi nào cần ưu tiên |
| 4 | Độ trễ khí hậu | tương quan Spearman giữa mưa/nhiệt độ tháng t−k và số ca tháng t, k = 0–3; vẽ biểu đồ tương quan theo độ trễ | Mưa tháng trước báo trước dịch tháng sau bao lâu |
| 5 | (Nâng cao) Phân rã chuỗi | STL decomposition (`statsmodels`) tách xu hướng, mùa vụ, phần dư | Mùa vụ có ổn định qua các năm không |

### Việc cần làm
- [ ] Ghi mọi phép tính vào notebook có chú thích (đề bài yêu cầu "document your calculations")
- [ ] Viết 5–8 phát hiện theo cấu trúc **con số → so sánh → ý nghĩa cho khách hàng**
- [ ] Ghi rõ mức độ chắc chắn của từng phát hiện (cỡ mẫu, số năm, hạn chế dữ liệu)

## 5. Share (27–28/11)

### Biểu đồ đề xuất
| # | Biểu đồ | Tiêu đề nêu phát hiện, ví dụ |
| --- | --- | --- |
| 1 | Line số ca theo năm | "Các năm bùng phát lặp lại mỗi N năm" |
| 2 | Heatmap năm × tháng | "Mùa dịch bắt đầu từ tháng X, đỉnh tháng Y" |
| 3 | Bar xếp hạng tỉnh (incidence) | "Tỉnh A, B, C có tỉ lệ mắc cao nhất" |
| 4 | Line kép mưa và số ca | "Số ca tăng sau đỉnh mưa khoảng k tháng" |
| 5 | Bar tương quan theo độ trễ | "Mưa trễ k tháng có tương quan mạnh nhất" |
| 6 | Bản đồ (Tableau) | "Mùa dịch miền Nam kéo dài hơn miền Bắc" |

Các tiêu đề trên chỉ là ví dụ về cấu trúc; viết lại theo đúng kết quả của bạn.

### Bài thuyết trình 30 phút (14–16 slide)
1. Tiêu đề, khách hàng, câu hỏi (1 phút)
2. Vì sao vấn đề quan trọng: gánh nặng sốt xuất huyết, chi phí phòng dịch (2 phút)
3. Business task, stakeholders, metric (2 phút)
4–5. Dữ liệu, độ phủ, hạn chế (4 phút)
6. Làm sạch và nối dữ liệu, change log rút gọn (3 phút)
7–11. Mỗi slide một phát hiện + biểu đồ (12 phút)
12. Top insights (2 phút)
13. Khuyến nghị cho khách hàng: lịch chuẩn bị nguồn lực theo tháng, khu vực ưu tiên (2 phút)
14. Deliverable bổ sung để khám phá tiếp (1 phút)
15. Hỏi đáp (phần còn lại)

### Việc cần làm
- [ ] Vẽ biểu đồ trong notebook, lưu `figures/`
- [ ] Dashboard Tableau Public (heatmap + bản đồ + biểu đồ độ trễ)
- [ ] Làm slide theo khung trên

## 6. Act (29/11)

- [ ] **Top high-level insights:** 3–5 câu, mỗi câu một kết luận có số liệu
- [ ] **Deliverable bổ sung** (yêu cầu số 6 của đề bài), ví dụ:
	- Mô hình cảnh báo sớm dựa trên mưa và nhiệt độ trễ 1–2 tháng
	- Dữ liệu cấp huyện hoặc chỉ số muỗi (Breteau, House index) nếu khách hàng cung cấp
	- So sánh với các nước láng giềng
	- Dashboard cập nhật hằng tháng
- [ ] **Elevator pitch** 30 giây
- [ ] Hoàn thiện README

## 7. Publish (30/11–01/12)

- [ ] **GitHub:** repo `track-b-dengue-vietnam` (hoặc tên theo đề tài), ghi nguồn và giấy phép CC BY 4.0 của OpenDengue
- [ ] **Kaggle:** notebook + dataset đã làm sạch (cấp tháng, đã nối thời tiết) nếu giấy phép cho phép chia sẻ lại (CC BY 4.0 cho phép, kèm ghi công)
- [ ] **Website:** điền link vào `site.config.json` → `capstone-track-b`, cập nhật tiêu đề và tóm tắt theo đề tài đã chọn
- [ ] Tick việc trong [MOC dự án](/projects/capstone-track-b/)
- [ ] Tập thuyết trình đủ 30 phút, có hẹn giờ

## Kết nối với kiến thức đã có
- Thống kê mô tả, tương quan, kiểm định: [Tương quan và hồi quy](/blog/tuong-quan-va-hoi-quy/) trong Biostatistics and Bioinformatics
- Sinh thái quần thể muỗi và yếu tố môi trường: [Cá thể và quần thể sinh vật](/blog/ca-the-va-quan-the-sinh-vat/)
- Cách trình bày và vẽ biểu đồ: [Course 6: Visualization](/blog/share-data-through-the-art-of-visualization/)

## Tài liệu tham khảo
- Clarke, J., Lim, A., Gupte, P., et al. (2024). A global dataset of publicly available dengue case count data. *Scientific Data*, 11, 296. https://doi.org/10.1038/s41597-024-03120-7
- OpenDengue: https://opendengue.org · dữ liệu: https://github.com/OpenDengue/master-repo
- NASA POWER (Prediction Of Worldwide Energy Resources): https://power.larc.nasa.gov
- UCI Machine Learning Repository – Heart Disease (đề tài C): https://archive.ics.uci.edu/dataset/45/heart+disease
- OpenAQ (đề tài B): https://openaq.org
