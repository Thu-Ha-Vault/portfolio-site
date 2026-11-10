---
title: 'Bài 3: Phân tách exosome và các bóng ngoại bào từ huyết tương người'
type: lab-report
tags:
  - biology
  - proteomics
  - exosome
  - lab-report
section: Sinh học
folder: Sinh học / Biology Project and Lab Report / Proteomics and Structural Biology
vaultPath: >-
  Resources/Sinh học/Biology Project and Lab Report/Proteomics and Structural
  Biology/03 - Phân tách exosome và bóng ngoại bào từ huyết tương.md
order: 3
description: >-
  Báo cáo thực tập Proteomic và Sinh học cấu trúc – Nguyễn Thị Thu Hà, K66 Sinh
  học, Nhóm 1.
isIndex: false
---
> Báo cáo thực tập Proteomic và Sinh học cấu trúc – Nguyễn Thị Thu Hà, K66 Sinh học, Nhóm 1.

## Mục đích
- Hiểu nguyên lý và ứng dụng của **sắc ký lọc gel (gel filtration / size-exclusion chromatography)** trong phân tách exosome và bóng ngoại bào.
- Thực hiện được các thao tác cơ bản: nhồi cột, cân bằng cột, thu phân đoạn, kiểm tra bằng SDS-PAGE.

## Nguyên lý
- **Bóng ngoại bào (extracellular vesicles, EVs)**: thể nhỏ có màng lipid kép do mọi tế bào sống tiết ra; có trong máu, dịch não tủy, dịch báng, nước tiểu, nước bọt.
	- Mang protein, ARN, ADN, lipid, chất chuyển hoá đến tế bào nhận → vai trò trong **giao tiếp tế bào**; ứng dụng chẩn đoán qua **sinh thiết lỏng** và điều trị (đặc biệt ung thư).
- Hai loại chính:

| Loại | Kích thước | Nguồn gốc | Marker xu hướng |
|---|---|---|---|
| **Exosome** | 30–200 nm | Endosome → thể đa bóng (MVB) dung hợp màng sinh chất | CD63 |
| **Ectosome / microvesicle** | 100–500 nm | Màng sinh chất lồi ra, thắt lại | CD9, CD81 |

- Phân loại mới theo kích thước (Théry 2018): **EV nhỏ** (< 200 nm) và **EV trung bình/lớn** (> 200 nm).
- **Nguyên lý tách**: kết hợp **lọc màng 0,22 µm** (loại hạt > 220 nm) với **cột sắc ký lọc gel** Sepharose CL-4B: EV kích thước lớn đi ra trước, còn hạt < 30 nm và protein huyết tương bị giữ lại lâu hơn trong lỗ gel → ra sau. (→ [Tinh sạch protease nọc nhện](/blog/sinh-hoc/biology-project-and-lab-report/enzymology/03-tinh-sach-protease-tu-noc-nhen/))

## Vật liệu & phương pháp
- **Mẫu**: huyết tương người bình thường; PBS pH 7,4 lọc 0,22 µm; cột **Sepharose CL-4B**; ethanol 20% bảo quản cột.
- **Chuẩn bị huyết tương**: máu chống đông EDTA/citrat → ly tâm 1500 × g 5 phút → ly tâm 10000 × g 10 phút loại mảnh tế bào → pha loãng 1:1 với PBS (45 µl huyết tương + 45 µl PBS), lọc 0,22 µm.
- **Nhồi và cân bằng cột**: đưa gel 1 ml/lần đến thể tích 3 ml (không để gel khô); cân bằng bằng PBS.
- **Thu phân đoạn**: nạp mẫu → bổ sung PBS 1X → thu **20 phân đoạn × 150 µl** theo trọng lực. Phần lớn exosome/EV nằm ở **phân đoạn 8–12**.
- **Rửa và bảo quản cột**: PBS → nước loại ion → ethanol 20% (3 ml); bảo quản 4 °C, tái sử dụng 3–5 lần.
- **Kiểm tra bằng SDS-PAGE**: gel 10%, 10 µl Laemmli 2x + 10 µl mẫu, chạy 180 V; cố định 15 phút, nhuộm CBB R-250 qua đêm, tẩy I và II, chụp ảnh.

## Kết quả chính
- Ảnh gel SDS-PAGE các phân đoạn (trong bản gốc):
	- **Giếng 8, 9, 10**: không có băng rõ ràng → ít protein huyết tương; đây có thể là các phân đoạn chứa nhiều exosome/EV.
	- **Giếng 11, 12**: xuất hiện băng mờ gần đầu gel, có thể là protein hoặc thành phần của exosome.
	- Lượng protein tăng dần sau phân đoạn 11 (protein huyết tương tự do bắt đầu ra khỏi cột).

## Kết luận & thảo luận
- Sắc ký lọc gel kết hợp lọc 0,22 µm tách được phân đoạn giàu EV (8–12) khỏi phần lớn protein huyết tương, làm cơ sở cho phân tích hệ protein exosome. (→ [Exosome ung thư gan (tiểu luận)](/blog/sinh-hoc/biology-project-and-lab-report/proteomics-and-structural-biology/08-he-protein-exosome-ung-thu-gan-tieu-luan/), [Exosome ung thư gan (slide)](/blog/sinh-hoc/biology-project-and-lab-report/proteomics-and-structural-biology/09-he-protein-exosome-ung-thu-gan-slide/))
- Để khẳng định EV cần thêm kiểm tra marker (CD63, CD81, TSG101; marker âm Calnexin), NTA, TEM – như trong nghiên cứu được trình bày ở [tiểu luận](/blog/sinh-hoc/biology-project-and-lab-report/proteomics-and-structural-biology/08-he-protein-exosome-ung-thu-gan-tieu-luan/).
- Xem thêm: [Mô phỏng trong Virtual Lab](/projects/virtual-lab/09-thi-nghiem-giai-doan-4/) – protocol `exo-plasma-ev`: cột Sepharose CL-4B 20 phân đoạn, SDS-PAGE khớp giếng 8–12, NTA, Western blot.

## Tài liệu gốc
*Nguyễn Thị Thu Hà - Thứ 2 tiết 6,7 - Bài 3.pdf*
