---
title: >-
  Bài 1: Xác định mức độ ô nhiễm môi trường lao động do tác động đồng thời của
  nhiều yếu tố
type: lab-report
tags:
  - biology
  - ecology
  - environmental-pollution
  - occupational-health
  - lab-report
section: Sinh học
folder: Sinh học / Biology Project and Lab Report / Ecology
vaultPath: >-
  Resources/Sinh học/Biology Project and Lab Report/Ecology/01 - Ô nhiễm môi
  trường lao động do nhiều yếu tố.md
url: >-
  /blog/xac-dinh-muc-do-o-nhiem-moi-truong-lao-dong-do-tac-dong-dong-thoi-cua-nhieu-yeu/
topic: biology
updated: '2026-10-16'
order: 1
description: >-
  Báo cáo thực hành Cơ sở sinh thái học (viết tay, 2 trang) · Nguyễn Thị Thu Hà,
  K66 Sinh học. Bài tập tính mức ô nhiễm tổng hợp của 5 chất (CO, SO₂, H₂S, HF,
  bụi lơ lửng) tại 3 điểm: Tam Hiệp, Vĩnh Quỳnh, Vạn Phúc.
isIndex: false
---
> Báo cáo thực hành Cơ sở sinh thái học (viết tay, 2 trang) · Nguyễn Thị Thu Hà, K66 Sinh học. Bài tập tính mức ô nhiễm tổng hợp của 5 chất (CO, SO₂, H₂S, HF, bụi lơ lửng) tại 3 điểm: Tam Hiệp, Vĩnh Quỳnh, Vạn Phúc.

## Mục đích
- Xác định **mức độ tác động của nhiều yếu tố môi trường** tới sức khoẻ con người.

## Nguyên lý
- Các yếu tố môi trường thường có tính chất **vật lý, hoá học, sinh học**. Khi cùng tiếp xúc một lúc với 2 hay nhiều yếu tố thì tác động của các yếu tố này gây ra tính chất **cộng hưởng** hoặc **trái ngược** nhau. (→ [Nhân tố sinh thái](/blog/ca-the-va-quan-the-sinh-vat/))
- Coi các yếu tố tác động gồm 2 nhóm:
	- **Tác động đặc hiệu** (yếu tố chính, chỉ số $c$)
	- **Tác động không đặc hiệu**

## Vật liệu & phương pháp
- **B1**: Đo đạc, lấy mẫu phân tích và thu thập thông tin.
	- So sánh với **TCCP** (tiêu chuẩn cho phép).
- **B2**: Tính $a_i = \dfrac{\text{Số người cảm nhận đúng}}{\text{Số người cảm nhận}}$
- **B3**: Xác định **mức phản ứng $R_i$**.
	- Số lần vượt tiêu chuẩn cho phép → mức độ phản ứng của người lao động.
	- Mức phản ứng lớn nhất: **đặc hiệu**; còn lại: **không đặc hiệu**.
	- Mức phản ứng bằng nhau: $a_i$ lớn hơn → đặc hiệu.
- **B4**: Tính **trọng lượng ô nhiễm**: $G_i = a_i \cdot R_i$
- **B5**: Tính **trọng lượng ô nhiễm dư**: $\Delta G = \Sigma G - G_c$
	- $\Sigma G$: của các yếu tố không đặc hiệu.
	- TH1: $\Delta G < 0$ → KL: mức độ tác động của các yếu tố ô nhiễm tổng hợp = mức ô nhiễm của yếu tố chính.
	- TH2: $\Delta G > 0$ → làm tiếp B6, B7.
- **B6**: Xác định trị số $R_{dư} = \dfrac{\Delta G}{\Sigma a_i}$
	- $\Sigma a_i$: không có $a_i$ của yếu tố chính.
- **B7**: Tính $R_{tổng} = R_c + R_{dư}$

<div class="callout callout-info">
<p class="callout-title">Bổ sung</p>

- Ý tưởng của phương pháp: yếu tố chính quyết định mức nền $R_c$; các yếu tố phụ chỉ làm tăng mức ô nhiễm khi tổng "trọng lượng" của chúng lớn hơn trọng lượng của yếu tố chính ($\Delta G > 0$). Phần vượt được quy đổi về thang $R$ bằng cách chia cho $\Sigma a_i$ của các yếu tố phụ.
- Số trong ngoặc ở Bảng 1 có lẽ là **tỉ số nồng độ / TCCP** (số lần vượt tiêu chuẩn) (?); $R_i$ được tra từ tỉ số này.

</div>

## Kết quả chính
### Bảng 1: Chỉ số $R_i$ (mức độ phản ứng của người lao động)

| Chất | Tam Hiệp | Vĩnh Quỳnh | Vạn Phúc |
| --- | --- | --- | --- |
| CO | 2 (1,125) | 2 (1,0876) | 1 (0,22) |
| SO₂ | 1 (0,696) | 1 (0,648) | 1 (0,64) |
| H₂S | 3 (2,125) | 4 (2,75) | 1 |
| HF | 1 (0,85) | 1 (0,95) | 1 |
| Bụi lơ lửng | 2 (2,835) (?) | 3 (2,415) | 1 (0,65) |
| **$R_c$** | $R_{H_2S}$ (đã sửa từ $R_{bụi\ lơ\ lửng}$) | $R_{H_2S}$ | $R_{bụi\ lơ\ lửng}$ ($a_i$ lớn nhất) |

### Bảng 2: Chỉ số $G_i$ (trọng lượng ô nhiễm)

| Chất | Tam Hiệp | Vĩnh Quỳnh | Vạn Phúc |
| --- | --- | --- | --- |
| CO | 59% | 28,6% | 9% |
| SO₂ | 29,2% (sửa từ 7,78%) | 21% | 12,6% |
| H₂S | 38,1% | 87,6% | 4,9% |
| HF | 7,78% | 6,31% | 1,54% |
| Bụi lơ lửng | 61,4% (sửa từ 122,8%) | 123,6% | 20% |
| **ΣG** | 157,38% (?) | 179,51% | 28,04% |

### Trọng lượng ô nhiễm dư và mức ô nhiễm tổng hợp

| Điểm | $\Delta G$ | $\Sigma a_i$ | $R_{dư}$ | $R_{tổng}$ | Đánh giá (bản gốc) |
| --- | --- | --- | --- | --- | --- |
| Tam Hiệp | 119,28% | 79,18% | 1,506 | 4,506 | Vượt quá mức "ô nhiễm nhiều" |
| Vĩnh Quỳnh | 55,91% | 82,81% | 0,675 | 4,675 | Vượt quá mức "ô nhiễm nhiều" |
| Vạn Phúc | 8,04% | 28,04% | 0,2867 | 1,2867 | Hơn mức độ hợp vệ sinh |

<details class="callout callout-question">
<summary>Cần kiểm tra</summary>

- **ΣG Tam Hiệp** bị viết đè, đọc như "154,98%"; tính lại từ bảng (CO + SO₂ + HF + bụi) = **157,38%**, khớp với $\Delta G$ = 157,38 − 38,1 = 119,28%.
- **Tam Hiệp – $\Sigma a_i$**: 79,18% = $a$ của CO (29,5) + SO₂ (29,2) + **H₂S (12,7)** + HF (7,78), tức là bỏ bụi lơ lửng ra như khi bụi còn là yếu tố chính. Sau khi đổi $R_c$ sang H₂S thì $\Sigma a_i$ phải bỏ H₂S: 29,5 + 29,2 + 7,78 + 30,7 = **97,18%** → $R_{dư}$ ≈ 1,227, $R_{tổng}$ ≈ **4,227**.
- **Vĩnh Quỳnh – $\Delta G$**: 55,91% = 179,51 − **123,6** (trừ $G$ của bụi), trong khi $R_c$ là H₂S ($G$ = 87,6%) và ΣG đã không tính H₂S. Theo công thức B5: $\Delta G$ = 179,51 − 87,6 = **91,91%** → $R_{dư}$ = 91,91 / 82,81 ≈ 1,110, $R_{tổng}$ ≈ **5,110**. ($\Sigma a_i$ = 82,81% của bản gốc đã đúng: bỏ H₂S.)
- Bụi lơ lửng Tam Hiệp: $R_i$ = 2 viết đè lên một số khác, trong khi tỉ số 2,835 cao hơn H₂S (2,125, $R$ = 3) (?).
- Thang đánh giá $R_{tổng}$ (hợp vệ sinh / ô nhiễm nhẹ / ô nhiễm nhiều…) không ghi trong bản gốc.

</details>

## Kết luận
- **Tam Hiệp** và **Vĩnh Quỳnh**: $R_{tổng}$ > 4 → môi trường lao động **vượt quá mức "ô nhiễm nhiều"**; yếu tố chính là **H₂S**. Nếu tính lại theo đúng công thức thì kết luận không đổi (4,23 và 5,11).
- **Vạn Phúc**: mọi chất đều dưới TCCP ($R_i$ = 1), $R_{tổng}$ = 1,29 → **hơn mức độ hợp vệ sinh**; yếu tố chính là **bụi lơ lửng**.
- Các yếu tố phụ không đặc hiệu vẫn làm tăng mức ô nhiễm tổng hợp ($R_{dư}$ > 0 ở cả 3 điểm), nên đánh giá từng chất riêng lẻ sẽ đánh giá thấp mức ô nhiễm thực tế.

## Tài liệu gốc
![IMG_4517](/vault-assets/img-4517-86720ad6.webp)
![IMG_4516](/vault-assets/img-4516-fd85db2d.webp)
