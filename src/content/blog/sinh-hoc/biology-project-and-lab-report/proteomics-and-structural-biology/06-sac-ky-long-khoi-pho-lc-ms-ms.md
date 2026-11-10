---
title: 'Bài 6: Sắc ký lỏng - khối phổ LC-MS/MS và nhận dạng protein'
type: lab-report
tags:
  - biology
  - proteomics
  - mass-spectrometry
  - lab-report
section: Sinh học
folder: Sinh học / Biology Project and Lab Report / Proteomics and Structural Biology
vaultPath: >-
  Resources/Sinh học/Biology Project and Lab Report/Proteomics and Structural
  Biology/06 - Sắc ký lỏng - khối phổ LC-MS-MS.md
order: 6
description: >-
  Báo cáo thực tập Proteomic và Sinh học cấu trúc – Nguyễn Thị Thu Hà, K66 Sinh
  học.
isIndex: false
---
> Báo cáo thực tập Proteomic và Sinh học cấu trúc – Nguyễn Thị Thu Hà, K66 Sinh học.

## Mục đích
- Nắm nguyên lý, quy trình và thao tác LC-MS/MS.
- Hiểu nguyên tắc **sắc ký lỏng hai chiều (2D-LC)** để tách hỗn hợp peptide trước khối phổ.

## Nguyên lý
- **LC-MS/MS** kết hợp khả năng tách của **sắc ký lỏng (HPLC)** với khả năng nhận danh, định lượng của **khối phổ (MS)** – độ đặc hiệu và độ nhạy cao. (→ [Exosome ung thư gan (tiểu luận)](/blog/sinh-hoc/biology-project-and-lab-report/proteomics-and-structural-biology/08-he-protein-exosome-ung-thu-gan-tieu-luan/), [Tinh sạch protease nọc nhện](/blog/sinh-hoc/biology-project-and-lab-report/enzymology/03-tinh-sach-protease-tu-noc-nhen/))
	- **LC**: tách các cấu tử theo tương tác với pha tĩnh – pha động.
	- **Ion hoá**: cấu tử được ion hoá tại nguồn ion.
	- **MS**: phân tích ion theo tỷ số **khối lượng/điện tích (m/z)**.
	- **MS/MS**: chọn **ion mẹ (precursor)** → phân mảnh → **ion con (fragment)** → tăng độ chính xác nhận dạng. (→ [Protease PQM nọc nhện](/blog/sinh-hoc/biology-project-and-lab-report/enzymology/04-protease-pqm-tu-noc-nhen-cupiennius-salei/))
- Xem thêm: [Proteomics và cấu trúc protein](/blog/sinh-hoc/bioinformatics/b-data-science-and-bioinformatics/ii-giao-trinh-bioinformatics/08-proteomics-va-cau-truc-protein/) – phân tích dữ liệu LC-MS/MS: DDA/DIA, MaxQuant, FragPipe, FDR target-decoy
- **2D-LC trong bài**:
	- **Chiều 1 – trao đổi cation mạnh (SCX)**: tách peptide theo điện tích, rửa giải từng bậc nồng độ muối (ammonium sulfate) → đưa từng phân đoạn sang 6 **cột loại muối** (CapTrap).
	- **Chiều 2 – pha đảo (RP, C18)**: tách peptide theo độ kỵ nước bằng gradient acetonitrile → phân đoạn nhỏ lên đĩa thép MS cho **MALDI-TOF MS/MS**.

## Vật liệu & phương pháp
- **Cột**:
	- SCX: PolyLC PolySULFOETHYL A, 50 × 1 mm, 5 µm, 200 Å.
	- RP: Keystone BetaBasic C18, 100 × 0,3 mm, 5 µm, 150 Å.
	- Loại muối: Peptide CapTrap 2 × 0,5 mm.
- **Dung dịch**:
	- A: ammonium formate (AmF) 10 mM, pH ~3,8; B: A + ammonium sulfate 100 mM (SCX).
	- C: formic acid (FA) 0,1%, ACN 5%; D: FA 0,1%, ACN 80% (RP); CD: FA 0,1% (loại muối).
	- E: SPM 0,2 M / SA 0,3 M (hoạt hoá cột SCX); F: methanol 100% (hoạt hoá cột RP).
- **Thiết bị**: hệ 2D micro HPLC (Shimadzu), phần mềm LabSolution; máy khối phổ Kratos (Shimadzu). (→ [Mô phỏng HPLC – Virtual Lab](/projects/virtual-lab/02-danh-muc-thi-nghiem-ao/) · [Hình HPLC Agilent 1260 và LC-MS/MS Shimadzu LCMS-8060](/projects/virtual-lab/06-tai-lieu-tham-khao-may-moc-dot-2/) · [Protocol LC-MS/MS định lượng caffeine](/projects/virtual-lab/04-bo-khung-phong-thi-nghiem-3d/))
- **Chuẩn bị hệ thống**: đường ống bảo quản trong AcCN 50% → chuyển qua nước loại ion trước khi vào đệm khác; loại bọt khí; hoạt hoá và cân bằng cột SCX, RP. Mở chương trình 2 trước chương trình 1 để hai chương trình kết nối.
- **Chương trình chạy**:

| Chương trình | Vai trò | Thông số chính |
|---|---|---|
| 1 | SCX (chiều 1), điều khiển van | Flow 0,040 ml/ph; P.MAX 15 MPa; lò cột 40 °C; B tăng bậc 0 → 10% ... → 100%, chuyển lần lượt sang cột loại muối 2–6; tổng ~396 phút |
| 2 | RP khởi động/cân bằng | Flow 0,010 ml/ph; D 10% → 80% (16 phút) → 10%; CD flow 0,040 ml/ph |
| 3 | RP phân tích (lặp 6 vòng – 6 cột loại muối) | Flow 0,010 ml/ph; D 10% → 60% (6–36 phút) → 80% (41–46 phút) → 10%; kết thúc 60 phút; khởi động thu phân đoạn lên đĩa MS |

- **Chạy phân tích**: kiểm tra hệ thống → mở chương trình 1 → download (chương trình 2, 3 tự kết nối) → thu đĩa MS đã nhỏ phân đoạn.
- **MALDI-TOF MS/MS**:
	1. Trộn chất chuẩn với chất nền **CHCA** tỷ lệ 1:1; nhỏ 1–2 µl vào giếng chuẩn phân bố đều trên đĩa, để khô.
	2. Tối ưu năng lượng laser bằng hỗn hợp peptide chuẩn.
	3. Thu phổ mẫu, **cân bằng nội chuẩn** bằng peptide tự cắt của trypsin lợn: $842{,}509\ [M+H]^+$ và $2211{,}104\ [M+H]^+$.
	4. Từ phổ MS chọn ion mẹ → chuyển chế độ MS/MS thu phổ ion con → lập danh sách khối lượng ion mẹ và ion con.

## Kết quả chính
- Báo cáo trình bày quy trình và chương trình chạy; không có phổ hay danh sách protein nhận dạng (không rõ trong bản gốc).

## Kết luận & thảo luận
- 2D-LC (SCX + RP) tăng khả năng tách hỗn hợp peptide phức tạp (shotgun proteomics) trước MS/MS, bổ sung cho cách tiếp cận dựa trên gel (2D-PAGE → cắt spot).
- Dữ liệu ion mẹ/ion con dùng để tra cứu CSDL (Mascot) nhận dạng protein – xem [bài 7](/blog/sinh-hoc/biology-project-and-lab-report/proteomics-and-structural-biology/07-khoi-pho-maldi-tof-ms-va-nhan-dang-protein/).

## Tài liệu gốc
*Nguyễn Thị Thu Hà - Thứ 2 tiết 6,7 - Bài 6.pdf*
