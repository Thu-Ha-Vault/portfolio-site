---
title: Hướng dẫn thực hiện Case Study Cyclistic
type: guideline
tags:
  - project
  - data-analytics
  - case-study
  - google-data-analytics
folder: Archive / Case Study - Cyclistic
vaultPath: Archive/Case Study - Cyclistic/01 - Hướng dẫn thực hiện Cyclistic.md
url: /projects/cyclistic-bike-share/huong-dan-thuc-hien-case-study-cyclistic/
updated: '2026-11-11'
date: '2026-11-11'
status: active
deadline: '2026-11-17'
order: 1
project: cyclistic-bike-share
isIndex: false
description: >-
  Làm trong 7 ngày (11/11 → 17/11/2026). Phân tích bằng DuckDB (SQL) + Python
  (pandas), dashboard bằng Tableau Public. Thư mục làm việc:
  ~/Desktop/Sky/cyclistic-case-study (đã dựng sẵn notebook, script tải dữ liệu
  và mẫu t
---
> Làm trong 7 ngày (11/11 → 17/11/2026). Phân tích bằng **DuckDB (SQL) + Python (pandas)**, dashboard bằng **Tableau Public**. Thư mục làm việc: `~/Desktop/Sky/cyclistic-case-study` (đã dựng sẵn notebook, script tải dữ liệu và mẫu tài liệu).

## 0. Tổng quan

### Sản phẩm phải nộp (6 deliverable của đề bài)
| # | Deliverable | Nằm ở đâu |
| --- | --- | --- |
| 1 | Business task statement | Notebook §1, README, slide 2 |
| 2 | Mô tả nguồn dữ liệu | `docs/data_sources.md` |
| 3 | Tài liệu làm sạch / biến đổi dữ liệu | `docs/changelog.md` + notebook §3 |
| 4 | Tóm tắt phân tích | Notebook §4, README "Key findings" |
| 5 | Biểu đồ hỗ trợ và phát hiện chính | `figures/`, Tableau Public, slide 4–9 |
| 6 | Top 3 khuyến nghị | Notebook §6, slide 10 |

### Lịch 7 ngày
| Ngày | Pha | Việc chính | Thời gian |
| --- | --- | --- | --- |
| 11/11 | Ask + Prepare | Viết business task, cài môi trường, tải dữ liệu | 2–3 giờ |
| 12/11 | Prepare + Process | Nạp dữ liệu vào DuckDB, kiểm tra chất lượng, ROCCC | 3 giờ |
| 13/11 | Process | Làm sạch, tạo cột mới, ghi change log | 3 giờ |
| 14/11 | Analyze | Chạy các phép so sánh, ghi phát hiện | 3–4 giờ |
| 15/11 | Share | Biểu đồ Python + dashboard Tableau | 3–4 giờ |
| 16/11 | Act | Khuyến nghị, slide, README, elevator pitch | 3 giờ |
| 17/11 | Publish | GitHub, Kaggle, website, LinkedIn, tập thuyết trình | 2–3 giờ |

### Lưu ý về máy
- Máy có **8 GB RAM**. 12 tháng dữ liệu khoảng 5–6 triệu chuyến, file CSV giải nén khoảng 1–1,3 GB. Nạp hết vào pandas có thể làm máy treo, nên notebook dùng **DuckDB** chạy SQL trực tiếp trên file và chỉ đưa bảng tổng hợp nhỏ sang pandas.
- Ổ đĩa còn khoảng 15 GB trống, đủ cho dữ liệu (~1,5 GB cả zip lẫn CSV).

## 1. Ask (ngày 11/11)

### Việc cần làm
- [ ] Viết business task statement vào notebook §1 và README
- [ ] Liệt kê stakeholders và metric

### Business task (mẫu, sửa theo giọng của bạn)
> Phân tích dữ liệu chuyến đi 12 tháng (11/2025–10/2026) để xác định **khách vãng lai (casual) và hội viên năm (member) sử dụng xe Cyclistic khác nhau như thế nào**, làm cơ sở cho chiến dịch marketing chuyển đổi khách vãng lai thành hội viên.

### Stakeholders
- **Lily Moreno**: director of marketing, người giao việc
- **Cyclistic marketing analytics team**: đồng nghiệp sẽ dùng kết quả
- **Cyclistic executive team**: người duyệt chiến dịch, rất chú ý chi tiết → cần số liệu và biểu đồ rõ ràng

### Metric dùng để so sánh hai nhóm
| Metric | Cách tính | Trả lời câu hỏi |
| --- | --- | --- |
| Tỉ lệ chuyến | số chuyến mỗi nhóm / tổng | Quy mô mỗi nhóm |
| Thời lượng chuyến | **median** `ride_length` (không dùng mean vì phân phối lệch phải) | Đi lâu hay ngắn |
| Tỉ lệ cuối tuần | chuyến thứ 7–CN / tổng chuyến của nhóm | Đi chơi hay đi làm |
| Hồ sơ theo giờ | số chuyến theo giờ, tách ngày thường / cuối tuần | Có đỉnh giờ đi làm không |
| Mùa vụ | số chuyến theo tháng | Nhóm nào phụ thuộc thời tiết, mùa du lịch |
| Loại xe | tỉ lệ `classic_bike` / `electric_bike` / scooter | Sở thích sản phẩm |
| Trạm phổ biến | top 10 trạm xuất phát của casual | Nơi đặt quảng cáo |
| Chuyến khứ hồi | start station = end station | Đi dạo / tham quan |

## 2. Prepare (ngày 11–12/11)

### Cài môi trường
```bash
cd ~/Desktop/Sky/cyclistic-case-study
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt          # duckdb, pandas, pyarrow, matplotlib, seaborn, jupyterlab
python scripts/download_data.py          # tải 202511 → 202610, ~238 MB zip
ls data/raw/*.csv | wc -l                # phải là 12
jupyter lab notebooks/cyclistic_analysis.ipynb
```

### Việc cần làm
- [ ] Tải đủ 12 file, giữ nguyên bản zip trong `data/raw/zip/` (bản gốc không sửa)
- [ ] Chạy 3 ô đầu của notebook §2: danh sách file, `DESCRIBE trips_raw`, số dòng theo tháng
- [ ] Điền `docs/data_sources.md`: cột, số dòng, giấy phép, ROCCC, hạn chế

### Bảng ROCCC (điền vào `docs/data_sources.md`)
| Tiêu chí | Đánh giá gợi ý |
| --- | --- |
| **Reliable** | Dữ liệu ghi tự động từ hệ thống xe, không phải khảo sát |
| **Original** | Dữ liệu gốc của nhà vận hành (Motivate International / Lyft), dùng thay cho "Cyclistic" |
| **Comprehensive** | Đủ thời gian, loại xe, trạm, toạ độ, loại khách; **thiếu** ID người dùng, giá vé, nhân khẩu học |
| **Current** | 11/2025–10/2026, file mới nhất công bố 05/11/2026 |
| **Cited** | Nguồn công khai, có giấy phép: https://divvybikes.com/data-license-agreement |

### Hạn chế cần ghi rõ
- Không có ID người dùng → **không đếm được số người**, chỉ đếm số chuyến; không thấy ai đã chuyển từ casual sang member.
- Không có giá vé, doanh thu → không tính được lợi nhuận mỗi nhóm.
- Nhiều chuyến xe điện không có tên trạm (khoá xe ngoài trạm) → phân tích trạm chỉ dùng chuyến có tên trạm.

## 3. Process (ngày 12–13/11)

### Việc cần làm
- [ ] Kiểm tra chất lượng: số `ride_id` trùng, giá trị thiếu theo cột, giá trị lạ trong `rideable_type` và `member_casual`
- [ ] Chạy ô làm sạch trong notebook §3 (đã viết sẵn bằng SQL)
- [ ] Copy bảng số dòng từng bước vào `docs/changelog.md`
- [ ] Xuất `data/clean/trips_clean.parquet`

### Các bước làm sạch (đã có trong notebook)
| Bước | Lý do |
| --- | --- |
| Bỏ `ride_id` trùng (giữ dòng đầu) | Một chuyến không được đếm hai lần |
| Chỉ giữ `member_casual` ∈ {member, casual} | Loại giá trị lạ |
| Giữ chuyến dài **1 phút – 24 giờ** | Dưới 1 phút thường là mở khoá nhầm hoặc trả xe ngay; quá 24 giờ là xe bị mất/lỗi hệ thống |
| Bỏ trạm có tên chứa `TEST`, `REPAIR` | Trạm kiểm tra/bảo trì của công ty, không phải khách thật |
| Tạo `ride_length_min`, `day_of_week`, `dow`, `hour`, `month`, `round_trip` | Phục vụ các metric ở §1 |

### Tự kiểm tra thêm
- Xem phân phối `ride_length_min` (histogram trên thang log) trước và sau khi lọc.
- Kiểm tra `SELECT DISTINCT start_station_name ... WHERE start_station_name ILIKE '%test%' OR ILIKE '%warehouse%'` để chắc không sót trạm nội bộ; nếu có tên mới, thêm vào điều kiện lọc và ghi change log.
- Ghi mọi quyết định vào change log, kể cả quyết định **giữ lại** dữ liệu (ví dụ giữ chuyến không có tên trạm vì vẫn có thời gian và loại khách).

## 4. Analyze (ngày 14/11)

### Việc cần làm
- [ ] Chạy ô `overview` → bảng tổng quan hai nhóm
- [ ] Chạy các bảng `by_day`, `by_hour`, `by_month`, `by_type`, `top_casual`
- [ ] Viết 5–7 phát hiện, mỗi phát hiện gồm **con số + so sánh + ý nghĩa kinh doanh**
- [ ] Ghi vào README mục "Key findings"

### Cách viết một phát hiện
> **[Con số]** Casual chiếm X% số chuyến nhưng Y% chuyến cuối tuần. **[So sánh]** Member có hai đỉnh lúc 8h và 17h vào ngày thường, casual có một đỉnh buổi chiều cuối tuần. **[Ý nghĩa]** Member dùng xe để đi làm; casual dùng xe để giải trí → thông điệp marketing cho casual nên nhắm vào lợi ích tiết kiệm khi đi thường xuyên vào cuối tuần.

Chỉ viết phát hiện từ con số bạn thật sự thấy trong dữ liệu. Ví dụ trên chỉ minh hoạ cấu trúc.

### Gợi ý đào sâu (chọn 1–2 để bài nổi bật)
- So sánh **median và phân vị 75%** của thời lượng, vì mean bị kéo bởi vài chuyến rất dài.
- Tính **mức độ mùa vụ**: số chuyến tháng cao nhất / tháng thấp nhất cho từng nhóm.
- Bản đồ top trạm của casual (Tableau, dùng `lat`, `lng` trong `tableau_top_casual_stations.csv`).
- Tỉ lệ chuyến khứ hồi theo trạm → trạm du lịch (hồ, công viên, bảo tàng).
- Kiểm định đơn giản (tuỳ chọn): Mann–Whitney U cho thời lượng chuyến giữa hai nhóm, kèm effect size; với vài triệu dòng, p-value gần như luôn rất nhỏ, nên hãy nhấn mạnh **độ lớn khác biệt** hơn là p-value.

## 5. Share (ngày 15/11)

### Việc cần làm
- [ ] Phác thảo trên giấy 6 biểu đồ trước khi vẽ
- [ ] Vẽ bằng notebook và lưu PNG vào `figures/`
- [ ] Mở Tableau Public, nạp các file `data/clean/tableau_*.csv`, làm 1 dashboard 3–4 biểu đồ
- [ ] Đăng dashboard lên Tableau Public, lưu link

### 6 biểu đồ đề xuất
| # | Biểu đồ | Loại | Tiêu đề nên là phát hiện, ví dụ |
| --- | --- | --- | --- |
| 1 | Tổng quan hai nhóm | Bar / KPI | "Member chiếm phần lớn số chuyến, casual đi lâu hơn" |
| 2 | Chuyến theo thứ trong tuần | Grouped bar | "Casual tăng mạnh vào cuối tuần" |
| 3 | Chuyến theo giờ, ngày thường vs cuối tuần | Line, 2 panel | "Member có hai đỉnh giờ đi làm" |
| 4 | Chuyến theo tháng | Line | "Casual phụ thuộc mùa hè nhiều hơn" |
| 5 | Thời lượng chuyến | Box plot (log) hoặc histogram | "Chuyến của casual dài gấp ~N lần" |
| 6 | Top trạm của casual | Map / bar | "Casual tập trung ở khu ven hồ và điểm du lịch" |

Nguyên tắc: một biểu đồ một thông điệp, tiêu đề là câu kết luận, màu member/casual cố định trên mọi biểu đồ, ghi nguồn dữ liệu ở chân (→ [Course 6: Visualization](/blog/share-data-through-the-art-of-visualization/)).

## 6. Act (ngày 16/11)

### Việc cần làm
- [ ] Viết top 3 khuyến nghị, mỗi khuyến nghị dẫn về một phát hiện và một biểu đồ
- [ ] Làm slide 10–12 trang
- [ ] Viết elevator pitch 30 giây
- [ ] Hoàn thiện README

### Khung khuyến nghị
| Khuyến nghị | Dựa trên phát hiện | Hành động cụ thể | Đo bằng metric nào |
| --- | --- | --- | --- |
| 1 | … | … | … |
| 2 | … | … | … |
| 3 | … | … | … |

Gợi ý hướng (chỉ chọn nếu dữ liệu ủng hộ): gói hội viên cuối tuần hoặc theo mùa; quảng cáo số tại top trạm của casual vào mùa cao điểm; thông điệp "đi bao nhiêu lần thì membership rẻ hơn vé lẻ".

### Cấu trúc slide
1. Tiêu đề + câu hỏi kinh doanh
2. Business task, stakeholders, metric
3. Dữ liệu và cách làm sạch (1 bảng change log rút gọn)
4–9. Mỗi slide một phát hiện + một biểu đồ
10. Top 3 khuyến nghị
11. Hạn chế và bước tiếp theo (thu thập dữ liệu khảo sát, giá vé, theo dõi chuyển đổi)
12. Phụ lục: SQL chính, link GitHub / Kaggle / Tableau

### Elevator pitch (mẫu)
> Mình phân tích 12 tháng dữ liệu xe đạp công cộng ở Chicago, khoảng N triệu chuyến, để tìm khác biệt giữa khách vãng lai và hội viên. Phát hiện chính là … Từ đó mình đề xuất … Mình làm sạch và phân tích bằng SQL (DuckDB) và Python, trình bày trên Tableau.

## 7. Publish (ngày 17/11)

- [ ] **GitHub:** tạo repo `cyclistic-case-study`, push code (thư mục `data/` đã được `.gitignore`), README có business task, findings, khuyến nghị, link Tableau
- [ ] **Kaggle:** tạo notebook mới, dùng dataset Divvy công khai trên Kaggle hoặc tải lên bản tổng hợp; chép các ô phân tích chính
- [ ] **Website:** điền link GitHub, Kaggle, Tableau vào `site.config.json` → `projects` → `cyclistic-bike-share` → `links`, rồi `npm run publish` (→ Portfolio Website)
- [ ] **Cập nhật vault:** tick các việc ở [MOC dự án](/projects/cyclistic-bike-share/), thanh tiến độ Ask → Act trên website sẽ tự đầy
- [ ] **LinkedIn:** đăng bài ngắn kèm 1 biểu đồ đẹp nhất và link website
- [ ] Tập trình bày 5 phút trước một người khác, chuẩn bị trả lời 3 câu: vì sao chọn median, vì sao bỏ chuyến dưới 1 phút, hạn chế lớn nhất của dữ liệu là gì

## 8. Lỗi thường gặp
- Dùng **mean** thời lượng làm kết luận chính → bị chuyến cực dài kéo lệch.
- Kết luận về **số người** trong khi dữ liệu chỉ có **số chuyến**.
- Tiêu đề biểu đồ chỉ mô tả biến ("Rides by day") thay vì nêu phát hiện.
- Khuyến nghị không gắn với phát hiện nào trong dữ liệu.
- Quên ghi lại bước làm sạch → không tái lập được kết quả.

## Tài liệu tham khảo
- Divvy System Data: https://divvy-tripdata.s3.amazonaws.com/index.html
- Divvy Data License Agreement: https://divvybikes.com/data-license-agreement
- DuckDB documentation – Reading CSV files: https://duckdb.org/docs/data/csv/overview
- Đề bài Case Study 1 và roadmap: [Course 8: Case Study](/blog/case-study/)
