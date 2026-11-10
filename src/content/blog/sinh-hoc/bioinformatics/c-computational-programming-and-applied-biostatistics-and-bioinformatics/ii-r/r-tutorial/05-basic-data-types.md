---
title: Basic data types
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
  Biostatistics and Bioinformatics/II - R/R - Tutorial/05 - Basic data types.md
url: /blog/basic-data-types/
topic: biology
updated: '2026-10-14'
order: 5
description: >-
  Chúng ta đã nói rằng giá trị logical có thể dùng để subset 1 data frame, và
  tất cả giá trị trong một cột của 1 data frame phải cùng một loại (type) hoặc
  lớp (class).
isIndex: false
---
Chúng ta đã nói rằng giá trị logical có thể dùng để subset 1 data frame, và tất cả giá trị trong một cột của 1 data frame phải cùng một loại (type) hoặc lớp (class).

## Understanding class

- R tuân theo data class cơ bản:

  - Homogeneous:

- Atomic data types (1D): có thể kiểm tra đối tượng data là atomic với lệnh is.atomic

  - numeric (includes integer and double)

  - character: lưu kí tự (chữ cái hoặc/và chữ số)

  - logical: TRUE, FALSE, hoặc NA (missing): kết quả của việc so sánh 2 item với relational operators (>, <, …)

  - complex

  - raw

- Matrix (2D)

- Array (ND)

- Heterogeneous:

- List (1D)

- Data frame (2D)

- Thông thường trong tin sinh, các giá trị thường thuộc 3 loại đầu.

- Có nhiều các để kiểm tra loại dữ liệu: typeof, storage.mode, mode, str, class (→ [Bảng tra cứu lập trình](/blog/programming-bang-tra-cuu-lenh-r-sql-cong-cu-tin-sinh-va-hoa-chat/))

![image_044](/vault-assets/image-044-5516caab.png)

## Coercion: converting between classes (chuyển đổi giữa các class)

- Birthweight data frame có 3 cột nên là giá trị logical: smoker, low.birthweight, và geriatric.pregnancy. Các câu hỏi này có thể được trả lời bằng TRUE/FALSE. Nhưng chỉ có geriatric.pregnancy được lưu trữ dưới dạng logical. Lưu trữ smoker và low.birthweight là giá trị logical sẽ dễ dàng sử dụng hơn, do chúng giúp subset dữ liệu dễ hơn.

- Chuyển đổi class của data được biết đến là coercion (cưỡng ép kiểu dữ liệu). (→ [Làm quen với R](/blog/lam-quen-voi-r/))

![image_045](/vault-assets/image-045-b4010a37.png)

- Lệnh as.logical() chuyển đổi low.birthweight thành một logical vector nhưng không thể chuyển đổi smoker và trả về một vector chứa các missing data biểu diễn bằng NA, tại sao?

- Luật coercion trong R tuân theo: logical > integer > numeric > complex > character (→ [Thao tác dữ liệu trong R](/blog/cac-thao-tac-voi-du-lieu-trong-r/))

- R có thể chuyển giá trị logical thành integer, lưu integer thành dạng numeric chung, hoặc biểu diễn dữ liệu numeric thành character, nhưng các coercion này không thể luôn đảo ngược mà không làm mất dữ liệu.

- Lệnh as.logical chỉ hoạt động trên low.birthweight theo cách mà chúng ta muốn do nó được mã hoá bằng 0 và 1. Nếu có một số khác được sử dụng, kết quả sẽ không như mong muốn

## Exercise 2: converting “smoker” from character to logical

- Coercion đơn giản không thể chuyển đổi cột smoker thành dạng logical. Làm thế nào để giải quyết vấn đề.

birthweight$smoker <- (birthweight$smoker == "yes")
