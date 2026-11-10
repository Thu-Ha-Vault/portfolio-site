---
title: 'Chương 2 + 3: Đặc trưng thống kê của một mẫu và ước lượng tham số của tổng thể'
type: course-note
tags:
  - biology
  - biostatistics
  - descriptive-statistics
  - estimation
  - excel
  - course-note
section: Sinh học
folder: Sinh học / Biology Project and Lab Report / Biostatistics and Bioinformatics
vaultPath: >-
  Resources/Sinh học/Biology Project and Lab Report/Biostatistics and
  Bioinformatics/01 - Đặc trưng thống kê mẫu và ước lượng tham số.md
url: /blog/3-dac-trung-thong-ke-cua-mot-mau-va-uoc-luong-tham-so-cua-tong-the/
topic: biology
updated: '2026-10-16'
order: 1
description: >-
  File Excel gồm sheet Lý thuyết (bảng tóm tắt khái niệm, công thức và hàm
  Excel) và 8 sheet bài tập (Bài 1–7, Bài làm thêm). Chương 2 tính các đặc trưng
  của mẫu; Chương 3 dùng mẫu để ước lượng điểm và ước lượng khoảng cho
isIndex: false
---
> File Excel gồm sheet **Lý thuyết** (bảng tóm tắt khái niệm, công thức và hàm Excel) và 8 sheet bài tập (Bài 1–7, Bài làm thêm). Chương 2 tính các đặc trưng của mẫu; Chương 3 dùng mẫu để **ước lượng điểm** và **ước lượng khoảng** cho trung bình, phương sai và xác suất của tổng thể.

## Khái niệm chính
- **Tập hợp**: nhóm cá thể; chữ hoa A, B, C… chỉ tập hợp, chữ thường a, b, c… chỉ phần tử.
- **Phép thử**: thực hiện một thí nghiệm, một quan sát. **Sự kiện**: kết quả của phép thử.
- **Tần số** $m$: số lần sự kiện A xuất hiện trong $n$ phép thử; **tần suất** $f = m/n$.
- **Xác suất** $p$: khi $n \to \infty$, $f$ dao động quanh một giá trị $p$, $0 \le p \le 1$.
- **Tổng thể (N)**: tập chứa mọi phần tử thuần nhất (theo một tiêu chuẩn) cần nghiên cứu. **Mẫu (n)**: tập con rút ra từ tổng thể; làm thí nghiệm trên mẫu rồi suy rộng ra tổng thể.
- **Nguyên nhân sai số khi chọn mẫu**:
	- Kích thước mẫu quá nhỏ so với tổng thể.
	- Phương pháp chọn mẫu không khách quan.
- **Đặc trưng của tổng thể**: kích thước $N$, trung bình $\mu$, độ lệch chuẩn $\sigma$, luật phân phối $F(x)$.
- **Bản chất của Chương 3**: ước lượng các tham số của tổng thể ($\mu$, $\sigma^2$, $p$) từ mẫu thu được. (→ [Models, Statistical Inference and Learning](/blog/models-statistical-inference-and-learning/))

## Công thức / phương pháp

### Đặc trưng của mẫu (Chương 2)
- Hai dạng dữ liệu: **dãy số liệu** (dùng hàm Excel) và **bảng tần số** theo khoảng ($x_i$: trị số giữa khoảng, $m_i$: tần số mỗi khoảng, $m_j$: tần số cộng dồn). Với bảng tần số, tạo thêm cột $x_i m_i$ và $(x_i - \bar{x})^2 m_i$. (→ [Data Exploration Using Descriptive Statistics](/blog/data-exploration-using-descriptive-statistics/), [Mô tả dữ liệu bằng R](/blog/trinh-bay-va-mo-ta-du-lieu-thuc-hanh-r/))

| Đặc trưng | Dãy số liệu (Excel) | Bảng tần số |
|---|---|---|
| Kích thước mẫu $n$ | `COUNT()` | $n = \sum m_i$ |
| Trung bình $\bar{x}$ | `AVERAGE()` | $\bar{x} = \dfrac{\sum x_i m_i}{n}$ |
| Độ lệch chuẩn $s$ | `STDEV()`, `STDEVP()`; phương sai `VAR()`, `VARP()` | $s = \sqrt{\dfrac{\sum (x_i - \bar{x})^2 m_i}{n}}$ (mẫu < 30 thì chia $n-1$) |
| Trung vị (Median) | `MEDIAN()` | $Me = b + d \cdot \dfrac{n/2 - m_j}{m_i}$ |
| Số trội (Mode) | `MODE()` | $Mo = a_i + d_i \cdot \dfrac{\lvert m_i - m_{i-1} \rvert}{\lvert m_i - m_{i-1} \rvert + \lvert m_i - m_{i+1} \rvert}$ |
| Bách phân vị | `PERCENTILE(dãy, %)` | $P_i = b + d \cdot \dfrac{i n/100 - m_j}{m_i}$ |
| Khoảng biến thiên | $R = x_{max} - x_{min}$ | |
| Hệ số biến thiên | $C_v = \dfrac{s}{\bar{x}} \cdot 100\%$ | |
| Độ nhọn / độ lệch | `KURT()`, `SKEW()` | |

- Trong công thức trung vị/bách phân vị: $b$ là giới hạn dưới của lớp chứa Me (hoặc $P_i$), $d$ là độ dài lớp, $m_j$ là tần số cộng dồn của lớp ngay dưới. Với Mode: $a_i$ là giới hạn dưới, $d_i$ là độ dài lớp chứa Mode. (→ [Estimating the CDF](/blog/estimating-the-cdf-and-statistical-functionals/))
- **Đọc độ nhọn và độ lệch** (cách ghi trong bài):
	- **Kurtosis** > 0: phân phối nhọn (*leptokurtic*); < 0: phân phối bẹt (*platykurtic*).
	- **Skewness** < 0: phân phối lệch trái; > 0: lệch phải.

### Ước lượng tham số của tổng thể (Chương 3)

| Tham số | Ước lượng điểm | Ước lượng khoảng | Hàm Excel |
|---|---|---|---|
| Trung bình $\mu$ | $\mu = \bar{x}$ | $\left(\bar{x} - \varepsilon;\ \bar{x} + \varepsilon\right)$, $\varepsilon = \dfrac{t_{(n-1,\ \alpha/2)} \cdot s}{\sqrt{n-1}}$ | `CONFIDENCE(α; s; n)` cho $\varepsilon$ |
| Phương sai $\sigma^2$ | $\sigma^2 = s^2$ | $\left(\dfrac{(n-1)s^2}{\chi^2_{\alpha/2}};\ \dfrac{(n-1)s^2}{\chi^2_{1-\alpha/2}}\right)$ | `CHIINV()` |
| Xác suất $p$ | $p = f$ | $f \pm U_{\alpha/2}\sqrt{\dfrac{f(1-f)}{n}}$ | |

- Khi $n > 30$: công thức chỉ còn $n$ (thay cho $n-1$); với phương sai, bậc tự do của $\chi^2$ không đổi.
- Hệ số $U_{\alpha/2}$ của phân phối chuẩn: **95% → 1,96**; **99% → 2,58**; **99,9% → 3,3**. (→ [Random Variables](/blog/random-variables/))
- **Kích thước mẫu tối thiểu** (rút từ công thức sai số): (→ [Rừng ngập mặn Phù Long](/blog/co-so-sinh-thai-hoc-o-tieu-chuan-va-chi-so-da-dang/), [Ecology Bài 2: cỡ mẫu N = 25s²/x̄²](/blog/phuong-phap-lay-mau/))
	- Cho tỷ lệ: $n = \left(\dfrac{U_{\alpha/2}}{\varepsilon}\right)^2 f(1-f)$.
	- Cho trung bình (khi $n$ lớn, $t_{(n-1,\ \alpha/2)} \approx U_{\alpha/2}$): $n = \left(\dfrac{U_{\alpha/2}\,\sigma}{\varepsilon}\right)^2$.
	- Nếu đề cho **độ lớn khoảng tin cậy** thì $\varepsilon$ = độ lớn / 2; nếu cho **sai số không vượt quá x%** thì $\varepsilon = x\%$.

## Bài tập / ví dụ

| Bài | Dữ liệu | Kết quả chính |
|---|---|---|
| 1 | Calcium huyết thanh của 100 người bình thường (mg/L) | $\bar{x} = 101{,}997$; Me = 102,55; Mode = 94,9; $s^2$ = 204,93; $s$ = 14,32; P5 = 84,93; min 6, max 130,2; kurtosis 19,11, skewness −2,90. KTC của $\mu$: 99% → (98,31; 105,68), 95% → (99,19; 104,80) |
| 1 (ý 2) | Người có calcium > 100 mg/L | 60/100 người → $p = f = 0{,}6$; KTC 95% của $p$: (0,504; 0,696). Trung bình nhóm này 109,755, KTC 95%: (107,96; 111,55) |
| 2 | Chiều cao 40 thanh niên (cm), 95% | $\bar{x}$ = 162,775; $s$ = 5,06; KTC $\mu$: (161,21; 164,34); $s^2$ = 25,62, KTC $\sigma^2$: (17,64; 43,33) |
| 3 | 36 giá trị, $\alpha = 0{,}01$ | $\bar{x}$ = 101,86; $s$ = 15,30; KTC $\mu$: (95,29; 108,43); KTC $\sigma^2$: (139,73; 489,90) |
| 4 | 18 giá trị, 99% | $\bar{x}$ = 102,17; $s$ = 14,15; KTC $\mu$: (93,57; 110,76); KTC $\sigma^2$: (95,31; 597,57) |
| 5 | Bẫy chuột: 400 bẫy, 120 bẫy có chuột | $f = 0{,}3$; sai số ≤ 10%, 95% → $n = (1{,}96/0{,}1)^2 \cdot 0{,}3 \cdot 0{,}7 = 80{,}67$ → đặt ít nhất **81 bẫy** |
| 6 | Bảng tần số 17 khoảng, $n$ = 1060, $\alpha = 0{,}01$ | $\bar{x}$ = 76,40; $s^2$ = 93,95 (hiệu chỉnh 93,20); $s$ = 9,65; Me = 76,37; Mo = 76,5; P5 = 60,27; KTC $\mu$: (75,63; 77,16); KTC $\sigma^2$: (83,63; 104,63) |
| 7 | Khối lượng, 11 khoảng, $n$ = 272, $\alpha = 0{,}05$ | $\bar{x}$ = 75,53; $s$ = 9,87; Me = 74,99; Mo = 73,43; P5 = 59,33; KTC $\mu$: (74,36; 76,70); KTC $\sigma^2$: (83,19; 116,57) |
| Làm thêm | Chiều cao người lớn, $\sigma$ = 7,2 cm, sai số ≤ 1,5 cm, 95% | $n = (1{,}96 \cdot 7{,}2/1{,}5)^2 = 88{,}51$ → cỡ mẫu tối thiểu **89** |

- **Nhận xét Bài 1**: dãy số liệu có một giá trị **6,0** (các giá trị khác khoảng 80–130), nhiều khả năng là lỗi nhập liệu/outlier; chính giá trị này kéo min xuống 6, làm kurtosis rất lớn (19,1) và phân phối lệch trái mạnh.
- Trong Bài 1–2, độ lệch chuẩn và phương sai được tính bằng `STDEVP`/`VARP` (chia $n$); KTC phương sai Bài 2 dùng $n = 40$ (vì $n > 30$).
- Xem thêm: [Chim sẻ Darwin](/blog/chon-loc-tu-nhien-va-tien-hoa-loai-chim-se-darwin/) – áp dụng thống kê mô tả và KTC 95% trên số liệu chim sẻ thật
- Xem thêm: [Mô phỏng trong Virtual Lab](/projects/virtual-lab/thi-nghiem-giai-doan-4/) – bảng Phân tích số liệu tính lại bài 2 (chiều cao 40 thanh niên) khớp Excel, kèm mã R.

## Tài liệu gốc
- Chương 2 + Chương 3_ Đặc trưng thống kê của một mẫu và Ước lượng các tham số của tổng thể.xlsx
