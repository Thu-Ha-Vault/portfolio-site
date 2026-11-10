---
title: Case Study - Cyclistic
type: MOC
tags:
  - project
  - data-analytics
  - case-study
  - google-data-analytics
folder: Projects / Case Study - Cyclistic
vaultPath: Projects/Case Study - Cyclistic/_MOC - Case Study - Cyclistic.md
date: '2026-11-10'
status: active
deadline: '2026-11-17'
project: case-study-cyclistic
isIndex: true
featured: true
links: {}
description: >-
  Track A của capstone Google Data Analytics. Đề bài, kịch bản và roadmap chi
  tiết nằm ở Course 8: Case Study (mục Case Study 1).
---
> Track A của capstone Google Data Analytics. Đề bài, kịch bản và roadmap chi tiết nằm ở [Course 8: Case Study](/blog/sinh-hoc/bioinformatics/b-data-science-and-bioinformatics/i-data-science/08-case-study/) (mục *Case Study 1*).

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
- **Nơi đăng**: Kaggle Notebook (code) + GitHub repo portfolio (README, elevator pitch) + Tableau Public (dashboard)
- **Hướng đào sâu để khác biệt**: so sánh theo mùa, giờ trong ngày, ngày trong tuần, trạm (bản đồ), loại xe; xử lý ngoại lệ (`ride_length` âm hoặc > 24 giờ); ghi lại toàn bộ quá trình làm sạch

## Việc cần làm
### Ask
- [ ] Viết business task statement và liệt kê stakeholders 📅 2026-11-11
### Prepare
- [ ] Tải 12 tháng gần nhất dữ liệu Divvy, lưu bản gốc riêng, đặt tên file theo quy ước 📅 2026-11-11
- [ ] Mô tả nguồn dữ liệu: cách tổ chức, giấy phép (Motivate International Inc.), ROCCC, giới hạn về quyền riêng tư 📅 2026-11-12
### Process
- [ ] Gộp 12 file thành một bảng, chuẩn hoá tên cột và kiểu dữ liệu 📅 2026-11-12
- [ ] Tạo cột `ride_length` và `day_of_week` (thêm `month`, `hour`) 📅 2026-11-12
- [ ] Làm sạch: trùng lặp, giá trị thiếu, chuyến âm hoặc quá dài, trạm test; ghi change log 📅 2026-11-13
### Analyze
- [ ] Thống kê mô tả: mean/max `ride_length`, mode `day_of_week`, số chuyến theo `member_casual` 📅 2026-11-14
- [ ] So sánh member vs casual theo ngày trong tuần, giờ, tháng, loại xe, trạm phổ biến 📅 2026-11-14
### Share
- [ ] Phác thảo trên giấy rồi làm dashboard Tableau / biểu đồ cho bài trình bày 📅 2026-11-15
### Act
- [ ] Viết 3 khuyến nghị dựa trên phân tích 📅 2026-11-16
- [ ] Đăng notebook lên Kaggle, tạo repo GitHub với README và elevator pitch 📅 2026-11-17
- [ ] Tập trình bày case study cho người khác nghe 📅 2026-11-17

## Map of Content
- (Thêm note phân tích, change log và bài trình bày vào đây khi tạo)
