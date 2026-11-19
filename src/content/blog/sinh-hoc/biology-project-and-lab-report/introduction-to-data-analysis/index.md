---
title: Introduction to Data Analysis (Nhập môn phân tích dữ liệu)
type: MOC
tags:
  - data-analysis
  - r
section: Sinh học
folder: Sinh học / Biology Project and Lab Report / Introduction to Data Analysis
vaultPath: >-
  Resources/Sinh học/Biology Project and Lab Report/Introduction to Data
  Analysis/_MOC - Introduction to Data Analysis.md
url: /topics/introduction-to-data-analysis/
topic: biology
updated: '2026-10-14'
description: >-
  Học phần Nhập môn phân tích dữ liệu (MAT1060, ĐH KHTN – ĐHQGHN, giảng viên Vũ
  Ngọc Bình) thực hành bằng R / R Markdown năm 2022: trình bày và mô tả dữ liệu,
  thao tác – làm sạch dữ liệu, lập trình hàm, phân tích các datas
isIndex: true
---
> Học phần Nhập môn phân tích dữ liệu (MAT1060, ĐH KHTN – ĐHQGHN, giảng viên Vũ Ngọc Bình) thực hành bằng **R / R Markdown** năm 2022: trình bày và mô tả dữ liệu, thao tác – làm sạch dữ liệu, lập trình hàm, phân tích các datasets có sẵn; kết thúc bằng tiểu luận nhóm phân tích dữ liệu nhà ở Boston (hồi quy, Random Forest).

## Map of Content
- [01 - Trình bày và mô tả dữ liệu bằng R](/blog/trinh-bay-va-mo-ta-du-lieu-thuc-hanh-r/): Chương 2 – barplot, histogram, pie, scatter, tuỳ chỉnh biểu đồ, boxplot và loại outlier theo IQR, `summary()`
- [02 - Các thao tác với dữ liệu trong R](/blog/cac-thao-tac-voi-du-lieu-trong-r/): nhập/xuất, recode bằng factor/match/replace/cut, chuyển kiểu, `subset`, sinh dữ liệu, xử lý dữ liệu thiếu, if/for/function
- [03 - Bài tập R cơ bản và phân tích dữ liệu](/blog/bai-tap-r-co-ban-buoi-5-buoi-6-va-buoi-7/): Homework + bài tập buổi 5 (WHO1), buổi 6 (AirPassengers, ChickWeight, chickwts, iris, sleep), buổi 7 (hàm while, Stat2Data)
- [04 - Phân tích dữ liệu nhà ở Boston](/blog/tieu-luan-van-dung-r-phan-tich-du-lieu-nha-o-boston/): lab report – tiểu luận Nhóm 4: EDA, hồi quy tuyến tính/đa thức/tương tác ($R^2$ 0,86), chẩn đoán phần dư, Random Forest (RMSE 2,93)

## Tài liệu tham khảo
- [05 - Data Exploration Using Descriptive Statistics](/blog/data-exploration-using-descriptive-statistics/): bài đọc eDA-2026 (AI Việt Nam) – loại dữ liệu, central tendency, dispersion, boxplot/outlier, z-score, tương quan và nghịch lý Simpson

## Dữ liệu
File nằm trong `assets/Dữ liệu trong bài giảng/`:
- WHO1.csv: 194 quốc gia × 10 biến (khu vực, dân số, tỷ lệ < 15 và > 60 tuổi, tỷ lệ sinh, tuổi thọ, tử vong trẻ em, tỷ lệ biết chữ, GNI), có giá trị trống – dùng trong bài tập buổi 5
- Train_UWu5bXk.csv: 8.523 dòng doanh số siêu thị (Item_Identifier, Item_Weight, Item_Fat_Content, Item_Type, Item_MRP, Outlet…, **Item_Outlet_Sales**), có giá trị thiếu – dùng minh hoạ xử lý missing data
- Test_u94Q5KV.csv: 5.681 dòng cùng cấu trúc với tập Train nhưng không có cột Item_Outlet_Sales
- dulieu2.csv: 700 dòng doanh số bán hàng 2013–2014 theo Segment, Country (Canada, France, Germany, Mexico, USA), Product, Discount Band, Units Sold, Gross Sales, COGS, Profit – ví dụ nhập file CSV
- Product.csv: 244 đơn hàng thực phẩm năm 2020 (OrderDate, Region, City, Category, Product, Quantity, UnitPrice, TotalPrice)
- dulieu.xls: bảng nhỏ 5 dòng × 2 cột Age – Insulin (ví dụ nhập dữ liệu từ Excel)

## Liên quan
- [Biostatistics and Bioinformatics (Thống kê sinh học)](/topics/biostatistics-and-bioinformatics/): học phần song song – cùng nội dung thống kê, làm bằng Excel
- [R](/topics/tutorial/): các khoá học R trong vault (R Tutorial, R Xóm Data)
- [Data Science](/topics/data-science/): khoá Google Data Analytics (có course R programming và Case Study)
