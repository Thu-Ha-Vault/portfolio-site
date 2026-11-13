---
title: >-
  Agile có hiệu quả hơn Waterfall? Tổng quan bằng chứng về Scrum, ước lượng
  tương đối và Agile quy mô lớn
type: article
tags:
  - article
  - business
  - agile
  - scrum
  - evidence-based-management
section: Business
folder: Business / B - Project Management
vaultPath: >-
  Projects/Portfolio Website/Bài viết/Kinh doanh/BV - 05 - Agile Project
  Management.md
url: /blog/agile-project-management/
topic: business
updated: '2026-11-13'
date: '2026-11-13'
status: draft
order: 5
description: >-
  Khoá Agile Project Management của Google trình bày Agile như lựa chọn hợp lý
  cho một thế giới nhiều biến động: giảm lãng phí, phản hồi nhanh, ước lượng
  bằng Planning Poker để tránh thiên kiến. Bài này đối chiếu từng tuyê
isIndex: false
---
Khoá Agile Project Management của Google trình bày Agile như lựa chọn hợp lý cho một thế giới nhiều biến động: giảm lãng phí, phản hồi nhanh, ước lượng bằng Planning Poker để tránh thiên kiến. Bài này đối chiếu từng tuyên bố đó với nghiên cứu thực nghiệm, từ tổng quan hệ thống đầu tiên về Agile đến các khảo sát hàng trăm dự án và các thực nghiệm về Planning Poker. Kết luận ngắn: Agile có lợi thế thật nhưng không lớn, rõ nhất ở sự hài lòng của các bên liên quan; nhiều "quy tắc Scrum" trong khoá học là thực hành bổ sung, và cả ba con số khảo sát khoá học dùng đều cần đọc lại.

## Tóm tắt

Đây là bài thứ năm của loạt *Quản lý dự án dựa trên bằng chứng*, viết theo dạng tổng quan bằng chứng (evidence review), không phải systematic review đầy đủ: không có protocol, nguồn được chọn có chủ đích. Mình ưu tiên các systematic review đã công bố, các nghiên cứu định lượng có cỡ mẫu lớn và các thực nghiệm về Planning Poker, rồi đối chiếu với Scrum Guide bản 2017 và 2020. Năm kết luận chính:

1. Bằng chứng ủng hộ Agile có thật nhưng yếu; tổng quan hệ thống đầu tiên xếp nó ở mức *very low* theo thang GRADE.
2. Lợi thế rõ nhất là sự hài lòng của các bên liên quan; lợi thế về thời gian và ngân sách nhỏ, hoặc không thấy ở nghiên cứu mới nhất.
3. Cách làm lai (hybrid) rất phổ biến và cho kết quả tương tự Agile thuần.
4. Planning Poker tốt hơn việc gộp máy móc các ước lượng cá nhân, nhưng không chính xác hơn một chuyên gia ước lượng một mình.
5. Agile quy mô lớn (SAFe, LeSS, Spotify model) chủ yếu dựa trên báo cáo kinh nghiệm.

## 1. Vì sao "Agile tốt hơn" cần được kiểm chứng

Course 5 của Google Project Management Certificate dạy Agile bằng một câu chuyện mạch lạc: thế giới ngày càng biến động, bất định, phức tạp và mơ hồ (VUCA), kế hoạch lập sẵn sẽ lỗi thời, còn Agile với vòng lặp ngắn và phản hồi liên tục giúp giảm lãng phí. Khoá học không cực đoan; giảng viên Sue đánh giá cao ứng viên không coi Waterfall là giải pháp tồi nhất. Nhưng suốt khoá học không có một nghiên cứu so sánh hay cỡ tác động nào, nên người học có niềm tin mạnh mà không có dữ liệu để bảo vệ nó trước một người quản lý hoài nghi.

Câu hỏi "Agile có tốt hơn Waterfall không?" cũng đặt chưa đúng. Thành công của dự án có nhiều chiều: đúng hạn, đúng ngân sách, đủ phạm vi, đạt chất lượng, làm hài lòng khách hàng và nhà tài trợ. Luận điểm của bài: câu hỏi đúng là **Agile tốt hơn ở chiều nào, trong bối cảnh nào, với mức bằng chứng nào**.

Để đo "mức bằng chứng", bài mượn thang GRADE mà Dybå và Dingsøyr (2008) dùng: cao (high), trung bình (moderate), thấp (low), rất thấp (very low). Thử nghiệm ngẫu nhiên khởi đầu ở mức cao, nghiên cứu quan sát ở mức thấp, rồi bị hạ mức nếu thiết kế có hạn chế hay kết quả không nhất quán. Từ mục 3, mỗi mục kết thúc bằng một mức do mình ước tính theo tinh thần đó, không phải đánh giá GRADE chính thức. Hai giới hạn cần nói ngay: gần như toàn bộ bằng chứng đến từ phát triển phần mềm, và các nghiên cứu định lượng lớn đều là khảo sát hồi cứu, người trả lời tự báo cáo.

## 2. Waterfall và Agile: định nghĩa, nguồn gốc và những gì khoá học nói chưa đúng

### 2.1. Định nghĩa làm việc

**Waterfall** là cách làm tuần tự: xong giai đoạn này mới sang giai đoạn sau, yêu cầu được chốt sớm, thay đổi đi qua quy trình kiểm soát thay đổi (change control), sản phẩm bàn giao một lần ở cuối. **Agile** là cách làm lặp và tăng dần (iterative and incremental): yêu cầu được phép thay đổi, sản phẩm bàn giao thành nhiều phần nhỏ, thường xuyên. Nền tư tưởng của Agile là Agile Manifesto với 4 giá trị và 12 nguyên tắc (Beck et al., 2001). Bảng 1 rút gọn bảng so sánh bảy chiều của [Course 1](/blog/foundations-of-project-management/) và thêm cột bằng chứng (chi tiết ở mục 3).

**Bảng 1.** Waterfall và Agile theo bảy chiều của Course 1

| Chiều         | Waterfall                      | Agile                                 | Bằng chứng so sánh                             |
| ------------- | ------------------------------ | ------------------------------------- | ---------------------------------------------- |
| Vai trò PM    | Chỉ huy, phân công             | Scrum Master hỗ trợ, đội tự quản      | Chưa có trong các nguồn của bài                |
| Phạm vi       | Chốt sớm, qua change request   | Điều chỉnh theo vòng lặp              | Tương đương                                    |
| Lịch          | Tuần tự theo giai đoạn         | Các Sprint cố định thời hạn           | Không nhất quán                                |
| Chi phí       | Ước lượng kỹ từ đầu            | Có thể đổi sau mỗi vòng lặp           | Không nhất quán                                |
| Chất lượng    | Tiêu chí đặt từ đầu            | Phản hồi người dùng liên tục          | Tương đương                                    |
| Giao tiếp     | PM báo cáo theo mốc            | Trao đổi liên tục với khách hàng      | Chỉ có nghiên cứu mô tả (mục 7)                |
| Bên liên quan | PM quản lý mức tham gia        | Tiến độ dựa vào phản hồi              | Hài lòng cao hơn ở Agile và hybrid (tương quan) |

Các nghiên cứu không dùng cùng một cặp khái niệm: mô hình **linh hoạt** và **tuần tự** (Moløkken-Østvold & Jørgensen, 2005), **mức độ dùng Agile** tự đánh giá (Serrador & Pinto, 2015), hay traditional, agile và hybrid (Gemino et al., 2021). Bài gộp các nhãn này để tổng hợp, nên "Agile" ở mục 3 là một họ cách tiếp cận, không riêng Scrum.

### 2.2. Nguồn gốc: lịch sử dài hơn khoá học kể

Khoá học nói Waterfall ra đời thập niên 1970, Agile nổi lên thập niên 1990, chữ "scrum" xuất hiện năm 1986. Mỗi mốc đều chỉ đúng một phần.

Larman và Basili (2003) cho thấy phát triển lặp và tăng dần (iterative and incremental development, IID) đã được dùng từ **giữa thập niên 1950**, nhằm tránh cách làm tuần tự một lượt, nặng tài liệu. Câu "Agile nổi lên thập niên 1990" chỉ đúng với các phương pháp **có tên**; Dybå và Dingsøyr (2008) ghi DSDM là phương pháp agile đầu tiên, tiếp theo là XP.

Bài báo thường được gắn với Waterfall là của Royce (1970), và nó chứa một bất ngờ. Royce có vẽ chuỗi giai đoạn từ yêu cầu hệ thống đến vận hành, nhưng viết ngay sau đó rằng cách triển khai một lượt "is risky and invites failure", vì kiểm thử ở cuối là lần đầu các vấn đề thực sự lộ ra. Ông đề xuất năm bước khắc phục, trong đó có làm một phiên bản sơ bộ trước ("do it twice") và đưa khách hàng tham gia chính thức. Chữ "waterfall" không xuất hiện trong bài. Nói cho đúng: mô hình tuần tự được Royce mô tả, và phê phán, năm 1970; cái tên đến sau.

Chữ "scrum" đến từ bài báo của Takeuchi và Nonaka (1986) trên *Harvard Business Review*, một bài tạp chí chứ không phải chương sách như ghi chú khoá học viết. Hai tác giả đối lập cách làm tuần tự kiểu "chạy tiếp sức" với cách làm kiểu bóng bầu dục, và trong mục "Moving the Scrum Downfield" nêu sáu đặc điểm khớp với khoá học. Khoá học không nói rằng bài báo nghiên cứu sáu sản phẩm phần cứng (máy photocopy, máy ảnh, ô tô, máy tính) ở Fuji-Xerox, Canon, Honda và NEC, được chọn một phần vì đã thành công trên thị trường: đó là case study về người thắng cuộc, không có nhóm so sánh.

Scrum được phát triển từ đầu thập niên 1990 (Schwaber & Sutherland, 2020), nên có trước Agile Manifesto như khoá học nói. Manifesto ra đời ngày 11–13/2/2001 tại Snowbird, Utah, do 17 người tự gọi là "organizational anarchists" (Highsmith, 2001). Theo Hoda et al. (2018), từ đó Agile chi phối nửa sau của năm mươi năm kỹ nghệ phần mềm; đó là bằng chứng về **mức phổ biến**, chưa phải **hiệu quả**.

**Bảng 2.** Dòng thời gian đã kiểm chứng

| Thời điểm           | Mốc                                                                                      |
| ------------------- | ---------------------------------------------------------------------------------------- |
| Giữa thập niên 1950 | IID được dùng trong các dự án lớn (Larman & Basili, 2003)                                |
| 1970                | Royce mô tả chuỗi giai đoạn tuần tự và cảnh báo rủi ro của cách làm một lượt (Royce, 1970) |
| 1/1986              | Ẩn dụ rugby và scrum trên HBR (Takeuchi & Nonaka, 1986)                                  |
| Thập niên 1990      | Các phương pháp có tên: DSDM, XP, Scrum (Dybå & Dingsøyr, 2008)                          |
| 2/2001              | Agile Manifesto, 17 người (Beck et al., 2001)                                            |
| 2017, 2020          | Hai bản Scrum Guide khác nhau về cỡ đội (mục 7)                                          |

## 3. Agile có hiệu quả hơn Waterfall không? Ba lớp bằng chứng

### 3.1. Lớp 1: tổng quan hệ thống đầu tiên

Dybå và Dingsøyr (2008) tìm nghiên cứu thực nghiệm về Agile công bố đến hết 2005. Từ **1.996** nghiên cứu, họ giữ **36** nghiên cứu đạt yêu cầu về độ chặt, độ tin cậy và độ liên quan, xếp vào bốn chủ đề: áp dụng, yếu tố con người và xã hội, nhận thức về Agile, và nghiên cứu so sánh. Ba chi tiết đáng nhớ hơn kết luận chung:

- **Lệch về XP.** 25 nghiên cứu (76%) là về XP; các phương pháp thiên về quản lý như Scrum được nghiên cứu ít nhất so với mức phổ biến.
- **Đội mới làm Agile.** 24 nghiên cứu (73%) quan sát đội có dưới một năm kinh nghiệm Agile.
- **Năng suất.** Bốn nghiên cứu so sánh: ba báo tăng (337%, 42%, 46%), một báo giảm 44%. Con số 337% đến từ một thí nghiệm mà đội XP viết **gấp 3,5 lần số dòng code** nhưng không giao thêm chức năng; mức tăng 46% đến từ một case study mà đội Agile có kinh nghiệm về miền và ngôn ngữ cao hơn hẳn, tức có yếu tố gây nhiễu.

Bài học cho data analyst: chỉ số năng suất tính bằng dòng code có thể tăng vài trăm phần trăm mà giá trị giao cho khách hàng không đổi. Kết luận của hai tác giả: sức mạnh bằng chứng về lợi ích và hạn chế của Agile ở mức **very low**, mọi ước lượng tác động đều rất không chắc chắn.

### 3.2. Lớp 2: mức vượt effort

Moløkken-Østvold và Jørgensen (2005) khảo sát sâu các dự án phần mềm và thấy dự án dùng mô hình linh hoạt **vượt effort ít hơn** dự án tuần tự. Các tác giả không vội giải thích: họ viết lý do "không hiển nhiên", vì hai nhóm không khác nhau về quy mô, quy trình ước lượng hay tỷ lệ chức năng giao được. Khác biệt lớn nhất nằm ở lời người quản lý: ở dự án linh hoạt, họ hay nhắc **đặc tả yêu cầu tốt** và **cộng tác tốt với khách hàng** là lý do ước lượng chính xác. Phần tóm tắt không nêu cỡ mẫu và mức chênh lệch, nên chưa thể nói lợi thế này lớn đến đâu.

### 3.3. Lớp 3: nghiên cứu định lượng nhiều ngành

**Serrador và Pinto (2015)** phân tích hơn 1.000 dự án ở nhiều ngành và quốc gia, qua bảng hỏi trực tuyến gửi thành viên PMI và một số nhóm LinkedIn. Mỗi người mô tả **một dự án thành công hơn và một dự án kém thành công hơn**. Thành công được đo theo hai chiều: hiệu suất (chi phí, thời gian, mục tiêu) và sự hài lòng của khách hàng, nhà tài trợ. Mức dùng Agile có liên hệ dương với cả hai chiều, mạnh nhất ở chiều hài lòng; chất lượng tầm nhìn và mục tiêu điều tiết mối liên hệ ở mức gần có ý nghĩa thống kê, còn kinh nghiệm đội và độ phức tạp thì không (Serrador & Pinto, 2015; Association for Project Management, n.d.). Một kết quả hữu ích: lượng lập kế hoạch ban đầu **không khác** giữa dự án dùng nhiều và ít Agile, nên ngộ nhận "Agile không cần kế hoạch" không đứng vững.

**Gemino, Horner Reich và Serrador (2021)** phân tích 477 dự án đa ngành, quốc tế, trong đó **52%** là hybrid. Các mô hình hồi quy có R² từ 0,21 đến 0,41. Agile và hybrid làm tăng thành công đối với các bên liên quan so với cách làm truyền thống, trong khi **ngân sách, thời gian, phạm vi và chất lượng tương đương**; hybrid hiệu quả tương tự Agile thuần.

Ba lưu ý về phương pháp:

- **Cắt ngang, tự báo cáo.** Người trả lời tự chọn dự án, tự đánh giá mức dùng Agile và mức thành công. Thiết kế "một thành công, một kém" có thể phóng đại tương quan: đã biết dự án nào thành công thì dễ nhớ nó "linh hoạt" hơn. Bài 01 gặp đúng vấn đề này với số liệu tự báo cáo của PMI (xem [Course 1](/blog/foundations-of-project-management/)).
- **Phần lớn biến thiên chưa được giải thích.** R² tối đa 0,41 nghĩa là hơn một nửa khác biệt về thành công nằm ngoài mô hình.
- **Không có thử nghiệm ngẫu nhiên.** Bản tóm tắt của APM trích nhận xét của một tác giả rằng Agile "dẫn đến" dự án thành công hơn; cách nói nhân quả đó mạnh hơn những gì khảo sát cắt ngang cho phép.

### 3.4. Tổng hợp

Bảng 3 đặt bốn nguồn cạnh nhau theo kiểu forest plot định tính. Đây **không phải meta-analysis**: các nghiên cứu dùng thước đo khác nhau nên không gộp số được.

**Bảng 3.** Hướng tác động của Agile so với cách làm tuần tự (+ có lợi cho Agile; 0 không khác; ± không nhất quán; – không đo hoặc không có kết luận so sánh)

| Nghiên cứu                          | Thiết kế, cỡ mẫu                    | Thời gian, chi phí | Phạm vi, chất lượng | Hài lòng bên liên quan |
| ----------------------------------- | ----------------------------------- | ------------------ | ------------------- | ---------------------- |
| Dybå & Dingsøyr (2008)              | Systematic review, 36 nghiên cứu    | ± (năng suất)      | –                   | –                      |
| Moløkken-Østvold & Jørgensen (2005) | Khảo sát sâu dự án phần mềm         | +                  | 0                   | –                      |
| Serrador & Pinto (2015)             | Khảo sát hồi cứu, hơn 1.000 dự án   | +                  | + (trong hiệu suất) | + (mạnh nhất)          |
| Gemino et al. (2021)                | Khảo sát quốc tế, 477 dự án         | 0                  | 0                   | +                      |

Agile và hybrid **liên quan** đến sự hài lòng của các bên liên quan cao hơn, nhất quán ở hai nghiên cứu định lượng lớn. Lợi thế về thời gian và chi phí không nhất quán: có ở hai nghiên cứu cũ, không thấy ở nghiên cứu mới nhất. Tất cả là tương quan, chưa phải nhân quả.

> **Mức bằng chứng ước tính:** thấp cho chiều hài lòng của các bên liên quan; rất thấp cho thời gian, chi phí và năng suất.

## 4. "Giảm lãng phí" và "hợp với VUCA": tuyên bố thực nghiệm hay khung khái niệm?

Nghiên cứu thực nghiệm kỹ nhất về lãng phí trong phần mềm là của Sedano, Ralph và Péraire (2017). Họ quan sát tham gia hai năm năm tháng trên tám dự án tại Pivotal, một công ty tư vấn phát triển phần mềm, phỏng vấn 33 người và phân tích một năm chủ đề retrospective. Kết quả là **taxonomy lãng phí thực nghiệm đầu tiên**, gồm chín loại: làm sai tính năng hoặc sản phẩm, quản lý backlog kém, làm lại, giải pháp phức tạp không cần thiết, tải nhận thức thừa, căng thẳng tâm lý, chờ đợi và đa nhiệm, mất tri thức, giao tiếp kém.

Nghiên cứu này không chứng minh điều khoá học nói. Môi trường được quan sát có backlog và retrospective, vậy mà danh sách vẫn có "làm sai tính năng", đúng thứ Agile được cho là ngăn chặn. Không có nhóm so sánh dùng Waterfall, và chính các tác giả lưu ý grounded theory không cho phép suy rộng thống kê. "Agile giảm lãng phí" vì vậy là **mục tiêu thiết kế**, chưa phải kết quả đã đo.

Với **VUCA**, khoá học dùng bốn chữ như một chẩn đoán: VUCA cao thì chọn Agile. Bennett và Lemoine (2014) phản đối chính cách dùng gộp này. Theo họ, VUCA hay bị dùng như nhãn chung cho mọi tình huống khó đoán, khiến lãnh đạo nghĩ lập kế hoạch là vô ích; trong khi biến động, bất định, phức tạp và mơ hồ là bốn điều kiện khác nhau, cần phân bổ nguồn lực khác nhau. "VUCA cao thì chọn Agile" vì thế là quy tắc quá thô. Bằng chứng định lượng duy nhất gắn được với một thành tố cụ thể là kết quả của Moløkken-Østvold và Jørgensen (2005): lợi thế của mô hình linh hoạt đi kèm đặc tả yêu cầu và cộng tác với khách hàng, tức thành tố **bất định về yêu cầu**. Nguồn gốc VUCA thường được gán cho US Army War College như khoá học nói, nhưng mình chưa tìm được tài liệu gốc xác nhận.

> **Mức bằng chứng ước tính:** cả hai là khung khái niệm hợp lý; bằng chứng so sánh trực tiếp rất thấp.

## 5. Ba con số khảo sát: 72%, 85% và 30%

Mục này dùng cách đọc "một con số, ba câu hỏi" của bài 01: nguồn nào, đo ai, thu thập ra sao.

**72%.** Nguồn là *13th Annual State of Agile Report* (CollabNet VersionOne, 2019): khảo sát tháng 8–12/2018, do một nhà cung cấp công cụ phần mềm tài trợ, **1.319** phản hồi đầy đủ, 17% là khách hàng của nhà tài trợ. Câu gốc là "at least 72% of respondents" dùng Scrum hoặc hybrid có Scrum. Đơn vị là **người trả lời**, không phải "các đội" như khoá học nói. Biểu đồ trong báo cáo cho thấy 72% khớp với tổng của Scrum (54%), Scrum/XP hybrid (10%) và Scrumban (8%); mục "Other/Hybrid/Multiple" chiếm thêm 14%. Còn con số "95% có ít nhất một số dự án Agile thành công" gần như không mang thông tin, vì "thành công" không được định nghĩa.

**85%.** Không có trong State of Agile. Nguồn khớp nhất là thông cáo của Gartner (2019): 85% tổ chức **đã áp dụng hoặc dự định áp dụng** ("adopted, or plan to adopt") mô hình giao ứng dụng hướng sản phẩm (product-centric application delivery); người trả lời dùng mô hình này cho khoảng 40% công việc năm 2018. Ghi chú phương pháp cho biết đây là khảo sát trực tuyến quý 2/2018 với **129** chuyên gia IT thuộc Gartner Research Circle, một nhóm khách hàng của Gartner. Con số gồm cả ý định, nói về mô hình giao ứng dụng chứ không trực tiếp về Agile, và đến từ một mẫu nhỏ, không đại diện.

**30% hybrid.** Mình không tìm thấy con số này trong bản 13th. Chữ "hybrid" chỉ xuất hiện ở câu 72%, ở mục Scrum/XP hybrid và mục Other/Hybrid/Multiple. Cùng báo cáo có một con số 30% khác: 30% người trả lời nói tổ chức họ theo sát SAFe nhất. Có thể hai con số đã bị nhầm, nhưng đó chỉ là suy đoán; chưa tìm được nguồn thì không nên nhắc lại.

Nghiên cứu học thuật cho bức tranh rõ hơn về hybrid. Kuhrmann et al. (2019) thấy các công ty được khảo sát dùng hybrid cho từng dự án **kể cả khi có chính sách quy trình chung**, và dùng **bất kể quy mô hay ngành**. Gemino et al. (2021) xếp 52% dự án là hybrid. Hybrid là trạng thái thường gặp, không phải ngoại lệ.

**Bảng 4.** Một con số, ba câu hỏi

| Con số trong khoá học | Nguồn thật, mẫu                                  | Nên nói thế nào                                                              |
| --------------------- | ------------------------------------------------ | ---------------------------------------------------------------------------- |
| 72% dùng Scrum        | State of Agile 13th; 1.319 người, vendor tài trợ | "Ít nhất 72% người trả lời một khảo sát của vendor"                          |
| 85% product-centric   | Gartner; 129 chuyên gia IT, quý 2/2018           | "85% đã áp dụng **hoặc dự định** áp dụng mô hình giao ứng dụng hướng sản phẩm" |
| 30% hybrid            | Không tìm thấy                                   | Không dùng                                                                   |

Bài học chung: khảo sát của vendor cho biết xu hướng tự báo cáo, không cho biết hiệu quả.

## 6. Story point và Planning Poker: ước lượng tương đối có tốt hơn không?

### 6.1. Khoá học dạy gì

Khoá học lập luận: con người hay ước lượng thấp thời gian hoàn thành, nên Scrum dùng **ước lượng tương đối** (relative estimation, so khối lượng việc này với việc khác) thay cho **ước lượng tuyệt đối** (absolute estimation, theo giờ hoặc ngày), qua cỡ áo (T-shirt sizes) hoặc **story point** theo dãy Fibonacci. Trong **Planning Poker**, mỗi người úp lá bài ước lượng, cả nhóm lật cùng lúc rồi thảo luận các ước lượng chênh xa, nhờ đó tránh **thiên kiến mỏ neo** (anchoring bias).

Vế "con người hay ước lượng thấp" thuộc chủ đề ngụy biện lập kế hoạch của bài 03 (xem [Course 3: planning fallacy](/blog/project-planning-putting-it-all-together/)). Ở đây chỉ cần biết ước lượng chuyên gia (expert estimation) là chiến lược phổ biến nhất trong dự án phần mềm, và chưa có bằng chứng đáng kể rằng mô hình ước lượng hình thức tốt hơn (Jørgensen, 2004). Planning Poker là **một cách có cấu trúc để kết hợp ước lượng của nhiều chuyên gia**; câu hỏi đúng là nó có tốt hơn các cách kết hợp khác, hay tốt hơn một chuyên gia, không.

### 6.2. Bằng chứng

Usman et al. (2014) tổng quan 25 nghiên cứu sơ cấp về ước lượng trong Agile: kỹ thuật **chủ quan** (expert judgment, Planning Poker, use case points) được dùng nhiều nhất, story point là thước đo kích thước phổ biến, độ chính xác thường đo bằng MMRE và MRE. Tổng quan cho biết người ta **dùng** gì, chưa cho biết cái nào **chính xác hơn**.

Thực nghiệm trực tiếp nhất là của Moløkken-Østvold và Haugen (2007). Trong một dự án phần mềm thật, nhóm dùng Planning Poker cho một nửa số task. Với các task đó, ước lượng đồng thuận **ít lạc quan hơn** và **chính xác hơn** việc gộp máy móc (mechanical combination) các ước lượng cá nhân cho cùng task. Nhưng nhóm task đối chứng, do từng chuyên gia ước lượng riêng, đạt **độ chính xác tương tự**; xét theo trung vị, cả hai nhóm đều không thiên lệch.

Hai nghiên cứu khác thêm sắc thái, dù mình mới đọc được phần tóm tắt. Bài báo năm 2008 của cùng nhóm gợi ý rằng task ước lượng bằng Planning Poker tốn thêm effort gắn với độ phức tạp của thay đổi, có thể do thảo luận làm lộ thông tin (Moløkken-Østvold et al., 2008). Mahnič và Hovelja (2012) cho 13 đội sinh viên ước lượng user story và so với một nhóm chuyên gia: ước lượng của sinh viên lạc quan quá mức, và Planning Poker làm sự lạc quan đó tăng thêm; với chuyên gia, Planning Poker lại cho kết quả gần effort thực tế hơn trung bình các ước lượng cá nhân. Thiên kiến lạc quan do thảo luận nhóm giảm dần khi chuyên môn tăng.

**Bảng 5.** Các nghiên cứu về Planning Poker

| Nghiên cứu                       | Bối cảnh                         | So với                                 | Kết quả chính                                         |
| -------------------------------- | -------------------------------- | -------------------------------------- | ----------------------------------------------------- |
| Moløkken-Østvold & Haugen (2007) | Một dự án thật, nửa số task      | Gộp máy móc; một chuyên gia            | Tốt hơn gộp máy móc; ngang một chuyên gia             |
| Moløkken-Østvold et al. (2008)   | Cùng nhóm, có phân tích code     | Task không dùng Planning Poker         | Effort tăng thêm gắn với độ phức tạp (mới đọc tóm tắt) |
| Mahnič & Hovelja (2012)          | 13 đội sinh viên, nhóm chuyên gia | Trung bình ước lượng cá nhân          | Sinh viên lạc quan hơn; chuyên gia chính xác hơn (mới đọc tóm tắt) |
| Usman et al. (2014)              | Systematic review, 25 nghiên cứu | –                                      | Planning Poker, story point phổ biến; không so độ chính xác |

### 6.3. Đọc phản biện

**"Planning Poker tránh anchoring."** Úp bài rồi lật cùng lúc là cơ chế hợp lý, nhưng không nghiên cứu nào ở trên đo anchoring trực tiếp. Điều đã được chứng minh hẹp hơn: đồng thuận nhóm tốt hơn gộp máy móc, không tốt hơn một chuyên gia, và với người ít kinh nghiệm, thảo luận có thể làm ước lượng lạc quan hơn.

**"Story point chính xác hơn giờ."** Mình chưa tìm được nghiên cứu so sánh trực tiếp. Story point chủ yếu **đổi đơn vị**; muốn tính sai số vẫn phải quy về effort thực tế. Đối trọng là ước lượng ba điểm và PERT, chủ đề của bài 06 (xem [Course 6: three-point estimating](/blog/capstone-applying-project-management-in-the-real-world/)). Giá trị chắc hơn của Planning Poker có lẽ nằm ở **thảo luận**: ước lượng chênh nhau buộc mọi người nói ra điều mình biết về độ phức tạp.

<div class="callout callout-note">
<p class="callout-title">Hộp thống kê: vì sao nghiên cứu ước lượng hay dùng trung vị</p>

Sai số tương đối của một task là $\text{MRE} = \lvert \text{thực tế} - \text{ước lượng} \rvert / \text{thực tế}$; MMRE là trung bình của MRE. Vì là trung bình, MMRE rất nhạy với vài task lệch xa. Ví dụ giả định: năm task có MRE 0,1; 0,1; 0,2; 0,2 và 3,0 cho MMRE 0,72, nghe như sai trung bình 72%, nhưng trung vị chỉ 0,2. Trung vị là ước lượng vị trí bền vững, không bị kéo bởi giá trị cực đoan (Bruce & Bruce, 2017), nên Moløkken-Østvold và Haugen (2007) xét thiên lệch theo trung vị. Cùng ý này trong thống kê mô tả: [mean nhạy với outlier, median bền hơn](/blog/data-exploration-using-descriptive-statistics/).

</div>

> **Mức bằng chứng ước tính:** thấp. Ít nghiên cứu, mẫu nhỏ, một phần là sinh viên, chủ yếu trong một hoặc vài tổ chức.

## 7. Velocity, burndown, WIP và Daily Scrum: Scrum Guide nói gì, nghiên cứu nói gì

### 7.1. Scrum chính thức và thực hành đi kèm

Scrum Guide 2020 **không nhắc** story point, velocity hay Planning Poker. Burn-down chỉ là một ví dụ thực hành dự báo, cạnh burn-up và cumulative flow, và không thay được tư duy thực nghiệm (empiricism) (Schwaber & Sutherland, 2020). Phần lớn Module 3 của khoá học vì thế là thực hành cộng đồng hay dùng cùng Scrum, không phải luật của Scrum.

Hai chi tiết cần sửa. Con số "3–9 người" là quy định cho **Development Team** trong bản 2017, không tính Product Owner và Scrum Master trừ khi họ cũng làm việc trong Sprint Backlog (Schwaber & Sutherland, 2017). Bản 2020 dùng thuật ngữ **Developers** và viết Scrum Team "typically 10 or fewer people", tính cả Product Owner và Scrum Master. Còn Sprint Review tối đa 4 giờ và Retrospective tối đa 3 giờ là mức **cho Sprint một tháng**; Sprint ngắn hơn thì thường ngắn hơn (Schwaber & Sutherland, 2020).

### 7.2. Velocity

Lời khuyên không dùng velocity để so sánh các đội đúng vì **logic đo lường**, không cần thực nghiệm. Mỗi đội tự hiệu chỉnh story point theo task mốc của mình, nên "5 điểm" của hai đội không cùng thang đo; so velocity giữa hai đội giống so hai nhiệt kế không ghi đơn vị. Rủi ro là có thật: trong State of Agile 2019, velocity là thước đo thành công dự án được nhắc nhiều thứ ba (38% người trả lời), sau sự hài lòng của khách hàng (46%) và giá trị kinh doanh (42%) (CollabNet VersionOne, 2019). Khi một chỉ số nội bộ thành KPI, nó dễ bị thổi phồng.

### 7.3. Giới hạn việc dở dang và định luật Little

Câu "làm ít việc cùng lúc thì việc xong nhanh hơn" có cơ sở toán học là định luật Little, $L = \lambda W$: số việc trung bình trong hệ thống ($L$) bằng tốc độ việc đi qua ($\lambda$) nhân thời gian trung bình mỗi việc nằm trong hệ thống ($W$), với điều kiện các trung bình hữu hạn và quá trình ổn định (Little, 1961). Nếu tốc độ hoàn thành giữ nguyên, giảm việc dở dang (work in progress, WIP) thì mỗi việc xong sớm hơn. Nhưng định luật nói về trung bình dài hạn, và không tự làm tăng tổng sản lượng; sản lượng chỉ tăng nếu bớt đa nhiệm làm giảm thời gian chuyển việc, đúng loại lãng phí "chờ đợi và đa nhiệm" của Sedano et al. (2017). LeSS cũng đưa lý thuyết hàng đợi vào nguyên tắc của mình (LeSS Company, n.d.).

### 7.4. Daily Scrum

Stray, Sjøberg và Dybå (2016) nghiên cứu buổi stand-up hằng ngày bằng grounded theory với 12 đội phần mềm ở ba công ty tại Malaysia, Na Uy, Ba Lan và Anh: phỏng vấn 60 người, quan sát 79 buổi họp. Thái độ tích cực đến từ chia sẻ thông tin và cùng giải quyết vấn đề; thái độ tiêu cực đến từ việc buổi họp biến thành **báo cáo trạng thái cho quản lý**, quá dày và quá dài. Điều này khớp với khoá học: đội của Sue họp stand-up hai lần mỗi tuần, Sarah giữ buổi họp trong 15–20 phút. Phần retrospective và an toàn tâm lý thuộc bài 04 (xem [Course 4: retrospectives](/blog/project-execution-running-the-project/)).

> **Mức bằng chứng ước tính:** velocity và WIP dựa trên lập luận đo lường và toán học; Daily Scrum ở mức thấp, một nghiên cứu định tính kỹ.

### 7.5. Ví dụ từ dữ liệu riêng: timeline app Dictionaire

<div class="callout callout-example">
<p class="callout-title">Một dự án cá nhân đọc như dự án hybrid có WIP cao</p>

Mình theo dõi app từ điển đang làm bằng một sheet timeline (xem Mobile_App-Dictionary). Dữ liệu đọc ngày 13/11/2026 có 34 việc: **13** đã hoàn thành, **10** đang thực hiện, **11** chưa bắt đầu (dữ liệu dự án cá nhân, 2026).

![bv-05-agile-1](/vault-assets/bv-05-agile-1-7c74f999.webp)
*Hình 1. Trạng thái công việc theo giai đoạn, app Dictionaire.*

**Đọc theo hybrid.** Bảy "Bước" từ nghiên cứu thị trường đến bảo trì là các giai đoạn tuần tự kiểu Waterfall; bên trong có MVP và các việc "Main" chia thành "Sub", giống backlog có epic.

**Đọc theo WIP.** Trong 10 việc đang làm có 4 việc "Main" và **6 việc lá** cùng mở cho một người: 2 ở Bước 3 và 4 tab của trang từ điển ở Bước 4, hạn 11–14/02/2026. Trong khi đó, các việc đã xong ở Bước 3 (trừ một việc thiếu ngày) đều ghi hoàn thành ngày 01/02/2026, sớm 7 ngày so với hạn 08/02.

**Minh hoạ định luật Little, có giả định.** Nếu mình hoàn thành trung bình 2 việc lá mỗi tuần, 6 việc đang mở cho $W = 6/2 = 3$ tuần mỗi việc; giới hạn WIP ở 2 thì $W = 1$ tuần. Tổng thời gian làm hết không đổi, nhưng từng tab xong và dùng được sớm hơn.

**Chất lượng dữ liệu.** Một việc ghi đã hoàn thành nhưng thiếu ngày hoàn thành, hai việc đã bắt đầu hoặc đã xong không có hạn, và có một dòng trống. Sheet có thể chưa được cập nhật, nên các con số mô tả **sheet**, chưa chắc là tiến độ thật; chúng chỉ để minh hoạ khái niệm.

</div>

## 8. Agile quy mô lớn: SAFe, LeSS và Spotify model

Khoá học giới thiệu năm cách mở rộng Agile cho nhiều đội: SAFe, Scrum of Scrums, LeSS, Disciplined Agile Delivery (DAD) và Spotify model. Chúng có bằng chứng hiệu quả không? Tổng quan hệ thống của Dikert, Paasivaara và Lassenius (2016) trả lời khá rõ. Từ 1.875 bài, họ giữ **52 bài về 42 case** chuyển đổi trong công nghiệp; **gần 90%** là báo cáo kinh nghiệm (experience report), điều chính các tác giả coi là dấu hiệu thiếu nghiên cứu học thuật vững. Họ tổng hợp 35 thách thức và 29 yếu tố thành công; nổi bật nhất là hỗ trợ của quản lý, chọn và **tuỳ biến** mô hình Agile, đào tạo và coaching, tư duy và sự thống nhất.

Edison, Wang và Conboy (2022) so sánh SAFe, LeSS, Scrum-at-Scale, DAD và Spotify model, và ghi nhận trước đó chưa có so sánh liên phương pháp nào dựa trên bằng chứng thực nghiệm; tài liệu chú trọng **thực hành của framework thương mại** hơn nguyên lý nền, trong khi Nokia hay Ericsson tự xây phương pháp. Bản đồ 136 nghiên cứu của Uludağ et al. (2022) cũng kết thúc bằng một chương trình nghiên cứu còn bỏ ngỏ. Với SAFe, Putta, Paasivaara và Lassenius (2018) làm một multivocal review, gộp cả case study và báo cáo kinh nghiệm không bình duyệt, và xác định 52 tổ chức áp dụng. Theo các mô tả mình đọc được, phần lớn case đến từ tài liệu xám, nên lợi ích được báo cáo là lời kể của người áp dụng, chưa phải kết quả đo độc lập.

**Spotify model** có lẽ bị hiểu sai nhiều nhất. Whitepaper gốc tự nhận chỉ là một "snapshot", "a journey in progress, not a journey completed" (Kniberg & Ivarsson, 2012). Squad không có trưởng nhóm chính thức nhưng có Product Owner và agile coach; Tribe được thiết kế **nhỏ hơn khoảng 100 người**, dựa trên con số Dunbar, khi bộ phận kỹ thuật tăng từ 30 lên 250 người trong ba năm. Ghi chú khoá học có hai con số mâu thuẫn cho Tribe, "dưới 100" và "40–150"; con số sau mình không tìm được nguồn. Nghiên cứu học thuật chủ yếu đi vào từng cơ chế, như guild giúp chia sẻ tri thức và ra quyết định tập thể (Šmite et al., 2019). Lời khuyên "lấy cảm hứng, đừng sao chép" khớp với chính whitepaper. **LeSS** chia thành LeSS cho 2–8 đội và LeSS Huge từ 8 đội, và được mô tả là kết quả của "hundreds of concrete experiments", không phải "600+" như khoá học ghi (LeSS Company, n.d.).

Về mức phổ biến, State of Agile 2019 hỏi tổ chức theo sát cách mở rộng nào nhất: SAFe 30%, Scrum of Scrums 16%, phương pháp tự xây 8%, DAD 7%, Spotify model 5%, LeSS 3%, và 19% không biết (CollabNet VersionOne, 2019). Mức phổ biến của SAFe **không phải** bằng chứng về hiệu quả.

**Bảng 6.** Các cách mở rộng Agile và loại bằng chứng

| Cách mở rộng       | Theo sát nhất (2019) | Loại bằng chứng hiện có                                  |
| ------------------ | -------------------- | -------------------------------------------------------- |
| SAFe               | 30%                  | Multivocal review, phần lớn tài liệu xám                 |
| Scrum of Scrums    | 16%                  | Chủ yếu báo cáo kinh nghiệm                              |
| Tự xây             | 8%                   | Case study trong các tổng quan                           |
| DAD                | 7%                   | So sánh ở mức mô tả                                      |
| Spotify model      | 5%                   | Whitepaper tự mô tả; nghiên cứu về từng cơ chế như guild |
| LeSS               | 3%                   | So sánh ở mức mô tả                                      |

> **Mức bằng chứng ước tính:** rất thấp đến thấp. Với nền bằng chứng mỏng như vậy, lời khuyên "đừng mở rộng nếu không cần" là lời khuyên khôn ngoan nhất của Module 4.

## 9. Thảo luận và kết luận

**Bảng 7.** Tuyên bố của khoá học và mức bằng chứng

| Tuyên bố của khoá học                 | Bằng chứng tốt nhất                  | Mức ước tính        | Nên nói thế nào                                                     |
| ------------------------------------- | ------------------------------------ | ------------------- | ------------------------------------------------------------------- |
| Agile hiệu quả hơn Waterfall          | 1 systematic review, 3 nghiên cứu quan sát | Thấp đến rất thấp | Liên quan đến hài lòng của bên liên quan; thời gian, chi phí chưa chắc |
| Agile giảm lãng phí                   | Taxonomy trong một công ty           | Rất thấp            | Là mục tiêu thiết kế                                                |
| Agile hợp với VUCA                    | Khung khái niệm                      | Rất thấp            | Hợp nhất khi yêu cầu bất định và khách hàng tham gia được           |
| 72%, 85%, 30%                         | Khảo sát vendor; Gartner; không có   | Mô tả               | Nói rõ đơn vị, mẫu, ý định; bỏ 30%                                  |
| Planning Poker chính xác hơn          | 1 thực nghiệm, vài nghiên cứu nhỏ    | Thấp                | Tốt hơn gộp máy móc, ngang một chuyên gia                           |
| Không so velocity giữa các đội        | Logic đo lường                       | Không cần thực nghiệm | Giữ nguyên                                                        |
| Daily Scrum giúp đội đồng bộ          | 1 nghiên cứu, 12 đội                 | Thấp                | Có ích khi chia sẻ thông tin, phản tác dụng khi thành báo cáo        |
| SAFe, LeSS, Spotify giúp mở rộng      | Gần 90% báo cáo kinh nghiệm          | Rất thấp đến thấp   | Có mô tả thực hành, chưa có so sánh hiệu quả                        |

Từ bảng này, có năm hướng dẫn thực hành:

1. **Chọn Agile hoặc hybrid khi yêu cầu còn bất định và khách hàng tham gia được.** Lợi thế của mô hình linh hoạt gắn với cộng tác với khách hàng (Moløkken-Østvold & Jørgensen, 2005) và rõ nhất ở sự hài lòng của các bên liên quan (Gemino et al., 2021; Serrador & Pinto, 2015).
2. **Đừng hứa Agile nhanh hơn hay rẻ hơn.** Lợi ích chắc hơn nằm ở sự hài lòng của các bên liên quan.
3. **Dùng Planning Poker để thảo luận**, đừng kỳ vọng nó tự làm ước lượng chính xác hơn.
4. **Không dùng velocity làm KPI hay để so sánh đội.**
5. **Trước khi mở rộng, hỏi có thật sự cần không.** Ngoài việc chọn và tuỳ biến mô hình, các yếu tố thành công nổi bật là hỗ trợ của quản lý, đào tạo và tư duy (Dikert et al., 2016).

Khoảng trống nghiên cứu vẫn lớn: ít nghiên cứu về Scrum ở đội đã thành thạo (Dybå & Dingsøyr, 2008), gần như chưa có so sánh Agile ngoài phần mềm, và thiếu thiết kế dọc trước và sau chuyển đổi.

Vậy Agile có hiệu quả hơn Waterfall không? Câu trả lời trung thực là **có, ở một số chiều, trong một số bối cảnh, với bằng chứng chưa mạnh**. Đó không phải lý do để bỏ Agile, mà để coi Agile như một giả thuyết cần kiểm chứng trong chính dự án của mình, đúng tinh thần thực nghiệm của Scrum.

## Tài liệu tham khảo

Association for Project Management. (n.d.). *Does Agile work? A quantitative analysis of agile project success* [Research summary]. https://apm.org.uk/media/r01fph3t/does-agile-work-a-quantitative-analysis-of-agile-project-success.pdf

Beck, K., Beedle, M., van Bennekum, A., Cockburn, A., Cunningham, W., Fowler, M., Grenning, J., Highsmith, J., Hunt, A., Jeffries, R., Kern, J., Marick, B., Martin, R. C., Mellor, S., Schwaber, K., Sutherland, J., & Thomas, D. (2001). *Manifesto for agile software development*. https://agilemanifesto.org/

Bennett, N., & Lemoine, G. J. (2014). What a difference a word makes: Understanding threats to performance in a VUCA world. *Business Horizons, 57*(3), 311–317. https://doi.org/10.1016/j.bushor.2014.01.001

Bruce, P., & Bruce, A. (2017). *Practical statistics for data scientists: 50 essential concepts*. O'Reilly Media.

CollabNet VersionOne. (2019). *13th annual State of Agile report*. https://eg.bucknell.edu/~cs479/common-files/resources/versionone-state-of-agile/13th-annual-state-of-agile-report.pdf

Dikert, K., Paasivaara, M., & Lassenius, C. (2016). Challenges and success factors for large-scale agile transformations: A systematic literature review. *Journal of Systems and Software, 119*, 87–108. https://doi.org/10.1016/j.jss.2016.06.013

Dữ liệu dự án cá nhân. (2026). *Timeline dự án app Dictionaire* [Dữ liệu chưa công bố, đọc ngày 13/11/2026].

Dybå, T., & Dingsøyr, T. (2008). Empirical studies of agile software development: A systematic review. *Information and Software Technology, 50*(9–10), 833–859. https://doi.org/10.1016/j.infsof.2008.01.006

Edison, H., Wang, X., & Conboy, K. (2022). Comparing methods for large-scale agile software development: A systematic literature review. *IEEE Transactions on Software Engineering, 48*(8), 2709–2731. https://doi.org/10.1109/TSE.2021.3069039

Gartner. (2019, February 19). *Gartner survey finds 85 percent of organizations favor a product-centric application delivery model* [Press release]. https://www.gartner.com/en/newsroom/press-releases/2019-02-19-gartner-survey-finds-85-percent-of-organizations-favor-a-product

Gemino, A., Horner Reich, B., & Serrador, P. M. (2021). Agile, traditional, and hybrid approaches to project success: Is hybrid a poor second choice? *Project Management Journal, 52*(2), 161–175. https://doi.org/10.1177/8756972820973082

Highsmith, J. (2001). *History: The Agile Manifesto*. https://agilemanifesto.org/history.html

Hoda, R., Salleh, N., & Grundy, J. (2018). The rise and evolution of agile software development. *IEEE Software, 35*(5), 58–63. https://doi.org/10.1109/MS.2018.290111318

Jørgensen, M. (2004). A review of studies on expert estimation of software development effort. *Journal of Systems and Software, 70*(1–2), 37–60. https://doi.org/10.1016/S0164-1212(02)00156-5

Kniberg, H., & Ivarsson, A. (2012). *Scaling Agile @ Spotify with tribes, squads, chapters & guilds* [White paper]. https://blog.crisp.se/wp-content/uploads/2012/11/SpotifyScaling.pdf

Kuhrmann, M., Diebold, P., Münch, J., Tell, P., Trektere, K., McCaffery, F., Garousi, V., Felderer, M., Linssen, O., Hanser, E., & Prause, C. R. (2019). Hybrid software development approaches in practice: A European perspective. *IEEE Software, 36*(4), 20–31. https://doi.org/10.1109/MS.2018.110161245

Larman, C., & Basili, V. R. (2003). Iterative and incremental development: A brief history. *Computer, 36*(6), 47–56. https://doi.org/10.1109/MC.2003.1204375

LeSS Company. (n.d.). *Introduction to LeSS*. https://less.works/less/framework/introduction

Little, J. D. C. (1961). A proof for the queuing formula: L = λW. *Operations Research, 9*(3), 383–387. https://doi.org/10.1287/opre.9.3.383

Mahnič, V., & Hovelja, T. (2012). On using planning poker for estimating user stories. *Journal of Systems and Software, 85*(9), 2086–2095. https://doi.org/10.1016/j.jss.2012.04.005

Moløkken-Østvold, K., & Haugen, N. C. (2007). Combining estimates with planning poker: An empirical study. In *Proceedings of the 2007 Australian Software Engineering Conference (ASWEC'07)* (pp. 349–358). IEEE. https://doi.org/10.1109/ASWEC.2007.15

Moløkken-Østvold, K., Haugen, N. C., & Benestad, H. C. (2008). Using planning poker for combining expert estimates in software projects. *Journal of Systems and Software, 81*(12), 2106–2117. https://doi.org/10.1016/j.jss.2008.03.058

Moløkken-Østvold, K., & Jørgensen, M. (2005). A comparison of software project overruns: Flexible versus sequential development models. *IEEE Transactions on Software Engineering, 31*(9), 754–766. https://doi.org/10.1109/TSE.2005.96

Putta, A., Paasivaara, M., & Lassenius, C. (2018). Benefits and challenges of adopting the Scaled Agile Framework (SAFe): Preliminary results from a multivocal literature review. In *Product-Focused Software Process Improvement (PROFES 2018)* (pp. 334–351). Springer. https://doi.org/10.1007/978-3-030-03673-7_24

Royce, W. W. (1970). Managing the development of large software systems. In *Proceedings of IEEE WESCON* (pp. 1–9). IEEE.

Schwaber, K., & Sutherland, J. (2017). *The Scrum Guide: The definitive guide to Scrum: The rules of the game*. https://scrumguides.org/docs/scrumguide/v2017/2017-Scrum-Guide-US.pdf

Schwaber, K., & Sutherland, J. (2020). *The Scrum Guide: The definitive guide to Scrum: The rules of the game*. https://scrumguides.org/docs/scrumguide/v2020/2020-Scrum-Guide-US.pdf

Sedano, T., Ralph, P., & Péraire, C. (2017). Software development waste. In *2017 IEEE/ACM 39th International Conference on Software Engineering (ICSE)* (pp. 130–140). IEEE. https://doi.org/10.1109/ICSE.2017.20

Serrador, P., & Pinto, J. K. (2015). Does Agile work? A quantitative analysis of agile project success. *International Journal of Project Management, 33*(5), 1040–1051. https://doi.org/10.1016/j.ijproman.2015.01.006

Šmite, D., Moe, N. B., Levinta, G., & Floryan, M. (2019). Spotify guilds: How to succeed with knowledge sharing in large-scale agile organizations. *IEEE Software, 36*(2), 51–57. https://doi.org/10.1109/MS.2018.2886178

Stray, V., Sjøberg, D. I. K., & Dybå, T. (2016). The daily stand-up meeting: A grounded theory study. *Journal of Systems and Software, 114*, 101–124. https://doi.org/10.1016/j.jss.2016.01.004

Takeuchi, H., & Nonaka, I. (1986, January). The new new product development game. *Harvard Business Review*. https://hbr.org/1986/01/the-new-new-product-development-game

Uludağ, Ö., Philipp, P., Putta, A., Paasivaara, M., Lassenius, C., & Matthes, F. (2022). Revealing the state of the art of large-scale agile development research: A systematic mapping study. *Journal of Systems and Software, 194*, Article 111473. https://doi.org/10.1016/j.jss.2022.111473

Usman, M., Mendes, E., Weidt, F., & Britto, R. (2014). Effort estimation in agile software development: A systematic literature review. In *Proceedings of the 10th International Conference on Predictive Models in Software Engineering (PROMISE '14)* (pp. 82–91). ACM. https://doi.org/10.1145/2639490.2639503
