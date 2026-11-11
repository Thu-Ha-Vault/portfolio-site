---
title: 'Dengue in Vietnam: season, provinces and rainfall'
type: MOC
tags:
  - project
  - data-analytics
  - case-study
  - google-data-analytics
folder: Archive / Case Study - Track B
vaultPath: Archive/Case Study - Track B/_MOC - Case Study - Track B.md
url: /projects/capstone-track-b/
updated: '2026-11-12'
date: '2026-11-10'
status: done
deadline: '2026-12-01'
project: capstone-track-b
isIndex: true
featured: true
summary_vi: >-
  Sốt xuất huyết ở Việt Nam: mùa dịch đến khi nào, ở đâu, và mưa có báo trước
  được không. Số ca theo tháng của 64 tỉnh (OpenDengue, 1994–2010) nối với thời
  tiết NASA POWER, để giúp khách hàng chuẩn bị nhân lực và hoá chất trước mùa
  dịch 1–2 tháng. Python (pandas, DuckDB).
summary_en: >-
  Dengue in Vietnam: when and where the season hits, and whether rainfall gives
  early warning. Monthly cases for 64 provinces (OpenDengue, 1994–2010) joined
  with NASA POWER weather, so a client can prepare staff and insecticide one to
  two months before the peak. Python (pandas, DuckDB).
links:
  github: 'https://github.com/lucynguyen777/dengue-vietnam-case-study'
  tableau: >-
    https://public.tableau.com/app/profile/ha.nguyen.thi.thu8875/viz/DengueinVietnamseasonprovincesandincidence_/Dashboard1
phases:
  - name: Ask
    done: 2
    total: 2
  - name: Prepare
    done: 1
    total: 1
  - name: Process
    done: 1
    total: 1
  - name: Analyze
    done: 1
    total: 1
  - name: Share
    done: 2
    total: 2
  - name: Act
    done: 3
    total: 3
description: >-
  Track B của capstone Google Data Analytics: tự chọn đề tài, tự tìm dữ liệu. Đề
  bài và roadmap nằm ở Course 8: Case Study (mục Case Study 3). Làm sau khi xong
  Case Study - Cyclistic. Khoá Google Data Analytics đã hoàn thà
---
> Track B của capstone Google Data Analytics: tự chọn đề tài, tự tìm dữ liệu. Đề bài và roadmap nằm ở [Course 8: Case Study](/blog/case-study/) (mục *Case Study 3*). Làm sau khi xong [Case Study - Cyclistic](/projects/cyclistic-bike-share/). Khoá Google Data Analytics đã hoàn thành ngày 11/11/2026 (→ [Data Science](/topics/data-science/)), nên Track B là dự án portfolio bổ sung, không còn là điều kiện lấy chứng chỉ.

## Mục tiêu & sản phẩm
- **Kịch bản**: junior data analyst cho một công ty tư vấn business intelligence, dẫn dắt dự án cho khách hàng mới, từ định nghĩa business task đến trình bày khuyến nghị
- **Năm câu hỏi định hướng**:
	1. What type of company does your client represent, and what are they asking you to accomplish?
	2. What are the key factors involved in the business task?
	3. What type of data will be appropriate?
	4. Where will you obtain that data?
	5. Who is your audience, and what materials will help you present effectively?
- **Deliverables**:
	1. A clear statement of the business task
	2. A description of all data sources used
	3. Documentation of any cleaning or manipulation of data
	4. A summary of your analysis
	5. Supporting visualizations and key findings
	6. A list of additional deliverables for further exploration
	7. Your top high-level insights
- **Quy mô**: bài trình bày khoảng 30 phút, business task không quá đơn giản hay quá phức tạp
- **Định hướng**: đề tài sinh học / sức khoẻ để tận dụng nền tảng chuyên môn
- **Đề tài đã chọn (11/11/2026)**: sốt xuất huyết ở Việt Nam theo mùa và theo tỉnh, liên hệ với mưa và nhiệt độ các tháng trước. Khách hàng giả định: công ty dịch vụ kiểm soát côn trùng (hoặc CDC tỉnh) cần chuẩn bị nhân lực, hoá chất trước mùa dịch 1–2 tháng
- **Dữ liệu**: OpenDengue V1.3.1 (CC BY 4.0), số ca theo tháng của 64 tỉnh từ 02/1994 đến 12/2010 (12.273 dòng, 1,38 triệu ca, nguồn gốc Project Tycho), cộng chuỗi quốc gia đến 2025; thời tiết NASA POWER theo tháng 1994–2024 tại 11 tỉnh lỵ thuộc 4 vùng; dân số tỉnh của Tổng cục Thống kê (tính tỉ lệ mắc 2004–2010) và ranh giới tỉnh geoBoundaries (vẽ bản đồ)
- **Thư mục làm việc**: `~/Desktop/Sky/track-b-case-study`, phân tích bằng Python (pandas); chọn đề tài trong `docs/topic_selection.md`. Bài hoàn chỉnh đăng lên website cá nhân (→ Portfolio Website)

### Đề tài ứng viên

| Đề tài | Khách hàng giả định và câu hỏi | Nguồn dữ liệu gợi ý |
| --- | --- | --- |
| Sốt xuất huyết theo mùa và theo tỉnh | Sở y tế / công ty kiểm soát côn trùng: nên phân bổ nguồn lực vào đâu, khi nào? | WHO, Open Development Vietnam + dữ liệu thời tiết |
| Chất lượng không khí Hà Nội | Công ty máy lọc khí / khẩu trang: tháng nào và khu vực nào nên đẩy marketing? | OpenAQ |
| Dữ liệu y sinh dạng bảng (bệnh tim, tiểu đường) | Phòng khám / công ty bảo hiểm: nhóm nguy cơ nào cần sàng lọc trước? | Heart Disease (UCI), Diabetes (Kaggle) |

- Tiêu chí chọn: dữ liệu công khai và có giấy phép rõ ràng, đạt ROCCC, đủ lớn để làm sạch và phân tích có ý nghĩa, có câu hỏi kinh doanh và metric rõ ràng
- Tránh dữ liệu genomics / RNA-seq: phần xử lý chuyên sâu sẽ lấn át mục tiêu thể hiện quy trình phân tích dữ liệu
