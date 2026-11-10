---
title: RStudio and R notebooks
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
  Biostatistics and Bioinformatics/II - R/R - Tutorial/02 - RStudio and R
  notebooks.md
url: /blog/rstudio-and-r-notebooks/
topic: biology
updated: '2026-10-14'
order: 2
description: 'Cửa sổ RStudio:'
isIndex: false
---
## RStudio

- Cửa sổ RStudio:

![image_036](/vault-assets/image-036-ac9a3654.png)

- Console: Bên phải màn hình. Là một giao diện dòng lệnh cho R, ta gõ một lệnh và ấn Enter để chạy, kết quả hiển thị bên dưới.

- Trong R, câu lệnh bắt đầu bằng ký tự (>), khi ta thấy kí tự này ở phần đầu của console, có nghĩa là R đang đợi để nhập lệnh tiếp theo.

- Nếu ta ấn Enter trước khi hoàn thành lệnh, dòng tiếp theo sẽ bắt đầu bằng kí tự (+). Cho ta biết rằng R cần thêm input.

![image_037](/vault-assets/image-037-96577865.png)

- The workspace browser: bên trái phía trên màn hình là workspace (hay environment) browser. Phần này cho thấy các đối tượng có mặt trong môi trường.

- Trong lập trình nói chung, environment là ngữ cảnh mà lệnh sẽ chạy: hệ điều hành (operating system),  phần mềm cài đặt,...

- RStudio chỉ show giá trị của đối tượng mà ta đã gán

![image_038](/vault-assets/image-038-f288de74.png)

![image_039](/vault-assets/image-039-e0912d2a.png)

- Kí hiệu (<-) là một cặp kí tự đặc biệt gọi là toán tử gán (assignment operator) giúp lưu trữ kết quả của phép cộng vào đối tượng ở bên trái mũi tên.

- Do không có đối tượng ‘a’ tồn tại trong environment, R tạo một đối tượng ‘a’ mới để giữ kết quả của phép cộng 1 + 1

- Khi ta gõ vào console đối tượng, hay “biến”, R sẽ trả về kết quả là giá trị của phép tính, ‘2’. Cho đến khi biến này bị loại bỏ hoặc gán lại, mỗi vị trí ta dùng ‘a’, R sẽ đánh giá biến và thay thế nó bằng ‘2’.

- Kí tự (<-) là 1 trong hai toán tử gán trong R. Trong hầu hết trường hợp, nó tương đương với kí tự (=), nhưng có một số ngoại lệ.

## R notebooks

- Tạo một R notebook mới bằng thanh menu: File > New File > R Notebooks:

![image_040](/vault-assets/image-040-965f9253.png)

- R notebooks là 1 loại tài liệu markdown đặc biệt kết hợp các đoạn mã R có thể thực thi và đầu ra của chúng, cùng với văn bản có thể được định dạng bằng các ký tự đặc biệt để mã hóa định dạng như tiêu đề, phông chữ in đậm hoặc in nghiêng, dấu đầu dòng, liên kết, v.v.

- Markdown được thiết kế để được đọc như nguyên trạng, nhưng có thể được chuyển thành PDF hoặc HTML. Dùng R notebooks để lưu trữ tài liệu, code, và figure cho 1 project cùng nhau, và tạo một bản báo cáo được định dạng tốt.

- Trong một notebook, code được sắp xếp vào chunks (khối), giúp phân tách phần text  khỏi mọi ghi chú hoặc hình có trong note.

- Tạo chunks mới bằng cách click vào nút ‘Chunk’ trên thanh công cụ (toolbar) hoặc ấn “Cmd+Option+I” trên Mac và “Ctrl+Alt+I” trên Window. (→ [Bảng tra cứu lập trình](/blog/programming-bang-tra-cuu-lenh-r-sql-cong-cu-tin-sinh-va-hoa-chat/))

- Các đoạn mã trong chunks được thực thi bằng cách nhấp vào nút ‘Run’ trong chunk hoặc đặt con trỏ chuột (cursor) vào trong chunk và ấn ‘Cmd+Shift+Enter” trên Mac và ‘Ctrl+Shift+Enter” trên Window. Ta có thể chạy một dòng code bằng cách đặt cursor vào bất cứ trong trong dòng code và ấn ‘Cmd+Enter’ trên Mac và ‘Ctrl+Enter’ trên Window

- Tạo folder cho khoá học, và lưu notebook:

- Tên file: không có dấu cách (space) hoặc kí tự đặc biệt. Chỉ sử dụng kí tự chữ-số (alphanumeric), dấu chấm (dots), gạch chéo (dash), và gạch dưới (underscores) để chắc chắn rằng hầu hết ngôn ngữ lập trình sẽ hiểu được tên file.
