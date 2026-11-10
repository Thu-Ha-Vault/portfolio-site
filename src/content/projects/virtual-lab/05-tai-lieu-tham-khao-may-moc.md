---
title: 'Tài liệu tham khảo máy móc (đợt 1: chuỗi PCR)'
type: research-note
tags:
  - project
  - virtual-lab
  - lab-equipment
  - pcr
  - electrophoresis
folder: Projects / Virtual_Lab
vaultPath: Projects/Virtual_Lab/05 - Tài liệu tham khảo máy móc.md
date: '2026-10-16'
status: active
order: 5
project: virtual-lab
isIndex: false
description: >-
  Mỗi máy trong Khu máy móc được vẽ chi tiết theo một model thật (hình dáng, bộ
  phận, số liệu), nhưng không vẽ logo hay tên hãng lên máy. Số liệu lấy từ
  manual, datasheet của hãng; chỗ chưa kiểm chứng ghi chưa xác minh. Đợ
---
<div class="callout callout-info">
<p class="callout-title">Cách dùng note này</p>

Mỗi máy trong Khu máy móc được vẽ chi tiết theo **một model thật** (hình dáng, bộ phận, số liệu), nhưng không vẽ logo hay tên hãng lên máy. Số liệu lấy từ manual, datasheet của hãng; chỗ chưa kiểm chứng ghi *chưa xác minh*. Đợt 1 gồm 3 máy của chuỗi PCR: máy PCR → bộ điện di + nguồn → máy chụp ảnh gel.

</div>

## Model được chọn

| Máy | Model làm mẫu | Lý do chọn |
| --- | --- | --- |
| **Máy PCR** | **Bio-Rad T100 Thermal Cycler** (cat. 1861096) | Có trọn manual với ảnh chú thích mặt trước, mở nắp, vòng đỡ tube, mặt sau; hình khối đơn giản, phổ biến ở lab giảng dạy |
| **Bể điện di** | **Bio-Rad Mini-Sub Cell GT** (bản QuickSnap hiện hành, manual 10016027 Rev C) | Manual có hình chú thích từng bộ phận và bảng vật liệu; bán sẵn theo bộ với nguồn (cat. 164-0300) |
| **Nguồn điện di** | **Bio-Rad PowerPac Basic** (cat. 164-5050) | Hãng khuyến nghị dùng với Mini-Sub; manual có hình mặt trước, mặt sau |
| **Máy chụp ảnh gel** | **Bio-Rad Gel Doc EZ** (cat. 1708270) | Cấu trúc gel doc kinh điển (tủ tối, đèn UV 302 nm dưới khay, camera trên đỉnh); manual mô tả phần cứng tới từng vít. Lưu ý: đã ngừng bán, thay bằng GelDoc Go |

## 1. Máy PCR: Bio-Rad T100

### Thông số
| Thông số | Giá trị |
| --- | --- |
| Kích thước, khối lượng | 26 × 47 × 23 cm (W × D × H), 9 kg |
| Block | 96 × 0,2 mL tube, strip 0,2 mL hoặc 1 plate 96 giếng; 8 hàng (A–H) × 12 cột |
| Dải nhiệt block | 4–100 °C; chính xác ±0,5 °C; đồng đều ±0,5 °C trong 30 s |
| Ramp | Tối đa 4 °C/s, trung bình 2,5 °C/s |
| Gradient | 30–100 °C, chênh 1–25 °C |
| Nắp gia nhiệt | 40–110 °C, mặc định **105 °C**; block giữ dưới 30 °C thì nắp giữ 31 °C |
| Màn hình | Cảm ứng màu VGA 5,7 in, dùng được khi đeo găng |
| Cổng | 1 USB A ở góc dưới phải mặt trước; không có Ethernet |
| Nguồn | 100–240 VAC, 50–60 Hz, tối đa 700 W; 2 cầu chì 10 A 250 V 5×20 mm |
| Bơm nhiệt | Peltier ("protected thermoelectric components"), có quạt |

### Bộ phận để vẽ
- **Vỏ**: thân trắng ngà; mặt trước vát nghiêng chứa màn hình; dải đế xanh lá chạy quanh đáy; khe gió ngang ở nửa dưới mặt bên và hai băng khe gió ở mặt sau.
- **Mặt trước**: màn hình cảm ứng ở giữa; đèn trạng thái trên phải màn hình (sáng khi chạy, nhấp nháy khi chờ); cổng USB A có viền xanh ở góc dưới phải; không có nút bấm vật lý.
- **Nắp**: nắp vỏ sò, bản lề phía sau, mặt trên xanh lá, tay cầm ở mép trước. Nhấc tay cầm tới khi nắp tự đứng; ấn xuống tới khi dừng để đóng.
	- **Nắp trong gia nhiệt**: tấm phẳng xám đen, viền khung đen, ký hiệu tam giác "Hot surface" ở giữa; vừa gia nhiệt vừa ép lên nắp tube để chống bay hơi và ngưng tụ.
- **Block**: lõm trên mặt trên, ngay dưới nắp; bước giếng 9 mm theo chuẩn plate 96 giếng (ANSI/SLAS 4-2004, *suy luận, chưa có tài liệu Bio-Rad xác nhận*).
	- **Vòng đỡ tube**: khung chữ nhật bo góc màu xanh, lật được hai mặt (tube nắp vòm và tube nắp phẳng).
- **Mặt sau** (cột trái, từ trên xuống): công tắc bập bênh I/O, 2 hộp cầu chì tròn vặn bằng đồng xu, ổ IEC; nhãn thông số trắng ở giữa dưới (Model, Serial, Input, Max Power, Fuse, CE, FC, CSA, WEEE, mã vạch).
- **Đáy**: ngăn pin cúc áo CR2477N.

### Chu trình PCR 3 bước chuẩn (Addgene)
| Bước | Nhiệt độ | Thời gian |
| --- | --- | --- |
| Biến tính ban đầu | 94 °C (thường 94–98 °C) | 2 phút |
| Biến tính | 94 °C | 30 s |
| Gắn mồi | 55 °C (khoảng Tm − 5 °C) | 30 s |
| Kéo dài | 72 °C | 1–2 phút mỗi kb |
| Số chu kỳ | | 25–30 |
| Kéo dài cuối | 72 °C | 5 phút |
| Giữ | 4 °C (thông lệ; T100 giữ vô hạn) | ∞ |

- Nắp nóng 105 °C để hơi nước không ngưng trên nắp tube; lực ép giữ kín tube (manual T100, tr. 3, 11). (→ [Danh mục thí nghiệm ảo](/projects/virtual-lab/02-danh-muc-thi-nghiem-ao/), mục C1)

## 2. Bể điện di: Bio-Rad Mini-Sub Cell GT

### Thông số
| Thông số | Giá trị |
| --- | --- |
| Đế (GT base) | 25,5 × 9,2 × 5,6 cm (L × W × H), nhựa trong đúc khuôn |
| Khay gel | UVTP acrylic, 7 × 7 hoặc 7 × 10 cm, có thước huỳnh quang |
| Lược | 8 giếng và 15 giếng, dày 1,5 mm (8 giếng: rộng 5,54 mm, chứa 41,6 µL) |
| Buffer | 265–320 mL; phủ trên gel 2–6 mm |
| Điện cực | Dây platinum Ø 0,25 mm dọc đáy mỗi buồng buffer |
| Giới hạn | 150 VDC, 10 W, buffer ≤ 40 °C |

### Bộ phận để vẽ
- **Đế**: 2 buồng buffer ở hai đầu, **bàn đặt gel** nhô lên ở giữa; rãnh casting gate ở hai đầu bàn; chân chỉnh cân bằng và một bọt thuỷ rời; tab để nhấc nắp.
- **Điện cực QuickSnap**: anode đỏ, cathode đen; dây platinum có tấm chắn polycarbonate; **banana plug** đồng thau mạ vàng dài 4,4 cm, cắm thẳng đứng.
- **Nắp an toàn**: nhựa trong, banana jack đỏ/đen úp xuống cắm vào plug của đế; chỉ lắp được một chiều; nhấc nắp là hở mạch.
- **Cáp**: cáp đôi 20 AWG đỏ/đen, đầu kia là phích đúc liền hai chân.
- **Casting gate**: 2 tấm nhôm cắm vào rãnh để đổ gel ngay trong bể.

## 3. Nguồn điện di: Bio-Rad PowerPac Basic

| Thông số | Giá trị |
| --- | --- |
| Đầu ra | 10–300 V (bước 1 V), 4–400 mA (bước 1 mA), tối đa 75 W; tự chuyển giữa điện áp không đổi và dòng không đổi |
| Hẹn giờ | 1–999 phút |
| Kích thước | 25 × 21 × 8,5 cm, 1,1 kg, xếp chồng được; chân gập ở đáy |
| Vỏ | Nắp trên xanh lá mờ |

- **Mặt trước**: màn LED 3 chữ số (V, mA hoặc phút); phím Constant Parameter (kèm LED V và mA), Display Mode, Scroll +/−, Run & Pause (kèm LED), Stop; **4 cặp banana jack** đỏ (+) / đen (−) lõm sâu 16 mm, nối song song.
- **Mặt sau**: ổ AC, ngăn cầu chì có khe tua vít (2,5 A 250 V 5×20 mm type T), khe quạt.
- *Chưa xác minh*: thứ tự trái–phải của phím và jack; vị trí công tắc (hình ghi mặt sau, phần quy trình ghi cạnh phải). Cần đối chiếu ảnh sản phẩm thật trước khi vẽ.

### Số liệu điện di
| Nội dung | Giá trị |
| --- | --- |
| Agarose | 1% tách tốt 0,5–10 kb; 1,5% cho 0,2–3 kb; 0,75% cho 0,8–12 kb |
| Buffer | 1× TAE (40 mM Tris, 20 mM acetic acid, 1 mM EDTA) hoặc 1× TBE |
| Điện áp | 1–5 V/cm (JoVE) đến 4–10 V/cm (Lonza), đo giữa hai điện cực; Mini-Sub: 60 V × 1,5 h hoặc 150 V × 15 phút |
| Tốc độ | Bromophenol blue chạy khoảng 4,5 cm/h ở 75 V (gel 1%, TAE) |
| Chiều chạy | DNA mang điện âm, chạy về **anode đỏ (+)**; giếng đặt phía cathode đen ("Always Run to Red") |
| Bọt khí | Điện phân nước: H₂ ở cathode (−), O₂ ở anode (+), thể tích H₂ ≈ 2 lần O₂ |
| Vạch màu nạp mẫu | Gel 0,5–1,5%: xylene cyanol ≈ 4–5 kb, bromophenol blue ≈ 400–500 bp (Bio-Rad) |
| Quan hệ quãng đường | Quãng đường tỉ lệ nghịch với log(kích thước) |
| Thang 1 kb (GeneRuler SM0311) | 10000, 8000, **6000**, 5000, 4000, 3500, **3000**, 2500, 2000, 1500, **1000**, 750, 500, 250 bp (vạch đậm làm mốc) |

## 4. Máy chụp ảnh gel: Bio-Rad Gel Doc EZ

### Thông số
| Thông số | Giá trị |
| --- | --- |
| Kích thước | 43 × 28 × 38 cm, 7,3 kg (manual); bulletin 6021 ghi 27 × 44 × 38 cm, 9 kg (*hai nguồn lệch*) |
| Vùng chụp | 15 × 11,2 cm |
| Nguồn sáng | Đèn huỳnh quang UV-B đỉnh 302 nm dưới khay; các khay UV, trắng, xanh, stain-free |
| Camera | CCD > 4 MP, pixel 4,6 µm; ống kính cố định (không zoom, không chỉnh nét); 1 kính lọc phát xạ |
| Kết nối | Không có màn hình; USB-A, USB-B tới PC chạy Image Lab |
| Điện | 100–240 VAC, 40 W |

### Bộ phận để vẽ
- **Vỏ**: màu kem, dải xanh lá quanh chân đế; nắp trên giữ bằng 8 vít ở viền mặt sau.
- **Mặt trước**: cửa khay mẫu ở nửa dưới (kiểu bản lề *chưa xác minh*, có thể lật xuống); nút Run tròn xanh lá; 3 đèn LED (xanh báo nguồn, đỏ nhấp nháy khi cửa hở, khay chưa vào hết, hỏng bóng UV hoặc mất kết nối).
- **Khay mẫu**: mặt đen, viền màu theo loại (tím = UV, trắng, xanh dương, xanh lá = stain-free); có nam châm hút giữ; máy tự nhận loại khay; giá để khay đứng cạnh máy.
- **Cụm đèn UV** (dưới khay): các ống huỳnh quang trắng song song trên mạch in xanh lá, có đui hai đầu, tấm phản quang nhôm dập vân; chia 2 bank; giữ bằng 1 vít bên trái, trượt ra được (số bóng: ảnh cho thấy 4, bộ thay thế có 6, *chưa xác minh*).
- **Camera** trên đỉnh nhìn xuống, kính lọc trước ống kính.
- **Khoá an toàn**: cửa chưa đóng hẳn hoặc vỏ bị tháo thì đèn UV-B không bật.
- **Mặt sau**: USB-A, USB-B, công tắc nguồn, ổ AC, nhãn chứng nhận (vị trí từng cổng *chưa xác minh*).

### Huỳnh quang và an toàn UV
| Thuốc nhuộm | Kích thích | Phát xạ | Băng nhìn thấy |
| --- | --- | --- | --- |
| Ethidium bromide (gắn DNA) | ≈ 300 nm và ≈ 520 nm | ≈ 600–605 nm | Cam trên nền tối |
| SYBR Safe | ≈ 280 nm và ≈ 502 nm | ≈ 530 nm | Xanh lá |

- Một đèn UV-B 302 nm kích thích được cả hai thuốc vì cả hai đều hấp thụ ở vùng UV.
- Mắt thấy băng EtBr màu cam; camera CCD đơn sắc cho ảnh xám (băng trắng trên nền đen), màu giả do phần mềm.
- UV-B (280–315 nm) gây bỏng da và mắt, nên đèn được che kín và có khoá an toàn.

## Tiến độ vẽ (2026-10-16)
- [x] **Máy PCR** theo T100, mức Hero, xong ✅ 2026-10-16. Thư mục mã nguồn `figures/thermocycler/`; trong app bấm nút "Cận cảnh máy PCR" ở Khu máy móc, hoặc mở địa chỉ `#pcr`.
	- Hông phải và dải mặt trên bên phải block được cắt bỏ để thấy chồng block → 4 module Peltier → tản nhiệt có cánh → quạt; thêm bộ nguồn, bo mạch, cảm biến nhiệt của block, dây tiếp đất. Chồng block được vẽ lệch phải 28 mm so với máy thật để hông block lộ ra dưới mép nắp.
	- Chạy được chương trình đầy đủ (1:23:22 thật, chạy nhanh ×30 đến ×600): màn hình vẽ đường nhiệt, block đổi màu theo nhiệt độ, tản nhiệt nóng và quạt quay nhanh khi block hạ nhiệt, đếm số bản sao; nắp vỏ sò mở/đóng bằng bản lề.
	- Kiểm tra: audit hình học đạt (196 khối, 6 dây, 0 xuyên, 0 sai thứ tự), 0 nét lơ lửng ở cả hai giao diện, cả lúc nắp mở và đóng.
	- Phần bên trong (số module Peltier, vị trí quạt, bộ nguồn) vẽ theo thiết kế Peltier điển hình, không theo sơ đồ của hãng.
- [x] **Bộ điện di + nguồn** theo Mini-Sub Cell GT + PowerPac Basic, mức Figure, xong ✅ 2026-10-16. Thư mục `figures/electrophoresis/`; nút "Cận cảnh bộ điện di" hoặc địa chỉ `#gel`.
	- Bể nhựa trong (255 × 92 × 56 mm), khay gel, lược, điện cực platin, đệm TAE, chai TAE 250 mL, bộ nguồn và dây đỏ/đen cắm vào jack.
	- Mô hình chạy theo manual Mini-Sub (bảng 2.3, 2.4): bromophenol blue chạy khoảng 4,5 cm/h ở 75 V, tốc độ tỉ lệ với điện áp (50–150 V); quãng đường của băng tỉ lệ nghịch với log(kích thước); dừng khi vạch màu đi được 80 % gel. 8 làn: 2 làn thang GeneRuler 1 kb và 6 làn mẫu theo bài thực hành Sinh học phân tử (plasmid chưa cắt và đã cắt, PCR 1,25 kb, multiplex PCR).
	- Thao tác: Space chạy, ← → chỉnh điện áp, D đổi màn hình nguồn giữa V và phút; bọt khí H₂ ở cực âm nhiều gấp đôi O₂ ở cực dương.
	- Kiểm tra: audit hình học đạt (60 khối, 4 dây), 0 nét lơ lửng ở cả hai giao diện.
- [x] **Máy chụp ảnh gel** theo Gel Doc EZ, mức Figure, xong ✅ 2026-10-16. Thư mục `figures/geldoc/`; nút "Cận cảnh máy chụp gel" hoặc địa chỉ `#geldoc`.
	- Hông phải cắt bỏ để thấy khoang: khay UV với 4 ống UV-B 302 nm dưới cửa sổ cho tia UV đi qua, gel trên khay, camera CCD với kính lọc cam ở nóc, bo điều khiển ở vách sau, dây camera, dây đèn, cáp USB sang laptop.
	- Cửa lật xuống có khoá an toàn: cửa chưa đóng hẳn thì UV không bật, mở cửa giữa chừng thì UV tắt ngay; chốt nam châm hút cửa vào khi gần đóng.
	- Chuỗi Space: đóng cửa → bật UV (băng nhuộm ethidium bromide phát sáng cam, khoảng 605 nm) → chụp → ảnh xám (băng trắng trên nền đen) hiện trên laptop. Ảnh gel lấy từ cùng mô hình điện di, nên vị trí băng khớp với hình bộ điện di lúc chạy xong.
	- Kiểm tra: audit hình học đạt (78 khối, 3 dây), 0 nét lơ lửng ở cả hai giao diện, cả lúc cửa mở và đóng.
	- Phần bên trong (vị trí bo mạch, cách đi dây, số ống UV) vẽ theo cấu tạo máy soi UV điển hình, không theo sơ đồ của hãng.

### Gắn vào thí nghiệm của người dùng (2026-10-16)
- Ba hình đọc dữ liệu người dùng từ địa chỉ trang (`#run=<JSON>`), do app tạo sau mỗi thao tác máy trong protocol "PCR trọn vẹn" (→ [Bộ khung phòng thí nghiệm 3D](/projects/virtual-lab/04-bo-khung-phong-thi-nghiem-3d/)).
	- Máy PCR: đếm bản sao theo số bản khuôn và hiệu suất thật của ống mẫu.
	- Bộ điện di: vẽ đúng các làn đã nạp (ladder, ống mẫu, ống ĐC−), nguồn đặt 100 V như trong app, gel đã chạy xong thì dừng ở cuối lượt.
	- Máy chụp gel: vẽ lại băng trên gel và ảnh xám trên laptop theo đúng vị trí băng trong ảnh gel của app.
- Lõi `src/core/pcr-chain.js` dùng chung `model.mjs` của máy PCR và bộ điện di, nên con số trong thẻ kết quả khớp với hình.

## Chưa xác minh (cần đối chiếu ảnh sản phẩm trước khi vẽ)
- **T100**: vật liệu block, số module Peltier, ốc vít ngoài, chân cao su, số khe gió chính xác.
- **PowerPac Basic**: thứ tự phím và jack, vị trí công tắc nguồn.
- **Mini-Sub**: khoảng cách giữa hai điện cực (để quy V/cm).
- **Gel Doc EZ**: kích thước (hai nguồn lệch), số bóng UV, kiểu bản lề cửa, chữ cạnh 3 LED, màu và vị trí kính lọc, vị trí cổng mặt sau.

## Nguồn
- **T100**: Instruction Manual (cat. 186-1096), Tech Spec Bulletin 6060 Rev C, Brochure Bulletin 6065 (bản PDF gốc của Bio-Rad đăng lại trên cổng đấu thầu Moldova): https://storage.mtender.gov.md/get/48757ef1-7e35-4e92-a315-2d835c40ae89-1692782390801 · https://storage.mtender.gov.md/get/4eb4004c-6b60-47fc-ba2a-d37d13bd756a-1692782498381
- **So sánh máy PCR khác**: C1000 Touch Bulletin 6095 https://www.bio-rad.com/sites/default/files/2021-08/Bulletin_6095.pdf · MiniAmp spec sheet https://qa1-assets.thermofisher.cn/TFS-Assets/BID/Reference-Materials/miniamp-thermal-cyclers-specification-sheet.pdf
- **Quy trình PCR**: https://www.addgene.org/protocols/pcr/
- **Mini-Sub Cell GT**: manual 10016027 Rev C https://www.bio-rad.com/sites/default/files/webroot/web/pdf/lsr/literature/10016027C.pdf · Bulletin 6181 https://commerce.bio-rad.com/webroot/web/pdf/lsr/literature/Bulletin_6181.pdf
- **PowerPac Basic**: https://seas.upenn.edu/~belab/equipment/equipment_links/Power_Pac_Manual.pdf
- **Điện di**: https://www.addgene.org/protocols/gel-electrophoresis/ · https://pmc.ncbi.nlm.nih.gov/articles/PMC4846332 · https://knowledge.lonza.com/faq?id=659 · GeneRuler 1 kb https://assets.thermofisher.com/TFS-Assets/LSG/manuals/MAN0013004_GeneRuler_1kb_DNALadder_250ug_UG.pdf
- **Gel Doc EZ**: Instrument Guide v6.0 https://www.bio-rad.com/webroot/web/pdf/lsr/literature/10000076956.pdf · Bulletin 6021 https://www.bio-rad.com/webroot/web/pdf/lsr/literature/Bulletin_6021.pdf
- **Huỳnh quang, an toàn UV**: https://www.thermofisher.com/order/catalog/product/mx/en/15585011 · https://www.thermofisher.com/order/catalog/product/tw/en/S33102 · https://www.safety.rochester.edu/ih/guidelines/pdf/Ultraviolet_Light_Guidelines.pdf
