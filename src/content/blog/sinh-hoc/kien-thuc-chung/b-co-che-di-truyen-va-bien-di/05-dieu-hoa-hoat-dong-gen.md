---
title: Điều hoà hoạt động gen
type: note
tags:
  - biology
  - general-biology
  - high-school
  - genetics
section: Sinh học
folder: Sinh học / Kiến thức chung / B - Cơ chế di truyền và biến dị
vaultPath: >-
  Resources/Sinh học/Kiến thức chung/B - Cơ chế di truyền và biến dị/05 - Điều
  hoà hoạt động gen.md
url: /blog/dieu-hoa-hoat-dong-gen/
topic: biology
updated: '2026-10-16'
order: 5
description: >-
  Tên các chất đổi từ phiên âm tiếng Việt sang tiếng Anh (ADN → DNA, ARN → RNA,
  mARN → mRNA, enzim → enzyme, lac → lactose). Enzyme nhận biết, gắn vào vùng
  khởi động (P) và bị protein ức chế chặn: sổ ghi "ADN-poli" → RNA p
isIndex: false
---
<div class="callout callout-info">
<p class="callout-title">Chép từ sổ viết tay cấp 3 (trang 035). Nội dung có thể chưa chính xác; <code>(?)</code> là chỗ chữ chưa đọc rõ.</p>

</div>

<details class="callout callout-success">
<summary>Đã sửa so với sổ gốc</summary>

- Tên các chất đổi từ phiên âm tiếng Việt sang tiếng Anh (ADN → DNA, ARN → RNA, mARN → mRNA, enzim → enzyme, lac → lactose).
- Enzyme nhận biết, gắn vào vùng khởi động (P) và bị protein ức chế chặn: sổ ghi "ADN-poli" → **RNA polymerase** (sửa cả trong mô tả hình và sơ đồ).
- Khi không có lactose: chỉ **mRNA và protein (enzyme) của Z, Y, A** không được tổng hợp (gen R vẫn phiên mã, dịch mã tạo protein ức chế).
- Tên nhà khoa học: "Mono – Jacob" → **Monod – Jacob**; điền chỗ "___ vận hành" → "**Vùng** vận hành".

</details>


## Khái quát
- Mỗi tế bào trên cơ thể đều mang tất cả các gen quy định tất cả tính trạng của cơ thể
- Tại 1 thời điểm xác định:
	- 1 số ít gen hoạt động.
	- Đa phần: ức chế hoặc không hoạt động.
- Sự hoạt động của gen phụ thuộc:
	- Loại tế bào, mô.
	- Giai đoạn phát triển của cơ thể
	- Điều kiện môi trường sống. (→ [Di truyền ngoài nhân](/blog/di-truyen-ngoai-nhan-moi-truong-va-bien-di/))

## Mức độ điều hoà
- Nhiễm sắc thể
- **Phiên mã** (chủ yếu)
- Sau phiên mã
- Dịch mã
- Sau dịch mã
- → **Nhân thực**: tất cả các cấp độ, phức tạp — (các cấp độ) cơ bản giống (nhau) (→ [Histone, methyl hoá DNA, splicing](/blog/cell-commitment-and-differential-gene-expression/))
- → **Nhân sơ**: chủ yếu ở mức phiên mã

## Nhân sơ: Operon-Lac
> Ghi bằng bút chì trong sổ: "\* Operon-Lac".

- **Operon-Lac**: (Monod – Jacob), trên DNA
- **Gen cấu trúc**: Z, Y, A → mang thông tin cấu trúc protein → tính trạng (→ [Đột biến gen](/blog/dot-bien-gen/))
- **Gen điều hoà (R)**: mang thông tin → protein ức chế → điều hoà hoạt động operon
- **Vùng khởi động (P)**: RNA polymerase nhận biết, gắn vào → khởi đầu phiên mã (→ [Nhân đôi, phiên mã, dịch mã](/blog/nhan-doi-dna-phien-ma-va-dich-ma/))
- **Vùng vận hành (O)**: tương tác với protein ức chế.

### Không có lactose
![Hình - Operon Lac khi không có lactose](/vault-assets/hinh-operon-lac-khi-khong-co-lactose-55a47668.svg)

```mermaid
flowchart LR
    R[Gen R] -- phiên mã --> RNA[mRNA] -- dịch mã --> PU[Protein ức chế]
    PU -- gắn vào --> O[Vùng O]
    O -. chặn RNA polymerase .-> ZYA[Z, Y, A không phiên mã]
```

- Z, Y, A không phiên mã
- mRNA của Z, Y, A không được tổng hợp
- Không dịch mã
- Protein (enzyme) Z, Y, A không được tổng hợp
- Không có lactose → ✗ enzyme phân giải

### Có lactose
![Hình - Operon Lac khi có lactose](/vault-assets/hinh-operon-lac-khi-co-lactose-e00b0e52.svg)

```mermaid
flowchart LR
    R[Gen R] -- phiên mã --> RNA[mRNA] -- dịch mã --> PU[Protein ức chế]
    L[Lactose] --> PU
    PU --> X[Không hoạt động]
    ZYA[Z, Y, A] -- phiên mã --> M[mRNA] -- dịch mã --> E[Pr Z, Pr Y, Pr A<br>enzyme phân giải]
```

- Gen R —phiên mã→ mRNA —dịch mã→ Protein ức chế ⊄ hoạt động (không hoạt động) ← có lactose
- Z, Y, A —phiên mã→ mRNA —dịch mã→ Pr Z, Pr Y, Pr A → enzyme phân giải (← có lactose)
- Các gen Z, Y, A có số lần nhân đôi bằng nhau và số lần phiên mã bằng nhau
- Gen điều hoà và gen cấu trúc Z, Y, A có số lần nhân đôi bằng nhau
