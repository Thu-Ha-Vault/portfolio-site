---
title: 'Virtual Lab: a 3D biology laboratory'
type: article
tags:
  - project
  - virtual-lab
  - simulation
folder: Projects / Virtual_Lab
vaultPath: Projects/Virtual_Lab/00 - Giới thiệu Virtual Lab.md
url: /projects/virtual-lab/
updated: '2026-11-18'
date: '2026-11-18'
status: active
order: 0
project: virtual-lab
isIndex: true
featured: false
summary_vi: >-
  Phòng thí nghiệm sinh học và hoá học 3D chạy ngay trên trình duyệt: kéo chai
  hoá chất vào cốc, pha ống PCR, chạy điện di, lai đậu Hà Lan như Mendel, mổ ếch
  ảo. 108 protocol, kết quả có sai số và làm sai thì ra kết quả sai. Mở và dùng
  thử miễn phí.
summary_en: >-
  A 3D biology and chemistry lab that runs in the browser: pour reagents into
  beakers, set up PCR tubes, run a gel, cross peas like Mendel, dissect a
  virtual frog. 108 protocols with realistic error, where mistakes give wrong
  results. Free to open and try.
links:
  app: /virtual-lab/
appName: Virtual Lab
description: >-
  Mở Virtual Lab trên trình duyệt máy tính hoặc điện thoại. Không cần cài đặt,
  không cần tài khoản. Lần đầu mở mất vài giây để dựng phòng; sau đó app mở lại
  được cả khi mất mạng.
cover:
  src: /project-covers/virtual-lab.webp
  alt: Mô phỏng máy luân nhiệt (thermocycler) trong Virtual Lab
  alt_en: The thermocycler simulation in the Virtual Lab
---
<div class="callout callout-tip">
<p class="callout-title">Dùng thử ngay</p>

**[Mở Virtual Lab](https://thuha.ceovanta.com/virtual-lab/)** trên trình duyệt máy tính hoặc điện thoại. Không cần cài đặt, không cần tài khoản. Lần đầu mở mất vài giây để dựng phòng; sau đó app mở lại được cả khi mất mạng.

</div>

Virtual Lab là một phòng thí nghiệm hoá – sinh ảo chạy trên trình duyệt. Người dùng đi lại trong một toà nhà phòng thí nghiệm 3D, kéo chai hoá chất thả vào cốc, pha ống PCR, chạy máy, lai đậu Hà Lan như Mendel hay mổ ếch ảo. Nửa bên phải màn hình là protocol: mỗi bước làm xong hiện ngay hiện tượng, phương trình phản ứng, tác dụng của từng chất và kết quả đo.

![Toàn cảnh toà nhà phòng thí nghiệm ảo, bên phải là protocol đang chờ](/vault-assets/virtual-lab-01-tong-quan-89faf374.webp)
*Toàn cảnh: toà nhà 44 × 30 m chia thành các phòng và khu, nhìn từ trên cao như nhà búp bê. Bên phải là protocol đang mở.*

## Ý tưởng
- Làm lại được trên máy tính các thí nghiệm hoá – sinh kinh điển và các bài thực hành trong phòng lab: từ đậu Hà Lan của Mendel, ruồi giấm của Morgan, phôi cá ngựa vằn, đến phản ứng giữa các hoá chất và các máy như PCR, HPLC. (→ Ý tưởng và phạm vi)
- **Kết quả phải giống thí nghiệm thật**: có sai số và ngẫu nhiên (chạy lại bằng cùng seed thì ra đúng kết quả cũ), và **làm sai thì ra kết quả sai**: quên Taq polymerase thì gel không có băng, quên khử nhị thì hạt thu được là hạt tự thụ, cho kháng sinh lúc thạch còn quá nóng thì đĩa mọc đầy khuẩn.
- Mọi con số hiển thị lấy từ mô hình có nguồn (datasheet của hãng, giáo trình, bài báo). Số nào chỉ để minh hoạ thì ghi rõ là minh hoạ.
- Dành cho học sinh, sinh viên, giáo viên và người tự học không có phòng lab thật.

## Những gì đã chạy được
- **Toà nhà đúng tỉ lệ 1 : 1** theo chuẩn thiết kế phòng thí nghiệm (NIH, WHO): phòng chung, phòng đệm thay đồ, phòng sau PCR, phòng vi sinh BSL-2, phòng máy phân tích, phòng rửa và hấp, kho hoá chất, phòng nuôi sinh vật; cửa tự mở, vòi rửa mắt, biển báo, sơ đồ thoát hiểm.
- **108 protocol** có hướng dẫn từng bước, kiểm tra bằng 681 kiểm thử tự động của lõi mô phỏng.
- **27 máy** vẽ theo model thật (không có logo): máy PCR, bộ điện di, máy chụp gel, quang phổ UV-Vis, HPLC, LC-MS/MS, qPCR, máy ly tâm, kính hiển vi, tủ an toàn sinh học, nồi hấp, tủ −80 °C, cân phân tích… Mỗi máy có hình cận cảnh chi tiết và bản 3D trong phòng.
- **Hoá học định lượng**: mỗi cốc biết mình chứa bao nhiêu mol, bao nhiêu mL, nhiệt độ bao nhiêu; phản ứng theo tỉ lượng, pH, kết tủa, toả nhiệt, tốc độ theo nhiệt độ; sai số theo từng dụng cụ (ống đong, pipet, buret).
- **Hiện tượng diễn ra theo thời gian**: dòng rót, màu lan dần, kết tủa vẩn đục rồi lắng, sủi bọt, khí có màu, đun sôi và cô cạn bằng đèn cồn, màu ngọn lửa.
- **Thao tác bằng tay**: giữ để rót, nhỏ giọt, khuấy, micropipet P20/P200/P1000 (chỉnh thể tích, gắn tip, nấc 1 và nấc 2), xếp ống cân bằng rotor máy ly tâm.
- **Quy trình như phòng thật**: phải mặc áo, đeo găng, kính trước khi vào; đi một chiều từ khu trước PCR sang phòng sau PCR; dụng cụ bẩn phải rửa; cuối buổi kiểm lại bàn. Đồng hồ chung chạy theo thời gian thật, tua được ×10, ×60.
- **Chú thích dụng cụ**: rê chuột lên một vật để xem tên và tác dụng, giữ lâu để xem cách dùng và lưu ý an toàn.
- **Cho giáo viên**: soạn protocol mới, chế độ kiểm tra có chấm điểm, xuất bài tập cho cả lớp (cùng seed) và chấm lại bài nộp. Phiên làm việc tự lưu; xuất được báo cáo thực hành dạng Markdown kèm bảng CSV.

## Các khu trong phòng
- **Bàn thí nghiệm trung tâm**: nửa hoá học (cốc, bình tam giác, buret, máy khuấy từ gia nhiệt, cân phân tích, đèn cồn) và nửa sinh học phân tử (ống PCR, micropipet, giá ống).

![Bàn hoá học với dãy chai hoá chất, ba cốc, bình tam giác, giá ống nghiệm, cân phân tích và máy khuấy từ](/vault-assets/virtual-lab-02-ban-hoa-hoc-ac5b3b25.webp)
*Bàn hoá học: dãy chai hoá chất, Cốc A/B/C, bình tam giác, giá ống nghiệm, cân phân tích và máy khuấy từ gia nhiệt. Nhãn cam chỉ bước protocol đang chờ.*

![Bàn sinh học phân tử với các chai thuốc thử PCR, ống mẫu, ống đối chứng âm và bể ổn nhiệt](/vault-assets/virtual-lab-03-ban-sinh-hoc-phan-tu-3346fb27.webp)
*Bàn sinh học phân tử: thuốc thử PCR (buffer 10X, MgCl₂, dNTP, mồi, Taq polymerase, DNA khuôn), ống mẫu và ống đối chứng âm (ĐC−), bể ổn nhiệt.*

- **Tủ hoá chất và tủ hút khí độc**: chai xếp theo nhóm không tương kỵ; tủ hút báo động khi vận tốc mặt cửa quá thấp.
- **Tủ lạnh, tủ đông, tủ −80 °C, bình nitơ lỏng**: thuốc thử để ngoài lâu hay đông – rã nhiều lần thì giảm hoạt tính, băng PCR mờ đi.
- **Khu máy móc**: dãy máy PCR – điện di – chụp gel, bàn quang học (quang phổ, kính hiển vi), bàn phân tích (HPLC, ly tâm, đo nồng độ DNA).

![Dãy máy PCR, bộ điện di và máy chụp gel trong phòng sau PCR](/vault-assets/virtual-lab-04-khu-may-pcr-668bbbfd.webp)
*Khu máy PCR: máy luân nhiệt, bộ điện di và máy chụp gel, mỗi máy có nút thao tác và màn hình trạng thái.*

![Hình isometric cắt hông của máy chụp ảnh gel, bên cạnh là laptop hiện ảnh gel](/vault-assets/virtual-lab-08-may-chup-gel-c8913e07.webp)
*Hình cận cảnh máy chụp ảnh gel, vẽ theo Bio-Rad Gel Doc EZ và cắt hông để thấy khay UV, camera CCD và bo mạch. Ảnh gel trên laptop sinh từ đúng các ống người dùng đã pha.*

- **Phòng vi sinh BSL-2**: tủ an toàn sinh học, nồi hấp; nhuộm Gram, đếm khuẩn lạc, MPN coliform, biến nạp plasmid.
- **Khu giải phẫu động vật**: mổ giun đất, tôm, cá chép, ếch, chuột theo SGK Sinh học 7 và bài thực hành; cắt sai đường thì rách ruột hay vỡ túi mật.
- **Khu nuôi sinh vật**: tủ ấm ruồi giấm (lai của Morgan), giá nuôi cá ngựa vằn (thử độc tính trên phôi theo OECD 236).
- **Khu trồng trọt**: chỉnh nhiệt độ, độ ẩm, ánh sáng, nắng – mây – mưa, tưới nước; cây lớn theo độ ngày sinh trưởng, nóng quá thì rụng hoa. Đây là nơi làm thí nghiệm lai đậu Hà Lan của Mendel.

![Khu trồng trọt với luống đậu và bảng điều khiển khí hậu](/vault-assets/virtual-lab-05-khu-trong-trot-137316d2.webp)
*Khu trồng trọt: luống đậu Hà Lan và bảng điều khiển khí hậu.*

- **Ngoài trời**: thực địa Cát Bà (ô tiêu chuẩn ở rừng ngập mặn, chỉ số đa dạng) và sa bàn quần đảo Cát Bà dựng từ ảnh vệ tinh Sentinel-2 và độ cao Copernicus DEM.

## Một số protocol tiêu biểu
- **PCR trọn vẹn**: pha ống mẫu và ống đối chứng âm → chạy máy PCR → nạp gel cùng ladder 1 kb → điện di → chụp ảnh gel. Ảnh gel sinh từ đúng các ống đã pha. (→ Máy PCR, điện di, chụp gel)
- **Mendel**: gieo dòng thuần, khử nhị, thụ phấn chéo, cho F1 tự thụ, đếm F2 và kiểm định χ²; có lai một cặp, hai cặp, màu hoa và các tỉ lệ tương tác gen 9 : 3 : 4, 15 : 1.
- **Morgan**: lai thuận nghịch ruồi giấm, liên kết giới tính, hoán vị gen, lai ba điểm.
- **Hoá học**: kết tủa Cu(OH)₂ rồi hoà tan trong acid, chuẩn độ HCl bằng NaOH 0,1 M, mưa vàng PbI₂, cân bằng Fe³⁺/SCN⁻ và NO₂/N₂O₄, thử màu ngọn lửa.
- **Bài thực hành đại học**: hoá sinh định tính (Fehling, Biuret, Lugol…), enzyme amylase và lipase, tách DNA thực vật bằng CTAB, SDS-PAGE và 2D-PAGE, tinh sạch protease, HPLC paracetamol và caffeine trong viên thuốc, tiêu bản hiển vi. (→ Thí nghiệm giai đoạn 3)

![Đang làm protocol kết tủa Cu(OH)2: hai bước đã xong, thẻ kết quả ghi lượng lấy, hiện tượng, phương trình, tỉ lượng và nhiệt](/vault-assets/virtual-lab-09-dang-lam-protocol-aaebaf6e.webp)
*Đang làm protocol kết tủa Cu(OH)₂ ở góc nhìn tầm mắt (thấy hai tay đeo găng). Thẻ kết quả bước 2 ghi lượng lấy thật (định lấy 2,00 mL, thực tế 1,58 mL khi rót thẳng từ chai), hiện tượng, phương trình, tỉ lượng, chất dư và nhiệt toả ra.*

## Cách dùng
1. **[Mở Virtual Lab](https://thuha.ceovanta.com/virtual-lab/)**. Dùng tốt nhất trên máy tính; điện thoại cũng dùng được (màn hình xếp dọc).
2. Chọn một khu ở thanh trên cùng, hoặc chọn một protocol ở nửa phải rồi bấm **Đến bàn thí nghiệm**.
3. **Kéo thả**: kéo chai hoá chất thả vào cốc hoặc ống PCR. Cốc và ống cũng kéo đi được trên mặt bàn. Kéo khoảng trống để xoay, cuộn để phóng to.
4. Bước đang chờ của protocol có nút **Làm mẫu**: bấm để app tự làm bước đó và xem kết quả.
5. **Mở thẳng một khu** bằng cách thêm `#tên-khu` vào cuối địa chỉ, ví dụ [#greenhouse](https://thuha.ceovanta.com/virtual-lab/#greenhouse) (khu trồng trọt), [#bench-bio](https://thuha.ceovanta.com/virtual-lab/#bench-bio) (bàn sinh học phân tử), [#pcr-bench](https://thuha.ceovanta.com/virtual-lab/#pcr-bench) (máy PCR, điện di, chụp gel), [#dissect](https://thuha.ceovanta.com/virtual-lab/#dissect) (khu giải phẫu), [#catba](https://thuha.ceovanta.com/virtual-lab/#catba) (sa bàn Cát Bà). Hình cận cảnh một máy: [#pcr](https://thuha.ceovanta.com/virtual-lab/#pcr), [#geldoc](https://thuha.ceovanta.com/virtual-lab/#geldoc), [#hplc](https://thuha.ceovanta.com/virtual-lab/#hplc).
6. Nút **Di chuyển** mở bảng đi lại tự do (phím W A S D), **Thao tác tay** để rót và dùng micropipet bằng tay, **Tuỳ chọn → Hình ảnh** để chọn mức đồ hoạ cho máy yếu.

![Bàn hoá học ở giao diện tối](/vault-assets/virtual-lab-06-giao-dien-toi-b913cee2.webp)
*App theo giao diện sáng hoặc tối của máy.*

![Virtual Lab trên màn hình điện thoại 390 px, cảnh 3D ở trên và protocol ở dưới](/vault-assets/virtual-lab-07-dien-thoai-6ab5a9ec.webp)
*Trên điện thoại: cảnh 3D ở trên, protocol ở dưới.*

## Lộ trình
Dự án làm theo từng giai đoạn, mỗi giai đoạn có kế hoạch và tiêu chí "xong" riêng. (→ Virtual Lab MOC)
- **Bản đầu tiên** (xong 10/2026): bộ khung 3D và một thí nghiệm PCR trọn vẹn. (→ Bộ khung phòng thí nghiệm 3D)
- **Giai đoạn 2**: các khu của phòng (tủ lạnh, tủ hoá chất, khu nuôi sinh vật, khu trồng trọt, máy móc, an toàn). (→ Các khu)
- **Giai đoạn 3–4**: tái hiện các bài thực hành đại học, phân tích dữ liệu (t-test, ANOVA, hồi quy, kèm mã R), lớp học không cần máy chủ.
- **Giai đoạn 5–6**: làm thí nghiệm như thật (hiện tượng theo thời gian, đèn cồn, giải phẫu, tiêu bản hiển vi, bản đồ Cát Bà), dùng tài liệu thực hành gốc. (→ Giai đoạn 5, Giai đoạn 6)
- **Giai đoạn 7**: phòng giống phòng thật: toà nhà 1 : 1, ánh sáng có bóng đổ, đồ vật đúng cỡ, thao tác tay, quy trình chuẩn. (→ Giai đoạn 7)
- **Tiếp theo**: tách phòng hoá học riêng, đồng hồ chung cho thí nghiệm dài ngày (đậu, ruồi, phôi cá), các bài hoá đại cương và hoá sinh định lượng còn lại, giao diện tiếng Anh, cho sinh viên và giáo viên dùng thử.

## Công nghệ
- JavaScript chạy thẳng trên trình duyệt, không có bước build; đồ hoạ 3D bằng [Three.js](https://threejs.org) r170. (→ Kiến trúc mô phỏng)
- Lõi mô phỏng tách khỏi giao diện: phần tính toán khoa học không phụ thuộc cảnh 3D, nên dùng chung cho bản web và bản cài trên máy (Electron, đóng gói macOS, Windows, Linux).
- Thí nghiệm mô tả bằng dữ liệu JSON (chất, phản ứng, protocol, cây trồng), thêm thí nghiệm mới chủ yếu bằng cách thêm dữ liệu.
- Hình máy là hình isometric SVG vẽ theo model thật, và bản 3D của máy dựng từ đúng hình học đó.
- Mở được khi mất mạng nhờ service worker; có chế độ danh sách cho bàn phím và trình đọc màn hình; tôn trọng chế độ giảm chuyển động.

## Giới hạn hiện tại
- Một số con số là minh hoạ (tốc độ rót bằng tay, vị trí nội quan trong mẫu mổ, tần số các kỳ phân bào), ghi rõ trong từng thẻ kết quả.
- pH chỉ tính đúng cho acid, base mạnh và carbonate; độ tan theo nhiệt độ mới có PbI₂ và KNO₃.
- Giao diện mới có tiếng Việt. Chưa đo tốc độ khung hình trên điện thoại thật; máy yếu nên chọn mức hình ảnh Thấp.
