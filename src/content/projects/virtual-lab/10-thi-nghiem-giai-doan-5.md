---
title: Thí nghiệm giai đoạn 5
type: note
tags:
  - project
  - virtual-lab
  - simulation
folder: Projects / Virtual_Lab
vaultPath: Projects/Virtual_Lab/10 - Thí nghiệm giai đoạn 5.md
url: /projects/virtual-lab/thi-nghiem-giai-doan-5/
updated: '2026-10-17'
date: '2026-10-16'
status: active
order: 10
project: virtual-lab
isIndex: false
description: >-
  Kế hoạch ở mục 8 của CLAUDE.md. Yêu cầu của chủ dự án (2026-10-16): làm thí
  nghiệm được ngay trong phòng ảo, pha hoá chất thì thấy đổi màu, đốt thì thấy
  bay hơi; máy móc, dụng cụ tương tác như thật; có chú thích tên và t
---
Kế hoạch ở mục 8 của CLAUDE.md. Yêu cầu của chủ dự án (2026-10-16): làm thí nghiệm được ngay trong phòng ảo, pha hoá chất thì thấy đổi màu, đốt thì thấy bay hơi; máy móc, dụng cụ tương tác như thật; có chú thích tên và tác dụng của dụng cụ.

- **Hiện trạng trước giai đoạn này**:
	- Lõi đã tính đúng màu, kết tủa, khí, nhiệt.
	- Cảnh 3D chỉ đổi màu tức thì ở trạng thái cuối, camera ở xa nên đồ rất nhỏ.
	- Phần lớn thao tác nằm ở bảng nút; máy 3D chưa bấm được; chưa có chú thích dụng cụ.
- Hiệu ứng chỉ là cách vẽ; màu, có kết tủa hay khí, nhiệt độ, thời gian sôi đều do lõi tính. Tốc độ lắng, số hạt, độ dài hiệu ứng là số *minh hoạ*.

## 0. Chú thích dụng cụ
- **Dữ liệu** `data/apparatus.json`: tên, tác dụng, cách dùng, an toàn, model thật cho dụng cụ, máy, tủ trong cảnh.
	- Quy tắc dùng đèn cồn, ống nghiệm, kẹp ống nghiệm, ống nhỏ giọt lấy theo SGK Hoá học 8 (*chưa xác minh số trang*).
	- Rửa mắt ít nhất 15 phút theo ANSI Z358.1; rác sinh học và vật sắc nhọn theo WHO Laboratory Biosafety Manual.
	- Số liệu của máy lấy lại từ `figures/*/model.mjs` đã có nguồn (ví dụ cân 220 g, đọc 0,1 mg).
- **Cách dùng trong app** (`src/scene/info.js`):
	- Rê chuột lên vật: thẻ nhỏ hiện tên và tác dụng.
	- Giữ lâu (chuột hoặc ngón tay) hoặc Shift + bấm: thẻ đầy đủ có cách dùng, an toàn, model thật, nút "Cận cảnh".
	- Nút **Tên dụng cụ**: bật nhãn tên cho mọi vật đang thấy.
	- Chai hoá chất lấy tên, ghi chú và nhãn GHS từ `substances.json`, `safety.json`.

## 1. Hiện tượng diễn ra theo thời gian
- `src/scene/fx.js`: dòng rót từ miệng chai, giọt, mây màu lan trong dung dịch, kết tủa vẩn đục rồi lắng thành lớp cặn, bọt khí và lớp bọt trên mặt, khí có màu, hơi nước, khói, ngọn lửa, chớp sáng.
- **Bàn hoá học sắp gọn**, camera gần. Khi rót hoặc đun, camera tự lại gần vật chứa (nút **Tự nhìn gần** để tắt). Khung dọc (điện thoại) dùng vùng nhìn hẹp hơn.
- Lõi trả thêm danh sách khí và nhiệt độ sau khi rót, để cảnh vẽ đúng bọt và hơi.
- **Kiểm tra bằng ảnh**:
	- CuSO₄ + NaOH: dòng rót, bông kết tủa, dung dịch đục xanh nhạt, kết tủa lắng thành lớp cặn, phần trên trong dần.
	- Na₂CO₃ + HCl: sủi bọt mạnh, lớp bọt trắng trên mặt rồi hết.

## 2. Đun và đốt bằng đèn cồn
- **Dụng cụ trong cảnh** (`src/scene/heat-station.js`): đèn cồn có nắp và bấc, kiềng ba chân có lưới tản nhiệt, giá với 3 ống nghiệm, kẹp sắt và băng Mg, dây đốt, que đóm. Mỗi vật có chú thích.
- **Thao tác**:
	- Bấm đèn để châm hoặc đậy nắp; kéo ống nghiệm hoặc cốc thả lên đèn, kiềng để đun; bấm kẹp sắt để đốt Mg; bấm que đóm để thử khí.
	- Bảng **Đèn cồn** trong nửa protocol làm được mọi thao tác trên, kể cả các cách làm sai.
- **Chất mới**: chất rắn NaHCO₃, CuSO₄·5H₂O, NH₄Cl, I₂, KMnO₄, băng Mg (lấy bằng thìa xúc khoảng 0,5 g, sai số khoảng ±30 %, *minh hoạ*); dung dịch LiCl, CaCl₂, SrCl₂ để thử màu ngọn lửa.
- **Cất giữ**: thêm tủ **Chất oxy hoá** cho KMnO₄. Kiểm thử an toàn phát hiện KMnO₄ để cạnh KI, KSCN (chất khử) là tương kỵ.
- **Mô hình nhiệt** (`src/core/flame.js`, `data/flame.json`):
	- Công suất đèn: 0,25 g ethanol/phút × 29,7 kJ/g ≈ 124 W.
		- Tốc độ cháy lấy giữa khoảng 0,16–0,33 g/phút của đèn 50 mL cháy 2–4 giờ (Mini-Science).
		- Nhiệt đốt cháy ethanol −1366,8 kJ/mol (NIST WebBook).
	- Phần nhiệt vào vật chứa (*minh hoạ*): ống nghiệm trong lửa 30 %, cốc trên lưới 35 %. Bài đo của Cambridge 9701 cho khoảng 50 % với lon kim loại sát lửa (0,53 g ethanol làm 100 cm³ nước nóng 20,1 °C).
	- Tới 100 °C thì nhiệt dư làm nước bay hơi (2257 J/g); cạn khô thì ống nóng tiếp, mất nhiệt cả bằng bức xạ (*minh hoạ*), cân bằng khoảng 380 °C.
	- Nhiệt phân, thăng hoa bậc nhất, tốc độ gấp đôi mỗi 20 K trên nhiệt độ bắt đầu (*minh hoạ*). Nhiệt độ bắt đầu theo PubChem (*chưa xác minh từng trang*):
		- Cu(OH)₂ → CuO: khoảng 80 °C trong huyền phù.
		- NaHCO₃: khoảng 100 °C. CuSO₄·5H₂O mất nước: khoảng 110 °C (thực tế hai nấc 100–110 và 250 °C, gộp một bước).
		- KMnO₄: khoảng 200–240 °C. NH₄Cl: khoảng 338 °C. I₂: hơi tím rõ khi đun nhẹ.
	- Hoà tan: CuSO₄ khan gặp nước toả nhiệt (−73,1 kJ/mol), CuSO₄·5H₂O tan thu nhiệt (+6,0 kJ/mol), tính từ bảng NBS 1982.
	- Màu ngọn lửa theo LibreTexts (Flame Tests): Na vàng cam, K tím hồng, Li đỏ, Ca đỏ cam, Sr đỏ, Ba lục nhạt, Cu xanh lục lam. Vạch Na 589,0/589,6 nm, K 766,5/769,9 và 404,4 nm, Li 670,8 nm (NIST ASD).
- **Kết quả kiểm thử lõi**:
	- 3 mL nước trong ống nghiệm: 30 giây chưa sôi, 60 giây sôi ở 100 °C, bay hơi một phần.
	- 3 mL NaCl 1 M: cạn sau khoảng 3,5–4 phút, còn khoảng 175 mg muối trắng.
	- NaHCO₃: sinh CO₂, que đóm tắt; KMnO₄: sinh O₂, que đóm còn tàn đỏ bùng cháy.
	- CuSO₄·5H₂O: thành bột trắng; để nguội, thêm nước lại xanh lam và ấm lên.
	- NH₄Cl: đọng lớp trắng ở phần trên ống. Cu(OH)₂ đun sôi thành CuO đen.
- **Làm sai ra kết quả sai**:
	- Đun ngay ở đáy không hơ đều: dung dịch sôi bùng, trào khoảng 30 % (*minh hoạ*).
	- Cốc trên kiềng không có lưới: cảnh báo cốc dễ nứt.
	- Thổi tắt đèn, châm đèn từ đèn khác, cầm Mg bằng tay: bước sai, có giải thích.
	- Dây đốt không làm sạch: màu Na lấn màu K. Cho nước vào ống đang nóng trên 150 °C: cảnh báo nứt ống.
- **8 protocol mới**:
	- Cô cạn nước muối; nhiệt phân NaHCO₃; điều chế O₂ từ KMnO₄; CuSO₄·5H₂O mất nước và hút nước lại.
	- Thử màu ngọn lửa; đốt Mg; NH₄Cl phân li và kết hợp lại; đun Cu(OH)₂ thành CuO.
- Tổng 74 protocol, 465 kiểm thử lõi.

## 6. Bản đồ vệ tinh quần đảo Cát Bà
Yêu cầu của chủ dự án (2026-10-16): tìm bản đồ vệ tinh để tạo map quần đảo Cát Bà. Khu `#catba` trong app, phía tây khu thực địa.
- **Nguồn đã xét**:
	- Dùng: **Sentinel-2 L2A** (ảnh màu thật TCI 10 m và lớp phân loại cảnh SCL 20 m; ghi công "Contains modified Copernicus Sentinel data 2026") và **Copernicus DEM GLO-30** (độ cao bề mặt 1″, khoảng 30 m; © DLR e.V. 2010-2014 and © Airbus Defence and Space GmbH 2014-2018 provided under COPERNICUS by the European Union and ESA). Cả hai là COG trên AWS, tìm cảnh qua Earth Search STAC.
	- Không dùng: ảnh Google, Bing (giấy phép không cho dùng lại). OpenStreetMap chỉ dùng tra toạ độ vài địa danh qua Nominatim (ODbL, có ghi công); Overpass và Geofabrik bị proxy của phiên chặn.
- **Chọn cảnh**: Cát Bà nằm vắt qua hai ô MGRS 48QYJ và 48QYH (mép ô ở khoảng 20,79° B). Cảnh 21/09/2026 trong nhất cả ô (0 % mây) nhưng có đám mây che Phù Long, Gia Luận; tính lại mây riêng trong khung Cát Bà bằng lớp SCL thì cảnh **14/01/2026** chỉ khoảng 0,01–0,03 %, nên dùng cảnh này. Ảnh chụp lúc triều thấp, bãi bùn phía tây bắc lộ ra.
- **Xử lý** (`tools/catba/fetch.py`): chỉ đọc đúng các ô ảnh nằm trong khung bằng HTTP Range (khoảng 22 MB thay vì vài trăm MB mỗi cảnh); cắt khung UTM 48N 699 960–725 040 E, 2 289 000–2 310 420 N (25,1 × 21,4 km); ảnh nền thu về 12,5 m, tăng sáng nhẹ (gamma 0,8); độ cao lấy mẫu song tuyến về lưới 50 m, ghép hai ô DEM ở kinh tuyến 107° cho liền; mặt nạ nước từ SCL lớp 6.
- **Kiểm chứng**:
	- Công thức UTM (Snyder 1987) cho góc ô 48QYH khớp bbox mà STAC tính bằng PROJ (sai dưới 2 m).
	- Độ cao lớn nhất trong khung khoảng 303 m, phù hợp mô tả "độ cao < 500 m, phần lớn 50–200 m" trong [báo cáo tổng quan](/blog/tong-quan-thuc-tap-thien-nhien-cat-ba-2023/).
	- So với độ cao GPS ghi trong báo cáo thực tập: điểm gặp quạ báo cáo 20–30 m, bản đồ khoảng 31 m; mẫu nấm Trametes báo cáo 80 m, bản đồ khoảng 107 m; Động Trung Trang báo cáo 50 m, bản đồ khoảng 64 m. DEM là mô hình bề mặt đo bằng radar nên gồm một phần tán rừng; sai số đứng của DEM < 4 m (LE90).
	- Điểm GPS ở Động Trung Trang trong [bài 02](/blog/dong-vat-co-xuong-song-tren-can-chim-thu/) cách cửa hang trên OpenStreetMap khoảng 540 m.
- **Điểm trên bản đồ** (`data/catba.json`):
	- Theo GPS của báo cáo: Động Trung Trang (20°47′23″ B, 107°00′09″ Đ), điểm gặp quạ (20°47′40″ B, 106°59′26″ Đ), mẫu nấm Trametes (20°47′44″ B, 106°59′50″ Đ, → [bài 08](/blog/thuc-vat-bac-thap-nam-tao-mau-nam-trametes-sp/)).
	- Theo OpenStreetMap (*chưa xác minh* đúng chỗ làm bài): rừng ngập mặn Phù Long (nhà văn hoá xã), bãi triều Xuân Đám (bãi biển Xuân Đám), Ao Ếch, đỉnh Ngự Lâm, trung tâm VQG (bảng thông tin rừng Kim Giao), bến phà Gia Luận. Thị trấn Cát Bà theo Wikipedia.
- **Trong app**: sa bàn 1 : 1000 (25 × 21 m trong cảnh), độ cao phóng đại 3 lần, thước 5 km, hướng bắc, dòng ghi công. Bấm đinh ghim xem toạ độ, độ cao, bài thực tập; bấm mặt bản đồ đọc toạ độ và độ cao một điểm bất kỳ; đo đường chim bay kèm mặt cắt địa hình (VQG – Ao Ếch khoảng 3,1 km, cao nhất khoảng 223 m); đổi lớp ảnh vệ tinh hoặc tô màu độ cao. Protocol `geo-catba` 7 bước.
- **Giới hạn**: biển phẳng (chưa có độ sâu); chưa vẽ đường mòn thật nên chỉ đo đường chim bay; vị trí Phù Long, Xuân Đám, Ao Ếch là điểm đại diện.

## 7. Khu giải phẫu động vật
Yêu cầu của chủ dự án (2026-10-16): mở rộng bàn thí nghiệm để làm khu giải phẫu động vật. Khu `#dissect`: bàn nối dài mặt inox bên phải bàn trung tâm.
- **Mẫu và bài** (`data/dissection.json`):
	- Giun đất (*Pheretima* sp.), SGK Sinh học 7 bài 16: đặt nằm sấp, ghim đầu và đuôi, cắt nông dọc mặt lưng, đổ nước ngập, phanh da; hầu, diều, dạ dày cơ, ruột, ruột tịt, hạch não, chuỗi hạch thần kinh bụng (→ [ống tiêu hoá](/blog/tieu-hoa-va-ho-hap-o-dong-vat/); [ảnh mổ giun đất thật](/blog/nganh-giun-dot-annelida-giun-dat/)).
	- Tôm sông (*Macrobrachium* sp.), bài 23: găm 4 đinh ghim, đổ nước ngập, nâng tấm lưng; mang, dạ dày, tuyến gan, ruột, hạch não, vòng thần kinh hầu, chuỗi thần kinh ngực và bụng.
	- Cá chép (*Cyprinus carpio*), bài 32: cá nằm nghiêng, cắt nông từ trước lỗ hậu môn tới sau mang; mang, tim, gan, túi mật, ruột, tuyến sinh dục, bóng hơi, thận (→ [tim cá 2 ngăn](/blog/tuan-hoan-va-can-bang-noi-moi/)). Cá chép không có dạ dày thật (họ Cyprinidae; Wilson & Castro 2010), app ghi rõ chỗ SGK gọi là dạ dày. (→ [Báo cáo mổ cá chép thật](/blog/giai-phau-ca-chep-va-ca-ro-phi/))
	- Ếch đồng (*Hoplobatrachus rugulosus*), bài 36: nằm ngửa, ghim bốn chi, cắt da theo đường giữa, cắt lớp cơ lệch sang một bên để không đứt tĩnh mạch bụng; tim, phổi, gan, dạ dày, ruột non, ruột thẳng, bóng đái, thận, tuyến sinh dục (→ [tim lưỡng cư 3 ngăn](/blog/tuan-hoan-va-can-bang-noi-moi/); [báo cáo mổ ếch thật](/blog/giai-phau-ech-dong/)).
- **Nguồn**: danh sách cơ quan và cách đặt mẫu theo lời giải SGK trên vietjack.com (*chưa đối chiếu nguyên văn sách*); cách cắt theo Biology Corner (giun, ếch), Ward's Science (giun: không sâu quá khoảng 1,6 mm), hướng dẫn mổ ếch của ĐH Ankara, bài mổ cá của West Linn-Wilsonville. Vị trí và kích thước nội quan là *minh hoạ* theo hình SGK.
- **Làm sai ra kết quả sai**: giun hoặc tôm nằm ngửa thì đường cắt làm đứt chuỗi thần kinh bụng; cắt sâu làm rách ruột (đất tràn ra) hoặc vỡ túi mật (mật nhuộm xanh); cắt lớp cơ bụng ếch đúng đường giữa thì máu tĩnh mạch bụng che nội quan; ếch nằm sấp không mở được bụng; cá không nằm nghiêng chỉ mở được một phần; giun chưa ngập nước hoặc không dùng kính lúp thì không thấy phần nhỏ; bỏ mẫu vào thùng rác thường là bước sai.
- **Trong app**: bấm lọ mẫu để lấy ra khay sáp; bấm kéo, ghim, kẹp, dao, bình tia nước, kính lúp, túi rác sinh học; bấm vào từng nội quan để quan sát. Thẻ kết quả có hình chú thích đánh số (dấu ✓ cho cơ quan đã thấy rõ). Tuyến sinh dục là tinh hoàn hay buồng trứng tuỳ mẫu, ngẫu nhiên theo seed. 4 protocol `dis-*`.
- **Đạo đức**: mẫu trong bài thực hành là mẫu đã chết, lấy từ nơi cung cấp mẫu; mổ ảo là cách thay thế (Replacement) theo nguyên tắc 3R (Russell & Burch 1959).
- Tổng 79 protocol, 493 kiểm thử lõi.

## 8. Vân bề mặt và bảng Di chuyển (2026-10-17)
Yêu cầu của chủ dự án (2026-10-17): "Tôi muốn các mô hình có texture hơn. Làm thêm cái console để có thể di chuyển tự do hơn."
- **Vân bề mặt** (`src/scene/textures.js`):
	- Sinh bằng mã, không dùng file ảnh: mỗi loại vân là một ảnh xám lặp liền mép (nhiễu nhiều tầng, tế bào Voronoi, hạt, vảy, thớ).
	- Chiếu ba mặt theo toạ độ thế giới (triplanar) nên vân đều trên mọi khối, không cần UV. Ảnh xám vừa đổi sắc quanh màu gốc (giữ đúng màu ở cả giao diện sáng và tối), vừa làm mặt gồ ghề (bump theo đạo hàm màn hình), vừa đổi độ nhám.
	- Phòng: sàn vinyl ô 0,5 m có ron, tường sơn, tủ phủ melamine, mặt bàn epoxy có hạt, thép xước, vỏ máy sơn tĩnh điện, đáy sáp khay mổ có lỗ kim; ngoài trời: đất, sỏi, đá vôi, vỏ cây, lá.
	- Mẫu mổ: cùng tên vân với hình SVG (phế nang, tiểu thuỳ gan, mô tuyến, thớ cơ, vảy cá, lông chuột, trứng, mỡ, tế bào vàng của giun đất); da ngoài theo loài (da ếch sần, vỏ kitin của gián và tôm, cuticle vân ngang của giun đũa, vỏ ốc có vân tăng trưởng).
	- Vân là cách vẽ, không mang số liệu; kích thước ô vân chọn theo mắt (*minh hoạ*), mẫu mổ vẽ to khoảng 1,5 lần thật nên vân cũng to theo.
	- Vân sinh dần lúc trình duyệt rảnh để không làm chậm lúc mở app; nút "Vân bề mặt" tắt được (máy yếu hoặc muốn xem kiểu phác thảo).
- **Bảng Di chuyển** (`src/ui/nav-console.js`, toán ở `src/core/walk.js`, 10 kiểm thử lõi):
	- Cần điều khiển: kéo núm để đi tới, lùi, bước ngang theo hướng nhìn trên mặt sàn; bốn mũi tên giữ để đi.
	- Nút giữ: quay trái, phải; ngước lên, cúi xuống; bay lên, hạ xuống; lại gần, ra xa điểm nhìn (tới gần nhất thì đi xuyên qua). "Tầm mắt" hạ camera xuống 1,6 m nhìn ngang hơi cúi; "Nhanh" gấp 3.
	- Phím: W A S D hoặc mũi tên, Q E quay, T G ngước cúi, R F lên xuống, + − gần xa, giữ Shift đi nhanh. Không nhận phím khi đang gõ chữ hoặc ở bảng protocol.
	- Bản đồ nhỏ nhìn từ trên xuống: hình quạt là camera và hướng nhìn; bấm chấm để tới khu, bấm chỗ khác để dời tới đó. Khi camera sang thực địa hoặc sa bàn Cát Bà thì bản đồ tự mở rộng ra cả khu.
	- Tốc độ đi theo khoảng cách tới điểm nhìn (nhìn toàn cảnh thì đi nhanh, soi gần thì chậm). Camera không xuống dưới sàn, không ra khỏi vùng các khu. Bộ xoay chuột cho hạ tới tầm nhìn ngang.
	- Màn rộng: bảng mở sẵn ở góc dưới bên phải; ở khu trồng trọt (có bảng khí hậu) thì sang góc trái. Màn hẹp (điện thoại): bảng thu gọn, bản đồ ẩn, bấm "Di chuyển" để mở. Giảm chuyển động: "Tầm mắt" và bấm bản đồ đặt camera ngay, không lướt.
- Tổng 96 protocol, 584 kiểm thử lõi.

## Tiến độ
- [x] 0. Chú thích dụng cụ ✅ 2026-10-16
- [x] 1. Hiệu ứng hiện tượng, bàn hoá học cận cảnh ✅ 2026-10-16
- [x] 2. Đun và đốt bằng đèn cồn ✅ 2026-10-16
- [x] 3. Thao tác trực tiếp: giữ để rót (giữ lâu rót nhiều), ống nhỏ giọt đếm giọt, đũa khuấy (làm ở giai đoạn 7, [note 12](/projects/virtual-lab/phong-thi-nghiem-giong-phong-that/) mục 6; giữ ống trên lửa theo thời gian giữ vẫn làm bằng nút) ⏫ ✅ 2026-10-17
- [x] 4. Máy tương tác trong 3D: nút nguồn, màn hình hiện trạng thái và thời gian còn lại từ lõi (làm ở giai đoạn 7, [note 12](/projects/virtual-lab/phong-thi-nghiem-giong-phong-that/) mục 5; nắp máy chưa mở bằng tay) ⏫ ✅ 2026-10-17
- [x] 5. Bàn sinh học cận cảnh: micropipet (làm ở giai đoạn 7, [note 12](/projects/virtual-lab/phong-thi-nghiem-giong-phong-that/) mục 6) ✅ 2026-10-17
- [x] 6. Bản đồ vệ tinh quần đảo Cát Bà ✅ 2026-10-16
- [x] 7. Khu giải phẫu động vật ✅ 2026-10-16
- [x] 8. Vân bề mặt cho mô hình và bảng Di chuyển tự do ✅ 2026-10-17
