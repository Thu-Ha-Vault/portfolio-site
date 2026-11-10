---
title: Virtual Lab (Phòng thí nghiệm ảo)
type: MOC
tags:
  - project
  - virtual-lab
  - simulation
folder: Projects / Virtual_Lab
vaultPath: Projects/Virtual_Lab/_MOC - Virtual_Lab.md
date: '2026-10-15'
status: active
deadline: '2026-10-18'
project: virtual-lab
isIndex: true
featured: false
links: {}
description: >-
  Môi trường thí nghiệm ảo cho các thí nghiệm hoá – sinh: từ lai giống và nuôi
  sinh vật (đậu Hà Lan của Mendel, ruồi giấm của Morgan, phôi cá ngựa vằn), phản
  ứng giữa các hoá chất với dụng cụ thí nghiệm, đến các máy như PC
---
> Môi trường thí nghiệm ảo cho các thí nghiệm hoá – sinh: từ lai giống và nuôi sinh vật (đậu Hà Lan của Mendel, ruồi giấm của Morgan, phôi cá ngựa vằn), phản ứng giữa các hoá chất với dụng cụ thí nghiệm, đến các máy như PCR, HPLC.

## Mục tiêu & sản phẩm
- **Mục tiêu**: làm lại được các thí nghiệm hoá – sinh kinh điển và thí nghiệm trong phòng lab trên máy tính, với kết quả giống thí nghiệm thật (có sai số, có ngẫu nhiên, làm sai thì ra kết quả sai).
- **Sản phẩm**: ứng dụng web 3D cho mọi người (học sinh, sinh viên, giáo viên, nhà nghiên cứu), gồm 3 nhóm thí nghiệm: sinh vật sống, hoá học, thiết bị. Sau bản web sẽ làm phần mềm cài trên máy (→ [Quyết định](/projects/virtual-lab/01-y-tuong-va-pham-vi/)).
- **Mã nguồn**: `/Users/pc/Desktop/Sky/Virtual_Lab/`, sao lưu ở repo GitHub riêng tư https://github.com/lucynguyen777/Virtual_Lab (→ [Bộ khung phòng thí nghiệm 3D](/projects/virtual-lab/04-bo-khung-phong-thi-nghiem-3d/)).
- **Deadline bản đầu tiên**: Chủ nhật 2026-10-18.

## Việc cần làm
- [x] Chốt người dùng, nền tảng và mức độ chân thực ✅ 2026-10-15
- [x] Bộ khung 3D: các khu của phòng thí nghiệm, khu trồng trọt, màn hình chia đôi, kéo thả trên bàn ✅ 2026-10-15
- [x] Đặt deadline cho bản đầu tiên (MVP) ✅ 2026-10-16
- [x] Tạo repo GitHub riêng tư để sao lưu mã nguồn ✅ 2026-10-16
- [x] Hoàn thành bản đầu tiên ⏫ 📅 2026-10-18 ✅ 2026-10-16
- [x] MVP: mô phỏng lai đậu Hà Lan (Mendel) và lõi di truyền ✅ 2026-10-16
- [x] Mở rộng lõi di truyền: ruồi giấm (Morgan), liên kết giới tính, hoán vị gen ✅ 2026-10-16
- [x] Bàn thí nghiệm hoá học: dụng cụ, hoá chất, bảng phản ứng, chuẩn độ ✅ 2026-10-16
- [x] Tra tài liệu và chọn model cho máy đợt 1 (PCR, điện di, chụp gel) ✅ 2026-10-16
- [x] Hình chi tiết máy PCR theo Bio-Rad T100 ✅ 2026-10-16
- [x] Hình chi tiết bộ điện di + nguồn, máy chụp ảnh gel ✅ 2026-10-16
- [x] Thiết bị chạy được trong app: PCR, điện di, chụp ảnh gel ✅ 2026-10-16
- [x] Tra tài liệu, vẽ hình chi tiết máy đợt 2 (→ [Tài liệu tham khảo máy móc đợt 2](/projects/virtual-lab/06-tai-lieu-tham-khao-may-moc-dot-2/)) ✅ 2026-10-16
- [x] Thiết bị chạy được trong app: máy quang phổ UV-Vis, HPLC, máy ly tâm, kính hiển vi ✅ 2026-10-16
- [x] Máy đợt 3: qPCR, máy đọc vi đĩa, máy đo nồng độ DNA, vortex và ly tâm mini, nồi hấp tiệt trùng, LC-MS/MS, tủ an toàn sinh học (→ [Tài liệu tham khảo máy móc đợt 2](/projects/virtual-lab/06-tai-lieu-tham-khao-may-moc-dot-2/)) ✅ 2026-10-16
- [x] Nuôi phôi cá ngựa vằn (thử độc tính OECD 236) ✅ 2026-10-16
- [x] Phần mềm cài trên máy: đóng gói macOS, Windows, Linux trên GitHub Actions (chữ ký ad-hoc) ✅ 2026-10-16
- Giai đoạn 2: xây các khu của phòng thí nghiệm (kế hoạch chi tiết ở mục 8 của CLAUDE.md)
	- [x] Khung chung: kho đồ (`inventory.js`), mở tủ và kéo đồ ra bàn trong cảnh 3D ⏫ ✅ 2026-10-16
	- [x] Tủ lạnh, tủ đông, tủ −80 °C, nitơ lỏng: bảo quản thuốc thử, hoạt tính enzyme nối vào PCR ⏫ ✅ 2026-10-16
	- [x] Tủ hoá chất và tủ hút khí độc: phản ứng sinh khí độc, vận tốc mặt cửa, cất tương kỵ, nhãn GHS ✅ 2026-10-16
	- [x] Bàn hoá học và tủ dụng cụ: nhiệt phản ứng, đun nóng, độ tan, cân bằng, cân phân tích ✅ 2026-10-16
	- [x] Khu nuôi sinh vật: tủ ấm và lọ ruồi theo thí nghiệm, kính lúp soi nổi, giá nuôi cá ngựa vằn ✅ 2026-10-16
	- [x] Khu trồng trọt: ngưỡng khí hậu có nguồn, tưới nước, cây đúng loài, bao hoa ✅ 2026-10-16
	- [x] Khu máy móc trong cảnh 3D: mô hình đúng kích thước, kéo ống tới máy ✅ 2026-10-16
	- [x] An toàn chung của phòng: vòi rửa mắt, bình chữa cháy, thùng rác sinh học, đồ bảo hộ ✅ 2026-10-16
- Giai đoạn 3: tái hiện các bài thực hành của chủ dự án và mở rộng (kế hoạch ở mục 8 của CLAUDE.md, ghi chép ở [08 - Thí nghiệm giai đoạn 3](/projects/virtual-lab/08-thi-nghiem-giai-doan-3/))
	- [x] Nền dùng chung: lưu và mở lại phiên, xuất báo cáo thực hành, CI chạy kiểm thử lõi, giá ống nghiệm và bể ổn nhiệt ⏫ ✅ 2026-10-16
	- [x] Hoá sinh định tính: phản ứng nhận biết đường, protein, lipid, vitamin C (bài 01–07) ✅ 2026-10-16
	- [x] Enzyme: động học Michaelis–Menten, nhiệt độ, pH, chất hoạt hoá và ức chế (amylase, lipase) ✅ 2026-10-16
	- [x] Vi sinh và biến nạp plasmid: môi trường LB, cấy trong tủ an toàn sinh học, sốc nhiệt, đếm CFU ✅ 2026-10-16
	- [x] Sinh học phân tử và protein: tách plasmid, cắt giới hạn, SDS-PAGE, 2D-PAGE, nhận diện protein bằng khối phổ ✅ 2026-10-16
	- [x] Phôi chim: ấp trứng, giai đoạn Hamburger–Hamilton ✅ 2026-10-16
	- [x] Tiến hoá và di truyền quần thể: chọn lọc trên chim sẻ Darwin, Hardy–Weinberg trong lồng ruồi ✅ 2026-10-16
	- [x] Thực địa Cát Bà: ô tiêu chuẩn, chỉ số đa dạng Shannon và Simpson ✅ 2026-10-16
	- [x] Công cụ cho giáo viên: trình soạn protocol, chế độ kiểm tra ✅ 2026-10-16
	- [x] Phát hành: đóng gói ba hệ điều hành trên GitHub Actions (macOS chữ ký ad-hoc theo chủ dự án chọn), workflow bản web công khai trên Cloudflare Pages ✅ 2026-10-16
- Giai đoạn 4: hoàn thiện bài thực hành còn lại, phân tích dữ liệu và phát hành an toàn (kế hoạch ở mục 8 của CLAUDE.md, ghi chép ở [09 - Thí nghiệm giai đoạn 4](/projects/virtual-lab/09-thi-nghiem-giai-doan-4/))
	- [x] Phát hành an toàn: tắt fuse Electron theo skill `rea-audit`, CSP, Three.js trong `vendor/` cho cả bản web, chạy không cần mạng, dùng được bằng bàn phím ⏫ ✅ 2026-10-16
	- [ ] Bản web công khai: thêm secret Cloudflare cho repo và gắn subdomain (chủ dự án làm, hướng dẫn trong README) ⏫
	- [x] Tinh sạch enzyme: lọc gel, trao đổi cation, RP-HPLC theo bài báo nguồn, bảng tinh sạch khớp bài protease nọc nhện; hình hệ FPLC ✅ 2026-10-16
	- [x] Exosome: lọc gel Sepharose CL-4B 20 phân đoạn, SDS-PAGE phân đoạn; phân tích ảnh gel 2D (spot, thể tích chuẩn hoá) ✅ 2026-10-16
	- [x] Phân tích dữ liệu: `stats.js` dùng chung, ANOVA, tương quan, hồi quy như Excel, bảng phân tích trong app, xuất script R ✅ 2026-10-16
	- [x] Thực địa mở rộng: điều tra chim, thú, cá, lưỡng cư, côn trùng, giáp xác; khoá định loại Ardisia và Trametes ✅ 2026-10-16
	- [x] Di truyền mở rộng: lai phân tích, tương tác gen, trội không hoàn toàn, gen gây chết, lai ba điểm ở ruồi ✅ 2026-10-16
	- [x] Cảnh 3D hoàn thiện: máy low-poly từ `model.mjs`, kéo thả ở mọi góc nhìn, hoạt cảnh mở tủ ✅ 2026-10-16
	- [x] Lớp học không cần máy chủ: gói bài tập, nộp file phiên, giáo viên chấm và xem lại ✅ 2026-10-16
	- [ ] Giao diện tiếng Anh (chủ dự án quyết trước)
- Giai đoạn 5: phòng thí nghiệm làm như thật (kế hoạch ở mục 8 của CLAUDE.md, ghi chép ở [10 - Thí nghiệm giai đoạn 5](/projects/virtual-lab/10-thi-nghiem-giai-doan-5/))
	- [x] Chú thích tên, tác dụng, cách dùng của mọi dụng cụ, máy, tủ (rê chuột, giữ lâu, nút Tên dụng cụ) ⏫ ✅ 2026-10-16
	- [x] Hiện tượng diễn ra theo thời gian: dòng rót, đổi màu lan dần, kết tủa vẩn đục rồi lắng, sủi bọt; bàn hoá học cận cảnh ⏫ ✅ 2026-10-16
	- [x] Đun và đốt bằng đèn cồn: sôi, bay hơi, cô cạn, nhiệt phân, màu ngọn lửa, đốt Mg, que đóm ⏫ ✅ 2026-10-16
	- [x] Thao tác trực tiếp: giữ để rót, nhỏ giọt, khuấy (gộp vào giai đoạn 7, [note 12](/projects/virtual-lab/12-phong-thi-nghiem-giong-phong-that/) mục 6) ⏫ ✅ 2026-10-17
	- [x] Máy tương tác trong 3D: nút nguồn, màn hình hiện trạng thái (gộp vào giai đoạn 7, [note 12](/projects/virtual-lab/12-phong-thi-nghiem-giong-phong-that/) mục 5) ⏫ ✅ 2026-10-17
	- [x] Bàn sinh học cận cảnh: micropipet (gộp vào giai đoạn 7, [note 12](/projects/virtual-lab/12-phong-thi-nghiem-giong-phong-that/) mục 6) ✅ 2026-10-17
	- [x] Bản đồ vệ tinh quần đảo Cát Bà: ảnh Sentinel-2, độ cao Copernicus DEM, điểm khảo sát của đợt thực tập 2023 ✅ 2026-10-16
	- [x] Khu giải phẫu động vật: mổ giun đất, tôm sông, cá chép, ếch đồng theo SGK Sinh học 7 ✅ 2026-10-16
	- [x] Vân bề mặt cho mô hình 3D (phòng, máy, mẫu mổ) và bảng Di chuyển tự do (cần điều khiển, phím W A S D, bản đồ nhỏ) ✅ 2026-10-17
- Giai đoạn 6: dùng tài liệu Drive của chủ dự án (kế hoạch ở mục 8 của CLAUDE.md, ghi chép ở [11 - Tài liệu Drive cho giai đoạn 6](/projects/virtual-lab/11-tai-lieu-drive-cho-giai-doan-6/))
	- [x] Kiểm kê hai thư mục Drive Sinh học, Hoá học; chép lại ảnh thực hành thành mô tả ✅ 2026-10-16
	- [x] Tách DNA thực vật bằng CTAB theo báo cáo bài 5–6, ảnh gel có vệt đứt gãy và RNA ✅ 2026-10-16
	- [x] Khu giải phẫu theo ảnh thực hành: giun đũa, ốc, gián; ếch theo báo cáo mổ ếch; chuột nhắt trắng; cá chép ✅ 2026-10-16
	- [x] Hình giải phẫu chuẩn cho 8 loài theo tài liệu có nguồn, dùng chung cho hình SVG và mẫu 3D ✅ 2026-10-17
	- [x] Tiêu bản hiển vi ảo: lát cắt rễ, thân, lá; giảm phân, nguyên phân; tảo silic ✅ 2026-10-16
	- [x] Thực tập hoá đại cương Bài 1, 2: kết tủa, lọc, rửa, pha dung dịch chuẩn, chuẩn độ ✅ 2026-10-16
	- [x] Phương pháp lấy mẫu (Cơ sở sinh thái học Bài 2) ✅ 2026-10-16
	- [x] Hoá đại cương Bài 9: chuyển dịch cân bằng Le Chatelier ✅ 2026-10-16
	- [x] Hoá đại cương Bài 4, 5A, 7: định tính anion, nhiệt lượng kế, tốc độ phản ứng ✅ 2026-10-19
	- [x] Muối Mohr, HPLC paracetamol + caffeine ✅ 2026-10-19
	- [ ] Hoá đại cương Bài 3, 5B, 6, 8, 10
	- [x] Vi sinh: nhuộm Gram, đếm khuẩn lạc, MPN coliform, buồng đếm ✅ 2026-10-16
	- [x] Vi sinh còn lại: kháng sinh đồ, lên men, nhuộm bào tử ✅ 2026-10-19
	- [x] Hồi quy phi tuyến: Michaelis–Menten, logistic 4 tham số (bộ Puromycin) ✅ 2026-10-16
	- [x] PCR mở rộng (master mix, touch-down, RAPD, nóng chảy DNA), nối liều – đáp ứng phôi cá với logistic 4 tham số, tiêu bản vảy hành và niêm mạc miệng ✅ 2026-10-19
	- [ ] Hoá sinh định lượng (Lowry, Kjeldahl); ô nhiễm môi trường lao động; bộ xương
- Giai đoạn 7: phòng thí nghiệm giống hệt phòng thật (kế hoạch ở mục 8 của CLAUDE.md, ghi chép ở [12 - Phòng thí nghiệm giống phòng thật](/projects/virtual-lab/12-phong-thi-nghiem-giong-phong-that/))
	- [x] Chủ dự án chọn: phòng mẫu, tài nguyên CC0, mức hình ảnh, thời gian thật, âm thanh và VR ("Làm hết theo đề xuất") ⏫ ✅ 2026-10-17
	- [x] Tra chuẩn thiết kế phòng thí nghiệm, vẽ mặt bằng 1 : 1 nhiều phòng, danh mục đồ cố định ⏫ ✅ 2026-10-17
	- [x] Hình ảnh chân thực: tone mapping, bóng đổ, phản chiếu, thuỷ tinh khúc xạ, ba mức chất lượng ⏫ ✅ 2026-10-17
	- [x] Phòng thật: tường, trần, đèn, cửa, cửa sổ, ổ điện, vòi khí, bồn rửa, biển báo ✅ 2026-10-17
	- [x] Đồ vật đúng tỉ lệ 1 : 1: mô hình 3D cho 16 máy, dụng cụ thuỷ tinh, đồ tiêu hao ⏫ ✅ 2026-10-17
	- [x] Mô hình 3D cho 11 máy còn lại; bình định mức, pipet, buret cỡ thật ✅ 2026-10-19
	- [x] Thao tác bằng tay trong 3D: rót, nhỏ giọt, khuấy, micropipet, rotor, nút và màn hình máy ⏫ ✅ 2026-10-17
	- [x] Mở và đậy nắp chai ✅ 2026-10-19
	- [x] Quy trình như phòng thật: phòng đệm, nhật ký thiết bị, nhãn mẫu, kho, dụng cụ bẩn, cuối buổi, tràn hoá chất ✅ 2026-10-17
	- [x] Sổ đặt lịch máy, hạn dùng hoá chất, hộp mẫu từng người trong tủ lạnh ✅ 2026-10-19
	- [x] Kho hoá chất và phòng nuôi sinh vật thành phòng riêng ✅ 2026-10-19
	- [ ] Tách phòng hoá học riêng (phải dời bàn trung tâm)
	- [x] Đồng hồ chung theo thời gian thật, âm thanh; tay ảo, người hướng dẫn ✅ 2026-10-17
	- [ ] Đồng hồ chung cho thí nghiệm dài ngày (đậu, ruồi, phôi cá, vi sinh)
	- [x] Kiểm tra mặt bằng tự động theo chuẩn ✅ 2026-10-17
	- [ ] Ảnh phòng thật so cùng góc, người dùng thử, đo khung hình/giây trên điện thoại

## Map of Content
- [01 - Ý tưởng và phạm vi](/projects/virtual-lab/01-y-tuong-va-pham-vi/)
- [02 - Danh mục thí nghiệm ảo](/projects/virtual-lab/02-danh-muc-thi-nghiem-ao/)
- [03 - Kiến trúc mô phỏng](/projects/virtual-lab/03-kien-truc-mo-phong/)
- [04 - Bộ khung phòng thí nghiệm 3D](/projects/virtual-lab/04-bo-khung-phong-thi-nghiem-3d/)
- [05 - Tài liệu tham khảo máy móc](/projects/virtual-lab/05-tai-lieu-tham-khao-may-moc/)
- [06 - Tài liệu tham khảo máy móc đợt 2](/projects/virtual-lab/06-tai-lieu-tham-khao-may-moc-dot-2/)
- [07 - Các khu của phòng thí nghiệm](/projects/virtual-lab/07-cac-khu-cua-phong-thi-nghiem/)
- [08 - Thí nghiệm giai đoạn 3](/projects/virtual-lab/08-thi-nghiem-giai-doan-3/)
- [09 - Thí nghiệm giai đoạn 4](/projects/virtual-lab/09-thi-nghiem-giai-doan-4/)
- [10 - Thí nghiệm giai đoạn 5](/projects/virtual-lab/10-thi-nghiem-giai-doan-5/)
- [11 - Tài liệu Drive cho giai đoạn 6](/projects/virtual-lab/11-tai-lieu-drive-cho-giai-doan-6/)
- [12 - Phòng thí nghiệm giống phòng thật](/projects/virtual-lab/12-phong-thi-nghiem-giong-phong-that/)
- CLAUDE.md (bối cảnh, yêu cầu và kế hoạch cho Claude)
