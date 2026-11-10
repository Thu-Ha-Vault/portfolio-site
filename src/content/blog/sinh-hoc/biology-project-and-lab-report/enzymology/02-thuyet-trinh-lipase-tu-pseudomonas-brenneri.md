---
title: >-
  Đánh giá hoạt tính của enzyme lipase từ Pseudomonas brenneri và ứng dụng trong
  tổng hợp biodiesel
type: course-note
tags:
  - biology
  - enzymology
  - lipase
  - enzyme-activity
  - presentation
section: Sinh học
folder: Sinh học / Biology Project and Lab Report / Enzymology
vaultPath: >-
  Resources/Sinh học/Biology Project and Lab Report/Enzymology/02 - Thuyết trình
  lipase từ Pseudomonas brenneri.md
order: 2
description: >-
  Slide thuyết trình (29 trang) của Nhóm 3 – Vũ Đức Hiệp, Trần Minh Anh, Hoàng
  Minh Hiếu, Nguyễn Lê Nhung, Nguyễn Thị Thu Hà – phân tích bài báo Isolation
  and characterization of a novel thermo-solvent-stable lipase from P
isIndex: false
---
> Slide thuyết trình (29 trang) của **Nhóm 3** – Vũ Đức Hiệp, Trần Minh Anh, Hoàng Minh Hiếu, Nguyễn Lê Nhung, Nguyễn Thị Thu Hà – phân tích bài báo *Isolation and characterization of a novel thermo-solvent-stable lipase from Pseudomonas brenneri and its application in biodiesel synthesis* (Priyanka et al., *Biocatalysis and Agricultural Biotechnology* 29, 2020, 101806). Đây là phần trình bày đi kèm [Bài 1](/blog/sinh-hoc/biology-project-and-lab-report/enzymology/01-hoat-do-lipase-bang-p-npp/), không phải bản PDF bài báo.

## Bối cảnh
- **Lipase**: enzyme quan trọng trong sản xuất **biodiesel**, chế biến thực phẩm, xử lý chất thải; xúc tác thuỷ phân, ester hoá, alcoholysis...
	- Lipase *P. cepacia* → tổng hợp **cinnamyl propionate** (thành phần nước hoa).
	- Lipase *P. fluorescens*, *P. stutzeri* → mỹ phẩm, chăm sóc răng miệng, dược phẩm.
- ***Pseudomonas brenneri***: vi khuẩn phổ biến ở môi trường trên cạn và dưới nước, sinh nhiều enzyme có giá trị công nghệ sinh học.
- **Mục tiêu**: xác định yếu tố ảnh hưởng đến hoạt tính lipase (thời gian lên men, nhiệt độ, pH, ion kim loại...) qua đo hoạt độ; tối ưu sản xuất và đánh giá độ bền nhiệt, độ ổn định để mở rộng ứng dụng.

## Phương pháp
- Quy trình đo hoạt độ 8 bước: (→ [Hoạt độ amylase](/blog/sinh-hoc/biology-project-and-lab-report/biochemistry-and-molecular-biology/08-dinh-tinh-enzyme-va-hoat-do-amylase/))
	1. **Chuẩn bị cơ chất**: **p-NPP** – thuỷ phân giải phóng p-nitrophenol, dễ định lượng.
	2. **Mẫu chứa enzyme**: phân lập *P. brenneri* trên **thạch Rhodamine B**, tinh sạch enzyme.
	3. **Hỗn hợp phản ứng**: dịch enzyme + p-NPP trong **Tris-HCl pH 7,5** + ion kim loại / chất ức chế / chất hoạt động bề mặt.
	4. **Ủ**: lọ thuỷ tinh nắp vặn; thay đổi pH, nhiệt độ, thời gian ủ.
	5. **Dừng phản ứng**: acid hoặc base mạnh.
	6. **Đo**: độ hấp thụ ở khoảng **410 nm** (slide ghi 410 nm; báo cáo Bài 1 ghi 405 nm).
	7. **Tính hoạt độ**:
		- Dựng **đường chuẩn** p-nitrophenol thương mại: $y = mx + b$ ($y$: độ hấp thụ, $x$: nồng độ, $m$: độ dốc ≈ hệ số hấp thụ mol của p-nitrophenol), tính bằng OpenOffice Calc. (→ [Linear and Logistic Regression](/blog/sinh-hoc/bioinformatics/a-statistics-and-biostatistics/iii-statistical-models-and-method/01-linear-and-logistic-regression/))
		- $\text{Catalytic activity (μmol/min/mL)} = \dfrac{[P]_f - [P]_i}{t}$ với $[P]_i$, $[P]_f$: nồng độ p-nitrophenol đầu/cuối, $t$ = 30 phút.
		- **1 U** = 1 μmol p-nitrophenol/phút.
		- $\text{Hoạt độ còn lại (\%)} = \dfrac{\text{Hoạt độ sau xử lý}}{\text{Hoạt độ ban đầu}} \times 100$
	8. **Phân tích dữ liệu**: IU/mg hoặc IU/ml; mỗi mẫu đo 3 lần (trung bình, SD); so sánh bằng **t-test**. (→ [Hypothesis Testing](/blog/sinh-hoc/bioinformatics/a-statistics-and-biostatistics/ii-statistical-inference/05-hypothesis-testing-and-p-values/))

## Kết quả chính
- **Phân lập**: 16S rRNA xác định *P. reinekei* và *P. brenneri*; lipase ngoại bào bền trong n-hexane (phương pháp phủ đĩa, chiếu UV trên thạch Rhodamine B).
- **Lên men**: tối đa với cấy truyền **2,5% (v/v)**, **2 ngày**; lipase ngoại bào sinh ra ở cuối pha log hoặc pha ổn định.
- **Nguồn nitơ**: **peptone 1% (w/v)** → **0,91 IU/mL**.
- **Tinh sạch một phần**: kết tủa kiềm (pH 9,0) → sắc ký trao đổi anion (750 mM NaCl, pH 8,5) → hoạt độ riêng **3,18 IU/mg**, hiệu suất **56,89%**.
- **pH**: > 90% hoạt độ tương đối ở **pH 6,0–8,0**; mất mạnh ở pH 3, 4, 10.
- **Độ bền nhiệt**: còn **> 80% sau 45 phút ở 70 °C**; **t½ ở 60 °C = 190 phút** (thời gian bán huỷ = thời điểm hoạt độ còn lại 50%).
- **Ion kim loại**: Ca²⁺, Mg²⁺ tăng/giữ hoạt độ; **Zn²⁺, Fe³⁺, EDTA** làm mất hoạt độ → **metalloenzyme**; SDS gây biến tính.
- **Dung môi**: giữ > 80% hoạt độ trong methanol 10% sau 1 h; giảm hoạt độ trong ethanol 20% sau 24 h; dung môi không phân cực nồng độ cao giúp enzyme giữ nước cấu trúc.
	- So sánh: lipase *P. aeruginosa* AAU2 mất 90% hoạt tính trong methanol 25%; *Pseudomonas* sp. DMVR46 chỉ giữ 8,9% (methanol) và 30,5% (ethanol).
- **Cơ chất đặc hiệu**: ester **C8:0–C16:0**, tối đa **C12:0 (pNP-dodecanoate)**; thấp với C2:0.

## Ý nghĩa / ứng dụng
- Lipase *P. brenneri* là **metalloenzyme bền nhiệt và bền dung môi hữu cơ**, được hoạt hoá bởi dung môi hữu cơ, hoạt động 10–60 °C với p-NPP.
- Bằng chứng ứng dụng: tổng hợp **FAME thô từ dầu ô liu + methanol** → tiềm năng sản xuất biodiesel, chất tẩy rửa, hương liệu. (→ [Mỡ trung tính](/blog/sinh-hoc/biology-project-and-lab-report/biochemistry-and-molecular-biology/05-tinh-chat-ly-hoa-cua-mo-trung-tinh/))
- Tài liệu tham khảo thêm trong slide: Adrio & Demain (2014) *Microbial enzymes: tools for biotechnological processes*; Salihu & Alam (2015) *Solvent tolerant lipases: a review*.

## Tài liệu gốc
*Isolation and characterization of a novel thermo-solvent-stable lipase from Pseudomonas brenneri and its application in biodiesel synthesis.pdf*
