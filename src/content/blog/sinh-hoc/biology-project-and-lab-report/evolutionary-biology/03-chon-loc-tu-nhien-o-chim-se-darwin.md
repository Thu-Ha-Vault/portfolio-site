---
title: 'Bài 3: Chọn lọc tự nhiên và tiến hoá loài chim sẻ Darwin'
type: lab-report
tags:
  - biology
  - evolutionary-biology
  - natural-selection
  - lab-report
section: Sinh học
folder: Sinh học / Biology Project and Lab Report / Evolutionary Biology
vaultPath: >-
  Resources/Sinh học/Biology Project and Lab Report/Evolutionary Biology/03 -
  Chọn lọc tự nhiên ở chim sẻ Darwin.md
order: 3
description: >-
  Báo cáo thực hành Sinh học tiến hoá – Nguyễn Thị Thu Hà, lớp Thứ 2 tiết 6-7.
  Dựa trên video HHMI "The Origin of Species: The Beak of the Finch" và handout
  BioInteractive "Evolution in Action: Data Analysis" (Student Hand
isIndex: false
---
> Báo cáo thực hành Sinh học tiến hoá – Nguyễn Thị Thu Hà, lớp Thứ 2 tiết 6-7. Dựa trên video HHMI "The Origin of Species: The Beak of the Finch" và handout BioInteractive "Evolution in Action: Data Analysis" (Student Handout V2, 04/2021).

## Mục đích
- Hiểu bằng chứng về **tổ tiên chung** và quá trình **hình thành loài** của 13 loài chim sẻ trên quần đảo Galápagos (Ecuador).
- Thấy được tầm quan trọng của việc **thu mẫu và phân tích chỉ số cá thể** để nhận định xu hướng tiến hoá.
- Dùng **thống kê mô tả**, **biểu đồ có thanh sai số 95% CI** và **kiểm định t (Student's t-test)** để xác định đặc điểm cơ thể nào quan trọng cho sự sống sót của chim sẻ đất trung bình qua đợt hạn hán 1977.

## Nguyên lý
- **Nghiên cứu của Peter & Rosemary Grant** (Princeton, từ 1973):
	- Đối tượng: **chim sẻ đất trung bình** (*Geospiza fortis*, medium ground finch) trên đảo **Daphne Major**.
	- Đo hằng năm hàng trăm cá thể: **khối lượng cơ thể (body mass)**, **chiều dài cánh (wing length)**, **chiều dài xương cổ chân (tarsus length** – đoạn chân giữa mắt cá và đầu gối), **độ sâu mỏ (beak depth)**.
- **Biến đổi môi trường 1977**:
	- Hạn hán kéo dài 18 tháng. Hạt nhỏ, mềm của cây **chamaesyce** (*Chamaesyce amplexicaulis*) – thức ăn ưa thích – trở nên khan hiếm.
	- Nguồn thức ăn còn lại chủ yếu là hạt **caltrop** (*Tribulus cistoides*): to, cứng, có gai nhọn.
	- Khoảng 1.200 cá thể lúc đầu → chưa đến 200 con sống sót (mất ~85%; handout ghi "hơn 80%"). (→ [Cá thể và quần thể](/blog/sinh-hoc/kien-thuc-chung/f-sinh-thai-hoc/19-ca-the-va-quan-the-sinh-vat/))
	- Chim lớn, mỏ to hơn có lợi thế ăn hạt caltrop → sống sót và sinh sản năm sau → **chọn lọc tự nhiên có định hướng**, tiến hoá có thể xảy ra **nhanh** (trong vài thế hệ). (→ [Cơ chế tiến hoá](/blog/sinh-hoc/kien-thuc-chung/e-tien-hoa/17-bang-chung-va-co-che-tien-hoa/), [Môi trường và biến dị](/blog/sinh-hoc/kien-thuc-chung/c-quy-luat-di-truyen/13-di-truyen-ngoai-nhan-moi-truong-va-bien-di/))
- **Hình thành loài**:
	- 13 loài chim sẻ Galápagos có chung tổ tiên – bằng chứng: **trình tự DNA**.
	- **Cách ly địa lý**: các quần thể sống trên các đảo khác nhau.
	- **Cách ly sinh sản** ở chim sẻ đất: dựa vào **tiếng hót** và **hình thái (mỏ)**; thí nghiệm phát loa của Grant: con đực chỉ phản ứng (bay đến loa) với tiếng hót của loài mình.
- **Thống kê mô tả** (handout Part 2):
	- **Phương sai mẫu** $s^2$, **độ lệch chuẩn** $s = \sqrt{s^2}$: độ phân tán quanh trung bình.
	- **Sai số chuẩn của trung bình** $SEM = \dfrac{s}{\sqrt{n}}$: ~68% trung bình mẫu nằm trong ±1 SEM quanh trung bình quần thể.
	- **Khoảng tin cậy 95%**: handout xấp xỉ $95\%\,CI \approx 2 \times SEM$; báo cáo dùng $1{,}96 \times SEM$ (hàm CONFIDENCE của Excel). (→ [Statistical Inference](/blog/sinh-hoc/bioinformatics/a-statistics-and-biostatistics/ii-statistical-inference/01-models-statistical-inference-and-learning/))
	- Thanh sai số 95% CI **không chồng nhau** → gợi ý khác biệt có ý nghĩa; chồng nhau → có thể không có ý nghĩa.
- **Kiểm định t hai mẫu** (handout Part 4): (→ [Hypothesis Testing](/blog/sinh-hoc/bioinformatics/a-statistics-and-biostatistics/ii-statistical-inference/05-hypothesis-testing-and-p-values/), [Kiểm định giả thiết](/blog/sinh-hoc/biology-project-and-lab-report/biostatistics-and-bioinformatics/02-kiem-dinh-gia-thiet-thong-ke/))
	- $H_0$: trung bình của nhóm không sống sót = trung bình nhóm sống sót (khác biệt do ngẫu nhiên).
	- So sánh $|t_{obs}|$ với $t_{crit}$ (n = 50/nhóm → $t_{crit} = 1{,}98$, mức 5%): $|t_{obs}| > t_{crit}$ → bác bỏ $H_0$.
- **Phần mở rộng của handout** (báo cáo không làm): vẽ scatterplot độ sâu mỏ – chiều dài cánh, thêm đường **hồi quy tuyến tính** và tính **hệ số xác định** $r^2$ (tỷ lệ biến thiên của y được x giải thích). (→ [Linear and Logistic Regression](/blog/sinh-hoc/bioinformatics/a-statistics-and-biostatistics/iii-statistical-models-and-method/01-linear-and-logistic-regression/))

## Vật liệu & phương pháp
- **Phần 1 – Xem video** HHMI (http://www.hhmi.org/biointeractive/origin-species-beak-finch):
	- 00:00–05:36: bằng chứng tổ tiên chung của 13 loài.
	- 05:37–11:08: quần thể chim sẻ đất trung bình trên Daphne Major thay đổi theo môi trường.
	- 11:09–15:45: định nghĩa loài, cơ chế cách ly sinh sản, từ một quần thể tổ tiên thành nhiều loài.
	- Đọc thêm: chim sẻ "ma cà rồng" hút máu chim điên trên Galápagos (VnExpress).
- **Phần 2 – Phân tích số liệu**:
	- Số liệu (Phụ lục 1): **100 cá thể** chim sẻ đất trung bình sinh 1973–1976; **50 không sống sót** (chết năm 1977) và **50 sống sót** (còn sống năm 1978).
	- Tính Mean, SD, SEM, 95% CI cho 4 đặc điểm (Excel) → vẽ 4 biểu đồ cột trung bình kèm thanh sai số (R/ggplot). (→ [Thống kê mẫu và ước lượng](/blog/sinh-hoc/biology-project-and-lab-report/biostatistics-and-bioinformatics/01-dac-trung-thong-ke-mau-va-uoc-luong-tham-so/))
	- **F-test** so sánh phương sai ($H_0'$: phương sai khác nhau do ngẫu nhiên) → chọn **t-Test: Two-Sample Assuming Equal Variances** (Excel, df = 98).

## Kết quả chính
- **Câu hỏi trắc nghiệm (Phần 1)** – đáp án đã chọn (tô đỏ trong bản gốc):
	- Khác biệt cấu trúc mỏ là bằng chứng các loài **thích nghi với môi trường khác nhau qua nhiều thế hệ**. (→ [Chim và thú](/blog/sinh-hoc/biology-project-and-lab-report/biological-field-study/02-dvcxs-tren-can-chim-va-thu/))
	- Tổ tiên chung của 13 loài: bằng chứng **trình tự DNA**.
	- Cây phát sinh loài: mọi chim sẻ Galápagos **gần nhau hơn so với chim sẻ đất liền** (mainland finch).
	- Cách ly địa lý = hai quần thể sống trên **các đảo khác nhau**.
	- Bằng chứng cách ly sinh sản: chọn "i, ii và iv" (khác đảo, khác mùa giao phối, khác tiếng hót).
	- Cách Grant kiểm tra giả thuyết tiếng hót: chọn phương án phát ghi âm tiếng hót của chim sẻ đất trung bình và chim sẻ xương rồng qua loa vào các thời điểm khác nhau; bằng chứng: **con đực chỉ đến loa khi phát tiếng hót cùng loài**.
- **Bảng 1 – Thống kê mô tả** (n = 50 mỗi nhóm):

| Nhóm | Đặc điểm | Mean | SD | SEM | 95% CI (±) |
|---|---|---|---|---|---|
| Không sống sót | Khối lượng cơ thể (g) | 15,713 | 1,357 | 0,192 | 0,376 |
| | Chiều dài cánh (mm) | 67,789 | 2,276 | 0,322 | 0,637 |
| | Chiều dài xương cổ chân (mm) | 19,039 | 0,837 | 0,118 | 0,234 |
| | Độ sâu mỏ (mm) | 9,111 | 0,880 | 0,124 | 0,246 |
| Sống sót | Khối lượng cơ thể (g) | 16,994 | 1,757 | 0,248 | 0,487 |
| | Chiều dài cánh (mm) | 69,297 | 2,334 | 0,330 | 0,647 |
| | Chiều dài xương cổ chân (mm) | 19,347 | 0,858 | 0,121 | 0,238 |
| | Độ sâu mỏ (mm) | 9,674 | 0,842 | 0,119 | 0,233 |

- **Biểu đồ**: cả 4 đặc điểm, trung bình nhóm sống sót **lớn hơn** nhóm không sống sót; 95% CI **không chồng nhau** ở mọi đặc điểm **trừ chiều dài xương cổ chân**.
- **Kiểm định t** (Two-Sample Assuming Equal Variances, df = 98, $t_{crit}$ hai phía = 1,984):

| Đặc điểm | p (F-test phương sai) | t Stat | p hai phía | Kết luận |
|---|---|---|---|---|
| Khối lượng cơ thể | 0,07 | −4,08 | 0,00009 | Khác biệt có ý nghĩa |
| Chiều dài cánh | 0,86 | −3,27 | 0,0015 | Khác biệt có ý nghĩa |
| Chiều dài xương cổ chân | 0,87 | −1,82 | 0,072 | Không có ý nghĩa (ngẫu nhiên) |
| Độ sâu mỏ | 0,76 | −3,27 | 0,0015 | Khác biệt có ý nghĩa |

- t Stat âm vì lấy (không sống sót − sống sót): nhóm **sống sót có giá trị lớn hơn** ở cả 3 đặc điểm có ý nghĩa.
	- Lưu ý: phần lời trong báo cáo gốc viết nhóm sống sót có chiều dài cánh và độ sâu mỏ "nhỏ hơn" – mâu thuẫn với bảng trung bình và dấu t Stat; note này ghi theo số liệu.
- Số liệu thô trong Chim sẻ.xlsx: sheet "Trang tính2" chứa số liệu 2 nhóm và Mean/SD/SEM/CI; sheet "Trang tính1" (bảng gốc có thêm giới tính, chiều dài và chiều rộng mỏ) bị lỗi định dạng – nhiều số thập phân hiển thị thành ngày tháng.

## Kết luận & thảo luận
- **Khối lượng cơ thể, chiều dài cánh và độ sâu mỏ** khác biệt có ý nghĩa thống kê giữa nhóm sống sót và không sống sót → là các đặc điểm **quan trọng cho sự sống sót** trong hạn hán 1977.
- Chiều dài xương cổ chân không khác biệt có ý nghĩa → không phải yếu tố quyết định.
- Diễn giải sinh học (theo Phần 1): khi hạt nhỏ, mềm cạn kiệt, chim **to hơn, mỏ sâu hơn** mới tách được hạt caltrop to, cứng → sống sót và sinh sản → thế hệ sau có mỏ lớn hơn: ví dụ trực tiếp của **chọn lọc tự nhiên** quan sát được trong thời gian ngắn. (→ [Tổng ôn](/blog/sinh-hoc/kien-thuc-chung/h-tong-on/26-tong-on-va-meo-lam-bai/))
- Xem thêm: [Mô phỏng trong Virtual Lab](/projects/virtual-lab/08-thi-nghiem-giai-doan-3/) – protocol `ev-finch` tính lại đúng bảng thống kê và t-test trên 100 cá thể.

## Tài liệu gốc
*Báo cáo Sinh Tiến hoá - Bài 3 - Nguyễn Thị Thu Hà.pdf*

- Handout BioInteractive "Evolution in Action: Data Analysis":

*EvoAction-StudentHO2-act.pdf*

- Số liệu 100 cá thể chim sẻ đất trung bình: Chim sẻ.xlsx
