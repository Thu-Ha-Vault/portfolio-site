---
title: 'Bài 2: Phương pháp lấy mẫu'
type: lab-report
tags:
  - biology
  - ecology
  - population-ecology
  - sampling
  - lab-report
section: Sinh học
folder: Sinh học / Biology Project and Lab Report / Ecology
vaultPath: >-
  Resources/Sinh học/Biology Project and Lab Report/Ecology/02 - Phương pháp lấy
  mẫu.md
url: /blog/phuong-phap-lay-mau/
topic: biology
updated: '2026-10-16'
order: 2
description: >-
  Báo cáo thực hành Cơ sở sinh thái học (viết tay, 3 trang) · Nguyễn Thị Thu Hà
  + Hoàng Thuỳ Linh, K66 Sinh học · ca tiết 6–7 chiều thứ 2. Ước lượng số lượng
  con mọt trong 26 cốc bằng cách đếm mẫu.
isIndex: false
---
> Báo cáo thực hành Cơ sở sinh thái học (viết tay, 3 trang) · Nguyễn Thị Thu Hà + Hoàng Thuỳ Linh, K66 Sinh học · ca tiết 6–7 chiều thứ 2. Ước lượng số lượng **con mọt** trong 26 cốc bằng cách đếm mẫu.

## Mục đích
- Ước lượng **số lượng cá thể của một quần thể**. (→ [Kích thước quần thể](/blog/ca-the-va-quan-the-sinh-vat/))

## Nguyên lý
- Thủ tục lấy mẫu phải đúng.
- Tuỳ theo đối tượng nghiên cứu mà có phương pháp phù hợp.
- Mẫu phải cung cấp lượng thông tin tối đa, trong giới hạn thời gian quy định và trong phạm vi tài chính nhất định.
- Xác định số lượng mẫu cần lấy.
- **Ước lượng số lượng mẫu**: (→ [Thống kê mẫu và ước lượng tham số](/blog/3-dac-trung-thong-ke-cua-mot-mau-va-uoc-luong-tham-so-cua-tong-the/))
	- **Giá trị trung bình**: $\bar{x} = \dfrac{\sum_{i=1}^{n} x_i}{n}$
	- **Phương sai**: $s^2 = \dfrac{1}{n-1}\left[\sum_{i=1}^{n} x_i^2 - \dfrac{\left(\sum_{i=1}^{n} x_i\right)^2}{n}\right]$ ($n \le 30$ (?))
	- **Giá trị trung bình thực của quần thể** ($\mu$) là hằng số.
	- Với phân phối chuẩn: $\mu = x_{tb} \pm 1{,}96 \cdot SE$ với độ tin cậy 95%.
	- Khi $x_{tb}$ trong phạm vi 40% của $\mu$ thì $D = 0{,}4$ (độ tin cậy 95%).
	- → **Ước lượng số lượng mẫu cần lấy**: $N = \dfrac{4s^2}{D^2 x_{tb}^2}$ → $N = \dfrac{25 s^2}{x_{tb}^2}$

<div class="callout callout-info">
<p class="callout-title">Bổ sung</p>

- $SE = \sqrt{s^2/n}$ là **sai số chuẩn** của trung bình mẫu.
- Công thức $N = 4s^2/(D^2\bar{x}^2)$ lấy từ khoảng tin cậy 95%: $1{,}96 \approx 2$ nên $2 \cdot s/\sqrt{N} \le D\bar{x}$ → $N \ge 4s^2/(D\bar{x})^2$. Với $D = 0{,}4$: $4/0{,}16 = 25$.
- Ước lượng tổng số cá thể: $P = Q \cdot T$, với $Q$ = số cá thể trung bình trong một đơn vị mẫu (cốc), $T$ = tổng số đơn vị (cốc).
- Sai số của phương pháp: $SS = \dfrac{LT - TT}{TT} \cdot 100\%$ (LT: lý thuyết/ước lượng, TT: thực tế).

</div>

## Vật liệu & phương pháp
- **26 cốc** chứa mọt; tổng số mọt đếm thực tế: **275 con**.
- Lần 1: lấy ngẫu nhiên **10 cốc**, đếm số mọt trong mỗi cốc → tính $\bar{x}$, $s^2$, $SE$, khoảng tin cậy của $\mu$, $P$ và cỡ mẫu cần lấy $N$.
- Lần 2: lấy lại theo cỡ mẫu $N$ vừa tính (**8 cốc**) → tính lại $x_{tb}$ và $P$.

## Kết quả chính
### Lần 1: 10 cốc

| Lần | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | Σ |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| $x_i$ | 11 | 13 | 15 | 9 | 16 | 12 | 10 | 11 | 16 | 9 | 122 |
| $x_i^2$ | 121 | 169 | 225 | 81 | 256 | 144 | 100 | 121 | 256 | 81 | 1891 (?) |

- **Giá trị thực**: $\mu = \dfrac{275}{26} = 10{,}57$ (★)
- **Giá trị trung bình mẫu**: $\bar{x} = \dfrac{122}{10} = 12{,}2$
- **Phương sai**: $s^2 = \dfrac{1}{10-1}\left[1891 - \dfrac{122^2}{10}\right] = 44{,}73$
- **Sai số chuẩn**: $SE = \sqrt{\dfrac{s^2}{n}} = \sqrt{\dfrac{44{,}73}{10}} = 2{,}11$
	- → $\mu = \bar{x} \pm 1{,}96\,SE$ → $8{,}0644 < \mu < 16{,}3356$ → (★) **thoả mãn**.
- **Ước lượng tổng số**: $P_1 = Q \cdot T = 12{,}2 \cdot 26 = 317{,}2$
- **Ước lượng số mẫu cần lấy**: $N = \dfrac{25 \cdot 44{,}73}{12{,}2^2} = 7{,}5$ → số lượng mẫu cần lấy thực: $7{,}5 \approx 8$ lần.
- **Sai số của phương pháp**: $SS = \dfrac{12{,}2 \cdot 26 - 275}{275} \cdot 100\% = 15\%$

### Lần 2: 8 cốc

| Lần | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | Σ |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| $x_i$ | 12 | 7 | 10 | 11 | 9 | 13 | 11 | 13 | 86 |

- **Giá trị trung bình mẫu**: $x_{tb} = \dfrac{86}{8} = 10{,}75$
- **Giá trị trung bình thực**: $\mu = 10{,}57$
- $P = Q \cdot T = 10{,}75 \cdot 26 = 279{,}5$

<details class="callout callout-question">
<summary>Cần kiểm tra</summary>

- **$\Sigma x_i^2$ lần 1**: cộng lại cột $x_i^2$ được **1554**, không phải 1891. Tính lại: $s^2$ = (1554 − 1488,4) / 9 ≈ **7,29**; $SE$ ≈ 0,854; khoảng tin cậy 10,53 < μ < 13,87 (μ = 10,57 vẫn nằm trong); $N$ = 25 · 7,29 / 12,2² ≈ **1,2** mẫu. Kết quả 7,5 ≈ 8 mẫu của bản gốc là do dùng 1891.
- Ô Σ của bảng lần 2 bị bỏ trống/tẩy trong ảnh; 86 lấy từ dòng tính $x_{tb}$ (cộng lại các $x_i$ cũng ra 86).
- Điều kiện của công thức phương sai đọc là "$n \le 30$" hay "$n \le 50$" (?).
- Lần 2 không tính sai số; nếu tính theo cùng công thức: $SS$ = (279,5 − 275) / 275 ≈ **1,6%**.

</details>

## Kết luận
- Giá trị trung bình thực $\mu$ có giá trị **không đổi**.
- Giá trị trung bình mẫu $x_{tb}$ (lần 2, 10,75) **gần với $\mu$ hơn** lần 1 (12,2).
- $P$ (279,5) có giá trị **gần với số lượng con mọt thật hơn** (275 so với 317,2), sai số giảm từ 15% xuống khoảng 1,6%. (→ [Ô tiêu chuẩn ở Phù Long](/blog/co-so-sinh-thai-hoc-o-tieu-chuan-va-chi-so-da-dang/))
- Xem thêm: [Virtual Lab: lấy mẫu đếm mọt](/projects/virtual-lab/tai-lieu-drive-cho-giai-doan-6/) – bốc thăm cốc, tính khoảng tin cậy, đối chiếu số liệu của bài (cộng lại cột xᵢ² được 1554).

## Tài liệu gốc
![IMG_4530](/vault-assets/img-4530-0700f867.webp)
![IMG_4531](/vault-assets/img-4531-abe8a862.webp)
![IMG_4532](/vault-assets/img-4532-7d3818ec.webp)
