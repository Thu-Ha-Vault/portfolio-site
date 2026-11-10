---
title: Data frames
type: note
tags:
  - bioinformatics
  - computational-programming-and-applied-biostatistics-and-bioinformatics
  - r
section: Sinh học
folder: >-
  Sinh học / Bioinformatics / C - Computational Programming and Applied
  Biostatistics and Bioinformatics / II - R / R - Tutorial
vaultPath: >-
  Resources/Sinh học/Bioinformatics/C - Computational Programming and Applied
  Biostatistics and Bioinformatics/II - R/R - Tutorial/04 - Data frames.md
url: /blog/data-frames/
topic: biology
updated: '2026-10-14'
order: 4
description: >-
  Đối tượng birthweight là gì? Trong khung enviroment, ta có thể thấy nó là ‘42
  obs. of 18 variables”. 42 quan sát của 18 biến: một dữ liệu bảng có 42 hàng và
  18 cột. Ta có thể xác nhận điều này bằng lệnh class() và dim().
isIndex: false
---
## Structure of a data frame (Cấu trúc của khung dữ liệu)

- Đối tượng birthweight là gì? Trong khung enviroment, ta có thể thấy nó là ‘42 obs. of 18 variables”. 42 quan sát của 18 biến: một dữ liệu bảng có 42 hàng và 18 cột. Ta có thể xác nhận điều này bằng lệnh class() và dim().

![image_041](/vault-assets/image-041-b0fe7bbc.webp)

- Chạy dim(birthweight) hỏi R kích thước của đối tượng birthweight, đáp án là 42 (hàng) và 21 (cột). [1] không phải một phần của output: Đây là một chỉ mục của R để giúp ta theo dõi giá trị khi output là một giá trị lớn.

- Data frame sắp xếp dữ liệu thành hàng và cột. Đối tượng phải là một hình chữ nhật với mỗi hàng có cùng số lượng trường, và tất cả giá trị trong một cột phải cùng dạng (type). (→ Cấu trúc dữ liệu)

- Mỗi cột của data frame là một vector. Một vector là tập hợp có thứ tự các giá trị cùng loại.

- Thông thường, ta không muốn làm việc trên cả data frame. Ví dụ, để tính trung bình cần nặng khi sinh, ta không cần thông tin về cột “paternal.education”.

- Có 3 cách để lấy tập con từ data frame: `$`, `[[`, và `[` (→ [Thao tác dữ liệu trong R](/blog/cac-thao-tac-voi-du-lieu-trong-r/))

## Selecting a single column using the `$` and `[[`

- Cách dễ nhất để lấy tất cả giá trị trong cột “birthweight” là sử dụng `$`: `birthweight$birthweight`

![image_042](/vault-assets/image-042-0d697676.webp)

- Lúc này, có 3 số trong ngoặc vuông: một ở mỗi dòng output. Đó là vị trí của số tiếp theo trong vector input. Chúng cho ta một ý tưởng chung về độ dài của vector là giúp ta xác định giá trị của một quan sát nhất định chỉ với một cái liếc.

- Sau khi vector về cân nặng sau sinh đã được trích ra từ phần còn lại của df, nó có thể được dùng để tính trung bình: `mean(birthweight$birthweight)`

- `$` là một đường tắt cho `[[`, yêu cầu gõ thêm 6 kí tự nữa (hai cặp ngoặc vuông và 1 cặp ngoặc kép. Chúng hoạt động giống nhau, trả kết quả: 
`birthweight[["birthweight"]]`

![image_043](/vault-assets/image-043-adc808fe.webp)

- Một điểm khác biệt là `[[` hoạt động với index, hoặc column number, `$` thì không.

## Selecting a subset of the data frame using the [ operator

- Khác với `$` và `[[`, trả giá trị trong trong phần tử được chỉ định, `[` trả về đối tượng cùng loại với tập mà nó được subset từ. Dùng `[` để lấy cột thứ 5 sẽ trả về data frame với 42 hàng và 1 cột. Đây có thể nhìn như không có khác biệt lớn nhưng có thể quan trọng trong một số trường hợp. `birthweight[5]`

- Khi chỉ có 1 đối số, [ sẽ trả về một cột như một data frame mới.

- Vì [ trả về một data frame mới, nó có thể dùng để chỉ nhiều hàng hoặc/và cột.
birthweight[c(1,5)]

- Lệnh c() tạo một vector. Giúp R đối xử với index 1 và 5 như một thể. Điều này rất quan trong do birthweight[1,5] sẽ không tạo ra cùng ảnh hưởng.

- Khi hai đối số (argument) được cung cấp cho [, R sẽ lý giải nó là index của chiều thứ nhất (hàng 1) và chiều thứ hai (cột 5) và trả về giá trị của ô đó.

- Hành vi mặc định của [ là trả về toàn bộ đối tượng. Đối số đầu là một filter của chiều thứ nhất, đối số thứ 2 là filter của chiều thứ hai, …
birthweight[c(2,7,29), c(1,5)]: lấy dữ liệu từ hàng 2,7 29 và cột 1, 5.

- Nếu đặt một dấu cách trống sau dấu phẩy, sẽ trả về cả hàng.

- Và để trống trước dấu phẩy sẽ cho cả cột nhưng không tạo thành data frame mới mà có dạng như `$` và `[[`

- Dùng dấu ‘-’ trước một index hoặc nhóm index sẽ loại trừ cột hoặc hàng đó.
# exclude paternal data (columns 13-16)

- birthweight[c(1,3,5:13), -c(13:16)]: lấy dữ liệu từ hàng 1, 3, 5 đến 13 của data frame ngoại trừ cột 13 đến 16

- R cũng chấp nhận tên hàng hoặc cột trong ngoặc kép như một cách để subset từ data frame

- Cuối cùng, vector logic (TRUE/FALSE) cũng được dùng để subset data. Hàng hoặc cột tương ứng với “TRUE” sẽ được trả về, trong khi hàng hoặc cột tương ứng với “FALSE” sẽ bị loại trừ
birthweight[c(1,3,5:13), c(TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, FALSE, FALSE, FALSE, FALSE, TRUE, TRUE)]

- Kết quả của `birthweight$length < 50` là một vector TRUE/FALSE nên có thể sử dụng nó để subset data `birthweight[birthweight$length < 50, c(1,4:12,17,18)]`

- Subset một vector

- Một vector, như một cột của data frame, có thể subset bằng [ với một index hoặc một vector khác

- `birthweight$length[1]`: lấy cột length, hàng 1

- `birthweight$length[c(1,2)]`: cột length, hàng 1 và 2

## Exercise 1: exploring the data

- Dùng các hàng min(), max(), và mean() trên các subset của dataframe để trả lời các câu hỏi

- Khoảng giá trị của paternal ages (tuổi của phụ huynh) trong data set

- Trung bình của materal age (tuổi mẹ)

- Tuổi của người mẹ có giá trị maternal.cigarettes cao nhất

- Trung bình cân nặng trước khi có thai cao hơn hay thấp hơn giữa các người phụ nữ đẻ con nhẹ cân.
