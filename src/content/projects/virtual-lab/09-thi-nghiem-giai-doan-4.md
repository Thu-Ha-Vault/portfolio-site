---
title: Thí nghiệm giai đoạn 4
type: note
tags:
  - project
  - virtual-lab
  - simulation
folder: Projects / Virtual_Lab
vaultPath: Projects/Virtual_Lab/09 - Thí nghiệm giai đoạn 4.md
url: /projects/virtual-lab/thi-nghiem-giai-doan-4/
updated: '2026-10-16'
date: '2026-10-16'
status: active
order: 9
project: virtual-lab
isIndex: false
description: >-
  Kế hoạch ở mục 8 của CLAUDE.md. Cách ghi giống 08 - Thí nghiệm giai đoạn 3:
  thiết bị thật, số liệu và nguồn, bài thực hành gốc, kết quả mô phỏng so với số
  liệu của bài, làm sai thì ra gì. Số minh hoạ là số chỉnh cho mô h
---
Kế hoạch ở mục 8 của CLAUDE.md. Cách ghi giống [08 - Thí nghiệm giai đoạn 3](/projects/virtual-lab/thi-nghiem-giai-doan-3/): thiết bị thật, số liệu và nguồn, bài thực hành gốc, kết quả mô phỏng so với số liệu của bài, làm sai thì ra gì. Số *minh hoạ* là số chỉnh cho mô hình chạy hợp lý, không phải số đo.

## 0. Phát hành an toàn và chạy không cần mạng
- **Công cụ kiểm tra**: REA (`rea-agents` 6.5.0, https://github.com/morluto/rea, MIT), dùng qua skill `rea-audit` của repo mã nguồn. Chỉ đọc file, không chạy app.
- **Bản cài Electron, trước khi sửa** (2026-10-16): file chạy Electron 34 còn fuse mặc định: `RunAsNode`, `EnableNodeOptionsEnvironmentVariable`, `EnableNodeCliInspectArguments` bật. Ai chạy được app cũng biến nó thành trình thông dịch Node.
- **Đã sửa**:
	- `desktop/fuses.js` (hook `afterPack`, `@electron/fuses` 1.8.0) tắt `RunAsNode`, `NODE_OPTIONS`, `--inspect`, quyền thêm của `file://`; bật mã hoá cookie và `OnlyLoadAppFromAsar`. electron-builder 25.1.8 không có khoá `electronFuses` nên dùng hook.
	- Kiểm tra toàn vẹn `app.asar` chỉ bật trên macOS. Windows *chưa xác minh* electron-builder 25.1.8 nhúng mã băm; bật mà thiếu mã băm thì app không mở được.
	- Mọi trang HTML trong bản cài có Content-Security-Policy và `nosniff`; trang không rời được `app://lab`, link `https` mở bằng trình duyệt, cửa sổ mới bị chặn.
- **Sau khi sửa**, `rea-audit` trên bản Linux đã đóng gói: các fuse đúng như trên; cửa sổ có `contextIsolation`, `sandbox`, không preload, không IPC. Chạy thử bằng `xvfb-run`: app mở bình thường; đặt `ELECTRON_RUN_AS_NODE=1` thì vẫn mở app, không thành Node.
- **2026-10-16, sau khi bản cài phục vụ thêm file `.jpg`** (ảnh vệ tinh của bản đồ Cát Bà, [note 10](/projects/virtual-lab/thi-nghiem-giai-doan-5/)): `rea-audit` trên mã nguồn: cửa sổ vẫn có `contextIsolation`, `sandbox`, không preload, không IPC; yêu cầu mạng chỉ có hai chỗ trong `src/main.js`, đều tải file nội bộ trong `data/` (JSON và `data/catba/height.png`). Fuse đọc trên Electron chưa đóng gói nên còn mặc định; bản đóng gói được kiểm bằng `desktop/check-fuses.mjs` trong `desktop.yml`.
- **Bản web**:
	- Three.js r170 chép vào `vendor/three/` ở gốc repo (kèm giấy phép MIT), dùng chung cho web và bản cài; không còn tải từ jsDelivr.
	- CSP trong `index.html` chỉ cho chạy đúng import map (theo mã băm sha256) và script của chính app. `tests/csp-check.mjs` kiểm mã băm, chạy trong CI.
	- `sw.js`: lấy từ mạng trước, mất mạng thì dùng bản đã lưu. Kiểm tra: mở app, tắt mạng, tải lại ở độ rộng 390 px → app vẫn chạy (139 file trong bộ nhớ đệm).
	- Chỉ font Google còn tải từ ngoài; không có mạng thì dùng font hệ thống.
- **Hiệu năng** (Chromium không GPU, 390 px): 127 file, 2,6 MB chưa nén (Three.js 1,3 MB, mã `src/` 0,7 MB, `figures/*/model.mjs` 0,3 MB, dữ liệu 0,26 MB); app sẵn sàng sau khoảng 2,2 s từ máy chủ cục bộ.
	- Không tách tải lõi theo khu: lúc mở app, mọi lõi phải đặt lại bằng seed và chạy lại nhật ký phiên (`session.js`), nên lõi nào cũng cần ngay. Phần lớn dung lượng là Three.js, vốn cũng cần ngay. Hình cận cảnh đã chỉ tải khi mở.
- **Truy cập**:
	- Nút **Danh sách khu và thiết bị** ở góc cảnh 3D: mỗi khu một nút "Đến khu" và các nút "Cận cảnh", dùng thay cảnh 3D khi điều khiển bằng bàn phím hoặc trình đọc màn hình.
	- `Esc` đóng hình cận cảnh và trả tiêu điểm về nút đã mở; thẻ kết quả mới được trình đọc màn hình đọc (`aria-live`).
	- Độ tương phản (WCAG): chữ phụ trên nền trắng 5,6; trên nền xám 4,8; chữ phụ ở giao diện tối 6,6; màu nhấn 5,4 (sáng) và 6,8 (tối); đều đạt AA (≥ 4,5).
- **Đóng gói trên GitHub Actions** (2026-10-16, không cần máy Mac): workflow `.github/workflows/desktop.yml`, chạy tay hoặc khi đẩy tag `v*`.
	- macOS `.dmg` cho Apple Silicon và Intel, Windows `.exe` (NSIS), Linux `.AppImage`.
	- Mỗi hệ điều hành: kiểm fuse bằng `desktop/check-fuses.mjs` (cùng bảng của skill `rea-audit`), macOS thêm `codesign --verify`; mở app thật, chờ cảnh 3D dựng xong (`ready: true`) và chụp cửa sổ.
	- Kết quả lần chạy 2026-10-16 (lần 2 và 3):
		- macOS: 2 file `.dmg` (Apple Silicon, Intel); fuse đúng, `EnableEmbeddedAsarIntegrityValidation` bật; `codesign --verify --strict`: chữ ký ad-hoc hợp lệ (`Signature=adhoc`, không có Team ID); bản Apple Silicon mở được, cảnh 3D dựng xong sau 45 giây chờ.
		- Windows: `.exe` NSIS; fuse đúng; app mở được, cảnh 3D dựng xong.
		- Linux: `.AppImage`; fuse đúng; mở bằng `xvfb-run`, cảnh 3D dựng xong.
		- Bản cài nằm ở mục Artifacts của lần chạy, giữ 14 ngày.
	- Bài học: hook `afterPack` chỉ đọc thuộc tính của packager đang chạy; secret chưa đặt là chuỗi rỗng, `CSC_LINK` rỗng làm electron-builder dừng nên phải `unset`.
	- Máy chạy không có GPU nên WebGL chạy bằng SwiftShader; Chromium báo cách này sắp bỏ (cần cờ `--enable-unsafe-swiftshader`). Máy người dùng có GPU thì không ảnh hưởng.
- **Quyết định của chủ dự án** (2026-10-16):
	- [x] macOS: dùng chữ ký ad-hoc trước. Mở lần đầu phải vào Cài đặt hệ thống → Quyền riêng tư & Bảo mật → Vẫn mở. Có tài khoản Apple Developer (99 USD/năm) thì thêm 5 secret theo `desktop/README.md`, workflow tự ký và công chứng. ✅ 2026-10-16
	- [x] Bản web công khai trên một subdomain của domain riêng của chủ dự án, qua Cloudflare Pages. Repo vẫn riêng tư; chỉ mã chạy trên trình duyệt được đưa lên (`tools/build-site.sh` bỏ `tests/`, `desktop/`, `.claude/`, `CLAUDE.md`, mã dựng hình). ✅ 2026-10-16
	- [ ] Thêm secret `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` cho repo và gắn subdomain trong Cloudflare (README của repo, mục "Bản web công khai"). Workflow `pages.yml` đã chạy thử: dựng và kiểm CSP đạt, bỏ qua bước đẩy vì chưa có secret. ⏫

## 1. Tinh sạch enzyme
- **Bài gốc**: [Enzymology bài 2: tinh sạch enzyme](/blog/tinh-sach-enzyme/) và bài báo nguồn [Langenegger et al. 2018](/blog/identification-of-a-precursor-processing-protease-from-the-spider-cupiennius-sal/).
- **Lõi** `src/core/purify.js`, số liệu `data/purify.json`:
	- Quy trình như bài báo: nọc thô 3 mL → lọc gel Superdex 75 HR (pH 5,0) → trao đổi cation MiniS PE 4.6/50 (0–0,65 M NaCl) → RP-HPLC C4.
	- Mỗi cột cho sắc ký đồ theo phân đoạn (A280, hoạt độ, muối). Người học đo hoạt độ FRET (DABCYL–EDANS, 340/485 nm) rồi gộp phân đoạn.
	- Mỗi nhóm protein (protease 28 kDa, peptide tạp b, protein 25–35 kDa, protein lớn, độc tố nhỏ) là một đỉnh Gauss trên từng cột. Vị trí đỉnh và hệ số thu hồi là số hiệu chỉnh (*minh hoạ*) để quy trình chuẩn ra đúng bảng của bài báo.
	- Bài báo: tổng hoạt độ sau CEX thấp hơn lượng protease còn lại (RP sau đó thu nhiều hoạt độ hơn). Mô hình gán hệ số 0,516 cho hoạt độ đo được của phân đoạn CEX, cơ chế chưa rõ.
- **Kết quả so với bài** (trung bình 120 lần chạy, kiểm thử): hoạt độ và protein mỗi bước nằm trong ± SD của bảng; độ sạch khoảng 1100 lần (bài 1097), hiệu suất khoảng 23,5 % (bài 23,6 %); sau RP-HPLC gel nhuộm bạc chỉ còn một băng 28 kDa.
- **Làm sai**:
	- CEX ở pH 8 hoặc mẫu có 0,5 M NaCl: protease không bám cột.
	- Bỏ lọc gel, nạp nọc thô lên CEX: cột quá tải.
	- Đo nọc thô không pha loãng: cơ chất bị cắt hết, ngoài khoảng tuyến tính.
	- Quên đối chứng âm và dương: không tính được % cơ chất bị cắt.
	- Gộp quá rộng thì độ sạch thấp; gộp quá hẹp thì mất hoạt độ.
	- Bỏ RP-HPLC: gel còn băng peptide tạp.
	- AEBSF mất hoàn toàn hoạt độ, Zn²⁺ giảm 5 lần, pH ≤ 4 hoặc ≥ 8 gần như không hoạt động (theo bài báo).
- **Hình FPLC (Fig 27)**: Cytiva ÄKTA pure 25 + bộ thu phân đoạn F9-C, `figures/fplc/`. Thông số theo data file CY11416-01Jul21-DF (535 × 630 × 470 mm; bơm 0,001–25 mL/phút, 0–20 MPa; UV U9-L 280 nm; độ dẫn C9n; F9-C 6 cassette × 40 ống 3 mL). Bố trí module mặt trước, giàn XY và xếp cassette vẽ theo cấu tạo điển hình (*chưa xác minh*). Hình nhận sắc ký đồ và vùng gộp của người dùng qua `#run=`.
- Protocol `pu-protease`.

## 2. Bóng ngoại bào và so sánh gel 2D
- **Bài gốc**: [Proteomics bài 03](/blog/phan-tach-exosome-va-cac-bong-ngoai-bao-tu-huyet-tuong-nguoi/), [bài 04](/blog/phan-tich-hinh-anh-ban-gel-dien-di-hai-chieu-su-dung-phan-mem-phoretix/), [tiểu luận exosome ung thư gan](/blog/seminar-nghien-cuu-xac-dinh-he-protein-exosome-trong-benh-nhan-ung-thu-gan-su-du/).
- **Lõi** `src/core/exosome.js`, `data/exosome.json`:
	- Huyết tương ly tâm 1500 × g rồi 10000 × g, pha 1:1 PBS, lọc 0,22 µm, cột Sepharose CL-4B 3 mL, 20 phân đoạn × 150 µL.
	- Thể tích rửa giải theo đường kính thuỷ động (Kav, *minh hoạ*): EV ra ở thể tích rỗng, rồi LDL, IgM, α2-macroglobulin, IgG, HDL, transferrin, albumin.
	- SDS-PAGE nhuộm CBB R-250 (khoảng 0,1 µg/băng).
	- NTA: phân bố kích thước log-chuẩn. Western blot: CD63, CD81, TSG101, Calnexin (MISEV2018).
	- Tỉ lệ hạt/µg protein theo Webber và Clayton 2013.
- **Khớp bài 03** (kiểm thử): giếng 8–10 không có băng; 11–12 có băng apoB-100 gần đầu gel; protein tăng dần sau đó; hơn 90 % EV nằm ở phân đoạn 8–12. NTA trung bình khoảng 120 nm (Dong 2022, tách bằng PEG không lọc: 147,5 nm).
- **Làm sai**: bỏ ly tâm 10000 × g và lọc thì có hạt > 300 nm và Calnexin dương; để gel khô hoặc nạp 500 µL thì phân đoạn EV lẫn protein; gộp 14–16 thì mất EV.
- **So sánh gel 2D** (`pt-compare`, bài 04): gel thứ hai cùng mẫu nạp gấp đôi. So thể tích thô thì hơn 80 % spot "khác biệt" giả; so %V thì dưới 35 % (sai số kỹ thuật khoảng 20 % mỗi gel, *minh hoạ*). Tiêu chí khác biệt ≥ 1,5 hoặc < 0,66 theo Dong 2022.
- Chưa vẽ máy siêu ly tâm (kế hoạch ghi "nếu kịp").
- Protocol `exo-plasma-ev`, `pt-phoretix`.

## 3. Phân tích số liệu
- **Bài gốc**: [Biostatistics 01](/blog/3-dac-trung-thong-ke-cua-mot-mau-va-uoc-luong-tham-so-cua-tong-the/), [02](/blog/kiem-dinh-gia-thiet-thong-ke-trong-nghien-cuu-sinh-hoc/), [03](/blog/tuong-quan-va-hoi-quy/).
- **Lõi** `src/core/stats.js` dùng chung (`genetics.js`, `evolution.js`, `fieldeco.js` gọi lại) và `src/core/stats-lab.js`, số liệu `data/stats.json` lấy từ file Excel bài làm.
- **Khớp Excel** (kiểm thử):
	- Chiều cao 40 thanh niên: TB 162,775; KTC 95 % (161,206; 164,344); KTC phương sai (17,635; 43,331).
	- χ² hai lô vaccine 8,7134.
	- t ghép cặp −6,52112.
	- ANOVA lúa F = 16,84553, h² = 0,94064; ong F = 9,74657, p = 0,0008.
	- Chlorophyll: F-Test p = 0,97177, t = −4,64664.
	- Trứng ruồi giấm: H = 80,6556 − 2,2125T, R² = 0,788364; mũ a = 150,33, b = −0,074557.
	- Đa thức bậc 4 lệch Excel ở chữ số thứ 4 nhưng khớp numpy: Excel làm tròn khi ma trận gần suy biến.
- Hệ số di truyền trong bài làm tính bằng h² = 1 − 1/F, app ghi đúng như vậy.
- Bảng phân tích: nạp số liệu bài tập, sổ thí nghiệm của bất kỳ lõi nào, hoặc CSV dán vào; mỗi kết quả kèm mã R.
- Không đưa bộ nhà ở Boston của [bài 04 Introduction to Data Analysis](/blog/tieu-luan-van-dung-r-phan-tich-du-lieu-nha-o-boston/): biến B xây theo chủng tộc (nhiều thư viện đã bỏ bộ này), giấy phép phân phối lại chưa rõ.
- Protocol `st-biostat`.

## 4. Thực địa mở rộng
- **Bài gốc**: [Field Study 02](/blog/dong-vat-co-xuong-song-tren-can-chim-thu/), [03](/blog/dong-vat-co-xuong-song-duoi-nuoc-ca-luong-cu-bo-sat/), [05](/blog/dong-vat-khong-xuong-song-duoi-nuoc-giap-xac-cua/), [07](/blog/thuc-vat-bac-cao-thu-mau-va-dinh-loai-ardisia-sp/), [08](/blog/thuc-vat-bac-thap-nam-tao-mau-nam-trametes-sp/).
- **Dơi**: máy ghi siêu âm ở Động Trung Trang tách hai đỉnh tần số 98,6 kHz (~100 con) và 78,1 kHz (~300 con) theo báo cáo; độ lệch chuẩn 1,2 kHz là *minh hoạ*. Không có máy thì không tách được hai loài.
- **Chim**: chỉ gồm các taxon trong báo cáo. Tỉ lệ bắt gặp chỉnh để 4 giờ buổi sáng yên lặng có loa phát tiếng cho trung bình 4 Hút mật, 1 Bông lau họng vạch, 1 Quạ. Đi ồn ào thì giảm mạnh.
- **Cá và cua** ở bãi triều Xuân Đám: cá bống, thòi lòi chỉ bắt được bằng ống hút bùn; cua phải thu lúc triều rút, cua bãi triều (Grapsidae) phải đào hố; không đeo găng thì cảnh báo. Số con mỗi lần là *minh hoạ* (báo cáo không ghi số lượng).
- **Khoá lưỡng phân** rút gọn (*minh hoạ*, chưa đối chiếu khoá chuẩn): mẫu cây tới *Ardisia* (so với *Psychotria*, *Embelia*, *Maesa*); mẫu nấm tới *Trametes* (so với *Schizophyllum*, *Ganoderma*, *Pycnoporus*).
- Khu `#field` thêm cửa hang và bãi triều. Protocol `fe-groups`.

## 5. Di truyền mở rộng
- Đã có từ trước: lai phân tích, 9 : 7, trội không hoàn toàn 1 : 2 : 1, át chế trội 12 : 3 : 1.
- **Mới**:
	- Át chế lặn 9 : 3 : 4: màu aleurone hạt ngô. Ví dụ giáo trình; số đếm gốc *chưa xác minh*.
	- Gen trùng 15 : 1: quả cây tề thái (Shull 1914).
	- Gen gây chết 2 : 1: hoa mõm chó lá vàng aurea (Baur 1907). Cây con YY trắng chết sau khi nảy mầm.
	- Lai ba điểm ở ruồi giấm: thêm gen pr (FlyBase 2-54.5), dòng b pr vg. Nhiễu trao đổi chéo I = 0,6 trên nhiễm sắc thể 2 (*minh hoạ*). App tìm gen giữa, khoảng cách, hệ số trùng hợp; một lần chạy: b — 7,7 cM — pr — 11,8 cM — vg (FlyBase 6,0 và 12,5).
- **Sửa lỗi**: tua vườn qua nhiều giai đoạn trước đây đánh dấu luôn bước "tua tới giai đoạn" của nhóm cây gieo sau. Nay app chỉ ghi nhận giai đoạn mà bước đang chờ cần.
- Protocol `mendel-recessive-epistasis`, `mendel-duplicate`, `mendel-lethal`, `morgan-threepoint`.

## 6. Cảnh 3D
- 15 máy ở Khu máy móc là mô hình low-poly theo kích thước thật (`src/scene/machine-models.js`): nắp nghiêng máy PCR, chồng module HPLC, vòm máy ly tâm, đầu kính hiển vi, ÄKTA và bộ thu phân đoạn…
- **Kéo thả**: kéo ống ra mép khung nhìn thì camera trôi theo. Đã thử bằng Playwright: kéo ống PCR từ bàn sinh học phân tử ra mép phải, camera trôi tới máy PCR, thả lên máy thì máy chạy.
- **Hiệu năng**: tự hạ tỉ lệ điểm ảnh (2 → 1,5 → 1, màn hẹp tới 0,75) khi chậm hơn 30 khung/giây. Trên Chromium không GPU, hạ điểm ảnh không giúp vì giới hạn là CPU; cần đo trên điện thoại thật.
- Cửa tủ đã có hoạt cảnh từ giai đoạn 2.

## 7. Lớp học không cần máy chủ
- `src/core/classroom.js`:
	- Gói bài tập: protocol đầy đủ, seed chung cho cả lớp, chế độ kiểm tra, mã 12 ký tự.
	- Bài nộp: nhật ký phiên, tên, điểm tự chấm, mã SHA-256 viết thuần JS (kiểm thử với vector chuẩn).
- Giáo viên mở bài nộp: app kiểm mã băm rồi chạy lại nhật ký với đúng seed để chấm lại.
- Thử đầu-cuối bằng Playwright: chấm lại trùng điểm tự chấm (9,5/10); sửa điểm trong file thì báo mã băm không khớp và vẫn chấm theo nhật ký.
- **Giới hạn**: ai biết cách vẫn tính lại được mã băm sau khi sửa file. Chống gian lận thật sự cần máy chủ lưu bài, việc này chờ chủ dự án quyết nơi chạy công khai.

## 8. Giao diện tiếng Anh
- [ ] Chờ chủ dự án quyết (đổi quyết định "chữ hiển thị viết tiếng Việt").
