---
title: 'Bài 1: Hoạt độ enzyme'
type: lab-report
tags:
  - biology
  - enzymology
  - lipase
  - enzyme-activity
  - lab-report
section: Sinh học
folder: Sinh học / Biology Project and Lab Report / Enzymology
vaultPath: >-
  Resources/Sinh học/Biology Project and Lab Report/Enzymology/01 - Hoạt độ
  lipase bằng p-NPP.md
url: /blog/hoat-do-enzyme/
topic: biology
updated: '2026-10-16'
order: 1
description: >-
  Bài bổ sung (Nhóm 3 – Nguyễn Thị Thu Hà): dùng phương pháp xác định hoạt độ
  enzyme (enzyme activity) để phân tích một mẫu nghiên cứu thực tế – lipase
  ngoại bào từ Pseudomonas brenneri (Priyanka et al., 2020, Biocatalysis
isIndex: false
---
> Bài bổ sung (Nhóm 3 – Nguyễn Thị Thu Hà): dùng phương pháp xác định **hoạt độ enzyme (enzyme activity)** để phân tích một mẫu nghiên cứu thực tế – **lipase** ngoại bào từ *Pseudomonas brenneri* (Priyanka et al., 2020, *Biocatalysis and Agricultural Biotechnology* 29:101806). Bài gồm phần dịch/tóm tắt bài báo và phân tích quy trình đo hoạt độ.

## Mục đích
- Áp dụng phương pháp đo hoạt độ enzyme bằng **cơ chất tạo màu** cho lipase.
- Hiểu cách bài báo dùng hoạt độ để **tối ưu sản xuất**, **tinh sạch** và **đặc tính hoá** enzyme (pH, nhiệt độ, ion kim loại, dung môi, cơ chất, động học). (→ [Nhiệt độ, pH và ion lên amylase](/blog/xac-dinh-mot-so-tinh-chat-cua-enzyme/))

## Nguyên lý
- **Enzyme**: lipase – xúc tác thuỷ phân, ester hoá, alcoholysis, acidolysis...; lipase **bền dung môi** là xúc tác sinh học chính trong môi trường không nước. (→ [Mỡ trung tính](/blog/cac-tinh-chat-ly-hoa-cua-mo-trung-tinh-triacylglycerol/))
- **Cơ chất**: **p-nitrophenyl palmitate (p-NPP)** → lipase thuỷ phân giải phóng **p-nitrophenol** (màu vàng), đo quang ở **405 nm**.
	- Độ hấp thụ tỷ lệ với nồng độ p-nitrophenol → tỷ lệ thuận với hoạt độ enzyme.
- **Định nghĩa đơn vị**: **1 U lipase** = lượng enzyme tạo ra **1 μmol p-nitrophenol/phút** (ủ 28 °C, 30 phút; mỗi thí nghiệm lặp 3 lần). (→ [Hoạt độ amylase](/blog/dinh-tinh-va-xac-dinh-hoat-do-cua-enzyme/))
- **Công thức hoạt độ**:
	- $\text{Hoạt độ (IU/ml)} = \dfrac{\Delta A \times V \times D}{\epsilon \times t}$
	- $\Delta A$: thay đổi độ hấp thụ; $V$: thể tích tổng hỗn hợp (ml); $D$: hệ số pha loãng; $\epsilon$: hệ số hấp thụ mol của p-nitrophenol; $t$: thời gian ủ.
- **Hoạt độ còn lại (residual activity)** sau xử lý (nhiệt, pH, chất phụ gia): (→ [Độ bền và tính đặc hiệu của enzyme](/blog/xac-dinh-mot-so-tinh-chat-cua-enzyme-tiep/))
	- $\text{Hoạt độ còn lại (\%)} = \dfrac{\text{Hoạt độ riêng sau xử lý (IU/mg)}}{\text{Hoạt độ riêng ban đầu (IU/mg)}} \times 100$

## Vật liệu & phương pháp
- **Chuẩn bị mẫu enzyme**: phân lập *P. brenneri* từ đất trên **thạch Rhodamine B**; nuôi trẻ hoá, lên men 24 h; tinh sạch một phần bằng **sắc ký trao đổi anion**.
- **Hỗn hợp phản ứng**: dung dịch lipase + p-NPP trong **đệm Tris-HCl pH 7,5** + các yếu tố khảo sát:
	- **Ion kim loại** (Ca²⁺, Mg²⁺, Zn²⁺, Fe³⁺...).
	- **Chất ức chế** enzyme.
	- **Chất hoạt động bề mặt** không ion/ion (Poly-80, Triton X-100, SDS).
- **Ủ**: trong lọ thuỷ tinh nắp vặn, ví dụ 28 °C / 30 phút; thay đổi pH, nhiệt độ, thời gian ủ để tìm điều kiện tối ưu.
- **Dừng phản ứng**: thêm dung dịch dừng (acid hoặc base mạnh).
- **Đo**: độ hấp thụ ~405 nm bằng máy quang phổ. (→ [Mô phỏng máy quang phổ – Virtual Lab](/projects/virtual-lab/danh-muc-thi-nghiem-ao/))
- **Phân tích dữ liệu**: biểu thị **IU/mg protein** (hoạt độ riêng) hoặc **IU/ml**; trung bình ± SD; so sánh bằng **t-test**. (→ [Hypothesis Testing](/blog/hypothesis-testing-and-p-values/), [Kiểm định giả thiết](/blog/kiem-dinh-gia-thiet-thong-ke-trong-nghien-cuu-sinh-hoc/))

## Kết quả chính
- **Phân lập**: 2 chủng phân giải lipid từ đất bền trong cyclohexane, ethanol, n-hexane, heptane, methanol (phương pháp phủ đĩa); 16S rRNA → *P. reinekei* và ***P. brenneri***.
- **Tối ưu sản xuất** (thay đổi từng yếu tố):
	- Hoạt độ tối đa với **cấy truyền 2,5% (v/v)** sau **2 ngày** lên men (28 °C, 200 vòng/phút).
	- **Peptone 1% (w/v)** là nguồn nitơ tốt nhất → **0,91 IU/mL**.
- **Tinh sạch một phần** (kết tủa kiềm pH 9,0 → AEX Q-Sepharose HP, rửa giải 750 mM NaCl, pH 8,5):

| Bước | Tổng hoạt độ (IU) | Protein (mg) | Hoạt độ riêng (IU/mg) | Độ sạch (lần) | Hiệu suất (%) |
| --- | --- | --- | --- | --- | --- |
| Dịch nổi không tế bào | 120,9 | 86,1 | 1,40 | 1 | 100 |
| Thẩm tích (dialysate) | 114,7 | 58,5 | 1,96 | 1,40 | 94,86 |
| Kết tủa kiềm | 102,8 | 51,2 | 2,01 | 1,43 | 89,57 |
| Sắc ký AEX | 58,5 | 18,4 | 3,18 | 2,26 | 56,89 |

- **pH**: ổn định tối đa (> 90% hoạt độ tương đối) ở **pH 6,0–8,0**; mất hoạt độ mạnh ở pH 3, 4 và 10.
- **Nhiệt độ**: còn **> 80% hoạt độ sau 45 phút ở 70 °C**; **thời gian bán huỷ ở 60 °C = 190 phút** (bất hoạt bậc nhất).
- **Ion kim loại & phụ gia** (10 mM, 24 h, 28 °C) – hoạt độ còn lại:

| Phụ gia | Hoạt độ còn lại (%) |
| --- | --- |
| Đối chứng | 100,00 ± 0,00 |
| CaCl₂ | 106,03 ± 2,76 |
| MgCl₂ | 93,52 ± 2,32 |
| KCl | 103,12 ± 2,24 |
| NaCl | 99,84 ± 2,18 |
| CoCl₂ | 91,14 ± 2,92 |
| MnCl₃ | 94,55 ± 2,13 |
| FeCl₃ | 6,68 ± 1,86 |
| ZnSO₄ | 0,00 |
| EDTA | 0,00 |
| 4-mercaptoethanol | 103,10 ± 2,13 |
| Poly-80 | 98,29 ± 2,11 |
| Triton X-100 | 89,94 ± 2,75 |
| SDS | 59,70 ± 1,46 |

- Diễn giải:
	- **Zn²⁺, Fe³⁺, EDTA** làm mất hoạt độ → lipase có thể là **metalloenzyme**.
	- Không mất hoạt độ với 4-mercaptoethanol → không có **cầu disulfide** thiết yếu.
	- **SDS** (chất tẩy ion) làm mở xoắn protein → giảm hoạt độ; chất tẩy không ion ảnh hưởng ít. (→ [Tính chất của protein](/blog/xac-dinh-mot-so-tinh-chat-cua-protein/))
- **Dung môi**: giữ **> 80% hoạt độ trong methanol 20% (v/v)** sau 24 h (28 °C và 40 °C); bền trong ethanol 10%; nồng độ cao hơn làm giảm hoạt độ. Dung môi không phân cực **log P cao** (cyclohexane, n-hexane, n-heptane 50%) **tăng** hoạt độ.
- **Đặc hiệu cơ chất**: thuỷ phân ester **C8:0–C16:0**, tối đa ở **C12:0 (pNP-dodecanoate)**; gần như không thuỷ phân C2:0.
- **Động học** (p-NPP, 28 °C, đồ thị **Lineweaver–Burk**, [S] 0,2–2 mM): **Vmax = 5,17 ± 0,12** mmol/phút/mg, **Km = 0,37** mM.
- **Ứng dụng**: tổng hợp **FAME** (biodiesel) từ dầu ô liu : methanol (1:12), 72 h, 40 °C → hiệu suất **~85% (± 5%)**, tương đương Novozym435 (> 90%) và *Candida* sp. 99–125 (87%); kiểm tra bằng TLC và GC.

## Kết luận & thảo luận
- Phương pháp p-NPP đơn giản, định lượng được, linh hoạt để đánh giá ảnh hưởng của pH, nhiệt độ, chất điều chỉnh lên hoạt độ.
- Lipase *P. brenneri* là **metalloenzyme bền nhiệt – bền dung môi**, được hoạt hoá bởi dung môi log P > 2,0, hoạt động tốt 10–60 °C → tiềm năng cho **biodiesel**, chất tẩy rửa, tổng hợp hương liệu và xử lý sinh học dầu.
- Xem thêm: [Mô phỏng trong Virtual Lab](/projects/virtual-lab/thi-nghiem-giai-doan-3/) – protocol `ez-lipase`: p-NPP ở 405 nm, Lineweaver–Burk ra Km gần 0,37 mM.

## Tài liệu gốc
*Bài 1 - Hoạt độ enzyme - Nguyễn Thị Thu Hà - Nhóm 3.pdf*
