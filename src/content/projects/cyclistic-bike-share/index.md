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
  github: 'https://github.com/Thu-Ha-Vault/cyclistic-case-study'
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
