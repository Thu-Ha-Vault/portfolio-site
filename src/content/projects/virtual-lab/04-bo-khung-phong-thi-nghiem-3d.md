---
title: Bộ khung phòng thí nghiệm 3D
type: note
tags:
  - project
  - virtual-lab
  - simulation
  - web-3d
folder: Projects / Virtual_Lab
vaultPath: Projects/Virtual_Lab/04 - Bộ khung phòng thí nghiệm 3D.md
url: /projects/virtual-lab/bo-khung-phong-thi-nghiem-3d/
updated: '2026-10-16'
date: '2026-10-15'
status: active
order: 4
project: virtual-lab
isIndex: false
---
## Yêu cầu (2026-10-15)
- Bản đầu tiên chạy trên web, sau đó mới làm phần mềm cài trên máy. (→ [Quyết định chung của dự án](/projects/virtual-lab/y-tuong-va-pham-vi/))
- 3D, mô phỏng thao tác kéo thả.
- Màn hình chia đôi, kéo được để đổi kích thước hai bên:
	- Một bên là phòng thí nghiệm.
	- Một bên là protocol, cho biết kết quả của từng bước: cho chất này vào chất kia ra phản ứng gì, phương trình nào; thí nghiệm sinh học thì chất cho vào có tác dụng gì.
- Làm bộ khung trước, mới cần phác thảo:
	- Các khu trong một phòng thí nghiệm rất lớn: bàn thí nghiệm lớn ở giữa, tủ hoá chất, tủ dụng cụ thí nghiệm, tủ lạnh, khu để máy móc.
	- Ngay bên cạnh là khu trồng trọt, chỉnh được nhiệt độ, độ ẩm và thời tiết (nắng, mưa).

## Mã nguồn
- **Thư mục**: `/Users/pc/Desktop/Sky/Virtual_Lab/`, nằm ngoài vault và có git riêng.
- **GitHub** (riêng tư): https://github.com/lucynguyen777/Virtual_Lab, nhánh `main`.
- **Bản xem trước** (riêng tư, mở được trên điện thoại): https://claude.ai/artifact/2BbpQPoa7RH7BdjJ7s1Wi8
- **Chạy thử trên máy**: trong thư mục đó chạy `python3 -m http.server 8000`, rồi mở http://localhost:8000.
- **Kiểm thử**: `tests/engine.html` kiểm tra lõi mô phỏng (126 kiểm tra), `tests/scene.html` tự bấm "Làm mẫu" để xem hoạt cảnh.
- **Công nghệ**: Three.js r170 tải qua CDN, JavaScript ES modules, không cần build (→ [Kiến trúc mô phỏng](/projects/virtual-lab/kien-truc-mo-phong/)).

## Mặt bằng

| Khu | Vị trí | Có gì |
| --- | --- | --- |
| **Bàn thí nghiệm trung tâm** | Giữa phòng, 9 × 2,4 m | Nửa hoá học: chai hoá chất và nước cất, Cốc A, B, C, bình tam giác, cân phân tích Mettler Toledo MS204TS và máy khuấy từ IKA C-MAG HS 7 sau hàng chai (đúng kích thước model). Nửa sinh học phân tử: ống thuốc thử PCR (chỉ hiện khi đã lấy ra khỏi tủ), hộp đá, ống mẫu và ống đối chứng âm (ĐC−). Bồn rửa ở giữa |
| **Tủ hoá chất** | Tường sau, bên trái | Tủ hút khí độc Labconco Protector XStream 5 ft trên tủ đế dung môi và acid (kính nâng hạ, đèn báo động); 5 tủ theo nhóm có cửa đôi mở được (acid và chất ăn mòn, base, muối, dễ cháy, chất độc), bấm chai trong tủ để lấy ra bàn |
| **Tủ dụng cụ** | Tường sau, ở giữa | 4 tủ kính: cốc có mỏ, bình tam giác; ống nghiệm, ống đong; buret, pipet; micropipet, đầu tip |
| **Tủ lạnh, tủ đông** | Tường trái | Tủ lạnh 5 °C (cửa kính), tủ đông −20 °C, tủ âm sâu −80 °C, máy làm đá, bình nitơ lỏng; cửa mở được, ống trên kệ theo kho đồ, bấm ống để lấy ra hộp đá |
| **Khu nuôi sinh vật** | Tường trước, bên trái | Tủ ấm ruồi giấm có cửa kính, lọ trong tủ theo các lọ lai đang nuôi và giai đoạn vòng đời; giá nuôi cá ngựa vằn 28,5 °C; bàn soi ruồi với kính lúp soi nổi |
| **Khu máy móc** | Nửa phải phòng, 2 đảo bàn | 14 máy là khối đúng kích thước model thật: PCR, real-time PCR, điện di, máy chụp ảnh gel, UV-Vis, kính hiển vi, HPLC, máy ly tâm, máy đọc vi đĩa, LC-MS/MS, máy đo DNA, vortex; nồi hấp tiệt trùng, tủ an toàn sinh học. Ống PCR đưa vào máy bằng cách bấm ống rồi bấm máy, hoặc kéo thả |
| **An toàn** | Tường phải, cạnh cửa nhà kính | Vòi tắm và rửa mắt khẩn cấp, bình chữa cháy CO₂, thùng rác sinh học, hộp vật sắc nhọn, bảng nội quy |
| **Khu trồng trọt** | Cạnh tường phải, 20 × 20 m | Khung thép, 4 luống cây đúng loài của phép lai (đậu Hà Lan, đậu thơm, hoa mõm chó, bí), lá bệnh trắng xám, hoa đã bao màu giấy; bộ điều khiển khí hậu; buồng sinh trưởng Conviron GEN1000 ở lối vào |

## Giao diện
- **Chia đôi màn hình**: kéo thanh ở giữa hoặc dùng phím mũi tên; nhấn đúp để về tỉ lệ mặc định. Trên điện thoại hai phần xếp dọc.
- **Chọn khu**: thanh ở trên cùng hoặc bấm nhãn khu trong cảnh, camera bay tới khu đó. Địa chỉ có `#tên-khu` (ví dụ `#greenhouse`) thì mở thẳng khu đó.
- **Phần protocol**:
	- Chọn protocol hoặc chế độ tự do.
	- Danh sách bước: đang chờ, đã xong, sai thứ tự. Bước đang chờ có nút **Làm mẫu** để app tự làm bước đó.
	- Thẻ kết quả cho từng thao tác: hiện tượng, phương trình, giải thích, tác dụng, lưu ý, các chất còn trong cốc.
- **Hình cận cảnh thiết bị**: máy có nút "Cận cảnh" trong cảnh 3D, mở hình chi tiết vẽ theo model thật (→ [Tài liệu tham khảo máy móc](/projects/virtual-lab/tai-lieu-tham-khao-may-moc-dot-1-chuoi-pcr/)). Hiện có 23 hình: 14 máy, kính lúp soi nổi, tủ −80 °C, bình nitơ lỏng, tủ hút khí độc, cân phân tích, máy khuấy từ, buồng sinh trưởng, giá nuôi cá, trạm rửa mắt (→ [Các khu của phòng thí nghiệm](/projects/virtual-lab/cac-khu-cua-phong-thi-nghiem/)).
- **Khu trồng trọt**: bảng điều khiển nhiệt độ (0–40 °C), độ ẩm (20–100 %), ánh sáng, thời tiết (nắng, nhiều mây, mưa), tưới nhỏ giọt tự động hoặc tự tưới.
	- Ngưỡng theo loài đang trồng (`data/crops.json`, có nguồn): đậu Hà Lan tối ưu 10–24 °C (EcoCrop); bảng báo độ ngày tích luỹ, sương giá, nắng nóng lúc ra hoa, nguy cơ phấn trắng và mốc xám.
	- Trời mưa thì độ ẩm tự lên ít nhất 90 %.
- **Bảng điều khiển theo khu** (nửa protocol, theo mẫu `tool-panel.js`): tủ lạnh và tủ đông (kho đồ, tủ −80 °C, bình LN2), tủ hút khí độc và đồ bảo hộ, máy khuấy từ, cân phân tích, an toàn và sự cố.

## Protocol mẫu
- **Kết tủa Cu(OH)₂ và hoà tan trong acid**: CuSO₄ → NaOH → HCl trong Cốc A.
- **Pha ống phản ứng PCR 25 µL**: 7 thành phần theo thứ tự. Cho Taq polymerase hoặc DNA khuôn quá sớm thì app nhắc.
- **PCR trọn vẹn** (bản đầu tiên, 2026-10-16): pha ống mẫu và ống đối chứng âm → chạy máy PCR → nạp gel cùng ladder 1 kb → điện di 100 V → chụp ảnh gel. 17 bước. (→ [Phân tích kết quả thực hành Sinh học phân tử](/blog/bao-cao-tong-ket-thuc-hanh-sinh-hoc-phan-tu-phan-tich-ket-qua/))
	- Thao tác máy: 4 nút trong bảng protocol, và nút ngay trên từng máy ở khu "Máy PCR, điện di" (`#pcr-bench`).
	- Ảnh gel sinh từ đúng các ống đã pha, vẽ trong thẻ kết quả; hình cận cảnh của máy mở ra với đúng ống hoặc gel đó.
	- Làm sai thì ra kết quả sai: thiếu Taq polymerase, mồi, Mg²⁺, dNTP hay DNA khuôn thì không có băng; thiếu buffer thì sản phẩm quá ít; DNA khuôn rơi vào ống ĐC− thì đối chứng âm có băng; quên đối chứng âm, nạp gel trước khi chạy PCR, chụp trước khi điện di đều có cảnh báo.
	- Có sai số ngẫu nhiên theo seed: số bản khuôn ban đầu, hiệu suất mỗi chu kỳ, vị trí băng. Số liệu và nguồn ở đầu `src/core/pcr-chain.js`.
- **Mendel** (2026-10-16), ở khu trồng trọt, 3 protocol: lai một cặp (hạt trơn × nhăn, 13 bước), lai hai cặp (trơn vàng × nhăn xanh, 9 : 3 : 3 : 1), màu hoa (phải gieo hạt F2 thành cây mới đếm). (→ [Quy luật Mendel](/blog/quy-luat-mendel/), [Kiểm định χ²](/blog/kiem-dinh-gia-thiet-thong-ke-trong-nghien-cuu-sinh-hoc/))
	- Bảng điều khiển vườn đậu nằm trong nửa protocol: đồng hồ ảo (+1, +7 ngày, tua tới giai đoạn), gieo, khử nhị, thu hoạch, thụ phấn chéo, đếm, sổ thí nghiệm CSV.
	- Đậu tự thụ phấn trong nụ (khoảng ngày 56): quên khử nhị hoặc khử nhị muộn thì hạt thu được là hạt tự thụ; khử nhị mà không thụ phấn thì hoa rụng, không có hạt; nóng quá thì cây chậm lớn và rụng hoa.
	- Thẻ "Đếm kiểu hình" có bảng quan sát/kỳ vọng, χ², p, và số liệu thật của Mendel (5474 : 1850; 315 : 108 : 101 : 32) để so sánh.
	- Luống đậu 3D theo nhóm cây đã gieo: cây lớn dần, nụ, hoa tím hoặc trắng theo kiểu gen, quả xanh rồi khô; cây thấp (le le) thấp hẳn.
	- Số liệu: `data/pea.json` (gen theo Reid & Ross 2011, khoảng 30 hạt/cây theo số liệu Mendel 1866, giai đoạn sinh trưởng làm tròn).
- **Mendel mở rộng** (2026-10-16): lai phân tích (F1 × hạt nhăn, 1 : 1); tương tác gen bổ trợ ở đậu thơm (hai dòng hoa trắng → F1 tím → F2 9 : 7, theo Bateson và cộng sự 1905); trội không hoàn toàn ở hoa mõm chó (đỏ × trắng → F1 hồng → F2 1 : 2 : 1). Hai loài mới dùng lại lịch sinh trưởng của đậu Hà Lan (giả định).
- **Morgan** (2026-10-16), ở khu nuôi sinh vật, 3 protocol: gen màu mắt trên X (lai thuận, 12 bước), lai nghịch (di truyền chéo), liên kết và hoán vị gen thân đen cánh cụt (lai phân tích ruồi cái F1). (→ [Di truyền liên kết với giới tính](/blog/di-truyen-lien-ket-voi-gioi-tinh/), [Liên kết gen và hoán vị gen](/blog/lien-ket-gen-va-hoan-vi-gen/))
	- Bảng điều khiển ruồi giấm: tủ ấm 18 / 25 / 29 / 31 °C, thu ruồi (dòng hoặc lọ, giới, số giờ sau khi nở), lai trong lọ, tua tới ngày bỏ bố mẹ hoặc tới khi nở, bỏ bố mẹ, gây mê và đếm, sổ CSV.
	- Làm sai ra kết quả sai: ruồi cái thu sau 8 giờ đã giao phối nên con không phải con lai; quên bỏ bố mẹ thì đếm lẫn; 31 °C ruồi đực bất thụ; 18 °C vòng đời khoảng 19 ngày.
	- Ruồi đực không trao đổi chéo: lai phân tích bằng ruồi đực F1 thì không có kiểu tái tổ hợp.
	- Số liệu: `data/fly.json` (vị trí gen FlyBase, b–vg 18,5 cM; F2 của Morgan 1910: 2459 ♀ đỏ, 1011 ♂ đỏ, 782 ♂ trắng).
- **Chuẩn độ HCl bằng NaOH 0,1 M** (2026-10-16): lấy pipet, máy đo pH, chai HCl chưa biết nồng độ, buret từ tủ; pipet 10 mL HCl vào bình tam giác, phenolphthalein, nạp buret, nhỏ tới hồng nhạt, đọc buret. Thẻ kết quả tính nồng độ và so với giá trị thật (0,08–0,12 M, đổi mỗi lần làm lại), chỉ ra sai số do pipet, đọc buret, nhỏ quá điểm cuối; có máy đo pH thì vẽ đường cong chuẩn độ.
- **Hoá học định lượng** (2026-10-16): mỗi cốc biết số mol từng chất và thể tích; lượng lấy theo dụng cụ (rót trực tiếp ±20 %, ống đong 10 mL ±0,2 mL, pipet bầu 10 mL ±0,02 mL theo ISO 4788, 648, 385); phản ứng theo tỉ lượng đọc từ phương trình, có chất dư và khối lượng kết tủa; pH cho acid, base mạnh và carbonate.
- **Phôi cá ngựa vằn** (2026-10-16), ở khu nuôi sinh vật, 2 protocol: làm lại bài thực hành độc tính Propylene glycol (15 phôi/nồng độ, 0–500 mg/L, 28,5 °C), và thử độc tính cấp đúng OECD 236 (20 phôi/nồng độ, 26 °C, đối chứng dương 3,4-DCA 4 mg/L). (→ [Bài thực hành PG](/blog/danh-gia-tac-dong-cua-propylene-glycol-pg-len-su-phat-trien-phoi-ca-ngua-van/))
	- Thu trứng (tỉ lệ thụ tinh ngẫu nhiên 75–95 %), chọn phôi thụ tinh, chia đĩa giếng, ủ mỗi 24 giờ, quan sát với ảnh phôi từng giếng, tính LC50, EC50, TI và kiểm tra tiêu chí hợp lệ.
	- Tốc độ phát triển theo nhiệt độ: H_T = h / (0,055·T − 0,57) (Kimmel 1995); 26 °C chậm hơn 28,5 °C 14 %.
	- Làm sai ra kết quả sai: không chọn phôi thì trứng không thụ tinh bị đếm là phôi đông tụ, đối chứng âm chết > 10 % và thử nghiệm không hợp lệ; quan sát trước 96 giờ thì có cảnh báo.
	- Mô hình PG lấy theo số liệu bài thực hành (LC50 khoảng 100 mg/L, chết chủ yếu trong 24 giờ đầu, không dị dạng); 3,4-DCA gây phù, cong đuôi ở nồng độ dưới mức gây chết.
- **Máy phân tích** (2026-10-16), mỗi máy có bảng điều khiển riêng trong nửa protocol, sổ thí nghiệm CSV và nút cận cảnh mở hình với đúng trạng thái của người dùng (→ [Tài liệu tham khảo máy móc đợt 2](/projects/virtual-lab/tai-lieu-tham-khao-may-moc-dot-2/)):
	- **Máy quang phổ UV-Vis** (khu "Quang phổ, kính hiển vi"): đường chuẩn p-nitrophenol ở 405 nm, đo mẫu trắng, dãy chuẩn 0–100 µM, mẫu chưa biết pha loãng, tính nồng độ và sai số. Quên mẫu trắng, đo xa cực đại, A vượt dải tuyến tính hay mẫu nằm ngoài dãy chuẩn đều có cảnh báo.
	- **Máy ly tâm** (khu "HPLC, ly tâm, đo DNA"): chọn cách nạp ống (cặp đối xứng, 6 ống, 3 ống cách đều, 1 ống, 2 ống kề nhau), tốc độ và thời gian; nạp lệch thì máy báo IMBAL và dừng; cặn chắc hay lỏng theo g·phút.
	- **HPLC**: đặt % acetonitrile và lưu lượng (áp suất theo cột C18 4,6 × 150 mm, quá áp thì bơm dừng), tiêm dãy chuẩn caffeine 10–100 µg/mL, tiêm nước giải khát pha loãng 1:1, dựng đường chuẩn diện tích pic, tính hàm lượng. Sắc ký đồ vẽ trong thẻ kết quả.
	- **Kính hiển vi**: biểu bì vảy hành và phết máu, đổi vật kính 4×–100×, núm thô, núm tinh, dầu soi. Núm thô đủ nét ở 4×, từ 10× phải chỉnh tinh; dùng núm thô ở 40× trở lên hay thiếu dầu ở 100× thì có cảnh báo, ảnh mờ hoặc tối.
- **Máy đợt 3** (2026-10-16), cùng kiểu bảng điều khiển (→ [Tài liệu tham khảo máy móc đợt 2](/projects/virtual-lab/tai-lieu-tham-khao-may-moc-dot-2/)):
	- **qPCR** (khu "Máy PCR, điện di"): pha đĩa dãy chuẩn 10⁶ → 10² bản, mẫu chưa biết và NTC; chạy 40 chu kỳ (đường khuếch đại, Ct), đường nóng chảy, đường chuẩn (E, R²), số bản của mẫu so với số thật. Làm sai ra kết quả sai: NTC bị nhiễm cho đỉnh trùng Tm sản phẩm; không có NTC thì có cảnh báo; mẫu lẫn chất ức chế bị tính thiếu số bản mà đường nóng chảy vẫn bình thường. (→ [Phân tích kết quả thực hành Sinh học phân tử](/blog/bao-cao-tong-ket-thuc-hanh-sinh-hoc-phan-tu-phan-tich-ket-qua/))
	- **Máy đo nồng độ DNA** (khu "HPLC, ly tâm, đo DNA"): đo mẫu trắng theo dung dịch đệm, đo plasmid, DNA bộ gen lẫn guanidine (260/230 thấp), RNA TRIzol trong nước (260/280 thấp); phổ 220–350 nm trong thẻ kết quả. Chưa đo mẫu trắng, nhỏ 0,5 µL, mẫu trắng sai đệm, quên lau bệ đều có cảnh báo hoặc lỗi.
	- **Máy đọc vi đĩa** (khu "HPLC, ly tâm, đo DNA"): Bradford trên đĩa 96 giếng (dãy chuẩn BSA lặp ba, 24 mẫu), đọc 595 nm, dựng đường chuẩn trong khoảng tuyến tính 125–1 000 µg/mL hoặc cả dãy; fit cả dãy làm sai số trung bình tăng từ khoảng 5 % lên khoảng 14 % vì đường Bradford cong; mẫu ngoài dãy chuẩn phải pha loãng. Có thêm phép thử p-nitrophenol 405 nm.
	- **Máy vortex và ly tâm mini** (khu "Quang phổ, kính hiển vi"): trộn hỗn hợp thuốc thử rồi gom giọt. 600 rpm không tạo xoáy (Fr < 1), trộn hoặc ly tâm quá ngắn thì chưa đủ, vortex ống enzyme có cảnh báo.
	- **Nồi hấp tiệt trùng** (khu mới "Nồi hấp" sát tường phải): xếp 1,5 L môi trường, chạy 121 °C 25 phút, ủ chỉ thị sinh học. Thẻ kết quả vẽ nhiệt độ buồng và dịch trong chai theo thời gian, số log bào tử giảm, F0. Không đuổi khí thì buồng chỉ khoảng 101 °C dù đồng hồ áp chỉ đúng; giữ 5 phút thì băng chỉ thị vẫn sẫm nhưng chỉ thị sinh học mọc; vặn chặt nắp chai có cảnh báo áp suất.
	- **LC-MS/MS** (khu "HPLC, ly tâm, đo DNA"): chọn kênh MRM, dãy chuẩn caffeine trong dung môi, định lượng caffeine trong huyết tương; thẻ kết quả vẽ sắc ký đồ MRM. Chọn kênh theophylline cho thấy Q1 không tách được đồng phân theobromine nhưng Q3 tách được. Tiêm thẳng huyết tương bị ức chế ion và vượt dãy chuẩn (tính thiếu khoảng 40 %), pha loãng 20 lần còn thiếu khoảng 10 %, thêm chuẩn nội caffeine-¹³C₃ thì sai số trong khoảng ±3 %. (→ [Sắc ký lỏng – khối phổ LC-MS/MS](/blog/sac-ky-long-khoi-pho-lc-ms-ms-va-nhan-dang-protein/))
	- **Tủ an toàn sinh học cấp II** (khu mới "Tủ an toàn sinh học"): bật quạt, kính 203 mm (vận tốc vào 0,53 m/s), thao tác với vi khuẩn, đóng kính, bật UV. Kính mở hết 445 mm thì vận tốc vào còn 0,24 m/s, tủ báo động kính và khí, người làm không được bảo vệ; che lưới trước làm mất bảo vệ dù vận tốc đủ; tắt quạt thì mẫu dễ nhiễm; UV bị khoá khi kính chưa đóng.
- **Giai đoạn 2: các khu** (2026-10-16; chi tiết thiết bị, số liệu và nguồn ở [note 07](/projects/virtual-lab/cac-khu-cua-phong-thi-nghiem/)):
	- **Tủ lạnh, tủ đông**: "Tủ đông: bảo quản thuốc thử PCR" (Taq polymerase để ngoài, đông – rã nhiều lần thì hoạt tính giảm, băng PCR mờ); "Tủ âm sâu −80 °C" (mở cửa, mất điện có hoặc không dự phòng LN2); "Bình nitơ lỏng" (mức LN2 theo ngày, nạp lại, thiếu oxy).
	- **Tủ hoá chất và tủ hút**: "Cu với HNO₃ đặc sinh NO₂" (làm trên bàn hở thì NO₂ vượt IDLH; kính 711 mm, tắt quạt, chai lọ sát vách ngăn đều làm khí thoát ra); "Cân bằng 2NO₂ ⇌ N₂O₄". Bỏ găng hoặc kính rồi rót chất ăn mòn thì thẻ kết quả cảnh báo kèm câu H của SDS.
	- **Bàn hoá học**: "Mưa vàng PbI₂" (độ tan theo Ksp, nguội nhanh ra bột mịn), "Kết tinh lại KNO₃", "Pha dung dịch chuẩn NaCl" (quên trừ bì thì nồng độ sai gần ba lần), "Tốc độ phản ứng theo nhiệt độ" (thiosulfate, Arrhenius), "Cân bằng Fe³⁺ + SCN⁻" (Le Chatelier).
	- **Khu nuôi sinh vật**: bước cho cá đẻ trong hai protocol phôi cá (rút vách muộn thì ít trứng); thẻ đếm ruồi vẽ ruồi đực/cái và đột biến.
	- **Khu trồng trọt**: "Nhà kính: chăm đậu Hà Lan" (8 °C cây lớn rất chậm, độ ẩm 85 % ở 22 °C thì phấn trắng, tự tưới mà không tưới thì khô hạn); lai hoa mõm chó và bí có bước bao hoa.
	- **An toàn**: "Rửa mắt, chữa cháy, bỏ chất thải đúng cách" (ANSI Z358.1, NFPA 10).
- **Chế độ tự do**: 30 phản ứng giữa 15 hoá chất (7 chai trên bàn, 8 chai lấy từ tủ hoá chất) (kết tủa, sinh khí, trung hoà, chỉ thị phenolphthalein). Phản ứng có thể nối tiếp, ví dụ NaOH + HCl tạo NaCl, rồi NaCl tạo kết tủa AgCl khi thêm AgNO₃.

## Bản cài trên máy
- Thư mục `desktop/` trong repo mã nguồn: Electron 34 mở đúng mã web qua giao thức `app://`, Three.js chép vào `vendor/` nên chạy không cần Internet; electron-builder đóng gói .dmg, .exe, AppImage.
- Chạy thử: `cd desktop && npm install && npm run vendor && npm start`. Đóng gói cho Mac phải chạy trên Mac (`npm run dist:mac`).
- Đã chạy và đóng gói thử bản Linux trên máy ảo; chưa ký số, chưa có biểu tượng app.

## Giới hạn hiện tại
- Độ tan theo nhiệt độ mới có PbI₂ (Ksp) và KNO₃ (bảng độ tan).
- Nước trong đất, hệ số giảm năng suất do bệnh, hệ số rò khí của tủ hút là số minh hoạ (ghi rõ trong code và note 07).
- Kéo thả ống lên máy chỉ được khi ống và máy cùng trong khung nhìn; thường dùng cách bấm ống rồi bấm máy.
- Máy trong khu máy móc là khối đúng kích thước, chi tiết nằm ở hình cận cảnh.

## Việc tiếp theo
- [x] Mở được tủ hoá chất, tủ dụng cụ; lấy đồ ra bàn ✅ 2026-10-16
- [x] Máy PCR chạy được ống PCR vừa pha, rồi điện di ra ảnh gel ✅ 2026-10-16
- [x] Tính lượng chất (mol, thể tích) thay cho mô hình định tính ✅ 2026-10-16
- [x] Gieo hạt và cho cây lớn theo thời gian ở khu trồng trọt, chuẩn bị cho thí nghiệm Mendel ✅ 2026-10-16
- [x] Mendel mở rộng: lai phân tích, tương tác gen bổ trợ 9 : 7, trội không hoàn toàn ✅ 2026-10-16
- [x] Tương tác gen át chế trội ở màu quả bí (12 : 3 : 1) ✅ 2026-10-16
- [x] Máy phân tích chạy được trong app: quang phổ UV-Vis, ly tâm, HPLC, kính hiển vi ✅ 2026-10-16
- [x] Máy đợt 3: qPCR, máy đọc vi đĩa, máy đo nồng độ DNA, vortex và ly tâm mini, nồi hấp tiệt trùng, LC-MS/MS, tủ an toàn sinh học ✅ 2026-10-16
- [x] Giai đoạn 2: các khu thao tác được, có lõi, protocol và hình chi tiết (→ [Các khu của phòng thí nghiệm](/projects/virtual-lab/cac-khu-cua-phong-thi-nghiem/)) ✅ 2026-10-16
