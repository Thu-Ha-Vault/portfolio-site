---
title: 'Bài 4: Phân tích hình ảnh bản gel điện di hai chiều sử dụng phần mềm Phoretix'
type: lab-report
tags:
  - biology
  - proteomics
  - image-analysis
  - lab-report
section: Sinh học
folder: Sinh học / Biology Project and Lab Report / Proteomics and Structural Biology
vaultPath: >-
  Resources/Sinh học/Biology Project and Lab Report/Proteomics and Structural
  Biology/04 - Phân tích ảnh gel 2D bằng Phoretix.md
order: 4
description: >-
  Báo cáo thực tập Proteomic và Sinh học cấu trúc – Nguyễn Thị Thu Hà, K66 Sinh
  học.
isIndex: false
---
> Báo cáo thực tập Proteomic và Sinh học cấu trúc – Nguyễn Thị Thu Hà, K66 Sinh học.

## Mục đích
- Nắm nguyên lý phân tích hình ảnh gel 2D bằng phần mềm **Phoretix**.
- Đánh giá phân bố các điểm protein (spot) trên gel 2D và **biểu hiện thay đổi** của protein giữa các gel.

## Nguyên lý
- Ảnh gel 2D là tập hợp các **spot** (mỗi spot ≈ một chuỗi polypeptide/protein tách theo pI và khối lượng phân tử); có thể từ hàng trăm đến hàng ngàn spot → cần phần mềm chuyên dụng.
- **Phoretix** (Shimadzu) xác định thứ tự, vị trí và **thể tích (volume)** của từng spot. (→ [Bioinformatics](/blog/sinh-hoc/bioinformatics/))
	- Volume đánh giá bằng **đo mật độ (densitometry)** điểm ảnh – phụ thuộc kích thước và độ đậm của spot.
- **Cường độ khối chuẩn hoá (normalized volume)**: cho phép so sánh giữa các gel.
	- $\%V = \dfrac{V_{spot}}{\sum V_{\text{tất cả spot}}} \times 100$
- So sánh gel → chỉ ra spot có/không có, spot tăng/giảm biểu hiện giữa các mẫu → chọn spot để cắt, thủy phân trong gel và phân tích khối phổ.

## Vật liệu & phương pháp
- Ảnh gel 2D; máy tính RAM ≥ 2 GB; Phoretix (Shimadzu, bản Demo 2004).
- Các bước:
	1. Cài đặt và làm quen thanh công cụ.
	2. Chọn gel cần phân tích, xác định vùng phân tích và các spot.
	3. Chỉnh sửa spot: **cắt (split), nối (merge), xoá (delete), vẽ thêm (add)**.
	4. Xác định số lượng spot và thông số từng spot (số thứ tự, volume...).
	5. So sánh các gel, chỉ ra vùng spot khác biệt.

## Kết quả chính
- Gel phân tích: **example 1a**, so sánh với gel tham chiếu **example 1_Ref**.
	- Spot phát hiện tô màu xanh; vùng khác biệt so với gel tham chiếu tô màu đỏ.
	- **Số lượng spot: 718**.
- Thao tác chỉnh sửa spot:

| Thao tác | Trước | Sau |
|---|---|---|
| Cắt | Spot 229 (volume 112,836) | Spot 719 (49,137) + Spot 720 (116,403) |
| Nối | Spot 365 (47,597) + Spot 361 (29,844) | Spot 361 (80,454) |
| Xoá | Spot 235 (8,921) | – |
| Vẽ thêm | – | Spot 719 (11,622) |

## Kết luận & thảo luận
- Phoretix giúp định lượng spot tự động và so sánh biểu hiện protein giữa các gel; tuy nhiên việc phát hiện spot tự động cần được kiểm tra, chỉnh sửa thủ công (cắt spot bị gộp, nối spot bị tách, xoá nhiễu, thêm spot bị bỏ sót).
- Nhận xét từ bảng: volume sau khi cắt/nối không bằng tổng volume các spot ban đầu – có thể do phần mềm xác định lại ranh giới và nền của spot (bản gốc không giải thích).
- Spot khác biệt là đầu vào cho [thủy phân trong gel](/blog/sinh-hoc/biology-project-and-lab-report/proteomics-and-structural-biology/05-thuy-phan-protein-trong-gel/) và khối phổ.
- Xem thêm: [Mô phỏng trong Virtual Lab](/projects/virtual-lab/08-thi-nghiem-giai-doan-3/) – bước tính %V của protocol `pt-2dpage`.
- Xem thêm: [Mô phỏng trong Virtual Lab](/projects/virtual-lab/09-thi-nghiem-giai-doan-4/) – protocol `pt-phoretix`: so hai gel bằng thể tích thô và %V.

## Tài liệu gốc
*Nguyễn Thị Thu Hà - Thứ 2 tiết 6,7 - Bài 4.pdf*
