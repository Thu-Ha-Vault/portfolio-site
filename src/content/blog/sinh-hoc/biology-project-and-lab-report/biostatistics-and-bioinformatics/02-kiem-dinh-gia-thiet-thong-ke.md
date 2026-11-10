---
title: 'Chương 4: Kiểm định giả thiết thống kê trong nghiên cứu sinh học'
type: course-note
tags:
  - biology
  - biostatistics
  - hypothesis-testing
  - anova
  - excel
  - course-note
section: Sinh học
folder: Sinh học / Biology Project and Lab Report / Biostatistics and Bioinformatics
vaultPath: >-
  Resources/Sinh học/Biology Project and Lab Report/Biostatistics and
  Bioinformatics/02 - Kiểm định giả thiết thống kê.md
url: /blog/kiem-dinh-gia-thiet-thong-ke-trong-nghien-cuu-sinh-hoc/
topic: biology
updated: '2026-10-16'
order: 2
description: >-
  File Excel gồm sheet Lý thuyết (4 dạng bài, cách làm bằng Excel Data Analysis,
  bảng tóm tắt chọn test) và 25 sheet bài tập (Bài 1–21, Ví dụ tr.76, tr.81,
  tr.119, Bài tập thêm). Hầu hết sheet có hậu tố "(HT)" là đã hoàn t
isIndex: false
---
> File Excel gồm sheet **Lý thuyết** (4 dạng bài, cách làm bằng Excel *Data Analysis*, bảng tóm tắt chọn test) và 25 sheet bài tập (Bài 1–21, Ví dụ tr.76, tr.81, tr.119, Bài tập thêm). Hầu hết sheet có hậu tố "(HT)" là đã hoàn thành.

## Khái niệm chính
- **Mức ý nghĩa $\alpha$**: ngưỡng xác suất tối đa cho phép mắc **sai lầm loại I** (bác bỏ $H_0$ khi $H_0$ đúng).
- **Các bước kiểm định**: (→ [Hypothesis Testing and p-values](/blog/hypothesis-testing-and-p-values/))
	1. Xác định giả thiết $H_0$.
	2. Định rõ mức ý nghĩa $\alpha$.
	3. Chọn test thống kê.
	4. Chọn miền bác bỏ $H_0$.
	5. Tính giá trị của test từ mẫu quan sát.
	6. Kết luận bác bỏ hay chấp nhận $H_0$.
- **Mẫu độc lập (independent samples)**: thu từ các nhóm khác nhau (vd nhóm thí nghiệm và nhóm chứng), mỗi mẫu đại diện cho 1 nhóm.
- **Mẫu liên hệ / phụ thuộc (dependent, paired samples)**: thu từ cùng một nhóm đối tượng ở 2 điều kiện (trước – sau can thiệp).
- **Căn cứ chọn test**: (→ Parametric Inference)
	- **Cỡ mẫu**: $n < 30$ → t-Test; $n > 30$ → z-Test.
	- **Số nhóm**: 2 nhóm → t-Test độc lập / ghép cặp; ≥ 3 nhóm → ANOVA hoặc Kruskal-Wallis.
	- **Loại dữ liệu**: liên tục và chuẩn → test tham số; không chuẩn → phi tham số (Mann-Whitney U, Kruskal-Wallis).
	- **Quan hệ giữa các nhóm**: độc lập hay phụ thuộc.

| Tình huống | $H_0$ | Test |
|---|---|---|
| 2 mẫu độc lập, mẫu bé | $\mu_1 = \mu_2$ | t-Test (Equal / Unequal Variances) |
| 2 mẫu độc lập, mẫu lớn | $\mu_1 = \mu_2$ | z-Test: Two Sample for Means |
| 2 mẫu liên hệ | $\mu_1 = \mu_2$ | t-Test: Paired Two Sample for Means |
| ≥ 3 mẫu độc lập | $\mu_1 = \dots = \mu_m$ | ANOVA hoặc **Kruskal-Wallis** (phi tham số) |
| ≥ 3 mẫu liên hệ | $\mu_1 = \dots = \mu_m$ | **Friedman** (phi tham số) |
| 2 biến phân loại (bảng tần số) | 2 biến không liên hệ | $\chi^2$ (Chi-square) |

- Ngoài ra sheet tóm tắt liệt kê **Pearson's r** (tương quan 2 biến định lượng) và **Spearman's rank** (khi biến không chuẩn) → xem [03 - Tương quan và hồi quy](/blog/tuong-quan-va-hoi-quy/).

## Công thức / phương pháp

### Dạng 1: Kiểm định $\chi^2$ cho kết quả định tính
- Dùng khi kết quả quan sát chia thành nhiều cấp chất lượng (màu sắc; tác dụng tốt/trung bình/xấu; nhiễm khuẩn hay không…), bảng $k \times r$ ($k$ mẫu, $r$ cấp). $H_0$: không có mối liên hệ giữa hai biến. (→ Inference About Independence, [Bảng tần số chéo bằng R](/blog/bai-tap-r-co-ban-buoi-5-buoi-6-va-buoi-7/))
- Lập bảng 5 cột: $T_a$ (tổng hàng), $T_b$ (tổng cột), $O_{ij}$ (quan sát), $C_{ij}$ (kỳ vọng), $\chi^2$ thành phần:
	- $C_{ij} = \dfrac{T_{a_i} \cdot T_{b_j}}{T}$ (nếu $H_0$ đúng thì $O_{ij} \approx C_{ij}$); nên cố định ô $T_{a_i}, T_{b_j}$ khi kéo công thức.
	- $\chi^2 = \sum \dfrac{(O_{ij} - C_{ij})^2}{C_{ij}}$, bậc tự do $df = (k-1)(r-1)$. (→ [Quy luật Mendel](/blog/quy-luat-mendel/), [Kiểm định số liệu lai ảo – Virtual Lab](/projects/virtual-lab/danh-muc-thi-nghiem-ao/), [χ² trong protocol Mendel – Virtual Lab](/projects/virtual-lab/bo-khung-phong-thi-nghiem-3d/))
- So sánh với $\chi^2_\alpha$ = `CHIINV(α; df)` cho $\alpha$ = 0,1; 0,05; 0,01 (nếu đề không hỏi thì xét cả 90%, 95%, 99%). Kết luận bằng `IF(tổng χ² > χ²α; "Ho bị bác bỏ"; "Ho được chấp nhận")`.

### Dạng 2: Hai mẫu liên hệ (ghép đôi)
- Mỗi phần tử mẫu 1 ghép với một phần tử mẫu 2; xét hiệu $d$. Nếu $H_0$ đúng và $d$ phân phối chuẩn: $t = \dfrac{\bar{d}}{s_d / \sqrt{n}}$, $df = n - 1$ ($s_d$: độ lệch chuẩn của dãy $d$).
- Excel: *Data Analysis → t-Test: Paired Two Sample for Means*; Hypothesized Mean Difference = 0; khai báo Labels, $\alpha$, Output range.
- Kết luận: $\lvert t\ Stat \rvert < t\ Critical\ two\text{-}tail$ → chấp nhận $H_0$ (khác nhau ngẫu nhiên); ngược lại bác bỏ $H_0$.

### Dạng 3: Hai mẫu độc lập
- **Mẫu bé ($n < 30$)** – t-Test: (→ [Chim sẻ Darwin](/blog/chon-loc-tu-nhien-va-tien-hoa-loai-chim-se-darwin/), [Hoạt độ lipase](/blog/hoat-do-enzyme/))
	- **Bước 1 – F-Test** (`FTEST(mảng1; mảng2)`), $H_0'$: $\sigma_1^2 = \sigma_2^2$. Nếu $p > 0{,}05$ → phương sai bằng nhau → **t-Test: Two-Sample Assuming Equal Variances**; nếu $p < 0{,}05$ → **Unequal Variances**.
	- Phương sai chung: $s^2 = \dfrac{(n_1-1)s_1^2 + (n_2-1)s_2^2}{n_1 + n_2 - 2}$; $t = \dfrac{\bar{x}_1 - \bar{x}_2}{s\sqrt{1/n_1 + 1/n_2}}$, $df = n_1 + n_2 - 2$, ngưỡng `TINV()`.
	- $\lvert t \rvert \ge t_{(n_1+n_2-2,\ \alpha/2)}$ → bác bỏ $H_0$; nếu $t$ dương thì $\mu_1 > \mu_2$, âm thì $\mu_1 < \mu_2$.
- **Mẫu lớn ($n > 30$)** – **z-Test: Two Sample for Means**: khai báo phương sai mẫu (tính bằng hàm) vào ô *Known Variance*. $\lvert z\ Stat \rvert > z\ Critical\ two\text{-}tail$ → hai trung bình khác nhau rõ rệt.

### Dạng 4: Nhiều mẫu độc lập ($m \ge 3$)
- **Kruskal-Wallis (phi tham số)**: gộp và sắp xếp (SORT) toàn bộ số liệu, đánh hạng (giá trị trùng lấy hạng trung bình), dùng `VLOOKUP` gán hạng về từng mẫu, tính tổng hạng $R_i$ mỗi mẫu:
	- $H = \dfrac{12}{n(n+1)} \sum \dfrac{R_i^2}{n_i} - 3(n+1)$, phân phối $\chi^2$ với $df = m - 1$.
	- $H > \chi^2_\alpha$: bác bỏ $H_0$, các mẫu thuộc các tổng thể khác nhau; $H \le \chi^2_\alpha$: các mẫu từ một tổng thể.
- **ANOVA một nhân tố (Single Factor)**: nhân tố A chia $a$ cấp. Giả định các $x_{ij}$ chuẩn, phương sai bằng nhau.

| Nguồn biến sai | Tổng biến sai | Bậc tự do | Phương sai | Kỳ vọng phương sai | F |
|---|---|---|---|---|---|
| Do nhân tố A | $V_A$ | $a - 1$ | $s^2_A$ | $\sigma^2 + m\sigma^2_a$ | $s^2_A / s^2_E$ |
| Ngẫu nhiên | $V_E$ | $n - a$ | $s^2_E$ | $\sigma^2$ | |
| Chung | $V_T$ | $n - 1$ | | | |

- $F_{STAT} > F_{crit}$ (bậc tự do $k_1 = a-1$, $k_2 = n-a$) → bác bỏ $H_0$: nhân tố có tác động thật.
- **ANOVA hai nhân tố không lặp (Two-Factor Without Replication)**: bố trí **khối ngẫu nhiên đầy đủ (RCB)** – nhân tố A có $a$ cấp, lặp theo khối B ($b$ khối: nền đất, thủy vực…). $f_A = s^2_A / s^2_N$ ($df$: $a-1$; $(a-1)(b-1)$), $f_B = s^2_B / s^2_N$ ($df$: $b-1$; $(a-1)(b-1)$). Trong output: *Rows* = nhân tố A, *Columns* = khối B, *Error* = biến sai ngẫu nhiên. (→ [Độc tính Propylene Glycol](/blog/danh-gia-tac-dong-cua-propylene-glycol-pg-len-su-phat-trien-phoi-ca-ngua-van/))
- **ANOVA hai nhân tố có lặp (With Replication, $m$ lần)**: thêm biến sai tương tác $V_{AB}$ ($df = (a-1)(b-1)$), biến sai ngẫu nhiên $df = ab(m-1)$; khai báo số lần lặp ở *Rows per Sample*. Output: *Sample* (nhân tố B), *Columns* (nhân tố A), *Interaction*, *Within*.
- **Hệ số di truyền** $h^2$ (khi so sánh giống cây/con và $H_0$ bị bác bỏ): $0 \le h^2 \le 1$; gần 0 → đặc trưng do môi trường quyết định, gần 1 → do di truyền.
	- Ước lượng tác động của nhân tố giống $\hat{\sigma}^2_A$ từ hiệu $s^2_A - s^2_E$, rồi $h^2 = \dfrac{\hat{\sigma}^2_A}{\hat{\sigma}^2_A + \sigma^2_E}$. Trong file (Bài 6, 13), $\hat{\sigma}^2_A = (s^2_A - s^2_E)/a$ và mẫu số dùng $s^2_E / a$ ($a$ = số giống).

## Bài tập / ví dụ

| Bài | Nội dung | Test | Kết quả |
|---|---|---|---|
| 1 | Phản ứng của 348 chuột với 2 lô vacxin (nhẹ/TB/nặng) | $\chi^2$ | $\chi^2 = 8{,}71$, $df = 2$; $\chi^2_\alpha$ = 4,61 / 5,99 / 9,21 → khác nhau ở độ tin cậy 90% và 95%, ngẫu nhiên ở 99% |
| 2 | 3 loại phân bón + đối chứng, kích thích ra hoa | $\chi^2$ | $\chi^2 = 21{,}11$ → bác bỏ $H_0$, các loại phân tác động khác nhau (99%) |
| 3 | 2 môi trường nuôi cấy mô (22 cặp), số mầm | Paired t | TB 3,05 vs 4,68; $t = -6{,}52$, $p_{2\text{-}tail} = 1{,}8 \times 10^{-6}$ → bác bỏ $H_0$; **MT2** thích hợp hơn |
| 4 | Izozym carboxyl esteraza ở công nhân dùng thuốc trừ sâu lân hữu cơ | F-Test → t (equal var.) | $\lvert t \rvert > t_{crit}$ → bác bỏ $H_0$ (95%) |
| 5 | Tử vong trẻ < 1 tuổi: xã bị rải chất diệt cỏ vs không | F-Test → t (equal var.) | TB tỷ lệ 0,051 vs 0,024; $t = 1{,}65 < t_{crit} = 4{,}30$, $p = 0{,}24$ (chỉ 2 quan sát/xã); file không ghi kết luận |
| 6, 12 | Năng suất 4 giống lúa, 5 lần lặp | ANOVA 1 nhân tố | $F = 16{,}85 > F_{crit} = 3{,}24$, $p = 3{,}3 \times 10^{-5}$; G2 cao nhất (8,6) nhưng kém ổn định, G4 ổn định nhất; $h^2 = 0{,}94$ |
| 7 | Rau câu: ánh sáng (2 mức) × nhiệt độ (6 mức) | ANOVA 2 nhân tố không lặp | $F_A = 169{,}8 > 6{,}61$; $F_B = 232{,}1 > 5{,}05$ → cả hai nhân tố đều ảnh hưởng |
| 8 | Sản lượng sữa đàn bò thuần (97 con) vs lai F1 (72 con) | $\chi^2$ | Bác bỏ $H_0$ (99%), khác nhau về bản chất di truyền |
| 9 | Tiết mủ 6 giống cao su × 5 chế độ phân vi lượng | ANOVA 2 nhân tố không lặp | Cả giống và chế độ phân đều có ảnh hưởng |
| 10 | 3 môi trường nuôi cấy hạt phấn lúa tám thơm (mẫu liên hệ) | Paired t cho 3 cặp | Mới lập giả thiết, chưa có kết quả ("được giảm tải") |
| 11 | Chống chịu sâu bệnh của ngô ở 4 chế độ phân vi lượng | ANOVA 1 nhân tố | Bác bỏ $H_0$ (95%) |
| 13 | Sản lượng mật 3 giống ong (9 tổ/giống) | ANOVA 1 nhân tố | $F = 9{,}75 > 3{,}40$, $p = 0{,}0008$; giống **c** cao nhất và ổn định nhất; $h^2 = 0{,}90$ |
| 14, 15 | Tỷ lệ chết cá đuôi cờ theo nồng độ thuốc trừ sâu × thời gian | ANOVA 2 nhân tố | Cả nồng độ và thời gian đều ảnh hưởng (95%) |
| 16, 18 | Cường độ quang hợp lá cà phê vối (che bóng / mùa × giờ trong ngày) | ANOVA 2 nhân tố | Cả hai nhân tố đều có ảnh hưởng |
| 19 | Tỷ lệ chlorofil a/b ở thực vật C3 (10) và C4 (13) | F-Test ($p = 0{,}97$) → t (equal var.) | 2,53 vs 3,46; $t = -4{,}65$, $p = 1{,}4 \times 10^{-4}$ → khác nhau có ý nghĩa |
| 20 | Chlorofil a ở lúa, ngô, bông | ANOVA 1 nhân tố | $F = 18{,}56 > 5{,}14$; bông cao nhất |
| 21 | Cường độ quang hợp C3 vs C4 | t-Test | Bác bỏ $H_0$ (95%) |
| Ví dụ tr.81 | Enzym carboxin esteraza – ô nhiễm thuốc diệt côn trùng | z-Test | $\lvert z \rvert > z_{crit}$ → khác nhau có ý nghĩa (95%) |
| Bài tập thêm | IgA và protein huyết thanh: người bình thường vs viêm gan siêu vi, 99% | F-Test → t | Cả 2 chỉ tiêu khác nhau có ý nghĩa (99%) |

- Bài 17 và Ví dụ tr.119 (6 chủng nấm men × 5 môi trường) chỉ có đề, chưa làm.
- Xem thêm: [Quang hợp và hô hấp ở thực vật](/blog/quang-hop-va-ho-hap-o-thuc-vat/) – bài t-test C3/C4 và ANOVA quang hợp lá cà phê (Bài 16, 18, 21)
- Xem thêm: [Mô phỏng trong Virtual Lab](/projects/virtual-lab/thi-nghiem-giai-doan-4/) – bài 1, 3, 6, 13, 19 tính lại bằng bảng Phân tích số liệu, khớp kết quả Excel.

## Tài liệu gốc
- Chương 4_ Kiểm định giả thiết thống kê trong nghiên cứu sinh học.xlsx
