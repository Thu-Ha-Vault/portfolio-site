---
title: 'Chương 6: Phân tích cơ sở dữ liệu'
type: course-note
tags:
  - biology
  - biostatistics
  - database
  - excel
  - course-note
section: Sinh học
folder: Sinh học / Biology Project and Lab Report / Biostatistics and Bioinformatics
vaultPath: >-
  Resources/Sinh học/Biology Project and Lab Report/Biostatistics and
  Bioinformatics/04 - Phân tích cơ sở dữ liệu trên Excel.md
url: /blog/phan-tich-co-so-du-lieu/
topic: biology
updated: '2026-10-14'
order: 4
description: >-
  Thực hành thao tác với cơ sở dữ liệu (CSDL) dạng bảng trong Excel: lọc bản ghi
  theo điều kiện (Advanced Filter), hàm CSDL (DMAX, DAVERAGE), sắp xếp nhiều
  khoá và lập bảng phân bố tần số. Gồm 3 sheet số liệu sinh học. Ô đ
isIndex: false
---
> Thực hành thao tác với **cơ sở dữ liệu (CSDL) dạng bảng** trong Excel: lọc bản ghi theo điều kiện (*Advanced Filter*), hàm CSDL (`DMAX`, `DAVERAGE`), sắp xếp nhiều khoá và lập **bảng phân bố tần số**. Gồm 3 sheet số liệu sinh học. Ô đầu sheet có link DataCamp Workspace (làm song song trên DataCamp).

## Khái niệm chính
- **Database Range**: vùng dữ liệu gồm hàng tiêu đề (tên trường – *field*) và các bản ghi (*record*) bên dưới. (→ [Giới thiệu Dữ liệu & Database](/blog/gioi-thieu-du-lieu-and-database/))
- **Criterion Range**: vùng điều kiện, gồm tên trường (chép đúng tiêu đề) và điều kiện bên dưới:
	- Các điều kiện **cùng hàng** → phép **AND**.
	- Các điều kiện **khác hàng** → phép **OR**.
	- Ví dụ `L(cm)` = `>21` ở một hàng và `Age` = `5+` ở hàng dưới → "L > 21 cm **hoặc** tuổi 5+"; hai cột `L(cm)` cạnh nhau `>=19` và `<21` → "19 ≤ L < 21".
- **Output range**: hàng tiêu đề chỉ chứa các trường muốn trích ra (vd Fish, Sex, Msex, L(cm), Age).

## Công thức / phương pháp
- **Trích lọc bản ghi** – *Data → Advanced Filter*: khai báo List range (Database Range), Criteria range và *Copy to another location* (vùng output). (→ [SELECT & WHERE](/blog/select-and-where-truy-van-co-ban/), [Thao tác dữ liệu trong R](/blog/cac-thao-tac-voi-du-lieu-trong-r/))
- **Hàm CSDL** – cú pháp chung `Dxxx(database; field; criteria)`: (→ [Hàm tổng hợp](/blog/ham-tong-hop-aggregate/))
	- `DMAX(...)`: giá trị lớn nhất của trường thoả điều kiện.
	- `DAVERAGE(...)`: trung bình của trường thoả điều kiện.
	- Tương tự: `DMIN`, `DSUM`, `DCOUNT`.
- **Sắp xếp nhiều khoá** – *Data → Sort*: khoá chính + các khoá phụ. (→ [Sắp xếp & Tìm kiếm](/blog/sap-xep-and-tim-kiem/), [Analyze Data](/blog/analyze-data-to-answer-questions/))
- **Phân bố tần số theo khoảng**:
	- Tính `MIN`, `MAX` của trường, chọn độ rộng khoảng $a$.
	- Tạo cột **Bin**: $Bin_1 = \min$, $Bin_{k+1} = Bin_k + a$ (cố định ô $a$ bằng `$`), dòng cuối = max.
	- *Data Analysis → Histogram* (Input Range + Bin Range) → bảng **Bin – Frequency** (thêm dòng *More*).

## Bài tập / ví dụ

### Sheet "CSDL Bang 6.2" – Đặc điểm sinh học cá *Coilia grayi*
- 25 cá thể, các trường: Fish, L(cm), Lo(cm), W(g), Wo(g), Wf(g), Sex, Msex (mức độ chín sinh dục), FS, LS, Age (0+ đến 5+), K, Main-Food (Copepoda, Cladocera, Acetes, Polychaeta, Mysis, Amphipoda…).
- Các yêu cầu:
	1. Trích bản ghi có L > 21 cm **hoặc** tuổi 5+ với các trường Fish, Sex, Msex, L(cm), Age → dùng Advanced Filter (đã có kết quả).
	2. Trích bản ghi có Msex = 3 **hoặc** 4 (đã có kết quả).
	3. Tìm W(g) max của các cá thể có 19 ≤ L < 21 cm → `DMAX` (đã lập vùng điều kiện; giá trị kết quả không rõ trong bản gốc).
	4. Tính L(cm) trung bình của các cá thể có LS ≥ 3 → `DAVERAGE` (đã lập vùng điều kiện; giá trị kết quả không rõ trong bản gốc).
	5. Sắp xếp tăng dần theo Wo(g) (khoá chính), Wf(g) và Msex (khoá phụ).
	6. Phân bố tần số theo L(cm), khoảng 1 cm:

| Bin (cm) | 15,5 | 16,5 | 17,5 | 18,5 | 19,5 | 20,5 | 21,5 | 22,3 |
|---|---|---|---|---|---|---|---|---|
| Frequency | 1 | 2 | 3 | 2 | 4 | 3 | 8 | 2 |

### Sheet "CSDL MT.XLS" – Sinh học một loài thuỷ sản ở vịnh Bắc Bộ
- Các trường: Date (đợt thu mẫu Me1, Me2, M2… tháng 7–8), TT, L(mm), Ls(mm), W(g), DC (giới tính, mã d/c/dc), sd, mo, no, Wo(g).
- Phân bố tần số theo W(g): min = 13 g, max = 272 g, khoảng $a$ = 10 g. Phần lớn cá thể nằm trong khoảng 23–83 g (đỉnh ở bin 63 g: 27 cá thể); đuôi phải kéo dài đến 272 g (phân phối lệch phải).

### Sheet "CSDL BTT1.XLS" – Nhân trắc học nữ phổ thông huyện Phú Xuyên, Hà Tây
- Các trường: STT, C.nang (cân nặng), V.dau (vòng đầu), V.co, VNBT, VNHVHS, VNTRHS, VCTD, VCTC, VKT, VCT, VCoT, DT, DCT (các số đo vòng ngực, vòng chi…). Chỉ có số liệu, chưa có phép tính.

## Tài liệu gốc
- Chương 6_ Phân tích cơ sở dữ liệu.xlsx
