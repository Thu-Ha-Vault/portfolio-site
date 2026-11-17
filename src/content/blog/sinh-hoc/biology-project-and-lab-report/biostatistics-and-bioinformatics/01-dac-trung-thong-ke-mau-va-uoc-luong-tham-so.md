---
title: >-
  Khoảng tin cậy trong số liệu sinh học: n hay n−1, z hay t, và một giá trị 6,0
  mg/L làm lệch cả mẫu
type: article
tags:
  - article
  - biology
  - biostatistics
  - confidence-interval
  - excel
section: Sinh học
folder: Sinh học / Biology Project and Lab Report / Biostatistics and Bioinformatics
vaultPath: >-
  Projects/Portfolio Website/Bài viết/Sinh học/BV - 01 - Đặc trưng thống kê mẫu
  và ước lượng tham số.md
url: /blog/3-dac-trung-thong-ke-cua-mot-mau-va-uoc-luong-tham-so-cua-tong-the/
topic: biology
updated: '2026-11-17'
date: '2026-11-17'
status: draft
order: 1
translationUrl: /en/blog/3-dac-trung-thong-ke-cua-mot-mau-va-uoc-luong-tham-so-cua-tong-the/
translationTitle: 'Confidence intervals in biology: n or n−1, z or t, and one 6.0 mg/L outlier'
description: >-
  Tính khoảng tin cậy cho trung bình, phương sai và tỷ lệ trên Excel và Python:
  STDEV hay STDEVP, CONFIDENCE hay CONFIDENCE.T, Wilson, và xử lý ngoại lai.
isIndex: false
---
Hàm `CONFIDENCE` của Excel dùng phân phối chuẩn, không phải phân phối t (Microsoft, n.d.-a): với 18 quan sát, khoảng 99% của trung bình là (93,57; 110,76) theo `CONFIDENCE` nhưng là (92,50; 111,83), rộng hơn 12,5%, theo t. Trong một bộ 100 giá trị calcium huyết thanh, riêng một giá trị 6,0 mg/L đẩy kurtosis lên 19,11; bỏ nó đi, kurtosis còn −0,10. Bài đi qua bốn quyết định khi tính khoảng tin cậy: chia n hay n−1, dùng z hay t, chọn khoảng nào cho tỷ lệ, và xử lý một giá trị lạc lõng, kèm code Python chạy lại được.

## 1. Mở đầu: khoảng tin cậy là kết quả, không phải bước trung gian

Với `AVERAGE`, `STDEV`, `VAR`, `CHIINV` và `CONFIDENCE`, Excel tính được gần hết phần thống kê mô tả và ước lượng tham số. Cái giá của sự tiện lợi là công thức trên giấy và hàm trong bảng tính không phải lúc nào cũng khớp nhau, và người dùng ít khi thấy chỗ lệch.

Khoảng tin cậy (confidence interval, CI) không chỉ là bước trung gian trước kiểm định. Cumming (2014) đề nghị lấy ước lượng cỡ hiệu ứng kèm CI làm kết quả chính thay cho p-value, và Krzywinski và Altman (2013) nhấn mạnh việc báo cáo độ bất định đi kèm mỗi ước lượng. Nếu CI là kết quả bạn báo cáo, cách tính nó đáng được kiểm tra kỹ như cách đo mẫu.

Cũng cần tách độ lệch chuẩn (standard deviation, SD) khỏi sai số chuẩn (standard error, SE). SD mô tả mức phân tán của từng quan sát; SE, bằng SD chia √n, mô tả độ bất định của trung bình mẫu. Altman và Bland (2005) nhắc rằng muốn mô tả dữ liệu thì báo cáo SD, muốn nói trung bình chính xác đến đâu thì dùng SE hoặc CI. Tăng cỡ mẫu làm SE nhỏ đi, còn SD thì không.

Bốn vấn đề được xếp theo mức ảnh hưởng tăng dần: n hay n−1 (mục 3), z hay t (mục 4), khoảng cho tỷ lệ (mục 5) và một ngoại lai (mục 6, phần trọng tâm). Phần kiểm định và hồi quy nằm ở Kiểm định giả thiết thống kê và Tương quan và hồi quy.

## 2. Dữ liệu và cách tính

### 2.1. Các bộ số liệu

Các ví dụ dùng năm bộ số liệu luyện tập kiểu giáo trình thống kê sinh học và một bài toán cỡ mẫu (Bảng 1). Nguồn đo gốc không rõ, và mục 6.5 cho thấy bộ calcium nhiều khả năng là số liệu minh hoạ, nên mọi nhận xét sinh học ở đây chỉ là kiểm tra tính hợp lý, không phải kết luận lâm sàng. Bộ calcium và bộ 18 giá trị được chép nguyên vào các khối code.

**Bảng 1.** Các bộ số liệu dùng trong bài

| Bộ số liệu | n | Ước lượng |
| --- | --- | --- |
| Calcium huyết thanh (mg/L) | 100 | CI 95%, 99% cho μ; tỷ lệ > 100 mg/L |
| Chiều cao thanh niên (cm) | 40 | CI 95% cho μ và σ² |
| Biến định lượng | 36 | CI 99% cho μ và σ² |
| Tập con của bộ trên | 18 | CI 99% cho μ và σ² |
| Bẫy có chuột: 120/400 | 400 | CI 95% cho p; số bẫy cần đặt |
| Chiều cao người lớn, σ = 7,2 cm | — | n để sai số ≤ 1,5 cm, 95% |

Mục 7 dùng thêm một bảng tần số chia lớp (n = 1060).

### 2.2. Công cụ và các khoảng được so sánh

Phần tính toán dùng Python 3 (numpy, scipy, pandas), kèm vài dòng R tương đương. Skewness và kurtosis được tính đúng theo công thức của `SKEW` và `KURT` trong Excel (mục 6.2). Với trung bình, mỗi bộ số liệu được tính theo ba cách:

- **(a) z với s chia n**: `CONFIDENCE(α; STDEVP(…); n)`. Đây là cách ghép hàm mà quy tắc "mẫu lớn thì dùng `STDEVP`" dẫn tới.
- **(b) z với s chia n−1**: `CONFIDENCE.NORM(α; STDEV.S(…); n)`.
- **(c) t với s chia n−1**: `CONFIDENCE.T(α; STDEV.S(…); n)`, khoảng chuẩn dựa trên phân phối Student (Student, 1908).

Với phương sai, khoảng chuẩn dựa trên χ² với (n−1)s². Với tỷ lệ, bốn khoảng được so sánh: Wald, Wilson (Wilson, 1927), Agresti–Coull (Agresti & Coull, 1998) và Clopper–Pearson. Với giá trị 6,0 mg/L, phân tích độ nhạy gồm bốn kịch bản: giữ, loại, thay bằng 96,0 hoặc 106,0 (giả định lỗi gõ thiếu chữ số, chỉ để minh hoạ). Ngưỡng phát hiện ngoại lai lấy theo Leys et al. (2013); đơn vị calcium được quy đổi bằng khối lượng nguyên tử 40,078 (CIAAW, n.d.) để đối chiếu với khoảng tham chiếu đã công bố (Jassam et al., 2020; Yang et al., 2022).

## 3. n hay n−1: hai lần hiệu chỉnh và không lần nào

### 3.1. STDEV và STDEVP khác nhau ở đâu

`STDEVP` (nay là `STDEV.P`) chia tổng bình phương độ lệch cho n; `STDEV` (nay là `STDEV.S`) chia cho n−1. Khi ước lượng phương sai tổng thể từ một mẫu, chia n−1 (hiệu chỉnh Bessel) cho ước lượng không chệch của σ² với **mọi** cỡ mẫu; không có ngưỡng 30 nào làm phép chia n trở thành đúng.

Bruce và Bruce (2017) nhận xét rằng chọn n hay n−1 hiếm khi quan trọng vì n thường đủ lớn. Bảng 2 cho thấy điều đó đúng khi n thật sự lớn: ở n = 100 hai SD lệch nhau 0,5%, ở n = 18 gần 3%.

**Bảng 2.** Độ lệch chuẩn tính theo n và n−1

| Bộ số liệu | n | SD chia n (`STDEV.P`) | SD chia n−1 (`STDEV.S`) | Chênh lệch |
| --- | --- | --- | --- | --- |
| Calcium | 100 | 14,315 | 14,387 | 0,5% |
| Chiều cao | 40 | 5,062 | 5,127 | 1,3% |
| 36 giá trị | 36 | 15,296 | 15,512 | 1,4% |
| 18 giá trị | 18 | 13,753 | 14,151 | 2,9% |

Chênh lệch luôn bằng √(n/(n−1)) − 1.

### 3.2. Một đẳng thức đáng nhớ

Gọi $s_P$ là SD chia n và $s$ là SD chia n−1. Vì $n s_P^2 = (n-1) s^2$, ta có:

$$\frac{s_P}{\sqrt{n-1}} = \frac{s}{\sqrt{n}}$$

<div class="callout callout-note">
<p class="callout-title">Hai cách viết cùng một sai số chuẩn</p>

$$\varepsilon = t_{(n-1;\,\alpha/2)} \cdot \frac{s_P}{\sqrt{n-1}} = t_{(n-1;\,\alpha/2)} \cdot \frac{s}{\sqrt{n}}$$
Công thức bên trái dùng SD chia n và chia tiếp cho √(n−1); công thức bên phải dùng SD chia n−1 và chia cho √n. Hai cách cho cùng một kết quả. Chỉ cần nhớ: **hiệu chỉnh đúng một lần**.

</div>

Nếu bảng công thức bạn dùng viết sai số của trung bình dưới dạng bên trái, $t \cdot s/\sqrt{n-1}$ với s là SD chia n, thì công thức đó đúng về đại số. Vấn đề chỉ nảy sinh ở chỗ nối giữa công thức và hàm.

### 3.3. Bẫy cộng dồn

Có hai cách ghép sai, ngược chiều nhau:

- **Hiệu chỉnh hai lần**: dùng `STDEV` (đã chia n−1) rồi lại chia cho √(n−1). Khoảng bị nới thêm một hệ số √(n/(n−1)), tức rộng hơn cần thiết.
- **Không hiệu chỉnh lần nào**: dùng `STDEVP` (chia n) rồi đưa vào `CONFIDENCE`, vốn chia cho √n. Kết quả là $z \cdot s_P/\sqrt{n}$, hẹp hơn khoảng đúng một hệ số √((n−1)/n), trước cả khi tính đến chuyện z hay t.

Cách thứ hai xảy ra khi bạn theo quy tắc "mẫu lớn dùng `STDEVP`" rồi gọi `CONFIDENCE(α; s; n)`.

### 3.4. Với phương sai thì không có lỗi

Khoảng tin cậy cho σ² có dạng

$$\left(\frac{(n-1)s^2}{\chi^2_{\alpha/2;\,n-1}};\ \frac{(n-1)s^2}{\chi^2_{1-\alpha/2;\,n-1}}\right)$$

với $\chi^2_{\alpha/2}$ là phân vị trên. Vì $n \cdot s_P^2 = (n-1) \cdot s^2$, viết tử số là `n*VARP(…)` hay `(n-1)*VAR(…)` đều cho cùng một con số. Tính lại cho ba bộ số liệu: chiều cao (17,64; 43,33), bộ 36 giá trị (139,73; 489,90) và bộ 18 giá trị (95,31; 597,57), cả ba khớp với công thức chuẩn dù tử số được viết theo cách nào. Lý do là đẳng thức trên, chứ không phải vì "n > 30 thì dùng n". Bậc tự do của χ² vẫn là n−1 trong mọi trường hợp.

### 3.5. Hiệu chỉnh Sheppard không phải hiệu chỉnh Bessel

Với dữ liệu gộp lớp, phương sai tính từ trị số giữa lớp lớn hơn phương sai thật xấp xỉ d²/12, với d là độ dài lớp; Sheppard (1897) đề xuất trừ đi lượng này: $s^2 - d^2/12$. Bessel sửa độ chệch do ước lượng trung bình từ chính mẫu, Sheppard sửa sai số do gộp lớp: hai hiệu chỉnh khác nhau, nên khi báo cáo cần ghi rõ đã dùng cái nào (ví dụ ở mục 7).

## 4. z hay t: CONFIDENCE không phải là t

### 4.1. Hàm nào dùng phân phối nào

Theo trang hỗ trợ của Microsoft, `CONFIDENCE` trả về khoảng tin cậy của trung bình "using a normal distribution" và đã được thay bằng các hàm mới (Microsoft, n.d.-a): `CONFIDENCE.NORM`, vẫn dùng phân phối chuẩn, và `CONFIDENCE.T`, dùng phân phối Student (Microsoft, n.d.-b). Dù bảng công thức ghi $t_{(n-1;\,\alpha/2)}$, hàm `CONFIDENCE` vẫn nhân với z.

Phân phối t ra đời cho đúng tình huống này: khi σ chưa biết và được thay bằng s của một mẫu nhỏ, tỷ số $(\bar{x} - \mu)/(s/\sqrt{n})$ có đuôi dày hơn phân phối chuẩn (Student, 1908). Dùng z là bỏ qua phần bất định do chính s gây ra.

### 4.2. Hẹp đi bao nhiêu

Tỷ số t/z chỉ phụ thuộc vào n và mức tin cậy (Bảng 3); cột cuối là hệ số √(n/(n−1)) của mục 3 để so sánh.

**Bảng 3.** Tỷ số t/z theo cỡ mẫu và mức tin cậy

| n | t/z ở 95% | t/z ở 99% | √(n/(n−1)) |
| --- | --- | --- | --- |
| 18 | 1,076 | 1,125 | 1,029 |
| 36 | 1,036 | 1,057 | 1,014 |
| 40 | 1,032 | 1,051 | 1,013 |
| 100 | 1,012 | 1,020 | 1,005 |
| 1000 | 1,001 | 1,002 | 1,001 |

Ở cùng cỡ mẫu, chọn z hay t ảnh hưởng gấp khoảng 2,5 đến hơn 4 lần chọn n hay n−1, và ảnh hưởng tăng theo mức tin cậy: với n = 18, t(17; 0,995) = 2,898 so với z = 2,576. Bảng 4 và Hình 1 áp dụng ba cách tính cho bốn bộ số liệu.

**Bảng 4.** Nửa độ rộng ε của khoảng tin cậy cho trung bình theo ba cách tính

| Bộ số liệu | Mức | (a) z, s chia n | (b) z, s chia n−1 | (c) t, s chia n−1 | (c)/(a) | (c)/(b) |
| --- | --- | --- | --- | --- | --- | --- |
| Calcium, n = 100 | 95% | 2,806 | 2,820 | 2,855 | 1,017 | 1,012 |
| Calcium, n = 100 | 99% | 3,687 | 3,706 | 3,779 | 1,025 | 1,020 |
| Chiều cao, n = 40 | 95% | 1,569 | 1,589 | 1,640 | 1,045 | 1,032 |
| 36 giá trị | 99% | 6,566 | 6,660 | 7,042 | 1,072 | 1,057 |
| 18 giá trị | 99% | 8,350 | 8,592 | 9,667 | 1,158 | 1,125 |

![bv-01-ac-trung-thong-ke-mau-va-uoc-luong-th-1](/vault-assets/bv-01-ac-trung-thong-ke-mau-va-uoc-luong-th-1-26b0907d.webp)

**Hình 1.** Khoảng tin cậy cho trung bình của bốn bộ số liệu, tính theo ba cách; số bên phải là tỷ số độ rộng giữa cách (c) và cách (a).

Ở n = 100, khoảng 95% đúng (99,14; 104,85) và khoảng theo cách (a) (99,19; 104,80) gần như trùng nhau. Với chiều cao 40 thanh niên, khoảng t (161,14; 164,41) rộng hơn cách (a) 4,5%. Với bộ 18 giá trị ở mức 99%, khoảng z là (93,57; 110,76), khoảng t là (92,50; 111,83), rộng hơn 12,5%, và rộng hơn cách (a) 15,8%. Một khoảng "99%" tính bằng z ở n = 18 thực chất có độ tin cậy thấp hơn 99%.

### 4.3. Tự tính lại

Code dưới tính lại bộ 18 giá trị và kiểm tra đẳng thức ở mục 3.2:

```python
import math
import numpy as np
from scipy import stats

x = np.array([76, 84, 89, 85, 90, 95, 96, 97, 100,
              100, 111, 112, 115, 112, 115, 117, 122, 123], dtype=float)
n, alpha = len(x), 0.01
mean = x.mean()
s_p = x.std(ddof=0)          # STDEV.P: chia n
s = x.std(ddof=1)            # STDEV.S: chia n - 1
z = stats.norm.ppf(1 - alpha / 2)
t = stats.t.ppf(1 - alpha / 2, df=n - 1)

print(f"n = {n}, trung bình = {mean:.3f}, s_P = {s_p:.3f}, s = {s:.3f}")
print(f"s_P/sqrt(n-1) = {s_p / math.sqrt(n - 1):.4f} ; s/sqrt(n) = {s / math.sqrt(n):.4f}")
print(f"z = {z:.3f} ; t(17) = {t:.3f}")
for name, half in [("CONFIDENCE.NORM, s", z * s / math.sqrt(n)),
                   ("CONFIDENCE.T, s   ", t * s / math.sqrt(n))]:
    print(f"{name}: ε = {half:.3f} -> ({mean - half:.2f}; {mean + half:.2f})")
lo, hi = stats.t.interval(0.99, df=n - 1, loc=mean, scale=stats.sem(x))
print(f"scipy t.interval: ({lo:.2f}; {hi:.2f})")
```

```text
n = 18, trung bình = 102.167, s_P = 13.753, s = 14.151
s_P/sqrt(n-1) = 3.3355 ; s/sqrt(n) = 3.3355
z = 2.576 ; t(17) = 2.898
CONFIDENCE.NORM, s: ε = 8.592 -> (93.57; 110.76)
CONFIDENCE.T, s   : ε = 9.667 -> (92.50; 111.83)
scipy t.interval: (92.50; 111.83)
```

Cách tính tương ứng trong Excel (dữ liệu ở A2:I3; giá trị kỳ vọng lấy từ phép tính trên) và trong R:

```text
Excel:  =CONFIDENCE.T(0.01, STDEV.S(A2:I3), COUNT(A2:I3))     kỳ vọng 9.667
        =CONFIDENCE.NORM(0.01, STDEV.S(A2:I3), COUNT(A2:I3))  kỳ vọng 8.592
```

```r
x <- c(76, 84, 89, 85, 90, 95, 96, 97, 100, 100, 111, 112, 115, 112, 115, 117, 122, 123)
t.test(x, conf.level = 0.99)$conf.int                 # khoảng t cho trung bình
prop.test(120, 400, correct = FALSE)$conf.int         # khoảng Wilson cho tỷ lệ
binom.test(120, 400)$conf.int                         # Clopper–Pearson
```

```text
[1]  92.49951 111.83383
attr(,"conf.level")
[1] 0.99
[1] 0.2571677 0.3466372
attr(,"conf.level")
[1] 0.95
[1] 0.2554667 0.3475219
attr(,"conf.level")
[1] 0.95
```

### 4.4. Cỡ mẫu theo t

Cỡ mẫu cho trung bình thường tính bằng $n = (z\,\sigma/\varepsilon)^2$: với σ = 7,2 cm, ε = 1,5 cm, mức 95%, được 88,51, làm tròn lên 89. Nếu σ thật sự đã biết thì dùng z là hợp lý. Nếu s sẽ được ước lượng từ chính mẫu và CI tính bằng t, cần lặp tìm n nhỏ nhất sao cho $t_{(n-1)} \cdot 7{,}2/\sqrt{n} \le 1{,}5$, được n = 91. Xấp xỉ "t ≈ z khi bậc tự do lớn" là một giả định cần ghi rõ.

```python
import math
from scipy import stats

z = stats.norm.ppf(0.975)
p = 0.3
for eps in (0.10, 0.03):                       # tuyệt đối 0,10 hay tương đối 10% của 0,3
    print(f"tỷ lệ, ε = {eps:.2f}: n = {z**2 * p * (1 - p) / eps**2:.1f}")
print(f"ε đạt được với n = 400: {z * math.sqrt(p * (1 - p) / 400):.3f}")

sigma, eps = 7.2, 1.5                          # cỡ mẫu cho trung bình
print(f"theo z: n = {(z * sigma / eps) ** 2:.2f}")
n = 2
while stats.t.ppf(0.975, n - 1) * sigma / math.sqrt(n) > eps:
    n += 1
print(f"theo t (lặp): n = {n}, t = {stats.t.ppf(0.975, n - 1):.3f}")
```

```text
tỷ lệ, ε = 0.10: n = 80.7
tỷ lệ, ε = 0.03: n = 896.3
ε đạt được với n = 400: 0.045
theo z: n = 88.51
theo t (lặp): n = 91, t = 1.987
```

Ba dòng đầu dùng cho bài toán bẫy chuột ở mục 5.3.

### 4.5. Độ chính xác số học là chuyện khác

McCullough và Heiser (2008) kết luận rằng Excel 2007 vẫn không vượt qua bộ kiểm tra độ chính xác tiêu chuẩn ở ba mảng: phân phối thống kê, sinh số ngẫu nhiên và ước lượng. Đánh giá này không nói gì về phiên bản bạn đang dùng, nhưng kết quả sẽ được báo cáo thì nên đối chiếu ít nhất một lần với R hoặc Python.

## 5. Khoảng tin cậy cho tỷ lệ: khi nào Wald đủ dùng

### 5.1. Bốn khoảng trên hai bộ số liệu

Khoảng quen thuộc nhất cho tỷ lệ là Wald, $\hat{p} \pm z\sqrt{\hat{p}(1-\hat{p})/n}$. Brown, Cai và DasGupta (2001) cho thấy xác suất bao phủ của nó dao động thất thường và có thể thấp hơn nhiều mức danh nghĩa, kể cả khi n không nhỏ. Hai lựa chọn thay thế là khoảng Wilson, giải ngược từ phép kiểm định z (Wilson, 1927), và Agresti–Coull, về cơ bản là "cộng thêm 2 thành công và 2 thất bại" rồi dùng công thức Wald (Agresti & Coull, 1998). Clopper–Pearson dựa trên phân phối nhị thức chính xác và thường rộng hơn cần thiết. Bảng 5 so sánh bốn khoảng.

**Bảng 5.** Khoảng tin cậy 95% cho tỷ lệ theo bốn phương pháp

| Dữ liệu | $\hat{p}$ | Wald | Wilson | Agresti–Coull | Clopper–Pearson |
| --- | --- | --- | --- | --- | --- |
| Calcium > 100 mg/L: 60/100 | 0,60 | (0,504; 0,696) | (0,502; 0,691) | (0,502; 0,691) | (0,497; 0,697) |
| Bẫy có chuột: 120/400 | 0,30 | (0,255; 0,345) | (0,257; 0,347) | (0,257; 0,347) | (0,255; 0,348) |
| Ví dụ thêm: 2/30 | 0,067 | (−0,023; 0,156) | (0,018; 0,213) | (0,008; 0,224) | (0,008; 0,221) |

Với 60/100 và 120/400, Wald không sai: tỷ lệ xa 0 và 1, n đủ lớn, bốn khoảng chỉ lệch ở chữ số thứ ba. Khác biệt lộ ra ở dòng cuối: với 2 ca dương tính trên 30 mẫu, tình huống thường gặp khi ước lượng tỷ lệ nhiễm hay tỷ lệ đột biến, cận dưới của Wald là −0,023, một tỷ lệ âm vô nghĩa.

```python
import math
from scipy import stats

def proportion_cis(k, n, conf=0.95):
    z = stats.norm.ppf(1 - (1 - conf) / 2)
    p = k / n
    w = z * math.sqrt(p * (1 - p) / n)
    wald = (p - w, p + w)
    centre = (p + z**2 / (2 * n)) / (1 + z**2 / n)
    half = z / (1 + z**2 / n) * math.sqrt(p * (1 - p) / n + z**2 / (4 * n**2))
    wilson = (centre - half, centre + half)
    n_t = n + z**2                        # Agresti–Coull: thêm z²/2 thành công, z²/2 thất bại
    p_t = (k + z**2 / 2) / n_t
    w_t = z * math.sqrt(p_t * (1 - p_t) / n_t)
    ac = (p_t - w_t, p_t + w_t)
    cp = stats.binomtest(k, n).proportion_ci(confidence_level=conf, method="exact")
    return {"Wald": wald, "Wilson": wilson, "Agresti–Coull": ac,
            "Clopper–Pearson": (cp.low, cp.high)}

for k, n in [(60, 100), (120, 400), (2, 30)]:
    row = "  ".join(f"{m} ({lo:.3f}; {hi:.3f})" for m, (lo, hi) in proportion_cis(k, n).items())
    print(f"{k}/{n}: {row}")
```

```text
60/100: Wald (0.504; 0.696)  Wilson (0.502; 0.691)  Agresti–Coull (0.502; 0.691)  Clopper–Pearson (0.497; 0.697)
120/400: Wald (0.255; 0.345)  Wilson (0.257; 0.347)  Agresti–Coull (0.257; 0.347)  Clopper–Pearson (0.255; 0.348)
2/30: Wald (-0.023; 0.156)  Wilson (0.018; 0.213)  Agresti–Coull (0.008; 0.224)  Clopper–Pearson (0.008; 0.221)
```

### 5.2. Khi nào Wald bắt đầu sai

Xác suất bao phủ thật của một khoảng cho tỷ lệ tính được chính xác bằng cách cộng xác suất nhị thức của mọi k mà khoảng tạo ra chứa p. Hình 2 vẽ đại lượng này cho n = 30 và n = 100, theo hướng phân tích của Brown et al. (2001).

![bv-01-ac-trung-thong-ke-mau-va-uoc-luong-th-2](/vault-assets/bv-01-ac-trung-thong-ke-mau-va-uoc-luong-th-2-018ebd64.webp)

**Hình 2.** Xác suất bao phủ thực tế của khoảng 95% Wald và Wilson theo tỷ lệ thật p, tính chính xác từ phân phối nhị thức (trục tung cắt ở 0,5).

Với n = 30, Wald chỉ bao phủ 0,809 ở p = 0,1, 0,782 ở p = 0,05 và 0,454 ở p = 0,02; Wilson ở cùng các điểm là 0,974, 0,939 và 0,978. Trung bình trên dải p từ 0,01 đến 0,99, Wald đạt 0,889, Wilson 0,953; ngay cả với n = 100, Wald chỉ đạt 0,877 ở p = 0,05. Cả hai đường đều gồ ghề vì k chỉ nhận giá trị nguyên, và ở vài điểm như p = 0,3, n = 30, Wald còn cao hơn Wilson (0,953 so với 0,930). Nhưng Wilson dao động quanh 95%, còn Wald sụp đổ khi p tiến về 0 hoặc 1. Vì vậy nên dùng Wilson làm mặc định; trong R, `prop.test(k, n, correct = FALSE)$conf.int` trả về đúng khoảng này.

### 5.3. "Sai số 10%" là sai số nào?

Bài toán bẫy chuột hỏi: với tỷ lệ bẫy có chuột 0,3, cần đặt bao nhiêu bẫy để ở độ tin cậy 95% sai số không vượt quá 10%? Hai cách hiểu cho hai đáp số chênh nhau hơn mười lần:

- Nếu "10%" là **sai số tuyệt đối** ε = 0,10, tức tỷ lệ nằm trong 0,3 ± 0,1, thì $n = (1{,}96/0{,}10)^2 \cdot 0{,}3 \cdot 0{,}7 = 80{,}7$, làm tròn lên **81 bẫy**.
- Nếu "10%" là **sai số tương đối**, tức 10% của 0,3, ε = 0,03, thì n = 896,3, làm tròn lên **897 bẫy**.

Với 400 bẫy đã đặt, sai số tuyệt đối đạt được khoảng 0,045, nên câu hỏi "cần bao nhiêu bẫy" chỉ có ích khi lập kế hoạch đợt sau. Khi nêu sai số cho tỷ lệ, hãy ghi rõ là điểm phần trăm hay phần trăm tương đối.

Thêm một điểm về thiết kế: tỷ lệ bẫy có chuột là chỉ số mật độ tương đối, không phải kích thước quần thể; muốn ước lượng số cá thể cần thiết kế khác, như đánh dấu và bắt lại. Tương tự, trung bình riêng của 60 người có calcium > 100 mg/L là trung bình của một phân phối bị cắt bởi chính biến đang đo; CI của nó chỉ có nghĩa nếu đó đúng là tham số bạn muốn ước lượng.

## 6. Một giá trị 6,0 mg/L: phân tích độ nhạy

### 6.1. Một điểm, mười chín đơn vị kurtosis

Trong bộ 100 giá trị calcium, 99 giá trị nằm trong khoảng 79,9–130,2 mg/L, còn một giá trị là 6,0 (Hình 3).

![bv-01-ac-trung-thong-ke-mau-va-uoc-luong-th-3](/vault-assets/bv-01-ac-trung-thong-ke-mau-va-uoc-luong-th-3-42be20b0.webp)

**Hình 3.** Phân bố 100 giá trị calcium: từng điểm, boxplot, hai hàng rào Tukey (đường chấm) và khoảng tham chiếu 2,2–2,6 mmol/L quy đổi sang mg/L (vùng xanh).

Bảng 6 so sánh các đặc trưng mẫu theo bốn kịch bản.

**Bảng 6.** Đặc trưng của bộ số liệu calcium khi giữ, loại hoặc thay giá trị 6,0

| Đặc trưng | Giữ 6,0 | Loại 6,0 | Thay bằng 96,0 | Thay bằng 106,0 |
| --- | --- | --- | --- | --- |
| n | 100 | 99 | 100 | 100 |
| Trung bình | 102,00 | 102,97 | 102,90 | 103,00 |
| Trung vị | 102,55 | 102,70 | 102,55 | 102,80 |
| SD (chia n−1) | 14,39 | 10,68 | 10,65 | 10,63 |
| MAD (× 1,4826) | 11,27 | 11,12 | 11,19 | 11,05 |
| Skewness (`SKEW`) | −2,90 | 0,12 | 0,14 | 0,12 |
| Kurtosis (`KURT`) | 19,11 | −0,10 | −0,09 | −0,07 |
| Shapiro–Wilk, p | 2,1 × 10⁻¹⁰ | 0,78 | 0,74 | 0,79 |
| CI 95% của trung bình (t) | (99,14; 104,85) | (100,84; 105,10) | (100,78; 105,01) | (100,89; 105,11) |

Một giá trị, 1% mẫu, làm SD tăng 35%, đổi skewness từ 0,12 thành −2,90, đẩy kurtosis từ −0,10 lên 19,11, và biến một mẫu trông rất chuẩn (Shapiro–Wilk p = 0,78) thành mẫu bị bác bỏ tính chuẩn ở mọi mức ý nghĩa thông thường. CI rộng thêm khoảng một phần ba và lệch xuống. Trung vị và MAD chỉ đổi 0,15. Ba kịch bản không có 6,0 cho kết quả gần như nhau, nên kết luận không phụ thuộc vào việc "sửa" thành số nào.

![bv-01-ac-trung-thong-ke-mau-va-uoc-luong-th-4](/vault-assets/bv-01-ac-trung-thong-ke-mau-va-uoc-luong-th-4-68a77454.webp)

**Hình 4.** Histogram của bộ số liệu calcium trước và sau khi loại giá trị 6,0.

### 6.2. Skewness và kurtosis trong Excel được tính thế nào

Hàm `SKEW` và `KURT` không dùng công thức mô-men đơn giản mà dùng dạng có hiệu chỉnh cho mẫu:

$$G_1 = \frac{n}{(n-1)(n-2)} \sum \left(\frac{x_i - \bar{x}}{s}\right)^3, \qquad G_2 = \frac{n(n+1)}{(n-1)(n-2)(n-3)} \sum \left(\frac{x_i - \bar{x}}{s}\right)^4 - \frac{3(n-1)^2}{(n-2)(n-3)}$$

với s là SD chia n−1. Joanes và Gill (1998) so sánh ba họ thước đo skewness và kurtosis trong các phần mềm thống kê; $G_1$, $G_2$ là họ có hiệu chỉnh mẫu. Hai công thức này cho đúng −2,899 và 19,109 như Excel; trong scipy cần `bias=False` mới cho cùng kết quả.

### 6.3. Kurtosis đo đuôi, không đo độ nhọn

Kurtosis dương thường được đọc là phân phối "nhọn" (leptokurtic), âm là "bẹt" (platykurtic). Westfall (2014) chỉ ra rằng kurtosis chỉ có diễn giải rõ ràng theo mức cực trị ở đuôi, tức theo ngoại lai, và gần như không nói gì về đỉnh. Ở Hình 4, đỉnh phân phối hầu như không đổi khi bỏ giá trị 6,0; chỉ một điểm ở xa trên đuôi trái đã đẩy kurtosis từ −0,10 lên 19,11. Gặp kurtosis lớn, câu hỏi đầu tiên nên là "đuôi có điểm nào bất thường không".

Tương tự, skewness 0,034 của bộ chiều cao 40 thanh niên nghĩa là gần như đối xứng; gọi nó là "lệch phải" chỉ vì dấu của một con số rất nhỏ là đọc quá dữ liệu.

### 6.4. Phát hiện ngoại lai: đừng dùng SD để đo chính nó

z cổ điển, $(x - \bar{x})/s$, của giá trị 6,0 là −6,67, nên lần này nó bị phát hiện. Nhưng chính ngoại lai đã thổi phồng s (từ 10,68 lên 14,39) và kéo trung bình về phía nó, nên trong mẫu nhỏ hoặc có nhiều ngoại lai, z cổ điển có thể che mất chúng. Leys et al. (2013) đề nghị dùng trung vị thay trung bình, MAD (median absolute deviation, nhân 1,4826 để nhất quán với SD khi dữ liệu chuẩn) thay SD, và ngưỡng mặc định 2,5. Robust z của 6,0 là $(6{,}0 - 102{,}55)/11{,}27 = -8{,}57$; không giá trị nào khác vượt 2,5.

Hàng rào Tukey, Q1 − 1,5 × IQR và Q3 + 1,5 × IQR, cho (73,4; 132,5) và cũng chỉ gắn cờ giá trị 6,0. Ba phương pháp cùng chỉ một điểm.

Trung vị và MAD bền vì chỉ phụ thuộc vào thứ tự và phần giữa của dữ liệu. Bruce và Bruce (2017) nhấn mạnh MAD không bị ảnh hưởng bởi giá trị cực trị; Hampel (1974) xây dựng khung lý thuyết cho tính bền qua hàm ảnh hưởng (influence curve). Ở Bảng 6, SD đổi 35%, MAD đổi 1,3%.

```python
import numpy as np
import pandas as pd
from scipy import stats

ca = np.array([
    104.6, 113.9, 113.7, 97.2, 102.0, 107.7, 96.7, 106.3, 104.2, 124.6,
    94.9, 116.8, 97.4, 79.9, 102.1, 100.8, 112.8, 110.8, 110.1, 95.6,
    100.6, 109.1, 95.2, 117.9, 88.1, 101.6, 103.8, 97.1, 103.8, 105.9,
    110.2, 110.3, 98.5, 96.4, 111.8, 102.7, 83.6, 88.6, 80.6, 106.6,
    114.9, 111.8, 98.9, 106.6, 122.7, 94.9, 101.6, 85.8, 108.6, 96.5,
    95.1, 6.0, 118.3, 112.5, 106.1, 96.6, 91.1, 104.9, 91.1, 112.8,
    85.0, 110.1, 86.6, 95.6, 100.4, 102.9, 86.5, 94.5, 102.4, 95.3,
    107.6, 91.0, 105.4, 103.6, 114.2, 118.3, 101.9, 97.6, 93.7, 110.2,
    93.1, 99.9, 110.4, 114.0, 120.3, 110.3, 112.5, 96.9, 91.5, 94.4,
    102.3, 88.4, 123.2, 130.2, 80.6, 129.9, 98.0, 105.3, 104.0, 110.4])

def skew_excel(x):          # công thức của SKEW (G1)
    n, s = len(x), x.std(ddof=1)
    return n / ((n - 1) * (n - 2)) * np.sum(((x - x.mean()) / s) ** 3)

def kurt_excel(x):          # công thức của KURT (G2)
    n, s = len(x), x.std(ddof=1)
    return (n * (n + 1) / ((n - 1) * (n - 2) * (n - 3)) * np.sum(((x - x.mean()) / s) ** 4)
            - 3 * (n - 1) ** 2 / ((n - 2) * (n - 3)))

def describe(x):
    lo, hi = stats.t.interval(0.95, df=len(x) - 1, loc=x.mean(), scale=stats.sem(x))
    return {"n": len(x), "mean": x.mean(), "median": np.median(x),
            "SD": x.std(ddof=1), "MAD": stats.median_abs_deviation(x, scale="normal"),
            "skew": skew_excel(x), "kurt": kurt_excel(x),
            "Shapiro p": stats.shapiro(x).pvalue, "CI95 low": lo, "CI95 high": hi}

scenarios = {"giữ 6,0": ca, "loại 6,0": ca[ca != 6.0],
             "6,0 -> 96,0": np.where(ca == 6.0, 96.0, ca),
             "6,0 -> 106,0": np.where(ca == 6.0, 106.0, ca)}
table = pd.DataFrame({k: describe(v) for k, v in scenarios.items()})
print(table.map(lambda v: f"{v:.2g}" if abs(v) < 1e-3 else f"{v:.2f}").to_string())

med, mad = np.median(ca), stats.median_abs_deviation(ca, scale="normal")
q1, q3 = np.percentile(ca, [25, 75])
print(f"z cổ điển của 6,0: {(6.0 - ca.mean()) / ca.std(ddof=1):.2f}")
print(f"robust z của 6,0:  {(6.0 - med) / mad:.2f}")
print(f"hàng rào Tukey: ({q1 - 1.5 * (q3 - q1):.1f}; {q3 + 1.5 * (q3 - q1):.1f})")
```

```text
           giữ 6,0 loại 6,0 6,0 -> 96,0 6,0 -> 106,0
n           100.00    99.00      100.00       100.00
mean        102.00   102.97      102.90       103.00
median      102.55   102.70      102.55       102.80
SD           14.39    10.68       10.65        10.63
MAD          11.27    11.12       11.19        11.05
skew         -2.90     0.12        0.14         0.12
kurt         19.11    -0.10       -0.09        -0.07
Shapiro p  2.1e-10     0.78        0.74         0.79
CI95 low     99.14   100.84      100.78       100.89
CI95 high   104.85   105.10      105.01       105.11
z cổ điển của 6,0: -6.67
robust z của 6,0:  -8.57
hàng rào Tukey: (73.4; 132.5)
```

### 6.5. Kiểm tra đơn vị: con số có hợp lý về sinh học không

Bước tiếp theo là hỏi giá trị đó có thể xảy ra trong cơ thể không. Với khối lượng nguyên tử 40,078 (CIAAW, n.d.), 1 mmol/L calcium tương ứng 40,078 mg/L, nên 6,0 mg/L chỉ khoảng 0,15 mmol/L. Khoảng tham chiếu calcium toàn phần ở người trưởng thành là 2,2–2,6 mmol/L theo chuẩn hài hoà ở Anh (Jassam et al., 2020) và 2,122–2,518 mmol/L trong một nghiên cứu trên người khoẻ mạnh ở Thượng Hải (Yang et al., 2022). Giá trị 0,15 mmol/L thấp hơn các cận dưới này hơn mười lần.

Phép quy đổi cũng làm lộ ra vấn đề với phần còn lại. Giới hạn trên 2,6 mmol/L tương ứng 104,2 mg/L, và 43 trong 99 giá trị còn lại vượt mức này; giá trị lớn nhất, 130,2 mg/L, khoảng 3,25 mmol/L. Chỉ 47/99 giá trị nằm trong 88,2–104,2 mg/L (vùng xanh ở Hình 3). Với một mẫu "người bình thường", điều này khó xảy ra; nhiều khả năng đây là số liệu minh hoạ, hoặc đơn vị bị ghi khác đơn vị đo thật. Thói quen cần rút ra: quy đổi đơn vị và đặt dữ liệu cạnh khoảng sinh lý đã công bố trước khi tính bất kỳ CI nào.

### 6.6. Quy tắc thực hành với ngoại lai

Không xoá ngoại lai một cách im lặng. Một trình tự hợp lý, với tiêu chí định trước khi phân tích:

1. Gắn cờ bằng một tiêu chí định trước (robust z > 2,5 hoặc hàng rào Tukey).
2. Lần ngược về nguồn: phiếu kết quả, file xuất từ máy đo, nhật ký phòng thí nghiệm. Sửa nếu tìm được giá trị đúng.
3. Nếu không xác định được, báo cáo cả hai kịch bản, có và không có điểm đó, như Bảng 6.
4. Ghi lại quyết định và lý do.

Quy trình làm sạch có ghi chép được trình bày ở [Process data from Dirty to Clean](/blog/process-data-from-dirty-to-clean/).

## 7. Những bẫy nhỏ khác: bạn có mắc không?

<div class="callout callout-warning">
<p class="callout-title">Năm chỗ dễ trượt khi tính đặc trưng mẫu</p>

- **Nhiều mode.** Bộ chiều cao có hai mode, 161 và 164 cm, mỗi giá trị 4 lần. `MODE` chỉ trả về một giá trị; `MODE.MULT` trả về tất cả (Microsoft, n.d.-c). Với dữ liệu liên tục như calcium, mode 94,9 chỉ là giá trị tình cờ lặp lại.
- **Vùng dữ liệu.** Sao chép công thức dễ làm vùng tham chiếu lệch một cột; kiểm tra `COUNT` của vùng đó có bằng n không.
- **Bách phân vị.** Hyndman và Fan (1996) liệt kê chín định nghĩa phân vị mẫu trong các phần mềm. `PERCENTILE(…; 0,05)` của bộ calcium cho 84,93, trùng `quantile` mặc định của R (type 7) và `numpy.percentile`; khi so giữa hai phần mềm, ghi rõ định nghĩa.
- **Hệ số z.** Mức 99,9% là 3,29 (3,2905), không phải 3,3.
- **Nhãn ô.** Nhãn sao chép sai biến không làm sai con số nhưng làm sai báo cáo.

</div>

Biên lớp cần một ví dụ. Bảng tần số n = 1060 có các lớp ghi 43–46, 47–50, 51–54… Nếu số liệu gốc là số nguyên (giả định cần xác nhận với dữ liệu gốc), biên lớp thật là 42,5–46,5, 46,5–50,5…, và độ dài lớp d = 4, không phải 3. Khi đó trung vị theo $Me = b + d\,(n/2 - m_j)/m_i$ là 76,33 thay vì 76,37; P5 là 60,19 thay vì 60,27; phương sai hiệu chỉnh Sheppard là $93{,}95 - 4^2/12 = 92{,}62$ thay vì 93,20. Mode vẫn là 76,5. Khác biệt nhỏ, nhưng là lỗi định nghĩa lặp lại ở mọi đặc trưng tính từ bảng. Bảng có biên lớp liên tục sẵn, như 49,5–54,5, thì không gặp vấn đề này.

## 8. Báo cáo theo hướng ước lượng: mẫu câu và checklist

Một câu báo cáo nên đủ để người đọc tái lập con số (Cumming, 2014): ước lượng điểm, loại khoảng, mức tin cậy, n, SD và công cụ.

<div class="callout callout-example">
<p class="callout-title">Mẫu câu</p>

Trung bình 102,2 (KTC 99% theo phân phối t: 92,5–111,8; n = 18; SD 14,2; tính bằng `CONFIDENCE.T` trong Excel).

Tỷ lệ bẫy có chuột là 0,30 (KTC 95% Wilson: 0,257–0,347; 120/400).

Calcium huyết thanh trung bình 102,0 mg/L (KTC 95% theo t: 99,1–104,9; n = 100); khi loại một giá trị 6,0 mg/L có robust z = −8,6, trung bình là 103,0 (KTC 95%: 100,8–105,1; n = 99).

</div>

Câu thứ ba là phân tích độ nhạy: cả hai kịch bản kèm tiêu chí gắn cờ. SD mô tả dữ liệu, CI mô tả độ chính xác của trung bình (Altman & Bland, 2005); hai đại lượng không thay nhau.

**Checklist sáu bước trước khi báo cáo một khoảng tin cậy**

1. **Vẽ dữ liệu trước khi tính.** Hình 3 phát hiện giá trị 6,0 nhanh hơn mọi chỉ số.
2. **Kiểm tra đơn vị và khoảng sinh lý** đã công bố.
3. **Dùng `STDEV.S`** với mọi cỡ mẫu; chỉ hiệu chỉnh n−1 một lần.
4. **Dùng `CONFIDENCE.T`**, `t.test()` hoặc `scipy.stats.t.interval` cho trung bình; chỉ dùng z khi σ thật sự đã biết.
5. **Với tỷ lệ, dùng Wilson**; ghi rõ sai số tuyệt đối hay tương đối khi tính cỡ mẫu.
6. **Có ngoại lai thì báo cáo phân tích độ nhạy** theo tiêu chí định trước.

Cùng logic "đừng giả định khi không cần", kiểm định t của Welch không giả định hai phương sai bằng nhau (Kiểm định giả thiết thống kê). Ví dụ CI 95% trên số liệu đo thật: chim sẻ Darwin; bộ chiều cao 40 thanh niên tính lại bằng R: [Virtual Lab](/projects/virtual-lab/thi-nghiem-giai-doan-4/); các hàm mô tả cơ bản trong R: [trình bày và mô tả dữ liệu bằng R](/blog/trinh-bay-va-mo-ta-du-lieu-thuc-hanh-r/).

## 9. Kết luận

Ba quyết định có ba mức ảnh hưởng. Chọn n hay n−1 ảnh hưởng nhỏ, dưới 3% ngay cả ở n = 18, nếu chỉ hiệu chỉnh một lần; với CI của phương sai, `n*VARP` và `(n-1)*VAR` cho cùng kết quả. Chọn z hay t ảnh hưởng vừa: không đáng kể ở n = 100, nhưng ở n = 18 khoảng 99% đúng theo t rộng hơn khoảng z 12,5%, và `CONFIDENCE` luôn dùng z. Một ngoại lai ảnh hưởng lớn nhất: giá trị 6,0 mg/L đổi kurtosis từ −0,10 thành 19,11 và tăng SD 35%, trong khi trung vị và MAD gần như đứng yên. Vì vậy, khi kiểm tra một khoảng tin cậy, hãy nhìn dữ liệu và đơn vị trước, chọn đúng phân phối sau, và để chuyện n hay n−1 cuối cùng.

## Tài liệu tham khảo

Agresti, A., & Coull, B. A. (1998). Approximate is better than "exact" for interval estimation of binomial proportions. *The American Statistician, 52*(2), 119–126. https://doi.org/10.1080/00031305.1998.10480550

Altman, D. G., & Bland, J. M. (2005). Standard deviations and standard errors. *BMJ, 331*(7521), 903. https://doi.org/10.1136/bmj.331.7521.903

Brown, L. D., Cai, T. T., & DasGupta, A. (2001). Interval estimation for a binomial proportion. *Statistical Science, 16*(2), 101–133. https://doi.org/10.1214/ss/1009213286

Bruce, P., & Bruce, A. (2017). *Practical statistics for data scientists: 50 essential concepts*. O'Reilly Media.

CIAAW. (n.d.). *Calcium*. Commission on Isotopic Abundances and Atomic Weights. https://www.ciaaw.org/calcium.htm

Cumming, G. (2014). The new statistics: Why and how. *Psychological Science, 25*(1), 7–29. https://doi.org/10.1177/0956797613504966

Hampel, F. R. (1974). The influence curve and its role in robust estimation. *Journal of the American Statistical Association, 69*(346), 383–393. https://doi.org/10.1080/01621459.1974.10482962

Hyndman, R. J., & Fan, Y. (1996). Sample quantiles in statistical packages. *The American Statistician, 50*(4), 361–365. https://doi.org/10.1080/00031305.1996.10473566

Jassam, N., Luvai, A., Narayanan, D., Turnock, D., Lee, G., Earp, K., West, J., Day, A., Jeffery, J., Zouwail, S., El-Farhan, N., Dearman, R., Hayden, K., Willett, S., Osborne, J., & Barth, J. H. (2020). Albumin and calcium reference interval using healthy individuals and a data-mining approach. *Annals of Clinical Biochemistry, 57*(5), 373–381. https://doi.org/10.1177/0004563220944204

Joanes, D. N., & Gill, C. A. (1998). Comparing measures of sample skewness and kurtosis. *Journal of the Royal Statistical Society: Series D (The Statistician), 47*(1), 183–189. https://doi.org/10.1111/1467-9884.00122

Krzywinski, M., & Altman, N. (2013). Importance of being uncertain. *Nature Methods, 10*(9), 809–810. https://doi.org/10.1038/nmeth.2613

Leys, C., Ley, C., Klein, O., Bernard, P., & Licata, L. (2013). Detecting outliers: Do not use standard deviation around the mean, use absolute deviation around the median. *Journal of Experimental Social Psychology, 49*(4), 764–766. https://doi.org/10.1016/j.jesp.2013.03.013

McCullough, B. D., & Heiser, D. A. (2008). On the accuracy of statistical procedures in Microsoft Excel 2007. *Computational Statistics & Data Analysis, 52*(10), 4570–4578. https://doi.org/10.1016/j.csda.2008.03.004

Microsoft. (n.d.-a). *CONFIDENCE function*. Microsoft Support. https://support.microsoft.com/en-us/office/confidence-function-75ccc007-f77c-4343-bc14-673642091ad6

Microsoft. (n.d.-b). *CONFIDENCE.T function*. Microsoft Support. https://support.microsoft.com/en-us/office/confidence-t-function-e8eca395-6c3a-4ba9-9003-79ccc61d3c53

Microsoft. (n.d.-c). *MODE.MULT function*. Microsoft Support. https://support.microsoft.com/en-us/office/mode-mult-function-50fd9464-b2ba-4191-b57a-39446689ae8c

Sheppard, W. F. (1897). On the calculation of the most probable values of frequency-constants, for data arranged according to equidistant division of a scale. *Proceedings of the London Mathematical Society, s1-29*(1), 353–380. https://doi.org/10.1112/plms/s1-29.1.353

Student. (1908). The probable error of a mean. *Biometrika, 6*(1), 1–25. https://doi.org/10.2307/2331554

Westfall, P. H. (2014). Kurtosis as peakedness, 1905–2014. R.I.P. *The American Statistician, 68*(3), 191–195. https://doi.org/10.1080/00031305.2014.917055

Wilson, E. B. (1927). Probable inference, the law of succession, and statistical inference. *Journal of the American Statistical Association, 22*(158), 209–212. https://doi.org/10.1080/01621459.1927.10502953

Yang, Y.-Y., Zhang, D., Ma, L.-Y., Hou, Y.-F., Bi, Y.-F., Xu, Y., Xu, M., Zhao, H.-Y., Sun, L.-H., Tao, B., & Liu, J.-M. (2022). Association of famine exposure and the serum calcium level in healthy Chinese adults. *Frontiers in Endocrinology, 13*, 937380. https://doi.org/10.3389/fendo.2022.937380
