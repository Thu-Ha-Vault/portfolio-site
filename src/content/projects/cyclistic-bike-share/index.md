---
title: 'Cyclistic bike-share: casual riders vs annual members'
type: MOC
tags:
  - project
  - data-analytics
  - case-study
  - google-data-analytics
folder: Archive / Case Study - Cyclistic
vaultPath: Archive/Case Study - Cyclistic/_MOC - Case Study - Cyclistic.md
url: /projects/cyclistic-bike-share/
updated: '2026-11-11'
date: '2026-11-10'
status: done
deadline: '2026-11-17'
project: cyclistic-bike-share
isIndex: true
featured: true
summary_vi: >-
  Phân tích 6,13 triệu chuyến xe đạp công cộng ở Chicago (11/2025–10/2026) để
  tìm khác biệt giữa khách vãng lai và hội viên năm, rồi đề xuất 3 hướng
  marketing chuyển đổi khách vãng lai thành hội viên. SQL (DuckDB), Python.
  Capstone của chứng chỉ Google Data Analytics (hoàn thành 11/2026).
summary_en: >-
  6.13 million Chicago bike-share rides (Nov 2025–Oct 2026) analysed to show how
  casual riders and annual members ride differently, ending in three marketing
  recommendations to convert casual riders. SQL (DuckDB), Python. Capstone of
  the Google Data Analytics Professional Certificate (completed Nov 2026).
links:
  github: 'https://github.com/lucynguyen777/cyclistic-case-study'
  tableau: >-
    https://public.tableau.com/app/profile/ha.nguyen.thi.thu8875/viz/shared/D86ZF2XQ6
  certificate: 'https://www.coursera.org/account/accomplishments/specialization/RB6KN8RLORM4'
phases:
  - name: Ask
    done: 1
    total: 1
  - name: Prepare
    done: 2
    total: 2
  - name: Process
    done: 3
    total: 3
  - name: Analyze
    done: 2
    total: 2
  - name: Share
    done: 2
    total: 2
  - name: Act
    done: 5
    total: 5
description: >-
  Track A của capstone Google Data Analytics. Đề bài, kịch bản và roadmap chi
  tiết nằm ở Course 8: Case Study (mục Case Study 1).
---
> Track A của capstone Google Data Analytics. Đề bài, kịch bản và roadmap chi tiết nằm ở [Course 8: Case Study](/blog/case-study/) (mục *Case Study 1*).

## Mục tiêu & sản phẩm
- **Câu hỏi được giao**: How do annual members and casual riders use Cyclistic bikes differently?
- **Stakeholders**: Lily Moreno (director of marketing), Cyclistic marketing analytics team, Cyclistic executive team
- **Mục tiêu kinh doanh**: chuyển casual riders thành annual members
- **Deliverables** (báo cáo):
	1. A clear statement of the business task
	2. A description of all data sources used
	3. Documentation of any cleaning or manipulation of data
	4. A summary of your analysis
	5. Supporting visualizations and key findings
	6. Your top three recommendations
- **Công cụ dự kiến**: SQL (BigQuery) hoặc Python/pandas để làm sạch và phân tích, Tableau Public để làm dashboard
- **Nơi đăng**: Kaggle Notebook (code) + GitHub repo portfolio (README, elevator pitch) + Tableau Public (dashboard) + trang dự án trên website cá nhân (→ Portfolio Website)
- **Thư mục làm việc**: `~/Desktop/Sky/cyclistic-case-study` (ngoài vault vì dữ liệu khoảng 1 GB), phân tích bằng Python (pandas)
	- `notebooks/cyclistic_analysis.ipynb`: khung 6 bước Ask → Act, có sẵn code gộp file, tạo `ride_length`, `day_of_week`, lọc chuyến bất thường, bảng so sánh và biểu đồ
	- `scripts/download_data.py`: tải 12 tháng dữ liệu Divvy, ví dụ `python scripts/download_data.py 2025-11 2026-10`
	- `docs/data_sources.md` (nguồn, giấy phép, ROCCC) và `docs/changelog.md` (nhật ký làm sạch)
- **Hướng đào sâu để khác biệt**: so sánh theo mùa, giờ trong ngày, ngày trong tuần, trạm (bản đồ), loại xe; xử lý ngoại lệ (`ride_length` âm hoặc > 24 giờ); ghi lại toàn bộ quá trình làm sạch

## Việc cần làm
### Ask
- [x] Viết business task statement và liệt kê stakeholders 📅 2026-11-11 ✅ 2026-11-11
### Prepare
- [x] Tải 12 tháng gần nhất dữ liệu Divvy, lưu bản gốc riêng, đặt tên file theo quy ước 📅 2026-11-11 ✅ 2026-11-11
- [x] Mô tả nguồn dữ liệu: cách tổ chức, giấy phép (Motivate International Inc.), ROCCC, giới hạn về quyền riêng tư 📅 2026-11-12 ✅ 2026-11-11
### Process
- [x] Gộp 12 file thành một bảng, chuẩn hoá tên cột và kiểu dữ liệu 📅 2026-11-12 ✅ 2026-11-11
- [x] Tạo cột `ride_length` và `day_of_week` (thêm `month`, `hour`) 📅 2026-11-12 ✅ 2026-11-11
- [x] Làm sạch: trùng lặp, giá trị thiếu, chuyến âm hoặc quá dài, trạm test; ghi change log 📅 2026-11-13 ✅ 2026-11-11
### Analyze
- [x] Thống kê mô tả: mean/max `ride_length`, mode `day_of_week`, số chuyến theo `member_casual` 📅 2026-11-14 ✅ 2026-11-11
- [x] So sánh member vs casual theo ngày trong tuần, giờ, tháng, loại xe, trạm phổ biến 📅 2026-11-14 ✅ 2026-11-11
### Share
- [x] Biểu đồ cho bài trình bày (6 biểu đồ có tiêu đề là phát hiện) và slide 12 trang 📅 2026-11-15 ✅ 2026-11-11
- [x] Dashboard Tableau Public (hồ sơ giờ trong ngày, bản đồ trạm casual, số chuyến theo tháng): https://public.tableau.com/app/profile/ha.nguyen.thi.thu8875/viz/shared/D86ZF2XQ6 📅 2026-11-15 ✅ 2026-11-11
### Act
- [x] Viết 3 khuyến nghị dựa trên phân tích 📅 2026-11-16 ✅ 2026-11-11
- [x] README với phát hiện, khuyến nghị và elevator pitch 📅 2026-11-16 ✅ 2026-11-11
- [x] Đưa notebook lên Kaggle (bản 1, giữ nguyên output; đang Private, xem trong Your Work của tài khoản thuhanguyen666) 📅 2026-11-17 ✅ 2026-11-11
- Không bắt buộc: khi xác minh được số điện thoại trên Kaggle thì chuyển notebook sang Public (Share → Public → Save) và gắn lại link vào website (`site.config.json`). Notebook đã xem đầy đủ trên GitHub.
- [x] Tạo repo GitHub và push code: https://github.com/lucynguyen777/cyclistic-case-study 📅 2026-11-17 ✅ 2026-11-11
- [x] Tập trình bày case study cho người khác nghe 📅 2026-11-17 ✅ 2026-11-11

## Map of Content
- [Báo cáo phân tích: phát hiện, biểu đồ và khuyến nghị](/projects/cyclistic-bike-share/bao-cao-phan-tich-cyclistic-casual-riders-va-annual-members-dung-xe-khac-nhau-th/)
- [Hướng dẫn thực hiện từng bước (Ask → Publish, lịch 11–17/11)](/projects/cyclistic-bike-share/huong-dan-thuc-hien-case-study-cyclistic/)
- Notebook bản đăng Kaggle (đã chạy, có output)
- (Thêm note phân tích, change log và bài trình bày vào đây khi tạo)
