---
title: Phòng thí nghiệm giống phòng thật
type: note
tags:
  - project
  - virtual-lab
  - simulation
folder: Projects / Virtual_Lab
vaultPath: Projects/Virtual_Lab/12 - Phòng thí nghiệm giống phòng thật.md
date: '2026-10-17'
status: active
order: 12
project: virtual-lab
isIndex: false
description: >-
  Yêu cầu của chủ dự án (2026-10-17): "Tạo plan để biến dự án này giống hệt 1
  phòng thí nghiệm". Sau đó (cùng ngày): "Làm hết theo đề xuất".
---
Yêu cầu của chủ dự án (2026-10-17): "Tạo plan để biến dự án này giống hệt 1 phòng thí nghiệm". Sau đó (cùng ngày): "Làm hết theo đề xuất".

Kế hoạch rút gọn và tiêu chí "xong" nằm ở mục 8 của CLAUDE.md. Note này ghi chi tiết: app khác phòng thật ở đâu trước giai đoạn này, các quyết định, chuẩn thiết kế kèm số liệu và nguồn, mặt bằng, đồ vật đúng cỡ, thao tác, quy trình, tiến độ và việc còn lại.

## 1. App khác phòng thật ở đâu trước giai đoạn 7 (2026-10-17)
- **Hình ảnh**:
	- Kiểu phác thảo: khối có viền nét, tên app ghi "bản phác thảo".
	- Không bóng đổ, không phản chiếu môi trường, không tone mapping.
	- Thuỷ tinh là khối trong suốt đơn giản, không khúc xạ; chất lỏng không có mặt khum.
	- Vân bề mặt mới có ở mức sinh bằng mã (→ [note 10 mục 8](/projects/virtual-lab/10-thi-nghiem-giai-doan-5/)).
- **Không gian**:
	- Một phòng 44 × 28 m chứa mọi khu, lớn hơn nhiều so với một phòng thực hành thường gặp.
	- Tường trước chỉ cao 1,1 m để nhìn vào; không trần, không đèn trần, không cửa ra vào, không cửa sổ.
	- Chưa tách các phòng theo chức năng: phòng PCR trước và sau khuếch đại, phòng vi sinh, phòng rửa và hấp, kho hoá chất, phòng đệm thay đồ.
- **Tỉ lệ**: cốc, ống nghiệm, khay mổ vẽ to hơn thật khoảng 1,5 lần để nhìn rõ.
- **Đồ vật**:
	- 16 máy trong khu máy móc là mô hình low-poly; 27 hình chi tiết của máy chỉ mở thành hình SVG riêng.
	- 75 món có chú thích trong `data/apparatus.json`.
	- Thiếu đồ tiêu hao (đầu tip, ống 1,5 mL, găng, giấy lau) và hệ thống kỹ thuật (ổ điện, vòi khí, vòi nước cất, bồn rửa tay, móc áo).
- **Thao tác**: phần lớn bấm nút ở bảng bên phải. Rót theo thời gian giữ, nhỏ giọt, micropipet, mở nắp, cân bằng rotor chưa làm bằng tay trong 3D ([note 10](/projects/virtual-lab/10-thi-nghiem-giai-doan-5/) mục 3, 4, 5 chưa xong).
- **Quy trình**: chưa có thay đồ ở phòng đệm, sổ đặt máy, nhãn ống, dụng cụ bẩn phải rửa, hoá chất hết phải pha, dọn bàn cuối buổi.
- **Thời gian, âm thanh**: mỗi thí nghiệm tua nhanh theo cách riêng; chưa có âm thanh.

## 2. Quyết định (chủ dự án chọn theo đề xuất, 2026-10-17)
1. **Phòng mẫu**: phòng tổng hợp theo chuẩn thiết kế. Chủ dự án chưa gửi ảnh phòng thật nên chưa có ảnh tham chiếu; khi có ảnh thì chỉ chép số đo và cách bố trí, không chép ảnh vào repo (như giai đoạn 6).
2. **Tài nguyên ngoài**: cho phép tài nguyên giấy phép CC0, ghi nguồn từng file trong `assets/CREDITS.md`, tổng dung lượng `assets/` tối đa 8 MB. Hiện có một file: ảnh môi trường "Hospital Room 2" của Poly Haven (bản HDR 1K đổi sang PNG mã hoá RGBM, khoảng 1,1 MB). Vân bề mặt vẫn sinh bằng mã.
3. **Mức hình ảnh**: ba mức Thấp, Vừa, Cao cùng "Phác thảo" kiểu cũ; "Tự động" chọn theo máy lúc mở và hạ một mức khi chậm hơn 30 khung/giây.
4. **Thời gian**: chạy theo thời gian thật, có tua ×10, ×60 và nút "Chờ xong".
5. **Làm cái nào** (cách hiểu "làm hết theo đề xuất", ghi lại để chủ dự án sửa nếu muốn khác):
	- Làm ngay: âm thanh (tắt mặc định), tay ảo ở góc nhìn thứ nhất, người hướng dẫn bằng chữ theo protocol.
	- Để sau: nhiều người cùng phòng (cần máy chủ, gắn với nơi chạy bản web công khai); kính thực tế ảo WebXR (không có kính để kiểm tra).

## 3. Chuẩn thiết kế và số liệu đã dùng
Mọi ngưỡng nằm trong `data/facility.json` (khoá `rules`, nguồn ở `_sources`); `src/core/facility.js` kiểm tra mặt bằng theo các ngưỡng này và `tests/engine.html` chạy kiểm tra đó mỗi lần push.

| Quy tắc | Số dùng trong app | Nguồn |
|---|---|---|
| Chiều cao trần | ≥ 2,7 m (tối ưu 2,9 m); app dùng 2,9 m | NIH Design Requirements Manual Rev. 2.1 (2024), §4.4.3.4 |
| Cửa phòng thí nghiệm | Một cánh rộng ≥ 1,1 m; app dùng 1,1 m, cao 2,1 m | NIH DRM §4.2.2.2 |
| Hành lang chính | Thông thuỷ 1,5–1,8 m; app dùng 1,9 m tim tường (khoảng 1,7 m thông thuỷ) | NIH DRM §2.2.5 |
| Bàn đứng | Cao 914 mm (bàn ngồi 762 mm) | NIH DRM §4.5.3.1.D |
| Độ rọi trên mặt bàn | 750–1075 lux (ghi lại, chưa tính trong cảnh vì ánh sáng là minh hoạ) | NIH DRM |
| Vòi rửa mắt | Tới được trong 10 giây đi bộ, khoảng 55 ft; 16,8 m là số quy đổi của app; có chất ăn mòn thì cửa giữa đường là vật cản | ANSI/ISEA Z358.1-2014, Appendix B5 (bản tóm tắt của Guardian Equipment); NIH DRM §2.1.3.7.6 |
| Vòi rửa mắt ở bồn | Mọi bồn rửa trong phòng thí nghiệm có vòi rửa mắt | NIH DRM §4.5.3.5 |
| Bồn rửa tay | Mỗi phòng ướt có bồn rửa tay không chạm tay, gần cửa ra | WHO Laboratory Biosafety Manual, ấn bản 4 (2020), §3.3 |
| Tủ hút | Cách cửa và lối đi chính ≥ 4 ft (1,22 m) | University of Washington EH&S Design Standard, Laboratory Ventilation, §C.6 |
| Tủ an toàn sinh học | Cách tường đối diện ≥ 80 in (2,03 m); cách cửa phía sau ≥ 60 in (1,52 m), cửa bên cạnh ≥ 40 in | NIH DRM Appendix A; WHO LBM4 monograph Biological safety cabinets |
| Phòng PCR | Khu trước PCR và khu sau khuếch đại ở hai phòng riêng, đi một chiều, không quay lại trong ngày | WHO SEARO, Establishment of PCR laboratory in developing countries, ấn bản 2 (2016), chương 5 |
| Quy tắc chung BSL-2 | Áo, găng, kính khi làm việc; rửa tay trước khi rời phòng; không mặc áo ra ngoài; khử nhiễm mặt bàn sau khi làm; ghi nhãn mẫu | WHO LBM4 mục 3 "Core requirements" |

Chưa tra hoặc chưa dùng:
- **NFPA 45** (lượng hoá chất dễ cháy tối đa ngoài tủ): bản đầy đủ không đọc miễn phí được, chưa đưa số nào vào app.
- **EN 14175**: vị trí tủ hút dùng số của UW ở trên; vận tốc mặt cửa vẫn dùng số của hãng từ giai đoạn 2 (→ [07 - Các khu của phòng thí nghiệm](/projects/virtual-lab/07-cac-khu-cua-phong-thi-nghiem/)).
- **Tiêu chuẩn Việt Nam cho phòng thí nghiệm trường học**: *chưa xác định có tiêu chuẩn nào phù hợp*.

## 4. Mặt bằng đã dựng (`BUILDING` trong `src/scene/layout.js`)
Toà nhà 44 × 29,9 m, trần 2,9 m, tường ngoài dày 0,2 m, vách trong 0,12 m, 14 cửa đi (rộng 1,1 m, cao 2,1 m) và 9 cửa sổ (bậu 0,95 m, cao 1,35 m). Giữ nguyên toạ độ các khu cũ để không phải dựng lại mọi đồ vật và protocol.

| Phòng | Hộp (x, z, m) | Ghi chú |
|---|---|---|
| Phòng thí nghiệm chung (hoá học, sinh học phân tử trước PCR, giải phẫu, tủ lạnh, trồng trọt) | x −22 → 9,2; z −14 → 14 | Phòng ướt; bàn trung tâm trải qua cả khu hoá học và sinh học phân tử nên chưa tách được phòng hoá học riêng |
| Kho hoá chất | x −18,9 → −5; z −14 → −11,8 | Bao dãy tủ hoá chất dọc tường sau (giữ toạ độ tủ cũ), hai cửa; vòi tắm và rửa mắt trong kho; tủ hút vẫn ở phòng chung |
| Phòng nuôi sinh vật | x −22 → −8,6; z 11 → 14 | Tủ ấm ruồi, giá nuôi cá, bàn soi ruồi; một cửa; bồn rửa tay có vòi rửa mắt |
| Phòng đệm thay đồ | x −2,5 → 2,5; z 11 → 14 | Móc áo, hộp găng, giá kính, bồn rửa tay, thùng rác, bảng nội quy; vào phòng làm việc phải qua đây |
| Hành lang khu máy | x 9,2 → 22; z −2,5 → 2,5 | Thông với phòng chung tại x 9,2 |
| Phòng sau PCR, quang học | x 9,2 → 22; z −14 → −2,5 | Máy PCR, qPCR, điện di, máy chụp gel; đi một chiều từ khu trước PCR |
| Phòng rửa, hấp tiệt trùng | x 18 → 22; z −14 → −9 | Bồn rửa dụng cụ, giá phơi, tủ sấy, nồi hấp |
| Phòng máy phân tích | x 9,2 → 22; z 2,5 → 14 | HPLC, LC-MS/MS, quang phổ, đọc vi đĩa, đo DNA, ly tâm, FPLC |
| Phòng vi sinh BSL-2 | x 17 → 22; z 7 → 14 | Tủ an toàn sinh học, biển BSL-2, bồn rửa tay |
| Hành lang | x −22 → 22; z 14 → 15,9 | Sơ đồ thoát hiểm, biển lối thoát |

- Đồ cố định (`fixtures` trong `data/facility.json`, 21 nhóm): bồn rửa tay có vòi rửa mắt ở mọi phòng ướt, bồn rửa dụng cụ, vòi tắm khẩn cấp ở khu hoá chất, bộ xử lý tràn hoá chất, tủ sơ cứu, sơ đồ thoát hiểm, ổ điện, vòi khí đốt, chân không, khí nén, vòi nước cất, giá phơi, tủ sấy, đồ ở phòng đệm. Biển báo (9 nhóm): cấm ăn uống, nội quy áo blouse, biển khu trước PCR, biển GHS, nội quy sau PCR, nội quy BSL-2.
- Kết quả kiểm tra tự động: đạt cả 12 quy tắc ở mục 3 (sau khi thêm kho và phòng nuôi: vòi rửa mắt xa nhất 12,3 m theo đường đi, tủ hút cách cửa 4,3 m). Có kiểm thử ngược: trần 2,5 m và cửa 0,9 m; bỏ vòi tắm cạnh tủ hút và vòi rửa mắt ở bồn bàn trung tâm; đặt bộ điện di ở khu trước PCR; mỗi trường hợp phải bị quy tắc tương ứng bắt lỗi.
- Cách xem: nhìn từ trên cao thì trần ẩn và tường cắt thấp còn 1 m như nhà búp bê; nhìn chếch trong phòng thì chỉ cắt tường che chỗ đang nhìn; đứng ở tầm mắt thì tường đủ cao như thật. Bảng Di chuyển có va chạm tường, cửa tự mở khi đi tới.

## 5. Đồ vật đúng cỡ thật
- **Bỏ phóng to**: cốc, ống nghiệm, khay mổ, mẫu mổ vẽ đúng 1 : 1. Cần nhìn rõ thì dùng nút "Kính lúp" (phóng 3 lần quanh chỗ đang nhìn) hoặc đi lại gần.
- **Dụng cụ chứa** (`src/core/vessel.js`, mực chất lỏng tính từ thể tích theo bán kính lòng trong; vạch chia vẽ đúng chỗ):
	- Cốc có mỏ DURAN dạng thấp 50 mL (ISO 3819): Ø ngoài 42 × cao 60 mm (DWK 211061706).
	- Bình tam giác DURAN cổ hẹp 100 mL (ISO 1773): cao 105 mm, đáy Ø 64 mm, cổ Ø 22 mm; cổ cao 25 mm là minh hoạ.
	- Ống nghiệm PYREX 9820-16XX: Ø 16 × 150 mm.
	- Ống PCR 0,2 mL Greiner Bio-One 671201: dài 20,75 mm, Ø ngoài 7,09 mm, Ø trong 5,38 mm.
	- Ống Eppendorf Safe-Lock 1,5 mL: thân cao 38,9 mm, Ø 10,8 mm.
	- Cốc DURAN dạng thấp 100, 250, 600, 1000 mL: Ø ngoài × cao 50 × 70, 70 × 95, 90 × 125, 105 × 145 mm (DWK 211062402, 211063604, 211064806, 211065408); đặt trên kệ tủ dụng cụ.
	- Ống đong DURAN 10 mL đế lục giác (DWK 213960801, ISO 4788): Ø 14 × cao 137 mm; đế là minh hoạ.
	- Bình định mức DURAN 100 mL cấp A: cao 170 mm; bầu Ø 60 mm, cổ Ø 13 mm *chưa xác minh*; vạch 100 mL vẽ ở chân cổ (bình thật cao hơn).
	- Pipet bầu 10 mL BLAUBRAND (DIN EN ISO 648): dài 440 mm; pipet chia vạch 10 mL : 0,1 mL (DIN EN ISO 835): dài 360 mm; đường kính là minh hoạ.
	- Buret 25 mL : 0,05 mL BLAUBRAND khoá thẳng: dài khoảng 800 mm, vạch mỗi 1 mL; lòng Ø 8 mm và đoạn chia vạch 500 mm là minh hoạ (π · 4² · 500 mm³ ≈ 25 mL).
	- Lấy ống đong, bình định mức, pipet từ tủ dụng cụ thì chúng hiện trên bàn cạnh Cốc A.
- **Chai thuốc thử**: nhãn vẽ bằng canvas có công thức, nồng độ, hình GHS và từ cảnh báo đọc được khi lại gần.
- **Đồ tiêu hao** (`CONSUMABLES` trong `layout.js`, `src/scene/consumables.js`):
	- Hộp đầu tip Eppendorf epT.I.P.S. Box 2.0 cỡ 1: 141 × 111 × 73 mm.
	- Giá ống 1,5 mL Heathrow Scientific HS29025B: 225 × 67 × 28 mm, 5 × 16 lỗ.
	- Micropipet 20–200 µL theo IKA Pette vario: 30 × 248 × 63 mm, treo trên giá.
	- Đĩa petri Thermo Sterilin 101RTC: Ø 90 × 15,7 mm.
	- Hộp găng, cuộn giấy lau, bình tia: kích thước minh hoạ.
- **Khay mổ** Eisco BI0186QWX: 373 × 282 × 76 mm, lớp sáp dày 25,4 mm.
- **Mẫu mổ** (chiều dài thân, nguồn ghi trong `data/dissection.json`):
	- Giun đất *Metaphire* (= *Pheretima*) *posthuma* 64–126 mm (Bantaowong et al. 2011); app dùng 120 mm.
	- Tôm *Macrobrachium nipponense* 48–75 mm (luận văn ĐH Basrah 2017; FAO ghi 36 mm, có thể in nhầm); app dùng 70 mm.
	- Cá chép 31 cm TL (FishBase, chiều dài thường gặp).
	- Ếch *Hoplobatrachus rugulosus* SVL đực 90,2 mm, cái 106,5 mm (Thongproh et al. 2022); app dùng 100 mm.
	- Giun đũa khoảng 25 cm (SGK Sinh học 7, bài 13; tài liệu khác ghi 20–35 cm).
	- Ốc *Pila polita* cao 80–95 mm dạng lớn (applesnail.net); app dùng 90 mm.
	- Gián *Periplaneta americana* trung bình 4 cm (UF/IFAS EENY-141).
	- Chuột nhắt BALB/c dài mũi tới gốc đuôi 90–93 mm lúc 12 tuần (Mouse Phenome Database).
- **Máy 3D dựng từ hình chi tiết**: `tools/parts3d/dump.mjs` ghi lại từng khối mà `build.mjs` của hình vẽ ra (lăng trụ, khối tròn xoay, hộp, cầu, ống), `export.mjs` đổi sang toạ độ 3D và màu theo tên bộ phận, ghi ra `data/machines3d/<máy>.json` (27 máy, tổng 1,9 MB). `src/scene/figure-mesh.js` dựng và gộp theo vật liệu. Dùng ở mức Vừa và Cao; mức Thấp và Phác thảo giữ khối low-poly cũ. Mỗi máy có màn hình vẽ bằng canvas và nút nguồn: bấm màn hình để bật, tắt; máy tắt thì không chạy được; màn hình hiện trạng thái và thời gian còn lại, không logo.
	- Cả 27 hình đã có bản 3D. 16 máy ở Khu máy móc (autoclave, tủ an toàn sinh học, ly tâm, FPLC, điện di, máy chụp gel, HPLC, LC-MS/MS, kính hiển vi, NanoDrop, PCR, đọc vi đĩa, qPCR, tủ ấm lắc, quang phổ, vortex) và bộ SDS-PAGE nằm trong `MACHINES_3D`.
	- 10 máy ở các khu khác (cân phân tích, máy khuấy từ gia nhiệt, bể ổn nhiệt, tủ hút, tủ −80 °C, bình nitơ lỏng, buồng sinh trưởng, vòi tắm và rửa mắt, giá nuôi cá, kính lúp soi nổi) khai báo trong `FIGURE_SLOTS` của `layout.js`: nhóm dựng tay mang `userData.figureSlot`; ở mức Vừa và Cao, `upgradeSlots` trong `room.js` ẩn khối dựng tay và đặt bản 3D từ hình vào đúng chỗ, giữ các phần có hoạt cảnh (`userData.keep`: kính trượt tủ hút, cửa tủ −80 °C, nắp bể ổn nhiệt, mặt đế máy khuấy, kệ mẫu).
	- Tủ −80 °C và bình nitơ lỏng đổi theo kích thước model thật (tủ có khoang máy bên dưới). Phần tô nhạt trong hình (bể kính, cửa kính) thành kính trong 3D.
	- Hình SVG cắt mở hông máy để nhìn vào trong; bản 3D che lại các chỗ cắt này (quang phổ, qPCR, autoclave, ly tâm phải thêm khối che riêng). Laptop, dây và bộ nguồn rời đi kèm máy chụp gel, HPLC, máy đọc vi đĩa, FPLC không xuất sang 3D; LC-MS/MS chỉ giữ máy khối phổ, bỏ hệ LC và bơm chân không đặt hai bên.

## 6. Thao tác bằng tay, quy trình, thời gian
- **Bảng "Thao tác tay"** (`src/ui/hand-panel.js`, lõi `src/core/handling.js`; bảng nút cũ vẫn giữ cho bàn phím và trình đọc màn hình):
	- **Rót**: chọn "Rót bằng tay" ở dụng cụ, kéo chai thả lên cốc, giữ nút "Giữ để rót" bao lâu thì rót bấy nhiêu; chai nghiêng 0,4 s rồi chảy khoảng 4 mL/s, lệch ±25 % mỗi lần (minh hoạ, không có số đo); người dùng đọc vạch trên cốc để biết đã rót bao nhiêu.
	- **Nhỏ giọt**: mỗi giọt 0,05 mL ±10 % theo ống nhỏ giọt chuẩn USP <1101> (giọt nước 45–55 mg). **Khuấy** bằng đũa thuỷ tinh.
	- **Micropipet** P20, P200, P1000: chỉnh thể tích trong dải, gắn tip, hút ở nấc 1 hoặc nấc 2, nhả tới nấc 1 hoặc nấc 2, thải tip. Sai số theo ISO 8655-2:2002 Bảng 1. Ấn quá nấc khi hút thì thừa khoảng 5 %, nhả chưa tới nấc 2 thì đọng khoảng 3 % (minh hoạ). Dùng lại tip cho chất khác thì nhiễm chéo vào chai thuốc thử, các lần rót sau từ chai đó mang theo chất cũ.
	- **Rotor máy ly tâm** 24 lỗ: bấm lỗ để xếp ống; lệch tâm thì máy báo lỗi theo ngưỡng của `figures/centrifuge/model.mjs`.
	- Mọi thao tác tay ghi vào nhật ký phiên với lượng thật, nên mở lại phiên ra đúng kết quả cũ.
- **Quy trình** (`src/core/labops.js`, theo WHO LBM4 mục 3 và WHO SEARO 2016 chương 5):
	- Vào phòng làm việc thiếu áo, găng, kính thì cảnh báo; ra hành lang còn đeo găng, chưa rửa tay, còn mặc áo thì cảnh báo; đã vào phòng sau PCR mà quay lại khu trước PCR thì cảnh báo đi ngược chiều.
	- Chai thuốc thử 100 mL có lượng thật: rót hết thì phải pha thêm; sắp hết thì nhắc.
	- Dụng cụ đổ bỏ thành dụng cụ bẩn, phải rửa trước khi dùng lại; dùng khi còn bẩn thì cảnh báo nhiễm chéo.
	- Nhãn mẫu hiện trên ống, cốc trong cảnh; nhật ký thiết bị ghi mỗi lần chạy máy (xuất CSV như sổ thí nghiệm).
	- "Kết thúc buổi" kiểm 7 việc: tắt máy đã dùng, đổ bỏ, rửa dụng cụ, lau bàn, đậy nắp chai, tháo găng, rửa tay. Tắt máy cuối buổi là nội quy phòng (minh hoạ, không có văn bản chuẩn).
	- **Nắp chai**: lấy hoá chất thì nắp mở, đặt ngửa trên bàn; bấm nắp hoặc nút "Đậy nắp" để đậy; ra khỏi phòng còn chai mở thì cảnh báo.
	- **Hạn dùng**: mỗi chai có tuổi và hạn dùng (`ops` trong `data/facility.json`, minh hoạ, phòng tự đặt); chai NaOH 0,1 M cố ý quá hạn để người học kiểm nhãn trước khi chuẩn độ; pha thêm thì tuổi về 0.
	- **Sổ đặt lịch máy** dùng chung (HPLC, LC-MS/MS, qPCR, FPLC, đọc vi đĩa, chụp gel, SDS-PAGE) theo đồng hồ chung, khung 30 phút từ giờ hiện tại tới 17:00; lịch của nhóm khác có sẵn (minh hoạ); trùng giờ thì không đặt được; chạy máy chưa đặt hoặc trong giờ của nhóm khác thì cảnh báo.
	- **Hộp mẫu** của người học trong tủ −20 °C: chỉ cất được mẫu đã ghi nhãn; cất xong dụng cụ thành bẩn.
	- Sự cố tràn hoá chất (`emergency.js`, thao tác `em-spill`, hàng "Tràn hoá chất" ở bảng khu An toàn): HCl, NaOH hoặc ethanol đổ ra bàn; chọn bộ xử lý tràn, giấy lau hay dội nước; chọn sai thì thẻ kết quả cảnh báo vì sao sai.
- **Đồng hồ chung** (`src/core/labclock.js`): giờ trong ngày bắt đầu 8:00 (minh hoạ), chạy theo thời gian thật, tua ×10, ×60, "Chờ xong" nhảy tới lúc việc gần nhất xong; nhiều máy chạy song song. Máy ly tâm (theo số phút đặt), máy PCR (theo chương trình, khoảng 1 giờ 23 phút với chương trình mẫu), điện di (theo số phút của lõi), nồi hấp (cả chu trình gia nhiệt, giữ, xả, khoảng 84 phút với 121 °C 20 phút), qPCR (khoảng 52 phút), HPLC và LC-MS/MS (theo thời gian chạy của phương pháp) hoãn thẻ kết quả tới khi chạy xong; lõi trả `seconds` thì `main.js` tự dùng; màn hình máy hiện thời gian còn lại. Khi mở lại phiên hoặc chạy tự động thì cho kết quả ngay (thêm `?clock=real` vào địa chỉ để thử đồng hồ khi chạy tự động).
- **Âm thanh** (`src/ui/sound.js`, nút "Âm thanh", tắt mặc định): sinh bằng Web Audio, không có file âm thanh: quạt tủ hút, máy nén tủ lạnh và tủ đông, máy ly tâm và máy PCR khi đang chạy, tiếng rót, hai tiếng bíp khi máy chạy xong; nhỏ dần theo khoảng cách. Cường độ, cao độ là minh hoạ.
- **Tay ảo**: hai bàn tay ở góc nhìn thứ nhất khi đứng ở tầm mắt; đeo găng thì màu găng nitrile, bỏ găng thì màu da; tay phải nghiêng khi đang rót. Kích thước bàn tay người lớn là ước lượng (minh hoạ).
- **Người hướng dẫn** (nút "Hướng dẫn", bật mặc định): nhãn "Bước n: …" và vòng cam nhấp nháy quanh dụng cụ của bước protocol đang chờ; bước thao tác máy thì nhãn đặt trên máy; còn lại đặt ở khu của protocol. Giảm chuyển động thì vòng không nhấp nháy.

## 7. Kiểm tra
- `tests/engine.html`: 629 kiểm thử lõi `ALL PASS` lúc xong giai đoạn 7; 674 sau các việc bổ sung (2026-10-19) (thêm cho va chạm tường, dụng cụ chứa, thao tác tay, micropipet, quy trình, tràn hoá chất, đồng hồ, mặt bằng theo chuẩn). `tests/csp-check.mjs` và `tests/panel-params.mjs` đạt.
- `tests/machines3d.html`: xem từng máy 3D dựng từ hình chi tiết.
- Ảnh chụp kiểm tra (Chromium không GPU, SwiftShader): sáng, tối, 390 px không cuộn ngang, giảm chuyển động; vòng hướng dẫn ở Cốc A; tay ảo có găng và tay trần; đồng hồ ×60 và "Chờ xong" với máy PCR.
- Kết quả thí nghiệm không đổi khi đổi mức hình ảnh: lõi không đọc gì từ cảnh 3D.

## 8. Việc cần làm
- [x] 0. Chủ dự án chọn các quyết định ở mục 2 ⏫ ✅ 2026-10-17
- [x] 1. Tra chuẩn ở mục 3, ghi số kèm nguồn; vẽ mặt bằng 1 : 1; danh mục đồ cố định trong `data/facility.json` ⏫ ✅ 2026-10-17
- [x] 2. Nền hình ảnh chân thực: tone mapping, môi trường phản chiếu từ HDRI, bóng đổ, thuỷ tinh khúc xạ, ba mức chất lượng ⏫ ✅ 2026-10-17
- [x] 3. Phòng thật: tường, trần, đèn, cửa, cửa sổ, hệ thống kỹ thuật, biển báo; va chạm tường trong bảng Di chuyển ✅ 2026-10-17
- [x] 4. Đồ vật đúng tỉ lệ: mô hình 3D cho 16 máy, dụng cụ thuỷ tinh cỡ thật, đồ tiêu hao, nhãn GHS; bỏ phóng to ⏫ ✅ 2026-10-17
- [x] 5. Thao tác bằng tay: rót, nhỏ giọt, khuấy, micropipet, nút và màn hình máy, rotor ⏫ ✅ 2026-10-17
- [x] 6. Quy trình như phòng thật: phòng đệm, nhật ký thiết bị, nhãn mẫu, kho có lượng, dụng cụ bẩn, cuối buổi, tràn hoá chất ✅ 2026-10-17
- [x] 7. Đồng hồ chung theo thời gian thật, âm thanh ✅ 2026-10-17
- [x] 8. Người trong phòng: tay ảo, người hướng dẫn ✅ 2026-10-17
- [x] 9. Kiểm tra mặt bằng tự động ✅ 2026-10-17
- Còn lại:
	- [ ] Ảnh phòng thật để so cùng góc (cần chủ dự án gửi ảnh, số đo) và cho sinh viên, giáo viên dùng thử
	- [x] Chuyển 11 hình máy còn lại sang 3D (mục 5) ✅ 2026-10-19
	- [x] Mở và đậy nắp chai; hạn dùng của hoá chất; sổ đặt lịch máy; hộp mẫu của từng người trong tủ lạnh ✅ 2026-10-19
	- [x] Nồi hấp, qPCR, HPLC, LC-MS/MS chờ theo đồng hồ chung ✅ 2026-10-19
	- [ ] Đồng hồ chung cho các thí nghiệm dài ngày (đậu, ruồi, phôi cá, vi sinh vẫn tua theo cách riêng)
	- [x] Bình định mức, pipet, buret, ống đong, cốc 100–1000 mL cỡ thật trong cảnh ✅ 2026-10-19
	- [ ] Đo khung hình/giây trên điện thoại thật ở mức Thấp, đo thời gian tải trang
	- [x] Tách kho hoá chất và phòng nuôi sinh vật khỏi phòng chung ✅ 2026-10-19
	- [ ] Tách phòng hoá học riêng (bàn trung tâm đang trải qua cả khu hoá học và sinh học phân tử; phải dời bàn và các protocol theo toạ độ)
	- [ ] Nhiều người cùng phòng (cần máy chủ), WebXR (cần kính)

## 9. Tiến độ
- 2026-10-17: lập kế hoạch.
- 2026-10-17: chủ dự án chọn "Làm hết theo đề xuất". Xong mục 0–9 trong 6 commit:
	- Hình ảnh chân thực, vỏ toà nhà, đồ cố định, va chạm tường.
	- Đồ vật đúng cỡ thật, máy 3D dựng từ hình chi tiết.
	- Thao tác bằng tay, màn hình và nút nguồn của máy.
	- Quy trình như phòng thật.
	- Đồng hồ chung, âm thanh, tay ảo, hướng dẫn trong cảnh.
	- Ghi lại (note này, README, CLAUDE.md, MOC, bản xem trước).
- 2026-10-19 (chủ dự án: "Thực hiện dự án liên tục"), 5 commit:
	- Thanh công cụ gọn ở điện thoại (nút "Tuỳ chọn" gom các nút hiển thị); đồng hồ chung cho nồi hấp, qPCR, HPLC, LC-MS/MS.
	- 11 hình máy còn lại sang 3D, cả 27 hình có bản 3D.
	- Thuỷ tinh cỡ thật còn thiếu (cốc 100–1000 mL, ống đong, bình định mức, pipet, buret).
	- Nắp chai, hạn dùng, sổ đặt lịch máy, hộp mẫu.
	- Kho hoá chất và phòng nuôi sinh vật thành phòng riêng.
