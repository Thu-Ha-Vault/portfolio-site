---
title: Data Mining
type: course-note
tags:
  - data-science
  - AI
section: AI và DEV
folder: AI và DEV / Khoá học AI của Tsing Hua University / Learning Module
vaultPath: >-
  Resources/AI và DEV/Khoá học AI của Tsing Hua University/Learning Module/01 -
  Data Mining.md
source: 'https://maic.chat/my_study'
order: 1
description: >-
  Phân tích lộ trình học tập tại hiệu sách tin học (Computer Bookstore): Chuỗi
  quy luật: $$(\text{Intro\To\Visual\C}) \rightarrow (\text{C++\Primer})
  \rightarrow (\text{Perl\for\dummies}, \text{Tcl\Tk})$$ Ý nghĩa: Phản ánh
isIndex: false
---
## Motivation: what is and why data mining?
### What is Data Mining? 
- Data mining (DM) is also called Knowledge Discovery in Databases (KDD)
- Definitions: 
	- Extraction of interesting patterns or knowledge from huge amount of data
	- A non-trivial process of identifying valid, novel, useful and ultimately understandable patterns in data
	- The science of discovering structure and making predictions in large or complex data sets.
### Why is Data Mining?
- Necessity is the mother of invention
- Data explosion:
	- Automated data collection tools and mature database technology lead to tremendous amounts of data accumulated and/or to be analyzed in databases, data warehouses, and other information repositories
	- There is often useful information "hidden" in the "data" that is not readily evident
- We are drowning in data, but starving for knowledge.
- Solution: Data warehousing and data mining
	- Data warehousing and on-line analytical processing
	- Mining interesting pattern or knowledge (rule, regularities, patterns, constraints) from data in large DB.
### From Technology Evolution
-  It began in the 1960s with simple file systems, evolved into relational data models in the 1970s, and matured into relational database management systems and application-oriented databases in the 1980s. 
- By the 1990s, we saw the emergence of data mining, data warehousing, multimedia databases, and web databases. 
- Moving into the 2000s, the field expanded further to include stream data management and mining, broader data mining applications, and advanced web technologies.
- This historical progression highlights two major shifts: first, a transition from Online Transaction Processing, or OLTP, to Online Analytical Processing, known as OLAP; and second, a move from traditional Database Management Systems, or DBMS, to Decision Support Systems, or DSS. Ultimately, modern data mining represents a powerful fusion of artificial intelligence and database technology.
### Big Data
- The Global: Datasphere will grow from 33 Zettabytes (ZB) in 2018 to 175 ZB by 2025
- Only about 9 ZD of that data will actually be stored
- Just 0.5% of data was actually being analyzed
### Buy or not to buy, this is the question
### Buy or not to buy, this is the question
* **Farecast: a company that utilized data mining techniques to anticipate airfare fluctuations**
  * $ 110 million bought by MS in 2008
* **Decide2010: a company that utilizes data mining and information extraction to revolutionize shopping for Consumer Electronics, acquired by ebay in 2013**
* **Oren Wtzioni**
	* Professor at the University of Washington's Computer Science Department
	* Open information extraction, KnowitAll
	* Founder of four companies
	* CEO of Allen Institute for Artificial Intelligence (AI2)
### Healthcare
#### 1. Ứng dụng khai phá dữ liệu truy vấn để phát hiện dịch cúm (Slide 14 & Transcript P14)
- **Ý tưởng cốt lõi:** Giám sát hành vi tìm kiếm thông tin y tế của người dùng thông qua các truy vấn trên công cụ tìm kiếm trực tuyến (search engine) để phát hiện dịch bệnh.
- **Lợi thế:** Cho phép nhận diện và cảnh báo các đợt bùng phát dịch bệnh sớm hơn rất nhiều so với các hệ thống giám sát y tế truyền thống.
- **Bằng chứng nghiên cứu:** Bài báo công bố trên tạp chí _Nature_ (tháng 2/2009) chứng minh xu hướng tìm kiếm trực tuyến phản ánh rất sát diễn biến lây lan của dịch cúm thực tế giai đoạn 2004–2008.
![Ảnh chụp Màn hình 2026-09-16 lúc 00.18.02](/vault-assets/anh-chup-man-hinh-2026-09-16-luc-00-18-02-142c730a.png)
####  2. Thách thức và sai số của mô hình ban đầu – Google Flu Trends (Slide 15, 16)
- **Hạn chế trong thực tế:** Mặc dù triển vọng, Google Flu Trends đã bộc lộ những sai số dự báo nghiêm trọng.
- **Mức độ sai lệch:** Trong một số thời điểm (như đại dịch cúm A/H1N1 năm 2009 hay các năm sau đó), ước tính số ca cúm của Google cao gấp hơn hai lần so với số liệu thực tế được báo cáo bởi CDC Hoa Kỳ.
- **Bài học rút ra:** Được phân tích trong các nghiên cứu trên _PLoS ONE_ (2011), _Nature_ (2013) và _Science_ (2014, bài báo _"The Parable of Google Flu: Traps in Big Data Analysis"_), chỉ ra rằng dữ liệu lớn không phải lúc nào cũng hoàn hảo; mô hình cần được kiểm chứng nghiêm ngặt và tinh chỉnh liên tục để tránh các bẫy dữ liệu (data traps).
![Ảnh chụp Màn hình 2026-09-16 lúc 00.17.34](/vault-assets/anh-chup-man-hinh-2026-09-16-luc-00-17-34-baad5a85.png)

![Ảnh chụp Màn hình 2026-09-16 lúc 00.17.42](/vault-assets/anh-chup-man-hinh-2026-09-16-luc-00-17-42-35ef6fdf.png)#### 3. Giải pháp cải tiến: Mô hình ARGO (Slide 17)
- **Phương pháp đề xuất:** Mô hình **ARGO** (_AutoRegression with Google search data_), công bố trên _PNAS_ (2015).
- **Cải tiến kỹ thuật:** Thay vì chỉ phụ thuộc hoàn toàn vào từ khóa tìm kiếm, ARGO kết hợp **dữ liệu tìm kiếm của Google** với **dữ liệu dịch tễ học trễ (lagged data) từ CDC**.
- **Kết quả:**
    - Đường cong dự đoán bám sát chính xác các đợt bùng phát thực tế do cơ quan y tế ghi nhận, khắc phục đáng kể tình trạng thổi phồng số liệu trước đây.  
    - Khai thác triệt để thói quen tự nhiên của người dân (tìm kiếm triệu chứng ngay khi cảm thấy không khỏe) để tạo ra các chỉ dấu dự báo sớm.
- **Giá trị thực tiễn:** Tạo ra dữ liệu theo thời gian thực (near real-time) giúp cơ quan quản lý phản ứng nhanh hơn nhiều so với quy trình truyền thống (khám bệnh $\rightarrow$ bác sĩ báo cáo $\rightarrow$ tổng hợp dữ liệu), chứng minh giá trị xã hội to lớn của khai phá dữ liệu trong y tế công cộng.
![Ảnh chụp Màn hình 2026-09-16 lúc 00.17.00](/vault-assets/anh-chup-man-hinh-2026-09-16-luc-00-17-00-e2da98d3.png)

### 4V of Big Data
- **Volume**: Data at scale; terabytes to petabytes of data
- **Variety**: Data in many forms; structured, unstructured
- **Velocity**: Data in motion; analysis of streaming data to enable decisions within fractions of a second
- **Veracity**: Data uncertainty; managing the reliability and predictability
-> essentially describe what big data _is_. They define the nature of the data itself.However, simply possessing massive, diverse, fast-moving, and accurate datasets does not automatically generate value.
- 5th V: data value
- Big data: a revolution that will transfer how we live, work and think, the essence of big data lies not in its sheer size, but in the value we can extract from it. (→ [Foundations - Data, data, everywhere](/blog/sinh-hoc/bioinformatics/b-data-science-and-bioinformatics/i-data-science/01-foundations-data-data-everywhere/))
- Smart data: First, it must "Make Sense to a human."This means the data should be meaningful, interpretable, and usable by us, rather than just being a string of incomprehensible numbers. Second, it must support "timely and better predictions or decision outcomes."In other words, smart data empowers us to make faster and more accurate decisions.
- This is the core objective of our data mining work: we are not here to simply process data, but to make it truly "smart," turning it into a reliable foundation for decision-making. Next, we will explore how to achieve this goal within the actual knowledge discovery process.
## Data Mining framework: the step of process
### Knowledge Discovery (KDD) Process
- View from typical database systems and data warehousing communities
- Data mining play an essential role in the knowledge discovery process
![The Knowledge Discovery in Databases (KDD) process model | Download ...](https://tse3.mm.bing.net/th/id/OIP.xbcnINtwg-q38mYD0XYctQHaEL?r=0&rs=1&pid=ImgDetMain&o=7&rm=3)
- The diagram we are looking at represents the classic perspective from the database and data warehousing communities. It illustrates how we move from raw data at the bottom to valuable knowledge at the top.
	- The journey begins with databases.In real-world scenarios, we often deal with multiple data sources. Before we can do anything useful, we must perform two critical tasks: data cleaning and data integration. Data cleaning involves removing noise, handling missing values, and resolving inconsistencies. Data integration combines information from these different sources into a unified view. The result of these efforts is a data warehouse, which serves as a clean and organized foundation for our analysis.
	- Once we have our data warehouse, we don’t just dump all the data into our algorithms. Instead, we perform data selection.Why? Because data warehouses can be massive, but our specific mining task usually only requires a relevant subset. By selecting only the task-relevant data, we make the subsequent steps more efficient and focused.
	- Next comes data transformation.Here, we prepare the selected data for mining by applying techniques like normalization or feature extraction. The goal is to convert the data into a format that is suitable for the mining algorithms to process effectively. Think of this as translating the data into a language the algorithm understands best.
	- With the data properly prepared, we reach the core step: data mining. Notice how this step is highlighted in red on the slide? That’s because it is the heart of the process. In this stage, we apply various intelligent algorithms to discover hidden patterns within the data.
	- However, finding patterns isn’t the end of the story. We must then evaluate these patterns. Not every pattern found is interesting or useful. Through pattern evaluation, we filter out the trivial results and identify those that are truly valuable and aligned with our goals. This final step transforms raw patterns into actionable knowledge.
	- It is crucial to remember that while data mining is the central engine, it is just one part of the entire KDD pipeline. The preparatory work of cleaning and transforming data, along with the post-mining evaluation, is equally vital. Together, these steps ensure that we extract genuine insights rather than just statistical noise.
- Think of this view as a layered framework that helps us understand how raw data is transformed into valuable knowledge.
	- Layer 1: 
		- Learning the application domain: relevant prior knowledge and goals of application
		- Creating dataset: data collection
	- Layer 2:
		- Data cleaning and preprocessing: (more than 60% of effort) (→ [Process data from Dirty to Clean](/blog/sinh-hoc/bioinformatics/b-data-science-and-bioinformatics/i-data-science/04-process-data-from-dirty-to-clean/))
		- Data reduction and transformation: Find useful features, dimensionality/variable reduction, invariant representation
	- Layer 3:
		- Choosing functions of data mining: summarization, classification, regression, association, clustering
		- Choosing the mining algorithm(s)
		- Data mining: search for patterns of interest
	- Layer 4: Pattern evaluation and knowledge presentation: visualization, transformation, removing redundant patterns
![Ảnh chụp Màn hình 2026-09-18 lúc 13.53.32](/vault-assets/anh-chup-man-hinh-2026-09-18-luc-13-53-32-625e34d1.png)
![Ảnh chụp Màn hình 2026-09-18 lúc 13.54.01](/vault-assets/anh-chup-man-hinh-2026-09-18-luc-13-54-01-db0560df.png)
- As you can see from this diagram, data mining didn’t appear out of nowhere. It is actually a fusion of several mature disciplines. At its base, we have Data Sources like files and database systems, which feed into Data Warehouses. From there, traditional methods like Statistical Analysis and OLAP help us explore the data. But to truly discover information, we rely on core pillars: Statistics provides the theoretical foundation for understanding data distributions; Machine Learning and Artificial Intelligence offer the algorithms that allow computers to automatically learn patterns; Pattern Recognition gives us the techniques to classify complex structures; and Database Systems provide the platform to handle massive amounts of data efficiently. In short, data mining stands on the shoulders of these giants.
- If these traditional fields are already so well-established, why do we need data mining as a separate discipline? The answer lies in the unique challenges of modern data. First, consider the sheer scale: we are dealing with terabytes or even petabytes of data, which can overwhelm traditional algorithms. Second, there is the issue of high dimensionality, where a single data object might have hundreds of attributes, leading to what we call the "curse of dimensionality." Finally, data is increasingly heterogeneous and distributed, coming in various forms like text, images, and videos, often stored across different locations.
- These unprecedented challenges have driven the rapid evolution of data mining as an independent field. It not only inherits the best practices from traditional disciplines but also innovates to address the specific needs of the big data era. This evolution has also given rise to Data Science, which has become one of the most exciting and impactful areas of study and application today.
### Origins of Data Mining
- Draw ideas from machine learning/AI, pattern recognition, statistics, and database system
- Traditional techniques may be unsuitable due to:
	- Enormity of data: We are no longer dealing with small datasets; we face terabytes or even petabytes of information, which can overwhelm traditional algorithms.
	- High dimensionality of data: Real-world objects often have hundreds or thousands of attributes, making analysis significantly more complex.
	- Heterogeneous, distributed nature of complex data: Information comes from diverse sources, stored in different locations, and in various formats, requiring more flexible and robust approaches.
- Data mining and Data Science
![Ảnh chụp Màn hình 2026-09-18 lúc 13.58.33](/vault-assets/anh-chup-man-hinh-2026-09-18-luc-13-58-33-12429302.png)
## Data Mining: On what kind of data and functionality and Evaluation
### Type of data
- What kinds of data can we actually mine? This is a crucial question because the nature of your data dictates which techniques and algorithms you should use.
	- Relational database, Transactional database: The earliest and most common applications of data mining
	- Data warehouse (integrated data): Unlike operational databases, a data warehouse integrates data from multiple sources, providing a unified and comprehensive view that is optimized for analysis rather than just daily transactions.
	- Advanced database and advanced appllications
		- Data streams and sensor data: are generated continuously in real time, such as readings from IoT devices
		- Time-series data, temporal data, sequence data: all of which carry critical time-dimensional information, like stock prices or DNA sequences.
		- Graph data, social networks and information networks: capture the relationships and connections between entities.
		- Spatial data and spatiotemporal data: include geographic location information, essential for applications like navigation systems.
		- Multimedia database (unstructured/semi-unstructured): containing images, audio, and video
		- Text databases: require natural language processing
		- The World-Wide Web: serves as a vast, dynamic, and ever-changing source of information.
- This diversity means that there is no one-size-fits-all solution; instead, we must carefully select the appropriate mining methods and algorithms tailored to the specific characteristics of the data at hand.
### Data Mining Tasks
- **Predictive tasks**: use some variables to predict unknown of future values of other variables. Use existing data to make informed forecasts about unknown or future outcomes. (→ [Phân tích dữ liệu nhà ở Boston](/blog/sinh-hoc/biology-project-and-lab-report/introduction-to-data-analysis/04-phan-tich-du-lieu-nha-o-boston/))
	- **Classification**: The goal here is to assign new data points to predefined categories based on their features.
	- **Regression**: used to estimate continuous numerical values. (→ [Linear and Logistic Regression](/blog/sinh-hoc/bioinformatics/a-statistics-and-biostatistics/iii-statistical-models-and-method/01-linear-and-logistic-regression/))
	- **Deviation/Outlier Detection**: This technique identifies data points that significantly differ from the normal pattern.
- **Descriptive tasks**: Find human-interpretable patterns that describe the data. Help us uncover hidden patterns and structures within the data to improve our understanding.
	- **Association Rule Discovery**: this technique reveals relationships between different items, such as identifying which products are frequently bought together in a supermarket.
	- **Clustering**: Unlike classification, clustering does not rely on predefined labels.Instead, it automatically groups similar data objects together.
	- **Sequential Pattern Discovery**: While similar to association rules, this method focuses specifically on the order of events over time.
#### Khai phá luật kết hợp (Association Rule Discovery)
##### 1. Bản chất và định nghĩa 
* **Phân loại nhiệm vụ:** Thuộc nhóm nhiệm vụ **Mô tả (Descriptive task)**, hướng đến việc phát hiện các mẫu tiềm ẩn mà con người có thể hiểu và diễn giải được (human-interpretable).
* **Cấu trúc luật:** Được biểu diễn dưới dạng logic điều kiện:
  $$\text{Nếu } X \text{ thì } Y \quad (X \rightarrow Y)$$
  * **$X$ (Antecedent):** Tiền đề / điều kiện xuất hiện.
  * **$Y$ (Consequent):** Hệ quả / biến cố xảy ra tiếp theo.
##### 2. Ví dụ phân tích giỏ hàng 
* **$\{\text{Milk}\} \rightarrow \{\text{Coke}\}$:** Khách hàng mua sữa có xu hướng mua thêm nước ngọt Coca-Cola.
* **$\{\text{Diaper, Milk}\} \rightarrow \{\text{Beer}\}$:** Khách hàng mua đồng thời tã giấy và sữa thường mua kèm bia.
  * *Ý nghĩa hành vi:* Các bậc cha mẹ trẻ khi mua đồ dùng thiết yếu cho con nhỏ thường tranh thủ mua bia để giải trí hoặc thư giãn tại nhà.
##### 3. Ứng dụng trong Tiếp thị và Khuyến mãi 
Xét luật cụ thể: **$\{\text{Bagels, } \dots\} \rightarrow \{\text{Potato Chips}\}$** (Mua bánh mì vòng Bagel dẫn đến mua khoai tây chiên):
* **Xét từ Consequent ($\{\text{Potato Chips}\}$):**
  * *Mục tiêu:* Thúc đẩy doanh số cho khoai tây chiên.
  * *Ứng dụng:* Xác định các sản phẩm "dẫn đường" (tiền đề) để bố trí quầy kệ cạnh nhau hoặc chạy quảng cáo nhắm mục tiêu.
* **Xét từ Antecedent ($\{\text{Bagels}\}$):**
  * *Mục tiêu:* Đánh giá rủi ro danh mục và quản lý hàng tồn kho.
  * *Ứng dụng:* Dự báo thiệt hại dây chuyền đối với các mặt hàng liên quan (như khoai tây chiên) nếu cửa hàng dừng bán Bagels.
* **Kết hợp cả Antecedent và Consequent ($\{\text{Bagels}\} \text{ và } \{\text{Potato Chips}\}$):**
  * *Mục tiêu:* Bán chéo sản phẩm (Cross-selling).
  * *Ứng dụng:* Tạo combo ưu đãi (mua Bagels giảm giá Potato Chips) hoặc trưng bày gần nhau để tối đa hóa kích thước giỏ hàng.
##### 4. Phạm vi mở rộng thực tế
* **Hệ thống gợi ý thương mại điện tử:** Cơ chế gợi ý *"Người mua sản phẩm này cũng thường mua..."* trên các sàn mua sắm.
* **Tối ưu hóa bố cục website:** Sắp xếp nội dung hoặc liên kết trang dựa trên thói quen duyệt web đồng thời của người dùng.
#### Khai phá mẫu tuần tự (Sequential Pattern Discovery)
##### 1. Khái niệm và sự khác biệt cốt lõi
* **Phân loại nhiệm vụ:** Thuộc nhóm nhiệm vụ **Mô tả (Descriptive task)**.
* **Bản chất:** Tìm kiếm các chuỗi sự kiện hoặc tập mục xuất hiện thường xuyên theo một thứ tự thời gian cụ thể (time-ordered data).
* **Khác biệt với Association Rules:**
  * *Association Rules:* Tập trung vào các mục xuất hiện **cùng lúc** trong một giao dịch (ví dụ: mua đồng thời tã và bia trong một giỏ hàng).
  * *Sequential Patterns:* Bổ sung **chiều thời gian (temporal dimension)**, xác định sự kiện xảy ra **trước - sau** (sự kiện A xảy ra $\rightarrow$ sau đó đến sự kiện B).
##### 2. Các ví dụ ứng dụng thực tế 
* **Phát hiện lỗi kỹ thuật trong mạng viễn thông (Telecommunications alarm logs):**
  * *Chuỗi quy luật:* 
$$(\text{Inverter\_Problem}, \text{Excessive\_Line\_Current}) \rightarrow (\text{Rectifier\_Alarm}) \rightarrow (\text{Fire\_Alarm})$$
  * *Ý nghĩa:* Sự cố biến tần đi kèm dòng điện quá tải thường kích hoạt cảnh báo bộ chỉnh lưu, cuối cùng dẫn tới nguy cơ cháy nổ. Việc nhận diện chuỗi giúp kỹ sư can thiệp bảo trì chủ động trước khi sự cố leo thang thành thảm họa.

* **Phân tích lộ trình học tập tại hiệu sách tin học (Computer Bookstore):**
  * *Chuỗi quy luật:* 
$$(\text{Intro\_To\_Visual\_C}) \rightarrow (\text{C++\_Primer}) \rightarrow (\text{Perl\_for\_dummies}, \text{Tcl\_Tk})$$
  * *Ý nghĩa:* Phản ánh trình tự tiếp thu kiến thức tự nhiên của lập trình viên, hỗ trợ nhà sách gợi ý tài liệu học tập theo từng giai đoạn tiến bộ của độc giả.
* **Dự đoán hành vi tiêu dùng tại cửa hàng đồ thể thao (Athletic Apparel Store):**
  * *Chuỗi quy luật:* 
$$(\text{Shoes}) \rightarrow (\text{Racket}, \text{Racketball}) \rightarrow (\text{Sports\_Jacket})$$
  * *Ý nghĩa:* Khách hàng bắt đầu bằng việc mua giày tập, sau đó mua vợt bóng, rồi tiếp tục sắm áo khoác thể thao. Nhận diện hành trình này giúp nhà bán lẻ tối ưu hóa chiến dịch tiếp thị và quản lý tồn kho theo từng mốc thời gian khách hàng nâng cao nhu cầu.
#### Phân lớp dữ liệu (Classification)
##### 1. Bản chất & Định nghĩa cốt lõi 
* **Phân loại nhiệm vụ:** **Dự báo (Predictive task)**.
* **Bản chất kỹ thuật:** 
  * Xây dựng mô hình học có giám sát (supervised learning) từ dữ liệu lịch sử đã được gán nhãn nhằm gán các đối tượng dữ liệu mới/chưa biết vào một trong các lớp (classes) rời rạc đã xác định từ trước:
$$f(X_1, X_2, \dots, X_n) \rightarrow Y \quad \text{với } Y \in \{C_1, C_2, \dots, C_k\}$$
  * Dữ liệu đầu vào bao gồm các thuộc tính định danh/phân loại (categorical) và thuộc tính liên tục (continuous).
* **Điểm đặc trưng & Quy trình:** 
  * Gồm hai pha riêng biệt: (→ [Classification](/blog/sinh-hoc/bioinformatics/a-statistics-and-biostatistics/iii-statistical-models-and-method/10-classification/))
    1. *Giai đoạn huấn luyện (Model Training):* Thuật toán phân tích **Tập huấn luyện (Training Set)** đã có nhãn để rút trích quy luật và tạo ra **Mô hình phân lớp (Classifier)**.
    2. *Giai đoạn kiểm thử/ứng dụng (Testing/Inference):* Dùng **Tập kiểm thử (Test Set)** và dữ liệu mới chưa gán nhãn để đánh giá độ chính xác cũng như thực hiện dự đoán.
  * Khác biệt cơ bản với gom cụm (Clustering): Classification yêu cầu nhãn mục tiêu xác định từ trước, trong khi Clustering không dùng nhãn sẵn có.
##### 2. Phân tích các ví dụ minh họa
* **Dự đoán rời bỏ của khách hàng (Customer Churn Prediction):**
  * *Biểu diễn logic:* 
$$\{\text{Transaction\_History}, \text{Tenure}, \text{Usage\_Frequency}\} \rightarrow \text{Churn} \in \{\text{Yes}, \text{No}\}$$
  * *Cơ chế thực tế:* Hệ thống học từ lịch sử giao dịch và hành vi của nhóm khách hàng cũ để nhận diện các dấu hiệu suy giảm tương tác trước khi khách hàng chính thức rời đi.
* **Lọc thư rác (Email Spam Filtering):**
  * *Biểu diễn logic:* 
$$\{\text{Keywords}, \text{Sender\_Reputation}, \text{Header\_Features}\} \rightarrow \text{Label} \in \{\text{Spam}, \text{Not Spam}\}$$
  * *Cơ chế thực tế:* Các đặc trưng trong tiêu đề và nội dung email được đối chiếu với tập mẫu email đã gắn nhãn để tự động chuyển thư độc hại vào hòm rác.
##### 3. Ý nghĩa thực tiễn & Ứng dụng ra quyết định (Slide 34 & Transcript P34)
* **Theo góc nhìn Giữ chân khách hàng (Retention Strategy):**
  * *Mục tiêu:* Giảm thiểu tỷ lệ rời bỏ và bảo toàn doanh thu định kỳ.
  * *Hành động can thiệp:* Nhận diện sớm danh sách khách hàng có xác suất churn cao để chủ động kích hoạt ưu đãi, chăm sóc đặc biệt trước khi họ hủy dịch vụ.
* **Theo góc nhìn Vận hành & Bảo mật:**
  * *Mục tiêu:* Tự động hóa quá trình sàng lọc rủi ro mà không cần can thiệp thủ công.
  * *Hành động can thiệp:* Xử lý theo thời gian thực (real-time filtering), ngăn chặn thư lừa đảo hoặc giao dịch bất thường trước khi gây thiệt hại cho người dùng.
* **Yếu tố then chốt để triển khai thành công:**
  * Chất lượng và quy mô của **Tập huấn luyện (Training Data)** quyết định trực tiếp đến năng lực tổng quát hóa (generalization) và độ chính xác của bộ phân lớp trên dữ liệu thực tế.
#### Hồi quy (Regression)
##### 1. Bản chất & Định nghĩa cốt lõi (Slide 30, 36 & Transcript P30, P36)
* **Phân loại nhiệm vụ:** **Dự báo (Predictive task)**.
* **Bản chất kỹ thuật:** 
  * Dự đoán giá trị của một biến mục tiêu nhận giá trị liên tục (continuous-valued variable) dựa trên tập các biến giải thích/đặc trưng đầu vào, thông qua việc giả định và thiết lập mối quan hệ phụ thuộc tuyến tính hoặc phi tuyến:
    $$y = f(x_1, x_2, \dots, x_n) + \epsilon$$
  * Nền tảng lý thuyết được nghiên cứu sâu rộng và phát triển mạnh mẽ từ thống kê cổ điển (statistics) cũng như mạng nơ-ron nhân tạo (neural networks).
* **Điểm khác biệt / Điểm đặc trưng:** 
  * So với Phân lớp (Classification): Classification phân loại dữ liệu vào các nhãn danh mục rời rạc (ví dụ: Churn/Loyal, Spam/Not Spam), trong khi Regression ước lượng một giá trị số thực chính xác trên thang đo liên tục.
##### 2. Phân tích các ví dụ minh họa (Slide 36 & Transcript P36)
* **Dự báo doanh số sản phẩm mới theo ngân sách tiếp thị (Sales vs Advertising):**
  * *Biểu diễn logic:* 
$$\{\text{Advertising\_Expenditure}\} \rightarrow \text{Sales\_Amount} \in \mathbb{R}^+$$
  * *Cơ chế thực tế:* Ước tính số lượng hoặc giá trị doanh thu tạo ra từ sản phẩm mới dựa trên mối tương quan phụ thuộc vào tổng ngân sách chi cho quảng cáo.
* **Dự báo vận tốc gió trong khí tượng thủy văn (Meteorology):**
  * *Biểu diễn logic:* 
$$(\text{Temperature}, \text{Humidity}, \text{Air\_Pressure}, \dots) \rightarrow \text{Wind\_Velocity}$$
  * *Cơ chế thực tế:* Các chỉ số môi trường đóng vai trò biến đầu vào để mô hình hóa hàm phi tuyến biểu diễn động lực học khí quyển, từ đó tính toán vận tốc gió cụ thể.
* **Dự báo chuỗi thời gian các chỉ số thị trường chứng khoán (Finance):**
  * *Biểu diễn logic:* 
    $$(\text{Index}_{t-k}, \dots, \text{Index}_{t-1}, \text{Market\_Factors}_t) \rightarrow \text{Index}_t$$
  * *Cơ chế thực tế:* Sử dụng dữ liệu chuỗi thời gian lịch sử cùng các biến số thị trường để dự báo chỉ số tài chính tại thời điểm tiếp theo.
##### 3. Ý nghĩa thực tiễn & Ứng dụng ra quyết định (Slide 36 & Transcript P36)
* **Theo góc nhìn Hoạch định ngân sách & Tối ưu hóa chi phí:**
  * *Mục tiêu:* Xác định điểm tối ưu giữa chi phí đầu tư và lợi nhuận mang lại.
  * *Hành động can thiệp:* Tính toán mức ngân sách quảng cáo vừa đủ để đạt mục tiêu doanh thu, tránh lãng phí chi phí tiếp thị khi đạt ngưỡng bão hòa.
* **Theo góc nhìn Cảnh báo thiên tai & Quản trị rủi ro khí hậu:**
  * *Mục tiêu:* Đưa ra dự báo số lượng chính xác về sức gió để kích hoạt biện pháp phòng chống bão hoặc điều tiết hệ thống tua-bin điện gió.
  * *Hành động can thiệp:* Điều phối phương án an toàn hàng hải, hàng không và sản xuất năng lượng theo thời gian thực.
* **Theo góc nhìn Đầu tư tài chính & Dự phóng vĩ mô:**
  * *Mục tiêu:* Hỗ trợ nhà đầu tư và các quỹ định giá danh mục, quản trị rủi ro biến động giá cổ phiếu và đưa ra chiến lược phân bổ vốn đón đầu xu hướng.
#### Gom cụm dữ liệu (Clustering)
##### 1. Bản chất & Định nghĩa cốt lõi (Slide 30, 37 & Transcript P30, P37)
* **Phân loại nhiệm vụ:** **Mô tả (Descriptive task)**.
* **Bản chất kỹ thuật:** 
  * Tự động phát hiện và phân chia tập dữ liệu thành các nhóm (clusters) tự nhiên dựa trên độ tương đồng giữa các đối tượng:
$$\mathcal{D} = \{x_1, x_2, \dots, x_N\} \rightarrow \{C_1, C_2, \dots, C_k\} \quad \text{sao cho} \quad \bigcup_{i=1}^k C_i = \mathcal{D}$$
  * Nguyên lý cốt lõi: Tối đa hóa độ tương đồng nội cụm (intra-cluster similarity) và tối đa hóa sự khác biệt giữa các cụm riêng biệt (inter-cluster difference).
* **Điểm khác biệt / Điểm đặc trưng:** 
  * Hoàn toàn thuộc dạng học không giám sát (unsupervised learning). Khác với Phân lớp (Classification) vốn dựa vào các nhãn danh mục xác định từ trước trong tập huấn luyện, gom cụm tự động nhóm các điểm dữ liệu mà không cần bất kỳ nhãn mục tiêu có sẵn nào.
##### 2. Phân tích các ví dụ minh họa (Slide 37 & Transcript P37)
* **Phân khúc thị trường (Market Segmentation):** (→ [SQL – Ứng dụng thực chiến](/blog/sinh-hoc/bioinformatics/c-computational-programming-and-applied-biostatistics-and-bioinformatics/iv-sql/sql-xom-data/advanced/03-ung-dung-thuc-chien/))
  * *Biểu diễn logic:* 
$$\{\text{Geographical\_Attributes}, \text{Lifestyle\_Attributes}\} \xrightarrow{\text{Clustering}} \text{Customer\_Segment}_k$$
  * *Cơ chế thực tế:* Doanh nghiệp thu thập dữ liệu về vị trí địa lý, lối sống, sở thích và thói quen sinh hoạt của tệp khách hàng lớn. Thuật toán gom các khách hàng có đặc điểm tương đồng vào cùng một phân khúc mà không cần định nghĩa trước danh sách nhóm.
##### 3. Ý nghĩa thực tiễn & Ứng dụng ra quyết định (Slide 37 & Transcript P37)
* **Theo góc nhìn Chiến lược Tiếp thị hỗn hợp (Marketing Mix Strategy):**
  * *Mục tiêu:* Tiếp cận chính xác từng nhóm khách hàng mục tiêu thay vì áp dụng một chính sách đại trà kém hiệu quả.
  * *Hành động can thiệp:* Thiết kế gói sản phẩm, thông điệp truyền thông, định giá và kênh phân phối riêng biệt phù hợp với đặc thù hành vi của từng phân khúc cụ thể.
* **Theo góc nhìn Đo lường & Kiểm soát chất lượng gom cụm (Quality Measurement):**
  * *Mục tiêu:* Đảm bảo các phân khúc tìm ra có giá trị thương mại thực tế chứ không phải kết quả ngẫu nhiên của thuật toán.
  * *Hành động can thiệp:* Đánh giá và kiểm chứng chất lượng cụm bằng cách theo dõi hành vi mua sắm thực tế: khách hàng trong cùng một cụm phải có mô hình mua sắm tương tự nhau, đồng thời khác biệt rõ rệt so với các cụm còn lại.
#### Phát hiện sai lệch / Bất thường (Deviation / Anomaly Detection)
##### 1. Bản chất & Định nghĩa cốt lõi (Slide 30, 38 & Transcript P30, P38)
* **Phân loại nhiệm vụ:** **Dự báo (Predictive task)**.
* **Bản chất kỹ thuật:** 
  * Phát hiện các điểm dữ liệu, sự kiện hoặc quan sát có sai lệch đáng kể (significant deviations) so với hành vi chuẩn tắc thông thường hoặc phần lớn dữ liệu còn lại trong hệ thống:
$$\text{Score}(x) = f(x, \mathcal{D}_{\text{normal}}) \quad \text{với} \quad \text{Is\_Anomaly}(x) = \begin{cases} 1 & \text{nếu } \text{Score}(x) > \tau \\ 0 & \text{nếu ngược lại} \end{cases}$$
  * Mô hình học đặc trưng phân phối chuẩn của dữ liệu thông thường để tính điểm dị biệt hoặc xác suất bất thường cho các mẫu mới xuất hiện.
* **Điểm khác biệt / Điểm đặc trưng:** 
  * Đi ngược lại với mục tiêu chính của phần lớn các thuật toán khai phá dữ liệu khác (vốn tìm kiếm quy luật phổ quát đại diện cho số đông), nhiệm vụ này tập trung vào các trường hợp hiếm gặp (rare cases), dị biệt và bất thường nằm ngoài lề phân phối.
##### 2. Phân tích các ví dụ minh họa (Slide 38 & Transcript P38)
* **Phát hiện gian lận thẻ tín dụng (Credit Card Fraud Detection):**
  * *Biểu diễn logic:* 
$$(\text{Transaction\_Amount} \gg \mu_{\text{amount}}) \land (\Delta t \approx 0, \Delta \text{Location} \gg 0) \rightarrow \text{Flagged\_Fraud}$$
  * *Cơ chế thực tế:* Các giao dịch bất thường như chi tiêu số tiền lớn liên tiếp tại các thành phố/quốc gia khác nhau trong khoảng thời gian rất ngắn vi phạm nghiêm trọng thói quen chi tiêu lịch sử của chủ thẻ, kích hoạt ngay cảnh báo gian lận.
* **Phát hiện xâm nhập mạng (Network Intrusion Detection):**
  * *Biểu diễn logic:* 
$$\{\text{Packet\_Rate}, \text{Port\_Access\_Pattern}, \text{Payload\_Entropy}\} \xrightarrow{\text{Deviation}} \text{Network\_Attack}$$
  * *Cơ chế thực tế:* Mạng lưới quy mô lớn (ví dụ mạng đại học có thể xử lý hơn 100 triệu kết nối mỗi ngày) sinh ra lưu lượng khổng lồ. Thuật toán tự động sàng lọc các gói tin hoặc luồng dữ liệu có cấu trúc khác thường để nhận diện tấn công mạng mà không cần rà soát thủ công.
* **Phát hiện thư rác (Spam Detection):**
  * *Biểu diễn logic:* 
$$\{\text{Header\_Anomaly}, \text{Unusual\_Sender\_Pattern}, \text{Content\_Features}\} \rightarrow \text{Label} = \text{Spam}$$
  * *Cơ chế thực tế:* Hệ thống phân tích các thuộc tính của thư đến; nếu các chỉ số về tần suất gửi, địa chỉ nguồn và nội dung lệch xa so với các trao đổi hợp lệ thông thường, thư sẽ được phân loại vào danh sách bất thường/spam.
##### 3. Ý nghĩa thực tiễn & Ứng dụng ra quyết định (Slide 38 & Transcript P38)
* **Theo góc nhìn Bảo vệ tài chính & Giảm thiểu tổn thất:**
  * *Mục tiêu:* Ngăn chặn hành vi trục lợi tài chính trước khi giao dịch kịp quyết toán.
  * *Hành động can thiệp:* Thiết lập cơ chế tự động khóa thẻ tạm thời hoặc kích hoạt xác thực hai yếu tố (OTP/sinh trắc học) ngay khi phát hiện sai lệch chỉ số chi tiêu.
* **Theo góc nhìn An ninh mạng & Vận hành hạ tầng:**
  * *Mục tiêu:* Duy trì tính toàn vẹn hệ thống trước các cuộc tấn công tinh vi (như DDoS, khai thác lỗ hổng zero-day).
  * *Hành động can thiệp:* Tự động ngắt kết nối IP đáng ngờ, cô lập các phân đoạn mạng bị xâm nhập và cảnh báo cho quản trị viên theo thời gian thực giữa hàng trăm triệu kết nối hằng ngày.
* **Theo góc nhìn Tối ưu hóa trải nghiệm số:**
  * *Mục tiêu:* Giữ sạch hòm thư và kênh liên lạc cho người dùng cuối.
  * *Hành động can thiệp:* Lọc bỏ thư rác độc hại và quảng cáo lừa đảo, bảo vệ người dùng khỏi nguy cơ đánh cắp thông tin cá nhân.
### Evaluation of Data Mining
- Are all mined knowledge interesting?
	- One can mine tremendous amount of "pattern" and knowledge
	- Some may fit only certain dimension space (time, location)
	- Some may not be representative, may be transient...
- Evaluation of mined knowledge -> directly mine only interesting knowledge
	- Descriptive vs. predictive: consider whether the knowledge is descriptive, helping us explain past phenomena, or predictive, allowing us to forecast future outcomes.
	- Coverage: which measures how much of the data the pattern explains.
	- Typically vs. novelty: we want to identify common rules while also discovering unexpected new patterns.
	- Accuracy: is a fundamental requirement
	- Timelines: ensures that the knowledge remains applicable and relevant in the current context
## Data Mining and Advanced techniques
- **Representation learning**: the core idea is to transform various real-world objects—whether they are text, images, or other forms of data—into mathematical forms that computers can process efficiently. 
	- Specifically, these are real-valued vectors in a low-dimensional semantic space. This transformation is not random; it is based on the distribution characteristics and intrinsic patterns of these objects within large-scale data. Through this approach, we enable computers to truly "understand" the semantic meaning of data.
	- Deep neural network technology takes this concept to new heights. By integrating multiple interconnected neural network layers, it constructs complex and sophisticated model structures. This multi-layered architecture allows us to capture and model the intricate relationships and deep-seated patterns existing in big data, which is often beyond the reach of traditional methods.
### Data Mining & Big Data
- Classify data by its organizational structure:
	- Structured data: such as tables in a database, has clearly defined rows and columns, making it the easiest to process
	- **Semi-structured data**: like HTML documents or JSON files, has some organization but lacks the strict norms of a database.
	- **Unstructured data**: which is the most challenging category. This includes text, images, and videos, which do not follow a predefined data model.
- The diverse forms this data takes:
	- **Table**: the most traditional form, commonly seen in Excel or databases
	- **Language** (Natural language text): such as news articles and social media posts, contains rich semantic information
	- **Code**: represents the massive amount of programming code generated daily, serving as an important resource
	- **Image**: ranges from medical scans to satellite imagery, holding immense visual value
	- **Voice**: like recordings from voice assistants, carries acoustic and linguistic details
	- **Video**: combines images, sound, and time sequences, making it one of the most complex forms.
	- **Social network**: records relationships and interactions between people
	- **Web**: includes webpage content and link structures
	- **Gene**: serves as the core object in bioinformatics, encoding the secrets of life
	- **Spatial & geographic**: from GPS tracks to city maps, helps us understand patterns in physical space.
### Data Mining & Deep Learning
- **Representation learning**: Representing objects as real valued vectors in a low-dimension semantic space based on their distribution in Big Data
	- By converting these objects into vectors, we can measure the similarity and correlation between items that were previously difficult to compare directly. 
	- This vector representation lays the essential groundwork for many subsequent tasks.
- **Deep Neural Networks**: Integrating multiple interrelated neural networks and use their structures to model the complex relationships existed in big data.
- These two technologies have given rise to several key model architectures:
	- **Word Embedding**: allows us to capture semantic relationships between words. 
	- **Recurrent Neural Networks**: excel at handling sequence data, making them highly effective for tasks like speech recognition. 
	- **Recursive Neural Networks**: are designed to process tree-structured data. 
	- **Convolutional Neural Networks**: have achieved groundbreaking progress in the field of computer vision.
### Data Mining & Large Language Model (LLM)
- Large language models are essentially the product of big data exploration. They represent an organic fusion of massive datasets, advanced algorithms, and powerful computing capabilities. By performing deep modeling on this data, they are able to execute various complex data mining tasks. In this sense, the emergence of large language models is a natural outcome of data mining technology reaching a certain stage of maturity.
- Second, large language models have opened up entirely new methodologies for data mining. Particularly in areas such as text understanding and generation, sequence data modeling and analysis, as well as prediction and decision-making in complex scenarios, these models demonstrate capabilities that traditional methods simply cannot match. They provide us with much more powerful tools to uncover value within data.
- Third, data mining technologies, in turn, empower large language models. These techniques can be applied to every stage of a model’s lifecycle, including training, optimization, and evaluation, acting somewhat like functional plugins for the model. This mutual reinforcement has also spawned many new research directions, such as multi-task learning frameworks and intelligent mining assistants.
- LLM: Large Language Model - Result of big data exploration
	- data + algorithm + computing
	- data modeling
	- perform data mining tasks
- Data Mining by LLM:
	- new method for data mining (text processing)
	- other kinds of data for signals (sequence data modeling)
	- prediction, decision making
- Data Mining for LLM
	- every process of LLM
	- as a model (plugin) in LLM
	- New tasks for Data Mining: multitask, mining-assistant.
### Sự thay đổi mô hình học tập (Learning Paradigm Shift)
![Ảnh chụp Màn hình 2026-09-23 lúc 23.29.56](/vault-assets/anh-chup-man-hinh-2026-09-23-luc-23-29-56-deb9ef20.png)
#### 1. Bản chất & Định nghĩa cốt lõi (Slide 44 & Transcript P44)
* **Phân loại nhiệm vụ:** **Nền tảng học máy & Mô hình hóa (Learning Paradigms / Foundations)**.
* **Bản chất kỹ thuật:** 
  * Sự chuyển dịch mang tính cấu trúc trong cách AI tiếp cận và xử lý các tác vụ xử lý ngôn ngữ và khai phá dữ liệu: từ việc xây dựng mô hình chuyên biệt cho từng tác vụ riêng lẻ sang cơ chế huấn luyện mô hình nền tảng đa năng quy mô lớn (foundation models).
  * Quy trình tiến hóa qua các giai đoạn chính:
    1. *Học có giám sát hoàn toàn (Fully Supervised Learning - Non-neural & Neural):* Phụ thuộc hoàn toàn vào tập dữ liệu lớn đã gán nhãn thủ công cho từng bài toán.
    2. *Tiền huấn luyện và Tinh chỉnh (Pre-train, Fine-tune):* Huấn luyện biểu diễn tổng quát trên dữ liệu phi cấu trúc không gán nhãn, sau đó điều chỉnh trọng số cho bài toán cụ thể.
    3. *Học tập dựa trên lời nhắc (Pre-train, Prompt, Predict):* Sử dụng trực tiếp mô hình ngôn ngữ lớn (LLM) và điều phối đầu ra thông qua mô tả tự nhiên (zero-shot hoặc few-shot learning).
* **Điểm khác biệt / Điểm đặc trưng:** 
  * Xóa bỏ sự phụ thuộc bắt buộc vào việc thu thập nhãn tốn kém cho từng tác vụ mới; biến một mô hình duy nhất thành công cụ vạn năng có khả năng thích ứng linh hoạt qua lời nhắc (prompt engineering) thay vì phải tái huấn luyện kiến trúc mạng từ đầu.
#### 2. Phân tích các ví dụ minh họa (Slide 44 & Transcript P44)
* **Bài toán Phân loại (Classification - CLS):**
  * *Biểu diễn logic:* 
    * *Mô hình truyền thống:* $$X_{\text{labeled}} \xrightarrow{\text{Train}} f_{\text{cls}}(X) \rightarrow Y \in \{C_1, C_2, \dots, C_k\}$$
    * *Mô hình Prompt:* $$\text{Prompt}(X, \text{"Phân loại văn bản này"}) \xrightarrow{\text{Frozen LLM}} \text{Class\_Token}$$
  * *Cơ chế thực tế:* Thay vì cần hàng nghìn bài báo gán nhãn để phân loại tin tức, mô hình chỉ cần đọc văn bản kết hợp với chỉ dẫn để trích xuất lớp tương ứng.
* **Bài toán Gắn thẻ trình tự (Sequence Tagging - TAG):**
  * *Biểu diễn logic:* 
    * *Truyền thống:* $$(w_1, w_2, \dots, w_n) \rightarrow (t_1, t_2, \dots, t_n) \quad \text{với mỗi } w_i \text{ cần nhãn}$$ 
    * *Hiện đại:* Mô hình tận dụng ngữ cảnh toàn cục đã học từ dữ liệu phi cấu trúc để gán nhãn thực thể/từ loại theo hướng dẫn trực tiếp.
  * *Cơ chế thực tế:* Khắc phục gánh nặng gán nhãn từng vị trí từ trong câu; giảm thiểu thời gian gán nhãn cho các thực thể mới trong văn bản chuyên ngành.
* **Bài toán Tạo sinh văn bản (Text Generation - GEN):**
  * *Biểu diễn logic:* 
$$\text{Instruction} + \text{Context} \xrightarrow{\text{Autoregressive Generation}} \text{Target\_Text}$$
  * *Cơ chế thực tế:* Mô hình sinh từ tiếp theo dựa trên phân phối xác suất điều kiện đã học từ lượng dữ liệu khổng lồ của toàn bộ kho ngữ liệu web.
#### 3. Ý nghĩa thực tiễn & Ứng dụng ra quyết định (Slide 44 & Transcript P44)
* **Theo góc nhìn Chi phí & Tối ưu hóa chu kỳ phát triển AI:**
  * *Mục tiêu:* Cắt giảm tối đa chi phí thu thập và gắn nhãn dữ liệu thủ công (vốn chiếm phần lớn nguồn lực trong quy trình KDD truyền thống).
  * *Hành động can thiệp:* Chuyển đổi chiến lược kỹ thuật từ việc huấn luyện mô hình nhỏ riêng biệt sang tận dụng mô hình nền tảng, tập trung tối ưu hóa thiết kế lời nhắc (Prompt Engineering) và kỹ thuật sinh tăng cường (RAG).
* **Theo góc nhìn Độ linh hoạt & Năng lực tổng quát hóa:**
  * *Mục tiêu:* Triển khai nhanh chóng các ứng dụng AI đối với các bài toán mới phát sinh mà không cần thu thập tập dữ liệu mẫu lớn.
  * *Hành động can thiệp:* Áp dụng cơ chế zero-shot hoặc few-shot learning cho các tác vụ hỗ trợ khách hàng, tóm tắt dữ liệu, phân loại tài liệu theo thời gian thực.
* **Theo góc nhìn Kiến trúc hệ thống Khai phá dữ liệu hiện đại:**
  * *Mục tiêu:* Hợp nhất các đường ống phân tích phức tạp thành một hệ thống thông minh, tương tác tự nhiên.
  * *Hành động can thiệp:* Sử dụng các mô hình ngôn ngữ lớn làm giao diện điều khiển và phân tích cấp cao, kết hợp công cụ khai phá dữ liệu truyền thống để xử lý và trích xuất tri thức từ dữ liệu lớn đa phương thức.
### Mối quan hệ giữa Khai phá dữ liệu, Tri thức và Trí tuệ (Data Mining & Knowledge & Intelligence)

#### 1. Bản chất & Định nghĩa cốt lõi (Slide 46 & Transcript P46)
* **Phân loại nhiệm vụ:** **Mô hình hóa chuỗi giá trị tri thức (Knowledge Value Chain / Conceptual Framework)**. (→ [Towards AGI](/blog/ai-va-dev/khoa-hoc-ai-cua-tsing-hua-university/learning-module/02-towards-artificial-general-intelligence/))
* **Bản chất kỹ thuật:** 
  * Quá trình chuyển hóa phân cấp lũy tiến từ dữ liệu thô sang khả năng ra quyết định thông minh:
    $$\text{Data} \xrightarrow{\text{Cấu trúc hóa / Xử lý}} \text{Information} \xrightarrow{\text{Khai phá quy luật}} \text{Knowledge} \xrightarrow{\text{Ra quyết định thực thi}} \text{Intelligence}$$
  * *Data (Dữ liệu):* Các bản ghi hoặc dữ kiện thô, rời rạc chưa qua xử lý.
  * *Information (Thông tin):* Dữ liệu đã được thu thập, làm sạch và tổ chức có cấu trúc rõ ràng.
  * *Knowledge (Tri thức):* Các mẫu hình (patterns), quy luật kết hợp tiềm ẩn được rút trích từ thông tin.
  * *Intelligence (Trí tuệ / Trí thông minh nghiệp vụ):* Khả năng vận dụng tri thức để ra quyết định chiến lược và hành động trong thực tế.
* **Điểm khác biệt / Điểm đặc trưng:** 
  * Khai phá dữ liệu (Data Mining) đóng vai trò là động cơ cốt lõi thực hiện bước nhảy vọt quan trọng nhất: chuyển dịch từ tầng Thông tin (bị động) sang Tri thức và Trí tuệ (chủ động kiến tạo giá trị).

#### 2. Phân tích các ví dụ minh họa (Slide 46 & Transcript P46)
* **Phân tích hành vi bán lẻ trong siêu thị (Retail / Basket Analysis):**
  * *Biểu diễn logic:* 
    $$\text{Giao dịch rời rạc} \rightarrow \text{Bảng lịch sử mua hàng} \rightarrow (\{\text{CD Player}\} \rightarrow \{\text{CDs}\}) \rightarrow \text{Chiến lược định giá chéo}$$
  * *Cơ chế thực tế:* Các lượt mua hàng đơn lẻ (Data) được tổng hợp thành bảng hồ sơ giao dịch (Information). Qua thuật toán khai phá luật kết hợp, hệ thống phát hiện khách mua đầu đĩa CD có xu hướng mua đĩa nhạc CD (Knowledge). Doanh nghiệp ứng dụng bằng cách giảm giá đầu đọc CD để kích cầu tiêu thụ đĩa CD với biên lợi nhuận cao hơn (Intelligence).
* **Đúc kết tri thức sức khỏe cộng đồng (Healthcare / Nutrition):**
  * *Biểu diễn logic:* 
    $$\text{Thuộc tính trái cây} \rightarrow \text{Bảng giá trị dinh dưỡng} \rightarrow \text{"An apple a day keeps the doctor away"} \rightarrow \text{Chế độ ăn phòng bệnh}$$
  * *Cơ chế thực tế:* Các thành phần hóa học của táo (Data) được ghi nhận thành chỉ số dinh dưỡng cụ thể (Information). Qua quá trình quan sát y tế lâu dài, con người khái quát hóa thành nguyên lý ăn táo giúp nâng cao đề kháng (Knowledge), từ đó định hình lối sống lành mạnh và chính sách y tế dự phòng (Intelligence).
#### 3. Ý nghĩa thực tiễn & Ứng dụng ra quyết định (Slide 46 & Transcript P46)
* **Theo góc nhìn Phát huy giá trị dữ liệu lớn (Value Realization):**
  * *Mục tiêu:* Khắc phục tình trạng "ngập trong dữ liệu nhưng đói tri thức" (drowning in data, but starving for knowledge).
  * *Hành động can thiệp:* Không dừng lại ở việc lưu trữ dữ liệu thụ động, mà đầu tư vào các đường ống KDD để biến tài nguyên dữ liệu thô thành tri sản có thể khai thác trực tiếp.
* **Theo góc nhìn Trí tuệ doanh nghiệp (Business Intelligence):**
  * *Mục tiêu:* Chuyển đổi báo cáo mô tả quá khứ thành hành động đón đầu xu hướng tương lai.
  * *Hành động can thiệp:* Ứng dụng tri thức khai phá được vào việc xây dựng gói sản phẩm (bundling), tối ưu hóa tồn kho và tự động hóa các chiến dịch tiếp thị theo thời gian thực.
* **Theo góc nhìn Xu thế công nghệ:**
  * *Mục tiêu:* Xây dựng các hệ thống AI có khả năng tự động hóa chu trình từ dữ liệu đến hành động.
  * *Hành động can thiệp:* Tích hợp các mô hình học sâu và mô hình ngôn ngữ lớn (LLMs) vào chuỗi giá trị nhằm tăng tốc quá trình chuyển hóa từ dữ liệu đa phương thức sang các quyết định thông minh tức thì.
### Application Example: Recommendation System
- Recommendation System: the systems that are designed to recommend things to the user based on many different factors. Why is it necessary? (→ [AI in Education](/blog/ai-va-dev/khoa-hoc-ai-cua-tsing-hua-university/learning-module/13-artificial-intelligence-in-education/))
	- For users: help users discover items they might not have found by themselves
	- For companies: attract more users and help companies to sell more products and services
- Applications: videos, news, music, goods, social networks, books, queries, restaurants,...
### Hệ thống gợi ý (Recommendation System)

#### 1. Bản chất & Định nghĩa cốt lõi (Slide 47, 48 & Transcript P47, P48)
* **Phân loại nhiệm vụ:** **Dự báo kết hợp Mô tả (Predictive & Descriptive / Information Filtering Task)**.
* **Bản chất kỹ thuật:** 
  * Là hệ thống lọc thông tin thông minh nhằm đề xuất các mục (items) phù hợp cho người dùng dựa trên việc tổng hợp nhiều chiều đặc trưng:
    $$R = \mathcal{F}(u, e, i)$$
    * Trong đó: $R$ là kết quả gợi ý (Recommendation), $u$ là đặc trưng người dùng (User features: sở thích, hành vi lịch sử), $e$ là đặc trưng môi trường/ngữ cảnh (Environment features: thời gian, địa điểm, ngữ cảnh sử dụng), và $i$ là đặc trưng mục tiêu (Item features: thể loại, độ phổ biến, từ khóa).
  * Tích hợp đồng thời nhiều kỹ thuật khai phá dữ liệu cốt lõi: Biểu diễn dữ liệu (Data Representation), Tính toán độ tương đồng (Similarity Calculation), Phân lớp (Classification), Gom cụm (Clustering), Lọc cộng tác (Collaborative Filtering), và Khai phá luật kết hợp (Association Mining).
* **Điểm khác biệt / Điểm đặc trưng:** 
  * Thiết lập mối quan hệ tương tác hai chiều (bidirectional interaction) giữa người dùng và mục tiêu: hành vi tương tác của người dùng định hình độ phổ biến và thuộc tính của mục, trong khi đặc tính của mục thu hút các nhóm người dùng tương ứng.

#### 2. Phân tích các ví dụ minh họa (Slide 47, 48 & Transcript P47, P48)
* **Mô hình hóa cá nhân hóa người dùng & mục (User & Item Modeling):**
  * *Biểu diễn logic:* 
    $$(\text{User\_Profile}_u, \text{Item\_Catalog}_i) \xrightarrow{\text{Collaborative Filtering / Similarity}} \text{Top\_K}(\text{Items})$$
  * *Cơ chế thực tế:* Hệ thống phân tích lịch sử tương tác (ví dụ: xem video công nghệ) để xây dựng hồ sơ người dùng, đồng thời trích xuất từ khóa/thể loại của từng nội dung số (video, phim, âm nhạc, sản phẩm) nhằm ghép nối chính xác nhu cầu tiềm ẩn với nội dung sẵn có.
* **Gợi ý thích ứng theo ngữ cảnh môi trường (Context-aware Recommendation):**
  * *Biểu diễn logic:* 
    $$\mathcal{F}(u, e_{\text{commute}}, i) \rightarrow \text{Music\_List}; \quad \mathcal{F}(u, e_{\text{evening}}, i) \rightarrow \text{Movies}; \quad \mathcal{F}(u, e_{\text{weekend\_outdoor}}, i) \rightarrow \text{Shopping/Restaurants}$$
  * *Cơ chế thực tế:* Nhu cầu thay đổi linh hoạt theo yếu tố môi trường $e$: hệ thống tự động ưu tiên gợi ý nghe nhạc trong giờ đi làm buổi sáng, phim ảnh vào buổi tối tại nhà, hoặc đề xuất hàng quán mua sắm khi người dùng ra ngoài vào cuối tuần.

#### 3. Ý nghĩa thực tiễn & Ứng dụng ra quyết định (Slide 47, 48 & Transcript P47, P48)
* **Theo góc nhìn Trải nghiệm người dùng (User Side):**
  * *Mục tiêu:* Giải quyết vấn đề quá tải thông tin, giúp người dùng dễ dàng khám phá các nội dung/sản phẩm giá trị mà họ có thể không tự tìm thấy.
  * *Hành động can thiệp:* Cung cấp bảng tin feeds, danh sách phát tự động hoặc danh mục đề xuất cá nhân hóa trên các nền tảng mạng xã hội, phát trực tuyến và thương mại điện tử.
* **Theo góc nhìn Doanh nghiệp & Thương mại (Business Side):**
  * *Mục tiêu:* Thu hút, duy trì người dùng và tối đa hóa chuyển đổi doanh số bán hàng và dịch vụ.
  * *Hành động can thiệp:* Tối ưu hóa thuật toán bán chéo (cross-selling) và nâng cao thời gian giữ chân (retention time) trên các ứng dụng như Douyin, Bilibili, Taobao hay các hệ thống tin tức, âm nhạc, sách.
* **Theo góc nhìn Kiến trúc Kỹ thuật dữ liệu:**
  * *Mục tiêu:* Kết hợp đồng thời các luồng dữ liệu thời gian thực và dữ liệu lịch sử để phản hồi tức thì với độ trễ thấp nhất.
  * *Hành động can thiệp:* Ứng dụng mô hình hàm $\mathcal{F}(u, e, i)$ đa tầng để tính điểm và xếp hạng lại (re-ranking) theo thời gian thực dựa trên thay đổi của ngữ cảnh môi trường và phản hồi tương tác gần nhất của người dùng.
## Major issues of data mining
### Top 10 algorithms in data mining
- Linear Regression
- Logistic Regression
- CART-Decision Tree
- Naive Bayes (→ [Error Rates and the Bayes Classifier](/blog/sinh-hoc/bioinformatics/a-statistics-and-biostatistics/iii-statistical-models-and-method/11-error-rates-and-the-bayes-classifier/))
- KNN (K-Nearest Neighbors)
- Apriori
- K-means
- PCA (Principal Component Analysis)
- Random Forests
- Boosting with Adaboost
#### 1. Bản chất & Định nghĩa cốt lõi (Slide 56 & Transcript P56)
* **Phân loại nhiệm vụ:** **Hợp nhất Dự báo & Mô tả (Predictive & Descriptive Foundations)**.
* **Bản chất kỹ thuật:** 
  * Bộ 10 thuật toán kinh điển và có tầm ảnh hưởng lớn nhất trong lịch sử khai phá dữ liệu, cung cấp nền móng toán học và tính toán cho hầu hết các bài toán phân tích thực tế:
    $$\mathcal{A} = \{\text{Linear Regression}, \text{Logistic Regression}, \text{CART}, \text{Naïve Bayes}, \text{KNN}, \text{Apriori}, \text{K-means}, \text{PCA}, \text{Random Forests}, \text{Adaboost}\}$$
  * Bao quát toàn diện các phương pháp:
    1. *Hồi quy & Xác suất (Regression & Probabilistic Models):* Linear Regression ($y = w^T x + b$), Logistic Regression ($P(Y=1|X) = \sigma(w^T x)$), Naïve Bayes (Định lý Bayes kết hợp giả định độc lập có điều kiện $P(C|X) \propto P(C)\prod P(x_i|C)$).
    2. *Dựa trên cây & Tập hợp (Tree-based & Ensembles):* CART (Cây quyết định phân lớp/hồi quy chia nhánh theo chỉ số Gini/MSE), Random Forests (Bagging kết hợp lấy mẫu thuộc tính ngẫu nhiên), Boosting with Adaboost (Tập hợp tuần tự các bộ phân loại yếu bằng cách tăng trọng số cho các mẫu bị đoán sai).
    3. *Học dựa trên mẫu & Khoảng cách (Instance-based):* KNN (K-Nearest Neighbors - gán nhãn dựa trên đa số phiếu từ $k$ láng giềng gần nhất theo khoảng cách Minkowski/Euclidean).
    4. *Khai phá luật & Gom cụm (Unsupervised / Descriptive):* Apriori (Khai phá tập mục thường xuyên qua nguyên lý monotonicity: mọi tập con của tập mục thường xuyên đều phải thường xuyên), K-means (Tối thiểu hóa phương sai nội cụm $J = \sum \|x_i - \mu_k\|^2$).
    5. *Giảm chiều dữ liệu (Dimensionality Reduction):* PCA (Principal Component Analysis - chiếu dữ liệu lên các vector riêng trực giao tối đa hóa phương sai phân tán).
* **Điểm khác biệt / Điểm đặc trưng:** 
  * Đây là bộ công cụ nền tảng chuẩn mực (benchmark toolkit); việc chọn thuật toán phụ thuộc trực tiếp vào bản chất nhãn (có nhãn hay không nhãn), loại thuộc tính (liên tục hay rời rạc), và mục tiêu bài toán (giải thích tri thức hay tối ưu hóa độ chính xác dự báo).
#### 2. Phân tích các ví dụ minh họa (Slide 56 & Transcript P56)
* **Nhóm bài toán Dự báo & Phân lớp / Hồi quy (Supervised Learning):**
  * *Biểu diễn logic:* 
    * *Dự báo số lượng liên tục (Linear Regression, CART Regression):* $$X \rightarrow y \in \mathbb{R}$$
    * *Phân lớp rời rạc (Logistic Regression, CART, Naïve Bayes, KNN):* $$X \rightarrow C \in \{0, 1\} \text{ hoặc } \{C_1, \dots, C_k\}$$
    * *Mô hình nâng cao độ chính xác (Random Forests, Adaboost):* $$H(X) = \text{sign}\left(\sum_{t=1}^T \alpha_t h_t(X)\right)$$
  * *Cơ chế thực tế:* Dự đoán nguy cơ rời mạng (churn), xếp hạng rủi ro tín dụng hoặc dự báo giá sản phẩm bằng cách kết hợp nhiều cây quyết định yếu để tạo thành mô hình bền vững trước hiện tượng quá khớp (overfitting).
* **Nhóm bài toán Khám phá mẫu & Tối ưu biểu diễn (Unsupervised Learning):**
  * *Biểu diễn logic:* 
    * *Phân nhóm khách hàng (K-means):* $$\mathcal{D} \rightarrow \{C_1, \dots, C_k\}$$
    * *Khai phá giỏ hàng (Apriori):* $$I_A \rightarrow I_B \quad (\text{với } \text{Support} \ge s_{\min}, \text{Confidence} \ge c_{\min})$$
    * *Nén dữ liệu & Khử nhiễu (PCA):* $$X_{D \times N} \xrightarrow{\text{PCA}} Z_{d \times N} \quad (d \ll D)$$
  * *Cơ chế thực tế:* K-means tự động phân khúc người dùng theo thói quen tương tác; Apriori trích xuất combo hàng hóa đồng xuất hiện; PCA giảm bớt hàng trăm chiều cảm biến về vài chiều chủ đạo trước khi đưa vào mô hình học máy.
#### 3. Ý nghĩa thực tiễn & Ứng dụng ra quyết định (Slide 56 & Transcript P56)
* **Theo góc nhìn Thiết kế đường ống giải thuật (Algorithm Selection Strategy):**
  * *Mục tiêu:* Thiết lập giải pháp phù hợp với tài nguyên và đặc thù bài toán kinh doanh.
  * *Hành động can thiệp:* Bắt đầu với các mô hình có khả năng diễn giải cao (Linear/Logistic Regression, CART) để thấu hiểu quan hệ nguyên nhân - kết quả; sau đó chuyển dịch sang các mô hình tập hợp (Random Forests, Boosting) nếu ưu tiên tối đa hóa độ chính xác thử nghiệm.
* **Theo góc nhìn Xử lý thách thức Dữ liệu lớn (Big Data Scalability):**
  * *Mục tiêu:* Kiểm soát độ phức tạp tính toán và chống lại "lời nguyền số chiều" (Curse of Dimensionality).
  * *Hành động can thiệp:* Áp dụng PCA để nén dữ liệu tiền xử lý, kết hợp tính chất song song hóa của Random Forests hoặc tốc độ tính toán của Naïve Bayes khi triển khai trên hệ thống phân tán quy mô lớn.
* **Theo góc nhìn Xây dựng hệ thống học máy hoàn chỉnh:**
  * *Mục tiêu:* Tạo liên kết khép kín giữa mô tả hiện trạng và hành động tương lai.
  * *Hành động can thiệp:* Phối hợp kỹ thuật gom cụm (K-means) để phân nhóm đối tượng, dùng Apriori trích xuất hành vi và dùng Adaboost/Random Forests để đưa ra quyết định gợi ý hoặc can thiệp cá nhân hóa tức thì.
![Ảnh chụp Màn hình 2026-09-23 lúc 23.53.13](/vault-assets/anh-chup-man-hinh-2026-09-23-luc-23-53-13-cbcd2f25.png)
### Major Data Mining Issues
- **Data scale and complexity:** Massive Data, Data Diversity. We are no longer dealing with small, neat datasets. Instead, we face massive volumes of data with incredible diversity in formats and sources. This sheer size and variety make traditional processing methods insufficient.
- **Model Complexity:** Large Model Parameters, Model Interpretability. Modern models often involve a vast number of parameters, which can be difficult to manage.More importantly, as these models grow more complex, ensuring their interpretability becomes a critical challenge. We need to understand not just what the model predicts, but why it makes those predictions.
- **Computational resource limitations:** High-Performance Computing Needs, Energy Consumption. Training and running these sophisticated models require high-performance computing capabilities. However, we must also be mindful of energy consumption, balancing performance with sustainability and cost.
- **Data quality and bias:** Data noise, Data bias. Real-world data is rarely perfect; it often contains noise and inherent biases. If we do not carefully handle these issues, our models may learn incorrect patterns or perpetuate unfair biases, leading to unreliable results.
- **Algorithm efficiency and scalability:** Parallel, distributed, stream, and incremental mining methods. To handle the massive data scales mentioned earlier, we cannot rely on simple sequential processing. We need to develop and utilize parallel, distributed, streaming, and incremental mining methods that can scale effectively as data grows.
- **Cross-domain knowledge and integration:** This means we cannot rely solely on algorithms; we need to incorporate specific domain expertise and integrate insights from multiple disciplines to make our models truly effective.
- **Real-time and dynamism:** In many modern applications, data is not static. We need systems capable of processing information in real time and adapting quickly to dynamic, ever-changing environments.
- **User interaction:** Data mining is not just about backend computation; it is also about how users engage with the results and how we design intuitive interfaces for exploration.
- **Data privacy and model security:** As we handle more sensitive information, ensuring that personal data remains private and that our models are secure against attacks is paramount.
### A Brief History of Data Mining Society
* **1989 IJCAI Workshop on Knowledge Discovery in Databases (Piatetsky-Shapiro)**: Knowledge Discovery in Databases (G. Piatetsky-Shapiro and W. Frawley, 1991)
* **1991-1994 Workshops on Knowledge Discovery in Databases**: Advances in Knowledge Discovery and Data Mining (U. Fayyad, G. Piatetsky-Shapiro, P. Smyth, and R. Uthurusamy, 1996)
* **1995-1998 International Conferences on Knowledge Discovery in Databases and Data Mining (KDD’95-98)**: Journal of Data Mining and Knowledge Discovery (1997)
* **1998 ACM SIGKDD, SIGKDD’1999-2001 conferences, and SIGKDD Explorations**
* **More conferences on data mining**: PAKDD (1997), PKDD (1997), SIAM-Data Mining (2001), (IEEE) ICDM (2001), WSDM(2008), etc.
### Conferences and Journals on Data Mining
* **KDD Conferences**
	* ACM SIGKDD Int. Conf. on Knowledge Discovery in Databases and Data Mining (KDD)
	* SIAM Data Mining Conf. (SDM)
	* (IEEE) Int. Conf. on Data Mining (ICDM)
	* Conf. on Principles and practices of Knowledge Discovery and Data Mining (PKDD)
	* Pacific-Asia Conf. on Knowledge Discovery and Data Mining (PAKDD)
* **Other related conferences**
	* Databases: ACM SIGMOD, VLDB, ICDE
	* AI: IJCAI, AAAI, ICML, ACL
	* Web: WWW, SIGIR, WSDM
* **Journals**
	* Data Mining and Knowledge Discovery (DAMI or DMKD)
	* IEEE Trans. On Knowledge and Data Eng. (TKDE)
	* KDD Explorations
* **Sources:**  KDnuggets, Kaggle
# Chapter 2: Get know your data

# Chapter 3: Data preprocessing

# Chapter 4: Mining Association Rules in Large Databases

# Chapter 5: Classification

# Chapter 6: Cluster Analysis
