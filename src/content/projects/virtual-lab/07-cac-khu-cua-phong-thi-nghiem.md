---
title: Các khu của phòng thí nghiệm
type: note
tags:
  - project
  - virtual-lab
  - simulation
folder: Projects / Virtual_Lab
vaultPath: Projects/Virtual_Lab/07 - Các khu của phòng thí nghiệm.md
date: '2026-10-16'
status: active
order: 7
project: virtual-lab
isIndex: false
description: >-
  Tủ −80 °C (TSX Universal): mở cửa xong về dưới −75 °C sau 15 phút (ghi chú kỹ
  thuật của Thermo) hoặc 17 phút (trang sản phẩm); mất điện, cửa đóng, tủ rỗng
  ấm từ −80 lên −50 °C sau 288 phút (khớp hằng số thời gian khoảng
---
<div class="callout callout-info">
<p class="callout-title">Giai đoạn 2: xây các khu của phòng thí nghiệm (kế hoạch ở mục 8 của CLAUDE.md). Mỗi khu: thiết bị thật được chọn, số liệu có nguồn dùng cho mô hình, chỗ chưa xác minh, tiến độ. Mặt bằng các khu ở [note 04](/projects/virtual-lab/04-bo-khung-phong-thi-nghiem-3d/).</p>

</div>

## Khung chung cho các khu
- **Kho đồ** `src/core/inventory.js`: mỗi món có chỗ cất (bàn, hộp đá, tủ lạnh, tủ đông, tủ −80 °C, bình nitơ lỏng), nhiệt độ, số lần đông – rã, hoạt tính còn lại.
	- Mô hình: mất hoạt tính bậc một theo thời gian, hằng số k (1/giờ) nội suy theo log giữa các mốc nhiệt độ; mỗi lần rã sau một lần đông lại mất một phần cố định (lần rã đầu để dùng không mất).
	- Số liệu từng món ở `data/storage.json`, nguồn ghi ngay trong file.
- **Tương tác trong cảnh 3D** `src/scene/interact.js`: bấm vật (khác kéo để xoay camera), tủ có cửa bản lề mở – đóng; giảm chuyển động thì mở ngay.
	- Tủ lạnh, tủ đông, tủ −80 °C, 5 tủ hoá chất, tủ ấm ruồi giấm đều mở được; bấm ống hoặc chai bên trong để lấy ra.
	- Cầm ống: bấm (không kéo) ống PCR trên bàn rồi bấm vào máy PCR hoặc bộ điện di để chạy.
- **Máy trong cảnh 3D** (`MACHINES_3D` trong `layout.js`): 14 máy đúng kích thước model thật, nhãn cận cảnh và nút thao tác tự đặt theo chiều cao máy.
- [x] Khung chung ✅ 2026-10-16

## Tủ lạnh, tủ đông, tủ âm sâu, bình nitơ lỏng

### Thiết bị được chọn
| Thiết bị | Model | Thông số chính | Nguồn |
|---|---|---|---|
| Tủ lạnh | Thermo Scientific TSX2305SA | 650 L; 96,2 × 71,1 × 199,6 cm; dải 3–7 °C, đặt sẵn 5 °C | https://www.thermofisher.com/order/catalog/product/TSX2305SA |
| Tủ đông −20 °C | Thermo Scientific TSX2320FA (xả đá tay) | 650 L; −25 đến −15 °C | https://www.thermofisher.com/order/catalog/product/TSX2320FA |
| Tủ âm sâu −80 °C | Thermo Scientific TSX Universal TSX60086FA | 816 L, 600 hộp 2 inch; 95,5 × 100,6 × 198,1 cm; −40 đến −86 °C | https://www.thermofisher.com/order/catalog/product/TSX60086FA |
| Bình nitơ lỏng | Thermo Scientific Locator 6 Plus (CY50985-70) | 184 L, 6 000 ống; bay hơi 0,99 L/ngày, giữ 185 ngày; mẫu dưới −180 °C | https://www.thermofisher.com/order/catalog/product/CY50985-70 |
| Máy làm đá vảy | Scotsman AF 103 AS | khoảng 102 kg/ngày, thùng 30 kg (số của đại lý, *chưa xác minh* với hãng) | https://www.sydneycommercialkitchens.com.au/catering-equipment/ice-makers/scotsman-af-103-as-self-contained-ice-flaker |

- Tủ −80 °C (TSX Universal): mở cửa xong về dưới −75 °C sau 15 phút (ghi chú kỹ thuật của Thermo) hoặc 17 phút (trang sản phẩm); mất điện, cửa đóng, tủ rỗng ấm từ −80 lên −50 °C sau 288 phút (khớp hằng số thời gian khoảng 807 phút); hạ từ nhiệt độ phòng xuống −80 °C mất 282 phút; báo cửa mở sau 3 phút ([ghi chú kỹ thuật](https://assets.thermofisher.com/TFS-Assets/LPD/Technical-Notes/TSXUniversal-ULTfreezers-Why-total-performance-matters.pdf); [manual 328442H01](https://knowledge1.thermofisher.com/@api/deki/files/46136/328442H01_-_Rev_Q_-_Thermo_Scientific_ULT_TSX_Series_-_User_Manual.pdf.pdf?revision=1)).
	- Ngưỡng báo ấm đặt được từ −40 °C tới cách điểm đặt 5 °C; manual lấy ví dụ −70 °C (ấm) và −90 °C (lạnh), không nói đó là mặc định.

### Độ bền thuốc thử (số liệu trong `data/storage.json`)
- **Taq polymerase** (glycerol 50 %, không đông ở −20 °C): NEB 24 tháng ở −20 °C; Qiagen TopTaq giữ đủ hoạt tính ít nhất 2 tuần ở 15–25 °C ([Qiagen FAQ 1743](https://www.qiagen.com/us/resources/faq/1743)); AmpliTaq 360 vẫn đạt sau 10 ngày vận chuyển mùa hè đỉnh 39 °C ([Thermo](https://assets.thermofisher.com/TFS-Assets/LSG/Application-Notes/cms_091812.pdf)); t½ > 40 phút ở 95 °C ([EP0402](https://www.thermofisher.com/order/catalog/product/EP0402)).
	- Suy ra k ở 25 °C ≤ 1,5 × 10⁻⁴/giờ: để trên bàn 4 giờ còn trên 99,9 % hoạt tính. Kịch bản "để quên Taq vài giờ thì băng mờ" **không đúng** với số liệu hãng nên app không mô phỏng như vậy.
- **dNTP**: ≥ 95 % còn dạng triphosphate sau 7 tuần ở nhiệt độ phòng, chịu nhiều lần đông – rã ([Thermo R0191](https://www.thermofisher.com/order/catalog/product/R0191)); NEB khuyên bỏ dNTP để ở 4 °C quá 1 tuần vì nhiễm khuẩn (chưa đưa vào mô hình).
- **Mồi**: 24 tháng ở −20 °C, > 60 tuần ở 4 °C, 30 chu kỳ đông – rã không ảnh hưởng ([IDT](https://www.idtdna.com/pages/education/decoded/article/storing-oligos-7-things-you-should-know)).
- **Đệm PCR, MgCl₂**: bền; NEB: đệm 2 tuần ở 4 °C, không quá 4 ngày ở nhiệt độ phòng; Promega: trộn đều sau khi rã (chưa đưa vào mô hình).
- **DNA khuôn**: DNA bộ gen còn khoảng 25 kb sau 18 chu kỳ đông – rã ([Shao 2012](https://pubmed.ncbi.nlm.nih.gov/24849748)); với sản phẩm 1 250 bp, phần khuôn còn nguyên giảm khoảng 0,14 % mỗi lần (suy ra; độ dài ban đầu 50 kb là minh hoạ).
- **Tế bào khả biến**: NEB 5-alpha để ở −20 °C mất 94,5 % hiệu suất sau 24 giờ, 98,9 % sau 2 ngày ([NEB FAQ](https://www.neb.com/en/faqs/can-i-store-competent-cells-at-20-deg-c-instead-of-80-deg-c)); đông lại sau khi rã giảm khoảng 3 lần ([OpenWetWare TOP10](https://openwetware.org/wiki/TOP10_chemically_competent_cells)).
- **Chủng trong glycerol 15–25 %**: bền nhiều năm ở −80 °C ([Addgene](https://www.addgene.org/plasmid-protocols/create-glycerol-stock/)); sống sót sau rã – đông lại 50 % là minh hoạ.
- **Nitơ lỏng**: sôi −195,8 °C; 1 L lỏng thành khoảng 694 L khí ([USDA ARS](https://www.ars.usda.gov/northeast-area/docs/safety-health-and-environmental-training/liquid-nitrogen-safety/)); không vào nơi oxy dưới 19,5 %; đồ bảo hộ: găng chống lạnh EN 511, tấm che mặt EN 166, tạp dề, giày bảo hộ ([SDS Linde](https://static.prd.echannel.linde.com/wcsstore/SE_REN_Industrial_Gas_Store/pdf/EN/Nitrogen_refrigerated_liquid_Biogon_N_liquid_safety_datasheet%20EN.pdf)).

### Chỗ chưa xác minh
- Thời gian hồi nhiệt sau mở cửa và ngưỡng báo động mặc định của tủ lạnh và tủ −20 °C (chỉ có trên biểu đồ).
- Tủ −80 °C đầy hàng ấm chậm hơn tủ rỗng bao nhiêu; lượng nitơ hao thêm khi mở nắp bình.
- Tế bào khả biến ở 0 °C (trên đá) dùng tạm hằng số của −20 °C; sống sót của chủng glycerol sau rã – đông lại.
- Điều kiện bảo quản nước không nuclease (hãng không ghi).

### Trong app
- Lõi `src/core/cold-lab.js`: lấy bộ thuốc thử PCR ra hộp đá hoặc cất về tủ, chuyển từng ống, chờ, kiểm tra hoạt tính. Hoạt tính nhân vào hiệu suất PCR (`pcr-chain.js`; ánh xạ minh hoạ).
- Protocol "Tủ đông: bảo quản thuốc thử PCR"; rót thuốc thử còn trong tủ thì bị chặn.
- Cảnh 3D: tủ mở cửa được, ống trên kệ bấm để lấy ra hộp đá trên bàn sinh học phân tử.
- [x] Lõi, protocol, cảnh 3D của khu tủ lạnh ✅ 2026-10-16
- Tủ −80 °C (`cold-lab.js` dùng `figures/ultrafreezer/model.mjs`): mở cửa ngoài (cửa trong đóng hoặc mở) thì không khí ấm lên và hồi phục; mất điện có hoặc không có dự phòng LN2/CO₂, mẫu trong tủ mất hoạt tính theo nhiệt độ của mẫu. Mở cửa tủ trong cảnh 3D tính đúng số giây đã mở. Protocol "Tủ âm sâu −80 °C: lấy mẫu đúng cách và xử lý sự cố mất điện".
	- Tế bào khả biến ở −70 °C coi như không mất hoạt tính, giữa −70 và −20 °C nội suy: *chưa xác minh*.
- [x] Hình chi tiết tủ −80 °C, nhiệt độ tủ khi mở cửa và mất điện ✅ 2026-10-16
- [x] Hình chi tiết bình nitơ lỏng; mức LN2 theo ngày, LOW LEVEL, nạp lại và cảnh báo thiếu oxy (protocol "Bình nitơ lỏng") ✅ 2026-10-16
	- Bình cạn: mẫu trong bình coi như ở −80 °C trong thời gian đã cạn (*minh hoạ*).

### Tủ âm sâu −80 °C — Thermo Scientific TSX40086V

#### Thông số
- **Model**: Thermo Scientific TSX40086V (dòng TSX, 230 V 50 Hz). Dòng mới tương đương là TSX Universal TSX40086FA ([brochure](https://documents.thermofisher.com/TFS-Assets/LPD/brochures/tsx-ult-freezers-general-purpose-brochure.pdf))
- **Kích thước**: ngoài 1981 × 960 × 719 mm (C × S × R), trong 1300 × 686 × 587 mm ([TDS TSX40086V](https://knowledge1.thermofisher.com/@api/deki/files/35109/TSX40086V.pdf?revision=1))
- **Sức chứa**: 549 L, 400 hộp 2 inch (16 giá × 25 hộp), 40.000 ống 2 mL; 3 kệ inox chỉnh theo bước 25 mm, tối đa 73,4 kg mỗi kệ (TDS)
- **Dải nhiệt**: −50 đến −86 °C (TDS)
- **Hệ lạnh**: hai cấp ghép tầng (cascade), 2 máy nén kín
	- R290 ở cấp 1, R170 + R290 ở cấp 2
	- Dàn ngưng micro-channel làm mát bằng quạt, ống mao
	- Dàn bay hơi kiểu thành lạnh (cold wall), xả đá thủ công (TDS)
- **Cách nhiệt**: tấm chân không (VIP) với bọt PU thổi bằng nước. Gioăng silicone có dây sưởi quanh cửa (TDS). Không được khoan vào thành tủ ([manual 333480H01](https://res.cloudinary.com/iwh/image/upload/q_auto,g_center/assets/1/26/Thermo-TSX_Universal_ULT-UserManual.pdf))
- **Hiệu năng ở môi trường 20 °C** (TDS)
	- Mở cửa 1 phút: 17 phút sau về −75 °C
	- Mất điện: từ −80 lên −50 °C trong 267 phút
	- Hạ nhiệt từ nhiệt độ phòng xuống −80 °C: 6,5 giờ
	- Đồng đều 2,9 °C, ổn định 2,3 °C, dao động đỉnh +6,0/+1,1 °C
	- 7,9 kWh/ngày, 47,5 dBA
- **Cửa**: một cửa ngoài và 2 cửa trong (có tuỳ chọn 5 cửa) ([brochure](https://documents.thermofisher.com/TFS-Assets/LPD/brochures/tsx-ult-freezers-general-purpose-brochure.pdf)). Phép thử mở cửa 1 phút của hãng làm trên tủ rỗng, mở cửa ngoài và tất cả cửa trong cùng lúc
- **Báo động** (manual)
	- Nhiệt cao: chỉnh từ 0 °C tới cách điểm đặt 5 °C
	- Nhiệt thấp: từ −99 °C
	- Cửa mở: sau 1–5 phút
	- Mất điện: rơ-le báo động từ xa; bộ điều khiển chạy pin
- **Cổng cân bằng áp** (xả chân không sau khi đóng cửa): nằm trên cửa, sau bảng điều khiển (manual)
- **Dự phòng**
	- LN2 giữ tới −76 °C, tiêu thụ 4,5–5,6 L/giờ
	- CO2 giữ tới −65 °C, tiêu thụ 3,6–4,5 kg/giờ
	- Chạy pin tối thiểu 24 giờ (brochure, manual)

#### Bộ phận để vẽ
- **Đế**: 4 bánh xe có khoá, khay đáy
- **Khoang máy**: vách, cửa lưới lọc gió có khe hút, đèn nguồn và đèn máy nén. Hông phải cắt để thấy:
	- 2 máy nén kín trên đế cao su, có hộp đấu dây và ống đẩy
	- Bình trao đổi nhiệt ghép tầng bọc cách nhiệt, ống lên dàn bay hơi
	- Dàn ngưng micro-channel và quạt có lưới bảo vệ
	- 2 ống đồng: máy nén cấp 1 → dàn ngưng, máy nén cấp 2 → bình ghép tầng
- **Thân tủ**: nóc, vách trái, vách sau, vỏ trong (liner), khung cửa
	- Hông phải cắt lớp: vỏ thép, bọt PU, VIP, bọt PU và vỏ trong
	- 10 ống đồng uốn chữ U của dàn bay hơi ép sát vỏ trong
- **Lòng tủ**: 2 thanh đỡ kệ có khe trên vách trái, ke đỡ, 3 kệ inox
	- 16 giá inox, mỗi giá có đế, 4 trụ, 4 thanh nóc và tay xách
	- Hộp giấy có đường nắp và nhãn
	- Một giá kéo ra, hộp trước tầng trên mở nắp, thấy 10 × 10 nắp ống cryo
- **Cửa trong** (2, trên và dưới): tấm cách nhiệt, chốt núm và lẫy, bản lề, đường gioăng ở mặt sau
- **Cửa ngoài**
	- Thân dày, gioăng 4 cạnh, tấm nút cửa có cổng cân bằng áp
	- Tay nắm chốt (đế, 2 trụ, thanh gạt), ổ khoá
	- 2 khớp bản lề trên cửa, 2 giá và 2 khớp cố định trên tủ
	- Màn hình cảm ứng (nhiệt độ, điểm đặt, biểu tượng ♥ hoặc chuông), đèn báo động, loa, vùng quẹt thẻ
- **Hiệu ứng**: khí lạnh tràn ra và đọng trên sàn khi mở cửa

#### Số liệu dùng cho mô hình (`figures/ultrafreezer/model.mjs`)
- **Điểm đặt và ngưỡng**: điểm đặt −80 °C, môi trường 20 °C. Ngưỡng báo động trong mô phỏng: cao −70 °C, thấp −90 °C, cửa mở quá 120 s
- **Trao đổi khí khi mở cửa**
	- τ = 100 s khi mở cả cửa trong, 800 s khi cửa trong vẫn đóng (ước tính)
	- Với hai số này, mở 1 phút lên khoảng −37 °C (mở hết cửa) hoặc khoảng −73 °C (cửa trong đóng)
- **Hồi phục**: một hằng số thời gian τr ≈ 7,9 phút, tính ngược để khớp con số 17 phút về −75 °C của TDS
- **Ấm lên khi mất điện**: định luật Newton về 20 °C, τw ≈ 12,5 giờ, khớp 267 phút từ −80 lên −50 °C của TDS. Ngoại suy ra khoảng 11,4 giờ tới −20 °C và khoảng 20 giờ tới 0 °C
- **Dự phòng khi mất điện**: LN2 giữ ở −70 °C, CO2 ở −65 °C
- **Mẫu trễ so với không khí**: τ = 45 phút (ống cryo trong hộp giấy, ước tính)
- **Dao động hiển thị**: ±1,15 °C, chu kỳ 15 phút (nửa độ ổn định của TDS, chu kỳ ước tính)

#### Chỗ chưa xác minh
- Nhiệt độ không khí khi mở cửa: hãng chỉ cho thời gian hồi phục, không cho nhiệt độ đỉnh. Hai hằng số trao đổi khí và mức giảm khoảng 8 lần nhờ cửa trong là *chưa xác minh*
- Độ trễ của mẫu (45 phút) và chu kỳ dao động (15 phút): *chưa xác minh*
- Đường ấm lên dưới −50 °C là ngoại suy từ tủ rỗng; tủ đầy mẫu ấm chậm hơn. *Chưa xác minh*
- Ngưỡng cao −70 °C và thời gian cảnh báo cửa 2 phút là giá trị người dùng chọn trong dải hãng cho phép, không phải mặc định của hãng
- Khoang máy (vị trí 2 máy nén, bình ghép tầng, dàn ngưng và quạt), đường ống và cách xếp lớp cách nhiệt vẽ theo cấu tạo điển hình. Hãng không có sơ đồ
- Hình dáng tay nắm, bản lề và bảng điều khiển vẽ theo ảnh sản phẩm và mô tả trong manual, không theo bản vẽ kỹ thuật

#### Tiến độ
- [x] Hình chi tiết tủ âm sâu −80 °C (Fig 15, `figures/ultrafreezer/`) ✅ 2026-10-16
	- Thao tác: Enter cửa ngoài, Space cửa trong, R kéo hoặc đẩy giá, P cắt hoặc cấp điện, Escape đặt lại
	- Liên động: mở theo thứ tự cửa ngoài, cửa trong, giá; đóng theo chiều ngược lại
	- Nhiệt độ trên màn hình tăng khi mở cửa và hồi phục khi đóng. Vượt ngưỡng thì màn hình đỏ, đèn nháy, sóng còi
	- Khí lạnh tràn ra khi mở cửa, quạt dàn ngưng quay khi máy nén chạy
	- Nhận `#run=`; dùng chung `model.mjs` cho lõi app sau này
	- Kiểm tra: audit đạt ở 3 tư thế (đóng hết, mở cửa ngoài, mở hết và kéo giá); `line ends: 0` sáng/tối ở mọi tư thế; 390 px không cuộn ngang; giảm chuyển động cho khung đứng yên

### Bình nitơ lỏng — Thermo Scientific Locator 4 Plus (CY509108, có bộ đo mức siêu âm)

#### Thông số
- **Kích thước**: cao 100,3 cm kể cả nắp, Ø 55,9 cm; bộ đo mức làm cao thêm 2,54 cm, xe đẩy thêm 10,16 cm (manual LT509X9 Rev 5, Section 2)
- **Dung tích**: 121 L LN2 (lưu mẫu pha lỏng); 4 giá × 10 hộp System 100 (10 × 10) = 4 000 lọ 2 mL (manual Rev 5; bảng phụ tùng manual LT509X1)
- **Bay hơi tĩnh**: 0,99 L/ngày; thời gian giữ tĩnh 122 ngày (manual Rev 5; trang sản phẩm CY509108)
	- Trang sản phẩm ghi "Energy Usage 0.60 L", khác manual; dùng 0,99 vì khớp 121 L / 122 ngày
- **Cổ bình**: Ø trong 21,5 cm (trang sản phẩm)
- **Mức tối đa**: 22" (55,8 cm) khi đã đặt giá, không cao hơn đỉnh giá (manual Rev 5, Section 3)
- **LN2**: sôi ở −196 °C; giãn nở 1 : 694 thành khí ở 20 °C (USDA ARS, Liquid Nitrogen Safety)
- **Bộ đo mức siêu âm**: không đầu dò chạm chất lỏng, sai số ±2", màn LED 8 vạch (manual Rev 5, Section 6)
	- LOW LEVEL dưới khoảng 2" (5 cm); còi và tiếp điểm báo động từ xa dưới khoảng 1" (2,5 cm); còi liên tục khi cạn
	- Bấm RESET (chế độ Reset/Hold, không đo) trước khi nhấc nắp; Hold quá 5 phút thì còi kêu
	- Sau khi đậy, khoảng 15 phút sương trong cổ mới tan và số đo ổn định
- **Mẫu**: giữ dưới −180 °C kể cả khi còn dưới 5 cm LN2 (trang sản phẩm)
- **Khác**: khối lượng vận chuyển 53,5 kg; cảnh báo O₂ dưới 19,5 % (manual, OSHA 29 CFR 1910.146)
- Nguồn:
	- https://knowledge1.thermofisher.com/Lab_Equipment/Cold_Storage_Systems/Cold_Storage_Equipment_Operator_Manuals/Cryopreservation_Operator_Manuals/LT509X9__7018141_-_Rev_5_-_Locator_and_Locator_Plus_Cryogenic_Storage_Vessel_with_or_without_Ultrasonic_Level_Monitor_-_Operation_Manual_and_Parts_List
	- https://knowledge1.thermofisher.com/Manual_Repository/LT509X1-EN_-_Rev_01_-_Locator_and_Locator_Plus_Cryobiological_Storage_Vessel_and_Liquid_Nitrogen_Level_Monitor_Operating_Manual
	- https://www.thermofisher.com/order/catalog/product/CY509108
	- https://www.ars.usda.gov/northeast-area/docs/safety-health-and-environmental-training/liquid-nitrogen-safety/

#### Bộ phận để vẽ
- **Xe đẩy**: mâm tròn, gờ ôm đáy bình (hai nửa), 4 bánh xe xoay (bánh, hai càng, chạc, đế xoay)
- **Vỏ ngoài nhôm**
	- Đáy có vát; hai mảnh trụ hai bên phần cắt; vai bình elip (tiện, cắt bằng clipPath); vành cổ
	- Cổng hút chân không có nắp nhựa đen; tấm nhãn thông số không tên hãng
- **Mặt cắt hai bên (±45°)**: thành vỏ ngoài, khoảng chân không, 3 lớp cách nhiệt nhiều lớp, thành bình trong, ống cổ sợi thuỷ tinh; vành đáy phía trước cũng cắt lộ khoảng chân không
- **Bình trong**: lòng sau, vòm, ống cổ; treo trên ống cổ, không có chân đỡ
- **LN2 và pha hơi**: LN2 trong mờ (khối cắt 270°); lớp hơi lạnh trên mặt thoáng; sương tràn ra khi mở nắp; dòng LN2 rót khi nạp
- **4 giá thép**: khay đáy, 4 thanh góc, thanh ngang trên, quai và tai đánh số; chồng 10 hộp cryo có đường nắp và khung nhãn
	- Giá phía trước là phần nhấn (lit), nhấc lên qua cổ
- **Nắp**: nút bần cắm cổ, nắp nhựa bo tròn, hộp bộ đo mức
	- Hộp đo: màn LED 8 vạch, đèn LOW LEVEL, nút RESET có đèn xanh, lưới loa còi, 3 vít
- **Bàn đồ bảo hộ**: mặt bàn có rãnh viền, khung dưới mặt bàn, 4 chân, kệ dưới
	- Đôi găng cryo (đường may ngón, cổ găng)
	- Tấm che mặt: kính cong, gờ trán, vành đội đầu, núm chỉnh, hai đế
	- Bút đánh dấu chịu lạnh; tờ nhãn cryo; cuộn nhãn cryo; hộp cryo dự phòng
- **Sàn**: tấm sàn trên chân, thước, nhãn "N₂ · −196 °C"

#### Số liệu dùng cho mô hình (`figures/ln2/model.mjs`)
- **Mức theo thể tích**: tiết diện = 121 L / 55,8 cm ≈ 2,17 L/cm; `levelCm(L)`, `litresAt(cm)`
- **Mức theo thời gian**: `levelAfter(days, startL)` = startL − 0,99 × ngày; `holdingDays(startL)`, `daysUntil(cm, startL)`
	- Nạp đầy 121 L: LOW LEVEL (5 cm) vào khoảng ngày 111, cạn sau khoảng 122 ngày
- **Nhiệt độ pha hơi**: `vaporTemp(h)` = −196 + 16·(h/50)^1,5 tới 50 cm (−180 °C), rồi tăng nhanh trong cổ tới khoảng −70 °C ở 75 cm (minh hoạ)
- **Khí N₂**: `gasM3(L)` = L × 694 / 1000
- **O₂**: `oxygenPercent(L, m³)` = 20,9 × (1 − V_khí/V_phòng); `litresToO2Limit(m³)`
	- Phòng kín 30 m³: chỉ khoảng 3 L bay hơi là O₂ xuống 19,5 %; 10 L đổ ra làm O₂ còn khoảng 13,9 %
- **Bộ đo mức**: `alarmState(cm, { hold, holdMin })` → ok / low (< 5,08 cm) / alarm (< 2,54 cm) / empty / hold / hold-alarm (> 5 phút), kèm số vạch LED 1–8

#### Chỗ chưa xác minh
- Đường kính trong bình trong (khoảng 52 cm) suy ra từ 121 L / 55,8 cm; bỏ qua thể tích giá và hộp chiếm chỗ, bỏ qua đáy cong
- Độ dày khoảng chân không (khoảng 1,5 cm), số lớp cách nhiệt, hình dạng vai và vòm, chiều dài ống cổ: vẽ theo cấu tạo điển hình của bình chân không, không theo bản vẽ của hãng
- Đường nhiệt độ pha hơi theo độ cao: minh hoạ, chỉ neo vào câu "dưới −180 °C khi còn dưới 5 cm LN2" của hãng
- Hình dạng giá (thanh góc, quai, tai số), cách xếp 4 giá quanh khoảng trống giữa để rút qua cổ: chưa xác minh
- Kích thước hộp System 100 (khoảng 133 × 133 × 51 mm): chưa xác minh
- Mức bay hơi khi mở nắp và lượng LN2 mất khi rót: hãng không công bố, mô hình bỏ qua
- Hình xe đẩy (mâm tròn 4 bánh): chưa xác minh

#### Tiến độ
- [x] Hình chi tiết `figures/ln2/` (Fig 16, mức Figure, khoảng 80 bộ phận) ✅ 2026-10-16
	- Thao tác: Enter nhấc nắp (RESET/HOLD, sương tràn ra) hoặc đậy; R nhấc giá trước qua cổ; ← → số ngày (Shift ±10) làm mức LN2 giảm theo bay hơi tĩnh, LED và LOW LEVEL đổi theo; F rót nạp đầy; Escape đặt lại; nhận `#run=`
	- Kiểm tra: `audit passed`; `line ends: 0` ở hai giao diện và mọi tư thế nghỉ (nắp đậy, nắp trên bàn, giá nhấc); cận cảnh 4×; 390 px không cuộn ngang; giảm chuyển động cho một khung đứng yên

## Tủ hoá chất và tủ hút khí độc

### Trong app
- Lõi `src/core/hood-lab.js` (dùng `figures/fumehood/model.mjs`): độ mở kính, quạt, vật cản; vận tốc mặt cửa, báo động; Cu + HNO₃ đặc sinh NO₂, nồng độ ở vùng thở trong tủ hoặc trên bàn hở so với ngưỡng NIOSH/OSHA.
	- Làm trên bàn hở: NO₂ hoà vào khoảng 3 m³/phút không khí quanh mặt người làm (*minh hoạ*).
- Lõi `src/core/safety.js`: nhãn GHS và đồ bảo hộ theo SDS (`data/safety.json`); bỏ găng hoặc kính rồi rót chất ăn mòn thì thẻ kết quả cảnh báo kèm câu H. Kiểm thử tủ hoá chất không cất chung chất tương kỵ.
	- FeCl₃ chuyển sang tủ "Acid, chất ăn mòn": cất chung KSCN (EUH032, gặp acid giải phóng khí rất độc) là tương kỵ.
- Cảnh 3D: tủ hút đúng kích thước model, kính nâng hạ theo độ mở, đèn báo động, khí nâu trong tủ hoặc tràn ra.
- Protocol "Tủ hút khí độc: Cu với HNO₃ đặc sinh NO₂": làm sai (bàn hở, kính 711 mm, quạt tắt, chai lọ sát vách ngăn, bỏ kính chống bắn) ra kết quả sai.
- [x] Tủ hút khí độc, nhãn GHS, đồ bảo hộ, cất tương kỵ ✅ 2026-10-16

### Tủ hút khí độc — Labconco Protector XStream 5 ft (110510021)

#### Thông số
- **Kích thước ngoài**: 60" × 37,7" × 59" (1524 × 958 × 1499 mm); mặt làm việc 50,1" × 27,2" (1273 × 691 mm); nặng 238 kg (nguồn: Terra Universal, SKU 110510021; bảng của Labconco chép ở BSI Lab).
- **Kính trượt**: kính an toàn cường lực trượt đứng, chạy bằng cáp và ròng rọc; chặn kính ở 18" (457 mm); mở hết 28" (711 mm) (https://labconco.com/product/protector-xstream-laboratory-hoods/24).
- **Tầm nhìn**: 37,5" (953 mm) từ mặt bàn tới tấm đầu.
- **Ống thải**: cổ inox sơn tĩnh điện, đường kính trong 12,8" (325 mm).
- **Lưu lượng thải, bản 5 ft** (https://bsilab.com/product/labconco-protector-xstream-laboratory-fume-hoods):
	- Kính mở 28": 930 CFM ở 100 fpm (s.p. 0,26), 745 CFM ở 80 fpm, 560 CFM ở 60 fpm.
	- Kính mở 18": 580 CFM ở 100 fpm (s.p. 0,12), 465 CFM ở 80 fpm, 350 CFM ở 60 fpm.
- **Vách ngăn**: Opti-Zone có khe vát, hệ vách hút xuống kép phía sau, tháo được để lau.
- **Gờ khí động**: Eco-Foil có khe Clean-Sweep, khe giữ dây hai bên.
- **Bypass**: cấp khí pha loãng phía trên; tương thích VAV.
- **Lót và chiếu sáng**: lót composite gia cường sợi thuỷ tinh, chỉ số lan lửa < 25 theo ASTM E84; đèn LED kín hơi; công tắc đèn và quạt đạt ADA.
- **Vòi dịch vụ**: 2 vòi van đồng thau rèn (gas, nước lạnh) và ổ cắm GFCI.
- **Bộ báo luồng khí Guardian Digital** (phụ kiện, https://labconco.com/p/guardian-digital-airflow-monitors):
	- Màn LCD hiện vận tốc mặt cửa.
	- Ngưỡng chỉnh được 50–250 fpm.
	- Dưới ngưỡng thì còi kêu và đèn đỏ sáng; tắt còi bằng một nút.
- **Tiêu chuẩn**: ASHRAE 110, ANSI Z9.5, SEFA 1, NFPA 45, UL 61010-1.
	- Z9.5 bản cũ ghi 80–120 fpm; bản 2022 gợi ý 80–100 fpm.
	- Thử khí đánh dấu 4 L/min: vùng thở ≤ 0,05 ppm (AM 0,05) (Lab Manager; casrai.org).
- **Tủ đế**: tủ acid Labconco Protector 9901000, lót polyethylene (supply.coreandmain.com). Nối với tủ hút qua cổng thông hơi.
- **Giới hạn NO₂**: NIOSH ngắn hạn 1 ppm, IDLH 13 ppm; OSHA trần 5 ppm (https://www.cdc.gov/niosh/npg/npgd0454.html).

#### Bộ phận để vẽ
- **Đế và tủ đế**:
	- Tấm sàn có thước và nhãn khắc "CAV · 985 m³/h"; chân đế lùi vào.
	- Tủ dung môi: cửa, tay nắm, tấm cảnh báo.
	- Tủ acid cắt hông: vách, đáy, nóc, ray; khay PE ở đáy và trên kệ; kệ; cổng thông hơi; 4 chai acid (HNO₃, H₂SO₄, HCl, chai nhỏ).
- **Mặt bàn**: epoxy lõm giữa.
- **Vỏ tủ hút**:
	- Vách trái kèm trụ trái, vách sau có mối ghép lót và vít.
	- Vách ngăn Opti-Zone: khe dưới, khe vát ở giữa, khe trên; 6 kẹp treo.
	- Trần lót, hộp đèn LED và kính đèn; tấm nóc cắt ở x > 400.
- **Trụ phải** (cắt mặt ngoài): vách trong có khe ray kính, vách trước, vách sau, trục và ròng rọc, đối trọng gang xếp tấm, 2 đoạn cáp vẽ lại theo độ mở.
- **Kính trượt**: thanh dưới, tay nắm có khe Clean-Sweep, kính cường lực, thanh trên, tai cáp.
- **Mặt trước**:
	- Gờ khí động Eco-Foil có khe.
	- Thanh ngang và kính cố định phía trên.
	- Gờ tấm đầu và tấm đầu có lưới bypass 30 khe.
	- Nhãn chặn kính, 2 công tắc.
	- Van gas và van nước trên trụ trái; 2 vòi trong buồng.
	- Ổ GFCI; bộ báo Guardian (LCD, 2 đèn, nút tắt còi).
- **Trong buồng**:
	- Giá đỡ: đế, cọc hai đoạn, khớp nối, vít, tay kẹp, kẹp ôm cổ bình.
	- Bình nón 500 mL (thân và cổ), dung dịch Cu(NO₃)₂, phoi Cu.
	- Chai HNO₃.
	- Vật cản bật/tắt được: thùng nhựa và chai dung môi.
- **Ống thải**: mặt bích, cổ ống, đai kẹp, ống, van gió và cần, quạt hướng trục–ly tâm có 2 mặt bích, hộp đấu dây, ống lên mái cắt hở.
- **Tổng**: 108 khối, 101 mục vẽ.

#### Số liệu dùng cho mô hình (`figures/fumehood/model.mjs`)
- **Lưu lượng**:
	- CAV 580 CFM = 0,2737 m³/s = 985 m³/h.
	- VAV giữ 0,508 m/s, kẹp trong 150–930 CFM.
- **Vận tốc mặt cửa** = lưu lượng / (chiều rộng hiệu dụng 1179 mm × độ mở + diện tích bypass).
	- Kính đóng vẫn tính khe Clean-Sweep 25 mm.
	- Bypass mở dần khi kính hạ dưới 300 mm, lớn nhất 0,30 m².
- **Kết quả**:
	- 457 mm → 0,51 m/s.
	- 711 mm → 0,33 m/s.
	- 0–300 mm → 0,77–0,88 m/s.
- **Báo động**:
	- Luồng khí: vận tốc < 0,41 m/s (80 fpm) hoặc quạt tắt.
	- Kính: độ mở > 457 mm.
- **Hệ số rò ở vùng thở** (ppm khi nhả 4 L/min, đạt khi ≤ 0,05 ppm):
	- 0,01 ppm khi vận tốc 0,40–0,65 m/s; dưới 0,40 m/s tăng 10 lần mỗi 0,1 m/s; trên 0,65 m/s và kính > 250 mm thì tăng do xoáy.
	- Kính trên chặn: ×(1 + 2·phần vượt/254). Kính < 150 mm: ×0,2.
	- Vật cản: ×100. Người đi ngang: ×20.
	- Quạt tắt: 0,5 ppm khi kính đóng, 5–65 ppm theo độ mở.
- **Nguồn NO₂**: Cu + 4 HNO₃ → Cu(NO₃)₂ + 2 NO₂ + 2 H₂O; 5 g Cu trong 2 phút ≈ 1,92 L/min.
	- NO₂ ở vùng thở = hệ số rò × 1,92 / 4.
	- Mức: < 1 ppm an toàn; 1 ppm vượt ngắn hạn; 5 ppm vượt trần; 13 ppm vượt IDLH.
- **Ví dụ**:
	- Kính 457 mm: 0,005 ppm.
	- Kính 711 mm: 0,078 ppm (không đạt AM 0,05).
	- Vật cản: 0,48 ppm.
	- Quạt tắt, kính 457 mm: 21 ppm.

#### Chỗ chưa xác minh
- Chiều rộng hiệu dụng 1179 mm suy ra từ bảng lưu lượng; diện tích và ngưỡng bypass Labconco không công bố.
- Ngưỡng báo 80 fpm là giá trị chọn (Guardian chỉnh được 50–250 fpm).
- Chiều cao kính trượt 650 mm và kính cố định phía trên là giả định để khớp tầm nhìn 37,5" với độ mở 28".
- Đối trọng 1 : 1, ròng rọc và cáp trong trụ, buồng áp, quạt hướng trục–ly tâm: vẽ theo cấu tạo điển hình, không có sơ đồ của hãng.
- Mặt bàn sâu bằng tủ hút (958 mm); tủ đế sâu 760 mm, cao 900 mm.
- Ống thông hơi nối tủ acid với ống thải không vẽ.
- Hệ số rò theo vận tốc, vật cản, người đi ngang và quạt tắt là số MINH HOẠ, không phải số đo của model.
- TWA 0,2 ppm của ACGIH chưa đối chiếu; EN 14175 chưa đối chiếu văn bản gốc.

#### Tiến độ
- [x] Hình chi tiết tủ hút khí độc `figures/fumehood/` (Fig 17, mức Figure, 108 khối) ✅ 2026-10-16
	- Thao tác:
		- ↑/↓ kính qua các nấc 0 · 152 · 305 · 457 · 711 mm; Space bật/tắt quạt; C vật cản; W người đi ngang (gió ngang).
		- Hạt khí theo đường đi thật; NO₂ thoát ra khi tủ không giữ được; bộ báo LCD có đèn đỏ.
		- Tour tự chạy, dừng khi ra khỏi màn hình, đứng yên khi giảm chuyển động; nhận `#run=`.
	- Kiểm tra:
		- `audit passed`; `line ends: 0` ở hai giao diện và 5 tư thế kính.
		- Cận cảnh 4× các mối nối, sáng và tối.
		- 390 px không cuộn ngang.
	- Chưa gắn vào app: `DETAILS`, nhãn "Cận cảnh", README.

## Bàn hoá học và tủ dụng cụ

### Nhiệt động (số liệu trong `data/thermo.json`)
- ΔH của cả 30 phản ứng tính từ ΔfH° (NBS 1982, CRC); cốc nóng lên theo nhiệt dung của dung dịch và thành cốc. Ví dụ 25 mL HCl 1 M + 25 mL NaOH 1 M ấm lên khoảng 5,8 °C.
- Ksp ở 25 °C và ΔH hoà tan (CRC); Ksp theo nhiệt độ bằng van 't Hoff, có ion chung từ chất dư. PbI₂: Ksp ở 95 °C lớn hơn ở 25 °C khoảng 130 lần.
- Kết tinh lại: nguội chậm hơn 10 K/phút ra vảy tinh thể, nhanh hơn ra bột mịn (ngưỡng *minh hoạ*).
- Làm nguội: h đối lưu tự nhiên 7 W/(m²·K) (*minh hoạ*, Incropera 5–10); chậu nước đá 200 W/(m²·K) (*minh hoạ*).

### Trong app
- Lõi `src/core/heat-lab.js`: đun cốc bằng mô hình mặt đế – dung dịch của máy khuấy (cốc 50 mL dạng thấp, ISO 3819), có hoặc không có đầu dò; mạch an toàn đặt cao hơn nhiệt độ đặt 60 K để cốc nhỏ không vượt nhiệt (*minh hoạ*).
- Lõi `src/core/balance-lab.js`: trừ bì, cửa kính, lực đẩy không khí, khối lượng tối thiểu USP, bình định mức cấp A (ISO 1042: 100 mL ±0,10 mL, 10 mL ±0,02 mL).
- Cảnh 3D: cân và máy khuấy sau hàng chai trên bàn hoá học, mặt đế đỏ dần khi nóng; chai nước cất.
- Protocol "Mưa vàng: kết tinh lại PbI₂" (sai: KI dư nhiều, đặt 60 °C, không đầu dò, ngâm nước đá) và "Pha 100 mL dung dịch chuẩn NaCl 0,1000 M" (sai: quên trừ bì, ghi số khi cửa mở, cân dưới 160 mg).
- [x] Nhiệt phản ứng, đun nóng, độ tan PbI₂, cân phân tích, máy khuấy từ ✅ 2026-10-16
- Tốc độ phản ứng: Na₂S₂O₃ + HCl, thời gian đục theo Arrhenius với Ea 48 kJ/mol (khoảng 44–50 trong các bài đo; mốc 60 s ở 25 °C và 0,15 M là *minh hoạ*), tỉ lệ nghịch với nồng độ thiosulfate lúc trộn. Protocol "Tốc độ phản ứng theo nhiệt độ".
- Cân bằng tạo phức Fe³⁺ + SCN⁻ ⇌ FeSCN²⁺: K = 917 ở lực ion 0 (de Berg 2017 cho 708; môi trường acid khoảng 140, *chưa xác minh*), ΔH −4,54 kJ/mol (NBS 1982), ε 4700 L/(mol·cm) ở 447 nm (Frank & Oswalt 1947). Protocol "Cân bằng hoá học: Fe³⁺ + SCN⁻ (Le Chatelier)".
- [x] Tốc độ phản ứng theo Arrhenius, cân bằng Fe³⁺/SCN⁻ ✅ 2026-10-16
- Cân bằng 2NO₂ ⇌ N₂O₄ trong ống kín (trong `hood-lab.js`): Kp 25 °C = 6,75 bar⁻¹, ΔH = −57,12 kJ/mol (JANAF qua WebBook NIST), van 't Hoff; P0 = 1 bar quy về NO₂ ở 25 °C (*minh hoạ*). Ở 0 °C khoảng 9 % nitơ ở dạng NO₂, 25 °C khoảng 24 %, 80 °C khoảng 75 %. Protocol "Cân bằng 2NO₂ ⇌ N₂O₄".
- Tủ dụng cụ thêm pipet chia vạch 10 mL cấp A, ±0,05 mL (ISO 835, *chưa đối chiếu văn bản gốc*).
- [x] Cân bằng khí NO₂/N₂O₄ ✅ 2026-10-16
- Kết tinh lại KNO₃ (`hp-kno3` trong `heat-lab.js`): độ tan theo bảng 0–100 °C trong `data/thermo.json` (Wikipedia, nguồn thứ cấp), ΔH hoà tan +34,89 kJ/mol; 20 g trong 20 mL nước, 80 °C → 0 °C thu khoảng 17,3 g. Protocol "Kết tinh lại KNO₃".
- [x] Độ tan KNO₃, kết tinh lại ✅ 2026-10-16

### Cân phân tích — Mettler Toledo MS204TS

#### Thông số
- **Model**: Mettler Toledo MS204TS (dòng MS-TS, độ đọc 0,1 mg), cảm biến lực MonoBloc bù điện từ (EMFR)
	- Nguồn: tờ thông số MS-TS 30247877B (08/2019) https://www.mt.com/dam/P5/labtec/02_Analytical_Balances/MS-TS_Analytical/03_Documentation/Data_Sheet/DS_MS-TS_Analytical_EN.pdf
	- Nguồn: Operating Instructions MS-TS, mục 12.2.1 và 12.3.1 (bản lưu https://nanoionics.pitt.edu/sites/default/files/Mettler.pdf)
- **Tải**: tối đa 220 g, danh định 200 g; **độ đọc** 0,1 mg
- **Độ lặp lại**: giới hạn 0,1 mg, điển hình 0,08 mg; **độ lệch tuyến tính**: giới hạn 0,2 mg, điển hình 0,06 mg
- **Lệch độ nhạy** 0,8 mg ở tải danh định (sau hiệu chỉnh trong); trôi độ nhạy 1,5 ppm/°C
- **Khối lượng tối thiểu**: USP (dung sai 0,10 %) 160 mg; dung sai 1 % 16 mg; OIML 10 mg (ở 5 % tải, k = 2)
- **Thời gian ổn định** 2 s; làm ấm 60 phút
- **Đĩa cân** ∅ 90 mm, thép không gỉ 1.4404; chiều cao dùng được trong buồng kính 236 mm
- **Kích thước** 204 × 347 × 348 mm (rộng × sâu × cao), nặng 5,9 kg
- **Buồng kính** PBT + kính, cửa hông trượt ra sau (mở 140 mm, thò ra sau máy 99 mm theo bản vẽ), cửa trên
- **Thăng bằng**: bọt thuỷ trên đầu màn hình, LevelControl cảnh báo, hai chân chỉnh phía trước bù mặt bàn nghiêng ±2 %
- **Hiệu chỉnh** trong tự động FACT (theo thời gian và nhiệt độ)
- **Màn hình** cảm ứng màu 7 inch, chữ số cao 18 mm; nguồn 12 V DC, 10 W; môi trường 10–30 °C, ẩm 10–80 %

#### Bộ phận để vẽ
- **Đế** nhôm đúc:
	- Sàn, vách, nắp đế; góc phải cắt bậc (sâu tới x = 24 mm phía sau vòng chắn gió, x = 52 mm phía trước)
	- Hai chân chỉnh ren có khía phía trước, hai chân cố định phía sau
- **Khối màn hình dốc**: màn cảm ứng (số gam 4 chữ số thập phân, ký hiệu chưa ổn định, Net, thanh tới đích, khối lượng tối thiểu USP), bốn phím, bọt thuỷ
- **Buồng kính**:
	- Cột sau có khe thông gió, trụ trước, ray trên, ray dưới
	- Kính trước, cửa trên có tay nắm
	- Hai cửa hông có tay nắm đứng; cửa phải trượt
- **Trong buồng**: tấm sàn thép, vòng chắn gió, đĩa ∅ 90 trên giá đỡ và trụ
- **Cảm biến bù điện từ** (cấu tạo điển hình):
	- Khối nhôm nguyên khối có rãnh cắt dây (hai thanh dẫn song song, đòn bẩy, khớp mỏng); trụ đĩa và vòng đệm
	- Cốc nam châm với khe từ; cuộn dây đồng (sáng theo tải); đòn bẩy
	- Cờ chắn và chạc quang LED – photodiode
- **Quả cân chuẩn trong (FACT)** trên giá nâng, động cơ nâng
- **Bo mạch**: vi điều khiển, ADC, tụ, ba đầu cắm; ba dây (cảm biến, động cơ, màn hình)
- **Mẫu**: thuyền cân polystyrene, đống bột hình nón, lọ HDPE miệng rộng có nhãn tên chất, nắp, thìa muỗng – dao 152 mm

#### Số liệu dùng cho mô hình (`figures/balance/model.mjs`)
- **Số đọc** = khối lượng thật × hệ số lực đẩy không khí × cos θ (lệch thăng bằng) − bì + nhiễu, làm tròn 0,1 mg
- **Lực đẩy không khí** (OIML D 28 / R 111): ρ_kk = 1,2 kg/m³, ρ_quả cân = 8000 kg/m³
	- m_thật = m_đọc × (1 − ρ_kk/ρ_quả cân)/(1 − ρ_kk/ρ_mẫu)
	- Ví dụ: 0,5844 g NaCl thật đọc 0,5842 g; 0,5106 g KHP đọc 0,5103 g
- **Khối lượng riêng** (CRC/PubChem): NaCl 2,17; KHP 1,636; glucose 1,54; sucrose 1,587; CuSO₄·5H₂O 2,286 g/cm³; thuyền polystyrene 1,05
- **USP <41>**: 2·s/m ≤ 0,10 %, s ≥ 0,41 d → m_min = 2 × 0,08 mg / 0,001 = 160 mg (khớp tờ thông số); 1 % → 16 mg
- **Lệch thăng bằng** 1° (1,75 %) → số đọc nhỏ đi 152 ppm; tính cả phần bì đã trừ lúc cân còn thẳng
- **Ổn định**: báo ổn định khi đã qua 2 s và độ lệch chuẩn của nhiễu ≤ 1 độ đọc
- **Minh hoạ**:
	- Nhiễu khi mở cửa: độ lệch chuẩn 0,6 mg, trôi ±1 mg
	- Mẫu ấm: −0,1 mg/K, hằng số thời gian 300 s; mẫu tích điện tĩnh làm trôi
	- Quá độ: tắt dần, τ = 0,22 s
	- Thuyền 0,3816 g; một thìa 90–210 mg; khối lượng riêng đổ đống và góc nghỉ 35° để vẽ đống bột

#### Chỗ chưa xác minh
- Cấu tạo bên trong (khối MonoBloc, đòn bẩy, cuộn dây, cảm biến quang, quả cân FACT, bo mạch): vẽ theo cấu tạo điển hình của cân bù điện từ, không có sơ đồ của hãng
- Hình dáng khối màn hình dốc và vị trí phím, bọt thuỷ: lấy gần đúng theo hình trong hướng dẫn sử dụng
	- Màn 7 inch vẽ 144 × 70 mm trên mặt dốc
- Cột sau rộng 188 mm, để cửa hông trượt ra ngoài nó (bản vẽ của hãng không ghi số này)
- Nhiễu khi mở cửa, cách số đọc ổn định, sai số do mẫu ấm hay tích điện: minh hoạ, hãng không cho số
- Khối lượng thuyền cân, lượng một thìa: ước lượng
- Khối lượng riêng chất rắn và số OIML D 28 / R 111, USP <41>: chép từ tài liệu đã biết, chưa mở bản gốc trong lần tra này
	- Riêng USP khớp với khối lượng tối thiểu 160 mg trong tờ thông số
- Fisher Scientific ghi 34,7 × 20,4 × 34,5 cm và 9,5 kg (có thể là kiện hàng); hướng dẫn sử dụng ghi 5,9 kg, đã dùng số của hướng dẫn

#### Tiến độ
- [x] Hình chi tiết cân phân tích `figures/balance/` (Fig 18), mô hình `model.mjs`, audit passed, line ends 0 ở cả hai giao diện và mọi tư thế nghỉ ✅ 2026-10-16

### Máy khuấy từ gia nhiệt — IKA C-MAG HS 7 control

#### Thông số
- **Gia nhiệt**: điện trở 1000 W (công suất vào 1020 W), mặt đế ceramic 180 × 180 mm
	- Nhiệt độ mặt đế: nhiệt độ phòng – 500 °C, đặt theo bước 5 K; có đầu dò thì đặt theo nước, bước 1 K
	- Mạch an toàn chỉnh được 100–650 °C (bản C-MAG HS 7 thường: cố định 550 °C)
	- Tốc độ gia nhiệt 5 K/phút (1 L nước trong cốc H1500)
	- Nguồn: [Data Sheet C-MAG HS 7 control](https://cdn.abicart.com/shop/ws72/72372/art16/156948916-acd6b9-Data_Sheet_C-MAG_HS_7_control.pdf)
- **Khuấy**: 50–1500 vòng/phút, bước 10, mô tơ 9 W, đảo chiều tự động
	- Tối đa 20 L nước; con khuấy dài 30–80 mm
	- Mặt đế tự nóng thêm 2 K khi khuấy tối đa 1 giờ
- **Đầu dò nhiệt**: cắm PT1000, ETS-D5 hoặc ETS-D6; PT1000 đo −10 đến 400 °C
	- Độ chính xác: ±0,5 K với PT1000 và ETS-D5, ±0,2 K với ETS-D6 (500 mL nước, cốc 600 mL, con khuấy 40 mm, 600 vòng/phút, 50 °C); mặt đế ±5 K ở 100 °C
- **Đèn báo Hot Top**: báo mặt đế còn nóng sau khi tắt, ngưỡng trên 50 °C
	- Nguồn: [govsci C-MAG HS 7](https://www.govsci.com/product-detail/IKA--Works--Inc/0003581201/EA/), [Cole-Parmer](https://www.coleparmer.com.cn/i/ika-c-mag-hs-7-control-digital-square-top-stirring-hot-plate-ceramic-115-v/0467103)
- **Kích thước**: 220 × 88 × 354 mm (rộng × cao × sâu), 4 kg, IP 21
- **Cốc 250 mL dạng thấp (ISO 3819)**: Ø70 × 95 mm; thành và đáy dày khoảng 1,5 mm

#### Bộ phận để vẽ
- **Vỏ**: đáy liền khối trên 4 chân cao su, có khe thông gió và trụ vít
	- Vách trái, vách sau, hai trụ góc sau, gân đỡ giá
	- Mặt trên quanh mặt đế; mặt đế ceramic
- **Bảng điều khiển nghiêng**: màn hình LCD (nhiệt độ đặt/thực, tốc độ đặt/thực, biểu tượng đầu dò, biểu tượng đang đun, tam giác Hot Top), ba phím mềm, hai núm vặn có khía, công tắc nguồn ở đầu phải
- **Bên trong** (thân cắt ở x = 38 mm, tấm cách nhiệt cắt lùi vào x = 10 mm):
	- Tấm mang dây điện trở xoắn trong rãnh (đỏ dần theo công suất)
	- Tấm cách nhiệt sợi gốm, cầu chì nhiệt, hộp nối dây điện trở
	- Đĩa thép mang cặp nam châm (cực N/S) trên mô tơ một chiều có giá đỡ
	- Bo mạch công suất (rơ-le, biến áp, triac có tản nhiệt, tụ); dây mô tơ và dây điện trở
- **Trên mặt đế**: cốc 250 mL có vạch chia, nước, con khuấy PTFE 30 mm có vòng xoay giữa
- **Giá**: đế ren, cột Ø16, khớp nối chữ thập có vít vặn tay, thanh ngang, kẹp đầu dò
- **Đầu dò PT1000**: ống inox Ø3 nhúng vào nước, cán nhựa, dây về ổ cắm ở mặt sau

#### Số liệu dùng cho mô hình (`figures/hotplate/model.mjs`)
- **Số có nguồn**: nhiệt dung riêng của nước 4,18 J/(g·K); ẩn nhiệt hoá hơi 2257 J/g ở 100 °C; áp suất hơi theo Antoine (A 8,07131, B 1730,63, C 233,426)
- **Mô hình hai nút** (số minh hoạ):
	- Mặt đế: C_p = 400 J/K, mất nhiệt h_p = 1,0 W/K
	- Nước: m·c·dT/dt = G·(T_p − T) − hA·(T − T_phòng) − Q_bay hơi
	- G = 140 W/(m²·K) × diện tích đáy × (0,55 + 0,45·s), với s là mức khuấy
	- hA = 10 W/(m²·K) × diện tích thành ướt và mặt thoáng; bay hơi 60 W/(m²·kPa) × A × (p_bh(T) − 0,5·p_bh(T_phòng))
	- Hiệu suất η = G·(T_p − T)/P không cố định; khoảng 0,3–0,35 khi mặt đế chạy hết công suất
- **Kiểm lại với datasheet**: 1 L nước, mặt đế 500 °C → khoảng 5,6 K/phút (datasheet: 5 K/phút)
- **Kết quả với 200 mL trong cốc 250 mL, 600 vòng/phút**:
	- Có đầu dò, đặt 80 °C: lên 79 °C sau khoảng 8,3 phút, vượt quá 0,8 K, ổn định ở 80,0 °C (mặt đế khoảng 118 °C)
	- Không đầu dò, mặt đế đặt 80 °C: nước chỉ ổn định ở khoảng 59 °C
- **Bộ điều khiển**: PI có bù trước (k_p = 10, k_i = 0,05/s, chỉ tích phân khi sai lệch dưới 3 K); mặt đế không quá 500 °C và mạch an toàn
- **Sôi**: nước giữ ở 100 °C, nhiệt thừa làm bay hơi (2257 J/g)
- **Con khuấy văng** (minh hoạ): n_c = 1250 × (30/L)^0,5 × μ^−0,25 × (V/200)^0,15 vòng/phút, tức 1250 vòng/phút với con khuấy 30 mm trong nước
- **Phễu xoáy** (minh hoạ): Δ = (0,12·ω·R)²/g, tối đa 0,55 chiều cao cột nước
- **Chênh nhiệt đáy – mặt** (minh hoạ): ΔT = Q/(10 + 60·s)

#### Chỗ chưa xác minh
- Ngưỡng đèn Hot Top 50 °C: lấy từ listing của nhà phân phối (Cole-Parmer), chưa có manual của IKA
- Cấu tạo bên trong vẽ theo cấu tạo điển hình, không theo sơ đồ của hãng: dây điện trở trong rãnh tấm sợi gốm, mô tơ, cặp nam châm, bo mạch, cầu chì nhiệt
- Vị trí ổ cắm đầu dò ở mặt sau: chưa xác minh
- Kích thước giá H 16 V, khớp nối, thanh ngang và đầu dò PT1000 (Ø3 mm, chiều dài): chưa xác minh
- Mọi hệ số nhiệt, ngưỡng văng, độ sâu phễu là số minh hoạ

#### Tiến độ
- [x] Hình chi tiết `figures/hotplate/` (Fig 19): model.mjs, stir.mjs, build.mjs, live.js, hotplate.css; `audit passed`, `line ends: 0` ở hai giao diện và các tư thế nghỉ; cận cảnh 4×, 390 px không cuộn ngang ✅ 2026-10-16

## Khu nuôi sinh vật

### Trong app
- Tủ ấm ruồi giấm có cửa kính mở được, lọ trong tủ theo các lọ lai đang nuôi và giai đoạn vòng đời (trứng, ấu trùng, nhộng) theo `data/fly.json`.
- Thẻ đếm ruồi vẽ ruồi đực/cái và các đột biến bằng `flySvg` của hình kính lúp.
- [x] Tủ ấm và lọ ruồi theo thí nghiệm, kính lúp soi nổi ✅ 2026-10-16
- Cho cá đẻ (`zf-spawn` trong `zebrafish.js`): ghép 3 cặp có vách ngăn từ tối hôm trước, rút vách theo giờ; cá đẻ 15 phút sau khi có ánh sáng (đèn bật 08:00), rút muộn quá 2 giờ thì đẻ ít dần; mỗi cặp đẻ 0,6–1,4 lần số trứng của model (*minh hoạ*). Protocol PG và OECD 236 có bước cho cá đẻ.
- [x] Giá nuôi cá ngựa vằn, cho cá đẻ ✅ 2026-10-16

### Giá nuôi cá ngựa vằn — Tecniplast ZebTEC Active Blue Stand Alone (4 hàng)

#### Thông số
- **Kích thước giá** 4 hàng: 1620 × 565 × 1800 mm; 4+1 hàng × 2000; 5 hàng × 2060; 5+1 hàng × 2250; 6 hàng × 2350 mm ([Tecniplast CAT141](https://www.somatco.com/zebtec_active_blue.pdf))
- **Bể**: 1,1 L, 3,5 L, 8,0 L dùng chung một giá, không phải thay ống chia; 3,5 L và 8 L thay thế lẫn nhau (hai bể 3,5 L bằng chỗ một bể 8 L); có vách ngăn cho bể 3,5 L ([CAT141](https://www.somatco.com/zebrafish-housing.pdf))
	- Bản mới thêm bể 2,4 L; đáy rãnh chữ V dốc từ trước ra sau; nhựa xanh chống tảo, hấp tiệt trùng được ([TP AQUATICS](https://www.tecniplast.it/usermedia/uk/TP_AQUATICS.pdf))
- **Lọc cơ học**: lọc trống tự rửa ngược, lưới 40 µm hoặc 26 µm; nước rửa ngược tính vào lượng nước thay ([CAT141](https://www.somatco.com/zebtec_active_blue.pdf))
- **Khử trùng UV**: liều tới 180 000 µW·s/cm² ở cuối tuổi thọ bóng ([CAT141](https://www.somatco.com/zebrafish-housing.pdf)); thay bóng mỗi năm hoặc 9000 giờ ([SOP 808 USF](https://usf.edu/research-innovation/research-support/comparative-medicine/documents/sops/s808-tecniplast-zebtec-aquatics-system.pdf))
- **Lọc sinh học** Biochip (đĩa nhựa chuyển động, thổi khí); túi than hoạt tính là tuỳ chọn ([CAT141](https://www.somatco.com/zebtec_active_blue.pdf), [SOP 808](https://usf.edu/research-innovation/research-support/comparative-medicine/documents/sops/s808-tecniplast-zebtec-aquatics-system.pdf))
- **Van "push and pull"** ở từng bể, chỉnh tinh lưu lượng, có ô chỉ thị dòng chảy; bộ ổn áp giữ lưu lượng từ 5 lần thể tích bể mỗi giờ (5 WCH) tới nhỏ giọt ([CAT141](https://www.somatco.com/zebtec_active_blue.pdf))
- **Bồn kỹ thuật**: bơm tuần hoàn, thanh gia nhiệt, cảm biến mức nước; đo và tự bù nhiệt độ, pH, độ dẫn điện; màn hình cảm ứng, cổng USB, báo động qua mạng ([TP AQUATICS](https://www.tecniplast.it/usermedia/uk/TP_AQUATICS.pdf))
	- Định lượng bicarbonate và muối; hiệu chuẩn đầu đo pH và độ dẫn điện 3 tháng một lần; không rút quá 20 % số bể cùng lúc ([SOP 808](https://usf.edu/research-innovation/research-support/comparative-medicine/documents/sops/s808-tecniplast-zebtec-aquatics-system.pdf))
- **Điều kiện nuôi**: 24–29 °C, pH 6,5–8, 150–1700 µS/cm, 14 giờ sáng / 10 giờ tối, 54–334 lux, 4–10 cá trưởng thành/L, thay 5–10 % nước mỗi ngày ([Aleström 2020](https://pmc.ncbi.nlm.nih.gov/articles/PMC7301644/))
	- Phòng nên thấp hơn nước nuôi 2–3 °C khi giá không có bộ làm lạnh ([FAQ Tecniplast](https://www.tecniplast.it/en/faqs.html))

#### Bộ phận để vẽ
- **Khung**: 4 cột thép sơn, chân chỉnh cao bọc cao su, dầm đáy, sàn bồn, 4 tầng kệ (dầm trước/sau, tấm kệ có rãnh ray), dầm và tấm nóc, máng tràn sau mỗi hàng
- **Bể**: 14 × 1,1 L, 2 hàng × 10 × 3,5 L, 5 × 8 L; mỗi bể vẽ đáy, 4 vách nhựa xanh trong, vạch mặt nước, thẻ nhãn, nắp có lỗ cho ăn
	- Bể giao phối 3,5 L: nắp hai nửa, vách ngăn trong suốt có tay rút
- **Đường nước**: van push-pull (thân, vòi, núm, ô chỉ thị); ống đứng bên trái; 4 cút chữ T; 4 ống chia phía trước, có nắp bịt; 4 đoạn ống tràn bên phải; ống hút; ống đẩy bơm → UV
- **Thiết bị kỹ thuật**: bồn đúc (ống thăm mức nước, van xả, nắp, đầu nối thành bồn); lọc sinh học có cửa sổ (giá thể, bọt khí, cổng khí); lọc trống có cửa sổ tròn (trống lưới quay, hộp vòi rửa ngược); bơm ly tâm (đế, chân, đầu bơm, động cơ có gân, chụp quạt, hộp đấu điện, cửa hút, cửa đẩy); đèn UV (đế, thân, vòng chỉ thị, nắp, cổng ra, cổng vào bên hông); thanh gia nhiệt; đầu đo pH; đầu đo độ dẫn điện
- **Tủ điều khiển**: màn hình (nhiệt độ, pH, độ dẫn điện, lưu lượng, giờ), đèn báo OK/báo động, cổng USB, lỗ thông gió, 3 ốc chặn cáp, 3 cáp đầu đo
- **Đèn LED dưới dầm trước** của mỗi kệ (minh hoạ chu kỳ sáng tối)

#### Số liệu dùng cho mô hình
- Lưu lượng mỗi bể = thể tích × số lần thay mỗi giờ; mặc định 3 lần/giờ (*minh hoạ*, nằm trong khoảng nhỏ giọt – 5 WCH của hãng) → bể 3,5 L nhận 10,5 L/giờ, cả giá khoảng 6,3 L/phút
- Một thể tích nước mới vào sau V/Q = 20 phút; nước trong bể coi như trộn đều: nước cũ còn lại exp(−Q·t/V), thay 99 % sau khoảng 92 phút
- Đèn bật 08:00, sáng 14 giờ, tối 10 giờ (giờ bật là *minh hoạ*, tỉ lệ 14/10 theo [Aleström 2020](https://pmc.ncbi.nlm.nih.gov/articles/PMC7301644/))
- Cá đẻ: vách còn thì không đẻ; rút vách khi đèn sáng thì 15 phút sau bắt đầu đẻ ([LabTips](https://www.labcompare.com/10-Featured-Articles/580908-LABTips-Zebrafish-Breeding-and-Embryo-Handling/); bằng sáng chế US 7 713 925 ghi 15–30 phút); rút lúc tối thì chờ tới khi đèn bật
	- Số trứng 150 × (1 − exp(−t/25 phút)) (*minh hoạ*); rút vách quá 2 giờ sau khi đèn bật thì cá đẻ ít dần (*minh hoạ*)
- Điểm đặt 28,5 °C, pH 7,5, 500 µS/cm (pH và độ dẫn điện là điểm đặt *minh hoạ*, trong khoảng khuyến cáo); báo động khi lưu lượng 0 hoặc nhiệt độ ra ngoài 24–29 °C
- Bơm tắt: nước trong bể nguội về 26 °C, τ = 180 phút cho bể 3,5 L, tỉ lệ với căn bậc ba thể tích (*minh hoạ*)

#### Chỗ chưa xác minh
- Kích thước từng bể (1,1 L: 95 × 270 × 130 mm; 3,5 L: 135 × 400 × 160; 8 L: 280 × 400 × 160) và số bể mỗi hàng ước theo bề rộng giá; hãng không công bố trong các tài liệu trên
- Bên trong lọc trống, lọc sinh học, vị trí bơm, đèn UV, đầu đo, thanh gia nhiệt trong bồn: vẽ theo cấu tạo điển hình, không có sơ đồ của hãng
- Đèn LED trên giá là minh hoạ; thực tế ánh sáng thường là đèn phòng theo hẹn giờ
- Lưu lượng mặc định, số trứng, tốc độ nguội, điểm đặt pH và độ dẫn điện là số minh hoạ
- Thời gian bắt đầu đẻ 15–30 phút lấy từ bằng sáng chế, chưa đối chiếu The Zebrafish Book

#### Tiến độ
- [x] Hình chi tiết `figures/zebrafish/` (Fig 22, mức Figure) ✅ 2026-10-16
	- `model.mjs`, `build.mjs`, `live.js`, `zebrafish.css`, `zebrafish.html`, `zebrafish-light.html`
	- Thao tác: Space bật/tắt bơm, D rút/cắm vách ngăn, ←→ lùi/tiến 1 giờ; bấm bể giao phối để rút vách
	- Nhận `#run={"lightOn":true,"hour":9,"divider":"out","pump":true,"tanks":6}`
	- Kiểm tra: `audit passed`; `line ends: 0` sáng/tối ở các tư thế vách cắm, vách rút, bơm tắt và giảm chuyển động; 390 px không cuộn ngang
- [x] Gắn vào app: nhãn cận cảnh trong khu nuôi sinh vật; lõi cho cá đẻ `zf-spawn` dùng `spawning()` của model ✅ 2026-10-16

### Kính lúp soi nổi và tấm gây mê CO₂ — Olympus/Evident SZ61 + Flystuff Flypad 59-114

#### Thông số
- **Kính lúp soi nổi Olympus/Evident SZ61** ([trang sản phẩm Evident](https://industrial.evidentscientific.com.cn/cs/microscope/sz61/))
	- Hệ quang Greenough, zoom 0,67×–4,5× (tỉ lệ 6,7 : 1), ống hai mắt nghiêng 45° hoặc 60°.
	- Vật kính 1× có sẵn: NA 0,071, khoảng cách làm việc 110 mm; độ phóng đại tổng 6,7×–45×; trường nhìn Ø 32,8–4,9 mm.
	- Vật kính phụ 0,5× (WD 200 mm), 0,75× (130 mm), 1,5× (61 mm), 2× (38 mm). Bộ chuẩn 194 × 253 × 368 mm, 3,5 kg.
	- Thị kính WHSZ10X-H: 10×, FN 22 ([micro-pro](https://www.micro-pro.com/en/for-stereo-microscopes/evident-olympus-eyepiece-whsz10x-h-esd-10x22-foc-/p,56071)); góc hội tụ Greenough 10° ([Edmund Optics](https://www.edmundoptics.com/p/olympus-sz61-stereo-microscope-body-with-45deg-trinocular/30405/)).
- **Tấm gây mê Flystuff Flypad 59-114** ([Genesee](https://www.geneseesci.com/product/flystuff-drosophila-flypads/?sku=59-114)): 8,1 × 11,6 cm, mặt polyethylene xốp UHMW 3 mm trên đế acrylic 12 mm; bộ 59-122BC gồm Flowbuddy, súng thổi 54-104 ([Genesee](https://ariba.geneseesci.com/shop-online/product-details/59-122BC)); lưu lượng 5–15 L/phút ([nhà bán](https://www.tritechresearch.com/MINJ-DROS-FP.html)).
- **Đèn LED cổ ngỗng kiểu SCHOTT KL 300 LED** ([microscopeworld](https://www.microscopeworld.com/complete-system-schott-kl-300-led/)).
- **Gây mê CO₂**
	- Để ruồi trên tấm 2–3 phút, không quá 5 phút; từ 10 phút trở lên ruồi tỉnh chậm rõ rệt ([Kaun lab](https://www.kaunlab.com/post/how-long-can-i-anesthetize-my-flies)).
	- Shen và cộng sự 2020: phơi 10–150 phút thì càng lâu càng nhiều ruồi chết, con đực nặng hơn ([FlyBase](https://flybase.org/reports/FBrf0244186.html)).
	- Bartholomew và cộng sự 2015: 5 phút CO₂ 100 % đã làm giảm khả năng leo trèo tới 24 giờ ([PMC4609961](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4609961/)).

#### Bộ phận để vẽ
- Đế nặng, trụ đứng Ø 32 mm, khối lấy nét với hai núm có khía; thân zoom với hai núm zoom có vạch; ống hai mắt nghiêng 45°, hai thị kính 10× có vòng chỉnh diop.
- Tấm CO₂ (đế acrylic, mặt xốp, ốc nối ống), bộ chỉnh lưu lượng có ống đo bi nổi, súng thổi CO₂, đèn LED cổ ngỗng, cọ lông, lọ ruồi, lọ bỏ ruồi chứa dầu.
- Ô trường nhìn vẽ ruồi bằng `flySvg` theo zoom, mờ theo độ lệch nét.

#### Số liệu dùng cho mô hình (`figures/stereo/model.mjs`)
- Độ phóng đại tổng = zoom × vật kính phụ × 10; trường nhìn = FN 22 / (zoom × vật kính phụ): 32,8 mm ở 0,67×, 4,9 mm ở 4,5×.
- Độ sâu trường theo Berek λ/(2NA²) + 340 µm/(NA·M) ([Leica](https://leica-microsystems.com/science-lab/how-sharp-images-are-formed)): khoảng 7,3 mm ở 6,7×, 0,16 mm ở 45×.
- Ruồi: con cái dài 2,5 mm, bụng nhọn có sọc tách; con đực 2,0 mm, đầu bụng tròn sẫm liền, có lược sinh dục; đột biến w mắt trắng, b thân đen, vg cánh cụt.
- CO₂ (*minh hoạ* theo xu hướng các nguồn): thời gian tỉnh = 1,0 + 0,06 × số phút phơi; tỉ lệ chết = 0,35 × (1 − e^(−(t − 15)/120)) với t ≥ 15 phút, con đực nhân 1,5.

#### Chỗ chưa xác minh
- NA thay đổi theo zoom (giả định tỉ lệ với zoom); đế trụ thẳng (SZ61 thường bán kèm đế cong SZ2-ST); kích thước Flowbuddy và súng thổi; thời gian tỉnh và tỉ lệ chết vì CO₂ là minh hoạ.

#### Tiến độ
- [x] Hình chi tiết kính lúp soi nổi (Fig 20, 65 khối, 3 ống) ✅ 2026-10-16
	- `figures/stereo/`; trong app bấm "Cận cảnh kính lúp soi nổi" ở bàn soi ruồi (khu nuôi sinh vật), hoặc mở `#stereo`. Hình mở với đúng các ruồi vừa đếm.
	- Thao tác: ↑↓ zoom, ←→ lấy nét, Space bật/tắt CO₂, M/F gạt ruồi vào đống đực/cái, X bỏ vào lọ dầu.
	- Kiểm tra: `audit passed`; `line ends: 0` ở hai giao diện và mọi tư thế nghỉ; cận cảnh 4×; 390 px không cuộn ngang.

## Khu máy móc trong cảnh 3D

### Trong app
- 14 máy là khối đúng kích thước model thật (`MACHINES_3D` trong `src/scene/layout.js`, lấy từ `figures/*/model.mjs` và manual), nhãn cận cảnh trên từng máy.
- Ống PCR đưa vào máy: bấm ống rồi bấm máy PCR hoặc bộ điện di, hoặc kéo thả ống lên máy khi cả hai cùng trong khung nhìn.
- [x] Mô hình đúng kích thước, đưa ống tới máy ✅ 2026-10-16

## An toàn chung của phòng

### Trong app
- Cảnh 3D: vòi tắm và rửa mắt khẩn cấp, bình chữa cháy CO₂, thùng rác sinh học, hộp vật sắc nhọn, bảng nội quy (`src/scene/safety.js`); khu camera "An toàn".
- Lõi `src/core/emergency.js` (số liệu `data/safety.json`, mục `emergency`):
	- Rửa mắt theo ANSI/ISEA Z358.1-2014: tới trạm trong 10 s (khoảng 17 m), rửa 15 phút, 1,5 L/phút, nước 16–38 °C.
	- Chất chữa cháy theo loại đám cháy (NFPA 10): nước chỉ cho loại A; chất lỏng dễ cháy, thiết bị điện dùng CO₂ hoặc bột ABC; kim loại kiềm dùng bột loại D hoặc cát khô.
	- Chất thải: vật sắc nhọn, sinh học (túi đỏ, hấp tiệt trùng), thuỷ tinh vỡ, kim loại nặng.
- Đồ bảo hộ trong `src/core/safety.js` (xem khu tủ hoá chất).
- Protocol "An toàn: rửa mắt, chữa cháy, bỏ chất thải đúng cách".
- [x] Lõi, protocol, bảng điều khiển ✅ 2026-10-16
- [x] Hình chi tiết trạm tắm và rửa mắt khẩn cấp ✅ 2026-10-16

### Trạm tắm và rửa mắt khẩn cấp — Guardian Equipment G1902

#### Thông số
- **Model**: Guardian Equipment G1902 Safety Station with Eyewash, Stainless Steel Bowl; dung sai bản vẽ ± 6 mm ([spec sheet rev. 052319](https://ww.gesafety.com/downloads/G1902.pdf), [trang sản phẩm](https://ww.gesafety.com/products/stations/G1902.shtml))
- **Kích thước**: cao tổng 2261 mm (89"); mép dưới đầu sen 2105 mm (82 7/8"); tâm đầu sen cách trục ống đứng 610 mm (24"); miệng chậu cao 953 mm (37 1/2") ([spec sheet](https://ww.gesafety.com/downloads/G1902.pdf))
- **Vòi sen**: đầu ABS Ø 254 mm (10"), bộ điều lưu 20 gpm = 75,7 L/phút; van bi 1" IPS đồng mạ crôm, stay-open, bi mạ crôm, gioăng PTFE; cần tác động inox và thanh kéo inox 737 mm (29") có tay kéo tam giác; đầu thanh thấp hơn ống ngang 597 mm (23 5/8") ([spec sheet](https://ww.gesafety.com/downloads/G1902.pdf))
- **Rửa mắt**:
	- Chậu inox Ø 283 mm (11 1/8"); hai đầu phun GS-Plus cách nhau 165 mm (6 1/2"), mỗi đầu có nắp chống bụi lật, bộ điều lưu và lưới lọc bên trong
	- Van bi 1/2" IPS stay-open; tay đẩy dạng cờ bằng nhôm đúc sơn tĩnh điện, cao 127 mm (5")
	- Nguồn: [spec sheet](https://ww.gesafety.com/downloads/G1902.pdf)
- **Vật liệu**: ống và phụ kiện thép mạ kẽm Schedule 40, vỏ bọc polyethylene màu cam; đế nhôm đúc Ø 229 mm (9"), khe Ø 7/16" trên vòng Ø 7 5/8" ([spec sheet](https://ww.gesafety.com/downloads/G1902.pdf))
- **Nối ống**: cấp 1 1/4" NPT cái ở đỉnh hoặc ở hông (hông cao 1645 mm = 64 3/4", có nút bịt); thoát 1 1/4" NPT ở 235 mm (9 1/4"), đổi hai đoạn ống dưới thì lên 498 mm (19 5/8"); tuỳ chọn van trộn ổn nhiệt G6040 ([spec sheet](https://ww.gesafety.com/downloads/G1902.pdf))
- **ANSI/ISEA Z358.1-2014**:
	- Rửa mắt ≥ 1,5 L/phút, vòi sen ≥ 75,7 L/phút, cả hai chạy 15 phút
	- Nước ấm 16–38 °C; tới được trong 10 s, khoảng 17 m
	- Đầu sen cao 2083–2438 mm; tia sen rộng ≥ 508 mm ở độ cao 1524 mm
	- Dòng rửa mắt ở 838–1346 mm; kích hoạt thử hằng tuần
	- Nguồn: `data/safety.json`; [bản vẽ lắp đặt Haws 8300](https://res.cloudinary.com/dzhpkjoqj/Haws/8300-8300CRP.pdf) chép lại các yêu cầu vị trí

#### Bộ phận để vẽ
- **Đế và sàn**: tấm đế nhôm đúc, 3 đai ốc bu lông neo, thân loe; phễu thu sàn có nắp khe; tấm sàn có thước và nhãn
- **Ống đứng**:
	- Tê thoát, tê nhận nước thải chậu, ống nối ngắn có nút ngăn, tê cấp rửa mắt, tê cấp hông, tê đỉnh có nút bịt
	- Vỏ PE cam chia đoạn ở hai đai biển báo
	- Ba ô cắt cho thấy đường nước: lên vòi sen, xuống chậu, nước thải đi xuống
- **Cấp nước**: nhánh hông, co, ống đứng cấp, tê gắn nhiệt kế mặt số 0–60 °C (vùng 16–38 °C tô xanh), dây rút với phiếu kiểm tra tuần, khớp nối, ống lên trần (vẽ cắt)
- **Vòi sen**: đệm nhánh 1", van bi 1" có ô cắt thấy bi và lỗ khoan quay, cần tác động inox quay 90°, co, cổ, đầu sen ABS dạng chuông
- **Thanh kéo**: móc, thanh inox, tay kéo tam giác (3 khớp cầu), ống bọc tay cầm
- **Rửa mắt**:
	- Đệm nhánh 1/2", van bi 1/2", trục nối dài, bầu tay, tay đẩy dạng cờ
	- Thân chữ thập dưới chậu, ống đuôi và co xả về ống đứng
	- Chậu inox; trong chậu có cột cấp, chạc, hai đầu GS-Plus và hai nắp chống bụi lật
- **Biển báo**: tấm xanh lá, hình người dưới vòi sen và hình mắt (không có chữ), 2 đai ôm ống, 4 vít

#### Số liệu dùng cho mô hình
- **Lưu lượng**: vòi sen 75,7 L/phút ([spec sheet](https://ww.gesafety.com/downloads/G1902.pdf)); rửa mắt 1,5 L/phút, lấy mức tối thiểu của Z358.1
- **Nước dùng hết 15 phút**: rửa mắt 22,5 L; vòi sen 1136 L; cả hai 1158 L
- **Ngưỡng nhiệt độ**: dưới 16 °C là lạnh (người bị nạn bỏ dở trước 15 phút); trên 38 °C là nóng (bỏng, hoá chất thấm nhanh hơn)
- **Quãng tới trạm**: 10 s ≈ 17 m, tức khoảng 1,7 m/s
- **Kiểm tra độ cao**:
	- Đầu sen 2105 mm, đạt
	- Tia sen ở 1524 mm rộng 544 mm, đạt (độ loe là số minh hoạ)
	- Đỉnh dòng rửa mắt 1060 mm, đạt (minh hoạ)
	- Tay kéo cao 1631 mm, dưới 1733 mm, đạt
- **Thể tích nước tù**: 6,57 L, tính từ đường kính trong ống Sch 40 theo ASME B36.10 cộng 5 m ống cấp (5 m là giả định); độ đục = exp(−V/6,57), dưới 0,05 thì coi là "trong", tức xả khoảng 20 L

#### Chỗ chưa xác minh
- Lưu lượng thật của cặp đầu GS-Plus không có trên spec sheet: *chưa xác minh*, đang dùng mức tối thiểu 1,5 L/phút
- Cần gạt van tắm ≤ 1733 mm (69"): lấy theo bản tóm tắt Z358.1, *chưa đối chiếu bản gốc*
- Bên trong trạm vẽ theo cấu tạo điển hình, hãng không công bố sơ đồ:
	- Nút ngăn giữa hai tê dưới chậu
	- Ống cấp rửa mắt đi đồng tâm qua ống xả chậu
	- Chạc trong chậu
	- Ruột van bi; van stay-open không có lò xo nên hình không vẽ lò xo
- Vị trí van bi 1" (cách trục ống đứng khoảng 278 mm) và chiều dài cần tác động (190 mm, quay ±45°) ước theo bản vẽ, *chưa xác minh*
- Kích thước biển báo (230 × 305 mm) và phiếu kiểm tra tuần: minh hoạ
- Độ loe tia sen, độ đục khi xả kiểm tra, đỉnh tia rửa mắt 1060 mm: minh hoạ

#### Tiến độ
- [x] Hình chi tiết `figures/eyewash/` (Fig 23, mức Figure) ✅ 2026-10-16
	- Kiểm tra: audit passed; line ends 0 ở cả hai giao diện và bốn tư thế van (đóng, rửa mắt, sen, cả hai)
	- 390 px không cuộn ngang; giảm chuyển động cho một khung đứng yên; nhận `#run=`
- [x] Gắn vào app: nhãn cận cảnh ở vòi tắm, nút trong bảng sự cố ✅ 2026-10-16

## Khu trồng trọt

### Trong app
- Ngưỡng của 4 loài trong `data/crops.json` (trường `_src` ghi nguồn, `_unverified` ghi chỗ chưa xác minh), lấy từ phần tra cứu dưới đây.
- Lõi `src/core/field.js`: cây lớn theo độ ngày sinh trưởng của từng giai đoạn (GDD tới mọc, tới ra hoa, tới hạt chín, chia cho số ngày của lịch `data/pea.json`); đậu Hà Lan ở 18 °C ra hoa sau khoảng 40 ngày, chín khoảng 88 ngày (NDSU: ra hoa 40–50 ngày, hạt khô 80–100 ngày).
	- Nước trong đất: sức giữ 40 mm, mưa 8 mm/ngày, tưới 15 mm, khô hạn dưới 25 %, tưới nhỏ giọt tự động khi dưới 50 % (*minh hoạ*). Lượng nước cây dùng theo nhu cầu mỗi tuần của loài, tăng khi nóng và nắng (*minh hoạ*).
	- Bệnh lá (phấn trắng, gỉ sắt) và mốc xám theo độ ẩm, nhiệt độ của loài; hệ số giảm quả: bệnh lá 0,7, mốc xám 0,6, khô hạn lúc ra hoa 0,6 (*minh hoạ*).
- `pea-garden.js`: bao hoa; loài thụ phấn nhờ ong (hoa mõm chó, bí) không bao thì hạt mang phấn lạ của nhóm cây khác theo tỉ lệ giao phấn của loài. Thụ phấn tay khi chưa khử nhị dùng tỉ lệ giao phấn tự nhiên thay cho giả định 10 % cũ.
- Bảng khí hậu đổi theo loài của protocol, có chọn tưới nhỏ giọt hoặc tự tưới; cảnh 3D: lá bệnh trắng xám, hoa đã bao màu giấy.
- Protocol "Nhà kính: chăm đậu Hà Lan từ gieo tới thu hạt"; thêm bước bao hoa vào lai hoa mõm chó và bí. (→ [Quy luật Mendel](/blog/sinh-hoc/kien-thuc-chung/c-quy-luat-di-truyen/09-quy-luat-mendel/): khử nhị và bao hoa giữ cho phép lai sạch)
- [x] Ngưỡng khí hậu có nguồn, tưới nước, bệnh, bao hoa, cây đúng loài ✅ 2026-10-16
- [x] Hình chi tiết buồng sinh trưởng ✅ 2026-10-16

### Buồng sinh trưởng — Conviron GEN1000 (1 tầng)

#### Thông số
- **Kích thước ngoài**: 1040 × 825 × 1960 mm (R × S × C; 41″ × 32,5″ × 77″), rộng tối đa 1092 mm, chiếm sàn 9,25 ft² ([data sheet 2025](https://conviron.b-cdn.net/uploads/GEN1000-Data-Sheet-2025-MK0090-rev-15.pdf); [trang sản phẩm](https://www.conviron.com/products/gen1000/))
- **Lòng buồng**: rộng 955 mm, cao 1330 mm ([data sheet](https://conviron.b-cdn.net/uploads/GEN1000-Data-Sheet-2025-MK0090-rev-15.pdf), bản vẽ 288765 Rev 1)
- **Cấu hình 1 tầng**: cao trồng 1180 mm (46,5″), diện tích 0,525 m², tới 2050 µmol/m²/s ([data sheet](https://conviron.b-cdn.net/uploads/GEN1000-Data-Sheet-2025-MK0090-rev-15.pdf))
	- Kit cây cao 1 tầng: 1085 mm, 0,58 m², luồng gió hướng lên.
- **Nhiệt độ**: 4–45 °C khi tắt đèn, 7–50 °C khi bật đèn ([data sheet](https://conviron.b-cdn.net/uploads/GEN1000-Data-Sheet-2025-MK0090-rev-15.pdf))
	- Tuỳ chọn nhiệt độ thấp: +1 °C khi bật đèn, −5 °C khi tắt đèn.
- **Độ ẩm**: tạo ẩm siêu âm tới 90 % RH khi tắt đèn, cần nước RO; hút ẩm là tuỳ chọn ([data sheet](https://conviron.b-cdn.net/uploads/GEN1000-Data-Sheet-2025-MK0090-rev-15.pdf))
- **Đèn**: LED phổ rộng, đèn đỏ xa điều khiển riêng, đèn đạt IP65 ([data sheet](https://conviron.b-cdn.net/uploads/GEN1000-Data-Sheet-2025-MK0090-rev-15.pdf))
- **Bộ điều khiển**: CMP7000, màn hình cảm ứng màu 7″, chỉnh quang kỳ và phổ ([data sheet](https://conviron.b-cdn.net/uploads/GEN1000-Data-Sheet-2025-MK0090-rev-15.pdf))
- **Mặt trước** (theo bản vẽ của hãng): công tắc nguồn, khoá cửa, cổng USB, cửa sổ quan sát (tuỳ chọn), khay hứng nước dưới đáy
	- Hông trái có lỗ thải khí phía trên và lỗ cấp khí tươi phía dưới.
	- Cửa bản lề bên phải, cần 1020 mm để mở; đặt trên bánh xe.
	- Máy lạnh giải nhiệt gió, liền khối.

#### Bộ phận để vẽ
- **Vỏ**: thân trên 4 bánh xe xoay (2 bánh có phanh), khay hứng nước, hông trái cắt lớp (thép sơn, bọt PU, vỏ trong trắng), lỗ thải khí và lỗ cấp khí.
- **Khoang máy trên nóc** (cao khoảng 440 mm, đo trên bản vẽ): lưới thoát gió 5 ô, tấm che bảo dưỡng có vít.
	- Màn hình 7″ hiện nhiệt độ, RH, đèn, giờ, thanh chương trình ngày/đêm 24 giờ.
	- Công tắc nguồn, ổ khoá cửa, cổng USB.
- **Cửa**: cửa sổ kính hai lớp 340 × 947 mm, nẹp cửa sổ, gioăng từ, tay nắm đứng, 2 bản lề (lá, khớp, giá cố định).
- **Lòng buồng**:
	- Hộp đèn LED, tấm chắn kính, dải khuếch tán sáng.
	- Khay nhựa đen; 6 chậu đậu Hà Lan, mỗi chậu có cọc tre.
	- Cảm biến nhiệt – ẩm có quạt hút trên vách phải.
	- Tấm đục lỗ có 3 quạt; tấm được cắt một ô để thấy khoang khí.
- **Khoang khí sau vách** (cấu tạo điển hình): bộ tạo ẩm siêu âm ở đáy, máng nước ngưng, dàn lạnh có tấm đầu ống đồng, 2 ống đồng lên trần, dàn sưởi có cánh tản nhiệt, hộp đấu dây.

#### Số liệu dùng cho mô hình
- **DLI** = PPFD × giờ sáng × 0,0036. Ví dụ 400 µmol/m²/s × 16 h = 23,04 mol/m²/ngày.
- **Độ-ngày** nền 4,4 °C, Tmax chặn ở 26,7 °C ([OSU Peas](https://horticulture.oregonstate.edu/oregon-vegetables/peas-western-oregon-0)): GDD = max(0, (Tmax + Tmin)/2 − 4,4).
	- Chương trình 18/14 °C cho 11,6 °C·ngày mỗi ngày.
	- Lịch sinh trưởng: mọc 100, ra hoa 550, có quả 680, chín khô 1200 °C·ngày (khớp `data/crops.json`).
- **Khoảng nhiệt độ của đậu Hà Lan**: tối ưu 10–24 °C, giới hạn 4–30 °C (FAO EcoCrop). Cảnh báo Botrytis khi RH ≥ 85 % (OSU HYG-3070).
- **Chiều cao cuối**: thân cao 195 cm, thân thấp 34 cm, lấy giữa khoảng Mendel ghi (6–7 ft và 3/4–1 1/2 ft, [mendelweb](http://www.mendelweb.org/Mendel.html)).
	- Chỗ trống cho cây dưới tấm chắn = 1180 − 160 mm (chậu) = 102 cm.
- **Áp suất hơi bão hoà** theo công thức Magnus (Alduchov & Eskridge 1996). Khi mở cửa, không khí phòng trộn theo áp suất hơi rồi tính lại RH.
- **Mở cửa 60 s lúc đèn sáng** (chương trình 18/14 °C, 70 %): không khí lên 20,3 °C, RH tụt còn 54 %.
	- Hồi phục về trong 0,5 °C sau khoảng 2,3 phút, về trong 3 % RH sau khoảng 3,8 phút (dùng các hằng số minh hoạ bên dưới).

#### Chỗ chưa xác minh
- GEN1000 không ghi RH tối đa khi bật đèn. Hình mượn 85 % của PGR15 cùng hãng ([Harvard Arboretum](https://arboretum.harvard.edu/research/research-facilities/growth-facilities)).
- Bên trong khoang khí, vị trí 3 quạt, độ sâu khoang khí 140 mm và bố trí máy lạnh: không có sơ đồ của hãng, vẽ theo cấu tạo điển hình.
- Khoang máy cao 440 mm, cửa sổ 340 × 947 mm, vị trí tay nắm khi có cửa sổ: đo hoặc suy ra từ bản vẽ, chưa xác minh.
- Các hằng số minh hoạ:
	- Phòng 22 °C, 45 % RH.
	- Trao đổi khí khi cửa mở 45 s; điều khiển nhiệt độ 90 s, độ ẩm 180 s.
	- Đèn bật lúc 06:00.
	- Đường cong chiều cao: logistic, điểm giữa 550 °C·ngày, độ dốc 110; mỗi cây lệch vài phần trăm.
	- Chậu cao 160 mm.
	- Mốc có quả 680 °C·ngày là ước tính.
- Hình chưa mô phỏng ảnh hưởng của ánh sáng và quang kỳ tới tốc độ lớn của cây.

#### Tiến độ
- [x] Hình chi tiết `figures/growthchamber/` (Fig 21): build, audit, đầu nét, cận cảnh, 390 px ✅ 2026-10-16
- [x] Gắn vào app: khối buồng ở lối vào nhà kính, nút cận cảnh nhận khí hậu đang đặt và tuổi cây ✅ 2026-10-16

### Tra cứu (2026-10-16)
- Quy ước: **[đã đọc]** là đã mở nguồn; **[gián tiếp]** là chỉ thấy qua trích đoạn tìm kiếm; *chưa xác minh* là không có nguồn hoặc tự suy ra.

### 1. Sinh lý từng loài

#### 1.1. Đậu Hà Lan (*Pisum sativum*)

**Nhiệt độ**
- **FAO EcoCrop** [đã đọc, bảng `EcoCrop_DB.csv`]: nhiệt độ tối ưu 10–24 °C; giới hạn tuyệt đối 4–30 °C; nhiệt độ gây chết −2 °C (lúc nghỉ) và 0 °C (cây non); chu kỳ 60–140 ngày ([FAO EcoCrop](https://ecocrop.apps.fao.org/ecocrop/srv/en/home), bản chép CSV: [OpenCLIM/ecocrop](https://raw.githubusercontent.com/OpenCLIM/ecocrop/main/EcoCrop_DB.csv)).
- **NDSU A1166, bản sửa 2016** [đã đọc]: cần mùa mát, nhiệt độ trung bình 55–65 °F (≈ 13–18 °C) thì năng suất tốt ([NDSU Field Pea Production A1166](https://wpcdn.web.wsu.edu/extension/uploads/sites/54/2013/12/FieldPeaProduction_NDExtension_a1166.pdf)).
	- Hạt nảy mầm khi đất đạt 40 °F (4,4 °C), mọc sau 10–14 ngày.
	- Cây con chịu được sương giá "in the low 20s" °F (khoảng −6 đến −4 °C). Nếu bị giá làm chết ngọn, cây mọc chồi mới từ dưới đất cho tới khi có khoảng 7 đốt trên mặt đất.
	- Con số này mâu thuẫn với nhiệt độ gây chết 0 °C của EcoCrop. Nên dùng NDSU cho cây non ngoài đồng.
- **Nhiệt độ cơ bản cho nảy mầm** ([Adams & Cosner 2025, *Sci. Rep.* 15:21759](https://pmc.ncbi.nlm.nih.gov/articles/PMC12218029/) [đã đọc]):
	- Tb ≈ −0,98 °C, To = 27,5 °C, Tm = 37,5 °C.
	- Thời gian nhiệt để 50 % hạt nảy mầm: 46,6 °C·ngày (đậu ăn hạt vụ đông) và 55,9 °C·ngày (vụ xuân).
	- Bảng tổng hợp các nghiên cứu trước cho Tb từ −1,1 đến 2,4 °C.
	- Thân và rễ mầm dài nhất ở 22–26 °C.
- **Raveneau et al. 2011** ([*Seed Sci. Res.*](https://cambridge.org/core/journals/seed-science-research/article/pea-and-bean-germination-and-seedling-responses-to-temperature-and-water-potential/4E1F3E6447BFA5291DA45BBAD40AF93E) [gián tiếp]): Tb nảy mầm −1,1 °C; Tb cho thân mầm vươn dài 3–6 °C.

**Nhiệt độ cơ bản tính GDD và độ-ngày**
- **Nhiệt độ cơ bản 4,4 °C (40 °F)** là chuẩn của ngành đậu chế biến.
	- Cách tính: lấy trung bình nhiệt độ cao nhất và thấp nhất trong ngày rồi trừ 40 °F. Nhiệt độ cao nhất bị chặn ở 80 °F, vì trên 80 °F đậu không chín nhanh hơn (bằng sáng chế USPTO 7906708 [gián tiếp]).
	- Oregon State dùng nền 40 °F ([OSU Peas – Western Oregon](https://horticulture.oregonstate.edu/oregon-vegetables/peas-western-oregon-0) [đã đọc]).
	- [Bourgeois et al. 2000, *HortScience* 35:611](https://journals.ashs.org/downloadpdf/view/journals/hortsci/35/4/article-p611.pdf) [gián tiếp] ghi 4,4 °C là nhiệt độ cơ bản "thường được báo cáo là phù hợp nhất" cho đậu xanh. Đậu vụ đông chịu lạnh dùng 0 °C.
- **Từ gieo tới thu đậu tươi** (độ chín tenderometer 100), theo [OSU](https://horticulture.oregonstate.edu/oregon-vegetables/peas-western-oregon-0) [đã đọc]:
	- Giống sớm cần 1200–1300 °F·ngày, giống trung bình 1400–1500, giống muộn 1600–1700.
	- Đổi sang nền 4,4 °C: **≈ 667–944 °C·ngày**.
	- Gieo tháng 4 thì khoảng 70 ngày tới thu hoạch, tháng 5 khoảng 60 ngày, tháng 6 khoảng 55 ngày.
- **Kruger 1973**, Queensland, giống Providor ([QJAAS 30:25–38](https://era.daf.qld.gov.au/id/eprint/12304/1/QJAAS_30%5B1%5D_1973_pp25-38_kruger.pdf) [đã đọc]):
	- Từ gieo tới mọc 5–14 ngày; từ mọc tới ra hoa 18–34 ngày; từ ra hoa tới chín (đậu tươi) 34–58 ngày; tổng 62–92 ngày.
	- Nhiệt độ trung bình 58–65 °F.
	- Nền 45 °F cho hệ số biến thiên nhỏ nhất, trung bình 1174 °F·ngày tới độ chín. Thời gian mỗi pha tương quan chặt với nhiệt độ (r ≈ −0,91 đến −0,98), không tương quan đáng kể với quang kỳ.
- **NDSU** [đã đọc]:
	- Ra hoa 40–50 ngày sau gieo; hoa nở kéo dài 2–4 tuần.
	- Hạt khô chín sau 80–90 ngày (giống ra hoa hữu hạn) hoặc 90–100 ngày (giống vô hạn).
	- Hoa trắng tới tím đỏ, phần lớn tự thụ phấn. Mỗi hoa cho một quả có 4–9 hạt.
- **Số GDD đề xuất cho mô hình** (nền 4,4 °C; **ước tính, chưa xác minh** như một hằng số đo trực tiếp):
	- **Mọc ≈ 100 °C·ngày**. Tính từ Kruger: 5–14 ngày ở trung bình 14–18 °C, tức (14,4…18,3 − 4,4) × ngày ≈ 70–150.
	- **Ra hoa ≈ 550 °C·ngày**, khoảng dao động 350–700.
		- Kruger (giống sớm): gieo tới hoa 23–43 ngày ≈ 300–420 °C·ngày.
		- NDSU: 40–50 ngày ở trung bình khoảng 15–17 °C (nhiệt độ giả định) ≈ 450–630.
		- Giống cao, muộn kiểu Mendel nằm ở đầu trên của khoảng này.
	- **Hạt khô ≈ 1200 °C·ngày**. Lấy độ chín đậu tươi 667–944 °C·ngày (OSU) cộng thêm thời gian hạt khô trên cây, khoảng 2–3 tuần (**chưa xác minh**). Con số này khớp với `ripe: 92` ngày ở khoảng 17 °C hiện nay: (17 − 4,4) × 92 ≈ 1160.

**Quang chu kỳ**
- Đậu Hà Lan là cây **ngày dài định lượng** (ra hoa sớm hơn khi ngày dài, nhưng ngày ngắn vẫn ra hoa). Đậu hoang thường là cây ngày dài bắt buộc ([Weller et al., PMC3529011](https://pmc.ncbi.nlm.nih.gov/articles/PMC3529011) [gián tiếp]).
- Gen **Hr** (PsELF3a) và **Sn** (ortholog của LUX ARRHYTHMO): dòng `sn` ra hoa sớm và không nhạy với quang kỳ ([PMC4044833](https://pmc.ncbi.nlm.nih.gov/articles/PMC4044833) [gián tiếp]).
- EcoCrop ghi "short day, neutral day" [đã đọc]. Mục này mâu thuẫn với các nghiên cứu di truyền ở trên, nên dùng kết quả di truyền.

**Độ ẩm không khí**
- Không tìm được khoảng RH tối ưu riêng cho đậu Hà Lan có nguồn: **chưa xác minh**.
- Nên dùng ngưỡng bệnh ở mục 2: RH ≥ 85 % thì Botrytis phát triển; sương đêm thì phấn trắng phát triển.

**Nước**
- **Alberta Agdex 142/561-2** ([Irrigation Scheduling for Pea](https://www1.agriculture.alberta.ca/$Department/deptdocs.nsf/all/agdex13625) [đã đọc]):
	- Cây cần 300–370 mm mỗi vụ.
	- Lượng nước dùng tăng từ 0,1 mm/ngày lúc mới mọc lên gần 6 mm/ngày (≈ 40 mm/tuần) lúc ra hoa và đầu tạo quả.
	- Nhạy nhất với thiếu nước ở pha ra hoa và tạo năng suất. Giữ ẩm đất trên 60 % lượng nước hữu dụng (cạn kiệt cho phép 40 %).
	- Trung bình cả vụ: 300–370 mm / khoảng 13 tuần ≈ **25–30 mm/tuần**.
- **OSU** [đã đọc]: tưới khi hoa bắt đầu nở. Tưới sau khi cánh hoa rụng có thể làm tăng bệnh. Đất ướt hay bị thối rễ.
- **Ngập úng**:
	- Đậu Hà Lan rất nhạy. Ngập 14 ngày làm năng suất hạt còn khoảng 6 % so với đối chứng; cây không tạo được aerenchyma ở rễ ([Ploschuk et al. 2018, *Front. Plant Sci.*](https://www.frontiersin.org/articles/10.3389/fpls.2018.01863/pdf) [gián tiếp]).
	- Với cây trồng nói chung, ngập 36–48 giờ thường là giới hạn chịu đựng ([Manitoba Agriculture](https://www.gov.mb.ca/agriculture/crops/crop-management/pubs/assessing-impacts-excess-moisture-on-crops.pdf) [gián tiếp]).
	- NDSU [đã đọc]: thối rễ (Aphanomyces) nặng nhất khi đất bão hoà nước lâu.

**Sốc nhiệt lúc ra hoa** (dùng cho `heatAbortC`)
- Nhóm Bueckert (Đại học Saskatchewan):
	- Ngày có nhiệt độ cao nhất > 29 °C làm rụng hoa và quả non.
	- Đậu dễ rụng hoa và quả non khi không khí trên 30 °C.
	- Trong ống nghiệm, ống phấn mọc bất thường ở > 30 °C ([ASA–CSSA 2013, Paper 80691](https://scisoc.confex.com/crops/2013am/webprogram/Paper80691.html) [đã đọc]).
	- Đậu bị sốc nhiệt khi nhiệt độ vượt 28 °C ([CSSA 2016, Paper 99226](https://scisoc.confex.com/crops/2016am/webprogram/Paper99226.html) [đã đọc]).
- Ngoài đồng, 3–5 ngày có nhiệt độ buổi trưa khoảng 29–30 °C đã đủ gây sốc nhiệt (dự án của Saskatchewan Pulse [gián tiếp]).
- Trong buồng sinh trưởng ở 35/18 °C, sức sống hạt phấn, tỉ lệ noãn nhận được ống phấn và số hạt mỗi quả đều giảm (luận án [Jiang 2016](https://harvest.usask.ca/bitstream/handle/10388/7725/JIANG-DISSERTATION-2016.pdf;sequence=1) [gián tiếp]).
- Hoa non (ra sau, ở ngọn) bị hại nặng nhất [gián tiếp, cùng nguồn].
- Theo tóm tắt Bueckert et al. 2015 (*Can. J. Plant Sci.* 95:629): trên 20 ngày > 28 °C thì năng suất đậu không tưới giảm; nhiệt độ cao nhất trung bình > 25,5 °C làm pha sinh sản ngắn còn dưới 35 ngày ([Top Crop Manager](https://www.topcropmanager.com/the-goldilocks-of-pea-production-18561/) [gián tiếp]).
- Hạt đang phát triển nhạy nhiệt nhất trong khoảng 6–12 ngày sau khi hoa nở (bản ghi FAO AGRIS về giống pea [gián tiếp]).

#### 1.2. Đậu thơm (*Lathyrus odoratus*)

Không có trong EcoCrop. Tài liệu nông học định lượng rất ít, nên đa số số liệu dưới đây là **chưa xác minh** hoặc lấy từ hãng giống.

**Nhiệt độ**
- Hạt nảy mầm sau 14–21 ngày nếu giữ 55–65 °F (13–18 °C). Nảy mầm cần tối ([Johnny's – Sweet Pea Production](https://www.johnnyseeds.com/on/demandware.static/-/Library-Sites-JSSSharedLibrary/default/dwfb8c600c/assets/information/sweet-pea-production.pdf) [đã đọc]).
	- Vỏ hạt cứng làm hạt nảy mầm không đều; nên ngâm 24 giờ.
	- Cây con chịu được sương giá nhẹ, nhưng giá nặng làm chết.
- Cây ưa mát; hoa nhỏ đi và năng suất giảm khi nhiệt độ tăng ([Cornell High Tunnels – Sweet pea](https://blogs.cornell.edu/hightunnels/flowers/cut-flowers/cut-flower-crops/sweet-pea) [đã đọc]).
	- Hạt nảy mầm sau 10–21 ngày ở 60 °F.
	- Cây con phải che khi nhiệt độ xuống dưới 25 °F (−4 °C).
	- Gieo giữa tới cuối tháng 3 rồi trồng vào nhà màng thì ra hoa giữa tới cuối tháng 6 (vùng 5), tức khoảng 85–100 ngày sau gieo.
- Cành hoa đẹp nhất khi đêm 12–14 °C; đêm ấm hơn làm cành mảnh. Ở 32/24 °C (ngày/đêm) chỉ ra rất ít hoa ([*HortScience* 37(5):759](https://journals.ashs.org/downloadpdf/view/journals/hortsci/37/5/article-p759.pdf) [gián tiếp], chưa rõ tác giả, chưa đọc được toàn văn).
- Trang làm vườn ghi không khí và đất phải dưới 80 °F (27 °C), nếu không thì nụ rụng ([Gardener's Path](https://gardenerspath.com/plants/flowers/sweet-pea-bud-drop/) [gián tiếp], nguồn yếu, **chưa xác minh**).
- Nhiệt độ cơ bản GDD: **chưa xác minh**.
	- Ross & Murfet 1985 cho thấy hệ thống điều khiển ra hoa của đậu thơm và đậu Hà Lan rất giống nhau ([*Ann. Bot.* 56:847](https://academic.oup.com/aob/article-abstract/56/6/847/195341) [đã đọc phần tóm tắt]).
	- Vì vậy đề xuất tạm dùng 4,4 °C như đậu Hà Lan.

**Quang chu kỳ**
- Có giống ngày dài và giống trung tính. Giống ngày dài ra hoa muộn hơn vì sinh ra một "chất ức chế ra hoa" truyền được qua ghép ([Ross & Murfet 1985](https://academic.oup.com/aob/article-abstract/56/6/847/195341) [đã đọc phần tóm tắt]).
- Dòng Elegance (Johnny's) được tạo để ra hoa trong ngày ngắn, ánh sáng yếu và nhà kính mát. Johnny's khuyên trồng vụ thu bằng giống ra hoa trong ngày ngắn ([Johnny's Elegance](https://www.johnnyseeds.com/flowers/sweet-peas/elegance-pink-diana-sweet-pea-seed-1924.html) [gián tiếp]; [Johnny's PDF](https://www.johnnyseeds.com/on/demandware.static/-/Library-Sites-JSSSharedLibrary/default/dwfb8c600c/assets/information/sweet-pea-production.pdf) [đã đọc]).

**Nước và độ ẩm**
- Không được để cây khô ở bất kỳ giai đoạn nào; nên tưới nhỏ giọt. Ở nơi mùa hè nóng ẩm, cây được lợi khi có chút bóng chiều. Nếu tưới phun thì tưới sớm để lá khô trước khi tối ([Johnny's PDF](https://www.johnnyseeds.com/on/demandware.static/-/Library-Sites-JSSSharedLibrary/default/dwfb8c600c/assets/information/sweet-pea-production.pdf) [đã đọc]).
- Lượng mm/tuần: **chưa xác minh**. Đề xuất dùng như đậu Hà Lan, 25 mm/tuần.
- Bệnh chính là phấn trắng (xem mục 2).

**Lịch sinh trưởng** (nền 4,4 °C, **chưa xác minh**)
- **Mọc**: 14–21 ngày ở 13–18 °C ≈ (15,5 − 4,4) × 17 ≈ 190 °C·ngày. Lâu hơn đậu Hà Lan vì vỏ hạt cứng.
- **Ra hoa**: khoảng 90 ngày sau gieo ở nhà màng mát khoảng 15 °C ≈ 950 °C·ngày (tính từ mốc thời gian của Cornell).
- **Hạt chín**: không tìm được nguồn. Đề xuất cộng thêm khoảng 500 °C·ngày (khoảng 5–6 tuần ở 15 °C) sau khi ra hoa.

#### 1.3. Hoa mõm chó (*Antirrhinum majus*)

EcoCrop có mục này nhưng các trường nhiệt độ đều để trống (NA) [đã đọc CSV].

**Nhiệt độ và thời gian nhiệt**
- **Munir et al. 2015**, giống Chimes White, quang kỳ tự nhiên tháng 6 ([*Pak. J. Bot.* 47:1717](https://mail.pakbs.org/pjbot/PDFs/47(5)/15.pdf) [đã đọc]):
	- Cây ra hoa sau 68, 43, 37, 35 và 34 ngày kể từ khi chuyển cây, ở trung bình 14,6; 19,5; 23,1; 25,3 và 31,8 °C (năm 2002).
	- Tốc độ tiến tới ra hoa tăng tuyến tính tới khi đạt bình nguyên ở điểm đặt **28 °C (nhiệt độ trần)**.
	- Mô hình khớp là 1/f = 0,00111·T và hằng số không khác 0 có ý nghĩa. Suy ra **Tb ≈ 0 °C** và **≈ 900 °C·ngày từ lúc chuyển cây tới ra hoa** (= 1/0,00111).
	- Bài báo cũng dẫn Miller (1962): đêm 15–18 °C trong 3–4 tuần đầu cho cây sinh trưởng tốt nhất, nhưng hạ xuống 10 °C ở giai đoạn cuối thì chất lượng hoa tốt hơn. Nhiệt độ cao làm ra hoa sớm nhưng cành yếu.
	- Cremer et al. (1998, được dẫn trong bài) thấy cây ra hoa ở 12 °C sớm hơn ở 15 °C, nghi là do hiệu ứng xuân hoá.
- **Munir et al. 2017** ([*Pak. J. Bot.* 49:181](https://mail.pakbs.org/pjbot/PDFs/49(1)/26.pdf) [đã đọc]):
	- Hoa mõm chó là **cây ngày dài không bắt buộc** (facultative LDP).
	- Cây ra hoa sớm nhất ở quang kỳ 17 giờ (thí nghiệm thử 8, 11, 14, 17 giờ/ngày), nhiệt độ cao và tích luỹ ánh sáng cao.
	- Với cây ngày dài, Tb được giả định bằng 0.
- **MS State Extension P3301, 2025** ([Snapdragon for the Farmer Florist](https://extension.msstate.edu/sites/default/files/publications/P3301_web.pdf) [đã đọc]):
	- Giống chia 4 nhóm. Nhóm I ra hoa mùa đông, chịu ngày ngắn và ánh sáng yếu. Nhóm II ra hoa cuối đông, đầu xuân. Nhóm III ra hoa mùa xuân. Nhóm IV cần ánh sáng mạnh, ngày dài và đêm trên 60 °F (16 °C).
	- Hạt nảy mầm sau 7–14 ngày ở 70–75 °F (21–24 °C) và cần ánh sáng. Chuyển cây khi có lá thật, khoảng 3–4 tuần sau gieo.
	- Độ ẩm cao, tưới phun và xác cây làm bệnh tăng: thán thư, mốc xám Botrytis, gỉ sắt, phấn trắng, sương mai, thối rễ.
- Nhiệt độ đêm theo giống, theo Syngenta: Overture (nhóm II) đêm 50–55 °F (10–14 °C); Opus (nhóm III/IV) đêm 55–60 °F (13–16 °C) ([Overture/Opus Guide](https://ballseed.com/CutFlowers/documents/Overture-Opus-Snapdragon-Guide-Syngenta-Flowers.pdf) [gián tiếp]).
- Từ gieo tới ra hoa 110–120 ngày theo trang bán giống F1 của Johnny's ([Johnny's](https://www.johnnyseeds.com/flowers/snapdragon/madame-butterfly-red-f1-snapdragon-seed-4387.html) [gián tiếp], chưa rõ giống nào).
- **Lịch đề xuất** (nền 0 °C):
	- **Mọc** khoảng 10 ngày ở 22 °C ≈ 220 °C·ngày.
	- **Ra hoa**: chuyển cây khoảng 25 ngày ở 22 °C ≈ 550, cộng 900 (Munir) ≈ **1450 °C·ngày từ gieo**. Ở nhà kính mát trung bình 13 °C, con số này tương ứng khoảng 110 ngày, khớp với 110–120 ngày của Johnny's.
	- **Quả nang chín** sau thụ phấn: **chưa xác minh**. Đề xuất cộng thêm khoảng 600 °C·ngày (khoảng 4 tuần ở 21 °C).
- **Nhiệt độ cao**:
	- Trên 28 °C cây không ra hoa nhanh hơn (Munir 2015). Cây vẫn ra hoa ở 31,5–31,8 °C, nên đó chưa phải ngưỡng chết.
	- Chưa có số liệu về rụng hoa hay mất phấn vì nóng: **chưa xác minh**.

**Nước**
- Lượng mm/tuần: **chưa xác minh**.
- MS State khuyên tránh tưới phun để giảm bệnh [đã đọc]. Gỉ sắt cần lá ướt 6–8 giờ (mục 2).

#### 1.4. Bí ngô mùa hè (*Cucurbita pepo*)

**Nhiệt độ**
- **FAO EcoCrop** [đã đọc CSV]: tối ưu 17–30 °C; giới hạn tuyệt đối 6–40 °C; chu kỳ 40–100 ngày; quang kỳ ghi cả ngày ngắn, trung tính và ngày dài ([EcoCrop CSV](https://raw.githubusercontent.com/OpenCLIM/ecocrop/main/EcoCrop_DB.csv)).
- **Oregon State** ([Squash, Zucchini and Summer](https://horticulture.oregonstate.edu/oregon-vegetables/squash-zucchini-and-summer) [đã đọc]):
	- Đất tối thiểu 60 °F (15,5 °C) thì bí mới nảy mầm; tối ưu 70–95 °F (21–35 °C).
	- Bí mùa hè bị hại lạnh khi bảo quản.
	- Cần tưới 12–15 inch (300–380 mm) cả vụ ở tây Oregon. Ở Hermiston, tháng 7 cần tưới 7,5 inch (≈ 190 mm/tháng ≈ 45 mm/tuần).
- **Arkansas FSA6019** ([Home Gardening Series: Squash](https://www.uaex.uada.edu/publications/pdf/FSA-6019.pdf) [đã đọc]): cây kém cho tới khi đất và không khí trên 62 °F (17 °C); 50–65 ngày tới thu hoạch; quả thu được 2–4 ngày sau khi hoa nở.
- **UC ANR**: khoảng tốt nhất 65–75 °F (18–24 °C); dưới 60 °F hạt có thể mất tới 2 tuần mới nảy mầm ([UC ANR Small Farms](https://ucanr.edu/node/131140) [gián tiếp, trang chặn truy cập]).
- **Tỉ lệ hoa đực/cái** ([Craeye et al. 2020, *Acta Hort.* 1294](https://ishs.org/ishs-article/1294_10/) [đã đọc phần tóm tắt]):
	- Nếu nhiệt độ trung bình ngày dưới 14 °C trong tháng đầu sau khi trồng, tỉ lệ đực : cái giảm dưới 1 : 9 trong gần 2 tháng, tức thiếu hoa đực.
	- Ở 17 °C thì tỉ lệ đủ. Muốn có đủ hoa đực thì nhiệt độ trung bình ngày phải trên 15 °C.
- **Sốc nhiệt**:
	- Nhiệt độ cao là nguyên nhân hay gặp nhất làm hoa cái và quả non của bí ngô rụng. Ngày ở mức 90 °F (32–37 °C) cùng đêm ở giữa tới cuối 70 °F (24–26 °C) gây hao hụt ([Univ. Delaware Weekly Crop Update – Poor Fruit Set in Pumpkin](https://sites.udel.edu/weeklycropupdate/?p=1583) [gián tiếp]).
	- Ong hoạt động chậm lại khi tới khoảng 90 °F (32 °C) ([UMN Extension](https://extension.umn.edu/planting-and-growing-guides/how-excessive-heat-affects-vegetable-garden) [gián tiếp]).
- **Nhiệt độ cơ bản GDD**: **chưa xác minh**.
	- Thường dùng 10 °C (50 °F) cho cây họ bầu bí ưa ấm, nhưng chưa tìm được nguồn riêng cho *C. pepo*.
	- [Abele et al. 2018](https://cucurbit.info/2018/11/cucurbitaceae-2018-abstracts-fd/) [đã đọc phần tóm tắt]: từ trồng cây con tới hoa cái đầu tiên cần 224–351 GDD (16–29 ngày), tuỳ giống; tới quả đầu tiên 312–328 GDD. Tóm tắt **không ghi nhiệt độ cơ bản**.
- **Lịch đề xuất** (nền 10 °C, **ước tính**):
	- **Mọc** khoảng 7 ngày ở 21 °C ≈ 80 °C·ngày.
	- **Hoa cái đầu tiên** khoảng 45–55 ngày sau gieo ở trung bình 22 °C ≈ 550–650; đề xuất 600. Tính từ WSU: 50–65 ngày tới lứa quả đầu ([WSU](https://extension.wsu.edu/snohomish/cucurbits/) [gián tiếp]), trừ 2–4 ngày từ hoa tới quả (Arkansas).
	- **Hạt chín**:
		- Hạt bí zucchini đạt chất lượng cao nhất ở 49 ngày sau khi hoa nở; để quả lâu hơn thì chất lượng hạt giảm ([*J. Seed Sci.*, SciELO](https://scielo.br/j/jss/a/YfD8kSKnJPfbc6nkPsZZvjM/?lang=en) [gián tiếp]).
		- Ở bí marrow, hạt ngừng tích luỹ chất khô ở 54–63 ngày sau khi hoa nở ([Demir & Ellis, *Seed Sci. Res.*](https://www.doi.org/10.1017/S0960258500001860) [gián tiếp]).
		- Lấy khoảng 55 ngày ở 22 °C ≈ 660 °C·ngày, cộng 600 ⇒ **gddSeed ≈ 1250**.

**Quang chu kỳ**
- Thời điểm ra hoa trung tính với quang kỳ (EcoCrop).
- Ngày dài và nhiệt độ cao làm hoa cái ra muộn ở *C. pepo* ([Nitsch et al. 1952, *Am. J. Bot.* 39:32](https://www.nature.com/articles/178552a0) [gián tiếp, chỉ thấy qua bài trích dẫn]).

**Nước**
- Cây đã ổn định cần tưới 1–1,5 inch/tuần (**25–38 mm/tuần**); nước phải thấm sâu 6–8 inch. Thiếu côn trùng thì hoa cái dễ rụng ([UGA C993](https://fieldreport.caes.uga.edu/publications/C993/homegrown-summer-and-winter-squash/) [đã đọc]).
- Thời tiết nóng làm tăng thối đít quả (UGA).
- Không đụng vào lá khi lá ướt để tránh lây bệnh. Bệnh cháy hoa (blossom blight) xuất hiện khi trời mưa ẩm (Arkansas [đã đọc]).

### 2. Bệnh do độ ẩm và nhiệt độ trong nhà kính

#### 2.1. Phấn trắng đậu Hà Lan (*Erysiphe pisi*), cũng hại đậu thơm
- Bệnh phát triển tốt nhất ở **20–25 °C**. Sương đêm và trời ít mưa giúp bệnh phát triển; mưa rào lại cản bệnh lan. Bệnh gây hại nặng hơn ở vụ chín muộn ([Manitoba Agriculture – Powdery Mildew of Field Peas](https://manitoba.ca/agriculture/crops/plant-diseases/powdery-mildew-field-peas.html) [đã đọc]).
- Bệnh phát triển khi trời khô, ấm và đêm có sương. Bệnh thường chỉ tới vào giữa hè. Năng suất chỉ giảm khi bệnh nhiễm từ đầu tới giữa giai đoạn tạo quả ([NDSU A1166](https://wpcdn.web.wsu.edu/extension/uploads/sites/54/2013/12/FieldPeaProduction_NDExtension_a1166.pdf) [đã đọc]).
- **Terletskaya 2022** ([*Земледелие и растениеводство* 5:39](https://crop.belal.by/jour/article/jats/602) [đã đọc phần tóm tắt]):
	- Bào tử đính nảy mầm ở 7–35 °C và RH 40–100 %.
	- Nảy mầm mạnh nhất ở 20–27 °C và **RH 80–100 %**.
	- **Thời gian ủ bệnh ngắn nhất là 4 ngày**, ở 20–27 °C.
- Đậu thơm bị phấn trắng do *Erysiphe pisi* var. *pisi*. Ở Bắc Mỹ còn ghi nhận *E. lathyricola* và *E. trifoliorum* ([PNW Handbook – Sweetpea powdery mildew](https://pnwhandbooks.org/plantdisease/host-disease/sweetpea-lathyrus-odoratus-powdery-mildew) [gián tiếp]). Johnny's [đã đọc] ghi đây là bệnh phổ biến nhất của đậu thơm.
- Số giờ ẩm tối thiểu: **chưa xác minh**. Bệnh phấn trắng không cần lá ướt; điều kiện thuận là đêm có sương rồi ngày khô.

#### 2.2. Phấn trắng bí (*Podosphaera xanthii*)
- Bệnh ưa nhiệt độ vừa phải, 68–80 °F (20–27 °C), độ ẩm trung bình tới cao (RH 50–90 %), tán lá dày và ánh sáng yếu. Bệnh vẫn nhiễm được trong điều kiện khô, RH chỉ khoảng 50 % ([NC State Extension – Cucurbit Powdery Mildew](https://content.ces.ncsu.edu/cucurbit-powdery-mildew) [đã đọc]).
- Theo CDFA ([*Podosphaera xanthii* profile](https://blogs.cdfa.ca.gov/Section3162/?p=2468) [đã đọc]):
	- Bệnh phát triển tối ưu ở 20–27 °C và nhiễm được trong khoảng 10–32 °C. Bệnh **ngừng phát triển từ 38 °C**.
	- RH cao giúp bào tử nhiễm và sống sót. Trời khô giúp nấm phát triển, sinh bào tử và phát tán. Mưa và nước đọng trên lá thì bất lợi cho nấm.
- Theo mô hình Metos FieldClimate ([Metos – cucurbit models](https://metos.global/en/disease-models-cucumber-melon-pumpkin-zucchini/) [đã đọc]): bệnh dừng khi ban ngày trên 28 °C; **ủ bệnh 3–7 ngày**.

#### 2.3. Mốc xám (*Botrytis cinerea*), chung cho cả 4 loài trong nhà kính
- Theo Ohio State ([Ohioline HYG-3070](https://ohioline.osu.edu/factsheet/HYG-3070) [đã đọc]):
	- Bào tử nảy mầm và xâm nhiễm khi trời mát, **RH ≥ 85 %**, không khí ít lưu thông hoặc có nước đọng trên lá.
	- Bào tử nảy mầm tối ưu ở 22–25 °C.
	- Giữ RH dưới 85 % thì kiểm soát bệnh rất tốt.
- Bệnh nặng nhất khi **RH > 90 % và 59–70 °F (15–21 °C)**, đặc biệt khi có nước đọng ([Virginia Tech SPES-820](https://www.pubs.ext.vt.edu/content/dam/pubs_ext_vt_edu/spes/spes-820/SPES-820.pdf) [đã đọc]).
- UConn khuyên giữ RH dưới 90 % để phòng mốc xám ([UConn IPM – Greenhouse tomato foliar diseases](https://ipm.cahnr.uconn.edu/foliar-diseases-on-greenhouse-tomatoes/) [đã đọc]). Với cây hoa thảm, bệnh cần RH > 93 % mới nhiễm được ([UConn – Botrytis on bedding plants](https://extension.uconn.edu/publication/botrytis-bedding-plants/) [đã đọc]).
- **Số giờ lá ướt** (Bulger, Ellis & Madden 1987, *Phytopathology* 77:1225, nghiên cứu trên hoa dâu tây):
	- Bệnh phát triển tối ưu ở 20 °C.
	- Lá ướt trên **16 giờ** thì tỉ lệ bệnh tăng vọt ([UC Strawberry Center blog](https://strawberrycenterblog.com/2022/04/13/classic-botrytis-data-from-1987/) [đã đọc]; bài gốc [gián tiếp]).
	- Số liệu này đo trên dâu tây, nên áp sang các loài khác là **chưa xác minh**.
- Đậu thơm và hoa mõm chó đều có bệnh cháy hoa do Botrytis (MS State [đã đọc]). Bí bị cháy hoa khi trời mưa ẩm (Arkansas [đã đọc]).

#### 2.4. Gỉ sắt hoa mõm chó (*Puccinia antirrhini*)
- Cây phải ướt **6–8 giờ** thì bệnh mới nhiễm được ([PNW Handbook – Snapdragon rust](https://pnwhandbooks.org/node/3507) [đã đọc]).
- Bệnh ưa 55–70 °F (13–21 °C) và bị kìm hãm khi trên 80 °F (27 °C).
- Biện pháp phòng: giữ nhà kính trên 70 °F vài ngày và không để ban đêm xuống dưới 60 °F.
- Nên đưa vào mô hình thay cho phấn trắng ở hoa mõm chó, vì đây là bệnh có ngưỡng rõ ràng nhất.

#### 2.5. Gợi ý chung cho `climate.js`
- Thay ngưỡng RH > 90 % hiện nay bằng một bộ đếm số giờ ẩm cho từng bệnh:
	- Botrytis: RH ≥ 85 % ở 15–21 °C trong ≥ 16 giờ.
	- Gỉ sắt hoa mõm chó: lá ướt ≥ 6 giờ ở 13–21 °C.
	- Phấn trắng: nhiệt độ 20–27 °C, ngày khô xen đêm ẩm; bệnh hiện ra sau thời gian ủ 3–7 ngày.
- Mưa tự nhiên làm giảm phấn trắng (Manitoba, CDFA) nhưng làm tăng Botrytis.

### 3. Sinh học thụ phấn cho các phép lai

#### 3.1. Đậu Hà Lan
- Mendel (1866), bản dịch tiếng Anh ([MendelWeb](http://www.mendelweb.org/Mendel.html) [đã đọc]):
	- Bộ phận sinh sản nằm khít trong cánh thìa và **bao phấn nứt ngay trong nụ**, nên đầu nhuỵ đã phủ phấn trước khi hoa nở.
	- Cách lai: mở nụ trước khi nụ phát triển đầy đủ, bỏ cánh thìa, dùng kẹp gắp từng nhị, rồi chấm phấn lạ lên đầu nhuỵ.
	- Mọt đậu *Bruchus pisi* đẻ trứng vào hoa và mở cánh thìa; Mendel thấy hạt phấn trên chân một con mọt bắt được trong hoa.
	- "Trong hơn 10 000 cây được kiểm tra kỹ, chỉ có rất ít trường hợp chắc chắn bị thụ phấn nhầm. Trong nhà kính thì chưa từng gặp."
- Dostálová et al. 2005 ([*Czech J. Genet. Plant Breed.* 41:51](https://cjgpb.agriculturejournals.cz/artkey/cjg-200502-0003_simulation-and-assessment-of-possible-environmental-risks-associated-with-release-of-genetically-modified-peas.php) [đã đọc phần tóm tắt]):
	- Trồng giống nhận phấn sát giống cho phấn và sàng lọc khoảng 40 000 cây F1 mỗi năm (2001–2003). **Không có cây lai nào**.
	- Kết luận: xác suất giao phấn ở các giống thương mại hiện nay rất thấp, bằng 0 trong thí nghiệm của họ.
	- Côn trùng hay ghé hoa: mọt đậu, rệp, bọ trĩ, ong mật, ong nghệ. *Bruchus pisorum* có thể mang phấn vào hoa chưa nở.
- Seeds of Diversity ([Peas – pollinator best practices](https://seeds.ca/pollinator/bestpractices/peas.html) [đã đọc]):
	- Bao phấn tung phấn trước khi nụ mở nên rất ít giao phấn.
	- Khi bị bọ trĩ phá, giao phấn có thể **lên tới 20 %**. Con số này không có nghiên cứu gốc đi kèm: **chưa xác minh**.
- **Hệ quả cho mô hình** (khớp với `pea-garden.js` hiện nay):
	- Tự thụ phấn xảy ra lúc nụ, trước khi hoa nở.
	- Khử nhị phải làm khi còn nụ.
	- Không bao hoa trong nhà kính thì tỉ lệ giao phấn gần như bằng 0 (đề xuất 0,1 %). Nếu có sự kiện "bọ trĩ" hoặc "mọt đậu" thì có thể tăng lên vài %.
	- Giả định 10 % con lai khi thụ phấn mà không khử nhị trong `harvest()` hiện **chưa có nguồn**.

#### 3.2. Đậu thơm
- Darwin nhận xét các giống ở Anh hiếm khi lai với nhau vì hoa tự thụ phấn sớm, trước khi tràng hoa nở hết ([Darwin CUL-DAR77.30](https://darwin-online.org.uk/converted/manuscripts/Darwin_C_R_CUL-DAR77.30.html) [gián tiếp]).
	- Ong mật và ong cắt lá *Megachile* có ấn được cánh thìa và mang phấn.
	- Ở vùng nguyên sản có côn trùng lớn hơn thì có thể giao phấn nhiều hơn.
- Vùng Lompoc (California), nơi trồng nhiều hạt giống đậu thơm, có bờ biển mát và gió làm ong ít hoạt động, nhờ vậy dòng giống giữ được thuần ([Renee's Garden](https://www.reneesgarden.com/blogs/gardening-resources/success-with-sweet-peas) [gián tiếp]).
- Không tìm được tỉ lệ giao phấn đo được cho *L. odoratus*: **chưa xác minh**.
	- Loài gần là *L. sativus* có tỉ lệ giao phấn trung bình 2,2 % ([USask – Natural outcrossing in grasspea](https://harvest.usask.ca/handle/10388/10344?show=full) [gián tiếp]). Đây là loài khác, không dùng thẳng được.
- **Hệ quả cho mô hình**: dùng giống đậu Hà Lan (tự thụ trong nụ, khử nhị lúc nụ). Đề xuất tỉ lệ giao phấn khi không bao hoa khoảng 0,5 % (**chưa xác minh**).

#### 3.3. Hoa mõm chó
- Hoa có tràng kín (personate): môi dưới đóng miệng ống tràng. Chỉ ong to và khoẻ, chủ yếu ong nghệ *Bombus*, mới đủ nặng để mở hoa.
	- Ong mật thường chỉ hút trộm mật qua lỗ do ong nghệ cắn bên hông, cách này không thụ phấn ([Botany online, Univ. Hamburg](https://www-archiv.fdm.uni-hamburg.de/b-online/library/snapdragon/snapdragon_pollination.html) [gián tiếp]; [Flower specialisation: the occluded corolla of snapdragons](https://docta.ucm.es/entities/publication/1d4ebe93-a852-48d0-b272-d8b7dd3a779e) [gián tiếp]).
	- Ở 18 loài *Antirrhinum* tại bán đảo Iberia, trên 85 % lượt ghé hoa là của 11 loài ong. Các loài này nói chung tự bất thụ, nên cần côn trùng thụ phấn ([AGRIS 2017](https://agris.fao.org/search/ru/records/679bab33969e37f4376fbe20) [gián tiếp]).
- Trừ cây trồng của *A. majus*, các taxon này đều tự bất thụ và giao phấn ([Mateu-Andrés & de Paco 2005, *Ann. Bot.* 95](https://pmc.ncbi.nlm.nih.gov/articles/PMC4246802) [đã đọc]). Như vậy **giống trồng tự thụ được**, nhưng vẫn cần lực mở hoa hoặc thụ phấn bằng tay.
- Tự bất thụ của *Antirrhinum* dựa trên S-RNase ([Xue et al. 1996, *Plant Cell*](https://pmc.ncbi.nlm.nih.gov/articles/PMC161139) [đã đọc phần tóm tắt]).
- Tỉ lệ giao phấn của giống trồng khi không bao hoa: **chưa tìm được số đo, chưa xác minh**.
- **Hệ quả cho mô hình**:
	- Phép lai cần khử nhị (bỏ nhị ở nụ trước khi tung phấn), bao hoa, rồi thụ phấn bằng tay.
	- Nhà kính không có ong nghệ: hoa không bao vẫn ít đậu hạt (đề xuất xác suất tự đậu hạt thấp, **chưa xác minh**).
	- Nhà kính có thả ong nghệ: phấn lấy ngẫu nhiên từ các cây đang nở hoa (đề xuất 50 % hạt là con lai, **chưa xác minh**).

#### 3.4. Bí ngô mùa hè
- Cây đơn tính cùng gốc. Hoa đực ra trước, hoa cái có bầu nhuỵ ở gốc. Cần côn trùng, chủ yếu ong, mang phấn từ hoa đực sang hoa cái (Arkansas FSA6019 [đã đọc]).
	- Giống cùng loài *C. pepo* lai với nhau, kể cả bí ngô cảnh. Việc lai không ảnh hưởng quả của vụ này, chỉ ảnh hưởng hạt.
- Hoa chỉ nở một buổi sáng: nở trước bình minh, đóng khoảng trưa và không nở lại ([UVM – Winter squash pollinators](https://www.uvm.edu/d10-files/documents/2025-03/winter-squash-pollinator-print.pdf) [gián tiếp]).
- Đậu quả đầy đủ cần 1250–2000 hạt phấn trên mỗi đầu nhuỵ, tức khoảng **8–12 lượt ong** ghé mỗi hoa cái ([CT Agricultural Experiment Station](https://PORTAL.CT.GOV/-/media/caes/documents/publications/pollinators/pollinationofpumpkinandwintersquashpdf.pdf) [gián tiếp]; [Penn State](https://ento.psu.edu/files/integrated-crop-pollination-for-squashes-pumpkins-and-gourds) [gián tiếp]).
- Sức sống hạt phấn ([Craeye et al. 2020, *Acta Hort.* 1271](https://ishs.org/ishs-article/1271_52/) [đã đọc phần tóm tắt]):
	- Bắt đầu giảm sau 3 giờ kể từ khi hoa nở. Lúc hoa đóng còn 60 % sống; sáng hôm sau còn ≤ 10 %.
	- Phải thu phấn và chấm lên đầu nhuỵ **trong vòng 3 giờ sau khi hoa nở**. Không bảo quản phấn được quá 8 giờ.
- Giữ giống thuần cần cách ly các giống cùng loài **nửa dặm (≈ 800 m)**, hoặc thụ phấn tay và ngăn côn trùng ([Fedco Seeds](https://fedcoseeds.com/seeds?item=1705) [gián tiếp]).
- Nếu côn trùng ít thì hoa cái rụng (UGA C993 [đã đọc]).
- Tỉ lệ giao phấn đo được ở *C. pepo* trồng: **không tìm thấy, chưa xác minh**.
	- Hoa cái nhận phấn của bất kỳ hoa đực nào mà ong đã ghé, kể cả hoa đực trên chính cây đó (thụ phấn giữa các hoa cùng cây).
- **Hệ quả cho mô hình**:
	- Phép lai: chọn hoa đực và hoa cái sẽ nở vào sáng hôm sau, buộc hoặc bao cả hai từ chiều hôm trước. Sáng ra, trong 3 giờ đầu, lấy hoa đực chấm lên hoa cái rồi bao lại. Bí không cần khử nhị vì hoa cái không có nhị.
	- Không bao hoa và có ong: phấn lấy ngẫu nhiên theo số hoa đực đang nở của mọi cây.
	- Không có ong: không đậu quả.

### 4. Thiết bị khu trồng trọt

#### 4.1. Buồng sinh trưởng (growth chamber)

**Conviron GEN1000**: dòng hiện hành thay cho A1000 Adaptis ([trang sản phẩm](https://www.conviron.com/products/gen1000/) [đã đọc]; [data sheet 2025](https://conviron.b-cdn.net/uploads/GEN1000-Data-Sheet-2025-MK0090-rev-15.pdf) [đã đọc])
- **Nhiệt độ**:
	- 4–45 °C khi tắt đèn, 7–50 °C khi bật đèn.
	- Tuỳ chọn nhiệt độ thấp: +1 °C khi bật đèn, −5 °C khi tắt đèn (dùng cho thí nghiệm xuân hoá).
- **Độ ẩm**: chuẩn có tạo ẩm siêu âm tới **90 % RH** khi tắt đèn; tuỳ chọn hút ẩm.
- **Ánh sáng** (LED phổ rộng, đèn đỏ xa điều khiển riêng):
	- 1 tầng: **2050 µmol/m²/s**, cao 46,5″ (1180 mm), diện tích 0,525 m².
	- 2 tầng: 1100 µmol/m²/s; 3 tầng: 775; 4–5 tầng: 500–600.
- **Bộ điều khiển**: CMP7000, chỉnh được quang kỳ và phổ ánh sáng; tuỳ chọn bổ sung CO₂.
- **Kích thước ngoài**: 41″ × 32,5″ × 77″.

**Conviron A1000 (Adaptis)**: model cũ, chỉ còn trong các cơ sở nghiên cứu
- Buồng 1000 lít, đổi được 4 bộ kit, dùng bộ điều khiển CMP6010 ([thông cáo Conviron](http://www.conviron.com/newsroom/press_release_Adaptis.html) [gián tiếp]).
- Harvard Arboretum (kit nuôi cấy mô) ([Growth facilities](https://arboretum.harvard.edu/research/research-facilities/growth-facilities) [đã đọc]):
	- Nhiệt độ +10 tới +45 °C khi bật đèn, +4 tới +40 °C khi tắt đèn.
	- RH tới 90 % khi tắt đèn và 60 % khi bật đèn; điểm sương tối đa +24 °C.
	- Ánh sáng 200 µmol/m²/s; diện tích 26 ft²; chiều cao 8″.
- McGill ([Greenhouse and phytorium](https://www.mcgill.ca/plant/facilities/greenhouse-and-phytorium) [đã đọc]):
	- Nhiệt độ 4–45 °C.
	- Kit cây thấp: LED tối đa 550 µmol, cao 42–62 cm, diện tích 0,55 m².
	- Kit nuôi cấy mô: LED tối đa 700 µmol.

**Conviron PGR15**: buồng cho cây cao, phù hợp đậu leo và bí ([Harvard](https://arboretum.harvard.edu/research/research-facilities/growth-facilities) [đã đọc])
- Nhiệt độ +10 tới +45 °C khi bật đèn, +4 tới +45 °C khi tắt đèn.
- RH tối đa 90 % (tắt đèn) và 85 % (bật đèn).
- Ánh sáng 1150 µmol/m²/s; chiều cao tới 69″ (≈ 175 cm) khi nâng; diện tích 16,1 ft².

**Percival AR-66L2 và AR-66L3**: buồng cho Arabidopsis ([AR-66L2 spec sheet](https://percival-scientific.com/wp-content/uploads/2016/10/2026_Percival-Scientific_AR-66L2_Arabidopsis-Chamber.pdf) [đã đọc]; [AR-66L3](https://percival-scientific.com/wp-content/uploads/2020/10/2026_Percival-Scientific_AR-66L3_Arabidopsis-Chamber.pdf) [đã đọc])
- **Nhiệt độ**: 7–44 °C ± 0,5 °C khi bật đèn và 2–44 °C khi tắt đèn (theo bản L3).
- **Ánh sáng**: LED SciWhite tăng đỏ, chỉnh được tới **360 µmol/m²/s** đo cách đèn 6″. Dimmer 10–100 %, mỗi nấc 1 %.
- **Kích thước**:
	- L2: 2 tầng, chiều cao trồng 23,1″ (58,7 cm), sàn 1,9 m².
	- L3: 3 tầng, chiều cao 14″ (35,6 cm), sàn 2,8 m².
	- Thể tích trong 1,8 m³; kích thước ngoài 66 × 33,6 × 77,2″.
- **Độ ẩm**: chỉ là tuỳ chọn (máy tạo ẩm siêu âm, kèm hoặc không kèm hút ẩm, cảm biến RH H11/H12/H14/H15). Bản spec **không ghi khoảng RH**: chưa xác minh.
- **Điều khiển**: IntellusUltra C8T lập trình quang kỳ và cường độ sáng; luồng gió ngang 50 ft/phút.
- **Lưu ý cho app**: AR-66L cao tối đa 58,7 cm, thấp hơn đậu cao kiểu Mendel (thân cao khoảng 1,8–2 m, theo Mendel 1866 là 6–7 ft). AR-66L chỉ hợp cho cây con hoặc hoa mõm chó lùn; đậu leo và bí nên trồng trong nhà kính hoặc buồng cao như PGR15.

#### 4.2. Bộ điều khiển khí hậu nhà kính

**Argus TITAN** (Argus Controls, cùng tập đoàn với Conviron)
- TITAN Atom, một tủ điều khiển nhiều khu ([brochure 2024](https://arguscontrols.com/uploads/TITAN-Atom-Jan2024-MK0268-Rev-01.pdf) [đã đọc]):
	- Thông gió: cửa nóc, cửa bên, cửa đầu hồi, cửa tấm làm mát.
	- Làm mát: tấm làm mát, quạt hút, quạt đầu hồi.
	- Sưởi: lò sưởi, sưởi dưới bàn, sưởi chu vi.
	- Ánh sáng: lưới che nắng, che tối (light deprivation), đèn bổ sung.
	- Quạt đảo gió, van CO₂.
	- Độ ẩm: van phun sương mù, máy hút ẩm.
	- Tưới: van điện từ.
	- Tủ có 32 đầu ra số, 7 đầu vào tương tự/số, 2 đầu vào tần số cao và 8 đầu vào 4–20 mA.
- Bản TITAN đầy đủ điều khiển cả nhiệt độ, độ ẩm, CO₂, cường độ đèn, lưới, tưới và báo động ([Argus TITAN](https://arguscontrols.com/products-and-solutions/control-systems/titan-system) [gián tiếp]).
	- Đo DLI ở tầm cây ([gián tiếp]).
	- Đại học Wyoming ghi hệ này dự đoán trước biến động khí hậu và giữ nhiệt độ trong ± 2 °C ([UWyo greenhouse bays](https://www.uwyo.edu/science-initiative/plant-facility/greenhouse-bays.html) [gián tiếp]).

**Priva Connext** ([brochure 2022](https://www.priva.com/media/wztpbmio/en-brochure-connext-12pg-defonline-202205.pdf) [đã đọc])
- Quản lý tập trung khí hậu, ánh sáng, tưới, nước và năng lượng.
- Điều khiển cửa thông gió, màn năng lượng, đèn, sưởi, tạo ẩm, xử lý không khí, nồi hơi, CHP, bồn đệm, khử trùng và châm phân.
- Các khối liên kết với nhau, ví dụ:
	- Đóng hoặc mở màn thì tự chỉnh nhu cầu sưởi.
	- Bật đèn thì sưởi giảm theo nhiệt đèn toả ra.
	- Liều CO₂ tính theo độ mở cửa và theo mức sáng.
- Chiến lược PAR theo dõi ánh sáng và màn.
- Từ bản 916, đặt được mức đèn LED theo µmol và theo bảng phổ ([Priva blog](https://www.priva.com/blog/horticulture/led-lighting-control-with-priva-connext-916) [gián tiếp]).

Bộ điều khiển nhà kính **không có "khoảng nhiệt độ" như buồng sinh trưởng**: khoảng nhiệt độ đạt được phụ thuộc thiết bị sưởi và làm mát gắn vào. Vì vậy app nên mô phỏng điểm đặt (setpoint) và độ lệch (± 2 °C theo UWyo).

**Gợi ý ngưỡng ẩm cho bảng khí hậu nhà kính**
- Giữ RH < 85 % để phòng Botrytis (Ohio State).
- Ngưỡng dưới khoảng 50–60 %:
	- Khoảng 60–80 % RH ở 18–28 °C chỉ thấy trong một bài báo ngành ([Farmer's Weekly](https://www.farmersweekly.co.za/farming-tips/how-to-crop/why-humidity-is-crucial-in-climate-control/) [gián tiếp], **chưa xác minh** bằng nguồn khuyến nông).
	- MSU Extension khuyên giữ VPD > 0,5 kPa [gián tiếp]. Ở 20 °C, áp suất hơi bão hoà khoảng 2,34 kPa, nên VPD 0,5 kPa ứng với RH ≈ 79 %.
