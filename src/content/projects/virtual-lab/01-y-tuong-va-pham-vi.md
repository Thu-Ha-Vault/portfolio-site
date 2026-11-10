---
title: Ý tưởng và phạm vi
type: note
tags:
  - project
  - virtual-lab
  - simulation
folder: Projects / Virtual_Lab
vaultPath: Projects/Virtual_Lab/01 - Ý tưởng và phạm vi.md
order: 1
project: virtual-lab
isIndex: false
description: >-
  Chi tiết từng thí nghiệm: Danh mục thí nghiệm ảo. Cách xây phần lõi: Kiến trúc
  mô phỏng.
---
## Ý tưởng ban đầu
> Tạo 1 môi trường thí nghiệm ảo để có thể thực hiện các phản ứng hoá-sinh. Từ các thí nghiệm thực địa cần trồng trọt giống kiểu thí nghiệm với đậu Hà Lan của Mendel, đến ruồi giấm của Morgan, hay nuôi phôi cá ngựa vằn,... đến các thí nghiệm hoá cần dùng đến các dụng cụ thí nghiệm, hoá chất để xem phản ứng giữa các chất. Rồi đến các thí nghiệm cần dùng đến các loại máy móc như PCR, HPLC,...

## Ba nhóm thí nghiệm

| Nhóm | Người dùng làm gì | Lõi mô phỏng | Ví dụ |
| --- | --- | --- | --- |
| **A. Sinh vật sống** | Chọn giống, lai, nuôi, đếm kiểu hình | Di truyền + sinh trưởng theo thời gian | Đậu Hà Lan (Mendel), ruồi giấm (Morgan), phôi cá ngựa vằn |
| **B. Hoá học** | Lấy dụng cụ, đong hoá chất, trộn, đun, quan sát | Bảng phản ứng + tỉ lượng + hiện tượng | Kết tủa, đổi màu, sinh khí, chuẩn độ, phản ứng của protein |
| **C. Thiết bị** | Chuẩn bị mẫu, cài chương trình máy, đọc kết quả | Hàm "mẫu + thông số → tín hiệu" | PCR và điện di, HPLC, máy quang phổ UV-Vis |

- Chi tiết từng thí nghiệm: [Danh mục thí nghiệm ảo](/projects/virtual-lab/02-danh-muc-thi-nghiem-ao/). Cách xây phần lõi: [Kiến trúc mô phỏng](/projects/virtual-lab/03-kien-truc-mo-phong/).

## Điểm chung của mọi thí nghiệm
- **Kho**: sinh vật, hoá chất, dụng cụ, máy. Mỗi thứ có thuộc tính riêng (kiểu gen, công thức, nồng độ, thể tích…).
- **Quy trình (protocol)**: chuỗi bước người dùng thực hiện. Làm sai bước thì kết quả sai đúng như ngoài đời: quên đối chứng, nhiễm mẫu, gắn mồi sai nhiệt độ, quên khử nhị…
- **Thời gian ảo**: phải tua nhanh được, vì mỗi loại thí nghiệm cần thời gian rất khác nhau:
	- Đậu Hà Lan: vài tháng một thế hệ (Mendel làm thí nghiệm trong khoảng 1856–1863).
	- Ruồi giấm: ~10 ngày một thế hệ ở 25 °C.
	- Phôi cá ngựa vằn: theo dõi theo giờ, 0–96 giờ sau thụ tinh.
	- Phản ứng hoá học: vài giây đến vài phút. PCR: 1–2 giờ. HPLC: 10–60 phút mỗi lần chạy.
- **Kết quả có ngẫu nhiên**: số đếm F2 không bao giờ đúng 3 : 1, nên người dùng phải kiểm định thống kê như với số liệu thật.
- **Sổ thí nghiệm**: tự ghi lại các bước, thông số và kết quả; xuất CSV để phân tích tiếp.

## Quyết định (2026-10-15)
- **Người dùng**: tất cả mọi người: học sinh, sinh viên, giáo viên, nhà nghiên cứu.
- **Nền tảng**: làm bản web trước, sau đó mới phát triển phần mềm cài trên máy.
- **Mức độ chân thực**: 3D, mô phỏng thao tác kéo thả. Màn hình chia đôi, kéo được để đổi kích thước: một bên là phòng thí nghiệm, một bên là protocol, cho biết kết quả của từng bước (cho chất này vào chất kia ra phản ứng gì, phương trình nào; thí nghiệm sinh học thì chất cho vào có tác dụng gì).
- **Bước đầu tiên**: dựng bộ khung các khu trong phòng thí nghiệm và khu trồng trọt bên cạnh, mới ở mức phác thảo (→ [Bộ khung phòng thí nghiệm 3D](/projects/virtual-lab/04-bo-khung-phong-thi-nghiem-3d/)).
- **Deadline bản đầu tiên** (chốt 2026-10-16): Chủ nhật 2026-10-18.

## Thứ tự làm
1. **Bộ khung 3D**: các khu của phòng thí nghiệm, khu trồng trọt, màn hình chia đôi, kéo thả trên bàn thí nghiệm. Đã có bản phác thảo.
2. **Mendel**: logic thuần, kiến thức đã có sẵn trong vault. Làm xong sẽ có lõi di truyền, đồng hồ ảo và sổ thí nghiệm để dùng lại cho mọi thí nghiệm sau.
3. **Morgan**: mở rộng lõi di truyền với NST giới tính, liên kết gen, hoán vị gen.
4. **Bàn thí nghiệm hoá học**: kho hoá chất và bảng phản ứng đầy đủ, tính lượng chất.
5. **Thiết bị**: PCR và điện di → máy quang phổ UV-Vis → HPLC.
6. **Phôi cá ngựa vằn**: cần nhiều hình ảnh theo từng giai đoạn nên làm sau.

## Sản phẩm tương tự để tham khảo
- **PhET Interactive Simulations** (University of Colorado Boulder): mô phỏng miễn phí, có phần hoá học và sinh học. https://phet.colorado.edu
- **ChemCollective Virtual Lab** (Carnegie Mellon University): bàn thí nghiệm hoá học ảo, có kho hoá chất và dụng cụ. https://chemcollective.org/vlabs
- **Labster**: phòng thí nghiệm ảo 3D thương mại, có các bài PCR, điện di, sắc ký. https://www.labster.com
- **Virtual FlyLab**: mô phỏng lai ruồi giấm, gần với thí nghiệm Morgan.
