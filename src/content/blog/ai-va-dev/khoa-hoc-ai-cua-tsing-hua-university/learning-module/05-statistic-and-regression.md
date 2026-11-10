---
title: Statistic and Regression
type: course-note
tags:
  - data-science
  - AI
section: AI và DEV
folder: AI và DEV / Khoá học AI của Tsing Hua University / Learning Module
vaultPath: >-
  Resources/AI và DEV/Khoá học AI của Tsing Hua University/Learning Module/05 -
  Statistic and Regression.md
url: /blog/statistic-and-regression/
topic: ai-development
updated: '2026-10-14'
source: 'https://maic.chat/my_study'
order: 5
description: >-
  Note: Aggregated data may fail to reflect the large variation within each
  higher-level unit. Basic Stata Operations (Các Thao Tác Cơ Bản Trong Stata)
isIndex: false
---
## Fundamental Ideas of Quantitative Research
### What does quantitative research do?
- Quantitative research in social science: Systematic empirical investigation of social phenomena via statistical, mathematical, or computational techniques (→ Qualitative Research)
- Purpose:
	- Describe phenomena based on statistics
	- Reveal correlations between things
	- Test causal relationships between things
	- ...
	  -> Provide evidence for decision-making, prediction, and intervention
### Key Concepts:
* **Variable:** Any characteristic that can be measured or categorized. Variables can be independent (predictor) or dependent (outcome).
* **Construct:** An abstract concept measured by one or more variables (e.g., educational attainment, socioeconomic status).
* **Hypothesis:** A testable prediction about the relationship between variables.
* **Model:** A simplified mathematical representation used to describe relationships between variables.
* **Sampling:** The process of selecting a subset of individuals from a larger population to represent the whole.
* **Data collection methods:** Quantitative researchers use surveys, tests, and observations to collect data. (→ [Prepare Data for Exploration](/blog/prepare-data-for-exploration/))
### Basic Types of Quantitative Data
- Data and variable types
* **Data**
  * **Qualitative data**
    * *Non-numeric data, e.g. text, graphics, audio, video*
    * **Categorical:** Represents categories only; numbers have no magnitude; e.g. gender, ethnicity
    * **Ordinal:** Represents both category and order; e.g. education level, attitude toward something
  * **Quantitative data**
    * *Numeric data, variables*
    * **Discrete:** Can only take finite or countable values; Obtained by counting, e.g. number of children, class size
    * **Continuous:** Can take infinite values within a range; Obtained by measurement, e.g. height, weight, temperature
### How is quantitative research conducted?
* **Main purposes of quantitative research:**
	* Use **quantifiable** data to **test hypotheses** derived from **theory** (*theoretical hypothesis*)
	* Make **generalizable inferences** about larger groups (**population**) using known (**sample**) information
* **Core tasks:**
	* **Measurement:** Expressing empirical observations mathematically
	* **Inference:** Understanding the population through sample surveys
* **Foundation: Probability theory and mathematical statistics**
	* Descriptive statistics, hypothesis testing
	* Group comparison, analysis of variance
	* Regression analysis, causal analysis
	* Data mining, predictive analysis
* **How to ensure credibility of quantitative research results?**
	* **Identification strategy** design (*causal or correlational?*)
	* **Data collection** process (*accurate measurement, reasonable sampling, standardized collection?*)
	* **Data analysis** process (*appropriate model specification, correct estimation?*)
* **The most critical issue:** Correlation ≠ Causation! — The endogeneity problem of independent variables
### Steps of a quantitative research

| Step | Definition | Example |
| :--- | :--- | :--- |
| **Research topic** | The broad thematic area of this study | Classroom learning performance of Chinese college students |
| **Research question** | The specific question this study needs to answer | What effect does active classroom participation have on student learning outcomes? |
| **Research hypothesis** | A theory-derived answer to the research question | Students who participate more actively in class perform better academically |
| **Research design** | Data collection and analysis methods designed to answer the research question and test hypotheses | • **Variables:** Active participation = frequency of speaking in class; Learning performance = final exam score<br>• **Model:** Final score = $b_0 + b_1 \times \text{speaking frequency} + u$ |
### Ví dụ thực chứng: Mở rộng giáo dục đại học và bất bình đẳng tại Trung Quốc (Empirical Study Example: Expansion and Inequality of Higher Education in China)
#### 1. Bản chất & Định nghĩa cốt lõi (Slide 7, 8, 9 & Transcript P7, P8, P9)
* **Phân loại nhiệm vụ:** **Nghiên cứu thực chứng / Kiểm định lý thuyết nhân quả (Empirical Research / Causal Analysis & Hypothesis Testing)**.
* **Bản chất kỹ thuật:** 
  * Ứng dụng mô hình kinh tế lượng và kỹ thuật thống kê xã hội học trên tập dữ liệu khảo sát quy mô quốc gia (Chinese College Student Survey 2012) để kiểm định mô hình lý thuyết:
$$\text{Lý thuyết EMI (Lucas, 2001)} \implies \text{Hypotheses } \{H_1, H_2, H_3\} \xrightarrow{\text{Dữ liệu khảo sát}} \text{Kết luận thực chứng}$$
  * *Mô hình Bất bình đẳng duy trì tối đa (Maximally Maintained Inequality - MMI, Raftery & Hout 1993):* Sự khác biệt về trình độ học vấn theo nguồn gốc xã hội tiếp tục tồn tại cho đến khi tỷ lệ tham gia của các nhóm xã hội tầng lớp trên đạt ngưỡng bão hòa.
  * *Mô hình Bất bình đẳng duy trì hiệu quả (Effectively Maintained Inequality - EMI, Lucas 2001):* Khi khác biệt về mặt định lượng (tổng số người đi học) bắt đầu thu hẹp do mở rộng quy mô giáo dục, nhóm có lợi thế xã hội chuyển dịch chiến lược sang cạnh tranh về mặt **định tính** (chất lượng trường, danh tiếng bằng cấp) để duy trì vị thế áp đảo.
* **Điểm khác biệt / Điểm đặc trưng:** 
  * Chuyển hóa một vấn đề xã hội mang tính tranh luận trừu tượng ("mở rộng giáo dục có thực sự giúp người nghèo thành công?") thành một khung nghiên cứu định lượng chặt chẽ với các giả thuyết thực chứng đo lường được về quyền tiếp cận, cơ hội học tập và kết quả việc làm.
#### 2. Phân tích các ví dụ minh họa (Slide 7, 8, 9 & Transcript P7, P8, P9)
* **Câu hỏi & Nội dung nghiên cứu (Research Content & Question - Slide 8 & Transcript P8):**
  * *Biểu diễn logic:* 
    $$\text{Socioeconomic Status (SES)} \xrightarrow{\text{Cơ chế tuyển sinh / Học phí}} (\text{Elite University Access}) \rightarrow \text{Educational Outcomes}$$
  * *Cơ chế thực tế:* Nghiên cứu của Yan Luo, Fei Guo và Jinghuan Shi (2018) đặt vấn đề liệu việc mở rộng hệ thống đại học tại Trung Quốc có thu hẹp bất bình đẳng xã hội hay không. Do các chính sách phân hóa về điểm chuẩn tuyển sinh và học phí, sinh viên thuộc nhóm có lợi thế kinh tế - xã hội dễ dàng tiếp cận các trường đại học tinh hoa hơn so với sinh viên nghèo.
* **Khung lý thuyết & Ba giả thuyết kiểm định (Hypotheses - Slide 9 & Transcript P9):**
  * *Biểu diễn logic:* 
    * *Giả thuyết 1 ($H_1$ - Đầu vào):* $$\text{Advantaged SES} \xrightarrow{\text{Chính sách tuyển sinh Gaokao đặc biệt}} \text{Xác suất trúng tuyển trường tinh hoa cao hơn}$$
    * *Giả thuyết 2 ($H_2$ - Quá trình đào tạo):* $$\text{Sinh viên trường tinh hoa} \rightarrow \text{Tiếp cận nguồn lực học tập & cơ hội phát triển vượt trội}$$
    * *Giả thuyết 3 ($H_3$ - Đầu ra):* $$\text{Tốt nghiệp trường tinh hoa} \rightarrow \text{Vị thế và cơ hội cạnh tranh vượt trội trên thị trường lao động}$$
  * *Cơ chế thực tế:* Ba giả thuyết bao quát toàn bộ tiến trình học tập từ tuyển sinh đầu vào, quá trình trải nghiệm đào tạo đến kết quả việc làm đầu ra, tạo thành một bài kiểm tra toàn diện cho lý thuyết EMI trong bối cảnh thực tế tại Trung Quốc.
#### 3. Ý nghĩa thực tiễn & Ứng dụng ra quyết định (Slide 7, 8, 9 & Transcript P7, P8, P9)
* **Theo góc nhìn Thiết kế & Hoạch định chính sách công (Public Policy):**
  * *Mục tiêu:* Đánh giá hiệu quả thực sự của các chương trình mở rộng giáo dục đại học đối với mục tiêu bình đẳng xã hội.
  * *Hành động can thiệp:* Cải cách chính sách tuyển sinh đặc biệt (Gaokao) và cơ chế hỗ trợ tài chính/học bổng nhằm dỡ bỏ các rào cản vô hình đối với học sinh có hoàn cảnh khó khăn, tránh để việc mở rộng chỉ mang lại lợi ích định tính cho tầng lớp thượng lưu.
* **Theo góc nhìn Phương pháp luận nghiên cứu định lượng (Research Methodology):**
  * *Mục tiêu:* Xây dựng mô hình mẫu mực kết nối từ bối cảnh lịch sử, lý thuyết nền tảng (MMI/EMI) đến các giả thuyết toán học có thể kiểm định.
  * *Hành động can thiệp:* Thiết lập thiết kế nghiên cứu 3 phần (Bối cảnh $\rightarrow$ Phân tích thực chứng $\rightarrow$ Đúc kết hàm ý) để đảm bảo độ chặt chẽ trong suy luận nhân quả và giá trị học thuật của công trình.
* **Theo góc nhìn Đánh giá kết quả thị trường lao động (Labor Market Equity):**
  * *Mục tiêu:* Nhận diện sự phân tầng cơ hội việc làm dựa trên danh tiếng bằng cấp thay vì năng lực cá nhân thuần túy.
  * *Hành động can thiệp:* Doanh nghiệp và nhà nước cần theo dõi các chỉ số tuyển dụng bình đẳng, hạn chế việc rào cản bằng cấp tinh hoa làm trầm trọng thêm sự phân hóa giàu nghèo thế hệ tiếp theo.
## Principles of Questionnaire Design
### 1. Survey Questionnaire Design
* A questionnaire is a self-report data collection instrument that each research participant fills out as part of the research.
* Researchers use questionnaire surveys to obtain information from respondents about their thoughts, feelings, attitudes, beliefs, values, perceptions, personality, and behavioral intentions.
* Questionnaire surveys can be used to collect many different types of data.
#### Steps in Questionnaire Design
* **Research Questions**
	* Survey purpose and target population
	* Information needed to answer the core questions
* **Empirical Model**
	* Indicator framework
	* Existing theories and literature
* **Instrument**
	* Existing questionnaires
	* Existing scales
* **Questionnaire Design**
	* Local language and terminology
	* Format of questions and answers
	* Range and scale of answers
	* Question allocation across multiple questionnaires and dataset management
	* Time required to complete the questionnaire
#### Chuyển đổi từ Câu hỏi nghiên cứu sang Thiết kế phương pháp (From Research Questions to Method Design)
##### 1. Bản chất & Định nghĩa cốt lõi (Slide 4, 5 & Transcript P4, P5)
* **Phân loại nhiệm vụ:** **Thiết kế phương pháp luận & Căn chỉnh nghiên cứu (Methodological Alignment & Research Design Framework)**.
* **Bản chất kỹ thuật:** 
  * Cầu nối có hệ thống giữa mục tiêu nhận thức học thuật và công cụ thu thập dữ liệu thông qua mô hình Kim tự tháp ma trận nghiên cứu (Research Matrix Pyramid):
    $$\text{Research Topic / Problem Consciousness} \rightarrow \text{Data Planning Matrix} \rightarrow \text{Research Question / Method Content Matrix} \rightarrow \text{Questionnaire / Interview / Observation Items}$$
  * Quá trình chuyển hóa đòi hỏi sự căn chỉnh (Alignment) hai chiều, dựa trên tư duy phản biện, đối thoại học thuật và tổng quan y văn nhằm xác định rõ: những gì đã biết, những gì giả định đã biết, khoảng trống tri thức và các câu hỏi mới phát sinh.
* **Điểm khác biệt / Điểm đặc trưng:** 
  * Loại bỏ cách tiếp cận thiết kế bảng hỏi theo cảm tính hoặc thu thập dữ liệu phân tán; thiết lập quan hệ ánh xạ nhiều-nhiều ($M \times N$) chặt chẽ giữa câu hỏi nghiên cứu trừu tượng và câu hỏi khảo sát cụ thể.
##### 2. Phân tích các ví dụ minh họa (Slide 4, 5 & Transcript P4, P5)
* **Mô hình Kim tự tháp ma trận nghiên cứu (Research Matrix Pyramid - Lyle Yorks / ORL6500):**
  * *Biểu diễn logic:* 
    $$\text{Apex: } \{\text{RQ / Method Content Matrix}\} \xleftrightarrow{\text{Alignment}} \text{Mid: } \{\text{Data Planning Matrix}\} \xleftrightarrow{\text{Alignment}} \text{Base: } \{\text{Research Topic / Questions}\}$$
  * *Cơ chế thực tế:* Tầng đáy định hình ý thức vấn đề thông qua tổng quan tài liệu để xây dựng khung khái niệm; các tầng giữa và đỉnh cụ thể hóa phương án đo lường thành ma trận nội dung phương pháp (câu hỏi phỏng vấn, tiêu chí quan sát, câu hỏi khảo sát).
* **Ma trận đối ứng Câu hỏi nghiên cứu & Mục hỏi bảng hỏi (RQ & Questionnaire Matrix):**
  * *Biểu diễn logic:* 
    $$\begin{aligned}
    \text{RQ}_1 &\longleftrightarrow \{Q_1, Q_4\} \\
    \text{RQ}_2 &\longleftrightarrow \{Q_2, Q_3, Q_5\} \\
    \text{RQ}_3 &\longleftrightarrow \{Q_2, Q_4, Q_6\}
    \end{aligned}$$
  * *Cơ chế thực tế:* 
    * Một câu hỏi nghiên cứu thường cần sự kết hợp của nhiều mục hỏi đo lường độc lập để đảm bảo độ tin cậy và bao quát toàn diện khía cạnh lý thuyết (ví dụ $\text{RQ}_2$ cần đồng thời $Q_2, Q_3, Q_5$).
    * Một mục hỏi trong khảo sát có thể đóng góp dữ liệu đồng thời cho nhiều câu hỏi nghiên cứu khác nhau (ví dụ $Q_2$ vừa phục vụ $\text{RQ}_2$, vừa phục vụ $\text{RQ}_3$; $Q_4$ vừa phục vụ $\text{RQ}_1$, vừa phục vụ $\text{RQ}_3$).
##### 3. Ý nghĩa thực tiễn & Ứng dụng ra quyết định (Slide 4, 5 & Transcript P4, P5)
* **Theo góc nhìn Kiểm soát độ giá trị và độ tin cậy (Construct Validity):**
  * *Mục tiêu:* Đảm bảo mọi khía cạnh của câu hỏi nghiên cứu đều có công cụ đo lường tương ứng, tránh bỏ sót biến số cốt lõi.
  * *Hành động can thiệp:* Rà soát từng hàng ngang của ma trận đối ứng; nếu một câu hỏi nghiên cứu không có mục hỏi khảo sát nào tương ứng, cần lập tức bổ sung công cụ đo lường phù hợp.
* **Theo góc nhìn Tối ưu hóa tải lượng khảo sát (Survey Efficiency & De-duplication):**
  * *Mục tiêu:* Loại bỏ các câu hỏi thừa thãi gây quá tải cho người tham gia khảo sát mà không phục vụ mục tiêu học thuật.
  * *Hành động can thiệp:* Rà soát từng cột dọc của ma trận đối ứng; nếu một câu hỏi bảng hỏi không liên kết với bất kỳ câu hỏi nghiên cứu nào, cần lập tức cắt giảm để rút ngắn thời gian hoàn thành khảo sát.
* **Theo góc nhìn Quản trị dữ liệu và Thực thi phân tích:**
  * *Mục tiêu:* Lập kế hoạch phân tích dữ liệu rõ ràng ngay từ khâu thiết kế công cụ đo lường.
  * *Hành động can thiệp:* Dựa vào cấu trúc ma trận để nhóm các biến độc lập, biến trung gian và biến phụ thuộc, sẵn sàng tích hợp thẳng vào mô hình phân tích định lượng (như hồi quy, mô hình phương trình cấu trúc SEM) sau khi thu thập dữ liệu hoàn tất.
#### Ma trận đối ứng Câu hỏi nghiên cứu & Mục hỏi bảng hỏi/phỏng vấn (Research Question & Questionnaire/Interview Question Matrix)

##### 1. Bản chất & Định nghĩa cốt lõi (Slide 5 & Transcript P5)
* **Phân loại nhiệm vụ:** **Thiết kế công cụ đo lường & Căn chỉnh phương pháp (Measurement Instrument Design / Methodological Mapping)**.
* **Bản chất kỹ thuật:** 
  * Thiết lập một bản đồ trực quan (visual roadmap) dưới dạng ma trận nhị phân để ánh xạ tường minh quan hệ nhiều-nhiều ($M \times N$) giữa tập hợp các câu hỏi nghiên cứu lý thuyết và các mục hỏi cụ thể trong công cụ thu thập dữ liệu:
    $$\mathbf{M} \in \{0, 1\}^{m \times n}, \quad M_{ij} = \begin{cases} 1 & \text{nếu câu hỏi khảo sát } Q_j \text{ đo lường cho câu hỏi nghiên cứu } RQ_i \\ 0 & \text{nếu ngược lại} \end{cases}$$
  * Đảm bảo tính nhất quán nội tại (internal validity) và tính khoa học của bảng câu hỏi, xác thực rằng mọi dữ liệu thu thập được đều phục vụ trực tiếp cho việc trả lời các giả thuyết/câu hỏi nghiên cứu cốt lõi.
* **Điểm khác biệt / Điểm đặc trưng:** 
  * Chấm dứt tình trạng đặt câu hỏi khảo sát một cách cảm tính hoặc rời rạc; biến việc soạn thảo bảng hỏi thành một quy trình kỹ thuật có cấu trúc, kiểm soát chặt chẽ mối liên kết giữa dữ liệu kinh nghiệm (empirical data) và khái niệm lý thuyết (constructs).
##### 2. Phân tích các ví dụ minh họa (Slide 5 & Transcript P5)
* **Cấu trúc ma trận ánh xạ 3 Câu hỏi nghiên cứu và 6 Mục khảo sát (Slide 5):**
  * *Biểu diễn logic:* 
    $$\begin{aligned}
    RQ_1 &\longrightarrow \{Q_1, Q_4\} \\
    RQ_2 &\longrightarrow \{Q_2, Q_3, Q_5\} \\
    RQ_3 &\longrightarrow \{Q_2, Q_4, Q_6\}
    \end{aligned}$$
  * *Cơ chế thực tế:* 
    * Một câu hỏi nghiên cứu không thể đo lường phiến diện bằng một câu hỏi đơn lẻ mà cần sự kết hợp đa biến để bao quát đầy đủ nội hàm (ví dụ $RQ_1$ cần cả $Q_1$ và $Q_4$; $RQ_2$ cần sự kết hợp đồng thời của bộ ba $Q_2, Q_3, Q_5$).
    * Một mục hỏi khảo sát có thể đóng góp thông tin cho nhiều mục tiêu nghiên cứu độc lập (ví dụ $Q_2$ vừa cung cấp dữ liệu cho $RQ_2$ vừa phục vụ $RQ_3$; $Q_4$ cùng lúc giải quyết $RQ_1$ và $RQ_3$).
##### 3. Ý nghĩa thực tiễn & Ứng dụng ra quyết định (Slide 5 & Transcript P5)
* **Theo góc nhìn Kiểm soát độ giá trị nội dung & Tránh bỏ sót dữ liệu (Row-wise Analysis):**
  * *Mục tiêu:* Đảm bảo tính toàn vẹn (completeness) của nghiên cứu, không bỏ sót bất kỳ biến số hoặc khía cạnh lý thuyết nào cần kiểm định.
  * *Hành động can thiệp:* Rà soát theo từng hàng ngang ($RQ_i$); nếu phát hiện một câu hỏi nghiên cứu có quá ít mục hỏi đo lường hoặc chưa có mục nào ($\sum_j M_{ij} = 0$), người nghiên cứu phải lập tức bổ sung thêm các thang đo/câu hỏi khảo sát chuyên biệt.
* **Theo góc nhìn Tối ưu hóa tải lượng & Loại bỏ câu hỏi thừa (Column-wise Analysis):**
  * *Mục tiêu:* Nâng cao tỷ lệ phản hồi và độ chính xác của câu trả lời bằng cách tinh gọn bảng hỏi, tránh gây mệt mỏi cho người tham gia khảo sát.
  * *Hành động can thiệp:* Rà soát theo từng cột dọc ($Q_j$); nếu một mục hỏi không tương ứng với bất kỳ câu hỏi nghiên cứu nào ($\sum_i M_{ij} = 0$), cần lập tức loại bỏ câu hỏi đó khỏi bảng khảo sát để tối ưu hóa thời lượng điền biểu mẫu.
* **Theo góc nhìn Hoạch định kế hoạch phân tích định lượng (Data Analysis Planning):**
  * *Mục tiêu:* Chuẩn bị sẵn khung mô hình kinh tế lượng hoặc thống kê suy luận trước khi tiến hành thu thập dữ liệu thực địa.
  * *Hành động can thiệp:* Dựa vào cấu trúc nhóm của ma trận để định hình các biến độc lập, biến phụ thuộc, biến điều tiết/trung gian nhằm phục vụ trực tiếp cho việc chạy hồi quy hoặc mô hình phương trình cấu trúc (SEM) sau khi có dữ liệu.
### 2. Scale Design
####  Từ khái niệm đến cấu trúc đo lường (From Concept to Constructs)
![Ảnh chụp Màn hình 2026-09-24 lúc 00.39.48](/vault-assets/anh-chup-man-hinh-2026-09-24-luc-00-39-48-97be12a4.webp)
##### 1. Bản chất & Định nghĩa cốt lõi (Slide 6 & Transcript P7)
* **Phân loại nhiệm vụ:** **Thao tác hóa khái niệm & Thiết kế công cụ đo lường (Operationalization & Measurement Design Task)**.
* **Bản chất kỹ thuật:** 
  * Quá trình chuyển hóa phân cấp từ một khái niệm trừu tượng (abstract concept) thành các chỉ số/biến số có thể đo lường bằng số học thông qua thang đo:
    $$\text{Concept (Khái niệm trừu tượng)} \xrightarrow{\text{Cấu trúc hóa}} \text{Scale (Tập hợp các mục hỏi)} \xrightarrow{\text{Đo lường định lượng}} \text{Constructs / Indicators / Variables (Chỉ số/Biến số)}$$
  * *Concept:* Định nghĩa lý thuyết và cấu trúc nội tại của hiện tượng cần nghiên cứu.
  * *Scale:* Bộ công cụ gồm tập hợp các mục hỏi (items) được chuẩn hóa để phản ánh các khía cạnh của khái niệm.
  * *Constructs / Indicators:* Các giá trị số thực nghiệm thu được từ câu trả lời của người tham gia khảo sát để biểu diễn định lượng cho khái niệm ban đầu.
* **Điểm khác biệt / Điểm đặc trưng:** 
  * Cầu nối giữa lý thuyết trừu tượng trong khoa học xã hội/hành vi và dữ liệu thực chứng có thể kiểm định toán học; đảm bảo tính giá trị cấu trúc (construct validity) khi đo lường các thuộc tính tâm lý vô hình.
##### 2. Phân tích các ví dụ minh họa (Slide 6 & Transcript P7)
* **Đo lường xu hướng phản hồi theo mong muốn xã hội (Social Desirability Scale):**
  * *Biểu diễn logic:* 
    $$\text{Social Desirability} \longrightarrow \begin{cases} \text{Self-Deceptive Enhancement (Tự nâng cao năng lực)} & \longrightarrow \{\text{"I have never lost my temper"}, \dots\} \\ \text{Impression Management (Quản lý ấn tượng)} & \longrightarrow \{\text{"I have never broken a promise"}, \dots\} \end{cases}$$
  * *Cơ chế thực tế:* Xu hướng trả lời thiên lệch để làm hài lòng xã hội là một khái niệm trừu tượng, không thể đo lường trực tiếp bằng một câu hỏi duy nhất. Khái niệm này được phân rã thành hai chiều kích cụ thể: "tự dối lòng tích cực" (tin rằng bản thân hoàn hảo) và "quản lý hình tượng bên ngoài" (muốn người khác thấy mình hoàn hảo).
* **Ánh xạ mục hỏi thang đo cụ thể (Sample Items Mapping):**
  * *Biểu diễn logic:* 
    $$\text{Thang đo Likert} \xrightarrow{\text{Mức độ đồng thuận}} \text{Điểm số định lượng } \in [1, k]$$
  * *Cơ chế thực tế:* Các phát biểu mang tính tuyệt đối như *"Tôi chưa bao giờ nổi nóng"* hoặc *"Tôi chưa bao giờ thất hứa"* được dùng để phát hiện mức độ thiên lệch của người trả lời; người trả lời càng khẳng định tuyệt đối thì điểm số đo lường thiên lệch xã hội càng cao.
##### 3. Ý nghĩa thực tiễn & Ứng dụng ra quyết định (Slide 6 & Transcript P7)
* **Theo góc nhìn Kiểm soát sai số đo lường (Measurement Bias Control):**
  * *Mục tiêu:* Nhận diện và hiệu chỉnh hiện tượng thiên lệch phản hồi (response bias) trong các nghiên cứu tâm lý, giáo dục và tổ chức.
  * *Hành động can thiệp:* Đưa các thang đo kiểm tra xu hướng xã hội vào bảng hỏi tổng thể để lọc bỏ hoặc kiểm soát thống kê các mẫu dữ liệu thiếu trung thực trước khi chạy mô hình phân tích chính.
* **Theo góc nhìn Chuẩn hóa công cụ nghiên cứu (Scale Standardization):**
  * *Mục tiêu:* Đảm bảo tính nhất quán nội tại (Cronbach's Alpha) và độ giá trị phân biệt/hội tụ của thang đo.
  * *Hành động can thiệp:* Phân bổ đều các mục hỏi cho từng chiều kích (dimension); kế thừa các mục hỏi đã qua kiểm định y văn thay vì tự ý đặt câu hỏi không có cơ sở lý thuyết.
* **Theo góc nhìn Phân tích dữ liệu & Mô hình hóa định lượng:**
  * *Mục tiêu:* Tạo lập các biến số đại diện chính xác phục vụ cho các thuật toán phân tích nhân tố (EFA/CFA) hoặc mô hình hồi quy.
  * *Hành động can thiệp:* Chuyển đổi các câu trả lời mục hỏi thành điểm số tổng hợp đại diện cho từng cấu trúc (constructs), sẵn sàng đưa vào các mô hình suy luận nhân quả hoặc phân lớp hành vi.
#### Writing Items
* **Where do items come from?**
  * Adapted from existing validated scales
  * Developed from previous research and practice
* **Rules for writing items**
  * Language must be clear, accurate, neutral, and easy to understand
  * **Try to avoid:**
    * Technical jargon (or provide explanations for terminology)
    * Double-barreled questions, unless you do not care about this
    * Leading or loaded questions
      * *Example 1:* What assessment method does your course use? A. Exam B. Paper C. Presentation
      * *Example 2:* Is the feedback your teacher provides on your assignments helpful?
  * If the purpose is to assess the effect of A on B, do not design a question like: **"How much do you think small-class teaching affects academic performance?"**
#### Quality of Scales
* **Validity**: the extent to which a specific instrument measures what it wants, attempts, or claims to measure. (→ Application of SEM)
	* Indicates the degree to which a specific instrument measures what it intends, attempts, or claims to measure.
* **Reliability**: consistency or stability of a set of test scores.
	* Refers to the consistency or stability of a set of test scores. If a test or assessment procedure yields reliable scores, the scores are similar across all conditions.
##### Measurement Validity
* **Construct-related validity**
  * **Construct/theoretical validity**
    * About the definition and meaning of the construct
    * *Judged by experts*
  * **Convergent and discriminant validity**
    * Discusses the relationships among various constructs
    * *Judged by statistical analysis*
* **Content-related validity**
  * **Content validity**
    * Discusses the content of the items
    * *Judged by experts*
  * **Face validity**
    * Discusses the wording of the items
    * *Judged by respondents*
* **Criterion-related validity**
  * **Concurrent validity**
    * Relationship with established scales
    * *Judged by statistical analysis*
  * **Predictive and Evaluative validity**
    * Discusses the usefulness of the scale
    * *Judged by statistical analysis*
##### Measurement Reliability
* **Measured by robustness:**
  * Consistent results across different times and different samples
* **Measured by internal consistency:**
  * Split half reliability
  * Cronbach's alpha
* **Measured by equivalence:**
  * Equivalent results across different test forms: Form A and Form B
  * Equivalent scores across different raters

| Cronbach's alpha | Internal consistency |
| :--- | :--- |
| $\alpha \ge 0.9$ | Excellent |
| $0.8 \le \alpha < 0.9$ | Good |
| $0.7 \le \alpha < 0.8$ | Acceptable |
| $0.6 \le \alpha < 0.7$ | Questionable |
| $0.5 \le \alpha < 0.6$ | Poor |
| $\alpha < 0.5$ | Unacceptable |
### 3. Additional Considerations in Questionnaire Design:
* **About items:**
  * **Wording of questions matters!**
  * **Categorical options: how should categories be designed?**
    * *Closed options: answers must be exhaustive and mutually exclusive*
  * **Reverse items: are they necessary?**
    * Can help identify low-quality responses that follow a patterned answering style.
    * If using double negatives, comprehension may be difficult.
    * May lower Cronbach's alpha — must be reversed before calculation.
* About the overall questionnaire:
	* **Length of the questionnaire**
	* **Target respondents**
	* **Order of questions**
	* **Sensitive questions**
> **Always conduct cognitive interviews and a pilot study before the formal survey!**
## Examples of Questionnaire Design
### Nghiên cứu Điển hình về Thiết kế Bảng hỏi: Dự án CCSS 2.0 (Case Study: Questionnaire Design Settings - CCSS 2.0 Project)
#### 1. Khung lý thuyết & Hệ sinh thái phát triển của sinh viên (Slide 1–4 & Transcript P1–P4)
* **Bản chất nhiệm vụ:** Thiết kế công cụ đo lường định lượng và nghiên cứu theo dõi dọc (Longitudinal Tracking Survey) nhằm đánh giá toàn diện trải nghiệm, sự gắn kết và kết quả học tập của sinh viên đại học.
* **Mô hình hệ sinh thái phát triển (Student Development Ecosystem):**
  * Lấy sinh viên làm trung tâm với cấu trúc 3 chiều nội tại: **Nhận thức (Cognition)**, **Cảm xúc (Emotion)** và **Ý chí (Will)**, được biểu hiện cụ thể ra ngoài bằng các hành vi học tập.
  * Chuỗi tác động tương hỗ:
    $$\text{Đặc điểm nền tảng đầu vào (Pre-college)} \longrightarrow \left[ \begin{gathered} \text{Sự gắn kết trải nghiệm học tập (Student Engagement)} \\ + \\ \text{Môi trường giảng viên & Nhà trường kích thích, hỗ trợ} \end{gathered} \right] \longrightarrow \text{Kết quả năng lực & Phát triển nghề nghiệp}$$
  * Hệ thống chịu sự chi phối liên tục từ các xu hướng xã hội vĩ mô: thị trường hóa, quốc tế hóa, công nghệ thông tin và chính sách mở rộng giáo dục đại học.
* **Hệ thống 5 chiều kích chỉ số cốt lõi (CCSS 2.0 Indicator System):**
  1. *Hành vi học tập đa dạng (Diverse Learning Behaviors):* Học chủ động, học bậc cao, tương tác đa chiều (thầy - trò, trò - trò, quan hệ liên cá nhân).
  2. *Sự gắn kết cảm xúc đa chiều (Multidimensional Emotional Engagement):* Tham gia hoạt động tác động cao (HIPs), học trực tuyến, động lực tự chủ, hứng thú học thuật, sức bền học tập.
  3. *Thử thách học thuật (Academic Challenge):* Khóa học có tính thử thách cao, phương pháp giảng dạy hiệu quả, cơ chế đánh giá hiệu quả.
  4. *Môi trường khuôn viên trường (Campus Environment):* Bầu không khí và văn hóa học thuật, môi trường đa văn hóa, đánh giá chất lượng toàn diện, dịch vụ hỗ trợ sinh viên.
  5. *Kết quả học tập (Learning Outcomes):* Mức độ hài lòng của sinh viên, tiến bộ học tập thực tế (kiến thức chuyên môn, kỹ năng thực hành, định hình giá trị và nhân sinh quan).
#### 2. Thao tác hóa Khái niệm & Quy trình Tinh chỉnh Thang đo (Slide 5–11 & Transcript P5–P11)
* **Quy trình thao tác hóa đa chiều (Operationalization):**
  * Để đo lường các cấu trúc tâm lý - hành vi trừu tượng (Constructs), thang đo chia tách thành 4 khía cạnh cụ thể: **Nhận thức $\rightarrow$ Cảm xúc $\rightarrow$ Ý chí $\rightarrow$ Hành vi**.
  * Cụ thể hóa 3 chỉ số tâm lý học tập quan trọng:
    * *Động lực tự chủ (Autonomous Learning Motivation):* Đánh giá việc sinh viên học vì sự khao khát tri thức tự thân hay do áp lực cưỡng chế từ bên ngoài (khen thưởng, bằng cấp, điểm số).
    * *Hứng thú chuyên môn (Professional Interest):* Mức độ yêu thích, đam mê và cảm giác tự hào gắn bó với ngành học đã chọn.
    * *Sức bền học tập (Learning Resilience):* Tính kiên định, sự nỗ lực bền bỉ và cảm nhận về hiệu quả tự thân (self-efficacy) khi đối mặt khó khăn, thất bại trong học tập.
* **Quy trình chuẩn hóa công cụ đo lường:**
  * *Đánh giá chuyên gia (Expert Review):* Kiểm định độ giá trị nội dung (Content Validity).
  * *Điều tra thử nghiệm (Pilot Test):* Phát hiện lỗi dùng từ, câu hỏi mơ hồ hoặc gây hiểu lầm.
  * *Phỏng vấn nhận thức (Cognitive Interviewing):* Quan sát hành vi, đo thời gian điền phiếu thực tế và phỏng vấn sâu trực tiếp từng đáp viên ngay sau khi hoàn thành phiếu để đối chiếu tiến trình nhận thức của người học với ý đồ thiết kế ban đầu của nhà nghiên cứu.
  * *Xử lý số liệu & Xây dựng chỉ số (Scoring & Index Construction):* Thực hiện gán điểm đảo ngược cho các câu hỏi mang nghĩa phủ định (reverse-scoring), phân tích nhân tố (Factor Analysis) để gom nhóm câu hỏi và chuẩn hóa điểm số nhằm hỗ trợ so sánh trực tiếp giữa các nhóm trường và khóa học.
#### 3. Kiểm soát Chất lượng Thu thập & Lọc Mẫu Không Hợp lệ (Slide 12–16 & Transcript P12–P17)
* **Nguyên tắc triển khai khảo sát:**
  * Áp dụng phương pháp chọn mẫu ngẫu nhiên phân tầng theo xác suất (Stratified Probability Random Sampling) với quy mô mẫu đủ lớn để đảm bảo tính đại diện và triệt tiêu sai lệch ước lượng (unbiasedness).
* **3 Tiêu chuẩn sàng lọc phiếu không hợp lệ (Dữ liệu CCSS 2017):**
  1. *Phát hiện mâu thuẫn/nói dối (Lie Detection Items):* Độ chênh lệch điểm tuyệt đối giữa 2 câu hỏi bẫy có cùng bản chất ngữ nghĩa (A8E và A13B về việc giảng viên phản hồi bài tập kịp thời) có $|\text{Điểm}_{\text{A8E}} - \text{Điểm}_{\text{A13B}}| \ge 2$ (chiếm 3.16% mẫu).
  2. *Thiếu hụt dữ liệu quá mức (Missing Items):* Phiếu bỏ trống trên 2/3 tổng số câu hỏi thuộc Phần A (chiếm 0.12% mẫu; tỷ lệ giảm mạnh nhờ chức năng bắt buộc điền trên bảng hỏi điện tử).
  3. *Chọn trùng lặp phương án liên tục (Straight-lining):* Chọn cùng một đáp án cho 30 câu hỏi liên tiếp trở lên trong Phần A (chiếm 5.8% mẫu, tập trung chủ yếu ở người dùng làm bài trên điện thoại di động).
  * $\implies$ Tổng tỷ lệ mẫu rác bị loại bỏ đạt **8.87%**.
* **Đánh giá chất lượng qua Thời gian hoàn thành (Completion Time):**
  * Thời gian hoàn thành phiếu hợp lệ tuân theo phân phối chuẩn, trung bình khoảng **18 phút**.
  * Các phiếu hoàn thành dưới 7 phút (thuộc nhóm 5% nhanh nhất) hoặc dưới 10 phút phản ánh mức độ điền ẩu rất cao, có sự trùng khớp lớn với nhóm mẫu bị loại theo 3 tiêu chuẩn trên.
* **Kiểm soát Độ lệch mong muốn xã hội (Social Desirability Bias):**
  * Đáp viên có điểm số Social Desirability cao luôn có xu hướng tự chấm điểm khống ở hầu hết các thang đo (tương tác, thử thách, hỗ trợ).
  * Bắt buộc phải đưa điểm đo lường độ lệch mong muốn xã hội vào làm biến kiểm soát (Control Variable) trong các mô hình hồi quy kinh tế lượng để tránh hiện tượng phóng đại tác động.
#### 4. Thẩm định Thống kê: Sai lệch Phương pháp Chung, Độ tin cậy & Độ giá trị (Slide 17–21 & Transcript P18–P20)
* **Kiểm định Sai lệch phương pháp chung (Common Method Bias - CMB):**
  * Sử dụng kiểm định đơn nhân tố Harman (Harman's Single-factor Test).
  * Kết quả: Nhân tố đầu tiên có giá trị riêng (eigenvalue) là $47.23$, giải thích **32.57%** tổng phương sai (nằm an toàn dưới ngưỡng rủi ro 50%), chứng minh công cụ tự báo cáo không gây sai lệch hệ thống đối với cấu trúc dữ liệu.
* **Chỉ số Độ tin cậy (Reliability) & Độ giá trị (Validity):**
  * **Hệ số Cronbach's Alpha toàn diện:** Đạt **0.98** (vượt xa ngưỡng tiêu chuẩn chấp nhận của một thang đo tốt là $> 0.7$), khẳng định tính nhất quán nội tại tối ưu.
  * **Chỉ số mức độ phù hợp mô hình (Model Fit Indices) qua Phân tích nhân tố khẳng định (CFA):**
    * $\text{CFI} > 0.91$ và $\text{TLI} > 0.91$ (đạt tiêu chuẩn độ phù hợp $> 0.90$).
    * $\text{RMSEA} < 0.05$ và $\text{SRMR} < 0.05$ (đạt mức độ khít lý tưởng $< 0.08$).
  * Phân tích cấu trúc bậc hai đối với các cấu trúc tiềm ẩn (như tương tác đa chiều, học trực tuyến, tính thử thách khóa học, hiệu quả tiếp thu kiến thức) chứng minh các câu hỏi thực nghiệm phản ánh chính xác các khái niệm lý thuyết cốt lõi được đặt ra ban đầu.
## Quantitative Data in Educational Research
### Dataset Structure
1. Cross-sectional data: random sampling; results unaffected by sampling order
2. Time series data: Sampling the same population at intervals over time
3. Pooled cross-sectional data: Randomly sampling from the same population at different time points; the samples drawn at different time points, but each tie the sample may differ
4. Longitudinal data: It involves collecting data from the same set of subjects over a long period, with the exact same sample observed at every time point.
### How to Describe a Sample?
- There are three key concepts to master. 
	- The first is observation: each observation represents an individual or a single instance in our study, such as a student or a test attempt. 
	- The second is variable: variables are the characteristics or attributes we are interested in, such as wages, years of education, or work experience. Each variable takes different values across different observations. 
	- The third concept is the value: it is the actual numeric value that a variable takes at a specific observation point.
### Descriptive Statistics
- Purpose: Raw data are typically massive and disorganized. We need to summarize and extract valuable information from large and unordered data
- Descriptive statistics: Summarizing and distilling existing data
- What is described: 
	- Central tendency: where is the center of the data
		- Mean/Expected Value: Sensitive and easily affected by extreme values. Most representative when the variable is continuous, not heavily skewed, and free of extreme values.
		- Mode: The value/category that appears most frequently (There may be none, one, or multiple modes)
		- Median: The middle value after the data are ordered (or the average of the two middle values). Less affected by extreme values, useful when data are skewed or contain extreme values
	- Deviation tendency (Dispersion): how spread out is the data
		- Range: Maximum value - Minimum value
		- Interquartile Range (IQR): IQR = Q3 - Q1 (used in boxplots)
		- Variance (var): The average of the squared deviations from the mean (reflects the average spread around the center)
		- Standard Deviation (std. dev.): The square root of the variance
	- (value) distribution: what is the overall pattern of the data?
		- Probability distribution: A table or equation that links each outcome of an experiment to its probability of occurrence
			- Skewness: Degree of asymmetry relative to the mean
			- Kurtosis: Steepness of distribution shape
		- Frequency distribution: histogram

| Variable     | Parameter                                                | Statistics                                                  |
| :----------- | :------------------------------------------------------- | :---------------------------------------------------------- |
| **Mean**     | $$\mu = \frac{\sum_{i=1}^N x_i}{N}$$                     | $$\bar{X} = \frac{\sum_{i=1}^n x_i}{n}$$                    |
| **Variance** | $$\sigma^2 = \frac{\sum_{i=1}^N (x_i - \mu)^2}{N}$$      | $$s^2 = \frac{\sum_{i=1}^n (x_i - \bar{X})^2}{n - 1}$$      |
| **SD**       | $$\sigma = \sqrt{\frac{\sum_{i=1}^N (x_i - \mu)^2}{N}}$$ | $$s = \sqrt{\frac{\sum_{i=1}^n (x_i - \bar{X})^2}{n - 1}}$$ |
- Boxplot:
	* **Quartiles**: Sort the data from smallest to largest, divide equally into four parts; the values at the division points are the quartiles
	* **The three quartiles in order are:**
		* Lower/First quartile $Q_1$
		* Middle/Second quartile $Q_2$ / Median
		* Upper/Third quartile $Q_3$
	* **$\text{IQR} = \text{Third quartile} - \text{First quartile} = Q_3 - Q_1$**
	* **Five-number summary**
	* **Outlier**: A point that deviates severely from the center of the data ($> Q_3 + 1.5\text{IQR}$ or $< Q_1 - 1.5\text{IQR}$); typically marked with $*$ or $\cdot$ in a boxplot
	* **Percentile**: The "$r$-th percentile" is the value at or below which $r\%$ of the data falls. For example, "your score is in the top 3% of the school" means your score is the 97th percentile—i.e., 97% of students score no higher than you.
### Data in Educational Research
* **Subjects of educational research:**
	* Individuals (students, teachers, administrators, parents, etc.)
	* Institutions (classrooms, schools, departments, etc.)
	* Systems (regional/national/global education systems; systems at different levels: primary, secondary, tertiary education, ...)
	* Activities (learning, teaching, research, administration, etc.)
	* Elements (inputs, outputs, outcomes)
* **What is easy to measure in education, and what is not?**
	* Despite the efforts of psychometricians, psychologists, and neuroscientists, many changes occurring in our brains remain difficult to measure...
	* Motivation, emotions, feelings…
- Typical Data Structure: Nested and stratified
### What Can We Analyze from Nested Data?
* **Aggregation**: Using summary statistics from lower-level observations to measure group characteristics

| Factor | Individual-level Statistic/Variable | Aggregated-level Statistic/Variable |
| :--- | :--- | :--- |
| **Academic performance** | Test score (continuous) | Average test score (continuous) |
| **School dropout** | Whether returned to school (dummy variable) | Dropout rate (continuous variable) |
| **Gender** | Male or female (dummy) | Female/male student ratio (continuous variable) |
| **Satisfaction** | 1–4 scale (ordinal) | Percentage of satisfied students (continuous variable);<br>Average satisfaction score (continuous) |

> **Note: Aggregated data may fail to reflect the large variation within each higher-level unit.**
## Basic Stata Operations (Các Thao Tác Cơ Bản Trong Stata)

### 1. Bản chất & Định nghĩa cốt lõi (Slide 1–9 & Transcript P1–P9)
* **Phân loại nhiệm vụ:** **Thực thi Phần mềm Thống kê & Phân tích Kinh tế lượng (Statistical Computing & Econometric Data Management)**.
* **Bản chất kỹ thuật:** 
  * Stata là một gói phần mềm thống kê toàn diện, kết hợp linh hoạt giữa giao diện tương tác đồ họa (GUI / Point-and-Click) và ngôn ngữ lập trình dòng lệnh (Command-driven Programming).
  * Cú pháp lệnh Stata tuân thủ cấu trúc logic chuẩn mực nghiêm ngặt:
    $$[\text{prefix:}] \quad \text{cmd} \quad [\text{varlist}] \quad [=\exp] \quad [\text{if}] \quad [\text{in}] \quad [\text{using } \text{filename}] \quad [,\; \text{options}]$$
    * Trong đó: `cmd` là lệnh bắt buộc, các thành phần trong ngoặc vuông `[...]` là tùy chọn, và toàn bộ mệnh đề chỉ cho phép một dấu phẩy đơn duy nhất đứng trước các tham số bổ trợ (`options`).
* **Điểm khác biệt / Điểm đặc trưng:** 
  * Cung cấp không gian làm việc tích hợp 5 cửa sổ đồng bộ theo thời gian thực: **Review** (lịch sử lệnh), **Results** (kết quả hiển thị), **Command** (nhập lệnh trực tiếp), **Variables** (danh mục biến số trong bộ nhớ RAM), và **Properties** (thuộc tính biến và tệp dữ liệu).
  * Quản lý phân tích thông qua tệp kịch bản lệnh **Do-file** (`.do`), đảm bảo tính tái lập (reproducibility), khả năng tự động hóa chuỗi quy trình làm sạch/ước lượng, và thuận tiện kiểm thử cộng tác.
  * Tích hợp kho lệnh ngoại vi khổng lồ được đóng góp và cập nhật liên tục từ cộng đồng kinh tế lượng quốc tế thông qua lệnh tra cứu trợ giúp cốt lõi: $\text{help } [\text{command}]$.

### 2. Phân tích các ví dụ minh họa (Slide 6–14 & Transcript P6–P14)
* **Quy ước cú pháp kịch bản trong Do-file (Scripting & Annotations):**
  * *Biểu diễn logic:* 
    $$* \quad \text{Comment dòng đơn}; \quad /* \; \dots \; */ \quad \text{Comment khối}; \quad // \quad \text{Comment nội dòng}; \quad /// \quad \text{Nối dòng tiếp theo}$$
  * *Cơ chế thực tế:* Trình thông dịch Stata tự động bỏ qua các khối ký tự chú thích để phục vụ ghi chú học thuật mà không làm gián đoạn luồng thực thi; ký tự `///` cho phép ngắt các câu lệnh phức tạp dài nhiều dòng nhằm tối ưu hóa khả năng đọc mã nguồn.
* **Luồng nhập và chuyển đổi định dạng dữ liệu (Data Ingestion & Formatting):**
  * *Biểu diễn logic:* 
    $$\text{Tệp nguồn (Excel/CSV)} \xrightarrow{\text{File} \rightarrow \text{Import}} \text{Bộ nhớ Stata (Memory)} \xrightarrow{\text{Save / File} \rightarrow \text{Save}} \text{Tệp dữ liệu gốc (.dta)}$$
  * *Cơ chế thực tế:* Tránh phương pháp sao chép thủ công qua Data Editor vốn dễ phát sinh lỗi định dạng và kém hiệu quả trên tập dữ liệu lớn. Việc nhập qua menu lệnh cấu trúc `import excel` và chuyển đổi sang định dạng nhị phân độc quyền `.dta` giúp bảo toàn toàn vẹn nhãn biến (variable labels), nhãn giá trị (value labels) cùng các thuộc tính đo lường.
* **Mô phỏng truy vấn và tính toán tương tác (Interactive Calculation):**
  * *Biểu diễn logic:* 
    $$\text{display } 2+5 \longrightarrow 7; \quad \text{count if } [\text{condition}] \longrightarrow N_{\text{filtered}}$$
  * *Cơ chế thực tế:* Cho phép người nghiên cứu kiểm tra nhanh các phép toán thống kê số học hoặc duyệt số lượng quan sát thỏa mãn điều kiện logic cụ thể mà không cần can thiệp làm thay đổi cấu trúc bảng dữ liệu gốc.

### 3. Ý nghĩa thực tiễn & Ứng dụng ra quyết định (Slide 10–15 & Transcript P10–P15)
* **Theo góc nhìn Chuẩn hóa Quy trình Phân tích (Workflow Standardization):**
  * *Mục tiêu:* Triệt tiêu rủi ro mất mát dữ liệu và đảm bảo khả năng tái tạo trọn vẹn kết quả nghiên cứu khoa học.
  * *Hành động can thiệp:* Bắt buộc thiết lập thói quen đặt tên, lưu trữ và chú thích chi tiết cho Do-file; ghi chú rõ ràng giả định thống kê và sao lưu tệp lệnh song song với nhật ký kết quả (Log-file).
* **Theo góc nhìn Quản trị Thư mục & Dữ liệu Dự án (Working Directory Management):**
  * *Mục tiêu:* Ngăn chặn xung đột đường dẫn tệp và thất lạc các bảng biểu, đồ thị xuất bản.
  * *Hành động can thiệp:* Thiết lập thư mục làm việc hiện hành đồng nhất ở đầu mỗi phiên nghiên cứu bằng câu lệnh $\text{cd } \text{"new\_path"}$ hoặc cấu hình trực tiếp từ giao diện, giúp kiểm soát chính xác vị trí đọc và ghi tệp xuất bản dữ liệu.
* **Theo góc nhìn Xuất bản & Chuyển giao Báo cáo (Data Exportation & Dissemination):**
  * *Mục tiêu:* Linh hoạt chia sẻ dữ liệu nghiên cứu và bảng kết quả thống kê tương thích với các phần mềm phổ thông khác.
  * *Hành động can thiệp:* Tùy biến các tham số xuất bản (lựa chọn danh sách biến mục tiêu, giữ nguyên nhãn biến thay vì tên rút gọn, chỉ định dòng đầu làm tiêu đề cột) để tạo các tệp bảng tính Excel chuẩn xác phục vụ báo cáo khoa học hoặc hoạch định chính sách.
## Data Cleaning and Common Stata Commands (Làm Sạch Dữ Liệu và Các Lệnh Thao Tác Cơ Bản Trong Stata)

### 1. Bản chất & Định nghĩa cốt lõi (Slide 1–33 & Transcript P1–P33)
* **Phân loại nhiệm vụ:** **Tiền xử lý dữ liệu, Kiểm tra chất lượng & Thống kê mô tả (Data Preprocessing, Quality Inspection & Descriptive Statistics)**. (→ [Process data from Dirty to Clean](/blog/process-data-from-dirty-to-clean/))
* **Bản chất kỹ thuật:** 
  * Chuẩn hóa và chuyển đổi dữ liệu thô sang dạng cấu trúc sạch phục vụ ước lượng mô hình thông qua quy trình 4 giai đoạn khép kín:
    $$\text{Kiểm tra tổng quan} \xrightarrow{\text{Thanh lọc}} \text{Mã hóa \& Chuẩn hóa} \xrightarrow{\text{Mô tả trực quan}} \text{Tổng hợp chỉ số (Index)}$$
  * Kiểm tra chất lượng và cấu trúc dữ liệu:
    * Phát hiện khuyết thiếu: sử dụng hệ thống lệnh `misstable` (`summarize`, `patterns`, `tree`, `nested`) nhằm nhận diện bản chất ngẫu nhiên hay có hệ thống của giá trị bị khuyết ($M_{ij} \in \{., .a, \dots, .z\}$).
    * Phát hiện trùng lặp (`duplicates`) và kiểm tra toàn diện biến số (`describe`, `codebook`).
  * Hệ thống kiểu dữ liệu và gắn nhãn (Labeling system):
    * Phân loại 3 nhóm hiển thị: Số thực/nguyên (Numeric - màu đen: `byte`, `int`, `long`, `float`, `double`), Chuỗi ký tự (String - màu đỏ: `str#`, `strL`), và Số có nhãn (Labeled numeric - màu xanh lam).
    * Quy trình ánh xạ nhãn hai bước:
      $$\text{label define } \text{lbl\_name} \quad 1 \text{ "A"} \quad 2 \text{ "B"} \quad \xrightarrow{\text{label values } \text{var} \quad \text{lbl\_name}} \text{Hiển thị nhãn trên nền số}$$
  * Chuẩn hóa và đo lường độ tin cậy thang đo:
    * Chuẩn hóa $Z$-score: $Z = \frac{X - \mu}{\sigma} \sim \mathcal{N}(0, 1)$ nhằm triệt tiêu ảnh hưởng của đơn vị đo lường khác nhau trước khi tổng hợp chỉ số.
    * Kiểm định tính nhất quán nội tại bằng hệ số Cronbach's alpha:
      $$\alpha = \frac{K}{K - 1} \left(1 - \frac{\sum_{i=1}^K \sigma_{Y_i}^2}{\sigma_X^2}\right)$$
* **Điểm khác biệt / Điểm đặc trưng:** 
  * Phân biệt ranh giới nghiêm ngặt giữa phép gán bằng đơn (`=`) và phép so sánh bằng đôi (`==`).
  * Phân biệt rõ cơ chế chuyển đổi dữ liệu: `encode`/`decode` (giữa chuỗi ký tự và biến số có nhãn phân loại) với `tostring`/`destring` (chuyển đổi kiểu lưu trữ thuần túy).

### 2. Phân tích các ví dụ minh họa (Slide 1–33 & Transcript P1–P33)
* **Duyệt và Lọc dữ liệu trên bộ dữ liệu `auto.dta` (Slide 2–9 & Transcript P2–P9):**
  * *Biểu diễn logic:* 
    $$\text{auto.dta} \xrightarrow{\text{list make foreign rep78 in 1/10}} \text{Bảng 10 dòng đầu}; \quad \text{tab rep78 foreign, m col} \rightarrow P(\text{rep78} \mid \text{foreign})$$
  * *Cơ chế thực tế:* Sử dụng tùy chọn `, m` (missing) để không bỏ sót các dòng bị khuyết khi lập bảng tần số, kết hợp tùy chọn `col` để phân tích tỷ lệ phần trăm theo cột giữa nguồn gốc xuất xứ xe và tần suất sửa chữa năm 1978.
* **Tái mã hóa và chuyển đổi kiểu dữ liệu (Slide 17–20 & Transcript P17–P20):**
  * *Biểu diễn logic:* 
    $$\text{foreign } (0=\text{Domestic}, 1=\text{Foreign}) \xrightarrow{\text{recode foreign (0=2)}} (1=\text{Foreign}, 2=\text{Domestic}) \xrightarrow{\text{decode foreign, gen(origin)}} \text{origin (str)}$$
  * *Cơ chế thực tế:* Sau khi đảo mã định danh bằng `recode`, sử dụng `decode` thay vì `encode` vì biến nguồn là biến số có gán nhãn, chuyển toàn bộ nhãn hiển thị thành biến chuỗi ký tự độc lập phục vụ lưu trữ hoặc ghép nối.
* **Thống kê mô tả và Trực quan hóa phân phối (Slide 21–30 & Transcript P21–P30):**
  * *Biểu diễn logic:* 
    $$\text{sum length, detail} \rightarrow \{\text{Median}, \text{Skewness}, \text{Kurtosis}\}; \quad \text{graph box length, over(foreign)} \rightarrow \text{IQR comparison}$$
  * *Cơ chế thực tế:* Biểu đồ hộp nhóm theo biến `foreign` chỉ ra xe nội địa có chiều dài trung vị lớn hơn (~200 so với ~170) và độ biến thiên rộng hơn rõ rệt so với xe nhập khẩu; kết hợp hàm `histogram GPA, normal kdensity` để đối chiếu đường phân phối chuẩn lý thuyết với đường mật độ nhân thực tế.
* **Xây dựng biến tổng hợp và Đo lường độ tin cậy (Slide 31–33 & Transcript P31–P33):**
  * *Biểu diễn logic:* 
    $$\{\text{trunk\_std}, \text{headroom\_std}\} \xrightarrow{\text{space} = \frac{\text{trunk\_std} + \text{headroom\_std}}{2}} \text{space (Composite Index)}; \quad \text{alpha mpg rep78} \dots \rightarrow \alpha = 0.6530$$
  * *Cơ chế thực tế:* Chuẩn hóa tỉ lệ 100 và chuẩn hóa $Z$-score giúp dung hòa thang đo kích thước khoang hành lý (`trunk`) và khoảng cách trần (`headroom`) trước khi tính trung bình cộng; hệ số $\alpha = 0.6530$ xác nhận mức độ tin cậy chấp nhận được để ghép 6 biến thành một chỉ số đại diện.

### 3. Ý nghĩa thực tiễn & Ứng dụng ra quyết định (Slide 1–33 & Transcript P1–P33)
* **Theo góc nhìn Kiểm soát chất lượng dữ liệu (Data Hygiene & Integrity):**
  * *Mục tiêu:* Ngăn ngừa sai lệch ước lượng (estimation bias) do dữ liệu trùng lặp hoặc cơ chế khuyết thiếu phi ngẫu nhiên gây ra.
  * *Hành động can thiệp:* Bắt buộc kiểm tra `misstable` và `duplicates` ngay sau khi nạp dữ liệu; nếu tỷ lệ khuyết thiếu cao cần lựa chọn giải pháp phù hợp (thay thế bằng trung bình/trung vị, dùng mô hình hồi quy quy kết, hoặc loại bỏ mẫu có chọn lọc).
* **Theo góc nhìn Trực quan hóa và Kiểm định giả định mô hình (Exploratory Data Analysis):**
  * *Mục tiêu:* Đánh giá tính chuẩn (normality) và độ phân tán của biến phụ thuộc trước khi chạy mô hình hồi quy OLS.
  * *Hành động can thiệp:* Quan sát độ lệch (skewness), độ nhọn (kurtosis) và biểu đồ `histogram, kdensity` cùng `graph box`; nếu xuất hiện ngoại lai (outliers) vượt quá khoảng $1.5 \times \text{IQR}$, cân nhắc chuyển đổi logarit hoặc cắt tỉa (winsorize) giá trị biên.
* **Theo góc nhìn Đo lường chỉ số tổng hợp (Index Engineering):**
  * *Mục tiêu:* Xây dựng các biến trừu tượng (như mức độ hài lòng, không gian nội thất, năng lực học thuật) đạt chuẩn đo lường khoa học.
  * *Hành động can thiệp:* Bắt buộc thực hiện phép chuẩn hóa thang đo nhằm triệt tiêu khác biệt về phương sai đơn vị; chạy lệnh `alpha ..., item` để kiểm tra đóng góp của từng biến thành phần, loại bỏ các mục làm giảm hệ số tương quan tổng trước khi đưa vào mô hình phân tích chính thức.
# Foundation of Statistical Inference
## Fundamental Statistical Concepts
- Basic Statistical Concepts:
	- Variable: a construct that can be measured in a population (e.g., height, ability, self-esteem)
	- Variance: measures how far a random variable deviates from its expected value, that is, its means (→ Expectation)
	- Standard Deviation (SD)
	- Standardization
	- Covariance
	- Correlation:
![Ảnh chụp Màn hình 2026-09-13 lúc 14.10.12](/vault-assets/anh-chup-man-hinh-2026-09-13-luc-14-10-12-16bfa21a.webp)
- Linear Regression Analysis: a classic statistical method for analyzing relationships between variable (→ [Tương quan và hồi quy](/blog/tuong-quan-va-hoi-quy/))
![Ảnh chụp Màn hình 2026-09-13 lúc 14.11.28](/vault-assets/anh-chup-man-hinh-2026-09-13-luc-14-11-28-977f4106.webp)

## Sampling Theory
### Why do we sample?: 
- Since it is often difficult to survey every member of an entire population, we use a sample to infer the properties of the population from which it is drawn. This process is called statistical inference
- Can we really rely on samples to infer the population?: The answer is yes, provided that our sampling design is scientific and reasonable. The core purpose of sampling design is to ensure the accuracy of our inferences, making them both unbiased and precise.
### What makes a Good Sample?
- A sample that fits the research purpose - relevant to the research question (RQ) and methodology
- In quantitative research, we prefer a statistically representative sample of the target population, thus using a "probability" approach to obtain samples
	- What does representative mean?: representativeness means that the sample accurately reflects the true characteristics of the population in terms of key features.
	- A sample is considered representative if the proportions of its subgroups closely mirror those of the total population. Conversely, if a sample shows a disproportionate skew toward a specific group, it is likely biased and fails to accurately reflect the whole.
- In qualitative research, we prefer samples that provide as much information as possible, so samples are deliberately selected.
- Sample categorize: 
	- Representative sample: a sample that is similar to the source population on all (relevant) characteristics
	- Biased sample: a sample that systematically differs from the population. 
		- Potential Sources of Bias
			- Undercoverage: Elements of the population are not included in the sampling frame
			- Overcoverage: Including data from outside the target population
			- Non-response: Failure to obtain complete data from all selected individuals
				- Caused by self-selection bias: some people are willing to participate in surveys while others are not, and this choice itself may be correlated with the variables we are studying.
		- Sampling Bias and Error: 
			- Sampling bias: a systematic difference between the value of a sample statistic and the corresponding population parameter. 
				- Caused by a flawed sampling process
			- Sampling error: the difference between the value of a sample statistic and the corresponding population parameter
				- Due to not surveying all members of the population
			**Key factor**: Sample Size!!
		- Three Key Characteristics of a Statistically Representative Sample:
			- Similarity: 
				- The sample resembles the population in its key characteristics
				- Reduce systematic bias
			- Sample Size: 
				- Adequate sample size
				- To reduce sampling error
			- Randomization: 
				- Equal (or at least non-zere) probability of being selected
				- Eliminates systematic bias by design
### How to Dram a Sample?
- Probability Sample: Use in Quantitative Research
	Random sampling:
	- A sample drawn by a procedure where every member of the population has an equal (or at least non-zero) probability of being selected
	- The probability of one individual being selected is not affected by the selection of others - i.e., each selection is completely independent of the text
	- Selection is based entirely on chance
	- Strategies for Random Sampling: (→ [Monitoring ANR, part 1](/blog/monitoring-anr-part-1-establishing-baseline-control-and-reference-sites-and-data/))
		- Simple Random Sampling: e.g., use random numbers to select 50 students from 1000
		- Systematic sampling: Order the population, the select every k-th unit. e.g., Sort by student ID and select every 10th student
		- Stratified sampling: e.g.,  Stratify the school by grade level
			- Stage 1: Identify characteristics present in the broader population that must be represented in the sample - divide the broader population into mutually exclusive homogeneous groups
			- Stage 2: Randomly sample within these groups; the sample size for each group is determined by judgement or a sample size table
			- Classification: 
				- Proportional Stratified sampling:
					- Equal probability selection
					- More efficient than simple random sampling
					- Near-perfect representation of the population
				- Disproportional Stratified sampling
					- When research interest focuses more on group comparisons rather than generalizing to the population
					- When certain subgroups in the population are very small; oversampling is needed to ensure adequate sample size
		- Cluster sampling: e.g., Randomly select 3 classes, the survey all students within those classes
		- Multi-stage/Multi-phrase: Sampling is conducted in multiple stages
- Non-probability Sampling: Use in Qualitative Research
	- Convenience sampling: The sample includes people who are accessible, willing to participate, or easy to recruit
	- Purposive sampling: the researcher defines the characteristics of the target population and selects individuals who match those characteristics
	- Quota sampling: the researcher determines an appropriate sample size or quota for important groups and draws a convenience sample from each group
	- Snowball sampling: each research participant is asked to recommend other potential participants
### How to Determine Sample Size for Statistical Inference
- What is the purpose of sampling: To make accurate inferences about the population
- Use as large a sample as possible! Or more practically: What is the minimum acceptable sample size: ![Ảnh chụp Màn hình 2026-09-13 lúc 15.36.22](/vault-assets/anh-chup-man-hinh-2026-09-13-luc-15-36-22-247d8f63.webp)
- Sample Size Formular (→ Convergence of Random Variables)
	- Simple Random Sampling:
  ![Ảnh chụp Màn hình 2026-09-13 lúc 15.37.18](/vault-assets/anh-chup-man-hinh-2026-09-13-luc-15-37-18-76ee1e76.webp)
- Properities of Sampling Distributions: Sampling distributions are characterized by two fundamental properties, described by the 
	- Law of Large Numbers: tells us that in a single draw, as the sample size increases, the sample mean gets closer to the population mean. This serves as one of the theoretical foundations for calculating sample size.
	- Central Limit Theorem: goes a step further, describing the probabilistic characteristics of sample means under repeated sampling. As the sample size in each draw increases, the distribution of sample means becomes more concentrated with a smaller standard deviation. Moreover, regardless of the underlying population distribution, the distribution of sample means will tend toward a normal distribution. This provides another crucial theoretical basis for statistical inference.
	![Ảnh chụp Màn hình 2026-09-13 lúc 15.39.35](/vault-assets/anh-chup-man-hinh-2026-09-13-luc-15-39-35-17a662de.webp)
- Population Size and Mininum Sample Size: for large populations, ensuring a sample size of approximately four hundred is sufficient to meet the basic requirements for statistical inference. This finding holds significant practical implications for the design of empirical research studies.
![Ảnh chụp Màn hình 2026-09-13 lúc 15.41.02](/vault-assets/anh-chup-man-hinh-2026-09-13-luc-15-41-02-5817f130.webp)
## Sampling Weights

### I. Trọng Số Lấy Mẫu (Sampling Weights)

#### 1. Bản chất & Định nghĩa cốt lõi (Slide 1–2 & Transcript P1–P2)
* **Phân loại nhiệm vụ:** **Suy luận thống kê & Hiệu chỉnh sai lệch mẫu (Statistical Inference & Bias Correction)**.
* **Bản chất kỹ thuật:** 
  * Trọng số lấy mẫu ($w_i$) là hệ số nhân gán cho từng quan sát nhằm bù đắp cho sai lệch cấu trúc giữa mẫu thu thập ($\mathcal{S}$) và tổng thể mục tiêu ($\mathcal{P}$):
    $$w_i \propto \frac{1}{\pi_i} \times \frac{1}{r_i}$$
    * Trong đó: $\pi_i = P(i \in \mathcal{S})$ là xác suất chọn mẫu của cá thể $i$, và $r_i$ là xác suất phản hồi (response probability).
  * Mục tiêu toán học là tái cân bằng phân phối của các biến nhân khẩu học then chốt (như giới tính, độ tuổi, khu vực địa lý) trong mẫu sao cho khớp với phân phối thực tế của tổng thể:
    $$\hat{\mu}_w = \frac{\sum_{i=1}^n w_i y_i}{\sum_{i=1}^n w_i} \approx \mathbb{E}_{\mathcal{P}}[Y]$$
* **Điểm khác biệt / Điểm đặc trưng:** 
  * Khác với giả định lấy mẫu ngẫu nhiên đơn giản (Simple Random Sampling - SRS) nơi mọi cá thể có xác suất được chọn ngang nhau ($w_i = 1$), trọng số lấy mẫu can thiệp trực tiếp để sửa chữa hai nguồn sai lệch chính: **Xác suất chọn không đồng đều (Unequal probability of selection)** và **Hiện tượng không phản hồi (Non-response)**.

#### 2. Phân tích các ví dụ minh họa (Slide 2 & Transcript P2)
* **Lệch cấu trúc do Tỷ lệ chọn & Không phản hồi (Structural Distortion):**
  * *Biểu diễn logic:* 
    $$P_{\text{sample}}(\text{Nhóm}_k) \ne P_{\text{population}}(\text{Nhóm}_k) \implies \bar{Y}_{\text{unweighted}} \ne \mu_Y$$
  * *Cơ chế thực tế:* Biểu đồ tròn phía trên biểu diễn phân phối thực của tổng thể (ví dụ: nhóm thiểu số chiếm tỷ trọng nhỏ, nhóm đa số chiếm ưu thế). Biểu đồ tròn phía dưới phản ánh mẫu thực tế thu được bị méo mó (các nhóm có kích thước gần như bằng nhau $3:3:3$ thay vì phản ánh đúng tỷ lệ $4:3:9$). Nếu không gán trọng số, các nhóm được lấy mẫu vượt mức (oversampled) sẽ chi phối kết quả ước lượng.
* **Cơ chế tái cân bằng qua Trọng số (Reweighting Mechanism):**
  * *Biểu diễn logic:* 
    $$\text{Nhóm thiếu đại diện (Underrepresented)} \xrightarrow{w_i > 1} \text{Tăng trọng số}; \quad \text{Nhóm thừa đại diện (Overrepresented)} \xrightarrow{w_i < 1} \text{Giảm trọng số}$$
  * *Cơ chế thực tế:* Gán trọng số nghịch đảo với xác suất xuất hiện giúp kéo dãn tỷ trọng của nhóm bị lấy mẫu thiếu và thu nhỏ tỷ trọng của nhóm bị lấy mẫu dư, đưa cấu trúc mẫu trở về đúng tỷ lệ của tổng thể ban đầu.

#### 3. Ý nghĩa thực tiễn & Ứng dụng ra quyết định (Slide 1–2 & Transcript P1–P2)
* **Theo góc nhìn Thiết kế điều tra & Thu thập dữ liệu (Survey Methodology):**
  * *Mục tiêu:* Kiểm soát và khắc phục rủi ro sai lệch chọn mẫu (selection bias) và tỷ lệ từ chối trả lời cao trong thực địa.
  * *Hành động can thiệp:* Ghi nhận đầy đủ biến số thiết kế mẫu (tầng khảo sát, cụm khảo sát, xác suất rút thăm ban đầu) để xây dựng hệ số trọng số cơ sở (base weights) trước khi tiến hành phân tích.
* **Theo góc nhìn Suy luận Thống kê & Phân tích Chính sách (Policy Inference):**
  * *Mục tiêu:* Đảm bảo các chỉ số ước lượng (tỷ lệ nghèo, điểm thi trung bình, mức độ hài lòng) phản ánh đúng bức tranh toàn dân chứ không chỉ phản ánh nhóm người sẵn sàng trả lời khảo sát.
  * *Hành động can thiệp:* Bắt buộc áp dụng tiền tố điều chỉnh trọng số (như `[pweight = w]` hoặc `svyset` trong Stata) khi chạy thống kê mô tả và mô hình kinh tế lượng để tránh đưa ra kết luận chính sách sai lệch.
* **Theo góc nhìn Đánh giá tính đại diện (Representativeness Validation):**
  * *Mục tiêu:* Đánh giá mức độ tiệm cận của dữ liệu mẫu đối với các cơ sở dữ liệu dân số chuẩn (Tổng điều tra dân số - Census).
  * *Hành động can thiệp:* So sánh bảng phân bổ tần suất sau khi gán trọng số với dữ liệu điều tra dân số quốc gia trên các biến đặc trưng (tuổi, giới tính, vùng miền); nếu sai lệch còn lớn, áp dụng kỹ thuật hiệu chỉnh hậu tầng (post-stratification) hoặc hiệu chỉnh viền (raking).
### II. Types of Survey Weights and Their Calculation
- Two most common types:
	- Design Weights/Base Weights (based on sampling design): which arises from the sampling design. The formula for the base weight is the total population size divided by the number of sampled participants.
	- Post-Stratification/Non-response weights (after data collection): which is calculated after data collection. The formula for the post-stratification weight is the number of sampled participants divided by the number of actual respondents.
		Purpose: to correct for unequal observation probabilities

$$\text{Base weight} = \frac{\text{Total population size}}{\text{No. of sampled participants}}$$

$$\text{Non-response weight} = \frac{\text{No. of sampled participants}}{\text{No. of actual respondents}}$$

* **Purpose: to correct for unequal observation probabilities**
* Question: Can weighting solve the problem of systematically biased sampling?
	* **The basic idea of weighting is to use observed (sampled and responding) individuals to represent the population**
	* **Key assumption: No systematic differences!**
		* Random sample
		* Random non-response
		* Missing at random
### 3. Calculating Weights
* **Purpose: to correct for unequal observation probabilities across strata**
* **$\text{Weight} = 1 / p(\text{observed})$**
* **$\text{Base weight} = 1 / p(\text{sampled})$**
			$= \text{No. of population} / \text{No. of sampled participants}$
* **$\text{PS weight} = 1 / p(\text{response})$**
			$= \text{No. of sampled participants} / \text{No. of respondents}$
### 4. Using Weights
- Weighted Average:
*If $n$ values $x_1, x_2, \dots, x_n$ have corresponding weights $w_1, w_2, \dots, w_n$, then:*

$$\bar{x} = \frac{x_1 w_1 + x_2 w_2 + \dots + x_n w_n}{w_1 + w_2 + \dots + w_n}$$
### Ví dụ Thực hành: Ước lượng Chiều cao Trung bình và So sánh Phương pháp Gán Trọng số (Sampling Weights vs. Analytic Weights)
#### 1. Bản chất & Định nghĩa cốt lõi (Slide 8–10 & Transcript P8–P10)
* **Phân loại nhiệm vụ:** **Ước lượng tham số tổng thể từ dữ liệu nhóm / phân tầng (Group-level Aggregation & Parameter Estimation)**.
* **Bản chất kỹ thuật:** 
  * Xác định giá trị kỳ vọng của tổng thể ($\mu$) khi chỉ có dữ liệu tóm tắt cấp trường (Mean $\bar{y}_j$, Quy mô mẫu $n_j$, Tổng thể $N_j$):
    * Trọng số lấy mẫu (Sampling Weight / pweight): $w_j = \frac{N_j}{n_j} = \frac{1}{\pi_j}$, phản ánh số lượng cá thể trong tổng thể mà một quan sát đại diện.
    * Trọng số phân tích (Analytic Weight / aweight): tỷ lệ thuận với số lượng quan sát dùng để tính giá trị trung bình nhóm ($N_j$ hoặc $n_j$), phản ánh độ chính xác thông tin và phương sai của số bình quân nhóm:
      $$\text{Var}(\bar{y}_j) = \frac{\sigma^2}{n_j} \implies a_j \propto n_j$$
  * Công thức mở rộng toàn bộ quy mô (Expansion / Correct Reweighting):
    $$\bar{y}_{\text{pop}} = \frac{\sum_{j=1}^k \bar{y}_j \times n_j \times w_j}{\sum_{j=1}^k n_j \times w_j} = \frac{\sum_{j=1}^k \bar{y}_j \times N_j}{\sum_{j=1}^k N_j}$$
* **Điểm khác biệt / Điểm đặc trưng:** 
  * Phân biệt rõ sự khác nhau giữa gán trọng số ở cấp cá thể (micro-level data) và cấp nhóm gộp (aggregated group-level data). Ở cấp dữ liệu nhóm, việc chỉ gán $w_j$ đơn thuần là chưa đủ mà phải kết hợp cả quy mô mẫu hoặc quy mô tổng thể từng trường để bảo toàn tổng số cá thể đại diện.
#### 2. Phân tích các ví dụ minh họa (Slide 8–10 & Transcript P8–P10)
* **Phương pháp 1: Tính trung bình cộng đơn giản trên mẫu (Simple Average - Slide 8 & P8):**
  * *Biểu diễn logic:* 
    $$\bar{y}_{\text{naive}} = \frac{\sum_{j=1}^4 \bar{y}_j n_j}{\sum_{j=1}^4 n_j} = \frac{155(82) + 143(92) + 157(66) + 160(80)}{82 + 92 + 66 + 80} = \frac{49028}{320} = 153.21\text{ cm}$$
  * *Cơ chế thực tế:* Phương pháp này ngầm giả định mọi học sinh trong 4 trường đều có xác suất được chọn ngang nhau. Thực tế tỷ lệ chọn mẫu giữa các trường rất khác nhau (Trường B lấy mẫu tới $\approx 1/3$, trong khi Trường A chỉ lấy mẫu $\approx 1/5$). Việc gộp trực tiếp khiến Trường B bị thổi phồng ảnh hưởng, kéo mức chiều cao trung bình bị sai lệch về phía 143 cm.
* **Phương pháp 2: Gán trọng số trực tiếp vào trung bình nhóm (Weighting Group Means Only - Slide 9 & P9):**
  * *Biểu diễn logic:* 
    $$\bar{y}_{\text{wrong\_wt}} = \frac{\sum_{j=1}^4 \bar{y}_j w_j}{\sum_{j=1}^4 w_j} = \frac{155(5) + 143(3) + 157(4) + 160(5)}{5 + 3 + 4 + 5} = \frac{2632}{17} \approx 154.82\text{ cm}$$
  * *Cơ chế thực tế:* Phương pháp này chỉ nhân trọng số lấy mẫu ($w_j$) với trung bình chiều cao của từng trường mà bỏ qua quy mô học sinh thực tế của mỗi trường. Nó coi 4 trường như 4 cá thể độc lập có trọng số $5, 3, 4, 5$, dẫn đến sai lệch vì không tính đến việc các trường có tổng số học sinh rất khác nhau.
* **Phương pháp 3: Khôi phục toàn bộ tổng thể qua Tích $n_j \times w_j$ (Analytic Weight / Expansion Method - Slide 10 & P10):**
  * *Biểu diễn logic:* 
    $$\bar{y}_{\text{correct}} = \frac{155(82 \times 5) + 143(92 \times 3) + 157(66 \times 4) + 160(80 \times 5)}{(82 \times 5) + (92 \times 3) + (66 \times 4) + (80 \times 5)} = \frac{155(410) + 143(276) + 157(264) + 160(400)}{410 + 276 + 264 + 400} = \frac{208476}{1350} \approx 154.42\text{ cm}$$
  * *Cơ chế thực tế:* Mỗi mẫu đại diện cho $w_j$ học sinh trong trường, nhân $n_j \times w_j$ sẽ khôi phục chính xác tổng số học sinh thực tế $N_j$ của từng trường ($410, 276, 264, 400$). Tính trung bình theo tổng số học sinh thực tế này giúp triệt tiêu hoàn toàn sai lệch xác suất chọn mẫu và sai lệch kích thước trường, cho ra kết quả ước lượng khách quan $154.42\text{ cm}$.
#### 3. Ý nghĩa thực tiễn & Ứng dụng ra quyết định (Slide 8–10 & Transcript P8–P10)
* **Theo góc nhìn Xử lý dữ liệu gộp cấp thứ bậc (Multi-level & Aggregated Data):**
  * *Mục tiêu:* Ước lượng chuẩn xác chỉ tiêu dân số/học sinh khi cơ quan nghiên cứu chỉ tiếp cận được số liệu thống kê tóm tắt theo đơn vị hành chính/trường học.
  * *Hành động can thiệp:* Tuyệt đối không tính trung bình giản đơn trên các giá trị mean có sẵn; luôn truy xuất thông tin kích thước mẫu gốc ($n_j$) và tổng quy mô nhóm ($N_j$) để áp dụng analytic weight (`[aweight = N]`).
* **Theo góc nhìn Thiết kế điều tra phân tầng không tỷ lệ (Disproportionate Stratification):**
  * *Mục tiêu:* Đánh giá tác động của chiến lược lấy mẫu vượt mức (oversampling) ở các tầng có quy mô nhỏ.
  * *Hành động can thiệp:* Khi thu thập dữ liệu với tỷ lệ rút mẫu khác nhau giữa các tầng để phục vụ so sánh nhóm, ở bước tổng hợp toàn trường/toàn quốc bắt buộc phải dùng trọng số tích hợp để đưa cấu trúc kết quả về đúng phân bổ tự nhiên.
* **Theo góc nhìn Lựa chọn câu lệnh trong phần mềm thống kê (Stata / R Syntax):**
  * *Mục tiêu:* Áp dụng đúng cú pháp trọng số tương ứng với cấu trúc dữ liệu.
  * *Hành động can thiệp:* Khi dữ liệu là từng dòng cá thể, sử dụng sampling weight `[pweight = w]` hoặc lệnh thiết lập khảo sát `svyset`. Khi dữ liệu là bảng tổng hợp các điểm trường/địa phương, khai báo analytic weight `[aweight = total_size]` để phần mềm tự động hiệu chỉnh phương sai và tính đúng giá trị trung bình tổng thể.
### Other Issues Related to Weighting
* No impact on descriptive statistics, but may adversely affect inferential statistics and standard errors.
* Weighting almost always increases the standard error of estimates.
* Extreme weights (either too large or too small) may also destabilize the system.
### Lấy Mẫu Ngẫu Nhiên và Chiến Lược Phân Tầng trong Stata (Random Sampling & Stratification Strategies)
#### 1. Bản chất & Định nghĩa cốt lõi (Slide 12, 13 & Transcript P12, P13)
* **Phân loại nhiệm vụ:** **Thu thập & Rút gọn mẫu dữ liệu (Data Reduction & Sampling Design Task)**.
* **Bản chất kỹ thuật:** 
  * Cơ chế rút ngẫu nhiên một tập hợp con $S$ từ tổng thể hoặc tập dữ liệu $\mathcal{D}$ gồm $N$ quan sát nhằm đảm bảo tính đại diện và khả năng suy rộng:
    * Rút mẫu theo tỷ lệ (Proportional Sampling): chọn ngẫu nhiên $k\%$ số dòng từ tập dữ liệu.
    * Rút mẫu theo số lượng tuyệt đối (Count Sampling): rút chính xác $n$ dòng từ tập dữ liệu.
    * Rút mẫu phân tầng (Stratified Sampling): chia dữ liệu thành $H$ tầng rời rạc theo biến phân loại $Z$ (ví dụ: trường, lớp, giới tính), sau đó thực hiện rút mẫu độc lập trong từng tầng $h$:
      $$\mathcal{D} = \bigcup_{h=1}^H \mathcal{D}_h, \quad S = \bigcup_{h=1}^H S_h \quad \text{với } S_h \subset \mathcal{D}_h$$
* **Điểm khác biệt / Điểm đặc trưng:** 
  * Đảm bảo tính tái lập (reproducibility) bằng cách cố định giá trị giả ngẫu nhiên qua lệnh hạt giống (`set seed #`); hỗ trợ bảo toàn cơ cấu nhân khẩu học/nhóm mục tiêu thông qua phân tầng thay vì rút mẫu ngẫu nhiên đơn thuần dễ làm thiếu hụt các nhóm thiểu số.
#### 2. Phân tích các ví dụ minh họa (Slide 12, 13 & Transcript P12, P13)
* **Lấy mẫu theo tỷ lệ chung vs. Theo số lượng cố định (Overall Proportional vs. Count Sampling):**
  * *Biểu diễn logic:* 
    $$\text{sample } 10 \implies n = 0.10 \times N; \quad \text{sample } 500\text{, count} \implies n = \min(500, N)$$
  * *Cơ chế thực tế:* Lệnh `sample [số]` trong Stata mặc định hiểu là rút theo phần trăm (ví dụ: giữ lại 10% dữ liệu). Khi muốn rút đúng số lượng bản ghi cố định phục vụ khảo sát thí điểm hoặc giới hạn kinh phí, phải sử dụng tùy chọn `count`.
* **Lấy mẫu phân tầng tỷ lệ bằng nhau vs. Chiến lược khác biệt (Stratified Sampling Strategies):**
  * *Biểu diễn logic:* 
    $$\text{by } Z\text{: sample } 20 \implies \forall h, \, n_h = 0.20 \times N_h$$
    $$\text{Stratified Count: } \text{by school grade: sample } 80\text{, count} \implies \forall (s, g), \, n_{s,g} = 80$$
  * *Cơ chế thực tế:* Sử dụng tiền tố `by` để phân tách không gian mẫu trước khi gọi `sample`. Rút đều cùng một tỷ lệ phần trăm giúp cấu trúc mẫu phản ánh nguyên vẹn tỷ lệ ngoài thực tế; trong khi rút cùng một số lượng quan sát cố định (như 80 học sinh mỗi khối trường) giúp đảm bảo đủ cỡ mẫu để so sánh phân tích thống kê giữa các tầng, dù sẽ làm thay đổi xác suất chọn mẫu giữa các tầng lớn và nhỏ.
#### 3. Ý nghĩa thực tiễn & Ứng dụng ra quyết định (Slide 12, 13 & Transcript P12, P13)
* **Theo góc nhìn Thiết kế nghiên cứu & Đảm bảo tính hợp lệ (Research Design & Reproducibility):**
  * *Mục tiêu:* Đảm bảo tính khoa học, minh bạch và có thể thẩm định lại của quy trình rút mẫu thử nghiệm hoặc huấn luyện mô hình.
  * *Hành động can thiệp:* Bắt buộc thiết lập hạt giống giả ngẫu nhiên (`set seed <số>`) ngay trước câu lệnh rút mẫu để bất kỳ ai chạy lại mã lệnh cũng thu được tập mẫu giống hệt nhau.
* **Theo góc nhìn Cân bằng phân bổ nhóm (Subgroup Representation & Oversampling):**
  * *Mục tiêu:* Tránh hiện tượng mất cân bằng dữ liệu hoặc thiếu quan sát ở các phân khúc quan trọng nhưng quy mô nhỏ (ví dụ: trường quy mô bé, nhóm bệnh nhân hiếm).
  * *Hành động can thiệp:* Áp dụng lấy mẫu phân tầng theo số lượng (`by strata: sample k, count`) để lấy dư mẫu (oversample) cho nhóm nhỏ, sau đó kết hợp tính toán trọng số lấy mẫu (sampling weights) ở bước phân tích để hiệu chỉnh lại sai lệch.
* **Theo góc nhìn Tối ưu hóa chi phí & Thực thi khảo sát (Fieldwork Resource Optimization):**
  * *Mục tiêu:* Kiểm soát chính xác khối lượng công việc, kinh phí điều tra và chỉ tiêu số phiếu tại từng địa bàn thực địa.
  * *Hành động can thiệp:* Cố định số lượng mẫu cụ thể trên từng đơn vị hành chính/trường học thay vì tỷ lệ phần trăm thả nổi, giúp đội ngũ khảo sát dễ dàng phân bổ nhân sự và lập kế hoạch phỏng vấn rõ ràng.
## Parameter Estimation (Cơ sở Ước lượng Tham số trong Suy luận Thống kê)
### 1. Bản chất & Định nghĩa cốt lõi (Slide 1–9 & Transcript P1–P9)
* **Phân loại nhiệm vụ:** **Suy luận Thống kê & Ước lượng Tham số (Statistical Inference / Parameter Estimation)**. (→ Models, Statistical Inference and Learning)
* **Bản chất kỹ thuật:** 
  * Quá trình sử dụng dữ liệu quan sát từ mẫu để suy diễn về các tham số chưa biết của tổng thể:
    $$\text{Population } (\mu, \sigma^2, \beta) \xrightarrow{\text{Sampling}} \text{Sample } (X) \xrightarrow{\text{Estimator } \hat{\theta}(X)} \text{Estimate } \hat{\theta} \pm \text{SE}(\hat{\theta})$$
  * Ba khái niệm then chốt trong ước lượng:
    1. *Estimand (Tham số cần ước lượng):* Đại lượng mục tiêu của tổng thể cần tìm hiểu (ví dụ: $\mu$, $\sigma^2$, $\beta$).
    2. *Estimator (Công thức/Quy tắc ước lượng):* Hàm số hoặc quy tắc toán học áp dụng lên mẫu (ví dụ: $\bar{X} = \frac{1}{n}\sum_{i=1}^n X_i$, $S^2 = \frac{1}{n-1}\sum_{i=1}^n (X_i - \bar{X})^2$).
    3. *Estimate (Giá trị ước lượng):* Giá trị số cụ thể thu được khi thay mẫu số liệu vào công thức.
  * Ba tiêu chuẩn chuẩn mực của một ước lượng tốt (Desirable Properties):
    * *Tính không chệch (Unbiasedness):* $\mathbb{E}[\hat{\theta}] = \theta$ (kỳ vọng của phân phối lấy mẫu bằng chính tham số thực).
    * *Tính nhất quán (Consistency):* $\text{plim}_{n \to \infty} \hat{\theta} = \theta$ hoặc $\lim_{n \to \infty} P(|\hat{\theta} - \theta| < \epsilon) = 1$ (khi cỡ mẫu tăng vô hạn, ước lượng hội tụ về giá trị thực).
    * *Tính hiệu quả (Efficiency):* $\text{Var}(\hat{\theta}) \le \text{Var}(\tilde{\theta})$ với mọi ước lượng không chệch $\tilde{\theta}$ (đạt phương sai tối thiểu).
* **Điểm khác biệt / Điểm đặc trưng:** 
  * Phân biệt rõ giữa *Ước lượng điểm (Point Estimate)* cung cấp một con số đơn lẻ nhưng không phản ánh mức độ bất định, với *Khoảng tin cậy (Confidence Interval)* cung cấp một dải giá trị kèm mức độ tin cậy $1 - \alpha$ nhằm kiểm soát sai số ước lượng do biến thiên mẫu ngẫu nhiên gây ra.
### 2. Phân tích các ví dụ minh họa (Slide 1–9 & Transcript P1–P9)
* **Ước lượng chiều cao sinh viên toàn quốc (Height Estimation - Slide 5, 6 & Transcript P5, P6):**
  * *Biểu diễn logic:* 
    $$\text{Estimand } (\mu) \xrightarrow{\text{Estimator } \bar{X} = \frac{1}{n}\sum X_i} \text{Estimate } (\hat{\mu} = 1.72\text{ m})$$
  * *Cơ chế thực tế:* Do không thể đo chiều cao của mọi sinh viên toàn quốc, nghiên cứu rút một mẫu ngẫu nhiên đại diện. Quy tắc trung bình mẫu $\bar{X}$ được áp dụng và cho ra kết quả cụ thể $1.72\text{ m}$. Bậc tự do $n - 1$ được áp dụng cho phương sai mẫu $S^2$ thay vì $n$ để đảm bảo tính không chệch cho ước lượng phương sai tổng thể $\sigma^2$.
* **Đo lường độ phân tán và kiểm định giả thuyết (Standard Error & T-statistic - Slide 8, 9 & Transcript P8, P9):**
  * *Biểu diễn logic:* 
    $$\text{SE}(\bar{X}) = \frac{\sigma}{\sqrt{n}}; \quad t = \frac{\hat{\beta}_j - 0}{\text{SE}(\hat{\beta}_j)} \quad \text{với } \text{Var}(\hat{\beta}_j) = \frac{\sigma_u^2}{\text{SST}_j (1 - R_j^2)}$$
  * *Cơ chế thực tế:* Độ sai lệch chuẩn của ước lượng (SE) tỷ lệ nghịch với căn bậc hai cỡ mẫu $\sqrt{n}$, nghĩa là mẫu càng lớn thì độ phân tán của ước lượng qua các lần lặp lại càng thu hẹp. Trong hồi quy, hiện tượng đa cộng tuyến ($R_j^2 \to 1$) sẽ thổi phồng phương sai của hệ số, làm SE phình to và triệt tiêu ý nghĩa thống kê của thống kê $t$.
* **Khoảng tin cậy cho giá trị trung bình (Confidence Intervals - Slide 9 & Transcript P9):**
  * *Biểu diễn logic:* 
    $$\text{CI}_{1-\alpha} = \left[ \bar{X} - t_{\alpha/2, \, n-1} \cdot \frac{s}{\sqrt{n}}, \; \bar{X} + t_{\alpha/2, \, n-1} \cdot \frac{s}{\sqrt{n}} \right]$$
  * *Cơ chế thực tế:* Mức tin cậy 95% có nghĩa là nếu tiến hành lấy vô hạn các mẫu độc lập cùng kích thước từ tổng thể và dựng các khoảng tin cậy tương ứng, thì 95% trong số các khoảng đó sẽ chứa giá trị tham số thực $\mu$.
### 3. Ý nghĩa thực tiễn & Ứng dụng ra quyết định (Slide 1–9 & Transcript P1–P9)
* **Theo góc nhìn Thiết kế điều tra & Tối ưu hóa kích thước mẫu (Sample Size Optimization):**
  * *Mục tiêu:* Đạt được độ chính xác mục tiêu với chi phí tối thiểu.
  * *Hành động can thiệp:* Dựa vào công thức $\text{SE} \propto \frac{1}{\sqrt{n}}$ để xác định cỡ mẫu tối thiểu cần khảo sát, đảm bảo sai số biên (Margin of Error) nằm trong giới hạn cho phép trước khi triển khai thực địa.
* **Theo góc nhìn Đánh giá tính vững của Mô hình hồi quy (Model Diagnostics & Multicollinearity):**
  * *Mục tiêu:* Ngăn ngừa rủi ro sai số chuẩn bị thổi phồng dẫn đến bác bỏ sai các hệ số có ý nghĩa thực tế (Sai lầm loại II).
  * *Hành động can thiệp:* Kiểm tra hệ số phóng đại phương sai (VIF) thông qua thành phần $(1 - R_j^2)$ trong công thức $\text{Var}(\hat{\beta}_j)$; loại bỏ hoặc kết hợp các biến độc lập tương quan cao để thu hẹp khoảng tin cậy của ước lượng.
* **Theo góc nhìn Ra quyết định dựa trên mức độ bất định (Decision-Making Under Uncertainty):**
  * *Mục tiêu:* Tránh việc đưa ra chính sách hoặc chiến lược kinh doanh dựa trên một ước lượng điểm duy nhất dễ bị nhiễu.
  * *Hành động can thiệp:* Luôn kết hợp công bố ước lượng điểm kèm theo khoảng tin cậy 95% và giá trị p (p-value), giúp người ra quyết định nhìn nhận được cả kịch bản bi quan nhất lẫn lạc quan nhất của tham số tổng thể.
# Hypothesis Testing
## Fundamental Principles of Hypothesis Testing (Các Nguyên Lý Cơ Bản của Kiểm Định Giả Thuyết)
### 1. Bản chất & Định nghĩa cốt lõi (Slide 2–11 & Transcript P1–P14)
* **Phân loại nhiệm vụ:** **Suy luận Thống kê & Ra quyết định có kiểm soát rủi ro (Statistical Inference & Hypothesis Testing Task)**. (→ Hypothesis Testing and p-values)
* **Bản chất kỹ thuật:** 
  * Xác định xem các kết quả quan sát được từ mẫu có phản ánh bản chất thực sự của tổng thể hay chỉ xuất hiện ngẫu nhiên do sai số lấy mẫu:
    $$H_0: \theta = \theta_0 \quad \text{vs.} \quad H_1: \theta \neq \theta_0 \quad (\text{hoặc } \theta > \theta_0, \; \theta < \theta_0)$$
  * Quy trình 3 bước cốt lõi:
    1. Thiết lập giả thuyết không ($H_0$ - đại diện cho trạng thái mặc định, không có tác động) và giả thuyết đối ($H_1$).
    2. Xác định phân phối mẫu của thống kê kiểm định dưới giả định $H_0$ đúng để tính xác suất xuất hiện kết quả mẫu:
       $$p\text{-value} = P(\text{Data or more extreme} \mid H_0 \text{ is true})$$
    3. Đối chiếu $p$-value với ngưỡng ý nghĩa $\alpha$ (thường là $0.05$ hoặc $0.01$):
       $$\text{Quyết định} = \begin{cases} \text{Bác bỏ } H_0 & \text{nếu } p\text{-value} < \alpha \\ \text{Chưa đủ cơ sở bác bỏ } H_0 & \text{nếu } p\text{-value} \ge \alpha \end{cases}$$
  * Ma trận rủi ro quyết định:
    * Sai lầm loại I (Type I Error / False Positive): Bác bỏ $H_0$ khi $H_0$ thực sự đúng, với xác suất $P(\text{Reject } H_0 \mid H_0 \text{ true}) = \alpha$.
    * Sai lầm loại II (Type II Error / False Negative): Không bác bỏ $H_0$ khi $H_0$ sai, với xác suất $P(\text{Fail to reject } H_0 \mid H_1 \text{ true}) = \beta$.
* **Điểm khác biệt / Điểm đặc trưng:** 
  * Vận hành theo nguyên lý biến cố hiếm (rare event principle) và phép chứng minh phản chứng xác suất. Kiểm định thống kê không chứng minh trực tiếp $H_1$ là đúng hoàn toàn, mà tập trung kiểm soát xác suất phạm sai lầm $\alpha$ khi bác bỏ $H_0$.
### 2. Phân tích các ví dụ minh họa (Slide 2, 3, 5, 6, 8 & Transcript P1, P2, P4, P5, P9)
* **Kiểm định điểm thi môn Toán học sinh lớp 8 (Math Score Estimation):**
  * *Biểu diễn logic:* 
    $$H_0: \mu = 60 \implies \bar{X} \sim \mathcal{N}\left(60, \; \frac{25}{100} = 0.25\right) \implies P(\bar{X} \ge 85 \mid H_0) \approx 0 < \alpha \implies \text{Bác bỏ } H_0$$
  * *Cơ chế thực tế:* Khảo sát $n = 100$ học sinh cho điểm trung bình mẫu $\bar{X} = 85$ và phương sai mẫu $s^2 = 25$. Nếu giả sử trung bình tổng thể thực sự là $\mu = 60$, phân phối của giá trị trung bình mẫu sẽ tập trung quanh 60 với độ lệch chuẩn nhỏ $\text{SE} = \frac{5}{\sqrt{100}} = 0.5$. Điểm số quan sát 85 nằm ở phần đuôi cực đoan (cách giá trị kỳ vọng tới hàng chục độ lệch chuẩn), là một sự kiện gần như không thể xảy ra nếu $H_0$ đúng. Do đó, giả thiết $\mu = 60$ bị bác bỏ hoàn toàn.
* **Nguyên lý nhận diện loài qua màu lông quạ (The Crow Parable):**
  * *Biểu diễn logic:* 
    $$H_0: \text{Con chim quan sát được là quạ} \implies P(\text{Lông màu trắng} \mid H_0) \approx 0$$
    $$\text{Quan sát: Con chim có màu trắng} \implies \text{Bác bỏ } H_0 \text{ (Kết luận: Không phải là quạ)}$$
  * *Cơ chế thực tế:* Quạ thông thường luôn có màu đen; quạ trắng là biến dị cực kỳ hiếm gặp trong tự nhiên. Khi nhìn thấy một con chim màu trắng, áp dụng nguyên lý biến cố hiếm ta đưa ra kết luận nó không phải là quạ. Nguy cơ đưa ra kết luận sai (Sai lầm loại I) bằng đúng xác suất tồn tại một cá thể quạ trắng trong tự nhiên ($\alpha$). Ngược lại, nếu thực tế đó là con cò nhưng ta lại chấp nhận giả thuyết đó là một con quạ trắng đột biến, ta đã phạm Sai lầm loại II ($\beta$).
### 3. Ý nghĩa thực tiễn & Ứng dụng ra quyết định (Slide 8, 9, 10, 11 & Transcript P8, P9, P11, P12, P13)
* **Theo góc nhìn Kiểm soát sai số & Đánh giá rủi ro (Risk-balanced Decision Making):**
  * *Mục tiêu:* Thiết lập ngưỡng ý nghĩa $\alpha$ phù hợp để cân bằng tổn thất giữa sai lầm dương tính giả và âm tính giả.
  * *Hành động can thiệp:* Trong các nghiên cứu lâm sàng hoặc các quyết định kỹ thuật rủi ro cao, chủ động hạ thấp ngưỡng $\alpha$ (ví dụ: $0.01$ hoặc $0.001$) để hạn chế tối đa việc đưa ra kết luận sai lệch, đồng thời tăng cỡ mẫu $n$ để tăng lực kiểm định ($1 - \beta$).
* **Theo góc nhìn Lựa chọn phân phối kiểm định (Distribution Selection Strategy):**
  * *Mục tiêu:* Áp dụng công cụ toán học tương thích với cấu trúc cỡ mẫu và thông tin tổng thể.
  * *Hành động can thiệp:* Lựa chọn phân phối Chuẩn ($Z$) khi phương sai tổng thể đã biết hoặc mẫu lớn; dùng phân phối Student ($t$) khi phương sai chưa biết và mẫu nhỏ; áp dụng Chi-square ($\chi^2$) khi kiểm định tính độc lập/độ phù hợp và phân phối Fisher ($F$) khi so sánh phương sai nhiều nhóm trong ANOVA.
* **Theo góc nhìn Ứng dụng thực nghiệm đa lĩnh vực (Empirical Applications Scope):**
  * *Mục tiêu:* Đảm bảo các kết quả phân tích dữ liệu mẫu không bắt nguồn từ sự trùng hợp ngẫu nhiên.
  * *Hành động can thiệp:* Triển khai kiểm định một biến (Univariate) để đánh giá tính đại diện của mẫu so với tổng thể; kiểm định so sánh phân nhóm (Group comparison) để phát hiện khác biệt tác động; và kiểm định các hệ số hồi quy ($\beta_j$) để xác nhận hiệu ứng nhân quả/mối quan hệ thực tế giữa các biến số kinh tế - xã hội.
## Kiểm định t (T-Test) và Các Ứng Dụng So Sánh Trung Bình trong Nghiên Cứu Giáo Dục
### 1. Bản chất & Định nghĩa cốt lõi (Slide 1–6, 17–19 & Transcript P1–P6, P18–P20)
* **Phân loại nhiệm vụ:** **Suy luận Thống kê Tham số / Kiểm định Giả thuyết So sánh Trung bình (Parametric Statistical Inference & Mean Comparison)**.
* **Bản chất kỹ thuật:** 
  * Xác định sự khác biệt có ý nghĩa thống kê về giá trị trung bình giữa mẫu với tổng thể hoặc giữa hai nhóm quan sát khi độ lệch chuẩn tổng thể ($\sigma$) chưa biết:
    * *Kiểm định 1 mẫu (One-Sample):*
      $$t = \frac{\bar{X} - \mu_0}{s / \sqrt{n}} \sim t(df = n - 1)$$
    * *Kiểm định 2 mẫu độc lập đồng nhất phương sai (Independent Two-Sample with pooled variance):*
      $$t = \frac{\bar{X}_1 - \bar{X}_2}{s_p \sqrt{\frac{1}{n_1} + \frac{1}{n_2}}} \sim t(df = n_1 + n_2 - 2), \quad s_p^2 = \frac{(n_1 - 1)s_1^2 + (n_2 - 1)s_2^2}{n_1 + n_2 - 2}$$
  * *Bậc tự do (Degrees of Freedom - $df$):* Đại diện cho số lượng mẩu thông tin độc lập có thể tự do biến thiên ($df = \text{observations} - \text{parameters}$). Khi $df$ nhỏ, đường cong phân phối $t$ có đuôi dày (heavy-tailed) phản ánh sự bất định lớn từ việc ước lượng $\sigma$ bằng $s$; khi $df \to \infty$, phân phối $t$ hội tụ về phân phối chuẩn tắc $\mathcal{N}(0, 1)$.
  * *Điều kiện nghiệm thức an toàn (Safety Checks / Prerequisites):*
    1. Biến phụ thuộc phải là biến định lượng liên tục (thang đo khoảng interval hoặc tỷ lệ ratio).
    2. Phân phối xấp xỉ chuẩn (kiểm tra bằng đồ thị `qnorm`, mẫu lớn tự động thỏa mãn theo CLT).
    3. Mẫu được chọn ngẫu nhiên và phân bổ ngẫu nhiên độc lập giữa các nhóm.
    4. Phương sai giữa các nhóm phải đồng nhất (kiểm tra bằng kiểm định Levene / lệnh Stata `sdtest`); nếu vi phạm phải dùng hiệu chỉnh Welch.
* **Điểm khác biệt / Điểm đặc trưng:** 
  * Cung cấp giải pháp suy luận chính xác trên mẫu nhỏ mà không cần biết trước phương sai tổng thể; quy mô mẫu $n$ càng lớn thì giá trị thống kê $t$ càng nhạy, làm tăng độ tin cậy và giảm $p$-value.
### 2. Phân tích các ví dụ minh họa (Slide 7–16, 20–27 & Transcript P8–P16, P21–P27)
* **Kiểm định đại diện mẫu điểm thi Toán lớp 12 (One-sample Test - Slide 8–11 & P8–P11):**
  * *Biểu diễn logic:* 
    $$H_0: \mu = 85 \quad \text{vs.} \quad H_1: \mu > 85 \quad (n = 12, \bar{X} = 88.75, s \approx 2.42)$$
    $$t = \frac{88.75 - 85}{2.4168 / \sqrt{12}} = 5.3750 \gg t_{0.05}(df = 11) \approx 1.796 \implies \text{Bác bỏ } H_0$$
  * *Cơ chế thực tế:* Để kiểm tra khẳng định trường đạt thành tích cao hơn điểm chuẩn thành phố ($\mu_0 = 85$), mẫu 12 học sinh cho giá trị $t = 5.375$ vượt xa giá trị tới hạn một phía, chứng minh mức điểm vượt trội không phải do ngẫu nhiên.
* **Kiểm tra tính đại diện của mẫu khảo sát GPA (Stata One-sample Test - Slide 12–15 & P12–P16):**
  * *Biểu diễn logic:* 
    $$H_0: \mu_{\text{sample}} = 2.97 \quad \text{với } n = 1718, \bar{X} = 3.037, s = 0.602, \text{SE} = 0.0145 \implies t = 4.6166, \; p < 0.001$$
  * *Cơ chế thực tế:* Nhóm nghiên cứu nghi ngờ dữ liệu khảo sát bị lệch do sinh viên điểm cao tích cực trả lời hơn. Lệnh `ttest GPA == 2.97` bác bỏ $H_0$, xác nhận mẫu bị sai lệch lựa chọn (selection bias) so với tổng thể toàn trường (GPA = 2.97).
* **So sánh giới tính về kết quả học tập tự đánh giá SSLO (Stata Two-sample Test - Slide 20–22 & P20–P22):**
  * *Biểu diễn logic:* 
    $$\text{Kiểm định phương sai: } \text{sdtest SSLO, by(gender)} \implies p > 0.05 \implies \sigma_{\text{male}}^2 = \sigma_{\text{female}}^2$$
    $$\text{Kiểm định trung bình: } \bar{X}_{\text{female}} - \bar{X}_{\text{male}} = -1.9686, \; t = -3.2437, \; df = 3721 \implies p = 0.0012 < 0.05$$
  * *Cơ chế thực tế:* Sau khi xác nhận tính chuẩn (`qnorm`) và phương sai đồng nhất (`sdtest`), mô hình t-test chỉ ra nam sinh viên có điểm tự đánh giá SSLO cao hơn có ý nghĩa thống kê so với nữ sinh viên.
* **So sánh hiệu quả phương pháp dạy học phòng thí nghiệm Vật lý (Two-sample Test - Slide 25–26 & P25–P27):**
  * *Biểu diễn logic:* 
    $$n_A = n_B = 20, \; \bar{X}_A = 82, s_A = 6, \; \bar{X}_B = 76, s_B = 5 \implies \Delta\bar{X} = 6, \; t = 3.4356, \; df = 38 \implies p = 0.0014 < 0.05$$
  * *Cơ chế thực tế:* Thử nghiệm phân bổ ngẫu nhiên 40 học sinh vào nhóm học theo dự án (PBL) và nhóm thuyết giảng truyền thống. Điểm số của nhóm PBL vượt trội rõ rệt, chứng minh hiệu quả can thiệp sư phạm.
### 3. Ý nghĩa thực tiễn & Ứng dụng ra quyết định (Slide 16, 23–24 & Transcript P16, P23–P24)
* **Theo góc nhìn Đánh giá tính hợp lệ dữ liệu (Data Representativeness Verification):**
  * *Mục tiêu:* Ngăn chặn sai lệch suy luận do mẫu khảo sát tự nguyện không đại diện cho tổng thể đối tượng.
  * *Hành động can thiệp:* Chạy kiểm định one-sample t-test giữa các chỉ số nhân khẩu học/kết quả học tập cơ bản của mẫu khảo sát với số liệu hành chính tổng thể trước khi đưa vào các mô hình hồi quy chuyên sâu.
* **Theo góc nhìn Đánh giá can thiệp sư phạm & Thử nghiệm chính sách (A/B Testing & Policy Evaluation):**
  * *Mục tiêu:* Định lượng tác động thực tế của phương pháp giảng dạy hoặc chính sách hỗ trợ mới.
  * *Hành động can thiệp:* Triển khai nghiên cứu can thiệp ngẫu nhiên có đối chứng (RCT), kiểm tra phương sai bằng `sdtest` và so sánh trung bình bằng `ttest` để ra quyết định nhân rộng chương trình học tập (như PBL).
* **Theo góc nhìn Phân biệt Ý nghĩa Thống kê và Ý nghĩa Thực tiễn (Statistical Significance vs. Practical Significance):**
  * *Mục tiêu:* Tránh ngộ nhận giá trị $p$ nhỏ là tác động lớn trong các bộ dữ liệu khảo sát quy mô quốc gia.
  * *Hành động can thiệp:* Như nghiên cứu sinh viên thế hệ đầu tiên (Slide 23–24), dù kiểm định cho $p < 0.001$, quy mô ảnh hưởng (effect size) chỉ đạt $-0.03$ (nhỏ hơn ngưỡng $0.2$). Nhà hoạch định chính sách cần kết hợp cả $p$-value lẫn thước đo quy mô tác động (Cohen's $d$) để tránh phân bổ nguồn lực lãng phí vào các khác biệt không đáng kể trong thực tế.

## Phân tích Phương sai (ANOVA - Analysis of Variance) và So sánh Đa nhóm
### 1. Bản chất & Định nghĩa cốt lõi (Slide 1, 2, 5–11 & Transcript P1, P2, P5–P11)
* **Phân loại nhiệm vụ:** **Suy luận Thống kê Tham số / Kiểm định Giả thuyết So sánh Trung bình Đa nhóm (Parametric Hypothesis Testing & Multi-Group Mean Comparison)**.
* **Bản chất kỹ thuật:** 
  * Kiểm định xem giá trị trung bình của từ ba nhóm (hoặc mẫu độc lập) trở lên có khác biệt đáng kể hay không:
    $$H_0: \mu_1 = \mu_2 = \dots = \mu_k \quad \text{vs.} \quad H_1: \exists \, i, j \text{ sao cho } \mu_i \neq \mu_j$$
  * Nguyên lý phân rã tổng phương sai (Partitioning of Total Sum of Squares):
    $$\text{SST} = \text{SSB} + \text{SSW}$$
    * *SST (Total Sum of Squares):* Tổng độ biến thiên của toàn bộ quan sát so với trung bình chung.
    * *SSB (Between-Group Sum of Squares):* Biến thiên giữa các nhóm (do tác động của biến phân loại độc lập).
    * *SSW (Within-Group Sum of Squares):* Biến thiên nội bộ nhóm (do sai số ngẫu nhiên hoặc khác biệt cá nhân).
  * Thống kê kiểm định tỷ số Fisher ($F$-ratio):
    $$F = \frac{\text{MSB}}{\text{MSW}} = \frac{\text{SSB} / (k - 1)}{\text{SSW} / (N - k)} \sim F(k - 1, \, N - k)$$
    * Nếu $F$ càng lớn (tức $\text{MSB} \gg \text{MSW}$), khả năng có sự khác biệt giữa ít nhất hai giá trị trung bình càng cao, dẫn đến bác bỏ $H_0$.
  * Phân loại cấu trúc:
    * *One-way ANOVA:* 1 biến độc lập định danh ($k \ge 3$) và 1 biến phụ thuộc liên tục.
    * *Two-way ANOVA:* 2 biến độc lập định danh và 1 biến phụ thuộc liên tục.
    * *MANOVA:* 1 biến độc lập định danh và từ 2 biến phụ thuộc liên tục trở lên.
  * Điều kiện nghiệm thức (Safety Checks): Biến phụ thuộc liên tục; mẫu ngẫu nhiên độc lập; phân phối xấp xỉ chuẩn; phương sai các nhóm đồng nhất (kiểm định bằng Bartlett's test).
* **Điểm khác biệt / Điểm đặc trưng:** 
  * Giải quyết triệt để vấn đề tích lũy sai lầm loại I (Family-wise Error Rate Inflation) khi phải thực hiện nhiều phép kiểm định $t$ độc lập cặp đôi rời rạc ($\alpha_{\text{total}} = 1 - (1 - \alpha)^c \gg 0.05$). Tuy nhiên, ANOVA chỉ đưa ra kết luận mang tính bao hàm (omnibus test) rằng "có sự khác biệt", không chỉ ra cụ thể cặp nhóm nào khác biệt.
### 2. Phân tích các ví dụ minh họa (Slide 4, 12, 16 & Transcript P4, P12, P16)
* **Khảo sát kết quả học tập tự đánh giá SSLO theo trường đại học (Slide 4, 11, 12 & P4, P11, P12):**
  * *Biểu diễn logic:* 
    $$\text{Dataset: practice\_new\_vars.dta} \implies (\text{University\_Type} \in \{U_1, U_2, \dots, U_k\}) \xrightarrow{\text{oneway SSLO univ}} F \text{-test} \rightarrow p < 0.05$$
    $$\text{Post-hoc Bonferroni/Scheffe} \implies \mu_{\text{Univ}_A} - \mu_{\text{Univ}_B} \neq 0$$
  * *Cơ chế thực tế:* Để trả lời câu hỏi điểm SSLO có khác nhau giữa các trường đại học hay không, ANOVA phân rã toàn bộ biến thiên điểm số thành độ lệch giữa các trường (Between-group) và độ lệch giữa các sinh viên trong cùng một trường (Within-group). Khi kiểm định $F$ cho kết quả có ý nghĩa thống kê, các bài kiểm tra hậu nghiệm (post-hoc) như Tukey HSD, Scheffe, Bonferroni được áp dụng để xác định rõ cặp trường cụ thể có sự chênh lệch.
* **Cây quyết định lựa chọn kiểm định so sánh nhóm (Slide 14–16 & P14–P16):**
  * *Biểu diễn logic:* 
$$\begin{cases}        \ge 3 \text{ nhóm} \land \text{Độc lập} \land \text{Tham số (Chuẩn)} &\rightarrow \text{One-way ANOVA } (F\text{-test}) \\       \ge 3 \text{ nhóm} \land \text{Độc lập} \land \text{Phi tham số (Không chuẩn / Thứ bậc)} &\rightarrow \text{Kruskal-Wallis test} \\       \ge 3 \text{ nhóm} \land \text{Phụ thuộc (Đo lặp lại)} \land \text{Phi tham số} &\rightarrow \text{Friedman test}     \end{cases}$$
  * *Cơ chế thực tế:* Phân cấp lựa chọn phương pháp kiểm định dựa trên bản chất thang đo của biến số (định danh, thứ bậc, khoảng/tỷ lệ), hình dạng phân phối (chuẩn hay phi chuẩn), và mối quan hệ quan sát (độc lập hay mẫu bắt cặp/lặp lại).
### 3. Ý nghĩa thực tiễn & Ứng dụng ra quyết định (Slide 10, 12, 14, 16 & Transcript P10, P12, P14, P16)
* **Theo góc nhìn Xử lý hiện tượng thổi phồng sai số khi so sánh cặp (Post-hoc Comparisons Strategy):**
  * *Mục tiêu:* Ngăn chặn sai lầm dương tính giả khi chạy đồng thời nhiều phép so sánh độc lập giữa các nhóm.
  * *Hành động can thiệp:* Khi ANOVA cho thấy có ý nghĩa thống kê, áp dụng hiệu chỉnh Bonferroni ($\alpha_{\text{adjusted}} = \frac{\alpha}{m}$) hoặc Scheffe/Tukey HSD để tìm đúng các cặp nhóm thực sự có sự khác biệt mà vẫn bảo toàn độ chặt chẽ thống kê.
* **Theo góc nhìn Thiết kế kiểm định và Chuẩn hóa câu lệnh trong Stata:**
  * *Mục tiêu:* Đảm bảo tính toán chính xác và kiểm soát tự động các giả định phương sai.
  * *Hành động can thiệp:* Áp dụng đúng cú pháp `oneway dependent_variable independent_variable, tabulate bonferroni` để vừa thực hiện bảng ANOVA, thống kê mô tả trung bình từng nhóm, vừa xuất kết quả ma trận so sánh cặp có hiệu chỉnh.
* **Theo góc nhìn Đánh giá tính phù hợp giữa kiểm định tham số và phi tham số:**
  * *Mục tiêu:* Tối ưu hóa lực kiểm định thống kê (Statistical Power) trong phân tích dữ liệu thực nghiệm giáo dục và khoa học xã hội.
  * *Hành động can thiệp:* Ưu tiên sử dụng ANOVA tham số khi cỡ mẫu đủ lớn hoặc thỏa mãn tính chuẩn để tối đa hóa khả năng phát hiện tác động thực sự; chuyển hướng sang Kruskal-Wallis hoặc Welch's ANOVA khi dữ liệu vi phạm nghiêm trọng tính đồng nhất phương sai hoặc giả định phân phối chuẩn.

## Kiểm định Chi-bình phương (Chi-Square Test) và So sánh Phân phối Tần số
### 1. Bản chất & Định nghĩa cốt lõi (Slide 1–3 & Transcript P1–P3)
* **Phân loại nhiệm vụ:** **Suy luận Thống kê Phi tham số / Kiểm định Phân phối Tần số Biến Phân loại (Non-parametric Frequency Distribution & Independence Testing)**.
* **Bản chất kỹ thuật:** 
  * Đánh giá mức độ sai lệch giữa tần số quan sát thực tế ($O$ - Observed frequency) và tần số kỳ vọng theo lý thuyết ($E$ - Expected frequency) trên các ô của bảng chéo (contingency table):
    $$\chi^2 = \sum \frac{(O - E)^2}{E} \sim \chi^2(df)$$
    * Trong đó bậc tự do: $df = (r - 1)(c - 1)$ đối với bảng 2 chiều gồm $r$ hàng và $c$ cột; hoặc $df = k - 1$ đối với kiểm định độ phù hợp 1 biến gồm $k$ nhóm.
    * Tần số kỳ vọng từng ô: $E_{ij} = \frac{R_i \times C_j}{N}$ (với $R_i, C_j$ lần lượt là tổng hàng và tổng cột tương ứng).
  * Ba trường hợp sử dụng chuẩn tắc:
    1. *Kiểm định độ phù hợp / Tính đại diện của mẫu (Goodness-of-Fit / Sample Representativeness):* So sánh phân phối quan sát trong mẫu với phân phối đã biết của tổng thể.
    2. *Kiểm định tính đồng nhất (Test of Homogeneity):* Kiểm tra xem các phân nhóm độc lập có cùng phân phối trên một biến định danh hay không.
    3. *Kiểm định tính độc lập (Test of Independence):* Xác định xem hai biến phân loại có liên kết hoặc phụ thuộc lẫn nhau hay không ($H_0: \text{Độc lập} \text{ vs. } H_1: \text{Có mối liên hệ}$).
* **Điểm khác biệt / Điểm đặc trưng:** 
  * Áp dụng độc quyền cho dữ liệu đếm tần số của các **biến phân loại** (categorical / nominal variables), hoàn toàn không tính toán trung bình hay độ lệch chuẩn như $t$-test hoặc ANOVA (vốn áp dụng cho biến liên tục).
### 2. Phân tích các ví dụ minh họa (Slide 4, 5 & Transcript P4, P5)
* **Kiểm tra tính đại diện của mẫu trong Excel (Checking Sample Similarity - Slide 4 & Transcript P4):**
  * *Biểu diễn logic:* 
    $$df = 15, \quad \chi^2 = 12.44276 \implies \chi^2_{\text{critical}}(\alpha = 0.05, df = 15) = 24.99579, \quad p = 0.645253 > 0.05$$
    $$\text{Do } \chi^2 < \chi^2_{\text{critical}} \land p > 0.05 \implies \text{Chưa có bằng chứng bác bỏ } H_0$$
  * *Cơ chế thực tế:* Để xác minh tập mẫu có phản ánh đúng cơ cấu tổng thể hay không, hàm `CHISQ.TEST(observed, expected)` và `CHIINV(alpha, df)` được dùng để so sánh tần số quan sát với kỳ vọng. Giá trị $p = 0.645$ lớn hơn nhiều so với $0.05$ khẳng định mẫu có tính đại diện cao, không bị sai lệch chọn mẫu.
* **So sánh phân phối giới tính qua các khối lớp trong Stata (Slide 5 & Transcript P5):**
  * *Biểu diễn logic:* 
    $$\text{Grade\_Level} \in \{\text{Freshman}, \text{Sophomore}, \text{Junior}\} \times \text{Gender} \in \{\text{Male}, \text{Female}\} \xrightarrow{\text{tab grade gender, chi2}} \chi^2 \text{-test}$$
  * *Cơ chế thực tế:* Kiểm định tính đồng nhất nhằm kiểm tra tỷ lệ nam/nữ có duy trì ổn định qua các năm học hay có sự phân hóa theo niên khóa. Lệnh `tabulate` kèm tùy chọn `chi2` trong Stata tính toán bảng chéo và trả về trực tiếp giá trị thống kê Pearson $\chi^2$ cùng mức ý nghĩa $p$-value.
### 3. Ý nghĩa thực tiễn & Ứng dụng ra quyết định (Slide 3–6 & Transcript P3–P6)
* **Theo góc nhìn Kiểm soát chất lượng dữ liệu & Đại diện mẫu (Data Quality Control):**
  * *Mục tiêu:* Đảm bảo dữ liệu điều tra không bị méo mó trước khi đưa vào các mô hình phân tích nhân quả phức tạp hơn.
  * *Hành động can thiệp:* Chạy kiểm định Goodness-of-Fit giữa các thuộc tính nhân khẩu học (giới tính, ngành học, vùng miền) của mẫu so với tổng thể; nếu $\chi^2$ có ý nghĩa thống kê ($p < 0.05$), cần thực hiện kỹ thuật cân bằng trọng số (sample weighting) để hiệu chỉnh sai số mẫu.
* **Theo góc nhìn Phân tích Hành vi & Mối liên kết thuộc tính (Attribute Association):**
  * *Mục tiêu:* Xác minh các giả thuyết liên kết giữa các đặc tính phân loại (ví dụ: Giới tính $\rightarrow$ Ý định học cao học; Ngành học $\rightarrow$ Xu hướng chính trị).
  * *Hành động can thiệp:* Áp dụng kiểm định tính độc lập làm bước sàng lọc sơ bộ trước khi đưa các biến giả (dummy variables) vào mô hình hồi quy Logistic.
* **Theo góc nhìn Phân bổ công cụ thống kê (Decision Tree for Statistical Tests):**
  * *Mục tiêu:* Lựa chọn chính xác giữa $t$-test, ANOVA và Chi-Square dựa trên loại dữ liệu nghiên cứu.
  * *Hành động can thiệp:* Sử dụng Chi-Square khi cả biến độc lập lẫn biến phụ thuộc đều ở thang đo danh xưng/phân loại; chuyển sang $t$-test (2 nhóm) hoặc ANOVA ($\ge 3$ nhóm) ngay khi biến kết quả chuyển sang thang đo định lượng liên tục (điểm số, thu nhập, thời gian).
# Linear Regression Analysis 
## Xây Dựng Mô Hình Hồi Quy Tuyến Tính (Building Linear Regression Models)
### 1. Bản chất & Định nghĩa cốt lõi (Slide 1–7 & Transcript P1–P7)
* **Phân loại nhiệm vụ:** **Hồi quy & Dự báo có giám sát (Predictive & Causal Modeling / Supervised Learning)**. (→ Linear and Logistic Regression)
* **Bản chất kỹ thuật:** 
  * Xác định quy luật biến thiên của biến phụ thuộc (biến được giải thích) $Y$ theo sự thay đổi của tập hợp các biến độc lập (biến giải thích) $X_1, X_2, \dots, X_k$:
    $$Y_i = \beta_0 + \sum_{j=1}^k \beta_j X_{ij} + u_i$$
  * *Hàm tuyến tính theo lý thuyết:* Biểu diễn kỳ vọng có điều kiện (Conditional Expectation Function - CEF):
    $$\mathbb{E}[Y_i \mid X_i = x] = \int t f_Y(t \mid X_i = x) \, dt = \beta_0 + \beta_1 x_1 + \dots + \beta_k x_k$$
    Đại diện cho giá trị trung bình kỳ vọng của $Y$ tại một mức giá trị xác định của $X$.
  * *Số hạng sai số ngẫu nhiên ($u_i$ hoặc $\mu_i$):* Thể hiện những yếu tố nhiễu hoặc biến động ngẫu nhiên ngoài mô hình mà lý thuyết chưa giải thích được, tuân theo giả định phân phối cơ bản:
    $$u_i \sim \mathcal{N}(0, \sigma^2)$$
* **Điểm khác biệt / Điểm đặc trưng:** 
  * Khác biệt căn bản với phân tích tương quan thuần túy (chỉ đo lường mức độ đồng biến thiên), hồi quy tuyến tính phân định rõ vai trò nhân - quả: phân tích mức độ mà sự biến thiên (variation) của $X$ có thể giải thích cho sự biến thiên của $Y$ thông qua hàm hồi quy mẫu.
### 2. Phân tích các ví dụ minh họa (Slide 2, 4, 6, 7 & Transcript P2, P4, P6, P7)
* **Bài toán Dự báo giá trị Y khi biết trước X (Predictive Regression - Slide 2 & Transcript P2):**
  * *Biểu diễn logic:* 
    $$X = 2 \xrightarrow{\hat{Y} = \hat{\beta}_0 + \hat{\beta}_1 (2)} \hat{Y}$$
  * *Cơ chế thực tế:* Khi xác lập được đường hồi quy mẫu tối ưu từ các điểm quan sát thực nghiệm, với mỗi giá trị đầu vào $X = 2$, mô hình đưa ra giá trị kỳ vọng nội suy $\hat{Y}$ phản ánh trung bình phân phối của $Y$ tại lát cắt $X = 2$.
* **Đặc tính của Hàm Kỳ vọng Có Điều kiện CEF (Slide 6, 7 & Transcript P6, P7):**
  * *Biểu diễn logic:* 
    $$X_i \sim \mathcal{D}_X \implies \mathbb{E}[Y_i \mid X_i] \text{ là một biến ngẫu nhiên}; \quad \mathbb{E}[Y] = \mathbb{E}_X\big[\mathbb{E}[Y \mid X]\big]$$
  * *Cơ chế thực tế:* Do vector biến giải thích $X_i$ là biến ngẫu nhiên, hàm CEF $\mathbb{E}[Y \mid X]$ cũng là một đại lượng ngẫu nhiên. Đường cong hoặc đường thẳng nối qua tâm phân phối điều kiện của $Y$ tại từng lát cắt cố định của $X$ chính là đường biểu diễn chuẩn xác nhất của hàm hồi quy tổng thể.
### 3. Ý nghĩa thực tiễn & Ứng dụng ra quyết định (Slide 3, 4, 5 & Transcript P3, P4, P5)
* **Theo góc nhìn Đo lường tác động biên (Marginal Effect Analysis):**
  * *Mục tiêu:* Định lượng mức độ thay đổi của biến kết quả khi tác động thay đổi một đơn vị của biến chính sách hoặc biến can thiệp.
  * *Hành động can thiệp:* Đánh giá độ lớn và dấu của hệ số góc $\beta_j = \frac{\partial \mathbb{E}[Y \mid X]}{\partial X_j}$ để tối ưu hóa quyết định đầu tư, phân bổ ngân sách tiếp thị hoặc dự tính hiệu quả can thiệp giáo dục.
* **Theo góc nhìn Kiểm soát chất lượng dự báo và Độ tin cậy (Model Goodness-of-Fit):**
  * *Mục tiêu:* Phân rã độ biến thiên tổng cộng thành phần giải thích được bởi mô hình và phần ngẫu nhiên không thể giải thích.
  * *Hành động can thiệp:* Tối thiểu hóa phương sai sai số $\sigma^2$ thông qua việc bổ sung các biến kiểm soát phù hợp định nghĩa bởi lý thuyết, ngăn ngừa hiện tượng bỏ sót biến giải thích quan trọng.
* **Theo góc nhìn Nhận diện giả định kinh tế lượng (Econometric Identification):**
  * *Mục tiêu:* Bảo đảm tính không chệch và hiệu quả của các ước lượng tham số hồi quy.
  * *Hành động can thiệp:* Kiểm tra nghiêm ngặt giả định kỳ vọng sai số bằng 0 ($\mathbb{E}[u \mid X] = 0$) để tránh hiện tượng nội sinh (endogeneity), bảo đảm hệ số ước lượng phản ánh đúng quan hệ nhân quả thực sự thay vì chỉ là sự liên kết tương quan ngẫu nhiên.
## Phương Pháp Bình Phương Tối Thiểu Thông Thường (Ordinary Least Squares - OLS)
### 1. Bản chất & Định nghĩa cốt lõi (Slide 1–11 & Transcript P1–P11)
* **Phân loại nhiệm vụ:** **Ước lượng tham số hồi quy có giám sát (Supervised Parameter Estimation / Predictive Modeling)**.
* **Bản chất kỹ thuật:** 
  * Phương pháp toán học tìm kiếm đường khớp tối ưu (best-fitting line) cho mô hình hồi quy tuyến tính bội:
    $$y_i = \beta_0 + \beta_1 x_{i1} + \dots + \beta_k x_{ik} + u_i$$
  * *Tiêu chuẩn tối ưu hóa:* Cực tiểu hóa tổng bình phương phần dư (Residual Sum of Squares - SSE):
    $$\min_{\hat{\beta}} \text{SSE} = \min_{\hat{\beta}} \sum_{i=1}^n e_i^2 = \min_{\hat{\beta}} \sum_{i=1}^n \left(y_i - \hat{y}_i\right)^2 = \min_{\hat{\beta}} \sum_{i=1}^n \left(y_i - \hat{\beta}_0 - \sum_{j=1}^k \hat{\beta}_j x_{ij}\right)^2$$
  * *Phân rã tổng biến thiên toàn phần (Total Variation Decomposition):*
    $$\text{SST} = \text{SSR} + \text{SSE} \iff \sum (y_i - \bar{y})^2 = \sum (\hat{y}_i - \bar{y})^2 + \sum (y_i - \hat{y}_i)^2$$
    Trong đó $\text{SST}$ là tổng biến thiên của $Y$, $\text{SSR}$ là phần biến thiên giải thích bởi mô hình, và $\text{SSE}$ là biến thiên sai số ngẫu nhiên không thể giải thích.
* **Điểm khác biệt / Điểm đặc trưng:** 
  * OLS đóng vai trò là phương pháp ước lượng chuẩn mực và phổ biến nhất, đảm bảo tính chất BLUE (Best Linear Unbiased Estimator) theo định lý Gauss-Markov khi các giả định hồi quy được thỏa mãn.
### 2. Phân tích các ví dụ minh họa (Slide 7, 8, 9, 10 & Transcript P7, P8, P9, P10)
* **Ước lượng tương quan Chiều cao - Cân nặng (SLR Example - Slide 7 & Transcript P7):**
  * *Biểu diễn logic:* 
    $$\text{Weight} = -144.32 + 1.20 \times \text{Height} \implies \beta_1 = \frac{\Delta \text{Weight}}{\Delta \text{Height}} = 1.20$$
  * *Cơ chế thực tế:* Hệ số chặn $\beta_0 = -144.32$ là giá trị lý thuyết của cân nặng khi chiều cao bằng 0. Hệ số góc $\beta_1 = 1.20$ cho biết trung bình cứ mỗi đơn vị chiều cao tăng thêm, cân nặng tăng tương ứng 1.20 đơn vị.
* **Biểu diễn hệ số qua biểu đồ Venn (Venn Diagram Interpretation - Slide 8 & Transcript P8):**
  * *Biểu diễn logic:* 
    $$\beta_1 = \frac{\text{Cov}(X, Y)}{\text{Var}(X)} = \frac{\text{Overlap}(X, Y)}{\text{Variation}(X)}$$
  * *Cơ chế thực tế:* Diện tích phần giao thoa giữa tập hợp $X$ và $Y$ biểu thị mức độ đồng biến thiên $\text{Cov}(X, Y) \times n$ (phần biến thiên của $Y$ được giải thích bởi $X$, tức $\text{SSR}$). Hệ số góc phản ánh tỷ lệ giữa phần chồng chéo này trên tổng biến thiên độc lập của $X$.
* **Đo lường độ phù hợp mô hình qua $R^2$ (Goodness-of-Fit - Slide 10 & Transcript P10):**
  * *Biểu diễn logic:* 
    $$R^2 = \frac{\text{SSR}}{\text{SST}} = 1 - \frac{\text{SSE}}{\text{SST}} \in [0, 1]$$
  * *Cơ chế thực tế:* Tỷ lệ phần trăm tổng biến thiên của biến phụ thuộc $Y$ được giải thích bởi đường hồi quy OLS. Khi $R^2 \rightarrow 1$, các điểm dữ liệu nằm rất sát đường hồi quy, biểu thị mức độ khớp mô hình vượt trội.
### 3. Ý nghĩa thực tiễn & Ứng dụng ra quyết định (Slide 6, 7, 9, 10 & Transcript P6, P7, P9, P10)
* **Theo góc nhìn Diễn giải tác động riêng phần (Partial Effect Analysis):**
  * *Mục tiêu:* Đánh giá tác động thuần túy của một yếu tố cụ thể khi cố định tất cả các yếu tố khác (*ceteris paribus*).
  * *Hành động can thiệp:* Trong mô hình hồi quy bội, sử dụng hệ số riêng phần $b_k$ để xác định chính xác mức độ thay đổi của $Y$ khi $x_k$ tăng 1 đơn vị, hỗ trợ cô lập tác động của các chiến dịch can thiệp riêng rẽ.
* **Theo góc nhìn Tối ưu hóa dự báo & Giảm thiểu sai số:**
  * *Mục tiêu:* Nâng cao độ chính xác dự báo trong vận hành thực tế.
  * *Hành động can thiệp:* Giám sát tỷ trọng $\text{SSE} / \text{SST}$; chủ động bổ sung các biến kiểm soát có ý nghĩa để tăng $\text{SSR}$, đưa $R^2$ lên mức kỳ vọng mà không làm phức tạp hóa mô hình quá mức.
* **Theo góc nhìn Kiểm soát nội sinh & Độ chệch tham số:**
  * *Mục tiêu:* Bảo đảm các hệ số OLS phản ánh quan hệ nhân quả thực sự thay vì tương quan sai lệch.
  * *Hành động can thiệp:* Phân tích phần sai số $u$ để tránh vi phạm giả định $\text{Cov}(X, u) = 0$, ngăn chặn hiện tượng sai số và biến độc lập chồng chéo gây biến dạng ước lượng OLS.

## Diễn giải và Đánh giá Ước lượng Mô hình Hồi quy Tuyến tính (Interpreting Linear Regression Model Estimates)
### 1. Bản chất & Định nghĩa cốt lõi (Slide 1–8 & Transcript P1–P8)
* **Phân loại nhiệm vụ:** **Suy luận Thống kê & Đánh giá Mô hình Dự báo (Statistical Inference & Model Evaluation / Predictive Analytics)**.
* **Bản chất kỹ thuật:** 
  * Thiết lập hệ thống kiểm định và chỉ số thống kê chuẩn mực để xác thực xem ước lượng hệ số thu được từ OLS có phản ánh đúng mối quan hệ thực tế trong tổng thể hay không:
    1. *Định lý Gauss-Markov & Tính chất BLUE (Best Linear Unbiased Estimator):* Trong điều kiện sai số có kỳ vọng bằng 0, không tương quan và đồng phương sai ($\text{Var}(u|X) = \sigma^2$), ước lượng OLS đạt tính chất BLUE:
       $$\mathbb{E}(\hat{\beta}) = \beta \quad \text{và} \quad \text{Var}(\hat{\beta}) \le \text{Var}(\tilde{\beta}) \quad (\forall \text{ ước lượng tuyến tính không chệch } \tilde{\beta})$$
    2. *Kiểm định độ phù hợp tổng thể (Overall Model F-Test):* Đánh giá xem toàn bộ tập hợp biến giải thích có đồng thời đóng góp năng lực giải thích cho biến kết quả $y$ hay không:
       $$H_0: \beta_1 = \beta_2 = \dots = \beta_k = 0 \quad \text{vs.} \quad H_1: \exists \beta_j \neq 0$$
       $$F = \frac{\text{SSR} / k}{\text{SSE} / (n - k - 1)} = \frac{R^2 / k}{(1 - R^2) / (n - k - 1)} \sim F(k, n - k - 1)$$
    3. *Kiểm định ý nghĩa từng hệ số (Individual Coefficient t-Test):* Đánh giá tác động riêng phần của từng biến độc lập $x_j$ lên $y$:
       $$H_0: \beta_j = 0 \quad \text{vs.} \quad H_1: \beta_j \neq 0, \quad t = \frac{\hat{\beta}_j - 0}{\text{SE}(\hat{\beta}_j)} \sim t(n - k - 1)$$
* **Điểm khác biệt / Điểm đặc trưng:** 
  * Phân biệt rạch ròi giữa việc "mô hình tổng thể có ý nghĩa" (đo lường bằng kiểm định $F$) với việc "từng biến riêng lẻ có ý nghĩa" (đo lường bằng kiểm định $t$); đồng thời sử dụng Sai số chuẩn ($\text{SE}$) để định lượng mức độ không chắc chắn của tham số ước lượng.
### 2. Phân tích các ví dụ minh họa (Slide 3–8 & Transcript P3–P8)
* **Tính chất không chệch và tối ưu của ước lượng BLUE (Slide 3):**
  * *Biểu diễn logic:* 
    $$\{\mathbb{E}(u|X) = 0, \text{Cov}(u_i, u_j) = 0, \text{Var}(u|X) = \sigma^2\} \implies \hat{\beta}_{\text{OLS}} \in \text{BLUE}$$
  * *Cơ chế thực tế:* Tính không chệch ($\text{Unbiased}$) bảo đảm kỳ vọng của ước lượng hội tụ đúng tham số thực của quần thể ($\mathbb{E}(\hat{\beta}) = \beta$); tính chất tốt nhất ($\text{Best}$) bảo đảm phương sai của ước lượng là nhỏ nhất trong toàn bộ lớp các ước lượng tuyến tính không chệch, tối đa hóa độ tập trung quanh giá trị thực.
* **Kiểm định F toàn bộ mô hình (Slide 4):**
  * *Biểu diễn logic:* 
    $$p\text{-value}(F) < 0.05 \implies \text{Bác bỏ } H_0 \implies \text{Tập hợp biến } \{x_1, \dots, x_k\} \text{ giải thích có ý nghĩa cho } y$$
  * *Cơ chế thực tế:* Kiểm tra liệu liên kết giữa tập hợp các biến giải thích và biến phụ thuộc có thực sự tồn tại hay chỉ là kết quả ngẫu nhiên do sai số mẫu; nếu kiểm định $F$ không đạt ý nghĩa thống kê, toàn bộ mô hình không có giá trị giải thích thực tế.
* **Kiểm định t và Sai số chuẩn của hệ số trong SLR & MLR (Slide 5–8):**
  * *Biểu diễn logic:* 
    * *Hồi quy đơn biến (SLR):* $$\text{SE}(\hat{\beta}_1) = \frac{\hat{\sigma}}{\sqrt{\sum (x_i - \bar{x})^2}}$$
    * *Hồi quy đa biến (MLR):* $$\text{SE}(\hat{\beta}_j) = \frac{\hat{\sigma}}{\sqrt{\text{SST}_j \cdot (1 - R_j^2)}}$$
  * *Cơ chế thực tế:* Trong hồi quy bội, sai số chuẩn $\text{SE}(\hat{\beta}_j)$ phụ thuộc vào mức độ biến thiên độc lập (unique variation) của biến $x_j$. Nếu $x_j$ bị giải thích nhiều bởi các biến độc lập khác ($R_j^2 \rightarrow 1$, đa cộng tuyến cao), mẫu số co lại dẫn đến sai số chuẩn $\text{SE}(\hat{\beta}_j)$ tăng vọt, làm suy giảm trị tuyệt đối của thống kê $t$ và khiến biến dễ bị kết luận sai là không có ý nghĩa thống kê.
### 3. Ý nghĩa thực tiễn & Ứng dụng ra quyết định (Slide 3–8 & Transcript P3–P8)
* **Theo góc nhìn Đánh giá cấu trúc & Năng lực mô hình (Model Diagnostics):**
  * *Mục tiêu:* Kiểm soát rủi ro ngộ nhận kết quả trước khi đưa ra quyết định can thiệp.
  * *Hành động can thiệp:* Luôn đối chiếu kiểm định $F$ trước tiên; chỉ khi kiểm định $F$ có ý nghĩa thống kê ($p < 0.05$) mới tiến hành đi sâu diễn giải độ lớn và dấu của từng hệ số hồi quy riêng lẻ.
* **Theo góc nhìn Thẩm định hiệu ứng nhân quả & Sàng lọc biến (Feature Selection):**
  * *Mục tiêu:* Xác định đúng các yếu tố thực sự chi phối kết quả đầu ra.
  * *Hành động can thiệp:* Áp dụng kiểm định $t$ ($p < 0.05$) để xác nhận tính có ý nghĩa của từng biến mục tiêu; đồng thời xem xét giữ lại các biến kiểm soát quan trọng theo lý thuyết dù chúng có thể không đạt ý nghĩa thống kê cá lẻ.
* **Theo góc nhìn Kiểm soát đa cộng tuyến & Tối ưu kích thước mẫu:**
  * *Mục tiêu:* Thu hẹp biên độ sai số chuẩn $\text{SE}(\hat{\beta}_j)$ để nâng cao độ chính xác của ước lượng biên.
  * *Hành động can thiệp:* Hạn chế đưa vào các biến có tương quan chéo quá mạnh ($R_j^2$ cao); đồng thời mở rộng quy mô mẫu $n$ để tăng bậc tự do ($df = n - k - 1$), giúp giảm phương sai phần dư $\hat{\sigma}^2$ và tăng lực kiểm định thống kê.
## Các Giả Định Cổ Điển Của Mô Hình Hồi Quy Tuyến Tính OLS (Classical OLS Assumptions)
### 1. Bản chất & Định nghĩa cốt lõi (Slide 1–13, 23–27 & Transcript tương ứng)
* **Phân loại nhiệm vụ:** **Suy luận Thống kê & Ước lượng Kinh tế lượng (Statistical Inference & Econometric Estimation / Predictive & Explanatory Modeling)**.
* **Bản chất kỹ thuật:** 
  * Xác lập hệ điều kiện tiên quyết (Định lý Gauss-Markov) để ước lượng bình phương tối thiểu thông thường (OLS) trở thành ước lượng tuyến tính không chệch tốt nhất (**BLUE - Best Linear Unbiased Estimator**):
    $$\hat{\beta}_{\text{OLS}} \in \text{BLUE} \iff \mathbb{E}(\hat{\beta}) = \beta \quad \text{và} \quad \text{Var}(\hat{\beta}) \le \text{Var}(\tilde{\beta}) \quad (\forall \tilde{\beta} \text{ tuyến tính, không chệch})$$
  * Ba tiêu chuẩn cốt lõi của một ước lượng tốt:
    1. *Tính nhất quán (Consistency):* Cỡ mẫu tăng dần đến vô cùng thì ước lượng hội tụ về tham số thực ($\text{plim}_{n \to \infty} \hat{\beta} = \beta$).
    2. *Tính không chệch (Unbiasedness):* Kỳ vọng của phân phối chọn mẫu bằng đúng giá trị thực ($\mathbb{E}(\hat{\beta}) = \beta$).
    3. *Tính hiệu quả (Efficiency):* Trong tất cả các ước lượng không chệch, OLS có phương sai nhỏ nhất.
  * Hệ 5 giả định OLS cổ điển (Classical Assumptions):
    1. *MLR.1 (Tuyến tính trong tham số):* $y = \beta_0 + \beta_1 x_1 + \dots + \beta_k x_k + u$, tác động biên $\frac{\partial y}{\partial x_j} = \beta_j$ là hằng số.
    2. *MLR.2 (Lấy mẫu ngẫu nhiên):* Dữ liệu quan sát được lấy mẫu ngẫu nhiên độc lập từ tổng thể; sai số giữa các quan sát không tương quan với nhau ($\text{Cov}(u_i, u_j) = 0, \forall i \neq j$).
    3. *MLR.3 (Không có đa cộng tuyến hoàn hảo):* Các biến độc lập không phải hằng số và không có biến nào là tổ hợp tuyến tính chính xác của các biến độc lập khác.
    4. *MLR.4 (Ngoại sinh nghiêm ngặt - Zero Conditional Mean):* $\mathbb{E}(u|X) = 0 \implies \text{Cov}(x_j, u) = 0$. Đây là giả định cốt lõi nhất; vi phạm giả định này khiến biến độc lập thành biến nội sinh và gây chệch tham số.
    5. *MLR.5 (Phương sai thuần nhất / Đồng phương sai):* $\text{Var}(u|X) = \sigma^2$ (phương sai của số hạng sai số không đổi trên toàn bộ miền giá trị của các biến độc lập).
* **Điểm khác biệt / Điểm đặc trưng:** 
  * Giả định MLR.1 đến MLR.4 là điều kiện cần và đủ để OLS đạt **Tính không chệch (Unbiasedness)**. Khi có thêm MLR.5, OLS đạt tính **BLUE (Hiệu quả nhất)**. 
  * Giả định sai số có phân phối chuẩn (**MLR.6: Normality**) KHÔNG thuộc các giả định cổ điển bắt buộc cho tính BLUE, mà chỉ là điều kiện bổ sung trong mô hình CLM phục vụ suy luận mẫu nhỏ ($t$-test, $F$-test).
### 2. Phân tích các ví dụ minh họa (Slide 5–7, 14–21, 25 & Transcript tương ứng)
* **Hiện tượng Đa cộng tuyến & Phóng đại phương sai (Multicollinearity & VIF - Slide 5–7):**
  * *Biểu diễn logic:* 
    $$\text{VIF}_j = \frac{1}{1 - R_j^2} = \frac{1}{\text{Tolerance}_j} \ge 10 \implies \text{Var}(\hat{\beta}_j) = \frac{\sigma^2}{\text{SST}_j (1 - R_j^2)} \gg 0$$
  * *Cơ chế thực tế:* Khi các biến độc lập $x_1$ và $x_2$ tương quan cao, phần biến thiên độc lập (unique variation) của từng biến để giải thích $y$ bị thu hẹp nghiêm trọng. Mặc dù ước lượng vẫn không chệch, nhưng sai số chuẩn $\text{SE}(\hat{\beta}_j)$ bị thổi phồng, kéo trị thống kê $|t|$ xuống thấp, khiến các biến có thực lực bị kết luận nhầm là không có ý nghĩa thống kê.
* **Hiện tượng Chệch do Biến bị Bỏ sót (Omitted Variable Bias - OVB - Slide 14–21):**
  * *Biểu diễn logic:* 
    $$\text{Mô hình thực: } y = \beta_0 + \beta_1 x_1 + \beta_2 x_2 + u$$
    $$\text{Mô hình ước lượng (bỏ sót } x_2\text{): } y = \tilde{\beta}_0 + \tilde{\beta}_1 x_1 + \tilde{u}$$
    $$\mathbb{E}(\tilde{\beta}_1) = \beta_1 + \text{Bias} = \beta_1 + \beta_2 \cdot \tilde{\delta}_1 \quad \left(\text{với } x_2 = \tilde{\delta}_0 + \tilde{\delta}_1 x_1 + v\right)$$
  * *Cơ chế thực tế:* Xét bài toán điểm thi tiếng Anh CET4 ($y$) theo thời gian học bài ($x_1$). Nếu bỏ sót biến trình độ tiếng Anh đầu vào NCEE ($x_2$): vì người học nhiều có nền tảng tiếng Anh cao hơn ($\tilde{\delta}_1 > 0$) và nền tảng cao giúp điểm thi cao hơn ($\beta_2 > 0$), tích $\beta_2 \tilde{\delta}_1 > 0$ tạo ra chệch dương (Upward bias). Hệ số thời gian học bị thổi phồng từ $\beta_1 = 0.6949$ lên $\tilde{\beta}_1 = 0.9882$ (độ chệch $\text{Bias} = 0.293$), do hệ số của $x_1$ đã "gánh" luôn tác động của năng lực vốn có bị bỏ quên.
* **Phương sai sai số thay đổi (Heteroscedasticity - Slide 23–25):**
  * *Biểu diễn logic:* 
    $$\text{Var}(u_i|X) = \sigma_i^2 \neq \text{const} \implies \hat{\beta}_{\text{OLS}} \text{ vẫn không chệch nhưng mất tính BLUE}$$
  * *Cơ chế thực tế:* Độ phân tán của phần dư biến thiên (ví dụ phình to dạng hình quạt khi $X$ tăng). Khi đó công thức tính sai số chuẩn OLS thông thường bị sai lệch, dẫn đến các khoảng tin cậy và giá trị kiểm định $p$-value không còn đáng tin cậy.
### 3. Ý nghĩa thực tiễn & Ứng dụng ra quyết định (Slide 22, 28, 29 & Transcript tương ứng)
* **Theo góc nhìn Nhận diện & Xử lý Nội sinh (Causal Identification):**
  * *Mục tiêu:* Tách biệt mối quan hệ nhân quả thực sự khỏi tương quan giả tạo.
  * *Hành động can thiệp:* Nhận diện 3 nguồn gốc nội sinh (yếu tố gây nhiễu - confounders, chệch chọn mẫu - selection bias, và quan hệ nhân quả đảo ngược - reverse causality). Giải pháp trực tiếp là kiểm soát tối đa các biến gây nhiễu (covariates); trong trường hợp biến bị bỏ sót không đo lường được, phải chuyển sang các thiết kế bán thực nghiệm (biến công cụ IV, sai biệt kép DiD, dữ liệu bảng Fixed Effects). (→ [Causal Inference (Tsing Hua)](/blog/causal-inference/))
* **Theo góc nhìn Đánh đổi Kỹ thuật: Nội sinh vs. Đa cộng tuyến (Trade-off):**
  * *Mục tiêu:* Tối ưu hóa sự đánh đổi giữa giảm độ chệch (Bias) và kiểm soát phương sai (Variance).
  * *Hành động can thiệp:* Đưa thêm biến kiểm soát giúp loại bỏ OVB nhưng có thể làm tăng đa cộng tuyến ($\text{VIF} > 10$). Nhà nghiên cứu cần dựa trên nền tảng lý thuyết nghiệp vụ vững chắc để chọn lọc tập biến kiểm soát cô đọng, tránh đưa biến bừa bãi dẫn đến mất hiệu quả ước lượng.
* **Theo góc nhìn Khung vận hành Phân tích hồi quy (5 Questions & Operational Steps):**
  * *Mục tiêu:* Thiết lập chu trình kiểm chứng chất lượng suy luận trước khi đưa ra quyết định thực thi.
  * *Hành động can thiệp:* Tuân thủ lộ trình 5 bước nghiêm ngặt: (1) Xác định đúng biến phụ thuộc $Y$ và biến độc lập $X$; (2) Ước lượng mô hình; (3) Đánh giá độ phù hợp tổng thể ($R^2$, kiểm định $F$); (4) Diễn giải ý nghĩa hệ số (kinh tế và thống kê qua $t$-test); (5) Thẩm định toàn diện các giả định OLS (chẩn đoán đa cộng tuyến bằng VIF, kiểm tra phương sai thay đổi và giả định ngoại sinh) để xác nhận độ tin cậy của kết quả trước khi hoạch định chính sách hay chiến lược kinh doanh.
## Hồi quy với Biến giả (Models with Dummy Variables as Regressors)
### 1. Bản chất & Định nghĩa cốt lõi (Slide 1–19 & Transcript)
* **Phân loại nhiệm vụ:** **Suy luận Thống kê & Phân tích Nhân quả (Statistical Inference & Explanatory Modeling)**.
* **Bản chất kỹ thuật:** 
  * Tích hợp các thuộc tính định tính (categorical data) vào mô hình hồi quy tuyến tính bằng cách mã hóa chúng thành các biến nhị phân 0/1 (dummy variables). 
  * Tùy thuộc vào cách thiết lập, biến giả có thể dịch chuyển đường hồi quy lên/xuống (thay đổi hệ số chặn - intercept) hoặc làm thay đổi độ dốc của đường hồi quy (thay đổi hệ số góc - slope) đối với từng nhóm đối tượng cụ thể.
* **Điểm khác biệt / Điểm đặc trưng:** 
  * Khắc phục hạn chế của việc chỉ so sánh trung bình đơn thuần (như $t$-test) bằng cách cho phép kiểm soát đồng thời nhiều biến số khác (tránh Omitted Variable Bias - OVB). Nó cũng cung cấp công cụ "Missing Indicator" (biến giả báo khuyết) để xử lý dữ liệu bị missing mà không cần xóa bỏ quan sát.
### 2. Phân tích các ví dụ minh họa (Slide 2–15 & Transcript)
* **Ngữ cảnh 1: Mô hình cơ sở & Kiểm soát nhiễu (Dummy + Continuous Variable):**
  * *Biểu diễn logic:* $$\text{incearn} = \beta_0 + \delta_0 \text{female} + \beta_1 \text{Edu} + u$$
  * *Cơ chế thực tế:* Mô hình này giả định tác động của giáo dục (Edu) lên thu nhập là đồng nhất (cùng một độ dốc $\beta_1$) cho cả nam và nữ. Hệ số $\delta_0$ đo lường sự chênh lệch thu nhập trung bình giữa nữ và nam *sau khi đã giữ nguyên trình độ học vấn* (holding education constant), qua đó giúp bóc tách tác động của sự phân biệt đối xử thuần túy khỏi sự khác biệt về nền tảng giáo dục.
* **Ngữ cảnh 2: Mô hình có biến tương tác (Interaction Term):**
  * *Biểu diễn logic:* $$\text{incearn} = \beta_0 + \delta_0 \text{female} + \beta_1 \text{Edu} + \delta_1 (\text{female} \times \text{Edu}) + u$$
  * *Cơ chế thực tế:* Mô hình này cho phép hai nhóm có cả hệ số chặn và hệ số góc khác nhau. Độ dốc đối với nam là $\beta_1$, trong khi độ dốc đối với nữ là $\beta_1 + \delta_1$. Hệ số $\delta_1$ chính là sự chênh lệch về tỷ suất sinh lời từ giáo dục (returns to education) giữa hai giới tính.
### 3. Ý nghĩa thực tiễn & Ứng dụng ra quyết định (Slide 14–19 & Transcript)
* **Góc nhìn 1 [Theo đo lường & Đánh giá công bằng]:** Cung cấp bằng chứng định lượng chính xác về sự tồn tại của bất bình đẳng hoặc phân biệt đối xử (như chênh lệch lương theo giới tính, sắc tộc) trên thị trường lao động sau khi đã kiểm soát các năng lực cốt lõi.
* **Góc nhìn 2 [Theo phân tích điểm giao cắt / Crossover point]:** Từ mô hình tương tác, các nhà nghiên cứu có thể tính toán được điểm giao thoa. Ví dụ: vì nữ giới có tỷ suất sinh lời từ giáo dục cao hơn ($\delta_1 > 0$), việc đầu tư vào giáo dục giúp thu hẹp khoảng cách thu nhập, và ở mức học vấn bậc cao (ví dụ: $Edu \ge 15.61$ năm), nữ giới có thể đạt mức lương cao hơn nam giới. Điều này là cơ sở để hoạch định chính sách khuyến khích học tập.
* **Góc nhìn 3 [Theo kỹ thuật tiền xử lý dữ liệu lớn]:** Ứng dụng kỹ thuật "Missing Flag". Bằng cách tạo ra một biến giả bằng 1 khi biến độc lập bị khuyết dữ liệu và điền tạm một giá trị tùy ý vào dữ liệu khuyết, mô hình có thể chạy trên toàn bộ tập dữ liệu gốc mà không làm giảm cỡ mẫu hay làm chệch các ước lượng của các biến khác.
## Mô hình với Biến độc lập Phân loại (Models with Categorical Independent Variables)
### 1. Bản chất & Định nghĩa cốt lõi (Slide 1–17, 23 & Transcript)
* **Phân loại nhiệm vụ:** **Suy luận Thống kê & Phân tích Giải thích / Dự báo (Statistical Inference & Explanatory Modeling)**.
* **Bản chất kỹ thuật:** 
  * Biến phân loại (Categorical variables) với $m > 2$ nhóm không thể đưa trực tiếp vào mô hình dưới dạng số nguyên ($1, 2, 3,\dots$) vì sẽ áp đặt giả định sai lầm về khoảng cách bằng nhau giữa các danh mục:
    $$\text{Sai lầm khi gán: } \text{Region} \in \{1, 2, 3\} \implies \Delta(\text{West} - \text{Central}) = \Delta(\text{Central} - \text{East})$$
  * Giải pháp chuẩn hóa là chuyển đổi biến phân loại $m$ nhóm thành tập hợp $m - 1$ biến giả (dummy variables) nhị phân ($0/1$) khi mô hình giữ lại hệ số chặn (constant $\alpha_0$).
  * Hiện tượng bẫy biến giả (Dummy Variable Trap): Nếu đưa toàn bộ $m$ biến giả vào mô hình cùng hệ số chặn, tổng các biến giả bằng $1$ ($\sum_{j=1}^m D_j = 1$), gây ra hiện tượng đa cộng tuyến hoàn hảo (perfect multicollinearity) khiến ma trận hiệp phương sai không khả nghịch.
* **Điểm khác biệt / Điểm đặc trưng:** 
  * Việc chọn nhóm cơ sở (baseline/reference group) quyết định cách diễn giải hệ số: hệ số chặn $\alpha_0$ đại diện cho giá trị trung bình của nhóm tham chiếu, trong khi các hệ số $\delta_j$ đo lường khoảng chênh lệch trung bình giữa nhóm thứ $j$ so với nhóm tham chiếu đó.
### 2. Phân tích các ví dụ minh họa (Slide 6–15, 19–22 & Transcript)
* **Ngữ cảnh 1: Mô hình một biến phân loại kết hợp biến liên tục (Parallel Slopes):**
  * *Biểu diễn logic:* 
    $$\text{Incearn} = \alpha_0 + \delta_1 \text{Middle} + \delta_2 \text{West} + \alpha_1 \text{education} + u$$
  * *Cơ chế thực tế:* Mô hình tạo ra 3 đường hồi quy song song tương ứng với 3 vùng địa lý (East làm nhóm cơ sở với $\text{Middle} = 0, \text{West} = 0$). Hệ số góc của giáo dục đồng nhất trên toàn bộ các vùng ($\alpha_1$), trong khi hệ số chặn của từng vùng dịch chuyển theo mức chênh lệch $\delta_1$ và $\delta_2$:
    $$\begin{cases} \text{East:} & \mathbb{E}(\text{Incearn}) = \alpha_0 + \alpha_1 \text{education} \\ \text{Middle:} & \mathbb{E}(\text{Incearn}) = (\alpha_0 + \delta_1) + \alpha_1 \text{education} \\ \text{West:} & \mathbb{E}(\text{Incearn}) = (\alpha_0 + \delta_2) + \alpha_1 \text{education} \end{cases}$$
* **Ngữ cảnh 2: Mô hình loại bỏ hệ số chặn (No-Constant Formulation):**
  * *Biểu diễn logic:* 
    $$\text{Incearn} = \delta_1 \text{East} + \delta_2 \text{Middle} + \delta_3 \text{West} + \alpha_1 \text{education} + u$$
  * *Cơ chế thực tế:* Khi triệt tiêu hệ số chặn chung $\alpha_0$, ta có thể đưa toàn bộ $m=3$ biến giả vào mà không vi phạm đa cộng tuyến hoàn hảo. Lúc này, $\delta_1, \delta_2, \delta_3$ trực tiếp phản ánh mức chặn riêng của từng vùng thay vì đo lường chênh lệch tương đối so với nhóm chuẩn.
* **Ngữ cảnh 3: Tương tác giữa hai biến phân loại (Difference-in-Differences / DiD Test):**
  * *Biểu diễn logic:* 
    $$\text{Incearn} = \beta_0 + \beta_1 \text{female} + \beta_2 \text{Middle} + \beta_3 \text{West} + \gamma_1 (\text{female} \times \text{Middle}) + \gamma_2 (\text{female} \times \text{West}) + u$$
  * *Cơ chế thực tế:* Kiểm tra sự khác biệt về khoảng cách tiền lương theo giới tính giữa các vùng miền:
    * $\beta_0$: Thu nhập cơ sở của nam giới vùng East.
    * $\beta_1$: Chênh lệch lương giữa nữ và nam tại vùng East.
    * $\gamma_1, \gamma_2$: Mức độ chênh lệch thêm về khoảng cách giới tính ở vùng Middle/West so với vùng East (Difference-in-Differences).
### 3. Ý nghĩa thực tiễn & Ứng dụng ra quyết định (Slide 8–18, 20–28 & Transcript)
* **Theo góc nhìn Thiết kế mô hình & Phòng tránh sai số đặc tả:**
  * *Mục tiêu:* Đảm bảo các thuộc tính danh nghĩa phi thứ bậc (địa bàn, chủng tộc, ngành nghề) không bị bóp méo thành các biến đo lường số học giả tạo.
  * *Hành động can thiệp:* Luôn chuyển đổi biến định tính thành $m-1$ biến giả có nhóm đối chiếu rõ ràng; xác định nhóm tham chiếu là nhóm phổ biến nhất (default) hoặc có ý nghĩa phân tích trực quan nhất.
* **Theo góc nhìn Đánh giá chính sách & Thử nghiệm can thiệp (Policy Impact Assessment):**
  * *Mục tiêu:* Phân tích tác động không đồng đều của các yếu tố kinh tế - xã hội lên từng phân khúc dân số mục tiêu.
  * *Hành động can thiệp:* Sử dụng các biến tương tác bậc cao ($\text{Categorical} \times \text{Continuous}$ để kiểm tra sai khác độ dốc sinh lời từ giáo dục; $\text{Categorical} \times \text{Categorical}$ để thực hiện kiểm định DiD đo lường bất bình đẳng giới theo địa phương).
* **Theo góc nhìn Ứng dụng kinh doanh & Phân khúc thị trường:**
  * *Mục tiêu:* Xây dựng mô hình định giá, dự báo doanh thu hoặc phân bổ ngân sách tối ưu theo từng cụm khách hàng/vùng miền.
  * *Hành động can thiệp:* Dự báo thu nhập kỳ vọng theo từng nhóm đối tượng cụ thể thông qua công thức kết hợp hệ số chặn và biến đặc trưng nhóm:
    $$\text{mean}(\text{Incearn})_{\text{Group}} = \text{Intercept}_{\text{Group}} + \sum \beta_k \cdot \text{mean}(X_k)$$
# Limited Dependent Variable Models
## Mô hình Xác suất Tuyến tính (Linear Probability Model - LPM)
### 1. Bản chất & Định nghĩa cốt lõi (Slide 1, 5–14 & Transcript P1, P5–P14)
* **Phân loại nhiệm vụ:** **Hồi quy Biến phụ thuộc Giới hạn / Mô hình Hóa Lựa chọn Nhị phân (Limited Dependent Variable / Binary Response Modeling / Explanatory & Predictive)**.
* **Bản chất kỹ thuật:** 
  * Ứng dụng phương pháp bình phương tối thiểu thông thường (OLS) khi biến phụ thuộc $y$ là một biến giả/biến nhị phân đại diện cho việc biến cố có xảy ra hay không:
    $$y \in \{0, 1\} \quad (1 = \text{Success / Event occurs}, \ 0 = \text{Failure / Event does not occur})$$
  * Kỳ vọng có điều kiện của biến nhị phân $y$ đồng nhất với xác suất có điều kiện xảy ra biến cố:
    $$\mathbb{E}(y \mid X) = 1 \cdot P(y = 1 \mid X) + 0 \cdot P(y = 0 \mid X) = P(y = 1 \mid X)$$
  * Phương trình tổng quát của LPM:
    $$P(y = 1 \mid X) = \beta_0 + \beta_1 x_1 + \beta_2 x_2 + \dots + \beta_k x_k + u$$
  * Ý nghĩa của hệ số góc $\beta_j$: Đo lường sự thay đổi trong xác suất xảy ra biến cố (tính bằng điểm phần trăm hoặc tỷ lệ phần trăm) khi biến độc lập $x_j$ tăng thêm 1 đơn vị, trong điều kiện giữ nguyên các biến số khác:
    $$\beta_j = \frac{\partial P(y = 1 \mid X)}{\partial x_j}$$
* **Điểm khác biệt / Điểm đặc trưng:** 
  * *Ưu điểm:* Cấu trúc tuyến tính đơn giản, ước lượng trực tiếp bằng OLS, hệ số mang ý nghĩa tác động biên trực quan, không cần diễn giải thông qua hàm phi tuyến phức tạp như tỷ số chênh (Odds Ratio) trong Logit.
  * *3 Hạn chế cốt lõi do bản chất biến nhị phân:*
    1. *Xác suất dự báo vượt ngưỡng $[0, 1]$:* Do mô hình là hàm tuyến tính không giới hạn, giá trị dự báo $\hat{y}$ có thể nhận giá trị $< 0$ hoặc $> 1$ khi biến độc lập nhận giá trị cực đoan.
    2. *Phần dư không tuân theo phân phối chuẩn:* Với mỗi quan sát $X$, phần dư $u = y - X\beta$ chỉ có thể nhận hai giá trị rời rạc ($1 - X\beta$ hoặc $-X\beta$), vi phạm giả định chuẩn tắc trong mẫu nhỏ.
    3. *Phương sai sai số thay đổi (Heteroscedasticity):* Phương sai của phần dư phụ thuộc trực tiếp vào các biến giải thích $X$:
       $$\text{Var}(u \mid X) = P(y = 1 \mid X)[1 - P(y = 1 \mid X)] = (X\beta)(1 - X\beta)$$
       Vi phạm giả định đồng phương sai (Homoscedasticity). Hiện tượng này **không làm chệch** các ước lượng hệ số OLS ($\hat{\beta}_{\text{OLS}}$ vẫn không chệch), nhưng làm sai lệch công thức sai số chuẩn thông thường, khiến các kiểm định $t$ và $F$ không còn tin cậy nếu không được hiệu chỉnh.
### 2. Phân tích các ví dụ minh họa (Slide 2–4, 10–11, 13–14 & Transcript P2–P4, P10–P11, P13–P14)
* **Xác suất trúng tuyển Đại học Đẳng cấp Thế giới Kép (Double World-Class - DWC):**
  * *Biểu diễn logic:* 
    $$P(\text{DWCuniv} = 1 \mid \text{NCEEscore\_std}, \text{entryyear}) = \beta_0 + \beta_1 \text{NCEEscore\_std} + \beta_2 \text{entryyear} + u$$
    $$\Delta \text{NCEEscore\_std} = 1 \implies \Delta P(\text{DWCuniv} = 1) = +0.176 \quad (+17.6\%)$$
  * *Cơ chế thực tế:* Phân tích mẫu dữ liệu học sinh khối tự nhiên tại Bắc Kinh giai đoạn 2016–2018 (`BJ_College attendance_science track_2016-2018.dta`). Biến phụ thuộc $\text{DWCuniv}$ nhận giá trị $1$ (trúng tuyển DWC) hoặc $0$ (không trúng tuyển). Kết quả hồi quy chỉ ra: khi điểm thi tuyển sinh đại học (NCEE) chuẩn hóa tăng thêm $1$ độ lệch chuẩn, xác suất đỗ vào trường DWC tăng thêm $17.6$ điểm phần trăm trong điều kiện năm thi giữ nguyên.
* **Minh họa cơ chế Phương sai thay đổi và Giới hạn dự báo:**
  * *Biểu diễn logic:* 
    $$\text{Var}(u \mid X) = p(X)[1 - p(X)] \implies \begin{cases} \text{Đạt cực đại khi } p(X) = 0.5 \\ \text{Tiến dần về } 0 \text{ khi } p(X) \to 0 \text{ hoặc } p(X) \to 1 \end{cases}$$
    $$\text{Khi } X \text{ quá lớn hoặc quá nhỏ} \implies \hat{y} = X\hat{\beta} \notin [0, 1]$$
  * *Cơ chế thực tế:* Với học sinh có điểm thi NCEE đặc biệt cao hoặc đặc biệt thấp, phương trình đường thẳng có thể dự báo xác suất đỗ đại học $> 100\%$ hoặc $< 0\%$, mâu thuẫn với tiên đề xác suất. Đồng thời, độ phân tán của sai số biến thiên mạnh nhất ở nhóm học sinh có điểm số trung bình (xác suất đỗ xấp xỉ $50\%$) và co cụm lại ở hai đầu cực trị điểm số, chứng minh toán học cho sự xuất hiện tất yếu của heteroscedasticity.
### 3. Ý nghĩa thực tiễn & Ứng dụng ra quyết định (Slide 5, 10, 11, 14 & Transcript P5, P10, P11, P14)
* **Theo góc nhìn Diễn giải chính sách và Truyền thông kết quả:**
  * *Mục tiêu:* Cung cấp báo cáo định lượng trực tiếp, dễ hiểu cho các nhà hoạch định chính sách giáo dục và nhà quản lý.
  * *Hành động can thiệp:* Sử dụng LPM để công bố trực diện tác động biên (ví dụ: tăng 1 điểm chuẩn tương ứng với bao nhiêu phần trăm xác suất nhập học) thay vì dùng mô hình Logit/Probit đòi hỏi phải tính toán thêm xác suất biên trung bình (Average Marginal Effects - AME).
* **Theo góc nhìn Hiệu chỉnh Kỹ thuật & Kiểm soát rủi ro suy luận:**
  * *Mục tiêu:* Khắc phục hoàn toàn tác động tiêu cực của phương sai thay đổi mà vẫn giữ được tính không chệch của OLS.
  * *Hành động can thiệp:* Tuyệt đối không sử dụng sai số chuẩn mặc định; bắt buộc khai báo tùy chọn sai số chuẩn vững (**Robust Standard Errors** / Sandwich Estimator) khi chạy lệnh hồi quy trong phần mềm thống kê (ví dụ: `regress DWCuniv NCEEscore_std entryyear, robust`) để đảm bảo các giá trị $p$-value và khoảng tin cậy của kiểm định $t$ phản ánh đúng thực tế.
* **Theo góc nhìn Định tuyến Mô hình hóa (Model Selection Strategy):**
  * *Mục tiêu:* Thiết lập ranh giới ứng dụng phù hợp giữa LPM và các mô hình phi tuyến.
  * *Hành động can thiệp:* Áp dụng LPM như một mô hình chuẩn mực khởi đầu (baseline benchmark) để kiểm tra tương quan sơ bộ. Nếu mục tiêu cốt lõi là dự báo xác suất cá thể (Individual Probability Prediction) hoặc khi tỷ lệ các điểm dự báo rơi ra ngoài đoạn $[0, 1]$ chiếm tỷ trọng đáng kể, nhà nghiên cứu cần chuyển sang mô hình hóa phi tuyến chuẩn mực như Logistic Regression (Logit) hoặc Probit.
## Mô hình Phản hồi Nhị phân: Xây dựng và So sánh Probit - Logit (Building Binary Response Models: Probit & Logit)
### 1. Bản chất & Định nghĩa cốt lõi (Slide 1–7 & Transcript P1–P7)
* **Phân loại nhiệm vụ:** **Mô hình Hóa Phản hồi Nhị phân & Biến phụ thuộc Giới hạn (Binary Response Modeling / Limited Dependent Variable - Predictive & Explanatory)**.
* **Bản chất kỹ thuật:** 
  * Xử lý trường hợp biến phụ thuộc $y$ là biến định tính nhị phân biểu diễn hai trạng thái đối lập (thành công/thất bại, xảy ra/không xảy ra biến cố, chọn phương án A/phương án B):
    $$y_i \in \{0, 1\}$$
  * Thiết lập cơ chế quyết định thông qua mô hình biến tiềm ẩn không quan sát được ($y_i^*$ - Unobserved Latent Variable), trong đó $y^*$ tuân theo quan hệ tuyến tính với các biến giải thích:
    $$y_i^* = \beta_0 + x_i'\beta + u_i$$
    $$y_i = \begin{cases} 1 & \text{khi } y_i^* > 0 \\ 0 & \text{khi } y_i^* \le 0 \end{cases}$$
  * Xác định hàm xác suất có điều kiện thông qua tính đối xứng của hàm mật độ xác suất ($g(z) = g(-z) \implies G(z) = 1 - G(-z)$):
    $$P(y_i = 1 \mid x_i) = P(y_i^* > 0 \mid x_i) = P(u_i > -(\beta_0 + x_i'\beta)) = 1 - G(-(\beta_0 + x_i'\beta)) = G(\beta_0 + x_i'\beta)$$
  * *Mô hình Probit:* Giả định sai số ngẫu nhiên $u$ tuân theo phân phối chuẩn tắc ($u \sim \mathcal{N}(0, 1)$), với hàm phân phối tích lũy $\Phi(z)$:
    $$P(y = 1 \mid x) = \Phi(\beta_0 + x'\beta)$$
  * *Mô hình Logit:* Giả định sai số ngẫu nhiên $u$ tuân theo phân phối logistic ($u \sim \text{Logistic}$), với hàm phân phối tích lũy dạng logistic:
    $$G(z) = \frac{e^z}{e^z + 1} \implies P(y = 1 \mid x) = \frac{e^{\beta_0 + x'\beta}}{e^{\beta_0 + x'\beta} + 1}$$
* **Điểm khác biệt / Điểm đặc trưng:** 
  * *Đặc tính Phi tuyến tính (Nonlinear S-shape):* Cả hàm chuẩn tắc lẫn hàm logistic đều tạo ra đường cong chữ S mượt mà, phản ánh chân thực hiệu ứng biên giảm dần ở hai đầu mút xác suất, vượt trội hoàn toàn so với giả định đường thẳng cứng nhắc của LPM.
  * *Ràng buộc xác suất tự nhiên:* Giá trị dự báo $\hat{y}$ luôn bị chặn nghiêm ngặt trong khoảng mở $(0, 1)$, triệt tiêu hoàn toàn nghịch lý xác suất âm hoặc vượt quá $100\%$.
  * *Phương pháp ước lượng Hợp lý cực đại (MLE):* Cả hai mô hình đều được ước lượng bằng Maximum Likelihood Estimation thay cho OLS, cho phép xử lý và kiểm soát triệt để hiện tượng phương sai thay đổi (heteroskedasticity) vốn luôn tồn tại khi làm việc với dữ liệu nhị phân.
### 2. Phân tích các ví dụ minh họa (Slide 8–9 & Transcript P8–P9)
* **Nghiên cứu Điển hình: Xác suất Trúng tuyển Đại học Đẳng cấp Thế giới Kép (DWC University Admission):**
  * *Biểu diễn logic:* 
    $$\text{NCEEscore\_std} \ (\uparrow) \implies y^* \ (\uparrow) \implies P(\text{DWCuniv} = 1 \mid \text{Score, Year}) \ (\uparrow)$$
    $$\text{Entryyear} \ (\uparrow) \implies P(\text{DWCuniv} = 1 \mid \text{Score, Year}) \ (\downarrow)$$
  * *Cơ chế thực tế:* Nghiên cứu tác động của điểm thi tuyển sinh đại học chuẩn hóa (NCEE) và năm nhập học đối với xác suất đỗ trường trọng điểm. Cả Probit và Logit đều hội tụ sau 5 vòng lặp ước lượng. Kết quả hệ số điểm thi mang dấu dương có ý nghĩa thống kê cao (điểm càng cao, cơ hội trúng tuyển càng lớn), trong khi biến năm nhập học mang dấu âm (phản ánh tiêu chuẩn tuyển sinh thắt chặt hoặc mức độ cạnh tranh tăng qua các năm). Chỉ số kiểm định của hai mô hình có sự tương đồng chặt chẽ: Log-likelihood đạt $-359.09$ (Probit) và $-339.19$ (Logit); Pseudo $R^2$ đạt $0.44$ (Probit) và $0.47$ (Logit).
* **So sánh Trực quan Đường cong Dự báo Thực nghiệm (Curve Comparison):**
  * *Biểu diễn logic:* 
    $$\text{LPM (Linear)}: \hat{y} \in (-\infty, +\infty) \quad \text{vs.} \quad \text{Probit / Logit}: \hat{y} \in (0, 1)$$
  * *Cơ chế thực tế:* Khi biểu diễn đồ thị tọa độ giữa Điểm NCEE chuẩn hóa và Xác suất trúng tuyển, đường cong Probit (màu đỏ) và Logit (màu cam) gần như trùng khít lên nhau, đều thể hiện dạng chữ S mềm mại. Trái lại, đường dự báo tuyến tính LPM (đường nét đứt màu xanh lá) cắt xuyên qua các ngưỡng biên và tạo ra dự báo vô lý tại các mức điểm thi quá thấp ($P < 0$) hoặc quá cao ($P > 1$), minh chứng rõ rệt ưu thế mô hình hóa của Probit và Logit.
### 3. Ý nghĩa thực tiễn & Ứng dụng ra quyết định (Slide 7–9 & Transcript P7–P9)
* **Theo góc nhìn Lựa chọn và Hoán đổi Mô hình (Model Selection):**
  * *Mục tiêu:* Đánh giá và ra quyết định lựa chọn công cụ ước lượng phù hợp giữa Probit và Logit trong thực nghiệm.
  * *Hành động can thiệp:* Nhận diện sự tương đồng về năng lực dự báo thực tế của hai mô hình để áp dụng linh hoạt; ưu tiên dùng Logit khi cần báo cáo theo Tỷ số chênh (Odds Ratio) trực quan trong y tế/xã hội học, và chọn Probit khi muốn tích hợp tự nhiên vào các khung lý thuyết kinh tế lượng giả định phân phối chuẩn tiềm ẩn.
* **Theo góc nhìn Quản trị Rủi ro & Dự báo Xác suất Cá thể:**
  * *Mục tiêu:* Thiết lập hệ thống tính toán xác suất trúng tuyển hoặc rủi ro phân lớp chính xác cho từng cá nhân người học.
  * *Hành động can thiệp:* Loại bỏ hoàn toàn mô hình hồi quy tuyến tính LPM khi đối tượng cần đánh giá rơi vào nhóm điểm số cực trị; sử dụng hàm xác suất của Probit/Logit để đảm bảo mọi giá trị ước lượng đều tuân thủ chặt chẽ tiên đề xác suất toán học.
* **Theo góc nhìn Chuẩn hóa Quy trình Phân tích Kinh tế lượng:**
  * *Mục tiêu:* Đảm bảo tính vững và độ hội tụ của thuật toán Maximum Likelihood Estimation trên tập dữ liệu thực tế.
  * *Hành động can thiệp:* Giám sát chặt chẽ quá trình lặp hội tụ (iteration log), kiểm tra chỉ số Pseudo $R^2$ và Log-likelihood để phát hiện sớm các hiện tượng phân tách hoàn hảo (perfect separation), đồng thời chuyển đổi hệ số ước lượng sang Hiệu ứng Biên Trung bình (Average Marginal Effects - AME) khi cần giải thích định lượng cho các nhà quản lý chính sách.
## Diễn Giải Kết Quả Mô Hình Phản Hồi Nhị Phân: Hiệu Ứng Biên và Tỷ Số Chênh (Interpreting Binary Response Models: Marginal Effects & Odds Ratios)
### 1. Bản chất & Định nghĩa cốt lõi (Slide 1–6, 8–10 & Transcript P1–P3, P7–P9)
* **Phân loại nhiệm vụ:** **Suy luận Thống kê & Diễn giải Mô hình Phi tuyến (Explanatory & Causal Statistical Inference for Nonlinear Models)**.
* **Bản chất kỹ thuật:** 
  * Sự khác biệt căn bản giữa mô hình hồi quy tuyến tính (Linear Regression) và mô hình phản hồi nhị phân (Probit/Logit) nằm ở mối quan hệ giữa biến độc lập và xác suất của biến phụ thuộc:
    $$\text{Tuyến tính (Linear): } y = x\beta + e \implies \frac{\partial y}{\partial x_j} = \beta_j$$
    $$\text{Phi tuyến (Probit/Logit): } P(y = 1 \mid x) = G(x\beta) \implies \frac{\partial P(y = 1 \mid x)}{\partial x_j} = g(x\beta)\beta_j$$
    Trong đó $G(z)$ là hàm phân phối tích lũy (CDF) và $g(z) = G'(z) > 0$ là hàm mật độ xác suất (PDF).
  * Ba đặc tính cốt lõi của đạo hàm riêng trong mô hình phản hồi nhị phân:
    1. *Quy mô tác động phụ thuộc vào $x$:* Giá trị của $g(x\beta)$ thay đổi tùy theo vị trí cụ thể của vector $x$, nghĩa là sự biến thiên 1 đơn vị của $x_j$ mang lại mức thay đổi xác suất khác nhau tại các điểm đánh giá khác nhau.
    2. *Chiều tác động không đổi:* Vì $g(z) > 0$ với mọi $z$, dấu của hiệu ứng riêng phần luôn đồng nhất với dấu của hệ số ước lượng $\beta_j$ ($\beta_j > 0 \implies \text{xác suất tăng}$; $\beta_j < 0 \implies \text{xác suất giảm}$).
    3. *Yêu cầu điểm đánh giá cụ thể (Conditional Marginal Effect):* Để diễn giải tác động biên theo điểm phần trăm xác suất, bắt buộc phải cố định các biến độc lập tại một điểm xác định (thường là tại giá trị trung bình $\bar{x}$ - Marginal Effect at the Mean - MEM, hoặc tính trung bình hiệu ứng biên của từng quan sát - Average Marginal Effect - AME).
  * Cơ chế toán học của Tỷ số chênh (Odds Ratio - OR trong Logit):
    $$\text{Odds} = \frac{P(y = 1 \mid x)}{1 - P(y = 1 \mid x)} = e^{x\beta} \iff \ln(\text{Odds}) = x\beta$$
    $$\beta_j = \Delta \ln(\text{Odds}) = \ln\left(\frac{\text{Odds}_{\text{new}}}{\text{Odds}_{\text{old}}}\right) \implies \text{Odds Ratio} = \frac{\text{Odds}_{\text{new}}}{\text{Odds}_{\text{old}}} = e^{\beta_j}$$
    $$\% \Delta \text{Odds} = \frac{\text{Odds}_{\text{new}} - \text{Odds}_{\text{old}}}{\text{Odds}_{\text{old}}} \times 100\% = (e^{\beta_j} - 1) \times 100\%$$
* **Điểm khác biệt / Điểm đặc trưng:** 
  * *Hệ số thô $\beta$ không đo lường thay đổi xác suất:* Tuyệt đối không diễn giải $\beta_j$ là "khi $x_j$ tăng 1 đơn vị thì xác suất tăng $\beta_j$ đơn vị" như trong OLS.
  * *Hiệu ứng biên (Marginal Effect) biến thiên theo đường chữ S:* Tại hai vùng cực trị (xác suất rất gần 0 hoặc rất gần 1), đường cong phẳng $\implies$ hiệu ứng biên rất nhỏ; ở vùng giữa (xác suất quanh mức 0.5), đường cong dốc nhất $\implies$ hiệu ứng biên đạt cực đại.
  * *Tỷ số chênh (Odds Ratio) mang tính bất biến:* Giá trị $\text{OR} = e^{\beta_j}$ là một chỉ số nhân không phụ thuộc vào giá trị của vector $x$. Dù cá nhân đang ở mức điểm hay điều kiện nào, tỷ số chênh của việc biến cố xảy ra so với không xảy ra luôn thay đổi gấp $e^{\beta_j}$ lần khi $x_j$ tăng 1 đơn vị.
### 2. Phân tích các ví dụ minh họa (Slide 4–7, 10–11 & Transcript P3–P6, P10)
* **Nghiên cứu Thực nghiệm 1: Xác suất Trúng tuyển Đại học Trọng điểm (Slide 4, 5, 6, 11 & Transcript P3, P4, P5, P10):**
  * *Biểu diễn logic:* 
    $$\text{NCEE\_std} \xrightarrow{\text{Logit: } \beta = 2.714} \begin{cases} \text{Conditional Marginal Effect (at means): } \frac{\partial P}{\partial x} = 0.0986 \\ \text{Odds Ratio: } \text{OR} = e^{2.714} \approx 15.09 \end{cases}$$
  * *Cơ chế thực tế:*
    * Mô hình ước lượng xác suất trúng tuyển trường đại học đẳng cấp thế giới kép (`DWCuniv`) dựa trên điểm thi đại học chuẩn hóa (`NCEE_std`) và năm nhập học (`entryyear`) với 1,593 quan sát, $\text{Pseudo } R^2 = 0.4727$, Log-likelihood $= -339.19$.
    * *Diễn giải qua Hiệu ứng biên có điều kiện (lệnh `margins, dydx atmeans`):* Tại giá trị trung bình của toàn bộ các biến độc lập trong mẫu, khi điểm thi chuẩn hóa tăng 1 đơn vị (1 độ lệch chuẩn), xác suất trúng tuyển trường trọng điểm tăng thêm $9.86$ điểm phần trăm ($dy/dx = 0.0986, z = 9.32, p < 0.001$).
    * *Diễn giải qua Tỷ số chênh (lệnh `logistic`):* Hệ số $\beta = 2.714$ tương ứng với $\text{Odds Ratio} = e^{2.714} \approx 15.09$ ($95\% \text{ CI: } [11.19, 20.37]$). Điều này có nghĩa là khi điểm thi chuẩn hóa tăng 1 đơn vị, khả năng (odds) đỗ đại học tăng gấp $15.09$ lần so với ban đầu, tương ứng mức tăng trưởng tỷ số chênh là $(15.09 - 1) \times 100\% = 1,409\%$.
    * Đối với năm nhập học 2017, $\text{OR} = 0.41 < 1$ cho thấy sinh viên khóa 2017 có tỷ số chênh trúng tuyển giảm khoảng $59\%$ ($(0.41 - 1) \times 100\% = -59\%$) so với năm cơ sở.
* **Nghiên cứu Thực nghiệm 2: Yếu tố Quyết định Tham gia Đi làm thêm của Sinh viên (Slide 7 & Transcript P6):**
  * *Biểu diễn logic:* 
    $$\text{Tuition-to-income ratio } (\uparrow) \implies P(\text{Work} = 1) \ (\uparrow); \quad \text{SES } (\uparrow) \implies P(\text{Work-Study} = 1) \ (\downarrow)$$
  * *Cơ chế thực tế:*
    * Nghiên cứu sử dụng mô hình Probit và công bố trực tiếp bảng kết quả đã được chuyển đổi thành hiệu ứng biên ($dy/dx$).
    * Biến tỷ lệ học phí trên thu nhập gia đình mang hệ số dương có ý nghĩa ($0.10$ đối với đi làm thêm nói chung và $0.12$ đối với chương trình vừa học vừa làm), phản ánh cơ chế gánh nặng tài chính trực tiếp thúc đẩy hành vi tìm kiếm việc làm thêm của sinh viên.
    * Biến địa vị kinh tế - xã hội gia đình (SES) mang hệ số âm ($-0.030, p < 0.05$) trong mô hình vừa học vừa làm, chứng minh sinh viên từ các gia đình có điều kiện kinh tế khá giả ít có xu hướng đăng ký các công việc trợ cấp trong khuôn viên trường; đồng thời biến con một (only-child) cũng có tác động âm nhất quán qua các mô hình.
### 3. Ý nghĩa thực tiễn & Ứng dụng ra quyết định (Slide 1–11 & Transcript P1–P10)
* **Theo góc nhìn Lựa chọn Ngôn ngữ Báo cáo Kết quả (Marginal Effect vs. Odds Ratio):**
  * *Mục tiêu:* Truyền đạt phát hiện nghiên cứu một cách chuẩn xác, trực quan và không gây hiểu lầm cho người tiếp nhận dữ liệu.
  * *Hành động can thiệp:* Báo cáo Marginal Effects ($dy/dx$) khi mục tiêu là tư vấn chính sách công hoặc kế hoạch hành động thực tế cần con số cụ thể về "mức thay đổi điểm phần trăm xác suất"; sử dụng Odds Ratio ($e^\beta$) khi nghiên cứu mang tính so sánh xác suất tương đối toàn cục hoặc khi làm việc trong các ngành y tế công cộng và xã hội học, nơi tỷ số chênh là chuẩn mực truyền thống.
* **Theo góc nhìn Định vị Đối tượng Can thiệp Dọc Đường cong S-Curve (Targeting Policy Interventions):**
  * *Mục tiêu:* Tối ưu hóa hiệu quả phân bổ nguồn lực dựa trên đặc tính phi tuyến của hàm phân phối xác suất.
  * *Hành động can thiệp:* Nhận diện rõ vị trí của các nhóm đối tượng trên đường cong tích lũy. Tập trung nguồn lực can thiệp (học bổng, tư vấn học thuật, chính sách hỗ trợ) vào nhóm đối tượng nằm ở "khoảng giữa dốc" của đường cong - nơi một tác động nhỏ của biến chính sách đem lại sự bứt phá xác suất lớn nhất; tránh dồn ngân sách vào các nhóm ở hai đầu mút bão hòa nơi hiệu ứng biên tiến dần về 0.
* **Theo góc nhìn Chuẩn hóa Quy trình Phân tích Dữ liệu trên Phần mềm (Software Best Practices):**
  * *Mục tiêu:* Ngăn ngừa các lỗi suy diễn nghiêm trọng khi trích xuất kết quả từ phần mềm thống kê (như Stata hay R).
  * *Hành động can thiệp:* Luôn phân biệt rạch ròi giữa câu lệnh ước lượng hệ số thô (`logit`/`probit`) và các câu lệnh trích xuất hậu nghiệm: sử dụng lệnh `margins, dydx()` kèm tùy chọn xác định tọa độ (`at` hoặc `atmeans`) để thu được sai số chuẩn qua phương pháp Delta (Delta-method), hoặc dùng lệnh `logistic` để kiểm tra độ tin cậy và khoảng tin cậy của Odds Ratio.
## Ước Lượng Hợp Lý Cực Đại (MLE) và Đánh Giá Độ Phù Hợp của Mô Hình Phản Hồi Nhị Phân (Maximum Likelihood Estimation & Model Goodness of Fit)
### 1. Bản chất & Định nghĩa cốt lõi (Slide 1–9, 11–13, 18–20 & Transcript P1–P9, P12–P14, P19–P20)
* **Phân loại nhiệm vụ:** **Ước lượng Tham số Phi tuyến & Đánh giá Độ phù hợp Mô hình (Nonlinear Parameter Estimation & Model Evaluation - Explanatory & Predictive)**.
* **Bản chất kỹ thuật:** 
  * *Ý tưởng cốt lõi của MLE:* Khi mẫu ngẫu nhiên tuân theo một phân phối xác suất đã biết dạng hàm nhưng chưa biết tham số $\beta$, phương pháp MLE tìm kiếm vector tham số sao cho **xác suất quan sát được đúng mẫu dữ liệu hiện tại là lớn nhất**:
    $$\hat{\beta}_{\text{MLE}} = \arg\max_{\beta} \mathcal{L}(\beta \mid y, x)$$
  * *Hàm mật độ Bernoulli & Xác suất mẫu:* Với biến phụ thuộc nhị phân $y_i \in \{0, 1\}$ và xác suất có điều kiện $P(y_i = 1 \mid x_i) = G(x_i'\beta)$, hàm khối xác suất của từng quan sát được viết dưới dạng:
    $$f(y_i \mid x_i; \beta) = [G(x_i'\beta)]^{y_i} [1 - G(x_i'\beta)]^{1 - y_i}$$
  * *Hàm Log-likelihood:* Để chuyển phép nhân của các quan sát độc lập thành phép cộng, hàm log-likelihood cá thể $\ell_i$ và hàm log-likelihood toàn mẫu $L(\beta)$ được xác lập:
    $$\ell_i(\beta) = y_i \ln G(x_i'\beta) + (1 - y_i) \ln [1 - G(x_i'\beta)]$$
    $$L(\beta) = \sum_{i=1}^n \ell_i(\beta) = \sum_{i=1}^n \left\{ y_i \ln G(x_i'\beta) + (1 - y_i) \ln [1 - G(x_i'\beta)] \right\}$$
    *Quy tắc giá trị:* Vì xác suất $G \in (0, 1)$ nên $\ln G < 0$, dẫn đến $L(\beta)$ luôn mang giá trị không dương ($L \le 0$). Mục tiêu tối đa hóa là đưa $L(\beta)$ tiến càng gần 0 càng tốt.
  * *Thuật toán tối ưu hóa lặp (Iterative Optimization):* Khác với công thức giải tích trực tiếp của OLS, MLE bắt đầu từ một phỏng đoán ban đầu $\beta^{(0)}$, tính toán độ dốc (gradient) và ma trận đạo hàm bậc hai (Hessian), liên tục cập nhật tham số $\beta^{(k+1)}$ để làm tăng $L(\beta)$, và dừng lại khi mức tăng của log-likelihood tiệm cận 0.
  * *Đặc tính thống kê tiệm cận:* Dưới các điều kiện chính quy chuẩn (regularity conditions), ước lượng MLE có tính vững ($\hat{\beta} \xrightarrow{p} \beta$), phân phối chuẩn tiệm cận ($\hat{\beta} \sim \mathcal{N}(\beta, \text{Var}(\hat{\beta}))$) và đạt hiệu quả tiệm cận (asymptotically efficient - phương sai nhỏ nhất theo bất đẳng thức Cramér-Rao).
  * *Hệ thống thẩm định độ phù hợp (Goodness of Fit):*
    1. *Kiểm định Tỷ số Hợp lý (Likelihood Ratio - LR Test):* So sánh mô hình đầy đủ ($L_1$) với mô hình rỗng ($L_0$ chỉ có hệ số chặn), tương đương kiểm định $F$ trong OLS:
       $$LR = 2(L_1 - L_0) \sim \chi^2(k)$$
    2. *Hệ số Pseudo $R^2$ (McFadden's $R^2$):* Đo lường tỷ lệ cải thiện log-likelihood so với mô hình rỗng trên khoảng biến thiên tối đa từ $L_0$ đến 0:
       $$\text{Pseudo } R^2 = 1 - \frac{L_1}{L_0} = \frac{L_1 - L_0}{0 - L_0} \in [0, 1)$$
* **Điểm khác biệt / Điểm đặc trưng:** 
  * MLE không sử dụng tiêu chuẩn cực tiểu hóa tổng bình phương sai số ($e'e$) như OLS mà tối ưu hóa khả năng xuất hiện của dữ liệu.
  * Khi hàm liên kết $G$ là hàm phân phối tích lũy logistic chuẩn tắc, ta thu được ước lượng Logit; khi $G$ là hàm phân phối chuẩn tắc $\Phi$, ta thu được ước lượng Probit.
  * Phép kiểm định giả thuyết cá thể trên từng hệ số được thực hiện thông qua thống kê $z$ tiệm cận ($z = \hat{\beta}_j / \text{SE}(\hat{\beta}_j)$).
### 2. Phân tích các ví dụ minh họa (Slide 7–8, 14–18 & Transcript P7–P8, P14–P18)
* **Quá trình tối ưu hóa lặp trong mô hình Sở hữu bằng lái xe (Slide 7–8 & Transcript P7–P8):**
  * *Biểu diễn logic:* 
    $$\text{Iteration 0: } L = -643.25 \longrightarrow \text{Iteration 1} \longrightarrow \dots \longrightarrow \text{Iteration 4 (Convergence): } L = -339.09$$
  * *Cơ chế thực tế:* Mô hình Probit và Logit ước lượng xác suất sinh viên sở hữu bằng lái xe dựa trên các biến giải thích. Tại vòng lặp 0 (mô hình rỗng), log-likelihood rất âm ($-643.25$). Qua 4 đến 5 vòng lặp điều chỉnh vector trọng số, hàm log-likelihood tăng vọt lên mức $-339.09$ và đạt ngưỡng hội tụ tối ưu, minh họa cơ chế thuật toán leo đồi tìm kiếm điểm cực đại toàn cục.
* **Ma trận phân loại và Nghịch lý mẫu mất cân bằng (Slide 14–16 & Transcript P15–P17):**
  * *Biểu diễn logic:* 
    $$\text{Mẫu hiếm (Positive rate } = 5.4\%): \begin{cases} \text{Tỷ lệ phân loại đúng tổng thể (Accuracy)} = 94.62\% \\ \text{Độ nhạy (Sensitivity / True Positive Rate)} = 5.64\% \\ \text{Tỷ lệ âm tính giả (False Negative Rate)} = 94.36\% \end{cases}$$
  * *Cơ chế thực tế:* Trong tập dữ liệu gồm 266 ca biến cố ($y=1$) và 4,659 ca không biến cố ($y=0$), nếu dùng ngưỡng phân loại mặc định $c = 0.5$, mô hình đạt tỷ lệ chính xác tổng thể ấn tượng là $94.62\%$. Tuy nhiên, mô hình thực chất đã gán gần như toàn bộ quan sát về nhóm âm tính, dẫn đến việc bỏ sót $94.36\%$ số ca dương tính thực tế (độ nhạy chỉ đạt $5.64\%$). Điều này chứng minh độ chính xác tổng thể là thước đo nguy hiểm và gây hiểu lầm trong bối cảnh dữ liệu lệch (imbalanced data).
* **Đánh đổi Ngưỡng cắt (Cutoff Selection) và Đường cong ROC / AUC (Slide 16–18 & Transcript P17–P19):**
  * *Biểu diễn logic:* 
    $$\text{Điều chỉnh Cutoff } c: 0.5 \xrightarrow{\text{Hạ xuống } 0.1} \begin{cases} \text{Sensitivity}: 5.64\% \uparrow 71.43\% \\ \text{Specificity}: 97.67\% \downarrow 87.21\% \\ \text{Overall Accuracy}: 94.62\% \downarrow 86.36\% \end{cases}$$
    $$\text{Đồ thị ROC: } (1 - \text{Specificity}) \times \text{Sensitivity} \implies \text{AUC} = 0.8744 \ (\text{Good / Excellent})$$
  * *Cơ chế thực tế:* Sử dụng lệnh Stata `lsens` để mô phỏng sự đánh đổi giữa độ nhạy và độ đặc hiệu khi thay đổi điểm cắt. Bằng cách hạ ngưỡng từ $0.5$ xuống $0.1$, khả năng bắt trúng ca biến cố tăng vọt từ $5.64\%$ lên $71.43\%$, đổi lại độ đặc hiệu giảm nhẹ từ $97.67\%$ xuống $87.21\%$. Đường cong ROC vẽ qua lệnh `lroc` cho diện tích dưới đường cong $\text{AUC} = 0.8744$, chứng minh mô hình có năng lực phân loại xuất sắc trên toàn bộ các ngưỡng xác suất.
### 3. Ý nghĩa thực tiễn & Ứng dụng ra quyết định (Slide 11–20 & Transcript P12–P20)
* **Theo góc nhìn Hiệu chỉnh Ngưỡng phân loại theo Ngữ cảnh Rủi ro (Cost-Sensitive Thresholding):**
  * *Mục tiêu:* Tối ưu hóa quyết định trong các tình huống chi phí của sai lầm Dương tính giả và Âm tính giả không tương đương.
  * *Hành động can thiệp:* Không bao giờ chấp nhận mù quáng ngưỡng mặc định $c = 0.5$. Trong chẩn đoán y tế, phát hiện gian lận tài chính hoặc cảnh báo sinh viên bỏ học, cần chủ động hạ ngưỡng cắt ($c \approx 0.1 - 0.2$) để tối đa hóa Sensitivity, chấp nhận tăng tỷ lệ báo động giả (False Alarm) nhằm ngăn chặn rủi ro bỏ sót ca nguy hiểm.
* **Theo góc nhìn Đánh giá Đa chiều Năng lực Mô hình (Holistic Model Diagnostics):**
  * *Mục tiêu:* Thiết lập chuẩn mực nghiệm thu mô hình phản hồi nhị phân khoa học và tin cậy.
  * *Hành động can thiệp:* Luôn kết hợp ba trụ cột thẩm định độc lập:
    1. *Kiểm định ý nghĩa toàn cục:* Kiểm tra giá trị thống kê $LR \ \chi^2$ ($p < 0.001$) để xác thực các biến giải thích đóng góp ý nghĩa thực sự so với mô hình rỗng.
    2. *Mức độ giải thích:* Báo cáo McFadden's Pseudo $R^2$ (thông thường giá trị từ $0.2$ đến $0.4$ đã phản ánh độ phù hợp rất tốt trong mô hình rời rạc).
    3. *Năng lực phân loại phi ngưỡng:* Báo cáo diện tích $\text{AUC} \in [0.7, 0.9]$ để khẳng định sức mạnh dự báo độc lập với bất kỳ điểm cắt cụ thể nào.
* **Theo góc nhìn Giám sát Quá trình Vận hành Thuật toán Thống kê:**
  * *Mục tiêu:* Đảm bảo tính vững chắc của các suy luận kinh tế lượng thu được từ phần mềm.
  * *Hành động can thiệp:* Quan sát kỹ bảng ghi log lặp (iteration logs) để phát hiện sớm các hiện tượng phân tách hoàn hảo (perfect separation) hoặc ma trận Hessian không khả nghịch (non-concave log-likelihood); chỉ thực hiện suy luận thống kê (z-test, khoảng tin cậy) khi thuật toán đã hội tụ hoàn toàn tại điểm cực đại trơn tru.
