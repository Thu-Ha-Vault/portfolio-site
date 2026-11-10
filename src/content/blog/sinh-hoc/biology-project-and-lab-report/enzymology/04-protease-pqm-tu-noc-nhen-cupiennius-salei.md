---
title: >-
  Identification of a precursor processing protease from the spider Cupiennius
  salei essential for venom neurotoxin maturation
type: article
tags:
  - biology
  - enzymology
  - protease
  - enzyme-purification
  - article
section: Sinh học
folder: Sinh học / Biology Project and Lab Report / Enzymology
vaultPath: >-
  Resources/Sinh học/Biology Project and Lab Report/Enzymology/04 - Protease PQM
  từ nọc nhện Cupiennius salei.md
order: 4
description: >-
  Langenegger N. et al. (2018). Identification of a precursor processing
  protease from the spider Cupiennius salei essential for venom neurotoxin
  maturation. J. Biol. Chem. 293(6): 2079–2090. DOI: 10.1074/jbc.M117.810911 (
isIndex: false
---
> Langenegger N. et al. (2018). *Identification of a precursor processing protease from the spider Cupiennius salei essential for venom neurotoxin maturation*. **J. Biol. Chem.** 293(6): 2079–2090. DOI: 10.1074/jbc.M117.810911 (Open Access, CC BY). Bài báo nguồn của [Bài 2: Tinh sạch enzyme](/blog/sinh-hoc/biology-project-and-lab-report/enzymology/03-tinh-sach-protease-tu-noc-nhen/).

## Bối cảnh
- Độc tố thần kinh (neurotoxin) và peptide gây ly giải tế bào (cytolytic) trong nọc nhện được tổng hợp dưới dạng **tiền chất** (signal peptide – propeptide acid – peptide trưởng thành) và cần **protease** cắt để thành dạng hoạt động.
- **PQM (processing quadruplet motif)**: 4 amino acid cuối propeptide, **Arg ở vị trí −1** và ít nhất một **Glu** ở −2/−3/−4 → vị trí nhận diện của "PQM protease".
- **iPQM (inverted PQM)**: Arg ở vị trí 1 và Glu trong 3 amino acid tiếp theo – gặp ở tiền chất peptide cytolytic, liên quan đến tạo độc tố dị dimer.
- Trước nghiên cứu này, chưa có protease nào từ nọc nhện được chứng minh thực nghiệm là tham gia trưởng thành độc tố.

## Phương pháp
- **Nguyên liệu**: 11,5 ml nọc thô *C. salei* (~1150 lần vắt nọc), nhện nuôi trong phòng thí nghiệm.
- **Đo hoạt độ (FRET)**: cơ chất PQM (DABCYL-PFFENEQARKDDKN-Glu(EDANS)-NH₂) và iPQM (DABCYL-FYPSQRSETD-Glu(EDANS)-NH₂); hoạt độ = % cơ chất bị cắt so với đối chứng âm (đệm) và dương (trypsin).
- **Tinh sạch 3 bước sắc ký**:
	- **SEC** (lọc gel, Superdex 75 HR, 100 mM NH₄OAc pH 5,0).
	- **CEX** (trao đổi cation, MiniS PE, gradient 0–0,65 M NaCl).
	- **RP-HPLC** (Nucleosil 300-5 C4, gradient 0–60% acetonitrile/TFA).
- **Kiểm tra độ sạch & cấu trúc**: SDS-PAGE (8–25%, nhuộm bạc), **MALDI-TOF-MS**, **LC-MS/MS** (chuỗi nhẹ/nặng, cầu disulfide), phân tích amino acid. (→ [2D-PAGE](/blog/sinh-hoc/biology-project-and-lab-report/proteomics-and-structural-biology/02-dien-di-hai-chieu-2d-page/), [LC-MS/MS](/blog/sinh-hoc/biology-project-and-lab-report/proteomics-and-structural-biology/06-sac-ky-long-khoi-pho-lc-ms-ms/))
- **Trình tự**: transcriptome tuyến nọc (454, Illumina HiSeq3000; lắp ráp Trinity) + proteomics bottom-up (trypsin, chymotrypsin, proteinase K). (→ [Thuỷ phân protein trong gel](/blog/sinh-hoc/biology-project-and-lab-report/proteomics-and-structural-biology/05-thuy-phan-protein-trong-gel/))
- **Đặc tính enzyme**: pH 3,5–8,5; cation hoá trị 1 và 2 (5 mM); chất ức chế EDTA, AEBSF (10 mM); đo động học huỳnh quang ở 37 °C.
- **Đặc hiệu cơ chất**: ủ qua đêm với các peptide tổng hợp mô phỏng vị trí cắt của CsTx-1, CsTx-9, CsTx-13, CsTx-40, ω-agatoxin-1A → phân tích sản phẩm bằng LC-MS.
- **Tin sinh học**: tìm protein tương đồng ở 18 loài nhện thuộc 9 họ, dựng cây phát sinh maximum likelihood.

## Kết quả chính
- **Bảng tinh sạch** (2 lần tinh sạch, mỗi lần 3 ml nọc; trung bình ± SD):

| Bước | Tổng hoạt độ (×10⁻¹⁰ mol l⁻¹ s⁻¹ (µl nọc)⁻¹) | Protein (µg (µl nọc)⁻¹) | Hoạt độ riêng (×10⁻¹² mol l⁻¹ s⁻¹ µg⁻¹) | Độ sạch (lần) |
| --- | --- | --- | --- | --- |
| Nọc thô | 5,93 ± 1,40 | 101,750 ± 6,124 | 5,8 ± 1,7 | 1 |
| SEC | 5,26 ± 0,53 | 3,581 ± 0,110 | 146,8 ± 19,2 | 25 |
| CEX | 0,85 ± 0,14 | 0,053 ± 0,009 | 1601,7 ± 527,8 | 276 |
| RP-HPLC | 1,40 ± 0,16 | 0,022 ± 0,006 | 6364,3 ± 2305,6 | **1097** |

- Hiệu suất (tổng hoạt độ cuối / ban đầu) ≈ **23,6%** (như tính trong Bài 2); nồng độ protease trong nọc ước tính **0,78 ± 0,2 µM** (có thể bị đánh giá thấp do mất trong tinh sạch).
- **Cấu trúc**:
	- **Serine protease giống chymotrypsin**, **heterodimer 28 kDa** (MALDI-TOF), băng đơn hơi dưới 30 kDa trên SDS-PAGE. (→ [MALDI-TOF MS](/blog/sinh-hoc/biology-project-and-lab-report/proteomics-and-structural-biology/07-khoi-pho-maldi-tof-ms-va-nhan-dang-protein/))
	- **Chuỗi nhẹ** (Lys19–Gln33, 1621,935 Da, đầu C được **amid hoá**) nối chuỗi nặng (Ile36–Thr280) bằng **1 cầu disulfide**; chuỗi nặng có nhiều isoform.
	- ORF 840 bp: signal peptide (Met1–Gly18) + chuỗi nhẹ + spacer Gly34–Arg35 + chuỗi nặng; 2 isoform **VSP1_a1** (~90%) và **VSP1_a2** (~10%).
	- Thuộc **họ peptidase S1A**: bộ ba xúc tác **His80, Asp130, Ser231**; vị trí gắn cơ chất Asp225, Ala251, Gly253.
- **Đặc tính enzyme**:
	- **pH tối ưu 6,0** (bằng pH của nọc); không hoạt động ở pH ≤ 4 hoặc ≥ 8.
	- Co²⁺, Mn²⁺, Mg²⁺, Ni²⁺, Ca²⁺ không ảnh hưởng đáng kể; **Zn²⁺ 5 mM giảm hoạt độ 5 lần**; EDTA giảm nhẹ; **AEBSF → mất hoàn toàn** (khẳng định serine protease).
- **Đặc hiệu**: cắt chính xác **phía C của Arg trong PQM** (EQAR của CsTx-1, EQVR của CsTx-9 – có ở > 85% transcript tiền chất neurotoxin); với tiền chất dị dimer (CsTx-13, CsTx-40, ω-Aga-1a) cắt 2 lần: sau PQM và sau Arg6 của iPQM → Arg đầu C còn lại có lẽ do **carboxypeptidase** loại bỏ.
- **Tiến hoá**: tương đồng cao với U21-ctenitoxin-Pn1a (*Phoneutria nigriventer*, 76%) và peptide isomerase của *Agelenopsis aperta* (56%); homolog ở 18 loài/9 họ nhện (59–98%) → enzyme bảo thủ và quan trọng; *Cupiennius* xếp gần Lycosidae/Pisauridae hơn Ctenidae.

## Ý nghĩa / ứng dụng
- Báo cáo **đầu tiên** phân lập và mô tả protease loại bỏ propeptide (PQM protease) cần cho trưởng thành độc tố thần kinh nọc nhện; xác nhận cơ chế trưởng thành dự đoán từ transcriptome.
- Gợi ý cơ chế tương tự cho tiền chất peptide cytolytic phức tạp (PQM/iPQM + carboxypeptidase).
- Tiềm năng làm **công cụ sản xuất peptide độc tố tái tổ hợp**.
- Ví dụ điển hình về **chiến lược tinh sạch enzyme lượng vết** (nồng độ thấp hơn độc tố chính tới ~1000 lần) và tầm quan trọng của theo dõi hoạt độ ở mỗi bước.
- Xem thêm: [Mô phỏng trong Virtual Lab](/projects/virtual-lab/09-thi-nghiem-giai-doan-4/) – bảng tinh sạch của bài báo dùng làm số liệu kiểm thử; ảnh hưởng pH, Zn²⁺, AEBSF; hình hệ FPLC.

## Tài liệu gốc
*Protease từ nọc độc nhện.pdf*
