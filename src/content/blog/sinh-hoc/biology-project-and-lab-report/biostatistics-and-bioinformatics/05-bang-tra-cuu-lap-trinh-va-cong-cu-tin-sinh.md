---
title: 'Programming: Bảng tra cứu lệnh R, SQL, công cụ tin sinh và hoá chất'
type: course-note
tags:
  - biology
  - bioinformatics
  - r
  - sql
  - cheat-sheet
  - course-note
section: Sinh học
folder: Sinh học / Biology Project and Lab Report / Biostatistics and Bioinformatics
vaultPath: >-
  Resources/Sinh học/Biology Project and Lab Report/Biostatistics and
  Bioinformatics/05 - Bảng tra cứu lập trình và công cụ tin sinh.md
order: 5
description: >-
  File Excel tự tổng hợp dạng cheat sheet gồm 4 sheet: Programming (~320 dòng
  lệnh: R 97, SQL 79, MySQL 138, Git 5, Google Sheet 3), Shortcut (phím tắt
  RStudio), Tools (công cụ tin sinh học online) và Hoá chất (hoá chất th
isIndex: false
---
> File Excel tự tổng hợp dạng **cheat sheet** gồm 4 sheet: **Programming** (~320 dòng lệnh: R 97, SQL 79, MySQL 138, Git 5, Google Sheet 3), **Shortcut** (phím tắt RStudio), **Tools** (công cụ tin sinh học online) và **Hoá chất** (hoá chất thường dùng trong thí nghiệm sinh học).

## Lệnh R

### Nhập – xuất và cấu trúc dữ liệu
- `setwd()`: đặt thư mục làm việc; `download.file()`: tải file.
- `read.csv()` / `write.csv()`: nhập/xuất CSV (phân cách dấu phẩy); `read.delim()`: file phân cách tab; `fread()` (gói data.table): đọc nhanh file lớn.
- `class()`, `typeof()`: kiểu dữ liệu / kiểu lưu trữ nội bộ; `str()`: cấu trúc đầy đủ của object; `dim()`: số hàng × số cột; `colnames()`.
- Chọn cột: `df$column_name`, `df[["column_name"]]`; chọn tập con cột: `df[c(...)]`; `number1:number2`: dãy số liên tiếp; `c()`: tạo vector.
- **Quy tắc ép kiểu (coercion)**: `logical > integer > numeric > complex > character` – không phải lúc nào cũng đảo ngược được mà không mất dữ liệu; `is.<type>()` kiểm tra, `as.<type>()` chuyển kiểu. (→ [Basic data types](/blog/sinh-hoc/bioinformatics/c-computational-programming-and-applied-biostatistics-and-bioinformatics/ii-r/r-tutorial/05-basic-data-types/))
- `factor()`, `subset()`, `merge()`, `na.omit()`, `data()`, `cbind()`; `rm()`/`remove()` xoá object. (→ [Thao tác dữ liệu trong R](/blog/sinh-hoc/biology-project-and-lab-report/introduction-to-data-analysis/02-cac-thao-tac-voi-du-lieu-trong-r/))
- `library("pkg")` (báo lỗi nếu gói không tồn tại) vs `require("pkg")` (trả về `FALSE` + cảnh báo – dùng trong hàm).

### Toán tử
- Gán `<-`, `=`; số học `+ - * / ^`, `%%` (chia lấy dư), `%/%` (chia nguyên).
- So sánh `< > <= >= == !=`; logic `!`, `&` / `|` (theo từng phần tử), `&&` / `||` (một giá trị).

### Thống kê và toán
- `mean()`, `sd()`, `var()`, `min()`, `max()`, `median()`, `range()`, `quantile()`, `summary()`.
- `IQR()`: độ trải giữa $IQR = Q_3 - Q_1$.
- `table()`: bảng tần số/bảng chéo (contingency table); `chisq.test()`: kiểm định $\chi^2$.
- `sort()`, `seq(from, to)`, `rep(x)`, `length()`, `sum()`, `prod()`, `choose()`; đại số ma trận `det()`, `solve()` (giải $A x = b$).
- **Họ hàm phân phối** `d/p/q/r` + tên phân phối: `d` mật độ, `p` hàm phân phối, `q` phân vị, `r` sinh số ngẫu nhiên:
	- `norm` (chuẩn), `binom` (nhị thức), `pois` (Poisson), `unif` (đều), `nbinom` (nhị thức âm), `beta`, `chisq` ($\chi^2$), `geom` (hình học), `exp` (mũ), `t` (Student), `f` (Fisher).

### Lập trình
- Họ `apply`: `apply()` (ma trận theo hàng/cột → vector), `lapply()` (list → list), `sapply()` (list → kết quả đơn giản hoá), `mapply()` (nhiều vector), `tapply()` (áp hàm theo nhóm → bảng). (→ [Functions](/blog/sinh-hoc/bioinformatics/c-computational-programming-and-applied-biostatistics-and-bioinformatics/ii-r/r-tutorial/06-functions/))
- `strsplit()`, `unlist()`; `if (...) {...} else {...}`; `for (i in vector) {...}`.
- `R.version.string`: xem phiên bản R; `update.packages(ask = FALSE, checkBuilt = TRUE)`: cập nhật gói (2–3 tháng/lần).
- Xem thêm: [R](/blog/sinh-hoc/bioinformatics/c-computational-programming-and-applied-biostatistics-and-bioinformatics/ii-r/r-tutorial/) – các khoá R trong vault (R Tutorial, R Xóm Data) để học có hệ thống những lệnh tra cứu ở đây

## Lệnh SQL và MySQL
- **SQL** (79 từ khoá): DDL (`CREATE DATABASE/TABLE/INDEX/VIEW/PROCEDURE`, `ALTER TABLE`, `ADD CONSTRAINT`, `DROP …`, `BACKUP DATABASE`), ràng buộc (`PRIMARY KEY`, `FOREIGN KEY`, `CHECK`, `DEFAULT`, `UNIQUE`, `NOT NULL`), thao tác dữ liệu (`INSERT INTO`, `UPDATE`, `DELETE`, `TRUNCATE TABLE`), truy vấn (`SELECT`, `FROM`, `WHERE`, `AND/OR`, `IN`, `BETWEEN`, `LIKE`, `DISTINCT`, `ORDER BY ASC/DESC`, `GROUP BY`, `HAVING`, `CASE`, `EXISTS`, `ANY/ALL`, `LIMIT`/`TOP`), các loại `JOIN` (INNER, LEFT, RIGHT, FULL OUTER), `UNION`/`UNION ALL`. (→ [SQL](/blog/sinh-hoc/bioinformatics/c-computational-programming-and-applied-biostatistics-and-bioinformatics/iv-sql/), [SQL Tutorial](/blog/sinh-hoc/bioinformatics/c-computational-programming-and-applied-biostatistics-and-bioinformatics/iv-sql/sql-tutorial/01-tutorial/))
- **MySQL functions**:
	- *String* (33): `CONCAT`, `CONCAT_WS`, `LENGTH` vs `CHAR_LENGTH`, `SUBSTRING`, `SUBSTRING_INDEX`, `LOCATE`, `REPLACE`, `TRIM`, `LPAD/RPAD`, `UPPER/LOWER`…
	- *Numeric* (36): `ABS`, `CEIL/FLOOR`, `ROUND`, `TRUNCATE`, `POW`, `SQRT`, `LN/LOG/LOG10/LOG2`, `MOD`, `RAND`, các hàm tổng hợp `AVG`, `COUNT`, `SUM`, `MAX`, `MIN`…
	- *Date* (50): `CURDATE`, `NOW`, `DATE_ADD/DATE_SUB`, `DATEDIFF`, `DATE_FORMAT`, `STR_TO_DATE`, `EXTRACT`, `YEAR/MONTH/DAY/WEEK/QUARTER`…
	- *Advanced* (19): `CASE`, `IF`, `IFNULL`, `NULLIF`, `COALESCE`, `CAST`, `CONVERT`, `LAST_INSERT_ID`, `VERSION`…

## Git, Google Sheets và phím tắt
- **Git (Terminal)**: `which git`, `git --version`, `git config --global user.name "<tên>"`, `git config --global user.email "<email>"`, `git config --global --list`.
- **Google Sheets**: `SORT(range, sort_column, is_ascending, …)`, `CONVERT(value, start_unit, end_unit)`, `IMPORTRANGE(spreadsheet_url, range_string)`.
- **Phím tắt RStudio**:

| Thao tác | macOS | Windows |
|---|---|---|
| Tạo chunk | `Cmd+Option+I` | `Ctrl+Alt+I` |
| Chạy code trong chunk | `Cmd+Shift+Enter` | `Ctrl+Shift+Enter` |
| Chạy một dòng | `Cmd+Enter` | `Ctrl+Enter` |

- Tạo R Notebook: *File → New File → R Notebook*; chọn thư mục làm việc: *Session → Set Working Directory → Choose Directory*. (→ [RStudio and R notebooks](/blog/sinh-hoc/bioinformatics/c-computational-programming-and-applied-biostatistics-and-bioinformatics/ii-r/r-tutorial/02-rstudio-and-r-notebooks/))

## Công cụ tin sinh học (sheet Tools)
- **Đang dùng được (O)**:

| Công cụ | Vai trò |
|---|---|
| Genome VISTA, CHAOS-DIALIGN, Partial order alignment (POASTA – GitHub) | So sánh cấu trúc chuỗi |
| ClustalW (GenomeNet, DDBJ) | Phân tích cấu trúc chuỗi (multiple alignment) |
| OLIGO Primer Analysis Software, Primer3 | Phân tích và thiết kế mồi |
| BLAST (NCBI) | Tìm trình tự tương đồng |
| iCn3D (NCBI) | Hiển thị cấu trúc 3D |
| UCSC Genome Browser, Ensembl; Plant genome (NGDC) | Dữ liệu genome người / thực vật |
| ENA (EBI) | Lấy file dữ liệu theo mã SRA |
| Galaxy (usegalaxy.org) | Đọc/xử lý file nặng |

- **Không còn truy cập được (X)**: DIALIGN (Bielefeld), AlignACE, MAVID, WAViS, Gibbs Motif Sampler, Meta-MEME, GTOP sequence homolog search.

## Hoá chất thí nghiệm (sheet Hoá chất)
- **Đệm (buffer)**:
	- **Tris** – $(HOCH_2)_3CNH_2$: thành phần dung dịch đệm pH 7–9 (≈ pH sinh lý); tăng tính thấm màng. Hạn chế: ức chế một số enzyme, tạo phức (chelate) ion kim loại; pH thay đổi theo nhiệt độ và nồng độ.
	- **Tris-HCl**: đệm đa dụng trong kỹ thuật di truyền, stock 1 M; tăng 1 °C → pH giảm 0,03.
	- **TE (Tris-EDTA)**: hoà tan và bảo quản DNA (EDTA bắt ion kim loại hoá trị 2 cần cho nuclease).
	- **Sodium acetate** (stock 3 M), **Ammonium acetate** (stock 10 M): trung hoà điện tích âm của acid nucleic để tủa bằng ethanol.
	- **TAE** (stock 50×): điện di acid nucleic, rẻ hơn, tách đoạn DNA dài tốt và chạy nhanh hơn. **TBE** (stock 10×): tách đoạn DNA ngắn tốt hơn, phù hợp điện di thời gian dài.
	- **MOPS** (Good's buffer), **SSC** (sodium citrate + NaCl, stock 20×, dùng khi chuyển màng và lai).
- Các hoá chất khác mới liệt kê tên (chưa ghi chi tiết): ethidium bromide, DNA ladder, SYBR Safe, bromophenol blue, Coomassie stain, TSS, PBS, IPTG, Tween 20, SDS, Triton X-100, CMC, các protein huỳnh quang GFP/CFP/YFP/mRFP1, acridine orange, 7-AAD, Annexin-V, carboxyfluorescein diacetate, ONPG. (→ [Điện di 2D-PAGE](/blog/sinh-hoc/biology-project-and-lab-report/proteomics-and-structural-biology/02-dien-di-hai-chieu-2d-page/))

## Tài liệu gốc
- Programming.xlsx
